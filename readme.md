BootstrApp
===
BootstrApp is an Electron starter kit preconfigured to compile LESS stylesheets and .ejs/JST templates, along with a few other basic libraries to kick-start development of your next great app!

Usage
---
Launch with `electron ./`

You can add JavaScript tasks under `./lib/jobs/`.
Jobs should export a Promise. You can include your job in `./lib/bootstrapp.js`.

`./launch.js` spawns a window of `./launch.html`, which is the entry point for building your UI.
