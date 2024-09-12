// distribution-network/addDevice/pages/wifiGuide/wifiGuide.js
const app = getApp()
const systemInfo = wx.getSystemInfoSync()
import { imgBaseUrl } from '../../../../api'
const imgUrl = imgBaseUrl.url + '/shareImg/' + app.globalData.brand
const imgUrlStep = imgBaseUrl.url + '/shareImg/'
import { imgesList } from '../../../assets/js/shareImg.js'
import Dialog from '../../../../miniprogram_npm/m-ui/mx-dialog/dialog'
import { burialPoint } from './assets/js/burialPoint'
const paths = require('../../../assets/sdk/common/paths')
let statusBarHeight = systemInfo.statusBarHeight
Page({

  /**
   * 页面的初始数据
   */
  data: {
    brand: app.globalData.brand,
    phoneBrand:'huawei',
    desList:{
      'samsung':['进入系统设置--连接--WLAN页面，点击当前连接的WiFi右侧的设置按钮。','进入WiFi详情页后，点击底部的二维码按钮，进入到WiFi二维码页面。请对当前页面进行截图。'],
      'realme':['进入系统设置--WLAN页面，点击当前连接的WiFi。','进入WiFi详情页面后，点击顶部的“WLAN二维码”，在弹出的弹窗中可以看到该WiFi的二维码。请对当前页面进行截图。'],
      'vivo':['进入系统设置--WLAN页面，点击当前连接的WiFi。','进入WiFi详情页面后，可以看到该WiFi的二维码。请对当前页面进行截图。'],
      'iqoo':['进入系统设置--WLAN页面，点击当前连接的WiFi。','进入WiFi详情页面后，可以看到该WiFi的二维码。请对当前页面进行截图。'],
      'xiaomi':['进入系统设置--WLAN页面，在当前连接的WiFi点击“点击分享密码”。','在弹出弹窗中，可以看到该WiFi的二维码。请对当前页面进行截图。'],
      'redmi':['进入系统设置--WLAN页面，在当前连接的WiFi点击“点击分享密码”。','在弹出弹窗中，可以看到该WiFi的二维码。请对当前页面进行截图。'],
      'huawei':['进入系统设置--WLAN页面，点击当前手机所连接的家庭WiFi。','在WiFi详情页中，可以看到该WiFi的二维码。请对当前页面进行截图','点击下方扫描二维码按钮，上传第2步的截图，获取WiFi密码。'],
      'honor':['进入系统设置--WLAN页面，点击当前连接的WiFi。','在弹出弹窗中，可以看到该WiFi的二维码。请对当前页面进行截图。'],
      'oppo':['进入系统设置--WLAN页面，点击当前连接的WiFi。','进入WiFi详情页面后，点击顶部的“WLAN二维码”，在弹出的弹窗中可以看到该WiFi的二维码。请对当前页面进行截图。'],
    },
    showPicker:false,
    brandTypeName:'',
    phoneBrandType:['SAMSUNG','Realme','VIVO','iQOO','小米','红米','华为','荣耀','OPPO'],
    phoneBrandGuideImg:imgUrl+imgesList['wifi_guide_down'],
    wifiGuideStepImg1:imgUrlStep+imgesList['wifi_guide_huawei1'],
    wifiGuideStepImg2:imgUrlStep+imgesList['wifi_guide_huawei2'],
    brandConfig:app.globalData.brandConfig[app.globalData.brand].dialogStyle,
    btnColor:{
      'meiju':{
        'bgColor':'#267AFF',
        'color':'#ffffff'
      },
      'toshiba':{
        'bgColor':'#E61E1E',
        'color':'#ffffff'
      },
      'colom':{
        'bgColor':' #B35336',
        'color':' rgba(255,255,255,0.80)'
      },

    },
    // contentHeight:systemInfo.windowHeight - statusBarHeight - 110,
    contentHeight:608,//修改系统界面缩放 systemInfo.windowHeight 和 statusBarHeight 数值会不一样，导致内容显示高度变小，内容与下方按钮直接出现较大的白色空间，目前根据mate60和pro来写死608这个值，以后屏幕尺寸出现变化还需要修改
    clickShow:false
  },  

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    console.log('options-------:',options)

    this.data.currentWiFiName = options.currentWiFiName

    console.log('systemInfo====:',systemInfo)
    console.log('contentHeight====:',this.data.contentHeight)

    // let res = {"charSet": "utf-8", "result": "WIFI:T:WPA;P:test123456;S:ZX_5G;H:false;", "codeVersion": 3, "errMsg": "scanCode:ok", "rawData": "V0lGSTpUOldQQTtQOnRlc3QxMjM0NTY7UzpaWF81RztIOmZhbHNlOw==", "scanType": "QR_CODE"}
    // let res1 = res.result.match(/P:.*?;/g)
    // res1 = res1[0].slice(2,res1[0].length-1)
    // let res2 = res.result.match(/S:.*?;/g)

    let phoneBrandTypeName = systemInfo.brand
    phoneBrandTypeName = phoneBrandTypeName.toLocaleLowerCase()
    // this.switchPhoneBrand(phoneBrandTypeName)s
  },

  // switchPhoneBrand(brandName){
  //   console.log(brandName)
  //   switch (brandName) {
  //     case 'samsung':
  //       this.setData({
  //         wifiGuideStepImg1:imgUrlStep+imgesList['wifi_guide_sansumg1'],
  //         wifiGuideStepImg2:imgUrlStep+imgesList['wifi_guide_sansumg2'],
  //         phoneBrand:brandName,
  //         defaultIndex:'0',
  //         brandTypeName:this.data.phoneBrandType[0],
  //         contentHeight:1600
  //       })
  //       break;
  //     case 'realme':
  //       this.setData({
  //         wifiGuideStepImg1:imgUrlStep+imgesList['wifi_guide_oppo1'],
  //         wifiGuideStepImg2:imgUrlStep+imgesList['wifi_guide_oppo2'],
  //         phoneBrand:brandName,
  //         defaultIndex:'1',
  //         brandTypeName:this.data.phoneBrandType[1],
  //       })
  //       break;
  //     case 'vivo':
  //       this.setData({
  //         wifiGuideStepImg1:imgUrlStep+imgesList['wifi_guide_vivo1'],
  //         wifiGuideStepImg2:imgUrlStep+imgesList['wifi_guide_vivo2'],
  //         phoneBrand:brandName,
  //         defaultIndex:'2',
  //         brandTypeName:this.data.phoneBrandType[2],
  //       })
  //       break;
  //     case 'iqoo':
  //       this.setData({
  //         wifiGuideStepImg1:imgUrlStep+imgesList['wifi_guide_vivo1'],
  //         wifiGuideStepImg2:imgUrlStep+imgesList['wifi_guide_vivo2'],
  //         phoneBrand:brandName,
  //         defaultIndex:'3',
  //         brandTypeName:this.data.phoneBrandType[3],
  //       })
  //       break;
  //     case 'xiaomi':
  //     case '小米':
  //       this.setData({
  //         wifiGuideStepImg1:imgUrlStep+imgesList['wifi_guide_xiaomi1'],
  //         wifiGuideStepImg2:imgUrlStep+imgesList['wifi_guide_xiaomi2'],
  //         phoneBrand:'xiaomi',
  //         defaultIndex:'4',
  //         brandTypeName:this.data.phoneBrandType[4],
  //       })
  //       break;
  //     case 'redmi':
  //     case '红米':
  //       this.setData({
  //         wifiGuideStepImg1:imgUrlStep+imgesList['wifi_guide_xiaomi1'],
  //         wifiGuideStepImg2:imgUrlStep+imgesList['wifi_guide_xiaomi2'],
  //         phoneBrand:'redmi',
  //         defaultIndex:'5',
  //         brandTypeName:this.data.phoneBrandType[5],
  //       })
  //       break;

  //     case 'huawei':
  //     case '华为':
  //       this.setData({
  //         wifiGuideStepImg1:imgUrlStep+imgesList['wifi_guide_huawei1'],
  //         wifiGuideStepImg2:imgUrlStep+imgesList['wifi_guide_huawei2'],
  //         phoneBrand:'huawei',
  //         defaultIndex:'6',
  //         brandTypeName:this.data.phoneBrandType[6],
  //       })
  //       break;
  //     case 'honor':
  //     case '荣耀':
  //       this.setData({
  //         wifiGuideStepImg1:imgUrlStep+imgesList['wifi_guide_huawei1'],
  //         wifiGuideStepImg2:imgUrlStep+imgesList['wifi_guide_huawei2'],
  //         phoneBrand:'honor',
  //         defaultIndex:'7',
  //         brandTypeName:this.data.phoneBrandType[7],
  //       })
  //       break;
  //     case 'oppo':
  //       this.setData({
  //         wifiGuideStepImg1:imgUrlStep+imgesList['wifi_guide_oppo1'],
  //         wifiGuideStepImg2:imgUrlStep+imgesList['wifi_guide_oppo2'],
  //         phoneBrand:brandName,
  //         defaultIndex:'8',
  //         brandTypeName:this.data.phoneBrandType[8],
  //       })
  //       break;
  //     default:
  //     this.setData({
  //       wifiGuideStepImg1:imgUrlStep+imgesList['wifi_guide_vivo1'],
  //       wifiGuideStepImg2:imgUrlStep+imgesList['wifi_guide_vivo2'],
  //       phoneBrand:'vivo',
  //       defaultIndex:'2',
  //       brandTypeName:this.data.phoneBrandType[2],
  //     })
  //     break;
  //   }

  //   this.setData({
  //     clickShow:true
  //   })
  // },

  scanCode(){
    let self = this
    burialPoint.clickScanCode({
      deviceSessionId: app.globalData.deviceSessionId,
      blueVersion: app.addDeviceInfo.blueVersion,
      deviceId: app.addDeviceInfo.deviceId,
      linkType: app.addDeviceInfo.linkType,
      sn: app.addDeviceInfo.sn,
      sn8: app.addDeviceInfo.sn8,
      type: app.addDeviceInfo.type,
      moduleVison: app.addDeviceInfo.moduleVersion,
    })
    wx.scanCode({
      success (res) {
        console.log('rrrrrrrrrrrrrrrrrrr+',res)
        // res = {"charSet": "utf-8", "result": "WIFI:T:WPA;P:test123456;S:ZX_5G;H:false;", "codeVersion": 3, "errMsg": "scanCode:ok", "rawData": "V0lGSTpUOldQQTtQOnRlc3QxMjM0NTY7UzpaWF81RztIOmZhbHNlOw==", "scanType": "QR_CODE"}
        // console.log(result.startsWith("WIFI"))
        let result = res.result
        if(result.startsWith("WIFI")){
          let wifiName = result.match(/S:.*?;/g)
          wifiName = wifiName[0].slice(2,wifiName[0].length-1)
          //1.wifi名称和正在连的wifi名是一样的-跳转到wifi登记页
          if(wifiName == self.data.currentWiFiName){
            let wifiPwd = result.match(/P:.*?;/g)
            wifiPwd = wifiPwd[0].slice(2,wifiPwd[0].length-1)
            // wx.redirectTo({
            //   url: paths.inputWifiInfo + '?currentWiFiPwd='+ wifiPwd+'&currentWiFiName='+self.data.currentWiFiName,
            //   fail: function(err) {
            //    console.log('跳转层级太多,使用wx.reLaunch')
            //    wx.reLaunch({
            //     url: paths.inputWifiInfo + '?currentWiFiPwd='+ wifiPwd+'&currentWiFiName='+self.data.currentWiFiName,
            //    })
            //   }
            // })
            let pages = getCurrentPages()
            let prePage = pages[pages.length - 2].route
            console.log('prePage===================:',prePage)
            app.globalData.getQRcodePwInfo = {currentWiFiPwd:wifiPwd,currentWiFiName:self.data.currentWiFiName}
            if(prePage == 'distribution-network/addDevice/pages/inputWifiInfo/inputWifiInfo'){
              wx.navigateBack({
                delta: 1
              })
            } else {
              wx.redirectTo({
               url: paths.inputWifiInfo
              })
            }
          } else {
            //2.wifi名称和正在连的wifi名不一样
            burialPoint.wifiNameInconsistent({
              deviceSessionId: app.globalData.deviceSessionId,
              blueVersion: app.addDeviceInfo.blueVersion,
              deviceId: app.addDeviceInfo.deviceId,
              linkType: app.addDeviceInfo.linkType,
              sn: app.addDeviceInfo.sn,
              sn8: app.addDeviceInfo.sn8,
              type: app.addDeviceInfo.type,
              moduleVison: app.addDeviceInfo.moduleVersion,
            })
            Dialog.confirm({
              title: `该二维码对应的WiFi名为“${wifiName}”，与当前手机连接的WiFi “${self.data.currentWiFiName}”不一致，请重新扫描二维码，或更换连接WiFi`,
              confirmButtonText: '重新扫描',
              cancelButtonText:'取消',
              confirmButtonColor: self.data.brandConfig.confirmButtonColor2,
              cancelButtonColor: self.data.brandConfig.cancelButtonColor4,
            }).then((res) => {
              if (res.action == 'confirm') {
                self.scanCode()
              }
            })
          }


        } else {
          // 若扫描的图片有二维码，识别的内容不是“WIFI”开头，则弹窗提示“该二维码不是WiFi二维码”；
          burialPoint.isNotQRcode({
            deviceSessionId: app.globalData.deviceSessionId,
            blueVersion: app.addDeviceInfo.blueVersion,
            deviceId: app.addDeviceInfo.deviceId,
            linkType: app.addDeviceInfo.linkType,
            sn: app.addDeviceInfo.sn,
            sn8: app.addDeviceInfo.sn8,
            type: app.addDeviceInfo.type,
            moduleVison: app.addDeviceInfo.moduleVersion,
          })
          Dialog.confirm({
            title: `该二维码不是WiFi二维码`,
            confirmButtonText: '重新扫描',
            cancelButtonText:'取消',
            confirmButtonColor: self.data.brandConfig.confirmButtonColor2,
            cancelButtonColor: self.data.brandConfig.cancelButtonColor4,
          }).then((res) => {
            if (res.action == 'confirm') {
              self.scanCode()
            }
          })
        }

      },
      fail (err) {
        console.log('err======================:',err)
        // Dialog.confirm({
        //   title: `未找到二维码`,
        //   confirmButtonText: '重新扫描',
        //   cancelButtonText:'取消',
        //   confirmButtonColor: self.data.brandConfig.confirmButtonColor2,
        //   cancelButtonColor: self.data.brandConfig.cancelButtonColor4,
        // }).then((res) => {
        //   if (res.action == 'confirm') {
        //     self.scanCode()
        //   }
        // })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  chosePhoneBrand(){
    burialPoint.switchBrand({
      deviceSessionId: app.globalData.deviceSessionId,
      blueVersion: app.addDeviceInfo.blueVersion,
      deviceId: app.addDeviceInfo.deviceId,
      linkType: app.addDeviceInfo.linkType,
      sn: app.addDeviceInfo.sn,
      sn8: app.addDeviceInfo.sn8,
      type: app.addDeviceInfo.type,
      moduleVison: app.addDeviceInfo.moduleVersion,
    })
    this.setData({
      phoneBrandGuideImg:imgUrl+imgesList['wifi_guide_up'],
      showPicker:true
    })

  },

  confirmChange(e){
    console.log('e:',e)
    let phoneBrandValue = e.detail.value.toLowerCase()    
    this.switchPhoneBrand(phoneBrandValue)
    this.toggleActionSheet()
    if(phoneBrandValue != 'samsung'){
      this.setData({
        contentHeight:1200
      })
    }
  },
  toggleActionSheet(){
    this.setData({
      phoneBrandGuideImg:imgUrl+imgesList['wifi_guide_down'],
      showPicker:false
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})