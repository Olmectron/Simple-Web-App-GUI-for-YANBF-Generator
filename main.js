// Modules to control application life and create native browser window
const electron = require("electron")
const {app, BrowserWindow, Menu} = require('electron')
const path = require('path')

const url = require('url')
var PROTOCOL = 'file';
const WEB_FOLDER = 'public_web';

var testing=true;
var hideToolbarFull=false;

function setupInterceptFiles(){
  electron.protocol.interceptFileProtocol(PROTOCOL, (request, callback) => {
    // // Strip protocol
    let url = request.url.substr(PROTOCOL.length + 1);
    let originalUrl=url;
//    console.warn("ORIGINAL",originalUrl);
    // Build complete path for node require function
    url = path.join(__dirname, WEB_FOLDER, url);
  
    // Replace backslashes by forward slashes (windows)
    // url = url.replace(/\\/g, '/');
    url = path.normalize(url);
    if(originalUrl.startsWith("///C:")){

     // console.log(originalUrl.replace("///",""));
      callback({path: originalUrl.replace("///","")});
      return;
    }
//    console.log(url);
    var splitted=url.split("\\");
    if(splitted[splitted.length-1].indexOf(".")==-1){
      var preUrl="index.html";
      preUrl = path.join(__dirname, WEB_FOLDER, preUrl);
  
      // Replace backslashes by forward slashes (windows)
      // url = url.replace(/\\/g, '/');
      preUrl = path.normalize(preUrl);
    //  console.log("PREURL",preUrl);
      callback({path: preUrl});
    }
    else{
      callback({path: url});

    }
  });
}
function createWindow () {
  setupInterceptFiles();
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    nodeIntegration:true,
    webSecurity: false,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
          webSecurity: false,
          contextIsolation: false, 
          enableRemoteModule: true
      
    }
  })


  if(hideToolbarFull){
    Menu.setApplicationMenu(null)

  }




  // and load the index.html of the app.
//  mainWindow.loadFile('index.html')

if(testing){
  mainWindow.loadURL("http://localhost:8081")
}
else{
  mainWindow.loadURL(url.format({
    pathname: 'index.html',
    protocol: PROTOCOL + ':',
    slashes: true
  }));
}


//mainWindow.loadURL("http://localhost:8081")
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
