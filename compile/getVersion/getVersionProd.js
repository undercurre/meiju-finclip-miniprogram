const { getGitMessage } = require('./getVersion.js')
const { prodBranch } = require('./versionConfig.js')
getGitMessage(prodBranch)
