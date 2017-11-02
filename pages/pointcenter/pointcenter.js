// pages/pointcenter/pointcenter.js
var app = getApp()
const getGiftsServlet = require('../../httpconfig').getGiftsServlet
const giftsServlet = require('../../httpconfig').giftsServlet
const hostUri = require('../../httpconfig').hostUri
Page({

  /**
   * 页面的初始数据
   */
  data: {
    productList:[],
    host: '',//主机网址
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
    this.gethttpGiftsServlet();
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
 * 页面相关事件处理函数--监听用户下拉动作
 */
  onPullDownRefresh: function () {
    let that = this;
    that.gethttpGiftsServlet();
  },
  //获取可积分商品数据
  gethttpGiftsServlet: function () {
    let that = this;
    wx.request({
      url: getGiftsServlet,
      method: 'POST',
      data: {
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      success: function (res) {
        wx.stopPullDownRefresh();
        console.info("[index][http][getGiftsServlet][success]");
        that.setData({
          host: hostUri,
          productList: res.data.productList
        })
      },
      fail: function ({ errMsg }) {
        //that.cancelLoading();
        wx.stopPullDownRefresh();
        console.info("[index][http][getGiftsServlet][fail]:" + errMsg);
      }
    })
  },
  //图片点击效果事件
  giftImgTap: function (event) {
    var pId = event.currentTarget.dataset.giftId;
    wx.navigateTo({ url: '/pages/productdetail/productdetail?pid=' + pId }) 

  },
  //底部按钮点击事件
  giftButtonTap: function (event) {
    var pId = event.currentTarget.dataset.giftId;
  }
})