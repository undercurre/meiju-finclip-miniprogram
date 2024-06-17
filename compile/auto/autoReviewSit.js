const { autoReview } = require('./auto.js')
const { sitAppid, sitKeyPath, sitRobot } = require('./autoConfig.js')

module.exports = autoReview(sitAppid, sitKeyPath, sitRobot)
