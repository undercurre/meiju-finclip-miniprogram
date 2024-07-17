let commonMixin = require('./commonMixin')
import {addZero} from '../utils/util';

module.exports = Behavior({
  behaviors: [commonMixin],
  methods: {
    addZero
  }
})