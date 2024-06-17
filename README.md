### 指令说明：

- npm run dev :启动项目，正常开发执行完这条指令就可以打开开发工具使用了
- npm run compile ：执行构建
- npm run copy :将插件 NPM 包移动到 src/modules_plugin/目录下
- npm run combine ： 执行将 appConfig.json 文件合并到 app.json

### 一些通用的资源地址

- m-ui：小程序 UI 组件库 参考文档地址：https://activity.msmartlife.cn/activity/sit/m-ui-doc/component/guide/introduce.html

- m-utilsSDK :参考文档地址：https://activity.msmartlife.cn/activity/sit/m-ui-doc/util/guide/introduce.html

- m-miniCommonSDK :参考文档地址：https://activity.msmartlife.cn/activity/sit/m-ui-doc/common/guide/introduce.html

- m-minibaseSDK ，基础的配置已经集成挂载到了 app.js 直接从全局获取使用即可，文档地址：https://activity.msmartlife.cn/activity/sit/m-ui-doc/base/guide/introduce.html

### NPM 包管理平台地址

1、npm login --registry=https://npm.midea.com/repository/U-MeijuApp/
Username:xxx
Password: xxxxx
Email: (this IS public)xxxx@midea.com

2、发布 NPM 指令：
npm publish --registry=https://npm.midea.com/repository/U-MeijuApp/

### 自动化构建打包平台地址

https://msdev.midea.com/home/web/#/mini/lite/jobs
目前只支持feature-test-sit分支对应sit环境，release分支对应prod环境

### 常见错误解决 :computer: :computer:

1、删除本地 miniprogram_npm 和 node_modules 文件夹并清除一下开发工具的缓存-》重启开发工具-》根目录执行 npm install-》右上角工具里面执行构建 NPM，操作以后可解决 miniprogram_npm xxxxxx 文件找不到的报错。

2、使用 yarn add/npm add + 加版本号升级插件，会改变 pagckage.json 中依赖的前后顺序，可能会给合并代码会带来一定冲突，所以除了首次安装使用 yarn add/npm add + 加版本号升级版本外，都统一使用修改 pagckage.json 文件中依赖的版本号进行升级。

3、由于微信隐私协议的要求基础库版本在 3.0.1 版本调试

### 常用代码版本分支 :computer: :computer:

新建分支从 master 分支拉，同步线上代码也是从 master 分支同步

| 分支名称          | 说明                                       |
| ----------------- | ------------------------------------------ |
| master            | 仓库主干线上运行代码分支                   |
| releasexxxxxxx    | 预发布分支分支                             |
| feature-test-sit  | sit 测试分支                               |
| eg: feature/xxxxx | 具体功能版本分支，可带上日期，方便问题排查 |
| eg:hotfix/xxxxx   | 线上 bug 修复分支                          |

#### 备注：

1、feature-test-sit 分支是多团队的统一 sit 提测分支，里面有可能包合未知日期上线的需求，所以在合并代码的时候，大家要保持自己需求分支的纯净，不要直接拉 feature-test-sit 分支的代码到自己的需求分支，可以基于 feature-test-sit 分支建一个中转分支，再把自己的需求分支合并到中转分支，再中转分支合并到 featuretest-sit 分支，这样不同团队的需求就可以一起共用 sit 体验版测试。小程序.一个版本需求较多，分支合并以内部沟通群为庄，会先合并到一个需求合并分支以后再统一合并到 feature-test-sit 测试。

2、跟主版本环境提测流程:(版本号中间一位升级为主版本，例如:v..-》v..(sit 验证通过，事业部同事或其他团队提一个上线流程: http://iflow.midea. com/iflow.htm?fdrouter=/process.com/edit/fd.d/#/)，提一个，目标分支选择 dev 分支，审查通过不影响整体功能最终会把 dev 分支合并到 release 分支再发布到 uat 体验版验证，验证通过后提审。

### 图片项目 :computer: :computer:

    git地址：http://172.16.10.165/MeiJuH5/midea-meiju-lite-assets-deployment

    文件夹 shareImg 是多小程序一套代码的图片

图片合并部署流程

1、新建自己的分支，上传图片

2、需要在 sit 分支测试，将自己合并到 dev 分支，dev 分支会自动构建

3、测试通过后，需要发起将自己分支合并到 master 分支，走发布流程

4、如果是小程序主包，需要开者自己发起图片部署流程。如果是插件发布，需要在插件发布流程中，选择 图片部署

### 工具 :computer: :computer:

> 使用了 [eslint](https://github.com/eslint/eslint)、[Prettier](https://prettier.io/)作为代码静态检查工具,

具体规则查看 `.eslintrc.js` 文件

vscode 的 setting 配置已经添加到项目文件中

依赖使用了[MUI 组库](https://activity.msmartlife.cn/activity/sit/m-ui-doc/)，需要先安装，后构建依赖

```bash

#安装yarn
npm install -g yarn

# 安装依赖||安装升级
npm install || yarn install

#安装覆盖
npm add mui@1.0.1 (需要加上版本号)

#构建依赖
在开发者工具中选择 工具-构建npm
```

### MUI 主题色定制 :computer: :computer:

小程序基于 Shadow DOM 来实现自定义组件，所以 MUI 组件库 使用与之配套的 CSS 变量 来实现定制主题。

对于不支持 CSS 变量 的设备，定制主题将不会生效，不过不必担心，默认样式仍会生效。如果设置了参数传入变量的样式，因遵循参数变量大于 css 变量的原则。因为参数变量是写入样式 style，css 变量是写入样式 css 类

定制全局主题样式

在 app.wxss 中，写入 CSS 变量，即可对全局生效

```bash
page {
 --button-border-radius: 10px;
 --button-default-color: #f2f3f5;
 --toast-max-width: 100px;
 --toast-background-color: pink;
}
```

在 color.js 中，定义全局主题色

```bash
export const PUBLIC = '#E61E1E'
```

在使用中，引入定义色进行使用

```bash
import { PUBLIC } from '../../../color'

data: {

publicColor: PUBLIC,

},
```
