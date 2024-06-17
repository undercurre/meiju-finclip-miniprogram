import { requestService, rangersBurialPoint } from '../../../utils/requestService'
import { mideaServiceImgApi } from '../../../api'
import computedBehavior from '../../../utils/miniprogram-computed.js'
import { productSearch, serviceChargeTypes, faultCheck, branchList, locationGuide } from '../../../utils/paths.js'
import { getFullPageUrl } from '../../../utils/util'
import { checkPermission } from '../../../pages/common/js/permissionAbout/checkPermissionTip'
import requestCss from '../../../utils/requestCss.js'
const dialogCommonData = require('../../../pages/common/mixins/dialog-common-data.js')
const app = getApp()
Page({
  behaviors: [computedBehavior, dialogCommonData],
  /**
   * 页面的初始数据
   */
  data: {
    currentIndex: 0,
    productList: [],
    scrollHeight: 0,
    spritePicture: mideaServiceImgApi.url + 'icon.png',
    fromPage: '', //maintenance 维修页面，install 安装页面 faultCheck 故障自查 guideBook 电子说明书 serviceChargeTypes 收费标准 //branchList 网点查询    保养服务upkeep
    myProductList: [], //维修服务时，查看我的设备列表
    isIphoneX: false,
    selectedList: [], //'快速选择壁挂式空调', '方柜式空调', '壁挂式空调', '方柜式空调'
    selectedProdCode: '',
    selectedBrandCode: '',
    targetId: '',
  },
  computed: {
    //距离底部多远
    bottomPadding() {
      let { isIphoneX, isMultiMode, selectedList } = this.data
      let currDistance = isMultiMode ? (isIphoneX ? '100' : '70') : '0'
      currDistance = selectedList.length ? currDistance * 1 + 80 : currDistance
      return currDistance
    },
    //是否多项选择
    isMultiMode() {
      let { fromPage } = this.data
      return fromPage == 'install'
    },
    //是否显示搜索框
    isShowSearchFlag() {
      let { fromPage } = this.data
      return fromPage && fromPage != 'guideBook' && fromPage != 'upkeep' && fromPage != 'serviceChargeChange'
    },
    //左边列表
    brandList() {
      let self = this
      let { productList, fromPage } = self.data
      let brandArr = []
      //维修页面-快速选择
      if (fromPage == 'maintenance') {
        brandArr.push({
          brandName: '我的设备',
          brandCode: '',
        })
      }
      productList.forEach((item) => {
        brandArr.push({
          brandName: item.brandName,
          brandCode: item.brandCode,
        })
      })
      return brandArr
    },
    //右边列表
    productTypeDTOList() {
      let self = this
      let { productList, fromPage, currentIndex, myProductList } = self.data
      let productData = []
      //维修页面-快速选择
      if (fromPage == 'maintenance') {
        if (currentIndex == 0) {
          if (myProductList.length) {
            let childArr = myProductList.map((item) => {
              return Object.assign(item, {
                brandCode: item.brandCode,
                brandName: item.productBrand,
                prodCode: item.productTypeId,
                prodName: item.productType,
                userTypeCode: item.userTypeCode,
                productModel: item.productModel,
                serialNo: item.serialNo,
                imagePath: item.productImgUrl,
                isMyDevice: true,
              })
            })
            let currProduct = {
              prodName: '我的设备',
              children: childArr,
            }
            productData.push(currProduct)
          }
        } else {
          productData = productList.length && productList[currentIndex - 1].children
        }
      } else {
        productData = productList.length && productList[currentIndex].children
      }
      return productData
    },
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      fromPage: options.fromPage || 'install',
    })
    this.initData()
    this.makePageViewTrack()
    //其他页面带参数进入维修页面，维修页面选择维修产品，进入到当前选择产品页，需要显示勾选对应的产品信息
    if (options.selectedList) {
      let { selectedBrandCode, selectedList, selectedProdCode, currentIndex } = options
      this.setData({
        selectedBrandCode: selectedBrandCode,
        selectedList: JSON.parse(selectedList),
        selectedProdCode: selectedProdCode,
        currentIndex: currentIndex,
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let self = this
    let { fromPage } = self.data
    //数据反显
    if (
      fromPage == 'install' ||
      fromPage == 'maintenance' ||
      fromPage == 'upkeep' ||
      fromPage == 'serviceChargeChange'
    ) {
      let selectedProductList = [...app.globalData.selectedProductList]
      let tempProductSelectedList = [...app.globalData.tempProductSelectedList]
      let selectedList = tempProductSelectedList.length ? tempProductSelectedList : selectedProductList
      //安装时是否超过6个
      if (selectedList.length > 6) {
        selectedList.shift()
        wx.showToast({
          title: '最多只能选6个',
          icon: 'none',
        })
      }
      let selectedProductCurrIndex = app.globalData.selectedProductCurrIndex
      self.setData({
        selectedList,
      })
      //维修页面-定位
      if (fromPage == 'maintenance' || fromPage == 'upkeep') {
        let selectedProdCode = selectedList.length ? selectedList[0]['prodCode'] * 1 : ''
        let selectedBrandCode = selectedList.length ? selectedList[0]['brandCode'] : ''
        if (fromPage == 'upkeep' && !selectedList.length) {
          selectedProductCurrIndex = 0
        }
        self.setData({
          selectedProdCode,
          selectedBrandCode,
          currentIndex: selectedProductCurrIndex,
        })
        self.makeScrollToELe()
      }
    } else {
      app.globalData.selectedProductCurrIndex = 1
    }
  },

  itemClicked(e) {
    let index = e.currentTarget.dataset.index
    this.setData({
      currentIndex: index,
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    let { fromPage } = this.data
    app.globalData.tempProductSelectedList = []
    //不用反显的数据清空
    if (fromPage == 'serviceChargeTypes') {
      app.globalData.selectedProductList = []
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {},
  goSearch() {
    let { fromPage, brandList } = this.data
    if (fromPage == 'install') {
      this.saveTempSelected()
    }
    let brandStr = JSON.stringify(brandList)
    this.goToPage(`${productSearch}?fromPage=${fromPage}&brandStr=${brandStr}`)
  },
  goToPage(url) {
    wx.navigateTo({
      url,
    })
  },
  goLogin() {
    wx.navigateTo({
      url: '../../../pages/login/login',
    })
  },
  getSystemInfo() {
    let self = this
    let { isShowSearchFlag } = self.data
    wx.getSystemInfo({
      success: function (res) {
        // 获取 select-input 的高度
        if (isShowSearchFlag) {
          wx.createSelectorQuery()
            .select('.select-input')
            .boundingClientRect(function (rect) {
              self.setData({
                scrollHeight: res.windowHeight - rect.height,
              })
            })
            .exec()
        } else {
          self.setData({
            scrollHeight: res.windowHeight,
          })
        }
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
  makeScrollToELe() {
    let self = this
    let { selectedProdCode } = self.data
    if (!selectedProdCode) {
      return
    }
    // 获取选中的元素-页面滚动到对应位置
    if (selectedProdCode != '') {
      wx.createSelectorQuery()
        .select(`#prod-item-${selectedProdCode}`)
        .boundingClientRect(function (rect) {
          if (rect && rect.height) {
            self.setData({
              targetId: `prod-item-${selectedProdCode}`,
            })
          } else {
            self.makeScrollToELe()
          }
        })
        .exec()
    }
  },
  initData() {
    let self = this
    let { fromPage } = self.data
    self.getSystemInfo()
    if (fromPage == 'maintenance') {
      self.getUserProductPageList()
    }
    self.getProductList()
  },
  //获取产品列表
  getProductList() {
    let self = this
    let { fromPage } = self.data
    let type = {
      maintenance: 'WX',
      install: 'AZ',
      upkeep: 'BY',
    }
    requestCss({
      urlKey: 'brandCategory',
      data: {
        supBrandProdServiceVO: {
          channel: 'Midea-Service',
          serviceType: type?.[fromPage] ?? '',
        },
      },
    })
      .then((res) => {
        let productList = res.list
        //筛选出支持保养的品牌品类产品
        if (fromPage == 'upkeep') {
          productList = productList.filter((item) => {
            //品牌：美的、比佛利
            return item.brandCode == 'MIDEA' || item.brandCode == 'BEVERLY'
          })
          productList.forEach((item) => {
            let productTypeDTOList = item.children
            productTypeDTOList.forEach((selItem) => {
              let children = selItem.children
              let selChildren = children.filter((childItem) => {
                //1023:电热水器 1112:家用净水器   1027:净饮机  1113:商用净水器
                if (item.brandCode == 'BEVERLY') {
                  return childItem.prodCode == '1023' || childItem.prodCode == '1112'
                } else if (item.brandCode == 'MIDEA') {
                  return (
                    childItem.prodCode == '1023' ||
                    childItem.prodCode == '1027' ||
                    childItem.prodCode == '1112' ||
                    childItem.prodCode == '1113'
                  )
                }
              })
              selItem.children = selChildren
            })
            productTypeDTOList = productTypeDTOList.filter((item) => {
              return item.children.length
            })
            item['productTypeDTOList'] = productTypeDTOList
          })
          self.setData({
            productList,
          })
        } else if (fromPage == 'serviceChargeChange' && app.globalData.selectedProductList.length > 0) {
          let list = app.globalData.selectedProductList
          let newList = []

          newList = productList.filter((item) => {
            return list.findIndex((element) => element.brandCode == item.brandCode) > -1
          })

          newList.forEach((item) => {
            let productTypeDTOList = item.children
            productTypeDTOList.forEach((selItem) => {
              let children = selItem.children
              let selChildren = children.filter((childItem) => {
                return (
                  list.findIndex(
                    (element) => element.prodCode == childItem.prodCode && element.brandCode == item.brandCode
                  ) > -1
                )
              })
              selItem.children = selChildren
            })
            productTypeDTOList = productTypeDTOList.filter((item) => {
              return item.children.length
            })
            item['children'] = productTypeDTOList
          })
          // newList.reverse();
          newList.sort(function (a, b) {
            return a.brandSort - b.brandSort
          })
          console.log(newList)
          self.setData({
            productList: newList,
          })
        } else {
          self.setData({
            productList,
          })
        }
      })
      .catch(() => {})
  },
  //获取我的家电
  getUserProductPageList() {
    let self = this
    let param = {
      // pageIndex: 1,
      // pageSize: 100,
      // selectType: 1
      headParams: {},
      pagination: {
        pageNo: 1,
        pageSize: 100,
      },
      restParams: {
        pageIndex: 1,
        selectType: 1,
        mobile: app.globalData.userData.userInfo.mobile,
      },
    }
    requestService
      .request('getUserProductPageList', param)
      .then((res) => {
        let currList = res.data.data.filter((item) => {
          //过滤没有售后属性的品类
          return item.productTypeId != '999'
        })
        let selectedProductList = [...app.globalData.selectedProductList]
        let tempProductSelectedList = [...app.globalData.tempProductSelectedList]
        let selectedList = tempProductSelectedList.length ? tempProductSelectedList : selectedProductList
        if (currList.length && !selectedList.length) {
          self.setData({
            currentIndex: 0,
          })
        }
        self.setData({
          myProductList: currList,
        })
      })
      .catch(() => {})
  },
  //产品点击
  async prodClicked(e) {
    let self = this
    let { fromPage, isMultiMode, selectedList, brandList, currentIndex, productTypeDTOList } = self.data

    if (fromPage != 'serviceChargeChange') {
      app.globalData.selectedProductList = []
    }
    let brandName = e.currentTarget.dataset.brandName
    let brandCode = e.currentTarget.dataset.brandcode
    let prodIndex = e.currentTarget.dataset.index
    let listIndex = e.currentTarget.dataset.listindex
    let prodCode = e.currentTarget.dataset.prodcode
    let currProdInfo = productTypeDTOList[listIndex]['children'][prodIndex]
    //选择多项
    if (isMultiMode) {
      if (selectedList.length >= 6) {
        wx.showToast({
          title: '最多只能选6个',
          icon: 'none',
        })
        return
      }
      currProdInfo['brandName'] = brandList[currentIndex]['brandName']
      currProdInfo['brandCode'] = brandList[currentIndex]['brandCode']
      selectedList.unshift(currProdInfo)
    } else {
      //维修-快速选择自己设备时
      if (fromPage == 'maintenance' && currentIndex == 0) {
        //自己设备的brand不准确，需重新获取
        currProdInfo['brandName'] = brandName
        currProdInfo['brandCode'] = brandCode
      } else {
        currProdInfo['brandName'] = brandList[currentIndex]['brandName']
        currProdInfo['brandCode'] = brandList[currentIndex]['brandCode']
      }
      let currSelected = []
      currSelected.push(currProdInfo)
      selectedList = currSelected
    }
    self.setData({
      selectedList,
    })
    if (isMultiMode) {
      self.saveTempSelected()
    } else {
      //维修时-自己设备需特殊处理
      if (fromPage == 'maintenance') {
        let tempIndex = currentIndex
        if (currentIndex == 0) {
          tempIndex = self.getIndexByBrand(brandName)
        }
        app.globalData.selectedProductCurrIndex = tempIndex
      }
      // 安装的收费页或者 其他的安装详情收费页
      if (fromPage == 'serviceChargeChange') {
        app.globalData.selectedInstall = [...selectedList]
      } else {
        app.globalData.selectedProductList = [...selectedList]
      }
      self.setData({
        selectedProdCode: prodCode * 1,
        selectedBrandCode: brandList[currentIndex]['brandCode'],
      })
      if (fromPage == 'maintenance' || fromPage == 'upkeep') {
        wx.navigateBack({})
      } else if (fromPage == 'faultCheck') {
        //故障自查
        self.goToPage(faultCheck)
      } else if (fromPage == 'serviceChargeTypes' || fromPage == 'serviceChargeChange') {
        //检查位置权限
        if (!(await this.checkLocation())) {
          return
        }
        //收费标准
        self.goToPage(`${serviceChargeTypes}?frompage=${fromPage}`)
      } else if (fromPage == 'branchList') {
        // 网点自查
        self.goToPage(branchList)
      }
    }
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
    } else if (flag == 'confirm') {
      //收费标准
      this.goToPage(`${serviceChargeTypes}?frompage=${this.data.fromPage}`)
    }
  },
  getIndexByBrand(brandName) {
    let { brandList } = this.data
    let tempIndex = 0
    brandList.forEach((item, index) => {
      if (item.brandName == brandName) {
        tempIndex = index
      }
    })
    return tempIndex
  },
  saveTempSelected() {
    let { selectedList } = this.data
    app.globalData.tempProductSelectedList = [...selectedList]
  },
  //提交
  submitProduct() {
    let self = this
    let { fromPage, selectedList } = self.data
    app.globalData.selectedProductList = [...selectedList]
    if (selectedList.length == 0) {
      wx.showToast({
        title: '请选择产品',
        icon: 'none',
        duration: 1000,
      })
    } else {
      if (fromPage == 'install') {
        wx.navigateBack({})
      }
    }
  },
  //删除选择列表
  delSelected(e) {
    let self = this
    let { selectedList } = self.data
    let prodCode = e.currentTarget.dataset.id
    let delIndex = selectedList.findIndex((item) => {
      return item.prodCode == prodCode
    })
    if (delIndex > -1) {
      selectedList.splice(delIndex, 1)
    }
    self.saveTempSelected()
    self.setData({
      selectedList,
    })
  },
  makePageViewTrack() {
    rangersBurialPoint('user_page_view', {
      module: '服务', //写死 “活动”
      page_id: 'page_choose_product', //参考接口请求参数“pageId”
      page_name: '产品选择', //当前页面的标题，顶部的title
      page_path: getFullPageUrl(), //当前页面的URL
    })
  },
})
