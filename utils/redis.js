/**
 * 设置
 * v 值value
 */
const setTokenStorage = (token, expired) => {
  const setStorageList = [
    {
      key: 'MPTOKEN',
      value: token,
    },
    {
      key: 'MPTOKEN_EXPIRATION',
      value: expired,
    },
  ]
  wx.nextTick(() => {
    for (let i = 0, len = setStorageList.length; i < len; i++) {
      wx.setStorage({
        key: setStorageList[i].key,
        data: setStorageList[i].value,
      })
    }
  })
}
//保存tokenPwd
const setTokenPwdStorge = (expiredDate, tokenPwd) => {
  const setStorageList = [
    {
      key: 'MPTOKEN_AUTOLOGIN_EXPIRATION',
      value: expiredDate,
    },
    {
      key: 'MPTOKENPWD',
      value: tokenPwd,
    },
  ]
  wx.nextTick(() => {
    for (let i = 0, len = setStorageList.length; i < len; i++) {
      wx.setStorage({
        key: setStorageList[i].key,
        data: setStorageList[i].value,
      })
    }
  })
}
//缓存黑白名单
const setPluginFilter = (pluginFilterS_N8, pluginFilter_type) => {
  const setStorageList = [
    {
      key: 'pluginFilterS_N8',
      value: pluginFilterS_N8,
    },
    {
      key: 'pluginFilter_type',
      value: pluginFilter_type,
    },
  ]
  wx.nextTick(() => {
    for (let i = 0, len = setStorageList.length; i < len; i++) {
      wx.setStorage({
        key: setStorageList[i].key,
        data: setStorageList[i].value,
      })
    }
  })
}
//缓存当前家庭id和设备列表的信息
const setApplianceListConfig = (homeId, supportedApplianceList, unsupportedApplianceList, boughtDevices) => {
  // if (getApp().globalData?.userData?.uid) {
  //let getApplianceListConfig = {}
  if (wx.getStorageSync('applianceListConfig')) {
    wx.removeStorageSync('applianceListConfig')
    // getApplianceListConfig = wx.getStorageSync('applianceListConfig')
    // if (getApplianceListConfig.uid != getApp().globalData.userData.uid) {
    // getApplianceListConfig = {}
    // }
  }
  let homeStorage = {
    // uid: getApp().globalData.userData.uid,
  }
  if (!homeStorage[homeId]) {
    homeStorage[homeId] = {
      supportedApplianceList: [],
      unsupportedApplianceList: [],
      boughtDevices: [],
    }
  }
  homeStorage[homeId]['supportedApplianceList'] = supportedApplianceList
  homeStorage[homeId]['unsupportedApplianceList'] = unsupportedApplianceList
  homeStorage[homeId]['boughtDevices'] = boughtDevices
  // let applianceListConfig = {
  // ...homeStorage,
  // ...getApplianceListConfig,
  // }
  //console.log('缓存家庭设备信息', homeStorage)
  wx.setStorageSync('applianceListConfig', homeStorage)
  wx.setStorageSync('currentHomeGroupId', homeId)
}

//保存会员信息
const setVipUserInfo = (vipUserInfo) => {
  //先清除，再保存
  if (wx.getStorageSync('vipUserInfo')) wx.removeStorageSync('vipUserInfo')
  wx.setStorageSync('vipUserInfo', vipUserInfo)
}
//缓存当前家庭
const getCurrentHomeGroupId = () => {
  return wx.getStorageSync('currentHomeGroupId')
}
//获取当前家庭设备数据
const getApplianceListConfig = () => {
  return wx.getStorageSync('applianceListConfig')
}
//缓存家庭列表
const setHomeGrounpList = (homeList) => {
  //先清除，再保存
  if (wx.getStorageSync('homeGrounpList')) wx.removeStorageSync('homeGrounpList')
  wx.setStorageSync('homeGrounpList', homeList)
}
//获取混存家庭列表
const getStrogeHomeGrounpList = () => {
  return wx.getStorageSync('homeGrounpList')
}
//缓存确权状态
const setBatchAuthList = (batchAuthList) => {
  //先清除，再保存
  if (wx.getStorageSync('batchAuthList')) wx.removeStorageSync('batchAuthList')
  wx.setStorageSync('batchAuthList', batchAuthList)
}
//获取换确权状态
const getStrogeBatchAuthList = () => {
  return wx.getStorageSync('batchAuthList')
}

//缓存设备图标
const setDcpDeviceImg = (dcpDeviceImgList, spidDeviceImgList) => {
  //先清除，再保存
  if (wx.getStorageSync('dcpDeviceImgList')) wx.removeStorageSync('dcpDeviceImgList')
  if (wx.getStorageSync('spidDeviceImgList')) wx.removeStorageSync('spidDeviceImgList')
  wx.setStorageSync('dcpDeviceImgList', dcpDeviceImgList)
  wx.setStorageSync('spidDeviceImgList', spidDeviceImgList)
}

//设置弹框显示的间隔时间
const setDialogIntervalTime = (v) => {
  return new Promise((resolve) => {
    let timestamp = Date.parse(new Date())
    let expiration = timestamp + 2 * 60 * 60 * 1000 //2小时重新显示弹框
    // let expiration = timestamp + 60*1000 //测试1分钟重新显示弹框
    wx.setStorageSync(v, expiration)
    resolve()
  })
}
//设置弹框显示的间隔时间
const setToastIntervalTime = (v, time) => {
  return new Promise((resolve) => {
    let timestamp = Date.parse(new Date())
    let expiration = timestamp + time * 60 * 60 * 1000 //24小时重新显示弹框
    wx.setStorageSync(v, expiration)
    resolve()
  })
}
//校验间隔时间是否超过4小时
const checkDialogIntervalTime = (v) => {
  let deadtime = parseInt(wx.getStorageSync(v))
  let timestamp = Date.parse(new Date())
  return deadtime > timestamp ? true : false
}

//校验弹框的间隔为一天一次
const checkDialogOneDayOneTime = (v) => {
  let deadtime = wx.getStorageSync(v)
  // let timestamp = Date.parse(new Date())
  let nowTime = new Date()
  let strTime = nowTime.toLocaleDateString()
  console.log('校验每天一次', strTime, deadtime)
  if (!deadtime) return true
  return deadtime === strTime ? false : true
}

//设置弹框每天显示一次
const setToastIntervalOneDayOneTime = (v) => {
  return new Promise((resolve) => {
    let nowTime = new Date()
    let strTime = nowTime.toLocaleDateString()
    console.log('设置每天一次', strTime)
    wx.setStorageSync(v, strTime)
    resolve()
  })
}
/**
 * 获取
 * k 键key
 */
const checkTokenExpir = (mptoken, MPTOKEN_EXPIRATION) => {
  let deadtime = parseInt(MPTOKEN_EXPIRATION)
  let timestamp = Date.parse(new Date())
  return mptoken && deadtime > timestamp ? true : false
}

/**
 * 保存用户信息
 */
const setUserInfo = (userInfo) => {
  wx.setStorage({
    key: 'userInfo',
    data: userInfo,
  })
}

/**
 * 清除用户信息
 */
const removeUserInfo = () => {
  wx.removeStorageSync('userInfo')
}

/**
 * 删除
 */
const remove = (k1, k2) => {
  wx.removeStorageSync(k1)
  wx.removeStorageSync(k2)
}

/**
 * 清除所有key
 */
const clearStorageSync = () => {
  wx.clearStorageSync()
}
/**
 * 退出登录清除除多云以及首页弹窗提示之外外的别的参数
 */
const removeStorageSync = () => {
  let StorageInfoList = wx.getStorageInfoSync().keys
  let filterList = ['cloudRegion', 'cloudGlobalModule', 'PROMPTPOPUP']
  let clearInfoList = StorageInfoList.filter((a, i) => {
    return filterList.every((f) => f != a)
  })
  clearInfoList.map((item) => {
    if (!item.includes('version_')) {
      // 版本升级有本地缓存，退出登录会清除记录，所以不能清掉
      wx.removeStorageSync(item)
    }
  })
}

/**
 * 清除除多云缓存
 */
const removeCloudSync = () => {
  wx.removeStorageSync('cloudRegion')
  wx.removeStorageSync('cloudGlobalModule')
}

const setIsAutoLogin = (isAutoLogin) => {
  wx.nextTick(() => {
    wx.setStorage({
      key: 'ISAUTOLOGIN',
      data: isAutoLogin,
    })
  })
}

const setAutonInfo = (phoneNumber, tokenPwd, uid) => {
  const setStorageList = [
    {
      key: 'phoneNumber',
      value: phoneNumber,
    },
    {
      key: 'tokenPwd',
      value: tokenPwd,
    },
    {
      key: 'uid',
      value: uid,
    },
  ]
  wx.nextTick(() => {
    for (let i = 0, len = setStorageList.length; i < len; i++) {
      wx.setStorage({
        key: setStorageList[i].key,
        data: setStorageList[i].value,
      })
    }
  })
}

const removeAutoInfo = () => {
  wx.removeStorageSync('phoneNumber')
  wx.removeStorageSync('tokenPwd')
  wx.removeStoremoveStorageSyncrage('uid')
}

/**
 * 校验自动登录过期时间
 *
 */
const isAutoLoginTokenValid = (MPTOKEN_AUTOLOGIN_EXPIRATION, MPTOKEN_EXPIRATION) => {
  const autoLoginDeadTime = parseInt(MPTOKEN_AUTOLOGIN_EXPIRATION)
  let appTokenDeadTime = parseInt(MPTOKEN_EXPIRATION)
  const timestamp = Date.parse(new Date())
  console.log('timestamp', timestamp)
  console.log('MPTOKEN_AUTOLOGIN_EXPIRATION', MPTOKEN_AUTOLOGIN_EXPIRATION)
  console.log('MPTOKEN_EXPIRATION', MPTOKEN_EXPIRATION)
  if (!autoLoginDeadTime) {
    return appTokenDeadTime && appTokenDeadTime > timestamp ? true : false
  }
  return autoLoginDeadTime > timestamp ? true : false
}

//token过期
const checkTokenExpired = (MPTOKEN_USERINFO, MPTOKEN_EXPIRATION) => {
  let appTokenDeadTime = parseInt(MPTOKEN_EXPIRATION)
  const timestamp = Date.parse(new Date())
  return MPTOKEN_USERINFO && appTokenDeadTime && appTokenDeadTime > timestamp ? true : false
}
//tokenPwd过期
const checkTokenPwdExpired = (MPTOKEN_USERINFO, MPTOKEN_AUTOLOGIN_EXPIRATION) => {
  let appTokenDeadTime = parseInt(MPTOKEN_AUTOLOGIN_EXPIRATION)
  const timestamp = Date.parse(new Date())
  return MPTOKEN_USERINFO && appTokenDeadTime && appTokenDeadTime > timestamp ? true : false
}

module.exports = {
  setTokenStorage,
  checkTokenExpir,
  remove,
  clearStorageSync,
  setDialogIntervalTime,
  checkDialogIntervalTime,
  setToastIntervalTime,
  setToastIntervalOneDayOneTime,
  checkDialogOneDayOneTime,
  setIsAutoLogin,
  isAutoLoginTokenValid,
  removeStorageSync,
  removeCloudSync,
  setAutonInfo,
  removeAutoInfo,
  setUserInfo,
  removeUserInfo,
  checkTokenExpired,
  setTokenPwdStorge,
  checkTokenPwdExpired,
  setPluginFilter,
  setApplianceListConfig,
  setHomeGrounpList,
  getStrogeHomeGrounpList,
  setBatchAuthList,
  getStrogeBatchAuthList,
  getApplianceListConfig,
  getCurrentHomeGroupId,
  setVipUserInfo,
  setDcpDeviceImg,
}
