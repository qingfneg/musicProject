import axios from 'axios'
import Vue from 'vue'
// 进行一些全局配置
axios.defaults.baseURL = 'http://music.it666.com:3666'
// axios.defaults.baseURL = 'http://127.0.0.1:3000/'
axios.defaults.timeout = 5000

let count = 0
// 添加请求拦截器
// 在请求或响应被 then 或 catch 处理前拦截它们。
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // 由于歌手界面做了批量请求（一次发送多次请求），那么就需要记录发出多少次请求
  count++
  // 使用插件的全局方法时先要注册插件
  Vue.showLoading()
  return config
}, function (error) {
  // 对请求错误做些什么
  // 请求错误隐藏加载插件
  Vue.hiddenLoading()
  return Promise.reject(error)
})

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  // 在请求到数据后，要对数据做处理一段时间时隐藏加载插插件
  // 当响应的次数等于请求的次数时，才说明响应完成，在隐藏
  count--
  if (count === 0) {
    Vue.hiddenLoading()
  }
  return response
}, function (error) {
  // 对响应错误做点什么
  Vue.hiddenLoading()
  return Promise.reject(error)
})
// 封装自己的get/post方法
export default {
  get: function (path = '', data = {}) {
    return new Promise(function (resolve, reject) {
      axios.get(path, {
        params: data
      })
        .then(function (response) {
          resolve(response.data)
        })
        .catch(function (error) {
          reject(error)
        })
    })
  },
  post: function (path = '', data = {}) {
    return new Promise(function (resolve, reject) {
      axios.post(path, data)
        .then(function (response) {
          resolve(response.data)
        })
        .catch(function (error) {
          reject(error)
        })
    })
  },
  all: function (list) {
    return new Promise(function (resolve, reject) {
      axios.all(list)
        // 用扩张运算符解构结果...result
        .then(axios.spread(function (...result) {
          // 多个请求现在都执行完成
          resolve(result)
        }))
        .catch(function (err) {
          reject(err)
        })
    })
  }
}
