import { maintenance } from '../../utils/paths'

import { getFullPageUrl } from '../../utils/util'

import { rangersBurialPoint } from '../../utils/requestService'

import { clickEventTracking } from '../../track/track.js'

import { getTemplateId } from '../../globalCommon/js/deviceSubscribe'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    homegroupId: '',
    applianceCode: '',
    msgType: '',
    homeGroup: '',
    device: '',
    room: '',
    time: '',
    code: '',
    desc: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('options.query', options)
    this.setData({
      homegroupId: options.homegroupId,
      applianceCode: options.applianceCode,
      msgType: options.msgType,
      homeGroup: options.homeGroup,
      device: options.device,
      room: options.room,
      time: options.time,
      code: options.code,
      desc: options.desc,
    })

    rangersBurialPoint('user_page_view', {
      page_path: getFullPageUrl(),
      page_title: '-',
      module: '信息',
      page_id: 'page_fault_msg',
      page_name: '故障信息页',
      object_type: '消息',
      object_id: getTemplateId(options.msgType),
      object_name: options.msgType,
      device_info: {},
      ext_info: {
        reffer: '消息', //访问来源，消息/其它
        family: options.homeGroup, //家庭名称
        appliance_name: options.device, //设备名称
        error_code: options.code, ///故障码
        room: options.room, //所在位置
        content: options.desc, //提示说明
      },
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  goRepair: function () {
    let _this = this
    clickEventTracking('user_behavior_event', 'goRepair', {
      page_id: 'page_fault_msg',
      page_name: '故障信息页',
      module: '消息',
      widget_id: 'click_onekey_report',
      widget_name: '一键报修',
      page_path: getFullPageUrl(),
      page_module: '',
      rank: '',
      object_type: '消息',
      object_id: getTemplateId(_this.data.msgType),
      object_name: _this.data.msgType,
      device_info: {},
      ext_info: {
        reffer: '信息', //访问来源，消息/其它
        room: _this.data.room, //所在位置
        content: _this.data.desc, //提示说明
        family: _this.data.homeGroup, //家庭名称
        appliance_name: _this.data.device, //设备名称
        error_code: _this.data.code, ///故障码
      },
    })

    wx.navigateTo({
      url: maintenance + `?faultCode=${this.data.code}`,
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
})
