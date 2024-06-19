import api from '../api/api'
import {
  CryptoJS,
  md5
} from 'm-utilsdk/index'
const app = getApp()
const environment = app.getGlobalConfig().environment
const requestService = app.getGlobalConfig().requestService
const header = {
  'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
}


//新版企标年份映射关系,其中I、E、O禁用
const newSnYear = {
  '5': 15,
  '6': 16,
  '7': 17,
  '8': 18,
  '9': 19,
  '0': 20,
  '1': 21,
  '2': 22,
  '3': 23,
  '4': 24,
  'A': 25,
  'B': 26,
  'C': 27,
  'D': 28,
  'F': 29,
  'G': 30,
  'H': 31,
  'J': 32,
  'K': 33,
  'L': 34,
  'M': 35,
  'N': 36,
  'P': 37,
  'Q': 38,
  'R': 39,
  'S': 40,
  'T': 41,
  'U': 42,
  'V': 43,
  'W': 44,
  'X': 45,
  'Y': 46,
  'Z': 47
}

const snMonth = {
  '1': 1,
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  'A': 10,
  'B': 11,
  'C': 12,
}

function sn2TimeIsOld(year, month, sn) {
  //根据sn判断时间是否小于指定时间，条件成立小于指定时间
  //判断新旧企标，0000CA 311310A0226 04251240146 0000，新版企标3开头
  let isOld = false;
  let snY = null;
  let snM = null;
  if (sn[6] == 3) { //新企标
    snY = newSnYear[sn[17]]
    snM = snMonth[sn[18]]
  } else { //旧企标
    snY = parseInt(sn[17] + sn[18])
    snM = snMonth[sn[19]]
  }
  if (snY < year || (snY == year && snM < month)) {
    isOld = true
  }
  return isOld
}

function sn2TimeIsNew(timeStr, sn) {
  //根据sn中的时间，判断是否是新机器。21年已经实行新企标，老企标即为旧机器
  let isNew = false;
  let timeArr = timeStr.split('-');
  if (timeArr.length != 3) {
    return
  }
  let changeYear = parseInt(timeArr[0].substr(2, 2)); //用来对比的切换时间
  let changeMonth = parseInt(timeArr[1]);
  let changeDay = parseInt(timeArr[2]);
  let snY = null;
  let snM = null;
  let snD = null;
  if (sn[6] == 3) { //新企标
    snY = newSnYear[sn[17]];
    snM = snMonth[sn[18]];
    snD = parseInt(sn.substr(19, 2));
    if (snY > changeYear || (snY == changeYear && snM > changeMonth) || (snY == changeYear && snM == changeMonth &&
        snD > changeDay)) {
      isNew = true;
    }
  } else { //旧企标
    isNew = false;
  }
  return isNew;
}

//获取设备基本信息
function getFridgeDevInfo(sn8, devSn) {
  let devSn8 = sn8.substr(sn8.length - 5, 5);
  //解决230机型，新老机型替换，变温室、冷冻室控制信息不同的问题
  if (devSn8 == 'A0772') {
    //todo 提起sn中的日期,判断是旧型号还是新型号
    //条件成立小于21年1月份，230冰箱旧机型20年11月底退市停产，21年2月中旬大批生产。
    //判断230冰箱,在2021.1月份之前旧机型，之后是新机型
    if (sn2TimeIsOld(21, 1, devSn)) {
      devSn8 = 'A0772Old';
    }
  } else if (devSn8 == 'A0967') {
    // 解决BCD-465WTPZM(E)型号，2021年12月6号显板切换，功能变更的问题。新机器没有智能模式
    // todo
    if (sn2TimeIsNew('2021-12-6', devSn)) {
      devSn8 = 'A0967New';
    }
  }
  return new Promise(function (resolve, reject) {
    //服务器请求
    let reqParam = {
      sn: devSn8,
      token: getFridgeSign('sn' + devSn8)
    };
    requestService.request(api.getFridgeDevInfo, reqParam, 'POST', header).then((res) => {
      if (res.statusCode == 200) {
        resolve(res.data)
      } else {
        resolve({
          code: -1
        })
      }
    }).catch(err => {
      reject(err)
    })
  });
}

//获取冰箱当前状态信息
function getFridgeCurStatus(applianceCode) {
  return new Promise((resolve, reject) => {
    let reqParam = {
      applianceCode: applianceCode,
      command: {},
      stamp: +new Date(),
      reqId: +new Date()
    };
    requestService.request('luaGet', reqParam).then((res) => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  });
}

//控制设备
function sendCtlCmdToDev(applianceCode, ctlItem) {
  return new Promise((resolve, reject) => {
    let reqData = {
      applianceCode: applianceCode,
      command: {
        control: ctlItem
      },
      stamp: +new Date(),
      reqId: +new Date()
    };
    requestService.request('luaControl', reqData).then((res) => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  });
}

//获取云管家开关状态接口
function getCloudKeeperSwitchStatus(fridgeId) {
  let curTime = new Date().getTime();
  let nonce = "123456";
  return new Promise(function (resolve, reject) {
    //服务器请求
    let reqParam = {
      fridgeId: fridgeId,
      switchType: 1,
      nonce: nonce,
      time_stamp: curTime,
      token: getFridgeSign('fridgeId' + fridgeId + 'nonce' + nonce + "switchType1" + "time_stamp" + curTime)
    };
    requestService.request(api.getCloudKeeperSwitchStatus, reqParam, 'POST', header).then((res) => {
      if (res.statusCode == 200) {
        resolve(res.data)
      } else {
        resolve({
          code: -1
        })
      }
    }).catch(err => {
      reject(err)
    })
  });
}

//保鲜云管家引导弹窗, 是否首次进入
function getPluginInfoRecord(fridgeId, uid) {
  let curTime = new Date().getTime();
  let nonce = "123456";
  return new Promise(function (resolve, reject) {
    //服务器请求
    let reqParam = {
      fridgeId: fridgeId,
      functionType: 2,
      uid: uid,
      nonce: nonce,
      time_stamp: curTime,
      token: getFridgeSign('fridgeId' + fridgeId + 'functionType1' + 'nonce' + nonce + "time_stamp" +
        curTime + 'uid' + uid)
    };
    requestService.request(api.getPluginInfoRecord, reqParam, 'POST', header).then((res) => {
      if (res.statusCode == 200) {
        resolve(res.data)
      } else {
        resolve({
          code: -1
        })
      }
    }).catch(err => {
      reject(err)
    })
  });
}

//编辑云管家开关
function editCloudKeeperSwitchStatus(fridgeId, optStatus) {
  let curTime = new Date().getTime();
  let nonce = "123456";
  return new Promise(function (resolve, reject) {
    //服务器请求
    let reqParam = {
      fridgeId: fridgeId,
      switchType: 1,
      openFlag: optStatus,
      nonce: nonce,
      time_stamp: curTime,
      token: getFridgeSign('fridgeId' + fridgeId + 'nonce' + nonce + 'openFlag' + optStatus + "switchType1" +
        "time_stamp" + curTime)
    };
    requestService.request(api.editCloudKeeperSwitchStatus, reqParam, 'POST', header).then((res) => {
      if (res.statusCode == 200) {
        resolve(res.data)
      } else {
        resolve({
          code: -1
        })
      }
    }).catch(err => {
      reject(err)
    })
  });
}

//获取开关门记录列表
function getOpenDoorRecords(fridgeId) {
  let curTime = new Date().getTime();
  let nonce = "123456";
  let reqParam = {
    fridgeId: fridgeId,
    nonce: nonce,
    time_stamp: curTime,
    token: getFridgeSign('fridgeId' + fridgeId + 'nonce' + nonce + "time_stamp" + curTime)
  };
  return new Promise(function (resolve, reject) {
    //服务器请求
    requestService.request(api.getOpenDoorRecords, reqParam, 'POST', header).then((res) => {
      if (res.statusCode == 200) {
        resolve(res.data)
      } else {
        resolve({
          code: -1
        })
        
      }
    }).catch(err => {
      reject(err)
    })
  });
}

function getCloudServiceUrl(serName) {
  let dataModel = null;
  if (environment == "sit") {
    //dataModel = "https://erp.mideav.com";
    dataModel = "https://colmoreport.mideav.com/newMonthReport/index.html?fridgeId=";
  } else if (environment == "prod") {
    // dataModel = "https://midea-images.mideav.com/month2021";
    dataModel = "https://midea-images.mideav.com/meiju/reportMonth/index.html?fridgeId=";
  }
  return dataModel;
}

//获取用户的操作步骤信息
function getRecordStep(uid, telPhone, openMode) {
  let reqParam = {
    uid: uid,
    telPhone: telPhone,
    openMode: openMode
  };
  return new Promise(function (resolve, reject) {
    //服务器请求
    requestService.request(api.getRecordStep, reqParam, 'POST', header).then((res) => {
      if (res.statusCode == 200) {
        resolve(res.data.data)
      } else {
        resolve({
          code: -1
        })
      }
    }).catch(err => {
      reject(err)
    })
  });
}

//记录用户操作步骤
function recordStep(uid, telPhone, step) {
  let reqParam = {
    uid: uid,
    telPhone: telPhone,
    step: step
  };
  return new Promise(function (resolve, reject) {
    //服务器请求
    requestService.request(api.recordStep, reqParam, 'POST', header).then((res) => {
      if (res.statusCode == 200) {
        resolve(res.data.data)
      } else {
        resolve({
          code: -1
        })
      }
    }).catch(err => {
      reject(err)
    })
  });
}

//获取设备自检信息
function getDevCheckRecord(uid, telPhone, devId, isNew, roleId, homeGroupid, sn8, devSn) {
  let devSn8 = sn8.substr(sn8.length - 5, 5);
  //解决230机型，新老机型替换，变温室、冷冻室控制信息不同的问题
  if (devSn8 == 'A0772') {
    //todo 提起sn中的日期,判断是旧型号还是新型号
    //条件成立小于21年1月份，230冰箱旧机型20年11月底退市停产，21年2月中旬大批生产。
    //判断230冰箱,在2021.1月份之前旧机型，之后是新机型
    if (sn2TimeIsOld(21, 1, devSn)) {
      devSn8 = 'A0772Old';
    }
  } else if (devSn8 == 'A0967') {
    // 解决BCD-465WTPZM(E)型号，2021年12月6号显板切换，功能变更的问题。新机器没有智能模式
    // todo
    if (sn2TimeIsNew('2021-12-6', devSn)) {
      devSn8 = 'A0967New';
    }
  }
  let reqParam = {
    uid: uid,
    telPhone: telPhone,
    devId: devId,
    isNew: isNew,
    roleId: roleId,
    homeGroupid: homeGroupid,
    devSn: devSn8
  };
  return new Promise(function (resolve, reject) {
    //服务器请求
    requestService.request(api.getDevCheckRecord, reqParam, 'POST', header).then((res) => {
      if (res.statusCode == 200) {
        resolve(res.data.data)
      } else {
        resolve({
          code: -1
        })
      }
    }).catch(err => {
      console.log("------------------------> getDevCheckRecord异常:  " + JSON.stringify(err));
      reject(err)
    })
  });
}

//获取自检项清单
function getCheckItems(devId) {
  let reqParam = {
    devId: devId,
    version: "1.0.1"
  };
  return new Promise(function (resolve, reject) {
    //服务器请求
    requestService.request(api.getCheckItems, reqParam, 'POST', header).then((res) => {
      if (res.statusCode == 200) {
        resolve(res.data.data)
      } else {
        resolve({
          code: -1
        })
      }
    }).catch(err => {
      reject(err)
    })
  });
}

//保存自检结果
function saveCheckDevResult(fridgeid, checkitemnum, checkresult, faultnum, sn, fridgeModelNum, faultList) {
  let reqParam = {
    fridgeid: fridgeid,
    checkitemnum: checkitemnum,
    checkresult: checkresult,
    faultnum: faultnum,
    sn: sn,
    fridgeModelNum: fridgeModelNum,
    faultList: faultList
  };
  let param = JSON.stringify(reqParam);
  return new Promise(function (resolve, reject) {
    //服务器请求
    requestService.request(api.saveCheckDevResult, {
      param: param
    }, 'POST', header).then((res) => {
      if (res.statusCode == 200) {
        resolve(res.data.data)
      } else {
        resolve({
          code: -1
        })
      }
    }).catch(err => {
      reject(err)
    })
  });
}

//获取设备的自检历史
function getDevCheckHistory(fridgeId) {
  let reqParam = {
    fridgeId: fridgeId
  };
  return new Promise(function (resolve, reject) {
    //服务器请求
    requestService.request(api.getDevCheckHistory, reqParam, 'POST', header).then((res) => {
      if (res.statusCode == 200) {
        resolve(res.data)
      } else {
        resolve({
          code: -1
        })
      }
    }).catch(err => {
      reject(err)
    })
  });
}

//获取图片地址
function getIconServiceUrl() {
  let dataModel = null;
  if (environment == "sit") {
    // dataModel = "https://www.smartmidea.net/projects/sit/meiju-lite-assets/bxImg/";
    dataModel = "https://www.smartmidea.net/projects/sit/meiju-lite-assets/plugin/0xCA/";
  } else if (environment == "prod") {
    //  dataModel = "https://www.smartmidea.net/projects/meiju-lite-assets/bxImg/";
    //  dataModel = "https://www.smartmidea.net/projects/sit/meiju-lite-assets/bxImg/";
    dataModel = "https://www.smartmidea.net/projects/meiju-lite-assets/plugin/0xCA/";
  }
  return dataModel;
}

//冰箱接口数据加密
function getFridgeSign(value) {
  var key = CryptoJS.enc.Utf8.parse('20160613646aBcDW')
  var encryptedData = CryptoJS.AES.encrypt(md5(value), key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  })
  encryptedData = encryptedData.ciphertext.toString()
  return encryptedData
}
module.exports = {
  getFridgeDevInfo,
  getFridgeCurStatus,
  sendCtlCmdToDev,
  getCloudKeeperSwitchStatus,
  editCloudKeeperSwitchStatus,
  getOpenDoorRecords,
  getCloudServiceUrl,
  getRecordStep,
  recordStep,
  getDevCheckRecord,
  getCheckItems,
  saveCheckDevResult,
  getDevCheckHistory,
  getPluginInfoRecord,
  getIconServiceUrl
}
