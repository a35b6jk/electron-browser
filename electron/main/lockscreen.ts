/*
 * @Author: qinjianjiang 563376730@qq.com
 * @Date: 2023-11-22 14:50:39
 * @LastEditors: qinjianjiang 563376730@qq.com
 * @LastEditTime: 2023-11-27 10:39:30
 * @FilePath: \electron-git-learn\electron\main\lockscreen.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import type { BrowserWindowId, WindowInfo } from "./windowManager"
const INIT_TIME = 60 * 60 * 1000;

export default class LockScreen {
    initTime: number;
    islock: boolean;
    limitTime: number;
    winPool: Map<number, WindowInfo>;
    timeout: NodeJS.Timeout | null;
    mainWinId: number;
    constructor(winPool: Map<BrowserWindowId, WindowInfo>, mainWinId: number) {
        this.limitTime = INIT_TIME;
        this.initTime = INIT_TIME;
        this.islock = false;
        this.winPool = winPool;
        this.timeout = null;
        this.mainWinId = mainWinId;
    }
    setLock(data: boolean) {
        if (!data) {
            this.resetLimitTime();
            this.initTimeOut();
        } else {
            this.timeout && clearTimeout(this.timeout)
        }
        this.winPool.forEach((winInfo) => {
            if (winInfo.parentWindowId === this.mainWinId || winInfo.browserWindow.id === this.mainWinId) {
                winInfo.browserWindow.webContents.send('setPiniaStore', data)
            }
        })
        this.islock = data;
    }
    getLock() {
        return this.islock;
    }
    checkIsLogin() {
        let result = false;
        const winInfo = this.winPool.get(this.mainWinId)
        if (winInfo && winInfo.yongHuID) {
            result = true
        }
        return result;
    }
    resetLimitTime() {
        if (this.limitTime != this.initTime) {
            this.limitTime = this.initTime;
        }
    }
    getInitTime() {
        return this.initTime;
    }
    setInitTime(data: number) {
        this.initTime = data;
        this.limitTime = data;
    }
    initTimeOut() {
        this.timeout = setTimeout(() => {
            if (this.islock || !this.checkIsLogin()) {
                return;
            }
            const time = this.limitTime - 1000;
            if (time <= 0) {
                this.setLock(true)
                this.resetLimitTime()
            } else {
                this.initTimeOut();
                this.limitTime = time
            }
        }, 1000)
    }
}