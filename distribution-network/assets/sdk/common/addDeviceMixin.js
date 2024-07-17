// 暂时保留
const app = getApp() //获取应用实例
import Dialog from 'm-ui/mx-dialog/dialog'
import { showToast, getFullPageUrl } from 'm-miniCommonSDK/index'
import { creatErrorCode, failTextData, cableNetworkingFailTextData } from './errorCode'
import { ApBurialPoint } from './burialPoint'
import { getReqId, getStamp } from 'm-utilsdk/index'
import {
  applianceList,
  firmwareList,
  getApplianceAuthType,
  checkApExists,
  batchCheckApExists,
  batchBindDeviceToHome,
  generateCombinedDevice,
  distributeRandomCode
} from './api'
const rangersBurialPoint =  app.getGlobalConfig().rangersBurialPoint
const requestService = app.getGlobalConfig().requestService
const paths = app.getGlobalConfig().paths
const imgBaseUrl = app.getGlobalConfig().imgBaseUrl
const appKey = app.getGlobalConfig().appKey
const log = require('m-miniCommonSDK/utils/log')
const brandConfig = app.globalData.brandConfig[app.globalData.brand]

module.exports = Behavior({ 
  behaviors: [],
  properties: {
  },
  data: {
    isIpx: app.globalData.isPx,
    imgBaseUrl: imgBaseUrl.url,
    imges: {
      meiPhone: '/addDeviceAboutImg/ic_meiphone@1x.png',
      zhuyi: '/addDeviceAboutImg/link_ic_zhuyi.png',
      nearby: '/addDeviceAboutImg/kaojinshebei.png',
      blueCD: '/addDeviceAboutImg/blue_cd.png',

      successRight: '/addDeviceAboutImg/succeed_icon_right.png',
      right: '/addDeviceAboutImg/right.png',

      wifiConnect: '/addDeviceAboutImg/wifi_ic_img_connect.png',
      wifiShow: '/addDeviceAboutImg/WiFi_ic_kejian.png',
      wifiHide: '/addDeviceAboutImg/wifi_ic_bukejian.png',

      loading: '/addDeviceAboutImg/loading_spot.png',
      linkCheck: '/addDeviceAboutImg//link_ic_checked.png',
      linkLoading: '/addDeviceAboutImg/link_ic_loading.png',

      fail: '/addDeviceAboutImg/shibai_icon_shibai.png',

      linkGuide: '/addDeviceAboutImg/wifi_img_lianjiezhiyin.png',
      noSel: '/addDeviceAboutImg/btn_off@3x.png',
      sel: '/addDeviceAboutImg/btn_on@3x.png',

      psw: '/addDeviceAboutImg/ic_mima@3x.png',
      wifi: '/addDeviceAboutImg/ic_wifi@3x.png',
      apName: '/addDeviceAboutImg/wifi_img_guide@3x.png',
      noFound: '/addDeviceAboutImg/img_no found shebei.png',

      //找不到wifi弹窗相关
      closeImg: '/addDeviceAboutImg/pop_ic_close@1x.png',
      noFoundApDiscover: '/addDeviceAboutImg/no_found_ap_discover@2x.png',
      noFoundApSwitch: '/addDeviceAboutImg/no_found_ap_WiFi_switch@2x.png',

      noLocation: '/addDeviceAboutImg/img_no_location@3x.png',

      questino: '/addDeviceAboutImg/ic_2.4GHzremind@3x.png',

      //输入wifi页相关
      refresh: '/addDeviceAboutImg/list_ic_refresh@3x.png',
      wifiSignalStrength1: '/addDeviceAboutImg/ic_wifi@3x.png',
      wifiSignalStrength2: '/addDeviceAboutImg/smart_wifi_01@3x.png',
      wifiSignalStrength3: '/addDeviceAboutImg/smart_wifi_02@3x.png',
      wifiSignalStrength4: '/addDeviceAboutImg/smart_wifi_03@3x.png',

      noWifiList: '/addDeviceAboutImg/img_no home@3x.png',

      //linkAp
      linkDeviceWifiMidea: '/addDeviceAboutImg/Midea_iOS.gif',
      linkDeviceWifiMidea_new: '/addDeviceAboutImg/link_Device_wifi_midea.png',
      android_ApName: '/addDeviceAboutImg/Midea_android.gif',
      android_ApName_new: '/addDeviceAboutImg/android_guidance.png',
      android_linkDeviceWifiBugu: '/addDeviceAboutImg/bugu_Android.gif',
      linkDeviceWifiBugu: '/addDeviceAboutImg/bugu_iOS.gif',
      detailPackUp: '/addDeviceAboutImg/ic_zhankai@3x.png',
      detailExpand: '/addDeviceAboutImg/ic_shouqi@3x.png',
      detailStep2: '/addDeviceAboutImg/img_step2@3x.png',
      detailStep3: '/addDeviceAboutImg/img_step3@3x.png',
      detailStep4: '/addDeviceAboutImg/img_step4@3x.png',
      detailStep4_1: '/addDeviceAboutImg/img_step4_1@2x.png',
      detailStep5: '/addDeviceAboutImg/img_step5@2x.png',
      android_step1: '/addDeviceAboutImg/img_Android_step1@2x.png',
      android_step2: '/addDeviceAboutImg/img_Android_step2@2x.png',
      android_step3: '/addDeviceAboutImg/img_Android_step3@2x.png',
    },
    isStopGetExists: false, //是否停止查询设备已连上云
    isStopGetExists2: false, //是否停止批量查询设备已连上云(组合配网)
    isStartwifi: false, //是否初始化了wifi模块
    failTextData: failTextData,
    cableNetworkingFailTextData: cableNetworkingFailTextData,
    isStopLinkWifi: false,
  },
  wifiService: null, //sdk路由相关接口
  udpService: null, //sdk AP联网相关接口
  linkDeviceService: null, //sdk联网进度页相关接口

  methods: {
    //延迟函数
    delay(milSec) {
      return new Promise((resolve) => {
        setTimeout(resolve, milSec)
      })
    },
    //异步延迟函数
    async delayAwait(milSec) {
      await new Promise(resolve => setTimeout(resolve, milSec));
    },
    //reportEven 数据上报
    apLogReportEven(params) {
      let data = {
        ...params,
      }
      wx.reportEvent('ap_local_log', {
        data: JSON.stringify(data),
        page_path: getFullPageUrl(),
        device_session_id: app.globalData.deviceSessionId || '',
        uid: (getApp().globalData.userData && getApp().globalData.userData.uid) || '',
        time: new Date().getTime(),
      })
    },
    //获取当前ip地址
    getLocalIPAddress() {
      return new Promise((resolve, reject) => {
        if (!wx.canIUse('getLocalIPAddress')) {
          console.log('不支持获取ip')
          resolve(null)
          return
        }
        wx.getLocalIPAddress({
          success(res) {
            // const localip = res.localip
            resolve(res)
          },
          fail(error) {
            console.log('获取ip失败================', error)
            reject(error)
          },
        })
      })
    },
    logAddDivceInfo(logKey, addDviceInfo) {
      let addDviceInfoTemp = JSON.parse(JSON.stringify(addDviceInfo))
      if (addDviceInfoTemp.againCheckList) addDviceInfoTemp.againCheckList = ''
      if (addDviceInfoTemp.apUtils) addDviceInfoTemp.apUtils = ''
      if (addDviceInfoTemp.deviceImgPath) addDviceInfoTemp.deviceImgPath = ''
      if (addDviceInfoTemp.guideInfo) addDviceInfoTemp.guideInfo = ''
      log.info(logKey, addDviceInfoTemp)
    },
    /**
     * 尝试连接wifi
     * @param {*} wifiInfo      wifi信息
     * @param {*} frequency     频率            秒
     * @param {*} callBack      成功
     * @param {*} callBack      失败
     */
    async tryConectWifi(wifiInfo, frequency = 2, callBack, callFail) {
      let { ssid, password, isGoSet } = wifiInfo
      if (!this.data.isSuccessLinkDeviceAp && !this.data.isStopLinkWifi) {
        try {
          await this.connectWifi(ssid, password, isGoSet)
          this.data.isSuccessLinkDeviceAp = true
          callBack && callBack()
        } catch (error) {
          console.log('tryConectWifi error', error)
          if (this.data.isStopLinkWifi) return
          setTimeout(() => {
            this.tryConectWifi(wifiInfo, (frequency = 2), callBack, callFail)
          }, frequency * 1000)
        }
      }
    },
    /**
     * 连接wifi
     * @param {*} SSID          wifi ssid
     * @param {*} password      密码
     * @param {*} isGoSet       是否跳转到设置页
     */
    connectWifi(SSID, password, isGoSet = false) {
      console.log('driving link  wifi', SSID, password)
      return new Promise((resolve, reject) => {
        wx.startWifi({
          success(resp) {
            console.log('startWifi', resp)
            wx.connectWifi({
              SSID: SSID,
              password: password,
              maunal: isGoSet, //是否去设置页连接
              // forceNewApi: true, //使用原生连接wifi方法
              success(res) {
                log.info('主动连接wifi成功', {
                  SSID: SSID,
                })
                console.log('主动连接wifi成功', res)
                resolve(res)
              },
              fail(error) {
                log.info('主动连接wifi失败', {
                  SSID: SSID,
                  password: password,
                })
                console.log('driving link wifi error', error)
                reject(error)
              },
            })
          },
        })
      })
    },
    //是否可以主动连接设备ap
    isCanDrivingLinkDeviceAp(ssid) {
      let res = wx.getSystemInfoSync()
      if (res.system.includes('Android') || ssid) {
        //安卓 或者 有ssid
        return true
      } else {
        return false
      }
    },
    //获取当前房间信息
    getFamilyInfo(groupId) {
      let reqData = {
        homegroupId: groupId,
        reqId: getReqId(),
        stamp: getStamp(),
      }
      return new Promise((resolve, reject) => {
        requestService
          .request(applianceList, reqData)
          .then((resp) => {
            console.log('默认家庭信息', resp.data.data.homeList[0])
            resolve(resp.data.data.homeList)
          })
          .catch((error) => {
            console.log('获取家庭信息失败1', error)
            reject(error)
          })
      })
    },
    //获取当前家庭默认id
    getCurrentHomeGroupId() {
      //获取家庭列表
      return new Promise((resolve, reject) => {
        let reqData = {
          reqId: getReqId(),
          stamp: getStamp(),
        }
        requestService.request(applianceList, reqData).then(
          (resp) => {
            if (resp.data.code == 0) {
              let homeList = resp.data.data.homeList || {}
              console.log('homeList====', homeList)
              let homegroupId = ''
              homeList.forEach((item, index) => {
                if (item.isDefault == '1') {
                  homegroupId = item.homegroupId
                }
              })
              resolve(homegroupId)
            } else {
              reject(resp)
            }
          },
          (error) => {
            reject(error)
          }
        )
      })
    },
    //上报ap 无网期间触发相关埋点
    sendApNoNetBurialpoint(Burialpointes) {
      console.log('批量上报ap 无网触发埋点', Burialpointes)
      Object.keys(Burialpointes).forEach((item, index) => {
        console.log('无网触发埋点====', item, ApBurialPoint[item])
        if (typeof Burialpointes[item] == 'object') {
          console.log('批量上报ap===========111', Burialpointes[item])
          ApBurialPoint[item](Burialpointes[item])
        }
        if (Array.isArray(Burialpointes[item])) {
          Burialpointes[item].forEach((item2) => {
            console.log('批量上报ap===========', item2)
            ApBurialPoint[item](item2)
          })
        }
      })
    },
    //获取自启热点 无后确权固件名单
    getTwoLinkNetList() {
      let params = {
        reqId: getReqId(),
        stamp: getStamp(),
      }
      return new Promise((resolve, reject) => {
        requestService
          .request(firmwareList, params)
          .then((resp) => {
            console.log('获取自启热点 无后确权固件名单 resp', resp.data.data)
            resolve(resp.data.data)
          })
          .catch((error) => {
            console.log('获取自启热点 无后确权固件名单 error', error)
            reject(error)
          })
      })
    },
    //获取系统信息
    wxGetSystemInfo() {
      return new Promise((resolve) => {
        wx.getSystemInfo({
          success(res) {
            resolve(res)
          },
        })
      })
    },
    //获得连接方式
    getLinkType(mode) {
      let linkType = ''
      if (mode == 0) {
        linkType = 'ap'
      }
      if (mode == 3 || mode == 5) {
        linkType = 'bluetooth'
      }
      if (mode == 18) {
        linkType = 'wiredbluetooth'
      }
      if (mode == 'WB01_bluetooth_connection_network') {
        linkType = '蓝牙直连后wifi配网'
      }
      if (mode == 9 || mode == 10) {
        linkType = '本地蓝牙直连'
      }
      return linkType
    },
    //未配置指引统一处理
    noGuide() {
      // wx.showModal({
      //   content: '获取不到设备操作指引，请检查网络后重试',
      //   showCancel: false,
      //   confirmText: '我知道了',
      //   success(res) {
      //     if (res.confirm) {
      //       wx.reLaunch({
      //         url: paths.index,
      //       })
      //     }
      //   },
      // })
      Dialog.confirm({
        title: '获取不到设备操作指引，请检查网络后重试',
        confirmButtonText: '我知道了',
        confirmButtonColor: brandConfig.dialogStyle.confirmButtonColor,
        showCancelButton: false
      }).then((res) => {
        if (res.action == 'confirm') {
          wx.reLaunch({
            url: paths.index,
          })
        }

      })

    },
    //根据企业码返回企业热点名
    getBrandBname(enterprise) {
      let brandName = 'midea'
      if (enterprise == '0010') {
        brandName = 'bugu'
      }
      return brandName
    },
    //生成错误码
    creatErrorCode({ platform, module, errorCode, isCustom }) {
      return creatErrorCode({
        platform,
        module,
        errorCode,
        isCustom,
      })
    },
    //当前手机网络状态
    nowNetType() {
      return new Promise((resolve, reject) => {
        wx.getNetworkType({
          success(res) {
            console.log('当前网络状况', res)
            resolve(res.networkType)
          },
          fail(error) {
            console.log('获取当前网络状况错误', error)
            reject(error)
          },
        })
      })
    },
    //初始化wifi，模块
    startWifi() {
      let self = this
      return new Promise((resolve, reject) => {
        if (self.data.isStartwifi) {
          resolve()
        } else {
          wx.startWifi({
            success: (res) => {
              self.data.isStartwifi = true
              resolve()
            },
            fail(error) {
              reject()
            },
          })
        }
      })
    },

    /**
     * 切换wifi
     * @param {Boolean} iOSReConfirm iOS二次确认弹窗
     */
    switchWifi(iOSReConfirm = true) {
      this.data.isSwitchWifi = true
      const res = wx.getSystemInfoSync()
      if (res.system.includes('Android') || res.system.includes('harmony')) {
        // 直接跳转
        this.jumpSystemSetting()
      }
      if (res.system.includes('iOS')) {
        if (iOSReConfirm) {
          console.log('hhahhahaah')
          // 展示二次确认弹窗
          const self = this
          // wx.showModal({
          //   content: '请直接到系统设置页进行连接，连接后返回本页面',
          //   cancelText: '暂不设置',
          //   cancelColor: '#999',
          //   confirmText: '立即前往',
          //   confirmColor: '#458BFF',
          //   success(res) {
          //     if (res.confirm) {
          //       self.jumpSystemSetting()
          //     }
          //   },
          // })
          Dialog.confirm({
            title: '请直接到系统设置页进行连接，连接后返回本页面',
            cancelButtonText: '暂不设置',
            confirmButtonText: '立即前往',
            confirmButtonColor: this.data.dialogStyle.confirmButtonColor2,
            cancelButtonColor: this.data.dialogStyle.cancelButtonColor2,
          }).then((res) => {
            if (res.action == 'confirm') {
              self.jumpSystemSetting()
            }
          }).catch((error) => {

          })
        } else {
          // 直接跳转
          this.jumpSystemSetting()
        }
      }
    },
    /**
     * 跳转系统设置页
     */
    jumpSystemSetting() {
      wx.startWifi({
        success(res) {
          console.log('调用微信接口wx.startWifi成功', res)
          ApBurialPoint.apLocalLog({
            log: {
              msg: '调用微信接口wx.startWifi成功',
              res: res,
            },
          })
          getApp().setMethodCheckingLog('调用微信接口wx.startWifi成功')
          wx.connectWifi({
            SSID: '',
            password: '',
            maunal: true, // 是否去设置页连接
            success(res) {
              console.log('调用微信接口wx.connectWifi跳转设置页成功', res)
              ApBurialPoint.apLocalLog({
                log: {
                  msg: '调用微信接口wx.connectWifi跳转设置页成功',
                  res: res,
                },
              })
              getApp().setMethodCheckingLog('调用微信接口wx.connectWifi跳转设置页成功')
            },
            fail(error) {
              if (error.errCode == 12005) {
                showToast('请先打开手机WiFi')
              }
              console.log('调用微信接口wx.connectWifi跳转设置页失败', error)
              ApBurialPoint.apLocalLog({
                log: {
                  msg: '调用微信接口wx.connectWifi跳转设置页失败',
                  error: error,
                },
              })
              getApp().setMethodFailedCheckingLog(
                '调用微信接口wx.connectWifi跳转设置页失败',
                `error=${JSON.stringify(error)}`
              )
            },
          })
        },
        fail(error) {
          console.log('调用微信接口wx.startWifi失败', error)
          ApBurialPoint.apLocalLog({
            log: {
              msg: '调用微信接口wx.startWifi失败',
              error: error,
            },
          })
          getApp().setMethodFailedCheckingLog('调用微信接口wx.startWifi失败', `error=${JSON.stringify(error)}`)
        },
      })
    },

    //指引文案格式化显示
    guideDescFomat(guideDesc) {
      guideDesc = guideDesc.replaceAll('<', '&lt;') //<转为&lt; 才能在微信rich-text组件显示
      guideDesc = guideDesc.replaceAll('>', '&gt;') //>转为&lt; 才能在微信rich-text组件显示
      guideDesc = guideDesc.replace(/\n/g, '<br/>') //换行
      guideDesc = guideDesc.replace(/「(.+?)」/g, '<span class="orange-display-txt">$1</span>') //标澄
      guideDesc = this.replaceInco(guideDesc)
      guideDesc = guideDesc.replace(/#([a-zA-Z0-9_-]+?)#/g, '<span class="orange-display-txt digitalFont"> $1 </span>') //数码管字体
      return guideDesc
    },

    //数码管字体替换图片
    replaceInco(guideDesc) {
      let list = ['#AP#', '#00#', '#0A#', '#0L#', '#01#', '#02#']
      let imgList = ['code_ap@3x.png', 'code_00@3x.png', 'code_0a@3x.png', 'code_0l@3x.png', 'code_01@3x.png', 'code_02@3x.png']
      for (let i = 0; i <= list.length - 1; i++) {
        if (guideDesc.includes(list[i])) {
          let imgUrl = imgBaseUrl.url + '/shareImg/' + app.globalData.brand + '/' + imgList[i]
          let content = ' <img class="nixie-tube" src=' + imgUrl + '></img> '
          guideDesc = guideDesc.replaceAll(list[i], content)

        }
      }
      return guideDesc

    },

    //扫码
    scanCode() {
      return new Promise((resolve, reject) => {
        wx.scanCode({
          success(res) {
            console.log('扫码=====', res)
            // resolve(res.result)
            resolve(res)
          },
          fail(error) {
            console.log('扫码失败返回', error)
            reject(error)
          },
          complete() { },
        })
      })
    },
    /**
     * 补位
     * 1
     * len 2
     * return hex 01
     */
    padLen(str, len) {
      var temp = str
      var strLen = (str + '').length
      if (strLen < len) {
        for (var i = 0; i < len - strLen; i++) {
          temp = '0' + temp
        }
      }
      return temp
    },

    /**
     * 查询确权
     * @param {*} applianceCode 
     * @returns 
     */
    getApplianceAuthType(applianceCode) {
      let reqData = {
        applianceCode: applianceCode,
        reqId: getReqId(),
        stamp: getStamp(),
      }
      log.info('查询设备确权情况入参', reqData)
      console.log('查询设备确权情况入参', reqData)
      return new Promise((resolve, reject) => {
        requestService
          .request(getApplianceAuthType, reqData)
          .then((resp) => {
            getApp().setMethodCheckingLog('getApplianceAuthType')
            resolve(resp)
          })
          .catch((error) => {
            getApp().setMethodFailedCheckingLog(
              'getApplianceAuthType',
              `获取设备确权状态异常。error=${JSON.stringify(error)}`
            )
            reject(error)
          })
      })
    },

    //查询设备是否连上云
    checkApExists(sn, forceValidRandomCode, randomCode = '', timeout) {
      return new Promise((resolve, reject) => {
        let reqData = {
          sn: sn,
          forceValidRandomCode: forceValidRandomCode,
          randomCode: randomCode,
          reqId: getReqId(),
          stamp: getStamp(),
        }
        console.log('checkApExists reqData:', reqData)
        getApp().setMethodFailedCheckingLog(
          '查询设备是否连上云参数',
          `reqData=${JSON.stringify(reqData)},plainSn=${app.addDeviceInfo.plainSn}`
        )
        console.log(`查询设备是否连上云参数 reqData=${JSON.stringify(reqData)},plainSn=${app.addDeviceInfo.plainSn}`)
        requestService
          .request(checkApExists, reqData, 'POST', '', timeout)
          .then((resp) => {
            resolve(resp)
          })
          .catch((error) => {
            console.log('查询设备是否连上云 error', error)
            if (error.data) {
              app.addDeviceInfo.errorCode = this.creatErrorCode({
                errorCode: error.data.code,
                isCustom: true,
              })
            }
            if (app.addDeviceInfo && app.addDeviceInfo.mode == 0) {
              //
              if (error.data && error.data.code == 1384) {
                //随机数校验不一致
                app.addDeviceInfo.errorCode = this.creatErrorCode({
                  errorCode: 4169,
                  isCustom: true,
                })
              }
            }
            reject(error)
          })
      })
    },
    //新 轮询查询设备是否连上云
    newAgainGetAPExists(sn, forceValidRandomCode, randomCode = '', timeout, callBack, callFail) {
      let timeoutID
      const timeoutPromise = new Promise((resolve, reject) => {
        timeoutID = setTimeout(reject, 5000, 'WEB TIMEOUT')
      })
      Promise.race([timeoutPromise, this.checkApExists(sn, forceValidRandomCode, randomCode, timeout)])
        .then((resp) => {
          if (resp.data.code == 0) {
            callBack && callBack(resp.data.data)
          }
        })
        .catch((error) => {
          getApp().setMethodFailedCheckingLog('查询设备连云结果异常', `error=${JSON.stringify(error)}`)
          if (this.data.isStopGetExists) return
          if (error.data && error.data.code) {
            console.log('设备未连上云', error)
            setTimeout(() => {
              this.newAgainGetAPExists(sn, forceValidRandomCode, randomCode, timeout, callBack, callFail)
            }, 2000)
          } else {
            console.log('请求超时', error)
            let time = 2000
            if (
              (error.errMsg && error.errMsg.includes('ERR_NAME_NOT_RESOLVED')) ||
              (error.errMsg && error.errMsg.includes('ERR_CONNECTION_ABORTED'))
            ) {
              console.log('ERR_NAME_NOT_RESOLVED', error)
              time = 7000
            }
            setTimeout(() => {
              this.newAgainGetAPExists(sn, forceValidRandomCode, randomCode, timeout, callBack, callFail)
            }, time)
            callFail && callFail(error)
          }
        })
        .finally(() => clearTimeout(timeoutID))
    },
    //轮询查询设备是否连上云
    againGetAPExists(sn, randomCode = '', callBack, callFail) {
      console.log('@addDeviceMixin.js是否停止查询设备是否连上云isStopGetExists===', this.data.isStopGetExists)
      log.info('是否停止查询设备是否连上云', this.data.isStopGetExists)
      this.checkApExists(sn, randomCode ? true : false, randomCode)
        .then((resp) => {
          log.info('查询设备是否连上云接口返回', resp)
          console.log('查询设备是否连上云', resp.data.code)
          if (resp.data.code == 0) {
            console.log('resolve------------')
            callBack && callBack(resp.data.data)
          } else {
            if (!this.data.isStopGetExists) {
              setTimeout(() => {
                this.againGetAPExists(sn, randomCode, callBack, callFail)
              }, 2000)
            }
          }
        })
        .catch((error) => {
          log.info('查询设备是否连上云接口失败', error)
          if (!this.data.isStopGetExists) {
            setTimeout(() => {
              this.againGetAPExists(sn, randomCode, callBack, callFail)
            }, 2000)
          }
        })
    },
    /**
     * 轮询 批量查询设备是否连上路由器
     * @param {*} sn 辅设备/离线设备的sn
     * @param {*} forceValidRandomCode 
     * @param {*} randomCode 
     * @param {*} timeout 
     * @param {*} callBack 
     * @param {*} callFail 
     */
    againBatchGetAPExists(sn, forceValidRandomCode, randomCode = '', timeout, callBack, callFail) {
      let timeoutID
      const timeoutPromise = new Promise((resolve, reject) => {
        timeoutID = setTimeout(reject, 5000, 'WEB TIMEOUT')
      })
      Promise.race([timeoutPromise, this.batchCheckApExists(sn, forceValidRandomCode, randomCode, timeout)])
        .then((resp) => {
          callBack && callBack(resp.data.data)
        })
        .catch((error) => {
          console.warn('@addDeviceMixin.js是否停止查询设备连上云?', this.data.isStopGetExists2)
          if (this.data.isStopGetExists2) return
          if (error.data && error.data.code) {
            setTimeout(() => {
              this.againBatchGetAPExists(sn, forceValidRandomCode, randomCode, timeout, callBack, callFail)
            }, 2000)
          } else {
            console.warn('请求超时', error)
            let time = 2000
            if (
              (error.errMsg && error.errMsg.includes('ERR_NAME_NOT_RESOLVED')) ||
              (error.errMsg && error.errMsg.includes('ERR_CONNECTION_ABORTED'))
            ) {
              console.warn('ERR_NAME_NOT_RESOLVED', error)
              time = 7000
            }
            setTimeout(() => {
              this.againBatchGetAPExists(sn, forceValidRandomCode, randomCode, timeout, callBack, callFail)
            }, time)
            callFail && callFail(error)
          }
        })
        .finally(() => clearTimeout(timeoutID))
    },
    /**
     * 批量查询设备是否连上路由器
     * @param {Array} sn 辅设备/离线设备的sn
     * @param {*} forceValidRandomCode 
     * @param {*} randomCode 
     * @param {*} timeout 
     */
    batchCheckApExists(sn = [], forceValidRandomCode, randomCode = '', timeout) {
      return new Promise((resolve, reject) => {
        let reqData = {
          sns: sn,
          forceValidRandomCode: forceValidRandomCode,
          randomCode: randomCode,
          reqId: getReqId(),
          stamp: getStamp(),
        }
        console.log('batchCheckApExists reqData:', reqData)
        requestService
          .request(batchCheckApExists, reqData, 'POST', '', timeout)
          .then((resp) => {
            console.log('@module addDeviceMixin.js\n@method batchCheckApExists\n@desc 批量查询设备是否连上路由器\n', resp)
            if (resp.data.code == 0) {
              let list = resp.data.data.list
              let checkFlag = false
              let arr2 = list.map((value, key) => {
                if (value.sn == sn[0] && value.code == 0) { // 辅设备成功连上云
                  checkFlag = true
                  return value
                }
              })
              if (checkFlag) {
                resolve(resp)
              } else {
                reject(resp)
              }
            } else {
              reject(resp)
            }
          })
          .catch((error) => {
            // console.warn('@module addDeviceMixin.js\n@method batchCheckApExists\n@desc 批量查询设备是否连上路由器\n', error)
            reject(error)
          })
      })
    },
    /**
     * 批量绑定设备到指定的家庭组和房间
     * @param {*} singleHomeBindReqs
     */
    batchBindDeviceToHome(singleHomeBindReqs) {
      let reqData = null
      reqData = {
        reqId: getReqId(),
        stamp: getStamp(),
        singleHomeBindReqs: singleHomeBindReqs
      }
      console.log('batch bind reqData===', reqData)
      return new Promise((reslove, reject) => {
        requestService
          .request(batchBindDeviceToHome, reqData, 'POST', '', 3000)
          .then((resp) => {
            console.log('@module addDeviceMixin.js\n@method batchBindDeviceToHome\n@desc 批量绑定设备结果\n', resp)
            const data_ = resp.data.data
            if (resp.data.code == 0) {
              if (data_.failList.length == 0) {
                console.log('-----批量绑定成功')
                reslove(resp)
              } else {
                console.error('-----批量绑定失败')
                reject(resp)
              }
            }
          })
          .catch((error) => {
            console.error('@module addDeviceMixin.js\n@method batchBindDeviceToHome\n@desc 批量绑定设备错误\n', error)
            reject(error)
          })
      })
    },
    /**
     * 生成组合设备
     * @param {*} activeMap 
     */
    generateCombinedDevice(activeMap) {
      let reqData = null
      reqData = {
        reqId: getReqId(),
        stamp: getStamp(),
        activeMap: activeMap,
        roomId: app.globalData.currentRoomId,
        homegroupId: app.globalData.currentHomeGroupId
      }
      console.log('generateCombinedDevice reqData===', reqData)
      return new Promise((reslove, reject) => {
        requestService
          .request(generateCombinedDevice, reqData, 'POST', '', 3000)
          .then((resp) => {
            console.log('@module addDeviceMixin.js\n@method generateCombinedDevice\n@desc 组合设备结果\n', resp.data)
            if (resp.data.code == 0) {
              reslove(resp.data)
            }
          })
          .catch((error) => {
            console.error('@module addDeviceMixin.js\n@method generateCombinedDevice\n@desc 组合设备结果\n', error)
            reject(error)
          })
      })
    },
    /**
     * 给在线设备下发随机数
     * @param {*} applianceCode 在线设备的编号
     * @param {*} randomCode 前端生成的32位随机数
     */
    distributeRandomCode(applianceCode, randomCode) {
      let reqData = null
      reqData = {
        reqId: getReqId(),
        stamp: getStamp(),
        applianceCode: applianceCode,
        randomCode: randomCode
      }
      console.log('distributeRandomCode reqData===', reqData)
      return new Promise((reslove, reject) => {
        requestService
          .request(distributeRandomCode, reqData, 'POST', '', 3000)
          .then((resp) => {
            console.log('@module addDeviceMixin.js\n@method distributeRandomCode\n@desc 下发随机数\n', resp)
            log.info('distributeRandomCode result', resp)
            const data_ = resp.data.data
            if (resp.data.code == 0 && data_.status == 0) {
              app.addDeviceInfo.randomCode = randomCode // 设备上报随机数后会保存15分钟
              reslove(resp)
            } else {
              console.error('@module addDeviceMixin.js\n@method distributeRandomCode\n@desc 下发随机数\n', resp)
              reject(resp)
            }
          })
          .catch((error) => {
            console.error('@module addDeviceMixin.js\n@method distributeRandomCode\n@desc 下发随机数\n', error)
            reject(error)
          })
      })
    },
  },
})