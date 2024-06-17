/* eslint-disable no-unused-vars */
const app = getApp()
const { environment } = require('../../../../api')
import { openSubscribeModal } from '../../../../globalCommon/js/deviceSubscribe.js'
import { modelIds, templateIds } from '../../../../globalCommon/js/templateIds.js'
import { getStamp } from 'm-utilsdk/index'
import { judgeWayToMiniProgram } from '../../../../utils/util.js'
Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    title: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
    desc: {
      type: String,
      default: '',
    },
    imageTest: {
      type: String,
      default: '',
    },
    activitys: {
      type: Object,
      default: () => ({}),
    },
    applianceData: {
      type: Object,
      default: () => ({}),
    },
  },
  data: {
    // 这里是一些组件内部数据
  },
  methods: {
    gotoMiniprogramLiquid() {
      const currentUid =
        app.globalData.userData && app.globalData.userData.uid && app.globalData.isLogon
          ? app.globalData.userData.uid
          : ''
      const randam = getStamp()
      let appId = 'wx255b67a1403adbc2'
      let path = '/subpackage/page/search/search_sku/search_sku?scene=6&keyword=洗衣液&mtag=10087.10.7'
      let extra = {
        jp_source: 3,
        jp_c4a_uid: currentUid,
        jp_rand: randam,
      }
      judgeWayToMiniProgram(appId, path, extra, this.data.shangchen__envVersion)
    },
    activityClick(event) {
      if (!this.data.activitys) {
        return
      }
      for (let i = 0; i < this.data.activitys.length; i++) {
        let active = this.data.activitys[i]
        if (
          event.currentTarget.id === active.name &&
          active.name === '延保服务' &&
          active.activityId &&
          active.hide !== true
        ) {
          try {
            wx.setStorageSync('washer_activity_insurance', active)
          } catch (e) {
            console.log('\n\n\nError wx.setStorageSync : ' + JSON.stringify(e))
          }
          wx.navigateTo({
            url: '../pages/insurance-card/insurance-card',
          })
          return
        } else if (active.hide !== true && event.currentTarget.id === active.name) {
          if (active.name === 'xiyiye') {
            if (this.data.applianceData.isAutoInput === true) {
              openSubscribeModal(
                modelIds[9],
                this.data.applianceData.name,
                this.data.applianceData.sn,
                [templateIds[22][0],templateIds[8][0]],
                this.data.applianceData.sn8,
                this.data.applianceData.type,
                this.data.applianceData.applianceCode
              )
            }
            this.gotoMiniprogramLiquid()
          }
        }
      }
    },
  },
})
