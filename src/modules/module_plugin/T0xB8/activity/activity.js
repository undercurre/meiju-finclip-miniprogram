const app = getApp() //获取应用实例
const requestService = app.getGlobalConfig().requestService
import {VC_IMAGE_ROOT_URL} from '../cards/utils/vcutils'
//const localImag = imageApi.getImagePath.url + '/0xB8/'
//const localImag = "http://127.0.0.1:5500/"

Page({
    data: {
        isTextShow: false,
        noActivityImg: VC_IMAGE_ROOT_URL + "vc-no-activity.png"
    },
    jumpDetail(event) {
        let data = event.currentTarget.dataset
        wx.navigateTo({
            url: '/plugin/T0xB8/activity/detail?linkUrl=' + encodeURIComponent(data.activityhtml)
        })
        //this.triggerEvent('buttonTap',{rowIndex:this.properties.propRowIndex,index:event.detail.index});
    },
    onLoad(option) {
      console.log("========12121=====");
        wx.setNavigationBarTitle({
            title: '活动专区'
        });
        // wx.setNavigationBarColor({
        //     frontColor:'#F4F9FF',
        //     backgroundColor:'#F4F9FF',
        //   })

        // let testdata = { "errorCode": "0", "message": "OK", "data": { "activities": [{ "deviceId": "0A000002E2A8", "activityId": "36", "activityTitle": "抽奖活动", "activityImg": "https://sit.ioter.cc:19000/erupt-attachment/2021-09-26/banner-draw.jpg", "activityHtml": "https://sit.ioter.cc/static/activity/draw/#/Lottery?deviceId=0A000002E2A8&sn8=75000474&userId=6876481371", "linkType": "0" }] } }

        // this.setData({
        //     iconImg: testdata.data.activities
        // })
        const app = getApp();
        let reqData = {
            //"sn8":"75000474","deviceId":"0A000002E2A8","userId":"6876481371","lang":"zh"
            "sn8": option.sn8,
            "deviceId": option.code,
            "userId": app.globalData.userData.iotUserId,
            "lang": "zh"
        }
        requestService.request('getDynamicActivityList', reqData).then((res) => {
            if (res.data.errorCode == 0) {
                if (!!res.data.data) {
                    let list = [];
                    res.data.data.activities.forEach(function (o) {
                        if (o.activityHtml.indexOf("midea-meiju")==-1) {
                            list.push(o);
                        }
                    })
                    if(list.length>0){
                        this.setData({
                            dataList: list,
                            isTextShow: false
                        })
                    }
                    else{
                        this.setData({
                            isTextShow: true
                        })
                    }
                   
                }
                else {
                    this.setData({
                        isTextShow: true
                    })
                }
            }
            else {
                console.warn(res)
            }
        }).catch(err => {
            console.warn(err)
        })

    }
})