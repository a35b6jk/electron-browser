/*
 * @Author: qinjianjiang 563376730@qq.com
 * @Date: 2023-11-09 15:27:52
 * @LastEditors: qinjianjiang 563376730@qq.com
 * @LastEditTime: 2023-11-20 09:14:18
 * @FilePath: \electron-git-learn\src\store\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import Store from "electron-store"
import { ipcMain } from 'electron'
import type { BrowserWindowId, WindowInfo } from "../main/windowManager"
export const initElectronStore = (windowObj: Map<BrowserWindowId, WindowInfo>) => {
  const store = new Store<StoreState>()
  store.set('isLock', false)
  ipcMain.on('setStore', (_, key, value) => {
    console.log('main-send----------', key, value)
    store.set(key, value)
    windowObj.forEach((winInfo) => {
      winInfo.browserWindow.webContents.send('setPiniaStore', value)
    })
  })

  ipcMain.on('getStore', (_, key) => {
    const value = store.get(key)
    _.returnValue = value
  })
}