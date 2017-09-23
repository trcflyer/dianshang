//app.js
const getOpenIdServlet = require('httpconfig').getOpenIdServlet
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
    var that = this;
    wx.checkSession({
      success: function () {
        //session 未过期，并且在本生命周期一直有效
      that.getLogin();
        console.log("openid未失效");
      },
      fail: function () {
        //登录态过期
        that.getLogin();
      }
    })
  },

  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.getUserInfo({
        withCredentials: false,
        success: function (res) {
          that.globalData.userInfo = res.userInfo
          typeof cb == "function" && cb(that.globalData.userInfo)
          wx.setStorageSync('userInfo', res.userInfo);//存储openid  
        }
      })
    }
  },
  setRefreshShopCar(flag) {
    this.globalData.refreshShopCar = flag;
  },
  globalData: {
    userInfo: null,
    refreshShopCar: true,//是否需要刷新购物车
    // loginInfo: {//获取openid需要的登陆信息
    //   appid: 'wx3ffddc885c6fe780',//appid  
    //   secret: 'a2a5e7fda02f7aad3ac56d9d86e0cbda',//secret 
    // }
  },
  getLogin() {
    var that = this;
    //获取用户登陆信息，用code换取openid
    wx.login({
      success: function (res) {
        if (res.code) {
          var uI = wx.getStorageSync('userInfo') ||{};
          var nickName = uI.nickName||"";
          //发起网络请求
          wx.request({
            url: getOpenIdServlet,
            method: 'POST',
            data: {
               "code": res.code ,
               "classify":"1",
               "userName": nickName
               },
            header: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            success: function (res) {
              var obj = {};
              obj = res.data.user;
              wx.setStorageSync('user', obj);//存储openid    
            }
          });
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
  }
})
