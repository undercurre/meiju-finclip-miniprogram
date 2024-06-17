import config from '../../config.js'
const baseUrl = config.cssDomain[config.environment]
export default {
  brandCategory: `${baseUrl}/c-css/sup-bff-ipms/bff/api/sup/brandprodservice/jwt/getlist`,
}
