const { autoConstruct } = require('./auto.js')
const { prodAppid, prodKeyPath } = require('./autoConfig.js')

module.exports = autoConstruct(prodAppid, prodKeyPath)
