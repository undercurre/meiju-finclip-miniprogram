Component({
  properties: {
    type: {
      type: String,
      value: "filter",
    },
    deviceStatus: {
      type:Number,
      value:0
    },
    value: {
      type: Array,
      value: [],
      observer(val) {
        this.setData({
          filterList:val.filter(item => item != '')
        })
      }
    },
  },
  data: {
    filterList: [],
    infoDescVClx1:
    "VC美肤香氛沐浴滤芯，99.8%除去水中余氯，滋养肌肤，柔顺秀发，打造SPA级亲肤好水，而且还能过滤泥沙、铁锈等有害物，保障沐浴水质健康。当使用3个月或当香味消失时，建议更换一次滤芯，效果更佳。",
    infoDescVClx2:
      "净氯除垢沐浴滤芯，专利除余氯设计，采用KDF、MSAP和银离子过滤水中杂质、余氯等有害物质，减少水中内部杂质沉积，给肌肤舒适亲和力，呵护敏感肌。当使用6个月后，建议更换一次滤芯，效果更佳。",
    infoDescVClx3:
      "VC MINI美肤滤芯，外层PP棉过滤水中泥沙杂质，内部VC凝胶，90%净水除氯，四重美肤精华，滋养保湿；天然植物精油，香氛沐浴，舒缓解压。正常水质下，建议45天更换一次滤芯，效果更佳",
    //特殊型号信息
    infoDesc:
      "沐浴时，滤芯为您及您的家人提供满满维生素C，可以有效去除自来水中的余氯，美白肌肤抗衰老，并散发柠檬香气，使用周期3个月（实际消耗量与用水温度、流量与当地水质有关，请以实际消耗情况为准）。",
  },
  methods: {
  // 显示滤芯信息
    showFilterInfo(e) {
      if (this.properties.deviceStatus > 4) return;
      const { infoDescVClx1,infoDescVClx2,infoDescVClx3,infoDesc } = this.data
      const filterNo = e.currentTarget.dataset.item.id.toString().charAt(0)
      console.log(filterNo)
      const filterDesc = filterNo == 1? infoDescVClx1 : (filterNo == 2 ? infoDescVClx2 : (filterNo == 3? infoDescVClx3 : infoDesc))
      wx.showModal({
        content:filterDesc,
        showCancel: false
      });
    },
}
});