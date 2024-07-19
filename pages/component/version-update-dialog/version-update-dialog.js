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
            //         type: 1,    //假定1是可升级， 2是参与内测，3是必须升级
            //     }
            // }
      },
    },

    methods: {
        joinTest(){
            console.error('参与内测')
            this.triggerEvent('childEvent', {
                detail: '参与内测'
            }, {});
        },
        updateNow(){
            this.triggerEvent('childEvent', {
                detail: '立即升级'
            }, {});
        },
        togglePoup(){
            console.error('暂不升级')
            this.triggerEvent('childEvent', {
                detail: '暂不升级'
            }, {});
        }
    }
});