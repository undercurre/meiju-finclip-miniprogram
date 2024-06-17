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
    showCover: false,
    icons: {
      switch_on: imageApi.getImagePath.url + '/0x21/switch-on@3x.png',
      switch_off: imageApi.getImagePath.url + '/0x21/switch-off@3x.png',
      group_on: imageApi.getImagePath.url + '/0x21/group_on@3x.png',
      group_off: imageApi.getImagePath.url + '/0x21/group_off@3x.png'
    },
    powerShow: '--',
    powerShowDec: '',
    number: 1,
  },
  ready() {
    // console.log(this.data.wrapData)
  },
  observers: {
    'wrapData.endlist[0]': function (numberA, numberB) {
      if (this.data.wrapData.endlist[0].event.OnOff) {
        // 根据实际值，变换字体大小
        let _number = 0;

        // 设置显示值
        let _valueObj = this.setPowerValue();
        let _int = _valueObj.int;

        // console.log(_int)

        if (0 < _int < 10) _number = 1;
        if (10 <= _int < 100) _number = 2;
        if (100 <= _int < 1000) _number = 3;
        if (1000 <= _int < 10000) _number = 4;

        this.setData({
          powerShow: _int,
          powerShowDec: _valueObj.deci,
          number: _number
        })
      } else {
        this.setData({
          powerShow: '--',
          powerShowDec: '',
          number: 1
        })
      }
    }
  },
  methods: {
    // events
    powerToggle(){
      this.triggerEvent('powerToggle');
    },
    // 实时功率显示值处理
    setPowerValue() {
      let _value = this.data.wrapData.endlist[0].event.Power, _result = { int: '--', deci: '' };
      let _p = 100, _d = 2;
      if (_value) {
        _value = parseFloat(_value).toFixed();

        let _numP = _value / _p + '';
        let _numArry = _numP.split('.');
        if (_numArry[0] < 5) {
          _result.int = '<5';
        } else {
          _result.int = _numArry[0];
          _result.deci = '.' + _numArry[1];
        }
        return _result;
      } else {
        // 待定 - 默认显示
        return _result;
      }
    }
  }
})