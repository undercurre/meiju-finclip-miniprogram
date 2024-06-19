/**
 * Created by liujim on 2017/9/11.
 */

import Parser from "./Parser";
import Helper from "../../util/Helper"
import {CMD, STATUS} from "./Data";
import RuleEngine from "./rule-engine/Entry"

export default class Process {
  constructor() {
    this.parser = new Parser();
    this.ruleEngine = new RuleEngine(STATUS, CMD);
    this.currentFrameOrder = 1;
    this.hasSoundClassique = true;

    this.B5CMD = {
      fisrt: [0xaa, 0x0e, 0xac, 0x00, 0x00, 0x00, 0x00, 0x00, 0x03, 0x03, 0xb5, 0x01, 0x00, 0x4d, 0x3d],
      second: [0xaa, 0x0f, 0xac, 0x00, 0x00, 0x00, 0x00, 0x00, 0x03, 0x03, 0xb5, 0x01, 0x01, 0x01, 0x21, 0x66]
    };
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

      return this.parser.compositeNewProtocolPkg_Group(CMD.QUERYSTATUS, tmp, 0xac, []);
    }
    return codePackage;
  }

  /*
  * query status with group
  * inspire by C1 command
  * */
  makeQueryPackageWithC1(groupNum) {
    let srcBuf = Helper.clone(STATUS.curInfoQuery_Ex_t);
    srcBuf.sound = 0;
    srcBuf.optCommand = 3;
    srcBuf.order = this.currentFrameOrder;
    srcBuf.optVal.queryStat = 2;
    let codePackage = this.parser.stdAirConEx_pro2byte_check(groupNum, 0xac, srcBuf);
    return codePackage;
  }

  /*
  * params -> JSON -> {attr: attr_value}
  * */
  makeStandardProtocolPackage(setting) {
    let srcBuf = this.parser.sendingState;

    for (let key in setting) {
      if (srcBuf[key] != undefined) {
        srcBuf[key] = setting[key];
      }
    }

    //规则引擎-maybe you can do somthing wonderful
    //this.ruleEngine.startup("controlDeviceOnAndOff", "on", {"standardProtocolStatusSet": this.parser.sendingState, "newProtocolStatusSet": this.parser.newsendingState});

    return this.configSendPackage(srcBuf);
  }

  /*
   * params -> JSON -> {attr: attr_value}
   * */
  makeNewProtocolPackage(setting, hasSound, cmdOrder) {
    let _hasSound = hasSound !== undefined ? hasSound : true;
    _hasSound && (setting[CMD.CONTROLNEWVERBEEP] = [1]);

    let _cmdOrder = cmdOrder !== undefined ? cmdOrder : [];

    return this.parser.compositeNewProtocolPkg_Group(CMD.SETSTATUS, setting, 0xac, _cmdOrder);
  }

  parseAcceptPackage(data) {
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

  /***********************************************Common funcs***********************************************/
  configSendPackage(srcBuf) {
    if (this.hasSoundClassique) {
      this.currentFrameOrder++;
      if (this.currentFrameOrder > 255) {
        this.currentFrameOrder = 1;
      }
      srcBuf.order = this.currentFrameOrder;
      // srcBuf.btnSound = 0;
    }

    return this.parser.stdAirConEx_pro2byte_set(CMD.CMDTYPE_SET, 0xAC, srcBuf);
  }

}
