// pages/gopoint/gopoint.js
const hostUri = require('../../httpconfig').hostUri
const giftsServlet = require('../../httpconfig').giftsServlet
Page({

  /**
   * 页面的初始数据
   */
  data: {
    host: '',//主机网址
    pId:'',
    myPoint:0,//我的总积分
    giftInfo:[],//商品信息
    address: [],//用户信息
    remark: ''//备注信息
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    wx.getStorage({
      key: 'giftInfo',
      success: function (res) {
        self.setData({
          giftInfo: res.data,
          host: hostUri
        })
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var self = this;
    wx.getStorage({
      key: 'address',
      success: function (res) {
        self.setData({
          address: res.data,
          myPoint:res.data.point,
        })
      }
    });
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
  remarkInput(e) {
    this.setData({
      remark: e.detail.value
    });
  },
  updateAddress() {
    wx.navigateTo({ url: '/pages/address/address' });
  },
  //积分兑换商品
  GoOk: function () {
    let that = this;
    var obj = wx.getStorageSync('user');
    wx.request({
      url: giftsServlet,
      method: 'POST',
      data: {
        'userid': obj.id,
        'productid': that.data.giftInfo.id,
        'name': that.data.address.name,
        'phone': that.data.address.phone,
        'address': that.data.address.detail,
        'memo': that.data.remark
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      success: function (res) {
        console.info("[gopoint][http][giftsServlet][success]");
        wx.showToast({
          title: res.data.massage
        })
        if ('兑礼成功' == res.data.massage){
          that.sleep();
          wx.navigateBack();
        }
        
       
      },
      fail: function ({ errMsg }) {
       
        console.info("[gopoint][http][giftsServlet][fail]:" + errMsg);
      }
    })
  },
  sleep: function () {
    var now = new Date();
    var exitTime = now.getTime() + 1500;
    while (true) {
      now = new Date();
      if (now.getTime() > exitTime)
        return;
    }
  }
})