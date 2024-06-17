import { requestService } from '../../../../utils/requestService'
import { showToast, getReqId, getTimeStamp }  from 'm-utilsdk/index'
module.exports = Behavior({
  behaviors: [],
  properties: {},
  data: {
    isLoading: false,
  },
  methods: {
    //个人中心
    createDailyScore() {
      wx.showLoading({
        title: '加载中...',
      })
      this.setData({ isLoading: true })

      return new Promise((resolve, reject) => {
        let data = {
          // uid: uid
        }
        console.log('个人中心签到接口')
        requestService
          .request('createDailyScore', data, 'GET')
          .then((res) => {
            this.setData({ isLoading: false })
            if (res.data.code === 0) {
              console.log('个人中心签到接口成功返回', res.data)
              resolve(res)
            } else {
              console.log('个人中心签到接口失败返回', res.data)
              reject()
            }
            wx.hideLoading()
          })
          .catch((err) => {
            wx.hideLoading()
            console.log('个人中心签到接口校验失败返回', err)
            showToast('程序员小哥哥植发去了，请稍后重试')
            this.setData({ isLoading: false })
            reject()
          })
      })
    },
    //个人中心签到，同步签到信息到连续签到
    modifyuserregisterquery() {
      wx.showLoading({
        title: '加载中...',
      })
      this.setData({ isLoading: true })

      return new Promise((resolve, reject) => {
        let data = {
          // uid: uid
        }
        console.log('个人中心签到接口')
        requestService
          .request('modifyuserregisterquery', data, 'GET')
          .then((res) => {
            this.setData({ isLoading: false })
            if (res.data.code === 0) {
              console.log('个人中心签到接口成功返回', res.data)
              resolve(res)
            } else {
              console.log('个人中心签到接口失败返回', res.data)
              reject()
            }
            wx.hideLoading()
          })
          .catch((err) => {
            wx.hideLoading()
            console.log('个人中心签到接口校验失败返回', err)
            showToast('程序员小哥哥植发去了，请稍后重试')
            this.setData({ isLoading: false })
            reject()
          })
      })
    },
    //个人中心-查询连续签到信息
    checkisresetquery1() {
      wx.showLoading({
        title: '加载中...',
      })
      this.setData({ isLoading: true })

      return new Promise((resolve, reject) => {
        let data = {
          registeractid: '1001',
          reqId: getReqId(),
          stamp: getTimeStamp(new Date()),
        }
        console.log('个人中心签到接口')
        requestService
          .request('checkisresetquery', data, 'GET')
          .then((res) => {
            this.setData({ isLoading: false })
            if (res.data.code === 0) {
              console.log('个人中心签到接口成功返回', res.data)
              resolve(res)
            } else {
              console.log('个人中心签到接口失败返回', res.data)
              reject()
            }
            wx.hideLoading()
          })
          .catch((err) => {
            wx.hideLoading()
            console.log('个人中心签到接口校验失败返回', err)
            showToast('程序员小哥哥植发去了，请稍后重试')
            this.setData({ isLoading: false })
            reject()
          })
      })
    },
  },
})
