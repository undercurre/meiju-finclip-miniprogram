/* eslint-disable no-unused-vars */
const { environment } = require('../../../../api')
import computedBehavior from '../../../../utils/miniprogram-computed.js'

Component({
  behaviors: [computedBehavior],
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    dataSource: {
      type: Object,
      default: () => ({}),
    },
    notUsedList: {
      type: Object,
      default: () => ({}),
    },
    expiredList: {
      type: Object,
      default: () => ({}),
    },
    usedList: {
      type: Object,
      default: () => ({}),
    },
  },
  data: {
    // 这里是一些组件内部数据
    contractLists: [],
  },
  computed: {
    contractLists(data) {
      let resultList = []
      if (this.data.dataSource && this.data.dataSource.notUsedList && this.data.dataSource.notUsedList.length) {
        let startDate = this.data.dataSource.startDate
        let endDate = this.data.dataSource.endDate
        for (let i = 0; i < this.data.dataSource.notUsedList.length; i++) {
          let item = this.data.dataSource.notUsedList[i]
          item.type = 'notUsed'
          item.title = '延保卡'
          item.dateRange = '有效期限: ' + startDate + ' ~ ' + item.expireDate
          item.statusDesc = '未使用'
          resultList.push(item)
        }
      }
      if (this.data.dataSource && this.data.dataSource.usedList && this.data.dataSource.usedList.length) {
        let startDate = this.data.dataSource.startDate
        let endDate = this.data.dataSource.endDate
        for (let i = 0; i < this.data.dataSource.usedList.length; i++) {
          let item = this.data.dataSource.usedList[i]
          item.type = 'used'
          item.title = '延保卡'
          item.dateRange = '有效期限: ' + startDate + ' ~ ' + item.expireDate
          item.statusDesc = '已使用'
          resultList.push(item)
        }
      }
      if (this.data.dataSource && this.data.dataSource.expiredList && this.data.dataSource.expiredList.length) {
        let startDate = this.data.dataSource.startDate
        let endDate = this.data.dataSource.endDate
        for (let i = 0; i < this.data.dataSource.expiredList.length; i++) {
          let item = this.data.dataSource.expiredList[i]
          item.type = 'expired'
          item.title = '延保卡'
          item.dateRange = '有效期限: ' + startDate + ' ~ ' + item.expireDate
          item.statusDesc = '已过期'
          resultList.push(item)
        }
      }
      return resultList
    },
  },
  methods: {
    gotoInsuranceDesc(event) {
      console.log('goto page InsuranceDesc')
      wx.navigateTo({
        url: '../insurance-regulations/insurance-regulations',
      })
    },
  },
})
