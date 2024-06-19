export const E7AiStepProfile = {
    "curState": "work_status",
    "workSwitch":"work_switch",
    "menuName": "user_custom_name",
    "temperature": "temperature",
    "power": "fire_level",
    "setWorkTime": {
        "h": "definite_time_hr",
        "m": "set_work_time_sec"
    },
    "menuType": "menuType",
    "menuId": "work_mode",
    "cookwareStatus":"pan_flag",
    "workStage":"work_stage",
    "workMode":"control_mode",
    "workTimeLeft":{
        "h": "time_surplus_hr",
        "m": "time_surplus_min"
    },
    "workTime":{
        "h": "time_running_hr",
        "m": "time_running_min"
    },
    "menuStep":"work_stage",
    "curStepStatus":"cur_step_status",
    "userDefineId":"user_custom_id",
    "deviceErrorCode": "error_code",
    "totalStep":"total_step",
    "flagCurStepFinish":"flag_cur_step_finish",
    "flagLastStepHeat":"flag_last_step_heat",
    "flagLastStepTimeout":"flag_last_step_timeout",
    "flagAutoSkip":"flag_auto_skip",
    "flagAirRecovery":"flag_air_recovery",
    "mainStep":"cur_step",
    "workTimeLeftSeconds":"remain_work_time_sec",
    "diyTotalStep":"diy_total_step",
    "diyCurStep":"diy_cur_step",
    "STATUS_MAP":{
        "standby":"0",
        "schedule":"1",
        "free":"5",
        "pause":"3",
        "power_off":"4",
        "cooking":"2",
        "keep_warm":"6",
        "error":"7"
    },
    "STRING_MAP":{
        "0":"cancel",
        "1":"schedule",
        "2":"work",
        "3":"pause",
        "4":"power_off",
        "5":"power_on",
        "6":"next_step",
        "7":"air_params",
        "8":"air_work",
        "9":"air_pause",
        "10":"air_cancel",
        "11":"air_finish"
    }
}
