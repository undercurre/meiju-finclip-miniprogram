
// ArrayBuffer转16进度字符串示例
function ab2hex(buffer) {
  var hexArr = Array.prototype.map.call(
      new Uint8Array(buffer),
      function (bit) {
          return ('00' + bit.toString(16)).slice(-2)
      }
  )
  return hexArr.join('');
}

const hexCharCodeToStr = (hexCharCodeStr) => {
  var trimedStr = hexCharCodeStr.trim();
  var rawStr = trimedStr.substr(0, 2).toLowerCase() === "0x" ? trimedStr.substr(2) : trimedStr;
  var len = rawStr.length;
  if (len % 2 !== 0) {
      alert("存在非法字符!");
      return "";
  }
  var curCharCode;
  var resultStr = [];
  for (var i = 0; i < len; i = i + 2) {
      curCharCode = parseInt(rawStr.substr(i, 2), 16);
      resultStr.push(String.fromCharCode(curCharCode));
  }
  return resultStr.join("");
}

const supportedSn8 = ['000900DD', '6420010F', '6420010G'];

const bluetooth = {
  device: {},
  // 初始化蓝牙模块
  open() {
    return new Promise((resolve, reject) => {
      wx.openBluetoothAdapter({
        success: (res) => {
          console.log('初始化蓝牙模块成功');
          console.log(res);
          resolve(res)
          // this.discoveryDevice();
        },
        fail: (err) => {
          console.log('初始化蓝牙模块失败');
          console.error(err)
          reject(err);
        },
        complete: (res) => {
          console.log('初始化蓝牙模块1');
          console.log(res)
        },
      })
    })
  },
  // connectionListener() {
  //   wx.onBLEConnectionStateChange((res) => {
  //     console.log(`device ${res.deviceId} state has changed, connected: ${res.connected}`)
  //   })
  // },
  // characteristicListener(scale, serviceId, characteristicId) {

  //   wx.notifyBLECharacteristicValueChange({
  //     characteristicId,
  //     deviceId: scale.deviceId,
  //     serviceId,
  //     state: true,
  //     success: (res) => {
  //       console.log('订阅特征值成功')
  //       console.log(res);
  //     },
  //     complete: (res) => {
  //       console.log('订阅特征值完成')
  //       console.log(res);
  //     },
  //     fail: (err) => {
  //       console.log('订阅特征值失败')
  //       console.log(err);
  //     }
  //   })

  //   wx.onBLECharacteristicValueChange((res) => {
  //     console.log(`characteristic ${res.characteristicId} has changed, now is ${res.value}`);
  //     console.log(ab2hex(res.value));
  //   })
  // },
  getBLEDevice(deviceId) {
    return new Promise((resolve, reject) => {
      wx.getBLEDeviceServices({
        deviceId,
        success: (res) => {
          resolve(res.services)
        },
        fail: (err) => {
          reject(err);
        }
      })
    })
  },
  getCharacteristics(deviceId, serviceId) {
    return new Promise((resolve, reject) => {
      wx.getBLEDeviceCharacteristics({
        deviceId,
        serviceId,
        success: (res) => {
          resolve(res.characteristics)
        },
        fail: (err) => {
          reject(err);
        }
      })
    })
  },
  connect(scale) {
    let {deviceId} = scale;
    console.log('connect deviceId:' + deviceId);

    wx.createBLEConnection({
      deviceId,
      success: async (res) => {
        console.log('连接成功')
        console.log(res)

        // 完成连接后监听设备连接状态
        this.connectionListener();

        // 获取蓝牙设备所有服务
        let services = await this.getBLEDevice(deviceId);
        console.log('获取蓝牙设备所有服务');
        console.dir(services);

        for(let i of services) {
          let serviceId = i.uuid;

          // 获取蓝牙设备某个服务中所有特征值
          let characteristics = await this.getCharacteristics(deviceId, serviceId);
          console.log('获取蓝牙设备某个服务中所有特征值');
          console.dir(characteristics);

          for(let j of characteristics) {

            let characteristicId = j.uuid;

            // 完成连接后监听设备特征值变化
            this.characteristicListener(scale, serviceId, characteristicId);
          }
        }




      },
      complete: (res) => {
        console.log('连接完成')
        console.log(res)
      }
    })
  },
  getTargetScale(devices){
    return devices.find(item => {
      let modelNo = ab2hex(item.advertisData)
      if (item.name.includes('C0') || supportedSn8.includes(hexCharCodeToStr(modelNo.slice(6, 22)))) {
        return item;
      } else {
        return undefined;
      }
    });
  },
  getBluetoothDevice() {
    return new Promise((resolve, reject) => {

      wx.getBluetoothDevices({
        success: (res) => {
          console.log('获取到的设备');
          console.dir(res.devices);

          // 过滤设备列表中name带有C0的设备
          let scale = res.devices.find(item => {
            let modelNo = ab2hex(item.advertisData)
            console.log('设备SN8：'+modelNo);
            if(item.name.includes('C0') || supportedSn8.includes(hexCharCodeToStr(modelNo.slice(6,22)))) {
              return item;
            } else {
              return undefined;
            }
          });
          console.log('scale:' + JSON.stringify(scale));
          if(scale) {
            // 根据获取到的设备的deviceid发起连接
            // this.connect(scale);
            // this.device = scale;
            resolve(scale);
          } else {
            // 没有找到厨房秤
            console.log('没有找到厨房秤')
            resolve(undefined);
          }
          // wx.getSystemInfoAsync({
          //   success: (result) => {
          //     console.log('手机系统参数', result)
          //     const {platform} = result;
          //
          //   },
          // })
        },
        fail: (err) => {
          reject(err)
        },
        complete: (res) => {},
      })
    })
  },
  discoveryDevice() {
    return new Promise((resolve, reject) => {
      wx.startBluetoothDevicesDiscovery({
        allowDuplicatesKey: false,
        success: (res) => {
          console.log('找到设备')
          console.dir(res);
        },
        complete: () => {
          // this.stopDiscovery();
          console.log('设备列表');
          // this.getBluetoothDevice();
          resolve('搜索设备完成');
        }
      })
    })
  },
  stopDiscovery() {
    wx.stopBluetoothDevicesDiscovery({
      complete: (res) => {
        console.log('已停止蓝牙搜索')
      },
    })
  },
  close() {
    // 关闭蓝牙模块
    wx.closeBluetoothAdapter({
      complete: (res) => {
        console.log('关闭蓝牙模块')
        console.log(res)
      },
    })
  }
}

export default bluetooth;
