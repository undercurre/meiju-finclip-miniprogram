import { baseImgApi } from '../../../../api'
import { getFullPageUrl, checkFamilyPermission } from '../../../../utils/util.js'
import { clickEventTracking } from '../../../../track/track.js'
import { indexHomerGroupListViewBurialPoint, clickFamilyManagement } from '../../assets/js/burialPoint'
const addSelect = '/assets/img/index/add_select.png'
const addNoSelect = '/assets/img/index/add_no_select.png'
const addDevice = '/assets/img/index/add_device.png'
const addScan = '/assets/img/index/add_scan.png'
import Toast from 'm-ui/mx-toast/toast'
import { homeManage, homeDetail } from '../../../../utils/paths.js'
const app = getApp()
Component({
  behaviors: [],

  // 属性定义（详情参见下文）
  properties: {
    homeList: {
      type: Array,
      observer: function (val) {
        const homePickerHeight = val.length > 5 ? '600rpx' : val.length * 96 + 80 + 'rpx' // 家庭管理弹窗高度
        this.data.homePickerHeight = homePickerHeight
        // this.loopHomeGrounpListForRedDot(val)
      },
    },
    currentHomeGroupIndex: {
      type: Number,
    },
    currentHomeGroupId: {
      type: String,
    },
    currentHomeInfo: {
      type: Object,
      observer: function (val) {
        this.checkFamilyPermission(val) // 校验家庭权限
      },
    },
  },

  data: {
    addSelect,
    addNoSelect,
    addDevice,
    addScan,
    addSelectIcon: '',
    baseImgUrl: baseImgApi.url,
    uid: null,
    showAddList: false,
    showHomeList: false,
    hasFamilyPermission: true, //添加按钮权限
    homeManageClicked: false,
    addManageClicked: false,
    homePickerHeight: 0,
    homePickerAnimation: null,
    iconTriangleAnimation: null,
    homePickerAnimationData: {},
    iconTriangleAnimationData: {},
    addPickerAnimation: null,
    addPickerAnimationData: {},
    selectIcon: baseImgApi.url + 'home_ic_done.png',
    addWidth: '238rpx',
    addHeight: '153rpx',
    ownHomeNum: null,
  }, // 私有数据，可用于模板渲染

  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {
      this.data.uid = app.globalData.userData.uid
      this.checkFamilyPermission(this.data.currentHomeInfo) // 校验家庭权限
      this.createAnimationData()
    },
    moved: function () {},
    detached: function () {},
  },

  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () {
      this.checkFamilyPermission(this.data.currentHomeInfo) // 校验家庭权限
    },
    hide: function () {
      if (this.data.showHomeList) {
        this.switchShowHomeList()
      }
    },
    resize: function () {},
  },

  methods: {
    //家庭权限
    checkFamilyPermission(val) {
      this.data.hasFamilyPermission = checkFamilyPermission({
        currentHomeInfo: val,
      })
      if (this.data.hasFamilyPermission) {
        this.setData({
          addSelectIcon: addSelect,
        })
      } else {
        this.setData({
          addSelectIcon: addNoSelect,
        })
      }
    },
    //添加设备和扫一扫列表显示和隐藏
    switchShowAddList() {
      if (this.data.hasFamilyPermission) {
        const { addHeight, addWidth, addManageClicked } = this.data
        this.data.addManageClicked = true
        // if (!addManageClicked) {
        // return
        // }
        const addPickerAnimation = this.data.addPickerAnimation
        let showAddList = !this.data.showAddList
        if (showAddList) {
          addPickerAnimation.height(addHeight).width(addWidth).opacity(1).step()
        } else {
          showAddList = false
          addPickerAnimation.height(0).width(0).opacity(0).step()
        }
        const addPickerAnimationData = addPickerAnimation.export() // 家庭管理动画
        this.setData({
          addPickerAnimationData,
          showAddList,
        })
      } else {
        Toast({ context: this, position: 'bottom', message: '您当前家庭身份为普通成员，无法操作添加设备' })
      }
    },
    //添加设备
    goAddDeviceJia() {
      this.switchShowAddList()
      this.triggerEvent('goAddDeviceJia')
    },
    //扫一扫
    goScanCode() {
      this.switchShowAddList()
      this.triggerEvent('goScanCode')
    },
    changeHome(e) {
      this.triggerEvent('selectHomeGroupOption', e)
    },
    // 家庭管理  可优化 切换家庭管理的显示和隐藏
    switchShowHomeList() {
      if (this.data.homeList.length == 1) {
        const { homeList, ownHomeNum } = this.data
        let target = homeList[0]
        let homeitem = JSON.stringify(target)
        wx.navigateTo({
          url: `${homeDetail}?homegroupId=${target.homegroupId}&name=${target.name}&roleId=${target.roleId}&ownHomeNum=${ownHomeNum}&homeitem=${homeitem}`,
        })
        return
      }
      this.data.homeManageClicked = true
      this.homeGrounpListViewPoint()
      //切换打开/关闭家庭选择列表
      this.setHomeManageAnimation()
    },
    setHomeManageAnimation(homeManageShow = true) {
      if (!this.data.homeManageClicked) {
        return
      }
      const homeList = this.data.homeList
      if (homeList.length > 0) {
        let showHomeList = !this.data.showHomeList
        const homePickerAnimation = this.data.homePickerAnimation
        const iconTriangleAnimation = this.data.iconTriangleAnimation
        const height = this.data.homePickerHeight
        if (showHomeList && homeManageShow) {
          homePickerAnimation.height(height).width('412rpx').opacity(1).step()
          iconTriangleAnimation.rotate(180).step()
        } else {
          showHomeList = false
          homePickerAnimation.height(0).width(0).opacity(0).step()
          iconTriangleAnimation.rotate(360).step()
        }
        const homePickerAnimationData = homePickerAnimation.export() // 家庭管理动画
        const iconTriangleAnimationData = iconTriangleAnimation.export() // 家庭管理三角动画
        this.setData({
          homePickerAnimationData,
          iconTriangleAnimationData,
          showHomeList,
        })
      }
    },
    // 跳转家庭管理页面
    gotoHomeManage() {
      clickFamilyManagement()
      wx.navigateTo({
        url: homeManage,
      })
    },
    // 初始化家庭管理动画
    createAnimationData() {
      const homePickerAnimation = wx.createAnimation({
        duration: 200,
        timingFunction: 'ease',
      })
      const addPickerAnimation = wx.createAnimation({
        duration: 200,
        timingFunction: 'ease',
      })
      const iconTriangleAnimation = wx.createAnimation({
        duration: 200,
        timingFunction: 'ease',
      })
      this.data.addPickerAnimation = addPickerAnimation
      this.data.homePickerAnimation = homePickerAnimation
      this.data.iconTriangleAnimation = iconTriangleAnimation
    },
    //循环家庭列表 上报浏览埋点
    homeGrounpListViewPoint() {
      let listArr = []
      let list = this.data.homeList
      for (let i = 0; i < list.length; i++) {
        listArr.push({
          family_id: list[i].homegroupId,
          is_red_dot: list[i].unread,
        })
      }
      let listJson = JSON.stringify(listArr)
      let extInfoParam = listJson.substring(1, listJson.length - 1)
      indexHomerGroupListViewBurialPoint({
        ext_info: extInfoParam,
      })
    },
    //点击家庭下拉埋点
    clickDropdownFamily() {
      clickEventTracking('user_behavior_event', 'clickDropdownFamily', {
        page_id: 'page_home',
        page_name: '小程序首页',
        module: '首页',
        widget_id: 'click_dropdown_family',
        widget_name: '家庭下拉按钮',
        page_path: getFullPageUrl(),
        object_type: '家庭',
        object_id: app?.globalData?.applianceHomeData?.homegroupId,
        object_name: app?.globalData?.applianceHomeData?.name,
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
