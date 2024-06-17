module.exports = Behavior({
  behaviors: [],
  data: {
    deviceInfo: '',
    statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'], //顶部状态栏的高度
    backTo: '',
    isInit: false,
    curComponrentInstance: {},
    fromApp: Boolean,
    appParameter: '',
  },
  methods: {
    getUrlparams(options) {
      if (options.deviceInfo) {
        let deviceInfo = JSON.parse(decodeURIComponent(options.deviceInfo))
        this.setData({
          isInit: true,
          deviceInfo: { ...deviceInfo, applianceCode: '' + deviceInfo.applianceCode || '' },
          appParameter:
            'midea-meiju://com.midea.meiju/main?type=jumpWeexPlugin&deviceId=' +
            deviceInfo.applianceCode +
            '&needNavi=1',
        })
        console.log('appParameter=====', this.data.appParameter)
        this.getComponrentInstance(this.data.deviceInfo.applianceCode)
        this.initPlugin()
      }
      if (options.backTo) {
        this.setData({
          backTo: options.backTo,
        })
      }
    },

    getComponrentInstance(applianceCode) {
      this.data.curComponrentInstance = this.selectAllComponents(
        '.component' + applianceCode + '' + this.data.activeNum
      )[0]
      // return currentApplianceComponent = this.selectAllComponents('.component' + className)[0]
    },

    initPlugin() {
      let curComponrentInstance = this.data.curComponrentInstance
      console.log('curComponrentInstance', curComponrentInstance)
      if (curComponrentInstance.initCard) curComponrentInstance.initCard()
      if (curComponrentInstance.getActived) curComponrentInstance.getActived()
    },

    destoriedPlugin() {
      let currentApplianceComponent = this.data.curComponrentInstance
      if (currentApplianceComponent && currentApplianceComponent.getDestoried) {
        console.log('销毁了组件')
        currentApplianceComponent.getDestoried()
      }
    },

    //返回app错误回调
    launchAppError(e) {
      wx.showToast({
        title: '未找到美居App，\r\n请确认您的手机是否安装。',
        icon: 'none',
        duration: 2000,
      })
      setTimeout(() => {
        wx.navigateTo({
          url: '/pages/download/download',
        })
      }, 2000)
    },
    commonShareSetting() {
      let tempTitle = '欢迎使用美的美居Lite'
      let tempPath = '/pages/index/index'
      let tempImageUrl = '../../../assets/img/img_wechat_chat01@3x.png'
      return {
        title: tempTitle,
        path: tempPath,
        imageUrl: tempImageUrl,
      }
    },
  },
})
