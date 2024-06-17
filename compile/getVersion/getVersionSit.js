const { getGitMessage } = require('./getVersion.js')
const { sitBranch } = require('./versionConfig.js')
getGitMessage(sitBranch)
