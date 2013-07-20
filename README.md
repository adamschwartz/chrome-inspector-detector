#### Deprecation warning:

> As of July 16, 2013, this library no longer works in the latest Google Chrome Canary builds due to a [change to `chrome.profiles`](https://codereview.chromium.org/15816002). Once the change makes it to Stable, this library will be deprecated. If you want to be mad, don't be mad at [paulirish](http://github.com/paulirish). He [gave us a chance to prove our case](https://github.com/adamschwartz/chrome-inspector-detector/issues/11), but we didn't make it strong enough. __But there is hope!__ If we band together, we will get this functionality back through a [Chrome Extension](https://github.com/adamschwartz/chrome-inspector-detector/issues/8). Progress [has already been made](https://groups.google.com/a/chromium.org/d/msg/chromium-extensions/4Ge-51oHiZI/Awzhrzdf2R8J). – Adam

## Chrome Inspector Detector

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
