//index.js
//获取应用实例
var app = getApp()
const topImagesPathListServlet = require('../../httpconfig').topImagesPathListServlet
const categoryListServlet = require('../../httpconfig').categoryListServlet
const productListByCategoryServlet = require('../../httpconfig').productListByCategoryServlet
const hostUri = require('../../httpconfig').hostUri
Page({
  data: {
    categoryList: [],//分类栏
    userInfo: {},
    host:'',//主机网址
    imgUrls: [],//轮播图
    //tab 页面配置
    winWidth: 0,
    winHeight: 0,
    // tab切换
    currentTab: 0,
    currentPage:1,
    searchKey:'',//搜索关键字
    products:[]//商品列表
  },
  //事件处理函数
  prodectTap: function (event) {
    var pId = event.currentTarget.dataset.productId;
    wx.navigateTo({ url: '/pages/productdetail/productdetail?pid=' + pId }) 

  },
  // 滑动切换tab
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });
    that.gethttpProductListByCategoryServlet();

  },
  //点击tab切换
  swichNav: function (e) {
    let that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      });
      that.gethttpProductListByCategoryServlet();
    }
  },
  //上拉加载
  onReachBottom: function(){

  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    }),
    //获取系统信息
    wx.getSystemInfo({
        success: function (res) {
          that.setData({
            winWidth: res.windowWidth,
            winHeight: res.windowHeight
          });
        }
    });
    that.gethttpTopImagesPathListServlet();
    that.gethttpCategoryListServlet();
    that.gethttpProductListByCategoryServlet();
    
  },
  showLoading: function () {
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    });
  },
  cancelLoading: function () {
    wx.hideToast();
  },
  //搜索框关键字
  searchInput: function (e) {
    this.setData({
      searchKey: e.detail.value
    });
    this.gethttpProductListByCategoryServlet();
  },
//获取顶部分类栏
  gethttpCategoryListServlet: function(){ 
    let that = this;
    that.showLoading();
    wx.request({
      url: categoryListServlet,
      method: 'POST',
      success: function (res) {
        console.info("[index][http][categoryListServlet][success]");
        that.cancelLoading();
          that.setData({
            categoryList: res.data.categoryList,
          });
      },
      fail: function ({errMsg}) {
        that.cancelLoading();
        console.info("[index][http][categoryListServlet][fail]:" + errMsg);
      }
    })
  },
  //获取顶部轮播图
  gethttpTopImagesPathListServlet:function(){
    let that = this;
    that.showLoading();
    wx.request({
      url: topImagesPathListServlet,
      method: 'POST',
      success: function (res) {
        console.info("[index][http][topImagesPathListServlet][success]");
        that.cancelLoading();
          that.setData({
          host:hostUri,
          imgUrls: res.data.topImagesPathList,
          });
      },
      fail: function ({errMsg}) {
        that.cancelLoading();
        console.info("[index][http][topImagesPathListServlet][fail]:" + errMsg);
      }
    })
  },
  //获取商品数据
  gethttpProductListByCategoryServlet:function(){
    let that = this;
    let categoryid = parseInt(that.data.currentTab);
    let page = that.data.currentPage;
    that.showLoading();
    wx.request({
      url: productListByCategoryServlet,
      method: 'POST',
      data:{
        'categoryid': categoryid,
        'page': page,
        'size':10,
        'searchKey': that.data.searchKey
      },
      header:{
        'Content-Type':'application/x-www-form-urlencoded',
      },
      success: function (res) {
        console.info("[index][http][productListByCategoryServlet][success]");
        that.cancelLoading();
          that.setData({
            products: res.data.productListByCategoryList
          });
      },
      fail: function ({errMsg}) {
        that.cancelLoading();
        console.info("[index][http][productListByCategoryServlet][fail]:" + errMsg);
      }
    })
  }
})
