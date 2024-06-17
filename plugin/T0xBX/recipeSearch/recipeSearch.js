
const pageMixin = require('../utils/mixins/pageMixin');
const scrollLoadingMixin = require('../utils/mixins/scrollLoadingMixin');
Page({
    behaviors: [pageMixin, scrollLoadingMixin],
    /**
     * 页面的初始数据
     */
    data: {
        keyword: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log('onLoad page')
        this.setPageTitle('搜索食谱')
        this.getUrlparams(options)
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

    getRecipes() {
        let data = {
            ...this.getRecipeCommonParams(),
            name: this.data.keyword
        };
        this.getList('searchRecipes', data);
    },

    searchRecipe(event) {
        const {keyword} = event.detail

        if(!keyword) {
            return;
        }

        this.clickTracking('onCardClicked', {
            object_type: 'keyword',
            object_id: keyword,
            object_name: "搜索关键字"
        })

        this.setData({
            keyword
        })

        this.resetLoadingParams();
        this.getRecipes();
    },

    onCardClicked(event) {
        console.log('onCardClicked item', event.currentTarget.dataset.recipe)
        let {id} = event.currentTarget.dataset.recipe;

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
        // this.getRecipes();
    },

    /**
     * 用户点击右上角分享
     */
    // onShareAppMessage: function () {

    // }
})