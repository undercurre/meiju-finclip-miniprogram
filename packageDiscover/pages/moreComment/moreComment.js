const app = getApp()
import computedBehavior from '../../../utils/miniprogram-computed.js'
import { service } from 'assets/js/service'
import { clickEventTracking } from '../../../track/track.js'
import { getReqId, getTimeStamp, debounce } from 'm-utilsdk/index'
import { clickBurdPoint, getFullPageUrl } from '../../../utils/util'
import { requestService, rangersBurialPoint } from '../../../utils/requestService'
Page({
  behaviors: [computedBehavior],
  /**
   * 页面的初始数据
   */
  data: {
    bigTitle: '为什么评论被折叠？',
    titleContent:
      '根据《美的平台社区规范》，无意义的评论可能会被系统折叠，平台鼓励大家多发布与内容相关的评论，真诚分享，友好互动~',
    isNoNetWork: false,
    myNoticeTitle: '', //没网或者请求失败给的提示
    isPx: app.globalData.isPx,
    discussList: [], //评论列表
    isMaskShow: false, //点击评论出现遮罩层
    isKeyboard: false,
    discussPage: 1,
    discussPageSize: 50,
    commentContent: '',
    placeholder: '写评论...',
    userName: '',
    toUser: '',
    pid: 0,
    publishClickFlag: true,
    uid: null, //当前登录用户id
    statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'], //顶部状态栏的高度
    isHourse: true, //小木马加载中
    twoTitle: '确定删除该评论',
    cancleTxet: '取消',
    sureText: '确定',
    commentId: '', //删除评论id
    accountStatus: 0, //禁言状态
    featuredId: '', //文章id
    foldCnt: 0,
    featuredType: '',
    featuredTitle: '',
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
        console.log(resp)
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    options = JSON.parse(options.fitureObj)
    if (options.featuredId) {
      this.setData({
        featuredId: options.featuredId,
        featuredTitle: options.featuredTitle || '',
        featuredType: options.featuredType || '',
      })
    }
    this.init()
  },
  // 数据实例化
  init() {
    console.log('init')
    let self = this
    wx.getNetworkType({
      success(res) {
        let networkType = res.networkType
        console.log('getNetworkType======', networkType)
        if (networkType == 'none') {
          self.setData({
            isDeleted: true,
            isNoNetWork: !res.isConnected,
            isHourse: false,
            myNoticeTitle: '网络未连接，请检查您的网络设置',
          })
        } else {
          self.setData({
            isDeleted: false,
            isNoNetWork: false,
            isHourse: true,
          })
          console.log('no======', networkType)
          self.getArticleData()
        }
      },
    })
  },
  getArticleData() {
    const featuredId = this.data.featuredId
    this.setData({
      isLogon: app.globalData.isLogon,
      discussPage: 1,
    })
    if (this.data.isLogon) {
      this.setData({
        uid: app.globalData.userData.uid,
      })
    }

    let id = featuredId
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
        searchFold: 1,
      },
    }
    //判断是否登录 调用不同接口请求
    let getCommentListPort = this.data.isLogon ? 'getCommentList4APPIsLogin' : 'getCommentList4APP'
    requestService.request(getCommentListPort, leve_one_resq).then(
      (resp) => {
        console.log(resp)
        console.log('进入加载评论列表')
        let self = this
        if (resp.data.code == '000000') {
          setTimeout(() => {
            self.setData({
              isHourse: false,
            })
          }, 200)
          let resp_data = resp.data.data
          //给评论列表添加一个新属性 isExpandReply是否展开所用回复
          if (resp_data.evaluateList && resp_data.evaluateList.length > 0) {
            resp_data.evaluateList.forEach((item) => {
              item.isExpandReply = false
            })
            this.setData({
              discussList: resp_data.evaluateList,
            })
          } else {
            this.setData({
              commentIsEnd: true,
              discussList: [],
            })
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
        } else {
          let self = this
          setTimeout(() => {
            self.setData({
              isHourse: false,
              myNoticeTitle: '请求超时，请稍后再试',
            })
          }, 200)
        }
      },
      (error) => {
        console.log(error)
        let self = this
        setTimeout(() => {
          self.setData({
            isHourse: false,
            myNoticeTitle: '请求超时，请稍后再试',
          })
        }, 200)
      }
    )
  },
  clickHidden() {
    this.setData({
      isMaskShow: false,
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
      // isKeyboard: false,//评论输入框失去焦点，评论框不消失，继续显示
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
  goLogin: function () {
    wx.navigateTo({
      url: '../../../pages/login/login',
    })
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
  //评论点赞和取消
  handleLikeComment: function (e) {
    let commentId = e.currentTarget.dataset.commentid
    let index = e.currentTarget.dataset.index
    // let isLike = e.currentTarget.dataset.islike
    let nowLikeCount = 'discussList[' + index + '].cntInfo.likeCnt'
    let nowIsLiked = 'discussList[' + index + '].actionInfo.likeFlag'
    console.log(e)
    console.log(commentId)
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
        console.log(resp)
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

      this.setData({
        discussPage: (Number(this.data.discussPage) + 1).toString(),
      })
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
        },
      }
      let getCommentListPort = this.data.isLogon ? 'getCommentList4APPIsLogin' : 'getCommentList4APP'
      requestService.request(getCommentListPort, resq).then((resp) => {
        if (resp.data.code == '000000') {
          console.log(resp)
          let oldDiscussList = this.data.discussList
          let resp_data = resp.data.data.evaluateList
          if (!resp_data) {
            this.setData({
              commentIsEnd: true,
            })
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
    console.log(publishClickFlag)
    if (!publishClickFlag) return
    this.setData({
      isKeyboard: false,
      publishClickFlag: false,
    })
    let pid = this.data.pid
    let toUser = this.data.toUser
    let businessId = this.data.featuredId //写死了
    let resq
    let commentContent = this.data.commentContent.trim()
    console.log('在哪里')
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
        },
      }
    }

    let verifyPass = await this.articleCheckMessage(commentContent)
    console.log(verifyPass)
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
      console.log('我在这里')
      console.log(commentContent)
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
              object_name: this.data.featuredTitle ? this.data.featuredTitle : '',
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
              userName: '',
              toUser: '',
              pid: 0,
              publishClickFlag: true,
            })
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
          this.setData({
            publishClickFlag: true,
          })
          console.log(error)
          console.log('error9999')
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
        title: '输入框内容不能为空',
        icon: 'none',
        duration: 1000,
      })
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
  //获取被评论人数据
  getToUserData: function (e) {
    console.log(e)
    let pid = e.currentTarget.dataset.commentid
    let toUser = e.currentTarget.dataset.userid
    let userName = e.currentTarget.dataset.username
    this.setData({
      pid: pid,
      toUser: toUser,
      userName: userName,
      placeholder: '回复:' + userName,
      isKeyboard: true, //唤醒键盘
      isMaskShow: true,
    })
  },
  // 保存输入框的值
  keepText: function (e) {
    this.setData({
      commentContent: e.detail.value,
    })
  },
  //折叠评论删除确认弹窗防抖
  deleteMyComment: debounce(function (e) {
    this.deleteComment(e)
  }),
  //删除自己的评论
  deleteComment: function (e) {
    let _this = this
    let commentId = e[0].currentTarget.dataset.commentid
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
              _this.updataComment()
            }
          })
        } else if (res.cancel) {
          //用户点击了取消之后
          console.log('用户点击取消')
        }
      },
    })
  },
  //刷新评论
  updataComment: function () {
    this.setData({
      discussPage: 1,
    })
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
        searchFold: 1,
      },
    }
    requestService.request('getCommentList4APPIsLogin', leve_one_resq).then((resp) => {
      if (resp.data.code == '000000') {
        let resp_data = resp.data.data
        //折叠评论更新后，将评论的文章id以及更新后的评论总数保存起来，用于文章详情页评论数更新
        app.globalData.updateComment = {
          totalCnt: resp_data.totalCnt,
          articleId: resp_data.articleId,
        }
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
  //评论内容校验接口
  articleCheckMessage(message) {
    let param = {
      message,
      reqId: getReqId(),
      stamp: getTimeStamp(new Date()),
    }
    console.log('param=====', param)
    return new Promise((resolve) => {
      if (!message) {
        resolve(true)
        return
      }
      requestService
        .request('articleCheckMessage', param)
        .then((res) => {
          console.log('res=====', res.data.data.verifyPass)
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
            this.setData({
              publishClickFlag: true,
            })
          }, 2500)
        })
    })
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
  onReachBottom: function () {
    this.getMoreDiscussList()
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})
