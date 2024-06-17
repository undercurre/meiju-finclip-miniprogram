import { isEmptyObject } from 'm-utilsdk/index'
const actTempmetMethodsMixins = require('../../actTempmetMethodsMixins.js')
const commonMixin = require('../../commonMixin.js')
Component({
  behaviors: [actTempmetMethodsMixins, commonMixin],
  // 属性定义（详情参见下文）
  properties: {
    props: {
      type: Object,
      value: {},
      observer(newVal) {
        !isEmptyObject(newVal) && this.initLuckData()
      },
    },
    options: {
      type: Object,
      value: {},
    },
    isLogon: {
      type: Boolean,
      value: false,
    },
    pageSetting: {
      type: Object,
      value: {},
    },
    gameRule: {
      type: Array,
      value: [],
      observer(newVal) {
        this.getSelectGameRule(newVal)
      },
    },
    commonData: {
      type: Object,
      value: {},
    },
  },

  data: {
    isShowLottie: false,
    luckClickFlag: true, //防暴点击按钮
    currIndex: -1,
    lastIndex: 0,
    imgMaskInfo: {},
    currDrawInfo: null, //抽奖获取信息
    drawBtnItem: null,
    cardPageSetting: {},
    cardContainerInfo: {},
    isShowNoRewardDialog: false,
    lastDrawNum: 0,
    drawSkin: 2,
    drawTime: 3000,
    animationContainerInfo: null,
    animationData: null,
    selectGameRule: {
      channelType: 1, //参与渠道，1 ：不限 ，2：仅限美居app
      playType: 8, //玩法类型，1、邀请注册；2、邀请绑定设备；3、邀请加入家庭； 4、任务盒子 8、九宫格
    },
    gameRuleMap: {
      8: '13',
    },
    isShowLaunchAppDialog: false,
    rollPlayInfoList: [], //弹幕区域
    clickLuckE: '',
    clickLuckStr: '',
    verifyCode: '', //滑块验证校验uid，从mixin的captchaStatus方法获取
  }, // 私有数据，可用于模板渲染

  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {},
    moved: function () {},
    detached: function () {},
  },

  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  attached: function () {}, // 此处attached的声明会被lifetimes字段中的声明覆盖
  ready: function () {},

  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () {},
    hide: function () {},
    resize: function () {},
  },
  methods: {
    //点击抽奖按钮
    async clickLuck(e, str) {
      let self = this
      if (!e) {
        e = this.data.clickLuckE
        str = this.data.clickLuckStr
      } else {
        self.setData({
          clickLuckE: e,
          clickLuckStr: str,
        })
      }
      let btnItem
      if (str == 'again') {
        btnItem = e.basicItem
      } else {
        btnItem = e.currentTarget.dataset.item
      }
      console.log('click====', e)
      console.log('click==str==', str)
      //先验证活动状态或黑手机
      let { isActNormal, isBlackUser, isLogoutUser, isStatusUser } = this.properties.commonData
      //活动是否已结束
      if (!isActNormal) {
        this.triggerEvent('actionActStatus', { status: 'isActNormal' })
        return
      }
      //是否符合活动条件
      if (!isStatusUser) {
        this.triggerEvent('actionActStatus', { status: 'isStatusUser' })
        return
      }
      //是否在美居
      let { needLoad } = this.data.selectGameRule
      if (needLoad) {
        this.actionLaunchApp(e)
        return
      }
      //是否黑产
      if (isBlackUser) {
        this.triggerEvent('actionActStatus', { status: 'isBlackUser' })
        return
      }
      //是否活动期间注销过
      if (isLogoutUser) {
        this.triggerEvent('actionActStatus', { status: 'isLogoutUser' })
        return
      }

      //次数不够
      let { lastDrawNum } = this.data
      if (lastDrawNum <= 0) {
        let tips = '暂无抽奖机会'
        let params = {
          basicItem: btnItem,
          selectContainer: self.properties.props,
          currDrawInfo: {
            result: false,
          },
        }
        this.triggerEvent('actionContainer', params)
        this.triggerEvent('actionShowToast', tips)
        return
      }

      //滑块验证
      let captRes = await this.checkCaptchaStatus()
      if (captRes === false) {
        let params = {
          id: 'my-luck-eggs',
          funcName: 'clickLuck',
          verifyCode: this.data.verifyCode,
        }
        this.triggerEvent('captchaOpen', params)
        return
      }
      let { luckClickFlag } = this.data
      if (!luckClickFlag) return
      self.setData({
        luckClickFlag: false,
      })

      this.triggerEvent('actionFullShadow')
      this.drawGrid()
        .then((res) => {
          console.log('view===drawGrid=====', res)
          // 6001 抽奖次数为0
          if (res.data.code != 0) {
            self.setData({
              luckClickFlag: true,
            })
            self.triggerEvent('actionFullShadow')
            //活动结束弹框 3002 已关闭  3004 已结束 3001 未发布 3003 未开始 4001 风险号
            let codeArr = [3002, 3004, 3001, 3003, 4001, 3009]
            if (codeArr.indexOf(res.data.code) >= 0) {
              let params = {
                basicItem: btnItem,
                selectContainer: self.properties.props,
                currDrawInfo: {
                  game_nostart: res.data.code == 3001 || res.data.code == 3003 ? true : false,
                  game_finish: res.data.code == 3002 || res.data.code == 3004 ? true : false,
                  game_blackuser: res.data.code == 4001 ? true : false,
                  repeat_click: res.data.code == 3009 ? true : false,
                },
              }
              this.triggerEvent('actionContainer', params)
            } else {
              this.triggerEvent('actionShowToast', res.data.msg)
            }
          } else {
            self.setData({
              currDrawInfo: res.data.data,
              drawBtnItem: btnItem,
            })
            self.startPlayAnimation(res)
          }
        })
        .catch(() => {
          self.setData({
            luckClickFlag: true,
          })
          self.triggerEvent('actionFullShadow')
        })
    },
    startPlayAnimation() {
      //适用于播放lottie动画
      let self = this
      let { currDrawInfo, drawBtnItem, drawTime } = self.data
      self.setData({
        isShowLottie: true,
      })
      let params = {
        basicItem: drawBtnItem,
        selectContainer: self.properties.props,
        currDrawInfo: currDrawInfo,
      }
      if (!currDrawInfo.result) {
        self.getViewCardData(currDrawInfo.receiveAwardPageId).then((res) => {
          let cardContainerInfo = res.containerList.length ? res.containerList[0] : {}
          cardContainerInfo['lastDrawNum'] = currDrawInfo.extraDrawTimes
          setTimeout(function () {
            self.triggerEvent('actionContainer', params)
            self.setData({
              cardPageSetting: res,
              cardContainerInfo: cardContainerInfo,
              isShowNoRewardDialog: true,
              lastDrawNum: currDrawInfo.extraDrawTimes,
              luckClickFlag: true,
            })
          }, drawTime)
        })
      } else {
        setTimeout(function () {
          self.triggerEvent('actionContainer', params)
          self.setData({
            luckClickFlag: true,
          })
        }, drawTime)
      }
    },
    initLuckData() {
      console.log('11111=======', this.properties.props)
      console.log('22222=======', this.properties.commonData)
      let imgMaskInfo
      let basicList = this.properties.props.basicList
      basicList.forEach((item) => {
        if (item.custom == 11) {
          imgMaskInfo = item
        }
        if (
          this.properties.isLogon &&
          item.custom == 9 &&
          this.properties.props.data.ninePalaceDrawInfo.drawSkin == 1
        ) {
          this.getAnimationContainerInfo(item.targetUrl)
        }
      })
      this.setData({
        imgMaskInfo,
        lastDrawNum: this.properties.props.data.ninePalaceDrawInfo.lastDrawNum,
        drawSkin: this.properties.props.data.ninePalaceDrawInfo.drawSkin,

        rollPlayInfoList: this.properties.props.data.ninePalaceDrawInfo.rollPlayInfoList || [],
      })
    },
    actionGetphonenumber(e) {
      console.log('授权手机号：', e)
      const item = e.currentTarget.dataset.item
      e.detail.basicItem = item
      e.detail.selectContainer = this.properties.props
      this.triggerEvent('actionGetphonenumber', e)
    },
    //熱区登录
    actionGetHotzonePhonenumber(e) {
      //从熱区传过来的参数会比原来多包装一层，实际e.detail才是原来传的值
      let { detail } = e
      //登录统一调用actionGetphonenumber方法，避免搞更多
      this.actionGetphonenumber(detail)
    },
    getViewCardData(pageId) {
      return new Promise((resolve, reject) => {
        this.getGamePage_token(pageId, false)
          .then((res) => {
            console.log('view===init=====', res)
            let currData = res.data.data.pageSetting
            resolve(currData)
          })
          .catch((e) => {
            console.log('no-reward--dialog========', e)
            reject(e)
          })
      })
    },
    actionNoRewardDialogClose() {
      this.setData({
        isShowNoRewardDialog: false,
      })
    },
    actionLottieClose() {
      this.triggerEvent('actionFullShadow')
      this.setData({
        isShowLottie: false,
      })
    },
    //再抽一次
    actionDrawAgain(e) {
      console.log('again=====', e)
      this.actionNoRewardDialogClose()
      this.clickLuck(e.detail, 'again')
    },
    actionHotzoneCustom(e) {
      this.triggerEvent('actionHotzoneCustom', e.detail)
    },
    actionHotzoneDialog(e) {
      console.log('热区打开弹框1', e)
      this.triggerEvent('actionHotzoneDialog', e.detail)
    },
    actionLaunchAppError(e) {
      this.triggerEvent('actionLaunchAppError', e.detail)
    },
    actionLaunchAppSuccess(e) {
      this.triggerEvent('actionLaunchAppSuccess', e.detail)
    },

    //获取动画的宽高和路径
    getAnimationContainerInfo(pageId) {
      let self = this
      this.getGamePage_token(pageId, false).then((res) => {
        self.setData({
          animationContainerInfo: res.data.data.pageSetting.popups,
        })
        if (res.data.data.pageSetting.popups.imgUrl) {
          self.getAnimation(res.data.data.pageSetting.popups.imgUrl)
        }
      })
    },
    getAnimation(imgUrl) {
      let self = this
      wx.request({
        url: imgUrl,
        method: 'GET',
        success: (res) => {
          self.setData({
            animationData: res.data,
            drawTime: Math.round(((res.data.op - res.data.ip) / res.data.fr) * 10000) / 10,
          })
        },
      })
    },
    actionActStatus(e) {
      const status = e.target.dataset.status
      const params = {
        status,
      }
      this.triggerEvent('actionActStatus', params)
    },
  },
})
