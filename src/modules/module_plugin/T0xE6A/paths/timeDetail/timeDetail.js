// src/modules/module_plugin/T0xE6/paths/timeDetail/timeDetail.js
import api from '../../api/ServerApi'
let app = getApp()
let key = app.globalData.userData.key
const appKey = app.getGlobalConfig().appKey
const requestService = app.getGlobalConfig().requestService

Page({
  /**
   * 页面的初始数据
   */
  data: {
    showStartTimePicker: false,
    showEndTimePicker: false,
    column3: [{
        values: ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15",
          "16", "17", "18", "19", "20", "21", "22", "23"
        ],
        className: 'column1',
        defaultIndex: 0,
        selectDescription: '时',
      },
      {
        values: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15',
          '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32',
          '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49',
          '50', '51', '52', '53', '54', '55', '56', '57', '58', '59'
        ],
        className: 'column2',
        defaultIndex: 0,
        selectDescription: '分',
      },
    ],

    timeData: {},
    isAddTimer: true,
    applianceId: "",

    sendWeeks: [],
    sendStartTime: "00:00",
    sendEndTime: "00:00",

    timerList: [],

    submitting: false, // 请求进行中标志位，防止两次请求
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let infos = JSON.parse(decodeURIComponent(options.item))
    let applianceId = options.applianceId;
    console.log('detail onload', infos, options);
    this.setData({
      applianceId
    })

    if (infos != '') { // 为空表示新增一个定时
      this.setData({
        isAddTimer: false,
        timeData: infos,
        sendWeeks: infos.weeks,
        sendStartTime: infos.startTime,
        sendEndTime: infos.endTime
      })
    } else {
      infos = {
        endTime: "22:00",
        power: 1,
        startTime: "06:00",
        repeatText: "仅一次",
        weeks: []
      }
      this.setData({
        isAddTimer: true,
        timeData: infos,
        sendWeeks: infos.weeks,
        sendStartTime: infos.startTime,
        sendEndTime: infos.endTime
      })
    }

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
    const prevPage = pages[pages.length - 2];
    console.log(prevPage.data, "timeDetail");
    this.setData({
      timerList: prevPage.data.timerList
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

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

  showStartTimePick() {
    this.setPickerIndex();
    this.setData({
      showStartTimePicker: true
    })
  },

  showEndTimePick() {
    this.setPickerIndex();
    this.setData({
      showEndTimePicker: true
    })
  },

  hidePopup() {
    this.setData({
      showStartTimePicker: false,
      showEndTimePicker: false
    })
  },
  endTimeCOnfirm(e) {
    console.log('结束时间');
  },
  startTimeConfirm(e) {
    console.log('开始时间');
  },
  getPickerChange(event) {
    let dayItem = event.detail.dayItem;
    let timesItem = event.detail.timesItem;
    let weeks = [];
    let timesType = "";

    for (let i = 0; i < timesItem.length; i++) {
      if (timesItem[i].selected) {
        timesType = timesItem[i].title;
      }
    }

    if (timesType == '仅一次') {
      weeks = [];
    } else if (timesType == '每天') {
      weeks = [0, 1, 2, 3, 4, 5, 6]
    } else if (timesType == '工作日') {
      weeks = [1, 2, 3, 4, 5]
    } else if (timesType == '周末') {
      weeks = [0, 6]
    } else {
      for (let i = 0; i < dayItem.length; i++) {
        if (dayItem[i].selected) {
          weeks.push(parseInt(dayItem[i].key))
        }
      }
    }

    console.log(event);
    console.log("选择的最终结果", JSON.stringify(event.detail.dayItem), JSON.stringify(event.detail.timesItem));

    this.setData({
      sendWeeks: weeks,      
    })
    console.log(weeks, "weeksweeksweeks---", this.data.timeData.id, this.data.applianceId);

  },

  zeroTimerSave() {
    // {
    //   "id": 0,
    //   "applianceId": "string",
    //   "startTime": "string",
    //   "endTime": "string",
    //   "weeks": [
    //     0
    //   ]
    // }
    let param = {};
    console.log(param, this.data.timerList);
    if (this.data.isAddTimer) {
      param = {
        "applianceId": this.data.applianceId,
        "startTime": this.data.sendStartTime,
        "endTime": this.data.sendEndTime,
        "weeks": this.data.sendWeeks
      }
    } else {
      param = {
        "id": this.data.timeData.id,
        "applianceId": this.data.applianceId,
        "startTime": this.data.sendStartTime,
        "endTime": this.data.sendEndTime,
        "weeks": this.data.sendWeeks
      }
    }

    if (!this.isEndTimeAfterStartTime(param.startTime, param.endTime)) {
      wx.showToast({
        title: '结束时间必须大于开始时间',
        icon: 'none',
      })
    } else {
      let i = 0;
      let myDate = new Date();
      let getHours = myDate.getHours();
      let getMinutes = myDate.getMinutes();
      let getDay = myDate.getDay() + 1;
      let tishi = false;
      let pickerIndexHour = parseInt(param.startTime.split(':')[0]);
      let pickerIndexMinute = parseInt(param.startTime.split(':')[1]);

      console.log(getHours, getMinutes, getDay, tishi, pickerIndexHour, pickerIndexMinute)

      if (this.data.isAddTimer) { // 新增
        for (let i = 0; i < this.data.timerList.length; i++) {
          if (this.isTimeOverlap(this.data.timerList[i].startTime, this.data.timerList[i].endTime, param.startTime,
              param.endTime)) {
            console.log('时间重叠')
            // 判断星期没有交集
            // 判断是否是单次定时
            if (this.data.timerList[i].weeks[0] === undefined && this.data.sendWeeks[0] === undefined) {
              tishi = true;
            }

            if (this.data.timerList[i].weeks[0] === undefined && this.data.sendWeeks[0] !== undefined) {
              for (let j = 0; j < this.data.sendWeeks.length; j++) {
                if (parseInt(pickerIndexHour) > getHours) {
                  if (this.data.sendWeeks[j] === myDate.getDay()) {
                    tishi = true;
                  }
                }
                if ((parseInt(pickerIndexHour) === getHours) && (parseInt(pickerIndexMinute) > getMinutes)) {
                  if (this.data.sendWeeks[j] === myDate.getDay()) {
                    tishi = true;
                  }
                }
                if ((parseInt(pickerIndexHour) === getHours) && (parseInt(pickerIndexMinute) <= getMinutes)) {

                  if (this.data.sendWeeks[j] === getDay) {
                    tishi = true;
                  }
                }
                if (parseInt(pickerIndexHour) < getHours) {
                  if (this.data.sendWeeks[j] === getDay) {
                    tishi = true;
                  }
                }
              }
            }

            if (this.data.timerList[i].weeks[0] !== undefined && this.data.sendWeeks[0] !== undefined) {
              for (let j = 0; j < this.data.sendWeeks.length; j++) {
                for (let s = 0; s < this.data.timerList[i].weeks.length; s++) {
                  if (this.data.sendWeeks[j] === this.data.timerList[i].weeks[s]) {
                    tishi = true;
                  }
                }
              }
            }

            if (this.data.timerList[i].weeks[0] !== undefined && this.data.sendWeeks[0] === undefined) {
              for (let s = 0; s < this.data.timerList[i].weeks.length; s++) {

                if (parseInt(pickerIndexHour) > getHours) {
                  if (this.data.timerList[i].weeks[s] === myDate.getDay()) {
                    tishi = true;
                  }
                }
                if ((parseInt(pickerIndexHour) === getHours) && (parseInt(pickerIndexMinute) > getMinutes)) {
                  if (this.data.timerList[i].weeks[s] === myDate.getDay()) {
                    tishi = true;
                  }
                }
                if ((parseInt(pickerIndexHour) === getHours) && (parseInt(pickerIndexMinute) <= getMinutes)) {

                  if (this.data.timerList[i].weeks[s] === getDay) {
                    tishi = true;
                  }
                }
                if (parseInt(pickerIndexHour) < getHours) {
                  if (this.data.timerList[i].weeks[s] === getDay) {
                    tishi = true;
                  }
                }
              }
            }

            if (tishi) {
              // this.toast = !this.toast;
              // this.message = '已有定时包含该时间段';
              wx.showToast({
                title: '已有定时包含该时间段',
                icon: 'none'
              })
              return
            }

          }
        }
      } else { // 编辑
        for (let i = 0; i < this.data.timerList.length; i++) {
          if (this.data.timerList[i].id != this.data.timeData.id) {
            if (this.isTimeOverlap(this.data.timerList[i].startTime, this.data.timerList[i].endTime, param
                .startTime,
                param.endTime)) {
              // console.log('时间重叠')
              // 判断星期没有交集
              // 判断是否是单次定时
              if (this.data.timerList[i].weeks[0] === undefined && this.data.sendWeeks[0] === undefined) {
                tishi = true;
              }

              if (this.data.timerList[i].weeks[0] === undefined && this.data.sendWeeks[0] !== undefined) {
                for (let j = 0; j < this.data.sendWeeks.length; j++) {
                  if (parseInt(pickerIndexHour) > getHours) {
                    if (this.data.sendWeeks[j] === myDate.getDay()) {
                      tishi = true;
                    }
                  }
                  if ((parseInt(pickerIndexHour) === getHours) && (parseInt(pickerIndexMinute) > getMinutes)) {
                    if (this.data.sendWeeks[j] === myDate.getDay()) {
                      tishi = true;
                    }
                  }
                  if ((parseInt(pickerIndexHour) === getHours) && (parseInt(pickerIndexMinute) <= getMinutes)) {

                    if (this.data.sendWeeks[j] === getDay) {
                      tishi = true;
                    }
                  }
                  if (parseInt(pickerIndexHour) < getHours) {
                    if (this.data.sendWeeks[j] === getDay) {
                      tishi = true;
                    }
                  }
                }
              }

              if (this.data.timerList[i].weeks[0] !== undefined && this.data.sendWeeks[0] !== undefined) {
                for (let j = 0; j < this.data.sendWeeks.length; j++) {
                  for (let s = 0; s < this.data.timerList[i].weeks.length; s++) {
                    if (this.data.sendWeeks[j] === this.data.timerList[i].weeks[s]) {
                      tishi = true;
                    }
                  }
                }
              }

              if (this.data.timerList[i].weeks[0] !== undefined && this.data.sendWeeks[0] === undefined) {
                for (let s = 0; s < this.data.timerList[i].weeks.length; s++) {

                  if (parseInt(pickerIndexHour) > getHours) {
                    if (this.data.timerList[i].weeks[s] === myDate.getDay()) {
                      tishi = true;
                    }
                  }
                  if ((parseInt(pickerIndexHour) === getHours) && (parseInt(pickerIndexMinute) > getMinutes)) {
                    if (this.data.timerList[i].weeks[s] === myDate.getDay()) {
                      tishi = true;
                    }
                  }
                  if ((parseInt(pickerIndexHour) === getHours) && (parseInt(pickerIndexMinute) <= getMinutes)) {

                    if (this.data.timerList[i].weeks[s] === getDay) {
                      tishi = true;
                    }
                  }
                  if (parseInt(pickerIndexHour) < getHours) {
                    if (this.data.timerList[i].weeks[s] === getDay) {
                      tishi = true;
                    }
                  }
                }
              }

              if (tishi) {
                // this.toast = !this.toast;
                // this.message = '已有定时包含该时间段';
                wx.showToast({
                  title: '已有定时包含该时间段',
                  icon: 'none'
                })
                return
              }

            }
          }
        }
      }


      console.log("最终定时保存的参数", param)

      if (this.data.submitting) {
        return
      }
      this.setData({
        submitting: true
      })
      requestService.request(
        api.zeroColdWaterScheduleSave,
        param,
        'POST'
      ).then((data) => {
        console.log(data);       
        if (data.data.errCode == 0) {
          wx.showToast({
            title: '设置成功',
            icon: 'none'
          });
          setTimeout(() => {
            this.setData({
              submitting: false
            })
            wx.navigateBack();
          }, 800);
        }
      }).catch((e) => {
        this.setData({
          submitting: false
        })
      })


    }


  },

  setPageData(timeData) {
    let repeatText = timeData.repeatText;

  },

  confirmStartTime(e) {
    console.log(e)
    let startTime = e.detail.value.join(":")

    this.setData({
      sendStartTime: startTime,
      'timeData.startTime': startTime,
      'timeData.weeks': this.data.sendWeeks,
      'timeData.repeatText': this.formatWeekdays(this.data.sendWeeks)
    })

    this.hidePopup();
  },

  confirmEndTime(e) {
    console.log(e)
    let endTime = e.detail.value.join(":")

    this.setData({
      sendEndTime: endTime,
      'timeData.endTime': endTime,
      'timeData.weeks': this.data.sendWeeks,
      'timeData.repeatText': this.formatWeekdays(this.data.sendWeeks)
    })

    this.hidePopup();
  },

  isEndTimeAfterStartTime(startTime, endTime) {
    const start = new Date(`2000-01-01T${startTime}:00`);
    const end = new Date(`2000-01-01T${endTime}:00`);
    return end > start;
  },

  isTimeOverlap(start1, end1, start2, end2) {
    // 将时间字符串转换为Date对象
    const startDate1 = new Date(`2021-01-01T${start1}:00`);
    const endDate1 = new Date(`2021-01-01T${end1}:00`);

    const startDate2 = new Date(`2021-01-01T${start2}:00`);
    const endDate2 = new Date(`2021-01-01T${end2}:00`);
    // 如果时间段1的结束时间早于时间段2的开始时间，或者时间段1的开始时间晚于时间段2的结束时间，则两个时间段不重叠
    if (endDate1 < startDate2 || startDate1 > endDate2) {
      return false;
    }
    // 其他情况两个时间段重叠
    return true;
  },

  setPickerIndex(timeData) {
    // setIndexes([1, 3] 数组0.第一列的index，数组1，第二列的index
    console.log(this.data.timeData);
    let startTime = this.data.timeData.startTime;
    let startTimeH = parseInt(startTime.split(":")[0]);
    let startTimeM = parseInt(startTime.split(":")[1]);

    let endTime = this.data.timeData.endTime;
    let endTimeH = parseInt(endTime.split(":")[0]);
    let endTimeM = parseInt(endTime.split(":")[1]);
    this.selectComponent('#startTimePicker').setIndexes([startTimeH, startTimeM])
    this.selectComponent('#endTimePicker').setIndexes([endTimeH, endTimeM])
  },

  compareTime(time1, time2) {
    const [hour1, minute1] = time1.split(':');
    const [hour2, minute2] = time2.split(':');

    const date1 = new Date();
    date1.setHours(hour1);
    date1.setMinutes(minute1);

    const date2 = new Date();
    date2.setHours(hour2);
    date2.setMinutes(minute2);

    const diff = Math.abs(date1 - date2) / 1000 / 60;

    return diff <= 5;
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
})
