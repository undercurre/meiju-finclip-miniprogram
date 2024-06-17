// midea-virtual-plugin//pages/virtual-plugin/virtual-plugin.js
const app = getApp() //获取应用实例
import config from '../../../config'
import { aesEncrypt } from 'm-utilsdk/index'
import { getFullPageUrl } from '../../../utils/util'
import { login, index } from '../../../utils/paths'
import { service } from 'assets/js/service'
import { requestService } from '../../../utils/requestService'
import {
  virtualPluginEnterBurialPoint,
  virtualPluginBurialPoint,
  enterPluginBindSuccess,
  familyPermissionBurialPoint,
} from '../virtual-plugin/assets/js/burialPoint'

import { getReqId, getStamp } from 'm-utilsdk/index'
import { familyPermissionText } from '../../../globalCommon/js/commonText.js'
import { imgBaseUrl } from '../../../api'
Page({
  behaviors: [],
  /**
   * 页面的初始数据
   */
  data: {
    isLogin: app.globalData.isLogon,
    imgBaseUrl: imgBaseUrl.url,
    // pageUrl: 'https://www.smartmidea.net/projects/qrcode/index.html',
    pageUrl: '',
    bindUrl: '',
    options: {},
    productData: {},
    id: '',
    homeName: '',
    qrtext: '',
    pf: '',
    isHourse: true, //小木马加载中
    sn: '',
    tsn: '',
    dsn: '',
    type: '',
    orgFrom: 1, //1、微信扫一扫2、小程序扫一扫 3、NFC
  },

  //解析链接参数
  parseUrl(url) {
    console.log('收藏', url, typeof url)
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
  //微清新增Openid参数 新增登录态同步
  addOpenId(url) {
    console.log('addOpenId', url)
    console.log(
      'openID===',
      wx.getStorageSync('openId'),
      app.globalData.openId,
      app.globalData.userData.mdata.accessToken
    )
    let openIdB = wx.getStorageSync('openId') || app.globalData.openId
    let token = app.globalData.userData.mdata.accessToken //asscess-token
    let aesKey = app.globalData.aesKey //AES key
    let aesIv = app.globalData.aesIv //AES iv
    if (openIdB) {
      console.log('${aesEncrypt(token , aesKey, aesIv)}', aesEncrypt(token, aesKey, aesIv))
      return `${url}&acceptOpenId=${openIdB}&at=${aesEncrypt(token, aesKey, aesIv)}`
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //生电sda参数模拟
    // let testUrl = 'https://www.smartmidea.net/projects/sit/mini-qrcode/index.html?division=sda&channelID=61&qrtext=sXnlw8_DZ8nT8rOR9a_hwA=='
    // let testUrl = 'https://www.smartmidea.net/projects/mini-qrcode/index.html?qrtext=sm1eebyNbc4de-UWEYcZtw=='
    // let defineSDAoption = encodeURIComponent(testUrl)
    // let options = {
    //   q: defineSDAoption
    // }
    // console.log("判断", defineSDAoption == options.q)

    // let options ={q:"https%3A%2F%2Fwww.smartmidea.net%2Fprojects%2Fsit%2Fmini-qrcode%2Findex.html%3Fqrtext%3DsXnlw8_DZ8nT8rOR9a_hwA%3D%3D",
    //   scancode_time:"1626688148"
    // }
    if (options && options.id) {
      this.setData({
        id: options.id,
        homeName: options.homeName,
        orgFrom: options.orgFrom,
      })
    }
    if (options && options.pf) {
      this.setData({
        pf: options.pf,
      })
    }
    console.log(options)
    console.log('虚拟插件页onLoad options', options)
    let defineOptions = ''
    let urlAgr //解析后的参数
    let baseUrl = `${config.sdaHome[config.environment]}?` //域名
    if (options && options.q) {
      defineOptions = decodeURIComponent(options.q) // 处理options 扫码进入
      urlAgr = this.parseUrl(defineOptions)
      console.log('options.q==', defineOptions)
      this.toAssign(urlAgr)
    } else if (options && options.query && options.query.q) {
      defineOptions = decodeURIComponent(options.query.q) // 处理options 扫码进入
      urlAgr = this.parseUrl(defineOptions)
      console.log('options.query.q==', defineOptions)
    } else if (options && options.collect) {
      console.log('收藏进入解密', decodeURIComponent(options.pagePath))
      let decodePath = decodeURIComponent(options.pagePath)
      urlAgr = this.parseUrl(decodePath)
      console.log('收藏进入解密url', urlAgr)
      // for (let i in decodePath) {
      //   console.log('循环',i,options[i])
      //   urlAgr =
      // }
      // urlAgr = options
    } else if (Object.keys(options).length > 0) {
      // 公众号/朋友圈广告进入
      //如果options是对象 并且存在键值对
      if (!this.hasSuffix(options.qrtext)) {
        options.qrtext = options.qrtext + '=='
      }
      // baseUrl = `${config.virtualPluginPageUrl[config.environment]}?`
      urlAgr = options
      console.log('options OBJEC==', defineOptions)
    } else if (wx.getStorageSync('virtualPluginOptions')) {
      defineOptions = wx.getStorageSync('virtualPluginOptions') // 防止扫码丢失 处理options
      urlAgr = this.parseUrl(defineOptions)
      console.log('缓存==', defineOptions)
    }
    // console.log('===urlagr', urlAgr)
    // console.log('缓存数据', wx.getStorageSync('virtualPluginOptions'))
    let qrtext,
      url,
      directToProduct = false
    console.log(urlAgr)
    this.getLoginStatus().then(() => {
      if (app.globalData.isLogon) {
        if (urlAgr) {
          //如果参数里面division不等于sda 切换域名 division=sda为生电部门
          if (urlAgr.division !== 'sda') baseUrl = `${config.virtualPluginPageUrl[config.environment]}?`
          //记录division
          let division = urlAgr.division
          let at = urlAgr.at
          let acceptOpenId = urlAgr.acceptOpenId
          //记录qrtext
          qrtext = urlAgr.qrtext
          // console.log('division==', division)
          // console.log('qrtext==', qrtext)
          if (!qrtext) {
            wx.switchTab({
              url: '/pages/index/index',
            })
            return
          }
          if (division) {
            delete urlAgr.division
          }
          if (at) {
            delete urlAgr.at
          }
          if (acceptOpenId) {
            delete urlAgr.acceptOpenId
          }
          //重新拼接域名
          url = this.objToUrl(baseUrl, urlAgr)
          if (url.includes('SDA')) {
            this.data.options.qrtext = qrtext
            this.data.qrtext = qrtext
            this.data.bindUrl = url
            this.setData({
              // options: {
              //   qrtext: qrtext,
              // },
              // qrtext: qrtext,
              pageUrl: url,
              // bindUrl: url,
            })
          } else {
            console.log('else-app.globalData.isLogon', app.globalData.isLogon)
            if (app.globalData.isLogon) {
              this.data.options.qrtext = qrtext
              this.data.qrtext = qrtext
              this.data.bindUrl = url
              this.setData({
                // options: {
                //   qrtext: qrtext,
                // },
                // qrtext: qrtext,
                // bindUrl: url,
                pageUrl: this.addOpenId(url),
              })
              console.log('this.addOpenId(url)', this.addOpenId(url))
              console.log(this.addOpenId(url))
              console.log('pageUrl111', this.data.pageUrl)
            } else {
              directToProduct = true
            }
          }
          let that = this
          setTimeout(() => {
            that.setData({
              isHourse: false,
            })
          }, 1000)
        }
        console.log(this.data.options)
        console.log(directToProduct)
        console.log('pageUrl==', this.data.pageUrl)

        //虚拟插件页面载入埋点
        let burialLoadParams = {
          page_path: defineOptions || '',
          sourceID: !this.data.pf ? this.data.orgFrom : '', //1、微信扫一扫2、小程序扫一扫 3、NFC
        }
        console.log('进入虚拟插件页 埋点')
        virtualPluginEnterBurialPoint(burialLoadParams)
        //防止扫码参数丢失
        wx.removeStorageSync('virtualPluginOptions') //clear storage options
        if (this.data.pageUrl) {
          wx.setStorageSync(
            'virtualPluginOptions',
            this.data.pageUrl.includes('SDA') ? this.data.pageUrl.concat('&division=sda') : this.data.pageUrl
          ) //存储
        }

        // this.analyzationQRtext()  //解析qrtext 防止埋点数据在解析成功前调用，所以给解析函数加了 return promise
        this.analyzationQRtext()
          .then(() => {
            // this.getLoginStatus().then(() => {
            if (app.globalData.isLogon) {
              console.log('onLoad 老用户且登录成功')
              console.log(directToProduct, url, qrtext)
              this.directToProduct(directToProduct, url, qrtext)
              this.virtualPluginSuccessBurialPoint()
              if (!this.data.pf) {
                this.getHomeGrouplistService()
              }
            } else {
              this.navToLogin()
            }
            // })
          })
          .catch((err) => {
            console.log('解析失败的 reject', err)
            wx.reLaunch({
              url: index,
            })
            // 解析失败执行登录流程
            // this.getLoginStatus().then(() => {
            //   if (!app.globalData.isLogon) {
            //     this.navToLogin()
            //   }
            // })
          })
      } else {
        this.navToLogin()
      }
    })
  },
  // 全局赋值launch_source跟cid埋点
  toAssign(data) {
    if (this.data.orgFrom == 1 && !this.data.pf) {
      app.globalData.launch_source = 'page_yxym_qrcode_open_lite'
      app.globalData.cid = data.cid
    }
  },
  virtualPluginSuccessBurialPoint() {
    const { pageUrl, productData } = this.data
    let productInfoList = productData?.productInfoList?.[0]
    console.log('analyzationQRtext pageUrl', pageUrl)
    console.log('productData==', productData)
    let urlData = this.parseUrl(pageUrl)
    if (pageUrl && pageUrl.includes('SDA')) {
      urlData.division = 'sda'
    }
    console.log('处理后：', urlData)
    let orgBurialCommonParams = {
      page_path: pageUrl,
      ext_info: {
        productModel: productData.productModel || '',
        productModelCode: productInfoList.productModelCode || '',
        productType: productInfoList.productType || '',
        productTypeName: productInfoList.productTypeName || '',
        salesCode: productInfoList.salesCode || '',
        title: productInfoList.title || '',
      },
      object_type: productData.productType,
      object_id: productData.productModel,
      object_name: productInfoList.productTypeName,
    }
    let burialCommonParams = Object.assign(orgBurialCommonParams, urlData)
    let burialParams = {
      ...burialCommonParams,
      loginStatus: 'login',
      widget_name: '已登录',
    }
    console.log('虚拟插件页登录且解析成功 埋点参数 params', burialParams)
    virtualPluginBurialPoint(burialParams) //埋点
  },
  directToProduct(directToProduct, url, qrtext) {
    if (directToProduct && url) {
      this.data.options.qrtext = qrtext
      this.data.qrtext = qrtext
      this.data.bindUrl = url
      this.setData({
        // options: {
        //   qrtext: qrtext,
        // },
        // qrtext: qrtext,
        // bindUrl: url,
        pageUrl: this.addOpenId(url),
      })
      console.log('pageUrl222', this.data.pageUrl)
    }
  },

  analyzationQRtext() {
    let qrtext = this.data.options.qrtext
    console.log('analyzationQRtext=', this.data.options)
    console.log('analyzationQRtext=', this.data.qrtext)
    let params = ''
    if (qrtext) {
      params = {
        qrtext,
      }
      console.log('qrtextDataAAAA===')
      console.log(params)
    } else {
      let storageData = wx.getStorageSync('virtualPluginOptions')
      console.log('========', storageData)
      let urlAgr = this.parseUrl(storageData)
      let { qrtext } = urlAgr
      if (qrtext) {
        params = {
          qrtext,
        }
      }
    }
    console.log('解析qrtext参数 params', params)
    return new Promise((resolve, reject) => {
      service
        .analyzeQRtext(params)
        .then((data) => {
          if (data.data.code == '000000') {
            // let list = data.data.data.productInfoList
            // if (!list && list.length == 0) return
            // let productModel = data.data.data.productModel
            // let dataObj = {}
            // dataObj = list[0]
            // dataObj.productModel = productModel
            // this.setData({
            //   productData: dataObj,
            // })
            this.data.productData = data.data.data
            console.log('productData 请求赋值后', this.data.productData)
            resolve(data.data.data)
          } else {
            reject(data.data)
          }
        })
        .catch((err) => {
          console.log('err', err.data)
          reject(err)
        })
    })
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
  // 绑定成功埋点
  bindSuccessFs(homegroupId, homeName) {
    console.log(homegroupId, homeName)
    let that = this
    let objParams = {
      sn: that.data.sn,
      tsn: that.data.tsn,
      dsn: that.data.dsn,
      type: that.data.type,
      object_type: '家庭ID',
      object_id: homegroupId,
      object_name: homeName,
      page_path: getFullPageUrl(),
    }
    console.log(objParams)
    enterPluginBindSuccess(objParams)
  },
  // 获取当前的家庭列表
  getHomeGrouplistService() {
    console.log(this.data.id)
    if (this.data.id && this.data.homeName) {
      console.log('你好')
      this.toBind(this.data.id, this.data.homeName)
      return
    }
    let that = this
    //获取家庭列表
    service
      .getHomeGrouplistService()
      .then((resp) => {
        console.log(resp)
        let newArray = resp
        let homeId, homeName
        if (newArray.length > 0) {
          homeId = newArray[0].homegroupId
          homeName = newArray[0].name
          that.toBind(homeId, homeName)
        }
      })
      .catch(() => {})
  },
  // 静默绑定家庭
  toBind(homegroupId, homeName) {
    console.log('进了吗')
    console.log(this.data.bindUrl)
    let that = this
    //非智能设备绑定到家庭
    if (!that.data.qrtext) return
    let resq = {
      qrtext: that.data.qrtext,
      pluginPath: that.data.bindUrl,
      homegroupId: homegroupId,
      reqId: getReqId(),
      stamp: getStamp(),
    }
    console.log(resq)
    requestService
      .request('bindIntelligentDeviceVToHome', resq)
      .then((resp) => {
        console.log(resp)
        if (resp.data.code == 0) {
          // 绑定成功埋点
          that.bindSuccessFs(homegroupId, homeName)
        }
        return
      })
      .catch((e) => {
        const data = e && e.data
        if (data && data.code == '1202') {
          wx.showModal({
            title: familyPermissionText.distributionNetwork.title,
            content: familyPermissionText.distributionNetwork.content,
            confirmText: familyPermissionText.distributionNetwork.confirmText,
            showCancel: false,
            success(res) {
              if (res.confirm) {
                wx.switchTab({
                  url: '/pages/index/index',
                })
              }
            },
          })
          familyPermissionBurialPoint()
        }
      })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // console.log(this.data.pf)
    // console.log(!this.data.pf)
    // if (!this.data.pf) {
    //   this.getHomeGrouplistService()
    // }
  },
  onAddToFavorites() {
    // webview 页面返回 webViewUrl
    let pagePath = encodeURIComponent(this.data.pageUrl)
    return {
      title: '',
      imageUrl: '',
      query: `collect=true&q=${pagePath}&pf=${this.data.pf}`,
    }
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
  onShareAppMessage: function () {
    return {
      title: '欢迎使用美的美居Lite',
      imageUrl: this.data.imgBaseUrl + '/virtual-plugin/images/newPlugin_share.png',
      path: '/pages/index/index',
    }
  },
})
