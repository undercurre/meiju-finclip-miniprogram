class Dep {
  constructor() {
    this.subsObj = {}
  }
  addSub(key, sub) {
    if (!this.subsObj[key]) {
      this.subsObj[key] = []
    }
    this.subsObj[key].push(sub)
  }
  notify(key, newValue, oldValue) {
    this.subsObj[key] &&
      this.subsObj[key].forEach((sub) => {
        sub.update(newValue, oldValue)
      })
  }
}

export default Dep
