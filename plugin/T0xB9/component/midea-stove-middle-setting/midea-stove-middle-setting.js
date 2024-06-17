// plugin/T0xB9/component/midea-stove-middle-setting/midea-stove-middle-setting.js
import { imageApi } from '../../assets/scripts/api'
import { Format } from '../../assets/scripts/format'
import { PluginConfig } from '../../card/js/plugin-config'
import { parseComponentModel } from '../../assets/scripts/common'

const DO_WHILE_FALSE = false

Component({
  /**
   * 组件的属性列表
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
    workTimeModal: {
      isShow: false,
    },
    workTimeData: {
      value: [0, 0, 0, 0],
      hours: [0, 1, 2, 3, 4, 5],
      minutes: [0, 1, 2, 3, 4, 5],
      result: {},
      resultLabel: '--',
    },
    pageStyle: {
      optionsSettingActive: 'left: 0;',
    },
    functionOptions: [
      {
        code: PluginConfig.workMode.soup,
        name: PluginConfig.workModeName[PluginConfig.workMode.soup],
        iconUrl: {
          default: imageApi.getImagePath.url + '/0xB9/icon-duntang.png',
          white: imageApi.getImagePath.url + '/0xB9/icon-duntang-white.png',
        },
      },
      {
        code: PluginConfig.workMode.steamCook,
        name: PluginConfig.workModeName[PluginConfig.workMode.steamCook],
        iconUrl: {
          default: imageApi.getImagePath.url + '/0xB9/icon-jianzha.png',
          white: imageApi.getImagePath.url + '/0xB9/icon-jianzha-white.png',
        },
      },
      {
        code: PluginConfig.workMode.stew,
        name: PluginConfig.workModeName[PluginConfig.workMode.stew],
        iconUrl: {
          default: imageApi.getImagePath.url + '/0xB9/icon-dunzhu.png',
          white: imageApi.getImagePath.url + '/0xB9/icon-dunzhu-white.png',
        },
      },
    ],
    powerOptions: [
      {
        value: 4,
        label: '小火',
      },
      {
        value: 8,
        label: '中火',
      },
      {
        value: 10,
        label: '大火',
      },
    ],
    settingParams: {
      workMode: PluginConfig.workMode.soup,
      fireLevel: 10,
      selectedPowerIndex: 0,
      setWorkTime: {},
      setWorkTimeLabel: '--',
    },
    iconUrl: {
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
      let settingParams = this.data.settingParams
      Object.assign(settingParams, bindModel)
      // 设置初始化
      this.workTimeDataInit({
        appointTime: {
          properties: {
            min: 1,
            max: 240,
            defaultValue: settingParams.setWorkTime.hours * 60 + settingParams.setWorkTime.minutes,
          },
        },
      })
      console.log('设置初始化')
      console.log(bindModel)
      console.log(settingParams)
      this.setData({ bindModel, settingParams })
      this.onClickEvent({
        currentTarget: {
          dataset: {
            index: 'power',
            item: {
              value: settingParams.fireLevel,
            },
          },
        },
      })

      return bindModel
    },
    onClickEvent(event) {
      do {
        let index = event.currentTarget.dataset.index
        if (!index) {
          console.warn('invalid index')
          break
        }
        let item = event.currentTarget.dataset.item
        let pageStyle = this.data.pageStyle
        let settingParams = this.data.settingParams
        let powerOptions = this.data.powerOptions
        switch (index) {
          case 'functions':
            settingParams.workMode = item.code
            break
          case 'power':
            settingParams.fireLevel = item.value
            switch (settingParams.fireLevel) {
              case powerOptions[0].value:
                pageStyle.optionsSettingActive = 'left: 0;'
                break
              case powerOptions[1].value:
                pageStyle.optionsSettingActive = 'left: 50%;transform:translateX(-50%);'
                break
              case powerOptions[2].value:
                pageStyle.optionsSettingActive = 'left:100%;transform:translateX(-100%);'
                break
            }
            break
          case 'middleSettingCancel':
          case 'middleSettingConfirm':
            this.triggerEvent('onClickFooter', {
              item: {
                index: index,
                settingParams: settingParams,
              },
            })
            break
        }
        this.setData({ settingParams, pageStyle })
      } while (DO_WHILE_FALSE)
    },
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
      let settingParams = this.data.settingParams
      let setWorkTime = (settingParams.setWorkTime = Format.formatSeconds(
        defaultValueTime.hours * 60 * 60 + defaultValueTime.minutes * 60
      ))
      settingParams.setWorkTimeLabel =
        (setWorkTime.hours <= 0 ? '' : setWorkTime.hours + '小时') +
        (setWorkTime.minutes <= 0 ? '' : setWorkTime.minutes + '分钟')
      this.setData({ workTimeData, settingParams })
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
      let settingParams = this.data.settingParams
      let setWorkTime = (settingParams.setWorkTime = Format.formatSeconds(hours * 60 * 60 + minutes * 60))
      settingParams.setWorkTimeLabel =
        (setWorkTime.hours <= 0 ? '' : setWorkTime.hours + '小时') +
        (setWorkTime.minutes <= 0 ? '' : setWorkTime.minutes + '分钟')
      this.setData({ workTimeData, settingParams })
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
    },
    // endregion
  },
})
