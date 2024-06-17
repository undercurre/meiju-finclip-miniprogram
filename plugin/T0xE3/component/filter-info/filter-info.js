import computedBehavior from '../../../../utils/miniprogram-computed'
import { requestService, rangersBurialPoint } from '../../../../utils/requestService'
// import { openSubscribe } from '../../assets/js/openSubscribe'
// import { templateIds } from '../../../../globalCommon/js/templateIds'
Component({
  behaviors: [computedBehavior],
  properties: {
    status: {
      type: Object,
      value: {},
    },
    setting: {
      type: Object,
      value: {},
    },
    applianceData: {
      type: Object,
      value: {},
    },
    type: {
      type: String,
      value: '',
    },
    deviceStatus: {
      type: Number,
      value: 0,
    },
  },
  data: {
    lxMaxPassWater: 0,
    selectedIndex: 'filter', // 选中的耗材序号
    circleDataList: [], // 图标的数据列表
    filterList: [],
    isShowFilterLoading: true,
    circleCount: 0, // 显示图标的数量
    life: [0, 0, 0], // 图标下方的使用天数/余量显示
    // 当前耗材
    currentItem: {
      filter: {}, // 滤芯
    },
    // 耗材数组
    material: {
      filter: [], // 滤芯
    },
    actions: [
      { name: 'VC美肤香氛滤芯', value: 'vcFilter3' },
      { name: 'VC MINI美肤滤芯', value: 'vcFilter1' },
      { name: '净氯滤芯', value: 'vcFilter2' },
    ],

    //--------------------VC滤芯---------start
    homeId: '',
    infoDescVClx1:
      'VC美肤香氛沐浴滤芯，99.8%除去水中余氯，滋养肌肤，柔顺秀发，打造SPA级亲肤好水，而且还能过滤泥沙、铁锈等有害物，保障沐浴水质健康。\n当使用3个月或当香味消失时，建议更换一次滤芯，效果更佳。',
    infoDescVClx2:
      '净氯除垢沐浴滤芯，专利除余氯设计，采用KDF、MSAP和银离子过滤水中杂质、余氯等有害物质，减少水中内部杂质沉积，给肌肤舒适亲和力，呵护敏感肌。\n当使用6个月后，建议更换一次滤芯，效果更佳。',
    infoDescVClx3:
      '阻垢滤芯可将水中钙、镁离子捕获，防止在高温下形成水垢。建议1年更换一次（因使用地域、水质、用水量不同，实际使用周期不同）',
    //特殊型号信息
    infoDesc:
      '沐浴时，滤芯为您及您的家人提供满满维生素C，可以有效去除自来水中的余氯，美白肌肤抗衰老，并散发柠檬香气，使用周期3个月（实际消耗量与用水温度、流量与当地水质有关，请以实际消耗情况为准）。',
    //--------------------VC滤芯---------end
    timerShow: true,
    animationObj: {
      opacity: '1',
    },
    isShowBuyFilterSheet: false,
  },

  observers: {
    // "applianceData,status": function (applianceData, status) {
    //   this.filterHandler();
    // },
    material: function (val) {
      if (!val.filter) return
      this.materialHandler(val)
    },
  },
  lifetimes: {
    attached() {
      this.getVClxData().then(() => {
        //滤芯状态不轮询
        this.queryCloudMaintenance().then(() => {
          this.rendering()
        })
      })
    },
  },
  methods: {
    // 渲染页面数据
    rendering() {
      this.filterHandler()
    },
    // 处理滤芯数据
    filterHandler() {
      const { applianceData, status } = this.properties
      const { infoDescVClx3, life } = this.data
      const name = 'filter'

      this.setData({
        isShowFilterLoading: true,
      })

      if (applianceData.sn8 == '51100RX7' || applianceData.sn8 == '511000VC') {
        let lxMaxPassWater = 50000
        if (applianceData.sn8 == '511000VC') {
          this.setData({
            lxMaxPassWater: 25000,
          })
        }
        let lxPercent = Math.floor(((lxMaxPassWater - status.water_consumption) / lxMaxPassWater) * 100).toFixed(0)
        lxPercent = lxPercent > 0 ? lxPercent : 0
        let obj = {
          isVClx: false,
          infoDesc: infoDescVClx3,
          infoText1: lxPercent,
          infoUnit1: '%',
          infoLabel1: '滤芯余量',
          infoText2: '',
          infoUnit2: '',
          infoLabel2: '',
          precent: lxPercent,
          key: name,
        }
        if (lxPercent <= 10) {
          obj.isError = true
        }
        obj.errorDesc = '提示：滤芯余量不足，建议及时更换'

        let index = this.data.material[name].findIndex((i) => i.isVClx == false)
        if (index > -1) {
          let material = {
            ...this.data.material,
          }
          material[name][index] = obj
          this.setData({
            material,
          })
        } else {
          let material = {
            ...this.data.material,
          }
          material[name].push(obj)
          this.setData({
            material,
          })
        }
        this.changeIconPercent({
          key: name,
          value: lxPercent,
        })
      } else {
        // 2.云端处理滤芯数据
        let obj = {
          isVClx: false,
          infoDesc: infoDescVClx3,
          infoText1: this.data.life[1],
          infoUnit1: '天',
          infoLabel1: '已使用天数',
          infoText2: 365 - this.data.life[1] > 0 ? 365 - this.data.life[1] : 0,
          infoUnit2: '天',
          infoLabel2: '剩余天数',
          precent: Math.floor(100 - (this.data.life[1] / 365) * 100),
          key: name,
        }
        if (this.data.life[1] >= 355) {
          obj.isError = true
        }
        obj.errorDesc = '提示：滤芯余量不足，建议及时更换'

        let index = this.data.material[name].findIndex((i) => i.isVClx == false)
        if (index > -1) {
          let material = {
            ...this.data.material,
          }
          material[name][index] = obj
          this.setData({
            material,
          })
        } else {
          let material = {
            ...this.data.material,
          }
          material[name].push(obj)
          this.setData({
            material,
          })
        }
        this.changeIconPercent({
          key: name,
          value: Math.floor(100 - (this.data.life[1] / 365) * 100),
        })
      }
      this.setData(
        {
          material: JSON.parse(JSON.stringify(this.data.material)),
        },
        () => {
          this.setData({
            isShowFilterLoading: false,
          })
        }
      )
      // console.log({
      //   material: JSON.parse(JSON.stringify(this.data.material)),
      // });
    },
    changeIconPercent({ key, value }) {
      // const { currentItem, material } = this.data
      // const circleDataList = [...this.data.circleDataList]
      // console.log('检查的数据',circleDataList)
      // circleDataList.forEach((i) => {
      //   if (i.key == key) {
      //     if (currentItem[key].key) {
      //       i.circleData.progressCounter = Number(currentItem[key].precent)
      //     } else {
      //       i.circleData.progressCounter = material[key].length ? Number(material[key][0].precent) : 0
      //     }
      //   }
      // })
      // this.setData({
      //   circleDataList: JSON.parse(JSON.stringify(circleDataList)),
      // })
    },
    // 自带滤芯查询
    queryCloudMaintenance() {
      return new Promise((resolve, reject) => {
        requestService
          .request('e3', {
            msg: 'getFilterInfo',
            params: {
              applianceId: this.properties.applianceData.applianceCode,
            },
          })
          .then(({ data: res }) => {
            resolve()
            if (res.retCode != 0) {
              wx.showToast({
                title: '网络异常，请稍后再试',
                icon: 'none',
              })
              return
            }
            let filterUsedDays = res.result.daysUsed < 0 ? 0 : res.result.daysUsed > 365 ? 365 : res.result.daysUsed
            const life = [...this.data.life]
            life.splice(1, 1, filterUsedDays)
            this.setData({
              life,
            })
            // 渲染页面数据
            this.rendering()
          })
          .catch(() => reject())
      })
    },
    materialHandler(val) {
      // if (!val.filter && !val.filter.length) return;
      const filterName = [
        { id: 1, pId: 0, name: 'VC美肤香氛滤芯', type: 'vcFilter3' },
        { id: 101, pId: 1, name: '柠檬香味' },
        { id: 102, pId: 1, name: '薄荷香味' },
        { id: 103, pId: 1, name: '薰衣草香味' },
        { id: 104, pId: 1, name: '松木香味' },
        { id: 2, pId: 0, name: '净氯滤芯', type: 'vcFilter2' },
        { id: 201, pId: 2, name: '无香' },
        { id: 3, pId: 0, name: 'VC MINI美肤滤芯', type: 'vcFilter1' },
        { id: 301, pId: 3, name: '薰衣花海' },
        { id: 302, pId: 3, name: '仲夏青柠' },
        { id: 303, pId: 3, name: '松间落雪' },
        { id: 304, pId: 3, name: '爆汁西柚' },
        { id: 305, pId: 3, name: '微醺莓果' },
        { id: 306, pId: 3, name: '漫步丁香' },
        { id: 307, pId: 3, name: '玫瑰呢喃' },
        { id: 308, pId: 3, name: '天竺少女' },
        { id: 309, pId: 3, name: '空谷依兰' },
        { id: 310, pId: 3, name: '橘子海洋' },
      ]
      let filterList = []
      if (this.properties.deviceStatus >= 5) {
        filterList = this.data.filterList.map((item) => ({
          name: item.name,
          circleText: '未知',
          circleVal: 0,
          remainDay: 0,
        }))
      } else {
        filterList = val['filter'].map((item) => {
          const index = filterName.findIndex((filterNameItem) => item.subId && filterNameItem.id === item.subId)
          if (index !== -1) {
            return {
              id: filterName[index]['id'],
              name: filterName[index]['name'],
              circleText: item.precent + '%',
              circleVal: parseInt(item.precent),
              remainDay: parseInt(item.infoText2) || parseInt(item.infoText1),
            }
          } else {
            return ''
          }
        })
      }
      setTimeout(
        () =>
          this.setData(
            {
              filterList,
            },
            () => {}
          ),
        0
      )
    },
    //--------------------VC滤芯---------start
    // 获取VC滤芯
    getVClxData() {
      return new Promise((resolve, reject) => {
        const { homegroupId } = this.properties.applianceData
        const { infoDescVClx1, infoDescVClx2 } = this.data
        const name = 'filter'
        wx.showLoading({
          title: '加载中',
          mask: true,
        })
        requestService
          .request('e2', {
            msg: 'vcFilterInfo',
            params: {
              homeId: homegroupId,
              filterInfo: null,
              action: 'getAll',
            },
          })
          .then(({ data: res }) => {
            wx.hideLoading()
            if (res.retCode == '0') {
              let arr = []
              if (res.result.length) {
                arr = JSON.parse(JSON.stringify(res.result))
                for (let i of arr) {
                  let num = this.dateDiff(i.date)
                  let max = i.mainId == 3 ? 45 : i.mainId == 1 ? 90 : 180
                  let surplus = num >= max ? 0 : max - num
                  i['isVClx'] = true
                  i['infoText1'] = num
                  i['infoUnit1'] = '天'
                  i['infoLabel1'] = '已使用天数'
                  i['infoText2'] = surplus > 0 ? surplus : 0
                  i['infoUnit2'] = '天'
                  i['infoLabel2'] = '剩余天数'
                  i['infoDesc'] = i.mainId == 1 ? infoDescVClx1 : infoDescVClx2
                  i['precent'] = Number(num >= max ? 0 : (((max - num) / max) * 100).toFixed(0))
                  i['isError'] = surplus <= 10 ? true : false
                  i['errorDesc'] = `提示：VC滤芯剩余${surplus}天，请及时更换！`
                  i['key'] = name
                }
                let material = {
                  ...this.data.material,
                }
                material[name] = arr
                this.setData({
                  material: JSON.parse(JSON.stringify(material)),
                })
              } else {
                let material = {
                  ...this.data.material,
                }
                material[name] = []
                this.setData({
                  material: JSON.parse(JSON.stringify(material)),
                })
              }
              this.rendering()
            }
            resolve()
          })
          .catch(() => {
            wx.hideLoading()
            reject()
          })
      })
    },
    dateDiff(date) {
      let day1 = new Date(date)
      let day2 = new Date()
      return parseInt(Math.abs(day2 - day1) / 1000 / 60 / 60 / 24)
    },
    //--------------------VC滤芯---------end
    // 跳转 小程序
    goMiniProgram(url) {
      wx.navigateToMiniProgram({
        appId: 'wx255b67a1403adbc2',
        path: url,
      })
    },
    // 跳转 webview
    goWebView(id) {
      let currLink = `https://m.midea.cn/detail/index?itemid=${id}`
      let encodeLink = encodeURIComponent(currLink)
      let currUrl = `/pages/webView/webView?webViewUrl=${encodeLink}`
      console.log('新C4A隐私条款链接===', currLink)
      wx.navigateTo({
        url: currUrl,
      })
    },
    // 滤芯购买
    buyFilter() {
      if (this.properties.deviceStatus > 4) return
      // openSubscribe(this.properties.applianceData, templateIds[27][0])
      this.setData({
        isShowBuyFilterSheet: true,
      })
    },
    closeBuyFilterSheet() {
      this.setData({
        isShowBuyFilterSheet: false,
      })
    },
    // 选中滤芯购买的选项
    onBuyFilterSheetSelect({ detail }) {
      requestService
        .request('common', {
          msg: 'getConsumablesInfo',
          params: {
            protype: 'e3',
            platform: 'meijuLite',
          },
        })
        .then(({ data }) => {
          const { sn8 } = this.properties.applianceData
          const jumpList = data.result
          let jumpUrl = jumpList.filter((item) => item.type == detail.value)[0].url
          this.closeBuyFilterSheet()
          if (detail.name === 'VC美肤香氛滤芯') {
            // 埋点
            let params = {
              element_content: '去购买',
              custom_params: JSON.stringify({ type: 'VC美肤香氛滤芯' }),
            }
            this.rangersBurialPointClick('plugin_button_click', params)
          } else if (detail.name === 'VC MINI美肤滤芯') {
            // 埋点
            let params = {
              element_content: '去购买',
              custom_params: JSON.stringify({ type: 'VC MINI美肤滤芯' }),
            }
            this.rangersBurialPointClick('plugin_button_click', params)
          } else {
            // 埋点
            let param = {
              element_content: '去购买',
              custom_params: JSON.stringify({ type: detail.name }),
            }
            this.rangersBurialPointClick('plugin_button_click', param)
          }
          this.goMiniProgram(jumpUrl)
        })
        .catch(() => {})
    },
    // 埋点
    rangersBurialPointClick(eventName, param) {
      if (this.data.applianceData) {
        let paramBurial = {}
        let paramBase = {
          module: '插件',
          apptype_name: '燃气热水器',
          widget_cate: this.data.applianceData.type,
          sn8: this.data.applianceData.sn8,
          sn: this.data.applianceData.sn,
          a0: this.data.applianceData.modelNumber,
          iot_device_id: this.data.applianceData.applianceCode,
          online_status: this.data.applianceData.onlineStatus,
        }
        paramBurial = Object.assign(paramBase, param)
        rangersBurialPoint(eventName, paramBurial)
      }
    },
  },
})
