import images from '../assets/img'
import computedBehavior from '../../../utils/miniprogram-computed'
import { getReqId, getStamp } from 'm-utilsdk/index'
import { requestService, rangersBurialPoint } from '../../../utils/requestService'
import { pluginEventTrack } from '../../../track/pluginTrack'

let otaTimer = 0
const downStair = ['73100289', '73100321', '00110B01_1', '00110B01_2', '73110Q15_1', '7310031N'] // 单柜使用下柜上报的数据

Component({
  behaviors: [computedBehavior],
  properties: {
    applianceData: {
      type: Object,
      value: {},
    },
  },
  data: {
    version: 0,
    confObj: {},
    curModeName: '',
    images,
    status: {},
    orderTime: '',
    isShowStartTimePicker: false,
    //*****固定方法，供外界调用****
    isInit: false,
    showOrder: false,
    orderArray: [],
    orderIndex: [0, 0, 0],
    orderUnit: ['', '时', '分'],
    orderValue: '',
  },
  computed: {
    iconColor() {
      // return '#ececec'
      return '#6575ff'
      const { type, deviceStatus, status } = this.data
      if (!status || !status.temperature || deviceStatus === -1) return
      return (
        (type === 'colmo' && // colmo
          ((deviceStatus >= 4 && getColor('gray')) || // 关机/离线/故障/出水断电
            getColor('yellow'))) ||
        (type === 'toshiba' && // 东芝
          ((deviceStatus >= 4 && getColor('gray')) || // 关机/离线/故障/出水断电
            getColor('yellow'))) ||
        (deviceStatus >= 4 && getColor('gray')) || //midea // 关机/离线/故障/出水断电
        (status.temperature < 40 && getColor('yellow')) ||
        (status.temperature < 60 && getColor('yellow')) ||
        (status.temperature >= 60 && getColor('yellow')) ||
        '' // 加载未完成时不显示，以免旋转动画失效或界面闪现不同颜色影响观感
      )
    },
    confObj() {
      let temp = wx.getStorageSync(`${this.properties.applianceData.applianceCode}confObj`)
      return temp
    },
  },
  pageLifetimes: {
    show: function () {
      rangersBurialPoint('user_page_view', {
        page_path: 'plugin/T0xB3/card/card',
        module: '插件',
        page_id: 'page_control',
        page_name: '消毒柜插件首页',
        object_type: '',
        object_id: '',
        object_name: '',
        device_info: {},
      })
      // pluginEventTrack('user_page_view', null, {
      //   page_id: 'page_control',
      //   page_name: '消毒柜插件首页',
      //   path: 'plugin/T0xB3/index/index'
      // }, {custom_path: 'plugin/T0xB3/index/index'})
      if (this.data.isInit) {
        this.luaQuery().then((data) => {
          let curMode = this.getCurModeName(data).mode
          this.setData({
            curModeName: curMode.text,
          })
        })
      }
    },
  },
  methods: {
    loadMode() {
      images.modeSelect = images.modeSelect + ' '
    },
    loadOrder() {
      images.order_temp = images.order_temp + ' '
    },
    getTempTime() {
      let date = new Date()
      return date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + ' '
    },
    changeTab(e) {
      this.luaQuery().then((data) => {
        let curMode = this.getCurModeName(data).mode
        this.setData({
          curModeName: curMode.text,
          status: data,
        })
        this.treatInInervalHandler(data)
      })
    },
    checkStatus() {
      let permit = true
      let curWorkStatus = this.getCurModeName(this.data.status).curWorkStatus
      if (this.data.status.is_error) {
        wx.showToast({
          title: '故障中，请关机',
          icon: 'none',
        })
        permit = false
        return permit
      }
      if (curWorkStatus == 'order' || curWorkStatus == 'working') {
        wx.showToast({
          title: '消毒柜运行中，请先取消工作',
          icon: 'none',
        })
        permit = false
      }
      return permit
    },
    timeLegal(value) {
      let isLegal = false
      let day = value[0]
      let hour = value[1]
      let min = value[2]
      let curHour = new Date().getHours()
      let curMin = new Date().getMinutes()
      if (day == 1) {
        isLegal = true
      } else {
        if (hour > curHour) {
          isLegal = true
        } else if (hour == curHour) {
          if (min > curMin) {
            isLegal = true
          } else {
            isLegal = false
          }
        } else {
          isLegal = false
        }
      }
      return isLegal
    },
    showOrderPicker() {
      if (!this.checkStatus()) return
      let date = new Date()
      let hour = date.getHours()
      let min = date.getMinutes()
      this.setData({
        showOrder: true,
        orderIndex: [0, hour, min],
      })
    },
    orderCancel() {
      this.setData({
        showOrder: false,
      })
    },
    orderPickerSubmit(e) {
      if (!this.checkStatus()) return
      let value = e.detail
      if (!this.timeLegal(value)) {
        // this.orderCancel()
        wx.showToast({
          title: '选择的时间不能小于当前时间哦',
          icon: 'none',
          duration: 2000,
        })
        return
      }
      let day = value[0] == 0 ? '今日 ' : '明日 '
      let min = value[2] < 10 ? '0' + value[2] : value[2]
      let timeValue = day + value[1] + ':' + min
      pluginEventTrack('user_behavior_event', null, {
        page_id: 'page_control',
        page_name: '插件首页',
        widget_id: 'order_confirm',
        widget_name: '预约',
        ext_info: '预约时间 ' + timeValue + ' 预约模式 ' + this.data.curModeName,
      })
      this.setData({
        orderShow: false,
        orderTime: timeValue,
        showOrder: false,
        orderTimeValue: value,
      })

      let setMin = (60 + this.data.orderTimeValue[2] - new Date().getMinutes()) % 60
      let setHour =
        this.data.orderTimeValue[0] * 24 +
        this.data.orderTimeValue[1] -
        new Date().getHours() -
        (this.data.orderTimeValue[2] >= new Date().getMinutes() ? 0 : 1)

      let params = {
        selectType: wx.getStorageSync('selectedType') || 1,
        order_hour: setHour,
        order_min: setMin,
        is_order: 'open',
      }
      let stairFlag = this.getStair()
      if (stairFlag == 'up') {
        params.upstair_mode = wx.getStorageSync(`${this.properties.applianceData.applianceCode}modeKey`) || '7'
      } else if (stairFlag == 'middle') {
        params.middlestair_mode = wx.getStorageSync(`${this.properties.applianceData.applianceCode}modeKey`) || '7'
      } else {
        params.downstair_mode = wx.getStorageSync(`${this.properties.applianceData.applianceCode}modeKey`) || '7'
      }
      this.luaControl(params).then(() => {
        this.luaQuery(true).then((data) => {
          this.treatInInervalHandler(data)
        })
      })
    },
    async initCard() {
      let hour = []
      let minute = []
      for (let i = 0; i < 24; i++) {
        hour.push(i)
        minute.push(i)
      }
      for (let i = 24; i < 60; i++) {
        minute.push(i)
      }
      this.setData({
        orderArray: [['今日', '明日'], hour, minute],
      })

      //初始化卡片页，只执行一次
      if (!this.data.isInit) {
        await setTimeout(() => {}, 2000)
        let configObj = wx.getStorageSync(`${this.properties.applianceData.applianceCode}confObj`)
        this.setData({ confObj: configObj })
        this.luaQuery(true) // 页面初始化的时候是否显示加载中
          .then((data) => {
            this.setData({
              status: data,
              isInit: true,
            })
            // this.updateUI();
            this.treatInInervalHandler(data)
            this.queryIntervalHandler()
          })
          .catch((error) => {
            this.setData({
              isInit: true,
            })
            this.queryIntervalHandler()
          })
      }
    },
    getDestoried() {
      if (this.data.queryTimeout) {
        clearTimeout(this.data.queryTimeout)
        clearInterval(otaTimer)
      }
      this.setData({
        isInit: false,
      })
    },
    getStair() {
      let version = wx.getStorageSync('snver')
      let selectedType = wx.getStorageSync('selectedType')
      let configObj = wx.getStorageSync(`${this.properties.applianceData.applianceCode}confObj`)
      let stairNum = configObj.modeList.length
      if (selectedType == undefined || configObj == undefined) {
        return 'down'
      }
      let stair = 0
      if (stairNum == 1) {
        stair = downStair.includes(version) ? 'down' : 'up'
      } else if (stairNum == 2) {
        stair = selectedType == 0 ? 'up' : 'down'
      } else {
        stair = ['up', 'middle', 'down'][selectedType]
      }
      return stair
    },
    getCurModeName(status) {
      let version = wx.getStorageSync('snver')
      let isSingleOta = wx.getStorageSync('isSingleOta')
      let selectedType = wx.getStorageSync('selectedType')
      let configObj = wx.getStorageSync(`${this.properties.applianceData.applianceCode}confObj`)
      let stairNum = configObj.modeList.length
      let modeKey = wx.getStorageSync(`${this.properties.applianceData.applianceCode}modeKey`) || -1
      let otaMode = wx.getStorageSync('selectMode')
      if (isSingleOta == undefined || selectedType == undefined || configObj == undefined) {
        return {}
      }
      let stair = 0
      let stairIndex = 0
      if (stairNum == 1) {
        stair = downStair.includes(version) ? 'down' : 'up'
        stairIndex = 0
      } else if (stairNum == 2) {
        stair = selectedType == 0 ? 'up' : 'down'
        stairIndex = selectedType == 0 ? 0 : 1
      } else {
        stair = ['up', 'middle', 'down'][selectedType]
        stairIndex = selectedType
      }
      let curWorkStatus = status[`${stair}stair_work_status`]
      let curModeKey = status[`${stair}stair_mode`]
      let mode = {}
      let modeList = [...configObj.modeList[stairIndex], ...configObj._modeList[stairIndex]]
      if (curWorkStatus == 'order' || curWorkStatus == 'working') {
        if (curModeKey == 36) {
          this.test().then((res) => {
            mode = Object.assign(res, { text: res.name, key: 36 })
            this.setData({
              curModeName: res.name,
            })
          })
        } else {
          mode =
            modeList.find((item) => {
              return item.key == curModeKey
            }) || modeList[0]
        }
      } else {
        // if (modeKey == 36) {
        //   mode = Object.assign(otaMode, { text: otaMode.name, key: 36 })
        // } else {
        mode =
          modeList.find((item) => {
            return item.key == modeKey
          }) || modeList[0]
        // }
      }
      return { mode, curWorkStatus }
    },
    luaQuery(loading = true) {
      //查询设备状态
      return new Promise((resolve, reject) => {
        if (loading) {
          wx.showLoading({
            title: '加载中',
            mask: true,
          })
        }
        let reqData = {
          reqId: getReqId(),
          stamp: getStamp(),
          applianceCode: this.properties.applianceData.applianceCode,
          command: {},
        }
        requestService.request('luaGet', reqData).then(
          (resp) => {
            if (loading) {
              wx.hideLoading()
            }
            if (resp.data.code == 0) {
              resolve(resp.data.data || {})
            } else {
              reject(resp)
            }
          },
          (error) => {
            if (loading) {
              wx.hideLoading()
            }
            if (error && error.data) {
              if (error.data.code == 1307) {
                //离线
                this.setData({
                  'applianceData.onlineStatus': '0',
                })
                this.triggerEvent('modeChange', this.getCurrentMode()) // 这一步是为了同步首页中的mode 没有用到
              }
            }
            reject(error)
          }
        )
      })
    },
    luaControl(param) {
      //控制设备
      return new Promise((resolve, reject) => {
        wx.showLoading({
          title: '加载中',
          mask: true,
        })
        let reqData = {
          reqId: getReqId(),
          stamp: getStamp(),
          applianceCode: this.properties.applianceData.applianceCode,
          command: {
            control: param,
          },
        }
        requestService.request('luaControl', reqData).then(
          (resp) => {
            wx.hideLoading()
            if (resp.data.code == 0) {
              resolve(resp.data.data || {})
            } else {
              reject(resp)
            }
          },
          (error) => {
            wx.hideLoading()
            wx.showToast({
              title: '请求失败，请稍后重试',
              icon: 'none',
              duration: 2000,
            })
            console.error(error)
            reject(error)
          }
        )
      })
    },
    getCurrentMode() {
      //当设备列表页切换到当前页面时，应该呈现的整体样式
      let mode
      if (this.properties.applianceData.onlineStatus == 0) {
        // 离线
        mode = CARD_MODE_OPTION.OFFLINE
      } else {
        // 在线
        mode = CARD_MODE_OPTION.HEAT
      }
      return {
        applianceCode: this.properties.applianceData.applianceCode,
        mode: mode,
      }
    },
    navigateToModeSelect() {
      if (!this.checkStatus()) return
      let powerState = wx.getStorageSync('powerState') || false
      if (!this.data.applianceData.onlineStatus || !powerState) {
        return
      }
      if (this.data.status.lock == 'lock') {
        //童锁默认值为false，有童锁功能才会有lock的场景
        // nativeService.toast('设备处于童锁状态，请解锁后操作')
        wx.showToast({
          title: '设备处于童锁状态，请解锁后操作',
          icon: 'none',
        })
        return
      }
      if (this.data.status.is_error) {
        return
      }
      pluginEventTrack('user_behavior_event', null, {
        page_id: 'page_control',
        page_name: '插件首页',
        widget_id: 'navigate_mode_select',
        widget_name: '跳转按钮',
        ext_info: '跳转至模式选择页',
      })
      wx.navigateTo({
        url:
          './../mode-select/mode-select?deviceInfo=' +
          encodeURIComponent(JSON.stringify(this.properties.applianceData)) +
          '&status=' +
          encodeURIComponent(JSON.stringify(this.data.status)),
        // complete: () => this.navigateToEd = false,
      })
    },
    treatInInervalHandler(data) {
      // this.dealError(data)
      let orderTimeResult = this.dealOrderTime(data)
      let flag =
        data.upstair_work_status == 'order' ||
        data.downstair_work_status == 'order' ||
        data.middlestair_work_status == 'order'
      let curMode = this.getCurModeName(data).mode
      this.setData({
        status: data,
        orderTime: flag ? orderTimeResult.orderDay + ' ' + orderTimeResult.orderTime : '暂无预约',
        curModeName: curMode.text,
      })
      wx.setStorage({
        key: `${this.properties.applianceData.applianceCode}modeKey`,
        data: curMode.key,
      })
      // this.test()
    },
    // 轮询
    queryIntervalHandler() {
      let self = this
      if (self.data.queryTimeout) {
        clearTimeout(self.data.queryTimeout)
      }
      self.data.queryTimeout = setTimeout(() => {
        self
          .luaQuery(false)
          .then((data) => {
            this.treatInInervalHandler(data)
            self.queryIntervalHandler()
          })
          .catch((error) => {
            self.queryIntervalHandler()
          })
      }, 4000)
    },
    test() {
      return new Promise((resolve, reject) => {
        let req = {
          msg: 'CloudTimingSeqMode',
          params: {
            applianceId: this.properties.applianceData.applianceCode,
            action: 'get',
            modeId: 0,
          },
        }
        let req1 = {
          msg: 'getCloudTimingSeqList',
          params: {},
        }
        requestService.request('/cfhrs/b3/v1/api', req1).then((res) => {
          let modeList = res.data.result
          requestService.request('/cfhrs/b3/v1/api', req).then((resMode) => {
            let modeId = resMode.data.result
            let mode = modeList.find((item) => {
              return item.id == modeId.modeId
            })
            resolve(mode)
          })
        })
      })
    },
    async dealError(data) {
      if (!data.is_error) {
        return
      } else {
        let reqData = {
          reqId: getReqId(),
          stamp: getStamp(),
          applianceCode: this.properties.applianceData.applianceCode,
          command: {
            query: { query_type: 'error_query', query_code: 'error_query' },
          },
        }
        requestService
          .request('luaGet', reqData)
          .then((data) => {})
          .catch((e) => {})
      }
    },
    dealOrderTime(status) {
      let hour = status['order_hour']
      let min = status['order_min']
      let today = new Date()
      let endTimeStamp = today.getTime() + hour * 60 * 60 * 1000 + min * 60 * 1000
      let endDate = new Date(endTimeStamp)
      let orderDay =
        endDate.getFullYear() > today.getFullYear()
          ? '明日'
          : endDate.getMonth() > today.getMonth()
          ? '明日'
          : endDate.getDate() > today.getDate()
          ? '明日'
          : '今日'
      let formHour = endDate.getHours() < 10 ? '0' + endDate.getHours() : endDate.getHours()
      let formMin = endDate.getMinutes() < 10 ? '0' + endDate.getMinutes() : endDate.getMinutes()
      let orderTime = formHour + ':' + formMin
      return { orderDay, orderTime }
    },
  },
})
