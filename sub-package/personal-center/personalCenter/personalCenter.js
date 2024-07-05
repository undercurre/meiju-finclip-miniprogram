const app = getApp() //获取应用实例
import { requestService, uploadFileTask } from '../../../utils/requestService'
import { getReqId, getStamp } from 'm-utilsdk/index'
import { showToast } from '../../../utils/util'
import { api } from '../../../api'
import { enterPersonalCneter, clickModifyPhoto, clickModifyNickname } from './assets/js/burialPoint'
import Dialog from 'm-ui/mx-dialog/dialog';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    headImgUrl: '',
    nickName: '',
    dialogShow: false,
    errorMessage: '',
    fieldValue: '',
    uid: '',
    logoMsg: 1,
    showLoading: false,
    showPictureSelect: false,
    showAuthCamera: false,
    showAuthAlbum: false,
    _checkAuthList: [], //需要申请的权限
    _agreeAuthList: [], //用户同意检查的权限
    pictureAction: [
        {
            name: '拍照',
            _index: 0
        },{
            name: '从相册选择',
            _index: 1
        }
    ]
  },
  //获取会员信息
  getVipUserInfo() {
    let data = {
      headParams: {},
      restParams: {
        sourceSys: 'IOT',
        userId: app.globalData.userData.userInfo.userId,
        brand: 1,
        mobile: app.globalData.userData.userInfo.mobile,
      },
    }
    requestService
      .request('getVipUserInfo', data)
      .then((res) => {
        wx.hideLoading()
        console.log(res, 'res')
        this.setData({
          uid: res.data.data.uid,
          headImgUrl: res.data.data.userCustomize.headImgUrl,
          nickName: res.data.data.userCustomize.nickName
        })
      })
      .catch((err) => {
        wx.hideLoading()
        console.log(err, 'err')
      })
  },
  togglePictureSelect() {
      this.setData({
        showPictureSelect: !this.data.showPictureSelect
      })
  },
  toggleAuthCamera() {
    if(this.data._checkAuthList.length == 0 || !this.data._checkAuthList.some(ele => typeof ele.cameraAuthorized !== 'undefined')){
        return Promise.resolve({hasCheck: true})
    }
    return Dialog.confirm({
        context: this,
        zIndex: 10002,
        title: '“美的美居”想获取您的摄像头使用权限',
        message: '用于扫描、拍照、录制视频及通话',
        confirmButtonText: '设置',
        cancelButtonText: '取消'
    })
  },
  toggleAuthAlbum() {
    if(this.data._checkAuthList.length == 0 || !this.data._checkAuthList.some(ele => typeof ele.albumAuthorized !== 'undefined')){
        return Promise.resolve({hasCheck: true})
    }
    return Dialog.confirm({
        context: this,
        zIndex: 10001,
        title: '“美的美居”想获取您的数据存储权限',
        message: '用于APP与插件升级更新、日志、缓存、图片截图和二维码名片的分享存储，以及图片/视频/二维码/条码的上传、扫描或识别',
        confirmButtonText: '同意并设置',
        cancelButtonText: '取消'
    })
  },
  selectPictureSource(event) {
    const appAuthorizeSetting = wx.getAppAuthorizeSetting()
    let _checkAuthList = []
    let isTakePhoto = event.detail._index == 0
    if(isTakePhoto){
        // 检查摄像头权限
        if(!appAuthorizeSetting.cameraAuthorized == 'authorized'){
            _checkAuthList.push({
                cameraAuthorized: appAuthorizeSetting.cameraAuthorized,
                authName: 'scope.camera'
            })
        }
    }
    // 检查相册权限
    if(!appAuthorizeSetting.albumAuthorized == 'authorized'){
        _checkAuthList.push({
            albumAuthorized: appAuthorizeSetting.albumAuthorized,
            authName: 'scope.writePhotosAlbum'
        })
    }
    this.setData({
        _checkAuthList: _checkAuthList
    })
    this.togglePictureSelect()

    if(isTakePhoto){
        this.takePhotoForHeadImgCheck()
    }else{
        this.choosePhotoCheck()
    }
  },
  requestAuthFromSys() {
    if(this.data._agreeAuthList.length == this.data._checkAuthList.length){
        return Promise.resolve({})
    }
    // 如果申请的权限有 ‘denied’ 则直接跳转到系统授权设置页
    if(this.data._checkAuthList.some(ele => (ele.albumAuthorized && ele.albumAuthorized == 'denied') || (ele.cameraAuthorized && ele.cameraAuthorized == 'denied'))){
        wx.openAppAuthorizeSetting()
        return Promise.reject({hasDenied: true})
    }
    let promiseList = []
    this.data._checkAuthList.forEach(ele => {
        let targetAuth = this.getSingleAuth(ele.authName)
        promiseList.push(targetAuth)
    })
    return Promise.all(promiseList)
  },
  getSingleAuth(auth) {
    return new Promise((reslove, reject) => {
        wx.authorize({
            scope: auth,
            success() {
                reslove()
            },
            fail() {
                reject()
            }
        })
    })
  },
  takePhotoForHeadImgCheck() {
    if(this.data._checkAuthList.length > 0){
        let _agreeAuthList = []
        this.toggleAuthCamera().then(res => {
            if(!res.hasCheck){
                _agreeAuthList.push('cameraAuthorized')
            }
            console.log(res)
        }).finally(() => {
            this.toggleAuthAlbum().then(result => {
                if(!result.hasCheck){
                    _agreeAuthList.push('albumAuthorized')
                }
                console.log(result)
            }).finally(() => {
                this.setData({
                    _agreeAuthList: _agreeAuthList
                })
                this.requestAuthFromSys().then(() => {
                    this.editHeadImg('camera')
                })
            })
        })
    }else{
        this.editHeadImg('camera')
    }
  },
  choosePhotoCheck() {
    if(this.data._checkAuthList.length > 0){
        let _agreeAuthList = []
        this.toggleAuthAlbum().then(result => {
            if(!result.hasCheck){
                _agreeAuthList.push('albumAuthorized')
            }
            console.log(result)
        }).finally(() => {
            this.setData({
                _agreeAuthList: _agreeAuthList
            })
            this.requestAuthFromSys().then(() => {
                this.editHeadImg()
            })
        })
    }else{
        this.editHeadImg()
    }
  },
  //修改图像
  editHeadImg(mediaType = 'image') {
    clickModifyPhoto()
    let that = this
    let sourceType = []
    if(mediaType == 'image'){
        sourceType.push('album')
    }else{
        sourceType.push('camera')
    }
    wx.chooseMedia({
      count: 1,
      mediaType: 'image',
      sizeType: ['original', 'compressed'],
      sourceType: sourceType,
      success(res) {
        console.log(res)
        let tempFiles = res.tempFiles[0]
        let base64 = 'data:image/png;base64,' + wx.getFileSystemManager().readFileSync(tempFiles.tempFilePath, 'base64')
        wx.showLoading({
          title: '新头像上传中',
          mask: true,
        })
        let reqItem = {
          fileName: tempFiles.tempFilePath,
          imgMeta: 'data:image/png;base64,',
          contentStr: wx.getFileSystemManager().readFileSync(tempFiles.tempFilePath, 'base64'),
          imgUrl: base64,
          size: tempFiles.size,
        }
        // 调用接口上传图片到美云销服务器
        that.uploadImg(reqItem)
      },
    })
  },
  // 上传图片到美云销
  uploadImg(params) {
    let that = this
    let reqData = {
      url: api.commitImgToMscp.masUrl,
      filePath: params.fileName,
      contentStr: params.contentStr,
    }
    uploadFileTask(reqData)
      .then((res) => {
        let data = JSON.parse(res)
        let reqData = {
          userCustomize: { nickName: this.data.nickName, headImgUrl: data.data },
        }
        that.data.logoMsg = 1
        that.modifyMemberInfo(reqData, 1)
      })
      .catch((err) => {
        wx.hideLoading()
        showToast('图片上传失败')
        console.log(err)
      })
  },
  //修改用户信息
  modifyMemberInfo(data) {
    let msg,
      that = this
    let reqData = { ...data, ...{ uid: this.data.uid, reqId: getReqId(), stamp: getStamp() } }
    requestService
      .request('modifyMemberInfo', reqData)
      .then((res) => {
        that.data.logoMsg == 1 ? (msg = '头像更新成功') : (msg = '昵称更新成功')
        showToast(msg)
        if (that.data.logoMsg == 2) {
          that.setData({
            errorMessage: '',
            fieldValue: '',
            dialogShow: false,
          })
        }
        that.getVipUserInfo()
        console.log(res, 'res')
      })
      .catch((err) => {
        that.data.logoMsg == 1 ? (msg = '头像更新失败') : (msg = '昵称更新失败')
        showToast(msg)
        console.log(err, 'err')
      })
  },
  //修改昵称弹窗
  editNickName() {
    clickModifyNickname()
    this.setData({
      errorMessage: '',
      fieldValue: this.data.nickName,
      dialogShow: true,
    })
  },
  //点击弹窗取消
  cancleEdit() {
    this.setData({
      errorMessage: '',
      fieldValue: '',
      dialogShow: false,
    })
  },
  //点击弹窗确定
  confirmEdit() {
    var containSpecial = RegExp(/[\\]+/)
    if (
      !this.data.fieldValue ||
      containSpecial.test(this.data.fieldValue) ||
      this.data.fieldValue.length > 15 ||
      this.data.fieldValue.match(/^\s+$/)
    ) {
      return
    }
    let reqData = { userCustomize: { nickName: this.data.fieldValue } }
    this.data.logoMsg = 2
    wx.showLoading({
      title: '新昵称修改中',
      mask: true,
    })
    this.modifyMemberInfo(reqData)
  },
  //用触发input事件校验输入内容
  onInput(e) {
    if (e.detail) {
      var containSpecial = RegExp(/[\\]+/)
      if (containSpecial.test(e.detail)) {
        this.setData({
          errorMessage: '昵称名不能含有\\特殊字符',
        })
      } else if (e.detail.length > 15) {
        this.setData({
          errorMessage: '昵称长度不能超过15',
        })
      } else if (e.detail.match(/^\s+$/)) {
        this.setData({
          errorMessage: '昵称名不能为空',
        })
      } else {
        this.setData({
          errorMessage: '',
        })
      }
    } else {
      this.setData({
        errorMessage: '昵称名不能为空',
      })
    }
    this.setData({
      fieldValue: e.detail,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    enterPersonalCneter()
    this.getVipUserInfo()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},
})
