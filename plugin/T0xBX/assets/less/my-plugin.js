module.exports = {
    install: function (less, pluginManager, functions) {
        functions.add('ratio', function(value) {
            const RATIO = 2;
//            return Object.keys(value).join(','); // value是个对象，有毒吧！
            return value.value*RATIO + 'rpx';
        });
    }
};
