export const basic=Behavior({methods:{$emit(name,detail,options){this.triggerEvent(name,detail,options)},set(data){return this.setData(data),new Promise(resolve=>wx.nextTick(resolve))}}});
