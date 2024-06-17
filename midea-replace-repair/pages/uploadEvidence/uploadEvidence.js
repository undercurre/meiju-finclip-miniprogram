// midea-replace-repair/pages/uploadLocalImage/uploadLocalImage.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showCalendarPickerFlag: false, //time picker true false
    evidenceData: [
      { label: '上传发票', imageLabel: '发票' },
      { label: '上传收据', imageLabel: '收据' },
      { label: '上传设备照片', imageLabel: '设备照片' },
    ],
    photo0: {}, //发票
    photo1: {}, //收据
    photo2: {}, //设备
    showPhotoList: [{}, {}, {}],
    buyTime: '',
    isShowDialog: false,
    content: '365天换新机权益仅针对在2021年1月1日至当天购买的设备，此设备购买时间不符合要求',
    disabled: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  openChoseBox(e) {
    let that = this
    let imageData = {}
    let { showPhotoList, buyTime } = that.data,
      index = e.currentTarget.dataset.index
    console.log('openChoseBox e.index', index)
    console.log('showPhotoList', showPhotoList)
    wx.chooseImage({
      count: 1,
      // sizeType: ['original', 'compressed'],
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        const tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths)
        // console.log(res)
        let tempFiles = res.tempFiles[0]
        //   调用接口上传图片
        let base64 = 'data:image/png;base64,' + wx.getFileSystemManager().readFileSync(res.tempFilePaths[0], 'base64')
        // console.log(base64)
        imageData = {
          fileName: tempFiles.path,
          imgMeta: 'data:image/png;base64,',
          contentStr: wx.getFileSystemManager().readFileSync(res.tempFilePaths[0], 'base64'),
          imgUrl: base64,
          size: tempFiles.size,
        }
        console.log('photo imageData', imageData)
        that.setData({
          [`photo${index}`]: imageData,
        })
        let { photo0, photo1, photo2 } = that.data
        // 同步更新showPhotoList
        that.setData({
          showPhotoList: [photo0, photo1, photo2],
        })
        // 是否可提交
        if ((photo0.fileName || photo1.fileName || photo2.fileName) && buyTime) {
          that.setData({
            disabled: false,
          })
        }
        console.log('showPhotoList', that.data.showPhotoList)
      },
    })
  },

  // 删除图片
  deleteImage(e) {
    console.log('deleteImage e', e)
    let index = e.currentTarget.dataset.index
    console.log('deleteImage index', index)
    this.setData({
      [`photo${index}`]: {},
    })
    let { photo0, photo1, photo2 } = this.data
    // 同步更新showPhotoList
    this.setData({
      showPhotoList: [photo0, photo1, photo2],
    })
    console.log('photo', this.data.photo0)
    console.log('showPhotoList', this.data.showPhotoList)
    // delete image 图片删除完毕后，将按钮置灰
    let { showPhotoList } = this.data
    let isHasImg = showPhotoList.find((item) => item.fileName)
    console.log('isHasImg', isHasImg)
    this.setData({
      disabled: isHasImg ? false : true,
    })
  },

  showTimePicker() {
    this.setData({
      showCalendarPickerFlag: true,
    })
  },

  // 时间选择器 确定按钮传参
  selectDate(e) {
    let timeObj = e.detail
    let { showPhotoList } = this.data
    console.log('timeObj', timeObj)
    this.setData({
      buyTime: timeObj.date,
    })
    for (let i = 0; i < showPhotoList.length; i++) {
      showPhotoList[i].fileName ? this.setData({ disabled: false }) : ''
    }
  },

  // 提交凭证按钮
  submit() {
    let baseTime = '2021-01-01'
    var date = new Date()
    var mon = date.getMonth() + 1
    var day = date.getDate()
    var ceilTime = date.getFullYear() + '-' + (mon < 10 ? '0' + mon : mon) + '-' + (day < 10 ? '0' + day : day)
    console.log('myDate ceilTime', ceilTime)

    let { showPhotoList, buyTime } = this.data
    let newPhotoList = showPhotoList.filter((item, index, arr) => {
      console.log(arr)
      return showPhotoList[index].fileName
    })
    console.log('凭证filter newPhotoList', newPhotoList)
    var baseTimeObj = new Date(Date.parse(baseTime.replace(/-/g, '/')))
    var buyTimeObj = new Date(Date.parse(buyTime.replace(/-/g, '/')))
    var ceilTimeObj = new Date(Date.parse(ceilTime.replace(/-/g, '/')))
    console.log('baseTimeObj', baseTimeObj)
    console.log('buyTimeObj', buyTimeObj)
    console.log('ceilTimeObj', ceilTimeObj)
    if (baseTimeObj > buyTimeObj || buyTimeObj > ceilTimeObj) {
      console.log('buyTimeObj 不符合以换代新条件')
      this.setData({
        isShowDialog: true,
      })
    } else {
      console.log('buyTimeObj 中 符合以换代新条件, ')
      // backTo完善信息页面
      let pages = getCurrentPages()
      let prevPage = pages[pages.length - 2]
      //将数值信息赋值给上一页面evidenceData变量
      prevPage.setData({
        // productItem: {photoList:newPhotoList, buyTime},
        photoList: newPhotoList,
        buyTime,
      })
      // wx.navigateBack({
      //   delta: 1
      // })
      wx.navigateBack()
    }
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
