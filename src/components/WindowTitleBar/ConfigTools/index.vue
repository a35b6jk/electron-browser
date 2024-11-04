<!--
 * @Author: qinjianjiang 563376730@qq.com
 * @Date: 2023-11-09 15:11:05
 * @LastEditors: qinjianjiang 563376730@qq.com
 * @LastEditTime: 2024-11-04 09:53:42
 * @FilePath: \electron-git-learn\src\renderer\components\WindowTitleBar.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <div class="config-tools">
        <a title="设置" class="btn">
            <el-dropdown class="more-time-config " @command="handleCommand">
                <div class="btn-icon btn-padding">
                    <el-icon :size="14" class="title-icon">
                        <Tools />
                    </el-icon>
                </div>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="lockTime" v-if="!isLock">
                            设置锁屏时间
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </a>
        <a title="锁屏" disabled class="btn btn-lock btn-padding" @click="handleLock">
            <el-icon :size="14" class="title-icon">
                <Unlock v-if="!isLock" />
                <Lock v-else />
            </el-icon>
        </a>
        <lock-time-config-dialog :visible.sync="dialogVisible" @changeVisible="handleChangeDialogVisible"
            :lock-time="lockTime"></lock-time-config-dialog>
    </div>
</template>
<script lang="ts" setup>
import { ref, watch } from "vue"
import { Lock, Unlock, Tools } from '@element-plus/icons-vue'
import { ipcRenderer } from "electron"
// import { ElMessage } from 'element-plus'
import { storeToRefs } from 'pinia'
import LockTimeConfigDialog from "./LockTimeConfigDialog.vue"
import useStore from '../../../store/index'
const { lockscreen } = useStore()
const { isLock } = storeToRefs(lockscreen);
const emit = defineEmits<{
    (e: 'transferUserInfo', userinfo: IUserInfo): void
}>()
defineProps({
    title: {
        type: String,
        default: ''
    }
})
const dialogVisible = ref(false)
const lockTime = ref(0)
watch(isLock, (value: boolean) => {
  if (value) {
    dialogVisible.value = false;
  }
})
const handleLock = async () => {
    if (isLock.value) {
        return
    }
    const userinfo = await ipcRenderer.invoke('getUserInfo') as (null | {
        yongHuXM: string,
        yongHuMM: string
    });
    if (userinfo) {
        // const { yongHuXM, yongHuMM } = userinfo;
        // emit('transferUserInfo', {
        //     username: yongHuXM,
        //     pwd: yongHuMM
        // })
        // if (!yongHuMM || !yongHuXM) {
        //     ElMessage({
        //         message: "登录后开启锁屏功能",
        //         type: "warning",
        //         duration: 2000,
        //         customClass: 'super-top',
        //         offset: 51
        //     })
        // } else {
            ipcRenderer.send("setLock", true)
        // }
    }
}

const handleChangeDialogVisible = (data: boolean) => {
    dialogVisible.value = data;
}
const handleCommand = async (value: string) => {
    switch (value) {
        case 'lockTime': {
            const time = await ipcRenderer.invoke('getInitTime');
            lockTime.value = time;
            dialogVisible.value = true;
        }
    }
}
</script>
<style lang="scss">
.config-tools {
    height: 100%;

    .btn {
        height: 100%;
        -webkit-app-region: no-drag;
        display: inline-block;

        &:hover {
            background-color: rgba(255, 255, 255, 0.1);
        }
    }

    .btn-padding {
        padding: 0 10px;
    }

    .btn-icon {
        display: flex;
        align-items: center;
        height: 100%;
    }

    .more-time-config {
        height: 100%;
        display: flex;
        align-items: center;
    }
}
</style>