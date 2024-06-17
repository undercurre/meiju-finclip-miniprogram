const app = getApp()
import { service } from 'assets/js/service'

Page({
  data: {
    addressListPage: 1,
    addressList: [
      // {name: '张三', phone:'12343234543'}
    ],
  },

  onLoad: function () {
    // 初始化地址列表
    // this.getAddressList()
  },
  onReady: function () {},
  onShow: function () {
    this.data.addressListPage = 1
    this.getAddressList()
  },

  //获取地址列表
  getAddressList() {
    wx.showLoading({
      title: '加载中...',
      mask: true,
    })
    // const { addressList, addressListPage } = this.data
    let params = {
      // mobile:app.globalData.phoneNumber,
      // sourceSys:'MDWX',
      // brand:1,
      // pageIndex: addressListPage,
      // pageSize: 200
      headParams: {},
      pagination: {
        pageNo: 1,
        pageSize: 200,
      },
      restParams: {
        mobile: app.globalData.userData.userInfo.mobile,
        sourceSys: 'MDWX',
        brand: 1,
      },
    }
    service
      .getAddrList(params)
      .then((data) => {
        console.log(data)
        let addrList = data.data.data.list
        console.log(addrList)
        if (!addrList) {
          this.setData({
            addressList: [],
          })
        } else {
          addrList.forEach((element) => {
            var antianaphylaxisMobile = element.receiverMobile.replace(/(\d{3})\d*(\d{4})/, '$1****$2')
            element.antianaphylaxisMobile = antianaphylaxisMobile
          })

          this.setData({
            addressList: addrList,
            // addressList:addressList.concat(addrList)
          })
        }
        // console.log("addressList",this.data.addressList)
        wx.hideLoading()
      })
      .catch(() => {
        wx.hideLoading()
      })
  },

  // 设置默认地址 废弃api  坑成狗，what a fucking ***!
  // setDefaultAddress(e){
  //   wx.showLoading({
  //     mask:true
  //   })
  //   console.log("setDefaultAddress page", e)
  //   let defaultType = e.detail.defaultAddr
  //   let that = this
  //   console.log("defaultType page", defaultType)

  //   let params = {
  //     userAddrId:e.detail.userAddrId,
  //     mobile:app.globalData.phoneNumber,
  //     sourceSys:'APP',
  //     defaultAddr:!defaultType
  //   }
  //   service.setDefaultAddr(params).then(data=>{
  //     console.log("data setdefault result", data)
  //     if (data.data.code == 0) {
  //       wx.showToast({
  //         title: '设置成功',
  //         icon: 'success',
  //       })
  //       that.setData({
  //         addressListPage:1
  //       })
  //       that.getAddressList()
  //     } else {
  //       wx.showToast({
  //         title: '设置失败',
  //         icon: 'fail',
  //       })
  //     }
  //     wx.hideLoading()
  //   }).catch(()=>{
  //     wx.hideLoading()
  //   })
  // },

  // 修改地址替换默认地址
  setDefaultAddress(e) {
    wx.showLoading({
      mask: true,
    })
    // console.log("setDefaultAddress page", e)
    const receiverName = e.detail.contactName //姓名
    const receiverMobile = e.detail.receiverMobile
    const provinceName = e.detail.provinceName
    const province = e.detail.province
    const cityName = e.detail.cityName
    const city = e.detail.city
    const countyName = e.detail.countyName
    const county = e.detail.county
    const streetName = e.detail.streetName
    const street = e.detail.street
    const addr = e.detail.addr //详细地址
    const defaultAddr = !e.detail.defaultAddr //详细地址
    const userAddrId = e.detail.userAddrId //地址id
    const uid = app.globalData.userData.userInfo.uid

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
        uid,
      },
    }
    service
      .modifyAddr(params)
      .then((data) => {
        wx.hideLoading()
        console.log('data setdefault result', data)
        if (data.data.code == 0) {
          wx.showToast({
            title: '设置成功',
            icon: 'success',
            duration: 1000,
          })
          this.data.addressListPage = 1
          this.getAddressList()
        } else {
          wx.showToast({
            title: '设置失败',
            icon: 'fail',
          })
        }
      })
      .catch(() => {
        wx.hideLoading()
      })
  },

  //修改地址
  modifyAddress(e) {
    console.log('page  修改地址 e.detail', e.detail)
    let title = '编辑地址'
    let addrInfo = encodeURIComponent(JSON.stringify(e.detail))
    wx.navigateTo({
      url: `/midea-service/pages/addAddress/addAddress?title=${title}&addrInfo=${addrInfo}`,
    })
  },

  //删除地址
  delAddress(e) {
    let that = this
    let { selectedAddrId } = app.globalData
    let userAddrId = e.detail.userAddrId
    console.log('page  删除地址 e', e)
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
            // userAddrId:userAddrId,
            headParams: {},
            restParams: {
              mobile: app.globalData.userData.userInfo.mobile,
              sourceSys: 'APP',
              userAddrId: userAddrId,
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
                console.log('this....', this)
                console.log('that....', that)
                // 处理已选择的地址被删除
                if (userAddrId == selectedAddrId) {
                  let pages = getCurrentPages()
                  let prevPage = pages[pages.length - 2]
                  //将数值信息赋值给上一页面addrItem变量
                  prevPage.setData({
                    addrItem: '',
                  })
                }

                that.data.addressListPage = 1
                that.getAddressList()
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

  // 去新增地址
  toAddAddress() {
    let title = '添加地址'
    wx.navigateTo({
      url: `/midea-service/pages/addAddress/addAddress?title=${title}`,
    })
  },

  // 选择地址
  selectAddress(e) {
    console.log('page  选择地址 e', e)
    let addrItem = e.currentTarget.dataset.item
    console.log('page  选择地址 addrItem', addrItem)
    app.globalData.selectedAddrId = addrItem.userAddrId // 全局保存 防止丢失
    let pages = getCurrentPages()
    let prevPage = pages[pages.length - 2]
    //将数值信息赋值给上一页面addrItem变量
    prevPage.setData({
      addrItem: addrItem,
    })
    wx.navigateBack({
      delta: 1,
    })
  },

  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {},
  onReachBottom: function () {
    // 到达底部 自动加载下一页地址
    // let { addressListPage } = this.data
    // let pageIndex = addressListPage+1
    // console.log("onReachBottom addressListPage",addressListPage)
    // console.log("onReachBottom pageIndex",pageIndex)
    // this.setData({
    //   addressListPage:pageIndex
    // })
    // this.getAddressList()
  },
  // onShareAppMessage: function () {

  // }
})
