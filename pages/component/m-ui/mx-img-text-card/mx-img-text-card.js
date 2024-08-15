// m-ui/m-img-text-card/m-img-text-card.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: '',
    },
    name: {
      type: String,
      value: '',
    },
    imgSrc: {
      type: String,
      value: '',
    },
    // 无背景图片 缺省图
    bgImg: {
      type: String,
      value: 'https://www.smartmidea.net/projects/sit/meiju-finclip-assets/mainContent/images/zwt-img.png',
    },
    direction: {
      type: Boolean,
      value: true,
    },
    // 图片懒加载
    lazyLoad: {
      type: Boolean,
      value: true,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    // bgImg:'https://www.smartmidea.net/projects/sit/meiju-finclip-assets/mainContent/images/zwt-img.png'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    cardClicked(e) {
      let obj = e.currentTarget.dataset
      this.triggerEvent('onImgTextClicked', obj, {})
    },
    loadImgError() {
      this.setData({
        imgSrc: 'https://www.smartmidea.net/projects/sit/meiju-finclip-assets/mainContent/images/zwt-img.png',
      })
    },
  },
})
