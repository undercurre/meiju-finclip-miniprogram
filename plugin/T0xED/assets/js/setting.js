import { requestService } from '../../../../utils/requestService'

module.exports = Behavior({
  data: {
    setting: {},
  },
  methods: {
    async getSetting(sn8) {
      let { data: resp } = await requestService.request('common', {
        msg: 'getAppModelConfig',
        params: { protype: 'ed', sn8: sn8 },
      })
      if (resp.retCode == 0 && resp.result) {
        if (resp.result.config) {
          let setting = JSON.parse(resp.result.config)
          this.setData({ setting })
        }
      } else {
        this.getSetting(sn8)
      }
    },
  },
})
