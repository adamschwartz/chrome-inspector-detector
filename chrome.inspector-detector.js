(function(){

    if (!window.chrome || !window.console) {
        return ((window.console && console.log) || alert)('Chrome Inspector Helpers only supported in Google Chrome.');
    }

    window.chrome.inspector = window.chrome.inspector || {};

    window.chrome.inspector.tests = {

        open: {
            profile: function(){
                // Try running a profile to see if it's open
                // http://stackoverflow.com/a/15567735/131898
                var existingProfiles = console.profiles.length;
                console.profile();
                console.profileEnd();

                // Note that this has no effect when the inspector
                // setting "Preserve Log upon navigation" is true
                // http://web.archiveorange.com/archive/v/fwvdeLnVHqVyTY2UZiaB (Mar 23 2013)
                if (console.clear) {
                    console.clear();
                }

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

    // Watch for changes in the open/docked state.
    //
    // On change, call options.callback with arguments (new state, previous state)
    window.chrome.inspector.detector.watch = function (options) {
        var interval, check, prevState, isEqual;

        interval = options.interval || 250;

        if (!options.callback){
            console.log("Chrome inspector detector watch call without a callback specified");
            return;
        }

        isEqual = function(stateA, stateB){
            for (var testA in stateA){
                if (!stateA.hasOwnProperty(testA)) continue;

                for (var testB in stateB){
                    if (!stateB.hasOwnProperty(testB)) continue;

                    if (stateA[testA] !== stateB[testB])
                        return false;
                }
            }

            return true;
        };

        check = function(){
            var newState;

            newState = window.chrome.inspector.detector(options);
        
            if (prevState && !isEqual(prevState, newState)){
                options.callback(newState, prevState);
            }
            
            prevState = newState;
        };

        setInterval(check, interval);
    };

})();
