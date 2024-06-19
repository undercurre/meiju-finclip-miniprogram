// plugin/T0x38/cards/card0/card0.js
import api from "../../api/api"
let app = getApp()
const environment = app.getGlobalConfig().environment
// const IMAGE_SERVER = environment == 'prod' ? 'https://www.smartmidea.net/projects/meiju-lite-assets/plugin/0xE6/jiayong-e6/' : 'https://www.smartmidea.net/projects/sit/meiju-lite-assets/plugin/0xE6/jiayong-e6/'
const IMAGE_SERVER = 'https://www.smartmidea.net/projects/sit/meiju-lite-assets/plugin/0xE6/jiayong-e6/'
import configs from "../../configs/index"

import Dialog from 'm-ui/mx-dialog/dialog'
import {
  cloudDecrypt
} from 'm-utilsdk/index'
let key = app.globalData.userData.key
const appKey = app.getGlobalConfig().appKey
let {
  deviceConfig
} = configs

// npm login --registry=https://npm.midea.com/repository/U-MeijuApp/
// npm publish --registry=https://npm.midea.com/repository/U-MeijuApp/

Component({
  options: {
    styleIsolation: 'page-shared', //设置为share后，该组件的wxss文件可以影响到mui组件的样式
  },
  /**
   * 组件的属性列表,applianceData:deviceInfo
   */
  properties: {
    applianceData: {
      type: Object,
      value: function () {
        return {}
      },
    },
    initEvent: {
      type: Boolean,
      value: false,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showZeroWaterFlag: false,
    showShortcut: false,
    stateText: "--",
    height: 0,
    deviceStatus: {}, //设备状态
    sn: null,
    tempColumn: [],
    getWarmIcon: `${IMAGE_SERVER}get-warm-icon.png`,
    autoTempIcon: `${IMAGE_SERVER}temp-icon.png`,
    onIcon: `${IMAGE_SERVER}bottom-switch-on-heat@2x.png`,
    offIcon: `${IMAGE_SERVER}bottom-switch-off-heat.png`,
    dotClickIcon: `${IMAGE_SERVER}dot-click.png`,
    timerClickIcon: `${IMAGE_SERVER}zero-cold-water.png`,
    moreIcon: `${IMAGE_SERVER}cell-more@2x.png`,
    tabIndex: 0,
    miniData: [{
        icon: `${IMAGE_SERVER}smart-at-home-unselect.png`,
        activeIcon: `${IMAGE_SERVER}smart-at-home-select.png`,
        label: '智能居家',
        describe: '102分钟',
        detail: '温度 60℃',
        selected: false,
        val: 2
      },
      {
        icon: `${IMAGE_SERVER}smart-sleep-unselect.png`,
        activeIcon: `${IMAGE_SERVER}smart-sleep-select.png`,
        label: '智能睡眠',
        describe: '70分钟',
        detail: '温度 60℃',
        selected: false,
        val: 3
      },
      {
        icon: `${IMAGE_SERVER}smart-out-unselect.png`,
        activeIcon: `${IMAGE_SERVER}smart-out-select.png`,
        label: '智能外出',
        describe: '80分钟',
        detail: '温度 60℃',
        selected: false,
        val: 1
      }
    ],
    mark: ['10°C', '35°C'],
    bathMark: ['10°C', '35°C'],
    aiFeelTempIcon: `${IMAGE_SERVER}ai-feel-temp.png`,
    barWashIcon: `${IMAGE_SERVER}bar-wash.png`,
    specialCards: [{
        icon: `${IMAGE_SERVER}ai-feel-temp.png`,
        activeIcon: '',
        label: '智温感',
        describe: '智能调节水温，恒温舒适',
        checked: false,
      },
      {
        icon: `${IMAGE_SERVER}bar-wash.png`,
        activeIcon: '',
        label: '增压',
        describe: '提升水量，畅享瀑布洗',
        checked: false,
      },
    ],

    cards: [{
        title: '采暖',
      },
      {
        title: '卫浴',
      },
    ],
    tabbarItems: [{
        icon: `${IMAGE_SERVER}bottom-switch-off-heat.png`,
        activeIcon: `${IMAGE_SERVER}bottom-switch-on-heat@2x.png`,
        label: '开关',
        checked: false,
      },
      {
        icon: `${IMAGE_SERVER}zero-cold-water-once-unselect.png`,
        activeIcon: `${IMAGE_SERVER}zero-cold-water-once-select.png`,
        label: '单次零冷水',
        checked: true,
      },
    ],

    status: {
      heat_set_temperature_max: 80,
      heat_set_temperature_min: 30,
      bath_set_temperature_max: 60,
      bath_set_temperature_min: 35,
      error_code: 0
    },
    tempDebounceTimer: 0,
    modeText: "",
    bathModeText: "",

    showTempSlider: false,
    popupTempText: 30,
    barText: 0.0,

    bathTempText: 30,
    systemType: "",
    singleZeroWaterTipsShow: false,
  },

  lifetimes: {
    //组件被加入时，查询状态并添加轮询定时器
    attached() {
      console.log("attached");
      let height = wx.getSystemInfoSync().statusBarHeight
      this.setData({
        height
      })
      let sn = cloudDecrypt(this.properties.applianceData.sn, key, appKey)
      this.setData({
        sn
      })
      // if(this.properties.applianceData.onlineStatus == 1) {
      //   wx.showLoading({title: "加载中"})
      //   this.queryCmds()
      //   let timer = setInterval(() => {
      //     this.queryCmds()
      //   }, 5000);
      //   this.setData({
      //     luaQueryInterval: timer
      //   })
      // }
      let params = {
        sn8: this.properties.applianceData.sn8,
        typeName: 'device_status_weex'
      }

      // this.queryStatus();      

      let that = this;
      wx.getSystemInfo({
        success: function (res) {
          console.log(res.system)
          if (res.system.indexOf('iOS') > -1) {
            console.log('当前系统为iOS')
            that.setData({
              systemType: "iOS"
            });
          } else {
            console.log('当前系统为Android')
            that.setData({
              systemType: "Android"
            });
          }
        }
      })


      console.log(this.properties.applianceData, "this.data.deviceInfo))");
    },
    ready() {
      console.log("ready");
    },
    //组件被移除时，清除轮询定时器
    detached() {
      if (this.data.luaQueryInterval != null) {
        clearInterval(this.data.luaQueryInterval)
      }
    }
  },


  /**
   * 组件的方法列表
   */
  methods: {

    receiveDataFromNet() {
      app.globalData.DeviceComDecorator.event.off('receiveMessageLan');
      app.globalData.DeviceComDecorator.event.on(
        'receiveMessageLan',
        (data) => {
          let mergeData = {
            ...this.data.status,
            ...data
          }
          // mark: ['10°C', '35°C'],
          this.setData({
            status: mergeData,
            mark: [mergeData.heat_set_temperature_min + '℃', mergeData.heat_set_temperature_max + '℃'],
            bathMark: [mergeData.bath_set_temperature_min + '℃', mergeData.bath_set_temperature_max + '℃'],
            popupTempText: mergeData.current_heat_set_temperature,
            bathTempText: mergeData.current_bath_set_temperature,
            barText: parseFloat(mergeData.water_gage / 10).toFixed(1)
          })
          this.refreshBtnStatus(this.data.status);
          this.refreshQuickMode(this.data.status);
          this.setStateText(this.data.status);
          this.getBathModeText(this.data.status);
          console.log("设备状态", this.data.status);
        },
        'index'
      )
    },

    setStateText(status) {
      let text = "运行中";

      if (status.error_code == 0 && status.power == "on") {
        if (this.data.tabIndex == 0) {
          if (status.flame_feedback == "on" && status.tee_valve_output == "heat_side") {
            text = "加热中"
          } else {
            if (status.winter_mode == "on") {
              text = "保温中"
            } else {
              text = "采暖关"
            }
          }
        } else if (this.data.tabIndex == 1) {
          if (status.flame_feedback == "on" && status.tee_valve_output == "bath_side") {
            if (status.cold_water_master == "on") {
              text = "零冷水 · 加热中"
            } else {
              text = "加热中"
            }
            this.setData({
              singleZeroWaterTipsShow: true
            })
          } else {
            text = "待机中"
            this.setData({
              singleZeroWaterTipsShow: false
            })
          }
        }
      } else {
        text = "已关机"
      }
      this.setData({
        stateText: text
      })
    },

    refreshBtnStatus(status) {
      this.setData({
        'tabbarItems[0].checked': status.power == "on",
        'tabbarItems[1].checked': status.cold_water_single == "on",
        'specialCards[0].checked': status.bath_mode == "10",
        'specialCards[1].checked': status.pressure == "on"
      })
    },

    refreshQuickMode(status) {
      let text = "";
      for (let index = 0; index < this.data.miniData.length; index++) {
        if (status.heat_mode == this.data.miniData[index].val) {
          this.data.miniData[index].selected = true
          text = this.data.miniData[index].label
        } else {
          this.data.miniData[index].selected = false
        }
        this.data.miniData[index].detail = '温度 ' + status.current_heat_set_temperature + '℃'
      }

      if (status.auto_water_temperature == 1) {
        text = '自动'
      }

      this.setData({
        miniData: this.data.miniData,
        modeText: text
      })
    },
    getBathModeText(status) {
      if (status.bath_mode == 10) {
        this.setData({
          bathModeText: '智温感'
        })
      }
    },
    queryStatus() {
      app.globalData.DeviceComDecorator._queryStatus();
    },

    tabClick(e) {
      let index = e.detail
      console.log(index);
      this.setData({
        tabIndex: index.index
      })
      this.setStateText(this.data.status);
    },

    goToTimeSet() {
      // wx.navigateTo({
      //   url: '../paths/aboutMac/aboutMac?' + 'currDeviceInfo=' + encodeURIComponent(JSON.stringify(this
      //     .properties.applianceData)),
      // })
      // wx.navigateTo({
      //   url: '../pa',
      // })
      wx.navigateTo({
        url: '../paths/timeSet/timeSet?' + 'currDeviceInfo=' + encodeURIComponent(JSON.stringify(this.properties
          .applianceData)),
      })
    },

    goToAboutMac() {
      wx.navigateTo({
        url: '../paths/aboutMac/aboutMac?' + 'currDeviceInfo=' + encodeURIComponent(JSON.stringify(this
          .properties.applianceData)),
      })
    },

    bottomTab(e) {
      console.log(e);
      let data = e.currentTarget.dataset.item;
      if (data.label == '开关') {
        let flag = !data.checked;
        if (!flag) {
          wx.showModal({
            title: '关机提示',
            content: '采暖及卫浴会全部关闭，是否关闭？',
            confirmText: '关闭',
            complete: (res) => {
              if (res.cancel) {

              }

              if (res.confirm) {
                app.globalData.DeviceComDecorator.switchDevice(false);
              }
            }
          })
        } else {
          app.globalData.DeviceComDecorator.switchDevice(flag)
        }
      } else if (data.label == '单次零冷水') {
        if (this.data.status.power == "off") {
          wx.showToast({
            title: '总开关关闭时不可用',
            icon: 'none'
          })
          return;
        }
        if (this.data.singleZeroWaterTipsShow) {
          wx.showToast({
            title: '用水状态中,不可执行。',
            icon: 'none'
          })
        } else {
          let flag = !data.checked;
          app.globalData.DeviceComDecorator.singleZeroWater(flag)
        }     
      }
    },

    winterModeSwitch(e) {
      console.log(e);
      let flag = !e.currentTarget.dataset.item;
      app.globalData.DeviceComDecorator.winterMode(flag)
    },

    heatSetTempChange(item) {
      if (this.data.status.power == "off") {
        wx.showToast({
          title: '总开关关闭时不可用',
          icon: 'none'
        })
        return;
      }
      if (this.data.status.winter_mode == "off") {
        wx.showToast({
          title: '全屋采暖关闭时不可用',
          icon: 'none'
        })
        return;
      }
      console.log(item);

      if (this.data.status.heat_mode == 0) {
        // 没有设置模式，直接控制
        clearTimeout(this.data.tempDebounceTimer);
        let timer = setTimeout(() => {
          app.globalData.DeviceComDecorator.currentHeatSetTemperature(item.detail, this.data.status)
        }, 1000);
        this.setData({
          tempDebounceTimer: timer,
          // 'status.current_heat_set_temperature': item.detail
          popupTempText: item.detail
        })
      } else {
        let tipsArr = ["智能外出", "智能居家", "智能睡眠"]
        clearTimeout(this.data.tempDebounceTimer);
        let timer = setTimeout(() => {
          app.globalData.DeviceComDecorator.currentHeatSetTemperature(item.detail, this.data.status)
        }, 1000);
        this.setData({
          tempDebounceTimer: timer,
          // 'status.current_heat_set_temperature': item.detail
          popupTempText: item.detail
        })
        /*wx.showModal({
          title: '提示',
          content: '调节温度将退出' + tipsArr[parseInt(this.data.status.heat_mode) - 1] + '，' + '是否退出？',
          confirmText: '退出',
          complete: (res) => {
            if (res.cancel) {
              this.queryStatus();
            }
            if (res.confirm) {
              clearTimeout(this.data.tempDebounceTimer);
              let timer = setTimeout(() => {
                app.globalData.DeviceComDecorator.currentHeatSetTemperature(item.detail, this.data.status)
              }, 500);
              this.setData({
                tempDebounceTimer: timer,
                'status.current_heat_set_temperature': item.detail
              })
            }
          }
        })*/
      }


    },

    heatSetTempPopupChange(item) {
      if (this.data.status.power == "off") {
        wx.showToast({
          title: '总开关关闭时不可用',
          icon: 'none'
        })
        return;
      }
      if (this.data.status.winter_mode == "off") {
        wx.showToast({
          title: '全屋采暖关闭时不可用',
          icon: 'none'
        })
        return;
      }
      console.log(item);
      clearTimeout(this.data.tempDebounceTimer);
      let timer = setTimeout(() => {
        app.globalData.DeviceComDecorator.currentHeatSetTemperature(item.detail, this.data.status, false)
      }, 500);
      this.setData({
        tempDebounceTimer: timer,
        'status.current_heat_set_temperature': item.detail
      })
    },

    heatTempTargetDrag(item) {
      console.log(item);
      this.setData({
        'popupTempText': item.detail.value
      })
    },

    bathTempTargetDrag(item) {
      console.log(item);
      this.setData({
        'bathTempText': item.detail.value
      })
    },

    barthSetTempChange(item) {
      console.log(item);
      clearTimeout(this.data.tempDebounceTimer);
      let timer = setTimeout(() => {
        app.globalData.DeviceComDecorator.currentBathSetTemperature(item.detail, this.data.status)
      }, 500);
      this.setData({
        tempDebounceTimer: timer,
        'status.current_bath_set_temperature': item.detail
      })
    },

    heatTempDisabledlick() {
      if (this.data.status.power == "off") {
        wx.showToast({
          title: '总开关关闭时不可用',
          icon: 'none'
        })
        return;
      }
      if (this.data.status.winter_mode == "off") {
        wx.showToast({
          title: '全屋采暖关闭时不可用',
          icon: 'none'
        })
        return;
      }
    },
    barthTempDisabled() {
      if (this.data.status.power == "off") {
        wx.showToast({
          title: '总开关关闭时不可用',
          icon: 'none'
        })
      }
    },
    cardClicked(e) {
      console.log(e);
      let target = e.currentTarget.dataset.item.val;
      if (this.data.status.power == "off") {
        wx.showToast({
          title: '总开关关闭时不可用',
          icon: 'none'
        })
        return;
      }
      if (this.data.status.winter_mode == "off") {
        wx.showToast({
          title: '全屋采暖关闭时不可用',
          icon: 'none'
        })
        return;
      }
      // if (this.data.status.auto_water_temperature == "1") {
      //   wx.showToast({
      //     title: '自动水温开启时不可用',
      //     icon: 'none'
      //   })
      //   return;
      // }
      if (this.data.status.heat_mode == 0) {
        app.globalData.DeviceComDecorator.heatModeSwitch(target)
      } else if (target != this.data.status.heat_mode) {
        app.globalData.DeviceComDecorator.heatModeSwitch(target)
      } else {
        app.globalData.DeviceComDecorator.heatModeSwitch(0)
      }
      console.log(target);
    },

    switchColdWaterDot(e) {
      console.log(e);
      app.globalData.DeviceComDecorator.coldWaterDot(e.detail);
    },

    barthDisabledTips() {
      if (this.data.status.power == "off") {
        wx.showToast({
          title: '总开关关闭时不可用',
          icon: 'none'
        })
      }
    },

    // 智温感，增压switch
    specialFuncSwitch(e) {
      console.log(e);
      let item = e.currentTarget.dataset.item;
      let flag = !item.checked;
      if (item.label == '智温感') {
        app.globalData.DeviceComDecorator.bathMode(flag)
      } else if (item.label == '增压') {
        app.globalData.DeviceComDecorator.pressureSwitch(flag)
      }
    },

    getWarmTap() {
      if (this.data.status.power == "off") {
        wx.showToast({
          title: '总开关关闭时不可用',
          icon: 'none'
        })
      }
    },

    clickshowTempSlider() {
      console.log("父组件 调节");
      this.setData({
        showTempSlider: true
      })
    },

    hidePopup() {
      this.setData({
        showTempSlider: false,
        showShortcut: false,
        showZeroWaterFlag: false,
      })
    },

    onOverlitmit(e) {
      if (this.data.status.power == "off") {
        wx.showToast({
          title: '总开关关闭时不可用',
          icon: 'none'
        })
        return;
      }
      if (this.data.status.winter_mode == "off") {
        wx.showToast({
          title: '全屋采暖关闭时不可用',
          icon: 'none'
        })
        return;
      }
      if (e.detail == 'minus') {
        wx.showToast({
          title: '已经是最低温度',
          icon: 'none'
        })
      } else if (e.detail == 'plus') {
        wx.showToast({
          title: '已经是最高温度',
          icon: 'none'
        })
      }
    },

    onOverlitmitBath(e) {
      if (this.data.status.power == "off") {
        wx.showToast({
          title: '总开关关闭时不可用',
          icon: 'none'
        })
        return;
      }
      if (e.detail == 'minus') {
        wx.showToast({
          title: '已经是最低温度',
          icon: 'none'
        })
      } else if (e.detail == 'plus') {
        wx.showToast({
          title: '已经是最高温度',
          icon: 'none'
        })
      }
    },

    autoWaterTempChange(e) {
      if (this.data.status.power == "off") {
        wx.showToast({
          title: '总开关关闭时不可用',
          icon: 'none'
        })
        return;
      }
      if (this.data.status.winter_mode == "off") {
        wx.showToast({
          title: '全屋采暖关闭时不可用',
          icon: 'none'
        })
        return;
      }
      console.log(e);
      app.globalData.DeviceComDecorator.autoWaterTemp(e.detail);
    },

    showShortcutTips() {
      this.setData({
        showShortcut: true,
      })
    },

    showZeroWaterTips() {
      this.setData({
        showZeroWaterFlag: true,
      })
    },

    queryStatus() {
      app.globalData.DeviceComDecorator._queryStatus();
    },

    autoDisabledTap() {
      // if (this.data.status.heat_mode != 0) {
      //   wx.showToast({
      //     title: '该模式不可开启自动水温',
      //     icon: 'none'
      //   })
      // }
    },

    preventDefault(e) {
      e.preventDefault();
    }


  },

  observers: {
    'initEvent': function (val) {
      console.log(val, this.data.initEvent, "observers card0");
      this.receiveDataFromNet();
    }
  }


})
