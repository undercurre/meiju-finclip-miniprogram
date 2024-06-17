/*
 * @desc: 插件页跳转页面统一处理
 * @author: zhucc22
 * @Date: 2023-08-01 10:34:47
 */
import { newPluginUrl, PluginUrl } from './paths'
import { goOldUrlPluginList } from '../plugindevelop'
import { newPluginConfig } from './newPluginConfig' //测试数据

function getPluginUrl(type, deviceInfo) {
  type = type.includes('0x') ? type : `0x${type}`
  let url = goOldUrlPluginList.includes(type) ? PluginUrl : newPluginConfig.includes(type) ? newPluginUrl : PluginUrl
  if(newPluginConfig && newPluginConfig.length == 0) { // 如果配置信息为空时，默认返回npm包路径（全部npm上线后当前配置会清空，后续npm插件接入后就不需要再维护这个配置）
    url = newPluginUrl
  }
  if (deviceInfo) {
    return url + `/T${type}/index/index?deviceInfo=` + encodeURIComponent(deviceInfo)
  } else {
    return url + `/T${type}/index/index`
  }
}

//插件内页面跳转前缀获取
function getPluginPreUrl(type) {
  type = type.includes('0x') ? type : `0x${type}`
  let url = goOldUrlPluginList.includes(type) ? PluginUrl : newPluginConfig.includes(type) ? newPluginUrl : PluginUrl
  return url
}

module.exports = {
  getPluginUrl,
  getPluginPreUrl,
}
