const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
    publicPath: process.env.NODE_ENV === 'production'
        ? '/grade_escolar_web'
        : '/',
    outputDir: 'docs',
    configureWebpack: {
        devtool: 'source-map'
    }
})