/**
 * Created by liujim on 2017/9/11.
 */

import Parser from "./Parser";
import Helper from "./Helper"
import {CMD, STATUS} from "./Data";
import Common from "./common";
import BleCommon from '../bluetooth/common'

export default class SendOrder {
  constructor() {
    this.parser = new Parser();
    this.currentFrameOrder = 1;
    this.hasSoundClassique = true;    
  }

  /***********************************************Demo code***********************************************/
  debugFuncs() {
    //demo code
    //return this.makeQueryPackage();
    //return this.makeQueryPackage({CONTROLSWITCHPRECOLDHEAT:"", CONTROLSWITCHNOWINDFEEL:"", REQUESTINTELLIGENTCONTROLSTATUS_1:"", REQUESTINTELLIGENTCONTROLSTATUS_2:"", REQUESTINTELLIGENTCONTROLSTATUS_3:"", REQUESTINTELLIGENTCONTROLSTATUS_4:""});
    return this.makeStandardProtocolPackage({runStatus: (!this.parser.sendingState.runStatus ? 1 : 0)});
  }

  /***********************************************Interface***********************************************/

  /*
  *  params -> newProtocolCMDs -> [cmd1, cmd2, ...];
  * */
  makeQueryPackage(newProtocolCMDs) {
    //standard protocol
    let srcBuf = Helper.clone(STATUS.curInfoQuery_Ex_t);
    srcBuf.sound = 0;
    srcBuf.optCommand = 3;
    srcBuf.order = this.currentFrameOrder;
    srcBuf.optVal.queryStat = 2;
    let codePackage = this.parser.stdAirConEx_pro2byte_check(CMD.CMDTYPE_QUERY_INFO, 0xac, srcBuf);

    //new protocol
    if (newProtocolCMDs != undefined) {
      let tmp = {};

      for (let key in newProtocolCMDs) {
        tmp[key] = newProtocolCMDs[key] !== "" ? parseInt(newProtocolCMDs[key]) : 0;
      }

      console.log(tmp,"newProtocolCMDs");
      return this.parser.compositeNewProtocolPkg_Group(CMD.QUERYSTATUS, tmp, 0xac, []);
    }
    return codePackage;
  }

  
  /*
  * params -> JSON -> {attr: attr_value}
  * */
  makeStandardProtocolPackage(setting) {
    let srcBuf = this.parser.sendingState;
    if (!setting.timingIsValid) {
      setting.timingIsValid = 0;
    }

    if (!setting.elecHeatForced) {
      setting.elecHeatForced = 0;
    }

    for (let key in setting) {
      if (srcBuf[key] != undefined) {
        srcBuf[key] = setting[key];
      }
    }

   
    return this.configSendPackage(CMD.CMDTYPE_SET,srcBuf);
  }

  /*
   * params -> JSON -> {attr: attr_value}
   * */
  makeNewProtocolPackage(setting, hasSound, cmdOrder) {    
    let _hasSound = hasSound !== undefined ? hasSound : true;
    console.log('hassound',hasSound,_hasSound);
    setting[CMD.CONTROLNEWVERBEEP] = _hasSound ? [1] : [0];

    let _cmdOrder = cmdOrder !== undefined ? cmdOrder : [];

    return this.parser.compositeNewProtocolPkg_Group(CMD.SETSTATUS, setting, 0xac, _cmdOrder);
  }

  parseAcceptPackage(data) {
    console.log(data,'in sender parsepkg');
    this.parser.unPackForClassical(data);
  }

  // 解包酷风
  parseCoolFreeAcceptPackage(data) {
    this.parser.unPackForCoolFreeClassical(data);
  }

  /*check B5 or C1*/
  isB5Upload(data) {
    return data[10] === 0xb5;
  }

  isC1Upload(data) {
    return data[10] === 0xc1;
  }

  isB5_C1Upload(data) {
    return this.isB5Upload(data) || this.isC1Upload(data);
  }


  /*******************************************COOLFREE************************************************************ */
  makeCoolFreeQueryPackage(newProtocolCMDs) {
    //standard protocol
    let srcBuf = Helper.clone(STATUS.curInfoQuery_Ex_t);
    srcBuf.sound = 0;
    srcBuf.optCommand = 3;
    srcBuf.order = this.currentFrameOrder;
    srcBuf.optVal.queryStat = 2;
    let codePackage = this.parser.stdAirConEx_pro2byte_check(CMD.CMDTYPE_QUERY_COOLFREE, 0xac, srcBuf);

    //new protocol
    if (newProtocolCMDs != undefined) {
      let tmp = {};

      for (let key in newProtocolCMDs) {
        tmp[key] = newProtocolCMDs[key] !== "" ? parseInt(newProtocolCMDs[key]) : 0;
      }

      console.log(tmp,"newProtocolCMDs");
      return this.parser.compositeNewProtocolPkg_Group(CMD.QUERYSTATUS, tmp, 0xac, []);
    }
    return codePackage;
  }

  /*
  * params -> JSON -> {attr: attr_value}
  * */
  makeCoolFreeStandardProtocolPackage(setting) {
    let srcBuf = this.parser.sendingState;
    if (!setting.timingIsValid) {
      setting.timingIsValid = 0;
    }

    if (!setting.elecHeatForced) {
      setting.elecHeatForced = 0;
    }

    for (let key in setting) {
      if (srcBuf[key] != undefined) {
        srcBuf[key] = setting[key];
      }
    }

    // let tmp = BleCommon.fromHexString('AA38AC00000000000202AA2E00FFFF200140000000025266320000000032000128000064005232660000000000000000000000000800AF7D18')

    // let result = Array.from(tmp)
    // console.log( BleCommon.fromHexString('AA38AC00000000000202AA2E00FFFF200140000000025266320000000032000128000064005232660000000000000000000000000800AF7D18'),"---------------",this.configSendPackage(CMD.CMDTYPE_SET_COOLFREE,srcBuf),'--------------',result)
    // return result;
    return this.configSendPackage(CMD.CMDTYPE_SET_COOLFREE,srcBuf);
  }



  /***********************************************Common funcs***********************************************/
  configSendPackage(type,srcBuf) {
    if (this.hasSoundClassique) {
      this.currentFrameOrder++;
      if (this.currentFrameOrder > 255 || this.currentFrameOrder == 0) {
        this.currentFrameOrder = 1;
      }
      srcBuf.order = this.currentFrameOrder;
      // srcBuf.btnSound = 1;
    }

    return this.parser.stdAirConEx_pro2byte_set(type, 0xAC, srcBuf);
  }

}
