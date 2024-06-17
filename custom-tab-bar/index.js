const app = getApp() //获取应用实例
import { formatTime, getStamp } from 'm-utilsdk/index'
import { judgeWayToMiniProgram } from '../utils/util'

import { rangersBurialPoint } from '../utils/requestService'

Component({
  data: {
    isShow: true,
    selected: 0,
    color: '#8A8A8F',
    selectedColor: '#000000',
    isSwitchedTab: false,
    list: [
      {
        pagePath: '/pages/index/index',
        iconPath: '/assets/img/tab/tab_ic_home@2x.png',
        selectedIconPath: '/assets/img/tab/tab_ic_home_select@2x.png',
        text: '首页',
        page_name: '小程序首页',
      },
      {
        pagePath: '/pages/midea-service/midea-service',
        iconPath: '/assets/img/tab/tab_ic_service@2x.png',
        selectedIconPath: '/assets/img/tab/tab_ic_service_select@2x.png',
        text: '服务',
        page_name: '服务中心首页',
      },
      {
        pagePath: '/pages/mytab/mytab',
        iconPath: '/assets/img/tab/tab_ic_me@2x.png',
        selectedIconPath: '/assets/img/tab/tab_ic_me_select@2x.png',
        text: '我的',
        page_name: '个人中心',
      },
    ],
  },
  attached() {},
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      const currentUid =
        app.globalData.userData && app.globalData.userData.uid && app.globalData.isLogon
          ? app.globalData.userData.uid
          : ''
      const randam = getStamp()
      this.data.isSwitchedTab = true
      this.trackTab(data)
      if (url == '/pages/shopping/shopping') {
        let appId = 'wx255b67a1403adbc2'
        let path = 'page/index2/index2'
        let extra = {
          jp_source: 3,
          jp_c4a_uid: currentUid,
          jp_rand: randam,
        }
        judgeWayToMiniProgram(appId, path, extra)
        this.clickBurdPoint('shopping_tab')
      } else {
        wx.switchTab({ url })
        if (url == '/pages/index/index') {
          this.clickBurdPoint('device_tab')
        } else if (url == '/pages/mytab/mytab') {
          this.clickBurdPoint('mytab_tab')
        }
      }
    },
    trackTab(data) {
      const index = data.index
      const obj = this.data.list[index]
      rangersBurialPoint('user_behavior_event', {
        page_id: 'page_bottom_tab',
        page_name: obj.page_name,
        module: '公共',
        // ...commonParams,
        // module: hasKey(selectParams, 'module') ? selectParams["module"] : '首页',
        page_path: obj.pagePath,
        widget_id: 'switch_tab',
        widget_name: '底部tab切换',
        page_module: '',
        ramk: '',
        object_type: 'tab',
        object_id: index,
        object_name: obj.text,
        ext_info: '',
        open_id: app.globalData.openId || '',
      })
    },
    /**
     * 点击事件埋点
     */
    clickBurdPoint(clickType) {
      // wx.reportAnalytics('count_click_list', {
      // click_type: clickType,
      // click_time: formatTime(new Date()),
      // })
    },
  },
})
