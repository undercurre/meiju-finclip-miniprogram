import { CARD_MODE_OPTION } from '../../../pages/common/js/cardMode'
import { getReqId, getStamp } from 'm-utilsdk/index'
import { requestService } from '../../../utils/requestService'
import { mockData } from 'assets/js/mockData'
import images from '../assets/js/img'
import computedBehavior from '../../../utils/miniprogram-computed'
import settingBehavior from '../assets/js/setting'
// import { templateIds } from '../../../globalCommon/js/templateIds'
// import { openSubscribe } from '../assets/js/openSubscribe'

const isMock = false

const getColor = function (color) {
  if (color == 'gray') return '#7C879B'
  if (color == 'tomato') return '#FE674A'
  if (color == 'yellow') return '#FFAA10'
  if (color == 'aqua') return '#29C3FF'
  if (color == 'colmo') return '#C26033'
  if (color == 'colmo-gray') return 'rgba(255,255,255,.4)'
  if (color == 'toshiba') return '#F3F3F4'
  if (color == 'toshiba-gray') return '#777879'
  return color
}

Component({
  behaviors: [settingBehavior, computedBehavior],
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
    images,
    isInit: false, //*****固定方法，供外界调用****
    status: {},
    deviceStatus: -1,
    // powerStyles: {
    //   off: {
    //     mainImg: imgSrc + "icon_switch_on02@3x.png",
    //     desc: "开机",
    //   },
    //   on: {
    //     mainImg: imgSrc + "icon_switch_off01@3x.png",
    //     desc: "关机",
    //   },
    // },
    // headerImg: imgSrc + "img_water_heater@3x.png",
    step: 1,
    minTemp: 35,
    maxTemp: 65,
    timeoutHandler: null,
    intervalHandler: null,
    queryTimeout: null,
    changing: false,
    destory: false,
    type: '',
    modal: false, //默认为false，表示故障的弹窗是否打开
  },
  computed: {
    iconColor() {
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
        getColor('yellow') // 加载未完成时不显示，以免旋转动画失效或界面闪现不同颜色影响观感
      )
    },
    color() {
      const { type, deviceStatus, status } = this.data
      return (
        (type === 'colmo' && // colmo
          ((deviceStatus >= 4 && 'colmo-gray') || // 关机/离线/故障/出水断电
            'colmo')) ||
        (type === 'toshiba' && // 东芝
          ((deviceStatus >= 4 && 'toshiba-gray') || // 关机/离线/故障/出水断电
            'toshiba')) ||
        (deviceStatus >= 4 && 'gray') || //midea // 关机/离线/故障/出水断电
        (status.temperature < 40 && 'yellow') ||
        (status.temperature < 60 && 'yellow') ||
        (status.temperature >= 60 && 'yellow') ||
        '' // 加载未完成时不显示，以免旋转动画失效或界面闪现不同颜色影响观感
      )
    },
    isShowFilterInfo() {
      const { setting } = this.data
      if (!setting || !setting.funcList) return
      return setting.funcList.some((item) => item.key === 'filterLife')
    },
    isShowColdWaterMaster() {
      const { setting } = this.data
      if (!setting || !setting.coldCardList) return
      return setting.coldCardList.some((item) => item.key === 'coldWaterMaster' || item.key === 'coldWater')
    },
    isShowAiColdWater() {
      const { setting } = this.data
      if (!setting || !setting.coldCardList) return
      return setting.coldCardList.some((item) => item.key === 'aiColdWater')
    },
    isPowerOffStatus() {
      return this.data.status.power == 'off'
    },
  },
  lifetimes: {
    attached() {
      // 实例化API核心类
      this.getSetting(this.properties.applianceData.sn8)
    },
  },
  methods: {
    //*****固定方法，供外界调用****
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
    getActived() {
      //当设备列表页切换到当前页面时触发
      //通知外界更新界面
      // this.triggerEvent('modeChange', this.getCurrentMode());
      //刷新设备状态
      this.luaQuery()
        .then((data) => {
          this.getSetting(this.properties.applianceData.sn8)
          //激活时再次刷新在线离线状态
          this.setData({
            status: data,
            type: this.data.setting.type || 'default',
          })
          this.updateUI()
          // console.log({
          //   status: this.data.status,
          //   applianceData: this.properties.applianceData,
          //   setting: this.data.setting,
          // });
        })
        .catch((error) => {
          if (error && error.data && error.data.code == 1306) {
            if (!this.data.destory) {
              wx.showToast({
                title: '设备未响应，请稍后尝试刷新',
                icon: 'none',
              })
            }
          }
        })
      this.setData({
        destory: false,
      })
      this.queryIntervalHandler()
    },
    initCard() {
      //初始化卡片页，只执行一次
      if (!this.data.isInit) {
        this.luaQuery(false)
          .then((data) => {
            this.setData({
              status: data,
              isInit: true,
            })
            this.updateUI()
          })
          .catch((error) => {
            this.setData({
              isInit: true,
            })
          })
      }
    },
    //*****固定方法，供外界调用****
    updateUI() {
      this.renderStatus()
      //更新界面
      this.triggerEvent('modeChange', this.getCurrentMode())
    },

    luaQuery(loading = true) {
      let self = this
      //查询设备状态
      return new Promise((resolve, reject) => {
        if (loading) {
          wx.showLoading({
            title: '加载中',
            mask: true,
          })
        }
        if (isMock) {
          resolve(mockData.luaGet.data)
          return
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
              if (resp.data.data.temperature > 65) {
                this.setData({
                  minTemp: 70,
                  maxTemp: 130,
                })
              }
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
                self.setData({
                  'applianceData.onlineStatus': '0',
                })
                self.triggerEvent('modeChange', self.getCurrentMode())
              }
            }
            reject(error)
          }
        )
      })
    },
    luaControl(param) {
      //控制设备
      let self = this
      return new Promise((resolve, reject) => {
        wx.showLoading({
          title: '加载中',
          mask: true,
        })
        self.setData({
          changing: true,
        })
        if (isMock) {
          resolve(mockData.luaControl.data.status)
          return
        }
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
            self.setData({
              changing: false,
            })
            if (resp.data.code == 0) {
              resolve(resp.data.data.status || {})
            } else {
              reject(resp)
            }
          },
          (error) => {
            wx.hideLoading()
            self.setData({
              changing: false,
            })
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
    powerToggle() {
      //开关机
      if (this.data.deviceStatus > 5) return
      const params = { power: this.data.status.power == 'on' ? 'off' : 'on' }
      this.handleRequest(params)
    },
    //轮询
    queryIntervalHandler() {
      let self = this
      if (self.data.queryTimeout) {
        clearTimeout(self.data.queryTimeout)
      }
      self.data.queryTimeout = setTimeout(() => {
        self
          .luaQuery(false)
          .then((data) => {
            if (!self.data.destory) {
              if (self.data.changing) {
                self.queryIntervalHandler()
              } else {
                self.setData({
                  status: data,
                  'applianceData.onlineStatus': '1',
                })
                self.updateUI()
                self.queryIntervalHandler()
              }
            }
          })
          .catch((error) => {
            if (!self.data.destory) {
              self.queryIntervalHandler()
            }
          })
      }, 4000)
    },
    //卡片切换时结束轮询
    getDestoried() {
      this.setData({
        destory: true,
      })
      clearTimeout(this.data.queryTimeout)
    },
    // 渲染设备的运行状态
    renderStatus() {
      const { onlineStatus } = this.properties.applianceData
      const { status } = this.data
      if (onlineStatus == 0) {
        // 离线
        this.setData({ deviceStatus: 7 })
      } else if (status.error_code && status.error_code != 'none') {
        //故障状态
        this.setData({ deviceStatus: 6 })
      } else if (status.power == 'off') {
        //关机状态
        this.setData({ deviceStatus: 4 })
      } else if (status.cold_water_high_tem == 'on') {
        //高温全管路杀菌状态
        this.setData({ deviceStatus: 2.1 })
      } else if (
        status.feedback == 'on' &&
        status.water_volume > 27 &&
        !(status.zero_single == 1 || status.zero_timing == 1 || status.zero_dot == 1) &&
        status.power == 'on'
      ) {
        this.setData({ deviceStatus: 1 }) //加热状态
      } else if (
        status.feedback == 'on' &&
        (status.zero_single == 1 || status.zero_timing == 1 || status.zero_dot == 1) &&
        status.power == 'on'
      ) {
        this.setData({ deviceStatus: 2 }) //零冷水加热状态
      } else if (
        !(status.feedback == 'on') &&
        (status.zero_single == 1 || status.zero_timing == 1 || status.zero_dot == 1) &&
        status.power == 'on'
      ) {
        this.setData({ deviceStatus: 3 }) //零冷水保温状态
      } else {
        this.setData({ deviceStatus: 0 })
      }
    },
    handleRequest(param, loading = true) {
      //控制设备
      let self = this
      return new Promise((resolve, reject) => {
        if (loading) {
          wx.showLoading({
            title: '加载中',
            mask: true,
          })
        }
        self.setData({
          changing: true,
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
            self.setData({
              changing: false,
            })
            if (resp.data.code == 0) {
              this.luaQuery(false)
                .then(() => {
                  if (loading) {
                    wx.hideLoading()
                  }
                  this.setData({ status: resp.data.data.status }, () => {
                    this.updateUI()
                  })
                  resolve(resp.data.data.status || {})
                })
                .catch(() => reject(resp))
            } else {
              reject(resp)
            }
          },
          (error) => {
            if (loading) {
              wx.hideLoading()
            }
            self.setData({
              changing: false,
            })
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
    setColdWaterMaster({ detail }) {
      // openSubscribe(this.properties.applianceData, templateIds[25][0])
      this.handleRequest(detail)
    },
    updateStatus({ detail }) {
      // openSubscribe(this.properties.applianceData, templateIds[26][0])
      this.setData({ status: detail })
    },
  },
})
