// plugin/T0xB3/mode-select.js
import Language from './../card/assets/js/Language.js'
import service from './../card/assets/js/service.js'
import imgs from './../assets/img'
import { requestService, rangersBurialPoint } from '../../../utils/requestService'
import { getReqId, getStamp } from 'm-utilsdk/index'
import { pluginEventTrack } from '../../../track/pluginTrack'

const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    placeholdImg: '../assets/imgTemp/mode.png',
    grayPlaceholdImg: '../assets/imgTemp/mode_gray.png',
    statusNavBarHeight: app.globalData.statusNavBarHeight,
    cloudModeList: [],
    isPageInit: false,
    Language,
    screenH: 750, // (750 / weex.config.env.deviceWidth) * weex.config.env.deviceHeight,
    NUM: 20, // 常量 20
    icon: {
      leftImg: imgs.leftImg,
      tipIcon: imgs.tipIcon,
    },
    modeList: [],
    diyModeList: [],
    otaModeList: [],
    selectedMode: {
      desc: '',
    },
    selectedIndex: 0,
    versionInfo: {},
    selectedOta: {},
    isipx: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.initData(options)
      .then(() =>
        this.setData({
          isPageInit: true,
        })
      )
      .catch((err) => {
        console.error(err)
        // wx.showToast({
        //   title: '数据错误，即将返回上一页',
        //   icon: 'error'
        // })
        // setTimeout(wx.navigateBack, 1500)
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    rangersBurialPoint('user_page_view', {
      page_path: 'plugin/T0xB3/mode-select/mode-select',
      module: '插件',
      page_id: 'page_control',
      page_name: '消毒柜模式选择页',
      object_type: '',
      object_id: '',
      object_name: '',
      device_info: {},
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
  // onShareAppMessage: function () {}

  async initData(options) {
    let self = this
    // 来自query
    let deviceInfo = JSON.parse(decodeURIComponent(options.deviceInfo))
    let status = JSON.parse(decodeURIComponent(options.status))
    this.setData({
      deviceInfo,
      status,
    })
    // this.setData({
    //   versionInfo: await this.getItem('version_info_' + deviceInfo.applianceCode)
    // })
    let confObj = wx.getStorageSync(`${deviceInfo.applianceCode}confObj`)
    let selectType = parseInt(wx.getStorageSync('selectedType'))
    let modeKey = wx.getStorageSync(`${deviceInfo.applianceCode}modeKey`)
    let id = wx.getStorageSync('modeId')
    let isSingleOta = wx.getStorageSync('isSingleOta')
    console.log('adsfjakf')
    // let otaModeList = (await service.getOtaModeList()).map(item => {
    //   item.timeDesc =
    //     Language.about +
    //     (item.duration > 60
    //       ? Math.floor(item.duration / 60) + '时' + (item.duration % 60) + '分 | '
    //       : item.duration + '分 | ') +
    //     (item.maxTemp ? item.maxTemp + '°C' : '--')
    //   return item
    // })
    // if (this.data.versionInfo) {
    //   this.setData(
    //     {
    //       otaModeList: (await service.getOtaModeList()).map(item => {
    //         item.timeDesc =
    //           Language.about +
    //           (item.duration > 60
    //             ? Math.floor(item.duration / 60) + '时' + (item.duration % 60) + '分 | '
    //             : item.duration + '分 | ') +
    //           (item.maxTemp ? item.maxTemp + '°C' : '--')
    //         return item
    //       }),
    //     },
    //     function () {
    //       console.log(self.data.otaModeList)
    //       self.data.otaModeList.forEach(element => {
    //         element.activeImgSrc = `https://midea-video.oss-cn-hangzhou.aliyuncs.com/b3/aidash/${element.iconPrefixName}_active.png`
    //         element.imgSrc = `https://midea-video.oss-cn-hangzhou.aliyuncs.com/b3/aidash/${element.iconPrefixName}_native.png`
    //       })
    //     }
    //   )
    // }
    // let cloudModeList = wx.getStorageSync('cloudModeList')
    selectType = isSingleOta ? 0 : selectType
    this.setData(
      {
        // cloudModeList: cloudModeList,
        modeList: confObj.modeList[selectType].map((item, index) => {
          item.timeDesc =
            Language.about +
            (item.time > 60 ? Math.floor(item.time / 60) + '时' + (item.time % 60) + '分 | ' : item.time + '分 | ') +
            (item.temperature && item.temperature != '' ? item.temperature : '--')
          return item
        }),
        diyModeList: confObj._modeList[selectType].map((item, index) => {
          item.timeDesc =
            Language.about +
            (item.time > 60 ? Math.floor(item.time / 60) + '时' + (item.time % 60) + '分 | ' : item.time + '分 | ') +
            (item.temperature && item.temperature != '' ? item.temperature : '--')
          return item
        }),
      },
      function () {
        for (let i = 0; i < self.data.modeList.length; i++) {
          if (self.data.modeList[i].key == modeKey) {
            self.selecteItem(
              {
                currentTarget: {
                  dataset: { index: i, bool: false },
                },
              },
              false
            )
            break
          }
        }
        if (!self.data.versionInfo || !self.data.versionInfo.otaVersion || true) {
          for (let i = 0; i < self.data.diyModeList.length; i++) {
            if (self.data.diyModeList[i].key == modeKey) {
              self.selecteItem(
                {
                  currentTarget: {
                    dataset: { index: i, bool: true },
                  },
                },
                false
              )
              break
            }
          }
        }
      }
    )

    if (this.data.versionInfo && this.data.versionInfo.otaVersion && id) {
      for (let i = 0; i < this.data.otaModeList.length; i++) {
        if (this.data.otaModeList[i].id == id) {
          this.setData({
            selectedOta: this.data.otaModeList[i],
          })
          modeKey == 36 &&
            this.selecteItem(
              {
                currentTarget: {
                  dataset: { index: i, bool: true },
                },
              },
              false
            ) //当为云消毒模式时，更新选中状态
          break
        }
      }
    }
  },

  reloadImg(e) {
    let mode = e.target.dataset.curMode
    mode.activeImgSrc = this.data.placeholdImg
    mode.imgSrc = this.data.grayPlaceholdImg
  },

  getItem(key) {
    //异步转同步
    return new Promise((resolve, reject) => {
      wx.getStorage({
        key,
        success(res) {
          if (res.data == 'undefined') {
            resolve(undefined)
          } else if (res.data.split('{').length > 1) {
            resolve(JSON.parse(res.data))
          } else {
            resolve(res.data)
          }
        },
        fail(res) {
          reject(res.errMsg + ' ' + key)
        },
      })
    })
  },

  getOtaModeList() {
    service.getOtaModeList()
  },

  selecteItem(
    {
      currentTarget: {
        dataset: { index, bool },
      },
    },
    jump = true
  ) {
    // index 代表选中项下标  bool值 true-diy功能 false-常用功能
    let selectedIndex = 0
    let selectedMode = {}
    if (bool) {
      // selectedMode =
      //   (this.data.cloudModeList && this.data.cloudModeList.length > 0 && this.data.cloudModeList[index]) ||
      //   this.data.diyModeList[index]
      selectedIndex = index + this.data.NUM
      selectedMode = this.data.diyModeList[index]
    } else {
      selectedIndex = index
      selectedMode = this.data.modeList[index]
    }
    this.setData({
      selectedIndex: selectedIndex,
      selectedMode: selectedMode,
    })

    wx.setStorageSync('selectMode', this.data.selectedMode)
    wx.setStorageSync(`${this.data.deviceInfo.applianceCode}modeKey`, this.data.selectedMode.key)
    jump && wx.navigateBack()

    // this.fun_finish()
  },

  fun_finish() {
    let self = this
    // let selectedModeChannel = new BroadcastChannel('selectedModeUpdate')
    if (self.data.versionInfo && self.data.versionInfo.otaVersion && self.data.selectedIndex >= 20) {
      let list = self.data.selectedMode.cmd.split(' ')
      // let param = {
      //   operation: 'luaControl',
      //   params: {
      //     is_ota: true,
      //     cmd: list.join(','),
      //   },
      // }

      this.luaControl({
        is_ota: true,
        cmd: list.join(','),
      })
        .then((data) => {
          if (data.errorCode == 0 && data.result.ota_load_state == 'success') {
            let mode = self.translate(self.data.selectedMode)
            // self.selectedOta = self.selectedMode
            this.setData({
              selectedOta: self.data.selectedMode,
            })
            // nativeService.toast('设备定制成功！')
            wx.showToast({
              title: '设备定制成功！',
              icon: 'none',
            })
            // setTimeout(wx.navigateBack, 500)
            // selectedModeChannel.postMessage(mode) todo
          } else {
            // nativeService.toast('设备定制失败,请稍后重试！')
            wx.showToast({
              title: '设备定制失败,请稍后重试！',
              icon: 'none',
            })
          }
        })
        .catch((error) => {
          // nativeService.alert("接口不通" + JSON.stringify(error));
          // nativeService.toast('网络异常，请稍后重试')
          wx.showToast({
            title: '网络异常，请稍后重试',
            icon: 'none',
          })
        })
    } else {
      // selectedModeChannel.postMessage(self.selectedMode) todo
      // nativeService.goBack()
      wx.navigateBack()
    }
  },

  translate(otaMode) {
    // ota形式转普通模式
    let mode = JSON.parse(JSON.stringify(otaMode))
    mode.key = '36'
    mode.text = otaMode.name
    mode.time = otaMode.duration
    mode.temperature = otaMode.maxTemp + '°C'
    mode.imgSrc = ''
    mode.activeImgSrc = ''
    mode.isDiy = true
    return mode
  },

  // 发送设备控制指令
  luaControl(param, setAppData = true) {
    wx.showLoading({
      title: '',
      mask: true,
    })
    return requestService
      .request('luaControl', {
        reqId: getReqId(),
        stamp: getStamp(),
        applianceCode: this.data.deviceInfo.applianceCode,
        command: {
          control: param,
        },
      })
      .then((res) => {
        if (res.data.code == 0) {
          // setAppData && this.luaQuery(false)
          return res //.data.data.status || {}
        }
        return Promise.reject(res)
      })
      .catch((error) => {
        wx.showToast({
          title: '请求失败，请稍后重试',
          icon: 'none',
        })
        return Promise.reject(error)
      })
      .finally(wx.hideLoading)
  },
})
