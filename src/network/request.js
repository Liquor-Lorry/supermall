import axios from 'axios'

export function request(config) {
     //1.创建axios实例
     const instance = axios.create({
      baseURL: 'http://123.207.32.32:8000/api/h8',
      timeout: 5000
    })

    //2.axios的拦截器
    //axios.interceptors//这个是全局拦截
    //2.1实例请求拦截
    instance.interceptors.request.use(config => {
      //console.log(config);
      return config//因为前面的config已经拦截，所以在这里要返回出去
      //请求拦截使用场景：
      //(1).比如config中的一些信息不符合服务器要求

      //(2).比如每次发送网络请求时，都希望在界面中显示一个请求的图标

      //(3).某些网络请求(比如登录)，必须携带一些特殊的信息

    }, err => {
      //console.log(err);
  })

    //2.2实例响应拦截
    instance.interceptors.response.use(res => {
      //console.log(res);
      return res.data//把我们需要的data返回
    }, err => {
      console.log(err);
  })

    //3.发送真正的网络请求
    //instance本身返回的就是一个Promise 所以可以直接返回
    return instance(config)
}


//回调简单解释:
//1.给函数test传两个参数aaa和bbb
//2.在调用test函数的时候再给里面传两个函数，一个赋值给aaa，一个赋值给bbb
//3.再在函数test()里面回调aaa()和bbb()

/* function test(aaa, bbb) {
  aaa('HelloWorld')
  bbb('ERROR MESSAGE')
}

test(function (res) {
  console.log(res);
}, function (err) {
  console.log(err);
}) */
