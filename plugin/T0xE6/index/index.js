// plugin/T0xE6/index/index.js
import computedBehavior from '../../../utils/miniprogram-computed'
import settingBehavior from '../assets/js/setting'
import images, { newPre } from '../assets/js/img'
import { getReqId, getStamp } from 'm-utilsdk/index'
import { requestService } from '../../../utils/requestService'
import { pluginEventTrack } from '../../../track/pluginTrack'

Component({
  behaviors: [settingBehavior, computedBehavior],

  data: {
    // type: '', // 美的：default，COLMO:colmo
    deviceInfo: null,
    isInitFinish: false,
    isShowModePicker: false,
    showTemPicker: false,
    tempSettingRangeArr: [0],
    tempSettingPickerIndex: [0],
    tabSelect: 0,
    images,
    isCloudOn: false, // 云管家开启状态
    isCloudDelay: false, // 云管家暂停状态
    timeLeft: 0, // 云管家暂停剩余时间
    hasEnabledOrder: false, // 有无预约
    appointList: [],
    appData: {},
  },

  computed: {
    errorContent() {
      let errorContent = ''
      switch (this.data.appData?.error_code) {
        case 1:
          errorContent = 'E1 点火失败'
          break
        case 2:
          errorContent = 'E1 意外熄火'
          break
        case 3:
          errorContent = 'E2 伪火'
          break
        case 4:
          errorContent = 'E2 残火'
          break
        case 5:
          errorContent = 'E3 机械温控器\n过热保护'
          break
        case 6:
          errorContent = 'E4 采暖出水温度探头\n过热保护'
          break
        case 7:
          errorContent = 'E5 风压故障或风机故障'
          break
        case 8:
          errorContent = 'E6 电磁阀驱动电路故障'
          break
        case 9:
          errorContent = 'E7 水压故障'
          break
        case 10:
          errorContent = 'E8 水泵卡死'
          break
        case 11:
          errorContent = 'F0 供暖出水温度\n传感器短路'
          break
        case 12:
          errorContent = 'F0 供暖出水温度\n传感器断路'
          break
        case 13:
          errorContent = 'F2 结冰故障'
          break
        case 14:
          errorContent = 'F3 卫浴出水温度\n传感器短路'
          break
        case 15:
          errorContent = 'F3 卫浴出水温度\n传感器断路'
          break
        case 16:
          errorContent = 'F4 供暖出水温度异常,\n探头脱落'
          break
        case 17:
          errorContent = 'F5 卫浴出水温度异常,\n探头脱落'
          break
        case 18:
          errorContent = 'EF 冷凝水堵塞'
          break
        case 19:
          errorContent = 'FE 燃气泄漏故障'
          break
        // case 19: errorContent = 'FE 卫浴出水温度异常,\n传感器断路'; break; //测试
        case 20:
          errorContent = 'EC 主板和显示板\n通信失败'
          break
        case 21:
          errorContent = 'EE 卫浴超时'
          break
        case 22:
          errorContent = 'EA CO报警'
          break

        case 23:
          errorContent = 'C5 水路堵塞故障'
          break

        case 31:
          errorContent = 'C1 残火'
          break
        case 32:
          errorContent = 'C0 点火失败'
          break
        case 33:
          errorContent = 'C4 零冷水故障'
          break
        default:
          errorContent = '故障'
      }
      return errorContent
    },

    // 当前采暖状态，同一时刻的值唯一，避免由于参数更新或渲染先后导致的组件状态差异。数值越大优先级越高 0:采暖待机中 1:采暖加热中 4:采暖关 5:关机 6:故障 7:离线 8:无数据
    heatStatus() {
      if (this.data.deviceInfo?.onlineStatus == 0) {
        return 7 // 离线
      } else if (this.data.appData?.error_code && this.data.appData?.error_code != 0) {
        return 6 // 故障
      } else if (this.data.appData?.power == 'off') {
        return 5 // 关机
      } else {
        if (this.data.appData?.winter_mode === 'off') {
          return 4 // 采暖关
        } else {
          if (this.data.appData?.flame_feedback == 'on' && this.data.appData?.tee_valve_output == 'heat_side') {
            return 1 // 采暖加热中
          } else {
            return 0 // 采暖待机
          }
        }
      }
    },

    // 当前卫浴状态，同一时刻的值唯一，避免由于参数更新或渲染先后导致的组件状态差异。数值越大优先级越高 0:卫浴待机中 1:卫浴加热中 5:关机 6:故障 7:离线 8:无数据
    bathStatus() {
      if (this.data.deviceInfo?.onlineStatus == 0) {
        return 7 // 离线
      } else if (this.data.appData?.error_code && this.data.appData?.error_code != 0) {
        return 6 // 故障
      } else if (this.data.appData?.power == 'off') {
        return 5 // 关机
      } else {
        // 卫浴状态处理
        if (this.data.appData?.flame_feedback === 'on' && this.data.appData?.tee_valve_output === 'bath_side') {
          return 1 // 卫浴加热中
        } else {
          return 0 // 卫浴待机
        }
      }
    },

    tempSettingValue() {
      try {
        if (this.data.tabSelect == 1) {
          return (this.data.appData?.current_bath_set_temperature || '--') + '℃'
        }

        return this.data.isCloudOn && !this.data.isCloudDelay
          ? '未生效'
          : this.data.curSetTemp[this.data.tabSelect] + '℃'
      } catch {}
      return ''
    },

    tempSettingCellLabel() {
      if (this.data.tabSelect == 1) {
        return ''
      }

      if (this.data.isCloudDelay) {
        return this.data.isCloudOn
          ? '自定义温度中，' +
              Math.floor(+this.data.timeLeft / 60) +
              '小时' +
              (+this.data.timeLeft % 60) +
              '分后启动云管家'
          : ''
      } else {
        return this.data.isCloudOn ? '云管家已启动，自动控温中' : '' //云管家已关闭，需要手动开启
      }
    },

    // 为 true 的时候设置温度有toast提示
    tempSettingDisabled() {
      if (this.data.tabSelect == 0) {
        const isSaveOut = this.data.setting?.heatModeList?.find((mode_item) => mode_item.title == '外出节能')
        if ((this.data.appData?.mode == 'out_mode' && isSaveOut) || (this.data.appData?.heat_mode == 1 && isSaveOut)) {
          // 已开启外出节能
          this.tempSettingDisabledText = '外出节能模式已开启，不可调节温度'
          return true
        } else if (this.data.isCloudOn) {
          // 云查询 已开启云管家
          this.tempSettingDisabledText = '已开启云管家，请到美居APP操作'
          return true
        } else if (this.data.hasEnabledOrder && this.data.setting?.heatAppointType == 'curve') {
          // 云查询 已开启预约曲线
          this.tempSettingDisabledText = '已开启预约曲线，请到美居APP操作'
          return true
        }
      } else {
        if (this.data.appData?.bath_mode == 10) {
          this.tempSettingDisabledText = '智温感不能设置温度，如需设置，请切换至其他模式'
          return true
        }
      }

      this.tempSettingDisabledText = ''
      return false
    },

    appointCellText() {
      if (this.data.setting?.heatAppointType == 'curve') return ''
      if (this.data.hasEnabledOrder) {
        return this.data.appointList
          .sort((a, b) => +a.startTime.replace(/:/g, '') - +b.startTime.replace(/:/g, ''))
          .find((item) => item.enable).startTime
      }

      return '无预约'
    },

    disabledStatus() {
      return this.data.tabSelect == 1 ? this.data.bathStatus >= 5 : this.data.heatStatus >= 4
    },

    powerCellText() {
      return (
        {
          0: {
            0: '保温中',
            1: '加热中',
            4: '采暖关，请到美居APP操作',
            5: '已关机',
            6: `故障 ·  ${this.data.errorContent}`,
            7: '离线',
            8: '无数据',
          },
          1: {
            0:
              this.data.setting?.coldWaterMaster && this.data.appData.cold_water_master == 'on'
                ? '零冷水 · 保温中'
                : '待机中',
            1: `${
              this.data.setting?.coldWaterMaster && this.data.appData.cold_water_master == 'on' ? '零冷水 · ' : ''
            }加热中`,
            5: '已关机',
            6: `故障 ·  ${this.data.errorContent}`,
            7: '离线',
            8: '无数据',
          },
        }[this.data.tabSelect][this.data.tabSelect == 0 ? this.data.heatStatus : this.data.bathStatus] ?? ''
      )
    },

    curSetTemp() {
      if (!Object.keys(this.data.appData).length) {
        return ['--', '--']
      }
      return [this.data.appData.current_heat_set_temperature, this.data.appData.current_bath_set_temperature]
    },

    outWaterTemp() {
      if (!Object.keys(this.data.appData).length) {
        return ['--', '--']
      }
      return [
        this.data.appData.heat_out_water_temperature,
        this.data.bathStatus == 1 ? this.data.appData.bath_out_water_temperature : '--',
      ]
    },

    // statusOff() {
    //   return [this.data.heatStatus >= 4, this.data.bathStatus >= 5]
    // },

    // statusHeating() {
    //   return [this.data.heatStatus == 1, this.data.bathStatus == 1]
    // },

    // 模式 list
    // modeList() {
    //   return [this.data.setting?.heatModeList, this.data.setting?.bathModeList][
    //     this.data.tabSelect
    //   ]?.map(mode_item => {
    //     const mode_key = mode_item.key.indexOf('Old') > -1 ? 'mode' : 'heat_mode'
    //     const isSelected = mode_item.value == this.data.appData[mode_key]
    //     return {
    //       ...mode_item,
    //       isSelected,
    //     }
    //   })
    // },

    // 当前模式名称
    // currentModeName() {
    //   return this.data.modeList?.find(item => item.isSelected)?.title ?? '--'
    // },

    // setting.[heat|bath]FuncList: {key: string}[]
    funcList() {
      return [this.data?.setting?.heatFuncList, this.data?.setting?.bathFuncList][this.data.tabSelect]
    },

    // 采暖-温度设置
    hasTempSetting() {
      return !!this.data.funcList?.find((i) => i.key == 'heatTempSetting' || i.key === 'bathTempSetting')
    },

    // 采暖-温度预约 temp：温度，mode:温度+模式，curve：曲线。不做曲线。
    hasHeatAppointType() {
      return (
        this.data.tabSelect == 0 &&
        !!this.data.setting?.heatAppointType &&
        this.data.setting?.heatAppointType != 'curve'
      )
    },

    // 卫浴-零冷水开关
    hasWaterMaster() {
      return this.data.tabSelect == 1 && !!this.data.setting?.coldWaterMaster
    },

    // 卫浴-零冷水开关状态
    coldWaterSwitch() {
      return this.data.appData?.cold_water_master == 'on'
    },
  },

  observers: {
    // statusOff statusHeating
    'heatStatus, bathStatus'(heatStatus, bathStatus) {
      setTimeout(() =>
        this.setData({
          statusOff: [heatStatus >= 4, bathStatus >= 5],
          statusHeating: [heatStatus == 1, bathStatus == 1],
        })
      )
    },

    // tempSettingPickerIndex modeList currentModeName tempSettingCellAddTitle
    'appData, tabSelect'(appData, tabSelect) {
      setTimeout(() => {
        const modeList = [this.data.setting?.heatModeList, this.data.setting?.bathModeList][tabSelect]?.map(
          (mode_item) => {
            let isSelected = false
            if (tabSelect == 0) {
              const mode_key = mode_item.key.indexOf('Old') > -1 ? 'mode' : 'heat_mode'
              isSelected = mode_item.value == appData[mode_key]
            } else {
              // let desc = mode_item.desc + (mode_item.custom && appData.exclusive_temperature ? `${appData.exclusive_temperature}℃` : '') // 专属模式需标注温度
              isSelected = mode_item.value == appData.bath_mode
              // 特殊处理，旧协议
              if (!this.data.setting.isNew) {
                const isPersonOneOldOn = appData.exclusive_temperature == appData.current_bath_set_temperature
                const istempSenseOldOn = appData.temperature_sensation_switch == 'on'
                if (mode_item.key == 'bathNormalOld') {
                  // 旧协议非随温感和专属模式，就默认为普通模式
                  isSelected = !isPersonOneOldOn && !istempSenseOldOn
                } else if (mode_item.key == 'tempSenseOld') {
                  // 旧随温感
                  isSelected = istempSenseOldOn
                } else if (mode_item.key == 'personOneOld') {
                  // 旧协议专属水温，判断温度等于专属水温即为开启
                  isSelected = isPersonOneOldOn
                }
              }
            }

            if (!mode_item.pic.includes('meiju-lite-assets')) {
              mode_item.pic = newPre + mode_item.pic.replace(/\.\/assets\/image/g, '')
            }

            return {
              ...mode_item,
              isSelected,
            }
          }
        )
        this.initSelections()
        const currentModeName = modeList?.find((item) => item.isSelected)?.title ?? '普通模式'
        const tempSettingPickerIndex = this.data.tempSettingRangeArr[0]?.findIndex(
          (item) => item == this.data.curSetTemp[tabSelect]
        )
        this.setData({
          tempSettingPickerIndex: tempSettingPickerIndex > -1 ? [tempSettingPickerIndex] : [0],
          modeList,
          currentModeName,
          tempSettingCellAddTitle: (() => {
            if (this.data.tabSelect == 1) {
              return ''
            }
            return this.data.appData.heat_appointment_switch == 'on'
              ? '(预约中)'
              : currentModeName == '普通模式'
              ? ''
              : `(${currentModeName})`
          })(),
        })
      })
    },
  },

  methods: {
    onLoad(options) {
      wx.showLoading({ title: '加载中', mask: true })
      if (this.initDeviceInfo(options.deviceInfo)) {
        this.initSetting()
        this.initDeviceStatus(true) // hideLoading
        setInterval(() => this.initDeviceStatus(), 6000)
      }
    },

    // 初始化 设备信息
    initDeviceInfo(deviceInfo) {
      if (!deviceInfo) {
        wx.showToast({ title: '插件信息错误', icon: 'error' })
        setTimeout(wx.navigateBack, 1200)
        return false
      }
      const parseObj = JSON.parse(decodeURIComponent(deviceInfo))
      parseObj.applianceCode = parseObj.applianceCode.toString()
      this.setData({ deviceInfo: parseObj })
      return true
    },

    //初始化 setting 配置
    initSetting() {
      this.getSetting(this.data.deviceInfo.sn8)
    },

    // 初始化 设备运行状态
    async initDeviceStatus(showLoading = false) {
      if (this.initDeviceStatusBusy) return
      this.initDeviceStatusBusy = true

      showLoading && wx.showLoading({ title: '加载中', mask: true })
      return Promise.all([this.luaQuery(false), this.getTimeLeft(), this.queryAppoint(), this.getCloudSwitch()])
        .then(
          () =>
            this.heatAppointPageEventChannel &&
            this.heatAppointPageEventChannel.emit('initPageData', {
              setting: this.data.setting,
              deviceInfo: this.data.deviceInfo,
              appData: this.data.appData,
              isCloudOn: this.data.isCloudOn,
              hasAppointOn: this.data.hasEnabledOrder,
              appointList: this.data.appointList,
            })
        )
        .finally(() => {
          this.initDeviceStatusBusy = false
          this.setData({ isInitFinish: true })
          wx.hideLoading()
        })
    },

    // 采暖卫浴切换
    bindHeatBathChange({
      currentTarget: {
        dataset: { tab },
      },
    }) {
      this.setData({ tabSelect: tab })
      //页面浏览埋点:采暖/卫浴切换浏览次数
      pluginEventTrack(
        'user_page_view',
        null,
        {
          page_id: 'page_index_index',
          page_name: '插件首页',
          bd_name: '壁挂炉',
        },
        {}
      )
    },

    // 设备开关机
    async togglePower() {
      if (this.data.bathStatus == 6 || this.data.heatStatus == 6) return

      let mode = ''
      if (this.data.appData.power == 'on') {
        mode = await new Promise((resolve) =>
          wx.showModal({
            title: '关机提示',
            content: `采暖及卫浴会全部关闭，${this.data.hasEnabledOrder ? '且预约不会执行，' : ''}是否关闭？`,
            success: ({ confirm, cancel }) => {
              resolve(confirm ? 'off' : '')
            },
          })
        )
      } else {
        mode = 'on'
      }
      mode &&
        this.luaControl({ power: mode }).finally(() => {
          // 埋点上报
          pluginEventTrack('user_behavior_event', null, {
            page_id: 'page_control',
            page_name: '插件首页',
            widget_id: 'click_power',
            widget_name: '电源开关',
            ext_info: mode === 'on' ? '开' : '关',
          })
        })
    },

    // 温度设置互斥情况toast
    onCellClick() {
      if (this.data.disabledStatus) return
      if (this.tempSettingDisabledText == '已开启预约曲线，请到美居APP操作') {
        wx.showModal({
          title: '温馨提示',
          content: '预约已开启，此操作将关闭所有预约，确定执行吗？',
          success: ({ confirm }) => {
            if (confirm) {
              wx.showLoading({ title: '加载中', mask: true })
              this.closeAppoint().finally(() => this.initDeviceStatus(true))
            }
          },
        })
        return
      }
      this.tempSettingDisabledText && wx.showToast({ title: this.tempSettingDisabledText, icon: 'none' })
      this.setData({ showTemPicker: true })
    },
    initSelections() {
      //加载温度区间
      const tempSettingRangeArr = []
      if (Object.keys(this.data.appData).length) {
        const MIN_MAX =
          this.data.tabSelect == 0
            ? [+this.data.appData.heat_set_temperature_min, +this.data.appData.heat_set_temperature_max]
            : [+this.data.appData.bath_set_temperature_min, +this.data.appData.bath_set_temperature_max]
        for (let i = 0; i < MIN_MAX[1] - MIN_MAX[0] + 1; i++) {
          tempSettingRangeArr.push(MIN_MAX[0] + i)
        }
      }
      this.setData({ 'tempSettingRangeArr[0]': tempSettingRangeArr })
    },
    handleCancel() {
      this.setData({ showTemPicker: false })
    },
    // bindTempSettingPickerTap() {
    //   if (this.data.disabledStatus) return
    //   if (this.tempSettingDisabledText == '已开启预约曲线，请到美居APP操作') {
    //     wx.showModal({
    //       title: '温馨提示',
    //       content: '预约已开启，此操作将关闭所有预约，确定执行吗？',
    //       success: ({ confirm }) => {
    //         if (confirm) {
    //           wx.showLoading({ title: '', mask: true })
    //           this.closeAppoint().finally(() => this.initDeviceStatus(true))
    //         }
    //       },
    //     })
    //     return
    //   }
    //   this.tempSettingDisabledText && wx.showToast({ title: this.tempSettingDisabledText, icon: 'none' })
    // },

    // 发送温度设置指令
    async bindTempSettingPickerChange(e) {
      if (this.data.disabledStatus) return
      const value = this.data.tempSettingRangeArr[0][e.detail[0]]
      if (value == this.data.curSetTemp[this.data.tabSelect]) return

      if (this.data.tabSelect == 1) {
        if (
          this.data.appData.flame_feedback === 'on' &&
          this.data.appData.tee_valve_output === 'bath_side' &&
          +this.data.appData.current_bath_set_temperature <= 50 &&
          +value > 50
        ) {
          wx.showToast({
            title: '卫浴加热中，为防止烫伤，启动安全温度调节(不能高于50℃)',
            icon: 'none',
          })
          return
        }
        // 埋点上报
        pluginEventTrack('user_behavior_event', null, {
          page_id: 'page_control',
          page_name: '插件首页',
          widget_id: 'current_bath_set_temperature',
          widget_name: '卫浴调温',
          ext_info: `${value}℃`,
        })
        this.luaControl({
          current_bath_set_temperature: value,
          // buzzing_switch: 'buzzing', // 蜂鸣器
        }).then(() => {
          if (!this.data.setting.isNew) {
            // =================== 旧款
            this.data.appData.temperature_sensation_switch == 'on' && wx.showToast({ title: '沐浴随温已关闭' })
          } else {
            // =================== R55后新款
            this.data.appData.bath_mode == 2 && wx.showToast({ title: '沐浴随温已关闭' })
          }
        })
      } else {
        if (this.data.appData.heat_appointment_switch == 'on') {
          // 关闭执行中的预约
          await new Promise((resolve) =>
            this.luaControl({
              heat_appointment_switch: 'off',
              buzzing_switch: 'no_buzzing',
            })
              .then(() => {
                if (this.data.setting.heatAppointType == 'temp' || this.data.setting.heatAppointType == 'mode') {
                  wx.showToast({
                    title: '执行中预约已自动关闭',
                    icon: 'none',
                  })
                }
              })
              .finally(() => setTimeout(resolve, 1111))
          )
        }
        this.luaControl({
          current_heat_set_temperature: value,
          buzzing_switch: 'buzzing', // 蜂鸣器
        })
      }
      this.setData({ showTemPicker: false })
      // 埋点上报
      pluginEventTrack('user_behavior_event', null, {
        page_id: 'page_control',
        page_name: '插件首页',
        widget_id: 'current_heat_set_temperature',
        widget_name: '采暖调温',
        ext_info: `${value}℃`,
      })
    },

    /* 模式相关 */
    // 打开模式选择
    openModePopup() {
      if (this.data.disabledStatus) return
      this.setData({ isShowModePicker: true })
    },
    // 关闭模式选择 picker
    closeModePicker() {
      this.setData({ isShowModePicker: false })
    },
    // 选择模式
    async selectMode({
      currentTarget: {
        dataset: { item },
      },
    }) {
      // if (item.isSelected && item.key != 'personOneOld') {
      //   return this.closeModePicker()
      // }

      // 采暖
      if (this.data.tabSelect == 0) {
        const modeKey = this.data.setting.heatModeList.find((item) => item.key.indexOf('Old') > -1)
          ? 'mode'
          : 'heat_mode'

        if (this.data.modeList.length == 1) {
          // 只有一个模式
          if (item.isSelected) {
            // 二次点击切换普通模式
            item =
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
          }
        }

        if (item.isSelected) {
          return this.closeModePicker()
        }

        let confirm = true
        let buzzing = true
        // 云管家 confirm
        const otherMode = modeKey == 'heat_mode' ? item.value != '0' : item.value != 'normal_mode'

        if (otherMode && this.data.isCloudOn) {
          confirm = await new Promise((resolve) =>
            wx.showModal({
              title: '温馨提示',
              content: '此操作将关闭云管家！确定执行吗？',
              success: async ({ confirm }) => {
                confirm && (await this.switchCloudAi(0))
                resolve(confirm)
              },
            })
          )
        }

        // 预约 confirm
        if (otherMode && this.data.hasEnabledOrder) {
          confirm = await new Promise((resolve) =>
            wx.showModal({
              title: '温馨提示',
              content: '此操作将关闭所有预约！确定执行吗？',
              success: async ({ confirm }) => {
                confirm && (await this.closeAppoint())
                resolve(confirm)
              },
            })
          )
        }

        if (!confirm) return
        buzzing = confirm

        // 执行中预约 先强制关闭
        if (this.data.appData.heat_appointment_switch == 'on') {
          await this.luaControl(
            {
              heat_appointment_switch: 'off',
              buzzing_switch: buzzing ? 'buzzing' : 'no_buzzing',
            },
            false
          )
          buzzing = false
          wx.showToast({ title: '执行中预约已自动关闭' })
        }

        // need no await
        this.luaControl({
          [modeKey]: item.value,
          buzzing_switch: buzzing ? 'buzzing' : 'no_buzzing',
        })
        // 埋点上报
        pluginEventTrack('user_behavior_event', null, {
          page_id: 'page_control',
          page_name: '插件首页',
          widget_id: 'click_heat_mode',
          widget_name: '采暖模式',
          ext_info: `选择的模式${item.value}`,
        })
        const isSmart = this.data.setting.heatModeList.some((i) => i.key.indexOf('smart') > -1)
        let newErrorTip = ''
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
      } else {
        if (item.isSelected && item.key != 'personOneOld') {
          return this.closeModePicker()
        }

        const bathHeating =
          this.data.appData.flame_feedback === 'on' && this.data.appData.tee_valve_output === 'bath_side'
        const isNew = this.data.setting.isNew

        if (bathHeating && isNew) {
          wx.showToast({ title: '卫浴加热中，为防止烫伤，不能切换模式', icon: 'none' })
          return this.closeModePicker()
        }
        if (
          bathHeating &&
          item.title == '专属水温' &&
          +this.data.appData.current_bath_set_temperature <= 50 &&
          +this.data.appData.exclusive_temperature > 50
        ) {
          // 卫浴加热中且专属水温大于50时不能切换
          wx.showToast({
            title: '卫浴加热中，为防止烫伤，启动安全温度调节(不能高于50℃)',
            icon: 'none',
          })
          return this.closeModePicker()
        } else if (
          (item.key == 'tempSenseOld' || item.key == 'tempSense') &&
          this.data.appData.bath_back_water_temp > 100
        ) {
          wx.showToast({ title: '卫浴进水温度传感器故障 无法开启“沐浴随温”模式', icon: 'none' })
          return this.closeModePicker()
        }

        let params = {}
        if (item.key == 'bathNormalOld') {
          // 旧协议普通模式，非随温感和专属模式，就默认为普通模式
          if (this.data.setting.hasBathNormalMemory) {
            params['temperature_sensation_switch'] = 'off'
          } else {
            params['current_bath_set_temperature'] = 42
          }
        } else if (item.key == 'tempSenseOld') {
          // 旧协议随温感
          params['temperature_sensation_switch'] = 'on'
        } else if (item.key == 'personOneOld') {
          // 旧协议专属水温，判断温度等于专属水温即为开启
          params['current_bath_set_temperature'] = this.data.appData.exclusive_temperature
        } else if (item.key == 'personOne') {
          // 新协议专属水温，有单独的指令
          params = {
            exclusive_temperature: this.data.appData.exclusive_temperature,
            exclusive_temperature_switch: 'on',
          }
          // actionParams.custom_params = { temp: this.appData.exclusive_temperature + '℃'}
        } else {
          // 新协议其他模式
          params['bath_mode'] = item.value
        }
        this.luaControl(params)
        // 埋点上报
        pluginEventTrack('user_behavior_event', null, {
          page_id: 'page_control',
          page_name: '插件首页',
          widget_id: 'click_bath_mode',
          widget_name: '卫浴模式',
          ext_info: `选择的模式${item.value}`,
        })
      }

      this.closeModePicker()
    },
    /* 模式相关 */

    /* 云管家相关 */
    // 开启/关闭云管家
    switchCloudAi(p) {
      return requestService
        .request('e6', {
          msg: 'cloudManagerSwitch',
          params: {
            applianceId: this.data.deviceInfo.applianceCode,
            action: 'set',
            switch: p,
          },
        })
        .then(({ data }) => data.retCode == 0 && this.setData({ isCloudOn: p == 1 }))
        .finally(() => {
          // 埋点上报
          pluginEventTrack('user_behavior_event', null, {
            page_id: 'page_control',
            page_name: '插件首页',
            widget_id: 'click_cloud_home',
            widget_name: '云管家',
            ext_info: p == 1 ? '开' : '关',
          })
        })
    },
    // 查询云管家暂停3小时倒计时
    getTimeLeft() {
      return requestService
        .request('e6', {
          msg: 'cloudManagerManualSetTemp',
          params: {
            applianceId: this.data.deviceInfo.applianceCode,
            action: 'get',
            temp: 0, // 要传数值不传没反应
          },
        })
        .then(({ data }) => {
          if (data.retCode == '0') {
            this.setData({
              isCloudDelay: data.result.switch !== 0,
              timeLeft: data.result.minutesLeft,
            })
          }
          return data
        })
    },
    // 获取云管家开关状态
    getCloudSwitch() {
      return requestService
        .request('e6', {
          msg: 'cloudManagerSwitch',
          params: {
            applianceId: this.data.deviceInfo.applianceCode,
            action: 'get',
          },
        })
        .then(({ data }) => {
          if (data.retCode == '0') {
            this.setData({ isCloudOn: data.result.switch == 1 })
          }
          return data
        })
    },
    /* 云管家相关 */

    /* 预约相关 */
    // 查询预约数据
    // 跳转到预约页面
    navigateToHeatAppoint() {
      if (this.data.disabledStatus) return

      wx.navigateTo({
        url: './../heat-appoint/index',
        events: {
          luaControl: (params) => this.luaControl(params),
          refreshData: () => this.initDeviceStatus(),
          switchCloudAi: (enable) => this.switchCloudAi(enable),
        },
        success: (res) => {
          this.heatAppointPageEventChannel = res.eventChannel
          this.heatAppointPageEventChannel.emit('initPageData', {
            setting: this.data.setting,
            deviceInfo: this.data.deviceInfo,
            appData: this.data.appData,
            isCloudOn: this.data.isCloudOn,
            hasAppointOn: this.data.hasEnabledOrder,
            appointList: this.data.appointList,
          })
        },
      })
    },
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
          }
          return data
        })
    },
    //关闭所有预约
    closeAppoint() {
      return requestService
        .request('e6', {
          msg: 'disableAllReserve',
          params: {
            applianceId: this.data.deviceInfo.applianceCode,
            current_heat_set_temperature: this.data.appData.current_heat_set_temperature,
          },
        })
        .then(({ data }) => {
          if (data.retCode == '0') {
            this.queryAppoint()
          }
          // 埋点上报
          pluginEventTrack('user_behavior_event', null, {
            page_id: 'page_control',
            page_name: '插件首页',
            widget_id: 'click_disableAllReserve',
            widget_name: '采暖预约',
            ext_info: '关闭所有预约',
          })
        })
    },
    /* 预约相关 */

    // 零冷水开关
    switchColdWater() {
      if (this.data.disabledStatus) return
      if (this.data.appData.current_bath_water >= 27 && this.data.appData?.cold_water_master != 'on') {
        if (!this.data.setting.noColdWaterMasterLinit) {
          // 去掉空壳机提示水流量，让空可以继续执行零冷水开关
          return wx.showToast({ title: '机器有水流量，无法开启！', icon: 'none' })
        }
      }
      this.luaControl({ cold_water_master: 'on' })
      // 埋点上报
      pluginEventTrack('user_behavior_event', null, {
        page_id: 'page_control',
        page_name: '插件首页',
        widget_id: 'click_cold_water_master',
        widget_name: '单次零冷水',
        ext_info: this.data.appData.cold_water_master == 'on' ? '开' : '关',
      })
    },

    clickDownload() {
      wx.navigateTo({ url: '/pages/download/download' })
    },

    // 查询设备运行数据
    luaQuery(loading = true, setAppData = true) {
      loading && wx.showLoading({ title: '加载中', mask: true })
      return requestService
        .request('luaGet', {
          reqId: getReqId(),
          stamp: getStamp(),
          applianceCode: this.data.deviceInfo.applianceCode,
          command: {},
        })
        .then((res) => {
          if (res.data.code == 0) {
            setAppData && this.setData({ appData: res.data.data })
            return res.data.data
          }
          return Promise.reject(res)
        })
        .catch((error) => {
          if (error && error.data) {
            if (error.data.code == 1307) {
              //离线
              this.setData({ 'deviceInfo.onlineStatus': 0 })
            }
          }
          return Promise.reject(error)
        })
        .finally(() => loading && wx.hideLoading())
    },

    // 发送设备控制指令
    luaControl(param, setAppData = true) {
      wx.showLoading({ title: '加载中', mask: true })
      return requestService
        .request('luaControl', {
          reqId: getReqId(),
          stamp: getStamp(),
          applianceCode: this.data.deviceInfo.applianceCode,
          command: { control: param },
        })
        .then((res) => {
          if (res.data.code == 0) {
            setAppData && this.luaQuery(false)
            return res.data.data.status || {}
          }

          return Promise.reject(res)
        })
        .catch((error) => {
          wx.showToast({ title: '请求失败，请稍后重试', icon: 'none' })
          return Promise.reject(error)
        })
        .finally(wx.hideLoading)
    },
  },
})
