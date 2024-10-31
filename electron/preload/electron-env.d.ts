// Used in Renderer process, expose in `preload.ts`
interface LoginRecordParams {
    yongHuXM: string;
    yongHuZH: string;
    refreshToken: string;
    token: string;
    yiLiaoJGDM: string;
    uuid: string;
}

interface Window {
    ipcRenderer: import('electron').IpcRenderer;
    $electron: typeof import('./index').exportObj;
}
