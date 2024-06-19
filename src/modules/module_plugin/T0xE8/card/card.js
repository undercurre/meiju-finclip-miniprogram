const app = getApp() //获取应用实例
const requestService = app.getGlobalConfig().requestService
const rangersBurialPoint = app.getGlobalConfig().rangersBurialPoint
import { getStamp } from 'm-utilsdk/index'
import { imageDomain,commonApi } from '../assets/scripts/api'

import {
  EC,
  addZero,
  getCurrentAppointTime,
  mm2HHmmText,
  deviceStatusBg,
  workStatus2Text,
  mm2HHmmStr,
  getWorkFinishTime,
  sortObj,
} from './js/EC.js'
import { DeviceData } from '../assets/scripts/device-data'
import MideaToast from '../component/midea-toast/toast'
import { Format } from '../assets/scripts/format'
import { UI } from '../assets/scripts/ui'
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
    bgImage: {
      url_bg: imageDomain + '/0xE8/home_bg.png',
      url_device: imageDomain + '/0xE8/icon_device.png',
      url_device_offLine: imageDomain + '/0xE8/icon-device_offline.png',
    },
    runningStatusArr: ['schedule', 'working', 'pause', 'keepWarm'], // 运行中的状态
    deviceStatusBg: '',
    configList: [],
    quickDevJson: undefined,
    deviceInfo: {
      isOnline: false,
      isRunning: false,
    },
    isInit: false,
    isOnce: true,
    iconUrl: {
      aroma: imageDomain + '/0xEC/icon-aroma.png',
      aiSmart: imageDomain + '/0x3F/icon_smart.png',
      smartDiy: imageDomain + '/0x3F/icon_diy.png',
    },
    noticeBar: {
      isShow: false,
      content: '内容',
      type: 'info',
    },
    selectedFunction: {},
    settingModal: {
      isShow: false,
      params: {
        taste: undefined,
        pressureLevel: undefined,
      },
    },
    tasteModal: {
      title: '口感',
      currentTarget: {},
      options: [],
    },
    workTimeModal: {
      defaultValue: 0,
      currentText: '30分钟',
    },
    appointModal: {
      defaultValue: 0,
      currentText: '',
      isSwitch: false,
    },
    workStatus: {},
    tabList: [
      {
        value: 0,
        label: '快捷烹饪',
      },
    ],
    activeTabIndex: 0,
    bottomBtns: [
      {
        value: 'standby',
        label: '结束',
        iconSrc: imageDomain + '/0xE8/icon-standby.png',
        isShow: true,
      },
      {
        value: 'modifyParam',
        label: '烹饪调节',
        iconSrc: imageDomain + '/0xE8/icon-modifyParam.png',
        isShow: true,
      },
      {
        value: 'work',
        label: '立即启动',
        iconSrc: imageDomain + '/0xE8/icon-work.png',
        isShow: false,
      },
      {
        value: 'keepWork',
        label: '继续烹饪',
        iconSrc: imageDomain + '/0xE8/icon-work.png',
        isShow: false,
      },
    ],
    bottomBar: [
      {
        // onIcon:'/assets/image/example/bottom-bar/icon_ comfortwhite@3x.png',
        // offIcon:'/assets/image/example/bottom-bar/icon_ comfortgray@3x.png',
        describe: '结束',
        text: '',
        onColor: '#267aff',
        offColor: '#f2f2f2',
        cover: true,
        status: false,
      },
    ],
    errorCodeMap: {},
    isSetOtherMenu: false,
    statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'], //顶部状态栏的高度
    // endregion
  },
  methods: {
    // 切换tab
    checkTab(e) {
      let data = this.data
      let currentModeType = data.currentModeType
      let activeTabIndex = data.activeTabIndex
      activeTabIndex = e.currentTarget.dataset.item.value
      this.setData({ activeTabIndex })
      // 控制tab显示，自动切换
      if (currentModeType == 3 && activeTabIndex == 1) {
        activeTabIndex = 0
        MideaToast('请取出胶囊后再启动即热模式~')
        setTimeout(() => {
          this.setData({ activeTabIndex })
        }, 1500)
      } else if (currentModeType == 1 && activeTabIndex == 0) {
        activeTabIndex = 1
        MideaToast('请投入胶囊后再启动胶囊模式~')
        setTimeout(() => {
          this.setData({ activeTabIndex })
        }, 1500)
      }
    },
    // 设置离线状态
    updateViewOnlineToggle(isOnline) {
      let deviceInfo = this.data.deviceInfo
      deviceInfo.isOnline = isOnline
      this.setData({ deviceInfo })
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
        this.setData({ noticeBar })
      } while (false)
    },
    closeNoticeBar() {
      let noticeBar = this.data.noticeBar
      noticeBar.isShow = false
      this.setData({ noticeBar })
    },
    // 获取diy名称
    getMenuName() {
      return new Promise((resolve, reject) => {
        const app = getApp()
        const uriParams = {
          applianceId: this.properties.applianceData.applianceCode,
          applianceType: 'E8',
          modelNo: this.properties.applianceData.sn8,
          userId: app.globalData.userData.iotUserId,
          queryType: 1,
        }
        const sendParams = {
          serviceName: 'remote-control',
          uri: 'v2/E8' + '/control/getStatus' + Format.jsonToParam(uriParams),
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
    // region 数据初始化
    async dataInit(newDeviceStatus) {
      let data = this.data
      let deviceInfo = data.deviceInfo
      let configList = data.configList
      let workStatus = data.workStatus
      let bottomBtns = data.bottomBtns
      let runningStatusArr = data.runningStatusArr
      console.log('数据初始化')
      if (newDeviceStatus) {
        Object.assign(deviceInfo, newDeviceStatus)
        console.log(deviceInfo, 33333333)
        deviceInfo.isRunning = runningStatusArr.indexOf(deviceInfo.workStatus) > -1 // 配置设备状态
        deviceInfo.workText = workStatus2Text[deviceInfo.workStatus]
        deviceInfo.deviceStatusBg = deviceInfo.isOnline ? deviceStatusBg[deviceInfo.workStatus] : ''
        if (deviceInfo.workStatus == 'working') {
          deviceInfo.workText = workStatus2Text[deviceInfo.cookingProcess] || '工作中'
          if ([9, 10].indexOf(deviceInfo.runMode) > -1) {
            deviceInfo.workText = '工作中'
          }
        }
        // 工作模式
        if (deviceInfo.isRunning) {
          let runMode = deviceInfo.runMode
          let currentFunction = {}
          if (runMode != 0) {
            if (configList && configList.length > 0) {
              // 本地功能
              for (let j = 0; j < configList.length; j++) {
                let functionItem = configList[j]
                if (functionItem.code == runMode) {
                  currentFunction = functionItem
                  break
                }
              }
            }
            if (currentFunction.code) {
              this.setData({ isSetOtherMenu: false })
            } else if (deviceInfo.runMode != deviceInfo?.currentFunction?.code) {
              // 初始化非本地功能
              this.setData({ isSetOtherMenu: true })
              const menuDetail = await this.getMenuName()
              const menuRes = JSON.parse(menuDetail.data.result.returnData)
              const resData = menuRes.data
              currentFunction = JSON.parse(JSON.stringify(configList.find((item) => item.code == 1)))
              currentFunction.name = resData.extended.name
              currentFunction.code = resData.extended.runMode
              let appointModal = data.appointModal
              appointModal = Object.assign(appointModal, currentFunction.settingsData.appointTime)
              this.setData({ appointModal })
            } else {
              // 已初始化非本地功能
              currentFunction = deviceInfo.currentFunction
            }
            if (deviceInfo.workStatus == 'working') {
              // 计算剩余工作时间
              currentFunction.timeType = '剩余时间'
              const remainWorkMinutes = parseInt(deviceInfo.remainWorkTimeSecond / 60)
              currentFunction.remainWorkTime = mm2HHmmStr(remainWorkMinutes)

              currentFunction.descText = `预计${getWorkFinishTime(remainWorkMinutes)}完成烹饪`
            } else if (deviceInfo.workStatus == 'schedule') {
              // 计算预约时间
              currentFunction.timeType = '预计开始时间'
              const remainAppointTime = parseInt(deviceInfo.remainAppointTimeSecond / 60)
              currentFunction.remainWorkTime = getWorkFinishTime(
                remainAppointTime - parseInt(deviceInfo.remainWorkTimeSecond / 60)
              )
              currentFunction.remainWorkTime = currentFunction.remainWorkTime.substring(2)
              currentFunction.descText = `已预约${getWorkFinishTime(remainAppointTime)}完成烹饪`
            } else if (deviceInfo.workStatus == 'keepWarm') {
              // 计算保温时间
              currentFunction.timeType = '已保温时长'
              const remainKeepWarmTimeSecond = parseInt(deviceInfo.remainKeepWarmTimeSecond / 60)
              currentFunction.remainWorkTime = mm2HHmmStr(remainKeepWarmTimeSecond)
              currentFunction.descText = ''
            }
            deviceInfo.currentFunction = currentFunction
          }
          // 工作中底部控制显示， 默认展示“结束”
          for (let i = 1; i < bottomBtns.length; i++) {
            bottomBtns[i].isShow = false
          }
          switch (deviceInfo.workStatus) {
            case 'schedule':
              if (deviceInfo.remainAppointTimeSecond !== deviceInfo.remainWorkTimeSecond) {
                bottomBtns[1].isShow = true
                bottomBtns[2].isShow = true
              }
              break
            case 'working':
              // bottomBtns[3].isShow = true
              break
            case 'pause':
              bottomBtns[3].isShow = true
              break
            case 'keepWarm':
              break
            default:
              break
          }
          this.setData({ bottomBtns })
        }
      }
      // 处理故障信息
      if (deviceInfo.errorCode != '0') {
        const option = this.data.errorCodeMap(deviceInfo.errorCode)
        this.showNoticeBar(option.name)
      }
      this.setData({ deviceInfo, workStatus })
    },
    // endregion

    // region 显示参数设置对话框
    showSettingModal() {
      let settingModal = this.data.settingModal
      settingModal.isShow = true
      this.setData({ settingModal })
    },
    closeSettingModal() {
      let settingModal = this.data.settingModal
      settingModal.isShow = false
      this.setData({ settingModal })
    },
    // 设置口味
    tasteSetting(e) {
      const tasteModal = e.detail
      const selectOption = tasteModal.options.find((item) => item.value == tasteModal.currentTarget.value)
      const timeArr = [parseInt((selectOption.time * 1) / 60), (selectOption.time * 1) % 60]
      let appointModal = this.data.appointModal // 切换口味的同时重置预约时间
      appointModal.defaultValue = selectOption.time * 1
      let currentAppoint = getCurrentAppointTime(appointModal.defaultValue * 1)
      appointModal.currentText = `${currentAppoint[0] ? '今天' : '明天'}${currentAppoint[1]}:${addZero(
        currentAppoint[2]
      )}完成`
      this.setData({ appointModal, tasteModal })
      this.workTimeSetting({ detail: timeArr })
    },
    // 设置工作时间
    workTimeSetting(e) {
      const val = e.detail
      let data = this.data
      let workTimeModal = data.workTimeModal
      workTimeModal.defaultValue = val[0] * 60 + val[1]
      workTimeModal.currentText = mm2HHmmText(workTimeModal.defaultValue)

      // 配置对应taste
      let selectedFunction = data.selectedFunction
      if (selectedFunction.hasTaste) {
        let tasteModal = data.tasteModal
        for (let i = 0; i < tasteModal.options.length; i++) {
          let item = tasteModal.options[i]
          if (item.maxTime * 1 >= workTimeModal.defaultValue && item.minTime <= workTimeModal.defaultValue) {
            tasteModal.currentTarget = item
            this.setData({ tasteModal })
            break
          }
        }
      }

      let appointModal = data.appointModal // 更新工作时间后，更新预约对象
      appointModal.workTime = workTimeModal.defaultValue
      if (workTimeModal.defaultValue > appointModal.defaultValue) {
        // 如果设置的工作时间大于预约的默认时间，则将默认预约时间设置为工作时间
        appointModal.defaultValue = workTimeModal.defaultValue
        let currentAppoint = getCurrentAppointTime(appointModal.defaultValue * 1)
        appointModal.currentText = `${currentAppoint[0] ? '今天' : '明天'}${currentAppoint[1]}:${addZero(
          currentAppoint[2]
        )}完成`
      }
      this.setData({ workTimeModal, appointModal })
    },
    // 设置预约功能
    appointSetting(e) {
      let appointModal = e.detail
      this.setData({ appointModal })
      if (appointModal.isScheduleCheck) {
        // 预约参数调节
        let deviceInfo = this.data.deviceInfo
        const controlParams = {
          workSwitch: 'schedule',
          appointTimeSecond: appointModal.defaultValue * 60,
          workTimeSecond: deviceInfo.remainWorkTimeSecond,
          runMode: deviceInfo.runMode,
          mouthfeel: deviceInfo.mouthfeel,
        }
        if (this.data.isSetOtherMenu) {
          // 非本地功能的情况
          controlParams.subCmd = 3
        }
        this.onClickControl(controlParams)
      }
    },
    // 控制预约开关
    setAppointSwitch(e) {
      let appointModal = e.detail
      this.setData({ appointModal })
    },
    // 工作中操作底部按钮
    ctrlWork(e) {
      const ctrlVal = e.currentTarget.dataset.item.value
      let data = this.data
      let deviceInfo = data.deviceInfo
      if (ctrlVal == 'modifyParam') {
        // 烹饪调节就弹窗
        let appointModal = data.appointModal
        let currentFunction = deviceInfo.currentFunction
        console.log(currentFunction)
        appointModal = currentFunction.settingsData.appointTime.properties
        appointModal.workTime = deviceInfo.workTimeSecond / 60
        appointModal.defaultValue = deviceInfo.remainAppointTimeSecond / 60
        appointModal.isScheduleCheck = true
        this.setData({ appointModal })
      } else {
        const params = {
          workSwitch: ctrlVal,
          workTimeSecond: deviceInfo.remainWorkTimeSecond,
          runMode: deviceInfo.runMode,
          mouthfeel: deviceInfo.mouthfeel,
        }
        if (this.data.isSetOtherMenu) {
          params.subCmd = 3
        }
        this.onClickControl(params).then((res) => {
          // MideaToast('设备已结束工作');
        })
      }
    },
    // region 获取产品配置
    getProductConfig() {
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
          bigVer: 5,
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
            console.log('获取产品配置')
            console.log(deviceInfo)
            // 设置页面功能
            let resData = null
            resData = JSON.parse(res.data.result.returnData)
            do {
              if (res.data.errorCode == 50300 || res.data.errorCode == 1001) {
                // 无资源重定向
                EC.redirectUnSupportDevice(this.properties.applianceData)
                break
              }
              if (res.data.errorCode != 0) {
                let msg = EC.handleErrorMsg(res.code)
                MideaToast(msg)
                break
              }
              let quickDevJson = EC.quickDevJson2Local(resData)
              let configList = []
              // 过滤快捷功能
              quickDevJson.functions.forEach((functionsItem) => {
                do {
                  let attributesSetting = functionsItem.settingsData[EC.settingApiKey.attributes]
                  if (attributesSetting) {
                    if (attributesSetting.properties.intelligentCook) {
                      break
                    }
                  }
                  configList.push(functionsItem)
                } while (false)
              })
              console.log(configList, 7777777777777)
              configList.sort((a, b) => {
                return sortObj[a.code * 1] - sortObj[b.code * 1]
              })
              this.setData({ configList, deviceInfo, quickDevJson, errorCodeMap: resData.quickDevJson })
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
    // region 点击功能项
    onClickFunction(event) {
      do {
        let deviceInfo = this.data.deviceInfo
        if (!deviceInfo.isOnline) {
          MideaToast('设备已离线，请检查设备状态')
          break
        }
        if (deviceInfo.isRunning) {
          MideaToast('设备烹饪中^如需启动新的程序，请先结束当前烹饪')
          break
        }
        let functionItem = event.currentTarget.dataset.item
        let selectedFunction = functionItem
        console.log('选中的功能项')
        console.log(selectedFunction)
        let appointModal = this.data.appointModal
        let workTimeModal = this.data.workTimeModal
        // 重置set条件
        selectedFunction.settings.forEach((item) => {
          if (item.apiKey == 'setWorkTime') {
            if (item.properties.defaultValue) {
              // 可配置工作时间
              selectedFunction.hasWorkTime = true
              workTimeModal = item.properties
              workTimeModal.currentText = mm2HHmmText(workTimeModal.defaultValue)
            } else {
              // 默认工作时间
              workTimeModal.defaultValue = item.properties.value
            }
            this.setData({ workTimeModal })
          } else if (item.apiKey == 'appointTime') {
            selectedFunction.hasAppoint = true
            appointModal = item.properties
            appointModal.isSwitch = false
          } else if (item.apiKey == 'taste') {
            if (item.properties.options.length > 1) {
              selectedFunction.hasTaste = true
            }
            let tasteModal = this.data.tasteModal
            tasteModal.options = item.properties.options
            tasteModal.title = item.properties.title
            tasteModal.currentTarget = tasteModal.options.find((t) => t.value == item.properties.defaultValue)
            this.setData({ tasteModal })
          }
        })
        if (workTimeModal.defaultValue > appointModal.defaultValue) {
          // 如果设置的工作时间大于预约的默认时间，则将默认预约时间设置为工作时间
          appointModal.defaultValue = workTimeModal.defaultValue
        }
        appointModal.workTime = workTimeModal.defaultValue
        let currentAppoint = getCurrentAppointTime(appointModal.defaultValue * 1)
        appointModal.currentText = `${currentAppoint[0] ? '今天' : '明天'}${currentAppoint[1]}:${addZero(
          currentAppoint[2]
        )}完成`

        if (selectedFunction.hasWorkTime || selectedFunction.hasAppoint || selectedFunction.taste) {
          this.setData({ selectedFunction, appointModal })
          this.showSettingModal()
        } else {
          // 快速启动
          wx.showModal({
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
    // region 启动功能
    onClickControl(controlParams) {
      return new Promise((resolve, reject) => {
        UI.showLoading()
        this.clearDeviceStatusInterval()
        this.requestControl({
          control: controlParams,
        })
          .then((res) => {
            UI.hideLoading()
            this.dataInit(res.data.data.status)
            this.deviceStatusInterval()
            resolve()
          })
          .catch((err) => {
            let res = err
            do {
              UI.hideLoading()
              if (res.data.code != 0) {
                let msg = EC.handleErrorMsg(res.data.code)
                MideaToast(msg)
                break
              }
              this.dataInit(res.data.data.status)
              this.deviceStatusInterval()
            } while (false)
          })
      })
    },
    // region 开始烹饪
    startWork() {
      let data = this.data
      let selectedFunction = data.selectedFunction
      let deviceInfo = data.deviceInfo
      if (!deviceInfo.isOnline) {
        MideaToast('设备已离线')
        return
      }
      if (deviceInfo.waterShortageState == 'waterShortage') {
        MideaToast('水箱缺水，请加水后再尝试启动')
        return
      }
      if (deviceInfo.errorCode != 0) {
        let option = data.errorCodeMap(deviceInfo.errorCode)
        MideaToast(option)
        return
      }
      if (deviceInfo.isRunning) {
        MideaToast('设备烹饪中^如需启动新的程序，请先结束当前烹饪')
        return
      }
      let controlParams = {
        runMode: selectedFunction.code,
        workSwitch: 'work',
      }
      if (selectedFunction.hasAppoint) {
        let appointModal = data.appointModal
        if (appointModal.isSwitch) {
          controlParams.workSwitch = 'schedule'
          controlParams.appointTimeSecond = appointModal.defaultValue * 60
        } else {
          controlParams.workSwitch = 'work'
        }
      }
      if (selectedFunction.hasWorkTime) {
        let workTimeModal = data.workTimeModal
        controlParams.workTimeSecond = workTimeModal.defaultValue * 60
      } else {
        controlParams.workTimeSecond = selectedFunction.setWorkTime * 60
      }
      if (selectedFunction.hasTaste) {
        let tasteModal = data.tasteModal
        controlParams.mouthfeel = tasteModal.currentTarget.desc
      }

      console.log('11111111111111111', controlParams)
      this.onClickControl(controlParams)
      this.closeSettingModal()
    },
    // endregion

    // region 停止工作
    stopWork() {
      let content = '是否立即结束设备工作'
      let deviceInfo = this.data.deviceInfo
      let quickDevJson = this.data.quickDevJson
      if (quickDevJson.workStatusMap) {
        switch (deviceInfo.work_status) {
          case quickDevJson.workStatusMap.appoint.value:
            content = '是否结束当前预约'
            break
        }
      }

      wx.showModal({
        title: content,
        confirmText: '结束',
        success: (res) => {
          if (res.confirm) {
            let controlParams = {
              workSwitch: 'standby',
            }
            this.onClickControl(controlParams).then((res) => {
              MideaToast('设备已结束工作')
            })
          }
        },
      })
    },
    // endregion

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
              // console.log('获取设备状态');
              // console.log(res);
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
    // 选择胶囊
    selectTeaMode(e) {
      const activeTeaId = e.currentTarget.dataset.item.id
      this.setData({ activeTeaId })
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
          apptype_name: '电炖锅',
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
      this.getProductConfig().then(() => {
        this.updateStatus().then(() => {
          this.deviceStatusInterval()
          this.setData({
            isInit: true,
          })
        })
      })
    })
  },
})
