//app.js
var network = require('/utils/network.js');

App({
  onLaunch: function () {
    this.loadData();
  },

  loadData() {
    wx.showLoading({
      title: '启动中',
      mask: true
    })
    wx.login({
      success: res => {
        if (res.code) {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          this.getUserInfo(res.code);
        } else {
          // 登陆失败：空白页添加按钮提示用户主动登陆
          this.errorDeal("网络错误：code=1", '0');
        }
      },
      fail: res => {
        // 登陆失败：空白页添加按钮提示用户主动登陆
        this.errorDeal("网络错误：code=2", '0');
      },
    });
  },

  // 获取用户信息，并请求服务器
  getUserInfo(code) {
    // 检查是否授权过
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 授权过用户信息
          wx.getUserInfo({
            success: res => {
              // 获取到了用户信息，请求自己的接口
              this.globalData.userInfo = res.userInfo
              this.doLogin(res.encryptedData, res.iv, code);
            },
            fail: res => {
              this.errorDeal("获取授权信息失败 code=0", '0');
            }
          })
        } else {
          // 未授权：跳转中间页 去授权
          this.errorDeal("获取授权信息失败 code=1", '1');
        }
      },
      fail: res => {
        this.errorDeal("获取授权信息失败 code=2", '0');
      }
    })
  },

  // 暂时做成全部执行登陆操作。优化逻辑，小程序退出的时候清除 sessionid, 再登陆前，判断是否有sessionid。
  doLogin(encryptedData, iv, code) {
    let args = {
      encryptedData: encryptedData,
      iv: iv,
      js_code: code
    }
    console.log(args);
    let self = this;
    network.request('POST', 'rc/login', function (content, data) {
      console.log(content);
      let res = data.data;
      if (data.statusCode === 200) {
        // 登陆成功
        wx.setStorageSync("sessionid", data.header["Set-Cookie"])
        self.globalData.status = '2';
        wx.hideLoading();
        if (self.statusReadyCallback) {
          self.statusReadyCallback('2')
        }
      } else {
        self.errorDeal("登陆失败，请重试 code=3", '0');
      }
    }, function () {
      // 失败
      self.errorDeal("登陆失败，请重试 code=4", '0');
    }, args)
  },

  errorDeal(tip, status) {
    wx.showToast({
      title: tip,
      icon: 'none'
    });
    console.log("=====>", status);
    this.globalData.status = status;
    wx.hideLoading();
    if (this.statusReadyCallback) {
      this.statusReadyCallback(status)
    }
  },

  globalData: {
    userInfo: null,
    status: null, // '0'：请求失败，需要重试 '1'： 未授权 '2'：登陆成功
  }
})