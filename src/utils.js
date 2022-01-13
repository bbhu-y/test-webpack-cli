const path = require('path')
const {merge} = require('webpack-merge')
let _ = require('lodash')
let chalk = require('chalk')

// 获取运行路径
const getCwdPath = (relPath) => {
  return path.resolve(process.cwd(), relPath)
}

//根据key值获取对应配置
const getInputConfig = (key) => {
  let inputConfig = require(getCwdPath('webpack.config.js'))
  return _.get(inputConfig, key) || {}
}

//合并webpack配置
const mergeWebpackConfig = (config1, config2) => {
  return merge(config1, config2)
}

//获取entry文件名
const getBuildEntryFileName = (config) => {
  const entries = _.get(config, 'entry')
  const entry = entries[0]
  return !!entry && _.get(entry.match(/([^\\]+)(?=\\index.js)/g), '[0]')
}

//信息日志
const loggerInfo = (str) => {
  console.log(chalk.whiteBright(`[INFO]： ${str}`));
}

// 警告日志
const loggerWarring = (str) => {
  console.log(chalk.yellowBright(`[WARRING]： ${str}`));
}

// 成功日志
const loggerSuccess = (str) => {
  console.log(chalk.greenBright(`[SUCCESS]： ${str}`));
}

// 报错日志
const loggerError = (str) => {
  console.log(chalk.redBright(`[ERROR]： ${str}`));
}

module.exports = {
  getBuildEntryFileName,
  mergeWebpackConfig,
  getInputConfig,
  getCwdPath,
  loggerInfo,
  loggerWarring,
  loggerSuccess,
  loggerError
}