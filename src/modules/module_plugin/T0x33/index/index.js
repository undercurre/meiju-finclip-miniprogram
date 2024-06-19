import pluginMixin from 'm-miniCommonSDK/utils/plugin-mixin'

Page({
  behaviors: [pluginMixin],
  /**
   * 页面的初始数据
   */
  data: {
    title: '空气炸锅',
    isHideNavBg: true,
  },
  onClickLeft() {
    wx.navigateBack({
      delta: 1,
      fail: (err) => {
        wx.switchTab({
          url: '/pages/index/index',
        })
      },
    })
  },
  // checkTitleLength(title){

  //   const isChi = new RegExp('[\u4E00-\u9FA5]+')
  //   const isEng = new RegExp('[A-Za-z]+')
  //   const isDig = new RegExp('[0-9]+')
  //   let j = 0
  //   let count = 0
  //   for (let i = 0; i < title.length; i++) {
  //     let item = title[i]
  //     if (isDig.test(item) || isEng.test(item)) {
  //       j++
  //     } else if (isChi.test(item)) {
  //       count++
  //     }
  //     if (j === 2) {
  //       j = 0
  //       count += 1
  //     }
  //     if (count >= 10) {
  //       title = title.slice(0, i + 1) + '...'
  //       break
  //     }
  //   }
  //   return title
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUrlparams(options)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let title = this.data.deviceInfo.name

    this.setData({ title })

    // 获取快开消息配置
    // let deviceInfo = this.data.deviceInfo;
    // PluginConfig.recommendGet(deviceInfo).then(res=>{
    //   this.setData({
    //     advertiseBarData: res.advertiseBarData
    //   })
    // })
    // // region todo 测试
    // console.log('测试加密: ');
    // // 获取seed
    // const app = getApp();
    // let content = app.globalData.userData.key;
    // console.log(content);
    // content = CryptoJS.enc.Hex.parse(content)
    // content = CryptoJS.enc.Base64.stringify(content);
    //
    // let md5_key = md5(api.appKey).substring(0, 16);
    // md5_key = CryptoJS.enc.Utf8.parse(md5_key);
    // let decode_seed = CryptoJS.AES.decrypt(content, md5_key, {
    //   mode: CryptoJS.mode.ECB,
    //   padding: CryptoJS.pad.Pkcs7
    // }).toString(CryptoJS.enc.Utf8);
    // console.log(decode_seed);
    // let key = CryptoJS.enc.Utf8.parse(decode_seed+decode_seed);
    //
    // let aesCBC256Encrypt = function(encryptText){
    //   let srcs = CryptoJS.enc.Utf8.parse(encryptText)
    //
    //   let encrypted = CryptoJS.AES.encrypt(srcs, key, {
    //     iv: CryptoJS.enc.Utf8.parse(decode_seed),
    //     mode: CryptoJS.mode.CBC,
    //     padding:CryptoJS.pad.Pkcs7
    //   });
    //   return encrypted.ciphertext.toString().toUpperCase();
    // }
    //
    // let aesCBC256Decrypt = function(decryptText){
    //   let srcs = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Hex.parse(decryptText))
    //   let decrypt = CryptoJS.AES.decrypt(srcs, key, {
    //     iv: CryptoJS.enc.Utf8.parse(decode_seed),
    //     mode: CryptoJS.mode.CBC,
    //     padding: CryptoJS.pad.Pkcs7,
    //   })
    //   let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)
    //   return decryptedStr.toString()
    // }
    //
    // let jsonOrder = aesCBC256Encrypt(JSON.stringify({
    //   "control": {
    //     "work_mode": 21,
    //     "work_switch": "work",
    //     "bake_type": 0,
    //     "flag_modify_temp_enable": 1,
    //     "target_temp": 170,
    //     "flag_modify_time_enable": 1,
    //     "set_work_time_sec": 1800,
    //     "flag_modify_turn_enable": 1,
    //     "flag_turn_enable": 1,
    //     "flag_modify_light_enable": 1,
    //     "flag_light_enable": 0,
    //     "control_src": "1",
    //     "sub_cmd": "1"
    //   }
    // }))
    // requestService.request('json2hex',{
    //   applianceCode: Number(deviceInfo.applianceCode),
    //   reqId: getStamp().toString(),
    //   jsonOrder: jsonOrder
    // }).then(res=>{
    //   console.log('获取hex指令');
    //   console.log(res);
    //   if(res.data.code===0){
    //     let hexOrder = aesCBC256Decrypt(res.data.hexOrder);
    //     console.log(hexOrder);
    //   }
    // })
    // let hexOrder = aesCBC256Encrypt('AA453300000000000103AA5501010000021500000000000000000000000000000000000000000000000000000100000000003D0000000000010000000000000000000000002D');
    // requestService.request('hex2json',{
    //   applianceCode: Number(deviceInfo.applianceCode),
    //   reqId: getStamp().toString(),
    //   hexOrder: hexOrder
    // }).then(res=>{
    //   console.log('获取json指令');
    //   console.log(res);
    //   if(res.data.code===0){
    //     let jsonOrder = aesCBC256Decrypt(res.data.jsonOrder);
    //     console.log(jsonOrder);
    //   }
    // })
    // // endregion
  },
  // 监听页面滚动
  onPageScroll: function (event) {
    // console.log('滚动: ',event);
    const { isHideNavBg } = this.data
    let limitScrollHeight = 100
    if (event.scrollTop > limitScrollHeight && isHideNavBg) {
      this.setData({
        isHideNavBg: false,
      })
    }
    if (event.scrollTop < limitScrollHeight && !isHideNavBg) {
      this.setData({
        isHideNavBg: true,
      })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      fromApp: false,
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.destoriedPlugin()
  },

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
  onShareAppMessage: function () {
    return this.commonShareSetting()
  },
})
