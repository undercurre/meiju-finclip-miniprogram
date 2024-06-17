import { requestService } from '../../../../../utils/requestService'

const getSettingSn8 = function(sn8) {
    return requestService.request('common', {
        msg: 'getAppModelConfig',
        params: { protype: 'b6', sn8: sn8 },
      }).then(rs => {
          if (rs.data.retCode == 0 && rs.data.result) {
            // let config = "{\"electronic_control_version\":2,\"gear\":[{\"name\":\"关\",\"gear\":0,\"airVolume\":0},{\"name\":\"低速\",\"gear\":1,\"airVolume\":13},{\"name\":\"中速\",\"gear\":2,\"airVolume\":15},{\"name\":\"高速\",\"gear\":3,\"airVolume\":18},{\"name\":\"爆炒\",\"gear\":4,\"airVolume\":22,\"super\":true}],\"funcList\":[{\"name\":\"照明\",\"desc\":\"lights\"},{\"name\":\"延时关机\",\"desc\":\"delayPowerOff\"},{\"name\":\"照明设置\",\"desc\":\"lightSetting\"}]}"
            let config = rs.data.result.config == "" ? "{\"gear\":[{\"name\":\"关\",\"gear\":0,\"airVolume\":0},{\"name\":\"低速\",\"gear\":1,\"airVolume\":13},{\"name\":\"中速\",\"gear\":2,\"airVolume\":15},{\"name\":\"高速\",\"gear\":3,\"airVolume\":18}],\"funcList\":[{\"name\":\"照明\",\"desc\":\"lights\"}]}" : rs.data.result.config;
            console.log('config',config)
            return JSON.parse(config)
          }
      })
};

export default function getSetting(sn8) {
    const setting = getSettingSn8(sn8);
    return setting
    // return setting[code]
}

