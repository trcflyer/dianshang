// myorder.js
var app = getApp()
const getIndentHistoryServlet = require('../../httpconfig').getIndentHistoryServlet
const buyIndentServlet = require('../../httpconfig').buyIndentServlet
const hostUri = require('../../httpconfig').hostUri
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders: [],
    hasList: false,          // 列表是否有数据
    host: '',//主机网址
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getIndentHistoryInfo();
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
  //获取订单列表信息
  getIndentHistoryInfo : function(){
    let that = this;
    var obj = wx.getStorageSync('user');
    wx.request({
      url: getIndentHistoryServlet,
      method: 'POST',
      data: {
        'userid': obj.id
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      success: function (res) {
        if (res.data.indentHistoryList.length > 0) {
          that.setData({
            hasList: true,
          });
        }else{
          that.setData({
            hasList: false,
          });
        }
        console.info("[myorder][http][getIndentHistoryServlet][success]");
        console.info(res.data);
        that.setData({
          orders: res.data.indentHistoryList,
          host: hostUri,
        });
      },
      fail: function ({ errMsg }) {
        console.info("[myorder][http][getIndentHistoryServlet][fail]:" + errMsg);
      }
    })
  },
  //事件处理函数
  prodectTap: function (event) {
    var pId = event.currentTarget.dataset.productId;
    wx.navigateTo({ url: '/pages/productdetail/productdetail?pid=' + pId })

  },
  //支付
  payOrders: function (e){
    var orderid = e.target.dataset.orderid;
    var that = this;
    var obj = wx.getStorageSync('user');
    wx.request({
      url: buyIndentServlet,
      method: 'POST',
      data: {
        'userid': obj.id,
        'orderid': orderid
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      success: function (res) {
        console.info("[gopay][http][buyProductServlet][success]");
        app.setRefreshShopCar(true);//更新购物车
        wx.requestPayment({
          'timeStamp': res.data.paymentDate.timeStamp,
          'nonceStr': res.data.paymentDate.nonceStr,
          'package': res.data.paymentDate.package,
          'signType': res.data.paymentDate.signType,
          'paySign': res.data.paymentDate.paySign,
          'success': function (res) {
            console.info('支付成功');
            that.getIndentHistoryInfo();
          },
          'fail': function (res) {
            console.info('支付失败');
            console.info(res);
          }
        })
      },
      fail: function ({ errMsg }) {
        console.info("[gopay][http][buyProductServlet][fail]:" + errMsg);
      }
    })
  },
  //物流详情信息
  logDetail:function(e){
    var indent = e.target.dataset.indent;
    wx.navigateTo({ url: '/pages/logistics/logistics?indent=' + indent  }) 
  }
})