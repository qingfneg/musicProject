module.exports = {
  plugins: {
    // 自动补全前缀插件，vuecli配置好了，需要设置配置的浏览器版本在。browserslistrc里写入
    autoprefixer: {},
    // px转rem插件
    'postcss-pxtorem': {
      rootValue: 100, // 根元素字体大小转换那些内容
      // propList: ['width', 'height']
      propList: ['*'] // 可以从px更改到rem的属性 设置为全部时Px的P为大写时不会被转化为rem
    }
  }
}
