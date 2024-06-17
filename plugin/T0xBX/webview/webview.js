const pageMixin = require('../utils/mixins/pageMixin');

Page({
  behaviors: [pageMixin],
  data: {
    url: null
  },
  onLoad: function (options) {
    this.getUrlparams(options)
    console.log('webview options url ', options.url)
    this.pageViewTracking({
			object_type: 'h5',
			object_id: options.url
		})
    this.setData({
      url: decodeURIComponent(options.url)
    })
  },
})
