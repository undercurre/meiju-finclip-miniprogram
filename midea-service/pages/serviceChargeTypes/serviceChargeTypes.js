// midea-service/pages/serviceChargeTypes/serviceChargeTypes.js

import { service } from 'assets/js/service'
import { serviceCharge, locationGuide } from '../../../utils/paths.js'
import { clickEventTracking } from '../../../track/track.js'
import { baseImgApi } from '../../../api'
import { checkNetwork } from '../../../utils/util'
import { getLocation } from '../../../utils/getLocation'
import { requestService } from '../../../utils/requestService'
import { checkPermission } from '../../../pages/common/js/permissionAbout/checkPermissionTip'
const dialogCommonData = require('../../../pages/common/mixins/dialog-common-data.js')
const app = getApp()
Page({
  behaviors: [dialogCommonData],
  /**
   * 页面的初始数据
   */
  data: {
    options: null,
    productItem: null,
    isLoaded: false,
    serviceChargeTypesList: [],
    imgUrl: baseImgApi.url,
    location: {
      provinceCode: '',
      province: '',
      cityCode: '',
      city: '',
      countyCode: '',
      county: '',
    },
    isShowAdressPopup: false, //选择位置弹窗是否显示
    addressMaxCount: 2, //地址选择器显示层数
    provinceWidth: 88, //省宽度，用于css处理
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.options = options
    this.initData()
    let pages = getCurrentPages()
    let prevPage = pages[pages.length - 2]
    let route = prevPage.route
    clickEventTracking('user_page_view', '', {
      refer_page_name: route,
    })
  },
  initData() {
    this.getSelectedProduct()
    this.getChargeServiceTypeData()
    wx.setNavigationBarTitle({
      title: this.data.productItem.prodName,
    })
  },
  async getSelectedProduct() {
    // if (this.data.options.isMock) {
    //   // 测试数据，提交时要注释掉
    //   app.globalData.selectedProductList.push({
    //     children: [],
    //     orgCode: 'CS009',
    //     prodCode: '1028',
    //     prodImg: 'http://filecmms.midea.com/PDGW-PROD-IMG/productImg/1028美的燃气壁挂炉.jpg',
    //     prodLevel: '2',
    //     prodName: '燃气壁挂炉',
    //     rowId: '1000000247',
    //     userTypeCode: 'U04',
    //     userTypeName: '热水器',
    //     userTypeSort: 0,
    //     brandCode: 'MIDEA',
    //   });
    // }
    let { frompage, location } = this.data.options
    let { selectedProductList, selectedInstall } = app.globalData
    if ((selectedProductList && selectedProductList.length > 0) || (selectedInstall && selectedInstall.length > 0)) {
      console.log(this.data.options)
      console.log(frompage)
      if (this.data.options && frompage == 'serviceChargeChange') {
        this.data.productItem = selectedInstall[0]
      } else {
        this.data.productItem = selectedProductList[0]
      }
    }
    if (location) {
      let myAdress = await this.getMyAddress()
      console.log('传递过来的地址', location)
      console.log('我的地址', myAdress)
      if (myAdress?.data?.data?.list?.length) {
        let target = myAdress.data.data.list.filter((item) => {
          let { provinceName, cityName, countyName, streetName, addr } = item
          return location == `${provinceName}${cityName}${countyName}${streetName}${addr}`
        })
        console.log('有无找到对应的地址', target)
        if (target?.length) {
          let { province, provinceName, city, cityName, county, countyName } = target[0]
          this.setData({
            location: {
              provinceCode: province,
              province: provinceName,
              cityCode: city,
              city: cityName,
              countyCode: county,
              county: countyName,
            },
          })
          this.dealProvinceCss()
        } else {
          this.autoLocation(true)
        }
      } else {
        this.autoLocation(true)
      }
    } else {
      if (!frompage) {
        this.autoLocation(true)
      } else {
        this.autoLocation()
      }
    }
  },
  //获取收费标准业务类型
  getChargeServiceTypeData() {
    let param = {
      body: {
        prodCodeThird: this.data.productItem.prodCode,
        brandCode: this.data.productItem.brandCode,
        tm: Math.round(new Date().getTime() / 1000),
      },
    }
    service
      .getChargeServiceTypeData(param)
      .then((res) => {
        this.setData({
          isLoaded: true,
          serviceChargeTypesList: res.data.data,
        })
      })
      .catch((err) => {
        this.setData({
          isLoaded: true,
        })
        console.error(err)
        let callback = () => {
          wx.showToast({
            title: (err.data && err.data.msg) || '系统出错，请稍后再试。',
            icon: 'none',
          })
        }
        checkNetwork(callback)
      })
  },
  // 跳转类型的收费标准页面
  gotoDetail(e) {
    if (this.data.location.city == '') {
      wx.showToast({
        title: '定位获取失败，请手动选择地址',
        icon: 'none',
        duration: 2000,
      })
      return
    }
    let name = e.currentTarget.dataset.name
    console.log(name)
    clickEventTracking('user_behavior_event', 'clickCategoty', {
      object_name: name,
    })
    let index = e.currentTarget.dataset.index
    let codeValue = this.data.serviceChargeTypesList[index]['codeValue']
    let frompage = this.data.options.frompage
    wx.navigateTo({
      url: `${serviceCharge}?codeValue=${codeValue}&frompage=${frompage}&location=${JSON.stringify(
        this.data.location
      )}`,
    })
  },
  //获取当前定位所在位置
  autoLocation(e) {
    let callback = async () => {
      wx.showLoading({
        title: '获取当前位置中...',
        mask: true,
      })
      //检查位置权限
      if (e && !(await this.checkLocation())) {
        wx.hideLoading()
        return
      }
      let location = (res) => {
        console.log('重新定位结果', res)
        if (!res.error) {
          this.setData({
            location: res,
          })
          wx.hideLoading()
          this.dealProvinceCss()
        } else {
          wx.hideLoading()
          wx.showToast({
            title: '定位获取失败，请手动选择地址',
            icon: 'none',
            duration: 2000,
          })
        }
      }
      wx.hideLoading()
      getLocation(location)
    }
    checkNetwork(callback)
  },
  //处理省市地址过长显示
  dealProvinceCss() {
    let _this = this
    wx.createSelectorQuery()
      .select('.showLocation')
      .boundingClientRect(function (rect) {
        wx.createSelectorQuery()
          .select('.cityShow')
          .boundingClientRect(function (res) {
            _this.setData({
              provinceWidth: (rect.width - res.width - 63) * 2,
            })
          })
          .exec()
      })
      .exec()
  },
  selectLocation() {
    let callback = () => {
      if (!this.data.isShowAdressPopup) {
        let child = this.selectComponent('#addressPopup')
        child.onMaskShow()
      }
      this.setData({
        isShowAdressPopup: true,
      })
    }
    checkNetwork(callback)
  },
  //关闭选择位置的弹窗
  onDialogClose() {
    this.setData({
      isShowAdressPopup: false,
    })
  },
  //获取地区
  onGetRegion(e) {
    if (!e.detail) {
      wx.showToast({
        title: '系统出错，请稍后再试',
        icon: 'none',
      })
      return
    }
    let { provinceCode, provinceName, cityCode, cityName, countyCode, countyName } = e.detail
    this.setData({
      location: {
        provinceCode: provinceCode,
        province: provinceName,
        cityCode: cityCode,
        city: cityName,
        countyCode: countyCode,
        county: countyName,
      },
    })
    this.dealProvinceCss()
  },
  getMyAddress() {
    return new Promise((resolve, reject) => {
      let reqData = {
        headParams: {},
        pagination: {
          pageNo: 1,
          pageSize: 200,
        },
        restParams: {
          mobile: app.globalData.userData.userInfo.mobile,
          sourceSys: 'MDWX',
          brand: 1,
        },
      }
      requestService.request('getAddressPageList', reqData).then(
        (resp) => {
          resolve(resp)
        },
        (error) => {
          reject(error)
        }
      )
    })
  },
  //检查用户手机位置是否打开以及微信小程序位置是否授权
  async checkLocation() {
    let locationRes = await checkPermission.loaction(true, false)
    console.log('检查位置权限结果', locationRes)
    let { isCanLocation, permissionTypeList, permissionTextAll } = locationRes
    if (!isCanLocation) {
      let title = permissionTextAll.includes('开启手机定位') ? '请开启手机定位' : '请允许美的美居Lite获取位置信息'
      this.setDialogMixinsData(true, title, permissionTextAll, false, [
        {
          btnText: '好的',
          flag: 'confirm',
        },
        {
          btnText: '查看指引',
          flag: 'lookGuide',
          type: 'location',
          permissionTypeList: permissionTypeList,
        },
      ])
      return false
    }
    return true
  },
  //位置提示弹窗确定取消回调
  async makeSure(e) {
    this.setData({
      isSureDialog: false,
    })
    let { flag, type, permissionTypeList } = e.detail
    if (flag == 'lookGuide') {
      if (type == 'location') {
        wx.navigateTo({
          url: locationGuide + `?permissionTypeList=${JSON.stringify(permissionTypeList)}`,
        })
      }
    }
  },
})
