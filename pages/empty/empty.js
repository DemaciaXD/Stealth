// pages/empty/empty.js

const app = getApp();

Page({

  data: {
    title: '',
    btnText: '',
    
  },

  onLoad: function (options) {
    this.setData({
      options: options
    }, () => {
      if (app.globalData.status !== null) {
        this.dealStatus(app.globalData.status);
      } else {
        app.statusReadyCallback = res => {
          this.dealStatus(res);
        }
      }
    });
  },

  dealStatus(status) {
    switch (status) {
      case '0':
        console.log('重试');
        this.setData({
          title: '网络错误',
          btnText: '点击重试'
        });
        break;
      case '1':
        console.log('需要授权');
        this.setData({
          title: '授权失败',
          btnText: '点击重新授权'
        });
        wx.getUserInfo({
          success: res => {
            // 获取到了用户信息，请求自己的接口
            app.loadData();
          },
          fail: res => {
            app.globalData.status = '1';
            wx.hideLoading();
          }
        })
        break;
      case '2':
        console.log('登陆成功');
        // 判断是否需要引导
        this.reLaunch();
        break;
      default:
        this.setData({
          title: '网络错误',
          btnText: '点击重试'
        });
    }
    this.setData({
      show: status !== '2'
    });
  },

  reauthorize() {
    if (app.globalData.status === '1') {
      wx.openSetting({
        success: (res) => {

        }
      })
    } else {
      app.loadData();
    }
  },

  // 重制路由
  reLaunch() {
    wx.reLaunch({
      url: "/pages/index/index"
    }
    );
  },
})