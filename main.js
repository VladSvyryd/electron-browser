const { app, BrowserWindow } = require("electron");
const path = require("path");
const url = require("url");
// Specify flash path, supposing it is placed in the same directory with main.js.
let pluginName;
switch (process.platform) {
  case "win32":
    pluginName = "plugins\\pepflashplayer.dll";
    break;
  case "darwin":
    pluginName = "PepperFlashPlayer.plugin";
    break;
  case "linux":
    pluginName = "libpepflashplayer.so";
    break;
}
app.commandLine.appendSwitch(
  "ppapi-flash-path",
  path.join(__dirname, pluginName)
);

// Optional: Specify flash version, for example, v32.0.0.330

app.commandLine.appendSwitch("ppapi-flash-version", "32.0.0.330");

app.whenReady().then(() => {
  let win = new BrowserWindow({
    title: "ElectronApp",
    width: 800,
    height: 600,
    show: false,
    backgroundColor: "#fff",
    webPreferences: {
      plugins: true,
      webviewTag: true
    }
  });
  win.loadURL(
    url.format({
      pathname: path.join(__dirname, "browser.html"),
      protocol: "file:",
      slashes: true
    })
  );
  win.on("ready-to-show", function() {
    mainWindow.show();
    mainWindow.focus();
  });
  win.maximize();
  // Something else
});
