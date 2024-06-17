rm -rf "./miniprogram_npm"
  echo "文件夹【miniprogram_npm】删除成功！"
rm -rf "./src/modules/module_plugin/"
  echo "文件夹【module_plugin】删除成功！"
rm -rf "./distribution-network/assets/sdk"
  echo "文件夹【sdk】删除成功！"
# rm -rf "./node_modules"
#   echo "文件夹【node_modules】删除成功！"
npm run installAll
node compile/getVersion/getVersionProd.js
node compile/auto/autoConstructProd.js
node compile/copyFile.js
node combineAppjson.js 
node compile/auto/autoUploadProd.js
