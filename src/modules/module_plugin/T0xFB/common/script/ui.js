export class UI{
    static showLoading(options){
        let content = '加载中';
        if(options){
            if(typeof options === 'string'){
                content = options;
            } else {
                content = options.content;
            }
        }
        wx.showLoading({
            title: content,
        });
    }
    static hideLoading(){
        wx.hideLoading();
    }
    static toast(options){
        do{
            let content = '内容';
            if(options){
                if(typeof options === 'string'){
                    content = options;
                } else {
                    content = options.content;
                }
            }
            wx.showToast({
                title: content,
                icon: 'none'
            });
        }while (false);

    }
    static alertResMsg(options){
        do{
            if(options){
                let res = options.res;
                UI.alert({
                    title: options.title||'接口提示',
                    content: 'resCode: ' + res.resCode+'\r\n' +
                        ''+'resMsg: ' + res.resMsg+'\r\n' +
                        ''+'code: ' +res.code+'\r\n' +
                        ''+'msg: ' +res.msg
                });
                break;
            }
            console.warn('invalid options');
        }while (false);
    }
    static alert(options){
        let title = '提示';
        let content = '内容';
        if(options){
            title = options.title||title;
            content = options.content||content;
        }
        wx.showModal({
            title: title,
            content: content,
            showCancel: false,
            success (res) {

            }
        });
    }
}
