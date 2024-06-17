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
    //风速
    windSpeed: ['自动风', '1 档', '2 档', '3 档', '4 档', '5 档', '6 档', '7 档'],
    // windSpeedE: ['auto', 'sleep', 'micron', 'low', 'middle', 'high', 'super_high', 'power'],
    // windSpeedIndex: 0,
    //模式mode_state: auto自动模式/full_heat旁通模式/passby全热交换模式
    arrayText: ['净氧', '清新', '超标','--'],
    arrayModeIndex: 0,
    isQueryOffLine: false,

    mode_type: 0,//单向流0，双向流1.unidirectional flow,bidirectional flow 
    unidirectional_flow: ["自动","低档","中档","高档"],
    unidirectional_index:0,
    // machine_type
    status: {
      room_aqi_value:'',
      room_temp_value:'',
      humidity_value:'',
      hcho_value:'',
      pm25_value:'',
      co2_value:'',
    },
    icons: {
      header: imageApi.getImagePath.url + '/0xCE/xinfeng.png',
      switch_power: {
        on: {
          img: imageApi.getImagePath.url + '/0xCE/switch-off@3x.png',
          desc: '关机'
        },
        off: {
          img: imageApi.getImagePath.url + '/0xCE/switch-on@3x.png',
          desc: '开机'
        }
      },
      eco: {
        on: imageApi.getImagePath.url + '/0xCE/eco-on@3x.png',
        off: imageApi.getImagePath.url + '/0xCE/eco-off@3x.png',
        desc: '节能'
      },
      powerfulClear: {
        on: imageApi.getImagePath.url + '/0xCE/powerfulClear-on@3x.png',
        off: imageApi.getImagePath.url + '/0xCE/powerfulClear-off@3x.png',
        desc: '强净'
      },
      fan:{
        on: imageApi.getImagePath.url + '/0xCE/fan-on@3x.png',
        off: imageApi.getImagePath.url + '/0xCE/fan-off@3x.png',
      },
      indoor:imageApi.getImagePath.url + '/0xCE/indoor@3x.png'
    },
    //设备数据
    timeoutHandler: null,
    intervalHandler: null
  },
  methods: {
    //*****固定方法，供外界调用****
    //确定单向流双向流以及updata
    modeFlow(){
      let machine_type = this.data.status.machine_type;
      switch (machine_type){
        case 'airflow2_250':
          this.setData({
            mode_type:1
          })
          break;
        case 'airflow2_350':
          this.setData({
            mode_type: 1
          })
          break;
        case 'airflow1_150':
          this.setData({
            mode_type: 0
          })
          break;
        case 'airflow1_250':
          this.setData({
            mode_type: 0
          })
          break;
        case 'airflow2_250':
          this.setData({
            mode_type: 1
          })
          break;
      }
      if (this.data.mode_type){
        this.updateUI();
      }else{
        this.updateUITwo();
      }
    },
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
        //模式mode_state: auto自动模式/full_heat旁通模式/passby全热交换模式
        switch (this.data.status.room_aqi_value) {
          case '1':
            mode = CARD_MODE_OPTION.CLEAR;//清新
            break;
          case '0':
            mode = CARD_MODE_OPTION.SUPPLY;//净氧
            break;
          case '2':
            mode = CARD_MODE_OPTION.HEAT;//超标
            break;
          case '3':
            mode = CARD_MODE_OPTION.COLD;//常规
            break;
          default: mode = CARD_MODE_OPTION.COLD
        }
      }
      return {
        applianceCode: this.data.applianceData.applianceCode,
        mode: mode
      }
    },
    //当设备列表页切换到当前页面时触发2
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
        this.modeFlow();//UPDATAui
      }).catch((error) => {
        // console.log(error);
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
    //初始化卡片页，只执行一次1
    initCard() {
      if (!this.data.isInit) {
        this.luaQuery().then((data) => {
          this.setData({
            isInit: true
          })
          setTimeout(() => {
            this.modeFlow()//updataUI
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
      //模式背景
      this.triggerEvent('modeChange', this.getCurrentMode());
      wx.hideNavigationBarLoading()
    },
    updateUITwo(){
      wx.showNavigationBarLoading()
      //模式背景
      this.triggerEvent('modeChange', this.getCurrentMode());
      //风速显示
      console.log(this.data.status.fan_set);
      let mode = Number(this.data.status.fan_set);
      switch (mode) {
        case 0: this.setData({ unidirectional_index: 0 }); break;
        case 1: this.setData({ unidirectional_index: 1 }); break;
        case 4: this.setData({ unidirectional_index: 2 }); break;
        case 7: this.setData({ unidirectional_index: 3 }); break;
        default: this.setData({ unidirectional_index: 0 }); break;
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
          //测试数据
          // resp.data.data.room_aqi_value = '3';
          // resp.data.data.co2_value = '800';
          // resp.data.data.pm25_value = '60';
          // resp.data.data.machine_type = 'airflow1_250';
          if (resp.data.code == 0) {
            this.dataError(resp.data.data);
            // this.setData({
            //   status: resp.data.data
            // })
            resolve(resp.data.data || {})
          } else {
            reject(resp)
          }
          // console.log(resp.data.data)
          this.modeFlow();
        }, (error) => {
          wx.hideNavigationBarLoading()
          console.error(error)
          reject(error)
        })
      })
    },
    //数据异常处理
    dataError(data){
      let iterable = data;
      for (let key in iterable) {
        if ((iterable[key] === '') || (iterable[key] === 'invalid')){
          iterable[key] = ' -- ';
        }
        // console.log(key + '---' + iterable[key])
      }
      this.setData({
        status: iterable
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
      this.luaControl({
        "power": this.data.status.power == 'on' ? "off" : "on"
      }).then((data) => {
        this.dataError(data);
        this.updateUI()
      })
    },
    //双向流风速切换，切换风速时取消节能
    windSpeedChange(e) {
      // if (this.data.status.power == 'off') return;
      this.luaControl({
        "function_set_energy_save": "off",
        "fan_set": e.detail.value
      }).then((data) => {
        this.dataError(data);
        this.updateUI();
      })
    },
    //单向流风速切换，切换风速时取消节能
    unidirectional_flowChange(e) {
      let fan_setNumber = Number(e.detail.value);
      switch (fan_setNumber){
        case 0: fan_setNumber = 0;break;
        case 1: fan_setNumber = 1; break;
        case 2: fan_setNumber = 4; break;
        case 3: fan_setNumber = 7; break;
        default: fan_setNumber = 0; break;
      }
      // if (this.data.status.power == 'off') return;
      this.luaControl({
        "function_set_energy_save":"off",
        "fan_set": fan_setNumber
      }).then((data) => {
        this.dataError(data);
        this.updateUITwo();
      })
    },
    //节能开关,开启时打开自动风；单双操作区分
    ecoRequest() {
      if (this.data.status.power=='off') return;
      this.luaControl({
        "function_set_energy_save": this.data.status.function_set_energy_save == 'on' ? "off" : "on", "fan_set": '0'
      }).then((data) => {
        this.dataError(data);
        //单双向分开更新
        if (this.data.mode_type){
          this.updateUI();
        }else{
          this.updateUITwo();
        }
      })
    },
    //强净开关
    powerfulClear(){
      if (this.data.status.power == 'off') return;
      this.luaControl({
        "function_set_ultimate": this.data.status.function_set_ultimate == 'on' ? "off" : "on"
      }).then((data) => {
        this.dataError(data);
        this.updateUI();
      })
    },
  },
  })