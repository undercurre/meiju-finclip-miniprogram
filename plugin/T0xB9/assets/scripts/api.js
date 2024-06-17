import config from '../../../../config'

const environment = config.environment
const imageDomain = {
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
