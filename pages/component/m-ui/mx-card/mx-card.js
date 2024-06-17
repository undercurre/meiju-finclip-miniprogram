// m-ui/m-card/m-card.js
Component({
  options: {
    multipleSlots: true, // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: '',
    },
    subTitle: {
      type: String,
      value: '',
    },
    imgSrc: {
      type: String,
      value: '../../assets/image/about_ic_github@2x.png',
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    list: [],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    cardClicked() {
      // console.log("card clicked...")
      this.triggerEvent('onCardClicked', {}, {})
    },
    imgClicked() {
      // console.log("card img clicked...")
      this.triggerEvent('onImgClicked', {}, {})
    },
  },
})
