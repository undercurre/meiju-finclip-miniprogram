export function parseComponentModel(model){
    let rtn = null;
    if(typeof model==='string'){
        rtn = JSON.parse(model);
    } else {
        rtn = JSON.stringify(model);
    }
    return rtn;
}

export function underLineToHump(obj){
    let rtn = obj;
    if(typeof obj === 'string'){
        for(let i=0;i<obj.length;i++){
            rtn = obj.replace(/\_(\w)/g, function(all, letter){
                return letter.toUpperCase();
            });
        }
    } else {
        let newObj = {};
        for(let key in obj){
            let newKey = key.replace(/\_(\w)/g, function(all, letter){
                return letter.toUpperCase();
            });
            newObj[newKey] = obj[key];
        }
        rtn = newObj;
    }
    return rtn;
}

export function humpToUnderLine(obj){
    let rtn = obj;
    if(typeof obj === 'string'){
        for(let i=0;i<obj.length;i++){
            rtn = obj.replace(/([A-Z])/g,"_$1").toLowerCase();
        }
    } else {
        let newObj = {};
        for(let key in obj){
            let newKey = key.replace(/([A-Z])/g,"_$1").toLowerCase();
            newObj[newKey] = obj[key];
        }
        rtn = newObj;
    }
    return rtn;
}
