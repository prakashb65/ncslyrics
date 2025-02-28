const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

let mainWindow;
let presentationWindow;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
  });

  // Load the Next.js app
  const startUrl = isDev 
    ? 'http://localhost:3000' 
    : `file://${path.join(__dirname, '../build/index.html')}`;

  mainWindow.loadURL(startUrl);

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Create window when app is ready
app.whenReady().then(createMainWindow);

// Quit when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createMainWindow();
  }
});

// Handle presentation window creation
ipcMain.on('open-presentation', (event, songId) => {
  const displays = screen.getAllDisplays();
  const externalDisplay = displays.find((display) => {
    return display.bounds.x !== 0 || display.bounds.y !== 0;
  });

  if (externalDisplay) {
    presentationWindow = new BrowserWindow({
      x: externalDisplay.bounds.x,
      y: externalDisplay.bounds.y,
      width: externalDisplay.bounds.width,
      height: externalDisplay.bounds.height,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.js')
      },
    });

    const presentationUrl = isDev
      ? `http://localhost:3000/presentation/${songId}`
      : `file://${path.join(__dirname, `../build/index.html#/presentation/${songId}`)}`;

    presentationWindow.loadURL(presentationUrl);
    presentationWindow.setFullScreen(true);

    presentationWindow.on('closed', () => {
      presentationWindow = null;
      if (mainWindow) {
        mainWindow.webContents.send('presentation-closed');
      }
    });
  }
});

// Handle lyrics section changes
ipcMain.on('change-section', (event, section) => {
  if (presentationWindow) {
    presentationWindow.webContents.send('update-section', section);
  }
}); 