import {
  requestService
} from "../../../utils/requestService";
import { getReqId, getStamp } from 'm-utilsdk/index'
import images from "../assets/js/img";
import { getFullPageUrl } from "../../../utils/util";

const app = getApp();

Page({
  data: {
    images,
    applianceData: {},
    setting: {},
    status: {},
    orderList: [],
    tabType: 0, //tabType=0为自定义模式，tabType=1时为AI智能启动模式
    isGettingAiData: true,
    isOnTimeAppoint: false, //空代表没有预约开启的数据
    deviceAppointList: [], //本地预约数组
    iconColor: "",
    isSwitch: true,
    deviceList: [],
    showDelect:false
  },

  onLoad: function() {
    let self = this
    const eventChannel = self.getOpenerEventChannel()
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('aiColdWater', function (data) {
      // console.log(data)
      self.setData({
        applianceData: data.applianceData,
        status: data.status,
        setting: data.setting,
        iconColor: data.iconColor,
        isSwitch:data.isSwitch ? data.isSwitch :true
      });
      self.getAiColdWaterSwitch();
      self.showSelf();
    })
  },

  onShow: function () {
    this.sendQueryYYLuaData()
  },

  luaQuery(loading = true, command = {}) {
    let self = this;
    //查询设备状态
    return new Promise((resolve, reject) => {
      if (loading) {
        wx.showLoading({
          title: "加载中",
          mask: true,
        });
      }
      let reqData = {
        reqId: getReqId(),
        stamp: getStamp(),
        applianceCode: this.properties.applianceData.applianceCode,
        command,
      };
      requestService.request("luaGet", reqData).then(
        (resp) => {
          if (loading) {
            wx.hideLoading();
          }
          if (resp.data.code == 0) {
            if (resp.data.data.temperature > 65) {
              this.setData({
                minTemp: 70,
                maxTemp: 130,
              });
            }
            resolve(resp.data.data || {});
          } else {
            reject(resp);
          }
        },
        (error) => {
          if (loading) {
            wx.hideLoading();
          }
          if (error && error.data) {
            if (error.data.code == 1307) {
              //离线
              self.setData({
                "applianceData.onlineStatus": "0",
              });
              self.triggerEvent("modeChange", self.getCurrentMode());
            }
          }
          reject(error);
        }
      );
    });
  },

  luaControl(param) {
    //控制设备
    let self = this;
    return new Promise((resolve, reject) => {
      wx.showLoading({
        title: "加载中",
        mask: true,
      });
      self.setData({
        changing: true,
      });
      let reqData = {
        reqId: getReqId(),
        stamp: getStamp(),
        applianceCode: this.properties.applianceData.applianceCode,
        command: {
          control: param,
        },
      };
      requestService.request("luaControl", reqData).then(
        (resp) => {
          wx.hideLoading();
          self.setData({
            changing: false,
          });
          if (resp.data.code == 0) {
            this.setData({
              status: resp.data.data.status,
            });
            resolve(resp.data.data.status || {});
          } else {
            reject(resp);
          }
        },
        (error) => {
          wx.hideLoading();
          self.setData({
            changing: false,
          });
          wx.showToast({
            title: "请求失败，请稍后重试",
            icon: "none",
            duration: 2000,
          });
          console.error(error);
          reject(error);
        }
      );
    });
  },

  showSelf() {
    if (this.data.tabType == 0) return;
    this.setData({
      tabType: 0
    });
    this.setSavedAppointToDevice();
  },

  // 获取服务器保存的本地零冷水记录
  getServiceAppoint() {
    wx.showLoading({
      title: "加载中",
      mask: true,
    });
    const params = {
      msg: "aiTimedZeroColdWaterPlus",
      params: {
        applianceId: this.data.applianceData.applianceCode,
        platform: this.data.applianceData.sn8,
        userId: app.globalData.userData.iotUserId.toString(),
        uid: app.globalData.userData.uid,
        action: "getAll",
        task: [],
      },
    };
    return new Promise((resolve, reject) => {
      requestService.request("e3", params).then(({
        data: res
      }) => {
        wx.hideLoading()
        res.retCode == 0 ? resolve(res.result) : reject(JSON.stringify(res));
      });
    });
  },

  // 预约开启与关闭
  appointControl(params) {
    return this.luaControl(params);
  },

  afterAppointControl() {
    wx.showLoading({
      title: "加载中",
      mask: true,
    });
    const queryParam = {
      query: {
        query_type: "predict",
      },
    };
    this.luaQuery(true, queryParam).then((res) => {
      this.setData({
        YYLuaData: res
      });
      if (typeof res.appoint_one === "object") {
        this.setData({
          deviceAppointList: [
            res.appoint_one,
            res.appoint_two,
            res.appoint_three,
            res.appoint_four,
          ],
        });
      } else {
        this.setData({
          deviceAppointList: [
            JSON.parse(res.appoint_one),
            JSON.parse(res.appoint_two),
            JSON.parse(res.appoint_three),
            JSON.parse(res.appoint_four),
          ],
        });
      }
      let onAppointList = this.data.deviceAppointList.filter(
        (item) => item[0] == 1
      );
      if (onAppointList.length == 0) {
        this.setData({
          isOnTimeAppoint: false
        });
      }
      this.analysisAppoint();
      this.setAiColdWaterSwitch(1, 0);
    });
  },

  setSavedAppointToDevice() {
    wx.showLoading({
      title: "加载中",
      mask: true,
    });
    let appointIndexArray = [
      "appoint_one",
      "appoint_two",
      "appoint_three",
      "appoint_four",
    ];
    this.getServiceAppoint()
      .then((appointList) => {
        this.setData({
          orderList: []
        });
        let count = 0;
        let appointConvertList = appointList.map((item, index) => {
          let valueArray = item.setting.split(",");
          return [
            valueArray[0] * 255,
            valueArray[1],
            valueArray[2],
            valueArray[3],
            valueArray[4],
            valueArray[5],
            valueArray[6],
          ];
        });
        appointConvertList.map((item, index) => {
          this.appointControl({
            [appointIndexArray[index]]: item.toString(),
          }).then(() => {
            count++;
            if (count == 4) {
              this.afterAppointControl();
            }
          });
        });
      })
      .catch((e) => {
        wx.hideLoading();
        // wx.showModal({
        //   title: e
        // })
        wx.showToast({
          title: JSON.stringify(e),
          icon: 'none'
        });
      });
  },

  // 设置AI定时零冷水总开关
  setAiColdWaterSwitch(value, mode) {
    wx.showLoading({
      title: "加载中",
      mask: true,
    });
    const params = {
      msg: "aiZeroColdWaterSwitchPlus",
      params: {
        applianceId: this.data.applianceData.applianceCode,
        sn8: this.data.applianceData.sn8,
        action: "set",
        switch: value,
        mode: mode,
      },
    };
    requestService
      .request("e3", params)
      .then((res) => {
        this.getAiColdWaterSwitch()
        wx.hideLoading()
      })
      .catch((e) => {
        wx.hideLoading();
        // wx.showModal({
        //   title: e
        // })
        wx.showToast({
          title: JSON.stringify(e),
          icon: 'none'
        });
      });
  },

  //0变为00,1变为01
  initDouble(n) {
    var tmp = "" + n;
    if (n < 10) {
      tmp = "0" + n;
    }
    return tmp;
  },

  to2Bit(val) {
    var _str_val = parseInt(val).toString(2);
    var _str = "";
    if (_str_val.length < 8) {
      for (var i = 0; i < 8 - _str_val.length; i++) {
        _str += "0"; //补零
      }
    }
    var str_2 = _str + _str_val;
    str_2 = str_2.split("").map(Number).reverse();
    return str_2;
  },

  // 转为为周信息
  weekInfo(number) {
    if (number == 255) {
      return "每天";
    } else if ([1, 2, 4, 8, 16, 32, 64].includes(number * 1)) {
      return "仅执行一次(不重复)";
    } else {
      var numArray = this.to2Bit(number);
      return `${numArray[0] ? "周日" : ""}${numArray[1] ? "周一" : ""}${
        numArray[2] ? "周二" : ""
      }${numArray[3] ? "周三" : ""}${numArray[4] ? "周四" : ""}${
        numArray[5] ? "周五" : ""
      }${numArray[6] ? "周六" : ""}`;
    }
  },

  // 处理预约信息拼成预约信息对象
  appointInfo(appoint, idx) {
    //   { time: "06:30 - 07:00", content: "每天" },
    let d1 = this.initDouble(appoint[2]);
    let d2 = this.initDouble(appoint[3]);
    let d3 = this.initDouble(appoint[4]);
    let d4 = this.initDouble(appoint[5]);
    let isCrossDay = `${d1}:${d2}` > `${d3}:${d4}`;
    return {
      time: !isCrossDay ?
        `${d1}:${d2} - ${d3}:${d4}` : `${d1}:${d2} - 次日${d3}:${d4}`,
      content: this.weekInfo(appoint[6]) || "仅执行一次(不重复)",
      status: appoint[0],
    };
  },

  // 解析预约数组
  analysisAppoint() {
    const {
      deviceAppointList
    } = this.data;
    let oList = [
      this.appointInfo(deviceAppointList[0], 0),
      this.appointInfo(deviceAppointList[1], 1),
      this.appointInfo(deviceAppointList[2], 2),
      this.appointInfo(deviceAppointList[3], 3),
    ];
    this.setData({
      orderList: oList.filter((item) => item.status == 1)
    });
    if (this.data.orderList.length > 0) {
      this.setData({
        isOnTimeAppoint: true
      });
    }
  },

  // 处理本地预约清单
  handleDeviceAppointList() {
    let queryParam = {
      query: {
        query_type: "predict"
      }
    };
    this.luaQuery(true, queryParam).then((res) => {
      this.setData({
        YYLuaData: res
      });
      if (typeof res.appoint_one === "object") {
        this.setData({
          deviceAppointList: [
            res.appoint_one,
            res.appoint_two,
            res.appoint_three,
            res.appoint_four,
          ],
        });
      } else {
        this.setData({
          deviceAppointList: [
            JSON.parse(res.appoint_one),
            JSON.parse(res.appoint_two),
            JSON.parse(res.appoint_three),
            JSON.parse(res.appoint_four),
          ],
        });
      }

      let onAppointList = this.data.deviceAppointList.filter(
        (item) => item[0] == 1
      );
      if (!this.data.isAiColdWaterSwitch && onAppointList.length > 0) {
        // 兼容旧的定时零冷水，如果云端AI零冷水总开关关闭，且有本地定时零冷水开启，则将云端AI零冷水总开关置为开启，且切换到自定义模式
        this.setData({
          isAiColdWaterSwitch: false,
           tabType: 0
        });
        this.setAiColdWaterSwitch(0, 0);
      } else {
        // 正常情况
        if (this.data.tabType == 1) {
          // 智能模式
          this.getAiAppoint(false);
        } else {
          // 自定义模式
          if (onAppointList.length == 0) {
            this.setData({
              isOnTimeAppoint: false
            });
          }
        }
      }
      this.analysisAppoint();
    });
  },

  // 获取AI零冷水总开关是否开启
  getAiColdWaterSwitch() {
    const params = {
      msg: "aiZeroColdWaterSwitchPlus",
      params: {
        applianceId: this.data.applianceData.applianceCode,
        sn8: this.data.applianceData.sn8,
        action: "get",
        switch: 1,
        mode: 0,
      },
    };
    wx.showLoading({
      title: "加载中",
      mask: true
    });

    requestService
      .request("e3", params)
      .then(({
        data: res
      }) => {
        wx.hideLoading();
        if (res.retCode == 0) {
          let result = res.result;
          console.log('总开关打开数据',result)
          this.setData({
            isAiColdWaterSwitch: result.switch == 1,
            studyDays: result.studyDays,
            isEarly: result.studyDays == 0 ? false : true,
            tabType: result.mode,
          });
          this.handleDeviceAppointList(result); // 查询本地预约并做相关处理
        }
      })
      .catch((e) => {
        wx.hideLoading();
        // wx.showModal({
        //   title: e
        // })
        wx.showToast({
          title: JSON.stringify(e),
          icon: 'none'
        });
      });
  },

  // ---------------AI预约信息处理------
  // 获取AI零冷水预约
  getAiAppoint(allow) {
    const {
      applianceData
    } = this.data;
    this.setData({
      isOnTimeAppoint: true,
    });
    const params = {
      msg: "aiZeroColdWaterAiSettingPlus",
      params: {
        applianceId: applianceData.applianceCode,
      },
    };
    wx.showLoading({
      title: "加载中",
      mask: true,
    });
    this.setData({
      isGettingAiData: true,
    });
    requestService
      .request("e3", params)
      .then(({
        data: res
      }) => {
        this.setData({
          isGettingAiData: false,
        });
        // 覆盖到本地
        wx.hideLoading();
        if (res.retCode == 0) {
          let result = res.result;
          this.setData({
            isOnTimeAppoint: result.length > 0,
            orderList: result.map((item) => ({
              time: item.startTime + " - " + item.endTime,
              content: "每天",
              status: 1,
            })),
          });
          if (allow && result.length > 0) {
            // 开启所有预约并覆盖到本地
            this.openAppointList(result, allow);
          }
        }
      })
      .catch((e) => {
        wx.hideLoading();
        // wx.showModal({
        //   title: e
        // })
        wx.showToast({
          title: JSON.stringify(e),
          icon: 'none'
        });
      });
  },

  // 开启所有预约并覆盖到本地
  openAppointList(deviceAppointList) {
    wx.showLoading({
      title: "加载中",
      mask: true,
    });
    // 解析AI零冷水列表转换为二进制
    let bitAppointArray = deviceAppointList.map((item, index) => {
      let startTimeArray = item.startTime.split(":");
      let endTimeArray = item.endTime.split(":");
      return [
        Number(startTimeArray[0]),
        Number(startTimeArray[1]),
        Number(endTimeArray[0]),
        Number(endTimeArray[1]),
      ];
    });
    let appointIndexArray = [
      "appoint_one",
      "appoint_two",
      "appoint_three",
      "appoint_four",
    ];
    if (bitAppointArray.length > 0) {
      bitAppointArray.map((item, index) => {
        let appoint = [255, 42, ...item, 255];
        const deviceAppointList = [...this.data.deviceAppointList];
        deviceAppointList[index] = appoint;
        this.setData({
          deviceAppointList,
        });
        this.luaControl({
          [appointIndexArray[index]]: appoint.toString(),
        });
      });
    }
  },
  // 总开关按钮
  updateButton() {
    wx.showLoading({
      title: "加载中",
      mask: true,
    });
    this.setData({
      isAiColdWaterSwitch: !this.data.isAiColdWaterSwitch
    })
    this.setAiColdWaterSwitch(this.data.isAiColdWaterSwitch ? 1 : 0, this.data.tabType)
    if (this.data.isAiColdWaterSwitch) {
      // 开启AI零冷水总开关
      if (this.data.studyDays == 0 && this.data.tabType == 1) {
        // 智能模式，已经学习完成
        this.getAiAppoint(true) // 获取云端预约并下发给电控
      } else {
        // 开启自定义模式
        this.setSavedAppointToDevice()
        // this.isOnTimeAppoint=false
      }
    } else {
      // 关闭AI零冷水总开关
      if (this.data.tabType == 0) {
        // 关闭前是自定义模式则存储本地预约数据
        this.getServiceAppoint().then(appointList => {
          this.sendDeviceAppointToServer(appointList)
          // 关闭本地预约
          console.log('本地预约数据',appointList)
          this.closeAppointList()
        })
      } else {
        // 关闭本地预约
        this.closeAppointList()
      }
    }
  },
  showSmart() {
    if (this.data.tabType == 1) return
    if (this.data.isEarly) {
      wx.showToast({
        title: `学习期剩下${this.data.studyDays}天\n结束后可以使用AI零冷水`,
        icon: 'none'
      });
      return
    }
    this.setData({
      tabType: 1,
      isOnTimeAppoint: true,
    })
    // 上报本地预约给服务器
    this.pushDeviceAppoint()
  },
  // 上报本地预约给服务器
  pushDeviceAppoint() {
    this.getServiceAppoint().then(appointList => {
      const self = this;
      if (0 < appointList.length && appointList.length < 4) {
        const deleteParams = {
          "msg": "aiTimedZeroColdWaterPlus",
          "params": {
            "applianceId": this.data.applianceData.applianceCode,
            "platform": this.data.applianceData.sn8,
            "userId": app.globalData.userData.iotUserId.toString(),
            "uid": app.globalData.userData.uid,
            "action": 'delete',
            "task": appointList.map((item, i) => {
              return {
                "taskId": item.taskId,
                "setting": this.data.deviceAppointList[i].toString()
              }
            })
          }
        }
        this.deleteAppoint(deleteParams).then(res => {
          if (res) {
            self.sendPush([])
          }
        })
      } else {
        this.sendPush(appointList)
      }
    }).catch(err => console.log(err))
  },
  sendPush(appointList) {
    const self = this;
    let isNew = appointList.length == 0 ? true : false //是否第一次新增本地预约到服务器
    const params = {
      "msg": "aiTimedZeroColdWaterPlus",
      "params": {
        "applianceId": this.data.applianceData.applianceCode,
        "platform": this.data.applianceData.sn8,
        "userId": app.globalData.userData.iotUserId.toString(),
        "uid": app.globalData.userData.uid,
        "action": isNew ? 'add' : 'update',
        "task": [{
            "taskId": isNew ? "1" : appointList[0].taskId,
            "setting": this.data.deviceAppointList[0].toString()
          },
          {
            "taskId": isNew ? "2" : appointList[1].taskId,
            "setting": this.data.deviceAppointList[1].toString()
          },
          {
            "taskId": isNew ? "3" : appointList[2].taskId,
            "setting": this.data.deviceAppointList[2].toString()
          },
          {
            "taskId": isNew ? "4" : appointList[3].taskId,
            "setting": this.data.deviceAppointList[3].toString()
          }
        ]
      }
    }
    requestService.request("e3", params).then(res => {
      // 覆盖到本地
      wx.hideLoading()
      if (res.data.retCode == 0) {
        self.closeAppointList()
        self.getAiAppoint(true)
        self.setAiColdWaterSwitch(1, 1)
      }
    }).catch(e => {
      wx.hideLoading();
      // wx.showModal({
      //   title: e
      // })
      wx.showToast({
        title: JSON.stringify(e),
        icon: 'none'
      });
    })
  },
  sendDeviceAppointToServer(appointList) {
    wx.showLoading({
      title: "加载中",
      mask: true,
    });
    let isNew = appointList.length == 0 ? true : false //是否第一次新增本地预约到服务器
    const params = {
      "msg": "aiTimedZeroColdWaterPlus",
      "params": {
        "applianceId": this.data.applianceData.applianceCode,
        "platform": this.data.applianceData.sn8,
        "userId": app.globalData.userData.iotUserId.toString(),
        "uid": app.globalData.userData.uid,
        "action": isNew ? 'add' : 'update',
        "task": [{
            "taskId": isNew ? "1" : appointList[0].taskId,
            "setting": this.data.YYLuaData.appoint_one.toString()
          },
          {
            "taskId": isNew ? "2" : appointList[1].taskId,
            "setting": this.data.YYLuaData.appoint_two.toString()
          },
          {
            "taskId": isNew ? "3" : appointList[2].taskId,
            "setting": this.data.YYLuaData.appoint_three.toString()
          },
          {
            "taskId": isNew ? "4" : appointList[3].taskId,
            "setting": this.data.YYLuaData.appoint_four.toString()
          }
        ]
      }
    }
    requestService.request("e3", params).then(res => {
      wx.hideLoading()
      // 覆盖到本地
      if (res.data.retCode == 0) {
        wx.hideLoading()
      }
    })
  },
  // 关闭所有预约并覆盖到本地
  closeAppointList() {
    let appointOneOff = this.data.deviceAppointList[0][0] == 0
    let appointTwoOff = this.data.deviceAppointList[1][0] == 0
    let appointThreeOff = this.data.deviceAppointList[2][0] == 0
    let appointFourOff = this.data.deviceAppointList[3][0] == 0
    this.setData({
      'deviceAppointList[0]': this.data.deviceAppointList[0].map((item, index) => {
        return index == 0 ? item * 0 : item
      }),
      'deviceAppointList[1]': this.data.deviceAppointList[1].map((item, index) => {
        return index == 0 ? item * 0 : item
      }),
      'deviceAppointList[2]': this.data.deviceAppointList[2].map((item, index) => {
        return index == 0 ? item * 0 : item
      }),
      'deviceAppointList[3]': this.data.deviceAppointList[3].map((item, index) => {
        return index == 0 ? item * 0 : item
      })
    })
    if (!appointOneOff) this.appointControl({
      appoint_one: this.data.deviceAppointList[0].toString()
    }, this.data.deviceAppointList[0], 1)
    if (!appointTwoOff) this.appointControl({
      appoint_two: this.data.deviceAppointList[1].toString()
    }, this.data.deviceAppointList[1], 2)
    if (!appointThreeOff) this.appointControl({
      appoint_three: this.data.deviceAppointList[2].toString()
    }, this.data.deviceAppointList[2], 3)
    if (!appointFourOff) this.appointControl({
      appoint_four: this.data.deviceAppointList[3].toString()
    }, this.data.deviceAppointList[3], 4)
    this.setData({YYLuaData:{}})
  },
  // 拼接预约数组
  creatNormalList(list = []) {
    let arr = [];
    list.map((item, index) => {
      let startTime = `${initDouble(item[2])}:${initDouble(item[3])}`;
      let endTime = `${initDouble(item[4])}:${initDouble(item[5])}`;
      let week_list = this.to2Bit(item[6]);
      let arr2 = [];
      for (var i = 0; i < 7; i++) {
        week_list[i] && arr2.push(i);
      }
      arr.push({
        startTime,
        endTime,
        week: arr2.sort().join(','),
        enable: item[0] != 0,
        taskId: index
      })
    })
    return arr;
  },
  // 获取预约表
  getYYList() {
    this.setData({
      deviceList: [
        this.appointInfo(this.data.appoint_one, 0),
        this.appointInfo(this.data.appoint_two, 1),
        this.appointInfo(this.data.appoint_three, 2),
        this.appointInfo(this.data.appoint_four, 3)
      ]
    })
    this.setData({
      appointList: this.creatNormalList([
        this.appoint_one,
        this.appoint_two,
        this.appoint_three,
        this.appoint_four
      ])
    })
    this.initOnTimeList(this.data.appointList);
  },
  // 预约查询指令
  sendQueryYYLuaData() {
    const queryParam = {
      query: {
        query_type: "predict"
      }
    };
    this.luaQuery(true, queryParam).then((res) => {
      this.setData({
        YYLuaData: res
      });
      if (typeof res.appoint_one === "object") {
        this.setData({
          deviceAppointList: [
            res.appoint_one,
            res.appoint_two,
            res.appoint_three,
            res.appoint_four,
          ],
        });
      } else {
        this.setData({
          deviceAppointList: [
            JSON.parse(res.appoint_one),
            JSON.parse(res.appoint_two),
            JSON.parse(res.appoint_three),
            JSON.parse(res.appoint_four),
          ]
        });
      }
    })
  },
  changeSwitch() {
    this.setData({
      isSwitch: !this.data.isSwitch
    });
  },
  deleteAppoint(params) {
    return requestService.request("e3", params)
  }
});