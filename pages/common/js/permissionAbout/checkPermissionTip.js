import { checkAndGetWxSystemInfo, checkAndGetWxGetSetting } from '../../../../utils/wx/utils'
import { hasKey } from 'm-utilsdk/index'

const checkPermission = {
  // forceUpdate 是否强制更新systeminfo settinginfo 数据
  // isCheckAccuracy IOS是否判断精确定位
  async loaction(forceUpdate = true, isCheckAccuracy = true) {
    let permissionText = []
    let permissionTypeList = {
      locationReducedAccuracy: true,
    }
    let res = await Promise.all([
      checkAndGetWxSystemInfo({
        forceUpdate,
        success: () => {
          getApp().setMethodCheckingLog('wx.getSystemInfo()')
        },
        fail: (error) => {
          getApp().setMethodFailedCheckingLog('wx.getSystemInfo()', `获取系统信息异常${JSON.stringify(error)}`)
        },
      }),
      checkAndGetWxGetSetting({
        forceUpdate,
      }),
    ])
    console.log('[system and setting info]', res)
    //未开 系统位置开关 未授权给微信
    if (!res[0].locationEnabled) {
    //   permissionText.push('开启手机定位')
    permissionText.push('开启手机系统定位')
    permissionText.push('以便扫描添加附近智能设备')
      permissionTypeList.locationEnabled = false
    } else {
      permissionTypeList.locationEnabled = true
    }

    const appAuthorizeSetting = wx.getAppAuthorizeSetting()
    console.log('[app Authorize Setting]', appAuthorizeSetting)
    if (res[0].locationAuthorized !== 'authorized') {
      if (res[0].system.includes('iOS') && isCheckAccuracy) {
        if (!appAuthorizeSetting.locationReducedAccuracy) {
          //精确定位 true 表示模糊定位，false 表示精确定位（仅 iOS 有效）
          permissionText.push('授予微信使用定位的权限')
          permissionTypeList.locationReducedAccuracy = true
        } else {
          permissionText.push('授予微信使用定位的权限，并打开“精确位置”开关')
          permissionTypeList.locationReducedAccuracy = false
        }
      } else {
        // permissionText.push('授予微信使用定位的权限')
        permissionText = []
        permissionText.push('开启位置信息权限')
        permissionText.push('以便扫描添加附近智能设备')
      }
      permissionTypeList.locationAuthorized = false
    } else {
      if (res[0].system.includes('iOS') && isCheckAccuracy) {
        if (appAuthorizeSetting.locationReducedAccuracy) {
          //已授权位置 但未开精确位置
          permissionText.push('开启微信获取“精确位置”的开关')
          permissionTypeList.locationReducedAccuracy = false
        }
      }
      permissionTypeList.locationAuthorized = true
    }

    // todo:Yoram930 注释掉微信对小程序的权限判断
    // if (!res[1]['authSetting']['scope.userLocation']) {
    //   permissionText.push('点击右上角“...”按钮，选择“设置”，允许本程序使用位置信息')
    //   permissionTypeList.scopeUserLocation = false
    // } else {
    //   permissionTypeList.scopeUserLocation = true
    // }

    // todo:Yoram930 注释掉微信对小程序的权限判断
    //小程序设置里是否有位置设置
    // if (hasKey(res[1]['authSetting'], 'scope.userLocation')) {
    //   permissionTypeList.locationSetting = true
    // } else {
    //   permissionTypeList.locationSetting = false
    // }

    if (permissionText.length) {
      let permissionTextAll = ''
      if (permissionText.length > 1) {
        permissionText.forEach((item, index) => {
        //   permissionTextAll += `${index + 1}、${item}${index + 1 != permissionText.length ? '\n' : ''}`
          permissionTextAll += `${item}${index + 1 != permissionText.length ? '\n' : ''}`
        })
      } else {
        permissionTextAll = permissionText[0]
      }
      return {
        type: 'location',
        isCanLocation: false,
        permissionTypeList,
        permissionTextAll,
        permissionTextList: permissionText,
      }
    }
    return { isCanLocation: true, permissionTypeList }
  },
  // forceUpdate 是否强制更新systeminfo settinginfo 数据
  async blue(forceUpdate = true) {
    let permissionText = []
    let permissionTypeList = {}
    let res = await Promise.all([
      checkAndGetWxSystemInfo({
        forceUpdate,
        success: () => {
          getApp().setMethodCheckingLog('wx.getSystemInfo()')
        },
        fail: (error) => {
          getApp().setMethodFailedCheckingLog('wx.getSystemInfo()', `获取系统信息异常${JSON.stringify(error)}`)
        },
      }),
      checkAndGetWxGetSetting({
        forceUpdate,
      }),
    ])
    console.log('[system and setting info]', res)

    //蓝牙开关未开
    if (!res[0].bluetoothEnabled) {
    //   permissionText.push('开启手机蓝牙')
      permissionText.push('开启蓝牙开关')
      permissionText.push('以便扫描添加智能设备')
      permissionTypeList.bluetoothEnabled = false
    } else {
      permissionTypeList.bluetoothEnabled = true
    }

    //需要授权蓝牙但未授权
    if (res[0].bluetoothAuthorized != undefined && res[0].bluetoothAuthorized !== 'authorized') {
      // permissionText.push('授予微信使用蓝牙的权限')
      permissionText = []
      permissionText.push('开启蓝牙权限')
      permissionText.push('以便扫描添加智能设备')
      permissionTypeList.bluetoothAuthorized = false
    } else {
      permissionTypeList.bluetoothAuthorized = true
    }

    // todo:Yoram930 注释掉微信对小程序的权限判断
    //小程序蓝牙但未授权
    // if (!res[1]['authSetting']['scope.bluetooth']) {
    //   permissionText.push('点击右上角“...”按钮，选择“设置”，允许本程序使用蓝牙')
    //   permissionTypeList.scopeBluetooth = false
    // } else {
    //   permissionTypeList.scopeBluetooth = true
    // }

    // todo:Yoram930 注释掉微信对小程序的权限判断
    //小程序设置里是否有蓝牙设置
    // if (hasKey(res[1]['authSetting'], 'scope.bluetooth')) {
    //   permissionTypeList.bluetoothSetting = true
    // } else {
    //   permissionTypeList.bluetoothSetting = false
    // }

    if (permissionText.length) {
      let permissionTextAll = ''
      if (permissionText.length > 1) {
        permissionText.forEach((item, index) => {
          //   permissionTextAll += `${index + 1}、${item}${index + 1 != permissionText.length ? '\n' : ''}`
          permissionTextAll += `${item}${index + 1 != permissionText.length ? '\n' : ''}`
        })
      } else {
        permissionTextAll = permissionText[0]
      }
      return {
        type: 'blue',
        isCanBlue: false,
        permissionTypeList,
        permissionTextAll,
        permissionTextList: permissionText,
      }
    }
    return { isCanBlue: true, permissionTypeList }
  },

  // async wifi() {
  //   let permissionText = []
  //   let permissionTypeList = {}
  //   let permissionTextAll = ''
  //   let res
  //   try {
  //     res = await wx.getSystemSetting();
  //     console.log('res==========:',res);
  //     console.log('[wifi -system info]', res)
  
  //     //wifi开关未开
  //     if (!res.wifiEnabled) {
  //       permissionText.push('开启WLAN开关')
  //       permissionText.push('以便扫描添加智能设备')
  //       permissionTypeList.wifiEnabled = false
  //       if (permissionText.length) {
        
  //         if (permissionText.length > 1) {
  //           permissionText.forEach((item, index) => {
  //             permissionTextAll += `${item}${index + 1 != permissionText.length ? '\n' : ''}`
  //           })
  //         } else {
  //           permissionTextAll = permissionText[0]
  //         }
  
  //       }
  //       return {
  //         type: 'wifi',
  //         isCanWifi: false,
  //         permissionTypeList,
  //         permissionTextAll,
  //         permissionTextList: permissionText,
  //       }
  //     } else {
  //       permissionTypeList.wifiEnabled = true
  //       return { isCanWifi: true, permissionTypeList }
  //     }

  //   } catch (err) {
  //     console.error(err);
  //   }
  // },
  //判断微信隐私协议
  async privacy() {
    return new Promise((resolve, reject) => {
      if (wx.getPrivacySetting) {
        wx.getPrivacySetting({
          success: (res) => {
            console.log('是否需要微信隐私授权：', res.needAuthorization)
            resolve(res.needAuthorization)
          },
        })
      } else {
        resolve(false)
      }
    })
  },
}

export { checkPermission }
