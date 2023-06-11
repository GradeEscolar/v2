const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
    publicPath: process.env.NODE_ENV === 'production'
        ? '/web'
        : '/',
    outputDir: 'docs',
    configureWebpack: {
        devtool: 'source-map'
    }
})