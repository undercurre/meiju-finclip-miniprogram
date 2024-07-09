const app = getApp() //获取应用实例
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
            id: 'codeArrow'
        },
        {
            title: '证照信息',
            id: 'privaci'
        }
    ]
  },
  jumpTargetPath() {

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
