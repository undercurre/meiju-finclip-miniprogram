import { requestService } from '../../../../utils/requestService'

const handleSetting = function(setting){
  if(setting.hasUsageReport){
    setting.heatFuncList.push({key:'usageReport'})
    setting.bathFuncList.push({key:'usageReport'})
  }
  return setting
}

module.exports = Behavior({
  data: {
    setting: {},
  },
  methods: {
    async getSetting(sn8) {
      let { data: resp } = await requestService.request('common', {
        msg: 'getAppModelConfig',
        params: { protype: 'e6', sn8: sn8 },
      })
      if (resp.retCode == 0 && resp.result) {
        if (resp.result.config) {
          let setting = JSON.parse(resp.result.config)
          this.setData({ 
              setting: handleSetting(setting)
           })
        } else {
          sn8 = 'default'
          this.getSetting(sn8)
        }
        console.log('获取到的配置表',this.data.setting)
      } else {
        this.getSetting(sn8)
      }
    }
  }
})