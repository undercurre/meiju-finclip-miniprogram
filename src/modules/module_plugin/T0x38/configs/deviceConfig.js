// import getEnv from '../../../../utils/getEnv'

export default {
  /**
   * 状态显示
   */
    x9SelfCleanModeList:[//模式
      {
        key: "selfClean_and_wind",
        value: 0,
        title: "自清洁+风干"
      },
      {
        key: "selfClean",
        value: 1,
        title: "仅自清洁",
      }
    ],
    suctionList:[//速吸挡位
      {
        value: "0%",
        type: "速吸挡位",
        sliderValue: 0
        
      },
      {
        value: "10%",
        type: "速吸挡位",
        sliderValue: 1
      },
      {
        value: "20%",
        type: "速吸挡位",
        sliderValue: 2
      },
      {
        value: "30%",
        type: "速吸挡位",
        sliderValue: 3
      },
      {
        value: "40%",
        type: "速吸挡位",
        sliderValue: 4
      },
      {
        value: "50%",
        type: "速吸挡位",
        sliderValue: 5
      },
      {
        value: "60%",
        type: "速吸挡位",
        sliderValue: 6
      },
      {
        value: "70%",
        type: "速吸挡位",
        sliderValue: 7
      },
      {
        value: "80%",
        type: "速吸挡位",
        sliderValue: 8
      },
      {
        value: "90%",
        type: "速吸挡位",
        sliderValue: 9
      },
      {
        value: "100%",
        type: "速吸挡位",
        sliderValue: 10
      },
    ],
    waterList:[//X9水量
      {
        value: "最小",
        type: "清扫水量",
        sliderValue: 0
      },
      {
        value: "偏小",
        type: "清扫水量",
        sliderValue: 1

      },
      {
        value: "适中",
        type: "清扫水量",
        sliderValue: 2
      },
      {
        value: "偏大",
        type: "清扫水量",
        sliderValue: 3
      },
      {
        value: "最大",
        type: "清扫水量",
        sliderValue: 4
      },
    ],

    x10AutoWaterList: [//X10自动水量调试
      {
        value: "清扫水量 最小",
        type: "自动",
        sliderValue: 0
      },
      {
        value: "清扫水量 偏小",
        type: "自动",
        sliderValue: 1

      },
      {
        value: "清扫水量 适中",
        type: "自动",
        sliderValue: 2
      },
      {
        value: "清扫水量 偏大",
        type: "自动",
        sliderValue: 3
      },
      {
        value: "清扫水量 最大",
        type: "自动",
        sliderValue: 4
      },
    ],

    x10BrushSpeedList:[
      {
        value: "舒适",
        type: "滚刷速度",
        sliderValue: 0
      },
      {
        value: "适中",
        type: "滚刷速度",
        sliderValue: 1

      },
      {
        value: "强力",
        type: "滚刷速度",
        sliderValue: 2
      },
      {
        value: "舒适",
        type: "滚刷速度",
        sliderValue: 0
      },
      {
        value: "适中",
        type: "滚刷速度",
        sliderValue: 1

      },
      {
        value: "超强",
        type: "滚刷速度",
        sliderValue: 3
      },
    ],

    x10FixedWaterList: [//定点模式水量 80 100 120
      {
        value: "清扫水量 小",
        type: "定点",
        sliderValue: 0
      },
      {
        value: "清扫水量 中",
        type: "定点",
        sliderValue: 1

      },
      {
        value: "清扫水量 大",
        type: "定点",
        sliderValue: 2
      },
    ],
    x10SlefPowerVales: [
      {
        "level": 1,
        "pushForward": 190,
        "pullBack": 56,
        "flag": 0
      },
      {
        "level": 2,
        "pushForward": 185,
        "pullBack": 39,
        "flag": 0
      },
      {
        "level": 3,
        "pushForward": 180,
        "pullBack": 20,
        "flag": 1
      },
      {
        "level": 4,
        "pushForward": 100,
        "pullBack": 15,
        "flag": 0
      },
      {
        "level": 5,
        "pushForward": 77,
        "pullBack": 10,
        "flag": 0
      }
    ],

    x11AutoModeParams: [
      {
        contentTitle: '清扫水量',
        waterPumcontent: '水量小水渍残留少，但清洗效果会减弱',
        scales: [{'title': '小', value: 30},{'title': '大', value: 60}],
        step: 10,
        currentValue: 30,
        min: 30,
        max: 60,
        modelStyles: ['小', "大"],
        type: 1
      },
      {
        contentTitle: '滚刷转速',
        waterPumcontent: '滚刷转速高清洁能力强，但寿命减短噪音大',
        scales: [{'title': '舒适', value: 60},{'title': '强力', value: 100}],
        step: 1,
        currentValue: 80,
        min: 60,
        max: 100,
        modelStyles: ['舒适',"强力"],
        type: 2
      },
    ],
    x11FastModeParams: [
      {
        contentTitle: '吸力档位',
        waterPumcontent: '档位越高吸力越大，但噪音相应增大',
        scales: [{'title': '小', value: 36},{'title': '大', value: 54}],
        step: 1,
        currentValue: 36,
        min: 36,
        max: 54,
        modelStyles: ['低', "高"],
        type: 1
      },
      {
        contentTitle: '滚刷转速',
        waterPumcontent: '滚刷转速高清洁能力强，但寿命减短噪音大',
        scales: [{'title': '舒适', value: 60},{'title': '强力', value: 100}],
        step: 1,
        currentValue: 80,
        min: 60,
        max: 100,
        modelStyles: ['舒适',"强力"],
        type: 2
      },
    ],
    x11StrongModeParams: [
      {
        contentTitle: '清扫水量',
        waterPumcontent: '水量大去污能力好但水迹多，根据使用环境调节',
        scales: [{'title': '小', value: 60},{'title': '大', value: 120}],
        step: 10,
        currentValue: 60,
        min: 60,
        max: 120,
        modelStyles: ['小', "大"],
        type: 1
      },
      {
        contentTitle: '滚刷转速',
        waterPumcontent: '滚刷转速高清洁能力强，但寿命减短噪音大',
        scales: [{'title': '舒适', value: 60},{'title': '强力', value: 100}],
        step: 1,
        currentValue: 80,
        min: 60,
        max: 100,
        modelStyles: ['舒适',"强力"],
        type: 2
      },
    ],
    //设备基础状态
    deviceStatus: {
      'charging': '充电中',
      'charge_finish': '充电完成',
      'standby': '待机',
      'auto': '自动模式',
      'fixed_point': '定点模式',
      'fast': '速吸模式',
      'upright': '暂停',
      'clean_status_check_step': '状态检测',
      'clean_roll_brush_step': '滚刷清洗',
      'clean_pipeline_step': '管道清洗',
      'clean_smart_check_step': '智能检测',
      'clean_deep_clean_step': '深度清洁',
      'baking_dry': '烘干中',
      'brush_air_drying': '风干中',
      'clean_dry_finish': '清理完成',
      'clean_finish_step': '清理完成',
      'clean_dry_shutdown_step': '清理关闭',
      'clean_shutdown_step': '清理关闭',
      'exception': '异常',
    },

    // 自清洁状态
    selfCleanStatusList:[
      'clean_status_check_step',//自清洁-状态检测
      'clean_roll_brush_step',////自清洁-滚刷清洗
      'clean_pipeline_step',//自清洁-管道清洗
      'clean_smart_check_step',//自清洁-智能检测
      'clean_deep_clean_step',//自清洁-深度清洁
      'clean_dry_finish',//清理完成
      'clean_finish_step',//清理完成
      'brush_air_drying',//自清洁-风干
      'baking_dry',//自清洁-烘干
    ],


    
  
}