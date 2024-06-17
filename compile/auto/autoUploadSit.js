const { autoUpload } = require('./auto.js')
const { sitAppid, sitKeyPath, sitVersion, sitDesc, sitRobot } = require('./autoConfig.js')

module.exports = autoUpload(sitAppid, sitKeyPath, sitVersion, sitDesc, sitRobot)
