// plugin/T0xB9/component/midea-stove-double-setting/midea-stove-double-setting.js
import { imageApi } from '../../assets/scripts/api'
import { parseComponentModel } from '../../assets/scripts/common'
import { PluginConfig } from '../../card/js/plugin-config'
import { Format } from '../../assets/scripts/format'

const DO_WHILE_FALSE = false

Component({
  /**
   * 组件的属性列表
   * model
   * maxSingleFireLevel: Number 单灶最高火力
   * maxTotalFireLevel: Number 双灶最高火力
   * maxPower: Number 双灶最高功率(显示用)
   * stoveOptions: Array 双灶设置
   */
  properties: {
    model: {
      type: String,
      observer: function (newValue) {
        this.getModel(parseComponentModel(newValue))
      },
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    bindModel: {},
    selectedOptionsIndex: 0, // 0: 功率  1: 温度
    temperatureSlider: [
      parseComponentModel({
        id: 'leftStove',
        color: '#FFAA10',
        anchorLabel: '左',
        unit: '℃',
        height: 36,
        value: 100,
        max: 220,
        min: 42,
        disabled: false,
        valueArray: [
          {
            value: '42',
            label: '42℃',
          },
          {
            value: '220',
            label: '220℃',
          },
        ],
      }),
      parseComponentModel({
        id: 'rightStove',
        color: '#FE684A',
        anchorLabel: '右',
        unit: '℃',
        height: 36,
        value: 100,
        max: 220,
        min: 42,
        disabled: true,
        valueArray: [
          {
            value: '42',
            label: '42℃',
          },
          {
            value: '220',
            label: '220℃',
          },
        ],
      }),
    ],
    powerDoubleSlider: parseComponentModel({
      type: 'double',
      height: 36,
      max: 26,
      min: 1,
      leftAnchor: {
        color: '#FFAA10',
        anchorLabel: '左',
        max: 15,
        value: 9,
      },
      rightAnchor: {
        color: '#FE684A',
        anchorLabel: '右',
        max: 15,
        value: 9,
      },
    }),
    hasTemperature: false,
    workTimeModal: {
      isShow: false,
    },
    workTimeData: {
      setStoveIndex: null,
      value: [0, 0, 0, 0],
      hours: [0, 1, 2, 3, 4, 5],
      minutes: [0, 1, 2, 3, 4, 5],
      result: {},
    },
    stoveOptions: [
      {
        stoveIndex: 0,
        stoveName: '左灶',
        isRunning: true,
        themeColor: {
          default: '#FDAA10',
          bgColor: '#FFF6E7',
          labelBgColor: '#FACA64',
          workModeBgColor: '#FFF6E7',
          disabledBgColor: '#F9F9F9',
          disabledColor: '#7c879b',
        },
        settingParams: {
          fireLevel: 9,
          fireLabel: '900w',
          temperature: 100,
          isTemperature: false,
        },
        powerOptions: [],
      },
      {
        stoveIndex: 1,
        stoveName: '右灶',
        isRunning: false,
        themeColor: {
          default: '#FE684A',
          bgColor: '#FDF0EB',
          labelBgColor: '#FE9D8C',
          workModeBgColor: '#FFF6E7',
          disabledBgColor: '#F9F9F9',
          disabledColor: '#7c879b',
        },
        settingParams: {
          fireLevel: 9,
          fireLabel: '900w',
          temperature: 100,
          isTemperature: false,
        },
        powerOptions: [],
      },
    ],
    iconUrl: {
      power: {
        default: imageApi.getImagePath.url + '/0xB9/icon-power.png',
        white: imageApi.getImagePath.url + '/0xB9/icon-power-white.png',
      },
      warn: imageApi.getImagePath.url + '/0xB9/icon-warn.png',
      arrow: {
        right: imageApi.getImagePath.url + '/0xE7/icon-arrow-r.png',
      },
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 设置model
    getModel(model) {
      let bindModel = this.data.bindModel
      if (!model && this.data.model && !bindModel) {
        model = JSON.parse(this.data.model)
      }
      if (model) {
        bindModel = model
        this.setData({
          bindModel: bindModel,
        })
      }
      let disabled = this.data.disabled
      if (disabled === false || disabled === true) {
        bindModel.disabled = disabled
        this.setData({
          bindModel: bindModel,
        })
      }
      let noLimit = model.noLimit
      if (noLimit === false || noLimit === true) {
        bindModel.noLimit = noLimit
      }
      console.log('双灶设置弹框')
      console.log(bindModel)
      // 适应插件参数
      bindModel.powerTipsText = '左右灶同时开启后'
      if (bindModel.maxSingleFireLevel && bindModel.maxSingleFireLevel > 0) {
        bindModel.powerTipsText += '，单灶最高可调' + bindModel.maxSingleFireLevel + '档'
      }
      if (bindModel.maxTotalFireLevel && bindModel.maxTotalFireLevel > 0) {
        bindModel.powerTipsText += '，两灶相加火力不超过' + bindModel.maxTotalFireLevel + '档'
      }
      if (bindModel.maxPower && bindModel.maxPower > 0) {
        bindModel.powerTipsText += '，约' + bindModel.maxPower + 'w。'
      }
      let stoveOptions = this.data.stoveOptions
      let hasTemperature = this.data.hasTemperature
      let powerDoubleSlider = parseComponentModel(this.data.powerDoubleSlider)
      let temperatureSlider = this.data.temperatureSlider
      // 烹饪时间初始化
      this.workTimeDataInit({
        appointTime: {
          properties: {
            min: 1,
            max: 240,
            defaultValue: 60,
          },
        },
      })
      if (bindModel.stoveOptions.length > 0) {
        if (bindModel.hasTemperature === true) {
          hasTemperature = true
        }
        // 双灶同时打开，没有温度调节(113 - 小双灶)
        if (PluginConfig.sn8 === PluginConfig.sn8Data[0]) {
          hasTemperature = !(
            bindModel.stoveOptions[0].settingParams.isRunning && bindModel.stoveOptions[1].settingParams.isRunning
          )
        }
        bindModel.stoveOptions.forEach((stoveItem, index) => {
          let pageStoveItem = stoveOptions[index]
          // 设置参数
          pageStoveItem.settingParams.disabled = stoveItem.settingParams.disabled
          pageStoveItem.settingParams.isRunning = stoveItem.settingParams.isRunning
          pageStoveItem.settingParams.isTemperature = stoveItem.settingParams.isTemperature
          pageStoveItem.settingParams.fireLevel = stoveItem.settingParams.fireLevel
          pageStoveItem.settingParams.fireLabel =
            PluginConfig.getPowerByFireLevel(stoveItem.settingParams.fireLevel) + 'w'
          pageStoveItem.settingParams.workMode = stoveItem.settingParams.workMode
          pageStoveItem.settingParams.setWorkTime = stoveItem.settingParams.setWorkTime
          pageStoveItem.settingParams.setWorkTimeLabel =
            (stoveItem.settingParams.setWorkTime.hours <= 0 ? '' : stoveItem.settingParams.setWorkTime.hours + '小时') +
            (stoveItem.settingParams.setWorkTime.minutes <= 0
              ? ''
              : stoveItem.settingParams.setWorkTime.minutes + '分钟')
          // 设置样式
          pageStoveItem.themeColor.stoveCardBgColor = pageStoveItem.settingParams.isRunning
            ? pageStoveItem.themeColor.bgColor
            : pageStoveItem.themeColor.disabledBgColor
          pageStoveItem.themeColor.stoveCardPowerColor = pageStoveItem.settingParams.isRunning
            ? pageStoveItem.themeColor.default
            : pageStoveItem.themeColor.disabledColor
          // 设置功能
          pageStoveItem.powerOptions = stoveItem.powerOptions
          if (pageStoveItem.powerOptions && pageStoveItem.powerOptions.length > 0) {
            pageStoveItem.powerOptions.forEach((item) => {
              if (item.code === stoveItem.settingParams.workMode) {
                item.bgColor = pageStoveItem.themeColor.default
                item.iconUrl.workMode = item.iconUrl.white
                // pageStoveItem.settingParams.fireLevel = item.value
                // pageStoveItem.settingParams.fireLabel = PluginConfig.getPowerByFireLevel(item.value) + 'w'
                if (pageStoveItem.stoveIndex === 0) {
                  powerDoubleSlider.leftAnchor.value = item.value
                } else {
                  powerDoubleSlider.rightAnchor.value = item.value
                }
              } else {
                item.bgColor = pageStoveItem.themeColor.bgColor
                item.iconUrl.workMode = item.iconUrl.default
              }
            })
          }
          // 温度滑块参数设置
          temperatureSlider[index] = parseComponentModel(temperatureSlider[index])
          temperatureSlider[index].disabled =
            !stoveOptions[index].settingParams.isRunning || stoveOptions[index].settingParams.disabled
          temperatureSlider[index] = parseComponentModel(temperatureSlider[index])
        })
      }

      // 功率滑块参数设置
      powerDoubleSlider.noLimit = bindModel.noLimit
      powerDoubleSlider.max = bindModel.maxTotalFireLevel
      powerDoubleSlider.leftAnchor.max = powerDoubleSlider.rightAnchor.max = bindModel.maxSingleFireLevel
      powerDoubleSlider.leftAnchor.value = stoveOptions[0].settingParams.fireLevel
      powerDoubleSlider.rightAnchor.value = stoveOptions[1].settingParams.fireLevel
      powerDoubleSlider.leftAnchor.disabled =
        !stoveOptions[0].settingParams.isRunning || bindModel.stoveOptions[0].settingParams.disabled
      powerDoubleSlider.rightAnchor.disabled =
        !stoveOptions[1].settingParams.isRunning || bindModel.stoveOptions[1].settingParams.disabled
      powerDoubleSlider = parseComponentModel(powerDoubleSlider)
      this.setData({ bindModel, hasTemperature, stoveOptions, powerDoubleSlider, temperatureSlider })

      return bindModel
    },

    // region 点击事件
    onClickEvent(event) {
      let index = event.currentTarget.dataset.index
      let value = event.currentTarget.dataset.value
      let stoveItem = event.currentTarget.dataset.stoveItem
      do {
        if (!index) {
          console.warn('invalid index')
          break
        }
        let stoveOptions = this.data.stoveOptions
        let powerDoubleSlider = parseComponentModel(this.data.powerDoubleSlider)
        let temperatureSlider = this.data.temperatureSlider
        let pageStoveItem = null
        let selectedStoveIndex = -1
        if (stoveItem) {
          pageStoveItem = stoveOptions[stoveItem.stoveIndex]
          selectedStoveIndex = stoveItem.stoveIndex
        }
        switch (index) {
          case 'selectOptionsIndex':
            this.setData({
              selectedOptionsIndex: Number(value),
            })
            break
          case 'powerSwitch':
            if (!pageStoveItem) {
              break
            }
            // 开关机
            PluginConfig.onClickControl({
              controlParams: {
                cur_burner_number: selectedStoveIndex,
                work_switch: pageStoveItem.settingParams.isRunning
                  ? PluginConfig.workSwitch.powerOff
                  : PluginConfig.workSwitch.powerOn,
              },
            }).then(() => {
              pageStoveItem.settingParams.isRunning = !pageStoveItem.settingParams.isRunning
              // 设置样式
              pageStoveItem.themeColor.stoveCardBgColor = pageStoveItem.settingParams.isRunning
                ? pageStoveItem.themeColor.bgColor
                : pageStoveItem.themeColor.disabledBgColor
              pageStoveItem.themeColor.stoveCardPowerColor = pageStoveItem.settingParams.isRunning
                ? pageStoveItem.themeColor.default
                : pageStoveItem.themeColor.disabledColor
              temperatureSlider[selectedStoveIndex] = parseComponentModel(temperatureSlider[selectedStoveIndex])
              temperatureSlider[selectedStoveIndex].disabled = !pageStoveItem.settingParams.isRunning
              temperatureSlider[selectedStoveIndex] = parseComponentModel(temperatureSlider[selectedStoveIndex])
              if (selectedStoveIndex === 0) {
                powerDoubleSlider.leftAnchor.disabled = !pageStoveItem.settingParams.isRunning
              } else {
                powerDoubleSlider.rightAnchor.disabled = !pageStoveItem.settingParams.isRunning
              }
              powerDoubleSlider = parseComponentModel(powerDoubleSlider)
              this.setData({ stoveOptions, powerDoubleSlider, temperatureSlider })
              // 双灶同时打开，没有温度调节(113 - 小双灶)
              let hasTemperature = this.data.hasTemperature
              if (PluginConfig.sn8 === PluginConfig.sn8Data[0]) {
                hasTemperature = !(stoveOptions[0].settingParams.isRunning && stoveOptions[1].settingParams.isRunning)
              }
              if (!hasTemperature) {
                // 功率初始化
                let stoveOptions = this.data.stoveOptions
                stoveOptions.forEach((stoveItem) => {
                  stoveItem.settingParams.workMode = PluginConfig.workMode.cook
                  stoveItem.settingParams.isTemperature = false
                })
                this.onClickEvent({
                  currentTarget: {
                    dataset: {
                      index: 'selectOptionsIndex',
                      value: 0,
                    },
                  },
                })
              }
              this.setData({ hasTemperature, stoveOptions })
            })
            break
          case 'selectWorkMode':
            if (!stoveItem.settingParams.isRunning || !pageStoveItem) {
              break
            }
            // 选择功能
            pageStoveItem.settingParams.workMode = value
            pageStoveItem.powerOptions.forEach((item) => {
              if (item.code === value) {
                item.bgColor = stoveItem.themeColor.default
                item.iconUrl.workMode = item.iconUrl.white
                pageStoveItem.settingParams.fireLevel = item.value
                pageStoveItem.settingParams.fireLabel = PluginConfig.getPowerByFireLevel(item.value) + 'w'
                if (pageStoveItem.stoveIndex === 0) {
                  powerDoubleSlider.leftAnchor.value = item.value
                } else {
                  powerDoubleSlider.rightAnchor.value = item.value
                }
              } else {
                item.bgColor = stoveItem.themeColor.bgColor
                item.iconUrl.workMode = item.iconUrl.default
              }
            })
            // 判断赋值是否超出，适应数值
            if (powerDoubleSlider.leftAnchor.value + powerDoubleSlider.rightAnchor.value > powerDoubleSlider.max) {
              if (pageStoveItem.stoveIndex === 0) {
                stoveOptions[1].settingParams.fireLevel = powerDoubleSlider.rightAnchor.value =
                  powerDoubleSlider.max - powerDoubleSlider.leftAnchor.value
                stoveOptions[1].settingParams.fireLabel =
                  PluginConfig.getPowerByFireLevel(stoveOptions[1].settingParams.fireLevel) + 'w'
              } else {
                stoveOptions[0].settingParams.fireLevel = powerDoubleSlider.leftAnchor.value =
                  powerDoubleSlider.max - powerDoubleSlider.rightAnchor.value
                stoveOptions[0].settingParams.fireLabel =
                  PluginConfig.getPowerByFireLevel(stoveOptions[0].settingParams.fireLevel) + 'w'
              }
            }
            powerDoubleSlider = parseComponentModel(powerDoubleSlider)
            this.setData({ stoveOptions, powerDoubleSlider })
            break
          case 'showWorkTimeModal':
            if (stoveItem) {
              if (!stoveItem.settingParams.isRunning) {
                break
              }
              let workTimeData = this.data.workTimeData
              workTimeData.setStoveIndex = stoveItem.stoveIndex
              console.log(stoveItem)
              this.workTimeDataInit({
                appointTime: {
                  properties: {
                    min: 1,
                    max: 240,
                    defaultValue:
                      stoveItem.settingParams.setWorkTime.hours * 60 + stoveItem.settingParams.setWorkTime.minutes,
                  },
                },
              })
              this.setData({ workTimeData })
              this.showWorkTimeModal()
            }
            break
          case 'doubleSettingCancel':
          case 'doubleSettingConfirm':
            this.triggerEvent(
              'onClickFooter',
              {
                item: {
                  index: index,
                  stoveOptions: stoveOptions,
                },
              },
              stoveOptions
            )
            break
        }
      } while (DO_WHILE_FALSE)
    },
    // endregion

    // region 功率滑块更新
    powerSliderOnMoving(event) {
      let model = event.detail
      let stoveOptions = this.data.stoveOptions
      let fireLevel = 1
      // 左灶参数
      let stoveOptionsItem = {}
      if (model.leftAnchor.isMoving) {
        stoveOptionsItem = stoveOptions[0]
        stoveOptionsItem.settingParams.isTemperature = false
        if (!stoveOptionsItem.powerOptions || stoveOptionsItem.powerOptions.length === 0) {
          stoveOptionsItem.settingParams.workMode = PluginConfig.workMode.heating
        }
        fireLevel = stoveOptionsItem.settingParams.fireLevel = model.leftAnchor.value
        stoveOptionsItem.settingParams.fireLabel = PluginConfig.getPowerByFireLevel(fireLevel) + 'w'
      }
      // 右灶参数
      if (model.rightAnchor.isMoving) {
        stoveOptionsItem = stoveOptions[1]
        stoveOptionsItem.settingParams.isTemperature = false
        if (!stoveOptionsItem.powerOptions || stoveOptionsItem.powerOptions.length === 0) {
          stoveOptionsItem.settingParams.workMode = PluginConfig.workMode.heating
        }
        fireLevel = stoveOptionsItem.settingParams.fireLevel = model.rightAnchor.value
        stoveOptionsItem.settingParams.fireLabel = PluginConfig.getPowerByFireLevel(fireLevel) + 'w'
      }
      this.setData({ stoveOptions })
    },
    powerSliderOnChange(event) {
      let model = event.detail
      // let powerDoubleSlider = parseComponentModel(this.data.powerDoubleSlider)
      // powerDoubleSlider = parseComponentModel(powerDoubleSlider)
      this.setData({
        powerDoubleSlider: parseComponentModel(model),
      })
    },
    // endregion

    // region 温度滑块更新
    temperatureSliderOnMoving(event) {
      let model = event.detail
      let stoveOptions = this.data.stoveOptions
      switch (model.id) {
        case 'leftStove':
          stoveOptions[0].settingParams.isTemperature = true
          stoveOptions[0].settingParams.workMode = PluginConfig.workMode.constantHeat
          stoveOptions[0].settingParams.temperature = model.value
          break
        case 'rightStove':
          stoveOptions[1].settingParams.isTemperature = true
          stoveOptions[1].settingParams.workMode = PluginConfig.workMode.constantHeat
          stoveOptions[1].settingParams.temperature = model.value
          break
      }
      this.setData({ stoveOptions })
    },
    temperatureSliderOnChange(event) {
      let model = event.detail
      let temperatureSlider = this.data.temperatureSlider
      switch (model.id) {
        case 'leftStove':
          temperatureSlider[0] = parseComponentModel(model)
          break
        case 'rightStove':
          temperatureSlider[1] = parseComponentModel(model)
          break
      }
      this.setData({ temperatureSlider })
    },
    // endregion

    // region 工作时间参数初始化
    workTimeDataInit({ appointTime }) {
      let appointTimeData = appointTime.properties
      let appointTimeDataMin = Number(appointTimeData.min)
      let defaultValueMin = Number(appointTimeData?.defaultValue ?? 0)
      let defaultValueTime = Format.formatSeconds(defaultValueMin * 60)
      let workTimeData = this.data.workTimeData
      let hours = []
      let minutes = []
      let minHours = Math.floor(appointTimeDataMin / 60)
      let maxHours = Math.floor(appointTimeData.max / 60)
      let minMinutes = appointTimeDataMin % 60
      let maxMinutes = appointTimeData.max % 60
      // 设置小时数据
      for (let i = minHours; i <= maxHours; i++) {
        hours.push(i)
        if (i === defaultValueTime.hours) {
          workTimeData.value[1] = hours.length - 1
        }
      }
      // 设置分钟数据
      let startMinutes = minMinutes
      if (workTimeData.value[1] !== 0) {
        startMinutes = 0
      }
      for (let i = startMinutes; i < 60; i++) {
        minutes.push(i)
        if (i === defaultValueTime.minutes) {
          workTimeData.value[2] = minutes.length - 1
        }
      }
      workTimeData.minHours = minHours
      workTimeData.minMinutes = minMinutes
      workTimeData.maxHours = maxHours
      workTimeData.maxMinutes = maxMinutes
      workTimeData.hours = hours
      workTimeData.minutes = minutes
      workTimeData.result = defaultValueTime
      workTimeData.resultLabel =
        (workTimeData.result.hours > 0 ? workTimeData.result.hours + '小时' : '') +
        (workTimeData.result.minutes > 0 ? workTimeData.result.minutes + '分钟' : '')
      this.setData({ workTimeData })
    },
    // endregion
    // region 烹饪时间选择
    workTimePickerOnChange(e) {
      // 数据联动修改
      let val = e.detail.value
      let hoursIndex = val[1]
      let workTimeData = this.data.workTimeData
      // let minHours = workTimeData.minHours
      let minMinutes = workTimeData.minMinutes
      // let maxHours = workTimeData.maxHours
      let maxMinutes = workTimeData.maxMinutes
      let minutes = []
      if (hoursIndex === 0) {
        // 筛选最小分钟
        for (let i = minMinutes; i < 60; i++) {
          minutes.push(i)
        }
      } else if (hoursIndex === workTimeData.hours.length - 1) {
        // 筛选最大分钟
        for (let i = 0; i <= maxMinutes; i++) {
          minutes.push(i)
        }
      } else {
        for (let i = 0; i < 60; i++) {
          minutes.push(i)
        }
      }
      workTimeData.value = val
      workTimeData.minutes = minutes
      let workTimeHours = workTimeData.hours[val[1]]
      let workTimeMinutes = workTimeData.minutes[val[2]]
      let workTimeSeconds = workTimeHours * 60 * 60 + workTimeMinutes * 60
      let workTimeResult = Format.formatSeconds(workTimeSeconds)
      if (workTimeResult.minutes === 60) {
        workTimeResult.hours += 1
        workTimeResult.minutes = 0
      }
      workTimeData.result = workTimeResult
      workTimeData.resultLabel =
        (workTimeData.result.hours > 0 ? workTimeData.result.hours + '小时' : '') +
        (workTimeData.result.minutes > 0 ? workTimeData.result.minutes + '分钟' : '')
      this.setData({ workTimeData })
    },
    // endregion
    // region 烹饪时间确认
    confirmWorkTime() {
      let workTimeData = this.data.workTimeData
      let value = workTimeData.value
      let hourIndex = value[1]
      let minuteIndex = value[2]
      let hours = Number(workTimeData.hours[hourIndex])
      let minutes = Number(workTimeData.minutes[minuteIndex])
      let stoveOptions = this.data.stoveOptions
      let setWorkTime = (stoveOptions[workTimeData.setStoveIndex].settingParams.setWorkTime = Format.formatSeconds(
        hours * 60 * 60 + minutes * 60
      ))
      stoveOptions[workTimeData.setStoveIndex].settingParams.setWorkTimeLabel =
        (setWorkTime.hours <= 0 ? '' : setWorkTime.hours + '小时') +
        (setWorkTime.minutes <= 0 ? '' : setWorkTime.minutes + '分钟')
      this.setData({ workTimeData, stoveOptions })
      this.closeWorkTimeModal()
    },
    // endregion
    // region 显示烹饪时间对话框
    showWorkTimeModal() {
      let workTimeModal = this.data.workTimeModal
      workTimeModal.isShow = true
      this.setData({ workTimeModal })
    },
    closeWorkTimeModal() {
      let workTimeModal = this.data.workTimeModal
      workTimeModal.isShow = false
      this.setData({ workTimeModal })
      setTimeout(() => {
        let workTimeData = this.data.workTimeData
        workTimeData.value = [0, 0, 0, 0]
        this.setData({ workTimeData })
      }, 300)
    },
    // endregion
  },
})
