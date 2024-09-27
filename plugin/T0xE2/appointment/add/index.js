const app = getApp();
import images from "../../assets/js/img";
import computedBehavior from "../../../../utils/miniprogram-computed";
import {
  requestService,
  rangersBurialPoint,
} from "../../../../utils/requestService";

// let numClick = 0;
let selectedDays = [];
// let today = new Date().getDay(); // new Date() 不能写在外面
const getModeBuryParams = function (mode, lastObj, changeObj) {
  let newObj = {
    ...lastObj,
    ...changeObj,
  };
  let setting_params = {};
  for (let key in newObj) {
    setting_params[key] =
      (lastObj[key] || (lastObj[key] == "0" && "0") || "") + "|" + newObj[key];
  }
  return {
    mode,
    setting_params: JSON.stringify(setting_params),
  };
};

let hours = [],
  minutes = [];
for (let i = 0; i < 24; i++) {
  hours.push(i < 10 ? "0" + i : i);
}
for (let i = 0; i < 60; i++) {
  minutes.push(i < 10 ? "0" + i : i);
}

// 获取范围数组如：【30-70】
const pickerRangeCreate = function (start, end, step) {
  let rs = [];
  while (start <= end) {
    rs.push(start);
    start += step;
  }
  return rs;
};

Page({
  behaviors: [computedBehavior],
  data: {
    setting:{},
    numClick: 0,
    isShowTimePicker: false,
    isShowTemPicker: false,
    task: {},
    action: "add", // 编辑类型add或update
    defaultLoopIndex: -1, // 默认选中的循环周期
    defaultWeekdaySelectList: [], // 默认选中的星期数
    // 云管家互斥处理
    isCloudOn: false,
    appointOnTimeList: [[], [], [], [], [], [], []], // 预约开启的时间列表，表中0~6元素分别代表周日~周六预约开启数据
    hasAppointOn: false, // 是否有已开启预约
    
    tempIndex: 0,
    startTimeMultiArray: [hours, minutes],
    startTimeMultiIndex: [0,0],
    endTimeMultiArray: [hours, minutes],
    endTimeMultiIndex: [0, 0],
    timeType:'',
    multiArray: [],
    multiIndex: [0],
    multiUnit:['时','分'],
    selections: [],
    startTime:'',
    endTime:'',
    tem: pickerRangeCreate(30, 75, 5),
    start_str:'开始用水时间',
    end_str:'结束用水时间',
  },
  computed: {
    images() {
      return images;
    }
  },

  onLoad({ data }) {
    let today = new Date().getDay();
    // 更新： channel 接收card.js 的 4秒轮询的设备状态
    this.pageEventChannel = this.getOpenerEventChannel()
    // 
    const {
      applianceData,
      isCloudOn,
      action,
      appointOnTimeList,
      hasAppointOn,
      taskData,
      setting,
    } = JSON.parse(data);
    wx.setNavigationBarTitle({
      title: action == "update" ? "更改时间" : "新增时间",
    })
    let start_str = setting.appointType == 'delayPartAppoint' ? '开始用水时间' : '开机时间'
    let end_str = setting.appointType == 'delayPartAppoint' ? '结束用水时间' : '关机时间'
    this.setData({ applianceData, isCloudOn, action, start_str, end_str, setting });
    if (action == "update") {
      let taskObj = taskData;
      this.setData({
        appointOnTimeList: appointOnTimeList,
        hasAppointOn: hasAppointOn,
      });
      taskObj.appointOnTimeList = undefined; // 删除属性，性能比delete快得多
      taskObj.hasAppointOn = undefined;
      // 更改预约
      this.setData({
        task: taskObj,
        tempIndex: Math.floor((taskObj.temp - 30) / 5),
      });

      let weekArr = [];
      if (taskObj.week == "") {
        //处理由于历史插件有误导致week无值的问题（选择单次）
        weekArr = [today];
        selectedDays = weekArr;
      } else {
        weekArr = taskObj.week.split(",");
        selectedDays = weekArr.map((item) => parseInt(item));
      }
      this.setData({ defaultWeekdaySelectList: selectedDays });

      const { task } = this.data;
      if (!task.isRepeat) {
        this.setData({ defaultLoopIndex: 0 });
      } else if (task.week == "1,2,3,4,5,6,0" || task.week == "0,1,2,3,4,5,6") {
        this.setData({ defaultLoopIndex: 1 });
      } else if (task.week == "1,2,3,4,5") {
        this.setData({ defaultLoopIndex: 2 });
      } else if (task.week == "6,0" || task.week == "0,6") {
        this.setData({ defaultLoopIndex: 3 });
      } else {
        this.setData({ defaultLoopIndex: 4 });
      }
      // beging 添加字节埋点：进入插件页
      this.rangersBurialPointClick("plugin_page_view", {
        refer_name: "分段预约编辑页",
      });
      // end 添加字节埋点：进入插件页
    } else {
      // 添加预约
      selectedDays = [today];
      let task = {
        temp: 60,
        startTime: "12:00",
        endTime: "19:00",
        isDefault: false,
        enable: true,
        isRepeat: false,
        week: "" + today,
        label: "",
      };
      let tempIndex = Math.floor((task.temp - 30) / 5);
      this.setData({
        task,
        tempIndex,
        appointOnTimeList,
        hasAppointOn,
        defaultLoopIndex: 0,
      });
      // beging 添加字节埋点：进入插件页
      this.rangersBurialPointClick("plugin_page_view", {
        refer_name: "分段预约添加页",
      });
      // end 添加字节埋点：进入插件页
    }
    this.initSelections()
  },

  onReady() {
    // const temPicker = this.selectComponent(".temPicker");
    // temPicker.setIndexes([this.data.tempIndex]);
  },
  initSelections() {
    const { tem,tempIndex } = this.data;
    const selections = tem;
    this.setData({
      selections,
      "multiArray[0]": selections,
      "multiIndex[0]": tempIndex,
    });
  },
  openTempPicker() {
    this.setData({ isShowTemPicker: true, "multiIndex[0]": this.data.tempIndex});
  },

  openStartTimePicker() {
    const value = this.data.task.startTime.split(":");
    const hourIndex = hours.findIndex((item) => item == value[0]) || 0;
    const minutesIndex = minutes.findIndex((item) => item == value[1]) || 0;
    this.setData({
      timeType:'start',
      isShowTimePicker:true,
      startTimeMultiIndex: [hourIndex, minutesIndex]
    });
  },

  openEndTimePicker() {
    const value = this.data.task.endTime.split(":");
    const hourIndex = hours.findIndex((item) => item == value[0]) || 0;
    const minutesIndex = minutes.findIndex((item) => item == value[1]) || 0;
    this.setData({
      timeType:'end',
      isShowTimePicker:true,
      endTimeMultiIndex: [hourIndex, minutesIndex]
    });
  },
  onPickerChange(e) {
    const value  = e.detail
    const timeType = this.data.timeType
    const hour = value[0] < 10 ? "0" + value[0] : value[0];
    const minutes = value[1] < 10 ? "0" + value[1] : value[1];
    if(timeType == 'start') {
      this.data.startTime = `${hour}:${minutes}`
    } else {
      this.data.endTime = `${hour}:${minutes}`
    }
  },
  closeTemPicker() {
    this.setData({ isShowTemPicker: false });
  },
  onConfirm(e) {
    const value  = e.detail
    const hour = value[0] < 10 ? "0" + value[0] : value[0];
    const minutes = value[1] < 10 ? "0" + value[1] : value[1];
    const confirmTime = `${hour}:${minutes}`
    const timeType = this.data.timeType
    if(timeType == 'start') {
      this.setData({
        'task.startTime':confirmTime,
        isShowTimePicker:false
      })
    } else {
      this.setData({
        'task.endTime':confirmTime,
        isShowTimePicker:false
      })
    }
  },
  onCancel() {
    this.setData({
      isShowTimePicker:false
    })
  },

  onTemPickerChange(event) {
    const value  = event.detail
    this.setData({
      "task.temp": value
    })
  },

  onTemPickerConfirm (e){
    const currentTemp = e.detail[0]
    this.setData({
      "tempIndex":currentTemp,
      "task.temp":this.data.multiArray[0][currentTemp],
      isShowTemPicker:false
    })
  },

  onLoopItemClick({ detail: index }) {
    let today = new Date().getDay();
    console.log({ index });
    if (index == 0) {
      // 单次
      selectedDays = [today];
      this.setData({ "task.isRepeat": false });
    } else if (index == 1) {
      // 每天
      selectedDays = [1, 2, 3, 4, 5, 6, 0];
      this.setData({ "task.isRepeat": true });
    } else if (index == 2) {
      // 工作日
      selectedDays = [1, 2, 3, 4, 5];
      this.setData({ "task.isRepeat": true });
    } else if (index == 3) {
      // 周末
      selectedDays = [6, 0];
      this.setData({ "task.isRepeat": true });
    } else {
      // 自定义
      this.setData({ "task.isRepeat": true });
    }
    this.setData({ "task.week": selectedDays.join(","), defaultWeekdaySelectList: selectedDays });
  },

  onWeekdayItemClick({ detail: weekdaySelectList }) {
    let today = new Date().getDay();
    console.log({ weekdaySelectList });
    this.setData({ "task.week": weekdaySelectList.join(",") });
    if (this.data.task.week == undefined || this.data.task.week == "") {
      // 未选中任何星期格
      this.setData({ "task.isRepeat": false, "task.week": "" + today });
    } else {
      this.setData({ "task.isRepeat": true });
    }
  },

  beforeSave() {
    // 云管家互斥逻辑处理
    const { isCloudOn, action } = this.data;
    if (action == "add" && isCloudOn) {
      // 要打开时先弹窗询问是否关闭云管家
      wx.showModal({
        title: "温馨提示",
        content: "设置预约后，将关闭云管家自动控温，是否确认开启预约？",
        success: (res) => {
          if (res.confirm) {
            this.saveAppoint();
          }
        },
      });
    } else {
      this.saveAppoint();
    }
  },

  // 判断预约是否冲突
  getConflict(item) {
    let week_list = item.week.split(",");
    for (let week of week_list) {
      for (let appointOnItem of this.data.appointOnTimeList[week]) {
        console.log({
          flag:
            appointOnItem &&
            !(
              appointOnItem.endTime <= item.startTime ||
              appointOnItem.startTime >= item.endTime
            ),
        });
        if (
          appointOnItem &&
          !(
            appointOnItem.endTime <= item.startTime ||
            appointOnItem.startTime >= item.endTime
          )
        ) {
          wx.showToast({ title: "该时间段已经设置过预约了", icon: "none" });
          return true;
        }
      }
    }
    return false;
  },

  // 开启/关闭云管家
  switchCloudAi(p) {
    requestService
      .request("e2", {
        msg: "SetCloudManagerSwitch",
        params: {
          applianceId: String(this.data.applianceData.applianceCode),
          switch: p,
        },
      })
      .then(({ data }) => {
        if (data.retCode == "0") {
        } else {
          wx.showToast({ title: "网络较差，请稍后重试", icon: "none" });
        }
      });
  },

  // 关闭关闭AI管家
  toggleAppointAI(){
    this.pageEventChannel && this.pageEventChannel.emit('add_toggleAppointAI')
  },
  // 关闭智能抑垢
  closeIntelligentScaleInhibition(){
    this.pageEventChannel && this.pageEventChannel.emit('add_closeIntelligentScaleInhibition')
  },
  // 关闭一键智享
  closeOneKeyAi(){
    this.pageEventChannel && this.pageEventChannel.emit('add_closeOneKeyAi')
  },

  // 保存
  saveAppoint() {
    let today = new Date().getDay();
    const { setting, hasAppointOn, task, action } = this.data;
    const { applianceCode, sn8 } = this.data.applianceData;

    var item = task;
    // 处理单次隔日预约
    let isNextDay = false;
    let toast_str =
      setting.appointType == "delayPartAppoint" ? "开始用水时间" : "开机时间";
    if (!item.isRepeat && item.enable) {
      let now = new Date();
      let hour = now.getHours() < 10 ? "0" + now.getHours() : now.getHours();
      let min =
        now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes();
      let nowStr = hour + ":" + min;
      if (nowStr >= item.startTime) {
        item.week = "" + (today != 6 ? today + 1 : 0);
        isNextDay = true;
      } else {
        item.week = "" + today;
      }
    }
    // 判断预约冲突
    let isConflict = false;
    if (item.enable && hasAppointOn) {
      // 有预约开启，判断预约是否冲突
      let week_list = item.week.split(",");
      if (item.startTime >= item.endTime) {
        // 跨天则将当前预约拆分为两段分别判断（大于和等于都属于跨天）
        let item_1 = { ...item, endTime: "24:00" };
        isConflict = this.getConflict(item_1);
        let new_week_list = week_list.map((week) => {
          return week == "6" ? 0 : Number(week) + 1;
        });
        let item_2 = {
          ...item,
          startTime: "00:00",
          week: new_week_list.join(","),
        };
        isConflict = isConflict || this.getConflict(item_2);
      } else {
        // 不跨天
        isConflict = this.getConflict(item);
      }
    }
    if (isConflict) {
      return;
    }

    // 多次点击只生效一次，避免重复添加
    this.data.numClick = this.data.numClick + 1
    if (this.data.numClick >= 2) {
      return;
    }

    // 判断为延时分段还是普通分段
    var appointType = 0;
    if (setting.appointType == "delayPartAppoint") {
      appointType = 1;
    }
    // 联动关闭云管家
    item.enable && this.switchCloudAi(0);
    // 联动关闭AI管家
    item.enable && this.toggleAppointAI();
    // 联动关闭智能抑垢
    item.enable && this.closeIntelligentScaleInhibition();
    // 联动关闭一键智享
    item.enable && this.closeOneKeyAi();

    // 发送预约保存请求
    requestService
      .request("e2", {
        msg: "reserve",
        params: {
          applianceId: String(applianceCode),
          platform: sn8,
          action: action,
          flag: appointType, //默认为分段预约，0：分段预约；1：延时预约
          task: [task],
        },
      })
      .then((rs) => {
        if (isNextDay) {
          wx.showToast({
            title: `您设置的${toast_str}已过，预约将于明日执行`,
            icon: "none",
            duration: 3000,
          });
        } else {
          wx.showToast({ title: "预约保存成功" });
        }
        if(!task.enable) { //保存后自动打开预约开关
          var pages = getCurrentPages();
          var prevPage = pages[pages.length - 2];
          const params = {
            currentTarget: {
              dataset: {
                item:task
              },
            },
          }
          prevPage.beforeChange(params)
        }
        // 埋点
        let params = getModeBuryParams('更新分段预约', this.data.task, {})
        this.rangersBurialPointClick('plugin_mode_set_check', params)
        setTimeout(() => wx.navigateBack(), isNextDay ? 3000 : 1000);
      })
      .catch((e) => {
        if (e.data.retCode == '-2' && action == 'add') {
          wx.showToast({
            title: e.data.desc,
            icon: 'none',
          })
          return
        } else {
          wx.showToast({ title: `保存失败`, icon: 'none' })
        }
      })
  },

  // 埋点
  rangersBurialPointClick(eventName, param) {
    if (this.data.applianceData) {
      let paramBurial = {};
      let paramBase = {
        module: "插件",
        apptype_name: "电热水器",
        widget_cate: this.data.applianceData.type,
        sn8: this.data.applianceData.sn8,
        sn: this.data.applianceData.sn,
        a0: this.data.applianceData.modelNumber,
        iot_device_id: this.data.applianceData.applianceCode,
        online_status: this.data.applianceData.onlineStatus,
      };
      paramBurial = Object.assign(paramBase, param);
      rangersBurialPoint(eventName, paramBurial);
    }
  },
});
