// plugin/T0x9C/card/card.js
import cardMode, { CARD_MODE_OPTION } from '../../../pages/common/js/cardMode';
import { requestService } from '../../../utils/requestService';
import { api,environment} from '../../../api'
import { getReqId, getStamp, dateFormat } from 'm-utilsdk/index'
import images from './assets/js/img.js';
import { getEqImgUrl} from './assets/js/eqImgUrl.js'
import getSetting from './assets/js/setting';
import { actTemplateImgApi, actTemplateH5Addr } from '../../../api.js';
import { pluginEventTrack } from '../../../track/pluginTrack.js'
import { UI } from './assets/js/ui';

let btnPressTimer, queryTimer, errorDialogShow = false;
const errorShow = function() {
  if (!errorDialogShow) {
      errorDialogShow = true;
      wx.showModal({
          title: '集成灶故障',
          content: ["请立即关闭集成灶","若不能自行解决","请联系专业维修人员","400-889-9315"].join('\n'),
          showCancel: false,
          success: () => {
              errorDialogShow = false;
          } 
      });
  }
}
Component({
  options: {
    multipleSlots: true
  },
  properties: {
      applianceData: {
          type: Object,
          value: function() {
              return {};
          }
      }
  },
  data: {
    images,
    _applianceData: {},
    deviceApplianceData: {},
    isCardActived: false,
    gear: [],
    listData: [],
    sliderValue: 1,
    gearName: '',
    enableStr: '0',
    cardHeight: 360 * 3 + 24 * 3,
    imageWidth: 0,
    imageHeight: 0,
    allPowerCtrl: false,
    viewHeight: 0,
    totalStatus: 'off',
    activityState: true,
    imgUrl: actTemplateImgApi.url,
    activityUrl: 'https://midea-video.oss-cn-hangzhou.aliyuncs.com/popEventIcon/b7/b7event.png',
    activityArr: [],
    imageUrl: ''
  },
  methods: {
    getCurrentMode() {
        return {
            applianceCode: this.data._applianceData.applianceCode,
            mode:
                this.data._applianceData.onlineStatus == 1
                    ? CARD_MODE_OPTION.COLD
                    : CARD_MODE_OPTION.OFFLINE
        };
    },
    getActived() {
        this.triggerEvent('modeChange', this.getCurrentMode());
        this.setData({isCardActived: true});
        this.query();
    },
    getDestoried() {
        this.setData({isCardActived: false});
        if (queryTimer) clearTimeout(queryTimer);
    },
    query(showLoading = true) {
        requestService
        .request('luaGet', {
            applianceCode: this.properties.applianceData.applianceCode,
            command: { },
            reqId: getStamp().toString(),
            stamp: getStamp()
        })
        .then(rs => {
            wx.hideLoading();
            console.log(rs)
            this.setData({ 
                _applianceDataStatus: rs.data.data
            });
            this.rendering(this.data._applianceDataStatus);
        })
        .catch(err => {
            wx.hideLoading();
            if(err.data != undefined) {
                if (err.data.code == '1307') {
                    this.setData({ '_applianceData.onlineStatus': '0' });
                    this.triggerEvent('modeChange', this.getCurrentMode());
                    // 设备离线
                } else if (err.data.code == '1306' && showLoading) {
                    wx.showToast({ title: '设备未响应，请稍后尝试刷新', icon: 'none', duration: 2000 });
                }
                
                queryTimer = setTimeout(() => this.query(false), 5000); // 刷新失败5秒后重试 
            }
        });
    },
    requestControl(control) {
        if (this.checkWorkStatusError()) {
            return Promise.reject();
        }
        wx.showLoading({
            mask: true,
            title: '加载中'
        });
        return requestService
            .request('luaControl', {
                applianceCode: this.properties.applianceData.applianceCode,
                command: { control },
                reqId: getStamp().toString(),
                stamp: getStamp()
            })
            .then(rs => {
                wx.hideLoading();
                console.log(control)
                var dataStatus = this.data._applianceDataStatus
                console.log(rs)
                for(var x in rs.data.data.status) {
                    dataStatus[x] = rs.data.data.status[x]
                    if(x == 'b6_power' && rs.data.data.status[x] == 'off') {
                        dataStatus.b6_gear = 0
                    }
                }
                this.setData({ 
                    _applianceDataStatus: dataStatus
                });
                
                if(control.sp_func == 'fandrying') {
                    setTimeout(() => this.query(true), 1000)
                }
                else {
                    this.rendering(dataStatus);
                }
            })
            .catch(err => {
                console.log(err)
                wx.hideLoading();
                wx.showToast({
                    title: '请求失败，请稍后重试',
                    icon: 'none',
                    duration: 2000
                });
                throw new Error('请求失败，请稍后重试');
            });
    },
    checkWorkStatusError(status) {
        const appData = this.data._applianceDataStatus || {};
        if (
            (appData.total_error_type &&
              appData.total_error_type != '0') ||
            (appData.total_error_code && appData.total_error_code != '0')
        ){
            errorShow();
            return true;
        } 
        return false;
    },
    sliderChange: function(e) {
        let params = {};
        if(e.detail.value == 0) {
            params.type = 'b6',
            params.b6_power = 'off'
            params.b6_light = this.data.enableStr == '0' ? 'off' : 'on'
            params.electronic_control_version = 1
            params.wind_type = 5
        }
        else {
            params.type = 'b6',
            params.b6_gear = e.detail.value
            params.b6_light = this.data.enableStr == '0' ? 'off' : 'on'
            params.electronic_control_version = 1
            params.wind_type = 5
        }
        this.requestControl(params)
        pluginEventTrack('user_behavior_event', null, {
            page_id: 'page_control',
            page_name: '插件首页',
            widget_id: 'click_b6_gear',
            widget_name: '烟机档位',
            ext_info: params.b6_gear + '档'
        })
    },
    dofSwitchChanged: function(e) {
        var that = this
        let enable = String(that.data.enableStr) === '1' ? 0 : 1;
        let params = {};
        if(enable == '0') {
            params.type = 'b6',
            params.b6_light = 'off'
            params.electronic_control_version = 1
            params.wind_type = 5
        }
        else {
            params.type = 'b6',
            params.b6_light = 'on'
            params.electronic_control_version = 1
            params.wind_type = 5
        }
        this.setData({
            enableStr: enable
        })
        this.requestControl(params)
        pluginEventTrack('user_behavior_event', null, {
            page_id: 'page_control',
            page_name: '插件首页',
            widget_id: 'click_b6_light',
            widget_name: '烟机照明',
            ext_info: params.b6_light === 'on' ? '开' : '关',
        })
    },
    startModel: function(e) {
        wx.showLoading({
            mask: true,
            title: '加载中'
        });
        let params = {}
        var deviceType = e.currentTarget.id
        let deviceName = ''
        const appData = this.data._applianceDataStatus || {};
        switch (deviceType) {
            case 'b3_disinfect':
                params.type = 'b3'
                params.b3_work_cabinet_control = 1
                params.b3_function_control = 2
                deviceName = '消毒柜'
                break;
            case 'b3_warm':
                break;
            case 'sp_fandrying':
                params.type = 'sp',
                params.sp_func = 'fandrying'
                params.sp_fandrying_status = 'on'
                params.electronic_control_version = 1
                params.wind_type = 5
                deviceName = '抑菌存储柜'
                break;
            case 'sp_heatingdisk':
                params.type = 'sp',
                params.sp_func = 'heatingdisk'
                params.sp_heatingdisk_status = 'on'
                params.electronic_control_version = 1
                params.wind_type = 5
                deviceName = '暖盘'
                break;
            case 'b2_steam': 
                params.type = 'b2'
                params.b2_work_func = 32
                params.b2_work_cabinet_control = 1
                params.b2_work_status = 'working'
                params.b2_destination_temp = 100
                params.b2_work_destination_time = 1200
                params.electronic_control_version = 1
                params.wind_type = 5
                deviceName = '蒸箱'
                break;
            case 'b2_bake':
                params.type = 'b2'
                params.b2_work_func = 76
                params.b2_work_cabinet_control = 2
                params.b2_work_status = 'working'
                params.b2_destination_temp = 180
                params.b2_work_destination_time = 2700
                params.electronic_control_version = 1
                params.wind_type = 5
                deviceName = '烤箱'
                break;
            case 'b2_bakeAndBake':
                params.type = 'b2'
                params.b2_work_func = 32
                params.b2_work_cabinet_control = 1
                params.b2_work_status = 'working'
                params.b2_destination_temp = 100
                params.b2_work_destination_time = 1200
                params.electronic_control_version = 1
                params.wind_type = 5
                deviceName = '蒸烤箱'
                break;
            case 'sp_UVdisinfect':
                params.type = 'sp',
                params.sp_func = 'uvc'
                params.sp_uvc_status = 'on'
                params.electronic_control_version = 1
                params.wind_type = 5
                deviceName = 'UV杀菌柜'
                break;
            case 'total':
                params.type = 'total',
                params.total_power = 'on',
                params.electronic_control_version = 1,
                params.wind_type = 5
                deviceName = '整机'
                break;
            default:
                break;
        }
        if(appData.b6_work_status == 'clean' || appData.b6_work_status == 'hotclean') {
            wx.showToast({ title: '烟机清洁中，请在清洁结束后再启动', icon: 'none', duration: 3000 });
            return;
        }
        if(deviceType == 'b2_steam' || deviceType == 'b2_bake' || deviceType == 'b2_bakeAndBake' || deviceType == 'b3_disinfect') {
            this.requestDeviceControl(params, deviceType)
        }
        else {
            this.requestControl(params)
        }
        pluginEventTrack('user_behavior_event', null, {
            page_id: 'page_control',
            page_name: '插件首页',
            widget_id: `click_${deviceType}_power`,
            widget_name: `${deviceName}开关`,
            ext_info: '开'
        })
    },
    closeModel: function(e) {
        let params = {}
        let remindTitle = ''
        let remindContent = ''
        let deviceName = ''
        let deviceType = e.currentTarget.id
        switch (deviceType) {
            case 'b7_left':
                remindTitle = '关火提示'
                remindContent = '是否确定关火？关火后请手动复位旋钮'
                params.type = 'b7'
                params.b7_work_burner_control = 1
                params.b7_function_control = 1
                deviceName = '左灶'
                break;
            case 'b7_right':
                remindTitle = '关火提示'
                remindContent = '是否确定关火？关火后请手动复位旋钮'
                params.type = 'b7'
                params.b7_work_burner_control = 2
                params.b7_function_control = 1
                deviceName = '右灶'
                break; 
            case 'b3_disinfect':
                remindTitle = '关闭提示'
                remindContent = '是否确认要关闭消毒柜？'
                params.type = 'b3'
                params.b3_work_cabinet_control = 1
                params.b3_function_control = 1
                deviceName = '消毒柜'
                break;    
            case 'b3_warm':
                remindTitle = '关闭提示'
                remindContent = '是否确认要关闭保温柜？'
                params.type = 'b3'
                params.b3_work_cabinet_control = 1
                params.b3_function_control = 1
                break;
            case 'sp_fandrying': 
                remindTitle = '关闭提示'
                remindContent = '是否确认要关闭抑菌存储柜？'
                params.type = 'sp'
                params.sp_func = 'fandrying'
                params.sp_fandrying_status = 'off'
                deviceName = '抑菌存储柜'
                break;
            case 'sp_heatingdisk': 
                remindTitle = '关闭提示'
                remindContent = '是否确认要关闭暖盘？'
                params.type = 'sp'
                params.sp_func = 'heatingdisk'
                params.sp_heatingdisk_status = 'off'
                deviceName = '暖盘'
                break;              
            case 'b2_steam': 
                remindTitle = '关闭提示'
                remindContent = '是否确认要关闭蒸箱？'
                params.type = 'b2'
                params.b2_work_cabinet_control = 1
                params.b2_work_status = 'power_off'
                deviceName = '蒸箱'
                break;
            case 'b2_bake':
                remindTitle = '关闭提示'
                remindContent = '是否确认要关闭烤箱？'
                params.type = 'b2'
                params.b2_work_cabinet_control = 2
                params.b2_work_status = 'power_off'
                deviceName = '烤箱'
                break;
            case 'b2_bakeAndBake':
                remindTitle = '关闭提示'
                remindContent = '是否确认要关闭蒸烤箱？'
                params.type = 'b2'
                params.b2_work_cabinet_control = 2
                params.b2_work_status = 'power_off'
                deviceName = '蒸烤箱'
                break;
            case 'sp_UVdisinfect':
                remindTitle = '关闭提示'
                remindContent = '是否确认要关闭UV消毒柜？'
                params.type = 'sp'
                params.sp_func = 'uvc'
                params.sp_uvc_status = 'off'
                deviceName = 'UV杀菌柜'
                break;
            case 'total':
                remindTitle = '关闭提示'
                remindContent = '关闭总开关将关闭所有运行中的设备，确定关闭吗？'
                params.type = 'total'
                params.total_power = 'off',
                params.electronic_control_version = 1,
                params.wind_type = 5
                deviceName = '整机'
                break;
            default:
                break;
        }
        wx.showModal({
            title: remindTitle,
            content: remindContent,
            success: (res) => {
                if (res.confirm) {
                    wx.showLoading({
                        mask: true,
                        title: '加载中'
                    });
                    this.requestControl(params)
                    pluginEventTrack('user_behavior_event', null, {
                        page_id: 'page_control',
                        page_name: '插件首页',
                        widget_id: `click_${deviceType}_power`,
                        widget_name: `${deviceName}开关`,
                        ext_info: '关'
                    })
                } 
                else if (res.cancel) {}
            }  
        })
    },
    rendering(status) {
      if (queryTimer) clearTimeout(queryTimer);
      queryTimer = setTimeout(() => this.query(false), 3000)
      console.log(status)

      var sliderStr = ''
      for(var i = 0; i < this.data.gear.length; i++) {
          if(this.data.gear[i].value == status.b6_gear) {
              sliderStr = this.data.gear[i].name
          }
          else if(status.b6_gear > 4) {
              sliderStr = this.data.gear[this.data.gear.length - 1].name
          }
          else if(status.b6_work_status == 'mute_gear'){
            sliderStr = '静吸'
          }else if(status.b6_work_status == 'power_off_delay'){
            sliderStr = '延时关机'
            status.b6_gear = 1;
          }else if(status.b6_work_status == 'clean' || status.b6_work_status == 'hotclean'){
            sliderStr = '清洗'
          }
      }

      this.checkWorkStatusError()
      
      var newList = this.data.listData
      var setTimeStr = '剩余时间 | ' + (status.b7_left_remaining_time % 60 == 0 ? parseInt(status.b7_left_remaining_time / 60) : (parseInt(status.b7_left_remaining_time / 60) + 1) + '分钟')
      var rightSetTimeStr = '剩余时间 | ' + (status.b7_right_remaining_time % 60 == 0 ? parseInt(status.b7_right_remaining_time / 60) : (parseInt(status.b7_right_remaining_time / 60) + 1) + '分钟')
      for(var i = 0;i<newList.length;i++) {
          if(newList[i].type == 'b7_left') {
              newList[i].status = status.b7_left_status
              newList[i].model = status.b7_left_status == 'power_off' ? '未启动' : (status.b7_left_status == 'power_off_delay' ? setTimeStr : '工作中') 
          }
          else if(newList[i].type == 'b7_right') {
            newList[i].status = status.b7_right_status
            newList[i].model = status.b7_right_status == 'power_off' ? '未启动' : (status.b7_right_status == 'power_off_delay' ? rightSetTimeStr : '工作中') 
          }
          else if(newList[i].type == 'b3_disinfect') {
            newList[i].status = status.b3_upstair_status
            var timeStr = status.b3_upstair_remaining_time % 60 == 0 ? parseInt(status.b3_upstair_remaining_time) / 60 : (parseInt(status.b3_upstair_remaining_time / 60)) + 1
            if(status.b3_upstair_door_lock == '1') {
                newList[i].model = status.b3_upstair_status == 'uperization_pause' ? '消毒暂停' : '烘干暂停'
            }
            else {
                newList[i].model = status.b3_upstair_status == 'power_off' ? '未启动' : (status.b3_upstair_status == 'uperization' ? '消毒 | ' + (status.b3_upstair_remaining_time != undefined ? timeStr : '120') + '分钟' : '烘干 | ' + (status.b3_upstair_remaining_time != undefined ? timeStr : '60') + '分钟')
            }
          }
          else if(newList[i].type == 'sp_fandrying') {
            var timeStr = parseInt(status.sp_fandrying_destination_time != undefined ? status.sp_fandrying_destination_time : 3600 / 60)
            if(status.sp_fandrying_remaining_time != undefined) {
                timeStr = status.sp_fandrying_remaining_time % 60 == 0 ? parseInt(status.sp_fandrying_remaining_time / 60) : parseInt(status.sp_fandrying_remaining_time / 60) + 1
            }
            var nowStatusStr = '剩余时间：' + timeStr + '分钟'
            newList[i].status = status.sp_fandrying_status
            if(status.sp_fandrying_status == 'order') {
                newList[i].model = '预约剩余时间：' + status.sp_fandrying_order_remaining_time + '分钟'
            }
            else {
                newList[i].model = status.sp_fandrying_status == 'off' ? '未启动' : nowStatusStr
            }
          }
          else if(newList[i].type == 'sp_heatingdisk') {
            var timeStr = status.sp_heatingdisk_remaining_time % 60 == 0 ? status.sp_heatingdisk_remaining_time / 60 : parseInt(status.sp_heatingdisk_remaining_time / 60) + 1
            var nowStatusStr =  status.sp_heatingdisk_destination_time == status.sp_heatingdisk_remaining_time ? '预热中' : '剩余时间：' + timeStr + '分钟'
            newList[i].status = status.sp_heatingdisk_status
            if(status.sp_heatingdisk_status == 'order') {
                newList[i].model = '预约开启剩余：' + status.sp_heatingdisk_order_remaining_time + '分钟'
            }
            else {
                newList[i].model = status.sp_heatingdisk_status == 'off' ? '未启动' : nowStatusStr
            }
          }
          else if(newList[i].type == 'sp_UVdisinfect') {
            var timeStr = parseInt(status.sp_uvc_destination_time / 60)
            if(status.sp_uvc_remaining_time != undefined) {
                timeStr = status.sp_uvc_remaining_time % 60 == 0 ? parseInt(status.sp_uvc_remaining_time / 60) : parseInt(status.sp_uvc_remaining_time / 60) + 1
            }
            var nowStatusStr = '剩余时间：' + timeStr + '分钟'
            newList[i].status = status.sp_uvc_status
            if(status.sp_uvc_status == 'order') {
                newList[i].model = '预约剩余时间：' +  status.sp_uvc_order_remaining_time + '分钟'
            }
            else {
                newList[i].model = status.sp_uvc_status == 'off' ? '未启动' : nowStatusStr
            }
          }
          else if(newList[i].type == 'b2_steam') {
            var timeStr = status.b2_upstair_work_remaining_time % 60 == 0 ? parseInt(status.b2_upstair_work_remaining_time / 60) : parseInt(status.b2_upstair_work_remaining_time / 60) + 1
            var statusStr = status.b2_upstair_destination_temp + '℃ | ' +  timeStr + '分钟'
            newList[i].status = status.b2_upstair_work_status
            newList[i].model = status.b2_upstair_work_status == 'power_off' ? '未启动' : statusStr
          }
          else if(newList[i].type == 'b2_bake') {
            var timeStr = status.b2_downstair_work_remaining_time % 60 == 0 ? parseInt(status.b2_downstair_work_remaining_time / 60) : parseInt(status.b2_downstair_work_remaining_time / 60) + 1
            var statusStr = status.b2_downstair_destination_temp + '℃ | ' + timeStr + '分钟'
            newList[i].status = status.b2_downstair_work_status
            newList[i].model = status.b2_downstair_work_status == 'power_off' ? '未启动' : statusStr
          }
          else if(newList[i].type == 'b2_steamAndBake') {
            var timeStr = status.b2_upstair_work_remaining_time % 60 == 0 ? parseInt(status.b2_upstair_work_remaining_time / 60) : parseInt(status.b2_upstair_work_remaining_time / 60) + 1
            var statusStr = status.b2_upstair_destination_temp + '℃ | ' +  timeStr + '分钟'
            newList[i].status = status.b2_upstair_work_status
            newList[i].model = status.b2_upstair_work_status == 'power_off' ? '未启动' : statusStr
          }
      }

      this.setData({
          sliderValue: status.b6_gear,
          gearName: sliderStr,
          enableStr: status.b6_light == 'off' ? '0' : '1',
          listData: newList,
          totalStatus: status.total_power  
      })
    },
    imageLoad: function(e) {
        this.setData({
            imageWidth: e.detail.width,
            imageHeight: e.detail.height
        })
    },
    requestDeviceControl(params, deviceType){
        requestService
        .request('getDeviceStatus', {
            deviceId: this.properties.applianceData.applianceCode,
        })
        .then(rs => {
            var deviceData = rs.data.data
            console.log(deviceData)
            if(deviceType == 'b2_steam') {
                params.b2_work_func = (deviceData.b2_upstairs_target_temp == '0' && deviceData.b2_upstairs_target_time == '0') ? 32 : parseInt(deviceData.b2_upstairs_func, 16)
                params.b2_destination_temp = deviceData.b2_upstairs_target_temp == '0' ? 100 : parseInt(deviceData.b2_upstairs_target_temp)
                params.b2_work_destination_time = deviceData.b2_upstairs_target_time == '0' ? 1800 : parseInt(deviceData.b2_upstairs_target_time)
                params.b2_work_menu = parseInt(deviceData.b2_upstairs_menu, 16)
            }
            else if(deviceType == 'b2_bake') {
                params.b2_work_func = (deviceData.b2_downstairs_target_temp == '0' && deviceData.b2_downstairs_target_time == '0') ? 75 : parseInt(deviceData.b2_downstairs_func, 16)
                params.b2_destination_temp = deviceData.b2_downstairs_target_temp == '0' ? 150 : parseInt(deviceData.b2_downstairs_target_temp)
                params.b2_work_destination_time = deviceData.b2_downstairs_target_time == '0' ? 1200 : parseInt(deviceData.b2_downstairs_target_time)
                params.b2_work_menu = parseInt(deviceData.b2_downstairs_menu, 16)
            }
            else if(deviceType == 'b2_steamAndBake') {
                params.b2_work_func = (deviceData.b2_upstairs_target_temp == '0' && deviceData.b2_upstairs_target_time == '0') ? 32 : parseInt(deviceData.b2_upstairs_func, 16)
                params.b2_destination_temp = deviceData.b2_upstairs_target_temp == '0' ? 100 : parseInt(deviceData.b2_upstairs_target_temp)
                params.b2_work_destination_time = deviceData.b2_upstairs_target_time == '0' ? 1800 : parseInt(deviceData.b2_upstairs_target_time)
                params.b2_work_menu = parseInt(deviceData.b2_upstairs_menu, 16)
            }
            else {
                var b3Mode = deviceData.b3_mode
                if(b3Mode == '03' || b3Mode == '01') {
                    b3Mode = '02'
                }
                else if (b3Mode == '05' || b3Mode == '06' || b3Mode == '07'){
                    b3Mode = '04'
                }
                params.type = 'b3'
                params.b3_work_cabinet_control = 1
                params.b3_function_control = deviceData.b3_mode == '00' ? 2 : parseInt(b3Mode, 16)
            }
            console.log(deviceData.b3_mode)
            console.log(params)
            this.requestControl(params)
        })
        .catch(err => {
            console.log(err)
            wx.hideLoading();
        });
    },
    clickToWebView(e) {
        var selectIndex = parseInt(e.currentTarget.id)
        var currLink = this.data.activityArr[selectIndex].jumpLink
        let encodeLink = encodeURIComponent(currLink)
        let currUrl = `../../../pages/webView/webView?webViewUrl=${encodeLink}`
        wx.navigateTo({
          url: currUrl,
        })
    },
    toastTips(e) {
        const item = e.currentTarget.dataset.item
        if(item.type == 'b7_left' || item.type == 'b7_right'){
            UI.toast("小程序端无法开火，请在设备上开火");
        }
    }
  },
  async attached() {
    const setting = await getSetting(this.properties.applianceData.sn8);
    var newList = []
    for(var i = 0; i < setting.equipments.length; i++) {
        if(setting.equipments[i] == 'b7_left') {
            var equipmentsObj = {name: '左灶', bgImage: images.zaoJu_on, iconImage: images.zaoJu, type: 'b7_left',bgColor: '#FFAA0D',status: 'power_off', model: '未启动'}
            newList.push(equipmentsObj)
        }
        else if(setting.equipments[i] == 'b7_right') {
            var equipmentsObj = {name: '右灶', bgImage: images.zaoJu_on, iconImage: images.zaoJu, type: 'b7_right',bgColor: '#FFAA0D',status: 'power_off', model: '未启动'}
            newList.push(equipmentsObj)
        }
        else if(setting.equipments[i] == 'b3_disinfect') {
            var equipmentsObj = {name: '消毒柜', bgImage: images.xiaoDuGui_on, iconImage: images.xiaoDuGui, type: 'b3_disinfect',bgColor: '#6575FF',status: 'power_off', model: '未启动'}
            newList.push(equipmentsObj)
        }
        else if(setting.equipments[i] == 'b3_warm') {
            var equipmentsObj = {name: '保温柜', bgImage: images.nuanDiePan_on, iconImage: images.nuanDiePan, type: 'b3_warm',bgColor: '#FFAA0D',status: 'power_off', model: '未启动'}
            newList.push(equipmentsObj)
        }
        else if(setting.equipments[i] == 'b2_steam') {
            var equipmentsObj = {name: '蒸箱', bgImage: images.zhengXiang_on, iconImage: images.zhengXiang, type: 'b2_steam',bgColor: '#FF8225',status: 'power_off', model: '未启动'}
            newList.push(equipmentsObj)
        }
        else if(setting.equipments[i] == 'b2_bake') {
            var equipmentsObj = {name: '烤箱', bgImage: images.kaoXiang_on, iconImage: images.kaoXiang, type: 'b2_bake',bgColor: '#FF6A4C',status: 'power_off', model: '未启动'}
            newList.push(equipmentsObj)
        }
        else if(setting.equipments[i] == 'b2_steamAndBake') {
            var equipmentsObj = {name: '蒸烤箱', bgImage: images.kaoXiang_on, iconImage: images.zhengXiang, type: 'b2_steamAndBake',bgColor: '#FF6A4C',status: 'power_off', model: '未启动'}
            newList.push(equipmentsObj)
        }
        else if(setting.equipments[i] == 'e7') {
            var equipmentsObj = {name: '电磁炉', bgImage: images.dianCiLu_on, iconImage: images.dianCiLu, type: 'e7',bgColor: '#FFAA0D',status: 'power_off', model: '未启动'}
            newList.push(equipmentsObj)
        }
        else if(setting.equipments[i] == 'sp_heatingdisk') {
            var equipmentsObj = {name: '暖盘', bgImage: images.nuanDiePan_on, iconImage: images.nuanDiePan, type: 'sp_heatingdisk',bgColor: '#FFAA0D',status: 'power_off', model: '未启动'}
            newList.push(equipmentsObj)
        }
        else if(setting.equipments[i] == 'sp_fandrying') {
            var equipmentsObj = {name: '抑菌存储柜', bgImage: images.yinJunCunChuGui_on, iconImage: images.yinJunCunChuGui, type: 'sp_fandrying',bgColor: '#6575FF',status: 'power_off', model: '未启动'}
            newList.push(equipmentsObj)
        }
        else if(setting.equipments[i] == 'sp_UVdisinfect') {
            var equipmentsObj = {name: 'UV杀菌柜', bgImage: images.uvShaJunGui_on, iconImage: images.uvShaJunGui, type: 'sp_UVdisinfect',bgColor: '#6575FF',status: 'power_off', model: '未启动'}
            newList.push(equipmentsObj)
        }
    }
    this.setData({
        _applianceData: this.properties.applianceData,
        listData: newList,
        gear: setting.b6.gear,
        allPowerCtrl: setting.total.powerCtrl,
        imageUrl: getEqImgUrl(this.properties.applianceData.sn8)
    })
    console.log(this.properties.applianceData.applianceCode)
    requestService
        .request('getDeviceStatus', {
            deviceId: this.properties.applianceData.applianceCode,
        })
        .then(rs => {
            console.log(rs)
        })        
        .catch(err => {
            console.log(err)
        });
  }
})