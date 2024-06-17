// m-ui/m-cell/m-cell.js
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

    leagueTitle: {
      type: String,
      value: '',
    },
    desc: {
      type: String,
      value: '',
    },
    imgSrc: {
      type: String,
      value: '/assets/image/about_ic_github@2x.png',
    },
    hasArrow: {
      type: Boolean,
      value: false,
    },
    rightImg: {
      type: String,
      value: '../assets/icon/arrow.png',
    },
    rightText: {
      type: String,
      value: '',
    },

    // 可选值为all、top、bottom
    borderRadius: {
      type: String,
      value: 'all',
    },
    //3.0新增属性 background-color
    backgroundColor: {
      type: String,
      value: '#FFFFFF',
    },
    //3.0新增属性 border
    showBorder: {
      type: Boolean,
      value: false,
      // value: true
    },
    //3.0新增属性 border-color
    borderColor: {
      type: String,
      value: '#267aff',
      // value: '#ffaa10'
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    // list: [
    //   {
    //     title: "cell",
    //     subTitle: "包含颜色，文本，图标"
    //   },
    // ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // cell
    cellClicked(e) {
      // console.log("cellClicked clicked...e", e)
      let obj = e.currentTarget.dataset
      this.triggerEvent('onCellClicked', obj, {})
    },

    // 右边文字
    rightTextClicked(e) {
      // console.log("rightText clicked...e", e)
      let obj = e.currentTarget.dataset
      this.triggerEvent('onRightTextClicked', obj, {})
    },

    // 右边箭头
    rightImgClicked(e) {
      // console.log("rightImgClicked clicked...e", e)
      let obj = e.currentTarget.dataset
      this.triggerEvent('onRightImgClicked', obj, {})
    },
  },
})
