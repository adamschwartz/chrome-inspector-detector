(function(){

    if (!window.chrome || !window.console) {
        return ((window.console && console.log) || alert)('Chrome Inspector Helpers only supported in Google Chrome.');
    }

    window.chrome.inspector = window.chrome.inspector || {};

    // Console trickery to hide endless probe messages.  Decorate logging and group methods with
    // code to detect whether we're currently in a group that the inspector detector created.
    var logMethods = [ 'info', 'warn', 'log', 'debug' , 'error' ];
    var origGroupEnd = console.groupEnd;
    var groupActive = false;
    logMethods.forEach(function(method) {
        var orig = console[method];
        console[method] = function() {
	    if(groupActive) {
                origGroupEnd.apply(console);
	        groupActive = false;
	    }
	    return orig.apply(console, arguments);
	};
    });
    var origGroupCollapsed = console.groupCollapsed;
    var groupMethods = ['group', 'groupCollapsed'];
    groupMethods.forEach(function(method) {
        var orig = console[method];
	console[method] = function() {
	    if(groupActive) {
	      origGroupEnd.apply(console);
	      groupActive = false;
	     }
	     orig.apply(console);
	};
    });
     console.groupEnd = function() {
       if(groupActive) {
           origGroupEnd.apply(console);
           groupActive = false;
       }
       origGroupEnd.apply(console);
     };


    window.chrome.inspector.tests = {

        open: {
            profile: function(){
                // Try running a profile to see if it's open
                // http://stackoverflow.com/a/15567735/131898
                var existingProfiles = console.profiles.length;
		if (!groupActive) {
                    groupActive = true;
		    origGroupCollapsed.apply(console)
                }
                console.profile('Inspector detector');
                console.profileEnd();

                if (console.profiles.length > existingProfiles) {
                    return true;
                }

                return false;
            }
        },

        docked: {
            height: function(){
                var zoom = document.width / (document.body.clientWidth + parseInt(getComputedStyle(document.body)['margin-left'], 10) + parseInt(getComputedStyle(document.body)['margin-left'], 10));

                // Try detecting by comparing the inner and outer window sizes
                if (window.outerHeight > 1 + Math.ceil((zoom * window.innerHeight) + window.chrome.inspector._windowHeightOffset) ||
                    window.outerWidth > 1 + Math.ceil(zoom * window.innerWidth)) {

                    return true;
                }

                return false;
            }
        }
    };

    // Account for the height of the omnibar and bookmarks bar
    // Can be overridden by setting window.chrome.inspector._windowHeightOffset yourself
    // http://stackoverflow.com/a/7530254/131898
    //
    // This always uses the profile test right now, but should be configurable in the future.
    if (window.chrome.inspector._windowHeightOffset === undefined)
        window.chrome.inspector._windowHeightOffset = (window.chrome.inspector.tests.open.profile() ? 200 : window.outerHeight - window.innerHeight);

    var getTests = function (spec){
        var tests = {}, testType, testName, test;

        for (testType in spec) {
            // The tests can be specified as keys in the `window.chrome.inspector.tests[testType]` object,
            // or as functions.  Specify false (or don't include the key) to not run that
            // class of test.
            testName = spec[testType];
            if (typeof testName == 'string')
                test = window.chrome.inspector.tests[testType][testName];
            else if (typeof testName == 'function')
                test = testName;
            else
                continue;

            tests[testType] = test;
        }

        return tests;
    };

    window.chrome.inspector.detector = function (options) {
        var state, tests;

        options = options || window.chrome.inspector.options || {};

        // `options.tests` should be an object mapping a state to be looked for to
        // a specific test to execute to test for it.
        options.tests = options.tests || {
            open: 'profile',
            docked: 'height'
        };

        tests = getTests(options.tests);

        state = {};
        state.open = tests.open && tests.open();
        state.docked = state.open && tests.docked && tests.docked();

        return state;
    };

})();
