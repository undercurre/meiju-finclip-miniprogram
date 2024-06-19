// pages/T0xC0/T0xC0.js

import { imageDomain } from '../assets/scripts/api'

const app = getApp()

const rangersBurialPoint = app.getGlobalConfig().rangersBurialPoint
import {
  locationdevice,
  hexToBinArray,
  inArray,
  hexCharCodeToStr,
  hexStringToArrayBuffer,
  delay,
  hex2bin,
  checkLogoAndType,
  formatStr,
  ab2hex,
} from './js/utils'
import { getReqId, getUID, getStamp } from 'm-utilsdk/index'
import SendOrder from './js/SendOrder.js'

import bluetooth from './js/bluetooth'
import State from './js/state'
let C0State = new State()

const bleNegotiation = app.getGlobalConfig().bleNegotiation
const registerBLEConnectionStateChange = app.getGlobalConfig().registerBLEConnectionStateChange
const paesrBleResponData = app.getGlobalConfig().paesrBleResponData
const constructionBleControlOrder = app.getGlobalConfig().constructionBleControlOrder
import { UI } from '../assets/scripts/ui'
var sender = new SendOrder()

const connectState = {
  idle: 0,
  searching: 1,
  connecting: 2,
  connected: 3,
  fail: 4,
}

const retryTimeLimit = 1 // 重连次数上限
const retryTime = 0 // 重连次数

let loadingDotTimer = null
let connectBluetoothTimer = null

Component({
  behaviors: [bleNegotiation, registerBLEConnectionStateChange],
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    applianceData: {
      type: Object,
      value: function () {
        return {}
      },
    },
  },
  data: {
    // region 2021.10.19 敖广骏
    circleSrc: imageDomain + '/0xC0/bg-disabled.png',
    iconUrl: {
      pressTip: imageDomain + '/0xC0/img-press-tip.png',
      search: imageDomain + '/0xC0/icon-bluetooth-search.png',
      alert: imageDomain + '/0xC0/icon-alert.png',
      switchBtn: imageDomain + '/0xC0/icon-switch.png',
    },
    loadingDot: '...',
    connectedHeader: {
      icon: undefined,
      text: '请将物品放置称上',
    },
    isOverWeight: false,
    // endregion

    // region 2021.10.19 之前
    // circleSrc: imageDomain + '/0xF1/circle-yellow.png',
    headerImg: './assets/device.png',
    leftArrow: './assets/left.png',
    rightArrow: './assets/right.png',
    currentUnit: '克', // 克和盎司
    currentWeight: '00.0',
    battery: 255,
    // 蓝牙配网
    connectProgress: 0,
    connectState: connectState,
    device: {
      deviceId: 0,
    },
    // endregion
  },
  methods: {
    // region 2021.10.19 敖广骏
    destroyPlugin() {
      loadingDotTimer = null
    },
    setConnectProgress(stateValue) {
      let circleSrc = this.data.circleSrc
      let loadingDot = ''
      switch (stateValue) {
        case connectState.idle:
          break
        case connectState.searching:
        case connectState.connecting:
          if (loadingDotTimer) {
            clearInterval(loadingDotTimer)
          }
          loadingDotTimer = setInterval(() => {
            do {
              if (loadingDot.length > 2) {
                loadingDot = ''
              }
              loadingDot += '.'
            } while (false)
            this.setData({
              loadingDot: loadingDot,
            })
          }, 1000)
          circleSrc = imageDomain + '/0xC0/bg-running.png'
          break
        case connectState.connected:
          circleSrc = imageDomain + '/0xC0/bg-running.png'
          break
        case connectState.fail:
          circleSrc = imageDomain + '/0xC0/bg-disabled.png'
          break
      }
      this.setData({
        circleSrc,
        connectProgress: stateValue,
      })
    },
    // endregion
    onDisconnect(res) {
      console.log(res)
    },
    // getCurrentMode() {
    //   // return CARD_MODE_OPTION.HEAT

    //   return {
    //     applianceCode: this.data.applianceData.applianceCode,
    //     mode: CARD_MODE_OPTION.HEAT,
    //   }
    // },
    async blueToothConnect() {
      console.log('connect bluetooth')
      // this.setData({
      //   useBlePage: true,
      //   bleConnectStatus: 2
      // });

      // 连接前准备
      try {
        // 打开蓝牙
        let openResult = await bluetooth.open()

        // 搜索设备
        this.setConnectProgress(this.data.connectState.searching)
        // this.setData({
        //   connectProgress: this.data.connectState.searching
        // })
        let discoveryResult = await bluetooth.discoveryDevice()
        console.log('搜索设备完成')
        console.dir(discoveryResult)

        let firstDetective = await bluetooth.getBluetoothDevice()
        console.log('第一次搜索')
        console.log(firstDetective)
        if (firstDetective) {
          this.bluetoothCreatedInit(firstDetective)
        } else {
          // 10秒后连接失败初始化操作
          if (connectBluetoothTimer) {
            clearTimeout(connectBluetoothTimer)
          }
          connectBluetoothTimer = setTimeout(() => {
            bluetooth.stopDiscovery()
            bluetooth.close()
            this.blueToothConnect()
          }, 10000)

          // 停止搜索
          wx.onBluetoothDeviceFound((res) => {
            console.log('监听搜索情况')
            console.log(res)
            let scale = bluetooth.getTargetScale(res.devices)
            if (scale) {
              clearTimeout(connectBluetoothTimer)
              bluetooth
                .getBluetoothDevice()
                .then((deviceInfo) => {
                  this.bluetoothCreatedInit(deviceInfo)
                })
                .catch((err) => {
                  console.error('连接失败', err)
                  this.setConnectProgress(this.data.connectState.fail)
                })
            }
          })
        }
      } catch (error) {
        console.error('连接失败', error)
        this.setConnectProgress(this.data.connectState.fail)
        // this.setData({
        //   connectProgress: this.data.connectState.fail
        // })
      }
    },

    // 连接设备
    bluetoothCreatedInit(deviceInfo) {
      if (this.data.connectProgress !== this.data.connectState.connecting) {
        // 设备信息
        bluetooth.stopDiscovery()
        wx.offBluetoothDeviceFound(() => {})
        this.data.deviceInfo = deviceInfo
        this.setConnectProgress(this.data.connectState.connecting)
        // this.setData({
        //   connectProgress: this.data.connectState.connecting
        // })

        this.registerBLEConnectionStateChange((res) => {
          console.log('c0 disconnect')
          console.log(res)
          if (!res.connected) {
            this.setConnectProgress(this.data.connectState.fail)
            // this.setData({
            //   connectProgress: this.data.connectState.fail
            // })
          } else {
            this.setData({
              hasFoundDevice: true,
            })
          }
        })

        this.resisterOnBlebindSuccess((res) => {
          //监听校验绑定成功
          console.log('bleNegotiation success')

          // 蓝牙已连接
          this.setConnectProgress(this.data.connectState.connected)
          // this.setData({
          //   connectProgress: this.data.connectState.connected
          // })

          this.resisterBleDataChanged((data, characteristic) => {
            // console.log('C0接收到的数据' + data)
            this.registerBleData(data, characteristic, this)
          })

          this.getBLEDeviceServices(deviceInfo.deviceId, 'FF90')
        })
        this.resisterOnBlebindFail((error) => {
          console.log('bleNegotiation error', error)
          // 蓝牙连接失败
          this.setConnectProgress(this.data.connectState.fail)
          // this.setData({
          //   connectProgress: this.data.connectState.fail
          // })

          // 发起重连；配网后设备还是处于连接状态，所以要先断开一下
          if (retryTime < retryTimeLimit) {
            setTimeout(() => {
              wx.closeBLEConnection({
                deviceId: deviceInfo.deviceId,
                success: (res) => {
                  // this.bleNegotiation(deviceInfo.deviceId, true, 0, 3)
                  //
                  // this.setData({
                  //   connectProgress: this.data.connectState.connecting
                  // })
                },
              })
            }, 5000)
          }
        })

        let isDirectCon = true
        let moduleType = 0 //模组类型   0：ble 1:ble+wifi
        let negType = 3 // 确权类型  1:确权后绑定  2：强制下发绑定码 3：校验绑定码
        this.bleNegotiation(deviceInfo.deviceId, isDirectCon, moduleType, negType)
      }
    },

    registerBleData(data, characteristic, context) {
      console.log('registerBleData', data)
      let that = this
      if (!characteristic.serviceId.includes('FF80')) {
        let reqData = {
          encryptOrder: formatStr(data),
          reqId: getReqId(),
          stamp: getStamp(),
        }

        let parsedData = paesrBleResponData(data, app.globalData.bleSessionSecret)

        // 更新设备状态
        C0State.updateHex(formatStr(parsedData))
        let weight = C0State.getState('weight')
        let battery = C0State.getState('battery_percent')
        let weight_unit = C0State.getState('weight_unit')
        let status_back = C0State.getState('status_back')

        this.setData({
          currentUnit: weight_unit == 0 ? '克' : '盎司',
        })

        let isOverWeight = false
        if (this.data.currentUnit == '盎司') {
          weight = Math.floor(weight * 0.035274 * 100) / 1000
          weight = weight.toString()
          weight = weight.substring(0, weight.indexOf('.') + 2)
          if (weight >= 176) {
            isOverWeight = true
            weight = '176.0'
          } else {
            isOverWeight = false
          }
        } else {
          weight = (weight / 10).toString()
          if (Number(weight) >= 5000) {
            isOverWeight = true
            weight = '5000.0'
          } else {
            isOverWeight = false
          }
        }
        // 判断是否超过量程
        let connectedHeader = this.data.connectedHeader
        let circleSrc = this.data.circleSrc
        if (isOverWeight) {
          connectedHeader.icon = imageDomain + '/0xC0/icon-error.png'
          connectedHeader.text = '已超过厨房秤最大量程'
          circleSrc = imageDomain + '/0xC0/bg-error.png'
        } else {
          connectedHeader.icon = undefined
          connectedHeader.text = '请将物品放置称上'
          circleSrc = imageDomain + '/0xC0/bg-running.png'
        }
        // 判断重量为0，重置显示数值
        if (weight == 0) {
          weight = '00.0'
        }
        this.setData({
          battery,
          isOverWeight,
          connectedHeader,
          circleSrc,
          currentWeight: status_back == 3 ? '-' + weight : weight,
        })
      }
    },
    ab2str(buf) {
      return String.fromCharCode.apply(null, new Uint8Array(buf))
    },
    controlOrder(order) {
      // let order = 'aa24ac0000000000000240434e147f7fff4000000000000000000000008000000000e9cce7'
      // this.showLoading();
      console.log(order)
      let reqData = {
        order: formatStr(order),
        reqId: getReqId(),
        stamp: getStamp(),
      }

      let parsedData = constructionBleControlOrder(order, app.globalData.bleSessionSecret)
      console.log(ab2hex(parsedData))
      this.data.currentOrder = ab2hex(parsedData)
      this.getBLEDeviceServices(this.data.deviceInfo.deviceId, 'FF90')

      // requestService.request("blueEncryptOrder", reqData).then(resp => {
      //   console.log("返回加密控制指令为", resp.data.data)
      //   this.data.currentOrder = resp.data.data.encryptOrder.replace(/,/g, '')
      //   this.getBLEDeviceServices(this.data.deviceInfo.deviceId, 'FF90');
      //   // this.hideLoading();
      // })
    },
    cUnit() {
      console.log('changeUnit')
      // 更改单位
      if (this.data.currentUnit == '克') {
        this.setData({
          currentUnit: '盎司',
        })
        this.controlOrder('aa0ec000000000000002000001002f')
      } else {
        this.setData({
          currentUnit: '克',
        })
        this.controlOrder('aa0ec0000000000000020000000030')
      }
    },
    clearWeight() {
      do {
        // 清除重量
        if (this.data.connectProgress !== connectState.connected) {
          UI.toast('设备连接中，请稍等')
          break
        }
        console.log('clearWeight')
        this.controlOrder('aa0ec000000000000002000100002f')
      } while (false)
    },
    // 埋点
    rangersBurialPointClick(eventName, param) {
      let deviceInfo = this.data.deviceInfo
      if (deviceInfo) {
        let paramBurial = {}
        let paramBase = {
          module: '插件',
          apptype_name: '厨房秤',
          deviceInfo: {
            widget_cate: deviceInfo.type,
            sn8: deviceInfo.sn8,
            a0: deviceInfo.modelNumber,
            iot_device_id: deviceInfo.applianceCode,
          },
        }
        paramBurial = Object.assign(paramBase, param)
        rangersBurialPoint(eventName, paramBurial)
      }
    },
  },
  lifetimes: {
    attached() {
      // this.setConnectProgress(1);
      let param = {}
      param['page_name'] = '首页'
      param['object'] = '进入插件页'
      this.rangersBurialPointClick('plugin_page_view', param)
      this.blueToothConnect()
    },
    detached() {
      bluetooth.close()
      this.destroyPlugin()
    },
  },
})
