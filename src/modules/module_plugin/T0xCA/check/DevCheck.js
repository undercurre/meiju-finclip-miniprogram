// plugin/T0xCA/check/DevCheck.js
import netService from '../service/NetService'
import common from '../card0/assets/js/common'
const app = getApp()
const pluginEventTrack = app.getGlobalConfig().pluginEventTrack
var checkFaultTaskTimer = null;
var gIdx = 0;
//plugin/T0xCA/guide/index
//plugin/T0xCA/check/DevCheck

Page({

  /**
   * 页面的初始数据
   */
  data: {
    iconServiceUrl: netService.getIconServiceUrl(),
    curFridgeId: null,
    statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'], //顶部状态栏的高度
    statusNavBarHeight: app.globalData.statusNavBarHeight,
    contentViewHeight: 0,//屏幕内容高度
    screenHeight: 0,//屏幕大小
    faultList: [],//故障历史数据
    checkResult: -1,//自检结果
    checkTime: "",
    progressText: "已完成自检",//进度提示
    progress: 100,//进度数值
    faultNum: 0, //故障数量
    unfoldTap: true,
    unfoldTapVal: 0,//方向
    devChecking: false,// 冰箱自检状态
    checkProgressItem: "",//正在检测的项目
    btnFixStatus: 0,// 0 固定在底部， 1 不固定
    isWJFunc: 0,//是否存在微晶模式
    checkTotalNum: 7, // 自检总项数量
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({curFridgeId: options.fridgeId, statusNavBarHeight: app.globalData.statusNavBarHeight, screenHeight: app.globalData.screenHeight, isWJFunc: options.isWJFunc});
    let contentViewHeight = (app.globalData.screenHeight - app.globalData.statusNavBarHeight) * this.getRpx() - 548 - 224;
    this.setData({contentViewHeight: contentViewHeight});
    //获取自检历史
    this.getDevCheckHistory();

    //页面浏览埋点: 智能自检页面浏览统计
    pluginEventTrack('user_page_view', null, {
      page_id: 'page_check_devcheck',
      page_name: '智能自检',
      bd_name: '冰箱'
    }, {});
  },
  getRpx: function(){
    let winWidth = wx.getSystemInfoSync().windowWidth;
    return 750/winWidth;
  },
  getDevCheckHistory: function(){
    let that = this;
    //获取自检历史
    netService.getDevCheckHistory(that.data.curFridgeId).then(
      (res)=>{
       // console.log("---------------------------------->  " + JSON.stringify(res));
        if(res.result == -1){
          //没有自检
          that.setData({checkResult: -1, checkTotalNum: res.data.checkTotalNum});
        }else{
          that.setData({checkTotalNum: res.data.checkTotalNum});
          that.drawPageView(res.data, 100, "已完成自检");
        }
      }
    ).catch(err => {});
  },
  drawPageView: function(dataModel, progress, progressText){
    let that = this;
    let faultList = dataModel.faultList;
    for(let idx = 0; idx < faultList.length; idx ++){
      let entity = faultList[idx];
      if(entity.faultname.indexOf("故障") == -1){
        entity.faultname = entity.faultname + "故障";
      }
    }
    that.setData({checkResult: dataModel.checkresult, checkTime:common.formatDate(new Date(dataModel.checktime))});
    that.setData({progress: progress, progressText: progressText, faultList: faultList, faultNum: dataModel.faultnum});
    if(that.data.faultNum > 0){
      that.setData({unfoldTap: true, unfoldTapVal: 0});
    }else{
      that.setData({unfoldTap: false, unfoldTapVal: 180});
    }
    //计算高度
    that.fixBtnPoint(faultList);
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
    if(checkFaultTaskTimer != null){
      clearTimeout(checkFaultTaskTimer);
      checkFaultTaskTimer = null;
    }
  },
  unfoldAction: function(){
    if(this.data.faultNum > 0){
      this.data.unfoldTap = !this.data.unfoldTap;
      if(this.data.unfoldTap){
        this.setData({unfoldTapVal: 0, unfoldTap:this.data.unfoldTap});
        this.fixBtnPoint(this.data.faultList);
      }else{
        this.setData({btnFixStatus: 0, unfoldTapVal: 180, unfoldTap:this.data.unfoldTap});
      }
    }
  },
  startCheckAction: function(){
    this.fixBtnPoint([]);
    this.startDevCheck(this.data.curFridgeId);
    //点击事件埋点: 故障自检点击事件
    pluginEventTrack('user_behavior_event', null, {
      page_id: 'page_check_devcheck',
      page_name: '智能自检按钮点击统计',
      widget_id: 'click_bth_devcheck',
      widget_name: '故障自检点击事件',
      bd_name: '冰箱',
      element_content: '故障自检点击事件'
    }, {});
  },
  startDevCheck: function(curFridgeId){
    let that = this;
 //   progressText: "已完成自检",//进度提示
  //  progress: 100,//进度数值
  // checkResult 状态显示   1 显示无故障; 0 显示有故障
    if(!that.data.devChecking){
      //初始化
      that.setData({devChecking: true, progress: 0, progressText: "自检中", faultNum: 0, checkResult: 1, faultList: []});
      //进行自检
      that.getCheckItems(curFridgeId);
    }
  },
  //获取自检项目
  getCheckItems: function(devId){
    let that = this;
    //初始化
    that.setData({progress: 0});
    netService.getCheckItems(devId).then(
      (res)=>{
        //console.log("----------------> 获取故障项目数量:  " + JSON.stringify(res));
        that.checkActionStart(res.checkDevList);
      }
    ).catch(err => {});
  },
  //开始自检
  checkActionStart: function(checkDevList){
    let that = this;
    gIdx = 0;
    //故障列表
    let faultList = [];
    //重置按钮
    that.fixBtnPoint(faultList);
    if(checkFaultTaskTimer == null){
      checkFaultTaskTimer = setTimeout(function() {
        that.runCheckTask(checkDevList, faultList);
      }, 600);
    }
  },
  runCheckTask: function(checkDevList, faultList){
    let that = this;
    let entity = checkDevList[gIdx];
    if(entity == null || (typeof(entity) == "undefined")){
      clearTimeout(checkFaultTaskTimer);
      checkFaultTaskTimer = null;
      //写入状态
      if(that.data.faultNum > 0){
        that.data.checkResult = 0;
      }else{
        that.data.checkResult = 1;
      }
      that.setData({devChecking: false, progress: 100, progressText: "已完成自检", faultNum: that.data.faultNum, checkResult: that.data.checkResult, checkTime:common.formatDate(new Date())});
      //计算高度
      that.fixBtnPoint(faultList);
      //上传故障报告
      let checkresultN = 0;
      if(that.data.faultNum == 0){
        checkresultN = 1;
      }else{
        checkresultN = 0;
      }
      let devSn = null;
      let devType = null;
      netService.saveCheckDevResult(that.data.curFridgeId, checkDevList.length, checkresultN, that.data.faultNum, devSn, devType, faultList).then(
        (res)=>{}
      ).catch(err => {});
    }else{
      if(entity.isOk == 0){
        that.data.faultNum = that.data.faultNum + 1;
        let faultEntity = {};
        faultEntity.faultcode = entity.key;
        if(entity.itemName.indexOf("故障") == -1){
          faultEntity.faultname = entity.itemName + "故障";
        }
        faultList.push(faultEntity);
        that.setData({checkResult: 0, faultList: faultList, faultNum: that.data.faultNum});
      }
      that.setData({checkProgressItem:entity.itemName});
      //继续循环
      if(checkFaultTaskTimer != null){
        clearTimeout(checkFaultTaskTimer);
      }
      //设置自检显示速率
      let setTimeValue = 0;
      if (gIdx < 3 || gIdx == 3) {
        setTimeValue = 600;
        that.data.progress += 14;
      } else if (gIdx > 3 && gIdx <= 6) {
        setTimeValue = 60;
        that.data.progress += 14;
      } else if (gIdx > 6) {
        setTimeValue = 600;
        that.data.progress += 14;
      }
      if(that.data.progress > 100){
        that.data.progress = 100;
      }
      that.setData({progress: that.data.progress});
      checkFaultTaskTimer = setTimeout(function() {
        that.runCheckTask(checkDevList, faultList);
      }, setTimeValue);
    }
    gIdx ++;
    //计算高度
    that.fixBtnPoint(faultList);
  },
  fixBtnPoint: function(dataList){
    if(dataList == null){
      dataList = [];
    }
    let listHeight = dataList.length * 80;
    if(this.data.contentViewHeight < listHeight && this.data.unfoldTap){
      this.setData({btnFixStatus: 1});
    }else{
      this.setData({btnFixStatus: 0});
    }
  }
})