const URL_API = "https://app.vrzff.com"
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const dueTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  

  return [year, month, day].map(formatNumber).join('/') 
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

let getQueryString = function (url, name) {
  var reg = new RegExp('(^|&|/?)' + name + '=([^&|/?]*)(&|/?|$)', 'i')
  var r = url.substr(1).match(reg)
  if (r != null) {
    return r[2]
  }
  return null;
}
function dataRequst(url, cb, data, error) {
  wx.request({
    url: URL_API + url,
    data: data,
    method: "POST",
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    success: function (res) {
      console.log("数据请求成功！");
      return typeof cb == "function" && cb(res.data);
    },
    fail: function (res) {
      console.log("数据请求失败！");
      console.log(res);
      return typeof error == "function" && error(res.data);
    },
    complete: function () {
      console.log("请求完成！");
    }
  });
}
module.exports = {
  getQueryString: getQueryString,
  formatTime: formatTime,
  dueTime: dueTime,
  dataRequst: dataRequst
}




