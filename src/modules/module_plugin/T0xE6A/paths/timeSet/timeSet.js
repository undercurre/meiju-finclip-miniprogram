// src/modules/module_plugin/T0xE6/paths/timeSet.js
import api from '../../api/ServerApi'
let app = getApp()
let key = app.globalData.userData.key
const appKey = app.getGlobalConfig().appKey
const requestService = app.getGlobalConfig().requestService
import {
  cloudDecrypt
} from 'm-utilsdk/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deviceInfo: '',
    timerList: [],
    status: {},
    timerSelectFlag: 0,
    showTips: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(api);
    console.log(options.currDeviceInfo, '>>>>>>')
    let infos = JSON.parse(decodeURIComponent(options.currDeviceInfo))
    console.log(JSON.stringify(infos), "infos")
    this.setData({
      deviceInfo: infos,
      sn: cloudDecrypt(infos.sn, key, appKey)
    })
    // infos.sn = app.globalData.currentSn.slice(6,28);
    console.log("new infos", infos);

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 1];
    console.log("onshow onshow", prevPage.data.deviceInfo);
    // let infos = JSON.parse(decodeURIComponent(prevPage.data.deviceInfo));

    let infos = prevPage.data.deviceInfo;
    this.setData({
      deviceInfo: infos,
      sn: cloudDecrypt(infos.sn, key, appKey)
    })
    this.zeroWaterTimerList();
    this.queryStatus();
    this.receiveDataFromNet();    
    this.swipeCellReset();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    console.log("onhide");
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    console.log("onUnload");    
    app.globalData.DeviceComDecorator.event.off('receiveMessageLan')
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  zeroWaterTimerList() {
    let that = this;
    console.log('zeroWaterTimerList');
    requestService.request(api.zeroColdWaterScheduleList, {
      applianceId: this.data.deviceInfo.applianceCode,
    }, 'POST').then((data) => {
      console.log(data, "查询定时", data.result, data.errCode);
      if (data.data.errCode == 0) {
        console.log("ininininini");
        let modeifyList = that.modifyListData(data.data.result);
        that.setData({
          timerList: modeifyList
        })

        this.judgeListHasSelect(this.data.timerList);
      }

      console.log(that.data.timerList, "timerList");

    }).catch((e) => {

    })
  },

  onTimerSwitchChange(e) {
    let target = e.currentTarget.dataset.item;
    console.log(e, this.data.timerSelectFlag);
    // if(this.data.timerSelectFlag == 1) {

    // }
    if (e.detail) { // 开定时
      this.zeroWaterTimerOpen(target.id);
    } else { // 关闭定时
      let futureFlag = this.data.timerSelectFlag - 1;
      if (futureFlag == 0) {
        if (this.data.status.cold_water_appoint_master == 'on') {
          wx.showModal({
            title: '提示',
            content: '若关闭所有定时，则关闭功能总开关。',
            confirmText: '关闭',
            complete: (res) => {
              if (res.cancel) {

              }
              if (res.confirm) {                
                this.data.status.cold_water_appoint_master == 'on' && app.globalData.DeviceComDecorator.coldWaterAppointMaster(false);
                this.zeroWaterTimerClose(target.id);
              }
            }
          })
        } else {
          this.zeroWaterTimerClose(target.id);
        }
      } else {
        this.zeroWaterTimerClose(target.id);
      }
    }
  },
  /**
   * 定时开
   * @param {*} id 
   */
  zeroWaterTimerOpen(id) {
    requestService.request(api.zeroColdWaterScheduleOpen, {
      id: id,
    }, 'POST').then((data) => {
      console.log(data, "开启定时")
      if (data.data.errCode == 0) {
        this.zeroWaterTimerList();
      }
    }).catch((e) => {

    })
  },

  /**
   * 定时关
   * @param {*} id 
   */
  zeroWaterTimerClose(id) {
    requestService.request(api.zeroColdWaterScheduleClose, {
      id: id,
    }, 'POST').then((data) => {
      console.log(data, "关闭定时")
      if (data.data.errCode == 0) {
        this.zeroWaterTimerList();
      }
    }).catch((e) => {

    })
  },

  /**
   * 定时删除
   * @param {*} id 
   */
  zeroWaterTimerDelete(id) {

    requestService.request(api.zeroColdWaterScheduleDelete, {
      id: id,
    }, 'POST').then((data) => {
      console.log(data, "删除定时")
      if (data.data.errCode == 0) {
        this.zeroWaterTimerList();
      }
    }).catch((e) => {

    })
  },


  deleteTimer(e) {
    let target = e.currentTarget.dataset.item;
    if (this.data.timerList.length <= 1 && this.data.status.cold_water_appoint_master == "on") {
      wx.showModal({
        title: '提示',
        content: '若删除所有定时，则关闭功能总开关。',
        confirmText: '删除',
        complete: (res) => {
          if (res.cancel) {

          }

          if (res.confirm) {
            this.data.status.cold_water_appoint_master == 'on' && app.globalData.DeviceComDecorator.coldWaterAppointMaster(false);
            this.zeroWaterTimerDelete(target.id);
          }
        }
      })
    } else {
      console.log(this.data.timerSelectFlag);
      // let futureFlag = this.data.timerSelectFlag - 1;
      wx.showModal({
        title: '提示',
        content: '是否确定删除该定时？',
        confirmText: '删除',
        complete: (res) => {
          if (res.cancel) {

          }

          if (res.confirm) {
            let futureFlag = this.data.timerSelectFlag - 1;
            if (futureFlag == 0) {
              this.data.status.cold_water_appoint_master == 'on' && app.globalData.DeviceComDecorator.coldWaterAppointMaster(false);
            }
            this.zeroWaterTimerDelete(target.id);
          }
        }
      })      
    }
  },

  modifyListData(list) {
    let _list = [];
    for (let i = 0; i < list.length; i++) {
      list[i].repeatText = this.formatWeekdays(list[i].weeks)
    }
    _list = list;
    return _list;
    // console.log(_list,"modifyListData",list);
  },

  formatWeekdays(arr) {
    if (arr.length === 0) {
      return '仅一次';
    } else if (arr.length === 7) {
      return '每天';
    } else if (arr.indexOf(0) !== -1 && arr.indexOf(6) !== -1 && arr.length == 2) {
      return '周末';
    } else if (arr.indexOf(0) === -1 && arr.indexOf(6) === -1 && arr.length == 5) {
      return '工作日';
    } else {
      const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
      const result = [];
      for (let i = 0; i < arr.length; i++) {
        result.push(weekdays[arr[i]]);
      }
      return result.join('、');
    }
  },

  goToTimeDetail(e) {
    console.log(e, 'goToTimeDetail');
    let item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: '../timeDetail/timeDetail?' + 'item=' + encodeURIComponent(JSON.stringify(item)) + '&applianceId=' +
        this.data.deviceInfo.applianceCode,
    })    
    this.swipeCellReset();
  },

  allTimerSwitchDisabled() {
    console.log(this.data.timerSelectFlag);
    if (this.data.timerList.length == 0) {
      wx.showToast({
        title: '请先添加定时',
        icon: 'none'
      })
      return;
    }
    if (this.judgeListHasSelect(this.data.timerList) == 0 && this.data.timerList.length > 0 && this.data.status.cold_water_appoint_master != 'on') {
      wx.showToast({
        title: '请先开启定时',
        icon: 'none'
      })
      return;
    }
  },

  timerSwitch(e) {
    console.log(e);
    if (this.judgeListHasSelect(this.data.timerList) > 0) {
      app.globalData.DeviceComDecorator.coldWaterAppointMaster(e.detail);
    } else {
      wx.showToast({
        title: '请先添加定时',
        icon: 'none'
      })
    }

  },

  receiveDataFromNet() {
    app.globalData.DeviceComDecorator.event.off(
      'receiveMessageLan');
    app.globalData.DeviceComDecorator.event.on(
      'receiveMessageLan',
      (data) => {
        let mergeData = {
          ...this.data.status,
          ...data
        }

        this.setData({
          status: mergeData
        })
        console.log("定时页面接收信息", mergeData);
      },
      'timeSet'
    )
  },
  queryStatus() {
    app.globalData.DeviceComDecorator._queryStatus();
  },

  judgeListHasSelect(list) {
    let flag = 0;
    for (let i = 0; i < list.length; i++) {
      if (list[i].power == 1) {
        flag++
      }
    }
    this.setData({
      timerSelectFlag: flag
    })
    console.log(flag, "judgeListHasSelect");
    return flag;
  },
  preventDefault() {
    
  },

  swipeCellReset() {
    let child = {};
    for (let i = 0; i < this.data.timerList.length; i++) {
      child = this.selectComponent('#swipeCell'+i);
      child.close();
    } 
  },

  showShortcutTips() {
    this.setData({
      showTips: true,
    })
  },

  hidePopup() {
    this.setData({
      showTips: false,
    })
  }

})
