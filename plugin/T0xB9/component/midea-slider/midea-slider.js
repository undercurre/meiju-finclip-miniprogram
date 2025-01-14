// plugin/T0xFB/component/media-slider/media-slider.js
import { imageApi } from '../../assets/scripts/api'

const DO_WHILE_FALSE = false

Component({
  /**
   * 组件的属性列表
   * model:{
   *     currentValue: number;    当前滑块值
   *     process: number;         滑块进度
   *     min: number;             最小值
   *     max: number;             最大值
   *     interval: number;        间隔数
   *     unit: string;            单位
   *     valueArray: Array<string>    数轴具体展示数组
   *     color: string;           控件主题色
   *     width: string;           标签区域宽度
   *     isShowValue: boolean     是否在滑块内显示当前数值
   * }
   */
  properties: {
    model: {
      type: String,
      observer: function (newValue) {
        this.getModel(JSON.parse(newValue))
        this.valueArrayInit()
      },
    },
    disabled: {
      type: Boolean,
      value: null,
      observer: function (newValue) {
        let bindModel = this.data.bindModel
        bindModel.disabled = newValue
        this.setData({ bindModel })
      },
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    bindModel: {},
    interval: 5,
    sliderWidth: 0,
    currentSliderWidth: 0,
    touchStartX: 0,
    icon: {
      add: imageApi.getImagePath.url + '/0xFB/icon-add.png',
      reduce: imageApi.getImagePath.url + '/0xFB/icon-miu.png',
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
        // 设置样式
        bindModel.currentValueStyle =
          (bindModel.color ? 'color:' + bindModel.color + ';' : '') +
          (bindModel.isShowValue && bindModel.currentValue !== bindModel.min && bindModel.currentValue !== bindModel.max
            ? 'opacity:1;'
            : 'opacity:0;')
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
      return bindModel
    },
    getSliderWidth() {
      wx.createSelectorQuery()
        .in(this)
        .select('.slider-process')
        .fields(
          {
            dataset: true,
            size: true,
            scrollOffset: true,
            properties: ['scrollX', 'scrollY'],
            computedStyle: ['margin', 'backgroundColor'],
            context: true,
          },
          (res) => {
            if (res) {
              this.setData({
                sliderWidth: res.width,
              })
            }
          }
        )
        .exec()
    },
    // 滑块数轴初始化
    valueArrayInit() {
      let bindModel = this.data.bindModel
      if (!bindModel.currentValue) {
        bindModel.currentValue = bindModel.min
        bindModel.process = 0
      } else {
        bindModel.process = ((bindModel.currentValue - bindModel.min) / (bindModel.max - bindModel.min)) * 100
      }
      let interval = bindModel.interval || this.data.interval
      let i = Math.ceil((bindModel.max - bindModel.min) / interval)
      let valueArray = []
      if (bindModel.valueArray && bindModel.valueArray.length > 0) {
        valueArray = bindModel.valueArray
      } else {
        do {
          let value = bindModel.max - i * interval
          if (value === 0) {
            value = bindModel.min
          }
          valueArray.push({
            value: value,
            label: value + bindModel.unit,
          })
          i--
        } while (i >= 0)
      }
      bindModel.valueArray = valueArray
      this.setData({
        bindModel: bindModel,
      })
    },
    // 点击增减滑块数值
    changeSliderValue(event) {
      do {
        let bindModel = this.getModel()
        if (bindModel.disabled) {
          break
        }
        let index = event.currentTarget.dataset.index
        let interval = bindModel.interval || this.data.interval
        let targetValue = bindModel.currentValue
        switch (index) {
          case 'reduce':
            targetValue -= interval
            // interval = -interval;
            break
          case 'add':
            targetValue += interval
            break
        }
        for (let i = 0; i < bindModel.valueArray.length; i++) {
          if (targetValue >= bindModel.max && index === 'add') {
            targetValue = bindModel.max
            break
          }
          if (targetValue <= bindModel.min && index === 'reduce') {
            targetValue = bindModel.min
            break
          }
        }
        bindModel.currentValue = targetValue
        bindModel.process = ((bindModel.currentValue - bindModel.min) / (bindModel.max - bindModel.min)) * 100
        this.setData({
          bindModel: bindModel,
        })
        this.triggerEvent('onChange', bindModel, bindModel)
      } while (DO_WHILE_FALSE)
    },
    // region 滑块拖拽事件
    sliderTouchStart(event) {
      do {
        let bindModel = this.getModel()
        if (bindModel.disabled) {
          break
        }
        // 获取选中滑块长度
        let touch = event.touches[0] || event.changedTouches[0]
        this.setData({
          touchStartX: touch.pageX,
        })
        wx.createSelectorQuery()
          .in(this)
          .select('.slider-active-process')
          .fields(
            {
              dataset: true,
              size: true,
              scrollOffset: true,
              properties: ['scrollX', 'scrollY'],
              computedStyle: ['margin', 'backgroundColor'],
              context: true,
            },
            (res) => {
              let bindModel = this.data.bindModel
              bindModel.isDragging = true
              this.setData({
                bindModel: bindModel,
                currentSliderWidth: res.width,
              })
            }
          )
          .exec()
      } while (DO_WHILE_FALSE)
    },
    sliderTouchMove(event) {
      do {
        let bindModel = this.data.bindModel
        if (bindModel.disabled) {
          break
        }
        let touch = event.touches[0] || event.changedTouches[0]
        let startX = this.data.touchStartX
        let pageX = touch.pageX
        let interval = pageX - startX
        let currentSliderWidth = this.data.currentSliderWidth
        let sliderWidth = this.data.sliderWidth
        let targetSliderWidth = currentSliderWidth + interval
        let process = targetSliderWidth / sliderWidth
        if (process > 1) {
          process = 1
        } else if (process < 0) {
          process = 0
        }
        let targetProcess = Math.floor(process * 100)
        let targetValue = Math.floor((bindModel.max - bindModel.min) * process + bindModel.min)
        let intervalValue = targetValue - bindModel.min
        if (intervalValue % bindModel.interval === 0) {
          bindModel.currentValue = Math.floor((bindModel.max - bindModel.min) * process + bindModel.min)
          bindModel.process = targetProcess
        }
        this.setData({
          bindModel: bindModel,
        })
        this.triggerEvent('onMoving', bindModel, bindModel)
      } while (DO_WHILE_FALSE)
    },
    sliderTouchEnd() {
      do {
        let bindModel = this.data.bindModel
        if (bindModel.disabled) {
          break
        }
        bindModel.isDragging = false
        this.setData({
          bindModel: bindModel,
        })
        this.triggerEvent('onChange', bindModel, bindModel)
      } while (DO_WHILE_FALSE)
    },
    // endregion
    // region 进度条点击事件
    selectProcess(event) {
      do {
        let bindModel = this.data.bindModel
        if (bindModel.disabled) {
          break
        }
        let originalX = event.currentTarget.offsetLeft
        let targetX = event.detail.x
        let interval = targetX - originalX
        let sliderWidth = this.data.sliderWidth
        let targetSliderWidth = interval
        let process = targetSliderWidth / sliderWidth
        if (process > 1) {
          process = 1
        } else if (process < 0) {
          process = 0
        }
        let targetProcess = process * 100
        let targetValue = Math.floor((bindModel.max - bindModel.min) * process + bindModel.min)
        let preValue =
          bindModel.min + Math.floor((targetValue - bindModel.min) / bindModel.interval) * bindModel.interval
        let remainValue = Math.floor((targetValue - bindModel.min) % bindModel.interval)
        if (remainValue < bindModel.interval / 2) {
          targetValue = preValue
        } else {
          targetValue = preValue + bindModel.interval
        }
        targetProcess = ((targetValue - bindModel.min) / (bindModel.max - bindModel.min)) * 100
        bindModel.currentValue = targetValue
        bindModel.process = targetProcess
        this.setData({
          bindModel: bindModel,
        })
        this.triggerEvent('onChange', bindModel, bindModel)
      } while (DO_WHILE_FALSE)
    },
    // endregion
  },
  attached() {
    this.getModel()
    // 获取滑块长度
    setTimeout(() => {
      wx.createSelectorQuery()
        .in(this)
        .select('.slider-process')
        .fields(
          {
            dataset: true,
            size: true,
            scrollOffset: true,
            properties: ['scrollX', 'scrollY'],
            computedStyle: ['margin', 'backgroundColor'],
            context: true,
          },
          (res) => {
            if (res) {
              this.setData({
                sliderWidth: res.width,
              })
            }
          }
        )
        .exec()
    }, 300)
  },
})
