import { getTimeStamp, getReqId, getStamp } from 'm-utilsdk/index'
import { requestService } from '../../../../../utils/requestService'
import config from '../../../../../config' //环境及域名基地址配置
// import { api } from '../../../../../api'
const environment = config.environment
// const isMasEnv = config.isMasEnv
// const masPrefix = config.masPrefix
// const domain = config.domain
const myxAppkey = config.myxAppkey[environment]
const myxSecret = config.myxSecret[environment]
import { md5 } from '../../../../../miniprogram_npm/m-utilsdk/index'

const service = {
  // 解析qrtext
  analyzeQRtext(params) {
    return new Promise((resolve, reject) => {
      let reqData = {
        headParams: {},
        restParams: {
          model: params.qrtext,
        },
        // qrtext:'4oMiCLMqzY5eDZ1KnG_twg==',
        reqId: getReqId(),
        stamp: getTimeStamp(new Date()),
      }
      requestService.request('selectNewMsProduct', reqData).then(
        (resp) => {
          if (resp.data.code == '000000') {
            resolve(resp)
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
  getHomeGrouplistService: () => {
    //获取家庭列表
    let reqData = {
      reqId: getReqId(),
      stamp: getStamp(),
    }
    return new Promise((resolve, reject) => {
      requestService.request('homeList', reqData).then(
        (resp) => {
          console.log(resp)
          if (resp.data.code == 0) {
            resolve(resp.data.data.homeList)
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
  // TSN/DSN获取数据
  getFromTsnDsn: (sNo) => {
    let reqData = {}
    if (sNo.type && !sNo.tsn) {
      reqData = {
        type: sNo.type,
      }
    } else {
      reqData = {
        sn: sNo.tsn,
      }
    }
    // getFromType
    let codeUrl = !reqData.type ? 'getFromTsnDsn' : 'getFromType'
    return new Promise((resolve, reject) => {
      requestService.request(codeUrl, reqData).then(
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
  // 产品编码，返回产品主图
  getImgFromTsnDsn: (sNo) => {
    let reqData = {
      salesCode: sNo,
    }
    return new Promise((resolve, reject) => {
      requestService.request('getImgFromTsnDsn', reqData).then(
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
  // TSN/DSN获取事业部通过内容中心配置的动态内容
  getDyContentFromTsnDsn: (sNo) => {
    let reqData = sNo
    return new Promise((resolve, reject) => {
      requestService.request('getDyContentFromTsnDsn', reqData).then(
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
  // 虚拟插件页美云销商品中心查询页面详情（页面ID）
  getDetailByPageId() {
    let reqData = {
      headParams: {},
      restParams: {
        applicationCode: 'APP202105250001EXT',
        platformCode: 'Meiju_Wechat_Applet',
        pageId: '925474378275155968',
        categoryCode: 'NonsmartDevice',
        extendInfo: ['relativeInfo'],
      },
    }
    return new Promise((resolve, reject) => {
      requestService.request('getDetailByPageId', reqData).then(
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
  // 美云销商品中心查询商品列表   外部接口
  getOutProductList(data) {
    let reqData = {
      headParams: {},
      pagination: {},
      restParams: {
        productCode: data.salesCode,
        // productModel: data.productModel,
        // tenantCode: 'T20201223044749',
      },
    }
    return new Promise((resolve, reject) => {
      requestService.request('getOutProductList', reqData).then(
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
  // 美云销商品中心查询商品列表
  getTsnDsnProductList(data) {
    let reqData = {
      headParams: {},
      pagination: {},
      restParams: {
        productCode: data.productCode,
        productModel: data.productModel,
        tenantCode: 'T20201223044749',
      },
    }
    return new Promise((resolve, reject) => {
      requestService.request('getTsnDsnProductList', reqData).then(
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
  // 美云销商品中心查询营销分类
  getQueryMarketCategory() {
    let reqData = {}
    return new Promise((resolve, reject) => {
      requestService.request('getQueryMarketCategory', reqData).then(
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
  // 获取权限信息
  scanToBenefits(params) {
    let reqData = params
    console.log(reqData)
    console.log('你好啊')
    return new Promise((resolve, reject) => {
      requestService.request('scanToBenefits', reqData).then(
        (resp) => {
          console.log(resp)
          console.log('你好啊')
          if (resp.data.retcode == 'SUCC') {
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
  // 扫码365 不弹权益框
  mdtScanToBenefits(params) {
    let reqData = params
    console.log(reqData)
    console.log('你好啊')
    return new Promise((resolve, reject) => {
      requestService.request('mdtScanToBenefits', reqData).then(
        (resp) => {
          console.log(resp)
          console.log('你好啊')
          // if (resp.data.retcode == 'SUCC') {
          //   resolve(resp.data.data)
          // } else {
          //   reject(resp)
          // }
        },
        (error) => {
          reject(error)
        }
      )
    })
  },
  // 批量添加我的家电
  addMyAppliances(params) {
    console.log(params)
    console.log('666666')
    let reqData = params
    return new Promise((resolve, reject) => {
      requestService.request('addMyAppliances', reqData).then(
        (resp) => {
          console.log(resp)
          console.log('你好批量家电')
          if (resp.data.code == '000000') {
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
  //企业微信无参数限制请求活码 ;按成员号码请求随机成员二维码
  comPanyWetChat(params) {
    let data = params
    console.log(data)
    console.log('你好啊')
    console.log(myxAppkey)
    console.log(getStamp())
    console.log(myxSecret)
    let asigns = md5(myxAppkey + getStamp() + myxSecret)
    console.log(asigns)
    // let header = {
    //   'content-type': 'application/json',
    //   random: getStamp(),
    //   secretVersion: '1.0',
    //   version: '8.5',
    // }
    let reqData = {
      ...data,
      appKey: myxAppkey,
      timeStamp: getStamp(),
      sign: asigns,
    }
    console.log(reqData)
    console.log('reqData' + '我是企业新接口')
    return new Promise((resolve, reject) => {
      // wx.request({
      //   url: api['comPanyWetChat'].masUrl + '&appKey=' + myxAppkey + '&timeStamp=' + getStamp() + '&sign=' + asigns,
      //   data: params,
      //   header: header,
      //   method: 'POST',
      //   timeout: 15000,
      //   success(resData) {
      //     console.log(resData)
      //     console.log('9999')
      //     if (resData.data.code == '000000') {
      //       resolve(resData.data.data)
      //     }
      //   },
      //   fail(error) {
      //     console.log('3333')
      //     reject(error)
      //   },
      // })
      requestService.request('comPanyWetChat', reqData, 'GET').then(
        (resp) => {
          console.log(resp)
          console.log('你好企业微信')
          if (resp.data.code == '000000') {
            resolve(resp.data.data)
          }
        },
        (error) => {
          reject(error)
        }
      )
    })
  },
  // 上传图片到美云销
  commitImgToMscp(params) {
    let reqData = params
    console.log(reqData)
    console.log('你好啊')
    return new Promise((resolve, reject) => {
      requestService.request('commitImgToMscp', reqData).then(
        (resp) => {
          console.log(resp)
          console.log('你好啊')
          if (resp.data.retcode == 'SUCC') {
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
