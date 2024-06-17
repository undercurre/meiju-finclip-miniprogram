import { deviceImgApi, baseImgApi } from '../../../api'
Component({
  properties: {
    productList: {
      type: Array,
      value: [],
    },
    isShowProductDialog: {
      type: Boolean,
      value: false,
      observer(val) {
        console.log('设备列表弹窗1', val)
        this.getShowStatus(val)
      },
    },
  },
  options: {
    addGlobalClass: true,
  },
  data: {
    isProduct: false,
    round: true,
    deviceImgApi: deviceImgApi,
    useLoadingSlot: true,
    useErrorSlot: true,
    bgImg: '',
    baseImgUrl: baseImgApi.url,
  },
  methods: {
    //隐藏弹框
    confirmPopup: function () {
      this.setData({
        isProduct: false,
      })
      this.triggerEvent('closeDeviceDialog')
    },
    //展示弹框
    showPopup() {
      this.setData({
        isProduct: true,
      })
    },
    makeSure() {
      //触发成功回调
      this.triggerEvent('close')
    },
    getShowStatus(val) {
      console.log('设备列表弹窗', val)
      this.setData({
        isProduct: val,
      })
      this.triggerEvent('devicesListDialog', val)
    },
    goNetwork(e) {
      const item = e.currentTarget.dataset.item
      console.log('99999999999', e)
      this.triggerEvent('goNetwork', item)
    },
    bindInerror(e) {
      let index = e.currentTarget.dataset.index
      let productList = this.properties.productList
      productList[index].deviceImg = this.data.baseImgUrl + 'dms_img_lack@3x.png'
      this.setData({
        productList: productList,
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
