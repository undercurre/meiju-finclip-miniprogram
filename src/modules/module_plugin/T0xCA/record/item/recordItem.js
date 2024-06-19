// plugin/T0xCA/record/item/recordItem.js
import netService from '../../service/NetService'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    recordData: {
      type: Object,
      value: function () {
          return {
          }
      },
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    iconServiceUrl: netService.getIconServiceUrl(),
  },

  /**
   * 组件的方法列表
   */
  methods: {

  },
  lifetimes: {
    attached: function(){
      let recordData = this.properties.recordData;
      let dataList = recordData.list;
      if(dataList != null && dataList.length > 0){
        for(let idx = 0; idx < dataList.length; idx ++) {
            let entity = dataList[idx];
            let minute = parseInt(entity.openDuration/60);
            let seconds = entity.openDuration%60;
            entity.seconds = seconds;
            entity.minute = minute;
        }
      }
      this.setData({recordData: this.properties.recordData});
    }
  }
})
