<template>
  <div :class="{ unLockLogin: isShowLogin }" class="lockscreen" @keyup="unLockLogin(true)" @mousedown.stop
    @contextmenu.prevent>
    <template v-if="!isShowLogin">
      <div class="lock-box">
        <div class="lock">
          <span class="lock-icon" title="解锁屏幕" @click="unLockLogin(true)">
            <div class="anticon-lock">
              <el-icon>
                <Lock />
              </el-icon>
            </div>
            <div class="anticon-unlock">
              <el-icon>
                <Unlock />
              </el-icon>
            </div>
          </span>
        </div>
        <h6 class="tips">点击解锁</h6>
      </div>
    </template>
    <template v-if="isShowLogin">
      <div class="login-box">
        <el-avatar :icon="UserFilled" :size="50" />
        <div class="username">
          {{ userinfo.username }}
        </div>

        <el-input v-model="loginForm.password" type="password" autofocus placeholder="请输入登录密码" size="large"
          @keyup.enter="throttleLogin">
          <template #append>
            <el-button :icon="Right" @click="onLogin" />
          </template>

        </el-input>
        <a style="margin-top: 10px" @click="nav2login">重新登录</a>
      </div>
    </template>

    <template v-if="!isShowLogin">
      <div class="local-time">
        <div class="time">{{ timeShowObj.hour }}:{{ timeShowObj.minutes }}</div>
        <div class="date">
          {{ timeShowObj.month }}月{{ timeShowObj.day }}号，星期{{
            timeShowObj.week
          }}
        </div>
      </div>
      <div class="computer-status">
        <!-- <span :class="{ offline: !online }" class="network">
          <WifiOutlined class="network" />
        </span>
         <ApiOutlined /> -->
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from "vue"
import { md5 } from "js-md5";
import { initTime } from "../../store/modules/lockscreen";
import { throttle } from "lodash";
import useStore from '../../store/index'
import { Lock, Unlock, UserFilled, Right } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { ipcRenderer } from 'electron'
let isShowLogin = ref(false);
let timer = ref();
let loginLoading = ref(false);
let loginForm = ref({
  username: "",
  password: "",
});

const props = defineProps({
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

const date = new Date();

const addZero = (i: number) => {
  let result = '' + i;
  if (i < 10) {
    result = "0" + i;
  }
  return result;
}
let timeShowObj = ref<ITimeShowObj>({

  year: date.getFullYear(),
  month: date.getMonth() + 1,
  week: '日一二三四五六'.charAt(date.getDay()),
  hour: addZero(date.getHours()),
  minutes: addZero(date.getMinutes()),
  day: date.getDate(),
});
const { lockscreen } = useStore()
const { pwd } = props.userinfo;


const { setLockTime } = lockscreen;
onMounted(() => {
  clearInterval(timer.value);
  updateTime();
  timer.value = setInterval(() => updateTime(), 1000);
})
onUnmounted(() => {
  clearInterval(timer.value);
})
const unLockLogin = (value: any) => {
  isShowLogin.value = value;
}
const throttleLogin = throttle(function () {
  onLogin();
}, 1000)
const onLogin = () => {
  if (loginForm.value.password.trim() === "") {
    ElMessage({
      message: "请填写密码",
      type: "warning",
      duration: 2000,
      customClass: 'super-top',
      offset: 51
    })
    return;
  }
  loginLoading.value = true;
  // 异步登录
  if (
    pwd === md5(loginForm.value.password).toString().toUpperCase()
  ) {
    unLockLogin(false);
    ipcRenderer.send("setLock", false)
    setLockTime(initTime)
  } else {
    ElMessage({
      message: "密码错误!!!",
      type: "warning",
      duration: 2000,
      customClass: 'super-top',
      offset: 51
    })
  }
  loginLoading.value = false;
}
// 重新登录
const nav2login = async () => {
  unLockLogin(false);
  ipcRenderer.send("setLock", false)
  ipcRenderer.send('logoutClearHandle')
  const webContentId = await ipcRenderer.invoke("getWinWebContontId")
  ipcRenderer.sendTo(webContentId, 'logout')
  // logOut();
}
const updateTime = () => {
  const date = new Date();
  timeShowObj.value = {
    ...timeShowObj.value,
    "year": date.getFullYear(),
    "month": date.getMonth() + 1,
    "week": "日一二三四五六".charAt(date.getDay()),
    "hour": addZero(date.getHours()),
    "minutes": addZero(date.getMinutes()),
    "day": date.getDate()
  }
}

</script>

<style lang="scss" scoped>
.lockscreen {
  position: fixed;
  top: 35px;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 9999;
  display: flex;
  overflow: hidden;
  color: white;
  background: #000;

  &.unLockLogin {
    background-color: rgba(25, 28, 34, 0.78);
    backdrop-filter: blur(7px);
  }

  .login-box {
    position: absolute;
    top: 45%;
    left: 50%;
    display: flex;
    transform: translate(-50%, -50%);
    flex-direction: column;
    justify-content: center;
    align-items: center;

    >* {
      margin-bottom: 14px;
    }

    .username {
      font-size: 30px;
    }
  }

  .lock-box {
    position: absolute;
    top: 12vh;
    left: 50%;
    font-size: 34px;
    transform: translateX(-50%);

    .tips {
      color: white;
      cursor: text;
    }

    .lock {
      display: flex;
      justify-content: center;

      .lock-icon {
        cursor: pointer;

        .anticon-unlock {
          display: none;
        }

        &:hover .anticon-unlock {
          display: initial;
        }

        &:hover .anticon-lock {
          display: none;
        }
      }
    }
  }

  .local-time {
    position: absolute;
    bottom: 60px;
    left: 60px;
    font-family: helvetica;

    .time {
      font-size: 70px;
    }

    .date {
      font-size: 40px;
    }
  }

  .computer-status {
    position: absolute;
    right: 60px;
    bottom: 60px;
    font-size: 24px;

    >* {
      margin-left: 14px;
    }

    .network {
      position: relative;

      &.offline::before {
        position: absolute;
        top: 50%;
        left: 50%;
        z-index: 10;
        width: 2px;
        height: 28px;
        background-color: red;
        content: "";
        transform: translate(-50%, -50%) rotate(45deg);
      }
    }
  }
}
</style>
<style lang="scss">
.super-top {
  z-index: 9999 !important;
}
</style>