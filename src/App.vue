<!--
 * @Author: qinjianjiang 563376730@qq.com
 * @Date: 2023-11-08 09:52:07
 * @LastEditors: qinjianjiang 563376730@qq.com
 * @LastEditTime: 2023-11-29 09:55:23
 * @FilePath: \electron-git-learn\src\renderer\App.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <window-titlebar @transferUserInfo="transferUserInfo" title="electron桌面应用">
    <tabs-bar></tabs-bar>
  </window-titlebar>
  <div class="main">
    <show-web-window></show-web-window>
  </div>
  <lock-screen v-if="isLock" :userinfo="userinfo"></lock-screen>
  <!-- <div class="main" id="webview"></div> -->
  <!-- <h1>💖 Hello World!</h1>
  <p>Welcome to your Electron application.</p>
  <webview src="https://www.baidu.com/"></webview> -->
  <!-- 123 -->
  <!-- <router-view /> -->
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import TabsBar from './components/TabsBar.vue';
import LockScreen from "./components/LockScreen/index.vue";
import WindowTitlebar from './components/WindowTitleBar/index.vue'
import useStore from './store/index'
import { storeToRefs } from 'pinia'
import { ipcRenderer } from 'electron';
import ShowWebWindow from './components/ShowWebWindow.vue';
const { lockscreen } = useStore()
const { isLock } = storeToRefs(lockscreen);
let userinfo = ref<IUserInfo>()
let webviewSrc = ref('');
onMounted(() => {
  initIpcListener();
})
const initIpcListener = () => {
  // 获取参数传入webview //之后待改
  ipcRenderer.on('params', (_, data) => {
    const { url } = data;
    webviewSrc.value = url
  })

  // 接受electronstore的发布
  ipcRenderer.on('setPiniaStore', async (_,  value) => {
      lockscreen.setLock(value)
      const info = await ipcRenderer.invoke('getUserInfo') as (null | {
          yongHuXM: string,
          yongHuMM: string
      });
      if (info) {
        userinfo.value = {
          username: info.yongHuXM,
          pwd: info.yongHuMM
        }
      }  
  })
}
const transferUserInfo = (data: IUserInfo) => {
  userinfo.value = data
}
</script>
<style lang="scss" scoped>
.main {
  display: flex;
  justify-content: center;
  flex: 1 1 auto;

  .webview {
    flex: 1;
  }
}
</style>