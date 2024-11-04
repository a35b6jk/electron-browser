/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2023-11-20 13:38:24
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2023-11-21 09:16:31
 * @FilePath: \electron-git-learn\src\main.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import './assets/style.css'
import 'normalize.css'
import './assets/index.css'
import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import "element-plus/theme-chalk/src/message.scss"
// import ElementPlus from 'element-plus'
// import 'element-plus/dist/index.css'

const app = createApp(App)
app.use(createPinia())
// app.use(ElementPlus)
app.mount('#app')