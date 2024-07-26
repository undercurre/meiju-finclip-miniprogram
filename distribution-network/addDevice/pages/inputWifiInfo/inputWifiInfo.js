// addDevice/pages/inputWifiInfo/inputWifiInfo.js
const app = getApp()
const log = require('m-miniCommonSDK/utils/log')
const addDeviceMixin = require('../../../assets/sdk/common/addDeviceMixin.js')
const checkAuthMixin = require('../../mixins/checkAuthMixin')
const netWordMixin = require('../../../assets/js/netWordMixin')
const paths = require('../../../assets/sdk/common/paths')
const bluetooth = require('../../../../pages/common/mixins/bluetooth.js')
const dialogCommonData = require('../../../../pages/common/mixins/dialog-common-data.js')
const getFamilyPermissionMixin = require('../../../assets/js/getFamilyPermissionMixin.js')
const imgBaseUrl = app.getGlobalConfig().imgBaseUrl
const environment = app.getGlobalConfig().environment
import { showToast, computedBehavior, getFullPageUrl } from 'm-miniCommonSDK/index'
import { string2Uint8Array } from 'm-utilsdk/index'
import { getScanRespPackInfo } from '../../../../utils/blueAdDataParse'
import { burialPoint } from './assets/js/burialPoint'
import { api } from '../../../../api'
import { encyptWifi, decodeWifi } from '../../../assets/js/utils'
import { deviceImgMap } from '../../../../utils/deviceImgMap'
import { addDeviceSDK } from '../../../../utils/addDeviceSDK.js'
import { setWifiStorage } from '../../utils/wifiStorage'
import { checkPermission } from '../../../../pages/common/js/permissionAbout/checkPermissionTip'
import Dialog from 'm-ui/mx-dialog/dialog'
const brandStyle = require('../../../assets/js/brand.js')
import { imgesList } from '../../../assets/js/shareImg.js'
import { commonDialog } from '../../../assets/js/commonDialog'
import { getPluginUrl } from '../../../../utils/getPluginUrl'
const backUpApUtil = require('../../../assets/asyncSubpackages/apUtils.js')
const imgUrl = imgBaseUrl.url + '/shareImg/' + app.globalData.brand
let interval = null
let showImgTime = null
const systemInfo = wx.getSystemInfoSync()
Page({
  behaviors: [
    addDeviceMixin,
    netWordMixin,
    computedBehavior,
    bluetooth,
    dialogCommonData,
    getFamilyPermissionMixin,
    checkAuthMixin,
  ],
  /**
   * 页面的初始数据
   */
  data: {
    currentHomeGroupId: '',
    isInitWifiSuccess: false,
    isCanSeePsw: brandStyle.config[app.globalData.brand].canSeePw,
    pswInputType: false,
    wifiDialogShow: false,
    wifiInputPlaceholder: '未获取到家庭WiFi',
    wifiInputRightText: '重新获取',
    isGetCurLinkWifiInfo: false, //是否获取到当前连接wifi信息

    netType: null,
    device: null,
    deviceId: null,
    deviceSn: null,
    wifiListShow: false,
    bindWifiTest: {
      //当前的wifi信息
      BSSID: '',
      EncryptType: '',
      SSIDLength: '',
      PswLength: '',
      SSIDContent: '',
      PswContent: '',
      randomCode: '',
      chain: '',
      signalStrength: '', //强度
      frequency: '', //频率
    },
    wifiList: [],
    connectStatus: 0, // 0未配网，1 连接中，2配网成功 3配网失败
    countDown: 30,
    isReady: 0, // 0 未进入指定的配网模式 1 将进入

    //新增
    applianceCode: '',
    ctrlType: '',
    guideStep: [
      // {
      //   type: 'location',
      //   title: '允许程序使用位置信息',
      //   desc: []
      // },
      {
        title: '请前往手机系统设置页，将手机连接上家庭WiFi，再返回本页面',
      },
      // {
      //   title: '将手机连接上WiFi（设备将通过此WiFi连接网络）',
      // },
    ],
    mode: null,
    isIpx: app.globalData.isPx,
    isSwitchWifi: false,
    tryGetWifiNum: 0, //重试获取wifi次数
    isLoad: true, //首次加载
    platform: '', //客户端平台
    nexText: '', //下一步的按钮文案
    // isSupport5G: false, //设备是否支持5Gwifi配网
    isSupport5G: (app.addDeviceInfo.guideInfo&&app.addDeviceInfo.guideInfo[0].wifiFrequencyBand== 2) ? true : false, //设备是否支持5Gwifi配网
    isGetWifiList: true, //是否获取wifi列表
    wifiListTitle: '选择家庭WIFI',
    isTipIosUpVersion: false, //是否提示ios升级版本
    pageStatus: 'show', //页面状态
    isCanAddDevice: true, //是否可添加设备
    clickNetFLag: false, //点击下一步防重复
    isShowRouttingImg: true, //是否显示图片
    permissionTypeList: {}, //权限状态参数
    spaceTip: ' ', //输入的wifi密码包含空格提示
    tempPsw: '', //暂存密码用于密码限制输入判断
    otherAndroidSystem: true, //是否非小米系的其他系统 true:是(非小米)  false:否(是小米或红米)
    continueConnectWifi: false, //是否继续连wifi (手动输入) false:不是手动输入，true是手动输入
    ishowDialog: false, //是否显示操作指引弹窗
    ishowManualInputWiFi: false, //是否显示手动输入弹窗
    messageContent: '', //手动弹窗内容
    focusWifiName: false, //是否聚焦wifi名输入框
    focusWifiPwd: false, //是否聚焦wifi密码输入框
    brand: '',
    dialogStyle: brandStyle.config[app.globalData.brand].dialogStyle, //弹窗样式
    blueCancelLinkModal: false,
    titleContent: '',
    brandConfig: app.globalData.brandConfig[app.globalData.brand],
    locationResFlag: '',
    isShowCode:false, //显示查看当前二维码提示
    currentWiFiPwd:'',
    currentWiFiName:'',
  },

  ifFindMatchedBlueDevice: false, // 非自发现是否匹配到设备蓝牙

  computed: {
    showNextText() {
      let { mode } = this.data
      // return mode == 'WB01_bluetooth_connection_network' ? '设备联网' : '下一步'
      return '下一步'
    },
    //当前连接wifi提示
    tipText() {
      // return `这个可能是一个5GHz WiFi，可能无法连接，请切换至2.4GHz WiFi`
      let { bindWifiTest, deviceName, isSupport5G, wifiList } = this.data
      let target = wifiList.filter((item) => {
        return item.SSID == bindWifiTest.SSIDContent && item.frequency != bindWifiTest.frequency
      })
      if (target.length != 0) {
        bindWifiTest.frequency = target[0].frequency
      }
      if (bindWifiTest && bindWifiTest.frequency && bindWifiTest.frequency > 5000 && !isSupport5G) {
        return '这可能是一个5GHz WiFi，请切换到2.4GHz WiFi'
      }
      if (
        bindWifiTest &&
        bindWifiTest.SSIDContent &&
        addDeviceSDK.bySSIDCheckIs5g(bindWifiTest.SSIDContent) &&
        !isSupport5G
      ) {
        return '这可能是一个5GHz WiFi，请切换到2.4GHz WiFi'
      }
      if (addDeviceSDK.isDeviceAp(bindWifiTest.SSIDContent.toLocaleLowerCase())) {
        return '暂不支持使用智能设备网络'
      }
      return ''
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    getApp().onLoadCheckingLog()
    this.data.brand = app.globalData.brand
    this.data.isSupport5G = (app.addDeviceInfo.guideInfo&&app.addDeviceInfo.guideInfo[0].wifiFrequencyBand== 2) ? true : false
    this.setData({
      brand: this.data.brand,
      guideImg: imgUrl + imgesList['linkGuide'],
      isSupport5G: this.data.isSupport5G,
      wifiConnect:(this.data.isSupport5G&&this.data.brand == 'colmo')?imgUrl + imgesList['wifiConnect_5G']: imgUrl + imgesList['wifiConnect'],
      questinoImg: imgUrl + imgesList['questino_new'],
      net_ic_fail: imgUrl + imgesList['net_ic_fail'],
      wifiShowImg: imgUrl + imgesList['wifiShow'],
      wifiHideImg: imgUrl + imgesList['wifiHide'],
    })
    console.log(this.data.brand)
    if(app.addDeviceInfo.mode == '21'){
      app.addDeviceInfo.mode = 'air_conditioning_bluetooth_connection_network'
    }
    this.logAddDivceInfo('添加设备参数', app.addDeviceInfo)
    const {
      moduleType,
      deviceImg,
      deviceName,
      type,
      sn8,
      ssid,
      deviceId,
      blueVersion,
      mode,
      guideInfo,
      enterprise,
      brandName,
      isCheckGray,
      fm,
      referenceRSSI,
    } = app.addDeviceInfo
    try {
      if (!app.globalData.linkupSDK) {
        app.globalData.linkupSDK = await require.async('../../../assets/sdk/index')
      }
      this.wifiService = app.globalData.linkupSDK.commonIndex.wifiService
      this.udpService = app.globalData.linkupSDK.commonIndex.udpService
      console.log('加载apUtils结果前：', app.addDeviceInfo)
      app.addDeviceInfo.apUtils = backUpApUtil
      getApp().setMethodCheckingLog('requireApUtils')
    } catch (error) {
      console.error('linkupSDK fail', error)
      getApp().setMethodFailedCheckingLog('requireApUtils', `分包异步加载apUtils异常。error=${JSON.stringify(error)}`)
    }
    console.log('加载apUtils结果', app.addDeviceInfo)
    this.getLoginStatus().then(async () => {
      if (app.globalData.isLogon) {
        // this.getAddDeviceInfo()
        // this.checkNet()
        this.checkFamilyPermission()
        let from_download_page = false
        //获取添加设备灰度名单判断是否是灰度用户
        try {
          let isCan = await addDeviceSDK.isGrayUser()
          //如果是从落地页面过来的，则不需要检查灰度
          from_download_page = app.globalData.from_download_page
          if (from_download_page) {
            this.setData({
              isCanAddDevice: true,
            })
          } else if (!isCan && mode != 'air_conditioning_bluetooth_connection_network') {
            console.log('=====this is on load')
            console.log('屏蔽了配网入口')
            this.setData({
              isCanAddDevice: isCan,
            })
            burialPoint.viewNoSupportPage({
              deviceSessionId: app.globalData.deviceSessionId,
            })
            return
          }
        } catch (error) {
          console.log(error)
        }
        if (!deviceImg || !deviceName) {
          // 设备图片或名称缺失则补全
          let typeAndName
          if (fm == 'selectType') {
            console.log('设备图片名称:', type, sn8)
            typeAndName = this.getDeviceImgAndName(type, sn8)
            console.log('设备图片名称1:', typeAndName, sn8)
          } else {
            typeAndName = this.getDeviceImgAndName(type, sn8)
          }
          if (!deviceImg) app.addDeviceInfo.deviceImg = typeAndName.deviceImg
          if (!deviceName) app.addDeviceInfo.deviceName = typeAndName.deviceName
        }
        this.setData({
          deviceName: deviceName || app.addDeviceInfo.deviceName,
          mode: mode || 0, //默认ap
          isSupport5G: (guideInfo && guideInfo[0].wifiFrequencyBand) == 2 ? true : false,
        })
        if (!brandName) {
          app.addDeviceInfo.brandName = this.getBrandBname(enterprise)
        }
        //设置连接方式
        app.addDeviceInfo.linkType = this.getLinkType(mode)
        this.checkSystm()
        if (this.data.system == 'iOS') {
          this.locationAuthorize() //判断用户是否授权小程序使用位置权限
        }
        // app.globalData.deviceSessionId = creatDeviceSessionId(app.globalData.userData.uid)
        if (mode == 0) {
          this.getWifisList()
        }
        this.getAgainCheckList() //提前获取需二次确权设备固件名单
      } else {
        this.navToLogin()
      }
    })
    //修改点击切换wifi，wifi列表弹窗默认是空的，然后再显示wifi列表
    if (app.addDeviceInfo.mode == 0) {
      this.getWifisList()
    }
    this.wifiListSheet = this.selectComponent('#wifi-list-sheet') //组件的id
    const res = wx.getSystemInfoSync()
    if (res.system.includes('Android') || res.system.includes('harmony')) {
        this.getWifiList() //提前获取下wifi列表
    }
    burialPoint.apLocalLog({
      log: {
        msg: '分包异步加载apUtils结果',
        res: app.addDeviceInfo.apUtils ? '成功' : '失败',
      },
    })
    getApp().setMethodCheckingLog('inputWifiPageInit')
    console.log('------------mode-------------')
    console.log('mode:', mode)
    console.log('fm:', fm)
    console.log('------------modeend-------------')
    if (mode == 0 || mode == 3) {
      if (fm == 'autoFound') {
        // 自发现入口
        this.handleCheckFlow()
      } else {
        // 非自发现入口，开启蓝牙扫描，按品类匹配
        this.searchBlueByType(type, sn8, ssid).then((device) => {
          console.log('---------开启蓝牙扫描--------')
          console.log('@module inputWifiInfo.js\n@method onLoad\n@desc 匹配到设备信息\n', device)
          this.ifFindMatchedBlueDevice = true
          this.getBlueGuide(device)
        })
      }
    }
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
      url: paths.login,
    })
  },

  //点击跳转wifi频率指引页
  goTofrequencyGuide() {
    wx.navigateTo({
      url: paths.frequencyGuide,
    })
  },
  //wifi 列表选取wifi
  selectWifi(e) {
    getApp().setActionCheckingLog('selectWifi', '点击选取wifi列表中的wifi')
    let res = e.detail
    let that = this
    let { type, sn8, linkType } = app.addDeviceInfo
    burialPoint.clickLinkFamilyWifi({
      deviceSessionId: app.globalData.deviceSessionId,
      type,
      sn8,
      linkType,
      wifiList: this.data.wifiList,
      wifiInfo: res,
    })
    app.globalData.saveCurWifiInfo = {...res}
    // if (res.BSSID != this.data.bindWifiTest.SSIDContent) {//新wifi 空已输入
    //     this.setData({
    //         'bindWifiTest.PswContent': '',
    //     })
    // }
    console.log('获取当前连接wifi信息:',app.globalData.saveCurWifiInfo)
    burialPoint.apLocalLog({
      log: {
        msg: '选取wifi列表中的wifi',
        res: res,
      },
    })
    log.info('获取当前连接wifi信息', res)
    log.info('storageWifiListV1======', wx.getStorageSync('storageWifiListV1'))
    let storageWifiListV1 = wx.getStorageSync('storageWifiListV1')
    if (storageWifiListV1 && storageWifiListV1[environment].length && decodeWifi(storageWifiListV1[environment])) {
      console.log('有对应环境的缓存wifi信息')
      log.info('有对应环境的wifi缓存')
      let storageWifiList = decodeWifi(wx.getStorageSync('storageWifiListV1')[environment])
      console.log('uuuuuuuuuuuuuuu', storageWifiList, res.BSSID)
      getApp().setMethodCheckingLog('有对应环境的缓存wifi信息')
      burialPoint.apLocalLog({
        log: {
          msg: '有对应环境的缓存wifi信息',
          res: {
            storageWifiList,
            BSSID: res.BSSID,
          },
        },
      })
      let isHasPsw = false
      let wifiNum = null
      storageWifiList.forEach((item, index) => {
        // if (item.BSSID == res.BSSID) {
        if (item.SSIDContent == res.SSID) {
          console.log('有这个wifi的storage')
          log.info('有当前连接wifi的缓存')
          getApp().setMethodCheckingLog('有当前连接wifi的缓存')
          burialPoint.apLocalLog({
            log: {
              msg: '有当前选择wifi的缓存',
            },
          })
          isHasPsw = true
          wifiNum = index
        }
      })
      if (isHasPsw) {
        //有这个wifi的storage
        that.setData({
          bindWifiTest: storageWifiList[wifiNum],
        })
      } else {
        that.setData({
          'bindWifiTest.PswContent': '', //移除密码
        })
        //赋值wifi显示
        that.initBindWifiTest(res.BSSID, res.SSID, res.SSID.length, '01', '12', res.signalStrength, res.frequency)
      }
    } else {
      //没有wifi storage 直接取当前连接的wifi
      console.log('没有对应环境的缓存wifi信息2- res:',res)
      log.info('没有对应环境的缓存wifi信息')
      getApp().setMethodCheckingLog('没有对应环境的缓存wifi信息')
      that.setData({
        'bindWifiTest.PswContent': '', //移除密码
      })
      that.initBindWifiTest(res.BSSID, res.SSID, res.SSID.length, '01', '12', res.signalStrength, res.frequency)
    }
    burialPoint.wifiInfo({
      ssid: res.SSID,
      frequency: res.frequency,
      rssi: res.signalStrength,
      deviceSessionId: app.globalData.deviceSessionId,
      moduleType: app.globalData.moduleType,
      type: app.globalData.type,
      sn8: app.globalData.sn8,
      moduleVison: app.globalData.blueVersion,
      linkType: app.addDeviceInfo.linkType,
    })
  },

  //判断ios是否需要升级版本
  checkSystm() {
    const res = wx.getSystemInfoSync()
    this.data.system = res.system
    console.log('res.system==========', res.system)
    if (res.system.includes('iOS')) {
      this.setData({
        // isTipIosUpVersion: true,
        system: 'iOS',
      })
    }
  },

  //点击已连上了wifi
  linktedWifi() {
    getApp().setActionCheckingLog('linktedWifi', '点击已连上了wifi')
    burialPoint.clickconnectedWifi({
      deviceSessionId: app.globalData.deviceSessionId,
    })
    Dialog.confirm({
      title: '若您已确定手机连上了家庭WiFi,请确保您当前的微信版本为8.0.17及以上版本',
      confirmButtonText: '我知道了',
      confirmButtonColor: this.data.dialogStyle.confirmButtonColor2,
      showCancelButton: false
    }).then((res) => {
      if (res.action == 'confirm') {
        burialPoint.viewTipUpVersion({
          deviceSessionId: app.globalData.deviceSessionId,
        })
      }
    })
    // wx.showModal({
    //   title: '提示',
    //   content: '若您已确定手机连上了家庭WiFi,请确保您当前的微信版本为8.0.17及以上版本',
    //   showCancel: false,
    //   confirmText: '我知道了',
    //   success: function (res) {
    //     if (res.confirm) {
    //       console.log('click confirm')
    //     }
    //   },
    //   complete() {
    //     burialPoint.viewTipUpVersion({
    //       deviceSessionId: app.globalData.deviceSessionId,
    //     })
    //   },
    // })
  },

  //切换wifi
  async inputPageSwitchWifi() {
    getApp().setActionCheckingLog('inputPageSwitchWifi', '切换wifi')
    let that = this
    if (this.data.clickFLag) {
      console.log('进入防重逻辑')
      // if(!this.data.locationResFlag) {
      //   wx.showToast({
      //     title: '网络不佳，请检查网络后重试',
      //     icon: 'none',
      //     duration: 2000,
      //   })
      // }
      return
    }
    this.data.clickFLag = true
    let { type, sn8, linkType } = app.addDeviceInfo
    const res = wx.getSystemInfoSync()
    console.log(res.system)
    if (res.system.includes('Android') || res.system.includes('harmony')) {
    //   let locationRes
      try {
        // let checkNetLocal = await getApp().checkNetLocal()
        // this.locationAuthorize()
        // locationRes = await checkPermission.loaction()
        // this.data.locationResFlag = locationRes
        // console.log('[loactionRes]', locationRes)
      } catch (error) {
        console.log('切换wifi error:', error)
        that.data.clickFLag = false
        return
        // wx.showToast({
        //   title: '网络不佳，请检查网络后重试',
        //   icon: 'none',
        //   duration: 2000,
        // })
      }
    //   if (!locationRes.isCanLocation) {
    //     console.log('进入isCanLocation位置权限逻辑')
    //     // this.setDialogMixinsData(true, '请开启位置权限', locationRes.permissionTextAll, false, [
    //     //   {
    //     //     btnText: '好的',
    //     //     flag: 'confirm',
    //     //   },
    //     //   {
    //     //     btnText: '查看指引',
    //     //     flag: 'lookGuide',
    //     //     type: 'location',
    //     //     permissionTypeList: locationRes.permissionTypeList,
    //     //   },
    //     // ])
    //     // setTimeout(() => {
    //     //   that.setData({
    //     //     clickFLag: false,
    //     //   })
    //     // }, 1000)
    //     // getApp().setMethodFailedCheckingLog('checkPermission', '未开位置权限')
    //     // return
    //     const obj = {
    //       title: '请开启位置权限',
    //       message: locationRes.permissionTextAll,
    //       confirmButtonText: '查看指引',
    //       type: 'location',
    //       permissionTypeList: locationRes.permissionTypeList,
    //       confirmButtonColor: this.data.dialogStyle.confirmButtonColor2,
    //       cancelButtonColor: this.data.dialogStyle.cancelButtonColor3,
    //     }
    //     //调用通用弹框组件
    //     commonDialog.showCommonDialog(obj)
    //     that.data.clickFLag = false
    //     console.log('进入isCanLocation位置权限逻辑，调用弹框组件11111')
    //     setTimeout(() => {
    //       this.data.actionScanClickFlag = false
    //     }, 1500)
    //     return
    //   }
      //安卓且获取到wifi列表
      try {
        console.log('获取wifi列表！！！！！')
        this.getWifiList(true)
        this.wifiListSheet.showFrame()
      } catch (error) {
        console.log('inputWifi 获取wifi列表:',error)
        that.data.clickFLag = false
      }
      burialPoint.showWifiListSheet({
        deviceSessionId: app.globalData.deviceSessionId,
        type,
        sn8,
        linkType,
        wifiList: this.data.wifiList,
      })
      this.setData({
        wifiList: this.data.wifiList,
      })
      setTimeout(() => {
        // that.setData({
        //   clickFLag: false,
        // })
        that.data.clickFLag = false
      }, 1000)
    } else {
      this.switchWifi()
      setTimeout(() => {
        // that.setData({
        //   clickFLag: false,
        // })
        that.data.clickFLag = false
      }, 1000)
    }
    burialPoint.clickSwitchWifi({
      deviceSessionId: app.globalData.deviceSessionId,
      type,
      sn8,
      linkType,
    })
  },

  //点击连接wifi
  linkWifi() {
    this.switchWifi()
    let { sn8, type, sn, linkType, blueVersion } = app.addDeviceInfo
    burialPoint.clickLinkWifi({
      deviceSessionId: app.globalData.deviceSessionId,
      type,
      sn8,
      sn,
      moduleVison: blueVersion,
      linkType,
    })
  },
  //移除wifi缓存
  removeLinkNetRecordStorage() {
    wx.removeStorageSync('linkNetRecord')
  },
  //提前获取需二次确权设备固件名单
  async getAgainCheckList() {
    try {
      app.addDeviceInfo.againCheckList = await this.getTwoLinkNetList()
      wx.setStorageSync('againCheckList', app.addDeviceInfo.againCheckList)
      getApp().setMethodCheckingLog('getAgainCheckList')
    } catch (error) {
      if (wx.getStorageSync('againCheckList')) {
        app.addDeviceInfo.againCheckList = wx.getStorageSync('againCheckList')
      } else {
        app.addDeviceInfo.againCheckList = await this.getTwoLinkNetList()
      }
      getApp().setMethodFailedCheckingLog(
        'getAgainCheckList',
        `获取需二次确权设备固件名单异常。error=${JSON.stringify(error)}`
      )
    }
  },
  getAddDeviceInfo() {
    let addDeviceInfo = {
      deviceName: '冰箱二代combo',
      deviceId: 'A0:68:1C:74:CB:BE', //设备蓝牙id
      mac: 'A0:68:1C:74:CB:BE', //设备mac combo:'A0:68:1C:74:CC:4A'  一代：'84:7C:9B:77:2D:47' 华凌：'A0:68:1C:BC:38:27'
      type: 'CA', //设备品类 AC
      sn8: '001A0481',
      deviceImg: '', //设备图片
      moduleType: 1, //模组类型 0：ble 1:ble+weifi
      blueVersion: 2, //蓝牙版本 1:1代  2：2代
      mode: 3,
      fm: 'nfc',
    }
    app.addDeviceInfo = addDeviceInfo
  },
  //clickWifiInputRightText
  clickWifiInputRightText() {
    let that = this
    if (this.data.isGetCurLinkWifiInfo) {
      that.showWifiList()
    } else {
      that.nowNetType().then((networkType) => {
        if (networkType != 'wifi') {
          this.setData({
            netType: 0,
          })
          return
        }
        that.getCurLinkWifiInfo()
      })
    }
  },
  //获取当前连接wifi的信息 onshow
  getCurLinkWifiInfo() {
    let that = this
    //获取当前连接wifi信息
    that.wifiService
      .getConnectedWifi(that.data.system)
      .then((res) => {
        console.log('获取当前连接wifi信息', res)
        console.log('获取全局当前连接wifi信息', app.globalData.saveCurWifiInfo)
        if(app.globalData.saveCurWifiInfo && this.data.currentWiFiPwd.length > 0 && this.data.currentWiFiName){
          res = app.globalData.saveCurWifiInfo
          // app.globalData.saveCurWifiInfo = ''
        } else {
          app.globalData.saveCurWifiInfo = res
        }
        console.log('storageWifiListV1======', wx.getStorageSync('storageWifiListV1'))
        
        log.info('获取当前连接wifi信息', res)
        log.info('storageWifiListV1======', wx.getStorageSync('storageWifiListV1'))
        burialPoint.apLocalLog({
          log: {
            msg: '调用微信接口wx.getConnectedWifi 成功',
            wifiInfo: res,
          },
        })
        let storageWifiListV1 = wx.getStorageSync('storageWifiListV1')
        if (storageWifiListV1 && storageWifiListV1[environment].length && decodeWifi(storageWifiListV1[environment])) {
          console.log('有对应环境的缓存wifi信息')
          log.info('有对应环境的wifi缓存')
          burialPoint.apLocalLog({
            log: {
              msg: '有对应环境的wifi缓存',
            },
          })

          // if (typeof wx.getStorageSync('bindWifiInfo') == 'object') { //未加密的做处理
          //     console.log('未加密的wifi信息')
          //     let bindWifiInfo = wx.getStorageSync('bindWifiInfo')-
          //     wx.setStorageSync('bindWifiInfo', encyptWifi(bindWifiInfo))
          // }
          let storageWifiList = decodeWifi(wx.getStorageSync('storageWifiListV1')[environment])
          console.log('uuuuuuuuuuuuuuu', storageWifiList, res.BSSID)
          if (Array.isArray(storageWifiList)) {
            let isHasPsw = false
            let wifiNum = null
            storageWifiList.forEach((item, index) => {
              if (item.SSIDContent == res.SSID) {
                //调整为用wifi名作为标示
                console.log('当前wifi-有这个wifi的storage')
                log.info('有当前连接wifi的缓存')
                burialPoint.apLocalLog({
                  log: {
                    msg: '有当前连接wifi的缓存',
                  },
                })
                isHasPsw = true
                wifiNum = index
              }
            })
            if (isHasPsw) {
              //有这个wifi的storage
              that.setData({
                bindWifiTest: storageWifiList[wifiNum],
              })
              if(this.data.currentWiFiPwd.length > 0 && this.data.currentWiFiName){
                that.setData({
                  'bindWifiTest.PswContent': this.data.currentWiFiPwd,
                  'bindWifiTest.PswLength': string2Uint8Array(this.data.currentWiFiPwd).length,
                  currentWiFiPwd : '',
                  currentWiFiName:''
                })
              }
              if (/\s+/g.test(this.data.bindWifiTest.PswContent)) {
                this.setData({
                  spaceTip: '输入的密码包含空格，请确认是否输入准确',
                })
              } else {
                this.setData({
                  spaceTip: ' ',
                })
              }
            } else {
              console.log('currentWiFiPwd==============2:',this.data.currentWiFiPwd)
              if(this.data.currentWiFiPwd.length > 0 && this.data.currentWiFiName){
                that.setData({
                  'bindWifiTest.PswContent': this.data.currentWiFiPwd,
                  'bindWifiTest.PswLength': string2Uint8Array(this.data.currentWiFiPwd).length,
                  currentWiFiPwd : '',
                  currentWiFiName:''
                })
              } else {
                that.setData({
                  'bindWifiTest.PswContent': '', //移除密码
                })
              }

              //赋值wifi显示
              that.initBindWifiTest(res.BSSID, res.SSID, res.SSID.length, '01', '12', res.signalStrength, res.frequency)
            }
          } else {
            //wifi 缓存异常
            wx.removeStorageSync('storageWifiListV1')
            that.initBindWifiTest(res.BSSID, res.SSID, res.SSID.length, '01', '12', res.signalStrength, res.frequency)
          }
        } else {
          //没有wifi storage 直接取当前连接的wifi
          console.log('没有对应环境的缓存wifi信息3')
          log.info('没有对应环境的缓存wifi信息')
          if(this.data.currentWiFiPwd.length > 0 && this.data.currentWiFiName){
            that.setData({
              'bindWifiTest.PswContent': this.data.currentWiFiPwd,
              'bindWifiTest.PswLength': string2Uint8Array(this.data.currentWiFiPwd).length,
              currentWiFiPwd : '',
              currentWiFiName:''
            })
          } else {
            that.setData({
              'bindWifiTest.PswContent': '', //移除密码
            })
          }
          that.initBindWifiTest(res.BSSID, res.SSID, res.SSID.length, '01', '12', res.signalStrength, res.frequency)
        }
        that.data.isGetCurLinkWifiInfo = true
        that.setData({
          wifiInputRightText: '切换WiFi',
          netType: 1,
        })
        burialPoint.wifiInfo({
          ssid: res.SSID,
          frequency: res.frequency,
          rssi: res.signalStrength,
          deviceSessionId: app.globalData.deviceSessionId,
          moduleType: app.globalData.moduleType,
          type: app.globalData.type,
          sn8: app.globalData.sn8,
          moduleVison: app.globalData.blueVersion,
          linkType: app.addDeviceInfo.linkType,
        })
      })
      .catch((err) => {
        console.log('getConnectedWifi', err)
        log.info('获取当前连接wifi错误', err)

        burialPoint.apLocalLog({
          log: {
            msg: '调用微信接口wx.getConnectedWifi 失败',
            error: err,
          },
        })
        that.setData({
          netType: 0,
        })
        if (err.errCode == '12005' || err.errCode == '12010') {
          this.data.tryGetWifiNum = this.data.tryGetWifiNum + 1
          if (this.data.tryGetWifiNum <= 3) {
            //异常自动重试3次
            that.initWifi()
          }
        } else if (err.errCode == '12006') {
          wx.showToast({
            title: '您未打开位置定位开关',
            icon: 'none',
          })
        }
        console.log('getConnectedWifi', err)
        log.info('获取当前连接wifi错误', err)
      })
  },

  //获取wifi列表信息 IsCyc是否循环
  getWifiList(IsCyc = false, interval = 2000) {
    let that = this
    if (this.data.isGetWifiList) {
      that.wifiService.getWifiSortByFrequency(
        (wifiList) => {
          that.setData({
            wifiList: wifiList,
          })
          if (IsCyc) {
            setTimeout(() => {
              that.getWifiList(true)
            }, interval)
          }
          burialPoint.apLocalLog({
            log: {
              msg: '调用微信接口wx.getWifiList 成功',
              wifiList: wifiList,
            },
          })
          getApp().setMethodCheckingLog('wx.getWifiList()')
        },
        (error) => {
          console.log('获取wifi列表失败', error)
          burialPoint.apLocalLog({
            log: {
              msg: '调用微信接口wx.getWifiList 失败',
              error: error,
            },
          })
          getApp().setMethodFailedCheckingLog('wx.getWifiList()', `获取wifi列表异常。error=${JSON.stringify(error)}`)
        }
      )
    }
  },

  //关闭wifi列表弹窗 hideWifiListSheet
  hideWifiListSheet() {
    console.log('hideWifiListSheet=============')
    this.data.isGetWifiList = false
    let { type, sn8, linkType } = app.addDeviceInfo
    burialPoint.closeWifiListSheet({
      deviceSessionId: app.globalData.deviceSessionId,
      type,
      sn8,
      linkType,
      wifiList: this.data.wifiList,
    })
  },

  //wifi列表点击去设置页
  async clickNoFoundFamilyWifi() {
    this.switchWifi()
    let { type, sn8, linkType } = app.addDeviceInfo
    burialPoint.clickNoFoundFamilyWifi({
      deviceSessionId: app.globalData.deviceSessionId,
      type,
      sn8,
      linkType,
      wifiList: this.data.wifiList,
    })
    this.loopGetWifiInfo()
  },

  async loopGetWifiInfo() {
    let { SSIDContent } = this.data.bindWifiTest
    try {
      let wifiInfo = await this.wifiService.getConnectedWifi()
      getApp().setMethodCheckingLog('wx.getConnectedWifi()')
      console.log('[wifi列表点击去设置页 wifiInfo]', wifiInfo, SSIDContent)
      if (wifiInfo.SSID == SSIDContent) {
        //还是之前连接的wifi
        console.log('还是同一个wifi')
        if (this.data.pageStatus == 'show') {
          this.delay(1500).then((end) => {
            this.loopGetWifiInfo()
          })
        }
        return
      }
      this.getCurLinkWifiInfo()
    } catch (error) {
      console.log('[get connected wifi fail]', error)
      getApp().setMethodFailedCheckingLog(
        'wx.getConnectedWifi()',
        `调用微信接口wx.getConnectedWifi()异常。error=${JSON.stringify(error)}`
      )
      if (this.data.pageStatus == 'show') {
        this.delay(1500).then((end) => {
          this.loopGetWifiInfo()
        })
      }
    }
  },

  //刷新wifi列表
  refreshWifiList() {
    console.log('刷新wifi列表=====')
    // this.setData({
    //     wifiList: []
    // })
    // if (this.data.wifiList.length < 1) {
    //   this.data.isGetWifiList = true
    // }
    this.data.isGetWifiList = true
    this.getWifiList()
  },

  //获取wifi列表信息
  getWifisList() {
    let that = this
    // wx.getSystemInfo({
    //     success(res) {
    //         that.setData({
    //             platform: res.platform
    //         })
    //     }
    // })
    const res = wx.getSystemInfoSync()
    this.setData({
      platform: res.platform,
    })
    if (this.data.platform == 'android' || this.data.platform == 'harmony') {
      console.log('currentWiFiPwd=================:',this.data.currentWiFiPwd)
      that.wifiService.getWifiSortByFrequency(
        (wifiList) => {
          that.setData({
            wifiList: wifiList,
          })
          burialPoint.apLocalLog({
            log: {
              msg: '调用微信接口wx.getWifiList 成功',
              wifiList: wifiList,
            },
          })
          getApp().setMethodCheckingLog('wx.getWifiList()')
        },
        (error) => {
          console.log('获取wifi列表失败', error)
          burialPoint.apLocalLog({
            log: {
              msg: '调用微信接口wx.getWifiList 失败',
              error: error,
            },
          })
          getApp().setMethodFailedCheckingLog('wx.getWifiList()', `获取wifi列表异常。error=${JSON.stringify(error)}`)
        }
      )
    }
  },

  //获取wifi信息
  initWifi() {
    let that = this
    wx.getSystemInfo({
      success: (res) => {
        getApp().setMethodCheckingLog('wx.getSystemInfo()')
        let platform = res.res
        wx.startWifi({
          success(res) {
            console.log('初始化wifi成功')
            getApp().setMethodCheckingLog('wx.startWifi()')
            that.data.isInitWifiSuccess = true
            // that.nowNetType().then(networkType => {
            //     if (networkType != 'wifi') {
            //         this.setData({
            //             netType: 0
            //         })
            //         return
            //     } else {
            //         that.getCurLinkWifiInfo()
            //     }
            // })
            if (platform == 'ios') {
              //获取当前连接wifi信息 弹出确认窗口
              that.getCurLinkWifiInfo()
            } else {
              wx.getSetting({
                //安卓需要获取位置权限
                success(res) {
                  //地理位置
                  getApp().setMethodCheckingLog('wx.getSetting()')
                  // if (!res.authSetting['scope.userLocation']) {
                    // wx.authorize({
                    //   scope: 'scope.userLocation',
                    //   success(res) {
                    //     getApp().setMethodCheckingLog('wx.authorize()')
                    //     //获取当前连接wifi信息
                    //     console.log('授权定位成功')
                    //     that.getCurLinkWifiInfo()
                    //   },
                    //   fail(error) {
                    //     getApp().setMethodFailedCheckingLog(
                    //       'wx.authorize()',
                    //       `授权定位异常。error=${JSON.stringify(error)}`
                    //     )
                    //     Dialog.confirm({
                    //       title: '定位失败，您未开启定位权限，点击开启定位权限',
                    //       confirmButtonText: '我知道了',
                    //       confirmButtonColor: this.data.dialogStyle.confirmButtonColor2,
                    //       showCancelButton: false
                    //     }).then((res) => {
                    //       if (res.action == 'confirm') {
                    //         wx.openSetting({
                    //           success: function (res) {
                    //             if (res.authSetting['scope.userLocation']) {
                    //               console.log('获取当前连接wifi信息')
                    //               that.getCurLinkWifiInfo()
                    //             } else {
                    //               wx.showToast({
                    //                 title: '用户未开启地理位置权限',
                    //                 icon: 'none',
                    //                 duration: 3000,
                    //               })
                    //             }
                    //           },
                    //         })
                    //       }
                    //     })
                    //     // wx.showModal({
                    //     //   title: '提示',
                    //     //   content: '定位失败，您未开启定位权限，点击开启定位权限',
                    //     //   success: function (res) {
                    //     //     if (res.confirm) {
                    //     //       wx.openSetting({
                    //     //         success: function (res) {
                    //     //           if (res.authSetting['scope.userLocation']) {
                    //     //             console.log('获取当前连接wifi信息')
                    //     //             that.getCurLinkWifiInfo()
                    //     //           } else {
                    //     //             wx.showToast({
                    //     //               title: '用户未开启地理位置权限',
                    //     //               icon: 'none',
                    //     //               duration: 3000,
                    //     //             })
                    //     //           }
                    //     //         },
                    //     //       })
                    //     //     }
                    //     //   },
                    //     // })
                    //   },
                    // })
                  // } else {
                    //获取当前连接wifi信息
                    that.getCurLinkWifiInfo()
                  // }
                },
                fail(error) {
                  getApp().setMethodFailedCheckingLog(
                    'wx.getSetting()',
                    `获取定位权限异常。error=${JSON.stringify(error)}`
                  )
                },
              })
            }
          },
          fail(res) {
            wx.showToast({
              title: '初始化WiFi失败',
              icon: 'none',
              duration: 3000,
            })
            burialPoint.apLocalLog({
              log: {
                msg: '初始化wifi模块失败',
                error: res,
              },
            })
            getApp().setMethodFailedCheckingLog('wx.startWifi()', `初始化wifi模块异常。error=${JSON.stringify(res)}`)
          },
        })
        console.log('check platfform', platform)
      },
    })
  },
  switchPswShow() {
    getApp().setActionCheckingLog('switchPswShow', '切换密码的显示隐藏')
    let { isCanSeePsw, pswInputType } = this.data
    this.setData({
      isCanSeePsw: !isCanSeePsw,
      pswInputType: !pswInputType,
    })
  },
  // wifi输入框聚焦
  SSIDFocus() {
    this.data.focusWifiName = true
    this.showRouttingImg(false)
  },
  // wifi输入框失焦
  SSIDBlur() {
    this.data.focusWifiName = true
    this.showRouttingImg(true)
  },
  //密码输入框聚焦
  pswFocus() {
    this.data.focusWifiPwd = true
    this.showRouttingImg(false)
  },

  pswBlur() {
    this.data.focusWifiPwd = false
    this.showRouttingImg(true)
  },
  showRouttingImg(bool) {
    console.log('ddddddd')
    // 点击输入wifi名称和密码输入框，图片都要隐藏，如果是连着点击input框，就不显示图片，点击input框外的才显示图片。看了下，切换输入框的时候，1的失焦和2的聚焦中间时间为400+毫秒~500+毫秒，机型、缓存不一样，时间上也可能不一样，先设600毫秒
    showImgTime && clearTimeout(showImgTime)
    showImgTime = setTimeout(
      () => {
        this.setData({
          isShowRouttingImg: bool,
        })
      },
      bool ? 600 : 0
    )
    console.log('isShowRouttingImg:', this.data.isShowRouttingImg)
  },
  getPsw(e) {
    let psw = e.detail.value
    //判断输入的wifi密码是否包含空格，并显示对应的提示
    if (/\s+/g.test(psw)) {
      this.setData({
        spaceTip: '输入的密码包含空格，请确认是否输入准确',
      })
    } else {
      this.setData({
        spaceTip: ' ',
      })
    }
    //中文,中文符号,表情校验
    let reg = /^[0-9a-zA-Z{}#%*+=_|~<>€£¥·•.,?!'-/\:;()$&@"^\\[\]]+$/
    let deal = psw.replace(/\s/g, '').replaceAll('…', '...') //ios手机 连续输入三个...会转为…符号，将…装为...
    if (deal != '' && !reg.test(deal)) {
      let checkRes =
        /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[A9|AE]\u3030|\uA9|\uAE|\u3030/gi.test(
          psw
        )
      if (/[\u4e00-\u9fa5]/gi.test(psw)) {
        showToast('密码不支持输入汉字')
      } else if (checkRes) {
        showToast('密码不支持输入表情')
        this.setData({
          spaceTip: ' ',
        })
      } else {
        showToast('密码不支持中文符号，请切换到英文键盘输入')
      }
      this.setData({
        'bindWifiTest.PswContent': this.data.tempPsw,
        'bindWifiTest.PswLength': string2Uint8Array(this.data.tempPsw).length, //psw.length,
      })
    } else {
      if (psw.includes('…')) {
        psw = psw.replaceAll('…', '...')
      }
      this.setData({
        tempPsw: psw,
        'bindWifiTest.PswContent': psw,
        'bindWifiTest.PswLength': string2Uint8Array(psw).length, //psw.length,
      })
    }
    console.log('输入的WiFi密码', this.data.bindWifiTest)
    if (e.detail.value.length != this.data.bindWifiTest.PswContent.length) {
      return {
        value: this.data.bindWifiTest.PswContent,
        cursor: e.detail.cursor - (e.detail.value.length - this.data.bindWifiTest.PswContent.length),
      }
    } else {
      return {
        value: this.data.bindWifiTest.PswContent,
        cursor: e.detail.cursor,
      }
    }
  },
  //下一步
  async configNetWork() {
    let self = this
    if (this.data.clickNetFLag) {
      return
    }
    this.data.clickNetFLag = true
    await this.nowNetType()
    .then((networkType) => {
      if (networkType == 'none') {
        self.data.clickNetFLag = false
        showToast('网络不佳，请检查网络后重试')
      }
    })
    .catch((err) => {
      self.data.clickNetFLag = false
      showToast('网络不佳，请检查网络后重试')
    })
    getApp().setActionCheckingLog('configNetWork', '输入wifi页，点击下一步')
    console.log('bindWifiTest:', this.data.bindWifiTest)
    let { BSSID, PswContent, SSIDContent } = this.data.bindWifiTest
    // console.log('wifi:', SSIDContent)
    // console.log('BSSID:', BSSID)
    // console.log('PswContent:', PswContent)
    if (!SSIDContent) {
      showToast('请输入WiFi名称')
      getApp().setMethodFailedCheckingLog('configNetWork', 'wifi名称为空')
      self.data.clickNetFLag = false
      return
    }
    if (!PswContent) {
      let checkInputPswRes = await this.checkInputPsw()
      if (checkInputPswRes.action == 'cancel') {
        //输入密码
        getApp().setMethodFailedCheckingLog('configNetWork', '未输入密码并继续')
        self.data.clickNetFLag = false
        return
      }
    }
    if (PswContent && PswContent.length < 8) {
      showToast('密码长度不足8位')
      getApp().setMethodFailedCheckingLog('check psw length', '密码长度不足8位')
      self.data.clickNetFLag = false
      return
    }
    //检查位置和蓝牙权限以及是否打开
    // if (!(await this.checkLocationAndBluetooth(true, false, true, isCheckBluetooth, app.addDeviceInfo))) {
    //   self.data.clickNetFLag = false
    //   return
    // }

    // this.locationAuthorize()
    // let locationRes = await checkPermission.loaction()
    // console.log('[loactionRes]', locationRes)
    // if (!locationRes.isCanLocation) {
    //   // this.setDialogMixinsData(true, '请开启位置权限', locationRes.permissionTextAll, false, [
    //   //   {
    //   //     btnText: '好的',
    //   //     flag: 'confirm',
    //   //   },
    //   //   {
    //   //     btnText: '查看指引',
    //   //     flag: 'lookGuide',
    //   //     type: 'location',
    //   //     permissionTypeList: locationRes.permissionTypeList,
    //   //   },
    //   // ])
    //   // getApp().setMethodFailedCheckingLog('checkPermission', '未开位置权限')
    //   // self.data.clickNetFLag = false
    //   // return

    //   const obj = {
    //     title: '请开启位置权限',
    //     message: locationRes.permissionTextAll,
    //     confirmButtonText: '查看指引',
    //     type: 'location',
    //     permissionTypeList: locationRes.permissionTypeList,
    //     confirmButtonColor: this.data.dialogStyle.confirmButtonColor2,
    //     cancelButtonColor: this.data.dialogStyle.cancelButtonColor3,
    //   }
    //   //调用通用弹框组件
    //   commonDialog.showCommonDialog(obj)
    //   self.data.clickNetFLag = false
    //   setTimeout(() => {
    //     this.data.actionScanClickFlag = false
    //   }, 1500)
    //   return
    // }
    setWifiStorage(this.data.bindWifiTest)
    app.addDeviceInfo.curWifiInfo = this.data.bindWifiTest //共享选取的wifi
    getApp().setMethodCheckingLog('保存wifi信息', `curWifiInfo=${JSON.stringify(app.addDeviceInfo.curWifiInfo)}`)
    app.addDeviceInfo.continueConnectWifi = this.data.continueConnectWifi // 保存是否手动输入的状态->失败页linkNetFail需要用到
    console.error('wifi登记页addDeviceInfo====', app.addDeviceInfo)
    const {
      adData,
      moduleType,
      deviceName,
      type,
      sn8,
      deviceId,
      blueVersion,
      mode,
      fm,
      enterprise,
      ssid,
      sn,
      referenceRSSI,
      isCheck,
    } = app.addDeviceInfo
    burialPoint.clickNext({
      deviceSessionId: app.globalData.deviceSessionId,
      ssid: this.data.bindWifiTest.SSIDContent,
      frequency: this.data.bindWifiTest.frequency,
      rssi: this.data.bindWifiTest.signalStrength,
      moduleType,
      type,
      sn8,
      sn,
      moduleVison: blueVersion,
      linkType: app.addDeviceInfo.linkType,
      widgetName: '下一步',
      widgetId: mode == 'WB01_bluetooth_connection_network' ? 'click_connect_device' : 'click_next',
    })
    // wx.navigateTo({
    //     url: paths.linkNetFail,
    // })
    // return
    this.searchBlueStopTimeout && clearTimeout(this.searchBlueStopTimeout)
    wx.offBluetoothDeviceFound()
    wx.stopBluetoothDevicesDiscovery()

    this.data.fm = fm || 'autoFound'
    if (mode == 0 && fm == 'autoFound') {
      //自发现ap
      if (this.isCanDrivingLinkDeviceAp(ssid)) {
        // app.addDeviceInfo.isCanDrivingLinkDeviceAp = true
        // wx.navigateTo({
        //     url: paths.linkDevice,
        // })
        wx.navigateTo({
          url: paths.linkAp, //手动连接ap页
          fail(error) {
            getApp().setMethodFailedCheckingLog('wx.navigateTo()', `下一步跳转异常。error=${JSON.stringify(error)}`)
          },
          complete() {
            self.data.clickNetFLag = false
          },
        })
      } else {
        wx.navigateTo({
          url: paths.linkAp, //手动连接ap页
          fail(error) {
            getApp().setMethodFailedCheckingLog('wx.navigateTo()', `下一步跳转异常。error=${JSON.stringify(error)}`)
          },
          complete() {
            self.data.clickNetFLag = false
          },
        })
      }
      return
    }
    let pass = false
    let _this = this
    if (mode == 0 && (this.data.platform == 'android' || this.data.platform == 'harmony') && fm != 'scanCode') {
      //如果是Android客户端，ap配网，设备已发出WiFi信号则跳过配网指引页
      async function passFunc() {
        let brandName = _this.getBrandBname(enterprise)
        console.log('跳过配网指引', `${brandName}_${type.toLocaleLowerCase()}`)
        console.log('跳过配网指引', _this.data.wifiList)
        let result = await _this.data.wifiList.find((item) => {
          return item.SSID.includes(`${brandName}_${type.toLocaleLowerCase()}`)
        })
        console.log('跳过配网指引', result)
        let page = getFullPageUrl()
        if (result && page.includes('addDevice/pages/inputWifiInfo/inputWifiInfo')) {
          pass = true
          if (!deviceName) {
            app.addDeviceInfo.deviceName = deviceImgMap[type].title
          }
          // app.addDeviceInfo.isCanDrivingLinkDeviceAp = true
          wx.navigateTo({
            url: paths.linkAp,
            fail(error) {
              getApp().setMethodFailedCheckingLog('wx.navigateTo()', `下一步跳转异常。error=${JSON.stringify(error)}`)
            },
            complete() {
              self.data.clickNetFLag = false
            },
          })
          burialPoint.apLocalLog({
            log: {
              msg: '已起设备ap 跳过配网指引',
            },
          })
          return
        }
      }
      if (this.data.wifiList.length != 0) {
        await passFunc()
      } else {
        _this.wifiService.getWifiSortByFrequency(
          (wifiList) => {
            _this.setData({
              wifiList: wifiList,
            })
            passFunc()
          },
          (error) => {
            console.log('获取wifi列表失败', error)
            self.data.clickNetFLag = false
            getApp().setMethodFailedCheckingLog('wx.getWifiList()', `获取wifi列表异常。error=${JSON.stringify(error)}`)
          }
        )
      }
    }
    if (pass) {
      self.data.clickNetFLag = false
      return
    }
    if (mode == 'air_conditioning_bluetooth_connection' || mode == 'air_conditioning_bluetooth_connection_network') {
      //做了直连
      app.addDeviceInfo.mode = 'air_conditioning_bluetooth_connection_network' //去配网
      wx.navigateTo({
        url: paths.linkDevice,
        complete() {
          self.data.clickNetFLag = false
        },
      })
      console.log('change mode---------', app.addDeviceInfo.mode)
      return
    }
    if (mode == 'WB01_bluetooth_connection_network') {
      //masmart做了直连 去配网
      wx.navigateTo({
        url: paths.linkDevice,
        fail(error) {
          getApp().setMethodFailedCheckingLog('wx.navigateTo()', `下一步跳转异常。error=${JSON.stringify(error)}`)
        },
        complete() {
          self.data.clickNetFLag = false
        },
      })
      return
    }
    if ((mode == 5 && fm == 'autoFound' && blueVersion != 1) || (mode == 3 && fm == 'bluePugin')) {
      wx.navigateTo({
        url: paths.linkDevice,
        fail(error) {
          getApp().setMethodFailedCheckingLog('wx.navigateTo()', `下一步跳转异常。error=${JSON.stringify(error)}`)
        },
        complete() {
          self.data.clickNetFLag = false
        },
      })
      return
    }
    if (mode == 3) {
      if (fm != 'autoFound' && !this.ifFindMatchedBlueDevice) {
        // 非自发现未匹配到设备蓝牙，跳转配网指引页
        wx.navigateTo({
          url: paths.addGuide,
          fail(error) {
            getApp().setMethodFailedCheckingLog('wx.navigateTo()', `下一步跳转异常。error=${JSON.stringify(error)}`)
          },
          complete() {
            self.data.clickNetFLag = false
          },
        })
        return
      }
      if (isCheck) {
        // 设备已确权，跳转联网进度页
        wx.navigateTo({
          url: paths.linkDevice,
          fail(error) {
            getApp().setMethodFailedCheckingLog('wx.navigateTo()', `下一步跳转异常。error=${JSON.stringify(error)}`)
          },
          complete() {
            self.data.clickNetFLag = false
          },
        })
        return
      }
      if (blueVersion == 1) {
        // 一代蓝牙，跳转配网指引页
        wx.navigateTo({
          url: paths.addGuide,
          fail(error) {
            getApp().setMethodFailedCheckingLog('wx.navigateTo()', `下一步跳转异常。error=${JSON.stringify(error)}`)
          },
          complete() {
            self.data.clickNetFLag = false
          },
        })
        return
      }
      if (this.ifNearbyChecked) {
        // 靠近确权成功，跳转联网进度页
        wx.navigateTo({
          url: paths.linkDevice,
          fail(error) {
            getApp().setMethodFailedCheckingLog('wx.navigateTo()', `下一步跳转异常。error=${JSON.stringify(error)}`)
          },
          complete() {
            self.data.clickNetFLag = false
          },
        })
        return
      } else {
        // 靠近确权失败，跳转靠近确权
        app.addDeviceInfo.ifNearby = true
        wx.navigateTo({
          url: paths.addGuide,
          fail(error) {
            getApp().setMethodFailedCheckingLog('wx.navigateTo()', `下一步跳转异常。error=${JSON.stringify(error)}`)
          },
          complete() {
            self.data.clickNetFLag = false
          },
        })
        return
      }
    }

    wx.navigateTo({
      url: paths.addGuide,
      fail(error) {
        getApp().setMethodFailedCheckingLog('wx.navigateTo()', `下一步跳转异常。error=${JSON.stringify(error)}`)
      },
      complete() {
        self.data.clickNetFLag = false
      },
    })
    this.data.isSwitchWifi = false //不切换
  },
  //确认输入wifi密码弹窗
  checkInputPsw() {
    return new Promise((resolve, reject) => {
      Dialog.confirm({
        title: '家庭WiFi密码为空',
        message: '请确认当前家庭WiFi为无密码WiFi，密码错误会造成配网失败噢',
        confirmButtonText: '继续',
        cancelButtonText: '输入密码',
        // confirmButtonColor:'#0078FF',
        cancelButtonColor: this.data.dialogStyle.cancelButtonColor4,
        confirmButtonColor: this.data.dialogStyle.confirmButtonColor3,
      })
        .then((res) => {
          if (res.action == 'confirm') {
            resolve(res)
          }
        })
        .catch((error) => {
          console.log('hahahahhaha:', error)
          resolve(error)
        })

      // wx.showModal({
      //   title: '家庭WiFi密码为空',
      //   content: '请确认当前家庭WiFi为无密码WiFi，密码错误会造成配网失败噢',
      //   cancelText: '输入密码',
      //   confirmText: '继续',
      //   cancelColor: '#458BFF',
      //   confirmColor: '#458BFF',
      //   success(res) {
      //     resolve(res)
      //   },
      //   fail(error) {
      //     reject(error)
      //   },
      // })
    })
  },
  hideWifiList() {
    this.setData({
      wifiListShow: false,
    })
  },
  onWifiList() {
    wx.onGetWifiList((result) => {
      console.log('当前的wifi列表', result)
      this.setData({
        wifiList: result.wifiList,
      })
    })
  },
  chooseWifi(e) {
    var item = e.currentTarget.dataset.item
    this.initBindWifiTest(item.BSSID, item.SSID, item.SSID.length, '01', '12', item.signalStrength, item.frequency)
    // console.log(e);
    console.log(item)
    this.hideWifiList()
  },
  initBindWifiTest(BSSID, SSIDContent, SSIDLength, EncryptType, chain, signalStrength, frequency) {
    SSIDLength = string2Uint8Array(SSIDContent).length
    this.setData({
      'bindWifiTest.BSSID': BSSID,
      'bindWifiTest.SSIDContent': SSIDContent,
      'bindWifiTest.SSIDLength': SSIDLength,
      'bindWifiTest.EncryptType': EncryptType,
      'bindWifiTest.chain': chain,
      'bindWifiTest.signalStrength': signalStrength, //Wi-Fi 信号强度, 安卓取值 0 ～ 100 ，iOS 取值 0 ～ 1 ，值越大强度越大
      'bindWifiTest.frequency': frequency, //Wi-Fi 频段单位 MHz
    })
    let { moduleType, deviceName, type, sn8, deviceId, blueVersion } = app.addDeviceInfo
    // burialPoint.wifiInfo({
    //     ssid: BSSID,
    //     chain: chain,
    //     deviceSessionId: app.globalData.deviceSessionId,
    //     moduleType,
    //     type,
    //     sn8,
    //     moduleVison: blueVersion,
    //     linkType: app.addDeviceInfo.linkType
    // })
    console.log('上报了wifi ssid and chain', BSSID, chain)
  },
  showToast(text) {
    wx.showToast({
      title: text,
      icon: 'none',
    })
  },
  reconnect() {
    this.setData({
      connectStatus: 0,
      countDown: 30,
      isReady: 0,
    })
    clearInterval(interval)
  },
  connectFailReset() {
    this.setData({
      connectStatus: 3, // 设定连接失败标志位,
      countDown: 30,
      isReady: 0,
    })
  },

  async checkNet() {
    // this.setData({
    //   netType: 1, //wifi
    // })
    // return
    console.log('checkNet addDeviceInfo', app.addDeviceInfo)
    try {
      let wifiInfo = await this.wifiService.getConnectedWifi()
      if (this.data.continueConnectWifi) {
        this.setData({
          continueConnectWifi: false,
        })
      }
      burialPoint.apLocalLog({
        log: {
          msg: '调用微信接口wx.getConnectedWifi 成功',
          wifiInfo: wifiInfo,
        },
      })
      getApp().setMethodCheckingLog('wx.getConnectedWifi()')
      this.setData({
        netType: 1, //wifi
      })
      if (this.data.ishowDialog || this.data.ishowManualInputWiFi) {
        this.setData({
          ishowDialog: false,
          ishowManualInputWiFi: false,
        })
      }
      this.getCurLinkWifiInfo()
    } catch (error) {
      if (this.data.continueConnectWifi) {
        return
      }
      console.log('非wifi状态', error)
      log.info('当前手机非wifi状态')
      burialPoint.apLocalLog({
        log: {
          msg: '调用微信接口wx.getConnectedWifi 失败',
          error: error,
        },
      })
      getApp().setMethodFailedCheckingLog(
        'wx.getConnectedWifi()',
        `调用微信接口wx.getConnectedWifi()异常。error=${JSON.stringify(error)}`
      )
      this.setData({
        netType: 0, //非wifi
      })
      if (this.data.netType == 0 && this.data.isLoad) {
        //只触发一次
        this.data.isLoad = false
        burialPoint.inputWifiView({
          deviceSessionId: app.globalData.deviceSessionId,
          moduleType: app.addDeviceInfo.moduleType,
          type: app.addDeviceInfo.type,
          sn8: app.addDeviceInfo.sn8,
          moduleVison: app.addDeviceInfo.moduleVersion,
          linkType: app.addDeviceInfo.linkType,
        })
      }
      if (this.data.pageStatus == 'show') {
        this.delay(1500).then((end) => {
          this.checkNet()
        })
      }
    }
  },
  //当前手机网络状态
  nowNetType() {
    return new Promise((resolve, reject) => {
      wx.getNetworkType({
        success(res) {
          console.log('当前网络状况', res)
          log.info('当前网络状况', res)
          resolve(res.networkType)
        },
        fail(error) {
          console.log('获取当前网络状况错误', error)
          reject(error)
        },
      })
    })
  },
  delay(milSec) {
    return new Promise((resolve) => {
      setTimeout(resolve, milSec)
    })
  },
  skip() {
    getApp().setActionCheckingLog('configNetWork', '输入wifi页，点击跳过')
    let { mode, moduleType, type, sn8, blueVersion, sn, cloudBackDeviceInfo, linkType } = app.addDeviceInfo
    wx.closeBLEConnection({
      deviceId: app.addDeviceInfo.deviceId,
    })
    let type0x = type.includes('0x') ? type : '0x' + type
    let deviceInfo = encodeURIComponent(JSON.stringify(cloudBackDeviceInfo))
    wx.reLaunch({
      // url: `/plugin/T${type0x}/index/index?backTo=/pages/index/index&deviceInfo=${deviceInfo}`,
      url: getPluginUrl(type0x) + `?backTo=/pages/index/index&deviceInfo=${deviceInfo}`,
    })
    burialPoint.clickSkipToBlueControl({
      deviceSessionId: app.globalData.deviceSessionId,
      moduleType,
      type,
      sn8,
      linkType,
      sn: sn || '',
      pageId: this.data.netType ? 'page_WiFi_edit' : 'page_connect_WiFi_notice',
      pageName: this.data.netType ? '输入家庭WiFi密码页' : '请将手机连接上WiFi页',
    })
  },

  //msmart 直连取消后配网
  blueCancelLinkWifi() {
    let { type, deviceName, cloudBackDeviceInfo } = app.addDeviceInfo
    this.setData({
      titleContent: `要放弃为${deviceName}配网吗`,
      messageContent: `请在等一等，${deviceName}正在努力连接中`,
      blueCancelLinkModal: true,
    })
    // wx.showModal({
    //   title: `要放弃为${deviceName}配网吗`,
    //   content: `请在等一等，${deviceName}正在努力连接中`,
    //   cancelText: '放弃',
    //   confirmText: '再等等',
    //   cancelColor: '#458BFF',
    //   confirmColor: '#458BFF',
    //   success(res) {
    //     if (res.cancel) {
    //       //放弃
    //       wx.closeBLEConnection({
    //         deviceId: app.addDeviceInfo.deviceId,
    //       })
    //       let type0x = type.includes('0x') ? type : '0x' + type
    //       let deviceInfo = encodeURIComponent(JSON.stringify(cloudBackDeviceInfo))
    //       wx.reLaunch({
    //         url: `/plugin/T${type0x}/index/index?backTo=/pages/index/index&deviceInfo=${deviceInfo}`,
    //       })
    //     }
    //   },
    // })
  },
  giveUpBlueCancelLink() {
    let { type, deviceName, cloudBackDeviceInfo } = app.addDeviceInfo
    wx.closeBLEConnection({
      deviceId: app.addDeviceInfo.deviceId,
    })
    let type0x = type.includes('0x') ? type : '0x' + type
    let deviceInfo = encodeURIComponent(JSON.stringify(cloudBackDeviceInfo))
    wx.reLaunch({
      // url: `/plugin/T${type0x}/index/index?backTo=/pages/index/index&deviceInfo=${deviceInfo}`,
      url: getPluginUrl(type0x) + `?backTo=/pages/index/index&deviceInfo=${deviceInfo}`,
    })
  },
  //移除wifi缓存
  removeWifiStorage() {
    wx.removeStorageSync('bindWifiInfo')
    this.setData({
      bindWifiTest: {},
    })
  },
  makeSure(e) {
    this.locationAndBluetoothClickTrack(e.detail.flag, app.addDeviceInfo) //位置和蓝牙弹窗提示点击埋点
    e = e.detail
    console.log('kkkkkkkkk', e)
    if (e.flag == 'lookGuide') {
      if (e.type == 'location') {
        wx.navigateTo({
          url: paths.locationGuide + `?permissionTypeList=${JSON.stringify(e.permissionTypeList)}`,
        })
      }
      if (e.type == 'blue') {
        wx.navigateTo({
          url: paths.blueGuide + `?permissionTypeList=${JSON.stringify(e.permissionTypeList)}`,
        })
      }
    }
  },
  //未开定位权限提示
  async noLoactionTip() {
    try {
      let locationRes = await checkPermission.loaction()
      console.log('[loactionRes]', locationRes)
      if (!locationRes.isCanLocation) {
        this.data.permissionTypeList = locationRes.permissionTypeList //暂存
        if (this.data.guideStep.length >= 2) {
          this.data.guideStep[0] = {
            type: 'location',
            title: '允许程序使用位置信息',
            desc: locationRes.permissionTextList,
          }
          this.setData({
            guideStep: this.data.guideStep,
          })
        } else {
          this.data.guideStep.unshift({
            type: 'location',
            title: '允许程序使用位置信息',
            desc: locationRes.permissionTextList,
          })
          this.setData({
            guideStep: this.data.guideStep,
          })
        }
      } else {
        if (this.data.guideStep.length > 1) {
          this.data.guideStep.shift()
          this.setData({
            guideStep: this.data.guideStep,
          })
        }
      }
    } catch (error) {
      console.log('[no location tip error]', error)
    }
  },
  //查看权限指引
  lookGuide() {
    wx.navigateTo({
      url: paths.locationGuide + `?permissionTypeList=${JSON.stringify(this.data.permissionTypeList)}`,
    })
  },
  /**
   * 获取蓝牙配网指引
   */
  async getBlueGuide(device) {
    const { fm, hadChangeBlue, mode } = app.addDeviceInfo
    if (mode == 0 && fm != 'autoFound' && !hadChangeBlue) {
      // AP配网非自发现入口
      // 不判断蓝牙配网指引，均转换为蓝牙配网
      app.addDeviceInfo.adData = device.adData
      app.addDeviceInfo.blueVersion = this.getBluetoothType(device.adData)
      app.addDeviceInfo.deviceId = device.deviceId
      app.addDeviceInfo.mac = this.getIosMac(device.adData)
      if (!app.addDeviceInfo.referenceRSSI) {
        app.addDeviceInfo.referenceRSSI = this.getReferenceRSSI(device.adData)
      }
      app.addDeviceInfo.sn8 = this.getBlueSn8(device.adData)
      app.addDeviceInfo.ssid = this.getBluetoothSSID(
        device.adData,
        app.addDeviceInfo.blueVersion,
        device.type,
        device.localName
      )
      app.addDeviceInfo.mode = 3
      app.addDeviceInfo.linkType = addDeviceSDK.getLinkType(3)
      app.addDeviceInfo.hadChangeBlue = true
      console.log(
        '@module inputWifiInfo.js\n@method getBlueGuide\n@desc 转换为蓝牙配网，更新设备信息\n',
        app.addDeviceInfo
      )
      // 埋点
      burialPoint.autoChangeBlue({
        deviceSessionId: app.globalData.deviceSessionId,
        blueVersion: app.addDeviceInfo.blueVersion,
        deviceId: app.addDeviceInfo.deviceId,
        linkType: app.addDeviceInfo.linkType,
        sn: app.addDeviceInfo.sn,
        sn8: app.addDeviceInfo.sn8,
        type: app.addDeviceInfo.type,
      })
      this.handleCheckFlow()
    }
    if (mode == 3) {
      // 蓝牙配网
      app.addDeviceInfo.adData = device.adData
      app.addDeviceInfo.blueVersion = this.getBluetoothType(device.adData)
      app.addDeviceInfo.deviceId = device.deviceId
      app.addDeviceInfo.mac = this.getIosMac(device.adData)
      if (!app.addDeviceInfo.referenceRSSI) {
        app.addDeviceInfo.referenceRSSI = this.getReferenceRSSI(device.adData)
      }
      app.addDeviceInfo.sn8 = this.getBlueSn8(device.adData)
      app.addDeviceInfo.ssid = this.getBluetoothSSID(
        device.adData,
        app.addDeviceInfo.blueVersion,
        device.type,
        device.localName
      )
      console.log('@module inputWifiInfo.js\n@method getBlueGuide\n@desc 更新设备信息\n', app.addDeviceInfo)
      this.handleCheckFlow()
    }
  },
  /**
   * 处理确权流程
   */
  async handleCheckFlow() {
    const { adData, mode } = app.addDeviceInfo
    if (mode != 3) return
    const packInfo = getScanRespPackInfo(adData)
    console.log('@module inputWifiInfo.js\n@method handleCheckFlow\n@desc 蓝牙功能状态\n', packInfo)
    console.info("----是否支持扩展字段---" + packInfo.isFeature)
    app.addDeviceInfo.isFeature = packInfo.isFeature
    if (packInfo.isWifiCheck || packInfo.isBleCheck || packInfo.isCanSet) {
      // 设备已确权
      app.addDeviceInfo.isCheck = true
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () { },

  /**
   * 生命周期函数--监听页面显示
   */
  async onShow() {
    console.log('onshow==========')
    if(app.globalData.getQRcodePwInfo && Object.keys(app.globalData.getQRcodePwInfo).length>0){
        this.setData({
          currentWiFiPwd: app.globalData.getQRcodePwInfo.currentWiFiPwd,
          currentWiFiName:app.globalData.getQRcodePwInfo.currentWiFiName
        })
        showToast('已识别WiFi密码')
        app.globalData.getQRcodePwInfo = ''
    }
    let { mode, isCheckGray } = app.addDeviceInfo
    this.data.clickNetFLag = false //解决防重标志位没有被清除的问题
    console.log('isCheckGray:' + isCheckGray)
    //如果是从落地页面过来的，则不需要检查灰度
    console.log('============Yoram test==========')
    console.log(
      'from_download_page:' + app.globalData.from_download_page + ' isCanAddDevice:' + this.data.isCanAddDevice
    )
    let from_download_page = false
    //获取添加设备灰度名单判断是否是灰度用户
    try {
      let isCan = await addDeviceSDK.isGrayUser(isCheckGray)
      //如果是从落地页面过来的，则不需要检查灰度
      from_download_page = app.globalData.from_download_page
      if (from_download_page) {
        this.setData({
          isCanAddDevice: true,
        })
      } else if (!isCan && mode != 'air_conditioning_bluetooth_connection_network') {
        console.log('屏蔽了配网入口')
        this.setData({
          isCanAddDevice: isCan,
        })
        return
      }
    } catch (error) {
      console.log('[isGrayUser error]', error)
    }
    this.checkNet()
    this.data.pageStatus = 'show'
    //如果是蓝牙配网则判断蓝牙是否授权
    if (addDeviceSDK.bluetoothAuthModes.includes(app.addDeviceInfo.mode)) {
      this.bluetoothAuthorize()
    }
    this.noLoactionTip()
    if (this.data.netType == 1) {
      //wifi 状态
      burialPoint.editWifiPageStatus({
        pageStatus: 'show',
        deviceSessionId: app.globalData.deviceSessionId,
      })
    }

    if (this.data.netType == 0) {
      //wifi 状态
      burialPoint.noticeWifiPageStatus({
        pageStatus: 'show',
        deviceSessionId: app.globalData.deviceSessionId,
      })
    }
    app.globalData.isCanClearFound = true //配网流程返回首页或设备发现页清除ap蓝牙自发现已发现的设备信息
    let phoneBrandType = systemInfo.brand
    phoneBrandType = phoneBrandType.toLocaleLowerCase()
    if(phoneBrandType == 'vivo'|| phoneBrandType == 'iqoo'|| phoneBrandType == 'xiaomi'||phoneBrandType == 'redmi'||phoneBrandType == 'huawei'||phoneBrandType == 'honor'||phoneBrandType == 'oppo'||phoneBrandType == 'realme'||phoneBrandType == 'samsung'){
      this.setData({
        isShowCode:true
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.data.pageStatus = 'hide'
    clearInterval(interval)
    if (this.data.netType == 1) {
      //wifi 状态
      burialPoint.editWifiPageStatus({
        pageStatus: 'hide',
        deviceSessionId: app.globalData.deviceSessionId,
      })
    }

    if (this.data.netType == 0) {
      //wifi 状态
      burialPoint.noticeWifiPageStatus({
        pageStatus: 'hide',
        deviceSessionId: app.globalData.deviceSessionId,
      })
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    getApp().onUnloadCheckingLog()
    this.data.pageStatus = 'unload'
    //重全局变量
    app.globalData.from_download_page = false
    clearInterval(interval)
    wx.offBluetoothDeviceFound()
    wx.stopBluetoothDevicesDiscovery()
    console.log('监听页面卸载')
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

  //去连接wifi 提示弹窗
  connectWifi() {
    let self = this
    // 判断是否有精准定位，安卓 系统》=12
    console.log('系统start========================')
    console.log(systemInfo.brand)
    console.log('系统end========================')
    let { system, version, brand } = systemInfo
    let systemType = system.split(' ')[0]
    let systemVersion = system.split(' ')[1]
    let systemGrade = this.systemGrade()
    // console.log(systemInfo)
    burialPoint.connectedWifi({
      deviceSessionId: app.globalData.deviceSessionId,
      blueVersion: app.addDeviceInfo.blueVersion,
      deviceId: app.addDeviceInfo.deviceId,
      linkType: app.addDeviceInfo.linkType,
      sn: app.addDeviceInfo.sn,
      sn8: app.addDeviceInfo.sn8,
      type: app.addDeviceInfo.type,
    })
    // console.log(systemType)
    // console.log(systemGrade)
    // console.log(this.toNum(version) >= this.toNum('8.2.0'))
    // 如果是IOS  或者  微信系统>= 8.2.0  或者  安卓系统没有精准定位功能
    if (systemType == 'IOS' || this.toNum(version) >= this.toNum('8.2.0') || !systemGrade) {
      burialPoint.showManualInputWiFi({
        deviceSessionId: app.globalData.deviceSessionId,
        blueVersion: app.addDeviceInfo.blueVersion,
        deviceId: app.addDeviceInfo.deviceId,
        linkType: app.addDeviceInfo.linkType,
        sn: app.addDeviceInfo.sn,
        sn8: app.addDeviceInfo.sn8,
        type: app.addDeviceInfo.type,
      })
      this.setData({
        ishowManualInputWiFi: true,
        messageContent: '无法获取所连接的WiFi，可手动输入家庭WiFi名称与密码',
      })
    } else {
      // 安卓系统有精准定位
      brand = brand.toLowerCase()
      if (brand == 'xiaomi' || brand == 'redmi') {
        //是否符合品牌
        this.setData({
          ishowDialog: true,
          modalText: '请关闭手机系统中微信的"模糊定位"开关',
          otherAndroidSystem: false, //是小米系的安卓系统
        })
        burialPoint.showPreciseLocation({
          deviceSessionId: app.globalData.deviceSessionId,
          blueVersion: app.addDeviceInfo.blueVersion,
          deviceId: app.addDeviceInfo.deviceId,
          linkType: app.addDeviceInfo.linkType,
          sn: app.addDeviceInfo.sn,
          sn8: app.addDeviceInfo.sn8,
          type: app.addDeviceInfo.type,
        })
      } else if (brand == 'vivo' || brand == 'huawei' || brand == 'honor' || brand == 'oppo' || brand == 'motorola') {
        this.setData({
          ishowDialog: true,
          modalText: '请开启手机系统中微信的"精确位置"开关',
          otherAndroidSystem: true, //非小米系的安卓系统
        })
        burialPoint.showPreciseLocation({
          deviceSessionId: app.globalData.deviceSessionId,
          blueVersion: app.addDeviceInfo.blueVersion,
          deviceId: app.addDeviceInfo.deviceId,
          linkType: app.addDeviceInfo.linkType,
          sn: app.addDeviceInfo.sn,
          sn8: app.addDeviceInfo.sn8,
          type: app.addDeviceInfo.type,
        })
      } else {
        // 除去小米，红米，vivo,华为，荣耀，oppo,摩托罗拉的其他品牌
        burialPoint.showManualInputWiFi({
          deviceSessionId: app.globalData.deviceSessionId,
          blueVersion: app.addDeviceInfo.blueVersion,
          deviceId: app.addDeviceInfo.deviceId,
          linkType: app.addDeviceInfo.linkType,
          sn: app.addDeviceInfo.sn,
          sn8: app.addDeviceInfo.sn8,
          type: app.addDeviceInfo.type,
        })

        this.setData({
          ishowManualInputWiFi: true,
          messageContent:
            '请检查手机系统中对于微信的位置授权，是否具备”精准位置/确切位置“项，若具备，请开启该权限后重试；若不具备，请尝试手动输入WiFi名称与密码',
        })
      }
    }
  },

  toNum(num) {
    var num = num.toString()
    var version = num.split('.')
    var num_place = ['', '0', '00', '000', '0000'],
      r = num_place.reverse()
    for (var i = 0; i < version.length; i++) {
      var len = version[i].length
      version[i] = r[len] + version[i]
    }
    var res = version.join('')
    return res
  },

  //判断是否有精准定位，安卓 系统》=12
  systemGrade() {
    let result = false //true 有精准定位
    let { system, brand } = systemInfo
    brand = brand.toLowerCase()
    let systemNum = system.split(' ')[1]
    let phoneSystem = system.split(' ')[0]
    // console.log(this.toNum('10.0.1'))
    if (phoneSystem == 'iOS') {
      result = false
    } else {
      if (this.toNum(systemNum) >= this.toNum('12')) {
        result = true
      }
    }
    return result
  },

  //跳转系统微信设置页
  clickSetting(e) {
    wx.openAppAuthorizeSetting({
      //ios和安卓都是打开系统微信设置页，效果一样
      success(res) {
        burialPoint.clickSetting({
          deviceSessionId: app.globalData.deviceSessionId,
          blueVersion: app.addDeviceInfo.blueVersion,
          deviceId: app.addDeviceInfo.deviceId,
          linkType: app.addDeviceInfo.linkType,
          sn: app.addDeviceInfo.sn,
          sn8: app.addDeviceInfo.sn8,
          type: app.addDeviceInfo.type,
        })
        console.log('测试返回', res)
      },
    })
  },
  //点击查看操作指引
  toOperate() {
    burialPoint.clickToOperate({
      deviceSessionId: app.globalData.deviceSessionId,
      blueVersion: app.addDeviceInfo.blueVersion,
      deviceId: app.addDeviceInfo.deviceId,
      linkType: app.addDeviceInfo.linkType,
      sn: app.addDeviceInfo.sn,
      sn8: app.addDeviceInfo.sn8,
      type: app.addDeviceInfo.type,
    })
    //根据不同类型跳转不同的页面
    console.log(this.data.otherAndroidSystem)
    this.setData({
      ishowDialog: false,
    })
    wx.navigateTo({
      url: paths.locationGuide + `?route=operatingInstructions&otherAndroidSystem=${this.data.otherAndroidSystem}`,
    })
  },
  onClickOverlay() {
    this.setData({
      ishowDialog: false,
    })
  },

  clickManualInputWiFiBtn() {
    // 切换wifi登记页
    this.setData({
      continueConnectWifi: true,
      netType: 1, //非wifi
    })
    burialPoint.clickManualInputWiFiButton({
      deviceSessionId: app.globalData.deviceSessionId,
      blueVersion: app.addDeviceInfo.blueVersion,
      deviceId: app.addDeviceInfo.deviceId,
      linkType: app.addDeviceInfo.linkType,
      sn: app.addDeviceInfo.sn,
      sn8: app.addDeviceInfo.sn8,
      type: app.addDeviceInfo.type,
    })
    burialPoint.showManualInputWiFiPage({
      deviceSessionId: app.globalData.deviceSessionId,
      blueVersion: app.addDeviceInfo.blueVersion,
      deviceId: app.addDeviceInfo.deviceId,
      linkType: app.addDeviceInfo.linkType,
      sn: app.addDeviceInfo.sn,
      sn8: app.addDeviceInfo.sn8,
      type: app.addDeviceInfo.type,
    })
  },
  closeManualInputWiFiDialog() {
    this.setData({
      ishowManualInputWiFi: false,
    })
  },
  //手动输入wifi名
  inputSSIDContent(e) {
    // console.log(e)
    let SSIDContent = e.detail.value
    this.setData({
      'bindWifiTest.SSIDContent': SSIDContent,
    })
    let BSSID = '00:00:00:00:00:00'
    let that = this
    let storageWifiListV1 = wx.getStorageSync('storageWifiListV1')
    console.log('storageWifiListV1:', storageWifiListV1)
    console.log('currentWiFiPwd:', this.data.currentWiFiPwd)
    if (storageWifiListV1 && storageWifiListV1[environment].length && decodeWifi(storageWifiListV1[environment])) {
      console.log('有对应环境的缓存wifi信息')
      log.info('有对应环境的wifi缓存')
      let storageWifiList = decodeWifi(wx.getStorageSync('storageWifiListV1')[environment])

      let isHasPsw = false
      let wifiNum = null
      storageWifiList.forEach((item, index) => {
        if (item.SSIDContent == SSIDContent) {
          console.log('手动输入有这个wifi的storage')
          isHasPsw = true
          wifiNum = index
        }
      })
      if (isHasPsw) {
        //有这个wifi的storage
        that.setData({
          bindWifiTest: storageWifiList[wifiNum],
        })
      } else {
        that.setData({
          'bindWifiTest.PswContent': '', //移除密码
        })

        //赋值wifi显示
        that.initBindWifiTest(BSSID, SSIDContent, SSIDContent, '01', '12', '', '')
      }
    } else {
      //没有wifi缓存
      console.log('没有对应环境的缓存wifi信息1')
      that.setData({
        'bindWifiTest.PswContent': '', //移除密码
      })
      that.initBindWifiTest(BSSID, SSIDContent, SSIDContent, '01', '12', '', '')
    }
  },
  //跳转wifi 指引
  gotoWiFiGuide(){
    burialPoint.clickCheckCurrentWiFi({
      deviceSessionId: app.globalData.deviceSessionId,
      blueVersion: app.addDeviceInfo.blueVersion,
      deviceId: app.addDeviceInfo.deviceId,
      linkType: app.addDeviceInfo.linkType,
      sn: app.addDeviceInfo.sn,
      sn8: app.addDeviceInfo.sn8,
      type: app.addDeviceInfo.type,
      moduleVison: app.addDeviceInfo.moduleVersion,
    })
    wx.navigateTo({
      url:'/distribution-network/addDevice/pages/wifiGuide/wifiGuide?currentWiFiName='+this.data.bindWifiTest.SSIDContent,
    })
  }
})
