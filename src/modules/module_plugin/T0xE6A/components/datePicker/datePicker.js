// src/modules/module_plugin/T0xE6/components/datePicker.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    time: {
      type: Object,
      // observer: function(newValue) {
      //   console.log(newValue, "repeatData datePicker");
      // }
    },
    repeatType: { // 重复周期
      type: String,
      observer: function (newValue) {

      }
    },
    customDaySelect: {
      type: String,
      observer: function (newValue) {

      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    timesItem: [{
        title: "仅一次",
        key: "only",
        selected: true,
      },
      {
        title: "每天",
        key: "everyday",
        selected: false,
      },
      {
        title: "工作日",
        key: "weekday",
        selected: false,
      },
      {
        title: "周末",
        key: "weekend",
        selected: false,
      },
      {
        title: "自定义",
        key: "self",
        selected: false,
      }
    ],
    dayItem: [{
        title: "日",
        key: "0",
        selected: false,
      }, {
        title: "一",
        key: "1",
        selected: false,
      },
      {
        title: "二",
        key: "2",
        selected: false,
      },
      {
        title: "三",
        key: "3",
        selected: false,
      },
      {
        title: "四",
        key: "4",
        selected: false,
      },
      {
        title: "五",
        key: "5",
        selected: false,
      },
      {
        title: "六",
        key: "6",
        selected: false,
      }
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    repeatClick(e) {
      // console.log(e);
      let targetKey = e.currentTarget.dataset.item.key;
      let _item = this.data.timesItem;
      for (let i = 0; i < _item.length; i++) {
        _item[i].selected = false;
        if (targetKey == _item[i].key) {
          _item[i].selected = true;
        }
      };
      this.setData({
        timesItem: _item
      })
      if (!this.data.timesItem[4].selected) {
        this.resetDaySelect();
      }
      // console.log(this.data.timesItem, _item);
      this.triggerEvent('myEvent', {
        dayItem: this.data.dayItem,
        timesItem: this.data.timesItem
      }, {});
    },
    dayItemClick(e) {
      let _item = this.data.dayItem;
      if (!this.data.timesItem[4].selected) {
        for (let index = 0; index < _item.length; index++) {
          _item[index].selected = false;
        }
        wx.showToast({
          title: '非自定义日期，不可选',
          icon: 'none'
        });
        this.setData({
          dayItem: _item
        });
        return;
      }
      let targetKey = e.currentTarget.dataset.item.key;
      // console.log(targetKey);      
      for (let index = 0; index < _item.length; index++) {
        if (targetKey == _item[index].key) {
          _item[index].selected = !_item[index].selected
        }
      }
      this.setData({
        dayItem: _item
      });
      this.triggerEvent('myEvent', {
        dayItem: this.data.dayItem,
        timesItem: this.data.timesItem
      }, {});
    },
    resetDaySelect() {
      let _item = this.data.dayItem;
      for (let index = 0; index < _item.length; index++) {
        _item[index].selected = false;
      }
      this.setData({
        dayItem: _item
      })
    },

    resetRepeat() {
      let _item = this.data.timesItem;
      for (let index = 0; index < _item.length; index++) {
        _item[index].selected = false;
      }
      this.setData({
        timesItem: _item
      })
    },

    setPageData(timeData) {
      let repeatText = timeData.repeatText;
      let weeks = timeData.weeks;
      console.log(repeatText, weeks, 'datePicker----setPageData')

      if (repeatText && weeks) {

        if (repeatText != "仅一次" && repeatText != "每天" && repeatText != "周末" && repeatText != "工作日") {
          this.resetRepeat();
          this.data.timesItem[4].selected = true;
          for (let index = 0; index < this.data.dayItem.length; index++) {
            this.data.dayItem[index].selected = false;
            for (let j = 0; j < weeks.length; j++) {
              if (this.data.dayItem[index].key == weeks[j]) {
                this.data.dayItem[index].selected = true;
              }
            }
          }
        } else {
          for (let index = 0; index < this.data.timesItem.length; index++) {
            // let element = this.data.timesItem[index];
            this.data.timesItem[index].selected = false;
            if (this.data.timesItem[index].title == repeatText) {
              this.data.timesItem[index].selected = true;
            }
          }
        }

        this.setData({
          timesItem: this.data.timesItem,
          dayItem: this.data.dayItem
        })
      }
    }

  },

  lifetimes: {
    attached() {
      console.log('datePicker attached', this.data.time)

    },
    ready() {
      console.log('datePicker ready')
    },
    detached() {
      console.log('datePicker detached')
    }
  },

  observers: {
    'time': function (time) {
      console.log(time, "observers");
      this.setPageData(time);
    }
  }


})
