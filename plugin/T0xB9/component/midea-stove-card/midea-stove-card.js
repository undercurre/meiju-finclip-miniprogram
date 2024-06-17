// plugin/T0xB9/component/midea-stove-card/midea-stove-card.js
import { imageApi } from '../../assets/scripts/api'
import { parseComponentModel } from '../../assets/scripts/common'
import { PluginConfig } from '../../card/js/plugin-config'

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
    btnOptions: [
      {
        customClass: 'primary',
        index: 'power',
        iconUrl: imageApi.getImagePath.url + '/0xB9/icon-power.png',
      },
      {
        index: 'setting',
        iconUrl: imageApi.getImagePath.url + '/0xB9/icon-setting.png',
      },
      {
        index: 'start',
        iconUrl: imageApi.getImagePath.url + '/0xB9/icon-start-white.png',
      },
    ],
    bgImage: {
      default: imageApi.getImagePath.url + '/0xB9/bg-running.png',
      running: imageApi.getImagePath.url + '/0xB9/bg-running-moving.png',
    },
    iconUrl: {
      power: {
        default: imageApi.getImagePath.url + '/0xB9/icon-power.png',
        white: imageApi.getImagePath.url + '/0xB9/icon-power-white.png',
      },
      end: {
        default: imageApi.getImagePath.url + '/0xB9/icon-end.png',
        white: imageApi.getImagePath.url + '/0xB9/icon-end-white.png',
      },
      start: {
        default: imageApi.getImagePath.url + '/0xB9/icon-start.png',
        white: imageApi.getImagePath.url + '/0xB9/icon-start-white.png',
      },
      pause: {
        default: imageApi.getImagePath.url + '/0xB9/icon-pause.png',
        white: imageApi.getImagePath.url + '/0xB9/icon-pause-white.png',
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
      // 设置按钮样式
      let btnOptions = this.data.btnOptions
      let iconUrl = this.data.iconUrl
      btnOptions.forEach((btnItem) => {
        switch (btnItem.index) {
          case 'power':
            if (bindModel.isRunning) {
              btnItem.customClass = ''
              btnItem.iconUrl = iconUrl.power.default
            } else {
              btnItem.customClass = 'primary'
              btnItem.iconUrl = iconUrl.power.white
            }
            if (bindModel.isWorking) {
              btnItem.customClass = 'icon-shrink'
              btnItem.iconUrl = iconUrl.end.default
              btnItem.index = 'stop'
            }
            break
          case 'setting':
            btnItem.disabled = bindModel.disabled
            break
          case 'continue':
          case 'start':
            if (bindModel.isRunning) {
              btnItem.customClass = 'primary icon-p-l'
              btnItem.iconUrl = iconUrl.start.white
            } else {
              btnItem.customClass = 'icon-p-l'
              btnItem.iconUrl = iconUrl.start.default
            }
            if (bindModel.isWorking) {
              btnItem.customClass = 'icon-shrink'
              btnItem.iconUrl = iconUrl.pause.default
              btnItem.index = 'pause'
            }
            if (bindModel.isPause) {
              btnItem.customClass = 'primary icon-p-l'
              btnItem.iconUrl = iconUrl.start.white
              btnItem.index = 'continue'
            }
            break
          case 'stop':
            if (!bindModel.isWorking) {
              if (bindModel.isRunning) {
                btnItem.customClass = ''
                btnItem.iconUrl = iconUrl.power.default
              } else {
                btnItem.customClass = 'primary'
                btnItem.iconUrl = iconUrl.power.white
              }
              btnItem.index = 'power'
            }
            break
          case 'pause':
            if (bindModel.isPause) {
              btnItem.customClass = 'primary icon-p-l'
              btnItem.iconUrl = iconUrl.start.white
              btnItem.index = 'continue'
            } else if (bindModel.isRunning && !bindModel.isWorking) {
              btnItem.customClass = 'primary icon-p-l'
              btnItem.iconUrl = iconUrl.start.white
              btnItem.index = 'start'
            } else {
              btnItem.customClass = 'icon-shrink'
              btnItem.iconUrl = iconUrl.pause.default
              btnItem.index = 'pause'
            }
            break
        }
      })
      this.setData({ btnOptions })
      return bindModel
    },
    onClickEvent(event) {
      let item = event.currentTarget.dataset.item
      let bindModel = this.data.bindModel
      this.triggerEvent('onClickOptions', {
        item: item,
        stoveIndex: bindModel.id,
      })
    },
  },
})
