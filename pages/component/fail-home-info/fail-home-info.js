/*
 * @desc: 
 * @author: zhucc22
 * @Date: 2024-06-17 16:59:38
 */
import { baseImgApi } from '../../../api'
Component({
  // 属性定义（详情参见下文）
  properties: {},
  observers: {},
  ready: function () {},
  data: {
    //imgNoHome: baseImgApi.url + 'img_no_home.png',
    imgNoHome: '/assets/img/img_no_home.png',
  },
  methods: {
    initHomeInfo() {
      this.triggerEvent('initHomeInfo')
    },
  },
})
