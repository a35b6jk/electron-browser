<template>
    <webview webpreferences="" :src="src" :ref="(el: Electron.WebviewTag) => (newTabsConfig.webview = el)" allowpopups
        nodeintegration :partition="partition">
    </webview>
    <!-- <el-empty v-show="newTabsConfig.isFail" description="加载失败"></el-empty> -->
</template>
<script lang="ts" setup>
import { webContents } from '@electron/remote';
import { ipcRenderer } from 'electron';
import { onMounted, reactive } from 'vue';
interface TabConfig {
    webview: null | Electron.WebviewTag
    viewport: Element | null
    isFail: boolean
}

const props = defineProps<{
    src: string
    partition: string,
    closable: boolean
    cookieSet?: Omit<Electron.CookiesSetDetails, 'url'>[]
    name?: string
    isClearStorageData?: boolean
    // webContentsId: null | number
}>()

const webContentsId = defineModel<null | number>("webContentsId", { default: null, local: true })
const title = defineModel<string>("title", { local: true })
const ready = defineModel<boolean>("ready", { local: true })

const emit = defineEmits<{
    (e: 'close', param: Electron.Event, name?: string): void
}>()

const newTabsConfig: TabConfig = reactive({
    webview: null,
    viewport: null,
    isFail: false,
})

function writeCookie(
    url = '',
    cookiesSet: Omit<Electron.CookiesSetDetails, 'url'>[]
) {
    if (newTabsConfig.webview) {
        const cookies = webContents.fromId(
            newTabsConfig.webview.getWebContentsId()
        ).session.cookies
        for (const cookieSet of cookiesSet) {
            cookies.set({
                url: url,
                ...cookieSet,
            })
        }
    }
}

function updateTitle(_title: string) {
    title.value !== void 0 && (title.value = _title)
}

onMounted(() => {
    const webview = newTabsConfig.webview
    if (webview) {






        // webview.addEventListener("found-in-page", () => { })

        // webContents.fromId(webview.getWebContentsId()).session.cookies.set


        webview.addEventListener("did-attach", () => {
            let _webContentsId = webview.getWebContentsId()
            ipcRenderer.send("registerWebView", _webContentsId)
            ipcRenderer.send('activeWebContentsId', _webContentsId)
            if (webContentsId.value !== void 0) {
                webContentsId.value = _webContentsId
                if (props.isClearStorageData) {
                    webContents.fromId(webContentsId.value).session.clearStorageData()
                }

            }
        })

        webview.addEventListener("did-start-loading", (_e) => {
            // console.log(webview.getTitle());
            ready.value !== void 0 && (ready.value = false);
            // title.value !== void 0 && (title.value = '正在加载中')
            updateTitle('正在加载中')
        })

        // 第一次load 触发 和  url 变更加载
        webview.addEventListener('page-title-updated', (e) => {

            updateTitle(e.title)
            // title.value !== void 0 && (title.value = e.title)
        })

        webview.addEventListener('dom-ready', () => {
            updateTitle(webview.getTitle())
            if (props.cookieSet) {
                writeCookie(props.src, props.cookieSet)
            }
        })

        webview.addEventListener("did-fail-load", (e) => {
            // 文档内容相同可能会触发 可以忽略
            // 参考 https://github.com/electron/electron/blob/c41b8d536b2d886abbe739374c0a46f99242a894/lib/browser/navigation-controller.ts
            if (e.errorCode === -3) {
                return;
            }
            const url = new URL(props.src);
            newTabsConfig.isFail = true
            ready.value !== void 0 && (ready.value = true);
            updateTitle(url.hostname)
            // title.value !== void 0 && (title.value = url.hostname)
        })

        webview.addEventListener("did-stop-loading", (e) => {
            console.log('did-stop-loading', e)
            updateTitle(webview.getTitle())
            // console.log(webview.getTitle());
            ready.value !== void 0 && (ready.value = true);
        })
        // webview.addEventListener('load-commit', (e) => {
        //   console.log(e.url , newTabsConfig.src);
        //   if (e.url === newTabsConfig.src) {
        //     newTabsConfig.ready = false
        //   }
        //   console.log('load-commit', e)
        // })

        // webview.addEventListener("did-finish-load", (e) => {
        //   console.log('did-finish-load', newTabsConfig.src)
        //   newTabsConfig.ready = true
        // })
        webview.addEventListener("destroyed", () => {
            console.log("destroyed");

        })
        webview.addEventListener('close', (e) => {
            console.log("close");
            emit("close", e, props.name)
        })
    }
    // webContents 对象已经存在
    // webview.addEventListener('did-attach', (e) => {

})
</script>
<style lang="scss">
.full-screen {
    width: 100vw;
    height: 100vh;

    .webview {
        width: 100%;
        height: 100%;
        border: 2px solid saddlebrown;
    }
}
</style>