// order.js
const getUserByUserIdServlet = require('../../httpconfig').getUserByUserIdServlet
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    winWidth: 0,
    winHeight: 0,
    thumb: '',
    nickname: '',
    address: {
      point: '',
      name: '',
      phone: '',
      detail: ''
    },
    userListInfo: [{
      icon: '../../image/iconfont-card.png',
      navigatorurl:'/pages/myorder/myorder',
      text: '我的订单',
      isunread: false,
      unreadNum: 2
    }, {
      icon: '../../image/iconfont-card.png',
      navigatorurl: '/pages/address/address?from=my',
      text: '地址管理',
      isunread: false,
      unreadNum: 2
    }, {
      icon: '../../image/iconfont-card.png',
      navigatorurl: '/pages/collectlist/collectlist',
      text: '我的收藏',
      isunread: false,
      unreadNum: 1
    }, {
        icon: '../../image/iconfont-card.png',
        navigatorurl: '/pages/pointcenter/pointcenter',
        text: '积分商城'
    }, {
        icon: '../../image/iconfont-card.png',
        navigatorurl: '/pages/feedback/feedback',
        text: '意见反馈'
    }, {
        icon: '../../image/iconfont-card.png',
        navigatorurl: '/pages/aboutus/aboutus',
        text: '关于我们'
    }]


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this;
    //获取系统信息
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });

    /**
     * 获取用户信息
     */
    // wx.getUserInfo({
    //   success: function (res) {
    //     that.setData({
    //       thumb: res.userInfo.avatarUrl,
    //       nickname: res.userInfo.nickName
    //     })
    //   }
    // });
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        thumb: userInfo.avatarUrl,
        nickname: userInfo.nickName
      })
    });

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
   
    that.getUserByUserIdServlet();

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var obj = wx.getStorageSync('user');
    return {
      title: '哇，发现一个好玩的应用，赶快来体验吧',
      path: '/pages/index/index?fromId=' + obj.openid,
      imageUrl: '../../image/shareImage.jpg'
    }
  },
  /**
  * 获取用户保存的地址数据
  */
  getUserByUserIdServlet: function () {
    let that = this;
    var obj = wx.getStorageSync('user');
    wx.request({
      url: getUserByUserIdServlet,
      method: 'POST',
      data: {
        'userid': obj.id
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      success: function (res) {
        console.info("[address][http][getUserByUserIdServlet][success]");
        that.setData({
          'address.point': res.data.user.point,
          'address.name': res.data.user.username,
          'address.phone': res.data.user.phone,
          'address.detail': res.data.user.address,
          'address.userid': res.data.user.userid,
          'address.sharecount': res.data.user.sharecount

        });
        wx.setStorage({
          key: 'address',
          data: that.data.address,
          success() {
            
          }
        })
      },
      fail: function ({ errMsg }) {
        console.info("[address][http][getUserByUserIdServlet][fail]:" + errMsg);
      }
    })
  }
})