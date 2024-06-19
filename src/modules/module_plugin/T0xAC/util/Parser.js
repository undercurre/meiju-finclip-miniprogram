/**
 * Created by liujim on 2017/8/19.
 */


import Helper from "./Helper"

import {CMD, STATUS} from "./Data"
import {ucPQTempTab, tempArray, tempDictC2F, tempDictF2C, TPValues, crc8_854_table} from "./Entry"
import Common from '../util/common'
export default class Parser {
  constructor() {
    this.noneAutoUploadAttributeClassic = ["naturalWind"];
    this.noneAutoUploadAttributeNew = ["naturalWind"];

    this.acceptingState = Helper.clone(STATUS.standardProtocolStatusSet);
    this.sendingState = Helper.clone(STATUS.standardProtocolStatusSet);
    this.totalStateFirst = Helper.clone(STATUS.totalStateFirstGroup_1);
    this.totalStateSecond = Helper.clone(STATUS.totalStateFirstGroup_2);

    this.newacceptingState = Helper.clone(STATUS.newProtocolStatusSet);
    this.newsendingState = Helper.clone(STATUS.newProtocolStatusSet);

    this.isStandardDevice = false;

    this.showACStatus();
  }

  showACStatus() {
    console.log("this.acceptingState------->", this.acceptingState);
    console.log("this.sendingState------->", this.sendingState);
    console.log("this.newacceptingState------->", this.newacceptingState);
    console.log("this.newsendingState------->", this.newsendingState);
  }

  /***********************************************parser********************************************************/
  crc8_854(dataBuf, dataLen) {
    let crc = 0;

    for (let si = 0; si < dataLen; si++) {
      crc = parseInt(crc8_854_table[crc ^ (dataBuf[si])]);
    }
    return crc;
  }

  crc8_854_AVA(dataBuf, dataLen) {
    let crc = 0;

    // let si = 0;
    let pk = 0;
    let temp = dataBuf;

    for(let si = 0; si < dataLen; si++) {
      console.log(temp[si]);
      pk = ((crc ^ (temp[si])) % 256)
      pk %= 256;
      crc = parseInt(crc8_854_table[pk])      
    }
    return crc
  }

  makeSum(tmpbuf, tmpLen) {
    console.log(tmpbuf, tmpLen);
    let resVal = 0;
    for (let si = 0; si < tmpLen; si++) {
      resVal = resVal + tmpbuf[si];
    }

    resVal = 255 - resVal + 1;

    return resVal & 0xff;
  }

  makeSum_AVA(tmpBuff, tmpLen) {
    let resVal = 0;
    let si;
    for(si = 0; si < tmpLen; si++) {
      resVal = resVal + tmpBuff[si];
    }

    resVal = (255-(resVal % 256)) + 1
    
    return resVal;
  }

  TempValCheck(tempMode, tempVal) {
    let resVal = 0.0;
    let comVal = parseInt(tempVal * 10 + 0.5);

    /*
     ** tempMode=0为摄氏温度，=1为华氏温度
     */
    if (0 == tempMode) {
      resVal = (comVal < 160) ? (16.0) : ((comVal > 300) ? (30.0) : (tempVal));
    }

    if (1 == tempMode) {
      resVal = (comVal < 600) ? (60.0) : ((comVal > 890) ? (89.0) : (tempVal));
    }

    return resVal;
  }

  BCDToInt(bcd) {
    return (0xf & (bcd >> 4)) * 10 + (0xf & bcd);
  }

  checkTempVal(val) {
    return parseInt((val < 17.0) ? (17.0) : ((val > 30.0) ? (30.0) : (val)));
  }


  //查询打包
  // 组包函数
  //*msgType:命令类型
  //*srcBuf:待组包查询数据（组）,即家电私有协议中的数据
  //*srcSBuf:待组包设置数据（组）,即家电私有协议中的数据
  stdAirConEx_pro2byte_check(msgType, type, srcBuf) {
    let tmpBuf = [];

    switch (msgType) {
      case CMD.CMDTYPE_QUERY_INFO: {

        let tmp = Helper.clone(srcBuf);

        // Head
        tmpBuf[0] = 0xAA;

        // Data Len
        tmpBuf[1] = 23;

        // Dev Type
        tmpBuf[2] = type;

        // 6 bytes ID
        tmpBuf[3] = 0x00;
        tmpBuf[4] = 0x00;
        tmpBuf[5] = 0x00;
        tmpBuf[6] = 0x00;
        tmpBuf[7] = 0x00;
        tmpBuf[8] = 0x00;

        // msg type
        tmpBuf[9] = 0x03;

        tmpBuf[10] = 0x41;
        tmpBuf[11] = (tmp.sound << 6) | 0x21;
        tmpBuf[12] = 0x00;
        tmpBuf[13] = 0xFF;
        tmpBuf[14] = tmp.optCommand;

        if (0x01 == tmp.optCommand)
          tmpBuf[15] = tmp.optVal.bodyTemp * 2 + 50;
        else
          tmpBuf[15] = 0xFF;

        if (0x02 == tmp.optCommand)
          tmpBuf[16] = tmp.optVal.specKey;
        else
          tmpBuf[16] = 0x00;

        if (0x03 == tmp.optCommand)
          tmpBuf[17] = tmp.optVal.queryStat;
        else
          tmpBuf[17] = 0x00;

        if (0x04 == tmp.optCommand)
          tmpBuf[18] = tmp.optVal.instPos;
        else
          tmpBuf[18] = 0x00;

        if (0x05 == tmp.optCommand)
          tmpBuf[19] = tmp.optVal.testMode;
        else
          tmpBuf[19] = 0x00;

        if (0x06 == tmp.optCommand)
          tmpBuf[19] |= (tmp.optVal.maxCoolHeat & 0x01) << 7;
        else
          tmpBuf[19] |= 0x00;

        tmpBuf[20] = 0x00;

        tmpBuf[21] = tmp.order;

        tmpBuf[22] = this.crc8_854(tmpBuf.slice(10), 12);

        tmpBuf[23] = this.makeSum(tmpBuf.slice(1), 22);

        let tmpArr = Helper.hexArrayToDecimalArray(tmpBuf);

        return tmpArr;
      }
        break;
      case CMD.CMDTYPE_QUERY_C1_1:
      case CMD.CMDTYPE_QUERY_C1_2: {
        // Head
        tmpBuf[0] = 0xAA;

        // Data Len
        tmpBuf[1] = 13;

        // Dev Type
        tmpBuf[2] = type;

        // 6 bytes ID
        tmpBuf[3] = 0x00;
        tmpBuf[4] = 0x00;
        tmpBuf[5] = 0x00;
        tmpBuf[6] = 0x00;
        tmpBuf[7] = 0x00;
        tmpBuf[8] = 0x02;

        // msg type
        tmpBuf[9] = 0x03;

        tmpBuf[10] = 0xC1;
        tmpBuf[11] = msgType == CMD.CMDTYPE_QUERY_C1_1 ? 0x01 : 0x02;//组号，现固定
        tmpBuf[12] = this.crc8_854(tmpBuf.slice(10), 2);
        tmpBuf[13] = this.makeSum(tmpBuf.slice(1), 12);

        let tmpArr = Helper.hexArrayToDecimalArray(tmpBuf);
        return tmpArr;
      }
        break;
      //查询各组参数
      case CMD.CMDTYPE_QUERY_PAR: {
        let tmp = Helper.clone(srcBuf);

        // Head
        tmpBuf[0] = 0xAA;

        // Data Len
        tmpBuf[1] = 16;

        // Dev Type
        tmpBuf[2] = type;

        // 6 bytes ID
        tmpBuf[3] = 0x00;
        tmpBuf[4] = 0x00;
        tmpBuf[5] = 0x00;
        tmpBuf[6] = 0x00;
        tmpBuf[7] = 0x00;
        tmpBuf[8] = 0x02;

        // msg type
        tmpBuf[9] = 0x03;

        tmpBuf[10] = 0x41;
        tmpBuf[11] = (tmp.sound << 6) | 0x21;
        tmpBuf[12] = 0x01;
        tmpBuf[13] = tmp.optCommand;
        tmpBuf[14] = tmp.order;

        tmpBuf[15] = this.crc8_854(tmpBuf.slice(10), 5);

        tmpBuf[16] = this.makeSum(tmpBuf.slice(1), 15);

        let tmpArr = Helper.hexArrayToDecimalArray(tmpBuf);

        return tmpArr;
      }
        break;

      case CMD.CMDTYPE_QUERY_COOLFREE: { // 组酷风查询指令
        let tmp = Helper.clone(srcBuf);   
        console.log(srcBuf);     
        // keyB["BYTE_QUERYL_REQUEST"] = 0x11
        // Head
        tmpBuf[0] = 0xAA;

        // Data Len
        tmpBuf[1] = 8;

        // Dev Type
        tmpBuf[2] = 0x00;        
        tmpBuf[3] = 0xFF;
        tmpBuf[4] = 0xFF;
        tmpBuf[5] = 0x11;    

        
        tmpBuf[6] = this.crc8_854_AVA(tmpBuf.slice(0,6), 6);

        tmpBuf[7] = this.makeSum(tmpBuf.slice(0,7), 7);

        console.log(tmpBuf,tmpBuf[6],tmpBuf[7]);

        let tmpArr = Helper.hexArrayToDecimalArray(tmpBuf);
        let str = Helper.decimalArrayToHexStrArrayFormat(tmpArr)
        console.log(str);       
        return  this.getAcMsg(tmpArr);
      }        
        break;
        default:
        break;
    }

    let errorMsg = ["make packet false"]; // [2.13]
    return errorMsg;
  }

  //控制打包-经典控制
  // 组包函数
  //*msgType:命令类型
  //*srcBuf:待组包查询数据（组）,即家电私有协议中的数据
  //*srcSBuf:待组包设置数据（组）,即家电私有协议中的数据
  stdAirConEx_pro2byte_set(msgType, type, srcBuf) {
    let tmplen = 10;
    let tmpBuf = []; //128
    let stSetInfo = Helper.clone(srcBuf);

    switch (msgType) {
      //设置各组参数
      case CMD.CMDTYPE_QUERY_PAR: {

        let tmp = Helper.clone(srcBuf);

        // Head
        tmpBuf[0] = 0xAA;

        // Data Len
        tmpBuf[1] = 16;

        // Dev Type
        tmpBuf[2] = type;

        // 6 bytes ID
        tmpBuf[3] = 0x00;
        tmpBuf[4] = 0x00;
        tmpBuf[5] = 0x00;
        tmpBuf[6] = 0x00;
        tmpBuf[7] = 0x00;
        tmpBuf[8] = 0x02;

        // msg type
        tmpBuf[9] = 0x03;

        tmpBuf[10] = 0x41;
        tmpBuf[11] = (tmp.btnSound << 6) | 0x21;
        tmpBuf[12] = 0x01;
        tmpBuf[13] = tmp.order;
        tmpBuf[14] = 0x00;

        tmpBuf[15] = this.crc8_854(tmpBuf.slice(10), 5);

        tmpBuf[16] = this.makeSum(tmpBuf.slice(1), 15);

        let tmpArr = Helper.hexArrayToDecimalArray(tmpBuf);

        return tmpArr;
      }
        break;

      case CMD.CMDTYPE_SET: {
        // Head
        tmpBuf[0] = 0xAA;

        // Dev Type
        tmpBuf[2] = type;
        // 6 bytes ID
        tmpBuf[3] = 0x00;
        tmpBuf[4] = 0x00;
        tmpBuf[5] = 0x00;
        tmpBuf[6] = 0x00;
        tmpBuf[7] = 0x00;
        tmpBuf[8] = 0x02;

        // msg type
        tmpBuf[9] = 0x02;
        tmpBuf[tmplen] = 0x40;

        //APP来源控制
        stSetInfo.controlSource = 1;
        console.log('stSetInfo stSetInfo stSetInfo',stSetInfo)
        tmpBuf[tmplen + 1] = ((stSetInfo.btnSound & 0x01) << 6)
          | ((stSetInfo.quickChkSts & 0x01) << 5)
          | ((stSetInfo.timingType & 0x01) << 4)
          | ((stSetInfo.childSleepMode & 0x01) << 3)
          | ((stSetInfo.iMode & 0x01) << 2)
          | ((stSetInfo.controlSource & 0x01) << 1)
          | ((stSetInfo.runStatus & 0x01) << 0);

        //			unsigned char u8Temp = stSetInfo.tempSet;
        //			tmpBuf[12] = ((stSetInfo.mode & 0x07) << 5) | ((u8Temp - 16) & 0x0F);

        //			u8Temp = stSetInfo.tempSet * 10;
        //			if( 5 == (u8Temp % 10) )	// 温度是否有0.5
        //			{
        //				tmpBuf[12] |= 0x10;
        //			}

        // MODI - 2014.10.10 {
        let u8Temp = 0;
        tmpBuf[tmplen + 2] = ((stSetInfo.mode & 0x07) << 5);// | ((u8Temp - 16) & 0x0F);

        let tmpData = 0;

        let tempModeSwitchFlag = 1;

        let isChangeMode = stSetInfo.tempModeSwitch == this.acceptingState.tempModeSwitch;

        if (tempModeSwitchFlag != this.acceptingState.tempModeSwitch) {
          //摄氏温度处理
          tmpData = Helper.parseUnsignedInt(stSetInfo.tempSet * 10);
        }
        else {
          //华氏温度处理
          tmpData = this.changeTempC(stSetInfo.tempSet, isChangeMode) * 10;
        }

        if (160 > tmpData || 300 < tmpData) {
          tmpBuf[tmplen + 2] |= 0;
        }
        else {
          tmpBuf[tmplen + 2] |= ((tmpData / 10) - 16) & 0x0F;
        }

        if (0 == (tmpData % 10))	// 1℃步进
        {
          tmpBuf[tmplen + 2] |= 0 << 4;
        }
        else if (5 == (tmpData % 10)) // 0.5℃步进
        {
          tmpBuf[tmplen + 2] |= 1 << 4;
        }
        else {
          // 不支持的温度值步进;
          let errorMsg = ["unpack temp false"]; // [2.13]
          return errorMsg;
        }

        tmpBuf[tmplen + 3] = ((stSetInfo.timingIsValid & 0x01) << 7) | (stSetInfo.windSpeed & 0x7F);

        if (1 == stSetInfo.timingType) {
          tmpBuf[tmplen + 4] = (stSetInfo.timingOnSwitch << 7)
            | (stSetInfo.timingOnHour << 2)
            | (stSetInfo.timingOnMinute / 15);

          tmpBuf[tmplen + 5] = (stSetInfo.timingOffSwitch << 7)
            | (stSetInfo.timingOffHour << 2)
            | (stSetInfo.timingOffMinute & 0x03);

          tmpBuf[tmplen + 6] = ((stSetInfo.timingOnMinute % 15) << 4) | ((stSetInfo.timingOffMinute % 15));
        }
        else {
          // 定时开时间计算
          let tmpMinute = stSetInfo.timingOnMinute;

          if ((1 == stSetInfo.timingOnSwitch) && (0 != tmpMinute)) // 定时开开启
          {
            tmpBuf[tmplen + 4] = 0x80;

            if (0 != (tmpMinute % 15)) {
              tmpBuf[tmplen + 4] |= (tmpMinute / 15) & 0x7F;
              tmpBuf[tmplen + 6] |= ((15 - (tmpMinute % 15)) & 0x0F) << 4;
            } else {
              tmpBuf[tmplen + 4] |= (tmpMinute / 15) & 0x7F;
              tmpBuf[tmplen + 6] = 0xff;
            }
          }
          else {
            tmpBuf[tmplen + 4] = 0x7F;
            tmpBuf[tmplen + 6] = 0xfF;
          }

          // 定时关时间计算
          tmpMinute = stSetInfo.timingOffMinute;
          // stSetInfo.timingOffHour * 60 

          if ((1 == stSetInfo.timingOffSwitch) && (0 != tmpMinute))	// 定时关开启
          {
            tmpBuf[tmplen + 5] = 0x80;

            if (0 != (tmpMinute % 15)) {
              tmpBuf[tmplen + 5] |= (tmpMinute / 15) & 0x7F;
              tmpBuf[tmplen + 6] |= (15 - (tmpMinute % 15)) & 0x0F;
            } else {
              tmpBuf[tmplen + 5] |= (tmpMinute / 15) & 0x7F;
              tmpBuf[tmplen + 6] = 0xff;
            }
          }
          else {
            tmpBuf[tmplen + 5] = 0x7F;
            tmpBuf[tmplen + 6] = 0xFf;
          }
        }

        //上摆风
        if (0 == stSetInfo.cosyWind) {
          tmpBuf[tmplen + 7] = 0x30;

          // if (stSetInfo.upWind > 0) {
          //   tmpBuf[tmplen + 7] |= (stSetInfo.upWind_1 << 0);
          //   tmpBuf[tmplen + 7] |= (stSetInfo.upWind_2 << 1);
          //   console.log('没进正常');
          // }
          // else {
            tmpBuf[tmplen + 7] |= (stSetInfo.rightLeftRightWind << 0); //上下摆风
            tmpBuf[tmplen + 7] |= (stSetInfo.leftLeftRightWind << 1); //上下摆风
            tmpBuf[tmplen + 7] |= (stSetInfo.rightUpDownWind << 2); //左右摆风
            tmpBuf[tmplen + 7] |= (stSetInfo.leftUpDownWind << 3); //左右摆风
          // }
        }
        else if (stSetInfo.cosyWind < 10)
          tmpBuf[tmplen + 7] = stSetInfo.cosyWind + 0x10;
        else
          tmpBuf[tmplen + 7] = stSetInfo.cosyWind + 22;

        tmpBuf[tmplen + 8] = (stSetInfo.cosySleepMode & 0x03)
          | (stSetInfo.almSleep << 2)
          | (stSetInfo.powerSave << 3)
          | (stSetInfo.farceWind << 4)
          | (stSetInfo.strong << 5)
          | (stSetInfo.energySave << 6)
          | (stSetInfo.bodySense << 7);

        if (stSetInfo.cosySleepMode > 0) {
          stSetInfo.chgComfortSleep = 1;
        }
        else {
          stSetInfo.chgComfortSleep = 0;
        }

        tmpBuf[tmplen + 9] = (stSetInfo.wisdomEye << 0)
          | (stSetInfo.chgOfAir << 1)
          | (stSetInfo.diyFunc << 2)
          | (stSetInfo.elecHeat << 3)
          | (stSetInfo.elecHeatForced << 4)
          | (stSetInfo.cleanUpFunc << 5)
          | (stSetInfo.chgComfortSleep << 6)
          | (stSetInfo.ecoFunc << 7);  

        tmpBuf[tmplen + 10] = (stSetInfo.sleepFuncState << 0)
          | (stSetInfo.tubroFuncState << 1)
          | (stSetInfo.tempModeSwitch << 2)
          | (stSetInfo.againstCool << 3)
          | (stSetInfo.nightLight << 4)
          | (stSetInfo.pmv << 5)
          | (stSetInfo.dustFlow << 6)
          | (stSetInfo.cleanFanRunTime << 7);

        tmpBuf[tmplen + 11] = (this.checkTempVal(stSetInfo.firstHourTemp) - 17) | ((this.checkTempVal(stSetInfo.secondHourTemp) - 17) << 4);
        tmpBuf[tmplen + 12] = (this.checkTempVal(stSetInfo.thirdHourTemp) - 17) | ((this.checkTempVal(stSetInfo.fourthHourTemp) - 17) << 4);
        tmpBuf[tmplen + 13] = (this.checkTempVal(stSetInfo.fifthHourTemp) - 17) | ((this.checkTempVal(stSetInfo.sixthHourTemp) - 17) << 4);
        tmpBuf[tmplen + 14] = (this.checkTempVal(stSetInfo.seventhHourTemp) - 17) | ((this.checkTempVal(stSetInfo.eighthHourTemp) - 17) << 4);
        tmpBuf[tmplen + 15] = (this.checkTempVal(stSetInfo.ninethHourTemp) - 17) | ((this.checkTempVal(stSetInfo.tenthHourTemp) - 17) << 4);

        tmpBuf[tmplen + 16] = 0;	// 舒睡时间0.5度的处理
        u8Temp = stSetInfo.firstHourTemp * 10;
        if (5 == (u8Temp % 10)) {
          tmpBuf[tmplen + 16] |= (0x01 << 0);
        }

        u8Temp = stSetInfo.secondHourTemp * 10;
        if (5 == (u8Temp % 10)) {
          tmpBuf[tmplen + 16] |= (0x01 << 1);
        }

        u8Temp = stSetInfo.thirdHourTemp * 10;
        if (5 == (u8Temp % 10)) {
          tmpBuf[tmplen + 16] |= (0x01 << 2);
        }

        u8Temp = stSetInfo.fourthHourTemp * 10;
        if (5 == (u8Temp % 10)) {
          tmpBuf[tmplen + 16] |= (0x01 << 3);
        }

        u8Temp = stSetInfo.fifthHourTemp * 10;
        if (5 == (u8Temp % 10)) {
          tmpBuf[tmplen + 16] |= (0x01 << 4);
        }

        u8Temp = stSetInfo.sixthHourTemp * 10;
        if (5 == (u8Temp % 10)) {
          tmpBuf[tmplen + 16] |= (0x01 << 5);
        }

        u8Temp = stSetInfo.seventhHourTemp * 10;
        if (5 == (u8Temp % 10)) {
          tmpBuf[tmplen + 16] |= (0x01 << 6);
        }

        u8Temp = stSetInfo.eighthHourTemp * 10;
        if (5 == (u8Temp % 10)) {
          tmpBuf[tmplen + 16] |= (0x01 << 7);
        }

        tmpBuf[tmplen + 17] = 0;	// 舒睡时间0.5度的处理
        u8Temp = stSetInfo.ninethHourTemp * 10;
        if (5 == (u8Temp % 10)) {
          tmpBuf[tmplen + 17] |= (0x01 << 4);
        }

        u8Temp = stSetInfo.tenthHourTemp * 10;
        if (5 == (u8Temp % 10)) {
          tmpBuf[tmplen + 17] |= (0x01 << 5);
        }

        //if (0 == stSetInfo.pmv)
        //{
        //  stSetInfo.peakValleyMode = 0x00;
        //}

        tmpBuf[tmplen + 17] |= (stSetInfo.ComfortSleepTime & 0x0f);
        tmpBuf[tmplen + 17] |= ((stSetInfo.pmv & 0x08) << 4);
        tmpBuf[tmplen + 17] |= ((stSetInfo.naturalWind & 0x01) << 6);

        //tmpBuf[28]  = ((stSetInfo.peakValleyMode & 0x07) << 5) | (((unsigned char)stSetInfo.tempSet2 - 12) & 0x1F);//stSetInfo.tempSet2暂时固定为0
        tmpBuf[tmplen + 18] = ((stSetInfo.pmv & 0x07) << 5); // 固定0

        //16度温度控制
        let tempsetExtra;
        if (tempModeSwitchFlag != this.acceptingState.tempModeSwitch) {
          if ((13.0 > stSetInfo.tempSet2) || (35.0 < stSetInfo.tempSet2)) {
            stSetInfo.tempSet2 = 12.0;
          }

          // 摄氏温度处理
          tempsetExtra = Helper.parseUnsignedInt(stSetInfo.tempSet2 * 10 + 0.5);
        }
        else {
          if ((60.0 > stSetInfo.tempSet2) || (86.0 < stSetInfo.tempSet2)) {
            stSetInfo.tempSet2 = 60.0;
          }

          //华氏温度处理
          tempsetExtra = this.changeTempC(stSetInfo.tempSet2, isChangeMode) * 10;
        }
        
        tmpBuf[tmplen + 18] |= ((((tempsetExtra / 10) - 12) & 0x1F) << 0);

        //湿度
        tmpBuf[tmplen + 19] = (0x7F & stSetInfo.humidity);
        tmpBuf[tmplen + 19] = tmpBuf[tmplen + 19] + 128;

        //下摆风        
        tmpBuf[tmplen + 20] = (0x01 & stSetInfo.downWind) << 7;

        //tmpBuf[tmplen + 20] = 0x00;

        tmpData = Helper.parseUnsignedInt(stSetInfo.tempRangeUpLimit * 10);
        if (160 > tmpData) {
          tmpData = 160;
        }
        else if (300 < tmpData) {
          tmpData = 300;
        }

        if (tempModeSwitchFlag == this.acceptingState.tempModeSwitch) {
          //华氏温度处理
          tmpData = this.changeTempC(stSetInfo.tempRangeUpLimit, isChangeMode) * 10;
        }

        tmpBuf[tmplen + 21] |= ((((tmpData / 10) - 12) & 0x1F) << 1);

        if (0 == (tmpData % 10))	// 1℃步进
        {
          tmpBuf[tmplen + 21] |= 0 << 0;
        }
        else if (5 == (tmpData % 10)) // 0.5℃步进
        {
          tmpBuf[tmplen + 21] |= 1 << 0;
        }
        else {
          // 不支持的温度值步进;
          let errorMsg = ["unpacket  temp false!"]; // [2.13]
          return errorMsg;
        }


        // tmpBuf[tmplen + 21] |= ((stSetInfo.isUseDoubleTempCtrl & 0x01) << 6);
        // tmpBuf[tmplen + 21] |= ((stSetInfo.isOpen8DegreeHot & 0x01) << 7);

        tmpBuf[tmplen + 21] = 0;

        //more bit for addition
        tmpBuf[tmplen + 22] = (stSetInfo.CSEco << 0)

        tmpBuf[tmplen + 23] = 0x00;

        tmpBuf[tmplen + 24] = stSetInfo.order;
        let swingWindButton = wx.getStorageSync('swingWindButton')
        if (swingWindButton == '1') {
          tmpBuf[tmplen + 24] = stSetInfo.swingWindButton
          wx.setStorageSync('swingWindButton', '0')
        } else {
          tmpBuf[tmplen + 24] = stSetInfo.order;
        }
        // if (stSetInfo.swingWindButton) {
        //   tmpBuf[tmplen + 24] = stSetInfo.swingWindButton
        // } else {
        //   tmpBuf[tmplen + 24] = stSetInfo.order;
        // }
        tmpBuf[tmplen + 25] = this.crc8_854(tmpBuf.slice(10), (tmplen + 15));

        // Data Len
        tmpBuf[1] = tmplen + 26;

        tmpBuf[tmplen + 26] = this.makeSum(tmpBuf.slice(1), (tmplen + 25));

        let tmpArr = Helper.hexArrayToDecimalArray(tmpBuf);

        console.log(tmpArr);

        return tmpArr;
      }
      case CMD.CMDTYPE_SET_COOLFREE: {
        // Head
        tmpBuf[0] = 0xAA;
         // 长度
        tmpBuf[1] = 0x38;
        // 种类
        tmpBuf[2] = type;

        tmpBuf[3] = 0x00;
        tmpBuf[4] = 0x00;
        tmpBuf[5] = 0x00;
        tmpBuf[6] = 0x00;
        tmpBuf[7] = 0x00;

         // 版本号
        tmpBuf[8] = 0x02;
        tmpBuf[9] = 0x02;    

        // 消息体
        tmpBuf[10] = 0xAA;
        // 2E00FFFF20
        tmpBuf[11] = 0x2E;
        tmpBuf[12] = 0x00;
        tmpBuf[13] = 0xFF;
        tmpBuf[14] = 0xFF;
        tmpBuf[15] = 0x20;
        let tmpLength = 16;
        // 数据0
        tmpBuf[tmpLength] = ((stSetInfo.coolFreeAutoFreshAir & 0x01) << 7 )  
        | ((stSetInfo.coolFreeManualFreshAir & 0x01) << 6)
        | ((stSetInfo.strong & 0x01) << 5)
        | ((stSetInfo.coolFreeDryClean & 0x01) << 4)
        | ((stSetInfo.coolFreeNowindFeel & 0x01) << 3)
        | ((stSetInfo.coolFreeMute & 0x01) << 2)
        | ((stSetInfo.coolFreeStayClean & 0x01) << 1)
        | ((stSetInfo.runStatus & 0x01) << 0);
        
        //数据1
        tmpBuf[tmpLength+1] = ((stSetInfo.elecHeatWithT4 & 0x01) << 7 )  
        | ((stSetInfo.elecHeat & 0x01) << 6)
        | ((stSetInfo.coolFreeForceAuto & 0x01) << 5)
        | ((stSetInfo.coolFreeForceCool & 0x01) << 4)
        | ((stSetInfo.coolFreeDownLrWind & 0x01) << 3)
        | ((stSetInfo.coolFreeUpLrWind & 0x01) << 2)
        | ((stSetInfo.coolFreeRightUdWind & 0x01) << 1)
        | ((stSetInfo.coolFreeLeftUdWind & 0x01) << 0);

        //数据2
        tmpBuf[tmpLength+2] = ((stSetInfo.coolFreePowerSaving & 0x01) << 7 )  
        | ((stSetInfo.coolFreeSelfClean & 0x01) << 6)
        | ((stSetInfo.coolFreeElecCleanDust & 0x01) << 5)
        | ((stSetInfo.coolFreeSterilize & 0x01) << 4)
        | ((stSetInfo.coolFreeWindOffPeople & 0x01) << 3)
        | ((stSetInfo.coolFreeWindOnPeople & 0x01) << 2)
        | ((stSetInfo.againstCool & 0x01) << 1)
        | ((stSetInfo.coolFreeCoolWarmFeel & 0x01) << 0);

        //数据3
        tmpBuf[tmpLength+3] = ((stSetInfo.coolFreeFastCheck & 0x01) << 7)
        | ((stSetInfo.coolFreeTryRunning & 0x01) << 6)
        | ((stSetInfo.coolFreeNowindFeelMode & 0x03) << 4)
        | ((stSetInfo.coolManualClean & 0x01) << 3)
        | ((stSetInfo.coolFreeAutoClean & 0x01) << 2)
        | ((stSetInfo.coolFreeNoPeoplePowerSave & 0x01) << 1)
        | ((stSetInfo.coolFreeOneKeyOptimise & 0x01) << 0);


        //数据4
        tmpBuf[tmpLength+4] = ((stSetInfo.coolFreeOutWindStrength & 0x01) << 7 )  
        | ((stSetInfo.bodySense & 0x01) << 6)
        | ((stSetInfo.coolFreeVacuum & 0x01) << 5)
        | ((stSetInfo.coolFreeNewWindLinkSwitch & 0x01) << 4)
        | ((stSetInfo.coolFreeNewWindSwitch & 0x01) << 3)
        | ((stSetInfo.coolFreeInWindStrength & 0x01) << 2)
        | ((stSetInfo.coolFreeManualHum & 0x01) << 1)
        | ((stSetInfo.coolFreeAutoHum & 0x01) << 0);

        //数据5
        tmpBuf[tmpLength+5] = this.coolFreeModeMap(stSetInfo.mode);
        console.log(stSetInfo.mode,"stSetInfo.modestSetInfo.modestSetInfo.mode");
        //数据6
        tmpBuf[tmpLength+6] = stSetInfo.tempSet2*2+30;
        //数据7
        tmpBuf[tmpLength+7] = stSetInfo.windSpeed;
        //数据8
        tmpBuf[tmpLength+8] = 1;
        //数据9
        tmpBuf[tmpLength+9] = 0;
        //数据10
        tmpBuf[tmpLength+10] = 0;
        //数据11
        tmpBuf[tmpLength+11] = 0;
        //数据12
        tmpBuf[tmpLength+12] = 0;
        //数据13
        tmpBuf[tmpLength+13] = 1;
        //数据14
        tmpBuf[tmpLength+14] = 0;
        //数据15
        tmpBuf[tmpLength+15] = 1;
        //数据16
        tmpBuf[tmpLength+16] = 1;
        //数据17
        tmpBuf[tmpLength+17] = ((stSetInfo.coolFreeWaterOuter & 0x01) << 7 )  
        | ((stSetInfo.coolFreeWaterFuncTest & 0x01) << 6)
        | ((stSetInfo.coolFreeWaterTryRunning & 0x01) << 5)
        | ((stSetInfo.coolFreeWaterElecheat & 0x01) << 4)
        | ((stSetInfo.coolFreeWaterTW1 & 0x01) << 3)
        | ((stSetInfo.coolFreeWaterClean & 0x01) << 2)
        | ((stSetInfo.coolFreeWaterSavePower & 0x01) << 1)
        | ((stSetInfo.coolFreeWaterSwitch & 0x01) << 0);
        //数据18
        tmpBuf[tmpLength+18] = 0;
        //数据19 TODO
        tmpBuf[tmpLength+19] = stSetInfo.coolFreeWaterTempSet*2+50;
        // tmpBuf[tmpLength+19] = 0xAA;
        //数据20
        tmpBuf[tmpLength+20] = 0;
        // tmpBuf[tmpLength+20] = ((stSetInfo.coolFreeHasWaterModule & 0x01) << 6)
        // | ((stSetInfo.coolFreeHasAddHum & 0x01) << 5)
        // | ((stSetInfo.coolFreeHasFreshAir & 0x01) << 4)
        // | ((stSetInfo.coolFreeHasNowindFeel & 0x01) << 3)
        // | ((stSetInfo.coolFreeHasLeftRightWind & 0x01) << 2)
        // | ((stSetInfo.coolFreeConnectOutWindPanel & 0x01) << 1)
        // | ((stSetInfo.coolFreeConnectBackWindPanel & 0x01) << 0);
        //数据21 TODO 这个有问题
        tmpBuf[tmpLength+21] = stSetInfo.tempSet2*2+30; 
        // tmpBuf[tmpLength+21] = 0x3E;
        //数据22
        tmpBuf[tmpLength+22] = 1;
        //数据23
        tmpBuf[tmpLength+23] = 1;
        //数据24
        tmpBuf[tmpLength+24] = 0;
        //数据25     
        console.log('数据25',stSetInfo.coolFreeCosySleep,stSetInfo.coolFreeStopWarm,stSetInfo.coolFreeTimingUsable,stSetInfo.timingOffSwitch);
        tmpBuf[tmpLength+25] = 
        ((stSetInfo.coolFreeSuperCooling & 0x01) << 7)
        | ((stSetInfo.coolFreeECO & 0x01) << 6)
        | ((stSetInfo.coolFreeCosySleep & 0x03) << 4)
        | ((stSetInfo.coolFreeStopWarm & 0x01) << 3)
        | ((stSetInfo.coolFreeTimingUsable & 0x01) << 2)
        | ((stSetInfo.timingOffSwitch & 0x01) << 1)
        | ((stSetInfo.timingOnSwitch & 0x01));   

        //数据26
        tmpBuf[tmpLength+26] = stSetInfo.timingOnValue&0xff // 开机时间
        tmpBuf[tmpLength+27] = stSetInfo.timingOffValue&0xff // 关机时间
        tmpBuf[tmpLength+28] = ((stSetInfo.timingOffValue& 0xf00)>>4) | ((stSetInfo.timingOnValue& 0xf00)>>8) // 开机时间

        //数据29
        tmpBuf[tmpLength+29] = ((stSetInfo.coolFreeLeftRightDirect & 0xf0) << 4)
        | ((stSetInfo.coolFreeUpdownDirect & 0x0f) << 0)
        
        //数据30
        tmpBuf[tmpLength+30] = 0;
        //数据31
        tmpBuf[tmpLength+31] = 0;
        //数据32
        tmpBuf[tmpLength+32] = 0;
        //数据33
        tmpBuf[tmpLength+33] = 0;
        //数据34
        tmpBuf[tmpLength+34] = 0;
        //数据35
        tmpBuf[tmpLength+35] = 0;
        //数据36
        tmpBuf[tmpLength+36] = 0;
        //数据37
        tmpBuf[tmpLength+37] = 0;

        // tmpBuf = [0xAA,0x38,0xAC,0x00,0x00,0x00,0x00,0x00,0x02,0x02,0xAA,0x2E,0x00,0xFF,0xFF,0x20,0x01,0x40,0x00,0x00,0x00,0x02,0x52,0x66,0x32,0x00,0x00,0x00,0x00,0x32,0x00,0x01,0x28,0x00,0x00,0x64,0x00,0x52,0x32,0x66,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x08,0x00, (消息体的crc8 0xAF), (消息体的校验和 0x7D)，（总数据除第一位的校验和 0x18）]; // 调试数据

        // tmpBuf = [0xAA,0x38,0xAC,0x00,0x00,0x00,0x00,0x00,0x02,0x02,0xAA,0x2E,0x00,0xFF,0xFF,0x20,0x00,0x00,0x00,0x00,0x00,0x01,0x52,0x66,0x01,0x00,0x00,0x00,0x00,0x01,0x00,0x01,0x01,0x00,0x00,0xAA,0x00,0x3E,0x01,0x01,0x00,0x04,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x08,0x00]; //最后三位0xBE,0x99,0x18

        tmpBuf[tmpLength + 38] = this.crc8_854(tmpBuf.slice(10), tmpLength + 38 - 10);

        tmpBuf[tmpLength + 39] = this.makeSum(tmpBuf.slice(10), tmpLength + 38 - 9);

        tmpBuf[tmpLength + 40] = this.makeSum(tmpBuf.slice(1), tmpLength + 39);

        console.log('看校验和算的对不对',tmpBuf);
        let tmpArr = Helper.hexArrayToDecimalArray(tmpBuf);
        console.log(tmpArr);
        return tmpArr;
      }
        break;
      
        default:
        break;

    }
    let errorMsg = ["make packet false! CMDTYPE_SET_COOLFREE"]; // [2.13]
    return errorMsg;
  }

  /*
   * 新协议多值查询与设置
   * 集合属性查询
   * 集合属性设置
   * params --> setting --> {key:value}
   * 设置参数
   * setting = {
   INITCOLDHOTSTATUS: [0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff],
   CONTROLNEWVERBEEP: [0x01]
   };
   * 查询参数
   * setting = {
   INITCOLDHOTSTATUS: "",
   CONTROLNEWVERBEEP: ""
   };
   * */
  compositeNewProtocolPkg_Group(cmdType, setting, deviceType, cmdOrder) {
    /*****字典属性排序*****/
    let attrKeysOrder = [];
    let attrKeys = [];
    for (let key in setting) {
      attrKeys.push(key);
    }
    cmdOrder.map((item)=>{
      attrKeysOrder.push(parseInt(item));
    });
    attrKeys.map((item)=>{
      if(!Helper.inArray(attrKeysOrder, item)) {
        attrKeysOrder.push(parseInt(item));
      }
    });
    /*****字典结构预处理*****/
    let attrSet = [];
    let valueSet = [];
    let loopIndex = 0;
    // for (let key in setting) {
    for (let key in attrKeysOrder) {
      if (cmdType == CMD.QUERYSTATUS) {
        attrSet[loopIndex] = parseInt(attrKeysOrder[key]);
        attrSet[loopIndex] = parseInt(setting[attrKeysOrder[key]]);
        // valueSet[loopIndex] = setting[attrKeysOrder[key]];
      } else {
        attrSet[loopIndex] = parseInt(attrKeysOrder[key]);
        valueSet[loopIndex] = setting[attrKeysOrder[key]];
      }
      loopIndex++;
    }
    /*****协议组码*****/
    let tmpBuf = [];
    // Head
    tmpBuf[0] = 0xAA;
    tmpBuf[1] = 12;
    // Dev Type
    tmpBuf[2] = deviceType;
    // 6 bytes ID
    tmpBuf[3] = 0x00;
    tmpBuf[4] = 0x00;
    tmpBuf[5] = 0x00;
    tmpBuf[6] = 0x00;
    tmpBuf[7] = 0x00;
    tmpBuf[8] = 0x02;    
    // msg type
    if (cmdType == CMD.SETSTATUS) {
      tmpBuf[9] = 0x02;       //设置命令
      tmpBuf[10] = 0xb0;      //设置命令
    } else {
      tmpBuf[9] = 0x03;       //查询命令
      tmpBuf[10] = 0xb1;      //查询命令
    }

    //属性个数
    tmpBuf[11] = attrSet.length;
    
    // console.log(attrSet,'attrSet',attrKeysOrder,'attrKeysOrder',setting,'setting');
    for (let si = 0; si < attrSet.length; si++) {
      tmpBuf.push(attrSet[si] & 0x00ff);

      tmpBuf.push((attrSet[si] & 0xff00) >> 8);

      if (cmdType == CMD.SETSTATUS) {
        tmpBuf.push(valueSet[si].length);
        tmpBuf = tmpBuf.concat(valueSet[si]);
      }
    }

    

    tmpBuf.push(this.crc8_854(tmpBuf.slice(10), tmpBuf.length - 10));
    tmpBuf[1] = tmpBuf.length;
    tmpBuf.push(this.makeSum(tmpBuf.slice(1), tmpBuf[1] - 1));

    let tmpArr = Helper.hexArrayToDecimalArray(tmpBuf);

    //output
    console.log("new protocol+++++", tmpArr, attrSet, valueSet, setting);

    return tmpArr;
  }

  /*
   * 新协议单值查询与设置
   * 单值属性查询
   * 单值属性设置
   * */
  compositeNewProtocolPkg_Single(cmd, cmdType, controlMsg, deviceType, controlLen) {
    let tmpBuf = [];

    // Head
    tmpBuf[0] = 0xAA;
    tmpBuf[1] = 12;
    // Dev Type
    tmpBuf[2] = deviceType;
    // 6 bytes ID
    tmpBuf[3] = 0x00;
    tmpBuf[4] = 0x00;
    tmpBuf[5] = 0x00;
    tmpBuf[6] = 0x00;
    tmpBuf[7] = 0x00;
    tmpBuf[8] = 0x02;

    // msg type
    if (cmdType == 0) {
      tmpBuf[9] = 0x02;       //设置命令
      tmpBuf[10] = 0xb0;      //设置命令
    } else {
      tmpBuf[9] = 0x03;       //查询命令
      tmpBuf[10] = 0xb1;      //查询命令
    }

    //属性个数
    tmpBuf[11] = 1;
    tmpBuf[12] = cmd & 0x00ff;
    tmpBuf[13] = (cmd & 0xff00) >> 8;

    //设置命令
    if (cmdType == 0) {
      tmpBuf.push(controlLen); //属性值长度
      for (let si = 0; si < controlLen; si++) {
        tmpBuf.push(controlMsg[si]);
      }
    }

    tmpBuf.push(this.crc8_854(tmpBuf[10], tmpBuf.length - 10));
    tmpBuf[1] = tmpBuf.length;
    tmpBuf[tmpValue] = this.makeSum(tmpBuf[1], tmpBuf[1] - 1);

    let tmpArr = Helper.hexArrayToDecimalArray(tmpBuf);
    console.log(tmpArr);

    return tmpArr;
  }

  //pragma 新协议+经典协议解包函数
  // 解析函数,将接收到的数据进行解释，获得空调状态数据
  //*srcBuf:待解释数据（组）,即家电私有协议中的数据
  unPackForClassical(_srcBuf_) {
    let srcBuf = Helper.decimalArrayToHexArray(_srcBuf_);
    let msgType = "";

    console.log("<----------unPackForClassical------>", srcBuf, Helper.decimalArrayToHexStrArray(srcBuf));

    // srcBuf.forEach(element => {
    //   console.log(element,'guess what')
    // });
    if (0xAA != srcBuf[0]) // head
    {
      msgType = STATUS.CMDTYPE_INVALID_CMD;
      return -2;
    }

    let datLen = srcBuf[1] + 1;

    //unsigned char crcRet= crc8_854(&srcBuf[10],srcBuf[1]-10);
    //if(crcRet!= 0)
    //{
    //  *msgType = CMDTYPE_INVALID_CMD;
    //  return -5;
    //}

    let ckSum = this.makeSum(srcBuf.slice(1), datLen - 1);
    if (0 != ckSum) {
      msgType = STATUS.CMDTYPE_INVALID_CMD;
      return -4;
    }

    let typeMsg = srcBuf[9];
    let msgcmd = srcBuf[10];
    let tmpCmdValue;
    let tmpCount;
    console.log(msgcmd,"unpack msgcmd");
    // 控制or查询返回
    if (0xC0 == msgcmd) {
      let info = srcBuf.slice(10);
      let tmp = Helper.clone(STATUS.standardProtocolStatusSet);

      tmp.faultFlag = (info[1] & 0x80) ? 1 : 0;
      tmp.runStatus = (info[1] & 0x01) ? 1 : 0;
      tmp.timingType = (info[1] & 0x10) ? 1 : 0;
      tmp.iMode = (info[1] & 0x04) ? 1 : 0;
      tmp.quickChkSts = (info[1] & 0x20) ? 1 : 0;

      tmp.mode = (info[2] & 0xE0) >> 5;
      tmp.tempSet = (info[2] & 0x0F) + 16;

      if (info[2] & 0x10) {
        tmp.tempSet += 0.5;
      }

      // MODI - 2014.10.10 {
      let tempModeSwitch = (info[10] & 0x04) ? 1 : 0;
      if (tempModeSwitch) {
        //华氏温度处理
        tmp.tempSet = this.changeTempF(tmp.tempSet);
      }
      //console.log("tmp.tempSet", tmp.tempSet);

      // 返回温度值范围检查
      tmp.tempSet = this.TempValCheck(tempModeSwitch, tmp.tempSet);

      tmp.windSpeed = info[3];

      tmp.timingOnSwitch = (info[4] & 0x80) ? 1 : 0;//定时开机
      tmp.timingOffSwitch = (info[5] & 0x80) ? 1 : 0;//定时开机

      if (1 == tmp.timingType) {
        if (1 == tmp.timingOnSwitch) {
          tmp.timingOnHour = ((info[4] & 0x7F) >> 2) & 0x1F;//绝对定时 小时
          tmp.timingOnMinute = (((info[4] & 0x7F) & 0x03)) * 15 + ((info[6] & 0xF0));//绝对定时 分
        }

        if (1 == tmp.timingOffSwitch) {
          tmp.timingOffHour = ((info[5] & 0x7F) >> 2) & 0x1F;//绝对定时 小时
          tmp.timingOffMinute = (((info[5] & 0x7F) & 0x03)) * 15 + ((info[6] & 0x0F));//绝对定时 分
        }
      }
      // 相对时间
      else {
        if ((1 == tmp.timingOnSwitch) && (0x7F != (info[4] & 0x7F))) {
          tmp.timingOnHour = ((((info[4] & 0x7F) + 1) * 15) - ((info[6] >> 4) & 0x0F)) / 60;
          tmp.timingOnMinute = ((((info[4] & 0x7F) + 1) * 15) - ((info[6] >> 4) & 0x0F)) % 60;
        }

        if ((1 == tmp.timingOffSwitch) && (0x7F != (info[5] & 0x7F))) {
          tmp.timingOffHour = ((((info[5] & 0x7F) + 1) * 15) - (info[6] & 0x0F)) / 60;
          tmp.timingOffMinute = ((((info[5] & 0x7F) + 1) * 15) - (info[6] & 0x0F)) % 60;
        }
      }

      if (0x10 > info[7]) {
        tmp.cosyWind = 0;
        tmp.leftLeftRightWind = 0;
        tmp.rightLeftRightWind = 0;
        tmp.leftUpDownWind = 0;
        tmp.rightUpDownWind = 0;        
      }
      else if (0x20 > info[7]) {
        tmp.cosyWind = info[7] - 16;//舒适风
      }
      else if (0x30 > info[7]) {
        tmp.cosyWind = info[7] - 22;//舒适风
      }
      else if (0x30 == (info[7] & 0xf0)) {
        tmp.leftLeftRightWind = info[7] & 0x02 ? 1 : 0;
        tmp.rightLeftRightWind = info[7] & 0x01 ? 1 : 0;
        tmp.leftUpDownWind = info[7] & 0x08 ? 1 : 0;
        tmp.rightUpDownWind = info[7] & 0x04 ? 1 : 0;        
        //tmp.upWind_1 = info[7] & 0x01 ? 1:0;
        //tmp.upWind_1 = info[7] & 0x02 ? 1:0;
      }
      else{
        tmp.leftLeftRightWind = 0;
        tmp.rightLeftRightWind = 0;
        tmp.leftUpDownWind = 0;
        tmp.rightUpDownWind = 0;         
      }

      tmp.cosySleepMode = info[8] & 0x03;//舒睡模式
      tmp.powerSave = (info[8] & 0x08) ? 1 : 0;
      tmp.farceWind = (info[8] & 0x10) ? 1 : 0;
      tmp.strong = (info[8] & 0x20) ? 1 : 0;
      tmp.bodySense = (info[8] & 0x80) ? 1 : 0;

      tmp.childSleepMode = (info[9] & 0x01) ? 1 : 0;
      tmp.naturalWind = (info[9] & 0x02) ? 1 : 0;
      tmp.diyFunc = (info[9] & 0x04) ? 1 : 0;
      tmp.elecHeat = (info[9] & 0x08) ? 1 : 0;
      tmp.ecoFunc = (info[9] & 0x10) ? 1 : 0;
      tmp.CSEco = (info[22] & 0x01) ? 1 : 0;
      tmp.cleanUpFunc = (info[9] & 0x20) ? 1 : 0;
      tmp.cosySleepSwitch = (info[9] & 0x40) ? 1 : 0;
      tmp.localBodySense = (info[9] & 0x80) ? 1 : 0;
      tmp.downSwipeWindFunc = (info[19] & 0x80) ? 1 : 0;
      tmp.downWind = (info[20] & 0x80) ? 1 : 0;
      tmp.sleepFuncState = (info[10] & 0x01) ? 1 : 0;//SLEEP功能
      tmp.tubroFuncState = (info[10] & 0x02) ? 1 : 0;//tubro功能
      tmp.tempModeSwitch = (info[10] & 0x04) ? 1 : 0;//温度单位
      tmp.chgOfAir = (info[10] & 0x08) ? 1 : 0;//换气
      tmp.nightLight = (info[10] & 0x010) ? 1 : 0;//小夜灯
      tmp.againstCool = (info[10] & 0x20) ? 1 : 0;//防着凉
      tmp.pmv = (info[10] & 0x40) ? 1 : 0;//PMV
      tmp.coolWindMode = (info[10] & 0x80) ? 1 : 0;//S凉风

      tmp.tempIn = (parseFloat(info[11]) - 50) / 2;//室内温度
      tmp.tempOut = (parseFloat(info[12]) - 50) / 2;//室外温度

      tmp.tankFull = info[16] == 38; //水满故障

      // 更新：按1.0.9版本协议，室内外温度需分别加上BYTE15对应的温度值
      tmp.tempIn += ((info[15] >> 0) & 0x0F) * 0.1;
      tmp.tempOut += ((info[15] >> 4) & 0x0F) * 0.1;

      tmp.tempSet2 = (info[13] & 0x1f) + 12;//设定2
      tmp.dustFlow = (info[13] & 0x20) ? 1 : 0;

      if (info[2] & 0x10) {
        tmp.tempSet2 += 0.5;
      }

      if (tempModeSwitch) {
        //华氏温度处理
        tmp.tempSet2 = this.changeTempF(tmp.tempSet2);
      }

      tmp.screenShow = (info[14]&0x70)>>4;
      tmp.pmv = info[14] & 0x0F;

      tmp.errCode = info[16];

      tmp.cosySleepSecond = (info[17] >> 2) & 0x3F;//舒睡运行时间 秒
      tmp.cosySleepMinute = ((info[17] & 0x03) << 4) | (info[18] >> 4);//舒睡运行时间 分
      tmp.cosySleepHour = info[18] & 0x0F;//舒睡运行时间 时

      tmp.humidity = (info[19] & 0x7F);

      tmp.upWind = (info[19] & 0x80) >> 7;
      if (tmp.upWind > 0) {
        tmp.upWind_1 = info[7] & 0x01 ? 1 : 0;
        tmp.upWind_2 = info[7] & 0x02 ? 1 : 0;
      }

      tmp.downWind = (info[20] & 0x80) >> 7;

      tmp.tempRangeUpLimit = (((info[21] >> 1) & 0x1f) + 12) + ((info[21] & 0x01) * 0.5);
      tmp.isUseDoubleTempCtrl = (info[21] >> 6) & 0x01;
      tmp.isOpen8DegreeHot = (info[21] >> 7) & 0x01;

      //旧协议无风感返回
      tmp.controlSwitchNoWindFeelOld = (info[22] >> 3) & 0x01;

      console.log(info.length,"info length");
      
      if(info[info.length-4] == 0x01) {
          tmp.checkCode = 'nA';
      } else if(info[info.length-4] == 0x00){
          tmp.checkCode = '--';
      } else {        
        tmp.checkCode = info[info.length-4] == 0xff ? Common.ab2hex([parseInt(info[info.length-5])]) : "--";
      }
      

      // 检查摄氏温度范围 17~30
      tmp.tempRangeUpLimit = this.TempValCheck(0, tmp.tempRangeUpLimit);

      if (tmp.tempModeSwitch) {
        // 华氏温度处理
        tmp.tempRangeUpLimit = this.changeTempF(tmp.tempRangeUpLimit);
      }

      // 返回温度值范围检查
      tmp.tempRangeUpLimit = this.TempValCheck(tmp.tempModeSwitch, tmp.tempRangeUpLimit);

      this.acceptingState = Helper.clone(tmp);

      //设置状态与接收状态同步
      this.stateSynchronizationForClassic(false);
    }

    //老协议解析
    // 第0组参数
    else if (0xC1 == msgcmd && 3 == typeMsg && 0 == (srcBuf[13] & 0x0f) && this.isStandardDevice) {
      let stParam0InfoRes = Helper.clone(STATUS.stQueryTimeParamAck_Ex_t);
      let info = srcBuf.slice(10, 20);

      stParam0InfoRes.powerOnDay = ((info[4] << 8) & 0xFF00) | (info[5] & 0x00FF);
      stParam0InfoRes.powerOnHour = info[6];
      stParam0InfoRes.powerOnMin = info[7];
      stParam0InfoRes.powerOnSec = info[8];

      stParam0InfoRes.totalWorkedDay = ((info[9] << 8) & 0xFF00) | (info[10] & 0x00FF);
      stParam0InfoRes.totalWorkedHour = info[11];
      stParam0InfoRes.totalWorkedMin = info[12];
      stParam0InfoRes.totalWorkedSec = info[13];

      stParam0InfoRes.curWorkedDay = ((info[14] << 8) & 0xFF00) | (info[15] & 0x00FF);
      stParam0InfoRes.curWorkedHour = info[16];
      stParam0InfoRes.curWorkedMin = info[17];
      stParam0InfoRes.curWorkedSec = info[18];

      //memcpy(dstBuf, &stParam0InfoRes,sizeof(stParam0InfoRes));
    }

    // 第1组参数
    else if (0xC1 == msgcmd && 3 == typeMsg && 1 == (srcBuf[13] & 0x0f) && this.isStandardDevice) {
      let info = srcBuf.slice(10, 20);
      let tmp = Helper.clone(STATUS.stQueryBaseRunInfoAck_Ex_t);

      tmp.yaJiShiJiPinLv = info[4];
      tmp.shiNeiMuBiaoPinLv = info[5];
      tmp.yaSuoJiDianLiu = info[6];
      tmp.shiWaiJiZongDianLiu = info[7] * 4;
      tmp.shiWaiJiDianYa = info[8];
      tmp.shiNeiJiYunZhuanMoshi = info[9];

      if (info[10] >= 30) {
        tmp.t1Temp = (info[10] - 30) / 2;
      }
      else {
        tmp.t1Temp = (30 - info[10]) / 2;
      }

      if (info[11] >= 30) {
        tmp.t2Temp = (info[11] - 30) / 2;
      }
      else {
        tmp.t2Temp = (30 - info[11]) / 2;
      }

      if (info[12] >= 50) {
        tmp.t3Temp = (info[12] - 50) / 2;
      }
      else {
        tmp.t3Temp = (50 - info[12]) / 2;
      }

      if (info[13] >= 50) {
        tmp.t4Temp = (info[13] - 50) / 2;
      }
      else {
        tmp.t4Temp = (50 - info[13]) / 2;
      }

      tmp.tpTemp = ucPQTempTab[info[14]];
      tmp.shiWaiFengJiCiTong = info[15];
      tmp.shiWaiJiDianYa = info[16];
      tmp.shiNeiFengJiCiTong = info[17];

      //memcpy(dstBuf, &tmp, sizeof(tmp));
    }

    // 第2组参数
    else if (0xC1 == msgcmd && 3 == typeMsg && 2 == (srcBuf[13] & 0x0f) && this.isStandardDevice) {
      let info = srcBuf.slice(10, 20);
      let tmp = Helper.clone(STATUS.stQueryIndoorDevAck_Ex_t);

      tmp.setRoomIWindSpeed = info[4] * 8;
      tmp.roomIFengjiSpeed = info[5] * 8;
      tmp.roomIFaultState1_0 = (info[6] >> 0) & 0x01;
      tmp.roomIFaultState1_1 = (info[6] >> 1) & 0x01;
      tmp.roomIFaultState1_2 = (info[6] >> 2) & 0x01;
      tmp.roomIFaultState1_3 = (info[6] >> 3) & 0x01;
      tmp.roomIFaultState1_4 = (info[6] >> 4) & 0x01;
      tmp.roomIFaultState1_5 = (info[6] >> 5) & 0x01;
      tmp.roomIFaultState1_6 = (info[6] >> 6) & 0x01;
      tmp.roomIFaultState1_7 = (info[6] >> 7) & 0x01;
      tmp.roomIFaultState2_0 = (info[7] >> 0) & 0x01;
      tmp.roomIFaultState2_1 = (info[7] >> 1) & 0x01;
      tmp.roomIFaultState2_2 = (info[7] >> 2) & 0x01;
      tmp.roomIFaultState2_3 = (info[7] >> 3) & 0x01;
      tmp.roomIFaultState2_4 = (info[7] >> 4) & 0x01;
      tmp.roomIFaultState2_5 = (info[7] >> 5) & 0x01;
      tmp.roomIFaultState2_6 = (info[7] >> 6) & 0x01;
      tmp.roomIFaultState2_7 = (info[7] >> 7) & 0x01;
      tmp.roomIFaultState3_0 = (info[8] >> 0) & 0x01;
      tmp.roomIFaultState3_1 = (info[8] >> 1) & 0x01;
      tmp.roomIFaultState3_2 = (info[8] >> 2) & 0x01;
      tmp.roomIFaultState3_3 = (info[8] >> 3) & 0x01;
      tmp.roomIFaultState3_4 = (info[8] >> 4) & 0x01;
      tmp.roomIFaultState3_5 = (info[8] >> 5) & 0x01;
      tmp.roomIFaultState3_6 = (info[8] >> 6) & 0x01;
      tmp.roomIFaultState3_7 = (info[8] >> 7) & 0x01;
      tmp.roomILimitFreqState1_0 = (info[9] >> 0) & 0x01;
      tmp.roomILimitFreqState1_1 = (info[9] >> 1) & 0x01;
      tmp.roomILimitFreqState1_2 = (info[9] >> 2) & 0x01;
      tmp.roomILimitFreqState1_3 = (info[9] >> 3) & 0x01;
      tmp.roomILimitFreqState1_4 = (info[9] >> 4) & 0x01;
      tmp.roomILimitFreqState1_5 = (info[9] >> 5) & 0x01;
      tmp.roomILimitFreqState1_6 = (info[9] >> 6) & 0x01;
      tmp.roomILimitFreqState1_7 = (info[9] >> 7) & 0x01;
      tmp.roomILimitFreqState2_0 = (info[10] >> 0) & 0x01;
      tmp.roomILimitFreqState2_1 = (info[10] >> 1) & 0x01;
      tmp.roomILimitFreqState2_2 = (info[10] >> 2) & 0x01;
      tmp.roomILimitFreqState2_3 = (info[10] >> 3) & 0x01;
      tmp.roomILimitFreqState2_4 = (info[10] >> 4) & 0x01;
      tmp.roomILimitFreqState2_5 = (info[10] >> 5) & 0x01;
      tmp.roomILimitFreqState2_6 = (info[10] >> 6) & 0x01;
      tmp.roomILimitFreqState2_7 = (info[10] >> 7) & 0x01;
      tmp.roomILimitFreqState3_0 = (info[11] >> 0) & 0x01;
      tmp.roomILimitFreqState3_1 = (info[11] >> 1) & 0x01;
      tmp.roomILimitFreqState3_2 = (info[11] >> 2) & 0x01;
      tmp.roomILimitFreqState3_3 = (info[11] >> 3) & 0x01;
      tmp.roomILimitFreqState3_4 = (info[11] >> 4) & 0x01;
      tmp.roomILimitFreqState3_5 = (info[11] >> 5) & 0x01;
      tmp.roomILimitFreqState3_6 = (info[11] >> 6) & 0x01;
      tmp.roomILimitFreqState3_7 = (info[11] >> 7) & 0x01;
      tmp.roomILoadState1_0 = (info[12] >> 0) & 0x01;
      tmp.roomILoadState1_1 = (info[12] >> 1) & 0x01;
      tmp.roomILoadState1_2 = (info[12] >> 2) & 0x01;
      tmp.roomILoadState1_3 = (info[12] >> 3) & 0x01;
      tmp.roomILoadState1_4 = (info[12] >> 4) & 0x01;
      tmp.roomILoadState1_5 = (info[12] >> 5) & 0x01;
      tmp.roomILoadState1_6 = (info[12] >> 6) & 0x01;
      tmp.roomILoadState1_7 = (info[12] >> 7) & 0x01;
      tmp.roomILoadState2_0 = (info[13] >> 0) & 0x01;
      tmp.roomILoadState2_1 = (info[13] >> 1) & 0x01;
      tmp.roomILoadState2_2 = (info[13] >> 2) & 0x01;
      tmp.roomILoadState2_3 = (info[13] >> 3) & 0x01;
      tmp.roomILoadState2_4 = (info[13] >> 4) & 0x01;
      tmp.roomILoadState2_5 = (info[13] >> 5) & 0x01;
      tmp.roomILoadState2_6 = (info[13] >> 6) & 0x01;
      tmp.roomILoadState2_7 = (info[13] >> 7) & 0x01;
      tmp.roomIE2paramVer = info[14];
      tmp.childState = info[15];
      tmp.childNum = info[16];
      tmp.childAngle1 = info[17];
      tmp.childAngle2 = info[18];
      tmp.childDistance1 = info[19];
      tmp.childDistance2 = 0x00;

      //memcpy(dstBuf, &tmp, sizeof(tmp));
    }

    // 第3组参数
    else if (0xC1 == msgcmd && 3 == typeMsg && 3 == (srcBuf[13] & 0x0f) && this.isStandardDevice) {
      let info = srcBuf.slice(10, 20);
      let tmp = Helper.clone(STATUS.stQueryOutdoorDevAck_Ex_t);

      tmp.outDoorDevState1_0 = (info[4] >> 0) & 0x01;
      tmp.outDoorDevState1_1 = (info[4] >> 1) & 0x01;
      tmp.outDoorDevState1_2 = (info[4] >> 2) & 0x01;
      tmp.outDoorDevState1_3 = (info[4] >> 3) & 0x01;
      tmp.outDoorDevState1_4 = (info[4] >> 4) & 0x01;
      tmp.outDoorDevState1_5 = (info[4] >> 5) & 0x01;
      tmp.outDoorDevState1_6 = (info[4] >> 6) & 0x01;
      tmp.outDoorDevState1_7 = (info[4] >> 7) & 0x01;
      tmp.outDoorDevState2_0 = (info[5] >> 0) & 0x01;
      tmp.outDoorDevState2_1 = (info[5] >> 1) & 0x01;
      tmp.outDoorDevState2_2 = (info[5] >> 2) & 0x01;
      tmp.outDoorDevState2_3 = (info[5] >> 3) & 0x01;
      tmp.outDoorDevState2_4 = (info[5] >> 4) & 0x01;
      tmp.outDoorDevState2_5 = (info[5] >> 5) & 0x01;
      tmp.outDoorDevState2_6 = (info[5] >> 6) & 0x01;
      tmp.outDoorDevState2_7 = (info[5] >> 7) & 0x01;
      tmp.outDoorDevState3_0 = (info[6] >> 0) & 0x01;
      tmp.outDoorDevState3_1 = (info[6] >> 1) & 0x01;
      tmp.outDoorDevState3_2 = (info[6] >> 2) & 0x01;
      tmp.outDoorDevState3_3 = (info[6] >> 3) & 0x01;
      tmp.outDoorDevState3_4 = (info[6] >> 4) & 0x01;
      tmp.outDoorDevState3_5 = (info[6] >> 5) & 0x01;
      tmp.outDoorDevState3_6 = (info[6] >> 6) & 0x01;
      tmp.outDoorDevState3_7 = (info[6] >> 7) & 0x01;
      tmp.outDoorDevState4_0 = (info[7] >> 0) & 0x01;
      tmp.outDoorDevState4_1 = (info[7] >> 1) & 0x01;
      tmp.outDoorDevState4_2 = (info[7] >> 2) & 0x01;
      tmp.outDoorDevState4_3 = (info[7] >> 3) & 0x01;
      tmp.outDoorDevState4_4 = (info[7] >> 4) & 0x01;
      tmp.outDoorDevState4_5 = (info[7] >> 5) & 0x01;
      tmp.outDoorDevState4_6 = (info[7] >> 6) & 0x01;
      tmp.outDoorDevState4_7 = (info[7] >> 7) & 0x01;
      tmp.outDoorDevState5_0 = (info[8] >> 0) & 0x01;
      tmp.outDoorDevState5_1 = (info[8] >> 1) & 0x01;
      tmp.outDoorDevState5_2 = (info[8] >> 2) & 0x01;
      tmp.outDoorDevState5_3 = (info[8] >> 3) & 0x01;
      tmp.outDoorDevState5_4 = (info[8] >> 4) & 0x01;
      tmp.outDoorDevState5_5 = (info[8] >> 5) & 0x01;
      tmp.outDoorDevState5_6 = (info[8] >> 6) & 0x01;
      tmp.outDoorDevState5_7 = (info[8] >> 7) & 0x01;
      tmp.outDoorDevState6_0 = (info[9] >> 0) & 0x01;
      tmp.outDoorDevState6_1 = (info[9] >> 1) & 0x01;
      tmp.outDoorDevState6_2 = (info[9] >> 2) & 0x01;
      tmp.outDoorDevState6_3 = (info[9] >> 3) & 0x01;
      tmp.outDoorDevState6_4 = (info[9] >> 4) & 0x01;
      tmp.outDoorDevState6_5 = (info[9] >> 5) & 0x01;
      tmp.outDoorDevState6_6 = (info[9] >> 6) & 0x01;
      tmp.outDoorDevState6_7 = (info[9] >> 7) & 0x01;
      tmp.outDoorIFanSpeed = info[10] * 8;
      tmp.outDoorEleSwitch = info[11] * 8;
      tmp.outDoorBackTemp = info[12];
      tmp.outDoorVoltage = info[13];
      tmp.ipmTemp = info[14];
      tmp.outDoorLoadState = info[15];
      tmp.outDoorDestFreq = info[16];

      //memcpy(dstBuf, &tmp, sizeof(tmp));
    }

    // 第4组参数
    else if (0xC1 == msgcmd && 3 == typeMsg && 4 == (srcBuf[13] & 0x0f) && this.isStandardDevice) {
      let info = srcBuf.slice(10, 20);
      let stPowerInfo = Helper.clone(STATUS.stQueryPowerInfoRes_Ex_t);

      stPowerInfo.totalPowerConsume = BCDToInt(info[4]) * 10000 + BCDToInt(info[5]) * 100 + BCDToInt(info[6]) + BCDToInt(info[7]) * 1.0 / 100;
      stPowerInfo.totalRunPower = BCDToInt(info[8]) * 10000 + BCDToInt(info[9]) * 100 + BCDToInt(info[10]) + BCDToInt(info[11]) * 1.0 / 100;
      stPowerInfo.curRunPower = BCDToInt(info[12]) * 10000 + BCDToInt(info[13]) * 100 + BCDToInt(info[14]) + BCDToInt(info[15]) * 1.0 / 100;
      stPowerInfo.curRealTimePower = BCDToInt(info[16]) + BCDToInt(info[17]) * 1.0 / 100 + BCDToInt(info[18]) * 1.0 / 10000;

      //memcpy(dstBuf, &stPowerInfo, sizeof(stQueryPowerInfoRes_Ex_t));
    }

    // 第5组参数
    else if (0xC1 == msgcmd && 3 == typeMsg && 5 == (srcBuf[13] & 0x0f) && this.isStandardDevice) {
      let info = srcBuf.slice(10, 20);
      let tmp = Helper.clone(STATUS.stQueryParam5Res_Ex_t);

      tmp.humidity = info[4];//湿度
      tmp.checkedTempSet = info[5];	//补正后的设定温度Tsc
      tmp.indoorFanRuntime = info[6] + info[7] * 256; //内风机运行时间
      tmp.outdoorFanSpeed = info[8] * 8;//室外风机目标转速
      tmp.eleSwitchAngle = info[9] * 8;//电子膨胀阀目标角度
      tmp.defrostingStep = info[10];//化霜阶段
      tmp.outdoorDevState7 = info[11];//当前室外机状态7（预留）
      tmp.outdoorDevState8 = info[12];//当前室外机状态7（预留）
      tmp.engineCurWorkedTime = info[13] * 64;//当前压缩机运行时间
      tmp.engineTotalWorkedTime = info[14] + info[15] * 256;//压缩机累积运行时间
      tmp.limitFreqType2 = info[16];//限频类型2
      tmp.devMaxVoltage = info[17] + 60;//整机运行最大电压值
      tmp.devMinVoltage = info[18] + 60;//整机运行最小电压值

      //memcpy(dstBuf, &tmp, sizeof(stQueryParam5Res_Ex_t));
    }

    // 第6组参数
    else if (0xC1 == msgcmd && 3 == typeMsg && 6 == (srcBuf[13] & 0x0f) && this.isStandardDevice) {
      let info = srcBuf.slice(10, 20);
      let tmp = Helper.clone(STATUS.stQueryParam6Res_Ex_t);

      tmp.devMaxCurrent = info[4];//整机运行最大电流值
      tmp.devMaxTemp4 = info[5];	//整机运行最大T4温度值
      tmp.devMinTemp4 = info[6];	//整机运行最小T4温度值
      tmp.totalErrCnt = info[7];  //累计故障次数
      tmp.engineFlux = info[8] * 8;	//压缩机磁通量
      tmp.fanFlux = info[9] * 8;//风机磁通量
      tmp.dSpinCurrent = info[10] * 64;//d轴电流
      tmp.qSpinCurrent = info[11] * 64;//q轴电流
      tmp.enginePeakCurrent = info[12];//压缩机电流峰值单位6
      tmp.pfcPeakCurrent = info[13];//PFC电流峰值
      tmp.fanPeakCurrent = info[14];//风机电流峰值
      tmp.torqueAdjustAngle = info[15] + info[16] * 256;//转矩补偿角度
      tmp.torqueAdjustValue = info[17] * 8;//转矩补偿幅值
      tmp.adAdjustVoltage1 = info[18] * 16;//AD校准电压1

      //memcpy(dstBuf, &tmp, sizeof(stQueryParam6Res_Ex_t));
    }

    // 第11组参数
    else if (0xC1 == msgcmd && 3 == typeMsg && 11 == (srcBuf[13] & 0x0f) && this.isStandardDevice) {
      let info = srcBuf.slice(10, 20);
      let tmp = Helper.clone(STATUS.stQueryParam11Res_Ex_t);

      tmp.upDnDaoFengTiaoStat = (info[4] >> 0) & 0x03;
      tmp.ltRtDaoFengTiaoStat = (info[4] >> 2) & 0x03;
      tmp.TopDaoFengTiaoStat = (info[4] >> 4) & 0x03;
      tmp.upDnDaoFengTiaoCoolUpperLimit = info[5];
      tmp.upDnDaoFengTiaoCoolLowerLimit = info[6];
      tmp.upDnDaoFengTiaoHeatUpperLimit = info[7];
      tmp.upDnDaoFengTiaoHeatLowerLimit = info[8];
      tmp.upDnDaoFengTiaoCurAngle = info[9];
      tmp.ltRtDaoFengTiaoUpperLimit = info[10];
      tmp.ltRtDaoFengTiaoLowerLimit = info[11];
      tmp.ltRtDaoFengTiaoCurAngle = info[12];
      tmp.TopDaoFengTiaoUpperLimit = info[13];
      tmp.TopDaoFengTiaoLowerLimit = info[14];
      tmp.TopDaoFengTiaoCurAngle = info[15];

      //memcpy(dstBuf, &tmp, sizeof(stQueryParam11Res_Ex_t));
    }

    //JJ/JX with C1
    else if (0xC1 == msgcmd && (3 == typeMsg ||5 == typeMsg) && 0x01 == (srcBuf[11])) {
      let info = srcBuf.slice(10, 20);
      let tmp = Helper.clone(STATUS.totalStateFirstGroup_1)
      tmp.newWindFunWindMode = (srcBuf[12] & 0x80) >> 7;
      tmp.smartCleanSW = 1 + ((srcBuf[12] & 0x40) >> 6);//智清洁设定状态
      tmp.sterilizeSw = 1 + ((srcBuf[12] & 0x20) >> 5);//杀菌设定状态
      tmp.newWindFunSw = 1 + ((srcBuf[12] & 0x10) >> 4);//新风设定状态
      tmp.humFunSw = 1 + ((srcBuf[12] & 0x08) >> 3);// //加湿设定状态
      tmp.cleanFunSw = 1 + ((srcBuf[12] & 0x04) >> 2);//净化设定状态
      tmp.runStatus = 1 + ((srcBuf[12] & 0x02) >> 1);//空调设定状态
      tmp.deviceSetRunStatus = 1 + (srcBuf[12] & 0x01);//设备设定总状态
      tmp.wetfilmFunSw = 1 + ((srcBuf[13] & 0x02) >> 1); //湿膜更换提醒
      tmp.purfiyFilm = 1 + (srcBuf[13] & 0x01); //净化滤网是否脏堵
      tmp.acstrainerSw = 1 + ((srcBuf[13] & 0x20) >> 5); //空调滤网是否脏堵

      tmp.elecHeat = (srcBuf[13] & 0x10) >> 4; //电辅热
      tmp.strong = (srcBuf[13] & 0x08) >> 3; //强劲
      tmp.diyFunc = (srcBuf[13] & 0x04) >> 2; //干燥
      tmp.currentRunMode = srcBuf[16] & 0x0f;//实际运行

      tmp.runCurrentStatus = 1 + ((srcBuf[14] & 0x02) >> 1);  //空调运行状态
      tmp.deviceCurrentRunStatus = 1 + ((srcBuf[14] & 0x01));//设备运行总状态
      if((srcBuf[20]===0xff&&srcBuf[19]===0xff)||(srcBuf[20]===0x7f&&srcBuf[19]===0x7f)
        ||(srcBuf[20]===0x7f&&srcBuf[19]===0xff)||(srcBuf[20]===0xff&&srcBuf[19]===0x7f)){
      }else{
        if (srcBuf[20] >= 0x80) {
          srcBuf[20] = srcBuf[20] - 255;
          srcBuf[19] = srcBuf[19] - 255;
          tmp.t1Temp = (srcBuf[20] * 256 + srcBuf[19]) * 0.01;//T1温度
        } else {
          tmp.t1Temp = (srcBuf[20] * 256 + srcBuf[19]) * 0.01;//T1温度
        }
      }

      if (srcBuf[22] >= 0x80) {
        srcBuf[22] = srcBuf[22] - 255;
        srcBuf[21] = srcBuf[21] - 255;
        tmp.t2Temp = (srcBuf[22] * 256 + srcBuf[21]) * 0.01;//T2温度
      } else {
        tmp.t2Temp = (srcBuf[22] * 256 + srcBuf[21]) * 0.01;//T2温度
      }
      if (srcBuf[24] >= 0x80) {
        srcBuf[24] = srcBuf[24] - 255;
        srcBuf[23] = srcBuf[23] - 255;
        tmp.t3Temp = (srcBuf[24] * 256 + srcBuf[23]) * 0.01;//T3温度
      } else {
        tmp.t3Temp = (srcBuf[24] * 256 + srcBuf[23]) * 0.01;//T3温度
      }
      if((srcBuf[26]===0xff&&srcBuf[25]===0xff)||(srcBuf[26]===0x7f&&srcBuf[25]===0x7f)
        ||(srcBuf[26]===0x7f&&srcBuf[25]===0xff)||(srcBuf[26]===0xff&&srcBuf[25]===0x7f)){
      }else {
        if (srcBuf[26] >= 0x80) {
          srcBuf[26] = srcBuf[26] - 255;
          srcBuf[25] = srcBuf[25] - 255;
          tmp.t4Temp = (srcBuf[26] * 256 + srcBuf[25]) * 0.01;//T4温度
        } else {
          tmp.t4Temp = (srcBuf[26] * 256 + srcBuf[25]) * 0.01;//T4温度
        }
        tmp.t4Temp = (tmp.t4Temp).toFixed(1);
        tmp.tempOut = tmp.t4Temp; //室外温度为T4温度
      }

      tmp.tpTemp = srcBuf[27];//TP AD值

      tmp.tempIn = tmp.tpTemp;
      tmp.comRunFrequency = srcBuf[28];                  // 压缩机频率
      tmp.comTargetFrequency = srcBuf[29];               //压缩机目标频率
      tmp.yaSuoJiDianLiu = srcBuf[30] * 4;               //压缩机电流
      tmp.shiWaiJiZongDianLiu = srcBuf[31] * 4;          //室外机总电流 单位0.25A
      tmp.shiWaiJiDianYa = srcBuf[32];                   //室外机电压有效值
      tmp.shiNeiJiYunZhuanMoshi = srcBuf[33];            // 室内机运转模式
      tmp.leftWindClass = srcBuf[34];                    //室内设定风速转速(左风机)
      tmp.rightWindClass = srcBuf[35];                   //室内设定风速转速(右风机)

      tmp.roomIFaultState1_0 = (srcBuf[36] >> 0) & 0x01;// 室温环境传感器故障
      tmp.roomIFaultState1_1 = (srcBuf[36] >> 1) & 0x01;// 室内管温传感器故障
      tmp.roomIFaultState1_2 = (srcBuf[36] >> 2) & 0x01;// 室内E方故障
      tmp.roomIFaultState1_3 = (srcBuf[36] >> 3) & 0x01;// 室内直流风机失速故障
      tmp.roomIFaultState1_4 = (srcBuf[36] >> 4) & 0x01;// 室内外机通信故障
      tmp.roomIFaultState1_5 = (srcBuf[36] >> 5) & 0x01;// 智慧眼故障
      tmp.roomIFaultState1_6 = (srcBuf[36] >> 6) & 0x01;// 显示板E方故障
      tmp.roomIFaultState1_7 = (srcBuf[36] >> 7) & 0x01;// 射频模块故障


      tmp.roomIFaultState2_0 = (srcBuf[37] >> 0) & 0x01;// 新平台室内机配老平台室外机F9故障
      tmp.roomIFaultState2_1 = (srcBuf[37] >> 1) & 0x01;// 冷媒泄露故障PL
      tmp.roomIFaultState2_2 = (srcBuf[37] >> 2) & 0x01;// 灰尘传感器故障
      tmp.roomIFaultState2_3 = (srcBuf[37] >> 3) & 0x01;// 电表模块通信故障
      tmp.roomIFaultState2_4 = (srcBuf[37] >> 4) & 0x01;// 湿度传感器故障
      tmp.roomIFaultState2_5 = (srcBuf[37] >> 5) & 0x01;// 净化器风机失速E30
      tmp.roomIFaultState2_6 = (srcBuf[37] >> 6) & 0x01;// 室内过零检测故障（E2）
      tmp.roomIFaultState2_7 = (srcBuf[37] >> 7) & 0x01;// 模式冲突故障（E8）


      tmp.roomIFaultState3_0 = (srcBuf[38] >> 0) & 0x01;//开关门故障（E9）
      tmp.roomIFaultState3_1 = (srcBuf[38] >> 1) & 0x01;//防冷风保护(P9)
      tmp.roomIFaultState3_2 = (srcBuf[38] >> 2) & 0x01;//外销电压保护(P13-电压匹配错误)
      tmp.roomIFaultState3_3 = (srcBuf[38] >> 3) & 0x01;//下风机失速故障
      tmp.roomIFaultState3_4 = (srcBuf[38] >> 4) & 0x01;//PM2.5传感器故障
      tmp.roomIFaultState3_5 = (srcBuf[38] >> 5) & 0x01;//CO2传感器故障
      tmp.roomIFaultState3_6 = (srcBuf[38] >> 6) & 0x01;//上湿度传感器故障
      tmp.roomIFaultState3_7 = (srcBuf[38] >> 7) & 0x01;//新风湿度传感器故障

      tmp.roomILimitFreqState1_0 = (srcBuf[39] >> 0) & 0x01;// 蒸发器低温限频
      tmp.roomILimitFreqState1_1 = (srcBuf[39] >> 1) & 0x01;// 蒸发器低温保护
      tmp.roomILimitFreqState1_2 = (srcBuf[39] >> 2) & 0x01;// 冷凝器高温限频
      tmp.roomILimitFreqState1_3 = (srcBuf[39] >> 3) & 0x01;// 冷凝器高温保持
      tmp.roomILimitFreqState1_4 = (srcBuf[39] >> 4) & 0x01;// 冷凝器高温保护(PA)
      tmp.roomILimitFreqState1_5 = (srcBuf[39] >> 5) & 0x01;// 蒸发器高温限频
      tmp.roomILimitFreqState1_6 = (srcBuf[39] >> 6) & 0x01;// 蒸发器高温保持
      tmp.roomILimitFreqState1_7 = (srcBuf[39] >> 7) & 0x01;// 蒸发器高温保护

      tmp.roomILimitFreqState2_0 = (srcBuf[40] >> 0) & 0x01;//排气高温限频
      tmp.roomILimitFreqState2_1 = (srcBuf[40] >> 1) & 0x01;//排气高温保持
      tmp.roomILimitFreqState2_2 = (srcBuf[40] >> 2) & 0x01;// 排气高温保护
      tmp.roomILimitFreqState2_3 = (srcBuf[40] >> 3) & 0x01;// 遥控器限制最高运行频率起作用
      tmp.roomILimitFreqState2_4 = (srcBuf[40] >> 4) & 0x01;// 主控板在快检时检测E方，发现不能写入，显示板显示EE
      tmp.roomILimitFreqState2_5 = (srcBuf[40] >> 5) & 0x01;// 主控板读取E方数据时，E方硬件正常，但是数据错误，显示板显示EA
      tmp.roomILimitFreqState2_6 = (srcBuf[40] >> 6) & 0x01;// 室内外置风机电压过低保护
      tmp.roomILimitFreqState2_7 = (srcBuf[40] >> 7) & 0x01;// 室内外置风机电压过高保护

      tmp.roomILoadState1_0 = (srcBuf[42] >> 0) & 0x01;//化霜
      tmp.roomILoadState1_1 = (srcBuf[42] >> 1) & 0x01;//电辅热
      tmp.roomILoadState1_2 = (srcBuf[42] >> 2) & 0x01;//水平导风条摆风（左）
      tmp.roomILoadState1_3 = (srcBuf[42] >> 3) & 0x01;//水平导风条摆风（右）
      tmp.roomILoadState1_4 = (srcBuf[42] >> 4) & 0x01;//垂直导风条摆风（左）
      tmp.roomILoadState1_5 = (srcBuf[42] >> 5) & 0x01;//垂直导风条摆风（右）
      tmp.roomILoadState1_6 = (srcBuf[42] >> 6) & 0x01;//室内风机运行/停止
      tmp.roomILoadState1_7 = (srcBuf[42] >> 7) & 0x01;//净化负载

      tmp.tempOutValid = (srcBuf[43] >> 0) & 0x01;//室外环境温度查询使能

      tmp.outDoorDevState1_0 = (srcBuf[45] >> 0) & 0x01;//室外E方故障(E51)
      tmp.outDoorDevState1_1 = (srcBuf[45] >> 1) & 0x01;//室外T3传感器故障(E52)
      tmp.outDoorDevState1_2 = (srcBuf[45] >> 2) & 0x01;//室外T4传感器故障(E53)
      tmp.outDoorDevState1_3 = (srcBuf[45] >> 3) & 0x01;//室外排气传感器故障(E54)
      tmp.outDoorDevState1_4 = (srcBuf[45] >> 4) & 0x01;//室外回气传感器故障(E55)
      tmp.outDoorDevState1_5 = (srcBuf[45] >> 5) & 0x01;//压顶传感器温度保护(P2)
      tmp.outDoorDevState1_6 = (srcBuf[45] >> 6) & 0x01;//室外直流风机故障（内置驱动）(E7)
      tmp.outDoorDevState1_7 = (srcBuf[45] >> 7) & 0x01;//输入交流电流采样电路故障

      tmp.outDoorDevState2_0 = (srcBuf[46] >> 0) & 0x01;//主控芯片与驱动芯片通信故障
      tmp.outDoorDevState2_1 = (srcBuf[46] >> 1) & 0x01;//压机电流采样电路故障
      tmp.outDoorDevState2_2 = (srcBuf[46] >> 2) & 0x01;//压机启动故障
      tmp.outDoorDevState2_3 = (srcBuf[46] >> 3) & 0x01;//压机缺相保护
      tmp.outDoorDevState2_4 = (srcBuf[46] >> 4) & 0x01;//压机零速保护
      tmp.outDoorDevState2_5 = (srcBuf[46] >> 5) & 0x01;//室外341主芯片驱动同步故障
      tmp.outDoorDevState2_6 = (srcBuf[46] >> 6) & 0x01;//压机失速保护
      tmp.outDoorDevState2_7 = (srcBuf[46] >> 7) & 0x01;//压机锁定保护

      tmp.outDoorDevState3_0 = (srcBuf[47] >> 0) & 0x01;//压机脱调保护
      tmp.outDoorDevState3_1 = (srcBuf[47] >> 1) & 0x01;//压机过电流故障(P49)
      tmp.outDoorDevState3_2 = (srcBuf[47] >> 2) & 0x01;//室外IPM模块保护(P0)
      tmp.outDoorDevState3_3 = (srcBuf[47] >> 3) & 0x01;//电压过低保护(P10)
      tmp.outDoorDevState3_4 = (srcBuf[47] >> 4) & 0x01;//电压过高保护(P11)
      tmp.outDoorDevState3_5 = (srcBuf[47] >> 5) & 0x01;//室外直流侧电压保护(P12)
      tmp.outDoorDevState3_6 = (srcBuf[47] >> 6) & 0x01;//室外电流保护(P81)
      tmp.outDoorDevState3_7 = (srcBuf[47] >> 7) & 0x01;//压缩机低压故障

      tmp.outDoorDevState4_0 = (srcBuf[48] >> 0) & 0x01;//压机排气高温限频(L2)
      tmp.outDoorDevState4_1 = (srcBuf[48] >> 1) & 0x01;//压机排气高温保护(P6)
      tmp.outDoorDevState4_2 = (srcBuf[48] >> 2) & 0x01;//冷凝器高温限(L1)
      tmp.outDoorDevState4_3 = (srcBuf[48] >> 3) & 0x01;//冷凝器高温保护(L1)
      tmp.outDoorDevState4_4 = (srcBuf[48] >> 4) & 0x01;//系统高压(力)限频
      tmp.outDoorDevState4_5 = (srcBuf[48] >> 5) & 0x01;//系统高压(力)保护
      tmp.outDoorDevState4_6 = (srcBuf[48] >> 6) & 0x01;//系统低压(力)限频
      tmp.outDoorDevState4_7 = (srcBuf[48] >> 7) & 0x01;//系统低压(力)保护

      tmp.outDoorDevState5_0 = (srcBuf[49] >> 0) & 0x01;//电压限频
      tmp.outDoorDevState5_1 = (srcBuf[49] >> 1) & 0x01;//电流限频
      tmp.outDoorDevState5_2 = (srcBuf[49] >> 2) & 0x01;//PFC模块开关停机
      tmp.outDoorDevState5_3 = (srcBuf[49] >> 3) & 0x01;//PFC模块故障限频
      tmp.outDoorDevState5_4 = (srcBuf[49] >> 4) & 0x01;//341MCE故障
      tmp.outDoorDevState5_5 = (srcBuf[49] >> 5) & 0x01;//341同步故障
      tmp.outDoorDevState5_6 = (srcBuf[49] >> 6) & 0x01;//三相电源反相
      tmp.outDoorDevState5_7 = (srcBuf[49] >> 7) & 0x01;//三相电源缺相


      tmp.outDoorDevState6_0 = (srcBuf[50] >> 0) & 0x01;//交流风机室外低风
      tmp.outDoorDevState6_1 = (srcBuf[50] >> 1) & 0x01;//交流风机室外中风
      tmp.outDoorDevState6_2 = (srcBuf[50] >> 2) & 0x01;//交流风机室外高风
      tmp.outDoorDevState6_3 = (srcBuf[50] >> 3) & 0x01;//四通阀开关状态
      tmp.outDoorDevState6_4 = (srcBuf[50] >> 4) & 0x01;//外风机过流（外置驱动）
      tmp.outDoorDevState6_5 = (srcBuf[50] >> 5) & 0x01;//外风机失速（外置驱动）
      tmp.outDoorDevState6_6 = (srcBuf[50] >> 6) & 0x01;//外风机缺相（外置驱动）
      tmp.outDoorDevState6_7 = (srcBuf[50] >> 7) & 0x01;//外风机零速（外置驱动）

      tmp.outDoorIFanSpeed = srcBuf[51] * 8;//当前室外直流风机转速/8
      tmp.outDoorEleSwitch = srcBuf[52] * 8;//当前室外电子膨胀阀/8
      tmp.outDoorBackTemp = srcBuf[53];//室外回气温度AD值
      tmp.outDoorVoltage = srcBuf[54];//室外母线电压AD值
      tmp.ipmTemp = srcBuf[55];//IPM模块温度

      tmp.dryHeatTimeValue = srcBuf[63] + srcBuf[64] * 256;//关机后干燥清洁或吹余热的时间

      tmp.newWindFunCurrentValue = srcBuf[65] + srcBuf[66] * 256;//co2/tvoc数值
      tmp.cleanFunCurrentValue = srcBuf[67] + srcBuf[68] * 256;//灰尘浓度(PM2.5)
      tmp.humFunWindCurrentValue = srcBuf[69];//主控板湿度传感器(当前湿度)
      tmp.sterilizeRunTime = srcBuf[70] + srcBuf[71] * 256;//杀菌实际运行计时
      tmp.wetfilmTime = srcBuf[72] + srcBuf[73] * 256;//湿膜计时
      tmp.purfiyFilmTime = srcBuf[74] + srcBuf[75] * 256;//净化滤网计时
      tmp.smartCleanCurrentRunTime = tmp.controlSelfCleaningTimeValue = srcBuf[76];//自清洁实际运行时间（分钟）

      tmp.leftWindCurrentClass = srcBuf[80];////左风机实际转速档位
      tmp.rightWindCurrentClass = srcBuf[81];////右风机实际转速档位
      tmp.downWindSetClass = srcBuf[82];////下风机设定风速
      tmp.downWindCurrentClass = srcBuf[83];////下风机实际转速档位
      tmp.setHumValue = srcBuf[84];////设定湿度值

      tmp.humFunWindClass = tmp.downWindSetClass;
      tmp.cleanFunWindClass = tmp.downWindSetClass;
      tmp.newWindFunClass = tmp.downWindSetClass;
      tmp.sterilizeWindClass = tmp.downWindSetClass;

      tmp.productCode = srcBuf[85] + srcBuf[86] * 256;//防抽卡

      tmp.errCode = srcBuf[87]; //故障类型
      tmp.inDisplayTransport = (srcBuf[88] >> 0) & 0x01;//室内板与显示板通信故障(Eb)
      tmp.compressorPosProtect = (srcBuf[88] >> 1) & 0x01;//压缩机位置保护(P4)
      tmp.inDisplayTransit = (srcBuf[88] >> 2) & 0x01;//显示板与中转板通信故障(Eb1)
      this.totalStateFirst = Helper.clone(tmp);
    }
    else if (0xC1 == msgcmd && (3 == typeMsg||5 == typeMsg) && 0x02 == srcBuf[11]) {
      let info = srcBuf.slice(10, 20);

      let tmp = Helper.clone(STATUS.totalStateFirstGroup_2);
      tmp.timingOnMinute = srcBuf[12] + srcBuf[13] * 256;//定时开时间
      tmp.timingOffMinute = srcBuf[14] + srcBuf[15] * 256;//定时关时间

      tmp.localBodySense = (srcBuf[16] >> 7) & 0x01;//"随身感功能实际状态 0： 关    1：开"
      tmp.energySave = (srcBuf[16] >> 6) & 0x01;//"节能功能实际状态  0： 关    1：开"
      tmp.restrong = (srcBuf[16] >> 5) & 0x01;//"强劲功能实际状态 0： 关    1：开"
      tmp.refarceWind = (srcBuf[16] >> 4) & 0x01;//"睿风功能实际状态 0： 关    1：开"
      tmp.repowerSave = (srcBuf[16] >> 3) & 0x01;//"省电功能实际状态 0： 关    1：开"
      tmp.cosySleepSwitch = (srcBuf[16] >> 2) & 0x01;//"舒睡功能实际状态 0： 关    1：开"
      tmp.ecoFunc = (srcBuf[16] >> 0) & 0x01;//"ECO功能实际状态 0： 关    1：开"

      tmp.dustFunFlag = (srcBuf[17] >> 7) & 0x01;//"除尘 0： 关    1：开"
      tmp.reElecHeat = (srcBuf[17] >> 6) & 0x01;//"电辅热功能实际状态 0： 关    1：开"
      tmp.rediyFunc = (srcBuf[17] >> 5) & 0x01;//"干燥功能实际状态 0： 关    1：开"
      tmp.rechgOfAir = (srcBuf[17] >> 4) & 0x01;//"换气功能实际状态 0： 关    1：开"
      tmp.wisdomEye = (srcBuf[17] >> 3) & 0x01;//"智慧眼功能实际状态 0： 关    1：开"
      tmp.naturalWind = (srcBuf[17] >> 2) & 0x01;//"自然风功能实际状态 0： 关    1：开"
      tmp.repeakValleyMode = (srcBuf[17] >> 1) & 0x01;//"峰谷节电功能实际状态 0： 关    1：开"
      tmp.nightLight = (srcBuf[17] >> 0) & 0x01;//"小夜灯功能实际状态 0： 关    1：开"

      tmp.againstCool = (srcBuf[18] >> 7) & 0x01;//"防着凉功能实际状态0： 关    1：开"
      tmp.childKickk = (srcBuf[18] >> 6) & 0x01;//"儿童踢被功能实际状态0： 关    1：开"
      tmp.almSleep = (srcBuf[18] >> 5) & 0x01;//"睡眠（外销）功能实际状态0： 关    1：开"
      tmp.pmv = (srcBuf[18] >> 4) & 0x01;//"PMV功能实际状态0： 关    1：开"
      tmp.displayControlFlag = (srcBuf[18] >> 3) & 0x01;//"屏显信息实际状态0： 灭    1：亮"
      tmp.controlSelfCleaningCurrentStatus = (srcBuf[18] >> 2) & 0x01;//"自清洁功能实际状态0： 关    1：开"
      tmp.nonDirectWind = (srcBuf[18] >> 1) & 0x01;//"防直吹功能实际状态0： 关    1：开"
      tmp.isOpen8DegreeHotCurrentStatus = (srcBuf[18] >> 0) & 0x01;//"8度制热（外销）功能实际状态0： 关    1：开"

      tmp.smartfunCurrentStatus = (srcBuf[19] >> 5) & 0xe0;//"无风感功能实际状态

      tmp.isUseDoubleTempCtrl = (srcBuf[19] >> 4) & 0x01;//"双温控制（外销）0： 关    1：开"
      tmp.ladderFunSw = (srcBuf[19] >> 5) & 0x01;//"阶梯降温功能0： 关    1：开"
      tmp.upDnDaoFengTiaoStat = (srcBuf[19] >> 3) & 0x01;//"上下导风条摇摆状态（左上下风）0： 关    1：开"
      tmp.ltRtDaoFengTiaoStat = (srcBuf[19] >> 2) & 0x01;//"左右导风条摇摆状态（左左右风）0： 关    1：开"
      tmp.TopDaoFengTiaoStat = (srcBuf[19] >> 1) & 0x01;//"顶出风导风条摇摆状态0： 关    1：开"

      tmp.upDnDaoFengTiaoStatRightDown = (srcBuf[20] >> 1) & 0x02;//"上下导风条摇摆状态（右上下风）0： 关    1：开"
      tmp.ltRtDaoFengTiaoStatRightLeft = (srcBuf[20] >> 0) & 0x01;//"左右导风条摇摆状态（右左右风）0： 关    1：开"

      tmp.humFunWindCurrentValue = srcBuf[21];//湿度百分比(补偿之后的湿度值)
      tmp.checkedTempSet = (srcBuf[22] - 30) * 0.5;//设定温度（补偿后的设定温度）
      tmp.indoorFanRuntime = srcBuf[23] + srcBuf[24] * 256;//内风机运行时间
      tmp.outdoorFanSpeed = srcBuf[25] * 8;//室外风机目标转速（目标转速/8）
      tmp.eleSwitchAngle = srcBuf[26] * 8;//电子膨胀阀目标角度（目标开度/8）
      tmp.defrostingStep = srcBuf[27];//化霜阶段（0：无化霜 1：化霜开始阶段 2：化霜过程中 3：化霜结束阶段）
      tmp.outdoorDevState7 = srcBuf[28] & 0x01;//回液检测故障(P92)
      tmp.outdoorDevState8 = (srcBuf[29] >> 1) & 0x01;//"室外IBGT传感器故障"
      tmp.outDoor485Fault = (srcBuf[29] >> 0) & 0x01;//"室外故障或保护（轻商485旧协议）"
      tmp.engineCurWorkedTime = srcBuf[30];//当前压缩机运行时间(秒)
      tmp.engineTotalWorkedTime = srcBuf[31] + srcBuf[32] * 256;//压缩机累积运行时间(小时)
      tmp.limitFreqType2 = srcBuf[33];//限频类型2（预留）
      tmp.devMaxVoltage = srcBuf[34];//整机运行最大电压值(电压值-60)
      tmp.devMinVoltage = srcBuf[35];//整机运行最小电压值(电压值-60)
      tmp.historyMaxCurrent = srcBuf[36];//整机运行历史最大电流值
      tmp.historyMaxForT4 = srcBuf[37];//整机运行历史最大,T4温度值（AD值）
      tmp.historyMinForT4 = srcBuf[38];//整机运行最小T4温度值（AD值）
      tmp.totalErrCnt = srcBuf[39];//累计故障次数（6分钟以后的累计故障次数）
      tmp.shiWaiYaSuoJiCiTong = srcBuf[40] * 8;//压缩机磁通量（点数/8）
      tmp.shiNeiFengJiCiTong = srcBuf[41] * 8;//风机磁通量（点数/8）
      tmp.dSpinCurrent = srcBuf[42];//d轴电流（点数/64）（有符号数）
      tmp.qSpinCurrent = srcBuf[43];//q轴电流（点数/64）（有符号数）
      tmp.enginePeakCurrent = srcBuf[44];//压缩机电流峰值（单位：安培）
      tmp.pfcPeakCurrent = srcBuf[45];//PFC电流峰值（单位：安培） 0~255A
      tmp.fanPeakCurrent = srcBuf[46];//风机电流峰值（单位：安培） 实际电流峰值*32
      tmp.torqueAdjustAngle = srcBuf[47] + srcBuf[48] * 256;//转矩补偿角度低位
      tmp.torqueAdjustValue = srcBuf[49];//转矩补偿幅值（点数/8）
      tmp.adAdjustVoltage1 = srcBuf[50];//AD校准电压1（AD值/16）
      tmp.adAdjustVoltage2 = srcBuf[51];//AD校准电压1（AD值/16）
      tmp.dSpinVoltage = srcBuf[52];//d轴电压（点数/16）
      tmp.qSpinVoltage = srcBuf[53];//q轴电压（点数/16）
      tmp.pfcSwitchStatus = srcBuf[54];//PFC开关状态
      tmp.comStartStatus = srcBuf[55];//压缩机启动阶段
      tmp.outSidePowerFactor = srcBuf[56];//功率因数（*256）
      tmp.outSidePower = srcBuf[57] + srcBuf[58] * 256;//室外机功率（单位：W）
      tmp.upDnDaoFengTiaoCoolUpperLimit = srcBuf[59];//上导风条制冷角度（上摇摆的上限角度百分比）
      tmp.upDnDaoFengTiaoCoolLowerLimit = srcBuf[60];//上导风条制冷角度（上摇摆的下限角度百分比）
      tmp.upDnDaoFengTiaoHeatUpperLimit = srcBuf[61];//上导风条制热角度（上摇摆的上限角度百分比）
      tmp.upDnDaoFengTiaoHeatLowerLimit = srcBuf[62];//上导风条制热角度（上摇摆的下限角度百分比）
      tmp.upDnDaoFengTiaoCurAngle = srcBuf[63];//上导风条角度（上导风条当前角度百分比）
      tmp.ltRtDaoFengTiaoUpperLimit = srcBuf[64];//左右导风条角度（左右导风条摇摆的上限角度百分比）
      tmp.ltRtDaoFengTiaoLowerLimit = srcBuf[65];//左右导风条角度（左右导风条摇摆的下限角度百分比）
      tmp.ltRtDaoFengTiaoCurAngle = srcBuf[66];//左右导风条角度（左右导风条当前角度百分比）

      tmp.outDoorDestFreq = srcBuf[67];//室外目标频率
      tmp.intDoorTargetWindSpeed = srcBuf[68];//室内目标风速百分比

      tmp.TopDaoFengTiaoUpperLimit = srcBuf[69];//顶出风导风（顶出风导风条摇摆的上限角度百分比）
      tmp.TopDaoFengTiaoLowerLimit = srcBuf[70];//顶出风导风（顶出风导风条摇摆的下限角度百分比）
      tmp.TopDaoFengTiaoCurAngle = srcBuf[71];//顶出风导风（顶出风导风条当前角度百分比）

      tmp.downDaoFengTiaoCoolUpperLimit = srcBuf[72];//下导风条制冷角度（下摇摆的上限角度百分比）

      if (srcBuf.length > 71) {
        tmp.downDaoFengTiaoCoolLowerLimit = srcBuf[73];//下导风条制冷角度（下摇摆的下限角度百分比）
        tmp.downDnDaoFengTiaoHeatUpperLimit = srcBuf[74];//下导风条制热角度（下摇摆的上限角度百分比）
        tmp.downDnDaoFengTiaoHeatLowerLimit = srcBuf[75];//下导风条制热角度（下摇摆的下限角度百分比）
        tmp.downDnDaoFengTiaoCurAngle = srcBuf[76];//下导风条角度（下导风条当前角度百分比）

        tmp.secondHumValue = srcBuf[77];//下湿度传感器数值

        tmp.strongCurrent = (srcBuf[78] >> 7) & 0x01;// "强劲功能运行状态1：开启 0：关闭"
        tmp.sterilizeCurrentSW = 1 + ((srcBuf[78] >> 6) & 0x01);//"杀菌负载运行状态1：开启 0：关闭"
        tmp.newWindFunCurrentSw = 1 + ((srcBuf[78] >> 5) & 0x01);//"新风负载运行状态1：开启 0：关闭"
        tmp.humFunCurrentSw = 1 + ((srcBuf[78] >> 4) & 0x01);//"加湿负载运行状态1：开启 0：关闭"
        tmp.cleanFunCurrentSw = 1 + ((srcBuf[78] >> 3) & 0x01);//"净化负载运行状态1：开启 0：关闭"
        tmp.controlSelfCleaningCurrentStage = srcBuf[78] & 0x07;//"自清洁进度0：未自清洁  重复了
        tmp.smartCleanCurrentStatus = srcBuf[78] & 0x07;//智清洁阶段
        //1：第一阶段
        //2：第二阶段
        //3：第三阶段
        //4：第四阶段
        //5：杀菌
        //6：完成"
        tmp.rightControlWindCurrentFree = (srcBuf[79] >> 7) & 0x01;//"右无风感状态 1：开 0：关"
        tmp.leftControlWindCurrentFree = (srcBuf[79] >> 6) & 0x01;//"左无风感状态 1：开 0：关"
        tmp.upDnDaoFengTiaoCurrentStat = (srcBuf[79] >> 5) & 0x01;//"上下导风条摇摆状态（右侧上下风）1：摇摆 0：未摇摆"
        tmp.ltRtDaoFengTiaoCurrentStat = (srcBuf[79] >> 4) & 0x01;//"左右风摇摆状态（右侧左右风） 1：摇摆 0：未摇摆"
        tmp.pannelProtect = (srcBuf[79] >> 3) & 0x01;//"缺面板保护 1：面板取下 0：面板安装"
        tmp.hydropenia = (srcBuf[79] >> 2) & 0x01;//"水箱缺水 1：缺水 0：有水"
        tmp.ltRtDaoFengTiaoCurrentStatLeft = (srcBuf[79] >> 1) & 0x01;//"左右风摇摆状态（左侧左右风）1：摇摆 0：未摇摆"
        tmp.upDnDaoFengTiaoCurrentStatLeft = (srcBuf[79] >> 0) & 0x01;//"上下导风条摇摆状态（左侧上下风）1：摇摆 0：未摇摆"
      }
      this.totalStateSecond = Helper.clone(tmp);
    }

    //todo
    //    // 开始滤网返回
    //    else if(0xB0 == msgcmd)
    //    {
    //        unsigned char info[20] = {0};
    //        memcpy(info, &srcBuf[10], sizeof(info));
    //        struct stSetFilterRes_Ex_t tmp = {0};
    //
    //        if(info[3] != 0x04 || info[2] != 0x01)
    //        {
    //            *msgType = CMDTYPE_INVALID_CMD;
    //            return -1;
    //        }
    //
    //        tmp.result = info[4];
    //    }
    //
    //    // 滤网查询返回
    //    else if(0xB1 == msgcmd)
    //    {
    //        unsigned char info[20] = {0};
    //        memcpy(info, &srcBuf[10], sizeof(info));
    //        struct stGetFilterResultRes_Ex_t tmp = {0};
    //
    //        if(info[4] == 0x01 || info[10] == 0x01 || info[16] == 0x01)
    //        {
    //            //正在检测
    //            tmp.result = 3;
    //        }
    //        else if(info[4] == 0x10 || info[10] == 0x10 || info[16] == 0x10)
    //        {
    //            tmp.result = 2;
    //        }
    //        else if(info[4] == 0 && info[10] == 0 && info[16] == 0)
    //        {
    //
    //            tmp.result = 1;
    //            if(info[3] == 0x04 && info[2] == 0x02)
    //            {
    //                tmp.rate = (info[7] << 8) + info[6];
    //            }
    //            if(info[9] == 0x04 && info[8] == 0x03)
    //            {
    //                tmp.real = (info[13] << 8) + info[12];
    //            }
    //            if(info[14] == 0x04 && info[15] == 0x04)
    //            {
    //                tmp.threshold = info[18];
    //            }
    //        }
    //    }

    //设置/查询命令返回 + （新协议主动上传 || (0xB5 == msgcmd) 针对经典机型）
    //B0控制返回
    //B1查询返回
    else if ((0xB0 == msgcmd) || (0xB1 == msgcmd)) {
      
      let info = srcBuf.slice(10, 64);
      let tmp = Helper.clone(STATUS.newProtocolStatusSet);

      tmpCount = srcBuf[11];//属性个数

      //todo for special device
      // if (tmpCount > 16) {
      //   tmpCount = 16;
      // }

      let ck = 13;

      if (0xB5 == msgcmd) {
        ck = 12;
      }

      let tmplen = 0;
      let sucessflag = 0;
      for (let si = 0; si < tmpCount; si++) {
        //执行结果
        if (0xB5 == msgcmd) {
          //sucessflag = srcBuf[ck + 2];
          sucessflag = 0;
          tmpCmdValue = (srcBuf[ck + 1] * 256) + srcBuf[ck];
        } else {
          sucessflag = srcBuf[ck + 1];
          tmpCmdValue = (srcBuf[ck] * 256) + srcBuf[ck - 1];
        }

        console.log("属性代码", tmpCmdValue, srcBuf[ck], srcBuf[ck - 1]);

        tmplen = srcBuf[ck + 2];//属性长度

        switch (tmpCmdValue) {

          case CMD.CONTROLSELFCLEANING://自清洁
            if (0xB5 != msgcmd) {
              if (sucessflag == 0) {
                tmp.switchSelfCleaning = srcBuf[ck + 3];
              }
              else {
                tmp.switchSelfCleaning = 0;
              }
            }
            break;
          case CMD.NONDIRECTWIND://防直吹
            if (0xB5 != msgcmd) {
              if (sucessflag == 0) {
                tmp.switchNonDirectWind = srcBuf[ck + 3];
              }
              else {
                tmp.switchNonDirectWind = 0;
              }
            }
            break;
          case CMD.NONDIRECTWINDTYPE://防直吹类型
            if (0xB5 != msgcmd) {
              if (sucessflag == 0) {
                tmp.nonDirectWindType = srcBuf[ck + 3];
              }
              else {
                tmp.nonDirectWindType = 0;
              }
            }
            break;
          case CMD.NONDIRECTWINDDISTANCE://防直吹距离
            if (0xB5 != msgcmd) {
              if (sucessflag == 0) {
                tmp.nonDirectWindDistance = srcBuf[ck + 3];
              }
              else {
                tmp.nonDirectWindDistance = 0;
              }
            }
            break;
          case CMD.UPDOWNANGLE://上下摆风角度
            if (0xB5 != msgcmd) {
              if (sucessflag == 0) {
                tmp.upDownAngle = srcBuf[ck + 3];
              }
              else {
                tmp.upDownAngle = 0;
              }
            }
            break;
          case CMD.LEFTRIGHTANGLE://左右摆风角度
            if (0xB5 != msgcmd) {
              if (sucessflag == 0) {
                tmp.leftRightAngle = srcBuf[ck + 3];
              }
              else {
                tmp.leftRightAngle = 0;
              }
            }
            break;
          case CMD.UDAROUNDWIND://上下环绕风
            if (0xB5 != msgcmd) {
              if (sucessflag == 0) {
                tmp.udAroundWindSwitch = srcBuf[ck + 3]; // 0关 1开
                tmp.udAroundWindDirect = srcBuf[ck + 4]; // 1: 上 2：下
              }
              else {
                tmp.udAroundWindSwitch = 0; // 0关 1开
                tmp.udAroundWindDirect = 1; // 1: 上 2：下
              }
            }
            break;
          case CMD.INITCOLDHOTSTATUS://冷热感开关
            if (sucessflag == 0) {
              tmp.coldHotSwitch = srcBuf[ck + 3];
              tmp.coldHotStall = srcBuf[ck + 4];
            }
            else {
              tmp.coldHotSwitch = 0;
              tmp.coldHotStall = 0;
            }
            break;
          case CMD.CONTROLSWITCHNOWINDFEEL://无风感
            if (0xB5 != msgcmd) {
              tmp.controlSwitchNoWindFeel = srcBuf[ck + 3];
            }
            else {
              tmp.controlSwitchNoWindFeel = 0xff;
            }
            break;
          case CMD.FAWINDFEEL://无风感 0全关 2防直吹开 3柔风感开 4无风感开
            if (0xB5 != msgcmd) {
              tmp.faWindFeel = srcBuf[ck + 3];
              tmp.switchNonDirectWind = srcBuf[ck + 3]
            } 
            else {
              tmp.faWindFeel = 0xff;
            }
            break;
          case CMD.AUTOMATICANTICOLDAIR:// 智慧防冷风
            if (0xB5 != msgcmd) {
              tmp.automaticAntiColdAir = srcBuf[ck + 3];
            }
            else {
              tmp.automaticAntiColdAir = 0xff;
            }
            break;
          case CMD.REQUESTHUMIDITYVALUE://当前室内湿度
            if (sucessflag == 0) {
              tmp.requestHumidityValue = srcBuf[ck + 3];
            }
            else {
              tmp.requestHumidityValue = 0xff;
            }
            break;
          case CMD.REQUESTSAFEINVADESTATUS://安防功能
            if (sucessflag == 0) {
              tmp.requestSafeInvadeStatus = srcBuf[ck + 3];
            }
            else {
              tmp.requestSafeInvadeStatus = 0xff;
            }
            break;
          case CMD.CONTROLINTRUSIONSTATUS://入侵功能开启
            if (sucessflag == 0) {
              tmp.controlIntrusionStatus = srcBuf[ck + 3];
            }
            else {
              tmp.controlIntrusionStatus = 0xff;
            }
            break;
          case CMD.CONTROLINTRUSIONVIDEOSTATUS://入侵录像功能
            if (sucessflag == 0) {
              tmp.controlIntrusionVideoStatus = srcBuf[ck + 3];
            }
            else {
              tmp.controlIntrusionVideoStatus = 0xff;
            }
            break;
          case CMD.CONTROLFACERECOGNITIONSTATUS://人脸识别功能
            if (sucessflag == 0) {
              tmp.controlFaceRecognitionStatus = srcBuf[ck + 3];
            }
            else {
              tmp.controlFaceRecognitionStatus = 0xff;
            }
            break;
          case CMD.CONTROLINFRAREDLIGHTSTATUS://红外补光
            if (sucessflag == 0) {
              tmp.controlInfraredLightStatus = srcBuf[ck + 3];
            }
            else {
              tmp.controlInfraredLightStatus = 0xff;
            }
            break;
          case CMD.CONTROLINFRAREDECO://无人节能
            if (sucessflag == 0) {
              tmp.controlInfraredEco_sw = srcBuf[ck + 3];//无人节能功能开关
              tmp.controlInfraredEco_time = srcBuf[ck + 4];//无人节能功能的时间 单位为分钟
              tmp.controlInfraredEco_runtime = srcBuf[ck + 5] + srcBuf[ck + 6] * 256;//无人节能运行的低频时间单位为分钟
              tmp.controlInfraredEco_autoflag = srcBuf[ck + 7];//无人节能是否自动进入关机
              tmp.controlInfraredEco_exitsec = srcBuf[ck + 8];//连续多长时间检测到人自动退出无人节能
            }
            else {
              tmp.controlInfraredEco_sw = 0xff;
              tmp.controlInfraredEco_time = 0xff;
              tmp.controlInfraredEco_runtime = 0xff;
              tmp.controlInfraredEco_autoflag = 0xff;
              tmp.controlInfraredEco_exitsec = 0xff;
            }
            break;
          case CMD.REQUESTINTELLIGENTCONTROLSTATUS_1://控制智能总开关
            if (sucessflag == 0) {
              tmp.requestIntelligentControlStatus_1 = srcBuf[ck + 3];
            }
            else {
              tmp.requestIntelligentControlStatus_1 = 0xff;
            }
            break;
          case CMD.REQUESTINTELLIGENTCONTROLSTATUS_2://风吹人
            //2016-08-09 风吹人/风避人合成1个字节使，0:关闭，1:风吹人 2:风避人
            if (sucessflag == 0) {
              tmp.requestIntelligentControlStatusTwo = srcBuf[ck + 3];
              if (tmp.requestIntelligentControlStatusTwo == 1) {
                tmp.requestIntelligentControlStatus_2 = 1;
                tmp.requestIntelligentControlStatus_3 = 0;
              }
              else {
                tmp.requestIntelligentControlStatus_2 = 0;
                tmp.requestIntelligentControlStatus_3 = 1;
              }
            }
            else {
              tmp.requestIntelligentControlStatusTwo = 0x00;
              tmp.requestIntelligentControlStatus_2 = 0;
              tmp.requestIntelligentControlStatus_3 = 0;
            }

            break;
          case CMD.REQUESTINTELLIGENTCONTROLSTATUS_3://风避人
            if (0xB5 != msgcmd) {
              if (sucessflag == 0) {
                tmp.requestIntelligentControlStatus_3 = srcBuf[ck + 3];
              }
              else {
                tmp.requestIntelligentControlStatus_3 = 0xff;
              }
            }
            break;
          case CMD.REQUESTINTELLIGENTCONTROLSTATUS_4://智能风速调节
            if (sucessflag == 0) {
              tmp.handSwOnorOff = srcBuf[ck + 3];                        //手势开关机
              tmp.handControlWind = srcBuf[ck + 4];                      //手势定向送风
            }
            else {
              tmp.handSwOnorOff = 0xff;                        //手势开关机
              tmp.handControlWind = 0xff;                      //手势定向送风
            }
            break;
          case CMD.CONTROLREMOTEVIDEOSTATUS://手势识别
            if (sucessflag == 0) {
              tmp.controlRemoteVideoStatus = srcBuf[ck + 3];
            }
            else {
              tmp.controlRemoteVideoStatus = 0xff;
            }
            break;
          case CMD.REQUESTINITCOLDEHOTSTATUS://上电语音播报
            if (sucessflag == 0) {
              tmp.voiceBroadcastStatus = srcBuf[ck + 3];                 //语音功能,发0和3
              tmp.awakenStatus = srcBuf[ck + 4];                         //唤醒词状态 唤醒词的选择0:空调空调;1:你好小妹;2:预留;0xff:无效
              tmp.toneStatus = srcBuf[ck + 5];                           //播报声调 语音播报语调的选择;0:标准播报;1:甜美播报;2:蜂鸣器;oxff:无效
              tmp.voiceTimeLength = srcBuf[ck + 6];                      //语音识别超时时间长度 长度 0-254s
              tmp.initialPowerBroadcastSwitch = srcBuf[ck + 7];          //上电播报开关  0：关 1：开 0xff:无效
              tmp.friendshipBroadcastSwitch = srcBuf[ck + 8];            //友情播报开关  0：关 1：开 0xff:无效
              tmp.safetyBroadcastSwitch = srcBuf[ck + 9];                //安全播报开关  0：关 1：开 0xff:无效
              tmp.weatherBroadcastSwitch = srcBuf[ck + 10];               //天气预报播报开关  0：关 1：开 0xff:无效
              tmp.informationBroadcast = srcBuf[ck + 11];                 //维护信息播报  0：关 1：开 0xff:无效
            }
            else {
              tmp.voiceBroadcastStatus = 0xff;
              tmp.awakenStatus = 0xff;
              tmp.toneStatus = 0xff;
              tmp.voiceTimeLength = 0xff;
              tmp.initialPowerBroadcastSwitch = 0xff;
              tmp.friendshipBroadcastSwitch = 0xff;
              tmp.safetyBroadcastSwitch = 0xff;
              tmp.weatherBroadcastSwitch = 0xff;
              tmp.informationBroadcast = 0xff;
            }
            break;
          case CMD.INITVOLUMESTATUS://空气传感语音播报
            if (sucessflag == 0) {
              tmp.volumeControlType = srcBuf[ck + 3];                    //音量调节的类型 音量调节的类型 1：自动调节 2：手动调节 3：固定音量
              tmp.manualAdjustment = srcBuf[ck + 4];                     //手动调节 固定调节的音量 0-100
              tmp.minVolume = srcBuf[ck + 5];                            // 自动调节的最小音量 自动调节的最小音量
              tmp.maximumVolume = srcBuf[ck + 6];                        //自动调节的最大音量 自动调节的最大音量
            }
            else {
              tmp.volumeControlType = 0xff;
              tmp.manualAdjustment = 0xff;
              tmp.minVolume = 0xff;
              tmp.maximumVolume = 0xff;
            }
            break;
          case CMD.INITCOLDEHOTSTATUS://天所预报
            if (sucessflag == 0) {
              tmp.coldHotSwitch = srcBuf[ck + 3];                        //冷热感开关
              tmp.coldHotStall = srcBuf[ck + 4];                         //冷热感的档位  0-100档
              tmp.coldHotNumber = srcBuf[ck + 5];                        //冷热感的人数  （预留）
              tmp.PeopleClothes = srcBuf[ck + 6];                        //人的穿衣情况  （预留）
              tmp.SeasonalState = srcBuf[ck + 7];                        //季节状态 （0：春天 1：夏天：2秋天 3：冬天）（预留）
              tmp.WeatherCondition = srcBuf[ck + 8];                     //天气状态 （0：晴天 1：阵雨 之类的）（预留）
              tmp.NightTimeHour = srcBuf[ck + 9];                        //夜晚判断绝对时间的时间点小时
              tmp.NightTimeMinute = srcBuf[ck + 10];                      //夜晚判断绝对时间的时间点分钟
            }
            else {
              tmp.coldHotSwitch = 0xff;
              tmp.coldHotStall = 0xff;
              tmp.coldHotNumber = 0xff;
              tmp.PeopleClothes = 0xff;
              tmp.SeasonalState = 0xff;
              tmp.WeatherCondition = 0xff;
              tmp.NightTimeHour = 0xff;
              tmp.NightTimeMinute = 0xff;
            }
            break;
          case CMD.CONTROLSETTIME://日期校准
            if (sucessflag == 0) {
              tmp.controlSetTime[0] = srcBuf[ck + 3];//年份
              tmp.controlSetTime[1] = srcBuf[ck + 4];//月份
              tmp.controlSetTime[2] = srcBuf[ck + 5];//日期
              tmp.controlSetTime[3] = srcBuf[ck + 6];//第几周
              tmp.controlSetTime[4] = srcBuf[ck + 7];//小时
              tmp.controlSetTime[5] = srcBuf[ck + 8];//分钟
              tmp.controlSetTime[6] = srcBuf[ck + 9];//秒
            }
            else {
              tmp.controlSetTime[0] = 0xff;
              tmp.controlSetTime[1] = 0xff;
              tmp.controlSetTime[2] = 0xff;
              tmp.controlSetTime[3] = 0xff;
              tmp.controlSetTime[4] = 0xff;
              tmp.controlSetTime[5] = 0xff;
              tmp.controlSetTime[6] = 0xff;
            }
            break;
          case CMD.CONTROLSWITCHPRECOLDHEAT://预冷预热
            if (sucessflag == 0) {
              tmp.controlSwitchPreColdHeat = srcBuf[ck + 3];
            }
            else {
              tmp.controlSwitchPreColdHeat = 0xff;
            }
            break;
          case CMD.CONTROL_PREVENT_COOL_WIND://儿童防冷风
            if (sucessflag == 0) {
              tmp.controlPreventCoolWind = srcBuf[ck + 4];
            }
            else {
              tmp.controlPreventCoolWind = 0xff;
            }
            break;
          case CMD.CONTROL_WEATHER_BROADCAST://天气播报功能
            if (sucessflag == 0) {
              tmp.controlWeatherBroadcast = srcBuf[ck + 4];
            }
            else {
              tmp.controlWeatherBroadcast = 0xff;
            }
            break;
          case CMD.CONTROL_WEATHER_BROADCAST_TIMER://天气播报功能定时开关
            if (sucessflag == 0) {
              tmp.controlWeatherBroadcastTimer = srcBuf[ck + 4];
              tmp.controlWeatherBroadcastTime_1st[0] = srcBuf[ck + 5];
              tmp.controlWeatherBroadcastTime_1st[1] = srcBuf[ck + 6];
              tmp.controlWeatherBroadcastTime_2nd[0] = srcBuf[ck + 7];
              tmp.controlWeatherBroadcastTime_2nd[1] = srcBuf[ck + 8];
              tmp.controlWeatherBroadcastTime_3th[0] = srcBuf[ck + 9];
              tmp.controlWeatherBroadcastTime_3th[1] = srcBuf[ck + 10];
            }
            else {
              tmp.controlWeatherBroadcastTimer = 0xff;
              tmp.controlWeatherBroadcastTime_1st[0] = 0xff;
              tmp.controlWeatherBroadcastTime_1st[1] = 0xff;
              tmp.controlWeatherBroadcastTime_2nd[0] = 0xff;
              tmp.controlWeatherBroadcastTime_2nd[1] = 0xff;
              tmp.controlWeatherBroadcastTime_3th[0] = 0xff;
              tmp.controlWeatherBroadcastTime_3th[1] = 0xff;
            }
            break;
          case CMD.OneKeyControl: //一键优化
            console.log("ems new protocol - OneKeyControl", srcBuf, ck, srcBuf[ck + 3]);
            if (sucessflag == 0) {
              tmp.oneKeyControlSw = srcBuf[ck + 3];
            } else {
              tmp.oneKeyControlSw = 0xff;
            }
            break;
          case CMD.LeftControlWind: //左摆风
            console.log("ems new protocol - LeftControlWind", srcBuf, ck, srcBuf[ck + 3]);
            if (sucessflag == 0) {
              tmp.leftControlWindSw = srcBuf[ck + 3];
              tmp.leftControlWindDegree = srcBuf[ck + 4];
            } else {
              tmp.leftControlWindSw = 0xff;
              tmp.leftControlWindDegree = 0xff;
            }
            break;
          case CMD.RightControlWind: //右摆风
            if (sucessflag == 0) {
              tmp.rightControlWindSw = srcBuf[ck + 3];
              tmp.rightControlWindDegree = srcBuf[ck + 4];
            } else {
              tmp.rightControlWindSw = 0xff;
              tmp.rightControlWindDegree = 0xff;
            }
            break;
          case CMD.UpControlWind: //上摆风
            if (sucessflag == 0) {
              tmp.upControlWindSw = srcBuf[ck + 3];
              tmp.upControlWindDegree = srcBuf[ck + 4];
            } else {
              tmp.upControlWindSw = 0xff;
              tmp.upControlWindDegree = 0xff;
            }
            break;
          case CMD.DownControlWind: //下摆风
            if (sucessflag == 0) {
              tmp.downControlWindSw = srcBuf[ck + 3];
              tmp.downControlWindDegree = srcBuf[ck + 4];
            } else {
              tmp.downControlWindSw = 0xff;
              tmp.downControlWindDegree = 0xff;
            }
            break;
          case CMD.RightUpDownControlWind: //右上摆风
            if (sucessflag == 0) {
              tmp.rightUpDownControlWindSw = srcBuf[ck + 3];
              tmp.rightUpDownControlWindDegree = srcBuf[ck + 4];
            } else {
              tmp.rightUpDownControlWindSw = 0xff;
              tmp.rightUpDownControlWindDegree = 0xff;
            }
            break;
          case CMD.LeftUpDownControlWind: //左上摆风
            if (sucessflag == 0) {
              tmp.leftUpDownControlWindWindSw = srcBuf[ck + 3];
              tmp.leftUpDownControlWindlWindDegree = srcBuf[ck + 4];
            } else {
              tmp.leftUpDownControlWindWindSw = 0xff;
              tmp.leftUpDownControlWindlWindDegree = 0xff;
            }
            break;
          case CMD.LeftControlWindFree: //左无风感
            if (sucessflag == 0) {
              tmp.leftControlWindFreeSw = srcBuf[ck + 3];
              tmp.leftControlWindFreeDegree = srcBuf[ck + 4];
            } else {
              tmp.leftControlWindFreeSw = 0xff;
              tmp.leftControlWindFreeDegree = 0xff;
            }
            break;
          case CMD.RightControlWindFree: //右无风感
            if (sucessflag == 0) {
              tmp.rightControlWindFreeSw = srcBuf[ck + 3];
              tmp.rightControlWindFreeDegree = srcBuf[ck + 4];
            } else {
              tmp.rightControlWindFreeSw = 0xff;
              tmp.rightControlWindFreeDegree = 0xff;
            }
            break;
          case CMD.LightClass: //氛围灯
            if (sucessflag == 0) {
              tmp.lightClassSw = srcBuf[ck + 3];
              tmp.lightClass = srcBuf[ck + 4];
            } else {
              tmp.lightClassSw = 0xff;
              tmp.lightClass = 0xff;
            }
            break;
          case CMD.HumMbrane: //加湿
            if (sucessflag == 0) {
              tmp.humFunSw = srcBuf[ck + 3];
              tmp.humFunWindClass = srcBuf[ck + 4];
              tmp.humFunWindMode = srcBuf[ck + 5];
              tmp.humFunWindOpenValue = srcBuf[ck + 6];
              tmp.humFunWindCloseValue = srcBuf[ck + 7];
              tmp.humFunWindCurrentSetValue = srcBuf[ck + 8];
              tmp.humFunWindCurrentValue = srcBuf[ck + 9];
            } else {
              tmp.humFunSw = 0xff;
              tmp.humFunWindClass = 0xff;
              tmp.humFunWindMode = 0xff;
              tmp.humFunWindOpenValue = 0xff;
              tmp.humFunWindCloseValue = 0xff;
              tmp.humFunWindCurrentSetValue = 0xff;
              tmp.humFunWindCurrentValue = 0xff;
            }
            break;
          case CMD.Sterilize: //杀菌
            if (sucessflag == 0) {
              tmp.sterilizeSw = srcBuf[ck + 3];
              tmp.sterilizeWindClass = srcBuf[ck + 4];
              tmp.sterilizeMode = srcBuf[ck + 5];
              tmp.sterilizeSetTime = srcBuf[ck + 7] << 8 | srcBuf[ck + 6];
              tmp.sterilizeRunTime = srcBuf[ck + 9] << 8 | srcBuf[ck + 8];
            } else {
              tmp.sterilizeSw = 0xff;
              tmp.sterilizeWindClass = 0xff;
              tmp.sterilizeMode = 0xff;
              tmp.sterilizeSetTime = 0xff;
              tmp.sterilizeRunTime = 0xff;
            }
            break;
          case CMD.CleanFun: //净化
            if (sucessflag == 0) {
              tmp.cleanFunSw = srcBuf[ck + 3];
              tmp.cleanFunWindClass = srcBuf[ck + 4];
              tmp.cleanFunMode = srcBuf[ck + 5];
              tmp.cleanFunOpenValue = (srcBuf[ck + 7]) << 8 | srcBuf[ck + 6];
              tmp.cleanFunCloseValue = (srcBuf[ck + 9]) << 8 | srcBuf[ck + 8];
              tmp.cleanFunCurrentValue = (srcBuf[ck + 11]) << 8 | srcBuf[ck + 10];
            } else {
              tmp.cleanFunSw = 0xff;
              tmp.cleanFunWindClass = 0xff;
              tmp.cleanFunMode = 0xff;
              tmp.cleanFunOpenValue = 0xff;
              tmp.cleanFunCloseValue = 0xff;
              tmp.cleanFunCurrentValue = 0xff;
            }
            break;
          case CMD.NewWind: //新风
            if (sucessflag == 0) {
              tmp.newWindFunSw = srcBuf[ck + 3];
              tmp.newWindFunClass = srcBuf[ck + 4];
              tmp.newWindFunMode = srcBuf[ck + 5];
              tmp.newWindFunWindMode = srcBuf[ck + 6];
              tmp.newWindFunOpenValue = (srcBuf[ck + 8] << 8) | srcBuf[ck + 7];
              tmp.newWindFunCloseValue = (srcBuf[ck + 10]) << 8 | srcBuf[ck + 9];
              tmp.newWindFunCurrentValue = (srcBuf[ck + 12]) << 8 | srcBuf[ck + 11];
            } else {
              tmp.newWindFunSw = 0xff;
              tmp.newWindFunClass = 0xff;
              tmp.newWindFunMode = 0xff;
              tmp.newWindFunWindMode = 0xff;
              tmp.newWindFunOpenValue = 0xff;
              tmp.newWindFunCloseValue = 0xff;
              tmp.newWindFunCurrentValue = 0xff;
            }
            break;
          case CMD.LeftRightWindClass: //左右风机转速
            if (sucessflag == 0) {
              tmp.leftWindClass = srcBuf[ck + 3];
              tmp.rightWindClass = srcBuf[ck + 4];
            } else {
              tmp.leftWindClass = 0xff;
              tmp.rightWindClass = 0xff;
            }
            break;
          case CMD.GetWeather: //获取天气
            if (sucessflag == 0) {
              tmp.getWeatherFlag = srcBuf[ck + 3];
              tmp.ourdoorPM25Value = srcBuf[ck + 4];
            } else {
              tmp.getWeatherFlag = 0xff;
              tmp.ourdoorPM25Value = 0xff;
            }
            break;
          case CMD.NearSwStatus: //接近感应
            if (sucessflag == 0) {
              tmp.nearSwStatus = srcBuf[ck + 3];
              tmp.nearNoYes = srcBuf[ck + 4];

            } else {
              tmp.nearSwStatus = 0xff;
              tmp.nearNoYes = 0xff;
            }
            break;
          case CMD.OneKeyAC: //空调一键开关属性
            if (sucessflag == 0) {
              tmp.oneKeyACSw = srcBuf[ck + 3];
              tmp.oneKeyACMode = srcBuf[ck + 4];
              tmp.oneKeyACLeftWind = srcBuf[ck + 5];
              tmp.oneKeyACRghtWind = srcBuf[ck + 6];
              tmp.oneKeyACTemperature = srcBuf[ck + 7] / 2;
              tmp.oneKeyACID = srcBuf[ck + 8];
              tmp.leftWind = srcBuf[ck + 9];
              tmp.rightWind = srcBuf[ck + 10];
            } else {
              tmp.oneKeyACSw = 0xff;
              tmp.oneKeyACMode = 0xff;
              tmp.oneKeyACLeftWind = 0xff;
              tmp.oneKeyACRghtWind = 0xff;
              tmp.oneKeyACTemperature = 0xff;
              tmp.oneKeyACID = 0xff;
              tmp.leftWind = 0xff;
              tmp.rightWind = 0xff;
            }
            break;
          case CMD.CleanClass: //洁净度
            if (sucessflag == 0) {
              tmp.cleanClassSw = srcBuf[ck + 3];
              tmp.cleanRunningStage = srcBuf[ck + 4];
              tmp.cleanRunningTime = srcBuf[ck + 5];
              tmp.cleanTargetRuntime = srcBuf[ck + 6];
            } else {
              tmp.cleanClassSw = 0xff;
              tmp.cleanRunningStage = 0xff;
              tmp.cleanRunningTime = 0xff;
              tmp.cleanTargetRuntime = 0xff;
            }
            break;
          case CMD.NewFresh: //净化滤网
            if (sucessflag == 0) {
              tmp.newFreshState = srcBuf[ck + 3];
              tmp.newFreshTimingTime = (srcBuf[ck + 5]) << 8 | srcBuf[ck + 4];
              tmp.newFreshTotalTime = (srcBuf[ck + 7]) << 8 | srcBuf[ck + 6];
            } else {
              tmp.newFreshState = 0xff;
              tmp.newFreshTimingTime = 0xff;
              tmp.newFreshTotalTime = 0xff;
            }
            break;
          case CMD.Acstrainer: //空调滤网
            if (sucessflag == 0) {
              tmp.acstrainerState = srcBuf[ck + 3];
              tmp.acstrainerRunTime = (srcBuf[ck + 5]) << 8 | srcBuf[ck + 4];
              tmp.acstrainerTotalRunTime = (srcBuf[ck + 7]) << 8 | srcBuf[ck + 6];
            } else {
              tmp.acstrainerState = 0xff;
              tmp.acstrainerRunTime = 0xff;
              tmp.acstrainerTotalRunTime = 0xff;
            }
            break;
          case CMD.WetfilmFun: //湿膜
            if (sucessflag == 0) {
              tmp.wetfilmFunState = srcBuf[ck + 3];
              tmp.wetfilmTime = (srcBuf[ck + 5]) << 8 | srcBuf[ck + 4];
              tmp.wetfilmTotalTime = (srcBuf[ck + 7]) << 8 | srcBuf[ck + 6];
            } else {
              tmp.wetfilmFunState = 0xff;
              tmp.wetfilmTime = 0xff;
              tmp.wetfilmTotalTime = 0xff;
            }
            break;
          case CMD.WaterSupply: //供水状态
            if (sucessflag == 0) {
              tmp.waterSupplyStatus = srcBuf[ck + 3];
              tmp.waterLevel = srcBuf[ck + 4];
              tmp.waterTank = srcBuf[ck + 5];
            } else {
              tmp.waterSupplyStatus = 0xff;
              tmp.waterLevel = 0xff;
              tmp.waterTank = 0xff;
            }
            break;
          case CMD.AirCondition: //空气状况
            if (sucessflag == 0) {
              tmp.temperatureState = srcBuf[ck + 4];
              tmp.humidityCondition = srcBuf[ck + 5];
              tmp.cleanlinessState = srcBuf[ck + 6];
              tmp.freshnessState = srcBuf[ck + 7];
            } else {
              tmp.temperatureState = 0xff;
              tmp.humidityCondition = 0xff;
              tmp.cleanlinessState = 0xff;
              tmp.freshnessState = 0xff;
            }
            break;
          case CMD.AirQuality: //空气质量
            if (sucessflag == 0) {
              tmp.airQualitySw = srcBuf[ck + 3];
              tmp.airQualityLamp = srcBuf[ck + 4];
              tmp.airQuality = srcBuf[ck + 5];
            } else {
              tmp.airQualitySw = 0xff;
              tmp.airQualityLamp = 0xff;
              tmp.airQuality = 0xff;
            }
            break;
          case CMD.Turbo: //强劲
            if (sucessflag == 0) {
              tmp.turbo = srcBuf[ck + 3];
            } else {
              tmp.turbo = 0xff;
            }
            break;
          case CMD.ElectricHeat: //电辅热
            if (sucessflag == 0) {
              tmp.electricHeat = srcBuf[ck + 3];
            } else {
              tmp.electricHeat = 0xff;
            }
            break;
          case CMD.DryNew: //干燥
            if (sucessflag == 0) {
              tmp.dryNew = srcBuf[ck + 3];
            } else {
              tmp.dryNew = 0xff;
            }
            break;
          case CMD.ECOstate: //ECO
            if (sucessflag == 0) {
              tmp.ecoSw = srcBuf[ck + 3];
              tmp.ecos = srcBuf[ck + 4];
              tmp.ecomin = srcBuf[ck + 5];
              tmp.ecoh = srcBuf[ck + 6];
            } else {
              tmp.ecoSw = 0xff;
              tmp.ecos = 0xff;
              tmp.ecomin = 0xff;
              tmp.ecoh = 0xff;
            }
            break;
          case CMD.KeepWarm: //舒省
            if (sucessflag == 0) {
              tmp.keepWarmSw = srcBuf[ck + 3];
              tmp.keepWarmSetTemp = srcBuf[ck + 4];
            } else {
              tmp.keepWarmSw = 0xff;
              tmp.keepWarmSetTemp =  0xff;
            }
            break;
          case CMD.CloseScreen: //关大屏屏幕
            if (sucessflag == 0) {
              tmp.closeScreenSw = srcBuf[ck + 3];
            } else {
              tmp.closeScreenSw = 0xff;
            }
            break;
          case CMD.Waitclean: //待机清洁
            if (sucessflag == 0) {
              tmp.waitcleanSw = srcBuf[ck + 3];
            } else {
              tmp.waitcleanSw = 0xff;
            }
            break;
          case CMD.IndoorTemperature: //室内温度
            if (sucessflag == 0) {
              tmp.indoorTemperature = parseInt((srcBuf[ck + 3] - 50) / 2);
              tmp.indoorDecimal = ((srcBuf[ck + 4]) / 10);
            } else {
              tmp.indoorTemperature = 0xff;
            }
            break;
          case CMD.OutdoorTemperature: //室外温度
            if (sucessflag == 0) {
              tmp.outdoorTemperature = parseFloat(((srcBuf[ck + 3] - 50) / 2).toFixed(1));
            } else {
              tmp.outdoorTemperature = 0xff;
            }
            break;
            case CMD.Supercooling: //空调一键开关属性
            if (sucessflag == 0) {
              tmp.superCoolingSw = srcBuf[ck + 3];            
              tmp.startTemperature = srcBuf[ck + 4];
              tmp.endTemperature = srcBuf[ck + 5];
              tmp.startWindSpeed = srcBuf[ck + 6];
              tmp.endWindSpeed = srcBuf[ck + 7];
            } else {
              tmp.superCoolingSw = 0xff;
              tmp.startTemperature = 0xff;
              tmp.endTemperature = 0xff;
              tmp.startWindSpeed = 0xff;
              tmp.endWindSpeed = 0xff;
            }
            break;
            case CMD.FRESHAIR: //空调新风
            if (sucessflag == 0) {
              tmp.switchFreshAir = srcBuf[ck + 3];            
              tmp.freshAirFanSpeed = srcBuf[ck + 4];
              tmp.freshAirTemp = srcBuf[ck + 5];
              tmp.freshAirMode = srcBuf[ck + 6];              
            } else {
              tmp.switchFreshAir = 0xff;            
              tmp.freshAirFanSpeed = 0xff;
              tmp.freshAirTemp = 0xff;
              tmp.freshAirMode = 0xff;                      
            }
            break;
            case CMD.PREPAREFOOD: //厨房空调备菜
            console.log('厨房空调备菜=====================>', CMD.PREPAREFOOD, '--',  srcBuf[ck + 3])
            if (sucessflag == 0) {
              tmp.prepareFood = srcBuf[ck + 3];            
              tmp.prepareFoodTemp = srcBuf[ck + 4];
              tmp.prepareFoodFanSpeed = srcBuf[ck + 5];          
            } else {
              tmp.prepareFood = 0xff;            
              tmp.prepareFoodTemp = 0xff;
              tmp.prepareFoodFanSpeed = 0xff;                   
            }
            break;
            case CMD.QUICKFRY: //厨房空调爆炒
            if (sucessflag == 0) {
              tmp.quickFry = srcBuf[ck + 3];            
              tmp.quickFryTemp = srcBuf[ck + 4];
              tmp.quickFryFanSpeed = srcBuf[ck + 5];          
            } else {
              tmp.quickFry = 0xff;            
              tmp.quickFryTemp = 0xff;
              tmp.quickFryFanSpeed = 0xff;                   
            }
            break;
            case CMD.QUICKFRYCENTERPOINT: //厨房空调爆炒摆风角度
            if (sucessflag == 0) {
              tmp.quickFryCenterPoint = srcBuf[ck + 3];            
              tmp.quickFryAngle = srcBuf[ck + 4];        
            } else {
              tmp.quickFryCenterPoint = 0xff;            
              tmp.quickFryAngle = 0xff;                 
            }
            break;
            case CMD.STRONGFRESHAIR:
            if(sucessflag == 0) {
              tmp.strongFreshAir = srcBuf[ck + 3];              
            } else {
              tmp.strongFreshAir = 0xff;
            }
            break;
            case CMD.NEWMODE:
            if(sucessflag == 0) {
              console.log('successnewmode');
              tmp.newModePower = srcBuf[ck + 3];
              tmp.newMode = srcBuf[ck + 4];
              tmp.newModeTemp = (srcBuf[ck + 5])/2;
              tmp.newModeWindSpeed = srcBuf[ck + 6];
            } else {        
              console.log('errnewmode');      
              tmp.newModePower = 0xff;
              tmp.newMode = 0xff;
              tmp.newModeTemp = 0xff;
              tmp.newModeWindSpeed = 0xff;
            }
            break;       
            case CMD.DEGERMING: // 杀菌
              if(sucessflag == 0) {
                console.log('successnewmode');
                tmp.degerming = srcBuf[ck + 3];              
              } else {        
                console.log('errnewmode');      
                tmp.degerming = 0xff;                
              }
              break;
            case CMD.CONTROLSOFTWINDSTATUS:  //柔风感
                tmp.controlSoftWindStatus=tmplen?srcBuf[ck+3]:0
              break;
            case CMD.TH_SOFTWIND: // TH柔风
              if(sucessflag == 0) {
                tmp.thSoftWindStatus = srcBuf[ck+3]
              } else {
                tmp.thSoftWindStatus = 0xff
              }
              break;
            case CMD.CONTROLPM25DISPLAY: //PM2.5
                tmp.controlPM25Display=tmplen?srcBuf[ck+3]:0
              break;
            case CMD.CONTROLWISDOMWIND: //智慧风
                tmp.controlWisdomWind=tmplen?srcBuf[ck+3]:0
              break;
            case CMD.COOLPOWERSAVING: // 酷省
              if(sucessflag == 0) {                
                tmp.coolPowerSaving = srcBuf[ck + 3];              
              } else {                            
                tmp.coolPowerSaving = 0xff;                
              }
              break;
            case CMD.AROUNDWIND: // 环游风
              if(sucessflag == 0) {                
                tmp.aroundWind = srcBuf[ck + 3];              
              } else {                            
                tmp.aroundWind = 0xff;                
              }
              break;
            case CMD.QUICKCOOLHEAT: // 速冷热
              if(sucessflag == 0) {                
                tmp.quickCoolHeat = srcBuf[ck + 3];              
              } else {                            
                tmp.quickCoolHeat = 0xff;                
              }
              break;
            case CMD.THPOWER: // TH关机
              if(sucessflag == 0) {                
                tmp.runStatus = srcBuf[ck + 3];              
              } else {                            
                tmp.runStatus = 0xff;                
              }
              break;
              case CMD.DOWNLEFTRIGHTANGLE: // TH下左右风向
              if(sucessflag == 0) {                
                tmp.downLeftRightAngle = srcBuf[ck + 3];              
              } else {                            
                tmp.downLeftRightAngle = 0xff;                
              }
              break;
            case CMD.UPDOWNNOWINDSENSE: // TH上下无风感
              console.log("有00af？进来这里？");
              if(sucessflag == 0) {                
                tmp.upNoWindSense = srcBuf[ck + 3];  
                tmp.downNoWindSense = srcBuf[ck + 4];            
              } else {                            
                tmp.upNoWindSense = 0xff;            
                tmp.downNoWindSense = 0xff;            
              }
              break;
            case CMD.DOWNLEFTRIGHTWIND: // 下左右风
              if(sucessflag == 0) {                
                tmp.downLeftRightWindTh = srcBuf[ck + 3];              
              } else {                            
                tmp.downLeftRightAngle = 0xff;                
              }
              break;
            case CMD.KEEPWET: // 保湿
              if(sucessflag == 0) {                
                tmp.moisturizing = srcBuf[ck + 3];    
                tmp.moisturizingFanSpeed = srcBuf[ck + 4];          
              } else {                            
                tmp.moisturizing = 0xff;     
                tmp.moisturizingFanSpeed = 0xff;              
              }
              break;
            case CMD.CLEANFUNC: // 净化
              if(sucessflag == 0) {                
                tmp.innerPurifier = srcBuf[ck + 3];    
                tmp.innerPurifierFanSpeed = srcBuf[ck + 4];          
              } else {                            
                tmp.innerPurifier = 0xff;    
                tmp.innerPurifierFanSpeed = 0xff;              
              }
              break;
            case CMD.BACKWARMREMOVEWET: // 回温除湿
              if(sucessflag == 0) {                
                tmp.rewarmingDry = srcBuf[ck + 3];              
              } else {                            
                tmp.rewarmingDry = 0xff;                
              }
              break;
              // WINDSWINGLRLEFT: 0x0080, // 左左右风
              // WINDSWINGLRRIGHT: 0x0081, // 右左右风
            case CMD.WINDSWINGLRLEFT: // 左左右风
              if (sucessflag == 0) {
                // tmp.windSwingLrLeft = srcBuf[ck + 3]
              } else {
                // tmp.windSwingLrLeft = 0xff
              }
              break;
            case CMD.WINDSWINGLRRIGHT: // 右左右风
              if (sucessflag == 0) {
                // tmp.windSwingLrRight = srcBuf[ck + 3]
              } else {
                // tmp.windSwingLrRight = 0xff
              }
              break;            
            case CMD.RIGHTLRWINDANGLE: // 右左右出风方向
              if (sucessflag == 0) {
                tmp.rightLrWindAngle = srcBuf[ck + 3]
              } else {
                tmp.rightLrWindAngle = 0xff
              }
              break;
            case CMD.WINDSWINGUDLEFT: // 左上下风
              if (sucessflag == 0) {
                tmp.windSwingUdLeft = srcBuf[ck + 3]
              } else {
                tmp.windSwingUdLeft = 0xff
              }
              break;
            case CMD.WINDSWINGUDRIGHT: // 右上下风
              if (sucessflag == 0) {
                tmp.windSwingUdRight = srcBuf[ck + 3]
              } else {
                tmp.windSwingUdRight = 0xff
              }
              break;
            case CMD.ELECHEATTYPE: // 电辅热默认状态
              if(sucessflag == 0) {                
                tmp.elecHeatType = srcBuf[ck + 3];              
              } else {                            
                tmp.elecHeatType = 0xff;                
              }
              break;
            case CMD.THWINDSPEED: // TH风速
              if(sucessflag == 0) {                
                tmp.windSpeed = srcBuf[ck + 3];  
                this.sendingState.windSpeed = tmp.windSpeed;            
              } else {                            
                tmp.windSpeed = 0xff;      
                this.sendingState.windSpeed = tmp.windSpeed;           
              }
              break;
            case CMD.THLIGHT: // TH风速
              if(sucessflag == 0) {                
                tmp.thLight = srcBuf[ck + 3];                
              } else {                            
                tmp.thLight = 0xff;
              }
              break;
            case CMD.CIRCLEFAN: // 循环扇
              if(sucessflag == 0) {                
                tmp.circleFan = srcBuf[ck + 3];   
                tmp.circleFanMode = srcBuf[ck + 4];   
              } else {                            
                tmp.circleFan = 0xff;   
                tmp.circleFanMode = 0xff;   
              }
              break;
            case CMD.SOUNDSWITCH: // 电控蜂鸣器开关
              if(sucessflag == 0) {                
                tmp.newSoundSwitch = srcBuf[ck + 3];   
                tmp.newSoundSwitch = srcBuf[ck + 4];   
              } else {                            
                tmp.newSoundSwitch = 0xff;   
                tmp.newSoundSwitch = 0xff;   
              }
              break;
            case CMD.SOUNDTYPE: // 电控蜂鸣器开关
              if(sucessflag == 0) {                
                tmp.newSoundType = srcBuf[ck + 3];   
                tmp.newSoundType = srcBuf[ck + 4];   
              } else {                            
                tmp.newSoundType = 0xff;   
                tmp.newSoundType = 0xff;   
              }
              break;
            case CMD.PREVENTCOOLWINDMEMORY: // 电控蜂鸣器开关
              if(sucessflag == 0) {                
                tmp.hasPreventCoolWindMenory = 1;
                tmp.preventCoolWindMenory = srcBuf[ck + 3];                   
              } else {                            
                tmp.newSoundType = 0xff;   
                tmp.newSoundType = 0xff;   
              }
              break;
            case CMD.THALL: // TH全量 th的开机回会出现风速先接收到120，再恢复正常，所以此处直接从返回解出风速放在旧协议状态里             
              let thNowindFeelBuf = srcBuf[ck + 30]
              if(sucessflag == 0) {
                tmp.windSpeed = srcBuf[ck + 6];
                tmp.thNoWindSenseLeft = (srcBuf[ck + 30] & 0x01) ? 2 : 1;
                tmp.thNoWindSenseRight = (srcBuf[ck + 30] & 0x02) ? 2 : 1;
                console.log("CMD.THALL" ,CMD.THALL, srcBuf[ck + 6],srcBuf[ck + 30], tmp.thNoWindSenseLeft, tmp.thNoWindSenseRight, tmp.windSpeed)
            
                
                tmp.upNoWindSense = (srcBuf[ck + 26] & 0x04) ? 2 : 1;
                tmp.downNoWindSense = (srcBuf[ck + 26] & 0x08) ? 2 : 1;
                tmp.leftLeftRightWind = (srcBuf[ck + 10] & 0x02) ? 1 : 0;

                tmp.windSwingLrLeft = (srcBuf[ck + 10] & 0x02) ? 1 : 0;
                tmp.windSwingLrRight = (srcBuf[ck + 10] & 0x01) ? 1 : 0;
                console.log("左左右风这里解出来多少，", tmp.windSwingLrLeft, tmp.windSwingLrRight)

              } else {
                tmp.windSpeed = 0xff;
                tmp.elecHeat = 0xff;
              }     
              this.sendingState.windSpeed = tmp.windSpeed;   
            // case CMD.THGUINOWINDSENSE: // TH无风感（左无风感，右无风感）
            //   let _ck = 21;
            //   console.log("CMD.THGUINOWINDSENSE" ,CMD.THGUINOWINDSENSE, "srcBuf[ck]", srcBuf[ck],"ck", ck)
            //   if(sucessflag == 0) {               
            //     tmp.thNoWindSenseLeft = srcBuf[ck + 3]; 
            //     tmp.thNoWindSenseRight = srcBuf[ck + 3]; 
            //   } else {
            //     tmp.thNoWindSenseLeft = 0xff; 
            //     tmp.thNoWindSenseRight = 0xff;     
            //   }                                     
          default:
            break;
        }

        ck = ck + tmplen + 4;

        //B5步长修正
        if (0xB5 == msgcmd) {
          ck = ck - 1;
        }
      }

      //新协议状态判断
      if (tmp.requestSafeInvadeStatus == 2) {
        tmp.requestSafeInvadeStatus = 0;
      } else if (tmp.requestSafeInvadeStatus == 3) {
        tmp.requestSafeInvadeStatus = 1;
      }

      //状态同步
      this.newacceptingState = Helper.clone(tmp);
      this.stateSynchronizationForNew(0xB5 == msgcmd);
    }
    //JJ/JX B5主动上传
    // else if(0xB5 == msgcmd) {
    //   //todo
    //   let info = srcBuf.slice(10, 64);
    //   let tmp = Helper.clone(STATUS.newProtocolStatusSet);
    //
    //   tmpCount = srcBuf[11];//属性个数
    //   if (tmpCount > 16) {
    //     tmpCount = 16;
    //   }
    //
    //   let ck = 13;
    //
    //   if (0xB5 == msgcmd) {
    //     ck = 12;
    //   }
    //
    //   let tmplen = 0;
    //   let sucessflag = 0;
    //   for (let si = 0; si < tmpCount; si++) {
    //     //执行结果
    //     if (0xB5 == msgcmd) {
    //       //sucessflag = srcBuf[ck + 2];
    //       sucessflag = 0;
    //       tmpCmdValue = (srcBuf[ck + 1] * 256) + srcBuf[ck];
    //     } else {
    //       sucessflag = srcBuf[ck + 1];
    //       tmpCmdValue = (srcBuf[ck] * 256) + srcBuf[ck - 1];
    //     }
    //
    //     console.log("属性代码", tmpCmdValue, srcBuf[ck], srcBuf[ck - 1]);
    //
    //     tmplen = srcBuf[ck + 2];//属性长度
    //
    //     switch (tmpCmdValue) {
    //
    //       case CMD.CONTROLSELFCLEANING://自清洁
    //         if (0xB5 != msgcmd) {
    //           if (sucessflag == 0) {
    //             tmp.switchSelfCleaning = srcBuf[ck + 3];
    //           }
    //           else {
    //             tmp.switchSelfCleaning = 0;
    //           }
    //         }
    //         break;
    //       default:
    //         break;
    //     }
    //
    //     ck = ck + tmplen + 4;
    //
    //     //B5步长修正
    //     if (0xB5 == msgcmd) {
    //       ck = ck - 1;
    //     }
    //   }
    //
    //   //状态同步
    //   this.newacceptingState = Helper.clone(tmp);
    //   this.stateSynchronizationForNew(0xB5 == msgcmd);
    // }
    // 不接收A0上报
    /*else if (0xA0 == msgcmd) {
      let info = srcBuf.slice(10);
      let tmp = Helper.clone(STATUS.standardProtocolStatusSet);

      tmp.faultFlag = (info[1] & 0x80) >> 7;//(info[1] & 0x80) ? 1:0;
      tmp.runStatus = (info[1] & 0x01);//(info[1] & 0x01) ? 1:0;
      tmp.tempSet = ((info[1] & 0x3e) >> 1) + 12;
      if ((info[1] & 0x40) > 0) {
        tmp.tempSet += 0.5;
      }

      tmp.mode = (info[2] & 0xE0) >> 5;

      // 返回温度值范围检查
      //tmp.tempSet = TempValCheck(tmp.tempModeSwitch,tmp.tempSet);

      tmp.windSpeed = info[3] & 0x7f;

      tmp.timingOnSwitch = (info[4] & 0x80) >> 7;//(info[4] & 0x80) ? 1:0;//定时开机
      tmp.timingOffSwitch = (info[5] & 0x80) >> 7;//(info[5] & 0x80) ? 1:0;//定时开机

      if (1 == tmp.timingType) {
        if (1 == tmp.timingOnSwitch) {
          tmp.timingOnHour = ((info[4] & 0x7F) >> 2) & 0x1F;//绝对定时 小时
          tmp.timingOnMinute = (((info[4] & 0x7F) & 0x03)) * 15 + ((info[6] & 0xF0));//绝对定时 分
        }

        if (1 == tmp.timingOffSwitch) {
          tmp.timingOffHour = ((info[5] & 0x7F) >> 2) & 0x1F;//绝对定时 小时
          tmp.timingOffMinute = (((info[5] & 0x7F) & 0x03)) * 15 + ((info[6] & 0x0F));//绝对定时 分
        }
      }
      // 相对时间
      else {
        if ((1 == tmp.timingOnSwitch) && (0x7F != (info[4] & 0x7F))) {
          tmp.timingOnHour = ((((info[4] & 0x7F) + 1) * 15) - ((info[6] >> 4) & 0x0F)) / 60;
          tmp.timingOnMinute = ((((info[4] & 0x7F) + 1) * 15) - ((info[6] >> 4) & 0x0F)) % 60;
        }

        if ((1 == tmp.timingOffSwitch) && (0x7F != (info[5] & 0x7F))) {
          tmp.timingOffHour = ((((info[5] & 0x7F) + 1) * 15) - (info[6] & 0x0F)) / 60;
          tmp.timingOffMinute = ((((info[5] & 0x7F) + 1) * 15) - (info[6] & 0x0F)) % 60;
        }
      }

      //21016-8-16 再刷新风向状态
      if (0x10 > info[7]) {
        tmp.cosyWind = 0;
      }
      else if (0x20 > info[7]) {
        tmp.cosyWind = info[7] - 16;//舒适风
      }
      else if (0x30 > info[7]) {
        tmp.cosyWind = info[7] - 22;//舒适风
      }
      else if (0x30 == (info[7] & 0xf0)) {
        tmp.leftLeftRightWind = info[7] & 0x02 ? 1 : 0;
        tmp.rightLeftRightWind = info[7] & 0x01 ? 1 : 0;
        tmp.leftUpDownWind = info[7] & 0x08 ? 1 : 0;
        tmp.rightUpDownWind = info[7] & 0x04 ? 1 : 0;
      }

      tmp.cosySleepMode = info[8] & 0x03;//舒睡模式
      tmp.powerSave = (info[8] & 0x08) >> 3;//(info[8] & 0x08)?1:0;
      tmp.farceWind = (info[8] & 0x10) >> 4;//(info[8] & 0x10)?1:0;
      tmp.strong = (info[8] & 0x20) >> 5;//(info[8] & 0x20)?1:0;
      tmp.energySave = (info[8] & 0x40) >> 6;
      tmp.bodySense = (info[8] & 0x80) >> 7;//(info[8] & 0x80)?1:0;

      tmp.childSleepMode = (info[9] & 0x01);//(info[9] & 0x01)?1:0;
      //        tmp.naturalWind  = (info[9] & 0x02) >> 1;//(info[9] & 0x02)?1:0;
      tmp.diyFunc = (info[9] & 0x04) >> 2;//(info[9] & 0x04)?1:0;
      tmp.elecHeat = (info[9] & 0x08) >> 3;//(info[9] & 0x08)?1:0;
      tmp.ecoFunc = (info[9] & 0x10) >> 4;//(info[9] & 0x10)?1:0;
      tmp.cleanUpFunc = (info[9] & 0x20) >> 5;//(info[9] & 0x20)?1:0;
      //tmp.cosySleepSwitch  = (info[9] & 0x40) >> 6;//(info[9] & 0x40)?1:0;
      tmp.ecoFunc = (info[9] & 0x80) >> 7;//(info[9] & 0x80)?1:0;
      tmp.CSEco = (info[22] & 0x01) >> 0;//(info[9] & 0x80)?1:0;
      tmp.downWind = (info[20] & 0x80) >> 7;
      tmp.downSwipeWindFunc =(info[19] & 0x80) >> 7;

      tmp.sleepFuncState = (info[10] & 0x01);//(info[10]&0x01) ? 1:0;//SLEEP功能
      tmp.tubroFuncState = (info[10] & 0x02) >> 1;//(info[10]&0x02) ? 1:0;//tubro功能

      //tmp.tempModeSwitch = ((info[10]&0x04) >> 2);//(info[10]&0x04) ? 1:0;//温度单位
      tmp.childKickk = ((info[10] & 0x04) >> 2);//踢被子

      tmp.againstCool = (info[10] & 0x08) >> 3;//(info[10]&0x20) ? 1:0;//防着凉

      //tmp.chgOfAir = (info[10]&0x08) >> 3;//(info[10]&0x08) ? 1:0;//换气
      tmp.nightLight = (info[10] & 0x010) >> 4;//(info[10]&0x010) ? 1:0;//小夜灯
      //tmp.againstCool = (info[10]&0x20) >> 5;//(info[10]&0x20) ? 1:0;//防着凉
      tmp.peakValleyMode = (info[10] & 0x20) >> 5;

      tmp.renaturalWind = (info[10] & 0x40) >> 6;//(info[10]&0x40) ? 1:0;//自然风
      //tmp.coolWindMode = (info[10]&0x80) >> 7;//(info[10]&0x80) ? 1:0;//S凉风
      tmp.energySave = (info[10] & 0x80) >> 7;


      tmp.pmv = (info[11] & 0xf0) >> 4;
      tmp.lightClass = (info[14] & 0x07);//亮度控制

      //tmp.tempIn = ((float)info[11]-50)/2;//室内温度
      //tmp.tempOut = ((float)info[12]-50)/2;//室外温度

      //memcpy(dstBuf, &tmp, sizeof(tmp));

      this.acceptingState = Helper.clone(tmp);

      this.stateSynchronizationForClassic(false);
    }*/
    else if (0xA1 == msgcmd) {
      let info = srcBuf.slice(10);
      let tmp = Helper.clone(STATUS.stA1Param_Ex_t);

      tmp.totalPowerConsume = parseFloat(this.BCDToInt(info[1]) * 10000 + this.BCDToInt(info[2]) * 100 + this.BCDToInt(info[3]) + this.BCDToInt(info[4]) * 1.0 / 100);
      tmp.totalRunPower = parseFloat(this.BCDToInt(info[5]) * 10000 + this.BCDToInt(info[6]) * 100 + this.BCDToInt(info[7]) + this.BCDToInt(info[8]) * 1.0 / 100);
      //tmp.curRunPower = parseFloat(BCDToInt(info[12])*10000 + BCDToInt(info[13])*100 + BCDToInt(info[14]) + BCDToInt(info[15])*1.0/100);
      //tmp.curRealTimePower = parseFloat(BCDToInt(info[16]) + BCDToInt(info[17])*1.0/100 + BCDToInt(info[18])*1.0/10000);

      tmp.curWorkedDay = ((info[9] << 8) & 0xFF00) | (info[10] & 0x00FF);
      tmp.curWorkedHour = info[11];
      tmp.curWorkedMin = info[12];

      tmp.t1Temp = (parseFloat(info[13]) - 50) / 2;//室内温度
      tmp.t4Temp = (parseFloat(info[14]) - 50) / 2;//室内温度
      tmp.pm25Value = (info[15] << 8) | (info[16] & 0x00FF);

      tmp.curHum = info[17];

      tmp.lightAdValue = info[19];
      //memcpy(dstBuf, &tmp, sizeof(tmp));

      this.stateSynchronizationForClassic(false);
    }

    else {
      return -10;
    }

    return 0;
  }


  // param 解包酷风函数
  unPackForCoolFreeClassical(_srcBuf_) {
    let srcBuf = Helper.decimalArrayToHexArray(_srcBuf_);
    let msgType = "";

    console.log("<----------unPackForCoolFree------>", srcBuf, Helper.decimalArrayToHexStrArray(srcBuf), srcBuf[9], srcBuf[10], srcBuf[15]);

    if(srcBuf[9] == 0x03 && srcBuf[10] == 0xbb && srcBuf[15] == 0x11 || srcBuf[9] == 0x02 && srcBuf[10] == 0xbb && srcBuf[15] == 0x20) {     
      console.log("<----------unPackForCoolFree 控制返回解包------>", srcBuf, Helper.decimalArrayToHexStrArray(srcBuf), srcBuf[9], srcBuf[10], srcBuf[15]);
      let tmp = Helper.clone(STATUS.standardProtocolStatusSet);
      let info = srcBuf.slice(16);
      console.log(info)
      

      // 数据0
      tmp.runStatus = (info[0] & 0x01) ? 1 : 0;
      tmp.coolFreeStayClean = ((info[0] & 0x02) >> 1) ? 1 : 0;
      tmp.coolFreeMute = ((info[0] & 0x04) >> 2) ? 1 : 0;
      tmp.coolFreeNowindFeel = ((info[0] & 0x08) >> 3) ? 1 : 0;
      tmp.coolFreeDryClean = ((info[0] & 0x10) >> 4) ? 1 : 0;
      tmp.strong = ((info[0] & 0x20) >> 5) ? 1 : 0;
      tmp.coolFreeManualFreshAir = ((info[0] & 0x40) >> 6) ? 1 : 0;
      tmp.coolFreeManualFreshAir = ((info[0] & 0x80) >> 7) ? 1 : 0;

      // 数据1
      tmp.coolFreeLeftUdWind = (info[1] & 0x01) ? 1 : 0;
      tmp.coolFreeRightUdWind = ((info[1] & 0x02) >> 1) ? 1 : 0;
      tmp.coolFreeUpLrWind = ((info[1] & 0x04) >> 2) ? 1 : 0;
      tmp.coolFreeDownLrWind = ((info[1] & 0x08) >> 3) ? 1 : 0;
      tmp.coolFreeForceCool = ((info[1] & 0x10) >> 4) ? 1 : 0;
      tmp.coolFreeForceAuto = ((info[1] & 0x20) >> 5) ? 1 : 0;
      tmp.elecHeat = ((info[1] & 0x40) >> 6) ? 1 : 0;
      tmp.elecHeatWithT4 = ((info[1] & 0x80) >> 7) ? 1 : 0;
      

      // 数据2
      tmp.coolFreeCoolWarmFeel = (info[2] & 0x01) ? 1 : 0;
      tmp.againstCool = ((info[2] & 0x02) >> 1) ? 1 : 0;
      tmp.coolFreeWindOnPeople = ((info[2] & 0x04) >> 2) ? 1 : 0;
      tmp.coolFreeWindOffPeople = ((info[2] & 0x08) >> 3) ? 1 : 0;
      tmp.coolFreeSterilize = ((info[2] & 0x10) >> 4) ? 1 : 0;
      tmp.coolFreeElecCleanDust = ((info[2] & 0x20) >> 5) ? 1 : 0;
      tmp.coolFreeSelfClean = ((info[2] & 0x40) >> 6) ? 1 : 0;
      tmp.coolFreePowerSaving = ((info[2] & 0x80) >> 7) ? 1 : 0;


      // 数据3
      tmp.coolFreeOneKeyOptimise = (info[3] & 0x01) ? 1 : 0;
      tmp.coolFreeNoPeoplePowerSave = ((info[3] & 0x02) >> 1) ? 1 : 0;
      tmp.coolFreeAutoClean = ((info[3] & 0x04) >> 2) ? 1 : 0;
      tmp.coolManualClean = ((info[3] & 0x08) >> 3) ? 1 : 0;
      tmp.coolFreeNowindFeelMode = ((info[3] & 0x30) >> 4);     
      tmp.coolFreeTryRunning = ((info[3] & 0x40) >> 6) ? 1 : 0;
      tmp.coolFreeFastCheck = ((info[3] & 0x80) >> 7) ? 1 : 0;

      // 数据4
      tmp.coolFreeAutoHum = (info[4] & 0x01) ? 1 : 0;
      tmp.coolFreeManualHum = ((info[4] & 0x02) >> 1) ? 1 : 0;
      tmp.coolFreeInWindStrength = ((info[4] & 0x04) >> 2) ? 1 : 0;
      tmp.coolFreeNewWindSwitch = ((info[4] & 0x08) >> 3) ? 1 : 0;
      tmp.coolFreeNewWindLinkSwitch = ((info[4] & 0x10) >> 4) ? 1 : 0;
      tmp.coolFreeVacuum = ((info[4] & 0x20) >> 5) ? 1 : 0;
      tmp.bodySense = ((info[4] & 0x40) >> 6) ? 1 : 0;
      tmp.coolFreeOutWindStrength = ((info[4] & 0x80) >> 7) ? 1 : 0;


      
      //数据5 对于酷风 0-制冷；1-抽湿；2-自动；3-制热；4-送风；5-待机；6-除湿再热；7-自动除湿；
      // 需要做映射到普通空调 1: 自动，2：制冷 3：抽湿 4：制热 5：送风
      if(info[5] == 0) { // 制冷
        tmp.mode = 2
      } else if(info[5] == 1) { // 抽湿
        tmp.mode = 3
      } else if(info[5] == 2) { // 自动
        tmp.mode = 1
      } else if(info[5] == 3) { // 抽湿
        tmp.mode = 4
      } else if(info[5] == 4) { // 送风
        tmp.mode = 5
      } else if(info[5] == 5) { // 除湿再热；
        tmp.mode = ""
      } else if(info[5] == 6) { // 除湿再热；
        tmp.mode = 6
      } else if(info[5] == 7) { // 除湿再热；
        tmp.mode = 7
      } else {
        tmp.mode = 1
      }


      console.log(info[5],">>>>>mode", tmp.mode)  
      
      // 数据6
      tmp.tempSet2 = (info[6]-30) / 2
      // 数据7
      tmp.windSpeed = info[7]
      // 数据8
      tmp.coolFreeSetHum = info[8]
      // 数据9
      tmp.coolFreePm25 = info[9]
      // 数据10

      // 数据13
      tmp.coolFreeAddHum = info[13]

      // 数据15
      tmp.coolFreeFreshAirMode = info[15]
      // 数据16
      tmp.coolFreeFreshAirWindSpeed = info[16]
      // 数据17
      tmp.coolFreeWaterSwitch = (info[17] & 0x01) ? 1 : 0;
      tmp.coolFreeWaterSavePower = ((info[17] & 0x02) >> 1) ? 1 : 0;
      tmp.coolFreeWaterClean = ((info[17] & 0x04) >> 2) ? 1 : 0;
      tmp.coolFreeWaterTW1 = ((info[17] & 0x08) >> 3) ? 1 : 0;
      tmp.coolFreeWaterElecheat = ((info[17] & 0x10) >> 4) ? 1 : 0;
      tmp.coolFreeWaterTryRunning = ((info[17] & 0x20) >> 5) ? 1 : 0;
      tmp.coolFreeWaterFuncTest = ((info[17] & 0x40) >> 6) ? 1 : 0;
      tmp.coolFreeWaterOuter = ((info[17] & 0x80) >> 7) ? 1 : 0;

      // 数据18
      tmp.coolFreeWaterMode = info[18]
      // 数据19
      tmp.coolFreeWaterTempSet = (info[19] - 50) / 2
      //数据20
      tmp.coolFreeConnectBackWindPanel = (info[20] & 0x01) ? 1 : 0;
      tmp.coolFreeConnectOutWindPanel = ((info[20] & 0x02) >> 1) ? 1 : 0;
      tmp.coolFreeHasLeftRightWind = ((info[20] & 0x04) >> 2) ? 1 : 0;
      tmp.coolFreeHasNowindFeel = ((info[20] & 0x08) >> 3) ? 1 : 0;
      tmp.coolFreeHasFreshAir = ((info[20] & 0x10) >> 4) ? 1 : 0;
      tmp.coolFreeHasAddHum = ((info[20] & 0x20) >> 5) ? 1 : 0;
      tmp.coolFreeHasWaterModule = ((info[20] & 0x40) >> 6) ? 1 : 0;      
      
      //数据21
      tmp.coolFreeOneKeyOptimiseTempSet = info[21];
      //数据22
      tmp.coolFreeOneKeyOptimiseHumSet = info[22];
      //数据23
      tmp.coolFreeOneKeyOptimiseWindSpeedSet = info[23];
      //数据24
      tmp.coolFreeWaterTankTempSet = info[24]
      //数据25
      tmp.timingOnSwitch = (info[25] & 0x01) ? 1 : 0;
      tmp.timingOffSwitch = ((info[25] & 0x02) >> 1) ? 1 : 0;
      tmp.coolFreeTimingUsable = ((info[25] & 0x04) >> 2) ? 1 : 0;
      tmp.coolFreeStopWarm = ((info[25] & 0x08) >> 3) ? 1 : 0;
      tmp.coolFreeCosySleep = ((info[25] & 0x30) >> 4);
      tmp.coolFreeECO = ((info[25] & 0x40) >> 5) ? 1 : 0;
      tmp.coolFreeSuperCooling = ((info[25] & 0x80) >> 6) ? 1 : 0;      

      //数据26      
      tmp.timingOnValue = ((info[28]&0x0f)<<8) | (info[26])
      tmp.timingOnHour = Math.floor(tmp.timingOnValue/60)
      tmp.timingOnMinute = tmp.timingOnValue%60

      tmp.timingOffValue = ((info[28]&0xf0)<<4) | (info[27])
      tmp.timingOffHour = Math.floor(tmp.timingOffValue/60)
      tmp.timingOffMinute = tmp.timingOffValue%60

      console.log(tmp.timingOffValue,tmp.timingOnValue,"数据26定时时间解析",info[27]&0xff);
      
      // 数据29
      tmp.coolFreeUpdownDirect = info[29]&0x0f;
      tmp.coolFreeLeftRightDirect = info[29]&0xf0>>4;

      // 数据30 - 36是服务器数据不需要解,赋值为0
      tmp.coolFree1HourCosySleep = 0;
      tmp.coolFree2HourCosySleep = 0;
      tmp.coolFree3HourCosySleep = 0;
      tmp.coolFree4HourCosySleep = 0;
      tmp.coolFree5HourCosySleep = 0;
      tmp.coolFree6HourCosySleep = 0;
      tmp.coolFree7HourCosySleep = 0;
      tmp.coolFree8HourCosySleep = 0;
      tmp.coolFree9HourCosySleep = 0;
      tmp.coolFree10HourCosySleep = 0;
      
      tmp.coolFree1HourCosySleepDot = 0;
      tmp.coolFree2HourCosySleepDot = 0;
      tmp.coolFree3HourCosySleepDot = 0
      tmp.coolFree4HourCosySleepDot = 0;
      tmp.coolFree5HourCosySleepDot = 0;
      tmp.coolFree6HourCosySleepDot = 0;
      tmp.coolFree7HourCosySleepDot = 0;
      tmp.coolFree8HourCosySleepDot = 0;
      tmp.coolFreeCosySleepUsableHour = 0;
      tmp.coolFree9HourCosySleepDot = 0;
      tmp.coolFree10HourCosySleepDot = 0;
      tmp.coolFreeSound = 0;
      tmp.coolFreeFreshAirSterilize = 0;
      // 数据37
      tmp.coolFreeDehumType = (info[37] & 0x03);
      tmp.coolFreeHasAllTime = 0;
      tmp.coolFreeShowAllTime = 0;
      tmp.coolFreeAllTimeSwitch = 0;
      tmp.coolFreeDealdehyde = ((info[37] & 0x20) >> 4) ? 1 : 0;       

    
      this.acceptingState = Helper.clone(tmp);

      console.log("解析酷风 查询返回 ", this.acceptingState);

      //设置状态与接收状态同步
      this.stateSynchronizationForClassic(false);
      
    }


  }

  //经典协议 设置状态与接收状态同步
  stateSynchronizationForClassic(isAutoUpload) {
    this.stateSynchronization(isAutoUpload, this.acceptingState, this.sendingState, this.noneAutoUploadAttributeClassic);
  }

  //新协议 设置状态与接收状态同步
  stateSynchronizationForNew(isAutoUpload) {
    this.stateSynchronization(isAutoUpload, this.newacceptingState, this.newsendingState, this.noneAutoUploadAttributeNew);
  }

  stateSynchronization(isAutoUpload, acceptingState, sendingState, ingnoreList) {
    for (let key in sendingState) {
      if (isAutoUpload) {
        for (let i = 0; i < ingnoreList.length; i++) {
          if (key != ingnoreList[i]) {
            if (acceptingState[key] !== "") {
              sendingState[key] = acceptingState[key];
            }
          }
        }
      } else {
        if (acceptingState[key] !== "") {
          sendingState[key] = acceptingState[key];
        }
      }

    }

    return sendingState;
  }

  changeTempC(tempF, isSending) {
    let tempC = 17;

    if (isSending) {
      for (let i = 0; i < tempArray.length; i++) {
        if (tempArray[i][1] == tempF) {
          tempC = tempArray[i][0];
          break;
        }
      }
    } else {
      tempC = tempDictF2C[tempF + ''] !== undefined ? tempDictF2C[tempF + ''] : 17;
    }
    return tempC;
  }

  changeTempF(tempC) {
    let tempF = tempDictC2F[tempC + ''] !== undefined ? tempDictC2F[tempC + ''] : 62;
    return tempF;
  }

  /**酷风 */
  getAcMsg(bodyData,isCtrl) {
    let bodyLength = bodyData.length;
    let msgLength = bodyLength + 0x0A + 1;
    let msgBytes = [];
    for(let i = 0; i < msgLength; i++) {
      msgBytes[i] = 0;
    }

    // 构造消息部分
    msgBytes[0] = 0xAA;

    msgBytes[1] = bodyLength + 0x0A;

    msgBytes[2] = 0xAC;

    msgBytes[8] = 0x02;
    if(isCtrl) {
      msgBytes[9] = 0x02; // 表示控制
    } else {
      msgBytes[9] = 0x03; // 表示查询
    }    


    for(let i = 0; i < bodyLength; i++) {
      msgBytes[i + 0x0A] = bodyData[i]
    }

    console.log('msgBytes',msgBytes, 'bodydata:', bodyData , msgLength , msgBytes.length);    
    // msgBytes[msgLength-1] = this.makeSum(msgBytes.slice(0,msgBytes.length-1),msgBytes.length-1);
    msgBytes[msgLength-1] = 0x3d;

    console.log(msgBytes, this.makeSum(msgBytes.slice(0,msgBytes.length-1),msgBytes.length-1))

    return msgBytes;
    
  }

  coolFreeModeMap(_modeIndex) {
    let modeIndex = 2;
    if (_modeIndex == 1) {
      modeIndex = 2     
    } else if(_modeIndex == 2) {
      modeIndex = 0      
    } else if(_modeIndex == 3) {
      modeIndex = 1      
    } else if(_modeIndex == 4) {
      modeIndex = 3      
    } else if(_modeIndex == 5) {
      modeIndex = 4      
    }
    return modeIndex;
  }

}
