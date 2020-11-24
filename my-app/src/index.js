const { app, BrowserWindow } = require('electron');
const path = require('path');
const { ipcMain } = require('electron');

const fs = require('fs');
const { Console } = require('console');
const output = fs.createWriteStream('./stdout.log');
const errorOutput = fs.createWriteStream('./stderr.log');
const logger = new Console({ stdout: output, stderr: errorOutput });
logger.log('Initialized');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
    app.quit();
}

const createWindow = () => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            enableRemoteModule: false,
            contextIsolation: true
        }
    });

    // and load the index.html of the app.
    mainWindow.loadFile(path.join(__dirname, 'index.html'));

    // Open the DevTools.
    mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

let child = undefined;
ipcMain.on('request-run-test', (event, data) => {
    if (child === undefined) {
        if (fs.existsSync('./serverout.log')) { fs.unlinkSync('./serverout.log'); }
        if (fs.existsSync('./servererr.log')) { fs.unlinkSync('./servererr.log'); }
        const serverPath = path.join(__dirname, 'server.js');
        const { fork } = require('child_process');
        child = fork(serverPath, [],
            {
                execPath: "node",
                stdio: ['pipe', 'pipe', 'pipe', 'ipc']
            });
        child.on('message', message => {
            if (message.type === "SERVER_UP") {
                logger.log('Server up');
            } else if (message.type === "TEST_RESULTS") {
                logger.log("Test successfully run, parsed email=");
                logger.log(message.data);
                event.sender.send('mainprocess-response', "Mailparser test ran successfully");
            }
        });
    }
    child.send('run-test',);
});
