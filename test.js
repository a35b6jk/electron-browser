/*
 * @Author: qinjianjiang 563376730@qq.com
 * @Date: 2024-09-25 13:47:58
 * @LastEditors: qinjianjiang 563376730@qq.com
 * @LastEditTime: 2024-09-25 15:28:02
 * @FilePath: \electron-git-learn\test.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const fs = require('fs')
const path = require('path');
// const resize = require("./resize");
// const { PNG } = require("pngjs");
const pngToIco = require('./png/index')
const outputDir = './ico'
// console.log(resize)
// const createIcon = require('icojs');
async function read() {
    const pngFilePath = './W00.png'
    // const data = PNG.sync.read(buffer);
    const png = await pngToIco(pngFilePath)

    // fs.writeFileSync('./png/w00.png', image.data);
    // const icoData = createIcon([buffer], { size: 16 });
    const outputPath = path.join(outputDir, path.basename(pngFilePath, '.png') + '.ico');
    fs.writeFileSync(outputPath, png);
}
read()
