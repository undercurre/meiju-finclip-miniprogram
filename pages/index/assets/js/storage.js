export default class homeStorage {
  constructor() {
    this.homeStorage = {} // 设备相关缓存数据
  }
  // 校验是否有缓存数据
  hasStorage({ homeId, name }) {
    const currentHomeStorage = this.homeStorage[+homeId]
    return currentHomeStorage && currentHomeStorage[name]
  }
  // 获取缓存数据
  getStorage({ homeId, name }) {
    if (this.hasStorage({ homeId, name })) {
      return this.homeStorage[+homeId][name]
    }
    console.log(this.homeStorage, 'homeStorage get 优化')
    return false
  }
  setStorage({ homeId, name, data }) {
    if (!this.homeStorage[homeId]) {
      this.homeStorage[homeId] = {}
    }
    this.homeStorage[homeId][name] = data
  }
  clearStorage({ homeId, name }) {
    if (this.hasStorage({ homeId, name })) {
      this.homeStorage[+homeId][name] = {}
    }
  }
  clearAllStorage() {
    this.homeStorage = {}
  }
}
