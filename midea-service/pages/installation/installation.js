const app = getApp()
import { choiceData } from './commonData'
import { service } from '../../assets/js/http'
import { imgBaseUrl } from '../../../api'
import computedBehavior from '../../../utils/miniprogram-computed.js'
import { myAddress } from '../../../utils/paths.js'
import { clickEventTracking } from '../../../track/track.js'
const markDefaultList = choiceData
Page({
  behaviors: [computedBehavior],
  data: {
    imgBaseUrl: imgBaseUrl.url,
    handleType: 'install', // 标识符
    brandType: null,
    contact: null,
    showBrandPickerFlag: false,
    showAddressPickerFlag: false,
    showCalendarPickerFlag: false, //时间选择
    showPopupPickerFlag: false,
    selectNewProductStr: '请选择',
    showNativeComponent: true,
    calendarConf: {
      confirmText: '确定',
      cancelText: '取消',
      cannotServiceTimeObj: {},
    },
    engineerFlag: false,
    engineer: {},
    needInvoice: false,
    invoiceType: '0',
    invoice: {
      name: '',
      phone: '',
      invoiceType: '0',
      taxNo: '',
      unitName: '',
    },
    logisticStatu: '', //物流状态
    placeStatu: {}, //使用场景
    serviceDate: '',
    serviceTime: '',
    memo: '', // 故障描述
    serverIds: '', //上传图片的ids
    displayServiceDate: '',
    showEngineerTips: true,
    showProductNotice: false, // 显示安装提示
    showMemo: false, // 是否显示给工程师捎话
    wifiSmartFlag: false, // 是否Wifi智能
    showWifiTips: false, // 是否显示WIfi智能设备提醒
    showInstallDialog: false, // 显示洗衣机安装弹窗
    curCount: 0,
    actionList: [],
    selectedProduct: [], //所选安装产品的列表
    PopupPicker: false, //物流服务是否显示
    placePicker: false, //使用场所是否显示
    disabled: true, //按钮不可以点
    userAddress: null, //服务地址
    isIncludeU99: false, //是否包含U99  中央空调
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
      // requireServiceDate: null,
    },
    requireServiceDate: null,
    isInProgress: false, //多产品提交验证循环提交工单是否完成
    userInfo: app.globalData.userData && app.globalData.userData.userInfo, //同步的美居app的用户数据
    phoneNumber: app.globalData.userData && app.globalData.userData.userInfo.mobile,
    submittingOrderData: null, //无法提交的单暂存数据
    // selectedProductNames:'',
    isRenew: false, //重新报单
    isDialogs: false,
    topTitle: '服务单无法提交', //顶部标题
    secondTitle: '您今天提交的服务单数量过多，暂时无法提交新单，请明天再试或联系在线客服。', //二级标题
    btnText: '我知道了', //按钮的内容
    isCenters: false,
    // oneTitle:'',
    twoTitle: '您近期已连续多次提交服务单，需先验证身份。',
    cancleTxet: '取消',
    sureText: '验证',
    isLoading: false,
    isEnter: false,
    addrItem: '',
    longToastContent: '',
    isLongToast: false,
    common: '/mideaServices/images/icon.png',
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
      // 物流状态校验
      if (!this.data.placeStatu) {
        result = false
      }
      // 期望时间校验
      if (!this.data.displayServiceDate) {
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
    //   // this.data.isRenew
    //   if (this.data.isRenew) {
    //     //重新下单
    //     let currentOrder = app.globalData.currentOrder;
    //     if (currentOrder.result == 'success') {
    //       this.renewOrder(JSON.parse(currentOrder.data))
    //     }
    //   }
    // }
  },
  onLoad: function (options) {
    app.globalData.selectedProductList = []
    let pages = getCurrentPages()
    let prevPage = pages[pages.length - 2]
    let route = prevPage && prevPage.route
    clickEventTracking('user_page_view', '', {
      refer_page_name: route,
    })
    if (options.isRenew) {
      this.setData({
        isRenew: options.isRenew, //从进度查询过来的 需要重新下单
      })
      // 重新下单
      if (app.globalData.currentOrder) {
        let resp = app.globalData.currentOrder
        if (resp.result == 'success') {
          this.renewOrder(JSON.parse(resp.data))
        }
      }
    }
  },
  // 去收费标准页面
  goToServiceCharge() {
    clickEventTracking('user_behavior_event', 'clickCharges')
    let { selectedProduct } = this.data
    if (selectedProduct && selectedProduct.length > 0) {
      if (selectedProduct.length == 1) {
        wx.navigateTo({
          url: '/midea-service/pages/serviceChargeTypes/serviceChargeTypes',
        })
      } else {
        let list = app.globalData.selectedProductList
        let brandCode = list[0].brandCode
        let prodCode = list[0].prodCode
        let newArr = list.filter((item) => item.brandCode == brandCode && item.prodCode == prodCode)
        let installation = 'serviceChargeChange' //跳转来自安装页面改版后的收费逻辑
        if (newArr.length == list.length) {
          wx.navigateTo({
            url: '/midea-service/pages/serviceChargeTypes/serviceChargeTypes',
          })
        } else {
          wx.navigateTo({
            url: `/midea-service/pages/productSelection/productSelection?fromPage=${installation}`,
          })
        }
      }
    } else {
      let installation = 'serviceChargeChange' //跳转来自安装页面
      wx.navigateTo({
        url: `/midea-service/pages/productSelection/productSelection?fromPage=${installation}`,
      })
    }
  },
  //赋值文本框里面的内容字数
  inputBindHandler(e) {
    let { value } = e.detail
    let curCount = value.length > 120 ? '120' : value.length
    this.setData({
      curCount,
    })
  },
  //赋值文本框里面的内容
  inputBlurHandler(e) {
    let { value } = e.detail
    this.data.order.serviceUserDemandVOs[0].serviceDesc = value
    this.setData({
      memoValue: value,
    })
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
  cancleBtn() {
    console.log('取消')
  },
  // 确定按钮  验证手机号码
  needSure() {
    // this.thisSendYzm();
    setTimeout(() => {
      this.setData({
        isCenters: false,
      })
    }, 200)
    let installation = 'install'
    setTimeout(() => {
      wx.redirectTo({
        url: `/midea-service/pages/mobileValidation/mobileValidation?from=${installation}`,
      })
    }, 400)
  },
  // 跳转就发验证码
  thisSendYzm() {
    let params = app.globalData.userData.userInfo.mobile
    service
      .sendMobileCode(params)
      .then(() => {})
      .catch(() => {})
  },
  // 选择地址
  showAddressPicker() {
    let fromwhere = 'install'
    wx.navigateTo({
      url: `${myAddress}?fromwhere=${fromwhere}`,
    })
  },

  // wifiSmart回调
  wifiSmartFlagCallback() {
    this.setData({
      wifiSmartFlag: !this.data.wifiSmartFlag,
    })
  },

  // 是否显示智能wifi提示
  isShowTips() {
    this.setData({
      showWifiTips: !this.data.showWifiTips,
    })
  },

  //  修改Wifi智能设备时的提示显示状态
  changeShowWifiTips() {
    this.setData({
      showWifiTips: false,
    })
  },

  // 显示选择时间
  showCalendarPicker() {
    this.setData({
      showCalendarPickerFlag: true,
    })
    this.data.showNativeComponent = false
  },

  // 点开物流状态
  showPopupPicker() {
    this.setData({
      PopupPicker: true,
    })
  },

  // 点开使用场所
  openPlace() {
    this.setData({
      placePicker: true,
    })
  },

  // 物流选择
  getPicker(e) {
    this.setData({
      logisticStatu: e.detail,
    })
  },

  // 使用场所选择
  getPlace(e) {
    this.data.order.productUse = e.detail.value //给order里面的productUse赋值
    this.setData({
      placeStatu: e.detail,
    })
  },
  // 快捷选择
  toChecks(e) {
    let { index, actindex } = e.currentTarget.dataset
    let markList = this.data.actionList
    let newList = Object.assign({}, markList[index])
    newList.markList = [].concat(newList.markList)
    newList.markList[actindex].checked = !newList.markList[actindex].checked
    this.data.actionList.splice(index, 1, newList)
    this.setData({
      actionList: this.data.actionList,
    })
  },
  // 确定按钮传参
  selectDate(e) {
    let longStrobj = e.detail
    this.setData({
      displayServiceDate: longStrobj.newData + ' ' + longStrobj.serviceTime,
    })
    this.data.requireServiceDate = longStrobj.date + ' ' + longStrobj.serviceTime
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
      // 调用备注接口
      this.getMarkList()
    }
    return result
  },

  // 选中了产品立马判断有无商用还是家用再调接口获取备注数据
  getMarkList() {
    let remarkProdIdList = this.getUniqueProd()
    let oldMarkList = [].concat(markDefaultList.lampblackMachine.markList)
    let newMarkList = []
    remarkProdIdList.forEach((ele) => {
      // 将旧的已经选择的markList存放
      let oldParam = oldMarkList.find((markEle) => {
        return markEle.id == ele
      })
      if (oldParam) {
        newMarkList.push(oldParam)
      } else {
        for (let key in markDefaultList) {
          let nowParam = markDefaultList[key]
          if (nowParam.id == ele) {
            newMarkList.push(Object.assign({}, nowParam))
          }
        }
      }
    })
    this.setData({
      actionList: newMarkList,
    })
  },
  // 快捷选择数据整理
  //   tips：因为他们无法提供唯一的品类编码，只能使用这种方式做兼容处理
  //   根据已选择的产品，筛选出需要使用的备注产品的id。同一品类不重复
  getUniqueProd() {
    let prodList = []
    if (this.data.selectedProduct.length > 0) {
      this.data.selectedProduct.forEach((ele) => {
        const prodName = ele.userTypeName //根据类别名称判断电器种类
        const realTotalName = ele.prodName //产品的具体名称
        for (let key in markDefaultList) {
          let item = markDefaultList[key]
          let defaultList = item.prodName.split(',')
          defaultList.forEach((default_ele) => {
            // 如果电器种类名中命中列表关键字，则将其id push到列表中，方便筛选备注
            if (prodName.indexOf(default_ele) >= 0) {
              if (item.totalName) {
                let totalNameList = item.totalName.split(',')
                let isPush = false
                // 如果配置列表里面有多个关键字，则重复匹配
                totalNameList.forEach((total_ele) => {
                  if (!isPush && realTotalName.indexOf(total_ele) >= 0) {
                    isPush = true
                  }
                })
                if (isPush) {
                  prodList.push(item.id)
                }
              } else {
                prodList.push(item.id)
              }
            }
          })
        }
      })
      // 过滤掉重复的数组
      prodList = prodList.filter((ele, index, arr) => {
        return arr.indexOf(ele, 0) === index
      })
      return prodList
    }
  },
  // 数组去重
  toCheck(arr, name) {
    var hash = {}
    return arr.reduce(function (item, next) {
      hash[next[name]] ? '' : (hash[next[name]] = true && item.push(next))
      return item
    }, [])
  },
  // 提交按钮表单提交行为
  checkData() {
    if (!this.data.isDataReady) return
    if (this.data.isInProgress) return
    this.data.isInProgress = true
    this.setData({
      isLoading: true,
    })
    this.canTcommit()
    let brandList = []
    let prodNameList = []
    let nelist = this.data.selectedProduct
    let newArray = this.toCheck(nelist, 'brand')
    let newArray1 = this.toCheck(nelist, 'prodName')
    if (newArray && newArray.length > 0) {
      newArray.forEach((item) => {
        brandList.push(item.brand)
      })
    }
    if (newArray1 && newArray1.length > 0) {
      newArray1.forEach((item) => {
        prodNameList.push(item.prodName)
      })
    }
    clickEventTracking('user_behavior_event', 'clickSubmit', {
      ext_info: {
        product_num: this.data.selectedProduct.length,
        brand: brandList,
        apptype_name: prodNameList,
      },
    })
  },
  // 可以提交
  canTcommit() {
    wx.showLoading({
      title: '处理中',
      mask: true,
    })
    let param = {
      serviceOrderVO: {
        interfaceSource: 'SMART',
        webUserPhone: app.globalData.userData.userInfo.mobile, //APP用户注册手机号

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
        requireServiceDate: this.data.requireServiceDate, //用户要求服务时间,
        requireUnitCode: '', //指定网点服务所用
        // pubRemark: this.order.pubRemark //备注
      },
    }
    //用户诉求物流从表
    let serviceUserDemandVOs = []
    let transportStatusItem = this.data.logisticStatu
    let serviceDesc = this.data.order.serviceUserDemandVOs[0].serviceDesc
    let remarks = '。'

    this.data.actionList.forEach((ele) => {
      remarks += `${ele.realProdName}:`
      let nowFasterRemark = ele.markList.filter((selectEle) => {
        return selectEle.checked
      })
      let markListLength = nowFasterRemark.length
      nowFasterRemark.forEach((chooseEle, chooseIndex) => {
        remarks += `${chooseEle.key}${chooseIndex + 1 == markListLength ? '' : '；'}`
      })
      remarks += '。'
    })

    serviceDesc += remarks

    for (let index = 0; index < this.data.selectedProduct.length; index++) {
      const product = this.data.selectedProduct[index]
      serviceUserDemandVOs.push({
        serviceMainTypeCode: transportStatusItem.serviceMainTypeCode, //业务类型如安装值为10，从选择服务请求项目中带过来
        serviceMainTypeName: transportStatusItem.serviceMainTypeName, //业务类型如安装值为10，从选择服务请求项目中带过来
        serviceSubTypeCode: transportStatusItem.serviceSubTypeCode, //业务类型如安装值1010，从选择服务请求项目中带过来
        serviceSubTypeName: transportStatusItem.serviceSubTypeName, //业务类型如安装，从选择服务请求项目中带过来
        contactOrderSerItemCode: transportStatusItem.serviceRequireItemCode, //用户报单请求项目，如需要安装值为BZ01001
        contactOrderSerItemName: transportStatusItem.serviceRequireItemName, //用户报单请求项目，如需要安装
        prodBrand: product.brandCode, //产品品牌
        brandName: product.brand ? product.brand : product.brandName, //产品品牌名称
        prodCode: product.prodCode, //产品品类
        prodName: product.prodName, //产品品类名称
        productAmount: 1, //默认填1
        serviceDesc: serviceDesc, //服务描述
        productUse: product.userTypeCode == 'U99' ? this.data.order.productUse : '', //产品用途（家用、商用、融合创）
        // productCode: this.typeSelectedIndex == 1 ? this.code : '', //产品编码
        // productModel: this.typeSelectedIndex == 0 ? this.code : '', //产品型号
      })
    }

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
        this.setData({
          isLoading: false,
        })
        if (this.data.isRenew) {
          // wx.navigateBack()
          // wx.showToast({
          //   title: '报单成功',
          //   icon: 'none',
          //   duration: 1000
          // })
          // setTimeout(() => {
          wx.redirectTo({
            url: '/midea-service/pages/orderList/orderList',
          })
          // }, 1100);
        } else {
          // wx.showToast({
          //   title: '报单成功',
          //   icon: 'none',
          //   duration: 1000
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
        if (error.errorCode == 'WOM1000110') {
          //当一天报单量超过3单，或者3天内超过5单且报单人电话与联系人电话不一致
          // this.data.submittingOrderData = param
          app.globalData.submittingOrderData = param
        }
        this.submitErrorHandler(error)
      })
  },
  // 接口报错无法下单或者手机号码验证
  submitErrorHandler(error) {
    this.data.isInProgress = false
    if (error.errorCode == 'WOM1000110') {
      //当一天报单量超过3单，或者3天内超过5单且报单人电话与联系人电话不一致  验证身份  需要跳转去验证手机号码页面
      // this.data.validateDialogShow = true
      this.setData({
        isCenters: true,
        isLoading: false,
      })
    } else if (error.errorCode == 'WOM1000115') {
      //报单人电话与联系人一致一天最多报单10单，当第11单提交后  禁止提交工单
      // this.data.forbiddenDialogShow = true
      this.setData({
        isCenters: false,
        isDialogs: true,
        isLoading: false,
      })
    } else {
      this.setData({
        isLoading: false,
        longToastContent: '系统异常，请稍后重试',
        // longToastContent: error.errorMsg?error.errorMsg:error.msg,
        isLongToast: true,
      })
      setTimeout(() => {
        this.setData({
          isLongToast: false,
        })
      }, 2000)
    }
  },
  //重新下单
  renewOrder(order) {
    let serviceUserDemandVO = order.serviceUserDemandVOs
    //安装产品
    this.data.selectedProduct = serviceUserDemandVO
    // this.data.selectedProduct.push({
    //   brandCode: serviceUserDemandVO.brandCode || serviceUserDemandVO.prodBrand, //产品品牌
    //   brand: serviceUserDemandVO.brandName, //产品品牌名称
    //   prodCode: serviceUserDemandVO.prodCode, //产品品类
    //   prodName: serviceUserDemandVO.prodName, //产品品类名称
    //   userTypeCode: serviceUserDemandVO.productUse ? 'U99' : '',
    // })
    let that = this
    serviceUserDemandVO.forEach((item) => {
      for (let i = 1; i < item.productAmount; i++) {
        that.data.selectedProduct.push({
          brandCode: item.brandCode || item.prodBrand,
          brand: item.brandName,
          prodCode: item.prodCode,
          prodName: item.prodName,
          userTypeCode: item.productUse ? 'U99' : '',
        })
      }
    })
    app.globalData.selectedProductList = this.data.selectedProduct
    // 备注text
    this.setData({
      selectedProduct: this.data.selectedProduct,
    })

    //物流状态
    let itemCode = serviceUserDemandVO[0].contactOrderSerItem2Code
    let list = [
      {
        name: '货已到需要安装',
        value: '0',
        serviceRequireItemCode: 'BZ01001',
        serviceRequireItemName: '货已到需要安装',
        serviceMainTypeCode: '10',
        serviceMainTypeName: '安装',
        serviceSubTypeCode: '1010',
        serviceSubTypeName: '安装',
      },
      {
        name: '货未到预约安装',
        value: '1',
        serviceRequireItemCode: 'BZ01002',
        serviceRequireItemName: '货未到预约安装',
        serviceMainTypeCode: '10',
        serviceMainTypeName: '安装',
        serviceSubTypeCode: '1010',
        serviceSubTypeName: '安装',
      },
    ]
    let list0 = list.filter((item) => {
      if (item.serviceRequireItemCode == itemCode) {
        return item
      }
    })
    this.setData({
      logisticStatu: list0.length > 0 ? list0[0] : [],
    })

    // 使用场所回显
    let productUse = serviceUserDemandVO.productUse
    let useList = [
      {
        name: '商用',
        value: '11',
      },
      {
        name: '家用',
        value: '10',
      },
    ]
    let newList = useList.filter((item) => {
      if (item.value == productUse) {
        return item
      }
    })
    this.setData({
      placeStatu: newList.length > 0 ? newList[0] : [],
    })
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

    // this.data.order.serviceUserDemandVOs[0].serviceDesc =
    //   serviceUserDemandVO.serviceDesc || ''

    this.setData({
      order: this.data.order,
      userAddress: this.data.userAddress,
    })
    // 备注信息
    // 备注快捷选择回显
  },
  onReady: function () {},
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

  // 选择安装产品的跳转
  showBrandPicker() {
    let installation = 'install' //跳转来自安装页面
    let isMultiMode = true //选择后返回本业
    wx.navigateTo({
      url: `/midea-service/pages/productSelection/productSelection?fromPage=${installation}&isMultiMode=${isMultiMode}`,
    })
  },
  onShow: function () {
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
    if (app.globalData.selectedProductList && app.globalData.selectedProductList.length > 0) {
      this.setData({
        selectedProduct: app.globalData.selectedProductList,
      })
      if (this.data.selectedProduct && this.data.selectedProduct.length > 0) {
        this.checkIsIncludeU99()
      }
    }
    if (this.data.addrItem) {
      this.setData({
        userAddress: this.data.addrItem,
      })
    } else {
      this.getDefaultAddress() //默认地址
    }
  },
  onHide: function () {
    // this.setData({
    //   addrItem: ''
    // })
  },
  onUnload: function () {
    // this.setData({
    //   addrItem: ''
    // })
  },
  onPullDownRefresh: function () {},
  onReachBottom: function () {},
  // onShareAppMessage: function () {

  // }
})
