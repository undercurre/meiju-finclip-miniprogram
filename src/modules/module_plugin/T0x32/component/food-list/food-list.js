import MideaToast from '../../component/midea-toast/toast'
import { judgeWayToMiniProgram } from 'm-miniCommonSDK/index'
Component({
  options: {
    multipleSlots: true,
  },
  properties: {
    prefabMenu: {
      type: Array,
      value: [],
    },
    deviceInfo: {
      type: Object,
      value: {},
      observer: function () {
        this.updatePage()
      },
    },
    iconUrl: {
      type: Object,
      value: {},
    },
  },
  data: {
    btnClass: '',
  },
  methods: {
    updatePage() {
      let deviceInfo = this.properties.deviceInfo
      if (deviceInfo) {
        // 错误状态
        if (deviceInfo.isError || !deviceInfo.isOnline) {
          this.setData({
            btnClass: 'btn-disabled',
          })
          return
        }
        this.setData({
          btnClass: '',
        })
      }
    },
    goToBuy(e) {
      const curItem = this.properties.prefabMenu[e.currentTarget.id.split('.')[1]]
      // const app = getApp()
      // console.log(app, 222222222222222222222)
      let appId = 'wx255b67a1403adbc2'
      const getUrl = curItem?.settings.find((item) => item.apiKey == 'workStatus')?.properties?.buyLink
      const itemIdArr = getUrl.split('=')
      const itemId = itemIdArr[itemIdArr.length - 1]

      if (itemId) {
        const url = '/page/detail/detail?type=&itemid=' + itemId
        judgeWayToMiniProgram(appId, url)
      } else {
        MideaToast('缺少购买链接')
      }
    },
    startCook(e) {
      const curItem = this.properties.prefabMenu[e.currentTarget.id.split('.')[1]]
      this.triggerEvent('startCook', curItem)
    },
    checkHasBuyLink(val) {
      return val?.settings.find((item) => item.apiKey == 'workStatus')?.properties?.buyLink
    },
  },
})
