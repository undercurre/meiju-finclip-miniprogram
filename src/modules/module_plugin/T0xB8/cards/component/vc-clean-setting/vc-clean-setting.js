import { VC_FAN_LEVEL, VC_WATER_LEVEL,VC_IMAGE_ROOT_URL } from '../../utils/vcutils'
// import { imageApi } from '../../../../../api.js'
//const localImag = imageApi.getImagePath.url + '/0xB8/'
//const tempImage = "http://127.0.0.1:5500/";
Component({
    properties: {// 这里定义了innerText属性，属性值可以在组件使用时指定
        propFanLevel:{
            type: String,
            value: VC_FAN_LEVEL.FL_NORMAL,
            observer:function(newVal, oldVal){
                if(newVal != oldVal){
                    this.updateFanImageUrl(newVal);
                }
            }
        },
        propWaterLevel:{
            type: String,
            value: VC_WATER_LEVEL.WL_LOW,
            observer:function(newVal, oldVal){
                if(newVal != oldVal){
                    this.updateWaterImageUrl(newVal);
                }
            }
        },
        propLatestReserveTime: {
            type: String,
            value: ''
        },
    },
    data: {
        lastCleanTitle: '清洁偏好',
        lastOrderTitle: '清洁预约',
        lastOrderDesc: '',
        /**风机各状态图标 */
        fanImgUrls:{
            offImage: VC_IMAGE_ROOT_URL+'vc-battery-zero.png',
            lowImage: VC_IMAGE_ROOT_URL +'vc-battery-zerzo.png',
            softImage: VC_IMAGE_ROOT_URL +'vc-battery-quarter.png',
            normalImage: VC_IMAGE_ROOT_URL +'vc-battery-half.png',
            highImage: VC_IMAGE_ROOT_URL +'vc-battery-quarter3.png'
        },
        fanImageUrl: '',
        /**水速各状态图标 */
        waterImgUrls:{
            offImage: VC_IMAGE_ROOT_URL+'vc-battery-zero.png',
            lowImage: VC_IMAGE_ROOT_URL +'vc-battery-zero.png',
            normalImage: VC_IMAGE_ROOT_URL +'vc-battery-half.png',
            highImage: VC_IMAGE_ROOT_URL +'vc-battery-quarter3.png'
        },
        waterImageUrl: '',
        arrowImageUrl:VC_IMAGE_ROOT_URL +'vc-right-arrow.png'
    },
    methods: {
        openPanel(e){
            var type = e.currentTarget.dataset.type;
            this.triggerEvent('openpanel', { type:type,suctionLevel:this.properties.propFanLevel,waterLevel:this.properties.propWaterLevel}, {});
        },
        updateReserveDesc(){
            console.log("updateReserveDesc: propLatestReserveTime=" + this.properties.propLatestReserveTime)
            if(this.properties.propLatestReserveTime){
                let orderDesc = ('将于' + this.properties.propLatestReserveTime + '开始清洁')
                this.setData({
                    lastOrderDesc: orderDesc
                })
            }else{
                this.setData({
                    lastOrderDesc: '暂无清洁预约'
                })
            }
        },
        updateFanImageUrl(){
            let map = {
                "off":"vc-suction1.png",//w11
                "low":"vc-suction1.png",
                "soft":"vc-suction2.png",
                "normal":"vc-suction3.png",
                "high":"vc-suction4.png",
                "super":"vc-suction4.png",                
            }
            this.setData({
                fanImageUrl: VC_IMAGE_ROOT_URL+map[this.properties.propFanLevel]
            })

            // console.log("updateFanImageUrl: propFanLevel=" + this.properties.propFanLevel)
            // if(this.properties.propFanLevel == VC_FAN_LEVEL.FL_OFF){
            //     this.setData({
            //         fanImageUrl: this.data.fanImgUrls.offImage
            //     })
            // }else if(this.properties.propFanLevel == VC_FAN_LEVEL.FL_LOW){
            //     this.setData({
            //         fanImageUrl: this.data.fanImgUrls.lowImage
            //     })
            // }else if(this.properties.propFanLevel == VC_FAN_LEVEL.FL_HIGH){
            //     this.setData({
            //         fanImageUrl: this.data.fanImgUrls.highImage
            //     })
            // }else{
            //     this.setData({
            //         fanImageUrl: this.data.fanImgUrls.normalImage
            //     })
            // }
        },
        updateWaterImageUrl(){
            let map = {
                "off":"vc-water1.png",
                "low":"vc-water2.png",
                "normal":"vc-water3.png",
                "high":"vc-water4.png",
            }
            this.setData({
                waterImageUrl: VC_IMAGE_ROOT_URL+map[this.properties.propWaterLevel]
            })

            // console.log("updateWaterImageUrl: propWaterLevel=" + this.properties.propWaterLevel)
            // if(this.properties.propWaterLevel == VC_WATER_LEVEL.WL_OFF){
            //     this.setData({
            //         waterImageUrl: this.data.waterImgUrls.offImage
            //     })
            // }else if(this.properties.propWaterLevel == VC_WATER_LEVEL.WL_LOW){
            //     this.setData({
            //         waterImageUrl: this.data.waterImgUrls.lowImage
            //     })
            // }else if(this.properties.propWaterLevel == VC_WATER_LEVEL.WL_HIGH){
            //     this.setData({
            //         waterImageUrl: this.data.waterImgUrls.highImage
            //     })
            // }else{
            //     this.setData({
            //         waterImageUrl: this.data.waterImgUrls.normalImage
            //     })
            // }
        },
    },
    attached() {
        this.updateReserveDesc();
        this.updateFanImageUrl();
        this.updateWaterImageUrl();
    },      
})