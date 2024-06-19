import {imageDomain} from "../../../assets/scripts/api";

export class FC{
    // 模式图标
    static getModeIcon(mode){
        let iconUrl = {
            url1: '',
            url2: ''
        }
        switch (mode){
            case 'manual':
                iconUrl.url1 = imageDomain+'/0xFC/icon_shoudong.png';
                iconUrl.url2 = imageDomain+'/0xFC/icon_shoudong2.png';
                break;
            case 'sleep':
                iconUrl.url1 = imageDomain+'/0xFC/icon_shuimian.png';
                iconUrl.url2 = imageDomain+'/0xFC/icon_shuimian2.png';
                break;
            case 'fast':
                iconUrl.url1 = imageDomain+'/0xFC/icon_jisu.png';
                iconUrl.url2 = imageDomain+'/0xFC/icon_jisu2.png';
                break;
            case 'smoke':
                iconUrl.url1 = imageDomain+'/0xFC/icon_yanwu.png';
                iconUrl.url2 = imageDomain+'/0xFC/icon_yanwu2.png';
                break;
            case 'auto':
                iconUrl.url1 = imageDomain+'/0xFC/icon_zidong.png';
                iconUrl.url2 = imageDomain+'/0xFC/icon_zidong2.png';
                break;
            case 'manual_1':
                iconUrl.url1 = imageDomain+'/0xFC/icon-low-gear.png';
                iconUrl.url2 = imageDomain+'/0xFC/icon-low-gear2.png';
                break;
            case 'manual_2':
                iconUrl.url1 = imageDomain+'/0xFC/icon-mid-gear.png';
                iconUrl.url2 = imageDomain+'/0xFC/icon-mid-gear2.png';
                break;
            case 'manual_3':
                iconUrl.url1 = imageDomain+'/0xFC/icon-high-gear.png';
                iconUrl.url2 = imageDomain+'/0xFC/icon-high-gear2.png';
                break;
        }
        return iconUrl
    }

    // 处理错误信息
    static handleErrorMsg(errCode){
        let rtn = '系统提示: '+errCode;
        if(errCode==1306){
            rtn = '设备未响应';
        }
        if(errCode==1307){
            rtn = '设备已离线，请检查网络状态';
        }
        return rtn;
    }

    // 重定向至不支持页面
    static redirectUnSupportDevice(deviceInfo){
        wx.redirectTo({
            url: `/pages/unSupportDevice/unSupportDevice?backTo=/pages/index/index&deviceInfo=` + encodeURIComponent(JSON.stringify(deviceInfo)),
        });
    }
}
