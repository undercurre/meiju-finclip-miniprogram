const app = getApp() //获取应用实例
const requestService = app.getGlobalConfig().requestService
const rangersBurialPoint = app.getGlobalConfig().rangersBurialPoint
const environment = app.getGlobalConfig().environment
import { getStamp } from 'm-utilsdk/index'
import Dialog from 'm-ui/mx-dialog/dialog'
import {FA, errorName, swingUdFilter_FA, shakeParamsTransfer_FA} from './js/FA.js'
import { Format } from '../../assets/scripts/format.js'
import { UI } from '../../assets/scripts/ui.js'
import MideaToast from '../../component/midea-toast/toast.js'
import {
  DeviceData,
  getWaterionsIsSpecial_DEVICE_DATA,
  getWaterionsName_DEVICE_DATA
} from '../../assets/scripts/device-data.js'
import { commonApi, imageDomain } from '../../assets/scripts/api.js'
import Toast from 'm-ui/mx-toast/toast'
let deviceStatusTimer = null
let animationIntervalTimer = null
let isDeviceInterval = true
let themeStyleColor = '#267AFF'

Component({
  options: {
    multipleSlots: true, // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    applianceData: {
      type: Object,
      value: function () {
        return {}
      },
    },
  },
  data: {
    switchWrapperIsFlex: false, // 整体开关区域是否横向布局
    switchSwingWrapperIsFlex: false,  // 摇头开关区域是否横向布局
    theme: '#267AFF',  // 主题颜色
    // 2024.3.29 ui8 malone
    deviceInfo: {},
    bannerImg: {
      effect1Url: '',
      effect2Url: '',
      effect3Url: '',
      isNewEffect: 0,
      isSpecialEffect: 0,
      mainPicType: -1,
      mainPicUrl: '',
      windSharpBg: '',  // 风效图片路径
      effectWaveUrl: 'https://ce-cdn.midea.com/ccs/icon/ctrl8/FA/mainPic/wave_low.png',  // 气流波浪路径
    },
    // 动画控制实例
    animation: '',
    // 是否进行动画中
    isAnimating: false,
    // 叶片动画
    effectLeaf: '',
    animationDeg: 0,
    // 波浪动画
    effectWave: '',
    // animationTimer: true,
    activeColor: '#7C879B',
    statusObj: {
      statusText: '',
      appointText: '',
      appointDescribe: '',
      statusPoint: '',
    },
    secondFuncCount: 0,
    secondFuncList: [],
    // 判断是否正在定时
    hasTiming: false,
    weatherObj: {
      temperature: '--',
    },
    airQualityObj: {
      aqiText: '--',
    },
    paramsArr: [],
    bgImage: {
      deviceImg: FA.baseImageUrl + '/ctrl5/T0xFA/v3/',
      deviceImg_common: FA.baseImageUrl + '/ctrl5/T0xFA/v3/main-pic.png',
      running: FA.baseImageUrl + '/ctrl8/FC/running.gif',
    },
    iconUrl: {
      powerOff: FA.baseImageUrl + '/ctrl8/FD/power_off.png',
      powerOn: FA.baseImageUrl + '/ctrl8/FD/power_on.png',
      timerOn: FA.baseImageUrl + '/ctrl8/FD/time_on_on_trans.png',
      timerOff: FA.baseImageUrl + '/ctrl8/FD/time_off_trans.png',
      timerOnOff: FA.baseImageUrl + '/ctrl8/FD/time_on_off_trans.png',
    },
    sliderList: [],
    // region 2021.11.22 敖广骏
    isInit: false,
    noticeBar: {
      isShow: false,
      content: '内容',
    },
    pageProductConfig: {
      power: {
        isShow: false,
        hasConfig: false,
      },
      mode: {
        isShow: false,
        iconUrl: imageDomain + '/0xFB/icon-switch.png',
        hasConfig: false,
        isShowSelectMode: false,
      },
      timing: {
        isShow: false,
        hasConfig: false,
        isShowTimedShutdown: false,
        selectedValue: 0,
        valueArray: [],
      },
      gear: {
        isShow: false,
        hasConfig: false,
        valueArray: {},
        activatedValueArray: [],
      },
      displayOnOff: {
        isShow: false,
        hasConfig: false,
        valueArray: [],
      },
      anion: {
        isShow: false,
        hasConfig: false,
      },
      lock: {
        isShow: false,
        hasConfig: false,
      },
      voice: {
        isShow: false,
        hasConfig: false,
      },
      swing: {
        isShow: false,
        hasConfig: false,
        valueArray: [],
      },
      udSwing: {
        isShow: false,
        hasConfig: false,
        valueArray: [],
      },
      tempWindSwitch: {
        isShow: false,
        hasConfig: false,
      },
      humidify: {
        isShow: false,
        hasConfig: false,
      },
      waterions: {
        isShow: false,
        hasConfig: false,
      },
      breathLight: {
        isShow: false,
        hasConfig: false,
      },
      airDried: {
        isShow: false,
        hasConfig: false,
      },
    },
    // 定义控件
    sliderGear: {
      min: 1,
      max: 1,
      interval: 1,
      currentValue: 4,
    },
    switchDisplayOnOff: {
      color: themeStyleColor,
      selected: false,
      disabled: true,
    },
    switchAnion: {
      color: themeStyleColor,
      selected: false,
      disabled: true,
    },
    switchLock: {
      color: themeStyleColor,
      selected: false,
      disabled: true,
    },
    switchVoice: {
      color: themeStyleColor,
      selected: false,
      disabled: true,
    },
    switchTempWindSwitch: {
      color: themeStyleColor,
      selected: false,
      disabled: true,
    },
    switchHumidify: {
      color: themeStyleColor,
      selected: false,
      disabled: true,
    },
    switchAirDried: {
      color: themeStyleColor,
      selected: false,
      disabled: true,
    },
    switchWaterions: {
      color: themeStyleColor,
      selected: false,
      disabled: true,
    },
    switchSwing: {
      color: themeStyleColor,
      selected: false,
      disabled: true,
    },
    switchUdSwing: {
      color: themeStyleColor,
      selected: false,
      disabled: true,
    },
    switchBreathLight: {
      color: themeStyleColor,
      selected: false,
      disabled: true,
    },

    isNewSwingProtocol: false,
    // 最新协议,版本号>6
    isNewestSwingProtocol: false,
    swingSliderList: [],
    udSwingIsOnOffAndOpenIsAngle: false,
    swingIsOnOffAndOpenIsAngle: false,
    swingIsOnOff: false,
    udSwingIsOnOff: false,
    count: 0,
  },
  methods: {
    // 根据档位判断动画速度
    getGearLevel(){
      let gear = this.data.deviceInfo.gear
      let gearList = this.data.pageProductConfig.gear.activatedValueArray||[]
      // console.log('分析动画速度', {gear, gearList},this.data.pageProductConfig)
      const gearIndex = gearList.findIndex(item => item.value == gear)
      return gearIndex > gearList.length / 2 - 1 ? 'high' : 'low'
    },
    // 动态头图处理
    animateDeviceImage(deviceInfo){
      console.log('动态头图处理: ',deviceInfo.isRunning)
      if(deviceInfo.isRunning){
        // 启动动画
        this.startAnimation(!this.data.isAnimating)

      } else {
        // 停止动画
        this.stopAnimation()
      }
    },
    onImgLoadErr() {
      let bgImage = this.data.bgImage
      bgImage.deviceImg = bgImage.deviceImg_common
      this.setData({
        bgImage,
      })
    },
    onCheckSecondFunc(event) {
      console.log('event:', event)
      const { index, item } = event.currentTarget.dataset
      const { checked, key } = item
      const secondFuncList = this.data.secondFuncList
      console.log('index,', index)
      const checkLocking = key === 'lock'
      let on = DeviceData.powerValue[key]?.on||'on'
      let off = DeviceData.powerValue[key]?.off||'off'
      this.onClickControl(
        {
          [key]: checked ? off : on,
        },
        checkLocking
      ).then((res) => {
        secondFuncList[index].checked = !checked
        this.setData({
          secondFuncList,
        })
      })
    },
    // 实例动画
    doAnimate(duration = 1500, delay, timingFunction = 'linear') {
      return new Promise((resolve, reject) => {
        let animation = wx.createAnimation({
          duration,
          delay,
          timingFunction,
        })
        this.setData(
          {
            animation,
          },
          () => {
            resolve()
          }
        )
      })
    },
    startAnimation(startRunning) {
      // console.log('叶片动画开始后的回调')
      let { animationDeg, animation,isAnimating,isInit,bannerImg } = this.data
      if(isAnimating||!isInit) return
      let totalDelay = 3300
      let rollingSpeed = 1300
      if (startRunning) {
        animationDeg -= 360
        animation.rotate(animationDeg).step({ duration: 2000, timingFunction: 'ease-in' })
        if(animationIntervalTimer){
          clearInterval(animationIntervalTimer)
          animationIntervalTimer = null
        }
        // 持续执行动画
        setTimeout(()=>{
          // console.log('持续执行动画')
          animationIntervalTimer = setInterval(()=>{
            // console.log('循环执行动画')
            // this.startAnimation()
            // 判断档位变化
            let { animationDeg, animation } = this.data
            if(this.getGearLevel()==='high'){
              animationDeg -= 468
            } else {
              animationDeg -= 360
            }
            bannerImg.effectWaveUrl = `https://ce-cdn.midea.com/ccs/icon/ctrl8/FA/mainPic/wave_${this.getGearLevel()}.png`
            animation.rotate(animationDeg).step({ duration: rollingSpeed, timingFunction: 'linear' })
            this.setData({
              isAnimating: true,
              effectLeaf: animation.export(),
              animationDeg,bannerImg
            })
          },rollingSpeed)
        },totalDelay-rollingSpeed)
      }
      if(this.getGearLevel()==='high'){
        animationDeg -= 468
      } else {
        animationDeg -= 360
      }
      bannerImg.effectWaveUrl = `https://ce-cdn.midea.com/ccs/icon/ctrl8/FA/mainPic/wave_${this.getGearLevel()}.png`
      animation.rotate(animationDeg).step({ duration: rollingSpeed, timingFunction: 'linear' })
      // console.log('animationDeg:', animationDeg)
      // 淡入气流波浪
      let waveAnimation = wx.createAnimation()
      waveAnimation.opacity(1).step({ duration: 2000, timingFunction: 'ease-in' })

      this.setData({
        isAnimating: true,
        effectLeaf: animation.export(),
        animationDeg,bannerImg,
        effectWave: waveAnimation.export(),
      })
    },
    stopAnimation(immediately) {
      console.log('叶片结束的回调')
      let { animationDeg, animation,isAnimating } = this.data
      if(isAnimating){
        if(immediately){
          animation.rotate(animationDeg).step({ duration: 0, timingFunction: 'step-start' })
        } else {
          animationDeg -= 90
          animation.rotate(animationDeg).step({ duration: 2000, timingFunction: 'ease-out' })
        }
        if(animationIntervalTimer){
          clearInterval(animationIntervalTimer)
          animationIntervalTimer = null
        }
        // 淡出气流波浪
        let waveAnimation = wx.createAnimation()
        waveAnimation.opacity(0).step({ duration: 2000, timingFunction: 'ease-out' })

        this.setData({
          isAnimating: false,
          effectLeaf: animation.export(),
          animationDeg,
          effectWave: waveAnimation.export(),
        })
      }
    },
    // 状态初始化
    dataInit(newDeviceStatus) {
      let {
        deviceInfo,
        activeColor,
        pageProductConfig,
        sliderGear,
        statusObj,
        hasTiming,
        isNewSwingProtocol,
        isNewestSwingProtocol,
        swingIsOnOffAndOpenIsAngle,
        udSwingIsOnOffAndOpenIsAngle,
        swingIsOnOff,
        udSwingIsOnOff,
        sliderList,
        switchTempWindSwitch,
        switchDisplayOnOff,
        switchAnion,
        switchLock,
        switchVoice,
        switchBreathLight,
        switchWaterions,
        switchSwing,
        switchUdSwing,
        switchHumidify,
        switchAirDried,
        airQualityObj,
        weatherObj,
        paramsArr,
        bannerImg,
        secondFuncList,
      } = this.data
      let { mainPicType, mainPicUrl } = bannerImg
      console.log('数据初始化')
      console.log(newDeviceStatus)
      // let running = newDeviceStatus.power === 'on' && deviceInfo.power === 'on'
      // let startRunning = newDeviceStatus.power === 'on' && deviceInfo.power === 'off'
      // if (running || startRunning) {
      //   // 开机
      //   this.startAnimation(startRunning, running)
      // } else if (newDeviceStatus.power === 'off' && deviceInfo.power === 'on') {
      //   // 关机
      //   this.stopAnimation()
      // }
      deviceInfo = Object.assign(deviceInfo, newDeviceStatus)

      // 设备头图
      bannerImg.isSpecialEffect = this.data.theme!==FA.themeColor.default   // 判断是不是保底运行动效，24FG的判断isNewEffect为false，但却不是保底动效
      bannerImg.windSharpBg = ''
      if (mainPicType !== -1) {
        if (mainPicType == 3) {
          if (deviceInfo.isRunning&&this.data.theme!==FA.themeColor.default) {
            mainPicUrl = `https://ce-cdn.midea.com/ccs/icon/ctrl8/FA/mainPic/main_pic_${deviceInfo.sn8}.png`
            // 24FG风效
            if(this.data.theme === FA.themeColor["24FG"]){
              bannerImg.windSharpBg = 'https://ce-cdn.midea.com/ccs/icon/ctrl8/FA/mainPic/running-bg_24fg.png'
            }
          } else {
            mainPicUrl = `https://ce-cdn.midea.com/ccs/icon/ctrl5/T0xFA/v3/main_pic_${deviceInfo.sn8}.png`
          }
        } else {
          mainPicUrl = `https://ce-cdn.midea.com/ccs/icon/ctrl5/T0xFA/v3/main_pic_${mainPicType}.png`
        }
      } else {
        mainPicUrl = 'https://ce-cdn.midea.com/ccs/icon/blank.png'
      }

      if (newDeviceStatus) {
        // 电源
        if (newDeviceStatus.power === 'on') {
          deviceInfo.isRunning = true
          switchTempWindSwitch.disabled = false
          switchDisplayOnOff.disabled = false
          switchAnion.disabled = false
          switchVoice.disabled = false
          switchWaterions.disabled = false
          switchSwing.disabled = false
          switchUdSwing.disabled = false
          switchBreathLight.disabled = false
          switchHumidify.disabled = false
          switchAirDried.disabled = false
          statusObj.statusPoint = 'on'
          statusObj.statusText = '运行中'
          activeColor = '#267AFF'
        } else {
          deviceInfo.isRunning = false
          switchTempWindSwitch.disabled = true
          switchDisplayOnOff.disabled = true
          switchAnion.disabled = true
          switchVoice.disabled = true
          switchWaterions.disabled = true
          switchSwing.disabled = true
          switchUdSwing.disabled = true
          switchBreathLight.disabled = true
          switchHumidify.disabled = true
          switchAirDried.disabled = true
          statusObj.statusPoint = 'off'
          statusObj.statusText = '已关机'
          activeColor = '#7C879B'
        }
        // 动态头图处理
        if(bannerImg.isNewEffect){
          this.animateDeviceImage(deviceInfo)
        }
        // 童锁
        if (pageProductConfig.lock.hasConfig && pageProductConfig.lock.isShow) {
          switchLock.selected = newDeviceStatus.lock === 'on'
        }
        // 模式
        if (pageProductConfig.mode.hasConfig && newDeviceStatus.mode) {
          for (let i = 0; i < pageProductConfig.mode.valueArray.length; i++) {
            let valueItem = pageProductConfig.mode.valueArray[i]
            if (newDeviceStatus.mode === 'double_area') {
              newDeviceStatus.mode = 'self_selection'
            }
            if (valueItem.value === newDeviceStatus.mode) {
              deviceInfo.modeName = valueItem.label
              pageProductConfig.mode.iconUrl1 = valueItem.iconUrl.url1
              pageProductConfig.mode.iconUrl2 = valueItem.iconUrl.url2
              break
            }
          }
        }
        // 定时开关
        hasTiming = false
        let timingSeconds = 0
        let timeOnMinutes = newDeviceStatus.timer_on_hour * 60 + newDeviceStatus.timer_on_minute
        let timeOffMinutes = newDeviceStatus.timer_off_hour * 60 + newDeviceStatus.timer_off_minute
        if (timeOnMinutes > 0) {
          statusObj.appointText = '预约开机'
          timingSeconds = Number(timeOnMinutes) * 60
          hasTiming = true
        }
        if (timeOffMinutes > 0) {
          statusObj.appointText = '预约关机'
          timingSeconds = Number(timeOffMinutes) * 60
          hasTiming = true
        }

        if (hasTiming) {
          let formatSecond = Format.calculateTime(timingSeconds)
          statusObj.appointDescribe = formatSecond
        }
        // 档位(风速)

        if (pageProductConfig.gear.hasConfig && pageProductConfig.gear.isShow) {
          let activatedValueArray = (pageProductConfig.gear.activatedValueArray =
            pageProductConfig.gear.valueArray[newDeviceStatus.mode])
          if (activatedValueArray) {
            activatedValueArray.forEach((valueItem) => {
              if (valueItem.value === newDeviceStatus.gear) {
                deviceInfo.gearLabel = valueItem.label
              }
            })
            sliderGear.min = activatedValueArray[0].value
            sliderGear.max = activatedValueArray[activatedValueArray.length - 1].value
            sliderList = [sliderGear.min, sliderGear.max]
            sliderGear.currentValue = Number(newDeviceStatus.gear)
          }
        }
        // 熄屏
        if (pageProductConfig.displayOnOff.hasConfig && pageProductConfig.displayOnOff.isShow) {
          switchDisplayOnOff.selected = newDeviceStatus.display_on_off === 'off'
          let currentDisplay = pageProductConfig.displayOnOff.valueArray.find(item=>item.value===newDeviceStatus.display_on_off)
          if(currentDisplay){
            deviceInfo.displayLabel = currentDisplay.label
          }
        }
        // 负离子
        if (pageProductConfig.anion.hasConfig && pageProductConfig.anion.isShow) {
          switchAnion.selected = newDeviceStatus.anion === 'on'
        }
        // 声音
        if (pageProductConfig.voice.hasConfig && pageProductConfig.voice.isShow) {
          deviceInfo.isOpenVoice = switchVoice.selected = newDeviceStatus.voice?.indexOf('open') > -1
        }
        // 左右摇头
        if (pageProductConfig.swing.hasConfig && pageProductConfig.swing.isShow) {
          if(isNewSwingProtocol){
            switchSwing.selected = newDeviceStatus.swing_angle == '1275'
          } else {
            switchSwing.selected = newDeviceStatus.swing == 'on' && (pageProductConfig.udSwing.valueArray.length ? newDeviceStatus.swing_direction.includes('lr') : true)
          }
          if(isNewestSwingProtocol){
            switchSwing.selected = newDeviceStatus.lr_shake_switch != 'off'
          }
        }
        // 摇头
        if (isNewestSwingProtocol && !newDeviceStatus.swing) {
          deviceInfo.swingValue = newDeviceStatus.lr_shake_switch === 'off' ? 'off' : '120'
          if(!newDeviceStatus.ud_angle){
            // 适应24TMX类型设备
            if(newDeviceStatus.ud_shake_switch === 'off'){
              let configSwingValue = pageProductConfig.udSwing.valueArray.find(item=>(item.value=='0'||item.value=='off'))
              if(configSwingValue){
                deviceInfo.udSwingValue = configSwingValue.value
              }
            } else {
              let configSwingValue = pageProductConfig.udSwing.valueArray.find(item=>(item.value!='0'&&item.value!='off'))
              deviceInfo.udSwingValue = configSwingValue.value
            }
          } else {
            // 适应24USQ类型设备
            deviceInfo.udSwingValue = newDeviceStatus.ud_shake_switch === 'off' ? '0' : newDeviceStatus.ud_angle.toString()
          }
        } else if (newDeviceStatus.swing === 'on') {
          if (swingIsOnOff) {
            // 左右摇头只有开启和关闭
            if (isNewSwingProtocol) {
              // 如果是新协议
              deviceInfo.swingValue = newDeviceStatus.swing_angle.toString()
            } else {
              // 如果是旧协议
              // swing_direction不包含lr（ud_swing_angle为unknown的话，value为on,否则为off）
              // swing_direction包含lr 但是左右摇头角度为0,value为off
              // swing_direction包含lr 并且左右摇头角度不为0（有摇头角度，value为摇头角度或者on）
              deviceInfo.swingValue = newDeviceStatus.swing_direction.includes('lr')
                ? newDeviceStatus.swing_angle === 0
                  ? 'off'
                  : swingIsOnOffAndOpenIsAngle
                  ? newDeviceStatus.swing_angle
                  : 'on'
                : newDeviceStatus.ud_swing_angle === 'unknown'
                ? 'on'
                : 'off'
            }
          } else if (newDeviceStatus.swing_angle || newDeviceStatus.swing_angle === 0) {
            // 左右摇头有角度
            deviceInfo.swingValue =
              newDeviceStatus.swing_angle === 'unknown' ? 'off' : newDeviceStatus.swing_angle.toString()
          }

          if (udSwingIsOnOff) {
            // 上下摇头只有开启和关闭
            if (isNewSwingProtocol) {
              // 如果是新协议
              deviceInfo.udSwingValue = newDeviceStatus.ud_swing_angle.toString()
            } else {
              // 如果是旧协议
              deviceInfo.udSwingValue =
                newDeviceStatus.swing_direction.includes('ud') && newDeviceStatus.ud_swing_angle != 'unknown'
                  ? newDeviceStatus.ud_swing_angle === 0
                    ? 'off'
                    : udSwingIsOnOffAndOpenIsAngle
                    ? newDeviceStatus.ud_swing_angle
                    : 'on'
                  : 'off'
            }
          } else if (newDeviceStatus.ud_swing_angle || newDeviceStatus.ud_swing_angle === 0) {
            // 上下摇头有角度
            deviceInfo.udSwingValue =
              newDeviceStatus.ud_swing_angle === 'unknown' ? 'off' : newDeviceStatus.ud_swing_angle.toString()
          }
        } else {
          // swing为off的情况
          if (isNewSwingProtocol) {
            // 如果是新协议，value等于角度
            deviceInfo.swingValue =
              newDeviceStatus.swing_angle || newDeviceStatus.swing_angle === 0
                ? newDeviceStatus.swing_angle.toString()
                : ''
            deviceInfo.udSwingValue =
              newDeviceStatus.ud_swing_angle || newDeviceStatus.ud_swing_angle === 0
                ? newDeviceStatus.ud_swing_angle.toString()
                : ''
          } else {
            // 如果是旧协议，value等于off
            deviceInfo.swingValue = 'off'
            deviceInfo.udSwingValue = 'off'
          }
        }
        if (pageProductConfig.swing.valueArray.length > 0) {
          pageProductConfig.swing.valueArray.forEach((item) => {
            if (deviceInfo.swingValue === item.value) {
              deviceInfo.swingLabel = item.label
            }
          })
        }
        if (pageProductConfig.udSwing.valueArray.length > 0) {
          pageProductConfig.udSwing.valueArray.forEach((item) => {
            if (deviceInfo.udSwingValue === item.value) {
              deviceInfo.udSwingLabel = item.label
            }
          })
        }
        switchUdSwing.selected = !(deviceInfo.udSwingValue=='0'||deviceInfo.udSwingValue=='off')
        console.log('deviceInfo.swingValue', deviceInfo.swingValue)
        console.log('deviceInfo.udSwingValue', deviceInfo.udSwingValue)
        // 风随温变
        if (pageProductConfig.tempWindSwitch.hasConfig && pageProductConfig.tempWindSwitch.isShow) {
          if (newDeviceStatus.temp_wind_switch) {
            switchTempWindSwitch.selected = newDeviceStatus.temp_wind_switch === 'on'
          } else {
            switchTempWindSwitch.selected = false
          }
        }
        // 加湿
        if (pageProductConfig.humidify.hasConfig && pageProductConfig.humidify.isShow) {
          switchHumidify.selected = newDeviceStatus.humidify !== 'off'
        }
        // 风干
        if (pageProductConfig.airDried.hasConfig && pageProductConfig.airDried.isShow) {
          switchAirDried.selected = newDeviceStatus.air_dry_switch !== 'off'
        }
        // 净离子
        if (pageProductConfig.waterions.hasConfig && pageProductConfig.waterions.isShow) {
          switchWaterions.selected = newDeviceStatus.waterions === 'on'
        }
        // 氛围灯
        if (pageProductConfig.breathLight.hasConfig && pageProductConfig.breathLight.isShow) {
          switchBreathLight.selected = newDeviceStatus.breath_light === 'on'
        }
        // mx-information参数
        const gradeLevel = ['优', '良', '中', '差']
        // 太空舱不显示具体值
        const showDetail = ['56011C86', '56011C87'].indexOf(deviceInfo.sn8) === -1
        paramsArr = [
          {
            value: gradeLevel[newDeviceStatus.pm25 || 0],
            title: 'PM2.5'+(showDetail?'('+newDeviceStatus.pm25_value+'μg/m³)':''),
            unit: '',
            isShow: newDeviceStatus.pm25_value != undefined && newDeviceStatus.pm25_value !== 0,
          },
          {
            title: '室内温度',
            value: newDeviceStatus.temperature_feedback,
            unit: '℃',
            isShow: newDeviceStatus.temperature_feedback != undefined && !newDeviceStatus.sensorTemperature,
          },
          {
            title: '当地空气 | 温度',
            value: airQualityObj.aqiText + ' | ' + weatherObj.temperature,
            unit: '℃',
            isShow: airQualityObj.aqiText != '--',
          },
        ]
        // 设备运行中，满足主图显示动效条件，把第一个挪上去显示
        if(deviceInfo.isRunning){
          let showParamsArr = paramsArr.filter(n=>n.isShow)
          console.log('设备运行中，满足主图显示动效条件，把第一个挪上去显示',showParamsArr)
          let isDefaultEffect = !bannerImg.isNewEffect&&!bannerImg.isSpecialEffect
          let isFirstParams = showParamsArr[0].isShow&&!showParamsArr[0].title.includes('当地空气')
          if(isDefaultEffect&&isFirstParams){
            showParamsArr[0].isShow = false
          }
          paramsArr = showParamsArr
        }
        // 二级功能状态更新
        secondFuncList.forEach((item) => {
          item.checked = deviceInfo[item.key] === DeviceData.powerValue[item.key].on
        })
      } else {
        deviceInfo.isOnline = false
        deviceInfo.isRunning = false
        statusObj.statusPoint = 'off'
        statusObj.statusText = '已离线'
        // 清除动画
        this.stopAnimation(true)
      }
      console.log('deviceInfo', deviceInfo)
      this.setData({
        deviceInfo,
        hasTiming,
        pageProductConfig,
        activeColor,
        statusObj,
        sliderGear,
        sliderList,
        switchLock,
        switchTempWindSwitch,
        switchDisplayOnOff,
        switchVoice,
        switchBreathLight,
        switchWaterions,
        switchHumidify,
        switchAirDried,
        switchAnion,
        switchSwing,
        switchUdSwing,
        paramsArr,
        secondFuncList,
        bannerImg: { ...bannerImg, mainPicType, mainPicUrl },
      })
      // console.log('bannerImg:', this.data.bannerImg)
    },

    // region 轮询获取设备状态
    deviceStatusInterval(interval) {
      if (deviceStatusTimer) {
        clearInterval(deviceStatusTimer)
      }
      if (!interval) {
        interval = 6000
      }
      if (isDeviceInterval) {
        deviceStatusTimer = setInterval(() => {
          this.updateStatus()
        }, interval)
      }
    },
    clearDeviceStatusInterval() {
      if (deviceStatusTimer) {
        clearInterval(deviceStatusTimer)
      }
    },
    // endregion

    // 启动功能
    onClickControl(controlParams, checkLocking) {
      let deviceInfo = this.data.deviceInfo
      return new Promise((resolve, reject) => {
        if (!checkLocking && deviceInfo.lock === DeviceData.powerValue.lock.on) {
          Toast({ context: this, position: 'bottom', message: '请关闭童锁后再进行设置！' })
          reject()
        } else {
          UI.showLoading()
          this.clearDeviceStatusInterval()
          this.requestControl({
            control: controlParams,
          })
            .then((res) => {
              console.log('启动功能', res)
              UI.hideLoading()
              this.dataInit(res.data.data.status)
              this.deviceStatusInterval()
              resolve(res)
            })
            .catch((err) => {
              console.log(err, 11111111)
              let res = err
              UI.hideLoading()
              // this.dataInit(res.data.data.status)
              this.deviceStatusInterval()
              if (res.data.code != 0) {
                let msg = FA.handleErrorMsg(res.data.code)
                MideaToast(msg)
                return reject()
              }
            })
        }
      })
    },
    onChangeGear(event) {
      this.onClickControl({
        gear: event.detail.active,
      })
    },
    onClickAppointment() {
      let { hasTiming } = this.data
      if (hasTiming) {
        this.showCloseTimingModal()
      } else {
        this.showTimingModal()
      }
    },
    // 改变屏幕显示
    onChangeDisplayOnOff(event){
      console.log('改变屏幕显示',event)
      let controlParams = {
        display_on_off: event.detail.active
      }
      this.onClickControl(controlParams)
    },
    onChangeSwing(event) {
      let value = event.detail.active
      let { deviceInfo, isNewSwingProtocol, isNewestSwingProtocol } = this.data
      let controlParams = null
      let swing_angle = ''
      if (isNewestSwingProtocol) {
        if (value !== 'off') {
          controlParams = {
            lr_shake_switch: 'normal',
            lr_angle: value,
          }
        } else {
          controlParams = {
            lr_shake_switch: value,
          }
        }
      } else if (isNewSwingProtocol) {
        if (value !== 'off' && value !== 'on') {
          swing_angle = value
        } else if (value === 'off') {
          swing_angle = '0'
        } else {
          swing_angle = '1275'
        }
        controlParams = {
          swing_angle: swing_angle,
          swing_direction: 'lr',
        }
      } else {
        controlParams = {
          swing: value !== 'off' ? 'on' : 'off',
        }
        if (value !== 'off') {
          controlParams['swing_angle'] = Number(value) ? value : '90'
          controlParams['swing_direction'] = 'lr'
          if (deviceInfo.swing_direction.includes('ud')) {
            controlParams['swing_direction'] = 'udlr'
          }
        } else {
          if (deviceInfo.swing_direction.includes('ud')) {
            controlParams['swing'] = 'on'
            controlParams['swing_direction'] = 'ud'
          }
        }
      }
      this.onClickControl(controlParams)
    },
    onClickPower() {
      let { deviceInfo } = this.data
      let controlParam = {
        power: deviceInfo.isRunning ? 'off' : 'on',
      }

      // 取消定时
      let timeOnMinutes = deviceInfo.timer_on_hour * 60 + deviceInfo.timer_on_minute
      let timeOffMinutes = deviceInfo.timer_off_hour * 60 + deviceInfo.timer_off_minute
      if (timeOnMinutes > 0) {
        controlParam.time_on_minute = 'clean'
      }
      if (timeOffMinutes > 0) {
        controlParam.time_off_minute = 'clean'
      }
      this.onClickControl(controlParam)
    },
    onChangeMode(event) {
      let { value } = event.currentTarget.dataset
      UI.showLoading()
      this.onClickControl({
        mode: value,
      }).then((res) => {
        this.closeSelectModeModal()
        UI.hideLoading()
      })
    },
    onChangeUdSwing(event,callback) {
      console.log('上下遥控改变: ',event)
      let value = event.detail.active
      let { deviceInfo, isNewSwingProtocol, isNewestSwingProtocol } = this.data
      let controlUdParams = isNewSwingProtocol ? {
        ud_swing_angle: value,
        swing_direction: 'ud'
      } : swingUdFilter_FA({
        data: value||'0',
        deviceSn8: deviceInfo.sn8,
        status: deviceInfo
      })
      if(isNewestSwingProtocol){
        if (value !== 'off') {
          controlUdParams = {
            ud_shake_switch: 'normal',
            ud_angle: value,
          }
        } else {
          controlUdParams = {
            ud_shake_switch: value,
          }
        }
      }
      console.log('上下控制: ',controlUdParams)
      this.onClickControl(controlUdParams).then(()=>{
        callback&&callback()
      }).catch(err=>{
        callback&&callback()
      })
    },
    changeSliderGear(event) {
      let model = event.detail
      let deviceInfo = this.data.deviceInfo
      let pageProductConfig = this.data.pageProductConfig
      let controlParam = {
        gear: model,
      }
      this.onClickControl(controlParam).then((res) => {
        this.setData({
          deviceInfo,
          pageProductConfig,
          sliderGear: { ...this.data.sliderGear, currentValue: model },
        })
        console.log('滑块参数: ', JSON.stringify(this.data.sliderGear))
      })
    },

    // region 显示顶部通知栏
    showNoticeBar(options) {
      do {
        if (!options) {
          console.warn('缺少options')
          break
        }
        let content = '内容'
        if (typeof options === 'string') {
          content = options
        } else {
          content = options.content
        }
        let noticeBar = this.data.noticeBar
        noticeBar.isShow = true
        noticeBar.content = content
        this.setData({ noticeBar })
      } while (false)
    },
    closeNoticeBar() {
      let noticeBar = this.data.noticeBar
      noticeBar.isShow = false
      this.setData({ noticeBar })
    },
    // endregion

    // region 显示和隐藏模式对话框
    showSelectModeModal() {
      let deviceInfo = this.data.deviceInfo
      if (!deviceInfo.isRunning) {
        return
      }
      let pageProductConfig = this.data.pageProductConfig
      pageProductConfig.mode.isShowSelectMode = true
      this.setData({ pageProductConfig })
    },
    closeSelectModeModal() {
      let pageProductConfig = this.data.pageProductConfig
      pageProductConfig.mode.isShowSelectMode = false
      this.setData({ pageProductConfig })
    },
    // endregion

    // 取消定时
    cancelTiming(options) {
      let deviceInfo = this.data.deviceInfo
      let controlParam = {}
      let timeOnMinutes = deviceInfo.timer_on_hour * 60 + deviceInfo.timer_on_minute
      let timeOffMinutes = deviceInfo.timer_off_hour * 60 + deviceInfo.timer_off_minute
      if (timeOnMinutes > 0) {
        controlParam.timer_on_minute = 'clean'
      } else if (timeOffMinutes > 0) {
        controlParam.timer_off_minute = 'clean'
      }
      this.onClickControl(controlParam).then((res) => {
        this.closeTimingModal()
      })
    },
    // 设置定时时间
    confirmOrderTime() {
      let pageProductConfig = this.data.pageProductConfig
      let deviceInfo = this.data.deviceInfo
      UI.showLoading()
      let selectedValue = pageProductConfig.timing.selectedValue
      let minutes = selectedValue % 1
      if (minutes > 0) {
        minutes = minutes * 60
      }
      let controlParam = {}
      if (deviceInfo.isRunning) {
        controlParam.timer_off_hour = selectedValue
        controlParam.timer_off_minute = minutes
      } else {
        controlParam.timer_on_hour = selectedValue
        controlParam.timer_on_minute = minutes
      }
      this.onClickControl(controlParam).then((res) => {
        UI.toast('操作成功')
        UI.hideLoading()
        this.closeTimingModal()
      })
    },
    // 定时选项改变
    timingPickerOnChange(event) {
      let data = this.data
      let pageProductConfig = data.pageProductConfig
      let val = event.detail.value
      console.log('定时选项改变',event.detail)
      pageProductConfig.timing.selectedIndex = event.detail.index
      pageProductConfig.timing.selectedValue = val
      this.setData({ pageProductConfig })
    },
    // region 显示和隐藏定时对话框
    showTimingModal() {
      let pageProductConfig = this.data.pageProductConfig
      pageProductConfig.timing.isShowTimedShutdown = true
      // 初始化
      this.timingPickerOnChange({ detail: {
        value: pageProductConfig.timing.selectedValue||pageProductConfig.timing.valueArray[0],
        index: pageProductConfig.timing.selectedIndex||0
      } })
      this.setData({ pageProductConfig })
    },
    showCloseTimingModal() {
      Dialog.confirm({
        zIndex: 10001,
        context: this,
        title: '温馨提示',
        message: '确定取消定时吗？',
      })
        .then((res) => {
          if (res.action == 'confirm') {
            this.cancelTiming()
          }
          // on confirm
        })
        .catch((error) => {
          if (error.action == 'cancel') {
            this.closeTimingModal()
          }
          // on cancel
        })
    },
    closeTimingModal() {
      let pageProductConfig = this.data.pageProductConfig
      pageProductConfig.timing.isShowTimedShutdown = false
      this.setData({ pageProductConfig })
    },
    // endregion
    switchDisplayOnOffChange({ detail }) {
      let switchDisplayOnOff = this.data.switchDisplayOnOff
      this.onClickControl({
        display_on_off: detail ? 'off' : 'on',
      }).then((res) => {
        switchDisplayOnOff.selected = detail
        this.setData({
          switchDisplayOnOff,
        })
      })
    },
    switchAnionChange({ detail }) {
      let switchAnion = this.data.switchAnion
      this.onClickControl({
        anion: detail ? 'on' : 'off',
      }).then((res) => {
        switchAnion.selected = detail
        this.setData({
          switchAnion,
        })
      })
    },
    switchSwingChange({ detail }) {
      console.log('左右摇头开关',detail)
      let switchSwing = this.data.switchSwing
      let controlParams = shakeParamsTransfer_FA({
        data: detail,
        isNewSwingProtocol: this.data.isNewSwingProtocol,
        status: this.data.deviceInfo,
        swingList: this.data.pageProductConfig.swing?.valueArray||[]
      })
      if (this.data.isNewestSwingProtocol) {
        if (detail) {
          controlParams = {
            lr_shake_switch: 'normal',
            lr_angle: this.data.pageProductConfig.swing?.valueArray[0].value||120,
          }
        } else {
          controlParams = {
            lr_shake_switch: 'off',
          }
        }
      }
      this.onClickControl(controlParams).then((res) => {
        switchSwing.selected = detail
        this.setData({
          switchSwing,
        })
      })
    },
    // 上下摇头开关改变
    switchUdSwingChange({detail}) {
      console.log('上下摇头开关改变',detail)
      let selected = detail
      let value = selected?'120':'0'
      let pageProductConfig = this.data.pageProductConfig
      if(selected){
        let configSwingValue = pageProductConfig.udSwing.valueArray.find(item=>(item.value!='0'&&item.value!='off'))
        if(configSwingValue){
          value = configSwingValue.value
        }
      } else {
        let configSwingValue = pageProductConfig.udSwing.valueArray.find(item=>(item.value=='0'||item.value=='off'))
        if(configSwingValue){
          value = configSwingValue.value
        }
      }
      console.log('上下摇头开关改变',value)
      this.onChangeUdSwing({
        detail: {
          active: value
        }
      },()=>{
        let switchUdSwing = this.data.switchUdSwing
        switchUdSwing.selected = detail
        this.setData({
          switchUdSwing,
        })
      })
      // let value = this.pageProductConfig.udSwing.valueArray.find(item=>)
    },
    switchLockChange({ detail }) {
      let switchLock = this.data.switchLock
      this.onClickControl({
        lock: detail ? 'on' : 'off',
      }).then((res) => {
        switchLock.selected = detail
        this.setData({
          switchLock,
        })
      })
    },
    switchVoiceChange({ detail }) {
      let switchVoice = this.data.switchVoice
      console.log('改变声音: ',detail)
      this.onClickControl({
        voice: detail ? 'open_buzzer' : 'close_buzzer',
      }).then((res) => {
        switchVoice.selected = detail
        this.setData({
          switchVoice,
        })
      })
    },

    switchTempWindChange({ detail }) {
      let switchTempWindSwitch = this.data.switchTempWindSwitch
      this.onClickControl({
        temp_wind_switch: detail ? 'on' : 'off',
      }).then((res) => {
        switchTempWindSwitch.selected = detail
        this.setData({
          switchTempWindSwitch,
        })
      })
    },
    switchHumidifyChange({ detail }) {
      let switchHumidify = this.data.switchHumidify
      this.onClickControl({
        humidify: detail ? '1' : 'off',
      }).then((res) => {
        switchHumidify.selected = detail
        this.setData({
          switchHumidify,
        })
      })
    },
    switchAirDriedChange({ detail }) {
      let switchAirDried = this.data.switchAirDried
      this.onClickControl({
        air_dry_switch: detail ? 'on' : 'off',
      }).then((res) => {
        switchAirDried.selected = detail
        this.setData({
          switchAirDried,
        })
      })
    },
    switchWaterionsChange({ detail }) {
      let switchWaterions = this.data.switchWaterions
      this.onClickControl({
        waterions: detail ? 'on' : 'off',
      }).then((res) => {
        switchWaterions.selected = detail
        this.setData({
          switchWaterions,
        })
      })
    },
    switchBreathLightChange({ detail }) {
      let switchBreathLight = this.data.switchBreathLight
      this.onClickControl({
        breath_light: detail ? 'on' : 'off',
      }).then((res) => {
        switchBreathLight.selected = detail
        this.setData({
          switchBreathLight,
        })
      })
    },
    checkBannerImg(newEffectType, { sn8 }) {
      console.log('newEffectType:', newEffectType,sn8)
      const mainPicMap = FA.mainPicMap
      let bannerImg = this.data.bannerImg
      let { effect1Url, effect2Url, effect3Url, mainPicType, isNewEffect } = bannerImg
      isNewEffect = newEffectType
      if (isNewEffect) {
        effect1Url = sn8 ? `https://ce-cdn.midea.com/ccs/icon/ctrl8/FA/mainPic/effect_1_${sn8}.png` : 'https://ce-cdn.midea.com/ccs/icon/blank.png'
        effect3Url = sn8 ? `https://ce-cdn.midea.com/ccs/icon/ctrl8/FA/mainPic/effect_3_${sn8}.png` : 'https://ce-cdn.midea.com/ccs/icon/blank.png'
        effect2Url = sn8 ? `https://ce-cdn.midea.com/ccs/icon/ctrl8/FA/mainPic/effect_2_${sn8}.png` : 'https://ce-cdn.midea.com/ccs/icon/blank.png'
      } else {
        if (Object.keys(mainPicMap).includes(sn8)) {
          mainPicType = mainPicMap[sn8]
        } else {
          mainPicType = 1
        }
      }
      console.log('checkBannerImg:', mainPicType)
      this.setData({ bannerImg: { ...bannerImg,effect1Url, effect2Url, effect3Url, mainPicType, isNewEffect } })
      console.log('checkBannerImg bannerImg:', bannerImg)
    },
    // 获取产品配置
    getProductConfig(bigVer) {
      return new Promise((resolve, reject) => {
        let {
          deviceInfo,
          swingSliderList,
          bgImage,
          uid,
          secondFuncCount,
          secondFuncList,
          swingIsOnOffAndOpenIsAngle,
          udSwingIsOnOffAndOpenIsAngle,
          udSwingIsOnOff,
          swingIsOnOff,
          switchWrapperIsFlex,
          switchSwingWrapperIsFlex,
        } = this.data
        if (deviceInfo.onlineStatus == DeviceData.onlineStatus.online) {
          deviceInfo.isOnline = true
        } else {
          deviceInfo.isOnline = false
          MideaToast('设备已离线，请检查网络状态')
        }
        // 设备调试
        let productModelNumber =
          deviceInfo.modelNumber != 0
            ? deviceInfo.modelNumber >= 10
              ? '000000' + deviceInfo.modelNumber
              : '0000000' + deviceInfo.modelNumber
            : deviceInfo.sn8
        let method = 'GET'
        let sendParams = {
          applianceId: deviceInfo.applianceCode,
          productTypeCode: deviceInfo.type,
          userId: uid,
          productModelNumber,
          bigVer: bigVer||DeviceData.bigVer,
          platform: 2, // 获取美居/小程序功能，2-小程序
          env: environment,
        }
        let isDebug = false
        if (!isDebug) {
          sendParams = {
            serviceName: 'node-service',
            uri: '/productConfig' + Format.jsonToParam(sendParams),
            method: 'GET',
            contentType: 'application/json',
          }
          method = 'POST'
        }
        requestService
          .request(commonApi.sdaTransmit, sendParams, method)
          .then((res) => {
            console.log('获取产品配置')
            console.log(deviceInfo)
            console.log(res)
            bgImage.deviceImg += `main-pic_${deviceInfo.sn8}.png`
            // 设置页面功能
            let resData = JSON.parse(res.data.result.returnData)
            console.log(resData)
            do {
              if(!resData) {
                this.getProductConfig()
                break;
              }
              let quickDevJson = FA.quickDevJson2Local(resData)
              let pageProductConfig = this.data.pageProductConfig
              deviceInfo.model = quickDevJson.model
              console.log('解析后参数')
              console.log(quickDevJson)
              // 主题色判断
              let theme = quickDevJson.properties.themeColor||this.data.theme
              // 判断设备头图
              this.checkBannerImg(Number(quickDevJson.properties.isNewEffect), deviceInfo)
              // 判断产品配置
              let functions = resData.functions
              // 设置配置项
              if (functions && functions.length > 0) {
                functions.forEach((functionItem) => {
                  let settings = functionItem.settings
                  switch (functionItem.code) {
                    // 电源
                    case FA.apiCode.power:
                      pageProductConfig.power.hasConfig = true
                      pageProductConfig.power.isShow = true
                      break
                    // 模式
                    case FA.apiCode.mode:
                      pageProductConfig.mode.hasConfig = true
                      pageProductConfig.mode.isShow = true
                      // 获取配置参数
                      pageProductConfig.mode.valueArray = FA.getValueArray(settings, { hasIcon: true })
                      break
                    // 定时
                    case FA.apiCode.timing:
                      pageProductConfig.timing.hasConfig = true
                      pageProductConfig.timing.isShow = true
                      pageProductConfig.timing.valueArray = FA.getValueArray(settings, { isTiming: true })
                      break
                    // 档位(风速)
                    case FA.apiCode.gear:
                      pageProductConfig.gear.hasConfig = true
                      pageProductConfig.gear.isShow = true
                      pageProductConfig.gear.valueArray = {}
                      if (settings && settings.length > 0) {
                        settings.forEach((settingItem) => {
                          let properties = settingItem.properties
                          if (properties.list && properties.list.length > 0) {
                            let valueArray = []
                            properties.list.forEach((item) => {
                              valueArray.push({
                                value: Number(item.value),
                                label: item.label,
                              })
                            })
                            pageProductConfig.gear.valueArray[properties.bindValue] = valueArray
                          }
                        })
                      }
                      break
                    // 熄屏
                    case FA.apiCode.displayOnOff:
                      pageProductConfig.displayOnOff.hasConfig = true
                      pageProductConfig.displayOnOff.isShow = true
                      pageProductConfig.displayOnOff.valueArray = FA.getValueArray(settings)
                      break
                    // 负离子
                    case FA.apiCode.anion:
                      pageProductConfig.anion.hasConfig = true
                      pageProductConfig.anion.isShow = true
                      pageProductConfig.anion.valueArray = FA.getValueArray(settings)
                      break
                    // 童锁
                    case FA.apiCode.lock:
                      pageProductConfig.lock.hasConfig = true
                      pageProductConfig.lock.isShow = true
                      pageProductConfig.lock.valueArray = FA.getValueArray(settings)
                      break
                    // 声音
                    case FA.apiCode.voice:
                      pageProductConfig.voice.hasConfig = true
                      pageProductConfig.voice.isShow = true
                      pageProductConfig.voice.valueArray = FA.getValueArray(settings)
                      break
                    // 左右摇头
                    case FA.apiCode.swing:
                      pageProductConfig.swing.hasConfig = true
                      pageProductConfig.swing.isShow = true
                      pageProductConfig.swing.valueArray = FA.getValueArray(settings)
                      swingIsOnOff = pageProductConfig.swing.valueArray.length === 2
                      if (pageProductConfig.swing.valueArray.length > 0) {
                        // 处理slider模式的数据
                        pageProductConfig.swing.valueArray.forEach((item) => {
                          if (pageProductConfig.swing.valueArray.length > 4) {
                            swingSliderList.push(item.label)
                          }
                          if (Number(item.value)) {
                            // 左右开启为角度
                            swingIsOnOffAndOpenIsAngle = true
                          }
                        })
                      }
                      break
                    // 上下摇头
                    case FA.apiCode.udSwing:
                      pageProductConfig.udSwing.hasConfig = true
                      pageProductConfig.udSwing.isShow = true
                      pageProductConfig.udSwing.valueArray = FA.getValueArray(settings)
                      console.log('上下摇头配置: ',pageProductConfig.udSwing.valueArray)
                      udSwingIsOnOff = pageProductConfig.udSwing.valueArray.length === 2

                      if (pageProductConfig.udSwing.valueArray.length > 0) {
                        pageProductConfig.udSwing.valueArray.forEach((item) => {
                          if (Number(item.value)) {
                            // 上下开启为角度的情况
                            udSwingIsOnOffAndOpenIsAngle = true
                          }
                        })
                      }
                      break
                    // 风随温变
                    case FA.apiCode.tempWindSwitch:
                      pageProductConfig.tempWindSwitch.hasConfig = true
                      pageProductConfig.tempWindSwitch.isShow = true
                      // pageProductConfig.tempWindSwitch.valueArray = FA.getValueArray(settings)
                      break
                    // 加湿
                    case FA.apiCode.humidify:
                      pageProductConfig.humidify.hasConfig = true
                      pageProductConfig.humidify.isShow = true
                      pageProductConfig.humidify.valueArray = FA.getValueArray(settings)
                      break
                    // 风干
                    case FA.apiCode.airDried:
                      pageProductConfig.airDried.hasConfig = true
                      pageProductConfig.airDried.isShow = true
                      // pageProductConfig.airDried.valueArray = FA.getValueArray(settings)
                      break
                    // 净离子
                    case FA.apiCode.waterions:
                      pageProductConfig.waterions.hasConfig = true
                      pageProductConfig.waterions.name = getWaterionsName_DEVICE_DATA(deviceInfo.sn8)
                      pageProductConfig.waterions.isShow = true
                      pageProductConfig.waterions.valueArray = FA.getValueArray(settings)
                      break
                    // 氛围灯
                    case FA.apiCode.breathLight:
                      pageProductConfig.breathLight.hasConfig = true
                      pageProductConfig.breathLight.isShow = true
                      // pageProductConfig.breathLight.valueArray = FA.getValueArray(settings)
                      break
                  }
                })
              }
              console.log('配置完成的参数')
              console.log(pageProductConfig)
              // 处理二项开关功能
              let switchCount = 0 // 计算开关组件数量
              for (const key in pageProductConfig) {
                if (Object.hasOwnProperty.call(pageProductConfig, key)) {
                  if(pageProductConfig[key].valueArray&&pageProductConfig[key].valueArray.length===2){
                    switchCount++
                    console.log('计算开关组件数量',key,pageProductConfig[key])
                  }
                  if (Object.keys(DeviceData.secondFunctionsControlMap).includes(key) && pageProductConfig[key].isShow) {
                    if(pageProductConfig[key].valueArray&&pageProductConfig[key].valueArray.length>2){
                      break
                    }
                    let { name, icon, activeIcon, controlValue } = DeviceData.secondFunctionsControlMap[key]
                    // 净离子特殊处理
                    if(controlValue===DeviceData.secondFunctionsControlMap.waterions.controlValue){
                      let isSpecial = getWaterionsIsSpecial_DEVICE_DATA(deviceInfo.sn8)
                      if(isSpecial){
                        name = DeviceData.secondFunctionsControlMap[key].special.name
                        icon = DeviceData.secondFunctionsControlMap[key].special.icon
                        activeIcon = DeviceData.secondFunctionsControlMap[key].special.activeIcon
                      }
                    }
                    secondFuncList.push({
                      key: controlValue,
                      checked: false,
                      activeIcon,
                      icon,
                      name,
                    })
                    secondFuncCount += 1
                  }
                }
              }
              // 判断摇头开关区域数量进行布局
              switchSwingWrapperIsFlex = pageProductConfig.swing.isShow&&pageProductConfig.swing.valueArray.length===2&&pageProductConfig.udSwing.isShow&&pageProductConfig.udSwing.valueArray.length===2
              // 判断整体开关区域数量进行布局
              let hasSwing = (pageProductConfig.swing.isShow&&pageProductConfig.swing.valueArray.length!==2)||(pageProductConfig.udSwing.isShow&&pageProductConfig.udSwing.valueArray.length!==2)
              switchWrapperIsFlex = !hasSwing&&!switchSwingWrapperIsFlex&&switchCount===2
              console.log('判断整体开关区域数量进行布局',switchCount)
              console.log('secondFuncList')
              console.log(secondFuncList)
              console.log(secondFuncCount)
              this.setData({
                theme,  // 主题色设置
                deviceInfo,
                pageProductConfig,
                swingSliderList,
                bgImage,
                secondFuncCount,
                secondFuncList,
                swingIsOnOffAndOpenIsAngle,
                udSwingIsOnOffAndOpenIsAngle,
                udSwingIsOnOff,
                swingIsOnOff,
                switchWrapperIsFlex,
                switchSwingWrapperIsFlex
                // bannerImg,
              })
            } while (false)
            resolve(resData)
          })
          .catch((err) => {
            console.error(err)
            let res = err.data
            do {
              if (res) {
                if (res.result && res.result.returnData) {
                  res = JSON.parse(res.result.returnData)
                }
                // 未配置资源
                if (res.resCode == 50300 || res.code == 1001) {
                  FA.redirectUnSupportDevice(this.properties.applianceData)
                  break
                }
                UI.alertResMsg({
                  title: '获取产品配置',
                  res: res,
                })
                break
              }
              UI.toast('未知错误')
            } while (false)
            reject()
          })
      })
    },

    requestControl(command) {
      // 埋点
      let params = {
        control_params: JSON.stringify(command),
      }
      this.rangersBurialPointClick('plugin_button_click', params)
      if (this.data.deviceInfo.error_code && this.data.deviceInfo.error_code !== 0) {
        wx.showToast({
          title: errorName[this.data.deviceInfo.error_code] + '，设备功能暂不支持操作',
          icon: 'none',
        })
        return
      }
      return requestService.request('luaControl', {
        applianceCode: this.properties.applianceData.applianceCode,
        command: command,
        reqId: getStamp().toString(),
        stamp: getStamp(),
      })
    },
    updateStatus() {
      let { isNewSwingProtocol, isNewestSwingProtocol } = this.data
      return new Promise((resolve, reject) => {
        requestService
          .request('luaGet', {
            applianceCode: this.properties.applianceData.applianceCode,
            command: {},
            reqId: getStamp().toString(),
            stamp: getStamp(),
          })
          .then((res) => {
            if (res.data.code != 0) {
              let msg = FA.handleErrorMsg(res.data.code)
              MideaToast(msg)
              reject(res)
              return
            }
            let protocolVersion = Number(res.data.data.protocol_version)
            isNewSwingProtocol = !!(protocolVersion&&protocolVersion>=5)
            isNewestSwingProtocol = !!(protocolVersion&&protocolVersion>5)

            this.setData({
              _applianceData: {
                onlineStatus: 1,
                offlineFlag: false,
              },
              isNewSwingProtocol,
              isNewestSwingProtocol,
            })

            try {
              this.dataInit(res.data.data)
            } catch (error) {
              console.error('error', error)
            }

            resolve(res.data.data)
          })
          .catch((err) => {
            // console.error('进入错误: ',err)
            // 更新渲染页面
            this.dataInit()
            let res = err.data
            if (res) {
              if (res.result && res.result.returnData) {
                res = JSON.parse(res.result.returnData)
              }
              if (res.code != 0) {
                if (res.code == 1307) {
                  reject()
                  return
                }
                let msg = FA.handleErrorMsg(res.code)
                reject()
                return MideaToast(msg)
              }
              MideaToast('未知错误-状态')
            }
            if (err && err.data && (err.data.code == 1307 || err.data.code == 40670)) {
              this.setData({
                _applianceData: {
                  onlineStatus: 0,
                  offlineFlag: true,
                },
              })
            } else if (err && err.data && err.data.code == 1306) {
              MideaToast('设备未响应，请稍后尝试刷新')
            }
            reject()
          })
      })
    },
    // endregion
    // 埋点
    rangersBurialPointClick(eventName, param) {
      let deviceInfo = this.data.deviceInfo
      if (deviceInfo) {
        let paramBurial = {}
        let paramBase = {
          module: '插件',
          apptype_name: '风扇',
          deviceInfo: {
            widget_cate: deviceInfo.type,
            sn8: deviceInfo.sn8,
            a0: deviceInfo.modelNumber,
            iot_device_id: deviceInfo.applianceCode,
          },
        }
        paramBurial = Object.assign(paramBase, param)
        rangersBurialPoint(eventName, paramBurial)
      }
    },
    // 天气获取接口
    getAirQuality({ latitude, longitude }) {
      return new Promise((resolve, reject) => {
        requestService
          .request(
            commonApi.weatherGet,
            {
              location: `${latitude},${longitude}`,
              reqId: getStamp().toString(),
              type: 'aqi',
            },
            'GET'
          )
          .then((res) => {
            resolve(res)
          })
          .catch((err) => {
            reject()
          })
      })
    },
    getWeather({ latitude, longitude }) {
      return new Promise((resolve, reject) => {
        requestService
          .request(
            commonApi.weatherGet,
            {
              location: `${latitude},${longitude}`,
              reqId: getStamp().toString(),
              type: 'now',
            },
            'GET'
          )
          .then((res) => {
            resolve(res)
          })
          .catch((err) => {
            reject()
          })
      })
    },
  },
  detached() {
    this.clearDeviceStatusInterval()
    deviceStatusTimer = null
    clearInterval(animationIntervalTimer)
    animationIntervalTimer = null
  },
  async attached() {
    const app = getApp()
    await this.doAnimate()
    let deviceInfo = this.data.deviceInfo
    Object.assign(deviceInfo, this.properties.applianceData)
    this.setData({
      uid: app.globalData.userData.uid,
      userData: app.globalData.userData,
      _applianceData: this.properties.applianceData,
      deviceInfo: deviceInfo,
    })
    let param = {}
    param['page_name'] = '首页'
    param['object'] = '进入插件页'
    this.rangersBurialPointClick('plugin_page_view', param)
    let that = this
    let rst = this.getProductConfig(8)
    if (rst) {
      // 获取设备状态
      wx.getLocation({
        type: 'wgs84',
        async success({ latitude, longitude }) {
          let options = {
            latitude,
            longitude,
          }
          Promise.all([that.getWeather(options), that.getAirQuality(options)]).then((res) => {
            let weatherObj = res[0].data.data.observe
            let airQualityObj = res[1].data.data.airQual
            // 温度取小数点前面
            weatherObj = {
              ...weatherObj,
              temperature: weatherObj.temperature.split('.')[0],
            }
            that.setData(
              {
                weatherObj,
                airQualityObj,
              },
              async () => {
                try{
                  await that.updateStatus()
                }catch (e) {
                  console.error('错误：',e)
                }
                that.setData({
                  isInit: true,
                })
                that.updateStatus()
                that.deviceStatusInterval()
              }
            )
          })
        },
      })
    }
  },
})
