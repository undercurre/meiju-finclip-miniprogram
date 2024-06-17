const simpleGit = require('simple-git');
const fs = require('fs');


function getVersion (message) {
  if(message.indexOf('version') == -1) {
    console.log('\x1b[33m%s\x1b[0m', '--提交的代码未填写版本，格式如：version: xxxxx--');

    return '1.0.0'
  }

  if(!!message) {
    const version = message.split(' ') || message.split(',')
    console.log("获取到的值version：",version);
    return version[0].split(':') [1] || version[0].split('：') [1]
  }
  return '自动化提测'
}

function getDesc (message) {
  if(message.indexOf('desc') == -1) {
    console.log('\x1b[33m%s\x1b[0m',"--提交的代码未填写版本描述信息，格式如：desc: xxxxx--");
    return ''
  }
  if(!!message) {
    const desc = message.split(' ') || message.split(',')
    console.log("获取到的值desc：",desc);
    return desc[1].split(':') [1] || desc[1].split('：') [1]
  }
  return '自动化提测'
}
function getGitMessage (branch) {
  const content = fs.readFileSync('./compile/auto/autoConfig.js', 'utf8');
  console.log("获取到的jsFile1：",content,branch);

  // 用于存储最新提交记录的变量
  let latestCommit;

  // 通过 simple-git 模块获取指定分支的最新提交记录
  simpleGit().log(['-1', branch], (err, log) => {
    if (err) {
      console.log("获取到的jsFile2：");

      console.error(err);
      return;
    }

    // 将最新提交记录赋值给变量
    latestCommit = log.latest;
    console.log(latestCommit);
    const version = getVersion(latestCommit.message)
    const desc = getDesc(latestCommit.message)
    console.log("获取到的值：",version,desc);
    
    const regVersion1 = /sitVersion: (.+),/g 
    const regDesc1 = /sitDesc: (.+),/g 

    // 查找并替换变量值
    let replacedContent = content.replace(regVersion1, `sitVersion: '${version}',`);
    console.log("获取到的值1：",replacedContent);
    replacedContent = replacedContent.replace(regDesc1, `sitDesc: '${desc}',`);

    console.log("获取到的值2：",replacedContent);
    // 将修改后的内容写回文件
    fs.writeFileSync('./compile/auto/autoConfig.js', replacedContent, 'utf8');

  });
}
module.exports = {
  getGitMessage,
};
