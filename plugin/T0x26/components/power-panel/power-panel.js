import { image } from '../../config/getImage';
import statusX from '../../config/statusX'

Component({
    properties: {
        deviceStatus: {
            type: Object,
            value: {}
        },
        deviceIsOnline: {
            type: Boolean,
            value: false
        },
        isConnectBlue: {
            type:Boolean,
            value: false
        }
    },
    observers: {
        'deviceStatus'(newVal) {
            statusX.setStatus(newVal);
            this.updateView();
        },
        'deviceIsOnline'(newVal) {
            this.setData({
				isOffLine: !newVal
			})
        },
        'isConnectBlue'(newVal) {
            this.setData({
				isBluetoothConnected: newVal
			})
        }
    },
    data: {
        iconPower: image.power_white,
        modeList: [
            {key: 'heat', modeName: '取暖', isOn: false, iconOff: image.qunuan_black, iconOn: image.qunuan_white},
            {key: 'bath', modeName: '安心沐浴', isOn: false, iconOff: image.muyu_black, iconOn: image.muyu_white},
            {key: 'wind', modeName: '吹风', isOn: false, iconOff: image.chuifeng_black, iconOn: image.chuifeng_white},
            {key: 'switch', modeName: '换气', isOn: false, iconOff: image.huanqi_black, iconOn: image.huanqi_white},
            {key: 'dry', modeName: '干燥', isOn: false, iconOff: image.ganzhao_black, iconOn: image.ganzhao_white}
        ],
        heatGearList: [
            {key: 'strong', gearName: '强暖', tip: '强劲热风，速暖御寒', isSelected: false, icon: image.qiangnuan_white},
            {key: 'weak', gearName: '弱暖', tip: '轻柔舒适，温暖春秋', isSelected: false, icon: image.qunuan_white}
        ],
        isBluetoothConnected: false, // 是否已连接蓝牙
        isOffLine: true, //是否离线
        isOff: true, //是否电源关
        isSelectingMode: false, //是否选择模式中
        curModeText: '开机', //当前模式显示文本 /开机/XX模式
        curThemeColor: '#00CBB8', //开机时的主题色
        isShowPopup: false
    },
    methods: {
        onPowerClick() {
            if (this.data.isOffLine && !this.data.isBluetoothConnected) return
            let isOff = statusX.isOff();
            if (isOff) {
                this.setData({
                    isSelectingMode: true
                })
            } else {
                this.setData({
                    isSelectingMode: false
                })
                this.sendControl({
                    mode_close: 'close_all',
                    delay_enable: 'off'
                })
            }
        },
        onSelectCancelClick() {
            this.setData({
                isSelectingMode: false
            })
        },
        onSelectModeClick(data) {
            if (this.data.isOffLine && !this.data.isBluetoothConnected) return
            let index = data.currentTarget.dataset.item;

            if (index == 0) {
                this.showPopup()
            } else if (index == 1) {
                if (statusX.isBathEnable()) {
                    this.sendControl({mode_close: 'bath'})
                } else {
                    this.sendControl({mode_enable: 'bath'})
                }
            } else if (index == 2) {
                if (statusX.isBlowingEnable()) {
                    this.sendControl({mode_close: 'blowing'})
                } else {
                    this.sendControl({mode_enable: 'blowing'})
                }
            } else if (index == 3) {
                if (statusX.isVentilationEnable()) {
                    this.sendControl({mode_close: 'ventilation'})
                } else {
                    this.sendControl({mode_enable: 'ventilation'})
                }
            } else if (index == 4) {
                if (statusX.isDryingEnable()) {
                    this.sendControl({mode_close: 'drying'})
                } else {
                    this.sendControl({mode_enable: 'drying'})
                }
            }
            this.setData({
                isSelectingMode: false
            })
        },
        onHeatGearClick(data) {
            let index = data.currentTarget.dataset.item;
            let isHeatingEnable = statusX.isHeatingEnable();
            let isStrongHeatingEnable = statusX.isStrongHeatingEnable();
            if (index == 0) {
                if (isStrongHeatingEnable) {
                    this.sendControl({mode_close: 'heating'})
                } else {
                    this.sendControl({
                        mode_enable: 'heating',
                        heating_temperature: '55'
                    })
                }
            } else if (index == 1) {
                if (isHeatingEnable && !isStrongHeatingEnable) {
                    this.sendControl({mode_close: 'heating'})
                } else {
                    this.sendControl({
                        mode_enable: 'heating',
                        heating_temperature: '30'
                    })
                }
            }
            this.closePopup()
        },
        updateView() {
            let isOff = statusX.isOff();

            let list = this.data.modeList;
            let gearList = this.data.heatGearList;

            for (let i = 0; i < list.length; i++) {
                list[i].isOn = false;
            }
            for (let i = 0; i < gearList.length; i++) {
                gearList[i].isSelected = false;
            }
            let modeText = '';
            let themeColor = statusX.getThemeColorByStatus();
            if (isOff || (this.data.isOffLine && !this.data.isBluetoothConnected)) {
                modeText = '开机';
            } else {
                if (statusX.isDryingEnable()) {
                    list[4].isOn = true
                    if (modeText == '') modeText = '干燥'
                    else modeText = '干燥+' + modeText
                }
                if (statusX.isVentilationEnable()) {
                    list[3].isOn = true
                    if (modeText == '') modeText = '换气'
                    else modeText = '换气+' + modeText
                }
                if (statusX.isBlowingEnable()) {
                    list[2].isOn = true
                    if (modeText == '') modeText = '吹风'
                    else modeText = '吹风+' + modeText
                }
                if (statusX.isBathEnable()) {
                    list[1].isOn = true
                    if (modeText == '') modeText = '安心沐浴'
                    else modeText = '安心沐浴+' + modeText
                }
                if (statusX.isHeatingEnable()) {
                    list[0].isOn = true
                    if (modeText == '') modeText = '取暖'
                    else modeText = '取暖+' + modeText

                    if (statusX.isStrongHeatingEnable()) {
                        gearList[0].isSelected = true;
                    } else {
                        gearList[1].isSelected = true;
                    }
                }
                if (modeText != '') modeText += '模式'
            }
            
            this.setData({
                modeList: list,
                isOff: isOff,
                curModeText: modeText,
                curThemeColor: themeColor,
                heatGearList: gearList
            })
        },
        sendControl(jsonObj) {
            this.triggerEvent('sendControlJson', jsonObj)
        },
        showPopup() {
            this.setData({ isShowPopup: true });
        },
        closePopup() {
            this.setData({ isShowPopup: false });
        },
    },
    lifetimes: {
        attached: function() {
            //在组件实例进入页面节点树时执行
            this.setData({
                isOffLine: !this.properties.deviceIsOnline,
                isBluetoothConnected: this.properties.isConnectBlue
			})
			
          	statusX.setStatus(this.properties.deviceStatus);
          	this.updateView();
        },
        detached: function() {
            // 在组件实例被从页面节点树移除时执行
        },
    }
})
