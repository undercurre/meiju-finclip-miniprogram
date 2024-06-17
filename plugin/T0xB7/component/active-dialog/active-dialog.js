// plugin/T0xB6/activeDialog/active-dialog.js
import { requestService } from '../../../../utils/requestService.js';
import { dateFormat } from 'm-utilsdk/index'
const nowDate = dateFormat(new Date(), "yyyy-MM-dd")
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    type: {
      type: String,
      value: ''
    },
    applianceCode: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    activity: {},
    tipsFlagObj: {}
  },
  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
      let res = wx.getStorageSync('tipsFlag_' + this.properties.applianceCode)
      console.log(res)
      this.setData({
        tipsFlagObj: res || {}
      })
      if (this.data.tipsFlagObj.activityCardClosed && this.data.tipsFlagObj.activityCardClosed == nowDate) {
        return // 直接不请求
      }
      requestService.request('getDeviceActivity', {
          "protype": this.properties.type,
        })
        .then(rs => {
          if (rs.data.desc == 'success') {
            console.log('请求到的活动',this.properties.applianceCode)
            var activityData = rs.data.result
            var newActivityArr = []
            // var nowDate = dateFormat(new Date(), 'yyyy-MM-dd')
            for (var i = 0; i < activityData.length; i++) {
              if (nowDate >= activityData[i].beginDate && nowDate <= activityData[i].endDate && activityData[i]
                .title != '智慧大航海' && (activityData[i].jumpLink.indexOf(
                  'https://kh-content.midea-hotwater.com') == -1)/* && activityData[i].location === 'top'*/) {
                newActivityArr.push(activityData[i])
              }
            }
            if (newActivityArr.length > 0) { // 只有有活动才更新数据，且只显示一个，虽然数据里应该只有一个，但做一下处理
              this.setData({
                activity: newActivityArr[0]
              })
            }
          }
        })
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    clickToWebView(e) {
      var currLink = this.data.activity.jumpLink
      let encodeLink = encodeURIComponent(currLink)
      let currUrl = `../../../pages/webView/webView?webViewUrl=${encodeLink}`
      wx.navigateTo({
        url: currUrl,
      })
    },
    clickToClose () {
      wx.showToast({
        title: '今日将不再显示活动浮窗',
        icon: 'none'
      })
      let tipsFlagObj = Object.assign({}, this.data.tipsFlagObj, {
        activityCardClosed: nowDate
      })
      wx.setStorageSync('tipsFlag_' + this.properties.applianceCode, tipsFlagObj)
      this.setData({
        tipsFlagObj,
        activity: {}
      })
    }

  }
})
