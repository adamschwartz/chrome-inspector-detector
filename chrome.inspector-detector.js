(function(){

    if (!window.chrome || !window.console) {
        return alert('Chrome Inspector Helpers only supported in Google Chrome.');
    }

    window.chrome.inspector = window.chrome.inspector || {};

    // Mar 23 2013
    // Detects if the Chrome Inspector is open
    // http://stackoverflow.com/a/15567735/131898
    window.chrome.inspector.isOpen = function () {
        var existingProfiles = console.profiles.length;
        console.profile();
        console.profileEnd();

        // Mar 23 2013
        // Note that this has no effect when the inspector
        // setting "Preserve Log upon navigation" is true
        // http://web.archiveorange.com/archive/v/fwvdeLnVHqVyTY2UZiaB
        if (console.clear) {
            console.clear();
        }

        return console.profiles.length > existingProfiles;
    };

})();