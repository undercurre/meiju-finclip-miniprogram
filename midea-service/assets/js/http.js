import { requestService } from '../../../utils/requestService'
import { getParameters } from 'm-utilsdk/index'
const app = getApp()
const service = {
  // 故障列表
  getTrobule(getData) {
    return new Promise((resolve, reject) => {
      let params = {
        body: {
          interfaceSource: 'SMART',
          depth: 3,
          parentServiceRequireCode: 'BX',
          brandCode: getData.brandCode, //查询品牌selectedProduct.brandCode
          prodCode: getData.prodCode, //查询品类selectedProduct.prodCode
        },
      }
      // let data = JSON.stringify(params)
      requestService.request('getTrobuleList', params).then(
        (resp) => {
          if (resp && resp.data && resp.data.status == true) {
            resolve(resp.data.list)
          } else {
            reject(resp)
          }
        },
        (error) => {
          reject(error)
        }
      )
    })
  },

  // 安装服务提交表单
  sendOrderForm(data) {
    return new Promise((resolve, reject) => {
      let params = JSON.stringify(data)
      console.log(params)
      requestService.request('sendOrderForm', params).then(
        (resp) => {
          console.log(resp)
          console.log('resp')
          if (resp && resp.data && resp.data.status == true) {
            resolve(resp.data.data)
          } else {
            reject(resp.data)
          }
        },
        (error) => {
          reject(error.data)
        }
      )
    })
  },
  // 有没有帮助
  hasHelpOrNot(data) {
    return new Promise((resolve, reject) => {
      // let params = JSON.stringify(data)
      // console.log(params)
      requestService.request('hasHelpOrNot', data).then(
        (resp) => {
          console.log(resp)
          console.log('resp')
          if (resp && resp.data && resp.data.status == true) {
            resolve(resp.data.data)
          } else {
            reject(resp.data)
          }
        },
        (error) => {
          reject(error.data)
        }
      )
    })
  },
  // 默认地址
  getDefaultAddress() {
    let data = {
      headParams: {},
      restParams: {
        mobile: app.globalData.userData.userInfo.mobile,
        sourceSys: 'IOT',
      },
    }
    return new Promise((resolve, reject) => {
      requestService.request('getDefaultAddress', data).then(
        (resp) => {
          if (resp && resp.data && resp.data.code == 0) {
            resolve(resp.data.data)
          } else {
            reject(resp)
          }
        },
        (error) => {
          reject(error)
        }
      )
    })
  },
  //发送验证码
  sendMobileCode(mobile0) {
    // let data = {
    //   mobile: mobile0,
    // }
    let data = {
      restParams:{
        mobile:mobile0
      }
    }
    return new Promise((resolve, reject) => {
      requestService.request('sendMobileCode', data).then(
        (resp) => {
          if (resp && resp.data && resp.data.code == 0) {
            resolve(resp.data)
          } else {
            reject(resp)
          }
        },
        (error) => {
          reject(error)
        }
      )
    })
  },
  // 提交验证
  commitMobileCode(mobileData) {
    return new Promise((resolve, reject) => {
      requestService.request('commitMobileCode', mobileData).then(
        (resp) => {
          if (resp && resp.data && resp.data.code == 0) {
            resolve(resp.data)
          } else {
            reject(resp)
          }
        },
        (error) => {
          reject(error)
        }
      )
    })
  },
  //获取故障可能的原因
  getexcludedfaultlist(params) {
    return new Promise((resolve, reject) => {
      requestService.request('getexcludedfaultlist', params).then(
        (resp) => {
          if (resp && resp.data && resp.data.status == true) {
            resolve(resp.data)
          } else {
            reject(resp)
          }
        },
        (error) => {
          reject(error)
        }
      )
    })
  },
  //判断时间是不是显示
  checkTimeShow(params) {
    // let {apiName,param}=params
    return new Promise((resolve, reject) => {
      requestService.request('checkTimeShow', params, 'GET').then(
        (resp) => {
          console.log(resp)
          console.log('resp')
          if (resp && resp.data && resp.data.returnStatus == true) {
            resolve(resp.data)
          } else {
            reject(resp)
          }
        },
        (error) => {
          reject(error)
        }
      )
    })
  },
  //解析接口
  barcodeAnalysis(params) {
    console.log('进入解析接口')
    return new Promise((resolve, reject) => {
      requestService.request('barcodeAnalysis', params).then(
        (resp) => {
          console.log(resp)
          console.log('resp')
          if (resp && resp.data && resp.data.status == true) {
            console.log('解析跳码')
            resolve(resp.data)
          } else {
            console.log(resp)
            reject(resp)
          }
        },
        (error) => {
          console.log(error)
          reject(error)
        }
      )
    })
  },
  //上传视频
  upLoadVideo(params) {
    console.log('进入视频接口')
    return new Promise((resolve, reject) => {
      requestService.request('upLoadVideo', params).then(
        (resp) => {
          console.log(resp)
          console.log('resp')
          if (resp && resp.data && resp.data.status == true) {
            console.log('上传视频')
            resolve(resp.data)
          } else {
            console.log(resp)
            reject(resp)
          }
        },
        (error) => {
          console.log(error)
          reject(error)
        }
      )
    })
  },

  // 处理扫码的结果 ,解析返回
  //扫描条形/二维码
  convertScanResult(scanResult) {
    console.log('解析我执行了啊')
    console.log(scanResult)
    let scanResultObj = {
      code: '',
      type: '',
    }
    if (scanResult.indexOf(',') != -1) {
      // 扫条形码，可能会带'ITF,xxxxxxx', 截取后半部
      let tmp = scanResult.split(',')
      scanResultObj.code = tmp.length === 1 ? tmp[0] : tmp[1]
      scanResultObj.type = '60'
    } else if (getParameters(scanResult, 'tsn')) {
      //二维码
      scanResultObj.code = getParameters(scanResult, 'tsn')
      scanResultObj.type = '0'
      // } else if (util.getParameters(scanResult, "cd")) {
      //     //二维码
      //     scanResultObj.code = util.getParameters(scanResult, "cd")
      //     scanResultObj.type = '0'
    } else if (/^[0-9a-zA-Z]+$/.test(scanResult)) {
      // 扫条形码
      scanResultObj.code = scanResult
      scanResultObj.type = '60'
    }
    console.log(scanResultObj)
    console.log('scanResultObj')
    return scanResultObj
  },

  // 网点查询
  queryunitarchives(params) {
    console.log('进入网点')
    params = {
      body: {
        ...params,
      },
    }
    return new Promise((resolve, reject) => {
      requestService.request('getUnitArchivesData', params).then(
        (resp) => {
          console.log(resp)
          console.log('resp')
          if (resp && resp.data && resp.data.status == true) {
            console.log('网点成功')
            resolve(resp.data)
          } else {
            console.log(resp)
            reject(resp)
          }
        },
        (error) => {
          console.log(error)
          reject(error)
        }
      )
    })
  },
  //获取省市区
  getAreaDetail(params) {
    console.log(params.regionCode)
    let reqData = {
      restParams: {
        parentCode: params.regionCode,
        sourceSys: 'APP',
      },
      headParams: {},
    }
    return new Promise((resolve, reject) => {
      requestService.request('getAreaList', reqData, 'POST').then(
        (resp) => {
          console.log(resp)
          if (resp && resp.data) {
            resolve(resp.data)
          } else {
            console.log(resp)
            reject(resp)
          }
        },
        (error) => {
          console.log(error)
          reject(error)
        }
      )
    })
  },
  getProductBySerialNoNew(sNo) {
    console.log(sNo)
    return new Promise((resolve, reject) => {
      let reqData = {
        // "serialNo": '0000EA311610014551C121H00008'
        serialNo: '00001300A2222222286018C1BB610000',
        // "serialNo": sNo
      }
      requestService.request('getMaintenanceFromTsnDsn', reqData).then(
        (resp) => {
          console.log(resp)
          if (resp.data.code == 0) {
            resolve(resp.data.data)
          } else {
            reject(resp)
          }
        },
        (error) => {
          reject(error)
        }
      )
    })
  },
}
export { service }
