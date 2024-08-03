Component({
    properties: {
        checkPermissionRes:{
            type: Object,
            value: {

            }
        },
        checkWifiPermissionRes:{
            type: Object,
            value: {
                isCanWifi:true,
                type: 'wifi', //权限类型
                permissionTextAll: `开启WLAN开关\n以便扫描添加智能设备`, //权限提示文案
                permissionTypeList: {wifiEnabled:true},
            }
        }
    },

    data: {},
    methods: {

        openJurisdiction(){
            console.log("触发去开启按钮")
            this.triggerEvent('onOpenJurisdiction')
        }
    },
})