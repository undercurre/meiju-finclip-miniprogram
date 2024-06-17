import {VC_WORK_STATE,
    VC_WROK_MODE,

    VC_ControlButton_type,
    VC_ControlButton_state,
    VC_ControlButton_modestate,
    VC_Button_tag} from '../../utils/vcutils'
Component({
    properties: {// 这里定义了innerText属性，属性值可以在组件使用时指定
        propBatteryUrls:{
          type: Object
        },
        propStateImgs:{
            type:Object
        },
        propTitles:{
            type:Object
        },
        propChargeImg:{
            type:String,
            value:''
        },
        propDevStatus:{
            type:Object,
            value:{
                // status:VC_WORK_STATE.workstate_standby,
                // mode:VC_WROK_MODE.workmode_zigzag,
                // battery:0,
                hasError:false
            },
            observer:function(newVal,oldVal){
                if((oldVal.status == newVal.status)
                    && oldVal.mode == newVal.mode
                    && oldVal.battery == newVal.battery
                    && oldVal.hasError == newVal.hasError
                    && oldVal.isMopClean == newVal.isMopClean){
                    return;
                }
                var status = newVal.status;
                var battery = newVal.battery;
                var isMopClean = newVal.isMopClean; //i3pro专用
                var isDevCharge = false;

                /**更新电池图 */
                if(status == VC_WORK_STATE.workstate_charging ||
                    status == VC_WORK_STATE.workstate_chargingComplete||
                    status == VC_WORK_STATE.workstate_chargewithline){
                        isDevCharge = true;
                }
                /**是否显示充电状态 */
                this.setData({
                    isCharge:isDevCharge
                })
                
                if(battery >= 0 && battery <= 10){

                    if(isDevCharge){
                        
                        this.setData({
                            chargeImgUrl:this.properties.propBatteryUrls.zeroCharge
                        });
                    }else{
                        this.setData({
                            chargeImgUrl:this.properties.propBatteryUrls.zeroUnCharge
                        });
                    }
                    if(this.data.hasShowPer10Warn == false && isDevCharge == false){
                        this.triggerEvent('warning10');
                        this.setData({
                            hasShowPer10Warn:true
                        })
                    }
                }else if(battery > 10 && battery <= 20){
                    
                    this.setData({
                        chargeImgUrl:this.properties.propBatteryUrls.quarter
                    });
                    /**重置 hasShowPer10Error错误*/
                    this.setData({
                        hasShowPer10Warn:false
                    })
                    if(this.data.hasShowPer20Warn == false && isDevCharge == false){
                        this.triggerEvent('warning20');
                        this.setData({
                            hasShowPer20Warn:true
                        })
                    }
                }else if(battery > 20 && battery <= 50){
                    this.setData({
                        chargeImgUrl:this.properties.propBatteryUrls.half
                    });
                    this.resetBatteryWarningSign();
                }else if(battery > 50 && battery <= 75){
                    this.setData({
                        chargeImgUrl:this.properties.propBatteryUrls.quarter3
                    });
                    this.resetBatteryWarningSign();
                }else if(battery > 75 && battery <= 100){
                    this.setData({
                        chargeImgUrl:this.properties.propBatteryUrls.full
                    });
                    
                    this.resetBatteryWarningSign();
                }else{
                    this.setData({
                        chargeImgUrl:this.properties.propBatteryUrls.zeroUnCharge
                    });
                }
                /**更新电池图 结束*/



                /**更新状态图 */
                if(status == VC_WORK_STATE.workstate_charging ||
                    status == VC_WORK_STATE.workstate_chargingComplete||
                    status == VC_WORK_STATE.workstate_chargewithline){
                        this.setData({
                            stateImageUrl:this.properties.propStateImgs.chargeImg
                        })
                }else if(status == VC_WORK_STATE.workstate_work){
                    this.setData({
                        stateImageUrl:this.properties.propStateImgs.workImg
                    })
                }else if(status == VC_WORK_STATE.workstate_recharging || status == VC_WORK_STATE.workstate_recharging_w11){
                    this.setData({
                        stateImageUrl:this.properties.propStateImgs.rechargeImg
                    })
                }else{
                    this.setData({
                        stateImageUrl:this.properties.propStateImgs.otherImg
                    })
                }
                /**更新标题 */
                if(newVal.hasError == true){
                    this.setData({
                        cleanStateText:this.properties.propTitles.error
                    })
                }else{
                    if(status == VC_WORK_STATE.workstate_charging){
                            this.setData({
                                cleanStateText:this.properties.propTitles.charging
                            })
                    }else if(status == VC_WORK_STATE.workstate_chargewithline){
                        this.setData({
                            cleanStateText:this.properties.propTitles.chargingline
                        })
                    }
                    else if(status == VC_WORK_STATE.workstate_recharging || status == VC_WORK_STATE.workstate_recharging_w11){
                            this.setData({
                                cleanStateText:this.properties.propTitles.recharging
                            })
                    }else if(status == VC_WORK_STATE.workstate_chargingComplete){
                        this.setData({
                            cleanStateText:this.properties.propTitles.chargeComplete
                        })
                    }else if(status == VC_WORK_STATE.workstate_work){
                        /**区分扫地还是拖地 */
                        if(isMopClean){
                            this.setData({
                                cleanStateText:this.properties.propTitles.work_water
                            })
                        }else{
                            this.setData({
                                cleanStateText:this.properties.propTitles.work
                            })
                        }
                    }else if(status == VC_WORK_STATE.workstate_orderFinish){
                        this.setData({
                            cleanStateText:this.properties.propTitles.reserve_task_finished
                        })
                    }else if(status == VC_WORK_STATE.workstate_pause || status == VC_WORK_STATE.workstate_pause_w11){
                        this.setData({
                            cleanStateText:this.properties.propTitles.pause
                        })
                    }else if(status == VC_WORK_STATE.workstate_sleep){
                        this.setData({
                            cleanStateText:this.properties.propTitles.sleep
                        })
                    }else if(status == VC_WORK_STATE.workstate_dusting){
                        this.setData({
                            cleanStateText:this.properties.propTitles.dusting
                        })
                    }else if(status == VC_WORK_STATE.workstate_relocate){
                        this.setData({
                            cleanStateText:this.properties.propTitles.relocate
                        })
                    }else{
                        this.setData({
                            cleanStateText:this.properties.propTitles.standby
                        })
                        
                    }
                }
                
            }
        }
    },
    data: {
        /**状态数据 */
        stateImageUrl:'',
        cleanStateText:'待机中',
        /**电池展示数据 */
        chargeImgUrl:'',
        isCharge:false,

        /**标记位 */
        hasShowPer10Warn:false,
        hasShowPer20Warn:false,

        quantityWidth:10,
        quantityColor:"#fff"

    },
    methods: {
        resetBatteryWarningSign(){
            /**重置 hasShowPer10Error错误*/
            this.setData({
                hasShowPer10Warn:false
            })
            /**重置 hasShowPer20Error错误*/
            this.setData({
                hasShowPer20Warn:false
            })
        }
    },
    lifetimes: {
        attached: function(){
            
        }
    },
})