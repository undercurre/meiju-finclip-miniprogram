#!/bin/bash
rm -rf "./miniprogram_npm"
  echo "文件夹【miniprogram_npm】删除成功！"
rm -rf "./src/modules/module_plugin/"
  echo "文件夹【module_plugin】删除成功！"
rm -rf "./distribution-network/assets/sdk"
  echo "文件夹【sdk】删除成功！"
rm -rf "./distribution-network/addDevice"
  echo "文件夹【addDevice】删除成功！"
rm -rf "./distribution-network/scan-devices"
  echo "文件夹【scan-devices】删除成功！"
rm -rf "./distribution-network/select-devices"
  echo "文件夹【select-devices】删除成功！"
rm -rf "./distribution-network/user-gudie"
  echo "文件夹【user-gudie】删除成功！"
#rm -rf "./node_modules"
#  echo "文件夹【node_modules】删除成功！"
npm run installAll
node compile/auto/autoConstructSit.js
node compile/copyFile.js
node combineAppjson.js