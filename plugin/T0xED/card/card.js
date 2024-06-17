/* eslint-disable indent */
const app = getApp()
import { dateFormat } from 'm-utilsdk/index'
import { requestService } from '../../../utils/requestService'
import computedBehavior from '../../../utils/miniprogram-computed'
import images from '../assets/js/img'
import { pluginEventTrack } from '../../../track/pluginTrack.js'

import { getAssistant } from '../assistant/platform/wechat/plugins/ED/index'
import assistantBehavior from '../assistant/platform/wechat/ability/mixins/index'
let assistant = getAssistant()

Component({
  behaviors: [
    computedBehavior,
    ...assistantBehavior(assistant, ['deviceInfo', 'deviceSetting', 'statusNum', 'statusTxt', 'deviceStatus'], []),
  ],
  properties: {},
  data: {
    statusNavBarHeight: app.globalData.statusNavBarHeight, //状态栏高 + 标题栏高
    images,
    remainingCap: '', //剩余水量
    leftWaterRightText: '', //剩余水量右字
    leftWaterDesc: '', //剩余水量小字描述
    leftWaterProcess: 0, //剩余水量百分比
    buyList: [],
  },
  computed: {
    iconColor() {
      let { statusNum } = this.data
      return [3, 5].includes(statusNum) ? '#FFAA10' : '#29C3FF'
    },
    hasLeftWater() {
      const { deviceSetting } = this.data
      if (!deviceSetting || !deviceSetting.funcList) return
      return deviceSetting.funcList.filter((item) => item.key == 'LeftWater').length
    },
    hasFilter() {
      const { deviceSetting } = this.data
      if (!deviceSetting || !deviceSetting.funcList) return
      return deviceSetting.funcList.filter((item) => item.key == 'Filter').length
    },
    filterDataList() {
      const { deviceSetting, deviceInfo, deviceStatus, statusNum } = this.data
      if (!deviceSetting || !deviceSetting.funcList) {
        return []
      }
      let arr = deviceSetting.funcList.filter((item) => item.category === 'Filter')
      let result = arr.map((item) => {
        let percentage = 0
        let dayLife = 0
        let desc = ''
        if (deviceStatus.version && deviceInfo.sn8 && item.key !== 'LeftWater') {
          //确保有数据
          if (item.filterLife) {
            percentage = this.handleFilter(deviceStatus['filter_' + (item.filterNum + 1)], item.filterLife)
          } else if (item.filterName === 'HEPA') {
            percentage = deviceStatus['air_filter']
          } else {
            percentage = deviceStatus['life_' + (item.filterNum + 1)] //直接获取滤芯剩余寿命百分比
            //处理滤芯寿命特殊情况,这两款电控第一、第三根滤芯共用第一根滤芯的字节、第三根滤芯的字节天的是0
            if (item.filterNum === 2 && (deviceInfo.sn8 == '000000M4' || deviceInfo.sn8 == '0001686A')) {
              percentage = deviceStatus['life_1']
            }
          }
          //判断滤芯寿命是否到期
          if (
            deviceSetting.hasCountdown &&
            deviceStatus['countdown_filter_' + (item.filterNum + 1)] &&
            deviceStatus['countdown_filter_' + (item.filterNum + 1)] != 127
          ) {
            dayLife = deviceStatus['countdown_filter_' + (item.filterNum + 1)]
            desc = `预计约${dayLife}天后需要更换`
            if (dayLife == 0) {
              desc = '请立即更换'
            }
          } else {
            if (deviceStatus['maxlife_' + (item.filterNum + 1)]) {
              //若有上报最大寿命
              dayLife = (
                (parseInt(percentage) / 100) *
                (deviceStatus['maxlife_' + (item.filterNum + 1)] * 30)
              ).toFixed()
            } else {
              dayLife = ((parseInt(percentage) / 100) * item.maxDays).toFixed()
            }
            desc = Number(percentage) === 0 ? '请立即更换' : `预计约${dayLife}天后需要更换`
          }
        }
        if (statusNum === 1) {
          return {
            completedColor: '#FF3B30',
            incompletedColor: '#F2F2F2',
            circleVal: 0,
            backgroundColor: '#FFFFFF',
            circleText: '0%',
            textColor: '#333333',
            title: item.title,
            titleColor: '#333333',
            desc: '',
            descColor: '#999999',
          }
        }
        if (item.key === 'LeftWater') {
          percentage = this.data.leftWaterProcess
          desc = this.data.leftWaterDesc
        }
        return {
          completedColor:
            item.key === 'LeftWater'
              ? percentage <= 10
                ? '#FFAA10'
                : '#29C3FF'
              : dayLife >= 90
              ? '#29C3FF'
              : dayLife >= 30
              ? '#FFAA10'
              : '#FF3B30',
          incompletedColor: '#F2F2F2',
          circleVal: percentage,
          backgroundColor: '#FFFFFF',
          circleText: `${
            item.key === 'LeftWater'
              ? this.data.remainingCap
              : deviceStatus.version && percentage == 0
              ? '已过期'
              : percentage + '%'
          }`,
          textColor: deviceStatus.version && percentage == 0 ? '#FF3B30' : '#333333',
          title: item.title,
          titleColor: '#333333',
          desc: desc,
          descColor: deviceStatus.version && percentage == 0 ? '#FF3B30' : '#999999',
        }
      })
      return result
    },
    funcList() {
      const { deviceSetting } = this.data
      if (!deviceSetting || !deviceSetting.funcList) return []
      const curFuncList = [
        'GermicidalHint',
        'Lock',
        'CloudWashLine',
        'WashTea',
        'MultipleQuantify',
        'MultipleTemp',
        'MultipleTemp4Level3',
        'KeepWarm',
        'KeepWarmTime',
        'Heat',
      ]
      let temp = deviceSetting.funcList.filter(
        (item) => !item.category && !(item.key == 'MultipleTemp' && item.jumpUrl) && curFuncList.includes(item.key)
      )
      return temp
    },
    ctrlList() {
      const { deviceSetting } = this.data
      if (!deviceSetting || !deviceSetting.ctrlList) return []
      const curCtrlList = ['Germicidal', 'Wash', 'Bubble']
      return deviceSetting.ctrlList.filter((item) => !item.category && curCtrlList.includes(item.key))
    },
    isShowFilterStatus() {
      const { deviceSetting } = this.data
      if (!deviceSetting || !deviceSetting.funcList) return false
      return deviceSetting.funcList.filter((item) => item.category === 'Filter').length
    },
  },
  observers: {
    hasLeftWater(val) {
      val && this.initLeftWater()
    },
    filterDataList(val) {
      //确保有数据
      if (
        this.data.deviceInfo &&
        this.data.deviceInfo.applianceCode &&
        this.data.deviceStatus &&
        this.data.deviceStatus.version
      ) {
        // wx.removeStorageSync(`${this.data.deviceInfo.applianceCode}-filterHint`)
        let canShow = true
        let now = dateFormat(new Date(), 'yyyy-MM-dd')
        let key = wx.getStorageSync(`${this.data.deviceInfo.applianceCode}-filterHint`)
        if (key && key === now) {
          canShow = false
        }

        if (
          val.length &&
          canShow &&
          val.some((v) => {
            return v.dayLife <= 30
          })
        ) {
          wx.setStorageSync(`${this.data.deviceInfo.applianceCode}-filterHint`, now)
          setTimeout(() => {
            wx.showToast({
              title: '您有滤芯即将到期或已到期，请及时更换',
              icon: 'none',
              duration: 2000,
            })
          }, 1000)
        }
      }
    },
  },
  methods: {
    //通过滤芯水量转换为滤芯寿命剩余寿命百分比
    handleFilter(real, max) {
      //real实际过水量  max滤芯最大过水量
      real = parseInt(real)
      max = parseInt(max)
      // nativeService.alert('real:'+real+' max:'+max);
      return parseInt(((max - real) / max) * 100, 10) > 0 ? parseInt(((max - real) / max) * 100, 10) : 0
    },
    //获取余水数据
    initLeftWater() {
      const { applianceCode, sn8 } = this.data.deviceInfo
      requestService
        .request('ed', {
          msg: 'remainedWaterProbe',
          params: {
            applianceId: String(applianceCode),
            platform: sn8,
            action: 'get',
          },
        })
        .then(({ data: { result: res } }) => {
          if (res.waterTankSetting == null) {
            requestService
              .request('ed', {
                msg: 'remainedWaterProbe',
                params: {
                  applianceId: String(applianceCode),
                  platform: sn8,
                  action: 'setTank',
                  litre: 18.9,
                },
              })
              .then(() => {
                requestService
                  .request('ed', {
                    msg: 'remainedWaterProbe',
                    params: {
                      applianceId: String(applianceCode),
                      platform: sn8,
                      action: 'get',
                    },
                  })
                  .then(({ data: { result: r } }) => {
                    this.setData({
                      leftWaterDesc: `预计剩余天数约 ${r.waterTankSetting.daysLeft} 天`,
                      remainingCap: `${r.waterTankSetting.remainingCap}升`,
                      leftWaterRightText: `${Math.round(
                        (r.waterTankSetting.remainingCap / r.waterTankSetting.litre) * 100
                      )}%`,
                      leftWaterProcess: Math.round((r.waterTankSetting.remainingCap / r.waterTankSetting.litre) * 100),
                    })
                  })
              })
          } else {
            this.setData({
              leftWaterDesc: `预计剩余天数约 ${res.waterTankSetting.daysLeft} 天`,
              remainingCap: `${res.waterTankSetting.remainingCap}升`,
              leftWaterRightText: `${Math.round(
                (res.waterTankSetting.remainingCap / res.waterTankSetting.litre) * 100
              )}%`,
              leftWaterProcess: Math.round((res.waterTankSetting.remainingCap / res.waterTankSetting.litre) * 100),
            })
          }
        })
    },
    //获取滤芯购买地址
    getBuyLink() {
      const { sn8 } = this.data.deviceInfo
      requestService
        .request('ed', {
          msg: 'getBuyLink',
          params: {
            sn8,
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
      if (this.data.statusNum == 1) return
      const { buyList, deviceSetting } = this.data
      const tel = deviceSetting.isHuaLing
        ? 4008899800
        : (deviceSetting.type && deviceSetting.type) === 'colmo'
        ? 4009699999
        : 4008899315

      if (buyList.length) return

      wx.showModal({
        title: '客户服务',
        content: `因您${
          deviceSetting.deviceKind === 5
            ? '饮水机的滤菌膜'
            : deviceSetting.deviceKind === 6
            ? '茶吧机的滤菌膜'
            : '净水器的滤芯'
        }需在线下购买，请拨打电话预约咨询${tel}`,
        confirmText: '呼叫',
        success(res) {
          if (res.confirm)
            wx.makePhoneCall({
              phoneNumber: tel + '',
            })
        },
      })
    },
    //跳转滤芯详情页
    goFilterPage() {
      if (this.data.statusNum == 1) return
      if (this.data.hasLeftWater && !this.data.hasFilter) return
      wx.navigateTo({
        url: `../filter-page/filter-page?idx=0`,
        events: {},
        success: function () {},
      })
    },
    onSelectFilterBuyLinkPickerChange({ detail: { value } }) {
      const { buyList, deviceSetting } = this.data
      const tel = deviceSetting.isHuaLing
        ? 4008899800
        : deviceSetting.type && deviceSetting.type === 'colmo'
        ? 4009699999
        : 4008899315
      const selectItem = buyList[value]
      if (selectItem.weChatLink) {
        wx.navigateToMiniProgram({
          appId: 'wx255b67a1403adbc2',
          path: selectItem.weChatLink,
        })
      } else {
        wx.showModal({
          title: '客户服务',
          content: `因您${
            deviceSetting.deviceKind === 5
              ? '饮水机的滤菌膜'
              : deviceSetting.deviceKind === 6
              ? '茶吧机的滤菌膜'
              : '净水器的滤芯'
          }需在线下购买，请拨打电话预约咨询${tel}`,
          confirmText: '呼叫',
          success(res) {
            if (res.confirm)
              wx.makePhoneCall({
                phoneNumber: tel + '',
              })
          },
        })
      }
      pluginEventTrack('user_behavior_event', null, {
        page_id: 'page_control',
        page_name: '插件首页',
        widget_id: 'click_buy_filter_confirm',
        widget_name: '确定购买滤芯',
        ext_info: selectItem.name,
      })
    },
    onCancelFilterBuyLinkPicker() {
      pluginEventTrack('user_behavior_event', null, {
        page_id: 'page_control',
        page_name: '插件首页',
        widget_id: 'click_buy_filter_cancel',
        widget_name: '取消购买滤芯',
      })
    },
  },
})
