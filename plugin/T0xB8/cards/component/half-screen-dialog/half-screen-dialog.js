

import { VC_WORK_STATE, VC_SN8_MAP } from '../../utils/vcutils'
Component({
    options: {
        multipleSlots: true,
        addGlobalClass: true
    },
    properties: {
        closabled: {
            type: Boolean,
            value: true
        },
        title: {
            type: String,
            value: ''
        },
        subTitle: {
            type: String,
            value: ''
        },
        extClass: {
            type: String,
            value: ''
        },
        desc: {
            type: String,
            value: ''
        },
        tips: {
            type: String,
            value: ''
        },
        maskClosable: {
            type: Boolean,
            value: true
        },
        mask: {
            type: Boolean,
            value: true
        },
        show: {
            type: Boolean,
            value: false,
            observer: '_showChange'
        },
        buttons: {
            type: Array,
            value: []
        },
        suctionLevel: {
            type: String,
            value: "low"
        },
        waterLevel: {
            type: String,
            value: "low"
        },
        modeType: {
            type: String,
            value: "4_mode_zigzag_tag"
        },
        suctionBtnList: {
            type: Array,
            value: []
        },
        waterBtnList: {
            type: Array,
            value: []
        },
        cleanModeBtnList: {
            type: Array,
            value: []
        },
        devState: {
            type: Object,
            value: {}
        },
        panelType: {
            type: String,
            value: ""
        },
    },
    data: {
        suctionTag: "轻柔",
        waterLevel: "低速",
        modeType: "4_mode_zigzag_tag",
        modeTag: "全屋（弓形）清扫",
        modeTagInfo: "自动识别整体房屋区域，并完成清扫",
        suctionDataMap: {
            low: "安静",
            soft: "轻柔",
            normal: "标准",
            high: "强力",
            off:"轻柔"//w11
        },
        waterDataMap: {
            off: "干拖",
            low: "低速",
            normal: "标准",
            high: "高速",
        },
        cleanModeMap: {
            "4_mode_zigzag_tag": "全屋（弓形）清扫",
            "5_mode_edge_tag": "边角（沿边）清扫",
            "6_mode_area_tag": "区域（重点）清扫",
        },
        cleanModeInfoMap: {
            "4_mode_zigzag_tag": "自动识别整体房屋区域，并完成清扫",
            "5_mode_edge_tag": "自动识别房屋边角，并完成清扫",
            "6_mode_area_tag": "自动清扫1m*1m的范围区域",
        },
        workModeMap: {
            "4_mode_zigzag_tag": "arc",
            "5_mode_edge_tag": "edge",
            "6_mode_area_tag": "area",
        },
        disabled: "",//充电中或者充电完成,区域清扫置灰
        cur_level_type:''
    },
    attached: function () {
        this.setData({
            suctionLevel: this.suctionLevel,
            waterLevel: this.waterLevel,
            panelType: this.panelType,
            modeType: this.modeType
        })
    },
    observers: {
        'suctionLevel, waterLevel,modeType,devState': function (suctionLevel, waterLevel, modeType, devState) {
            //充电中或者充电完成,区域清扫置灰

            //m6档位特殊化
            if (VC_SN8_MAP[this.data.devState.sn8] == "m6") {
                this.data.suctionDataMap = {
                    low: "安静",
                    soft: "标准",
                    normal: "强力",
                };
            }

            let forbid = "";
            if (devState.status == VC_WORK_STATE.workstate_charging ||
                devState.status == VC_WORK_STATE.workstate_chargingComplete ||
                devState.status == VC_WORK_STATE.workstate_chargewithline) {
                forbid = "forbid-area-clean";
            }
            this.data.cleanModeBtnList.forEach(function (o) {
                if (o.value == "6_mode_area_tag") {
                    o.status = forbid;
                }
            })
            this.setData({
                suctionTag: this.data.suctionDataMap[suctionLevel],
                waterTag: this.data.waterDataMap[waterLevel],
                modeTag: this.data.cleanModeMap[modeType],
                modeTagInfo: this.data.cleanModeInfoMap[modeType],
                disabled: this.data.disabled,
                cleanModeBtnList: this.data.cleanModeBtnList
            })
        }
    },
    methods: {
        close: function close(e) {
            var type = e.currentTarget.dataset.type;

            if (this.data.maskClosable || type === 'close') {
                this.setData({
                    show: false
                });
                this.triggerEvent('close');
            }
        },
        buttonTap: function buttonTap(e) {
            var index = e.currentTarget.dataset.index;

            this.triggerEvent('buttontap', { index: index, item: this.data.buttons[index] }, {});
        },
        startwork(e) {
            this.triggerEvent('startwork', { mode: this.data.devState.mode, suctionLevel: this.data.suctionLevel, waterLevel: this.data.waterLevel,cur_level_type:this.data.cur_level_type,devState:this.data.devState.status  }, {});
        },
        switchlevel(e) {
            this.triggerEvent('switchlevel', { mode: this.data.devState.mode, suctionLevel: this.data.suctionLevel, waterLevel: this.data.waterLevel,cur_level_type:this.data.cur_level_type  }, {});
        },
        toggolpreference() {
            this.triggerEvent('toggolpreference', { mode: this.data.devState.mode, suctionLevel: this.data.suctionLevel, waterLevel: this.data.waterLevel,cur_level_type:this.data.cur_level_type,devState:this.data.devState.status  }, {});
        },
        toggelSuction(e) {
            this.data.suctionLevel = e.currentTarget.dataset.value;
            this.data.cur_level_type = "suctionLevel";
            if (this.data.devState.status == "work" || this.data.devState.status=="map_searching") {
                wx.removeStorageSync('suctionLevel');
                wx.removeStorageSync('waterLevel');

                if (this.data.devState.sn8 == "7500047M") {
                    this.toggolpreference();
                }
                
                this.startwork();
            }
            else {
                wx.setStorageSync('suctionLevel', this.data.suctionLevel);
                this.toggolpreference();
            }

            this.setData({
                suctionTag: this.data.suctionDataMap[this.data.suctionLevel],
                suctionLevel: this.data.suctionLevel
            });

        },
        toggelWater(e) {
            this.data.waterLevel = e.currentTarget.dataset.value;
            this.data.cur_level_type = "waterLevel";
            if (this.data.devState.status == "work" || this.data.devState.status=="map_searching") {
                wx.removeStorageSync('suctionLevel');
                wx.removeStorageSync('waterLevel');
                if (this.data.devState.sn8 == "7500047M") {
                    this.toggolpreference();
                }
                
                this.startwork();
            }
            else {
                wx.setStorageSync('waterLevel', this.data.waterLevel);
                this.toggolpreference();
            }

            this.setData({
                waterTag: this.data.waterDataMap[this.data.waterLevel],
                waterLevel: this.data.waterLevel
            });
        },
        toggelMode(e) {
            if (!e.currentTarget.dataset.status) {
                this.data.modeType = e.currentTarget.dataset.value;

                this.setData({
                    modeTag: this.data.cleanModeMap[this.data.modeType],
                    modeTagInfo: this.data.cleanModeInfoMap[this.data.modeType],
                    modeType: this.data.modeType,
                });

                this.triggerEvent('buttonTap', {
                    tagindex: this.data.modeType
                }, {});
            }

        }
    }
});
