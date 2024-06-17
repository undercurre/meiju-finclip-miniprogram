Component({
    properties: {// 这里定义了innerText属性，属性值可以在组件使用时指定
        propBatteryImg: {
            type: String,
            value: ''
        },
        propChargeImg: {
            type: String,
            value: ''
        },
        propIsCharge:{
            type:Boolean,
            value:false
        },
        propBatteryIconWidth:{
            type: Number,
            value: 28
        },
        propBatteryIconHeight:{
            type: Number,
            value: 14
        },
        
        propChargeIconWidth:{
            type: Number,
            value: 8
        },
        propChargeIconHeight:{
            type: Number,
            value: 10
        },
        propWidth:{
            type: Number,
            value: 0
        },
        propColor:{
            type: String,
            value: "#fff"
        },
        propBattery:{
            type: Number,
            value: 0
        },
        propIsM6:{
            type: Boolean,
            value: false
        },
    },
    data: {
        bottom:0,
    },
    methods: {
        
    },
    lifetimes: {
        attached: function(){
        
            this.setData({
                bottom:(this.properties.propBatteryIconHeight - this.properties.propChargeIconHeight)/2
            })
        }
    },
      
})