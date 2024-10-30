/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2023-11-14 11:30:48
 * @LastEditors: qinjianjiang 563376730@qq.com
 * @LastEditTime: 2024-10-30 15:39:43
 * @FilePath: \新建文件夹\electron\main.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// console.log('你好')
 import { app, BrowserWindow } from 'electron'
 import path from 'node:path'

// // The built directory structure
// //
// // ├─┬─┬ dist
// // │ │ └── index.html
// // │ │
// // │ ├─┬ dist-electron
// // │ │ ├── main.js
// // │ │ └── preload.js
// // │
 process.env.DIST = path.join(__dirname, '../dist')
 process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')


 let win: BrowserWindow | null
 console.log('1121212', path.join(__dirname, 'preload.js'))
// // 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
 const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

 function createWindow() {
   win = new BrowserWindow({
     icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
       preload: path.join(__dirname, 'preload.js'),
     },
   })

  if (!app.isPackaged) {
    //production
     //console.log('devmode');
     win.webContents.openDevTools();
   }


//   // Test active push message to Renderer-process.
   win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
   win.loadURL(VITE_DEV_SERVER_URL)
   } else {
    // win.loadFile('dist/index.html')
     win.loadFile(path.join(process.env.DIST, 'index.html'))
  }
 }

// // Quit when all windows are closed, except on macOS. There, it's common
// // for applications and their menu bar to stay active until the user quits
// // explicitly with Cmd + Q.
 app.on('window-all-closed', () => {
   if (process.platform !== 'darwin') {
     app.quit()
     win = null
   }
})

 app.on('activate', () => {
   // On OS X it's common to re-create a window in the app when the
   // dock icon is clicked and there are no other windows open.
   if (BrowserWindow.getAllWindows().length === 0) {
     createWindow()
   }
})

app.whenReady().then(createWindow)
