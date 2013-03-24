## Chrome Inspector Detector

A simple utility for detecting whether or not the Chrome Inspector is open or docked.

Simply call `chrome.inspector.detector()` and you will be returned one of the following three objects:

- When the inspector is opened and docked: `{ opened: true, docked: true }`
- When the inspector is opened and in a separate window: `{ opened: true, docked: false }`
- When the inspector is closed: `{ opened: false, docked: false }`

Please note: 
  - The `docked` response is not accurate if other chrome is visible, including the download bar.

Credit goes to [this Stackoverflow answer](http://stackoverflow.com/a/15567735/131898) for the profiler technique.

### [Demo](http://adamschwartz.co/chrome-inspector-detector)
