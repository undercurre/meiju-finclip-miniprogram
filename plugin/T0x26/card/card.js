import { CARD_MODE_OPTION } from '../../../pages/common/js/cardMode'
import { requestService } from '../../../utils/requestService'
import { getReqId, getStamp, ab2hex } from 'm-utilsdk/index'

import protocolConversion from '../config/protocolConversion'
import bluetooth from '../config/bluetooth'
const bleNegotiation = require('../../../utils/ble/ble-negotiation')
const registerBLEConnectionStateChange = require('../../../utils/ble/ble-negotiation');
import {paesrBleResponData, constructionBleControlOrder} from '../../../utils/ble/ble-order';

const app = getApp()

Component({
  behaviors: [bleNegotiation, registerBLEConnectionStateChange],
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    applianceData: { // 设备信息
      type: Object,
      value: {}
    }
  },
  data: {
    isInit: true, // *****固定方法，供外界调用****
    isQueryOffLine: false, // 查询失败导致离线
    status: {}, // 设备状态数据
    isDeviceOnline: false, // 获取设备信息离线，或查询失败导致离线
    queryTimer: null, // wifi连接时轮询定时器
    controlLock: false, // wifi连接时控制锁
    BlueToothStatus: -1, // -1：初始未连接， 0：未连接成功，1：连接中，2：已连接，3：断开
    isBlueToothReady: false, // 蓝牙服务是否就绪
    deviceMacConnect: '', // 蓝牙接口使用的MAC，ios下为UUID
    btConnectTimeout: null, // 蓝牙连接成功后的延时
    isClickBlueConnect: false, // 是否点击了蓝牙连接
    isLastTimeBlueEnable: false //上一次的蓝牙授权
  },
  lifetimes: {
    attached: function() {
      this.blueToothInit();
    },
    detached: function() {
      if (this.data.BlueToothStatus == 2) {
        this.closeBLEConnection()
      }
      if (this.data.queryTimer != null) {
        clearInterval(this.data.queryTimer)
      }
      if (this.data.btConnectTimeout != null) {
        clearTimeout(this.data.btConnectTimeout)
      }
      this.setData({
        queryTimer: null,
        btConnectTimeout: null
      })
    },
  },
  pageLifetimes: {
    show: function() {
        this.checkBlueAuthorize();
    }
  },
  methods: {
    //*****固定方法，供外界调用****
    //当设备列表页切换到当前页面时，应该呈现的整体样式
    getCurrentMode() {
      let mode
      if (this.data.applianceData.onlineStatus == 0 || this.data.isQueryOffLine) {
        // 离线
        mode = CARD_MODE_OPTION.OFFLINE;
      } else {
        // 在线
        mode = CARD_MODE_OPTION.COLD;
      }
      return {
        applianceCode: this.data.applianceData.applianceCode,
        mode,
      }
    },
    //当设备列表页切换到当前页面时触发
    getActived() {
      console.log('lmn>>> applianceData=' + JSON.stringify(this.data.applianceData))
      console.log('lmn>>> addDeviceInfo=' + JSON.stringify(app.addDeviceInfo))
      // 通知外界更新界面
      this.triggerEvent('modeChange', this.getCurrentMode());
      // 刷新设备状态
      this.queryAndUpdateView()
      // 轮询状态
      let that = this
      let timer = setInterval(() => {
        if (that.data.isDeviceOnline && !that.data.controlLock) {
          that.queryAndUpdateView()
        }
      }, 3000)
      this.setData({queryTimer: timer})
    },
    //初始化卡片页，只执行一次
    initCard() {
      this.queryAndUpdateView()
    },
    queryAndUpdateView() {
      this.luaQuery().then((data) => {
        if (this.data.controlLock) {
          this.setData({isQueryOffLine: false})
        } else {
          this.setData({
            isQueryOffLine: false,
            status: data
          })
        }
        this.updateUI()
        console.log('lmn>>> rece(query back)::' + JSON.stringify(this.data.status))
      }).catch((error) => {
        this.setData({
          isQueryOffLine: true,
        })
      })
    },
    //*****固定方法，供外界调用****
    updateUI() {
      //更新界面
      wx.showNavigationBarLoading()
      this.triggerEvent('modeChange', this.getCurrentMode());
      //TO-DO
      if (this.data.applianceData.onlineStatus == 0 || this.data.isQueryOffLine) {
        this.setData({ // 离线
          isDeviceOnline: false
        })
      } else {
        this.setData({ // 在线
          isDeviceOnline: true
        })
      }
      wx.hideNavigationBarLoading()
    },
    controlDevice(data) {
      let json = data.detail;
      if (this.data.isDeviceOnline) {
        this.setData({controlLock: true})
        this.luaControl(json)
        .then((data)=>{
          this.setData({
            status: data,
            controlLock: false
          })
          console.log('lmn>>> rece(control back)::' + JSON.stringify(this.data.status))
        })
        .catch((error)=>{
          this.setData({controlLock: false})
        })
      } else if (this.data.BlueToothStatus == 2) {
        let binStr = protocolConversion.json2bin(json)
        this.sendBLEBinData(binStr)
      }
    },
    //查询设备状态并更新界面
    luaQuery() {
      return new Promise((resolve, reject) => {
        wx.showNavigationBarLoading()
        let reqData = {
          "reqId": getReqId(),
          "stamp": getStamp(),
          "applianceCode": this.data.applianceData.applianceCode,
          "command": {}
        }
        requestService.request("luaGet", reqData).then((resp) => {
          wx.hideNavigationBarLoading()
          if (resp.data.code == 0) {
            this.setData({
              status: resp.data.data
            })
            resolve(resp.data.data || {})
          } else {
            reject(resp)
          }
        }, (error) => {
          wx.hideNavigationBarLoading()
          console.error(error)
          reject(error)
        })
      })
    },
    //查询设备状态并更新界面
    luaControl(param) {
      console.log('lmn>>> send::' + JSON.stringify(param));
      return new Promise((resolve, reject) => {
        wx.showNavigationBarLoading()
        let reqData = {
          "reqId": getReqId(),
          "stamp": getStamp(),
          "applianceCode": this.data.applianceData.applianceCode,
          "command": {
            "control": param
          }
        }
        requestService.request("luaControl", reqData).then((resp) => {
          wx.hideNavigationBarLoading()
          if (resp.data.code == 0) {
            resolve(resp.data.data.status || {})
          } else {
            reject(resp)
          }
        }, (error) => {
          wx.hideNavigationBarLoading()
          wx.showToast({
            title: '设备未响应，请稍后尝试刷新',
            icon: 'none',
            duration: 2000
          })
          console.error(error)
          reject(error)
        })
      })
    },
    checkBlueAuthorize() {
      let that = this
      wx.getSetting({
          success (res) {
              let isBLEAuthorize = false
              if (res.authSetting['scope.bluetooth'] != undefined) isBLEAuthorize = res.authSetting['scope.bluetooth']
              console.log('lmn>>> 检查权限成功')
              that.onBlueAuthorizeChange({enable: isBLEAuthorize})
          },
          fail (res) {
              console.log('lmn>>> 检查权限失败')
          }
      })
    },
    /****************蓝牙 start*****************/
    blueToothInit() {
      if (this.data.isBlueToothReady) return
      let that = this
      // 打开蓝牙
      bluetooth.open().then((res) => {
        this.setData({isBlueToothReady: true})
      }).catch((err) => {
        this.setData({isBlueToothReady: false})
      });

      // 监听连接状态改变
      this.registerBLEConnectionStateChange(res => {
        if (!res.connected) { // 断开
          this.clearDataAfterBlueFail()
          wx.getBluetoothAdapterState({
            success (res) {
              if (!res.available) { // 已连接后被关了手机蓝牙
                that.setData({isBlueToothReady: false})
              }
            }
          })
        }
        console.log('lmn>>> BLEConnectionStateChange res=' +JSON.stringify(res))
      })

      // 监听校验绑定成功
      this.resisterOnBlebindSuccess(res => {
        // 蓝牙已连接
        // 为去抖动，延时一段时间再显示连接成功(模组配网状态下连上后会马上断开)
        let timeout = setTimeout(() => {
          that.setData({
            BlueToothStatus: 2,
            btConnectTimeout: null,
            isClickBlueConnect: false
          })
        }, 1000)
        this.setData({btConnectTimeout: timeout})
        console.log('lmn>>> bleNegotiation success, connected');

        // 监听数据接收
        this.resisterBleDataChanged((data, characteristic) => {
          this.registerBleData(data, characteristic, this)
        });

        this.getBLEDeviceServices(this.data.deviceMacConnect, 'FF90');
      })
      
      // 蓝牙连接失败
      this.resisterOnBlebindFail((error) => {
        console.log('lmn>>> ble bind error, connect fail', error);
        this.clearDataAfterBlueFail()
      })

      // 蓝牙连接失败
      this.resisterOnBleNegFail((error) => {
        console.log('lmn>>> ble negotiation error, connect fail', error);
        this.clearDataAfterBlueFail()
      })
    },
    // 蓝牙连接失败或断开后，清除数据
    clearDataAfterBlueFail() {
      if(this.data.btConnectTimeout != null) {
        clearTimeout(this.data.btConnectTimeout)
      }
      if (this.data.isClickBlueConnect) {
        this.setData({
          BlueToothStatus: 0,
          btConnectTimeout: null,
          isClickBlueConnect: false,
          status: {}
        })
      } else {
        this.setData({
          BlueToothStatus: 3,
          btConnectTimeout: null,
          status: {}
        })
      }
      this.closeBLEConnection()
      this.clearBlueData()
    },
    // 蓝牙重连前，清除ble-negotiation的状态数据
    clearBlueData() {
      this.setData({
        progress: 0,
        isEndon: false,
        connected: false,
        currentOrder: ''
      })
    },
    // 蓝牙权限改变
    onBlueAuthorizeChange(authorize) {
      if (authorize.enable) {
        console.log('lmn>>> 蓝牙权限开启')
        if (!this.data.isLastTimeBlueEnable) {
          this.blueToothInit()
        }
        this.setData({isLastTimeBlueEnable: true})
      } else {
        console.log('lmn>>> 蓝牙权限禁止')
        if (this.data.isLastTimeBlueEnable) {
          this.clearDataAfterBlueFail()
        }
        this.setData({
          isBlueToothReady: false,
          isLastTimeBlueEnable: false
        })
      }
    },
    async blueToothConnect() {
      await this.blueToothInit()
      console.log('lmn>>> bluetooth connect start');
      this.setData({
        BlueToothStatus: 1,
        isClickBlueConnect: true
      })

      let that = this
      // 监听搜索到目标设备时回调
      bluetooth.resisterFindedTargetDevice(this.data.applianceData.btMac, (deviceInfo) => {
        console.log('lmn>>> 目标设备 deviceInfo=' + JSON.stringify(deviceInfo));
        if (deviceInfo.deviceId != null) {
          that.setData({deviceMacConnect: deviceInfo.deviceId})
          // 连接蓝牙
          that.bleNegotiation(deviceInfo.deviceId, true, 1, 3)
        } else {
          if (that.data.isClickBlueConnect) {
            that.setData({
              BlueToothStatus: 0, 
              isClickBlueConnect: false
            })
          } else {
            that.setData({BlueToothStatus: 3})
          }
          if (deviceInfo.errCode == 10000) { // 蓝牙适配器未初始化
            that.setData({isBlueToothReady: false})
          }
        }
      })
      // 搜索设备
      console.log('lmn>>> discoverying device:' + this.data.applianceData.btMac);
      await bluetooth.discoveryDevice();
    },
    blueToothDisconnect() {
      this.closeBLEConnection()
    },
    registerBleData(data, characteristic, context) {
      let that = context;
      if (!characteristic.serviceId.includes("FF80")) {
        let parsedData = paesrBleResponData(data, app.globalData.bleSessionSecret);
        let jsonStatus = protocolConversion.bin2json(parsedData)
        console.log('lmn>>> rece BLE data=' + parsedData + '/json=' + JSON.stringify(jsonStatus));
        that.setData({status: jsonStatus})
      }
    },
    sendBLEBinData(order) {
      console.log('lmn>>> send BLE data=' + order);
      let parsedData = constructionBleControlOrder(order, app.globalData.bleSessionSecret);
      this.data.currentOrder = ab2hex(parsedData);
      this.getBLEDeviceServices(this.data.deviceMacConnect, 'FF90');
    },
    /****************蓝牙 end******************/
  },
})