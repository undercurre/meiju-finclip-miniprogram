// activities/activitiesTemp/pages/rankList/rankList.js
import { actEventViewPageTracking } from '../../track/track.js'
import { actTemplateImgApi } from '../../../../api.js'
const actTempmetMethodsMixins = require('../actTempmetMethodsMixins.js')
const commonMixin = require('../commonMixin.js')
const app = getApp()
Page({
  behaviors: [actTempmetMethodsMixins, commonMixin],
  /**
   * 页面的初始数据
   */
  data: {
    isLogon: false, // 是否登录标识
    imgUrl: actTemplateImgApi.url,
    rankList: [], //分页获取到的排名列表
    initRankList: [], //页面初始化接口查到的排名列表，判断展示有无记录页的数据
    containerList: [],
    pageIndex: 1, //当前页
    frontPageIdx: 1, //上次请求的页码
    pageSize: 20, //加载条数
    showLastTips: false, //是否显示没有更多了
    showErrtips: false, // 是否显示加载失败，点击重新加载
    showLoadingTips: false, //显示加载数据loading动画
    isCurrentNullArr: true,
    isTopLoading: false,
    triggered: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('榜单onLoad')
    this.getInitOptions(options)
    this.setData({
      statusNavBarHeight: app.globalData.statusNavBarHeight,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('榜单onShow')
    const { options } = this.data
    this.getGamePage_token(this.data.options.pageId, false).then((res) => {
      actEventViewPageTracking('page_view', options, res.data.data.pageSetting)
      let { shareSetting, pageSetting, basicSetting, userInfo } = res.data.data
      let conList = pageSetting.containerList.filter((item) => item.containerType == 12)
      let isTrue = conList[0].data.propScoreInfo && conList[0].data.propScoreInfo.rankRecord
      let initRankList = isTrue ? conList[0].data.propScoreInfo.rankRecord : []
      this.setData({
        shareSetting: shareSetting || {},
        pageSetting: pageSetting || {},
        basicSetting: basicSetting || {},
        userInfo: userInfo || {},
        pageIndex: 1,
        rankList: [],
        initRankList,
        containerList: pageSetting && pageSetting.containerList.length ? pageSetting.containerList : [],
      })
      if (this.data.initRankList.length == 0 || pageSetting.containerList.length == 1) {
        // 记录为空 不调用接口
        console.log('记录为空 不调用接口')
        return
      }
      this.getTotalRankList()
    })
  },
  onPulling() {
    console.log('onPulling')
    if (this.data.isTopLoading) return
    setTimeout(() => {
      this.setData({
        triggered: true,
      })
    }, 500)
  },
  // 下滑刷新
  reloadData() {
    if (this.data.isTopLoading) return
    console.log('reloadData===========')
    this.setData({
      pageIndex: 1, //当前页
      frontPageIdx: 1, //上次请求的页码
      showLastTips: false, //是否显示没有更多了
      showErrtips: false, // 是否显示加载失败，点击重新加载
      showLoadingTips: false, //显示加载数据loading动画
      isCurrentNullArr: true,
      isTopLoading: true,
    })
    this.getTotalRankList()
  },
  // 加载下一页
  loadMoreRankData() {
    console.log('加载数据中........', this.data.showLoadingTips)
    if (this.data.showLoadingTips) return
    console.log('加载数据中...')
    // 当前页没有数据或者请求失败，再次请求时，pageIndex不变
    this.setData({
      frontPageIdx: this.data.pageIndex,
      pageIndex:
        this.data.isCurrentNullArr || (this.data.showLastTips && this.data.pageIndex == 1)
          ? this.data.pageIndex
          : ++this.data.pageIndex,
      showLoadingTips: true,
      showLastTips: false,
      showErrtips: false,
    })
    console.log('frontPageIdx:', this.data.frontPageIdx, 'pageIndex:', this.data.pageIndex)
    this.getTotalRankList()
  },

  // 整合排行列表
  getTotalRankList() {
    let params = {
      pageIndex: this.data.pageIndex,
      pageSize: this.data.pageSize,
    }
    this.getRankList(params)
      .then((res) => {
        console.log('getRankList res', res)
        let newList = res.data.data || []
        let listLength = newList.length
        // 关闭loading
        setTimeout(() => {
          this.setData({
            showLoadingTips: false,
            isTopLoading: false,
            triggered: false,
          })
          if (res.data.code == 0) {
            console.log('当前页数据', newList)
            let result
            if (listLength && this.data.pageIndex != this.data.frontPageIdx) {
              result = this.data.rankList.concat(newList)
            } else {
              result = this.data.pageIndex == 1 ? newList : this.data.rankList
            }
            this.setData({
              rankList: result,
              isCurrentNullArr: listLength ? false : true,
            })
            if (listLength < this.data.pageSize && this.data.rankList.length > 7) {
              // 当前页为最后一页
              console.log('当前页为最后一页', listLength)
              this.setData({
                showLastTips: true,
              })
            }
          } else {
            console.log('code != 0')
            this.setData({
              showErrtips: true,
              isCurrentNullArr: true,
            })
          }
        }, 600)
      })
      .catch((err) => {
        console.log('catch err', err)
        setTimeout(() => {
          this.setData({
            showLoadingTips: false,
            isTopLoading: false,
            triggered: false,
            showErrtips: true,
            isCurrentNullArr: true,
          })
        }, 2000)
      })
  },
  actionCustomHotzone(e) {
    const { item, selectcontainer } = e.currentTarget.dataset
    e.detail.basicItem = item
    e.detail.selectContainer = selectcontainer
    console.log('榜单无记录', e)
    this.activityTrack(e)
    if (item.custom == 0 && item.target == 8) {
      wx.navigateBack({
        delta: 1,
      })
    }
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},
})
