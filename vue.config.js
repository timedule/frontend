module.exports = {
  chainWebpack: config => {
    config.plugin('html').tap(options => {
      options[0].minify = {
        removeComments: false,
      }
      return options
    })
  },
}
