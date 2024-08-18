const app = getApp() //获取应用实例
// 子组件的 JS
Component({
    properties: {
        poupInfomation: {
            type: Object,
            // value: {
            //     show: true,
            //     poupInfo: {
            //         img: 'https://wx3.sinaimg.cn/mw690/92321886gy1hqaaubetpyj21jk25nat4.jpg',
            //         info: `考虑放假了丝
            //         开了房见识到了肯德基凯撒
            //         开了房见识到了肯德基凯撒
            //         开了房见识到了肯德基凯撒
            //         开了房见识到了肯德基凯撒
            //         开了房见识到了肯德基凯撒
            //         开了房见识到了肯德基凯撒
            //         开了房见识到了肯德基凯撒
                    
            //         扣法兰看手机卡拉卡`,
            //         type: 1,    //1.应用市场， 3.是参与内测
            //     }
            // }
      },
      isWifiNetWork:{
        type:Boolean,
        value:false
      }
    },

    data:{
        dialogImgLoaded:true,
        dialogImg:'./assets/img/version_update.png',
    },
    methods: {
        joinTest(){
            console.error('参与内测')
            this.triggerEvent('versionUpadte', {
                detail: {name:'参与内测',type:3}
            }, {});
        },
        updateNow(){
            this.triggerEvent('versionUpadte', {
                detail: {name:'立即升级',type:1}
            }, {});
        },
        togglePoup(){
            console.error('暂不升级')
            this.triggerEvent('versionUpadte', {
                detail: {name:'暂不升级',type:0}
            }, {});
        },
        //图片加载成功
        dialogImgSuccess(){
            console.log('弹窗背景图片加载成功')
            this.setData({
                dialogImgLoaded: true,
            })
        },
        //图片加载失败
        dialogImgError(){
            console.log('弹窗背景图片加载失败')
            let dialogImg = ''
            if(this.properties.poupInfomation.type == 1 ){
    
                dialogImg = './assets/img/version_update.png'
    
            } else if(this.properties.poupInfomation.type == 3) {
                
                dialogImg='./assets/img/internal_testing.png'
    
            }

            this.setData({
                dialogImg:dialogImg,
                dialogImgLoaded:false
            })
        }
    }
});