
Page({
    data: {

    },
    methods: {
        onClose(){
            //this.triggerEvent('errorclose');
        },
    },
    onLoad(options) {
      console.log("活动详情啊====");
        this.setData({
            linkUrl:decodeURIComponent(options.linkUrl)
        })
    }
})