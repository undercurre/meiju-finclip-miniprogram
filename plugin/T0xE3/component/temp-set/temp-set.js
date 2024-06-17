import images from "../../assets/js/img";
import computedBehavior from "../../../../utils/miniprogram-computed";
import { getReqId, getStamp } from 'm-utilsdk/index'
import { requestService } from "../../../../utils/requestService";

// 获取范围数组如：【30-40】
const pickerRangeCreate = function (start, end, step) {
  let rs = [];
  while (start <= end) {
    rs.push(start);
    start += step;
  }
  return rs;
};

Component({
  behaviors: [computedBehavior],
  properties: {
    deviceStatus: {
      type: Number,
      value: -1,
    },
    setting: {
      type: Object,
      value: {},
    },
    appData: {
      type: Object,
      value: {},
    },
    applianceData: {
      type: Object,
      value: {},
    },
    iconColor: {
      type: String,
      value: "",
    },
    disabled: {
      type: Boolean,
      value: false,
    },
  },
  computed: {
    temCellRightText() {
      const { setting } = this.properties;
      const { status } = this.data;
      return setting.isHalfTem
        ? ((status.temperature / 2).toFixed(1) || "--") + "℃"
        : (status.temperature || "--") + "℃";
    },
  },
  data: {
    images,
    status: {},
    show:false,
    multiArray: [],
    multiIndex: [0],
    selections: [],
    temperatureIndex: 0,
    halfTem: pickerRangeCreate(35, 65, 0.5),
    tem: pickerRangeCreate(35, 65, 1),
  },
  observers: {
    appData(val) {
      this.setData({ status: val });
    },
    temCellRightText(){
      this.initTemperatureIndex();
    },
    "applianceData,status,setting"(applianceData, status, setting) {
      if (
        !applianceData ||
        !Object.keys(applianceData).length ||
        !setting ||
        !Object.keys(setting).length ||
        !status ||
        !Object.keys(status).length ||
        this.data.selections.length
      ) {
        return;
      }
    }
  },
  methods: {
    initSelections() {
      const { setting, applianceData } = this.properties;
      const { halfTem, tem } = this.data;
      const selections = setting.isHalfTem ? halfTem : tem;
      this.setData({
        selections,
        "multiArray[0]": selections,
      });
      let sn8 = applianceData.sn8;
      let list32 = []; //最小温度32
      let isMin32 = setting.minTem == 32;
      if (list32.indexOf(sn8) != -1 || isMin32) {
        const selections = setting.isHalfTem
          ? pickerRangeCreate(32, 65, 0.5)
          : pickerRangeCreate(32, 65, 1);
        this.setData({
          selections,
          "multiArray[0]": selections,
        });
      }
    },
    initTemperatureIndex() {
      const { selections, status } = this.data;
      const { setting } = this.properties;
      let minTemp = selections[0];
      const temperatureIndex = setting.isHalfTem
        ? Math.round((Number(status.temperature / 2) - minTemp) / 0.5)
        : Math.round((status.temperature - minTemp) / 1);
      this.setData({
        temperatureIndex,
        "multiIndex[0]": temperatureIndex,
      });
    },
    onCellClick() {
      if (this.properties.deviceStatus > 5) return;
      const { status } = this.data;
      if (status && status.bubble == 2) {
        wx.showToast({
          title: "温馨提示：当前为冷气泡开启状态，调整模式请先关闭冷气泡",
          icon: "none",
        });
        return
      } else if(this.properties.disabled) return
      else {
        this.initSelections();
        this.initTemperatureIndex();
        this.setData({ show: true })
      }
    },
    luaControl(param, loading = true) {
      //控制设备
      let self = this;
      return new Promise((resolve, reject) => {
        if (loading) {
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
          applianceCode: this.data.applianceData.applianceCode,
          command: {
            control: param,
          },
        };
        requestService.request("luaControl", reqData).then(
          (resp) => {
            self.setData({
              changing: false,
            });
            if (resp.data.code == 0) {
              this.luaQuery(false)
                .then(() => {
                  if (loading) {
                    wx.hideLoading();
                  }
                  this.triggerEvent("updateStatus", resp.data.data.status);
                  resolve(resp.data.data.status || {});
                })
                .catch(() => reject(resp));
            } else {
              reject(resp);
            }
          },
          (error) => {
            if (loading) {
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
    luaQuery(loading = true) {
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
          command: {},
        };
        requestService.request("luaGet", reqData).then(
          (resp) => {
            if (loading) {
              wx.hideLoading();
            }
            if (resp.data.code == 0) {
              this.setData({ status: resp.data.data });
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
    
    handleCancel() {
      this.setData({ show: false })
    },

    handleConfirm(e) {
      const { selections, temperatureIndex, status } = this.data;
      const { deviceStatus, setting } = this.properties;
      const currentTemp = selections[temperatureIndex];
      const temSelect = this.data.multiArray[0][e.detail[0]]
      this.setData({ show:false })
      if (
        (deviceStatus == 1 || deviceStatus == 2) &&
        currentTemp <= 50 &&
        temSelect > 50
      ) {
        wx.showToast({
          title: "设备加热中,为防止烫伤,启动安全温度调节",
          icon: "none",
        });
        return;
      }
      if (
        deviceStatus == 0 &&
        status.high_temp_lock == "on" &&
        currentTemp <= 50 &&
        temSelect > 50
      ) {
        wx.showToast({
          title: "高温锁开启中,为防止烫伤,启动安全温度调节",
          icon: "none",
        });
        return;
      }
      let hasBathubCurveSelect = setting.hasBathtubCurveSelect;
      const params = setting.isHalfTem
        ? { temperature: temSelect * 2, mode: "shower" }
        : { temperature: temSelect, mode: "shower" };
      let hasSpaMode = setting.hasSpaMode;
      //针对AI智慧浴进行判断
      if (hasBathubCurveSelect) {
        if (
          status.bathtub_curve == 1 ||
          status.bathtub_curve == 2 ||
          status.bathtub_curve == 3
        ) {
          this.luaControl(params).then((res) => {
            let _temp = setting.isHalfTem
              ? res.temperature / 2
              : res.temperature;
            if (currentTemp == _temp && currentTemp != temSelect) {
              wx.showToast({ title: "超出AI智慧浴设置温度范围", icon: "none" });
            }
          });
        } else {
          this.luaControl(params);
        }
      } else if (hasSpaMode) {
        if (status.bathtub_curve == "2") {
          this.luaControl(params).then((res) => {
            let _temp = setting.isHalfTem
              ? res.temperature / 2
              : res.temperature;
            if (currentTemp == _temp && currentTemp != temSelect) {
              wx.showToast({ title: "超出SPA设置温度范围", icon: "none" });
            }
          });
        } else {
          this.luaControl(params);
        }
      } else {
        this.luaControl(params);
      }
    },
  },
});
