(function(){

    if (!window.chrome || !window.console) {
        return alert('Chrome Inspector Helpers only supported in Google Chrome.');
    }

    window.chrome.inspector = window.chrome.inspector || {};

    // Account for the height of the omnibar and bookmarks bar
    // Can be overridden by setting window.chrome.inspector._windowHeightOffset yourself
    // http://stackoverflow.com/a/7530254/131898
    window.chrome.inspector._windowHeightOffset = window.chrome.inspector._windowHeightOffset || window.outerHeight - window.innerHeight;

    window.chrome.inspector.detector = function (detectDocked) {
        // If detectDocked then first try detecting by comparing
        // the inner and outer window sizes
        // detectDocked was made an option due to the many issues pointed out here:
        // https://news.ycombinator.com/item?id=5430882
        if (detectDocked) {
            if (window.outerHeight > (window.innerHeight + window.chrome.inspector._windowHeightOffset) || window.outerWidth > window.innerWidth) {
                return {
                    open: true,
                    docked: true
                };
            }
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
            if (detectDocked) {
                return {
                    open: true,
                    docked: false
                };
            } else {
                return {
                    open: true
                };
            }
        } else {
            return {
                open: false
            };
        }
    };

})();