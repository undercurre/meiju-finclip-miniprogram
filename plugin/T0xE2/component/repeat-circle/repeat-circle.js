import computedBehavior from "../../../../utils/miniprogram-computed";
Component({
  behaviors: [computedBehavior],
  properties: {
    defaultLoop: {
      type: Number,
      value: 0,
      observer(newVal) {
        this.setData({ loopIndex: newVal });
      },
    },
    defaultWeekday: {
      type: Array,
      value: [],
      observer(newVal) {
        if (newVal && newVal.length) {
          this.setData({
            weekdaySelectList: newVal.map((i) => {
              const index = this.data.weekdayList.findIndex(
                (j) => i === j.value
              );
              return index;
            }),
          });
        }
      },
    },
    loopList: {
      type:Array,
      value:["仅一次", "每天", "工作日", "周末", "自定义"]
    }
  },
  data: {
    loopIndex: 0,
    weekdaySelectList: [],
  },
  computed: {
    // loopList() {
    //   return ["仅一次", "每天", "工作日", "周末", "自定义"];
    // },
    weekdayList() {
      return [
        { day: "一", value: 1 },
        { day: "二", value: 2 },
        { day: "三", value: 3 },
        { day: "四", value: 4 },
        { day: "五", value: 5 },
        { day: "六", value: 6 },
        { day: "日", value: 0 },
      ];
    },
  },
  methods: {
    handleLoopItemClick({ currentTarget: { dataset } }) {
      const { index } = dataset;
      this.setData({ loopIndex: index });
      this.triggerEvent("loopitemclick", index);
    },
    handleWeekDayItemClick({ currentTarget: { dataset } }) {
      const index = dataset.index;
      let weekdaySelectList = new Set(this.data.weekdaySelectList);
      if (weekdaySelectList.has(index)) {
        weekdaySelectList.delete(index);
      } else {
        weekdaySelectList.add(index);
      }
      this.setData({ weekdaySelectList: [...weekdaySelectList] });
      this.triggerEvent(
        "weekdayitemclick",
        this.data.weekdaySelectList
          .map((item) => this.data.weekdayList[item]["value"])
          .sort()
      );
    },
  },
});
