const requestService = getApp().getGlobalConfig().requestService
const rangersBurialPoint = getApp().getGlobalConfig().rangersBurialPoint
const imgBaseUrl = getApp().getGlobalConfig().imgBaseUrl
import { getStamp, getReqId } from 'm-utilsdk/index'
import { checkWxVersion_807 } from '../../../../utils/util.js'
import { getFullPageUrl, showToast, computedBehavior } from 'm-miniCommonSDK/index'
import { addGuide, inputWifiInfo, searchDevice,scanDevice,linkDevice } from '../../../../utils/paths'
import { isSupportPlugin } from '../../../../utils/pluginFilter'
import { isAddDevice } from '../../../../utils/temporaryNoSupDevices'
import { getLinkType } from '../../../assets/js/utils'
import { addDeviceSDK } from '../../../../utils/addDeviceSDK'
import Dialog from '../../../../miniprogram_npm/m-ui/mx-dialog/dialog'
const brandStyle = require('../../../assets/js/brand.js')
import { imgesList } from '../../../assets/js/shareImg.js'
import { getPrivateKeys } from '../../../../utils/getPrivateKeys'
import config from '../../../../config'
import { isColmoDeviceBySn8 } from '../../../common/js/device'
import { getUrlParamy} from '../../../../utils/scanCodeApi'
import { getQueryIotProductV4 } from '../../api/api'
const app = getApp()
const imgUrl = imgBaseUrl.url + '/shareImg/' + app.globalData.brand
const getFamilyPermissionMixin = require('../../../assets/js/getFamilyPermissionMixin.js')
const getBatchAuthListMixin = app.globalData.brand == 'colmo' ? require('../../../../components/home/my-home-appliances/behavior') : Behavior({})
const superGatewayMixin = app.globalData.brand == 'colmo' ? require('../../../assets/js/superGatewayMixin.js') : Behavior({})
const bluetooth = require('../../../../pages/common/mixins/bluetooth.js')
Page({
  behaviors: [computedBehavior, getFamilyPermissionMixin, getBatchAuthListMixin, superGatewayMixin,bluetooth],
  /**
   * 页面的初始数据
   */
  data: {
    currentIndex: 0,
    searchIconImg: imgBaseUrl.url + '/mideaServices/images/icon.png',
    notFoundImg: imgUrl + imgesList['noResult'],
    productList: [],
    scrollHeight: 0,
    isIphoneX: false,
    targetId: '',
    pageNum: 1,
    hasNext: false,
    loadFlag: false,
    clickFLag: false, //防重复点击
    prodName: '',
    brand: '',
    dialogStyle: brandStyle.config[app.globalData.brand].dialogStyle, //弹窗样式
    gatewayMiniVersions: null,
    isFromPlugin: false, //是否从插件进入
    ishowDialog:false,//是否显示扫描机身二维码弹窗
    scanTitle:'请扫描设备二维码',
    scanMessage:"请扫描设备机身上携带 “智能产品” 标识的二维码，以进行安全验证",
    scanButton:'去扫描',
    scanDsn:'',//保存扫码的dsn
  },
  computed: {
    //距离底部多远
    bottomPadding() {
      let { isIphoneX } = this.data
      return isIphoneX ? '100' : '70'
    },
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getApp().onLoadCheckingLog()
    this.data.brand = app.globalData.brand
    this.setData({
      brand: this.data.brand,
      searchIcon: imgUrl + imgesList['searchIcon'],
    })
    if (this.data.brand == 'colmo') {
      wx.setNavigationBarColor({
        backgroundColor: '#202026',
        frontColor: '#ffffff',
      })
    }
    this.getLoginStatus().then(() => {
      if (app.globalData.isLogon) {
        this.checkFamilyPermission()
      } else {
        this.navToLogin()
      }
    })
    this.setData({
      subCode: options.category || '',
      prodName: options.name || '',
    })
    if (options && options.isFromPlugin) {
      this.setData({
        isFromPlugin: options.isFromPlugin ? true : false
      })
    }
    this.initData()
  },
  getLoginStatus() {
    return app
      .checkGlobalExpiration()
      .then(() => {
        this.setData({
          isLogon: app.globalData.isLogon,
        })
      })
      .catch(() => {
        app.globalData.isLogon = false
        this.setData({
          isLogin: app.globalData.isLogon,
        })
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () { },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.data.clickFLag = false
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
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

  goToPage(url) {
    wx.navigateTo({
      url,
    })
  },
  getSystemInfo() {
    let self = this
    wx.getSystemInfo({
      success: function (res) {
        // 获取 select-input 的高度
        wx.createSelectorQuery()
          .select('.select-input')
          .boundingClientRect(function (rect) {
            self.setData({
              scrollHeight: res.windowHeight - rect.height,
            })
          })
          .exec()
        if (res.safeArea.top > 20) {
          self.setData({
            isIphoneX: true,
          })
        } else {
          self.setData({
            isIphoneX: false,
          })
        }
      },
    })
  },
  initData() {
    let self = this
    // self.setData({
    //   productList: modeData.data.list
    // })
    // console.log('productList===', modeData)
    self.getSystemInfo()
    self.getQueryIotProductV4()
  },
  getQueryIotProductV4(str) {
    let self = this
    this.data.loadDataFlag = true
    let { pageNum, productList, subCode } = self.data
    let param = {
      subCode,
      pageSize: '20',
      page: pageNum,
      brand: app.globalData.brand == 'meiju' ? '' : app.globalData.brand,
      stamp: getStamp(),
      reqId: getReqId(),
    }
    if (this.data.isFromPlugin) {
      param['subType'] = 'colmo-zigbee'
      param['productType'] = 2
    }
    if(app.globalData.brand === 'colmo') {
      delete param.brand
      param.iotAppId = config.iotAppId[config.environment]
    }
    requestService
      .request(getQueryIotProductV4, param)
      .then((res) => {
        console.log('res=====', res)
        let currList = res.data.data.list || []
        let hasNextPage = res.data.data.hasNextPage
        if (!currList.length) {
          return
        }
        let currProduct = str != 'next' ? currList : [...productList, ...currList]
        self.setData({
          productList: currProduct,
          loadFlag: true,
        })
        self.data.hasNext = hasNextPage
        self.data.loadDataFlag = false
        // self.setData({
        //   hasNext: hasNextPage,
        // })
      })
      .catch(() => {
        self.data.hasNext = true
        self.data.loadFlag = true
        self.setData({
          // hasNext: false,
          loadFlag: true,
        })
      })
  },
  /**
   * 获取密钥错误处理及重试逻辑
   * @param {*} e
   */
  privateKeyErrorHand(e, addDeviceInfo) {
    let self = this
    let obj = {
      page_name: '选择型号',
      widget_id: 'key_server_failed',
      widget_name: '密钥获取失败弹窗',
      sn8: app.addDeviceInfo.sn8 || '',
      widget_cate: app.addDeviceInfo.type || '',
    }
    getPrivateKeys.privateBurialPoint(obj)
    wx.hideLoading()
    // 解决低配置机子跳到其他页面时还会弹框的问题
    if (getFullPageUrl().indexOf('select-model/select-model') == -1) return

    Dialog.confirm({
      title: '服务器连接失败',
      message: '请检查网络或稍后再试',
      confirmButtonText: '重试',
      confirmButtonColor: this.data.dialogStyle.cancelButtonColor5,
      cancelButtonColor: this.data.dialogStyle.cancelButtonColor,
    })
      .then(async (res) => {
        if (res.action == 'confirm') {
          wx.hideLoading()
          obj.widget_id = 'click_retry'
          obj.widget_name = '密钥获取失败弹窗重试按钮'
          getPrivateKeys.privateBurialPoint(obj)
          try {
            wx.showLoading()
            await getPrivateKeys.getPrivateKey()
            self.data.clickFLag = false
            wx.hideLoading()
            self.prodClicked(e)
          } catch (err) {
            console.log('Yoram err is ->', err)
            wx.hideLoading()
            self.privateKeyErrorHand(e, addDeviceInfo)
          }
        }
      })
      .catch((error) => {
        if (error.action == 'cancel') {
          wx.hideLoading()

          self.data.clickFLag = false
          obj.widget_id = 'click_cancel'
          obj.widget_name = '密钥获取失败弹窗取消按钮'
          getPrivateKeys.privateBurialPoint(obj)
        }
      })
    // wx.showModal({
    //   title: '服务器连接失败',
    //   content: '请检查网络或稍后再试',
    //   confirmText: '重试',
    //   complete: async (res) => {
    //     if (res.cancel) {
    //       wx.hideLoading()
    //       self.setData({
    //         clickFLag: false,
    //       })
    //       obj.widget_id = 'click_cancel'
    //       obj.widget_name = '密钥获取失败弹窗取消按钮'
    //       getPrivateKeys.privateBurialPoint(obj)
    //     }

    //     if (res.confirm) {
    //       wx.hideLoading()
    //       obj.widget_id = 'click_retry'
    //       obj.widget_name = '密钥获取失败弹窗重试按钮'
    //       getPrivateKeys.privateBurialPoint(obj)
    //       try {
    //         wx.showLoading()
    //         await getPrivateKeys.getPrivateKey()
    //         self.data.clickFLag = false
    //         wx.hideLoading()
    //         this.prodClicked(e)
    //       } catch (err) {
    //         console.log('Yoram err is ->', err)
    //         wx.hideLoading()
    //         this.privateKeyErrorHand(e, addDeviceInfo)
    //       }
    //     }
    //   },
    // })
  },
  //产品点击
  async prodClicked(e) {
    getApp().setActionCheckingLog('prodClicked', '选择型号页点击了对应产品')
    let self = this
    let { clickFLag } = this.data
    let code = e.currentTarget.dataset.code
    let category = e.currentTarget.dataset.category
    let enterprise = e.currentTarget.dataset.enterprise
    let productId = e.currentTarget.dataset.id
    let deviceImg = e.currentTarget.dataset.img
    let deviceName = e.currentTarget.dataset.name
    console.log('spid======:',e.currentTarget.dataset.spid)
    let spid = e.currentTarget.dataset.spid
    if (clickFLag) {
      getApp().setMethodFailedCheckingLog('prodClicked', '点击防重处理不触发')
      console.log('prodClicked点击防重处理不触发')
      return
    }
    this.data.clickFLag = true
    wx.showLoading()
    let param = {
      code: code,
      stamp: getStamp(),
      reqId: getReqId(),
      enterpriseCode: enterprise,
      category: category,
      productId: productId,
      queryType: 1,
    }
    // if (spid){
    //   param.spid = spid
    // }
    console.log('select-model===e===', e)
    console.log('select-model===param===', param)
    //先判断是否isSupportPlugin
    if (!isSupportPlugin(`0x${category}`, code, code, '0')) {
      console.log('select-model判断是否isSupportPlugin')
      wx.hideLoading()
      Dialog.confirm({
        title: '该设备暂不支持在HarmonyOS NEXT系统添加，功能正在迭代升级中，敬请期待',
        confirmButtonText: '我知道了',
        confirmButtonColor: this.data.dialogStyle.cancelButtonColor5,
        showCancelButton: false,
      }).then((res) => {
        if (res.action == 'confirm') {
        }
      })
      // wx.showModal({
      //   content: '该设备仅支持在美的美居App添加',
      //   confirmText: '我知道了',
      //   confirmColor: '#267aff',
      //   showCancel: false,
      // })
      setTimeout(() => {
        self.data.clickFLag = false
      }, 1000)
      this.selectTypeNotSoupportTracking(
        {
          deviceSessionId: app.globalData.deviceSessionId,
          type: category,
          sn8: code,
        },
        '该品类无对应插件不支持小程序配网'
      )
      getApp().setMethodFailedCheckingLog('prodClicked', '该品类无对应插件不支持小程序配网')
      return
    }
    if (!isAddDevice(category.toLocaleUpperCase(), code)) {
      console.log('选型 不支持 未测试')
      wx.hideLoading()
      Dialog.confirm({
        title: '该设备暂不支持在HarmonyOS NEXT系统添加，功能正在迭代升级中，敬请期待',
        confirmButtonText: '我知道了',
        confirmButtonColor: this.data.dialogStyle.cancelButtonColor5,
        showCancelButton: false,
      }).then((res) => {
        if (res.action == 'confirm') {
        }
      })
      // wx.showModal({
      //   content: '该设备仅支持在美的美居App添加',
      //   confirmText: '我知道了',
      //   confirmColor: '#267aff',
      //   showCancel: false,
      // })
      setTimeout(() => {
        self.data.clickFLag = false
      }, 1000)
      this.selectTypeNotSoupportTracking(
        {
          deviceSessionId: app.globalData.deviceSessionId,
          type: category,
          sn8: code,
        },
        '未测试品类不支持小程序配网'
      )
      getApp().setMethodFailedCheckingLog('prodClicked', '未测试品类不支持小程序配网')
      return
    }
    requestService
      .request('multiNetworkGuide', param)
      .then(async (res) => {
        wx.hideLoading()
        console.log('res=====', res)
        let netWorking = 'wifiNetWorking'
        if(res.data.data.cableNetWorking && Object.keys(res.data.data.cableNetWorking).length > 0){
          netWorking = 'cableNetWorking'
          let gatewayMiniVersions = res.data.data.cableNetWorking.gatewayMiniVersions
          this.setData({
            gatewayMiniVersions
          })
        } else {
          let gatewayMiniVersions = res.data.data.wifiNetWorking.gatewayMiniVersions
          this.setData({
            gatewayMiniVersions
          })
        }
        let mode = res.data.data[netWorking].mainConnectinfoList[0].mode
        console.log('mode=====', mode)
        if(mode == 17) { // 数字遥控器配网方式，重新查询是否有ap配网指引
            let newParam = {...param,queryType: 2,mode: 0}
            let newMultinetworkGuide = await requestService
            .request('multiNetworkGuide', newParam)
            console.log("===newMultinetworkGuide==",newMultinetworkGuide)
            let newMode =  newMultinetworkGuide.data.data[netWorking].mainConnectinfoList[0].mode
            if(newMode == 0) {
                res = newMultinetworkGuide
                mode = newMode
            }
        }
        //0,3 跳inputWifiInfo, 5 跳addguide
        let addDeviceInfo = {
          sn8: code,
          type: category,
          enterprise,
          productId,
          deviceImg,
          deviceName:self.getDeviceImgAndName(category, code).deviceName,
          mode,
          fm: 'selectType',
          linkType: getLinkType(mode),
          guideInfo: res.data.data[netWorking].mainConnectinfoList,
          dataSource: res.data.data[netWorking].dataSource,
          brandTypeInfo: res.data.data[netWorking].brand, // 保存设备的品牌
          currentGatewayInfo: app.addDeviceInfo.currentGatewayInfo || {},
        }
        app.addDeviceInfo = addDeviceInfo
        app.addDeviceInfo.guideInfoAll = res.data.data
        let modeArr = addDeviceSDK.supportAddDeviceMode
        console.log("modeArr=====", modeArr)
        if (modeArr.indexOf(mode) >= 0) {
          //判断微信版本
          // if (!checkWxVersion_807()) {
          //   Dialog.confirm({
          //     title: '你的微信版本过低，请升级至最新版本后再试',
          //     confirmButtonText: '我知道了',
          //     confirmButtonColor: this.data.dialogStyle.cancelButtonColor5,
          //     showCancelButton: false,
          //   }).then((res) => {
          //     if (res.action == 'confirm') {
          //     }
          //   })
          //   setTimeout(() => {
          //     self.data.clickFLag = false
          //   }, 1000)
          //   getApp().setMethodFailedCheckingLog('prodClicked', '微信版本过低')
          //   return
          // }
          // 判断全局的密钥有没有，有就跳过，没有就重新拉取
          if (!app.globalData.privateKey && mode != '103' && mode != '100' && mode != '20') {
            if (app.globalData.privateKeyIntervalNum) {
              clearInterval(app.globalData.privateKeyIntervalNum)
            }
            try {
              await getPrivateKeys.getPrivateKey()
              self.data.clickFLag = false
              self.prodClicked(e)
            } catch (err) {
              self.privateKeyErrorHand(e, addDeviceInfo)
            }
            return
          }
          // 结束判断全局的密钥有没有，有就跳过，没有就重新拉取
          if (addDeviceSDK.isCanWb01BindBLeAfterWifi(category, code)) {
            app.addDeviceInfo = addDeviceInfo
            app.addDeviceInfo.mode = 'WB01_bluetooth_connection'
            self.data.clickFLag = false
            wx.navigateTo({
              url: addGuide,
            })
            return
          }
          if (mode == 5 || mode == 9 || mode == 10 || mode == 100 || mode == 103) {
            console.log('跳addguide')
            app.addDeviceInfo = addDeviceInfo
            wx.navigateTo({
              url: addGuide,
            })
          } else if (mode == 0 || mode == 3) {
            console.log('跳inputWifiInfo')
            app.addDeviceInfo = addDeviceInfo
            console.log(app.addDeviceInfo)
            self.data.clickFLag = false
            wx.navigateTo({
              url: inputWifiInfo,
            })
          } else if(mode == 6){
            console.log('子设备链路')
            app.addDeviceInfo = addDeviceInfo
            let subParam = {
              code,
              category,
              enterpriseCode:enterprise,
              smartProductId:spid,
              stamp: getStamp(),
              reqId: getReqId(),
              iotAppId: config.iotAppId[config.environment],
              filterType: 'BWL'
            }
            if (this.data.isFromPlugin) {            
              this.fromPluginRoute()
            } else {
              self.getGateway(subParam)
            }
          } else if (mode == 18) {
            console.log('超级网关链路')
            this.superGatewayDistributionNetwork(addDeviceInfo, res.data.data)
          } else if(mode == 20){
            let cellularType =  res.data.data[netWorking].mainConnectinfoList[0].cellularType
            app.addDeviceInfo = addDeviceInfo
           console.log('选型----：',app.addDeviceInfo)
            if(cellularType == 1){ // 白名单
             this.setData({
               ishowDialog:true
             })
            } else if(cellularType == 0){
             wx.navigateTo({
               url: addGuide,
               fail: function (error) {
                 console.log("跳转页面过多错误处理")
                 wx.redirectTo({
                   url: addGuide,
                 })
               }
             })
            }
 
           }
        } else {
          Dialog.confirm({
            title: '该设备暂不支持在HarmonyOS NEXT系统添加，功能正在迭代升级中，敬请期待',
            confirmButtonText: '我知道了',
            confirmButtonColor: this.data.dialogStyle.cancelButtonColor5,
            showCancelButton: false,
          }).then((res) => {
            if (res.action == 'confirm') {
              self.data.clickFLag = false
            }
          })
          // wx.showModal({
          //   content: '该设备仅支持在美的美居App添加',
          //   confirmText: '我知道了',
          //   confirmColor: '#267aff',
          //   showCancel: false,
          // })
          this.selectTypeNotSoupportTracking(
            {
              deviceSessionId: app.globalData.deviceSessionId,
              type: category,
              sn8: code,
            },
            '小程序暂时不支持的配网方式'
          )
          getApp().setMethodFailedCheckingLog('prodClicked', '小程序暂时不支持的配网方式')
        }
        setTimeout(() => {
          self.data.clickFLag = false
        }, 1000)
        this.getGuideTrack({
          deviceSessionId: app.globalData.deviceSessionId,
          type: category,
          sn8: code,
          linkType: addDeviceInfo.linkType,
          serverCode: res.data.code + '',
          serverType: res.data.data[netWorking].category,
          serverSn8: res.data.data[netWorking].mainConnectinfoList[0].code,
        })
        console.log('select model==============')
      })
      .catch((err) => {
        wx.hideLoading()
        console.log('error=====', err)
        self.data.clickFLag = false
        if (err?.data?.code && err.data.code == 1) {
          // wx.showToast({
          //   title: err.data.msg,
          //   icon: 'none',
          // })
          Dialog.confirm({
            title: '未获取到该产品的操作指引，请检查网络后重试，若仍失败，请联系售后处理',
            confirmButtonText: '好的',
            confirmButtonColor: this.data.dialogStyle.cancelButtonColor5,
            showCancelButton: false,
            success(res) { },
          }).then((res) => {
            if (res.action == 'confirm') {
              self.data.clickFLag = false
            }
          })
        } else {
          showToast('当前网络信号不佳，请检查网络设置', 'none', 3000)
        }
        this.getGuideTrack({
          deviceSessionId: app.globalData.deviceSessionId,
          type: category,
          sn8: code,
          linkType: '', //getLinkType(mode),
          serverCode: err?.data?.code + '' || err,
        })
        getApp().setMethodFailedCheckingLog('prodClicked', `选型后获取设备指引异常。error=${JSON.stringify(err)}`)
        // if (err.errMsg) {
        //   showToast('网络不佳，请检查网络')
        //   return
        // }
      })
  },
  //获取指引埋点
  getGuideTrack(params) {
    rangersBurialPoint('user_behavior_event', {
      module: 'appliance', //写死 “活动”
      page_id: 'device_guidebook_page', //参考接口请求参数“pageId”
      page_name: '配网指引返回结果', //当前页面的标题，顶部的title
      page_path: getFullPageUrl(), //当前页面的URL
      widget_id: 'server_return',
      widget_name: '服务器返回',
      object_type: '',
      object_id: '',
      object_name: '',
      ext_info: {
        code: params.serverCode || '',
        cate: params.serverType || '',
        sn8: params.serverSn8 || '',
      },
      device_info: {
        device_session_id: params.deviceSessionId, //一次配网事件标识
        sn: '', //sn码
        sn8: params.sn8, //sn8码
        a0: '', //a0码
        widget_cate: params.type, //设备品类
        wifi_model_version: params.moduleVison || '', //模组wifi版本
        link_type: params.linkType, //连接方式 bluetooth/ap/...
        iot_device_id: params.applianceCode || '', //设备id
      },
    })
  },
  //选型不支持埋点
  selectTypeNotSoupportTracking(deviceInfo, errorMsg) {
    rangersBurialPoint('user_page_view', {
      module: 'appliance',
      page_id: 'popups_select_not_support', //参考接口请求参数“pageId”
      page_name: '选择设备不支持配网弹窗', //当前页面的标题，顶部的title
      page_path: getFullPageUrl(), //当前页面的URL
      object_type: '',
      object_id: '',
      object_name: '',
      ext_info: {
        error_msg: errorMsg || '',
      },
      device_info: {
        device_session_id: deviceInfo.deviceSessionId, //一次配网事件标识
        sn: '', //sn码
        sn8: deviceInfo.sn8, //sn8码
        widget_cate: deviceInfo.type, //设备品类
      },
    })
  },
  goLogin() {
    getApp().setActionCheckingLog('goLogin', '点击去登录页')
    wx.navigateTo({
      url: '../../../../pages/login/login',
    })
  },
  loadMoreData() {
    getApp().setActionCheckingLog('loadMoreData', '上滑加载更多设备事件')
    console.log('next======')
    let { pageNum, hasNext } = this.data
    if (!hasNext) {
      return
    }
    if (this.data.loadDataFlag){
      return
    }
    this.data.pageNum += 1
    // this.setData({
    //   pageNum: pageNum + 1,
    // })
    this.getQueryIotProductV4('next')
  },
  goSearch() {
    getApp().setActionCheckingLog('goSearch', '点击去搜索设备页')
    let { subCode } = this.data
    if (this.data.isFromPlugin) {
      wx.navigateTo({
        url: `${searchDevice}?subCode=${subCode}&isFromPlugin=true`,
      })
    } else {
      wx.navigateTo({
        url: `${searchDevice}?subCode=${subCode}`,
      })
    }
  },

  checkOp(){
    this.cellularTypeGuideTracking()
    const brandConfig = app.globalData.brandConfig[app.globalData.brand]
    let guideUrl =
      brandConfig.QRcodeGuideUrl ||
      `${paths.webView}?webViewUrl=${encodeURIComponent(
        `${commonH5Api.url}deviceQrCode.html`
      )}&pageTitle=如何找到设备的二维码`

    if (app.globalData.brand == 'toshiba') {
      guideUrl = brandConfig.QRcodeGuideUrl ||
        `${paths.webView}?webViewUrl=${encodeURIComponent(
          `${commonH5Api.url}toshiba-deviceQrCode.html`
        )}&pageTitle=如何找到设备的二维码`
    }
    wx.navigateTo({
      url: guideUrl,
    })
  },
  scanQRcode(){
    let _this = this
    if(this.data.scanButton == '重新扫描'){
      this.cellularTypeRescanTracking()
    }
    wx.scanCode({
      success (res) {
        console.log(res)
        let result = getUrlParamy(res.result)
        console.log('result-----------:',result)
        if(!result){
          _this.setData({
            scanTitle:'未获取到二维码或二维码无效',
            scanMessage:"请扫描设备机身上携带 “智能产品” 标识的二维码",
            scanButton:'重新扫描',
            ishowDialog:true,
          })
          _this.cellularTypeErrorTracking()
          return
        }
        console.log('select-model mode=20扫码二维码插件黑白名单:',isSupportPlugin(`0x${result.category}`, result.sn8))
        console.log('select-model mode=20扫码二维码小程序是否支持:',isColmoDeviceBySn8(result.sn8))
        if (isSupportPlugin(`0x${result.category}`, result.sn8) && isColmoDeviceBySn8(result.sn8)) {
          let dsn
          if(result.dsn){
            app.addDeviceInfo.dsn = result.dsn.length == 28? result.dsn:''
            dsn = result.dsn
          }
          if(dsn && dsn.length == 28 && result.mode == '20' && (result.v =='5' || result.V == '5')){
            _this.data.scanDsn = dsn
            if(app.addDeviceInfo.sn8 !== result.sn8){
              let reqData = {
                sn: '',
                reqId: getReqId(),
                stamp: getStamp(),
                ssid: '',
                enterpriseCode: '0000',
                category: result.category.includes('0x') ? result.category.substr(2, 2) : result.category,
                code: result.sn8,
                mode: result.mode + '',
                queryType: 2, 
                productId:'',
                deviceImg:'',
                deviceName:'',
                spid:''
              }
              _this.encapsulation(reqData)
              return
            }
            wx.reLaunch({
              url:linkDevice
            })
          } else {
            _this.setData({
              scanTitle:'未获取到二维码或二维码无效',
              scanMessage:"请扫描设备机身上携带 “智能产品” 标识的二维码",
              scanButton:'重新扫描',
              ishowDialog:true
            })
            _this.cellularTypeErrorTracking()
          }
          
        } else {
          Dialog.confirm({
            title:'当前设备暂不支持使用COLMO小程序联网',
            confirmButtonText: '重新扫码',
            cancelButtonText: '退出',
            confirmButtonColor: _this.data.dialogStyle.confirmButtonColor2,
            cancelButtonColor: _this.data.dialogStyle.cancelButtonColor2
          }).then(async (res) => {
            if (res.action == 'confirm') {
              _this.scanQRcode()
            }
          }).catch((error) => {
            if (error.action == 'cancel') {
             //返回设备添加页
             wx.reLaunch({
              url:scanDevice,
            })
            }
          })
        }
      },
      fail(error){
        // console.error('选型蜂窝扫码错误:',error)
        // _this.setData({
        //   scanTitle:'未获取到二维码或二维码无效',
        //   scanMessage:"请扫描设备机身上携带 “智能产品” 标识的二维码",
        //   scanButton:'重新扫描',
        //   ishowDialog:true,
        // })
        // _this.cellularTypeErrorTracking()
        // return
      }
    })
  },
  onClickOverlay() {
    this.setData({
      ishowDialog: false,
      scanTitle:'请扫描设备二维码',
      scanMessage:"请扫描设备机身上携带 “智能产品” 标识的二维码，以进行安全验证",
      scanButton:'去扫描'
    })
  },

  //封装请求配网指引
  encapsulation(param){
    let {code,category,enterpriseCode,productId,deviceImg,deviceName,spid} = param
    let enterprise = enterpriseCode
    let self = this
    return new Promise((resolve,reject)=>{
      requestService
      .request('multiNetworkGuide', param)
      .then(async (res) => {
        wx.hideLoading()
        console.log('res=====', res)
        let netWorking = 'wifiNetWorking'
        if(res.data.data.cableNetWorking && Object.keys(res.data.data.cableNetWorking).length > 0){
          netWorking = 'cableNetWorking'
          let gatewayMiniVersions = res.data.data.cableNetWorking.gatewayMiniVersions
          this.setData({
            gatewayMiniVersions
          })
        } else {
          let gatewayMiniVersions = res.data.data.wifiNetWorking.gatewayMiniVersions
          this.setData({
            gatewayMiniVersions
          })
        }
        let mode = res.data.data[netWorking].mainConnectinfoList[0].mode
        console.log('mode=====', mode)
        //0,3 跳inputWifiInfo, 5 跳addguide
        let addDeviceInfo = {
          sn8: res.data.data[netWorking].mainConnectinfoList[0].code,
          type: res.data.data[netWorking].category,
          enterprise:res.data.data[netWorking].enterpriseCode,
          productId:res.data.data[netWorking].mainConnectinfoList[0].productId,
          deviceImg:res.data.data[netWorking].mainConnectinfoList[0].productImg,
          deviceName:self.getDeviceImgAndName(res.data.data[netWorking].category, res.data.data[netWorking].mainConnectinfoList[0].code).deviceName,
          mode,
          fm: 'selectType',
          linkType: getLinkType(mode),
          guideInfo: res.data.data[netWorking].mainConnectinfoList,
          dataSource: res.data.data[netWorking].dataSource,
          brandTypeInfo: res.data.data[netWorking].brand, // 保存设备的品牌
          currentGatewayInfo: app.addDeviceInfo.currentGatewayInfo || {},
        }
        app.addDeviceInfo = addDeviceInfo
        app.addDeviceInfo.guideInfoAll = res.data.data
        let modeArr = addDeviceSDK.supportAddDeviceMode
        console.log("modeArr=====", modeArr)
        if (modeArr.indexOf(mode) >= 0) {
          //判断微信版本
          if (!checkWxVersion_807()) {
            Dialog.confirm({
              title: '你的微信版本过低，请升级至最新版本后再试',
              confirmButtonText: '我知道了',
              confirmButtonColor: this.data.dialogStyle.cancelButtonColor5,
              showCancelButton: false,
            }).then((res) => {
              if (res.action == 'confirm') {
              }
            })
            // wx.showModal({
            //   content: '你的微信版本过低，请升级至最新版本后再试',
            //   confirmText: '我知道了',
            //   confirmColor: '#267aff',
            //   showCancel: false,
            // })

            getApp().setMethodFailedCheckingLog('prodClicked', '微信版本过低')
            return
          }
          // 判断全局的密钥有没有，有就跳过，没有就重新拉取
          if (!app.globalData.privateKey && mode != '103' && mode != '100' && mode != '20') {
            if (app.globalData.privateKeyIntervalNum) {
              clearInterval(app.globalData.privateKeyIntervalNum)
            }
            try {
              await getPrivateKeys.getPrivateKey()
              self.encapsulation(param)
            } catch (err) {
              Dialog.confirm({
                title: '服务器连接失败',
                message: '请检查网络或稍后再试',
                confirmButtonText: '重试',
                confirmButtonColor: self.data.dialogStyle.cancelButtonColor5,
                cancelButtonColor: self.data.dialogStyle.cancelButtonColor,
              }).then((res) => {
                if (res.action == 'confirm') {
                  self.encapsulation(param)
                }
              }).catch(()=>{

              })
            }
            return
          }
          // 结束判断全局的密钥有没有，有就跳过，没有就重新拉取
          if (addDeviceSDK.isCanWb01BindBLeAfterWifi(category, code)) {
            app.addDeviceInfo = addDeviceInfo
            app.addDeviceInfo.mode = 'WB01_bluetooth_connection'
            wx.navigateTo({
              url: addGuide,
            })
            return
          }
          if (mode == 5 || mode == 9 || mode == 10 || mode == 100 || mode == 103) {
            console.log('跳addguide')
            app.addDeviceInfo = addDeviceInfo
            wx.navigateTo({
              url: addGuide,
            })
          } else if (mode == 0 || mode == 3) {
            console.log('跳inputWifiInfo')
            app.addDeviceInfo = addDeviceInfo
            console.log(app.addDeviceInfo)
            wx.navigateTo({
              url: inputWifiInfo,
            })
          } else if(mode == 6){
            console.log('子设备链路')
            app.addDeviceInfo = addDeviceInfo
            let subParam = {
              code,
              category,
              enterpriseCode:enterprise,
              smartProductId:spid,
              stamp: getStamp(),
              reqId: getReqId(),
              iotAppId: config.iotAppId[config.environment],
              filterType: 'BWL'
            }
            if (this.data.isFromPlugin) {            
              this.fromPluginRoute()
            } else {
              self.getGateway(subParam)
            }
          } else if (mode == 18) {
            console.log('超级网关链路')
            this.superGatewayDistributionNetwork(addDeviceInfo, res.data.data)
          } else if(mode == 20){
            let cellularType =  res.data.data[netWorking].mainConnectinfoList[0].cellularType
            app.addDeviceInfo = addDeviceInfo
            app.addDeviceInfo.dsn = this.data.scanDsn
            console.log('选型搜索----：',app.addDeviceInfo)
            if(cellularType == 1){
              wx.navigateTo({
                url: linkDevice,
                fail: function (error) {
                  console.log("选型搜索----跳转页面过多错误处理")
                  wx.redirectTo({
                    url: linkDevice,
                  })
                }
              })
            } else if(cellularType == 0){
              wx.navigateTo({
                url: addGuide,
                fail: function (error) {
                  console.log("跳转页面过多错误处理")
                  wx.redirectTo({
                    url: addGuide,
                  })
                }
              })
            }

          }
        } else {
          Dialog.confirm({
            title: '该设备暂不支持在HarmonyOS NEXT系统添加，功能正在迭代升级中，敬请期待',
            confirmButtonText: '我知道了',
            confirmButtonColor: this.data.dialogStyle.cancelButtonColor5,
            showCancelButton: false,
          }).then((res) => {
            if (res.action == 'confirm') {
            }
          })
          // wx.showModal({
          //   content: '该设备仅支持在美的美居App添加',
          //   confirmText: '我知道了',
          //   confirmColor: '#267aff',
          //   showCancel: false,
          // })
          this.selectTypeNotSoupportTracking(
            {
              deviceSessionId: app.globalData.deviceSessionId,
              type: category,
              sn8: code,
            },
            '小程序暂时不支持的配网方式'
          )
          getApp().setMethodFailedCheckingLog('prodClicked', '小程序暂时不支持的配网方式')
        }
        this.getGuideTrack({
          deviceSessionId: app.globalData.deviceSessionId,
          type: category,
          sn8: code,
          linkType: addDeviceInfo.linkType,
          serverCode: res.data.code + '',
          serverType: res.data.data[netWorking].category,
          serverSn8: res.data.data[netWorking].mainConnectinfoList[0].code,
        })
        console.log('select model==============')
      })
      .catch((err) => {
        wx.hideLoading()
        console.log('error=====', err)
        if (err?.data?.code && err.data.code == 1) {
          // wx.showToast({
          //   title: err.data.msg,
          //   icon: 'none',
          // })
          Dialog.confirm({
            title: '未获取到该产品的操作指引，请检查网络后重试，若仍失败，请联系售后处理',
            confirmButtonText: '好的',
            confirmButtonColor: this.data.dialogStyle.cancelButtonColor5,
            showCancelButton: false,
            success(res) { },
          }).then((res) => {

          })
        } else {
          showToast('当前网络信号不佳，请检查网络设置', 'none', 3000)
        }
        this.getGuideTrack({
          deviceSessionId: app.globalData.deviceSessionId,
          type: category,
          sn8: code,
          linkType: '', //getLinkType(mode),
          serverCode: err?.data?.code + '' || err,
        })
        getApp().setMethodFailedCheckingLog('prodClicked', `选型后获取设备指引异常。error=${JSON.stringify(err)}`)
        // if (err.errMsg) {
        //   showToast('网络不佳，请检查网络')
        //   return
        // }
      })
    })
  },

  // 未获取到二维码或二维码无效的弹窗埋点
  cellularTypeErrorTracking() {
    rangersBurialPoint('user_page_view', {
      module: 'appliance',
      page_id: 'power_on_networking_scan_code_failed', //参考接口请求参数“pageId”
      page_name: '上电即联网配网方式扫码解析失败', //当前页面的标题，顶部的title
      page_path: getFullPageUrl(), //当前页面的URL
      object_type: '',
      object_id: '',
      object_name: '',
      device_info: {
        device_session_id: app.globalData.deviceSessionId, //一次配网事件标识
        sn: '', //sn码
        sn8: app.addDeviceInfo.sn8, //sn8码
        a0:'',
        widget_cate: app.addDeviceInfo.type, //设备品类-
        wifi_model_version:app.addDeviceInfo.blueVersion?app.addDeviceInfo.blueVersion:'',
        link_type:app.addDeviceInfo.link_type,
      },
    })
  },
  //查看指引 埋点
  cellularTypeGuideTracking(){
    rangersBurialPoint('user_behavior_event', {
      module: 'appliance',
      page_id: '', //参考接口请求参数“pageId”
      page_name: '上电即联网配网方式扫码解析失败', //当前页面的标题，顶部的title
      page_path: getFullPageUrl(), //当前页面的URL
      widget_id: 'scan_code_failed_view_guidelines',
      widget_name: '扫码解析失败查看指引按钮',
      device_info: {
        device_session_id: app.globalData.deviceSessionId, //一次配网事件标识
        sn: '', //sn码
        sn8: app.addDeviceInfo.sn8, //sn8码
        a0:'',
        widget_cate: app.addDeviceInfo.type, //设备品类-
        wifi_model_version:app.addDeviceInfo.blueVersion?app.addDeviceInfo.blueVersion:'',
        link_type:app.addDeviceInfo.link_type
      },
    })
  },

  //重新扫描埋点
  cellularTypeRescanTracking(){
    rangersBurialPoint('user_behavior_event', {
      module: 'appliance',
      page_id: '', //参考接口请求参数“pageId”
      page_name: '', //当前页面的标题，顶部的title
      page_path: getFullPageUrl(), //当前页面的URL
      widget_id: 'scan_code_failed_view_scan',
      widget_name: '扫码解析失败查看指引按钮',
      device_info: {
        device_session_id: app.globalData.deviceSessionId, //一次配网事件标识
        sn: '', //sn码
        sn8: app.addDeviceInfo.sn8, //sn8码
        a0:'',
        widget_cate: app.addDeviceInfo.type, //设备品类-
        wifi_model_version:app.addDeviceInfo.blueVersion?app.addDeviceInfo.blueVersion:'',
        link_type:app.addDeviceInfo.link_type
      },
    })
  },
})
