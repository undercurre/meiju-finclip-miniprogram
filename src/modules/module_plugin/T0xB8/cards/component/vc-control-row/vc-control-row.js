Component({
    properties: {// 这里定义了innerText属性，属性值可以在组件使用时指定
        propColor: {
            type: String,
            value: '#ffffff'
        },
        propHeight:{
            type:Number,
            value:200
        },
        /**顶部距离 */
        propPaddingTop:{
            type:Number,
            value:0
        },
        propPaddingBottom:{
            type:Number,
            value:0
        },
        
        propRowIndex:{
            type:Number,
            value:0
        },
        propItemDic:{
            type:Object,
            observer:function(new_val,old_val){
                var list = new Array()
                for(var key in new_val){
                    list.push(new_val[key])
                }
                this.setData({
                    dataList:list
                })
            }
        },
        propRowIndex:{
            type:Number,
            value:0
        },
        propItemIconW:{
            type: String,
            value: '56px'
        },
        propItemIconH:{
            type: String,
            value: '56px'
        }
    },
    data: {
        dataList:[],
    },
    methods: {
        ontap(event){
            this.triggerEvent('buttonTap',{rowIndex:this.properties.propRowIndex,index:event.detail.index});
        }
    },
    lifetimes: {
        attached: function(){
        }
    }
      
})