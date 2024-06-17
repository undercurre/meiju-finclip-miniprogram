import { requestService } from '../../../utils/requestService'
import { mideaServiceImgApi } from '../../../api'
import computedBehavior from '../../../utils/miniprogram-computed.js'
import { serviceChargeTypes, faultCheck, branchList } from '../../../utils/paths.js'
import requestCss from '../../../utils/requestCss.js'
const app = getApp()
Page({
  behaviors: [computedBehavior],
  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'], //顶部状态栏的高度
    fromPage: '',
    spritePicture: mideaServiceImgApi.url + 'icon.png',
    notFoundImg: mideaServiceImgApi.url + 'img_no_result@1x.png',
    productList: [],
    searchKeyWord: '',
    scrollHeight: '',
    isIphoneX: false,
    historyList: [],
    brandList: [],
  },
  computed: {
    convertedProductList() {
      let self = this
      let result = []
      let { searchKeyWord, productList } = self.data
      if (searchKeyWord && productList && productList.length > 0) {
        let reg = new RegExp(searchKeyWord, 'gi')
        for (let index = 0; index < productList.length; index++) {
          let brandItem = productList[index]
          for (let indexChild = 0; indexChild < brandItem.children.length; indexChild++) {
            let productCategary = brandItem.children[indexChild]
            let matchProductArray = productCategary.children.filter((product) => {
              return reg.test(brandItem.brandName + product.prodName)
            })
            for (let indexMatch = 0; indexMatch < matchProductArray.length; indexMatch++) {
              let product = matchProductArray[indexMatch]
              product['brandName'] = brandItem.brandName
              product['brandCode'] = brandItem.brandCode
              let richDesc = []
              let desc = (brandItem.brandName + product.prodName).replace(reg, ',*,')
              let descArray = desc.split(',')
              for (let i = 0; i < descArray.length; i++) {
                let descItem = descArray[i]
                if (descItem == '*') {
                  richDesc.push({
                    type: 'text',
                    value: searchKeyWord,
                    style: {
                      fontSize: 28,
                      color: '#FF8F00',
                    },
                  })
                } else if (descItem) {
                  richDesc.push({
                    type: 'text',
                    value: descItem,
                    style: {
                      fontSize: 28,
                      color: '#000000',
                    },
                  })
                }
              }
              let richHtml = self.getRichText(richDesc)
              result.push({ product: product, richDesc: richDesc, richHtml: richHtml })
            }
          }
        }
      }
      console.log('11111=====', result)
      return result
    },
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      fromPage: options.fromPage,
      brandList: options.brandStr ? JSON.parse(options.brandStr) : [],
    })
    this.initData()
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
    //安装页面需带回数据到选择页面
    if (fromPage == 'install') {
      console.log('onShow==install==', app.globalData.selectedProductList)
      console.log('onShow==install==', app.globalData.tempProductSelectedList)
    }
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

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
  onShareAppMessage: function () {},
  getSystemInfo() {
    let self = this
    wx.getSystemInfo({
      success: function (res) {
        // 获取 select-input 的高度
        wx.createSelectorQuery()
          .select('.search-input')
          .boundingClientRect(function (rect) {
            self.setData({
              scrollHeight: res.windowHeight - rect.height - self.data.statusBarHeight - 40,
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
  getRichText(richArr) {
    let spanStr = ''
    richArr.forEach((item) => {
      let currStr = `<span style="color:${item.style.color}">${item.value}</span>`
      spanStr += currStr
    })
    return `<div>${spanStr}</div>`
  },
  initData() {
    let self = this
    let historyList = wx.getStorageSync('PRODUCT_SEARCH_HISTORY')
      ? JSON.parse(wx.getStorageSync('PRODUCT_SEARCH_HISTORY'))
      : []
    self.setData({
      historyList,
    })
    console.log('historyList====', historyList)
    self.getSystemInfo()
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
    }).then((res) => {
      this.setData({
        productList: res?.list || [],
      })
    })
  },
  //正在输入
  actionInput(e) {
    this.setData({
      searchKeyWord: e.detail.value,
    })
  },
  actionBlur() {
    console.log('blur=====')
    let self = this
    let { historyList, searchKeyWord } = self.data
    if (!searchKeyWord) {
      return
    }
    if (historyList.indexOf(searchKeyWord) < 0) {
      historyList.push(searchKeyWord)
      if (historyList.length > 8) {
        historyList.shift()
      }
    }
    wx.setStorageSync('PRODUCT_SEARCH_HISTORY', JSON.stringify(historyList))
    self.setData({
      historyList,
    })
  },
  actionGoBack() {
    wx.navigateBack({})
  },
  recordClicked(e) {
    this.setData({
      searchKeyWord: e.currentTarget.dataset.item,
    })
  },
  prodClicked(e) {
    let self = this
    let { fromPage, brandList } = self.data
    let prodItem = e.currentTarget.dataset.item
    let currProdInfo = prodItem.product
    console.log('item======', currProdInfo)
    let currProdList = []
    console.log('brandList======', brandList)
    currProdList.push(currProdInfo)
    let currTempProductSelectedList = app.globalData.tempProductSelectedList
    if (fromPage == 'install') {
      app.globalData.tempProductSelectedList = [...currProdList, ...currTempProductSelectedList]
      wx.navigateBack({})
    } else if (fromPage == 'maintenance') {
      app.globalData.selectedProductList = [...currProdList]
      //设置一下对应的选择页面当前的currIndex
      brandList.forEach((item, index) => {
        if (item.brandName == currProdInfo.brandName) {
          app.globalData.selectedProductCurrIndex = index
        }
      })
      console.log('selectedProductCurrIndex======', app.globalData.selectedProductCurrIndex)
      wx.navigateBack({
        delta: 2,
      })
    } else if (fromPage == 'serviceChargeTypes') {
      app.globalData.selectedProductList = [...currProdList]
      wx.navigateTo({
        url: serviceChargeTypes,
      })
    } else if (fromPage == 'faultCheck') {
      app.globalData.selectedProductList = [...currProdList]
      wx.navigateTo({
        url: faultCheck,
      })
    } else if (fromPage == 'branchList') {
      // 网点自查
      app.globalData.selectedProductList = [...currProdList]
      wx.navigateTo({
        url: branchList,
      })
    }
  },
  delHistory() {
    let self = this
    wx.showModal({
      content: '确定清空所有历史搜索？',
      confirmText: '确定',
      confirmColor: '#267aff',
      cancelColor: '#267aff',
      success: function (res) {
        if (res.confirm) {
          let historyList = []
          wx.setStorageSync('PRODUCT_SEARCH_HISTORY', JSON.stringify(historyList))
          self.setData({
            historyList,
          })
        }
      },
    })
  },
  delKeyWord() {
    this.setData({
      searchKeyWord: '',
    })
  },
})
