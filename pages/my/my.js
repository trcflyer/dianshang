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
    hasAddress: false//是否显示地址详情

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
    // /**
    //  * 获取本地缓存 地址信息
    //  */
    // wx.getStorage({
    //   key: 'address',
    //   success: function (res) {
    //     self.setData({
    //       hasAddress: false,
    //       address: res.data
    //     })
    //   }
    // });
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
          'address.userid': res.data.user.userid
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