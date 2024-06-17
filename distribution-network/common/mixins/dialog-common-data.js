import {
  wxGetOpenSetting
} from '../js/commonWxApi.js'
module.exports = Behavior({
  behaviors: [],
  properties: {},
  data: {
    isSureDialog: false,
    isShowDialogMixinsBlueDesc: false,
    dialogMixinsTitle: '',
    dialogMixinsContent: '',
    dialogMixinsBtnText: '我知道了',
    dialogMixinsBtns: []
  },
  methods: {
    setDialogMixinsData(isSureDialog, dialogMixinsTitle, dialogMixinsContent, isShowDialogMixinsBlueDesc= false,btns) {
      this.setData({
        isSureDialog: isSureDialog,
        dialogMixinsTitle: dialogMixinsTitle,
        isShowDialogMixinsBlueDesc: isShowDialogMixinsBlueDesc,
        dialogMixinsContent: dialogMixinsContent,
        dialogMixinsBtns:btns
      })
    },
    makeSure(e) {
      const item = e.detail
      console.log("888888888",item)
      this.setData({
        isSureDialog: false
      })
      if(item.flag == 'goSetting' ) {
        wxGetOpenSetting()
      }
    }
  }
})