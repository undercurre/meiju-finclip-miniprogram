const app = getApp() //获取应用实例
import config from '../../config.js' //环境及域名基地址配置
import { requestService, uploadFileTask } from '../../utils/requestService'
import {webView} from '../../utils/paths'
import { getTimeStamp, getReqId } from 'm-utilsdk/index'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    environment: config.environment,
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
        type: 1, //假定1是可升级， 2是参与内测，3是必须升级
      },
    },
    showVersionUpdateDialog: false,
  },
  togglePoup() {
    let self = this
    let params ={}
    // console.log('getSystemInfo:',wx.getSystemInfo())
    wx.getSystemInfo({

        success(res){
            console.error('res=================:',res)

            params = {
                "deviceId":res.deviceId,
                "os":"HarmonyOS",
                "channel":"huawei",
                "deviceName":"Mate 60 Pro",
                "platform":3,
                "osVersion":res.system,
                "version":'1.0.0',
                "iotAppId":"900",
                "strategyId":""
                
            }
        }
    })
    return new Promise((resolve, reject) => {
        let urlName = 'getUpgradeStrategy'
        if(app.globalData.isLogon){
            urlName = 'getLoginUpgradeStrategy'
        }
        let reqData = {
          ...params,
          reqId: getReqId(),
          stamp: getTimeStamp(new Date()),
        }
        requestService.request(urlName, reqData).then(
          (resp) => {
            if (resp.data.code == 0 && self.compareVersion(resp.data.data.versionName,reqData.version)) {
              let poupInfomation = self.data.poupInfomation
              poupInfomation.show = !poupInfomation.show
              poupInfomation.poupInfo.info = resp.data.data.dialogConfig.content
              poupInfomation.poupInfo.img = resp.data.data.dialogConfig.imageUrl

              self.data.showVersionUpdateDialog = !self.data.showVersionUpdateDialog
              self.setData({
                  poupInfomation,
                  showVersionUpdateDialog: self.data.showVersionUpdateDialog
              })
              resolve(resp)
            } else {
              reject(resp)
            }
          },
          (error) => {
            console.error('reqData===========:',reqData)
            console.error('error===========:',error)
            reject(error)
          }
        )
    })
  },
  //输出1，则v1版本号比v2大
  compareVersion(v1, v2) {
    const version1 = v1.split('.').map(Number);
    const version2 = v2.split('.').map(Number);
  
    for (let i = 0; i < Math.max(version1.length, version2.length); i++) {
      const num1 = version1[i] || 0;
      const num2 = version2[i] || 0;
  
      if (num1 > num2) return 1;
      if (num1 < num2) return -1;
    }
  
    return 0; // 版本号相等
  },
  versionUpadte(e) {
    //子组件传承
    console.error(e.detail)
    if (e.detail.type == 3) {
      //立即升级
      this.updateNow()
    } else if (e.detail.type == 2) {
      //参与内测
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
  joinTest() {},
  updateNow() {
    try {
      ft.startAppGalleryDetailAbility()
    } catch (e) {}
  },
  checkVersion() {
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

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
