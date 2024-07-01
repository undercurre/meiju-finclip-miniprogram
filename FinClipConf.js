module.exports = {
	extApi:[
		{   // 字节埋点sdk
			name: 'trackEvent', //扩展api名 该api必须Native方实现了
			sync: false, //是否为同步api
			params: {}
		}
	]
}