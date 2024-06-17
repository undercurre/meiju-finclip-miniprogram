// midea-service/pages/components/view-address-dialog/view-address-dialog.js
// const commonMixin = require('../../commonMixin.js')
import { service } from 'assets/js/service'
import { imgBaseUrl } from '../../../api'
Component({
  // behaviors:[commonMixin],
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
    //地址选择器显示层数
    addressMaxCount: {
      type: Number,
      value: 4,
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
    imgBaseUrl: imgBaseUrl.url,
    chooseArea: [], //头部显示的数据
    areaIndex: 0, //第几级
    areaList: [], //显示的地区列表
    isLoading: false,
    toPos: '',
    common: '/mideaServices/images/icon.png',
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
          { bottom: '-624rpx', ease: 'ease-out' },
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
          { bottom: '-624rpx', ease: 'ease-out' },
          { bottom: '0rpx', ease: 'ease-out' },
        ],
        300
      )
    },

    getAreaList(code = 100000) {
      this.setData({
        isLoading: true,
      })
      service
        .getAreaList(code)
        .then((data) => {
          console.log(data.data)
          let children = data.data.data
          console.log(children)
          let newArray = []
          children.map((item) => {
            newArray.push(
              Object.assign({}, item, {
                regionCode: item.ebplCode,
                regionName: item.ebplNameCn,
              })
            )
          })
          this.setData({
            areaList: newArray,
            toPos: `city${newArray[0].regionCode}`,
          })
          this.setData({
            isLoading: false,
          })
        })
        .catch(() => {
          this.setData({
            isLoading: false,
          })
          this.onMaskHide(false)
          this.triggerEvent('getRegion', null) //查询地址接口报错直接返回空值给父组件，用于提示接口请求失败
        })
    },
    itemClick(e) {
      let { code, name } = e.currentTarget.dataset
      let { areaIndex, areaObj, chooseArea, addressMaxCount } = this.data
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
      // let resultRegion = [...chooseArea]
      if (areaIndex > addressMaxCount - 1) {
        areaIndex = addressMaxCount - 1
        this.onMaskHide(false)
        // this.triggerEvent('getRegion',resultRegion)
        this.triggerEvent('getRegion', areaObj)
        //只到省市区就结束
        if (addressMaxCount == 3) return
        chooseArea[3] = '选择街道'
        // 由于header显示的第四个永远是选择的
        this.setData({
          areaObj: areaObj,
        })
      }
      this.setData({
        chooseArea: chooseArea.splice(0, addressMaxCount),
        areaIndex: areaIndex,
      })
    },
    headerClick(e) {
      // 地区选择  上方按钮点击   //点哪个  哪个要变成选择 并查询接口  这个逻辑已实现
      let { index } = e.currentTarget.dataset
      let { chooseArea } = this.data
      chooseArea = chooseArea.splice(0, index)
      if (index == 0) {
        this.getAreaList(100000)
        chooseArea[0] = '请选择'
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
        chooseArea: chooseArea.splice(0, this.data.addressMaxCount),
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
          list.push('请选择')
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
