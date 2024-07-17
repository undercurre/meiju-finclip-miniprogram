class Storage {
  constructor() {
  }

  getStorage(key) {
    return wx.getStorage({key})
  }

  setStorage(key, data) {
    return wx.setStorage({key, data})
  }
}

export default Storage