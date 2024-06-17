import { rangersBurialPoint, requestService } from '../../../utils/requestService'
import { hasKey, getUID, getTimeStamp } from 'm-utilsdk/index'
import { getOptions, getFullPageUrl } from '../../../utils/util.js'
import loginMethods from '../../../globalCommon/js/loginRegister.js'
const app = getApp()
export const eventTracking = (event, params) => {
  console.log('埋点', event, params)
  const click_id = getClickId()
  // if (this.data.gdt_vid || this.data.channel || this.data.subchannel) {
  if (event.indexOf('page_view') !== -1) {
    rangersBurialPoint('activity_page_view', {
      module: '活动', //写死 “活动”
      page_id: params['page_id'], //参考接口请求参数“pageId”
      game_id: params['game_id'], //参考接口请求参数“gameId”
      page_name: params['page_name'], //当前页面的标题，顶部的title
      page_path: params['page_path'], //当前页面的URL
      click_id: click_id, //gdt_vid 或者 qz_gdt
      open_id: app.globalData.openId || '',
    })
  } else if (event.indexOf('widget_event') !== -1) {
    rangersBurialPoint('activity_widget_event', {
      module: '活动', //写死 “活动”
      page_id: params['page_id'], //参考接口请求参数“pageId”
      game_id: params['game_id'], //参考接口请求参数“gameId”
      page_name: params['page_name'], //当前页面的标题，顶部的title
      page_path: params['page_path'], //当前页面的URL
      page_type: params['page_type'], //页面类型
      container_type: params['container_type'], //对应后台接口返回的容器类型：
      container_id: params['container_id'], //对应后台接口反正的容器ID，containerId
      container_custom: params['container_custom'], //对应custom字段的值
      view_type: params['view_type'], //后台接口对应的 viewType
      area_name: params['area_name'], //页面内的区域模块名称
      hole_name: params['hole_name'], //坑位名称
      hole_title: params['hole_title'], //弹窗标题
      hole_content: params['hole_content'], //弹窗文案
      hole_button: params['hole_button'] || '', //弹窗按钮
      target: params['target'], //响应方式字典
      target_url: params['target_url'], //响应的跳转链接
      click_id: click_id, //gdt_vid 或者 qz_gdt
      ext_info: typeof params['ext_info'] == 'object' ? params['ext_info'] : '', //扩展信息
      open_id: app.globalData.openId || '',
    })
  }
  // }
}
//20220407 基于22版本改革，把调用公共方法getOpendId改成先判断是否存在公共的openId
//再调用方法获取
export const getOpendId = () => {
  return new Promise((resolve, reject) => {
    if (app.globalData.openId) {
      resolve()
    } else {
      loginMethods
        .getOpendId({ reqGetOpenIdChannel: 'app' })
        .then(() => {
          resolve()
        })
        .catch(() => {
          reject()
        })
    }
  })
}
export const actEventClickTracking = (event, options, pageSetting, selectContainer, selectBasic) => {
  console.log('点击事件埋点', event, options, pageSetting, selectContainer, selectBasic)
  const hole_name = getHoleName(pageSetting, selectBasic)
  const hole_title = getHoleTitle(pageSetting, selectBasic)
  const hole_content = getHoleContent(pageSetting, selectBasic)
  const fullPath = getFullPageUrl()
  const params = {
    page_id: hasKey(options, 'pageId') ? options.pageId : '', //参考接口请求参数“pageId”
    game_id: hasKey(options, 'gameId') ? options.gameId : '', //参考接口请求参数“gameId”
    page_name: pageSetting.name || '', //当前页面的标题，顶部的title
    page_path: fullPath || '', //当前页面的URL
    page_type: pageSetting.type || '', //页面类型
    container_type: hasKey(selectContainer, 'containerType') ? selectContainer.containerType : '', //对应后台接口返回的容器类型：
    container_id: hasKey(selectContainer, 'id') ? selectContainer.id : '', //对应后台接口反正的容器ID，containerId
    container_custom: hasKey(selectBasic, 'custom') ? selectBasic.custom : '', //对应custom字段的值
    view_type: selectBasic.type || '', //后台接口对应的 viewType
    area_name: '', //页面内的区域模块名称
    hole_name: hole_name, //坑位名称
    hole_title: hole_title, //弹窗标题
    hole_content: hole_content, //弹窗文案
    target: hasKey(selectBasic, 'target') ? selectBasic.target : '', //响应方式字典
    target_url: hasKey(selectBasic, 'targetUrl') ? selectBasic.targetUrl : '', //响应的跳转链接
  }
  getOpendId()
    .then(() => {
      eventTracking(event, params)
    })
    .catch(() => {
      eventTracking(event, params)
    })
}
export const actCaptchaTracking = (event, options, pageSetting, ext_info) => {
  console.log('滑块点击事件埋点', event, options, pageSetting, ext_info)
  const fullPath = getFullPageUrl()
  const params = {
    page_id: hasKey(options, 'pageId') ? options.pageId : '', //参考接口请求参数“pageId”
    game_id: hasKey(options, 'gameId') ? options.gameId : '', //参考接口请求参数“gameId”
    page_name: pageSetting.name || '', //当前页面的标题，顶部的title
    page_path: fullPath || '', //当前页面的URL
    page_type: 6, //页面类型，滑块验证固定为6
    ext_info: ext_info || '',
  }
  getOpendId()
    .then(() => {
      eventTracking(event, params)
    })
    .catch(() => {
      eventTracking(event, params)
    })
}
//配置弹窗点击埋点
export const viewActEventClickTracking = (
  event,
  options,
  initDatapageSetting,
  pageSetting,
  selectContainer,
  selectBasic
) => {
  console.log('点击事件埋点', event, options, pageSetting, selectContainer, selectBasic)
  const hole_name = getHoleName(pageSetting, selectBasic)
  const hole_title = getHoleTitle(pageSetting, selectBasic)
  const hole_content = getHoleContent(pageSetting, selectBasic)
  const fullPath = getFullPageUrl()
  const params = {
    page_id: hasKey(options, 'pageId') ? options.pageId : '', //参考接口请求参数“pageId”
    game_id: hasKey(options, 'gameId') ? options.gameId : '', //参考接口请求参数“gameId”
    page_name: initDatapageSetting.name || '', //当前页面的标题，顶部的title
    page_path: fullPath || '', //当前页面的URL
    page_type: pageSetting.type || '', //页面类型
    container_type: hasKey(selectContainer, 'containerType') ? selectContainer.containerType : '', //对应后台接口返回的容器类型：
    container_id: hasKey(selectContainer, 'id') ? selectContainer.id : '', //对应后台接口反正的容器ID，containerId
    container_custom: hasKey(selectBasic, 'custom') ? selectBasic.custom : '', //对应custom字段的值
    view_type: selectBasic.type || '', //后台接口对应的 viewType
    area_name: '', //页面内的区域模块名称
    hole_name: hole_name, //坑位名称
    hole_title: hole_title, //弹窗标题
    //hole_button: selectBasic.name,//按钮文案
    hole_content: hole_content, //弹窗文案
    target: hasKey(selectBasic, 'target') ? selectBasic.target : '', //响应方式字典
    target_url: hasKey(selectBasic, 'targetUrl') ? selectBasic.targetUrl : '', //响应的跳转链接
  }
  getOpendId()
    .then(() => {
      eventTracking(event, params)
    })
    .catch(() => {
      eventTracking(event, params)
    })
}
export const actEventViewPageTracking = (event, options, pageSetting) => {
  const fullPath = getFullPageUrl()
  const params = {
    page_id: hasKey(options, 'pageId') ? options.pageId : '', //参考接口请求参数“pageId”
    game_id: hasKey(options, 'gameId') ? options.gameId : '', //参考接口请求参数“gameId”
    page_name: pageSetting.name || '', //当前页面的标题，顶部的title
    page_path: fullPath || '', //当前页面的URL
  }
  getOpendId()
    .then(() => {
      eventTracking(event, params)
    })
    .catch(() => {
      eventTracking(event, params)
    })
}
export const getHoleName = (pageSetting, selectBasic) => {
  if (pageSetting.type == 3 || pageSetting.type == 4 || pageSetting.type == 5) {
    return hasKey(selectBasic, 'name') ? selectBasic.name : ''
  } else {
    return (selectBasic.code || selectBasic.code == 0) && selectBasic.code != '' ? selectBasic.code : selectBasic.name
  }
}
export const getHoleTitle = (pageSetting) => {
  if (pageSetting.type == 3 || pageSetting.type == 4 || pageSetting.type == 5) {
    return pageSetting.popups.title
  }
  return ''
}
export const getHoleContent = (pageSetting) => {
  if (pageSetting.type == 3 || pageSetting.type == 4 || pageSetting.type == 5) {
    return pageSetting.popups.content
  }
  return ''
}
export const getClickId = () => {
  const options = getOptions()
  return hasKey(options, 'gdt_vid') ? options.gdt_vid : hasKey(options, 'qz_gdt') ? options.qz_gdt : ''
}

//---埋点获取open_id start ---

//---埋点获取open_id end ---
