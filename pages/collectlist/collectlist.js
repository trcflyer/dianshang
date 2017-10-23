// pages/collectlist/collectlist.js
var app = getApp()
const getUserCollectServlet = require('../../httpconfig').getUserCollectServlet
const saveCarProductServlet = require('../../httpconfig').saveCarProductServlet
const hostUri = require('../../httpconfig').hostUri
Page({

  /**
   * 页面的初始数据
   */
  data: {
    host: '',//主机网址
    hasList: false,          // 列表是否有数据
    products: []//商品列表
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
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    that.getUserCollectServlet();
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
  //事件处理函数
  prodectTap: function (event) {
    var pId = event.currentTarget.dataset.productId;
    wx.navigateTo({ url: '/pages/productdetail/productdetail?pid=' + pId })

  },
  showLoading: function () {
    wx.showToast({
      title: '添加中',
      icon: 'loading'
    });
  },
  cancelLoading: function () {
    wx.hideToast();
  },
  //获取商品数据
  getUserCollectServlet: function () {
    let that = this;
    var obj = wx.getStorageSync('user');
    wx.request({
      url: getUserCollectServlet,
      method: 'POST',
      data: {
        'userid': obj.id
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      success: function (res) {
        console.info("[collectlist][http][getUserCollectServlet][success]");
        if (res.data.userCollectPouductList.length == 0) {
          that.setData({
            hasList: false
          });
          return;
        }
       
        that.setData({
          products: res.data.userCollectPouductList,
          host: hostUri,
          hasList: true
        });
        
      },
      fail: function ({ errMsg }) {
        console.info("[collectlist][http][getUserCollectServlet][fail]:" + errMsg);
      }
    })
  },
  //加入到购物车
  addShopCar: function (event) {
    var pId = event.currentTarget.dataset.productId;
    let that = this;
    var obj = wx.getStorageSync('user');
    that.showLoading();
    wx.request({
      url: saveCarProductServlet,
      method: 'POST',
      data: {
        'productid': pId,
        'amount': "1",
        'userid': obj.id
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      success: function (res) {
        console.info("[collectlist][http][saveCarProductServlet][success]" + res);
        that.cancelLoading();
        wx.showToast({
          title: res.data.massage
        })
        app.setRefreshShopCar(true);//更新购物车
      },
      fail: function ({ errMsg }) {
        that.cancelLoading();
        that.hideModal();
        console.info("[collectlist][http][saveCarProductServlet][fail]:" + errMsg);
      }
    })
  }
})