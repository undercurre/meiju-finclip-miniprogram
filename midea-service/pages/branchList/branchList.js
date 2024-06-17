const app = getApp()
import { branchListMap } from '../../../utils/paths.js'
import { service } from '../../assets/js/http'
import { imgBaseUrl } from '../../../api'
import { getFullPageUrl } from '../../../utils/util'
import { rangersBurialPoint } from '../../../utils/requestService'
import { clickEventTracking } from '../../../track/track.js'
import { getLocation } from '../../../utils/getLocation'
Page({
  behaviors: [],
  data: {
    imgBurl: imgBaseUrl.url,
    isShowAdressPopup: false, // 地址弹窗
    regionList: [], //区域地址
    addressArea: '',
    selectedProduct: [], //选中的产品
    sortedBranchList: [],
    prodName: '',
    hasAuthLocation: false,
    emptyNetPhone: '400-8899-315',
    scrollHeight: '',
    loadFlag: false,
    latitude: null,
    longitude: null,
    addressMaxCount: 3, //地址选择器显示层数
    systemAuthLocation: true,
    co: '/mideaServices/images/icon.png',
  },
  onLoad: function () {
    let self = this
    this.makePageViewTrack()
    self.getSystemInfo()
    wx.onNetworkStatusChange(function (res) {
      if (!res.isConnected) {
        self.data.isNoNetWork = !res.isConnected
      } else {
        self.data.isNoNetWork = false
      }
    })
    wx.getNetworkType({
      success(res) {
        let networkType = res.networkType
        if (networkType == 'none') {
          self.data.isNoNetWork = !res.isConnected
          wx.showToast({
            title: '网络链接异常',
            icon: 'none',
          })
        } else {
          self.data.isNoNetWork = !res.isConnected
          self.initData()
        }
      },
    })
  },
  // 去地图模式
  toMap(e) {
    let index = e.currentTarget.dataset.index
    this.clickExecuteViewTrack()
    wx.navigateTo({
      url: `${branchListMap}?index=${index}`,
    })
  },
  //关闭地址dialog
  onDialogClose() {
    this.setData({
      isShowAdressPopup: false,
    })
  },
  // 打开地址dialog
  showAddressPopup() {
    if (!this.data.isShowAdressPopup) {
      let child = this.selectComponent('#addressPopup')
      child.onMaskShow()
    }
    this.setData({
      isShowAdressPopup: true,
    })
  },
  // 获取地区
  onGetRegion(e) {
    let { cityName, countyCode, countyName } = e.detail
    this.setData({
      addressArea: cityName + ' ' + countyName,
    })
    let param = {
      brandCode: this.data.selectedProduct[0].brandCode,
      prodCode: this.data.selectedProduct[0].prodCode,
      areaCode: countyCode,
    }
    //系统定位权限
    this.setData({
      systemAuthLocation: true,
      hasAuthLocation: true,
      loadFlag: false,
    })
    this.queryunitarchives(param)
  },
  // 去设置位置权限
  toSetting() {
    let self = this
    self.setData({
      loadFlag: false,
    })
    wx.openSetting({
      success() {
        self.initData()
      },
    })
  },
  // 网点数据  默认最近的5条
  queryunitarchives(param) {
    let self = this
    service
      .queryunitarchives(param)
      .then((res) => {
        let currList = res.list || []
        self.updateBranchList(currList)
      })
      .catch(() => {
        self.setData({
          loadFlag: true,
        })
        wx.hideLoading({
          fail() {},
        })
        console.log('失败')
      })
  },
  updateBranchList(branchList) {
    let { latitude, longitude } = this.data
    let sortedBranchList = []
    if (branchList.length) {
      let result = branchList.map((item) => {
        let distance = 0,
          distanceDesc = ''
        if (longitude && latitude && item.nuitLongitude && item.unitLatitude) {
          distance = this.distanceByLnglat(longitude, latitude, item.nuitLongitude, item.unitLatitude) //单位：米
          if (distance >= 1000) {
            distanceDesc = Math.round((distance / 1000) * 100) / 100 + 'km'
          } else {
            distanceDesc = distance + 'm'
          }
        }
        return Object.assign(
          {
            distance: distance,
            distanceDesc: distanceDesc,
          },
          item
        )
      })
      result = result.sort(function (a, b) {
        return a.distance - b.distance
      })
      sortedBranchList = result
    }
    wx.setStorageSync('PRODUCT_BRANCH_LIST', JSON.stringify(sortedBranchList))
    this.setData({
      sortedBranchList,
      loadFlag: true,
    })
    wx.hideLoading({
      fail() {},
    })
  },
  onReady: function () {},
  initData() {
    let self = this
    if (this.data.selectedProduct && this.data.selectedProduct.length > 0) {
      wx.getSetting({
        success: (res) => {
          if (res.authSetting['scope.userLocation']) {
            app.globalData.hasAuthLocation = true
            self.setData({
              hasAuthLocation: true,
            })
            self.getToLocation()
          } else {
            app.globalData.hasAuthLocation = false
            self.setData({
              loadFlag: true,
              hasAuthLocation: false,
            })
          }
        },
      })
    }
  },
  onShow: function () {
    if (app.globalData.selectedProductList.length > 0) {
      this.data.selectedProduct = app.globalData.selectedProductList
      this.setData({
        prodName: app.globalData.selectedProductList[0].prodName,
      })
    } else {
      this.data.selectedProduct = []
    }
  },
  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {},
  onReachBottom: function () {},
  getSystemInfo() {
    let self = this
    wx.getSystemInfo({
      success: function (res) {
        // 获取 select-input 的高度
        wx.createSelectorQuery()
          .select('.fixed-header')
          .boundingClientRect(function (rect) {
            self.setData({
              scrollHeight: res.windowHeight - rect.height,
            })
          })
          .exec()
        if (res.safeArea.top > 20) {
          self.setData({
            isIphoneX: true,
          })
        } else {
          self.setData({
            isIphoneX: false,
          })
        }
      },
    })
  },
  makePhoneCall(e) {
    let phoneNumber = e.currentTarget.dataset.phone
    wx.makePhoneCall({
      phoneNumber,
    })
  },
  // 高德sdk定位
  getToLocation: function () {
    let self = this
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    let location = (res) => {
      console.log('定位结果', res)
      if (!res.error) {
        this.setData({
          addressArea: res.city + ' ' + res.county,
        })
        let param = {
          brandCode: self.data.selectedProduct[0].brandCode,
          prodCode: self.data.selectedProduct[0].prodCode,
          areaCode: res.countyCode,
        }
        console.log('param:', param)
        self.queryunitarchives(param)
      } else {
        wx.showToast({
          title: '定位获取失败，请手动选择地址',
          icon: 'none',
          duration: 2000,
        })
      }
    }
    getLocation(location)
  },
  getAreaProvince(province, city, county) {
    let provinceObj, cityObj, countyObj
    return new Promise((resolve, reject) => {
      //获取省
      service
        .getAreaDetail({
          regionCode: '100000',
        })
        .then((res) => {
          let children = res.data
          let newArray = []
          children.map((item) => {
            newArray.push(
              Object.assign({}, item, {
                regionCode: item.ebplCode,
                regionName: item.ebplNameCn,
              })
            )
          })
          let temp = newArray.filter((provinceItem) => {
            return province == provinceItem.regionName
          })
          if (temp && temp.length > 0) {
            provinceObj = temp[0]
          }
          //获取市
          service
            .getAreaDetail({
              regionCode: provinceObj.regionCode,
            })
            .then((cRes) => {
              let children = cRes.data
              let newArray = []
              children.map((item) => {
                newArray.push(
                  Object.assign({}, item, {
                    regionCode: item.ebplCode,
                    regionName: item.ebplNameCn,
                  })
                )
              })
              let cTemp = newArray.filter((cityItem) => {
                return city == cityItem.regionName
              })
              if (cTemp && cTemp.length > 0) {
                cityObj = cTemp[0]
              }
              //获取区
              service
                .getAreaDetail({
                  regionCode: cityObj.regionCode,
                })
                .then((dRes) => {
                  let children = dRes.data
                  let newArray = []
                  children.map((item) => {
                    newArray.push(
                      Object.assign({}, item, {
                        regionCode: item.ebplCode,
                        regionName: item.ebplNameCn,
                      })
                    )
                  })
                  let dTemp = newArray.filter((countyItem) => {
                    return county == countyItem.regionName
                  })
                  if (dTemp && dTemp.length > 0) {
                    countyObj = dTemp[0]
                  }
                  resolve({
                    province: provinceObj.regionCode,
                    provinceName: provinceObj.regionName,
                    city: cityObj.regionCode,
                    cityName: cityObj.regionName,
                    county: countyObj.regionCode,
                    countyName: countyObj.regionName,
                  })
                })
            })
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  //跳到地图
  goMapNavi(e) {
    clickEventTracking('user_behavior_event', 'clickGoHere')
    let item = e.currentTarget.dataset.item
    let latitude = item.unitLatitude || '23.099994'
    let longitude = item.nuitLongitude || '113.324520'
    wx.openLocation({
      latitude: Number(latitude), //要去的纬度-地址
      longitude: Number(longitude), //要去的经度-地址
      name: item.unitName,
    })
  },
  //根据经纬度计算距离
  Rad(d) {
    return (d * Math.PI) / 180.0
  },
  distanceByLnglat(lng1, lat1, lng2, lat2) {
    var radLat1 = this.Rad(lat1)
    var radLat2 = this.Rad(lat2)
    var a = radLat1 - radLat2
    var b = this.Rad(lng1) - this.Rad(lng2)
    var s =
      2 *
      Math.asin(
        Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2))
      )
    s = s * 6378137.0 // 取WGS84标准参考椭球中的地球长半径(单位:m)
    s = Math.round(s)
    return s
  },
  makePageViewTrack() {
    let pages = getCurrentPages()
    let prevPage = pages[pages.length - 2]
    rangersBurialPoint('user_page_view', {
      module: '服务', //写死 “活动”
      page_id: 'page_points_list', //参考接口请求参数“pageId”
      page_name: '网点列表', //当前页面的标题，顶部的title
      page_path: getFullPageUrl(), //当前页面的URL
      refer_page_name: prevPage.route,
    })
  },
  clickExecuteViewTrack() {
    let pages = getCurrentPages()
    let prevPage = pages[pages.length - 2]
    rangersBurialPoint('user_behavior_event', {
      module: '服务', //写死 “活动”
      page_id: 'page_points_list', //参考接口请求参数“pageId”
      page_name: '网点列表', //当前页面的标题，顶部的title
      page_path: getFullPageUrl(), //当前页面的URL
      widget_id: 'click_point_info',
      widget_name: '网点详情',
      refer_page_name: prevPage.route,
    })
  },
})
