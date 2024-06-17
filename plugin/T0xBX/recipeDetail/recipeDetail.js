
const pageMixin = require('../utils/mixins/pageMixin');
import RecipeDetail from '../assets/js/model/RecipeDetail'


Page({
    behaviors: [pageMixin],
    /**
     * 页面的初始数据
     */
    data: {
        recipeId: null,
        detail: null,
        pageLoading: true,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.cookingJson = null
        // this.showModal('options', JSON.stringify(options))
        if(options.recipeId) {
            this.data.recipeId = options.recipeId;
        }
        this.getUrlparams(options, {callback: this.getRecipeDetail})
        this.pageViewTracking({
            fromShare: this.data.fromShare,
            object_type: 'recipeId',
            object_id: options.recipeId,
            object_name: "食谱id"
        })

        // this.getRecipeDetail()
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
        if(!this.data.fromShare) {
            this.renderingQuery()
        }
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

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        const route = this.getCurrentPage().route
        const {recipeId, deviceInfo} = this.data
        const params = {
            fromShare: 1, 
            recipeId,
            deviceInfo
        };
        const path = this.getPath(route, params)
        const {name, picUrl} = this.data.detail

        return {
            title: name, 
            imageUrl: picUrl,
            path
        }
    },

    // onShareTimeline() {
    //     const route = this.getCurrentPage().route
    //     const {recipeId, deviceInfo} = this.data
    //     const params = {
    //         fromShare: 2, 
    //         recipeId,
    //         deviceInfo
    //     };
    //     const path = this.getPath(route, params)
    //     const {name, picUrl} = this.data.detail

    //     return {
    //         title: name, 
    //         imageUrl: picUrl,
    //         query: path.split('?')[1]
    //     }
    // },

    getRecipeDetail() {
        let data = {
            id: this.data.recipeId
        };
        this.fetch('recipeDetail', data)
        .then(resData => {
            let detail = new RecipeDetail(resData);
            wx.setNavigationBarTitle({
                title: detail.name
            })
            console.log('detail', detail)
            this.setData({
                pageLoading: false,
                detail
            })
        })
        .catch(e => {
            console.log(e)
        });
    },

    onCoverClicked(event) {
        const {imageUrl} = event.currentTarget.dataset;
        this.previewImage(imageUrl, [imageUrl]);
    },

    onStepImageClicked(event) {
        const {imageUrl} = event.currentTarget.dataset;
        const imageUrls = this.data.detail.steps.map(item => item.urls)
        this.previewImage(imageUrl, imageUrls)
    },

    previewImage(current, urls) {
        wx.previewImage({
            current,
            urls,
        })
    },

    onFooterButtonClicked () {
        if(this.data.fromShare) {
            const {method, miniProgramName, route, params} = this.data.pageData.footerButton
            this[method](miniProgramName, route, params);
            return;
        }

        if(this.data.state !== 2) {
            return
        }

        const {isWorking} = this.data.deviceStatus
        if(isWorking) {
            const delta = this.getPageDelta('plugin/T0xBX/index/index')
            this.back(delta);
            return;
        }

        this.oneButtonCooking()
    },

    oneButtonCooking() {

        if(this.cookingJson) {
            this.handleOneButtonCookingJsonResponse()
            return
        }

        const version = this.data.pluginData.config.cloudMenuProtocol || '2019'
        this.fetch(`oneButtonCookingJson${version}`,
        {
            menuId: this.data.recipeId,
            ...this.getRecipeCommonParams()
        })
        .then(resData => {
            console.log('getOneButtonCookingJson res', resData)
            this.handleOneButtonCookingJsonResponse(resData);
            this.cookingJson = resData
        })
        .catch(e => {
            console.error('getOneButtonCookingJson e', e)
        })
    },

    formatCookJson(originalCookingJson) {
        const stages = Object.keys(originalCookingJson)
        return stages.map((key) => {
            let cmd = JSON.parse(originalCookingJson[key])
            const stepnum = parseInt(key)
            delete cmd.step;
            delete cmd.totalstep;
            delete cmd.probo_value;

            return {...cmd, stepnum}
        })
    },

    handleOneButtonCookingJsonResponse(originalCookingJson = this.cookingJson) {

        const cookingJson = this.formatCookJson(originalCookingJson)
        const {work_mode, cloudmenuid} = cookingJson[0]
        const firstMode = this.filterMode(work_mode, cloudmenuid)
        const tips = this.data.deviceStatus.getTips(firstMode.beforeValidations)
        if(tips) {
            this.showModal(tips)
            return
        }

        if(cookingJson.length === 1) {
            this.luaControl(cookingJson[0])
            return
        }

        this.controlDeviceWithMultipleSteps(cookingJson, this.data.detail.menuCode);
    }
})