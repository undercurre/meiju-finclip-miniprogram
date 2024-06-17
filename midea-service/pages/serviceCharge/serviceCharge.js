// midea-service/pages/serviceChargeTypes/serviceChargeTypes.js
import { service } from 'assets/js/service'
import { baseImgApi } from '../../../api'
import { checkNetwork } from '../../../utils/util'
import { getLocation } from '../../../utils/getLocation'
import { checkPermission } from '../../../pages/common/js/permissionAbout/checkPermissionTip'
import { locationGuide } from '../../../utils/paths.js'
const dialogCommonData = require('../../../pages/common/mixins/dialog-common-data.js')
const app = getApp()
Page({
  behaviors: [dialogCommonData],
  /**
   * 页面的初始数据
   */
  data: {
    productItem: null,
    codeValue: '',
    isLoaded: false,
    chargeStandardList: [],
    options: null,
    currentIndex: 0,
    chargeChildren: [],
    isOpened: false, //是否显示收费标准actionSheet
    charegSheet: [],
    chargeTitle: '',
    baseImgUrl: baseImgApi.url,
    location: {
      provinceCode: '',
      province: '',
      cityCode: '',
      city: '',
      countyCode: '',
      county: '',
    },
    isShowAdressPopup: false, //是否显示选择位置弹窗
    addressMaxCount: 2, //地址选择器显示层数
    provinceWidth: 112, //省宽度，用于css处理
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { codeValue, location } = options
    this.data.options = options
    this.data.codeValue = codeValue
    if (location) {
      this.setData({
        location: JSON.parse(location),
      })
      this.dealProvinceCss()
    }
    this.initData()
  },
  initData() {
    this.getSelectedProduct()
    wx.setNavigationBarTitle({
      title: this.data.productItem.prodName,
    })
    this.getChargeStandardList()
  },
  getSelectedProduct() {
    let { selectedProductList, selectedInstall } = app.globalData
    if ((selectedProductList && selectedProductList.length > 0) || (selectedInstall && selectedInstall.length > 0)) {
      console.log(this.data.options)
      console.log(this.data.options.frompage)
      if (this.data.options && this.data.options.frompage == 'serviceChargeChange') {
        this.data.productItem = selectedInstall[0]
      } else {
        this.data.productItem = selectedProductList[0]
      }
    }
  },
  //获取收费标准业务类型
  getChargeStandardList() {
    let param = {
      body: {
        brandCode: this.data.productItem.brandCode,
        classA: '',
        classB: '',
        classC: '',
        content: '',
        pageNum: 1,
        pageSize: 10000,
        prodCode: this.data.productItem.prodCode,
        serviceType: this.data.codeValue,
        tm: new Date().getTime(),
        areaCode: this.data.location.cityCode,
        level: 2,
      },
    }
    wx.showLoading({
      title: '加载中...',
      mask: true,
    })
    service
      .getChargeStandardList(param)
      .then((res) => {
        wx.hideLoading()
        // 排序
        let list
        if (res.data && res.data.data) {
          list = res.data.data.sort(function (a, b) {
            if (a.classA === b.classA) {
              if (a.classB === b.classB) {
                return b.classC > a.classC ? 1 : -1
              } else {
                return a.classB > b.classB ? 1 : -1
              }
            } else {
              return a.classA > b.classA ? 1 : -1
            }
          })
        }
        console.log(list)
        let money = list.reduce((prev, item) => {
          let target = prev.filter((ele) => {
            return ele.classB == item.classB
          })
          if (target.length == 0) {
            let { classB, standardMax, standardMin, unit } = item
            prev.push({
              classB: classB,
              standardMax: standardMax,
              standardMin: standardMin,
              unit: unit,
            })
          }
          return prev
        }, [])
        // 转成树结构
        let result = []
        let classAIndexs = {},
          classBIndexs = {}
        if (list && list.length > 0) {
          for (let index = 0; index < list.length; index++) {
            const item = list[index]

            // 一期没有开发配件价格，屏蔽备件费项目
            if (item.classA == 'T12') continue

            let Aindex = classAIndexs[item.classA]
            if (!Aindex) {
              result.push({
                classA: item.classA,
                classAProject: item.classAProject,
                children: [],
              })
              Aindex = String(result.length - 1)
              classAIndexs[item.classA] = String(result.length - 1)
            }
            let Bindex = classBIndexs[item.classA + item.classB]
            if (!Bindex) {
              result[Aindex]['children'].push({
                classB: item.classB,
                classBProject: item.classBProject,
                children: [],
              })
              Bindex = String(result[Aindex]['children'].length - 1)
              classBIndexs[item.classA + item.classB] = String(result[Aindex]['children'].length - 1)
            }

            result[Aindex]['children'][Bindex]['children'].push({
              classC: item.classC,
              classCProject: item.classCProject,
              unit: item.unit,
              chargeStandard: item.chargeStandard,
              pubRemark: item.pubRemark,
            })
          }
        }
        result.forEach((item) => {
          item.children.forEach((ele) => {
            money.forEach((one) => {
              if (ele.classB == one.classB) {
                let { standardMax, standardMin, unit } = one
                ele.standardMax = standardMax
                ele.standardMin = standardMin
                ele.unit = unit
                ele.money = standardMax == standardMin ? `${standardMax}元` : `${standardMin}-${standardMax}元`
              }
            })
          })
        })
        console.log(result)
        this.setData({
          isLoaded: true,
          chargeStandardList: result,
          chargeChildren: result.length != 0 ? result[0].children : [],
          currentIndex: 0,
        })
      })
      .catch((err) => {
        wx.hideLoading()
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
  //获取当前定位所在位置
  autoLocation() {
    let callback = async () => {
      wx.showLoading({
        title: '获取当前位置中...',
        mask: true,
      })
      //检查位置权限
      if (!(await this.checkLocation())) {
        wx.hideLoading()
        return
      }
      let location = (res) => {
        wx.hideLoading()
        console.log('重新定位结果', res)
        if (!res.error) {
          this.setData({
            location: res,
          })
          this.dealProvinceCss()
          this.getChargeStandardList()
        } else {
          wx.showToast({
            title: '定位获取失败，请手动选择地址',
            icon: 'none',
            duration: 2000,
          })
        }
      }
      getLocation(location)
    }
    checkNetwork(callback)
  },
  //关闭选择位置的弹窗
  onDialogClose() {
    this.setData({
      isShowAdressPopup: false,
    })
  },
  // 获取地区
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
    this.getChargeStandardList()
  },
  switchExpand(e) {
    let index = e.currentTarget.dataset.index
    let { chargeStandardList } = this.data
    this.setData({
      currentIndex: index,
      chargeChildren: chargeStandardList[index].children,
    })
  },
  showActionSheet(e) {
    let index = e.currentTarget.dataset.index
    let { children, classBProject } = this.data.chargeChildren[index]
    this.setData({
      chargeTitle: classBProject,
      charegSheet: children,
      isOpened: children && children.length != 0 ? true : false,
    })
  },
  closeSheet() {
    this.setData({
      isOpened: false,
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
