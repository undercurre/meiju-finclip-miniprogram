import actTemplateApi from './activities/actTemplate-api.js' //运营中后台活动接口
import annualApi from './activities/annual-api.js' //年报接口
const api = {
  ...actTemplateApi,
  ...annualApi,
}
export default api
