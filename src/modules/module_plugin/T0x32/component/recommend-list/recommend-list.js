import { imageDomain, recipeApi } from '../../assets/scripts/api'
import { Format } from '../../assets/scripts/format'
Component({
  options: {
    multipleSlots: true,
  },
  properties: {
    deviceInfo: {
      type: Object,
      value: {},
    },
  },
  data: {
    iconUrl: {
      arrow: imageDomain + '/0xE7/icon-arrow-r.png',
    },
    recommendRecipeList: [],
  },
  attached() {
    // 获取食谱
    console.log('设备信息', this.properties.deviceInfo)
    this.getRecipeList()
  },
  methods: {
    // 点击事件
    onClickEvent(event) {
      console.log('点击事件: ', event)
      let model = event.currentTarget.dataset
      let eventType = event.currentTarget.dataset.type
      const deviceInfo = this.properties.deviceInfo
      switch (eventType) {
        case 'all':
          // 查看全部
          wx.navigateTo({
            url:
              '../sda-cloud-menu/pages/list/list' +
              Format.jsonToParam({
                applianceType: deviceInfo.type,
                modelNo: deviceInfo.sn8,
                applianceId: deviceInfo.applianceCode,
              }),
          })
          break
        case 'menu':
          let menuData = model.item
          // 点击菜单
          wx.navigateTo({
            url:
              '../sda-cloud-menu/pages/detail/detail' +
              Format.jsonToParam({
                id: menuData.recipeCode,
                applianceType: deviceInfo.type,
                modelNo: deviceInfo.sn8,
                applianceId: deviceInfo.applianceCode,
              }),
          })
          break
      }
    },
    // 获取推荐食谱(最新食谱)
    getRecipeList() {
      return new Promise((resolve, reject) => {
        recipeApi
          .getRecipeList({
            deviceInfo: this.properties.deviceInfo,
            pageIndex: 1,
            pageSize: 4,
          })
          .then((res) => {
            console.log('获取推荐食谱 完成: ', res)
            if (!res.data.errorCode && res.data.result) {
              let rtnData = JSON.parse(res.data.result.returnData)
              console.log('获取推荐食谱解析 完成: ', rtnData)
              let recipeList = rtnData.data?.data
              if (recipeList && recipeList.length > 0) {
                this.setData({
                  recommendRecipeList: recipeList,
                })
              }
            }
          })
          .catch((err) => {})
      })
    },
  },
})
