import { globalShortcut, ipcMain, webContents } from 'electron'
import type { WebContents } from 'electron'
export function addKeyBoardShortcuts(webContent: WebContents) {
  let todoDomain = webContent
  // console.log('getType', webContent.getType())
  if (webContent.getType() === 'window') {
    webContent.ipc.on('activeWebContentsId', (_, id: number) => {
      // console.log('activeWebContentsId')
      todoDomain = webContents.fromId(id)
    })
  }
  webContent.on('before-input-event', (_, input) => {
    // console.log('before-input-event', webContent.getType(), input.key)
    if (input.control && input.key.toLowerCase() === 'f12') {
      webContent.openDevTools()
    } else if (input.key.toLowerCase() === 'f5') {
      // console.log(todoDomain.reload);
      // if(todoDomain) {
      //   todoDomain.reload()
      // }
      todoDomain.reload()
      // webContent.reload()
    }
  })
}

export function registerGlobalShortcutSignle() {
  ipcMain.on('registerShortcut', (e, key: string | string[]) => {
    const callback = function () {
      e.sender.send('shortcut-pressed', key)
    }
    if (Array.isArray(key)) {
      globalShortcut.registerAll(key, callback)
    } else {
      globalShortcut.register(key, callback)
    }
  })
  ipcMain.on('unregisterShortcut', (_, key?: string) => {
    if(key) {
      globalShortcut.unregister(key)
    } else {
      globalShortcut.unregisterAll()
    }
  })
}
