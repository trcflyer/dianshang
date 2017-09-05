// productlist.js
var app = getApp()
const productListByCategoryServlet = require('../../httpconfig').productListByCategoryServlet
const hostUri = require('../../httpconfig').hostUri
Page({

  /**
   * 页面的初始数据
   */
  data: {
    host: '',//主机网址
    currentTab:'',
    currentPage: 1,
    searchKey: '',//搜索关键字
    products: []//商品列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.setData({
      currentTab: options.currentTab,
    });
  },
  //事件处理函数
  prodectTap: function (event) {
    var pId = event.currentTarget.dataset.productId;
    wx.navigateTo({ url: '/pages/productdetail/productdetail?pid=' + pId })

  },
  //上拉加载
  onReachBottom: function () {
    let that = this;
    let p = that.data.currentPage;
    p = p + 1;
    that.setData({
      currentPage: p
    });
    that.gethttpProductListByCategoryServlet();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let that = this;
    that.setData({
      currentPage: 1
    });
    that.gethttpProductListByCategoryServlet();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    that.gethttpProductListByCategoryServlet();
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
  //获取商品数据
  gethttpProductListByCategoryServlet: function () {
    let that = this;
    let categoryid = that.data.currentTab;
    let page = that.data.currentPage;
    var tempProdect = [];
    if (page != 1) {
      tempProdect = that.data.products
    }
    console.log(that.data.currentPage);
    wx.request({
      url: productListByCategoryServlet,
      method: 'POST',
      data: {
        'categoryid': categoryid,
        'page': page,
        'size': 10,
        'searchKey': that.data.searchKey
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      success: function (res) {
        console.info("[productList][http][productListByCategoryServlet][success]");
        if (res.data.productListByCategoryList.length == 0) {
          that.setData({
            currentPage: that.data.currentPage - 1,
          });
          return;
        }
        for (var i = 0; i < res.data.productListByCategoryList.length; i++) {
          tempProdect.push(res.data.productListByCategoryList[i])
        }
        that.setData({
          products: tempProdect,
          host: hostUri,
        });
      },
      fail: function ({ errMsg }) {
        console.info("[productList][http][productListByCategoryServlet][fail]:" + errMsg);
      }
    })
  }
})