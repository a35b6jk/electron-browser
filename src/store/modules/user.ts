import { defineStore } from "pinia";
export default defineStore("user", {
    state: () => ({
        username: 'admin',
        userPwd: ''
    }),
    actions: {
        logOut() {
            this.username = '';
            this.userPwd = '';
            // 抛出接口通知业务页面登出
        },
        setUserName(data = ''){
            this.username = data;
        },
        setUserPwd(data = ''){
            this.userPwd = data;
        }
    }
});