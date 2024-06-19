// sub-package/sda-cloud-menu/component/menu-item/menu-item.js
Component({
  /**
   * 组件的属性列表
   * image: '',
   * name: '香煎三文鱼',
   * descArr: ['32分钟','中等','1999千卡'],
   * author: {
   *       avatar: '',
   *       name: 'EKIN'
   *     },
   * collectNum: 920
   */
  properties: {
    titleStyle: {
      type: Object,
      default: null,
      observer: (newValue, oldValue) => {
        // console.log('titleStyle 改变: ',newValue,oldValue);
      },
    },
    imageStyle: {
      type: Object,
      default: null,
    },
    infoWrapperStyle: {
      type: Object,
      default: null,
    },
    descStyle: {
      type: Object,
      default: null,
    },
    model: {
      type: Object,
      default: {},
      observer: (newValue, oldValue) => {
        // console.log('菜单数据改变: ',newValue,oldValue);
      },
    },
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    onClickRecipe() {
      this.triggerEvent('onClickEvent', {
        key: 'recipe',
        data: this.properties.model,
      })
    },
  },
})
