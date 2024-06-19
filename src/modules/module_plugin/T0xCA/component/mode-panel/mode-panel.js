// src/modules/module_plugin/T0xCA/component/mode-panel/mode-panel.js
import netService from '../../service/NetService'
const app = getApp()
const pluginEventTrack = app.getGlobalConfig().pluginEventTrack
Component({

  /**
   * 工作模式
   * 页面的初始数据
   */
  data: {
    windowWidth: wx.getSystemInfoSync().windowWidth,
    iconServiceUrl: netService.getIconServiceUrl(),
    devSn: null, //冰箱SN
    devModelData: null, //冰箱详细信息
    devStatusData: null, //冰箱设备状态
    fridgeId: null,
    modeList: [{
        modeName: "速冷",
        isOpen: false,
        icon: "suleng_off.png",
        activeIcon: "suleng-on.png",
        isAlwaysLight: false,
        isShow: false, //是否显示
        baseModeType: "0",
        luaKey: 'storage_mode'
      }, {
        modeName: "速冻",
        isOpen: false,
        icon: "sudong_off.png",
        activeIcon: "sudong_on.png",
        isAlwaysLight: false,
        isShow: false, //是否显示
        baseModeType: "1",
        luaKey: 'freezing_mode'
      }, {
        modeName: "智能",
        isOpen: false,
        icon: "zhineng_off.png",
        activeIcon: "zhineng_on.png",
        isAlwaysLight: false,
        isShow: false, //是否显示
        baseModeType: "2",
        luaKey: 'intelligent_mode'
      },
      {
        modeName: "深冷",
        isOpen: false,
        icon: "shenleng_off.png",
        activeIcon: "shenleng_on.png",
        isAlwaysLight: false,
        isShow: false, //是否显示
        baseModeType: "21",
        luaKey: 'deep_cold_mode'
      }, {
        modeName: "错峰用电",
        isOpen: false,
        icon: "cfyd_off.png",
        activeIcon: "cfyd_on.png",
        isAlwaysLight: false,
        isShow: false, //是否显示
        baseModeType: "18",
        luaKey: 'cross_peak_electricity'
      }, {
        modeName: "制冰模式",
        isOpen: false,
        icon: "zhibing_off.png",
        activeIcon: "zhibing_on.png",
        isAlwaysLight: false,
        isShow: false, //是否显示
        baseModeType: "24",
        luaKey: 'freezing_ice_machine_power',
        hasRapidIceMaking: false, //是否有快速制冰
        curStatus: "制冰模式" //普通制冰  快速制冰   制冰关闭
      },
      {
        modeName: "日常",
        isOpen: true,
        icon: "richang_off.png",
        activeIcon: "richang_on.png",
        isAlwaysLight: false,
        isShow: false, //是否显示
        baseModeType: "22",
        luaKey: 'intelligent_mode'
      }, {
        modeName: "假日",
        isOpen: false,
        icon: "jiari_off.png",
        activeIcon: "jiari_on.png",
        isAlwaysLight: false,
        isShow: false, //是否显示
        baseModeType: "4",
        luaKey: 'holiday_mode'
      }, {
        modeName: "节能",
        isOpen: true,
        icon: "jieneng_off.png",
        activeIcon: "jieneng_on.png",
        isAlwaysLight: false,
        isShow: false, //是否显示
        baseModeType: "3",
        luaKey: 'energy_saving_mode'
      }, {
        modeName: "微晶保鲜",
        isOpen: true,
        icon: "wjbx_off.png",
        activeIcon: "wjbx_on.png",
        isAlwaysLight: false,
        isShow: false, //是否显示
        baseModeType: "12",
        luaKey: 'microcrystal_fresh'
      }, {
        modeName: "微晶肉类",
        isOpen: true,
        icon: "wjc_off.png",
        activeIcon: "wjc_rl.png",
        isAlwaysLight: false,
        isShow: false, //是否显示
        baseModeType: "",
        luaKey: 'aquatic_product', //aquatic_product
        curStatus: '微晶肉类'
      }, { //冰镇模式  果蔬模式   微晶模式   老微晶室控制逻辑
        modeName: "微晶模式",
        isOpen: true,
        icon: "oldwj_wj.png",
        activeIcon: "oldwj_wj.png",
        isAlwaysLight: false,
        isShow: false, //是否显示
        baseModeType: "",
        luaKey: 'icea_mode_power', //icea_mode_power
        curStatus: '微晶模式'
      }, {
        modeName: "PST+净味",
        isOpen: true,
        icon: "znjw_off.png",
        activeIcon: "znjw_cg.png",
        isAlwaysLight: false,
        isShow: false, //是否显示
        baseModeType: "13",
        hasStrongTaste: false, //是否有强效净化
        luaKey: 'electronic_smell', //常规
        curStatus: "常规"
      }, {
        modeName: "高保湿",
        isOpen: true,
        icon: "gbs_off.png",
        activeIcon: "gbs_on.png",
        isAlwaysLight: false,
        isShow: false, //是否显示
        baseModeType: "5",
        luaKey: 'moisturize_mode'
      }, {
        modeName: "雷达",
        isOpen: true,
        icon: "leida_off.png",
        activeIcon: "leida_on.png",
        isAlwaysLight: false,
        isShow: false, //是否显示
        baseModeType: "8",
        luaKey: 'radar_mode_power'
      }, {
        modeName: "果净",
        isOpen: true,
        icon: "guojing_off.png",
        activeIcon: "guojing_on.png",
        isAlwaysLight: false,
        isShow: false, //是否显示
        baseModeType: "14",
        luaKey: 'eradicate_pesticide_residue'
      },
      //  {
      //   modeName: "快速制冰",
      //   isOpen: true,
      //   icon: "kszb_off.png",
      //   activeIcon: "kszb_on.png",
      //   isAlwaysLight: false,
      //   isShow: false, //是否显示
      //   baseModeType: "28",
      //   luaKey: 'rapid_ice_making'
      // }, 
      {
        modeName: "强效杀菌",
        isOpen: true,
        icon: "gxsj_off.png",
        activeIcon: "gxsj_on.png",
        isAlwaysLight: false,
        isShow: false, //是否显示
        baseModeType: "15",
        luaKey: 'plasma_aseptic_mode_power'
      }, {
        modeName: "脉冲净化",
        isOpen: true,
        icon: "mcjh_off.png",
        activeIcon: "mcjh_on.png",
        isAlwaysLight: false,
        isShow: false, //是否显示
        baseModeType: "26",
        luaKey: 'pulse_switch'
      }, {
        modeName: "杀菌",
        isOpen: true,
        icon: "shajun_off.png",
        activeIcon: "shajun_on.png",
        isAlwaysLight: false,
        isShow: false, //是否显示
        baseModeType: "11",
        luaKey: 'plasma_aseptic_mode_power'
      }, {
        modeName: "极冻",
        isOpen: true,
        icon: "jidong_off.png",
        activeIcon: "jidong_on.png",
        isAlwaysLight: false,
        isShow: false, //是否显示
        baseModeType: "7",
        luaKey: 'acme_freezing_mode'
      }, {
        modeName: "低湿",
        isOpen: true,
        icon: "kongshi_ds.png",
        activeIcon: "kongshi_gs.png",
        isAlwaysLight: false,
        isShow: false, //是否显示
        baseModeType: "16",
        luaKey: 'humidity', //high   low
        curStatus: '低湿',
        hasSmartHumidity: false
      }
    ],
    modeCount: 0, //模式数量
    isExtend: false, //是否展开模式列表
  },
  methods: {
    /**
     * 组件初始化方法
     * @param {设备详细信息} devModelData 
     * @param {冰箱id} fridgeId 
     * @param {sn吗} devSn 
     * @param {设备当前状态} devStatusData 
     */
    init: function (fridgeId, devSn, devModelData, devStatusData) {
      console.log("------------------>mode -panel 初始化数量===" + devModelData.fridgeBaseModeList.length)
      this.setData({
        fridgeId: fridgeId,
        devSn: devSn,
        devModelData: devModelData,
        devStatusData: devStatusData,
        // modeCount: devModelData.fridgeBaseModeList.length
      });
      //初始化
      this.data.modeCount = 0
      if (devModelData.fridgeBaseModeList != null && devModelData.fridgeBaseModeList.length > 0) {
        let devSn8 = devSn.substr(12, 5);
        // console.log("------------------> 冰箱基本信息devModelData:  " + JSON.stringify(devModelData) + "  | devSn = " + devSn + "  |  devSn8 = " + devSn8);
        for (let idx = 0; idx < devModelData.fridgeBaseModeList.length; idx++) {
          let entity = devModelData.fridgeBaseModeList[idx];
          for (let i = 0; i < this.data.modeList.length; i++) {
            if (entity.BaseMode_Type == '28') { //判断是否有快速制冰
              this.getModeByLuaKey('freezing_ice_machine_power').hasRapidIceMaking = true
              break
            }
            if (this.data.modeList[i].baseModeType == entity.BaseMode_Type) {
              this.data.modeCount++
              this.data.modeList[i].isShow = true;
              this.data.modeList[i].isAlwaysLight = entity.isAlwaysLight;
              if (entity.isAlwaysLight) {
                this.data.modeList[i].isOpen = true;
              }
              //判断是否有强效
              if (entity.BaseMode_Type == '13') {
                if (devModelData.have_trong_taste || devModelData.have_strong_taste3) {
                  this.data.modeList[i].hasStrongTaste = true;
                } else {
                  this.data.modeList[i].hasStrongTaste = false;
                }
              }
              //判断是否有智能保湿
              if (entity.BaseMode_Type == '16') {
                if (devModelData.have_fruits_nutrition) { //蔬菜营养仓   如果有就有智能保湿
                  this.data.modeList[i].hasSmartHumidity = true;
                } else {
                  this.data.modeList[i].hasSmartHumidity = false;
                }
              }
            }
          }
        }
        //微晶营养仓
        if (devModelData.have_weijing_nutrition) {
          this.data.modeCount++
          this.getModeByLuaKey('aquatic_product').isShow = true
        }
        //老微晶模式 微晶  冰镇  蔬果 icea_mode_power
        if (this.hasOldWeiJingMode(devModelData)) {
          this.data.modeCount++
          this.getModeByLuaKey('icea_mode_power').isShow = true
        }

        this.setData({
          modeCount: this.data.modeCount,
          modeList: this.data.modeList
        });
      }
      //更新设备当前状态
      this.drawFridgeStatusView(devStatusData);
    },
    /**
     * 展开-关闭模式列表
     */
    extendModeAction: function () {
      if (this.data.modeCount <= 4) {
        return
      }
      this.setData({
        isExtend: !this.data.isExtend
      })
    },
    /**
     * 模式点击事件
     * @param {点击详情} detail 
     */
    onModeChangeAction: function (detail) { //
      let that = this
      let index = detail.target.dataset.index
      let luaKey = detail.target.dataset.luakey
      let isAlwaysLight = detail.target.dataset.isalwayslight
      let curValue = 'on'
      let ctlItem = {}
      // 发送指令
      // 点击事件埋点: 速冻工作模式按钮点击事件
      pluginEventTrack(
        'user_behavior_event',
        null, {
          page_id: 'page_card0_card0_mode-panel',
          page_name: that.data.modeList[index].modeName + '模式点击统计',
          widget_id: 'click_bth_work_mode' + that.data.modeList[index].luaKey,
          widget_name: that.data.modeList[index].modeName + '模式点击事件',
          bd_name: '冰箱',
          element_content: that.data.modeList[index].modeName + '模式点击事件',
        }, {
          action: 'zn',
        }
      )

      //常驻模式 不可关闭   是否有强效   have_trong_taste  have_strong_taste3  true    强效净味   高湿  低湿  
      // console.log("detail==" + JSON.stringify(detail))
      if (isAlwaysLight) { //净味
        if (luaKey == 'electronic_smell' && that.data.modeList[index].hasStrongTaste) { //智能净味  有强效
          if (that.data.modeList[index].curStatus == "常规") {
            ctlItem['electronic_clean_strong'] = 'on'
          } else if (that.data.modeList[index].curStatus == "强效") {
            ctlItem['electronic_clean_strong'] = 'off'
          }
        } else {
          wx.showToast({
            title: '此功能由系统自动运行',
            icon: 'none',
          })
          return
        }
      } else {
        //速冷   冷藏室关闭
        if (luaKey == 'storage_mode') {
          if (that.data.devStatusData.storage_power == 'off') {
            wx.showToast({
              title: '冷藏室已关闭，无法操作',
              icon: 'none',
            })
            return
          }
        }
        //速冻  深冷 冷冻室关闭
        if (luaKey == 'freezing_mode' || luaKey == 'deep_cold_mode') {
          if (that.data.devStatusData.freezing_power == 'off') {
            wx.showToast({
              title: '冷冻室已关闭，无法操作',
              icon: 'none',
            })
            return
          }
        }
        if (luaKey == 'freezing_ice_machine_power' && that.data.modeList[index].hasRapidIceMaking) {
          if (that.data.modeList[index].curStatus == "制冰模式") {
            ctlItem['rapid_ice_making'] = 'on'
          } else if (that.data.modeList[index].curStatus == "快速制冰") {
            ctlItem['rapid_ice_making'] = 'off'
            ctlItem['freezing_ice_machine_power'] = 'off'
          } else if (that.data.modeList[index].curStatus == "制冰关闭") {
            ctlItem['freezing_ice_machine_power'] = 'on'
          }
        } else if (luaKey == 'humidity') { //控湿  
          if (that.data.modeList[index].curStatus == '低湿') {
            ctlItem['humidity'] = 'high'
          } else if (that.data.modeList[index].curStatus == '高湿') {
            if (that.data.modeList[index].hasSmartHumidity) {
              ctlItem['smart_humidify'] = 'on'
            } else {
              ctlItem['humidity'] = 'low'
            }
          } else if (that.data.modeList[index].curStatus == '智能控湿') {
            ctlItem['smart_humidify'] = 'off'
          }
        } else if (luaKey == 'aquatic_product') { //微晶肉类 
          if (that.data.modeList[index].curStatus == '微晶肉类') {
            ctlItem['aquatic_product'] = 'on'
          } else if (that.data.modeList[index].curStatus == '微晶水产') {
            ctlItem['aquatic_product'] = 'off'
            ctlItem['microcrystal_fresh'] = 'off'
          } else if (that.data.modeList[index].curStatus == '微晶模式') {
            ctlItem['microcrystal_fresh'] = 'on'
          }
        } else if (luaKey == 'icea_mode_power') { //旧微晶  蔬果  冰镇
          if (that.data.modeList[index].curStatus == '微晶模式') {
            ctlItem['variable_mode'] = 'fresh_product_mode'
          } else if (that.data.modeList[index].curStatus == '果蔬模式') {
            ctlItem['icea_mode_power'] = 'on'
          } else if (that.data.modeList[index].curStatus == '冰镇模式') {
            ctlItem['microcrystal_fresh'] = 'on'
          }
        } else {
          //判断目前开关状态
          if (that.data.modeList[index].isOpen) {
            curValue = 'off'
          } else {
            curValue = 'on'
          }
          ctlItem[luaKey] = curValue;
        }

      }
      wx.showLoading({
        title: '设置中...',
        mask: true,
      })
      console.log("组件指令===" + JSON.stringify(ctlItem))
      that.unifiedDevCtrFunc(
        that.data.fridgeId, ctlItem,
        function () {
          wx.hideLoading();
          //深冷
          if (luaKey == 'deep_cold_mode' && curValue == 'on') {
            wx.showToast({
              title: '深冷已开启，冷冻室温度将快速降至-30℃',
              icon: 'none',
            })
          } else {
            let msss = that.data.modeList[index].isOpen ? that.data.modeList[index].modeName + '已开启' : that.data
              .modeList[index].modeName + '已关闭'
            wx.showToast({
              title: msss,
              icon: 'none',
            })
          }
        },
        that.data.modeList[index].modeName + '模式设置失败'
      )
    },

    /**
     * 统一控制设备方法
     * @param {设备码} applianceCode  
     * @param {控制指令} ctlItem   
     * @param {完成回调方法} finishFunc  
     * @param {失败提示信息} optDesc  
     */
    unifiedDevCtrFunc: function (applianceCode, ctlItem, finishFunc, optDesc) {
      var that = this
      netService.sendCtlCmdToDev(applianceCode, ctlItem)
        .then((res) => {
          //通知主页面刷新
          that.triggerEvent('modeUpdate', {
            curStatus: res.data.data.status
          })
          if (finishFunc != null) {
            finishFunc()
          }
        })
        .catch((res1) => {
          wx.showToast({
            title: optDesc,
            icon: 'none',
          })
        })
    },
    drawFridgeStatusView: function (devStatusData) {
      //更新状态
      for (let index = 0; index < this.data.modeList.length; index++) {
        let mode = this.data.modeList[index];
        if (devStatusData[mode.luaKey] != null && mode.isShow) {
          if (devStatusData[mode.luaKey] == "on") {
            mode.isOpen = true;
          } else {
            mode.isOpen = false;
          }
          if (mode.isAlwaysLight) {
            mode.isOpen = true;
          }
          //控湿
          if (mode.luaKey == 'humidity') {
            if (devStatusData[mode.luaKey] == 'low') {
              mode.modeName = '低湿'
              mode.curStatus = '低湿'
              mode.isOpen = true;
              mode.activeIcon = 'kongshi_ds.png'
            } else if (devStatusData[mode.luaKey] == 'high') {
              mode.modeName = '高湿'
              mode.isOpen = true;
              mode.curStatus = '高湿'
              mode.activeIcon = 'kongshi_gs.png'
            }
            if (mode.hasSmartHumidity && devStatusData['smart_humidify'] == 'on') {
              mode.modeName = '智能控湿'
              mode.curStatus = '智能控湿'
              mode.isOpen = true;
              mode.activeIcon = 'kongshi_ds.png'
            }

          }
          //制冰模式
          if (mode.luaKey == 'freezing_ice_machine_power') {
            if (devStatusData[mode.luaKey] == 'on') {
              mode.isOpen = true;
              if (devStatusData['rapid_ice_making'] != null) {
                if (devStatusData['rapid_ice_making'] == 'on') {
                  mode.modeName = '快速制冰'
                  mode.curStatus = '快速制冰'
                } else {
                  mode.modeName = '制冰模式'
                  mode.curStatus = '制冰模式'
                }
              } else {
                mode.modeName = '制冰模式'
                mode.curStatus = '制冰模式'
              }
            } else {
              mode.modeName = '制冰模式'
              mode.curStatus = '制冰关闭'
              mode.isOpen = false;
            }

          }
          //智能净味
          if (mode.luaKey == 'electronic_smell') {
            //模式别名
            let tasteAlias = this.data.devModelData.taste_alias != null && this.data.devModelData.taste_alias !=
              "" ? this.data.devModelData.taste_alias : '净化'
            //常规档位别名
            let changgui = this.data.devModelData.taste_commonalias != null && this.data.devModelData
              .taste_commonalias != "" ? this.data.devModelData.taste_commonalias : '常规'

            if (mode.hasStrongTaste) {
              if (devStatusData['electronic_clean_strong'] == 'on') { //强效
                mode.modeName = tasteAlias + "|强效"
                mode.curStatus = "强效"
                mode.activeIcon = 'znjw_qx.png'
              } else {
                mode.modeName = tasteAlias + "|" + changgui
                mode.curStatus = "常规"
                mode.activeIcon = 'znjw_cg.png'
              }
            } else {
              //技术名
              if (this.data.devModelData.taste_techname != null && this.data.devModelData.taste_techname !=
                "") { //获取技术名字  AEP+净化
                let tech = this.data.devModelData.taste_techname
                if (this.data.devModelData.taste_techname.length > 4)
                  tech = this.data.devModelData.taste_techname.substr(0, 4)
                else
                  tech = this.data.devModelData.taste_techname
                if (this.data.devModelData.taste_alias != null && this.data.devModelData.taste_alias != "") {
                  mode.modeName = tech + this.data.devModelData.taste_alias
                }
              } else {
                if (this.data.devModelData.have_strong_taste3_6) {
                  mode.modeName = "PST+净化"
                } else
                  mode.modeName = "PST+净味"
              }
            }
          }
          //微晶肉类
          if (mode.luaKey == 'aquatic_product') {
            if (devStatusData['microcrystal_fresh'] == 'on') {
              mode.modeName = "微晶肉类"
              mode.curStatus = "微晶肉类"
              mode.activeIcon = 'wjc_rl.png'
              mode.isOpen = true;
            } else if (devStatusData['aquatic_product'] == 'on') {
              mode.modeName = "微晶水产"
              mode.curStatus = "微晶水产"
              mode.activeIcon = 'wjc_sc.png'
              mode.isOpen = true;
            } else if (devStatusData['aquatic_product'] == 'off' && devStatusData['microcrystal_fresh'] ==
              'off') {
              mode.modeName = "微晶模式"
              mode.curStatus = "微晶模式"
              mode.activeIcon = 'wjc_off.png'
              mode.isOpen = false;
            }
          }
          //旧微晶模式
          if (mode.luaKey == 'icea_mode_power') {
            if (devStatusData['icea_mode_power'] == 'on') {
              mode.modeName = "冰镇模式"
              mode.curStatus = "冰镇模式"
              mode.activeIcon = 'oldwj_bz.png'
              mode.isOpen = true;
            } else if (devStatusData['microcrystal_fresh'] == 'on') {
              mode.modeName = "微晶模式"
              mode.curStatus = "微晶模式"
              mode.activeIcon = 'oldwj_wj.png'
              mode.isOpen = true;
            } else if (devStatusData['variable_mode'] == 'fresh_product_mode') {
              mode.modeName = "果蔬模式"
              mode.curStatus = "果蔬模式"
              mode.activeIcon = 'oldwj_gs.png'
              mode.isOpen = true;
            }
          }
        } else {
          mode.isOpen = false;
        }
      }
      this.setData({
        modeList: this.data.modeList,
        devStatusData: devStatusData
      })
    },
    getModeByLuaKey: function (luaKey) {
      for (let i = 0; i < this.data.modeList.length; i++) {
        let entity = this.data.modeList[i]
        if (entity.luaKey == luaKey) { //获取微晶模式
          return entity
        }
      }
    },
    //是否有旧微晶模式
    hasOldWeiJingMode: function (devModelData) {
      let list = devModelData.fridgeZoneList
      for (let index = 0; index < list.length; index++) {
        const element = list[index];
        if (element.chanageModeList != null) {
          let modeList = element.chanageModeList
          if (modeList.length == 3) {
            if (modeList[0].chanageMode_Type == '3' || modeList[0].chanageMode_Type == '8' || modeList[0]
              .chanageMode_Type == '9')
              return true
          }
        }
      }
      return false
    }

  }
})
