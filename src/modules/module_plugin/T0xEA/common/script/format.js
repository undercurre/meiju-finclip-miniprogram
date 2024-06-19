export class Format{
    static jsonToParam(obj){
        let rtn = '';
        if(obj){
            rtn = '?';
            for(let key in obj){
                rtn = rtn+key+'='+obj[key]+'&';
            }
            rtn = rtn.slice(0,rtn.length-1);
        }
        return rtn;
    }

    static getTime(value){
        let rtn = undefined;
        if(value||value===0){
            if(value<10){
                rtn = '0'+value;
            } else {
                rtn = value;
            }
        } else {
            rtn = 0;
        }
        return rtn;
    }

    static dateFormat(fmt, date) {
        let ret;
        const opt = {
            "Y+": date.getFullYear().toString(),        // 年
            "m+": (date.getMonth() + 1).toString(),     // 月
            "d+": date.getDate().toString(),            // 日
            "H+": date.getHours().toString(),           // 时
            "M+": date.getMinutes().toString(),         // 分
            "S+": date.getSeconds().toString()          // 秒
            // 有其他格式化字符需求可以继续添加，必须转化成字符串
        };
        for (let k in opt) {
            ret = new RegExp("(" + k + ")").exec(fmt);
            if (ret) {
                fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
            };
        };
        return fmt;
    }
}
