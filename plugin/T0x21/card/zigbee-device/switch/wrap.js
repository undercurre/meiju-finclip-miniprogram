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
    },
    
  },
  data: {
    // 组件内部数据
    showCover: false,
    endlist:[],
    status:{},
    deviceInfo:{},
    icons:{
      light_on: imageApi.getImagePath.url + '/0x21/light_on@3x.png',
      light_off: imageApi.getImagePath.url + '/0x21/light_off_new@3x.png',
    }
  },
  ready() {
  },
  observers: {
    'wrapData.endlist': function (data) {
      this.setData({
        'endlist': data
      })
    }
  },
  methods: {
    // events
    powerToggle(e){
      let oldPower = this.data.endlist[e.currentTarget.dataset.gid].event.OnOff;
      let value = e.currentTarget.dataset.gid +1;
      this.triggerEvent('powerToggle', value);
      setTimeout(()=>{
        if (oldPower === this.data.endlist[e.currentTarget.dataset.gid].event.OnOff){
          //开关没变处理
          let setPower = 'endlist[' + e.currentTarget.dataset.gid + '].event.OnOff';
          this.setData({
            [setPower]: oldPower
          })
        }
      // console.log(oldPower +':'+ this.data.endlist[e.currentTarget.dataset.gid].event.OnOff)
      },1000)
    },

  },
  attached() {
    // console.log('attached');
  }
})