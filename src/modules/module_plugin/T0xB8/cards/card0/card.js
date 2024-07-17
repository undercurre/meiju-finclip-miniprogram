// import { CARD_MODE_OPTION } from '../../../../pages/common/js/cardMode'
// import { requestService } from '../../../../utils/requestService'
const app = getApp() //获取应用实例
const requestService = app.getGlobalConfig().requestService
// import {VCCOOMD,VC_WORKMODE,VC_FANLEVEL,VC_WATERLEVEL} from './utils/vccommand'
import { VC_SN8_MAP, VC_WATER_CONFIG, VC_SUCTION_CONFIG, VC_CLEAN_ICON_MAP, VC_IMAGE_ROOT_URL, VC_PLANNED_ROBOT_ERROR, VC_WORK_STATE, VC_WROK_MODE, VC_ControlButton_type, VC_Button_tag, VC_FAN_LEVEL, VC_WATER_LEVEL } from '../utils/vcutils'
// import { imageApi } from '../../../../api.js'
//const localImag = '/pages/T0xB8/assets/img/'
//const localImag = imageApi.getImagePath.url + '/0xB8/'
//const localImag = "http://127.0.0.1:5500/";
// import { openSubscribeModal } from '../../../../globalCommon/js/deviceSubscribe.js'
// import { modelIds, templateIds } from '../../../../globalCommon/js/templateIds.js'

const localImag = VC_IMAGE_ROOT_URL;
const workModeKey = 'workmode'

//扫地机 工作 命令
var workCmd = {
    "work_status": "work",
    "move_direction": "none",
    "work_mode": "arc",
    "fan_level": "normal",
    "water_level": "low"
}
//扫地机 回充 命令
var chargeCmd = {
    "work_status": "charge",
}
//扫地机 停止工作/停止回充 命令
var stopWorkCmd = {
    "work_status": "stop",
    "move_direction": "none",
}
var VC_WORKMODE = {
    WM_NONE: 'none',
    WM_RANDOM: 'random',
    WM_ARC: 'arc',
    WM_EDGE: 'edge',
    WM_EMPHASES: 'emphases',
    WM_SCREW: 'screw',
    WM_BED: 'bed',
    WM_WIDESCREW: 'wide_screw',
    WM_AUTO: 'auto',
    WM_AREA: 'area',
    WM_DEEP: 'deep'
}

Component({
    options: {
        multipleSlots: true // 在组件定义时的选项中启用多slot支持
    },
    properties: {// 这里定义了innerText属性，属性值可以在组件使用时指定
        applianceData: {
            type: Object,
            value: function () {
                return {
                }
            },
        },
        pageHeight: {
          type: Number ,
          value: 0
        },
    },
    data: {
        headImgUrl: localImag + 'vc-robot.png',
        //////////////////////////////////////////////////////////////////////vc dat define begin //////////////////////////////////////////////////////////////////////
        /**设备状态数据源，每次设备状态更新，需要更新以下字段*/
        dev_status: {
            type: String,
            value: VC_WORK_STATE.workstate_standby,
            observer: function (newVal, oldVal) {
                if ((newVal == VC_WORK_STATE.workstate_work || newVal == VC_WORK_STATE.workstate_work_w11) && newVal != oldVal) {
                    this.doLockMode(false);
                }
            }
        },
        dev_mode: VC_WROK_MODE.workmode_zigzag,
        dev_battery: -1,
        dev_cleanArea: 0,
        dev_cleanTime: 0,
        dev_mop: false,
        dev_isMopClean: false, //i3pro专用

        devState: {
            status: VC_WORK_STATE.workstate_standby,
            mode: VC_WROK_MODE.workmode_zigzag,
            battery: -1,
            cleanArea: 0,
            cleanTime: 0,
            installMop: false,
            hasError: false,
            isMopClean: false,
            sn8: ''
        },
        /**设备状态数据源，每次设备状态更新，需要更新以下字段 end*/
        lockMode: false,
        chargeImgUrl: localImag + 'vc-charge-sign.png',
        /**控制面板list */
        itemList: [],

        varMargin: 46,
        midMargin: 15,
        stateImageUrls: {
            /**清扫时 */
            workImg: localImag + 'vc-state-working.png',
            /**在充电 */
            chargeImg: localImag + 'vc-state-standby.png',
            /**回充中 */
            rechargeImg: localImag + 'vc-state-standby.png',
            /**其他时候 */
            otherImg: localImag + 'vc-state-standby.png'
        },
        stateTitles: {
            standby: '待机中',
            work: '清洁中',
            work_water: '清洁中',
            recharging: '回充中',
            charging: '充电中',
            chargingline: '直流充电中',
            chargeComplete: '充电完成',
            error: '故障中',
            reserve_task_finished: '预约完成',
            pause: '暂停',
            sleep: '休眠',
            dusting: '集尘中',
            relocate: '重定位中',
            //w11
            back_cleanMop: '返回清洁抹布中',
            cleanMop_pause: '返回清洁抹布暂停',
            manual_control: '手动控制',
            on_base: '在站上',
            map_searching: '环境探索中',

            //w11机器在基站上子状态
            inject_water: "注水",
            mop_clear: "抹布清洁",
            mop_drying: "抹布风干",
            mop_hot_drying: "抹布烘干",
            station_error: "水站异常",
            charge_finish: "充电完成",
            charging_w11: "充电中",
        },
        /**电池各状态图标 */
        batteryImgUrls: {
            zeroCharge: localImag + 'vc-battery-zero.png',
            zeroUnCharge: localImag + 'vc-battery-zero.png',
            quarter: localImag + 'vc-battery-quarter.png',
            half: localImag + 'vc-battery-half.png',
            quarter3: localImag + 'vc-battery-quarter3.png',
            full: localImag + 'vc-battery-full.png',

            body: localImag + 'vc-battery-body.png',
            charging: localImag + 'vc-battery-body1.png',
        },
        showError: false,
        //////////////////////////////////////////////////////////////////////vc dat define end //////////////////////////////////////////////////////////////////////
        intervalTimer: -1,
        errorTitle: '',
        errorContent: '',
        errorMsgList: [],


        //故障提示  1:可解除类 2:重启类 3:警告类
        faultDescDict: {
            "noDust": { title: "未安装尘盒", content: "请先安装尘盒再清扫。", type: 2 },
            "dustFull": { title: "尘盒已满", content: "尘盒已满啦", type: 2 },
            "noWater": { title: "水箱缺水", content: "水箱缺水啦", type: 1 },
            "suspend": { title: "轮组悬空", content: "请检查扫地机是否悬空，将扫地机置于平稳位置。", type: 2 },
            "wheelOverload": { title: "轮组过载", content: "请检查扫地机轮子是否被卡住，解除缠绕放于平稳位置，并短按正面的电源键解除故障。", type: 2 },
            "motorOverload": { title: "吸尘电机过载", content: "请联系美的售后服务人员。", type: 2 },
            "panelFault": { title: "前方碰撞板故障", content: "请检查扫地机前方碰撞板是否被卡住，短按正面的电源键解除故障。", type: 2 },
            "sensorFault": { title: "前端传感器故障", content: "请联系美的售后服务人员。", type: 2 },
            "powerOff": { title: "电源开关未打开", content: "请打开扫地机电源开关。", type: 2 },
            "burshFault": { title: "边刷故障", content: "请检查扫地机边刷是否被卡住，解除缠绕放于平稳位置，并短按正面的电源键解除故障。", type: 2 },
            "rollerFault": { title: "滚刷故障", content: "请检查扫地机滚刷是否被卡住，解除缠绕放于平稳位置，并短按正面的电源键解除故障。", type: 2 },
            "powerLow": { title: "电量低", content: "电量不足，请及时充电!", type: 2 },
            "powerFull": { title: "充电完成", content: "电量已满！", type: 1 },
        },
        luaErrorMap: {
            infra_red_low_right_back_fall: "sensorFault",
            infra_red_low_left_back_fall: "sensorFault",
            infra_red_low_right_hanging: "suspend",
            infra_red_low_left_hanging: "suspend",
            infra_red_low_right_collision: "panelFault",
            infra_red_low_left_collision: "panelFault",
            infra_red_low_center_collision: "panelFault",
            infra_red_high_left_front_obstacle: "sensorFault",
            infra_red_high_right_front_obstacle: "sensorFault",
            infra_red_high_front_obstacle: "sensorFault",
            infra_red_high_left_obstacle: "sensorFault",
            infra_red_high_right_obstacle: "sensorFault",
            infra_red_high_right_fall: "sensorFault",
            infra_red_high_front_fall: "sensorFault",
            infra_red_high_left_fall: "sensorFault",
            failure_low_no_dust_box: "noDust",
            failure_low_dust_box_full: "dustFull",
            failure_low_right_side_brush: "burshFault",
            failure_low_left_side_brush: "burshFault",
            failure_low_right_wheel_overload: "wheelOverload",
            failure_low_left_wheel_overload: "wheelOverload",
            failure_mid_front_collision_switch: "panelFault",
            failure_mid_roll_brush: "rollerFault",
            failure_mid_right_back_fall_sensor: "sensorFault",
            failure_mid_left_back_fall_sensor: "sensorFault",
            failure_mid_right_back_hanging_sensor: "suspend",
            failure_mid_left_back_hanging_sensor: "suspend",
            failure_mid_right_collision_switch: "panelFault",
            failure_mid_left_collision_switch: "panelFault",
            failure_high_left_front_infra_red: "sensorFault",
            failure_high_right_front_infra_red: "sensorFault",
            failure_high_front_infra_red: "sensorFault",
            failure_high_left_infra_red: "sensorFault",
            failure_high_right_infra_red: "sensorFault",
            failure_high_right_drop_sensor: "sensorFault",
            failure_high_front_drop_sensor: "sensorFault",
            failure_high_left_drop_sensor: "sensorFault",
            user_low_no_dust_box: "noDust",
            user_low_dust_box_full: "dustFull",
            user_low_no_water: "noWater",
            user_low_charging_switch_off: "powerOff",
            user_mid_engine: "motorOverload",
            low_no_dust_box: "noDust",
            low_dust_box_full: "dustFull",
            low_no_water: "noWater",
            low_charging_switch_off: "powerOff",
            low_panel_stuck: "panelFault",
            low_wheel_hang: "suspend",
            roller_fault_sign: "rollerFault",
            right_brush_fault_sign: "burshFault",
            left_brush_fault_sign: "burshFault",
            motor_fault_sign: "motorOverload",
            right_wheel_overload: "wheelOverload",
            left_wheel_overload: "wheelOverload",
            fall_down_sign: "sensorFault",
            user_alert_no_dust_box: 'noDust',
            user_alert_dust_box_full: 'dustFull',
            user_alert_less_water: 'noWater',
            user_alert_charge_switch_off: 'powerOff',
            user_alert_front_baffle_stuck: 'panelFault',
            user_alert_left_right_wheel_hang: 'suspend'
        },
        plannedRobotCanFixError: VC_PLANNED_ROBOT_ERROR,
        /**保存设备是否有故障标记 */
        hasDeviceError: false,
        /**是否用户手动关闭了故障 */
        isCloseErrorManual: false,

        /**查询时间和状态更新时间*/
        queryTS: 0,
        statusUpdateTS: 0,
        isActivity: 0,   /**首次查询到状态后置1 */
        latestReserveTime: '', /*最近一次预约时间 */

        iconImg: "",  /*活动图标*/
        closeIconImg: "",
        showActivity: false,

        panelShow: false,
        suctionLevel: "low",
        //waterLevel: "low",
        fanLevel: VC_FAN_LEVEL.FL_NORMAL,
        waterLevel: VC_WATER_LEVEL.WL_LOW,
        modeType: VC_Button_tag.mode_zigzag_tag,

        suctionBtnList: [],
        waterBtnList: [{
            imgUrl: localImag + "vc-water-level1.png",
            selectedImgUrl: localImag + "vc-water-level1-selected.png",
            value: "none"
        }, {
            imgUrl: localImag + "vc-water-level2.png",
            selectedImgUrl: localImag + "vc-water-level2-selected.png",
            value: "low"
        }, {
            imgUrl: localImag + "vc-water-level3.png",
            selectedImgUrl: localImag + "vc-water-level3-selected.png",
            value: "normal"
        }, {
            imgUrl: localImag + "vc-water-level4.png",
            selectedImgUrl: localImag + "vc-water-level4-selected.png",
            value: "high"
        }],
        cleanModeBtnList: [{
            imgUrl: localImag + "vc-clean-mode1.png",
            selectedImgUrl: localImag + "vc-clean-mode1-selected.png",
            value: "4_mode_zigzag_tag",
            status: "",
        }, {
            imgUrl: localImag + "vc-clean-mode2.png",
            selectedImgUrl: localImag + "vc-clean-mode2-selected.png",
            value: "5_mode_edge_tag",
            status: "",
        }, {
            imgUrl: localImag + "vc-clean-mode3.png",
            selectedImgUrl: localImag + "vc-clean-mode3-selected.png",
            value: "6_mode_area_tag",
            status: "",
        }],
        testIndex: 0,
        cleanMode: '',
        dialogTitle: "清洁偏好",

        // warn_list: [],
        // _dataDic: {},
        // warn_index: 0
    },

    methods: {
       // 触发微信消息推送
        weixinMessagePush() {
          this.triggerEvent('subWeixinNews')
        },

        openPanel: function (param) {

            //订阅信息推送
            // openSubscribeModal(modelIds[3],
            //   this.data.applianceData.name,
            //   this.data.applianceData.sn,
            //   [templateIds[6][0], templateIds[7][0]],
            //   this.data.applianceData.sn8,
            //   this.data.applianceData.type,
            //   this.data.applianceData.applianceCode);
            this.weixinMessagePush()
            let p = {};
            p.panelType = param.detail.type;
            p.panelShow = true;
            if (p.panelType == "mode") {
                // p.propParam = {
                //     icon:VC_IMAGE_ROOT_URL+VC_CLEAN_ICON_MAP[param.detail.modeType].img,
                //     title:VC_CLEAN_ICON_MAP[param.detail.modeType].title
                // }

                p.modeType = VC_CLEAN_ICON_MAP[this.properties.dev_mode].tag;
                p.dialogTitle = "模式区域";
            }
            else {
                p.suctionLevel = param.detail.suctionLevel;
                p.waterLevel = param.detail.waterLevel;
                p.dialogTitle = "清洁偏好";
            }

            this.setData(p);
        },
        updatePreference() {
            //停机修改吸力水速状态缓存值获取
            var fanLevel = wx.getStorageSync("suctionLevel");
            var waterLevel = wx.getStorageSync("waterLevel");

            if (!!fanLevel) {
                this.setData({
                    fanLevel: fanLevel,
                    suctionLevel: fanLevel
                });
            }
            if (!!waterLevel) {
                this.setData({
                    waterLevel: waterLevel,
                });
            }
        },
        buttontap(e) {
            console.log(e.detail)
        },
        goToActivityIcon() {
            const app = getApp();
            let reqData = {
                "sn8": this.data.applianceData.sn8,
                "deviceId": (Number(this.data.applianceData.applianceCode)).toString(16),
                "userId": app.globalData.userData.iotUserId,
                "lang": "zh"
            }
            requestService.request('getActiveImageUrl', reqData).then((res) => {
                if (res.data.errorCode == 0) {
                    this.setData({
                        iconImg: res.data.data.iconImg,
                        closeIconImg: localImag + 'vc-close-clean-info.png',
                        showActivity: true
                    })
                    console.log(res)
                }
                else {
                    console.log(res)
                }
            }).catch(err => {

                console.warn(err)
            })
        },
        goToActivity() {
            wx.navigateTo({
                url: '/plugin/T0xB8/activity/activity?sn8='
                    + this.data.applianceData.sn8 + "&code="
                    + (Number(this.data.applianceData.applianceCode)).toString(16)
            })
  
        },
        closeActivity() {
            this.setData({
                showActivity: false
            })
        },
        getCurrentMode() {
            return {
                applianceCode: this.data.applianceData.applianceCode,
                mode:
                    this.properties.applianceData.onlineStatus == 1
                        ? 'default'
                        : 'offline'
            };
        },
        onPersent10Warning() {
            if (this.data.isActivity == 1) {
                this.showBatteryWarningToast('电量过低，请将扫地机置于充电座上充电')
            }
        },
        onPersent20Warning() {
            if (this.data.isActivity == 1) {
                this.showBatteryWarningToast('电量不足，请充电')
            }
        },
        showBatteryWarningToast(toastCtx) {
            wx.showToast({
                title: toastCtx,
                icon: 'none',
                duration: 5000
            })
        },
        showErrorAlert(show) {
            if (!show) {
                this.setData({
                    errorMsgList: [],
                })
            }

            this.setData({
                showError: show
            })
        },
        onErrorClose() {
            /**关闭时候将 isCloseErrorManual置为true*/
            this.setData({
                isCloseErrorManual: true
            })
            this.showErrorAlert(false);
        },
        getActived() {
            //当设备列表页切换到当前页面时触发

            this.setData({
                isActivity: 1
            })

            //刷新设备状态
            this.init()

            //开启定时任务 
            this.startQuery();
        },
        startQuery() {
            this.queryState(false).then((succeedRes) => {

                this.parseQueryResult(succeedRes);

            }, (failRes) => {
                // wx.showLoading({
                //     title: failRes.data.msg,
                // })
            })
            /**开启定时任务轮训 */
            this.startQueryInterval();
        },
        clearQueryInterval() {
            if (this.data.intervalTimer != -1) {
                clearInterval(this.data.intervalTimer);
                this.setData({
                    intervalTimer: -1
                })
            }
        },
        getDestoried() {
            this.setData({
                isActivity: 0
            })
            //执行当前页面前后插件的业务逻辑，主要用于一些清除工作
            this.clearQueryInterval();
        },
        initCard() {
            //初始化卡片页
            if (!this.data.isInit) {
                this.setData({
                    isInit: true
                })

                this.init()
            }
        },
        doIntervalWork() {
            var startQueryTs = new Date().getTime();

            this.setData({
                queryTS: startQueryTs
            })
            //定时查询设备状态
            this.queryState(true).then((succeedRes) => {
                this.parseQueryResult(succeedRes);

            }, (failRes) => {
            })
        },
        doTempWork(e) {
            if (VC_SN8_MAP[this.data.devState.sn8] == "w11") {
                this.switch_level_w11(e.detail.cur_level_type, e.detail.suctionLevel, e.detail.waterLevel, e.detail.devState)
            }
            else {
                wx.showLoading({
                    title: '加载中',
                })
                var startQueryTs = new Date().getTime();

                this.setData({
                    queryTS: startQueryTs
                })
                //定时查询设备状态
                this.queryState(true).then((succeedRes) => {
                    this.parseQueryResult(succeedRes);
                    wx.hideLoading()

                }, (failRes) => {
                    wx.hideLoading()
                })
            }


        },
        startQueryInterval() {
            var that = this;
            if (this.data.intervalTimer == -1) {
                var ct = setInterval(function () {
                    that.doIntervalWork();
                }, 5000);

                this.setData({
                    intervalTimer: ct
                })
            }
        },
        // createControlItem(itemType,itemTag,icons,titles,colors,subItems){
        //     return {type:itemType,tag:itemTag,icons:icons,titles:titles,colors:colors,subItems:subItems != undefined?subItems:[]};
        // },
        createControlItem(itemType, itemTag, icons, titles, styles, subItems) {
            return { type: itemType, tag: itemTag, icons: icons, titles: titles, styles: styles, subItems: subItems != undefined ? subItems : [] };
        },
        /**更新各子view中的model，达到更新子viewUI */
        updateDeviceState() {
            var updateTS = new Date().getTime();

            this.setData({
                statusUpdateTS: updateTS
            })
            this.setData({
                devState: {
                    status: this.data.dev_status,
                    subStatus: this.data.dev_sub_status,
                    mode: this.data.dev_mode,
                    battery: this.data.dev_battery,
                    cleanArea: this.data.dev_cleanArea,
                    cleanTime: this.data.dev_cleanTime,
                    hasError: this.data.hasDeviceError,
                    isMopClean: this.data.dev_isMopClean,
                    sn8: this.data.applianceData.sn8
                }
            })
        },
        doLockMode(lock) {
            this.setData({
                lockMode: lock
            })
        },

        switchCleanMode(isI3p, mode) {
            if (isI3p) {
                this.stop().then((succeedRes) => {
                    this.parseStopResult(succeedRes);

                    this.startWork(mode).then((succeedRes) => {
                        wx.hideLoading()
                        this.parseCleanResult(succeedRes);

                    }, (failRes) => {
                        wx.hideLoading()
                    })
                }, (failRes) => {
                })
            } else {
                this.startWork(mode).then((succeedRes) => {
                    this.parseCleanResult(succeedRes);
                }, (failRes) => {
                })
            }
        },
        /**控制面板点击事件 */
        onControlPanelTap(event) {
            //订阅信息推送
            // openSubscribeModal(modelIds[3],
            //   this.data.applianceData.name,
            //   this.data.applianceData.sn,
            //   [templateIds[6][0], templateIds[7][0]],
            //   this.data.applianceData.sn8,
            //   this.data.applianceData.type,
            //   this.data.applianceData.applianceCode);
            this.weixinMessagePush()
            var tagIndex = event.detail.tagindex;
            if (tagIndex == VC_Button_tag.mode_zigzag_tag
                && this.data.dev_mode != VC_WROK_MODE.workmode_zigzag) {

                if (this.data.dev_status == VC_WORK_STATE.workstate_work || this.data.dev_status == VC_WORK_STATE.workstate_work_w11) {
                    this.resetTimeAndArea()
                    this.doLockMode(false);
                    this.switchCleanMode(this.is_i3pro(), VC_WROK_MODE.workmode_zigzag);
                } else {
                    this.doLockMode(true);

                    this.setData({
                        dev_mode: VC_WROK_MODE.workmode_zigzag
                    })
                    this.updateDeviceState();
                }


            } else if (tagIndex == VC_Button_tag.mode_area_tag
                && this.data.dev_mode != VC_WROK_MODE.workmode_area) {

                if (this.data.dev_status == VC_WORK_STATE.workstate_work || this.data.dev_status == VC_WORK_STATE.workstate_work_w11) {
                    this.resetTimeAndArea()
                    this.doLockMode(false);
                    this.switchCleanMode(this.is_i3pro(), VC_WROK_MODE.workmode_area);
                } else {
                    this.doLockMode(true);
                    this.setData({
                        dev_mode: VC_WROK_MODE.workmode_area
                    })
                    this.updateDeviceState();
                }

            } else if (tagIndex == VC_Button_tag.mode_edge_tag
                && this.data.dev_mode != VC_WROK_MODE.workmode_edge) {

                if (this.data.dev_status == VC_WORK_STATE.workstate_work || this.data.dev_status == VC_WORK_STATE.workstate_work_w11) {
                    this.resetTimeAndArea()
                    this.doLockMode(false);
                    this.switchCleanMode(this.is_i3pro(), VC_WROK_MODE.workmode_edge);
                } else {
                    this.doLockMode(true);
                    this.setData({
                        dev_mode: VC_WROK_MODE.workmode_edge
                    })
                    this.updateDeviceState();
                }
            } else if (tagIndex == VC_Button_tag.clean_tag) {
                if (this.data.hasDeviceError) {
                    this.showErrorAlert(true);
                    return;
                }
                this.doLockMode(false);
                if (this.data.devState.status == VC_WORK_STATE.workstate_work || this.data.devState.status == VC_WORK_STATE.workstate_work_w11) {
                    this.stop().then((succeedRes) => {
                        //wx.hideLoading()

                        this.parseStopResult(succeedRes);

                    }, (failRes) => {

                        //wx.hideLoading()
                    })
                } else {
                    /**检查是否连线充电中 */
                    if (this.data.dev_status == VC_WORK_STATE.workstate_chargewithline) {
                        wx.showToast({
                            title: '直流充电中，请勿工作',
                            icon: 'none',
                            duration: 3000
                        })
                        return
                    }
                    this.resetTimeAndArea()

                    this.startWork(this.data.dev_mode).then((succeedRes) => {
                        //wx.hideLoading()
                        // console.log("onPanel startWork: res=" + JSON.stringify(succeedRes))
                        //i3p补丁,在充电座上启动清扫时，不立即更新设备状态，因为i3p在充电坐上启动清扫，此时立刻查询会还是在充电座的状态
                        if (this.is_i3pro() && this.data.dev_status == VC_WORK_STATE.workstate_charging) {
                            return;
                        }
                        this.parseCleanResult(succeedRes);
                    }, (failRes) => {
                        //wx.hideLoading()
                        console.log("onPanel startWork: failRes=" + JSON.stringify(failRes))
                    })
                }
            } else if (tagIndex == VC_Button_tag.recharge_tag) {
                if (this.data.hasDeviceError) {
                    this.showErrorAlert(true);
                    return;
                }
                if (this.data.devState.status == VC_WORK_STATE.workstate_recharging || this.data.devState.status == VC_WORK_STATE.workstate_recharging_w11) {
                    this.stop().then((succeedRes) => {
                        this.parseStopResult(succeedRes);

                    }, (failRes) => {
                    })
                } else {
                    this.runCharge().then((succeedRes) => {
                        this.parseStopResult(succeedRes);

                    }, (failRes) => {
                    })
                }
            }
        },
        resetTimeAndArea() {
            this.setData({
                cleanTime: 0,
                cleanArea: 0
            })
        },
        /**工作模式本地保存--i3pro专用 */
        setWorkModeInLocal(key, value) {
            var keyPre = this.data.applianceData.sn8;

            wx.setStorage({
                key: keyPre + key,
                data: value
            })
        },
        getWorkModeInLocal(key, callBack) {
            var keyPre = this.data.applianceData.sn8;
            wx.getStorage({
                key: keyPre + key,
                success(res) {
                    //console.log(res.data)
                    callBack(res.data);
                }
            })
        },
        is_i3pro() {
            if (this.data.applianceData.sn8 == '00VR1717') {
                return true;
            }
            return false;
        },
        isPlannedRobot() {
            if (this.data.applianceData.sn8 == '100VR501' || this.data.applianceData.sn8 == '000VR105' || this.data.applianceData.sn8 == '00VR1717'
                || this.data.applianceData.sn8 == '000VR901' || this.data.applianceData.sn8 == '20VR5001'
                || this.data.applianceData.sn8 == '000VR110' || this.data.applianceData.sn8 == '7500046X' || this.data.applianceData.sn8 == '000VRM30'
                || this.data.applianceData.sn8 == '7500046W' || this.data.applianceData.sn8 == '000VR0H0' || this.data.applianceData.sn8 == '000VR100'
                || this.data.applianceData.sn8 == '000VR0J0' || this.data.applianceData.sn8 == '000VR0A0' || this.data.applianceData.sn8 == '7500047T'
                || this.data.applianceData.sn8 == '7500047S' || this.data.applianceData.sn8 == '7500047B' || this.data.applianceData.sn8 == '000VR901') {
                return false;
            }
            return true;
        },
        isRandomRobot() {
            if (this.data.applianceData.sn8 == '7500046X' || this.data.applianceData.sn8 == '000VR100'
                || this.data.applianceData.sn8 == '7500047T' || this.data.applianceData.sn8 == '7500047S') {
                return true;
            }
            return false;
        },

        isM4Robot() {
          if(this.data.applianceData.sn8 == '000VR0T0' || this.data.applianceData.sn8 == '000VR110' || this.data.applianceData.sn8 == '000VR0A0' || this.data.applianceData.sn8 == '000VR140' || this.data.applianceData.sn8 == '7500046W') {
            return true
          }
          return false
        },
        isM3Robot() {
          if(this.data.applianceData.sn8 == '7500047T' || this.data.applianceData.sn8 == '7500047S' || this.data.applianceData.sn8 == '000VR0J0' || this.data.applianceData.sn8 == '000VR100' || this.data.applianceData.sn8 == '000VR0V0' || this.data.applianceData.sn8 == '000VRM30') {
            return true
          }
          return false
        },

        /** */
        configControlPanelUIData() {
            const iconButtonSize = "12px";
            console.log("configControlPanelUIData: localImag=" + localImag);
            var item1 = this.createControlItem(VC_ControlButton_type.control_button_type_normal, VC_Button_tag.clean_tag, {
                normal: localImag + 'vc-start-normal.png',
                select: localImag + 'vc-pause.png',
                disable: localImag + 'vc-start-disable.png'
            }, {
                normal: '开始清扫',
                select: '暂停清扫',
                disable: '开始清扫'
            }, {
                normal: "color:#000000;opacity:1;font-size:" + iconButtonSize,
                select: "color:#000000;opacity:1;font-size:" + iconButtonSize,
                disable: "color:#000000;opacity:0.3;font-size:" + iconButtonSize
            });
            var item2 = this.createControlItem(VC_ControlButton_type.control_button_type_mode, VC_Button_tag.mode_tag, {
                normal_zigzag: localImag + 'vc-modesel-zigzag-unselect.png',
                normal_area: localImag + 'vc-modesel-area-unselect.png',
                normal_edge: localImag + 'vc-modesel-edge-unselect.png',

                select_zigzag: localImag + 'vc-modesel-zigzag-select.png',
                select_area: localImag + 'vc-modesel-area-select.png',
                select_edge: localImag + 'vc-modesel-edge-select.png',

                disable_zigzag: localImag + 'vc-modesel-zigzag-disable.png',
                disable_area: localImag + 'vc-modesel-area-disable.png',
                disable_edge: localImag + 'vc-modesel-edge-disable.png',
            }, {
                normal_zigzag: '模式|弓形',
                normal_area: '模式|区域',
                normal_edge: '模式|沿边'
            }, {
                normal: "color:#000000;opacity:1;font-size:" + iconButtonSize,
                select: "color:#000000;opacity:1;font-size:" + iconButtonSize,
                disable: "color:#000000;opacity:0.3;font-size:" + iconButtonSize
            }, [this.createControlItem(VC_ControlButton_type.control_button_type_normal, VC_Button_tag.mode_zigzag_tag, {
                normal: localImag + 'vc-mode-zigzag-normal.png',
                select: localImag + 'vc-mode-zigzag-select.png',
                disable: localImag + 'vc-mode-zigzag-disable.png'
            }, {
                normal: '弓形',
                select: '弓形'
            }, {
                normal: "color:#8a8a8f;opacity:1;font-size:" + iconButtonSize,
                select: "color:#232323;opacity:1;font-size:" + iconButtonSize,
                disable: "color:#8a8a8f;opacity:0.3;font-size:" + iconButtonSize
            }),
            this.createControlItem(VC_ControlButton_type.control_button_type_normal, VC_Button_tag.mode_edge_tag, {
                normal: localImag + 'vc-mode-edge-normal.png',
                select: localImag + 'vc-mode-edge-select.png',
                disable: localImag + 'vc-mode-edge-disable.png'
            }, {
                normal: '沿边',
                select: '沿边'
            }, {
                normal: "color:#8a8a8f;opacity:1;font-size:" + iconButtonSize,
                select: "color:#232323;opacity:1;font-size:" + iconButtonSize,
                disable: "color:#8a8a8f;opacity:0.3;font-size:" + iconButtonSize
            }),
            this.createControlItem(VC_ControlButton_type.control_button_type_normal, VC_Button_tag.mode_area_tag, {
                normal: localImag + 'vc-mode-area-nromal.png',
                select: localImag + 'vc-mode-area-select.png',
                disable: localImag + 'vc-mode-area-disable.png'
            }, {
                normal: '区域',
                select: '区域'
            }, {
                normal: "color:#8a8a8f;opacity:1;font-size:" + iconButtonSize,
                select: "color:#232323;opacity:1;font-size:" + iconButtonSize,
                disable: "color:#8a8a8f;opacity:0.3;font-size:" + iconButtonSize
            })
            ]
            );

            var item3 = this.createControlItem(VC_ControlButton_type.control_button_type_normal, VC_Button_tag.recharge_tag, {
                normal: localImag + 'vc-recharge-normal.png',
                select: localImag + 'vc-recharge-pause.png',
                disable: localImag + 'vc-recharge-disable.png'
            }, {
                normal: '开始回充',
                select: '暂停回充',
                disable: '开始回充'
            }, {
                normal: "color:#000000;opacity:1;font-size:" + iconButtonSize,
                select: "color:#000000;opacity:1;font-size:" + iconButtonSize,
                disable: "color:#000000;opacity:0.3;font-size:" + iconButtonSize
            });

            if (this.isPlannedRobot() || this.isRandomRobot()) {
                this.setData({
                    itemList: [item3, item1]
                })
            } else {
                this.setData({
                    itemList: [item3, item2, item1]
                });
            }
        },
        parseStopResult(result) {
            var dataDic = result.data.data;

            var workStatus = dataDic.work_status

            this.setData({
                dev_status: workStatus
            })

            this.updateDeviceState();
        },
        parseCleanResult(result) {
            var dataDic = result.data.data;

            var workStatus = dataDic.work_status
            var workMode = dataDic.work_mode
            this.setData({
                dev_status: workStatus,
                dev_mode: workMode
            })
            if (this.is_i3pro() && workMode != undefined) {
                this.setWorkModeInLocal(workModeKey, workMode)
            }
            this.updateDeviceState();
        },
        // bindPickerChange(e) {
        //     debugger;
        //     let warn  = this.data.warn_list[e.detail.value];
        //     if(!!warn.is_base){
        //         this.data._dataDic.station_error_desc = warn.field;
        //     }
        //     else{
        //         this.data._dataDic.error_desc =warn.field;
        //         this.data._dataDic.error_type =warn.field
        //     }
        //     this.setData({
        //         warn_index: e.detail.value
        //       })

        //     this.checkPlannedRobotFault(this.data._dataDic);
        // },
        parseQueryResult(result) {
            /**丢弃这次查询结果 */
            if (this.queryTS < this.statusUpdateTS) {
                return;
            }

            var dataDic = result.data.data;
            console.log('work_status:' + dataDic.work_status + '  ##  station_error_desc:' + dataDic.station_error_desc + '  ##  work_sub_type:' + dataDic.work_sub_type);
            console.log(dataDic);

            // for (let key in this.data.plannedRobotCanFixError) {
            //     this.data.warn_list.push({
            //         field: key,
            //         name: this.data.plannedRobotCanFixError[key].name,
            //     })
            // }
            // this.setData({
            //     warn_list: this.data.warn_list
            // });

            this.data.devState.sn8 = dataDic.sn8 || dataDic.SN8;
            var workStatus = dataDic.work_status
            var workMode = dataDic.work_mode
            var clArea = dataDic.area;
            var clTime = dataDic.work_time;
            var batteryPercent = dataDic.battery_percent;
            var installMop = dataDic.mop;
            //i3pro专用
            var isMopClean = dataDic.clean_type == 'water_tank' ? true : false;

            //停机修改吸力水速状态缓存值获取
            var fanLevel = wx.getStorageSync("suctionLevel");
            var waterLevel = wx.getStorageSync("waterLevel");
            //吸力根据型号配置
            if (VC_SN8_MAP[this.data.devState.sn8] == "m6") {
                this.data.suctionBtnList = VC_SUCTION_CONFIG.m6;
            }
            else {
                this.data.suctionBtnList = VC_SUCTION_CONFIG.m6_above;
            }
            if (!(this.isPlannedRobot() || this.isRandomRobot())) {
                this.data.suctionBtnList = VC_SUCTION_CONFIG.planned;
                this.data.waterBtnList = VC_WATER_CONFIG.planned;
            }
            if(this.isM4Robot()) {
              this.data.suctionBtnList = VC_SUCTION_CONFIG.planned
            }
            if(this.isM3Robot()) {
              this.data.suctionBtnList = [VC_SUCTION_CONFIG.planned[1],VC_SUCTION_CONFIG.planned[2]]
              this.data.waterBtnList = VC_WATER_CONFIG.planned;

            }
            //判断w11
            var workSubStatus = "";
            if (VC_SN8_MAP[this.data.devState.sn8] == "w11") {
                this.data.suctionBtnList = VC_SUCTION_CONFIG.w11;
                this.data.waterBtnList = VC_WATER_CONFIG.w11;

                //w11子状态
                if (!!dataDic.work_sub_type) {

                    workSubStatus = dataDic.work_sub_type;
                    let is_mop_clean_value = false;
                    if (dataDic.work_sub_type == VC_WORK_STATE.workstate_mop_clear) {
                        // if (dataDic.work_status == VC_WORK_STATE.workstate_back_cleanMop_w11 || dataDic.work_status == VC_WORK_STATE.workstate_cleanMop_pause_w11 || dataDic.work_status == VC_WORK_STATE.workstate_pause_w11) {
                        //     is_mop_clean_value = false;
                        // }
                        // else{
                        //     is_mop_clean_value = true;
                        // }
                         if (dataDic.work_status == VC_WORK_STATE.workstate_on_base_w11||dataDic.work_status == VC_WORK_STATE.workstate_back_cleanMop_w11 || dataDic.work_status == VC_WORK_STATE.workstate_cleanMop_pause_w11) {
                            is_mop_clean_value = true;
                        }
                        else{
                            is_mop_clean_value = false;
                        }
                    }
                    else{
                        is_mop_clean_value = false;
                    }

                    if (dataDic.work_sub_type == VC_WORK_STATE.workstate_inject_water && dataDic.work_status == VC_WORK_STATE.workstate_on_base_w11) {
                        is_mop_clean_value = true;
                    }
                    this.setData({
                        is_mop_clean: is_mop_clean_value
                    });
                }
            }
            this.setData({
                dev_isMopClean: isMopClean,
                fanLevel: !!fanLevel ? fanLevel : dataDic.fan_level,
                suctionLevel: !!fanLevel ? fanLevel : dataDic.fan_level,
                waterLevel: !!waterLevel ? waterLevel : dataDic.water_level,
                // fanLevel: dataDic.fan_level,
                // suctionLevel: dataDic.fan_level,
                // waterLevel: dataDic.water_level,
                suctionBtnList: this.data.suctionBtnList,
                waterBtnList: this.data.waterBtnList,

                // val1:dataDic.work_status,
                // val2:dataDic.station_error_desc,
                // val3:dataDic.work_sub_type,
                // val4:dataDic.error_desc,
                // val5:dataDic.error_type,
                //modeType:this.data.modeType,
                // propParam:{
                //     icon:VC_IMAGE_ROOT_URL+VC_CLEAN_ICON_MAP[workMode].img,
                //     title:VC_CLEAN_ICON_MAP[workMode].title
                // }
            });
            wx.hideLoading();
            if (dataDic.have_reserve_task) {
                ;
            } else {
                this.setData({
                    latestReserveTime: ''
                });
            }


            //查询时避免更新mode
            if (this.data.lockMode == false) {
                this.setData({
                    dev_status: workStatus,
                    dev_sub_status: workSubStatus,
                    // dev_mode:workMode,
                    dev_battery: batteryPercent,
                    dev_cleanArea: clArea,
                    dev_cleanTime: clTime
                })
                if (this.is_i3pro()) {
                    //i3pro只在工作状态查询workmode才可以查到
                    if (workStatus == VC_WORK_STATE.workstate_work || workStatus == VC_WORK_STATE.workstate_work_w11) {
                        this.setData({
                            dev_mode: workMode
                        })
                        if (this.is_i3pro() && workMode != undefined) {
                            this.setWorkModeInLocal(workModeKey, workMode)
                        }
                    }
                } else {
                    this.setData({
                        dev_mode: workMode
                    })
                }
            } else {
                if (workStatus == VC_WORK_STATE.workstate_work || workStatus == VC_WORK_STATE.workstate_work_w11) {
                    this.setData({
                        dev_status: workStatus,
                        dev_sub_status: workSubStatus,
                        dev_mode: workMode,
                        dev_battery: batteryPercent,
                        dev_cleanArea: clArea,
                        dev_cleanTime: clTime
                    })
                    if (this.is_i3pro() && workMode != undefined) {
                        this.setWorkModeInLocal(workModeKey, workMode)
                    }
                } else {
                    this.setData({
                        dev_status: workStatus,
                        dev_sub_status: workSubStatus,
                        dev_battery: batteryPercent,
                        dev_cleanArea: clArea,
                        dev_cleanTime: clTime
                    })
                }
            }

            //**有些设备没有这个字段，单独设置，以免爆红 */
            if (installMop != undefined) {
                this.setData({
                    dev_mop: installMop
                })
            }
            /**充电中，区域清扫转为弓形 */
            if (this.data.dev_mode == VC_WROK_MODE.workmode_area) {
                if (workStatus == VC_WORK_STATE.workstate_charging ||
                    workStatus == VC_WORK_STATE.workstate_chargingComplete ||
                    workStatus == VC_WORK_STATE.workstate_chargewithline) {
                    this.setData({
                        dev_mode: VC_WROK_MODE.workmode_zigzag
                    })
                }
            }
            /**检查故障 */
            if (this.isPlannedRobot()) {
                this.checkPlannedRobotFault(dataDic);
                
                //this.data._dataDic = dataDic;
            } else {
                this.checkFault(dataDic)
            }

            //**更新数据源-关联更新UI */
            this.updateDeviceState();
        },
        show_forbid_control_tip() {
            wx.showToast({
                title: '抹布清洗模式下禁止控制',
                icon: 'none'
            })
        },
        hasKey(findKey, inErrorMap) {
            var flag = false;

            for (var key in inErrorMap) {
                if (key == findKey) {
                    flag = true;
                    break;
                }
            }
            return flag;
        },
        checkFault(data) {
            let that = this;

            var arr = [];
            for (var key in data) {
                arr.push(key);
            }
            arr.sort();

            that.setData({
                hasDeviceError: false
            })

            for (var i = 0; i < arr.length; i++) {
                if (data[arr[i]] == "yes") { //有故障
                    if (that.hasKey(arr[i], that.data.luaErrorMap)) {
                        var fault = that.data.luaErrorMap[arr[i]];

                        // that.setData({
                        //     errorTitle: that.data.faultDescDict[fault].title
                        // })
                        // that.setData({
                        //     errorContent: that.data.faultDescDict[fault].content
                        // })
                        that.setData({
                            errorMsgList: [{
                                type: that.data.faultDescDict[fault].type,
                                title: that.data.faultDescDict[fault].content
                            }]
                        })


                        that.setData({
                            hasDeviceError: true
                        })

                        break;
                    }
                }
            }
            /**展示故障页 */
            if (that.data.hasDeviceError) {
                if (this.data.isCloseErrorManual == false) {
                    this.showErrorAlert(true);
                }
            } else {
                /**如果查到没故障了，那么重置 isCloseErrorManual*/
                this.setData({
                    isCloseErrorManual: false
                })
                //隐藏显示故障
                this.showErrorAlert(false);
            }
        },
        checkPlannedRobotFault(data) {
            //老版本
            // for(var key in data){
            //     // console.log("checkPlannedRobotFault: key=" + key + ", error_type=" + data['error_type']);
            //     if(key == 'error_type' && data['error_type'] != 'no'){
            //         this.setData({
            //             hasDeviceError:true
            //         })
            //         //console.log("checkPlannedRobotFault: hasDeviceError=" + this.data.hasDeviceError);
            //         let errorDesc = this.data.plannedRobotCanFixError[data['error_desc']];
            //         //console.log("checkPlannedRobotFault: errorDesc=" + errorDesc);
            //         if(data['error_type'] == 'can_fix'){
            //             this.setData({
            //                 errorTitle: errorDesc
            //             })
            //         }
            //         if(this.data.isCloseErrorManual == false){
            //             this.showErrorAlert(true);
            //         }
            //     }
            // }

            //测试多报障提示情况
            // let testmap=["fix_dust","fix_low_battery","fix_laser_sensor","fix_start_in_forbid_area"];


            // if(this.data.testIndex>4){
            //     this.data.testIndex=0;
            // }
            // data['error_desc']=testmap[this.data.testIndex];
            // this.data.testIndex++;
            //data['station_error_desc']="warn_vacuum_mop_miss";


            if (!!data['error_type'] && data['error_desc']) {
                if (data['error_type'] != 'no') {
                    // let errorTypeMap = {
                    //     can_fix: 1,
                    //     reboot: 2,
                    //     warning: 3,
                    // }

                    if (this.data.errorMsgList.length > 0) {
                        let pre_type = this.data.errorMsgList[0].type;
                        let pre_title = this.data.errorMsgList[0].name;

                        let new_type = this.data.plannedRobotCanFixError[data['error_desc']].type;
                        let new_title = this.data.plannedRobotCanFixError[data['error_desc']].name;
                        if (pre_type != new_type && pre_title != new_title) {
                            this.data.errorMsgList.push({
                                type: this.data.plannedRobotCanFixError[data['error_desc']].type,
                                title: this.data.plannedRobotCanFixError[data['error_desc']].name
                            })
                        }
                    }
                    else {
                        this.data.errorMsgList.push({
                            type: this.data.plannedRobotCanFixError[data['error_desc']].type,
                            title: this.data.plannedRobotCanFixError[data['error_desc']].name
                        })
                    }


                    if (this.data.errorMsgList.length > 2) {
                        this.data.errorMsgList.shift();
                    }

                    if (!this.data.isCloseErrorManual) {
                        this.showErrorAlert(true);
                    }
                    this.setData({
                        errorMsgList: this.data.errorMsgList,
                        hasDeviceError: true,
                        showError: true
                    })
                }
                else {


                    this.setData({
                        errorMsgList: [],
                        hasDeviceError: false,
                        showError: false
                    })

                }
            }
            //w11基站报障
            if (!!data['station_error_desc'] && data['station_error_desc'] != 'no') {
                if (this.data.errorMsgList.length > 0) {
                    let pre_type = this.data.errorMsgList[0].type;
                    let pre_title = this.data.errorMsgList[0].name;

                    let new_type = 2;
                    let new_title = this.data.plannedRobotCanFixError[data['station_error_desc']].name;
                    if (pre_type != new_type && pre_title != new_title) {
                        this.data.errorMsgList.push({
                            type: 2,
                            title: this.data.plannedRobotCanFixError[data['station_error_desc']].name
                        })
                    }
                }
                else {
                    this.data.errorMsgList.push({
                        type: 2,
                        title: this.data.plannedRobotCanFixError[data['station_error_desc']].name
                    })
                }

                if (this.data.errorMsgList.length > 2) {
                    this.data.errorMsgList.shift();
                }

                if (!this.data.isCloseErrorManual) {
                    this.showErrorAlert(true);
                }
                this.setData({
                    errorMsgList: this.data.errorMsgList,
                    hasDeviceError: true,
                    showError: true
                })
            }

        },
        init() {
            var self = this;
            var margin = 0;
            var screenH = wx.getSystemInfoSync().windowHeight
            var model = wx.getSystemInfoSync().model

            /**微调设备适配 */
            if (screenH > 603) {
                margin = (screenH - 603) / 2 + 26;
            } else {
                if (model.search('iPhone 5') != -1) {
                    margin = 6

                } else {
                    margin = 26
                }

            }
            this.setData({
                varMargin: margin,
                is_mop_clean: false//w11清洗抹布状态
            })

            if (model.search('iPhone 5') != -1) {
                this.setData({
                    midMargin: 5
                })
            }
            this.configControlPanelUIData();

            /**i3pro电控未存储清扫模式，需要app存取 */
            if (this.is_i3pro()) {
                this.getWorkModeInLocal(workModeKey, function (val) {
                    self.setData({
                        dev_mode: val
                    })
                    self.updateDeviceState();
                })
            }

            //加载活动图标
            this.goToActivityIcon();
            //初始化吸力水速档位缓存
            wx.removeStorageSync('suctionLevel');
            wx.removeStorageSync('waterLevel');
        },
        showLoading() {
            wx.showLoading({
                title: '加载中',
                mask: true
            });
        },

        hideLoading() {
            wx.hideLoading();
        },
        /**指令 */
        luaQuery(isPoll) {
            var self = this;
            return new Promise((resolve, reject) => {
                if (isPoll == false) {
                    this.showLoading()
                }
                let reqData = {
                    applianceCode: this.data.applianceData.applianceCode,
                    command: {},
                    stamp: +new Date(),
                    reqId: +new Date()
                }
                console.log("reqData:",reqData);
                requestService.request('luaGet', reqData).then((res) => {
                  console.log("luaget获取到的值是:", res);
                    if (isPoll == false) {
                        this.hideLoading()
                    }

                    if (res.data.code == 0) {
                        /**假如设备离线，查询到状态，说明设备在线了 */
                        if (self.properties.applianceData.onlineStatus != 1) {
                            //离线,初始化
                            this.setData({
                                'applianceData.onlineStatus': '1'
                            })
                            self.triggerEvent('modeChange', self.getCurrentMode());
                        }
                        resolve(res)
                    }
                    else {
                        reject(res)
                    }
                }).catch(err => {
                    if (isPoll == false) {
                        this.hideLoading()
                    }
                    if (err && err.data && err.data.code == 1306 && self.data.isActivity == 1 && isPoll == false) {
                        wx.showToast({
                            title: '设备未响应，请稍后尝试刷新',
                            icon: 'none'
                        })
                    }
                    if (err && err.data && err.data.code == 1307) {
                        //离线,初始化
                        this.setData({
                            'applianceData.onlineStatus': '0'
                        })
                        self.triggerEvent('modeChange', self.getCurrentMode());
                    }
                    reject(err)
                })
            })
        },
        luaControl(changeItem, need_hide) {//发送设备控制lua
            this.showLoading({
                title: '加载中',
            })
            return new Promise((resolve, reject) => {
                let reqData = {
                    applianceCode: this.data.applianceData.applianceCode,
                    command: { control: changeItem },
                    stamp: +new Date(),
                    reqId: +new Date()
                }
                console.log("当前信息:",reqData);
              
                requestService.request('luaControl', reqData).then((res) => {
                    //this.hideLoading()
                    if (!!need_hide) {
                        this.hideLoading()
                    }
                    if (res.data.code == 0) {
                        resolve(res)
                    } else {
                        reject(res)
                    }
                }).catch(err => {
                    this.hideLoading()
                    if (err && err.data && err.data.code == 1306) {
                        wx.showToast({
                            title: '设备未响应，请稍后尝试刷新',
                            icon: 'none'
                        })
                    }
                    reject(err)
                })
            })
        },
        /**查询03 32  */
        queryState(isPoll) {
            //var cmd = queryCmd;
            return this.luaQuery(isPoll)
        },
        /**启动清扫 02 02指令 */
        /**
         * @wrokMode 工作模式 弓形，延边，区域，自动等
         * @fanLevel 吸力大小 关闭 安静 正常 强力 off low normal high
         * @waterLavel 关闭 慢 中 快 off low normal high
         */
        // startWork(wrokMode,fanLevel,waterLavel)
        startWork(workMode) {
            var cmd = workCmd;
            if (this.isPlannedRobot() || this.isRandomRobot()) {
                cmd.work_mode = VC_WROK_MODE.workmode_auto;
            } else {
                cmd.work_mode = workMode;
            }

            var fanLevel = wx.getStorageSync("suctionLevel");
            var waterLevel = wx.getStorageSync("waterLevel");

            if (!!fanLevel) {
                cmd.fan_level = fanLevel;
            }
            if (!!waterLevel) {
                cmd.water_level = waterLevel;
            }
            //w11 吸力水速特殊传参

            if (this.data.applianceData.sn8 == "7500047M") {
                if (!!workMode) {
                    if (workMode.work_status == "work") {
                        cmd.move_direction = "none";
                        cmd.work_mode = workCmd.work_mode;
                        cmd.work_status = "work";
                        cmd.fan_level = "none";
                        cmd.water_level = "none";
                    }

                }
                else {
                    cmd.move_direction = "none";
                    cmd.work_mode = workCmd.work_mode;
                    cmd.work_status = "work";
                    cmd.fan_level = "none";
                    cmd.water_level = "none";
                }

            }
            return this.luaControl(cmd)
        },
        switch_level_w11(cur_level_type, fan_level, water_level, devState) {
            let cmd = {};
            // cmd.move_direction = "none";
            // cmd.work_mode = "none";
            // cmd.work_status = "work";
            if (cur_level_type == "suctionLevel") {
              cmd.fan_setting = {
                "level": fan_level
              }
                // cmd.fan_level = fan_level;
                // cmd.water_level = "none";

            }
            else {
                // cmd.fan_level = "none";
                // cmd.water_level = water_level;
                cmd.water_tank_setting = {
                  "level": water_level
                }
            }
            return this.luaControl(cmd);

        },
        startNewWork(param) {
            //####
            var cmd = workCmd;
            if (this.isPlannedRobot() || this.isRandomRobot()) {
                cmd.work_mode = VC_WROK_MODE.workmode_auto;
            } else {
                cmd.work_mode = param.detail.mode;
            }
            //w11 吸力水速特殊传参
            if (VC_SN8_MAP[this.data.devState.sn8] == "w11") {
                cmd.move_direction = "none";
                cmd.work_mode = "none";
                cmd.work_status = "none";
                if (param.detail.cur_level_type == "suctionLevel") {
                    cmd.fan_level = param.detail.suctionLevel;
                    cmd.water_level = "none";
                }
                else {
                    cmd.fan_level = "none";
                    cmd.water_level = param.detail.water_level;
                }
            }
            else {
                cmd.fan_level = param.detail.suctionLevel;
                cmd.water_level = param.detail.waterLevel;
            }

            this.setData({
                fanLevel: param.detail.suctionLevel,
                waterLevel: param.detail.waterLevel,
                suctionLevel: param.detail.suctionLevel,
            });
            return this.luaControl(cmd, true)
        },
        /**执行回充 02 01指令*/
        runCharge() {
            var cmd = chargeCmd;
            return this.luaControl(cmd)
        },
        /**停止工作，停止回充 02 03指令*/
        stop() {
            var cmd = stopWorkCmd;
            return this.luaControl(cmd)
        }
    },

    moved() {
    },
    attached() {
        //this.commandIntf = new VCCOOMD(this.data.applianceData.applianceCode);
        this.init();
    },
    detached() {
    },

    pageLifetimes: {
        show() {
        },
        hide() {
        },
        resize(size) {
            // 页面尺寸变化
        }
    }
})