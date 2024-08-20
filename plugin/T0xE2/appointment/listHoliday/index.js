const app = getApp()
import images from '../../assets/js/img'
import computedBehavior from '../../../../utils/miniprogram-computed'
import { requestService, rangersBurialPoint } from '../../../../utils/requestService'
import { getReqId, getStamp } from '../../../../utils/util'
const getModeBuryParams = function (mode, lastObj, changeObj) {
  let newObj = {
    ...lastObj,
    ...changeObj,
  }
  let setting_params = {}
  for (let key in newObj) {
    setting_params[key] = (lastObj[key] || (lastObj[key] == '0' && '0') || '') + '|' + newObj[key]
  }
  return {
    mode,
    setting_params: JSON.stringify(setting_params),
  }
}
Page({
  behaviors: [computedBehavior],

  data: {
    setting:{},
    list: [],
    appointOnTimeList: [[], [], [], [], [], [], []], // 预约开启的时间列表，表中0~6元素分别代表周日~周六预约开启数据
    hasAppointOn: false, // 是否有已开启预约
    loading: true,
    isMaxFive: false, // 延时分段预约有最大预约数5条的限制，分段预约没有
    applianceData: {},
    toggleItem: {},
    // 云管家互斥处理
    isCloudOn: false,
    isIphoneX: false,
    showDelete: false,
    isNextDay:false,
    status: {},
    appointType: 0, // 预约类型
  },

  computed: {
    images() {
      return images
    },
    actionParams() {
      let item = this.data.toggleItem
      let lastActionObj = {
        id: item.taskId,
        start_time: item.startTime,
        end_time: item.endTime,
        switch: item.enable ? '开' : '关',
        temperature: item.temp + '℃',
        repeat_cycle: item.week,
        repeat_switch: item.isRepeat ? '开' : '关',
        legalDate: item.legalDate==0 ? '' : (item.legalDate==1 ? '法定节假日' : '法定工作日'),
      }
      let changeObj = { switch: item.enable ? '关' : '开' }
      return getModeBuryParams('法定节假日预约开关', lastActionObj, changeObj)
    },
  },

  onLoad({ applianceData, setting }) {
    // 更新： channel 接收card.js 的 4秒轮询的设备状态
    this.pageEventChannel = this.getOpenerEventChannel()
    this.pageEventChannel.on('initPageData', ({status}) => {
      this.setData({status})
    })

    // 初始化：型号配置
    applianceData = JSON.parse(applianceData)
    setting = JSON.parse(setting)
    let appointType = setting.appointType == 'delayPartAppoint' ? 1 : 0
    this.setData({applianceData,setting,appointType})

    // 初始化：平台信息
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          isIphoneX: res.safeArea.top > 20 && res.platform === 'ios',
        })
      },
    })
  },

  async onShow() {
    this.queryAppoint()
    // beging 添加字节埋点：进入插件页
    this.rangersBurialPointClick('plugin_page_view', {
      refer_name: '分段预约页',
    })
    // end 添加字节埋点：进入插件页
    // 首次进入时需要主动查询（只有有云管家功能才查询）
    this.data.setting.cardList.map((item) => {
      if (item == 'cloudHome4') {
        this.getCloudSwitch()
      }
    })
  },

  beforeChange({
    currentTarget: {
      dataset: { item },
    },
  }) {
    // console.log({
    //   currentTarget: {
    //     dataset: { item },
    //   },
    // })
    const { hasAppointOn, isCloudOn } = this.data
    this.setData({
      toggleItem: item,
    })

    let isNextDay = false
    if (!item.isRepeat && !item.enable) {
      let now = new Date()
      let today = now.getDay()
      let hour = now.getHours() < 10 ? '0' + now.getHours() : now.getHours()
      let min = now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes()
      let nowStr = hour + ':' + min
      if (nowStr >= item.startTime) {
        item.week = '' + (today != 6 ? today + 1 : 0)
        isNextDay = true
      } else {
        item.week = '' + today
      }
    }
    this.setData({ isNextDay })

    if (!item.enable) {
      // 要打开时先弹窗询问
      let isConflict = false
      if (hasAppointOn && item.week) {
        // 有预约开启，判断预约是否冲突
        let week_list = item.week.split(',')
        if (item.startTime > item.endTime) {
          // 跨天则将当前预约拆分为两段分别判断
          let item_1 = { ...item, endTime: '24:00' }
          isConflict = this.getConflict(item_1)
          let new_week_list = week_list.map((week) => {
            return week == '6' ? 0 : Number(week) + 1
          })
          let item_2 = {
            ...item,
            startTime: '00:00',
            week: new_week_list.join(','),
          }
          isConflict = isConflict || this.getConflict(item_2)
        } else {
          // 不跨天
          isConflict = this.getConflict(item)
        }
      }
      if (isConflict) {
        return
      } else if (isCloudOn) {
        // 询问是否关闭云管家
        wx.showModal({
          title: '温馨提示',
          content: '设置预约后，将关闭云管家自动控温，是否确认开启预约？',
          success: (res) => {
            if (res.confirm) {
              this.toggleAppoint(this.data.toggleItem)
            }
          },
        })
      } else {
        this.toggleAppoint(item)
      }
    } else {
      this.toggleAppoint(item)
    }
  },

  // 判断预约是否冲突
  getConflict(item) {
    let week_list = item.week.split(',')
    for (let week of week_list) {
      for (let appointOnItem of this.data.appointOnTimeList[week]) {
        if (!(appointOnItem.endTime <= item.startTime || appointOnItem.startTime >= item.endTime)) {
          wx.showToast({ title: '该时间段已经设置过预约了', icon: 'none' })
          return true
        }
      }
    }
    return false
  },

  // 获取云管家开关状态
  getCloudSwitch() {
    const { applianceCode } = this.data.applianceData
    requestService
      .request('e2', {
        msg: 'GetCloudManagerSwitch',
        params: {
          applianceId: String(applianceCode),
        },
      })
      .then(({ data }) => {
        if (data.retCode == '0') {
          this.setData({ isCloudOn: data.result.switch == '1' })
        }
      })
  },

  // 开启/关闭云管家
  switchCloudAi(p) {
    requestService
      .request('e2', {
        msg: 'SetCloudManagerSwitch',
        params: {
          applianceId: String(this.data.applianceData.applianceCode),
          switch: p,
        },
      })
      .then(({ data }) => {
        if (data.retCode == '0') {
        } else {
          wx.showToast({ title: '网络较差，请稍后重试', icon: 'none' })
        }
      })
  },

  // 若AI管家是开启状态，开启预约则关闭AI管家
  toggleAppointAI() {
    const { status } = this.data
    let isAiHomeOn = status.memory == 'on' || status.mode == 'memory'
    if (isAiHomeOn && status.memory === 'on') {
      let params = {
        control_type: 'part',
        memory: 'off'
      }
      this.pageEventChannel && this.pageEventChannel.emit('luaControl', params)
    }
  },

  // 关闭一键智享
  closeOneKeyAi() {
    this.pageEventChannel && this.pageEventChannel.emit('closeOneKeyAi')
  },

  // 切换预约开启状态
  toggleAppoint(item) {
    // 埋点
    this.rangersBurialPointClick('plugin_mode_set_check', this.data.actionParams)
    //
    const { setting } = this.data
    const { applianceCode, sn8 } = this.data.applianceData
    wx.showLoading({ title: '加载中', mask: true })
    let new_item = { ...item, enable: !item.enable } // 避免渲染抖动
    // 处理单次隔日预约
    let toast_str = setting.appointType == 'delayPartAppoint' ? '开始用水时间' : '开机时间'
    
    // 判断是延时预约还是分段预约
    var appointType = 0
    if (setting.appointType == 'delayPartAppoint') {
      appointType = 1
    }
    
    // 关闭互斥功能
    if(new_item.enable){
      this.switchCloudAi(0) // 关闭 云管家
      this.toggleAppointAI() // 关闭 AI管家
      this.closeOneKeyAi() // 关闭 一键智享
    }

    // 发送预约开关请求
    requestService
      .request('e2', {
        msg: 'reserve',
        params: {
          applianceId: String(applianceCode),
          platform: sn8,
          action: 'update',
          flag: appointType, //默认为分段预约，0：分段预约；1：延时预约
          task: [new_item],
        },
      })
      .then((rs) => {
        if (this.data.isNextDay && new_item.legalDate==0) {
          wx.showToast({
            title: `您设置的${toast_str}已过，预约将于明日执行`,
            icon: 'none',
            duration: 2000,
          })
        }
        this.queryAppoint(!(this.data.isNextDay && new_item.legalDate==0))
      })
      .catch((e) => {
        wx.showToast({ title: '预约失败', icon: 'none' })
        wx.hideLoading()
      })
  },

  // 查询预约数据
  queryAppoint(loading=true) {
    const { setting } = this.data
    if(!setting.appointType) return
    loading && wx.showLoading({ title: '加载中', mask: true })
    const { applianceCode, sn8 } = this.data.applianceData
    // 判断是延时预约还是分段预约
    let appointType = 0
    if (setting.appointType == 'delayPartAppoint') {
      appointType = 1
    }
    requestService
      .request('e2', {
        msg: 'reserve',
        params: {
          applianceId: String(applianceCode),
          platform: sn8,
          action: 'getAll',
          flag: appointType, //默认为分段预约，0：分段预约；1：延时预约
          task: [],
        },
      })
      .then(({ data: rs }) => {
        if (rs.retCode != '0') {
          wx.showToast({
            title: '查询预约数据失败:' + JSON.stringify(rs),
            icon: 'none',
          })
          return
        }
        let result = rs.result
        let appoint_list = []
        for (let i = 0; i < result.length; i++) {
          //更新预约个数, 延时分段预约有最大预约数5条的限制，分段预约没有
          if (i >= 4 && setting.appointType == 'delayPartAppoint') {
            this.data.isMaxFive = true
          } else {
            this.data.isMaxFive = false
          }
          let endTimeDay = result[i].startTime >= result[i].endTime ? '次日 ' : '' // （大于和等于都属于跨天）
          let week = result[i].week
          if(result[i].legalDate&&result[i].legalDate==1){
            week = '6,0'
          }else if(result[i].legalDate&&result[i].legalDate==2){
            week = '1,2,3,4,5'
          }
          let appoint = {
            label: result[i].label,
            enable: result[i].enable,
            temp: result[i].temp,
            startTime: result[i].startTime,
            endTime: result[i].endTime,
            taskId: result[i].taskId,
            isRepeat: result[i].isRepeat,
            isDefault: result[i].isDefault,
            wkStr: this.parseWeek(week, result[i].isRepeat, result[i].legalDate),
            week: week,
            endTimeStr: endTimeDay + result[i].endTime,
            legalDate: result[i].legalDate || 0,
          }
          appoint_list.push(appoint)
        }
        // 处理预约时间段交叉逻辑
        this.setData({
          list: appoint_list,
        })
        this.data.appointOnTimeList = [[], [], [], [], [], [], []] // 清空
        appoint_list.map((item, index) => {
          if (item.enable && item.week) {
            this.data.hasAppointOn = true
            let week_list = item.week.split(',')
            if (item.startTime >= item.endTime) {
              // 跨天则将当前预约拆分为两段
              let item_1 = { ...item, endTime: '24:00' }
              week_list.map((week) => {
                const appointOnTimeList = [...this.data.appointOnTimeList]
                appointOnTimeList[week].push(item_1)
                this.data.appointOnTimeList = appointOnTimeList
              })
              let new_week_list = week_list.map((week) => {
                return week == '6' ? 0 : Number(week) + 1
              })
              let item_2 = {
                ...item,
                startTime: '00:00',
                week: new_week_list.join(','),
              }
              new_week_list.map((week) => {
                const appointOnTimeList = [...this.data.appointOnTimeList]
                appointOnTimeList[week].push(item_2)
                this.data.appointOnTimeList = appointOnTimeList
              })
            } else {
              // 不跨天
              week_list.map((week) => {
                const appointOnTimeList = [...this.data.appointOnTimeList]
                appointOnTimeList[week].push(item)
                this.data.appointOnTimeList = appointOnTimeList
              })
            }
          }
        })
      })
      .catch((e) => {
        wx.showToast({ title: '查询数据失败', icon: 'none' })
      })
      .finally(() => {
        loading && wx.hideLoading()
      })
  },

  // 将星期字符串转换为中文周期
  parseWeek(wkStr, isRepeat, legalDate=0) {
    if(legalDate==1){
      return '法定节假日'
    }else if(legalDate==2){
      return '法定工作日'
    }
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
      // week = '周末' // 新增的节假日预约不使用此文案，所以先注释
    } else if (week == '周一 周二 周三 周四 周五 ') {
      // week = '工作日' // 新增的节假日预约不使用此文案，所以先注释
    } else if (week == '周日 周一 周二 周三 周四 周五 周六 ') {
      week = '每天'
    } else if (week == '周一 周二 周三 周四 周五 周六 周日 ') {
      week = '每天'
    } else if (week == '') {
      week = '单次'
    }
    return week
  },

  // 新增预约
  addAppoint() {
    const { isMaxFive, appointOnTimeList, hasAppointOn, isCloudOn, applianceData, setting } = this.data
    if (isMaxFive) {
      wx.showToast({ title: '最多添加五条预约！', icon: 'none' })
      return
    }
    const data = {
      appointOnTimeList,
      hasAppointOn,
      isCloudOn,
      applianceData,
      action: 'add',
      setting,
    }
    // 埋点
    this.rangersBurialPointClick('plugin_button_click', {
      element_content: '添加法定节假日预约',
      custom_params: '',
    })
    //
    wx.navigateTo({
      url: `../addHoliday/index?data=${JSON.stringify(data)}`,
    })
  },

  // 点击预约行进入编辑页面
  itemClick({
    currentTarget: {
      dataset: { item },
    },
  }) {
    const { appointOnTimeList, hasAppointOn, applianceData, isCloudOn, setting } = this.data
    // 从预约开启列表中去除当前预约
    let newAppointOnTimeList = appointOnTimeList.map((week_list) => {
      return week_list.map((appointOnItem) => {
        return appointOnItem.taskId != item.taskId ? appointOnItem : ''
      })
    })
    const data = {
      appointOnTimeList: newAppointOnTimeList,
      taskData: item,
      hasAppointOn,
      isCloudOn,
      applianceData,
      action: 'update',
      setting,
    }
    // 埋点
    this.rangersBurialPointClick('plugin_button_click', {
      element_content: '编辑法定节假日预约',
      custom_params: '',
    })
    //
    wx.navigateTo({
      url: `../addHoliday/index?data=${JSON.stringify(data)}`,
    })
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
        // 埋点
        let params = getModeBuryParams('删除法定节假日预约', item, {})
        this.rangersBurialPointClick('plugin_mode_set_check', params)
        //
        if (res.confirm) {
          this.confirmDelete(item)
        }
      },
    })
  },
  // 删除弹窗确认
  confirmDelete(item) {
    const { setting } = this.data
    const { applianceCode, sn8 } = this.data.applianceData

    if (item.isDefault) {
      wx.showToast({ title: '系统默认预约，暂时无法删除', icon: 'none' })
      return
    }
    // 判断为延时分段还是普通分段
    var appointType = 0
    if (setting.appointType == 'delayPartAppoint') {
      appointType = 1
    }
    requestService
      .request('e2', {
        msg: 'reserve',
        params: {
          applianceId: String(applianceCode),
          platform: sn8,
          action: 'delete',
          flag: appointType, //默认为分段预约，0：分段预约；1：延时预约
          task: [item],
        },
      })
      .then((rs) => {
        this.queryAppoint()
        wx.showToast({ title: '删除成功' })
      })
      .catch((e) => {
        wx.showToast({ title: '预约删除失败', icon: 'none' })
      })
  },

  // 埋点
  rangersBurialPointClick(eventName, param) {
    if (this.data.applianceData) {
      let paramBurial = {}
      let paramBase = {
        module: '插件',
        apptype_name: '电热水器',
        widget_cate: this.data.applianceData.type,
        sn8: this.data.applianceData.sn8,
        sn: this.data.applianceData.sn,
        a0: this.data.applianceData.modelNumber,
        iot_device_id: this.data.applianceData.applianceCode,
        online_status: this.data.applianceData.onlineStatus,
      }
      paramBurial = Object.assign(paramBase, param)
      rangersBurialPoint(eventName, paramBurial)
    }
  },

  // 解决分包后van-swipe-cell渲染问题
  onOpen() {
    this.setData({ showDelete: true })
  },
})
