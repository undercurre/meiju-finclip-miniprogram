Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    imgList: {
      type: Object,
      value: {},
    },
    triangleImgList: {
      type: Object,
      value: {
        on: '/pages/component/mbutton-plus/assets/img/img_blue-check@3x.png',
        off: '/pages/component/mbutton-plus/assets/img/img_icon@3x.png',
        disabled: '/pages/component/mbutton-plus/assets/img/img_gray-unchecked@3x.png',
      },
    },
    mode: {
      type: String,
      value: '',
      observer: function (mode) {
        this.setData({
          'localData.mainImg': this.properties.imgList[mode] || '',
        })
      },
    },
    triangleMode: {
      type: String,
      value: '',
      observer: function (mode) {
        this.setData({
          'localData.triangleImg': this.properties.triangleImgList[mode] || '',
        })
      },
    },
    desc: {
      type: String,
      value: '',
      observer: function (desc) {
        this.setData({
          'localData.desc': desc,
        })
      },
    },
    descStyle: {
      type: Object,
      value: function () {
        return {}
      },
      observer: function (descStyle) {
        this.setData({
          'localData.descStyle': descStyle,
        })
      },
    },
    mainImgSize: {
      type: String,
      value: '',
    },
    hasCover: {
      type: Boolean,
      value: true,
    },
    disabled: {
      type: Boolean,
      value: false,
    },
  },
  data: {
    // 这里是一些组件内部数据
    showCover: false,
    localData: {},
  },
  methods: {
    buttonTap() {
      if (this.properties.disabled) return false
      this.triggerEvent('buttonTap')
    },
  },
  attached() {
    this.setData({
      localData: {
        mainImg: this.data.imgList[this.data.mode] || '',
        triangleImg: this.data.triangleImgList[this.data.triangleMode] || '',
        descStyle: this.data.descStyle,
        desc: this.data.desc,
      },
    })
  },
})
