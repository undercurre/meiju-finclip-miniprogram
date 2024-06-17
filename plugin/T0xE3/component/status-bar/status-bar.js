import images from "../../assets/js/img";
import computedBehavior from "../../../../utils/miniprogram-computed";

Component({
  behaviors: [computedBehavior],
  properties: {
    deviceStatus: {
      type: Number,
      value: -1,
    },
    iconColor: {
      type: String,
      value: "",
    },
  },
  computed: {
    title() {
      const { deviceStatus } = this.properties;
      if (deviceStatus >= 5) return "故障中";
      if (deviceStatus == 4) return "已关机";
      if (deviceStatus == 0) return "待机中";
      if (deviceStatus == 1 || deviceStatus == 2 || deviceStatus == 2.1) {
        const deviceStatusDic = {
          1: "加热中",
          2: "零冷水加热中",
          2.1: "杀菌中",
        };
        return deviceStatusDic[deviceStatus] || "";
      }
      if (deviceStatus == 3) return "零冷水保温中";
    },
  },
  data: {
    images,
  },
  methods: {
    powerToggle() {
      this.triggerEvent("powerToggle");
    },
  },
});
