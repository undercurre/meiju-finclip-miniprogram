import { actTemplateImgApi } from '../../../../../api.js'
import { dialogText } from '../../containerCommon.js'
Component({
  behaviors: [],
  // 属性定义（详情参见下文）
  properties: {
    myProperty: {
      // 属性名
      type: String,
      value: '',
    },
    listItem: {
      type: Object,
      value: {},
      observer(newVal) {
        if (!newVal.prizeType) {
          newVal.prizeType = newVal.type
        }
      },
    },
    basicList: {
      type: Object,
      value: [],
    },
  },

  data: {
    imgUrl: actTemplateImgApi.url,
    flag: false,
  }, // 私有数据，可用于模板渲染

  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {},
    moved: function () {},
    detached: function () {},
  },

  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  attached: function () {}, // 此处attached的声明会被lifetimes字段中的声明覆盖
  ready: function () {},

  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () {},
    hide: function () {},
    resize: function () {},
  },
  methods: {
    actionViewCard(e) {
      let item = e.currentTarget.dataset.item
      item['targetUrl'] = e.currentTarget.dataset.targeturl || ''
      item['basicItem'] = e.currentTarget.dataset.basicitem || {}
      this.triggerEvent('actionViewCard', item)
    },
    actionViewHelp(e) {
      const item = e.currentTarget.dataset.item
      this.triggerEvent('actionViewHelp', item)
    },
    actionLaunchApp(e) {
      const item = e.currentTarget.dataset.item
      let params = {
        basicItem: item,
        content: dialogText.toApp,
        nameList: [dialogText.iKnow, dialogText.buttonToApp],
      }
      this.triggerEvent('actionLaunchAppDialog', params)
    },
    actionGoLogistics(e) {
      const item = e.currentTarget.dataset.item
      this.triggerEvent('actionGoLogistics', item)
    },
    //虚拟券领取后实物奖励和虚拟券奖励都使用此方法
    actionReceive(e) {
      let item = e.currentTarget.dataset.item
      item['targetUrl'] = e.currentTarget.dataset.targeturl || ''
      item['basicItem'] = e.currentTarget.dataset.basicitem || {}
      item['awardsInfo'] = this.data.listItem || {}
      item['from'] = 'reward-list'
      this.triggerEvent('activityTrack', e.currentTarget.dataset.basicitem)
      this.triggerEvent('actionReceive', item)
    },
    actionCheckCharge(e) {
      let item = e.currentTarget.dataset.item
      item['targetUrl'] = e.currentTarget.dataset.targeturl || ''
      item['basicItem'] = e.currentTarget.dataset.basicitem || {}
      item['awardsInfo'] = this.data.listItem || {}
      item['from'] = 'reward-list'
      this.triggerEvent('activityTrack', e.currentTarget.dataset.basicitem)
      this.triggerEvent('actionCheckCharge', item)
    },
  },
})
