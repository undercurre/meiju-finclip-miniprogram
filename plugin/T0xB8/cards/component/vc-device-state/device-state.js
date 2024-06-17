import { VC_WORK_STATE, VC_IMAGE_ROOT_URL, VC_SN8_MAP } from '../../utils/vcutils'
Component({
    properties: {// 这里定义了innerText属性，属性值可以在组件使用时指定
        propShowError: {
            type: Boolean,
            value: false,
            observer: function (newVal, oldVal) {
                if (oldVal) {
                    this.setData({
                        showError: false
                    })
                }
                else {
                    this.setData({
                        showError: true
                    })
                }

            }
        },
        propBatteryUrls: {
            type: Object
        },
        propStateImgs: {
            type: Object
        },
        propTitles: {
            type: Object
        },
        propChargeImg: {
            type: String,
            value: ''
        },
        propDevStatus: {
            type: Object,
            value: {
                hasError: false
            },
            observer: function (newVal, oldVal) {
                // if (newVal.hasError) {
                //     this.setData({
                //         showError: true
                //     })
                // }
                // else {
                //     this.setData({
                //         showError: false
                //     })
                // }

                if (!!newVal.subStatus) {
                    if ((oldVal.status == newVal.status && oldVal.subStatus == newVal.subStatus)
                        && oldVal.mode == newVal.mode
                        && oldVal.battery == newVal.battery
                        && oldVal.hasError == newVal.hasError
                        && oldVal.isMopClean == newVal.isMopClean) {
                        if (newVal.status != "relocate") {
                            wx.hideLoading()
                        }

                        return;
                    }
                }
                else {
                    if ((oldVal.status == newVal.status)
                        && oldVal.mode == newVal.mode
                        && oldVal.battery == newVal.battery
                        && oldVal.hasError == newVal.hasError
                        && oldVal.isMopClean == newVal.isMopClean) {
                        if (newVal.status != "relocate") {
                            wx.hideLoading()
                        }

                        return;
                    }
                }


                var status = newVal.status;

                var subStatus = newVal.subStatus;

                var battery = newVal.battery;
                var isMopClean = newVal.isMopClean; //i3pro专用
                var isDevCharge = false;
                /**更新电池图 */
                if (status == VC_WORK_STATE.workstate_charging ||
                    status == VC_WORK_STATE.workstate_chargingComplete ||
                    status == VC_WORK_STATE.workstate_chargewithline) {
                    isDevCharge = true;
                }
                //w11
                if (!!subStatus) {
                    if (subStatus == VC_WORK_STATE.workstate_charging_w11&& status==VC_WORK_STATE.workstate_on_base_w11) {
                        isDevCharge = true;
                    }
                }
                /**是否显示充电状态 */
                // this.setData({
                //     isCharge:isDevCharge
                // })

                // if(battery >= 0 && battery <= 10){

                //     if(isDevCharge){

                //         this.setData({
                //             chargeImgUrl:this.properties.propBatteryUrls.zeroCharge
                //         });
                //     }else{
                //         this.setData({
                //             chargeImgUrl:this.properties.propBatteryUrls.zeroUnCharge
                //         });
                //     }
                //     if(this.data.hasShowPer10Warn == false && isDevCharge == false){
                //         this.triggerEvent('warning10');
                //         this.setData({
                //             hasShowPer10Warn:true
                //         })
                //     }
                // }else if(battery > 10 && battery <= 20){

                //     this.setData({
                //         chargeImgUrl:this.properties.propBatteryUrls.quarter
                //     });
                //     /**重置 hasShowPer10Error错误*/
                //     this.setData({
                //         hasShowPer10Warn:false
                //     })
                //     if(this.data.hasShowPer20Warn == false && isDevCharge == false){
                //         this.triggerEvent('warning20');
                //         this.setData({
                //             hasShowPer20Warn:true
                //         })
                //     }
                // }else if(battery > 20 && battery <= 50){
                //     this.setData({
                //         chargeImgUrl:this.properties.propBatteryUrls.half
                //     });
                //     this.resetBatteryWarningSign();
                // }else if(battery > 50 && battery <= 75){
                //     this.setData({
                //         chargeImgUrl:this.properties.propBatteryUrls.quarter3
                //     });
                //     this.resetBatteryWarningSign();
                // }else if(battery > 75 && battery <= 100){
                //     this.setData({
                //         chargeImgUrl:this.properties.propBatteryUrls.full
                //     });

                //     this.resetBatteryWarningSign();
                // }else{
                //     this.setData({
                //         chargeImgUrl:this.properties.propBatteryUrls.zeroUnCharge
                //     });
                // }
                // /**更新电池图 结束*/


                //判断是否显示数字电量
                let sn8 = newVal.sn8 || newVal.SN8;
                let ism6 = (VC_SN8_MAP[sn8] == "m6");
                this.setData({
                    isM6: ism6
                })

                this.setData({
                    isCharge: isDevCharge
                })
                let rateVal = 0.2;
                battery = Number(battery);
                if (isDevCharge) {
                    this.setData({
                        chargeImgUrl: this.properties.propBatteryUrls.charging,
                        quantityWidth: 0,
                        quantityColor: "#fff",
                        battery: battery
                    });
                }
                else {

                    if (battery >= 0 && battery <= 10) {

                        this.setData({
                            chargeImgUrl: this.properties.propBatteryUrls.body,
                            quantityWidth: battery * rateVal,
                            quantityColor: "#FD6057",
                            battery: battery
                        });

                        if (this.data.hasShowPer10Warn == false && isDevCharge == false) {
                            this.triggerEvent('warning10');
                            this.setData({
                                hasShowPer10Warn: true
                            })
                        }
                    } else if (battery > 10 && battery <= 20) {
                        let color = "";

                        if (battery > 10 && battery <= 15) {
                            color = "#FD6057";
                        }
                        else {
                            color = "#22BE3C";
                        }

                        this.setData({
                            chargeImgUrl: this.properties.propBatteryUrls.body,
                            quantityWidth: battery * rateVal,
                            quantityColor: color,
                            battery: battery
                        });

                        /**重置 hasShowPer10Error错误*/
                        this.setData({
                            hasShowPer10Warn: false
                        })
                        if (this.data.hasShowPer20Warn == false && isDevCharge == false) {
                            this.triggerEvent('warning20');
                            this.setData({
                                hasShowPer20Warn: true
                            })
                        }
                    } else if (battery > 20 && battery <= 100) {
                        this.setData({
                            chargeImgUrl: this.properties.propBatteryUrls.body,
                            quantityWidth: battery * rateVal,
                            quantityColor: "#22BE3C",
                            battery: battery
                        });

                        this.resetBatteryWarningSign();
                    } else {
                        this.setData({
                            chargeImgUrl: this.properties.propBatteryUrls.body,
                            quantityWidth: battery * rateVal,
                            quantityColor: "#fff",
                            battery: battery
                        });
                    }
                }



                /**更新电池图 结束*/


                /**更新状态图 */
                if (status == VC_WORK_STATE.workstate_charging ||
                    status == VC_WORK_STATE.workstate_chargingComplete ||
                    status == VC_WORK_STATE.workstate_chargewithline) {
                    this.setData({
                        stateImageUrl: this.properties.propStateImgs.chargeImg
                    })
                } else if (status == VC_WORK_STATE.workstate_work || status == VC_WORK_STATE.workstate_work_w11 || status == VC_WORK_STATE.workstate_back_cleanMop_w11) {
                    this.setData({
                        stateImageUrl: this.properties.propStateImgs.workImg
                    })
                } else if (status == VC_WORK_STATE.workstate_recharging || status == VC_WORK_STATE.workstate_recharging_w11) {
                    this.setData({
                        stateImageUrl: this.properties.propStateImgs.rechargeImg
                    })
                } else {
                    this.setData({
                        stateImageUrl: this.properties.propStateImgs.otherImg
                    })
                }
                /**更新标题 */
                if (newVal.hasError == true) {
                    this.setData({
                        cleanStateText: this.properties.propTitles.error
                    })
                } else {
                    if (status == VC_WORK_STATE.workstate_charging) {
                        this.setData({
                            cleanStateText: this.properties.propTitles.charging
                        })
                    } else if (status == VC_WORK_STATE.workstate_chargewithline) {
                        this.setData({
                            cleanStateText: this.properties.propTitles.chargingline
                        })
                    }
                    else if (status == VC_WORK_STATE.workstate_recharging || status == VC_WORK_STATE.workstate_recharging_w11) {
                        this.setData({
                            cleanStateText: this.properties.propTitles.recharging
                        })
                    } else if (status == VC_WORK_STATE.workstate_chargingComplete) {
                        this.setData({
                            cleanStateText: this.properties.propTitles.chargeComplete
                        })
                    } else if (status == VC_WORK_STATE.workstate_work || status == VC_WORK_STATE.workstate_work_w11) {
                        /**区分扫地还是拖地 */
                        if (isMopClean) {
                            this.setData({
                                cleanStateText: this.properties.propTitles.work_water
                            })
                        } else {
                            this.setData({
                                cleanStateText: this.properties.propTitles.work
                            })
                        }
                    } else if (status == VC_WORK_STATE.workstate_back_cleanMop_w11) {
                        //返回清洁抹布中
                        this.setData({
                            cleanStateText: this.properties.propTitles.back_cleanMop
                        })
                    } else if (status == VC_WORK_STATE.workstate_orderFinish) {
                        this.setData({
                            cleanStateText: this.properties.propTitles.reserve_task_finished
                        })
                    } else if (status == VC_WORK_STATE.workstate_pause || status == VC_WORK_STATE.workstate_pause_w11) {
                        this.setData({
                            cleanStateText: this.properties.propTitles.pause
                        })
                    } else if (status == VC_WORK_STATE.workstate_cleanMop_pause_w11) {
                        this.setData({
                            cleanStateText: this.properties.propTitles.cleanMop_pause
                        })
                    } else if (status == VC_WORK_STATE.workstate_sleep) {
                        this.setData({
                            cleanStateText: this.properties.propTitles.sleep
                        })
                    } else if (status == VC_WORK_STATE.workstate_dusting) {
                        this.setData({
                            cleanStateText: this.properties.propTitles.dusting
                        })
                    } else if (status == VC_WORK_STATE.workstate_relocate) {
                        this.setData({
                            cleanStateText: this.properties.propTitles.relocate
                        })
                    } else if (status == VC_WORK_STATE.workstate_back_cleanMop_w11) {
                        this.setData({
                            cleanStateText: this.properties.propTitles.back_cleanMop
                        })
                    } else if (status == VC_WORK_STATE.workstate_cleanMop_pause_w11) {
                        this.setData({
                            cleanStateText: this.properties.propTitles.cleanMop_pause
                        })
                    } else if (status == VC_WORK_STATE.workstate_manual_control_w11) {
                        this.setData({
                            cleanStateText: this.properties.propTitles.manual_control
                        })
                    } else if (status == VC_WORK_STATE.work_error) {
                        this.setData({
                            cleanStateText: this.properties.propTitles.error
                        })
                    } else {
                        this.setData({
                            cleanStateText: this.properties.propTitles.standby
                        })

                    }

                    if (!!subStatus) {
                        if (subStatus == VC_WORK_STATE.workstate_inject_water && status != VC_WORK_STATE.workstate_back_cleanMop_w11 && status != VC_WORK_STATE.workstate_cleanMop_pause_w11) {
                            this.setData({
                                cleanStateText: this.properties.propTitles.mop_clear
                            })
                        }
                        if (subStatus == VC_WORK_STATE.workstate_mop_clear && status == VC_WORK_STATE.workstate_on_base_w11) {
                            this.setData({
                                cleanStateText: this.properties.propTitles.mop_clear
                            })
                        }
                        if (subStatus == VC_WORK_STATE.workstate_mop_drying) {
                            this.setData({
                                cleanStateText: this.properties.propTitles.mop_drying
                            })
                        }
                        if (subStatus == VC_WORK_STATE.workstate_mop_hot_drying) {
                            this.setData({
                                cleanStateText: this.properties.propTitles.mop_hot_drying
                            })
                        }
                        if (subStatus == VC_WORK_STATE.workstate_charge_finish) {
                            this.setData({
                                cleanStateText: this.properties.propTitles.charge_finish
                            })
                        }
                        if (subStatus == VC_WORK_STATE.workstate_charging_w11&& status==VC_WORK_STATE.workstate_on_base_w11) {
                            this.setData({
                                cleanStateText: this.properties.propTitles.charging_w11
                            })
                        }
                        if (subStatus == VC_WORK_STATE.workstate_station_error) {
                            this.setData({
                                cleanStateText: this.properties.propTitles.station_error
                            })
                        }
                    }
                }
                //增加清扫前加载等待精确性
                let no_loading_map = {
                    sleep2relocate: 1,
                    pause2relocate: 1,
                    pause2undefined: 1,
                    undefined2relocate: 1,
                    stop2undefined: 1,
                    stop2relocate: 1,
                    charging_on_dock2relocate: 1,

                    clean_pause2relocate: 1,
                    clean_pause2undefined: 1,
                }
                let no_need_loading = no_loading_map[oldVal.status] + "2" + no_loading_map[newVal.status]
                // if(oldVal.status=="pause" && newVal.status=="relocate"){

                // }  
                //   else if(oldVal.status=="pause" && newVal.status==undefined){

                // }   
                // else if(oldVal.status==undefined && newVal.status==relocate){

                // }   
                // else if(oldVal.status=="stop" && newVal.status==undefined){

                // } 
                // else if(oldVal.status=="stop" && newVal.status=="relocate"){

                // }       
                if (!no_need_loading) {
                    wx.hideLoading()
                }



            }
        }
    },
    data: {
        /**状态数据 */
        stateImageUrl: VC_IMAGE_ROOT_URL + 'vc-state-standby.png',
        cleanStateText: '待机中',
        /**电池展示数据 */
        chargeImgUrl: '',
        isCharge: false,

        /**标记位 */
        hasShowPer10Warn: false,
        hasShowPer20Warn: false,
        isphonex: "",
        showError: false
    },
    methods: {
        resetBatteryWarningSign() {
            /**重置 hasShowPer10Error错误*/
            this.setData({
                hasShowPer10Warn: false
            })
            /**重置 hasShowPer20Error错误*/
            this.setData({
                hasShowPer20Warn: false
            })
        }
    },
    lifetimes: {
        attached: function () {
            var screenH = wx.getSystemInfoSync().windowHeight;
            if (screenH > 800) {
                this.setData({
                    isphonex: "isphonex"
                })
            }
            else {
                this.setData({
                    isphonex: ""
                })
            }
        }
    },
})