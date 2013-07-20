## Chrome Inspector Detector

![Deprecation warning](https://f.cloud.github.com/assets/154613/830510/69696890-f159-11e2-85f4-b35698ca6a00.png)

________

### [Demo](http://adamschwartz.co/chrome-inspector-detector)

A simple utility for detecting whether or not the Chrome Inspector is open or docked.

Simply call `chrome.inspector.detector()` and you will be returned one of the following three objects:

- When the inspector is opened and docked: `{ opened: true, docked: true }`
- When the inspector is opened and in a separate window: `{ opened: true, docked: false }`
- When the inspector is closed: `{ opened: false, docked: false }`

You can also set up a watcher to watch for changes to the inspector state:

    chrome.inspector.detector.watch(function(status){
        document.body.style.background = status.open ? 'red' : '';
    });

[Example on jsFiddle](http://jsfiddle.net/adamschwartz/CZ3r6/show/light/)

Note: In order for docking detection to work, you must have `html, body { height: 100%; width: 100% }` in your CSS (or something similar) such that when the Inspector is closed `document.height === document.body.clientHeight` is `true`.

### Things you could do with this that are not malicious :P

- You're developing a JS game and you want to pause the game whenever you open the console so that it's easier to adjust CSS without it constantly re-rerendering.
- You're designing a site and want to display a typography grid overlay whenever inspecting to aid in design.
- You want a few dom nodes or JS objects to be `console.log`'d whenever you open the console for up-to-date information.

Credit goes to [this Stackoverflow answer](http://stackoverflow.com/a/15567735/131898) for the profiler technique.
