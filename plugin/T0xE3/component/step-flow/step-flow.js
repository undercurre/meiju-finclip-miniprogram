// plugin/T0xE3/component/step-flow.js
import computedBehavior from "../../../../utils/miniprogram-computed.js";


Component({
  /**
   * 组件的属性列表
   */
  behaviors: [computedBehavior],
  properties: {
    list: {
      type: Array,
      default: [],
      observer(val) {
        this.setData({
          formattedList: val
        })
      }
    },
    stylesConfig: {
      type: Object,
      default: {}
    },
    timeWidth: {
      type: Boolean,
      default: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    firstLineTop: 200,
    lastLineBottom: 200
  },
  
  /**
   * 组件的方法列表
   */
  methods: {
    init() {
      domModule.getComponentRect(this.$refs['item0'][0], (data) => {
        if (this.properties.stylesConfig.itemAlign == "flex-start") {
          this.setData({
            firstLineTop: 24
          })
        } else {
          this.setData({
            firstLineTop: parseInt(data.size.height / 2)
          })
        }
      })
      domModule.getComponentRect(this.$refs['item' + (this.list.length - 1)][0], (data) => {
        if (this.properties.stylesConfig.itemAlign == "flex-start") {
          this.setData({
            lastLineBottom: parseInt(data.size.height - 24)
          })
        } else {
          this.setData({
            lastLineBottom: parseInt(data.size.height / 2)
          })
        }
      })
    },
    formatList(list) {
      const {
        activedColor,
        pointStyles = {},
        lineStyles = {},
        // lineStyle,
        // lineColor,
        timeStyles = {},
        contentStyles = {},
        itemAlign,
        rowStyles = {}
      } = this.properties.stylesConfig

      let result = []
      result = list.map((item, index) => {
        //处理行
        item['rowStyles'] = {
          ...item['rowStyles'],
          ...rowStyles
        }
        if (itemAlign) item['rowStyles']['align-items'] = itemAlign

        //处理节点point
        item['pointStyles'] = {
          ...item['pointStyles'],
          ...pointStyles
        }
        if (item.isActived && activedColor) {
          item['pointStyles']['background-color'] = activedColor
        }

        //处理节点线条
        item['lineStyles'] = {
          top: index == 0 ? this.firstLineTop : 0,
          bottom: (index == list.length - 1) ? this.lastLineBottom : 0
        }
        item['lineStyles'] = {
          ...item['lineStyles'],
          ...lineStyles
        }

        //处理内容
        item['timeStyles'] = {
          ...item['timeStyles'],
          ...timeStyles
        }
        if (item.isActived && activedColor) {
          item['timeStyles']['color'] = activedColor
        }

        item['contentStyles'] = {}
        item['contentStyles'] = {
          ...item['contentStyles'],
          ...contentStyles
        }
        if (item.isActived && activedColor) {
          item['contentStyles']['color'] = activedColor
        }

        return item
      })

      // console.log(JSON.stringify(result))
      return result
    }
  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached() {
      // console.log('test' + this.selectComponent('#test'))
    }
  }
})