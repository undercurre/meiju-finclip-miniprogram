const app = getApp() //获取应用实例
const environment = app.getGlobalConfig().environment
//发起网络请求
const testUrl = 'http://8.136.244.226:8082/vc/'//测试环境
// const testUrl = 'https://vcapi.midea.com/vc/'//测试环境
const proUrl = 'https://vcapi.midea.com/vc/'//正式环境

const baseUrl = environment == 'prod' ? proUrl : testUrl
const baseInterface = 'v1/app/'//不走mas中台
const HttpsRequest = (url,method,params={}) => {
  return new Promise((resolve, reject) => {
    wx:wx.request({
      url: baseUrl+url,
      method: method,
      data: params,
      success: (res) => {
        // console.log(res.data);
        resolve(res.data)
      },
      fail: (err) => {
        // console.log(err.errMsg);
        reject(err)
      }
    })
  })

}
//查询滤材
function queryMaterial(params) {
  return HttpsRequest(baseInterface+'vc-appliance-data/findApplianceSupplies','post',params)
}
//重置滤材
function resetMaterial(params) {
  return HttpsRequest(baseInterface+'vc-appliance-data/resetApplianceSupplies','post',params)
}
//查询今日清扫
function queryDayClean(params) {
  return HttpsRequest(baseInterface+'discovery/findHomeCleanData','post',params)
}
//获取视频分类
function queryVideoCategories(params) {
  return HttpsRequest('app_ops/videos/categories/'+params.sn8,'get',{})
}
//获取视频列表-非mas中台
function queryVideo(params) {
  return HttpsRequest('app_ops/videos/list/','get',params)
}

// 根据SN8获取图片信息
function getDevicePicsBySN8(params) {
  console.log("图片资源参数：",params);
  return HttpsRequest('v1/img_config/list/','get',params)
}

export default {queryMaterial,resetMaterial,queryDayClean,queryVideo,getDevicePicsBySN8,queryVideoCategories}
