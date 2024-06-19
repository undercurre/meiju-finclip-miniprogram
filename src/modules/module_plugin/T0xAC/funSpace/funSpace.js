// plugin/T0xAC/funSpace/funSpace.js
import SnProcess from '../util/device-funcs-match/SnProcess'
import FuncMatchBase from '../util/device-funcs-match/SNProcess/FuncMatchBase'
import { SNFuncMatch, FuncDefault } from '../util/sn-process/SnFuncMap'
import { FuncType, FuncOrder, FuncMetaType } from '../util/sn-process/FuncType'
import { Btns } from '../util/BtnCfg'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    funSpace: [
      {
        text: '睡眠',
        content: '设定温度自动控制，制冷时定时升温，制热时定时降温。',
        img: '../assets/func/func_sleep.png',
      },
      {
        text: 'ECO',
        content: '通过判断室内外温度情况，自动控制运行频率，一晚八小时低至一度电（一级能效26机型）。',
        img: '../assets/func/func_eco.png',
      },
      {
        text: '电辅热',
        content: '在制热或自动模式运行时，用户可以自主控制是否开启空调的电辅热。',
        img: '../assets/func/func_fure.png',
      },
    ],
    deviceInfo: '',
    isKitchen: false,
    allBtn:[],
    modalBtn:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let infos = JSON.parse(decodeURIComponent(options.deviceInfo))
    // let deviceSnBle = options.deviceSnBle
    this.setData({
      deviceInfo: infos,
    })
    this.generateFuncs(this.data.deviceInfo.sn8);    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},

  generateFuncs(sn8) {
    console.log(sn8, 'sn8888888888888888888888')   
    FuncMatchBase.SNFuncMatch = SNFuncMatch
    FuncMatchBase.FuncDefault = FuncDefault
    FuncMatchBase.FuncOrder = FuncOrder
    FuncMatchBase.FuncMetaType = FuncMetaType
    FuncMatchBase.FuncType = FuncType

    let sn = '000000211' + sn8 + '091802902930000'    
    let obj = SnProcess.getAcFunc(sn, true)
    this.setData({
      hasFuncObj: obj,
    })
    let deviceSubType = SnProcess.getAcSubType(sn);
    this.setData({
      isKitchen: deviceSubType == '_FG100' || deviceSubType == '_XD200'
    })
    let allBtn = SnProcess.getSnOrder(sn, false)
    this.setData({
      allBtn: allBtn,
    })
    this.generateFuncBtns(allBtn);
    console.log(allBtn)
  },
  generateFuncBtns(allBtn) {
    console.log('all btn===', allBtn, Btns)
    let funcArr = []
    for (let i = 0; i < allBtn.length; i++) {
      funcArr.push(Btns[allBtn[i]])
    }
    this.setData({
      modalBtn: funcArr,
    })
    console.log('modalBtn===', this.data.modalBtn);
  }
})
