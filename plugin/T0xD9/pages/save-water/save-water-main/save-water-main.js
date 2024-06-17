// plugin/T0xDB/pages/save-water/save-water-main/save-water-main.js
import deviceUtils from '../../../utils/deviceUtils'
// import Dialog from '../../../component/vant/dialog/dialog'
import Dialog from '../../../../../miniprogram_npm/m-ui/mx-dialog/dialog'

const DEFAULT_POSITION = [{}]
let intval = 0
const pageWidth = 375
const dripTypes = {
  1: '设备激活',
  2: '程序运行',
  4: '每日登录',
  5: '签到活动',
}
Page({
  /**
   * 页面的初始数据
   */
  data: {
    allY: [50, 30, -6, -6, 30, 50],
    allX: [10, 55, 100, 215, 260, 305],
    isOwner: 0,
    params: {},
    popupShow: false,
    homepageData: {
      userStatus: 0, // 0:被禁止 1：正常
      signCount: 0, //  本周签到次数
      signTodayFlag: -1, // 今天是否签到
      dripCount: 0, //  现有水滴数量
      dripInfoList: [],
      productInfoList: [],
      activityDesc: '',
    },
    weekDripCountList: Array.of(50, 50, 50, 50, 50, 100, 100),
    maxCount: 60000,
    viewCount: 6,
    showDouble: false,
    multiple: 1,
    hasV: true,
    dataRanger: null,
    deviceId: '',
    waterList: [],
    goodsList: [],
    animateBigWater: false,
    pageHide: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options)
    this.setData({
      deviceId: options.deviceId,
      isOwner: options.isOwner,
    })
    this.getMainPageData(options.deviceId, options.isOwner)
  },
  onShow() {
    this.data.pageHide && this.getMainPageData(this.data.deviceId, this.data.isOwner)
  },
  onHide() {
    this.setData({
      pageHide: true,
    })
  },
  async getMainPageData(deviceId, isOwner) {
    let res = await deviceUtils.getSaveWaterHomeData({
      idDeviceBase: deviceId,
      ownerFlag: Number(isOwner),
    })
    console.log(res)
    if (!res || !res.data) {
      return
    }
    res = res.data
    if (res.code === 401) {
      this.setData({
        'homepageData.userStatus': 0,
      })
      this.showExceptionDialog()
    } else if (res.code === 200) {
      this.createWater()
      this.setData({
        homepageData: res.data,
      })
      this.resetGoodsList()
      this.resetWaterList()
      if (this.data.homepageData.userStatus === 0) {
        this.showExceptionDialog()
      }
    } else {
      wx.showToast({
        title: res.message,
        icon: 'none',
      })
    }
  },
  resetGoodsList() {
    this.setData({
      goodsList: this.data.homepageData.productInfoList.slice(0, 2),
    })
  },
  resetWaterList() {
    let waterList = []
    this.data.homepageData.dripInfoList.forEach((item, index) => {
      let providedTime = item.providedTime
      let hours = (new Date().getTime() - new Date(providedTime).getTime()) / (1000 * 60 * 60)
      let opacity = 1
      if (hours < 24) {
        opacity = 1
      } else if (hours < 24 * 2) {
        opacity = 0.9
      } else if (hours < 24 * 3) {
        opacity = 0.8
      } else if (hours < 24 * 4) {
        opacity = 0.7
      } else if (hours < 24 * 5) {
        opacity = 0.6
      } else if (hours < 24 * 6) {
        opacity = 0.5
      } else if (hours < 24 * 7) {
        opacity = 0.4
      } else {
        opacity = 0.3
      }
      if (item.hide) {
        opacity = 0
      }
      waterList.push({
        waterNums: item.dripCount,
        desc: dripTypes[item.idTaskInfo],
        idDripInfo: item.idDripInfo,
        clicked: item.clicked,
        style: {
          top: this.data.allY[index] * 2 + 'rpx',
          left: this.data.allX[index] * 2 + 'rpx',
          opacity,
        },
      })
    })
    console.log('water list', waterList)
    this.setData({
      waterList: waterList.slice(0, 6),
    })
  },
  randomNum(min, max) {
    return min + Math.floor(Math.random() * (max - min))
  },
  createWater() {
    let randomArryX = []
    const count = 6
    for (let i = 0; i < count; i++) {
      randomArryX[i] = this.randomNum(0, count)
      for (let j = 0; j < i; j++) {
        if (randomArryX[i] === randomArryX[j]) {
          i--
          break
        }
      }
    }
    let allX = []
    let allY = []
    let xy = [
      '10,50',
      10 + pageWidth / 8 + ',30',
      10 + pageWidth / 4 + ',-6',
      pageWidth - 55 - pageWidth / 4 + ',-6',
      pageWidth - 55 - pageWidth / 8 + ',30',
      pageWidth - 55 + ',50',
    ]
    for (let i = 0; i < randomArryX.length; i++) {
      let arr = xy[randomArryX[i]].split(',')
      allX.push(arr[0])
      allY.push(arr[1])
    }
    console.log(allX)
    this.setData({
      allX,
      allY,
    })
  },
  clickMore() {
    if (this.data.goodsList.length > 0) {
      wx.navigateTo({
        url: '../save-water-list/save-water-list?deviceId=' + this.data.deviceId,
      })
    } else {
      wx.navigateTo({
        url: '',
      })
    }
  },
  clickGoodsItem(e) {
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url:
        '../save-water-detail/save-water-detail?id=' + e.currentTarget.dataset.id + '&deviceId=' + this.data.deviceId,
    })
  },
  clickSignIn() {
    if (this.data.homepageData.signTodayFlag === -1) {
      return
    }
    if (this.data.homepageData.signTodayFlag === 1) {
      wx.showToast({
        title: '您今日已完成签到，明日再来吧',
        icon: 'none',
      })
      return
    }
    if (this.data.homepageData.userStatus === 0) {
      this.showExceptionDialog()
    } else {
      deviceUtils
        .signInSaveWater({
          idDeviceBase: this.data.deviceId,
        })
        .then((res) => {
          if (res.data.code === 401) {
            this.setData({
              'homepageData.userStatus': 0,
            })
          } else if (res.data.code === 200) {
            this.setData({
              'homepageData.dripCount': res.data.data.dripCount,
              'homepageData.signCount': res.data.data.signCount,
              'homepageData.signTodayFlag': 1,
            })
            if (this.data.homepageData.dripCount >= this.maxCount) {
              wx.showToast({
                title: '水滴已满，请及时兑换',
                icon: 'none',
              })
            } else {
              if (res.data.data.multiple > 1 && !isNaN(res.data.data.multiple)) {
                this.setData({
                  multiple: res.data.data.multiple,
                  showDouble: true,
                })
                setTimeout(() => {
                  this.setData({
                    showDouble: false,
                  })
                }, 2000)
              } else {
                setTimeout(() => {
                  this.setData({
                    animateBigWater: true,
                  })
                  setTimeout(() => {
                    this.setData({
                      animateBigWater: false,
                    })
                  }, 1000)
                }, 100)
              }
              wx.showToast({
                title: '签到成功',
                icon: 'none',
              })
            }
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
            })
          }
        })
    }
  },
  clickSmallWater(e) {
    console.log(e)
    let water = e.currentTarget.dataset.water
    if (this.data.homepageData.userStatus === 0) {
      this.showExceptionDialog()
    } else {
      if (this.data.homepageData.dripCount >= this.maxCount) {
        wx.showToast({
          title: '水滴已满，请及时兑换',
          icon: 'none',
        })
        return
      } else if (this.data.homepageData.dripCount + water.waterNums > this.maxCount) {
        wx.showToast({
          title: '水滴已满，请及时兑换',
          icon: 'none',
        })
        return
      }
      deviceUtils
        .drawSaveWaterDrip({
          idDeviceBase: this.data.deviceId,
          idDripInfo: water.idDripInfo,
        })
        .then((res) => {
          if (res.data.code === 401) {
            this.setData({
              'homepageData.userStatus': 0,
            })
            this.showExceptionDialog()
          } else if (res.data.code === 200) {
            let dripInfoList = this.data.homepageData.dripInfoList
            let index = dripInfoList.findIndex((item) => {
              return item.idDripInfo === water.idDripInfo
            })
            dripInfoList[index].clicked = true
            this.setData({
              'homepageData.dripCount': res.data.data.dripCount,
              'homepageData.dripInfoList': dripInfoList,
            })
            this.resetWaterList()
            setTimeout(() => {
              if (dripInfoList[this.data.viewCount]) {
                dripInfoList[index].clicked = false
                dripInfoList.splice(index, 1, dripInfoList[this.data.viewCount])
                dripInfoList.splice(this.data.viewCount, 1)
              } else {
                dripInfoList[index].hide = true
              }
              this.setData({
                'homepageData.dripInfoList': dripInfoList,
                animateBigWater: true,
              })
              setTimeout(() => {
                this.setData({
                  animateBigWater: false,
                })
              }, 1000)
              this.resetWaterList()
            }, 1200)
            console.log(this.data.homepageData.dripInfoList)
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
            })
          }
        })
    }
  },
  showExceptionDialog() {
    Dialog.alert({
      title: '异常提示',
      message: '由于您的账号异常，已被限制参与活动，如有疑问，请立即申诉。',
      confirmButtonText: '立即申诉',
      beforeClose: (action, done) => {
        console.log('申诉')
        let encodeLink = encodeURIComponent('https://wj.midea.com/vm/eOHLyge.aspx')
        let currUrl = `../../../../../pages/webView/webView?webViewUrl=${encodeLink}`
        wx.navigateTo({
          url: currUrl,
        })
        return true
      },
    })
  },
  formatDate(time) {
    let date = new Date(time)
    return date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日'
  },
  clickRule() {
    let rule = '【活动时间】\n'
    rule +=
      this.formatDate(this.data.homepageData.beginTime) + '至' + this.formatDate(this.data.homepageData.endTime) + '\n'
    rule += '【水滴获取规则】\n'
    rule += '1.累计签到，累计签到1-5天，每日获得50g水滴，累计签到6-7天，每日获得100g水滴；\n'
    rule += '2.洗衣完成（限洗衣机和干衣机），每日洗衣完成后奖励100g水滴；\n'
    rule += '3.用户访问插件页（限洗衣机和干衣机），可获得50g水滴；\n'
    rule += '4.新用户首次绑定设备（限洗衣机和干衣机），赠送2000水滴；\n'
    rule += '【水滴使用说明】\n'
    rule +=
      '1.以用户账号为单位，完成任务即可发放水滴，每人每日最多领取三次水滴，每台设备每日发放水滴次数不超过3次；若一个家庭中有多个成员，则任一成员使用程序并完成之后，家庭中每个人都各得100g水滴。\n'
    rule += '2.水滴发放后，用户需要点击水滴收取，7日有效，超过期限未收取，水滴将消失；\n'
    rule += '3.活动期间，以用户账号为单位，用户的水滴存量上限不超过60000g；\n'
    rule += '4.活动期间，用户可以使用水滴兑换洗护耗材商品的专用无门槛优惠券，使用优惠券到美的商城购买相应的商品；\n'
    rule += '【特别说明】\n'
    rule += '1.活动期间，用户兑换完成优惠券，水滴一旦扣除成功，若非系统原因导致，将不再返还；\n'
    rule += '2.活动期间，获取水滴均为线上自动发放，请保证设备联网通畅，不被干扰，否则将影响水滴发放；\n'
    rule += '3.活动过程中，如果出现因网络攻击、黑客攻击、数据泄露等原因导致活动无法继续，主办方有权利提前终止活动；\n'
    rule +=
      '4.活动过程中，不得使用任何外挂、插件以及其他破坏活动规则、违背活动公平原则的方式参与本次活动（包括但不仅限于侵犯第三人合法权益、作弊、扰乱系统、机器注册、机器模拟客户端等），否则主办方有权取消该账号活动参与资格及奖励，必要时取消后续参与美的美居任意活动的权利，并追究法律责任；\n'
    rule += '5.本活动以自愿参加为原则，不强制参与，活动的最终解释权归美居APP所有；'
    Dialog.alert({
      title: '活动规则',
      message: rule,
      messageAlign: 'left',
    })
  },
})
