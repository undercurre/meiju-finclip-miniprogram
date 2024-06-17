// T0xAC//index/index.js
const app = getApp()
const pluginMixin=require('../../../utils/plugin-mixin')
import getSetting from '../card/assets/js/setting';
import { openSubscribe } from '../openSubscribe.js'
Page({
    behaviors: [pluginMixin],
    /**
     * 页面的初始数据
     */
    data: {
        isNewVersion: false,
        applianceCode: '',
        deviceInfo: {}
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        this.getUrlparams(options)
        let deviceInfo = JSON.parse(decodeURIComponent(options.deviceInfo))
        console.log(deviceInfo)
        deviceInfo.applianceCode = deviceInfo.applianceCode.toString() || ''
        this.setData({
            applianceCode: deviceInfo.applianceCode.toString() || '',
            deviceInfo: deviceInfo
        })
        openSubscribe(deviceInfo)
        let setting = await getSetting(deviceInfo.sn8);
        let isNew = setting.funcList != undefined ? true : false
        let isOffine = deviceInfo.onlineStatus == '0' ? true : false
        let isNewVer = isNew && !isOffine
        // let isNew = this.data.newCode.indexOf(deviceInfo.sn8) == -1 ? false : true
        if(isNew == true) {
            wx.setNavigationBarTitle({
                title: deviceInfo.name,
            })
            this.setData({
                isNewVersion: isNewVer
            })
        }
    },
    clickToDownload: function() {
        wx.navigateTo({
          url: '/pages/download/download',
        })
      },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        const card = this.selectComponent('#card')
        console.log(card)
        card.deviceCleanStatus()
        console.log('刷新首页洁净度数据')
        this.setData({
            fromApp: false
        })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        this.destoriedPlugin()
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return this.commonShareSetting()
    }
})