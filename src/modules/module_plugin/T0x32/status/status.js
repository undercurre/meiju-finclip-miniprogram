// plugin/T0x32/status/status.js
import { imageDomain } from '../assets/scripts/api'
import MideaToast from '../component/midea-toast/toast'
import { EC } from '../card/js/EC'
import Dialog from 'm-ui/mx-dialog/dialog'
let deviceStatusTimer = null
let isDeviceInterval = true
Page({
  /**
   * 页面的初始数据
   */
  data: {
    pageDisabled: false,
    hasTipModal: false,
    isLoading: false,
    title: '电蒸锅',
    iconUrl: {
      bg: imageDomain + '/0x32/bg-working.png',
    },
    buttons: [
      {
        key: 'stop',
        icon: imageDomain + '/0x32/btn_stop.png',
        text: '结束',
      },
      // {
      //   key: 'edit',
      //   icon: imageDomain + '/0x32/btn_control.png',
      //   text: '烹饪调节',
      // },
      {
        key: 'pause',
        icon: imageDomain + '/0x32/btn_pause.png',
        text: '暂停',
      },
    ],
    urlParams: {},
    menuName: '',
    timeDesc: '',
    countDownTime: '',
    finishTime: '',
    settingArr: [],
    statusBarModel: {},
    cardComponent: null,
    noticeBarParams: {
      isShow: false,
      color: '#FFAA10',
      bgColor: '#FFF6E7',
      content: '',
    },
    settingModalParams: {
      isShow: false,
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('页面参数: ', options)
    this.setData({
      urlParams: options,
    })
    // 启动定时器，获取设备状态
    this.updateStatus(options)
    // this.showNoticeBar({
    //   type: 'error',
    //   content: '水箱水量不足，设备已暂停。请加水后点击继续烹饪。'
    // });
  },

  // 销毁定时器
  destroyTimer() {
    if (deviceStatusTimer) {
      clearInterval(deviceStatusTimer)
      deviceStatusTimer = null
    }
  },

  // region 方法
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
  // 显示或隐藏loading遮罩
  showLoading() {
    this.setData({
      isLoading: true,
    })
  },
  hideLoading() {
    this.setData({
      isLoading: false,
    })
  },
  // 设置底部按钮
  setFooterButtons(workStatus) {
    let buttons = this.data.buttons
    switch (workStatus) {
      case 'standby':
        break
      case 'pause':
        buttons = [
          {
            key: 'stop',
            icon: imageDomain + '/0x32/btn_stop.png',
            text: '结束',
          },
          {
            key: 'continue',
            icon: imageDomain + '/0x32/btn_start.png',
            text: '继续',
          },
        ]
        break
      case 'schedule':
        buttons = [
          {
            key: 'stop',
            icon: imageDomain + '/0x32/btn_stop.png',
            text: '结束',
          },
          // {
          //   key: 'edit',
          //   icon: imageDomain + '/0x32/btn_control.png',
          //   text: '烹饪调节',
          // },
        ]
        break
      default:
        buttons = [
          {
            key: 'stop',
            icon: imageDomain + '/0x32/btn_stop.png',
            text: '结束',
          },
          // {
          //   key: 'edit',
          //   icon: imageDomain + '/0x32/btn_control.png',
          //   text: '烹饪调节',
          // },
          {
            key: 'pause',
            icon: imageDomain + '/0x32/btn_pause.png',
            text: '暂停',
          },
        ]
        // 云食谱不可调节
        // let cardComponent = this.data.cardComponent
        // let prefabMenu = cardComponent.data.prefabMenu
        // const configList = cardComponent.data.configList
        // const foodArr = [...configList, ...prefabMenu]
        // let currentFunction = {}
        // let deviceInfo = cardComponent.data.deviceInfo
        // const workMode = deviceInfo.runMode
        // if (foodArr && foodArr.length > 0) {
        //   for (let j = 0; j < foodArr.length; j++) {
        //     let functionItem = foodArr[j]
        //     if (functionItem.code == workMode) {
        //       currentFunction = functionItem
        //       break
        //     }
        //   }
        // }
        // if (!currentFunction.code) {
        //   buttons.splice(1, 1)
        // }
        break
    }
    this.setData({ buttons })
  },
  // 确认修改设置
  onConfirmSetting(event) {
    console.log('确认修改设置: ', event)
    let model = event.detail
    let settingList = model.data
    let cardComponent = this.data.cardComponent
    let deviceInfo = cardComponent.data.deviceInfo
    let controlParams = {
      runMode: deviceInfo.runMode,
      workSwitch: 'modifyParam',
      targetTemperature: 0,
      time: {},
      codeId: 4,
      subCmd: 1,
    }
    settingList.forEach((item) => {
      switch (item.key) {
        case EC.settingApiKey.workTime:
          // 烹饪时间
          controlParams.time.workTimeSecond = item.result.value
          break
        case EC.settingApiKey.appointTime:
          // 预约时间
          controlParams.time.appointTimeSecond = item.result.value
          break
      }
    })
    cardComponent.onClickControl(controlParams).then((res) => {
      this.updateStatus()
    })
    this.closeSettingModal()
  },
  // 显示或隐藏设置弹框
  showSettingModal() {
    let settingModalParams = this.data.settingModalParams
    settingModalParams.isShow = true
    this.setData({ settingModalParams })
  },
  closeSettingModal() {
    let settingModalParams = this.data.settingModalParams
    settingModalParams.isShow = false
    this.setData({ settingModalParams })
  },
  // 显示或隐藏提示
  showNoticeBar(options) {
    let noticeBarParams = this.data.noticeBarParams
    noticeBarParams.isShow = true
    let type = 'warn'
    if (typeof options === 'string') {
      noticeBarParams.content = options
    } else {
      noticeBarParams.content = options.content
      type = options.type
    }
    switch (type) {
      case 'warn':
        noticeBarParams.color = '#FFAA10'
        noticeBarParams.bgColor = '#FFF6E7'
        break
      case 'error':
        noticeBarParams.color = '#FF3B30'
        noticeBarParams.bgColor = '#FFEBEA'
        break
    }
    this.setData({ noticeBarParams })
  },
  closeNoticeBar() {
    let noticeBarParams = this.data.noticeBarParams
    noticeBarParams.isShow = false
    this.setData({ noticeBarParams })
  },
  updateStatus(options) {
    if (!options) {
      options = this.data.urlParams
    }
    let pages = getCurrentPages()
    let pluginIndexPageIndex = pages.findIndex((item) => item.route.match(/plugin\/T0x(.*)\/index\/index/g))
    if (pluginIndexPageIndex > -1) {
      let pluginIndexPage = pages[pluginIndexPageIndex]
      this.setData({ title: pluginIndexPage.data.title })
      // 获取插件页实例
      let cardComponent = pluginIndexPage.selectComponent('.component' + options.applianceId)
      if (cardComponent) {
        this.setData({ cardComponent })
        let getStatus = () => {
          // console.log('获取插件页实例: ', cardComponent)
          // 获取设备状态
          let deviceInfo = cardComponent.data.deviceInfo
          // 页面刷新
          console.log('获取设备状态: ', deviceInfo)
          this.setStatusBarInfo(deviceInfo)
          this.updatePageByStatus(deviceInfo)
        }
        // 获取设备状态
        if (cardComponent.updateStatus) {
          wx.showLoading()
          this.showLoading()
          getStatus()
          cardComponent.updateStatus().then(() => {
            getStatus()
            wx.hideLoading()
            this.hideLoading()
          })
        } else {
          getStatus()
        }
        // getStatus()
        this.destroyTimer()
        deviceStatusTimer = setInterval(() => {
          if (isDeviceInterval) {
            getStatus()
          }
        }, 5000)
      }
    } else {
      MideaToast('找不到设备状态~')
    }
  },
  // 更新页面数据
  updatePageByStatus(deviceInfo) {
    // 菜单名称
    let menuName = deviceInfo.currentFunction.name || (deviceInfo.cloudMenu && deviceInfo.cloudMenu.name) || '--'
    // 倒计时
    let countDownTime = '--'
    if (deviceInfo.currentTimeLabel) {
      countDownTime = deviceInfo.currentTimeLabel.hour + ':' + deviceInfo.currentTimeLabel.minute
    }
    // 完成时间描述
    let finishTime = deviceInfo.finishTime
    // 设置参数
    let settingArr = []
    // 工作设置时间
    let currentSetLeftTime = Number(deviceInfo.time.workTimeSecond)
    if (currentSetLeftTime) {
      settingArr.push(`蒸煮${Math.floor(currentSetLeftTime / 60)}分钟`)
    }
    // 保温设置时间
    let currentSetKeepWarmTime = Number(deviceInfo.time.keepWarmTimeSecond)
    if (currentSetKeepWarmTime) {
      settingArr.push(`保温${Number((currentSetKeepWarmTime / 3600).toFixed(1))}小时`)
    }
    // 工作状态(时间描述、底部按钮设置)
    let timeDesc = '剩余时间'
    let buttons = this.data.buttons
    console.log('设备状态: ', deviceInfo.workStatus)
    switch (deviceInfo.workStatus) {
      case 'error':
        // this.goBack()
        break
      case 'standby':
        // 待机中
        if (!this.data.hasTipModal && deviceInfo.waterShortageState !== 'waterShortage') {
          this.goBack()
          // this.showModal({
          //   title: '烹饪完成',
          //   content: '快去享用美食吧',
          //   showCancel: false,
          //   confirmText: '知道了',
          //   success: (res) => {
          //     if (res.confirm) {
          //       this.goBack()
          //     }
          //   },
          // })
          // this.setData({ hasTipModal: true })
        }
        break
      case 'keepWarm':
        // 保温中
        timeDesc = '已保温'
        finishTime = ''
        if (currentSetKeepWarmTime) {
          settingArr = [`自动保温${Number((currentSetKeepWarmTime / 60).toFixed(1))}分钟`]
        }
        if (deviceInfo.keepWarmTimeLabel) {
          countDownTime = deviceInfo.keepWarmTimeLabel.hour + ':' + deviceInfo.keepWarmTimeLabel.minute
        }
        buttons = [
          {
            key: 'stop',
            icon: imageDomain + '/0x32/btn_stop.png',
            text: '结束',
          },
        ]
        break
      case 'pause':
        // 暂停中
        timeDesc = '烹饪已暂停，请点击继续烹饪'
        settingArr = []
        finishTime = ''
        buttons = [
          {
            key: 'stop',
            icon: imageDomain + '/0x32/btn_stop.png',
            text: '结束',
          },
          {
            key: 'continue',
            icon: imageDomain + '/0x32/btn_start.png',
            text: '继续',
          },
        ]
        break
      case 'schedule':
        // 预约中
        timeDesc = '预约完成时间'
        buttons = [
          {
            key: 'stop',
            icon: imageDomain + '/0x32/btn_stop.png',
            text: '结束',
          },
          {
            key: 'restart',
            icon: imageDomain + '/0x32/btn_start.png',
            text: '立即启动',
          },
        ]
        break
      default:
        buttons = [
          {
            key: 'stop',
            icon: imageDomain + '/0x32/btn_stop.png',
            text: '结束',
          },
          {
            key: 'pause',
            icon: imageDomain + '/0x32/btn_pause.png',
            text: '暂停',
          },
        ]
        this.setData({ hasTipModal: false })
        break
    }
    // // 设置底部按钮
    // this.setFooterButtons(deviceInfo.workStatus)
    // 错误状态
    if (deviceInfo.waterShortageState === 'waterShortage') {
      this.setData({ pageDisabled: true })
      this.showNoticeBar({
        type: 'error',
        content: '水箱水量不足，设备已暂停。请加水后点击继续烹饪。',
      })
      if (!this.data.hasTipModal) {
        this.showModal({
          title: '水箱水量不足”',
          content: '请及时加水点击“继续烹饪',
          showCancel: false,
          confirmText: '知道了',
          success: (res) => {
            if (res.confirm) {
              this.setData({ hasTipModal: true })
            }
          },
        })
      }
      buttons = [
        {
          key: 'stop',
          icon: imageDomain + '/0x32/btn_stop.png',
          text: '结束',
        },
        {
          key: 'continue',
          icon: imageDomain + '/0x32/btn_start.png',
          text: '继续',
          disabled: true,
        },
      ]
      // 禁用按钮
      // let btnContinue = buttons.find((item) => item.key === 'continue')
      // if (btnContinue) {
      //   btnContinue.disabled = true
      // }
    } else {
      this.setData({ pageDisabled: false })
      this.closeNoticeBar()
    }

    this.setData({
      menuName,
      timeDesc,
      countDownTime,
      finishTime,
      settingArr,
      buttons,
    })
  },
  // 设置状态栏信息
  setStatusBarInfo(deviceInfo) {
    let statusBarModel = EC.setStatusBarInfo(deviceInfo, this.data.statusBarModel, 1)
    this.setData({ statusBarModel })
    // let statusBarModel = this.data.statusBarModel
    // statusBarModel.enabledClick = false
    // if (deviceInfo.isOnline) {
    //   statusBarModel.type = 'normal'
    //   statusBarModel.text = '待机中'
    // } else {
    //   statusBarModel.type = 'disabled'
    //   statusBarModel.text = '已离线'
    // }
    // if (deviceInfo.isRunning) {
    //   // 预计完成时间
    //   statusBarModel.infoTitle = '预计完成时间'
    //   statusBarModel.infoDesc = deviceInfo.finishTime
    //   // 工作中
    //   statusBarModel.type = 'normal'
    //   statusBarModel.text = '烹饪中'
    //   // 保温中
    //   if (deviceInfo.workStatus === 'keepWarm') {
    //     statusBarModel.text = '保温中'
    //   }
    //   // 暂停中
    //   if (deviceInfo.workStatus === 'pause') {
    //     statusBarModel.text = '暂停中'
    //   }
    //   // 预约中
    //   if (deviceInfo.workStatus === 'schedule') {
    //     statusBarModel.text = '预约中'
    //   }
    // }
    // this.setData({ statusBarModel })
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
    console.log('点击按钮: ', event)
    let model = event.currentTarget.dataset
    let options = model.options
    if (options.disabled) {
      return
    }
    let cardComponent = this.data.cardComponent
    let buttons = this.data.buttons
    let targetBtn = buttons.find((item) => item.key === model.key)
    // if (!cardComponent) {
    //   MideaToast('找不到插件页~')
    //   return
    // }
    if (targetBtn) {
      switch (model.key) {
        case 'restart':
          cardComponent.ctrlWork(
            event,
            () => {
              this.updateStatus()
            },
            { context: this }
          )
          break
        case 'stop':
          // 结束烹饪
          this.destroyTimer()
          cardComponent.stopWork(
            () => {
              this.goBack()
            },
            { context: this }
          )
          break
        case 'pause':
          // 暂停烹饪
          cardComponent.ctrlWork(
            event,
            () => {
              targetBtn.key = 'continue'
              targetBtn.icon = imageDomain + '/0x32/btn_start.png'
              targetBtn.text = '继续'
              this.setData({ buttons })
              this.updateStatus()
            },
            { context: this }
          )
          break
        case 'continue':
          // 继续烹饪
          cardComponent.ctrlWork(
            event,
            () => {
              targetBtn.key = 'pause'
              targetBtn.icon = imageDomain + '/0x32/btn_pause.png'
              targetBtn.text = '暂停'
              this.setData({ buttons })
              this.updateStatus()
            },
            { context: this }
          )
          break
        case 'edit':
          // 烹饪调节
          this.showSettingModal()
          break
      }
    } else {
      MideaToast('点了不知道的按钮~')
    }
  },
  // endregion

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
  onUnload() {
    this.destroyTimer()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},
})
