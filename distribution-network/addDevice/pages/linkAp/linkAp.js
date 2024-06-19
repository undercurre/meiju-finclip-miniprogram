const app = getApp()
const addDeviceMixin = require('../../../assets/sdk/common/addDeviceMixin')
const paths = require('../../../assets/sdk/common/paths')
const netWordMixin = require('../../../assets/js/netWordMixin')
const log = require('m-miniCommonSDK/utils/log')
const getFamilyPermissionMixin = require('../../../assets/js/getFamilyPermissionMixin.js')
const imgBaseUrl = app.getGlobalConfig().imgBaseUrl
import { showToast, getFullPageUrl } from 'm-miniCommonSDK/index'
import { burialPoint } from './assets/js/burialPoint'
import { login } from '../../../assets/sdk/common/paths'
import { addDeviceSDK } from '../../../../utils/addDeviceSDK'
import { imgesList } from '../../../assets/js/shareImg.js'
const imgUrl = imgBaseUrl.url + '/shareImg/' + app.globalData.brand
Page({
  behaviors: [addDeviceMixin, netWordMixin, getFamilyPermissionMixin],
  /**
   * 页面的初始数据
   */
  data: {
    deviceName: '',
    type: '',
    wifoInfo: {
      name: 'midea_ca_0059',
    },
    isLinkDeviceWifi: false,
    udpMsg: '',
    psw: '12345678',
    adData: {},
    brandName: '', //企业热点名
    deviceImg: '',
    linkDeviceWifi: '去连接',
    system: '',
    isShowStepDetail: false, //是否展示详情
    isGetDeviceWifi: false, //是否只显示设备ap
    readingTimer: 3, //阅读页面时间 秒
    isGetWifiList: true, //是否获取wifi列表
    wifiListTitle: '选择家庭WIFI',
    guideGif: '',
    netStatusChange: false, //网络状态是否变化
    pageStatus: 'show', //页面状态
    getWifiList: [], //wifi列表
    flag: false,
    brand: '',
    originProgramme:true,//原来方案
    showNormalPaperwork:true,//非COLMO品牌按原来方案
    wifiHotspot:'',//热点名
    guideHotspot:'',//指引热点名
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    getApp().onLoadCheckingLog()
    this.data.brand = app.globalData.brand
    this.setData({
      brand: this.data.brand,
      android_ApName: imgUrl + imgesList['android_ApName'],
      linkDeviceWifiMidea: imgUrl + imgesList['linkDeviceWifiMidea'],
      android_linkDeviceWifiBugu: imgUrl + imgesList['android_linkDeviceWifiBugu'],
      linkDeviceWifiBugu: imgUrl + imgesList['linkDeviceWifiBugu'],
      wifi: imgUrl + imgesList['wifi'],
      pswImg: imgUrl + imgesList['psw'],
      detailPackUp: imgUrl + imgesList['detailPackUp'],
      detailExpand: imgUrl + imgesList['detailExpand'],
    })
    console.log('this.data.brand------:', this.data.brand)
    // if (this.data.brand == 'meiju') {
    //   wx.setNavigationBarColor({
    //     frontColor: '#000000',
    //     backgroundColor: '#ffffff',
    //   })
    // } else if (this.data.brand == 'colmo') {
    //   wx.setNavigationBarColor({
    //     frontColor: '#ffffff',
    //     backgroundColor: '#1A1A1F',
    //   })
    //   // wx.setBackgroundColor({
    //   //   backgroundColor: '#1A1A1F',
    //   // })
    // }
    this.wifiService = app.globalData.linkupSDK.commonIndex.wifiService
    console.log('linkAp.js onLoad() linkupSDK', app.globalData.linkupSDK)
    this.checkSystm()
    this.getLoginStatus().then(() => {
      if (app.globalData.isLogon) {
        this.judgeDeviceType()
        this.checkFamilyPermission()
        let { moduleType, deviceName, type, sn8, deviceId, blueVersion, mode, enterprise, deviceImg } =
          app.addDeviceInfo
        this.setData({
          deviceImg: deviceImg,
          deviceName: deviceName,
          linkDeviceWifi: '去连接',
          type: type,
          brandName: this.getBrandBname(enterprise),
        })
        // this.onLinkDeviceWifi(this.data.brandName, this.data.type)
        this.readingGuideTiming() //阅读计时
        // this.onNetType()
        burialPoint.linkApView({
          deviceSessionId: app.globalData.deviceSessionId,
          type,
          sn8,
          linkType: app.addDeviceInfo.linkType,
        })
        this.saveDeviceImg(deviceImg)
      } else {
        this.navToLogin()
      }
    })
    // if (app.globalData.systemInfo.platform == 'android') {
    //     this.getWifiList() //提前获取下wifi列表
    // }
    this.wifiListSheet = this.selectComponent('#wifi-list-sheet') //组件的id
    getApp().setMethodCheckingLog('linkApPageInit')
  },
  getLoginStatus() {
    return app
      .checkGlobalExpiration()
      .then((res) => {
        this.setData({
          isLogon: app.globalData.isLogon,
        })
      })
      .catch((err) => {
        app.globalData.isLogon = false
        this.setData({
          isLogin: app.globalData.isLogon,
        })
      })
  },
  navToLogin() {
    app.globalData.isLogon = false
    this.setData({
      isLogin: app.globalData.isLogon,
    })
    wx.navigateTo({
      url: login,
    })
  },
  //点击反馈
  feedback() {
    let { type, sn8, linkType } = app.addDeviceInfo
    burialPoint.clickfeedback({
      deviceSessionId: app.globalData.deviceSessionId,
      type,
      sn8,
      linkType: linkType,
    })
    wx.navigateTo({
      url: paths.feedback,
    })
  },
  //关闭帮助弹窗
  closeHelpDialog() {
    let { type, sn8, linkType } = app.addDeviceInfo
    burialPoint.clickCloseHelpDialog({
      deviceSessionId: app.globalData.deviceSessionId,
      type,
      sn8,
      linkType: linkType,
    })
  },
  //判断系统展示UI
  checkSystm() {
    if (app.globalData.systemInfo.system.includes('Android')) {
      this.setData({
        system: 'Android',
      })
    } else {
      this.setData({
        system: 'iOS',
      })
    }
  },
  //阅读指引计时
  readingGuideTiming() {
    let { readingTimer } = this.data
    const timer = setInterval(() => {
      if (readingTimer >= 0) {
        this.setData({
          readingTimer: readingTimer--,
        })
      } else {
        clearInterval(timer)
      }
    }, 1000)
  },
  //切换步骤详情展示
  switchShowDetail() {
    getApp().setActionCheckingLog('switchShowDetail', '切换步骤详情展示隐藏')
    let { type, sn8, linkType } = app.addDeviceInfo
    this.setData({
      isShowStepDetail: !this.data.isShowStepDetail,
    })
    burialPoint.clickLookLinkStep({
      deviceSessionId: app.globalData.deviceSessionId,
      type,
      sn8,
      linkType,
    })
    wx.pageScrollTo({
      selector: '.detail-title',
      duration: 500,
    })
  },
  //预加载设备图片
  saveDeviceImg(deviceImgUrl) {
    if (wx.preloadAssets) {
      wx.preloadAssets({
        data: [
          {
            type: 'image',
            src: deviceImgUrl,
          },
        ],
        success(resp) {
          console.log('@module linkAp.js\n@method saveDeviceImg\n@desc 预加载设备图片成功\n', resp)
        },
        fail(err) {
          console.error('@module linkAp.js\n@method saveDeviceImg\n@desc 预加载设备图片失败\n', err)
        },
      })
    } else {
      console.error('@module linkAp.js\n@method saveDeviceImg\n@desc 预加载设备图片失败，基础库版本不支持')
    }
  },
  //判断设备是否启了设备热点
  checkDeviceWifiOpen(type) {
    if (this.data.system == 'iOS') return //ios不做此判断
    type = type.toLocaleLowerCase()
    let { ssid,fm,dataSource } = app.addDeviceInfo
    let brandName =ssid?ssid.split('_')[0].toLocaleLowerCase():this.data.brandName
    let isOpenDeviceWifi = false //根据wifi列表返回判断是否起了设备ap
    let deviceWifiSSID = ''
    console.log('this.wifiService', this.wifiService)
    this.wifiService.getWifiList(
      (wifiList) => {
        getApp().setMethodCheckingLog('连接设备页获取wifi列表成功')
        wifiList.forEach((item, index) => {
          let deviceSSID = item.SSID.toLocaleLowerCase()
          if((fm == 'selectType' || fm == 'scanCode') && dataSource == 1){
           if(deviceSSID.includes(`midea_${type}`) || deviceSSID.includes(`colmo_${type}`)) {
            isOpenDeviceWifi = true
            deviceWifiSSID = deviceSSID
           }
          } else if (deviceSSID.includes(`${brandName}_${type}`)) {
            isOpenDeviceWifi = true
            deviceWifiSSID = deviceSSID
          }
        })
        if (isOpenDeviceWifi) {
          console.log('找到设备ap===============', deviceWifiSSID)
          getApp().setMethodCheckingLog(`用户已起设备wifi，设备wifi名为${deviceWifiSSID}`)
        } else {
          console.log('没找到设备ap===============')
          getApp().setMethodFailedCheckingLog('wifi列表内未找到设备wifi', '')
        }
      },
      (error) => {
        console.log('获取wifi列表失败', error)
        getApp().setMethodFailedCheckingLog('连接设备页获取wifi列表失败', `error=${JSON.stringify(error)}`)
      }
    )
  },
  //获取wifi列表信息 IsCyc是否循环
  getWifiList(IsCyc = false, interval = 2000) {
    let that = this
    if (this.data.isGetWifiList) {
      that.wifiService.getWifiList(
        (wifiList) => {
          that.setData({
            wifiList: wifiList,
          })
          if (IsCyc) {
            setTimeout(() => {
              that.getWifiList(true)
            }, interval)
          }
        },
        (error) => {
          console.log('获取wifi列表失败', error)
        }
      )
    }
  },

  //关闭wifi列表弹窗 hideWifiListSheet
  hideWifiListSheet() {
    console.log('hideWifiListSheet=============')
    this.data.isGetWifiList = false
    let { type, sn8, linkType } = app.addDeviceInfo
    burialPoint.closeDeviceWifiListSheet({
      deviceSessionId: app.globalData.deviceSessionId,
      type,
      sn8,
      linkType,
      wifiList: this.data.wifiList,
    })
  },

  //wifi列表点击去设置页
  clickNoFoundFamilyWifi() {
    this.switchWifi()
    let { type, sn8, linkType } = app.addDeviceInfo
    burialPoint.clickNoFoundDeviceWifi({
      deviceSessionId: app.globalData.deviceSessionId,
      type,
      sn8,
      linkType,
      wifiList: this.data.wifiList,
    })
  },
  goLinkDeviceWifi() {
    getApp().setActionCheckingLog('goLinkDeviceWifi', '点击去连接设备wifi按钮')
    if (this.data.readingTimer > 0) {
      //未阅读完毕
      getApp().setMethodFailedCheckingLog('goLinkDeviceWifi', '未阅读完毕')
      return
    }
    let { type, sn8, sn, linkType, brandName } = app.addDeviceInfo
    burialPoint.goToLinkDeviceWifi({
      deviceSessionId: app.globalData.deviceSessionId,
      type,
      sn8,
      sn,
      linkType,
    })
    this.switchWifi(false)
  },
  goToSetPage() {
    console.log('去设置页')
    this.switchWifi() //去设置页手动连接
  },
  //选择连接设备ap
  async selectWifi(e) {
    let res = e.detail
    console.log('kkkkkkk', res.BSSID)
    wx.showLoading({
      title: '连接中',
    })
    try {
      await this.connectWifi(res.BSSID, addDeviceSDK.deviceApPassword, false)
      wx.navigateTo({
        url: paths.linkDevice,
      })
      wx.hideLoading()
    } catch (error) {
      wx.hideLoading()
      showToast('连接设备WiFi失败,\r\n请在设备页中手动选取连接')
      setTimeout(() => {
        this.switchWifi() //去设置页手动连接
      }, 2000)
    }
  },

  //校验是否连上设备ap
  async checkLinkWifi(type) {
    let self = this
    let { ssid,fm,dataSource } = app.addDeviceInfo
    let brandName = ssid?ssid.split('_')[0].toLocaleLowerCase():this.data.brandName
    type = type.toLocaleLowerCase()
    if (this.data.isLinkDeviceWifi) {
      getApp().setMethodCheckingLog('checkLinkWifi 已连上设备wifi')
      return //已连上设备wifi
    }
    console.log('checkLinkWifi===========', self.data.isLinkDeviceWifi)
    self.wifiService
      .getConnectedWifi()
      .then((res) => {
        console.log('wifi info', res, res.SSID.includes(`${brandName}_${type}`), !self.data.isLinkDeviceWifi)
        log.info('当前wifi info', res)
        burialPoint.apLocalLog({
          log: {
            msg: '调用微信接口wx.getConnectedWifi 成功',
            wifiInfo: res,
          },
        })
        app.globalData.linkupSDK.commonIndex.commonUtils.apLogReportEven({
          msg: '调用微信接口wx.getConnectedWifi 成功',
          res: res,
        })
        getApp().setMethodCheckingLog(`wx.getConnectedWifi()成功。wifiInfo=${JSON.stringify(res)}`)
        let isCompatibleHot = false
        if ((fm == 'selectType' || fm == 'scanCode') && dataSource == 1){
          if ((res.SSID.toLocaleLowerCase().includes(`midea_${type}`) || res.SSID.toLocaleLowerCase().includes(`colmo_${type}`)) && !self.data.isLinkDeviceWifi){
            isCompatibleHot = true
          }
        }
        if ((res.SSID.toLocaleLowerCase().includes(`${brandName}_${type}`) && !self.data.isLinkDeviceWifi) || isCompatibleHot) {
          // showToast('连上了设备wifi')
          self.data.isLinkDeviceWifi = true
          log.info('调用getConnectedWifi判断 连上了设备ap')
          console.log('连上了设备ap 111')
          getApp().setMethodCheckingLog('wx.getConnectedWifi()已连上设备wifi')
          app.globalData.linkupSDK.commonIndex.commonUtils.apLogReportEven({
            msg: 'wx.getConnectedWifi()已连上设备wifi',
          })
          let connectWifiDeviceHotspot = {
            deviceSessionId: app.globalData.deviceSessionId,
            type: app.addDeviceInfo.type,
            sn8: app.addDeviceInfo.sn8,
            moduleVersion: app.addDeviceInfo.blueVersion,
            linkType: app.addDeviceInfo.linkType,
            ssid: res.SSID,
            rssi: res.signalStrength,
          }
          burialPoint.connectWifiDeviceHotspot(connectWifiDeviceHotspot)
          app.apNoNetBurialPoint.connectWifiDeviceHotspot = connectWifiDeviceHotspot //暂存
          //重置当前连接热点信息
          app.addDeviceInfo.BSSID = res.BSSID
          app.addDeviceInfo.ssid = res.SSID
          app.addDeviceInfo.rssi = res.signalStrength
          app.addDeviceInfo.frequency = res.frequency
          wx.stopWifi()
          console.log('开始跳转')
          if (getFullPageUrl().includes('linkAp')) {
            console.log('是配网页进行连接')
            wx.navigateTo({
              url: paths.linkDevice,
            })
          }
        } else {
          if (this.data.pageStatus == 'show') {
            //连上的不是设备ap 则继续获取判断
            setTimeout(() => {
              console.log('连上的不是设备ap=====')
              this.checkLinkWifi(brandName, type)
            }, 1500)
          }
        }
      })
      .catch((error) => {
        console.log('获取当前连接wifi失败', error)
        burialPoint.apLocalLog({
          log: {
            msg: '调用微信接口wx.getConnectedWifi 失败',
            error: error,
          },
        })
        getApp().setMethodFailedCheckingLog(
          'wx.getConnectedWifi()',
          `调用微信接口wx.getConnectedWifi。error=${JSON.stringify(error)}`
        )
        getApp().globalData.linkupSDK.commonIndex.commonUtils.apLogReportEven({
          msg: '调用微信接口wx.getConnectedWifi 失败',
          error: error,
        })
        if (this.data.pageStatus == 'show') {
          setInterval(() => {
            this.checkLinkWifi(brandName, type)
          }, 1500)
        }
      })
  },

  //监听是否连上设备ap
  onLinkDeviceWifi(brandName, type) {
    let self = this
    type = type.toLocaleLowerCase()
    wx.onWifiConnected((res) => {
      console.log('监听连接上wifi后响应', res, brandName, type, self.data.isLinkDeviceWifi)
      log.info('非wifi 连上wifi后 wifi info', res)
      burialPoint.apLocalLog({
        log: {
          msg: '调用微信接口wx.onWifiConnected 响应',
          res: res,
        },
      })
      app.globalData.linkupSDK.commonIndex.commonUtils.apLogReportEven({
        msg: '调用微信接口wx.onWifiConnected 响应',
        res: res,
      })
      if (res.wifi.SSID.toLocaleLowerCase().includes(`${brandName}_${type}`) && !self.data.isLinkDeviceWifi) {
        // showToast('连上了设备wifi')
        self.data.isLinkDeviceWifi = true
        console.log('连上了设备ap')
        log.info('连上了设备ap')
        getApp().setMethodCheckingLog('wx.onWifiConnected()已连上设备wifi')
        app.globalData.linkupSDK.commonIndex.commonUtils.apLogReportEven({
          msg: '根据wx.onWifiConnected()结果判定已连上设备wifi',
        })
        let burialInfo = {
          deviceSessionId: app.globalData.deviceSessionId,
          type: app.addDeviceInfo.type,
          sn8: app.addDeviceInfo.sn8,
          moduleVersion: app.addDeviceInfo.blueVersion,
          linkType: app.addDeviceInfo.linkType,
          ssid: res.wifi.SSID,
          rssi: res.wifi.signalStrength,
        }
        burialPoint.connectWifiDeviceHotspot(burialInfo)
        app.apNoNetBurialPoint.connectWifiDeviceHotspot = burialInfo //暂存
        //重置当前连接热点信息
        app.addDeviceInfo.ssid = res.wifi.SSID
        app.addDeviceInfo.rssi = res.wifi.signalStrength
        app.addDeviceInfo.frequency = res.wifi.frequency
        this.setApDeviceInfo(res.wifi)
        wx.offWifiConnected()
        wx.navigateTo({
          url: paths.linkDevice,
        })
      }
    })
  },

  //暂存设备ap信息
  setApDeviceInfo(wifiInfo) {
    let apDeviceWifiInfo = {
      SSID: wifiInfo.SSID,
      password: '12345678',
    }
    console.log('暂存设备ap信息======', apDeviceWifiInfo)
    app.addDeviceInfo.apDeviceWifiInfo = apDeviceWifiInfo
  },
  copy() {
    const _this = this
    getApp().setActionCheckingLog('copy', '点击复制密码')
    if (this.data.flag) return
    this.data.flag = true
    wx.setClipboardData({
      data: this.data.psw,
      success(res) {
        showToast('复制成功') // 持续时间3000毫秒
        getApp().setMethodCheckingLog('wx.setClipboardData()')
        // wx.hideLoading()
        // wx.getClipboardData({
        //   success(res) {
        //     showToast('复制成功')
        //     console.log(res.data) // data
        //     log.info('复制内容成功', res.data)
        //     getApp().setMethodCheckingLog('wx.getClipboardData()')
        //   },
        //   fail(error) {
        //     log.info('复制内容error', error)
        //     getApp().setMethodFailedCheckingLog('wx.getClipboardData()', `复制密码异常。error=${JSON.stringify(error)}`)
        //   },
        // })
        setTimeout(()=>{
          _this.data.flag = false
        },3500)
      },
      fail(error) {
        _this.data.flag = false
        getApp().setMethodFailedCheckingLog('wx.setClipboardData()', `复制密码异常。error=${JSON.stringify(error)}`)
      },
    })
  },
  //找不到ap
  clickNoFoundWifi() {
    getApp().setActionCheckingLog('clickNoFoundWifi', '点击找不到设备wifi')
    this.selectComponent('#bottomFrame').showFrame()
    let { moduleType, deviceName, type, sn8, deviceId, blueVersion, mode } = app.addDeviceInfo
    burialPoint.notFoundDeviceWifiPopupView({
      deviceSessionId: app.globalData.deviceSessionId,
      type,
      sn8,
      linkType: app.addDeviceInfo.linkType,
    })
  },
  //帮助弹窗 重新设置
  retrySetDevice() {
    getApp().setActionCheckingLog('retrySetDevice', '点击重新起设备热点')
    // const eventChannel = this.getOpenerEventChannel();
    let { fm, type, sn8, linkType } = app.addDeviceInfo
    burialPoint.clickreytyDevice({
      deviceSessionId: app.globalData.deviceSessionId,
      type,
      sn8,
      linkType: linkType,
    })
    wx.reLaunch({
      url: paths.addGuide,
    })
    // if (fm != 'autoFound') {
    //   //选型 扫码 回到指引页
    //   wx.reLaunch({
    //     url: paths.addGuide,
    //   })
    //   return
    // }
    // wx.reLaunch({
    //   url: paths.scanDevice,
    // })
  },
  //当前手机网络状态
  nowNetType() {
    return new Promise((resolve, reject) => {
      wx.getNetworkType({
        success(res) {
          console.log('当前网络状况', res)
          resolve(res.networkType)
        },
        fail(error) {
          console.log('获取当前网络状况错误', error)
          reject(error)
        },
      })
    })
  },


  /*
  判断是否COLMO设备 且是否 扫码、选型
    1.自发现  根据搜索到的热点或蓝牙广播中到的名称
    2.COLMO品牌设备
      1.扫码、选型
        1.datasource =1  'midea_b7_xxxx 或 colmo_b7_xxxx (4位数字和字母)'
        2.datasource !=1   midea_b7_xxxx (4位数字和字母)

    3.非COLMO品牌按原来方案处理
      midea_b7_xxxx (4位数字和字母)
  */
  judgeDeviceType(){
    let { ssid, fm,dataSource,type,enterprise } = app.addDeviceInfo
    console.log('app.addDeviceInfo:::::',app.addDeviceInfo)

    let typeName = type.toLocaleLowerCase()
    let wifiHotspot = `${this.getBrandBname(enterprise)}_${typeName}`
    if(!app.globalData.brandConfig[this.data.brand].hotspotWifiFlag){ // 设置配置项，美居暂时不上线
      this.setData({
        wifiHotspot:wifiHotspot,
      })
      return
    }
    if (fm == 'autoFound') {//自发现
      let brandName = ssid.split('_')[0].toLocaleLowerCase()
      if(brandName == 'colmo'){
        brandName = 'COLMO'
      }
      let android_ApName = imgUrl + imgesList['android_ApName']
      let linkDeviceWifiMidea = imgUrl + imgesList['linkDeviceWifiMidea']
      if (this.data.brand == 'meiju') {
        android_ApName = imgUrl + imgesList['android_ApName_colmo'] //显示带colmo热点的动图
        linkDeviceWifiMidea = imgUrl + imgesList['linkDeviceWifiMidea_colmo']
      }
      if (!ssid.includes(brandName)) {
        if (this.data.brand == 'meiju' && brandName !== 'COLMO') {
          android_ApName = imgUrl + imgesList['android_ApName_midea'] //显示带midea热点的动图
          linkDeviceWifiMidea = imgUrl + imgesList['linkDeviceWifiMidea_midea']
        }
      } else { // 美居的导航图片不是同一的，图片有区分colmo和midea的热点，COLMO则是一样的
        if (this.data.brand == 'meiju' && brandName !== 'COLMO') {
          android_ApName = imgUrl + imgesList['android_ApName_midea'] //显示带midea热点的动图
          linkDeviceWifiMidea = imgUrl + imgesList['linkDeviceWifiMidea_midea']
        } else if (this.data.brand == 'meiju' && brandName == 'COLMO') {
          android_ApName = imgUrl + imgesList['android_ApName_colmo'] //显示带colmo热点的动图
          linkDeviceWifiMidea = imgUrl + imgesList['linkDeviceWifiMidea_colmo']
        }
      }
      wifiHotspot = `${brandName}_${typeName}`
      this.setData({
        showNormalPaperwork: false,
        deviceBrandName: brandName,
        wifiHotspot: wifiHotspot,
        android_ApName: android_ApName,
        linkDeviceWifiMidea: linkDeviceWifiMidea,
        guideHotspot:wifiHotspot
      })
      return
    }
    if(app.addDeviceInfo.brandTypeInfo){
      if(app.addDeviceInfo.brandTypeInfo.toLocaleLowerCase() == 'colmo'){ // COLMO品牌
        if(fm == 'selectType' || fm == 'scanCode'){ //选型、扫码
          if(dataSource == 1 ){
            let android_ApName = imgUrl + imgesList['android_ApName']
            let linkDeviceWifiMidea = imgUrl + imgesList['linkDeviceWifiMidea']
            console.log('brand=colmo且data_source=1')
            wifiHotspot = `COLMO_${typeName}_xxxx 或 midea_${typeName}`

            if(this.data.brand == 'meiju'){
              android_ApName = imgUrl + imgesList['android_ApName_colmo'] //显示带colmo热点的动图
              linkDeviceWifiMidea = imgUrl + imgesList['linkDeviceWifiMidea_colmo']


            }
            this.setData({
              originProgramme:false,
              wifiHotspot:wifiHotspot,
              android_ApName:android_ApName,
              linkDeviceWifiMidea:linkDeviceWifiMidea,
              guideHotspot:`COLMO_${typeName}`

            })
          } else {
            console.error('brand=colmo且data_source不等于1')
            //按原来方案处理
            this.setData({
              originProgramme:true,
              showNormalPaperwork:true,
              wifiHotspot:wifiHotspot
            })
          }
        }
      } else {
        //非COLMO品牌按原来方案处理
        this.setData({
          originProgramme:true,
          showNormalPaperwork:true,
          wifiHotspot:wifiHotspot
        })
      }

    }else{
      // 按原来方案处理
      this.setData({
        originProgramme:true,
        showNormalPaperwork:true,
        wifiHotspot:wifiHotspot
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.data.isLinkDeviceWifi = false
    this.data.pageStatus = 'show'
    this.wifiService = app.globalData.linkupSDK.commonIndex.wifiService
    console.log('linkAp.js onShow() linkupSDK', app.globalData.linkupSDK)
    this.checkDeviceWifiOpen(app.addDeviceInfo.type) //判断是否起设备ap
    this.checkLinkWifi(app.addDeviceInfo.type)
    let { type, sn8, sn, linkType } = app.addDeviceInfo
    burialPoint.linkApPageShow({
      deviceSessionId: app.globalData.deviceSessionId,
      type,
      sn8,
      sn,
      linkType,
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.data.pageStatus = 'hide'
    let { type, sn8, sn, linkType } = app.addDeviceInfo
    burialPoint.linkApPageHide({
      deviceSessionId: app.globalData.deviceSessionId,
      type,
      sn8,
      sn,
      linkType,
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.data.pageStatus = 'unload'
    wx.offWifiConnected()
    getApp().onUnloadCheckingLog()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () { },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () { },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {},
})
