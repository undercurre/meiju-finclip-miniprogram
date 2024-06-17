import { CARD_MODE_OPTION } from '../../../pages/common/js/cardMode'
import { getReqId, getStamp } from '../../../utils/util'
import { requestService } from '../../../utils/requestService'
// import { mockData } from 'assets/js/mockData'
import { imageApi } from '../../../api'

const isMock = false

Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties: { // 这里定义了innerText属性，属性值可以在组件使用时指定
    applianceData: {
      type: Object,
      value: {}
    }
  },
  data: {
    isInit: false, //*****固定方法，供外界调用****
    //模式
    array: ['制冷', '除湿', '送风', '制热'],
    auto: false,
    arrayE: ['cool', 'dry', 'fan', 'heat', 'auto'],
    arrayIcon_on: [
      imageApi.getImagePath.url + "/0xCC/cold-on@3x.png",
      imageApi.getImagePath.url + "/0xCC/arefaction-on@3x.png",
      imageApi.getImagePath.url + "/0xCC/balst-on@3x.png",
      imageApi.getImagePath.url + "/0xCC/heat-on@3x.png",
      imageApi.getImagePath.url + "/0xCC/auto-on@3x.png",
    ],
    arrayIcon_off: [
      imageApi.getImagePath.url + "/0xCC/cold-on@3x.png",
      imageApi.getImagePath.url + "/0xCC/arefaction-on@3x.png",
      imageApi.getImagePath.url + "/0xCC/balst-on@3x.png",
      imageApi.getImagePath.url + "/0xCC/heat-off@3x.png",
      imageApi.getImagePath.url + "/0xCC/auto-on@3x.png",
    ],
    // arrayIcon: ["icon-zhileng", "icon-chushi", "icon-songfeng", "icon-zhire", "icon-jiashi", "icon-qingshuang"],
    arrayIndex: 0,

    //风速
    windSpeed: ['自动', '1 档', '2 档', '3 档', '4 档', '5 档', '6 档', '7 档'],
    windSpeedE: ['auto', 'sleep', 'micron', 'low', 'middle', 'high', 'super_high', 'power'],
    windSpeedIndex: 0,

    iconname: [],
    isQueryOffLine: false,
    status: {},
    icons:{
      header: imageApi.getImagePath.url + '/0xCC/img_water-heater2@3x.png',
      powerStyles: {
        off: {
          mainImg: imageApi.getImagePath.url + '/0xCC/switch-on@3x.png',
          desc: '开机'
        },
        on: {
          mainImg: imageApi.getImagePath.url + '/0xCC/switch-off@3x.png',
          desc: '关机'
        }
      },
    },
    step: 1,
    minTemp: 17,
    maxTemp: 30,
    timeoutHandler: null,
    intervalHandler: null
  },
  methods: {
    //*****固定方法，供外界调用****
    //当设备列表页切换到当前页面时，应该呈现的整体样式
    getCurrentMode() {
      let mode
      if (this.data.applianceData.onlineStatus == 0 || this.data.isQueryOffLine) {
        // 离线
        mode = CARD_MODE_OPTION.OFFLINE
      } else if (this.data.status.power == 'off'){
        mode = CARD_MODE_OPTION.COLD;
      } else {
        // 在线
        // array: [ '制冷', '除湿', '送风', '制热','自动']
        switch (this.data.status.mode) {
          case 'cool':
            mode = CARD_MODE_OPTION.COLD;
            break
          case 'dry':
            mode = CARD_MODE_OPTION.DEHUM;
            break
          case 'fan':
            mode = CARD_MODE_OPTION.SUPPLY;
            break
          case 'heat':
            mode = CARD_MODE_OPTION.HEAT;
            break;
          case 'auto':
            mode = CARD_MODE_OPTION.CLEAR;
            break
        }
      }
      return {
        applianceCode: this.data.applianceData.applianceCode,
        mode: mode
      }
    },
    //当设备列表页切换到当前页面时触发
    getActived() {
      // 请求完新版本信息的回调
      // 通知外界更新界面
      this.triggerEvent('modeChange', this.getCurrentMode());
      // 刷新设备状态
      this.luaQuery().then((data) => {
        // 激活时再次刷新在线离线状态
        this.setData({
          isQueryOffLine: false
        })
        this.updateUI()
      }).catch((error) => {
        if (error && error.data && error.data.code == 1306) {
          //1306处理
          wx.showToast({
            title: '设备未响应，请稍后尝试刷新',
            icon: 'none',
            duration: 2000
          })
        }
        if (error && error.data && error.data.code == 1307) {
          //离线
          this.setData({
            isQueryOffLine: true
          })
        }
      })
    },
    //初始化卡片页，只执行一次
    initCard() {
      if (!this.data.isInit) {
        this.luaQuery().then((data) => {
          this.setData({
            isInit: true
          })
          setTimeout(() => {
            this.updateUI()
          }, 100)
        }).catch((error) => {
          this.setData({
            isInit: true
          })
        })
      }
    },
    //*****固定方法，供外界调用****
    updateUI() {
      //更新界面
      wx.showNavigationBarLoading()
      this.triggerEvent('modeChange', this.getCurrentMode());
      let circleProgressBar = this.selectComponent('#circleProgressBar');
      if (circleProgressBar) {
        let temperature = 0
        if (this.data.status.power == 'on') {
          temperature = parseInt(this.data.status.temperature);
        }
        circleProgressBar.updateProgress(temperature);
        //页面初始化模式,不能识别则制冷
        wx.hideNavigationBarLoading()
        let modeType = this.data.status.mode;
        switch (modeType) {
          case "cool":
            this.setData({
              arrayIndex: 0
            });
            break;
          case "dry":
            this.setData({
              arrayIndex: 1
            });
            break;
          case "fan":
            this.setData({
              arrayIndex: 2
            });
            break;
          case "heat":
            this.setData({
              arrayIndex: 3
            });
            break;
          case "auto":
            this.setData({
              arrayIndex: 4
            });
            break;
          default:
            this.setData({
              arrayIndex: 0
            });
        }
        //页面初始化风速，不能识别则自动
        let type = this.data.status.wind_speed;
        switch (type) {
          case "auto":
            this.setData({
              windSpeedIndex: 0
            })
            break;
          case "sleep":
            this.setData({
              windSpeedIndex: 1
            })
            break;
          case "micron":
            this.setData({
              windSpeedIndex: 2
            })
            break;
          case "low":
            this.setData({
              windSpeedIndex: 3
            })
            break;
          case "middle":
            this.setData({
              windSpeedIndex: 4
            })
            break;
          case "high":
            this.setData({
              windSpeedIndex: 5
            })
            break;
          case "super_high":
            this.setData({
              windSpeedIndex: 6
            })
            break;
          case "power":
            this.setData({
              windSpeedIndex: 7
            })
            break;
          default:
            this.setData({
              windSpeedIndex: 0
            })
            break;
        }
      }
    },
    //查询设备状态并更新界面
    luaQuery() {
      return new Promise((resolve, reject) => {
        wx.showNavigationBarLoading()
        this.triggerEvent('modeChange', this.getCurrentMode());
        if (isMock) {
          this.setData({
            status: mockData.luaGet.data,
          })
          resolve(mockData.luaGet.data)
          return
        }
        let reqData = {
          "reqId": getReqId(),
          "stamp": getStamp(),
          "applianceCode": this.data.applianceData.applianceCode,
          "command": {}
        }
        requestService.request("luaGet", reqData).then((resp) => {
          wx.hideNavigationBarLoading()

          // Robin: 某些机型初始化的时候 模式为空
          let _data = resp.data.data;
          if (_data.mode == '' || _data.mode == undefined) _data.mode = 'auto';

          if (resp.data.code == 0) {
            this.setData({
              status: _data
            })
            resolve(_data || {})
          } else {
            reject(resp)
          }
        }, (error) => {
          wx.hideNavigationBarLoading()
          console.error(error)
          reject(error)
        })
      })

    },
    //查询设备状态并更新界面
    luaControl(param) {
      return new Promise((resolve, reject) => {
        wx.showNavigationBarLoading()
        if (isMock) {
          resolve(mockData.luaControl.data.status)
          return
        }
        // Robin: 增加全量发送，不全量某些机型有问题
        let _param = {
          
        }

        let reqData = {
          "reqId": getReqId(),
          "stamp": getStamp(),
          "applianceCode": this.data.applianceData.applianceCode,
          "command": {
            "control": param
          }
        }
        requestService.request("luaControl", reqData).then((resp) => {
          wx.hideNavigationBarLoading()
          if (resp.data.code == 0) {

            // Robin: 某些机型初始化的时候 模式为空
            let _data = resp.data.data.status;
            if (_data.mode == '' || _data.mode == undefined) _data.mode = this.data.status.mode || 'auto';

            resolve(resp.data.data.status || {})
          } else {
            reject(resp)
          }
        }, (error) => {
          wx.hideNavigationBarLoading()
          wx.showToast({
            title: '请求失败，请稍后重试',
            icon: 'none',
            duration: 2000
          })
          console.error(error)
          reject(error)
        })
      })
    },
    //开关机
    powerToggle() {
      // Robin: 开机的时候增加全量发送，不全量某些机型有问题
      let { power, mode, wind_speed, temperature, small_temperature, eco, sleep_switch, wind_swing_ud, digit_display_switch, ptc_setting } = this.data.status;
      let _keyPower = this.data.status.power == 'on';
      let _val = _keyPower ? "off" : "on";
      let _param = {
        "power": _val
      };
      if (_keyPower) {
        // 执行关机，需要额外属性
      } else {
        // 执行开机，需要额外属性
        Object.assign(_param, {
          "power": _val,
          "mode": mode ? mode : "auto",
          wind_speed, temperature, small_temperature, eco, sleep_switch, wind_swing_ud, digit_display_switch, ptc_setting,
          "power_on_time_value" : '0'
        })
      }

      this.luaControl(_param).then((data) => {
        this.setData({
          status: data
        })
        this.updateUI()
      })
    },
    //模式切换
    bindPickerChange(e) {
      this.luaControl({
        "mode": this.data.arrayE[e.detail.value]
      }).then((data) => {
        this.setData({
          arrayIndex: e.detail.value,
          'status.mode': this.data.arrayE[e.detail.value]
        });
        this.triggerEvent('modeChange', this.getCurrentMode());
      })
    },
    //风速切换
    windSpeedChange(e) {
      if (this.data.arrayIndex == 1) {
        wx.showToast({
          title: '当前模式不可调节风速',
          icon: 'none'
        })
        return;
      }
      this.luaControl({
        "wind_speed": this.data.windSpeedE[e.detail.value]
      }).then((data) => {
        this.setData({
          windSpeedIndex: e.detail.value,
          'status.wind_speed': this.data.windSpeedE[e.detail.value]
        })
      })
    },
    //单点调节温度
    temperatureChange(e) {
      let result = true;
      let isChanged = false;
      let status = this.data.status;
      if (e.target.id == 'tempMinus') {
        if (status.temperature > this.data.minTemp) {
          this.setData({
            "status.temperature": status.temperature - this.data.step
          })
          this.updateUI()
          isChanged = true
        } else {
          wx.showToast({
            title: '已是最低温度',
            icon: 'none'
          })
          result = false
        }
      } else if (e.target.id == 'tempPlus') {
        if (status.temperature < this.data.maxTemp) {
          this.setData({
            "status.temperature": Number(status.temperature) + this.data.step
          })
          this.updateUI()
          isChanged = true
        } else {
          wx.showToast({
            title: '已是最高温度',
            icon: 'none'
          })
          result = false
        }
      }
      if (isChanged) {
        if (this.data.timeoutHandler) {
          clearTimeout(this.data.timeoutHandler)
        }
        this.data.timeoutHandler = setTimeout(() => {
          this.luaControl({
            "temperature": this.data.status.temperature
          }).then((data) => {
            //do not handle call back data
          })
        }, 500)
      }
      return result
    },
    //长按调节温度
    temperatureQuickChange(e) {
      let status = this.data.status
      if (e.target.id == 'tempMinus') {
        if (status.temperature > this.data.minTemp) {
          this.data.intervalHandler = setInterval(() => {
            let targetTemperature = this.data.status.temperature - this.data.step
            if (targetTemperature < this.data.minTemp) {
              targetTemperature = this.data.minTemp
            }
            this.setData({
              "status.temperature": targetTemperature
            })
            this.updateUI()
          }, 300)
        } else {
          wx.showToast({
            title: '已是最低温度',
            icon: 'none'
          })

        }
      } else if (e.target.id == 'tempPlus') {
        if (status.temperature < this.data.maxTemp) {
          this.data.intervalHandler = setInterval(() => {
            let targetTemperature = this.data.status.temperature + this.data.step
            if (targetTemperature > this.data.maxTemp) {
              targetTemperature = this.data.maxTemp
            }
            this.setData({
              "status.temperature": targetTemperature
            })
            this.updateUI()
          }, 300)
        } else {
          wx.showToast({
            title: '已是最高温度',
            icon: 'none'
          })
        }
      }
    },
    // 只处理长按结束的请求
    temperatureQuickChangeEnd(e) {
      if (this.data.intervalHandler) {
        clearInterval(this.data.intervalHandler)
        this.data.intervalHandler = null
        this.updateUI()
        this.luaControl({
          // "mode": "custom",
          "temperature": this.data.status.temperature
        }).then((data) => {
          //do not handle call back data
        })
      }
    }
  },
  attached() { }
})