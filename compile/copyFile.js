const fs = require('fs-extra')
const sourceDir1 = './node_modules/@colmoLite'
const sourceDir2 = './node_modules/@meijuLite'
const sourceDir3 = './node_modules/@toshibaLite'
const sourceDir9 = './node_modules/@m-finclip-harmonyos'
const targetPath1 = './src/modules/module_plugin'
//配网模块需要迁移的路径
const sourceDir4 = './node_modules/@m-distributionNetwork/sdk/'
const targetPath4 = './distribution-network/assets/sdk'
const sourceDir5 = './node_modules/@m-distributionNetwork/addDevice/'
const targetPath5 = './distribution-network/addDevice'
const sourceDir6 = './node_modules/@m-distributionNetwork/scanDevices/'
const targetPath6 = './distribution-network/scan-devices'
const sourceDir7 = './node_modules/@m-distributionNetwork/selectDevices/'
const targetPath7 = './distribution-network/select-devices'
const sourceDir8 = './node_modules/@m-distributionNetwork/userGuide/'
const targetPath8 = './distribution-network/user-gudie'


function copyFile(sourceDir, targetPath) {
  if (fs.existsSync(sourceDir)) {
    fs.copySync(sourceDir, targetPath, { overwrite: true })
    console.log(`${sourceDir}文件夹已迁移成功`)
  }
}

copyFile(sourceDir1, targetPath1)
copyFile(sourceDir2, targetPath1)
copyFile(sourceDir3, targetPath1)
copyFile(sourceDir9, targetPath1)
copyFile(sourceDir4, targetPath4)
copyFile(sourceDir5, targetPath5)
copyFile(sourceDir6, targetPath6)
copyFile(sourceDir7, targetPath7)
copyFile(sourceDir8, targetPath8)