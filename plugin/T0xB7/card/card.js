import { CARD_MODE_OPTION } from '../../../pages/common/js/cardMode';
import { requestService } from '../../../utils/requestService';
import { getReqId, getStamp } from 'm-utilsdk/index'
import images from './assets/js/img';
import getSetting from './assets/js/setting';
import { pluginEventTrack } from '../../../track/pluginTrack.js'
// const lottie  = require('../../../activities/common/lottie-miniprogram/index')
// const lottie  = require('../../../sub-package/common-package/js/lottie-miniprogram/index')
let queryTimer = null;
Component({
    options: {
        multipleSlots: true
    },
    properties: {
        applianceData: {
            type: Object,
            value: function() {
                return {};
            }
        }
    },
    data: {
        images,
        scrollViewTop: 0,
        currentEquipment: 'left', // 当前显示标签页
        equipment: {
            left: {
                name: '左灶',
                fire: '',
                workTime: '', // min 已工作时间
                delayPowerOff: 'off', // 预约关火
                delayPowerOffTime: '', // 预约关火时间
            },
            middle: {
                name: '中灶',
                fire: '',
                workTime: '', // min 已工作时间
            },
            right: {
                name: '右灶',
                fire: '',
                workTime: '', // min 已工作时间
                delayPowerOff: 'off', // 预约关火
                delayPowerOffTime: '', // 预约关火时间
            }
        },
        babyLock: {
            show: true,
            mode: 'off',
            imgList: {
                on: images.lock_on,
                off: images.lock_off
            }
        },
        power: {
            imgList: {
                // off: images.power_off,
                on: images.power_on
            },
            mode: 'on',
        },
        delayPowerOff: {
            // mode: 'off', // 不在这里控制
            imgList: {
                off: images.delay_off,
                on: images.delay_on
            },
        },
        tempStatusImg: {
            imgList: {
                off: images.temp_off,
                on: images.temp_on
            }
        },
        _applianceData: {
            name: '',
            roomName: '',
            onlineStatus: 0
        },
        _applianceDataStatus: {
            left_status: 0, 
            // 待机中=0x00, 点火中/启动中=0x01， 工作中(含定时)=0x02， 关火中/关阀中=0x03
            right_status: 0,
            left_work_hours: 0,
            left_work_minutes: 0,
            right_work_hours: 0,
            right_work_minutes: 0,
            left_surplus_hours: 0,
            left_surplus_minutes: 0,
            right_surplus_hours: 0,
            right_surplus_minutes: 0,
            left_gear: 0,
            right_gear: 0,
            lock: 0, // BIT 0：童锁位，0=未锁，1=已上锁
            gas_leakage_code: 0, // BIT 3：燃气泄漏状态，0=无泄漏，1=有泄漏
        },
        equipmentData: {},
        clockScale: new Array(120),

        // 选择器
        multiArray: [['0', '1','2'], ['小时'], [], ['分钟']],
        multiIndex: [0, 0, 0, 0],
        isCardActived: false,
        isLeftKeepTemperature: false,
        isRightKeepTemperature: false,
        isCookmode: 'off',
        isRightCookmode: 'off',
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
        isTemperatureScenarioPage: false,
        selectItem: -1,
        targtTemperature: 130,
        detailData: {},
        hours: 0,
        minutes: 0,
        cookList: [
            {
                name: '香煎牛扒',
                code: 14015,
                costTime: 5,
                isAdd: false
            },
            {
                name: '风情牛排',
                code: 14011,
                costTime: 4,
                isAdd: true
            },
            {
                name: '煎牛排',
                code: 40,
                costTime: 7,
                isAdd: false
            },
            {
                name: '当归红枣炖鸡汤',
                code: 34,
                costTime: 127,
                isAdd: false
            },
            {
                name: '松茸炖鸡汤',
                code: 32008,
                costTime: 120,
                isAdd: false
            },
            {
                name: '滋补鸡汤',
                code: 32004,
                costTime: 117,
                isAdd: false
            },
            {
                name: '玉米排骨汤',
                code: 35,
                costTime: 117,
                isAdd: false
            },
            {
                name: '香甜玉米排骨汤',
                code: 32011,
                costTime: 117,
                isAdd: false
            },
            {
                name: '鲫鱼豆腐汤',
                code: 33,
                costTime: 27,
                isAdd: false
            },
            {
                name: '清炖鲫鱼汤',
                code: 32005,
                costTime: 25,
                isAdd: true
            },
            {
                name: '香滑鸡蛋羹',
                code: 37,
                costTime: 14,
                isAdd: false
            },
            {
                name: '清蒸鲈鱼',
                code: 36,
                costTime: 9,
                isAdd: false
            },
            {
                name: '清炖银鳕鱼',
                code: 10034,
                costTime: 8,
                isAdd: false
            },
            {
                name: '清蒸鲈鱼',
                code: 10020,
                costTime: 13,
                isAdd: true
            },
            {
                name: '速冻饺子',
                code: 38,
                costTime: 17,
                isAdd: false
            },
            {
                name: '西红柿鸡蛋汤面',
                code: 39,
                costTime: 10,
                isAdd: false
            },
            {
                name: '蒜蓉粉丝扇贝',
                code: 41,
                costTime: 23,
                isAdd: false
            },
            {
                name: '快手粉丝扇贝',
                code: 10026,
                costTime: 9,
                isAdd: true
            },
            {
                name: '椰奶燕窝羹',
                code: 12002,
                costTime: 20,
                isAdd: false
            },
            {
                name: '西班牙海鲜烩饭',
                code: 18004,
                costTime: 20,
                isAdd: false
            },
            {
                name: '芒果糯米糍',
                code: 10032,
                costTime: 30,
                isAdd: false
            },
            {
                name: '蒸水蛋',
                code: 10019,
                costTime: 22,
                isAdd: true
            },
            {
                name: '黄金南瓜饼',
                code: 10027,
                costTime: 14,
                isAdd: true
            },
            {
                name: '香菇蒸滑鸡',
                code: 10030,
                costTime: 14,
                isAdd: true
            },
            {
                name: '剁椒胖鱼头',
                code: 10021,
                costTime: 21,
                isAdd: true
            },
            {
                name: '海底椰瘦肉汤',
                code: 32001,
                costTime: 90,
                isAdd: false
            },
            {
                name: '粉丝娃娃菜',
                code: 10024,
                costTime: 14,
                isAdd: true
            },
            {
                name: '客家酿豆腐',
                code: 10025,
                costTime: 14,
                isAdd: true
            },
            {
                name: '金瓜百合',
                code: 10029,
                costTime: 14,
                isAdd: true
            },
            {
                name: '豉汁排骨',
                code: 10022,
                costTime: 14,
                isAdd: true
            },
            {
                name: '腊味芋头',
                code: 10028,
                costTime: 14,
                isAdd: true
            },
            {
                name: '缤纷水果茶',
                code: 13021,
                costTime: 9,
                isAdd: false
            },
            {
                name: '懒人鸡翅',
                code: 18001,
                costTime: 30,
                isAdd: false
            },
        ],
        recipeRestTime: 0,
        restTime: 0,
        rightRecipeRestTime: 0,
        rightRestTime: 0,
        workTime: 0,
        isLoad: false,
        isRightAllBtn: false,
        selectFood: '',
        isFirstLoad: true,
        cardOnBg: images.cardBg,
        leftTargetTime: null
    },
    methods: {
        getCurrentMode() {
            return {
                applianceCode: this.data._applianceData.applianceCode,
                mode:
                    this.data._applianceData.onlineStatus == 1
                        ? CARD_MODE_OPTION.HEAT
                        : CARD_MODE_OPTION.OFFLINE
            };
        },
        getActived() {
            this.triggerEvent('modeChange', this.getCurrentMode());
            this.setData({isCardActived: true});
            this.query();
        },
        getDestoried() {
            this.setData({isCardActived: false});
            if (queryTimer) clearTimeout(queryTimer);
        },
        query(showLoading = true) {
            if (showLoading) wx.showLoading({mask: true, title: '加载中'});
            requestService
                .request('luaGet', {
                    applianceCode: this.properties.applianceData.applianceCode,
                    command: {},
                    reqId: getStamp().toString(),
                    stamp: getStamp()
                })
                .then(rs => {
                    wx.hideLoading();
                    this.setData({ _applianceDataStatus: rs.data.data });
                    this.rendering(this.data._applianceDataStatus);
                })
                .catch(err => {
                    wx.hideLoading();
                    if(err.data != undefined) {
                        if (err.data.code == '1307') {
                            this.setData({ '_applianceData.onlineStatus': '0' });
                            this.triggerEvent('modeChange', this.getCurrentMode());
                            // 设备离线
                        } else if (err.data.code == '1306' && showLoading) {
                            wx.showToast({ title: '设备未响应，请稍后尝试刷新', icon: 'none', duration: 2000 });
                        }
                    }
                    else {
                        this.setData({ '_applianceData.onlineStatus': '0' });
                        this.triggerEvent('modeChange', this.getCurrentMode());
                    }
                    queryTimer = setTimeout(() => this.query(false), 5000); // 刷新失败5秒后重试
                });
        },
        tempQuery(showLoading = true) {
            if (showLoading) wx.showLoading({mask: true, title: '加载中'});
            requestService
                .request('luaGet', {
                    applianceCode: this.properties.applianceData.applianceCode,
                    command: {},
                    reqId: getStamp().toString(),
                    stamp: getStamp()
                })
                .then(rs => {
                    wx.hideLoading();
                    this.setData({
                        _applianceDataStatus: rs.data.data,
                        isTemperatureScenarioPage: !this.data.isTemperatureScenarioPage
                     });
                    this.rendering(this.data._applianceDataStatus);
                })
                .catch(err => {
                    wx.hideLoading();
                    if(err.data != undefined) {
                        if (err.data.code == '1307') {
                            this.setData({ '_applianceData.onlineStatus': '0' });
                            this.triggerEvent('modeChange', this.getCurrentMode());
                            // 设备离线
                        } else if (err.data.code == '1306' && showLoading) {
                            wx.showToast({ title: '设备未响应，请稍后尝试刷新', icon: 'none', duration: 2000 });
                        }
                    }
                    else {
                        this.setData({ '_applianceData.onlineStatus': '0' });
                        this.triggerEvent('modeChange', this.getCurrentMode());
                    }
                });
        },
        requestControl(control) {
            // wx.showNavigationBarLoading();
            wx.showLoading({
                title: '加载中',
                mask: true
            });
            return requestService
                .request('luaControl', {
                    applianceCode: this.properties.applianceData.applianceCode,
                    command: { control },
                    reqId: getStamp().toString(),
                    stamp: getStamp()
                })
                .then(rs => {
                    this.setData({
                        _applianceDataStatus: {
                            ...this.data._applianceDataStatus,
                            ...rs.data.data.status
                        },
                    });
                    this.query()
                    this.rendering(this.data._applianceDataStatus);
                    wx.hideNavigationBarLoading();
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
        tempRequestControl(control) {
            wx.showLoading({
                title: '加载中',
                mask: true
            });
            return requestService
                .request('luaControl', {
                    applianceCode: this.properties.applianceData.applianceCode,
                    command: { control },
                    reqId: getStamp().toString(),
                    stamp: getStamp()
                })
                .then(rs => {
                    this.setData({
                        _applianceDataStatus: {
                            ...this.data._applianceDataStatus,
                            ...rs.data.data.status
                        },
                    });
                    this.tempRendering(this.data._applianceDataStatus);
                    wx.hideNavigationBarLoading();
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
        timeRequedtControl(control) {
            wx.showLoading({
                title: '加载中',
                mask: true
            });
            return requestService
                .request('luaControl', {
                    applianceCode: this.properties.applianceData.applianceCode,
                    command: { control },
                    reqId: getStamp().toString(),
                    stamp: getStamp()
                })
                .then(rs => {
                    wx.hideNavigationBarLoading();
                    const eq = this.data.currentEquipment;
                    this.requestControl({
                        eq: eq,
                        target_time: this.data.hours * 3600 + this.data.minutes * 60,
                        cookmode:'order',
                        work_burner_control: this._getWorkBurnerControl(),
                        function_control: 4, // 定时关机
                        [`${eq}_surplus_hours`]: this.data.hours,
                        [`${eq}_surplus_minutes`]: this.data.minutes,
                    })
                    pluginEventTrack('user_behavior_event', null, {
                        page_id: 'page_control',
                        page_name: '插件首页',
                        widget_id: 'click_order',
                        widget_name: '定时关火',
                        ext_info: `${eq == 'left'?'左灶':'右灶'}定时${this.data.hours}小时${this.data.minutes}分钟`
                    })
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
        rendering(status) {
            console.log(status)
            if (!this.data.isCardActived) return false;
            if (queryTimer) clearTimeout(queryTimer);
            queryTimer = setTimeout(() => this.query(false), 5 * 1000)

            let leftWork = status.left_work_hours * 60 + status.left_work_minutes;
            if(status.left_work_hours == undefined) {
                if(parseInt(status.left_work_time / 3600) > 0) {
                    leftWork = parseInt(status.left_work_time / 3600) + '小时' + (parseInt(status.left_work_time / 60) - parseInt(status.left_work_time / 3600)*60) + '分钟'
                }
                else {
                    leftWork = parseInt(status.left_work_time / 60) + '分钟'
                }
            }
            let rightWork = status.right_work_hours * 60 + status.right_work_minutes;
            if(status.right_work_hours == undefined) {
                if(parseInt(status.right_work_time / 3600) > 0) {
                    rightWork = parseInt(status.right_work_time / 3600) + '小时' + (parseInt(right_work_time / 60) - (parseInt(status.right_work_time / 3600)*60)) + '分钟'
                }
                else {
                    rightWork = parseInt(status.right_work_time / 60) + '分钟'
                }
            }
            let middleWork = parseInt(status.middle_work_time / 60) + '分钟'
            if(parseInt(status.middle_work_time / 3600) > 0) {
                middleWork = parseInt(status.middle_work_time / 3600) + '小时' + (parseInt(status.middle_work_time / 60) - (parseInt(status.middle_work_time / 3600) * 60)) + '分钟'
            }

            let leftDelay = status.left_surplus_hours * 60 + status.left_surplus_minutes;
            let rightDelay = status.right_surplus_hours * 60 + status.right_surplus_minutes;
            if (status.left_surplus_hours == undefined || status.left_surplus_minutes == undefined) {
                leftDelay = 0
            }
            if(status.right_surplus_hours == undefined || status.right_surplus_minutes == undefined) {
                rightDelay = 0
            }

            let equipment = {
                '_applianceData.onlineStatus': '1',
                'equipment.left.fire': (status.left_status == 0 || status.left_elecmode == 'none') ? 'off' : 'on',
                'equipment.left.workHours': status.left_work_hours,
                'equipment.left.workMinutes': status.left_work_minutes,
                'equipment.left.surplusHours': status.left_surplus_hours,
                'equipment.left.surplusMinutes': status.left_surplus_minutes,
                'equipment.left.workTime': leftWork,
                'equipment.left.delayPowerOff': leftDelay == 0 ? 'off' : 'on',
                'equipment.left.delayPowerOffTime': leftDelay,
                'equipment.left.left_cookmode': status.left_cookmode,
                'equipment.left.left_target_temperature': status.left_target_temperature,
                'equipment.left.left_rest_time': parseInt(status.left_rest_time / 60),
                'equipment.left.left_gear': status.left_gear,
                'equipment.middle.fire': status.middle_status == 0 ? 'off' : 'on',
                'equipment.middle.workTime': middleWork, 
                'equipment.middle.middle_gear': status.middle_gear,
                'equipment.right.fire': status.right_status == 0 ? 'off' : 'on',
                'equipment.right.workHours': status.right_work_hours,
                'equipment.right.workMinutes': status.right_work_minutes,
                'equipment.right.workTime': rightWork,
                'equipment.right.delayPowerOff': rightDelay == 0 ? 'off' : 'on',
                'equipment.right.delayPowerOffTime': rightDelay,
                'equipment.right.right_cookmode': status.right_cookmode,
                'equipment.right.right_gear': status.right_gear,
                'equipment.right.surplusHours': status.right_surplus_hours,
                'equipment.right.surplusMinutes': status.right_surplus_minutes,
                'babyLock.mode': status.lock == 0 ? 'off' : 'on',
                'babyLock.show': status.lock == 0 || (status.left_status != 0 || status.right_status != 0), // 童锁只在未开启童锁且有点火状态时显示
            }
            var restTime = 0
            var workTimes = 0
            var isAddNum = 0
            for(var i = 0;i < this.data.cookList.length;i++) {
                if(this.data.currentEquipment == 'left' && status.left_recipe_id == this.data.cookList[i].code && !this.data.cookList[i].isAdd) {
                    isAddNum = 1
                }
                else if(this.data.currentEquipment == 'right' && status.left_recipe_id == this.data.cookList[i].code && !this.data.cookList[i].isAdd) {
                    isAddNum = 1
                }
            }
            if(status.left_rest_time > 0 ) {
                restTime = parseInt(status.left_target_time / 60) + '分钟'
                if(parseInt(status.left_target_time / 3600)  > 0) {
                    restTime = parseInt(status.left_target_time / 3600) + '小时' + (parseInt(status.left_target_time / 60) - (parseInt(status.left_target_time / 3600) * 60)) + '分钟'
                }
                else if(status.left_target_time == 60) {
                    restTime = parseInt(status.left_target_time / 60) + '分钟'
                }
            }
            if(status.leftelec_rest_time > 0) {
                restTime = parseInt(status.leftelec_rest_time / 60) + '分钟'
                if(parseInt(status.leftelec_rest_time / 3600)  > 0) {
                    restTime = parseInt(status.leftelec_rest_time / 3600) + '小时' + (parseInt(status.leftelec_rest_time / 60) - (parseInt(status.leftelec_rest_time / 3600) * 60)) + '分钟'
                }
            }
            if(status.leftelec_work_time > 0) {
                workTimes = parseInt(status.leftelec_work_time / 60) + '分钟'
                if(parseInt(status.leftelec_work_time / 3600)  > 0) {
                    restTime = parseInt(leftelec_work_time / 3600) + '小时' + (parseInt(leftelec_work_time / 60) - (parseInt(leftelec_work_time / 3600) * 60)) + '分钟'
                }
            }

            var nowStatusStr = this.data.equipment[this.data.currentEquipment].fire
            var leftStatusStr = (status.left_status == 0 || status.left_elecmode == 'none') ? 'off' : 'on'
            var middleStatusStr = status.middle_status == 0 ? 'off' : 'on'
            var rightStatusStr = status.right_status == 0 ? 'off' : 'on'

            if(!this.data.isLoad) {
                this.init()
            } 
            else {
                if(nowStatusStr == 'off' && leftStatusStr == 'on') {
                    this.setData({
                        isLoad: false
                    })
                    if (queryTimer) clearTimeout(queryTimer);
                    this.query()
                }
                else if(nowStatusStr == 'off' && middleStatusStr == 'on') {
                    this.setData({
                        isLoad: false
                    })
                    if (queryTimer) clearTimeout(queryTimer);
                    this.query()
                }
                else if(nowStatusStr == 'off' && rightStatusStr == 'on') {
                    this.setData({
                        isLoad: false
                    })
                    if (queryTimer) clearTimeout(queryTimer);
                    this.query()
                }
            }

            this.setData({
                ...equipment,
                isCookmode: (status.left_cookmode == 'keep_temperature' || status.left_cookmode == 'order_keep_temperature' ) ? 'on' : 'off',
                isRightCookmode: (status.right_cookmode == 'keep_temperature' || status.right_cookmode == 'order_keep_temperature') ? 'on' : 'off',
                equipmentData: status,
                leftTargetTime: !!status.left_target_hours||!!status.left_target_minutes?`0${status.left_target_hours}:${status.left_target_minutes<10?`0${status.left_target_minutes}`:status.left_target_minutes}`:null,
                recipeRestTime: status.left_recipe_rest_time > 0 ? parseInt(status.left_recipe_rest_time / 60) + isAddNum : 0,
                restTime: restTime,
                rightRecipeRestTime: status.right_recipe_rest_time > 0 ? parseInt(status.right_recipe_rest_time / 60) + isAddNum  : 0,
                rightRestTime: status.right_rest_time > 0 ? parseInt(status.right_rest_time / 60) + isAddNum : 0,
                workTime: workTimes,
                isFirstLoad: false
            })
            this.triggerEvent('modeChange', this.getCurrentMode());

        },
        tempRendering(status) {
            if (!this.data.isCardActived) return false;
            if (queryTimer) clearTimeout(queryTimer);
            this.tempQuery(false)

            let leftWork = status.left_work_hours * 60 + status.left_work_minutes;
            if(status.left_work_hours == undefined) {
                if(parseInt(status.left_work_time / 3600) > 0) {
                    leftWork = parseInt(status.left_work_time / 3600) + '小时' + (parseInt(status.left_work_time / 60) - parseInt(status.left_work_time / 3600)*60) + '分钟'
                }
                else {
                    leftWork = parseInt(status.left_work_time / 60) + '分钟'
                }
            }
            let rightWork = status.right_work_hours * 60 + status.right_work_minutes;
            if(status.right_work_hours == undefined) {
                if(parseInt(status.right_work_time / 3600) > 0) {
                    rightWork = parseInt(status.right_work_time / 3600) + '小时' + (parseInt(right_work_time / 60) - (parseInt(status.right_work_time / 3600)*60)) + '分钟'
                }
                else {
                    rightWork = parseInt(status.right_work_time / 60) + '分钟'
                }
            }
            let middleWork = parseInt(status.middle_work_time / 60) + '分钟'
            if(parseInt(status.middle_work_time / 3600) > 0) {
                middleWork = parseInt(status.middle_work_time / 3600) + '小时' + (parseInt(status.middle_work_time / 60) - (parseInt(status.middle_work_time / 3600) * 60)) + '分钟'
            }
            
            let leftDelay = status.left_surplus_hours * 60 + status.left_surplus_minutes;
            let rightDelay = status.right_surplus_hours * 60 + status.right_surplus_minutes;
            if (status.left_surplus_hours == undefined || status.left_surplus_minutes == undefined) {
                leftDelay = 0
            }
            if(status.right_surplus_hours == undefined || status.right_surplus_minutes == undefined) {
                rightDelay = 0
            }
            let equipment = {
                '_applianceData.onlineStatus': '1',
                'equipment.left.fire': (status.left_status == 0 || status.left_elecmode == 'none') ? 'off' : 'on',
                'equipment.left.workHours': status.left_work_hours,
                'equipment.left.workMinutes': status.left_work_minutes,
                'equipment.left.workTime': leftWork >= 0 ? leftWork : 0,
                'equipment.left.delayPowerOff': leftDelay == 0 ? 'off' : 'on',
                'equipment.left.delayPowerOffTime': leftDelay,
                'equipment.left.left_cookmode': status.left_cookmode,
                'equipment.left.left_target_temperature': status.left_target_temperature,
                'equipment.left.left_rest_time': parseInt(status.left_rest_time / 60),
                'equipment.left.left_gear': status.left_gear,
                'equipment.left.surplusHours': status.left_surplus_hours,
                'equipment.left.surplusMinutes': status.left_surplus_minutes,
                'equipment.middle.fire': status.middle_status == 0 ? 'off' : 'on',
                'equipment.middle.workTime': middleWork, 
                'equipment.middle.middle_gear': status.middle_gear,
                'equipment.right.fire': status.right_status == 0 ? 'off' : 'on',
                'equipment.right.workHours': status.right_work_hours,
                'equipment.right.workMinutes': status.right_work_minutes,
                'equipment.right.workTime': rightWork >= 0 ? rightWork : 0,
                'equipment.right.delayPowerOff': rightDelay == 0 ? 'off' : 'on',
                'equipment.right.delayPowerOffTime': rightDelay,
                'equipment.right.right_cookmode': status.right_cookmode,
                'equipment.right.right_gear': status.right_gear,
                'equipment.right.surplusHours': status.right_surplus_hours,
                'equipment.right.surplusMinutes': status.right_surplus_minutes,
                'babyLock.mode': status.lock == 0 ? 'off' : 'on',
                'babyLock.show': status.lock == 0 || (status.left_status != 0 || status.right_status != 0), // 童锁只在未开启童锁且有点火状态时显示
            }
            var restTime = 0
            var workTimes = 0
            var isAddNum = 0
            for(var i = 0;i < this.data.cookList.length;i++) {
                if(this.data.currentEquipment == 'left' && status.left_recipe_id == this.data.cookList[i].code && !this.data.cookList[i].isAdd) {
                    isAddNum = 1
                }
                else if(this.data.currentEquipment == 'right' && status.left_recipe_id == this.data.cookList[i].code && !this.data.cookList[i].isAdd) {
                    isAddNum = 1
                }
            }
            if(status.left_rest_time > 0) {
                if(status.left_target_time == 60) {
                    restTime = parseInt(status.left_target_time / 60)
                }
                else {
                    restTime = parseInt(status.left_rest_time / 60)
                }
            }
            if(status.leftelec_rest_time > 0) {
                restTime = parseInt(status.leftelec_rest_time / 60)
            }
            if(status.leftelec_work_time > 0) {
                workTimes = parseInt(status.leftelec_work_time / 60)
            }

            this.setData({
                ...equipment,
                isCookmode: (status.left_cookmode == 'keep_temperature' || status.left_cookmode == 'order_keep_temperature' ) ? 'on' : 'off',
                isRightCookmode: (status.right_cookmode == 'keep_temperature' || status.right_cookmode == 'order_keep_temperature') ? 'on' : 'off',
                equipmentData: status,
                recipeRestTime: status.left_recipe_rest_time > 0 ? parseInt(status.left_recipe_rest_time / 60)+ isAddNum: 0,
                restTime: restTime + isAddNum,
                rightRecipeRestTime: status.right_recipe_rest_time > 0 ? parseInt(status.right_recipe_rest_time / 60)+ isAddNum : 0,
                rightRestTime: status.right_rest_time > 0 ? parseInt(status.right_rest_time / 60)+ isAddNum : 0,
                workTime: workTimes
            })
            if(!this.data.isLoad) {
                this.init()
            } 
            this.triggerEvent('modeChange', this.getCurrentMode());
        },
        _formatNumber(n) {
            n = n.toString()
            return n[1] ? n : '0' + n
        },
        _getWorkBurnerControl() {
            let work_burner_control = 3;
            if (this.data.currentEquipment === 'left') {
                work_burner_control = 1;
            } else if (this.data.currentEquipment === 'right') {
                work_burner_control = 2;
            }
            return work_burner_control;
        },
        // 切换当前标签页
        currentEquipmentToggle(e) {
            const eq = e.currentTarget.dataset.id;
            if (eq === this.data.currentEquipment) return false;
            this.setData({currentEquipment: eq})
            this.init()
        },
        powerOff() {
            var isLeftelec = this.data.detailData[this.data.currentEquipment].isTime != undefined ? true : false
            const eq = isLeftelec ? 'leftelec' : this.data.currentEquipment
            wx.showModal({
                title: '提示',
                content: `请确定<${this.data.detailData[eq].name}>直接关火？`,
                success: (res) => {
                    if (res.confirm) {
                        this.requestControl({
                            eq: eq,
                            power: 'off'
                        })
                        pluginEventTrack('user_behavior_event', null, {
                            page_id: 'page_control',
                            page_name: '插件首页',
                            widget_id: 'click_power',
                            widget_name: '关火',
                            ext_info: `${eq == 'left' || eq == 'leftelec' ? '左灶' : '右灶'}`
                        })
                    } else if (res.cancel) {

                    }
                }  
            })
        },
        allPowerOff() {
            wx.showModal({
                title: '提示',
                content: `请确定全部灶直接关火？`,
                success: (res) => {
                    if (res.confirm) {
                        this.requestControl({
                            eq: 'all',
                            power: 'off'
                        })
                        pluginEventTrack('user_behavior_event', null, {
                            page_id: 'page_control',
                            page_name: '插件首页',
                            widget_id: 'click_power',
                            widget_name: '关火',
                            ext_info: '全部'
                        })
                    } else if (res.cancel) {

                    }
                }  
            })
        },

        delayPowerOffCancel() {
            var that = this
            wx.showModal({
                title: '提示',
                content: `请确定取消<${that.data.detailData[that.data.currentEquipment].name}>定时关机？`,
                success: (res) => {
                    if (res.confirm) {
                        var isLeftelec = that.data.detailData[that.data.currentEquipment].name === '电磁炉' ? true : false
                        var exCookMode = 'order'
                        if(that.data.currentEquipment === 'left') {
                            exCookMode = that.data.equipment[that.data.currentEquipment].left_cookmode ? that.data.equipment[that.data.currentEquipment].left_cookmode : that.data.equipmentData.leftelec_cookmode
                        }
                        else if(that.data.currentEquipment === 'right') {
                            exCookMode = that.data.equipment[that.data.currentEquipment].right_cookmode
                        }

                        if(exCookMode === 'order_keep_temperature') {
                            let eq = that.data.currentEquipment
                            that.tempRequestControl({
                                eq: eq,
                                ex_cookmode: "order_keep_temperature",
                                cookmode: "default"
                            })
                            pluginEventTrack('user_behavior_event', null, {
                                page_id: 'page_control',
                                page_name: '插件首页',
                                widget_id: 'click_keep_temperature',
                                widget_name: '定温',
                                ext_info: `${eq == 'left'?'左灶':'右灶'}取消`
                            })
                            // that.requestControl({
                            //     eq: that.data.currentEquipment,
                            //     cookmode: 'default',
                            //     ex_cookmode: 'order'
                            // })
                        }
                        else {
                            // that.requestControl({
                            //     eq: isLeftelec ? 'leftelec' : that.data.currentEquipment,
                            //     ex_cookmode: exCookMode,
                            //     cookmode: "default",
                            // })
                            let eq = isLeftelec ? 'leftelec' : that.data.currentEquipment
                            that.tempRequestControl({
                                eq: eq,
                                ex_cookmode: "order",
                                cookmode: "default"
                            })
                            pluginEventTrack('user_behavior_event', null, {
                                page_id: 'page_control',
                                page_name: '插件首页',
                                widget_id: 'click_order',
                                widget_name: '定时关火',
                                ext_info: `${eq == 'left'||eq == 'leftelec'?'左灶':'右灶'}取消`
                            })
                        }
                        that.setData({
                            isLoad: false
                        })
                    } 
                    else if (res.cancel) {

                    }
                }  
            })
        },
        // 多选更改确定时 发送预约关火指令到设备
        delayPowerOffSubmit(e) {
            const hour = e.detail[0];
            const minutes = e.detail[2];
            const eq = this.data.currentEquipment;
            var isLeftelec = this.data.detailData[this.data.currentEquipment].name === '电磁炉' ? true : false
            if (!hour && !minutes) {
                return wx.showToast({ title: '请选择正确的预约关火时间', icon: 'none', duration: 2000 });
                // this.powerOff();// 询问是否立即关火
            }
            else if(this.data.detailData[this.data.currentEquipment].hasOneKeyCook && (this.data.equipmentData.left_cookmode == 'local_recipe' || this.data.equipmentData.left_cookmode == 'cloud_recipe') && this.data.currentEquipment == 'left'){
                this.setData({
                    hours: hour,
                    minutes: minutes,
                    isLoad: false
                })
                var that = this
                wx.showModal({
                    title: '退出一键烹',
                    content: `<${this.data.equipment[eq].name}>需要退出一键烹才能设置定时关火`,
                    success(res) {
                        if (res.confirm) {
                            that.timeRequedtControl({
                                eq: eq,
                                ex_cookmode: that.data.equipmentData.left_cookmode,
                                cookmode: 'default'
                            })
                            pluginEventTrack('user_behavior_event', null, {
                                page_id: 'page_control',
                                page_name: '插件首页',
                                widget_id: 'click_onekey_cook',
                                widget_name: '一键烹饪',
                                ext_info: `${eq == 'left'?'左灶':'右灶'}取消`
                            })
                        } 
                    }
                })
            }
            else if(this.data.detailData[this.data.currentEquipment].hasOneKeyCook && this.data.currentEquipment == 'right' && (this.data.equipmentData.right_cookmode == 'local_recipe' || this.data.equipmentData.right_cookmode == 'cloud_recipe')) {
                this.setData({
                    hours: hour,
                    minutes: minutes,
                    isLoad: false
                })
                var that = this
                wx.showModal({
                    title: '退出一键烹',
                    content: `<${this.data.equipment[eq].name}>需要退出一键烹才能设置定时关火`,
                    success(res) {
                        if (res.confirm) {
                            that.timeRequedtControl({
                                eq: that.data.currentEquipment,
                                ex_cookmode: that.data.equipmentData.right_cookmode,
                                cookmode: 'default'
                            })
                            pluginEventTrack('user_behavior_event', null, {
                                page_id: 'page_control',
                                page_name: '插件首页',
                                widget_id: 'click_onekey_cook',
                                widget_name: '一键烹饪',
                                ext_info: `${eq == 'left'?'左灶':'右灶'}取消`
                            })
                        } 
                    }
                })
            }
            else if (this.data.detailData[this.data.currentEquipment].hasOrderFixedTemp) {
                var cookMode = 'order'
                if(this.data.currentEquipment == 'left') {
                    cookMode = this.data.isCookmode == 'on' ? 'order_keep_temperature' : 'order'
                }
                else {
                    cookMode = this.data.isRightCookmode == 'on' ? 'order_keep_temperature' : 'order'
                }      
                wx.showModal({
                    title: '提示',
                    content: `请确定<${this.data.equipment[eq].name}>定时关火？`,
                    success: res => {
                        if(res.confirm) {
                            const eq = this.data.currentEquipment;
                            this.requestControl({
                                eq: eq,
                                target_time: hour * 3600 + minutes * 60,
                                cookmode: cookMode,
                                work_burner_control: this._getWorkBurnerControl(),
                                function_control: 4, // 定时关机
                                [`${eq}_surplus_hours`]: hour,
                                [`${eq}_surplus_minutes`]: minutes,
                            })
                            pluginEventTrack('user_behavior_event', null, {
                                page_id: 'page_control',
                                page_name: '插件首页',
                                widget_id: 'click_order',
                                widget_name: '定时关火',
                                ext_info: `${eq == 'left'?'左灶':'右灶'}定时${hour}小时${minutes}分钟`
                            })
                            this.setData({
                                isLoad: false
                            })
                        }
                    },
                })
            }
            else if(this.data.isCookmode == 'on' || this.data.isRightCookmode == 'on'){
                this.setData({
                    hours: hour,
                    minutes: minutes,
                    isLoad: false
                })
                wx.showModal({
                    title: '提示',
                    content: `请确定<${this.data.equipment[eq].name}>退出定温？`,
                    success: res => {
                        if(res.confirm) {
                            this.timeRequedtControl({
                                eq: eq,
                                ex_cookmode: this.data.equipmentData.left_cookmode,
                                cookmode: 'default'
                            })
                            pluginEventTrack('user_behavior_event', null, {
                                page_id: 'page_control',
                                page_name: '插件首页',
                                widget_id: 'click_keep_temperature',
                                widget_name: `${eq == 'left' || eq == 'leftelec' ? '左灶' : '右灶'}定温`,
                                ext_info: '退出定温'
                              })
                        }
                        else if (res.cancel) {
                                
                        }
                    },
                })
            }
            else {
                wx.showModal({
                    title: '提示',
                    content: `请确定<${this.data.detailData[eq].name}>定时关火？`,
                    success: res => {
                        if(res.confirm) {
                            const eq = isLeftelec ? 'leftelec' : this.data.currentEquipment;
                            this.requestControl({
                                eq: eq,
                                target_time: hour * 3600 + minutes * 60,
                                cookmode:'order',
                                work_burner_control: this._getWorkBurnerControl(),
                                function_control: 4, // 定时关机
                                [`${eq}_surplus_hours`]: hour,
                                [`${eq}_surplus_minutes`]: minutes,
                            })
                            pluginEventTrack('user_behavior_event', null, {
                                page_id: 'page_control',
                                page_name: '插件首页',
                                widget_id: 'click_order',
                                widget_name: '定时关火',
                                ext_info: `${eq == 'left'||eq == 'leftelec'?'左灶':'右灶'}${hour}小时${minutes}分钟`
                            })
                            this.setData({
                                isLoad: false
                            })
                        }
                    },
                })
            }
        },

        // 点击童锁按钮
        babyLockToggleBtn() {
            if (this.data.babyLock.mode === 'on') {
                this.checkBabyLockOff();
            } else {
                this.babyLockToggle('on')
            }
        },
        // 检查童锁是否关闭状态，若不是，发送关闭童锁请求
        checkBabyLockOff() {
            // return new Promise((resolve, reject) => {
            //     if (this.data.babyLock.mode === 'off') {
            //         resolve()
            //     } 
            //     else {
            //         wx.showModal({
            //             title: '童锁提示',
            //             content: '童锁开启中，确定关闭童锁？',
            //             success: res => {
            //                 if (res.confirm) {
            //                     this.babyLockToggle('off');
            //                 } else if (res.cancel) {
                                
            //                 }
            //                 reject()
            //             }  
            //         })
            //     }
            // })
        },
        // 发送童锁开关请求
        babyLockToggle(mode) {
            return this.requestControl({
                work_burner_control: 3, // 操控类型，同时操作左右灶
                lock: mode === 'off' ? 0 : 1
            }).then(() => {
                pluginEventTrack('user_behavior_event', null, {
                    page_id: 'page_control',
                    page_name: '插件首页',
                    widget_id: 'click_lock',
                    widget_name: '童锁',
                    ext_info: mode === 'off' ? '关' : '开'
                })
              const status = 
                this.setData({
                    'babyLock.mode': mode,
                    'babyLock.show': mode === 'off' || (this.data._applianceDataStatus.left_status != 0 || this.data._applianceDataStatus.right_status != 0), // 童锁只在未开启童锁且有点火状态时显示
                });
            })
        },
        modifyButtonClicked(e) {
            var temp = this.data.targtTemperature
            var cookMode = 'keep_temperature'
            if(this.data.currentEquipment === 'left' && ( this.data.equipment[this.data.currentEquipment].left_cookmode == 'order' || this.data.equipment[this.data.currentEquipment].left_cookmode == 'order_keep_temperature')) {
                cookMode = 'order_keep_temperature'
            }
            else if(this.data.currentEquipment === 'right' && (this.data.equipment[this.data.currentEquipment].right_cookmode == 'order' || this.data.equipment[this.data.currentEquipment].right_cookmode == 'order_keep_temperature')) {
                cookMode = 'order_keep_temperature'
            }
            this.tempRequestControl({
                eq: this.data.currentEquipment,
                cookmode: cookMode,
                target_temperature: temp
            })
            pluginEventTrack('user_behavior_event', null, {
                page_id: 'page_control',
                page_name: '插件首页',
                widget_id: 'click_keep_temperature',
                widget_name: '定温',
                ext_info: `${this.data.currentEquipment == 'left'?'左灶':'右灶'}定温${temp}°C`
            })  
        },
        cancleButtonClicked(e) {
            let eq = this.data.currentEquipment
            wx.showModal({
                title: '退出定温',
                content: `是否结束<${this.data.equipment[eq].name}>定温？`,
                success(res) {
                    if (res.confirm) {
                        that.tempRequestControl({
                            eq: eq,
                            cookmode: 'default',
                            ex_cookmode: 'keep_temperature'
                        })
                        pluginEventTrack('user_behavior_event', null, {
                            page_id: 'page_control',
                            page_name: '插件首页',
                            widget_id: 'click_keep_temperature',
                            widget_name: '定温',
                            ext_info: `${eq=='left'?'左灶':'右灶'}取消`
                        })
                    } 
                    else if (res.cancel) { }
                }
            })
        },
        itemClicked: function(e) {
            var selectNum = parseInt(e.currentTarget.id)
            var newTemperature = this.data.foodList[selectNum].value
            this.setData({
                selectItem: selectNum,
                targtTemperature: newTemperature
            })
        },
        sliderChange: function(e) {
            this.setData({
                targtTemperature: e.detail.value,
                selectItem: -1,
            })
        },
        cancleTemp: function(){
            this.setData({
                isTemperatureScenarioPage: false
            })
        },
        // 初始化加载动画
        init() {
            // var that = this
            // require('../../T0xB6/card/assets/js/index.js', lottie => {
            //     console.log(lottie, '=====');
            //     that.initLottie(lottie)
            // })
            // let self=this
            // require('../../../sub-package/common-package/js/lottie-miniprogram/index', lottie => {
            //     console.log(lottie);
            //     self.initLottie(lottie)
            // })
        },
        initLottie(lotties) {
            let that = this
            let query = wx.createSelectorQuery();
            query.in(this).select('#lottie_demo').node(res => {
                const canvas = res.node
                const context = canvas.getContext('2d')
                const dpr = wx.getSystemInfoSync().pixelRatio
                canvas.width = 750 * dpr
                canvas.height = 750 * dpr
                context.scale(dpr, dpr)
                lotties.setup(canvas)
                lotties.loadAnimation({
                    loop: true,
                    autoplay: true,
                    path: `${images.b7DataJSON}`,
                    rendererSettings: {
                        context,
                    },
                })
            }).exec();
            that.setData({
                isLoad: true
            })
        },        
        clickToSetTemperature(e) {
            var that = this
            var cookMode = 'keep_temperature'
            var targetTemperature = 0
            let eq = this.data.currentEquipment
            if(that.data.currentEquipment === 'left') {
                targetTemperature = this.data.equipmentData.left_target_temperature
            }else if(that.data.currentEquipment === 'middle') {
                targetTemperature = this.data.equipmentData.middle_target_temperature
            }else if(that.data.currentEquipment === 'right') {
                targetTemperature = this.data.equipmentData.right_target_temperature
            }
            if(that.data.currentEquipment === 'left' && ( that.data.equipment[that.data.currentEquipment].left_cookmode == 'order' || that.data.equipment[that.data.currentEquipment].left_cookmode == 'order_keep_temperature')) {
                cookMode = 'order_keep_temperature'
            }
            else if(that.data.currentEquipment === 'right' && (that.data.equipment[that.data.currentEquipment].right_cookmode == 'order' || that.data.equipment[that.data.currentEquipment].right_cookmode == 'order_keep_temperature')) {
                cookMode = 'order_keep_temperature'
            }

            if(that.data.detailData[that.data.currentEquipment].hasOrderFixedTemp) {
                if((that.data.equipmentData.left_cookmode === 'local_recipe' || that.data.equipmentData.left_cookmode === 'cloud_recipe') && that.data.currentEquipment == 'left') {
                    wx.showModal({
                        title: '退出一键烹',
                        content: `<${this.data.equipment[eq].name}>需要退出一键烹才能设置定温`,
                        success(res) {
                            if (res.confirm) {
                                that.tempRequestControl({
                                    eq: eq,
                                    ex_cookmode: that.data.equipmentData.left_cookmode,
                                    cookmode: 'default'
                                })
                                pluginEventTrack('user_behavior_event', null, {
                                    page_id: 'page_control',
                                    page_name: '插件首页',
                                    widget_id: 'click_onekey_cook',
                                    widget_name: '一键烹饪',
                                    ext_info: `${eq == 'left'?'左灶':'右灶'}取消`
                                })
                                that.setData({
                                    isLoad: false
                                })
                            } 
                        }
                    })
                }
                else if( that.data.currentEquipment == 'right' && (that.data.equipmentData.right_cookmode == 'local_recipe' || that.data.equipmentData.right_cookmode == 'cloud_recipe')) {
                    wx.showModal({
                        title: '退出一键烹',
                        content: `<${this.data.equipment[eq].name}>需要退出一键烹才能设置定温`,
                        success(res) {
                            if (res.confirm) {
                                that.tempRequestControl({
                                    eq: eq,
                                    ex_cookmode: that.data.equipmentData.right_cookmode,
                                    cookmode: 'default'
                                })
                                pluginEventTrack('user_behavior_event', null, {
                                    page_id: 'page_control',
                                    page_name: '插件首页',
                                    widget_id: 'click_onekey_cook',
                                    widget_name: '一键烹饪',
                                    ext_info: `${eq == 'left'?'左灶':'右灶'}取消`
                                })
                                that.setData({
                                    isLoad: false
                                })
                            } 
                        }
                    })
                }
                else {
                    wx.navigateTo({
                        url: '../setTemperature/temperature?currentEquipment=' + that.data.currentEquipment + '&cookMode=' + cookMode + '&applianceCode=' + that.properties.applianceData.applianceCode + '&isCookmode=' + that.data.isCookmode + '&isRightCookmode=' + that.data.isRightCookmode,
                    })
                }
            }
            else if(that.data.equipment[that.data.currentEquipment].delayPowerOff === 'on' || that.data.equipment[that.data.currentEquipment].left_cookmode === 'order') {
                wx.showModal({
                    title: '退出定时',
                    content: `<${this.data.equipment[eq].name}>需要退出定时才能设置定温`,
                    success(res) {
                        if (res.confirm) {
                            that.tempRequestControl({
                                eq: eq,
                                ex_cookmode: "order",
                                cookmode: "default"
                                // work_burner_control: that._getWorkBurnerControl(),
                                // function_control: 5, // 取消定时关机
                            })
                            pluginEventTrack('user_behavior_event', null, {
                                page_id: 'page_control',
                                page_name: '插件首页',
                                widget_id: 'click_order',
                                widget_name: '定时关火',
                                ext_info: `${eq=='left'?'左灶':'右灶'}取消`
                            })
                            that.setData({
                                isLoad: false
                            })
                        } 
                    }
                })
            }
            else if(that.data.detailData[that.data.currentEquipment].hasOneKeyCook && (that.data.equipmentData.left_cookmode === 'local_recipe' || that.data.equipmentData.left_cookmode === 'cloud_recipe') && that.data.currentEquipment == 'left'){
                wx.showModal({
                    title: '退出一键烹',
                    content: `<${this.data.equipment[eq].name}>需要退出一键烹才能设置定温`,
                    success(res) {
                        if (res.confirm) {
                            that.tempRequestControl({
                                eq: eq,
                                ex_cookmode: that.data.equipmentData.left_cookmode,
                                cookmode: 'default'
                            })
                            pluginEventTrack('user_behavior_event', null, {
                                page_id: 'page_control',
                                page_name: '插件首页',
                                widget_id: 'click_onekey_cook',
                                widget_name: '一键烹饪',
                                ext_info: `${eq == 'left'?'左灶':'右灶'}取消`
                            })
                            that.setData({
                                isLoad: false
                            })
                        } 
                    }
                })
            }
            else if(that.data.detailData[that.data.currentEquipment].hasOneKeyCook && that.data.currentEquipment == 'right' && (that.data.equipmentData.right_cookmode == 'local_recipe' || that.data.equipmentData.right_cookmode == 'cloud_recipe')) {
                wx.showModal({
                    title: '退出一键烹',
                    content: `<${this.data.equipment[eq].name}>需要退出一键烹才能设置定温`,
                    success(res) {
                        if (res.confirm) {
                            that.tempRequestControl({
                                eq: eq,
                                ex_cookmode: that.data.equipmentData.right_cookmode,
                                cookmode: 'default'
                            })
                            pluginEventTrack('user_behavior_event', null, {
                                page_id: 'page_control',
                                page_name: '插件首页',
                                widget_id: 'click_onekey_cook',
                                widget_name: '一键烹饪',
                                ext_info: `${eq == 'left'?'左灶':'右灶'}取消`
                            })
                            that.setData({
                                isLoad: false
                            })
                        } 
                    }
                })
            }
            else {
                wx.navigateTo({
                    url: '../setTemperature/temperature?currentEquipment=' + that.data.currentEquipment + '&cookMode=' + cookMode + '&applianceCode=' + that.properties.applianceData.applianceCode + '&isCookmode=' + that.data.isCookmode + '&isRightCookmode=' + that.data.isRightCookmode + '&targetTemperature=' + targetTemperature,
                })
            }
        }
    },
    attached() {
        var app = getApp();
        let arr = [];
        for (let i = 0; i<60; i++){arr.push(i);}
        const setting = getSetting(this.properties.applianceData.sn8);
        var isAllBtn = 0
        if(setting.right) {
            isAllBtn = setting.right.btns.indexOf('PowerBtnAll')
        }
        console.log(this.data.equipmentData),
        this.setData({
            uid: app.globalData.userData.uid,
            _applianceData: this.properties.applianceData,
            'multiArray[2]': arr, // 初始化秒数
            detailData: setting,
            isRightAllBtn: isAllBtn != -1 ? true : false
        })
    },
    pageLifetimes: {
        show: function() {
          // 页面被展示
          if (queryTimer) {
            console.log('show')
            clearTimeout(queryTimer);
            this.setData({
                isLoad: false
            })
            this.query(false)
          }
        },
        hide: function() {
          // 页面被隐藏
          console.log('hide')
        }
    }
});
