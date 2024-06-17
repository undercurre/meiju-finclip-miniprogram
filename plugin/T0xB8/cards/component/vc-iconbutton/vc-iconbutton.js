import {VC_WORK_STATE,
    VC_WROK_MODE,

    VC_ControlButton_type,
    VC_ControlButton_state,
    VC_ControlButton_modestate,
    VC_Button_tag} from '../../utils/vcutils'

Component({
    properties: {// 这里定义了innerText属性，属性值可以在组件使用时指定
        
        propIconWidth:{
            type: String,
            value: '56px'
        },
        propIconHeight:{
            type: String,
            value: '56px'
        },
        
        propDisable:{
            type:Boolean,
            value:false
        },
        propTag:{
            type:String,
            value:''
        },
        propIcon:{
            type:String,
            value:''
        },
        propTitle:{
            type:String,
            value:0
        },
        propTitleColor:{
            type:String,
            value:'#000000'
        },
        propFontSize:{
            type:String,
            value:'12px'
        },
        propStyle:{
          type:String,
          value:""
        },
        tag:{
            type:Number,
            value:0
        },
        icons:{
            type: Object
        },
        titles:{
            type: Object
        },
        colors:{
            type: Object
        }
    },
    data: {
        
    },
    methods: {
        buttonTap(){
            if(this.properties.propDisable == false){
                this.triggerEvent('buttonTap',{index:this.properties.propTag});
            }
            
        }
    },
    lifetimes: {
        attached: function(){
        }
      },
      
})