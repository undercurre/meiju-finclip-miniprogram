import { MxComponent } from '../common/component'
MxComponent({
  props: {
    show: Boolean,
    customStyle: String,
    duration: {
      type: null,
      value: 300,
    },
    zIndex: {
      type: Number,
      value: 1,
    },
    lockScroll: {
      type: Boolean,
      value: true,
    },
  },
  methods: {
    onClick() {
      this.$emit('click')
    },
    // for prevent touchmove
    noop() {},
  },
})
