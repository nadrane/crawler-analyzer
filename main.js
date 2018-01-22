const path = require("path");
const url = require("url");
const electron = require("electron");
const { ipcMain } = electron;
const bluebird = require("bluebird");
let fs = require("fs");
fs = bluebird.promisifyAll(fs);

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

require("electron-reload")(__dirname, {
  // Note that the path to electron may vary according to the main file
  electron: require(`${__dirname}/node_modules/electron`)
});

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({ width: 800, height: 600 });

  // and load the index.html of the app.
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "index.html"),
      protocol: "file:",
      slashes: true
    })
  );

  mainWindow.webContents.openDevTools();

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on("closed", function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function() {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

function showDialogueAndGetFilePaths() {
  const { dialog } = require("electron");
  return dialog.showOpenDialog({ properties: ["openFile", "multiSelections"] });
}

function getAndReadLogFiles() {
  const filePaths = showDialogueAndGetFilePaths();
  return bluebird.map(filePaths, path => {
    return bluebird.props({ path, data: fs.readFileAsync(path) });
  });
}

ipcMain.on("load-file", event => {
  getAndReadLogFiles().then(logs => {
    logs.forEach(log => {
      const jsonLog = log.data
        .toString()
        .split("\n")
        .filter(line => line)
        .map(line => JSON.parse(line));

      const fileName = path.parse(log.path).name;
      event.sender.send("file-loaded", { fileName, jsonLog });
    });
  });
});
