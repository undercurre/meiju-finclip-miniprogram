import { requestService, rangersBurialPoint } from '../../../../utils/requestService'
import { imgBaseUrl } from '../../../../api'
import { getStamp, getReqId } from 'm-utilsdk/index'
import { checkWxVersion_807 } from '../../../../utils/util.js'
import { getFullPageUrl, showToast, computedBehavior } from 'm-miniCommonSDK/index'
import { addGuide, inputWifiInfo, searchDevice } from '../../../../utils/paths'
import { isSupportPlugin } from '../../../../utils/pluginFilter'
import { isAddDevice } from '../../../../utils/temporaryNoSupDevices'
import { getLinkType } from '../../../assets/js/utils'
import { addDeviceSDK } from '../../../../utils/addDeviceSDK'
import Dialog from '../../../../miniprogram_npm/m-ui/mx-dialog/dialog'
const brandStyle = require('../../../assets/js/brand.js')
import { imgesList } from '../../../assets/js/shareImg.js'
import { getPrivateKeys } from '../../../../utils/getPrivateKeys'
import { getQueryIotProductV4 } from '../../api/api'
const app = getApp()
const imgUrl = imgBaseUrl.url + '/shareImg/' + app.globalData.brand
const getFamilyPermissionMixin = require('../../../assets/js/getFamilyPermissionMixin.js')
Page({
  behaviors: [computedBehavior, getFamilyPermissionMixin],
  /**
   * 页面的初始数据
   */
  data: {
    currentIndex: 0,
    searchIconImg: imgBaseUrl.url + '/mideaServices/images/icon.png',
    notFoundImg: imgUrl + imgesList['noResult'],
    productList: [],
    scrollHeight: 0,
    isIphoneX: false,
    targetId: '',
    pageNum: 1,
    hasNext: false,
    loadFlag: false,
    clickFLag: false, //防重复点击
    prodName: '',
    brand: '',
    dialogStyle: brandStyle.config[app.globalData.brand].dialogStyle, //弹窗样式
  },
  computed: {
    //距离底部多远
    bottomPadding() {
      let { isIphoneX } = this.data
      return isIphoneX ? '100' : '70'
    },
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getApp().onLoadCheckingLog()
    this.data.brand = app.globalData.brand
    this.setData({
      brand: this.data.brand,
    })
    if (this.data.brand == 'colmo') {
      wx.setNavigationBarColor({
        backgroundColor: '#151617',
        frontColor: 'rgba(255,255,255,0.80)',
      })
    }
    this.getLoginStatus().then(() => {
      if (app.globalData.isLogon) {
        this.checkFamilyPermission()
      } else {
        this.navToLogin()
      }
    })
    this.setData({
      subCode: options.category || '',
      prodName: options.name || '',
    })
    this.initData()
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () { },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () { },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () { },

  goToPage(url) {
    wx.navigateTo({
      url,
    })
  },
  getSystemInfo() {
    let self = this
    wx.getSystemInfo({
      success: function (res) {
        console.log('res:',res)
        self.setData({
          scrollHeight: res.windowHeight,
        })
        if (res.safeArea.top > 20) {
          self.setData({
            isIphoneX: true,
          })
        } else {
          self.setData({
            isIphoneX: false,
          })
        }
      },
    })
  },
  initData() {
    let self = this
    self.getSystemInfo()
    self.getGateway()
  },
  getQueryIotProductV2(str) {
    let self = this
    let { pageNum, productList, subCode } = self.data
    let param = {
      subCode,
      pageSize: '20',
      page: pageNum,
      brand: app.globalData.brand == 'meiju' ? '' : app.globalData.brand,
      stamp: getStamp(),
      reqId: getReqId(),
    }
    requestService
      .request(getQueryIotProductV4, param)
      .then((res) => {
        console.log('res=====', res)
        let currList = res.data.data.list || []
        let hasNextPage = res.data.data.hasNextPage
        if (!currList.length) {
          return
        }
        let currProduct = str != 'next' ? currList : [...productList, ...currList]
        self.setData({
          productList: currProduct,
          loadFlag: true,
        })
        self.setData({
          hasNext: hasNextPage,
        })
      })
      .catch(() => {
        self.setData({
          hasNext: false,
          loadFlag: true,
        })
      })
  },

  getGateway(){
    // let param = {
    //   code, // sn8/A0
    //   category, //品类
    //   brand: app.globalData.brand == 'meiju' ? '' : app.globalData.brand,
    //   stamp: getStamp(),
    //   reqId: getReqId(),
    // }

    let obj = {
      "code": 0,
      "data": [
        {
            "aliasName": "烤箱",
            "brand": "midea",
            "category": "B4",
            "customerModel": "PT3535W",
            "id": 13002,
            "isVisible": 2,
            "lastUpdateDate": 1686185994000,
            "marketModel": "PT3535W",
            "productCode": "21071010002518",
            "productId": "PT3535W",
            "productImg": "http://midea-file.oss-cn-hangzhou.aliyuncs.com/2022/4/2/10/ekhQavACBCgrRhJJALaf.png",
            "productName": "桌面式烤箱",
            "productStatus": 2,
            "smartProductId": 12,
            "sn8": "71000360",
            "sourceSystem": "mjapp",
            "subCode": "D4X3",
            "supCode": "D4",
            "superGatewayIsVisible": true
        },
        {
            "aliasName": null,
            "brand": null,
            "category": "16",
            "customerModel": null,
            "id": null,
            "isVisible": null,
            "lastUpdateDate": null,
            "marketModel": null,
            "productCode": null,
            "productId": null,
            "productImg": null,
            "productName": null,
            "productStatus": null,
            "smartProductId": null,
            "sn8": "MSGWG02",
            "sourceSystem": null,
            "subCode": null,
            "supCode": null,
            "superGatewayIsVisible": false
        }
      ],
      "msg": "操作成功"
    }

    this.setData({
      loadFlag:true,
      productList:app.globalData.notMatchGateWayslist
    })

    console.log('列表：',this.data.productList)
  }
})
