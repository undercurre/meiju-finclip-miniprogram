import {
  getFullPageUrl
} from 'm-miniCommonSDK/index'
import {
  isEmptyObject,
  hasKey
} from 'm-utilsdk/index'
import {
  imgBaseUrl,
  deviceImgApi,
  baseImgApi
} from '../../../../api'
import { deviceImgMap } from '../../../../utils/deviceImgMap'
const commonUtils = {
  /**
   * @param {*} version 
   * @returns 校验手机系统版本
   */
  checkPhoneSystemVerion(version = '14.0.0') {
    let phoneSystemVersion = getApp().globalData.systemInfo.system.split(' ')[1]
    let phoneSystemVersionArr = phoneSystemVersion.split('.')
    let paramsVersionArr = version.split('.')
    console.log('[phoneSystemVersion]', phoneSystemVersionArr, paramsVersionArr)
    if (Number(paramsVersionArr[0]) < phoneSystemVersionArr[0]) {
      return true
    }

    if (
      Number(paramsVersionArr[0]) == Number(phoneSystemVersionArr[0]) &&
      Number(paramsVersionArr[1]) < Number(phoneSystemVersionArr[1])
    ) {
      return true
    }

    if (
      Number(paramsVersionArr[0]) == Number(phoneSystemVersionArr[0]) &&
      Number(paramsVersionArr[1]) == Number(phoneSystemVersionArr[1]) &&
      Number(paramsVersionArr[2]) < Number(phoneSystemVersionArr[2])
    ) {
      return true
    }

    return false
  },
  /**
   * 获取当前ip地址
   */
  getLocalIPAddress() {
    return new Promise((resolve, reject) => {
      if (!wx.canIUse('getLocalIPAddress')) {
        console.log('不支持获取ip')
        resolve(null)
        return
      }
      wx.getLocalIPAddress({
        success(res) {
          // const localip = res.localip
          resolve(res)
        },
        fail(error) {
          console.log('@commonUtis 获取ip失败', error)
          reject(error)
        },
      })
    })
  },
  /**
   * 事件上报,用于微信后台数据分析
   * @param {*} params 
   */
  apLogReportEven(params) {
    let data = {
      ...params,
    }
    wx.reportEvent('ap_local_log', {
      data: JSON.stringify(data),
      page_path: getFullPageUrl(),
      device_session_id: getApp().globalData.deviceSessionId || '',
      uid: (getApp().globalData.userData && getApp().globalData.userData.uid) || '',
      time: new Date().getTime(),
    })
  },

  //指引文案格式化显示
  guideDescFomat(guideDesc) {
    guideDesc = guideDesc.replaceAll('<', '&lt;') //<转为&lt; 才能在微信rich-text组件显示
    guideDesc = guideDesc.replaceAll('>', '&gt;') //>转为&lt; 才能在微信rich-text组件显示
    guideDesc = guideDesc.replace(/\n/g, '<br/>') //换行
    guideDesc = this.replaceInco(guideDesc)
    guideDesc = guideDesc.replace(/「(.+?)」/g, '<span class="orange-display-txt">$1</span>') //标澄
    if (getApp().globalData.brand == 'colmo') {
      //COLMO小程序需要替换美的美居文案
      guideDesc = guideDesc.replaceAll('美的美居', 'COLMO ')
    }
    guideDesc = this.replaceInco(guideDesc)
    guideDesc = guideDesc.replace(/#([a-zA-Z0-9_-]+?)#/g, '<span class="orange-display-txt digitalFont"> $1 </span>') //数码管字体
    return guideDesc
  },

  //数码管字体替换图片
  replaceInco(guideDesc) {
    let list = ['#AP#', '#00#', '#0A#', '#0L#', '#01#', '#02#']
    let imgList = ['code_ap@3x.png', 'code_00@3x.png', 'code_0a@3x.png', 'code_0l@3x.png', 'code_01@3x.png', 'code_02@3x.png']
    for (let i = 0; i <= list.length - 1; i++) {
      if (guideDesc.includes(list[i])) {
        let imgUrl = imgBaseUrl.url + '/shareImg/' + getApp().globalData.brand + '/' + imgList[i]
        let content = ' <img class="nixie-tube" src=' + imgUrl + '></img> '
        guideDesc = guideDesc.replaceAll(list[i], content)

      }
    }
    return guideDesc
  },

  //扫码
  scanCode() {
    return new Promise((resolve, reject) => {
      wx.scanCode({
        success(res) {
          console.log('扫码=====', res)
          // resolve(res.result)
          resolve(res)
        },
        fail(error) {
          console.log('扫码失败返回', error)
          reject(error)
        },
        complete() { },
      })
    })
  },
  /**
   * 补位
   * return hex 01
   */
  padLen(str, len) {
    let temp = str
    let strLen = (str + '').length
    if (strLen < len) {
      for (let i = 0; i < len - strLen; i++) {
        temp = '0' + temp
      }
    }
    return temp
  },
  /**
  * 获取设备图片和名称
  * @param {string} category 品类
  * @param {string} sn8 sn8
  */
  getDeviceImgAndName(category, sn8) {
    const dcpDeviceImgList = isEmptyObject(getApp().globalData.dcpDeviceImgList)
      ? wx.getStorageSync('dcpDeviceImgList')
      : getApp().globalData.dcpDeviceImgList
    const list = dcpDeviceImgList[category] || ''
    let item = {
      deviceImg: '',
      deviceName: '',
    }
    // console.log('@module bluetooth.js\n@method getDeviceImgAndName\n@desc 获取设备图片和名称\n', list, category, sn8)
    // 获取设备图片
    if (!list) {
      item.deviceImg = baseImgApi.url + 'scene/sence_img_lack.png'
    } else {
      if (Object.keys(list).includes(sn8) && list[sn8]['icon']) {
        item.deviceImg = list[sn8]['icon']
      } else if (list.common.icon) {
        item.deviceImg = list.common.icon
      } else if (hasKey(deviceImgMap, category.toUpperCase())) {
        //品类图
        item.deviceImg = deviceImgApi.url + 'blue_' + category.toLowerCase() + '.png'
      } else {
        //缺省图
        item.deviceImg = deviceImgApi.url + 'blue_default_type.png'
      }
    }
    // 获取设备名称
    if (list) {
      if (Object.keys(list).includes(sn8) && list[sn8]['name']) {
        item.deviceName = list[sn8]['name']
      } else if (list.common.name) {
        item.deviceName = list.common.name
      }
    }
    if (!item.deviceName) {
      if (hasKey(deviceImgMap, category.toUpperCase())) {
        item.deviceName = deviceImgMap[category]['title']
      } else {
        item.deviceName = deviceImgMap['DEFAULT_ICON']['title']
      }
    }
    // console.log('@module bluetooth.js\n@method getDeviceImgAndName\n@desc 获取设备图片和名称结果\n', item)
    return item
  }
}

module.exports = {
  commonUtils
}
