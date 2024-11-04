<!--
 * @Author: qinjianjiang 563376730@qq.com
 * @Date: 2023-11-09 15:11:05
 * @LastEditors: qinjianjiang 563376730@qq.com
 * @LastEditTime: 2023-11-29 10:14:04
 * @FilePath: \electron-git-learn\src\renderer\components\WindowTitleBar.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <el-dialog :model-value="visible" title="设置定时锁屏时间" width="30%" class="time-config-dialog" :before-close="handleCancel">
        <p>当前定时锁屏时间为{{ showLockTime}}</p>
        <div class="time-config">
            <el-input type="number" min="1" v-model="lockTimeInput" placeholder="请输入定时锁屏时间且不能小于1"
                @blur="handleChangeLockTimeInput" />
            <el-radio-group class="time-config-unit" v-model="lockTimeUnit">
                <el-radio v-for="item in options" class="time-unit" :label="item.value">{{ item.label }}</el-radio>
            </el-radio-group>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="handleCancel">取消</el-button>
                <el-button type="primary" @click="handleConfirm">
                    确认
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>
<script lang="ts" setup>
import { ref, computed } from "vue"
import { ipcRenderer } from "electron"
import { ElMessage } from 'element-plus'
const props = defineProps({
    lockTime: {
        type: Number,
        default: 0
    },
    visible: {
        type: Boolean,
        default: false
    }
})
const lockTimeInput = ref(1)
const lockTimeUnit = ref('hour')
const options = ref([
    { value: 'hour', label: '时' },
    { value: 'minute', label: '分' },
    { value: 'second', label: '秒' }
])

const showLockTime = computed(() => {
  return (dealTime(props.lockTime))
})
const emit = defineEmits<{
    (e: 'changeVisible', data: boolean): void
}>()
const resetLockTimeConfig = () => {
    // 重置数据
    lockTimeInput.value = 1;
    lockTimeUnit.value = 'hour'
}
const handleChangeLockTimeInput = () => {
    // 输入框时间不能小于1
    if (lockTimeInput.value < 1) {
        lockTimeInput.value = 1
    }
}
const handleConfirm = () => {
    let second = 0;
    handleChangeLockTimeInput();
    switch (lockTimeUnit.value) {
        case 'hour': {
            second = Number(lockTimeInput.value) * 1000 * 60 * 60;
            break
        }
        case 'minute': {
            second = Number(lockTimeInput.value) * 1000 * 60;
            break
        }
        case 'second': {
            second = Number(lockTimeInput.value) * 1000;
            if (lockTimeInput.value <= 5) {
                ElMessage({
                    message: "定时锁屏时间不能小于5秒",
                    type: "warning",
                    duration: 2000,
                    customClass: 'super-top',
                    offset: 51
                })
                return
            }
            break
        }
    }
    ipcRenderer.send('setInitTime', second)
    ElMessage({
        message: "设置成功",
        type: "success",
        duration: 2000,
        customClass: 'super-top',
        offset: 51
    })
    handleCancel()
}

const handleCancel = () => {
    emit('changeVisible', false)
    // 延迟一秒重置
    setTimeout(resetLockTimeConfig, 1000)
}

const dealTime = (value: number) => {
    let result = ''
    const seconds = Math.floor((value / 1000) % 60);
    const minutes = Math.floor((value / (1000 * 60)) % 60);
    const hours = Math.floor((value / (1000 * 60 * 60)));
    if (hours){
        result = `${hours}小时`;
    } else if (minutes){
        result = `${minutes}分钟`;
    } else {
        result = `${seconds}秒`;
    }
    return result;
}

</script>
<style lang="scss">
.time-config-dialog {
    min-width: 400px;
    ;
}

.time-config {
    display: flex;

    .time-config-unit {
        width: 210px;
        margin-left: 10px;

        .time-unit {

            margin-right: 6px;
            ;
        }
    }
}
.super-top {
  z-index: 99999 !important;
}
</style>