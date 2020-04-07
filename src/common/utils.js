 //防抖动函数处理
export function debounce(func, delay) {
  let timer = null
  return function (...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}


//问题：如何将 服务器返回的 时间戳(时间戳：1535694719(秒)) 转成 时间格式化字符串(常用)
/* 1.将时间戳转化成Date对象
const date = new Date(1535694719*1000) */
/* 2.将date进行格式化，转成对应的字符串
date.getFullYear() + date.getMonth() + 1 */
//用format对象格式化(太常用)

export function formatDate(date, fmt) {
  //1，获取年份
  //y+ -> 1个或者多个y
  //y* -> 0个或者多个y
  //y? -> 0个或者1个y
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  //2.获取
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
    }
  }
  return fmt;
};

function padLeftZero (str) {
  return ('00' + str).substr(str.length);
};

//正则表达式：字符串匹配利器
