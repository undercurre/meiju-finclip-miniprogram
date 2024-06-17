// plugin/T0xB9/component/midea-slider-bold/midea-slider-bold.js
import { parseComponentModel } from '../../assets/scripts/common'

const DO_WHILE_FALSE = false

Component({
  /**
   * 组件的属性列表
   * model  组件参数，数据类型AnchorModel
   *
   * AnchorModel数据的结构
   * id     可传，String
   * value  必传，当前数值 Number
   * min    必传，最小值 Number
   * max    必传，最大值 Number
   * height   可传，高度 Number (建议双数)
   * color  可传，主题颜色 String
   * type   可传，滑块类型，String,默认空，参数：double
   * anchorLabel    可传，锚点标签 String
   * leftAnchor   type等于double时可用，数据类型为AnchorModel
   * rightAnchor  type等于double时可用，数据类型为AnchorModel
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
    bindModel: {
      height: 66,
    },
    sliderWidth: 345,
    touchStartX: 0,
    currentSliderWidth: 0,
    otherSliderWidth: 0,
    pageStyle: {
      disabledBgColor: '#C7C7C7',
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getModel(model) {
      let bindModel = this.data.bindModel
      if (model && JSON.stringify(model) !== '{}') {
        bindModel = model
      }
      let disabled = model.disabled
      if (disabled === false || disabled === true) {
        bindModel.disabled = disabled
      }
      // 更新滑块样式
      let pageStyle = this.data.pageStyle
      let sliderWidth = this.data.sliderWidth
      let borderRadius = Math.floor(bindModel.height / 2)
      // let sliderMax = bindModel.max || 15
      let sliderMin = bindModel.min || 1
      let k = (bindModel.max - bindModel.min) / (sliderWidth - bindModel.height)
      bindModel.sliderWrapperStyle = 'width:' + sliderWidth + 'px;height:' + bindModel.height + 'px;'
      do {
        if (bindModel.type === 'double') {
          k = (bindModel.max - 2 * bindModel.min) / (sliderWidth - 2 * bindModel.height)
          // 左滑块样式
          let leftValue = bindModel.leftAnchor.value || 6
          let leftThemeStyle =
            'background-color:' +
            (bindModel.leftAnchor.disabled ? pageStyle.disabledBgColor : bindModel.leftAnchor.color || '#FFAA10') +
            ';'
          let leftProcessWidth = (leftValue - bindModel.min) / k + borderRadius
          let leftLimitWidth = (bindModel.leftAnchor.max / bindModel.max) * sliderWidth
          if (!leftLimitWidth) {
            leftLimitWidth = sliderWidth - bindModel.height
          }
          bindModel.leftAnchor.sliderProcessStyle =
            leftThemeStyle + 'width:' + (leftProcessWidth + borderRadius) + 'px;'
          bindModel.leftAnchor.anchorStyle =
            leftThemeStyle +
            'width:' +
            bindModel.height +
            'px;height:' +
            bindModel.height +
            'px;' +
            'left:' +
            leftProcessWidth +
            'px;'
          bindModel.leftAnchor.limitStyle =
            'border-color:' + (bindModel.leftAnchor.color || '#FFAA10') + ';' + 'width:' + leftLimitWidth + 'px;'
          bindModel.leftAnchor.limitWidth = leftLimitWidth
          // 右滑块样式
          let rightValue = bindModel.rightAnchor.value || 6
          let rightThemeStyle =
            'background-color:' +
            (bindModel.rightAnchor.disabled ? pageStyle.disabledBgColor : bindModel.rightAnchor.color || '#FE684A') +
            ';'
          let rightProcessWidth = (rightValue - bindModel.min) / k + borderRadius
          let rightLimitWidth = (bindModel.rightAnchor.max / bindModel.max) * sliderWidth
          if (!rightLimitWidth) {
            rightLimitWidth = sliderWidth - bindModel.height
          }
          bindModel.rightAnchor.sliderProcessStyle =
            rightThemeStyle + 'width:' + (rightProcessWidth + borderRadius) + 'px;'
          bindModel.rightAnchor.anchorStyle =
            rightThemeStyle +
            'width:' +
            bindModel.height +
            'px;height:' +
            bindModel.height +
            'px;' +
            'right:' +
            rightProcessWidth +
            'px;'
          bindModel.rightAnchor.limitStyle =
            'border-color:' + (bindModel.rightAnchor.color || '#FE684A') + ';' + 'width:' + rightLimitWidth + 'px;'
          bindModel.rightAnchor.limitWidth = rightLimitWidth
          break
        }
        // 单滑块样式
        let themeStyle =
          'background-color:' + (bindModel.disabled ? pageStyle.disabledBgColor : bindModel.color || '#FFAA10') + ';'
        let sliderValue = bindModel.value || 6
        let processWidth = (sliderValue - sliderMin) / k + borderRadius
        bindModel.sliderProcessStyle = themeStyle + 'width:' + (processWidth + borderRadius) + 'px;'
        bindModel.anchorStyle =
          themeStyle +
          'width:' +
          bindModel.height +
          'px;height:' +
          bindModel.height +
          'px;' +
          'left:' +
          processWidth +
          'px;'
      } while (DO_WHILE_FALSE)
      console.log('更新滑块参数')
      console.log(bindModel)
      this.setData({
        bindModel: bindModel,
      })
      return bindModel
    },
    // region 滑块移动事件
    onTouchStart(event) {
      do {
        let bindModel = this.data.bindModel
        if (bindModel.disabled) {
          break
        }
        let sliderProcessStyle = bindModel.sliderProcessStyle
        let reg_g = /width:.*;/g
        if (bindModel.type === 'double') {
          let otherSliderWidth = 0
          let otherSliderProcessStyle = ''
          let index = event.currentTarget.dataset.index
          let disabled = false
          switch (index) {
            case 'left':
              sliderProcessStyle = bindModel.leftAnchor.sliderProcessStyle
              // 获取另一边样式
              otherSliderProcessStyle = bindModel.rightAnchor.sliderProcessStyle
              disabled = bindModel.leftAnchor.disabled
              break
            case 'right':
              sliderProcessStyle = bindModel.rightAnchor.sliderProcessStyle
              otherSliderProcessStyle = bindModel.leftAnchor.sliderProcessStyle
              disabled = bindModel.rightAnchor.disabled
              break
          }
          if (disabled) {
            break
          }
          let otherSliderWidthRegResult = otherSliderProcessStyle.match(reg_g)[0]
          otherSliderWidth = parseFloat(otherSliderWidthRegResult.match(/\d+/g)[0])
          this.setData({ otherSliderWidth })
        }
        let sliderWidthRegResult = sliderProcessStyle.match(reg_g)[0]
        let sliderWidth = parseFloat(sliderWidthRegResult.match(/\d+/g)[0])
        let touch = event.touches[0] || event.changedTouches[0]
        this.setData({
          currentSliderWidth: sliderWidth,
          touchStartX: touch.pageX,
        })
      } while (DO_WHILE_FALSE)
    },
    onTouchMove(event) {
      do {
        let bindModel = this.data.bindModel
        if (bindModel.disabled) {
          break
        }
        let touch = event.touches[0] || event.changedTouches[0]
        let startX = this.data.touchStartX
        let pageX = touch.pageX
        let touchMoveInterval = pageX - startX
        let currentSliderWidth = this.data.currentSliderWidth
        let targetSliderWidth = currentSliderWidth + touchMoveInterval
        let sliderWidth = this.data.sliderWidth
        let borderRadius = Math.floor(bindModel.height / 2)
        let minWidth = Number(bindModel.height)
        let index = event.currentTarget.dataset.index
        let anchorStyle = ''
        let normalStyle = ''
        let sliderProcessStyle = ''
        let k = (bindModel.max - bindModel.min) / (sliderWidth - bindModel.height)
        let x = targetSliderWidth - bindModel.height
        if (bindModel.type === 'double') {
          let limitWidth = sliderWidth
          let otherSliderWidth = this.data.otherSliderWidth
          let touchWidth = sliderWidth - otherSliderWidth
          let otherSlideAnchorStyle = ''
          // let otherSlideNormalStyle = ''
          let otherSliderProcessStyle = ''
          // let otherSlideProcess = 1
          let leftDisabled = bindModel.leftAnchor.disabled
          let rightDisabled = bindModel.rightAnchor.disabled
          let disabled = false
          k = (bindModel.max - 2 * bindModel.min) / (sliderWidth - 2 * bindModel.height)
          x = targetSliderWidth - bindModel.height
          switch (index) {
            case 'left':
              if (leftDisabled) {
                disabled = true
                break
              }
              bindModel.leftAnchor.isMoving = true
              limitWidth = bindModel.leftAnchor.limitWidth
              if (targetSliderWidth >= limitWidth) {
                targetSliderWidth = limitWidth
              } else if (targetSliderWidth <= minWidth) {
                targetSliderWidth = minWidth
              }
              anchorStyle = bindModel.leftAnchor.anchorStyle
              normalStyle = anchorStyle.split('left')[0]
              sliderProcessStyle = bindModel.leftAnchor.sliderProcessStyle
              bindModel.leftAnchor.anchorStyle = normalStyle + 'left:' + (targetSliderWidth - borderRadius) + 'px;'
              bindModel.leftAnchor.sliderProcessStyle = sliderProcessStyle.replace(
                /width:.*;/g,
                'width:' + targetSliderWidth + 'px;'
              )
              x = targetSliderWidth - bindModel.height
              bindModel.leftAnchor.value = Math.round(k * x + bindModel.min)
              if (bindModel.maxSingleFireLevel && bindModel.maxSingleFireLevel > 0) {
                if (bindModel.leftAnchor.value >= bindModel.maxSingleFireLevel) {
                  bindModel.leftAnchor.value = bindModel.maxSingleFireLevel
                }
              }
              if (targetSliderWidth >= touchWidth) {
                // 一端锚点抵到另一端，另一端锚点被推动
                bindModel.rightAnchor.isMoving = true
                otherSliderWidth = sliderWidth - targetSliderWidth
                otherSlideAnchorStyle = bindModel.rightAnchor.anchorStyle
                // otherSlideNormalStyle = anchorStyle.split('right')[0]
                otherSliderProcessStyle = bindModel.rightAnchor.sliderProcessStyle
                // otherSlideProcess = otherSliderWidth / sliderWidth
                bindModel.rightAnchor.anchorStyle =
                  otherSlideAnchorStyle + 'right:' + (otherSliderWidth - borderRadius) + 'px;'
                bindModel.rightAnchor.sliderProcessStyle = otherSliderProcessStyle.replace(
                  /width:.*;/g,
                  'width:' + otherSliderWidth + 'px;'
                )
                bindModel.rightAnchor.value = bindModel.max - bindModel.leftAnchor.value
              }
              break
            case 'right':
              if (rightDisabled) {
                disabled = true
                break
              }
              bindModel.rightAnchor.isMoving = true
              limitWidth = bindModel.rightAnchor.limitWidth
              targetSliderWidth = currentSliderWidth - touchMoveInterval
              if (targetSliderWidth >= limitWidth) {
                targetSliderWidth = limitWidth
              } else if (targetSliderWidth < minWidth) {
                targetSliderWidth = minWidth
              }
              anchorStyle = bindModel.rightAnchor.anchorStyle
              normalStyle = anchorStyle.split('right')[0]
              sliderProcessStyle = bindModel.rightAnchor.sliderProcessStyle
              bindModel.rightAnchor.anchorStyle = normalStyle + 'right:' + (targetSliderWidth - borderRadius) + 'px;'
              bindModel.rightAnchor.sliderProcessStyle = sliderProcessStyle.replace(
                /width:.*;/g,
                'width:' + targetSliderWidth + 'px;'
              )
              x = targetSliderWidth - bindModel.height
              bindModel.rightAnchor.value = Math.round(k * x + bindModel.min)
              if (bindModel.maxSingleFireLevel && bindModel.maxSingleFireLevel > 0) {
                if (bindModel.rightAnchor.value >= bindModel.maxSingleFireLevel) {
                  bindModel.rightAnchor.value = bindModel.maxSingleFireLevel
                }
              }
              if (targetSliderWidth >= touchWidth) {
                bindModel.leftAnchor.isMoving = true
                otherSliderWidth = sliderWidth - targetSliderWidth
                otherSlideAnchorStyle = bindModel.leftAnchor.anchorStyle
                // otherSlideNormalStyle = anchorStyle.split('left')[0]
                otherSliderProcessStyle = bindModel.leftAnchor.sliderProcessStyle
                // otherSlideProcess = otherSliderWidth / sliderWidth
                bindModel.leftAnchor.anchorStyle =
                  otherSlideAnchorStyle + 'left:' + (otherSliderWidth - borderRadius) + 'px;'
                bindModel.leftAnchor.sliderProcessStyle = otherSliderProcessStyle.replace(
                  /width:.*;/g,
                  'width:' + otherSliderWidth + 'px;'
                )
                bindModel.leftAnchor.value = bindModel.max - bindModel.rightAnchor.value
              }
              break
          }
          if (disabled) {
            break
          }
          this.setData({
            bindModel,
          })
          this.triggerEvent('onMoving', bindModel, bindModel)
          break
        }
        // 单滑块设置
        if (targetSliderWidth > sliderWidth) {
          targetSliderWidth = sliderWidth
        } else if (targetSliderWidth < minWidth) {
          targetSliderWidth = minWidth
        }
        // 设置锚点位置
        anchorStyle = bindModel.anchorStyle
        normalStyle = anchorStyle.split('left')[0]
        bindModel.anchorStyle = normalStyle + 'left:' + (targetSliderWidth - borderRadius) + 'px;'
        // 设置滑条进度
        sliderProcessStyle = bindModel.sliderProcessStyle
        bindModel.sliderProcessStyle = sliderProcessStyle.replace(/width:.*;/g, 'width:' + targetSliderWidth + 'px;')
        // 设置数值
        bindModel.value = Math.round(k * x + bindModel.min)
        this.setData({
          bindModel,
        })
        this.triggerEvent('onMoving', bindModel, bindModel)
      } while (DO_WHILE_FALSE)
    },
    onTouchEnd(event) {
      let bindModel = this.data.bindModel
      do {
        if (bindModel.disabled) {
          break
        }
        if (bindModel.type === 'double') {
          let index = event.currentTarget.dataset.index
          let disabled = false
          switch (index) {
            case 'left':
              disabled = bindModel.leftAnchor.disabled
              break
            case 'right':
              disabled = bindModel.rightAnchor.disabled
              break
          }
          if (disabled) {
            break
          }
          bindModel.leftAnchor.isMoving = false
          bindModel.rightAnchor.isMoving = false
          break
        }
        // 单滑块设置
        let sliderProcessStyle = bindModel.sliderProcessStyle
        let reg_g = /width:.*;/g
        let sliderWidthRegResult = sliderProcessStyle.match(reg_g)[0]
        let sliderWidth = Number(sliderWidthRegResult.match(/\d+/g)[0])
        this.setData({
          currentSliderWidth: sliderWidth,
          bindModel: bindModel,
        })
      } while (DO_WHILE_FALSE)
      this.triggerEvent('onChange', bindModel, bindModel)
    },
    // endregion
  },
})
