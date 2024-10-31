import { ipcRenderer } from 'electron'

// 把下面["F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12", "Ctrl+S"]数组转成map对象
// type Keys = "F1" | "F2";
const supportShortcutMap = new Map([
  ['F1' as const, null],
  ['F2' as const, null],
  ['F3' as const, null],
  ['F4' as const, null],
  ['F5' as const, null],
  ['F6' as const, null],
  ['F7' as const, null],
  ['F8' as const, null],
  ['F9' as const, null],
  ['F10' as const, null],
  ['F11' as const, null],
  ['F12' as const, null],
  ['Ctrl+S' as const, null],
])

type Keys = typeof supportShortcutMap extends Map<infer P, null> ? P : never


export function registerGlobalShortcut(keys: Keys | Keys[], callback: () => void) {
  if (Array.isArray(keys)) {
    for (const key of keys) {
      if (!supportShortcutMap.has(key)) {
        throw new Error(`不支持的全局快捷键${key}`)
      }
    }
  }
  // globalShortcut.register(key, callback)
  ipcRenderer.send('registerShortcut', keys)
  ipcRenderer.on('shortcut-pressed', (_, keys: Keys) => {
    console.log('shortcut-pressed', keys)
    callback();
  })
}
export function unregisterGlobalShortcut(key?: Keys) {
  if (key && !supportShortcutMap.has(key)) {
    throw new Error(`不支持的全局快捷键${key}`)
  }
  // globalShortcut.register(key, callback)
  ipcRenderer.send('unregisterShortcut', key)
}
