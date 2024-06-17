import { requestService } from '../../../../../utils/requestService'

const getSettingSn8 = function(sn8) {
    return requestService.request('common', {
        msg: 'getAppModelConfig',
        params: { protype: '9c', sn8: sn8 },
      }).then(rs => {
          if (rs.data.retCode == 0 && rs.data.result) {
            let config = rs.data.result.config == "" ? "{\"total\":{\"powerCtrl\":false},\"equipments\":[\"b7_left\",\"b7_right\",\"b6\"],\"b6\":{\"gear\":[{\"name\":\"关\",\"value\":0},{\"name\":\"低\",\"value\":1},{\"name\":\"中\",\"value\":2},{\"name\":\"高\",\"value\":3},{\"name\":\"强\",\"value\":4}]}}" : rs.data.result.config;
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

