import computedBehavior from '../../../../utils/miniprogram-computed'
import images from '../../assets/js/img'

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
  },
  computed: {
    checked() {
      const { status, setting } = this.properties
      if (setting.controlFunc) {
        const isOldColdWater = setting.controlFunc.some((item) => item == 'coldWater')
        //兼容老品
        if (isOldColdWater) {
          return status.cold_water == 'on'
        } else {
          return status.cold_water_master == 'on'
        }
      }
    },
  },
  methods: {
    onSwitchChange() {
      if (this.data.deviceStatus > 5) return
      const { status, setting } = this.properties
      let mode
      let params = {}
      const isOldColdWater = setting.controlFunc.some((item) => item == 'coldWater')
      //兼容老品
      if (isOldColdWater) {
        mode = status.cold_water == 'on' ? 'off' : 'on'
        params = { cold_water: mode }
      } else {
        mode = status.cold_water_master == 'on' ? 'off' : 'on'
        params = { cold_water_master: mode }
      }
      if (status.water_volume >= 27 && mode == 'on') {
        wx.showToast({ title: '机器有水流量，无法开启！', icon: 'none' })
        return
      }
      this.triggerEvent('setColdWaterMaster', params)
    },
  },
})
