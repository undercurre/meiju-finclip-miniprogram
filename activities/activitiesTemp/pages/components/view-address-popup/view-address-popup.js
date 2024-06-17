// activities/activitiesTemp/pages/components/view-address-dialog/view-address-dialog.js
const commonMixin = require('../../commonMixin.js')
Component({
  behaviors: [commonMixin],
  /**
   * 组件的属性列表
   */
  properties: {
    isShowAdressPopup: {
      type: Boolean,
      value: false,
    },
    regionList: {
      type: Array,
      default: () => [],
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    areaObj: {
      //整个地址数据
      provinceCode: '',
      provinceName: '',
      cityCode: '',
      cityName: '',
      countyCode: '',
      countyName: '',
      streetCode: '',
      streetName: '',
      oldAreaObj: {},
    },
    chooseArea: [], //头部显示的数据
    areaIndex: 0, //第几级
    areaList: [], //显示的地区列表
    isLoading: false,
    toPos: '',
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onMaskHide(val = true) {
      this.animate(
        '#popup',
        [
          { bottom: '0rpx', ease: 'ease-out' },
          { bottom: '-600rpx', ease: 'ease-out' },
        ],
        300,
        function () {
          // 动画结束就触发事件
          this.triggerEvent('dialogClose')
          if (val) {
            // 假如没点到最后一个  还原数据
            this.setData({
              areaObj: this.data.oldAreaObj,
            })
          }
        }.bind(this)
      )
    },
    onMaskShow() {
      this.animate(
        '#popup',
        [
          { bottom: '-600rpx', ease: 'ease-out' },
          { bottom: '0rpx', ease: 'ease-out' },
        ],
        300
      )
    },
    getAreaList(code = 0) {
      this.setData({
        isLoading: true,
      })
      this.receiveGetAddress(code)
        .then((data) => {
          console.log(data.data.content)
          let { children } = data.data.content
          this.setData({
            areaList: children,
            toPos: `city${children[0].regionCode}`,
          })
          this.setData({
            isLoading: false,
          })
        })
        .catch(() => {
          this.setData({
            isLoading: false,
          })
        })
    },
    itemClick(e) {
      let { code, name } = e.currentTarget.dataset
      let { areaIndex, areaObj, chooseArea } = this.data
      console.log(code, name)
      if (areaIndex == 0) {
        areaObj.provinceCode = code
        areaObj.provinceName = name
        chooseArea.push('选择市')
        this.getAreaList(code)
      } else if (areaIndex == 1) {
        areaObj.cityCode = code
        areaObj.cityName = name
        chooseArea.push('选择区/县')
        this.getAreaList(code)
      } else if (areaIndex == 2) {
        areaObj.countyCode = code
        areaObj.countyName = name
        chooseArea.push('选择街道')
        this.getAreaList(code)
      } else if (areaIndex == 3) {
        areaObj.streetCode = code
        areaObj.streetName = name
      }
      chooseArea[areaIndex] = name
      areaIndex++
      let resultRegion = [...chooseArea]
      if (areaIndex > 3) {
        areaIndex = 3
        this.onMaskHide(false)
        this.triggerEvent('getRegion', resultRegion)
        chooseArea[3] = '选择街道'
        // 由于header显示的第四个永远是选择的
        this.setData({
          areaObj: areaObj,
        })
      }
      this.setData({
        chooseArea: chooseArea,
        areaIndex: areaIndex,
      })
    },
    headerClick(e) {
      // 地区选择  上方按钮点击   //点哪个  哪个要变成选择 并查询接口  这个逻辑已实现
      let { index } = e.currentTarget.dataset
      let { chooseArea } = this.data
      chooseArea = chooseArea.splice(0, index)
      if (index == 0) {
        this.getAreaList(0)
        chooseArea[0] = '选择省'
      } else if (index == 1) {
        this.getAreaList(this.data.areaObj.provinceCode)
        chooseArea[1] = '选择市'
      } else if (index == 2) {
        this.getAreaList(this.data.areaObj.cityCode)
        chooseArea[2] = '选择区/县'
      } else if (index == 3) {
        this.getAreaList(this.data.areaObj.countyCode)
        chooseArea[3] = '选择街道'
      }
      this.setData({
        areaIndex: index,
        chooseArea: chooseArea,
      })
    },
  },
  observers: {
    isShowAdressPopup: function (val) {
      if (val) {
        console.log(this.data.areaObj)
        let list = [...this.data.regionList]
        let index
        if (this.data.regionList.length > 1) {
          list[3] = '选择街道'
          index = 3
          this.getAreaList(this.data.areaObj.countyCode)
        } else {
          list.push('选择省')
          index = 0
          this.getAreaList()
        }
        this.setData({
          oldAreaObj: { ...this.data.areaObj },
          areaIndex: index,
          chooseArea: list,
        })
      }
    },
  },
})
