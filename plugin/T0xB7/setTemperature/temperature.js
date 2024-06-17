// plugin/T0xB7/setTemperature/temperature.js
import { requestService } from '../../../utils/requestService';
import { pluginEventTrack } from '../../../track/pluginTrack.js'
import { getStamp } from 'm-utilsdk/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectItem: -1,
    targtTemperature: 130,
    foodList: [
      {
          //油炸类
          name: '速冻薯条',
          selected: false,
          type: '炸',
          max: 210,
          min: 200,
          value: 210,
      },
      {
        name: '速冻鸡柳/骨肉相连',
        selected: false,
        type: '炸',
        max: 200,
        min: 190,
        value: 200,
      },
      {
        name: '天妇罗/炸虾仁',
        selected: false,
        type: '炸',
        max: 210,
        min: 200,
        value: 210,
      },
      {
        name: '油条',
        selected: false,
        type: '炸',
        max: 200,
        min: 190,
        value: 200,
      },
      {
        name: '肉丸子',
        selected: false,
        type: '炸',
        max: 190,
        min: 180,
        value: 190,
      },
      {
        name: '拔丝土豆',
        selected: false,
        type: '炸',
        max: 150,
        min: 140,
        value: 150,
      },
      {
          // 油煎类
          name: '溏心蛋',
          selected: false,
          type: '煎',
          max: 140,
          min: 130,
          value: 130,
      },
      {
        name: '鸡蛋',
        selected: false,
        type: '煎',
        max: 160,
        min: 150,
        value: 150,
      },
      {
        name: '猪排/牛排',
        selected: false,
        type: '煎',
        max: 200,
        min: 190,
        value: 190,
      },
      {
        name: '豆腐',
        selected: false,
        type: '煎',
        max: 180,
        min: 170,
        value: 170,
      },
      {
        name: '薄饼(面汤饼)',
        selected: false,
        type: '煎',
        max: 200,
        min: 190,
        value: 190,
      },
      {
        name: '薄饼(干面饼)',
        selected: false,
        type: '煎',
        max: 180,
        min: 170,
        value: 170,
      },
    ],
    currentEquipment: '',
    cookMode: '',
    applianceCode: '',
    isCookmode: '',
    isRightCookmode: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var currentEquipment = options.currentEquipment
    var cookMode = options.cookMode
    var applianceCode = options.applianceCode
    var isCookMode = options.isCookmode
    var isRightCookmode = options.isRightCookmode
    var seleIndex = -1
    var target = {}
    if(options.targetTemperature != 0) {
      var target_id = wx.getStorageSync(`b7_${currentEquipment}_keep_temperature_id`);
      if(target_id) {
        seleIndex = options.targetTemperature != 0 ? wx.getStorageSync(`b7_${currentEquipment}_keep_temperature_id`) : -1
        target = this.data.foodList.find((i,ind) => ind == seleIndex) || {}
      }else {
        target.value = Number(options.targetTemperature)
      }
    }
    this.setData({
        currentEquipment: currentEquipment,
        cookMode: cookMode,
        applianceCode: applianceCode,
        isCookmode: isCookMode,
        isRightCookmode: isRightCookmode,
        selectItem: seleIndex,
        targtTemperature: target.value || 130
    })
  },
  sliderChange: function(e) {
    this.setData({
        targtTemperature: e.detail.value,
        selectItem: -1,
    })
  },
  modifyButtonClicked(e) {
    // if(this.selectItem == -1) return;
    var temp = this.data.targtTemperature
    var cookMode = this.data.cookMode
    this.tempRequestControl({
        eq: this.data.currentEquipment,
        cookmode: cookMode,
        target_temperature: temp
    })  
  },
  cancleButtonClicked(e) {
      var that = this
      wx.showModal({
          title: '退出定温',
          content: `是否结束<${that.data.currentEquipment == 'right'?'右灶':'左灶'}>定温？`,
          success(res) {
              if (res.confirm) {
                  that.tempRequestControl({
                      eq: that.data.currentEquipment,
                      cookmode: 'default',
                      ex_cookmode: 'keep_temperature'
                  })
              } 
              else if (res.cancel) { }
          }
      })
  },
  tempRequestControl(control) {
    var that = this
    wx.showLoading({
        title: '',
        mask: true
    });
    return requestService
        .request('luaControl', {
            applianceCode: that.data.applianceCode,
            command: { control },
            reqId: getStamp().toString(),
            stamp: getStamp()
        })
        .then(rs => {
          if(this.data.selectItem == -1) {
            wx.clearStorageSync(`b7_${this.data.currentEquipment}_keep_temperature_id`)
          }
          pluginEventTrack('user_behavior_event', null, {
            page_id: 'page_control',
            page_name: '插件首页',
            widget_id: 'click_keep_temperature',
            widget_name: '定温',
            ext_info: `${control.eq == 'left' || control.eq == 'leftelec' ? '左灶' : '右灶'}${control.target_temperature}°C`
          })
          setTimeout(() => {
            wx.navigateBack()
          },100)
        })
        .catch(err => {
            wx.hideNavigationBarLoading();
            wx.showToast({
                title: '请求失败，请稍后重试',
                icon: 'none',
                duration: 2000
            });
        });
  },
  itemClicked: function(e) {
    var selectNum = parseInt(e.currentTarget.id)
    wx.setStorageSync(`b7_${this.data.currentEquipment}_keep_temperature_id`, selectNum)
    var newTemperature = this.data.foodList[selectNum].value
    this.setData({
        selectItem: selectNum,
        targtTemperature: newTemperature
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

  }
})