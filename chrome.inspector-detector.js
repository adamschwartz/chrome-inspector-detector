(function(){

    if (!window.chrome || !window.console) {
        return ((window.console && console.log) || alert)('Chrome Inspector Helpers only supported in Google Chrome.');
    }

    window.chrome.inspector = window.chrome.inspector || {};

    // As a side effect when running console.profile() to check if the
    // inspector is open, WebKit prints a message to the console log.  This
    // clutters the log, but a workaround is to open a collapsed group (see
    // https://developer.mozilla.org/en-US/docs/DOM/console#Using_groups_in_the_console
    // ) that the messages are collected into.
    //
    // However, with this approach, we still would like console messages from
    // external code to appear.  The trick we use below is to keep track of
    // whether there is a collapsed group currently open, and decorate the
    // builtin console loging methods (log, info, warn, etc) as well as group,
    // groupCollapsed and groupEnd to close the group if this is the case.

    var logMethods, origGroupEnd, groupActive,
        origGroupCollapsed, groupMethods,
        isOpen, isDocked
    ;

    logMethods = ['info', 'warn', 'log', 'debug' , 'error'];
    origGroupEnd = console.groupEnd;
    groupActive = false;

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

    origGroupCollapsed = console.groupCollapsed;
    groupMethods = ['group', 'groupCollapsed'];

    groupMethods.forEach(function(method) {
        var orig = console[method];
        console[method] = function() {
            if (groupActive) {
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

    isOpen = function() {
        // Try running a profile to see if it's open
        // http://stackoverflow.com/a/15567735/131898
        var existingProfiles = console.profiles.length;

        if (!groupActive) {
            groupActive = true;
            origGroupCollapsed.apply(console);
        }

        console.profile('Inspector Detector');
        console.profileEnd();

        if (console.profiles.length > existingProfiles) {
            return true;
        }

        return false;
    };

    // Account for the height of the omnibar and bookmarks bar
    // Can be overridden by setting window.chrome.inspector._windowHeightOffset yourself
    // http://stackoverflow.com/a/7530254/131898
    //
    // This always uses the profile test right now, but should be configurable in the future.
    if (window.chrome.inspector._windowHeightOffset === undefined)
        window.chrome.inspector._windowHeightOffset = (isOpen() ? 200 : window.outerHeight - window.innerHeight);

    isDocked = function() {
        var zoom = document.width / (document.body.clientWidth + parseInt(getComputedStyle(document.body)['margin-left'], 10) + parseInt(getComputedStyle(document.body)['margin-left'], 10));

        // Try detecting by comparing the inner and outer window sizes
        if (window.outerHeight > 1 + Math.ceil((zoom * window.innerHeight) + window.chrome.inspector._windowHeightOffset) ||
            window.outerWidth > 1 + Math.ceil(zoom * window.innerWidth)) {

            return true;
        }

        return false;
    };

    window.chrome.inspector.detector = function () {
        var state;

        state = {};
        state.open = isOpen();
        state.docked = state.open && isDocked();

        return state;
    };

    // Watch for changes in the open/docked state.
    //
    // On change, call options.callback with arguments (new state, previous state)
    window.chrome.inspector.detector.watch = function (options) {
        var interval, check, intervalId, chain, prevState, isEqual;

        interval = options.interval || 100;

        if (!options) {
            console.log('Chrome Inspector Detector watch call requires a callback.');
            return;
        }

        if (typeof options === 'function') {
            options = {
                callback: options
            };
        }

        // An object to pass into the callback as it's context, and to return from this
        // function so the monitoring can be stopped.
        chain = {
            stop: function() {
                clearInterval(intervalId);
            }
        };

        isEqual = function(stateA, stateB) {
            var testA, testB;

            if ((typeof stateA != 'object' || typeof stateB != 'object') && stateA != stateB) {
                return false;
            }

            for (testA in stateA) {
                if (!stateA.hasOwnProperty(testA)) continue;

                for (testB in stateB) {
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

            if (!isEqual(prevState, newState)) {
                options.callback.call(chain, newState, prevState);
            }

            prevState = newState;
        };

        check();

        intervalId = setInterval(check, interval);

        return chain;
    };

})();