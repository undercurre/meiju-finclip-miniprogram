// plugin/T0xCA/card0/card0.js
import netService from '../service/NetService'
import common from '../card0/assets/js/common'
import {
  CARD_MODE_OPTION
} from 'm-miniCommonSDK/index'

var refreshTaskTimer = null
var checkFaultTaskTimer = null //检测故障定时器
var gIdx = 0 //索引变量
const app = getApp()
const pluginEventTrack = app.getGlobalConfig().pluginEventTrack
const getDeviceSn = app.getGlobalConfig().getDeviceSn


Component({
  properties: {
    applianceData: {
      type: Object,
      value: function () {
        return {}
      },
    },
  },
  data: {
    iconServiceUrl: netService.getIconServiceUrl(),
    curFridgeSn8: null,
    screenWidth: 686,
    fridgeModelInfo: {},
    isExtendView: false,
    fridgeZoneType: 0, // 1 (冷藏室、冷冻室); 2 (冷藏室、冷冻室、变温室); 3 (冷藏室、冷冻室、左变温室、右变温室)
    lcsZoneModelShowValue: '',
    ldsZoneModelShowValue: '', //冷冻室
    bwsZoneModelShowValue: '', //变温室
    rightBwsZoneModelShowValue: '', //右变温室
    lcsZoneModelLoading: false, // 进度条
    ldsZoneModelLoading: false,
    bwsZoneModelLoading: false,
    rightBwsZoneModelLoading: false,
    netOptStatus: false, // 网络请求状态
    lcsZoneModel: {
      curValue: '一',
      iCurValue: 0,
      minTemp: 0,
      maxTemp: 0,
      tempType: -1, //0温度; 1档位
      loading: false,
      switch: 'on', //  on 开; off 关
      canClose: true, //是否可以关闭
      gearList: [],
      bingWenModel: '冷藏室',
      optStatus: false, //    是否操作中:   false 否; true 是
      showDegree: false, //是否显示摄氏度
    },
    ldsZoneModel: {
      curValue: '一',
      iCurValue: 0,
      minTemp: 0,
      maxTemp: 0,
      tempType: -1, //0温度; 1档位
      enable: true, // false 不可调节； true 可以调节
      canClose: true, //是否可以关闭
      switch: 'on', //  on 开; off 关
      loading: false,
      bingWenModel: '冷冻室',
      showDegree: false, //是否显示摄氏度
    },
    bwsZoneModel: {
      curValue: '一',
      tempType: -1, //0温度; 1档位
      haveChanageMode: false,
      iCurValue: 0,
      minTemp: 0,
      maxTemp: 0,
      canClose: true, //是否可以关闭
      switch: 'on', //  on 开; off 关
      loading: false,
      chanageModeList: [],
      gearList: [],
      bingWenModel: '',
    },
    rightBwsZoneModel: {
      curValue: '一',
      tempType: -1, //0温度; 1档位
      haveChanageMode: false,
      iCurValue: 0,
      minTemp: 0,
      maxTemp: 0,
      canClose: true, //是否可以关闭
      switch: 'on', //  on 开; off 关
      loading: false,
      chanageModeList: [],
      gearList: [],
      bingWenModel: '',
    },
    cloudKeeperSwitchStatus: false, //云管家的开关状态
    highBrand: 0, //品牌标识（0美的，1科幕，2华凌）
    lcsZoneModelCurValue: '', //冷藏室当前显示值
    ldsZoneModelCurValue: '', //冷冻室当前显示值
    bwsZoneModelCurValue: '', // 变温室当前显示值
    rightBwsZoneModelCurValue: '', // 右变温室当前显示值
    devChecking: false, // 冰箱自检状态
    bxNewUser: 0, //判断用户是否是新机指引用户   1 新机指引用户； 0 非新机指引用户
    hasRecvGift: 0, //是否已领取  0 未领取;  1 已领取; 2 没有资格领取
    hasCheck: 0, //是否已自检   0 没有自检;  1 已经自检
    isShow: 0, //是否显示卡券中心    0 不显示；1 显示
    checkProgress: 0, //自检进度
    checkProgressItem: '', //进度项目
    showCheckViewResult: 0, //  1 没有故障，和 有延保卡； 2 没有故障，和 没有延保卡; 3 有故障 和 有延保卡; 4 有故障 和 没有延保卡; 5 卡券中心
    faultFontColor: '#25CF42', //自检的字体颜色
    checkFaultDevNum: 0, //自检设备的故障数量
    handleCheckDevResult: null, //设备自检的结果
    onlineStatus: 1, //设备在线判断
    lostSn8: false, //缺少SN8
    curRoleId: null, //1002是表示是成员,即是被邀请进家庭的; 1001表示是家长,即这个家庭是他建立的
    curHomeGroupid: null, //所在家庭
    isWJFunc: 0, //是否有微晶模式
    cloudKeeperGuide: false, // 是否云管家引导页面
    fridgeBrand: 0, //品牌标识（0美的，1科幕，2华凌）
    deepcold_temp: '-30', //深冷温度
    isDeepColdMode: '', //是否开启深冷模式
  },
  lifetimes: {
    attached: function () {
      let that = this
      //设置屏幕宽度
      that.setData({
        screenWidth: wx.getSystemInfoSync().windowWidth,
      })
      //获取当前用户角色
      that.getCurRoleId()
      //在线状态的判断
      if ('0' == that.data.applianceData.onlineStatus) {
        that.setData({
          onlineStatus: 0,
        })
      } else {
        that.setData({
          onlineStatus: 1,
        })
      }
      //更新状态
      that.triggerEvent('modeChange', {
        onlineStatus: that.data.onlineStatus,
      })

      //冰箱的SN
      const sn = getDeviceSn(that.properties.applianceData.sn)
      //获取冰箱基本信息
      netService
        .getFridgeDevInfo(that.properties.applianceData.sn8, sn)
        .then((res) => {
          // console.log('------------->Brand  获取冰箱当前信息 | ' + res.data.highBrand);
          if (res.code == '0') {
            that.setData({
              fridgeBrand: res.data.highBrand,
            })
            that.setData({
              fridgeModelInfo: res.data,
              isWJFunc: 1,
            })
            //设置冰箱的微晶模式
            if (res.data.fridgeData.fridgeBaseModeList != null && res.data.fridgeData.fridgeBaseModeList
              .length > 0) {
              for (let idx = 0; idx < res.data.fridgeData.fridgeBaseModeList.length; idx++) {
                let tmpObj = res.data.fridgeData.fridgeBaseModeList[idx]
                if (tmpObj.BaseMode_Type == '12') {
                  //微晶保鲜
                  that.setData({
                    isWJFunc: 1,
                  })
                }
              }
            }
            //渲染冰箱型号页面
            that.drawFridgeModelView()
            //获取当前冰箱状态
            netService
              .getFridgeCurStatus(that.data.applianceData.applianceCode)
              .then((res1) => {
                //渲染页面
                // console.log('------------->  获取冰箱当前状态: ' + JSON.stringify(res1.data.data))
                that.drawFridgeStatusView(res1.data.data)
                //初始化模式组件
                that.selectComponent("#model-container").init(that.data.applianceData.applianceCode, sn, res
                  .data.fridgeData, res1.data
                  .data);
              })
              .catch((res1) => {
                console.log('------------->  获取冰箱当前状态异常')
              })
            //获取云管家状态
            netService.getCloudKeeperSwitchStatus(that.data.applianceData.applianceCode).then((res1) => {
              //  云管家状态初始化
              if (res1.code == '0') {
                if (res1.data == 1) {
                  // 开状态
                  that.data.cloudKeeperSwitchStatus = true
                } else if (res1.data == 0) {
                  // 关状态
                  that.data.cloudKeeperSwitchStatus = false
                }
                that.setData({
                  cloudKeeperSwitchStatus: that.data.cloudKeeperSwitchStatus,
                })
                //判断是否新机指引入口
                if (app.globalData.bxNewUser != null && app.globalData.bxNewUser == 1) {
                  //是新用户
                  that.setData({
                    bxNewUser: 1,
                  })
                  app.globalData.bxNewUser = null
                  //获取设备自检信息
                  if (that.data.onlineStatus == 1) {
                    that.getDevCheckRecord(
                      app.globalData.userData.uid,
                      app.globalData.phoneNumber,
                      that.properties.applianceData.applianceCode,
                      1,
                      that.data.curRoleId,
                      that.data.curHomeGroupid
                    )
                  }
                } else {
                  //非新用户
                  that.setData({
                    bxNewUser: 0,
                    devChecking: false,
                  })
                  app.globalData.bxNewUser = null
                  if (that.data.onlineStatus == 1) {
                    that.getDevCheckRecordO(
                      app.globalData.userData.uid,
                      app.globalData.phoneNumber,
                      that.properties.applianceData.applianceCode,
                      0,
                      that.data.curRoleId,
                      that.data.curHomeGroupid
                    )
                  }
                }
              }
            })
          }
        })
        .catch((res) => {
          //与美居app逻辑一致
          that.setData({
            lostSn8: true,
            onlineStatus: 0,
          })
          that.triggerEvent('modeChange', {
            onlineStatus: 0,
          })
        })
    },
  },
  methods: {
    getCurrentMode() {
      //当设备列表页切换到当前页面时，应该呈现的整体样式
      let mode
      if (this.data.applianceData.onlineStatus == 0) {
        // 离线
        mode = CARD_MODE_OPTION.OFFLINE
      } else {
        // 在线
        mode = CARD_MODE_OPTION.HEAT
      }
      return {
        applianceCode: this.data.applianceData.applianceCode,
        mode: mode,
      }
    },
    getActived() {
      //当设备列表页切换到当前页面时触发
      //通知外界更新界面
      this.triggerEvent('modeChange', this.getCurrentMode())
    },
    runPageRefreshTask: function () {
      let that = this
      if (refreshTaskTimer == null) {
        refreshTaskTimer = setInterval(
          function () {
            if (!that.data.lostSn8) {
              that.checkDevStatus()
              //更新云管家状态
              netService.getCloudKeeperSwitchStatus(that.data.applianceData.applianceCode).then((res1) => {
                //  云管家状态初始化
                if (res1.code == '0') {
                  if (res1.data == 1) {
                    // 开状态
                    that.data.cloudKeeperSwitchStatus = true
                    that.setData({
                      cloudKeeperGuide: false,
                    })
                  } else if (res1.data == 0) {
                    // 关状态
                    that.data.cloudKeeperSwitchStatus = false
                  }
                  that.setData({
                    cloudKeeperSwitchStatus: that.data.cloudKeeperSwitchStatus,
                  })
                }
              })
            }
          }.bind(this),
          7000
        )
      }
    },
    getCurRoleId: function () {
      //curRoleId: null,//1002是表示是成员,即是被邀请进家庭的; 1001表示是家长,即这个家庭是他建立的
      for (let idx = 0; idx < app.globalData.homeGrounpList.length; idx++) {
        let entity = app.globalData.homeGrounpList[idx]
        if (entity.homegroupId == app.globalData.currentHomeGroupId) {
          this.setData({
            curRoleId: entity.roleId,
            curHomeGroupid: entity.homegroupId,
          })
        }
      }
    },
    checkDevStatus: function () {
      let that = this
      netService
        .getFridgeCurStatus(that.data.applianceData.applianceCode)
        .then((res) => {
          if (res.statusCode == 200 && (res.data.code == '0' || res.data.code == 0)) {
            that.setData({
              onlineStatus: 1,
            })
            that.triggerEvent('modeChange', {
              onlineStatus: 1,
            })
            //同步状态
            if (!that.data.netOptStatus) {
              that.drawFridgeStatusView(res.data.data)
            }
          } else {
            that.setData({
              onlineStatus: 0,
            })
            that.triggerEvent('modeChange', {
              onlineStatus: 0,
            })
          }
        })
        .catch((res1) => {
          //console.log("----------->  状态更新异常:  " + JSON.stringify(res1));
          that.setData({
            onlineStatus: 0,
          })
          that.triggerEvent('modeChange', {
            onlineStatus: 0,
          })
        })
    },
    initCard() {
      let that = this
      //当初始化时候调用
      //动画
      that.initBgAnimationView()
      //加载图标
      that.initLoadingIcon()
      //设备状态检测
      that.runPageRefreshTask()
    },
    changeFridgeStatusTask: function () {
      var that = this
      netService
        .getFridgeCurStatus(that.data.applianceData.applianceCode)
        .then((res) => {
          //渲染页面
          that.drawFridgeTplStatusView(res.data.data)
        })
        .catch((res1) => {
          console.log('------------->  获取冰箱当前状态异常: ' + JSON.stringify(res1))
        })
      //获取云管家状态
      netService.getCloudKeeperSwitchStatus(that.data.applianceData.applianceCode).then((res1) => {
        //  云管家状态初始化
        if (res1.code == '0') {
          if (res1.data == 1) {
            // 开状态
            that.data.cloudKeeperSwitchStatus = true
            that.setData({
              cloudKeeperGuide: false,
            })
          } else if (res1.data == 0) {
            // 关状态
            that.data.cloudKeeperSwitchStatus = false
          }
          that.setData({
            cloudKeeperSwitchStatus: that.data.cloudKeeperSwitchStatus,
          })
        }
      })
    },
    getDestoried() {
      //执行当前页面前后插件的业务逻辑，主要用于一些清除工作
      if (refreshTaskTimer != null) {
        clearInterval(refreshTaskTimer)
        refreshTaskTimer = null
      }
      if (checkFaultTaskTimer != null) {
        clearTimeout(checkFaultTaskTimer)
        checkFaultTaskTimer = null
      }
    },
    drawFridgeModelView: function () {
      //冰箱室类型   fridgeZoneType    0冷藏室，1冷冻室，2变温室，3微晶室，4左变温室室，5右变温室
      //  1 (冷藏室、冷冻室); 2 (冷藏室、冷冻室、变温室); 3 (冷藏室、冷冻室、左变温室、右变温室)
      let fridgeZoneList = this.data.fridgeModelInfo.fridgeData.fridgeZoneList
      //设置冰箱型号
      this.setData({
        highBrand: this.data.fridgeModelInfo.highBrand,
      })
      let weight = 0
      for (let idx = 0; idx < fridgeZoneList.length; idx++) {
        var entity = fridgeZoneList[idx]
        if (entity.ZoneType == '0') {
          // 1冷藏室
          weight += 1
          if (entity.bingWenModel != null && entity.bingWenModel != '无' && entity.bingWenModel.length > 0) {
            this.data.bwsZoneModel.bingWenModel = entity.bingWenModel
          }
        } else if (entity.ZoneType == '1') {
          // 10冷冻室
          weight += 10
          if (entity.bingWenModel != null && entity.bingWenModel != '无' && entity.bingWenModel.length > 0) {
            this.data.ldsZoneModel.bingWenModel = entity.bingWenModel
          }
        } else if (entity.ZoneType == '2') {
          // 100变温室
          weight += 100
          if (entity.bingWenModel != null && entity.bingWenModel != '无' && entity.bingWenModel.length > 0) {
            this.data.bwsZoneModel.bingWenModel = entity.bingWenModel
          }
        } else if (entity.ZoneType == '4') {
          // 1000左变温室室
          weight += 1000
        } else if (entity.ZoneType == '5') {
          // 10000右变温室
          weight += 10000
          if (entity.bingWenModel != null && entity.bingWenModel != '无' && entity.bingWenModel.length > 0) {
            this.data.rightBwsZoneModel.bingWenModel = entity.bingWenModel
          }
        }
      }
      if (weight == 11) {
        this.setData({
          fridgeZoneType: 1,
        })
      } else if (weight == 111) {
        if (this.data.bwsZoneModel.bingWenModel == null || this.data.bwsZoneModel.bingWenModel.length == 0) {
          this.data.bwsZoneModel.bingWenModel = '变温室'
        }
        this.setData({
          fridgeZoneType: 2,
        })
      } else if (weight == 10111) {
        if (this.data.bwsZoneModel.bingWenModel == null || this.data.bwsZoneModel.bingWenModel.length == 0) {
          //AI哎嘌呤仓  显示变温室
          if (entity.bianWenAlias != '') {
            this.data.bwsZoneModel.bingWenModel = '变温室'
          } else this.data.bwsZoneModel.bingWenModel = '左变温室'
        }
        if (this.data.rightBwsZoneModel.bingWenModel == null || this.data.rightBwsZoneModel.bingWenModel.length ==
          0) {
          if (entity.bianWenAlias != '') {
            //处理别名显示
            this.data.rightBwsZoneModel.bingWenModel = entity.bianWenAlias
          } else this.data.rightBwsZoneModel.bingWenModel = '右变温室'
        }
        this.setData({
          fridgeZoneType: 3,
        })
      } else if (weight == 101) {
        if (
          this.data.bwsZoneModel.bingWenModel == null ||
          this.data.bwsZoneModel.bingWenModel.length == 0 ||
          '无' == this.data.bwsZoneModel.bingWenModel
        ) {
          this.data.bwsZoneModel.bingWenModel = '变温室'
        }
        this.setData({
          fridgeZoneType: 4,
        })
      } else if (weight == 10011) {
        //冷冻室  冷藏室  变温室
        if (this.data.rightBwsZoneModel.bingWenModel == null || this.data.rightBwsZoneModel.bingWenModel.length ==
          0) {
          if (entity.bianWenAlias != '') {
            //处理别名显示
            this.data.rightBwsZoneModel.bingWenModel = entity.bianWenAlias
          } else this.data.rightBwsZoneModel.bingWenModel = '变温室'
        }
        this.setData({
          fridgeZoneType: 5,
        })
      }
    },
    drawFridgeStatusView: function (curStatus) {
      var that = this
      let isDeepCold = false;
      if (curStatus.deep_cold_mode == 'on') {//判断是否是深冷模式
        isDeepCold = true
      }
      this.setData({
        isDeepColdMode: isDeepCold
      })
      //工作模式刷新
      that.selectComponent("#model-container").drawFridgeStatusView(curStatus);
      //判断类型
      let fridgeZoneList = this.data.fridgeModelInfo.fridgeData.fridgeZoneList
      for (let idx = 0; idx < fridgeZoneList.length; idx++) {
        var entity = fridgeZoneList[idx]
        if (entity.ZoneType == '0') {
          // 1冷藏室
          if (entity.tempType == '0') {
            //调温方式: 温度
            that.data.lcsZoneModel.tempType = 0
            let minTemp = parseInt(entity.MinTemp)
            let maxTemp = parseInt(entity.MaxTemp)
            that.data.lcsZoneModel.minTemp = minTemp
            that.data.lcsZoneModel.maxTemp = maxTemp
            that.data.lcsZoneModel.iCurValue = parseInt(curStatus.storage_temperature)
            //设置值
            let tmpModelValue = curStatus.storage_temperature //+"℃";
            that.setData({
              lcsZoneModelShowValue: that.data.lcsZoneModel.iCurValue,
            })
            if (that.data.lcsZoneModel.switch == 'on') {
              that.setData({
                lcsZoneModelCurValue: tmpModelValue,
              })
            }
          } else if (entity.tempType == '1') {
            //调温方式: 挡位
            that.data.lcsZoneModel.tempType = 1
            that.data.lcsZoneModel.gearList = entity.gearList
            let tmpModelValue = curStatus.storage_temperature //+"℃";
            for (let idx = 0; idx < entity.gearList.length; idx++) {
              if (entity.gearList[idx].gearTemp == curStatus.storage_temperature) {
                that.data.lcsZoneModel.iCurValue = idx
                break
              }
            }
            that.setData({
              lcsZoneModelShowValue: that.data.lcsZoneModel.gearList[that.data.lcsZoneModel.iCurValue]
                .gearName,
              lcsZoneModelCurValue: tmpModelValue,
            })
          }
          //设置开关状态
          that.data.lcsZoneModel.switch = curStatus.storage_power
          if (that.data.lcsZoneModel.switch == 'off') {
            let tmpModelValue = '一'
            that.setData({
              lcsZoneModelCurValue: tmpModelValue,
            })
            that.data.lcsZoneModel.showDegree = false
          } else {
            that.data.lcsZoneModel.showDegree = true
          }
          that.data.lcsZoneModel.canClose = entity.canClose
          that.setData({
            lcsZoneModel: that.data.lcsZoneModel,
          })
        } else if (entity.ZoneType == '1') {
          // 10冷冻室
          if (entity.tempType == '0' || entity.tempType == '1') {
            //0 可调节，1 不可调节
            that.data.ldsZoneModel.tempType = 0
            if (entity.tempType == '1') {
              that.data.ldsZoneModel.enable = false
            } else if (entity.tempType == '0') {
              that.data.ldsZoneModel.enable = true
            }
            let minTemp = parseInt(entity.MinTemp)
            let maxTemp = parseInt(entity.MaxTemp)
            that.data.ldsZoneModel.minTemp = minTemp
            that.data.ldsZoneModel.maxTemp = maxTemp
            that.data.ldsZoneModel.iCurValue = parseInt(curStatus.freezing_temperature)
            that.setData({
              ldsZoneModelShowValue: that.data.ldsZoneModel.iCurValue,
            })
          } else if (entity.tempType == '2') {
            //档位调节
            that.data.ldsZoneModel.tempType = 1
            that.data.ldsZoneModel.enable = true
            that.data.ldsZoneModel.gearList = entity.gearList
            for (let idx = 0; idx < entity.gearList.length; idx++) {
              if (entity.gearList[idx].gearTemp == curStatus.freezing_temperature) {
                that.data.ldsZoneModel.iCurValue = idx
                break
              }
            }
            that.setData({
              ldsZoneModelShowValue: that.data.ldsZoneModel.gearList[that.data.ldsZoneModel.iCurValue]
                .gearName,
            })
          }
          //设置值
          that.data.ldsZoneModel.switch = curStatus.freezing_power
          let tmpModelValue = curStatus.freezing_temperature //+"℃";
          that.data.ldsZoneModel.canClose = entity.canClose
          if (that.data.ldsZoneModel.switch == 'off') {
            tmpModelValue = '一'
            that.data.ldsZoneModel.showDegree = false
          } else {
            that.data.ldsZoneModel.showDegree = true
          }
          that.setData({
            ldsZoneModel: that.data.ldsZoneModel,
            ldsZoneModelCurValue: tmpModelValue,
          })
        } else if (entity.ZoneType == '2') {
          // 100变温室
          that.data.bwsZoneModel.haveChanageMode = entity.haveChanageMode
          if (entity.haveChanageMode) {
            //有模式状态
            that.data.bwsZoneModel.tempType = 3
            that.data.bwsZoneModelCurValue = common.getVariableMode(curStatus.variable_mode)
            that.data.bwsZoneModel.chanageModeList = []
            for (let idx = 0; idx < entity.chanageModeList.length; idx++) {
              let tmpMode = common.getVariableModeInt(entity.chanageModeList[idx].chanageMode_Type)
              that.data.bwsZoneModel.chanageModeList.push(tmpMode)
              if (curStatus.variable_mode == tmpMode.cmd) {
                that.data.bwsZoneModel.iCurValue = idx
              }
            }
          } else {
            //然后 档位控制、温度控制
            if (entity.tempType == '0') {
              //温度控制
              that.data.bwsZoneModel.tempType = 0
              let minTemp = parseInt(entity.MinTemp)
              let maxTemp = parseInt(entity.MaxTemp)
              that.data.bwsZoneModel.minTemp = minTemp
              that.data.bwsZoneModel.maxTemp = maxTemp
              that.data.bwsZoneModel.iCurValue = parseInt(curStatus.left_flexzone_temperature)
              that.setData({
                bwsZoneModelShowValue: that.data.bwsZoneModel.iCurValue,
              })
              //设置值
              //that.data.bwsZoneModel.curValue = curStatus.left_flexzone_temperature +"℃";
              that.data.bwsZoneModelCurValue = curStatus.left_flexzone_temperature + '℃'
            } else if (entity.tempType == '1') {
              //档位控制
              that.data.bwsZoneModel.tempType = 1
              that.data.bwsZoneModel.gearList = entity.gearList
              for (let idx = 0; idx < entity.gearList.length; idx++) {
                if (entity.gearList[idx].gearTemp == curStatus.left_flexzone_temperature) {
                  that.data.bwsZoneModel.iCurValue = idx
                  //that.data.bwsZoneModel.curValue = entity.gearList[idx].gearName;
                  that.data.bwsZoneModelCurValue = entity.gearList[idx].gearName
                  that.setData({
                    bwsZoneModelShowValue: that.data.bwsZoneModel.gearList[idx].gearName,
                  })
                  break
                }
              }
            }
          }
          that.data.bwsZoneModel.switch = curStatus.left_flexzone_power
          that.data.bwsZoneModel.canClose = entity.canClose
          if (that.data.bwsZoneModel.switch == 'off') {
            // that.data.bwsZoneModel.curValue = '一';
            that.data.bwsZoneModelCurValue = '一'
          }
          that.setData({
            bwsZoneModel: that.data.bwsZoneModel,
            bwsZoneModelCurValue: that.data.bwsZoneModelCurValue,
          })
        } else if (entity.ZoneType == '5') {
          // 10000右变温室
          if (entity.tempType == '0') {
            that.data.rightBwsZoneModel.tempType = 0
            that.data.rightBwsZoneModel.curValue = curStatus.right_flexzone_temperature + '℃'
            that.data.rightBwsZoneModelCurValue = curStatus.right_flexzone_temperature + '℃'
            //获取范围
            let minTemp = parseInt(entity.MinTemp)
            let maxTemp = parseInt(entity.MaxTemp)
            that.data.rightBwsZoneModel.minTemp = minTemp
            that.data.rightBwsZoneModel.maxTemp = maxTemp
            that.data.rightBwsZoneModel.iCurValue = parseInt(curStatus.right_flexzone_temperature)
            that.setData({
              rightBwsZoneModelShowValue: that.data.rightBwsZoneModel.iCurValue,
            })
          } else if (entity.tempType == '1') {
            that.data.rightBwsZoneModel.tempType = 1
            //处理档位显示
            that.data.rightBwsZoneModel.gearList = entity.gearList
            for (let idx = 0; idx < entity.gearList.length; idx++) {
              if (entity.gearList[idx].gearTemp == curStatus.right_flexzone_temperature) {
                that.data.rightBwsZoneModel.iCurValue = idx
                that.data.rightBwsZoneModel.curValue = entity.gearList[idx].gearName
                that.data.rightBwsZoneModelCurValue = entity.gearList[idx].gearName
                that.setData({
                  rightBwsZoneModelShowValue: that.data.rightBwsZoneModel.curValue,
                })
                break
              }
            }
          }
          that.data.rightBwsZoneModel.switch = curStatus.right_flexzone_power
          that.data.rightBwsZoneModel.canClose = entity.canClose
          if (that.data.rightBwsZoneModel.switch == 'off') {
            that.data.rightBwsZoneModel.curValue = '一'
          }
          that.setData({
            rightBwsZoneModelCurValue: that.data.rightBwsZoneModelCurValue,
            rightBwsZoneModel: that.data.rightBwsZoneModel,
          })
        }
      }
    },
    extendViewAction: function () {
      if (!this.data.devChecking) {
        this.data.isExtendView = !this.data.isExtendView
        this.setData({
          isExtendView: this.data.isExtendView,
        })
      }
    },
    viewOpenDoorRecordAction: function () {
      let that = this
      if (!that.data.devChecking) {
        if (this.data.highBrand == 1) {
          wx.showToast({
            title: 'Colmo品牌不支持此功能',
            icon: 'none',
          })
        } else {
          //开关门响应
          wx.navigateTo({
            url: '../record/openDoorRecord?fridgeId=' + that.data.applianceData.applianceCode,
          })
        }
        //点击事件埋点： 开关门记录查看点击事件
        pluginEventTrack(
          'user_behavior_event',
          null, {
            page_id: 'page_card0_card0',
            page_name: '开关门记录按钮点击统计',
            widget_id: 'click_bth_opendoor_record',
            widget_name: '开关门记录查看点击事件',
            bd_name: '冰箱',
            element_content: '开关门记录查看点击事件',
          }, {}
        )
      }
    },
    viewMonthReportAction: function () {
      let that = this
      //点击事件埋点： 开关门记录查看点击事件
      pluginEventTrack(
        'user_behavior_event',
        null, {
          page_id: 'page_card0_card0',
          page_name: '月度报告功能按钮点击统计',
          widget_id: 'click_bth_monthreport',
          widget_name: '月度报告功能点击事件',
          bd_name: '冰箱',
          element_content: '月度报告功能点击事件',
        }, {}
      )

      if (!that.data.devChecking) {
        let devBrand = null
        let fridgeId = null
        //查看月度报告
        if (that.data.fridgeModelInfo != null) {
          devBrand = that.data.fridgeModelInfo.highBrand
          fridgeId = that.data.applianceData.applianceCode
        }
        let fridgeIdEncodeStr = common.encode(fridgeId)
        if (fridgeIdEncodeStr != null && fridgeIdEncodeStr.length > 0) {
          wx.navigateTo({
            url: '../report/monthReport?fridgeId=' + fridgeIdEncodeStr + '&brand=' + devBrand + '&source=mj',
          })
        }
      }
    },
    initBgAnimationView: function () {},
    initLoadingIcon: function () {},
    sliderChangingAction: function (e) {
      let that = this
      that.setData({
        netOptStatus: true,
      })
      var actionId = e.currentTarget.dataset.id
      if (actionId == 'lcs') {
        if (that.data.lcsZoneModel.tempType == 0) {
          that.setData({
            lcsZoneModelShowValue: e.detail.value,
          })
        } else if (that.data.lcsZoneModel.tempType == 1) {
          that.setData({
            lcsZoneModelShowValue: that.data.lcsZoneModel.gearList[e.detail.value].gearName,
          })
        }
      } else if (actionId == 'lds') {
        if (that.data.ldsZoneModel.tempType == 0) {
          that.setData({
            ldsZoneModelShowValue: e.detail.value,
          })
        } else if (that.data.ldsZoneModel.tempType == 1) {
          that.setData({
            ldsZoneModelShowValue: that.data.ldsZoneModel.gearList[e.detail.value].gearName,
          })
        }
      } else if (actionId == 'bws') {
        if (that.data.bwsZoneModel.tempType == 0) {
          //温度调节
          that.setData({
            bwsZoneModelShowValue: e.detail.value,
          })
        } else if (that.data.bwsZoneModel.tempType == 3) {
          //模式调节
        } else if (that.data.bwsZoneModel.tempType == 1) {
          //变温室 档位调节
          that.setData({
            bwsZoneModelShowValue: that.data.bwsZoneModel.gearList[e.detail.value].gearName,
          })
        }
      } else if (actionId == 'ybws') {
        if (that.data.rightBwsZoneModel.tempType == 0) {
          that.setData({
            rightBwsZoneModelShowValue: e.detail.value,
          })
        } else if (that.data.rightBwsZoneModel.tempType == 1) {
          that.setData({
            rightBwsZoneModelShowValue: that.data.rightBwsZoneModel.gearList[e.detail.value].gearName,
          })
        }
      }
    },
    sliderChangeAction: function (e) {
      let that = this
      var actionId = e.currentTarget.dataset.id
      if (actionId == 'lcs') {
        // 点击埋点事件: 冷藏室温度调节行为事件
        pluginEventTrack(
          'user_behavior_event',
          null, {
            page_id: 'page_card0_card0',
            page_name: '冷藏室温度调节行为统计',
            widget_id: 'click_bth_lcs_action',
            widget_name: '冷藏室温度调节行为事件',
            bd_name: '冰箱',
            element_content: '冷藏室温度调节行为事件',
          }, {}
        )
        let errDesc = '冷藏室设置失败'
        if (that.data.lcsZoneModel.tempType == 0) {
          //发送请求
          that.setData({
            lcsZoneModelLoading: true,
          })
          let tmpValue = e.detail.value
          that.unifiedDevCtrFunc(
            that.data.applianceData.applianceCode, {
              storage_temperature: e.detail.value,
            },
            function () {
              that.setData({
                lcsZoneModelLoading: false,
              })
              that.data.lcsZoneModel.iCurValue = tmpValue
              that.setData({
                lcsZoneModelShowValue: that.data.lcsZoneModel.iCurValue,
              })
              that.setData({
                lcsZoneModel: that.data.lcsZoneModel,
              })
            },
            errDesc
          )
        } else if (that.data.lcsZoneModel.tempType == 1) {
          //发送请求
          that.setData({
            lcsZoneModelLoading: true,
          })
          let tmpValue = e.detail.value
          that.unifiedDevCtrFunc(
            that.data.applianceData.applianceCode, {
              storage_temperature: parseInt(that.data.lcsZoneModel.gearList[e.detail.value].gearTemp),
            },
            function () {
              that.setData({
                lcsZoneModelLoading: false,
              })
              that.data.lcsZoneModel.iCurValue = tmpValue
              that.setData({
                lcsZoneModelShowValue: that.data.lcsZoneModel.gearList[that.data.lcsZoneModel.iCurValue]
                  .gearName,
              })
              that.setData({
                lcsZoneModel: that.data.lcsZoneModel,
              })
            },
            errDesc
          )
        }
      } else if (actionId == 'lds') {
        // 点击埋点事件: 冷冻室温度调节行为事件
        pluginEventTrack(
          'user_behavior_event',
          null, {
            page_id: 'page_card0_card0',
            page_name: '冷冻室温度调节行为统计',
            widget_id: 'click_bth_lds_action',
            widget_name: '冷冻室温度调节行为事件',
            bd_name: '冰箱',
            element_content: '冷冻室温度调节行为事件',
          }, {}
        )
        let errDesc = '冷冻室设置失败'
        if (that.data.ldsZoneModel.tempType == 0) {
          //冷冻室 温度调节
          that.setData({
            ldsZoneModelLoading: true,
          })
          let tmpValue = e.detail.value
          that.unifiedDevCtrFunc(
            that.data.applianceData.applianceCode, {
              freezing_temperature: e.detail.value,
            },
            function () {
              that.setData({
                ldsZoneModelLoading: false,
              })
              that.data.ldsZoneModel.iCurValue = tmpValue
              that.setData({
                ldsZoneModel: that.data.ldsZoneModel,
                ldsZoneModelShowValue: tmpValue,
              })
            },
            errDesc
          )
        } else if (that.data.ldsZoneModel.tempType == 1) {
          //冷冻室 档位调节
          that.setData({
            ldsZoneModelLoading: true,
          })
          let tmpValue = e.detail.value
          that.unifiedDevCtrFunc(
            that.data.applianceData.applianceCode, {
              freezing_temperature: parseInt(that.data.ldsZoneModel.gearList[e.detail.value].gearTemp),
            },
            function () {
              that.data.ldsZoneModel.iCurValue = tmpValue
              that.setData({
                ldsZoneModelLoading: false,
              })
              that.setData({
                ldsZoneModelShowValue: that.data.ldsZoneModel.gearList[that.data.ldsZoneModel.iCurValue]
                  .gearName,
              })
              that.setData({
                ldsZoneModel: that.data.ldsZoneModel,
              })
            },
            errDesc
          )
        }

      } else if (actionId == 'bws') {
        // 点击埋点事件: 变温室温度调节行为统计事件
        pluginEventTrack(
          'user_behavior_event',
          null, {
            page_id: 'page_card0_card0',
            page_name: '变温室温度调节行为统计',
            widget_id: 'click_bth_bws_action',
            widget_name: '变温室温度调节行为统计事件',
            bd_name: '冰箱',
            element_content: '变温室温度调节行为统计事件',
          }, {}
        )
        let errDesc = '变温室设置失败'
        that.setData({
          bwsZoneModelLoading: true,
        })
        if (that.data.bwsZoneModel.tempType == 0) {
          //温度调节
          let tmpValue = e.detail.value
          that.unifiedDevCtrFunc(
            that.data.applianceData.applianceCode, {
              left_flexzone_temperature: e.detail.value,
            },
            function () {
              that.setData({
                bwsZoneModelLoading: false,
              })
              that.data.bwsZoneModel.iCurValue = tmpValue
              that.setData({
                bwsZoneModel: that.data.bwsZoneModel,
                bwsZoneModelShowValue: tmpValue,
              })
            },
            errDesc
          )
        } else if (that.data.bwsZoneModel.tempType == 3) {
          //模式调节
          let optCmd = that.data.bwsZoneModel.chanageModeList[e.detail.value].cmd
          that.unifiedDevCtrFunc(
            that.data.applianceData.applianceCode, {
              variable_mode: optCmd,
            },
            function () {
              that.setData({
                bwsZoneModelLoading: false,
              })
              that.setData({
                bwsZoneModel: that.data.bwsZoneModel,
              })
            },
            errDesc
          )
        } else if (that.data.bwsZoneModel.tempType == 1) {
          //变温室 档位调节
          let tmpValue = e.detail.value
          let bwsTemp = parseInt(that.data.bwsZoneModel.gearList[tmpValue].gearTemp)
          that.unifiedDevCtrFunc(
            that.data.applianceData.applianceCode, {
              left_flexzone_temperature: bwsTemp,
            },
            function () {
              that.setData({
                bwsZoneModelLoading: false,
              })
              that.data.bwsZoneModel.iCurValue = tmpValue
              that.setData({
                bwsZoneModel: that.data.bwsZoneModel,
                bwsZoneModelShowValue: that.data.bwsZoneModel.gearList[tmpValue].gearName,
              })
            },
            errDesc
          )
        }
      } else if (actionId == 'ybws') {
        // 点击埋点事件: 变温室温度调节行为统计事件
        pluginEventTrack(
          'user_behavior_event',
          null, {
            page_id: 'page_card0_card0',
            page_name: '变温室温度调节行为统计',
            widget_id: 'click_bth_ybws_action',
            widget_name: '变温室温度调节行为统计事件',
            bd_name: '冰箱',
            element_content: '变温室温度调节行为统计事件',
          }, {}
        )
        let errDesc = '右变温室设置失败'
        that.setData({
          rightBwsZoneModelLoading: true,
        })
        let tmpValue = e.detail.value
        if (that.data.rightBwsZoneModel.tempType == 0) {
          that.unifiedDevCtrFunc(
            that.data.applianceData.applianceCode, {
              right_flexzone_temperature: e.detail.value,
            },
            function () {
              that.setData({
                rightBwsZoneModelLoading: false,
              })
              that.data.rightBwsZoneModel.iCurValue = tmpValue
              that.setData({
                rightBwsZoneModel: that.data.rightBwsZoneModel,
                rightBwsZoneModelShowValue: tmpValue,
              })
            },
            errDesc
          )
        } else if (that.data.rightBwsZoneModel.tempType == 1) {
          //右变温室 档位调节
          let tmpValue = e.detail.value
          let ybwsTemp = parseInt(that.data.rightBwsZoneModel.gearList[tmpValue].gearTemp)
          that.unifiedDevCtrFunc(
            that.data.applianceData.applianceCode, {
              right_flexzone_temperature: ybwsTemp,
            },
            function () {
              that.setData({
                rightBwsZoneModelLoading: false,
              })
              that.data.rightBwsZoneModel.iCurValue = tmpValue
              that.setData({
                rightBwsZoneModelShowValue: that.data.rightBwsZoneModel.gearList[tmpValue].gearName,
                rightBwsZoneModel: that.data.rightBwsZoneModel,
              })
            },
            errDesc
          )
        }
      }
    },
    unifiedDevCtrFunc: function (applianceCode, ctlItem, finishFunc, optDesc) {
      var that = this
      //统一控制设备方法
      netService
        .sendCtlCmdToDev(applianceCode, ctlItem)
        .then((res) => {
          that.setData({
            netOptStatus: false,
          })
          that.reDrawPageView(res.data.data)
          if (finishFunc != null) {
            finishFunc()
          }
        })
        .catch((res1) => {
          that.setData({
            netOptStatus: false,
          })
          wx.showToast({
            title: optDesc,
            icon: 'none',
          })
          // 修改加载状态
          that.setData({
            lcsZoneModelLoading: false,
            ldsZoneModelLoading: false,
            bwsZoneModelLoading: false,
            rightBwsZoneModelLoading: false,
          })
          //重复回到初始值
          try {
            //冷藏室
            that.setData({
              lcsZoneModel: that.data.lcsZoneModel,
            })
            if (that.data.lcsZoneModel.tempType == 0) {
              that.setData({
                lcsZoneModelShowValue: that.data.lcsZoneModel.iCurValue,
              })
            } else if (that.data.lcsZoneModel.tempType == 1) {
              that.setData({
                lcsZoneModelShowValue: that.data.lcsZoneModel.gearList[that.data.lcsZoneModel.iCurValue]
                  .gearName,
              })
            }
            //冷冻室
            that.setData({
              ldsZoneModel: that.data.ldsZoneModel,
            })
            if (that.data.ldsZoneModel.tempType == 0) {
              that.setData({
                ldsZoneModelShowValue: that.data.ldsZoneModel.iCurValue,
              })
            } else if (that.data.ldsZoneModel.tempType == 1) {
              that.setData({
                ldsZoneModelShowValue: that.data.ldsZoneModel.gearList[that.data.ldsZoneModel.iCurValue]
                  .gearName,
              })
            }
            //变温室
            that.setData({
              bwsZoneModel: that.data.bwsZoneModel,
            })
            if (that.data.bwsZoneModel.tempType == 0) {
              //温度调节
              that.setData({
                bwsZoneModelShowValue: that.data.bwsZoneModel.iCurValue,
              })
            } else if (that.data.bwsZoneModel.tempType == 3) {
              //模式调节
            } else if (that.data.bwsZoneModel.tempType == 1) {
              //变温室 档位调节
              that.setData({
                bwsZoneModelShowValue: that.data.bwsZoneModel.gearList[that.data.bwsZoneModel.iCurValue]
                  .gearName,
              })
            }
            //右变温室
            that.setData({
              rightBwsZoneModel: that.data.rightBwsZoneModel,
            })

            if (that.data.rightBwsZoneModel.tempType == 0) {
              that.setData({
                rightBwsZoneModelShowValue: that.data.rightBwsZoneModel.iCurValue,
              })
            } else if (that.data.rightBwsZoneModel.tempType == 1) {
              //变温室 档位调节
              that.setData({
                bwsZoneModelShowValue: that.data.rightBwsZoneModel.gearList[that.data.bwsZoneModel
                  .iCurValue].gearName,
              })
            }
          } catch (e) {}
        })
    },
    modeUpdate: function (event) {
      //调用 统一控制设备方法后刷新页面
      console.log("界面刷新==========================" + JSON.stringify(event.detail.curStatus))
      // 刷新冷藏室
      this.drawFridgeStatusView(event.detail.curStatus)

    },

    reDrawPageView: function (dataModel) {
      //调用 统一控制设备方法后刷新页面
      this.drawFridgeStatusView(dataModel.status)
    },
    closeCtlSwitchAction: function (e) {
      let that = this
      let actionId = e.currentTarget.dataset.id
      if (actionId == 'lcs') {
        if (!that.data.lcsZoneModel.loading) {
          //发送请求
          that.data.lcsZoneModel.switch = 'off'
          that.data.lcsZoneModel.loading = true
          that.setData({
            lcsZoneModel: that.data.lcsZoneModel,
          })
          that.unifiedDevCtrFunc(
            that.data.applianceData.applianceCode, {
              storage_power: 'off',
            },
            function () {
              that.data.lcsZoneModel.loading = false
              that.setData({
                lcsZoneModel: that.data.lcsZoneModel,
              })
            },
            '关闭冷藏室操作失败'
          )
        }
      } else if (actionId == 'lds') {
        //发送请求
        that.data.ldsZoneModel.switch = 'off'
        that.setData({
          ldsZoneModelLoading: true,
        })
        that.setData({
          ldsZoneModel: that.data.ldsZoneModel,
        })
        that.unifiedDevCtrFunc(
          that.data.applianceData.applianceCode, {
            freezing_power: 'off',
          },
          function () {
            that.setData({
              ldsZoneModelLoading: false,
            })
            that.setData({
              ldsZoneModel: that.data.ldsZoneModel,
            })
          },
          '关闭冷冻室操作失败'
        )
      } else if (actionId == 'bws') {
        that.data.bwsZoneModel.switch = 'off'
        that.setData({
          bwsZoneModelLoading: true,
        })
        that.setData({
          bwsZoneModel: that.data.bwsZoneModel,
        })
        that.unifiedDevCtrFunc(
          that.data.applianceData.applianceCode, {
            left_flexzone_power: 'off',
          },
          function () {
            that.setData({
              bwsZoneModelLoading: false,
            })
            that.setData({
              bwsZoneModel: that.data.bwsZoneModel,
            })
          },
          '关闭变温室操作失败'
        )
      } else if (actionId == 'ybws') {
        that.data.rightBwsZoneModel.switch = 'off'
        that.setData({
          rightBwsZoneModelLoading: true,
        })
        that.setData({
          rightBwsZoneModel: that.data.rightBwsZoneModel,
        })
        that.unifiedDevCtrFunc(
          that.data.applianceData.applianceCode, {
            right_flexzone_power: 'off',
          },
          function () {
            that.setData({
              rightBwsZoneModelLoading: false,
            })
            that.setData({
              rightBwsZoneModel: that.data.rightBwsZoneModel,
            })
          },
          '关闭右变温室操作失败'
        )
      }
    },
    openCtlSwitchAction: function (e) {
      let that = this
      var actionId = e.currentTarget.dataset.id
      if (actionId == 'lcs') {
        //发送请求
        if (!that.data.lcsZoneModel.loading) {
          that.data.lcsZoneModel.switch = 'on'
          that.data.lcsZoneModel.loading = true
          that.setData({
            lcsZoneModel: that.data.lcsZoneModel,
          })
          that.unifiedDevCtrFunc(
            that.data.applianceData.applianceCode, {
              storage_power: 'on',
            },
            function () {
              that.data.lcsZoneModel.loading = false
              that.setData({
                lcsZoneModel: that.data.lcsZoneModel,
              })
            }
          )
        }
      } else if (actionId == 'lds') {
        //发送请求
        that.data.ldsZoneModel.switch = 'on'
        that.setData({
          ldsZoneModelLoading: true,
        })
        that.setData({
          ldsZoneModel: that.data.ldsZoneModel,
        })
        that.unifiedDevCtrFunc(
          that.data.applianceData.applianceCode, {
            freezing_power: 'on',
          },
          function () {
            that.setData({
              ldsZoneModelLoading: false,
            })
            that.setData({
              ldsZoneModel: that.data.ldsZoneModel,
            })
          }
        )
      } else if (actionId == 'bws') {
        that.data.bwsZoneModel.switch = 'on'
        that.setData({
          bwsZoneModelLoading: true,
        })
        that.setData({
          bwsZoneModel: that.data.bwsZoneModel,
        })
        that.unifiedDevCtrFunc(
          that.data.applianceData.applianceCode, {
            left_flexzone_power: 'on',
          },
          function () {
            that.setData({
              bwsZoneModelLoading: false,
            })
            that.setData({
              bwsZoneModel: that.data.bwsZoneModel,
            })
          }
        )
      } else if (actionId == 'ybws') {
        that.data.rightBwsZoneModel.switch = 'on'
        that.setData({
          rightBwsZoneModelLoading: true,
        })
        that.setData({
          rightBwsZoneModel: that.data.rightBwsZoneModel,
        })
        that.unifiedDevCtrFunc(
          that.data.applianceData.applianceCode, {
            right_flexzone_power: 'on',
          },
          function () {
            that.setData({
              rightBwsZoneModelLoading: false,
            })
            that.setData({
              rightBwsZoneModel: that.data.rightBwsZoneModel,
            })
          }
        )
      }
    },
    cloudKeeperSwitchStatusAction: function () {
      let that = this
      if (!that.data.devChecking) {
        //点击事件埋点:  智能保鲜开关点击点击事件
        pluginEventTrack(
          'user_behavior_event',
          null, {
            page_id: 'page_card0_card0',
            page_name: '智能保鲜开关按钮点击统计',
            widget_id: 'click_bth_cloudkeeperswitch',
            widget_name: '智能保鲜开关点击点击事件',
            bd_name: '冰箱',
            element_content: '智能保鲜开关点击点击事件',
          }, {}
        )
        //冰箱云管家开关
        if (that.data.cloudKeeperSwitchStatus) {
          wx.showModal({
            content: '保鲜云管家关闭后,冰箱将无法自动调节温度和模式,是否关闭?',
            success(res) {
              if (res.confirm) {
                let curSwitchStatus = !that.data.cloudKeeperSwitchStatus
                let optStatus = 0
                if (curSwitchStatus) {
                  optStatus = 1
                }
                netService
                  .editCloudKeeperSwitchStatus(that.data.applianceData.applianceCode, optStatus)
                  .then((res1) => {
                    if (res1.code == '0') {
                      //成功
                      that.setData({
                        cloudKeeperSwitchStatus: curSwitchStatus,
                      })
                    } else {
                      //失败
                      let optDesc = '智能保鲜开启失败'
                      if (curSwitchStatus) {
                        optDesc = '智能保鲜开启失败'
                      } else {
                        optDesc = '智能保鲜关闭失败'
                      }
                      wx.showToast({
                        title: optDesc,
                        icon: 'none',
                      })
                    }
                  })
              }
            },
          })
        } else {
          let curSwitchStatus = !that.data.cloudKeeperSwitchStatus
          let optStatus = 0
          if (curSwitchStatus) {
            optStatus = 1
          }
          netService.editCloudKeeperSwitchStatus(that.data.applianceData.applianceCode, optStatus).then((
            res1) => {
            if (res1.code == '0') {
              //成功
              that.setData({
                cloudKeeperSwitchStatus: curSwitchStatus,
              })
            } else {
              //失败
              let optDesc = '智能保鲜开启失败'
              if (curSwitchStatus) {
                optDesc = '智能保鲜开启失败'
              } else {
                optDesc = '智能保鲜关闭失败'
              }
              wx.showToast({
                title: optDesc,
                icon: 'none',
              })
            }
          })
        }
      }
    },
    drawFridgeTplStatusView: function (curStatus) {
      var that = this
      //判断类型
      let fridgeZoneList = this.data.fridgeModelInfo.fridgeData.fridgeZoneList
      for (let idx = 0; idx < fridgeZoneList.length; idx++) {
        let entity = fridgeZoneList[idx]
        if (entity.ZoneType == '0') {
          // 1冷藏室
          if (entity.tempType == '0') {
            //调温方式: 温度
            let tmpModelValue = curStatus.storage_temperature //+"℃";
            that.setData({
              lcsZoneModelCurValue: tmpModelValue,
            })
          } else if (entity.tempType == '1') {
            //调温方式: 挡位
            let tmpModelValue = curStatus.storage_temperature //+"℃";
            that.setData({
              lcsZoneModelCurValue: tmpModelValue,
            })
          }
          //设置开关状态
          that.data.lcsZoneModel.switch = curStatus.storage_power
          if (that.data.lcsZoneModel.switch == 'off') {
            let tmpModelValue = '一'
            that.setData({
              lcsZoneModelCurValue: tmpModelValue,
            })
            that.data.lcsZoneModel.showDegree = false
          } else {
            that.data.lcsZoneModel.showDegree = true
          }
        } else if (entity.ZoneType == '1') {
          // 10冷冻室
          //设置值
          that.setData({
            ldsZoneModelCurValue: '',
          })
          let tmpModelValue = curStatus.freezing_temperature //+"℃";
          if (that.data.ldsZoneModel.switch == 'off') {
            tmpModelValue = '一'
            that.data.ldsZoneModel.showDegree = false
          } else {
            that.data.ldsZoneModel.showDegree = true
          }
          that.setData({
            ldsZoneModelCurValue: tmpModelValue,
          })
        } else if (entity.ZoneType == '2') {
          let tmpModelValue = ''
          // 100变温室
          that.data.bwsZoneModel.haveChanageMode = entity.haveChanageMode
          if (entity.haveChanageMode) {} else {
            //然后 档位控制、温度控制
            if (entity.tempType == '0') {
              //温度控制
              tmpModelValue = curStatus.left_flexzone_temperature + '℃'
            } else if (entity.tempType == '1') {
              //档位控制
              that.data.bwsZoneModel.tempType = 1
              that.data.bwsZoneModel.gearList = entity.gearList
              for (let idx = 0; idx < entity.gearList.length; idx++) {
                if (entity.gearList[idx].gearTemp == curStatus.left_flexzone_temperature) {
                  tmpModelValue = entity.gearList[idx].gearName
                  break
                }
              }
            }
          }
          if (that.data.bwsZoneModel.switch == 'off') {
            tmpModelValue = '一'
          }
          that.setData({
            bwsZoneModelCurValue: tmpModelValue,
          })
        } else if (entity.ZoneType == '5') {
          // 10000右变温室
          if (entity.tempType == '0') {
            that.data.rightBwsZoneModel.tempType = 0
            that.data.rightBwsZoneModel.curValue = curStatus.right_flexzone_temperature + '℃'
            that.data.rightBwsZoneModelCurValue = curStatus.right_flexzone_temperature + '℃'
            //获取范围
            let minTemp = parseInt(entity.MinTemp)
            let maxTemp = parseInt(entity.MaxTemp)
            that.data.rightBwsZoneModel.minTemp = minTemp
            that.data.rightBwsZoneModel.maxTemp = maxTemp
            that.data.rightBwsZoneModel.iCurValue = parseInt(curStatus.right_flexzone_temperature)
            that.setData({
              rightBwsZoneModelShowValue: that.data.rightBwsZoneModel.iCurValue,
            })
          } else if (entity.tempType == '1') {
            that.data.rightBwsZoneModel.tempType = 1
            //处理档位显示
            that.data.rightBwsZoneModel.gearList = entity.gearList
            for (let idx = 0; idx < entity.gearList.length; idx++) {
              if (entity.gearList[idx].gearTemp == curStatus.right_flexzone_temperature) {
                that.data.rightBwsZoneModel.iCurValue = entity.gearList[idx].gearName
                that.data.rightBwsZoneModelCurValue = entity.gearList[idx].gearName
                that.setData({
                  rightBwsZoneModelShowValue: entity.gearList[idx].gearName,
                })
                break
              }
            }
            that.data.rightBwsZoneModel.curValue = that.data.rightBwsZoneModel.iCurValue
          }
          that.data.rightBwsZoneModel.switch = curStatus.right_flexzone_power
          that.data.rightBwsZoneModel.canClose = entity.canClose
          if (that.data.rightBwsZoneModel.switch == 'off') {
            that.data.rightBwsZoneModel.curValue = '一'
            that.data.rightBwsZoneModelCurValue = '一'
          }
          that.setData({
            rightBwsZoneModelCurValue: that.data.rightBwsZoneModelCurValue,
            rightBwsZoneModel: that.data.rightBwsZoneModel,
          })
        }
      }
    },
    getDevCheckRecordO: function (uid, telPhone, devId, isNew, roleId, curHomeGroupid) {
      let that = this
      //冰箱的SN
      const sn = getDeviceSn(that.properties.applianceData.sn)
      //获取设备自检信息
      netService
        .getDevCheckRecord(uid, telPhone, devId, isNew, roleId, curHomeGroupid, that.properties.applianceData.sn8,
          sn)
        .then((res) => {
          that.setData({
            hasRecvGift: res.hasrecvgift,
            hasCheck: res.hascheck,
            isShow: res.isshow,
          })
          if (res.hasrecvgift == 2) {
            that.setData({
              isShow: 0,
            })
          }
          that.setData({
            devChecking: false,
            showCheckViewResult: 0,
          })
          //弹出云管家引导页面弹框
          netService
            .getPluginInfoRecord(devId, uid)
            .then((res1) => {
              if (res1.code == 0 && res1.data == 1) {
                //首次进入
                if (!that.data.cloudKeeperSwitchStatus) {
                  that.setData({
                    cloudKeeperGuide: true,
                  })
                } else {
                  that.setData({
                    cloudKeeperGuide: false,
                  })
                }
              } else {
                that.setData({
                  cloudKeeperGuide: false,
                })
              }
            })
            .catch((err) => {
              //智能保鲜开启失败处理
              console.log('--------------> 引导异常:  ' + JSON.stringify(err))
            })
        })
        .catch((err) => {})
    },
    getDevCheckRecord: function (uid, telPhone, devId, isNew, roleId, curHomeGroupid) {
      let that = this
      //冰箱的SN
      const sn = getDeviceSn(that.properties.applianceData.sn)
      //获取设备自检信息
      netService
        .getDevCheckRecord(uid, telPhone, devId, isNew, roleId, curHomeGroupid, that.properties.applianceData.sn8,
          sn)
        .then((res) => {
          that.setData({
            hasRecvGift: res.hasrecvgift,
            hasCheck: res.hascheck,
            isShow: res.isshow,
          })
          if (res.hasrecvgift == 2) {
            that.setData({
              isShow: 0,
            })
          }
          //当没有自检，启动自检
          if (that.data.hasCheck == 0) {
            that.setData({
              devChecking: true,
              showCheckViewResult: 0,
            })
            //进行自检
            that.getCheckItems(devId)
          } else {
            that.setData({
              devChecking: false,
              showCheckViewResult: 0,
            })
          }
        })
        .catch((err) => {})
    },
    //获取自检项目
    getCheckItems: function (devId) {
      let that = this
      //初始化
      that.setData({
        progress: 0,
      })
      netService
        .getCheckItems(devId)
        .then((res) => {
          //自检的项目，微晶模式处理
          for (let idx = 0; idx < res.checkDevList.length; idx++) {
            let obj = res.checkDevList[idx]
            //没有微晶模式
            if (that.data.isWJFunc == 0) {
              if (obj.key == 'E73' || obj.key == 'E74' || obj.key == 'E75') {
                obj.isOk = 1
              }
            }
          }
          that.checkActionStart(res.checkDevList)
        })
        .catch((err) => {
          console.log('---------------->  获取异常项目:   ' + JSON.stringify(err))
        })
    },
    //开始自检
    checkActionStart: function (checkDevList) {
      let that = this
      gIdx = 0
      //自检设备故障数量
      that.data.checkFaultDevNum = 0
      //故障列表
      let faultList = []

      //设置字体颜色
      that.setData({
        faultFontColor: '#25CF42',
      })
      if (checkFaultTaskTimer == null) {
        checkFaultTaskTimer = setTimeout(function () {
          that.runCheckTask(checkDevList, faultList)
        }, 600)
      }
    },
    runCheckTask: function (checkDevList, faultList) {
      let that = this
      let checkResult = true
      // 执行自检任务
      let entity = checkDevList[gIdx]
      if (entity == null || typeof entity == 'undefined') {
        clearTimeout(checkFaultTaskTimer)
        checkFaultTaskTimer = null

        that.data.checkProgress = 100
        that.setData({
          checkProgress: that.data.checkProgress,
        })
        //上传故障报告
        let checkresultN = 0
        if (that.data.checkFaultDevNum == 0) {
          checkresultN = 1
          checkResult = true
        } else {
          checkresultN = 0
          checkResult = false
        }
        netService
          .saveCheckDevResult(
            that.data.applianceData.applianceCode,
            checkDevList.length,
            checkresultN,
            that.data.checkFaultDevNum,
            that.data.fridgeModelInfo.SN,
            that.data.fridgeModelInfo.devType,
            faultList
          )
          .then((res) => {
            that.setData({
              handleCheckDevResult: res,
            })
            //{"isNewDev":1,"isAccess":0,"source":null,"cardNumber":null,"isShow":0}
            //处理结果设置
            //    hasRecvGift: 0,//是否已领取  0 未领取;  1 已领取; 2 没有资格领取
            //      hasCheck: 0, //是否已自检   0 没有自检;  1 已经自检
            //    isShow: 0,//是否显示卡券中心    0 不显示；1 显示
            if (res.isShow == 0 || res.isAccess == 0 || res.cardNumber == null || res.cardNumber.length == 0) {
              that.setData({
                hasRecvGift: 2,
              })
            } else {
              that.setData({
                hasRecvGift: 1,
              })
            }
            that.finishDevCheckHandle(checkResult, that.data.checkFaultDevNum)
          })
          .catch((err) => {})
      } else {
        if (entity.isOk == 0) {
          that.setData({
            faultFontColor: '#FF8225',
          })
          checkResult = false
          that.data.checkFaultDevNum = that.data.checkFaultDevNum + 1
          let faultEntity = {}
          faultEntity.faultcode = entity.key
          faultEntity.faultname = entity.itemName
          faultList.push(faultEntity)
        }
        that.setData({
          checkProgressItem: entity.itemName,
        })

        //继续循环
        if (checkFaultTaskTimer != null) {
          clearTimeout(checkFaultTaskTimer)
        }
        //设置自检显示速率
        let setTimeValue = 0
        if (gIdx < 6 || gIdx == 6) {
          setTimeValue = 600
          that.data.checkProgress += 2
        } else if (gIdx > 6 && gIdx <= 34) {
          setTimeValue = 60
          that.data.checkProgress += 2
        } else if (gIdx > 34) {
          setTimeValue = 600
          if (gIdx == 35) {
            that.data.checkProgress += 14
          } else {
            that.data.checkProgress += 2
          }
        }
        if (that.data.checkProgress > 100) {
          that.data.checkProgress = 100
        }
        that.setData({
          checkProgress: that.data.checkProgress,
        })
        checkFaultTaskTimer = setTimeout(function () {
          that.runCheckTask(checkDevList, faultList)
        }, setTimeValue)
      }
      gIdx++
    },
    finishDevCheckHandle: function (checkRet, checkFaultDevNum) {
      let that = this
      //hasRecvGift: 0,//是否已领取  0 未领取;  1 已领取; 2 没有资格领取
      //showCheckViewResult: 0,//  1 没有故障，和 有延保卡； 2 没有故障，和 没有延保卡; 3 有故障 和 有延保卡; 4 有故障 和 没有延保卡
      if (checkRet && that.data.hasRecvGift != 2) {
        //没有故障，和 有延保卡
        that.setData({
          devChecking: false,
          showCheckViewResult: 1,
        })
      } else if (checkRet && that.data.hasRecvGift == 2) {
        //没有故障，和 没有延保卡
        that.setData({
          devChecking: false,
          showCheckViewResult: 2,
        })
      } else if (!checkRet && that.data.hasRecvGift != 2) {
        //有故障 和 有延保卡
        that.setData({
          devChecking: false,
          showCheckViewResult: 3,
          checkFaultDevNum: checkFaultDevNum,
        })
      } else if (!checkRet && that.data.hasRecvGift == 2) {
        //有故障 和 没有延保卡
        that.setData({
          devChecking: false,
          showCheckViewResult: 4,
          checkFaultDevNum: checkFaultDevNum,
        })
      }
    },
    finishDevCheckAction: function (e) {
      let that = this
      let actionId = e.currentTarget.dataset.id
      //完成新机自检
      if (actionId == 1) {
        //没有故障，和 有延保卡
        that.setData({
          showCheckViewResult: 5,
        })
      } else if (actionId == 3) {
        //有故障 和 有延保卡
        that.setData({
          showCheckViewResult: 5,
        })
      } else {
        that.setData({
          showCheckViewResult: 0,
        })
      }
    },
    devCheckAction: function () {
      let that = this
      if (!that.data.devChecking) {
        //点击事件:
        pluginEventTrack(
          'user_behavior_event',
          null, {
            page_id: 'page_card0_card0',
            page_name: '进入智能自检按钮点击统计',
            widget_id: 'click_bth_into_devcheck',
            widget_name: '进入智能自检页面点击事件',
            bd_name: '冰箱',
            element_content: '进入智能自检页面点击事件',
          }, {}
        )

        //跳转设备自检页面
        wx.navigateTo({
          url: '../check/DevCheck?fridgeId=' + that.data.applianceData.applianceCode + '&isWJFunc=' + that
            .data.isWJFunc,
        })
      }
    },
    cardCenterAction: function () {
      //卡券中心响应
      this.setData({
        showCheckViewResult: 5,
      })
    },
    comeBackAction: function () {
      //卡券中心响应
      this.setData({
        showCheckViewResult: -1,
      })
      //刷新状态
      //{"isNewDev":1,"isAccess":0,"source":null,"cardNumber":null,"isShow":0}
      //处理结果设置
      //    hasRecvGift: 0,//是否已领取  0 未领取;  1 已领取; 2 没有资格领取
      //      hasCheck: 0, //是否已自检   0 没有自检;  1 已经自检
      //    isShow: 0,//是否显示卡券中心    0 不显示；1 显示
      if (this.data.handleCheckDevResult != null) {
        this.setData({
          hasCheck: 1,
          isShow: this.data.handleCheckDevResult.isShow,
          hasRecvGift: this.data.handleCheckDevResult.isAccess,
        })
      }
      this.setData({
        handleCheckDevResult: null,
      })
    },
    downloadAppAction: function () {
      //去下载中心
      this.setData({
        showCheckViewResult: -1,
      })
      //显示
      if (this.data.handleCheckDevResult != null) {
        this.setData({
          hasCheck: 1,
          isShow: this.data.handleCheckDevResult.isShow,
          hasRecvGift: this.data.handleCheckDevResult.isAccess,
        })
      }
      this.setData({
        handleCheckDevResult: null,
      })
      wx.navigateTo({
        url: '/pages/download/download',
      })
    },
    confirmAction: function () {
      //云管家开启按钮 提示的关闭
      this.setData({
        cloudKeeperGuide: false,
      })
    },
    guideOpenCloudKeeperAction: function () {
      let that = this
      //引导云管家说明
      netService.editCloudKeeperSwitchStatus(that.data.applianceData.applianceCode, 1).then((res1) => {
        if (res1.code == '0') {
          //成功
          that.setData({
            cloudKeeperSwitchStatus: true,
          })
          that.setData({
            cloudKeeperGuide: false,
          })
        } else {
          //失败
          wx.showToast({
            title: '智能保鲜开启失败',
            icon: 'none',
          })
        }
      })
    },
  },
})
