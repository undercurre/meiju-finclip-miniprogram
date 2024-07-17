import {
    VC_WORK_STATE,
    VC_WROK_MODE,
    VC_ControlButton_type,
    VC_ControlButton_state,
    VC_ControlButton_modestate,
    VC_Button_tag,
    VC_IMAGE_ROOT_URL
} from '../../utils/vcutils'

Component({
    properties: {// 这里定义了innerText属性，属性值可以在组件使用时指定
        propBatteryImg: {
            type: String,
            value: ''
        },
        propItemList: {
            type: Object
        },
        propParam: {
            type: Object
        },
        /**扫地机状态 */
        propDevStatus: {
            type: Object,
            value: {
                status: VC_WORK_STATE.workstate_standby,
                mode: VC_WROK_MODE.workmode_zigzag,
            },
            observer: function (newVal, oldVal) {
                if (newVal.status == oldVal.status &&
                    newVal.mode == oldVal.mode) {
                    return
                }
                this.updateCleanItem(newVal);
                this.updateModeItem(newVal);
                this.updateChargeItem(newVal);
            }
        },
        propIslockMode: {
            type: Boolean,
            value: false
        },
        propCleanMode: {
            type: String,
            observer: function (newVal, oldVal) {
                if (newVal.status == oldVal.status &&
                    newVal.mode == oldVal.mode) {
                    return
                }
                this.updateCleanMode();
            }
        },
    },
    data: {
        itemList: [],
        subItemList: [],
        showExtended: false,
        animationData: {},
        /**保存完整数据 */
        dataSourceDic: {},
        subDataSourceDic: {},
        /**显示时候使用的数据 */
        itemDic: {},
        subItemDic: {},
        paddingBottom: 20
    },
    methods: {
        updateCleanItem(DevStatus) {
            var cleanItem = this.data.dataSourceDic[VC_Button_tag.clean_tag];

            if (cleanItem == undefined || cleanItem == null) {
                return;
            }
            var newItem = {};

            if (DevStatus.status == VC_WORK_STATE.workstate_work || DevStatus.status == VC_WORK_STATE.workstate_work_w11) {

                newItem = this.createItem(cleanItem.icons.select, cleanItem.titles.select, cleanItem.styles.select, cleanItem.tag, false);
            } else if (DevStatus.status == VC_WORK_STATE.workstate_recharging || DevStatus.status == VC_WORK_STATE.workstate_recharging_w11 || DevStatus.status ==VC_WORK_STATE.workstate_relocate || DevStatus.status == VC_WORK_STATE.workstate_back_cleanMop_w11) {
                newItem = this.createItem(cleanItem.icons.disable, cleanItem.titles.disable, cleanItem.styles.disable, cleanItem.tag, true);
            } else {
                newItem = this.createItem(cleanItem.icons.normal, cleanItem.titles.normal, cleanItem.styles.normal, cleanItem.tag, false);
            }

            var dic = this.data.itemDic;
            dic[VC_Button_tag.clean_tag] = newItem;

            this.setData({
                itemDic: dic
            });
        },
        updateModeItem(DevStatus) {
            var modeItem = this.data.dataSourceDic[VC_Button_tag.mode_tag];

            if (modeItem == undefined || modeItem == null) {
                return;
            }
            var newItem = {};

            if (DevStatus.status == VC_WORK_STATE.workstate_recharging|| DevStatus.status == VC_WORK_STATE.workstate_recharging_w11) {
                if (DevStatus.mode == VC_WROK_MODE.workmode_zigzag) {
                    newItem = this.createItem(modeItem.icons.disable_zigzag, modeItem.titles.normal_zigzag, modeItem.styles.disable, modeItem.tag, true);
                } else if (DevStatus.mode == VC_WROK_MODE.workmode_area) {
                    newItem = this.createItem(modeItem.icons.disable_area, modeItem.titles.normal_area, modeItem.styles.disable, modeItem.tag, true);
                } else if (DevStatus.mode == VC_WROK_MODE.workmode_edge) {
                    newItem = this.createItem(modeItem.icons.disable_edge, modeItem.titles.normal_edge, modeItem.styles.disable, modeItem.tag, true);
                } else {
                    newItem = this.createItem(modeItem.icons.disable_zigzag, modeItem.titles.normal_zigzag, modeItem.styles.disable, modeItem.tag, true);
                }
            } else {
                if (this.data.showExtended == false) {
                    //未展开状态
                    if (DevStatus.mode == VC_WROK_MODE.workmode_zigzag) {
                        newItem = this.createItem(modeItem.icons.normal_zigzag, modeItem.titles.normal_zigzag, modeItem.styles.normal, modeItem.tag, false);
                    } else if (DevStatus.mode == VC_WROK_MODE.workmode_area) {
                        newItem = this.createItem(modeItem.icons.normal_area, modeItem.titles.normal_area, modeItem.styles.normal, modeItem.tag, false);
                    } else if (DevStatus.mode == VC_WROK_MODE.workmode_edge) {
                        newItem = this.createItem(modeItem.icons.normal_edge, modeItem.titles.normal_edge, modeItem.styles.normal, modeItem.tag, false);
                    } else {
                        newItem = this.createItem(modeItem.icons.normal_zigzag, modeItem.titles.normal_zigzag, modeItem.styles.normal, modeItem.tag, false);
                    }
                } else {
                    //展开状态
                    if (DevStatus.mode == VC_WROK_MODE.workmode_zigzag) {
                        newItem = this.createItem(modeItem.icons.select_zigzag, modeItem.titles.normal_zigzag, modeItem.styles.select, modeItem.tag, false);
                    } else if (DevStatus.mode == VC_WROK_MODE.workmode_area) {
                        newItem = this.createItem(modeItem.icons.select_area, modeItem.titles.normal_area, modeItem.styles.select, modeItem.tag, false);

                    } else if (DevStatus.mode == VC_WROK_MODE.workmode_edge) {
                        newItem = this.createItem(modeItem.icons.select_edge, modeItem.titles.normal_edge, modeItem.styles.select, modeItem.tag, false);
                    } else {
                        newItem = this.createItem(modeItem.icons.select_zigzag, modeItem.titles.normal_zigzag, modeItem.styles.select, modeItem.tag, false);
                    }
                    this.updateModeSubItem(DevStatus);
                }

            }
            var dic = this.data.itemDic;
            dic[VC_Button_tag.mode_tag] = newItem;

            this.setData({
                itemDic: dic
            });
        },
        updateChargeItem(DevStatus) {
            var item = this.data.dataSourceDic[VC_Button_tag.recharge_tag];
            if (item == undefined || item == null) {
                return;
            }
            var newItem = {};
            //在回充
            if (DevStatus.status == VC_WORK_STATE.workstate_recharging|| DevStatus.status == VC_WORK_STATE.workstate_recharging_w11) {
                newItem = this.createItem(item.icons.select, item.titles.select, item.styles.normal, item.tag, false);
            } else if (DevStatus.status == VC_WORK_STATE.workstate_charging
                || VC_WORK_STATE.workstate_chargingComplete == DevStatus.status
                || DevStatus.status == VC_WORK_STATE.workstate_chargewithline||(DevStatus.subStatus==VC_WORK_STATE.workstate_recharging_w11 && DevStatus.status ==VC_WORK_STATE.workstate_on_base_w11 || DevStatus.status ==VC_WORK_STATE.workstate_relocate)) {
                newItem = this.createItem(item.icons.disable, item.titles.disable, item.styles.disable, item.tag, true);
            } else {
                newItem = this.createItem(item.icons.normal, item.titles.normal, item.styles.normal, item.tag, false);
            }

            var dic = this.data.itemDic;
            dic[VC_Button_tag.recharge_tag] = newItem;

            this.setData({
                itemDic: dic
            });
        },
        updateModeSubItem(DevStatus) {
            var item = this.data.dataSourceDic[VC_Button_tag.mode_tag];
            var dic = new Object()
            //var source = new Object()

            for (var j = 0; j < item.subItems.length; j = j + 1) {
                var subItem = item.subItems[j];

                var tMode = VC_WROK_MODE.workmode_zigzag;

                if (subItem.tag == VC_Button_tag.mode_zigzag_tag) {
                    tMode = VC_WROK_MODE.workmode_zigzag;
                } else if (subItem.tag == VC_Button_tag.mode_area_tag) {
                    tMode = VC_WROK_MODE.workmode_area;
                } else if (subItem.tag == VC_Button_tag.mode_edge_tag) {
                    tMode = VC_WROK_MODE.workmode_edge;
                }
                var newItem = {};

                if (DevStatus.mode == tMode) {
                    newItem = this.createItem(subItem.icons.select, subItem.titles.select, subItem.styles.select, subItem.tag, false);
                } else {
                    newItem = this.createItem(subItem.icons.normal, subItem.titles.normal, subItem.styles.normal, subItem.tag, false);
                }
                //充电中或者充电完成,区域清扫置灰
                if (DevStatus.status == VC_WORK_STATE.workstate_charging ||
                    DevStatus.status == VC_WORK_STATE.workstate_chargingComplete ||
                    DevStatus.status == VC_WORK_STATE.workstate_chargewithline) {
                    if (subItem.tag == VC_Button_tag.mode_area_tag) {
                        newItem = this.createItem(subItem.icons.disable, subItem.titles.normal, subItem.styles.normal, subItem.tag, true);
                    }
                }

                dic[newItem.tag] = newItem;
            }
            this.setData({
                subItemDic: dic
            });
        },
        ontap(event) {
            var rowIndex = event.detail.rowIndex;
            var index = event.detail.index;
            // if (index == VC_Button_tag.clean_tag) {
            //     if (this.data.showExtended) {
            //         //执行关闭
            //         this.setData({
            //             showExtended: false
            //         })
            //     }
            // }
            //i5清扫模式切换
         if (index == VC_Button_tag.mode_tag) {
                this.triggerEvent('openpanel', { type: 'mode' }, {});
                //this.modeClick();
            }
            else{
                this.triggerEvent('buttonTap', { tagindex: event.detail.index });
            }
            //  else if (index == VC_Button_tag.recharge_tag) {
            //     if (this.data.showExtended) {
            //         //执行关闭
            //         this.setData({
            //             showExtended: false
            //         })
            //     }
            // } else if (index == VC_Button_tag.mode_zigzag_tag) {
            //     if (this.data.showExtended) {
            //         //执行关闭
            //         this.setData({
            //             showExtended: false
            //         })

            //         this.updateModeItem(this.properties.propDevStatus);
            //     }
            // } else if (index == VC_Button_tag.mode_area_tag) {
            //     if (this.data.showExtended) {
            //         //执行关闭
            //         this.setData({
            //             showExtended: false
            //         })

            //         this.updateModeItem(this.properties.propDevStatus);
            //     }
            // } else if (index == VC_Button_tag.mode_edge_tag) {
            //     if (this.data.showExtended) {
            //         //执行关闭
            //         this.setData({
            //             showExtended: false
            //         })
            //         this.updateModeItem(this.properties.propDevStatus);
            //     }
            // }
            //this.triggerEvent('buttonTap', { tagindex: event.detail.index });
        },
        updateCleanMode(){
            this.updateModeItem(this.properties.propDevStatus);
        },
        showExtendedFunc: function (show) {
            var that = this;
            var animation = wx.createAnimation({
                duration: 300,
                timingFunction: 'linear'
            });
            that.animation = animation;

            animation.translateY(100).step()
            that.setData({
                animationData: animation.export(),
                showExtended: show
            });

            setTimeout(function () {
                animation.translateY(0).step()
                that.setData({
                    animationData: animation.export()
                })
            }, 0)


        },
        modeClick() {
            if (this.data.showExtended == false) {
                this.setData({
                    showExtended: true
                })
                this.updateModeSubItem(this.properties.propDevStatus);
                this.updateModeItem(this.properties.propDevStatus);
            }
            else {
                //执行关闭
                this.setData({
                    showExtended: false
                })

                this.updateModeItem(this.properties.propDevStatus);
            }
        },
        // createItem(icon,title,fontSize,color,tag,disable){
        //     var newItem = {};
        //     newItem.icon = icon;
        //     newItem.title = title;
        //     newItem.fontSize = fontSize;
        //     newItem.color = color;
        //     newItem.tag = tag;
        //     newItem.disable = disable;
        //     return newItem;
        // }
        createItem(icon, title, style, tag, disable) {
            var newItem = {};
            newItem.icon = icon;
            newItem.title = title;
            newItem.style = style;
            // newItem.color = color;
            newItem.tag = tag;
            newItem.disable = disable;
            return newItem;
        }
    },
    lifetimes: {
        attached: function () {
            var dic = new Object();
            var source = new Object();

            for (var index = 0; index < this.properties.propItemList.length; index = index + 1) {
                var item = this.properties.propItemList[index];
                var newItem = {};

                if (item.tag == VC_Button_tag.clean_tag) {
                    newItem = this.createItem(item.icons.normal, item.titles.normal, item.styles.normal, item.tag, false);
                } else if (item.tag == VC_Button_tag.mode_tag) {
                    newItem = this.createItem(item.icons.normal_zigzag, item.titles.normal_zigzag, item.styles.normal, item.tag, false);
                } else if (item.tag == VC_Button_tag.recharge_tag) {
                    newItem = this.createItem(item.icons.normal, item.titles.normal, item.styles.normal, item.tag, false);
                } else {
                    newItem = this.createItem(item.icons.normal, item.titles.normal, item.styles.normal, item.tag, false);
                }
                source[item.tag] = item;
                dic[item.tag] = newItem;
            }

            // debugger;
            // if (!!this.properties.propParam) {
            //     dic[VC_Button_tag.mode_tag].icon = this.properties.propParam.icon;
            //     dic[VC_Button_tag.mode_tag].title = this.properties.propParam.title;

            // }

            this.setData({
                itemDic: dic
            });


            this.setData({
                itemDic: dic
            });
            this.setData({
                dataSourceDic: source
            })
            var model = wx.getSystemInfoSync().model
            if (model.search('iPhone 5') != -1) {
                this.setData({
                    paddingBottom: 5
                })
            }

        }
    },

})