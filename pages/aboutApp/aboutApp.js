const app = getApp() //获取应用实例
import config from '../../config.js' //环境及域名基地址配置
import { requestService, uploadFileTask } from '../../utils/requestService'
import { webView } from '../../utils/paths'
import { getTimeStamp, getReqId } from 'm-utilsdk/index'
import Toast from 'm-ui/mx-toast/toast'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    environment: config.environment,
    runtimeSDKVersion: '',
    cellList: [
      {
        title: '版本更新',
        id: 'versionUpdate',
      },
      {
        title: '开源许可通告',
        id: 'codeArrow',
        link: {
          sit: 'https://qrcode.midea.com/test/AboutApp/openSourceLicense_harmony.html',
          uat: 'https://qrcode.midea.com/AboutApp/openSourceLicense_harmony.html',
        },
      },
      {
        title: '证照信息',
        id: 'privaci',
        link: {
          sit: 'https://www.smartmidea.net/projects/sit/licence/index.html',
          uat: 'https://www.smartmidea.net/projects/licence/index.html',
        },
      },
    ],
    poupInfomation: {
      show: false,
      poupInfo: {
        img: 'https://wx3.sinaimg.cn/mw690/92321886gy1hqaaubetpyj21jk25nat4.jpg',
        info: `考虑放假了丝
            开了房见识到了肯德基凯撒
            开了房见识到了肯德基凯撒
            开了房见识到了肯德基凯撒
            开了房见识到了肯德基凯撒
            开了房见识到了肯德基凯撒
            开了房见识到了肯德基凯撒
            开了房见识到了肯德基凯撒
            
            扣法兰看手机卡拉卡`,
        type: 1, //1.应用市场， 3.是参与内测
      },
    },
    showVersionUpdateDialog: false,
    appVersion: '',
    hasUpadteVersion: false,
    isWifiNetWork: false,
    updateUrl:'',//版本升级url
  },
  togglePoup() {
    if (this.data.hasUpadteVersion) {
      let poupInfomation = this.data.poupInfomation
      poupInfomation.show = !poupInfomation.show
      this.data.showVersionUpdateDialog = !this.data.showVersionUpdateDialog
      this.setData({
        poupInfomation,
        showVersionUpdateDialog: this.data.showVersionUpdateDialog,
      })
    } else {
      Toast({ context: this, position: 'bottom', message: '已是最新版本' })
    }
  },
  versionInfo() {
    let self = this
    let params = {}
    // console.log('getSystemInfo:',wx.getSystemInfo())
    // console.error('getAppInfo:',app.getAppInfo())

    wx.getSystemInfo({
      success(res) {
        console.error('res=================:', res)

        params = {
          deviceId: res.deviceId,
          os: res.platform.toLowerCase() == 'harmony' ? 'HarmonyOS' : '',
          channel: res.brand.toLowerCase(),
          deviceName: res.model,
          platform: 3,
          osVersion: res.system,
          version: self.data.appVersion,
          iotAppId: config.iotAppId[self.data.environment],
          strategyId: '',
        }
      },
    })
    return new Promise((resolve, reject) => {
      let urlName = 'getUpgradeStrategy'
      if (app.globalData.isLogon) {
        urlName = 'getLoginUpgradeStrategy'
      }
      let reqData = {
        ...params,
        reqId: getReqId(),
        stamp: getTimeStamp(new Date()),
      }
      console.log('reqData===========:', reqData)
      requestService.request(urlName, reqData).then(
        (resp) => {
          if (resp.data.code == 0 && self.compareVersion(resp.data.data.versionName, reqData.version)) {
            let poupInfomation = self.data.poupInfomation

            poupInfomation.poupInfo.info = resp.data.data.dialogConfig.content
            poupInfomation.poupInfo.img = resp.data.data.dialogConfig.imageUrl
            poupInfomation.poupInfo.type = resp.data.data.upgradeType
            if(resp.data.data.upgradeType == 1){
              //版本升级
              self.data.updateUrl = resp.data.data.appStoreUrl
            } else if(resp.data.data.upgradeType == 3){
              //内测
              self.data.updateUrl = resp.data.data.testFlightUrl
            }

            self.setData({
              hasUpadteVersion: true,
              poupInfomation,
            })
            resolve(resp)
          } else {
            reject(resp)
          }
        },
        (error) => {
          console.error('error===========:', error)
          reject(error)
        }
      )
    })
  },
  //输出1，则v1版本号比v2大
  compareVersion(v1, v2) {
    const version1 = v1.split('.').map(Number)
    const version2 = v2.split('.').map(Number)

    for (let i = 0; i < Math.max(version1.length, version2.length); i++) {
      const num1 = version1[i] || 0
      const num2 = version2[i] || 0

      if (num1 > num2) return 1
      if (num1 < num2) return -1
    }

    return 0 // 版本号相等
  },
  versionUpadte(e) {
    //子组件传承
    console.error(e.detail)
    if (e.detail.detail.type == 1) {
      //立即升级
      console.error('进入立即升级')
      this.updateNow()
    } else if (e.detail.detail.type == 3) {
      //参与内测
      console.error('进入参与内测')
      this.joinTest()
    }
    let poupInfomation = this.data.poupInfomation
    poupInfomation.show = !poupInfomation.show
    this.data.showVersionUpdateDialog = !this.data.showVersionUpdateDialog
    this.setData({
      poupInfomation,
      showVersionUpdateDialog: this.data.showVersionUpdateDialog,
    })
  },
  backPage() {
    wx.navigateBack()
  },
  joinTest() {
    //ft.startBrowsableAbility({ uri: '' })
    try {
      ft.startBrowsableAbility({uri:this.data.updateUrl})
    } catch(e){
      
    }
  },
  updateNow() {
    try {
      console.log('11111')
      ft.startAppGalleryDetailAbility({uri:this.data.updateUrl})
    } catch (e) {
      console.error('e=========:', e)
    }
  },
  checkVersion() {
    let self = this
    wx.getNetworkType({
      success(res) {
        console.log('当前网络状况2222', res)
        if (res.networkType == 'wifi') {
          self.setData({
            isWifiNetWork: true,
          })
        } else {
          self.setData({
            isWifiNetWork: false,
          })
        }
      },
      fail(error) {
        console.log('获取当前网络状况错误1111', error)
        self.setData({
          isWifiNetWork: false,
        })
      },
    })
    //检查版本request
    this.togglePoup()
  },
  jumpTargetPath(event) {
    let item = event.currentTarget.dataset.item
    if (item.id == 'versionUpdate') {
      this.checkVersion()
    } else {
      let env = config.environment == 'sit' ? 'sit' : 'uat'
      let url = item.link[env]
      wx.navigateTo({
        url: `/pages/webView/webView?webViewUrl=${encodeURIComponent(url)}`,
      })
    }
  },
  onClickRight() {
    if (this.data.environment == 'sit') {
      wx.navigateTo({
        url: '/pages/testPage/index',
      })
    }
  },
  //获取sdk版本号
  getSdkVersion() {
    let self = this
    wx.getSystemInfo({
      success(res) {
        if (res && res.runtimeSDKVersion) {
          self.setData({
            runtimeSDKVersion: res?.runtimeSDKVersion,
          })
        }
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    let self = this
    try {
      ft.getAppInfo({
        success: function (res) {
          console.log('getAppInfo success ------------')
          console.log(res)
          self.setData({
            appVersion: `${res.data.data.VERSION_NAME}.${res.data.data.VERSION_CODE}`,
          })
          self.versionInfo()
        },
        fail: function (res) {
          console.log('getAppInfo fail')
          console.log(res)
        },
      })
    } catch (error) {}
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    //this.getSdkVersion()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},
})
