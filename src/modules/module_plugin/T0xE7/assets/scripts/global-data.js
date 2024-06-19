export class GlobalData{
    static globalApp = getApp();

    // region 设置接口的header
    static setApiHeaders(){
        this.set('pluginHeaders',{
            'x-requested-with': 'common'
        });
    }
    // endregion

    static get(key){
        return this.globalApp.globalData[key];
    }

    static set(key,value){
        this.globalApp.globalData[key] = value;
    }
}
