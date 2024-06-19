// sub-package/sda-cloud-menu/pages/list/list.js
import { RecipeService } from '../../js/api'
import { Utils } from '../../js/utils'

let searchTimer = null

Page({
  /**
   * 页面的初始数据
   */
  data: {
    isLoadingMoreRecipe: false,
    isInit: false,
    title: '食谱推荐',
    menuList: [],
    // 菜单动画
    menuListAnimation: null,
    animationDuration: 500,
    // 食谱分类
    menuTabs: [],
    // 食谱二级分类
    menuSubTabs: [],
    selectedTabsIndex: 1,
    selectedSubTabsIndex: 0,
    urlParams: {},
    imageStyle: {
      width: 275,
      height: 203,
    },
    descStyle: {
      fontSize: 18,
    },
    infoWrapperStyle: {
      padding: 20,
    },
    titleStyle: {
      fontSize: 26,
    },
    isLoadingEnd: false,
    pageIndex: 1,
    recipeScrollTop: 0,
    isSearching: false,
    isAll: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('页面参数: ', options)
    this.setData({
      urlParams: options,
    })
    // 动画初始化
    this.menuListAnimation = wx.createAnimation({
      duration: this.data.animationDuration,
    })
    Utils.rangersBurialPointClick('plugin_page_view', {
      page_name: '食谱首页',
    })
    // 获取食谱分类
    this.getRecipeCategories()
  },

  // region 方法
  // 加载食谱开始或结束
  isLoadingMoreRecipe() {
    return this.data.isLoadingMoreRecipe
  },
  loadingMoreMenuStart() {
    this.setData({ isLoadingMoreRecipe: true })
  },
  loadingMoreMenuEnd() {
    this.setData({ isLoadingMoreRecipe: false })
  },
  // 点击食谱
  onClickMenuItem(event) {
    console.log('点击食谱: ', event)
    let model = event.detail
    const { urlParams } = this.data
    switch (model.key) {
      case 'recipe':
        // 跳转到食谱详情
        Utils.goTo({
          url: '../detail/detail',
          params: {
            ...urlParams,
            id: model.data.origin.recipeCode,
          },
        })
        Utils.rangersBurialPointClick('plugin_button_click', {
          element_content: '跳转到食谱详情',
          params: {
            ...urlParams,
            id: model.data.origin.recipeCode,
          },
        })
        break
      default:
        break
    }
  },
  // 切换页面到搜索
  renderPageBySearchToggle(isSearching) {
    let { imageStyle, titleStyle, infoWrapperStyle, descStyle } = this.data
    if (isSearching) {
      // 搜索中
      imageStyle = null
      titleStyle = null
      // infoWrapperStyle = null;
      descStyle = null
    } else {
      // 不搜索
      imageStyle = {
        width: 275,
        height: 203,
      }
      titleStyle = {
        fontSize: 26,
      }
      infoWrapperStyle = {
        padding: 20,
      }
      descStyle = {
        fontSize: 18,
      }
    }
    this.setData({ isSearching, imageStyle, titleStyle, infoWrapperStyle, descStyle })
  },
  // 输入搜索内容
  onChangeSearchValue(event) {
    let searchValue = event.detail
    if (searchTimer) {
      clearTimeout(searchTimer)
      searchTimer = null
    }
    searchTimer = setTimeout(() => {
      if (!searchValue) {
        this.onClearSearchValue()
        return
      }
      console.log('输入搜索内容: ', event)
      const { urlParams } = this.data
      Utils.rangersBurialPointClick('plugin_button_click', {
        element_content: '输入搜索内容',
        params: {
          ...urlParams,
          keyWord: searchValue,
        },
      })
      wx.showLoading()
      RecipeService.recipeSearch({
        ...urlParams,
        keyWord: searchValue,
      })
        .then((res) => {
          wx.hideLoading()
          console.log('搜索食谱: ', res)
          if (!res.data.errorCode) {
            let rtnData = JSON.parse(res.data.result.returnData)
            if (!rtnData.errorCode) {
              let searchList = rtnData.data
              if (searchList && searchList.length > 0) {
                console.log('搜索到的食谱: ', searchList)
                let menuList = []
                searchList.forEach((recipeItem) => {
                  menuList.push({
                    origin: recipeItem,
                    image: recipeItem.thumbnailUrl43,
                    name: recipeItem.recipeName,
                    descArr: [recipeItem.costTime + '分钟', recipeItem.difficulty, recipeItem.energy + '千卡'],
                    author: {
                      avatar: recipeItem.user.profileUrl,
                      name: recipeItem.user.nickName,
                    },
                    collectNum: recipeItem.collectionNum,
                  })
                })
                this.setData({ menuList })
                this.renderPageBySearchToggle(true)
              } else {
                wx.showToast({
                  title: '找不到食谱~',
                  icon: 'none',
                })
              }
            }
          }
        })
        .catch((err) => {
          wx.hideLoading()
          wx.showToast({
            title: '找不到食谱...',
            icon: 'none',
          })
        })
    }, 1500)
  },
  // 清空搜索内容
  onClearSearchValue() {
    const { isSearching } = this.data
    if (isSearching) {
      this.renderPageBySearchToggle(false)
      const { menuSubTabs } = this.data
      Utils.rangersBurialPointClick('plugin_button_click', {
        element_content: '清空搜索内容',
        params: {
          topicId: menuSubTabs[0].id,
        },
      })
      this.getTopicInfo({
        topicId: menuSubTabs[0].id,
      })
    }
  },
  // 加载更多食谱
  onLoadMoreRecipes(event) {
    let pageIndex = this.data.pageIndex
    pageIndex++
    const { selectedTabsIndex, menuSubTabs, selectedSubTabsIndex, isLoadingEnd } = this.data
    console.log('加载更多食谱', pageIndex, this.data.menuList, { menuSubTabs, selectedSubTabsIndex, isLoadingEnd })
    let selectedMenuTab = this.data.menuTabs[selectedTabsIndex]
    if (selectedMenuTab.id === 'all') {
      // 全部食谱
      if (!isLoadingEnd) {
        Utils.rangersBurialPointClick('plugin_button_click', {
          element_content: '加载更多食谱',
          params: {
            topicId: 'all',
            pageIndex: pageIndex,
          },
        })
        try {
          this.getRecipeList({
            pageIndex: pageIndex,
          })
        } catch (err) {
          console.log(err)
        }
      }
    } else {
      if (!isLoadingEnd) {
        let topicId = menuSubTabs[selectedSubTabsIndex].id
        Utils.rangersBurialPointClick('plugin_button_click', {
          element_content: '加载更多食谱',
          params: {
            pageIndex: pageIndex,
            topicId,
          },
        })
        this.getTopicInfo({
          pageIndex: pageIndex,
          topicId,
        })
      }
    }
  },
  // 获取全部食谱
  async getRecipeList(params = {}) {
    console.log('获取全部食谱')
    if (this.isLoadingMoreRecipe()) {
      return
    }
    let { urlParams } = this.data
    let pageSize = 10
    let pageIndex = params.pageIndex || 1
    let isLoadingEnd = this.data.isLoadingEnd
    this.loadingMoreMenuStart()
    if (pageIndex === 1) {
      await this.menuListToggleFade(false)
    }
    this.setData({ isAll: true })
    RecipeService.getRecipeList({
      deviceInfo: {
        type: urlParams.applianceType,
        sn8: urlParams.modelNo,
      },
      pageIndex: pageIndex,
      pageSize: pageSize,
    })
      .then((res) => {
        // console.log('获取全部食谱 完成: ',res);
        this.loadingMoreMenuEnd()
        if (!res.data.errorCode && res.data.result) {
          let rtnData = JSON.parse(res.data.result.returnData)
          console.log('获取全部食谱 解析后: ', rtnData)
          let rtnRecipes = rtnData.data.data
          if (rtnRecipes && rtnRecipes.length > 0) {
            let menuList = []
            rtnRecipes.forEach((recipeItem) => {
              menuList.push({
                origin: recipeItem,
                image: recipeItem.thumbnailUrl43,
                name: recipeItem.recipeName,
                descArr: [recipeItem.costTime + '分钟', recipeItem.difficulty, recipeItem.energy + '千卡'],
                author: {
                  avatar: recipeItem.user.profileUrl,
                  name: recipeItem.user.nickName,
                },
                collectNum: recipeItem.collectionNum,
              })
            })
            if (pageIndex > 1) {
              // 加载更多
              let pageMenuList = this.data.menuList
              pageMenuList = pageMenuList.concat(menuList)
              menuList = pageMenuList
            }
            isLoadingEnd = rtnRecipes.length < pageSize
            this.setData({ pageIndex, menuList, isLoadingEnd })
          } else {
            this.setData({ isLoadingEnd: true })
          }
        }
        this.renderPageBySearchToggle(true)
        this.menuListToggleFade(true)
      })
      .catch((err) => {
        this.loadingMoreMenuEnd()
        console.error('获取全部食谱 错误: ', err)
      })
  },
  // 获取食谱合集信息
  async getTopicInfo(params) {
    if (this.isLoadingMoreRecipe()) {
      return
    }
    const { urlParams } = this.data
    // wx.showLoading()
    let pageIndex = params.pageIndex || 1
    let pageSize = 10
    let isLoadingEnd = this.data.isLoadingEnd
    this.loadingMoreMenuStart()
    if (pageIndex === 1) {
      await this.menuListToggleFade(false)
    }
    RecipeService.getTopicInfo({
      applianceType: urlParams.applianceType,
      modelNo: urlParams.modelNo,
      applianceId: urlParams.applianceId,
      topicId: params.topicId,
      pageIndex: pageIndex,
      pageSize: pageSize,
    })
      .then((res) => {
        // wx.hideLoading()
        this.loadingMoreMenuEnd()
        if (!res.data.errorCode && res.data.result) {
          let rtnData = JSON.parse(res.data.result.returnData)
          console.log('获取食谱合集信息 解析后: ', rtnData)
          let rtnRecipes = rtnData.data.recipes
          if (rtnRecipes && rtnRecipes.length > 0) {
            let menuList = []
            rtnRecipes.forEach((recipeItem) => {
              menuList.push({
                origin: recipeItem,
                image: recipeItem.thumbnailUrl43,
                name: recipeItem.recipeName,
                descArr: [recipeItem.costTime + '分钟', recipeItem.difficulty, recipeItem.energy + '千卡'],
                author: {
                  avatar: recipeItem.user.profileUrl,
                  name: recipeItem.user.nickName,
                },
                collectNum: recipeItem.collectionNum,
              })
            })
            if (pageIndex > 1) {
              // 加载更多
              let pageMenuList = this.data.menuList
              pageMenuList = pageMenuList.concat(menuList)
              menuList = pageMenuList
            }
            isLoadingEnd = rtnRecipes.length < pageSize
            this.setData({ pageIndex, menuList, isLoadingEnd })
          } else {
            this.setData({ isLoadingEnd: true })
          }
        }
        this.renderPageBySearchToggle(false)
        this.menuListToggleFade(true)
        this.setData({ isAll: false })
      })
      .catch((err) => {
        this.loadingMoreMenuEnd()
        // wx.hideLoading()
      })
  },
  // 选择分类列表
  async onChangeSubTabs(event) {
    let model = event.currentTarget.dataset
    console.log('选择食谱分类: ', model)
    let selectedSubTabsIndex = this.data.selectedSubTabsIndex
    if (selectedSubTabsIndex === model.index) {
      return
    }
    this.setData({
      selectedSubTabsIndex: model.index,
    })
    Utils.rangersBurialPointClick('plugin_button_click', {
      element_content: '选择食谱分类',
      params: {
        topicId: model.item.id,
        name: model.item.name,
      },
    })
    await this.getTopicInfo({
      topicId: model.item.id,
    })
    this.scrollToTop()
  },
  // 移动到列表顶部
  scrollToTop() {
    this.setData({
      recipeScrollTop: 0,
    })
  },
  // 获取食谱分类
  getRecipeCategories() {
    const { urlParams } = this.data
    RecipeService.categories({
      applianceType: urlParams.applianceType,
      modelNo: urlParams.modelNo,
      applianceId: urlParams.applianceId,
    })
      .then((res) => {
        if (!res.data.errorCode && res.data.result) {
          let rtnData = JSON.parse(res.data.result.returnData)
          console.log('解析后分类数据: ', rtnData)
          let menuTabList = [
            {
              id: 'all',
              name: '全部',
            },
          ]
          let menuSubTabList = []
          if (rtnData.data && rtnData.data.length > 0) {
            menuTabList = menuTabList.concat(rtnData.data)
            menuSubTabList = menuTabList[1].categories[0].categories
            this.getTopicInfo({
              topicId: menuSubTabList[0].id,
            })
          }
          this.setData({
            isInit: true,
            menuTabs: menuTabList,
            menuSubTabs: menuSubTabList,
          })
        }
      })
      .catch((err) => {
        console.log('获取食谱分类 错误: ', err)
      })
  },
  // 返回
  onClickBack() {
    Utils.rangersBurialPointClick('plugin_button_click', {
      element_content: '返回',
    })
    wx.navigateBack({
      delta: 1,
      fail: (err) => {
        wx.switchTab({
          url: '/pages/index/index',
        })
      },
    })
  },
  // 选择分类
  onChangeTabs(event) {
    let model = event.detail
    let selectedIndex = model.index
    const { menuTabs } = this.data
    console.log('选择分类: ', event, menuTabs)
    if (selectedIndex === 0) {
      // 查看全部
      this.setData({
        selectedTabsIndex: selectedIndex,
        isLoadEnd: false,
      })
      // 获取全部食谱
      Utils.rangersBurialPointClick('plugin_button_click', {
        element_content: '获取全部食谱',
      })
      try {
        this.getRecipeList()
      } catch (err) {
        console.error(err)
      }
    } else {
      this.setData({
        selectedTabsIndex: selectedIndex,
        menuSubTabs: menuTabs[selectedIndex].categories[0].categories,
        isLoadEnd: false,
      })
      // 获取食谱合集信息
      Utils.rangersBurialPointClick('plugin_button_click', {
        element_content: '选择分类',
        params: {
          id: menuTabs[selectedIndex].id,
          title: model.title,
        },
      })
      let menuSubTabList = []
      menuSubTabList = menuTabs[selectedIndex].categories[0].categories
      this.getTopicInfo({
        topicId: menuSubTabList[0].id,
      })
    }
    this.scrollToTop()
  },
  // 食谱列表显示与消失
  menuListToggleFade(isShow) {
    return new Promise((resolve, reject) => {
      let opacity = 1
      if (!isShow) {
        opacity = 0
      }
      let animate = () => {
        this.menuListAnimation.opacity(opacity).step()
        this.setData({
          menuListAnimation: this.menuListAnimation.export(),
        })
      }
      // if(isShow){
      //   setTimeout(()=>{
      //     animate();
      //   },this.data.animationDuration+200);
      // } else {
      //   animate();
      // }
      animate()
      setTimeout(() => {
        resolve()
      }, this.data.animationDuration)
    })
  },
  // endregion

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},
})
