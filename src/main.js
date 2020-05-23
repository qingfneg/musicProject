import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import fastclick from 'fastclick'
import './assets/css/base.scss'
import VueLazyload from 'vue-lazyload'
// 移动端调试工具VConsole 在手机端可以看到浏览器一样的调试信息
// import VConsole from 'vconsole'
import Loading from './plugin/loading/index'
import MetaInfo from 'vue-meta-info'
//
Vue.use(MetaInfo)
// 使用vue懒加载图片插件vue-lazyload
Vue.use(VueLazyload, {
  // 可以通过配置loading来设置图片还未加载好之前的占位图片
  loading: require('./assets/images/loading.png')
})
// 注意点: 如果想通过use的方式来注册组件, 那么必须先将组件封装成插件
Vue.use(Loading, {
  title: '正在加载...'
})
// 解决click事件有100~300ms延迟，产生点穿透问题，
fastclick.attach(document.body)
Vue.config.productionTip = false

// const vconsole = new VConsole()
// Vue.use(vconsole)
new Vue({
  router,
  store,
  render: h => h(App),
  // 以下代码是安装了预渲染的插件之后自动添加的
  mounted: () => document.dispatchEvent(new Event('x-app-rendered'))
}).$mount('#app')
