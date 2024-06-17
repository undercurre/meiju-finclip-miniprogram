const { autoConstruct } = require('./auto.js')
const { sitAppid, sitKeyPath } = require('./autoConfig.js')

module.exports = autoConstruct(sitAppid, sitKeyPath)
