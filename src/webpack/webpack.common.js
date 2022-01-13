let webpack = require('webpack')
let path = require('path')
const {getCwdPath, getInputConfig, mergeWebpackConfig, getBuildEntryFileName} = require('../utils')
let config = require(getCwdPath('./package.json'))
let HtmlWebpackPlugin = require('html-webpack-plugin')
let MiniCssExtractPlugin = require('mini-css-extract-plugin')
let IconFontPlugin = require('icon-font-loader').Plugin
let CopyWebpackPlugin = require('copy-webpack-plugin')
let {RetryChunkLoadPlugin} = require('webpack-retry-chunk-load-plugin')
let babelConfig = require('./babelrc.json')
let _ = require('lodash')
const inputConfig = getInputConfig('webpackCommonConfig')

const webpackCommonConfig = {
  mode: process.env.NODE_ENV,
  resolve: {
    alias: {},
    extensions: ['.jsx', '.js', '.json'],
    symlinks: false
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      include: [
        path.resolve(__dirname, getCwdPath(getBuildEntryFileName(inputConfig) || 'app'))
      ],
      use: [{
        loader: 'eslint-loader',
        options: {
          quiet: true
        }
      },
      {
        loader: 'babel-loader',
        options: {
          configFile: false, // 禁止读取 babel 配置文件
          babelrc: false, // 禁止读取 babel 配置文件
          cacheDirectory: true,
          ...babelConfig
        }
      }]
    }, {
      test: /\.css$/,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
        'icon-font-loader'
      ]
    }, {
      test: /\.less/,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
        'icon-font-loader',
        {
          loader: 'less-loader',
          options: {
            javascriptEnabled: true,
          }
        }
      ]
    }, {
      test: /\.woff($|\?)|\.woff2($|\?)|\.ttf($|\?)|\.eot($|\?)/,
      loader: 'url-loader?limit=8192'
    }, {
      test: /\.(png|jpg|jpeg|svg|gif)/,
      use: ['url-loader', 'image-webpack-loader']
    }]
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          chunks: 'initial',
          minSize: 30000,
          name: 'vendors',
          priority: -10, //优先级
          enforce: true,
          reuseExistingChunk: true   // 可设置是否重用已用chunk 不再创建新的chunk
        },
        styles: {
          name: 'styles',
          test: /\.(css|less)$/,
          chunks: 'all',
          enforce: true,
        }
      }
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: config.title,
      template: getCwdPath(config.template),
      inject: true
    }),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn|en-gb/),
    new webpack.NoEmitOnErrorsPlugin(),
    new IconFontPlugin(),
    new CopyWebpackPlugin([getCwdPath('static')]),
    new webpack.DefinePlugin({
      __VERSION__: JSON.stringify(config.version)
    }),
    new RetryChunkLoadPlugin({
      cacheBust: `function() {
        return Date.now();
      }`,
      maxRetries: 2,
    })
  ]
}

module.exports = mergeWebpackConfig(webpackCommonConfig, inputConfig)