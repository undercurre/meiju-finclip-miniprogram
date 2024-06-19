import { Format } from './format'
const app = getApp()

const rangersBurialPoint = app.getGlobalConfig().rangersBurialPoint
import MideaToast from '../component/midea-toast/toast'

export class Utils {
  // 检查能否启动
  static isEnabledToStart(applianceType, deviceInfo) {
    let rtn = true
    switch (applianceType) {
      case '0x32':
        if (deviceInfo.isError) {
          MideaToast('设备故障中')
          rtn = false
          break
        }
        if (!deviceInfo.isOnline) {
          MideaToast('设备已离线，请检查设备状态')
          rtn = false
          break
        }
        if (deviceInfo.isRunning) {
          MideaToast('设备工作中，请稍后再试')
          rtn = false
          break
        }
        if (deviceInfo.waterShortageState == 'waterShortage') {
          MideaToast('水箱缺水，请加水后再尝试启动')
          rtn = false
          break
        }
        break
      case '0x33':
        if (!deviceInfo.isOnline) {
          MideaToast('设备已离线，请检查设备状态')
          rtn = false
          break
        }
        if (deviceInfo.error_code > 0) {
          MideaToast('设备故障中')
          rtn = false
          break
        }
        if (!deviceInfo.enabledWork) {
          if (deviceInfo.isRunning) {
            let content = '请放回空炸炸桶，'
            if (deviceInfo.isDoor) {
              content = '请关闭空炸箱门，'
            }
            if (deviceInfo.isGrill) {
              content = '请放回空炸盖子，'
              if (deviceInfo.device_mode === 0) {
                content = '请放回炸篮/烤盘，'
              }
            }
            content += '再启动设备'
            MideaToast(content)
            rtn = false
            break
          }
          let content = '空炸炸桶已被取出，'
          if (deviceInfo.isDoor) {
            content = '空炸箱门已打开，'
          }
          if (deviceInfo.isGrill) {
            content = '空炸盖子已打开，'
            if (deviceInfo.device_mode === 0) {
              content = '炸篮/烤盘已被取出，'
            }
          }
          content += '无法启动'
          MideaToast(content)
          rtn = false
          break
        }
        if (deviceInfo.isRunning) {
          MideaToast('设备工作中，请稍后再试')
          rtn = false
          break
        }
        break
    }
    return rtn
  }

  // 埋点
  static rangersBurialPointClick(eventName, param, deviceInfo) {
    let pages = getCurrentPages()
    let pluginIndexPageIndex = pages.findIndex((item) => item.route.match(/plugin\/T0x(.*)\/index\/index/g))
    let pluginIndexPage = null
    if (pluginIndexPageIndex > -1) {
      pluginIndexPage = pages[pluginIndexPageIndex]
      deviceInfo = JSON.parse(decodeURIComponent(pluginIndexPage.options.deviceInfo))
    }
    // console.log('埋点方法: ',pluginIndexPageIndex,pluginIndexPage.options,deviceInfo);
    if (deviceInfo) {
      let paramBase = {
        module: '插件_食谱模块',
        apptype_name: '生活电器',
        widget_cate: deviceInfo.type,
        sn8: deviceInfo.sn8,
        sn: deviceInfo.sn,
        a0: deviceInfo.modelNumber,
        iot_device_id: deviceInfo.applianceCode,
        online_status: deviceInfo.onlineStatus,
      }
      let paramBurial = Object.assign(paramBase, param)
      rangersBurialPoint(eventName, paramBurial)
    }
  }

  static getStartCloudControlParams({ recipeCode, applianceType }) {
    let rtn = {
      work_mode: recipeCode,
      work_switch: 'work',
      flag_modify_time_enable: 1,
      control_src: '1',
      sub_cmd: '33',
    }
    switch (applianceType) {
      case '0x32':
        rtn = {
          work_mode: recipeCode,
          work_switch: 'work',
          flag_modify_time_enable: 1,
          controlSrc: 'mideaMeiju',
          subCmd: 33,
        }
        break
    }
    return rtn
  }

  static goTo(options) {
    let replace = false
    let url = ''
    let params = null
    if (typeof options === 'string') {
      url = options
    } else {
      url = options.url
      params = options.params
      replace = options.replace
    }
    url += params && Format.jsonToParam(params)
    console.log('跳转页面: ', url)
    if (replace) {
      wx.redirectTo({
        url: url,
      })
    } else {
      wx.navigateTo({
        url: url,
      })
    }
  }
}
