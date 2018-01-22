//index.js
//获取应用实例
var app = getApp()
const topImagesPathListServlet = require('../../httpconfig').topImagesPathListServlet
const categoryListServlet = require('../../httpconfig').categoryListServlet
const productListByCategoryServlet = require('../../httpconfig').productListByCategoryServlet
const saveCarProductServlet = require('../../httpconfig').saveCarProductServlet
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
    imageHeight: 0,
    loading:"--已加载全部数据--",
    // tab切换
    currentTab: '0',
    currentPage:1,
    searchKey:'',//搜索关键字
    products:[]//商品列表
  },
  //事件处理函数
  prodectTap: function (event) {
    var pId = event.currentTarget.dataset.productId;
    wx.navigateTo({ url: '/pages/productdetail/productdetail?pid=' + pId }) 
    
  },
  // // 滑动切换tab
  // bindChange: function (e) {
  //   var that = this;
  //   that.setData({ currentTab: e.detail.current });
  //   that.gethttpProductListByCategoryServlet();

  // },
  //点击tab切换
  swichNav: function (e) {
    let that = this;
    if (that.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab:e.target.dataset.current,
        currentPage:1,
      });
      console.info("currentTab:"+that.data.currentTab);
      that.gethttpProductListByCategoryServlet();
      // var currentTab = e.target.dataset.current;
      // wx.navigateTo({ url: '/pages/productlist/productlist?currentTab=' + currentTab  }) 
    }
  },
  //上拉加载
  onReachBottom: function(){
    let that = this;
    let p = that.data.currentPage;
    p = p+1;
    that.setData({
      loading:"奋力加载中...",
      currentPage:p
    });
    that.gethttpProductListByCategoryServlet();
  },
  onShow:function(){
    this.setData({
      searchKey: ''
    });
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
          var h = res.windowWidth * 5 / 7;
          that.setData({
            winWidth: res.windowWidth,
            winHeight: res.windowHeight,
            imageHeight: h,
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
    wx.navigateTo({ url: '/pages/productlist/productlist?currentTab=0&searchKey=' + this.data.searchKey }) 
  },
//获取顶部分类栏
  gethttpCategoryListServlet: function(){ 
    let that = this;
    //that.showLoading();
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
    //that.showLoading();
    wx.request({
      url: topImagesPathListServlet,
      method: 'POST',
      success: function (res) {
        console.info("[index][http][topImagesPathListServlet][success]");
        console.log(res);
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
   // that.showLoading();
    var tempProdect = [];
    if (page != 1){
      tempProdect =  that.data.products
    }
    console.log("currentPage:"+that.data.currentPage);
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
        wx.stopPullDownRefresh();
        console.info("[index][http][productListByCategoryServlet][success]");
       // that.cancelLoading();
        if (res.data.productListByCategoryList.length == 0){
          if (page == 1) {
            that.setData({
              loading: '暂无数据，敬请期待',
                products: tempProdect,
            });
            return;
          }
          that.setData({
            currentPage: that.data.currentPage-1,
            loading:'--已加载全部数据--'
          });
          return ;
        }
        for (var i = 0; i < res.data.productListByCategoryList.length;i++){
          tempProdect.push(res.data.productListByCategoryList[i])
        }
          that.setData({
            products: tempProdect,
          });
      },
      fail: function ({errMsg}) {
        //that.cancelLoading();
        wx.stopPullDownRefresh();
        console.info("[index][http][productListByCategoryServlet][fail]:" + errMsg);
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
        console.info("[index][http][saveCarProductServlet][success]" + res);
        that.cancelLoading();
        wx.showToast({
          title: res.data.massage
        })
        app.setRefreshShopCar(true);//更新购物车
      },
      fail: function ({ errMsg }) {
        that.cancelLoading();
        that.hideModal();
        console.info("[index][http][saveCarProductServlet][fail]:" + errMsg);
      }
    })
  }
})
