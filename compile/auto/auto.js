/*
 * @desc: 小程序自动化脚本
 * @author: xuym33
 * @Date: 2023-09-01 10:34:47
 */
//构建NPM
function autoConstruct(appid, keyPath) {
  console.log('构建中。。。')
  const ci = require('miniprogram-ci')
  ;(async () => {
    const project = new ci.Project({
      appid: appid,
      type: 'miniProgram',
      projectPath: './',
      privateKeyPath: keyPath,
      ignores: [
        'node_modules/**/*',
        '.vscode',
        '.idea',
        'project.private.config.json',
        '.history',
        'package-lock.json',
        '.DS_Store',
        '*/.DS_Store',
        '*/*/.DS_Store',
      ],
    })
    // 在有需要的时候构建npm
    const warning = await ci.packNpm(project, {
      ignores: ['pack_npm_ignore_list'],
      reporter: (infos) => {
        console.log(infos)
      },
    })
    console.log('构建完成')
    console.warn(warning)
    // 可对warning进行格式化
    /*
      warning.map((it, index) => {
              return `${index + 1}. ${it.msg}
      \t> code: ${it.code}
      \t@ ${it.jsPath}:${it.startLine}-${it.endLine}`
            }).join('---------------\n')
    */
    // 完成构建npm之后，可用ci.preview或者ci.upload
  })()
}

//预览
const autoReview = (appid, keyPath, robot) => {
  const ci = require('miniprogram-ci')
  ;(async () => {
    const project = new ci.Project({
      appid: appid,
      type: 'miniProgram',
      projectPath: './',
      privateKeyPath: keyPath,
      ignores: [
        'node_modules/**/*',
        '.vscode',
        '.idea',
        'project.private.config.json',
        '.history',
        'package-lock.json',
        '.DS_Store',
        '*/.DS_Store',
        '*/*/.DS_Store',
        'compile/**/*',
        'gulpfile.js',
        'combineAppjson.js',
        'npm_dev/**/*',
        'miniprogram_npm/@colmoLite/**/*',
        'miniprogram_npm/@meijuLite/**/*',
        'miniprogram_npm/@toshibaLite/**/*',
        '.doc',
      ],
    })
    const previewResult = await ci.preview({
      project,
      desc: 'hello',
      setting: {
        es6: true,
        es7: true,
        minifyJS: true,
        minifyWXML: true,
        minifyWXSS: true,
        minify: true,
      },
      robot: robot,
      qrcodeFormat: 'image',
      qrcodeOutputDest: './compile/qrcode/qrcode.jpg',
      onProgressUpdate: console.log,
      // pagePath: 'pages/index/index', // 预览页面
      // searchQuery: 'a=1&b=2',  // 预览参数 [注意!]这里的`&`字符在命令行中应写成转义字符`\&`
      // scene: 1011, // 场景值
    })
    console.log(previewResult)
  })()
}

//上传
function autoUpload(appid, keyPath, version, desc, robot) {
  const ci = require('miniprogram-ci')
  ;(async () => {
    const project = new ci.Project({
      appid: appid,
      type: 'miniProgram',
      projectPath: './',
      privateKeyPath: keyPath,
      ignores: [
        'node_modules/**/*',
        '.vscode',
        '.idea',
        'project.private.config.json',
        '.history',
        'package-lock.json',
        '.DS_Store',
        '*/.DS_Store',
        '*/*/.DS_Store',
        'compile/**/*',
        'gulpfile.js',
        'combineAppjson.js',
        'npm_dev/**/*',
        'miniprogram_npm/@colmoLite/**/*',
        'miniprogram_npm/@meijuLite/**/*',
        'miniprogram_npm/@toshibaLite/**/*',
        '.doc',
      ],
    })
    const uploadResult = await ci.upload({
      project,
      version: version ? version : '2.1.5',
      desc: desc ? desc : 'feature-test-sit 分支 隐私协议需求',
      setting: {
        es6: true,
        es7: true,
        minifyJS: true,
        minifyWXML: true,
        minifyWXSS: true,
        minify: true,
      },
      onProgressUpdate: console.log,
      robot: robot,
      allowIgnoreUnusedFiles: true,
      threads: 3,
      useCOS: true,
    })
    console.log(uploadResult)
  })()
}

module.exports = {
  autoConstruct,
  autoReview,
  autoUpload,
}
