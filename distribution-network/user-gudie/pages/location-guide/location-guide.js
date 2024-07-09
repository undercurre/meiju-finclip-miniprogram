// distribution-network/user-gudie/pages/loaction-guide/loaction-guide.js
const rangersBurialPoint = getApp().getGlobalConfig().rangersBurialPoint
const imgBaseUrl = getApp().getGlobalConfig().imgBaseUrl
const baseImgApi = getApp().getGlobalConfig().baseImgApi
import { getFullPageUrl } from 'm-miniCommonSDK/index'

const app = getApp()
// const loactionImgUrl = baseImgApi.url
const loactionImgUrl = imgBaseUrl.url + '/mainContent/images'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    loactionImgUrl: loactionImgUrl,
    loactionImgList: {
      searchIconImg: '',
    },
    system: '',
    permissionTypeList: {},
    tipTextList: {
      iOS: {
        locationEnabled: {
          title: '打开手机定位服务',
          stepes: [
            {
              img: loactionImgUrl + '/permission/iOS/loaction/iOS_dingwei_01_1.png',
              text: '1.点击手机【设置】',
            },
            {
              img: loactionImgUrl + '/permission/iOS/loaction/ios_dingwei_01_2.png',
              text: '2.找到并点选【隐私】',
            },
            {
              img: loactionImgUrl + '/permission/iOS/loaction/ios_dingwei_01_3.png',
              text: '3.点击【定位服务】',
            },
            {
              img: loactionImgUrl + '/permission/iOS/loaction/ios_dingwei_01_4.png',
              text: '4.打开【定位服务】',
            },
          ],
        },
        locationAuthorized: {
          title: '允许微信使用定位',
          stepes: [
            {
              img: loactionImgUrl + '/permission/iOS/loaction/ios_dingwei_02_1.png',
              text: '1.点击手机【设置】',
            },
            {
              img: loactionImgUrl + '/permission/iOS/loaction/ios_dingwei_02_2.png',
              text: '2.找到并点选【微信】',
            },
            {
              img: loactionImgUrl + '/permission/iOS/loaction/ios_dingwei_02_3.png',
              text: '3.点选【位置】',
            },
            {
              img: loactionImgUrl + '/permission/iOS/loaction/ios_dingwei_02_4.png',
              text: '4.选择【使用App期间】',
            },
          ],
        },
        locationReducedAccuracy: {
          title: '允许微信使用定位',
          stepes: [
            {
              img: loactionImgUrl + '/permission/iOS/loaction/ios_dingwei_02_1.png',
              text: '1.点击手机【设置】',
            },
            {
              img: loactionImgUrl + '/permission/iOS/loaction/ios_dingwei_02_2.png',
              text: '2.找到并点选【微信】',
            },
            {
              img: loactionImgUrl + '/permission/iOS/loaction/ios_dingwei_02_3.png',
              text: '3.点选【位置】',
            },
            {
              img: loactionImgUrl + '/permission/iOS/loaction/ios_dingwei_02_4.png',
              text: '4.选择【使用App期间】',
            },
            {
              img: loactionImgUrl + '/permission/iOS/loaction/ios_jingqueweizhi_02_5.png',
              text: '5.打开【精确位置】开关',
            },
          ],
        },
        scopeUserLocation: {
          title: '允许小程序使用位置信息',
          stepes: [
            {
              img: loactionImgUrl + '/permission/iOS/loaction/ios_dingwei_03_1.png',
              text: '1.点击右上角【…】',
            },
            {
              img: loactionImgUrl + '/permission/iOS/loaction/ios_dingwei_03_2.png',
              text: '2.点击【设置】',
            },
            {
              img: loactionImgUrl + '/permission/iOS/loaction/ios_dingwei_03_3.png',
              text: '3.点击【位置信息】',
            },
            {
              img: loactionImgUrl + '/permission/iOS/loaction/ios_dingwei_03_4.png',
              text: '4.设为【仅在使用小程序期间】',
            },
          ],
        },
        localNet: {
          title: '打开本地网络',
          stepes: [
            {
              img: loactionImgUrl + '/permission/iOS/loaction/ios_dingwei_02_1.png',
              text: '1.点击手机【设置】',
            },
            {
              img: loactionImgUrl + '/permission/iOS/loaction/ios_dingwei_02_2.png',
              text: '2.找到并点选【微信】',
            },
            {
              img: loactionImgUrl + '/permission/iOS/loaction/ios_bendiwangluo_3.png',
              text: '3.打开【本地网络】开关',
            },
          ],
        },
      },
      Android: {
        locationEnabled: {
          title: '打开手机定位服务',
          stepes: [
            {
              img: loactionImgUrl + '/permission/Android/loaction/Android_dingwei_01_1.png',
              text: '1.点击手机【设置】',
            },
            {
              img: loactionImgUrl + '/permission/Android/loaction/Android_dingwei_01_2.png',
              text: '2.找到并点选【隐私】',
            },
            {
              img: loactionImgUrl + '/permission/Android/loaction/Android_dingwei_01_3.png',
              text: '3.点击【定位服务】',
            },
            {
              img: loactionImgUrl + '/permission/Android/loaction/Android_dingwei_01_4.png',
              text: '4.打开【定位服务】',
            },
          ],
        },
        locationAuthorized: {
          title: '允许微信使用定位',
          stepes: [
            {
              img: loactionImgUrl + '/permission/Android/loaction/Android_dingwei_02_1.png',
              text: '1.点击手机【设置】',
            },
            {
              img: loactionImgUrl + '/permission/Android/loaction/Android_dingwei_02_2.png',
              text: '2.找到并点选【隐私】',
            },
            {
              img: loactionImgUrl + '/permission/Android/loaction/Android_dingwei_02_3.png',
              text: '3.点击【权限管理】',
            },
            {
              img: loactionImgUrl + '/permission/Android/loaction/Android_dingwei_02_4.png',
              text: '4.点击【位置信息】',
            },
            {
              img: loactionImgUrl + '/permission/Android/loaction/Android_dingwei_02_5.png',
              text: '5.找到并点选【微信】',
            },
            {
              img: loactionImgUrl + '/permission/Android/loaction/Android_dingwei_02_6.png',
              text: '6.选中【仅使用期间允许】',
            },
          ],
        },
        scopeUserLocation: {
          title: '允许小程序使用位置信息',
          stepes: [
            {
              img: loactionImgUrl + '/permission/Android/loaction/Android_dingwei_03_1.png',
              text: '1.点击右上角【…】',
            },
            {
              img: loactionImgUrl + '/permission/Android/loaction/Android_dingwei_03_2.png',
              text: '2.点击【设置】',
            },
            {
              img: loactionImgUrl + '/permission/Android/loaction/Android_dingwei_03_3.png',
              text: '3.点击【位置信息】',
            },
            {
              img: loactionImgUrl + '/permission/Android/loaction/Android_dingwei_03_4.png',
              text: '4.设为【仅在使用小程序期间】',
            },
          ],
        },
      },
    },
    locationTipTextList: {
      otherAndroidSystem: {
        locationEnabled: {
          stepes: [
            {
              img: loactionImgUrl + '/permission/location/huawei-01.png',
              text: '1.点击下方【去设置】按钮',
            },
            {
              img: loactionImgUrl + '/permission/location/huawei-02.png',
              text: '2.选择权限/权限管理',
            },
            {
              img: loactionImgUrl + '/permission/location/huawei-03.png',
              text: '3.找到位置信息/定位',
            },
            {
              img: loactionImgUrl + '/permission/location/huawei-04.png',
              text: '4.开启精确位置/精准定位',
            },
          ],
        },
      },
      xiaoMiSystem: {
        locationEnabled: {
          stepes: [
            {
              img: loactionImgUrl + '/permission/location/xiaomi-01.png',
              text: '1.点击下方【去设置】按钮',
            },
            {
              img: loactionImgUrl + '/permission/location/xiaomi-02.png',
              text: '2.选择权限管理/权限',
            },
            {
              img: loactionImgUrl + '/permission/location/xiaomi-03.png',
              text: '3.找到定位/位置权限',
            },
            {
              img: loactionImgUrl + '/permission/location/xiaomi-04.png',
              text: '4.关闭模糊定位',
            },
          ],
        },
      },
    },
    originRoute: '', //用于判断是否精准或模糊定位操作指引
    otherAndroidSystem: false, //false 证明是小米或红米
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('options', options)
    this.setData({
      system: app.globalData.systemInfo.system.includes('Android') ? 'Android' : 'iOS',
    })
    let loactionTextList = []
    if (options.permissionTypeList) {
      // console.log('[permision Type List]', JSON.parse(options.permissionTypeList))
      let permissionTypeList = JSON.parse(options.permissionTypeList || null) || {
        locationEnabled: false,
        locationAuthorized: false,
        locationReducedAccuracy: false,
      }
      console.log('[permision Type List]', permissionTypeList)
      this.viewBurialPoint(permissionTypeList)
      let { system, tipTextList } = this.data
      if (system == 'iOS') {
        if (!permissionTypeList.locationEnabled) {
          //未开定位开关
          loactionTextList.push(tipTextList.iOS.locationEnabled)
        }

        if (!permissionTypeList.locationAuthorized && permissionTypeList.locationReducedAccuracy) {
          //未开定位授权
          loactionTextList.push(tipTextList.iOS.locationAuthorized)
        }

        if (
          (permissionTypeList.locationAuthorized && !permissionTypeList.locationReducedAccuracy) ||
          (!permissionTypeList.locationAuthorized && !permissionTypeList.locationReducedAccuracy)
        ) {
          //未开精确定位
          loactionTextList.push(tipTextList.iOS.locationReducedAccuracy)
        }

        if (!permissionTypeList.scopeUserLocation) {
          //未授权微信定位
          loactionTextList.push(tipTextList.iOS.scopeUserLocation)
        }
      }
      if (system == 'Android') {
        if (!permissionTypeList.locationEnabled) {
          //未开定位开关
          loactionTextList.push(tipTextList.Android.locationEnabled)
        }
        if (!permissionTypeList.locationAuthorized) {
          //未开定位授权
          loactionTextList.push(tipTextList.Android.locationAuthorized)
        }

        if (!permissionTypeList.scopeUserLocation) {
          //未授权微信定位
          loactionTextList.push(tipTextList.Android.scopeUserLocation)
        }
      }
    }
    this.setData({
      loactionTextList: loactionTextList,
    })

    //精准/模糊定位操作指引
    if (options.route && options.route == 'operatingInstructions') {
      let { locationTipTextList } = this.data
      let loactioSystemList = []
      // let otherAndroidSystem = Boolean(options.otherAndroidSystem)
      if (options.otherAndroidSystem == 'true') {
        loactioSystemList.push(locationTipTextList.otherAndroidSystem.locationEnabled)
      } else if (options.otherAndroidSystem == 'false') {
        loactioSystemList.push(locationTipTextList.xiaoMiSystem.locationEnabled)
        console.log(loactioSystemList)
      }
      this.setData({
        originRoute: 'operatingInstructions',
        otherAndroidSystem: options.otherAndroidSystem == 'true' ? true : false,
        loactioSystemList: loactioSystemList,
      })
    }
  },

  viewBurialPoint(permissionTypeList) {
    let { locationEnabled, locationAuthorized, scopeUserLocation } = permissionTypeList
    let object_name = []
    if (!locationEnabled) {
      object_name.push('开启定位服务')
    }
    if (!locationAuthorized) {
      object_name.push('允许微信获取位置权限')
    }
    if (!scopeUserLocation) {
      object_name.push('允许小程序使用位置权限')
    }
    object_name = object_name.join('/')
    rangersBurialPoint('user_page_view', {
      page_id: 'page_open_locate_new',
      page_name: '提示需开启位置权限页面',
      page_path: getFullPageUrl(),
      module: 'appliance',
      object_type: '弹窗类型',
      object_id: '',
      object_name: object_name || '',
      device_info: {
        device_session_id: getApp().globalData.deviceSessionId || '',
      },
    })
    console.log('提示需开启位置权限页面 浏览埋点', object_name)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() { },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() { },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() { },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() { },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() { },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage() {

  // }

  clickSetting() {
    wx.openAppAuthorizeSetting({
      success(res) {
        console.log('测试返回', res)
      },
    })
  },
})