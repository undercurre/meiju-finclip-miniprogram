import { baseImgApi } from '../../../api'
Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    isShow: {
      type: Boolean,
      value: false,
    },
  },
  options: {
    addGlobalClass: true,
  },
  data: {
    // 这里是一些组件内部数据
    buttons: [
      {
        text: '重置设备',
      },
      {
        text: '申请加入',
      },
    ],
    baseImgUrl: baseImgApi.url,
  },
  methods: {
    resetDevice() {
      this.triggerEvent('resetDevice')
    },
    applyJoin() {
      this.triggerEvent('applyJoin')
    },
    closeDialog() {
      this.triggerEvent('closeDialog')
    },
  },
  /*组件生命周期*/
  lifetimes: {
    created() {},
    attached() {},
    ready() {
      console.log('在组件在视图层布局完成后执行')
    },
    moved() {
      console.log('在组件实例被移动到节点树另一个位置时执行')
    },
    detached() {
      console.log('在组件实例被从页面节点树移除时执行')
    },
    error() {
      console.log('每当组件方法抛出错误时执行')
    },
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
