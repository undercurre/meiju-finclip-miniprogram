const app = getApp() //获取应用实例
import computedBehavior from '../../../utils/miniprogram-computed.js'
import { nativeService } from '../../../utils/nativeService'
import { service } from 'assets/js/service'
import { requestService, rangersBurialPoint } from '../../../utils/requestService'
import { getReqId, getTimeStamp, getParameters } from 'm-utilsdk/index'
import { clickBurdPoint, getFullPageUrl, judgeWayToMiniProgram } from '../../../utils/util'
import { clickEventTracking } from '../../../track/track.js'
import { mockData } from './assets/js/mockData.js'
const WxParse = require('../../wxParse/wxParse.js')
import { baseImgApi, api, imgBaseUrl } from '../../../api'
import { graphicDetail, articleDetail, menuDetail, moreComment } from '../../../utils/paths'
const vaasVideoKey = api.vaasVideoKey
Page({
  behaviors: [computedBehavior],
  /**
   * 页面的初始数据
   */
  data: {
    imgBaseUrl: imgBaseUrl.url,
    vaasVideoKey,
    isMock: false,
    featuredType: null, //精选类型：1:纯文本 2:富文本 3:图片 4:视频，5:富文本+视频
    featuredId: null, //精选ID
    title: '',
    featureCover: {}, //头图信息
    featuredTitle: '', //文章标题
    isLike: null, //精选是否已点赞 1:未 2:已
    userHeader: '',
    nickName: '',
    creationDate: '',
    featuredContentId: null, //文章内容ID
    nodes: null, //富文本
    isFold: false, // 文字是否收起，默认收起
    is_show_expand_btn: true, // 默认无展开按钮
    label: [], //标签
    recipe: [], //食谱相关
    relativeScence: '', //场景相关
    likeCount: '', //点赞数
    difficulty: {
      //难易度
      // 1: "简单",
      // 2: "较简单",
      // 3: "中等",
      // 4: "较困难",
      // 5: "困难"
      1: '容易',
      2: '中等',
      3: '困难',
      4: '较难',
    },
    isDiscuss: false, //是否有评论
    discussList: [], //评论列表的数据
    discussPage: 1,
    discussPageSize: 50,
    commentIsEnd: false,
    placeholder: '写评论...',
    commentContent: '', //评论输入框的数据
    userName: '', //被评论人账户名
    toUser: '', //被评论人logonID
    pid: 0, //父评论id(一级评论的Id)
    isKeyboard: false, //是否调出键盘
    isLogon: null, //登录状态信息
    uid: null, //当前登录用户id
    statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'], //顶部状态栏的高度
    isIphoneX: false,
    share: '', //是否为app分享
    isDeleted: false, //精选是否已被删除
    dialogShow: false,
    phoneNumber: '',
    relativeEcommerceProduct: '',
    relativeEcommerceSkuIds: '',
    linkProductDetail: {},
    unSupport: baseImgApi.url + 'img_buzhichikongzhi@3x.png',
    playIcon: baseImgApi.url + 'best_ic_video@3x.png',
    isNoNetWork: false,
    appletLink: null, //外链信息
    publishClickFlag: true, //防暴点击按钮
    isHourse: true, //小木马加载中
    objDetails: '',
    isMaskShow: false, //点击评论出现遮罩层
    maxLength: null, //评论数据总条数
    channelCode: '', //频道编码
    MenuNewArray: [], //单独的菜
    sceneList: [], //场景
    isCenters: false,
    // oneTitle:'',
    twoTitle: '确定删除该评论',
    cancleTxet: '取消',
    sureText: '确定',
    commentId: '', //删除评论id
    coverAttachmentInfo: null, //视频信息
    richtextVideoList: [], //富文本视频暂存
    accountStatus: 0, //禁言状态
    canIdelet: false,
    isShowing: false,
    newArray0: [], //筛选出来的电商产品相关信息
    canIreport: false,
    canIreportList1: [],
    canIreportList2: [],
    foldCnt: 0,
    common: '/mideaServices/images/icon.png',
    canIenter: false,
    collect: null,
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
        self.data.accountStatus = accountStatus
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
  toMorePage() {
    let fitureObj = {
      featuredTitle: this.data.featuredTitle || '',
      featuredType: this.data.featuredType || '',
      featuredId: this.data.featuredId || '',
    }
    fitureObj = JSON.stringify(fitureObj)
    wx.navigateTo({
      url: `${moreComment}?&fitureObj=${fitureObj}`,
    })
    this.clickReports()
  },
  clickReports() {
    clickEventTracking('user_behavior_event', 'clickMoreComments', {
      page_path: getFullPageUrl(),
      object_type: this.showTypeDesc(this.data.featuredType),
      object_id: this.data.featuredId,
      object_name: this.data.featuredTitle,
    })
  },
  bindfocus() {
    this.getLoginStatus().then(() => {
      if (app.globalData.isLogon) {
        this.setData({
          isMaskShow: true,
          isKeyboard: true,
        })
      }
    })
  },
  bindblur() {
    this.setData({
      isMaskShow: false,
      isKeyboard: false,
    })
    if (!this.data.commentContent) {
      this.setData({
        //回到初始状态
        commentContent: '',
        placeholder: '写评论...',
      })
      this.data.userName = ''
      this.data.toUser = ''
      this.data.pid = 0
      this.data.publishClickFlag = true
    }
  },
  //获取页面精品详情数据
  init: function () {
    let self = this
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
            // isDeleted: false,
            isNoNetWork: false,
            isHourse: true,
          })
          self.getArticleData()
        }
      },
    })
  },
  collectErrorTip() {
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
  },
  getArticleData() {
    const featuredId = this.data.featuredId
    this.setData({
      isLogon: app.globalData.isLogon,
    })
    if (this.data.isLogon) {
      this.setData({
        uid: app.globalData.userData.uid,
      })
    }
    if (this.data.isMock) {
      let data = mockData.choiceManage.data.data
      this.setPageData(data)
      this.is_show_expand_btn()
    } else {
      let id = featuredId
      let data = {
        headParams: {
          tenantCode: 'T20201223044749',
        },
        restParams: {
          applicationId: 'APP202105250001EXT', //应用编码  小程序
          channelCode: this.data.channelCode ? this.data.channelCode : 'Discover01', //频道编码 食谱内容：Recipes001， 食谱作品：Recipes002， 食谱笔记：Recipes003
          articleId: featuredId, //频道文章 +10000000     专栏20000000  玩法30000000
          returnRecommendFlag: true, //是否返回关联产品
          returnData: ['readCount', 'sharedCount', 'favoritesCount', 'evaluateCnt', 'likeCnt'], //
          userOperation: ['like'],
          extendInfo: ['label', 'relativeInfo', 'recommend', 'userInfo', 'searchWord '],
        },
      }
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
          targetCode: id, //对象编码(文章ID)
          levelType: 2,
          cntList: ['likeCnt', 'evaluateCnt'],
          actionList: ['like', 'evaluate'],
          searchOwnAuditing: app.globalData.isLogon ? true : false,
          searchFold: 0,
        },
      }
      //判断是否登录 调用不同接口请求
      let featuredDetailPort = this.data.isLogon ? 'featuredDetailIsLogin' : 'featuredDetail'
      let getCommentListPort = this.data.isLogon ? 'getCommentList4APPIsLogin' : 'getCommentList4APP'
      console.log('文章请求参数', data)
      console.log('文章请求参数featuredDetailPort', featuredDetailPort)
      requestService
        .request(featuredDetailPort, data)
        .then((resp) => {
          if (resp.data.code == '000000') {
            let resq_data = resp.data.data
            this.setPageData(resq_data)

            //拉取电商商品详情信息
            if (resq_data && resq_data.relativeList && resq_data.relativeList.length > 0) {
              let newArray0 = resq_data.relativeList.filter((item) => {
                if (item.serviceCode == 'commodity') {
                  return item
                }
              })
              this.data.newArray0 = newArray0
              let skuids = []
              if (newArray0.length > 0) {
                newArray0.forEach((item) => {
                  skuids.push(item.valueId * 1)
                })
              }
              this.getMarketDetail(skuids)
            }
          }
          let self = this
          setTimeout(() => {
            self.is_show_expand_btn()
          }, 800)
          setTimeout(() => {
            self.setData({
              isHourse: false,
            })
          }, 200)
        })
        .catch((error) => {
          this.setData({
            isHourse: false,
          })
          if (error.data.code == 'DCP1322') {
            //精选详情不存在或已删除
            this.setData({
              isDeleted: true, //显示缺省页
            })
          } else {
            this.setData({
              isDeleted: true, //显示缺省页
            })
          }
          console.log('收藏报错', error)
          this.collectErrorTip()
          return
        })
      requestService.request(getCommentListPort, leve_one_resq).then((resp) => {
        if (resp.data.code == '000000') {
          let resp_data = resp.data.data
          //给评论列表添加一个新属性 isExpandReply是否展开所用回复
          if (resp_data.evaluateList && resp_data.evaluateList.length > 0) {
            resp_data.evaluateList.forEach((item) => {
              item.isExpandReply = false
            })
            this.setData({
              discussList: resp_data.evaluateList,
              foldCnt: resp_data.foldCnt,
            })
          } else {
            this.setData({
              discussList: [],
            })
            this.data.commentIsEnd = true
          }
          //如果评论列表为空则显示没有评论
          if (!this.data.discussList.length) {
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
    }
  },
  //初始化 设置页面参数 data为请求回的对象
  setPageData: function (resp_data) {
    let data = resp_data
    // this.imgDirection(data.featureCover.coverUrl)
    this.data.objDetails = data
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
      if (newArray.length) {
        let recipeId = []
        newArray.forEach((item) => {
          recipeId.push(item.valueId)
        })
        if (recipeId && recipeId.length > 0) {
          this.getMenuDetail(recipeId)
        }
      }
    }
    this.data.label = data.labelList //标签
    this.data.relativeScence = data.relativeScence // 相关场景  食谱  商品
    this.setData({
      featuredType: data.articleType, //内容类型 1:纯文本 2:富文本 3:图片 4:视频
      userHeader: data.author ? data.author.headPortrait : '', //  头像
      nickName: data.author ? (data.author.authorName ? data.author.authorName : data.nickName) : '', //创建人
      creationDate: data.createTime.split(' ', 1), //创建时间
      featuredContentId: data.channelArticleId, //文章id
      nodes: data.content, //富文本
      likeCount: data.attribute ? data.attribute.likeCnt : 0, //点赞
      featuredTitle: data.title, // 标题
      isLike:
        data.userOperation.length > 0 &&
        data.userOperation[0].operationType &&
        data.userOperation[0].operationType == 'like'
          ? 2
          : 1, //  1是没有  2是点赞了
      coverAttachmentInfo: data.attachmentList && data.attachmentList.length ? data.attachmentList[0] : {},
    })
    this.data.featureCover = data.coverPictureList ? data.coverPictureList[0] : '' //封面图  ？
    this.data.coverFlag = data.coverFlag //是否有封面图
    this.data.appletLink = data.linkList // 链接地址   jumpType1H5 2小程序 3自定义
    this.makeUserPageViewTrack(data)
    WxParse.wxParse('article', 'html', this.data.nodes, this, 5)
  },
  //获取菜谱详情的卡路里跟分钟
  getMenuDetail(recipeId) {
    let self = this
    service
      .getMenuDetails(recipeId)
      .then((resp) => {
        let list = resp.healthData
        self.setData({
          MenuNewArray: list,
        })
      })
      .catch((error) => {
        console.log(error)
      })
  },
  //判断图片方向
  imgDirection: function (path) {
    wx.getImageInfo({
      src: path,
      success: (res) => {
        console.log('图片的方向++++++', res)
      },
    })
  },
  // 收起/展开按钮点击事件
  toggle: function () {
    clickEventTracking('user_behavior_event', 'toggle', {
      page_name: '内容详情页',
      page_id: 'page_discover_detail',
      module: '发现',
      widget_id: 'click_view_all',
      widget_name: '查看全文',
      page_path: getFullPageUrl(),
      object_type: this.showTypeDesc(this.data.featuredType),
      object_id: this.data.featuredId,
      object_name: this.data.objDetails.featuredTitle ? this.data.objDetails.featuredTitle : this.data.title,
    })
    this.setData({
      isFold: !this.data.isFold,
    })
  },
  //判断是否显示展开正文按钮
  is_show_expand_btn: function () {
    let self = this
    let query = wx.createSelectorQuery()
    query.select('#article-main').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function (res) {
      if (res[0].height * 1 > 2000) {
        self.setData({
          is_show_expand_btn: false,
          isFold: true,
        })
      }
    })
  },
  //评论点赞和取消
  handleLikeComment: function (e) {
    let commentId = e.currentTarget.dataset.commentid
    let index = e.currentTarget.dataset.index
    // let isLike = e.currentTarget.dataset.islike
    let nowLikeCount = 'discussList[' + index + '].cntInfo.likeCnt'
    let nowIsLiked = 'discussList[' + index + '].actionInfo.likeFlag'
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
        if (resp) {
          wx.hideLoading()
        }
        if (resp.data.code == '000000') {
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
  //精选点赞和取消
  handleLike: function () {
    let operate
    // 精选是否已点赞 1: 未 2: 已
    if (this.data.isLike == '1') {
      operate = 1
    } else if (this.data.isLike == '2') {
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
        targetCode: this.data.featuredId, //对象编码(文章ID)
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
              object_id: this.data.featuredId,
              object_name: this.data.objDetails.featuredTitle ? this.data.objDetails.featuredTitle : this.data.title,
              ext_info: {
                like_type: this.data.isLike == 1 ? '确认点赞' : '取消点赞',
              },
            })
            if (this.data.isLike == '1') {
              this.setData({
                isLike: 2,
                likeCount: ++this.data.likeCount,
              })
            } else {
              this.setData({
                isLike: 1,
                likeCount: --this.data.likeCount,
              })
            }
          }
        })
        .catch((error) => {
          console.log(error)
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
    }
  },
  //展开所有回复
  expandReply: function (e) {
    let index = e.currentTarget.dataset.index
    // let pid = e.currentTarget.dataset.pid
    let isExpandReply = 'discussList[' + index + '].isExpandReply'
    // let nowChildCommentList = 'discussList[' + index + '].secondlyList'
    // let getSecondaryCommentList4APPPort
    //埋点
    clickBurdPoint('PD_MoreReply_click')
    this.setData({
      [isExpandReply]: true,
    })
  },
  //上划加载更多评论
  getMoreDiscussList: function () {
    // let discussList = this.data.discussList
    // let maxLength = this.data.maxLength
    if (this.data.discussList && !this.data.commentIsEnd) {
      let id = this.data.featuredId

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
      let getCommentListPort = this.data.isLogon ? 'getCommentList4APPIsLogin' : 'getCommentList4APP'
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
    })
    this.data.publishClickFlag = false
    let pid = this.data.pid
    let toUser = this.data.toUser
    let businessId = this.data.featuredId //写死了
    let resq
    let commentContent = this.data.commentContent.trim()
    if (pid && toUser) {
      // 发表2级评论
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
      resq = {
        headParams: {
          tenantCode: 'T20201223044749',
          version: '8.5',
        },
        restParams: {
          applicationId: 'APP202105250001EXT',
          content: commentContent,
          targetType: 1, //评论对象类型 1文章 2评论
          targetCode: businessId,
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
        that.data.publishClickFlag = true
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
                  duration: 1000,
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
              object_id: this.data.featuredId,
              object_name: this.data.objDetails.featuredTitle ? this.data.objDetails.featuredTitle : this.data.title,
              ext_info: {
                comment: commentContent,
              },
            })
            // 刷新评论列表
            this.updataComment()
            this.setData({
              //回到初始状态
              commentContent: '',
              placeholder: '写评论...',
            })
            this.data.toUser = ''
            this.data.userName = ''
            this.data.pid = 0
            this.data.publishClickFlag = true
            //如果是1级评论 滚动到最新评论处
            if (!pid && !toUser) {
              let query = wx.createSelectorQuery().in(this)
              query.selectViewport().scrollOffset()
              query.select('#discuss-title').boundingClientRect()
              query.exec(function (res) {
                var miss = res[0].scrollTop + res[1].top - 10
                wx.pageScrollTo({
                  scrollTop: miss,
                  duration: 300,
                })
              })
            }
          }
        })
        .catch((error) => {
          wx.hideLoading()
          this.data.publishClickFlag = true
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
      this.data.publishClickFlag = true
      wx.showToast({
        title: '输入框内容不能为空',
        icon: 'none',
        duration: 1000,
      })
    }
  },
  //获取被评论人数据
  getToUserData: function (e) {
    let pid = e.currentTarget.dataset.commentid
    let toUser = e.currentTarget.dataset.userid
    let userName = e.currentTarget.dataset.username
    this.setData({
      placeholder: '回复:' + userName,
      isKeyboard: true, //唤醒键盘
      isMaskShow: true,
    })
    this.data.toUser = toUser
    this.data.userName = userName
    this.data.pid = pid
  },
  // 保存输入框的值
  keepText: function (e) {
    this.setData({
      commentContent: e.detail.value,
    })
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
            requestService.request('deleteComment', resq).then((resp) => {
              if (resp.data.code == '000000') {
                wx.showToast({
                  title: '删除评论成功',
                  icon: 'none',
                  duration: 1000,
                })
                setTimeout(() => {
                  that.data.canIdelet = false
                }, 1000)
                that.updataComment()
              }
            })
          } else if (res.cancel) {
            //用户点击了取消之后
            console.log('用户点击取消')
          }
        },
      })
    }
  },
  // cancleBtn(e) {

  // },
  // needSure(e) {
  //   let that = this;
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
  //     }
  //   })
  // },
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
        targetCode: this.data.featuredId, //对象编码(文章ID)
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
        this.setData({
          discussList: resp_data.evaluateList,
          // maxLength: resp_data.totalCnt
        })
        //如果评论列表为空则显示没有评论
        if (!this.data.discussList.length) {
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
  clickHidden() {
    this.setData({
      isMaskShow: false,
    })
  },
  //返回上一页
  back: function () {
    wx.navigateBack({})
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
          wx.navigateTo({
            url: '../../../pages/download/download',
          })
        }
      },
    })
  },

  // ------兼容适配--------
  adaptation: function () {
    let that = this
    wx.getSystemInfo({
      success: function (res) {
        //model中包含着设备信息
        if (res.safeArea.top > 20) {
          that.setData({
            isIphoneX: true,
          })
        } else {
          that.setData({
            isIphoneX: false,
          })
        }
      },
    })
  },
  //--------兼容适配--------
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //featuredId is passed from discover page
    // this.data.featuredId = options.featuredId || "";1:纯文本 2:富文本 3:图片 4:视频
    this.adaptation()
    this.setData({
      // featuredId: '902239865811136512',  //写死了
      featuredId: options.channelCode ? options.featuredId : Number(options.featuredId) + 10000000,
      title: options.title,
      featuredType: options.featuredType && options.featuredType == 5 ? 2 : 5,
      channelCode: options.channelCode, //频道编码
      isHourse: true,
    })
    this.data.collect = options.collect ?? ''
    this.init()
  },
  //返回app错误回调
  launchAppError() {
    // if(e.detail.errMsg == "launchApplication:fail"){
    //   console.loga("没装APP？")
    // }
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
    //obj = { relativeEcommerceProduct: "15272306938692"}//测试模拟数据
    if (obj) {
      nativeService
        .getMarketProdDetail({
          disskuidlist: obj,
        })
        .then((resp) => {
          let skuinfolist = resp.skuinfolist
          for (let i = 0; i < skuinfolist.length; i++) {
            skuinfolist[i].extendFieldValue = this.data.newArray0[i].extendFieldValue
          }

          this.setData({
            linkProductDetail: skuinfolist,
          })
        })
    }
  },
  /**
   * 跳转到商场小程序商品详情页
   */
  gotoMarketDetail(e) {
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
    clickEventTracking('user_behavior_event', 'clickCard', {
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
    for (let i in this.data.linkProductDetail) {
      rangersBurialPoint('content_exposure_event', {
        module: '发现',
        page_id: 'page_goods_rec_pop',
        page_name: '好物推荐弹窗',
        page_path: getFullPageUrl(),
        object_type: '商品',
        object_id: this.data.linkProductDetail[i].disskuid,
        object_name: this.data.linkProductDetail[i].skutitle,
        rank: i == 0 ? 1 : Number(i) + 1,
        ext_info: {
          type: this.showTypeDesc(this.data.featuredType), //内容类型，取值为：文章、视频、富文本
          title: this.data.title, //标题
          id: this.data.featuredId, //内容id
          status: this.data.linkProductDetail[i].state == 1 ? 0 : 1, //商品状态，取值为：1-已上架/0-已下架
          orig_price: this.data.linkProductDetail[i].originalprice, //商品原价
          price: this.data.linkProductDetail[i].saleprice, //商品现价
        },
      })
    }
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
  touchEnd() {
    // this.report()
  },
  report() {
    clickEventTracking('user_page_view', 'toastShowView', {
      page_path: getFullPageUrl(),
      object_type: this.showTypeDesc(this.data.featuredType),
      object_id: this.data.featuredId,
      object_name: this.data.featuredTitle,
    })
    this.threeProducts()
  },
  // 显示3个产品的埋点
  threeProducts() {
    let newLength = this.data.linkProductDetail.length
    if (this.data.linkProductDetail.length > 3) {
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
        object_id: this.data.linkProductDetail[i].disskuid,
        object_name: this.data.linkProductDetail[i].skutitle,
        rank: i == 0 ? 1 : Number(i) + 1,
        ext_info: {
          type: this.showTypeDesc(this.data.featuredType), //内容类型，取值为：文章、视频、富文本
          title: this.data.title, //标题
          id: this.data.featuredId, //内容id
          status: this.data.linkProductDetail[i].state == 1 ? 0 : 1, //商品状态，取值为：1-已上架/0-已下架
          orig_price: this.data.linkProductDetail[i].originalprice, //商品原价
          price: this.data.linkProductDetail[i].saleprice, //商品现价
        },
      })
    }
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},
  makeUserPageViewTrack(data) {
    const text = data.featuredTitle ? data.featuredTitle : this.data.title
    rangersBurialPoint('user_page_view', {
      module: '发现', //写死 “活动”
      page_id: 'page_discover_detail', //参考接口请求参数“pageId”
      page_name: '内容详情页', //当前页面的标题，顶部的title
      page_path: getFullPageUrl(), //当前页面的URL
      page_module: '发现',
      object_type: this.showTypeDesc(this.data.featuredType),
      object_id: this.data.featuredId,
      object_name: this.data.featuredTitle ? this.data.featuredTitle : text,
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getLoginStatus().then(() => {
      this.setData({
        share: app.globalData.share,
      })
    })
    this.data.featuredTitle && this.makeUserPageViewTrack(this.data)
    //设置头部背景颜色,更新头部样式
    let repeat = 3
    this.data.timer = setInterval(() => {
      if (repeat == 0) {
        let that = this
        clearInterval(that.data.timer)
      } else {
        var pages = getCurrentPages() //获取加载的页面
        var currentPage = pages[pages.length - 1] //获取当前页面的对象
        var url = currentPage.route //当前页面url
        if (url == 'packageDiscover/pages/myArticleDetails/myArticleDetails') {
          //避免头部颜色闪动
          wx.setNavigationBarColor({
            frontColor: '#000000',
            backgroundColor: '#ffffff',
          })
        }
        repeat--
      }
    }, 1000)
  },
  onAddToFavorites() {
    // webview 页面返回 webViewUrl
    let options = `collect=true&featuredId=${this.data.featuredId}&featuredType=${this.data.featuredType}&channelCode=${this.data.channelCode}`
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
    if (this.data.timer) {
      clearInterval(this.data.timer)
    }
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
    this.getMoreDiscussList()
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
          wx.hideLoading()
          setTimeout(() => {
            wx.showToast({
              title: '系统超时，请稍后再试',
              icon: 'none',
              duration: 2000,
            })
          }, 100)
          setTimeout(() => {
            this.data.publishClickFlag = true
          }, 2500)
        })
    })
  },
  wxParseTagATap(e) {
    let { appletLink } = this.data
    let h5Url, wxappUrl
    //1H5 2小程序 3自定义
    if (appletLink.length) {
      h5Url = appletLink.find((item) => {
        return item.jumpType == 1
      })
      wxappUrl = appletLink.find((item) => {
        return item.jumpType == 2
      })
      //兼容路径填写错误
      let pageReg = /^(?!\/).*/
      if (pageReg.test(wxappUrl.jumpLinkUrl)) {
        wxappUrl.jumpLinkUrl = `/${wxappUrl.jumpLinkUrl}`
      }
    }
    let currUrl = e.currentTarget.dataset.src
    let type = getParameters(currUrl, 'type')
    let pageName = getParameters(currUrl, 'pageName')
    let foodId = getParameters(currUrl, 'foodId')
    let featuredId = getParameters(currUrl, 'featuredId')
    let featureId = getParameters(currUrl, 'featureId')
    //外部小程序
    if (appletLink.length && h5Url && currUrl == h5Url.jumpLinkUrl) {
      //本小程序
      if (wxappUrl.miniAppCode == 'wxb12ff482a3185e46') {
        wx.showToast({
          title: '暂不支持跳转',
          icon: 'none',
          duration: 1000,
        })
        return
      }
      wx.navigateToMiniProgram({
        appId: wxappUrl.miniAppCode,
        path: wxappUrl.jumpLinkUrl,
        extraData: {},
        envVersion: 'release', //develop/trial/release
      })
    } else {
      let url
      if (type == 'jumpNative') {
        if (pageName == 'foodDetail') {
          url = `${menuDetail}?recipeId=${foodId}`
        } else if (pageName == 'giftVideo') {
          url = `${graphicDetail}?featuredId=${featuredId}`
        } else if (pageName == 'choiceDetailArticle') {
          url = `${articleDetail}?featuredId=${featureId}`
        } else {
          wx.showToast({
            title: '暂不支持跳转',
            icon: 'none',
            duration: 1000,
          })
          return
        }
      } else if (type == 'jumpWebView') {
        let webUrl = getParameters(currUrl, 'url')
        let id = getParameters(webUrl, 'id')
        url = `${articleDetail}?featuredId=${id}`
      } else {
        wx.showToast({
          title: '暂不支持跳转',
          icon: 'none',
          duration: 1000,
        })
        return
      }
      wx.navigateTo({
        url,
      })
    }
  },
  //监听视频播放
  videoPlayLister(e) {
    let { featuredId, richtextVideoList, featuredType, featuredTitle } = this.data
    let playerid = e.currentTarget.dataset.playerid
    if (!playerid) return
    //顶部视频
    if (playerid == `player-${featuredId}`) {
      //暂停富文本视频
      richtextVideoList.forEach((item) => {
        this.selectComponent(`#${item}`).pause()
      })
    } else {
      let currPlayerList = []
      currPlayerList.push(playerid)
      currPlayerList = Array.from(new Set(currPlayerList))
      this.setData({
        richtextVideoList: currPlayerList,
      })
      //暂停顶部视频-featuredType=5
      featuredType == 5 && this.selectComponent(`#player-${featuredId}`).pause()
      //暂停其他富文本视频
      richtextVideoList.forEach((item) => {
        if (item != playerid) {
          this.selectComponent(`#${item}`).pause()
        }
      })
    }
    //埋点
    this.clickVideoViewTrack({
      articleId: featuredId,
      type: featuredType,
      title: featuredTitle,
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
  //视频点击埋点
  clickVideoViewTrack(params) {
    rangersBurialPoint('user_behavior_event', {
      module: '发现',
      page_id: 'page_discover_detail', //参考接口请求参数“pageId”
      page_name: '内容详情页', //当前页面的标题，顶部的title
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
