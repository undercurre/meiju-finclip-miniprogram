
export default {
  /**
   * 
   * @param {*} deviceState //主状态
   * @param {*} subDeviceState 次状态
   */
  chargeButtonState(deviceState, subDeviceState) {//回充/暂停按钮是否置灰 
    let unableClicks = ["connect","updating", "relocate", "charging_on_dock","charge_finish","clean_mop","on_base"]
    let subUnableClicks = ["default_sleeping","charging","inject_water","clean_mop","dry_mop","hot_dry_mop","charge_finish","dust_collect","cut_hair","erp_mode"]//子状态中 目前不清楚水站空闲 扫地机在不在站上
    if(unableClicks.indexOf(deviceState) > -1) {
      return false
    }else {
      if(subUnableClicks.indexOf(subDeviceState) > -1) {
        return false
      }
    }
    return true
  },
  modeButtonState(deviceState, subDeviceState) {//模式切换按钮是否置灰 
    // let ableClicks = ["stop","charging_on_dock","charge_finish","sleep","error"]
    // let subAbleClicks = ["default_sleeping","standing_sleeping","dry_mop","hot_dry_mop","charging","charge_finish"]
    // if(ableClicks.indexOf(deviceState) > -1) {
    //   return true
    // }else {
    //   if(subAbleClicks.indexOf(subDeviceState) > -1) {
    //     return true
    //   }
    // }
    // return false
    let unableClicks = ["connect","updating", "relocate","clean_mop","video_cruise","video_cruise_pause"]
    let subUnableClicks = ["clean_mop","inject_water", "dust_collect","cut_hair"]
    if(unableClicks.indexOf(deviceState) > -1) {
      return false
    }else {
      if(subUnableClicks.indexOf(subDeviceState) > -1) {
        return false
      } 
    }
    return true
  },

  workButtonState(deviceState, subDeviceState) {// 启停按钮是否置灰 
    let unableClicks = ["connect","updating","relocate", "clean_mop","back_clean_mop", "clean_mop_pause", "video_cruise", "video_cruise_pause"]
    let subUnableClicks = ["dust_collect", "cut_hair", "inject_water", "clean_mop","cruise_pause_sleeping"]
    if(unableClicks.indexOf(deviceState) > -1) {
      return false
    }else {
      if(subUnableClicks.indexOf(subDeviceState) > -1) {
        return false
      } 
    }
    return true
  },
//是否是工作状态
isWorkState(deviceState, subDeviceState){
  let nonWrokingState = [ "charging_on_dock", "charge_finish", "stop", "error"]
  let nonSubWrokState = ["default_sleeping","standing_sleeping","return_station_pause_sleeping","dry_mop","hot_dry_mop","charging","charge_finish","erp_mode","cruise_pause_sleeping"]
  if(nonWrokingState.indexOf(deviceState) > -1) {
    return false
  }else {
    if(nonSubWrokState.indexOf(subDeviceState) > -1) {
      return false
    }
  }
  return true
},

  

   //根据设备当前状态的提示文案
   tipsText(deviveState, subDeviceState) {//定位中在card页面做判断
    console.log("当前的主状态：",deviveState);
    console.log("当前的次状态：",subDeviceState);

    if(deviveState == "charging_on_dock" || deviveState == "charge_finish" || subDeviceState == "default_sleeping") {
      return "机器人正在充电"
    }else if(deviveState == "clean_mop" || subDeviceState == 'clean_mop') {
      // return "清洗拖布中，请稍后"
      return "机器人工作中，请稍后"
    }else if(deviveState == "back_clean_mop") {
      // return "返回清洗拖布中，请稍后"
      return "机器人工作中，请稍后"
    }else if(deviveState == "on_base") {//在基站的时候看子状态
      if(subDeviceState == "charging" || subDeviceState == "charge_finish" ) {
        return "机器人正在充电"
      }else if(subDeviceState == "inject_water") {
        // return "注水中，请稍后"
        return "机器人工作中，请稍后"
      }else if(subDeviceState == "dust_collect") {
        // return "集尘中，请稍后"
        return "机器人工作中，请稍后"
      }else if(subDeviceState == "auto_clean") {
        // return "基站自清洁中，请稍后"
        return "机器人工作中，请稍后"
      }else if(subDeviceState == "cut_hair") {
        // return "毛发切割中，请稍后"
        return "机器人工作中，请稍后"
      }else if(subDeviceState == "dry_mop" || subDeviceState == "hot_dry_mop") {
        // return "烘干中，请稍后"
        return "机器人工作中，请稍后"
      }
    }
    return "机器人工作中，请稍后"
  },

 
}