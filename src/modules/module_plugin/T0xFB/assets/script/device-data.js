export class DeviceData{
    static isDebug = false;

    // 补全AO
    static getAO(modelNumber){
        let rtn = modelNumber;
        if(modelNumber){
            for(let i=rtn.length;i<8;i++){
                rtn = '0'+rtn;
            }
        }
        return rtn;
    }
}
