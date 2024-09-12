/*
 * @desc:
 * @author: zhucc22
 * @Date: 2024-07-09 16:49:32
 */
const app = getApp() //获取应用实例
import { formatTime, getStamp } from 'm-utilsdk/index'
import { judgeWayToMiniProgram } from '../utils/util'
import { rangersBurialPoint } from '../utils/requestService'
import { imgBaseUrl } from '../api'
const tabIndexImg = imgBaseUrl.url + '/harmonyos/josn/icon_tab_home'
const tabmineImg = imgBaseUrl.url + '/harmonyos/josn/icon_tab_me'
Component({
  data: {
    tabIndexImg,
    tabmineImg,
    isShow: true,
    selected: app.globalData.selectTab,
    color: '#8A8A8F',
    selectedColor: '#000000',
    isSwitchedTab: false,
    play: 'play',
    stop: 'stop',
    list: [
      {
        pagePath: '/pages/index/index',
        iconPath: '/assets/img/tab/tab_index.png',
        selectedIconPath: '/assets/img/tab/tab_index_selected.png',
        icon: imgBaseUrl.url + '/harmonyos/json/icon_tab_home.json',
        selectedIcon: imgBaseUrl.url + '/harmonyos/json/icon_tab_home_selected.json',
        unselectedIcon: imgBaseUrl.url + '/harmonyos/json/icon_tab_home_unselected.json',
        text: '首页',
        page_name: '首页',
      },
      // {
      // pagePath: '/pages/midea-service/midea-service',
      // iconPath: '/assets/img/tab/tab_ic_service@2x.png',
      // selectedIconPath: '/assets/img/tab/tab_ic_service_select@2x.png',
      // text: '服务',
      // page_name: '服务中心首页',
      // },
      {
        pagePath: '/pages/mytab/mytab',
        iconPath: '/assets/img/tab/tab_mime.png',
        selectedIconPath: '/assets/img/tab/tab_mime_selected.png',
        icon: imgBaseUrl.url + '/harmonyos/json/icon_tab_me.json',
        selectedIcon: imgBaseUrl.url + '/harmonyos/json/icon_tab_me_selected.json',
        unselectedIcon: imgBaseUrl.url + '/harmonyos/json/icon_tab_me_unselected.json',
        text: '我的',
        page_name: '我的',
      },
    ],
  },
  created() {
    // this.setData({
    // selected: app.globalData.selectTab,
    // })
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      this.data.isSwitchedTab = true
      this.trackTab(data)
      wx.switchTab({ url })
    },
    trackTab(data) {
      console.log('-----data--------->', data)
      rangersBurialPoint('user_behavior_event', {
        home_tab: data.name,
        module: '公共',
        page_module: '底部tab',
        widget_id: 'click_tab_item',
        object_name: data.name,
      })
    },
  },
})
