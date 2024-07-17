const pageMixin = require('../utils/mixins/pageMixin');
const pluginMixin=require('m-miniCommonSDK/utils/plugin-mixin')
import PopupParams from '../assets/js/model/PopupParams'
import ResultUtil from '../assets/js/model/ResultUtil'
import Mode from '../assets/js/model/Mode'

const {
  screenHeight,
  screenWidth
} = wx.getSystemInfoSync()

function _isSmallScreen() {

  return (screenHeight / screenWidth).toFixed(2) <= (16 / 9).toFixed(2)
}

function _screenHeightRpx() {
  return 750 * screenHeight / screenWidth
}

Page({
  behaviors: [pluginMixin, pageMixin],
  /**
   * 页面的初始数据
   */
  data: {
    isSmallScreen: _isSmallScreen(),
    screenHeightRpx: _screenHeightRpx(),
    deviceHeightRpx: _isSmallScreen() ? 560 : 620,
    imageSuffix: _isSmallScreen() ? '_16x9' : '',
    operations: [{
        key: 'continue',
        action: 'work'
      },
      {
        key: 'pause',
        action: 'pause'
      },
      {
        key: 'finish',
        action: 'standby'
      },
      {
        key: 'cancel',
        action: 'standby'
      }
    ],
    popupParams: null,
    popupCustomStyle: "border-top-left-radius: 26rpx;border-top-right-radius:26rpx;",
    paramsPopupVisibility: false,
    paramsPopupOverlayClosed: true,
    optionsPopupVisibility: false,
    optionsPopupOverlayClosed: true,
    bubble: null,
    scrollTop: 0
  },

  changeWorkStatus(event) {
    console.log('changeWorkStatus', event.currentTarget.dataset)
    const {
      key,
      action
    } = event.currentTarget.dataset.operation;

    if (key === 'continue') {
      const {
        currentMode
      } = this.data.deviceStatus;
      const tips = this.data.deviceStatus.getTips(currentMode.afterValidations)
      if (tips) {
        this.showModal(tips)
        return
      }
    }

    let params = {
      work_status: action
    };

    this.luaControl(params)
  },

  bubbling() {

    if (this.data.loadingPluginData || this.data.state !== 2) {
      return
    }

    let bubble = {
      text: '',
      show: true
    }
    const {
      currentMode
    } = this.data.deviceStatus
    const validations = currentMode ? currentMode.afterValidations : (this.data.pluginData.config.validations || [])
    const tips = this.data.deviceStatus.getTips(validations)
    if (tips) {
      bubble.text = tips
    }

    this.setData({
      bubble
    })
  },

  bindscroll(event) {
    let {
      scrollTop
    } = event.detail
    this.data.scrollTop = scrollTop
  },

  getCountdownInstance() {
    return this.selectComponent('#countdown')
  },

  controlCountdown(key) {
    const countdownComponent = this.getCountdownInstance();
    console.log('countdownComponent', countdownComponent)
    if (!countdownComponent) {
      return
    }

    if (key === 'pause') {
      countdownComponent.pause()
    }

    if (key === 'continue') {
      countdownComponent.start();
    }
  },

  countdownChange(event) {
    const {
      value
    } = event.detail;
    this.timeLeft = value
  },

  onModeButtonClicked(event) {

    const {
      index,
      mode
    } = event.currentTarget.dataset
    this.clickTracking('onModeButtonClicked', {
      rank: index,
      object_type: 'modeKey',
      object_id: mode.modeKey,
      object_name: mode.name,
      ext_info: mode
    })

   
    const selectedMode = new Mode(mode, this.data.pluginCommonData, this.data.pluginData.config)
    console.log('onModeButtonClicked:', mode,"selectedMode:",selectedMode)

    const tips = this.data.deviceStatus.getTips(selectedMode.beforeValidations)
    if (tips) {
      this.showModal(tips)
      return
    }

    if(this.data.deviceStatus.isError) {
      this.showModal("设备出现故障")
      return
    }
    if(this.data.deviceStatus.isLocked) {
      this.showModal("童锁已开启")
      return
    }

    this.openPopup(selectedMode)
  },

  openPopup(mode) {
    const popupParams = new PopupParams(mode, this.data.deviceStatus, this.timeLeft);
    this.updatePopupParams(popupParams)
    this.showParamsPopup()
  },

  updatePopupParams(popupParams = this.data.popupParams) {
    this.setData({
      popupParams
    })
  },

  edit() {
    const {
      currentMode,
      editable
    } = this.data.deviceStatus;
    if (!editable) {
      return;
    }

    const tips = this.data.deviceStatus.getTips(currentMode.beforeValidations)
    if (tips) {
      this.showModal(tips)
      return
    }
    if(this.data.deviceStatus.isError) {
      this.showModal("设备出现故障")
      return
    }
    if(this.data.deviceStatus.isLocked) {
      this.showModal("童锁已开启")
      return
    }

    this.openPopup(currentMode)
  },

  moreOptionsButtonClicked() {
    this.showOptionsPopup()
  },

  jumpToRecipeHome() {
    this.jumpTo('recipeHome', {
      deviceInfo: this.data.deviceInfo
    })
  },

  jumpToDownload() {
    this.jumpTo('download', {}, {
      withinPlugin: false
    })
  },

  showParamsPopup() {
    this.showPopup('params')
  },

  hideParamsPopup() {
    this.hidePopup('params')
  },

  showOptionsPopup() {
    this.showPopup('options')
  },

  hideOptionsPopup() {
    this.hidePopup('options')
  },

  showPopup(key) {
    this.setOverlayState(key, false)
    this.setState(`${key}PopupVisibility`, true);
  },

  hidePopup(key) {
    this.setState(`${key}PopupVisibility`, false);

  },

  setOverlayState(key, flag) {
    this.setState(`${key}PopupOverlayClosed`, flag);
  },

  onParamsPopupClosed() {
    console.log('onPopupClosed')
    wx.nextTick(() => {
      this.setOverlayState('params', true)
      this.destroyParamsObejct()
    })
  },

  onOptionsPopupClosed() {
    this.setOverlayState('options', true)
  },

  onIndexChanged(e) {
    const {
      activeIndex
    } = e.detail

    this.setObject('popupParams', {
      activeIndex
    })
  },

  onSettingChange(e) {
    console.log('onSettingChange event', e)
    const {
      key,
      value
    } = e.detail;
    this.data.popupParams.markChangedSettings(key, value)
    this.updatePopupParams()
  },

  onOptionChange(e) {
    console.log('onOptionChange event', e)
    const {
      key,
      value
    } = e.detail;
    this.data.popupParams.markBufferChangedSettings(key, value)
  },

  validateBeforeStart() {
    const {
      isWorking,
      selectedMode
    } = this.data.popupParams
    if (!isWorking && selectedMode.startAlertTips) {
      this.showModal(selectedMode.startAlertTips, {
        confirmText: '马上启动'
      }, this.start)
      return
    }

    this.start()
  },

  onOptionsPopupComfirm() {
    this.data.popupParams.mergeChangedSettings()
    this.updatePopupParams()
    this.hideOptionsPopup()
  },

  start() {
    const params = this.data.popupParams.getControlParams();
    console.log('start controlParams ', params)

    if (Object.keys(params).length === 0) {
      this.hideParamsPopup()
      return;
    }

    if (!this.allowControl(params)) {
      return
    }

    this.luaControl(params)
      .then(res => {
        this.hideParamsPopup()
      })
      .catch(e => {
        this.hideParamsPopup()
      })
  },

  allowControl(params) {
    let validations = []
    if (params['steam_quantity']) {
      validations = validations.concat([
        "isLackWaterBox",
        "isLackWater",
        "needChangeWater"
      ])
    }

    const tips = this.data.deviceStatus.getTips(validations)
    if (tips) {
      this.showModal(tips)
      return false
    }

    return true
  },

  resetScrollViewPosition(deviceStatus) {

    if (!this.data.deviceStatus) {
      return
    }

    if (this.data.deviceStatus.isWorking !== deviceStatus.isWorking) {
      this.setData({
        scrollTop: 0
      })
    }
  },

  onOperationalEntranceClicked(event) {
    const {
      type,
      linkUrl,
      imageUrl
    } = event.currentTarget.dataset.data
    this.clickTracking('onOperationalEntranceClicked', {
      object_type: type,
      object_id: linkUrl,
      object_name: imageUrl
    })
    this.jumpTo('webview', {
      url: encodeURIComponent(this.data.pageData.operationalEntrance.linkUrl),
      deviceInfo: this.data.deviceInfo
    })
  },

  destroyParamsObejct() {
    this.setData({
      popupParams: null
    })
  },

  countTap() {
    if (typeof this.count === 'undefined') {
      this.count = 0
    }
    ++this.count
    console.log('countTap count:', this.count)
    console.log('jsonConfigedSn8', this.jsonConfigedSn8)
    if (this.count === 6) {
      this.count = 0
      this.longPressQuery()
    }
  },

  scanCode() {
    const context = this
    wx.scanCode({
      onlyFromCamera: true,
      scanType: ['barcode'],
      success(res) {
        console.log('yzc scanCode => success:', JSON.stringify(res))
        const {
          scanType,
          result
        } = res

        // if(scanType === 'QR_CODE') {
        //     // TODO
        //     return
        // }

        // demo scanType CODE_128
        context.getRecipeFromBarcode(result)
      },
      fail(e) {
        console.log('yzc scanCode => fail:', JSON.stringify(e))
        // context.showModal('扫码失败')
      }
    })
  },

  getRecipeFromBarcode(barcode) {
    const data = {
      barcode,
      sn8: this.data.sn8
    }
    this.fetch('getRecipeFromBarcode', data).then(recipeId => {
      console.log('yzc getRecipeFromBarcode => recipeId', recipeId)
      this.jumpTo('recipeDetail', {
        recipeId,
        deviceInfo: this.data.deviceInfo
      });
    }).catch(err => {
      console.log('yzc getRecipeFromBarcode => err:', err)
      this.showModal('暂不支持该类型扫码')
    })
  },

  longPressQuery() {
    this.renderingQuery()
      .then(result => {
        const sortedOriginalDeviceStatus = JSON.stringify(this.sortObjectByKey(ResultUtil.getData(result)))

        const deviceInfo = JSON.stringify(this.data.deviceInfo);
        const content = `deviceInfo:\n${deviceInfo}\n deviceStatus:\n${sortedOriginalDeviceStatus}`

        this.showModal(content, "设备信息")
      })
  },

  sortObjectByKey(unordered) {
    const ordered = {}
    Object.keys(unordered)
      .sort()
      .forEach(key => {
        if (unordered[key] instanceof Object) {
          ordered[key] = this.sortObjectByKey(unordered[key])
        } else {
          ordered[key] = unordered[key]
        }
      })
    return ordered
  },

  openMiniProgram(event) {
    const {
      miniProgramName,
      route,
      params
    } = event.currentTarget.dataset.data
    this._openMiniProgram(miniProgramName, route, params)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUrlparams(options, {
      callback: this.query
    })
    this.pageViewTracking()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      fromApp: false
    })
    if (this.data.online) {
      this.renderingQuery(true)
    }
  },

  query() {
    this.clearTimer()
    this.getApp().globalData.timer = setInterval(this.renderingQuery.bind(this, true), 2000)
    // console.log('query timer', this.getApp().globalData.timer)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // this.destoriedPlugin()
    this.clearTimer()
  },

  clearTimer() {
    // console.log('-----clearTimer-----')
    // console.log('timer', this.getApp().globalData.timer)
    if (this.getApp().globalData.timer) {
      clearInterval(this.getApp().globalData.timer)
      // console.log('clear timer', this.getApp().globalData.timer)
    }
    this.getApp().globalData.timer = null
    // console.log('timer', this.getApp().globalData.timer)
    // console.log('-----clearTimer-----')
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return this.commonShareSetting()
  }
})
