const computed = require('../../../../utils/miniprogram-computed')

Component({
  behaviors: [computed],

  computed: {
    inKeep() {
      if (!this.properties.status.airswitch) return false
      let airswitch = this.properties.status.airswitch
      let air_left_hour = this.properties.status.air_left_hour
      let inkeep = airswitch != 0 && air_left_hour > 0 ? true : false
      return inkeep
    },
    curStep() {
      let curStep = '待机中'
      if (this.properties.deviceStatus == 3) {
        curStep = this.properties.curMode ? this.properties.curMode.name || '待机中' : '待机中'
      } else if (this.properties.deviceStatus == 2) {
        curStep = '预约中'
      } else if (this.properties.deviceStatus == 5) {
        curStep = this.properties.keepAndDryName.keep.name + '中' || '保管中'
      } else if (this.properties.deviceStatus == 6) {
        curStep = this.properties.keepAndDryName.dry.name + '中' || '烘干中'
      } else if (this.properties.deviceStatus == 0 && this.properties.inKeep) {
        curStep = this.properties.keepAndDryName.keep.name + '中' || '保管中'
      } else if (this.properties.deviceStatus == 12) {
        curStep = '云洗涤'
      }
      return curStep
    },
    currentStatus() {
      return this.properties.status.wash_stage
    },
    deviceStatus() {
      return this.properties.deviceStatus
    },
    statusArray() {
      if (!this.properties.curMode) {
        return []
      } else if (!this.properties.curMode.step) {
        return []
      } else {
        return this.properties.curMode.step.list || []
      }
    },
    dryStopTip() {
      let timeStamp = new Date().getTime()
      let endTime = timeStamp + this.properties.status.left_time * 60 * 1000
      let date = new Date(endTime)
      let year = date.getFullYear()
      let month = date.getMonth() + 1 >= 10 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)
      let day = date.getDate() >= 10 ? date.getDate() : '0' + date.getDate()
      let hour = date.getHours()
      return year + '-' + month + '-' + day + ' ' + hour + '时左右'
    },
    keepStopTip() {
      if (!this.properties.status || !this.properties.status.air_left_hour) return ''
      let timeStamp = new Date().getTime()
      let endTime = timeStamp + this.properties.status.air_left_hour * 60 * 60 * 1000
      let date = new Date(endTime)
      let year = date.getFullYear()
      let month = date.getMonth() + 1 >= 10 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)
      let day = date.getDate() >= 10 ? date.getDate() : '0' + date.getDate()
      let hour = date.getHours()
      return year + '-' + month + '-' + day + ' ' + hour + '时左右'
    },
  },
  /**
   * 组件的属性列表
   */
  properties: {
    deviceStatus: {
      type: Number,
      value: 0,
    },
    status: {
      type: Object,
    },
    curMode: {
      type: Object,
    },
    keepAndDryName: {
      type: Object,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    currentStatus: 0,
    deviceStatus: 0,
    statusArray: [],
    color: '',
    showSillence: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getTipTime(time) {
      let timeStamp = new Date().getTime()
      let endTime = timeStamp + time
      let date = new Date(endTime)
      let year = date.getFullYear()
      let month = date.getMonth() + 1 >= 10 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)
      let day = date.getDate() >= 10 ? date.getDate() : '0' + date.getDate()
      let hour = date.getHours()
      return year + '-' + month + '-' + day + ' ' + hour + '时左右'
    },
  },

  attached() {
    this.data.currentStatus = this.properties.currentStatus
    this.data.deviceStatus = this.properties.deviceStatus
    this.data.statusArray = this.properties.statusArray.step ? this.properties.statusArray.step.list || [] : []
  },
})
