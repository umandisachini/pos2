const { app, BrowserWindow } = require('electron');
const url = require('url');
const path = require('path');

let loadingWindow;
let mainWindow;

function createLoadingWindow() {
  loadingWindow = new BrowserWindow({
    width: 400,
    height: 200,
    frame: false,
    alwaysOnTop: true,
  });

  loadingWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'loading.html'),
    protocol: 'file:',
    slashes: true,
  }));
}

function createMainWindow() {
  return new Promise((resolve, reject) => {
    mainWindow = new BrowserWindow({
      width: 1500,
      height: 800,
      title: 'TechTrend - POS',
      autoHideMenuBar: true,
      show: false, // Start with the window hidden
    });

    mainWindow.loadURL('http://localhost:3000/dashboard');

    mainWindow.webContents.on('did-finish-load', () => {
      resolve();
    });

    mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
      reject(new Error(`Failed to load main window: ${errorDescription}`));
    });
  });
}

app.whenReady().then(() => {
  createLoadingWindow();

  createMainWindow()
    .then(() => {
      // Show the main window and close the loading window
      mainWindow.show();
      if (loadingWindow) {
        loadingWindow.close();
      }
    })
    .catch(error => {
      console.error(error);
      app.quit(); // Quit the app if there is an error loading the main window
    });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});
