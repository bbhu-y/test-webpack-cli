#!/usr/bin/env node


let webpack = require('webpack')
const program = require('commander')
const webpackProdConfig = require('../webpack/webpack.prod.config')
const {runServer} = require('../webpack/_server')
const {loggerError, loggerSuccess} = require('../utils')
const config = require('../../package.json')

const webpackCommand = {
  version:config.version,
  description: 'start webpack build',
  command: 'webpack',
  action: () => {
    const { NODE_ENV = 'development' } = process.env
    if (NODE_ENV === 'development') {
      runServer()
    }else{
      const compiler = webpack(webpackProdConfig)
      try {
        compiler.run((err) => {
          if (err) {
            loggerError(err)
          } else {
            loggerSuccess('WEBPACK SUCCESS!')
          }
        });
      } catch (error) {
        loggerError(error)
      }
    }
  }
}

const { version, description, command, action } = webpackCommand
program
  .version(version)
  .command(command)
  .description(description)
  .action((value) => {
    action(value)
  })
  .parse(process.argv)

