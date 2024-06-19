const app = getApp()

const rangersBurialPoint = app.getGlobalConfig().rangersBurialPoint
const requestService = app.getGlobalConfig().requestService
import { getStamp } from 'm-utilsdk/index'
import { imageDomain, commonApi } from '../assets/scripts/api'

import { EC, menuId } from './js/EC.js'

import { DeviceData } from '../assets/scripts/device-data'
import MideaToast from '../component/midea-toast/toast'
import { Format } from '../assets/scripts/format'
import { parseComponentModel } from '../assets/scripts/common'
import { UI } from '../assets/scripts/ui'
import Dialog from 'm-ui/mx-dialog/dialog'

let deviceStatusTimer = null
let isDeviceInterval = true
Component({
  options: {
    multipleSlots: true, // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    applianceData: {
      type: Object,
      value: function () {
        return {}
      },
    },
  },
  data: {
    isLoadingCloudMenu: false,
    menuTabs: [
      {
        key: 0,
        text: '本地功能',
        selected: true,
      },
      {
        key: 1,
        text: '联网专属功能',
        selected: false,
      },
    ],
    menuExpandParams: {
      hasExpand: false,
      isExpand: false,
      classes: '',
    },
    errorWrapper: {
      isShow: false,
      title: '',
      desc: '',
    },
    navBarHeight: 46,
    // region 2021.10.11 敖广骏
    bgImage: {
      url1: imageDomain + '/0xFB/bg.png',
      url2: imageDomain + '/0xFB/bg-running.png',
      url3: imageDomain + '/0xFB/bg-running-move.png',
    },
    configList: [], // 常规菜单(全部)
    pageMenuList: [], // 页面显示菜单
    prefabMenu: [], // 预制菜
    slicePreFoodList: [],
    quickDevJson: undefined,
    deviceInfo: {
      isOnline: false,
      isRunning: false,
      keepWarmTimeLabel: {
        hour: 0,
        minute: 0,
        second: 0,
      },
      cloudMenu: {},
    },
    isBottomFixed: false,
    isInit: false,
    iconUrl: {
      aroma: imageDomain + '/0xEC/icon-aroma.png',
      arrow: {
        url1: imageDomain + '/0xE7/icon-arrow-r.png',
        url2: imageDomain + '/0x32/icon_right_arrow_gray.png',
      },
      power: {
        url1: imageDomain + '/0xFB/icon-switch.png',
      },
      pressure: {
        url1: imageDomain + '/0xEC/icon-pressure.png',
      },
      schedule: imageDomain + '/0x32/icon-schedule.png',
      workTime: imageDomain + '/0x32/icon-time.png',
      mouthfeel: {
        url1: imageDomain + '/0xF1/icon-kougan.png',
      },
      temperature: {
        url1: imageDomain + '/0xF1/icon-baowen.png',
      },
      test: {
        url1: imageDomain + '/0xFB/icon_zhire2.png',
        url2: imageDomain + '/0xFB/icon_zhire.png',
        url3: 'https://ce-cdn.midea.com/quick_dev/function/1e13781d-c5ab-41d4-b04d-cc43b72fbd93.png',
        url4: 'https://ce-cdn.midea.com/quick_dev/function/7239b481-7e19-4267-bfaa-65aec566e3e1.png',
      },
      backImgBase: imageDomain + '/0xFC/icon_youjiantou.png',
    },
    noticeBar: {
      isShow: false,
      content: '内容',
      type: 'danger',
    },
    workTimeData: {
      value: [0, 0, 0, 0],
      hours: [0, 1, 2, 3, 4, 5],
      minutes: [0, 1, 2, 3, 4, 5],
      result: {},
    },
    scheduleData: {
      value: [0, 0, 0, 0],
      day: [],
      hours: [],
      minutes: [],
      result: undefined,
      resultLabel: undefined,
      isSelecting: false,
    },
    scheduleModal: {
      isShow: false,
    },
    workTimeModal: {
      isShow: false,
    },
    selectedFunction: {},
    settingModal: {
      isShow: false,
      params: {
        taste: undefined,
        pressureLevel: undefined,
      },
      confirmText: '开始烹饪',
    },
    workStatus: {},

    switchAroma: parseComponentModel({
      isActive: true,
      selected: false,
    }),
    switchSchedule: parseComponentModel({
      color: '#FF8225',
      isActive: true,
      selected: false,
    }),
    // endregion

    // endregion

    // region 2021.10.11 之前的代码
    scrollViewTop: 0,
    buttonSize: '110rpx',
    icons: {
      greyTriangle: 'assets/img/grey-triangle.png',
    },
    rowClass1: 'row-sb',
    rowClass2: 'row-sb',
    btnShowStatus: false,
    openPicker: false,
    listData: {},
    _applianceData: {
      name: '',
      roomName: '',
      onlineStatus: 0,
    },
    _applianceDataStatus: {
      workStatus: '0',
      runMode: '0',
      time: {
        workTimeHour: '0',
        keepWarmTimeMinute: '0',
        appointTimeHour: '0',
        appointTimeMinute: '0',
      },
    },
    text: '待机中', // 显示状态文字（待机中）
    menuId: menuId,
    currentMenuId: 0, // 记录当前的menuId
    showText: false,
    showWorkingText: false, // 显示工作参数
    workingText: '', // 工作参数
    showWorkingStatus: false, // 显示工作状态
    workingStatus: '', // 工作状态
    finishTime: '',
    showFinishTime: false,
    circleSrc: '',
    power: {},
    // 菜单
    kuaisufan: {},
    kuaisuzhou: {},
    baotang: {},
    rouji: {},
    otherMenu: {},
    // ...
    showManualItems: false,
    showOfflineCard: false,
    offlineFlag: false,
    currentAppointData: {},
    otherMenuWorking: false,
    actionSheetShow: false,
    // 选择器
    multiArray: [['今天', '明天'], ['1'], ['时'], ['2'], ['分']],
    multiIndex: [0, 0, 0, 0, 0, 0],
    todayHours: [],
    tomorrowHours: [],
    todayFirstMinutes: [],
    tomorrowLastMinutes: [],
    normalMinutes: [],
    showDialog: false,
    pickerOpenHour: 0,
    pickerOpenMinute: 0,
    headerImg: imageDomain + '/0xEC/blender.png',
    // endregion
  },
  methods: {
    // 状态变化监听
    watchDeviceStatus(newValue, oldValue) {
      console.log('状态变化监听: ', newValue.workStatus, oldValue.workStatus)
      if (oldValue.workStatus === 'working' && newValue.workStatus === 'standby') {
        this.showModal({
          title: '烹饪完成',
          content: '快去享用美食吧',
          showCancel: false,
          confirmText: '知道了',
        })
      }
    },
    // 对话框
    showModal(options) {
      console.log('对话框: ', options)
      if (options) {
        let showCancelButton = true
        if (options.showCancel !== null && options.showCancel !== undefined) {
          showCancelButton = options.showCancel
        }
        Dialog.confirm({
          title: options.title || '标题',
          message: options.content || '',
          context: options.context || this,
          showCancelButton: showCancelButton,
          cancelButtonText: options.cancelText || '取消',
          confirmButtonText: options.confirmText || '确定',
        })
          .then((res) => {
            // on close
            // console.log('关闭弹框1',res);
            options.success && options.success({ confirm: 1 })
          })
          .catch((err) => {
            // console.log('关闭弹框2',err);
            options.success && options.success({ confirm: 0 })
          })
      }
    },
    // 选择菜单类型
    onChangeMenuType(event) {
      console.log('选择菜单类型: ', event)
      let model = event.detail.data
      let menuTabs = this.data.menuTabs
      let configList = this.data.configList
      let pageMenuList = []
      configList.forEach((functionItem) => {
        switch (model.key) {
          case menuTabs[0].key:
            // 本地功能
            if (functionItem.code < 112001) {
              pageMenuList.push(functionItem)
            }
            break
          case menuTabs[1].key:
            // 联网专属
            if (functionItem.code >= 112001 && functionItem.code <= 112600) {
              pageMenuList.push(functionItem)
            }
            break
        }
      })
      menuTabs.forEach((menuTabItem) => {
        menuTabItem.selected = menuTabItem.key === model.key
      })
      // 设置菜单展开属性
      let menuExpandParams = this.data.menuExpandParams
      menuExpandParams.hasExpand = pageMenuList.length > 6
      this.setData({ pageMenuList, menuExpandParams, menuTabs })
    },
    // 跳转到状态页
    goToWorkStatus(fromCloud) {
      let deviceInfo = this.data.deviceInfo
      let pages = getCurrentPages()
      let currentPage = pages[pages.length - 1]
      let isMatchArr = currentPage.route.match(/plugin\/T0x(.*)\/index\/index/g)
      if (!isMatchArr) {
        if (fromCloud) {
          wx.redirectTo({
            url:
              '../../../status/status' +
              Format.jsonToParam({
                applianceType: deviceInfo.type,
                modelNo: deviceInfo.sn8,
                applianceId: deviceInfo.applianceCode,
              }),
          })
        } else {
          if (fromCloud) {
            wx.redirectTo({
              url:
                '../../../status/status' +
                Format.jsonToParam({
                  applianceType: deviceInfo.type,
                  modelNo: deviceInfo.sn8,
                  applianceId: deviceInfo.applianceCode,
                }),
            })
          } else {
            wx.redirectTo({
              url:
                '../status/status' +
                Format.jsonToParam({
                  applianceType: deviceInfo.type,
                  modelNo: deviceInfo.sn8,
                  applianceId: deviceInfo.applianceCode,
                }),
            })
          }
        }
      } else {
        wx.navigateTo({
          url:
            '../status/status' +
            Format.jsonToParam({
              applianceType: deviceInfo.type,
              modelNo: deviceInfo.sn8,
              applianceId: deviceInfo.applianceCode,
            }),
        })
      }
    },
    // 展开或收起菜单
    onClickToggleMenu() {
      let menuExpandParams = this.data.menuExpandParams
      menuExpandParams.isExpand = !menuExpandParams.isExpand
      menuExpandParams.classes = menuExpandParams.isExpand ? 'menu-expand' : 'menu-shrink'
      this.setData({ menuExpandParams })
    },
    // 回到顶部
    scrollToTop() {
      wx.pageScrollTo({
        scrollTop: 0,
      })
    },
    // 预约时间选择
    scheduleDataOnStart() {
      let scheduleData = this.data.scheduleData
      scheduleData.isSelecting = true
      this.setData({ scheduleData })
    },
    scheduleDataOnEnd() {
      let scheduleData = this.data.scheduleData
      scheduleData.isSelecting = false
      this.setData({ scheduleData })
    },
    // 设置离线状态
    updateViewOnlineToggle(isOnline) {
      let deviceInfo = this.data.deviceInfo
      deviceInfo.isOnline = isOnline
      this.setData({ deviceInfo })
    },
    // 获取diy名称
    getMenuName() {
      return new Promise((resolve, reject) => {
        const app = getApp()
        const uriParams = {
          applianceId: this.properties.applianceData.applianceCode,
          applianceType: '32',
          modelNo: this.properties.applianceData.sn8,
          userId: app.globalData.userData.iotUserId,
          queryType: 1,
          // stamp: getStamp(),
        }
        const sendParams = {
          serviceName: 'remote-control',
          uri: 'v2/32' + '/control/getStatus' + Format.jsonToParam(uriParams),
          method: 'POST',
          contentType: 'application/json',
          userId: app.globalData.userData.iotUserId,
        }
        requestService
          .request(commonApi.sdaTransmit, sendParams)
          .then((res) => {
            resolve(res)
          })
          .catch((err) => {
            if (err.data) {
              resolve(err)
            } else {
              reject(err)
            }
          })
      })
    },

    // endregion
    // 跳到预制菜页面
    clickToPreDish() {
      wx.setStorageSync('prefabMenu', this.data.prefabMenu)
      wx.setStorageSync('deviceInfo', this.data.deviceInfo)
      wx.navigateTo({
        url: '../preDish/preDish',
      })
    },
    // region 轮询获取设备状态
    deviceStatusInterval(interval) {
      if (deviceStatusTimer) {
        clearInterval(deviceStatusTimer)
      }
      if (!interval) {
        interval = 6000
      }
      if (isDeviceInterval) {
        deviceStatusTimer = setInterval(() => {
          this.updateStatus()
        }, interval)
      }
      // this.updateStatus();
    },
    clearDeviceStatusInterval() {
      if (deviceStatusTimer) {
        clearInterval(deviceStatusTimer)
      }
    },
    // endregion

    // region 显示错误提示
    showError(options) {
      let errorWrapper = this.data.errorWrapper
      if (!options) return
      if (typeof options === 'string') {
        errorWrapper.title = options
      } else {
        errorWrapper.title = options.title
        errorWrapper.desc = options.desc
      }
      errorWrapper.isShow = true
      this.setData({ errorWrapper })
    },
    closeError() {
      let errorWrapper = this.data.errorWrapper
      errorWrapper.isShow = false
      this.setData({ errorWrapper })
    },
    // endregion

    // region 显示顶部通知栏
    showNoticeBar(options) {
      do {
        if (!options) {
          console.warn('缺少options')
          break
        }
        let content = '内容'
        if (typeof options === 'string') {
          content = options
        } else {
          content = options.content
        }
        let noticeBar = this.data.noticeBar
        noticeBar.isShow = true
        noticeBar.content = content
        noticeBar.type = options.type || 'danger'
        this.setData({ noticeBar })
      } while (false)
    },
    closeNoticeBar() {
      let noticeBar = this.data.noticeBar
      noticeBar.isShow = false
      this.setData({ noticeBar })
    },
    // endregion

    // region 确定预约时间
    // 确认预约时间
    confirmSchedule() {
      do {
        let scheduleData = this.data.scheduleData
        if (scheduleData.isSelecting) {
          break
        }
        let value = scheduleData.value
        let deviceInfo = this.data.deviceInfo
        let day = value[1]
        let hour = scheduleData.hours[value[2]]
        let minute = scheduleData.minutes[value[3]]
        let nowDate = new Date()

        // 判断RTC类型，计算完成时间
        if (deviceInfo.isSupportRtc) {
          // 时钟类型,不作处理
        } else {
          // 非时钟类型，计算间隔时间
          if (day === 0) {
            let interval = hour * 60 + minute - (nowDate.getHours() * 60 + nowDate.getMinutes())
            hour = Math.floor(interval / 60)
            minute = interval % 60
          } else {
            let nowTimestamp = nowDate.getTime()
            // 获取明天的时间
            let tomorrowTimestamp = nowTimestamp + 86400000
            let tomorrowDate = new Date(tomorrowTimestamp)
            // 获取明天的年月日
            let targetYear = tomorrowDate.getFullYear() + ''
            let targetMonth = tomorrowDate.getMonth() + 1 + ''
            let targetDate = tomorrowDate.getDate() + ''
            let targetString =
              targetYear +
              '/' +
              targetMonth +
              '/' +
              targetDate +
              ' ' +
              Format.getTime(hour) +
              ':' +
              Format.getTime(minute)
            // 获取目标时间的时间戳
            let targetTimestamp = new Date(targetString).getTime()
            let targetInterval = targetTimestamp - nowTimestamp
            hour = Math.floor(targetInterval / 1000 / 60 / 60)
            minute = (targetInterval / 1000 / 60) % 60
          }
        }
        scheduleData.result = hour * 60 + minute
        let today = nowDate.getDate()
        let nowDateStamp = nowDate.getTime()
        let targetDateStamp = nowDateStamp + scheduleData.result * 60 * 1000
        let targetDate = new Date(targetDateStamp)
        let targetDay = targetDate.getDate()
        let scheduleFinishLabel = '等待启动'
        if (today === targetDay) {
          // 今天
          scheduleFinishLabel = '今天'
        } else {
          // 明天
          scheduleFinishLabel = '明天'
        }
        let finishTime = Format.dateFormat('HH:MM', targetDate)
        scheduleFinishLabel += finishTime
        scheduleData.resultLabel = scheduleFinishLabel
        this.setData({ scheduleData })
        this.closeScheduleModal()
      } while (false)
    },
    // 取消预约
    cancelSchedule() {
      this.closeScheduleModal()
      // 预约时间初始化
      let switchSchedule = parseComponentModel(this.data.switchSchedule)
      switchSchedule.selected = false
      switchSchedule = parseComponentModel(switchSchedule)
      let scheduleData = {
        value: [0, 0, 0, 0, 0],
        day: [],
        hours: [],
        minutes: [],
        result: undefined,
        resultLabel: undefined,
      }
      this.setData({ scheduleData })
    },
    // endregion

    // region 数据初始化
    dataInit(newDeviceStatus) {
      let data = this.data
      let deviceInfo = data.deviceInfo
      let configList = data.configList
      let quickDevJson = data.quickDevJson
      let workStatus = data.workStatus
      if (newDeviceStatus) {
        this.watchDeviceStatus(newDeviceStatus, Object.assign({}, deviceInfo))
        Object.assign(deviceInfo, newDeviceStatus)
        // 工作状态
        let workStatusOptions = quickDevJson.properties[EC.settingApiKey.workStatus].options
        if (workStatusOptions && workStatusOptions.length > 0) {
          for (let i = 0; i < workStatusOptions.length; i++) {
            let workStatusOptionItem = workStatusOptions[i]
            workStatus[workStatusOptionItem.code] = workStatusOptionItem.value
            if (workStatusOptionItem.value == deviceInfo.workStatus) {
              deviceInfo.workStatusName = workStatusOptionItem.desc || workStatusOptionItem.text
              if (
                workStatusOptionItem.code === EC.workStatus.workingVenting ||
                workStatusOptionItem.code === EC.workStatus.interruptVenting
              ) {
                deviceInfo.workStatusName = '排气中'
              }
              if (deviceInfo.workStatusName.indexOf('设备') > -1) {
                deviceInfo.workStatusName = deviceInfo.workStatusName.replace('设备', '')
              }
            }
          }
        }
        deviceInfo.isRunning = deviceInfo.workStatus !== 'standby'
        // 是否缺水或错误
        deviceInfo.isError = deviceInfo.waterShortageState === 'waterShortage' || deviceInfo.workStatus === 'error'
        if (deviceInfo.isError) {
          if (deviceInfo.waterShortageState === 'waterShortage') {
            // 暂停时候，提示顶部warn, 缺水
            this.showError({
              title: '水箱缺水',
              desc: '请加水后再尝试启动',
            })
            this.showNoticeBar({
              content:
                deviceInfo.waterShortageState == 'waterShortage'
                  ? '缺水提示:水箱水量不足,请及时加水'
                  : '电蒸锅已暂停,请点击“启动”键继续完成烹饪.',
              type: 'warn',
              mode: 'all',
            })
          } else {
            let showErrorTip = () => {
              let quickDevJson = this.data.quickDevJson
              let errorCodeMap = quickDevJson.errorCodeMap
              // console.log('判断故障码: ', deviceInfo, deviceInfo.errorCode, errorCodeMap)
              if (Object.keys(errorCodeMap).length > 0) {
                let targetError = errorCodeMap[deviceInfo.errorCode]
                if (targetError) {
                  this.showError({
                    title: '设备故障',
                    desc: targetError.name + '\r\n' + targetError.solution,
                  })
                  return
                }
              }
              this.showError({
                title: '提示',
                desc: '未知设备故障',
              })
            }
            showErrorTip()
          }
        } else {
          this.closeError()
          this.closeNoticeBar()
        }
        // 剩余时间
        if (deviceInfo.time.remainWorkTimeSecond) {
          let second = deviceInfo.time.remainWorkTimeSecond
          second = Number(second)
          let formatSecond = Format.formatSeconds(second)
          deviceInfo.currentTimeLabel = {
            hour: Format.getTime(formatSecond.hours),
            minute: Format.getTime(formatSecond.minutes),
            second: Format.getTime(formatSecond.seconds),
          }
        }
        // 预约时间
        let nowDate = new Date()
        let today = nowDate.getDate()
        let nowDateStamp = nowDate.getTime()
        let targetDateStamp = nowDateStamp + Number(deviceInfo.time.remainWorkTimeSecond) * 1000
        // 预约剩余时间
        if (deviceInfo.workStatus === 'schedule' && Number(deviceInfo.time.remainAppointTimeSecond)) {
          targetDateStamp = nowDateStamp + Number(deviceInfo.time.remainAppointTimeSecond) * 1000
          let second = Number(deviceInfo.time.remainAppointTimeSecond)
          let formatSecond = Format.formatSeconds(second)
          deviceInfo.currentTimeLabel = {
            hour: Format.getTime(formatSecond.hours),
            minute: Format.getTime(formatSecond.minutes),
            second: Format.getTime(formatSecond.seconds),
          }
        }
        let targetDate = new Date(targetDateStamp)
        let targetDay = targetDate.getDate()
        let scheduleFinishLabel = '等待启动'
        if (today === targetDay) {
          // 今天
          scheduleFinishLabel = '今天'
        } else {
          // 明天
          scheduleFinishLabel = '明天'
        }
        let finishTime = Format.dateFormat('HH:MM', targetDate)
        scheduleFinishLabel += finishTime
        deviceInfo.finishTime = scheduleFinishLabel
        // 工作模式
        let workMode = deviceInfo.runMode
        let currentFunction = {}
        if (workMode != 0) {
          // 增加预制菜比对
          let prefabMenu = data.prefabMenu
          const foodArr = [...configList, ...prefabMenu]
          if (foodArr && foodArr.length > 0) {
            for (let j = 0; j < foodArr.length; j++) {
              let functionItem = foodArr[j]
              if (functionItem.code == workMode) {
                currentFunction = functionItem
                break
              }
            }
          }
          deviceInfo.currentFunction = currentFunction
          if (currentFunction.code) {
            // 保温时间
            let timeWarmHr = Number(deviceInfo.time_warm_hr)
            let timeWarmMin = Number(deviceInfo.time_warm_min)
            let second = timeWarmHr * 60 * 60 + timeWarmMin * 60
            second = Number(second)
            let formatSecond = Format.formatSeconds(second)
            deviceInfo.keepWarmTimeLabel = {
              hour: Format.getTime(formatSecond.hours),
              minute: Format.getTime(formatSecond.minutes),
              second: Format.getTime(formatSecond.seconds),
            }
          } else {
            // 初始化云食谱或DIY参数
            deviceInfo.cloudMenu.code = ''
            deviceInfo.cloudMenu.name = ''
            this.setData({ deviceInfo, isLoadingCloudMenu: true })
            // 获取diy名称
            this.getMenuName(workMode).then((res) => {
              if (res.data.errorCode === 0) {
                let resData = JSON.parse(res.data.result.returnData)
                if (resData.data && resData.data.extended) {
                  deviceInfo.cloudMenu.code = workMode
                  deviceInfo.cloudMenu.name =
                    resData.data.extended.user_custom_name || resData.data.extended.recipe_name
                  console.log(resData.data, 33333333333333)
                  // 获取保温时间
                  // {{deviceInfo.keepWarmTimeLabel.hour}}:{{deviceInfo.keepWarmTimeLabel.minute}
                  const diyTime = resData.data.status.time
                  const minute = parseInt(diyTime.remainKeepWarmTimeSecond / 60)
                  deviceInfo.keepWarmTimeLabel.hour = Format.getTime(parseInt(minute / 60))
                  deviceInfo.keepWarmTimeLabel.minute = Format.getTime(parseInt(minute % 60))
                  deviceInfo.keepWarmTimeLabel.keepWarmTimeSecond = parseInt(14400 / 60)
                  this.setData({ deviceInfo, isLoadingCloudMenu: false })
                }
              }
            })
          }
        }
      }
      this.setData({ deviceInfo, workStatus })
    },
    // endregion

    // region 重置参数设置对话框
    settingModalInit() {
      // 预约时间
      let switchSchedule = parseComponentModel(this.data.switchSchedule)
      switchSchedule.selected = false
      switchSchedule = parseComponentModel(switchSchedule)
      let scheduleData = {
        value: [0, 0, 0, 0, 0],
        day: [],
        hours: [],
        minutes: [],
        result: undefined,
        resultLabel: undefined,
      }
      // 工作时间
      let workTimeData = {
        value: [0, 0, 0, 0],
        hours: [],
        minutes: [],
        result: undefined,
        resultLabel: undefined,
      }
      this.setData({
        switchSchedule,
        scheduleData,
        workTimeData,
      })
    },
    // endregion

    // region 显示参数设置对话框
    showSettingModal() {
      let settingModal = this.data.settingModal
      settingModal.isShow = true
      settingModal.confirmText = '开始烹饪'
      this.setData({ settingModal })
    },
    closeSettingModal() {
      let settingModal = this.data.settingModal
      settingModal.isShow = false
      this.setData({ settingModal })
      setTimeout(() => {
        this.settingModalInit()
      }, 300)
    },
    // endregion

    // region 获取产品配置
    getProductConfig(bigVer) {
      return new Promise((resolve, reject) => {
        let data = this.data
        let deviceInfo = data.deviceInfo
        if (deviceInfo.onlineStatus == DeviceData.onlineStatus.online) {
          deviceInfo.isOnline = true
        } else {
          deviceInfo.isOnline = false
          MideaToast('设备已离线，请检查网络状态')
        }
        this.setData({ deviceInfo })
        let productModelNumber = deviceInfo.modelNumber != 0 ? DeviceData.getAO(deviceInfo.modelNumber) : deviceInfo.sn8
        let params = {
          applianceId: deviceInfo.applianceCode,
          productTypeCode: deviceInfo.type,
          userId: data.uid,
          productModelNumber: deviceInfo.sn8 || productModelNumber,
          bigVer: bigVer || 8,
          platform: 2, // 获取美居/小程序功能，2-小程序
        }
        let sendParams = {
          serviceName: 'node-service',
          uri: '/productConfig' + Format.jsonToParam(params),
          method: 'GET',
          contentType: 'application/json',
        }
        let method = 'POST'
        requestService
          .request(commonApi.sdaTransmit, sendParams, method)
          .then((res) => {
            // 设置页面功能
            let resData = null
            do {
              if (res.data.errorCode == 50300 || res.data.errorCode == 1001) {
                // 无资源重定向
                EC.redirectUnSupportDevice(this.properties.applianceData)
                break
              }
              if (res.data.errorCode != 0) {
                let msg = EC.handleErrorMsg(res.data.errorCode)
                MideaToast(msg)
                break
              }
              resData = JSON.parse(res.data.result.returnData)
              if (!resData && !bigVer) {
                // 再次获取快开配置
                this.getProductConfig(6)
                break
              }
              console.log('快开配置: ', resData)
              let quickDevJson = EC.quickDevJson2Local(resData)
              console.log('解析后参数', quickDevJson)
              let configList = [],
                prefabMenu = [],
                pageMenuList = []
              // 过滤本地功能  prefabMenu预制菜
              quickDevJson.functions.forEach((functionsItem) => {
                const attributesSetting = functionsItem.settingsData['workStatus']
                if (attributesSetting?.properties?.prefabMenu) {
                  prefabMenu.push(functionsItem)
                } else {
                  functionsItem.code != 50000 && configList.push(functionsItem)
                  // 加载本地功能
                  if (functionsItem.code < 112001) {
                    pageMenuList.push(functionsItem)
                  }
                }
              })
              prefabMenu = prefabMenu.map((item) => {
                item.url = item?.settings.find((item) => item.apiKey == 'workStatus')?.properties?.buyLink
                return item
              })
              let slicePreFoodList = prefabMenu.filter((item, index) => index < 2)
              let functionLength = configList.length
              do {
                if (functionLength === 7) {
                  deviceInfo['layoutClass'] = 'grid-layout-fourth'
                  break
                }
                if (functionLength === 2) {
                  deviceInfo['layoutClass'] = 'grid-layout-double'
                  break
                }
                if (functionLength % 6 === 0) {
                  deviceInfo['layoutClass'] = 'grid-layout-third'
                  break
                }
                if (functionLength % 2 === 0) {
                  deviceInfo['layoutClass'] = 'grid-layout-fourth'
                  break
                }
                deviceInfo['layoutClass'] = 'grid-layout-third'
              } while (false)
              // 设置菜单展开属性
              let menuExpandParams = this.data.menuExpandParams
              if (pageMenuList.length > 6) {
                menuExpandParams.hasExpand = true
                menuExpandParams.classes = 'menu-shrink'
              }
              this.setData({
                pageMenuList,
                menuExpandParams,
                configList,
                prefabMenu,
                deviceInfo,
                quickDevJson,
                slicePreFoodList,
              })
            } while (false)
            resolve(res)
          })
          .catch((err) => {
            let res = err.data
            if (res) {
              if (res.result && res.result.returnData) {
                res = JSON.parse(res.result.returnData)
              }
              do {
                if (res.resCode == 50300 || res.code == 1001) {
                  // 无资源重定向
                  EC.redirectUnSupportDevice(this.properties.applianceData)
                  break
                }
                if (res.code != 0) {
                  let msg = EC.handleErrorMsg(res.code)
                  MideaToast(msg)
                  break
                }
                MideaToast('未知错误-配置')
              } while (false)
            }
            resolve()
          })
      })
    },
    // endregion

    // region 点击功能项
    onClickFunction(event, disableToast) {
      do {
        let deviceInfo = this.data.deviceInfo
        if (deviceInfo.isError) {
          if (!disableToast) {
            MideaToast('设备故障，请检查设备情况')
          }
          break
        }
        if (!deviceInfo.isOnline) {
          if (!disableToast) {
            MideaToast('设备已离线，请检查设备状态')
          }
          break
        }
        if (deviceInfo.isRunning) {
          if (!disableToast) {
            MideaToast('设备工作中，请稍后再试')
          }
          break
        }
        if (deviceInfo.waterShortageState == 'waterShortage') {
          if (!disableToast) {
            MideaToast('水箱缺水，请加水后再尝试启动')
          }
          return
        }
        let functionItem = event.currentTarget.dataset.item
        let selectedFunction = functionItem
        console.log('选中的功能项')
        console.log(selectedFunction)
        this.setData({ selectedFunction })
        this.functionConfigInit(selectedFunction)
        let hasOptions = false
        // 烹饪时间
        let setWorkTimeConfig = selectedFunction.settingsData[EC.settingApiKey.workTime]
        if (setWorkTimeConfig && setWorkTimeConfig.codeName !== 'onlyOption') {
          hasOptions = true
        }
        // 预约
        if (selectedFunction.settingsData[EC.settingApiKey.appointTime]) {
          hasOptions = true
        }
        if (hasOptions) {
          this.showSettingModal()
        } else {
          // 快速启动
          this.showModal({
            title: '是否确认启动设备',
            confirmText: '启动',
            success: (res) => {
              if (res.confirm) {
                this.startWork()
              }
            },
          })
        }
      } while (false)
    },
    // endregion

    // 预制菜烹饪
    startPreCook(e) {
      this.onClickFunction({ currentTarget: { dataset: { item: e.detail } } })
    },
    // region 启动功能
    onClickControl(controlParams) {
      return new Promise((resolve, reject) => {
        UI.showLoading()
        this.clearDeviceStatusInterval()
        console.log('下发的指令', controlParams)
        this.requestControl({
          control: controlParams,
        })
          .then((res) => {
            UI.hideLoading()
            this.dataInit(res.data.data.status)
            this.deviceStatusInterval()
            this.scrollToTop()
            resolve()
          })
          .catch((err) => {
            console.log(err)
            let res = err
            do {
              UI.hideLoading()
              if (res.data.code != 0) {
                let msg = EC.handleErrorMsg(res.data.code)
                MideaToast(msg)
                // break;
              }
              this.deviceStatusInterval()
              this.dataInit(res?.data?.data?.status)
            } while (false)
          })
      })
    },
    // endregion

    // region 开始烹饪
    startWork() {
      let data = this.data
      let selectedFunction = data.selectedFunction
      const isPreFood = !!selectedFunction.settings.find((item) => item.apiKey == 'workStatus')?.properties?.prefabMenu
      const isSimmerInWater = Number(selectedFunction.code) === 112002 ? true : false
      let controlParams = {
        runMode: selectedFunction.code,
        workSwitch: EC.workSwitch.work,
        targetTemperature: 100,
        time: {},
        codeId: 4,
        subCmd: 1,
      }
      if (isSimmerInWater) {
        controlParams.codeId = 2
      }
      if (isPreFood || (selectedFunction.code >= 112001 && selectedFunction.code <= 112600)) {
        controlParams.subCmd = 5
      }
      let setWorkTimeConfig = selectedFunction.settingsData[EC.settingApiKey.workTime]
      console.log('test控制：', setWorkTimeConfig)
      if (setWorkTimeConfig) {
        let workTimeData = data.workTimeData
        let workTimeHours = workTimeData.hours[workTimeData.value[1]]
        let workTimeMinutes = workTimeData.minutes[workTimeData.value[2]]
        let workTimeSeconds = workTimeHours * 60 * 60 + workTimeMinutes * 60
        let workTimeResult = Format.formatSeconds(workTimeSeconds)
        // controlParams.time.workTimeHour = workTimeResult.hours;
        // controlParams.time.workTimeMinute = workTimeResult.minutes;
        controlParams.time.workTimeSecond = (workTimeResult.hours * 60 + workTimeResult.minutes) * 60
        controlParams.time.workTimeSecond =
          controlParams.time.workTimeSecond || setWorkTimeConfig.properties.defaultValue * 60
      }
      controlParams.time.appointTimeSecond = 0
      let appointTimeConfig = selectedFunction.settingsData[EC.settingApiKey.appointTime]
      let scheduleData = data.scheduleData
      if (appointTimeConfig) {
        let scheduleResult = Format.formatSeconds(scheduleData.result * 60)
        if (scheduleData.result) {
          controlParams.workSwitch = EC.workSwitch.schedule
          // controlParams.time.appointTimeHour = scheduleResult.hours;
          // controlParams.time.appointTimeMinute = scheduleResult.minutes;
          controlParams.time.appointTimeSecond = (scheduleResult.hours * 60 + scheduleResult.minutes) * 60
        }
      }
      let bool = JSON.parse(this.data.switchSchedule).selected
      if (bool && controlParams.time.workTimeSecond > controlParams.time.appointTimeSecond) {
        let leastTimeStamp = new Date().getTime() + controlParams.time.workTimeSecond * 1000
        let leastTime = new Date(leastTimeStamp)
        let nowDay = new Date().getDay()
        let leastScheduleLabel =
          (nowDay === leastTime.getDay() ? '今天' : '明天') + Format.dateFormat('HH:MM', leastTime)
        Dialog.alert({
          title: '预约时间过短',
          message: `完成烹饪时间需晚于${leastScheduleLabel}`,
          context: this,
          confirmButtonText: '知道了',
        }).then(() => {
          // on close
        })
        return
      }
      // return;
      this.closeSettingModal()
      this.onClickControl(controlParams).then((res) => {
        this.goToWorkStatus()
        // UI.showLoading();
        // this.updateStatus().then(()=>{
        //   UI.hideLoading();
        //   this.goToWorkStatus()
        // });
      })
    },
    // endregion

    // region 停止工作
    stopWork(callback, { context }) {
      // let content = '美味仍未完成\r\n是否结束设备工作'
      let content = ''
      let deviceInfo = this.data.deviceInfo
      let quickDevJson = this.data.quickDevJson
      if (quickDevJson.workStatusMap) {
        switch (deviceInfo.workStatus) {
          case quickDevJson.workStatusMap.appoint.value:
            content = '是否结束当前预约'
            break
        }
      }
      this.showModal({
        title: content || '美味食物马上就到',
        content: content ? '' : '您还要结束当前烹饪吗',
        context: context,
        cancelText: '继续烹饪',
        confirmText: '结束',
        success: (res) => {
          if (res.confirm) {
            let controlParams = {
              workStatus: 'standby',
              workSwitch: EC.workSwitch.cancel,
            }
            this.onClickControl(controlParams).then((res) => {
              MideaToast('设备已结束工作')
              if (callback) {
                callback()
              }
            })
          }
        },
      })
    },
    // 暂停，继续，马上启动
    ctrlWork(e, callback, { context }) {
      console.log(e)
      let deviceInfo = this.data.deviceInfo
      let cmd = e.currentTarget.dataset.item
      let cmdText = cmd === 'pause' ? '暂停' : '继续'
      let workSwitch = cmd == 'pause' ? 'pause' : 'keepWork'
      if (deviceInfo.workStatus == this.data.workStatus['appoint']) {
        cmd = 'work'
        cmdText = '立即开始'
        workSwitch = 'work'
      }
      this.showModal({
        title: '是否' + cmdText + '烹饪',
        context: context,
        confirmText: cmdText,
        success: (res) => {
          if (res.confirm) {
            let controlParams = {
              workStatus: cmd,
              workSwitch: workSwitch,
            }
            this.onClickControl(controlParams).then((res) => {
              this.updateStatus().then(() => {
                if (callback) {
                  callback()
                }
              })
              MideaToast('设备已' + cmdText + '工作')
            })
          }
        },
      })
    },

    // endregion

    // region 参数设置对话框初始化
    functionConfigInit(selectedFunction) {
      let settingModal = this.data.settingModal

      // 工作时间
      let setWorkTimeConfig = selectedFunction.settingsData[EC.settingApiKey.workTime]
      let keepPressureTimeConfig = selectedFunction.settingsData[EC.settingApiKey.keepPressureTime]
      if (setWorkTimeConfig || keepPressureTimeConfig) {
        let workTimeConfig = setWorkTimeConfig || keepPressureTimeConfig
        this.workTimeDataInit({
          appointTime: workTimeConfig,
        })
        // 初始值设置
        wx.nextTick(() => {
          let defaultValueMin = Number(workTimeConfig.properties?.defaultValue ?? 0)
          let defaultValueTime = Format.formatSeconds(defaultValueMin * 60)
          let workTimeData = this.data.workTimeData
          let hoursIndex = workTimeData.hours.findIndex((item) => item === defaultValueTime.hours)
          let minutesIndex = workTimeData.minutes.findIndex((item) => item === defaultValueTime.minutes)
          if (hoursIndex === -1) {
            hoursIndex = 0
          }
          this.workTimePickerOnChange({
            detail: {
              value: [0, hoursIndex, minutesIndex, 0],
            },
          })
          this.confirmWorkTime()
        })
      }
      this.setData({ settingModal })
    },
    // endregion

    // region 预约时间选择
    pickOnChange(e) {
      // 数据联动修改
      let val = e.detail.value
      if (val && val.length > 0) {
        let day = val[1]
        let hour = val[2]
        let min = val[3]
        let nowDate = this.data.nowDate
        let nowHour = nowDate.getHours()
        let nowMin = nowDate.getMinutes()
        let scheduleData = this.data.scheduleData
        let minHours = scheduleData.minHours
        let minMinutes = scheduleData.minMinutes
        let maxHours = scheduleData.maxHours
        let maxMinutes = scheduleData.maxMinutes
        let hours = []
        let minutes = []
        let startMin = nowMin + minMinutes
        // 监听天数
        if (day === 0) {
          if (startMin > 60) {
            // minHours++;
            startMin = nowMin + minMinutes - 60
          }
          // 选择了今天
          for (let i = nowHour + minHours; i < 24; i++) {
            hours.push(i)
          }
          // 设置分钟数据
          for (let i = startMin; i <= 60; i++) {
            if (i === 60) {
              if (startMin === 60) {
                minutes.push(0)
              }
            } else {
              minutes.push(i)
            }
          }
          if (hour !== 0) {
            minutes = []
            for (let i = 0; i < 60; i++) {
              minutes.push(i)
            }
          }
        } else {
          // 选择了明天
          if (nowHour - (maxHours % 24) >= 0) {
            for (let i = 0; i <= nowHour - (maxHours % 24); i++) {
              hours.push(i)
            }
          } else {
            for (let i = 0; i <= (maxHours % 24) - (24 - nowHour); i++) {
              hours.push(i)
            }
          }
          for (let i = 0; i < 60; i++) {
            minutes.push(i)
          }
          // 选择了小时
          if (hour === scheduleData.hours.length - 1) {
            minutes = []
            for (let i = 0; i <= nowMin - (maxMinutes % 60); i++) {
              minutes.push(i)
            }
          }
        }

        scheduleData.hours = hours
        scheduleData.minutes = minutes
        if (val[2] > scheduleData.hours.length - 1) {
          val[2] = 0
        }
        scheduleData.value = val
        console.log('scheduleData', scheduleData)
        this.setData({ scheduleData })
      }
    },
    // endregion

    // region 预约对话框参数设置
    scheduleDataInit({ appointTime, cookTime }) {
      let appointTimeData = appointTime.properties
      // let appointTimeDataMin = Number(appointTimeData.min)+Number(cookTime);
      let appointTimeDataMin = Number(appointTimeData.min)
      let appointTimeDataDefaultValue = appointTime.properties.defaultValue
      let scheduleData = this.data.scheduleData
      let hours = []
      let minutes = []
      let minHours = Math.floor(appointTimeDataMin / 60)
      let minMinutes = appointTimeDataMin % 60
      let maxHours = Math.floor(appointTimeData.max / 60)
      let maxMinutes = appointTimeData.max % 60
      let defaultHours = Math.floor(appointTimeDataDefaultValue / 60)
      let defaultMinutes = appointTimeDataDefaultValue % 60
      // 获取当前时间
      let nowDate = new Date()
      // 设置小时数据
      let nowHour = nowDate.getHours()
      let nowMin = nowDate.getMinutes()
      let startMin = nowMin + minMinutes
      if (nowHour + maxHours < 24) {
        // 预约时间不足明天
        scheduleData.day = ['今天']
      } else {
        scheduleData.day = ['今天', '明天']
      }
      if (startMin > 60) {
        minHours++
        startMin = nowMin + minMinutes - 60
      }
      let valueIndex = 0
      for (let i = nowHour + minHours; i < 24; i++) {
        if (i === nowHour + defaultHours) {
          scheduleData.value[2] = valueIndex
        }
        valueIndex++
        hours.push(i)
      }
      // 设置分钟数据
      valueIndex = 0
      for (let i = startMin; i <= 60; i++) {
        if (i === nowMin + defaultMinutes) {
          scheduleData.value[3] = valueIndex
        }
        valueIndex++
        if (i === 60) {
          minutes.push(0)
        } else {
          minutes.push(i)
        }
      }
      scheduleData.hours = hours
      scheduleData.minutes = minutes
      scheduleData.minHours = minHours
      scheduleData.minMinutes = minMinutes
      scheduleData.maxHours = maxHours
      scheduleData.maxMinutes = maxMinutes
      this.setData({ scheduleData, nowDate })
    },
    // endregion

    // region 浓香模式开关切换
    switchAromaChange(event) {
      let model = event.detail
      this.setData({
        switchAroma: parseComponentModel(model),
      })
    },
    // endregion

    // region 预约开关切换
    scheduleSwitchChange(event) {
      let model = event.detail
      let selectedFunction = this.data.selectedFunction
      let appointTime = selectedFunction.settingsData[EC.settingApiKey.appointTime]
      let cookTime = selectedFunction.expectedCookTime || 0
      if (!cookTime) {
        // 工作时间
        let setWorkTimeConfig = selectedFunction.settingsData[EC.settingApiKey.workTime]
        if (setWorkTimeConfig) {
          if (setWorkTimeConfig.codeName !== 'onlyOption') {
            cookTime = setWorkTimeConfig.properties.defaultValue
          } else {
            cookTime = setWorkTimeConfig.properties.value
          }
        }
      }
      let settingModal = this.data.settingModal
      if (model.selected) {
        // 打开预约窗口
        this.scheduleDataInit({ appointTime, cookTime })
        this.confirmSchedule()
        // this.showScheduleModal();
        settingModal.confirmText = '开始预约'
      } else {
        this.cancelSchedule()
        settingModal.confirmText = '开始烹饪'
      }
      this.setData({
        switchSchedule: parseComponentModel(model),
        settingModal,
      })
    },
    // endregion

    // region 显示烹饪时间对话框
    showWorkTimeModal() {
      let workTimeModal = this.data.workTimeModal
      workTimeModal.isShow = true
      this.setData({ workTimeModal })
    },
    closeWorkTimeModal() {
      let workTimeModal = this.data.workTimeModal
      workTimeModal.isShow = false
      this.setData({ workTimeModal })
    },
    // endregion

    // region 显示预约时间对话框
    showScheduleModal() {
      let scheduleModal = this.data.scheduleModal
      scheduleModal.isShow = true
      this.setData({ scheduleModal })
    },
    closeScheduleModal() {
      let scheduleModal = this.data.scheduleModal
      scheduleModal.isShow = false
      this.setData({ scheduleModal })
    },
    // endregion

    // region 工作时间参数初始化
    workTimeDataInit({ appointTime }) {
      let appointTimeData = appointTime.properties
      let appointTimeDataMin = Number(appointTimeData.min)
      let workTimeData = this.data.workTimeData
      let hours = []
      let minutes = []
      let minHours = Math.floor(appointTimeDataMin / 60)
      let maxHours = Math.floor(appointTimeData.max / 60)
      let minMinutes = appointTimeDataMin % 60
      let maxMinutes = appointTimeData.max % 60
      // 设置小时数据
      for (let i = minHours; i <= maxHours; i++) {
        hours.push(i)
      }
      // 设置分钟数据
      let initEndMin = hours.length === 1 ? maxMinutes + 1 : 60
      for (let i = minMinutes; i < initEndMin; i++) {
        minutes.push(i)
      }
      workTimeData.minHours = minHours
      workTimeData.minMinutes = minMinutes
      workTimeData.maxHours = maxHours
      workTimeData.maxMinutes = maxMinutes
      workTimeData.hours = hours
      workTimeData.minutes = minutes
      this.setData({ workTimeData })
    },
    // endregion

    // region 烹饪时间选择
    workTimePickerOnChange(e) {
      // 数据联动修改
      let val = e.detail.value
      console.log('val', val)
      let hoursIndex = val[1]
      let workTimeData = this.data.workTimeData
      let minHours = workTimeData.minHours
      let minMinutes = workTimeData.minMinutes
      let maxHours = workTimeData.maxHours
      let maxMinutes = workTimeData.maxMinutes

      let minutes = []
      if (hoursIndex === 0) {
        // 筛选最小分钟
        let initEndMin = workTimeData.hours.length === 1 ? maxMinutes + 1 : 60
        for (let i = minMinutes; i < initEndMin; i++) {
          minutes.push(i)
        }
      } else if (hoursIndex === workTimeData.hours.length - 1) {
        // 筛选最大分钟
        for (let i = 0; i <= maxMinutes; i++) {
          minutes.push(i)
        }
      } else {
        let initEndMin = workTimeData.hours.length === 1 ? maxMinutes + 1 : 60
        for (let i = 0; i < initEndMin; i++) {
          minutes.push(i)
        }
      }

      workTimeData.minutes = minutes
      if (val[2] > workTimeData.minutes.length - 1) {
        val[2] = 0
      }
      workTimeData.value = val

      // let workTimeHours = workTimeData.hours[val[1]]
      // let workTimeMinutes = workTimeData.minutes[val[2]]
      // let workTimeSeconds = workTimeHours * 60 * 60 + workTimeMinutes * 60
      // workTimeData.result = Format.formatSeconds(workTimeSeconds)
      this.setData({ workTimeData })
    },
    // endregion

    // 确认烹饪时间
    confirmWorkTime() {
      let workTimeData = this.data.workTimeData
      let val = workTimeData.value
      let workTimeHours = workTimeData.hours[val[1]]
      let workTimeMinutes = workTimeData.minutes[val[2]]
      let workTimeSeconds = workTimeHours * 60 * 60 + workTimeMinutes * 60
      workTimeData.result = Format.formatSeconds(workTimeSeconds)
      workTimeData.resultLabel =
        (workTimeData.result.hours ? workTimeData.result.hours + '小时' : '') +
        (workTimeData.result.minutes ? workTimeData.result.minutes + '分钟' : '')
      this.setData({ workTimeData })
      this.closeWorkTimeModal()
      console.log('确认烹饪时间: ', workTimeData)
    },

    updateStatus() {
      return new Promise((resolve, reject) => {
        requestService
          .request('luaGet', {
            applianceCode: this.properties.applianceData.applianceCode,
            command: {},
            reqId: getStamp().toString(),
            stamp: getStamp(),
          })
          .then((res) => {
            do {
              console.log('获取设备状态')
              console.log(res)
              if (res.data.code != 0) {
                let msg = EC.handleErrorMsg(res.data.code)
                // MideaToast(msg);
                this.updateViewOnlineToggle(false)
                resolve(res)
                break
              }
              this.updateViewOnlineToggle(true)
              try {
                this.dataInit(res.data.data)
              } catch (e) {
                console.error(e)
              }
              resolve(res)
            } while (false)

            this.setData({
              _applianceData: {
                onlineStatus: 1,
                offlineFlag: false,
              },
            })

            wx.setStorage({
              key: 'offlineFlag',
              data: false,
            })
          })
          .catch((err) => {
            let res = err.data
            if (res) {
              if (res.result && res.result.returnData) {
                res = JSON.parse(res.result.returnData)
              }
              do {
                if (res.code != 0) {
                  if (res.code == 1307) {
                    break
                  }
                  // if(res.code==1306){
                  //   this.showNoticeBar('设备当前为无杯状态，请正确安装杯体后使用。');
                  //   break;
                  // }
                  let msg = EC.handleErrorMsg(res.code)
                  // MideaToast(msg);
                  this.updateViewOnlineToggle(false)
                  break
                }
                MideaToast('未知错误-状态')
              } while (false)
            }
            resolve()
            if (err && err.data && (err.data.code == 1307 || err.data.code == 40670)) {
              this.setData({
                _applianceData: {
                  onlineStatus: 0,
                  offlineFlag: true,
                },
              })
              wx.setStorage({
                key: 'offlineFlag',
                data: true,
              })
            }
          })
      })
    },
    getDestoried() {
      //执行当前页面前后插件的业务逻辑，主要用于一些清除工作
      try {
        let intervalKey = wx.getStorageSync('ECInterval' + this.properties.applianceData.applianceCode)
        if (intervalKey) {
          clearInterval(intervalKey)
        }
        if (deviceStatusTimer) {
          clearInterval(deviceStatusTimer)
        }
        // 数据初始化
        deviceStatusTimer = null
      } catch (e) {
        console.error(e)
      }
    },
    requestControl(command) {
      // wx.showNavigationBarLoading()
      // wx.showLoading({mask: true})
      // 埋点
      let params = {
        control_params: JSON.stringify(command),
      }
      this.rangersBurialPointClick('plugin_button_click', params)
      return requestService.request('luaControl', {
        applianceCode: this.properties.applianceData.applianceCode,
        command: command,
        reqId: getStamp().toString(),
        stamp: getStamp(),
      })
    },
    noop() {},
    // 埋点
    rangersBurialPointClick(eventName, param) {
      let deviceInfo = this.data.deviceInfo
      if (deviceInfo) {
        let paramBurial = {}
        let paramBase = {
          module: '插件',
          apptype_name: '电蒸锅',
          deviceInfo: {
            widget_cate: deviceInfo.type,
            sn8: deviceInfo.sn8,
            a0: deviceInfo.modelNumber,
            iot_device_id: deviceInfo.applianceCode,
          },
        }
        paramBurial = Object.assign(paramBase, param)
        rangersBurialPoint(eventName, paramBurial)
      }
    },
    // endregion
  },

  attached() {
    const app = getApp()
    let deviceInfo = this.data.deviceInfo
    const { statusBarHeight, windowHeight } = wx.getSystemInfoSync()
    this.setData({
      navBarHeight: 46 + statusBarHeight,
    })
    wx.nextTick(() => {
      Object.assign(deviceInfo, this.properties.applianceData)
      this.setData({
        uid: app.globalData.userData.uid,
        _applianceData: this.properties.applianceData,
        deviceInfo: deviceInfo,
      })
      let param = {}
      param['page_name'] = '首页'
      param['object'] = '进入插件页'
      this.rangersBurialPointClick('plugin_page_view', param)
      // this.updateDataAndUI(this.data._applianceDataStatus)
      this.getProductConfig().then(() => {
        this.updateStatus().then(() => {
          this.deviceStatusInterval()
          this.setData({
            isInit: true,
          })
          // 获取功能区域高度
          wx.createSelectorQuery()
            .in(this)
            .select('.options-wrapper')
            .fields(
              {
                size: true,
              },
              (res) => {
                console.log(res)
                if (res) {
                  let limitRate = res.height / windowHeight
                  if (limitRate > 0.4) {
                    this.setData({
                      isBottomFixed: false,
                    })
                  } else {
                    this.setData({
                      isBottomFixed: true,
                    })
                  }
                }
              }
            )
            .exec()
        })
      })
    })
  },
})
