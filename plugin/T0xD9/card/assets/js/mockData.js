const mockData = {
  luaGet: {
    code: 0,
    msg: null,
    data: {
      db: {
        bucket: 'db',
        db_position: '1',
        db_remain_time: '45',
        db_power: 'on',
        db_running_status: 'start',
        db_error_code: '0',
      },
      da: {
        bucket: 'da',
        da_position: '0',
        da_remain_time: '20',
        da_power: 'off',
        da_running_status: 'standby',
        da_error_code: '0',
      },
      dc: {
        bucket: 'dc',
        dc_position: '0',
        dc_remain_time: '22',
        dc_power: 'on',
        dc_running_status: 'standby',
        dc_error_code: '0',
      },
    },
  },
}
export { mockData }
