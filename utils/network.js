function request(type = "GET", path, success, fail, args = null) {
  console.log("=====>", args);
  wx.request({
    url: "http://192.168.1.113:8080/small/" + path,
    method: type,
    data: { 'message': JSON.stringify(args)},
    header: {
      'Access-Control-Allow-Origin': '*',
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'cookie': wx.getStorageSync("sessionid")
    },
    success: function (res) {
      console.log(res);
      if (res.statusCode === 200) {
        success && success(res.data, res);
        console.log("=================== 请求成功 ===================");
        console.log("请求方式：", type);
        console.log("请求路径：", 'http://192.168.1.113:8080/rest/small/' + path);
        console.log("请求参数：", args);
        console.log("返回数据：", res.data);
        console.log("==============================================");
      } else {
        fail && fail(res);
      }
    },
    fail: function (res) {
      console.log("=================== 请求失败 ===================");
      console.log("请求返回：", res);
      console.log("==============================================");
      fail && fail(res);
    }
  })
}

module.exports.request = request