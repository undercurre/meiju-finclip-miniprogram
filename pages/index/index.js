//index.js
const app = getApp() //获取应用实例
const bluetooth = require('../common/mixins/bluetooth.js')
const WX_LOG = require('../../utils/log')
import Dialog from '../../miniprogram_npm/m-ui/mx-dialog/dialog.js'
import { formatTime, getReqId, getStamp, hasKey, isEmptyObject, dateFormat } from 'm-utilsdk/index'
import { getPluginUrl } from '../../utils/getPluginUrl'
import { creatDeviceSessionId, getFullPageUrl, showToast, checkFamilyPermission, getIcon } from '../../utils/util'
import { getWxSystemInfo } from '../../utils/wx/index.js'
import { requestService, rangersBurialPoint } from '../../utils/requestService'
//const indexSrc = '../../assets/img/index/index.png'
import { actionScanResultIndex } from 'assets/js/scanCodeApi'
import { service, scodeResonse } from 'assets/js/service'
import Toast from 'm-ui/mx-toast/toast'
const indexHeader = '/assets/img/index/index-header.png'
console.log(`getSystemInfoSync：${JSON.stringify(wx.getSystemInfoSync())}`)
import {
  supportedApplianceTypes,
  getCommonType,
  isSupportPlugin,
  filterSupportedPlugin,
  isNeedCheckList,
} from '../../utils/pluginFilter'
import wxList from '../../globalCommon/js/wxList.js'
import {
  joinResultBurialPoint,
  indexViewBurialPoint,
  clickOpenPluginBurialPoint,
  clickSwitchFamilyBurialPoint,
  intoFamilyResultBurialPoint,
  editAndDeleteApplianceViewBurialPoint,
  editAndDeleteApplianceClickBurialPoint,
  checkFamilyPermissionBurialPoint,
  checkFamilyPermissionAddBurialPoint,
  cardClickPluginBurialPoint,
} from 'assets/js/burialPoint'
import { baseImgApi, imgBaseUrl } from '../../api'
import { clickEventTracking, trackLoaded } from '../../track/track.js'
import paths, { scanDevice, scanCodeResult, download } from '../../utils/paths.js'
// 动画效果
import { bleAfterWifiDevices } from '../common/js/bleAfterWifiDevices'
import { getDeviceSn, getDeviceSn8 } from '../common/js/device.js'
import { setPluginDeviceInfo } from '../../track/pluginTrack.js'
import { addDeviceSDK } from '../../utils/addDeviceSDK'
import { actionScanResult } from '../../utils/scanCodeApi'
import { familyPermissionText } from '../../globalCommon/js/commonText.js'
import { checkPermission } from '../common/js/permissionAbout/checkPermissionTip'
import HomeStorage from './assets/js/storage.js'
import {
  initWebsocket,
  receiveSocketMessage,
  closeReConnect,
  networkChange,
  closeWebsocket,
} from './../../utils/initWebsocket.js'
import { filterConfig } from './assets/filter.js'
import { resolveTemplate, resolveUiTemplate } from './assets/module-card-templates/resolvetemplate'
const homeStorage = new HomeStorage()
const indexSrc = imgBaseUrl.url + '/harmonyos/index/index.png'
const addIndexDevice = imgBaseUrl.url + '/harmonyos/index/add_index_device.png'
let currentPageOptions = {} // index 页面options
let shouldGetDeviceDataFromStorage = false // 是否都缓存（手动切换家庭后读缓存）
let forceUpdateWhenOnshow = false // 触发onshow是否需要更新
let hasInitedHomeIdList = [] // 已缓存的家庭id
Page({
  behaviors: [bluetooth],
  async onShow() {
    this.setData({
      myBtnConent: app.globalData.isLogon ? '去添加' : '添加智能设备',
    })
    if (getApp().globalData.gloabalWebSocket && getApp().globalData.gloabalWebSocket._isClosed) {
      this.initPushData()
    }
    // 重置组合设备数据
    if (app.addDeviceInfo.combinedDeviceFlag) {
      app.combinedDeviceInfo = [{ sn: '', a0: '' }]
      app.addDeviceInfo.combinedDeviceFlag = false
    }
    console.log('小木马开始', parseInt(Date.now()))
    console.log('优化 onshow start', dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss.S'))
    console.log('app.globalData-----:', app.globalData)
    this.data.isGoToScan = true
    trackLoaded('page_loaded_event', 'appOnShow')
    //刷新首页设备数据
    if (app.globalData.ifRefreshDeviceList) {
      this.refreshApplianceData()
      app.globalData.ifRefreshDeviceList = false
    }
    //刷新首页家庭列表数据
    if (app.globalData.ifRefreshHomeList) {
      this.init()
      app.globalData.ifRefreshHomeList = false
    } else {
      //恢复确权轮询
      if (app.globalData.isLogon && this.data.currentFamilyDeviceList && this.data.currentFamilyDeviceList.length > 0) {
        await this.getIntervalBatchAuthList(this.data.currentFamilyDeviceList)
      }
    }

    this.showNetToast() // 无网络提示
    await app
      .checkGlobalExpiration()
      .then(() => {
        console.log('优化 onshow checkGlobalExpiration then', dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss.S'))
        this.data.isLogon = app.globalData.isLogon
        this.setHomeManageAnimation(false)
        // 未登录
        if (!app.globalData.isLogon) {
          trackLoaded('page_loaded_event', 'horseHide')
          console.log('小木马消失9', parseInt(Date.now()))
          // v2.26 版本注销掉广告位代码
          // this.getFloatAdvertisement() //float 新接口
          this.setData({
            isHourse: false,
            isLogon: app.globalData.isLogon,
          })
        } else {
          // 已登录
          //首页不做权限校验
          //this.locationAuthorize() //判断用户是否授权小程序使用位置权限
          //this.bluetoothAuthorize() //判断用户是否授权小程序使用蓝牙权限
          //获取添加设备灰度名单判断是否是灰度用户
          addDeviceSDK.isGrayUser().then((isCan) => {
            this.setData({
              isCanAddDevice: isCan,
            })
            //是否有权限添加设备 埋点
            clickEventTracking('user_behavior_event', 'isSupportAddDevice', {
              page_id: 'page_home',
              page_name: '小程序首页',
              module: 'appliance',
              widget_id: 'api_support_show_add_device_bth',
              widget_name: '是否有权限展示添加设备入口',
              page_path: getFullPageUrl(),
              ext_info: {
                res: app.globalData.isCanAddDevice,
                if_sys: 1, //本需求固定为1
              },
            })
          })
          // 切换tab不重新请求数据
          if (typeof this.getTabBar === 'function' && this.getTabBar() && !this.data.isHourse) {
            app.globalData.selectTab = 0
            const getTabBar = this.getTabBar()
            this.getTabBar().setData({
              selected: 0,
            })
            if (getTabBar.data.isSwitchedTab) {
              getTabBar.data.isSwitchedTab = false
              return
            }
          }
          if (shouldGetDeviceDataFromStorage) {
            shouldGetDeviceDataFromStorage = false
          }
          // 校验onshow时是否重新请求数据
          if (!this.checkIsUpdateWhenOnshow() && !app.globalData.isCanClearFound) {
            return
          }
          this.init()
          //this.receiveSocketData()
          // v2.26 版本注销掉广告位代码
          // this.getFloatAdvertisement() //float 新接口
          this.nodeviceHeightSet()
        }
      })
      .catch((err) => {
        WX_LOG.warn('index checkGlobalExpiration catch1', err)
        console.log('checkGlobalExpiration catch err', err)
        this.nodeviceHeightSet() // onshow
        this.setHomeManageAnimation(false)
        app.globalData.isLogon = false
        trackLoaded('page_loaded_event', 'horseHide')
        console.log('小木马消失1', parseInt(Date.now()))
        this.setData({
          isLogon: app.globalData.isLogon,
          isHourse: false,
        })
        // v2.26 版本注销掉广告位代码
        // this.getFloatAdvertisement() //float 新接口 未登录
      })
    //当前tab页面检查协议是否已更新，已更新则关闭已渲染的协议更新弹窗（由于自定义遮罩层不能覆盖原生的tabbar，所以协议新弹窗出现时，可以点击tabbar，以至于tab页面都会渲染协议更新的弹窗）
    this.setData({
      isUpdatedAgreement: app.globalData.isUpdateAgreement,
    })
    this.changeTabBar()
    app.globalData.isShowUnSuppport = false //蓝牙自发现是否显示不支持控制或配网的自发现信息，设置为不显示
    //清除ap蓝牙自发现已发现的设备信息
    if (app.globalData.isCanClearFound) {
      app.globalData.isCanClearFound = false //重置状态
      this.setData({
        devices: [],
        isDeviceLength: false,
      })
    }
  },
  onAddToFavorites(res) {
    // webview 页面返回 webViewUrl
    console.log('webViewUrl: ', res.webViewUrl)
    return {
      title: '美的美居',
      imageUrl: '',
      query: '',
    }
  },
  onHide() {
    if (app.globalData.bathAuthTimer) clearInterval(app.globalData.bathAuthTimer)
    this.data.isOnHide = true
    this.data.isNfcFirstInit = false
    this.setData({
      showEdit: false,
      showHover: true,
    })
    this.stopBluetoothDevicesDiscovery()
    wx.offGetWifiList()
    this.clearMixinsTime()
  },
  data: {
    indexHeader,
    indexSrc,
    addIndexDevice,
    resetScrollTop: 0,
    showAni: false,
    animation: '',
    baseImgUrl: baseImgApi.url,
    currentHomeGroupId: '',
    currentHomeGroupIndex: 0,
    //所有家庭列表
    isHomeListLoaded: false,
    homeList: [],
    applianceHomeData: {}, //当前家庭信息（包含设备列表）
    supportedApplianceTypes: supportedApplianceTypes,
    supportedApplianceList: [], //当前家庭可支持的设备列表
    unsupportedApplianceList: [], //当前家庭不支持的设备列表
    currentApplianceIndex: 0, ////当前卡片页index
    isIpx: false,
    uid: app.globalData.uid || '',
    fromShare: false,
    homeOwnerGroupId: '',
    isLogon: false,
    code: '',
    gdt_vid: '', //外投活动 广告traceid
    currentFamilyDeviceList: [],
    currentHomeInfo: {},
    statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'], //顶部状态栏的高度
    isShowProductDialog: true, // 自发现弹窗
    isUpdatedAgreement: app.globalData.isUpdateAgreement,
    triggered: false, //下拉刷新
    sHeight: 'height:calc(100% - 113rpx)',
    sceneIconList: [], //场景icon列表
    isExpandNoSupportDevice: false,
    isGoToPlugin: true, //跳转插件页防重
    isHourse: true,
    isShowApplyForFamily: false,
    nfcData: {},
    applyJoinLoading: false,
    homeInfoFailFlag: false, //首页接口加载失败
    noDeviceHeight: '155rpx',
    noLoginHeight: '256rpx',
    noDeviceWarpHeight: '',
    isNfcFirstInit: false,
    boughtDevices: [], //已购未激活设备列表
    dcpDeviceImgList: [],
    isActionPlugin: false,
    smartEditList: [
      {
        // 智能设备编辑列表
        name: '修改名称',
        ico: baseImgApi.url + 'pop_ic_name@2x.png',
        funName: 'editApplianceName',
      },
      {
        name: '删除设备',
        ico: baseImgApi.url + 'pop_ic_delete@2x.png',
        funName: 'deleteAppliance',
      },
      {
        name: '移动设备',
        ico: baseImgApi.url + 'pop_ic_home@2x.png',
        funName: 'changeRoom',
      },
    ],
    unSmartEditList: [
      {
        //非智设备编辑列表
        name: '修改名称',
        ico: baseImgApi.url + 'pop_ic_name@2x.png',
        funName: 'editApplianceName',
      },
      {
        name: '删除设备',
        ico: baseImgApi.url + 'pop_ic_delete@2x.png',
        funName: 'deleteAppliance',
      },
    ],
    boughtDevicesEditList: [
      {
        //已购未绑定设备编辑列表
        name: '删除设备',
        ico: baseImgApi.url + 'pop_ic_delete@2x.png',
        funName: 'deleteAppliance',
      },
    ],
    editApplianceName: '',
    showEditAppliancePop: false, //编辑设备名字弹框
    unsEInd: null, // 不支持设备列表当前索引
    sEInd: null, // 支持设备列表当前索引
    bouEInd: null, //已购未绑定设备列表当前索引
    showEdit: false, // 修改名称，删除设备功能栏
    editPopTip: '',
    editFlag: false, //修改名称，删除设备，更换房间checkNoDeviceBtn功能栏上还是下展示标识
    scollTop: 0,
    showHover: true, //设备点击态样式
    allDevice: [],
    myBtnConent: app.globalData.isLogon ? '去添加' : '添加智能设备',
    // myBtnConent: '添加智能设备',
    isCanAddDevice: true, //是否可配网,灰度下架，写死为true
    clickFLag: false, //防重复点击
    hasScand: false, // 是否已经扫码加入家庭
    addDeviceClickFlag: false, //添加设备按钮防重
    isOnHide: false,
    deviceCardAniTimeout: null,
    deviceCardIsShow: false, // 批量添加设备卡片提示
    isGoToScan: true, //防爆击
    fromPrivacy: false,
    showPrivacy: false,
    batchProperties: [], //物模型属性存取
    poupInfomation: {
      show: false,
      poupInfo: {
        img: 'https://wx3.sinaimg.cn/mw690/92321886gy1hqaaubetpyj21jk25nat4.jpg',
        info: `首页强制更新考虑放假了丝
            开了房见识到了肯德基凯撒
            开了房见识到了肯德基凯撒
            开了房见识到了肯德基凯撒
            开了房见识到了肯德基凯撒
            开了房见识到了肯德基凯撒
            开了房见识到了肯德基凯撒
            开了房见识到了肯德基凯撒
            
            扣法兰看手机卡拉卡`,
        type: 3, //假定1是可升级， 2是参与内测，3是必须升级
      },
    },
  },
  //长链接推送解析
  async initPushData() {
    const { isLogon } = app.globalData
    if (isLogon) {
      try {
        if (getApp().globalData.gloabalWebSocket) {
          closeWebsocket()
        }
        await initWebsocket().then((resp) => {
          console.log('webscoket index.js链接成功=====>', resp)
          this.receiveSocketData()
        })
        closeReConnect().then((resp) => {
          console.log('webscoket index.js重连接成功=====>', resp)
          this.receiveSocketData()
        })
        networkChange().then((resp) => {
          console.log('webscoket index.js监听网络变化=====>', resp)
          this.receiveSocketData()
        })
      } catch (error) {
        console.log(error, 'initWebsocket catch error')
      }
    }
  },
  //解析物模型推送数据
  receiveSocketData() {
    receiveSocketMessage('', (message) => {
      if (message.data) {
        this.data.batchProperties.map((item) => {
          if (item.applianceCode == message.applianceCode) {
            let pushData = JSON.parse(message.data)
            console.log('websocket onReceivedMsg index.js推送测试收到服务器内容message==>', pushData.data.current)
            let supportedApplianceList = this.data.supportedApplianceList.map((pushItem) => {
              if (pushItem.applianceCode === message.applianceCode) {
                pushItem.cardDataTemplate = resolveTemplate(pushItem, pushData.data.current)
              }
              return pushItem
            })
            this.setData({
              supportedApplianceList: supportedApplianceList,
            })
          }
        })
      }
    })
  },
  // 校验onshow是否重新请求数据
  checkIsUpdateWhenOnshow() {
    if (forceUpdateWhenOnshow) {
      forceUpdateWhenOnshow = false
      return true
    } else {
      if (this.data.fromShare) {
        this.data.fromShare = false
        return false
      }
      if (this.data.isActionPlugin) {
        this.addDeviceCardBatch()
        this.data.isActionPlugin = false
        return false
      }
      if (this.data.isOnHide && !this.data.isHourse) {
        // onHide转为onShow不重新请求数据
        this.data.isOnHide = false
        return false
      }
    }
    return true
  },
  // 切换底部tab
  changeTabBar() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0,
      })
    }
  },
  // 通过小程序分享加入家庭
  joinFamilyFromShare() {
    // 家庭邀请码验证
    if (app.globalData.invitationCode) {
      this.verifyInviteCodeFun()
        .then((resp) => {
          let data = resp.data.data
          this.invitedLoginFamily(data)
          joinResultBurialPoint({
            code: app.globalData.invitationCode,
            msg: app.globalData.userData.invitationTips || '',
            channel: app.globalData.share ? 'APP' : '小程序',
          })
        })
        .catch((response) => {
          if (!hasKey(response, 'data')) return
          if (!hasKey(response.data, 'code')) return
          this.invitedFamilyFail(response)
        })
    }
  },
  // 组件回调执行对应方法
  editBacFun(e) {
    let fun = e.detail.funname
    if (fun == 'changeRoom') {
      this.changeRoom(e)
    } else if (fun == 'editApplianceName') {
      this.editApplianceName(e)
    } else if (fun == 'deleteAppliance') {
      this.deleteAppliance(e)
    }
  },
  // 更换房间
  async changeRoom(e) {
    let itemInfo = app.globalData.applianceItem
    let support = app.globalData.applianceItemSupport
    this.editAndDeleteClickPoint('changeRoom', itemInfo, support)
    const checkIsHomeGroupExist = await this.checkHomeGroupStatus()
    if (!checkIsHomeGroupExist) {
      return
    }
    const hasFamilyPermission = checkFamilyPermission({
      currentHomeInfo: this.data.currentHomeInfo,
      permissionText: familyPermissionText.changeRoom,
    })
    if (!hasFamilyPermission) {
      checkFamilyPermissionBurialPoint({
        page_id: 'pop_ord_memb_no_autr_change_room',
        page_name: '普通成员无权限移动设备弹窗',
        object_id: itemInfo && itemInfo.applianceCode,
        object_name: itemInfo && itemInfo.name,
        onlineStatus: itemInfo && itemInfo.onlineStatus,
        pluginType: itemInfo && itemInfo.type,
        sn8: itemInfo && itemInfo.sn8,
        is_support_current_device: e.detail.support ? 1 : 0,
        homegroup_id: this.data.currentHomeInfo && this.data.currentHomeInfo.homegroupId,
      })
      this.setData({
        showEdit: false,
      })
      return
    }
    forceUpdateWhenOnshow = true
    wx.navigateTo({
      url: '/change-room/pages/changeRoom/changeRoom?homeGrounpId=' + this.data.currentHomeGroupId,
    })
  },
  // 关闭修改名称，删除设备，更换房间功能栏
  closeEditListPop() {
    if (this.data.showEdit) {
      this.setData({
        showEdit: false,
      })
    }
  },
  // 设备滚动事件
  scollDidScoll(e) {
    if (e.detail.scrollTop <= this.data.scollTop) {
      clickEventTracking('user_behavior_event', 'bindrefresherrefresh', {
        page_id: 'page_home',
        page_name: '小程序首页',
        module: '首页',
        widget_id: 'glide',
        widget_name: '手指下滑',
        page_path: getFullPageUrl(),
      })
    } else {
      clickEventTracking('user_behavior_event', 'bindrefresherrefresh', {
        page_id: 'page_home',
        page_name: '小程序首页',
        module: '首页',
        widget_id: 'upglide',
        widget_name: '手指上滑',
        page_path: getFullPageUrl(),
      })
    }
    this.data.scollTop = e.detail.scrollTop
  },
  // 重置动画  展示删除编辑框
  resetAnimation() {
    let that = this
    if (this.data.deviceCardAniTimeout) {
      clearTimeout(this.data.deviceCardAniTimeout)
    }
    this.data.deviceCardAniTimeout = setTimeout(() => {
      that.setData({
        showAni: false,
        showEdit: true,
        editeFlag: false,
      })
    }, 300)
  },
  //长按设备卡片
  editeLongPress(e) {
    this.setData({
      showEdit: false,
      showAni: true,
      bouEInd: -1,
      sEInd: -1,
      unsEInd: -1,
    })
    let supportFalg = e.currentTarget.dataset.isSupport
    let roomId = e.currentTarget.dataset.all.roomId
    let index = e.currentTarget.dataset.index
    let itemInfo = e.currentTarget.dataset.all
    app.globalData.applianceItem = itemInfo
    if (supportFalg) {
      //支持的设备  智能设备，上云的蓝牙直连设备   支持编辑，删除，更改房间   没上云蓝牙直连设备不支持编辑删除
      let support = e.currentTarget.dataset.support
      let type = e.currentTarget.dataset.type
      this.editAndDeleteClickPoint('longPressCard', itemInfo, support)
      if (type == 'boughtDevices') {
        //已购未绑定
        let scale = app.globalData.systemInfo.screenWidth / 375
        let typeParam = { type: type }
        app.globalData.applianceItem = Object.assign(typeParam, app.globalData.applianceItem)
        let popHeigth = 83 / 2.0
        popHeigth = popHeigth * 1 * scale
        let diff = e.currentTarget.offsetTop - this.data.scollTop
        this.setData({
          supportEditList: this.data.boughtDevicesEditList,
          bouEInd: index,
          sEInd: null,
          unsEInd: null,
          editFlag: diff > popHeigth,
          showHover: false,
        })
        this.resetAnimation()
        return false
      }

      app.globalData.applianceItemSupport = support
      let scale = app.globalData.systemInfo.screenWidth / 375
      let popHeigth = 83 / 2.0
      popHeigth = popHeigth * 3 * scale
      let diff = e.currentTarget.offsetTop - this.data.scollTop
      this.setData({
        supportEditList: this.data.smartEditList,
        sEInd: index,
        bouEInd: null,
        unsEInd: null,
        editFlag: diff > popHeigth,
        showHover: false,
      })
      this.resetAnimation()
    } else {
      //不支持设备  非智设备，智能设备
      app.globalData.applianceItemSupport = ''
      this.setData({
        showAni: true,
      })
      this.editAndDeleteClickPoint('longPressCard', itemInfo)
      if (roomId) {
        // 智能设备
        let scale = app.globalData.systemInfo.screenWidth / 375
        let popHeigth = 83 / 2.0
        popHeigth = popHeigth * 3 * scale
        let diff = e.currentTarget.offsetTop - this.data.scollTop
        this.setData({
          supportEditList: this.data.smartEditList,
          unsEInd: index,
          sEInd: null,
          bouEInd: null,
          editFlag: diff > popHeigth,
          showHover: false,
        })
        this.resetAnimation()
      }
    }
  },
  //功能栏中修改名称
  async editApplianceName(e) {
    const checkIsHomeGroupExist = await this.checkHomeGroupStatus()
    if (!checkIsHomeGroupExist) {
      return
    }
    const hasFamilyPermission = checkFamilyPermission({
      currentHomeInfo: this.data.currentHomeInfo,
      permissionText: familyPermissionText.updateDevice,
    })
    if (!hasFamilyPermission) {
      this.setData({
        showEdit: false,
      })
      const itemInfo = e.detail.item
      checkFamilyPermissionBurialPoint({
        page_id: 'pop_ord_memb_no_autr_edit_name',
        page_name: '普通成员无权限修改设备名称弹窗',
        object_id: itemInfo && itemInfo.applianceCode,
        object_name: itemInfo && itemInfo.name,
        onlineStatus: itemInfo && itemInfo.onlineStatus,
        pluginType: itemInfo && itemInfo.type,
        sn8: itemInfo && itemInfo.sn8,
        is_support_current_device: e.detail.support ? 1 : 0,
        homegroup_id: this.data.currentHomeInfo && this.data.currentHomeInfo.homegroupId,
      })
      return
    }
    this.setData({
      showEditAppliancePop: true,
      showEdit: false,
      applianceItem: e.detail.item,
      editApplianceName: e.detail.item.name,
    })
    let itemInfo = e.detail.item
    let support = e.detail.support
    this.editAndDeleteClickPoint('changName', itemInfo, support)
    this.editAndDeleteViewPoint('edit', itemInfo, support)
  },
  //修改名称弹框修改
  editApplianceNameFun(val) {
    let value = val.detail
    this.checkApplianceName(value)
  },
  //清空输入名称
  clearEdit() {
    this.data.editApplianceName = ''
    this.setData({
      editApplianceName: '',
      editPopTip: '',
    })
  },
  // 校验设备名称
  checkApplianceName(val) {
    // let roomId = app.globalData.applianceItem.roomId
    // let smrtReg = /^(\p{Unified_Ideograph}|[a-zA-Z\d ])*$/u
    // eslint-disable-next-line
    // let normalReg = /^(\p{Unified_Ideograph}|[a-zA-Z\d \(\) \uff08-\uff09 -/\\\+])*$/u
    // let reg = roomId ? smrtReg : normalReg
    let reg = /^[\dA-Za-z\u4e00-\u9fa5]+$/
    if (reg.test(val)) {
      this.setData({
        editApplianceName: val,
        showEdit: false,
        editPopTip: '',
      })
    } else if (!val) {
      this.setData({
        editPopTip: '设备名称不能为空',
      })
    } else {
      this.data.editApplianceName = val
      this.setData({
        editPopTip: '设备名称仅支持中文、英文、数字',
      })
    }
  },
  //删除设备弹框
  async deleteAppliance(e) {
    this.setData({
      showEdit: false,
    })
    let itemInfo = e.detail.item
    let support = e.detail.support
    this.editAndDeleteViewPoint('delete', itemInfo, support)
    this.editAndDeleteClickPoint('deleteAppliance', itemInfo, support)
    const checkIsHomeGroupExist = await this.checkHomeGroupStatus()
    if (!checkIsHomeGroupExist) {
      return
    }
    const hasFamilyPermission = checkFamilyPermission({
      currentHomeInfo: this.data.currentHomeInfo,
      permissionText: familyPermissionText.deleteDevice,
    })
    if (!hasFamilyPermission) {
      this.setData({
        showEdit: false,
      })
      checkFamilyPermissionBurialPoint({
        page_id: 'pop_ord_memb_no_autr_del_appliance',
        page_name: '通成员无权限删除设备弹窗',
        object_id: itemInfo && itemInfo.applianceCode,
        object_name: itemInfo && itemInfo.name,
        onlineStatus: itemInfo && itemInfo.onlineStatus,
        pluginType: itemInfo && itemInfo.type,
        sn8: itemInfo && itemInfo.sn8,
        is_support_current_device: e.detail.support ? 1 : 0,
        homegroup_id: this.data.currentHomeInfo && this.data.currentHomeInfo.homegroupId,
      })
      return
    }
    let that = this
    Dialog.confirm({
      zIndex: 10001,
      context: this,
      title: '确定删除选中设备吗？',
    })
      .then(() => {
        that.setData({
          showHover: true,
        })
        let itemInfo = app.globalData.applianceItem
        let support = app.globalData.applianceItemSupport
        that.editAndDeleteClickPoint('deleteSureClick', itemInfo, support)
        let roomId = app.globalData.applianceItem.roomId
        console.log('删除测试', itemInfo)
        if (roomId) {
          if (itemInfo.cardType) {
            //蓝牙直连未连上云设备删除
            that.bluetoothDelete(itemInfo)
            return
          }
          // 智能设备删除
          that.deleteSmartDevice(itemInfo)
        } else {
          if (
            app.globalData.applianceItem.type &&
            !app.globalData.applianceItem.qrCodeType &&
            app.globalData.applianceItem.qrCodeType != '0'
          ) {
            // 已购未绑定设备删除
            that.delBoughtDeviceCard(itemInfo)
          }
        }
      })
      .catch(() => {
        let itemInfo = app.globalData.applianceItem
        let support = app.globalData.applianceItemSupport
        that.editAndDeleteClickPoint('deleteCancleClick', itemInfo, support)
        that.setData({
          showHover: true,
        })
      })
  },
  // 蓝牙直连设备未连上云删除
  bluetoothDelete(itemInfo) {
    let reqData = {
      reqId: getReqId(),
      stamp: getStamp(),
      homegroupId: itemInfo.homegroupId,
      sn: itemInfo.sn,
    }
    requestService
      .request('delBluetoothDevice', reqData)
      .then((resp) => {
        console.log('删除蓝牙直连未连上云设备成功', resp)
        if (resp.data.code === 0) {
          this.refreshApplianceData()
          this.filterDevicurAddedApDeviceList(itemInfo)
          this.setData({
            showEditAppliancePop: false,
          })
          try {
            //移除数字遥控对应的直连设备缓存
            let btMac = itemInfo.btMac ? itemInfo.btMac.toLocaleUpperCase() : ''
            let remoteDeviceList = wx.getStorageSync('remoteDeviceList') ? wx.getStorageSync('remoteDeviceList') : []
            console.log('移除数字遥控对应的直连macList', remoteDeviceList)
            console.log('移除数字遥控对应的直连mac', btMac)
            remoteDeviceList = remoteDeviceList.filter((item) => item.btMac != btMac)
            wx.setStorageSync('remoteDeviceList', remoteDeviceList)
          } catch (error) {
            console.log('移除数字遥控对应的直连设备缓存错误', error)
          }
        }
      })
      .catch((error) => {
        console.log('删除蓝牙直连未连上云设备失败', error)
        wx.showToast({
          title: '删除失败，请重试~',
          icon: 'none',
        })
      })
  },
  // 删除智能设备
  deleteSmartDevice(itemInfo) {
    let param = {
      applianceCode: itemInfo.applianceCode,
      isOtherEquipment: itemInfo.isOtherEquipment,
    }
    service
      .deleteAppliance(param)
      .then((res) => {
        if (res.data.code == 0) {
          this.filterDevicurAddedApDeviceList(itemInfo)
          this.refreshApplianceData()
          this.setData({
            showEditAppliancePop: false,
          })
          try {
            //移除数字遥控对应的直连设备缓存
            let btMac = itemInfo.btMac ? itemInfo.btMac.toLocaleUpperCase() : ''
            let remoteDeviceList = wx.getStorageSync('remoteDeviceList') ? wx.getStorageSync('remoteDeviceList') : []
            remoteDeviceList = remoteDeviceList.filter((item) => item.btMac != btMac)
            wx.setStorageSync('remoteDeviceList', remoteDeviceList)
          } catch (error) {
            console.log('移除数字遥控对应的直连设备缓存错误', error)
          }
        } else {
          wx.showToast({
            title: '删除失败，请重试~',
            icon: 'none',
          })
        }
      })
      .catch((error) => {
        console.log('errorerror', error)
        wx.showToast({
          title: '删除失败，请重试~',
          icon: 'none',
        })
      })
  },
  //隐藏修改设备名称弹框
  hideEditAppliancePop() {
    this.clearEdit()
    let itemInfo = app.globalData.applianceItem
    let support = app.globalData.applianceItemSupport
    this.editAndDeleteClickPoint('editNameClickCancel', itemInfo, support)
    this.setData({
      showEditAppliancePop: false,
      showHover: true,
    })
  },
  //保存修改后的设备名称
  saveEditAppliancePop() {
    let itemInfo = app.globalData.applianceItem
    let support = app.globalData.applianceItemSupport
    let val = this.data.editApplianceName
    let reg = /^[ ]*$/
    if (this.data.editPopTip == '') {
      if (!reg.test(val)) {
        let roomId = app.globalData.applianceItem.roomId
        if (roomId) {
          this.editAndDeleteClickPoint('editNameClickSave', itemInfo, support)
          if (itemInfo.cardType) {
            //蓝牙直连未连上云设备名称修改
            this.bluetoothUpdateName(itemInfo, val)
            return
          }
          this.changeSmartDevice()
        }
      } else {
        this.setData({
          editPopTip: '设备名称不能为空',
        })
      }
    }
  },
  // 蓝牙直连未连上云设备修改设备名称
  bluetoothUpdateName(itemInfo, val) {
    let reqData = {
      reqId: getReqId(),
      stamp: getStamp(),
      homegroupId: itemInfo.homegroupId,
      roomId: itemInfo.roomId,
      applianceName: val,
      sn: itemInfo.sn,
    }
    requestService
      .request('changeBluetoothRoom', reqData)
      .then((resp) => {
        this.clearEdit()
        console.log('修改蓝牙直连未连上云设备名称成功', resp)
        if (resp.data.code === 0) {
          this.refreshApplianceData()
          this.setData({
            showEditAppliancePop: false,
            showHover: true,
          })
        }
      })
      .catch((error) => {
        console.log('修改蓝牙直连未连上云设备名称失败', error)
        wx.showToast({
          title: '修改设备名称失败',
          icon: 'none',
        })
      })
  },
  // 智能设备修改名称请求
  changeSmartDevice() {
    let { applianceCode, isOtherEquipment } = this.data.applianceItem
    let param = {
      applianceCode: applianceCode,
      isOtherEquipment: isOtherEquipment,
      applianceName: this.data.editApplianceName,
    }
    return new Promise(() => {
      service.editAppliance(param).then((resp) => {
        this.clearEdit()
        console.log('编辑成功', resp)
        if (resp.data.code == 0) {
          this.refreshApplianceData()
          this.setData({
            showEditAppliancePop: false,
            showHover: true,
          })
        }
      })
    })
  },
  //刷新设备列表数据
  refreshApplianceData() {
    let id = app.globalData.currentHomeGroupId
    shouldGetDeviceDataFromStorage = false
    this.getApplianceHomeDataService(id).then((resp) => {
      this.getAwaitCurrentFamilyDeviceList(resp)
      // let currentFamilyDeviceList = this.getCurrentFamilyDeviceList(resp) // 当前家庭设备列表
      // let composeApplianceCodeList = []
      // currentFamilyDeviceList.forEach((item) => {
      //   if (item.type == '0x4E') {
      //     item.singleAppliances.forEach((it) => {
      //       composeApplianceCodeList.push(it)
      //     })
      //   }
      // })
      // // 隐藏组合设备子设备
      // currentFamilyDeviceList = currentFamilyDeviceList.filter((item) => {
      //   return !composeApplianceCodeList.includes(parseInt(item.applianceCode))
      // })
      // this.setData({
      //   currentFamilyDeviceList: currentFamilyDeviceList,
      // })
      // this.filterSupportedAppliance()
      // //更新首页卡片进插件页不需要调用查询确权状态接口的applianceCode缓存列表
      // this.updateNoCheckAuthCodeList(currentFamilyDeviceList)
    })
    //获取当前用户下的空调设备
    this.getUserTypeDevice('0xAC').then((res) => {
      app.globalData.curUserMatchNetAcDevices = res.appliance
      app.globalData.curUserBluetoothAcDevices = res.bluetooth
      console.log('获取当前用户下的配网绑定空调设备', app.globalData.curUserMatchNetAcDevices)
      console.log('获取当前用户下的蓝牙直连空调设备', app.globalData.curUserBluetoothAcDevices)
    })
  },
  //异步等待刷新列表数据
  async getAwaitCurrentFamilyDeviceList(resp) {
    let currentFamilyDeviceList = await this.getCurrentFamilyDeviceList(resp) // 当前家庭设备列表
    let composeApplianceCodeList = []
    currentFamilyDeviceList.forEach((item) => {
      if (item.type == '0x4E') {
        item.singleAppliances.forEach((it) => {
          composeApplianceCodeList.push(it)
        })
      }
    })
    // 隐藏组合设备子设备
    currentFamilyDeviceList = currentFamilyDeviceList.filter((item) => {
      return !composeApplianceCodeList.includes(parseInt(item.applianceCode))
    })
    this.setData({
      currentFamilyDeviceList: currentFamilyDeviceList,
    })
    this.filterSupportedAppliance()
    //更新首页卡片进插件页不需要调用查询确权状态接口的applianceCode缓存列表
    this.updateNoCheckAuthCodeList(currentFamilyDeviceList)
  },
  //编辑和删除弹框展示浏览埋点
  editAndDeleteViewPoint(eventName, itemInfo, support) {
    let relation = {
      edit: {
        page_id: 'popups_appliance_name_edit',
        page_name: '修改设备名称弹窗',
      },
      delete: {
        page_id: 'popups_delete_appliance_confirm',
        page_name: '确认删除设备弹窗',
      },
    }
    let extInfo = {
      name: itemInfo.name || itemInfo.applianceName,
      onlineStatus: itemInfo.onlineStatus,
      pluginType: itemInfo.type,
      sn8: itemInfo.sn8,
      isSupport: support ? 1 : 0,
      applianceCode: itemInfo.applianceCode,
      is_smart: app.globalData.applianceItem.roomId ? 1 : 0,
      sn: itemInfo.sn || '',
      tsn: itemInfo.tsn || '',
      dsn: itemInfo.dsn || '',
      type: itemInfo.type || '',
    }
    let lastParma = Object.assign(extInfo, relation[eventName])
    editAndDeleteApplianceViewBurialPoint(lastParma)
  },
  //编辑和删除弹窗点击埋点
  editAndDeleteClickPoint(eventName, itemInfo, support) {
    let relation = {
      longPressCard: {
        page_id: 'page_home',
        page_name: '小程序首页',
        widget_name: '长按设备卡片',
        widget_id: 'press_plugin',
        module: true,
      },
      changName: {
        page_id: 'popups_appliance_edit',
        page_name: '悬浮的编辑组件',
        widget_name: '更改名称',
        widget_id: 'click_edit_name',
      },
      changeRoom: {
        page_id: 'popups_appliance_edit',
        page_name: '悬浮的编辑组件',
        widget_name: '更换房间',
        widget_id: 'click_change_room',
      },
      deleteAppliance: {
        page_id: 'popups_appliance_edit',
        page_name: '悬浮的编辑组件',
        widget_name: '删除设备',
        widget_id: 'click_delete_appliance',
      },
      editNameClickSave: {
        page_id: 'popups_appliance_edit',
        page_name: '修改设备名称弹窗',
        widget_name: '保存',
        widget_id: 'click_save',
      },
      editNameClickCancel: {
        page_id: 'popups_appliance_edit',
        page_name: '修改设备名称弹窗',
        widget_name: '取消',
        widget_id: 'click_cancel',
      },
      deleteSureClick: {
        page_id: 'popups_delete_appliance_confirm',
        page_name: '确认删除设备弹窗',
        widget_name: '确定',
        widget_id: 'click_confirm',
      },
      deleteCancleClick: {
        page_id: 'popups_delete_appliance_confirm',
        page_name: '确认删除设备弹窗',
        widget_name: '取消',
        widget_id: 'click_cancel',
      },
    }
    let extInfo = {
      name: eventName == 'editNameClickSave' ? this.data.editApplianceName : itemInfo.name,
      onlineStatus: itemInfo.onlineStatus,
      pluginType: itemInfo.type,
      sn8: itemInfo.sn8,
      isSupport: support ? 1 : 0,
      applianceCode: itemInfo.applianceCode,
      is_smart: app.globalData.applianceItem.roomId ? 1 : 0,
      sn: itemInfo.sn || '',
      tsn: itemInfo.tsn || '',
      dsn: itemInfo.dsn || '',
      type: itemInfo.type || '',
    }
    let lastParma = Object.assign(extInfo, relation[eventName])
    editAndDeleteApplianceClickBurialPoint(lastParma)
  },
  // 无网提示
  async showNetToast() {
    let netType = await this.nowNetType()
    if (netType == 'none') {
      wx.showToast({
        title: '网络未连接，请检查您的网络设置',
        icon: 'none',
        duration: 3000,
      })
    }
  },
  //加入家庭的分享码校验 home-manage
  verifyInviteCodeFun() {
    return new Promise((resolve, reject) => {
      let param = {
        uid: app.globalData.userData.uid,
        invitationCode: app.globalData.invitationCode,
      }
      service
        .verifyInviteCode(param)
        .then((resp) => {
          app.globalData.userData.invitationTips = resp.data.data.tips
          resolve(resp)
        })
        .catch((error) => {
          console.log('verifyInviteCodeFun失败', error)
          reject(error)
        })
    })
  },
  // 判断是未登录还是无数据跳转
  async checkNoDeviceBtn(e) {
    let flag = e.detail
    if (flag === 'noDevice') {
      const checkIsHomeGroupExist = await this.checkHomeGroupStatus()
      if (!checkIsHomeGroupExist) {
        return
      }
      const hasFamilyPermission = checkFamilyPermission({
        currentHomeInfo: this.data.currentHomeInfo,
        permissionText: familyPermissionText.addDevice,
      })
      if (!hasFamilyPermission) {
        checkFamilyPermissionAddBurialPoint()
        return
      }
      this.goAddDevice(this.data.currentHomeInfo.homegroupId)
    } else {
      this.goLogin()
    }
  },

  //配网屏蔽时 点击添加设备
  goToOtherChancel() {
    wx.navigateTo({
      url: download + '?fm=addDevice',
    })
    clickEventTracking('user_behavior_event', 'goAddDeviceJia', {
      device_info: {
        sn: '', //sn码
        sn8: '', //sn8码
        a0: '', //a0码
        widget_cate: '', //设备品类
        wifi_model_version: '', //模组wifi版本
        link_type: '', //连接方式 bluetooth/ap/...
        iot_device_id: '', //设备id
      },
      ext_info: {
        // is_first_add_device: app.globalData.isCanAddDevice ? 1 : 0,
        // if_support_add_device: app.globalData.isCanAddDevice ? 1 : 0,
        is_first_add_device: 1,
        if_support_add_device: 1,
      },
    })
  },
  // 计算无设备和未登录margin高度
  async nodeviceHeightSet() {
    //const systemInfo = await getWxSystemInfo()
    let system = wx.getSystemSetting(),
      appAuthorize = wx.getAppAuthorizeSetting(),
      deviceInfo = wx.getDeviceInfo(),
      windowInfo = wx.getWindowInfo(),
      appBaseInfo = wx.getAppBaseInfo()
    let systemInfo = {
      ...system,
      ...appAuthorize,
      ...deviceInfo,
      ...windowInfo,
      ...appBaseInfo,
    }
    const safeAreaBottom = (systemInfo.safeArea && systemInfo.safeArea.bottom) || 0
    let height = systemInfo.screenHeight
    let top = systemInfo.statusBarHeight
    let bottom = height - safeAreaBottom
    let width = systemInfo.screenWidth
    let scale = systemInfo.screenWidth / 375
    let piexl = 750 / width
    let newScale = width / 375
    let realHeight =
      ((height - top - bottom - app.globalData.navBarHeight - (49 + 60 + 90 + 15 + 12 + 151 + 37 + 117) * newScale) *
        piexl) /
      2
    // let noLoginRealHeight =
    // ((height - top - bottom - app.globalData.navBarHeight - (49 + 60 + 151 + 37 + 117 + 15) * newScale) * piexl) / 2
    let noLoginRealHeight =
      ((height - top - bottom - app.globalData.navBarHeight - (71 + 87 + 36 + 151 + 37 + 117 + 15) * newScale) *
        piexl) /
      2
    let noDeviceWarpRealHeight = (height - top - bottom - app.globalData.navBarHeight - 49 - 60 * scale) * piexl
    this.setData({
      noDeviceHeight: noLoginRealHeight + 'rpx',
      noLoginHeight: noLoginRealHeight + 'rpx',
      noDeviceWarpHeight: noDeviceWarpRealHeight + 'rpx',
    })
  },
  // 校验家庭列表红点
  checkHomeListRed() {
    let redFlag = app.globalData.checkHomeGrounpredDot
    if (redFlag) {
      this.getHomeGrouplistService().then((data) => {
        this.setData({
          homeList: data,
        })
      })
    }
  },
  trackTab() {
    clickEventTracking('user_behavior_event', 'trackTab')
  },
  //切换 不支持设备列表
  switchNoSupportDeviceList() {
    this.setData({
      isExpandNoSupportDevice: !this.data.isExpandNoSupportDevice,
    })
  },
  // 设备卡片下拉
  bindrefresherrefresh() {
    let self = this
    this.setHomeManageAnimation(false)
    if (self._freshing) return
    self._freshing = true
    setTimeout(() => {
      self.setData({
        triggered: false,
      })
      self._freshing = false
    }, 1500)
  },
  // 设备卡片下拉恢复
  bindrefresherrestore() {
    let that = this
    let currentApplianceConponent = that.getCurrentApplianceComponent()
    //执行当前组件的清除工作
    if (currentApplianceConponent && currentApplianceConponent.getDestoried) {
      currentApplianceConponent.getDestoried()
    }
    shouldGetDeviceDataFromStorage = false
    that.init()
    // this.setAdFloatComponentShow()
  },
  // 首页分享
  async onShareAppMessage(res) {
    var tempTitle = '欢迎使用美的美居Lite'
    var tempPath = '/pages/index/index'
    var tempImageUrl = '/assets/img/img_wechat_chat01@3x.png'
    const homegroupid = res?.target?.dataset?.homegroupid
    this.data.fromShare = true
    if (res.from == 'button') {
      try {
        const getInvitationCodeData = await this.getInvitationCode(homegroupid)
        tempPath = '/' + getInvitationCodeData.path
        tempTitle = '邀请你加入我的家庭控制设备'
        tempImageUrl = '/assets/img/img_wechat_chat02@3x.png'
      } catch (error) {
        console.log(error, 'onShareAppMessage')
      }
      //0x21智能门锁临时密码转发
      if (
        this.data.supportedApplianceList[this.data.currentApplianceIndex] &&
        this.data.supportedApplianceList[this.data.currentApplianceIndex].type === '0x21' &&
        res.target.dataset.sharetype === 'zlock'
      ) {
        tempTitle = '智能门锁临时密码：' + res.target.dataset.gid + '，10分钟内有效。'
      }
    }
    console.log('分享出来的路径', tempPath)
    //启用页面小程序转发功能
    return {
      title: tempTitle,
      path: tempPath,
      imageUrl: tempImageUrl,
    }
  },
  // 切换家庭管理的显示和隐藏
  switchShowHomeList() {
    const homeManage = this.selectComponent('#home-manage')
    homeManage && homeManage.switchShowHomeList()
  },
  setHomeManageAnimation(homeManageShow = true) {
    const homeManage = this.selectComponent('#home-manage')
    homeManage && homeManage.setHomeManageAnimation(homeManageShow)
  },

  //拼接遥控器绑定设备 当前家庭设备
  addRemoteBindDevice(deviceList, bluetooth) {
    let remoteBindDeviceList = []
    let currentHomeRoomList = bluetooth.roomList
    let curHomeGroupId = bluetooth.homegroupId
    for (let index = 0; index < currentHomeRoomList.length; index++) {
      const roomItem = currentHomeRoomList[index]
      if (roomItem.bluetoothApplianceList.length >= 0) {
        for (let indexA = 0; indexA < roomItem.bluetoothApplianceList.length; indexA++) {
          let applianceItem = Object.assign(roomItem.bluetoothApplianceList[indexA], {
            roomName: roomItem.name,
            roomId: roomItem.roomId,
            homegroupId: curHomeGroupId,
            pluginAbility: ['remote'],
            cardType: 'bluetooth',
            // homeName: this.data.currentHomeInfo.name
          })
          remoteBindDeviceList.push(applianceItem)
        }
      }
    }
    remoteBindDeviceList.forEach((item) => {
      //v2.17 使用设备icon新接口
      item.deviceImg = getIcon(item, this.data.sceneIconList, remoteBindDeviceList)
    })
    app.globalData.remoteBindDeviceList = remoteBindDeviceList
    return [...deviceList, ...remoteBindDeviceList]
  },

  //本地蓝牙设备数据读取拼接  当前家庭设备列表
  getLoaclBlueDevices(deviceList, currentHomeGroupId) {
    // let localBlueDevices = {
    //   1271245: [{
    //     modelNumber: '3333',
    //     name: '本地蓝牙空调',
    //     sn8: "123456",
    //     type: '0xAC',
    //     roomName:'厨房',
    //     deviceImg: "https://midea-file.oss-cn-hangzhou.aliyuncs.com/2021/12/10/14/RJQswpfADACBYOAKLcUQ.png",
    //     cardType: 'localBlue' //本地蓝牙
    //   }]
    // }
    // wx.setStorageSync('localBlueDevices', localBlueDevices)
    let localBlueDevices = wx.getStorageSync('localBlueDevices') || {}
    if (localBlueDevices[currentHomeGroupId]) {
      //本地蓝牙卡片增加蓝牙图标显示
      localBlueDevices[currentHomeGroupId].forEach((item) => {
        item.showBluetoothIcon = true
      })
      return [...deviceList, ...localBlueDevices[currentHomeGroupId]]
    } else {
      return deviceList
    }
  },
  // 校验当前家庭状态 （家庭是否存在，当前用户是否是当前家庭成员）
  checkHomeGroupStatus() {
    const homegroupId = this.data.currentHomeGroupId
    return new Promise((resolve, reject) => {
      service
        .getHomeGroupMemberStatus(homegroupId)
        .then(() => {
          resolve(true)
        })
        .catch((e) => {
          console.log('error!!!!!!:', e)
          const code = e?.data?.code
          if (code === 1200) {
            showToast('已退出/被移除家庭')
          }
          if (code === 1203) {
            showToast('当前家庭已被删除')
          }
          if (code === 1200 || code === 1203) {
            this.closeEditListPop()
            this.init()
          }
          if (e.errno == '5' || e.errMsg.includes('request:fail')) {
            showToast('网络不佳，请检查网络后重试')
            this.data.isGoToScan = true
          }
          reject(false)
        })
    })
  },
  // 家庭管理弹窗 选择家庭进行切换
  selectHomeGroupOption(e) {
    //选择新家庭
    let currentHomeGroupIndex = e?.detail?.currentTarget?.dataset?.bindex
    let selectedHomeGroupId = e?.detail?.currentTarget?.dataset?.homegroupid
    this.setData({
      resetScrollTop: 0,
    })
    shouldGetDeviceDataFromStorage = true
    //关闭选择列表
    this.switchShowHomeList()
    //选择当前家庭，不做处理
    if (selectedHomeGroupId == this.data.currentHomeGroupId) {
      return
    }
    this.setData({
      isHourse: true,
    })
    service
      .getHomeGroupMemberStatus(selectedHomeGroupId)
      .then(() => {
        //保存当前访问家庭供下次登录使用
        service
          .homegroupDefaultSetService(selectedHomeGroupId)
          .then(() => {
            this.updateHomeGroup(currentHomeGroupIndex, selectedHomeGroupId)
          })
          .catch((error) => {
            console.log('切换家庭失败', error)
            this.setData({
              isHourse: false,
            })
            wx.showToast({
              title: '切换家庭失败',
              icon: 'none',
            })
          })
      })
      .catch((e) => {
        const code = e?.data?.code
        if (code === 1200) {
          showToast('已退出/被移除家庭，切换失败')
        }
        if (code === 1203) {
          showToast('该家庭已被删除，切换失败')
        }
        if (code === 1200 || code === 1203) {
          this.getHomeGrouplistService().then(() => {
            const homeGroupIndex = this.data.homeList.findIndex(
              (item) => item.homegroupId === this.data.currentHomeGroupId
            )
            this.setData({
              currentHomeGroupIndex: homeGroupIndex,
              homeList: this.data.homeList,
              isHourse: false,
            })
          })
          return
        }
        this.setData({
          isHourse: false,
        })
      })
    this.clickBurdPoint('switch_home_menu')
    clickSwitchFamilyBurialPoint({
      homeId: this.data.currentHomeInfo.homegroupId,
      homeName: this.data.currentHomeInfo.name,
    })
  },
  //切换家庭
  updateHomeGroup(index, homegourpId) {
    console.log('优化 updateHomeGroup 切换家庭 shart', dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss.S'))
    const currentHomeInfo = this.data.homeList[index]
    //重置设备列表数据
    this.setData({
      currentHomeInfo: currentHomeInfo,
      currentHomeGroupIndex: index,
      currentHomeGroupId: homegourpId,
      homeList: this.data.homeList,
    })
    //更新全局currentHomeGroupId
    app.globalData.currentHomeGroupId = homegourpId
    app.globalData.homeRoleId = this.data.currentHomeInfo.roleId //是否是当前家庭的创建者
    wx.showNavigationBarLoading()
    return this.getApplianceHomeDataService(homegourpId)
      .then((resp) => {
        wx.stopPullDownRefresh()
        wx.hideNavigationBarLoading()
        this.dealBoughtDevices(resp.notActive || [], resp.applianceType || []) //处理未激活设备
        let data = resp.appliance[0]
        this.data.applianceHomeData = data
        //更新全局applianceHomeData
        app.globalData.applianceHomeData = data
        //从nfc进入-数据处理，nfc的加载小木马等nfc处理后再消失
        if (this.nfcFilterAction(app.globalData.options) && this.data.isNfcFirstInit) {
          this.actionFromNfc()
        } else {
          trackLoaded('page_loaded_event', 'horseHide')
          console.log('小木马消失2', parseInt(Date.now()))
          console.log('优化 小木马消失 切换家庭', dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss.S'))
        }
        this.getCurrentModuleFamilyDeviceList(resp)
        // let currentFamilyDeviceList = this.getCurrentFamilyDeviceList(resp) // 当前家庭设备列表
        // this.setData({
        //   currentFamilyDeviceList: currentFamilyDeviceList,
        // })
        // //过滤支持的设备
        // this.filterSupportedAppliance()
        // //更新首页卡片进插件页不需要调用查询确权状态接口的applianceCode缓存列表
        // this.updateNoCheckAuthCodeList(currentFamilyDeviceList)
      })
      .catch((e) => {
        wx.hideNavigationBarLoading()
        trackLoaded('page_loaded_event', 'horseHide')
        console.log('小木马消失3', e, parseInt(Date.now()))
        WX_LOG.warn('index updateHomeGroup promise catch3', e)
        const data = e && e.data
        const isLogout = data && data.code === 40002
        this.setData({
          isLogon: !isLogout,
          isHourse: false,
          homeInfoFailFlag: true,
        })
      })
  },
  //等待当前家庭设备列表返回
  async getCurrentModuleFamilyDeviceList(resp) {
    let currentFamilyDeviceList = await this.getCurrentFamilyDeviceList(resp) // 当前家庭设备列表
    this.setData({
      currentFamilyDeviceList: currentFamilyDeviceList,
    })
    this.filterSupportedAppliance()
    this.updateNoCheckAuthCodeList(currentFamilyDeviceList)
  },
  // 是否展开不支持设备数据
  checkIsExpandNoSupportDevice(supportedAppList) {
    let supportedApplianceList = supportedAppList || this.data.supportedApplianceList
    let boughtDevices = this.data.boughtDevices
    let isExpandNoSupportDevice = this.data.isExpandNoSupportDevice
    if (supportedApplianceList.length + boughtDevices.length === 0) {
      isExpandNoSupportDevice = true
    } else {
      isExpandNoSupportDevice = false
    }
    return isExpandNoSupportDevice
  },
  // 获取当前家庭设备列表
  async getCurrentFamilyDeviceList(applianceList) {
    let currentFamilyDeviceList = [] // 当前家庭设备列表
    let data = applianceList.appliance[0] // 智能设备列表
    let currentHomeRoomList = data.roomList // 房间列表
    let currentHomeGroupId = this.data.currentHomeGroupId // 当前家庭id
    let moduleReqData = [] //物模型数据
    if (shouldGetDeviceDataFromStorage && hasInitedHomeIdList.includes(currentHomeGroupId)) {
      const currentFamilyDeviceList = homeStorage.getStorage({
        homeId: currentHomeGroupId,
        name: 'currentFamilyDeviceList',
      })
      return currentFamilyDeviceList
    }
    for (let index = 0; index < currentHomeRoomList.length; index++) {
      const roomItem = currentHomeRoomList[index]
      for (let indexA = 0; indexA < roomItem.applianceList.length; indexA++) {
        let applianceItem = Object.assign(roomItem.applianceList[indexA], {
          roomName: roomItem.name,
          roomId: roomItem.roomId,
          homegroupId: this.data.currentHomeInfo.homegroupId,
          homeName: this.data.currentHomeInfo.name,
        })
        currentFamilyDeviceList.push(applianceItem)
        if (applianceItem.smartProductId && filterConfig.includes(applianceItem.smartProductId)) {
          let reqDataItem = {
            applianceCode: applianceItem.applianceCode,
            disablePropIntegrityCheck: true,
            disablePropLegalityCheck: true,
          }
          moduleReqData.push(reqDataItem)
        }
      }
    }
    //首页批量批量模板物模型数据请求,先写死配置 smartProductId，后期从开发者平台获取配置
    if (moduleReqData.length > 0) {
      await service
        .getBatchProperties(moduleReqData)
        .then((resp) => {
          //过滤正常数据
          this.data.batchProperties = resp.filter((item) => {
            return item.code == 0
          })
          console.log('获取物模型数据', resp)
        })
        .catch((e) => {
          this.data.batchProperties = []
        })
    }
    currentFamilyDeviceList.forEach((item) => {
      if (item.type == '0x4E') {
        item.composeApplianceList = currentFamilyDeviceList.filter((it) => {
          return item.singleAppliances.includes(parseInt(it.applianceCode))
        })
      }
    })
    currentFamilyDeviceList.forEach((item) => {
      console.log(item)
      if (item.type == '0x09') {
        item.onlineStatus = '1'
      }
      if (item.type == '0x4E') {
        item.composeApplianceList.forEach((it) => {
          if (it.onlineStatus == '1') {
            item.onlineStatus = '1'
          }
        })
      }
      if (item.smartProductId == 10003678) {
        item.sn8 = '384L0346'
      }
      if (item.smartProductId == 10000514) {
        item.sn8 = '38400LK4'
      }
    })
    let composeApplianceCodeList = []
    currentFamilyDeviceList.forEach((item) => {
      if (item.type == '0x4E') {
        item.singleAppliances.forEach((it) => {
          composeApplianceCodeList.push(it)
        })
      }
    })
    currentFamilyDeviceList.forEach((item) => {
      //v2.17 使用设备icon新接口
      item.deviceImg = getIcon(item, this.data.sceneIconList, currentFamilyDeviceList)
    })
    // 隐藏组合设备子设备
    currentFamilyDeviceList = currentFamilyDeviceList.filter((item) => {
      return !composeApplianceCodeList.includes(parseInt(item.applianceCode))
    })
    console.log(currentFamilyDeviceList, '9999999')
    if (applianceList.bluetooth) {
      //存在 遥控设备
      currentFamilyDeviceList = this.addRemoteBindDevice(currentFamilyDeviceList, applianceList.bluetooth) //添加遥控设备卡片
    }
    if (wx.getStorageSync('localBlueDevices')) {
      //存在 本地蓝牙设备
      currentFamilyDeviceList = this.getLoaclBlueDevices(currentFamilyDeviceList, currentHomeGroupId) //添j加本地蓝牙设备 卡片
    }
    homeStorage.setStorage({
      homeId: currentHomeGroupId,
      name: 'currentFamilyDeviceList',
      data: currentFamilyDeviceList,
    })
    return currentFamilyDeviceList
  },
  // 页面下拉刷新
  onPullDownRefresh() {
    let currentApplianceConponent = this.getCurrentApplianceComponent()
    //执行当前组件的清除工作
    if (currentApplianceConponent && currentApplianceConponent.getDestoried) {
      currentApplianceConponent.getDestoried()
    }
    this.init()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1500)
  },
  //获取家庭列表
  getHomeGrouplistService() {
    return new Promise((resolve, reject) => {
      service
        .getHomeGrouplistService()
        .then((resp) => {
          app.globalData.homeGrounpList = resp
          this.data.homeList = resp
          this.setData({
            isHomeListLoaded: true,
            isLogon: app.globalData.isLogon,
          })
          resolve(resp)
        })
        .catch((error) => {
          this.setData({
            isHomeListLoaded: true,
            isLogon: app.globalData.isLogon,
          })
          reject(error)
        })
    })
  },
  // 获取当前家庭设备列表 homegroupId-当前家庭id
  getApplianceHomeDataService(homegroupId) {
    return new Promise((resolve, reject) => {
      if (shouldGetDeviceDataFromStorage && hasInitedHomeIdList.includes(homegroupId)) {
        const applianceHomeData = homeStorage.getStorage({
          homeId: homegroupId,
          name: 'applianceHomeData',
        })
        app.globalData.roomList = applianceHomeData.appliance[0].roomList
        app.globalData.curFamilyInfo = applianceHomeData.appliance[0]
        app.globalData.currentRoomId = applianceHomeData.appliance[0].roomList[0].roomId //默认房间
        app.globalData.currentRoomName = applianceHomeData.appliance[0].roomList[0].name //默认房间名
        app.globalData.isCreateFamily = applianceHomeData.appliance[0].roleId == '1001' //是否是当前家庭
        resolve(applianceHomeData)
        return
      }
      service
        .getApplianceHomeDataService(homegroupId)
        .then((resp) => {
          app.globalData.roomList = resp.appliance[0].roomList
          app.globalData.curFamilyInfo = resp.appliance[0]
          app.globalData.currentRoomId = resp.appliance[0].roomList[0].roomId //默认房间
          app.globalData.currentRoomName = resp.appliance[0].roomList[0].name //默认房间名
          app.globalData.isCreateFamily = resp.appliance[0].roleId == '1001' || resp.appliance[0].roleId == '1002' //是否是当前家庭
          homeStorage.setStorage({ homeId: homegroupId, name: 'applianceHomeData', data: resp })
          resolve(resp)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  // 获取设备图片
  async getIotDeviceV3() {
    let dcpDeviceImgList = []
    let that = this
    return new Promise((resolve, reject) => {
      if (!isEmptyObject(app.globalData.dcpDeviceImgList)) {
        dcpDeviceImgList = app.globalData.dcpDeviceImgList
        this.data.sceneIconList = dcpDeviceImgList
        try {
          wx.setStorageSync('dcpDeviceImgList', dcpDeviceImgList) //部分手机可能因为长度设置失败
        } catch (error) {
          console.log('setStorageSync error', error)
        }
        resolve(dcpDeviceImgList)
      } else {
        service
          .getIotDeviceV3()
          .then((resp) => {
            console.log('获取设备图标 首页内')
            this.data.sceneIconList = resp.data.data.iconList
            app.globalData.dcpDeviceImgList = resp.data.data.iconList
            this.data.supportedApplianceList.forEach((item) => {
              item.deviceImg = getIcon(item, resp.data.data.iconList, this.data.supportedApplianceList)
            })
            this.data.unsupportedApplianceList.forEach((item) => {
              item.deviceImg = getIcon(item, resp.data.data.iconList, this.data.unsupportedApplianceList)
            })
            this.setData({
              supportedApplianceList: this.data.supportedApplianceList,
              unsupportedApplianceList: this.data.unsupportedApplianceList,
            })
            // this.refreshApplianceData()
            try {
              wx.setStorageSync('dcpDeviceImgList', resp.data.data.iconList) //部分手机可能因为长度设置失败
            } catch (error) {
              console.log(error)
            }
            resolve(resp)
          })
          .catch((error) => {
            console.log('获取设备图片失败============', error)
            reject(error)
          })
      }
    })
  },
  // 已购未激活  图片加载失败
  bindBoughtError(e) {
    let index = e.currentTarget.dataset.index
    let imgObject = 'boughtDevices[' + index + '].deviceImg'
    let errorImg = {}
    errorImg[imgObject] = this.data.baseImgUrl + 'dms_img_lack@3x.png'
    this.setData(errorImg)
  },
  // 小程序可以控制的 图片加载失败
  bindSupporteError(e) {
    let index = e.currentTarget.dataset.index
    let imgObject = 'supportedApplianceList[' + index + '].deviceImg'
    let isImgError = 'supportedApplianceList[' + index + '].isImgError'
    let errorImg = {}
    errorImg[imgObject] = this.data.baseImgUrl + 'dms_img_lack@3x.png'
    errorImg[isImgError] = true
    this.setData(errorImg)
  },
  // 非智能跟小程序不控制的 图片加载失败
  bindInerror(e) {
    let index = e.currentTarget.dataset.index
    let imgObject = 'unsupportedApplianceList[' + index + '].deviceImg'
    let errorImg = {}
    errorImg[imgObject] = this.data.baseImgUrl + 'dms_img_lack@3x.png'
    this.setData(errorImg)
  },
  // 过滤小程序支持的设备
  async filterSupportedAppliance() {
    let supportedApplianceList = []
    let unsupportedApplianceList = []
    await this.getIntervalBatchAuthList(this.data.currentFamilyDeviceList)
    const currentHomeGroupId = this.data.currentHomeGroupId
    if (shouldGetDeviceDataFromStorage && hasInitedHomeIdList.includes(currentHomeGroupId)) {
      supportedApplianceList = homeStorage.getStorage({
        homeId: currentHomeGroupId,
        name: 'supportedApplianceList',
      })
      unsupportedApplianceList = homeStorage.getStorage({
        homeId: currentHomeGroupId,
        name: 'unsupportedApplianceList',
      })
      let aLLDeviceLength = supportedApplianceList.length + unsupportedApplianceList.length
      const isExpandNoSupportDevice = this.checkIsExpandNoSupportDevice(supportedApplianceList)
      this.setData({
        isExpandNoSupportDevice,
        supportedApplianceList,
        unsupportedApplianceList,
        allDevice: aLLDeviceLength,
        isHourse: false,
      })
      return
    }
    for (let indexA = 0; indexA < this.data.currentFamilyDeviceList.length; indexA++) {
      let applianceItem = this.data.currentFamilyDeviceList[indexA]
      let isSupport = false
      let type = applianceItem.type
      let sn8 = applianceItem.sn8
      let A0 = applianceItem.modelNumber
      // console.log('过滤优化==》', type, sn8, A0, applianceItem.isOtherEquipment, applianceItem.cardType)
      isSupport = filterSupportedPlugin(type, sn8, A0, applianceItem.isOtherEquipment, applianceItem.cardType)
      //并去掉在线离线状态
      let { cardType, bindType, applianceCode } = applianceItem
      if (cardType == 'bluetooth' || bindType == 1 || bindType == 3) {
        applianceItem.showBluetoothIcon = true
        applianceItem.onlineStatus = false
      }
      const allDeviceDesc = applianceItem.name + applianceItem.roomName
      applianceItem.allDeviceDesc = allDeviceDesc
      applianceItem.allDeviceDescLen = allDeviceDesc.length
      applianceItem.isImgError = false
      if (isSupport) {
        let jsonData
        let { batchProperties } = this.data
        if (batchProperties.length > 0) {
          jsonData = batchProperties.filter((item) => item.applianceCode == applianceItem.applianceCode)
        }
        if (filterConfig.includes(applianceItem.smartProductId) && jsonData && jsonData.length > 0) {
          applianceItem.cardDataTemplate = resolveTemplate(applianceItem, jsonData[0].data)
          applianceItem.cardUITemplate = resolveUiTemplate(applianceItem)
        }
        //applianceItem.isAuth = await addDeviceSDK.checkDeviceAuth(applianceCode)
        let batchAuthList = wx.getStorageSync('batchAuthList')
        batchAuthList && batchAuthList.length > 0
          ? (applianceItem.isAuth = this.isNeedAuthCheck(batchAuthList, applianceCode))
          : (applianceItem.isAuth = await addDeviceSDK.checkDeviceAuth(applianceCode))
        supportedApplianceList.push(applianceItem)
      } else {
        unsupportedApplianceList.push(applianceItem)
      }
    }
    //cardOrder排序
    let orderSup = []
    let orderSupCode = []
    let noOrderSup = []
    let orderUnSup = []
    let orderUnSupCode = []
    let noOrderUnSup = []
    this.data.applianceHomeData.cardOrder.forEach((item) => {
      for (let i = 0; i < supportedApplianceList.length; i++) {
        if (item == supportedApplianceList[i].applianceCode) {
          orderSup.push(supportedApplianceList[i])
          orderSupCode.push(supportedApplianceList[i].applianceCode)
          break
        }
      }
      for (let j = 0; j < unsupportedApplianceList.length; j++) {
        if (item == unsupportedApplianceList[j].applianceCode) {
          orderUnSup.push(unsupportedApplianceList[j])
          orderUnSupCode.push(unsupportedApplianceList[j].applianceCode)
          break
        }
      }
    })
    noOrderSup = supportedApplianceList.filter((item) => {
      return !orderSupCode.includes(item.applianceCode)
    })
    noOrderUnSup = unsupportedApplianceList.filter((item) => {
      return !orderUnSupCode.includes(item.applianceCode)
    })
    supportedApplianceList = [...orderSup, ...noOrderSup]
    unsupportedApplianceList = [...orderUnSup, ...noOrderUnSup]
    console.log('当前家庭支持的设备=====', supportedApplianceList)
    console.log('当前家庭不支持的设备=====', unsupportedApplianceList)
    let aLLDeviceLength =
      supportedApplianceList.length + unsupportedApplianceList.length + this.data.boughtDevices.length
    let allUnsupportedApplianceList = unsupportedApplianceList
    homeStorage.setStorage({ homeId: currentHomeGroupId, name: 'supportedApplianceList', data: supportedApplianceList })
    homeStorage.setStorage({
      homeId: currentHomeGroupId,
      name: 'unsupportedApplianceList',
      data: allUnsupportedApplianceList,
    })
    const isExpandNoSupportDevice = this.checkIsExpandNoSupportDevice(supportedApplianceList)
    this.setData({
      isExpandNoSupportDevice,
      supportedApplianceList: supportedApplianceList,
      unsupportedApplianceList: allUnsupportedApplianceList,
      allDevice: aLLDeviceLength,
      isHourse: false,
    })
    this.getMainDevices(supportedApplianceList) //获取当前家庭的主设备
    console.log('优化 小木马消失 filterSupportedAppliance', dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss.S'))
  },
  //delete ?? 不懂
  getCurrentApplianceComponent() {
    let currentAppliance
    let currentApplianceIndex = this.data.currentApplianceIndex
    if (currentApplianceIndex < this.data.supportedApplianceList.length) {
      let currentApplianceCode = this.data.supportedApplianceList[currentApplianceIndex].applianceCode
      let items = this.selectAllComponents('.component' + currentApplianceCode)
      if (items && items.length > 0) {
        currentAppliance = items[0]
      }
    }
    return currentAppliance
  },
  //循环拉取确权状态
  async getIntervalBatchAuthList(currentFamilyDeviceList) {
    let applianceCodeList = currentFamilyDeviceList.map((applianceItem) => {
      return applianceItem.applianceCode
    })
    //同app逻辑，每次间隔60秒去获取确权状态
    if (app.globalData.bathAuthTimer) {
      clearInterval(app.globalData.bathAuthTimer)
    }
    let _this = this
    await this.getBatchAuthList(applianceCodeList)
    app.globalData.bathAuthTimer = setInterval(() => {
      _this.getBatchAuthList(applianceCodeList)
    }, 60000)
  },
  //获取当前设备是否需要确权
  isNeedAuthCheck(batchAuthList, applianceCode) {
    //使用map数据结构进行映射存储
    let map = new Map()
    batchAuthList.map((authItem) => {
      if (authItem.status == 1 || authItem.status == 2) {
        map.set(authItem.applianceCode, true)
      } else {
        map.set(authItem.applianceCode, false)
      }
    })
    return map.get(Number(applianceCode))
  },
  //跳转插件是需要重新判断确权0，1，2
  isNeedPluginAuthCheck(batchAuthList, applianceCode) {
    //使用map数据结构进行映射存储
    let map = new Map()
    batchAuthList.map((authItem) => {
      map.set(authItem.applianceCode, authItem.status)
    })
    return map.get(Number(applianceCode))
  },

  init(selectIndex = null) {
    console.log('优化 init start', dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss.S'))
    // 1.获取当前家庭
    this.data.uid = app.globalData.userData.uid
    //getApp().globalData.gloabalWebSocket && this.receiveSocketData()
    wx.showNavigationBarLoading()
    //获取设备icon列表
    let homeList = this.getHomeGrouplistService() // 1.获取当前家庭
    let apiArr = [homeList]
    if (this.nfcFilterAction(app.globalData.options)) {
      //关闭自发现
      this.setData({
        isShowProductDialog: false,
      })
      let getNfcDeviceDetail = this.getNfcDeviceDetail(app.globalData.options)
      apiArr = [homeList, getNfcDeviceDetail]
    }

    if (app.globalData.getBlackWhiteListError) {
      this.setData({
        isHourse: false,
        homeInfoFailFlag: true,
      })
      return
    }
    Promise.all(apiArr)
      .then((res) => {
        console.log('优化 init all then', dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss.S'))
        wx.stopPullDownRefresh()
        wx.hideNavigationBarLoading()
        const homeList = res[0]
        let currentHomeGroupIndex = this.getCurrentHomeGroupIndex(selectIndex) //获取默认家庭
        let currentHomeInfo = homeList[currentHomeGroupIndex] // 当前家庭信息
        const homeManage = this.selectComponent('#home-manage')
        this.data.homeList = homeList
        this.data.currentHomeInfo = currentHomeInfo
        //获取家庭主的家庭ID，用于邀请入家庭获取邀请码用
        this.getHomeOwnerGroupId()
        // todo:Yoram930 屏蔽首页自发现功能
        // if (app.globalData.ifAutoDiscover) {
        //   app.globalData.ifAutoDiscover = false
        //   if (this.data.currentHomeInfo.roleId !== '1003') {
        //     this.startAutoDiscover() // 启动自发现
        //   }
        // }
        //2.切换到当前家庭
        this.updateHomeGroup(currentHomeGroupIndex, currentHomeInfo.homegroupId)
        wx.nextTick(() => {
          indexViewBurialPoint({
            familyId: currentHomeInfo.homegroupId,
            familyName: currentHomeInfo.name,
            tabName: '设备',
            redDot: homeManage?.data?.showHomeTitleRedDot ? 1 : 0,
          })
        })
      })
      .catch((e) => {
        trackLoaded('page_loaded_event', 'horseHide')
        console.log('小木马消失4', e, parseInt(Date.now()))
        WX_LOG.warn('index init promise catch4', e)
        const data = e && e.data
        const isLogout = data && data.code === 40002
        this.setData({
          isLogon: !isLogout,
          isHourse: false,
          homeInfoFailFlag: true,
        })
      })
    //获取当前用户下的空调设备
    this.getUserTypeDevice('0xAC').then((res) => {
      app.globalData.curUserMatchNetAcDevices = res.appliance
      app.globalData.curUserBluetoothAcDevices = res.bluetooth
      console.log('获取当前用户下的配网绑定空调设备', app.globalData.curUserMatchNetAcDevices)
      console.log('获取当前用户下的蓝牙直连空调设备', app.globalData.curUserBluetoothAcDevices)
    })
  },
  //获取家庭主的家庭ID，用于邀请入家庭获取邀请码用
  getHomeOwnerGroupId() {
    for (let i = 0; i < this.data.homeList.length; i++) {
      if (this.data.homeList[i].createUserUid == this.data.uid) {
        this.data.homeOwnerGroupId = this.data.homeList[i].homegroupId
        break
      }
    }
  },
  // 获取当前家庭index
  getCurrentHomeGroupIndex(selectIndex) {
    let currentHomeGroupIndex = 0
    if (selectIndex !== null) {
      currentHomeGroupIndex = selectIndex
    } else {
      currentHomeGroupIndex = this.data.homeList.findIndex((item) => {
        return item.isDefault == 1
      })
    }

    if (currentHomeGroupIndex < 0) {
      currentHomeGroupIndex = 0
    }
    return currentHomeGroupIndex
  },
  /**
   * 获取邀请码
   */
  getInvitationCode(homeGroupId) {
    return new Promise((resolve, reject) => {
      let reqData = {
        reqId: getReqId(),
        stamp: getStamp(),
        homegroupId: homeGroupId || this.data.homeOwnerGroupId || '',
      }
      requestService.request('share', reqData).then(
        (resp) => {
          resolve(resp.data.data || {})
        },
        (error) => {
          reject(error)
        }
      )
    })
  },
  /**
   * 点击事件埋点
   */
  clickBurdPoint(clickType) {
    // wx.reportAnalytics('count_click_list', {
    // click_type: clickType,
    // click_time: formatTime(new Date()),
    // })
  },
  // 批量添加设备卡片
  addDeviceCardBatch() {
    if (this.data.isActionPlugin) {
      const supportedApplianceList = this.data.supportedApplianceList
      const unsupportedApplianceList = this.data.unsupportedApplianceList
      wxList
        .batchAddDeviceCard_step1()
        .then((res) => {
          this.WorkerPostMessage(res, supportedApplianceList, unsupportedApplianceList)
          this.setDeviceCardTipsShow('confirm')
        })
        .catch((e) => {
          console.log(e, 'actionWxDevicePanelBatch e')
          const errMsg = e?.errMsg
          if (errMsg.includes('cancel') || errMsg.includes('deny')) {
            this.setDeviceCardTipsShow('cancel')
          }
        })
      rangersBurialPoint('content_exposure_event', {
        page_id: 'page_home',
        page_name: '首页',
        page_path: getCurrentPages()[0].route,
        module: '首页',
        page_module: '首页',
        object_type: '批量添加设备卡片',
        object_id: '',
        object_name: '',
        event_name: 'content_exposure_event',
      })
    }
  },
  WorkerPostMessage(wxDevicePanelList, supportedApplianceList, unsupportedApplianceList) {
    app?.globalData?.worker?.postMessage({
      wxDevicePanelList,
      supportedApplianceList,
      unsupportedApplianceList,
    })
  },
  WorkerOnMessage() {
    app?.globalData?.worker?.onMessage(function (res) {
      console.log(res, 'worker onmessage 主线程')
      const uploadList = res?.uploadList // 批量添加的设备列表
      if (uploadList?.length) {
        wxList.batchAddDeviceCard_step2(uploadList)
      }
    })
  },
  // 控制设备卡片设置提示是否展示 actionType 0 拒绝 1  允许
  setDeviceCardTipsShow(actionType) {
    const context = this
    wx.getStorage({
      key: 'HAS_AUTH_BATCH_ADD_DEVICE_CARD',
      complete(res) {
        console.log(res, 'addDeviceCardBatch complete')
        const HAS_AUTH_BATCH_ADD_DEVICE_CARD = res?.data
        console.log(!HAS_AUTH_BATCH_ADD_DEVICE_CARD, !context.data.deviceCardIsShow, 'addDeviceCardBatch')
        if (!HAS_AUTH_BATCH_ADD_DEVICE_CARD && !context.data.deviceCardIsShow) {
          context.setData({
            deviceCardIsShow: true,
          })
          clickEventTracking('user_behavior_event', 'clickCancelTrack', {
            page_id: 'page_home',
            page_name: '首页',
            module: '首页',
            page_module: '设备卡片',
            widget_id: actionType === 'cancel' ? 'click_btn_refuse' : 'click_btn_allow',
            widget_name: actionType === 'confirm' ? '拒绝' : '允许',
          })
          wx.setStorage({
            key: 'HAS_AUTH_BATCH_ADD_DEVICE_CARD',
            data: true,
          })
        }
      },
    })
  },
  onLoad(options) {
    console.error('版本号：202408309591')
    //处理websocket相关逻辑
    console.log('优化 onload', dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss.S'))
    trackLoaded('page_loaded_event', 'pageOnLoad')
    //this.initPushData()
    currentPageOptions = options
    var self = this
    app.globalData.invitationCode =
      app.globalData.invitationCode === null || app.globalData.invitationCode === undefined
        ? options.invitationCode
        : app.globalData.invitationCode
    self.data.gdt_vid = options.gdt_vid || (options.query && options.query.gdt_vid) || ''
    getWxSystemInfo((res) => {
      this.setData({
        isIpx: res && res.safeArea.top > 20 ? true : false,
      })
    })
    await this.getIotDeviceV3()
    this.setData({
      isNfcFirstInit: true,
    })
    if (app.globalData.isLogon) {
      this.initPushData()
      //this.scanCodeJoinFamily(app.globalData.isLogon)
      //this.joinFamilyFromShare() // 通过邀请加入家庭
      if (app.globalData.uid) {
        this.setData({
          uid: app.globalData.uid,
        })
        app.globalData.uid = ''
      }
    } else {
      try {
        this.initPushData()
        const isAutoLogin = wx.getStorageSync('ISAUTOLOGIN')
        // if (isAutoLogin) {
        // app.watchLogin(() => {
        // this.scanCodeJoinFamily(app.globalData.isLogon) //扫码加入家庭
        // this.joinFamilyFromShare() // 通过邀请加入家庭
        // if (app.globalData.uid) {
        // this.setData({
        // uid: app.globalData.uid,
        // })
        // app.globalData.uid = ''
        // }
        // }, this)
        // }
      } catch (e) {
        console.log(e)
      }
    }
    //app.createNewWorker({ url: 'workers/wx-device-card.js', useExperimentalWorker: false })
    //this.WorkerOnMessage()
    //是否有权限添加设备 埋点
    clickEventTracking('user_behavior_event', 'isSupportAddDevice', {
      page_id: 'page_home',
      page_name: '小程序首页',
      module: 'appliance',
      widget_id: 'api_support_show_add_device_bth',
      widget_name: '是否有权限展示添加设备入口',
      page_path: getFullPageUrl(),
      ext_info: {
        // res: app.globalData.isCanAddDevice,
        res: true,
        if_sys: 1, //本需求固定为1
      },
    })
  },

  //获取当前用户下的空调设备
  getUserTypeDevice(type) {
    //type:"0xAC"
    let data = {
      reqId: getReqId(),
      stamp: getStamp(),
      applianceType: type,
    }
    console.log('获取当前用户下的空调设备', data)
    return new Promise((resolve, reject) => {
      requestService
        .request('deviceFilterList', data)
        .then((res) => {
          resolve(res.data.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  //点击非智能设备埋点
  toReport(ids, modal, name) {
    clickEventTracking('user_behavior_event', 'noSmartDevice', {
      object_type: modal,
      object_name: name,
      ext_info: {
        homegroup_id: ids,
      },
    })
  },
  async goToPlugin(e) {
    console.log('小木马跳插件开始', parseInt(Date.now()))
    let start = new Date()
    let self = this
    if (!this.data.isGoToPlugin) return
    this.data.isGoToPlugin = false
    let type = e.currentTarget.dataset.type && e.currentTarget.dataset.type != null ? e.currentTarget.dataset.type : ''
    let applianceCode = e.currentTarget.dataset.applianceCode
    let currDeviceInfo = e?.currentTarget?.dataset?.all
    let isSupperCurrentDevice = e?.currentTarget?.dataset?.isSupport
    let from = e.currentTarget.dataset.from
    setPluginDeviceInfo(currDeviceInfo)
    console.log('currDeviceInfo', currDeviceInfo, e.currentTarget.dataset)
    if (from == 'plain') {
      clickOpenPluginBurialPoint({
        applianceCode: currDeviceInfo.applianceCode,
        homegroupId: currDeviceInfo.homegroupId,
        deviceName: currDeviceInfo.name,
        onlineStatus: currDeviceInfo.onlineStatus || '',
        pluginType: currDeviceInfo.type,
        sn8: currDeviceInfo.sn8,
      })
    } else {
      //物模型卡片点击埋点
      cardClickPluginBurialPoint({
        applianceCode: currDeviceInfo.applianceCode,
        deviceName: currDeviceInfo.name,
        onlineStatus: currDeviceInfo.onlineStatus || '',
        pluginType: currDeviceInfo.type,
        sn8: currDeviceInfo.sn8,
        ...currDeviceInfo,
        is_support_current_device: e.currentTarget.dataset.support === 'support' ? 1 : 0,
      })
    }
    let bindType = currDeviceInfo.bindType || ''
    let sn8 = currDeviceInfo.sn8
    let formatType = type.includes('0x') ? type.substr(2, 2) : type
    if (bindType == 3 && hasKey(bleAfterWifiDevices, formatType) && bleAfterWifiDevices[formatType].sn8.includes(sn8)) {
      //只做了遥控直连 暂不支持
      isSupperCurrentDevice = false
    }
    console.log('是否支持===', isSupperCurrentDevice)
    if (isSupperCurrentDevice) {
      try {
        if (isNeedCheckList.indexOf(formatType) == -1) {
          let batchAuthList = wx.getStorageSync('batchAuthList'),
            isAuth
          if (batchAuthList && batchAuthList.length > 0) {
            let checkAudthStatus = this.isNeedPluginAuthCheck(batchAuthList, applianceCode)
            //确权状态是0,1和2，需要重新掉接口判断
            isAuth = [0, 1, 2].includes(checkAudthStatus) ? await addDeviceSDK.checkDeviceAuth(applianceCode) : false
          } else {
            isAuth = await addDeviceSDK.checkDeviceAuth(applianceCode)
          }
          //let isAuth = await addDeviceSDK.checkDeviceAuth(applianceCode)
          if (isAuth) {
            app.addDeviceInfo.cloudBackDeviceInfo = currDeviceInfo
            app.addDeviceInfo.sn8 = sn8 //修改不按顺序确权获取不到确权指引的问题
            console.log('hahhah', app.addDeviceInfo.cloudBackDeviceInfo)
            wx.navigateTo({
              url: '/distribution-network/addDevice/pages/afterCheck/afterCheck',
              complete() {
                self.data.isGoToPlugin = true
                self.data.isActionPlugin = true
              },
            })
            console.log('跳插件前花费时长====', new Date() - start)
          } else {
            console.log(
              '跳转的插件路径：',
              getPluginUrl(getCommonType(type, currDeviceInfo), JSON.stringify(currDeviceInfo))
            )
            wx.navigateTo({
              // url:
              //   `/plugin/T${getCommonType(type)}/index/index?deviceInfo=` +
              //   encodeURIComponent(JSON.stringify(currDeviceInfo)),
              url: getPluginUrl(getCommonType(type, currDeviceInfo), JSON.stringify(currDeviceInfo)),
              complete() {
                self.data.isGoToPlugin = true
                self.data.isActionPlugin = true
              },
            })
          }
        } else {
          console.log(
            '跳转的插件路径：',
            getPluginUrl(getCommonType(type, currDeviceInfo), JSON.stringify(currDeviceInfo))
          )
          wx.navigateTo({
            // url:
            //   `/plugin/T${getCommonType(type)}/index/index?deviceInfo=` +
            //   encodeURIComponent(JSON.stringify(currDeviceInfo)),
            url: getPluginUrl(getCommonType(type, currDeviceInfo), JSON.stringify(currDeviceInfo)),
            complete() {
              self.data.isGoToPlugin = true
              self.data.isActionPlugin = true
            },
          })
        }
      } catch (error) {
        console.log('设备确权接口异常', error)
        self.data.isGoToPlugin = true
        showToast('打开失败,请稍后重试')
      }
    } else {
      console.log('小木马跳插件就绪2', parseInt(Date.now()))
      wx.navigateTo({
        url: '/pages/unSupportDevice/unSupportDevice?deviceInfo=' + encodeURIComponent(JSON.stringify(currDeviceInfo)),
        complete() {
          self.data.isGoToPlugin = true
          self.data.isActionPlugin = true
        },
      })
    }
  },
  //当前手机网络状态
  nowNetType() {
    return new Promise((resolve, reject) => {
      wx.getNetworkType({
        success(res) {
          console.log('网络提示zhucc=========================>', res)
          resolve(res.networkType)
        },
        fail(error) {
          console.log('获取当前网络状况错误=================>', error)
          reject(error)
        },
      })
    })
  },

  goTodownloadPage() {
    wx.navigateTo({
      url: '/pages/download/download?fm=' + 'index',
    })
  },

  // 美云销 广告新接口登录后空态banner
  getBannerAdvertisement() {
    let { isLogon } = app.globalData
    let params = {
      isLogon,
      headParams: {},
      restParams: {
        applicationCode: 'APP202105250001EXT', //新api	应用编码
        adPositionCode: 'LITEBANNER', //新api 广告位编码列表
        // "adPositionCodes":["LITEBANNER"],      //新api 广告位编码列表
      },
    }
    return new Promise((resolve) => {
      service.getAdvertise(params).then((res) => {
        this.setData({
          advertiseBarData: res.data.data.ads || [],
        })
        resolve(res.data.data.ads)
      })
    })
  },
  //扫码添加家庭，扫码配网
  goScanCode() {
    let showNotSupport = () => {
      Dialog.alert({
        zIndex: 10001,
        context: this,
        title: '此二维码不适用于“添加设备”',
        confirmButtonText: '我知道了',
      })
    }
    let justAppSupport = () => {
      Dialog.alert({
        zIndex: 10001,
        context: this,
        title: '该设备仅支持在美的美居App添加',
        confirmButtonText: '我知道了',
      })
    }
    //执行二维码扫码动作
    actionScanResultIndex(
      showNotSupport,
      justAppSupport,
      this.actionGoNetwork,
      this.getDeviceApImgAndName,
      this.joinfamily,
      this.gotoScanCodeResult
    )
  },
  //扫码加入家庭
  joinfamily(result) {
    let that = this
    service
      .memberScancode(result)
      .then((res) => {
        Toast({ context: this, position: 'bottom', message: '加入家庭成功' })
        console.log(res)
        let homeId = res.homegroupId
        getApp().globalData.ifRefreshHomeList = true
        that.getHomeGrouplistService().then((data) => {
          data.forEach((item, index) => {
            if (item.homegroupId == homeId) {
              that.init(index)
            }
          })
        })
      })
      .catch((error) => {
        console.log(error)
        var code = error.data.code
        var label = 'code未知系统错误'
        label = scodeResonse(code)
        Toast({ context: this, position: 'bottom', message: label })
      })
  },
  //不支持配网和家庭时 直接展示跳转链接
  gotoScanCodeResult(result) {
    result = encodeURIComponent(result)
    wx.navigateTo({
      url: `${scanCodeResult}?result=${result}`,
    })
  },
  //添加设备
  async goAddDeviceJia() {
    // 防爆击处理
    if (!this.data.isGoToScan) return
    this.data.isGoToScan = false
    app.globalData.deviceSessionId = creatDeviceSessionId(app.globalData.userData.uid)
    clickEventTracking('user_behavior_event', 'goAddDeviceJia', {
      device_info: {
        device_session_id: app.globalData.deviceSessionId, //一次配网事件标识
        sn: '', //sn码
        sn8: '', //sn8码
        a0: '', //a0码
        widget_cate: '', //设备品类
        wifi_model_version: '', //模组wifi版本
        link_type: '', //连接方式 bluetooth/ap/...
        iot_device_id: '', //设备id
      },
      ext_info: {
        // is_first_add_device: app.globalData.isCanAddDevice ? 1 : 0,
        // if_support_add_device: app.globalData.isCanAddDevice ? 1 : 0,
        is_first_add_device: 1,
        if_support_add_device: 1,
      },
    })
    getApp().checkNetLocal()
    const checkIsHomeGroupExist = await this.checkHomeGroupStatus()
    if (!checkIsHomeGroupExist) {
      this.data.isGoToScan = true
      return
    }
    const hasFamilyPermission = checkFamilyPermission({
      currentHomeInfo: this.data.currentHomeInfo,
      permissionText: familyPermissionText.addDevice,
    })
    if (!hasFamilyPermission) {
      checkFamilyPermissionAddBurialPoint()
      this.data.isGoToScan = true
      return
    }
    // if (!this.data.isCanAddDevice) {
    //   console.log('当前用户不可进入配网')
    //   wx.navigateTo({
    //     url: download + '?fm=addDevice',
    //   })
    //   return //屏蔽配网入口
    // }
    this.addDevice(this.data.currentHomeInfo.homegroupId, this.data.currentHomeInfo.name)
    setTimeout(() => {
      this.data.isGoToScan = true
    }, 2000)
  },
  //同意隐私协议
  handleAgree() {
    if (this.data.fromPrivacy) {
      this.locationAuthorize() //判断用户是否授权小程序使用位置权限
      this.bluetoothAuthorize() //判断用户是否授权小程序使用蓝牙权限
    }
  },
  //拒绝隐私协议
  handleDisagree() {
    this.data.fromPrivacy = false
  },
  // 与goAddDeviceJia逻辑重复
  async goAddDevice() {
    console.log('走的是goAddDevice=============')
    // if (!this.data.isCanAddDevice) {
    //   console.log('当前用户不可进入配网')
    //   return //屏蔽配网入口
    // }
    await this.nowNetType()
      .then((networkType) => {
        if (networkType == 'none') {
          showToast('网络不佳，请检查网络后重试')
          this.data.isGoToScan = true
        }
      })
      .catch((err) => {
        showToast('网络不佳，请检查网络后重试')
        this.data.isGoToScan = true
      })
    app.globalData.deviceSessionId = creatDeviceSessionId(app.globalData.userData.uid)
    clickEventTracking('user_behavior_event', 'goAddDevice', {
      device_info: {
        device_session_id: app.globalData.deviceSessionId, //一次配网事件标识
        sn: '', //sn码
        sn8: '', //sn8码
        a0: '', //a0码
        widget_cate: '', //设备品类
        wifi_model_version: '', //模组wifi版本
        link_type: '', //连接方式 bluetooth/ap/...
        iot_device_id: '', //设备id
      },
    })
    this.addDevice(this.data.currentHomeInfo.homegroupId, this.data.currentHomeInfo.name)
  },
  // 跳到扫码添加设备页
  async addDevice(id, homeName) {
    const this_ = this
    getApp().setActionCheckingLog('addDevice', '小程序首页添加设备按钮点击事件')
    if (this.data.addDeviceClickFlag) {
      console.log('[防重终止]')
      return
    }
    this.data.addDeviceClickFlag = true
    // 调试代码
    // 蓝牙权限判断
    // wx.openBluetoothAdapter({
    // success: (res) => {
    //     console.log('lmn>>> 初始化蓝牙模块成功', res)
    // },
    // fail: (err) => {
    //     console.log('lmn>>> 初始化蓝牙模块失败', err)
    // }
    // })
    // // 地理位置权限判断
    // wx.getLocation({
    //     type: 'wgs84', //返回可以用于wx.openLocation的经纬度
    //     success(res) {
    //         console.log('lmn>>> 初始化地址模块成功', res)
    //         wx.openLocation()
    //     },
    //     fail: (err) => {
    //         console.log('lmn>>> 初始化地址模块失败', err)
    //     }
    //     })
    //首页不需要再判断蓝牙和位置
    //判断位置和蓝牙权限以及是否开启
    // if (!(await this.checkLocationAndBluetooth(true, false, true, true))) {
    //   return
    // }
    // let locationRes
    // let blueRes
    // let privacyRes
    // try {
    // locationRes = await checkPermission.loaction(true)
    // blueRes = await checkPermission.blue(true)
    // privacyRes = await checkPermission.privacy()
    // } catch (error) {
    // this.data.addDeviceClickFlag = false
    // Dialog.alert({
    // zIndex: 10001,
    // context: this,
    // message: '微信系统出错，请尝试点击右上角“...” - “重新进入小程序”',
    // })
    // console.log(error, '[loactionRes blueRes]err addDevice')
    // }
    // console.log('[privacyRes] addDevice', privacyRes)
    // console.log('[loactionRes] addDevice', locationRes)
    // console.log('[blueRes] addDevice', blueRes)
    // if (privacyRes) {
    // this.setData({
    // fromPrivacy: true,
    // showPrivacy: true,
    // })
    // this.data.addDeviceClickFlag = false
    // return
    // }
    // if (!locationRes.isCanLocation) {
    // Dialog.confirm({
    // zIndex: 10001,
    // context: this,
    // title: '请开启位置权限',
    // message: locationRes.permissionTextAll,
    // confirmButtonText: '查看指引',
    // cancelButtonText: '好的',
    // messageAlign: 'left',
    // }).then((res) => {
    // const action = res?.action
    // if (action === 'confirm') {
    // wx.navigateTo({
    // url: paths.locationGuide + `?permissionTypeList=${JSON.stringify(locationRes.permissionTypeList)}`,
    // })
    // }
    // })
    // this.checkLocationAndBluetoothBurialPoint('请开启位置权限', locationRes.permissionTextAll)
    // this.data.addDeviceClickFlag = false
    // return
    // }
    // if (!blueRes.isCanBlue) {
    // Dialog.confirm({
    // zIndex: 10001,
    // context: this,
    // title: '请开启蓝牙权限',
    // message: blueRes.permissionTextAll,
    // confirmButtonText: '查看指引',
    // cancelButtonText: '好的',
    // messageAlign: 'left',
    // }).then((res) => {
    // const action = res?.action
    // if (action === 'confirm') {
    // wx.navigateTo({
    // url: paths.blueGuide + `?permissionTypeList=${JSON.stringify(blueRes.permissionTypeList)}`,
    // })
    // }
    // })
    // this.checkLocationAndBluetoothBurialPoint('请开启蓝牙权限', blueRes.permissionTextAll)
    // this.data.addDeviceClickFlag = false
    // return
    // }
    // setTimeout(() => {
    //   this.data.addDeviceClickFlag = false
    // }, 2000)
    forceUpdateWhenOnshow = true
    console.log('id:', id)
    console.log('homeName:', homeName)
    wx.navigateTo({
      // url: scanDevice,
      url: `${scanDevice}?id=${id}&homeName=${homeName}`,
      complete() {
        this_.data.addDeviceClickFlag = false
      },
    })
  },

  // 确认授权权限
  async makeSure(e) {
    this.locationAndBluetoothClickTrack(e.detail.flag) //位置和蓝牙弹窗提示点击埋点
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
  closeDeviceDialog() {
    getApp().setActionCheckingLog('触发关闭首页设备自发现弹窗')
    this.setData({
      isShowProductDialog: false,
    })
  },
  // devicesListDialog埋点
  devicesListDialog(e) {
    const val = e.detail
    if (val) {
      app.globalData.deviceSessionId = creatDeviceSessionId(app.globalData.userData.uid)
      clickEventTracking('user_page_view', 'devicesListDialog', {
        device_info: {
          device_session_id: app.globalData.deviceSessionId, //一次配网事件标识
          sn: '', //sn码
          sn8: '', //sn8码
          a0: '', //a0码
          widget_cate: '', //设备品类
          wifi_model_version: '', //模组wifi版本
          link_type: 'bluetooth', //连接方式 bluetooth/ap/...
          iot_device_id: '', //设备id
        },
      })
    }
  },
  // 校验是否支持配网
  checkIfGoNetwork(addDeviceInfo) {
    return addDeviceInfo.isSupport ? true : false
  },
  // 去配网
  goNetwork(e) {
    let self = this
    getApp().setActionCheckingLog('goNetwork', `${this.data.clickFLag}`)

    if (this.data.clickFLag) {
      return
    }
    this.setData({
      clickFLag: true,
    })
    const item = e.detail
    getApp().setActionCheckingLog('goNetwork', '小程序首页自发现弹窗点击发现设备事件')
    clickEventTracking('user_behavior_event', 'goNetwork', {
      page_name: '首页自发现弹窗',
      page_id: 'popups_home_found',
      module: 'appliance',
      device_info: {
        device_session_id: app.globalData.deviceSessionId, //一次配网事件标识
        sn: '', //sn码
        sn8: item.sn8, //sn8码
        a0: '', //a0码
        widget_cate: item.type, //设备品类
        wifi_model_version: item.moduleVersion, //模组wifi版本
        link_type: '', //连接方式 bluetooth/ap/...
        iot_device_id: '', //设备id
      },
      ext_info: {
        is_near: item.isSameSn8Nearest ? 1 : 0,
      },
    })
    // if (!this.checkWxVersion()) {
    //   Dialog.alert({
    //     zIndex: 10001,
    //     context: this,
    //     message: '你的微信版本过低，请升级至最新版本后再试',
    //     confirmButtonText: '我知道了',
    //   })
    //   getApp().setMethodFailedCheckingLog('goNetwork', '当前微信版本过低不通过')
    //   self.data.clickFLag = false
    //   return
    // }
    if (!this.checkIfGoNetwork(item)) {
      getApp().setMethodFailedCheckingLog('goNetwork', '选取的是不支持配网设备')
      self.data.clickFLag = false
      return
    }
    // this.setData({
    //   isShowProductDialog: false,
    // })
    self.data.clickFLag = false
    this.actionGoNetwork(item)
  },
  // 去登录
  goLogin: function () {
    if (wx.getStorageSync('fromWetChat')) {
      wx.navigateTo({
        url: '../login/login?fms=1',
      })
      this.clickViewBtn()
    } else {
      wx.navigateTo({
        url: '../login/login',
      })
    }
  },
  // 来自中间页，点击登录埋点
  clickViewBtn() {
    clickEventTracking('user_behavior_event', '', {
      page_path: getFullPageUrl(),
      module: 'appliance',
      page_id: 'page_middle_login',
      page_name: '中间页跳转后登录页',
      object_type: '',
      object_id: '',
      object_name: '',
      widget_id: 'click_to_login',
      widget_name: '前往登录',
      ext_info: {
        source: 'wechat_scan',
      },
    })
  },
  /**
   * 启动自发现
   */
  startAutoDiscover() {
    const autoDiscoverInterval = setInterval(() => {
      if (app.globalData.hasAuthLocation && app.globalData.hasAuthBluetooth) {
        // 已设置授权
        clearInterval(autoDiscoverInterval)
        if (getFullPageUrl().includes('/index/index') && this.data.isShowProductDialog) {
          this.checkSystemInfo(false).then(() => {
            if (
              !this.data.isBluetoothMixinNotOpenWxLocation &&
              !this.data.isBluetoothMixinNotOpen &&
              this.data.isBluetoothMixinHasAuthBluetooth
            ) {
              // 蓝牙自发现
              this.openBluetoothAdapter(1)
            }

            if (!this.data.isBluetoothMixinNotOpenWxLocation) {
              // WiFi自发现
              this.getWifiList(1)
            }
          })
        }
      }
    }, 500)
  },
  //邀请家庭接口 home-manage
  invitedLoginFamily(resp) {
    Dialog.alert({
      zIndex: 10001,
      context: this,
      message: resp.tips,
      confirmButtonText: '我知道了',
    })
    if (resp.code == 0) {
      this.intoFamilyResultBurialPointFun(resp)
      this.init()
    }
    app.globalData.invitationCode = ''
  },
  //邀请家庭 verifyInviteCodeFun失败错误处理 home-manage
  invitedFamilyFail(response) {
    if (response.data.code == 1217 || response.data.code == 1220 || response.data.code == 1219) {
      //the invitationCode is invalid
      if (response.data.code !== 1217) {
        this.intoFamilyResultBurialPointFun(response)
      }
      joinResultBurialPoint({
        code: 1217,
        msg: '邀请码失效',
        channel: app.globalData.share ? 'APP' : '小程序',
      })
      this.setData({
        isBluetoothMixinNotOpen: false,
      })
      let DialogObj = {
        zIndex: 10001,
        context: this,
        message: requestService.getErrorMessage(response.data.code),
        confirmButtonText: '我知道了',
      }
      if (response.data.code === 1220 || response.data.code === 1219) {
        DialogObj.confirmOpenType = 'exit'
        DialogObj.confirmButtonTarget = 'miniProgram'
      }
      Dialog.alert(DialogObj)
      this.getTabBar().setData({
        isShow: false,
      })
      app.globalData.isLogon = false
      app.globalData.invitationCode = ''
      this.setData({
        isLogon: false,
      })
    } else {
      app.globalData.isLogon = false
      this.setData({
        isLogon: false,
      })
    }
  },
  // 加入家庭结果弹窗埋点 home-manage
  intoFamilyResultBurialPointFun(res) {
    let invitedCode = app.globalData.invitationCode
    let tip = res.tips ? res.tips : requestService.getErrorMessage(res.data.code)
    let code = res.code == 0 ? res.code : res.data.code
    let param = {
      invitedCode: invitedCode,
      tip: tip,
    }
    let relation = [
      {
        page_id: 'popups_join_family_success',
        page_name: '你已成功加入家庭弹窗',
        code: 0,
      },
      {
        page_id: 'popups_join_family_time_out',
        page_name: '该加入家庭邀请已过期弹窗',
        code: 1220,
      },
      {
        page_id: 'popups_join_family_occupied',
        page_name: '该加入家庭邀请已被其它用户使用弹窗',
        code: 1219,
      },
    ]
    for (let i = 0; i < relation.length; i++) {
      if (Number(code) === relation[i].code) {
        param.page_id = relation[i].page_id
        param.page_name = relation[i].page_name
      }
    }
    intoFamilyResultBurialPoint(param)
  },
  // 小程序扫app生成的二维码加入家庭
  scanCodeJoinFamily(isLogin) {
    if (!isLogin || this.data.hasScand) return
    this.data.hasScand = true
    const scanCodeUrlData = currentPageOptions && currentPageOptions.q
    console.log('面对面扫一扫 scanCodeJoinFamily scanCodeUrlData:', scanCodeUrlData)
    var defineOptions = '' //解析后的参数
    defineOptions = decodeURIComponent(scanCodeUrlData) // 处理options 扫码进入
    if (!scanCodeUrlData) {
      return false
    }

    let params = {
      scancodeUrl: defineOptions,
      reqId: getReqId(),
      stamp: getStamp(),
    }
    requestService.request('scanCodeJoinFamily', params).then(
      (res) => {
        Dialog.alert({
          zIndex: 10001,
          context: this,
          title: '加入家庭成功',
          confirmButtonColor: '#267aff',
        })
        let homeId = res.data.data.homegroupId
        // 加入成功后先更新家庭列表再自动切换到扫码加入的家庭
        this.getHomeGrouplistService().then((data) => {
          // eslint-disable-next-line no-unused-vars
          const currentIndex = data.forEach((item, index) => {
            if (item.homegroupId == homeId) {
              this.init(index)
              return index
            }
          })
        })
      },
      (error) => {
        console.log('0000000000000000000扫码加入家庭 error', error)
        var code = error.data.code
        var label = 'code未知系统错误'
        label = scodeResonse(code)
        Dialog.alert({
          zIndex: 10001,
          context: this,
          message: `扫码加入家庭失败，${label}`,
          confirmButtonColor: '#267aff',
        })
      }
    )
  },
  //处理nfc 过来的数据
  actionFromNfc() {
    let self = this
    let options = app.globalData.options
    if (app.globalData.isLogon && this.nfcFilterAction(options)) {
      this.closeDeviceDialog()
      this.actionNfcGo(this.data.nfcData)
    } else if (!app.globalData.isLogon && this.nfcFilterAction(options)) {
      this.closeDeviceDialog()
      this.goLogin()
      setTimeout(() => {
        trackLoaded('page_loaded_event', 'horseHide')
        console.log('小木马消失5', parseInt(Date.now()))
        self.setData({
          isHourse: false,
        })
      }, 1000)
    }
  },
  //校验是否执行nfc的业务逻辑
  nfcFilterAction(options) {
    if (!options) return false
    if (isEmptyObject(options)) return false
    //options.scene == 1065 &&
    if (options.scene == 1065 && hasKey(options, 'query')) {
      return hasKey(options.query, 'rc') && hasKey(options.query, 'nfcid') ? true : false
    }
    return false
  },
  //根据nfc的数据获取设备的详情
  getNfcDeviceDetail(options) {
    return new Promise((resolve, reject) => {
      service
        .fromNfcAction(options)
        .then((res) => {
          const resp = res.data.data
          this.setData({
            nfcData: resp || {},
          })
          resolve(res)
        })
        .catch((err) => {
          if (!hasKey(err, 'data')) reject(false)
          if (!hasKey(err.data, 'code')) reject(false)
          //1405 - sn not exist
          if (err.data.code == 1405) {
            wx.showToast({
              title: err.data.msg,
              icon: 'none',
            })
            reject(false)
          }
          console.log('nfc 获取设备详情返回 err', err)
        })
    })
  },
  //重置设备
  resetDevice() {
    this.setDialogStatus(false)
    const hasFamilyPermission = checkFamilyPermission({
      currentHomeInfo: this.data.currentHomeInfo,
      permissionText: familyPermissionText.addDevice,
    })
    if (!hasFamilyPermission) {
      checkFamilyPermissionAddBurialPoint()
      return
    }
    this.nfcGoNetwork()
  },
  //申请加入
  applyJoin() {
    const data = {
      uid: app.globalData.userData.uid || '',
      homegroupId: this.data.nfcData.homegroupId || '',
    }
    if (this.data.applyJoinLoading) return
    this.data.applyJoinLoading = true
    service
      .joinDend(data)
      .then(() => {
        this.data.applyJoinLoading = false
        wx.showToast({
          title: '申请已发送至美居App',
          icon: 'none',
        })
        this.setDialogStatus(false)
      })
      .catch(() => {
        this.data.applyJoinLoading = false
        wx.showToast({
          title: '申请加入家庭组消息发送失败',
          icon: 'none',
        })
      })
  },
  //关闭弹窗
  closeApplyForFamilyDialog() {
    this.setDialogStatus(false)
  },
  //设置弹窗状态
  setDialogStatus(status) {
    app.globalData.options = {}
    this.setData({
      isShowApplyForFamily: status,
    })
  },
  //获取到设备的详细以后跳转交互
  actionNfcGo(data) {
    if (!data) return
    let self = this
    let category = data.type
    const sn = getDeviceSn(data.sn)
    const sn8 = getDeviceSn8(sn)
    let type = `0x${app.globalData.options.query.type.toUpperCase()}`
    const options = app.globalData.options.query
    let { nfcData } = this.data
    category = type || category
    nfcData['sn8'] = sn8
    nfcData['type'] = category
    nfcData['sn'] = sn
    nfcData['mode'] = options.mode
    this.setData({
      nfcData,
    })
    //小程序是不是支持该设备插件控制
    if (!isSupportPlugin(category, sn8, sn8, '0')) {
      trackLoaded('page_loaded_event', 'horseHide')
      console.log('小木马消失6', parseInt(Date.now()))
      this.setData({
        isHourse: false,
      })
      Dialog.alert({
        zIndex: 10001,
        context: this,
        title: '该设备仅支持在美的美居App添加',
        confirmButtonText: '我知道了',
      })
      app.globalData.options = {}
    } else if (data.bindStatus === '1') {
      //0：未绑定或已解绑），1：绑定家庭；
      if (this.checkIfExist(data)) {
        setTimeout(() => {
          trackLoaded('page_loaded_event', 'horseHide')
          console.log('小木马消失6', parseInt(Date.now()))
          self.setData({
            isHourse: false,
          })
        }, 1000)
        this.goTargetPlugin(data)
      } else {
        trackLoaded('page_loaded_event', 'horseHide')
        console.log('小木马消失7', parseInt(Date.now()))
        this.setData({
          isHourse: false,
        })
        this.setDialogStatus(true)
      }
    } else if (data.bindStatus === '0') {
      trackLoaded('page_loaded_event', 'horseHide')
      console.log('小木马消失8', parseInt(Date.now()))
      this.setData({
        isHourse: false,
      })
      this.actionNewDeviceToBind()
      app.globalData.options = {}
      // this.setDialogStatus(true)
    }
  },
  //校验此设备是否已经在家庭下面
  checkIfExist(data) {
    const homeList = app.globalData.homeGrounpList || []
    if (isEmptyObject(homeList)) return false
    return homeList.some((item) => {
      return data.homegroupId == item.homegroupId
    })
  },
  //nfc 跳目标插件页
  goTargetPlugin(data) {
    const category = data.type
    const currDeviceInfo = JSON.stringify(data)
    app.globalData.options = {}
    setPluginDeviceInfo(data)
    app.globalData.isHomeNeedUpdata = false //判断show进入首页是否需要init，过滤查看非智跟智能详情
    wx.navigateTo({
      url: getPluginUrl(getCommonType(category, currDeviceInfo), currDeviceInfo),
      //url: `/plugin/T${getCommonType(category)}/index/index?deviceInfo=` + encodeURIComponent(currDeviceInfo),
    })
  },
  //新设备绑定
  actionNewDeviceToBind() {
    let self = this
    Dialog.confirm({
      zIndex: 10001,
      title: '这是一台新设备，请绑定后再使用',
      confirmButtonText: '绑定设备',
      confirmButtonColor: '#267aff',
      cancelButtonColor: '#000000',
    }).then(() => {
      const hasFamilyPermission = checkFamilyPermission({
        currentHomeInfo: self.data.currentHomeInfo,
        permissionText: familyPermissionText.addDevice,
      })
      if (!hasFamilyPermission) {
        checkFamilyPermissionAddBurialPoint()
        return
      }
      self.nfcGoNetwork()
    })
  },
  // 家庭加载失败 重新加载首页
  async initHomeInfo() {
    await app.getBlackWhiteList({ path: 'pages/index/index' })
    app.checkGlobalExpiration().then(() => {
      const isLogin = app.globalData.isLogon
      if (isLogin) {
        this.setData({
          isHourse: true,
          homeInfoFailFlag: false,
        })
        this.init()
      } else {
        this.setData({
          isHourse: false,
          isLogon: false,
          homeInfoFailFlag: false,
        })
      }
    })
  },
  //nfc 去配网
  nfcGoNetwork() {
    let item = this.data.nfcData
    let type = item['type'].includes('0x') ? item['type'].substr(2, 2) : item['type']
    item['type'] = type
    // if (!this.checkWxVersion()) {
    //   Dialog.alert({
    //     zIndex: 10001,
    //     context: this,
    //     message: '你的微信版本过低，请升级至最新版本后再试',
    //     confirmButtonText: '我知道了',
    //   })
    //   return
    // }
    let param = {
      category: type,
      code: item['sn8'],
      queryType: 2,
      stamp: getStamp(),
      reqId: getReqId(),
    }
    if (this.checkNBDevice(item)) return
    requestService
      .request('multiNetworkGuide', param)
      .then((res) => {
        let netWorking = resp.data.data.cableNetWorking ? 'cableNetWorking' : 'wifiNetWorking'
        let mode = res.data.data[netWorking].mainConnectinfoList[0].mode
        let guideInfo = res.data.data[netWorking].mainConnectinfoList
        item['mode'] = mode
        item['fm'] = 'nfc'
        item['category'] = type
        item['guideInfo'] = guideInfo
        this.actionGoNetwork(item)
      })
      .catch((err) => {
        console.log('error=====', err)
        if (err.data.code == 1) {
          wx.showToast({
            title: err.data.msg,
            icon: 'none',
          })
        }
      })
  },
  checkNBDevice(item) {
    if (item.mode == 8) {
      item['fm'] = 'nfc'
      item['category'] = item.type ? item.type.toUpperCase() : ''
      item['plainSn'] = item.sn
      this.actionGoNetwork(item)
      return true
    }
    return false
  },
  //显示已购待绑定设备卡片
  dealBoughtDevices(notActiveDevices, notInstallDevices) {
    const hasFamilyPermission = checkFamilyPermission({
      currentHomeInfo: this.data.currentHomeInfo,
      permissionText: null,
    })
    if (!hasFamilyPermission) {
      this.setData({
        boughtDevices: [],
      })
      return
    }
    // if (!app.globalData.isCanAddDevice) {
    //   console.log('该用户被屏蔽配网  已购卡片不展示')
    //   return
    // }
    const homegroupId = this.data.currentHomeGroupId
    if (shouldGetDeviceDataFromStorage && hasInitedHomeIdList.includes(homegroupId)) {
      const boughtDevices = homeStorage.getStorage({
        homeId: homegroupId,
        name: 'boughtDevices',
      })
      this.setData({
        boughtDevices,
      })
      setTimeout(() => {
        this.boughtDevicesTrack()
      }, 1000)
      return
    }
    let getIotDeviceV3 = this.data.sceneIconList
    notActiveDevices.forEach((item) => {
      item.isSupport = isSupportPlugin(item.applianceType, item.sn8, item.sn8, '0') //判断小程序里是否支持绑定设备
      item.category = item.applianceType.split('0x')[1]
      //获取设备品类对应的图片
      let applianceType = item.category
      let list = getIotDeviceV3[applianceType] || ''
      let keyName = item.sn8
      if (!list) {
        item.deviceImg = baseImgApi.url + 'scene/sence_img_lack.png'
        item.applianceName = ''
      } else {
        item.deviceImg = Object.keys(list).includes(keyName) ? list[keyName]['icon'] : list.common.icon
        item.applianceName = Object.keys(list).includes(keyName) ? list[keyName]['name'] : list.common.name
      }
      item.realSn = getDeviceSn(item.sn)
    })
    notInstallDevices.forEach((item) => {
      item.boughtType = 'notInstall'
      item.isSupport = true
      item.category = item.applianceType.split('0x')[1]
      let list = getIotDeviceV3[item.category] || ''
      if (!list) {
        item.deviceImg = baseImgApi.url + 'scene/sence_img_lack.png'
        item.applianceName = ''
      } else {
        item.deviceImg = list.common.icon
        item.applianceName = list.common.name
      }
    })
    let supportDevices = notActiveDevices.filter((item) => item.isSupport)
    supportDevices = supportDevices.concat(notInstallDevices)
    homeStorage.setStorage({ homeId: homegroupId, name: 'boughtDevices', data: supportDevices })
    this.setData({
      boughtDevices: supportDevices,
    })
    this.boughtDevicesTrack()
  },

  //已购待绑定设备预览埋点  优化 考虑转移到设备组件中
  boughtDevicesTrack() {
    for (let i in this.data.boughtDevices) {
      let { sn8, boughtType, category, realSn, applianceName } = this.data.boughtDevices[i]
      let ext_info = {
        homegroup_id: this.data.applianceHomeData.homegroupId,
        sn8: sn8 || '',
        type: boughtType ? 2 : 1,
        app_type: category,
      }
      console.log('ext_info', ext_info)
      rangersBurialPoint('content_exposure_event', {
        page_id: 'page_home',
        page_name: '小程序首页',
        page_path: getCurrentPages()[0].route,
        module: '首页',
        page_module: '设备卡片',
        rank: '',
        object_type: '未激活设备',
        object_id: realSn || '',
        object_name: applianceName,
        ext_info: ext_info,
        event_name: 'content_exposure_event',
      })
    }
  },

  //已购待绑定设备绑定 优化 考虑转移到设备组件中
  bindNow(e) {
    let { realSn, sn8, applianceName, applianceType, boughtType } = e.currentTarget.dataset.device
    app.globalData.deviceSessionId = creatDeviceSessionId(app.globalData.userData.uid) //创建一次配网标识
    clickEventTracking('user_behavior_event', 'bindNow', {
      page_id: 'page_home',
      page_name: '小程序首页',
      module: '首页',
      widget_id: 'click_btn_bind_appliance',
      widget_name: '立即绑定',
      page_path: getCurrentPages()[0].route,
      page_module: '设备卡片',
      rank: '',
      object_type: 'appliance',
      object_id: realSn || '',
      object_name: applianceName,
      device_info: {
        device_session_id: app.globalData.deviceSessionId,
      },
      ext_info: {
        app_type: applianceType, //设备品类
        sn8: sn8 || '', //sn8码
        sn: realSn || '', //sn码
        type: boughtType ? 2 : 1, //设备类型，取值为：1-代绑定设备卡片（安装类）/2-代绑定设备卡片（购买类）
      },
    })
    //已购待待绑定非安装类，点击绑定去扫码添加设备
    if (boughtType) {
      let showNotSupport = () => {
        Dialog.alert({
          zIndex: 10001,
          context: this,
          title: '此二维码不适用于“添加设备”',
          confirmButtonText: '我知道了',
        })
      }
      let justAppSupport = () => {
        Dialog.alert({
          zIndex: 10001,
          context: this,
          title: '该设备仅支持在美的美居App添加',
          confirmButtonText: '我知道了',
        })
      }
      //扫描设备二维码进入配网
      actionScanResult(showNotSupport, justAppSupport, this.actionGoNetwork, this.getDeviceApImgAndName)
      return
    }
    this.boughtDevicesGoNetwork(e.currentTarget.dataset.device)
  },

  //已购待绑定设备去配网 优化 考虑转移到设备组件中
  boughtDevicesGoNetwork(e) {
    let item = e
    let { applianceName, sn8, deviceImg, category } = item

    let device = {
      deviceName: applianceName,
      category: category, //设备品类AC
      sn8: sn8,
      deviceImg: deviceImg, //设备图片
    }
    // if (!this.checkWxVersion()) {
    //   Dialog.alert({
    //     zIndex: 10001,
    //     context: this,
    //     message: '你的微信版本过低，请升级至最新版本后再试',
    //     confirmButtonText: '我知道了',
    //   })
    //   return
    // }
    let param = {
      category: category,
      code: sn8,
      queryType: 2,
      stamp: getStamp(),
      reqId: getReqId(),
    }
    requestService
      .request('multiNetworkGuide', param)
      .then((res) => {
        let netWorking = resp.data.data.cableNetWorking ? 'cableNetWorking' : 'wifiNetWorking'
        let mode = res.data.data[netWorking].mainConnectinfoList[0].mode
        let guideInfo = res.data.data[netWorking].mainConnectinfoList
        if (mode == 1 || mode == '') {
          mode = 0
        }
        device['mode'] = mode
        device['fm'] = 'noActive'
        device['guideInfo'] = guideInfo
        this.actionGoNetwork(device)
      })
      .catch((err) => {
        console.log('error=====', err)
        if (err.data.code == 1) {
          wx.showToast({
            title: err.data.msg,
            icon: 'none',
          })
        }
      })
  },

  //删除已购待绑定设备卡片 优化 考虑转移到设备组件中
  delBoughtDeviceCard(e) {
    let info = {
      applianceName: '',
      applianceType: '',
      sn8: '',
      realSn: '',
      sn: '',
    }
    if (e.currentTarget) {
      let { applianceName, applianceType, sn8, realSn, sn, category, boughtType } = e.currentTarget.dataset.device
      info = {
        applianceName: applianceName,
        applianceType: applianceType,
        sn8: sn8,
        realSn: realSn,
        sn: sn,
        category: category,
        boughtType: boughtType,
      }
    } else {
      info = {
        applianceName: e.applianceName,
        applianceType: e.applianceType,
        sn8: e.sn8,
        realSn: e.realSn,
        sn: e.sn,
        category: e.category,
        boughtType: e.boughtType,
      }
    }
    //删除已购待绑定设备埋点
    clickEventTracking('user_behavior_event', 'delBoughtDeviceCard', {
      page_id: 'page_home',
      page_name: '小程序首页',
      module: '首页',
      widget_id: 'click_btn_delete_appliance',
      widget_name: 'X号删除设备',
      page_path: getCurrentPages()[0].route,
      page_module: '设备卡片',
      rank: '',
      object_type: 'appliance',
      object_id: info.realSn || '',
      object_name: info.applianceName,
      device_info: {},
      ext_info: {
        app_type: info.applianceType, //设备品类
        sn8: info.sn8 || '', //sn8码
        sn: info.realSn || '', //sn码
        type: info.boughtType ? 2 : 1, //设备类型，取值为：1-代绑定设备卡片（安装类）/2-代绑定设备卡片（购买类）
      },
    })
    let _this = this
    let params = {
      businessType: info.boughtType ? 3 : 1,
      sn: info.sn,
      applianceType: info.applianceType,
    }
    service
      .ignoreAppliance(params)
      .then((res) => {
        console.log('忽略已购待绑定设备结果', res)
        _this.getNotActiveDevices()
      })
      .catch((err) => {
        console.log('忽略已购待绑定设备失败', err)
      })
  },
  //批量获取后确权状态
  async getBatchAuthList(applianceCodeList) {
    // return new Promise((resolve, reject) => {
    await service
      .getBatchAuthList(applianceCodeList)
      .then((resp) => {
        try {
          if (resp.data.data.applianceAuthList && resp.data.data.applianceAuthList.length > 0) {
            if (wx.getStorageSync('batchAuthList')) wx.removeStorageSync('batchAuthList')
            wx.setStorageSync('batchAuthList', resp.data.data.applianceAuthList)
            app.globalData.applianceAuthList = resp.data.data.applianceAuthList
          }
          //resolve(resp)
        } catch (error) {
          console.error('[ERROR]', '批量获取后确权状态: batchAuthList', error)
        }
      })
      .catch((error) => {
        console.error('[ERROR]', '批量获取后确权状态: batchAuthList', error)
        //reject(error)
      })
    // })
  },

  //获取已购未绑定设备 优化 考虑转移到设备组件中
  getNotActiveDevices() {
    let _this = this
    service
      .getNotActiveDevices(this.data.applianceHomeData.homegroupId)
      .then((res) => {
        _this.dealBoughtDevices(res['notActive'] || [], res['applianceType'] || [])
      })
      .catch((err) => {
        console.log('获取已购未绑定设备失败', err)
      })
  },

  //获取当前家庭的主设备 supportedApplianceList-小程序支持的设备
  getMainDevices(supportedApplianceList) {
    app.globalData.friendDevices = []
    let masterDevices = supportedApplianceList.filter((item) => {
      return item.onlineStatus == 1 && item.ability.supportFindFriends == 1
    })
    wx.setStorage({
      key: 'masterDevices',
      data: masterDevices,
    })
    console.log('当前家庭主设备信息', masterDevices)
  },
  filterDevicurAddedApDeviceList(source) {
    const list = app.globalData.curAddedApDeviceList || []
    const arr = new Array()
    if (list.length === 0) return
    list.reduce((prev, cur) => {
      if (cur.applianceCode != source.applianceCode) arr.push(cur)
    })
    app.globalData.curAddedApDeviceList = arr
  },

  //更新首页进插件页不需要调用查询确权接口的applianceCode缓存列表
  updateNoCheckAuthCodeList(currentHomeAppliance) {
    let code = currentHomeAppliance.map((item) => {
      return item.applianceCode
    })
    let noAuthApplianceCode = app.globalData.noAuthApplianceCodeList.filter((item) => {
      return code.includes(item)
    })
    app.globalData.noAuthApplianceCodeList = noAuthApplianceCode
  },
})
