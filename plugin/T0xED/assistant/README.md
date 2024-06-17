# widget-assistant

全平台全品类统一功能状态管理框架`assistant`，尝试提供类全状态管理，多平台能力抹平，提高相似功能多平台开发效率的javaScript管理框架。

## DEMO

微信小程序烟机DEMO：http://git.midea.com/zhangjl38/midea-meiju-lite `master-iot-assistant`分支；
美居插件页烟机DEMO：http://git.midea.com/chenwb8/weex-kh-widgets `assistant/feature-9c-UI2.5`分支。

## 特性

该框架的核心为js功能状态管理，可使用于各类支持js的平台架构项目。通过对功能解耦，全局单例引用，使各功能模块可以在页面，组件中实现独立交互。核心代码基于proxy特性实现功能隔离，监听，基于单例模式，观察者模式实现全局功能状态管理与监听。

针对各平台插件页开发，增加了平台化的混入能力，并对各平台的部分功能接口进行抹平差异化封装。

另外提供了通道（`channel`），事务（`transaction`），工具（`tools`）的拓展能力。

### 类Vuex状态管理

各平台可提供不同的配置（`options`）来使用平台特性，各功能模块可以独立维护状态（`states`）与交互逻辑（`methods`），还可以进行初始化（`init`），监听（`watch`）与调用其他公共或独立功能模块的状态与方法。

功能模块分公共功能模块与独立功能模块。公共功能模块的状态与方法不需要通过模块名获取，独立功能的状态与方法需要通过模块名获取。通过配置中的`namespace`来声明。

```
export default {
  options: { // 初始化配置，确定该功能模块的特性
    module: 'light', // 功能名
    namespace: true
  },
  states: { // 状态
    light: 0,
    lightDisable: false
  },
  watch: { // 状态监听
    'deviceStatus': function (nVal) { // 监听其他功能模块的状态
      console('watch deviceStatus change! yeah!')
      $this.updateLight(nVal)
    }
  },
  init: function () { // 初始化
    $this = this.$light
    $this.initLightAction()
  },
  methods: {
    updateLight(data) {
      $this.light = data.light == 'off' ? false : true
      $this.lightDisable = [0, 3, 7, 9].includes(this.statusNum)
    },
    toggleLight () {
      if ($this.lightDisable) return
      this.control($this.light ? 'lightOff' : 'lightOn')() // 调用其他功能模块的方法
    },
  }
}
```

在项目的页面或组件中，独立功能模块的状态与方法可以通过`assistant.$light.lightDisable`与`assistant.$light.toggleLight()`调取。如果是公共能力模块，则可在`assistant`单例下直接调取。

### 单例开发

当所有功能模块都解耦独立出来的情况下，就需要考虑如何可以实现在整个项目中的任何一个地方都可以获取到所需要功能模块的状态或者方法。

这就基于单例模式实现了全局管理调用的能力。在页面或者组件中，均可以通过简单的`getAssistant`方法获取或创建单例。如果是Weex端开发，涉及多页面开发，那么也只需要调用`getAssistant('mutli')`即可获得与其他页面共用的状态管理单例。

```
// 页面与组件中引入
import { getAssistant } from '../../../assistant/platform/meiju/plugins/B6/index'

// 页面与组件中引入
const assistant = getAssistant()

// 多页面项目中其他页面与首页共用assistant单例
const assistant = getAssistant('mutli')

// assistant单例销毁
getAssistant('destory')

```

### 单例映射

当页面或组件只需要或只涉及某些功能模块时，我们希望在页面中只能调用到相关功能模块的状态与方法，尽量不影响其他不相关功能模块的状态时，我们可以使用单例映射。

但单例映射的情况下仍然可以调用公共功能模块的状态与方法。

```
let assistant = getAssistant() // 引入assistant单例
let astMap = assistant.getMapAssistant(['$aiLight']) // 创建单例映射体
astMap.$aiLight.aiLightChange() // 可以调取
astMap.$light.toggleLight() // 无法调取
astMap.getDeviceInfo() // 可以调取公共功能模块方法
```

### 混入(Mixins)

当没有任何优化的情况下，在页面或组件中调用assistant单例中的状态与功能，需要不断的写`assistant.$xxx.xxx`。而目前主要涉及的开发框架`Weex`与微信小程序都有混入的写法。因此框架也提供了对应的混入的写法。在两端的混入写法上，也尽量做了抹平差异。

```
// 微信小程序
import { getAssistant } from '../assistant/platform/wechat/plugins/B6/index'
import assistantBehavior from '../assistant/platform/wechat/ability/mixins/index'
Page({
  behaviors: [...assistantBehavior(assistant, [
    '$cleanKeeper.cleanKeeperList'
  ], [
    '$cleanKeeper.reset'
  ])]
})

// 美居插件页
import { getAssistant } from '../../../assistant/platform/meiju/plugins/B6/index'
import assistantMixins from '../../../assistant/platform/meiju/ability/mixins/index'
export default {
  mixins: [...assistantMixins(assistant, [
    '$cleanKeeper.cleanKeeperList'
  ], [
    '$cleanKeeper.reset'
  ])]
}
```

## 框架结构

在框架结构上，基于当前框架的使用场景，分为核心代码目录`assistant`，平台功能目录`platform`，品类功能模块目录`plugins`与常用工具目录`utils`。

### `assistant`

核心代码包括6个核心功能块：

Assistant类：创建assistant实例，完成功能模块代理，创建单例映射与单例监听能力。

assistantProxy：实现Assistant实例的代理能力，包括实例映射，states与methods代理。

Dep类：依赖收集器，是监听的核心代码之一。类Vue监听的简单实现。

observer：实现states中属性的代理，是监听的核心代码之一。

Watcher类：订阅者，是监听的核心代码之一。类Vue监听的简单实现。

index.js：提供获取与销毁单例的方法。

### `platform`

平台功能根据不同平台创建单独的平台目录，每个目录下会有`ability`平台能力集，`api`云端请求能力，`modules`平台相关功能模块及`plugin`平台品类配置。

### `plugins`

品类功能模块目录主要放置各品类平台通用的功能模块。

### `utils`

常用工具提供了`channel`通道，`console`，`tools`工具与`transaction`事务。