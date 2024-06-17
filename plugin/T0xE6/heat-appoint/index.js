// plugin/T0xE6/heat-appoint/index.js
import { requestService } from './../../../utils/requestService'
import { getCurrentTime, toShow } from './../assets/js/util'
import computedBehavior from './../../../utils/miniprogram-computed'
import { pluginEventTrack } from '../../../track/pluginTrack'
Page({
  behaviors: [computedBehavior],

  /**
   * 页面的初始数据
   */
  data: {
    appData: {},
    appointOnTimeList: [[], [], [], [], [], [], []], // 预约开启的时间列表，表中0~6元素分别代表周日~周六预约开启数据
    list: [], // appointList,
    showDelete: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.pageEventChannel = this.getOpenerEventChannel()
    this.pageEventChannel.on('initPageData', (data) => {
      // if(this.pageEventChannel_initPageData) return
      // this.pageEventChannel_initPageData = true
      this.initPageData(data)
    })
    //页面浏览埋点:采暖预约列表浏览次数
    pluginEventTrack(
      'user_page_view',
      null,
      {
        page_id: 'page_heat-appoint_index',
        page_name: '采暖预约列表页',
        bd_name: '壁挂炉',
      },
      {}
    )
  },

  onHide() {
    this.navigateToEd = false
  },

  /**
   * this.methods
   */
  initPageData(pageData) {
    const { setting, deviceInfo, appData, isCloudOn, hasAppointOn, appointList } = pageData
    this.setData({ setting, deviceInfo, appData, isCloudOn, hasAppointOn })
    !this.passInitPageData && this.handleAppoint(appointList)
  },

  navigateToEdit({
    currentTarget: {
      dataset: { item, action },
    },
  }) {
    if (this.navigateToEd) return
    this.navigateToEd = true

    wx.navigateTo({
      url: './edit/index',
      events: {
        refreshData: () => {
          this.pageEventChannel_initPageData = false
          this.pageEventChannel && this.pageEventChannel.emit('refreshData')
        },
      },
      success: (res) => {
        // this.heatAppointEditPageEventChannel = res.eventChannel
        res.eventChannel.emit('initPageData', {
          action: action,
          taskObj: item ? item : {},
          appointOnTimeList:
            action == 'add'
              ? this.data.appointOnTimeList
              : this.data.appointOnTimeList.map((week_list) => {
                  return week_list.map((appointOnItem) => {
                    return appointOnItem.taskId != item.taskId ? appointOnItem : ''
                  })
                }),
          setting: this.data.setting,
          appData: this.data.appData,
          isCloudOn: this.data.isCloudOn,
          hasAppointOn: this.data.hasAppointOn,
          deviceInfo: this.data.deviceInfo,
        })
      },
    })
  },
  // 查询预约数据
  queryAppoint() {
    return requestService
      .request('e6', {
        msg: this.data.setting?.heatAppointType == 'curve' ? 'setTempCruveControll' : 'taskReservation',
        params: {
          applianceId: this.data.deviceInfo.applianceCode,
          platform: this.data.deviceInfo.sn8,
          action: 'getAll',
          task: [],
        },
      })
      .then(({ data }) => {
        if (data.retCode == 0) {
          this.setData({
            hasEnabledOrder: data.result.some((item) => item.enable),
            appointList: data.result,
          })
          this.handleAppoint(this.data.appointList)
        }
        return data
      })
  },
  // 处理 预约数据
  handleAppoint(list) {
    // 排序整理
    const arr1 = list.sort(this.sortDataEndTime)
    const arr = arr1.sort(this.sortData)
    // 数据更新
    const appointList = arr.map((item) => {
      // 显示模式/温度处理
      let desc = ''
      if (item.actionType == 'mode') {
        const modeObj = this.data.setting.heatModeList.find((x) => x.value == item.mode)
        desc = (modeObj && modeObj.title) || this.data.setting.heatModeList[0].title
      } else {
        desc = item.temp + ' ℃'
      }
      desc += ' | ' + this.parseWeek(item.week, item.isRepeat)
      // 显示时间处理
      let title = item.startTime + ' - '
      title += toShow(item.endTime, item.isEndNextDay).isEndNextDay ? '次日 ' : ''
      title += toShow(item.endTime, item.isEndNextDay).endTime.toString()
      return {
        ...item,
        title: title,
        desc: desc,
      }
    })

    this.setData({ list: appointList, appointOnTimeList: [[], [], [], [], [], [], []] })

    appointList.forEach((item, index) => {
      if (item.enable) {
        this.setData({ hasAppointOn: true })
        let week_list = item.week.split(',')
        if (item.isEndNextDay) {
          // 跨天则将当前预约拆分为两段
          let item_1 = { ...item, endTime: '24:00' }
          week_list.forEach((week) => this.data.appointOnTimeList[week].push(item_1))
          let new_week_list = week_list.map((week) => (week == 6 ? 0 : +week + 1))
          let item_2 = { ...item, startTime: '00:00', week: new_week_list.join(',') }
          new_week_list.forEach((week) => this.data.appointOnTimeList[week].push(item_2))
        } else {
          // 不跨天
          week_list.forEach((week) => this.data.appointOnTimeList[week].push(item))
        }
      }
    })
    this.setData({ appointOnTimeList: this.data.appointOnTimeList })
    this.stopExecuting()
  },

  //按 endTime 排序
  sortDataEndTime(a, b) {
    var stA = parseInt(a.endTime.replace(':', '').replace('：', ''))
    var stB = parseInt(b.endTime.replace(':', '').replace('：', ''))
    return stA - stB
  },
  //按 startTime 排序
  sortData(a, b) {
    var stA = parseInt(a.startTime.replace(':', '').replace('：', ''))
    var stB = parseInt(b.startTime.replace(':', '').replace('：', ''))
    return stA - stB
  },

  // 若电控执行中预约已是“不合法”的（被修改删除关闭后），则停止执行并提示
  stopExecuting() {
    if (this.data.appData.heat_appointment_switch == 'on') {
      // 若有执行中预约
      var isLegal = false
      // 循环判断当前时间是否有已开启的预约
      this.data.list.forEach((item, index) => {
        // 关闭的预约不需要比较
        if (!item.enable) {
          return false
        }
        let currentTime = getCurrentTime()
        let week_list = item.week.split(',')
        // week为空即为当日
        let isCurrentTimeInRange =
          this.timeChange(currentTime) <
          (item.isEndNextDay ? this.timeChange(item.endTime) + 2400 : this.timeChange(item.endTime))
        if (
          (item.week.length == 0 || week_list.includes('' + new Date().getDay())) &&
          this.timeChange(currentTime) >= this.timeChange(item.startTime) &&
          isCurrentTimeInRange
        ) {
          isLegal = true
        }
      })
      if (!isLegal) {
        // 当前时间没有已开启的预约时，需要退出电控的预约状态
        this.pageEventChannel.emit('luaControl', { heat_appointment_switch: 'off' })
      }
    }
  },

  timeChange(time) {
    return Number(time.replace(':', ''))
  },

  timeNowChange() {
    let myDate = new Date()
    let day = JSON.stringify(myDate.getDay())
    let h = myDate.getHours() * 100
    let m = myDate.getMinutes()
    let nowHour = h + m
    return { nowHour, day }
  },

  parseWeek(wkStr, isRepeat) {
    var weekArr = wkStr.split(',')
    let week = ''
    for (let i = 0; i < weekArr.length; i++) {
      if (weekArr[i] == '1') {
        week = week + '周一 '
      } else if (weekArr[i] == '2') {
        week = week + '周二 '
      } else if (weekArr[i] == '3') {
        week = week + '周三 '
      } else if (weekArr[i] == '4') {
        week = week + '周四 '
      } else if (weekArr[i] == '5') {
        week = week + '周五 '
      } else if (weekArr[i] == '6') {
        week = week + '周六 '
      } else if (weekArr[i] == '0') {
        week = week + '周日 '
      }
    }
    if (!isRepeat) {
      week = '单次'
    } else if (week == '周日 周六 ' || week == '周六 周日 ') {
      week = '周末'
    } else if (week == '周一 周二 周三 周四 周五 ') {
      week = '工作日'
    } else if (week == '周日 周一 周二 周三 周四 周五 周六 ') {
      week = '每天'
    } else if (week == '周一 周二 周三 周四 周五 周六 周日 ') {
      week = '每天'
    } else if (week == '') {
      week = '单次'
    }
    return week
  },

  onCellSwitchTap({
    currentTarget: {
      dataset: { item, index },
    },
  }) {
    if (this.onCellSwitchTapBusy) return
    this.onCellSwitchTapBusy = true

    let mode_key = 'heat_mode'
    let otherMode = false
    if (this.data.setting.heatModeList.length) {
      this.data.setting.heatModeList.forEach(
        (mode_item) => (mode_key = mode_item.key.indexOf('Old') > -1 ? 'mode' : mode_key)
      )
      otherMode = mode_key == 'heat_mode' ? this.data.appData.heat_mode != '0' : this.data.appData.mode != 'normal_mode'
    }

    // this.toggleItem = item
    if (!item.enable) {
      // 要打开时先弹窗询问
      // 单次预约重新开启时，需要重置week值
      if (!item.isRepeat) {
        item.week = '' + new Date().getDay()
      }
      let isConflict = false
      if (this.data.hasAppointOn) {
        // 有预约开启，判断预约是否冲突
        let week_list = item.week.split(',')
        if (item.isEndNextDay) {
          // 跨天则将当前预约拆分为两段分别判断
          let item_1 = { ...item, endTime: '24:00' }
          isConflict = this.getConflict(item_1)
          let new_week_list = week_list.map((week) => {
            return week == '6' ? 0 : Number(week) + 1
          })
          let item_2 = { ...item, startTime: '00:00', week: new_week_list.join(',') }
          isConflict = isConflict || this.getConflict(item_2)
        } else {
          // 不跨天
          isConflict = this.getConflict(item)
        }
      }
      if (isConflict) {
        return (this.onCellSwitchTapBusy = false)
      } else if (!item.isRepeat && item.startTime < getCurrentTime()) {
        // 启用单次的，不可选择过去时间
        wx.showToast({ title: '不可选择过去的时间', icon: 'none' })
        this.onCellSwitchTapBusy = false
        return
      } else if (this.data.isCloudOn) {
        // 询问是否关闭云管家
        wx.showModal({
          title: '温馨提示',
          content: '此操作将关闭云管家，\n确定执行？',
          success: (res) => {
            if (res.confirm) {
              this.toggleAppoint(item, index)
            } else if (res.cancel) {
              this.onCellSwitchTapBusy = false
            }
          },
        })
      } else if (otherMode) {
        let modeObj = this.data.setting.heatModeList.find((item) => {
          return item.value == this.data.appData[mode_key]
        })
        let mode = (modeObj && modeObj.title) || '采暖模式'
        wx.showModal({
          title: '温馨提示',
          content: `此操作将关闭${mode}，\n确定执行？`,
          success: (res) => {
            if (res.confirm) {
              // 切换到普通模式
              this.switch2NormalMode().catch((e) => console.error(e))
              this.toggleAppoint(item, index)
            } else if (res.cancel) {
              this.onCellSwitchTapBusy = false
            }
          },
        })
      } else {
        this.toggleAppoint(item, index)
      }
    } else {
      this.toggleAppoint(item, index)
    }
  },

  async switch2NormalMode() {
    const modeKey = (() => {
      let mode_key = 'heat_mode'
      this.data.setting.heatModeList.forEach(
        (mode_item) => (mode_key = mode_item.key.indexOf('Old') > -1 ? 'mode' : mode_key)
      )
      return mode_key
    })()

    const normalMode =
      modeKey == 'heat_mode'
        ? {
            key: 'heatNormal',
            title: '普通模式',
            value: '0',
            isSelected: false,
          }
        : {
            key: 'heatNormalOld',
            title: '普通模式',
            value: 'normal_mode',
            isSelected: false,
          }

    // 执行中预约 先强制关闭
    if (this.data.appData.heat_appointment_switch == 'on') {
      this.pageEventChannel.emit('luaControl', {
        heat_appointment_switch: 'off',
        buzzing_switch: 'no_buzzing',
      })
      wx.showToast({ title: '执行中预约已自动关闭' })
    }

    this.pageEventChannel.emit('luaControl', {
      [modeKey]: normalMode.value,
      buzzing_switch: 'no_buzzing',
    })

    const isSmart = this.data.setting.heatModeList.some((i) => i.key.indexOf('smart') > -1)
    const newErrorTip = ''
    if (this.data.appData.out_temperature == 127 && isSmart) {
      newErrorTip = '无探头：未检测到室外温度传感器探头'
    } else if (this.data.appData.out_temperature == 126 && isSmart) {
      newErrorTip = '短路故障：室外温度传感器探头短路故障'
    } else if (this.data.appData.out_temperature == 125 && isSmart) {
      newErrorTip = '断路故障：室外温度传感器探头断路故障'
    }
    newErrorTip &&
      wx.showToast({
        title: '探头故障，无法切换模式',
        icon: 'error',
      })
  },

  getConflict(item) {
    let week_list = item.week.split(',')
    for (let week of week_list) {
      for (let appointOnItem of this.data.appointOnTimeList[week]) {
        if (
          !(
            this.timeChange(appointOnItem.endTime) <= this.timeChange(item.startTime) ||
            this.timeChange(appointOnItem.startTime) >= this.timeChange(item.endTime)
          )
        ) {
          wx.showToast({ title: '预约时间重叠，不能启用', icon: 'none' })
          return true
        }
      }
    }
    return false
  },

  toggleAppoint(item, index) {
    // 跳过1次的 initPageData
    this.passInitPageData = true

    // 不等query马上switch
    this.setData({ [`list[${index}].enable`]: !item.enable, appointOnTimeList: [[], [], [], [], [], [], []] })
    this.data.list.forEach((oldItem) => {
      if (oldItem.enable) {
        this.setData({ hasAppointOn: true })
        let week_list = oldItem.week.split(',')
        if (oldItem.isEndNextDay) {
          // 跨天则将当前预约拆分为两段
          let item_1 = { ...oldItem, endTime: '24:00' }
          week_list.forEach((week) => this.data.appointOnTimeList[week].push(item_1))
          let new_week_list = week_list.map((week) => (week == 6 ? 0 : +week + 1))
          let item_2 = { ...oldItem, startTime: '00:00', week: new_week_list.join(',') }
          new_week_list.forEach((week) => this.data.appointOnTimeList[week].push(item_2))
        } else {
          // 不跨天
          week_list.forEach((week) => this.data.appointOnTimeList[week].push(oldItem))
        }
      }
    })
    this.setData({ appointOnTimeList: this.data.appointOnTimeList })

    let new_item = { ...item, enable: !item.enable }
    // 联动关闭云管家
    new_item.enable && this.pageEventChannel.emit('switchCloudAi', 0)
    // 发送预约开关请求
    wx.showLoading({ title: '', mask: true })
    requestService
      .request('e6', {
        msg: 'taskReservation',
        params: {
          applianceId: this.data.deviceInfo.applianceCode,
          platform: this.data.deviceInfo.sn8,
          action: 'update',
          task: [new_item],
        },
      })
      .then((rs) => {
        // 埋点上报
        pluginEventTrack('user_behavior_event', null, {
          page_id: 'page_control',
          page_name: '采暖预约列表',
          widget_id: 'click_appoint_switch',
          widget_name: '采暖预约',
          ext_info: `预约内容:${new_item}`,
        })
        // this.pageEventChannel && this.pageEventChannel.emit('refreshData')
        // this.luaSetTemp(new_item)
      })
      .finally(() => {
        // this.pageEventChannel && this.pageEventChannel.emit('refreshData')
        clearTimeout(this.passInitPageDataTimer)
        this.passInitPageDataTimer = setTimeout(() => (this.passInitPageData = false), 6000)
        setTimeout(() => wx.hideLoading(), 50)
        this.onCellSwitchTapBusy = false
      })
  },

  luaSetTemp(new_item) {
    if (new_item.enable) {
      let startT = this.timeChange(new_item.startTime)
      let endT = this.timeChange(new_item.endTime)
      let { nowHour, day } = this.timeNowChange()
      var isNow
      if (new_item.isEndNextDay) {
        isNow = nowHour >= startT
      } else {
        isNow = nowHour >= startT && nowHour <= endT
      }
      if (new_item.week.indexOf(day) > -1 && isNow) {
        let params = {
          current_heat_set_temperature: new_item.temp,
        }
        this.pageEventChannel.emit('luaControl', params)
      }
    }
  },
  // 删除预约
  deleteAppoint({
    currentTarget: {
      dataset: { item },
    },
  }) {
    wx.showModal({
      title: '温馨提示',
      content: '是否确定删除此项预约？',
      success: (res) => {
        if (res.confirm) {
          requestService
            .request('e6', {
              msg: 'taskReservation',
              params: {
                applianceId: this.data.deviceInfo.applianceCode,
                platform: this.data.deviceInfo.sn8,
                action: 'delete',
                task: [item],
              },
            })
            .then((rs) => {
              this.queryAppoint()
              wx.showToast({ title: '预约删除成功', icon: 'none' })
              // 埋点上报
              pluginEventTrack('user_behavior_event', null, {
                page_id: 'page_control',
                page_name: '采暖预约列表',
                widget_id: 'click_appoint_delete',
                widget_name: '采暖预约',
                ext_info: `删除预约：${item}`,
              })
            })
        } else if (res.cancel) {
          // resolve('')
        }
      },
    })
  },
  // 解决分包后van-swipe-cell渲染问题
  onOpen() {
    this.setData({ showDelete: true })
  },
})
