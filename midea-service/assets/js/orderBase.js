import { dateFormat } from 'm-utilsdk/index'
import { mideaServiceImgApi } from '../../../api'
// const app = getApp() //获取应用实例
module.exports = Behavior({
  properties: {},
  data: {},
  created() {},
  moved() {},
  methods: {
    convertServiceOrderStatus(order) {
      let status = order.serviceOrderStatus
      let resultStatus
      if (['10', '11', '13', '14', '15', '32'].indexOf(status) > -1) {
        if (order.serviceMethodCode == 11) {
          //已接单-送修
          resultStatus = 1
        } else if (order.serviceMethodCode == 10) {
          //已接单-上门
          resultStatus = 2
        } else {
          // 已接单
          resultStatus = 7
        }
      } else if (status == '22') {
        // 已取消
        resultStatus = 3
      } else if (['17', '18', '19', '20', '21'].indexOf(status) > -1) {
        // 已完成/已终止
        if (order.allowCallbackWX == 'Y') {
          // 已完成 - 待评价
          resultStatus = 4
        } else {
          resultStatus = 5
        }
      } else if (['33', '16', '31'].indexOf(status) > -1) {
        // 待服务
        resultStatus = 6
      }
      return resultStatus
    },
    formatOrder(order) {
      if (!order) {
        return {}
      }
      let others = {
        interfaceSourceIcon: '',
        interfaceSourceDesc: '',
        contactTimeDesc: '',
        requireServiceDate: '',
        orderDesc: '',
        imageUrl: '',
        isAbleToCancel: false, //是否可取消订单
        isAbleToCheckBranch: false, //是否可查看网点
        isAbleToUrgeOrder: false, //是否可催单
        isAbleToRenew: false, //是否可重新报单
        isAbleToCallService: false, //是否可联系网点
        isFinished: false, //是否已完成
        isAbleToAddSupplyInfo: false, //是否可补充
        statusIcon: '',
        calcServiceOrderStatus: 0,
        statusDesc: '',
        isIdentify: false, //是否显示重新鉴定 以换代修 已接单，待服务需要显示
      }
      //接入图标及渠道
      others.interfaceSourceIcon = mideaServiceImgApi.url + 'logo/' + order.interfaceSource + '.png'
      others.interfaceSourceDesc = order.originSystem
      // 剩余次数
      others.surplusAppointNumber = order.surplusAppointNumber
      //接入时间
      others.contactTimeDesc = dateFormat(new Date(order.contactTime), 'yyyy-MM-dd')
      if (order.requireServiceDate && order.requireServiceDate.trim()) {
        others.requireServiceDate = order.requireServiceDate.match(/^\d+-\d+-\d+/)[0]
      }
      //产品图片
      others.imageUrl = ''
      let prodName,
        archivesNumber = 0
      if (order.serviceUserDemandVOs && order.serviceUserDemandVOs.length > 0) {
        //订单描述
        prodName = order.serviceUserDemandVOs[0].prodName

        //档案数
        archivesNumber = order.serviceUserDemandVOs[0].archivesNumber || 0
        order.totalCount = 0
        order.serviceUserDemandVOs.forEach((item) => {
          order.totalCount += item.productAmount
        })
      }
      others.orderDesc = (order.serviceSubTypeName || order.serviceMainTypeName) + prodName

      //订单状态
      others.calcServiceOrderStatus = this.convertServiceOrderStatus(order)
      switch (others.calcServiceOrderStatus) {
        case 1:
          //已接单-送修
          others.statusDesc = '已接单'
          if (order.serviceSubTypeCode == 1111) {
            //维修
            others.statusIcon = mideaServiceImgApi.url + 'repair_img_jiedan@2x.png'
          } else {
            //安装
            others.statusIcon = mideaServiceImgApi.url + 'install_img_jiedan@2x.png'
          }
          if ((order.interfaceSource == 'SMART' || order.interfaceSource == 'MMJYWX') && archivesNumber <= 0) {
            others.isAbleToCancel = true
          }
          if (order.unitCode) {
            others.isAbleToCheckBranch = true
          }
          if (this.checkPassTime(order)) {
            others.isAbleToUrgeOrder = true
          }
          others.isAbleToAddSupplyInfo = true
          break
        case 2:
          //已接单-上门
          others.statusDesc = '已接单'
          if (order.serviceSubTypeCode == 1111) {
            //维修
            others.statusIcon = mideaServiceImgApi.url + 'repair_img_jiedan@2x.png'
          } else {
            //安装
            others.statusIcon = mideaServiceImgApi.url + 'install_img_jiedan@2x.png'
          }
          if ((order.interfaceSource == 'SMART' || order.interfaceSource == 'MMJYWX') && archivesNumber <= 0) {
            others.isAbleToCancel = true
          }
          if (this.checkPassTime(order)) {
            others.isAbleToUrgeOrder = true
          }
          others.isAbleToAddSupplyInfo = true
          break
        case 7:
          //已接单 - 其他状态
          others.statusDesc = '已接单'
          if (order.serviceSubTypeCode == 1111) {
            //维修
            others.statusIcon = mideaServiceImgApi.url + 'repair_img_jiedan@2x.png'
          } else {
            //安装
            others.statusIcon = mideaServiceImgApi.url + 'install_img_jiedan@2x.png'
          }
          if (
            (order.interfaceSource == 'SMART' || order.interfaceSource == 'MMJYWX' || order.interfaceSource == 'WCP') &&
            archivesNumber <= 0
          ) {
            others.isAbleToCancel = true
          }
          if (this.checkPassTime(order)) {
            others.isAbleToUrgeOrder = true
          }
          others.isAbleToAddSupplyInfo = true
          if (order.serviceSubTypeCode == '2020') {
            others.isIdentify = true
          }
          break
        case 3:
          // 已取消
          others.statusDesc = '已取消'
          if (order.serviceSubTypeCode == 1111) {
            //维修
            others.statusIcon = mideaServiceImgApi.url + 'repair_img_cancel@2x.png'
          } else {
            //安装
            others.statusIcon = mideaServiceImgApi.url + 'install_img_cancel@2x.png'
          }
          others.isAbleToRenew = true
          break
        case 4:
          // 已完成/已终止
          others.statusDesc = '待评价'
          if (order.serviceSubTypeCode == 1111) {
            //维修
            others.statusIcon = mideaServiceImgApi.url + 'repair_img_finish@2x.png'
          } else {
            //安装
            others.statusIcon = mideaServiceImgApi.url + 'install_img_finish@2x.png'
          }

          // if (order.interfaceSource != 'SMART') {
          //   others.allowCallbackWX = false
          // }
          others.isFinished = true
          break
        case 5:
          // 已完成
          others.statusDesc = '已完成'
          if (order.serviceSubTypeCode == 1111) {
            //维修
            others.statusIcon = mideaServiceImgApi.url + 'repair_img_finish@2x.png'
          } else {
            //安装
            others.statusIcon = mideaServiceImgApi.url + 'install_img_finish@2x.png'
          }
          others.isFinished = true
          break
        case 6:
          // 待服务
          others.statusDesc = '待服务'
          if (order.serviceSubTypeCode == 1111) {
            //维修
            others.statusIcon = mideaServiceImgApi.url + 'repair_img_wait@2x.png'
          } else {
            //安装
            others.statusIcon = mideaServiceImgApi.url + 'install_img_wait@2x.png'
          }
          if ((order.interfaceSource == 'SMART' || order.interfaceSource == 'MMJYWX') && archivesNumber <= 0) {
            others.isAbleToCancel = true
          }
          if (this.checkPassTime(order)) {
            others.isAbleToUrgeOrder = true
          }
          others.isAbleToCallService = true
          others.isAbleToAddSupplyInfo = true
          break
      }
      return Object.assign({}, order, others)
    },
    checkPassTime(order) {
      let result = false
      let now = new Date()
      if (order.contactTime && new Date(order.contactTime) < now.setHours(now.getHours() - 1)) {
        result = true
      }
      return result
    },
  },
})
