// midea-service//pages/serviceMachineSearch/serviceMachineSearch.js

// const app = getApp()
// import paths from '../../../utils/paths'
import { requestService } from '../../../utils/requestService'
// import { showToast, getUrlkey } from '../../../utils/util'
import { imgBaseUrl } from '../../../api'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'], //顶部状态栏的高度
    imgBaseUrl: imgBaseUrl.url,
    spritePicture: imgBaseUrl.url + 'icon.png',
    value: '',
    searchPageIndex: 1, //page
    hasNext: Boolean, //是否还有下一页
    timeoutHandler: null,
    productList: [],
    scrollHeight: '',
    isIphoneX: false,
    isNull: false, //产品数据不存在
    common: '/mideaServices/images/icon.png',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if (options.keyWord) {
      this.setData({
        value: options.keyWord ? options.keyWord : '',
      })
    }
    this.getSystemInfo()
    if (options.keyWord) {
      this.search()
    }
  },
  search(e) {
    this.setData({
      value: this.data.value && !e ? this.data.value : e.detail.value,
      searchPageIndex: 1,
      isNull: false,
    })
    if (!this.data.value) return
    if (this.data.timeoutHandler) {
      clearTimeout(this.data.timeoutHandler)
    }
    this.data.timeoutHandler = setTimeout(() => {
      console.log('kkkkkk1', this)
      this.getProductList()
        .then((list) => {
          console.log('list====', list)
          this.setData({
            productList: list,
          })
          if (!list.length) {
            this.setData({
              isNull: true,
            })
          }
        })
        .catch({})
    }, 800)
  },
  getProductList() {
    if (!this.data.value || !this.data.value.trim()) return
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    return new Promise((resolve) => {
      //产品型号模糊查询
      this.data.value = this.data.value.trim()
      console.log('kkkkkk2', this.data.value)
      if (this.data.value) {
        let param = {
          productModel: this.data.value,
          pageNum: this.data.searchPageIndex,
          pageSize: 20,
        }
        requestService
          .request('getProductsForModelMj', param)
          .then((resp) => {
            wx.hideLoading()
            console.log('成功', resp)
            if (!resp.data.data) {
              this.setData({
                hasNext: false,
              })
              resolve([])
              return
            }
            if (resp.data.data.length < param.pageSize * 1) {
              this.setData({
                hasNext: false,
              })
            } else {
              this.setData({
                hasNext: true,
              })
            }
            resolve(resp.data.data)
          })
          .catch((error) => {
            wx.hideLoading()
            console.log('product list error====', error)
            if (error.data.code == 1) {
              this.setData({
                isNull: true,
              })
            }
            resolve([])
          })
      }
    })
  },
  loadmore() {
    if (this.data.value && this.data.hasNext) {
      this.data.searchPageIndex++
      this.getProductList().then((list) => {
        this.setData({
          productList: this.data.productList.concat(list),
        })
      })
    }
  },
  reset() {
    console.log('111')
    this.setData({
      value: '',
    })
  },
  selectItem(e) {
    console.log('当前产品', e.target.dataset.item)
    let { orgCode, productCode, productModel } = e.target.dataset.item
    let pages = getCurrentPages() // 当前页，
    let prevPage = pages[pages.length - 2] // 上一页
    prevPage.delData()
    prevPage.setData({
      //直接对上一个页面赋值
      orgCode: orgCode,
      productCode: productCode,
      productModel: productModel,
    })
    wx.navigateBack({
      delta: 1,
    })
  },
  actionGoBack() {
    wx.navigateBack({})
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

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
          .select('.search')
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
})
