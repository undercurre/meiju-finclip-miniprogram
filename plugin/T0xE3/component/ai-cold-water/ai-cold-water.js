import computedBehavior from '../../../../utils/miniprogram-computed'
import images from '../../assets/js/img'
import { requestService } from '../../../../utils/requestService'
import { templateIds } from '../../../../globalCommon/js/templateIds'
// import { openSubscribe } from '../../assets/js/openSubscribe'
Component({
  behaviors: [computedBehavior],
  properties: {
    status: {
      type: Object,
      value: {},
    },
    setting: {
      type: Object,
      value: {},
    },
    applianceData: {
      type: Object,
      value: {},
    },
    cellStyle: {
      type: String,
      value: 'cell',
    },
    border: {
      type: Boolean,
      value: true,
    },
    iconColor: {
      type: String,
      value: '',
    },
    title: {
      type: String,
      value: '',
    },
    desc: {
      type: String,
      value: '',
    },
    disabled: {
      type: Boolean,
      value: false,
    },
    deviceStatus: {
      type: Number,
      value: 0,
    },
  },
  data: {
    images,
    isOn: false,
  },
  computed: {},
  lifetimes: {
    attached() {
      this.getAIColdWaterSwitch()
    },
  },
  pageLifetimes: {
    show: function () {
      this.getAIColdWaterSwitch()
    },
  },
  methods: {
    // 获取AI定时零冷水开关状态
    getAIColdWaterSwitch() {
      const params = {
        msg: 'aiZeroColdWaterSwitchPlus',
        params: {
          applianceId: this.properties.applianceData.applianceCode,
          sn8: this.data.applianceData.sn8,
          action: 'get',
          switch: 1,
          mode: 0,
        },
      }
      requestService
        .request('e3', params)
        .then((resp) => {
          if (resp.data.retCode == '0') {
            //判断本地零冷水是否有开启的，若有开启的设置AI零冷水总开关为开启
            this.setData({ isOn: resp.data.result.switch == 0 ? false : true })
          }
        })
        .catch((e) => {
          wx.hideLoading()
          wx.showToast({
            title: JSON.stringify(e),
            icon: 'none',
          })
        })
    },
    onCellClick() {
      if (this.data.deviceStatus > 5) return
      // openSubscribe(this.properties.applianceData, templateIds[25][0])
      const { disabled, applianceData, setting, status, iconColor } = this.properties
      if (disabled) return
      wx.navigateTo({
        url: `../ai-cold-water/ai-cold-water`,
        success: function (res) {
          // 通过eventChannel向被打开页面传送数据
          res.eventChannel.emit('aiColdWater', {
            applianceData: applianceData,
            setting: setting,
            status: status,
            iconColor: iconColor,
          })
        },
      })
    },
  },
})
