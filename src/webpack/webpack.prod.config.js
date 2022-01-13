const {getInputConfig, mergeWebpackConfig, getCwdPath} = require('../utils')

let path = require('path')
let config = require(getCwdPath('./package.json'))
let MiniCssExtractPlugin = require('mini-css-extract-plugin')
let UglifyJsPlugin = require('uglifyjs-webpack-plugin')
let OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
let CompressionWebpackPlugin = require('compression-webpack-plugin')
let commonConfig = require('./webpack.common')
let _ = require('lodash')
let webpack = require('webpack')

let webpackConfig = _.assignIn({}, commonConfig, {
  output: {
    filename: '[id]_' + config.version + '_[hash].js',
    chunkFilename: '[id]_' + config.version + '_[hash].js',
    path: getCwdPath('dist'),
    publicPath: '/static/'
  },
  optimization: _.assignIn({}, commonConfig.optimization, {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true // set to true if you want JS source maps
      }),
      new OptimizeCSSAssetsPlugin({})
    ],
  })
})

webpackConfig.plugins = _.concat(webpackConfig.plugins, [
  new MiniCssExtractPlugin({
    filename: '[id]_' + config.version + '_[hash].css',
    chunkFilename: '[id]_' + config.version + '_[hash].css'
  }),
  new webpack.ProgressPlugin(),
  new CompressionWebpackPlugin({
    filename: '[path].gz[query]',
    algorithm: 'gzip',
    test: new RegExp('\\.(js|css)$'),
    threshold: 10240,
    minRatio: 0.8,
    deleteOriginalAssets: false
  })
])


module.exports = mergeWebpackConfig(webpackConfig, getInputConfig('webpackProdConfig'))