import Vue from 'vue'
import VueRouter from 'vue-router'
// 注意点: 通过 improt xxx from xxx的方式加载组件, 无论组件有没有被用到, 都会被加载进来
// import Recommend from '../views/Recommend'
// import Rank from '../views/Rank'
// import Singer from '../views/Singer'
// import Search from '../views/Search'
// 实现Vue组件的按需加载   动态地加载模块 用异步的方式，
// 这里的写法是webpack4根据ES6规范 定义了 import(）写法
const Recommend = (resolve) => {
  import('../views/Recommend').then((module) => {
    resolve(module)
  })
}
const Rank = (resolve) => {
  import('../views/Rank').then((module) => {
    resolve(module)
  })
}
const Singer = (resolve) => {
  import('../views/Singer').then((module) => {
    resolve(module)
  })
}
const Search = (resolve) => {
  import('../views/Search').then((module) => {
    resolve(module)
  })
}
const Detail = (resolve) => {
  import('../views/Detail').then((module) => {
    resolve(module)
  })
}
const Account = (resolve) => {
  import('../views/Account').then((module) => {
    resolve(module)
  })
}

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/recommend' },
  {
    path: '/recommend',
    component: Recommend,
    children: [{
      // 注意点: 如果是嵌套路由(子路由), 那么不用写一级路径的地址, 并且也不用写/
      // 犯错/:id/:type漏了/，写成/:id:type 导致跳转错误
      path: 'detail/:id/:type',
      component: Detail
    }]
  },
  {
    path: '/singer',
    component: Singer,
    children: [{
      // 注意点: 如果是嵌套路由(子路由), 那么不用写一级路径的地址, 并且也不用写/
      // 犯错/:id/:type漏了/，写成/:id:type 导致跳转错误
      path: 'detail/:id/:type',
      component: Detail
    }]
  },
  {
    path: '/rank',
    component: Rank,
    children: [{
      // 注意点: 如果是嵌套路由(子路由), 那么不用写一级路径的地址, 并且也不用写/
      // 犯错/:id/:type漏了/，写成/:id:type 导致跳转错误
      path: 'detail/:id/:type',
      component: Detail
    }]

  },
  { path: '/search', component: Search },
  { path: '/account', component: Account }
]

const router = new VueRouter({
  /*
  注意点: 如果Router中使用的是history模式, 那么打包之后的项目不能刷新, 刷新就会出现404
  解决方案: 1.Router这两个不要使用history模式, 使用hash模式
            2.在服务端上面进行一些额外的配置
  * */
  // 注意点: 如果需要使用预渲染的插件, 那么Router的模式必须是history模式
  mode: 'history',
  // mode: 'hash',
  base: process.env.BASE_URL,
  routes: routes
})

export default router
