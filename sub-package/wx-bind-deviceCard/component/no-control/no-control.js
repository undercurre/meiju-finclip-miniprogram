import { baseImgApi } from '../../../../api'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    baseImgUrl: baseImgApi.url + 'img_no_equipment@2x.png',
    title: '未发现该设备',
    desText1: '设备不存在或无权限控制设备',
    desText2: '请重新添加后再试~',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //返回app错误回调
    launchAppError(e) {
      wx.showToast({
        title: '未找到美居App，\r\n请确认您的手机是否安装。',
        icon: 'none',
        duration: 2000,
      })
      setTimeout(() => {
        wx.navigateTo({
          url: '/pages/download/download',
        })
      }, 2000)
    },
  },
})
