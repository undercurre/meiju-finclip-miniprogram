import {
  CryptoJS,
  md5,
  hasKey,
  hmacEncode,
  formatTime,
  getTimeStamp,
  aesEncrypt,
  getStamp,
  isEmptyObject,
} from 'm-utilsdk/index'
import { login, homeIndex, index, mytab, accountSafe } from '../utils/paths.js'
import { canIUseOpenEmbeddedMiniProgram } from './version'
import config from '../config'
import { baseImgApi, deviceImgApi } from '../api.js'
import { deviceImgMap } from '../utils/deviceImgMap'
import Toast from 'm-ui/mx-toast/toast'

function getNewSign(obj, apiKey, random, method = 'POST') {
  var paramStr = ''
  var params = obj
  var sha256Encode = hmacEncode[config.environment] //HmacSHA256 encode
  if (method.toUpperCase() != 'POST') {
    if (typeof params == 'string') {
      paramStr = params
    } else if (typeof params == 'object') {
      let newKeys = Object.keys(params)
      let sortKeys = newKeys.sort()
      for (let i = 0; i < sortKeys.length; i++) {
        let value
        value = params[newKeys[i]]
        paramStr = paramStr + newKeys[i] + value
      }
    } else {
      return ''
    }
    // get的各种情况处理完毕后拼接paramStr
    paramStr = apiKey + paramStr + random
  } else {
    paramStr = apiKey + JSON.stringify(obj) + random
  }
  var signStr = CryptoJS.HmacSHA256(paramStr, sha256Encode).toString()
  return signStr
}

/**
 * 电商接口签名校验
 */
function getMarketSign(obj, appid, appkey, nonceid, version, source) {
  var paramStr =
    'appid=' +
    appid +
    '&bizargs=' +
    obj +
    '&nonceid=' +
    nonceid +
    '&source=' +
    source +
    '&version=' +
    version +
    '&key=' +
    appkey
  var signStr = md5(paramStr)
  return signStr
}

//冰箱接口数据加密
function getFridgeSign(value) {
  var key = CryptoJS.enc.Utf8.parse('20160613646aBcDW')
  var encryptedData = CryptoJS.AES.encrypt(md5(value), key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  })
  encryptedData = encryptedData.ciphertext.toString()
  return encryptedData
}

//点击事件埋点
function clickBurdPoint(clickType) {
  // wx.reportAnalytics('count_click_list', {
  // click_type: clickType,
  // click_time: formatTime(new Date()),
  // })
}
const getOptions = (str) => {
  const pages = getCurrentPages()
  let currentPage = pages[pages.length - 1]
  //上一级页面
  if (str == 'prev') {
    currentPage = pages[pages.length - 2]
  }
  let options = currentPage && currentPage.options
  if (hasKey(options, 'query')) {
    // options = options.query
    if (hasKey(options.query, 'q')) {
      options = decodeURIComponent(options.query.q)
    } else {
      options = options.query
    }
  } else if (hasKey(options, 'scene')) {
    const scene = decodeURIComponent(options.scene)
    const list = scene.split('&')
    const obj = {}
    list.forEach((item) => {
      const list2 = item.split('=')
      const key = list2[0]
      const value = list2[1]
      obj[key] = value
    })
    options = obj
  }
  return options
}

const getStorageOptions = () => {
  // return JSON.parse(wx.getStorageSync('options'))
  return wx.getStorageSync('options')
}
const removeStorageOptions = () => {
  wx.removeStorageSync('options')
}
const setStorageOptions = (optionsVal) => {
  wx.removeStorageSync('options')
  // wx.setStorageSync('options', JSON.stringify(optionsVal))
  wx.setStorageSync('options', optionsVal)
}

const getPageUrl = () => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  return currentPage && currentPage.route
}
const getFullPageUrl = (str) => {
  const pages = getCurrentPages()
  let currentPage = pages[pages.length - 1]
  //上一级页面
  if (str == 'prev') {
    currentPage = pages[pages.length - 2]
  }
  const options = getOptions(str)
  const route = currentPage && currentPage.route
  let params = ''

  for (let key in options) {
    if (key) {
      params += `${key}=${options[key]}&`
    }
  }
  params = params ? params.substring(0, params.length - 1) : ''

  return params ? `${route}?${params}` : route
}

const showToast = (title, icon = 'none', duration = 3000) => {
  wx.showToast({
    title: title,
    icon: icon,
    duration: duration,
  })
}

//是否为小程序tab页面
const isTabPage = (value) => {
  let currList = ['/pages/index/index', '/pages/midea-service/midea-service', '/pages/mytab/mytab']
  let flag = false
  currList.forEach((item) => {
    if (value.indexOf(item) != -1) {
      flag = true
    }
  })
  return flag
}

const navigateToAll = (url) => {
  let isTabbar = isTabPage(url)
  if (isTabbar) {
    wx.switchTab({
      url: url,
    })
  } else {
    wx.navigateTo({
      url: url,
    })
  }
}
//设备一次性配网成功标示
function creatDeviceSessionId(uid) {
  return CryptoJS.SHA256(uid + getTimeStamp(new Date())).toString()
}
function checkWxVersion_807() {
  const version = wx.getSystemInfoSync().version
  const arr = version.split('.')
  if (parseInt(arr[0]) < 8) return false
  if (parseInt(arr[0]) >= 8 && parseInt(arr[1]) === 0 && parseInt(arr[2]) < 7) return false
  return true
}
//给url加上at(加密token)参数
function urlAddAt(url) {
  const app = getApp()
  let token = app.globalData.userData.mdata.accessToken //asscess-token
  let aesKey = app.globalData.aesKey //AES key
  let aesIv = app.globalData.aesIv
  return url.indexOf('?') > -1
    ? `${url}&at=${aesEncrypt(token, aesKey, aesIv)}`
    : `${url}?at=${aesEncrypt(token, aesKey, aesIv)}`
}
//判断url拼接加密参数前是否需要进行登录操作 token不存在需要 存在则不需要
function aesEncryptUrl(loginFlag, url) {
  const app = getApp()
  return new Promise((resolve, reject) => {
    if (loginFlag) {
      app
        .checkGlobalExpiration()
        .then((res) => {
          if (res && app.globalData.isLogon) {
            resolve(urlAddAt(url))
          } else {
            app.globalData.isLogon = false
            wx.navigateTo({
              url: login,
            })
            reject()
          }
        })
        .catch(() => {
          app.globalData.isLogon = false
          wx.navigateTo({
            url: login,
          })
          reject()
        })
    } else {
      resolve(urlAddAt(url))
    }
  })
}
/**
 * 判断是普通跳转其他小程序还是半屏形态跳转
 * @param {*} appId 要打开的小程序 appId
 * @param {*} path 打开的页面路径，如果为空则打开首页
 * @param {*} extra 需要传递给目标小程序的数据
 * @param {*} envVersion 要打开的小程序版本。仅在当前小程序为开发版或体验版时此参数有效
 */
function judgeWayToMiniProgram(appId, path, extra, envVersion) {
  let defaultExtraData = {
    jp_source: 'midea-meiju-lite',
    jp_c4a_uid: getApp()?.globalData?.userData?.uid,
    jp_rand: getStamp(),
  }
  let extraData = defaultExtraData
  if (extra && JSON.stringify(extra) !== '{}') {
    extraData = Object.assign({}, defaultExtraData, extra)
  }
  console.log('跳转小程序携带参数:', extraData)
  if (canIUseOpenEmbeddedMiniProgram()) {
    OpenEmbeddedMiniProgram(appId, path, extraData, envVersion)
  } else {
    navigateToMiniProgram(appId, path, extraData, envVersion)
  }
}
//半屏形态跳转其他小程序
function OpenEmbeddedMiniProgram(appId, path, extra, envVersion) {
  wx.openEmbeddedMiniProgram({
    appId: appId,
    path: path,
    extraData: extra ? extra : {},
    envVersion: envVersion ? envVersion : 'release', //develop/trial/release
    success(res) {},
    fail(err) {
      console.log(err, 'openEmbeddedMiniProgram')
    },
  })
}
//普通跳转其他小程序
function navigateToMiniProgram(appId, path, extra, envVersion) {
  wx.navigateToMiniProgram({
    appId: appId,
    path: path,
    extraData: extra,
    envVersion: envVersion ? envVersion : 'release', //develop/trial/release
    success(res) {},
  })
}
/**
 * @description 校验用户权限
 * @param {Object} params currentHomeInfo-当前家庭信息 permissionText-权限提示弹窗文案 callback-点击确定回调
 *
 */
const checkFamilyPermission = (params = {}) => {
  const { currentHomeInfo, permissionText, callback } = params
  if (currentHomeInfo.roleId === '1003') {
    if (permissionText && !isEmptyObject(permissionText)) {
      if (permissionText.showTip && permissionText.showTip == 'toast') {
        Toast({ context: this, position: 'bottom', message: permissionText.content })
      } else {
        wx.showModal({
          title: permissionText.title,
          content: permissionText.content,
          confirmText: permissionText.confirmText,
          showCancel: false,
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
              callback && callback()
            }
          },
        })
      }
    }
    return false
  }
  return true
}

// v1版本获取icon
function getIcon(device, iconArr, currApplianceList, spidList = {}) {
  if (device.name.includes('小天鹅双洗站')) {
    debugger
  }
  let defaultImg = baseImgApi.url + 'scene/sence_img_lack.png'
  let imgPath = ''
  let sn8 = ''
  let deviceModelNumber = ''
  // eslint-disable-next-line no-unused-vars
  let { applianceType, modelNum, applianceCode, smartProductId } = device
  applianceType = applianceType || device['type']
  currApplianceList.forEach((item) => {
    if (item.applianceCode == applianceCode) {
      sn8 = item.sn8 || ''
      deviceModelNumber = item.modelNumber
    }
  })
  if (applianceType == '0x21' && deviceModelNumber) {
    sn8 = deviceModelNumber
  }
  if (applianceType == '0x16') {
    return baseImgApi.url + 'scene/sence_img_light_group.png'
  }
  applianceType = applianceType && applianceType.split('0x')[1]
  let list = iconArr[applianceType] || ''
  let keyName = sn8
  if (!list) {
    return defaultImg
  }
  let spidObj = smartProductId && spidList ? spidList[smartProductId] : null
  if (spidObj) {
    imgPath = spidObj.icon
  } else if (Object.keys(list).includes(keyName)) {
    imgPath = list[keyName]['icon']
  } else if (list.common.icon) {
    imgPath = list.common.icon
  } else if (hasKey(deviceImgMap, applianceType.toLocaleUpperCase())) {
    //品类图
    imgPath = deviceImgApi.url + 'blue_' + applianceType.toLocaleLowerCase() + '.png'
  } else {
    //缺省图
    imgPath = deviceImgApi.url + 'blue_default_type.png'
  }
  // imgPath = Object.keys(list).includes(keyName) ? list[keyName]['icon'] : list.common.icon
  return imgPath || defaultImg
}

//检查当前是否有网络
function checkNetwork(callback) {
  wx.getNetworkType({
    success(res) {
      let { networkType } = res
      if (networkType != 'none' && networkType != 'unknown') {
        callback()
      } else {
        wx.showToast({
          title: '网络未连接，请检查您的网络设置',
          icon: 'none',
        })
      }
    },
  })
}

//网络全局监听网络情况
function onNetworkStatusChange() {
  var that = this
  wx.getNetworkType({
    success: function (res) {
      const networkType = res.networkType
      //不为none代表有网络
      if (networkType != 'none' || networkType != 'unknown') {
        that.globalData.noNetwork = false
        //网络状态变化事件的回调函数   开启网络监听，监听小程序的网络变化
        wx.onNetworkStatusChange(function (resp) {
          console.log('监听网络变化app-------->', resp)
          if (resp.isConnected) {
            //网络变为有网s
            that.globalData.noNetwork = false
          } else {
            //网络变为无网
            that.globalData.noNetwork = true
          }
        })
      } else {
        that.globalData.noNetwork = true
        //无网状态
        wx.onNetworkStatusChange(function (resp) {
          console.log('监听网络变化app-------->', resp)
          if (resp.isConnected) {
            that.globalData.noNetwork = false
          } else {
            that.globalData.noNetwork = true
          }
        })
      }
    },
  })
}

function preventDoubleClick(time = 300) {
  console.log('防重-------->')
  let lastClickTime = 0
  return function () {
    const currentTime = Date.now()
    console.log(currentTime)
    console.log(lastClickTime)
    if (currentTime - lastClickTime < time) {
      // 如果在指定的间隔时间内点击了，则返回false，表示点击被阻止
      return false
    } else {
      // 如果超出指定间隔时间，则更新时间并返回true，表示点击被允许
      lastClickTime = currentTime
      return true
    }
  }
}

//全局路由监听 // 清除指定 customCallback  ft.offCustomEvent(customCallback) // 清除所有 customCallback //ft.offCustomEvent(）
const onBackPressKey = 'handleBackToIndex'
const appRoutefun = (res) => {
  console.log('路由监听---------->', res)
  let { openType, path } = res
  if (openType == 'reLaunch' && (path != homeIndex || path != mytab || path != accountSafe)) {
    try {
      //先清处
      ft.offCustomEvent(customCallback)
      //在监听
      ft.setPathMarkForBackPress({ path: onBackPressKey })
      //ft.addCustomEventListener('onBackPress', customCallback)
      ft.onCustomEvent(customCallback)
    } catch (error) {
      console.error('onCustomEvent监听 error-------->', error)
    }
  }
}

const customCallback = (resp) => {
  console.log('左滑事件监听---------->', resp)
  if (resp.event == 'onBackPress' && resp.data?.path == onBackPressKey) {
    if (getCurrentPages().length > 1) {
      ft.setPathMarkForBackPress({ path: onBackPressKey })
      wx.navigateBack()
    } else {
      ft.offCustomEvent(customCallback)
      //ft.removeCustomEventListener('onBackPress', () => {})
      wx.switchTab({
        url: index,
      })
    }
  }
}

module.exports = {
  getNewSign, //new sign
  getMarketSign,
  getFridgeSign,
  clickBurdPoint,
  getOptions,
  showToast,
  getPageUrl,
  isTabPage,
  navigateToAll,
  getFullPageUrl,
  creatDeviceSessionId,
  setStorageOptions, //保存options
  getStorageOptions, //获取options
  removeStorageOptions, //清除options
  checkWxVersion_807,
  aesEncryptUrl,
  judgeWayToMiniProgram,
  navigateToMiniProgram,
  checkFamilyPermission,
  getIcon,
  checkNetwork,
  onNetworkStatusChange,
  preventDoubleClick,
  appRoutefun,
}
