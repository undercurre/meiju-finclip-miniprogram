

import { requestService } from '../../../../../utils/requestService'

module.exports = Behavior({
  behaviors: [],
  data: {
    deviceStatus: {},//设备状态
  },

  methods: {
    //主动查询
    luaQuery(applianceCode, param={}) {
      return new Promise((resolve, reject) => {
        let command = param.query_type !== undefined ? {"query": param } : {};
        let reqData = {
          stamp: +new Date(),
          reqId: +new Date(),
          applianceCode: applianceCode,
          command: command,
        };
        requestService.request("luaGet", reqData).then(
          (res) => {
            if (res.data.code == 0) {
              resolve(res.data.data || {});
            } else {
              reject(res);
            }
          },
          (error) => {
            console.error("luaGet error: ", error);
            reject(error);
          }
        );

      })
    },

    //设备控制
    luaControl(applianceCode, param, status) {
      return new Promise((resolve, reject) => {
        let reqData = {
          stamp: +new Date(),
          reqId: +new Date(),
          applianceCode: applianceCode,
          command: {
            control: param,
          },
        };
        console.log("当前信息:",reqData.command);
        if (status) {
          reqData.command.status = status;
        }
        requestService.request("luaControl", reqData).then(
          (res) => {
            console.log("luaControl result: ", res);
            if (res.data.code == 0) {
              resolve(res.data.data.status || {});
            } else {
              reject(res);
            }
          },
          (error) => {
            console.error("luaControl error: ", error);
            reject(error);
            wx.showToast({
              title: '操作失败，请重试',
              icon: 'none',
              duration: 3000
            })
          }
        );
      }); 
    }

  }
  
})