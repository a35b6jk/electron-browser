/*
 * @Author: qinjianjiang 563376730@qq.com
 * @Date: 2023-11-10 10:53:04
 * @LastEditors: qinjianjiang 563376730@qq.com
 * @LastEditTime: 2023-11-10 16:03:23
 * @FilePath: \electron-git-learn\src\renderer\store\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import useLockscreenStore from "./modules/lockscreen";
import useUserStore from "./modules/user";

export default function useStore() {
  return {
    lockscreen: useLockscreenStore(),
    user: useUserStore(),
  };
}