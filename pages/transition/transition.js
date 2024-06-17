const app = getApp() //获取应用实例

import { baseImgApi, environment } from '../../api'

import { service } from 'assets/js/service'

import { getCommonType } from '../../utils/pluginFilter'
import { getPluginUrl } from '../../utils/getPluginUrl'
import { getStamp, aesDecrypt } from 'm-utilsdk/index'
import { getFullPageUrl, judgeWayToMiniProgram, navigateToMiniProgram } from '../../utils/util'

import { rangersBurialPoint } from '../../utils/requestService'

import { faultInfo, defaultWebview, openShoppingLite } from '../../utils/paths'
import { setPluginDeviceInfo } from '../../track/pluginTrack.js'

import { getTemplateId } from '../../globalCommon/js/deviceSubscribe'

import { faultTemplate, jumpCleanBuy, templateIds } from '../../globalCommon/js/templateIds'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    isHourse: true,
    isLogon: false,
    homegroupId: '', //用户的家庭组id
    room: '', //设备所在房间
    applianceCode: '', //设备虚拟id
    msgType: '', //信息类型
    msgId: '', //信息模板id
    time: '', //故障时间
    code: '', //故障码
    desc: '', //故障描述
    applianceHomeData: {}, //房间设备列表数据
    homeName: '', //设备所在家庭群组名称
    homeApplianceList: [], //家庭群组里所有设备列表
    img: {
      noDevice: baseImgApi.url + 'img_wuwangluo.png',
      denglu_img_logo: baseImgApi.url + 'denglu_img_logo.png',
    },
    noDevice: false, //设备是否给删除或解绑
    notice: '设备已被删除或解绑',
    isWaterPower: false, //是否跳水电统计页面
    sourFlag: '', //洗衣机模板信息需要跳转美的智慧家小程序搜索页面的搜索关键字
    tip: '', //服务通知里的提示说明
    boolSn: 0, //大数据传递过来的applianceCode是否是加密的
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('options.query', options)
    this.setData({
      homegroupId: options.homegroupId,
      applianceCode: options.applianceCode,
      msgType: options.msgType,
      msgId: options.msgId,
      time: options.time,
      code: options.code,
      desc: options.desc,
      room: options.room,
      isWaterPower: options.isWaterPower ? options.isWaterPower : false,
      sourFlag: options.sourFlag ? options.sourFlag : '',
      tip: options.tip ? options.tip : '',
      boolSn: options.boolSn ? options.boolSn : 0,
    })
    app.globalData.isFromOpenShopLite = false
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  async onShow() {
    let { isFromOpenShopLite, shopDeviceInfo, shopMsgID } = app.globalData
    //是从打开美的智慧家小程序中间页返回到则跳转到对应插件页
    if (isFromOpenShopLite) {
      app.globalData.isFromOpenShopLite = false
      //跳转到插件页
      wx.redirectTo({
        url:
          getPluginUrl(getCommonType(shopDeviceInfo.type, shopDeviceInfo), JSON.stringify(shopDeviceInfo)) + `&templateId=${shopMsgID}`,
        // url:
        //   `/plugin/T${getCommonType(shopDeviceInfo.type)}/index/index?deviceInfo=` +
        //   encodeURIComponent(JSON.stringify(shopDeviceInfo)) +
        //   `&templateId=${shopMsgID}`,
      })
      return
    }

    this.getLoginStatus().then(() => {
      if (app.globalData.isLogon) {
        this.getApplianceHomeDataService(this.data.homegroupId)
      } else {
        this.goLogin()
      }
    })
  },

  getLoginStatus() {
    return app
      .checkGlobalExpiration()
      .then(() => {
        this.setData({
          isLogon: app.globalData.isLogon,
        })
      })
      .catch(() => {
        app.globalData.isLogon = false
        this.setData({
          isLogin: app.globalData.isLogon,
        })
      })
  },

  //跳转到登录页面
  goLogin: function () {
    wx.navigateTo({
      url: '../login/login',
    })
  },

  //根据家庭组id获取房间设备列表
  getApplianceHomeDataService(homegroupId) {
    let _this = this
    return new Promise((resolve, reject) => {
      service
        .getApplianceHomeDataService(homegroupId)
        .then((resp) => {
          console.log('家庭设备', resp)
          this.setData({
            applianceHomeData: resp,
            homeName: resp.name,
          })
          if (resp.roomList) {
            this.homeAppliance()
          } else {
            _this.viewTrack()
            setTimeout(() => {
              _this.setData({
                notice: '你已退出设备所在的家庭，无法查看该设备信息',
                noDevice: true,
              })
              _this.faultViewTrack()
            }, 2000)
          }
          resolve(resp)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  //得到当前家庭里的所有设备列表
  homeAppliance() {
    let homeApplianceList = []
    const currentHomeRoomList = this.data.applianceHomeData.roomList
    for (let index = 0; index < currentHomeRoomList.length; index++) {
      const roomItem = currentHomeRoomList[index]
      for (let indexA = 0; indexA < roomItem.applianceList.length; indexA++) {
        let applianceItem = Object.assign(roomItem.applianceList[indexA], {
          roomName: roomItem.name,
        })
        homeApplianceList.push(applianceItem)
      }
    }
    console.log('当前家庭组的设备列表', homeApplianceList)
    this.setData({
      homeApplianceList: homeApplianceList,
    })
    this.jumpJudge()
  },

  //收到信息之后的跳转判断
  async jumpJudge() {
    //如果传递过来的applianceCode是加密的，需要解密
    if (this.data.boolSn == 1) {
      this.setData({
        applianceCode: aesDecrypt(this.data.applianceCode, app.globalData.aesKey, app.globalData.aesIv),
      })
    }
    let target = this.data.homeApplianceList.find((item) => {
      return item.applianceCode == this.data.applianceCode
    })
    console.log('当前设备信息', target)
    let _this = this
    //在用户的家庭房间设备列表页没有找到指定的设备，提示设备已被解绑或删除
    if (!target) {
      setTimeout(() => {
        _this.setData({
          noDevice: true,
          notice: '设备已不在这个家庭，无权限查看该设备信息',
        })
        _this.faultViewTrack()
      }, 2000)
      return
    } else {
      this.viewTrack(target.name)
    }

    //故障信息跳转到故障信息页面
    if (faultTemplate.includes(this.data.msgType)) {
      wx.redirectTo({
        url:
          faultInfo +
          `?homeGroup=${this.data.homeName}&device=${target.name}&type=${target.type}&room=${this.data.room}&time=${this.data.time}&code=${this.data.code}&desc=${this.data.desc}&homegroupId=${this.data.homegroupId}&applianceCode=${this.data.applianceCode}&msgType=${this.data.msgType}`,
      })
      return
    }

    setPluginDeviceInfo(target)

    //洗衣清洁提醒 洗衣液余量不足提醒 洗衣机耗材提醒 跳转到引导用户打开美的智慧家小程序的页面
    if (jumpCleanBuy.includes(this.data.msgType)) {
      wx.navigateTo({
        url:
          `${openShoppingLite}?keyword=${this.data.sourFlag}&deviceInfo=` +
          encodeURIComponent(JSON.stringify(target)) +
          '&msgId=' +
          this.data.msgId +
          '&tip=' +
          this.data.tip +
          '&msgType=' +
          this.data.msgType,
      })
      return
    }

    //如果支持跳转水电统计页则跳到水电统计页面，否则跳插件页
    if (this.data.isWaterPower == false || this.data.isWaterPower == 'false') {
      this.gotoPluginPage(target)
    } else {
      let urlEnv = environment === 'sit' || environment === 'dev' ? 'sit' : 'pro'
      let category = target.type.split('0x')[1].toUpperCase()
      let currLink = `https://ismart.zhinengxiyifang.cn/washerPW_meijulite/${urlEnv}/index.html#/WashingWaterPower?env=${urlEnv}&applianceId=${this.data.applianceCode}&deviceType=${category}&deviceSubType=${target.modelNumber}&userId=${app.globalData.userData.iotUserId}&deviceSn8=${target.sn8}&loginState=true`
      wx.redirectTo({
        url: `${defaultWebview}?webViewUrl=${encodeURIComponent(currLink)}`,
      })
    }
  },

  //进入到插件页
  gotoPluginPage(target) {
    //曝光埋点
    rangersBurialPoint('user_page_view', {
      page_path: getFullPageUrl(),
      module: '插件',
      page_id: 'page_appliance_plugin',
      page_name: target.type + '插件页',
      device_info: {
        onlineStatus: target.onlineStatus, //设备在线状态1在线/0离线
        pluginType: target.type, //设备品类
        sn8: target.sn8, //SN8码
        is_support_current_device: 1, //设备是否支持小程序控制 1支持 0不支持
      },
      ext_info: {
        source: '服务通知信息', //页面入口来源：服务通知消息/其他
        notice_type: this.data.msgType, //服务通知消息类型：洗衣完成提醒/洗衣机耗材不足提醒/洗衣机故障提醒/洗衣机清洁提醒/干衣完成提醒/干衣机故障提醒等
      },
    })
    //跳转到插件页
    wx.redirectTo({
      url: getPluginUrl(getCommonType(target.type, target), JSON.stringify(target)) + `&templateId=${this.data.msgId}`,
      // url:
      //   `/plugin/T${getCommonType(target.type)}/index/index?deviceInfo=` +
      //   encodeURIComponent(JSON.stringify(target)) +
      //   `&templateId=${this.data.msgId}`,
    })
  },

  viewTrack(name) {
    let _this = this
    //曝光埋点
    rangersBurialPoint('user_page_view', {
      page_path: getFullPageUrl(),
      module: '插件',
      page_id: 'page_msg_to_appliance_middle',
      page_name: '通过消息提醒打开插件页的中间页',
      object_type: '消息',
      object_id: getTemplateId(_this.data.msgType),
      object_name: _this.data.msgType,
      device_info: {},
      ext_info: {
        reffer: '信息', //访问来源，消息/其它
        room: _this.data.room, //所在位置
        content: _this.data.desc, //提示说明
        family: _this.data.homeName, //家庭名称
        appliance_name: name || _this.data.applianceCode, //设备名称
      },
    })
  },

  faultViewTrack() {
    let _this = this
    //曝光埋点
    rangersBurialPoint('user_page_view', {
      page_path: getFullPageUrl(),
      module: '插件',
      page_id: 'page_msg_open_plugin_fail',
      page_name: '通过消息提醒打开插件页失败页面',
      object_type: '消息',
      object_id: _this.data.msgType,
      object_name: _this.data.msgType,
      device_info: {},
      ext_info: {
        error: _this.data.notice, //失败原因文字描述，如：设备已删除
        reffer: '信息', //访问来源，消息/其它
        room: _this.data.room, //所在位置
        content: _this.data.desc, //提示说明
        family: _this.data.homeName, //家庭名称
        appliance_name: _this.data.applianceCode, //设备code
      },
    })
  },

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
})
