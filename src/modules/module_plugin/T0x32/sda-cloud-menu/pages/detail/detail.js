// sub-package/sda-cloud-menu/pages/detail/detail.js
import { imageDomain, RecipeService, RemoteControl } from '../../js/api'
import { Utils } from '../../js/utils'
import MideaToast from '../../component/midea-toast/toast'

const app = getApp() //获取应用实例
let deviceStatusTimer = null
let isDeviceInterval = true

Page({
  /**
   * 页面的初始数据
   */
  data: {
    tipModal: {
      isShow: false,
      title: '',
      content: '',
    },
    urlParams: {},
    descMaxLength: 50,
    ingredientUnitType: 'accurate',
    isIpx: app.globalData.isPx,
    seeMoreText: '收起',
    isShowAllContent: false,
    hasShowAllLabel: true,
    tempContent: '',
    recipeDesc:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni obcaecati reprehenderit excepturi debitis itaque! Ratione voluptates voluptas odit ab repudiandae unde, tempora iusto magnam, laboriosam cum illo quos? Perspiciatis, aliquid.',
    firstFour: [
      { name: '热量', value: '--', unitName: '千卡', nrv: '0' },
      { name: '蛋白质', value: '--', unitName: '克', nrv: '0' },
      { name: '脂肪', value: '--', unitName: '克', nrv: '0' },
      { name: '碳水化合物', value: '--', unitName: '克', nrv: '0' },
    ],
    animationData: {},
    isShowNutritionDetail: false,
    more: 'https://ce-cdn.midea.com/ccs/icon/ctrl6/sdaUi/direction-down.png',
    isInit: true,
    menuDetailData: {
      imageUrl: '',
      name: '--',
    },
    navBarModel: {
      heightLimit: 200,
      title: '',
      bgColor: '',
      isShowBgTransparent: true,
      arrowColor: '#ffffff',
    },
    iconUrl: {
      nrv: imageDomain + '/0x32/btn-nrv.png',
      close: imageDomain + '0x32/icon_step_close.png',
    },
    searchInfo: [
      {
        name: '预计耗时',
        value: '--',
      },
      {
        name: '难易度',
        value: '--',
      },
      {
        name: '适合人数',
        value: '--',
      },
    ],
    nutritionInfo: [
      {
        name: '热量',
        value: '--',
      },
      {
        name: '蛋白质',
        value: '--',
      },
      {
        name: '脂肪',
        value: '--',
      },
      {
        name: '碳水化合物',
        value: '--',
      },
    ],
    // 主料
    ingredientList: [],
    // 辅料
    ingredientHelpList: [],
    stepList: [],
    cardComponent: null,
    deviceInfo: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('页面参数: ', options)
    this.setData({
      urlParams: options,
    })
    this.updateStatus(options)
    Utils.rangersBurialPointClick('plugin_page_view', {
      page_name: '食谱详情页',
    })
    // 获取食谱详情
    this.getRecipeDetail()
  },

  // region 方法
  updateStatus(options) {
    if (!options) {
      options = this.data.urlParams
    }
    let pages = getCurrentPages()
    let pluginIndexPageIndex = pages.findIndex((item) => item.route.match(/plugin\/T0x(.*)\/index\/index/g))
    if (pluginIndexPageIndex > -1) {
      let getStatus = () => {
        let pluginIndexPage = pages[pluginIndexPageIndex]
        // 获取插件页实例
        let cardComponent = pluginIndexPage.selectComponent('.component' + options.applianceId)
        if (cardComponent) {
          this.setData({ cardComponent })
          // console.log('获取插件页实例: ', cardComponent)
          // 获取设备状态
          let deviceInfo = cardComponent.data.deviceInfo
          this.setData({ deviceInfo })
        }
      }
      // 获取设备状态
      getStatus()
      this.destroyTimer()
      deviceStatusTimer = setInterval(() => {
        if (isDeviceInterval) {
          getStatus()
        }
      }, 5000)
    } else {
      MideaToast('找不到设备状态~')
    }
  },
  // 销毁定时器
  destroyTimer() {
    if (deviceStatusTimer) {
      clearInterval(deviceStatusTimer)
      deviceStatusTimer = null
    }
  },
  // 点击Nrv
  onClickNrv() {
    this.showTipModal({
      title: '【NRV】名词解释',
      content:
        '中国食品标签营养素参考值(Nutrient Reference Values, NRV， 以下简称“营养素参考值”)是食品营养标签上比较食品营养素含量多少的参考标准,是消费者选择食品时的一种营养参照尺度。营养素参考值依据我国居民膳食营养素推荐摄入量(RNI)和适宜摄入量(AI)而制定。',
    })
  },
  // 显示或隐藏提示框
  showTipModal(options) {
    let tipModal = this.data.tipModal
    tipModal.isShow = true
    if (options) {
      tipModal.title = options.title || tipModal.title
      tipModal.content = options.content || tipModal.content
    }
    this.setData({ tipModal })
  },
  closeTipModal() {
    let tipModal = this.data.tipModal
    tipModal.isShow = false
    this.setData({ tipModal })
  },
  // 监听页面滚动
  throttle(fn, interval) {
    var enterTime = 0 //触发的时间
    var gapTime = interval || 300 //间隔时间，如果interval不传，则默认300ms
    return function () {
      var context = this
      var backTime = new Date() //第一次函数return即触发的时间
      if (backTime - enterTime > gapTime) {
        fn.call(context, arguments)
        enterTime = backTime //赋值给第一次触发的时间，这样就保存了第二次触发的时间
      }
    }
  },
  onPageScroll(event) {
    // console.log('监听页面滚动: ',event);
    let scrollTop = event.scrollTop
    let { navBarModel, menuDetailData } = this.data
    let opacity = Number((scrollTop / navBarModel.heightLimit).toFixed(1))
    if (opacity > 1) {
      opacity = 1
    }
    if (opacity === 0) {
      navBarModel.title = ''
      navBarModel.isShowBgTransparent = true
      navBarModel.arrowColor = '#ffffff'
      this.setData({ navBarModel })
    }
    if (opacity === 1) {
      navBarModel.title = menuDetailData.name
      navBarModel.isShowBgTransparent = false
      navBarModel.bgColor = 'rgba(255,255,255,' + opacity + ')'
      navBarModel.arrowColor = '#000000'
      this.setData({ navBarModel })
    }
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
  // 启动食谱
  onClickStart() {
    const { urlParams } = this.data
    // 获取插件页
    let pages = getCurrentPages()
    let pluginIndexPageIndex = pages.findIndex((item) => item.route.match(/plugin\/T0x(.*)\/index\/index/g))
    if (pluginIndexPageIndex > -1) {
      let pluginIndexPage = pages[pluginIndexPageIndex]
      // 获取插件页实例
      let cardComponent = pluginIndexPage.selectComponent('.component' + urlParams.applianceId)
      console.log('获取插件页实例: ', cardComponent)
      let deviceInfo = cardComponent.data.deviceInfo
      // 判断能否启动
      if (!Utils.isEnabledToStart(urlParams.applianceType, deviceInfo)) {
        return
      }
      // 启动设备
      let controlParams = Utils.getStartCloudControlParams({
        recipeCode: urlParams.id,
        applianceType: urlParams.applianceType,
      })
      if (!controlParams) {
        wx.showToast({
          title: '参数未定义',
          icon: 'none',
        })
        return
      }
      wx.showLoading()
      Utils.rangersBurialPointClick('plugin_button_click', {
        element_content: '启动食谱',
        params: {
          ...urlParams,
          menuType: 'cloud',
          controlParams: controlParams,
        },
      })
      RemoteControl.work({
        ...urlParams,
        menuType: 'cloud',
        controlParams: controlParams,
      })
        .then(async (res) => {
          if (!res.data.errorCode) {
            let rtnData = JSON.parse(res.data.result.returnData)
            console.log('启动设备 解析后: ', rtnData)
            if (!rtnData.code) {
              // 调用插件页插件实例查询状态方法
              cardComponent.updateStatus && (await cardComponent.updateStatus())
              if (cardComponent.goToWorkStatus) {
                let isLoadingCloudMenu = cardComponent.data.isLoadingCloudMenu
                if (!isLoadingCloudMenu) {
                  wx.hideLoading()
                  cardComponent.goToWorkStatus(true)
                } else {
                  wx.showLoading()
                  let jumpTimer = setInterval(() => {
                    isLoadingCloudMenu = cardComponent.data.isLoadingCloudMenu
                    if (!isLoadingCloudMenu) {
                      wx.hideLoading()
                      clearInterval(jumpTimer)
                      cardComponent.goToWorkStatus(true)
                    }
                  }, 1000)
                }
              } else {
                // 返回插件页
                wx.navigateBack({
                  delta: pages.length - pluginIndexPageIndex - 1,
                })
              }
              // 回到顶部
              setTimeout(() => {
                cardComponent.scrollToTop && cardComponent.scrollToTop()
              }, 500)
            }
          } else {
            wx.showToast({
              title: '启动失败~',
              icon: 'none',
            })
          }
        })
        .catch((err) => {
          wx.hideLoading()
          console.error('启动失败: ', err)
          wx.showToast({
            title: '启动失败...',
            icon: 'none',
          })
        })
    } else {
      wx.showToast({
        title: '没找到插件页...',
        icon: 'none',
      })
    }
  },
  // 切换单位
  onChangeUnit(event) {
    console.log('切换单位: ', event)
    let model = event.currentTarget.dataset
    this.updateIngredient(this.data.menuDetailData.origin.foods, model.type)
    Utils.rangersBurialPointClick('plugin_button_click', {
      element_content: '切换单位',
      params: {
        ingredientUnitType: model.type,
      },
    })
    this.setData({
      ingredientUnitType: model.type,
    })
  },
  // 食材清单赋值
  updateIngredient(foods, ingredientUnitType) {
    // let {ingredientList,ingredientHelpList} = this.data;
    let ingredientList = []
    let ingredientHelpList = []
    foods.forEach((item) => {
      let targetItem = {
        name: item.foodName,
        value: '',
      }
      switch (ingredientUnitType) {
        case 'accurate':
          // 标准单位
          targetItem.value = item.accurateWeight + item.accurateUnit
          break
        case 'general':
          // 通俗单位
          targetItem.value = item.generalWeight + item.generalUnit
          break
      }
      switch (item.foodType) {
        case 1:
          // 主料
          ingredientList.push(targetItem)
          break
        case 2:
          // 辅料
          ingredientHelpList.push(targetItem)
          break
      }
    })
    this.setData({ ingredientList, ingredientHelpList })
  },
  // 获取食谱详情
  getRecipeDetail() {
    const { urlParams } = this.data
    wx.showLoading()
    RecipeService.recipeDetail({
      ...urlParams,
      recipeCode: urlParams.id,
    })
      .then((res) => {
        wx.hideLoading()
        if (!res.data.errorCode) {
          let rtnData = JSON.parse(res.data.result.returnData)
          console.log('获取食谱详情 解析后: ', rtnData)
          if (!rtnData.errorCode) {
            let recipeData = rtnData.data
            let { menuDetailData, searchInfo, firstFour, nutritionInfo } = this.data
            menuDetailData.origin = recipeData
            // 基本信息赋值
            menuDetailData.imageUrl = recipeData.info.thumbnailUrl43
            menuDetailData.name = recipeData.info.recipeName
            menuDetailData.description = recipeData.info.description
            menuDetailData.tips = recipeData.info.tips
            // 折叠描述
            let txtCntIndex = menuDetailData.description.length
            let descMaxLength = this.data.descMaxLength
            let hasShowAllLabel = txtCntIndex > descMaxLength
            if (hasShowAllLabel) {
              menuDetailData.description = recipeData.info.description.substr(0, descMaxLength) + '...'
            }
            this.setData({
              recipeDesc: recipeData.info.description,
              isShowAllContent: hasShowAllLabel,
              hasShowAllLabel: hasShowAllLabel,
            })
            menuDetailData.author = {
              avatar: recipeData.user.profileUrl,
              name: recipeData.user.nickName,
            }
            // 简介参数赋值
            let costTimeHour = Math.floor(recipeData.info.costTimeMin / 60)
            let costTimeMin = Math.ceil(recipeData.info.costTimeMin % 60)
            searchInfo[0].value =
              (costTimeHour ? costTimeHour + '小时' : '') + (costTimeMin ? costTimeMin + '分钟' : '')
            searchInfo[1].value = recipeData.info.difficulty
            searchInfo[2].value = recipeData.info.person + '人份'
            // 能量数值赋值
            recipeData.nutritions.forEach((nutritionItem) => {
              let nutritionValue = 0
              if (nutritionItem.value) {
                nutritionValue = Number(Number(nutritionItem.value).toFixed(1))
              }
              switch (nutritionItem.key) {
                case 'energy':
                  firstFour[0].value = nutritionValue
                  firstFour[0].nrv = nutritionItem.nrv
                  nutritionInfo[0].value = nutritionValue + nutritionItem.unitName
                  break
                case 'protein':
                  firstFour[1].value = nutritionValue
                  firstFour[1].nrv = nutritionItem.nrv
                  nutritionInfo[1].value = nutritionValue + nutritionItem.unitName
                  break
                case 'fat':
                  firstFour[2].value = nutritionValue
                  firstFour[2].nrv = nutritionItem.nrv
                  nutritionInfo[2].value = nutritionValue + nutritionItem.unitName
                  break
                case 'carbohydrate':
                  firstFour[3].value = nutritionValue
                  firstFour[3].nrv = nutritionItem.nrv
                  nutritionInfo[3].value = nutritionValue + nutritionItem.unitName
                  break
              }
            })
            // 食材清单赋值
            this.updateIngredient(recipeData.foods, this.data.ingredientUnitType)
            // 食谱步骤赋值
            let stepList = []
            recipeData.keySteps.forEach((stepItem) => {
              stepList.push({
                pic: stepItem.photoUrl,
                desc: stepItem.description,
              })
            })
            this.setData({
              menuDetailData,
              searchInfo,
              nutritionInfo,
              firstFour,
              stepList,
            })
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
  },
  // 展开
  onClickSeeMore() {
    let descMaxLength = this.data.descMaxLength
    let { menuDetailData } = this.data
    if (this.data.isShowAllContent) {
      menuDetailData.description = this.data.recipeDesc
      this.setData({
        isShowAllContent: false,
        menuDetailData,
      })
    } else {
      menuDetailData.description = this.data.recipeDesc.substr(0, descMaxLength) + '...'
      this.setData({
        isShowAllContent: true,
        menuDetailData,
      })
    }
  },
  onClickMoreImg() {
    let isShowNutritionDetail = this.data.isShowNutritionDetail
    // var animation = wx.createAnimation({
    //   duration: 1000,
    //   timingFunction: 'ease',
    // })

    // this.animation = animation
    // if (isShowNutritionDetail) {
    //   animation.height(0).step()
    // }else{
    //   animation.height(200).step()
    // }
    if (isShowNutritionDetail) {
      this.setData({
        more: 'https://ce-cdn.midea.com/ccs/icon/ctrl6/sdaUi/direction-down.png',
      })
    } else {
      this.setData({
        more: 'https://ce-cdn.midea.com/ccs/icon/ctrl6/sdaUi/direction-up.png',
      })
    }

    this.setData({
      isShowNutritionDetail: !this.data.isShowNutritionDetail,
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
