const path = require('path')
const prodEnv = require('./prod.env')
const devEnv = require('./dev.env')
let proxyHost = ''

switch (process.env.SERVER_ENV) {
  case 'dev': {
    proxyHost = 'http://dev.merchant.ampmfit.net/api/' // 用作代理调试
    // proxyHost = 'http://192.168.0.21:9009/' // 用于调试某个开发机器上的应用
    // proxyHost = "http://yapi.ampmfit.net/mock/41/api"; // mock server
    break
  }
  case 'qa': {
    proxyHost = 'http://qa.merchant.ampmfit.net/api/'
    break
  }
  case 'pre': {
    proxyHost = 'http://pre.merchant.ampmfit.net/api/'
    break
  }
  case 'prod': {
    proxyHost = 'http://merchant.ampmfit.net/api/'
    break
  }
  default: {
    proxyHost = 'http://dev.merchant.ampmfit.net/api/'
    break
  }
}

module.exports = {
  build: {
    env: prodEnv,
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: './',
    assetsPublicPath: '/',
    productionSourceMap: false,
    productionGzip: true
  },
  dev: {
    env: devEnv,
    port: 10009,
    assetsSubDirectory: './',
    assetsPublicPath: '/',
    proxyTable: {
      // 调试dev环境
      '/api': {
        target: proxyHost,
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/'
        }
      }
    },
    cssSourceMap: false
  }
}
