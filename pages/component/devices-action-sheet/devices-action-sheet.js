const app = getApp()
const paths = require('../../../utils/paths')
import { getStamp, getReqId } from 'm-utilsdk/index'
import { getFullPageUrl } from '../../../utils/util.js'
import { requestService } from '../../../utils/requestService'
import { clickEventTracking } from '../../../track/track.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isOpened: Boolean,
    title: {
      type: String,
      value: '您还可以一键添加如下设备',
    },
    list: Array,
    friendDevices: Array,
    selected: Object,
    cancelTxt: {
      type: String,
      value: '取消',
    },
    sureTxt: {
      type: String,
      value: '一键添加',
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    checkedData: [],
    scrollY: true,
  },

  observers: {
    friendDevices: function (friendDevices) {
      let ssids = []
      this.data.checkedData.forEach((item) => {
        ssids.push(item.ssid)
      })
      let list_ssids = []
      this.data.list.forEach((item) => {
        list_ssids.push(item.ssid)
      })
      let add = friendDevices.filter((item) => {
        return !ssids.includes(item.ssid)
      })
      let list_add = friendDevices.filter((item) => {
        return !list_ssids.includes(item.ssid)
      })
      let checked = this.data.checkedData.concat(add)
      let add_list = this.data.list.concat(list_add)
      this.setData({
        checkedData: checked,
        list: add_list,
      })
    },
    list: function (list) {
      this.setData({
        checkedData: list,
      })
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    cancel() {
      this.cancelBatchNetworkClickTrack()
      this.setData({
        isOpened: false,
      })
    },

    //批量朋友设备配网取消点击埋点
    cancelBatchNetworkClickTrack() {
      clickEventTracking('user_behavior_event', 'cancelBatchNetworkClickTrack', {
        page_path: getFullPageUrl(),
        module: 'appliance',
        page_id: 'popups_batch_add_device',
        page_name: '批量添加弹窗',
        page_module: '',
        widget_name: '取消',
        widget_id: 'click_cancel',
        rank: '',
        object_type: '',
        object_id: '',
        object_name: '',
        device_info: {
          device_session_id: app.globalData.deviceSessionId, //一次配网事件标识
          wifi_model_version: '', //模组wifi版本
          link_type: '家电找朋友', //新增配网方式 :家电找朋友
        },
      })
    },

    changeCheck(e) {
      let index = e.currentTarget.dataset.index
      if (index == 0) {
        return
      }
      let target = `list[${index}].checked`
      this.setData({
        [target]: !this.data.list[index].checked,
      })
      this.getCheckedData()
    },

    getCheckedData() {
      let checked = this.data.list.filter((item) => {
        return item.checked
      })
      this.setData({
        checkedData: checked,
      })
    },

    //发送给设备配网指令
    friendDeviceNetwork() {
      let reqData = {
        reqId: getReqId(),
        stamp: getStamp(),
        appliancesInfo: [],
      }
      this.data.checkedData.forEach((item) => {
        reqData.appliancesInfo.push({
          masterApplianceCode: item.masterApplianceCode,
          mac: item.mac,
          ssid: item.ssid,
        })
      })
      requestService
        .request('friendDeviceNetwork', reqData)
        .then((resp) => {
          console.log('发送给设备配网指令结果', resp)
          wx.setStorageSync('batchNetwork', this.data.checkedData)
          let category = this.data.checkedData.map((item) => {
            return item.category
          })
          this.batchNetworkClickTrack(category)
          wx.reLaunch({
            url: paths.batchNetwork,
          })
        })
        .catch((error) => {
          wx.showToast({
            title: error.data.msg,
            icon: 'none',
          })
        })
    },

    //批量朋友设备配网一键添加点击埋点
    batchNetworkClickTrack(category) {
      clickEventTracking('user_behavior_event', 'batchNetworkClickTrack', {
        page_path: getFullPageUrl(),
        module: 'appliance',
        page_id: 'popups_batch_add_device',
        page_name: '批量添加弹窗',
        page_module: '',
        widget_name: '一键添加',
        widget_id: 'click_onekey_add',
        rank: '',
        object_type: '',
        object_id: '',
        object_name: '',
        device_info: {
          device_session_id: app.globalData.deviceSessionId, //一次配网事件标识
          wifi_model_version: '', //模组wifi版本
          link_type: '家电找朋友', //新增配网方式 :家电找朋友
        },
        ext_info: {
          apptype: [...category], //设备品类
          sn8: [], //sn8码
        },
      })
    },

    go() {
      this.getCheckedData()
      if (this.data.checkedData.length != 0) {
        this.friendDeviceNetwork()
      } else {
        wx.showToast({
          title: '请至少选择一个选项',
          duration: 2000,
          icon: 'none',
        })
      }
    },
  },
})
