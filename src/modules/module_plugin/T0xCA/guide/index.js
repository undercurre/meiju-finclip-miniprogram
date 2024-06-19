// plugin/T0xCA/guide/index.js   plugin/T0xCA/guide/index
import netService from '../service/NetService'
const app = getApp()
const pluginEventTrack = app.getGlobalConfig().pluginEventTrack
Page({

  /**
   * 页面的初始数据
   */
  data: {
    iconServiceUrl: netService.getIconServiceUrl(),
    pageTop: 0, 
    devWidth: 375,
    cellHeight: 130,//列表宽度
    curStep: 1,//当前步骤
    isLogin: false,//登录状态
    step1Color: '',
    step2Color: '',
    step3Color: '',
    statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'], //顶部状态栏的高度
    openMode: ""// 判断是从哪里跳转进来
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    //设置页头高度
    that.setData({pageTop: app.globalData.statusNavBarHeight, devWidth: wx.getSystemInfoSync().windowWidth, openMode: options.mode});
    //登陆处理
    app.checkGlobalExpiration().then(res => {
      let phoneNumber = app.globalData.phoneNumber;
      let uid = app.globalData.userData.uid;
      if(!that.data.isLogin){
        //根据用户ID获取用户的操作步骤
        that.getRecordOptStep(uid, phoneNumber, that.data.openMode);
      }
    }).catch(res1=>{
      that.data.isLogin = false;
      that.setData({curStep: 1});
    });
    //页面浏览埋点:新机指引首页浏览次数
    pluginEventTrack('user_page_view', null, {
      page_id: 'page_xjzy_guide_index',
      page_name: '新机指引首页',
      bd_name: '冰箱'
    }, {});
  },
  getRecordOptStep: function(uid, telPhone, openMode){
    let that = this;
    netService.getRecordStep(uid, telPhone, openMode).then((res) => {
      if(res.status == 0){
        that.data.curStep = res.step;
      }else if(res.status == 1){
        if(res.step < 3){
          that.data.curStep = res.step + 1;
        }else{
          that.data.curStep = res.step;
        }
      }
      that.setData({curStep: that.data.curStep, isLogin: true});
      //字体颜色处理
      if(that.data.curStep == 1){
        that.setData({step1Color: '#267AFF', step2Color: '', step3Color: ''});
      }else if(that.data.curStep == 2){
        that.setData({step1Color: '#8A8A8F', step2Color: '#267AFF', step3Color: ''});
      }else if(that.data.curStep > 2){
        that.setData({step1Color: '#8A8A8F', step2Color: '#8A8A8F', step3Color: '#267AFF'});
      }
    }).catch(err => {})
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    if(that.data.isLogin){
      let phoneNumber = app.globalData.phoneNumber;
      let uid = app.globalData.userData.uid;
      //根据用户ID获取用户的操作步骤
      that.getRecordOptStep(uid, phoneNumber, that.data.openMode);
    }else{
      //没有登陆
      app.checkGlobalExpiration().then(res => {
        let phoneNumber = app.globalData.phoneNumber;
        let uid = app.globalData.userData.uid;
        if(!that.data.isLogin){
          //根据用户ID获取用户的操作步骤
          that.getRecordOptStep(uid, phoneNumber, that.data.openMode);
        }
      }).catch(res1=>{
        that.data.isLogin = false;
        that.setData({curStep: 1});
      });
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
  todoStepAction: function(e){
    let step = e.currentTarget.dataset.step;
    //判断是否登陆
    if(app.globalData.isLogon){
      if(this.data.curStep < step){
        if(step < 4){
          wx.showToast({
            title:'请先完成上一步',
            icon: 'none',
            duration:1000,
            success: function(){}
          });
        }
      }else{
        if(step == 1){
          // 开箱安装
          wx.navigateTo({
            url: 'install/InstallStep1',
          })
        }else if(step == 2){
          //首次通电
          wx.navigateTo({
            url: 'install/InstallStep2',
          })
        }else if(step == 3){
          app.globalData.bxNewUser = 1;//识别入口
          //点击事件埋点: 新机指引配网点击事件
          pluginEventTrack('user_behavior_event', null, {
            page_id: 'page_xjzy_guide_index',
            page_name: '新机指引配网功能点击统计',
            widget_id: 'click_bth_xjzy_network',
            widget_name: '新机指引配网点击事件',
            bd_name: '冰箱',
            element_content: '新机指引配网点击事件'
          }, {});
          //连接网络
          wx.switchTab({
            url: '/pages/index/index',
          })

          //引导跳转美居App完成配网
          // wx.navigateTo({
          //   url: '../jump/toApp',
          // })
        }
      }
    }else{
      //没有登录，跳转登录
      wx.showModal({
        content: '为确保产品售后及新手礼包领取，请先完成注册登录。',
        confirmText: '注册登录',
        confirmColor: '#0076FF',
        cancelColor: '#666666',
        success: function(res){
          if(res.confirm){
            //去注册
            wx.navigateTo({
              url: '/pages/login/login',
            })
          }
        }
      })
    }
  },
  goToHomeAction: function(){
    wx.switchTab({
      url: '/pages/index/index',
    })
  }
})