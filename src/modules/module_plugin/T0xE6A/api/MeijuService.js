const app = getApp();
const requestService = app.getGlobalConfig().requestService
import {
  formatTime,
  getTimeStamp,
  getReqId,
  getUID,
  getStamp,
  RndNum,
  getSign,
  cheakVersion,
  CryptoJS,
  md5
} from 'm-utilsdk/index'

let appKey = app.getGlobalConfig().appKey


export default class MeijuService {

  constructor(){
    
  }

  // loginIot(resolve) {
  //   let that = this;
  //   wx.login({
  //     success(res) {
  //       if (res.code) {
  //         let code = res.code;
  //         console.log("iot-loginCode", code)
  //         let timestamp = getStamp();
  //         let reqId = getReqId();
  //         let reqData = {
  //           "appKey": "46579c15",
  //           "appVersion": "1.0.0",
  //           "osVersion": "",
  //           "platform": 110
  //         }
  //         let data = {
  //           "timestamp": timestamp,
  //           "data": reqData,
  //           "iotData": {
  //             "iotAppId": "1133",
  //             "wxLoginCode": code,
  //             "reqId": reqId,
  //             "stamp": getTimeStamp(new Date())
  //           }
  //         }
  //         let signData = {
  //           "timestamp": timestamp,
  //           "data": reqData
  //         }
  //         // 发起网络请求
  //         console.log('请求：', data)
  //         requestService.request("login", data).then((resp) => {
  //           if (resp.data.code == 0) {
  //             //邀请入家庭成功与否提示
  //             console.log("登陆成功返回", resp.data.data)

  //             //resolve(resp.data.data)
  //             app.globalData.userData = resp.data.data;
  //             app.globalData.phoneNumber = resp.data.data.userInfo.mobile;
  //             app.globalData.uid = resp.data.data.uid;
  //             that.homeGroupList().then((res)=>{
  //               app.globalData.myHome = res;
  //             });
  //             resolve && that.getApplianceList(resolve);

  //             wx.request({
  //               url: 'https://smartrac.midea.com/bluetooth/control/c4a/uid/update',
  //               method: 'POST',
  //               data: {
  //                 openId6: app.openId6,
  //                 token: app.token,
  //                 c4a_uid: resp.data.data.uid
  //               }, 
  //               success: (res) => {
  //                 console.log('同步c4a_uid结果', res.data)
  //               }
  //             })
  //           } else if (resp.data.code == 1110) {
  //             //console.log("====0", resp)
  //             //没有绑定手机号
  //             //that.bind();

  //           } else {
  //             //其它异常暂时不处理
  //           }

  //           let burialParam =  {
  //             page_id:'page_user_authorized',
  //             page_name:'账号登录',
  //             module:'公共',
  //             widget_id:'api_login',
  //             widget_name:'登录接口返回',
  //             ext_info:{code: resp.data.code, result: resp.data.msg}
  //           }
  //           if(resp.data.code == 0){
  //             burialParam.ext_info.uid = resp.data.data.uid
  //           }
  //           setTimeout(() => {
  //             app.$$Rangers.event('user_behavior_event',  burialParam);  
  //           }, 2000);
            
  //         }, (error) => {
  //           console.log("====1", error)
  //         })
  //       } else {
  //         console.log('登录失败！' + res)
  //       }
  //     }
  //   })
  // }

  /**
   * 绑定微信小程序与美居账号
   */
  /*wxRigister(mobile, randomCode,callback) {
    let self = this;
    wx.login({
      success(res) {
        if (res.code) {
          let code = res.code;
          let timestamp = getStamp();
          let reqId = getReqId();
          let reqData = {
            "appKey": "46579c15",
            "appVersion": "1.0.0",
            "osVersion": "",
            "platform": 110
          }
          let iotData = {
            "iotAppId": "1133",
            "wxLoginCode": res.code,
            mobile,
            randomCode,
            prebind: true,
            "appVersion": "1.0.0",
            "reqId": getReqId(),
            "stamp": timestamp
          }

          let data = {
            "data": reqData,
            "iotData": iotData,
            "timestamp": timestamp
          }

          console.log("微信注册传参：", data)
          requestService.request("wxRigister", data).then(function (resp) {
            console.log("wxRigister success data:", resp)
            if (resp.data.code == 0) {
              //注册登录成功
              console.log("微信注册成功返回")
              app.globalData.userData = resp.data.data;
              app.globalData.phoneNumber = resp.data.data.userInfo.mobile;
              // self.loginIot();
            } else if (resp.data.code == 1104) {
              console.log("手机已注册美居账号，直接绑定微信")
              self.bind(mobile);
            }
            callback && callback();

          }, function (resData) {

          })
        } else {
          console.log("error")
        }
      }
    })
  }*/

  /**
   * 绑定微信小程序与美居账号
   */
  /*bind(mobile) {
    console.log('开始绑定')
    let self = this;
    wx.login({
      success(res) {
        if (res.code) {
          let data = {
            "timestamp": getStamp(),
            "data": {
              "appKey": "46579c15",
              "appVersion": "1.0.0",
              "osVersion": "",
              "platform": 110
            },
            "iotData": {
              "iotAppId": "1133",
              "wxLoginCode": res.code,
              mobile,
              "prebind": true,
              "invitationCode": "",
              "reqId": getReqId(),
              "stamp": getTimeStamp(new Date())
            }
          }
          console.log("绑定传参：", data)
          requestService.request("bind", data).then(function (resp) {
            console.log("bind success data:", resp)
            if (resp.data.code == 0) {
              console.log("绑定成功返回", resp.data.data)
              app.globalData.userData = resp.data.data;
              app.globalData.phoneNumber = resp.data.data.userInfo.mobile;
              // self.loginIot();
            }

          }, function (resData) {
            console.error("error", resData)
          })
        } else {
          console.error("error")
        }
      }
    })
  }*/

  /*getApplianceList(resolve) {
    let reqData = {
      "reqId": getReqId(),
      "stamp": getStamp(),
      "bluetoothDetail": true,
    }
    requestService.request("applianceList", reqData).then((resp) => {
      console.log("getApplianceList==========", resp.data)
      if (resp.data.code == 0) {
        let applianceList = []
        let homeList = resp.data.data.homeList
        app.globalData.homegroupId = homeList[0].homegroupId;
        for (let i = 0; i < homeList.length; i++) {
          // console.log("------------", homeList[i].name)
          for (let j = 0; j < homeList[i].roomList.length; j++) {
            // console.log("------------", homeList[i].roomList[j].des)
            for (let k = 0; k < homeList[i].roomList[j].applianceList.length; k++) {
              let appliance = homeList[i].roomList[j].applianceList[k];
              if(appliance.type!='0xAC'){
                continue;
              }
              appliance.plainSn = this.decrypt(appliance.sn);
              applianceList.push(appliance)
            }
          }
        }
        console.log("++++++++++", applianceList)
        resolve(applianceList);
      }
    })
  }*/

  //查询设备状态并更新界面
  luaQuery(applianceCode, param) {
    return new Promise((resolve, reject) => {
      let command = param.query_type !== undefined ? {"query": param } : {};
      
      let reqData = {
        "reqId": getReqId(),
        "stamp": getStamp(),
        "applianceCode":applianceCode,
        "command": command
      }
      console.log(JSON.stringify(command),'luaQueryWifiRequestData')
      requestService.request("luaGet", reqData).then((resp) => {
        console.log(resp.data.data)
        if (resp.data.code == 0) {
          console.log(resp.data.data,'luaQueryWifiResponseData')
          resolve(resp.data.data || {})
        } else {
          reject(resp)
        }
      }, (error) => {
        wx.hideNavigationBarLoading()
        console.error(error)
        reject(error)
      })
    })
  }
  //查询设备状态并更新界面
  luaControl(applianceCode, param, status) {
    return new Promise((resolve, reject) => {
      let reqData = {
        "reqId": getReqId(),
        "stamp": getStamp(),
        "applianceCode":applianceCode,
        "command": {
          "control": param,                         
        }       
      }
      if (status !== {}) {
        reqData.command.status = status;
      }
      requestService.request("luaControl", reqData).then((resp) => {
        if (resp.data.code == 0) {
          resolve(resp.data.data.status || {})
        } else {
          reject(resp)
        }
      }, (error) => {
        wx.showToast({
          title: '设备未响应，请稍后尝试刷新',
          icon: 'none',
          duration: 2000
        })
        console.error(error)
        reject(error)
      })
    })
  }

  bindDeviceToHome(sn,callback) {
    var that = this;
    wx.login({
      success(res) {
        if (res.code) {
          let code = res.code;
          console.log("iot-loginCode", code)
          let timestamp = getStamp();
          let reqId = getReqId();
          let reqData = {
            "appKey": "46579c15",
            "appVersion": "1.0.0",
            "osVersion": "",
            "platform": 110
          }
          let data = {
            "timestamp": timestamp,
            "data": reqData,
            "iotData": {
              "iotAppId": "1133",
              "wxLoginCode": code,
              "reqId": reqId,
              "stamp": getTimeStamp(new Date())
            }
          }
          let signData = {
            "timestamp": timestamp,
            "data": reqData
          }
          // 发起网络请求
          console.log('login请求：', data)
          requestService.request("login", data).then((resp) => {
            if (resp.data.code == 0) {
              //邀请入家庭成功与否提示
              console.log("登陆成功返回", resp.data.data)
              app.globalData.userData = resp.data.data;
              app.globalData.phoneNumber = resp.data.data.userInfo.mobile;

              let reqData = {
                "homegroupId": app.globalData.myHome.homegroupId,
                sn: that.encrypt(sn),
                "applianceType": '0xAC',
                "isBluetooth": 1,//0：wifi设备 1：蓝牙设备
                "reqId": getReqId(),
                "stamp": getStamp(),
              }
              console.log('bindDeviceToHome请求：', reqData)
              requestService.request("bindDeviceToHome", reqData).then(resp => {
                console.log("绑定设备结果成功", resp.data)
                callback && callback(resp);                
              }, (error) => {
                console.error("绑定设备失败返回", error)
              })
              
            } 
          }, (error) => {
            console.log(error)
          })
        } else {
          console.log('登录失败！' + res)
        }
      }
    })
  }


  decrypt(chiperText){
    let content = app.globalData.userData.key;
    content = CryptoJS.enc.Hex.parse(content)
    content = CryptoJS.enc.Base64.stringify(content);
    let md5_key = md5(appKey).substring(0, 16);
    md5_key = CryptoJS.enc.Utf8.parse(md5_key);
    let decode_seed = CryptoJS.AES.decrypt(content, md5_key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    }).toString(CryptoJS.enc.Utf8);
    decode_seed = CryptoJS.enc.Utf8.parse(decode_seed);
    chiperText = CryptoJS.enc.Hex.parse(chiperText)
    chiperText = CryptoJS.enc.Base64.stringify(chiperText);
    let plain = CryptoJS.AES.decrypt(chiperText, decode_seed, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      });
    plain = plain.toString(CryptoJS.enc.Utf8)
    return plain;
  }

  encrypt(plainText) {
    let content = app.globalData.userData.key;
    content = CryptoJS.enc.Hex.parse(content)
    content = CryptoJS.enc.Base64.stringify(content);
    let md5_key = md5(appKey).substring(0, 16);
    md5_key = CryptoJS.enc.Utf8.parse(md5_key);
    let decode_seed = CryptoJS.AES.decrypt(content, md5_key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    }).toString(CryptoJS.enc.Utf8);
    decode_seed = CryptoJS.enc.Utf8.parse(decode_seed);
    //加密order,加密种子是前面解密的key
    let chiperText = CryptoJS.AES.encrypt(plainText, decode_seed,
      {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      });
    chiperText = chiperText.ciphertext.toString();
    return chiperText;
  }

  getIotDeviceByCode() {
    let reqData = {
      "reqId": getReqId(),
      "stamp": getStamp(),
      
    }
    requestService.request("getIotDeviceByCode", reqData).then((resp) => {
      
      
    })
  }

  getPhoneNumber(encryptedData, iv, callback) {
    wx.login({
      success: res => {
        let data = {
          "timestamp": getStamp(),
          "data": null,
          "iotData": {
            "iotAppId": "1133",
            "wxLoginCode": res.code,
            "encryptedData": encryptedData,
            "iv": iv,
            "reqId": getReqId(),
            "stamp": getTimeStamp(new Date())
          }
        }
        console.log("通过美居解密手机号",data);
        requestService.request("getPhoneNumber", data).then(function (resData) {
          console.log(resData, "通过美居解密手机号resData getPhoneNumber===");
          if (resData.data.code == 0) {
            app.globalData.phoneNumber = resData.data.data.purePhoneNumber;
            callback && callback();
          }
        })
      }
    });
  }

  checkDeviceBindInfo(deviceSN,callback,error) {
    requestService.request('bindInfo',{
      "sn":deviceSN,
      "reqId": getReqId(),
      "stamp": getTimeStamp(new Date())
    }).then((resp)=>{
      console.log("checkDeviceBindInfo:",resp);
      callback && callback(resp);
    }).catch((err)=>{      
      error && error(err);
    })
  }

  deleteDevice(applianceCode) {
    requestService.request('deleteDevice', {
      applianceCode,
      uid: app.globalData.userData.uid,
      "reqId": getReqId(),
      "stamp": getTimeStamp(new Date())
    }).then((resp) => {
      console.log("deleteDevice:", resp);
    }).catch((err) => {
      console.error("deleteDevice出错:", err);
    })
  }

  /**
   * 加入家庭
   */
  joinHome(homegroupId) {
    let data = {
      uid: app.globalData.userData.uid,
      homegroupId,
      "reqId": getReqId(),
      "stamp": getTimeStamp(new Date())
    };
    console.log('开始申请加入家庭', data)
    return new Promise((resolve, reject) => {
      requestService.request('joinHomeGroup', data).then((resp) => {
        if (resp.data.code == 0) {
          resolve(resp)
        } else {
          reject(resp)
        }
      }).catch((err) => {
        reject(error)
      })
    });
  }

  joinHomeGroupResponse(homegroupId, proposerUid, accept) {
    let data = {
      proposerUid,
      homegroupId,
      accept,
      "reqId": getReqId(),
      "stamp": getTimeStamp(new Date())
    };
    console.log('开始处理申请加入家庭', data)

    return new Promise((resolve, reject) => {
      requestService.request('joinHomeGroupResponse', data).then((resp) => {
        if (resp.data.code == 0) {
          resolve(resp)
        } else {
          reject(resp)
        }
      }).catch((err) => {
        reject(error)
      })
    });
  }

  /**
     * 申请列表家庭
     */
  homeGroupRequestList() {
    let data = {
      uid: app.globalData.userData.uid,
      "type": 1,
      "reqId": getReqId(),
      "stamp": getTimeStamp(new Date())
    };
    console.log('开始查询申请家庭列表', data)
    return new Promise((resolve, reject) => {
      requestService.request('homeGroupRequestList', data).then((resp) => {
        if (resp.data.code == 0) {
          resolve(resp.data.data.joinList || [])
        } else {
          reject(resp)
        }
      }).catch((err) => {
        reject(error)
      })
    });

    
  }


  /**
     * 申请列表家庭
     */
  homeGroupList() {
    let data = {
      uid: app.globalData.userData.uid,
      "reqId": getReqId(),
      "stamp": getTimeStamp(new Date())
    };
    console.log('开始查询家庭', data)
    return new Promise((resolve, reject) => {
      requestService.request('homeGroupList', data).then((resp) => {
        //console.log(resp)
        if (resp.data.code == 0) {
          for (let i = 0; i <resp.data.data.homeList.length; i++){
            if (resp.data.data.homeList[i].roleId == '1001'){
              resolve(resp.data.data.homeList[i]);
              return;
            }
          }
          reject(resp)
        } else {
          reject(resp)
        }
      }).catch((err) => {
        reject(error)
      })
    });

  }

}