
/*函数节流*/
function throttle(fn, interval) {
    var enterTime = 0;//触发的时间
    var gapTime = interval || 300 ;//间隔时间，如果interval不传，则默认300ms
    return function() {
        var context = this;
        var backTime = new Date();//第一次函数return即触发的时间
        if (backTime - enterTime > gapTime) {
            fn.call(context,arguments);
            enterTime = backTime;//赋值给第一次触发的时间，这样就保存了第二次触发的时间
        }
    };
  }

/*函数防抖*/
  function debounce(fn, interval) {
    var timer;
    var gapTime = interval || 1000;//间隔时间，如果interval不传，则默认1000ms
    return function() {
        clearTimeout(timer);
        var context = this;
        var args = arguments;//保存此处的arguments，因为setTimeout是全局的，arguments不是防抖函数需要的。
        timer = setTimeout(function() {
            fn.call(context,args);
        }, gapTime);
    };
  }

  /* 时间戳转换*/
  function formatDate(str){
    console.log('123455')
    let date = new Date(str);
    let year = date.getFullYear();
    let month= date.getMonth() + 1;
    month= MMmonth< 10 ? ('0' + month) : month;
    let day = date.getDate();
    day = day < 10 ? ('0' + day ) : day ;
    let h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    let m = date.getMinutes();
    m = m < 10 ? ('0' + m) : m;
    let s = date.getSeconds();
    s = s < 10 ? ('0' + s) : s;
    return year + '-' + month + '-' + day + ' ' + h + ':' + m + ':' + s;
  }

  export default {
    debounce,
    throttle,
    formatDate
};