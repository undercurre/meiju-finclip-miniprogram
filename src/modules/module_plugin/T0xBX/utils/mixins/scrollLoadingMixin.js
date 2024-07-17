const PAGE_SIZE = 10;
const FIRST_PAGE = 0;

module.exports = Behavior({
  data: {
    page: FIRST_PAGE,
    list: [],
    loading: false,
    allLoaded: false
  },
  methods: {
    resetLoadingParams() {
      this.data.page = FIRST_PAGE;
      this.setData({
        list: [],
        allLoaded: false
      })
    },
    showLoading() {
      this.setData({
        loading: true
      })
    },
    hideLoading() {
      this.setData({
        loading: false
      })
    },
    getList(requestName, data) {

      if(this.data.loading || this.data.allLoaded) {
        return;
      }

      this.showLoading();
      this.data.page++;

      let _data = {
        currentPage: this.data.page,
        pageSize: PAGE_SIZE,
      };
      Object.assign(_data, data)
      this.fetch(requestName, _data)
      .then(resData => {
          this.setData({
              list: this.data.list.concat(this.getDeviceRecipes(resData))
          })
          if(resData.length < PAGE_SIZE) {
            this.setData({
              allLoaded: true
            })
          }
          this.hideLoading();
      })
    .catch(e => {
        console.log(e)
        this.data.page--;
        this.hideLoading();
    })
    },

    getDeviceRecipes(recipes) {
      return recipes.filter(item => !item.isNotThisSn8Menu)
    }
  }
});