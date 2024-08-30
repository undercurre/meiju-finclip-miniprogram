//多套小程序共用一套配网-图片
import { imgBaseUrl } from '../../../api'
const imgesList= {
    meiPhone: '/addDeviceAboutImg/ic_meiphone@1x.png',
    zhuyi: '/addDeviceAboutImg/link_ic_zhuyi.png',
    nearby: '/addDeviceAboutImg/kaojinshebei.png',
    blueCD: '/addDeviceAboutImg/blue_cd.png',

    successRight: '/addDeviceAboutImg/succeed_icon_right.png',
    right: '/addDeviceAboutImg/right.png',

    wifiConnect: '/addDeviceAboutImg/wifi_ic_img_connect.png',
    wifiConnect_5G: '/addDeviceAboutImg/wifi_ic_img_connect_5G.png',
    wifiShow: '/addDeviceAboutImg/WiFi_ic_kejian.png',
    wifiHide: '/addDeviceAboutImg/wifi_ic_bukejian.png',

    loading: '/addDeviceAboutImg/loading_spot.png',
    linkCheck: '/addDeviceAboutImg//link_ic_checked.png',
    linkLoading: '/addDeviceAboutImg/link_ic_loading.png',

    fail: '/addDeviceAboutImg/shibai_icon_shibai.png',

    linkGuide: '/addDeviceAboutImg/wifi_img_lianjiezhiyin.png',
    noSel: '/addDeviceAboutImg/btn_off@3x.png',
    sel: '/addDeviceAboutImg/btn_on@3x.png',

    psw: '/addDeviceAboutImg/ic_mima@3x.png',
    wifi: '/addDeviceAboutImg/ic_wifi@3x.png',
    apName: '/addDeviceAboutImg/wifi_img_guide@3x.png',
    noFound: '/addDeviceAboutImg/img_no found shebei.png',
    noResult: '/addDeviceAboutImg/img_no_result@.png',
    img_wifi:'/addDeviceAboutImg/checkwifi@2x.png',
    img_wifi_new:'/addDeviceAboutImg/checkwifi@2x.png',
    android_checkwifi:'/addDeviceAboutImg/checkwifi@2x.png',
    net_ic_phone:'/addDeviceAboutImg/net_ic_phone@3x.png',
    net_ic_fail:'/addDeviceAboutImg/net_ic_fail@3x.png',


    //找不到wifi弹窗相关
    closeImg: '/addDeviceAboutImg/pop_ic_close@1x.png',
    closeit: '/addDeviceAboutImg/me_ic_closeit.png',
    noFoundApDiscover: '/addDeviceAboutImg/no_found_ap_discover@2x.png',
    noFoundApSwitch: '/addDeviceAboutImg/no_found_ap_WiFi_switch@2x.png',

    noLocation: '/addDeviceAboutImg/img_no_location@3x.png',

    questino: '/addDeviceAboutImg/ic_2.4GHzremind@3x.png',
    questino_new: '/addDeviceAboutImg/ic_2.4GHzremind@3x_new.png',

    //输入wifi页相关
    refresh: '/addDeviceAboutImg/list_ic_refresh@3x.png',
    wifiSignalStrength1: '/addDeviceAboutImg/ic_wifi@3x.png',
    wifiSignalStrength2: '/addDeviceAboutImg/smart_wifi_01@3x.png',
    wifiSignalStrength3: '/addDeviceAboutImg/smart_wifi_02@3x.png',
    wifiSignalStrength4: '/addDeviceAboutImg/smart_wifi_03@3x.png',

    noWifiList: '/addDeviceAboutImg/img_no home@3x.png',

    //linkAp
    linkDeviceWifiMidea: '/addDeviceAboutImg/linkap-midea-harmony.png',
    linkDeviceWifiMidea_new: '/addDeviceAboutImg/link_Device_wifi_midea.png',
    linkDeviceWifiMidea_colmo: '/addDeviceAboutImg/linkap-colmo-harmony.png',
    linkDeviceWifiMidea_midea: '/addDeviceAboutImg/linkap-midea-harmony.png',
    android_ApName: '/addDeviceAboutImg/linkap-midea-harmony.png',
    android_ApName_colmo: '/addDeviceAboutImg/linkap-colmo-harmony.png',
    android_ApName_midea: '/addDeviceAboutImg/linkap-midea-harmony.png',


    android_linkDeviceWifiBugu: '/addDeviceAboutImg/bugu_harmony.png',
    linkDeviceWifiBugu: '/addDeviceAboutImg/bugu_harmony.png',
    detailPackUp: '/addDeviceAboutImg/ic_zhankai@3x.png',
    detailExpand: '/addDeviceAboutImg/ic_shouqi@3x.png',
    detailStep2: '/addDeviceAboutImg/img_step2@3x.png',
    detailStep3: '/addDeviceAboutImg/img_step3@3x.png',
    detailStep4: '/addDeviceAboutImg/img_step4@3x.png',
    detailStep4_1: '/addDeviceAboutImg/img_step4_1@2x.png',
    detailStep5: '/addDeviceAboutImg/img_step5@2x.png',
    android_step1: '/addDeviceAboutImg/img_Android_step1@2x.png',
    android_step2: '/addDeviceAboutImg/img_Android_step2@2x.png',
    android_step3: '/addDeviceAboutImg/img_Android_step3@2x.png',
    
    //scan-device
    img_dakaidingwei:'/permission/common/img_dakaidingwei.png',
    img_dakailanya:'/permission/common/img_dakailanya.png',
    reSearchIcon:'/permission/common/ic_shuaxin.png',
    scanImg: '/scan-device/shebei_ic_scan.gif',
    scanAdd:'/scan-device/ic_scan.png',
    modelCategory:'/scan-device/ic_category.png',
    sence_img_lack:'scene/sence_img_lack.png',

    //邀请家人
    inviteFamily:'/addDeviceAboutImg/netinvite_img_invite.png',

    //success配网成功
    beforeOneRoom:'/addDeviceAboutImg/beforeOneRoom.png',

    //家电默认图
    dms_img_lack:'/dms_img_lack@3x.png',

    //search
    delIcon:'/addDeviceAboutImg/del-icon.png',
    searchIcon:'/addDeviceAboutImg/search-icon.png',
    right_arrow:'/addDeviceAboutImg/right_arrow.png',

    //指引
    network_icon:'/addDeviceAboutImg/network-icon-more.png',
    
    // 组合配网 
    combinedLoading: '/addDeviceAboutImg/combine_ic_loading.png',

    //lottie动画
    'addGuide-arrow':'/addGuide-arrow.json',

    'diffusion-circle':'/diffusion-circle.json',

    // frequency-guide
    'wifi_help_content':'/addDeviceAboutImg/wifi_2.4-5GHz_guide_new.png',

    //wifiGuide
    'wifi_guide_huawei1':'guide_pic_huawei1@3x.png',
    'wifi_guide_huawei2':'guide_pic_huawei2@3x.png',
    'wifi_guide_xiaomi1':'guide_pic_mi1@3x.png',
    'wifi_guide_xiaomi2':'guide_pic_mi2@3x.png',
    'wifi_guide_oppo1':'guide_pic_oppo1@3x.png',
    'wifi_guide_oppo2':'guide_pic_oppo2@3x.png',
    'wifi_guide_sansumg1':'guide_pic_sansumg1@3x.png',
    'wifi_guide_sansumg2':'guide_pic_sansumg2@3x.png',
    'wifi_guide_vivo1':'guide_pic_vivo1@3x.png',
    'wifi_guide_vivo2':'guide_pic_vivo2@3x.png',
    'wifi_guide_up':'/addDeviceAboutImg/guide_ic_change_up@3x.png',
    'wifi_guide_down':'/addDeviceAboutImg/guide_ic_change_down@3x.png',
  }

//   const shareImg = {
//     montage(name){
//         let url = ''
//         if(name){
//             console.log('aaaaaaaaaaaaaaaaaaaaaaa')
//             console.log(app.globalData)
//             console.log('777777777777777777777777777777777777')
//             // url = imgBaseUrl.url+'/shareImg/'+'/'+ app.globalData.brand + imgesList[name]
//         }
//         return url
//     }
//   }


module.exports = {
    imgesList
}