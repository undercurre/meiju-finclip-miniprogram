// plugin/T0x38/cards/card0/card0.js
import api from "../../api/api"
let app = getApp()
const environment = app.getGlobalConfig().environment
const IMAGE_SERVER = environment == 'prod' ? 'https://www.smartmidea.net/projects/meiju-lite-assets/plugin/0x38/' : 'https://www.smartmidea.net/projects/sit/meiju-lite-assets/plugin/0x38/'
import configs from "../../configs/index"
import { cloudDecrypt } from 'm-utilsdk/index'
let key = app.globalData.userData.key
const appKey = app.getGlobalConfig().appKey
let {deviceConfig}=configs

Component({
  options: {
    styleIsolation: 'page-shared',//设置为share后，该组件的wxss文件可以影响到mui组件的样式
  },
  /**
   * 组件的属性列表,applianceData:deviceInfo
   */
  properties: {
    applianceData: {
      type: Object,
      value: function () {
          return {
          }
      },
  }
  },

  /**
   * 组件的初始数据
   */
  data: {
    height: 0,
    deviceStatus: {},//设备状态
    sn: null,
    deviceIcon: `${IMAGE_SERVER}standby.png`,//设备自清洗图
    deviceIconBackground: `${IMAGE_SERVER}rectangle.png`,//设备背景图
    lightIcon: `${IMAGE_SERVER}lightning.png`,//充电的闪电图标
    modeIcon: `${IMAGE_SERVER}self-cleaning.png`,//x9模式图标
    waterIcon: `${IMAGE_SERVER}water.png`,//x9清扫水量图标
    suctionIcon: `${IMAGE_SERVER}suction.png`,//x9速吸挡位图标
    autoIcon: `${IMAGE_SERVER}auto_icon.png`,//x10自动图标
    fixIcon: `${IMAGE_SERVER}point_icon.png`,//x10定点图标
    questionIcon: `${IMAGE_SERVER}questions.png`,//产品问答图标
    videoIcon: `${IMAGE_SERVER}video.png`,//视频问答
    rightIcon: `${IMAGE_SERVER}right_arrow.png`,//右箭头图标
    downIcon: `${IMAGE_SERVER}down_arrow.png`,//下箭头图标
    settingPopupCloseIcon: `${IMAGE_SERVER}close.png`,//弹框右上角退出图标
    setttingPopupTitle: "",//参数设置弹框标题
    setttingPopupDes: false,//是否有参数设置弹框描述
    setttingPopupDesText: "",//参数设置弹框描述内容
    settingPopupDetail: ["",""],//参数设置弹框滑动条

    x9SelfCleanModeList: deviceConfig.x9SelfCleanModeList,//X9系列自清洁模式
    X9CurrentSelfMode: deviceConfig.x9SelfCleanModeList[0],//X9系列当前自清洁模式
    suctionList: deviceConfig.suctionList,//X9速吸挡位
    waterList: deviceConfig.waterList,//X9清扫水量
    currentSuction: deviceConfig.suctionList[2],//X9当前吸力
    currentWater: deviceConfig.waterList[3],//X9当前水量
    x10AutoWaterList: deviceConfig.x10AutoWaterList,//X10清扫水量
    x10AutoCurrentWater: deviceConfig.x10AutoWaterList[0],//X10当前自动模式水量
    x10BrushSpeedList: deviceConfig.x10BrushSpeedList,//X10滚刷速度
    x10CurrentBrushSpeed: deviceConfig.x10BrushSpeedList[0],//X10当前滚刷速度
    x10FixedWaterList: deviceConfig.x10FixedWaterList,//X10定点水量调节
    x10CurrentFixedWater: deviceConfig.x10FixedWaterList[0],//X10当前定点水量

    testIndex: 0,//测试
    deviceState: {},//设备基础状态信息
    luaQueryInterval: undefined,//主动查询定时器
    errorText:"",//故障文案
    showNotify:false,//展示故障通知栏
    cleanMin: "14",//清扫时长
    rollingBrush: "200",//滚刷
    haiPa: "100",//海帕
    switchStatus: JSON.stringify({color: '#267AFF',selected: false,disabled: true}),//开关状态
    showModePopup: false,//模式弹框
    showSetttingPopup: false,//参数设置弹框
    showX11SettingPopup: false,//X11参数设置

    statusLeftText: '',//状态栏左侧标题栏文案
    statusRightText: '',//状态栏右侧标题栏文案
    deviceImages: {},//图片集
    deviceType: 'x9',//设备类型系列
    isX9: true,
    imageHeight: '0',
    imageWidth: '0',
    isCharge: false,//是否在充电中
    batteryPercent: 100,
    imageMarginTop: 0,//图片顶部的距离
    deviceWrapHeight: '710rpx',
    setPopViewHeight: '358rpx',
    popViewCellTitle: "",
    isAuto: false,
    auto_brush: 80,
    sliderLength: 0,
    currentSliderValue: 0,
    x10SelfCleanList:[
      {activeImage: `${IMAGE_SERVER}clenself_icon.png`, img: `${IMAGE_SERVER}clenself_icon_unselect.png`, text: '自清洁', tag: 1},
      {activeImage: `${IMAGE_SERVER}clean_dry_icon.png`, img: `${IMAGE_SERVER}clean_dry_icon_unselect.png`, text: '自清洁+烘干', tag: 2},
      {activeImage: `${IMAGE_SERVER}dry_icon.png`, img: `${IMAGE_SERVER}dry_icon_unselect.png`, text: '烘干', tag: 3},
    ],
    self_clean_mode: 0,//x10自清洁模式 :1自清洁 2自清洁加烘干 3烘干
    currentPower: 0,
    currentsliderChangeFlag: true,//是否根据电控结果更新进度条
    currentPowerChangeFlag: true,//是否根据电控结果更新自助力进度条
    powerSetTimeOut: null,//根据电控结果更新自助力进度条的定时器
    auto_brushChangeFlag: true,//是否根据电控结果更新滚刷进度条
    iconRemoveStatus: false,//是否显示左边的文字（图片偏右）
    imageWrapHeight: '646rpx',//动态容器的高度
    x11SettingPopupHeight: '820rpx',
    x11MainListData: [
      {
        title: '清洁偏好',
        subtext: '水量 | --',
        mainUrl: 'clean',
        iconUrl: `${IMAGE_SERVER}auto_icon.png`
      },
      {
        title: '烘干偏好',
        subtext: '--',
        mainUrl: 'dry',
        iconUrl: `${IMAGE_SERVER}point_icon-1.png`
      }
    ],//X11主页cell
    modeList: [
      {title: '自动', value: 0},
      {title: '速吸', value: 1},
      {title: '强力', value: 2}
    ],//X11模式列表
    x11AutoModeParams: deviceConfig.x11AutoModeParams,
    x11FastModeParams: deviceConfig.x11FastModeParams,
    x11StrongModeParams: deviceConfig.x11StrongModeParams,
    modelParameters: deviceConfig.x11AutoModeParams,//x11当前模式参数设置
    currentModeIndex: 0,
    x11ShowModeType: 'clean',
    dryList:[
      {text: '柔烘', key: 0, selectImage: `${IMAGE_SERVER}clenself_icon-1.png`, normalImage: `${IMAGE_SERVER}clenself_icon_unselect-1.png`},
      {text: '速干', key: 1, selectImage: `${IMAGE_SERVER}clean_dry_icon-1.png`, normalImage: `${IMAGE_SERVER}clean_dry_icon_unselect-1.png`},
    ],
    currentDryMode: 0,
    x11SelfCleanList:[
      {activeImage: `${IMAGE_SERVER}clenself_icon-1.png`, img: `${IMAGE_SERVER}clenself_icon_unselect.png`, text: '自清洁', tag: 1},
      {activeImage: `${IMAGE_SERVER}clean_dry_icon-1.png`, img: `${IMAGE_SERVER}clean_dry_icon_unselect.png`, text: '自清洁+烘干', tag: 2},
      {activeImage: `${IMAGE_SERVER}dry_icon_1.png`, img: `${IMAGE_SERVER}dry_icon_unselect.png`, text: '烘干', tag: 3},
    ],

  },

  lifetimes: {
    //组件被加入时，查询状态并添加轮询定时器
    attached() {
      console.log("当前数据mode:",this.data.modelParameters);
      let type = 'x9'
      let deviceWrapHeight = '646rpx'
      if(['7500048J','7500048N'].indexOf(this.properties.applianceData.sn8) > -1) {
        type = 'x9'
        deviceWrapHeight = '710rpx'
      }else if(['750004D4'].indexOf(this.properties.applianceData.sn8) > -1) {
        type = 'x11'
        deviceWrapHeight = '776rpx'
      }else {
        type = 'x10'
        deviceWrapHeight = '646rpx'
      }
      this.setData({
        isX9: ['7500048J','7500048N'].indexOf(this.properties.applianceData.sn8) > -1 ? true : false,
        deviceType: type,
        deviceWrapHeight: deviceWrapHeight
      })

      let height = wx.getSystemInfoSync().statusBarHeight
      this.setData({height})
      let sn = cloudDecrypt(this.properties.applianceData.sn, key, appKey)
      this.setData({sn})
      if(this.properties.applianceData.onlineStatus == 1) {
        wx.showLoading({title: "加载中"})
        this.queryCmds()
        let timer = setInterval(() => {
          this.queryCmds()
        }, 5000);
        this.setData({
          luaQueryInterval: timer
        })
      }
      let params = {
        sn8: this.properties.applianceData.sn8,
        typeName: 'device_status_weex'
      }
      console.log("当前的数据入参是：",params);
      api.getDevicePicsBySN8(params).then(res => {
        console.log("当前的图片资源是:",res);
        if(res.hasData == true) {
          for (let i = 0; i < res.result.length; i++) {
            const item = res.result[i];
            Object.defineProperty(this.data.deviceImages,item.imgCode,{
              configurable: true,
              enumerable: true,
              writable: true,
              value: item
            })
            
          }
        }
      })

    },
    //组件被移除时，清除轮询定时器
    detached() {
      if(this.data.luaQueryInterval != null) {
        clearInterval(this.data.luaQueryInterval)
      }
    }
  },

 
  /**
   * 组件的方法列表
   */
  methods: {
    //页面跳转
    toPages(e) {
      let page = e.currentTarget.dataset.page
      // console.log('encodeURIComponent(this.data.applianceData',encodeURIComponent(JSON.stringify(this.data.applianceData)));
      wx.navigateTo({
        url: '../paths/'+page+'/'+page + '?applianceData=' + encodeURIComponent(JSON.stringify(this.data.applianceData)),
        fail: function(err) {
          console.log(err);
        }
      })
    },

    //显示弹框
    onShowPopup(e) {
      this.setData({
        showModePopup: e.currentTarget.dataset.popup == 'showModePopup' ? true : false,
        showSetttingPopup: e.currentTarget.dataset.popup == 'showSetttingPopup' ? true : false,
        showX11SettingPopup: e.currentTarget.dataset.popup == 'showX11SettingPopup' ? true : false,
      })
      if(this.data.showSetttingPopup) {
        switch(e.currentTarget.dataset.set) {
          default: console.log(e.currentTarget.dataset.set);
          case "water": 
            this.setData({
              setttingPopupTitle: "清扫水量调节",
              setttingPopupDes: true,
              setttingPopupDesText: "水量小水渍残留少，但清洁效果会减弱",
              settingPopupDetail: ["最小","偏小","适中","偏大","最大"],
              setPopViewHeight: '358rpx',
              isAuto: false,
              sliderLength: 4,
              currentSliderValue: this.data.currentWater.sliderValue,

            });
            break;
          case "suction": 
            this.setData({
              setttingPopupTitle: "速吸挡位调节",
              setttingPopupDes: false,
              settingPopupDetail: ["0","100%"],
              setPopViewHeight: '358rpx',
              isAuto: false,
              sliderLength: 10,
              currentSliderValue: this.data.currentSuction.sliderValue
            })
            break;
          case "auto": 
            this.setData({
              setttingPopupTitle: "自动模式调节",
              setttingPopupDesText: "水量小水渍残留少，但清洗效果会减弱",
              setttingPopupDes: true,
              popViewCellTitle: "清扫水量",
              settingPopupDetail: ["小","大"],
              setPopViewHeight: '640rpx',
              isAuto: true,
              sliderLength: 4,
              currentSliderValue: this.data.x10AutoCurrentWater.sliderValue
            })
            break;
          case "fixed": 
            this.setData({
              setttingPopupTitle: "定点模式调节",
              setttingPopupDesText: "水量大去污能力好但残留水迹多，可根据您的使用环境进行调整，例如地板适用小水量",
              setttingPopupDes: true,
              popViewCellTitle: "清扫水量",
              settingPopupDetail: ["小","中","大"],
              setPopViewHeight: '400rpx',
              isAuto: false,
              sliderLength: 2,
              currentSliderValue: this.data.x10CurrentFixedWater.sliderValue
            })
          break;
        }
      }
      if(this.data.showX11SettingPopup) {
        switch(e.currentTarget.dataset.set) {
          default: console.log(e.currentTarget.dataset.set);
          case "clean": 
            this.setData({
              setttingPopupTitle: "清洁偏好",
              x11SettingPopupHeight: '820rpx',
              x11ShowModeType: 'clean'
            })
          break;

          case "dry": 
          this.setData({
            setttingPopupTitle: "烘干偏好",
            x11SettingPopupHeight: '450rpx',
            x11ShowModeType: 'dry'
          })
        break;

        }
      }
    },
    // 弹出层消失
    onClose() {
      this.setData({
        showModePopup: false,
        showSetttingPopup:false,
        currentsliderChangeFlag: true,
        auto_brushChangeFlag: true,
        showX11SettingPopup: false,
      })
    },
    //改变工作模式

    //改变参数:获取进度条的值然后调用相关设置的函数（滚刷单独取值并设置）
    async onSetttingChange(e) {
      this.setData({currentsliderChangeFlag: false})
      console.log("当前滑动条数据:",e.detail);
      let changeSuccess = null
      if(this.data.setttingPopupTitle == '清扫水量调节') {
        this.setData({
          currentWater: this.data.waterList.find(i => i.sliderValue == e.detail),
        })
        changeSuccess = await this.waterLevelSet(e.detail)
      }else if(this.data.setttingPopupTitle == '速吸挡位调节') {
        this.setData({
          currentSuction: this.data.suctionList.find(i => i.sliderValue == e.detail),
        })
        changeSuccess = await this.fastGearSet(e.detail * 10)
      }else if(this.data.setttingPopupTitle == '自动模式调节') {
        this.setData({
          x10AutoCurrentWater: this.data.x10AutoWaterList.find(i => i.sliderValue == e.detail),
        })
        let param = {
          'control_type': 'work_mode_param',
          'auto_pump': 30 + e.detail * 10,
        }
        changeSuccess = await this.x10WaterChange(param)
      }else if(this.data.setttingPopupTitle == '定点模式调节') {
        this.setData({
          x10CurrentFixedWater: this.data.x10FixedWaterList.find(i => i.sliderValue == e.detail),
        })
        let param = {
          'control_type': 'work_mode_param',
          'fixed_point_pump': 80 + e.detail * 20,
        }
        changeSuccess = await this.x10WaterChange(param)
      }
      if(changeSuccess) {
        this.setData({currentsliderChangeFlag: false})
      }else {
        wx.showToast({
          title: '修改失败，请重试',
          icon: 'none'
        })
        this.setData({currentsliderChangeFlag: true})
      }
    },

    // X11清洁偏好修改模式
    selectCleanMode(e) {
      if(e.currentTarget.dataset.index == this.data.currentModeIndex) {
        return
      }
      if(e.currentTarget.dataset.index == 0) {
        this.setData({
          currentModeIndex: e.currentTarget.dataset.index,
          modelParameters: this.data.x11AutoModeParams
        })
      }else if(e.currentTarget.dataset.index == 1) {
        this.setData({
          currentModeIndex: e.currentTarget.dataset.index,
          modelParameters: this.data.x11FastModeParams
        })
      }else if(e.currentTarget.dataset.index == 2) {
        this.setData({
          currentModeIndex: e.currentTarget.dataset.index,
          modelParameters: this.data.x11StrongModeParams
        })
      }
    },

    async onPowerAdjustChange(e) {
      this.setData({currentPowerChangeFlag: false})
      console.log("自助力:",e.detail);
      let param = this.byTypeAdjustPowerSelfValue(e.detail, 2)
      const changeStatus = await this.selfPowerAdjust(param)
      if(changeStatus) {
        this.setData({currentPowerChangeFlag: false})
        if(this.data.powerSetTimeOut) clearTimeout(this.data.powerSetTimeOut)
        let powerSetTimeOut = setTimeout(() => {
          this.setData({currentPowerChangeFlag: true})
        },5000)
        this.setData({powerSetTimeOut})
      }else {
        wx.showToast({
          title: '修改失败，请重试',
          icon: 'none'
        })
        this.setData({currentPowerChangeFlag: true})        
      }
    },

    //下载美居
    downLoadApp() {
      wx:wx.navigateTo({
        url: '/pages/download/download',
        fail: (res) => {console.log(res);},
      })
    },

    // X9根据不同的状态设置图片不同的尺寸（主要是因为设计给的图尺寸不统一造成的）574
    setX9ImageRect(status) {
      if(['charging','charge_finish'].indexOf(status) > -1) {
        this.setData({
          imageHeight: '460rpx',
          imageWidth: '460rpx',
          isCharge: true,
        })
      }else if(['standby'].indexOf(status) > -1) {
        this.setData({
          imageHeight: '600rpx',
          imageWidth: '703rpx',
          isCharge: false,

        })
      }else if(['auto','fixed_point','fast'].indexOf(status) > -1) {
        this.setData({
          imageHeight: '670rpx',
          imageWidth: '600rpx',
          isCharge: false,

        })
      }else if(['upright','clean_status_check_step',''].indexOf(status) > -1) {
        this.setData({
          imageHeight: '622rpx',
          imageWidth: '534rpx',
          isCharge: false,

        })
      }else if(['clean_roll_brush_step','clean_pipeline_step','clean_smart_check_step','clean_deep_clean_step','baking_dry','brush_air_drying','clean_dry_finish','clean_finish_step'].indexOf(status) > -1) {
        this.setData({
          imageHeight: '640rpx',
          imageWidth: '750rpx',
          isCharge: false,

        })
      }else if(['clean_dry_shutdown_step','clean_shutdown_step','exception']) {
        this.setData({
          imageHeight: '560rpx',
          imageWidth: '480rpx',
          isCharge: false,

        })
      }else {
        this.setData({
          imageHeight: '600rpx',
          imageWidth: '703rpx',
          isCharge: false,

        })
      }
    },

    // X9水量电控信息转换为自定义参数
    X9WaterLevelTransform(value) {
      let tempValue = 2
      if(value <= 35) {
        tempValue = 0
      }else if(value > 35 && value <= 45) {
        tempValue = 1
      }else if(value > 45 && value <= 55) {
        tempValue = 2
      }else if(value > 55 && value <= 65) {
        tempValue = 3
      }else if(value > 65){
        tempValue = 4
      }else {
        tempValue = 2
      }
      console.log("tempValue:",tempValue);
      this.setData({
        currentWater: this.data.waterList.find(i => i.sliderValue == tempValue),
      })
    },
    // X9档位电控信息转换为自定义参数
    X9FastGearTransform(value) {
      this.setData({
        currentSuction: this.data.suctionList.find(i => i.sliderValue * 10 == value),
      })
    },

     // 自助力根据参数来确定当前的自定义参数大小或者滑动条的值 1表示根据机器的值换算成滑动条的值，2表示根据滑动条的值换算成机器参数
     byTypeAdjustPowerSelfValue(value,type=1) {
      let index = 2
      if(type == 1) {
        if(value < 80 || value == 80) {//77
          this.setData({
            currentPower: 100
          })
        }else if(value < 150 && value > 80 ) {//100
          this.setData({
            currentPower: 75
          })
        }else if(value > 149 && value < 183) {//180
          this.setData({
            currentPower: 50
          })
        }else if(value > 182 && value < 187) {//185
          this.setData({
            currentPower: 25
          })
        }else {//190
          this.setData({
            currentPower: 0
          })
        }
      }else {
        switch (value) {
          case 0:
            index = 0;
            break;
          case 25:
            index = 1;
            break;
          case 50:
            index = 2;
            break;
          case 75:
            index = 3;
            break;
          default:
            index = 4;
            break;
        }
        let temp = deviceConfig.x10SlefPowerVales[index]
        return {
          push_forward: temp.pushForward,
          pull_back: temp.pullBack
        }
      }

     },

    //  更新X11清洁偏好和烘干偏好文案
    updateX11MainItemCellSubText(auto_pump, selfclean_dry_set) {
      let cleanItem = this.data.x11MainListData[0]
      let dryItem = this.data.x11MainListData[1]
      if(auto_pump == 30) {
        cleanItem.subtext = "水量 | 小"
      }else if(auto_pump == 40) {
        cleanItem.subtext = "水量 | 适中"
      }else if(auto_pump == 50) {
        cleanItem.subtext = "水量 | 较大"
      }else if(auto_pump == 60) {
        cleanItem.subtext = "水量 | 大"
      }else {
        cleanItem.subtext = "水量 | --"
      }

      if(selfclean_dry_set == 0) {
        dryItem.subtext = '柔烘'
      }else {
        dryItem.subtext = '速干'
      }
      let tempArr = [
        cleanItem,
        dryItem
      ]
      this.setData({
        x11MainListData: tempArr
      })
    },

    /**
     * lua相关接口
     */
    queryCmds() {
      this.queryDeviceStatus()
      this.queryCleanMin()
      this.queryMaterial()
    },

    // 设备基本状态查询
    queryDeviceStatus() {
      // console.log(121212);
      let param = {
        "query_type":"base"
       }
       api.luaQuery(this.properties.applianceData.applianceCode, param).then(res => {
        console.log("查询设备基本状态:", res);
        let iconRemoveStatus = false
        if(this.data.deviceType == 'x9') {
          iconRemoveStatus = false
        }else if(this.data.deviceType == 'x11') {
          iconRemoveStatus = true
        }else {
          if(['auto','fast','fixed_point','standby','upright'].includes(res.work_mode)) {
            iconRemoveStatus = true
          }else {
            iconRemoveStatus = false
          }
        }
        // 更新显示：状态栏、设备图片和电量
        this.setData({
          deviceState: res,
          statusLeftText: deviceConfig.selfCleanStatusList.indexOf(res.work_mode) > -1 ? '自清洁' : deviceConfig.deviceStatus[res.work_mode],
          statusRightText: deviceConfig.selfCleanStatusList.indexOf(res.work_mode) > -1 ? deviceConfig.deviceStatus[res.work_mode] : '电量' + res.battery_ratio + '%',
          X9CurrentSelfMode: res.air_dry == 'on' ? this.data.x9SelfCleanModeList[0] : this.data.x9SelfCleanModeList[1],
          deviceIcon: JSON.stringify(this.data.deviceImages) == '{}' ? `${IMAGE_SERVER}standby.png`  : this.data.deviceImages[res.work_mode].imgUrl,
          batteryPercent: res.battery_ratio,
          // iconRemoveStatus: ['auto','fast','fixed_point','standby','upright'].includes(res.work_mode) && !this.data.isX9 ? true : false
          iconRemoveStatus: iconRemoveStatus,
        })
        // 更新x9参数显示：水量、吸力
        if(this.data.deviceType == 'x9') {
          this.X9WaterLevelTransform(res.pump_value)
          this.X9FastGearTransform(res.fast_gear)
        }else if(this.data.deviceType == 'x11') {
          if(this.data.currentsliderChangeFlag) {
            let autoList = this.data.x11AutoModeParams
            let fastList = this.data.x11FastModeParams
            let strongList = this.data.x11StrongModeParams
            autoList[0].currentValue = res.auto_pump
            autoList[1].currentValue = res.auto_brush
            fastList[0].currentValue = res.fast_fan_power
            fastList[1].currentValue = res.fast_brush
            strongList[0].currentValue = res.power_pump
            strongList[1].currentValue = res.power_brush
            this.setData({
              x11AutoModeParams: autoList,
              x11FastModeParams: fastList,
              x11StrongModeParams: strongList,
            })
            if(this.data.currentModeIndex == 0) {
              this.setData({
                modelParameters: this.data.x11AutoModeParams
              })
            }else if(this.data.currentModeIndex == 1) {
              this.setData({
                modelParameters: this.data.x11FastModeParams
              })
            }else if(this.data.currentModeIndex == 2) {
              this.setData({
                modelParameters: this.data.x11StrongModeParams
              })
            }
          }
          this.setData({
            self_clean_mode: res.self_clean_mode,
            currentDryMode: res.selfclean_dry_set
          })
          this.updateX11MainItemCellSubText(res.auto_pump, res.selfclean_dry_set)
          if(res.selfclean_dry_set == 1) {
            this.setData({
              x11SelfCleanList:[
                {activeImage: `${IMAGE_SERVER}clenself_icon-1.png`, img: `${IMAGE_SERVER}clenself_icon_unselect.png`, text: '自清洁', tag: 1},
                {activeImage: `${IMAGE_SERVER}clean_dry_icon-1.png`, img: `${IMAGE_SERVER}clean_dry_icon_unselect.png`, text: '自清洁+烘干', tag: 4},
                {activeImage: `${IMAGE_SERVER}dry_icon_1.png`, img: `${IMAGE_SERVER}dry_icon_unselect.png`, text: '烘干', tag: 5},
              ],
            })
          }else {
            this.setData({
              x11SelfCleanList:[
                {activeImage: `${IMAGE_SERVER}clenself_icon-1.png`, img: `${IMAGE_SERVER}clenself_icon_unselect.png`, text: '自清洁', tag: 1},
                {activeImage: `${IMAGE_SERVER}clean_dry_icon-1.png`, img: `${IMAGE_SERVER}clean_dry_icon_unselect.png`, text: '自清洁+烘干', tag: 2},
                {activeImage: `${IMAGE_SERVER}dry_icon_1.png`, img: `${IMAGE_SERVER}dry_icon_unselect.png`, text: '烘干', tag: 3},
              ],
            })
          }
        }else {
            //更新x10参数显示：自动、定点、滚刷速度、自清洁/烘干icon
            this.setData({
              self_clean_mode: res.self_clean_mode,
              x10AutoCurrentWater:  this.data.x10AutoWaterList.find(i => (i.sliderValue * 10 + 30) == res.auto_pump),
              x10CurrentFixedWater:  this.data.x10FixedWaterList.find(i => (i.sliderValue * 20 + 80) == res.fixed_point_pump),
            })
            if(this.data.auto_brushChangeFlag) {
              this.setData({auto_brush: res.auto_brush ? res.auto_brush : 80})
            }
            console.log('currentPowerChangeFlag',this.data.currentPowerChangeFlag,res.push_forward);
            if(this.data.currentPowerChangeFlag) {
              this.byTypeAdjustPowerSelfValue(res.push_forward)
            }
            console.log("当前的数据是:",this.data.x10FixedWaterList);
          
          
        }
        // 更新参数弹框中进度条的值
        if(this.data.currentsliderChangeFlag) {
          if(this.data.setttingPopupTitle == '清扫水量调节') {
            this.setData({
              currentSliderValue: this.data.currentWater.sliderValue
            })
          }else if(this.data.setttingPopupTitle == '速吸挡位调节') {
            this.setData({
              currentSliderValue: this.data.currentSuction.sliderValue
            })
          }else if(this.data.setttingPopupTitle == '自动模式调节') {
            this.setData({
              currentSliderValue: this.data.x10AutoCurrentWater.sliderValue
            })
          }else if(this.data.setttingPopupTitle == '定点模式调节') {
            this.setData({
              currentSliderValue: this.data.x10CurrentFixedWater.sliderValue
            })
          }
        }
        if(this.data.deviceType == 'x9') {
          //更新x9设备图片的宽高
          this.setX9ImageRect(res.work_mode)
          //更新开关
          this.setData({switchStatus: JSON.stringify({color: '#267AFF',selected: deviceConfig.selfCleanStatusList.indexOf(res.work_mode) > -1 ?true: false,disabled: true})})
        }else if(this.data.deviceType == 'x11') {
          this.setData({
            imageHeight: '776rpx',
            imageWidth: '750rpx',
            imageWrapHeight: '776rpx',
            isCharge: false,
          })
        }else {
            //更新x10：设备图片宽高
          this.setData({
            imageHeight: '644rpx',
            imageWidth: '750rpx',
            isCharge: ['charging'].indexOf(res.work_mode) > -1 ? true : false,
          })
        }
   
        
        wx.hideLoading({
          noConflict: true,
        })
      }, err => {
        wx.hideLoading({
          noConflict: true
        })
      })
    },
    
    //点击x9开关
    tapSwitch() {
      if(this.data.deviceState.plug_status != 'on') {
        wx.showToast({
          title: '请将设备放置在充电座后开启',
          icon: 'none'
        })
        return
      }
      //之前是开 点击后则关
      this.modelChange("self_clean",JSON.parse(this.data.switchStatus).selected ? 'off' : 'on')
      this.setData({switchStatus: JSON.stringify({color: '#267AFF',selected: !JSON.parse(this.data.switchStatus).selected,disabled: true})})
      if(!JSON.parse(this.data.switchStatus).selected) {
        wx.showToast({
          title: '自清洁关闭，请清理污水箱',
          icon: 'none'
        })
      }
    },
    //查询网络数据：清扫时长
    queryCleanMin() {
      const params = {
        "applianceId": "",
        "homeId": "",
        "size": 7,
        "sn": this.data.sn,
        "uid": ""
      }
      api.queryDayClean(params).then(res => {
        // console.log('今日清扫',res);
        this.setData({cleanMin:res.result.todayDuration})
      },err => console.log(err))
    },
    //查询网络数据：滤材
    queryMaterial() {
      const params = {
        "applianceId": "",
        "homeId": "",
        "sn": this.data.sn,
      }
      api.queryMaterial(params).then(res => {
        // console.log('滤材',res);
        this.setData({
          rollingBrush: res.result.suppliesDetailDtoList.find(i => i.suppliesType == 'brush').suppliesTimeLeftPercent,
          haiPa: res.result.suppliesDetailDtoList.find(i => i.suppliesType == 'handset_hepa').suppliesTimeLeftPercent
        })
      },err => console.log(err))
    },
    // 模式切换
    modelChange(work_model,type){
      wx.showLoading({title: "加载中"})
      let param = {
        "control_type": "work_mode",
        "work_mode": work_model,
        "work_mode_ctl_type": type
      }
      api.luaControl(this.properties.applianceData.applianceCode,param).then(res => {
        this.queryDeviceStatus()
        wx.hideLoading({
          noConflict: true
        })
      }, err => {
        wx.hideLoading({
          noConflict: true
        })
      })
    
    },


    //X9系列需要设置打开自清洁的模式（仅自清洁或者自清洁+风干）
    setCleanModeType(e) {
      if(this.data.X9CurrentSelfMode.key == e.currentTarget.dataset.mode.key) {
        this.onClose()
        return
      }
      wx.showLoading({title: "加载中"})
      let air_dry = e.currentTarget.dataset.mode.key == 'selfClean_and_wind' ? 'on' : 'off'
      let param = {
        "control_type": "brush_dry_set",
        "air_dry": air_dry
      }
      console.log("param:",param);
      api.luaControl(this.properties.applianceData.applianceCode,param).then(res => {
        this.queryDeviceStatus()
        this.setData({X9CurrentSelfMode: e.currentTarget.dataset.mode})
        this.onClose()
        wx.hideLoading({
          noConflict: true
        })
      }, err => {
        this.onClose()
        wx.hideLoading({
          noConflict: true
        })
      })
    },

    // X9清扫水量设置
    waterLevelSet(value) {
      wx.showLoading({title: ""})
      let pump_value = 50
      switch (value) {
        case 0:
          pump_value = 30
          break;
        case 1:
          pump_value = 40
          break;
        case 2:
          pump_value = 50
          break;
        case 3:
          pump_value = 60
          break;
        case 4:
          pump_value = 70
          break;
        default:
          pump_value = 50
          break;
      }
      let param = {
        "control_type":"pump",
        "pump_mode": "set",
        "pump_platform": "inboard_midea_app",
        "pump_value": pump_value
      }
      console.log("水量设置参数:",param);
      return new Promise((resolve, reject) => {
        api.luaControl(this.properties.applianceData.applianceCode,param).then(res => {
          this.queryDeviceStatus()
          wx.hideLoading({
            noConflict: true
          })
          resolve(true)
        }, err => {
          wx.hideLoading({
            noConflict: true
          })
          reject(false)
        })        
      })
    },
    // X9速吸档位设置
    fastGearSet(value) {
      wx.showLoading({title: ""})
      let param = {
        "control_type": "gear_set",
        "fast_gear": value
      }
      return new Promise((resolve, reject) => {
        api.luaControl(this.properties.applianceData.applianceCode,param).then(res => {
          this.queryDeviceStatus()
          wx.hideLoading({
            noConflict: true
          })
          resolve(true)
        }, err => {
          wx.hideLoading({
            noConflict: true
          })
          reject(false)
        })
      })
    },
    // x10滚刷速度调试
    async autoBrushChange(e) {
      this.setData({auto_brushChangeFlag: false})
      wx.showLoading({title: ""})
      let param = {
        'control_type': 'work_mode_param',
        'auto_brush': e.detail,
      }
      await api.luaControl(this.properties.applianceData.applianceCode,param).then(res => {
        this.queryDeviceStatus()
        wx.hideLoading({
          noConflict: true
        })
        this.setData({auto_brushChangeFlag: false})
      }, err => {
        wx.hideLoading({
          noConflict: true
        })
        wx.showToast({
          title: '修改失败，请重试',
          icon: 'none'
        })
        this.setData({auto_brushChangeFlag: true})
      })
    },
    // X10水量调节
    x10WaterChange(param) {
      wx.showLoading({title: ""})
      return new Promise((resolve, reject) => {
        api.luaControl(this.properties.applianceData.applianceCode,param).then(res => {
          this.queryDeviceStatus()
          wx.hideLoading({
            noConflict: true
          })
          resolve(true)
        }, err => {
          wx.hideLoading({
            noConflict: true
          })
          reject(false)
        })        
      })
    },

    // x10自清洁
    x10ClickSelfClean(e) {
      // 不在充电座上
      if(this.data.deviceState.plug_status != 'on') {
        wx.showToast({
          title: '请将设备放置在充电座后开启',
          icon: 'none'
        })
        return
      }
      //目前在工作中，需先关闭再切换
      if(this.data.self_clean_mode) {
        //再次点击关闭
        if(e.currentTarget.dataset.tag == this.data.self_clean_mode) {
          if(e.currentTarget.dataset.tag == 1) {
            this.modelChange('self_clean','off')
          }else if(e.currentTarget.dataset.tag == 2) {
            this.modelChange('self_clean_and_baking_dry','off')
          }else if(e.currentTarget.dataset.tag == 3) {
            this.modelChange('baking_dry','off')
          }
          wx.showToast({
            title: '自清洁关闭，请清理污水箱',
            icon: 'none'
          })
          this.setData({self_clean_mode: 0})
        }else {
          wx.showToast({
            title: '请先关闭当前模式，再进行模式切换操作',
            icon: 'none'
          })
        }
      }else {
        //目前未工作，直接切换
        if(e.currentTarget.dataset.tag == 1) {
          this.modelChange('self_clean','on')
          this.setData({self_clean_mode: 1})
        }else if(e.currentTarget.dataset.tag == 2) {
          this.modelChange('self_clean_and_baking_dry','on')
          this.setData({self_clean_mode: 2})
        }else if(e.currentTarget.dataset.tag == 3) {
          this.modelChange('baking_dry','on')
          this.setData({self_clean_mode: 3})
        }
      }
    
    },
       // x11自清洁
    x11ClickSelfClean(e) {
        // 不在充电座上
        if(this.data.deviceState.plug_status != 'on') {
          wx.showToast({
            title: '请将设备放置在充电座后开启',
            icon: 'none'
          })
          return
        }
        //目前在工作中，需先关闭再切换
        if(this.data.self_clean_mode) {
          //再次点击关闭
          if(e.currentTarget.dataset.tag == this.data.self_clean_mode) {
            if(e.currentTarget.dataset.tag == 1) {
              this.modelChange('self_clean','off')
            }else if(e.currentTarget.dataset.tag == 2) {
              this.modelChange('self_clean_and_baking_dry','off')
            }else if(e.currentTarget.dataset.tag == 3) {
              this.modelChange('baking_dry','off')
            }else if(e.currentTarget.dataset.tag == 4) {
              this.modelChange('self_clean_and_fast_dry','off')
            }else if(e.currentTarget.dataset.tag == 5) {
              this.modelChange('fast_dry','off')
            }
            wx.showToast({
              title: '自清洁关闭，请清理污水箱',
              icon: 'none'
            })
            this.setData({self_clean_mode: 0})
          }else {
            wx.showToast({
              title: '请先关闭当前模式，再进行模式切换操作',
              icon: 'none'
            })
          }
        }else {
          //目前未工作，直接切换
          if(e.currentTarget.dataset.tag == 1) {
            this.modelChange('self_clean','on')
            this.setData({self_clean_mode: 1})
          }else if(e.currentTarget.dataset.tag == 2) {
            this.modelChange('self_clean_and_baking_dry','on')
            this.setData({self_clean_mode: 2})
          }else if(e.currentTarget.dataset.tag == 3) {
            this.modelChange('baking_dry','on')
            this.setData({self_clean_mode: 3})
          }else if(e.currentTarget.dataset.tag == 4) {
            this.modelChange('self_clean_and_fast_dry','on')
            this.setData({self_clean_mode: 4})
          }else if(e.currentTarget.dataset.tag == 5) {
            this.modelChange('fast_dry','on')
            this.setData({self_clean_mode: 5})
          }
        }
      
      },

    // 自助力调试
    selfPowerAdjust(params) {
      wx.showLoading({title: ""})
      let param = {
        'control_type': 'less_effort',
        ...params
      }
      console.log("自助力参数:",param);
      return new Promise((resolve, reject) => {
        api.luaControl(this.properties.applianceData.applianceCode,param).then(res => {
          this.queryDeviceStatus()
          wx.hideLoading({
            noConflict: true
          })
          resolve(true)
        }, err => {
          wx.hideLoading({
            noConflict: true
          })
          reject(false)
        })
      })
    },

    // X11设置第一个slider
    async  onSettingType1(e) {
      this.setData({currentsliderChangeFlag: false})
      wx.showLoading({title: ""})
      let params = {}
      params.control_type = 'work_mode_param'
      if(this.data.currentModeIndex == 0) {//自动模式的水量调节
        params.auto_pump = e.detail
      }else if(this.data.currentModeIndex == 1) {//速吸模式的吸力调节
        params.fast_fan_power = e.detail
      }else if(this.data.currentModeIndex == 2) {//强力模式的水量调节
        params.power_pump = e.detail
      }
      await api.luaControl(this.properties.applianceData.applianceCode,params).then(res => {
        this.updateX11MainItemCellSubText(this.data.deviceState.auto_pump, this.data.deviceState.selfclean_dry_set)
        this.queryDeviceStatus()
        wx.hideLoading({
          noConflict: true
        })
        this.setData({currentsliderChangeFlag: false})

      }, err => {
        wx.hideLoading({
          noConflict: true
        })
        wx.showToast({
          title: '修改失败，请重试',
          icon: 'none'
        })
        this.setData({currentsliderChangeFlag: true})

      })
    },
    // X11设置第二个slider
    async onSettingType2(e) {
      this.setData({currentsliderChangeFlag: false})
      wx.showLoading({title: ""})
      let params = {}
      params.control_type = 'work_mode_param'
      if(this.data.currentModeIndex == 0) {//自动模式的滚刷调节
        params.auto_brush = e.detail
      }else if(this.data.currentModeIndex == 1) {//速吸模式的滚刷调节
        params.fast_brush = e.detail
      }else if(this.data.currentModeIndex == 2) {//强力模式的滚刷调节
        params.power_brush = e.detail
      }
      console.log("当前的slider数据是:",params);
      await api.luaControl(this.properties.applianceData.applianceCode,params).then(res => {
        this.queryDeviceStatus()
        wx.hideLoading({
          noConflict: true
        })
        this.setData({currentsliderChangeFlag: false})
      }, err => {
        wx.hideLoading({
          noConflict: true
        })
        wx.showToast({
          title: '修改失败，请重试',
          icon: 'none'
        })
        this.setData({currentsliderChangeFlag: true})
      })
    },

    // X11修改烘干偏好
    changeDryMode(e) {
      if(e.currentTarget.dataset.index == this.data.currentDryMode) {
        return
      }
      wx.showLoading({title: ""})
      let params = {
        "control_type": "selfclean_dry_set",
        "selfclean_dry_set": e.currentTarget.dataset.index
      }
       api.luaControl(this.properties.applianceData.applianceCode,params).then(res => {
        this.updateX11MainItemCellSubText(this.data.deviceState.auto_pump, this.data.deviceState.selfclean_dry_set)
        this.queryDeviceStatus()
        wx.hideLoading({
          noConflict: true
        })
      }, err => {
        wx.hideLoading({
          noConflict: true
        })

      })

    },
  }
})
