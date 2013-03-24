(function(){

    if (!window.chrome || !window.console) {
        return alert('Chrome Inspector Helpers only supported in Google Chrome.');
    }

    window.chrome.inspector = window.chrome.inspector || {};

    // Detects if the Chrome Inspector is open
    // http://stackoverflow.com/a/15567735/131898
    window.chrome.inspector.isOpen = function () {
        var existingProfiles = console.profiles.length;
        console.profile();
        console.profileEnd();
        if (console.clear) {
            console.clear();
        }
        return console.profiles.length > existingProfiles;
    };

})();