// productdetial.js
var app = getApp()
const productDetailByProductIdService = require('../../httpconfig').productDetailByProductIdService
const saveCarProductServlet = require('../../httpconfig').saveCarProductServlet
const collectServlet = require('../../httpconfig').collectServlet
const isCollectServlet = require('../../httpconfig').isCollectServlet
const hostUri = require('../../httpconfig').hostUri
Page({

  /**
   * 页面的初始数据
   */
  data: {
    host: '',//主机网址
    pId: '',
    winWidth: 0,
    winHeight: 0,
    imageTopHeight: 0,
    imageHeight:0,
    productDetial:{},
    buyCount: 1,//将要添加到购物车的商品的数量
    coloect : 0,//商品是否已收藏
    x:0,
    y:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.setData({
      pId: options.pid,
    });
    //获取系统信息
    wx.getSystemInfo({
      success: function (res) {
        var h = res.windowWidth*5/7;
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight,
          imageHeight: res.windowWidth,
          imageTopHeight: h,
          x: res.windowWidth-45,
          y: res.windowHeight*0.6,
        });
      }
    });
    that.getProductDetailByProductIdService();
    that.getColoectState();
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
    console.log("detail-pId:" + this.data.pId)
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
  showLoading: function () {
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    });
  },
  cancelLoading: function () {
    wx.hideToast();
  },
  getProductDetailByProductIdService: function () {
    let that = this;
    that.showLoading();
    wx.request({
      url: productDetailByProductIdService,
      method: 'POST',
      data: {
        'productid': that.data.pId
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      success: function (res) {
        console.info("[productdetail][http][productDetailByProductIdService][success]");
        console.info(res);
        that.cancelLoading();
        that.setData({
          host: hostUri,
          productDetial: res.data
        });
      },
      fail: function ({errMsg}) {
        that.cancelLoading();
        console.info("[productdetail][http][productDetailByProductIdService][fail]:" + errMsg);
      }
    })
  },
  showModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },
  //购物车减少商品数量
  buyNumDel: function () {
    let that = this;
    if (that.data.buyCount > 1) {
      var temp = that.data.buyCount - 1;
      that.setData({
        buyCount: temp,
      })
    }

  },
  //购物车添加商品数量
  buyNumAdd: function () {
    let that = this;
    var temp = that.data.buyCount + 1;
    console.info(temp)
    that.setData({
      buyCount: temp,
    })
  },
  //加入到购物车
  addShopCar: function(){
    let that = this;
    that.showLoading();
    var obj = wx.getStorageSync('user');
    wx.request({
      url: saveCarProductServlet,
      method: 'POST',
      data: {
        'productid': that.data.pId,
        'amount': that.data.buyCount+"",
        'userid': obj.id
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      success: function (res) {
        console.info("[productdetail][http][saveCarProductServlet][success]"+res);
        app.setRefreshShopCar(true);//更新购物车
        that.cancelLoading();
        that.hideModal();
        that.setData({
          buyCount: 1,
        });
        wx.showToast({
          title: res.data.massage
        })
       
      },
      fail: function ({ errMsg }) {
        that.cancelLoading();
        that.hideModal();
        console.info("[productdetail][http][saveCarProductServlet][fail]:" + errMsg);
      }
    })
  },
  /**
   * 返回首页
   */
  addToIndex(){
    wx.reLaunch({
      url: '/pages/index/index'
    })
  },
  /**
  * 返回首页
  */
  addToShopCar() {
    wx.switchTab({
      url: '/pages/shopcar/shopcar'
    })
  },
  /**
   * 修改该商品的收藏状态
   */
  addColoect(){
    let that = this;
    var obj = wx.getStorageSync('user');
    wx.request({
      url: collectServlet,
      method: 'POST',
      data: {
        'productid': that.data.pId,
        'userid': obj.id
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      success: function (res) {
        console.info("[productdetail][http][collectServlet][success]" + res);
        wx.showToast({
          title: res.data.massage,
          duration: 2000
        })
        that.getColoectState();
      },
      fail: function ({ errMsg }) {
        console.info("[productdetail][http][collectServlet][fail]:" + errMsg);
      }
    })
  },
  /**
  * 获取该商品的收藏状态
  */
  getColoectState() {
    let that = this;
    var obj = wx.getStorageSync('user');
    wx.request({
      url: isCollectServlet,
      method: 'POST',
      data: {
        'productid': that.data.pId,
        'userid': obj.id
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      success: function (res) {
        console.info("[productdetail][http][collectServlet][success]" + res);
        that.setData({
          coloect: res.data.massage,
        });
      },
      fail: function ({ errMsg }) {
        console.info("[productdetail][http][collectServlet][fail]:" + errMsg);
      }
    })
  }
})
