const { autoReview } = require('./auto.js')
const { prodAppid, prodKeyPath, prodRobot } = require('./autoConfig.js')

module.exports = autoReview(prodAppid, prodKeyPath, prodRobot)
