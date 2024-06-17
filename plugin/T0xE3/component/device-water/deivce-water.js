import computedBehavior from "../../../../utils/miniprogram-computed";
import images from "../../assets/js/img";
import status from "../../assets/js/status";
import { getReqId, getStamp } from 'm-utilsdk/index'
import {
  requestService
} from "../../../../utils/requestService";

Component({
  behaviors: [computedBehavior],
  properties: {
    isSwitch: {
      type: Boolean,
      value: true,
    },
    YYLuaData: {
      type: Object,
      value: {},
    },
    iconColor: {
      type: String,
      value: "",
    },
    applianceData: {
      type: Object,
      value: {},
    },
    setting: {
      type: Object,
      value: {},
    },
    appData: {
      type: Object,
      value: {},
    },
  },
  data: {
    images,
    showComponents:false, //用于组件渲染完成没有
    type: "default", // colmo
    orderList: [],
    appoint_one: [],
    appoint_two: [],
    appoint_three: [],
    appoint_four: [],
    status: status, //产品初始化信息
    appointList: [], // 把预约从数组转成对象放在一起
    appointOnTimeList: [
      [],
      [],
      [],
      [],
      [],
      [],
      []
    ], // 缓存已开启的预约，用来处理时间段重复问题
    isIphoneX: false,
    firstEntry: true, //是否第一次进入
    showDelete: false,
    isCloseAll:false
  },
  computed: {
    orderListShow() {
      return this.data.orderList.filter((item) => item.isShow);
    },
  },
  observers: {
    YYLuaData(nV) {
      if (!nV || !Object.keys(nV).length) return;
      this.initAppoint(nV);
      this.getYYList();
    },
  },

  lifetimes: {
    attached() {
      this.queryLuaData();
      this.queryYYLuaData();
      wx.getSystemInfo({
        success: (res) => this.setData({
          isIphoneX: res.safeArea.top > 20
        }),
      });
    },
  },
  pageLifetimes: {
    show: function () {
      this.queryLuaData();
      this.queryYYLuaData();
    },
  },
  methods: {
    onSwitchChange({
      currentTarget: {
        dataset: {
          item
        },
      },
    }) {
      console.log({
        appointIndex: item.appointIndex
      });
      this.onMideachange(item.appointIndex);
    },

    onCellClick({
      currentTarget: {
        dataset: {
          item
        },
      },
    }) {
      const {
        applianceData,
        setting,
        appData
      } = this.properties;
      wx.navigateTo({
        url: `../device-water-appoint/device-water-appoint`,
        success: function (res) {
          // 通过eventChannel向被打开页面传送数据
          res.eventChannel.emit('deviceWaterAppoint', {
            applianceData: applianceData,
            setting: setting,
            status: appData,
            appointNum: item.appointIndex,
            title: '修改预约',
            isAdd: false
          })
        }
      });
    },

    // 新增预约
    addAppoint() {
      if (this.data.orderListShow.length == 4) {
        wx.showToast({
          title: "仅支持4组预约",
          icon: "none"
        });
        return;
      }
      var appointNum = 0;
      if(this.data.orderList.length < 4) {
        for (var i = 1; i < this.data.orderList.length; i++) {
          if (this.data.orderList[i].isShow == false) {
            appointNum = i;
          }
        }  
      } else {
        for (var i = 0; i < this.data.orderList.length; i++) {
          if (this.data.orderList[i].isShow == false) {
            appointNum = i;
          }
        }
      }
      const {
        applianceData,
        setting,
        appData
      } = this.properties;
      wx.navigateTo({
        url: `../device-water-appoint/device-water-appoint`,
        success: function (res) {
          // 通过eventChannel向被打开页面传送数据
          res.eventChannel.emit('deviceWaterAppoint', {
            applianceData: applianceData,
            setting: setting,
            status: appData,
            appointNum: appointNum,
            isAdd: true,
            title: '新增预约'
          })
        }
      });
    },

    // 判断时间是否冲突
    getConflict(item) {
      if (item.week.trim() == "") return false; //解决长按零冷水周期被清理的bug
      let week_list = item.week.split(",");
      for (let week of week_list) {
        for (let appointOnItem of this.data.appointOnTimeList[week]) {
          if (
            !(
              appointOnItem.endTime < item.startTime ||
              appointOnItem.startTime > item.endTime
            )
          ) {
            wx.showToast({
              title: "该时间段已经设置过预约了",
              icon: "none"
            });
            return true;
          }
        }
      }
      return false;
    },

    // 预约开启与关闭
    appointControl(params) {
      wx.showLoading({
        title: "加载中",
        mask: true
      });
      this.luaControl(params, false)
        .then(res => {
          this.initAppoint(res);
          this.getYYList();
          wx.hideLoading();
          this.triggerEvent("updateDeviceAppointList");
        })
        .catch(e => {
          wx.hideLoading();
          wx.showToast({
            title: "网络较差，请稍后重试",
            icon: "none"
          });
        });
    },

    // 开启或关闭预约
    onMideachange(i) {
      let self = this
      let _item = this.data.appointList[i] || {};
      let isConflict = false; //判断时间段是否冲突
      if (!_item.enable) {
        if (_item.startTime > _item.endTime) {
          // 跨天则将当前预约拆分为两段分别判断
          let item_1 = {
            ..._item,
            endTime: "24:00"
          };
          let week_list = _item.week.split(",");
          isConflict = this.getConflict(item_1);
          let new_week_list = week_list.map((week) => {
            return week == "6" ? 0 : Number(week) + 1;
          });
          let item_2 = {
            ..._item,
            startTime: "00:00",
            week: new_week_list.join(","),
          };
          isConflict = isConflict || this.getConflict(item_2);
        } else {
          isConflict = this.getConflict(_item);
        }
      }
      if (isConflict) return;
      const onNum = this.data.orderListShow.filter(item => item.status == 1)
      if(onNum.length == 1 && JSON.stringify(onNum[0]) == JSON.stringify(this.data.orderListShow.filter(item => item.appointIndex == i)[0])) {
        wx.showModal({
          content: "关闭所有时段定时后，将关闭该功能总开关，不再自动启动零冷水，是否关闭",
          confirmText: "确定关闭",
          cancelText: "容我想想",
          success: (res) => {
            if (res.confirm) {
              self.switchChange(i)
              var pages = getCurrentPages();
              var curPage = pages[pages.length - 1];
              curPage.updateButton()
            }
          },
        });
      } else {
        this.switchChange(i)
      }
    },

    // 执行开关
    switchChange(i) {
      wx.showLoading({
        title: "加载中",
        mask: true
      });
      switch (i) {
        case 0:
          this.setData({
            "appoint_one[0]": !this.data.appoint_one[0] * 255
          });
          var paramsOne = {
            appoint_one: this.data.appoint_one.toString()
          };
          this.appointControl(paramsOne);
          return;
        case 1:
          this.setData({
            "appoint_two[0]": !this.data.appoint_two[0] * 255
          });
          var paramsTwo = {
            appoint_two: this.data.appoint_two.toString()
          };
          this.appointControl(paramsTwo);
          return;
        case 2:
          this.setData({
            "appoint_three[0]": !this.data.appoint_three[0] * 255,
          });
          var paramsThree = {
            appoint_three: this.data.appoint_three.toString(),
          };
          this.appointControl(paramsThree);
          return;
        case 3:
          this.setData({
            "appoint_four[0]": !this.data.appoint_four[0] * 255
          });
          var paramsFour = {
            appoint_four: this.data.appoint_four.toString()
          };
          this.appointControl(paramsFour);
          return;
      }
    },
    
    //隐藏某个预约
    deleteAppoint({
      currentTarget: {
        dataset: {
          item: {
            appointIndex
          },
        },
      },
    }) {
      if (this.data.orderListShow.length == 1) {
        wx.showToast({
          title: "请至少保留一组预约",
          icon: "none"
        });
        return;
      }
      wx.showLoading({
        title: "加载中",
        mask: true
      });
      let param = {};
      var startT = [0, 0];
      var endT = [0, 0];
      let appoint = [0, 0, startT[0], startT[1], endT[0], endT[1], 64]; //实际是设置00:00-00:00执行一次
      switch (appointIndex) {
        case 0:
          param = {
            appoint_one: appoint.toString()
          };
          this.appointControl(param);
          return;
        case 1:
          param = {
            appoint_two: appoint.toString()
          };
          this.appointControl(param);
          return;
        case 2:
          param = {
            appoint_three: appoint.toString()
          };
          this.appointControl(param);
          return;
        case 3:
          param = {
            appoint_four: appoint.toString()
          };
          this.appointControl(param);
          return;
      }
    },

    // 状态查询接口
    queryLuaData() {
      wx.showLoading({
        title: "加载中",
        mask: true
      });
      this.sendQueryLuaData()
        .then((res) => {
          wx.hideLoading();
          this.setData({
            status: res
          });
        })
        .catch((err) => {
          wx.hideLoading();
          //nativeService.toast("网络较差，请稍后重试");
        });
    },

    // 预约查询指令
    sendQueryYYLuaData() {
      const queryParam = {
        query: {
          query_type: "predict",
        },
      };
      return this.luaQuery(true, queryParam);
    },

    // 预约查询接口
    queryYYLuaData() {
      wx.showLoading({
        title: "加载中",
        mask: true
      });
      this.sendQueryYYLuaData()
        .then((res) => {
          wx.hideLoading();
          this.initAppoint(res);
          this.getYYList();
        })
        .catch((e) => {
          wx.hideLoading();
        });
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

    luaControl(param, isShowLoading = true) {
      //控制设备
      let self = this;
      return new Promise((resolve, reject) => {
        if (isShowLoading) {
          wx.showLoading({
            title: "加载中",
            mask: true,
          });
        }
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
            if (isShowLoading) {
              wx.hideLoading();
            }
            self.setData({
              changing: false,
            });
            if (resp.data.code == 0) {
              resolve(resp.data.data.status || {});
            } else {
              reject(resp);
            }
          },
          (error) => {
            if (isShowLoading) {
              wx.hideLoading();
            }
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

    // 状态查询指令
    sendQueryLuaData() {
      const queryParam = {
        query: {
          query_type: "status",
        },
      };
      return this.luaQuery(true, queryParam);
    },

    // 转化预约数据为json对象
    initAppoint(result) {
      if (typeof result.appoint_one === "object") {
        this.setData({
          appoint_one: result.appoint_one,
          appoint_two: result.appoint_two,
          appoint_three: result.appoint_three,
          appoint_four: result.appoint_four,
        });
      } else {
        this.setData({
          appoint_one: JSON.parse(result.appoint_one),
          appoint_two: JSON.parse(result.appoint_two),
          appoint_three: JSON.parse(result.appoint_three),
          appoint_four: JSON.parse(result.appoint_four),
        });
      }
    },

    //0变为00,1变为01
    initDouble(n) {
      var tmp = "" + n;
      if (n < 10) {
        tmp = "0" + n;
      }
      return tmp;
    },

    // 处理预约信息拼成预约信息对象
    appointInfo(appoint, idx) {
      let d1 = this.initDouble(appoint[2]);
      let d2 = this.initDouble(appoint[3]);
      let d3 = this.initDouble(appoint[4]);
      let d4 = this.initDouble(appoint[5]);
      let isCrossDay = `${d1}:${d2}` > `${d3}:${d4}`;
      return {
        title: !isCrossDay ?
          `${d1}:${d2} - ${d3}:${d4}` :
          `${d1}:${d2} - 次日${d3}:${d4}`,
        desc: this.weekInfo(appoint[6]) || "仅执行一次(不重复)",
        status: appoint[0],
        appointIndex: idx,
        isShow: d1 * 1 || d2 * 1 || d3 * 1 || d4 * 1,
      };
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

    // 拼接预约数组
    creatNormalList(list = []) {
      let arr = [];
      list.map((item, index) => {
        let startTime = `${this.initDouble(item[2])}:${this.initDouble(
          item[3]
        )}`;
        let endTime = `${this.initDouble(item[4])}:${this.initDouble(item[5])}`;
        let week_list = this.to2Bit(item[6]);
        let arr2 = [];
        for (var i = 0; i < 7; i++) {
          week_list[i] && arr2.push(i);
        }
        arr.push({
          startTime,
          endTime,
          week: arr2.sort().join(","),
          enable: item[0] != 0,
          taskId: index,
        });
      });
      return arr;
    },

    initOnTimeList(list = []) {
      // 重置存放开启状态的列表
      this.setData({
        appointOnTimeList: [
          [],
          [],
          [],
          [],
          [],
          [],
          []
        ]
      });
      list.map((item, index) => {
        if (item.enable) {
          let week_list = item.week.split(",");
          if (item.startTime > item.endTime) {
            // 跨天则将当前预约拆分为两段
            let item_1 = {
              ...item,
              endTime: "24:00"
            };
            week_list.map((week) => {
              if (this.data.appointOnTimeList[week]) {
                const appointOnTimeList = [...this.data.appointOnTimeList];
                appointOnTimeList[week].push(item_1);
                this.setData({
                  appointOnTimeList
                });
              }
            });
            let new_week_list = week_list.map((week) => {
              return week == "6" ? 0 : Number(week) + 1;
            });
            let item_2 = {
              ...item,
              startTime: "00:00",
              week: new_week_list.join(","),
            };
            new_week_list.map((week) => {
              if (this.data.appointOnTimeList[week]) {
                const appointOnTimeList = [...this.data.appointOnTimeList];
                appointOnTimeList[week].push(item_2);
                this.setData({
                  appointOnTimeList
                });
              }
            });
          } else {
            // 不跨天
            week_list.map((week) => {
              if (this.data.appointOnTimeList[week]) {
                const appointOnTimeList = [...this.data.appointOnTimeList];
                appointOnTimeList[week].push(item);
                this.setData({
                  appointOnTimeList
                });
              }
            });
          }
        }
      });
    },

    // 获取预约表
    async getYYList() {
      const {
        appoint_one,
        appoint_two,
        appoint_three,
        appoint_four,
      } = this.data
      
        this.setData({
          orderList: [
            this.appointInfo(appoint_one, 0),
            this.appointInfo(appoint_two, 1),
            this.appointInfo(appoint_three, 2),
            this.appointInfo(appoint_four, 3),
          ],
          appointList: this.creatNormalList([
            appoint_one,
            appoint_two,
            appoint_three,
            appoint_four,
          ])
        });
      this.initOnTimeList(this.data.appointList);
    },
    // 解决分包后van-swipe-cell渲染问题
    onOpen() {
      this.setData({showDelete: true})
    }
  }
});