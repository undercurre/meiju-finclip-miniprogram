/*
 * @desc: 物模型图片组件
 * @author: zhucc22
 * @Date: 2023-10-25 17:53:35
 */
const commonBehavior = require('../common/behavior')
Component({
  behaviors: [commonBehavior],
  properties: {},
  data: {},
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {},
    moved: function () {},
    detached: function () {},
  },

  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  attached: function () {}, // 此处attached的声明会被lifetimes字段中的声明覆盖
  ready: function () {},
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () {},
    hide: function () {},
    resize: function () {},
  },
  methods: {},
})
