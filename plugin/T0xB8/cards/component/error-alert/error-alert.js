import { imageApi } from '../../../../../api'
import { VC_IMAGE_ROOT_URL} from '../../utils/vcutils'
//const localImag = imageApi.getImagePath.url + '/0xB8/'
//const tempImage = "http://127.0.0.1:5500/";
Component({
    properties: {// 这里定义了innerText属性，属性值可以在组件使用时指定
        propErrorTitle: {
            type: String,
            value: ''
        },
        propErrorContent: {
            type: String,
            value: ''
        },
        propErrorMsgList: {
            type: Array,
            value: [],
            observer:function(newVal, oldVal){
                if(newVal != oldVal){
                    this.setData({
                        errorMsgList: this.data.propErrorMsgList
                    });
                }
            }
        }
    },
    data: {
        closeImgUrl1: VC_IMAGE_ROOT_URL + 'vc-error1-close.png',
        errorImgUrl1: VC_IMAGE_ROOT_URL + 'vc-error1.png',
        closeImgUrl2: VC_IMAGE_ROOT_URL + 'vc-error2-close.png',
        errorImgUrl2: VC_IMAGE_ROOT_URL + 'vc-error2.png'
    },
    methods: {
        onClose() {
            this.triggerEvent('errorclose');
        },
        closeItem(e){
            let index = e.currentTarget.dataset.index;
            this.data.propErrorMsgList.splice(index,1);
            this.triggerEvent('errorclose');
            this.setData({
                errorMsgList: this.data.propErrorMsgList
            });
        }
    },
    lifetimes: {
        attached: function () {
            // this.setData({
            //     errorMsgList: [
            //     { url: "url", title: "多地首套房贷利率上浮 热点城市渐迎零折" },
            //     { url: "url", title: "交了20多年的国内漫游费将取消 你能省多？" },
            //     { url: "url", title: "北大教工合唱团出国演出遇尴尬:被要求给他" }]
            //    });
           


        }
    },
    pageLifetimes: {
        show: function() {
            this.setData({
                errorMsgList: this.data.propErrorMsgList
            });
        },
      }
})