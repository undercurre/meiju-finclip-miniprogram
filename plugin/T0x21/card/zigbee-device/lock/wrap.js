import { imageApi } from '../../../../../api'
  Component({
  properties: {// 这里定义了innerText属性，属性值可以在组件使用时指定
    wrapData: {
      type: Object,
      value: function () {
        return {
        }
      }
    },
    disabled: {
      type: Boolean,
      value: false
    }
  },
  data: {
    // 组件内部数据
    logsArray: [],//开锁记录数据
    currentDate: '',    // 保存日期
    recordNum:50,//记录显示50一组
    recordTime:1,//次数
    contents: [],//copy密码
    timer: '',//定时器名字
    minuteNum: '10',//倒计时初始值
    secondNum: '00',//倒计时初始值
    showCover: false,//开锁记录显示开关
    showTemPassword:false,//临时密码页面显示开关
    haveTemPassword: false,//临时密码开关
    icons: {
      doorLock:imageApi.getImagePath.url + '/0x21/doorLock@3x.png',
      temPassword:imageApi.getImagePath.url + '/0x21/temPassword@3x.png',
      temPassword_off:imageApi.getImagePath.url + '/0x21/temPassword_off@3x.png',
      wx_icon: imageApi.getImagePath.url + '/0x21/wx_icon@3x.png',
      copy_icon: imageApi.getImagePath.url + '/0x21/copy_icon@3x.png',
      record_off: imageApi.getImagePath.url + '/0x21/record_off@3x.png',
      record_on: imageApi.getImagePath.url + '/0x21/record_on@3x.png',
    },
  },
  ready() {
    // console.log(this.data.wrapData)
  },
  observers: {
    'wrapData.logsArray': function (data) {
      if (!data) return;
      this.setData({
        logsArray:data
      })
      //第一次记录显示，大于50，显示50条
      let _arr = [];
      if (this.data.logsArray.length>50){
        _arr = this.data.logsArray.slice(0, this.data.recordNum)
      }else{
        _arr = this.data.logsArray
      }
      this.setLogsArray(_arr);
    },
    'wrapData.passcode':function(data){
      if (!data) return;
      // console.log(data)
      // console.log(this.data.wrapData)
      let contents = this.data.wrapData.passcode.split('');
      this.setData({ contents })

      //开始倒计时
      let that = this;
      let minuteNum = that.data.minuteNum;//分
      let secondNum = that.data.secondNum;//秒
      that.setData({//时间初始化
        haveTemPassword: true,
        minuteNum: '10',
        secondNum: '00'
      })
      clearInterval(this.data.timer);
      that.setData({
        timer: setInterval(() => {
          //数据初始化
          if (secondNum === '00') {
            secondNum = 60;
            minuteNum = '0' + 9;
            that.setData({ minuteNum })
          }
          secondNum--;
          if (secondNum < 10) { secondNum = '0' + secondNum }
          that.setData({ secondNum })
          //秒结束时
          if (secondNum <= 0) {
            //分结束时
            if (minuteNum <= 0) {
              clearInterval(that.data.timer);
              that.setData({ haveTemPassword: false })
            } else {
              secondNum = 60;
              minuteNum--;
              if (minuteNum < 10) { minuteNum = '0' + minuteNum }
              that.setData({ minuteNum })
            }
          }
        }, 1000)
      })
    }
  },
  methods: {
    // 取时间
    formatTimeByStr(strTime) {
      var time = ''
      if (strTime != undefined && strTime != '') {
        time = strTime.substring(11, 19);
      }
      return time;
    },
    // 取日期，组成“月/日”形式
    formatDateByStr(strTime) {
      var time = '';
      if (strTime != undefined && strTime != '') {
        time = strTime.substring(5, 10).replace('-', '/');
      }
      return time;
    },
    //滚动到底部时加载后50条数据
    scrolltolower(){
      let _arr = this.data.wrapData.logsArray;
      let _recordNum = this.data.recordNum;//记录条数
      let _recordTime = this.data.recordTime;//加载次数1
      let num = Math.ceil(_arr.length / _recordNum);//一共的组数

      if (num <= _recordTime) return;//无剩余返回
      this.setData({ recordTime: ++_recordTime })

      //获取下一组数据
      if (_arr.length >= _recordNum * _recordTime) {
        let remainArray = _arr.slice(0, _recordNum * _recordTime)
        //数据处理
        this.setLogsArray(remainArray);
      }else{
        //最后数据处理
        let remainArray = _arr;
        this.setLogsArray(remainArray);
      }
      
    },
    // 组装日志显示
    setLogsArray(data) {
      // console.log(data)
      let _arr = data;
      let _array = []
      if (!_arr)return;
      _arr.forEach((item, index) => {
        // console.log(item)
        let _item = {}, _time = item.time;
        let _ctime = this.formatTimeByStr(_time), _cdate = this.formatDateByStr(_time);

        // 0 增加日期显示头部，第一条或者日期不同
        if (index == 0 || _cdate != this.data.currentDate) {

          this.data.currentDate = _cdate;

          _array.push({
            time: _time,
            type: 'logTitle',
            date: _cdate,
            desc: ''
          })
        }

        // 1 常规显示 第1条特殊处理
        _item.time = _time,
          _item.type = index == 0 ? 'logFirst' : 'log';
        _item.desc = _ctime + ' ' + item.desc

        _array.push(_item)
      })
      this.setData({
        logsArray: _array
      })
      // console.log(this.data.logsArray)
    },
    //日志数据处理
    
    //开锁记录显示开关
    timerAxis(){
      this.setData({showCover: !this.data.showCover})
    },
    //临时密码页面开关
    temPassword() {
      this.triggerEvent('mlLockPop', this.data.showTemPassword)
      this.setData({showTemPassword: !this.data.showTemPassword})
    },
    //取消生成临时密码
    temPasswordOff(){
      this.triggerEvent('mlLockPop', this.data.showTemPassword)
      this.setData({
        showTemPassword: false,
        haveTemPassword:false
      })
    },
    //生成临时密码
    temPasswordOn(e) {
      let value = e.currentTarget.dataset.gid + 1;
      this.triggerEvent('tempPassword', value)
    },
    //复制
    copy(){
      let str = '';
      for (let i = 0; i < this.data.contents.length;i++){
        str = str + this.data.contents[i];
      }
      wx.setClipboardData({
        data: str +'#',
        success(res) {
          wx.getClipboardData({
            success(res) {
              // console.log(res.data)
            }
          })
        }
      })
    },
  },
})