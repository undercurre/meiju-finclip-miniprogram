Component({
  properties: {
    productList: {
      type: Array,
      value: [
        {
          name: '测试中1',
          src: 'https://www.smartmidea.net/projects/sit/meiju-finclip-assets/actTemp/images/new-reward-img.png',
        },
        {
          name: '测试中2',
          src: 'https://www.smartmidea.net/projects/sit/meiju-finclip-assets/actTemp/images/new-reward-img.png',
        },
      ],
    },
  },
  options: {
    addGlobalClass: true,
  },
  data: {
    show: true,
    round: true,
    scrollX: true,
  },
  methods: {
    //隐藏弹框
    confirmPopup: function () {
      this.setData({
        show: false,
      })
    },
    //展示弹框
    showPopup() {
      this.setData({
        show: true,
      })
    },
    makeSure() {
      //触发成功回调
      this.triggerEvent('close')
    },
    closeSwiperDialog() {
      console.log('MMMMMMMMM')
      this.setData({
        show: false,
      })
    },
  },
  /*组件生命周期*/
  lifetimes: {
    created() {},
    attached() {},
    ready() {},
    moved() {},
    detached() {},
    error() {},
    /*组件所在页面的生命周期 */
    pageLifetimes: {
      show: function () {
        // 页面被展示
        console.log('页面被展示')
      },
      hide: function () {
        // 页面被隐藏
        console.log('页面被隐藏')
      },
      resize: function () {
        // 页面尺寸变化
        console.log('页面尺寸变化')
      },
    },
  },
})
