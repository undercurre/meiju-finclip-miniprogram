export default {
	fix_low_battery: "电量不足"//	0x0a
	, fix_abnormal_posture: "机器人倾斜"//	0x0b
	, fix_laser_sensor: "雷达被遮挡"//	0x0c
	, fix_edge_sensor: "沿边传感器故障"//	0x0d
	, fix_start_in_forbid_area: "禁区和虚拟墙启动"//	0x0e
	, fix_start_in_strong_magnetic: "强磁场干扰"//	0x0f
	, fix_dust: "尘盒未安装"//	0x01
	, fix_wheel_hang: "机器人悬空"//	0x02
	, fix_wheel_overload: "轮组被卡住"//	0x03
	, fix_side_brush_overload: "边刷被卡住"//	0x04
	, fix_roll_brush_overload: "滚刷被卡住"//	0x05
	,	fix_start_in_forbid_area:"检测到禁区或虚拟墙"//	0x5a
	, fix_start_in_forbid_water_area:"检测到禁区或虚拟墙"//	0x5b
	//,		:"水站禁区启动"//	0x5c  deprecated
	, fix_trapped_in_small_area:"机器人被困"//	0x5d  检测到小区域被困/被障碍物包围时上报：触发条件：10分钟出不了约0.64平米
	, fix_whole_house_clean_with_wrong_partition:"机器人故障"//	0x5e 分房间所给的结果异常
	, fix_dust_engine: "吸尘电机过载"//	0x06
	, fix_front_panel: "碰撞板被卡住"//	0x07
	, fix_radar_mask: "雷达被卡住"//	0x08
	, fix_drop_sensor: "机器人防跌落传感器被遮挡"//	0x09
	, fix_laser_sensor_blocked: "雷达被卡住"//	0x10
	, fix_mopping_board_dropped: "拖地圆盘掉落"//	0x11
	, fix_slipping_and_jamming: "轮子打滑"//	0x12
	, fix_multiple_recharge_attempts: "回充失败"//	0x13
	, fix_vibration_drag_overload: "震动拖过载故障"//	0x14
	, fix_wipe_disk_overload: "拖地圆盘被卡住"//	0x15
	, fix_water_tank_miss: "机器人水箱安装不当"//	0x16
	, fix_wipe_disk_chip_fault: "抹盘芯片故障"//	0x17
	,fix_temperature_too_high		:"机器人温度较高"//	0x18
	,fix_hair_cut_failed		:"无法切割毛发"//	0x20
	, fix_mop_drop_out: "拖地圆盘掉落"//	0x40
	, fix_rotate_time_out: "旋转超时故障"//	0x41
	, fix_no_base_station_in_map		:"回充失败"//	0x42  地图中无基站坐标，回充失败
	, fix_in_forbid_area_or_no_back_route		:"回充失败"//	0x43   用户设置了禁区或虚拟墙，恰好将机器和基站分割在了不同的不连通的区域，回充失败
	,fix_max_retry_times_exceeded		:"回充失败"//	0x44  fix_max_retry_times_exceeded
	,fix_auto_fix_radar_high_temperature_failed		:"机器人故障"//	0x45
	,fix_reach_destination_failed		:"无法到达目标点"//	0x50
	// ,		:"物理碰撞板触发"//	0x51 deprecated
	// ,		:"禁区和虚拟墙启动"//	0x52 deprecated
	// ,		:"机器人悬空"//	0x53 deprecated
	,fix_out_station_failed		:"机器人出站失败"//	0x54
	,fix_escape_environment_failed		:"机器人被困"//	0x55
	,fix_inner_communication_timeout		:"机器人故障"//	0x57  机器人内部通讯超时
	,fix_use_sweep_and_mop_on_carpet		:"检测到地毯"//	0x58
	,fix_start_in_virtual_wall		:"检测到禁区或虚拟墙"//	0x59
	// ,		:"环境信息更新"//	0x80
	// ,		:"机器人故障"//	0x90
	// ,		:"机器人故障"//	0x91
	// ,		:"机器人故障"//	0x92
	// ,		:"机器人故障"//	0x93
	,fix_radar_data_blocked		:"机器人故障"//	0xa0  激光雷达数据反馈阻塞
	, reboot_laser_comm_fail: "激光雷达通讯异常"//	0x01
	, reboot_robot_comm_fail: "主机通讯异常"//	0x02
	, warn_dust_blockage: "风道堵塞"//	0x0a
	, warn_upper_cover_open: "机站面盖被打开"//	0x0b
	, warn_dust_bag_not_installed: "尘袋未安装"//	0x0c
	, warn_dust_bag_full: "尘袋已满"//	0x0d
	, warn_location_fail: "重定位失败"//	0x01
	, warn_low_battery: "BATTERY_LOW_HIT"//	0x02
	, warn_full_dust: "尘盒清理"//	0x03
	, warn_low_water: "水箱缺水"//	0x04
	, warn_multiple_docking_fail: "回充失败"//	0x05
	, warn_down_sensor_blocked: "机器人防跌落传感器被遮挡"//	0x06
	, warn_lack_of_water: "水站清水箱缺水"//	0x6a
	, warn_close_power_fail: "无法继续任务"//	0x6b
	, warn_heat_module_fail: "无法风干拖布"//	0x6d
	, warn_station_water_inject_fail: "注水管卡住"//	0x6e
  // , warn_station_water_box_full: "无法清洗拖布"//	0x6f
  , warn_station_water_box_full: "拖布清洗槽水满"//	0x6f
	, warn_rag_lifting: "拖布升降未到位"//	0x08
	, warn_dust_collection_interrupt: "集尘被异常中断"//	0x09
	, warn_reach_location_fail: "无法到达目标点"//	0x20
	, warn_cache_fail: "机器人防跌落传感器被遮挡"//	0x21
	, warn_start_mop_in_carpet: "请避免在地毯上启动拖地功能"//	0x22
	, warn_start_in_virtual_wall: "检测到禁区或虚拟墙"//	0x23
	, warn_start_in_forbid_water_area: "检测到禁区或虚拟墙"//	0x25
	, warn_comm_disconnect: "蓝牙连接状态异常"//	0x64
  // , warn_machine_miss: "无法清洗拖布"//	0x65
  , warn_machine_miss: "机器人不在站"//	0x65

	, warn_vacuum_water_inject_fail: "注水管卡住"//	0x66
	, warn_sewage_box_full: "水站污水箱已满"//	0x67
	, warn_sewage_box_miss: "水站污水箱不存在"//	0x68
	, warn_water_box_miss: "拖布清洗槽组件安装不当"//	0x69
	, warn_vacuum_water_box_full: "拖地机水箱已满"//	0x70
	, warn_vacuum_water_box_miss: "拖地机水箱不在位"//	0x71
	, warn_vacuum_mop_miss: "拖地机抹盘未安装"//	0x72
	// ,		:"上下水模块安装不当"//	0x75
	// ,		:"基站水位传感器故障"//	0x76
	// ,		:"污水箱异常"//	0x77
	// ,		:"基站滤网安装不当"//	0x78
	,warn_dust_box_full		:"尘袋已满"//	0x79
	,warn_dust_box_cover_not_closed		:"基站集尘面盖被打开"//	0x80
	,warn_dust_bag_not_installed_2		:"尘袋未安装"//	0x81
	,warn_cleaning_liquid_lack		:"清洁液待补充"//	0x83
  // ,warn_water_level_sensor_failed		:"基站水位传感器故障"//	0x86
  ,warn_water_level_sensor_failed		:"基站进水超时"//	0x86
	,warn_strong_liquid_lack		:"强化液待补充"//	0x87
	,warn_base_station_water_level_failed		:"基站水位传感器故障"//	0x88
	,warn_washer_base_station_communication_failed		:"通讯异常"//	0xcc

}