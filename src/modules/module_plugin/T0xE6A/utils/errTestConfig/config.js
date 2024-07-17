/*
0     ：无故障
1     ：点火失败（E1）
2     ：意外熄火（E1）
3     ：伪火（E2）
4     ：残火（E2）
5     ：机械温控器过热保护故障（E3）
6     ：采暖出水温度探头过热保护（E4）
7     ：风压故障或风机故障（E5）
8     ：电磁阀驱动电路故障（E6）
9     ：水压故障（E7）
10    ：水泵卡死（E8）
11    ：供暖出水温度传感器 短路 F0
12    ：供暖出水温度传感器 断路 F0
13    ：结冰故障 F2
14    ：卫浴出水温度传感器 短路 F3
15    ：卫浴出水温度传感器 断路 F3
16    ：供暖出水温度异常,探头脱落 F4
17    ：卫浴出水温度异常,探头脱落 F5
18    ：冷凝水堵塞 EF
19    ：燃气泄漏故障 FE
20    ：主板和显示板通信失败 EC
21    ：卫浴超时报警 EE
22    ：CO报警 EA
23    ：水路堵塞故障 C5

31    ：残火（C1）                                            
32    ：点火失败（C0）
33    ：零冷水故障C4
*/
const errMap = {
  errMsgMap: {
    "0": {
      errType: "无故障",
      errCode: "0",
      errDesc: "",
    },
    "1": {
      errType: "点火失败",
      errCode: "E1",
      errDesc: "点火失败",
    },
    "2": {
      errType: "意外熄火",
      errCode: "0",
      errDesc: "意外熄火",
    },
    "3": {
      errType: "伪火",
      errCode: "E2",
      errDesc: "伪火故障",
    },
    "4": {
      errType: "残火",
      errCode: "C1",
      errDesc: "残火",
    },
    "5": {
      errType: "机械温控器过热保护故障",
      errCode: "E3",
      errDesc: "机械温控器过热保护故障",
    },
    "6": {
      errType: "采暖出水温度探头过热保护",
      errCode: "E4",
      errDesc: "采暖温度探头过热保护(≥95℃)",
    },
    "7": {
      errType: "风压故障或风机故障",
      errCode: "E5",
      errDesc: "风压故障或风机故障",
    },
    "8": {
      errType: "电磁阀驱动电路故障",
      errCode: "E6",
      errDesc: "电磁阀驱动电路故障",
    },
    "9": {
      errType: "水压故障（E7）",
      errCode: "E7",
      errDesc: "水压故障",
    },
    "10": {
      errType: "水泵卡死",
      errCode: "E8",
      errDesc: "卫浴管道（零冷水）水泵故障",
    },
    "11": {
      errType: "供暖出水温度传感器 短路 F0",
      errCode: "F0",
      errDesc: "",
    },
    "12": {
      errType: "供暖出水温度传感器 断路 F0",
      errCode: "F0",
      errDesc: "供暖出水温度传感器 断路",
    },
    "13": {
      errType: "结冰故障",
      errCode: "F2",
      errDesc: "结冰故障（≤1℃）",
    },
    "14": {
      errType: "卫浴出水温度传感器 短路 F3",
      errCode: "F3",
      errDesc: "卫浴出水温度传感器故障",
    },
    "15": {
      errType: "卫浴出水温度传感器 断路 F3",
      errCode: "F3",
      errDesc: "卫浴出水温度传感器故障",
    },
    "16": {
      errType: "供暖出水温度异常,探头脱落 F4",
      errCode: "F4",
      errDesc: "采暖温度探头脱落故障",
    },
    "17": {
      errType: "卫浴出水温度异常,探头脱落 F5",
      errCode: "F5",
      errDesc: "卫浴出水温度探头脱落故障",
    },
    "18": {
      errType: "冷凝水堵塞 EF",
      errCode: "EF",
      errDesc: "冷凝水堵塞",
    },
    "19": {
      errType: "燃气泄漏故障 FE",
      errCode: "FE",
      errDesc: "燃气泄漏故障",
    },
    "20": {
      errType: "主板和显示板通信失败 EC",
      errCode: "EC",
      errDesc: "主板和显示板通信失败",
    },
    "21": {
      errType: "卫浴超时报警 EE",
      errCode: "EE",
      errDesc: "卫浴40分钟超时",
    },
    "22": {
      errType: "CO报警 EA",
      errCode: "EA",
      errDesc: "CO报警",
    },
    "23": {
      errType: "水路堵塞故障 C5",
      errCode: "C5",
      errDesc: "零冷水堵塞",
    },
    "24": {
      errType: "",
      errCode: "",
      errDesc: "",
    },
    "25": {
      errType: "",
      errCode: "",
      errDesc: "",
    },
    "26": {
      errType: "",
      errCode: "",
      errDesc: "",
    },
    "27": {
      errType: "",
      errCode: "",
      errDesc: "",
    },
    "28": {
      errType: "",
      errCode: "",
      errDesc: "",
    },
    "29": {
      errType: "",
      errCode: "",
      errDesc: "",
    },
    "30": {
      errType: "",
      errCode: "",
      errDesc: "",
    },
    "31": {
      errType: "残火（C1）",
      errCode: "C1",
      errDesc: "残火",
    },
    "32": {
      errType: "点火失败（C0）",
      errCode: "C0",
      errDesc: "点火失败",
    },
    "33": {
      errType: "零冷水故障C4",
      errCode: "C4",
      errDesc: "零冷水故障",
    },
    "34": {
      errType: "烟道温度探头故障",
      errCode: "CA",
      errDesc: "烟道温度探头故障",
    },
    "35": {
      errType: "SN码读取错误",
      errCode: "F6",
      errDesc: "SN码读取错误",
    },
    "36": {
      errType: "所绑定房间无条码",
      errCode: "F7",
      errDesc: "所绑定房间无条码",
    },
    "37": {
      errType: "无空间插入绑定信息(需要重置绑定信息)",
      errCode: "F8",
      errDesc: "无空间插入绑定信息(需要重置绑定信息)",
    },
    "38": {
      errType: "绑定数据错误",
      errCode: "F9",
      errDesc: "绑定数据错误",
    },
    "39": {
      errType: "分水阀条码冲突",
      errCode: "C6",
      errDesc: "分水阀条码冲突",
    },
    "40": {
      errType: "分水阀地址冲突",
      errCode: "C7",
      errDesc: "分水阀地址冲突",
    },
    "41": {
      errType: "分集水器0缺失",
      errCode: "N0",
      errDesc: "分集水器0缺失",
    },
    "42": {
      errType: "分集水器1缺失",
      errCode: "N1",
      errDesc: "分集水器1缺失",
    },
    "43": {
      errType: "分集水器2缺失",
      errCode: "N2",
      errDesc: "分集水器2缺失",
    },
    "44": {
      errType: "分集水器3缺失",
      errCode: "N3",
      errDesc: "分集水器3缺失",
    },
    "45": {
      errType: "分集水器4缺失",
      errCode: "N4",
      errDesc: "分集水器4缺失",
    },
    "46": {
      errType: "外机不支持壁挂炉",
      errCode: "N9",
      errDesc: "外机不支持壁挂炉",
    },
    "47": {
      errType: "解析温控器过热保护或冷凝水堵塞故障",
      errCode: "",
      errDesc: "解析温控器过热保护或冷凝水堵塞故障",
    },
    "48": {
      errType: "卫浴进水温度传感器故障",
      errCode: "",
      errDesc: "卫浴进水温度传感器故障",
    },
    "49": {
      errType: "低速档风机转速保护",
      errCode: "",
      errDesc: "低速档风机转速保护",
    },
    "50": {
      errType: "高速档风机转速保护",
      errCode: "",
      errDesc: "高速档风机转速保护",
    },
    "51": {
      errType: "通讯故障：显板接收不到主板数据",
      errCode: "",
      errDesc: "通讯故障：显板接收不到主板数据",
    },
    "52": {
      errType: "通讯故障：主板接收不到显板数据",
      errCode: "",
      errDesc: "通讯故障：主板接收不到显板数据",
    },
    "53": {
      errType: "",
      errCode: "",
      errDesc: "",
    },
    "54": {
      errType: "",
      errCode: "",
      errDesc: "",
    },
    "55": {
      errType: "",
      errCode: "",
      errDesc: "",
    },
    "56": {
      errType: "",
      errCode: "",
      errDesc: "",
    },
    "57": {
      errType: "",
      errCode: "",
      errDesc: "",
    }
  }
}



export {
  errMap
}
