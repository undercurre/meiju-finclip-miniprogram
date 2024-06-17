import { image } from '../../config/getImage';
import { addDeviceSDK } from '../../../../utils/addDeviceSDK'
import bluetooth from '../../config/bluetooth'
const app = getApp()

Component({
    properties: {
        devInfo: {
            type: Object,
            value: {}
        },
        BTConnectMac: {
            type: String,
            value: ''
        }
    },
    observers: {
        'devInfo'(newVal) {
            if (newVal != undefined && newVal != null && newVal.sn8 != undefined) {
                this.setData({
                    deviceSN8: newVal.sn8,
                    bindType: newVal.bindType
                })
                this.initBySN8(newVal.sn8)
            }
        },
        'BTConnectMac'(newVal) {
            if (newVal != undefined && newVal != null && newVal != '') {
                this.setData({deviceMacConnect: newVal})
            }
        }
    },
    data: {
        iconNotice: image.notice,
        iconClose: image.close,
        isUserClose: false, // 是否用户关闭提示
        deviceSN8: '',
        isSystemLocationAuthorize : false, // 位置是否授权
        isSystemLocationOpen: false, // 位置是否打开,
        isInited: false,
        isUseBlueConnect: false, // 是否为(WB01)优先蓝牙直连设备
        deviceMacConnect: '', // 蓝牙接口使用的MAC，ios下为UUID
        platform: 'ios',
        bindType: 0
    },
    methods: {
        initBySN8(sn8) {
            let isUseBlueConnect = addDeviceSDK.isCanWb01BindBLeAfterWifi('26', sn8)
            let that = this
            if (isUseBlueConnect) {
                console.log('lmn>>> 检查目标设备 mac=' + this.properties.devInfo.btMac);
                bluetooth.resisterFindedTargetDevice(this.properties.devInfo.btMac, (deviceInfo) => {
                    console.log('lmn>>> 存在目标设备 deviceInfo=' + JSON.stringify(deviceInfo));
                    if (deviceInfo.deviceId != null) {
                        that.setData({deviceMacConnect: deviceInfo.deviceId})
                    }
                })
                bluetooth.getBluetoothDevice()
                this.setData({
                    isUseBlueConnect: true,
                    isInited: true
                })
            } else {
                this.setData({
                    isUseBlueConnect: false,
                    isInited: true
                })
            }
        },
        onCloseClick() {
            this.setData({isUserClose: true})
        },
        onConnectClick() {
            let that = this
            if (!this.data.isSystemLocationAuthorize) {
                wx.showModal({
                    title: '“美的美居Lite”想要开启\n您的定位功能',
                    content: '用于设备联网',
                    confirmColor: '#267AFF',
                    cancelColor: '#267AFF',
                    confirmText: '去开启',
                    cancelText: '取消',
                    success (res) {
                      if (res.confirm) {
                        that.getLocationAuthorize()
                      }
                    }
                })
                return
            }
            this.checkSystemOnOff()
            if (!this.data.isSystemLocationOpen) {
                wx.showModal({
                    title: '请开启手机定位功能后再试',
                    showCancel: false,
                    confirmColor: '#267AFF',
                    confirmText: '我知道了'
                })
                return
            }
            if (this.data.isUseBlueConnect) {
                console.log('lmn>>> 跳转蓝牙直连配网 sn8=' + this.data.deviceSN8 + '/blue id=' + this.data.deviceMacConnect)
                let name = this.properties.devInfo.name || app.addDeviceInfo.deviceName || '智能浴霸'
                app.addDeviceInfo.deviceName = name
                if (this.data.platform === 'android') this.triggerEvent('disconnectBT', 0)
                addDeviceSDK.msmartLiteBlueAfterLinkNet({
                    type: '26',
                    sn8: this.data.deviceSN8,
                    deviceId: this.data.deviceMacConnect, //蓝牙id
                    deviceName: name,
                    deviceImg: this.properties.devInfo.deviceImg || app.addDeviceInfo.deviceImg || '',
                })
            } else {
                app.addDeviceInfo.deviceName = this.properties.devInfo.name // 配网成功后默认名称
                addDeviceSDK.goToAddDevice({
                    type: '26',
                    sn8: this.data.deviceSN8,
                })
            }
        },
        checkSystemOnOff() {
            let that = this
            wx.getSystemInfo({
                success (res) {
                that.data.platform = res.platform
                let isSystemLocationOpen = false
                if (res.locationEnabled != undefined) isSystemLocationOpen = res.locationEnabled
                that.setData({ isSystemLocationOpen: isSystemLocationOpen})}
            })
        },
        checkSystemAuthorize() {
            let that = this
            wx.getSetting({
                success (res) {
                    let isSystemLocationAuthorize = false
                    if (res.authSetting['scope.userLocation'] != undefined) isSystemLocationAuthorize = res.authSetting['scope.userLocation']
                    that.setData({isSystemLocationAuthorize: isSystemLocationAuthorize})
                }
            })
        },
        getLocationAuthorize() {
            let that = this
            wx.getSetting({
                success(res) {
                  //判断是否有scope.userLocation属性
                  if (res.authSetting.hasOwnProperty('scope.userLocation')) {
                    if (!res.authSetting['scope.userLocation']) {
                      //弹窗授权
                      wx.openSetting({
                        success(res) {
                            that.checkSystemAuthorize()
                        }
                      })
                    }
                  } else {
                    //scope.userLocation属性不存在,需要授权
                    wx.authorize({
                        scope: 'scope.userLocation',
                        success(res) {
                            that.checkSystemAuthorize()
                        }
                    })
                  }
                }
            })
        }
    },
    lifetimes: {
        attached: function() {
            this.checkSystemOnOff();
            this.checkSystemAuthorize();             
        }
    }
})
