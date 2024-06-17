import config from "../../../config";
const environment = config.environment;
const masPrefix = config.masPrefix;
const domain = config.domain;
const api = {
  e3: {
    url: `${domain[`${environment}`] + masPrefix}/cfhrs/e3/v1/api`,
    masUrl: `${domain[`${environment}`] + masPrefix}/cfhrs/e3/v1/api`,
    api: "/cfhrs/e3/v1/api",
  },
};
export default api;
