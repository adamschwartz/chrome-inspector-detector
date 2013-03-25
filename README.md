## Chrome Inspector Detector

A simple utility for detecting whether or not the Chrome Inspector is open or docked.

Simply call `chrome.inspector.detector()` and you will be returned one of the following three objects:

- When the inspector is opened and docked: `{ opened: true, docked: true }`
- When the inspector is opened and in a separate window: `{ opened: true, docked: false }`
- When the inspector is closed: `{ opened: false, docked: false }`

Note: In order for docking detection to work, you must have `html, body { height: 100%; width: 100% }` in your CSS (or something similar) such that when the Inspector is closed `document.height === document.body.clientHeight` is `true`.

### Things you could do with this that are not malicious :P

- You're developing a JS game and you want to pause the game whenever you open the console so that it's easier to adjust CSS without it constantly re-rerendering.
- You're designing a site and want to display a typography grid overlay whenever inspecting to aid in design.
- You want a few dom nodes or JS objects to be `console.log`'d whenever you open the console for up-to-date information.

Credit goes to [this Stackoverflow answer](http://stackoverflow.com/a/15567735/131898) for the profiler technique.

### [Demo](http://adamschwartz.co/chrome-inspector-detector)
