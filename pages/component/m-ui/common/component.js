import { basic } from '../mixins/basic'
function mapKeys(source, target, map) {
  Object.keys(map).forEach((key) => {
    if (source[key]) {
      target[map[key]] = source[key]
    }
  })
}
function MxComponent(mxOptions) {
  const options = {}
  mapKeys(mxOptions, options, {
    data: 'data',
    props: 'properties',
    mixins: 'behaviors',
    methods: 'methods',
    beforeCreate: 'created',
    created: 'attached',
    mounted: 'ready',
    destroyed: 'detached',
    classes: 'externalClasses',
  })
  // add default externalClasses
  options.externalClasses = options.externalClasses || []
  options.externalClasses.push('custom-class')
  // add default behaviors
  options.behaviors = options.behaviors || []
  options.behaviors.push(basic)
  // add relations
  const { relation } = mxOptions
  if (relation) {
    options.relations = relation.relations
    options.behaviors.push(relation.mixin)
  }
  // map field to form-field behavior
  if (mxOptions.field) {
    options.behaviors.push('wx://form-field')
  }
  // add default options
  options.options = {
    multipleSlots: true,
    addGlobalClass: true,
  }
  Component(options)
}
export { MxComponent }
