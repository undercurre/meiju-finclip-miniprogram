import { getTimeStamp, getReqId, getStamp, getUrlkey } from 'm-utilsdk/index'
import { requestService } from '../../../../utils/requestService'

//模拟数据
const isMock = false

//是否模拟设备列表
const isMockDevicelist = false
import { mockData } from 'mockData'

const service = {
  getHomeGrouplistService: () => {
    //获取家庭列表
    return new Promise((resolve, reject) => {
      if (isMock) {
        let resp = {
          data: mockData.homeList,
        }

        if (resp.data.code == 0) {
          resolve(resp.data.data.homeList)
        } else {
          reject(resp)
        }
        return
      }

      let reqData = {
        reqId: getReqId(),
        stamp: getStamp(),
      }
      requestService.request('homeList', reqData).then(
        (resp) => {
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
  getApplianceHomeDataService(homegroupId) {
    //获取当前家庭设备列表
    return new Promise((resolve, reject) => {
      if (isMockDevicelist) {
        let resp = {
          data: mockData.deviceList,
        }
        if (resp.data.code == 0) {
          resolve(resp.data.data || {})
        } else {
          reject(resp)
        }
        return
      }

      let reqData = {
        reqId: getReqId(),
        stamp: getStamp(),
        // "homegroupId": homegroupId,
        cardType: [
          {
            type: 'appliance',
            query: {
              homegroupId: homegroupId,
            },
            extra: ['uiTemplate', 'nfcDetail', 'status', 'cardOrder', 'compose'],
          },
          {
            type: 'bluetooth',
            query: {
              homegroupId: homegroupId,
            },
          },
          {
            type: 'notActive',
            query: {
              homegroupId: homegroupId,
            },
          },
          {
            type: 'applianceType',
            query: {
              homegroupId: homegroupId,
            },
          },
        ],
      }
      requestService.request('applianceListAggregate', reqData).then(
        (resp) => {
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
  homegroupDefaultSetService(homegroupId) {
    //设置默认家庭
    return new Promise((resolve, reject) => {
      if (isMock) {
        let resp = {
          data: mockData.homegroupDefaultSet,
        }
        if (resp.data.code == 0) {
          resolve()
        } else {
          reject(resp)
        }
        return
      }

      let reqData = {
        reqId: getReqId(),
        stamp: getStamp(),
        homegroupId: homegroupId,
      }
      requestService.request('homegroupDefaultSet', reqData).then(
        (resp) => {
          if (resp.data.code == 0) {
            resolve()
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
  getHomeGroupMemberStatus(homegroupId) {
    return new Promise((resolve, reject) => {
      requestService
        .request('homegroupMemberCheck', {
          reqId: getReqId(),
          stamp: getStamp(),
          homegroupId,
        })
        .then((res) => {
          if (res?.data?.code === 0) {
            resolve(res?.data?.data)
          } else {
            reject(res)
          }
        })
        .catch((e) => {
          reject(e)
        })
    })
  },
  getOnlineAdvertisement(isLogon) {
    return new Promise((resolve, reject) => {
      if (isMock) {
        let resp = {
          data: mockData.homegroupDefaultSet,
        }
        if (resp.data.code == 0) {
          resolve()
        } else {
          reject(resp)
        }
        return
      }

      let reqData = {
        appVersion: '',
        sourceSystem: 'mjapp',
        adPosCode: 'LITEFC',
        moblieSys: 'android',
      }
      const adver = isLogon ? 'getOnlineAdvertisement_token' : 'getOnlineAdvertisement'
      requestService.request(adver, reqData).then(
        (resp) => {
          if (resp.data.code == 0) {
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

  // 首页空态广告位 美云销内容  新api
  getAdvertise(params) {
    let { isLogon } = params
    delete params['isLogon']
    return new Promise((resolve, reject) => {
      let reqData = {
        ...params,
      }
      const advertimeTemp = isLogon ? 'getAdvertisement_Token' : 'getAdvertisement'
      requestService.request(advertimeTemp, reqData).then(
        (resp) => {
          if (resp.data.code == 0) {
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

  //设备确权状态
  getApplianceAuthType(applianceCode) {
    let reqData = {
      applianceCode: applianceCode,
      reqId: getReqId(),
      stamp: getStamp(),
    }
    return new Promise((resolve, reject) => {
      requestService
        .request('getApplianceAuthType', reqData)
        .then((resp) => {
          console.log('查询确权状态', resp)
          resolve(resp)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  ////批量获取设备确权状态
  getBatchAuthList(applianceCodeList) {
    let reqData = {
      reqId: getReqId(),
      stamp: getStamp(),
      applianceCodeList: applianceCodeList,
    }
    return new Promise((resolve, reject) => {
      requestService
        .request('getBatchAuth', reqData)
        .then((resp) => {
          resolve(resp)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  getIotDeviceV3() {
    let reqData = {
      reqId: getReqId(),
      stamp: getStamp(),
    }
    return new Promise((resolve, reject) => {
      requestService
        .request('getIotDeviceV3', reqData)
        .then((resp) => {
          resolve(resp)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  // 获取非智能设备
  getNonIntelligentIotDeviceV(homegroupId) {
    let reqData = {
      homegroupId: homegroupId,
      reqId: getReqId(),
      stamp: getStamp(),
    }
    return new Promise((resolve, reject) => {
      requestService
        .request('getNonIntelligentIotDeviceV', reqData)
        .then((resp) => {
          resolve(resp)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  //加入家庭的分享码校验
  verifyInviteCode(param) {
    let reqData = {
      reqId: getReqId(),
      stamp: getStamp(),
      invitationCode: param.invitationCode,
    }
    return new Promise((resolve, reject) => {
      requestService
        .request('verifyInviteCode', reqData)
        .then((resp) => {
          console.log('servivce加入家庭的分享码校验成功', resp)
          resolve(resp)
        })
        .catch((error) => {
          console.log('servivce加入家庭的分享码校验失败', error)
          reject(error)
        })
    })
  },
  //删除非智设备
  deleteNormalDevice(param) {
    let reqData = {
      param: param,
      reqId: getReqId(),
      stamp: getStamp(),
    }
    return new Promise((resolve, reject) => {
      requestService
        .request('deleteNormalDevice', reqData)
        .then((resp) => {
          console.log('feizhiservivce删除设备成功', resp)
          resolve(resp)
        })
        .catch((error) => {
          console.log('feizhiservivce删除设备失败', error)
          reject(error)
        })
    })
  },
  //修改智能设备名称
  editAppliance(param) {
    let reqData = {
      applianceCode: param.applianceCode,
      isOtherEquipment: param.isOtherEquipment,
      applianceName: param.applianceName,
      reqId: getReqId(),
      stamp: getStamp(),
    }
    return new Promise((resolve, reject) => {
      requestService
        .request('editApplicance', reqData)
        .then((resp) => {
          console.log('servivce修改设备名称成功', resp)
          resolve(resp)
        })
        .catch((error) => {
          console.log('servivce修改设备名称失败', error)
          reject(error)
        })
    })
  },
  //修改非智设备名称
  editNormalAppliance(param) {
    let reqData = {
      homegroupId: param.homegroupId,
      productModel: param.productModel,
      name: param.name,
      reqId: getReqId(),
      stamp: getStamp(),
    }
    return new Promise((resolve, reject) => {
      requestService
        .request('editNormalDevice', reqData)
        .then((resp) => {
          console.log('feizhiservivce修改设备名称成功', resp)
          resolve(resp)
        })
        .catch((error) => {
          console.log('feizhiservivce修改设备名称失败', error)
          reject(error)
        })
    })
  },
  //发送家庭点击邀请标识
  sendHomeGroupItemIsRead(param) {
    let reqData = {
      homeGroupId: param.homegroupId,
      unread: param.unread,
      reqId: getReqId(),
      stamp: getStamp(),
    }
    return new Promise((resolve, reject) => {
      requestService
        .request('sendHomeGroupItemIsRead', reqData)
        .then((resp) => {
          resolve(resp)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  //校验从nfc过来的数据
  fromNfcAction(options) {
    const query = options.query
    const data = {
      uuid: query.nfcid || '',
      randomCode: query.rc || '',
      reqId: getReqId(),
      stamp: getTimeStamp(new Date()),
    }
    return new Promise((resolve, reject) => {
      requestService
        .request('nfcBindGet', data)
        .then((res) => {
          console.log('nfc 获取设备绑定的详情1', res.data.data)
          resolve(res)
        })
        .catch((err) => {
          console.log('nfc 获取设备绑定的详情2', err)
          reject(err)
        })
    })
  },
  //申请加入家庭
  joinDend(param) {
    const data = {
      uid: param.uid || '',
      homegroupId: param.homegroupId || '',
      reqId: getReqId(),
      stamp: getTimeStamp(new Date()),
    }
    return new Promise((resolve, reject) => {
      requestService
        .request('joinDend', data)
        .then((res) => {
          resolve(res.data.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  //获取已购待绑定设备信息
  getNotActiveDevices(homegroupId) {
    let reqData = {
      reqId: getReqId(),
      stamp: getStamp(),
      cardType: [
        {
          type: 'notActive',
          query: {
            homegroupId: homegroupId,
          },
        },
        {
          type: 'applianceType',
          query: {
            homegroupId: homegroupId,
          },
        },
      ],
    }
    return new Promise((resolve, reject) => {
      requestService
        .request('applianceListAggregate', reqData)
        .then((resp) => {
          if (resp.data.code == 0) {
            resolve(resp.data.data)
          } else {
            reject(resp)
          }
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  //忽略已购待绑定设备
  ignoreAppliance(params) {
    let reqData = {
      businessType: params.businessType,
      stamp: getStamp(),
      reqId: getReqId(),
    }
    if (params.businessType == 1) {
      reqData.sn = params.sn
    } else if (params.businessType == 3) {
      reqData.applianceType = params.applianceType
    }
    return new Promise((resolve, reject) => {
      requestService
        .request('ignoreAppliance', reqData)
        .then((resp) => {
          resolve(resp)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  //删除设备
  deleteAppliance(param) {
    let reqData = {
      applianceCode: param.applianceCode,
      isOtherEquipment: param.isOtherEquipment,
      reqId: getReqId(),
      stamp: getStamp(),
    }
    return new Promise((resolve, reject) => {
      requestService
        .request('deleteApplicance', reqData)
        .then((resp) => {
          console.log('servivce删除设备成功', resp)
          resolve(resp)
        })
        .catch((error) => {
          console.log('servivce删除设备失败', error)
          reject(error)
        })
    })
  },
  //物模型2.0用于查询设备的属性或所有属性、设置设备属性-批量
  getBatchProperties(reqData) {
    let url = '/v1/thing/batch/properties?requestId=' + getReqId() + '&sync=true'
    //获取当前家庭设备列表
    return new Promise((resolve, reject) => {
      requestService.request(url, reqData).then(
        (resp) => {
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

  //扫码加入家庭
  memberScancode(scancodeUrl) {
    let reqData = {
      reqId: getReqId(),
      stamp: getStamp(),
      scancodeUrl: scancodeUrl,
    }
    return new Promise((resolve, reject) => {
      requestService
        .request('memberScancode', reqData)
        .then((resp) => {
          if (resp.data.code == 0) {
            resolve(resp.data.data)
          } else {
            reject(resp)
          }
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
}

//方法类
function pad0(org, num) {
  org = org.toString()
  if (org.length >= num) {
    return org
  }
  var zero = ''
  for (var i = 0; i < num - org.length; i++) {
    zero += '0'
  }
  var all = zero + org
  return all
}
//解析扫码内容
function getScanCode(result) {
  let searchParams = getUrlkey(result)
  if (searchParams?.action && searchParams.action == 'joinfamily') {
    return searchParams.action
  }
}
//解析扫码错误
function scodeResonse(code) {
  let label = '未知系统错误'
  switch (code) {
    case 1002:
      label = '参数为空'
      break
    case 1105:
      label = '账户不存在'
      break
    case 1201:
      label = '您已经是家庭成员了'
      break
    case 1202:
      label = '邀请者不是家庭管理员'
      break
    case 1203:
      label = '该家庭不存在'
      break
    case 1204:
      label = '您已经是家庭成员了'
      break
    case 1311:
      label = '家庭二维码已失效，请扫描最新二维码'
      break
    case 1312:
      label = '二维码错误'
      break
    case 3603:
      label = '用户未绑定手机号码'
      break
    case 2019:
      label = '您的家庭数量已达上限'
      break
    case 2020:
      label = '当前家庭成员数量已达上限'
      break
    case 2022:
      label = '对方的家庭数超过上限'
      break
    case 2023:
      label = '对方家庭成员数量已达上限'
      break
    case 40500:
      label = '调用业务系统异常(业务服务内部错误)'
      break
    default:
      label = '抱歉，此二维码无效'
      break
  }
  return label
}
export { service, pad0, getScanCode, scodeResonse }
