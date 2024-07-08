import { requestService } from '../../../utils/requestService'
import { hasKey, getUID, getTimeStamp, getStamp, getReqId } from 'm-utilsdk/index'
import { showToast } from '../../../utils/util.js'
import { actEventViewPageTracking } from '../track/track.js'
import { dialogText } from 'containerCommon.js'
import { setTokenStorage, setIsAutoLogin } from '../../../utils/redis.js'
import { api } from '../../../api'

//const app = getApp()
module.exports = Behavior({
  behaviors: [],
  data: {
    options: {
      gameId: '',
      channelId: '',
    },
    gameRule: [],
    fromSite: '1',
    os: '1',
    shareSetting: {},
    pageSetting: {},
    selectPageObj: {
      name: '页面标题', // 页面标题
      status: 1, // 活动状态，0未发布，1未开始，2进行中，3已结束，4已关闭，5待审核，6审核中
      type: 1, //页面类型(1、首页；2、普通页面；3、toast弹窗;4、按钮弹窗；5、图片或文案弹窗)
      popups: {
        closeButtonPosition: 0, //关闭按钮位置
        content: '', //弹窗文案
        height: 320, //弹窗高度
        imgUrl: '', //弹窗上传图片地址
        rollFlag: true, //滚动标识
        title: '', //弹窗标题
        width: 600, //弹窗宽度
        basicList: {
          //按钮组件列表
          content: '', // 按钮文案
          target: '', // 跳转类型
          targetUrl: '', // 跳转地址
        },
      },
    },
    basicSetting: {},
    userInfo: {
      id: '',
      nickname: '', //昵称
      headimgurl: '', //头像
    },
    allData: {},
    inviteErrCodeArr: [99, 1004, 5001, 1217],
    inviteFamilyCode: '', //邀请家庭接口返回的状态
  },
  methods: {
    //it部活动配置系统-组件化页面初始化接口未登陆
    getGamePageInit() {
      wx.showLoading({
        title: '加载中...',
      })
      this.setData({ isLoading: true })
      const { gameId, channelId } = this.data.options
      return new Promise((resolve, reject) => {
        let data = {
          gameId: gameId,
          channelId: channelId,
          fromSite: this.data.fromSite || '',
          os: this.data.os || '',
          shareId: '',
        }
        console.log('首页初始化未带Token传参', data)
        requestService
          .request('getGamePageInit', data, 'GET')
          .then((res) => {
            this.setData({ isLoading: false })
            if (res.data.code === 0) {
              this.setData({
                shareSetting: res.data.data.shareSetting || {},
                pageSetting: res.data.data.pageSetting || {},
                basicSetting: res.data.data.basicSetting || {},
                userInfo: res.data.data.userInfo || {},
                containerList: res.data.data.pageSetting.containerList || [],
                gameRule: res.data.data.gameRule || [],
              })
              this.setData({
                allData: {
                  pageSetting: res.data.data.pageSetting || {},
                  userInfo: res.data.data.userInfo || {},
                  options: this.data.options,
                  gameRule: res.data.data.gameRule || [],
                },
              })
              console.log('rrrrrrrrrrrrrr', this.data.allData)
              console.log('首页初始化接口不带token成功返回', res.data)
              resolve(res)
            } else {
              console.log('首页初始化接口不带token失败返回', res.data)
              reject()
            }
            wx.hideLoading()
          })
          .catch((err) => {
            wx.hideLoading()
            this.setData({ isLoading: false })
            console.log('首页初始化接口不带token失败返回', err)
            showToast('程序员小哥哥植发去了，请稍后重试')
            // console.log("查询卷码礼包详情失败code",err)
            reject()
          })
      })
    },
    //it部活动配置系统-组件化页面初始化接口已登陆
    getGamePageInit_token() {
      wx.showLoading({
        title: '加载中...',
      })

      this.setData({ isLoading: true })
      const { gameId, channelId } = this.data.options
      return new Promise((resolve, reject) => {
        let data = {
          gameId: gameId,
          channelId: channelId,
          fromSite: this.data.fromSite || '',
          os: this.data.os || '',
          shareId: '',
        }
        console.log('首页初始化带Token传参==1646', data)
        requestService
          .request('getGamePageInit_token', data, 'GET')
          .then((res) => {
            this.setData({ isLoading: false })
            if (res.data.code === 0) {
              // const  basicSetting = {
              //   "participant": 7, //参与条件
              //   "endTime": "2021-01-21", //活动结束时间
              //   "name": "惊喜大放送", //活动名称
              //   "officialAccountId": 21,//主体ID
              //   "startTime":"2021-01-21" , //活动开始时间
              //   "businessClassify": "1",//业务分类
              //   "activityType": 1,//活动类型
              //   "versionAsk":7.1, //版本
              //   "riskSwitch": true,//风险开关
              //   "status": 3 //活动状态 0未发布，1未开始，2进行中，3已结束，4已关闭
              // }
              this.setData({
                shareSetting: res.data.data.shareSetting || {},
                pageSetting: res.data.data.pageSetting || {},
                basicSetting: res.data.data.basicSetting || {},
                userInfo: res.data.data.userInfo || {},
                containerList: res.data.data.pageSetting.containerList || [],
                gameRule: res.data.data.gameRule || [],
              })
              this.setData({
                allData: {
                  pageSetting: res.data.data.pageSetting || {},
                  userInfo: res.data.data.userInfo || {},
                  options: this.data.options,
                  gameRule: res.data.data.gameRule || [],
                },
              })
              console.log('rrrrrrrrrrrrrr', this.data.allData)
              console.log('首页初始化带Token接口成功返回', res.data)
              resolve(res)
            } else {
              console.log('首页初始化带Token接口失败返回', res.data)
              reject()
            }
            wx.hideLoading()
          })
          .catch((err) => {
            wx.hideLoading()
            this.setData({ isLoading: false })
            console.log('首页初始化带Token接口失败返回', err)
            showToast('程序员小哥哥植发去了，请稍后重试')
            // console.log("查询卷码礼包详情失败code",err)
            reject()
          })
      })
    },
    //it部活动配置系统-获取页面,isUpdata=true 是否需要要更新当前页面数据，默认跟新，弹框那些不需要更新
    getGamePage(pageId, isUpdata = true) {
      wx.showLoading({
        title: '加载中...',
      })
      this.setData({ isLoading: true })
      const { gameId } = this.data.options
      return new Promise((resolve, reject) => {
        let data = {
          pageId: pageId,
          gameId: gameId,
          otherParm: {
            inviteUserId: hasKey(this.data.options, 'inviteUserId') ? this.data.options.inviteUserId : '', //邀请人Id
          },
        }
        console.log('获取页面不带Token接口传参', data)
        requestService
          .request('getGamePage', data)
          .then((res) => {
            this.setData({ isLoading: false })
            if (res.data.code === 0) {
              if (isUpdata) {
                this.setData({
                  shareSetting: res.data.data.shareSetting || {},
                  pageSetting: res.data.data.pageSetting || {},
                  basicSetting: res.data.data.basicSetting || {},
                  userInfo: res.data.data.userInfo || {},
                  containerList: res.data.data.pageSetting.containerList || [],
                })
                this.setData({
                  allData: {
                    pageSetting: res.data.data.pageSetting || {},
                    userInfo: res.data.data.userInfo || {},
                    options: this.data.options,
                  },
                })
                console.log('rrrrrrrrrrrrrr', this.data.allData)
              }
              console.log('获取页面不带Token接口成功返回', res.data)
              resolve(res)
            } else {
              console.log('获取页面不带Token接口不成功返回', res.data)
              reject()
            }
            wx.hideLoading()
          })
          .catch((err) => {
            wx.hideLoading()
            this.setData({ isLoading: false })
            console.log('获取页面不带Token接口不成功返回', err)
            showToast('程序员小哥哥植发去了，请稍后重试')

            reject()
          })
      })
    },
    //it部活动配置系统-获取页面,isUpdata=true 是否需要要更新当前页面数据，默认跟新，弹框那些不需要更新
    getGamePage_token(pageId, isUpdata = true) {
      wx.showLoading({
        title: '加载中...',
      })
      this.setData({ isLoading: true })
      const { gameId } = this.data.options
      return new Promise((resolve, reject) => {
        let data = {
          pageId: pageId ? pageId : '',
          gameId: gameId,
          otherParm: {
            inviteUserId: hasKey(this.data.options, 'inviteUserId') ? this.data.options.inviteUserId : '', //邀请人Id
          },
        }
        console.log('获取页面带Token接口传参', data)
        if (isUpdata) {
          this.setData({
            shareSetting: {},
            pageSetting: {},
            basicSetting: {},
            userInfo: {},
            containerList: [],
          })
          this.setData({
            allData: {
              pageSetting: {},
              userInfo: {},
              options: this.data.options,
            },
          })
          console.log('rrrrrrrrrrrrrr', this.data.allData)
        }
        requestService
          .request('getGamePage_token', data)
          .then((res) => {
            this.setData({ isLoading: false })
            if (res.data.code === 0) {
              if (isUpdata) {
                this.setData({
                  shareSetting: res.data.data.shareSetting || {},
                  pageSetting: res.data.data.pageSetting || {},
                  basicSetting: res.data.data.basicSetting || {},
                  userInfo: res.data.data.userInfo || {},
                  containerList: res.data.data.pageSetting.containerList || [],
                })
                this.setData({
                  allData: {
                    pageSetting: res.data.data.pageSetting || {},
                    userInfo: res.data.data.userInfo || {},
                    options: this.data.options,
                  },
                })
                console.log('rrrrrrrrrrrrrr', this.data.allData)
              }
              console.log('获取页面带Token接口成功返回', res.data)
              resolve(res)
            } else {
              console.log('获取页面带Token接口不成功返回', res.data)
              reject()
            }
            wx.hideLoading()
          })
          .catch((err) => {
            wx.hideLoading()
            this.setData({ isLoading: false })
            console.log('获取页面带Token接口不成功返回', err)
            showToast('程序员小哥哥植发去了，请稍后重试')

            reject()
          })
      })
    },
    //it部活动配置系统-黑产用户校验
    blackUserCheck() {
      wx.showLoading({
        title: '加载中...',
      })
      this.setData({ isLoading: true })
      // const uid = app.globalData.userData.uid
      return new Promise((resolve, reject) => {
        let data = {
          // uid: uid
          gameId: this.data.options.gameId,
        }
        console.log('黑厂校验传参', data)
        requestService
          .request('blackUserCheck', data, 'GET')
          .then((res) => {
            this.setData({ isLoading: false })
            if (res.data.code === 0) {
              console.log('黑厂校验成功返回', res.data)
              resolve(res)
            } else {
              console.log('黑厂校验失败返回', res.data)
              reject()
            }
            wx.hideLoading()
          })
          .catch((err) => {
            wx.hideLoading()
            console.log('黑厂校验失败返回', err)
            showToast('程序员小哥哥植发去了，请稍后重试')
            this.setData({ isLoading: false })
            reject()
          })
      })
    },
    //it部活动配置系统-接受邀请
    receiveInvited(params) {
      wx.showLoading({
        title: '加载中...',
      })
      this.setData({ isLoading: true })
      let { options } = this.data
      return new Promise((resolve, reject) => {
        let data = {
          // gameId: '',
          // inviteUserId: '',
          // inviteType: ''
          ...params,
        }
        console.log('接受邀请接口传参', data)
        requestService
          .request('receiveInvited', data)
          .then((res) => {
            this.setData({ isLoading: false })
            if (res.data.code === 0) {
              console.log('接受邀请接口成功返回', res.data)
              resolve(res)
            } else {
              console.log('接受邀请接口失败返回', res.data)
              reject()
            }
            wx.hideLoading()
          })
          .catch((err) => {
            console.log('err', err)
            wx.hideLoading()
            this.setData({ isLoading: false })
            let resultCode = err.data.code
            const { inviteErrCodeArr } = this.data
            let pageId = err.data.data && err.data.data.next_page_id ? err.data.data.next_page_id : ''
            let params = { pageId: pageId }
            console.log('resultCode', resultCode)
            console.log('msg', err.data.msg)
            if (inviteErrCodeArr.indexOf(resultCode) >= 0) {
              this.setToast(err.data.msg)
            } else if (resultCode == 1001) {
              this.setToast('不能邀请自己哦')
            } else if (resultCode == 1002) {
              this.data.options.inviteUserId = err.data.data && err.data.data.invite_user_id
              // this.setDialog(4,"您已接受其他好友邀请，不能重复接受哦","我知道了", 'callback', params )
              let basic = [{ target: 'callback', targetUrl: '', name: dialogText.iKnow, params: params }]
              this.setStaticDialog(4, '您已接受其他好友邀请，不能重复接受哦', basic)
            } else if (resultCode == 1003) {
              // this.setDialog(4,"您已接受该好友邀请","我知道了", 'callback', params)
              let basic = [{ target: 'callback', targetUrl: '', name: dialogText.iKnow, params: params }]
              this.setStaticDialog(4, '您已接受该好友邀请', basic)
            } else if (resultCode == 1005) {
              //老用户 直接跳转至pageId
              this.setData({
                'options.pageId': params.pageId,
              })
              this.getGamePage_token(params.pageId).then((res) => {
                actEventViewPageTracking('page_view', options, res.data.data.pageSetting)
              })
            } else if (resultCode == 4001) {
              // this.setDialog(4,"您当前帐号存在异常，详情请查看活动规则或咨询客服，谢谢～","我知道了",1)
              let basic = [{ target: 1, targetUrl: '', name: dialogText.iKnow, params: '' }]
              this.setStaticDialog(4, '您当前帐号存在异常，详情请查看活动规则或咨询客服，谢谢～', basic)
            } else if (resultCode == 3001 || resultCode == 3003) {
              let basic = [{ target: 1, targetUrl: '', name: dialogText.iKnow, params: '' }]
              this.setStaticDialog(4, '活动未开始，敬请期待～', basic)
            } else if (resultCode == 3002 || resultCode == 3004) {
              let basic = [{ target: 1, targetUrl: '', name: dialogText.iKnow, params: '' }]
              this.setStaticDialog(4, '来晚啦！活动已结束～', basic)
            } else if (resultCode == 6002) {
              let basic = [{ target: 1, targetUrl: '', name: dialogText.iKnow, params: '' }]
              this.setStaticDialog(4, '来晚啦！奖品已被抢光，明天再试试看吧~', basic)
            } else {
              this.setToast('程序员小哥哥植发去了，请稍后重试')
            }
            // this.setData({
            //   pageId:4375
            // })
            // this.getGamePage_token(err.data.data.next_page_id)  //新用户 4375
            // this.getGamePage_token(err.data.data.next_page_id+1)   // 老用户 4376
            reject()
          })
      })
    },
    //it部活动配置系统-领取奖品
    receivePrize(gameId, prizeId) {
      wx.showLoading({
        title: '加载中...',
      })
      this.setData({ isLoading: true })
      return new Promise((resolve, reject) => {
        let data = {
          gameId: gameId,
          prizeId: prizeId,
        }
        console.log('领取奖品接口传参', data)
        requestService
          .request('receivePrize', data)
          .then((res) => {
            this.setData({ isLoading: false })
            if (res.data.code === 0) {
              console.log('领取奖品接口成功返回', res.data)
              resolve(res)
            } else {
              console.log('领取奖品接口失败返回', res.data)
              reject()
            }
            wx.hideLoading()
          })
          .catch((err) => {
            wx.hideLoading()
            console.log('领取奖品接口失败返回', err)
            showToast('程序员小哥哥植发去了，请稍后重试')
            this.setData({ isLoading: false })
            reject()
          })
      })
    },
    //it部活动配置系统-加入家庭
    receiveJoinFamily(params) {
      wx.showLoading({
        title: '加载中...',
      })
      let { options } = this.data
      this.setData({ isLoading: true })
      return new Promise((resolve, reject) => {
        let data = {
          ...params,
        }
        console.log('加入家庭接口传参', data)
        requestService
          .request('receiveInvited', data)
          .then((res) => {
            this.setData({ isLoading: false })
            if (res.data.code === 0) {
              console.log('加入家庭接口成功返回', res.data)
              resolve(res)
            } else {
              console.log('加入家庭接口失败返回', res.data)
              reject()
            }
            wx.hideLoading()
          })
          .catch((err) => {
            console.log('加入家庭接口失败返回', err)
            wx.hideLoading()
            this.setData({ isLoading: false })
            let resultCode = err.data.code
            console.log('resultCode', resultCode)
            const { inviteErrCodeArr } = this.data
            let pageId = err.data.data && err.data.data.next_page_id ? err.data.data.next_page_id : ''
            let params = { pageId: pageId }
            console.log('resultCode', resultCode)
            console.log('msg', err.data.msg)
            if (inviteErrCodeArr.indexOf(resultCode) >= 0) {
              // this.setToast(err.data.msg)
              if (resultCode == 1004) {
                this.setData({
                  'options.pageId': params.pageId,
                })
                this.getGamePage_token(params.pageId).then((res) => {
                  actEventViewPageTracking('page_view', options, res.data.data.pageSetting)
                })
              } else {
                this.setToast(err.data.msg)
              }
            } else if (resultCode == 1001) {
              this.setToast('不能邀请自己哦')
              // }else if(resultCode == 1002){
              // this.data.options.inviteUserId = err.data.data&&err.data.data.invite_user_id
              // this.setDialog(4,"您已接受其他好友邀请，不能重复接受哦","我知道了", 'callback', params )
              // let basic = [{target: 'callback', targetUrl: "", name: "我知道了", params: params}]
              // this.setStaticDialog(4,"您已接受其他好友邀请，不能重复接受哦", basic)
            } else if (resultCode == 1002 || resultCode == 1003 || resultCode == 1005) {
              // 1003已接受好友邀请，1005老用户 直接跳转至pageId
              this.setData({
                'options.pageId': params.pageId,
              })
              this.getGamePage_token(params.pageId).then((res) => {
                actEventViewPageTracking('page_view', options, res.data.data.pageSetting)
              })
            } else if (resultCode == 4001) {
              // this.setDialog(4,"您当前帐号存在异常，详情请查看活动规则或咨询客服，谢谢～","我知道了",1)
              let basic = [{ target: 1, targetUrl: '', name: dialogText.iKnow, params: '' }]
              this.setStaticDialog(4, '您当前帐号存在异常，详情请查看活动规则或咨询客服，谢谢～', basic)
            } else if (
              resultCode == 2001 ||
              resultCode == 2002 ||
              resultCode == 2003 ||
              resultCode == 2004 ||
              resultCode == 2005 ||
              resultCode == 2006
            ) {
              this.setData({
                inviteFamilyCode: resultCode, //邀请家庭接口返回的状态
                'options.pageId': params.pageId,
              })
              this.getGamePage_token(params.pageId).then((res) => {
                actEventViewPageTracking('page_view', options, res.data.data.pageSetting)
              })
            } else if (resultCode == 3001 || resultCode == 3003) {
              let basic = [{ target: 1, targetUrl: '', name: dialogText.iKnow, params: '' }]
              this.setStaticDialog(4, '活动未开始，敬请期待～', basic)
            } else if (resultCode == 3002 || resultCode == 3004) {
              let basic = [{ target: 1, targetUrl: '', name: dialogText.iKnow, params: '' }]
              this.setStaticDialog(4, '来晚啦！活动已结束～', basic)
            } else if (resultCode == 6002) {
              let basic = [{ target: 1, targetUrl: '', name: dialogText.iKnow, params: '' }]
              this.setStaticDialog(4, '来晚啦！奖品已被抢光，明天再试试看吧~', basic)
            } else if (resultCode == 1219) {
              this.setToast('该邀请已过期或被其他用户使用，请联系邀请者重新邀请')
            } else {
              this.setToast('程序员小哥哥植发去了，请稍后重试')
            }
            reject()
          })
      })
    },
    // it部活动配置系统-获取地区
    receiveGetAddress(code) {
      wx.showLoading({
        title: '加载中...',
      })
      this.setData({ isLoading: true })
      return new Promise((resolve, reject) => {
        let data = {
          reqId: getUID(),
          stamp: getTimeStamp(new Date()),
          activityId: 'HD', //序霖说传HD就行了
          regionCode: code,
        }
        requestService
          .request('receiveGetAddress', data)
          .then((res) => {
            this.setData({ isLoading: false })
            if (res.data.code === 0) {
              resolve(res)
            } else {
              reject(res)
            }
            wx.hideLoading()
          })
          .catch(() => {
            wx.hideLoading()
            this.setData({ isLoading: false })
            showToast('程序员小哥哥植发去了，请稍后重试')
            reject()
          })
      })
    },

    // it部活动配置系统-保存获奖地址
    saveAddress(params) {
      wx.showLoading({
        title: '加载中...',
      })
      this.setData({ isLoading: true })
      return new Promise((resolve, reject) => {
        let data = {
          ...params,
        }
        requestService
          .request('submitAddress', data)
          .then((res) => {
            this.setData({ isLoading: false })
            if (res.data.code === 0) {
              resolve(res)
            } else {
              reject(res)
            }
            wx.hideLoading()
          })
          .catch((err) => {
            wx.hideLoading()
            this.setData({ isLoading: false })
            showToast('程序员小哥哥植发去了，请稍后重试')
            reject(err)
          })
      })
    },
    //签到通知
    signNotice(extensionField) {
      wx.showLoading({
        title: '加载中...',
      })
      this.setData({ isLoading: true })
      const { gameId } = this.data.options
      return new Promise((resolve, reject) => {
        let data = {
          gameId: gameId,
          extensionField: extensionField,
        }
        console.log('设置通知接口传参', data)
        requestService
          .request('signNotice', data)
          .then((res) => {
            this.setData({ isLoading: false })
            if (res.data.code === 0) {
              console.log('设置通知接口成功返回', res.data)
              resolve(res)
            } else {
              console.log('设置通知接口失败返回', res.data)
              reject()
            }
            wx.hideLoading()
          })
          .catch((err) => {
            wx.hideLoading()
            console.log('设置通知接口失败返回', err)
            showToast('程序员小哥哥植发去了，请稍后重试')
            this.setData({ isLoading: false })
            reject()
          })
      })
    },
    //滚动签到接口
    signRolling() {
      wx.showLoading({
        title: '加载中...',
      })
      this.setData({ isLoading: true })
      const { gameId } = this.data.options
      return new Promise((resolve, reject) => {
        let data = {
          gameId: gameId,
        }
        console.log('滚动签到接口传参', data)
        requestService
          .request('signRolling', data)
          .then((res) => {
            this.setData({ isLoading: false })
            if (res.data.code === 0) {
              console.log('滚动签到接口成功返回', res.data)
              resolve(res)
            } else {
              console.log('滚动签到接口失败返回', res.data)
              reject()
            }
            wx.hideLoading()
          })
          .catch((err) => {
            wx.hideLoading()
            console.log('滚动签到接口失败返回-----', err)
            if (hasKey(err, 'data')) {
              if (hasKey(err.data, 'code')) {
                if (
                  err.data.code == 10 ||
                  err.data.code == 11 ||
                  err.data.code == 12 ||
                  err.data.code == 14 ||
                  err.data.code == 15 ||
                  err.data.code == 16 ||
                  err.data.code == 18 ||
                  err.data.code == 3001 ||
                  err.data.code == 3002 ||
                  err.data.code == 3003 ||
                  err.data.code == 3004
                ) {
                  this.setData({ isLoading: false })
                  resolve(err)
                  return
                }
              }
            }
            showToast('程序员小哥哥植发去了，请稍后重试')
            this.setData({ isLoading: false })
            reject()
          })
      })
    },
    //九宫格抽奖接口
    drawGrid() {
      wx.showLoading({
        title: '加载中...',
      })
      this.setData({ isLoading: true })
      const { gameId, channelId } = this.data.options
      return new Promise((resolve, reject) => {
        let data = {
          gameId,
          channelId,
          fromSite: this.data.fromSite || '',
          os: this.data.os || '',
        }
        console.log('九宫格抽奖接口传参', data)
        requestService
          .request('drawGrid', data, 'GET')
          .then((res) => {
            this.setData({ isLoading: false })
            if (res.data.code === 0) {
              console.log('九宫格抽奖接口成功返回', res.data)
              resolve(res)
            } else {
              console.log('九宫格抽奖接口失败返回', res.data)
              reject()
            }
            wx.hideLoading()
          })
          .catch((err) => {
            wx.hideLoading()
            console.log('九宫格抽奖接口失败返回', err)
            let errCodeArr = [4001, 3001, 3002, 3003, 3004, 6001]
            // 6001 抽奖次数为0
            if (errCodeArr.indexOf(err.data.code) >= 0) {
              resolve(err)
              return
            }
            if (hasKey(err, 'data')) {
              if (hasKey(err.data, 'code')) {
                if (
                  err.data.code == 10 ||
                  err.data.code == 11 ||
                  err.data.code == 12 ||
                  err.data.code == 14 ||
                  err.data.code == 15 ||
                  err.data.code == 16
                ) {
                  this.setData({ isLoading: false })
                  resolve(err)
                  return
                }
              }
            }
            showToast('程序员小哥哥植发去了，请稍后重试')
            this.setData({ isLoading: false })
            reject()
          })
      })
    },
    //活动结束接口
    gameStatus() {
      // wx.showLoading({
      //   title: '加载中...',
      // })
      this.setData({ isLoading: true })
      const { gameId } = this.data.options
      return new Promise((resolve, reject) => {
        let data = {
          gameId: gameId,
        }
        console.log('活动结束接口传参', data)
        requestService
          .request('gameStatus', data, 'GET')
          .then((res) => {
            this.setData({ isLoading: false })
            if (res.data.code === 0) {
              this.setData({
                game_finish: res.data.data.game_finish,
              })
              console.log('活动结束接口成功返回', res.data)
              resolve(res)
            } else {
              console.log('活动结束接口失败返回', res.data)
              reject()
            }
            // wx.hideLoading()
          })
          .catch((err) => {
            // wx.hideLoading()
            console.log('活动结束接口失败返回', err)
            showToast('程序员小哥哥植发去了，请稍后重试')
            this.setData({ isLoading: false })
            reject()
          })
      })
    },
    //校验库存接口（任务盒子）
    prizeStore(taskId = '') {
      // wx.showLoading({
      //   title: '加载中...',
      // })
      this.setData({ isLoading: true })
      const { gameId } = this.data.options
      return new Promise((resolve, reject) => {
        let data = {
          gameId: gameId,
          taskId: taskId,
        }
        console.log('库存接口传参', data)
        requestService
          .request('prizeStore', data, 'GET')
          .then((res) => {
            this.setData({ isLoading: false })
            if (res.data.code === 0) {
              console.log('库存接口成功返回', res.data)
              resolve(res)
            } else {
              console.log('库存接口失败返回', res.data)
              reject()
            }
            // wx.hideLoading()
          })
          .catch((err) => {
            // wx.hideLoading()
            console.log('库存接口失败返回', err)
            showToast('程序员小哥哥植发去了，请稍后重试')
            this.setData({ isLoading: false })
            reject()
          })
      })
    },
    // 分页获取积分排行列表
    getRankList(params = {}) {
      const { gameId } = this.data.options
      return new Promise((resolve, reject) => {
        let data = {
          gameId,
          pageIndex: params.pageIndex,
          pageSize: params.pageSize,
        }
        console.log('分页获取积分排行列表传参：', data)
        requestService
          .request('getRankList', data)
          .then((res) => {
            if (res.data.code === 0) {
              console.log('获取排行列表接口成功返回', res.data)
              resolve(res)
            } else {
              console.log('获取排行列表接口失败返回', res.data)
              reject()
            }
          })
          .catch((err) => {
            console.log('获取排行列表接口失败返回', err)
            // showToast("程序员小哥哥植发去了，请稍后重试")
            reject()
          })
      })
    },
    // 获取积分记录页id
    getScorePageId() {
      const { gameId } = this.data.options
      return new Promise((resolve, reject) => {
        let data = {
          gameId,
        }
        console.log('获取榜单页id传参', data)
        requestService
          .request('getScorePageId', data, 'GET')
          .then((res) => {
            if (res.data.code === 0) {
              console.log('获取榜单页id接口成功返回', res.data)
              resolve(res)
            } else {
              console.log('获取榜单页id接口失败返回', res.data)
              showToast('程序员小哥哥植发去了，请稍后重试')
              reject()
            }
          })
          .catch((err) => {
            console.log('获取榜单页id接口失败返回', err)
            showToast('程序员小哥哥植发去了，请稍后重试')
            reject()
          })
      })
    },

    // 邀请类库存接口
    invitePrizeStore(containerType = '') {
      // wx.showLoading({
      //   title: '加载中...',
      // })
      this.setData({ isLoading: true })
      const { gameId } = this.data.options
      return new Promise((resolve, reject) => {
        let data = {
          gameId: gameId,
          containerType: containerType,
        }
        console.log('邀请库存接口传参', data)
        requestService
          .request('invitePrizeStore', data, 'GET')
          .then((res) => {
            this.setData({ isLoading: false })
            if (res.data.code === 0) {
              console.log('邀请库存接口成功返回', containerType, res.data)
              resolve(res)
            } else {
              console.log('邀请库存接口失败返回', containerType, res.data)
              reject(res)
            }
            // wx.hideLoading()
          })
          .catch((err) => {
            // wx.hideLoading()
            console.log('邀请库存接口失败返回了', err)
            showToast('程序员小哥哥植发去了，请稍后重试')
            this.setData({ isLoading: false })
            reject(err)
          })
      })
    },
    //判断奖励是否需要引导到美居接口
    isPrizeReceiveChannel(prizeId = '') {
      wx.showLoading({
        title: '加载中...',
      })
      this.setData({ isLoading: true })
      return new Promise((resolve, reject) => {
        let data = {
          prizeId: prizeId,
        }
        console.log('判断引导接口传参', data)
        requestService
          .request('isPrizeReceiveChannel', data, 'POST')
          .then((res) => {
            this.setData({ isLoading: false })
            if (res.data.code === 0) {
              console.log('引导接口成功返回', res.data)
              resolve(res)
            } else {
              console.log('引导接口失败返回', res.data)
              reject()
            }
            wx.hideLoading()
          })
          .catch((err) => {
            wx.hideLoading()
            console.log('判断是否引导至美居接口失败返回', err)
            let errCodeArr = [3002, 3004, 3005, 3006]
            // 6001 抽奖次数为0
            if (errCodeArr.indexOf(err.data.code) >= 0) {
              resolve(err)
              return
            }
            showToast('程序员小哥哥植发去了，请稍后重试')
            this.setData({ isLoading: false })
            reject()
          })
      })
    },
    //虚拟券领取接口
    receiveVirtualCoupon(prizeId = '') {
      wx.showLoading({
        title: '加载中...',
      })
      this.setData({ isLoading: true })
      return new Promise((resolve, reject) => {
        let data = {
          prizeId: prizeId,
        }
        console.log('领取接口传参', data)
        requestService
          .request('receiveVirtualCoupon', data, 'POST')
          .then((res) => {
            this.setData({ isLoading: false })
            if (res.data.code === 0) {
              console.log('领取接口成功返回', res.data)
              resolve(res)
            } else {
              console.log('领取接口失败返回', res.data)
              reject()
            }
            wx.hideLoading()
          })
          .catch((err) => {
            wx.hideLoading()
            console.log('判断是否引导至美居接口失败返回', err)
            let errCodeArr = [3002, 3004, 3005, 3006, 3007, 3008, 4041]
            // 6001 抽奖次数为0
            this.setData({ isLoading: false })
            if (errCodeArr.indexOf(err.data.code) >= 0) {
              resolve(err)
              return
            }
            showToast('程序员小哥哥植发去了，请稍后重试')
            reject()
          })
      })
    },
    //获取邀请码
    getInvitationCode(params) {
      return new Promise((resolve, reject) => {
        let data = params
        console.log('获取inviteCode接口传参', data)
        requestService
          .request('share', data, 'POST')
          .then((res) => {
            if (res.data.code === 0) {
              console.log('领取接口成功返回', res.data)
              resolve(res)
            } else {
              console.log('领取接口失败返回', res.data)
              reject()
            }
          })
          .catch((err) => {
            if (err.data.code == 2020) {
              reject(err)
            } else {
              showToast('程序员小哥哥植发去了，请稍后重试')
              reject()
            }
          })
      })
    },
    //获取家庭列表
    getHomeList(params) {
      return new Promise((resolve, reject) => {
        requestService
          .request('homeList', params)
          .then((res) => {
            if (res.data.code === 0) {
              console.log('HOMELIST接口成功返回', res.data)
              resolve(res)
            } else {
              console.log('领取接口失败返回', res.data)
              reject()
            }
          })
          .catch((err) => {
            console.log('判断是否引导至美居接口失败返回', err)
            showToast('程序员小哥哥植发去了，请稍后重试')
            reject()
          })
      })
    },
    //免费领取接口
    freeReceive() {
      wx.showLoading({
        title: '加载中...',
      })
      this.setData({ isLoading: true })
      const { gameId } = this.data.options
      return new Promise((resolve, reject) => {
        requestService
          .request('freeReceive', { gameId }, 'GET')
          .then((res) => {
            this.setData({ isLoading: false })
            if (res.data.code === 0) {
              console.log('免费领取接口成功返回', res.data)
              resolve(res)
            } else {
              console.log('免费领取接口失败返回code!=0', res.data)
              reject(res)
            }
            wx.hideLoading()
          })
          .catch((err) => {
            this.setData({ isLoading: false })
            wx.hideLoading()
            console.log('免费领取接口失败返回catch', err)
            let arr = [1, 16, 3003, 3004, 4004, 4005, 4006, 4008, 4009]
            if (arr.includes(err.data.code)) {
              reject(err)
              return
            }
            showToast('程序员小哥哥植发去了，请稍后重试')
          })
      })
    },
    //任务盒子拓展-完成任务
    finishTask(params) {
      return new Promise((resolve, reject) => {
        requestService
          .request('finishTask', params, 'GET')
          .then((res) => {
            if (res.data.code === 0) {
              console.log('拓展接口成功返回', res.data)
              resolve(res)
            } else {
              console.log('拓展接口失败返回code!=0', res.data)
              reject(res)
            }
          })
          .catch((err) => {
            console.log('拓展领取接口失败返回catch', err)
            reject(err)
            return
          })
      })
    },
    getCaptchaStatus(params) {
      wx.showLoading({
        title: '加载中...',
      })
      return new Promise((resolve, reject) => {
        requestService
          .request('getCaptchaStatus', params, 'GET')
          .then((res) => {
            if (res.data.code === 0) {
              console.log('滑块验证获取状态接口成功返回', res.data)
              wx.hideLoading()
              resolve(res)
            } else {
              console.log('滑块验证获取状态接口返回code!=0', res.data)
              wx.hideLoading()
              reject(res)
            }
          })
          .catch((err) => {
            console.log('滑块验证获取状态接口失败返回catch', err)
            wx.hideLoading()
            reject(err)
            return
          })
      })
    },
    checkCaptcha(params) {
      return new Promise((resolve, reject) => {
        requestService
          .request('checkCaptcha', params, 'GET')
          .then((res) => {
            if (res.data.code === 0) {
              console.log('滑块验证上传接口成功返回', res.data)
              resolve()
            } else {
              console.log('滑块验证上传状态接口返回code!=0', res.data)
              reject(res)
            }
          })
          .catch((err) => {
            console.log('滑块验证上传接口失败返回catch', err)
            if (err.data.code != 40001 && err.data.code != 40002) {
              showToast('程序员小哥哥植发去了，请稍后重试')
            }
            reject(err)
            return
          })
      })
    },
    //权益直充
    receiveDirectCharge(params) {
      wx.showLoading({
        title: '加载中...',
      })
      this.setData({ isLoading: true })
      return new Promise((resolve, reject) => {
        requestService
          .request('receiveDirectCharge', params)
          .then((res) => {
            this.setData({ isLoading: false })
            wx.hideLoading()
            if (res.data.code === 0) {
              console.log('直充接口成功返回', res.data)
              resolve(res)
            } else {
              console.log('直充接口失败返回code!=0', res.data)
              reject(res)
            }
          })
          .catch((err) => {
            this.setData({ isLoading: false })
            wx.hideLoading()
            console.log('直充领取接口失败返回catch', err)
            reject(err)
            return
          })
      })
    },
    //加入家庭改
    inviteFamily(needCode = 'Y') {
      wx.showLoading({
        title: '加载中...',
      })
      this.setData({ isLoading: true })
      return new Promise((resolve, reject) => {
        let data = {
          iotAppId: api.iotAppId,
          // "wxLoginCode": res.code,
          wxAccessToken: getApp().globalData.wxAccessToken || '',
          nickname: (getApp().globalData.userInfo && getApp().globalData.userInfo.nickName) || '',
          invitationCode: needCode == 'Y' ? getApp().globalData.invitationCode : '', //"6524cb5e68926539",
        }
        // 发起网络请求
        requestService
          .request('joinFaminly', data)
          .then((res) => {
            wx.hideLoading()
            let arr = [2024, 2019, 1205, 1201, 9999]
            this.setData({ isLoading: false })
            if (res.data.code === 0 || arr.includes(res.data.code)) {
              resolve(res.data.data)
            } else {
              reject(res)
            }
          })
          .catch((err) => {
            wx.hideLoading()
            this.setData({ isLoading: false })
            let errMsg = {
              1218: '邀请已失效，需家庭主重新发起邀请',
              1217: '邀请已失效，需家庭主重新发起邀请',
              1219: '邀请已失效，需家庭主重新发起邀请',
              1220: '邀请已失效，需家庭主重新发起邀请',
              1205: '该家庭已不存在',
              5555: '无法加入自己创建的家庭哟',
              2019: '您的家庭数量已达上限',
              2024: '对方家庭成员数量已达上限',
              9999: '抱歉，加入家庭失败，请重新尝试',
              3005: '活动已结束',
              3076: '账号异常，无法进行此操作，请联系客服解决',
              1105: '账户不存在，请联系客服处理',
            }
            if (!hasKey(err, 'data')) {
              reject(err)
              return
            }
            if (!hasKey(err.data, 'code')) {
              reject(err)
              return
            }
            console.log('opopopopopop', errMsg[err.data.code])
            if (errMsg[err.data.code] === undefined) {
              showToast('程序员小哥哥植发去了，请稍后重试')
            } else {
              showToast(errMsg[err.data.code])
            }
            reject(err)
          })
        // })
      })
    },
    //发送网络请求登陆小程序
    loginAPi(needCode = 'N') {
      wx.showLoading({
        title: '加载中...',
      })
      this.setData({ isLoading: true })
      return new Promise((resolve, reject) => {
        console.log('77777777777', getApp().globalData)
        // this.updateCode().then(res => {
        let timestamp = getStamp()
        let reqId = getReqId()
        let reqData = {
          appKey: '46579c15',
          appVersion: '1.0.0',
          osVersion: '',
          platform: 110,
        }
        let data = {
          timestamp: timestamp,
          data: reqData,
          iotData: {
            iotAppId: api.iotAppId,
            // "wxLoginCode": res.code,
            wxAccessToken: getApp().globalData.wxAccessToken || '',
            nickname: (getApp().globalData.userInfo && getApp().globalData.userInfo.nickName) || '',
            invitationCode: needCode == 'Y' ? getApp().globalData.invitationCode : '', //"6524cb5e68926539",
            reqId: reqId,
            stamp: getTimeStamp(new Date()),
          },
        }
        // 发起网络请求
        requestService
          .request('loginMuc', data)
          .then((res) => {
            wx.hideLoading()
            this.setData({ isLoading: false })
            if (res.data.code === 0) {
              console.log('loginMuc sucess res：', res)
              getApp().globalData.userData = res.data.data
              getApp().globalData.phoneNumber = res.data.data.userInfo.mobile
              getApp().globalData.isLogon = true
              getApp().globalData.wxExpiration = true
              setTokenStorage(res.data.data.mdata.accessToken)
              setIsAutoLogin(true)
              if (res.data.data.region || String(res.data.data.region) == '0') {
                getApp().globalData.userRegion = res.data.data.region
                wx.setStorageSync('userRegion', res.data.data.region) //存储
              }
              resolve(res.data.data)
            } else {
              console.log('login fail res :', res.data)
              //getApp().globalData.isLogon = false
              // showToast(res.data.msg || requestService.getErrorMessage(res.data.code))1404
              reject(res)
            }
          })
          .catch((err) => {
            wx.hideLoading()
            this.setData({ isLoading: false })
            console.log('login catch res :', err)
            //getApp().globalData.isLogon = false
            if (!hasKey(err, 'data')) {
              reject(err)
              return
            }
            if (!hasKey(err.data, 'code')) {
              reject(err)
              return
            }
            let errMsg = {
              1218: '邀请已失效，需家庭主重新发起邀请',
              1217: '邀请已失效，需家庭主重新发起邀请',
              1219: '邀请已失效，需家庭主重新发起邀请',
              1220: '邀请已失效，需家庭主重新发起邀请',
              1205: '该家庭已不存在',
              5555: '无法加入自己创建的家庭哟',
              2019: '您的家庭数量已达上限',
              2024: '对方家庭成员数量已达上限',
              9999: '抱歉，加入家庭失败，请重新尝试',
              1105: '账户不存在，请联系客服处理',
            }
            if (errMsg[err.data.code] == undefined) {
              showToast('程序员小哥哥植发去了，请稍后重试')
            } else {
              showToast(errMsg[err.data.code])
            }
            reject(err)
          })
        // })
      })
    },
  },
})
