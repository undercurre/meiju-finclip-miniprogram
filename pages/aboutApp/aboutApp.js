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
                sit: 'https://qrcode.midea.com/test/AboutApp/openSourceLicense_harmony.html',
                uat: 'https://qrcode.midea.com/AboutApp/openSourceLicense_harmony.html',
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
    ],
    poupInfomation: {
        show: false,
        poupInfo: {
            img: 'https://wx3.sinaimg.cn/mw690/92321886gy1hqaaubetpyj21jk25nat4.jpg',
            info: `考虑放假了丝
            开了房见识到了肯德基凯撒
            开了房见识到了肯德基凯撒
            开了房见识到了肯德基凯撒
            开了房见识到了肯德基凯撒
            开了房见识到了肯德基凯撒
            开了房见识到了肯德基凯撒
            开了房见识到了肯德基凯撒
            
            扣法兰看手机卡拉卡`,
            type: 1,    //假定1是可升级， 2是参与内测，3是必须升级
        }
    },
    showVersionUpdateDialog:false 
  },
  togglePoup() {
    let poupInfomation = this.data.poupInfomation
    poupInfomation.show = !poupInfomation.show
    console.error('点击版本更新')
    this.data.showVersionUpdateDialog = !this.data.showVersionUpdateDialog
    this.setData({
        poupInfomation,
        showVersionUpdateDialog: this.data.showVersionUpdateDialog
    })
  },
  backPage() {
    wx.navigateBack()
  },
  joinTest() {

  },
  updateNow() {
    try{
        ft.startAppGalleryDetailAbility()
    }catch(e){}
  },
  checkVersion(){
    //检查版本request
    this.togglePoup()
  },
  jumpTargetPath(event) {
    let item = event.currentTarget.dataset.item
    if(item.id == 'versionUpdate'){
        this.checkVersion()
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
