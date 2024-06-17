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
        },
        devInfo: {
            type: Object,
            value: {}
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
        },
        'devInfo'(newVal) {
            if (newVal != null && newVal != undefined) {
                let sn8 = newVal.sn8
                let isSupportDeHum = statusX.isSupportDehumidification(sn8);
                let list = this.data.functionList
                list[1].isShow = isSupportDeHum
                let cnt = isSupportDeHum ? 2 : 1
                this.setData({
                    functionList: list,
                    listShowCnt: cnt
                })
            }
        }
    },
    data: {
        functionList: [
            {key: 'sensor', functionName: '人感夜灯', tip: '有人时自动开夜灯，无人时延时关灯', isShow: true, isSwitchOn: false, icon: image.rengan_white},
            {key: 'deHum', functionName: '自动除湿', tip: '', isShow: true, isSwitchOn: false, icon: image.chushi_white}
        ],
        listShowCnt: 2, //列表显示的条数
        isBluetoothConnected: false, // 是否已连接蓝牙
        isOffLine: true, //是否离线
        isOff: true, //是否电源关
        curThemeColor: '#00CBB8' //开机时的主题色
    },
    methods: {
        onCellSwitchClick(data) {
            let index = data.currentTarget.dataset.item;
            if (index == 0) {
                let value = statusX.isRadarEnable() ? 'off' : 'on'
                this.sendControl({radar_induction_enable: value})
            } else if (index == 1) {
                let value = statusX.autoDehumidification() ? 'off' : 'on'
                this.sendControl({
                    auto_dehumidification: value,
                    dehumidity_time: '30'
                })
            }
        },
        updateView() {
            let isOff = statusX.isOff();
            let list = this.data.functionList

            list[0].isSwitchOn = statusX.isRadarEnable()
            list[1].isSwitchOn = statusX.autoDehumidification()

            let themeColor = statusX.getThemeColorByStatus('#267aff')
            this.setData({
                functionList: list,
                isOff: isOff,
                curThemeColor: themeColor
            });
        },
        sendControl(jsonObj) {
            this.triggerEvent('sendControlJson', jsonObj)
        }
    },
    lifetimes: {
        attached: function() {
            // 在组件实例进入页面节点树时执行
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
