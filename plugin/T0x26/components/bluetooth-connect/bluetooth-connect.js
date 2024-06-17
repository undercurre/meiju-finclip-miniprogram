import { image } from '../../config/getImage';

Component({
    properties: {
        bTStatus: {
            type: Number,
            value: 0
        },
        devInfo: {
            type: Object,
            value: {}
        }
    },
    observers: {
        'bTStatus'(newVal) { //0：未连接，1：连接中，2：已连接，3：断开
            let isConnectting = newVal == 1
            this.setData({
				isConnectting: isConnectting
            })
            if (newVal == 0) {
                this.askIsAgain()
            }
        },
        'devInfo'(newVal) {
            if (newVal != undefined && newVal != null) {
                let isAfterAddDevice = newVal.btToken == null && newVal.bindType == null && newVal.ability == null
                let isSupportBLE = false
                if (isAfterAddDevice) { // 配网后跳转进入
                    isSupportBLE = true
                } else {
                    // bindType:绑定方式，0是AP配网，1是单蓝牙模组的蓝牙绑定, 2是combo的蓝牙配网，3是combo模组的蓝牙绑定
                    let isBLE = newVal.bindType == 1 || newVal.bindType == 2 || newVal.bindType == 3
                    if (isBLE || newVal.btToken) isSupportBLE = true
                }
                this.setData({
                    isSupportBLE: isSupportBLE
                })
            }
        }
    },
    data: {
        iconBluetooth: image.bluetooth,
        imgConnectting: image.connect_animation,
        isConnectting: false,
        isSystemBLEAuthorize: false, // 蓝牙是否授权
        isSystemBLEOpen: false, //蓝牙是否打开
        isSystemLocationAuthorize : false, // 位置是否授权
        isSystemLocationOpen: false, // 位置是否打开
        isSupportBLE: false, // 设备是否支持蓝牙
        modalLock: false,
        isGetAuthorizeSuccess: false,
        isViewAppear: false
    },
    methods: {
        onConnectClick() {
            let that = this
            if (!this.data.isSystemBLEAuthorize) {
                wx.showModal({
                    content: '“美的美居Lite”想要开启您的蓝牙功能\n用于手机蓝牙控制设备',
                    confirmColor: '#267AFF',
                    cancelColor: '#267AFF',
                    confirmText: '去开启',
                    cancelText: '取消',
                    success (res) {
                      if (res.confirm) {
                        that.getBLEAuthorize()
                      }
                    }
                })
                return
            }
            if (!this.data.isSystemLocationAuthorize) {
                wx.showModal({
                    content: '“美的美居Lite”想要开启您的定位功能\n用于手机蓝牙控制设备',
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
            if (!this.data.isSystemBLEOpen || !this.data.isSystemLocationOpen) {
                wx.showModal({
                    title: '请开启手机蓝牙及定位功能后再试',
                    showCancel: false,
                    confirmColor: '#267AFF',
                    confirmText: '我知道了'
                })
                return
            }
            this.triggerEvent('connectBT', 0)
        },
        getBLEAuthorize() {
            let that = this
            wx.getSetting({
                success(res) {
                  //判断是否有scope.bluetooth属性
                  if (res.authSetting.hasOwnProperty('scope.bluetooth')) {
                    if (!res.authSetting['scope.bluetooth']) {
                      //弹窗授权
                      wx.openSetting({
                        success(res) {
                            that.checkSystemAuthorize()
                        }
                      })
                    }
                  } else {
                    //scope.bluetooth属性不存在,需要授权
                    wx.authorize({
                        scope: 'scope.bluetooth',
                        success(res) {
                            that.checkSystemAuthorize()
                        }
                    })
                  }
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
        },
        checkSystemOnOff() {
            let that = this
            wx.getSystemInfo({
                success (res) {
                    let isSystemBLEOpen = false
                    let isSystemLocationOpen = false
                    if (res.bluetoothEnabled != undefined) isSystemBLEOpen = res.bluetoothEnabled
                    if (res.locationEnabled != undefined) isSystemLocationOpen = res.locationEnabled
                    that.setData({
                        isSystemBLEOpen: isSystemBLEOpen,
                        isSystemLocationOpen: isSystemLocationOpen
                    })
                }
            })
        },
        checkSystemAuthorize() {
            let that = this
            wx.getSetting({
                success (res) {
                    let isSystemBLEAuthorize = false
                    let isSystemLocationAuthorize = false
                    if (res.authSetting['scope.bluetooth'] != undefined) isSystemBLEAuthorize = res.authSetting['scope.bluetooth']
                    if (res.authSetting['scope.userLocation'] != undefined) isSystemLocationAuthorize = res.authSetting['scope.userLocation']
                    that.setData({
                        isSystemBLEAuthorize: isSystemBLEAuthorize,
                        isSystemLocationAuthorize: isSystemLocationAuthorize,
                        isGetAuthorizeSuccess: true
                    })
                    console.log('lmn>>> 检查权限成功(组件)')
                },
                fail (res) {
                    console.log('lmn>>> 检查权限失败(组件)')
                }
            })
        },
        askIsAgain() {
            if (this.data.modalLock || !this.data.isViewAppear) return
            let that = this
            this.setData({modalLock: true})
            wx.showModal({
                title: '连接失败',
                content: '无法连接到设备，请进行以下操作：\n1. 检查设备是否已通电；\n2. 尽量靠近设备，并重新连接。',
                confirmColor: '#267AFF',
                cancelColor: '#267AFF',
                confirmText: '重试',
                cancelText: '我知道了',
                success (res) {
                    that.setData({modalLock: false})
                    if (res.confirm) {
                        that.onConnectClick()
                    }
                }
            })
        }
    },
    lifetimes: {
        attached: function() {
            // 在组件实例进入页面节点树时执行
            this.setData({isViewAppear: true})
            this.checkSystemOnOff();
            
            setTimeout(() => {
                if (!this.data.isGetAuthorizeSuccess) {
                    this.checkSystemAuthorize()
                }
            }, 1000)
        },
        detached: function() {
            // 在组件实例被从页面节点树移除时执行
            this.setData({isViewAppear: false})
        }
    },
    pageLifetimes: {
        show: function() {
            this.checkSystemAuthorize();
        }
    }
})
