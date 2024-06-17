// midea-service/pages/addAddress/addAddress.js
const app = getApp()
// import { Base64 } from '../../../miniprogram_npm/m-utilsdk/index'
import { hasKey } from 'm-utilsdk/index'

import { service } from 'assets/js/service'

Page({
  behaviors: [],
  data: {
    user: {
      text: '姓名',
      placeHolder: '请输入姓名',
    },
    phone: {
      text: '手机号码',
      placeHolder: '请输入手机号码',
    },
    chooseArea: {
      text: '所在区域',
      placeHolder: '请选择所在区域',
    },
    address: {
      text: '详细地址',
      placeHolder: '请输入详细地址',
    },
    isDefaultAddr: {
      text: '默认地址',
    },
    // 提交内容
    form: {
      name: '',
      phone: '',
      region: [],
      address: '',
      defaultAddr: false,
    },
    input1: false,
    input2: false,
    input3: false,
    input4: false,
    disabled: false,
    // 地址弹窗
    isShowAdressPopup: false,
    isModifyMode: false,
    antianaphylaxis: false,
    modifyAddrInfo: {},
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
    // console.log("接收到的数据", JSON.parse(decodeURIComponent(options.addrInfo)));
    if (options.title == '编辑地址') {
      const addrInfo = hasKey(options, 'addrInfo') ? options.addrInfo : ''
      let addrData = JSON.parse(decodeURIComponent(addrInfo))
      console.log('addrData', addrData)
      this.setData({
        isModifyMode: true,
        antianaphylaxis: true,
        modifyAddrInfo: addrData,
      })
      this.modifyAddrInfo(addrData)
    } else {
      this.setData({
        isModifyMode: false,
        antianaphylaxis: false,
        modifyAddrInfo: {},
      })
    }
    wx.setNavigationBarTitle({
      title: options.title,
    })
  },

  modifyAddrInfo(val) {
    console.log('observers.modifyAddrInfo')
    let defineForm = {}
    let region = {
      provinceName: val.provinceName,
      cityName: val.cityName,
      countyName: val.countyName,
      streetName: val.streetName,
      provinceCode: val.province,
      cityCode: val.city,
      countyCode: val.county,
      streetCode: val.street,
    }
    defineForm.name = val.contactName
    defineForm.mobile = val.antianaphylaxisMobile //脱敏电话
    defineForm.phone = val.receiverMobile
    defineForm.region = region
    defineForm.address = val.addr
    defineForm.defaultAddr = val.defaultAddr
    defineForm.userAddrId = val.userAddrId
    console.log('defineForm', defineForm)
    this.setData({
      form: defineForm,
    })
    console.log('form', this.data.form)
  },

  // 用text伪装placeholder   点击text input获取焦点
  placeHo(e) {
    let { id } = e.currentTarget.dataset
    this.setData({
      [`input${id}`]: true,
    })
    console.log([`input${id}`], this.data[`input${id}`])
  },
  setAddress() {
    this.setData({
      input4: true,
    })
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
    console.log('form999', form)
    // if(form.name && form.phone && form.region.length>0 && form.address){
    if (form.name && form.phone && form.region.provinceCode && form.address) {
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

  // 脱敏电话获取焦点
  antiMobileClicked() {
    this.setData({
      antianaphylaxis: false,
      input2: true,
    })
  },

  // 输入合规性校验
  formatInput(key) {
    let attr = this.data.form[key]
    let newVal
    newVal = attr.replace(/[^\u0000-\u9fff]/g, '').replace(/[&?]/g, '')
    this.setData({
      ['form.' + key]: newVal,
    })
  },

  // switch切换事件
  switchChange(event) {
    this.data.form.defaultAddr = event.detail.value
  },
  // 获取地区
  onGetRegion(e) {
    let { form } = this.data
    form.region = e.detail
    console.log('form---', form)
    console.log('e.detail---', e.detail)
    this.setData({
      form: form,
    })
  },

  // 保存接口   todo
  save() {
    // save接口比input接口触发快很多  试过nextTick和   settimeout 0甚至10  都不行
    // 为了获取到值以后才做save校验
    setTimeout(() => {
      let { form, isModifyMode } = this.data
      this.formatInput('name')
      this.formatInput('address')
      if (!form.name || !form.phone || form.region.length == 0 || !form.address) {
        wx.showToast({
          title: '请将信息填写完整',
          icon: 'none',
          duration: 3000,
        })
        return
      } else {
        let reg = /^[\u4e00-\u9fffa-zA-Z]{2,50}$/ // 两位以上中英文
        // if(form.name.length==1){
        if (!reg.test(form.name)) {
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
        if (form.address.length < 1) {
          wx.showToast({
            title: '请输入详细地址',
            icon: 'none',
            duration: 2000,
          })
          return
        }
        isModifyMode ? this.modifyAddress(form) : this.submitAddress(form)
      }
    }, 50)
  },
  // 提交收货地址
  submitAddress(form) {
    // this.save()
    wx.showLoading({
      title: '保存中...',
      mask: true,
    })
    console.log('submitAddress 提交的地址', form)
    // let combineAddr =  form.region.join(",")+form.address1
    // console.log("combineAddr", combineAddr)
    // const userName = Base64.encode(form.name)
    // const userMobile = Base64.encode(form.phone)
    // const userAddress = Base64.encode(combineAddr)
    const receiverName = form.name //姓名
    const receiverMobile = form.phone
    const provinceName = form.region['provinceName']
    const province = form.region['provinceCode']
    const cityName = form.region['cityName']
    const city = form.region['cityCode']
    const countyName = form.region['countyName']
    const county = form.region['countyCode']
    const streetName = form.region['streetName']
    const street = form.region['streetCode']
    const addr = form.address //详细地址
    const defaultAddr = form.defaultAddr //详细地址
    const sourceSys = 'APP'
    const mobile = app.globalData.userData.userInfo.mobile

    let params = {
      // receiverName, receiverMobile, provinceName, cityName, countyName, streetName,
      // province, city, county, street, addr, defaultAddr, sourceSys
      headParams: {},
      restParams: {
        receiverName,
        receiverMobile,
        provinceName,
        cityName,
        countyName,
        streetName,
        province,
        city,
        county,
        street,
        addr,
        defaultAddr,
        sourceSys,
        mobile,
      },
    }
    console.log('提交地址参数', params)
    service
      .addAddress(params)
      .then((data) => {
        console.log('提交地址参数  res', data)
        wx.hideLoading()
        wx.showToast({
          title: '保存成功',
          icon: 'success',
        })
        wx.navigateBack({
          delta: 0,
        })
      })
      .catch((err) => {
        wx.hideLoading()
        wx.showToast({
          title: '保存失败',
          icon: 'error',
        })
        console.log('提交地址参数  catch', err)
      })
  },

  modifyAddress(form) {
    wx.showLoading({
      title: '保存中...',
      mask: true,
    })
    console.log('submitAddress 提交的地址', form)
    // let combineAddr =  form.region.join(",")+form.address1
    // console.log("combineAddr", combineAddr)
    // const userName = Base64.encode(form.name)
    // const userMobile = Base64.encode(form.phone)
    // const userAddress = Base64.encode(combineAddr)
    const receiverName = form.name //姓名
    const receiverMobile = form.phone
    const provinceName = form.region['provinceName']
    const province = form.region['provinceCode']
    const cityName = form.region['cityName']
    const city = form.region['cityCode']
    const countyName = form.region['countyName']
    const county = form.region['countyCode']
    const streetName = form.region['streetName']
    const street = form.region['streetCode']
    const addr = form.address //详细地址
    const defaultAddr = form.defaultAddr //详细地址
    const userAddrId = form.userAddrId //地址id
    const mobile = app.globalData.userData.userInfo.mobile

    let params = {
      // receiverName, receiverMobile, provinceName, cityName, countyName, streetName,
      // province, city, county, street, addr, defaultAddr, userAddrId
      headParams: {},
      restParams: {
        receiverName,
        receiverMobile,
        provinceName,
        cityName,
        countyName,
        streetName,
        province,
        city,
        county,
        street,
        addr,
        defaultAddr,
        userAddrId,
        mobile,
      },
    }
    console.log('修改地址参数', params)
    service
      .modifyAddr(params)
      .then((data) => {
        console.log('data000000000000', data)
        wx.hideLoading()
        wx.showToast({
          title: '保存成功',
          icon: 'success',
        })
        wx.navigateBack({
          delta: 0,
        })
      })
      .catch(() => {})
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

  // 删除当前地址
  delAddress() {
    let { form } = this.data
    wx.showModal({
      content: '确定删除该地址吗？',
      cancelColor: '#267aff',
      confirmColor: '#267aff',
      success: function (res) {
        if (res.cancel) {
          //点击取消
        } else {
          //点击确定
          wx.showLoading({
            title: '删除中...',
            mask: true,
          })
          console.log('delAddress page')
          let params = {
            // mobile:app.globalData.phoneNumber,
            // sourceSys:'APP',
            // userAddrId:form.userAddrId,
            headParams: {},
            restParams: {
              mobile: app.globalData.userData.userInfo.mobile,
              sourceSys: 'APP',
              userAddrId: form.userAddrId,
            },
          }
          service
            .deleteAddr(params)
            .then((data) => {
              console.log('data del result', data)
              if (data.data.code == 0) {
                wx.hideLoading()
                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                })
                wx.navigateBack({
                  delta: 0,
                })
              }
            })
            .catch(() => {
              wx.hideLoading()
            })
        }
      },
      fail: function () {}, //接口调用失败的回调函数
      complete: function () {}, //接口调用结束的回调函数（调用成功、失败都会执行）
    })
  },

  clearAddr() {
    this.setData({
      'form.address': '',
      input4: true,
    })
  },

  onReady() {},
})
