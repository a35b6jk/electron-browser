<!--
 * @Author: qinjianjiang 563376730@qq.com
 * @Date: 2024-10-31 08:41:40
 * @LastEditors: qinjianjiang 563376730@qq.com
 * @LastEditTime: 2024-10-31 09:40:57
 * @FilePath: \electron-git-learn\src\components\TabsBar.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <el-tabs ref="tabs" v-model="store.editableTabsValue" type="border-card" class="demo-tabs" @edit="handleTabsEdit"
    @tab-change="tabChange">
    <!-- <div>
      <el-button @click="openWindow()">open window</el-button> {{ currentUrl }}
    </div> -->
    <el-tab-pane class="demo-tab-pane" v-for="item in store.editableTabs" :closable="!!item.closable" :key="item.name"
      :name="item.name">
      <template #label>
        <el-icon class="is-loading" v-if="!item.ready">
          <Loading />
        </el-icon><span class="ellipsis">{{ item.title }}</span>
      </template>
      <!-- <slot :ready="item.ready" :title="item.title" :webContentsId="item.webContentsId"
        :is-clear-storage-data="item.isClearStorageData" :item-name="item.name" :partition="item.partition" :src="item.src"
        :closable="true" :close="waitClose"></slot> -->
      <!-- <Teleport to="#webview"> -->
      <!-- <web-window v-show="store.editableTabsValue === item.name" v-model:ready="item.ready" v-model:title="item.title"
          v-model:webContentsId="item.webContentsId" :is-clear-storage-data="item.isClearStorageData" :name="item.name"
          :partition="item.partition" :src="item.src" :closable="true" @close="waitClose"></web-window> -->
      <!-- </Teleport> -->
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { ElMessage, type TabPaneName } from 'element-plus'
import { Loading } from '@element-plus/icons-vue'
import { ipcRenderer } from 'electron'
// import { ipcMain } from '@electron/remote'
import useTabStore from '../store/modules/tabs'
let _partition = ''

const store = useTabStore();

// const editableTabsValue = ref('2')
// const editableTabs = reactive<TabConfig[]>([])

const configPrs = ipcRenderer.invoke("readConfig")


const activeTabIndex = computed(() => {
  return store.editableTabs.findIndex((val) => {
    return val.name === store.editableTabsValue
  })
})

function tabChange() {
  let current = store.editableTabs[activeTabIndex.value]
  if (current.webContentsId) {
    ipcRenderer.send('activeWebContentsId', current.webContentsId)
  }
}

// function openWindow() {
//   ipcRenderer.send("openWindow")
// }

const persist = 'persist:'



// TODO 这里需要改成单点登录地址
async function addLoginTab() {
  // store.addTab("http://10.11.74.32:9527/web/auth/", {
  //   isClearStorageData: true
  // })
  let isLogin = await ipcRenderer.invoke("isShowLogin")
  let argv = await ipcRenderer.invoke("getArgv")
  let appcode = '';
  if (argv && argv['appcode']) {
    appcode = argv['appcode']
  }
  if (isLogin) {
    const ret = await configPrs;
    let loginUrl = ''
    if (ret.ret === 0) {
      let baseloginUrl = ret.data.default;
      if (ret.data[appcode]) {
        loginUrl = `${baseloginUrl}${baseloginUrl[baseloginUrl.length - 1] === '/' ? '' : '/'}#/login?app_key=${ret.data[appcode]}`;
      } else {
        loginUrl = baseloginUrl
      }
      if (process.env.NODE_ENV === 'development') {
        if (ret.data[appcode]) {
          loginUrl = `${baseloginUrl}${baseloginUrl[baseloginUrl.length - 1] === '/' ? '' : '/'}#/login?app_key=${ret.data[appcode]}`;
        } else {
          loginUrl = baseloginUrl
        }
      }


      store.addTab(loginUrl, {
        isClearStorageData: true
      })
    } else {
      ElMessage.error("配置文件读取失败")
    }
  }
}
addLoginTab()

// // 不要删除保底操作   防止标签删除完
// watch(store.editableTabs, (value) => {
//   console.log(value)
//   if (value.length == 0) {
//     store.addTab('http://127.0.0.1:9527/web/auth/', {})
//   }
// })

ipcRenderer.on(
  // ipcMain.on(
  'login',
  (_e, partition, url, setting?: {
    cookies?: Omit<Electron.CookiesSetDetails, 'url'>[]
  }) => {
    // console.log(e, partition, url, setting)
    _partition = persist + partition;
    store.addTab(url, { partition: _partition, cookies: setting?.cookies })
  }
)

ipcRenderer.on('logout', () => {
  // ipcMain.on('logout', () => {
  // 关闭所有标签
  _partition = ''
  store.editableTabs.splice(0)
  addLoginTab()
})

ipcRenderer.on('openNewTab', (_, url: string, yongHuId?: string | null) => {
  // TODO 需要把partition传值改成账号
  const partition = (yongHuId !== void 0 || yongHuId !== null) ? persist + yongHuId : _partition
  store.addTab(url, { partition: partition, closable: true })
})

const handleTabsEdit = (targetName: TabPaneName | undefined, action: 'remove' | 'add') => {
  console.log(action)
  if (action === 'add') {
    store.addTab('https://www.baidu.com', {})
  } else if (action === 'remove' && targetName) {
    store.removeTab(targetName)
  }
}
</script>
<style lang="scss" scoped>
$titleHeight: 40px;

.demo-tabs {
  --el-fill-color-light: transparent;
  --el-bg-color-overlay: transparent;
  --el-tabs__item-size: $titleHeight;
  --el-tabs__item-margin: 6px;
  border: none;

  ::v-deep(.el-tabs__nav-scroll) {
    padding: 0 10px;
  }

  ::v-deep(.el-tabs__nav-next),
  ::v-deep(.el-tabs__nav-prev) {
    line-height: $titleHeight;
    padding-top: 3px;
  }

  ::v-deep(.el-tabs__new-tab) {
    margin: 5px 0 6px 10px;
  }

  ::v-deep(.el-tabs__item) {
    max-width: 200px;
    border-left-color: var(--el-border-color);
    margin: var(--el-tabs__item-margin) 0;
    color: var(--el-color-white);
    height: calc(var(--el-tabs__item-size) - var(--el-tabs__item-margin) * 2);

    &:first-child {
      border-left-color: var(--el-border-color);
    }

    &.is-active {
      &+.el-tabs__item {
        border-left-color: transparent;
      }

      color: #356AC5;
      border-radius: 10px 10px 0 0;
      border-top-color: var(--el-border-color);
      background-color: var(--el-color-white);
      margin: var(--el-tabs__item-margin) 0 0 0;
      height: 34px;
      position: relative;
    }
  }

  ::v-deep(.el-tabs__header) {
    border-bottom: none;
  }

  ::v-deep(.el-tabs__content) {
    padding: 0;
  }

  .ellipsis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
