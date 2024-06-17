// let UPLOAD_TASK = null // 保存上传任务对象
// let videoSerInfoList = [] // 视频上传后的信息 Array<Object>, Object[etag, fileName, fileUrl, fileSize, fileType]
const serviceType_def = {
  DROPIN: 10, //上门
  SEND_REPAIR: 11, //送修
  PULL_REPAIR: 12, //拉修
  POST_REPAIR: 13, //寄修
  PATROL_REPAIR: 14, //巡修
  CLEAN_PULL_REPAIR: 15, //拉修+清洗
  PAY_SERVICE: 16, //付费上门
}
const needServiceType = [
  serviceType_def.DROPIN,
  serviceType_def.PULL_REPAIR,
  serviceType_def.CLEAN_PULL_REPAIR,
  serviceType_def.PAY_SERVICE,
]

const app = getApp()

import { service } from '../../assets/js/http'
import { imgBaseUrl } from '../../../api'
import computedBehavior from '../../../utils/miniprogram-computed.js'
import {
  maintenanceFaultList,
  mobileValidation,
  productSelect,
  serviceChargeTypes,
  myAddress,
} from '../../../utils/paths.js'
import { clickEventTracking } from '../../../track/track.js'
import { isEmptyObject } from 'm-utilsdk/index'
import { login } from '../../../utils/paths'
import { requestService } from '../../../utils/requestService'
import requestCss from '../../../utils/requestCss.js'
Page({
  behaviors: [computedBehavior],
  data: {
    imgBaseUrl: imgBaseUrl.url,
    showCalendarPickerFlag: false, //时间选择
    calendarConf: {
      confirmText: '确定',
      cancelText: '取消',
      cannotServiceTimeObj: {},
    },
    userAddress: null, //地址服务
    selectedProduct: [], //所选产品列表
    placeStatu: '', // 使用场所选择
    placePicker: false, //使用场所显示
    isIncludeU99: false, //是不是有U99产品
    displayServiceDate: '', //时间
    order: {
      customerName: '', //报单人姓名
      customerMobilephone1: '', //报单人手机号1
      areaNum: '', //报单人所在地区号
      customerAddress: '', //报单人所在地址
      areaCode: '', //报单人所在区域编码
      areaName: '', //报单人所在区域名称
      servCustomerName: '', //现场服务用户姓名
      servCustomerMobilephone1: '', //现场服务用户手机号1
      servAreaNum: '', //现场服务用户所在地区号
      servCustomerAddress: '', //现场服务用户所在地址
      servAreaCode: '', //现场服务用户所在区域编码
      servAreaName: '', //现场服务用户所在区域名称
      orderOrigin: '', //38
      interfaceSource: '', //MJAPP
      requireServiceDate: '', //用户要求服务时间
      webUserCode: '', //APP用户UUID
      webUserPhone: '', //APP用户注册手机号
      pubRemark: '', //备注
      serviceUserDemandVOs: [
        {
          serviceMainTypeCode: '', //业务类型如安装值为10，从选择服务请求项目中带过来
          serviceMainTypeName: '', //业务类型如安装值为10，从选择服务请求项目中带过来
          serviceSubTypeCode: '', //业务类型如安装值1010，从选择服务请求项目中带过来
          serviceSubTypeName: '', //业务类型如安装，从选择服务请求项目中带过来
          contactOrderSerItemCode: '', //用户报单请求项目，如需要安装值为BZ01001
          contactOrderSerItemName: '', //用户报单请求项目，如需要安装
          prodBrand: '', //产品品牌
          brandName: '', //产品品牌名称
          prodCode: '', //产品品类
          prodName: '', //产品品类名称
          productAmount: '', //默认填1
          serviceDesc: '', //服务描述
        },
      ],
      productUse: '', //中央空调家用、商用标志
    },
    fault: '', //故障类型
    showVideoList: [], //视频
    showPhotoList: [], //t图片
    isEnter: false,
    userInfo: app.globalData.userData && app.globalData.userData.userInfo,
    phoneNumber: app.globalData.userData && app.globalData.userData.userInfo.mobile,
    excludedFault: [], //假性故障  可能原因
    showFlFaultFlag: false, //可能原因弹框
    // flFault: [1, 1, 1, 1, 1, 1], //可能故障
    isLoading: false, //点击后加载中按钮
    isInProgress: false, //禁止重复提交
    isRenew: false, //重新下单

    applianceSN: '', //一键报修
    oneStepMsgCode: '', //一键报修
    oneStepTips: '', //一键报修
    applianceId: '', //一键报修
    machineErrorTime: '', //一键报修

    iotFlag: 'N', //一键报修
    selectedFault: app.globalData.maintenanceItem || '', //选择的故障item
    submitBurialPoint: 'sevice_repair',
    curCount: 0,
    uploadFileInfo: null, //视频的信息
    isNeedServeTime: true, //服务时间显示与否  //备注是否是小家电,如果是小家电，则不显示服务时间
    uploadPercent: 0,
    choseImgVideoPicker: false, //选择图片还是视频
    barCode: '',
    code: '', //设备条码编码等

    isDialogs: false,
    topTitle: '服务单无法提交', //顶部标题
    secondTitle: '您今天提交的服务单数量过多，暂时无法提交新单，请明天再试或联系在线客服。', //二级标题
    btnText: '我知道了', //按钮的内容
    isCenters: false,
    // oneTitle:'',
    twoTitle: '您近期已连续多次提交服务单，需先验证身份。',
    cancleTxet: '取消',
    sureText: '验证',
    addrItem: '',
    longToastContent: '',
    isLongToast: false,
    disabled: false,
    common: '/mideaServices/images/icon.png',
    isLogin: false, //是否已经登录
    toSelectProductOptions: {
      selectedBrandCode: '',
      selectedList: [],
      selectedProdCode: '',
      currentIndex: 0,
    }, //其他页面带参数进入维修页面，维修页面选择维修产品，进入到选择产品页，需要显示勾选对应的产品信息
  },
  computed: {
    selectedProductNames() {
      let { selectedProduct } = this.data
      let result
      if (selectedProduct && selectedProduct.length > 0) {
        const temp = selectedProduct.map((item) => {
          return item.prodName
        })
        result = temp.join('、')
      } else {
        result = ''
      }
      return result
    },
    // 判断所有必填项是否填写
    isDataReady() {
      let result = true
      //  安装产品校验
      if (!(this.data.selectedProduct && this.data.selectedProduct.length > 0)) {
        result = false
      }
      // 使用场所校验
      if (this.data.isIncludeU99 && !this.data.placeStatu) {
        result = false
      }
      //故障类型
      if (result && !app.globalData.maintenanceItem) {
        result = false
      }
      // 期望时间校验
      if (!this.data.displayServiceDate && this.data.isNeedServeTime) {
        result = false
      }
      // 服务地址校验
      if (!this.data.userAddress) {
        result = false
      }
      return result
    },
    // 重新下单
    // isRenew() {
    //     if (this.data.isRenew) {
    //         //重新下单
    //         let currentOrder = app.globalData.currentOrder;
    //         if (currentOrder.result == 'success') {
    //             this.renewOrder(JSON.parse(currentOrder.data))
    //         }
    //     }
    // },
    // 判断视频有没有上传后端接口
    hasUploadVideo() {
      let result = false
      if (this.data.showVideoList.length > 0) {
        result = true
      } else {
        result = false
      }
      return result
    },
    // barCodes(){
    //     console.log('你为啥不敢执行')
    //     console.log(this.data.barCode)
    //     if(!this.data.barCode)return;
    //     console.log('扫码')
    //     this.EnterbarCode();
    // }
  },
  onLoad: function (options) {
        console.log('维修服务options', options)
    //中控屏扫码进入维修页面，携带解密sn参数
    if (options.sn) {
      this.dealProductInfo(options.sn)
    }
    //设备服务组件进入维修页面，携带prodCode, brand, userTypeCode参数
    if (options.prodCode) {
      let { prodCode, brand, userTypeCode } = options
      let productInfo = {
        prodCode: prodCode,
        brand: brand,
        userTypeCode: userTypeCode,
      }
      this.getProductInfo(productInfo)
    }
    if (options.faultCode) {
      this.setData({
        memoValue: options.faultCode,
        curCount: options.faultCode.length,
      })
    }
    // app.globalData.selectedProductList = []
    app.globalData.maintenanceItem = {}
    app.globalData.maintenanceItemIndex = null
    let pages = getCurrentPages()
    if (pages.length != 1) {
      let prevPage = pages[pages.length - 2]
      let route = prevPage.route
      clickEventTracking('user_page_view', '', {
        refer_page_name: route,
      })
    }
    if (options.isRenew) {
      app.globalData.selectedProductList = []
      this.setData({
        isRenew: options.isRenew, //从进度查询过来的 需要重新下单
      })
      // 重新下单
      if (app.globalData.currentOrder) {
        let resp = app.globalData.currentOrder
        if (resp.result == 'success') {
          this.renewOrder(JSON.parse(resp.data))
          // 型号或扫描机身条码
          let order = JSON.parse(resp.data)
          this.data.code = order.serviceUserDemandVOs[0].productModel ? order.serviceUserDemandVOs[0].productModel : ''
          this.setData({
            code: this.data.code,
          })
        }
      }
    } else {
      this.data.applianceSN = options.applianceSN || ''
      this.data.oneStepMsgCode = options.msgCode || ''
      this.data.oneStepTips = options.tips || ''
      this.data.applianceId = options.applianceId || ''
      this.data.machineErrorTime = options.machineErrorTime || ''

      let pluginSN = options.pluginSN || ''
      let brandCode = options.brandCode || ''
      let brandName = options.brandName || ''
      let prodCode = options.prodCode || ''
      let prodName = options.prodName || ''
      let productModel = options.productModel || ''

      let faultCode = options.faultCode || ''
      let faultDesc = options.faultDesc || ''
      // 来自故障自查
      if (options.faultItemInfo) {
        let addrData = JSON.parse(decodeURIComponent(options.faultItemInfo))
        console.log(addrData)
        this.data.code = addrData.code || ''
        this.data.iotFlag = 'N'
        console.log(app.globalData.selectedProductList)
        let listItem = app.globalData.selectedProductList
        let dataItem = listItem[0]
        console.log(dataItem)

        // let productBrand = addrData.brand || ''
        // let productTypeId = addrData.productTypeId || ''
        // let productType = addrData.productType || ''

        if (app.globalData.selectedProductList.length > 0) {
          if (dataItem) {
            this.data.selectedProduct.push({
              brandCode: dataItem.brandCode, //产品品牌
              brand: dataItem.brand, //产品品牌名称
              prodCode: dataItem.prodCode, //产品品类
              prodName: dataItem.prodName, //产品品类名称
              userTypeCode: dataItem.userTypeCode ? 'U99' : '',
            })
            //故障类型
            app.globalData.maintenanceItem = {
              orgCode: addrData.dataItem,
              serviceRequireItemCode: addrData.serviceRequireItemCode,
              serviceRequireItemName: addrData.serviceRequireItemName,
              serviceMainTypeCode: '11',
              serviceMainTypeName: '维修',
              serviceSubTypeCode: '1111',
              serviceSubTypeName: '维修',
            }
            console.log(app.globalData.maintenanceItem)
            console.log('app.globalData.maintenanceItem')
          }
        }
      } else if (this.data.applianceSN) {
        //个人中心一键报修
        this.data.submitBurialPoint = 'messegecenter_repair'
        this.data.iotFlag = 'Y'
        let selectedFault = {
          serviceRequireItemCode: 'BX01016',
          serviceRequireItemName: '其它（请说明）',
          serviceMainTypeCode: '11',
          serviceMainTypeName: '维修',
          serviceSubTypeCode: '1111',
          serviceSubTypeName: '维修',
        }
        this.oneStepClaim(this.data.applianceSN, selectedFault)
        this.data.code = this.data.applianceSN // 6.1 增加预填
      } else if (pluginSN) {
        //URL:customer-service/maintenance.js?pluginSN=000000311222Z12658910038005Y0000&faultCode=BX01001&faultDesc=不制冷/制冷效果差
        //设备插件一键报修 - SN(家庭所有者才可以查询到品类)
        this.data.submitBurialPoint = 'messegecenter_plugin_repair'
        this.data.iotFlag = 'Y'
        if (!this.data.oneStepTips) this.data.iotFlag = 'N'
        //故障类型
        // let selectedFault
        // if (faultCode && faultDesc) {
        //   selectedFault = {
        //     serviceRequireItemCode: faultCode,
        //     serviceRequireItemName: faultDesc,
        //     serviceMainTypeCode: '11',
        //     serviceMainTypeName: '维修',
        //     serviceSubTypeCode: '1111',
        //     serviceSubTypeName: '维修',
        //   }
        // }
        // 2021.12.27非智能插件页跳过来维修 一键报修
        let selectedProduct = []
        selectedProduct.push({
          brandCode: brandCode, // 产品品牌
          brand: brandName, // 产品品牌名称
          prodCode: prodCode, // 产品品类
          prodName: prodName, // 产品品类名称
        })
        app.globalData.selectedProductList = selectedProduct
        this.setData({
          code: productModel,
        })

        // this.oneStepClaim(pluginSN, selectedFault)
      } else if (brandCode) {
        //URL:customer-service/maintenance.js?brandCode=MIDEA&productBrand=美的&productTypeId=1000&productType=家用空调&faultCode=BX01001&faultDesc=不制冷/制冷效果差
        //设备插件一键报修 - 自定义
        this.data.code = options.code || '' // 6.3.1-插件跳报修，如果是唯一型号则赋值，如果是多型号用户自填
        this.data.submitBurialPoint = 'messegecenter_plugin_repair'
        this.data.iotFlag = 'N'

        let productBrand = options.productBrand || ''
        let productTypeId = options.productTypeId || ''
        let productType = options.productType || ''
        if (brandCode && productBrand && productTypeId && productType) {
          this.data.selectedProduct.push({
            brandCode: brandCode, //产品品牌
            brand: productBrand, //产品品牌名称
            prodCode: productTypeId, //产品品类
            prodName: productType, //产品品类名称
          })
        }
        //故障类型
        if (faultCode && faultDesc) {
          this.data.selectedFault = {
            serviceRequireItemCode: faultCode,
            serviceRequireItemName: faultDesc,
            serviceMainTypeCode: '11',
            serviceMainTypeName: '维修',
            serviceSubTypeCode: '1111',
            serviceSubTypeName: '维修',
          }
        }
      } else {
        app.globalData.selectedProductList = []
      }
    }
  },
  // 下一步
  oneStepClaim(applianceSN, selectedFault) {
    let param = {
      serialNo: applianceSN,
    }
    service
      .getProductBySerialNoNew(param)
      .then((resp) => {
        //通过SN获取设备信息
        let productList = resp.data.products || []
        let modelList = resp.data.productModels || []
        this.data.code = modelList.length && modelList.length === 1 ? modelList[0] : ''
        if (productList.length && productList.length === 1) {
          let product = productList[0]
          this.data.selectedProduct.push({
            brandCode: product.brandCode, // 产品品牌
            brand: product.brandName, // 产品品牌名称
            prodCode: product.prodCode, // 产品品类
            prodName: product.prodName, // 产品品类名称
          })
        }
      })
      .catch((error) => {
        wx.showToast({
          title: error,
        })
      })

    //故障类型
    if (selectedFault) {
      this.data.selectedFault = selectedFault
    }
  },
  // 点击可能原因出来弹框
  showFlFault() {
    this.setData({
      showFlFaultFlag: true,
      disabled: true,
    })
  },
  getTextarea() {
    console.log('我被点了')
    this.setData({
      disabled: false,
    })
  },
  // 文本框里面的内容value
  inputBindHandler(e) {
    let value = e.detail.value,
      curCount = value.length > 120 ? '120' : value.length
    this.data.order.serviceUserDemandVOs[0].serviceDesc = value
    this.setData({
      memoValue: value,
      curCount,
    })
  },
  // 获取故障可能的原因
  getexcludedfaultlist() {
    let params = {
      body: {
        interfaceSource: 'SMART',
        operator: app.globalData.userData.userInfo.mobile || 'operator',
        operatorUnit: 'operatorUnit',
        orgCode: app.globalData.maintenanceItem.orgCode,
        depth: '3',
        serviceRequireItemCode: app.globalData.maintenanceItem.serviceRequireItemCode,
        brandCode: this.data.selectedProduct.length > 0 ? this.data.selectedProduct[0].brandCode : '',
        prodCode: this.data.selectedProduct.length > 0 ? this.data.selectedProduct[0].prodCode : '',
        parentServiceRequireCode: 'BX',
        plugin_version: '7.6.0.1_2021052600',
        tm: Math.round(new Date().getTime() / 1000), //时间戳
      },
    }
    params = JSON.stringify(params)
    service
      .getexcludedfaultlist(params)
      .then((res) => {
        if (res) {
          let excludedFault = res.excludedFaultVOList.map((item) => {
            return Object.assign(
              {
                helpfulChecked: '',
              },
              item
            )
          })
          this.setData({
            excludedFault,
          })
        }
      })
      .catch(() => {})
  },
  // 组件传回的点击每个页面的帮助
  clickDauflt(e) {
    // let fault = e.detail.fault
    let index = e.detail.index
    let stasus = e.detail.stasus
    wx.showLoading({
      title: '加载中',
    })
    let param = {
      body: {
        orgCode: app.globalData.maintenanceItem.orgCode,
        serviceRequireItemCode: app.globalData.maintenanceItem.serviceRequireItemCode,
        serviceRequireItemName: app.globalData.maintenanceItem.serviceRequireItemName,
        excludedFaultId: this.data.excludedFault[index].excludedFaultId,
        excludedFaultCode: this.data.excludedFault[index].excludedFaultCode,
        excludedFaultName: this.data.excludedFault[index].excludedFaultName,
        prodCode: this.data.selectedProduct[0].prodCode,
        isHelpful: stasus,
        prodName: this.data.selectedProduct[0].prodName,
      },
    }
    service
      .hasHelpOrNot(param)
      .then(() => {
        wx.hideLoading({
          success: () => {},
        })
        this.data.excludedFault[index].isFeedBack = true
        this.data.excludedFault[index].stasus = stasus
        this.setData({
          excludedFault: this.data.excludedFault,
        })
      })
      .catch(() => {
        // wx.showToast({
        //     title: error.errorMsg,
        // })
      })
  },
  // 去收费标准页面
  goToServiceCharge() {
    clickEventTracking('user_behavior_event', 'clickCharges')
    let { selectedProduct } = this.data
    if (selectedProduct && selectedProduct.length > 0) {
      wx.navigateTo({
        url: `${serviceChargeTypes}`,
      })
    } else {
      let installation = 'serviceChargeTypes' //跳转来自安装页面
      wx.navigateTo({
        url: `${productSelect}?fromPage=${installation}`,
      })
    }
  },

  // 验证手机号码
  toMobile() {
    wx.navigateTo({
      url: `${mobileValidation}`,
    })
  },

  // 显示选择时间
  showCalendarPicker() {
    this.setData({
      showCalendarPickerFlag: true,
    })
  },

  // 点击图片就弹框选择
  openChoseBox() {
    if (this.data.showPhotoList.length < 3) {
      // 图片
      this.choosePicHandler()
    }
    return
    // if (this.data.showVideoList.length == 0 && this.data.showPhotoList.length < 3) {
    //   // 图片跟视频
    //   this.setData({
    //     choseImgVideoPicker: true,
    //   })
    // } else if (this.data.showVideoList.length > 0 && this.data.showPhotoList.length < 3) {
    //   // 图片
    //   this.choosePicHandler()
    // } else if (this.data.showVideoList.length > 0 && this.data.showPhotoList.length >= 3) {
    //   //  都不行
    //   wx.showToast({
    //     title: '最多上传3张图片与1个视频',
    //     icon: 'none',
    //     duration: 2000,
    //   })
    // } else if (this.data.showVideoList.length == 0 && this.data.showPhotoList.length >= 3) {
    //   //  只能视频
    //   this.uploadVideoHandler()
    // }
  },
  // 选中的结果
  clickPhoto(e) {
    if (e.detail.value == '11') {
      // 图片
      this.choosePicHandler()
    } else {
      // 视频
      this.uploadVideoHandler()
    }
  },
  // 上传视频
  uploadVideoHandler() {
    return new Promise((reslove) => {
      if (this.data.uploadFileInfo || !this.data.hasUploadVideo) {
        reslove()
      } else {
        console.log('准备上传视频')
        let that = this
        wx.chooseVideo({
          sourceType: ['album', 'camera'], // album 从相册选视频，camera 使用相机拍摄
          maxDuration: 60, // 拍摄视频最长拍摄时间，单位秒。最长支持60秒
          camera: 'back', //默认拉起的是前置或者后置摄像头，默认back
          compressed: true, //是否压缩所选择的视频文件
          success: function (res) {
            console.log(res)
            let tempFilePath = res.tempFilePath //选择定视频的临时文件路径（本地路径）
            let duration = res.duration //选定视频的时间长度
            let size = parseFloat(res.size / 1024 / 1024).toFixed(1) //选定视频的数据量大小
            let height = res.height //返回选定视频的高度
            let width = res.width //返回选中视频的宽度
            that.data.duration = duration
            console.log(tempFilePath, size, duration, height, width)
            if (parseFloat(size) > 40) {
              wx.showToast({
                title: '上传的视频大小超限，超出40MB,请重新上传',
                //image: '',//自定义图标的本地路径，image的优先级高于icon
                icon: 'none',
              })
            } else {
              console.log('视频上传')

              //2.本地视频资源上传到服务器
              wx.showLoading({
                title: '处理中',
                mask: true,
              })
              that
                .uploadFile(tempFilePath)
                .then(() => {})
                .catch((error) => {
                  console.log(error)
                })
            }
          },
          fail: function () {
            // fail
          },
          complete: function () {
            // complete
          },
        })
        return
      }
    })
  },
  // 本地视频资源上传到服务器
  uploadFile(tempFilePath) {
    return new Promise(() => {
      let params = {
        // sign:"5684bd55ab2beea85f6454124e188567",
        // appKey:"b28dd8e7463645e1beb453dafb6d9d7a",
        // timestamp:Math.round(new Date().getTime())
      }
      // "1623845596000"
      console.log(params)
      console.log(tempFilePath)
      return
      // service
      //   .uploadFile(param)
      //   .then((res) => {
      //     console.log(res)
      //   })
      //   .catch((error) => {
      //     console.log(error)
      //   })
    })
  },

  // 图片预览
  // previewPicHandler(e){
  //   console.log(e.currentTarget.dataset)
  //   let index = e.currentTarget.dataset.index;
  //   let list = this.data.showPhotoList;
  //   console.log(index,list)

  // },

  // 删除图片
  delPhoto(e) {
    let index = e.currentTarget.dataset.index
    let list = this.data.showPhotoList
    list.splice(index, 1)
    this.setData({
      showPhotoList: list,
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
      // count: 3 - len > 0 ? 3 - len : 0,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // const tempFilePaths = res.tempFilePaths
        // console.log(tempFilePaths)
        // console.log(res)
        let tempFiles = res.tempFiles[0]
        //   调用接口上传图片
        let base64 = 'data:image/png;base64,' + wx.getFileSystemManager().readFileSync(res.tempFilePaths[0], 'base64')
        // console.log(base64)
        list.push({
          fileName: tempFiles.path,
          imgMeta: 'data:image/png;base64,',
          contentStr: wx.getFileSystemManager().readFileSync(res.tempFilePaths[0], 'base64'),
          imgUrl: base64,
          size: tempFiles.size,
        })
        // console.log(list)
        that.setData({
          showPhotoList: list,
        })
      },
    })
  },

  // 调用微信扫码
  codeScanHandler() {
    let self = this
    wx.scanCode({
      onlyFromCamera: false, //值为 false  既可以使用相机也可以使用相册，  值为true 只能使用相机
      scanType: ['barCode', 'qrCode', 'datamatrix', 'pdf417'], //分别对应 一维码  二维码  DataMatrix码  PDF417条码
      success: async (res) => {
        //扫码成功后
        console.log(res)
        // console.log(res)
        //res.result		所扫码的内容
        //res.scanType		所扫码的类型
        //res.charSet		所扫码的字符集
        //res.path			当所扫的码为当前小程序二维码时，会返回此字段，内容为二维码携带的 path
        //res.rawData		原始数据，base64编码

        let barCode = service.convertScanResult(res.result).code
        console.log(barCode)
        if (!barCode) {
          // wx.hideLoading();
          wx.showToast({
            title: '无法找到对应的设备',
            icon: 'none',
            duration: 2000,
          })
          return
        } else {
          self.setData({
            barCode: barCode,
          })
          wx.showLoading({
            title: '解析中...',
            icon: 'none',
            mask: true,
          })
          this.EnterbarCode()
        }
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
  },
  // 扫码完成出发
  EnterbarCode() {
    console.log('我为什么不执行')
    let that = this
    if (that.data.barCode) {
      let param = {
        body: {
          barCode: that.data.barCode,
        },
      }
      // param = JSON.stringify(param)
      service
        .barcodeAnalysis(param)
        .then((res) => {
          wx.hideLoading()
          if (res) {
            let machineList = res.machineList
            if (machineList) {
              if (machineList.length == 1) {
                that.setData({
                  code: machineList[0].productModel,
                })
              } else if (machineList.length > 1) {
                app.globalData.machineList = machineList
                // 据说没有多的，但是app有这个页面
                that.setData({
                  code: machineList[0].productModel,
                })
                // nativeService.setItem(this.SERVICE_STORAGE_KEYS.machineList, JSON.stringify(machineList), () => {
                //   this.goTo('serviceMachineList', {}, { from: 'maintenance' })
                // })
                // 去机器列表
              }
            } else {
              this.setData({
                code: '',
              })
              wx.showToast({
                title: '无法找到对应的设备',
                icon: 'none',
                duration: 2000,
              })
            }
          }
        })
        .catch((error) => {
          console.log(error)
          wx.hideLoading()
          this.setData({
            code: '',
          })
          wx.showToast({
            title: '无法找到对应的设备',
            icon: 'none',
            duration: 2000,
          })
        })
    }
  },
  //  服务地址
  showAddressPicker() {
    let fromwhere = 'maintenance'
    wx.navigateTo({
      url: `${myAddress}?fromwhere=${fromwhere}`,
    })
  },
  // 故障类型
  showPopupPicker() {
    if (this.data.selectedProduct && this.data.selectedProduct.length > 0) {
      let selectedProductObj = JSON.stringify({
        brandCode: this.data.selectedProduct[0].brandCode,
        prodCode: this.data.selectedProduct[0].prodCode,
      })
      wx.navigateTo({
        url: `${maintenanceFaultList}?selectedProductObj=${selectedProductObj}`,
      })
    } else {
      wx.showToast({
        title: '请先选择‘维修产品’',
        icon: 'none',
      })
    }
  },
  // 去选择产品
  showBrandPicker() {
    let installation = 'maintenance' //跳转来自安装页面
    app.globalData.maintenanceItem = ''
    let { selectedBrandCode, selectedList, selectedProdCode, currentIndex } = this.data.toSelectProductOptions
    //其他页面带参数进入维修页面，维修页面选择维修产品，进入到选择产品页，需要显示勾选对应的产品信息
    if (selectedList.length) {
      wx.navigateTo({
        url: `${productSelect}?fromPage=${installation}&selectedBrandCode=${selectedBrandCode}&selectedProdCode=${selectedProdCode}&currentIndex=${currentIndex}&selectedList=${JSON.stringify(
          selectedList
        )}`,
      })
    } else {
      wx.navigateTo({
        url: `${productSelect}?fromPage=${installation}`,
      })
    }
    this.setData({
      fault: '',
      excludedFault: [],
    })
  },
  // 点开使用场所
  openPlace() {
    this.setData({
      placePicker: true,
    })
  },
  // 使用场所选择
  getPlace(e) {
    this.data.order.productUse = e.detail.value //给order里面的productUse赋值
    this.setData({
      placeStatu: e.detail,
    })
  },
  // 确定按钮传参
  selectDate(e) {
    let longStrobj = e.detail
    this.data.requireServiceDate = longStrobj.date + ' ' + longStrobj.serviceTime
    this.setData({
      displayServiceDate: longStrobj.newData + ' ' + longStrobj.serviceTime,
    })
  },
  // 校验所选中的产品有没有prodCode: "U99"  例如：克莱尔 中央空调U99
  checkIsIncludeU99() {
    let result = false,
      selectedProduct = this.data.selectedProduct
    if (selectedProduct && selectedProduct.length > 0) {
      const temp = selectedProduct.filter((item) => {
        return item.userTypeCode == 'U99'
      })
      result = temp.length > 0 ? true : false
      this.setData({
        isIncludeU99: result,
      })
    }
    return result
  },
  //重新下单
  renewOrder(order) {
    console.log('到了这里了')
    console.log(order)
    let serviceUserDemandVO = order.serviceUserDemandVOs[0]
    //维修产品
    this.data.selectedProduct.push({
      brandCode: serviceUserDemandVO.brandCode || serviceUserDemandVO.prodBrand, //产品品牌
      brand: serviceUserDemandVO.brandName, //产品品牌名称
      prodCode: serviceUserDemandVO.prodCode, //产品品类
      prodName: serviceUserDemandVO.prodName, //产品品类名称
      userTypeCode: serviceUserDemandVO.productUse ? 'U99' : '',
    })
    app.globalData.selectedProductList = this.data.selectedProduct
    //故障类型
    app.globalData.maintenanceItem = {
      orgCode: order.orgCode,
      serviceRequireItemCode:
        serviceUserDemandVO.contactOrderSerItemCode || serviceUserDemandVO.contactOrderSerItem2Code,
      serviceRequireItemName:
        serviceUserDemandVO.contactOrderSerItemName || serviceUserDemandVO.contactOrderSerItem2Name,
    }
    this.getexcludedfaultlist()

    //服务地址
    let customerAddressArray = order.customerAddress.split(' ')
    this.data.userAddress = {
      receiverName: order.servCustomerName,
      receiverMobile: order.servCustomerMobilephone1,
      province: '',
      provinceName: customerAddressArray[0] || '',
      city: '',
      cityName: customerAddressArray[1] || '',
      county: '',
      countyName: customerAddressArray[2] || '',
      street: order.areaCode,
      streetName: customerAddressArray[3] || '',
      addr: customerAddressArray[4] || '',
    }

    this.data.order.serviceUserDemandVOs[0].serviceDesc = serviceUserDemandVO.serviceDesc || ''
    this.setData({
      order: this.data.order,
      userAddress: this.data.userAddress,
      // memoValue: serviceUserDemandVO.serviceDesc || '',
      // curCount: serviceUserDemandVO.serviceDesc.length
    })
  },
  //   准备提交下单
  checkData() {
    console.log('点不动')
    if (!this.data.isDataReady) return
    if (this.data.isInProgress) return
    this.data.isInProgress = true
    // this.setData({
    //     isLoading: true
    // })
    this.canTcommit()
    clickEventTracking('user_behavior_event', 'clickSubmit', {
      ext_info: {
        brand: this.data.selectedProduct[0].brand,
        apptype_name: this.data.selectedProduct[0].prodName,
        fault_type: this.data.fault,
      },
    })
  },
  canTcommit() {
    console.log('点不动')
    // 需要判断视频跟图片是否有没上传完成的
    // this.uploadVideoHandler().then(() => {
    //     this.createserviceorder(this.data.uploadFileInfo);
    // }).catch(error => {
    //     wx.hideLoading();
    //     this.data.isInProgress = false
    // })
    this.data.isInProgress = false
    this.createserviceorder()
  },
  // 创建服务表单
  createserviceorder(videoItem) {
    wx.showLoading({
      title: '处理中',
      mask: true,
    })
    console.log(videoItem)
    // this.data.photoData=[...showVideoList,...showPhotoList];
    // let fileVOs = [].concat(this.data.photoData);
    // let ossFileList = [];

    // 传入的视频如果有值
    // if (videoItem) {
    //     ossFileList.push(videoItem);
    // }
    //将视频信息拿出来
    // if (this.data.hasUploadVideo) {
    //     let index = this.data.photoData.findIndex(ele => {
    //         return ele.videoPath
    //     })
    //     fileVOs.splice(index, 1);
    // }
    // return new Promise((reslove, reject) => {
    let param = {
      serviceOrderVO: {
        interfaceSource: 'SMART',
        webUserPhone: app.globalData.userData.userInfo.mobile,

        customerName: app.globalData.userData.userInfo.nickName, //报单人姓名
        customerMobilephone1: app.globalData.userData.userInfo.mobile, //报单人手机号1
        customerAddress:
          this.data.userAddress.provinceName +
          ' ' +
          this.data.userAddress.cityName +
          ' ' +
          this.data.userAddress.countyName +
          ' ' +
          this.data.userAddress.streetName +
          ' ' +
          this.data.userAddress.addr, //报单人所在地址
        areaCode: this.data.userAddress.street, //报单人所在区域编码
        areaName: this.data.userAddress.streetName, //报单人所在区域名称

        servCustomerName: this.data.userAddress.receiverName, //现场服务用户姓名
        servCustomerMobilephone1: this.data.userAddress.receiverMobile, //现场服务用户手机号1
        servCustomerMobilephone2: '', //现场服务用户手机号2
        servCustomerAddress:
          this.data.userAddress.provinceName +
          ' ' +
          this.data.userAddress.cityName +
          ' ' +
          this.data.userAddress.countyName +
          ' ' +
          this.data.userAddress.streetName +
          ' ' +
          this.data.userAddress.addr, //现场服务用户所在地址
        servAreaCode: this.data.userAddress.street, //现场服务用户所在区域编码
        servAreaName: this.data.userAddress.streetName, //现场服务用户所在区域名称

        orderOrigin: '38', //美的美居APP则入参为38
        requireServiceDate: '',
        requireUnitCode: '',
        pubRemark: this.data.submitBurialPoint, //备注, 5.3需求此字段存放大数据报修来源
        iotFlag: this.data.iotFlag, //是否是一键报修
      },
      fileVOs: this.data.showPhotoList, //图片列表
      ossFileList: this.data.showVideoList, //视频列表信息
      // fileVOs: fileVOs, //图片列表
      // ossFileList: ossFileList //视频列表信息
    }
    // 如果有服务时间的话
    if (this.data.isNeedServeTime) {
      param.serviceOrderVO.requireServiceDate = this.data.requireServiceDate
    }

    //用户诉求从表
    const product = this.data.selectedProduct[0]

    //用户诉求从表
    let serviceDesc =
      this.data.order.serviceUserDemandVOs[0].serviceDesc +
      (this.data.oneStepTips ? ';' + this.data.oneStepTips : '') +
      (this.data.oneStepMsgCode ? '- 故障代码：' + this.data.oneStepMsgCode : '') //服务描述

    let serviceUserDemandVOs = [
      {
        serviceMainTypeCode: app.globalData.maintenanceItem.serviceMainTypeCode, //业务类型如安装值为10，从选择服务请求项目中带过来
        serviceMainTypeName: app.globalData.maintenanceItem.serviceMainTypeName, //业务类型如安装值为10，从选择服务请求项目中带过来
        serviceSubTypeCode: app.globalData.maintenanceItem.serviceSubTypeCode, //业务类型如安装值1010，从选择服务请求项目中带过来
        serviceSubTypeName: app.globalData.maintenanceItem.serviceSubTypeName, //业务类型如安装，从选择服务请求项目中带过来
        contactOrderSerItemCode: app.globalData.maintenanceItem.serviceRequireItemCode, //用户报单请求项目，如需要安装值为BZ01001
        contactOrderSerItemName: app.globalData.maintenanceItem.serviceRequireItemName, //用户报单请求项目，如需要安装

        prodBrand: product.brandCode, //产品品牌
        brandName: product.brand, //产品品牌名称
        prodCode: product.prodCode, //产品品类
        prodName: product.prodName, //产品品类名称
        productAmount: 1, //默认填1
        serviceDesc: serviceDesc, //服务描述

        productUse: product.userTypeCode == 'U99' ? this.data.order.productUse : '',
        productCode: this.data.code,
        productModel: this.data.code,
        appliactionId: this.data.applianceId,
        productSn1: this.data.applianceSN,
        machineErrorDisplay: this.data.oneStepMsgCode,
        machineErrorDesc: this.data.oneStepTips,
        machineErrorTime: this.data.machineErrorTime,
      },
    ]
    param['serviceUserDemandVOs'] = serviceUserDemandVOs

    param = {
      body: param,
    }
    service
      .sendOrderForm(param)
      .then(() => {
        wx.hideLoading({
          success: () => {},
        })
        this.data.isInProgress = false
        if (this.data.isRenew) {
          // wx.navigateBack({
          //   delta: 0,
          // })
          //重新报单
          // wx.showToast({
          //     title: '重新报单成功',
          //     icon: 'none',
          //     duration: 1000
          // })
          // setTimeout(() => {
          wx.redirectTo({
            url: '/midea-service/pages/orderList/orderList',
          })
          // }, 1100);
        } else {
          //安装，维修
          // wx.showToast({
          //     title: '报单成功',
          //     icon: 'none',
          //     duration: 1000
          // })
          // setTimeout(() => {
          wx.redirectTo({
            url: '/midea-service/pages/orderList/orderList',
          })
          // }, 1100);
        }
      })
      .catch((error) => {
        wx.hideLoading({
          success: () => {},
        })
        if (error.errorCode && error.errorCode == 'WOM1000110') {
          //当一天报单量超过3单，或者3天内超过5单且报单人电话与联系人电话不一致
          app.globalData.submittingOrderData = param
        }
        this.submitErrorHandler(error)
      })
    // })
  },
  submitErrorHandler(error) {
    this.data.isInProgress = false
    if (error.errorCode && error.errorCode == 'WOM1000110') {
      //当一天报单量超过3单，或者3天内超过5单且报单人电话与联系人电话不一致
      this.setData({
        isCenters: true,
        isLoading: false,
      })
    } else if (error.errorCode && error.errorCode == 'WOM1000115') {
      //报单人电话与联系人一致一天最多报单10单，当第11单提交后
      this.setData({
        isCenters: false,
        isDialogs: true,
        isLoading: false,
      })
    } else {
      this.setData({
        isLoading: false,
      })
      this.setData({
        isLoading: false,
        longToastContent: error.errorMsg,
        isLongToast: true,
      })
      setTimeout(() => {
        this.setData({
          isLongToast: false,
        })
      }, 2000)
    }
  },
  // 知道了
  makeSure() {
    this.setData({
      isDialogs: false,
    })
    setTimeout(() => {
      wx.navigateBack({
        delta: 0,
      })
    }, 600)
  },
  // 取消
  cancleBtn() {},
  // 确定按钮  验证手机号码
  needSure() {
    // this.thisSendYzm();
    setTimeout(() => {
      this.setData({
        isCenters: false,
      })
    }, 200)
    let installation = 'maintenance'
    setTimeout(() => {
      wx.redirectTo({
        url: `/midea-service/pages/mobileValidation/mobileValidation?from=${installation}`,
      })
    }, 400)
  },
  onReady: function () {},
  onShow: function () {
    this.getLoginStatus().then(() => {
      if (app.globalData.isLogon) {
        this.setData({
          isLogin: true,
        })
        this.onShowDo()
      } else {
        this.setData({
          isLogin: false,
        })
        wx.navigateTo({
          url: login,
        })
      }
    })
  },
  onShowDo() {
    if (this.data.isEnter == true) {
      setTimeout(() => {
        wx.showToast({
          title: '提交成功',
          duration: 2000,
        })
      }, 300)
      setTimeout(() => {
        wx.redirectTo({
          url: '/midea-service/pages/orderList/orderList',
        })
      }, 2500)
    }
    if (app.globalData.selectedProductList.length > 0) {
      this.setData({
        selectedProduct: app.globalData.selectedProductList,
      })
      if (this.data.selectedProduct && this.data.selectedProduct.length > 0) {
        this.checkIsIncludeU99()
        this.handlerServiceTime() //选了产品，判断有没有服务时间
      }
    } else {
      this.setData({
        selectedProduct: [],
        selectedProductNames: '',
      })
      app.globalData.maintenanceItem = {}
      app.globalData.maintenanceItemIndex = null
      app.globalData.maintenanceItem = {}
    }
    if (!isEmptyObject(app.globalData.maintenanceItem)) {
      this.setData({
        fault: app.globalData.maintenanceItem.serviceRequireItemName,
      })
      this.getexcludedfaultlist()
    }
    console.log(this.data.addrItem)
    if (this.data.addrItem) {
      this.setData({
        userAddress: this.data.addrItem,
      })
    } else {
      this.getDefaultAddress() //默认地址
    }
  },
  // 校验是否登录
  getLoginStatus() {
    return app
      .checkGlobalExpiration()
      .then((res) => {
        console.log(res)
      })
      .catch((err) => {
        console.log(err)
        app.globalData.isLogon = false
      })
  },
  //选了产品，判断有没有服务时间
  handlerServiceTime() {
    console.log('服务时间判断')
    let items = this.data.selectedProduct[0]
    console.log(items)
    // 如果缺少了数据，直接显示服务时间
    if (!items.brandCode || !items.prodCode || !items.userTypeCode) {
      this.setData({
        isNeedServeTime: true,
      })
      return
    }
    let params = {
      brandCode: items.brandCode,
      pageSize: 1,
      pageNum: 1,
      prodCodeThird: items.prodCode,
      userTypeCode: items.userTypeCode,
    }
    service
      .checkTimeShow(params)
      .then((res) => {
        console.log(res)
        console.log('res')
        if (res) {
          let targetItem = res.data
          if (targetItem && targetItem.length > 0) {
            let service_type = targetItem[0].serviceType
            let isNeedServeTime = false
            needServiceType.forEach((ele) => {
              if (!isNeedServeTime && service_type.indexOf(ele) >= 0) {
                isNeedServeTime = true
              }
            })
            this.setData({
              isNeedServeTime: isNeedServeTime,
            })
          }
        }
      })
      .catch(() => {
        this.setData({
          isNeedServeTime: true,
        })
        wx.showToast({
          title: '数据查询失败，请重新选择产品。',
          icon: 'none',
          duration: 2000,
        })
      })
  },
  // 默认地址
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
  //其他页面传设备解密sn，直接进到维修页，维修页自动带上维修品类等显示信息
  async dealProductInfo(sn) {
    let productInfo = await this.getFromTsnDsn(sn)
    if (productInfo) {
      this.getProductInfo(productInfo)
    }
  },
  //根据解密的sn获取产品售后信息
  getFromTsnDsn(sn) {
    let reqData = {
      sn: sn,
    }
    return new Promise((resolve) => {
      requestService.request('getFromTsnDsn', reqData).then(
        (resp) => {
          console.log('获取产品售后信息', resp)
          if (resp?.data?.data?.product?.prodCode) {
            let { prodCode, brand, userTypeCode } = resp.data.data.product
            resolve({ prodCode, brand, userTypeCode })
          }
        },
        (error) => {
          console.log('获取产品售后信息失败', error)
          resolve(null)
        }
      )
    })
  },
  //根据产品的品牌brand,prodCode,suerTypeCode,从产品列表里获得对应的完整的产品信息
  async getProductInfo(productInfo) {
    let { prodCode, brand, userTypeCode } = productInfo
    let _this = this
    requestCss({
      urlKey: 'brandCategory',
      data: {
        supBrandProdServiceVO: {
          channel: 'Midea-Service',
          serviceType: 'WX',
        },
      },
    }).then((res) => {
      let productList = res?.list || []
      let brandIndex = 0
      let brandCode = ''
      let brandType = productList.filter((item, index) => {
        if (brand.toUpperCase().includes(item.brandCode)) {
          brandIndex = index
          brandCode = item.brandCode
          return true
        }
      })
      console.log('品类列表', brandType, brandIndex)
      if (brandType.length) {
        app.globalData.selectedProductCurrIndex = brandIndex + 1 //保存选中的品牌列表所在位置,+1的原因是维修页进选择产品页，左边tab有我的设备选项
        let productLit = brandType[0].productTypeDTOList.filter((item) => {
          return item.prodCode == userTypeCode
        })
        console.log('产品列表', productLit)
        if (productLit.length) {
          let target = productLit[0].children.filter((item) => {
            return item.prodCode == prodCode
          })
          console.log('产品信息', target)
          let productContact = target.map((item, index) => {
            return {
              ...item,
              ...brandType[index],
            }
          })
          if (productContact.length) {
            app.globalData.selectedProductList = productContact
            _this.onShowDo()
            let toSelectProductOptions = {
              selectedBrandCode: brandCode,
              selectedList: productContact,
              selectedProdCode: productContact[0].prodCode,
              currentIndex: app.globalData.selectedProductCurrIndex,
            }
            _this.setData({
              toSelectProductOptions: toSelectProductOptions,
            })
          }
        }
      }
    })
  },
  onHide: function () {
    // this.setData({
    //     addrItem: ''
    // })
  },
  onUnload: function () {
    // this.setData({
    //     addrItem: ''
    // })
  },
  onPullDownRefresh: function () {},
  onReachBottom: function () {},
  // onShareAppMessage: function () {

  // }
})
