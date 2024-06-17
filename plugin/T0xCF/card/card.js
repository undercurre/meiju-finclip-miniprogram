import { CARD_MODE_OPTION } from '../../../pages/common/js/cardMode'
import { getReqId, getStamp } from 'm-utilsdk/index'
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
    array: ['自动', '制冷', '制热', '自动', '制冷', '制热'],
    auto: false,
    arrayE: ['auto', 'cool', 'heat'], 
    arrayIcon_on: [
      imageApi.getImagePath.url + "/0xCF/auto-on@3x.png",
      imageApi.getImagePath.url + "/0xCF/cold-on@3x.png",
       imageApi.getImagePath.url + "/0xCF/heat-on@3x.png"
    ],
    arrayIcon_off: [
      imageApi.getImagePath.url + "/0xCF/auto-on@3x.png",
      imageApi.getImagePath.url + "/0xCF/cold-off@3x.png",
      imageApi.getImagePath.url + "/0xCF/heat-off@3x.png"
    ],
    arrayIndex: 0,
    on:{
      color:'#000000',
      bgcolor:'#EAEEFE',
    },
    off:{
      color:'#C7C7CC',
      bgcolor:'#F2F2F2',
    },
    heat:{
      color:'#F5A623',
      bgcolor: '#FFF2DB',
    },

    isQueryOffLine: false,
    status: {
      temp_set:'',
    },//设备数据
    step: 1,//组件温度步数
    // run_mode:'heat',//运行模式
    minTemp: "",//组件最温度
    maxTemp: "",
    timeoutHandler: null,
    intervalHandler: null,
    icons: {
      header: imageApi.getImagePath.url + '/0xCF/water-heater@3x.png',
      switch_power: {
        on: {
          img: imageApi.getImagePath.url + '/0xCF/switch-on@3x.png',
          desc:'关机'
        },
        off: {
          img: imageApi.getImagePath.url + '/0xCF/switch-off@3x.png',
          desc: '开机'
        },
      },
      fure: {
        on: imageApi.getImagePath.url + '/0xCF/fure-on@3x.png',
        off: imageApi.getImagePath.url + '/0xCF/fure-off@3x.png',
        desc: '辅热'
      },
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
      } else if (this.data.status.power_state == 'off') {
        mode = CARD_MODE_OPTION.COLD;
      } else {
          // 在线
          // array: [ '制冷', '制热',"自动"]
        switch (this.data.status.run_mode) {
            case 'cool':
              mode = CARD_MODE_OPTION.COLD;
              break
            case 'heat':
              mode = CARD_MODE_OPTION.HEAT;
              break;
            case 'auto':
              mode = CARD_MODE_OPTION.COLD;
              break
          }
        return {
          applianceCode: this.data.applianceData.applianceCode,
          mode: mode
        }
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
        //页面初始化模式、最温度显示
        let { run_mode,temp_set,auto_min_set_temp, auto_max_set_temp, cool_min_set_temp, cool_max_set_temp, heat_min_set_temp, heat_max_set_temp} = this.data.status;
        temp_set = Number(temp_set);
        auto_min_set_temp = Number(auto_min_set_temp);
        auto_max_set_temp = Number(auto_max_set_temp);
        cool_min_set_temp = Number(cool_min_set_temp);
        cool_max_set_temp = Number(cool_max_set_temp);
        heat_min_set_temp = Number(heat_min_set_temp);
        heat_max_set_temp = Number(heat_max_set_temp);
        switch (run_mode) {
          case "auto":
            if (temp_set > auto_max_set_temp) { temp_set = auto_max_set_temp}
            if (temp_set < auto_min_set_temp) { temp_set = auto_min_set_temp }
            this.setData({
              arrayIndex: 0,
              minTemp: auto_min_set_temp,
              maxTemp: auto_max_set_temp,
              'status.temp_set': temp_set
            });
            break;
          case "cool":
            if (temp_set > cool_max_set_temp) { temp_set = cool_max_set_temp }
            if (temp_set < cool_min_set_temp) { temp_set = cool_min_set_temp }
            this.setData({ 
              arrayIndex: 1,
              minTemp: cool_min_set_temp,
              maxTemp: cool_max_set_temp, 
              'status.temp_set': temp_set
            });
            break;
          case "heat":
            if (temp_set > heat_max_set_temp) { temp_set = heat_max_set_temp }
            if (temp_set < heat_min_set_temp) { temp_set = heat_min_set_temp }
            this.setData({
              arrayIndex: 2,
              minTemp: heat_min_set_temp,
              maxTemp: heat_max_set_temp,
              'status.temp_set': temp_set
            });
            break;
        }
      let circleProgressBar = this.selectComponent('#circleProgressBar');
      if (circleProgressBar) {
        let temperature = 0
        if (this.data.status.power_state == 'on') {
          temperature = temp_set;
        }
        circleProgressBar.updateProgress(temperature);
      }
      wx.hideNavigationBarLoading()
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
          if (resp.data.code == 0) {
            this.setData({
              status: resp.data.data
            })
            resolve(resp.data.data || {})
          } else {
            reject(resp)
          }
          console.log(resp.data.data)
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
            resolve(resp.data.data.status || {})
          } else {
            reject(resp)
          }
        }, (error) => {
          wx.hideNavigationBarLoading()
          wx.showToast({
            title: '设备未响应，请稍后尝试刷新',
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
      this.luaControl({
        "power_state": this.data.status.power_state == 'on' ? "off" : "on"
      }).then((data) => {
        this.setData({
          status: data
        })
        this.updateUI()
      })
    },
    //模式切换
    bindPickerChange(e) {
      let _index = e.detail.value;
      if (_index == 3) { _index = 0; }
      if (_index == 4) { _index = 1; }
      if (_index == 5) { _index = 2; }
      // console.log(_index)
      this.luaControl({
        "run_mode": this.data.arrayE[_index]
      }).then((data)=>{
          let reqData = {
            "reqId": getReqId(),
            "stamp": getStamp(),
            "applianceCode": this.data.applianceData.applianceCode,
            "command": {}
          }
          requestService.request("luaGet", reqData).then((resp) => {
            // console.log(resp.data.data.temp_set)
          this.setData({
            arrayIndex: _index,
            status: resp.data.data
          });
          this.updateUI();
          this.triggerEvent('modeChange', this.getCurrentMode());
        })
      })

    },
    //辅热开关
    qheat() {
      if (this.data.status.power_state !== 'on') return;
      if(this.data.status.run_mode !== 'heat'){
        wx.showToast({
          title: '当前模式不支持辅热',
          icon: 'none'
        })
        return
        };
      this.luaControl({
        "pre_heat": this.data.status.pre_heat == 'on' ? "off" : "on"

      }).then((data) => {
        // console.log(data.pre_heat)
          if (data){
            wx.showToast({
              title: '辅热指令已发送',
              icon: 'none'
            })
          }else{
            wx.showToast({
              title: '设备未响应，请稍后尝试刷新',
              icon: 'none'
            })
          }
          this.setData({
            status: data
          });
      })
    },
    //单点调节温度
    temperatureChange(e) {
      let result = true;
      let isChanged = false;
      let status = this.data.status;
      if (e.target.id == 'tempMinus') {
        if (status.temp_set > this.data.minTemp) {
          this.setData({
            "status.temp_set": status.temp_set - this.data.step
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
        if (status.temp_set < this.data.maxTemp) {
          this.setData({
            "status.temp_set": Number(status.temp_set) + this.data.step
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
            "temp_set": this.data.status.temp_set
          }).then((data) => {
            // this.setData({
            //   status: data
            // })
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
        if (status.temp_set > this.data.minTemp) {
          this.data.intervalHandler = setInterval(() => {
            let targetTemperature = this.data.status.temp_set - this.data.step
            if (targetTemperature < this.data.minTemp) {
              targetTemperature = this.data.minTemp
            }
            this.setData({
              "status.temp_set": targetTemperature
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
        if (status.temp_set < this.data.maxTemp) {
          this.data.intervalHandler = setInterval(() => {
            let targetTemperature = this.data.status.temp_set + this.data.step
            if (targetTemperature > this.data.maxTemp) {
              targetTemperature = this.data.maxTemp
            }
            this.setData({
              "status.temp_set": targetTemperature
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
          "temp_set": this.data.status.temp_set
        }).then((data) => {
          //do not handle call back data
        })
      }
    }
  },
  attached() { }
})