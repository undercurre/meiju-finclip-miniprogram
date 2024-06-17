const trackAction = {
  washOn: {
    widget_id: 'click_wash',
    widget_name: '冲洗',
    ext_info: '开',
  },
  washOff: {
    widget_id: 'click_wash',
    widget_name: '冲洗',
    ext_info: '关',
  },
  resetOld: (params) => {
    return {
      widget_id: 'click_filter_reset',
      widget_name: '滤芯复位',
      ext_info: params.options.title,
    }
  },
  resetNew: (params) => {
    return {
      widget_id: 'click_filter_reset',
      widget_name: '滤芯复位',
      ext_info: params.options.title,
    }
  },
  germicidalOn: {
    widget_id: 'click_germicidal',
    widget_name: '高温杀菌',
    ext_info: '开',
  },
  germicidalOff: {
    widget_id: 'click_germicidal',
    widget_name: '高温杀菌',
    ext_info: '关',
  },
  germicidalTipsOn: {
    widget_id: 'click_germicidal_tips',
    widget_name: '高温杀菌提醒开关',
    ext_info: '开',
  },
  germicidalTipsOff: {
    widget_id: 'click_germicidal_tips',
    widget_name: '高温杀菌提醒开关',
    ext_info: '关',
  },
  bubbleOn: {
    widget_id: 'click_bubble',
    widget_name: '微气泡',
    ext_info: '开',
  },
  bubbleOff: {
    widget_id: 'click_bubble',
    widget_name: '微气泡',
    ext_info: '关',
  },
  heatOn: {
    widget_id: 'click_heat',
    widget_name: '加热',
    ext_info: '开',
  },
  heatOff: {
    widget_id: 'click_heat',
    widget_name: '加热',
    ext_info: '关',
  },
  keepWarmOn: {
    widget_id: 'click_keep_warm',
    widget_name: '保温开关',
    ext_info: '开',
  },
  keepWarmOff: {
    widget_id: 'click_keep_warm',
    widget_name: '保温开关',
    ext_info: '关',
  },
  setKeepWarmTime: (params) => {
    return {
      widget_id: 'click_keep_warm_time',
      widget_name: '保温时间',
      ext_info: params.options.keep_warm_time + '小时',
    }
  },
  lockOn: {
    widget_id: 'click_lock',
    widget_name: '童锁',
    ext_info: '开',
  },
  lockOff: {
    widget_id: 'click_lock',
    widget_name: '童锁',
    ext_info: '关',
  },
  washTeaOn: {
    widget_id: 'click_wash_tea',
    widget_name: '洗茶',
    ext_info: '开',
  },
  washTeaOff: {
    widget_id: 'click_wash_tea',
    widget_name: '洗茶',
    ext_info: '关',
  },
  setQuantify: (params) => {
    return {
      widget_id: 'click_quantify',
      widget_name: params.options.widget_name,
      ext_info: params.options.ext_info,
    }
  },
  setTemp: (params) => {
    return {
      widget_id: 'click_temp',
      widget_name: params.options.widget_name,
      ext_info: params.options.ext_info,
    }
  },
  cloudWashSwitchOn: () => {
    return {
      widget_id: 'click_cloud_wash',
      widget_name: '智能冲洗',
      ext_info: '开',
    }
  },
  cloudWashSwitchOff: () => {
    return {
      widget_id: 'click_cloud_wash',
      widget_name: '智能冲洗',
      ext_info: '关',
    }
  },
  CloudWashModeAI: () => {
    return {
      widget_id: 'click_ai_wash',
      widget_name: 'AI冲洗',
      ext_info: '开',
    }
  },
  CloudWashModeDF: () => {
    return {
      widget_id: 'click_custom_wash',
      widget_name: '自定义冲洗',
      ext_info: '开',
    }
  },
}

const getTrackAction = function (action) {
  return trackAction[action] || null
}

export default getTrackAction
