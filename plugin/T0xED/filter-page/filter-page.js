import { requestService } from '../../../utils/requestService'
import computedBehavior from '../../../utils/miniprogram-computed'
import { pluginEventTrack } from '../../../track/pluginTrack.js'

import { getAssistant } from '../assistant/platform/wechat/plugins/ED/index'
import assistantBehavior from '../assistant/platform/wechat/ability/mixins/index'
let assistant = getAssistant()

Page({
  behaviors: [
    computedBehavior,
    ...assistantBehavior(assistant, ['deviceInfo', 'deviceSetting', 'deviceStatus'], ['$filterReset.setFilterReset']),
  ],

  data: {
    idx: -1,
    buyList: [],
  },
  computed: {
    curPercentage() {
      const { deviceSetting, deviceStatus, idx, deviceInfo } = this.data
      if (deviceSetting && deviceSetting.funcList && deviceInfo && deviceStatus.hasOwnProperty('version') && idx > -1) {
        let curFilter = deviceSetting.funcList.filter((item) => item.key == 'Filter')[idx]
        if (curFilter && curFilter.filterLife) {
          return this.handleFilter(deviceStatus['filter_' + (curFilter.filterNum + 1)], curFilter.filterLife)
        } else if (curFilter && curFilter.filterName === 'HEPA') {
          return deviceStatus['air_filter']
        } else if (curFilter) {
          if (curFilter.filterNum == 2 && (deviceInfo.sn8 == '000000M4' || deviceInfo.sn8 == '0001686A')) {
            return deviceStatus['life_1']
          } else {
            return deviceStatus[`life_${curFilter.filterNum + 1}`]
          }
        } else {
          return 0
        }
      } else {
        return 0
      }
    },
    txtColor() {
      const { deviceSetting, deviceStatus, idx, deviceInfo } = this.data
      if (deviceSetting && deviceSetting.funcList && deviceInfo && deviceStatus.hasOwnProperty('version') && idx > -1) {
        let curPercentage = 0
        let curFilter = deviceSetting.funcList.filter((item) => item.key == 'Filter')[idx]
        if (curFilter && curFilter.filterLife) {
          curPercentage = this.handleFilter(deviceStatus['filter_' + (curFilter.filterNum + 1)], curFilter.filterLife)
        } else if (curFilter && curFilter.filterName === 'HEPA') {
          curPercentage = deviceStatus['air_filter']
        } else if (curFilter) {
          if (curFilter.filterNum == 2 && (deviceInfo.sn8 == '000000M4' || deviceInfo.sn8 == '0001686A')) {
            curPercentage = deviceStatus['life_1']
          } else {
            curPercentage = deviceStatus[`life_${curFilter.filterNum + 1}`]
          }
        } else {
          return '#000000'
        }
        let index = curFilter.filterNum + 1
        let maxDays = curFilter.maxDays
        let dayLife = 0
        if (deviceStatus[`maxlife_${index}`]) {
          //若有上报最大寿命
          dayLife = ((parseInt(curPercentage) / 100) * (deviceStatus[`maxlife_${index}`] * 30)).toFixed()
        } else {
          dayLife = ((parseInt(curPercentage) / 100) * maxDays).toFixed()
        }
        if (
          deviceSetting.hasCountdown &&
          deviceStatus['countdown_filter_' + index] &&
          deviceStatus['countdown_filter_' + index] != 127
        ) {
          dayLife = deviceStatus['countdown_filter_' + index]
        }
        if (dayLife < 30) {
          return 'rgba(255,59,48,1)'
        } else {
          return '#000000'
        }
      } else {
        return '#000000'
      }
    },
    curInfo() {
      const { deviceSetting, idx } = this.data
      if (deviceSetting && deviceSetting.funcList && idx > -1) {
        let filters = deviceSetting.funcList.filter((item) => item.key == 'Filter')
        if (filters[idx] && filters[idx].filterIntro) {
          return filters[idx].filterIntro
        } else {
          return ''
        }
      } else {
        return ''
      }
    },
    filterList() {
      const { deviceSetting, deviceStatus, idx, deviceInfo } = this.data
      if (deviceSetting && deviceSetting.funcList && deviceInfo && deviceStatus.hasOwnProperty('version') && idx > -1) {
        let filters = deviceSetting.funcList.filter((item) => item.key == 'Filter')
        filters.forEach((item, index) => {
          if (item.filterLife) {
            item.percentage = this.handleFilter(deviceStatus['filter_' + (item.filterNum + 1)], item.filterLife)
          } else if (item.filterName === 'HEPA') {
            item.percentage = deviceStatus['air_filter']
          } else {
            if (item.filterNum == 2 && (deviceInfo.sn8 == '000000M4' || deviceInfo.sn8 == '0001686A')) {
              item.percentage = deviceStatus['life_1']
            } else {
              item.percentage = deviceStatus[`life_${item.filterNum + 1}`]
            }
          }
          let leg = item.filterName.length
          item.textSize = leg > 5 ? 22 : leg > 4 ? 24 : leg > 3 ? 32 : 36
          if (deviceStatus['maxlife_' + (item.filterNum + 1)]) {
            //若有上报最大寿命
            item.days = (
              (parseInt(item.percentage) / 100) *
              (deviceStatus['maxlife_' + (item.filterNum + 1)] * 30)
            ).toFixed()
          } else {
            item.days = ((parseInt(item.percentage) / 100) * parseInt(item.maxDays)).toFixed()
          }
          if (
            deviceSetting.hasCountdown &&
            deviceStatus['countdown_filter_' + (item.filterNum + 1)] &&
            deviceStatus['countdown_filter_' + (item.filterNum + 1)] != 127
          ) {
            item.days = deviceStatus['countdown_filter_' + (item.filterNum + 1)]
          }
          if (idx === index) {
            item.bgColor = item.days >= 90 ? '#29C3FF' : item.days >= 30 ? '#FFAA10' : '#FF3B30'
            item.textColor = '#FFFFFF'
          } else {
            item.bgColor = '#F2F2F2'
            item.textColor = '#8A8A8F'
          }
        })
        return filters
      } else {
        return []
      }
    },
    hint() {
      const { deviceSetting, deviceStatus, idx, deviceInfo } = this.data
      if (deviceSetting && deviceSetting.funcList && deviceInfo && deviceStatus.hasOwnProperty('version') && idx > -1) {
        let curPercentage = 0
        let curFilter = deviceSetting.funcList.filter((item) => item.key == 'Filter')[idx]
        if (curFilter && curFilter.filterLife) {
          curPercentage = this.handleFilter(deviceStatus['filter_' + (curFilter.filterNum + 1)], curFilter.filterLife)
        } else if (curFilter && curFilter.filterName === 'HEPA') {
          curPercentage = deviceStatus['air_filter']
        } else if (curFilter) {
          if (curFilter.filterNum == 2 && (deviceInfo.sn8 == '000000M4' || deviceInfo.sn8 == '0001686A')) {
            curPercentage = deviceStatus['life_1']
          } else {
            curPercentage = deviceStatus[`life_${curFilter.filterNum + 1}`]
          }
        } else {
          return ''
        }
        let index = curFilter.filterNum + 1
        let maxDays = curFilter.maxDays
        let dayLife = 0
        if (deviceStatus[`maxlife_${index}`]) {
          //若有上报最大寿命
          dayLife = ((parseInt(curPercentage) / 100) * (deviceStatus[`maxlife_${index}`] * 30)).toFixed()
        } else {
          dayLife = ((parseInt(curPercentage) / 100) * maxDays).toFixed()
        }
        if (
          deviceSetting.hasCountdown &&
          deviceStatus['countdown_filter_' + index] &&
          deviceStatus['countdown_filter_' + index] != 127
        ) {
          dayLife = deviceStatus['countdown_filter_' + index]
        }

        if (dayLife < 30) {
          return `提示：${deviceSetting.deviceKind > 4 ? '滤菌膜' : '滤芯'}${
            dayLife == 0 ? '已' : '即将'
          }到期，请及时更换`
        } else {
          return ''
        }
      } else {
        return ''
      }
    },
    rightValue() {
      const { deviceSetting, deviceStatus, idx, deviceInfo } = this.data
      if (deviceSetting && deviceSetting.funcList && deviceInfo && deviceStatus.hasOwnProperty('version') && idx > -1) {
        let curPercentage = 0
        let filterLists = deviceSetting.funcList.filter((item) => item.key == 'Filter')
        let curFilter = filterLists[idx]
        if (curFilter && curFilter.filterLife) {
          curPercentage = this.handleFilter(deviceStatus['filter_' + (curFilter.filterNum + 1)], curFilter.filterLife)
        } else if (curFilter && curFilter.filterName === 'HEPA') {
          curPercentage = deviceStatus['air_filter']
        } else if (curFilter) {
          if (curFilter.filterNum == 2 && (deviceInfo.sn8 == '000000M4' || deviceInfo.sn8 == '0001686A')) {
            curPercentage = deviceStatus['life_1']
          } else {
            curPercentage = deviceStatus[`life_${curFilter.filterNum + 1}`]
          }
        } else {
          return ''
        }
        let index = curFilter.filterNum + 1
        let maxDays = curFilter.maxDays
        let dayLife = 0
        if (deviceStatus[`maxlife_${index}`]) {
          //若有上报最大寿命
          dayLife = ((parseInt(curPercentage) / 100) * (deviceStatus[`maxlife_${index}`] * 30)).toFixed()
        } else {
          dayLife = ((parseInt(curPercentage) / 100) * maxDays).toFixed()
        }
        if (
          deviceSetting.hasCountdown &&
          deviceStatus['countdown_filter_' + index] &&
          deviceStatus['countdown_filter_' + index] != 127
        ) {
          dayLife = deviceStatus['countdown_filter_' + index]
        }

        if (filterLists.length === 1) {
          return dayLife
        } else if (dayLife < 30) {
          return dayLife == 0 ? '已过期' : '1'
        } else {
          return Math.ceil(Number(dayLife) / 30)
        }
      } else {
        return ''
      }
    },
    rightDesc() {
      const { deviceSetting, deviceStatus, idx, deviceInfo } = this.data
      if (deviceSetting && deviceSetting.funcList && deviceInfo && deviceStatus.hasOwnProperty('version') && idx > -1) {
        let curPercentage = 0
        let filterLists = deviceSetting.funcList.filter((item) => item.key == 'Filter')
        let curFilter = filterLists[idx]
        if (curFilter && curFilter.filterLife) {
          curPercentage = this.handleFilter(deviceStatus['filter_' + (curFilter.filterNum + 1)], curFilter.filterLife)
        } else if (curFilter && curFilter.filterName === 'HEPA') {
          curPercentage = deviceStatus['air_filter']
        } else if (curFilter) {
          if (curFilter.filterNum == 2 && (deviceInfo.sn8 == '000000M4' || deviceInfo.sn8 == '0001686A')) {
            curPercentage = deviceStatus['life_1']
          } else {
            curPercentage = deviceStatus[`life_${curFilter.filterNum + 1}`]
          }
        } else {
          return ''
        }
        let index = curFilter.filterNum + 1
        let maxDays = curFilter.maxDays
        let dayLife = 0
        if (deviceStatus[`maxlife_${index}`]) {
          //若有上报最大寿命
          dayLife = ((parseInt(curPercentage) / 100) * (deviceStatus[`maxlife_${index}`] * 30)).toFixed()
        } else {
          dayLife = ((parseInt(curPercentage) / 100) * maxDays).toFixed()
        }
        if (
          deviceSetting.hasCountdown &&
          deviceStatus['countdown_filter_' + index] &&
          deviceStatus['countdown_filter_' + index] != 127
        ) {
          dayLife = deviceStatus['countdown_filter_' + index]
        }

        if (filterLists.length === 1) {
          return '剩余天数约'
        } else if (dayLife < 30) {
          return dayLife == 0 ? '剩余寿命' : '剩余寿命不足'
        } else {
          return '剩余寿命约'
        }
      } else {
        return ''
      }
    },
    rightUnit() {
      const { deviceSetting, deviceStatus, idx, deviceInfo } = this.data
      if (deviceSetting && deviceSetting.funcList && deviceInfo && deviceStatus.hasOwnProperty('version') && idx > -1) {
        let curPercentage = 0
        let filterLists = deviceSetting.funcList.filter((item) => item.key == 'Filter')
        let curFilter = filterLists[idx]
        if (curFilter && curFilter.filterLife) {
          curPercentage = this.handleFilter(deviceStatus['filter_' + (curFilter.filterNum + 1)], curFilter.filterLife)
        } else if (curFilter && curFilter.filterName === 'HEPA') {
          curPercentage = deviceStatus['air_filter']
        } else if (curFilter) {
          if (curFilter.filterNum == 2 && (deviceInfo.sn8 == '000000M4' || deviceInfo.sn8 == '0001686A')) {
            curPercentage = deviceStatus['life_1']
          } else {
            curPercentage = deviceStatus[`life_${curFilter.filterNum + 1}`]
          }
        } else {
          return ''
        }

        if (filterLists.length === 1) {
          return '天'
        } else {
          return curPercentage == 0 ? '' : '个月'
        }
      } else {
        return ''
      }
    },
  },

  onLoad({ idx }) {
    idx = Number(idx)
    this.setData({ idx })
    this.getBuyLink()
    assistant.setPageTrack({
      page_id: 'page_filter',
      page_name: '滤芯详情页',
    })
  },
  onHide: function () {
    // 页面从前台变为后台时执行
  },
  onUnload: function () {
    // 页面销毁时执行
    assistant.popPageTrack()
  },
  //切换当前滤芯
  changeTab(event) {
    let idx = Number(event.currentTarget.dataset.idx)
    this.setData({ idx })
  },
  //通过滤芯水量转换为滤芯寿命剩余寿命百分比
  handleFilter(real, max) {
    //real实际过水量  max滤芯最大过水量
    real = parseInt(real)
    max = parseInt(max)
    return parseInt(((max - real) / max) * 100, 10) > 0 ? parseInt(((max - real) / max) * 100, 10) : 0
  },
  //获取滤芯购买地址
  getBuyLink() {
    const { deviceInfo } = this.data
    if (!deviceInfo) return
    requestService
      .request('ed', {
        msg: 'getBuyLink',
        params: {
          sn8: deviceInfo.sn8,
        },
      })
      .then(({ data: { result: res } }) => {
        this.setData({
          buyList: res,
        })
      })
  },
  // 滤芯购买
  goBuy() {
    const { deviceSetting, buyList, idx } = this.data
    if (!deviceSetting || idx === -1) return
    const tel = deviceSetting.isHuaLing
      ? 4008899800
      : deviceSetting.type && deviceSetting.type === 'colmo'
      ? 4009699999
      : 4008899315
    let filterList = deviceSetting.funcList.filter((item) => item.key == 'Filter')
    let urlList = []
    // if (buyList.length && deviceSetting.funcList) {
    //   urlList = buyList.filter((v) => v.no == filterList[idx].filterNum)
    // }
    pluginEventTrack('user_behavior_event', null, {
      page_id: 'page_filter',
      page_name: '滤芯详情页',
      widget_id: 'click_buy_filter',
      widget_name: '购买滤芯',
      ext_info: filterList[idx].title,
    })

    if (urlList.length === 1 && urlList[0].weChatLink) {
      wx.navigateToMiniProgram({
        appId: 'wx255b67a1403adbc2',
        path: urlList[0].weChatLink,
      })
    } else if (urlList.length > 1 && urlList[0].weChatLink && urlList[1].weChatLink) {
      wx.showModal({
        title: '选择型号',
        content: deviceSetting.buyFilterCon,
        confirmText: urlList[0].name.split('-')[1],
        cancelText: urlList[1].name.split('-')[1],
        success: (res) => {
          if (res.confirm) {
            wx.navigateToMiniProgram({
              appId: 'wx255b67a1403adbc2',
              path: urlList[0].weChatLink,
            })
          } else if (res.cancel) {
            wx.navigateToMiniProgram({
              appId: 'wx255b67a1403adbc2',
              path: urlList[1].weChatLink,
            })
          }
        },
      })
    } else {
      wx.showModal({
        title: '客户服务',
        content: `因您${
          deviceSetting.deviceKind === 5
            ? '饮水机的滤菌膜'
            : deviceSetting.deviceKind === 6
            ? '茶吧机的滤菌膜'
            : '净水机滤芯'
        }需在线下购买，请拨打电话预约咨询${tel}`,
        confirmText: '呼叫',
        success: (res) => {
          if (res.confirm)
            wx.makePhoneCall({
              phoneNumber: tel + '',
            })
        },
      })
    }
  },
  // 滤芯复位
  resetClick() {
    const { deviceSetting, deviceStatus, idx } = this.data
    if (!deviceSetting || !deviceStatus.hasOwnProperty('version') || idx === -1) return
    if (deviceSetting.standbyReset && (deviceStatus.standby_status == 'off' || deviceStatus.standby_status == 0)) {
      // 6320084F、6320084M、6320084L、6320084W 这四款款跟进电控板子需要做特殊处理
      wx.showToast({
        title: deviceSetting.standbyReset,
        icon: 'none',
        duration: 5000,
      })
    } else if (
      deviceSetting.standbyOrFilteringReset &&
      (deviceStatus.standby_status == 'off' || deviceStatus.standby_status == 0) &&
      (deviceStatus.filter == 'off' || deviceStatus.filter == 0)
    ) {
      // 6320084N 这款款跟进电控板子需要做特殊处理
      wx.showToast({
        title: deviceSetting.standbyOrFilteringReset,
        icon: 'none',
        duration: 5000,
      })
    } else {
      let filterList = deviceSetting.funcList.filter((item) => item.key == 'Filter')
      wx.showModal({
        title: '提示',
        content: `确定已更换新的${filterList[idx].title}，并确认将${filterList[idx].title}寿命复位到100%`,
        success: (res) => {
          if (res.confirm) {
            this.setFilterReset({
              index: Number(filterList[idx].filterNum) + 1,
              title: filterList[idx].title,
            })
          }
        },
      })
    }
  },
})
