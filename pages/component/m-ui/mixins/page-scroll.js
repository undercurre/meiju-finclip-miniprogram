import { getCurrentPage, isDef } from '../common/utils'
function onPageScroll(event) {
  const { mxPageScroller = [] } = getCurrentPage()
  mxPageScroller.forEach((scroller) => {
    if (typeof scroller === 'function') {
      // @ts-ignore
      scroller(event)
    }
  })
}
export const pageScrollMixin = (scroller) =>
  Behavior({
    attached() {
      const page = getCurrentPage()
      if (!isDef(page)) {
        return
      }
      if (Array.isArray(page.mxPageScroller)) {
        page.mxPageScroller.push(scroller.bind(this))
      } else {
        page.mxPageScroller =
          typeof page.onPageScroll === 'function'
            ? [page.onPageScroll.bind(page), scroller.bind(this)]
            : [scroller.bind(this)]
      }
      page.onPageScroll = onPageScroll
    },
    detached() {
      var _a
      const page = getCurrentPage()
      if (isDef(page)) {
        page.mxPageScroller =
          ((_a = page.mxPageScroller) === null || _a === void 0 ? void 0 : _a.filter((item) => item !== scroller)) || []
      }
    },
  })
