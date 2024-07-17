import {requestParams, useMas, CLIENT_TYPE_LITE_PLUGIN, isProd} from '../utils/request.consts'
import { getStamp } from 'm-utilsdk/index'
import {judgeWayToMiniProgram} from 'm-miniCommonSDK/index'

const app = getApp() //获取应用实例
const requestService = app.getGlobalConfig().requestService
const config = app.getGlobalConfig().config.default

const getQueries = (params) => {
  let queries = '';
  for(let key in params) {
    let value = typeof params[key] === 'object' ? encodeURIComponent(JSON.stringify(params[key])) : params[key];
    queries += `&${key}=${value}`
  }
  return queries
}

const getPath = (route, params) => {
  const queries = getQueries(params)
  console.log('getPath queries', queries)
  return `${route}?author=sf${queries}`
}

let jumpTo = (pageName, params = {}, options = {}) => {
  options = Object.assign({withinPlugin: true, replace: false}, options);
  const {withinPlugin, replace} = options;

  const dir = withinPlugin ? '..' : '/pages';
  const method = replace ? 'redirectTo' : 'navigateTo'

  wx[method]({
    url: getPath(`${dir}/${pageName}/${pageName}`, params),
  })
}

let _openMiniProgram = (miniProgramName, route, params = {}, extraData) => {
    const APP_IDS = {
      "mideaShoppingMall": 'wx255b67a1403adbc2',
      "mideaInstruction": 'wxd0e673a1e4dfb3c8'
    }
    const appId = APP_IDS[miniProgramName] || miniProgramName;
    const path = getPath(route, params)
    const _extraData = Object.assign({}, {
      jp_source: 3,
      jp_c4a_uid: getUid(),
      jp_rand: getStamp()
    }, extraData)
    judgeWayToMiniProgram(appId,path,_extraData)
}

let isObject = (v) => {
  return Object.prototype.toString.call(v) === '[object Object]'; 
}

let getUid = () => {
  if(app.globalData.userData && app.globalData.userData.userInfo) {
    return app.globalData.userData.userInfo.uid;
  }

  return null
}

const getUrl = url => {
  if(useMas) {
    return config.domain[config.environment] + config.masPrefix + '/wbyqj' + url
  }
  const hostname = isProd ? 'https://iotbase.midea.com' : 'http://120.24.54.100:8300' // recipe sit hostname
  return  hostname + url
}

let fetch = (requestName, data = {}, method) => {
  const request = requestParams[requestName];
  return new Promise( (resolve, reject) => {

    // let header = {
    // };

    // if (app && app.globalData && app.globalData.userData) {
    //   header["accessToken"] = app.globalData.userData.mdata.accessToken
    // }

    if(request.sn8Required && !data.sn8) {
      reject('sn8 required');
    }

    if(request.clentTypeRequired) {
      Object.assign(data, {clientType: CLIENT_TYPE_LITE_PLUGIN});
    }

    if(request.userRequired) {
      const uid = getUid();
      Object.assign(data, {user:{userId: uid}});
    }

    let url = request.url.indexOf('http') > -1 ? request.url : getUrl(request.url);
    if(request.replacements && request.replacements.length) {
      for(let key of request.replacements) {
        if(key in data) {

          url = url.replace(new RegExp(`:${key}`, 'g'), data[key]);
          delete data[key];
        }
      }
    }

    return requestService.request(url, data, request.method)
    .then((resData) => {
      if(resData.data.code == 200) {
        resolve(resData.data.data)
        return 
      }

    })
    .catch(e => {
      reject(e.data)
    })
  })
}

const getMapValues = (range, mapValues, value) => {

  if (range && range.length) {
    return _ranges(range)
  }

  if (mapValues && mapValues.length) {
    return mapValues
  }

  return [{
    label: value,
    value
  }]
}

const _ranges = (rangeArrays) => {
  let list = [];

  for (let i = 0; i < rangeArrays.length; i++) {
    list = list.concat(_range.apply(this, rangeArrays[i]));
  }
  return list;
}

const _range = (start, end, step) => {
  var arr = [];
  if (start > end) {
    return arr;
  }
  for (var i = 0; start + i * step <= end; i++) {
    var value = start + step * i;
    arr.push({
      label: value,
      value: value
    })

  }
  return arr;
}

exports.getPath = getPath;
exports.jumpTo = jumpTo;
exports.fetch = fetch;
exports._openMiniProgram = _openMiniProgram;
exports.isObject = isObject
exports.getMapValues = getMapValues