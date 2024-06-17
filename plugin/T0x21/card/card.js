import { CARD_MODE_OPTION } from '../../../pages/common/js/cardMode'
import { getReqId, getStamp, getUID } from 'm-utilsdk/index'
import { requestService } from '../../../utils/requestService'
import { imageApi } from '../../../api'
import { zDeviceList } from 'assets/js/zDeviceList'
import { zLockConfig } from 'assets/js/zConfigMapping'

import { parseEventLock } from 'assets/js/zUtil'

const isMock = false
const app = getApp() //获取应用实例

Component({
  options: {
    multipleSlots: true, // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    applianceData: {
      type: Object,
      value: {},
    },
  },
  data: {
    //*****固定方法，供外界调用****
    isInit: false,
    isQueryOffLine: false,

    // **** 本页面数据 ****
    // 设备基本信息
    deviceInfo: {
      nodeid: '',
      modelid: '',
      masterId: '',
    },
    // 设备状态数据
    status: {
      passcode: '',
      logsArray: [],
      endlist: [],
    },
    lockshowTemPassword: false, //门锁页面弹窗遮罩层
    // 传给组件
    wrapDate: {
      logsArray: [],
    },

    // 子设备组件类型
    zComponentType: 'zBlank',

    // 图片

    icons: {
      header: [
        imageApi.getImagePath.url + '/0x21/lock_img@3x.png',
        imageApi.getImagePath.url + '/0x21/socket_img@3x.png',
        imageApi.getImagePath.url + '/0x21/switch_1@3x.png',
        imageApi.getImagePath.url + '/0x21/switch_2@3x.png',
        imageApi.getImagePath.url + '/0x21/switch_3@3x.png',
        imageApi.getImagePath.url + '/0x21/switch_4@3x.png',
      ],
    },
    headerIndex: '',
  },
  methods: {
    /**
     * 固定方法，供外界调用
     * @fun: getCurrentMode() 当前模式，用来更换背景
     * @fun: initCard() 初始化卡片页，只执行一次，切换卡片不会执行
     * @fun: getActived() 切换到当前卡片页的时候执行
     * @fun: updateUI() 固定方法，供外界调用 ？？
     * */
    // 当设备列表页切换到当前页面时，应该呈现的整体样式
    getCurrentMode() {
      let mode
      if (this.data.applianceData.onlineStatus == 0 || this.data.isQueryOffLine) {
        // 离线
        mode = CARD_MODE_OPTION.OFFLINE
      } else {
        // 在线
        mode = CARD_MODE_OPTION.COLD
      }
      return {
        applianceCode: this.data.applianceData.applianceCode,
        mode,
      }
    },
    // 初始化卡片页，只执行一次，切换卡片不会执行
    initCard() {
      // console.log('%cInit Card', 'color:red;font-weight:bold')
      this.getSwitchData().then(() => {
        if (!this.data.isInit) {
          this.dataReady()
            .then((data) => {
              this.setData({
                isInit: true,
              })
              // this.temperatureTextremity();
              // this.tipsSet();
              setTimeout(() => {
                this.updateUI()
              }, 100)
            })
            .catch((error) => {
              this.setData({
                isInit: true,
              })
            })
        }
      })
    },
    // 当设备列表页切换到当前页面时触发
    getActived() {
      // console.log('%cGet Actived', 'color:red;font-weight:bold')
      // console.log('this.data.applianceData：')
      // console.log(this.data.applianceData);
      // console.log('---------------------------------------')

      // 请求完新版本信息的回调
      // 通知外界更新界面
      this.triggerEvent('modeChange', this.getCurrentMode())

      //
      // 刷新设备状态
      this.getSwitchData().then(() => {
        this.dataReady()
          .then((data) => {
            // 激活时再次刷新在线离线状态
            this.setData({ isQueryOffLine: false })
            this.updateUI()
          })
          .catch((error) => {
            if (error && error.data && error.data.code == 1306) {
              // 1306处理
              wx.showToast({
                title: '设备未响应，请稍后尝试刷新',
                icon: 'none',
                duration: 2000,
              })
            }
            if (error && error.data && error.data.code == 1307) {
              //离线
              this.setData({ isQueryOffLine: true })
            }
          })
      })
    },
    //门锁弹窗
    lockPop(value) {
      this.setData({
        lockshowTemPassword: value.detail ? false : true,
      })
    },
    // 更新界面
    updateUI() {
      // console.log('%cUpdate UI', 'color:red;font-weight:bold')
      wx.showNavigationBarLoading()
      this.triggerEvent('modeChange', this.getCurrentMode())

      // code here
      let _curModelNumber = this.data.applianceData.modelNumber + ''
      for (let item in zDeviceList) {
        // 判断当前设备属于什么类型设备
        let _arry = zDeviceList[item]
        if (~_arry.indexOf(_curModelNumber)) {
          this.setData({ zComponentType: item })

          // 获取剩余数据
          // 门锁
          if (this.data.zComponentType == 'zLOCK') {
            this.setData({
              headerIndex: 0,
            })
            //获取用户信息
            this.lockGetUserInfo().then((userData) => {
              let _userInfos = userData.data.data.userInfos || []
              // 获取日志
              this.lockGetLog().then((logData) => {
                const _logData = JSON.parse(logData.returnData)
                let _logs = _logData.result.logs || []
                let _logsShow = []

                // 处理日志
                for (const [index, log] of _logs.entries()) {
                  const time = log.reportAt
                  log.info.logDescription.forEach((item) => {
                    _logsShow.push({ time, desc: item })
                  })
                }

                // TODO: 传给组件显示,设置头部图片
                this.setData({
                  'status.logsArray': _logsShow,
                  'status.showTemPassword': false,
                })
                // console.log(this.data.wrapDate)
              })
            })
          } else if (this.data.zComponentType == 'zSocket') {
            this.setData({
              headerIndex: 1,
            })
            //获取功率
            //console.log(this.data.deviceInfo)
            this.socketGetPowerStatus().then((powerData) => {
              this.setData({
                'status.endlist[0].event.Power': powerData.data.data.endlist[0].event.Power,
              })
            })
          } else if (this.data.zComponentType == 'zSwitch') {
            //获取设备列表信息
            this.setData({
              'status.endlist': this.data.deviceInfo.endlist,
            })
            let length = this.data.status.endlist.length
            switch (length) {
              case 1:
                this.setData({ headerIndex: 2 })
                break
              case 2:
                this.setData({ headerIndex: 3 })
                break
              case 3:
                this.setData({ headerIndex: 4 })
                break
              case 4:
                this.setData({ headerIndex: 5 })
                break
            }
          }
          return
        }
      }
      wx.hideNavigationBarLoading()
    },
    //
    /************** 固定方法，供外界调用 OVER **************/

    // 透传查询状态
    getStatusTransport() {
      return new Promise((resolve, reject) => {
        let _param = {
          topic: '/subdevice/get_status',
          command: {
            type: 1,
            nodeid: this.data.deviceInfo.nodeid,
          },
        }

        this.callGatewayTransport(_param).then(
          (resp) => {
            //
            this.setData({
              status: resp.data.data,
            })
            resolve(resp)
          },
          (error) => {
            //
            reject(error)
          }
        )
      })
    },

    // 子设备透传查询状态测试
    dataReady() {
      return new Promise((resolve, reject) => {
        wx.showNavigationBarLoading()
        this.triggerEvent('modeChange', this.getCurrentMode())

        // 获取状态
        this.getStatusTransport().then(
          (data) => {
            wx.hideNavigationBarLoading()
            // console.log("============ gatewayTransport - success")
            // console.log(data)
            this.setData({
              status: data.data.data,
            })
            //
            resolve(data)
          },
          (error) => {
            wx.hideNavigationBarLoading()
            console.log('============ gatewayTransport - error', error)
            // console.error(error)

            //
            reject(error)
          }
        )
      })
    },

    // ---------------- 门锁方法  START ------------
    // 获取门锁用户信息 - 解析日志需要用户信息
    lockGetUserInfo() {
      return new Promise((resolve, reject) => {
        let _param = {
          topic: '/subdevice/lock/user/list',
          command: {
            nodeid: this.data.deviceInfo.nodeid, // 这里是小写的nodeId
          },
        }
        this.callGatewayTransport(_param).then(
          (resp) => {
            // console.log('============ gatewayTransport - get user info success')
            // console.log(resp)
            //
            resolve(resp)
          },
          (error) => {
            console.log('============ gatewayTransport - get user info error')
            console.error(error)
            //
            reject(error)
          }
        )
      })
    },

    // 查询门锁日志
    lockGetLog() {
      return new Promise((resolve, reject) => {
        let _param = {
          proType: '0x16',
          stamp: getStamp(),
          uid: getUID(),
          reqId: getReqId(),
          param: {
            handleType: '/subdevice/logging/list',
          },
          data: {
            applianceId: this.data.applianceData.masterId,
            nodeId: this.data.deviceInfo.nodeid,
            modelId: this.data.deviceInfo.modelid,
            loggingType: 2,
            count: 50,
            houseId: app.globalData.currentHomeGroupId,
            userId: app.globalData.userData.iotUserId,
            msgId: getStamp(),
          },
        }
        this.callRequestDataTransmit(_param).then(
          (resp) => {
            console.log('============ callRequestDataTransmit - get log success')
            console.log(resp)
            resolve(resp)
          },
          (error) => {
            console.log('============ callRequestDataTransmit - get log error')
            // console.error(error)
            //
            reject(error)
          }
        )
      })
    },
    //门锁密码
    lockGetTempPassword() {
      wx.showNavigationBarLoading()
      return new Promise((resolve, reject) => {
        let settedExpired = 10
        let _param = {
          topic: '/subdevice/unlock/generate',
          command: {
            username: 'TempUser', // 名称，
            expire: settedExpired * 60, // 有效时间 秒
            nodeid: this.data.deviceInfo.nodeid,
          },
        }

        this.callGatewayTransport(_param).then(
          (resp) => {
            // console.log("============ gatewayTransport - get temp pwd success")
            // console.log(resp.data.data)
            this.setData({
              'status.passcode': resp.data.data.passcode,
            })
            //
            // console.log('最新密码：' + resp.data.data.passcode)
            // console.log('最新id：' + resp.data.data.deviceId)
            wx.hideNavigationBarLoading()
            resolve(resp)
          },
          (error) => {
            wx.showToast({
              title: '生成密码出错',
              icon: 'none',
              duration: 2000,
            })
            wx.hideNavigationBarLoading()
            console.log('============ gatewayTransport - get temp pwd error')
            // console.error(error)
            //
            reject(error)
          }
        )
      })
    },
    // ---------------- 门锁方法  OVER -------------

    // ---------------- 面板方法  START ------------
    // 面板透传开关测试
    switchControlPowerToggle(num) {
      wx.showNavigationBarLoading()
      let _num = JSON.stringify(num)
      _num = JSON.parse(_num)
      // console.log(_num)
      let powerNum = parseInt(this.data.status.endlist[_num.detail - 1].event.OnOff) ? 0 : 1
      // console.log(powerNum)
      let _param = {
        applianceCode: this.data.applianceData.masterId,
        homegroupId: app.globalData.currentHomeGroupId,
        reqId: getReqId(),
        stamp: getStamp(),
        uid: getUID(),
        command: {},
        order: {
          applianceCode: this.data.applianceData.masterId,
          topic: '/subdevice/control',
          command: {
            modelid: this.data.deviceInfo.modelid,
            nodeid: this.data.deviceInfo.nodeid,
            endlist: [
              {
                endpoint: _num.detail,
                event: {
                  OnOff: powerNum,
                },
              },
            ],
          },
        },
      }
      // console.log('_param:' + JSON.stringify(_param))
      requestService.request('gatewayTransport', _param).then(
        (resp) => {
          wx.hideNavigationBarLoading()
          // console.log(resp.data.data.data)
          let temp_str = 'status.endlist[' + (_num.detail - 1) + '].event.OnOff'
          this.setData({
            [temp_str]: powerNum,
          })
          if (resp.data.code == 0) {
            //
          } else {
            //
          }
        },
        (error) => {
          wx.hideNavigationBarLoading()
          console.error(error)
        }
      )
    },
    // ---------------- 面板方法  OVER -------------

    //------------------智能插座方法 ---------------
    /**
     *  【智能插座控制开关】
     * */
    socketControlPowerToggle() {
      wx.showNavigationBarLoading()
      // 根据当前开关设置值
      let _val = this.data.status.endlist[0].event.OnOff ? 0 : 1
      return new Promise((resolve, reject) => {
        let _param = {
          topic: '/subdevice/control',
          command: {
            nodeid: this.data.deviceInfo.nodeid,
            endlist: [{ endpoint: 1, event: { OnOff: _val } }],
          },
        }

        this.callGatewayTransport(_param).then(
          (resp) => {
            // console.log("============ gatewayTransport - socket power success")
            // console.log(resp)
            this.setData({
              'status.endlist[0].event.OnOff': _val,
            })
            //
            resolve(resp)
            wx.hideNavigationBarLoading()
          },
          (error) => {
            console.log('============ gatewayTransport - socket power error')
            // console.error(error)
            //
            wx.hideNavigationBarLoading()
            reject(error)
          }
        )
      })
    },

    /**
     *  【智能插座获取当前功率】
     *
     *  返回值里面，event: {Alarm: 0, AccumulatedPower: 3099, OnOff: 1, Power: 1006 }    power就是功率
     * */
    socketGetPowerStatus() {
      return new Promise((resolve, reject) => {
        let _param = {
          topic: '/subdevice/read_attr',
          command: {
            nodeid: this.data.deviceInfo.nodeid, // 这里是小写的nodeId
            type: 1,
            endlist: [{ endpoint: 1, event: ['Power'] }],
          },
        }

        this.callGatewayTransport(_param).then(
          (resp) => {
            // console.log("============ gatewayTransport - get power_status success")
            // console.log(resp)
            //
            resolve(resp)
          },
          (error) => {
            console.log('============ gatewayTransport - get power_status error')
            // console.error(error)
            //
            reject(error)
          }
        )
      })
    },

    //------------------智能插座方法   OVER ---------------

    /**
     * 【获取基本信息】
     * 1 透传接口需要用到的 deviceInfo.nodeid 和 deviceInfo.modelid 都要从这里拿
     * */
    getSwitchData() {
      let reqData = {
        homegroupId: app.globalData.currentHomeGroupId,
        applianceCode: this.data.applianceData.applianceCode,
        stamp: +new Date(),
        reqId: +new Date(),
      }
      return new Promise((resolve, reject) => {
        requestService
          .request('gatewayDeviceGetInfo', reqData)
          .then((res) => {
            let _data = res.data.data.data
            // Object.assign(this.data.deviceInfo, _data);
            this.setData({ deviceInfo: _data })
            // console.log("%cgatewayDeviceGetInfo success", 'color:blue')
            // console.log(this.data.deviceInfo)

            resolve()
          })
          .catch((err) => {
            reject()
            console.log('%cgatewayDeviceGetInfo error', 'color:blue')
            // console.log(err)
          })
      })
    },

    /**
     * 子设备通用透传方法
     */
    callGatewayTransport(param) {
      // req
      let reqData = {
        applianceCode: this.data.applianceData.masterId,
        homegroupId: app.globalData.currentHomeGroupId,
        reqId: getReqId(),
        stamp: getStamp(),
        uid: getUID(),
        command: {},
        order: {
          applianceCode: this.data.applianceData.masterId,
          modelid: this.data.deviceInfo.modelid,
          topic: param.topic,
          command: param.command,
        },
      }
      //
      return new Promise((resolve, reject) => {
        requestService.request('gatewayTransport', reqData).then(
          (resp) => {
            let _data = resp.data
            if (_data.code == 0) {
              resolve(_data.data || {})
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
    callRequestDataTransmit(params = { queryStrings: {}, transmitData: {} }) {
      return new Promise((resolve, reject) => {
        requestService.request('MzTransmit', params).then(
          (resp) => {
            let _data = resp.data
            if (_data.code == 0) {
              resolve(_data.data || {})
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
  },
})
