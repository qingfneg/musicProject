const jsdom = require('jsdom')
const { JSDOM } = jsdom
module.exports = {
  /* 部署应用包的基本URL, 不设置可能会出现打包后项目找不到资源问题 */
  publicPath: './',

  // 以下代码是安装了预渲染的插件之后自动添加的
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.(html)$/,
          exclude: /node_modules/,
          use: {
            loader: 'html-loader',
            options: {
              minimize: true
            }
          }
        }
      ]
    }
  },
  // 以下代码是安装了预渲染的插件之后自动添加的
  pluginOptions: {
    prerenderSpa: {
      registry: undefined,
      renderRoutes: [
        '/',
        '/recommend',
        '/singer',
        '/rank',
        '/search',
        '/account',
        '/detail'
      ],
      useRenderEvent: true,
      headless: true,
      onlyProduction: true,
      // 进行额外的操作
      postProcess: route => {
        // 预渲染内容写入之前的额外操作
        // 这里是通过正则找到预渲染时额外添加的 meta去除
        // 江哥的查找会有问题，会把整个变到一块
        // const reg = /<meta name="viewport".*user-scalable=no">/gi
        const reg = /<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no">/gi
        const res = route.html.match(reg)
        console.log(res)
        // route.html = route.html.replace(res[1], '')
        route.html = route.html.replace(res[0], '')
        // config.js是在node.js运行的
        // 因为要是删除预渲染添加的加载插件，因为带内容就不好用正则表达式去获取
        // 所以需要通过document去获取dom，
        // NodeJS中如何使用Document(掌握) 通过JSDOM 插件
        // 这里在预渲染时多渲染出了一个加载插件，需要移除
        // 1.根据字符串创建一个网页
        const html = new JSDOM(route.html)
        // 2.从创建好的网页中拿到document对象
        const dom = html.window.document
        const loadingEle = dom.querySelector('.container')
        dom.body.removeChild(loadingEle)
        // 进行序列化后重新赋值给route.html
        // jsdom 提供了serialize()方法  序列化对象转换为字符串
        route.html = html.serialize()
        return route
      }
    }
  }
}
