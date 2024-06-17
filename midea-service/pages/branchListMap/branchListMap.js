import { imgBaseUrl } from '../../../api'
import { getFullPageUrl } from '../../../utils/util'
import { rangersBurialPoint } from '../../../utils/requestService'
Page({
  data: {
    imgBurl: imgBaseUrl.url,
    latitude: '',
    longitude: '',
    markers: [],
    currentIndex: 0, //底部轮播圆点
    productBranchList: [],
    co: '/mideaServices/images/icon.png',
  },
  onLoad: function (options) {
    let productBranchList = wx.getStorageSync('PRODUCT_BRANCH_LIST')
      ? JSON.parse(wx.getStorageSync('PRODUCT_BRANCH_LIST'))
      : []
    let currentIndex = options.index
    this.setData({
      productBranchList,
      currentIndex,
    })
    this.initMap()
    this.makePageViewTrack()
  },
  initMap() {
    let { productBranchList, currentIndex } = this.data
    let currBranch = productBranchList[currentIndex]
    let latitude = currBranch.unitLatitude
    let longitude = currBranch.nuitLongitude
    latitude *= 1
    longitude *= 1
    let markers = []
    markers.push({
      id: 1,
      latitude,
      longitude,
    })
    this.setData({
      latitude,
      longitude,
      markers,
    })
    this.mapCtx = wx.createMapContext('myMap')
  },
  // 轮播切换
  swiperChange(e) {
    this.setData({
      currentIndex: e.detail.current,
    })
    this.initMap()
  },
  onReady: function () {},
  onShow: function () {},
  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {},
  onReachBottom: function () {},
  //跳到地图
  goMapNavi(e) {
    let item = e.currentTarget.dataset.item
    let latitude = item.unitLatitude || ''
    let longitude = item.nuitLongitude || ''
    wx.openLocation({
      latitude: Number(latitude), //要去的纬度-地址
      longitude: Number(longitude), //要去的经度-地址
      name: item.unitName,
    })
  },
  makePhoneCall(e) {
    let phoneNumber = e.currentTarget.dataset.phone
    wx.makePhoneCall({
      phoneNumber,
    })
  },
  makePageViewTrack() {
    rangersBurialPoint('user_page_view', {
      module: '服务', //写死 “活动”
      page_id: 'page_points_info', //参考接口请求参数“pageId”
      page_name: '网点详情', //当前页面的标题，顶部的title
      page_path: getFullPageUrl(), //当前页面的URL
    })
  },
})
