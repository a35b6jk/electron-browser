<!--
 * @Author: qinjianjiang 563376730@qq.com
 * @Date: 2023-11-10 10:54:19
 * @LastEditors: qinjianjiang 563376730@qq.com
 * @LastEditTime: 2023-11-22 15:40:12
 * @FilePath: \electron-git-learn\src\renderer\components\LockScreen\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <transition name="slide-up">
    <lock-screen-page v-if="isLock && isMouted" :userinfo="userinfo" ></lock-screen-page>
  </transition>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from "vue"
import LockScreenPage from "./LockScreenPage.vue";
import { storeToRefs } from 'pinia'
import useStore from '../../store/index'
const { lockscreen } = useStore()
let isMouted = ref(false);
let timer = ref();
const { isLock } = storeToRefs(lockscreen);
defineOptions({
  name: "LockScreen"
})
defineProps({
    userinfo: {
      type: Object,
      default: (): IUserInfo => {
        return {
          username: '',
          pwd: ''
        }
      }
    }
})

onMounted(() => {
  setTimeout(() => {
    isMouted.value = true;
  });
  //timekeeping();
})
onUnmounted(() => {
  // document.removeEventListener("mousedown", this.timekeeping);
  clearInterval(timer.value);
})
</script>

<style lang="scss" scoped>
.slide-up-enter-active {
  animation: slide-up 0.5s;
}

.slide-up-leave-active {
  animation: slide-up 0.5s reverse;
}

@keyframes slide-up {
  0% {
    transform: translateY(-100%);
  }

  100% {
    transform: translateY(0);
  }
}
</style>
