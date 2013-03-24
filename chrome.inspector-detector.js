(function(){

    if (!window.chrome || !window.console) {
        return ((window.console && console.log) || alert)('Chrome Inspector Helpers only supported in Google Chrome.');
    }

    window.chrome.inspector = window.chrome.inspector || {};

    // Account for the height of the omnibar and bookmarks bar
    // Can be overridden by setting window.chrome.inspector._windowHeightOffset yourself
    // http://stackoverflow.com/a/7530254/131898
    window.chrome.inspector._windowHeightOffset = window.chrome.inspector._windowHeightOffset || window.outerHeight - window.innerHeight;

    var TESTS = {};
    window.chrome.inspector.tests = TESTS;

    TESTS.opened = {
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
        },
        commandLineAPI: function(){
            return !!console._commandLineAPI;
        }
    };

    TESTS.docked = {
        height: function(){
            // First try detecting by comparing the inner and outer window sizes
            // This is not always accurate due to the many issues posted here:
            // https://news.ycombinator.com/item?id=5430882
            if (window.outerHeight > (window.innerHeight + window.chrome.inspector._windowHeightOffset) || window.outerWidth > window.innerWidth) {
                return true;
            }

            return false;
        }
    };

    window.chrome.inspector.detector = function (options) {
        var results, testName, test;

        options = options || {};

        // `options.tests` should be an object mapping a state to be looked for to
        // a specific test to execute to test for it.
        options.tests = options.tests || {
            opened: 'commandLineAPI',
            docked: 'height'
        };

        results = {};

        for (var testType in options.tests){
            // The tests can be specified as keys in the `window.chrome.inspector.tests[testType]` object,
            // or as functions.  Specify false (or don't include the key) to not run that
            // class of test.
            testName = options.tests[testType];
            if (typeof testName == 'string')
                test = TESTS[testType][testName];
            else if (typeof testName == 'function');
                test = testName;
            else
                continue;

            results[testType] = test(); 
        }

        return results;
    };

})();
