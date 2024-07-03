module.exports = {
	extApi:[
		{   // 字节埋点sdk
			name: 'trackEvent', //扩展api名 该api必须Native方实现了
			sync: false, //是否为同步api
			params: {}
		},
        {   // 扫码调试小程序
			name: 'startAppletByQrCode', //扩展api名 该api必须Native方实现了
			sync: true, //是否为同步api
			params: {}
		},
        {   // 切换打开标志
			name: 'changeIsStartAppletByQrCode', //扩展api名 该api必须Native方实现了
			sync: true, //是否为同步api
			params: {}
		},
	]
}