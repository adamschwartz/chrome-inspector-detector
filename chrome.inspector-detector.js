(function(){

    if (!window.chrome || !window.console) {
        return alert('Chrome Inspector Helpers only supported in Google Chrome.');
    }

    window.chrome.inspector = window.chrome.inspector || {};

    // Account for the height of the omnibar and bookmarks bar
    // Can be overridden by setting window.chrome.inspector._windowHeightOffset yourself
    // http://stackoverflow.com/a/7530254/131898
    window.chrome.inspector._windowHeightOffset = window.chrome.inspector._windowHeightOffset || 200;

    window.chrome.inspector.detector = function () {
        // First try detecting the simple way of comparing
        // the inner and outer window sizes
        if (window.outerHeight > (window.innerHeight + window.chrome.inspector._windowHeightOffset) || window.outerWidth > window.innerWidth) {
            return {
                open: true,
                docked: true
            };
        }

        // If that doesn't work then the inspector is not docked
        // so instead try running a profile to see if it's open
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
            return {
                open: true,
                docked: false
            };
        } else {
            return {
                open: false
            };
        }
    };

})();