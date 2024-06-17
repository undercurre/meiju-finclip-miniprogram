// activities/activitiesTemplates/pages/InviteToFamily/InviteToFamily.js
//import { mockData } from '../mockData.js'
import { formatTime2 } from 'm-utilsdk/index'
import { actEventViewPageTracking } from '../../track/track.js'
import { actTemplateImgApi } from '../../../../api.js'
const actTempmetMethodsMixins = require('../actTempmetMethodsMixins.js')
const commonMixin = require('../commonMixin.js')
const app = getApp()
Page({
  behaviors: [actTempmetMethodsMixins, commonMixin],
  /**
   * 页面的初始数据
   */
  data: {
    // options: {
    //   pageId: ''
    // },
    imgUrl: actTemplateImgApi.url,
    recordList: [], //邀请记录列表
    list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInitOptions(options)
    this.setData({
      statusNavBarHeight: app.globalData.statusNavBarHeight,
    })
    // if(this.data.isMock) {
    //   this.setData({
    //     pageSetting: mockData.res.data.pageSetting || {},
    //     containerList: mockData.res.data.pageSetting.containerList || [],
    //     shareSetting: mockData.res.data.shareSetting || [],
    //     selectDialogProps: mockData.res.data.pageSetting || {}
    //   })
    // } else {
    //   app.checkGlobalExpiration().then(res => {
    //     //10131 gameId
    //     this.getGamePage_token(this.data.options.pageId,false).then(res => {
    //       const containerList = this.formatData(res.data.data.pageSetting.containerList)
    //       this.setData({
    //         shareSetting: res.data.data.shareSetting || {},
    //         pageSetting: res.data.data.pageSetting || {},
    //         basicSetting: res.data.data.basicSetting || {},
    //         userInfo: res.data.data.userInfo || {},
    //         containerList: containerList
    //       })
    //     })
    //   }).catch(e => {
    //     this.getGamePage(this.data.options.pageId,false).then(res => {

    //     })
    //   })
    // }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const { options } = this.data
    this.getGamePage_token(this.data.options.pageId, false).then((res) => {
      actEventViewPageTracking('page_view', options, res.data.data.pageSetting)
      const containerList = this.formatData(res.data.data.pageSetting.containerList)
      let recordList = containerList[0].data.inviteRecord
      this.setData({
        shareSetting: res.data.data.shareSetting || {},
        pageSetting: res.data.data.pageSetting || {},
        basicSetting: res.data.data.basicSetting || {},
        userInfo: res.data.data.userInfo || {},
        recordList,
        containerList: containerList,
      })
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
  // onShareAppMessage: function () {

  // },
  formatData(list) {
    if (list.length == 0) {
      return []
    } else {
      list.forEach((item) => {
        const inviteRecordList = item.data.inviteRecord
        if (inviteRecordList.length == 0) return
        inviteRecordList.filter((basicItem) => {
          basicItem.eventTime = formatTime2(new Date(basicItem.eventTime), '.')
        })
      })
      return list
    }
  },
  actionCustomHotzone(e) {
    const { item, selectcontainer } = e.currentTarget.dataset
    e.detail.basicItem = item
    e.detail.selectContainer = selectcontainer
    console.log('邀请记录', e)
    this.activityTrack(e)
    if ((item.custom == 0 && item.target == 8) || (item.custom == 0 && item.target == 2)) {
      wx.navigateBack({
        delta: 1,
      })
    }
  },
})
