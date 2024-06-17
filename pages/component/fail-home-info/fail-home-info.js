import { baseImgApi } from '../../../api'
Component({
  // 属性定义（详情参见下文）
  properties: {},
  observers: {},
  ready: function () {},
  data: {
    imgNoHome: baseImgApi.url + 'img_no_home.png',
  },
  methods: {
    initHomeInfo() {
      this.triggerEvent('initHomeInfo')
    },
  },
})
