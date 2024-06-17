const { autoUpload } = require('./auto.js')
const { prodAppid, prodKeyPath, prodVersion, prodDesc, prodRobot } = require('./autoConfig.js')

module.exports = autoUpload(prodAppid, prodKeyPath, prodVersion, prodDesc, prodRobot)
