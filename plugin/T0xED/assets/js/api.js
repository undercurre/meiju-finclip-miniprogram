import config from '../../../../config'
import { imgBaseUrl } from '../../../../api'

const environment = config.environment
const imageDomain = {
  // 'dev': imgBaseUrl.url+'/plugin',
  // 'sit': imgBaseUrl.url+'/plugin',
  // 'prod': imgBaseUrl.url+'/plugin',
  dev: 'https://www.smartmidea.net/projects/sit/meiju-lite-assets/plugin',
  sit: 'https://www.smartmidea.net/projects/sit/meiju-lite-assets/plugin',
  prod: 'https://www.smartmidea.net/projects/sit/meiju-lite-assets/plugin',
}

let imageApi = {
  environment: environment,
  getImagePath: {
    url: `${imageDomain[`${environment}`]}`,
  },
}

export { imageApi }
