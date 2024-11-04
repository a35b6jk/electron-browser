/*
 * @Author: qinjianjiang 563376730@qq.com
 * @Date: 2023-11-20 13:38:24
 * @LastEditors: qinjianjiang 563376730@qq.com
 * @LastEditTime: 2024-11-04 09:53:53
 * @FilePath: \electron-git-learn\electron\main\windowManager.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { BrowserWindow, WebContents, ipcMain, webContents } from 'electron';
import path from 'node:path';
import {
  addKeyBoardShortcuts,
  registerGlobalShortcutSignle,
} from './keyboardShortcuts';
import { enable } from '@electron/remote/main';
import { readConfig } from './config';
import LockScreen  from './lockscreen';
export interface WindowInfo {
  browserWindow: BrowserWindow
  yongHuID: null | number
  yongHuXM: string | null
  yongHuZH: string | null
  yongHuMM: string | null
  parentWindowId: null | number
  lockScreen: null | LockScreen
  // activeWebView: null | WebContents
}
export type BrowserWindowId = number

const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

const winPool = new Map<BrowserWindowId, WindowInfo>()
// type WebViewOfWebContentId = number;
// const webviewMapWin = new Map<WebViewOfWebContentId, BrowserWindowId>()
const webviewMapWin = new WeakMap<WebContents, BrowserWindow>()
// const winMapWebView = new Map<BrowserWindowId, WebViewOfWebContentId[]>()

const getWinPool = function () {
  return winPool
}

const createWindow = function (
  params: Partial<{
    url: string
    parentWindowId: null | number
  }>
) {
  const { url = '', parentWindowId = null } = params
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 800,
    minHeight: 600,
    show: false,
    icon: path.resolve("extraResources/assets/logo-2.png"),
    webPreferences: {
      // preload: path.join(__dirname, 'preload.js'),
      webviewTag: true,
      nodeIntegration: true,
      contextIsolation: false,
      partition: 'persist:WYYY',
    },
    useContentSize: true,
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#356AC5',
      symbolColor: '#fff',
      height: 40,
    },
  })
  const winId = mainWindow.id
  if (parentWindowId === null) {
    const lockScreen = new LockScreen(getWinPool(), winId);
    lockScreen.initTimeOut();
    winPool.set(winId, {
      browserWindow: mainWindow,
      yongHuID: null,
      yongHuMM: null,
      yongHuXM: null,
      yongHuZH: null,
      parentWindowId,
      lockScreen,
    })
  } else {
    const winInfo = winPool.get(parentWindowId)
    if (winInfo) {
      const { yongHuID, yongHuMM, yongHuXM, yongHuZH, lockScreen } = winInfo
      winPool.set(winId, {
        browserWindow: mainWindow,
        yongHuID,
        yongHuMM,
        yongHuXM,
        yongHuZH,
        parentWindowId,
        lockScreen,
      })
    }
  }

  mainWindow.on('closed', () => {
    winPool.delete(winId)
  })

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.on('will-attach-webview', (_event, webPreferences) => {
    webPreferences.preload = path.join(__dirname, 'preload.js')
  })
  addKeyBoardShortcuts(mainWindow.webContents)
  mainWindow.webContents.on('did-attach-webview', (_, webContents) => {
    addKeyBoardShortcuts(webContents)
  })

  mainWindow.webContents.on('dom-ready', () => {
    if (url && Object.prototype.toString.call(url) === '[object String]') {
      mainWindow.webContents.send(
        'openNewTab',
        url,
        winPool.get(winId)?.yongHuID
      )
      // mainWindow.webContents.send('params', {
      //   url,
      // })
    }
  })

  if (VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(VITE_DEV_SERVER_URL)
  } else {
    mainWindow.loadFile(path.join(process.env.DIST, 'index.html'))
  }
  enable(mainWindow.webContents)
  // read()
  return mainWindow
}

const waitMainEvent = function () {
  //const store = initElectronStore(getWinPool())
  registerGlobalShortcutSignle()

  // test
  ipcMain.on('openWindow', () => {
    createWindow({})
    // enable(win.webContents)
  })
  ipcMain.on('openDevTools', (e) => {
    if (e.sender.getType() === 'webview') {
      e.sender.openDevTools()
    }
  })

  ipcMain.on('relayToWin', (e, channel: string, args) => {
    if (e.sender.getType() === 'webview') {
      const win = webviewMapWin.get(e.sender)
      if (win) {
        win.webContents.send(channel, ...args)
      }
    }
  })

  // webview 宿主页面 发送上来的  用于关闭webview 宿主页面打开的子窗口
  ipcMain.on('logoutClearHandle', (e) => {
    let win: BrowserWindow | null = null
    if (e.sender.getType() === 'webview') {
      const _win = webviewMapWin.get(e.sender)
      if (_win) {
        win = _win
      }
    } else if (e.sender.getType() === 'window') {
      const _win = BrowserWindow.fromWebContents(e.sender)
      if (_win) {
        win = _win
      }
    }
    if (win) {
      const winInfo = winPool.get(win.id)
      if (winInfo) {
        winInfo.yongHuID = null
        winInfo.yongHuMM = null
        winInfo.yongHuXM = null
        winInfo.yongHuZH = null
      }
      // 必须使用迭代器  保证边循环便删除
      const iter = winPool[Symbol.iterator]()
      while (true) {
        const next = iter.next()
        if (next.done) {
          break
        }
        const [windId, winInfo] = next.value
        if (winInfo.parentWindowId === win.id) {
          winInfo.browserWindow.close()
          winPool.delete(windId)
        }
      }
    }
  })

  // ipcMain.on('login', (e, yongHuID, url, setting) => {
  //   if (e.sender.getType() === 'webview') {
  //     const win = webviewMapWin.get(e.sender)
  //     if(win) {
  //       win.webContents.send('login', yongHuID, url, setting)
  //     }
  //   }
  // })

  // webview 宿主页面 发送上来的  用于绑定webview 和 宿主页面关系的
  ipcMain.on('registerWebView', (e, webViewOfWebContentId: number) => {
    const win = BrowserWindow.fromWebContents(e.sender)
    const webViewOfWebContent = webContents.fromId(webViewOfWebContentId)
    if (
      win &&
      webViewOfWebContent &&
      webViewOfWebContent.getType() === 'webview'
    ) {
      webviewMapWin.set(webViewOfWebContent, win)
      webViewOfWebContent.addListener('input-event', () => {
        const winInfo = winPool.get(win.id)
        if (winInfo && winInfo.lockScreen) {
          winInfo.lockScreen.resetLimitTime()
        }
      })
      webViewOfWebContent.setWindowOpenHandler((detail) => {
        // const featuresReg = /width=|height=|left=|top=+/g
        // console.log(featuresReg.test(detail.features));
        if (detail.disposition === 'foreground-tab') {
          win.webContents.send('openNewTab', detail.url)
        } else if (detail.disposition === 'new-window') {
          createWindow({
            url: detail.url,
            parentWindowId: win.id,
          })
        } else {
          return {
            action: 'allow',
          }
        }
        return {
          action: 'deny',
        }
      })
    }
  })

  ipcMain.handle('getWinWebContontId', (e) => {
    if (e.sender.getType() === 'webview') {
      // return win.webContents.id
      const win = webviewMapWin.get(e.sender)
      if (win) {
        return win.webContents.id
      }
    }
    if (e.sender.getType() === 'window') {
      const win = BrowserWindow.fromWebContents(e.sender)
      if (win) {
        return win.webContents.id
      }
    }
    return null
  })

  ipcMain.handle('readConfig', () => {
    const ret = {
      ret: 0,
      data: null,
    }
    try {
      const config = readConfig()
      ret.data = config
      return ret
    } catch (error) {
      ret.ret = -1
      return ret
    }
  })
  ipcMain.handle('isShowLogin', (e) => {
    const win = BrowserWindow.fromWebContents(e.sender)
    if (win) {
      const winInfo = winPool.get(win.id)
      if (winInfo) {
        return winInfo.parentWindowId === null
      }
    }
    // 默认打开登录页
    return true
  })
  ipcMain.handle('isExistsYonghuIdWindow', (e, yongHuId: number) => {
    const win = webviewMapWin.get(webContents.fromId(e.sender.id))
    if (win) {
      for (const [id, value] of winPool) {
        // console.log(value.yongHuId, yongHuId, value.browserWindow.id, win.id)
        if (value.yongHuID === yongHuId && id !== win.id) {
          if (!value.browserWindow.isMaximized()) {
            value.browserWindow.maximize()
            value.browserWindow.show() // 显示窗口
          }
          value.browserWindow.focus()
          return true
        }
      }
    }
    return false
  })
  ipcMain.handle('checkWindowIsLogin', (e) => {
    const win = webviewMapWin.get(webContents.fromId(e.sender.id))
    if (win) {
      const winInfo = winPool.get(win.id)
      if (winInfo && winInfo.yongHuID !== null) {
        return true
      }
    }
    return false
  })
  ipcMain.handle('getUserInfo', (e) => {
    const win = BrowserWindow.fromWebContents(e.sender)
    if (win) {
      const browserWindow = winPool.get(win.id)
      if (browserWindow) {
        return {
          yongHuXM: browserWindow.yongHuXM,
          yongHuMM: browserWindow.yongHuMM,
        }
      }
    }
    return null
  })
  ipcMain.on(
    'updateLoginInfo',
    (
      e,
      data: {
        yongHuID: number
        yongHuMM: string
        yongHuXM: string
        yongHuZH: string
      }
    ) => {
      const win = BrowserWindow.fromWebContents(e.sender)
      if (win) {
        const winInfo = winPool.get(win.id)
        if (winInfo) {
          winInfo.yongHuID = data.yongHuID
          winInfo.yongHuMM = data.yongHuMM
          winInfo.yongHuXM = data.yongHuXM
          winInfo.yongHuZH = data.yongHuZH
          if (winInfo.lockScreen) {
            winInfo.lockScreen.initTimeOut();
          }
        }
      }
    }
  )
  ipcMain.on('setLock', (e, data: boolean) => {
    if (e.sender.getType() === 'window') {
      const win = BrowserWindow.fromWebContents(e.sender)
      if (win) {
        const winInfo = winPool.get(win.id)
        if (winInfo && winInfo.lockScreen) {
          winInfo.lockScreen.setLock(data);
        }
      }
    }
  })
  ipcMain.on('getLock', (e) => {
    if (e.sender.getType() === 'window') {
      const win = BrowserWindow.fromWebContents(e.sender)
      if (win) {
        const winInfo = winPool.get(win.id)
        if (winInfo && winInfo.lockScreen) {
          e.returnValue = winInfo.lockScreen.getLock()
        }
      }
    }
    
  })
  ipcMain.on('setInitTime', (e, data: number) => {
    if (e.sender.getType() === 'window') {
      const win = BrowserWindow.fromWebContents(e.sender)
      if (win) {
        const winInfo = winPool.get(win.id)
        if (winInfo && winInfo.lockScreen) {
          winInfo.lockScreen.setInitTime(data);
        }
      }
    }
  })
  ipcMain.handle('getInitTime', (e) => {
    if (e.sender.getType() === 'window') {
      const win = BrowserWindow.fromWebContents(e.sender)
      if (win) {
        const winInfo = winPool.get(win.id)
        if (winInfo && winInfo.lockScreen) {
          return winInfo.lockScreen.getInitTime()
        }
      }
    }
    return null
  })
  ipcMain.handle('getArgv', () => {
    if (process?.argv && process?.argv.length > 1) {
      const argv = process?.argv.splice(1)
      const obj: any = {}
      argv.forEach(item => {
        const arr = item.split('=');
        if (arr.length > 1) {
          obj[arr[0]] = arr[1]
        }
      })
      return obj
    }
    return null
  })
}

const queryBrowserWindowFromWebContents = function (webContents: WebContents) {
  return webviewMapWin.get(webContents)
}
const getWindowInfo = function (winId: number) {
  return winPool.get(winId)
}
export {
  createWindow,
  waitMainEvent,
  queryBrowserWindowFromWebContents,
  getWindowInfo,
  getWinPool,
}
