## 美的小程序配网SDK

开发阶段不宜频繁发布npm，可使用npm link方式引入sdk，本地测试通过后再发布npm。

## npm link使用步骤：

- 在该目录下执行 `npm link`
- 在要使用sdk的小程序根目录执行 `npm link @m-distributionNetwork/sdk`
- 在小程序的node_modules下会生成m-distributionNetwork-sdk目录，并带有符号链接
- 在要使用sdk的小程序根目录执行 `node compile/copyFileNetwork.js`，会在小程序目录distribution-network/assets下生成sdk目录
- 在sdk改动本地的源文件，全局包里面对应的文件内容也跟着变化

npm link详细使用参考：<https://juejin.cn/post/6898119841149485063>