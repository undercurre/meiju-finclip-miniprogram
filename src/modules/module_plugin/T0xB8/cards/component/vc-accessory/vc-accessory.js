// plugin/T0xB8/cards/component/vc-accessory/vc-accessory.js
let app = getApp()
const environment = app.getGlobalConfig().environment
const IMAGE_SERVER = environment == 'prod' ? 'https://www.smartmidea.net/projects/meiju-lite-assets/plugin/0xB8/' : 'https://www.smartmidea.net/projects/sit/meiju-lite-assets/plugin/0xB8/'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    statusText: {
      type: String,
      value: "正常"
    },
    isShowUnit: {
      type: Boolean,
      value: false
    },
    statusUnit: {
      type: String,
      value: "%"
    },
    accessoryName: {
      type: String,
      value: "配件"
    },
    textColor: {
      type: String,
      value: "#333333"
    },

    

  },

  /**
   * 组件的初始数据
   */
  data: {
    noticeIcon: `${IMAGE_SERVER}notice_icon.svg`
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showDesc() {
      this.triggerEvent("clickCurrentItem")
    }
  }
})
