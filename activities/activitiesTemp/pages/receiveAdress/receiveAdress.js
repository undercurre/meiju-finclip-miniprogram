// index.js
const actTempmetMethodsMixins = require('../actTempmetMethodsMixins.js')
const commonMixin = require('../commonMixin.js')
import { dialogText, errorMsg } from '../containerCommon.js'
const app = getApp()
import { Base64 } from 'm-utilsdk/index'
Page({
  behaviors: [actTempmetMethodsMixins, commonMixin],
  data: {
    isLogon: false, // 是否登录标识
    user: {
      text: '收货人',
      placeHolder: '输入收货人姓名',
    },
    phone: {
      text: '手机号码',
      placeHolder: '输入11位手机号',
    },
    chooseArea: {
      text: '选择地区',
      placeHolder: '选择地区',
    },
    address: {
      text: '详细地址',
      placeHolder: '街道门牌信息',
    },
    // 提交内容
    form: {
      name: '',
      phone: '',
      region: [],
      address: '',
    },
    input1: false,
    input2: false,
    input3: false,
    input4: false,
    disabled: true,
    isGameOver: false,
    // 地址弹窗
    isShowAdressPopup: false,
    // 二次确认弹窗
    isShowConfirmDialog: false,
    rewardId: '',
  },

  onShow: function () {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0,
        show: false,
      })
    }
  },

  onLoad: function (options) {
    console.log('addr000', options)
    this.getInitOptions(options) // this.data.options
    this.setData({
      rewardId: options.prizeId,
    })
    // 登录
    app
      .checkGlobalExpiration()
      .then((res) => {
        console.log('微信token未过期', res)
        this.setData({
          isLogon: app.globalData.isLogon,
        })
        if (!this.data.isLogon) {
          reject(false)
          return
        }
      })
      .catch((e) => {
        console.warn('微信token已过期', e)
        this.setData({
          isLogon: app.globalData.isLogon,
        })
        wx.hideLoading()
      })
  },

  // 用text伪装placeholder   点击text input获取焦点
  placeHo(e) {
    let { id } = e.currentTarget.dataset
    this.setData({
      [`input${id}`]: true,
    })
    console.log([`input${id}`], this.data[`input${id}`])
  },
  // 失去焦点判断  假如值为空  用回text
  inputBlur(e) {
    let { id } = e.currentTarget.dataset
    let [key, num] = id.split('|')
    console.log(key, num)
    this.setData({
      ['form.' + key]: e.detail.value.trim(),
    })
    // if(num==4) return
    if (!this.data.form[key]) {
      this.setData({
        ['input' + num]: false,
      })
    }
  },
  // input 输入事件
  inputInput(e) {
    let { form } = this.data
    let { id } = e.currentTarget.dataset
    let [key, num] = id.split('|')
    console.log(key, num)
    this.setData({
      ['form.' + key]: e.detail.value.trim(),
    })
    // console.log("form", form)
    if (form.name && form.phone && form.region.length > 0 && form.address) {
      this.setData({
        disabled: false,
      })
    } else {
      this.setData({
        disabled: true,
      })
    }
    if (num == 4) return
    if (!this.data.form[key]) {
      this.setData({
        ['input' + num]: false,
      })
    }
  },
  // 获取地区
  onGetRegion(e) {
    let { form } = this.data
    form.region = e.detail
    console.log(form)
    this.setData({
      form: form,
    })
  },
  // 保存接口   todo
  save() {
    // save接口比input接口触发快很多  试过nextTick和   settimeout 0甚至10  都不行
    // setTimeout(() => {
    //   let {form} = this.data
    //   console.log(form)
    //   if(!form.name || !form.phone || form.region.length==0 || !form.address){
    //     wx.showToast({
    //       title: '请填完',
    //       icon:'none',
    //       duration: 3000
    //     })
    //     // return
    //   }
    // }, 20);
    // this.setData({
    //   isShowConfirmDialog:true
    // })
    setTimeout(() => {
      let { form } = this.data
      if (!form.name || !form.phone || form.region.length == 0 || !form.address) {
        wx.showToast({
          title: '请将信息填写完整',
          icon: 'none',
          duration: 3000,
        })
      } else {
        if (form.name.length == 1) {
          wx.showToast({
            title: '请输入正确的姓名',
            icon: 'none',
            duration: 2000,
          })
          return
        }
        if (!/^1\d{10}$/.test(form.phone)) {
          wx.showToast({
            title: '请输入正确的手机号',
            icon: 'none',
            duration: 2000,
          })
          return
        }
        if (form.address.length < 5) {
          wx.showToast({
            title: '请输入详细地址',
            icon: 'none',
            duration: 2000,
          })
          return
        }
        this.setData({
          isShowConfirmDialog: true,
        })
      }
    }, 50)
  },
  // 提交收货地址
  submitAddress(e) {
    let { rewardId } = this.data
    let addrForm = e.detail
    console.log('submitAddress 提交的地址', addrForm)
    let combineAddr = addrForm.region.join(',') + addrForm.address
    console.log('combineAddr', combineAddr)
    const prizeId = rewardId
    // const prizeId = 101313
    const userName = Base64.encode(addrForm.name)
    const userMobile = Base64.encode(addrForm.phone)
    const userAddress = Base64.encode(combineAddr)
    let params = {
      prizeId,
      userName,
      userMobile,
      userAddress,
    }
    console.log('提交地址参数', params)
    console.log('防止上个页面传错 prizeId', JSON.stringify(prizeId))

    this.gameStatus().then((res) => {
      let game_finish = res.data.data.game_finish
      if (game_finish) {
        this.checkGameOver()
        // this.setData({
        //   isGameOver:true
        // })
      } else {
        this.saveAddress(params)
          .then((res) => {
            console.log('保存地址 res', res)
            let basic = [
              { target: 'navigateBack', targetUrl: '', name: dialogText.iKnow, params: '', title: '提交成功' },
            ]
            this.setStaticDialog(4, '我们将尽快为您安排发货，可在"我的奖品页面"查看详细进度', basic)
          })
          .catch((err) => {
            console.log('报错catch', err)
            if (err.data.code == 4040) {
              let basic = [{ target: 1, targetUrl: '', name: dialogText.iKnow, params: '' }]
              this.setStaticDialog(4, errorMsg.accountRisk, basic) //注销过账号的提示跟黑产用户一直，都是账号异常
              return false
            }
          })
      }
    })
  },

  // 活动结束弹窗
  checkGameOver() {
    let basic = [{ target: 1, targetUrl: '', name: dialogText.iKnow, params: '' }]
    this.setStaticDialog(4, '来晚啦！活动已结束～', basic)
  },

  //关闭地址dialog
  onDialogClose() {
    this.setData({
      isShowAdressPopup: false,
    })
  },
  // 打开地址dialog
  showAddressPopup() {
    if (!this.data.isShowAdressPopup) {
      let child = this.selectComponent('#addressPopup')
      child.onMaskShow()
      // wx.nextTick(()=>{
      //   this.setData({
      //     isShowAdressPopup:true
      //   })
      // })
    }
    this.setData({
      isShowAdressPopup: true,
    })
    // let child = this.selectComponent('#addressPopup');
    // child.onMaskShow()
  },
  onReady() {},
})
