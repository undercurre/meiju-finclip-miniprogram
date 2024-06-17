import { CARD_MODE_OPTION } from '../../../pages/common/js/cardMode'
import { getReqId, getStamp } from 'm-utilsdk/index'
import { requestService } from '../../../utils/requestService'
import { mockData } from 'assets/js/mockData'
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
    isQueryOffLine: false,
    //设备数据
    status: {
      set_temperature:'--',
      water_box_temperature:'--',
      hotwater_level:0,
    },
    step: 1,//组件温度步数
    machine_type:0,//旧机型热水量、节能、快热按钮不显示
    newMachine: ['000K86F1', 'RSJ18RD2', '000K86A2', '000K86F2'],//新机型sn8
    haveTips:false,//提示信息是否显示
    tipsText: [//提示信息内容
      '温度有点高，请用前先试试。',
      '剩余水量极少，请合理安排使用。',
      '剩余水量较少，请合理安排使用。',
    ],
    tipsIndex:'',
    minTemp: "",//组件最温度
    maxTemp: "",
    timeoutHandler: null,
    intervalHandler: null,
    icons: {
      header: imageApi.getImagePath.url + '/0xCD/water-heater@3x.png',
      gantanhao: imageApi.getImagePath.url + '/0xCD/gantanhao@3x.png',
      tips: imageApi.getImagePath.url +'/0xCD/delete@3x.png',
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
      } else if (this.data.status.power == 'off') {
        mode = CARD_MODE_OPTION.COLD;
      } else {
          // 在线
        mode = CARD_MODE_OPTION.HEAT;
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
          // 1306处理
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
      //高度显示兼容
      // let systemInfoSync = wx.getSystemInfoSync().screenHeight * 1;
      // if (systemInfoSync <= 530) this.setData({ compatibility: true, temp_size:440});

      if (!this.data.isInit) {
        if (this.data.newMachine.indexOf(this.data.applianceData.sn8) !== -1){
          this.setData({
            machine_type :1
          })
        }
        this.luaQuery().then((data) => {
          this.setData({
            isInit: true
          })
          this.temperatureTextremity();
          this.tipsSet();
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
    //提示信息显示设置
    tipsSet(){
      let tipsText;
      if (this.data.status.water_box_temperature * 1 >= 50) tipsText = 0;
      // 无热水量机型显示
      if (!this.data.machine_type) {
        if (tipsText === 0) {
          this.setData({
            haveTips: true,
            tipsIndex: tipsText
          })
        }
      }else{
      // 有热水量机型显示
        if (this.data.machine_type){
          if (this.data.status.hotwater_level === '1') tipsText = 2;
          if (this.data.status.hotwater_level === '0') tipsText = 1;
          if (tipsText === 0 || tipsText === 1 || tipsText === 2){
            this.setData({
              haveTips: true,
              tipsIndex: tipsText
            })
          }
        }
      }
    },
    //温度最值确定
    temperatureTextremity(){
      //温度最值赋值
      this.setData({
        minTemp: this.data.status.set_temperature_min,
        maxTemp: this.data.status.set_temperature_max,
      })
    },
    updateUI() {
      //更新界面
      wx.showNavigationBarLoading()
      this.triggerEvent('modeChange', this.getCurrentMode());
      //进度条显示
      let circleProgressBar = this.selectComponent('#circleProgressBar');
      if (circleProgressBar) {
        let temperature = 0
        if (this.data.status.power == 'on') {
          temperature = this.data.status.set_temperature;
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
          // resp.data.data.water_box_temperature = '54';
          if (resp.data.code == 0) {
            this.setData({
              status: resp.data.data
            })
            resolve(resp.data.data || {})
          } else {
            reject(resp)
          }
          // console.log(this.data.applianceData.sn8)
          // console.log(resp.data.data)
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
    //点击关闭提示信息
    weatherTips(){
      this.setData({
        haveTips:false
      })
    },
    //开关机
    powerToggle() {
      this.luaControl({
        "control_type": '1',
        "power": this.data.status.power == "on" ? "off" : "on"
      }).then(() => {
        this.getActived();
        })
    },
    //节能
    ecoRequest() {
      if (this.data.status.power == 'off' || this.data.status.energy_mode == 'on') return;
      this.luaControl({
        "control_type":'1',
        "mode": 'energy'
      }).then((result) => {
        console.log(result);
        this.getActived();
        })
    },
    //快热
    compatibilizingRequest() {
      if (this.data.status.power == 'off' || this.data.status.compatibilizing_mode == 'on') return;
      this.luaControl({
        "control_type": '1',
        "mode": 'compatibilizing'
      }).then((result) => {
        this.getActived();
        })
    },
    //单点调节温度
    temperatureChange(e) {
      let result = true;
      let isChanged = false;
      let status = this.data.status;
      if (e.target.id == 'tempMinus') {
        if (status.set_temperature > this.data.minTemp) {
          this.setData({
            "status.set_temperature": status.set_temperature - this.data.step
          })
          this.updateUI()
          isChanged = true
        } else {
          wx.hideToast();
          wx.showToast({
            title: '已是最低温度',
            icon: 'none'
          })
          result = false
        }
      } else if (e.target.id == 'tempPlus') {
        if (status.set_temperature < this.data.maxTemp) {
          this.setData({
            "status.set_temperature": Number(status.set_temperature) + this.data.step
          })
          this.updateUI()
          isChanged = true
        } else {
          wx.hideToast();
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
            "set_temperature": this.data.status.set_temperature
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
        if (status.set_temperature > this.data.minTemp) {
          this.data.intervalHandler = setInterval(() => {
            let targetTemperature = this.data.status.set_temperature - this.data.step
            if (targetTemperature < this.data.minTemp) {
              targetTemperature = this.data.minTemp
            }
            this.setData({
              "status.set_temperature": targetTemperature
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
        if (status.set_temperature < this.data.maxTemp) {
          this.data.intervalHandler = setInterval(() => {
            let targetTemperature = Number(this.data.status.set_temperature) + this.data.step
            if (targetTemperature > this.data.maxTemp) {
              targetTemperature = this.data.maxTemp
            }
            this.setData({
              "status.set_temperature": targetTemperature
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
          "set_temperature": this.data.status.set_temperature
        }).then((data) => {
          //do not handle call back data
        })
      }
    },
  },
})