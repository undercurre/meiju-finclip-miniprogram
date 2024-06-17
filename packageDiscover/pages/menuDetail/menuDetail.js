// pages/menuDetail/menuDetail.js
import { service } from 'assets/js/service'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    recipeData: {},
    runData: {},
    hasZuliao: false,
    hasFuliao: false,
    hasTiaoliao: false,
    isNoNetWork: false,
    difficultyType: {
      1: '容易',
      2: '中等',
      3: '困难',
      4: '较难',
    },
    generalUnitType: {
      1: '克',
      2: '毫升',
      3: '个',
      4: '根',
      5: '片',
      6: '块',
      7: '颗',
      8: '瓣',
      9: '朵',
      10: '只',
      11: '条',
      12: '包',
      13: '张',
      14: '粒',
      15: '杯',
      16: '茶匙',
      17: '汤匙',
    },
    statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'], //顶部状态栏的高度
    recipeId: '2459',
    collect: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('菜单options======', options)
    let self = this
    let recipeId = options.recipeId || 2459
    self.data.recipeId = recipeId
    self.data.collect = options.collect??''
    self.init()
  },

  //获取菜谱详情
  getMenuDetail() {
    let self = this
    const recipeId = self.data.recipeId
    service
      .getMenuDetail(recipeId)
      .then((resp) => {
        console.log(resp)
        let currentFoods = resp.healthData.recipe.foods
        let currentZuliao = false
        let currentFuliao = false
        let currentTiaoliao = false
        for (let i = 0; i < currentFoods.length; i++) {
          if (currentFoods[i].foodType == 1) {
            currentZuliao = true
          }
          if (currentFoods[i].foodType == 2) {
            currentFuliao = true
          }
          if (currentFoods[i].foodType == 3) {
            currentTiaoliao = true
          }
        }
        self.setData({
          recipeData: resp.healthData.recipe,
          runData: resp.healthData.run,
          hasZuliao: currentZuliao,
          hasFuliao: currentFuliao,
          hasTiaoliao: currentTiaoliao,
        })
        wx.stopPullDownRefresh()
      })
      .catch((error) => {
        wx.stopPullDownRefresh()
        if (this.data.collect) {
          wx.showModal({
            content: '该页面不存在',
            showCancel: false,
            success(res){
              if (res.confirm) {
                console.log('用户点击确定')
                wx.switchTab({
                  url: '/pages/index/index',
                })
              }
            }
          })
        }
        console.log(error)
      })
  },

  init() {
    const self = this
    wx.getNetworkType({
      success(res) {
        let networkType = res.networkType
        console.log('getNetworkType======', networkType)
        if (networkType == 'none') {
          self.setData({
            isNoNetWork: !res.isConnected,
          })
        } else {
          self.setData({
            isNoNetWork: false,
          })
          console.log('no======', networkType)
          self.getMenuDetail()
        }
      },
    })
  },

  //图片加载错误处理
  errorFunction(e) {
    console.log('image error function')
    let tempRecipeData = this.data.recipeData
    tempRecipeData.steps[e.target.dataset.errorimg].stepThumb = 'assets/img/public_img_none@3x.png'
    this.setData({
      recipeData: tempRecipeData,
    })
  },

  //返回上一页
  back: function () {
    console.log('have call back')
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
  onAddToFavorites(res) {
    // webview 页面返回 webViewUrl
    console.log('webViewUrl: ', res.webViewUrl)
    let options = `collect=true&recipeId=${this.data.recipeId}`
    console.log('收藏连接',options)
    return {
      title: '美的美居Lite',
      imageUrl: '',
      query: options,
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
  onPullDownRefresh: function () {
    console.log('pull down request')
    this.getMenuDetail(this.data.recipeId)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
})
