const app = getApp() //获取应用实例
import config from '../../config.js' //环境及域名基地址配置
import { privacyApi } from '../../api'
import { requestService, uploadFileTask } from '../../utils/requestService'
import {webView} from '../../utils/paths'
const domain = config.privacyDomain.prod
Page({
  /**
   * 页面的初始数据
   */
  data: {
    cellList: [
        {
            title: '隐私保护的技术措施',
            jumpType: 0,
            id: '',
            link: {
                sit: 'https://qrcode.midea.com/test/AboutApp/personalPrivacyTechnology.html',
                uat: 'https://qrcode.midea.com/AboutApp/personalPrivacyTechnology.html'
            }
        },
        {
            title: '隐私设置',
            jumpType: 1,
            id: '',
        },
        {
            title: '权限列表',
            jumpType: 0,
            id: '',
            link: `${domain}/mobile/agreement/?system=meiju_lite_app&agreement_type=per_list_app`//sit无法打开，改为用prod的
        },
        {
            title: '用户协议',
            jumpType: 0,
            id: '',
            link: `${privacyApi.url}/mobile/agreement/?system=meijuApp&agreement_type=register`
        },
        {
            title: '隐私协议',
            jumpType: 0,
            id: '',
            link: `${privacyApi.url}/mobile/agreement/?system=meijuApp&agreement_type=privacy`
        }
    ]
  },
  backPage() {
    wx.navigateBack()
  },
  jumpTargetPath(event){
    let item = event.currentTarget.dataset.item
    if(item.jumpType == 1){
        wx.navigateTo({
            url: '/pages/privacySetting/privacySetting',
        })
    }else{
        let url
        if(typeof item.link == 'string'){
            url = item.link
        }else{
            let env = config.environment == 'sit' ? 'sit' : 'uat'
            url = item.link[env]
        }
        wx.navigateTo({
            url: `/pages/webView/webView?webViewUrl=${encodeURIComponent(url)}`,
        })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},
})
