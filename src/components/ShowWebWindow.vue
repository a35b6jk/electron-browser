<template>
  <div class="web-show-area">
    <web-window class="webview" v-for="item in store.editableTabs" :key="item.name"
      v-show="store.editableTabsValue === item.name" v-model:ready="item.ready" v-model:title="item.title"
      v-model:webContentsId="item.webContentsId" :is-clear-storage-data="item.isClearStorageData" :name="item.name"
      :partition="item.partition" :src="item.src" :closable="true" :cookie-set="item.cookieSet"
      @close="waitClose"></web-window>
  </div>
</template>

<script lang="ts" setup>
import useTabStore from '../store/modules/tabs'
import WebWindow from './WebWindow.vue'

function waitClose(_: Electron.Event, name?: string) {
  if (name) {
    store.removeTab(name)
  } else {
    console.warn('web-window组件没有传入name属性')
  }
}

const store = useTabStore()
</script>
<style scoped>
.web-show-area {
  flex: 1;

  /* .webview {
    height: 100%;
    border-radius: 5px;
  } */
}

.web-show-area .webview {
  height: 100%;
  border-radius: 5px;
}</style>
