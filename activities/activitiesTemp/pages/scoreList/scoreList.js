// activities/activitiesTemp/pages/scoreList/scoreList.js
import { formatTime2 } from 'm-utilsdk/index'
import { actEventViewPageTracking } from '../../track/track.js'
const actTempmetMethodsMixins = require('../actTempmetMethodsMixins.js')
const commonMixin = require('../commonMixin.js')
const app = getApp()
Page({
  behaviors: [actTempmetMethodsMixins, commonMixin],
  /**
  /**
   * 页面的初始数据
   */
  data: {
    scoreList: [], //积分记录列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInitOptions(options)
    this.setData({
      statusNavBarHeight: app.globalData.statusNavBarHeight,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const { options } = this.data
    this.getGamePage_token(this.data.options.pageId, false).then((res) => {
      actEventViewPageTracking('page_view', options, res.data.data.pageSetting)
      let { shareSetting, pageSetting, basicSetting, userInfo } = res.data.data
      let conData = pageSetting.containerList.length ? pageSetting.containerList[0] : {}
      let { scoreRecord } = conData.data.propScoreInfo
      let scoreList = this.formatData(scoreRecord)
      this.setData({
        shareSetting: shareSetting || {},
        pageSetting: pageSetting || {},
        basicSetting: basicSetting || {},
        userInfo: userInfo || {},
        scoreList,
        containerList: pageSetting.containerList,
      })
    })
  },
  formatData(list) {
    if (list.length == 0) {
      return []
    } else {
      let scoreList = list.map((scoreItem) => {
        scoreItem.createTime = formatTime2(new Date(scoreItem.createTime), '.')
        return scoreItem
      })
      return scoreList
    }
  },
  actionCustomHotzone(e) {
    const { item, selectcontainer } = e.currentTarget.dataset
    e.detail.basicItem = item
    e.detail.selectContainer = selectcontainer
    console.log('积分记录', e)
    this.activityTrack(e)
    if (item.custom == 0 && item.target == 8) {
      wx.navigateBack({
        delta: 1,
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},
})
