/*
 * @Author: Xiangfeng.Zhou
 * @Date: 2021-02-24 18:33:58
 * @LastEditTime: 2021-04-15 09:41:48
 * @FilePath: /weex-kh-widgets/src/widgets/T0xE1/config/page-config/common.js
 * @Description:  基础配置文件
 */
export default {
  more: {
    // lock:1,//是否有童锁
    // waterEl:{water:1,el:1},//水电统计
    // salt:{enable:1},//是否有软水盐
    // bright:{enable:1},//是否有亮碟剂
    // purifier:0,//是否有净水洗
    // aiHelper:0,//是否有智能助手
    // // nfc:[{value:'purchase',name:'耗材购买'},{value:'old_mode',name:'老人模式'}],//更多中是否包含NFC选项功能
    // ota:0,
  },
  setting: {
    // autoTimeType:1,//智能洗阶段显示时间类型：0  1
    // keepStartNow:1,//保管是否可立即启动
    // keepSetTime:1,//保管是否可设置时间
    // keepTimeType: 0,//保管时间显示类型 0 : 1-72 小时   1 ： 24、72、168 小时   2: 3h,4h,...,23h,1天,2天...7天
    // devOffKeep:1,
    // dryStartNow:0,//烘干是否可立即启动
    // drySetTime:0,//烘干是否可设置时间
    // dryTimeType: 1,// 0 : 0、1、2小时  1 ：0、2 小时
    // oldMode:0,//是否有老人模式
    // ABVersion:0,//是否有AB版本
    // bookId:'',//说明书筛选ID，多说明书的情况下使用
    // withHour:1,//是否机器预约是以小时为单位
    // withoutScore:1,//评分插件
  },
  text: {
    keep: {
      name: '抑菌储存', //抑菌储存0 || 鲜存1 || 保管2
      desc: '有效去除异味,防霉防返潮(时间可设1~72小时)', //离子杀菌可除异味,防霉防潮(时间可设1~72小时) 1 || 有效去除异味,防霉防返潮(长达72小时) 2|0
    },
    dry: {
      name: '消毒烘干',
      desc: '',
    },
    diy: {
      name: '模式选择', //DIY程序
      TIP_CANCEL_MODE: ['是否结束当前洗涤模式?'],
      TIP_CANCEL_ORDER: ['是否取消当前预约模式?'],
    },
  },
  info: {
    brand: 1, //1 美的 2华凌 8 colmo 其他：比弗利
  },
  modeList: [
    {
      value: 'neutral_gear',
      mode: 0,
      name: '',
      time: '--',
      // temp: 70,
    },
  ],
}
