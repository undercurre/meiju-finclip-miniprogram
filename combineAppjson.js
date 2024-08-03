const fs = require('fs')
const path = require('path')
const { goOldUrlPluginList } = require('./plugindevelop.js')

const basePath = 'src/modules/module_plugin/'
const oldPluginPath = 'plugin/'
const dirname = './src/modules' // 指定目录路径
const filename = 'appConfig.json' // 指定文件名
const jsonPath = path.join(__dirname, 'plugin', 'appConfig.json')
const reg = /^T0x/
// 读取app.json文件
const appjsonPath = `${__dirname}/app.json`
const appJson = JSON.parse(fs.readFileSync(appjsonPath))
console.log('获取文件：', appJson)
//校验文件是否存在
const ifHasFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        console.error(`${filePath} 文件不存在`)
        resolve(false)
      }
      console.log(`${filePath} 文件存在`)
      resolve(true)
    })
  })
}
//已改造的插件是否需要在开发模式下走旧的插件路径
const getOldPluginUrl = (root) => {
  let pluginName = root.substring(root.length - 5)
  console.log('需要走老路径的插件：', goOldUrlPluginList)
  for (let i = 0; (i = goOldUrlPluginList.length); i++) {
    const item = 'T' + goOldUrlPluginList[i]
    console.log('需要走老路径的插件2：', item)
    console.log('需要走老路径的插件3：', item === pluginName, pluginName)

    if (item === pluginName) return true
  }
  return false
}
//查找文件
const findFiles = (dir, filePattern) => {
  const files = fs.readdirSync(dir)
  let foundFiles = []

  for (let i = 0; i < files.length; i++) {
    const filename = path.join(dir, files[i])
    const stat = fs.lstatSync(filename)

    if (stat.isDirectory()) {
      foundFiles = foundFiles.concat(findFiles(filename, filePattern))
    } else if (filename.match(filePattern)) {
      foundFiles.push(filename)
    }
  }
  return foundFiles
}
//获取模块的配置文件
const getAppConfig = (path) => {
  // 读取app.json文件
  console.log('获取模块配置文件：', path)
  const appJson = JSON.parse(fs.readFileSync(path))
  return appJson
}
// 模块文件写入全局的配置文件
const writeAppJson = () => {
  // 将修改后的JSON写回文件
  console.log('writeAppJson enter, dirPath=', appjsonPath)
  fs.writeFileSync(appjsonPath, JSON.stringify(appJson, null, 2).replace(/,/g, ','))
}
//处理appConfig.json 文件里的路径，如何是插件，需要校验路径
const getRootPath = (root) => {
  const isPluginRoot = root.indexOf('T0x') != -1
  const isGoOldPluginPath = getOldPluginUrl(root)
  console.log('校验结果打印', isGoOldPluginPath, isPluginRoot)
  if (isGoOldPluginPath) {
    return `${oldPluginPath}` + root.substring(root.lastIndexOf('/') + 1) // 返回最后一个'/'后的内部
  } else if (isPluginRoot) return `${basePath}` + root.substring(root.lastIndexOf('/') + 1) // 返回最后一个'/'后的内部
  return root
}
//appjson 文件是否有配置，有的话就更新，没有的话就新增
const integrationConfig = (obj) => {
  const len = appJson.subpackages.length
  let countLen = 0
  appJson.subpackages.forEach((item) => {
    if (item.name === obj.name) {
      item.root = getRootPath(obj.root)
      item.pages = obj.pages
    } else {
      countLen++
    }
  })
  if (countLen == len) {
    obj.root = getRootPath(obj.root)
    appJson.subpackages.push(obj)
  }
}
//appjson 文件是否有配置主包信息，有的话就忽略，没有的话就新增
const integrationMainConfig = (obj) => {
    obj.pages.forEach((item) => {
        if(!appJson.pages.includes('src/modules/module_plugin/' + obj.name + '/' + item)) {
            appJson.pages.push('src/modules/module_plugin/' +  obj.name + '/' + item)
        }
    })
}
const init = () => {
  const findTargetFiles = findFiles(dirname, filename)
  console.log('获取到匹配的文件：', findTargetFiles)

  findTargetFiles.forEach((item) => {
    const getTargetAppConfig = getAppConfig(item)
    console.log('获取模块配置文件：', getTargetAppConfig)
    if(appJson.isSubpackage) { // 配网指明是分包，按分包加载
        getTargetAppConfig.subpackages.forEach((configItem) => {
            integrationConfig(configItem) // 查找添加分包配置信息
          })
    } else { // 未指明是分包，或者没有配置，默认当主包
        getTargetAppConfig.subpackages && getTargetAppConfig.subpackages.forEach((configItem) => {
            integrationMainConfig(configItem) // 查找添加主包配置信息
        })
    }  
  })

  writeAppJson()
}
init()
