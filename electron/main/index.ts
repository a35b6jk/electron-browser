/*
 * @Author: qinjianjiang 563376730@qq.com
 * @Date: 2024-10-31 08:38:58
 * @LastEditors: qinjianjiang 563376730@qq.com
 * @LastEditTime: 2024-10-31 09:59:07
 * @FilePath: \electron-git-learn\electron\main\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { app, BrowserWindow, ipcMain } from 'electron'
import { initialize, enable, isInitialized } from '@electron/remote/main'
import { createWindow, waitMainEvent } from './windowManager'
import path from 'path'

process.env.DIST = path.join(__dirname, '../dist')
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')
// const mainWindows = new Map<number, BrowserWindow>();

if (!isInitialized()) {
  initialize()
}

const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
}

app.on('second-instance', function () {
  if (app.isReady()) {
    createWindow({})
  }
})

waitMainEvent()
// app.on('browser-window-focus', () => {})
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  // if (BrowserWindow.getAllWindows().length > 1) {
  //   // 当窗口数大于1时，要主持广播通道用于窗口间的通信
  //   ipcMain.on("windowsBroadcast", (e, url: string) => {

  //   })
  // }
  ipcMain.on('focusWindow', (_, id: number) => {
    // console.log('focusWindow')
    BrowserWindow.fromId(id)?.focus()
  })
  // console.log('ready')
  const win = createWindow({})
  enable(win.webContents)
})
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
// app.on("browser-window-focus", (event, window) => {
//   console.log(window.getTitle());
  
// })
app.on('activate', () => {
  // console.log('activate')
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow({})
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
