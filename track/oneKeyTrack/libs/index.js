import Wrapper from './wrapper'
import { getBoundingClientRect, getActivePage } from './helper'
// import { clickEventTracking } from '../../track.js'

class Tracker extends Wrapper {
  constructor({ tracks, isUsingPlugin }) {
    super(isUsingPlugin)
    // 埋点配置信息
    this.tracks = tracks
    // 自动给每个page增加elementTracker方法，用作元素埋点
    this.addPageMethodExtra(this.elementTracker())
    // 自动给page下预先定义的方法进行监听，用作方法执行埋点
    this.addPageMethodWrapper(this.methodTracker())
  }

  elementTracker() {
    // elementTracker变量名尽量不要修改，因为他和wxml下的名字是相对应的
    const elementTracker = () => {
      const tracks = this.findActivePageTracks('element')
      tracks.forEach((track) => {
        getBoundingClientRect(track.element).then((res) => {
          res.boundingClientRect.forEach((item) => {
            track.dataset = item.dataset
            // isHit && report(track, data, commonParams);
            // isHit && clickEventTracking('user_behavior_event', track, commonParams);
          })
        })
      })
    }
    return elementTracker
  }

  methodTracker() {
    return (page, methodName, args = {}) => {
      const tracks = this.findActivePageTracks('method')
      const { dataset } = (args && args.currentTarget) || {}
      tracks.forEach((track) => {
        if (track.method === methodName) {
          track.dataset = dataset
          // report(track, data, commonParams);
          // clickEventTracking('user_behavior_event', track, commonParams);
        }
      })
    }
  }

  /**
   * 获取当前页面的埋点配置
   * @param {String} type 返回的埋点配置，options: method/element
   * @returns {Object}
   */
  findActivePageTracks(type) {
    try {
      const { route } = getActivePage()
      const pageTrackConfig = this.tracks.find((item) => item.path === route) || {}
      let tracks = {}
      if (type === 'method') {
        tracks = pageTrackConfig.methodTracks || []
      } else if (type === 'element') {
        tracks = pageTrackConfig.elementTracks || []
      }
      return tracks
    } catch (e) {
      return {}
    }
  }
  getActivePageParams() {
    const { route } = getActivePage()
    const pageTrackConfig = this.tracks.find((item) => item.path === route) || {}
    return pageTrackConfig.commonParams
  }
}

export default Tracker
