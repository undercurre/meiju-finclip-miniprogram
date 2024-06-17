const app = getApp() //获取应用实例
// import config from '../../../config'
// const environment = config.environment
import { isTabPage, getFullPageUrl } from '../../../utils/util'
import { login, serviceWarranty, maintenance, servicePhonenumber, webView, judgeWayToMiniProgram } from '../../../utils/paths'
import { service } from 'assets/js/service'
import { requestService } from '../../../utils/requestService'
import {
  // virtualPluginEnterBurialPoint,
  virtualPluginBurialPoint,
  enterPluginBindSuccess,
  commonPluginClicks,
  enterAddOfficeWechat,
  enterRegisterInformation,
  clickWechatContact,
  clickWechatClose,
  clickWechatBlankClose,
  clickInformationClose,
  clickSumbitInformation,
  clickChoosePic,
  clickChooseDate,
  clickChooseAddress,
  clickScanCode,
  clickAndGoToServiceMiniProgram,
} from '../new-plugin/assets/js/burialPoint'
import { rangersBurialPoint } from '../../../utils/requestService'
import { getReqId, getStamp } from 'm-utilsdk/index'
import { mockData } from './assets/js/mockData.js'
import { imgBaseUrl, api, baseImgApi } from '../../../api'
import config from '../../../config.js'
const environment = config.environment
const masPrefix = config.masPrefix
const domain = config.domain
// import {
//   clickEventTracking
// } from '../../../track/track.js'
Page({
  behaviors: [],
  data: {
    pageOptions: {},
    isLogin: app.globalData.isLogon,
    options: '',
    pageUrl: '',
    productData: {},
    id: '',
    pf: '',
    isHourse: true, //小木马加载中
    mock: false,
    btnList: [
      {
        name: '说明书',
        icon: '/virtual-plugin/images/serve_ic_instructions@2x.png',
      },
      {
        name: '保修政策',
        icon: '/virtual-plugin/images/serve_ic_guarantee@2x.png',
      },
      // {
      //   name: '一键报修',
      //   icon: '/virtual-plugin/images/serve_ic_ fixservice@2x.png',
      // },
      // {
      //   name: '联系客服',
      //   icon: '/virtual-plugin/images/serve_ic_onlineservice@2x.png',
      // },
    ],
    serviceCenterImg: '/virtual-plugin/images/serve_ic_skill@2x.png',
    newProductList: [],
    adArray: [],
    bannerList: [],
    bannerAllList: [],
    autoPlay: true,
    indicatorDots: false,
    currentIndex: 1,
    interval: 3000,
    objList: [],
    imgBaseUrl: imgBaseUrl.url,
    rawIcon: '/virtual-plugin/images/ic_more@2x.png',
    productDataObj: {}, //tsn或者dsn获取的产品的信息
    bigImgObj: {}, // 获取大图类的信息
    statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'], //顶部状态栏的高度
    deviceInfo: '',
    isShowBg: false,
    sn: '',
    tsn: '',
    dsn: '',
    qrCodeType: '', //非智设备类型  0 一码通设备  1 一机一码 2 一型一码
    type: '', //设备 一型一码
    otherImg: '/virtual-plugin/images/nonintelligent_img_bg@2x.png',
    model: '',
    nfcObjectUrl: '', //nfc解析出来的数据存的地方
    nfcid: '',
    touch_down: '',
    homeName: '',
    orgFrom: 1, //1、微信扫一扫2、小程序扫一扫 3、NFC
    cid: '',
    qwid: '', //企业微信接口ID
    dh: '', //上报单号
    zn: 1, // 表示本次销售上报只包含智能设备；0 表示本次销售上报含1个或多个非智能设备
    tel: '', //导购手机号码

    provinceCode: '', //省
    cityCode: '', //市
    countryCode: '', //区
    townCode: '', //街道
    endUserAddress: '楼',
    employeeCode: '', //导购编码
    employeePhone: '', //导购手机
    endUserName: '', //用户名字
    endUserPhone: '', //用户手机号码
    itemList: [], //商品
    picList: [], //图片链接
    purchaseDate: '', //购买日期
    saleHeadId: '', //上报单号
    setsOfBooksId: '',
    terminalCode: '', //门店编码
    gender: '', //性别1：女，2：男
    ageGroup: '', //年龄段 6：46岁及以上，5：41~45岁，4： 36~40岁， 3：31~35岁，2：25~30岁， 1：24岁以下
    isUserBox: false, //用户权益弹框
    isWetChat: false, //企业微信弹框

    userAddress: null, //用户地址
    showRightDilaog: false, //显示权益填写弹窗
    showGuideDilaog: false, //显示客服导购弹窗
    guideInfo: {
      url: '../../../assets/img/img_wechat_chat02@3x.png', //用户头像
      name: '',
      plugid: '', //在企业微信管理后台配置的唯一客服ID
      styleType: 2, //通过此属性可强制覆盖在企业微信管理后台配置的主样式类型，枚举值：1（插件整行显示的样式）2（插件只显示为一个按钮的样式） 3（显示为聊天气泡的样式）
      isMask: 0, //单人客服且styleType为1时有效，控制是否展示客服真实姓名 ，可选项：0、1
      contactText: 4, //单人客服styleType为1且isMask为1时有效、styleType为3时有效、多人客服styleType为1时有效，不支持自定义显示文案，可选项：'咨询服务'、'在线咨询'、'联系客服'，分别对应的值为 0、1、2
      buttonText: 1, //单人客服以及多人客服出现按钮时有效，不支持自定义按钮文案，可选项：'联系我', '立即联系', '咨询服务', '在线咨询', '联系客服'，分别的值为 0～4
      buttonStyle: 'primary', //单人客服以及多人客服出现按钮时有效，用于控制按钮的显示样式，可选项：primary（深蓝色背景）、light（白底背景）
      serviceText: 0, //单人客服以及styleType为3时有效，不支持自定义按钮文案，可选项：'有什么问题可以联系我咨询', '联系服务人员咨询', '获取服务人员联系方式', '联系客服咨询更多问题'，分别的值为 0～3
      paddingStyle: 20, //单人客服以及多人客服styleType为1时有效，用于控制控件的内填充样式，可自定义填充数值
      iconStyle: 'light', //多人客服styleType为1时有效，用于控制图标显示为深蓝色图标还是白底图标，可选项：avator（头像图标）、primary（深蓝色图标）、light（白底图标）
      avatorStyle: 'rect', //单人客服且styleType为1时有效，控制头像的展示类型，枚举值：rect、circle
      bubbleColor: '3a8ae5', //单人客服以及多人客服styleType为2时有效，用于控制圆形按钮的背景色，可自定义传入的色值的16进制值，不用带#号
      blockStyle: 'bubble', //单人客服以及多人客服styleType为2时有效，用于控制显示一个圆形按钮还是一个文字按钮，枚举值：bubble（圆形按钮）、button（文字按钮）
    },
    isPx: app.globalData.isPx,
    isShowAll: false, //是否显示所有标题
    isPdf: false,
    arUrl: '',
    icon: '', //设备图片
    baseImgUrl: baseImgApi.url,
  },
  toExpand() {
    this.setData({
      isShowAll: !this.data.isShowAll,
    })
  },
  //解析链接参数
  parseUrl(url) {
    if (!url || typeof url !== 'string' || !url.includes('?')) return {}
    var urls = url.split('?')
    var arr = urls[1].split('&')
    var params = {}
    arr.forEach((str) => {
      let keyLen = this.dealKeyValue(str)
      let key = str.substr(0, keyLen)
      let value = str.substr(keyLen + 1, str.length - keyLen - 1)
      params[key] = value
    })
    return params
  },
  getPageUrl() {
    const pages = getCurrentPages()
    console.log(pages)
    if (pages.length == 1) return false
    const prevPage = pages[pages.length - 2]
    const route = prevPage.route
    console.log(route)
    return route
  },
  //计算value长度
  dealKeyValue(str) {
    var arr = str.split('=')
    return arr[0].length
  },
  parseObject(param, key, encode) {
    if (param == null) return ''
    var paramStr = ''
    var t = typeof param
    if (t == 'string' || t == 'number' || t == 'boolean') {
      paramStr += '&' + key + '=' + (encode == null || encode ? encodeURIComponent(param) : param)
    } else {
      for (var i in param) {
        var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i)
        paramStr += this.parseObject(param[i], k, encode)
      }
    }
    console.log('转化为链接')
    console.log(paramStr)
    return paramStr
  },
  objToUrl(baseUrl, entity) {
    var url = baseUrl
    for (let [key, value] of Object.entries(entity)) {
      console.log(key + ':' + value)
      url += key + '=' + value + '&'
    }
    url = url.substr(0, url.length - 1)
    console.log('urlurlurlurl', url)
    return url
  },
  hasSuffix(str) {
    let reg = /==$/
    return reg.test(str)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    that.enterLoad(options) //进入就埋点
    if (options) {
      this.data.pageOptions = options
      that.setData({
        id: options.id || '',
        homeName: options.homeName,
        pf: options.pf || '',
        tsn: options.tsn || '',
        dsn: options.dsn || '',
        qrCodeType: options.code || '',
        type: options.type || '',
        nfcid: options.nfcid || '',
        orgFrom: options.orgFrom ? options.orgFrom : options.nfcid ? 2 : that.data.orgFrom,
        qwid: options.qwid || '',
        dh: options.dh || '',
        zn: options.zn || '',
        cid: options.cid || '',
        tel: options.tel || '',
        icon: options.icon || '',
      })
    }
    console.log(options)
    console.log('虚拟插件页onLoad options', options)
    if (options.dsn) {
      this.dsnToTsnFun()
    }
    let defineOptions = ''
    let urlAgr //解析后的参数

    if (options && options.q) {
      defineOptions = decodeURIComponent(options.q) // 处理options 扫码进入
      urlAgr = that.parseUrl(defineOptions)
      console.log('options.q==', defineOptions)
    } else if (options && options.query && options.query.q) {
      defineOptions = decodeURIComponent(options.query.q) // 处理options 扫码进入
      urlAgr = that.parseUrl(defineOptions)
      console.log('options.query.q==', defineOptions)
    } else if (Object.keys(options).length > 0) {
      // 公众号/朋友圈广告进入
      //如果options是对象 并且存在键值对
      // if (!that.hasSuffix(options.tsn) || !that.hasSuffix(options.dsn) ) {
      // // if (!that.hasSuffix(options.tsn) || !that.hasSuffix(options.dsn) || !that.hasSuffix(options.type)) {
      //   options.qrtext = options.qrtext + '=='
      // }
      urlAgr = options
      console.log('options OBJEC==', defineOptions)
    } else if (wx.getStorageSync('newVirtualPluginOptions')) {
      defineOptions = wx.getStorageSync('newVirtualPluginOptions') // 防止扫码丢失 处理options
      urlAgr = that.parseUrl(defineOptions)
      console.log('缓存==', defineOptions)
    } else if (options.nfcid) {
      let nfcObjectUrl = {
        tsn: options.tsn || '',
        dsn: options.dsn || '',
        type: options.type || '',
        nfcid: options.nfcid || '',
        qwid: options.qwid || '',
        dh: options.dh || '',
        zn: options.zn || '',
        cid: options.cid || '',
        tel: options.tel || '',
      }
      //来自nfc识别设备
      that.setData({
        nfcObjectUrl,
      })
    } else if (wx.getStorageSync('nfcPlugins')) {
      //  nfc识别出来需要登录
      let nfcObjectUrl = wx.getStorageSync('nfcPlugins')
      that.setData({
        nfcObjectUrl,
        tsn: nfcObjectUrl.tsn || '',
        dsn: nfcObjectUrl.dsn || '',
        type: nfcObjectUrl.type || '',
        nfcid: nfcObjectUrl.nfcid || '',
        qwid: nfcObjectUrl.qwid || '',
        dh: nfcObjectUrl.dh || '',
        zn: nfcObjectUrl.zn || '',
        cid: nfcObjectUrl.cid || '',
        tel: nfcObjectUrl.tel || '',
      })
    }
    console.log('urlAgrurlAgr', urlAgr)
    if (urlAgr) {
      console.log(urlAgr)
      that.setData({
        pageUrl: defineOptions,
        tsn: urlAgr.tsn || '',
        dsn: urlAgr.dsn || '',
        qrCodeType: urlAgr.code || '',
        type: urlAgr.type || '',
        qwid: urlAgr.qwid || '',
        dh: urlAgr.dh || '',
        zn: urlAgr.zn || '',
        cid: urlAgr.cid || '',
        tel: urlAgr.tel || '',
      })
    }
    this.toAssign(urlAgr)
    console.log(!that.data.pf)
    that.getLoginStatus().then(() => {
      if (app.globalData.isLogon) {
        if (!that.data.pf) {
          this.getHomeGrouplistService()
        }
        let productTsnDsn = ''
        productTsnDsn = that.data.dsn ? that.data.dsn : that.data.tsn ? that.data.tsn : ''
        // console.log(productTsnDsn)
        // console.log('productTsnDsn' + '我是传参的tsn或者dsn、type')
        this.init(productTsnDsn, that.data.type)

        //防止扫码参数丢失
        wx.removeStorageSync('newVirtualPluginOptions') //clear storage options
        if (that.data.pageUrl) {
          wx.setStorageSync('newVirtualPluginOptions', that.data.pageUrl) //存储
        } else if (that.data.nfcid) {
          wx.setStorageSync('nfcPlugins', that.data.nfcObjectUrl)
        }
        return
      } else {
        that.navToLogin()
      }
    })
  },
  // 全局赋值launch_source跟cid埋点
  toAssign(data) {
    if (this.data.orgFrom == 1 && !this.data.pf) {
      app.globalData.launch_source = 'page_yxym_qrcode_open_lite'
      app.globalData.cid = data.cid
      if (data.cid == 'sd_mdt') {
        app.globalData.launch_source = 'qrcode_365_renew_open_lite'
      }
    }
  },
  // 进入埋点
  enterLoad(options) {
    let that = this
    rangersBurialPoint('user_page_view', {
      page_path: getFullPageUrl(),
      module: '插件',
      page_id: 'page_non_smart_vitural_plugin',
      page_name: '非智能设备虚拟插件首页',
      sn: that.data.sn,
      tsn: that.data.tsn,
      dsn: that.data.dsn,
      type: that.data.type,
      sourceID: !options.pf && options.orgFrom ? options.orgFrom : that.data.orgFrom,
      refer_page_name: that.getPageUrl() || '',
    })
  },
  // 成功进入埋点
  successLoad() {
    let that = this
    let params = {
      sn: that.data.sn,
      tsn: that.data.tsn,
      dsn: that.data.dsn,
      type: that.data.type,
      page_path: getFullPageUrl(),
      object_type: that.data.productDataObj.productTypeId,
      object_id: that.data.productDataObj.productModel,
      object_name: that.data.productDataObj.productType,
      refer_page_name: that.getPageUrl() || '',
      ext_info: {
        productModel: that.data.productDataObj.productModel || '', //产品型号
        productModelCode: that.data.productDataObj.productCodeOld || '', //产品型号编码
        productType: that.data.productDataObj.productTypeId || '', //产品品类编码
        productTypeName: that.data.productDataObj.productType || '', //产品品类名称
        salesCode: that.data.productDataObj.salesCode || '', //订单编号
        title: that.data.productDataObj.prodName || '', //插件页页面标题
      },
    }
    virtualPluginBurialPoint(params)
  },
  // 绑定成功埋点
  bindSuccessFs(homegroupId, homeName) {
    console.log(homeName)
    let that = this
    let params = {
      sn: that.data.sn,
      tsn: that.data.tsn,
      dsn: that.data.dsn,
      type: that.data.type,
      object_type: '家庭ID',
      object_id: homegroupId,
      object_name: homeName,
      page_path: getFullPageUrl(),
      ext_info: {
        if_sys: 1,
        productModel: that.data.productDataObj.productModel || '', //产品型号
        productModelCode: that.data.productDataObj.productCodeOld || '', //产品型号编码
        productType: that.data.productDataObj.productTypeId || '', //产品品类编码
        productTypeName: that.data.productDataObj.productType || '', //产品品类名称
      },
    }
    console.log(params)
    enterPluginBindSuccess(params)
  },
  navToLogin() {
    app.globalData.isLogon = false
    this.setData({
      isLogin: app.globalData.isLogon,
    })
    wx.navigateTo({
      url: login,
    })
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
  // 获取当前的家庭列表
  getHomeGrouplistService() {
    console.log(this.data.id)
    if (this.data.id && this.data.homeName) {
      this.toBind(this.data.id, this.data.homeName)
      return
    }
    let that = this
    //获取家庭列表
    service
      .getHomeGrouplistService()
      .then((resp) => {
        let newArray = resp
        let homeId, homeName
        if (newArray.length > 0) {
          homeId = newArray[0].homegroupId
          homeName = newArray[0].name
          console.log(homeName)
          that.toBind(homeId, homeName)
        }
      })
      .catch(() => {})
  },
  // 静默绑定家庭
  toBind(homegroupId, homeName) {
    console.log(homeName)
    let that = this
    //非智能设备绑定到家庭
    if (this.data.dsn || this.data.tsn || this.data.type) {
      let resq = {
        homegroupId: homegroupId,
        reqId: getReqId(),
        stamp: getStamp(),
      }
      if (this.data.tsn) {
        resq = Object.assign(resq, {
          tsn: this.data.tsn,
        })
      }
      if (this.data.dsn) {
        resq = Object.assign(resq, {
          dsn: this.data.dsn,
        })
      }
      if (this.data.type) {
        resq = Object.assign(resq, {
          type: this.data.type,
        })
      }
      requestService.request('bindIntelligentDeviceVToHome', resq).then((resp) => {
        // console.log(resp)
        if (resp.data.code == 0) {
          // 绑定成功埋点
          console.log(homeName)
          that.bindSuccessFs(homegroupId, homeName)
        }
        return
      })
    }
  },
  getFromTsnDsn(tsn, type) {
    // http://qrcode.midea.com/index.html?v=2&type=00010031338032730&mode=999&tsn=000100313380327301B011B00001&cvv=vwco#/
    // http://qrcode.midea.com/test/qrcode/index.html?v=5&mode=000&dsn=0000DB21138100FH3173215G0008#/  秀兰
    // https://qrcode.midea.com/test/qrcode/index.html?v=2&tsn=313380325831B101B00479#/  产品
    // let data = '000100313380327301B011B00001'  00010031138000FN509201B00021
    // 00010031138000FN509201B00021
    // https://qrcode.midea.com/test/qrcode/index.html?v=5&dsn=311310A029697071180270
    // 0001005133100S0C321102100001
    // 0000CA51331000JY321114100001
    let data = {
      tsn,
      type,
    }
    // let data = '000100313380327301B011B00001'
    // let data = '0001005133100S0C321102100001'
    // let data = '0000CA51331000JY321114100005'
    // https://qrcode.midea.com/test/qrcode/index.html?v=5&dsn=0001005133100S0C321102100001
    service
      .getFromTsnDsn(data)
      .then((resp) => {
        console.log('这里啊', resp)
        let objAll = resp
        let productDataObj = objAll.product
        // let pProductBathList = objAll.pProductBathList
        if (this.data.icon) {
          productDataObj.iconUrl = this.data.icon
        } else if (!productDataObj.iconUrl && resp.pImageList.length != 0) {
          productDataObj.iconUrl = resp.pImageList[0]['imagePath']
        }
        this.data.productDataObj = productDataObj
        this.setData({
          productDataObj,
          deviceInfo: productDataObj.prodName,
        })
        let that = this
        setTimeout(() => {
          that.setData({
            isHourse: false,
          })
        }, 600)
        // this.getImgFromTsnDsn(productDataObj.salesCode)
        this.getOutProductList(productDataObj)
        this.getQrText(objAll.pProductBathList)

        this.checkWhereRrom() //校验出什么弹框
        // this.getUserInfor(productDataObj)

        this.successLoad() //埋点
        return
      })
      .catch((error) => {
        console.log(error)
        let that = this
        setTimeout(() => {
          that.setData({
            isHourse: false,
          })
        }, 600)
      })
  },
  // 获取qrtext给说明书传值
  getQrText(qrArr) {
    let newArray = qrArr
    if (newArray && newArray.length > 0) {
      let qrArray = newArray.filter((item) => {
        return (
          item.linkType == 'PRODUCT_LINKTO_FAST_STORAGE_HANDBOOK' ||
          item.linkType == 'SALE_UNIT_LINKTO_FAST_STORAGE_HANDBOOK'
        )
      })
      console.log(qrArray)
      if (qrArray && qrArray.length > 0) {
        let arUrl = qrArray[0].docMainContentPath
        console.log(arUrl)
        let isPdf = this.toVerifyUrl(arUrl)
        console.log(isPdf)

        let urlAgr = this.parseUrl(arUrl)
        console.log(urlAgr)
        console.log(urlAgr.model)
        this.data.model = urlAgr.model
        this.data.isPdf = isPdf
        this.data.arUrl = arUrl
      }
    }
  },
  // 校验有没有pdf文件
  toVerifyUrl(arUrl) {
    console.log(arUrl)
    let strings = '' //pdf的后缀
    let result = false
    try {
      let arUrlList = arUrl.split('.')
      strings = arUrlList[arUrlList.length - 1]
    } catch (err) {
      strings = ''
    }
    if (!strings) {
      result = false
      return result
    }
    let pdflist = ['pdf']
    result = pdflist.some(function (item) {
      return item == strings
    })
    if (result) {
      result = 'pdf'
      return true
    }
  },
  // 获取设备主图
  getImgFromTsnDsn(salesCode) {
    let data = salesCode
    service
      .getImgFromTsnDsn(data)
      .then((resp) => {
        let bigImgObj = resp.picList ? resp.picList[0] : {}
        let productDataObj = this.data.productDataObj
        productDataObj.url = bigImgObj && bigImgObj.url ? bigImgObj.url : ''
        productDataObj.title = productDataObj.brandName + productDataObj.productName
        this.setData({
          productDataObj,
          deviceInfo: productDataObj.prodName,
        })
        let that = this
        setTimeout(() => {
          that.setData({
            isHourse: false,
          })
        }, 600)
        return
      })
      .catch((error) => {
        console.log(error)
        let that = this
        setTimeout(() => {
          that.setData({
            isHourse: false,
          })
        }, 600)
      })
  },
  // TSN/DSN获取事业部通过内容中心配置的动态内容关联对象
  // serviceCode。商品大类：goodsLarge，商品小类：goodsSmall，商品列表：productList
  getDyContentFromTsnDsn(proDuct) {
    // lv2CatMcode   lv2CatMid  小类
    // lv1CatMcode  lv1CatMid   大类
    // productCode   商品编码
    let data = {
      headParams: {},
      restParams: {
        applicationCode: 'APP202105250001EXT', //应用编码
        platformCode: 'Meiju_Wechat_Applet', //平台编码
        relativeType: 'OR',
        extendInfo: ['relativeInfo'], //是否返回扩展信息
        categoryCode: 'NonsmartDevice', //分类编码
        relatives: [
          //关联对象
          {
            serviceCode: 'goodsSmall', //关联对象编码 智能品类:smartProdCategory,商品型号:prodType
            valueId: proDuct.lv2CatMcode, //关联对象值的ID编码 智能品类编码或商品型号编码
          },
          {
            serviceCode: 'goodsLarge',
            valueId: proDuct.lv1CatMcode,
          },
          {
            serviceCode: 'productList',
            valueId: proDuct.productModel,
          },
        ],
        sortList: ['productList', 'goodsSmall', 'goodsLarge'],
        // serviceCode。商品大类：goodsLarge，商品小类：goodsSmall，商品列表：productList
      },
    }
    service
      .getDyContentFromTsnDsn(data)
      .then((resp) => {
        if (resp?.pageContent) {
          let allObj = JSON.parse(resp.pageContent)
          let mockDatas = allObj.defaultPage
          // this.remakePage(mockDatas)
          this.setData({
            bannerAllList: mockDatas,
          })
        }
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 美云销商品中心外部查询商品列表商品型号、营销大小类
  getOutProductList(data) {
    let that = this
    service
      .getOutProductList(data)
      .then((resp) => {
        let proDuct = []
        if (resp && resp.length > 0) {
          proDuct = resp[0]
          console.log(proDuct)
          that.getMobileData(proDuct)
        }
        return
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 虚拟插件页美云销商品中心查询页面详情（页面ID）
  getDetailByPageId(data) {
    service
      .getDetailByPageId(data)
      .then((resp) => {
        let parseObj = JSON.parse(resp.pageContent)
        let mockDatas = parseObj.defaultPage
        this.remakePage(mockDatas)
        return
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 虚拟插件页美云销商品中心查询页面详情（页面ID）
  // dsnToDsnFun() {
  //   let data = this.data.dsn
  //   console.log('dsnToDsnFuntsn',data)
  //   service
  //     .dsnToTsn(data)
  //     .then((resp) => {
  //       console.log('tsn解析',resp)
  //     })
  //     .catch((error) => {
  //       console.log(error)
  //     })
  // },
  dsnToTsnFun() {
    let data = this.data.dsn || this.data.type
    console.log('dsnToDsnFuntsn', data)
    return new Promise((resolve, reject) => {
      let url = `${domain[`${environment}`] + masPrefix}/gw4mes/sn/${data}`
      wx.request({
        url: url,
        method: 'GET',
        success: (res) => {
          resolve(res.data)
        },
        fail: (res) => {
          reject(res)
        },
      })
    })
  },
  gotoServiceMiniProgram() {
    let device_info = {
      tsn: this.data.tsn,
      product_name: this.data.productDataObj.productName || '',
      product_model: this.data.productDataObj.productModel || '',
    }
    let params = {
      device_info: device_info,
      object_type: this.data.productDataObj.productTypeId || '',
      object_id: this.data.productDataObj.productModel || '',
      object_name: this.data.productDataObj.productType || '',
    }
    clickAndGoToServiceMiniProgram(params)
    let path = `pages/authorize/authorize?pathName=/pages/index/index&uid=${
      app.globalData.userData.uid
    }&productSellCode=${this.data.productDataObj.salesCode || ''}&productCode=${
      this.data.productDataObj.prodCode || ''
    }&snCode=${this.data.tsn}`
    wx.navigateToMiniProgram({
      // appId: 'wx0f400684c55f3cdf',
      appId: api.serviceAppid,
      path: path,
      extraData: {
        jp_source: 'midea-meiju-lite',
        jp_c4a_uid: app.globalData.userData.uid,
      },
      envVersion: 'release', //develop/trial/release
      complete(res) {
        console.log('跳转', path, res)
      },
    })
  },
  // 图片替换
  // bindBoughtError() {
  //   bigImgObj.url = this.data.baseImgUrl + 'dms_img_lack@3x.png'
  //   this.setData(bigImgObj)
  // },
  // 点击更多
  toOther(e) {
    // 1 h5 2 小程序 3自定义,,
    console.log(e)
    let that = this
    let link = e.currentTarget.dataset.link
    let productDataObj = this.data.productDataObj
    let device_info = {
      product_name: productDataObj ? productDataObj.productName : '',
      product_model: productDataObj ? productDataObj.productModel : '',
    }
    let params = {
      widget_id: 'click_activity_more',
      widget_name: '更多',
      page_module: '活动信息',
      rank: '',
      object_type: that.data.productDataObj.productTypeId,
      object_id: that.data.productDataObj.productModel,
      object_name: that.data.productDataObj.productType,
      ext_info: {
        productModel: that.data.productDataObj.productModel || '', //产品型号
        productModelCode: that.data.productDataObj.productCodeOld || '', //产品型号编码
        productType: that.data.productDataObj.productTypeId || '', //产品品类编码
        productTypeName: that.data.productDataObj.productType || '', //产品品类名称
        salesCode: that.data.productDataObj.salesCode || '', //订单编号
        title: that.data.productDataObj.prodName || '', //插件页页面标题
      },
      device_info: device_info,
      refer_page_name: this.getPageUrl() || '',
    }
    console.log(params)
    commonPluginClicks(params)
    if (link.jumpType == 1) {
      let jumpLinkUrl = encodeURIComponent(link.jumpLinkUrl)
      wx.navigateTo({
        url: `${webView}?webViewUrl=${jumpLinkUrl}&loginState=true`,
      })
    } else if (link.jumpType == 2) {
      let isTabFlag = isTabPage(link.jumpLinkUrl)
      if (isTabFlag) {
        wx.switchTab({
          url: `${link.jumpLinkUrl}`,
        })
      } else {
        wx.navigateTo({
          url: `${link.jumpLinkUrl}`,
        })
      }
    } else if (link.jumpType == 3) {
      console.log(link)
    }
  },
  // 点击所有的图片广告跳转
  imgEnter(e) {
    console.log(e)
    let that = this
    let jumpLinkUrl = e.currentTarget.dataset.linkurl
    // let jumpPictureUrl = e.currentTarget.dataset.jumppictureurl
    let jumpType = e.currentTarget.dataset.jumptype
    let newParams = e.currentTarget.dataset.params
    let index = e.currentTarget.dataset.index
    let productDataObj = this.data.productDataObj
    let device_info = {
      product_name: productDataObj ? productDataObj.productName : '',
      product_model: productDataObj ? productDataObj.productModel : '',
    }
    let commonData = {
      object_type: that.data.productDataObj.productTypeId,
      object_id: that.data.productDataObj.productModel,
      object_name: that.data.productDataObj.productType,
      ext_info: {
        productModel: that.data.productDataObj.productModel || '', //产品型号
        productModelCode: that.data.productDataObj.productCodeOld || '', //产品型号编码
        productType: that.data.productDataObj.productTypeId || '', //产品品类编码
        productTypeName: that.data.productDataObj.productType || '', //产品品类名称
        salesCode: that.data.productDataObj.salesCode || '', //订单编号
        title: that.data.productDataObj.prodName || '', //插件页页面标题
      },
    }
    // console.log(newParams)
    // console.log(index)
    // console.log(jumpLinkUrl, jumpPictureUrl, jumpType)
    // 轮播1  纵向平铺2  横向平铺3  横向滑动4
    if (newParams.type == 1) {
      let params = {
        widget_id: 'click_activity_banner',
        widget_name: 'banner',
        page_module: '活动信息',
        rank: index + 1,
        ...commonData,
        device_info: device_info,
        refer_page_name: this.getPageUrl() || '',
      }
      console.log(params)
      commonPluginClicks(params)
    } else {
      let params = {
        widget_id: 'click_dynamic_widget',
        widget_name: newParams.widgetName,
        page_module: newParams.type == 4 ? '其他服务' : '',
        rank: index + 1,
        ...commonData,
        device_info: device_info,
        refer_page_name: this.getPageUrl() || '',
      }
      console.log(params)
      commonPluginClicks(params)
    }
    if (jumpType == 1) {
      jumpLinkUrl = encodeURIComponent(e.currentTarget.dataset.linkurl)
      wx.navigateTo({
        url: `${webView}?webViewUrl=${jumpLinkUrl}&loginState=true`,
      })
    } else if (jumpType == 2) {
      let isTabFlag = isTabPage(jumpLinkUrl)
      if (isTabFlag) {
        wx.switchTab({
          url: `${jumpLinkUrl}`,
        })
      } else {
        wx.navigateTo({
          url: `${jumpLinkUrl}`,
        })
      }
    } else if (jumpType == 3) {
      console.log(jumpLinkUrl)
    }
  },
  // 数据实例化
  init(tsn, type) {
    this.getFromTsnDsn(tsn, type)
  },
  getMobileData(proDuct) {
    if (this.data.mock) {
      let mockDatas = mockData.data.defaultPage
      // console.log(mockDatas)
      // this.remakePage(mockDatas)
      this.setData({
        bannerAllList: mockDatas,
      })
    } else {
      // this.getDetailByPageId();
      this.getDyContentFromTsnDsn(proDuct)
    }
  },
  // 筛选数据
  remakePage(mockDatas) {
    let bannerList1 = [] //轮播
    let bannerList3 = [] //横向平铺
    let bannerList4 = [] //横向滚动
    let noTitle = {}
    let hasTitle = {}
    if (mockDatas.length > 0) {
      mockDatas.forEach((item) => {
        // 使用技巧、新品试用  其他服务 都是广告  活动信息是轮播广告
        //轮播1  纵向平铺2  横向平铺3  横向滑动4

        if (item.widgetType == 'banner' && item.type == 1) {
          bannerList1.push(item)
        }
        if (item.widgetType == 'banner' && item.type == 3) {
          bannerList3.push(item)
        }
        if (item.widgetType == 'banner' && item.type == 4) {
          bannerList4.push(item)
        }
        // 其他服务
        if (item.widgetType == 'title' && item.contentSetting && item.contentSetting.hasMore == false) {
          noTitle = item
        }
        // 活动信息
        if (item.widgetType == 'title' && item.contentSetting && item.contentSetting.hasMore == true) {
          hasTitle = item
        }
      })
      bannerList1 = bannerList1 && bannerList1.length > 0 ? bannerList1[0].contentSetting.imageList : []
      bannerList3 = bannerList3 && bannerList3.length > 0 ? bannerList3[0].contentSetting.imageList : []
      bannerList4 = bannerList4 && bannerList4.length > 0 ? bannerList4[0].contentSetting.imageList : []
      let autoPlay =
        bannerList1 &&
        bannerList1.length > 0 &&
        bannerList1[0].styleSetting &&
        bannerList1[0].styleSetting.contentStyle &&
        bannerList1[0].styleSetting.contentStyle.interval > 0
          ? true
          : false
      let interval =
        bannerList1 &&
        bannerList1.length > 0 &&
        bannerList1[0].styleSetting &&
        bannerList1[0].styleSetting.contentStyle &&
        bannerList1[0].styleSetting.contentStyle.interval > 0
          ? bannerList1[0].styleSetting.contentStyle.interval * 1000
          : 3000
      this.setData({
        newProductList: bannerList3,
        adArray: bannerList4,
        bannerList: bannerList1,
        noTitle,
        hasTitle,
        autoPlay,
        interval,
      })
    }
  },
  // 轮播切换
  swiperChange(e) {
    let currentIndex = e.detail.current + 1
    this.setData({
      currentIndex,
    })
  },
  // 固定按钮跳转事件
  toJump(e) {
    console.log(e)
    let that = this
    let index = e.currentTarget.dataset.index
    let pluginSN = this.data.tsn ? this.data.tsn : this.data.dsn ? this.data.dsn : this.data.type
    let productDataObj = this.data.productDataObj
    let productId = this.data.model
    console.log(productDataObj)
    let device_info = {
      product_name: productDataObj ? productDataObj.productName : '',
      product_model: productDataObj ? productDataObj.productModel : '',
    }
    let commonData = {
      object_type: that.data.productDataObj.productTypeId,
      object_id: that.data.productDataObj.productModel,
      object_name: that.data.productDataObj.productType,
      ext_info: {
        productModel: that.data.productDataObj.productModel || '', //产品型号
        productModelCode: that.data.productDataObj.productCodeOld || '', //产品型号编码
        productType: that.data.productDataObj.productTypeId || '', //产品品类编码
        productTypeName: that.data.productDataObj.productType || '', //产品品类名称
        salesCode: that.data.productDataObj.salesCode || '', //订单编号
        title: that.data.productDataObj.prodName || '', //插件页页面标题
      },
    }
    if (index == 0) {
      let params = {
        widget_id: 'click_btn_guide_book',
        widget_name: '电子说明书',
        page_module: '',
        rank: '',
        ...commonData,
        device_info: device_info,
        refer_page_name: this.getPageUrl() || '',
      }
      commonPluginClicks(params)
      if (this.data.isPdf && this.data.arUrl) {
        let pdfUrl = this.data.arUrl
        this.initPdfUrl(pdfUrl)
      } else {
        // 去电子说明书
        this.gotoICSpecification(productId)
      }
    } else if (index == 1) {
      let params = {
        widget_id: 'click_btn_warranty',
        widget_name: '保修政策',
        page_module: '',
        rank: '',
        ...commonData,
        device_info: device_info,
        refer_page_name: this.getPageUrl() || '',
      }
      commonPluginClicks(params)
      wx.navigateTo({
        url: `${serviceWarranty}?sn=${pluginSN}&productmodel=${productDataObj.productModel.trim()}&productCode=${productDataObj.salesCode.trim()}`,
      })
    } else if (index == 2) {
      let params = {
        widget_id: 'click_btn_maintain',
        widget_name: '一键报修',
        page_module: '',
        rank: '',
        ...commonData,
        device_info: device_info,
        refer_page_name: this.getPageUrl() || '',
      }
      commonPluginClicks(params)
      wx.navigateTo({
        url: `${maintenance}?pluginSN=${pluginSN}&brandCode=${productDataObj.brand}&brandName=${productDataObj.brandName}&prodCode=${productDataObj.prodCode}&prodName=${productDataObj.prodName}&productModel=${productDataObj.productModel}`,
      })
    } else if (index == 3) {
      let params = {
        widget_id: 'click_btn_service',
        widget_name: '联系客服',
        page_module: '',
        rank: '',
        ...commonData,
        device_info: device_info,
        refer_page_name: this.getPageUrl() || '',
      }
      commonPluginClicks(params)
      wx.navigateTo({
        url: `${servicePhonenumber}`,
      })
    }
  },
  initPdfUrl(url) {
    console.log('pdf-url', url)
    let _this = this
    wx.showLoading({
      title: '数据加载中....',
    })
    wx.downloadFile({
      url: url,
      success: (res) => {
        console.log('pdf-download-res', res)
        wx.hideLoading({
          success: () => {},
        })
        if (res.tempFilePath && res.tempFilePath.includes('pdf')) {
          wx.openDocument({
            filePath: res.tempFilePath,
            fail: (err) => {
              console.error(err)
            },
            complete: () => {
              wx.hideLoading()
            },
          })
        } else {
          // 去电子说明书
          _this.gotoICSpecification(_this.data.model)
        }
      },
      fail: (err) => {
        console.error(err)
        wx.hideLoading()
      },
    })
  },
  // start: 触摸开始
  start_fn(e) {
    let touch_down = e.touches[0].clientY
    this.data.touch_down = touch_down
  },
  // end: 触摸结束
  end_fn(e) {
    let that = this
    let current_y = e.changedTouches[0].clientY
    let { touch_down } = this.data
    console.log(current_y, touch_down)
    let productDataObj = this.data.productDataObj
    let device_info = {
      product_name: productDataObj ? productDataObj.productName : '',
      product_model: productDataObj ? productDataObj.productModel : '',
    }
    let commonData = {
      object_type: that.data.productDataObj.productTypeId,
      object_id: that.data.productDataObj.productModel,
      object_name: that.data.productDataObj.productType,
      ext_info: {
        productModel: that.data.productDataObj.productModel || '', //产品型号
        productModelCode: that.data.productDataObj.productCodeOld || '', //产品型号编码
        productType: that.data.productDataObj.productTypeId || '', //产品品类编码
        productTypeName: that.data.productDataObj.productType || '', //产品品类名称
        salesCode: that.data.productDataObj.salesCode || '', //订单编号
        title: that.data.productDataObj.prodName || '', //插件页页面标题
      },
    }
    if (current_y > touch_down && current_y - touch_down > 20) {
      console.log('下滑')
      let params = {
        widget_id: 'glide',
        widget_name: '手指下滑',
        page_module: '',
        rank: '',
        ...commonData,
        device_info: device_info,
        refer_page_name: this.getPageUrl() || '',
      }
      console.log(params)
      commonPluginClicks(params)
    } else if (current_y < touch_down && touch_down - current_y >= 20) {
      console.log('上划')
      let params = {
        widget_id: 'upglide',
        widget_name: '手指上滑',
        page_module: '',
        rank: '',
        ...commonData,
        device_info: device_info,
        refer_page_name: this.getPageUrl() || '',
      }
      console.log(params)
      commonPluginClicks(params)
    }
  },

  bindscroll(e) {
    // console.log(e.detail.scrollTop)
    if (e.detail.scrollTop < 20) {
      this.setData({
        isShowBg: false,
      })
    } else {
      this.setData({
        isShowBg: true,
      })
    }
  },
  /**
   * 跳转到美书小程序（电子说明书）
   */
  gotoICSpecification(productId) {
    const currentUid =
      app.globalData.userData && app.globalData.userData.uid && app.globalData.isLogon
        ? app.globalData.userData.uid
        : ''
    const randam = getStamp()
    // clickEventTracking('user_behavior_event', 'gotoICSpecification')
    let appId = 'wxd0e673a1e4dfb3c8'
    let path = productId ? `pages/instructions/instructions?scene=${productId}` : 'pages/index/index'
    let extraData = {
      jp_source: 3,
      jp_c4a_uid: currentUid,
      jp_rand: randam,
    }
    judgeWayToMiniProgram(appId, path, extraData)
  },
  //关闭权益填写信息弹窗
  clickInformationClose() {
    let that = this
    let device_info = {
      tsn: that.data.tsn,
    }
    let params = {
      device_info: device_info,
    }
    clickInformationClose(params)
  },
  //扫码埋点
  clickInformationScan() {
    let device_info = {
      tsn: this.data.tsn,
    }
    let params = {
      device_info: device_info,
    }
    clickScanCode(params)
  },
  //选择服务地址
  clickChooseAddress() {
    let device_info = {
      tsn: this.data.tsn,
    }
    let params = {
      device_info: device_info,
    }
    clickChooseAddress(params)
  },
  //选择购买时间
  clickChooseDate() {
    let device_info = {
      tsn: this.data.tsn,
    }
    let params = {
      device_info: device_info,
    }
    clickChooseDate(params)
  },
  //选择购买凭证
  clickChoosePic() {
    let device_info = {
      tsn: this.data.tsn,
    }
    let params = {
      device_info: device_info,
    }
    clickChoosePic(params)
  },
  //信息提交
  clickSumbitInformation(e) {
    console.log('信息提交:', e)
    console.log(this.data.tsn)
    let device_info = {
      tsn: this.data.tsn ? this.data.tsn : e.detail.code,
    }
    let ext_info = {
      source: this.data.cid == 'sd_kxk_hd' ? 2 : this.data.cid == 'sd_mdt' ? 1 : '', //来源，取值为：1-线下导购，2-线上开箱
      order_id: this.data.dh, //订单id，线上开箱通过用户提交登记信息中的订单编号获得
      tel: app.globalData.userData.userInfo.mobile, //用户手机号
      unionid: app.globalData.unionid, //用户unionid
      buy_date: e.detail.buyTime,
      address: e.detail.userAddress,
    }
    let params = {
      device_info: device_info,
      ext_info: ext_info,
    }
    clickSumbitInformation(params)
    let objData = e.detail
    console.log(objData)
    this.getUserInfor(objData)
  },
  //点击其他空白区域关闭企微弹出框
  clickWechatBlankClose() {
    let device_info = {
      tsn: this.data.tsn,
    }
    let ext_info = {
      source: this.data.cid == 'sd_kxk_hd' ? 2 : this.data.cid == 'sd_mdt' ? 1 : '', //来源，取值为：1-线下导购，2-线上开箱
      order_id: this.data.dh, //订单id，线上开箱通过用户提交登记信息中的订单编号获得
      tel: app.globalData.userData.userInfo.mobile, //用户手机号
      unionid: app.globalData.unionid, //用户unionid
      sale_id: this.data.guideInfo.plugid, //导购id,线上开箱无该信息则不填写
      device_type: 0, //设备类型，取值为：1-智能设备，0
    }
    let params = {
      device_info: device_info,
      ext_info: ext_info,
    }
    clickWechatBlankClose(params)
  },
  //点击关闭按钮关闭企微弹出框
  clickWechatClose() {
    let device_info = {
      tsn: this.data.tsn,
    }
    let ext_info = {
      source: this.data.cid == 'sd_kxk_hd' ? 2 : this.data.cid == 'sd_mdt' ? 1 : '', //来源，取值为：1-线下导购，2-线上开箱
      order_id: this.data.dh, //订单id，线上开箱通过用户提交登记信息中的订单编号获得
      tel: app.globalData.userData.userInfo.mobile, //用户手机号
      unionid: app.globalData.unionid, //用户unionid
      sale_id: this.data.guideInfo.plugid, //导购id,线上开箱无该信息则不填写
      device_type: 0, //设备类型，取值为：1-智能设备，0
    }
    let params = {
      device_info: device_info,
      ext_info: ext_info,
    }
    clickWechatClose(params)
  },
  //点击联系我
  clickWechatContact() {
    let device_info = {
      tsn: this.data.tsn,
    }
    let ext_info = {
      source: this.data.cid == 'sd_kxk_hd' ? 2 : this.data.cid == 'sd_mdt' ? 1 : '', //来源，取值为：1-线下导购，2-线上开箱
      order_id: this.data.dh, //订单id，线上开箱通过用户提交登记信息中的订单编号获得
      tel: app.globalData.userData.userInfo.mobile, //用户手机号
      unionid: app.globalData.unionid, //用户unionid
      sale_id: this.data.guideInfo.plugid, //导购id,线上开箱无该信息则不填写
      device_type: 0, //设备类型，取值为：1-智能设备，0
    }
    let params = {
      device_info: device_info,
      ext_info: ext_info,
    }
    clickWechatContact(params)
  },
  //用户权益提交浏览埋点
  showRightDialog() {
    let device_info = {
      tsn: this.data.tsn,
    }
    let ext_info = {
      source: this.data.cid == 'sd_kxk_hd' ? 2 : this.data.cid == 'sd_mdt' ? 1 : '', //来源，取值为：1-线下导购，2-线上开箱
      order_id: this.data.dh, //订单id，线上开箱通过用户提交登记信息中的订单编号获得
      tel: app.globalData.userData.userInfo.mobile, //用户手机号
      unionid: app.globalData.unionid, //用户unionid
      sale_id: this.data.guideInfo.plugid, //导购id,线上开箱无该信息则不填写
      device_type: 0, //设备类型，取值为：1-智能设备，0
    }
    let params = {
      device_info: device_info,
      ext_info: ext_info,
    }
    enterRegisterInformation(params)
  },
  //企微导购浏览埋点
  showGuideDialog() {
    let device_info = {
      tsn: this.data.tsn,
    }
    let ext_info = {
      source: this.data.cid == 'sd_kxk_hd' ? 2 : this.data.cid == 'sd_mdt' ? 1 : '', //来源，取值为：1-线下导购，2-线上开箱
      order_id: this.data.dh, //订单id，线上开箱通过用户提交登记信息中的订单编号获得
      tel: app.globalData.userData.userInfo.mobile, //用户手机号
      unionid: app.globalData.unionid, //用户unionid
      sale_id: this.data.guideInfo.plugid, //导购id,线上开箱无该信息则不填写
      device_type: 0, //设备类型，取值为：1-智能设备，0-非智能设备
    }
    let params = {
      device_info: device_info,
      ext_info: ext_info,
    }
    enterAddOfficeWechat(params)
  },
  // 美的通365扫码权益 无权益弹框
  mdtScanToBenefits() {
    let data = {
      saleHeadId: this.data.dh,
      unionid: app.globalData.unionid,
      mobile: app.globalData.userData.userInfo.mobile,
      reqId: getReqId(),
      stamp: getStamp(),
    }
    data = JSON.stringify(data)
    service
      .mdtScanToBenefits(data)
      .then((resp) => {
        console.log(resp)
        console.log('新的接口啊' + '美的通')
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 校验是美的通还是生电
  checkWhereRrom() {
    console.log(this.data.cid + '我是cid来源')
    if (this.data.cid && this.data.cid.includes('sd_kxk')) {
      this.setData({
        showRightDilaog: true,
      })
      //权益填写浏览埋点
      this.showRightDialog()
    } else if (this.data.cid == 'sd_mdt') {
      // this.toLoginIn()
      let data = {
        apiId: api.myqwid,
        enterpriseWechatId: 100,
        userMobile: this.data.tel,
      }
      this.comPanyWetChat(data)
      this.mdtScanToBenefits()
    }
  },
  // 登记权益
  toLoginIn() {
    let that = this
    let data = {
      saleHeadId: 143922178,
      // saleHeadId: this.data.dh,
    }
    data = JSON.stringify(data)
    console.log(data)
    service
      .scanToBenefits(data)
      .then((resp) => {
        console.log(resp)
        if (resp) {
          console.log('拿到数据')
          that.setData({
            provinceCode: resp.provinceCode || '', //省
            cityCode: resp.cityCode || '', //市
            countryCode: resp.countryCode || '', //区
            townCode: resp.townCode || '', //街道
            endUserAddress: resp.endUserAddress || '',
            employeeCode: resp.employeeCode || '', //导购编码
            employeePhone: resp.employeePhone || '', //导购手机
            endUserName: resp.endUserName || '', //用户名字
            endUserPhone: resp.endUserPhone || '', //用户手机号码
            itemList: resp.itemList || '', //商品
            picList: resp.picList || '', //图片链接
            purchaseDate: resp.purchaseDate || '', //购买日期
            saleHeadId: resp.saleHeadId || '', //上报单号
            setsOfBooksId: resp.setsOfBooksId || '',
            terminalCode: resp.setsOfBooksId || '', //门店编码
            gender: resp.gender || '', //性别1：女，2：男
            ageGroup: resp.ageGroup || '',
          })
          let params = resp
          console.log(params)
          console.log('666666')
        }
      })
      .catch((error) => {
        console.log(error)
      })
  },
  getUserInfor(data) {
    console.log(data)
    console.log('没办法啊')
    if (data.photoList && data.photoList.length > 0) {
      let newArray = data.photoList
      console.log(newArray)
    }
    this.addMyAppliances(data)
  },
  addMyAppliances(params) {
    console.log(params)
    let item = {
      buyDate: params.buyTime, //时间
      invoiceImgUrl: params.imgListStr, //图片
      // street: params.userAddress.street,
      // streetName: params.userAddress.streetName,
      productBrand: this.data.productDataObj.brandName,
      productCode: this.data.productDataObj.salesCode,
      productModel: this.data.productDataObj.productModel,
      serialNo: params.code,
      productType: this.data.productDataObj.productType,
      productTypeId: this.data.productDataObj.prodCode,
      userTypeCode: this.data.productDataObj.userTypeCode,
      userTypeName: this.data.productDataObj.userTypeName,
      brandCode: this.data.productDataObj.brand || '',
      unionid: app.globalData.unionid,
      mobile: app.globalData.userData.userInfo.mobile,
      brand: 1, //默认值1
      businessType: 'saveAndActivate',
      sourceSys: 'APP',
    }
    let data = {
      headParams: {},
      restParams: [],
    }
    data.restParams.push(item)
    console.log(data)
    console.log('你好啊家电')
    let that = this
    service
      .addMyAppliances(data)
      .then((resp) => {
        console.log(resp)
        let data = {
          apiId: that.data.qwid,
          enterpriseWechatId: 100,
        }
        that.comPanyWetChat(data)
      })
      .catch((error) => {
        console.log(error)
        if (error.data.code == '999999') {
          wx.showToast({
            title: '您已领取365天换新机权益',
            icon: 'none',
            duration: 1000,
          })
          let data = {
            apiId: that.data.qwid,
            enterpriseWechatId: 100,
          }
          that.comPanyWetChat(data)
        } else {
          wx.showToast({
            title: '系统异常,稍后重试',
            icon: 'none',
            duration: 1000,
          })
        }
      })
  },
  // 企业微信无参数限制请求活码 ;按成员号码请求随机成员二维码
  comPanyWetChat(params) {
    let data = params
    service
      .comPanyWetChat(data)
      .then((resp) => {
        console.log(resp)
        let allData = resp
        console.log(allData)
        console.log('allData' + '我的企业微信头像啊')
        this.setData({
          showRightDilaog: false,
          showGuideDilaog: true,
          guideInfo: {
            url: allData.wechatAvatar ? allData.wechatAvatar : '', //用户头像
            plugid: allData.wechatContactmeConfigid ? allData.wechatContactmeConfigid : allData.configId, //在企业微信管理后台配置的唯一客服ID
            showGuideDilaog: true,
            name: allData.wechatName ? allData.wechatName : '',
            styleType: 2, //通过此属性可强制覆盖在企业微信管理后台配置的主样式类型，枚举值：1（插件整行显示的样式）2（插件只显示为一个按钮的样式） 3（显示为聊天气泡的样式）
            bubbleColor: '3a8ae5', //单人客服以及多人客服styleType为2时有效，用于控制圆形按钮的背景色，可自定义传入的色值的16进制值，不用带#号
            blockStyle: 'bubble', //单人客服以及多人客服styleType为2时有效，用于控制显示一个圆形按钮还是一个文字按钮，枚举值：bubble（圆形按钮）、button（文字按钮）
          },
        })
        this.showGuideDialog()
      })
      .catch((error) => {
        console.log(error)
        this.setData({
          showRightDilaog: false,
        })
      })
  },
  obj2str(obj) {
    let strs = ''
    for (let str in obj) {
      strs += str + '=' + obj[str] + '&'
    }
    let result = strs.substring(0, strs.length - 1)
    return result
  },
  onReady: function () {},

  onShow: function () {
    // source =1 ? launch_source='page_yxym_qrcode_open_lite' : launch_source='qrcode_365_renew_open_lite',
    // console.log(this.data.pf)
    // console.log(!this.data.pf)
    // this.init();
    if (this.data.addrItem) {
      this.setData({
        userAddress: this.data.addrItem,
      })
    }
  },

  onAddToFavorites() {
    return {
      title: this.data.deviceInfo,
      imageUrl: '',
      query: this.obj2str(this.data.pageOptions),
    }
  },

  onHide: function () {},

  onUnload: function () {},

  onPullDownRefresh: function () {},

  onReachBottom: function () {},
  onShareAppMessage: function () {
    return {
      title: '欢迎使用美的美居Lite',
      imageUrl: this.data.imgBaseUrl + '/virtual-plugin/images/newPlugin_share.png',
      path: '/pages/index/index',
    }
  },
})
