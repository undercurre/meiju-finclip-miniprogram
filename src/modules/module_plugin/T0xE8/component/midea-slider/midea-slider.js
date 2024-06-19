// plugin/T0xFB/component/media-slider/media-slider.js
import {imageDomain} from "../../assets/scripts/api";

Component({
  /**
   * 组件的属性列表
   * model:{
   *     currentValue: number;    当前滑块值
   *     process: number;         滑块进度
   *     min: number;             最小值
   *     max: number;             最大值
   *     interval: number;        间隔数
   *     unit: string;            单位
   *     valueArray: Array<string>    数轴具体展示数组
   *     color: string;           控件主题色
   *     width: string;           标签区域宽度
   * }
   */
  properties: {
    model: {
      type: String,
      observer: function(newValue,oldValue){
        this.getModel(JSON.parse(newValue));
        this.valueArrayInit();
      }
    },
    disabled: {
      type: Boolean,
      value: null,
      observer: function(newValue){
        let bindModel = this.data.bindModel;
        bindModel.disabled = newValue;
        this.setData({bindModel});
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    bindModel: {},
    movePath: 40,
    interval: 5,
    sliderWidth: 0,
    evenPath: 0,
    currentSliderWidth: 0,
    touchStartX: 0,
    deviceRatio: 1,
    isDragging: false,
    icon: {
      add: imageDomain+'/0x3F/icon_add.png',
      reduce: imageDomain+'/0x3F/icon_reduce.png'
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 设置model
    getModel(model){
      let bindModel = this.data.bindModel;
      if(model){
        bindModel = model;
        this.setData({
          bindModel: bindModel
        });
      }
      let disabled = this.data.disabled;
      if(disabled===false||disabled===true){
        bindModel.disabled = disabled;
        this.setData({
          bindModel: bindModel
        });
      }
      this.getBarWidth()
      return bindModel;
    },
    // 滑块数轴初始化
    valueArrayInit(){
      let bindModel = this.data.bindModel;
      let valueArray = [{
        value: bindModel.min,
        label: bindModel.min + bindModel.unit
      }, {
        value: bindModel.max,
        label: bindModel.max + bindModel.unit
      }]
      bindModel.valueArray = valueArray;
      this.setData({
        bindModel: bindModel
      });
    },
    // 点击增减滑块数值
    changeSliderValue(event){
      let bindModel = this.data.bindModel;
      do{
        let index = event.currentTarget.dataset.index;
        let interval = bindModel.interval||this.data.interval;
        let targetValue = bindModel.currentValue;
        switch (index){
          case 'reduce':
            targetValue-=interval;
            // interval = -interval;
            break;
          case 'add':
            targetValue+=interval;
            break;
        }
        for(let i=0;i<bindModel.valueArray.length;i++){
          if(targetValue>=bindModel.max&&index==='add'){
            targetValue = bindModel.max;
            break;
          }
          if(targetValue<=bindModel.min&&index==='reduce'){
            targetValue = bindModel.min;
            break;
          }
        }
        bindModel.currentValue = targetValue;
        this.sliderTo()
        this.setData({
          bindModel});
        this.triggerEvent('onChange',bindModel,bindModel);
      }while (false);
    },
    // region 滑块拖拽事件
    sliderTouchStart(event){
      do{
        // 获取选中滑块长度
        let touch = event.touches[0] || event.changedTouches[0];
        console.log(event, "startMove")
        this.setData({
          touchStartX: touch.pageX,
          isDragging: true
        });
      }while (false);
    },
    sliderTouchMove(event){
      do{
        let bindModel = this.data.bindModel;
        let touch = event.touches[0] || event.changedTouches[0];
        console.log(event, "sliderMove")
        let startX = this.data.touchStartX;
        let pageX = touch.pageX;
        let totalMoveX = (pageX - 55)*this.data.deviceRatio;
        // 总步数
        const pathNum = parseInt((totalMoveX - 40)/this.data.evenPath) + ((totalMoveX - 40)%this.data.evenPath > 0 ? 1 : 0)
        let targetValue = (pathNum)*bindModel.interval + bindModel.min // 实际的值
        if(targetValue > bindModel.max) {
          targetValue = bindModel.max
        }
        if(targetValue < bindModel.min) {
          targetValue = bindModel.min
        }
        bindModel.currentValue = targetValue
        this.sliderTo()
        this.triggerEvent('onMoving',bindModel,bindModel);
      }while (false);

    },
    sliderTouchEnd(e){
      do{
        let bindModel = this.data.bindModel;
        this.setData({
          bindModel: bindModel,
          isDragging: false
        });
        this.triggerEvent('onChange',bindModel,bindModel);
      }while (false);
    },
    // endregion
    // region 进度条点击事件
    selectProcess(event){
      console.log(event, "clickMove")
      do{
        let bindModel = this.data.bindModel;
        if(bindModel.disabled){
          break;
        }
        let originalX = event.currentTarget.offsetLeft;
        let targetX = event.detail.x;
        let totalMoveX = (targetX - originalX)*this.data.deviceRatio;
        // 总步数
        const pathNum = parseInt((totalMoveX - 40)/this.data.evenPath) + ((totalMoveX - 40)%this.data.evenPath > 0 ? 1 : 0)
        let targetValue = (pathNum)*bindModel.interval + bindModel.min // 实际的值
        if(targetValue > bindModel.max) {
          targetValue = bindModel.max
        }
        if(targetValue < bindModel.min) {
          targetValue = bindModel.min
        }
        bindModel.currentValue = targetValue
        this.sliderTo()
        this.setData({
          bindModel: bindModel
        });
        this.triggerEvent('onChange',bindModel,bindModel);
      }while (false);
    },
    // endregion
    // 滑动到指定位置
    sliderTo() {
      const sliderWidth = this.data.sliderWidth
      const bindModel = this.data.bindModel;
      const movePath = (bindModel.currentValue-bindModel.min)/(bindModel.max-bindModel.min)*(sliderWidth - 40) + 40
      this.setData({movePath})
    },
    // 获取bar宽度
    getBarWidth() {
      const sliderWidth = this.data.sliderWidth
      if(sliderWidth > 0) {
        this.sliderTo()
        return
      }
      setTimeout(()=>{
        wx.createSelectorQuery().in(this).select('.slider-process-wrapper').fields({
          dataset: true,
          size: true,
          scrollOffset: true,
          properties: ['scrollX', 'scrollY'],
          computedStyle: ['margin', 'backgroundColor'],
          context: true,
        },(res)=>{
          if(res){
            const sliderWidth = res.width*this.data.deviceRatio
            let bindModel = this.data.bindModel;
            let evenPath = (sliderWidth - 40)/(bindModel.max - bindModel.min)*bindModel.interval
            this.setData({
              sliderWidth,
              evenPath
            });
            this.sliderTo()
          } else {
            this.getBarWidth()
          }
        }).exec();
      },100);
    }
  },
  attached(){
    wx.getSystemInfo().then(res => {
      const deviceRatio = 750/res.windowWidth
      this.setData({deviceRatio})
    });
    this.getModel();
    // 获取滑块长度
  },
})
