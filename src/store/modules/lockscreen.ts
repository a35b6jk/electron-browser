/*
 * @Author: qinjianjiang 563376730@qq.com
 * @Date: 2023-11-10 11:25:19
 * @LastEditors: qinjianjiang 563376730@qq.com
 * @LastEditTime: 2023-11-22 10:34:08
 * @FilePath: \electron-git-learn\src\renderer\store\lockscreen\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { ipcRenderer } from "electron"
const eleStoreIsLock = ipcRenderer.sendSync("getLock")
let ISLOCK = true;
ISLOCK = eleStoreIsLock;
import { defineStore } from "pinia";
export const initTime = 60 * 60;
const store = defineStore("lockscreen", {
    state: () => ({
        isLock: ISLOCK, // 是否锁屏
        lockTime: 3600, // 锁屏时间
    }),
    actions: {
        setLock(data: boolean) {
            this.isLock = data;
            // if (isSync) {
            //     ipcRenderer.send("setLock", data)
            // }
        },
        setLockTime(data = initTime) {
            this.lockTime = data;
        },
    }
});
export default store