import {requestService} from '../../../../utils/requestService'
import {mockData} from '../../assets/js/mock/mockData'
import {
  getReqId,
  getStamp
} from 'm-utilsdk/index'
import DeviceStatus from '../../assets/js/model/DeviceStatus'
import Mode from '../../assets/js/model/Mode'
import ResultUtil from '../../assets/js/model/ResultUtil'
import { conditionsSatisfied } from '../condition'

const isMock = false
const STATE_OFFLINE = 0
const STATE_CONNECTING = 1
const STATE_CONNECTED = 2

module.exports = Behavior({
  data: {
    online: false,
    state: STATE_CONNECTING,
    deviceStatus: null
  },
  methods: {
    filterMode(modeKey, cloudmenuid) {

      function filter(mode) {
        if(mode.modeKey === 'auto_menu') {
          return parseInt(mode.cloudmenuid) === parseInt(cloudmenuid)
        }

        return !mode.shadowMode && mode.modeKey.split(',').indexOf(modeKey) > -1
      }

      const modesArr = Object.keys(this.data.pluginData.MODES).map((key) => this.data.pluginData.MODES[key])
      const modes =  modesArr.filter(filter)
      if(!modes.length) {
        return null
      }
      return new Mode(modes[0], this.data.pluginCommonData, this.data.pluginData.config);
    },
    getCurrentMode(snapshot) {
      const {work_mode, cloudmenuid} = snapshot
      if(!work_mode || work_mode === "ff") {
        return null
      } else {
        return this.filterMode(work_mode, cloudmenuid)
      }
    },
    dataQuery() {
      return new Promise((resolve, reject) => {
        if (isMock) {
            this.setData({
                status: mockData.luaGet.data
            })
            resolve(mockData.luaGet.data)
            return
        }
        let reqData = {
            "reqId": getReqId(),
            "stamp": getStamp(),
            "applianceCode": this.data.deviceInfo.applianceCode,
            "command": {}
        }
        requestService.request("luaGet", reqData).then(res => {
            if (res.data.code == 0) {
                resolve(res.data)
            } else {
                reject(res.data)
            }
        }, e => {
            const {data} = e
            reject(data)
        })
      })
    },

    renderingQuery(autoExecuteCallback = false) {
      this.resetTimestamp('renderingQueryTimestamp')
      return new Promise((resolve, reject) => {
          this.dataQuery()
          .then(res => {
              const {cbs_version} = res.data
              const resolveData = res
              if(autoExecuteCallback) {
                this.renderingQuerySuccessCallback(resolveData)                
              } else {
                this.updateStorageCbsVersion(cbs_version || '')
                console.log(`renderingQuery => 耗时：`, this.getTime('renderingQueryTimestamp'))
              }
              resolve(ResultUtil.success(resolveData))
          })
          .catch(e => {
              if(autoExecuteCallback) {
                this.renderingQueryFailCallback(e)
              }
              const msg = (e && e.msg) ? e.msg : e
              resolve(ResultUtil.fail(e, msg))
          })
      })
  },

  renderingQuerySuccessCallback(res) {
    const currentMode = this.getCurrentMode(res.data)
    let deviceStatus = new DeviceStatus(res.data, currentMode, this.data.pluginCommonData);
    // console.log('renderingQuery originalDeviceStatus', res.data.data)
    // console.log('renderingQuery deviceStatus', deviceStatus)        
    // console.log('renderingQuery deviceStatus cloudmenuid', cloudmenuid)        
    this.updateCurrentPageData([
      {
        method: 'resetScrollViewPosition', 
        params: deviceStatus
      },
      {
        method: 'updateDeviceStatus',
        params: deviceStatus
      },
      {
        method: 'setDeviceState',
        params: res
      },
      {
        method: 'bubbling'
      }
    ]);
  },

  renderingQueryFailCallback(e) {
    this.updateCurrentPageData([
      {
        method: 'setDeviceState',
        params: e
      },
      {
        method: 'bubbling'
      }
    ]);
  },

  getDeviceState(code) {
    let state = this.data.state
    if(code == 0) {
      this.heartbeatCount = 0
      state = STATE_CONNECTED
    }

    if(code == 1306) {
      ++this.heartbeatCount
      if(this.heartbeatCount > 3) {
        state = STATE_CONNECTING
      }
    }

    if(code == 1307) {
      this.heartbeatCount = 0
      state = STATE_OFFLINE
    }
    // console.log('-----------')
    // console.log('getDeviceState code', code)
    // console.log('getDeviceState heartbeatCount', this.heartbeatCount)
    // console.log('-----------')

    return state
  },

  updateDeviceStatus(deviceStatus) {
    this.setData({
      deviceStatus
    })
  },

  setDeviceState(res) {

    if(!res || res.code == undefined) {
      return
    }
    const code = res.code

    if(typeof this.heartbeatCount === 'undefined') {
      this.heartbeatCount = 0
    }

    let state = this.getDeviceState(code)
    this.setData({
      state,
      online: state === STATE_CONNECTED
    })
  },

  updateCurrentPageData(callbacks) {
    const currentPage  = this.getCurrentPage();

    for(let item of callbacks) {
      if(currentPage[item.method]) {
        currentPage[item.method](item.params)
      }
    }
  },

    luaControl(params) {
      //查询设备状态并更新界面
      return new Promise((resolve, reject) => {
          // wx.showNavigationBarLoading()
          if (isMock) {
              resolve(mockData.luaControl.data.status)
              return
          }
          let reqData = {
              "reqId": getReqId(),
              "stamp": getStamp(),
              "applianceCode": this.data.deviceInfo.applianceCode,
              "command": {
                  "control": params
              }
          }
          requestService.request("luaControl", reqData).then((resp) => {
              // wx.hideNavigationBarLoading()
              if (resp.data.code == 0) {
                  this.analyseResponse(resp.data.data.status)
                  this.renderingQuery(true)
                  resolve(resp.data.data.status || {})
              } else {
                  reject(resp)
              }
          }, (error) => {
              // wx.hideNavigationBarLoading()
              wx.showToast({
                  title: '网络异常，请稍后重试',
                  icon: 'none',
                  duration: 2000
              })

              console.error(error)
              reject(error)
          })
      })
    },

    analyseResponse(snapshot) {
      console.log('analyseResponse')
      const { responseAnalysis } = this.data.pluginCommonData
      const currentMode = this.getCurrentMode(snapshot)
      const deviceStatus = new DeviceStatus(snapshot, currentMode, this.data.pluginCommonData)

      if(!responseAnalysis || !responseAnalysis.length) {
        return
      }

      for(let item of responseAnalysis) {
        const { text, conditions } = item
        if(conditionsSatisfied(deviceStatus, conditions)) {
          this.showModal(text)
        }
      }
    },

    controlDeviceWithMultipleSteps(cookingJson, menuCode = null) {
      const cloudMenuIdLuaKey = "cloudmenuid"
      let params = {
        totalstep: cookingJson.length,
        stepnum_start: "1", // required
        cookings: JSON.stringify(cookingJson)
      };

      // 多段必须设置
      params[cloudMenuIdLuaKey] = menuCode || cookingJson[0][cloudMenuIdLuaKey]

      console.log('cookingParams', params)

      this.luaControl(params)
      .then(res => {
        console.log('controlDeviceWithMultipleSteps res ', res)
      })
      .catch(e => {
        console.log('controlDeviceWithMultipleSteps e ', e)
      })
    }
  }
});