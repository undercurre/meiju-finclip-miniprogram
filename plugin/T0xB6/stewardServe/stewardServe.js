// plugin/T0xB6/stewardServe/stewardServe.js
import { requestService } from '../../../utils/requestService'
import { pluginEventTrack } from '../../../track/pluginTrack.js'
import images from '../card/assets/js/img'
import cardMode from '../../../pages/common/js/cardMode'
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    clockScale: new Array(60),
    cleanMode: [
      {
        name: '风机洁净度',
        num: '100%',
        time: '0',
        advice:
          '请注意累计运行时长打15小时建议启动烟机内部清洗功能。自清洁结束后务必记得倒油杯。如长期未使用内部清洁功能，需深层清洁。',
      },
      {
        name: '油盒洁净度',
        num: '100%',
        time: '0',
        advice:
          '油盒容量有限哦，请注意及时倾倒油盒里面的污油。不及时清理可能会造成抽烟率下降，并且积存的油污也会滋生细菌，危害健康。',
      },
      {
        name: '滤网洁净度',
        num: '100%',
        time: '0',
        advice: '请注意观察自家烟机的配件和折旧度哦，及时维护更换有助于保持烟机的寿命。',
      },
    ],
    pageType: '',
    startTime: '',
    endTime: '',
    aiLightState: 0,
    aiDelayState: 0,
    deviceId: '',
    deviceSN8: '',
    dayTimeSelect: '',
    deviceGrade: '',
    deviceData: {},
    adviceStr: '',
    cleanSelect: '',
    timeData: [
      '全天',
      '06:00-08:00',
      '08:00-10:00',
      '10:00-12:00',
      '12:00-14:00',
      '14:00-16:00',
      '16:00-18:00',
      '18:00-20:00',
    ],
    selectNumArr: [],
    oilHeight: 0,
    isShowFengJi: true,
    isShowOil: true,
    isShowLvWang: true,
    aiTimeArr: [],
    isShowDialog: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let showType = options.selectType == 'lightSetting' ? true : false
    wx.setNavigationBarTitle({
      title: showType ? '照明设置' : '清洁管家',
    })

    if (showType) {
      let deviceId = options.applianceId
      let deviceSN8 = options.platform
      this.setData({
        deviceId: deviceId,
        deviceSN8: deviceSN8,
      })
      this.checkDeviceLightState(deviceId, deviceSN8)
    } else {
      let cleanData = JSON.parse(options.cleanDataStr)
      let cleanSelected = options.cleanSelectNum
      let deviceId = options.applianceId
      let deviceSN8 = options.platform
      //风机
      this.data.cleanMode[0].num = cleanData.fanDirtyPercent
      this.data.cleanMode[0].time = parseInt(cleanData.fanRunTime / 3600)
      //油盒
      this.data.cleanMode[1].num = cleanData.oilBoxDirtyPercent
      this.data.cleanMode[1].time = parseInt(cleanData.oilBoxRunTime / 3600)
      //滤网
      this.data.cleanMode[2].num = cleanData.netDirtyPercent
      this.data.cleanMode[2].time = parseInt(cleanData.netRunTime / 3600)

      let height = cleanData.oilBoxDirtyPercent * 2.3
      this.setData({
        pageType: '1',
        cleanSelect: cleanSelected,
        cleanMode: this.data.cleanMode,
        oilHeight: height,
        deviceId: deviceId,
        deviceSN8: deviceSN8,
      })
    }
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onShow: function () {
    if (this.data.pageType == '1') {
      this.drawProgressbg(this.data.cleanSelect)
    }
  },
  onUnload: function () {},

  dofSwitchChanged: function (e) {
    let enable = this.data.aiLightState === 1 ? 0 : 1
    var that = this
    // if(enable === 0) {
    //   that.setData({
    //     isShowDialog: true
    //   })
    // }
    // else {
    that.deviceLightControl(enable)
    // }
  },
  timeSubmit(timeArr) {
    requestService
      .request('getDeviceCleanStatus', {
        msg: 'b6ReverseCloudHousekeeper',
        params: {
          action: 'set',
          applianceId: this.data.deviceId,
          platform: this.data.deviceSN8,
          setting: {
            aiLightSw: this.data.aiLightState,
            aiDelaySw: this.data.aiDelayState,
            timeSetting: timeArr,
          },
        },
      })
      .then((res) => {
        this.setData({
          aiTimeArr: timeArr,
        })
        pluginEventTrack('user_behavior_event', null, {
          page_id: 'page_control',
          page_name: '插件首页',
          widget_id: 'click_power_on_light_off_time',
          widget_name: '开机不开灯时段',
          ext_info: JSON.stringify(timeArr),
        })
        console.log(res)
      })
      .catch((rs) => {
        console.log(rs)
      })
  },
  confirmFns() {
    this.setData({
      isShowDialog: false,
    })
    this.deviceLightControl(0)
  },

  deviceCommonStatus(deviceId) {
    requestService
      .request('getDeviceCommonStatus', {
        msg: 'getDeviceBindDatetime',
        // msg: "getDeviceBindDatetimeSit",
        params: {
          applianceId: deviceId,
          protype: 'b6',
        },
      })
      .then((res) => {
        console.log(res)
        if (res.data.desc == 'success') {
          this.handleDeviceTime(res.data.result.datetime)
        }
      })
      .catch((rs) => {
        console.log(rs)
        if (rs.data.desc == 'success') {
          this.handleDeviceTime(rs.data.result.datetime)
        }
      })
  },
  deviceCleanStatus(requestType, controlParams) {
    requestService
      .request('getDeviceCleanStatus', {
        msg: requestType,
        params: controlParams,
      })
      .then((res) => {
        console.log(res)
      })
      .catch((err) => {
        console.log(err)
      })
  },
  handleDeviceTime(time) {
    console.log(time)
    let ut = new Date(time.replace(/-/g, '/')).getTime()
    let now = new Date().getTime()
    let days = (now - ut) / 1000 / 60 / 60 / 24
    let times = Math.floor(days)
    // this.setData({
    //   dayTime: times
    // })
  },
  deviceLightControl(enable) {
    requestService
      .request('getDeviceCleanStatus', {
        msg: 'b6ReverseCloudHousekeeper',
        params: {
          action: 'set',
          applianceId: this.data.deviceId,
          platform: this.data.deviceSN8,
          setting: {
            aiLightSw: enable,
            aiDelaySw: this.data.aiDelayState,
            timeSetting: this.data.selectNumArr.length == 0 ? [] : this.data.aiTimeArr,
          },
        },
      })
      .then((res) => {
        if (res.data.desc == 'success') {
          pluginEventTrack('user_behavior_event', null, {
            page_id: 'page_control',
            page_name: '插件首页',
            widget_id: 'click_ai_light',
            widget_name: 'AI照明',
            ext_info: enable == 1 ? '开' : '关',
          })
          this.setData({
            aiLightState: enable,
          })
          setTimeout(() => {
            this.checkDeviceLightState(this.data.deviceId, this.data.deviceSN8)
          }, 50)
        }
      })
      .catch((rs) => {
        if (rs.data.desc == 'success') {
          this.checkDeviceLightState(this.data.deviceId, this.data.deviceSN8)
        }
      })
  },
  checkDeviceLightState(deviceId, deviceSN8) {
    console.log(deviceId)
    console.log(deviceSN8)
    requestService
      .request('getDeviceCleanStatus', {
        msg: 'b6ReverseCloudHousekeeper',
        params: {
          action: 'get',
          applianceId: deviceId,
          platform: deviceSN8,
        },
      })
      .then((res) => {
        console.log(res)
        if (res.data.desc == 'success') {
          let deviceData = res.data.result
          let timeArr = deviceData.timeSetting
          let selectTimeArr = []
          if (timeArr.length > 0) {
            for (let i = 0; i < timeArr.length; i++) {
              let startTime = timeArr[i].startTime.substring(0, 5)
              let endTime = timeArr[i].endTime.substring(0, 5)
              if (startTime == '00:00' && endTime == '23:59') {
                selectTimeArr.push(0)
              } else if (startTime == '06:00' && endTime == '08:00') {
                selectTimeArr.push(1)
              } else if (startTime == '08:00' && endTime == '10:00') {
                selectTimeArr.push(2)
              } else if (startTime == '10:00' && endTime == '12:00') {
                selectTimeArr.push(3)
              } else if (startTime == '12:00' && endTime == '14:00') {
                selectTimeArr.push(4)
              } else if (startTime == '14:00' && endTime == '16:00') {
                selectTimeArr.push(5)
              } else if (startTime == '16:00' && endTime == '18:00') {
                selectTimeArr.push(6)
              } else if (startTime == '18:00' && endTime == '20:00') {
                selectTimeArr.push(7)
              }
            }
            this.setData({
              aiLightState: deviceData.aiLightSw,
              aiDelayState: deviceData.aiDelaySw,
              deviceId: deviceId,
              deviceSN8: deviceSN8,
              pageType: '0',
              selectNumArr: selectTimeArr,
              aiTimeArr: deviceData.timeSetting,
            })
          } else {
            this.setData({
              aiLightState: deviceData.aiLightSw,
              aiDelayState: deviceData.aiDelaySw,
              deviceId: deviceId,
              deviceSN8: deviceSN8,
              pageType: '0',
              selectNumArr: selectTimeArr,
            })
          }
        }
      })
      .catch((rs) => {
        console.log(rs)
        if (rs.data.desc == 'success') {
          let deviceData = rs.data.result
          let timeArr = deviceData.timeSetting
          let selectTimeArr = []
          if (timeArr.length > 0) {
            for (let i = 0; i < timeArr.length; i++) {
              let startTime = timeArr[i].startTime.substring(0, 5)
              let endTime = timeArr[i].endTime.substring(0, 5)
              if (startTime == '00:00' && endTime == '23:59') {
                selectTimeArr.push(0)
              } else if (startTime == '06:00' && endTime == '08:00') {
                selectTimeArr.push(1)
              } else if (startTime == '08:00' && endTime == '10:00') {
                selectTimeArr.push(2)
              } else if (startTime == '10:00' && endTime == '12:00') {
                selectTimeArr.push(3)
              } else if (startTime == '12:00' && endTime == '14:00') {
                selectTimeArr.push(4)
              } else if (startTime == '14:00' && endTime == '16:00') {
                selectTimeArr.push(5)
              } else if (startTime == '16:00' && endTime == '18:00') {
                selectTimeArr.push(6)
              } else if (startTime == '18:00' && endTime == '20:00') {
                selectTimeArr.push(7)
              }
            }
            this.setData({
              aiLightState: deviceData.aiLightSw,
              aiDelayState: deviceData.aiDelaySw,
              deviceId: deviceId,
              deviceSN8: deviceSN8,
              pageType: '0',
              selectNumArr: selectTimeArr,
            })
          } else {
            this.setData({
              aiLightState: deviceData.aiLightSw,
              aiDelayState: deviceData.aiDelaySw,
              deviceId: deviceId,
              deviceSN8: deviceSN8,
              pageType: '0',
              selectNumArr: selectTimeArr,
            })
          }
        }
      })
  },
  allDeviceReSet() {
    wx.showModal({
      title: '提示',
      content: `请在清洁后点击复位，复位后洁净度将恢复为100%`,
      success: (res) => {
        if (res.confirm) {
          let selectNum = this.data.cleanSelect
          wx.showLoading({
            title: '加载中',
          })
          let selectName = ''
          if (selectNum == '0') {
            selectName = '风机'
            this.resetFengJi()
          } else if (selectNum == '1') {
            selectName = '油盒'
            this.resetOilBox()
          } else if (selectNum == '2') {
            selectName = '滤网'
            this.resetNetDirty()
          }
          pluginEventTrack('user_behavior_event', null, {
            page_id: 'page_control',
            page_name: '插件首页',
            widget_id: 'click_cleaness_reset',
            widget_name: `${selectName}复位`,
          })
        } else if (res.cancel) {
        }
      },
    })
  },
  resetFengJi() {
    var ids = this.data.deviceId
    var sn8 = this.data.deviceSN8
    requestService
      .request('getDeviceCleanStatus', {
        msg: 'cleanMaintain',
        params: {
          action: 'resetFanCleanlinessDatetime',
          applianceId: ids,
          platform: sn8,
          task: [],
        },
      })
      .then((res) => {
        if (res.data.desc == 'success') {
          wx.hideLoading()
          //风机
          this.data.cleanMode[0].num = 100
          this.data.cleanMode[0].time = '0'
          this.drawProgressbg('0')
          this.setData({
            cleanMode: this.data.cleanMode,
          })
          wx.showToast({
            title: '复位成功',
          })
        } else {
          wx.hideLoading()
          wx.showToast({
            title: '请求失败！',
          })
        }
      })
      .catch((rs) => {
        if (rs.data.desc == 'success') {
          wx.hideLoading()
          //风机
          this.data.cleanMode[0].num = 100
          this.data.cleanMode[0].time = '0'
          this.drawProgressbg('0')
          this.setData({
            cleanMode: this.data.cleanMode,
          })
        } else {
          wx.hideLoading()
          wx.showToast({
            title: '请求失败！',
          })
        }
      })
  },
  resetOilBox() {
    requestService
      .request('getDeviceCleanStatus', {
        msg: 'cleanMaintain',
        params: {
          action: 'resetOilBoxResidualLoadDatetime',
          applianceId: this.data.deviceId,
          platform: this.data.deviceSN8,
          task: [],
        },
      })
      .then((res) => {
        console.log(res)
        if (res.data.desc == 'success') {
          wx.hideLoading()
          //油盒
          this.data.cleanMode[1].num = 100
          this.data.cleanMode[1].time = '0'
          this.drawProgressbg('1')
          this.setData({
            cleanMode: this.data.cleanMode,
          })
          wx.showToast({
            title: '复位成功',
          })
        } else {
          wx.hideLoading()
          wx.showToast({
            title: '请求失败！',
          })
        }
      })
      .catch((rs) => {
        console.log(rs)
        if (rs.data.desc == 'success') {
          //油盒
          this.data.cleanMode[1].num = 100
          this.data.cleanMode[1].time = '0'
          this.drawProgressbg('1')
          this.setData({
            cleanMode: this.data.cleanMode,
          })
        } else {
          wx.hideLoading()
          wx.showToast({
            title: '请求失败！',
          })
        }
      })
  },
  resetNetDirty() {
    requestService
      .request('getDeviceCleanStatus', {
        msg: 'resetNetDirty',
        params: {
          applianceId: this.data.deviceId,
        },
      })
      .then((res) => {
        wx.hideLoading()
        if (res.data.desc == 'success') {
          //滤网
          this.data.cleanMode[2].num = 100
          this.data.cleanMode[2].time = '0'
          this.drawProgressbg('2')
          this.setData({
            cleanMode: this.data.cleanMode,
          })
          wx.showToast({
            title: '复位成功',
          })
        } else {
          wx.showToast({
            title: '请求失败！',
          })
        }
      })
      .catch((rs) => {
        wx.hideLoading()
        console.log(rs)
        if (rs.data.desc == 'success') {
          //滤网
          this.data.cleanMode[2].num = 100
          this.data.cleanMode[2].time = '0'
          that.drawProgressbg('2')
          this.setData({
            cleanMode: this.data.cleanMode,
          })
        } else {
          wx.showToast({
            title: '请求失败！',
          })
        }
      })
  },
  clickToTitle(e) {
    var selectNum = e.currentTarget.id
    this.setData({
      cleanSelect: selectNum,
    })
    var that = this
    setTimeout(function () {
      that.drawProgressbg(selectNum)
    }, 100)
  },
  drawProgressbg(selectId) {
    let newCanvas = wx.createSelectorQuery()

    let selectIds = '#canvasProgressbg'
    let valueRatio = this.data.cleanMode[0].num / 100

    if (selectId == '1') {
      selectIds = '#canvasProgressBg'
      valueRatio = this.data.cleanMode[1].num / 100
    } else if (selectId == '2') {
      selectIds = '#canvasProgressbgs'
      valueRatio = this.data.cleanMode[2].num / 100
    }

    let lineType = ''
    let strokeStyle = ''
    let selectNum = parseInt(selectId)
    let areaNum = this.data.cleanMode[selectNum].num
    if (areaNum > 20) {
      lineType = '#29C3FF'
      strokeStyle = '#9FE9FF'
    } else if (areaNum > 0 && areaNum <= 20) {
      lineType = '#FF8225'
      strokeStyle = '#FADBC3'
    } else {
      lineType = '#E55225'
      strokeStyle = '#FAC9C8'
    }
    console.log('color', strokeStyle)

    newCanvas
      .select(selectIds)
      .fields({ node: true, size: true })
      .exec(function (res) {
        const canvas = res[0].node
        const ctx = canvas.getContext('2d')
        // const dpr = wx.getSystemInfoSync().pixelRatio
        const dpr = 2
        canvas.width = res[0].width * dpr
        canvas.height = res[0].height * dpr
        ctx.scale(dpr, dpr)
        // 大小值的计算
        var circle_r = canvas.width / 4 //画布的一半，用来找中心点和半径
        var startDegree = 0 //从什么角度开始
        var maxValue = canvas.width / 4 //最大值
        var minValue = 0 //最小值
        var value = (canvas.width / 4) * valueRatio //当前的值
        var lineColor = lineType //线条颜色
        var lineWidth = 3 //线条宽度
        var percent = 360 * ((value - minValue) / (maxValue - minValue)) //计算结果

        //定义起始点
        ctx.translate(circle_r, circle_r)
        //灰色圆弧
        ctx.beginPath()
        ctx.strokeStyle = strokeStyle
        ctx.lineWidth = lineWidth
        ctx.arc(0, 0, circle_r - 10, 0, 2 * Math.PI, true)
        ctx.stroke()
        ctx.closePath()
        //有色彩的圆弧
        ctx.beginPath()
        ctx.strokeStyle = lineColor
        ctx.lineWidth = lineWidth
        ctx.arc(
          0,
          0,
          circle_r - 10,
          (startDegree * Math.PI) / 180 - 0.5 * Math.PI,
          (percent * Math.PI) / 180 + (startDegree * Math.PI) / 180 - 0.5 * Math.PI,
          false
        )
        ctx.stroke()
        ctx.closePath()
      })
  },
  changeSelectNum(e) {
    let selectNum = e.currentTarget.id
    if (selectNum != '0') {
      let num = parseInt(selectNum)
      if (this.data.selectNumArr.indexOf(num) != -1) {
        let delteNum = this.data.selectNumArr.indexOf(num)
        this.data.selectNumArr.splice(delteNum, 1)
        let newArr = this.data.selectNumArr.sort()
        let submitTimeArr = []
        for (let i = 0; i < newArr.length; i++) {
          let num = newArr[i]
          let startTimes = this.data.timeData[num].substring(0, 5)
          let endTimes = this.data.timeData[num].slice(6)
          let timeObj = {
            startTime: startTimes,
            endTime: endTimes,
          }
          submitTimeArr.push(timeObj)
        }
        this.setData({
          selectNumArr: this.data.selectNumArr,
        })
        this.timeSubmit(submitTimeArr)
      } else {
        if (this.data.selectNumArr[0] == 0) {
          this.data.selectNumArr.shift()
        }
        this.data.selectNumArr.push(num)
        let newArr = this.data.selectNumArr.sort()
        let submitTimeArr = []
        for (let i = 0; i < newArr.length; i++) {
          let num = newArr[i]
          let startTimes = this.data.timeData[num].substring(0, 5)
          let endTimes = this.data.timeData[num].slice(6)
          let timeObj = {
            startTime: startTimes,
            endTime: endTimes,
          }
          submitTimeArr.push(timeObj)
        }
        this.setData({
          selectNumArr: this.data.selectNumArr,
        })
        this.timeSubmit(submitTimeArr)
      }
    } else {
      let num = parseInt(selectNum)
      if (this.data.selectNumArr.indexOf(num) != -1) {
        let newArr = []
        this.setData({
          selectNumArr: newArr,
        })
        this.timeSubmit(newArr)
      } else {
        let newArr = [0]
        this.setData({
          selectNumArr: newArr,
        })
        let timeArr = [
          {
            startTime: '00:00',
            endTime: '23:59',
          },
        ]
        this.timeSubmit(timeArr)
      }
    }
  },
  closeShow(e) {
    let selectType = e.currentTarget.id
    if (selectType == '0') {
      this.setData({
        isShowFengJi: false,
      })
    } else if (selectType == '1') {
      this.setData({
        isShowOil: false,
      })
    } else if (selectType == '2') {
      this.setData({
        isShowLvWang: false,
      })
    }
  },
})
