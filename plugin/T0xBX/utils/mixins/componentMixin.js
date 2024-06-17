let commonMixin = require('./commonMixin')
import {addZero} from '../../../../plugin/T0xBX/utils/util';

module.exports = Behavior({
  behaviors: [commonMixin],
  methods: {
    addZero
  }
})