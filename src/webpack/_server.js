let webpack = require('webpack')
let webpackDevServer = require('webpack-dev-server')
let consoleStamp = require('console-stamp')
let config = require('./webpack.config')
const {getInputConfig, mergeWebpackConfig} = require('../utils')

//format the console
consoleStamp(console, {
  pattern: 'ddd mmm dd yyyy HH:MM:ss',
  colors: {
    stamp: 'yellow',
    label: 'white',
    metadata: 'green'
  }
})

const inputServerConfig = getInputConfig('webpackDevServerConfig')

const {port} = inputServerConfig || {}

function runServer () {
  config.entry.unshift(`webpack-dev-server/client?https://0.0.0.0:${port}/`)

  let compiler = webpack(config)

  let serverConfig = {
    publicPath: config.output.publicPath,
    historyApiFallback: {
      verbose: true
    },
    https: true,
    disableHostCheck: true,
    host: '0.0.0.0',
    stats: 'errors-only'
  }

  serverConfig = mergeWebpackConfig(serverConfig, inputServerConfig)

  let server = new webpackDevServer(compiler, serverConfig)

  server.listen(serverConfig.port)
}


module.exports = {
  runServer
}