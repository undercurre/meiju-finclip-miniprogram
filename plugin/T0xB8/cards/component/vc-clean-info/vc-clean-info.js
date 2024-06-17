import { VC_WORK_STATE, VC_WROK_MODE, VC_IMAGE_ROOT_URL } from '../../utils/vcutils'
//const tempImage = "http://127.0.0.1:5500/";
Component({
    properties: {// 这里定义了innerText属性，属性值可以在组件使用时指定
        /**扫地机状态 */
        propDevStatus: {
            type: Object,
            value: {
                status: VC_WORK_STATE.workstate_standby,
                mode: VC_WROK_MODE.workmode_zigzag,
                cleanArea: 0,
                cleanTime: 0,
                sn8: 0
            },
            observer: function (newVal, oldVal) {
                if (newVal.status == oldVal.status
                    && newVal.mode == oldVal.mode
                    && newVal.cleanArea == oldVal.cleanArea
                    && newVal.cleanTime == oldVal.cleanTime) {
                    return
                }
                var ca = newVal.cleanArea
                var ct = newVal.cleanTime
                var workStatus = newVal.status
                var mode = newVal.mode
                var sn8 = newVal.sn8
                /**工作模式时显示 */
                if (workStatus == VC_WORK_STATE.workstate_work || workStatus == VC_WORK_STATE.workstate_work_w11|| workStatus == VC_WORK_STATE.workstate_pause || workStatus == VC_WORK_STATE.workstate_pause_w11) {
                    this.setData({
                        showClose: false,
                        lastCleanTitle: "已清洁"
                    })
                } else {
                    this.setData({
                        showClose: true,
                        lastCleanTitle: "已完成清扫"
                    })
                }

                if (mode == VC_WROK_MODE.workmode_zigzag || mode == VC_WROK_MODE.workmode_auto
                    || mode == VC_WROK_MODE.workmode_zone_rect || mode == VC_WROK_MODE.workmode_zone_index) {
                    this.setData({
                        timeVal: ct.toString()
                    })
                    if (sn8 == '7500046X' || sn8 == '000VR100' || sn8 == '7500047T' || sn8 == '7500047S') {
                        this.setData({
                            areaVal: '--'
                        })
                    } else {
                        this.setData({
                            areaVal: ca.toString()
                        })
                    }
                } else if (mode == VC_WROK_MODE.workmode_area) {
                    this.setData({
                        areaVal: '--'
                    })
                    this.setData({
                        timeVal: ct.toString()
                    })
                } else if (mode == VC_WROK_MODE.workmode_edge) {
                    if (this.properties.propCleanTime == 0) {
                        this.setData({
                            timeVal: '--'
                        })
                    } else {
                        this.setData({
                            timeVal: ct.toString()
                        })
                    }
                    this.setData({
                        areaVal: '--'
                    })
                } else {
                    this.setData({
                        areaVal: !!ca?ca.toString():'--'
                    })
                    this.setData({
                        timeVal: !!ct?ct.toString():'--'
                    })
                }
            }
        }
    },
    data: {
        cleanAreaTitle: '清扫面积',
        cleanTimeTitle: '清扫时间',
        timeUnit: 'min',
        areaUnit: '㎡',
        areaVal: '0',
        timeVal: '0',
        sn8: '',
        show: true,
        lastCleanTitle: '已完成清扫',
        closeCleanUrl: VC_IMAGE_ROOT_URL + 'vc-close-clean-info.png',
        showCleanInfo: '',
        showClose: true
    },
    methods: {
        closeCleanInfo() {
            this.setData({
                showCleanInfo: 'opacity0'
            })
        }
    },
    lifetimes: {
        attached: function () {
            this.setData({
                showClose: true
            })
        }
    },
})