// activities/replace365/pages/home/home.js
const app = getApp() //获取应用实例
import { requestService } from '../../../../utils/requestService'
import { login, replaceRepairCompleteInfo } from '../../../../utils/paths.js'
import { service } from 'assets/js/service'
import { replaceRepairEnterBurialPoint, clickButtonBurialPoint } from './assets/js/burialPoint'

const dcpAndCmsMapping = {
  salesCode: 'productCode',
  brand: 'brandCode',
  brandName: 'productBrand',
  userTypeCode: 'userTypeCode',
  userTypeName: 'userTypeName',
  prodCode: 'productTypeId',
  prodName: 'productType',
  productModel: 'productModel',
  productName: 'productName', //hairong lau complete add
} //dcp字段与cms字段的映射关系。当cms的字段不存在时，使用dcp的字段覆盖补全。左边是dcp，右边是cms

Page({
  behaviors: [],
  /**
   * 页面的初始数据
   */
  data: {
    isLogin: false,
    isShowDialog: false, // 没有可领取卡片的提示弹窗
    popupPicker: false, //选择家电
    productList: [],
    pList: [], //promise list
    completeList: [], //补全信息列表
    productList1: [
      {
        image: './assets/img/ic_365day@2x.png',
        name: '美的电压力锅美的电压力锅美的电压力锅美的电压力锅美的电压力锅美的电压力锅美的电压力锅美的电压力锅美的电压力锅美的电压力锅',
      },
      {
        image: './assets/img/ic_365day@2x.png',
        name: '美的电压力锅',
      },
    ],

    service: [
      {
        img: './assets/img/ic_xianshangjianding@2x.png',
        text: '线上鉴定',
      },
      {
        img: './assets/img/ic_mianfeihuanxin@2x.png',
        text: '免费换新',
      },
      {
        img: './assets/img/ic_365day@2x.png',
        text: '365天长效',
      },
    ],
    regular: [
      {
        img: './assets/img/ic_new@2x.png',
        title: '以换代修',
        describe:
          '自2021年1月1日起，自用户购机之日起第16日0时至365日24时，正常使用情况下发生性能故障，出现产品质量问题，凭有效购机凭证享有免费换新服务（释义：“换新机”和“只换不修”，“以换代修”同义）。',
      },
      {
        img: './assets/img/ic_shiyongtiaojian@2x.png',
        title: '使用条件',
        describe: '1、购买美的牌通电类小家电类目产品；\n2、经客服鉴定或用户提供服务网点鉴定产品不能正常使用。',
      },
      // {
      //   img:'./assets/img/ic_huanjitiaojian@2x.png',
      //   title:'换机条件',
      //   describe:'· 享受以换代修的产品范围∶电饭煲、煎烤机、电磁炉、电压力锅、电水壶、电热水瓶、破壁机、果汁机、豆浆机、料理机、面包机、电火锅、电炖锅、风扇、取暖器、加湿器、挂烫机、空气净化器、空气炸锅，微波炉、微烤一体机、微蒸烤一体机、纯蒸炉、蒸烤箱、小烤箱、嵌入式微波炉、嵌入式微烤一体机、嵌入式微蒸烤一体机、嵌入式电蒸炉、嵌入式蒸烤箱、嵌入式烤箱、吸尘器、扫地机器人、除螨仪等产品; \n· 以用户提交资料确认后并在线鉴定为准，符合以换代修条件即可办理换新机。'
      // },
      {
        img: './assets/img/ic_huanxinyuanze@2x.png',
        title: '换新原则',
        describe: '1、优先提供同型号产品；\n2、同型号若价格上浮，无需补偿差价；\n3、若无同型号则提供美的同价位段产品。',
      },
      {
        img: './assets/img/ic_notice@2x.png',
        title: '注意事项',
        describe:
          '1、优惠品/赠品/样机不享受此服务政策（机身标识"样机/优惠品"）；\n2、用户使用及保管不当、误用、滥用、故意损坏，或由非授权维修人员维修、保养导致的产品故障及损坏的不在此服务范围内；\n3、非性能故障不享受此服务政策；\n4、非家庭用户不享受此服务政策：本服务只针对个人及家庭用户。商用情况及工程类、团购礼品类产品不享受以换代修政策。',
      },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    //以换代修页面载入埋点
    console.log('进入以换代修活动页 埋点')
    replaceRepairEnterBurialPoint()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    app
      .checkGlobalExpiration()
      .then(() => {
        wx.hideLoading({})
        this.setData({
          isLogin: app.globalData.isLogon,
        })
      })
      .catch(() => {
        wx.hideLoading({})
        app.globalData.isLogon = false
        this.setData({
          isLogin: app.globalData.isLogon,
        })
      })
  },

  btnClick() {
    let { productList } = this.data
    if (productList && productList.length > 0) {
      this.setData({
        popupPicker: true,
      })
      return
    }
    this.getUserProductPageList()
  },
  // 点击按钮判断登录态-请求数据-弹窗
  getUserProductPageList() {
    //点击'立即领取'埋点
    console.log('进入以换代修活动页 埋点')
    clickButtonBurialPoint()
    const { isLogin } = this.data
    if (isLogin) {
      let params = {
        // isIntelligent:true,
        sourceSys: '',
        mobile: app.globalData.mobile,
        brand: 1,

        pageIndex: 1,
        pageSize: 100,
        selectType: 1,
        isIntelligent: 1,
      }
      //判断登录态
      wx.showLoading({
        title: '加载中',
        mask: true,
      })
      service
        .getUserProductPageList(params)
        .then((data) => {
          // wx.hideLoading()
          let resList = data.data.data.list
          console.log('data.data.data.list...', resList)
          if (resList && resList.length > 0) {
            //有数据显示选择家电弹窗
            let testList = [...resList]
            let warrantyList = testList.filter((item) => {
              //过滤出符合以换代修的设备
              return item.warrantyStatus == 0 && item.electronicCertificateFlag != 'Y'
              // return item.electronicCertificateFlag != "Y"
              // return item.warrantyStatus == 1
            })

            let snList = warrantyList.map((ele) => {
              //生成snlist列表
              return ele.serialNo
            })
            if (snList.length == 0) {
              wx.hideLoading()
              this.setData({
                isShowDialog: true,
              })
              return false
            }
            console.log('snList', snList)
            // 检查是否是以换代修卡
            let params = { snList }
            service
              .typeCheck(params)
              .then((res) => {
                // wx.showLoading({
                //   title: '加载中',
                //   mask:true
                // })
                console.log('typeCheck', res)
                console.log('typeCheck', res.data.data.list)
                let originalList = res.data.data.list || []
                let targetList = []
                if (originalList.length == 0) {
                  wx.hideLoading()
                  this.setData({
                    isShowDialog: true,
                  })
                  return false
                }
                originalList.forEach((ele, index) => {
                  if (ele.flag == 1) {
                    //是否支持以换代修 1为支持“以换代修”/0不支持
                    let nowParam = warrantyList[index]
                    nowParam.serialNo = ele.sn
                    targetList.push(nowParam)
                  }
                })
                console.log('typeCheck targetList', targetList)
                // 支持以换代修无数据，提示无可用设备弹窗
                if (targetList.length == 0) {
                  wx.hideLoading()
                  this.setData({
                    isShowDialog: true,
                  })
                }
                Promise.all(this.createPromiseList(targetList)).then((list) => {
                  wx.hideLoading()
                  console.log('获取的补全信息响应列表 Promise.all list', list)
                  for (let i = 0; i < targetList.length; i++) {
                    // const element = array[index];
                    for (let key in dcpAndCmsMapping) {
                      let translateKey = dcpAndCmsMapping[key]
                      console.log(`dcpItems translate = ${targetList[i][translateKey]}   |   ${list[i][key]}`)
                      if (!targetList[i][translateKey] && list[i][key]) {
                        targetList[i][translateKey] = list[i][key]
                      }
                    }
                  }
                  console.log('补全后的targetList list', targetList)
                  // 支持以换代修无数据，提示无可用设备弹窗
                  if (targetList.length > 0) {
                    this.setData({
                      productList: targetList,
                      popupPicker: true,
                    })
                  } else {
                    // 产品列表无数据，直接显示提示无设备弹窗
                    wx.hideLoading()
                    this.setData({
                      isShowDialog: true,
                    })
                  }
                })
              })
              .catch((err) => {
                wx.hideLoading()
                console.log('typeCheck err', err)
              })
          } else {
            // 无数据显示提示弹窗
            wx.hideLoading()
            this.setData({
              isShowDialog: true,
            })
          }
          console.log('productList...', this.data.productList)
        })
        .catch((err) => {
          wx.hideLoading()
          console.log('err 00', err.data)
          if (err.code == 40504) {
            wx.showToast({
              title: '请求超时',
              duration: 1500,
            })
          }
        })
    } else {
      wx.navigateTo({
        url: login,
      })
    }
  },

  createPromiseList(targetList) {
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    let pList = []
    for (let item of targetList) {
      console.log('item------------', item.serialNo)
      pList.push(
        new Promise((resolve, reject) => {
          let params = {
            codeType: '0',
            code: item.serialNo,
          }
          requestService
            .request('getProdMessage', params, 'get')
            .then((resp) => {
              wx.hideLoading()
              if (resp.data.code == 0) {
                console.log('获取到设备补全信息 getProdMessage')
                resolve(resp.data.data.product)
              } else {
                console.log('获取到设备补全信息为空 getProdMessage')
                reject(resp.data.data.product)
              }
            })
            .catch((error) => {
              wx.hideLoading()
              console.log('没有获取到设备补全信息 getProdMessage error', error)
              console.log('没有获取到设备补全信息 getProdMessage error 开发端处理兼容 未命名设备')
              // reject(error.data.data)
              let testData = {
                productType: '未命名设备',
                // productName:'未命名设备'
              }
              resolve(testData)
            })
        })
      )
    }
    return pList // promise list
  },

  getProduct(e) {
    console.log('getProduct...e', e)
    let product = e.detail
    console.log('getProduct...product', product)
    wx.navigateTo({
      url: replaceRepairCompleteInfo + `?product=${JSON.stringify(product)}`,
    })
  },
  makeSure() {},

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
