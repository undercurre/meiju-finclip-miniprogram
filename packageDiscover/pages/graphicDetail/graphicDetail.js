// pages/graphicDetail/graphicDetail.js
//index.js
const app = getApp() //获取应用实例
import { getTimeStamp, getReqId } from 'm-utilsdk/index'
import { clickEventTracking } from '../../../track/track.js'
import { getFullPageUrl, judgeWayToMiniProgram, clickBurdPoint } from '../../../utils/util'
import { service } from 'assets/js/service'
import { requestService, rangersBurialPoint } from '../../../utils/requestService'
import { nativeService } from '../../../utils/nativeService'
import { baseImgApi, api, imgBaseUrl } from '../../../api'
import computedBehavior from '../../../utils/miniprogram-computed.js'
import { articleDetail, graphicDetail, moreComment } from '../../../utils/paths.js'
const vaasVideoKey = api.vaasVideoKey
Page({
  behaviors: [computedBehavior],
  /**
   * 页面的初始数据
   */
  data: {
    imgBaseUrl: imgBaseUrl.url,
    vaasVideoKey,
    featuredId: null, //精选id
    featuredType: null, //精选类型：1:纯文本 2:富文本 3:图片 4:视频，5:富文本+视频 视频列表只展示：富文本-2 视频-4 视频+富文本-5
    title: '',
    featuredList: [], //精选列表
    featurePageIndex: 0, //精选同标签的分页
    featuredSize: 5,
    noMore: false, //更多精选
    index: 1,
    article_dec: '', //文章正文
    isFolded: true, //不展开文章
    isExpandBtn: false, //是否有展开按钮
    showDialog: false, //是否显示评论列表和对话框
    isDiscuss: false, //是否显示无评论
    discussList: [], //评论列表
    istrue: false, //评论列表隐藏和显示
    commentCount: 0, //弹出评论列表的评论总条数
    commentCounts: 0,
    discussPage: 1,
    discussPageSize: 10,
    commentIsEnd: false,
    placeholder: '写评论...',
    nowBusinessId: null, //当前评论的业务id
    commentContent: '', //评论输入框的数据
    userName: '', //被评论人账户名
    toUser: '', //被评论人logonID
    pid: 0, //父评论id(一级评论的Id)
    isKeyboard: false, //是否调出键盘
    isLogon: null, //登录状态信息
    uid: null, //当前登录用户id
    nowVideoIndex: null,
    lastOneVideo: null, //上一个视频的索引
    isIphoneX: false,
    showSearchView: false, //防止浮层滚动穿透
    tipNoWifi: false, //是否提示非wifi状态
    once: 1, //是否提示非wifi状态 只问一次
    share: '', //是否为app分享
    isDeleted: false, //精选是否已被删除
    dialogShow: false,
    phoneNumber: '',
    unSupport: baseImgApi.url + 'img_buzhichikongzhi@3x.png',
    isNoNetWork: false,
    publishClickFlag: true, //防暴点击按钮
    totalProductDetail: [], //收集关联商品详情信息
    isHourse: true, //小木马加载中
    channelCode: '', //频道编码
    isMock: false,
    sceneList: [], //场景
    nowIndex: 0,
    isCenters: false,
    twoTitle: '确定删除该评论',
    cancleTxet: '取消',
    sureText: '确定',
    commentId: '', //删除评论id
    ids: [], //标签的id
    accountStatus: 0, //禁言状态
    canIdelet: false, //禁止频繁重复操作删除
    isAllShowing: true,
    newArray1: [], //电商产品
    canIreport: false,
    canIreportList1: [],
    canIreportList2: [],
    isShowing: false,
    common: '/mideaServices/images/icon.png',
    foldCnt: 0,
    canIenter: false,
  },
  computed: {
    commentContentFlag() {
      return this.data.commentContent.trim()
    },
  },
  // 判断账号是否禁言
  isCanIpush() {
    let self = this
    service
      .isCanIpush()
      .then((resp) => {
        let accountStatus = resp.accountStatus
        self.setData({
          accountStatus,
        })
        if (accountStatus == 0) {
          self.beforePublishDiscuss()
        } else {
          wx.showModal({
            title: '禁言提示',
            content: '该账号已被禁言，暂不支持发布评论',
            showCancel: false,
            confirmText: '我知道了',
            success(res) {
              if (res.confirm) {
                console.log(res)
              }
            },
          })
        }
      })
      .catch((error) => {
        console.log(error)
        wx.showLoading({
          title: '系统异常,请稍后重试',
          mask: true,
        })
      })
  },
  //展开全文
  change: function (e) {
    let index = e.currentTarget.dataset.index
    // let featuredContentId = e.currentTarget.dataset.featuredcontent
    let nowIsExpand = 'featuredList[' + index + '].isExpand'

    let businessId = e.currentTarget.dataset.businessid
    let title = e.currentTarget.dataset.title
    let type = e.currentTarget.dataset.type
    // 展开点击埋点
    clickEventTracking('user_behavior_event', {
      page_name: '内容详情页',
      page_id: 'page_discover_detail',
      module: '发现',
      widget_id: 'click_view_all',
      widget_name: '查看全文',
      page_path: getFullPageUrl(),
      object_type: this.showTypeDesc(type),
      object_id: businessId,
      object_name: title,
    })
    this.setData({
      [nowIsExpand]: !this.data.featuredList[index].isExpand,
    })
  },
  toMorePage() {
    let fitureObj = {
      featuredTitle: this.data.featuredTitle || '',
      featuredType: this.data.featuredType || '',
      featuredId: this.data.nowBusinessId || '',
    }
    fitureObj = JSON.stringify(fitureObj)
    wx.navigateTo({
      url: `${moreComment}?fitureObj=${fitureObj}`,
    })
    this.clickReports()
  },
  clickReports() {
    clickEventTracking('user_behavior_event', 'clickMoreComments', {
      page_path: getFullPageUrl(),
      object_type: this.showTypeDesc(this.data.featuredType),
      object_id: this.data.featuredId,
      object_name: this.data.title,
    })
  },
  bindblur() {
    this.setData({
      // isMaskShow: false,
      isKeyboard: false,
    })
    if (!this.data.commentContent) {
      this.setData({
        //回到初始状态
        commentContent: '',
        placeholder: '写评论...',
        userName: '',
        toUser: '',
        pid: 0,
        publishClickFlag: true,
      })
    }
  },
  //获取页面精品详情数据
  init: function () {
    const self = this
    wx.getNetworkType({
      success(res) {
        let networkType = res.networkType
        if (networkType == 'none') {
          self.setData({
            isDeleted: true,
            isNoNetWork: !res.isConnected,
            isHourse: false,
          })
        } else {
          self.setData({
            isDeleted: false,
            isNoNetWork: false,
            isHourse: true,
          })
          self.getGraphicDetailData()
        }
      },
    })
  },
  getGraphicDetailData() {
    this.data.isIphoneX = app.globalData.isIphoneX
    let id = this.data.featuredId

    if (app.globalData.isLogon) {
      this.setData({
        uid: app.globalData.userData.uid,
      })
    }

    if (this.data.isMock) {
      // eslint-disable-next-line no-undef
      let data = mockData.data
      this.setData({
        isHourse: false,
        featuredId: data.articleId,
        featuredType: data.articleType,
        title: data.title,
        featuredList: data,
      })
      this.setPages(data) //格式化场景、菜谱、商品
    } else {
      let data = {
        headParams: {
          tenantCode: 'T20201223044749',
        },
        restParams: {
          applicationId: 'APP202105250001EXT', //应用编码  小程序
          channelCode: this.data.channelCode ? this.data.channelCode : 'Discover01', //频道编码 食谱内容：Recipes001， 食谱作品：Recipes002， 食谱笔记：Recipes003
          articleId: id, //频道文章 +10000000     专栏20000000  玩法30000000
          returnRecommendFlag: true, //是否返回关联产品
          returnData: ['readCount', 'sharedCount', 'favoritesCount', 'evaluateCnt', 'likeCnt'], //
          userOperation: ['like'],
          extendInfo: ['label', 'relativeInfo', 'recommend', 'userInfo', 'searchWord '],
        },
      }

      //判断是否登录 调用不同接口请求
      let featuredDetailPort = app.globalData.isLogon ? 'featuredDetailIsLogin' : 'featuredDetail'
      requestService
        .request(featuredDetailPort, data)
        .then((resp) => {
          if (resp.data.code == '000000') {
            let data = resp.data.data
            let currList = []
            currList.push(data)
            // 1:纯文本 2:富文本 3:图片 4:视频
            this.setData({
              featuredId: data.articleId,
              featuredType: data.articleType,
              title: data.title,
              featuredTitle: data.title,
              featuredList: currList,
            })
            let idsList = data.label
            let ids = []
            if (idsList && idsList.length > 0) {
              idsList.forEach((item) => {
                ids.push(item.id)
              })
            }
            this.data.ids = ids
            let ups = false
            this.getFeatureByLabel(ids, ups)
            let that = this
            setTimeout(() => {
              that.setData({
                isHourse: false,
              })
            }, 600)
          }
        })
        .catch((error) => {
          this.setData({
            isHourse: false,
          })
          // eslint-disable-next-line no-constant-condition
          if ((error.data.code = 'DCP1322')) {
            this.setData({
              isDeleted: true, //显示缺省页
            })
          }
          if (this.data.collect) {
            wx.showModal({
              content: '该页面不存在',
              showCancel: false,
              success(res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                  wx.switchTab({
                    url: '/pages/index/index',
                  })
                }
              },
            })
          }
        })
    }
  },
  setPages(data) {
    // 判断有没有食谱，美云销新接口不再给食谱的数据就很麻烦。需要再调接口2021.11.16
    if (data && data.relativeList && data.relativeList.length > 0) {
      let newArray = data.relativeList.filter((item) => {
        if (item.serviceCode == 'recipe') {
          return item
        }
      })
      let newArray0 = data.relativeList.filter((item) => {
        if (item.serviceCode == 'scene') {
          return item
        }
      })
      this.setData({
        sceneList: newArray0,
      })
      if (newArray.length == 0) return
      let recipeId = []
      newArray.forEach((item) => {
        recipeId.push(item.valueId)
      })
      if (recipeId && recipeId.length > 0) {
        this.getMenuDetail(recipeId)
      }
    }
  },
  //获取菜谱详情的卡路里跟分钟
  getMenuDetail(recipeId) {
    let self = this
    service
      .getMenuDetail(recipeId)
      .then((resp) => {
        let list = resp.healthData
        self.setData({
          MenuNewArray: list,
        })
        self.reMakeArray()
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 有菜谱的时候重构数据结构
  reMakeArray() {
    let self = this
    let tempFeaturedList = self.data.featuredList
    let tempTotalProductDetail = self.data.MenuNewArray

    for (let i = 0; i < tempFeaturedList.length; i++) {
      if (tempFeaturedList[i].recipeIds) {
        for (let j = 0; j < tempTotalProductDetail.length; j++) {
          if (
            tempFeaturedList[i].recipeIds.length > 0 &&
            tempFeaturedList[i].recipeIds.includes(tempTotalProductDetail[j].recipeId)
          ) {
            tempFeaturedList[i].MenuNewArray.push(tempTotalProductDetail[j])
          }
        }
      }
    }
    self.setData({
      featuredList: tempFeaturedList,
    })
  },
  //获取到当前图片的索引
  onSlideChange: function (e) {
    let that = this
    let index = e.currentTarget.dataset.index
    let nowImgIndex = 'featuredList[' + index + '].nowImgIndex'
    //埋点
    clickBurdPoint('PD_PictureSwipe_click')
    that.setData({
      [nowImgIndex]: e.detail.current + 1,
    })
  },
  //预览图片，放大预览
  preview(event) {
    let currentUrl = event.currentTarget.dataset.src
    let index = event.currentTarget.dataset.index
    // let index2 = event.currentTarget.dataset.index2
    let imgList = this.data.featuredList[index].coverPictureList
    let newList = []
    if (imgList.length > 0) {
      imgList.forEach((item) => {
        newList.push(item.fileUrl)
      })
      wx.previewImage({
        current: currentUrl,
        urls: newList,
      })
    }
    //埋点
    clickBurdPoint('PD_EnlargementPicture_click')
  },
  //是否显示展开按钮
  isExpandBtn: function () {
    let that = this
    let query = wx.createSelectorQuery()
    let isExpandBtn
    setTimeout(() => {
      query.selectAll('.content-Desc').boundingClientRect(function (res) {
        res.forEach((item, index) => {
          if (item.height * 1 > 104) {
            isExpandBtn = 'featuredList[' + index + '].isExpandBtn'
            that.setData({
              [isExpandBtn]: true,
            })
            that.setData({
              featuredList: that.data.featuredList,
            })
          }
        })
      })
      query.exec()
    }, 800)
  },
  //带出同标签的精选
  getFeatureByLabel: function (ids, ups) {
    let getFeatureByLabelPort = app.globalData.isLogon ? 'getFeatureByLabelIsLogin' : 'getFeatureByLabel'
    let resq = {
      headParams: {
        tenantCode: 'T20201223044749',
      },
      sortList: [],
      pagination: {
        pageNo: ups ? ++this.data.discussPage : 1,
        pageSize: this.data.featuredSize,
      },
      restParams: {
        collapse: true,
        returnData: ['readCount', 'sharedCount', 'evaluateCnt', 'likeCnt'], //
        userOperation: ['like'],
        extendInfo: [
          'label',
          'relativeInfo',
          'recommend',
          'userInfo',
          'searchWord ',
          'attachment',
          'videoDuration ',
          'channelArticleMaxSort ',
          'channelArticleAmount ',
        ],
        channelCode: this.data.channelCode ? this.data.channelCode : 'Discover01', //频道编码 食谱内容：
        applicationId: 'APP202105250001EXT', //应用编码  小程序
        labelIds: ids,
        excludeArticleId: this.data.featuredId,
      },
    }
    if (!this.data.noMore) {
      let time1 = Date.parse(new Date())
      requestService.request(getFeatureByLabelPort, resq).then((resp) => {
        if (resp.data.code == '000000') {
          if (resp) {
            wx.hideLoading()
          }
          let data = resp.data.data
          // this.data.featuredSize=10
          if (data.length != this.data.featuredSize && this.data.discussPage > 1) {
            //返回数据不等于10 则没有更多了
            this.setData({
              noMore: true,
              isHourse: false,
            })
          }
          data.forEach((item) => {
            item.userOperation = item.userOperationList
          })
          let temp = this.data.featuredList
          temp = [...this.data.featuredList, ...data]
          let tempRelativeEcommerceProduct = []
          let recipeIdList = []
          //给精选列表添加一个新数组 featureImgList、一个当前显示图片索引、isExpandArticle
          temp.forEach((item) => {
            if (item.articleType == '4') {
              let featureImgList = []
              item.coverPictureList.forEach((item2) => {
                featureImgList.push(item2.fileUrl)
              })
              item.featureImgList = featureImgList
              item.nowImgIndex = 1
            }
            item.isExpandBtn = false
            item.isExpand = false

            if (item && item.relativeList && item.relativeList.length > 0) {
              // 菜谱ids
              let newArray = item.relativeList.filter((item) => {
                if (item.serviceCode === 'recipe') {
                  return item
                }
              })
              // 场景数据
              let newArray0 = item.relativeList.filter((item) => {
                if (item.serviceCode === 'scene') {
                  return item
                }
              })
              // 电商产品ids
              // let newArray1 = item.relativeList.filter((item) => {
              //   if (item.serviceCode === 'commodity') {
              //     return item
              //   }
              // })
              let recipeId = []
              // let skuids = []
              if (newArray.length > 0) {
                newArray.forEach((item) => {
                  recipeId.push(item.valueId * 1)
                })
              }
              // if (newArray1.length > 0) {
              //   newArray1.forEach((item) => {
              //     skuids.push(item.valueId * 1)
              //   })
              // }
              item.sceneList = newArray0 //每个item的场景
              item.recipeIds = recipeId // 每个item的菜谱id列表
              item.MenuNewArray = [] //菜谱详情
              item.skuinfolist = []
              // item.skuinfolistIds = skuids //电商id
            }
          })
          // 收集所有的商品id改成只收头部第一个文章的
          let skuids = []
          // 电商产品ids
          let newArray1 = temp[0].relativeList.filter((item) => {
            if (item.serviceCode === 'commodity') {
              return item
            }
          })
          this.data.newArray1 = newArray1
          if (newArray1.length > 0) {
            newArray1.forEach((item) => {
              skuids.push(item.valueId * 1)
            })
          }
          //收集关系商品id
          temp.forEach((item) => {
            // tempRelativeEcommerceProduct.push(...(item.skuinfolistIds || []))
            recipeIdList.push(...(item.recipeIds || []))
          })
          tempRelativeEcommerceProduct.push(...skuids)
          //调电商接口，获取商品详情信息

          this.getMarketDetail(tempRelativeEcommerceProduct) //所有的电商产品
          this.getMenuDetail(recipeIdList) //所有的菜谱
          this.setData({
            featuredList: temp,
          })
          this.isExpandBtn()
        }
      })
    }
  },

  //精选点赞和取消
  handleLike: function (e) {
    let index = e.currentTarget.dataset.index
    let businessId = e.currentTarget.dataset.businessid
    let title = e.currentTarget.dataset.title
    let type = e.currentTarget.dataset.type
    // let toUser = e.currentTarget.dataset.touser
    let userOperation = e.currentTarget.dataset.useroperation
    let newIsLiked = 'featuredList[' + index + '].userOperation'
    let likeCount = 'featuredList[' + index + '].attribute.likeCnt'
    let operate
    let isLike =
      !!userOperation &&
      userOperation.length > 0 &&
      userOperation[0].operationType &&
      userOperation[0].operationType == 'like' &&
      userOperation[0].operation == true
        ? 2
        : 1 //  1是没有  2是点赞了
    // 精选是否已点赞 1: 未 2: 已
    if (isLike == 1) {
      operate = 1
    } else if (isLike == 2) {
      operate = 0
    }
    let resq = {
      headParams: {
        tenantCode: 'T20201223044749',
      },
      restParams: {
        applicationId: 'APP202105250001EXT', //应用编码  小程序
        targetType: 1, //对象类型（1文章 2评论）
        // targetCode: "902239865811136512", //对象编码(文章ID)
        targetCode: businessId, //对象编码(文章ID)
        type: operate, //操作类型（1点赞 0取消点赞）
      },
    }
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    // 点赞请求前判断是否登陆
    if (app.globalData.isLogon) {
      requestService
        .request('like', resq)
        .then((resp) => {
          if (resp) {
            wx.hideLoading()
          }
          if (resp.data.code == '000000') {
            // 点赞埋点
            clickEventTracking('user_behavior_event', 'handleLike', {
              page_name: '内容详情页',
              page_id: 'page_discover_detail',
              module: '发现',
              widget_id: 'click_like_content',
              widget_name: '点赞',
              page_path: getFullPageUrl(),
              object_type: this.showTypeDesc(this.data.featuredType),
              object_id: businessId,
              object_name: title,
              ext_info: {
                like_type: isLike == 1 ? '确认点赞' : '取消点赞',
              },
            })
            if (operate == 1) {
              this.setData({
                [newIsLiked]: [
                  {
                    operation: true,
                    operationType: 'like',
                  },
                ],
                [likeCount]: ++this.data.featuredList[index].attribute.likeCnt,
              })
            } else {
              this.setData({
                [newIsLiked]: [],
                [likeCount]: --this.data.featuredList[index].attribute.likeCnt,
              })
            }
          }
        })
        .catch((error) => {
          wx.hideLoading()
          if (error.data.code == 'DCP1322') {
            wx.showToast({
              title: error.data.msg,
              icon: 'none',
              duration: 1000,
            })
          }
        })
    } else {
      //还未登录 指引用户登录
      let url = '../../../pages/logon/logon'
      wx.navigateTo({
        url: url,
      })
    }
  },
  //打开关闭评论列表
  openDialog: function (e) {
    let that = this
    this.data.discussPage = 1
    let index = e.currentTarget.dataset.index
    let businessId = e.currentTarget.dataset.businessid
    let commentCount = e.currentTarget.dataset.commentcount
    this.data.nowIndex = index
    let title = e.currentTarget.dataset.title
    let type = e.currentTarget.dataset.type

    that.setData({
      discussList: [],
      commentCount: commentCount,
      title: title,
    })
    this.data.type = type
    that.data.showSearchView = true //防止滚动穿透
    that.data.nowBusinessId = businessId
    let resq = {
      headParams: {
        tenantCode: 'T20201223044749',
      },
      sortList: [],
      pagination: {
        pageNo: this.data.discussPage,
        pageSize: this.data.discussPageSize,
      },
      restParams: {
        applicationId: 'APP202105250001EXT', //应用编码  小程序
        targetType: 1, //对象类型（1文章）
        targetCode: businessId, //对象编码(文章ID)
        levelType: 2,
        cntList: ['likeCnt', 'evaluateCnt'],
        actionList: ['like', 'evaluate'],
        searchOwnAuditing: app.globalData.isLogon ? true : false,
        searchFold: 0,
      },
    }
    let getCommentListPort = app.globalData.isLogon ? 'getCommentList4APPIsLogin' : 'getCommentList4APP'
    requestService.request(getCommentListPort, resq).then((resp) => {
      if (resp.data.code == '000000') {
        let resp_data = resp.data.data
        let commentCounts = resp.data.data.totalCnt
        //给评论列表添加一个新属性 isExpandReply是否展开所用回复
        if (resp_data.evaluateList && resp_data.evaluateList.length > 0) {
          resp_data.evaluateList.forEach((item) => {
            item.isExpandReply = false
          })
          this.setData({
            discussList: resp_data.evaluateList,
            foldCnt: resp_data.foldCnt,
            istrue: true,
            commentCounts,
          })
        } else {
          this.data.commentIsEnd = true
          this.setData({
            discussList: [],
            istrue: true,
            commentCounts,
            foldCnt: resp_data.foldCnt,
          })
        }
        //如果评论列表为空则显示没有评论
        if (this.data.discussList[index] && this.data.discussList[index].length > 0) {
          this.setData({
            isDiscuss: true,
          })
        } else {
          //如果回复列表不为空
        }
      }
    })
  },
  closeDialog: function () {
    this.setData({
      istrue: false,
      discussList: null,
    })
    this.data.showSearchView = false //接触底部冰冻
  },
  //加载更多评论
  getMoreDiscussList: function () {
    // let discussList = this.data.discussList
    if (!this.data.commentIsEnd && this.data.discussList) {
      let id = this.data.nowBusinessId
      this.data.discussPage = (Number(this.data.discussPage) + 1).toString()
      let resq = {
        headParams: {
          tenantCode: 'T20201223044749',
        },
        sortList: [],
        pagination: {
          pageNo: this.data.discussPage,
          pageSize: this.data.discussPageSize,
        },
        restParams: {
          applicationId: 'APP202105250001EXT', //应用编码  小程序
          targetType: 1, //对象类型（1文章）
          targetCode: id, //对象编码(文章ID)
          levelType: 2,
          cntList: ['likeCnt', 'evaluateCnt'],
          actionList: ['like', 'evaluate'],
          searchOwnAuditing: app.globalData.isLogon ? true : false,
          searchFold: 0,
        },
      }
      let getCommentListPort = app.globalData.isLogon ? 'getCommentList4APPIsLogin' : 'getCommentList4APP'
      requestService.request(getCommentListPort, resq).then((resp) => {
        if (resp.data.code == '000000') {
          let oldDiscussList = this.data.discussList
          let resp_data = resp.data.data.evaluateList

          if (!resp_data) {
            this.data.commentIsEnd = true
          } else {
            //给评论列表添加一个新属性 isExpandReply是否展开所用回复
            if (resp_data && resp_data.length > 0) {
              resp_data.forEach((item) => {
                item.isExpandReply = false
              })
            }
            let newList = [...oldDiscussList, ...resp_data]
            this.setData({
              discussList: newList,
              foldCnt: resp.data.data.foldCnt,
            })
          }
        }
      })
    } else {
      if (!this.data.isDiscuss) {
        wx.showToast({
          title: '暂无更多评论',
          icon: 'none',
          duration: 1000,
        })
      }
    }
  },
  //评论点赞和取消
  handleLikeComment: function (e) {
    let commentId = e.currentTarget.dataset.commentid
    let index = e.currentTarget.dataset.index
    // let isLike = e.currentTarget.dataset.islike
    let nowLikeCount = 'discussList[' + index + '].cntInfo.likeCnt'
    let nowIsLiked = 'discussList[' + index + '].actionInfo.likeFlag'
    // let operate
    // 精选是否已点赞 1: 未 2: 已
    let resq = {
      headParams: {
        tenantCode: 'T20201223044749',
      },
      restParams: {
        // applicationId: 'APP202105250001EXT', //应用编码  小程序
        targetType: 2, //对象类型（1文章 2评论）
        targetCode: commentId, //对象编码(文章ID)
        type: this.data.discussList[index].actionInfo.likeFlag == '1' ? 0 : 1, //操作类型（1点赞 0取消点赞）
      },
    }
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    requestService
      .request('likeComment', resq)
      .then((resp) => {
        if (resp.data.code == '000000') {
          if (resp) {
            wx.hideLoading()
          }
          if (this.data.discussList[index].actionInfo.likeFlag != 1) {
            this.setData({
              [nowIsLiked]: 1,
              [nowLikeCount]: ++this.data.discussList[index].cntInfo.likeCnt,
            })
          } else {
            this.setData({
              [nowIsLiked]: 0,
              [nowLikeCount]: --this.data.discussList[index].cntInfo.likeCnt,
            })
          }
        }
      })
      .catch((error) => {
        wx.hideLoading()
        if (error.data.code == 'DCP1322') {
          //精选详情不存在或已删除
          wx.showToast({
            title: error.data.msg,
            icon: 'none',
            duration: 1000,
          })
        }
      })
  },
  //发表评论前校验
  publishDiscuss() {
    this.isCanIpush()
  },
  //发表评论
  async beforePublishDiscuss() {
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    let { publishClickFlag } = this.data
    if (!publishClickFlag) return
    this.setData({
      isKeyboard: false,
      publishClickFlag: false,
    })
    let pid = this.data.pid
    let toUser = this.data.toUser
    let nowBusinessId = this.data.nowBusinessId
    let commentContent = this.data.commentContent.trim()
    let evalueNum = 'featuredList[' + this.data.nowIndex + '].attribute.evaluateCnt'
    let resq
    if (pid && toUser) {
      // 发表2级评论
      // resq = {
      //   "businessId": nowBusinessId,
      //   "pid": pid || 0,
      //   "toUser": toUser || "",
      //   "commentContent": commentContent,
      // }
      resq = {
        headParams: {
          tenantCode: 'T20201223044749',
          version: '8.5',
        },
        restParams: {
          content: commentContent,
          targetType: 2, //评论对象类型 1文章 2评论
          targetCode: pid,
        },
      }
    } else {
      // 发表1级评论
      // resq = {
      //   "businessId": nowBusinessId,
      //   "pid": 0,
      //   "toUser": "",
      //   "commentContent": commentContent,
      // }
      resq = {
        headParams: {
          tenantCode: 'T20201223044749',
          version: '8.5',
        },
        restParams: {
          applicationId: 'APP202105250001EXT',
          content: commentContent,
          targetType: 1, //评论对象类型 1文章 2评论
          targetCode: nowBusinessId,
          judgeFold: true,
        },
      }
    }
    let verifyPass = await this.articleCheckMessage(commentContent)
    if (!verifyPass) {
      wx.hideLoading()
      setTimeout(() => {
        wx.showToast({
          title: '内容含敏感词',
          icon: 'none',
          duration: 1000,
        })
      }, 100)
      let that = this
      setTimeout(() => {
        that.setData({
          publishClickFlag: true,
        })
      }, 1100)
      return
    }
    if (commentContent) {
      //输入框有内容才进行请求
      // wx.showLoading({
      //   title: '加载中',
      //   mask: true
      // })
      requestService
        .request('publishComment4APP', resq)
        .then((resp) => {
          if (resp.data.code == '000000') {
            if (resp) {
              wx.hideLoading()
              if (resp.data.data.auditTips == '发布成功') {
                wx.showToast({
                  title: '评论成功',
                  icon: 'none',
                  duration: 1000,
                })
              } else {
                wx.showToast({
                  title: '发布失败,内容不符合《美的平台社区规范》',
                  icon: 'none',
                  duration: 2000,
                })
              }
            }
            // 埋点
            clickEventTracking('user_behavior_event', 'publishDiscuss', {
              page_name: '内容详情页',
              page_id: 'page_discover_detail',
              module: '发现',
              widget_id: 'click_comment_submit',
              widget_name: '发布评论',
              page_path: getFullPageUrl(),
              object_type: this.showTypeDesc(this.data.featuredType),
              object_id: this.data.nowBusinessId,
              object_name: this.data.title,
              ext_info: {
                comment: commentContent,
              },
            })

            // 刷新评论列表
            this.updataComment()
            this.setData({
              //回到初始状态
              commentCount: ++this.data.commentCount,
              commentCounts: ++this.data.commentCounts,
              commentContent: '',
              placeholder: '写评论...',
              userName: '',
              toUser: '',
              pid: 0,
              publishClickFlag: true,
              [evalueNum]: ++this.data.featuredList[this.data.nowIndex].attribute.evaluateCnt,
            })
          }
        })
        .catch((error) => {
          wx.hideLoading()
          this.setData({
            publishClickFlag: true,
          })
          if (error.data.code == 'DCP1301') {
            wx.showToast({
              title: '内容含敏感词',
              icon: 'none',
              duration: 1000,
            })
          } else if (error.data.code == '40060') {
            wx.showToast({
              title: 'IP被列入黑名单',
              icon: 'none',
              duration: 1000,
            })
          } else if (error.data.code == 'DCP1322') {
            wx.showToast({
              title: error.data.msg,
              icon: 'none',
              duration: 1000,
            })
          } else if (error.data.code == 'DCP2301') {
            wx.showToast({
              title: '文字违规',
              icon: 'none',
              duration: 1000,
            })
          } else if (error.data.code == 'EVCS-001020') {
            wx.showToast({
              title: '评论审核中，暂不支持回复',
              icon: 'none',
              duration: 1000,
            })
          } else {
            wx.showToast({
              title: error.data.msg,
              icon: 'none',
              duration: 1000,
            })
          }
        })
    } else {
      this.setData({
        publishClickFlag: true,
      })
      wx.showToast({
        title: '输入框不能空',
        icon: 'none',
        duration: 1000,
      })
    }
  },
  //删除自己的评论
  deleteComment: function (e) {
    let that = this
    if (that.data.canIdelet) {
      wx.showToast({
        title: '请勿频繁操作',
        icon: 'none',
        duration: 1000,
      })
    } else {
      that.data.canIdelet = true
      let commentId = e.currentTarget.dataset.commentid
      // this.setData({
      //   isCenters: true,
      //   commentId,
      // })
      let resq = {
        headParams: {
          tenantCode: 'T20201223044749',
        },
        restParams: {
          applicationId: 'APP202105250001EXT', //应用编码  小程序
          evaluateId: commentId,
          // evaluateId: that.data.commentId
        },
      }
      wx.showModal({
        title: '确定删除该评论？',
        success(res) {
          //弹出成功之后
          if (res.confirm) {
            //用户点击了确认之后
            let evalueNum = 'featuredList[' + that.data.nowIndex + '].attribute.evaluateCnt'
            requestService.request('deleteComment', resq).then((resp) => {
              if (resp.data.code == '000000') {
                wx.showToast({
                  title: '删除评论成功',
                  icon: 'none',
                  duration: 1000,
                })
                that.updataComment()
                that.setData({
                  [evalueNum]: --that.data.featuredList[that.data.nowIndex].attribute.evaluateCnt,
                })
                setTimeout(() => {
                  that.data.canIdelet = false
                }, 1000)
              }
            })
          } else if (res.cancel) {
            //用户点击了取消之后
            that.data.canIdelet = false
          }
        },
      })
    }
  },
  // cancleBtn(e) {},
  // needSure(e) {
  //   let that = this
  //   let evalueNum = "featuredList[" + this.data.nowIndex + "].attribute.evaluateCnt"
  //   let resq = {
  //     headParams: {
  //       tenantCode: "T20201223044749"
  //     },
  //     restParams: {
  //       applicationId: 'APP202105250001EXT', //应用编码  小程序
  //       evaluateId: that.data.commentId
  //     },
  //   }
  //   requestService.request("deleteComment", resq).then((resp) => {
  //     if (resp.data.code == "000000") {
  //       wx.showToast({
  //         title: '删除评论成功',
  //         icon: 'none',
  //         duration: 1000,
  //       })
  //       that.updataComment()
  //       that.setData({
  //         commentCount: --that.data.commentCount,
  //         [evalueNum]: --this.data.featuredList[this.data.nowIndex].attribute.evaluateCnt
  //       })
  //     }
  //   })

  // },
  //展开所有回复
  expandReply: function (e) {
    let index = e.currentTarget.dataset.index
    let pid = e.currentTarget.dataset.pid
    let isExpandReply = 'discussList[' + index + '].isExpandReply'
    let nowChildCommentList = 'discussList[' + index + '].secondlyList'
    let getSecondaryCommentList4APPPort
    //埋点
    clickBurdPoint('PD_MoreReply_click')

    this.setData({
      [isExpandReply]: true,
    })
    return
    // eslint-disable-next-line no-unreachable
    if (app.globalData.isLogon) {
      getSecondaryCommentList4APPPort = 'getSecondaryCommentList4APPIsLogin'
    } else {
      getSecondaryCommentList4APPPort = 'getSecondaryCommentList4APP'
    }
    let resq = {
      businessId: this.data.featuredId,
      pid: pid,
      maxCommentId: '',
      specificCommentId: '',
      pageSize: this.data.discussList[index].childrenTotal,
    }
    requestService.request(getSecondaryCommentList4APPPort, resq).then((resp) => {
      if (resp.data.code == '0000') {
        let resp_data = resp.data.data.commentPageInfo.list //2级评论列表
        this.setData({
          [isExpandReply]: true,
          [nowChildCommentList]: resp_data,
        })
      }
    })
  },
  //获取被评论人数据
  getToUserData: function (e) {
    let pid = e.currentTarget.dataset.commentid
    let toUser = e.currentTarget.dataset.userid
    let userName = e.currentTarget.dataset.username
    this.setData({
      pid: pid,
      toUser: toUser,
      userName: userName,
      placeholder: '回复:' + userName,
      isKeyboard: true, //唤醒键盘
    })
  },
  // 保存输入框的值
  keepText: function (e) {
    this.setData({
      commentContent: e.detail.value,
    })
  },
  //刷新评论
  updataComment: function () {
    this.data.discussPage = 1
    let leve_one_resq = {
      headParams: {
        tenantCode: 'T20201223044749',
      },
      sortList: [],
      pagination: {
        pageNo: this.data.discussPage,
        pageSize: this.data.discussPageSize,
      },
      restParams: {
        applicationId: 'APP202105250001EXT', //应用编码  小程序
        targetType: 1, //对象类型（1文章）
        targetCode: this.data.nowBusinessId, //对象编码(文章ID)
        levelType: 2,
        cntList: ['likeCnt', 'evaluateCnt'],
        actionList: ['like', 'evaluate'],
        searchOwnAuditing: app.globalData.isLogon ? true : false,
        searchFold: 0,
      },
    }
    requestService.request('getCommentList4APPIsLogin', leve_one_resq).then((resp) => {
      if (resp.data.code == '000000') {
        let resp_data = resp.data.data
        let { articleId, totalCnt } = resp_data
        let opIndex = this.data.featuredList.findIndex((item) => {
          return item.articleId == articleId
        })
        let updateObj = `featuredList[${opIndex}].attribute.evaluateCnt`
        this.setData({
          discussList: resp_data.evaluateList,
          [updateObj]: totalCnt,
          commentCount: totalCnt,
          commentCounts: totalCnt,
        })
        //如果评论列表为空则显示没有评论
        if (!this.data.discussList || !this.data.discussList.length) {
          this.setData({
            isDiscuss: true,
          })
        } else {
          //如果回复列表不为空
          this.setData({
            isDiscuss: false,
          })
        }
      }
    })
  },
  //监听视频播放
  videoPlayLister(e) {
    let currentIndex = e.currentTarget.dataset.index
    let articleId = e.currentTarget.dataset.id
    let type = e.currentTarget.dataset.type
    let title = e.currentTarget.dataset.title
    let { featuredList } = this.data
    //暂停其他视频
    featuredList.forEach((item, index) => {
      if (item.attachmentList && item.attachmentList.length && item.articleType == 4 && currentIndex != index) {
        let playerid = `player-${item.articleId}`
        this.selectComponent(`#${playerid}`).pause()
      }
    })
    //埋点
    this.clickVideoViewTrack({
      articleId,
      type,
      title,
    })
  },
  //监听视频暂停
  videoPauseLister(e) {
    console.log('videoPauseLister=====', e)
  },
  //监听视频报错
  videoErrorLister(e) {
    console.error('videoErrorLister=====', e)
  },
  /**
   *
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    self.setData({
      featuredId: options.channelCode ? options.featuredId : Number(options.featuredId) + 10000000,
      channelCode: options.channelCode, //频道编码
      isHourse: true,
    })
    this.data.collect = options.collect ?? ''
    this.init()
  },

  //标签跳转
  labelGo: function () {
    // let labelName = e.currentTarget.dataset.labelname
    //埋点
    clickBurdPoint('PD_Tag_click')
  },
  //跳转到菜谱详情
  gotoRecipe: function (e) {
    let recipeId = e.currentTarget.dataset.recipeid
    //埋点
    clickBurdPoint('PD_TryingCard_click')
    wx.navigateTo({
      url: '../menuDetail/menuDetail?recipeId=' + recipeId,
    })
  },
  //跳转到场景
  gotoScence: function () {
    // let scenceId = e.currentTarget.dataset.scenceid
    //埋点
    clickBurdPoint('PD_TryingCard_click')
    wx.showModal({
      title: '',
      cancelText: '去下载',
      cancelColor: '#267AFF',
      confirmText: '我知道了',
      confirmColor: '#267AFF',
      content: '对场景感兴趣？\n请进入美的美居App设置场景',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
          wx.navigateTo({
            url: '../../../pages/download/download',
          })
        }
      },
    })
  },

  //返回app错误回调
  launchAppError(e) {
    if (e.detail.errMsg == 'launchApplication:fail') {
      console.loga('没装APP？')
    }
    wx.showToast({
      title: '未找到美居App，\r\n请确认您的手机是否安装。',
      icon: 'none',
      duration: 2000,
    })
    setTimeout(() => {
      wx.navigateTo({
        url: '../../../pages/download/download',
      })
    }, 2000)
  },

  /**
   * 电商拉取商品详情信息
   */
  getMarketDetail(obj) {
    let self = this
    //obj = { relativeEcommerceProduct: "15272306938692"}//测试模拟数据
    if (obj && obj.length > 0) {
      nativeService
        .getMarketProdDetail({
          disskuidlist: obj,
        })
        .then((resp) => {
          let skuinfolist = resp.skuinfolist
          for (let i = 0; i < skuinfolist.length; i++) {
            skuinfolist[i].extendFieldValue = this.data.newArray1[i].extendFieldValue
          }
          self.data.totalProductDetail = [...skuinfolist]
          this.prepareFeaturedList() //重组featuredList
        })
    }
  },
  /**
   * 重组featuredList
   */
  prepareFeaturedList() {
    let self = this
    let tempFeaturedList = this.data.featuredList
    let tempTotalProductDetail = this.data.totalProductDetail
    for (let j = 0; j < tempTotalProductDetail.length; j++) {
      tempFeaturedList[0]['skuinfolist'].push(tempTotalProductDetail[j])
    }
    // 只要需要第一个文章添加商品，其他的去掉了，单选改多选2022.5.13
    // for (let i = 0; i < tempFeaturedList.length; i++) {
    //   if (tempFeaturedList[i].skuinfolistIds) {
    //     for (let j = 0; j < tempTotalProductDetail.length; j++) {
    //       if (
    //         tempFeaturedList[i].skuinfolistIds.length > 0 &&
    //         tempFeaturedList[i].skuinfolistIds.includes(tempTotalProductDetail[j].disskuid)
    //       ) {
    //         tempFeaturedList[i]['skuinfolist'].push(tempTotalProductDetail[j])
    //       }
    //     }
    //   }
    // }
    self.setData({
      featuredList: tempFeaturedList,
    })
  },

  /**
   * 跳转到商场小程序商品详情页
   */
  gotoMarketDetail(e) {
    console.log(e)
    let fiid = e.currentTarget.dataset.fiid
    let status = e.currentTarget.dataset.status
    let extendFieldValue = e.currentTarget.dataset.extendfieldvalue
    let item = e.currentTarget.dataset.item
    let index = e.currentTarget.dataset.index

    console.log(e)
    this.toReportProduct(item, index)
    if (status == 1) return
    // let skuid = e.currentTarget.dataset.skuid
    let appId = 'wx255b67a1403adbc2'
    let path = '/page/detail/detail?itemid=' + fiid + '&mtag=' + extendFieldValue
    judgeWayToMiniProgram(appId, path)
  },
  // 点击埋点
  toReportProduct(item, index) {
    clickEventTracking('user_behavior_event', 'clickCards', {
      page_path: getFullPageUrl(),
      // object_type: '商品',
      object_id: item.disskuid,
      object_name: item.skutitle,
      rank: index + 1,
      ext_info: {
        type: this.showTypeDesc(this.data.featuredType), //内容类型，取值为：文章、视频、富文本
        title: this.data.title, //标题
        id: this.data.featuredId, //内容id
        status: item.state == 1 ? 0 : 1, //商品状态，取值为：1-已上架/0-已下架
        orig_price: item.originalprice, //商品原价
        price: item.saleprice, //商品现价
      },
    })
  },
  // 弹框显示浏览埋点
  ToastShowing() {
    clickEventTracking('user_page_view', 'toastShow', {
      page_path: getFullPageUrl(),
      object_type: this.showTypeDesc(this.data.featuredType),
      object_id: this.data.featuredId,
      object_name: this.data.title,
    })
  },
  // 点击弹出框商品
  toEnter(e) {
    console.log(e)
    let fiid = e.detail.fiid
    let state = e.detail.state
    let index = e.detail.index
    let extendFieldValue = e.detail.extendFieldValue
    let item = e.detail.item
    console.log(fiid, state, index, extendFieldValue, item)
    console.log('fiid', 'state')
    this.toReportProducts(item, index)
    if (state == 1) return
    // let skuid = e.currentTarget.dataset.skuid
    let appId = 'wx255b67a1403adbc2'
    let path = '/page/detail/detail?itemid=' + fiid + '&mtag=' + extendFieldValue
    judgeWayToMiniProgram(appId, path)
  },
  // 点击埋点
  toReportProducts(item, index) {
    clickEventTracking('user_behavior_event', 'clickCardItem', {
      page_path: getFullPageUrl(),
      // object_type: '商品',
      object_id: item.disskuid,
      object_name: item.skutitle,
      rank: index + 1,
      ext_info: {
        type: this.showTypeDesc(this.data.featuredType), //内容类型，取值为：文章、视频、富文本
        title: this.data.title, //标题
        id: this.data.featuredId, //内容id
        status: item.state == 1 ? 0 : 1, //商品状态，取值为：1-已上架/0-已下架
        orig_price: item.originalprice, //商品原价
        price: item.saleprice, //商品现价
      },
    })
  },
  closeToast() {
    console.log('关闭')
    clickEventTracking('user_behavior_event', 'clickCardItemClosed', {
      page_path: getFullPageUrl(),
      object_type: this.showTypeDesc(this.data.featuredType),
      object_id: this.data.featuredId,
      object_name: this.data.featuredTitle,
    })
  },
  touchMove() {
    this.toExposure()
  },
  // 曝光埋点
  toExposure() {
    // console.log('继续执行')
    let that = this
    wx.createIntersectionObserver(this, {
      initialRatio: 0,
      thresholds: [0],
    })
      .relativeToViewport({
        bottom: -53,
      })
      .observe('.try-title', (ret) => {
        // console.log(ret)
        if (ret.intersectionRatio > 0) {
          let canIreportList = this.data.canIreportList1
          // console.log('埋点执行')
          if (that.data.canIreportList1.indexOf('true') == -1) {
            canIreportList.push('true')
            that.data.canIreportList1 = canIreportList
            that.data.canIreportList2 = []
            that.canIreport = true
            console.log('可以上报')
            that.report()
          }
        } else {
          // console.log('因此区域')
          let canIreportList = this.data.canIreportList2
          if (that.data.canIreportList2.indexOf('false') == -1) {
            canIreportList.push('false')
            that.data.canIreportList2 = canIreportList
            that.data.canIreportList1 = []
            that.canIreport = false
            console.log('消失')
          }
        }
      })
  },
  report() {
    clickEventTracking('user_page_view', 'toastShowView', {
      page_path: getFullPageUrl(),
      object_type: this.showTypeDesc(this.data.featuredType),
      object_id: this.data.featuredId,
      object_name: this.data.title,
    })
    this.threeProducts()
  },
  // 显示3个产品的埋点
  threeProducts() {
    let newLength = this.data.totalProductDetail.length
    if (this.data.totalProductDetail.length > 3) {
      newLength = 3
    }
    for (let i = 0; i < newLength; i++) {
      rangersBurialPoint('content_exposure_event', {
        module: '发现',
        page_id: 'page_discover_detail',
        page_name: '内容详情页',
        page_path: getFullPageUrl(),
        page_module: '好物推荐',
        object_type: '商品',
        object_id: this.data.totalProductDetail[i].disskuid,
        object_name: this.data.totalProductDetail[i].skutitle,
        rank: i == 0 ? 1 : Number(i) + 1,
        ext_info: {
          type: this.showTypeDesc(this.data.featuredType), //内容类型，取值为：文章、视频、富文本
          title: this.data.title, //标题
          id: this.data.featuredId, //内容id
          status: this.data.totalProductDetail[i].state == 1 ? 0 : 1, //商品状态，取值为：1-已上架/0-已下架
          orig_price: this.data.totalProductDetail[i].originalprice, //商品原价
          price: this.data.totalProductDetail[i].saleprice, //商品现价
        },
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
    this.getLoginStatus().then(() => {
      this.setData({
        share: app.globalData.share,
      })
    })
    //设置头部背景颜色,更新头部样式
    let repeat = 3
    let timer = setInterval(() => {
      if (repeat == 0) {
        clearInterval(timer)
      } else {
        var pages = getCurrentPages() //获取加载的页面
        var currentPage = pages[pages.length - 1] //获取当前页面的对象
        var url = currentPage.route //当前页面url
        if (url == 'packageDiscover/pages/graphicDetail/graphicDetail') {
          //避免头部颜色闪动
          wx.setNavigationBarColor({
            frontColor: '#000000',
            backgroundColor: '#ffffff',
          })
        }
        repeat--
      }
    }, 1000)
    //测试电商商品详情接口
    // nativeService.getMarketProdDetail({ "itemcodelist": ["15272306938692"] }).then((resp)=> {
    // });
    // 浏览埋点
    clickEventTracking('user_page_view', {
      page_name: '内容详情页',
      page_id: 'page_discover_detail',
      module: '发现',
      object_type: this.showTypeDesc(this.data.featuredType),
      object_id: this.data.featuredId,
      object_name: this.data.title,
    })
    //折叠评论返回当前页面，更新对应文章评论完的评论总数
    if (app.globalData.updateComment) {
      console.log('更新评论数目', app.globalData.updateComment)
      let { totalCnt, articleId } = app.globalData.updateComment
      let opIndex = this.data.featuredList.findIndex((item) => {
        return item.articleId == articleId
      })
      console.log('修改的index', opIndex)
      let updateObj = `featuredList[${opIndex}].attribute.evaluateCnt`
      this.setData({
        [updateObj]: totalCnt,
      })
      app.globalData.updateComment = false
    }
  },
  showTypeDesc(num) {
    // 富文本-2 视频-4 视频+富文本-5
    // 1:纯文本 2:富文本 3:图片 4:视频，5:富文本+视频
    let result = ''
    if (num == 1) {
      result = '纯文本'
    } else if (num == 2) {
      result = '富文本'
    } else if (num == 3) {
      result = '图片'
    } else if (num == 4) {
      result = '视频'
    } else if (num == 5) {
      result = '富文本+视频'
    }
    return result
  },
  // 查看更多
  toCheckMore() {
    this.clickAllTitle()
    this.setData({
      isShowing: true,
    })
    this.ToastShowing() //弹框埋点
    this.allProducts() //弹框展示商品
  },
  // 点击全部推荐
  clickAllTitle() {
    clickEventTracking('user_behavior_event', 'clickAllTitle', {
      page_path: getFullPageUrl(),
      object_type: this.showTypeDesc(this.data.featuredType),
      object_id: this.data.featuredId,
      object_name: this.data.title,
    })
  },
  // 显示所有的埋点
  allProducts() {
    for (let i in this.data.totalProductDetail) {
      rangersBurialPoint('content_exposure_event', {
        module: '发现',
        page_id: 'page_goods_rec_pop',
        page_name: '好物推荐弹窗',
        page_path: getFullPageUrl(),
        object_type: '商品',
        object_id: this.data.totalProductDetail[i].disskuid,
        object_name: this.data.totalProductDetail[i].skutitle,
        rank: i == 0 ? 1 : Number(i) + 1,
        ext_info: {
          type: this.showTypeDesc(this.data.featuredType), //内容类型，取值为：文章、视频、富文本
          title: this.data.title, //标题
          id: this.data.featuredId, //内容id
          status: this.data.totalProductDetail[i].state == 1 ? 0 : 1, //商品状态，取值为：1-已上架/0-已下架
          orig_price: this.data.totalProductDetail[i].originalprice, //商品原价
          price: this.data.totalProductDetail[i].saleprice, //商品现价
        },
      })
    }
  },
  onAddToFavorites(res) {
    // webview 页面返回 webViewUrl
    console.log('webViewUrl: ', res.webViewUrl)
    let options = `collect=true&featuredId=${this.data.featuredId}&channelCode=${this.data.channelCode}&featuredType=${this.data.featuredType}`
    console.log('收藏连接', options)
    return {
      title: '美的美居Lite',
      imageUrl: '',
      query: options,
    }
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      istrue: false, //去更多评论页面，弹框折叠
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    //埋点
    clickBurdPoint('PD_ContentDetailsBack_click')
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let ups = true
    this.getFeatureByLabel(this.data.ids, ups)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
  goLogin: function () {
    let self = this
    if (self.data.canIenter) return
    self.data.canIenter = true
    wx.navigateTo({
      url: '../../../pages/login/login',
    })
    setTimeout(() => {
      self.data.canIenter = false
    }, 1000)
  },
  checkIsLogin() {
    this.getLoginStatus()
      .then(() => {
        if (!app.globalData.isLogon) {
          this.goLogin()
        }
      })
      .catch(() => {
        app.globalData.isLogon = false
        this.setData({
          isLogin: app.globalData.isLogon,
        })
        this.goLogin()
      })
  },
  getLoginStatus() {
    return app
      .checkGlobalExpiration()
      .then(() => {
        this.setData({
          isLogon: app.globalData.isLogon,
        })
      })
      .catch(() => {
        app.globalData.isLogon = false
        this.setData({
          isLogin: app.globalData.isLogon,
        })
      })
  },
  //评论内容校验接口
  articleCheckMessage(message) {
    let param = {
      message,
      reqId: getReqId(),
      stamp: getTimeStamp(new Date()),
    }
    return new Promise((resolve) => {
      if (!message) {
        resolve(true)
        return
      }
      requestService
        .request('articleCheckMessage', param)
        .then((res) => {
          resolve(res.data.data.verifyPass)
        })
        .catch(() => {
          this.setData({
            publishClickFlag: true,
          })
          wx.showToast({
            title: '系统超时，请稍后再试',
            icon: 'none',
            duration: 2000,
          })
        })
    })
  },
  //跳转其他页面
  goTargetPage(e) {
    //富文本-2 视频-4 视频+富文本-5
    let url
    let item = e.currentTarget.dataset.item
    let index = e.currentTarget.dataset.index
    //第一个不跳转
    if (index == 0) return
    if (item.articleType == 2 || item.articleType == 5) {
      url = articleDetail
    } else {
      url = graphicDetail
    }
    url = `${url}?featuredId=${item.articleId}&featuredType=${item.articleType}&title=${item.title}&channelCode=${item.channelCode}`
    wx.navigateTo({
      url: url,
    })
  },
  //视频点击埋点
  clickVideoViewTrack(params) {
    rangersBurialPoint('user_behavior_event', {
      module: '发现',
      page_id: 'page_discover_video', //参考接口请求参数“pageId”
      page_name: '视频详情页', //当前页面的标题，顶部的title
      page_path: getFullPageUrl(), //当前页面的URL
      page_module: '发现',
      widget_id: 'click_play_video',
      widget_name: '播放视频',
      object_type: this.showTypeDesc(params.type),
      object_id: params.articleId,
      object_name: params.title,
    })
  },
})
