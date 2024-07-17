let commonMixin = require('./commonMixin')
let deviceMixin = require('./deviceMixin')
import {
  getPath,
  fetch,
  isObject
} from '../util'
import {
  useLocalData,
  isProd
} from '../request.consts'
import PluginStorage from '../../assets/js/model/PluginStorage'
// import {
//   clickEventTracking
// } from '../../../../track/track'
const app = getApp() //获取应用实例
const clickEventTracking = app.getGlobalConfig().pluginEventTrack
import ResultUtil from '../../assets/js/model/ResultUtil'
import Result from '../../assets/js/model/Result'

const systemInfo = wx.getSystemInfoSync()
const jsonFileSuffix = (isProd ? '' : '_sit') + '.json'
const JSON_RESPONSE_KEY = 'device_configs'
const DATA_VERSION_KEY = 'timestamp'

module.exports = Behavior({
  behaviors: [commonMixin, deviceMixin],
  data: {
    theme: 'light',
    _theme: '_light',
    systemInfo,
    deviceImageHeightRpx: 0,
    contentHeightRpx: (750 * systemInfo['screenHeight'] / systemInfo['screenWidth']).toFixed(2) - 632,
    statusBarHeight: systemInfo['statusBarHeight'], //顶部状态栏的高度
    sn8: null,
    cbsVersion: '',
    deviceInfo: null,
    imageUrlPrefix: null,
    pluginData: null,
    fromShare: 0,
    backTo: null,
    showOperationalEntrance: true,
    loadingPluginData: true
  },
  created() {
    console.log('created pageMixin')
    // console.log('created systemInfo', systemInfo)
    this.resetTimestamp()
    this.resetTimestamp('loadingTimestamp')
  },
  methods: {
    _eventTracking(event, method, params = {}) {
      const {
        sn8,
        type,
        applianceCode
      } = this.data.deviceInfo
      const defaultParams = {
        sn8,
        type,
        applianceCode
      }
      clickEventTracking(event, method, this.formatParams(params), defaultParams)
    },
    clickTracking(method, params) {
      this._eventTracking('user_behavior_event', method, params)
    },
    pageViewTracking(params, method = "onLoad", ) {
      this._eventTracking('user_page_view', method, params)
    },
    formatParams(params) {
      let _params = {}
      for (let key in params) {
        if (typeof params[key] === 'object') {
          _params[key] = JSON.stringify(params[key])
          continue
        }
        _params[key] = params[key]
      }
      return _params
    },
    back(delta = 0) {

      if (this.data.backTo) {
        this.reLaunch(this.data.backTo)
        return
      }

      wx.navigateBack({
        delta,
      })
    },
    reLaunch(url) {
      wx.reLaunch({
        url
      })
    },
    setPageTitle(title) {
      wx.setNavigationBarTitle({
        title
      })
    },
    showModal(content, options = {}, confirmCallback = () => {}, cancelCallback = () => {}) {
      wx.showModal({
        content,
        title: "温馨提示",
        ...options,
        success(res) {
          if (res.confirm) {
            confirmCallback()
          } else {
            cancelCallback()
          }
        }
      })
    },

    async getUrlparams(options, methods = {}) {
      let {
        backTo,
        fromShare,
        deviceInfo
      } = options
      if (backTo) {
        this.data.backTo = options.backTo
      }

      if (fromShare) {
        this.setData({
          fromShare
        })
      }
      if (deviceInfo) {
        deviceInfo = JSON.parse(decodeURIComponent(deviceInfo))
        const {
          sn8
        } = deviceInfo

        // mock
        // deviceInfo.type = '0xBF'
        // deviceInfo.sn8 = '70000695'
        // deviceInfo.type = '0x9B'
        // deviceInfo.sn8 = '71100258'

        this.setData({
          deviceInfo,
          sn8
        })

        console.log('getUrlparams => 之前耗时：', this.getTime())
        this.ps = new PluginStorage()
        this.ps.initSn8(this.data.sn8)

        this.init(methods)
        return
        console.log('getUrlparams => getCbsVersion start!')
        this.resetTimestamp('cbsVersionTimestamp')
        this.data.cbsVersion = await this.getCbsVersion()
        console.log('getCbsVersion 执行完毕 => 耗时：', this.getTime('cbsVersionTimestamp'))

        if (callback) {
          callback()
        }

        const initFun = useLocalData ? 'getPluginData' : 'getSn8Whitelist'
        this[initFun]();
      }
    },

    fetch,

    async init({
      callback
    }) {
      try {
        const getPluginDataFunctionName = useLocalData ? 'getLocalPluginData' : 'getPluginDataFromStorage'

        const parallelPromisesResults1 = await this.parallelPromises([
          'getCbsVersionFromStorage'
        ])
        const [getCbsVersionFromStorageResult] = ResultUtil.getData(
          parallelPromisesResults1)
        if (!ResultUtil.isSuccess(getCbsVersionFromStorageResult)) {
          // 若cbsVersion未缓存，则串行执行以下流程
          await this.serialPromises(['renderingQuery', getPluginDataFunctionName], true)
        } else {
          // 反之，并行执行
          const parallelPromisesResults2 = await this.parallelPromises([getPluginDataFunctionName,
            'renderingQuery'
          ])
          const [dataQueryResult, getPluginDataResult] = ResultUtil.getData(parallelPromisesResults2)
        }

        if (callback) {
          callback()
        }
      } catch (error) {
        console.log('init => e: ', error)
      }
    },

    autoExecuteCallback(functionNameArray, results, reverse = false) {
      let callbacks = results.map((result, index) => {
        let callbackName = ResultUtil.getCallbackName(result) || functionNameArray[index]
        let params = null
        if (ResultUtil.isSuccess(result)) {
          callbackName += 'Success'
          params = ResultUtil.getData(result)
        } else {
          callbackName += 'Fail'
          params = callbackName + ': ' + ResultUtil.getMsg(result)
        }
        callbackName += 'Callback'
        return {
          name: callbackName,
          params
        }
      })

      if (reverse) {
        callbacks = callbacks.reverse()
      }

      callbacks.map(item => {
        const callbackName = item['name']
        if (this[callbackName]) {
          this[callbackName](item['params'])
        }
      })
    },

    parallelPromises(functionNameArray) {
      return new Promise((resolve, reject) => {
        this.resetTimestamp()
        const promises = functionNameArray.map(functionName => this[functionName]())
        Promise.all(promises)
          .then(results => {
            this.autoExecuteCallback(functionNameArray, results)
            console.log(`parallelPromises: ${functionNameArray.toString()} => 耗时：`, this.getTime())
            resolve(ResultUtil.success(results))
          })
          .catch(e => {
            console.log('functionNameArray', functionNameArray.toString())
            console.log('parallelPromises => e: ', e)
            resolve(ResultUtil.fail(null, e))
          })
      })
    },

    async serialPromises(functionNameArray, callbackExecuteOrderReverse = false) {
      try {
        this.resetTimestamp()
        let results = []
        for (let i in functionNameArray) {
          const functionName = functionNameArray[i]
          const result = await this[functionName]()
          results.push(result)
        }
        this.autoExecuteCallback(functionNameArray, results, callbackExecuteOrderReverse)
        console.log(`serialPromises: ${functionNameArray.toString()} => 耗时：`, this.getTime())
        return results
      } catch (e) {
        console.log('serialPromises => e: ', e)
      }
    },

    getCbsVersionFromStorage() {
      return new Promise((resolve, reject) => {
        this.resetTimestamp('getCbsVersionFromStorageTimestamp')
        this.ps.getCbsVersionData().then(res => {
            const {
              applianceCode
            } = this.data.deviceInfo
            if (res.data && res.data[applianceCode] !== undefined) {
              this.setCbsVersion(res.data[applianceCode])
              console.log('getCbsVersionFromStorage => cbsVersion: ', res.data[applianceCode])
              console.log(`getCbsVersionFromStorage => 成功耗时：`, this.getTime(
                'getCbsVersionFromStorageTimestamp'))
              resolve(ResultUtil.success(res.data[applianceCode], res.errMsg))
              return
            }
            console.log('getCbsVersionFromStorage => cbsVersion: ', '未缓存')
            console.log(`getCbsVersionFromStorage => 成功耗时：`, this.getTime(
              'getCbsVersionFromStorageTimestamp'))
            resolve(ResultUtil.fail(null))
          })
          .catch(err => {
            console.log(`getCbsVersionFromStorage => 失败耗时：`, this.getTime(
              'getCbsVersionFromStorageTimestamp'))
            resolve(ResultUtil.fail(null, err))
          })
      })
    },

    setCbsVersion(cbsVersion) {
      this.data.cbsVersion = cbsVersion
      this.ps.setCbsVersion(cbsVersion)
    },

    updateStorageCbsVersion(cbsVersion) {
      if (cbsVersion == undefined) {
        return
      }
      this.setCbsVersion(cbsVersion)
      this.ps.getCbsVersionData()
        .then(res => {
          this.shouldUpdateCbsVersion(res.data, cbsVersion)
        })
        .catch(err => {
          this.shouldUpdateCbsVersion(null, cbsVersion)
        })
    },

    shouldUpdateCbsVersion(cbsVersions, cbsVersion) {
      const {
        applianceCode
      } = this.data.deviceInfo
      if (!isObject(cbsVersions)) {
        cbsVersions = {}
      }

      if (cbsVersions[applianceCode] == cbsVersion) {
        return
      }

      cbsVersions[applianceCode] = cbsVersion
      this.ps.setCbsVersionData(cbsVersions)
    },

    filterJsonConfigedSn8(typeArray, sn8, type) {
      const applianceType = type.substr(2) // for exmaple: B0
      const sn8Array = typeArray[applianceType]

      if (!sn8Array) {
        return null
      }

      for (let item of sn8Array) {
        const sn8s = item.split(',')
        if (sn8s.indexOf(sn8) === -1) {
          continue
        }
        return sn8s[0]
      }

      return null
    },

    getSn8() {
      return this.jsonConfigedSn8 || this.data.deviceInfo.sn8
    },

    getJsonFilename() {
      const filenameVersion = this.data.cbsVersion ? '_' + this.data.cbsVersion : ''
      return this.getSn8() + filenameVersion
    },

    getRecipeCommonParams() {
      return {
        sn8: this.data.deviceInfo.sn8,
        cbsVersion: this.data.cbsVersion
      }
    },

    getLocalPluginData() {
      const jsonPath = `../../assets/js/config/sn8/${this.getJsonFilename()}`
      const modeDefaultSettingsPath = '../../assets/js/config/global_config';
      return new Promise((resolve, reject) => {
        Promise.all([
            this._require(jsonPath),
            this._require(modeDefaultSettingsPath)
          ])
          .then(results => {
            resolve(ResultUtil.success(results))
          })
          .catch(e => {
            console.error('getLocalPluginData e', e)
            resolve(ResultUtil.fail(null, e))
          })
      })
    },

    getLocalPluginDataSuccessCallback(data) {
      this.handleResult(data)
    },

    getPluginDataFromStorage() {
      return new Promise((resolve, reject) => {
        this.resetTimestamp('getPluginDataFromStorageTimestamp')
            this.getPluginDataFromCloud()
              .then(result => {
                resolve(result)
              })
              .catch(e => {
                resolve(e)
              })
      })
    },

    getPluginDataFromStorageSuccessCallback(data) {
      this.handleResult(data)
    },

    getCloudPluginDataParams(sn8 = this.data.sn8, cbsVersion = this.data.cbsVersion) {
      console.log("sn8:   ", sn8, "cbsVersion: ",cbsVersion);
      let params = {
        sn8,
        cbsVersion
      }
      return params
    },

    getPluginDataFromCloud() {
      return new Promise((resolve, reject) => {
        Promise.all([
            this.fetch('pluginDataNew', this.getCloudPluginDataParams()),
            this.fetch('pluginData', this.getCloudPluginDataParams('global_config', ''))
          ]).then(result => {
            resolve(ResultUtil.success(result, null, 'getPluginDataFromCloud'))
          })
          .catch(e => {
            console.log('getPluginDataFromCloud e: ', e)
            resolve(ResultUtil.fail(null, e, 'getPluginDataFromCloud'))
          })
      })
    },

    getPluginDataFromCloudSuccessCallback(data) {
      this.handleResult(data, true)
    },

    getPluginDataFromCloudFailCallback(e) {
      this.showModal(e)
    },

    handleResult(result, fromCloud = false) {
      const [/*pluginData,*/ pluginDataNew, pluginCommonData ] = result

      console.log("parallelPromises =>", {fromCloud, pluginDataNew})
      let pluginData = fromCloud ? this.transformPluginDataNew(pluginDataNew) : pluginDataNew

      this.handlePluginData(pluginData, fromCloud)
      this.handlePluginCommonData(pluginCommonData, fromCloud)
      this.setData({
        loadingPluginData: false
      })
      const message = fromCloud ? '插件云端数据' : '插件缓存'
      console.log(`${message}加载 => 累积耗时：`, this.getTime('loadingTimestamp'))
    },

     // 将低代码平台数据转换为小程序所需数据格式
     transformPluginDataNew(pluginDataNew) {
      let {
        device_configs: {
          modes,
          general,
          groups,
          images
        }
      } = pluginDataNew
      let MODES = {};
      let carousel = [];
      let config = {
        "toasts": [
            "deviceFailure",
            "childLockOn",
            "doorOpened"
        ]
      };
      let linkButtons = [
        {
            "buttonText": "食谱",
            "buttonIcon": "https://www.smartmidea.net/projects/meiju-lite-assets/plugin/0xBX/common/recipe.png",
            "method": "jumpToRecipeHome"
        },
          {
              "buttonText": "美的商城",
              "buttonIcon": "https://www.smartmidea.net/projects/sit/meiju-lite-assets/plugin/0xBX/common/shopping_mall.png",
              "route": "/page/index/index",
              "method": "openMiniProgram",
              "miniProgramName": "mideaShoppingMall"
          }
      ];
      // 电子说明书
      if(general && general.mideaInstructionId) {
        let mideaInstruction =  {
            "buttonText": "电子说明书",
            "buttonIcon": "https://www.smartmidea.net/projects/sit/meiju-lite-assets/plugin/0xBX/common/midea_instruction.png",
            "route": "pages/instructions/instructions",
            "method": "openMiniProgram",
            "miniProgramName": "mideaInstruction",
            "params": {
                "id": general.mideaInstructionId
            }
        };
        linkButtons.unshift(mideaInstruction)
      }
      let pages = {index: {images,linkButtons}};
      let tabs = [];
      modes.forEach((item,index) => {
        let params = this.transformSettings(item.settings, item.options)
        MODES[item.sequence] = {
          description: item.modeTipsSetting.summary,
          editable: params.editable,
          icon: item.icon,
          icontext: item.icontext,
          modeKey: item.modeKey,
          cloudmenuid: item.cloudmenuid,
          name: item.name,
          settings: params.settings,
          validations: item.validations,
          beforeValidations: item.validations,
          afterValidations: item.validationsContinue,
          startAlertTips: item.tipsBeforeStart,
        }
      })
      
      let groupArr = groups[0];
      for(let x=0; x<groupArr.length; x++) {
        let cookingModeArr = [];
        let newModes = [];
        if(groupArr[x].tabKey == "cookingModes" || groupArr[x].tabKey == "cleanService"){
          cookingModeArr = groupArr[x].blocks;
          for (let i = 0; i < cookingModeArr.length; i++) {
            let itemModes = cookingModeArr[i].modes;
            if(itemModes.length){
              for (let j = 0; j < itemModes.length; j++) {
                newModes.push({modeId: itemModes[j], type: 1})
                carousel.push({modeId: itemModes[j], type: 1})
              }
            }
          }
          if(newModes.length) {
            tabs[x] = { title: groupArr[x].tabName ? groupArr[x].tabName : "贴心功能", modes: newModes}
          }
        }
      }
      console.log("handleResult---数据转换", { MODES, carousel, config, pages, tabs,groups:tabs })
      return {
        cbsVersion: pluginDataNew.cbsVersion,
        device_configs: { MODES, carousel, config, pages, tabs, groups:tabs }
      }
    },
    // 低代码模式settings转换
    transformSettings(data, options) {
      let settings = {}
      let editable = true
      // preheat quantity steamAmount firePower temperature hotWind weight time upTubeTemp downTubeTemp gear
      if (data.degree) {
        if (data.degree.upDownTempMaxDifference) {
          settings.upDegree = settings.downDegree = this.transformMainSetting(data.degree)
        } else {
          settings.temperature = this.transformMainSetting(data.degree)
          if (!data.degree.editable || !data.degree.editable.length) editable = false
        }
      }
      if (data.weight) settings.weight = this.transformMainSetting(data.weight)
      if (data.quantity) settings.quantity = this.transformMainSetting(data.quantity)
      if (data.firepower) settings.firePower = this.transformOptionsSetting(data.firepower, "fire_power", "微波火力")
      if (data.gear) settings.gear = this.transformOptionsSetting(data.gear, "temperature_gear", "温度档位")
      if (data.steam) settings.steamAmount2 = this.transformOptionsSetting(data.steam, "steamAmount", "蒸汽")

      if (data.time) {
        settings.time = {
          "default": this.transformTime(data.time.default),
          "min": this.transformTime(data.time.min),
          "max": this.transformTime(data.time.max)
        }
        if (!data.time.editable || !data.time.editable.length) editable = false
      }

      if (options && options.length > 0) {
        options.forEach((item) => {
          if (item.key === "preheat") {
            settings.preheat = {
              "default": item.default  ? "on" : "off",
              "expression": item.expression ? item.expression.replace("degree", "temperature") : "",
              "editForbidden": true
            }
          }
          if (item.key === "hotwind") {
            settings.hotWind = {
              "default": item.default  ? "on" : "off",
              "expression": item.expression ? item.expression.replace("degree", "temperature") : "",
              "editForbidden": true
            }
          }
          if (item.key === "steam") {
            settings.steamAmount = this.transformOptionsSetting(item, "steamAmount", "蒸汽")
          }
          if (item.key === "firepower") {
            settings.firePower2 = this.transformOptionsSetting(item, "fire_power", "微波火力")
          }
          if (item.key === "gear") {
            settings.gear2 = this.transformOptionsSetting(item, "temperature_gear", "温度档位")
          }
        });
      }
      return {settings, editable}
    },
    transformTime(data) {
      // 存在["2", "0", ""]类似的空字符串
      data = data.map(item => item || "0")
      return data.join(":")
    },
    transformMainSetting(data) {
      return {
        unit: data.unit,
        default: data.default,
        range: data.range.map(item => {
          return [item.min, item.max, item.step]
        })
      }
    },
    transformOptionsSetting(data, lua_key, name) {
      return {
        "unit": data.unit,
        "default": data.default,
        "mapValues": data.mapValues,
        "name": data.name || name,
        "opened": false,
        "type": 2,
        "key": lua_key
      }
    },

    getJson(data, cache = true) {
      if (useLocalData) {
        return data
      }

      const timestamp = data[DATA_VERSION_KEY]
      return Object.assign({}, data[JSON_RESPONSE_KEY], {
        timestamp
      })
    },

    isSameVersion(cloudData, dataKey) {

      if (!this.data[dataKey]) {
        return false
      }

      const cloudTimestamp = cloudData[DATA_VERSION_KEY]
      const storageTimestamp = this.data[dataKey][DATA_VERSION_KEY]
      return cloudTimestamp === storageTimestamp
    },

    isStorageDataLate(dataKey, fromCloud) {
      return this.data[dataKey] && !fromCloud
    },

    handlePluginData(data, fromCloud) {
      const pluginData = this.getJson(data)
      if (!pluginData) {
        return
      }

      if (this.isStorageDataLate('pluginData', fromCloud)) {
        return
      }

      if (this.isSameVersion(pluginData, 'pluginData')) {
        return
      }

      if (fromCloud) {
        this.ps.setPluginData(data)
      }

      const config = pluginData['config']
      if (config && config['theme']) {
        this.setData({
          theme: config['theme'],
          _theme: "_" + config['theme']
        })
      }

      this.setData({
        pluginData
      })
      console.log("pluginData: ",pluginData)
      this.setPageData()
    },

    handlePluginCommonData(data, fromCloud) {
      const pluginCommonData = this.getJson(data)
      if (!pluginCommonData) {
        return
      }

      if (this.isStorageDataLate('pluginCommonData', fromCloud)) {
        return
      }

      if (this.isSameVersion(pluginCommonData, 'pluginCommonData')) {
        return
      }

      if (fromCloud) {
        this.ps.setPluginCommonData(data)
      }

      this.setData({
        pluginCommonData
      })
    },

    _require(file) {
      return new Promise((resolve, reject) => {
        const {
          json
        } = require(file)
        resolve(json)
      })
    },

    setPageData() {
      const pageName = this.getCurrentPageName();
      const pageData = this.data.pluginData['pages'][pageName];
      if (pageData) {
        this.setData({
          pageData
        })
      }
      console.log("pageData:",pageData)
    },

    getPageDelta(route) {
      const pages = getCurrentPages();
      for (let index in pages) {
        if (pages[index].route == route) {
          return pages.length - (parseInt(index) + 1)
        }
      }
    },

    getCurrentPage() {
      const pages = getCurrentPages();
      return pages.pop()
    },

    getCurrentPageName() {
      return this.getCurrentPage().route.split('/').pop()
    },

    getPath,

    onOperationalEntranceCloseClicked() {
      this.setData({
        showOperationalEntrance: false
      })
    },

    setState(key, value) {
      let state = {}
      state[key] = value
      this.setData(state)
    },

    setObject(objectName, o = null) {
      if (!o) {
        return
      }

      Object.assign(this.data[objectName], o)
      this.setState(objectName, this.data[objectName])
    },

    attached() {}
  }
})
