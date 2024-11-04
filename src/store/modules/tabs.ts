import { TabPaneName } from 'element-plus'
import { defineStore } from 'pinia'

interface TabConfig {
  name: string
  src: string
  partition: string
  title?: string
  closable: boolean
  ready: boolean
  webContentsId: null
  cookieSet?: Omit<Electron.CookiesSetDetails, 'url'>[]
  isClearStorageData?: boolean
}

interface TabsState {
  editableTabsValue: string
  tabIndex: number
  editableTabs: TabConfig[]
}

const store = defineStore(
  'tabs',
  {
    state: (): TabsState => ({
      editableTabsValue: '0',
      tabIndex: 0,
      editableTabs: [],
    }),
    actions: {
      removeTab(removeName: TabPaneName) {
        const idx = this.editableTabs.findIndex((val) => {
          return val.name === removeName
        })
        if (idx + 1 < this.editableTabs.length) {
          this.editableTabsValue = this.editableTabs[idx + 1].name
        } else {
          this.editableTabsValue = this.editableTabs[idx - 1].name
        }
        this.editableTabs.splice(idx, 1)
      },
      addTab(
        url: string,
        {
          partition = '',
          cookies = undefined as
            | Omit<Electron.CookiesSetDetails, 'url'>[]
            | undefined,
          closable = false,
          isClearStorageData = false,
        }
      ) {
        const newTabName = `${++this.tabIndex}`
        const newTabsConfig: TabConfig = {
          name: newTabName,
          webContentsId: null,
          title: '',
          src: url,
          ready: false,
          closable: closable,
          partition: partition,
          cookieSet: cookies,
          isClearStorageData,
        }
        this.editableTabs.push(newTabsConfig)
        this.editableTabsValue = newTabName
        return newTabsConfig
      },
    },
    getters: {
      activeTabIndex: (state) => {
        return state.editableTabs.findIndex((val) => {
          return val.name === state.editableTabsValue
        })
      },
    },
  }
)
export default store
