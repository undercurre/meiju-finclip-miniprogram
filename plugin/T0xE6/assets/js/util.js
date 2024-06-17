export const getColor=function(color){return color=="gray"?"#7C879B":color=="tomato"?"#FE674A":color=="yellow"?"#FFAA10":color=="aqua"?"#29C3FF":color=="colmo"?"#C26033":color=="colmo-gray"?"rgba(255,255,255,.4)":color},to2Bit=function(val){var _str_val=parseInt(val).toString(2),_str="";if(_str_val.length<8)for(var i=0;i<8-_str_val.length;i++)_str+="0";var str_2=_str+_str_val;return str_2=str_2.split("").reverse().join(""),str_2},floatAdd=function(arg1,arg2){var r1,r2,m;try{r1=arg1.toString().split(".")[1].length}catch{r1=0}try{r2=arg2.toString().split(".")[1].length}catch{r2=0}return m=Math.pow(10,Math.max(r1,r2)),(arg1*m+arg2*m)/m},parseTime=function(a,b){var s1=a>9?a:"0"+a,s2=b>9?b:"0"+b,r=s1+":"+s2;return r},getCurrentTime=function(){let now=new Date,hour=now.getHours(),min=now.getMinutes();return parseTime(hour,min)},prefixInteger=function(num,m){return(Array(m).join(0)+num).slice(-m)},toServer=function(showTime,showDay){var endTime,isEndNextDay,bit4;return bit4=prefixInteger(parseInt(showTime.replace(":",""))+showDay*2400-1,4),endTime=prefixInteger(bit4.substring(0,2)%24,2)+":"+prefixInteger(bit4.substring(2,4).replace("99","59"),2),isEndNextDay=bit4.substring(0,2)/24>=1,{endTime,isEndNextDay}},toShow=function(serverTime,serverDay){var endTime,isEndNextDay,bit4;return bit4=prefixInteger(parseInt(serverTime.replace(":","").replace("59","99"))+(serverDay?1:0)*2400+1,4),endTime=prefixInteger(parseInt(bit4.substring(0,2))%24,2)+":"+bit4.substring(2,4),isEndNextDay=parseInt(bit4.substring(0,2))/24>=1,{endTime,isEndNextDay}},getFunctionBuryParams=function(object,isOn,customParams=""){return{object,ex_value:isOn=="on"?"\u5173":"\u5F00",value:isOn=="on"?"\u5F00":"\u5173",custom_params:customParams}},getModeBuryParams=function(mode,lastObj,changeObj){let newObj={...lastObj,...changeObj},setting_params={};for(let key in newObj)setting_params[key]=(lastObj[key]||lastObj[key]=="0"&&"0"||"")+"|"+newObj[key];return{mode,setting_params:JSON.stringify(setting_params)}};
