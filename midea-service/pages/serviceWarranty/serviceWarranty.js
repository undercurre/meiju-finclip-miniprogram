// midea-service//pages/serviceWarranty/serviceWarranty.js
// const app = getApp()
import paths from '../../../utils/paths'
import { requestService } from '../../../utils/requestService'
import { getUrlkey } from 'm-utilsdk/index'
import { showToast } from '../../../utils/util'
import { imgBaseUrl } from '../../../api'
import { clickEventTracking } from '../../../track/track.js'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgBaseUrl: imgBaseUrl.url,
    barCode: '', //条码
    productModel: '', //产品型号
    orgCode: '',
    productCode: '',
    result: null,
    isShowDataPicker: false,
    selectTime: '',
    common: '/mideaServices/images/icon.png',
    selectedTime: [], //勾选的产品购买时间数组
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let pages = getCurrentPages()
    let prevPage = pages[pages.length - 2]
    let route = prevPage.route
    clickEventTracking('user_page_view', '', {
      refer_page_name: route,
    })
    if (options && options.sn) {
      this.setData({
        // barCode:options.sn?options.sn:'',
        // productModel: options.productmodel ? options.productmodel : '',
        productCode: options.productCode ? options.productCode : '',
      })
    }
  },
  delData() {
    this.setData({
      selectTime: null,
      result: null,
      productModel: null,
    })
  },
  scan() {
    wx.scanCode({
      success: (res) => {
        console.log('二维码内容===', res)
        if (res.result.includes('http') && res.result.includes('?')) {
          //全链接结果
          let tsn = getUrlkey(res.result).tsn || ''
          console.log('tsn====', tsn)
          this.setData({
            barCode: tsn,
          })
        } else {
          this.setData({
            barCode: res.result,
          })
        }
        if (!this.data.barCode) {
          showToast('无法找到对应的设备')
          return
        }
        this.delData() //重置结果
        this.queryproductinfobysn(this.data.barCode)
      },
      fail: (error) => {
        console.log('scan error', error)
        showToast('扫描失败')
      },
    })
  },
  queryproductinfobysn(barCode) {
    let param = {
      body: {
        barCode: barCode,
      },
    }
    requestService.request('queryproductinfobysn', param).then((resp) => {
      console.log('二维码响应数据', resp.data.machineList)
      let machineList = resp.data.machineList
      if (!machineList) {
        showToast('查询不到机器信息')
        return
      }
      if (machineList) {
        if (machineList.length == 1) {
          this.setData({
            orgCode: machineList[0].orgCode,
            productCode: machineList[0].productCode,
            productModel: machineList[0].productModel,
          })
        } else if (machineList.length > 1) {
          wx.navigateTo({
            url: paths.serviceMachineSearch + '?machineList=' + JSON.stringify(machineList),
          })
        }
      }
    })
  },

  selectTime() {
    if (!this.data.barCode && !this.data.productModel) {
      showToast('请输入型号或扫机身条码')
      return
    }
    if (this.data.selectTime) {
      let timeArr = []
      let date = new Date()
      let years = []
      for (let i = date.getFullYear() - 20; i <= date.getFullYear(); i++) {
        years.push(i)
      }
      let arr = this.data.selectTime.split('-')
      let index = years.findIndex((item) => {
        return item == arr[0]
      })
      timeArr.push(index)
      timeArr.push(parseInt(arr[1]) - 1)
      timeArr.push(parseInt(arr[2]) - 1)
      this.setData({
        isShowDataPicker: true,
        selectedTime: timeArr,
      })
    } else {
      this.setData({
        isShowDataPicker: true,
      })
    }
  },

  //选择时间finish
  confirmTime(e) {
    // let timeArr = e.detail
    this.setData({
      selectTime: e.detail,
    })
    console.log('finish====', this.data.selectTime)
    let param = {
      body: {
        barCode: this.data.barCode,
        orgCode: this.data.orgCode ? this.data.orgCode : 'CS023',
        productCode: this.data.productCode,
        purchaseDate: this.data.selectTime,
      },
    }
    let { barCode, productModel } = this.data
    let product_code = ''
    if (barCode && productModel) {
      product_code = barCode + '/' + productModel
    } else if (barCode) {
      product_code = barCode
    } else if (productModel) {
      product_code = productModel
    }
    requestService
      .request('querywarrantydescbycodeorsn', param)
      .then((resp) => {
        console.log('resp========', resp.data)
        if (resp.data.status) {
          clickEventTracking('user_behavior_event', 'checkRequest', {
            ext_info: {
              request_result: 'success',
              product_code: product_code,
            },
          })
          this.setData({
            result: resp.data,
          })
        } else {
          clickEventTracking('user_behavior_event', 'checkRequest', {
            ext_info: {
              request_result: 'fail',
              product_code: product_code,
            },
          })
          showToast(resp.data.errorMsg || '查询不到机器信息')
        }
      })
      .catch((error) => {
        console.log('error', error.data.errorMsg)
        clickEventTracking('user_behavior_event', 'checkRequest', {
          ext_info: {
            request_result: 'fail',
            product_code: product_code,
          },
        })
        if (error.data.errorMsg) {
          //异常提示
          showToast(error.data.errorMsg || '查询不到机器信息')
        }
      })
  },

  goToSearch() {
    let keyWord = this.data.productModel ? this.data.productModel : ''

    wx.navigateTo({
      url: paths.serviceMachineSearch + '?keyWord=' + keyWord,
    })
  },

  search(e) {
    this.setData({
      barCode: e.detail.value,
    })
    if (!this.data.barCode) {
      return
    }
    this.delData() //重置结果
    this.queryproductinfobysn(this.data.barCode)
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
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
})
