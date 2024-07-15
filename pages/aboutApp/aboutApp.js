const app = getApp() //获取应用实例
import config from '../../config.js' //环境及域名基地址配置
import { requestService, uploadFileTask } from '../../utils/requestService'
import {webView} from '../../utils/paths'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    cellList: [
        {
            title: '版本更新',
            id: 'versionUpdate'
        },
        {
            title: '开源许可通告',
            id: 'codeArrow',
            link: {
                sit: 'https://qrcode.midea.com/test/AboutApp/openSourceLicense_android.html',
                uat: 'https://qrcode.midea.com/AboutApp/openSourceLicense_android.html',
            }
        },
        {
            title: '证照信息',
            id: 'privaci',
            link: {
                sit: 'https://www.smartmidea.net/projects/sit/licence/index.html',
                uat: 'https://www.smartmidea.net/projects/licence/index.html',
            }
        }
    ]
  },
  backPage() {
    wx.navigateBack()
  },
  jumpTargetPath(event) {
    let item = event.currentTarget.dataset.item
    if(item.id == 'versionUpdate'){

    }else{
        let env = config.environment == 'sit' ? 'sit' : 'uat'
        let url = item.link[env]
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
