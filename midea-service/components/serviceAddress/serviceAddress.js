Component({
  properties: {
    show: {
      type: Boolean,
      value: false,
    },
  },
  data: {
    // show:true,
    overlay: true,
    list: [
      {
        name: '货已到需要安装',
        value: '0',
        serviceRequireItemCode: 'BZ01001',
        serviceRequireItemName: '货已到需要安装',
        serviceMainTypeCode: '10',
        serviceMainTypeName: '安装',
        serviceSubTypeCode: '1010',
        serviceSubTypeName: '安装',
      },
      {
        name: '货未到预约安装',
        value: '1',
        serviceRequireItemCode: 'BZ01002',
        serviceRequireItemName: '货未到预约安装',
        serviceMainTypeCode: '10',
        serviceMainTypeName: '安装',
        serviceSubTypeCode: '1010',
        serviceSubTypeName: '安装',
      },
    ],
  },
  options: {
    addGlobalClass: true,
  },
  methods: {
    onClose() {
      this.setData({
        show: false,
      })
    },
    toCheck(e) {
      let item = e.currentTarget.dataset.item
      console.log(item)
      this.setData({
        show: false,
      })
      this.triggerEvent('sendData', item)
    },
  },
})
