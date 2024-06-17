// midea-replace-repair/pages/completeInfo/completeInfo.js
const app = getApp() //获取应用实例
import { requestService } from '../../../utils/requestService'
import { replaceRepairResult } from '../../../utils/paths.js'

import { api, uploadApi } from '../../../api'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    showActionsheet: false,
    groups: [
      { text: '导入订单', value: 1 },
      { text: '导入电子发票', value: 2 },
    ],
    isShowDialog: false, //提交信息的确认弹窗
    urlStr: '',
    productInfo: '', // 产品信息 产品选择页面传过来的
    orderInfo: '', //订单信息
    eInvoiceInfo: '', //电子发票
    productItem: '', // 上传的凭证 拆分为photoList, buyTime
    photoList: [],
    buyTime: '',
    isShowErrorDialog: false, //失败弹窗
    errorContent: '',
    isUploadSuccess: true, //凭证是否全部上传成功
  },

  // observers:{
  //   'photoList'(newVal) {
  //     console.log("observers photoList",newVal )
  //     this.setData({
  //       photoList:newVal
  //     })
  //   }
  // },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let pages = getCurrentPages()
    let prevpage = pages[pages.length - 2]
    console.log('prevpage.route', prevpage.route)
    console.log('completeInfo onload options', JSON.parse(options.product))

    if (prevpage.route == 'activities/replace365/pages/home/home') {
      let product = JSON.parse(options.product)
      this.setData({
        productInfo: product,
        productType: product.productType,
        productModel: product.productModel,
        serialNo: product.serialNo,
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
    console.log('this.data.orderInfo', this.data.orderInfo)
    console.log('this.data.eInvoiceInfo', this.data.eInvoiceInfo)
    console.log('this.data.productItem', this.data.productItem)
    console.log('this.data.photoList', this.data.photoList)
    console.log('this.data.buyTime', this.data.buyTime)
    console.log('this.data.orderInfo', this.data.orderInfo)
  },

  //
  loadBuyRecord() {
    this.setData({
      showActionsheet: true,
    })
  },

  // 去上传凭证页面
  loadBuyImage() {
    wx.navigateTo({
      url: '../uploadEvidence/uploadEvidence',
    })
  },

  //click actionsheet item去订单页或者发票页
  itemClick(e) {
    console.log('e', e)
    this.setData({
      showActionsheet: false,
    })
    if (e.detail.index == 0) {
      wx.navigateTo({
        url: '../orderList/orderList',
      })
    } else if (e.detail.index == 1) {
      wx.navigateTo({
        url: '../E-InvoiceList/E-InvoiceList',
      })
    }
  },

  previewImage(e) {
    let index = e.currentTarget.dataset.index
    let { photoList } = this.data
    let imgUrlList = photoList.map((item) => {
      return item.fileName
    })
    console.log('imgUrlList 预览列表', imgUrlList)
    wx.previewImage({
      current: photoList[index].fileName, // 当前显示图片的http链接
      urls: imgUrlList, // 需要预览的图片http链接列表
    })
  },

  // 点击del-icon删除订单数据item
  delItem() {
    this.setData({
      orderInfo: '',
      eInvoiceInfo: '',
    })
  },

  // 点击del-icon删除凭证item图片
  delEvidenceItemImg(e) {
    let { photoList, buyTime } = this.data
    console.log('delEvidenceItemImg photoList', photoList)
    console.log('delEvidenceItemImg e', e)
    let index = e.currentTarget.dataset.index
    let newPhotoList = photoList.splice(index, 1)
    console.log('delEvidenceItemImg newPhotoList', newPhotoList)
    console.log('delEvidenceItemImg photoList', this.data.photoList)
    const test = this.data.photoList //因为splice修改的是原数据，所以直接获取原数据用setdata更新视图即可
    this.setData({
      photoList: test,
      buyTime: test.length == 0 ? '' : buyTime,
      // photoList:photoList.splice(index,1)
    })
  },

  //  提显示确认弹窗
  submit() {
    this.setData({
      isShowDialog: true,
    })
  },
  // 确认提交
  makeSure() {
    console.log('确认提交了')
    let { urlStr } = this.data
    console.log('makeSure urlStr', urlStr)
    wx.showLoading({
      title: '处理中...',
      mask: true,
    })
    const { productInfo, orderInfo, eInvoiceInfo, productItem, buyTime } = this.data
    console.log('userProductUpdate productInfo', productInfo, productItem)
    let params = {
      ...productInfo,
      ...orderInfo,
      ...eInvoiceInfo,
      buyDate: buyTime,
      invoiceIds: [eInvoiceInfo.invoiceId || ''],
      sourceSys: 'APP',
      businessType: 'saveAndActivate',
      invoiceImgUrl: urlStr, //contentStr fileName imgMeta imgUrl
    }
    console.log('userProductUpdate params', params)
    // return
    requestService
      .request('userProductUpdate', params)
      .then((resp) => {
        wx.hideLoading()
        console.log('userProductUpdate resp', resp)
        if (resp.data.code == 0) {
          wx.navigateTo({
            url: replaceRepairResult,
          })
        } else {
          // reject(resp)
        }
      })
      .catch((err) => {
        wx.hideLoading()
        console.log('以旧换新submit', err)
        this.setData({
          errorContent: err.data.msg,
          isShowErrorDialog: true,
        })
      })
  },

  applyForCard() {
    wx.showLoading({
      title: '处理中...',
    })
    let { photoList } = this.data

    if (photoList.length > 0) {
      // phiotoList.forEach((item, index, arr)=>{    //forEach是异步的循环，可能第一张没有上传成功，第三张就成功了，不可取
      for (let i = 0; i < photoList.length; i++) {
        if (photoList[i].size <= 10000000) {
          this.uploadImages(photoList[i])
            .then((res) => {
              console.log('uploadImages resolve', res)
              let { urlStr, isUploadSuccess } = this.data
              if (!isUploadSuccess) {
                this.setData({
                  errorContent: '您有凭证上传失败，请重新点击“提交”再次上传凭证激活保修卡',
                  isShowErrorDialog: true,
                })
              }
              this.setData({
                urlStr: urlStr == '' ? `${res.prefix}${res.filePath}` : `${urlStr},${res.prefix}${res.filePath}`,
              })
              if (i == photoList.length - 1) {
                this.makeSure()
              }
              console.log('uploadImages urlStr', this.data.urlStr)
            })
            .catch((err) => {
              console.log('uploadImages err', err)
            })
          // console.log("uploadImages return",this.uploadImages(item) )
        } else {
          wx.showToast({
            title: '上传图片不能大于10MB！',
            icon: 'none',
          })
        }
        // })  foreach
      } //for
    } else {
      this.makeSure()
    }
  },

  // upload
  uploadImages(item) {
    console.log('uploadImages excute')
    console.log('uploadApi', uploadApi)
    console.log('uploadApi url', uploadApi.uploadPic.url)
    // let apiUrl = uploadApi.uploadPic.url   //新api 未上线
    // let apiUrl = uploadApi.upload.url
    let apiUrl = api.upload.url
    let that = this
    console.log('apiUrl cccc', api.upload.url)

    // let apiUrl = 'https://cmms2.midea.com/ccrm2-core/uploadApi/upload'
    // let apiUrl = 'https://mcsp.midea.com/api/mcsp_uc/mcsp-uc-member/member/uploadPic.do'        //prod
    // let apiUrl = 'https://mcsp-sit.midea.com/api/mcsp_uc/mcsp-uc-member/member/uploadPic.do' //sit
    // let apiUrl = 'http://10.74.132.43:8199/member/uploadPic.do'    //local server
    return new Promise((resove) => {
      wx.uploadFile({
        url: apiUrl,
        filePath: item.fileName,
        name: 'file',
        header: {
          'Content-Type': 'multipart/form-data',
          accessToken: app.globalData.userData.mdata.accessToken,
        },
        formData: {
          headParams: {
            language: 'CN',
            originSystem: 'MCSP',
            timeZone: 8,
            userCode: 'guocg',
            tenantCode: 'P001',
            userKey: 'TEST_',
          },
          request: '{}',
        },
        success(res) {
          console.log('res.data', res.data)
          console.log('typeof(res.data)', typeof res.data) //string
          let resData = JSON.parse(res.data)
          console.log('typeof(resData)', typeof resData) // due to 服务端响应的对象是字符串格式，不能拿到其属性，这里将其转为对象格式
          console.log('resData', resData)
          if (resData.code == '000000') {
            console.log('上传成功 res url', resData.data)
            resove(resData.data)
          } else {
            console.log('响应成功 上传错误 res url', resData, resData.data)
            that.setData({
              isUploadSuccess: false,
            })
            resove(resData.data)
          }
        },
        fail(err) {
          console.log('err', err)
          console.log('响应失败 上传错误 res url', err)
          that.setData({
            isUploadSuccess: false,
          })
          // reject(err)
          resove({ prefix: '', filePath: '' })
        },
      })
    })
  },

  goAbout() {
    wx.navigateTo({
      url: '../about/about',
    })
  },

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
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
})
