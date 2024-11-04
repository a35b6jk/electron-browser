<!--
 * @Author: qinjianjiang 563376730@qq.com
 * @Date: 2024-10-31 08:41:40
 * @LastEditors: qinjianjiang 563376730@qq.com
 * @LastEditTime: 2024-11-04 09:42:28
 * @FilePath: \electron-git-learn\src\components\WindowTitleBar\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <div class="window-titlebar">
        <div class="application">
            <img class="application-icon icon-left" :src="logo2" />
        </div>
        <div class="custom-area">
            <slot></slot>
        </div>
        <div class="titlebar-right">
            <!-- <config-tools @transferUserInfo="transferUserInfo"></config-tools> -->
        </div>
    </div>
</template>
<script lang="ts" setup>
import logo2 from "../../../extraResources/assets/logo-2.png"
// import ConfigTools from "./ConfigTools/index.vue"
const emit = defineEmits<{
    (e: 'transferUserInfo', userinfo: IUserInfo): void
}>()
defineProps({
    title: {
        type: String,
        default: ''
    }
})
// const transferUserInfo = (data: IUserInfo) => {
//     emit('transferUserInfo', data)
// }
</script>
<style lang="scss">
$titleHeight: 40px;

.window-titlebar {
    height: $titleHeight;
    background-color: #356AC5;
    // border-bottom: 1px solid #ccc;
    -webkit-app-region: drag;
    -webkit-user-select: none;
    padding: 0 138px 0 10px;
    display: flex;
    position: relative;
    z-index: 2000;
    top: 0;
    left: 0px;

    .application {
        height: 100%;
        display: flex;

        .application-icon {
            height: 100%;
            box-sizing: border-box;
            object-fit: contain;
            padding: 6px 0;

            &.icon-left {
                padding-right: 5px;
                ;
            }

            &.icon-right {
                width: 112px;
            }
        }
    }

    .custom-area {
        flex: 1;
        width: 0;
    }

    .titlebar-right {
        line-height: $titleHeight;

        .title-icon {
            color: #fff
        }
    }


    .titlebar {
        height: 100%;
        line-height: 35px;
        display: flex;
        width: 100%;
        justify-content: space-between;
        margin-right: 130px;

        // user-select: none;

    }
}</style>