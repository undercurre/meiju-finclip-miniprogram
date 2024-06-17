/*
 * @Description: 扫码错误提示
 * @Author: 朱承财
 * @Date: 2022-04-13 14:51:19
 * @LastEditTime: 2022-04-25 17:11:54
 */
import { imgBaseUrl } from '../../../../api'
Component({
  properties: {
    isShow: {
      type: Boolean,
      value: false,
    },
  },
  data: {
    imgBaseUrl: imgBaseUrl.url,
    upImg: '/virtual-plugin/images/ic_up@3x.png',
    downImg: '/virtual-plugin/images/ic_down@3x.png',
    codeList: [
      {
        name: '例1-产品表面',
        icon: '/virtual-plugin/images/img_eg1-up@3x.png',
      },
      {
        name: '例2-机器底部',
        icon: '/virtual-plugin/images/img_eg2-up@3x.png',
      },
      {
        name: '例3-外包装箱',
        icon: '/virtual-plugin/images/img_eg3-up@3x.png',
      },
      {
        name: '例1-国家商品69条码',
        icon: '/virtual-plugin/images/img_eg1-down@3x.png',
      },
      {
        name: '例2-能源二维码',
        icon: '/virtual-plugin/images/img_eg2-down@3x.png',
      },
      {
        name: '例3-美的服务二维码',
        icon: '/virtual-plugin/images/img_eg3-down@3x.png',
      },
    ],
  },
  lifetimes: {
    // 在组件实例进入页面节点树时执行
    attached() {},
    detached() {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  //方法定义
  methods: {
    /*
     * isShow做取反操作
     * */
    toChange: function () {
      let that = this
      that.setData({
        isShow: !that.data.isShow,
      })
    },
  },
})
