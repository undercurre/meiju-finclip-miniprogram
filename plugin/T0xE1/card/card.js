const app = getApp()
import { CARD_MODE_OPTION } from '../../../pages/common/js/cardMode'
import { requestService, rangersBurialPoint } from '../../../utils/requestService'
import { getStamp } from 'm-utilsdk/index'
import { openSubscribe } from '../openSubscribe'
import { checkEquipmentFunc, getModeBtnImgList, getModesList, getModes, stageStep } from '../assets/js/setting'
import imgs from '../assets/js/img.js'
import workAniData from '../assets/js/xiwanji'
import computedBehavior from '../../../utils/miniprogram-computed'
import pagesConfigBehavior from '../assets/js/pages-config'
import diffConfig from '../assets/js/diff-config/diff'
import { pluginEventTrack } from '../../../track/pluginTrack'

let queryTimer,
  // errorQueryTimer,
  errorDialogShow = false

const btnMore = ['autoOpen', 'autoThrow', 'moreDry']

Component({
  behaviors: [pagesConfigBehavior, computedBehavior],
  options: {
    multipleSlots: true,
  },
  properties: {
    applianceData: {
      type: Object,
      value: {},
    },
    activeNum: {
      type: Number,
    },
  },
  observers: {},
  computed: {
    curTime() {
      if (!this.data._applianceDataStatus || !this.data._applianceDataStatus.left_time) {
        return ''
      } else {
        return this.data._applianceDataStatus.left_time
      }
    },
    imgs() {
      return imgs
    },
    imgsrc() {
      let src = ''
      if (this.data.deviceStatus == 0 || this.data.deviceStatus == 4) {
        src = imgs.closed
      } else if (this.data.deviceStatus == 3 || this.data.deviceStatus == 12) {
        src = imgs.working
      } else {
        src = imgs.standby
      }
      return src
    },
    aniWorking() {
      if (!this.data._applianceDataStatus || !this.data._applianceDataStatus.operator) {
        return 'paused'
      }
      return this.data._applianceDataStatus.operator == 'start' ? 'running' : 'paused'
    },
    showLock() {
      if (!this.data.pagesConfig || !this.data.deviceStatus) return false
      if (!this.data.pagesConfig.more || !this.data.pagesConfig.more.lock) return false
      if ([-2, -1, 0, 4].includes(this.data.deviceStatus)) {
        return false
      }
      let diff = diffConfig.diffType.withoutLockOnStart
      if ([5, 6].includes(this.data.deviceStatus) && diff.includes(this.properties.applianceData.sn8)) return false
      return true
    },
    kdList() {
      if (!this.data.curMode || !this.data.curMode.more) return []
      let kdList = []
      if (Object.keys(this.data.curMode.more).includes('keep')) kdList.push('keep')
      if (Object.keys(this.data.curMode.more).includes('dry')) kdList.push('dry')
      return kdList
    },
    kdShow() {
      let kdShow = {}
      if (!this.data.deviceStatus || !this.data.curMode || !this.data.curMode.more) return kdShow
      if ([-2, -1, 0, 4, 5, 6].includes(this.data.deviceStatus)) return kdShow
      if (this.data.curMode.more.keep) kdShow.keep = true
      if (this.data.curMode.more.dry) kdShow.dry = true
      return kdShow
    },
    kdTitle() {
      let kdTitle = { keep: '保管', dry: '烘干' }
      if (!this.data.pagesConfig || !this.data.pagesConfig.text) return kdTitle
      if (this.data.pagesConfig.text.keep && this.data.pagesConfig.text.keep.name)
        kdTitle.keep = this.data.pagesConfig.text.keep.name
      if (this.data.pagesConfig.text.dry && this.data.pagesConfig.text.dry.name)
        kdTitle.dry = this.data.pagesConfig.text.dry.name
      return kdTitle
    },
    showCircle() {
      let obj = this.data.pagesConfig
      return !obj || Object.keys(obj).length == 0 || obj == undefined || obj == null
      // !this.calcObjNull(this.data.pagesConfig)
    },
    kdLabel() {
      let kdLabel = { keep: '', dry: '' }
      const { _applianceDataStatus, pagesConfig } = this.data
      if (!_applianceDataStatus || !pagesConfig || !pagesConfig.setting) return kdLabel
      const { airswitch, air_set_hour, air_left_hour, dryswitch } = _applianceDataStatus
      let keepDesc = ''
      let dryDesc = ''
      if (pagesConfig.setting.keepStartNow && !pagesConfig.setting.oldMode) {
        //有立即启动，一定有设置时长
        keepDesc = '可设置' + pagesConfig.text.keep.name + '时长'
      } else {
        if (pagesConfig.setting.keepSetTime) {
          // let curKeepTime = 72
          keepDesc = '可设置' + pagesConfig.text.keep.name + '时长'
          if (airswitch == 0 && air_set_hour != 0) {
            keepDesc = '已设定' + pagesConfig.text.keep.name + '时间：' + air_set_hour + '小时'
          }
          if (airswitch > 0) {
            if (air_left_hour != 0 && dryswitch != 2) {
              keepDesc = pagesConfig.text.keep.name + '中,还剩余: ' + air_left_hour + '小时'
            } else {
              keepDesc = '已设定' + pagesConfig.text.keep.name + '时间：' + air_set_hour + '小时'
            }
          }
        } else {
          keepDesc = pagesConfig.text.keep.desc
          if (airswitch != 0) {
            if (air_left_hour != 0 && dryswitch != 2) {
              keepDesc = pagesConfig.text.keep.name + '中,还剩余: ' + air_left_hour + '小时'
            }
          }
        }
      }
      if (pagesConfig.setting.drySetTime) {
        dryDesc = '可设置' + pagesConfig.text.dry.name + '时长'
      } else {
        dryDesc = '可设置洗涤完成后是否开启' + pagesConfig.text.dry.name
      }
      kdLabel.keep = keepDesc
      kdLabel.dry = dryDesc
      return kdLabel
    },
    kdLink() {
      let kdLink = {}
      if (!this.data.pagesConfig || !this.data.pagesConfig.setting) return kdLink
      // if (this.data.pagesConfig.setting.keepStartNow || this.data.pagesConfig.setting.keepSetTime) kdLink.keep = true 这里的逻辑有一点问题 不确定什么时候显示保管的按钮 现在是keepStartNow为1时有箭头
      if (this.data.pagesConfig.setting.keepStartNow) kdLink.keep = true
      if (this.data.pagesConfig.setting.drySetTime) kdLink.dry = true
      return kdLink
    },
    kdIcon() {
      let kdIcon = {}
      const { pagesConfig } = this.data
      if (!pagesConfig || !pagesConfig.text) return kdIcon
      kdIcon.keep = pagesConfig.text.keep && pagesConfig.text.keep.name.search('消毒') != -1 ? imgs.keep_xd : imgs.keep
      kdIcon.dry = pagesConfig.text.dry && pagesConfig.text.dry.name.search('消毒') != -1 ? imgs.dry_xd : imgs.dry
      return kdIcon
    },
    kdCheck() {
      let kdCheck = { keep: false, dry: false }
      if (!this.data._applianceDataStatus) return kdCheck
      kdCheck.keep = this.data._applianceDataStatus.airswitch == 1
      kdCheck.dry = this.data._applianceDataStatus.dryswitch == 1
      return kdCheck
    },
    kdRightText() {
      let kdRightText = {}
      const { curMode, pagesConfig, _applianceDataStatus } = this.data
      if (!pagesConfig || !curMode || !_applianceDataStatus) return kdRightText
      let setDryTime = ''
      let setKeepTime = ''
      const { dry_set_min, dryswitch, air_set_hour, airswitch } = _applianceDataStatus
      setDryTime = parseInt(dry_set_min / 60) + '小时'
      if (dryswitch) {
        if (!pagesConfig.setting.drySetTime) {
          setDryTime = '洗完启动'
        }
      } else {
        if (parseInt(dry_set_min / 60)) {
        } else {
          setDryTime = '不启动'
        }
      }
      if (air_set_hour != undefined) {
        setKeepTime = air_set_hour
        if (airswitch == 0 && curMode.value != 'keep') {
          setKeepTime = '不启动'
        } else {
          if (pagesConfig.setting.keepTimeType == 2) {
            let totalDay = Math.floor(setKeepTime / 24)
            if (totalDay != 0) {
              setKeepTime =
                totalDay + '天' + (setKeepTime % 24 > 9 ? setKeepTime % 24 : '0' + (setKeepTime % 24)) + '时'
            } else {
              setKeepTime = setKeepTime + '小时'
            }
          } else {
            setKeepTime = setKeepTime + '小时'
          }
        }
      }
      kdRightText.dry = setDryTime
      kdRightText.keep = setKeepTime
      return kdRightText
    },
    moreList() {
      let moreList = []
      if (!this.data.curMode || !this.data.curMode.more) return moreList
      let moreKeys = Object.keys(this.data.curMode.more).filter((item) => {
        return !['dry', 'keep', 'germ'].includes(item) // 保管、烘干不在叠加功能之内，目前排除了germ功能
      })
      const linkList = ['waterLevel', 'waterStrongLevel', 'region', 'additional']
      const checkList = ['autoOpen', 'autoThrow', 'moreDry']
      const moreMap = {
        region: { name: '分层洗', icon: imgs.washRegion },
        additional: { name: '附加功能', icon: imgs.addition },
        waterLevel: { name: '水位', icon: imgs.waterLevel },
        waterStrongLevel: { name: '强度', icon: imgs.waterStrongLevel },
        autoThrow: { name: '智能投放', icon: imgs.autoThrow },
        autoOpen: { name: '自动开门', icon: imgs.autoOpen },
        moreDry: { name: '强烘闪干', icon: imgs.dry },
      }
      moreKeys.forEach((item) => {
        let tempItem = item
        let rightText = ''
        if (linkList.includes(item)) {
          let curVal = this.data.curMode.more[tempItem].curVal
          let valueList = this.data.curMode.more[tempItem].list
          let valueItem = valueList.find((i) => {
            return i.value == curVal
          })
          // if (!valueItem) {
          //   curVal = this.data.pagesConfig.modeList[this.data.curMode.value].more[tempItem].curVal
          //   console.log('checkout calueItem: ' + curVal)
          //   valueItem = valueList.find((i) => {
          //     return i.value == curVal
          //   })
          // }
          rightText = !valueItem ? valueList[0].name : valueItem.name
          this.data.curMode.more[tempItem].curVal = !valueItem ? valueList[0].curVal : curVal
        }
        let moreItem = {
          key: item,
          link: linkList.includes(item),
          name: moreMap[item].name,
          icon: moreMap[item].icon,
          checked: checkList.includes(item) && this.data.curMode.more[item].on ? true : false,
          rightText: rightText,
          desc: '',
        }
        let needValue =
          item == 'autoThrow' && !diffConfig.diffType.autoThrowWithMode.includes(this.properties.applianceData.sn8)
        if (needValue) {
          moreItem.checked = !!this.data._applianceDataStatus.auto_throw
        }
        moreList.push(moreItem)
      })
      return moreList
    },
    brightLackBgColor() {
      const { _applianceDataStatus, deviceStatus } = this.data
      const { bright_lack } = _applianceDataStatus
      // let bright_lack = !_applianceDataStatus.bright_lack
      const isInoperableStatus = deviceStatus == -1 || deviceStatus == 0 || deviceStatus == 4
      let color = bright_lack ? '#F2F2F2' : isInoperableStatus ? '#7C879B' : '#5BD2FF'
      return color
    },
    barBrightColor() {
      let deviceStatus = this.data.deviceStatus
      const isInoperableStatus = deviceStatus == -1 || deviceStatus == 0 || deviceStatus == 4
      return this.data._applianceDataStatus.bright_lack ? '#F2F2F2' : isInoperableStatus ? '#d8d6d6' : '#F8F8F8 '
    },
    softwaterLackBgColor() {
      const { _applianceDataStatus, deviceStatus } = this.data
      const { softwater_lack } = _applianceDataStatus
      const isInoperableStatus = deviceStatus == -1 || deviceStatus == 0 || deviceStatus == 4
      return softwater_lack ? '#F2F2F2' : isInoperableStatus ? '#7C879B' : '#5BD2FF'
    },
    barSoftWaterColor() {
      let deviceStatus = this.data.deviceStatus
      const isInoperableStatus = deviceStatus == -1 || deviceStatus == 0 || deviceStatus == 4
      return this.data._applianceDataStatus.softwater_lack ? '#F2F2F2' : isInoperableStatus ? '#d8d6d6' : '#F8F8F8 '
    },
    isInoperableStatus() {
      const { deviceStatus } = this.data
      return deviceStatus == -1 || deviceStatus == 0 || deviceStatus == 4
    },
    saveBucketOfWater() {
      return parseInt(this.data.waterSaved / 18.9)
    },
    operatorImgSrc() {
      const { deviceStatus, _applianceDataStatus } = this.data
      const { operator } = _applianceDataStatus
      let img = imgs.start
      if (deviceStatus == 1) {
        img = imgs.start
      } else if (deviceStatus == 3 || deviceStatus == 12) {
        img = operator == 'start' ? imgs.pause : imgs.start
      } else if (deviceStatus == 2) {
        img = imgs.stop
      }
      return img
    },
  },
  data: {
    uuid: '',
    errtext: '',
    isInited: false,
    pagesConfig: {}, // 配置表 用sn8和电控版本得到
    deviceVersion: 0, // 电控版本 根据sn8得到
    deviceStatus: -2, // 机器状态 通过上报来的字段来判断
    _applianceDataStatus: {}, // 上报的数据每次查询的时候更新
    bannerData: {}, // 表盘数据 每次上报数据时更新
    curMode: {}, // 当前模式 每次上报数据时或者选择模式时更新
    lastMode: {}, // 上一个选中的模式 刚进入页面 用缓存确认 已经进入页面了就 用上次选择的模式确认
    storageMode: {}, // 缓存中的模式 刚进入页面的时候获取

    showMode: false, // 选择器相关 模式选择器
    curModeIndex: [1], // 选择器相关 初始化模式选择器中的模式
    modeArray: [[1, 2, 3]], // 选择器相关 模式列表
    showKDM: false, // 选择器相关 保管、烘干、更多功能选择器
    kdmIndex: [], // 选择器相关 初始化保管、烘干、更多功能
    kdmArray: [], // 选择器相关 保管、烘干、更多功能列表,
    kdmPickerType: '', // 选择器相关 确定保管、烘干、更多功能选择器
    kdmUnits: [],
    moreFuncKey: '', // 选择了哪个叠加模式的key
    consumablesPath: '', // 耗材链接
    curVersion: 0, // 当前版本

    // 用电用水用到的数据 暂时没看懂
    waterJson: {
      x: {
        value: [1, 2, 3, 4, 5, 6, 7],
        label: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      },
      y: [
        {
          maxValue: [0, 0, 0, 0, 0, 0, 0], //实际显示的bar高度
          value: [0, 0, 0, 0, 0, 0, 0], //设置了value底部标签线的刻度才有效，value的值需要小于maxValue,否则顶部圆角失效
          // "label": ["1次", "6次", "2次", "1次", "2次", "3次", "7次"],
          title: '',
          color: '#7edaff', //柱子颜色
          maxColor: '#7edaff', //柱子后面颜色ARGB格式  v5.8.0
          maxHighLightColor: '#7edaff', //高亮颜色 v5.8.0
          background: '#ffffff',
          highLightColor: '#7edaff',
          highLightEnable: true, //点击高亮是否可用 v5.8.0
        },
      ],
      xAxisColor: '#F2F2F2', //x轴线的颜色，如果不设置，则默认是白色线
      xAxisLabelColor: '#8A8A8F', //x label的字体颜色，如果不设置，则默认是白色线
      yAxisColor: '#FFFFFF', //y轴线的颜色，如果不设置，则默认是白色线
      yAxisLabelColor: '#8A8A8F', // label的字体颜色，如果不设置，则默认是白色线
      background: '#FFFFFF', //不传，则默认使用透明背景
      borderRadius: '5',
      // "barSpacing" : "30", //设置柱状图最小间距。间距默认为控件宽度/（柱状个数 * 2 + 1），如果默认间距小于最小间距，则使用最小间距。
      barWidth: '10',
      barTouchTop: true,
      description: '',
      legend: {
        position: 'TOP_LEFT', //"TOP_LEFT"/"TOP_RIGHT"
        orientation: 'HORIZONTAL', //"HORIZONTAL"/"BOTTOM_RIGHT"
        show: false, //控制每组数据标识的显示或隐藏
      },

      unit: {
        x: '',
        xTextSize: 0,
        xPaddingTop: 20,
        xPaddingBottom: 0,
        y: '',
        yTextSize: 0,
        yPaddingTop: 6,
        yPaddingBottom: 0,
      },

      bottomBorderRadius: '5', //底部的圆角值  v5.8.0
      signPost: {
        //底部界面  v5.8.0
        lineHeight: 1, //线条的高度
        lineColor: '#E5E5E8', //标签线的颜色 如果不设置，则默认是黑色线
        linePointRadius: 2, //标签线上圆点的半径, 默认10
        lineMarginTop: '5', //线条距离X轴的距离
        lineMarginBottom: '0',
        cursorColor: '#7edaff', //标签（三角形）的颜色 如果不设置，则默认是黑色线
        cursorMarginTop: '0', //标签（三角形）距离线条的距离
        cursorHigh: '30', //标签（三角形）本身高度
        cursorMarginBottom: '0',
        show: true, //默认是 false 是否显示底部界面
        showType: 'all',
        isSelectedDisappear: true,
        isSelectedShake: true, //选择后是否支持震动，默认不支持 （5.10）
      },

      yAxisGridLine: true, //是否显示Y轴上的水平线 （5.10）
      xAxisGridLine: false, //是否显示X轴上的水平线  （5.10）
      axisGridColor: '#F2F2F2', //X/Y轴上的水平/竖直方向线颜色 （5.10）
      xAxisLabelHighLightColor: '#000000', //x轴刻度选择后颜色（5.10）
      xAxisLabelHighLightThicke: true, //x轴刻度选择后字体是否加粗（5.10）
      yGraduationLabel: 'L', //y轴的刻度单位（5.10）
      barSelectIndex: 0,
      yAxisLabelCount: 5, //安卓属性，强制显示 y轴的刻度数量（5.10）
    },
    electJson: {
      x: {
        value: [1, 2, 3, 4, 5, 6, 7],
        label: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      },
      y: [
        {
          maxValue: [0, 0, 0, 0, 0, 0, 0], //实际显示的bar高度
          value: [0, 0, 0, 0, 0, 0, 0], //设置了value底部标签线的刻度才有效，value的值需要小于maxValue,否则顶部圆角失效
          // "label": ["1次", "6次", "2次", "1次", "2次", "3次", "7次"],
          title: '',
          color: '#7edaff', //柱子颜色
          maxColor: '#7edaff', //柱子后面颜色ARGB格式  v5.8.0
          maxHighLightColor: '#7edaff', //高亮颜色 v5.8.0
          background: '#ffffff',
          highLightColor: '#7edaff',
          highLightEnable: true, //点击高亮是否可用 v5.8.0
        },
      ],
      xAxisColor: '#F2F2F2', //x轴线的颜色，如果不设置，则默认是白色线
      xAxisLabelColor: '#8A8A8F', //x label的字体颜色，如果不设置，则默认是白色线
      yAxisColor: '#FFFFFF', //y轴线的颜色，如果不设置，则默认是白色线
      yAxisLabelColor: '#8A8A8F', // label的字体颜色，如果不设置，则默认是白色线
      background: '#FFFFFF', //不传，则默认使用透明背景
      barWidth: '10',
      borderRadius: '5',
      // "barSpacing" : "30", //设置柱状图最小间距。间距默认为控件宽度/（柱状个数 * 2 + 1），如果默认间距小于最小间距，则使用最小间距。
      barTouchTop: true,
      description: '',
      legend: {
        position: 'TOP_LEFT', //"TOP_LEFT"/"TOP_RIGHT"
        orientation: 'HORIZONTAL', //"HORIZONTAL"/"BOTTOM_RIGHT"
        show: false, //控制每组数据标识的显示或隐藏
      },

      unit: {
        x: '',
        xTextSize: 0,
        xPaddingTop: 20,
        xPaddingBottom: 0,
        y: '',
        yTextSize: 0,
        yPaddingTop: 6,
        yPaddingBottom: 0,
      },

      bottomBorderRadius: '5', //底部的圆角值  v5.8.0
      signPost: {
        //底部界面  v5.8.0
        lineHeight: 1, //线条的高度
        lineColor: '#E5E5E8', //标签线的颜色 如果不设置，则默认是黑色线
        linePointRadius: 2, //标签线上圆点的半径, 默认10
        lineMarginTop: '5', //线条距离X轴的距离
        lineMarginBottom: '0',
        cursorColor: '#7edaff', //标签（三角形）的颜色 如果不设置，则默认是黑色线
        cursorMarginTop: '0', //标签（三角形）距离线条的距离
        cursorHigh: '30', //标签（三角形）本身高度
        cursorMarginBottom: '0',
        show: true, //默认是 false 是否显示底部界面
        showType: 'all',
        isSelectedDisappear: true,
        isSelectedShake: true, //选择后是否支持震动，默认不支持 （5.10）
      },

      yAxisGridLine: true, //是否显示Y轴上的水平线 （5.10）
      xAxisGridLine: false, //是否显示X轴上的水平线  （5.10）
      axisGridColor: '#F2F2F2', //X/Y轴上的水平/竖直方向线颜色 （5.10）
      xAxisLabelHighLightColor: '#000000', //x轴刻度选择后颜色（5.10）
      xAxisLabelHighLightThicke: true, //x轴刻度选择后字体是否加粗（5.10）
      yGraduationLabel: '度', //y轴的刻度单位（5.10）
      barSelectIndex: 0, //选中Bar的index(从0开始)，默认没有选中态（5.10）
      yAxisLabelCount: 5, //安卓属性，强制显示 y轴的刻度数量（5.10）
    },
    //每个月的天数是不定的，月的xValue实际看程序
    tabWater: [
      {
        name: '7天',
        selected: true,
        xLabel: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        xValue: [1, 2, 3, 4, 5, 6, 7],
      },
      {
        name: '1个月',
        selected: false,
        xLabel: ['1', '5', '10', '15', '20', '25', '31'],
        xValue: [
          1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
        ],
      },
      {
        name: '1年',
        selected: false,
        xLabel: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12月'],
        xValue: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      },
    ],
    tabElect: [
      {
        name: '7天',
        selected: true,
        xLabel: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        xValue: [1, 2, 3, 4, 5, 6, 7],
      },
      {
        name: '1个月',
        selected: false,
        xLabel: ['1', '5', '10', '15', '20', '25', '31'],
        xValue: [
          1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
        ],
      },
      {
        name: '1年',
        selected: false,
        xLabel: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12月'],
        xValue: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      },
    ],
  },
  pageLifetimes: {
    show: function () {
      rangersBurialPoint('user_page_view', {
        page_path: 'plugin/T0xE1/card/card',
        module: '插件',
        page_id: 'page_control',
        page_name: '洗碗机插件首页',
        object_type: '',
        object_id: '',
        object_name: '',
        device_info: {},
      })
      if (this.data.isInited) this.query()
    },
  },
  lifetimes: {
    async attached() {
      wx.showLoading({
        title: '加载中',
      })
      await this.initPagesConfig()
      await this.query()
      // wx.hideLoading()
    },
  },
  observers: {},
  methods: {
    goBuy() {
      this.eventTrack({
        page_id: 'page_control',
        page_name: '插件首页',
        widget_id: 'click_buy',
        widget_name: '购买按钮',
      })
      console.log('checkout go buy: ' + this.data.consumablesPath)
      wx.navigateToMiniProgram({
        appId: 'wx255b67a1403adbc2',
        path: this.data.consumablesPath || '/page/web_view_promote/web_view_promote?id=2372',
      })
    },
    eventTrack(param = {}) {
      setTimeout(() => {
        pluginEventTrack('user_behavior_event', null, param)
      }, 0)
    },
    getActived() {
      this.setData({ uuid: app.globalData.userData.uid })
      if (queryTimer) {
        clearInterval(queryTimer)
      }
      queryTimer = setInterval(() => {
        this.query()
      }, 4000)
      this.inquireWater('month')
      this.inquireElect('month')
      this.getConsumablesInfo()
      this.query()
    },
    // 初始化配置表 这里的电控版本均为0 美的牌不能获取
    async initPagesConfig() {
      let sn8 = this.properties.applianceData.sn8
      let version = 0
      await requestService
        .request('luaGet', {
          applianceCode: this.properties.applianceData.applianceCode,
          command: {},
          reqId: getStamp().toString(),
          stamp: getStamp(),
        })
        .then((res) => {
          version = res.data.data.device_version
          this.setData({ curVersion: version })
        })
        .catch((e) => {
          console.log('checkout error in get pagesconfig', e)
        })
      // sn8 = '7600645L'
      await this.getPagesConfig(sn8, version)
      console.log('checkout get pagesconfig ' + JSON.stringify(this.data.pagesConfig))
    },
    getDestoried() {
      this.setData({
        isInited: false,
      })
      if (queryTimer) clearInterval(queryTimer)
      // if (errorQueryTimer) clearTimeout(errorQueryTimer)
      wx.setStorage({
        key: `${this.properties.applianceData.sn8}_storageMode`,
        data: this.data.curMode,
      })
    },
    // 查询机器状态 默认查询时没有loading
    query(isControl = false) {
      const { applianceData, activeNum } = this.properties
      const command = this.data.hasDrawerDevice ? { drawer: activeNum } : {}
      requestService
        .request('luaGet', {
          applianceCode: applianceData.applianceCode,
          command,
          reqId: getStamp().toString(),
          stamp: getStamp(),
        })
        .then((res) => {
          console.log('sdafkjdsk' + JSON.stringify(res.data.data))
          if (res.data && res.data.data && res.data.data != undefined) {
            // 获取到上报数据 更新页面状态
            if (res.data.data.device_version && res.data.data.device_version != this.data.curVersion) {
              this.setData({ curVersion: res.data.data.device_version })
              this.getPagesConfig(this.properties.applianceData.sn8, res.data.data.device_version)
            }
            this.updateShowPage(res.data.data)
          }
          wx.hideLoading()
        })
        .catch((err) => {
          if (err && err.data && err.data.code && err.data.code == undefined) {
            return
          }
          this.eventTrack({
            page_id: 'user_behavior_event',
            page_name: err.data ? err.data.code + '错误' : '错误',
            widget_id: 'error',
            widget_name: '错误',
            ext_info: JSON.stringify(this.data._applianceDataStatus),
          })
          wx.hideLoading()
          if (err && err.data && err.data.code && err.data.code == '1307') {
            this.setData({
              'applianceData.onlineStatus': '0',
              offineCode: 1307,
            })
            this.triggerEvent('modeChange', this.getCurrentMode())
            // 设备离线
          } else if (err && err.data && err.data.code && err.data.code == '1306' && isControl) {
            wx.showToast({
              title: '设备无响应，请检查设备状态后刷新重试',
              icon: 'none',
              duration: 2000,
            })
          }
          // errorQueryTimer = setTimeout(() => this.query(false), 5000); // 刷新失败5秒后重试
        })
      this.inquireWater('month')
      this.inquireElect('month')
    },

    // 更新页面展示数据
    // 总体调用更新页面展示数据
    updateShowPage(data = this.data._applianceDataStatus) {
      let deviceStatus = this.getDeviceStatus(data) // 返回参数：deviceStatus机器状态；_applianceDataStatus上报数据
      let curMode = this.getCurMode(data, deviceStatus.deviceStatus)
      let bannerData = this.getBannerData(deviceStatus.deviceStatus, deviceStatus._applianceDataStatus, curMode)
      // this.printlog(deviceStatus._applianceDataStatus, '上报数据')
      // this.printlog(deviceStatus.deviceStatus, '机器状态')
      // this.printlog(curMode, 'curMode')
      this.setData({
        deviceStatus: deviceStatus.deviceStatus,
        _applianceDataStatus: deviceStatus._applianceDataStatus,
        curMode: curMode,
        bannerData: bannerData,
      })
    },
    // 通过上报数据返回机器状态 -1.离线 0.关机 1.待机 2.预约 3.工作 4.错误 5.保管 6.烘干
    getDeviceStatus(data) {
      let deviceStatus = data || this.data._applianceDataStatus
      if (
        !this.properties.applianceData ||
        !Object.keys(this.properties.applianceData).length ||
        !deviceStatus ||
        !Object.keys(deviceStatus).length ||
        !this.data.pagesConfig ||
        !Object.keys(this.data.pagesConfig).length
      ) {
        return
      }
      const { onlineStatus } = this.properties.applianceData
      const { pagesConfig } = this.data
      const { work_status, dryswitch, airswitch, air_left_hour, mode } = deviceStatus
      let status = 0
      if (onlineStatus === '0') {
        status = -1
      } else {
        if (work_status) {
          if (work_status == 'error') {
            status = 4
          } else if (work_status == 'power_off') {
            status = 0
          } else if (parseInt(dryswitch) == 2) {
            status = 6
          } else if (
            parseInt(airswitch) != 0 &&
            parseInt(air_left_hour) != 0 &&
            this.data.pagesConfig.setting.keepStartNow
          ) {
            // 有保管使能按钮的时候不会进入到status=5的状态
            status = 5
          } else if (work_status == 'standby' || work_status == 'cancel') {
            status = 1
          } else if (work_status == 'order') {
            status = 2
          } else if (work_status == 'work') {
            if (mode == 'cloud_wash') {
              status = 12
            } else {
              status = 3
            }
          }
        }
      }
      return {
        _applianceDataStatus: deviceStatus,
        deviceStatus: status,
      }
    },
    // 获取当前模式 依赖于上报数据
    getCurMode(data, deviceStatus) {
      let _applianceDataStatus = data || this.data._applianceDataStatus
      let curMode = {}
      let listFunc = ['waterLevel', 'waterStrongLevel', 'region', 'additional']
      let mapper = {
        additional: 'additional',
        region: 'wash_region',
        waterLevel: 'water_level',
        waterStrongLevel: 'water_strong_level',
      }
      // const {additional, wash_region, water_level, water_strong_level}
      // let checkFunc = ['moreDry','autoThrow','autoOpen']
      // let unKnowFunc = ['germ']
      if (
        !_applianceDataStatus ||
        !_applianceDataStatus.mode ||
        !this.data.pagesConfig ||
        !this.data.pagesConfig.modeList ||
        this.data.pagesConfig.modeList.length == 0
      ) {
        return curMode
      }
      let mode = _applianceDataStatus.mode
      curMode = { ...this.data.pagesConfig.modeList['eco_wash'] }
      // 这里需要注意 当机器处于保管或烘干状态的时候机器上报的模式是neutral_gear 因此在其他终端将机器置于保管/烘干状态再取消后 这里还是会保留上一次选择的模式 而不是保管或者烘干模式 目前和美居是一样的
      // 注意这里和美居的另一处不同是 这里分为运行时的curmode和待机时的curmode两种情况
      if (mode != 'neutral_gear' && deviceStatus != 1) {
        let temp = this.data.pagesConfig.modeList[mode]
        curMode = { ...temp }
        if (!curMode.more || Object.keys(curMode.more).length == 0) {
          return curMode
        }
        listFunc.forEach((item) => {
          // 根据上报数据中的有列表的功能的当前值 没有做检测 不确定是不是合法 这里好像有问题 但是不确定
          if (Object.keys(curMode.more).includes(item)) {
            let val = _applianceDataStatus[mapper[item]]
            // curMode.more[item].curVal = val != undefined ? val : 0
            let flag = item == 'waterStrongLevel' && ['00000F2A'].includes(this.properties.applianceData.sn8)
            curMode.more[item].curVal = flag
              ? !val
                ? temp.more[item].curVal
                : val
              : val != undefined
              ? val
              : temp.more[item].curVal
          }
        })
      } else {
        if (this.data.isInited) {
          // 如果不是首次进入页面 就用上次的模式或者是节能洗
          curMode = !this.data.lastMode ? this.data.pagesConfig.modeList['eco_wash'] : this.data.lastMode
        } else {
          // 检查有无缓存
          let initStorageMode = wx.getStorageSync(`${this.properties.applianceData.sn8}_storageMode`)
          if (!initStorageMode || Object.keys(initStorageMode).length == 0) {
            curMode = Object.assign({}, this.data.pagesConfig.modeList['eco_wash'])
          } else {
            curMode = initStorageMode
          }
        }
      }
      if (!this.data.isInited) this.setData({ isInited: true })
      this.setData({
        lastMode: curMode,
      })
      console.log('checkout curmode: ' + JSON.stringify(curMode))
      return curMode
    },
    // 更新表盘描述
    // 依赖于 当前机器状态 上报数据 当前模式
    getBannerData(deviceStatus, _applianceDataStatus, curMode) {
      let data = {}
      const {
        air_set_hour,
        dry_set_min,
        order_left_hour,
        order_left_min,
        left_time,
        temperature,
        wash_stage,
        air_left_hour,
      } = _applianceDataStatus

      if (
        !_applianceDataStatus ||
        !Object.keys(_applianceDataStatus).length ||
        !this.data.pagesConfig ||
        !this.data.pagesConfig.modeList
      ) {
        return data
      }

      const calcConditionResult = this.calcConditionResult(curMode)
      const pagesConfig = this.data.pagesConfig

      try {
        switch (deviceStatus) {
          case 1: //待机
          case 4: //故障
            if (!this.calcObjNull(curMode) && curMode.mode == 1) {
              //智能洗
              data.type = 3
              data.bigText = '待分析'
            } else if (!this.calcObjNull(curMode) && curMode.mode == 100) {
              //保管
              data.type = 4
              data.hour =
                !this.calcObjNull(_applianceDataStatus) && typeof air_set_hour != 'undefined' ? air_set_hour : 0
            } else if (!this.calcObjNull(curMode) && curMode.mode == 101) {
              //烘干
              data.type = 4
              // data.min = !this.calcObjNull(this.appData) && typeof(this.appData.dry_set_min) != 'undefined'?this.appData.dry_set_min:0
              data.hour =
                !this.calcObjNull(_applianceDataStatus) && typeof dry_set_min != 'undefined'
                  ? Math.floor(dry_set_min / 60)
                  : 0
              data.min =
                !this.calcObjNull(_applianceDataStatus) && typeof dry_set_min != 'undefined'
                  ? dry_set_min % 60 > 9
                    ? dry_set_min % 60
                    : '0' + (dry_set_min % 60)
                  : 0
            } else if (!this.calcObjNull(curMode) && curMode.mode == 15) {
              //紫外除菌
              data.type = 5
              data.min = !this.calcObjNull(viewData) ? curMode.more.germ.curVal : 10
            } else {
              data.type = 0
              if (!this.calcObjNull(curMode)) {
                data.hour = Math.floor(calcConditionResult.time / 60)
                data.min =
                  calcConditionResult.time % 60 > 9
                    ? calcConditionResult.time % 60
                    : '0' + (calcConditionResult.time % 60)
                data.temp = calcConditionResult.temp
              } else {
                data.hour = 0
                data.min = 0
                data.temp = 0
              }
            }
            break
          case 2: //预约
            data.type = 1
            let hour = parseInt(order_left_hour)
            let min = parseInt(order_left_min)
            let myDate = new Date() //获取系统当前时间
            let currentHour = myDate.getHours()
            let currentMinute = myDate.getMinutes()
            let AllMinutes = (currentHour + hour) * 60 + currentMinute + min
            let orderHour, orderMinute
            if (AllMinutes - 24 * 60 < 0) {
              data.day = '今日'
              orderHour = parseInt(AllMinutes / 60) <= 9 ? '0' + parseInt(AllMinutes / 60) : parseInt(AllMinutes / 60)
              orderMinute = parseInt(AllMinutes % 60) <= 9 ? '0' + parseInt(AllMinutes % 60) : parseInt(AllMinutes % 60)
            } else {
              data.day = '明日'
              orderHour =
                parseInt((AllMinutes - 24 * 60) / 60) <= 9
                  ? '0' + parseInt((AllMinutes - 24 * 60) / 60)
                  : parseInt((AllMinutes - 24 * 60) / 60)
              orderMinute =
                parseInt((AllMinutes - 24 * 60) % 60) <= 9
                  ? '0' + parseInt((AllMinutes - 24 * 60) % 60)
                  : parseInt((AllMinutes - 24 * 60) % 60)
            }
            data.hour = orderHour
            data.min = orderMinute
            data.temp = !this.calcObjNull(curMode) ? curMode.temp : 0
            break
          case 3: //启动
          case 12:
            console.log('checkout curmode come here')
            data.type = 0
            data.hour = Math.floor(left_time / 60)
            data.min = left_time % 60 > 9 ? left_time % 60 : '0' + (left_time % 60)
            data.temp = temperature
            if (!this.calcObjNull(curMode) && curMode.mode == 1) {
              if (!diffConfig.diffType.autoWashTimeType.includes(this.properties.applianceData.sn8)) {
                if (wash_stage == 0 || wash_stage == 1) {
                  data.type = 3
                  data.bigText = '分析中'
                }
              } else {
                if (wash_stage == 0 || wash_stage == 1 || wash_stage == 2) {
                  data.type = 3
                  data.bigText = '分析中'
                }
              }
            }
            break
          case 5: //保管
            data.type = 2
            data.hour = parseInt(air_left_hour)
            break
          case 6: //干燥
            data.type = 0
            data.hour = Math.floor(left_time / 60)
            data.min = left_time % 60 > 9 ? left_time % 60 : '0' + (left_time % 60)

            break
          case 7: //保管
            data.type = 2
            data.hour = parseInt(air_left_hour)
            break
          case 8: //干燥
            data.type = 0
            data.hour = Math.floor(left_time / 60)
            data.min = left_time % 60 > 9 ? left_time % 60 : '0' + (left_time % 60)

            break
          case -2: //保管
            data.type = 2
            data.hour = parseInt(air_left_hour)
            break
          default:
            break
        }
        return data
      } catch (error) {
        console.log(error.toString())
        return data
      }
    },
    // 判断是否为空对象
    calcObjNull(obj) {
      return !obj || Object.keys(obj).length == 0 || obj == undefined || obj == null
    },
    // 通过条件计算得出显示的待机时间和温度
    calcConditionResult(curMode) {
      // console.log('checkout curMode: ' + JSON.stringify(this.data.curMode))
      let result = {}
      if (curMode.conditions) {
        let curCondition = {}
        if (curMode.more.additional) curCondition.additionalVal = curMode.more.additional.curVal
        if (curMode.more.region) curCondition.regionVal = curMode.more.region.curVal
        if (curMode.more.waterLevel) curCondition.waterLevelVal = curMode.more.waterLevel.curVal
        if (curMode.more.waterStrongLevel) curCondition.waterStrongLevelVal = curMode.more.waterStrongLevel.curVal
        if (curMode.conditions.list && curMode.conditions.list.length > 0) {
          let findItem = curMode.conditions.list.find((x) => {
            let pass = Object.keys(curCondition).every((key) => x.condition[key] == curCondition[key])
            if (pass) return x
          })
          result = findItem ? findItem.result : curMode.conditions.default
        } else {
          result = curMode.conditions.default
        }
      } else if (curMode.mode == 12) {
        result.time = curMode.more.diy.list[curMode.more.diy.curVal - 1].time
        result.temp = curMode.more.diy.list[curMode.more.diy.curVal - 1].mainTemp
      }
      // else if (
      //   curMode.mode == 11 &&
      //   ((curMode.more.waterLevel && curMode.more.waterLevel.curVal > 0) ||
      //     (curMode.more.waterStrongLevel &&
      //       curMode.more.waterStrongLevel.curVal > 0))
      // ) {
      //   this.updateModeByLevels(
      //     curMode.more.waterLevel,
      //     curMode.more.waterStrongLevel
      //   );
      // }
      else {
        result.time = curMode.time
        result.temp = curMode.temp
      }
      return result
    },

    // lua控制
    // normal默认为true 使用下发返回的数据重新渲染页面
    requestControl(control, normal = true) {
      wx.showLoading({
        title: '加载中',
        mask: true,
      })
      const { applianceData, activeNum } = this.properties
      const command = this.data.hasDrawerDevice ? { control, drawer: activeNum } : { control }
      return requestService
        .request('luaControl', {
          applianceCode: applianceData.applianceCode,
          command,
          reqId: getStamp().toString(),
          stamp: getStamp(),
        })
        .then((rs) => {
          if (normal) {
            this.updateShowPage(rs.data.data.status)
            // console.log('get res normal', rs)
            // let _applianceDataStatus = {
            //   ...this.data._applianceDataStatus,
            //   ...rs.data.data.status,
            // };
            // console.log({ _applianceDataStatus });
            // this.setData({ _applianceDataStatus });
            // console.log('temp!!! click changekeep after control ' + this.data._applianceDataStatus.airswitch + ':' + this.data._applianceDataStatus.air_left_hour)
            // this.rendering(_applianceDataStatus);
            wx.hideLoading()
          } else {
            this.query(true)
            wx.hideLoading()
          }
        })
        .catch((err) => {
          console.log('temp!!! catch error: ' + JSON.stringify(err))
          wx.showToast({
            title: '请求失败，请稍后重试',
            icon: 'none',
            duration: 2000,
          })
          wx.hideLoading()
        })
    },

    // 获取用水量和用电量
    inquireWater(date_type) {
      const { applianceCode } = this.properties.applianceData
      const { waterJson } = this.data
      let waterObj = JSON.parse(JSON.stringify(waterJson))
      requestService
        .request('e1', {
          msg: 'WaterDisherConsumption',
          params: {
            applianceId: '' + applianceCode,
            userId: app.globalData.userData.iotUserId,
            queryType: date_type,
          },
        })
        .then(({ data: { result: ret } }) => {
          if (ret.savedWater == '') {
            this.setData({ waterSaved: 0 })
          } else {
            this.setData({ waterSaved: parseInt(ret.savedWater) })
          }
          let result = ret.data
          let yWater = [],
            xLabel = []
          let totalWater = 0
          for (let i = 0; i < result.length; i++) {
            let water = parseFloat(result[i].yWater)
            yWater.push(water)
            totalWater = totalWater + water
          }
          this.setData({ totalWater: parseFloat(totalWater).toFixed(1) })
          // this.updateViewData(viewData);
          waterObj.y[0].maxValue = yWater
          waterObj.y[0].value = this.setValue(yWater)

          let dateIndex = {}
          let myDate = new Date()

          if (date_type == 'week') {
            waterObj.x.label = this.data.tabWater[0].xLabel
            waterObj.x.value = this.data.tabWater[0].xValue
            waterObj.signPost.showType = 'all'
            waterObj.borderRadius = '5'
            waterObj.bottomBorderRadius = '5'
            waterObj.barWidth = '10'
            waterObj.xLastLabelAlignmentLeft = false
            let week = myDate.getDay()
            if (week == 0) {
              dateIndex.barIndex = 6
            } else {
              dateIndex.barIndex = week - 1
            }
          } else if (date_type == 'month') {
            // let myDate=new Date();
            let year = myDate.getFullYear()
            let month = myDate.getMonth()
            let day = myDate.getDate()
            dateIndex.barIndex = day - 1
            //获取本月有多少天
            myDate = new Date(year, month + 1, 0)
            let lastDay = myDate.getDate()

            let tempArr = [],
              xValue = []
            for (let j = 0; j < lastDay; j++) {
              xValue[j] = j + 1
              if (j == 0) {
                tempArr[j] = '1'
              } else if (j == lastDay - 1) {
                tempArr[j] = lastDay + '日'
              } else if ((j + 1) % 5 == 0) {
                //当月有31天时，不显示30，否则会重叠
                if (j != 29) {
                  tempArr[j] = j + 1 + ''
                } else {
                  tempArr[j] = ''
                }
              } else {
                tempArr[j] = ''
              }
            }

            let _tabWater = this.data.tabWater
            _tabWater[1].xLabel = tempArr
            _tabWater[1].xValue = xValue
            this.setData({ tabWater: _tabWater })

            waterObj.x.label = this.data.tabWater[1].xLabel
            waterObj.x.value = this.data.tabWater[1].xValue
            waterObj.signPost.showType = 'ends'
            waterObj.borderRadius = '3'
            waterObj.bottomBorderRadius = '3'
            waterObj.barWidth = '6'
            waterObj.xLastLabelAlignmentLeft = true
          } else if (date_type == 'year') {
            waterObj.x.label = this.data.tabWater[2].xLabel
            waterObj.x.value = this.data.tabWater[2].xValue
            waterObj.signPost.showType = 'all'
            waterObj.borderRadius = '5'
            waterObj.bottomBorderRadius = '5'
            waterObj.barWidth = '10'
            waterObj.xLastLabelAlignmentLeft = false

            let month = myDate.getMonth()
            dateIndex.barIndex = month
          }
          waterObj.barSelectIndex = dateIndex.barIndex
          this.setData({ waterJson: JSON.parse(JSON.stringify(waterObj)) })
          //计算当日在柱状图中的位置
          this.waterClicked(dateIndex)
        })
    },
    inquireElect(date_type) {
      const { electJson } = this.data
      const { applianceCode } = this.properties.applianceData
      let electObj = JSON.parse(JSON.stringify(electJson))
      requestService
        .request('e1', {
          msg: 'WaterDisherConsumption',
          params: {
            applianceId: '' + applianceCode,
            userId: app.globalData.userData.uid,
            queryType: date_type,
          },
        })
        .then(({ data: { result: ret } }) => {
          let result = ret.data
          let yElec = [],
            xLabel = []
          let totalElec = 0
          for (let i = 0; i < result.length; i++) {
            let elec = parseFloat(result[i].yElectricity)
            yElec.push(elec)
            totalElec = totalElec + elec
          }
          this.setData({ totalElec: parseFloat(totalElec).toFixed(2) })
          // this.updateViewData(viewData);
          electObj.y[0].maxValue = yElec
          electObj.y[0].value = this.setValue(yElec)

          let dateIndex = {}
          let myDate = new Date()

          if (date_type == 'week') {
            electObj.x.label = this.data.tabElect[0].xLabel
            electObj.x.value = this.data.tabElect[0].xValue
            electObj.signPost.showType = 'all'
            electObj.borderRadius = '5'
            electObj.bottomBorderRadius = '5'
            electObj.barWidth = '10'
            electObj.xLastLabelAlignmentLeft = false

            let week = myDate.getDay()
            if (week == 0) {
              dateIndex.barIndex = 6
            } else {
              dateIndex.barIndex = week - 1
            }
          } else if (date_type == 'month') {
            let year = myDate.getFullYear()
            let month = myDate.getMonth()
            let day = myDate.getDate()
            //获取本月有多少天
            myDate = new Date(year, month + 1, 0)
            let lastDay = myDate.getDate()
            let tempArr = [],
              xValue = []
            for (let j = 0; j < lastDay; j++) {
              xValue[j] = j + 1
              if (j == 0) {
                tempArr[j] = '1'
              } else if (j == lastDay - 1) {
                tempArr[j] = lastDay + '日'
              } else if ((j + 1) % 5 == 0) {
                //当月有31天时，不显示30，否则会重叠
                if (j != 29) {
                  tempArr[j] = j + 1 + ''
                } else {
                  tempArr[j] = ''
                }
              } else {
                tempArr[j] = ''
              }
            }

            let _tabElect = this.data.tabElect
            _tabElect[1].xLabel = tempArr
            _tabElect[1].xValue = xValue
            this.setData({ tabElect: _tabElect })

            electObj.x.label = this.data.tabElect[1].xLabel
            electObj.x.value = this.data.tabElect[1].xValue
            electObj.signPost.showType = 'ends'
            electObj.borderRadius = '3'
            electObj.bottomBorderRadius = '3'
            electObj.barWidth = '6'
            electObj.xLastLabelAlignmentLeft = true
            dateIndex.barIndex = day - 1
          } else if (date_type == 'year') {
            electObj.x.label = this.data.tabElect[2].xLabel
            electObj.x.value = this.data.tabElect[2].xValue
            electObj.signPost.showType = 'all'
            electObj.borderRadius = '5'
            electObj.bottomBorderRadius = '5'
            electObj.barWidth = '10'
            electObj.xLastLabelAlignmentLeft = false

            let month = myDate.getMonth()
            dateIndex.barIndex = month
          }
          electObj.barSelectIndex = dateIndex.barIndex
          this.setData({ electJson: JSON.parse(JSON.stringify(electObj)) })
          this.electClicked(dateIndex)
        })
    },
    setValue(arr) {
      let arr1 = []
      for (let i = 0; i < arr.length; i++) {
        arr1[i] = Math.floor(parseInt(arr[i]) / 2)
      }
      return arr1
    },
    electClicked(index) {
      const { elect_date, electJson } = this.data
      let itemIndex = parseInt(index.barIndex)
      let num_elect = electJson.y[0].maxValue[itemIndex]
      let myDate = new Date()
      if (elect_date == '近7天') {
        let week = myDate.getDay()
        if (week == 0) {
          week = 7
        }
        let dateDiff = itemIndex + 1 - week
        myDate = myDate.valueOf() + dateDiff * 24 * 60 * 60 * 1000
        myDate = new Date(myDate)
        let year = myDate.getFullYear()
        let month = myDate.getMonth() + 1
        let day = myDate.getDate()
        this.setData({
          curElectData: year + '年' + month + '月' + day + '日' + ' 用电' + num_elect + '度',
        })
      } else if (elect_date == '本月') {
        let year = myDate.getFullYear()
        let month = myDate.getMonth() + 1
        let day = itemIndex + 1
        this.setData({
          curElectData: year + '年' + month + '月' + day + '日' + ' 用电' + num_elect + '度',
        })
      } else if (elect_date == '今年') {
        let year = myDate.getFullYear()
        let month = itemIndex + 1
        this.setData({
          curElectData: year + '年' + month + '月份' + ' 用电' + num_elect + '度',
        })
      }
    },
    waterClicked(index) {
      const { waterJson, water_date } = this.data
      let itemIndex = parseInt(index.barIndex)
      let num_water = waterJson.y[0].maxValue[itemIndex]
      let myDate = new Date()
      if (water_date == '近7天') {
        let week = myDate.getDay()
        if (week == 0) {
          week = 7
        }
        let dateDiff = itemIndex + 1 - week
        myDate = myDate.valueOf() + dateDiff * 24 * 60 * 60 * 1000
        myDate = new Date(myDate)
        let year = myDate.getFullYear()
        let month = myDate.getMonth() + 1
        let day = myDate.getDate()
        this.setData({
          curWaterData: year + '年' + month + '月' + day + '日' + ' 用水' + num_water + '升',
        })
      } else if (water_date == '本月') {
        let year = myDate.getFullYear()
        let month = myDate.getMonth() + 1
        let day = itemIndex + 1
        this.setData({
          curWaterData: year + '年' + month + '月' + day + '日' + ' 用水' + num_water + '升',
        })
      } else if (water_date == '今年') {
        let year = myDate.getFullYear()
        // let month = myDate.getMonth()+1;
        let month = itemIndex + 1
        this.setData({
          curWaterData: year + '年' + month + '月份' + ' 用水' + num_water + '升',
        })
      }
    },
    checkStatus() {
      // this.setData({temptext: })
      if (!this.data._applianceDataStatus) return false
      const { water_lack, doorswitch, lock } = this.data._applianceDataStatus
      const { deviceStatus } = this.data
      let diffList = diffConfig.diffType.doorOff
      let diffDoorSwitch = diffList.includes(this.properties.applianceData.sn8)
      if (diffDoorSwitch) doorswitch = 1
      let status = true
      if (deviceStatus == 4) {
        wx.showToast({ title: '故障中~', icon: 'none' })
        status = false
      }
      if (doorswitch == 0) {
        wx.showToast({ title: '门开中,请先关门后操作~', icon: 'none' })
        status = false
      }
      if (water_lack && this.data.curMode.mode != 15) {
        // UV除菌、紫外除菌 可以缺水中启动 M10P
        wx.showToast({ title: '缺水中~', icon: 'none' })
        status = false
      }
      if (lock == 'on') {
        wx.showToast({ title: '童锁中~', icon: 'none' })
        status = false
      }
      return status
    },
    temp() {
      console.log('查询')
      this.query()
    },
    // 获取耗材链接 初始化时获取一次即可
    getConsumablesInfo() {
      let param = {
        msg: 'getConsumablesInfo',
        params: {
          protype: 'e1',
          platform: 'meijuLite',
        },
      }
      requestService.request('common', param).then(({ data }) => {
        if (data.retCode == 0) {
          this.setData({ consumablesPath: data.result[0].url })
        }
      })
    },

    // 控制函数
    // 童锁开关
    changeLock() {
      this.eventTrack({
        page_id: 'page_control',
        page_name: '插件首页',
        widget_id: 'click_lock',
        widget_name: '童锁',
        ext_info: '童锁 ' + (this.data._applianceDataStatus.lock == 'on' ? '关' : '开'),
      })
      this.requestControl({
        lock: this.data._applianceDataStatus.lock == 'on' ? 'off' : 'on',
      })
    },
    // 弹出模式选择器
    showModePicker() {
      if (!this.checkStatus()) return
      let modeList = []
      let confModes = Object.keys(this.data.pagesConfig.modeList)
      let curModeIndex = 0
      for (let i = 0; i < confModes.length; i++) {
        // 确定当前处于哪种模式 以及模式列表
        modeList.push(this.data.pagesConfig.modeList[confModes[i]].name)
        if (this.data.curMode.value == this.data.pagesConfig.modeList[confModes[i]].value) {
          curModeIndex = i
        }
      }
      this.setData({
        curModeIndex: [curModeIndex],
        modeArray: [modeList],
        showMode: true,
      })
    },
    // 模式选择器取消
    modePickerCancel() {
      this.setData({
        showMode: false,
      })
    },
    // 模式选择器确定
    // 这里有个问题 当前模式的叠加功能改变后 选择其他模式 再选择会当前模式 叠加功能的值并非是配置表中的初始值 貌似配置表被改动过 与美居不同 怀疑是使用curmode = this.data.pagesConfig.modeList[item] 的时候是使用指针引入 修改curmode会导致配置表改变
    modePickerConfirm(e) {
      if (!this.checkStatus()) return
      let chooseItem = Object.keys(this.data.pagesConfig.modeList)[e.detail[0]]
      let chooseMode = this.data.pagesConfig.modeList[chooseItem]
      this.setData(
        {
          lastMode: chooseMode,
          showMode: false,
        },
        function () {
          this.updateShowPage()
        }
      )
    },
    // 弹出保管/烘干的选择器
    showKDMPicker(e) {
      if (!this.data.pagesConfig || !this.data.pagesConfig.setting || !this.data.curMode) return
      if (!this.checkStatus()) return
      switch (e.target.dataset.kdflag) {
        case 'keep':
          this.showKeepPicker()
          break
        case 'dry':
          this.showDryPicker()
          break
        case 'more':
          this.showMorePicker(e.target.dataset.curFunc)
          break
      }
    },
    // 处理保管的选择器
    // 这里需要注意 当前选择器是以小时为单位 可能需要更改为天、时的选择器
    showKeepPicker() {
      let airswitch = this.data._applianceDataStatus.airswitch
      let air_left_hour = this.data._applianceDataStatus.air_left_hour
      if (parseInt(airswitch) != 0 && parseInt(air_left_hour) != 0 && !this.data.pagesConfig.setting.keepStartNow) {
        return
      }
      let hours = []
      const additionalSyncList = diffConfig.diffType.additionalSync
      if (additionalSyncList.includes(this.properties.applianceData.sn8)) {
        if (
          this.data.curMode &&
          this.data.curMode.more &&
          this.data.curMode.more.additional &&
          this.data.curMode.more.additional.curVal == 18
        ) {
          wx.showToast({
            title:
              this.data.curMode.more.additional.list.find((item) => {
                return item.value == 18
              }).name + '功能已开启，请先关闭',
            icon: 'none',
          })
          return
        }
      }
      if (!this.data.pagesConfig.setting.keepStartNow) {
        // 不带立即启动的机型只能选择1-72小时
        for (let i = 1; i < 73; i++) {
          hours.push(i)
        }
      } else {
        let startIndex = this.data.curMode.value == 'keep' ? 1 : 0 // 当前模式是保管时 只能选择1或更大
        let length = this.data.pagesConfig.setting.keepTimeType == 0 ? 73 : 169 // keepTimeType为0时可选最大值为72小时
        for (startIndex; startIndex < length; startIndex++) {
          hours.push(startIndex)
        }
      }
      const { air_set_hour } = this.data._applianceDataStatus
      let keepIndex = air_set_hour
      if (!this.data.pagesConfig.setting.keepStartNow) {
        // 不能立即启动 此时0位是1 需要把上报来的数值 - 1
        keepIndex = air_set_hour == 0 ? 0 : air_set_hour - 1
      } else {
        // 可以立即启动 此时需要判断是否处于保管状态 是的话0位是1 需要把上报来的数值-1
        if (this.data.curMode.value == 'keep') {
          keepIndex = air_set_hour == 0 ? 0 : air_set_hour - 1
        } else {
          keepIndex = air_set_hour
        }
      }
      this.setData({
        kdmArray: [hours],
        kdmIndex: [keepIndex],
        kdmPickerType: 'keep',
        showKDM: true,
        kdmUnits: ['小时'],
      })
    },
    // 处理烘干的选择器
    // 目前烘干仅有0、1、2三个选择
    showDryPicker() {
      if (!this.data.pagesConfig.setting.drySetTime) return
      let hours = ['0', '1', '2']
      if (this.data.pagesConfig.setting.dryTimeType == 1) {
        if (this.data.curMode.value == 'dry') {
          hours = ['2']
        } else {
          hours = ['0', '2']
        }
      }
      // 这里美居考虑了有些型号会取消工作时将烘干时长设为0 没有发现区别 这里暂未处理
      const { dry_set_min } = this.data._applianceDataStatus
      let dryIndex = 0
      if (this.data.pagesConfig.setting.dryTimeType != 1) {
        dryIndex = dry_set_min / 60
      } else {
        if (this.data.curMode.value == 'dry') {
          dryIndex = 0
        } else {
          dryIndex = dry_set_min == 0 ? 0 : 1
        }
      }
      this.setData({
        showKDM: true,
        kdmArray: [hours],
        kdmIndex: [dryIndex],
        kdmPickerType: 'dry',
        kdmUnits: ['小时'],
      })
    },
    // 处理叠加功能的选择器
    showMorePicker(key) {
      if (btnMore.includes(key)) return
      let moreList = this.data.curMode.more[key].list || []
      let moreArray = []
      let moreIndex = 0
      for (let i = 0; i < moreList.length; i++) {
        let item = moreList[i]
        moreArray.push(item.name)
        if (item.value == this.data.curMode.more[key].curVal) {
          moreIndex = i
        }
      }
      this.setData({
        showKDM: true,
        kdmArray: [moreArray],
        kdmIndex: [moreIndex],
        kdmPickerType: 'more',
        kdmUnits: [''],
        moreFuncKey: key,
      })
    },
    // kdm选择器取消
    kdmCancel() {
      this.setData({
        showKDM: false,
      })
    },
    kdmConfirm(e) {
      if (!this.checkStatus()) return
      const type = this.data.kdmPickerType
      switch (type) {
        case 'keep':
          // 选定保管时长
          this.keepConfirm(e.detail[0])
          break
        case 'dry':
          this.dryConfirm(e.detail[0])
          break
        case 'more':
          this.moreConfirm(e.detail[0])
          break
      }
      this.setData({
        showKDM: false,
      })
    },
    keepConfirm(value) {
      let controlValue = 0
      if (!this.data.pagesConfig.setting.keepStartNow) {
        controlValue = value + 1
      } else {
        if (this.data.curMode.value == 'keep') {
          controlValue = value + 1
        } else {
          controlValue = value
        }
      }
      if (!this.data.pagesConfig.setting.keepAndDry && !!this.data._applianceDataStatus.dryswitch) {
        // 需要下发关闭烘干命令
        if (controlValue != 0) {
          this.eventTrack({
            page_id: 'page_control',
            page_name: '插件首页',
            widget_id: 'confirm_keep',
            widget_name: '保管选择器点击确认',
            ext_info: '烘干和保管不可同时开启，现在关闭烘干',
          })
          this.requestControl({ dryswitch: 0 })
        }
      }
      if (this.data.pagesConfig.setting.keepStartNow) {
        // 没有使能按钮的 要先设置时间 再下发使能
        if (controlValue == 0) {
          this.eventTrack({
            page_id: 'page_control',
            page_name: '插件首页',
            widget_id: 'confirm_keep',
            widget_name: '保管选择器点击确认',
            ext_info: '保管选择器选择数值为0，下发保管不启动',
          })
          this.requestControl({ airswitch: 0 })
        } else {
          this.eventTrack({
            page_id: 'page_control',
            page_name: '插件首页',
            widget_id: 'confirm_keep',
            widget_name: '保管选择器点击确认',
            ext_info: '没有保管使能开关的情况，设置保管时间后下发保管使能',
          })
          this.requestControl({ air_set_hour: controlValue }).then(() => {
            this.requestControl({ airswitch: 1 })
          })
        }
      } else {
        // 有使能按钮的 直接设置时间 貌似没有用处

        this.eventTrack({
          page_id: 'page_control',
          page_name: '插件首页',
          widget_id: 'confirm_keep',
          widget_name: '保管选择器点击确认',
          ext_info: '有保管使能开关的情况，直接设置保管时间',
        })
        this.requestControl({ air_set_hour: controlValue })
      }
    },
    dryConfirm(value) {
      let valueList = this.data.kdmArray[0]
      let time = Number.parseInt(valueList[value]) * 60
      if (!this.data.pagesConfig.setting.keepAndDry && !!this.data._applianceDataStatus.airswitch) {
        if (e.detail[0] != 0) this.requestControl({ airswitch: 0 })
      }
      if (time == 0) {
        this.eventTrack({
          page_id: 'page_control',
          page_name: '插件首页',
          widget_id: 'confirm_dry',
          widget_name: '烘干选择器点击确认',
          ext_info: '烘干选择器选择值为0，直接下发关闭',
        })
        this.requestControl({ dry_set_min: 0 }).then(() => {
          this.requestControl({ dryswitch: 0 })
        })
      } else {
        this.eventTrack({
          page_id: 'page_control',
          page_name: '插件首页',
          widget_id: 'confirm_dry',
          widget_name: '烘干选择器点击确认',
          ext_info: '设置烘干时间并下发使能',
        })
        this.requestControl({ dry_set_min: time }).then(() => {
          if (!this.data._applianceDataStatus.dryswitch) {
            this.requestControl({ dryswitch: 1 })
          }
        })
      }
    },
    moreConfirm(value) {
      let curMore = this.data.curMode.more[this.data.moreFuncKey]
      let valueList = curMore.list
      let funcVal = valueList[value].value
      let additionalSyncList = diffConfig.diffType.additionalSync
      if (
        this.data._applianceDataStatus.airswitch == 1 &&
        additionalSyncList.includes(this.properties.applianceData.sn8) &&
        funcVal == 18
      ) {
        // 这里判断是否在保管模式下选中开门速干 有些型号两者功能互斥
        wx.showToast({
          title: this.data.pagesConfig.text.keep.name + '功能已开启，请先关闭',
          icon: 'none',
        })
        return
      }
      curMore.curVal = funcVal
      this.setData({
        lastMode: this.data.curMode,
      })
      this.updateShowPage()
    },
    // 处理烘干/保管使能e
    changeKD(e) {
      let flag = e.target.dataset.kdcheck
      if (flag == 'keep') {
        this.changeKeep()
      } else if (flag == 'dry') {
        this.changeDry()
      }
    },
    changeKeep() {
      if (!this.checkStatus()) return
      if (this.data.pagesConfig.setting.keepSetTime) {
        const { air_set_hour, airswitch } = this.data._applianceDataStatus
        if (!air_set_hour && !airswitch) {
          wx.showToast({ title: '请先设置运行时间', icon: 'none' })
          return
        }
      }
      this.eventTrack({
        page_id: 'page_control',
        page_name: '插件首页',
        widget_id: 'click_keep',
        widget_name: '保管使能按钮',
        ext_info: '保管使能 ' + (this.data._applianceDataStatus.airswitch ? '关' : '开'),
      })
      this.requestControl({
        airswitch: this.data._applianceDataStatus.airswitch ? 0 : 1,
      })
    },
    changeDry() {
      if (!this.checkStatus()) return
      if (this.data.pagesConfig.setting.keepAndDry && this.data.deviceStatus == 5) {
        //抑菌储存与烘干可以同时使能的机型，烘干不能在抑菌储存运行中操作
        let tip = this.data.pagesConfig.text.keep.name + '中,无法操作烘干~'
        wx.showToast({
          title: tip,
          icon: 'none',
        })
        return
      }
      this.eventTrack({
        page_id: 'page_control',
        page_name: '插件首页',
        widget_id: 'click_dry',
        widget_name: '烘干使能按钮',
        ext_info: '烘干使能 ' + (this.data._applianceDataStatus.dryswitch ? '关' : '开'),
      })
      this.requestControl({
        dryswitch: this.data._applianceDataStatus.dryswitch ? 0 : 1,
      })
    },
    changeMore(e) {
      let key = e.target.dataset.curFunc
      const autoThrowWithModeList = diffConfig.diffType.autoThrowWithMode
      this.data.curMode.more[key].on = !this.data.curMode.more[key].on
      if (key == 'autoThrow' && !autoThrowWithModeList.includes(this.properties.applianceData.sn8)) {
        if (!this.checkStatus()) return
        this.eventTrack({
          page_id: 'page_control',
          page_name: '插件首页',
          widget_id: 'click_autoThrow',
          widget_name: '智能投放按钮',
          ext_info: '智能投放 ' + (this.data.curMode.more[key].on ? '开' : '关'),
        })
        this.requestControl({
          auto_throw: this.data.curMode.more[key].on ? 1 : 0,
        })
      } else {
        this.setData({
          lastMode: this.data.curMode,
        })
        this.updateShowPage()
      }
    },
    // 底部控制按钮
    // 开关机
    powerToggle() {
      openSubscribe(this.data.applianceData)
      let diffList = diffConfig.diffType.deviceUploadFaltDataOnPower
      let devOffKeepList = diffConfig.diffType.devOffKeep
      let unNormal = !diffList.includes(this.properties.applianceData.sn8)
      const { deviceStatus, _applianceDataStatus } = this.data
      const { work_status, airswitch } = _applianceDataStatus
      if (devOffKeepList.includes(this.properties.applianceData.sn8)) {
        if (deviceStatus > 0 && airswitch > 0) {
          this.eventTrack({
            page_id: 'page_control',
            page_name: '插件首页',
            widget_id: 'click_power_switch',
            widget_name: '电源键',
            ext_info: '关机前需要关保管，当前操作：电源键 ' + (work_status === 'power_off' ? '开' : '关'),
          })
          this.requestControl({ airswitch: 0 }, unNormal)
        }
      } else {
        this.eventTrack({
          page_id: 'page_control',
          page_name: '插件首页',
          widget_id: 'click_power_switch',
          widget_name: '电源键',
          ext_info: '电源键 ' + (work_status == 'power_off' ? '开' : '关'),
        })
      }
      // if (this.data.deviceStatus == 5) {
      //   this.requestControl({ airswitch: 0 }).then(() => { this.requestControl({ work_status: work_status === "power_off" ? "power_on" : "power_off", }, unNormal) })
      // } else if (this.data.deviceStatus == 6) {
      //   this.requestControl({ dryswitch: 0 }).then(() => { this.requestControl({ work_status: work_status === "power_off" ? "power_on" : "power_off", }, unNormal) })
      // } else {
      // this.requestControl({
      //   work_status: work_status === "power_off" ? "power_on" : "power_off",
      // }, unNormal);
      // }
      this.requestControl(
        {
          work_status: work_status === 'power_off' ? 'power_on' : 'power_off',
        },
        unNormal
      )
    },
    // 取消工作
    equipmentStop() {
      const { isInoperableStatus, deviceStatus } = this.data
      if (!this.checkStatus()) return
      if (isInoperableStatus) return
      this.eventTrack({
        page_id: 'page_control',
        page_name: '插件首页',
        widget_id: 'click_cancel_switch',
        widget_name: '取消',
        ext_info:
          '取消 ' + (deviceStatus == 3 ? '工作' : deviceStatus == 5 ? '保管' : deviceStatus == 12 ? '云洗涤' : '烘干'),
      })
      if (deviceStatus == 3 || deviceStatus == 12) {
        // 运行中
        this.requestControl({ work_status: 'cancel' })
      } else if (deviceStatus == 5) {
        // 保管中
        this.requestControl({ airswitch: 0 })
      } else if (deviceStatus == 6) {
        // 烘干中
        this.requestControl({ dryswitch: 0 })
      }
    },
    // 启动（继续、暂停、中止）该函数为美云原有 全部保留
    operatorToggle() {
      const { deviceStatus, _applianceDataStatus, pagesConfig, viewData, isInoperableStatus } = this.data
      const { air_set_hour, dry_set_min, operator } = _applianceDataStatus
      const curMode = this.data.curMode
      const autoThrowWithModeList = diffConfig.diffType.autoThrowWithMode
      if (!this.checkStatus()) return
      if (isInoperableStatus) return
      if (deviceStatus == 2 || deviceStatus == 3 || deviceStatus == 12) {
        //预约中/工作中
        this.eventTrack({
          page_id: 'page_control',
          page_name: '插件首页',
          widget_id: 'click_start_switch',
          widget_name: '启动',
          ext_info: '点击 ' + (operator == 'start' ? '暂停' : '启动'),
        })
        this.requestControl({ operator: operator == 'start' ? 'pause' : 'start' })
      } else {
        if (curMode.mode == 100) {
          //保管
          if (air_set_hour == 0) {
            wx.showToast({
              title: '请设置' + pagesConfig.text.keep.name + '时长',
              icon: 'none',
            })
            return
          }
          //配置devOffKeepOnStart默认是0，
          if (!pagesConfig.setting.devOffKeepOnStart || pagesConfig.setting.devOffKeepOnStart == 0) {
            if (diffConfig.diffType.turnOffOnKeepStart.includes(this.properties.applianceData.sn8)) {
              this.eventTrack({
                page_id: 'page_control',
                page_name: '插件首页',
                widget_id: 'click_start_switch',
                widget_name: '启动',
                ext_info: '启动保管前需要将保管使能关闭',
              })
              this.requestControl({ airswitch: 0 }).then(() => {
                this.requestControl({ airswitch: 2 })
              })
            } else {
              this.eventTrack({
                page_id: 'page_control',
                page_name: '插件首页',
                widget_id: 'click_start_switch',
                widget_name: '启动',
                ext_info: '启动保管',
              })
              this.requestControl({ airswitch: 2 })
            }
          } else {
            this.eventTrack({
              page_id: 'page_control',
              page_name: '插件首页',
              widget_id: 'click_start_switch',
              widget_name: '启动',
              ext_info: '启动保管',
            })
            this.requestControl({ airswitch: 2 })
          }
        } else if (curMode.mode == 101) {
          // 烘干
          if (dry_set_min == 0) {
            wx.showToast({
              title: '请设置' + pagesConfig.text.dry.name + '时长',
              icon: 'none',
            })
            return
          }
          this.eventTrack({
            page_id: 'page_control',
            page_name: '插件首页',
            widget_id: 'click_start_switch',
            widget_name: '启动',
            ext_info: '启动烘干',
          })
          this.requestControl({ dryswitch: 2 })
        } else {
          let params = {}
          params.work_status = 'work'
          params.mode = curMode.value
          if (curMode.more.additional) {
            params.additional = curMode.more.additional.curVal
          }
          if (curMode.more.waterLevel && curMode.more.waterLevel.curVal > 0) {
            params.water_level = curMode.more.waterLevel.curVal
          }
          if (curMode.more.waterStrongLevel && curMode.more.waterStrongLevel.curVal > 0) {
            params.water_strong_level = curMode.more.waterStrongLevel.curVal
          }
          if (curMode.more.germ && curMode.more.germ.curVal > 0) {
            // 这里有问题 一直都控制一种模式
            params.work_time = curMode.more.germ.curVal
          }
          if (curMode.more.region && curMode.more.region.curVal > 0) {
            params.wash_region = curMode.more.region.curVal
          }
          if (curMode.more.autoOpen) {
            params.door_auto_open = curMode.more.autoOpen.on ? 1 : 2
          }
          if (curMode.more.autoThrow && autoThrowWithModeList.includes(this.properties.applianceData.sn8)) {
            params.auto_throw = curMode.more.autoThrow.on ? 1 : 0
          }
          if (curMode.more.moreDry) {
            params.more_dry = curMode.more.moreDry.on ? 1 : 0
          }
          this.eventTrack({
            page_id: 'page_control',
            page_name: '插件首页',
            widget_id: 'click_start_switch',
            widget_name: '启动',
            ext_info: '启动洗涤模式',
          })
          this.requestControl({ work_status: 'work', ...params })
        }
      }
    },
    orderCancel() {
      if (!this.checkStatus()) return
      this.eventTrack({
        page_id: 'page_control',
        page_name: '插件首页',
        widget_id: 'click_order_cancel',
        widget_name: '取消预约',
      })
      this.requestControl({ work_status: 'cancel_order' })
    },
    // 预约跳转
    gotoAppointment() {
      if (!this.checkStatus()) return
      const { applianceData, activeNum } = this.properties
      let modeList = []
      Object.keys(this.data.pagesConfig.modeList).forEach((item) => {
        if (!['keep', 'dry'].includes(item)) {
          modeList.push(this.data.pagesConfig.modeList[item])
        }
      })
      let obj = {
        applianceCode: applianceData.applianceCode,
        hasDrawerDevice: this.data.hasDrawerDevice,
        activeNum: activeNum,
        modeList: modeList,
        curMode: this.data.curMode,
      }
      let obj_str = JSON.stringify(obj)
      let url = `../appointment/index?obj=${obj_str}`
      this.eventTrack({
        page_id: 'page_control',
        page_name: '插件首页',
        widget_id: 'click_navigate_order',
        widget_name: '预约按钮',
        ext_info: '跳转至预约页面',
      })
      wx.navigateTo({
        url: url,
      })
    },
  },
})
