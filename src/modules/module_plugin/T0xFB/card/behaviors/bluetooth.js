// const bleNegotiation = require('../../../../utils/ble/ble-negotiation')
const bleNegotiation = getApp().getGlobalConfig().bleNegotiation
const retryTimeLimit = 1 // 重连次数上限
const retryTime = 0 // 重连次数
import { ab2hex } from 'm-utilsdk/index'

module.exports = Behavior({
  behaviors: [bleNegotiation],
  properties: {},
  data: {
    isOpenBluetoothAdapter: false,
    bluetoothStatus: 0, // 0-未连接，1-连接成功，2-连接失败
  },
  methods: {
    // 建立蓝牙连接
    async bluetoothConnect(deviceId, platform,isRetry = false){
      console.log('建立蓝牙连接 开始',deviceId,platform,isRetry)
      if(!isRetry){
        let openResult = await this.open()
        console.log('打开蓝牙完成')
        console.log(openResult)
      }
      // 启动扫描
      let discoveryResult = await this.discoveryDevice()
      console.log('启动扫描蓝牙设备完成')
      console.log(discoveryResult)
      // 获取设备信息
      this.getBluetoothDevice(deviceId, platform).then(deviceInfo=>{
        console.log('getBluetoothDevice 蓝牙设备信息',deviceInfo)
        do{
          if(!deviceInfo){
            // 重试
            setTimeout(()=>{
              this.bluetoothConnect(deviceId, platform,true)
            },3000)
            break;
          }
          // 找到设备了，停止扫描
          this.stopDiscovery()

          // region 先绑定蓝牙事件
          this.resisterOnLinkBleSuccess((res) => {
            // 蓝牙连接成功
            console.log('蓝牙连接成功',res)
          })
          this.registerBLEConnectionStateChange((res) => {
            console.log('蓝牙连接状态改变',res)
            const {connected} = res
            this.setData({bluetoothStatus: connected?1:0})
          })

          this.resisterOnBlebindSuccess((res) => {
            //监听校验绑定成功
            console.log('监听校验绑定成功',res)
            // 这个才算连接流程完成
            this.setData({bluetoothStatus: 1})

            // 蓝牙获取数据监听
            // this.resisterBleDataChanged((data, characteristic) => {
            //   this.registerBleData(data, characteristic, this)
            // })
            //
            // 蓝牙写入服务
            // this.getBLEDeviceServices(deviceInfo.deviceId, 'FF90')
          })
          this.resisterOnBlebindFail((error) => {
            console.log('蓝牙连接失败', error)

            // 发起重连；配网后设备还是处于连接状态，所以要先断开一下
            if (retryTime < retryTimeLimit) {
              setTimeout(() => {
                wx.closeBLEConnection({
                  deviceId: deviceInfo.deviceId,
                  success: (res) => {
                    console.log('蓝牙断开连接 成功',res)
                  },
                })
              }, 5000)
            }
          })

          // endregion

          // 再进行云端校验和蓝牙连接
          let isDirectCon = true
          let moduleType = 1 //模组类型   0：ble 1:ble+wifi
          let negType = 3 // 确权类型  1:确权后绑定  2：强制下发绑定码 3：校验绑定码
          this.bleNegotiation(deviceInfo.deviceId, isDirectCon, moduleType, negType)
        }while (false)

      })
    },
    // 查找蓝牙设备
    getBluetoothDevice(deviceId, platform){
      console.log('建立蓝牙连接 开始')
      return new Promise((resolve, reject) => {
        wx.getBluetoothDevices({
          success: (res) => {
            console.log('获取到的设备')
            console.log(res.devices)
            if (!deviceId) {
              console.warn('搜索蓝牙设备缺少deviceId')
            }
            // 过滤设备列表中name带有modelType的设备
            // let modelNo = ab2hex(item.advertisData)
            if (deviceId) {
              deviceId = deviceId.toLowerCase()
            }
            console.log('目标设备: ' + deviceId)
            let scale = res.devices.find((item) => {
              // console.log('deviceId: ' + item.deviceId)
              let targetId = item.deviceId
              if (platform && platform === 'ios') {
                targetId = this.getMac(item.advertisData, 'ios')
              }
              // console.log('targetId: ' + targetId)
              // if(item.name.includes(modelType) || supportedSn8.includes(hexCharCodeToStr(modelNo.slice(6,22)))) {
              let itemDeviceId = targetId.replace(/:/g, '').toLowerCase()
              if (itemDeviceId === deviceId) {
                return item
              } else {
                return undefined
              }
            })

            console.log('scale:' + JSON.stringify(scale))
            if (scale) {
              // 根据获取到的设备的deviceid发起连接
              // this.connect(scale);
              // this.device = scale;
              resolve(scale)
            } else {
              // 没有找到设备
              console.log('没有找到设备')
              resolve(null)
            }
          },
          fail: (err) => {
            reject(err)
          },
          complete: (res) => {},
        })
      })
    },
    // 获取mac
    getMac(advertisData, platform) {
      console.log('过滤Mac', advertisData)
      let a = ''
      if (platform === 'ios') {
        advertisData = ab2hex(advertisData)
        console.log('getIosMacm advdata===', advertisData)
        a = advertisData.substr(42, 12).toUpperCase()
      } else {
        console.log('安卓过滤Mac', advertisData)
        a = advertisData.toUpperCase()
      }
      let b
      let arr = []
      for (let i = 0; i < a.length; i += 2) {
        arr.push(a.substr(i, 2))
      }
      if (platform === 'ios') {
        arr.reverse()
      }
      b = arr.join(':')
      console.log('转码', b)
      return b
    },
    // 初始化蓝牙模块
    open() {
      return new Promise((resolve, reject) => {
        wx.openBluetoothAdapter({
          success: (res) => {
            console.log('初始化蓝牙模块成功')
            console.log(res)
            this.setData({isOpenBluetoothAdapter: true})
            resolve(res)
            // this.discoveryDevice();
          },
          fail: (err) => {
            console.log('初始化蓝牙模块失败')
            console.error(err)
            reject(err)
          },
          complete: (res) => {
            console.log('初始化蓝牙模块1')
            console.log(res)
          },
        })
      })
    },
    // 扫描蓝牙设备
    discoveryDevice() {
      return new Promise((resolve, reject) => {
        wx.startBluetoothDevicesDiscovery({
          allowDuplicatesKey: false,
          success: (res) => {
            console.log('扫描蓝牙设备 成功',res)
          },
          complete: () => {
            // this.stopDiscovery();
            // console.log('设备列表')
            // this.getBluetoothDevice();
            resolve('搜索设备完成')
          },
        })
      })
    },
    // 停止扫描蓝牙设备
    stopDiscovery() {
      wx.stopBluetoothDevicesDiscovery({
        complete: (res) => {
          console.log('已停止蓝牙搜索')
        },
      })
    },
    // 关闭蓝牙模块
    close() {
      wx.closeBluetoothAdapter({
        success: (res) => {
          console.log('关闭蓝牙模块 成功')
          console.log(res)
          this.setData({isOpenBluetoothAdapter: false})
        },
        complete: (res) => {
          console.log('关闭蓝牙模块 完成')
          console.log(res)
        },
      })
    },
  }
})
