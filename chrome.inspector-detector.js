(function(){

    if (!window.chrome || !window.console) {
        return ((window.console && console.log) || alert)('Chrome Inspector Helpers only supported in Google Chrome.');
    }

    window.chrome.inspector = window.chrome.inspector || {};

    var TESTS = {};
    window.chrome.inspector.tests = TESTS;

    TESTS.open = {
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
    };

    TESTS.docked = {
        height: function(){
            // First try detecting by comparing the inner and outer window sizes
            // This is not always accurate due to the many issues posted here:
            // https://news.ycombinator.com/item?id=5430882

            var zoom = document.width / (document.body.clientWidth + parseInt(getComputedStyle(document.body)['margin-left'], 10) + parseInt(getComputedStyle(document.body)['margin-left'], 10));

            if (window.outerHeight > 1 + Math.ceil((zoom * window.innerHeight) + window.chrome.inspector._windowHeightOffset) ||
                window.outerWidth > 1 + Math.ceil(zoom * window.innerWidth)) {

                return true;
            }

            return false;
        }
    };

    // Account for the height of the omnibar and bookmarks bar
    // Can be overridden by setting window.chrome.inspector._windowHeightOffset yourself
    // http://stackoverflow.com/a/7530254/131898
    //
    // This always uses the profile test right now, but should be configurable in the future.
    window.chrome.inspector._windowHeightOffset = window.chrome.inspector._windowHeightOffset || (TESTS.open.profile() ? 200 : window.outerHeight - window.innerHeight);

    window.chrome.inspector.detector = function (options) {
        var state, testName, test, tests;

        options = options || {};

        // `options.tests` should be an object mapping a state to be looked for to
        // a specific test to execute to test for it.
        options.tests = options.tests || {
            open: 'profile',
            docked: 'height'
        };

        tests = {};
        for (var testType in options.tests){
            // The tests can be specified as keys in the `window.chrome.inspector.tests[testType]` object,
            // or as functions.  Specify false (or don't include the key) to not run that
            // class of test.
            testName = options.tests[testType];
            if (typeof testName == 'string')
                test = TESTS[testType][testName];
            else if (typeof testName == 'function')
                test = testName;
            else
                continue;

            tests[testType] = test; 
        }

        state = {};

        state.open = tests.open && tests.open();
        state.docked = state.open && tests.docked && tests.docked();

        return state;
    };

})();
