const app = getApp()
const imgBaseUrl = app.getGlobalConfig().imgBaseUrl
const requestService = app.getGlobalConfig().requestService
import { getReqId, getTimeStamp, getStamp, hmacEncode, CryptoJS, md5 } from 'm-utilsdk/index'
import {api} from '../../../../api'
import paths from '../../../assets/sdk/common/paths'
import Dialog from 'm-ui/mx-dialog/dialog'
const brandConfig = app.globalData.brandConfig[app.globalData.brand]
import { checkPermission } from '../../../../pages/common/js/permissionAbout/checkPermissionTip'
import { commonDialog } from '../../../assets/js/commonDialog'
import { actionScanResult} from '../../../../utils/scanCodeApi'
import { burialPoint } from './assets/burialPoint'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    brand: '',
    imgBaseUrl: imgBaseUrl.url,
    images: {
      colmoIcon: '/dynamicQrcode/colmoIcon.png',
      authIcon: '/dynamicQrcode/authIcon.png'
    },
    deviceName: '',
    deviceImgUrl: '',
    actionScanClickFlag: false, //点击扫码按钮防重
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let brand = getApp().globalData.brand
    this.setData({
      brand: brand,
      deviceName: app.addDeviceInfo.deviceName,
      deviceImgUrl: app.addDeviceInfo.deviceImg
    })
    burialPoint.multiSnAuthView({
      deviceSessionId: app.globalData.deviceSessionId,
      type: app.addDeviceInfo.type,
      sn8: app.addDeviceInfo.sn8,
      tsn: app.addDeviceInfo?.hostDevice.sn,
      link_type: 'Multi_SN_dynamic_QR_code'
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.selectComponent("#loading").hide();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () { },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () { },

  // 网关子设备元数据关联查询（绑定过程使用
  getMeta(reqData) {
    return new Promise((resolve, reject) => {
      requestService.request('gatewayMetaGet', reqData).then((resp) => {
        console.log('getMeta----------', resp)
        resolve(resp)
      }).catch((error) => {

      })
    })
  },
  // 请求Authurl
  requestAuthUrl() {
    let reqId = getReqId()
    let stamp = getTimeStamp(new Date())
    let url = `https://${app.addDeviceInfo.hostDevice.authUrl}`
    let params = {
      reqId: reqId,
      stamp: stamp,
    }
    console.log('data', url)
    return requestService.request(url, params, 'GET')
  },
  async handleAuth() {
    console.log('99999999')
    this.selectComponent("#loading").show({title: '联网中…'});
    burialPoint.clickAuthBtn({
      deviceSessionId: app.globalData.deviceSessionId,
      type: app.addDeviceInfo.type,
      sn8: app.addDeviceInfo.sn8,
      tsn: app.addDeviceInfo?.hostDevice.sn,
      link_type: 'Multi_SN_dynamic_QR_code'
    })
    let res = await this.requestAuthUrl().catch(err => {
      console.log('authurl error ', err)
      this.selectComponent("#loading").hide();
      Dialog.confirm({
        title: `绑定二维码已失效`,
        message: `请重新扫码绑定${app.addDeviceInfo.deviceName}`,
        confirmButtonText: '我知道了',
        confirmButtonColor:brandConfig.dialogStyle.confirmButtonColor,
        cancelButtonColor:brandConfig.dialogStyle.cancelButtonColor3,
        showCancelButton:false,
        messageAlign:'center',
      })
      .then((res) => {
        if (res.action == 'confirm') {
          //知道了
          this.actionScan()
          // wx.navigateTo({
          //   url: '/pages/index/index?tabPageId=1'
          // })
        }
      })
    })
    console.log('res,ddd', res)
    if (res?.data.code == 0) {
      let metaReqData = {
        gatewayDeviceSn: app.addDeviceInfo.hostDevice.sn,
        reqId: getReqId(),
      }
      this.getMeta(metaReqData).then((res) => {
        console.log('getmeta success', res)
        if (res.data.code == 0) {
          if (res.data.data.length >0) {
            app.addDeviceInfo.subDevice = {}
            app.addDeviceInfo.subDevice.sn = res.data.data[0]
          }
          let singleHomeBindReqs = []
          let getewayDeviceParam = {}
          getewayDeviceParam.homegroupId = app.globalData.currentHomeGroupId
          getewayDeviceParam.randomCode = app.addDeviceInfo.hostDevice.randomCode
          getewayDeviceParam.verificationCodeKey = app.addDeviceInfo.hostDevice.verificationCodeKey
          getewayDeviceParam.verificationCode = app.addDeviceInfo.hostDevice.verificationCode
          getewayDeviceParam.sn = this.encrypt(app.addDeviceInfo.hostDevice.sn)
          getewayDeviceParam.applianceType = app.addDeviceInfo.hostDevice.type
          singleHomeBindReqs.push(getewayDeviceParam)
          if (app.addDeviceInfo.subDevice) {
            let subDeviceParam = {}
            subDeviceParam.homegroupId = app.globalData.currentHomeGroupId
            subDeviceParam.sn = this.encrypt(app.addDeviceInfo.subDevice.sn)
            subDeviceParam.applianceType = this.getTypeBySn(app.addDeviceInfo.subDevice.sn)
            subDeviceParam.randomCode = app.addDeviceInfo.hostDevice.randomCode
            subDeviceParam.gatewaySn = this.encrypt(app.addDeviceInfo.hostDevice.sn)
            subDeviceParam.verificationCodeKey = app.addDeviceInfo.hostDevice.verificationCodeKey
            subDeviceParam.verificationCode = app.addDeviceInfo.hostDevice.verificationCode
            singleHomeBindReqs.push(subDeviceParam)
          }
          let reqData = {
            uid: app.globalData.userData.uid,
            reqId: getReqId(),
            stamp: getTimeStamp(new Date()),
            singleHomeBindReqs:singleHomeBindReqs
          }
          console.log('batchHomeBind reqData---', reqData)
          this.batchHomeBind(reqData)
        }
      })
      burialPoint.AuthSuccessBurialPoint({
        deviceSessionId: app.globalData.deviceSessionId,
        type: app.addDeviceInfo.type,
        sn8: app.addDeviceInfo.sn8,
        tsn: app.addDeviceInfo?.hostDevice.sn,
        link_type: 'Multi_SN_dynamic_QR_code'
      })
    }
  },
  // 【中控屏】网关子设备批量绑定
  batchHomeBind(reqData) {
    return new Promise((resolve, reject) => {
      requestService.request('batchHomeBind', reqData).then((resp) => {
        console.log('batchHomeBind----------', resp)
        if (resp.data.code == 0 && resp.data.data.failList.length == 0) {
          this.selectComponent("#loading").hide();
          app.addDeviceInfo.homeBindSuccessList = resp.data.data.successList
          console.log('batchHomeBind homeBindSuccessList---', resp.data.data.successList)
          let mDeviceInfo = app.addDeviceInfo.homeBindSuccessList.filter(item => item.sn == this.encrypt(app.addDeviceInfo.hostDevice.sn))
          console.log('mDeviceInfo', mDeviceInfo)
          app.addDeviceInfo.applianceCode = mDeviceInfo[0].applianceCode
          app.addDeviceInfo.room = app.globalData.roomList.filter(item => item.roomId == mDeviceInfo[0].roomId)[0].name
          app.addDeviceInfo.roomId = mDeviceInfo[0].roomId
          console.log('【中控屏】网关子设备批量绑定', mDeviceInfo[0].roomId)
          app.globalData.currentRoomId = mDeviceInfo[0].roomId
          if (app.addDeviceInfo?.subDevice?.sn) {
            console.log('sn', this.encrypt(app.addDeviceInfo.subDevice.sn))
            let subDeviceInfo = app.addDeviceInfo.homeBindSuccessList.filter(item => item.sn == this.encrypt(app.addDeviceInfo.subDevice.sn))
            console.log('subDeviceInfo', subDeviceInfo[0])
            if (subDeviceInfo.length> 0 ) {
              app.addDeviceInfo.subDeviceInfo = subDeviceInfo[0]
              app.addDeviceInfo.subDeviceInfo.deviceName = subDeviceInfo[0].name
              app.addDeviceInfo.subDeviceInfo.applianceType = this.getTypeBySn(app.addDeviceInfo.subDevice.sn)
              console.log('8958948843',app.addDeviceInfo.subDevice.sn.substring(9, 17),  app.addDeviceInfo.subDeviceInfo.applianceType)
              app.addDeviceInfo.subDeviceInfo.deviceImg = app.globalData.dcpDeviceImgList[app.addDeviceInfo.subDeviceInfo.applianceType][app.addDeviceInfo.subDevice.sn.substring(9, 17)].icon
              app.addDeviceInfo.subDeviceInfo.room = app.globalData.roomList.filter(item => item.roomId == subDeviceInfo[0].roomId)[0].name
              app.addDeviceInfo.subDeviceInfo.roomId = subDeviceInfo[0].roomId
            }
          }
          wx.navigateTo({
            url: paths.multiSnAddSuccess,
          })
        } else {
          if (app.addDeviceInfo.subDevice) {
            let type = this.getTypeBySn(app.addDeviceInfo.subDevice.sn)
            let sn8 = app.addDeviceInfo.subDevice.sn.substring(9,17)
            let deviceNameAndImg = this.getDeviceApImgAndNameBySn8(app.globalData.dcpDeviceImgList,type,sn8)
            console.log('type----', type,sn8, deviceNameAndImg)
            let subDeviceInfo = {
              name: deviceNameAndImg.deviceImg.name,
              deviceImg: deviceNameAndImg.deviceImg.icon,
              room: app.addDeviceInfo.room //失败时和主设备一个房间
            }
            app.addDeviceInfo.subDeviceInfo = subDeviceInfo
          }
          this.selectComponent("#loading").hide();
          wx.reLaunch({
            url: paths.multiSnAddFail,
          })
        }
      }).catch((error) => {
        this.selectComponent("#loading").hide();
        console.log('batchHomeBind error', error)
        if (app.addDeviceInfo.subDevice) {
          let type = this.getTypeBySn(app.addDeviceInfo.subDevice.sn)
          let sn8 = app.addDeviceInfo.subDevice.sn.substring(9,17)
          let deviceNameAndImg = this.getDeviceApImgAndNameBySn8(app.globalData.dcpDeviceImgList,type,sn8)
          console.log('type----', type,sn8, deviceNameAndImg)
          let subDeviceInfo = {
            name: deviceNameAndImg.deviceImg.name,
            deviceImg: deviceNameAndImg.deviceImg.icon,
            room: app.addDeviceInfo.room //失败时和主设备一个房间
          }
          app.addDeviceInfo.subDeviceInfo = subDeviceInfo
        }
        wx.navigateTo({
          url: paths.multiSnAddFail,
        })
      })
    })
  },
  getTypeBySn(sn) {
    let type = sn.slice(4, 6)
    if (type == '00' || type == 'AB') {
      //空调特殊转化
      type = 'ac'
    }
    return type.toLocaleUpperCase()
  },
  // 加密方法
  encrypt(plainText) {
    let content = app.globalData.userData.key;
    content = CryptoJS.enc.Hex.parse(content)
    content = CryptoJS.enc.Base64.stringify(content);
    let md5_key = md5(api.appKey).substring(0, 16);
    md5_key = CryptoJS.enc.Utf8.parse(md5_key);
    let decode_seed = CryptoJS.AES.decrypt(content, md5_key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    }).toString(CryptoJS.enc.Utf8);
    decode_seed = CryptoJS.enc.Utf8.parse(decode_seed);
    //加密order,加密种子是前面解密的key
    let chiperText = CryptoJS.AES.encrypt(plainText, decode_seed,
      {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      });
    chiperText = chiperText.ciphertext.toString();
    return chiperText;
  },
  handleCancle() {
    burialPoint.cancleAuthClick({
      deviceSessionId: app.globalData.deviceSessionId,
      type: app.addDeviceInfo.type,
      sn8: app.addDeviceInfo.sn8,
      tsn: app.addDeviceInfo?.hostDevice.sn,
      link_type: 'Multi_SN_dynamic_QR_code'
    })
    wx.reLaunch({
      url: '/pages/index/index?tabPageId=1'
    })
  },
  async actionScan() {
    if (this.data.actionScanClickFlag) {
      console.log('[防重阻止]')
      return
    }
    this.data.actionScanClickFlag = true
    //检查蓝牙和位置权限以及是否打开
    // if (!(await this.checkLocationAndBluetooth(true, true, true, true))) {
    //   return
    // }
    let locationRes
    let blueRes
    try {
      locationRes = await checkPermission.loaction(false)
      blueRes = await checkPermission.blue(false)
    } catch (error) {
      this.data.actionScanClickFlag = false
      Dialog.confirm({
        title: '微信系统出错，请尝试点击右上角“...” - “重新进入小程序”',
        confirmButtonText: '好的',
        confirmButtonColor: this.data.dialogStyle.confirmButtonColor2,
        showCancelButton: false,
      }).then((res) => {
        if (res.action == 'confirm') {
        }
      })
      // wx.showModal({
      //   showCancel: false,
      //   content: '微信系统出错，请尝试点击右上角“...” - “重新进入小程序”',
      // })
      console.log(error, '[loactionRes blueRes]err checkPermission')
    }
    console.log('[loactionRes] checkPermission', locationRes)
    if (!locationRes.isCanLocation) {
      const obj = {
        title: '请开启位置权限',
        message: locationRes.permissionTextAll,
        confirmButtonText: '查看指引',
        type: 'location',
        permissionTypeList: locationRes.permissionTypeList,
        confirmButtonColor: this.data.dialogStyle.confirmButtonColor2,
        cancelButtonColor: this.data.dialogStyle.cancelButtonColor3,
      }
      //调用通用弹框组件
      commonDialog.showCommonDialog(obj)
      setTimeout(() => {
        this.data.actionScanClickFlag = false
      }, 1500)
      return
    }
    console.log('[blueRes] checkPermission', blueRes)
    if (!blueRes.isCanBlue) {
      const obj = {
        title: '请开启蓝牙权限',
        message: blueRes.permissionTextAll,
        confirmButtonText: '查看指引',
        type: 'blue',
        permissionTypeList: blueRes.permissionTypeList,
        confirmButtonColor: this.data.dialogStyle.confirmButtonColor2,
        cancelButtonColor: this.data.dialogStyle.cancelButtonColor3,
      }
      //调用通用弹框组件
      commonDialog.showCommonDialog(obj)
      setTimeout(() => {
        this.data.actionScanClickFlag = false
      }, 1500)
      return
    }
    setTimeout(() => {
      this.data.actionScanClickFlag = false
    }, 1500)
    //扫描设备二维码进入配网
    actionScanResult(
      this.showNotSupport,
      this.justAppSupport,
      this.actionGoNetwork,
      this.getDeviceApImgAndName,
      this.data.id,
      this.data.homeName
    )
  },
  getDeviceApImgAndNameBySn8(dcpDeviceImgList, category, sn8) {
    let item = new Object()
    console.log('获取图标命名称1', dcpDeviceImgList, sn8)
    if (dcpDeviceImgList[category]) {
      item.deviceImg = dcpDeviceImgList[category][sn8]
    }
    console.log('获取图标命名称2', item)
    return item
  }
})
