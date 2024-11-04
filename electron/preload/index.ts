// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge } from 'electron'
import ipcRenderer from './ipcRenderer'
import { checkIsLoginWindow, login, logout } from './logInAndLogOut'
import { registerGlobalShortcut, unregisterGlobalShortcut } from './keyboardShortcuts'
import { openDevTools } from './dev'
// import { add, test_ref } from './icc/test'
// // import { read } from './icc/idnex'
// console.log(add());
// test_ref()
// read()


// --------- Expose some API to the Renderer process ---------
// contextBridge.exposeInMainWorld('ipcRenderer', withPrototype(ipcRenderer))
export const exportObj = {
    "ipcRenderer": ipcRenderer,
    "login": login,
    "checkIsLoginWindow": checkIsLoginWindow,
    "logout": logout,
    "registerGlobalShortcut": registerGlobalShortcut,
    "unregisterGlobalShortcut": unregisterGlobalShortcut,
    "openDevTools": openDevTools
}
contextBridge.exposeInMainWorld('$electron', exportObj)