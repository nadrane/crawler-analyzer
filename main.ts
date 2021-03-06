const path = require("path");
const url = require("url");
const electron = require("electron");
const { ipcMain } = electron;
const bluebird = require("bluebird");
const ndjson = require("ndjson");
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
  if (!filePaths) return Promise.resolve();
  return bluebird.map(filePaths, path => {
    return bluebird.props({ path, dataStream: fs.createReadStream(path) });
  });
}

ipcMain.on("load-file", event => {
  getAndReadLogFiles().then(logs => {
    if (!logs.length) return;
    let batch = [];
    let firstLineRead = {};
    logs.forEach(log => {
      const fileName = path.parse(log.path).name;
      const jsonLog = log.dataStream
        .pipe(ndjson.parse())
        .on("data", line => {
          if (!firstLineRead[fileName]) {
            firstLineRead[fileName] = true;
            event.sender.send("env-parsed", { fileName, line });
            return;
          }
          batch.push(line);
          if (batch.length >= 1000) {
            event.sender.send("file-line-parsed", { fileName, batch });
            batch = [];
          }
        })
        .on("end", () => {
          event.sender.send("file-line-parsed", { fileName, batch });
          batch = [];
        });
    });
  });
});
