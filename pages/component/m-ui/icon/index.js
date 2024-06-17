import { MxComponent } from '../common/component'
MxComponent({
  props: {
    dot: Boolean,
    info: null,
    size: null,
    color: String,
    customStyle: String,
    classPrefix: {
      type: String,
      value: 'mx-icon',
    },
    name: String,
  },
  methods: {
    onClick() {
      this.$emit('click')
    },
  },
})
