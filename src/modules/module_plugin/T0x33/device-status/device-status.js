// T0xAC//index/index.js

import { mm2HHmmStr, getWorkFinishTime } from '../card/js/plugin-config'
import Dialog from 'm-ui/mx-dialog/dialog'
import pluginMixin from 'm-miniCommonSDK/utils/plugin-mixin'
import { imageDomain } from '../assets/scripts/api'
import { DeviceData } from '../assets/scripts/device-data'
const app = getApp()
let deviceStatusTimer = null
let isDeviceInterval = true
Page({
  behaviors: [pluginMixin],
  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    deviceInfo: {},
    isShowAllParams: false,
    isIpx: app.globalData.isPx,
    iconUrl: {
      arrowDownOrange: imageDomain + '/0x33/arrow-down-orange.png',
    },
    buttons: [
      {
        key: 'stop',
        icon: imageDomain + '/0x33/btn_stop.png',
        text: '结束',
      },
      {
        key: 'pause',
        icon: imageDomain + '/0x33/btn_pause.png',
        text: '暂停',
      },
      {
        key: 'continue',
        icon: imageDomain + '/0x33/btn_start.png',
        text: '继续',
      },
    ],
    statusBarModel: {},
    cardComponent: null,
    paramsArr: [],
    // 是否展示翻面提示
    showNoticeBar: false,
    // 是否第一次展示
    isOnceShowNotice: true,
    toastText: '',
    showParams: {
      wind: false,
      taste: false,
      turn: false,
      fire: false,
    },
    currentDiyWorkTime: '',
  },
  // 判定显示什么参数
  showCanAdjustParams(deviceInfo, quickDevJson) {
    return new Promise((resolve, reject) => {
      // DIY
      let menuId = 0
      if (deviceInfo?.extended.control_type === 'diy') {
        menuId = deviceInfo.extended.diy_params[deviceInfo.step_status - 1].stepMenuCode
      }
      // 其他
      else {
        menuId = deviceInfo.currentFunction.code
      }
      quickDevJson.functions.forEach((item) => {
        if (item.code === menuId) {
          this.adjustQuickConfig(item.settings)
        }
      })
      resolve()
    })
  },
  // 涉及快开配置的可调节参数
  adjustQuickConfig(activedMenuSettings) {
    console.log('activedMenuSettings', activedMenuSettings)
    let showParams = this.data.showParams
    showParams = {
      wind: false,
      taste: false,
      turn: false,
      fire: false,
    }
    activedMenuSettings.forEach((setting, id) => {
      // 风速
      if (
        setting.apiKey == DeviceData.runningParams.WIND_SPEED &&
        setting.properties.ifCanAdjust &&
        (setting.properties.hiddenInWork == false || !setting.properties.hiddenInWork)
      ) {
        showParams.wind = true
      }

      // 口感
      if (setting.apiKey == DeviceData.runningParams.CHOOSE_TASTE && setting.properties.ifCanAdjust) {
        showParams.taste = true
      }

      // 转动
      if (setting.apiKey == DeviceData.runningParams.TURN_STATUS) {
        showParams.turn = true
      }

      // 火力
      if (setting.apiKey == DeviceData.runningParams.HEAT_CONTROL) {
        showParams.fire = true
      }
    })
    console.log('showParams', showParams)
    this.setData({
      showParams,
    })
  },

  updateStatus(option) {
    let pages = getCurrentPages()
    let pluginIndexPageIndex = pages.findIndex((item) => item.route.match(/plugin\/T0x(.*)\/index\/index/g))
    if (pluginIndexPageIndex > -1) {
      let getStatus = () => {
        let pluginIndexPage = pages[pluginIndexPageIndex]
        // 获取插件页实例
        let cardComponent = pluginIndexPage.selectComponent('.component' + option.applianceCode)

        if (cardComponent) {
          this.setData({ cardComponent })
          // 获取设备状态
          let deviceInfo = cardComponent.data.deviceInfo
          let quickDevJson = cardComponent.data.quickDevJson
          // 页面刷新
          console.log('获取设备状态: ', deviceInfo)
          console.log('获取快开: ', quickDevJson)
          this.setStatusBarInfo(deviceInfo)
          // 设置底部按钮
          this.setFooterButtons(deviceInfo.work_status, quickDevJson)
          this.showCanAdjustParams(deviceInfo, quickDevJson).then((res) => {
            this.updatePageByStatus(deviceInfo, quickDevJson)
          })
        }
      }
      // 获取设备状态
      getStatus()
      this.destroyTimer()
      deviceStatusTimer = setInterval(() => {
        if (isDeviceInterval) {
          getStatus()
        }
      }, 5000)
    } else {
      MideaToast('找不到设备状态~')
    }
  },
  // 销毁定时器
  destroyTimer() {
    if (deviceStatusTimer) {
      clearInterval(deviceStatusTimer)
      deviceStatusTimer = null
    }
  },
  closeNoticeBar() {
    let showNoticeBar = this.data.showNoticeBar
    showNoticeBar = false

    this.setData({ showNoticeBar })
  },
  updatePageParamsByStatus(deviceInfo, quickDevJson) {
    let paramsArr = []
    let showParams = this.data.showParams
    let currentDiyWorkTime = this.data.currentDiyWorkTime
    let currentFunction = deviceInfo.currentFunction
    let hasLightStatus = 'lightStatus' in quickDevJson.properties
    let hasTurnStatus = false
    deviceInfo.currentFunction.settings?.forEach((item) => {
      if (item.apiKey === 'turnStatus') {
        hasTurnStatus = true
      }
    })

    if (deviceInfo.work_mode == 110000) {
      if (deviceInfo.version < 6) {
        currentDiyWorkTime = deviceInfo.diy_current_set_work_time
      } else {
        currentDiyWorkTime = Math.floor(deviceInfo.diy_current_set_work_time / 60)
      }
    } else {
      currentDiyWorkTime = deviceInfo.setWorkTime
    }

    // 炉灯
    if (hasLightStatus && deviceInfo.flag_light === '1') {
      paramsArr.push({
        label: `炉灯已开启`,
        key: deviceInfo.flag_light,
      })
    }
    // 转动
    if (hasTurnStatus && deviceInfo.flag_turn === '1' && showParams.turn) {
      paramsArr.push({
        label: `食材转动中`,
        key: deviceInfo.flag_turn,
      })
    }
    // 风速
    let windSpeedOptions = currentFunction.settingsData?.windSpeed?.properties.options
    if (windSpeedOptions && showParams.wind) {
      for (let i = 0; i < windSpeedOptions.length; i++) {
        if (windSpeedOptions[i].value === deviceInfo.motor_speed) {
          paramsArr.push({
            label: `风速：${windSpeedOptions[i].text}`,
            key: windSpeedOptions[i].value,
          })
        }
      }
    } else {
      if (deviceInfo.motor_speed && showParams.wind) {
        // 0-大档 1-中档 2-小档
        paramsArr.push({
          label: `风速：${DeviceData.windSpeed[deviceInfo.motor_speed]}档`,
          key: deviceInfo.motor_speed,
        })
      }
    }

    // 口感
    let tasteOptions = currentFunction.settingsData?.chooseTaste?.properties.options
    if (tasteOptions && showParams.taste) {
      for (let i = 0; i < tasteOptions.length; i++) {
        if (tasteOptions[i].value === deviceInfo.bake_type) {
          if (tasteOptions[i].text.length > 3) {
            paramsArr.push({
              label: tasteOptions[i].text.slice(0, 2),
              key: tasteOptions[i].value,
            })
          } else {
            paramsArr.push({
              label: tasteOptions[i].text,
              key: tasteOptions[i].value,
            })
          }
        }
      }
    } else {
      // 0-脆烤 1-嫩烤
      if (deviceInfo.bake_type && showParams.taste) {
        paramsArr.push({
          label: DeviceData.bakeType[deviceInfo.bake_type],
          key: deviceInfo.bake_type,
        })
      }
    }
    this.setData({
      paramsArr,
      currentDiyWorkTime,
    })
  },
  // 更新页面数据
  updatePageByStatus(deviceInfo, quickDevJson) {
    let currentFunction = deviceInfo.currentFunction
    let cardComponent = this.data.cardComponent
    this.updatePageParamsByStatus(deviceInfo, quickDevJson)
    switch (deviceInfo.work_status) {
      case 'standby':
        this.goBack()
        deviceInfo.isComplete = true
        break
      case 'working':
        // 工作中
        currentFunction.timeType = '剩余时间'
        const remainWorkMinutes = parseInt(deviceInfo.remain_work_time_sec / 60)
        currentFunction.remainWorkTime = mm2HHmmStr(remainWorkMinutes)
        currentFunction.descText = `预计${getWorkFinishTime(remainWorkMinutes)}完成烹饪`
        break
      case 'pause':
        // 暂停中
        let content = ''
        if (deviceInfo.flag_should_adjust_gear === 1) {
          content = '请调节至干煸挡位后再启动'
        } else if (deviceInfo.flag_should_adjust_gear === 2) {
          content = '请调节至嫩烤档位后再启动'
        } else if (deviceInfo.flag_should_close_box === 1) {
          content = '机器盖子已打开，请在倒计时内合盖'
        } else if (deviceInfo?.flag_open_box === '1') {
          content = '空炸炸桶已被取出，'
          if (deviceInfo.isDoor) {
            content = '空炸箱门已打开，'
          }
          if (deviceInfo.isGrill) {
            content = '空炸盖子已打开，'
            if (deviceInfo.device_mode === 0) {
              content = '炸篮/烤盘已被取出，'
            }
          }
          content += '请在倒计时内放回'
        } else {
          content += '请在倒计时内点击继续烹饪'
        }
        currentFunction.timeType = content
        currentFunction.remainWorkTime = `${deviceInfo.currentTimeLabel.hour}:${deviceInfo.currentTimeLabel.minute}`
        currentFunction.descText = ''
        break
      case 'schedule':
        // 预约中
        currentFunction.timeType = '预计开始时间'
        const remainAppointTime = parseInt(deviceInfo.remain_appoint_time_sec / 60)
        currentFunction.remainWorkTime = getWorkFinishTime(
          remainAppointTime - parseInt(deviceInfo.remain_work_time_sec / 60)
        )
        currentFunction.remainWorkTime = currentFunction.remainWorkTime.substring(2)
        currentFunction.descText = `已预约${getWorkFinishTime(remainAppointTime)}完成烹饪`
        break
      case 'keep_warm':
        // 保温中
        currentFunction.timeType = '已保温时长'
        const remainKeepWarmTimeSecond = parseInt(deviceInfo.remain_keep_warm_time_sec / 60)
        currentFunction.remainWorkTime = mm2HHmmStr(remainKeepWarmTimeSecond)
        currentFunction.descText = ''
        break
      case 'error':
        // 故障中
        this.goBack()
        break
      default:
        break
    }
    // 翻面提示
    if (Number(deviceInfo.step_status) === 4 || Number(deviceInfo.step_status) === 2) {
      let isOnceShowNotice = this.data.isOnceShowNotice
      let toastText = ''
      switch (Number(deviceInfo.step_status)) {
        case 2:
          toastText = '预热已完成，请及时放入食材'
          break
        case 4:
          toastText = '将食物翻面烘烤，风味更佳'
          break
        default:
          break
      }
      if (isOnceShowNotice) {
        this.setData(
          {
            showNoticeBar: true,
            toastText,
          },
          () => {
            setTimeout(() => {
              this.closeNoticeBar()
            }, 10000)
          }
        )
        isOnceShowNotice = false
        this.setData({ isOnceShowNotice })
      }
    }
    deviceInfo.currentFunction = currentFunction
    this.setData({
      deviceInfo,
      title: cardComponent.data.deviceName,
    })
  },
  // 设置底部按钮
  setFooterButtons(work_status, quickDevJson) {
    let buttons = this.data.buttons
    let cardComponent = this.data.cardComponent
    let deviceInfo = cardComponent.data.deviceInfo
    console.log('状态页的数据：', work_status, deviceInfo, quickDevJson)

    switch (work_status) {
      case 'standby':
        break
      case 'pause':
        // flag_should_adjust_gear在1和2时都为错误状态，不允许继续烹饪
        if (
          deviceInfo.flag_open_box === '1' ||
          deviceInfo.flag_should_close_box === 1 ||
          deviceInfo.flag_should_adjust_gear === 1 ||
          deviceInfo.flag_should_adjust_gear === 2
        ) {
          buttons = [
            {
              key: 'stop',
              icon: imageDomain + '/0x33/btn_stop.png',
              text: '结束',
            },
          ]
        } else {
          buttons = [
            {
              key: 'stop',
              icon: imageDomain + '/0x33/btn_stop.png',
              text: '结束',
            },
            {
              key: 'continue',
              icon: imageDomain + '/0x33/btn_start.png',
              text: '继续',
            },
          ]
        }
        break
      case 'schedule':
        buttons = [
          {
            key: 'stop',
            icon: imageDomain + '/0x33/btn_stop.png',
            text: '结束',
          },
        ]
        break
      default:
        if (quickDevJson && 'setPauseStatus' in quickDevJson.properties) {
          buttons = [
            {
              key: 'stop',
              icon: imageDomain + '/0x33/btn_stop.png',
              text: '结束',
            },
            {
              key: 'pause',
              icon: imageDomain + '/0x33/btn_pause.png',
              text: '暂停',
            },
          ]
        } else {
          buttons = [
            {
              key: 'stop',
              icon: imageDomain + '/0x33/btn_stop.png',
              text: '结束',
            },
          ]
        }
    }
    this.setData({ buttons })
  },

  // 设置状态栏信息
  setStatusBarInfo(deviceInfo) {
    let statusBarModel = this.data.statusBarModel
    statusBarModel.enabledClick = false
    if (deviceInfo.isOnline) {
      statusBarModel.text = '待机中'
    } else {
      statusBarModel.text = '已离线'
    }
    if (deviceInfo.isRunning) {
      // 工作中
      statusBarModel.text = '工作中'
      // 暂停中
      if (deviceInfo.work_status === 'pause') {
        statusBarModel.text = '暂停中'
      }
      // 预约中
      if (deviceInfo.work_status === 'schedule') {
        statusBarModel.text = '预约中'
      }
    }
    // DIY时的状态按钮
    if (Number(deviceInfo.work_mode) === 110000) {
      if (deviceInfo.extended.diy_params && deviceInfo.extended.diy_params[deviceInfo.curr_work_step - 1].stepName) {
        statusBarModel.text = `${deviceInfo.curr_work_step}/${deviceInfo.diy_total_step} ${
          deviceInfo.extended.diy_params[deviceInfo.curr_work_step - 1].stepName
        }`
      } else {
        statusBarModel.text = `第 ${deviceInfo.curr_work_step}/${deviceInfo.diy_total_step} 步`
      }
    }
    this.setData({ statusBarModel })
  },

  // 返回
  goBack() {
    wx.navigateBack({
      delta: 1,
      fail: (err) => {
        wx.switchTab({
          url: '/pages/index/index',
        })
      },
    })
  },
  // 点击按钮
  onClickButton(event) {
    let deviceInfo = this.data.deviceInfo
    let message = '美味食物马上就到\r\n您还要结束当前烹饪吗'
    let model = event.currentTarget.dataset
    let options = model.options
    if (options.disabled) {
      return
    }
    let controlParams = {}
    let cardComponent = this.data.cardComponent
    let buttons = this.data.buttons
    let targetBtn = buttons.find((item) => item.key === model.key)
    if (targetBtn) {
      switch (model.key) {
        case 'stop':
          // 结束烹饪
          controlParams['work_switch'] = 'standby'
          let confirmButtonText = '结束'
          let cancelButtonText = '继续烹饪'
          if (deviceInfo.work_status === deviceInfo.workStatus['appoint']) {
            message = '是否结束当前预约'
            confirmButtonText = '结束'
            cancelButtonText = '继续预约'
          }
          Dialog.confirm({
            message,
            context: this,
            zIndex: 9999,
            confirmButtonText,
            cancelButtonText,
          })
            .then((res) => {
              if (res.action == 'confirm') {
                cardComponent.onClickControl(controlParams, 'stop')
                this.goBack()
              }
            })
            .catch((error) => {
              if (error.action == 'cancel') {
                // on cancel
              }
            })
          break
        case 'pause':
          // 暂停烹饪
          controlParams['work_switch'] = 'pause'
          message = '是否暂停工作'
          Dialog.confirm({
            message,
            context: this,
            zIndex: 9999,
          })
            .then((res) => {
              if (res.action == 'confirm') {
                cardComponent.onClickControl(controlParams).then((result) => {
                  this.setFooterButtons('pause')
                  targetBtn.key = 'continue'
                  targetBtn.icon = imageDomain + '/0x33/btn_start.png'
                  targetBtn.text = '继续'
                  this.setData({ buttons })
                })
              }
            })
            .catch((error) => {
              if (error.action == 'cancel') {
                // on cancel
              }
            })
          break
        case 'continue':
          // 继续烹饪
          controlParams['work_switch'] = 'keepWork'
          message = '是否继续工作'
          Dialog.confirm({
            message,
            context: this,
            zIndex: 9999,
          })
            .then((res) => {
              if (res.action == 'confirm') {
                cardComponent.onClickControl(controlParams).then((result) => {
                  this.setFooterButtons()
                  targetBtn.key = 'pause'
                  targetBtn.icon = imageDomain + '/0x33/btn_pause.png'
                  targetBtn.text = '暂停'
                  this.setData({ buttons })
                })
              }
            })
            .catch((error) => {
              if (error.action == 'cancel') {
                // on cancel
              }
            })
          break
        default:
          break
      }
    } else {
      MideaToast('点了不知道的按钮~')
    }
  },

  onClickLeft() {
    wx.navigateBack({
      delta: 1,
      fail: (err) => {
        wx.switchTab({
          url: '/pages/index/index',
        })
      },
    })
  },
  // 点击参数的上线箭头
  onClickParamsArrow() {
    this.setData({
      isShowAllParams: !this.data.isShowAllParams,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('页面参数: ', options)

    // 启动定时器，获取设备状态

    this.updateStatus(JSON.parse(options?.deviceInfo))
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.destroyTimer()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},
})
