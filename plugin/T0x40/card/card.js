import { CARD_MODE_OPTION } from '../../../pages/common/js/cardMode'
import { requestService } from '../../../utils/requestService'
import { getReqId, getStamp } from 'm-utilsdk/index'

//const isMock = false

Component({
  options: {
    multipleSlots: true, // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    applianceData: {
      type: Object,
      value: {},
    },
  },
  data: {
    version: '1.20220706.1700',
    isInit: false, //*****固定方法，供外界调用****
    isQueryOffLine: false, //查询失败导致离线
    status: {}, //设备状态数据
    isDeviceOnline: false, // 获取设备信息离线，或查询失败导致离线
    queryTimer: null, // wifi连接时轮询定时器
    controlLock: false, // wifi连接时控制锁
  },
  lifetimes: {
    detached: function () {
      if (this.data.queryTimer != null) {
        clearInterval(this.data.queryTimer)
      }
      this.setData({ queryTimer: null })
    },
  },
  methods: {
    //*****固定方法，供外界调用****
    //当设备列表页切换到当前页面时，应该呈现的整体样式
    getCurrentMode() {
      let mode
      if (this.data.applianceData.onlineStatus == 0 || this.data.isQueryOffLine) {
        // 离线
        mode = CARD_MODE_OPTION.OFFLINE
      } else {
        // 在线
        mode = CARD_MODE_OPTION.COLD
      }
      return {
        applianceCode: this.data.applianceData.applianceCode,
        mode,
      }
    },
    //当设备列表页切换到当前页面时触发
    getActived() {
      // 请求完新版本信息的回调
      // 通知外界更新界面
      this.triggerEvent('modeChange', this.getCurrentMode())
      // 刷新设备状态
      console.log('lmn>>> getActived')
      wx.showLoading({
        title: '获取状态中...',
      })
      this.queryAndUpdateView()
      // 轮询状态
      let that = this
      let timer = setInterval(() => {
        if (that.data.isDeviceOnline && !that.data.controlLock) {
          that.queryAndUpdateView()
        }
      }, 3000)
      this.setData({ queryTimer: timer })
    },
    //初始化卡片页，只执行一次
    initCard() {
      this.queryAndUpdateView()
    },
    queryAndUpdateView() {
      this.luaQuery()
        .then((data) => {
          if (this.data.controlLock) {
            this.setData({ isQueryOffLine: false })
          } else {
            this.setData({
              isQueryOffLine: false,
              status: data,
              isInit: true,
            })
          }
          this.updateUI()
          wx.hideLoading()
          console.log('lmn>>> rece(query back)::' + JSON.stringify(this.data.status))
        })
        .catch((error) => {
          this.setData({
            isQueryOffLine: true,
            isInit: true,
          })
          wx.hideLoading()
          console.log('lmn>>> rece(query back)::' + JSON.stringify(error))
        })
    },
    //*****固定方法，供外界调用****
    updateUI() {
      //更新界面
      wx.showNavigationBarLoading()
      this.triggerEvent('modeChange', this.getCurrentMode())
      //TO-DO
      if (this.data.applianceData.onlineStatus == 0 || this.data.isQueryOffLine) {
        this.setData({
          // 离线
          isDeviceOnline: false,
        })
      } else {
        this.setData({
          // 在线
          isDeviceOnline: true,
        })
      }
      wx.hideNavigationBarLoading()
    },
    controlDevice(data) {
      let json = data.detail
      this.setData({ controlLock: true })
      wx.showLoading({
        title: '设备控制中...',
      })
      this.luaControl(json)
        .then((data) => {
          this.setData({
            status: data,
            controlLock: false,
          })
          wx.hideLoading()
          //console.log('lmn>>> rece(control back)::' + JSON.stringify(this.data.status))
        })
        .catch((error) => {
          this.setData({ controlLock: false })
          wx.hideLoading()
          console.error(error)
          // wx.showToast({
          //   title: '设备控制失败，请稍后重试',
          //   icon: 'none',
          //   duration: 1000
          // })
        })
    },
    //查询设备状态并更新界面
    luaQuery() {
      return new Promise((resolve, reject) => {
        wx.showNavigationBarLoading()
        this.triggerEvent('modeChange', this.getCurrentMode())
        // if (isMock) {
        //   this.setData({
        //     status: mockData.luaGet.data,
        //   })
        //   resolve(mockData.luaGet.data)
        //   return
        // }
        let reqData = {
          reqId: getReqId(),
          stamp: getStamp(),
          applianceCode: this.data.applianceData.applianceCode,
          command: {},
        }
        requestService.request('luaGet', reqData).then(
          (resp) => {
            wx.hideNavigationBarLoading()
            if (resp.data.code == 0) {
              this.setData({
                status: resp.data.data,
              })
              resolve(resp.data.data || {})
            } else {
              reject(resp)
            }
          },
          (error) => {
            wx.hideNavigationBarLoading()
            console.error(error)
            reject(error)
          }
        )
      })
    },
    //查询设备状态并更新界面
    luaControl(param) {
      //console.log('lmn>>> send::' + JSON.stringify(param));
      return new Promise((resolve, reject) => {
        wx.showNavigationBarLoading()
        // if (isMock) {
        //   resolve(mockData.luaControl.data.status)
        //   return
        // }
        let reqData = {
          reqId: getReqId(),
          stamp: getStamp(),
          applianceCode: this.data.applianceData.applianceCode,
          command: {
            control: param,
          },
        }
        requestService.request('luaControl', reqData).then(
          (resp) => {
            wx.hideNavigationBarLoading()
            if (resp.data.code == 0) {
              resolve(resp.data.data.status || {})
            } else {
              reject(resp)
            }
          },
          (error) => {
            wx.hideNavigationBarLoading()
            wx.showToast({
              title: '设备未响应，请稍后尝试刷新',
              icon: 'none',
              duration: 2000,
            })
            console.error(error)
            reject(error)
          }
        )
      })
    },
  },
})
