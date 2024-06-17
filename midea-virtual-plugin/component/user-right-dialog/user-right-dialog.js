/*
 * @Description: 用户权益填写
 * @Author: 朱承财
 * @Date: 2022-04-13 14:51:19
 * @LastEditTime: 2022-04-28 11:02:10
 */
import { imgBaseUrl } from '../../../api'
import { myAddress } from '../../../utils/paths.js'
import { dateFormat } from 'm-utilsdk/index'
import { service } from './assets/service'
const app = getApp()
Component({
  properties: {
    show: {
      type: Boolean,
      value: false,
    },
    styelcustom: {
      type: Boolean,
      value: true,
    },
    userAddress: {
      type: Object,
      observer: function (newValue, oldValue) {
        console.log(newValue, oldValue)
      },
    },
  },
  data: {
    windowHeight: wx.getSystemInfoSync().windowHeight,
    borderRadius: 32,
    rightZindex: 10000000,
    imgBaseUrl: imgBaseUrl.url,
    // showVideoList: [], //视频
    showPhotoList: [], //图片
    code: '', //设备条码编码等
    codeRight: '',
    uploadPercent: 0,
    isNeedServeTime: true, //购买时间显示与否
    displayServiceDate: '', //时间
    common: '/mideaServices/images/icon.png',
    cardImg: '/virtual-plugin/images/card_img_change@3x.png',
    closeImg: '/virtual-plugin/images/pop_ic_close@2x.png',
    showDatePickerFlag: false, //购买时间选择
    backgroundColor: '#fff',
    isLoading: false, //点击后加载中按钮
    isInProgress: false, //禁止重复提交
    statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'] + 46,
    imgListStr: '', //多个图片都好拼接
    imgListArray: [],
  },
  options: {
    addGlobalClass: true,
  },
  lifetimes: {
    // 在组件实例进入页面节点树时执行
    attached() {
      //获取当天时间
      this.setData({
        displayServiceDate: dateFormat(new Date(), 'yyyy-MM-dd'),
      })
      //获取默认地址渲染
      this.getLoginStatus().then(() => {
        if (app.globalData.isLogon) {
          // if (!this.userAddress && app.globalData.userData && app.globalData.userData.userInfo) {
          //   this.getDefaultAddress()
          // }
        }
      })
    },
    detached() {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  //方法定义
  methods: {
    //点击关闭按钮权益信息页面
    closeUserRight() {
      this.setData({
        show: false,
      })
      this.triggerEvent('clickInformationClose')
    },
    //点击空白区域关闭权益信息页面
    maskClicked() {
      this.triggerEvent('clickInformationClose')
    },
    //获取用户输入码
    inputBlurHandler(e) {
      // let code = e.detail.value
      let code = /^([a-z]|[A-Z]|[0-9]){22}$/.test(e.detail.value)
      if (!code) {
        wx.showToast({
          title: '机身条码有误',
          icon: 'none',
          duration: 2000,
        })
        this.setData({
          codeRight: false,
        })
      } else {
        this.setData({
          codeRight: true,
          code: e.detail.value,
        })
      }
    },
    watchBlurHandler(e) {
      let code = /^\d{22}$/.test(e.detail.value)
      if (!code) {
        this.setData({
          codeRight: false,
        })
      } else {
        this.setData({
          codeRight: true,
          code: e.detail.value,
        })
      }
    },
    // 调用微信扫码
    codeScanHandler() {
      let self = this
      wx.scanCode({
        onlyFromCamera: false, //值为 false  既可以使用相机也可以使用相册，  值为true 只能使用相机
        scanType: ['barCode', 'qrCode', 'datamatrix', 'pdf417'], //分别对应 一维码  二维码  DataMatrix码  PDF417条码
        success: async (res) => {
          let code = /^([a-z]|[A-Z]|[0-9]){22}$/.test(res.result)
          if (!code) {
            wx.showToast({
              title: '机身条码有误',
              icon: 'none',
              duration: 2000,
            })
            self.setData({
              codeRight: false,
              code: res.result,
            })
          } else {
            self.setData({
              codeRight: true,
              code: res.result,
            })
          }
          //扫码成功后
          //res.result		所扫码的内容
          //res.scanType		所扫码的类型
          //res.charSet		所扫码的字符集
          //res.path			当所扫的码为当前小程序二维码时，会返回此字段，内容为二维码携带的 path
          //res.rawData		原始数据，base64编码
        },
        fail: () => {
          //扫码失败后
          wx.showToast({
            title: '扫码失败',
            icon: 'none',
            duration: 1500,
          })
        },
      })
      this.triggerEvent('clickScanCode')
    },
    //选择购买时间
    showDatePicker() {
      this.setData({
        showDatePickerFlag: true,
      })
      this.triggerEvent('clickChooseDate')
    },
    //获取选择时间
    confirmselectBtn(e) {
      let dateTime = e.detail
      this.setData({
        displayServiceDate: dateTime,
      })
    },
    // 选择服务地址
    showAddressPicker() {
      this.triggerEvent('clickChooseAddress')
      let fromwhere = 'virtualPlugin'
      wx.navigateTo({
        url: `${myAddress}?fromwhere=${fromwhere}`,
      })
    },
    // 点击图片就弹框选择
    openChoseBox() {
      this.triggerEvent('clickChoosePic')
      if (this.data.showPhotoList.length < 3) {
        // 图片
        this.choosePicHandler()
      }
      return
    },
    // 删除图片
    delPhoto(e) {
      let index = e.currentTarget.dataset.index
      let list = this.data.showPhotoList
      let imgListArray = this.data.imgListArray
      let imgListStr = ''
      list.splice(index, 1)
      imgListArray.splice(index, 1)
      if (imgListArray && imgListArray.length > 0) {
        imgListStr = imgListArray.join(',')
        console.log(imgListStr)
      }
      this.setData({
        showPhotoList: list,
        imgListArray,
        imgListStr,
      })
    },
    //  选择图片
    choosePicHandler() {
      let that = this
      let list = that.data.showPhotoList,
        len = list.length
      if (len >= 3) {
        wx.showToast({
          title: '亲，最多上传3张图片哦！',
          icon: 'none',
          duration: 2000,
        })
        return
      }
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success(res) {
          console.log(res)
          let tempFiles = res.tempFiles[0]
          let base64 = 'data:image/png;base64,' + wx.getFileSystemManager().readFileSync(res.tempFilePaths[0], 'base64')
          list.push({
            fileName: tempFiles.path,
            imgMeta: 'data:image/png;base64,',
            contentStr: wx.getFileSystemManager().readFileSync(res.tempFilePaths[0], 'base64'),
            imgUrl: base64,
            size: tempFiles.size,
          })
          that.setData({
            showPhotoList: list,
          })
          let newItem = {
            fileName: tempFiles.path,
            imgMeta: 'data:image/png;base64,',
            contentStr: wx.getFileSystemManager().readFileSync(res.tempFilePaths[0], 'base64'),
            imgUrl: base64,
            size: tempFiles.size,
          }
          that.commitImgToMscp(res, newItem)
        },
      })
    },
    // 获取用户默认地址 2.26去掉地址选择
    getDefaultAddress() {
      service
        .getDefaultAddress()
        .then((res) => {
          if (res) {
            this.setData({
              userAddress: res,
            })
          } else {
            this.setData({
              userAddress: '',
            })
          }
        })
        .catch(() => {
          this.setData({
            userAddress: '',
          })
        })
    },
    //获取
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
    // 准备提交信息 v2.26去掉地址选择
    checkDataCommit() {
      if (!this.data.displayServiceDate || !this.data.code || this.data.showPhotoList.length < 1) return
      if (this.data.isInProgress) return
      this.setData({
        isInProgress: true,
      })
      let that = this
      setTimeout(() => {
        that.setData({
          isInProgress: false,
        })
      }, 1000)
      let params = {
        code: this.data.code,
        buyTime: this.data.displayServiceDate,
        photoList: this.data.showPhotoList,
        userAddress: this.data.userAddress,
        imgListStr: this.data.imgListStr,
      }
      this.triggerEvent('clickSumbitInformation', params)
    },
    // 上传图片
    commitImgToMscp(resData, list) {
      let that = this
      console.log(resData, list)
      let data = {
        baseStr: list.imgUrl, //图片的 base64 编码
        file: list.contentStr, //上传文件
        url: list.fileName, //上传图片路径
      }
      service
        .commitImgToMscp(data)
        .then((res) => {
          if (res) {
            let imgListArray = that.data.imgListArray
            let imgListStr = ''
            imgListArray.push(res)
            if (imgListArray && imgListArray.length > 0) {
              imgListStr = imgListArray.join(',')
              console.log(imgListStr)
            }
            that.setData({
              imgListArray,
              imgListStr,
            })
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
  },
})
