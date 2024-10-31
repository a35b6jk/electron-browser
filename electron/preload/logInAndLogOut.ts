import { ipcRenderer } from 'electron'
// import { getYonghu, setYonghu } from '../shared/store'
// const persist = 'persist:'
// let _yongHuID: null | number = null
export async function login(setting: {
  yongHuID: number
  yongHuMM: string
  yongHuXM: string
  yongHuZH: string
  url: string
  cookies?: Omit<Electron.CookiesSetDetails, 'url'>[]
}) {
  const { yongHuID, yongHuMM, url, yongHuXM, yongHuZH } = setting
    // TODO
  if (yongHuID === void 0 || yongHuMM === void 0 || url === void 0 || yongHuXM === void 0 || yongHuZH === void 0) {
    console.error('yongHuID, yongHuMM, url, yongHuXM, yongHuZH is required')
    return
  }

  const isExis = await ipcRenderer.invoke('isExistsYonghuIdWindow', yongHuID)
  debugger;
  if (isExis) {
    console.warn('有窗口已经登录该账号')
  } else {
    ipcRenderer.send('updateLoginInfo', {
      yongHuID,
      yongHuMM,
      yongHuXM,
      yongHuZH,
    })
    const webContontId = await ipcRenderer.invoke('getWinWebContontId')
    // ipcRenderer.send('login', yongHuID, url, setting)
    if(webContontId) {
      ipcRenderer.sendTo(webContontId, 'login', yongHuID, url, setting)
    } else {
      console.warn('未找到所属父窗口')
    }
    window.close()
  }
}

export async function logout() {
  const isLogin = await ipcRenderer.invoke('checkWindowIsLogin')
  if (isLogin) {
    const webContontId = await ipcRenderer.invoke('getWinWebContontId')
    if(webContontId) {
      ipcRenderer.send('logoutClearHandle')
      ipcRenderer.sendTo(webContontId, 'logout')
    } else {
      console.warn('未找到所属父窗口')
    }
  } else {
    console.warn('应用还未登录')
  }
}

// 检查该用户id是否有窗口已经登录
export async function checkIsLoginWindow(yongHuID: number) {
  const isExis = await ipcRenderer.invoke('isExistsYonghuIdWindow', yongHuID)
  return isExis
}
