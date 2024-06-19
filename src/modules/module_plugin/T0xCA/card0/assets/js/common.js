
function getVariableMode(mode){
  let dataModel = "";
  if(mode == "none_mode"){
    dataModel = "无变温室";
  }else if(mode == "soft_freezing_mode"){
    dataModel = "软冷冻";
  }else if(mode == "zero_fresh_mode"){
    dataModel = "零度保鲜";
  }else if(mode == "cold_drink_mode"){
    dataModel = "冷饮";
  }else if(mode == "fresh_product_mode"){
    dataModel = "果蔬";
  }else if(mode == "partial_freezing_mode"){
    dataModel = "微冻";
  }else if(mode == "dry_zone_mode"){
    dataModel = "干区";
  }else if(mode == "freeze_warm_mode"){
    dataModel = "冰温";
  }else if(mode == "freeze_mode"){
    dataModel = "冷冻";
  }
  return dataModel;
}

function getVariableModeInt(mode){
  let dataModel = {};
  if(mode == "0"){
    //软冷冻模式
    dataModel.value = 0;
    dataModel.name = "软冷冻";
    dataModel.cmd = "soft_freezing_mode";
  }else if(mode == "1"){
    // 零度保鲜模式
    dataModel.value = 1;
    dataModel.name = "零度保鲜";
    dataModel.cmd = "zero_fresh_mode";
  }else if(mode == "2"){
    //冷饮模式
    dataModel.value = 2;
    dataModel.name = "冷饮";
    dataModel.cmd = "cold_drink_mode";
  }else if(mode == "3"){
    //果蔬模式
    dataModel.value = 3;
    dataModel.name = "果蔬";
    dataModel.cmd = "fresh_product_mode";
  }else if(mode == "4"){
    // 微冻模式
    dataModel.value = 4;
    dataModel.name = "微冻";
    dataModel.cmd = "partial_freezing_mode";
  }else if(mode == "5"){
    // 干区模式
    dataModel.value = 5;
    dataModel.name = "干区";
    dataModel.cmd = "dry_zone_mode";
  }else if(mode == "6"){
    //冰温模式
    dataModel.value = 6;
    dataModel.name = "冰温";
    dataModel.cmd = "freeze_warm_mode";
  }else if(mode == "7"){
    //冷冻模式
    dataModel.value = 7;
    dataModel.name = "冷冻";
    dataModel.cmd = "freeze_mode";
  }
  return dataModel;
}

function encode(_str) {
  let handleData = _str+"";
  let staticchars = "PXhw7UT1B0a9kQDKZsjIASmOezxYG4CHo5Jyfg2b8FLpEvRr3WtVnlqMidu6cN";    
  let encodechars = "";    
  let code = null;
  for(let i = 0; i < handleData.length; i++) {
    let num0 = staticchars.indexOf(handleData[i]);      
    if(num0 == -1) {        
      code = handleData[i];      
    } else {
    code = staticchars[(num0 + 3) % 62];      
  }      
    var num1 = parseInt(Math.random() * 62, 10);      
    var num2 = parseInt(Math.random() * 62, 10);   
    encodechars += staticchars[num1] + code + staticchars[num2];    
  }
  return encodechars;  
}

function formatDate(date) {
  var curYear = date.getFullYear();
  var curMonth = date.getMonth() + 1;
  var curWeekday = date.getDate();

  if (curMonth < 10) {
    curMonth = "0" + curMonth;
  }
  if (curWeekday < 10) {
    curWeekday = "0" + curWeekday;
  }
  return (curYear + "-" + curMonth + "-" + curWeekday);
}

module.exports = {
  getVariableMode,
  getVariableModeInt,
  encode,
  formatDate
}