
const pageMixin = require('../utils/mixins/pageMixin');
const scrollLoadingMixin = require('../utils/mixins/scrollLoadingMixin');

Page({
    behaviors: [pageMixin, scrollLoadingMixin],
    /**
     * 页面的初始数据
     */
    data: {
        keyword: null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setPageTitle('食谱')
        this.getUrlparams(options, {callback: this.getNewestRecipes})
        this.pageViewTracking()
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.setData({
            fromApp: false
        })
    },

    getNewestRecipes() {
        let data = {
            ...this.getRecipeCommonParams()
        };
        this.getList('newestRecipes', data);
    },

    onFakeInputClicked() {
        this.jumpTo('recipeSearch',{
            deviceInfo: this.data.deviceInfo
        })
    },

    onCardClicked(event) {
        console.log('onCardClicked item', event.currentTarget.dataset.recipe)
        let {id} = event.currentTarget.dataset.recipe

        this.clickTracking('onCardClicked', {
            object_type: 'recipeId',
            object_id: id,
            object_name: "食谱id"
        })

        this.jumpTo('recipeDetail', {
            recipeId: id,
            deviceInfo: this.data.deviceInfo
        });
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        console.log('onReachBottom')
        this.getNewestRecipes();
    },

    /**
     * 用户点击右上角分享
     */
    // onShareAppMessage: function () {

    // }
})