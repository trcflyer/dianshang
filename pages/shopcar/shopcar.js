// page/component/new-pages/cart/cart.js
var app = getApp()
const getCarProductServlet = require('../../httpconfig').getCarProductServlet
const saveCarProductServlet = require('../../httpconfig').saveCarProductServlet
const hostUri = require('../../httpconfig').hostUri
Page({
  data: {
    host: '',//主机网址
    carts:[],               // 购物车列表
    hasList:false,          // 列表是否有数据
    totalPrice:0,           // 总价，初始为0
    selectAllStatus:true,    // 全选状态，默认全选
    go_btn: "go-footer-btn",
    x: 0,
    y: 0
  },
  /**
   * 系统方法
   */
  onShow() {
    var that = this;
    let flag = app.globalData.refreshShopCar;
    console.log(flag);
    if(flag){
      this.setData({                                // 最后赋值到data中渲染到页面
        totalPrice: 0
      });
      that.getCarProductServlet();
      app.setRefreshShopCar(false);
    }
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //获取系统信息
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          x: res.windowWidth - 45,
          y: res.windowHeight * 0.6,
        });
      }
    });
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
   * 当前商品选中事件
   */
  selectList(e) {
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    const selected = carts[index].selected;
    carts[index].selected = !selected;
    this.setData({
      carts: carts
    });
    this.getTotalPrice();
  },

  /**
   * 删除购物车当前商品
   */
  deleteList(e) {
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    let num = carts[index].amount;
    num = "-" + num;
    this.updateShopCar("del",carts[index].product.id, num);

  },

  /**
   * 购物车全选事件
   */
  selectAll(e) {
    let selectAllStatus = this.data.selectAllStatus;
    selectAllStatus = !selectAllStatus;
    let carts = this.data.carts;

    for (let i = 0; i < carts.length; i++) {
      carts[i].selected = selectAllStatus;
    }
    this.setData({
      selectAllStatus: selectAllStatus,
      carts: carts
    });
    this.getTotalPrice();
  },

  /**
   * 绑定加数量事件
   */
  addCount(e) {
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    let num = carts[index].amount;
    this.updateShopCar("add",carts[index].product.id, "1");
  
      // carts[index].amount = num;
      // this.setData({
      //   carts: carts
      // });
      // this.getTotalPrice();
   // console.log(this.returnTest());
  },

  /**
   * 绑定减数量事件
   */
  minusCount(e) {
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    let num = carts[index].amount;
    if(num <= 1){
      return false;
    }
    this.updateShopCar("min",carts[index].product.id, "-1");
    //   carts[index].amount = num;
    //   this.setData({
    //     carts: carts
    //   });
    //   this.getTotalPrice();
  },

  /**
   * 计算总价
   */
  getTotalPrice() {
    let carts = this.data.carts;                  // 获取购物车列表
    let total = 0;
    for(let i = 0; i<carts.length; i++) {         // 循环列表得到每个数据
      if(carts[i].selected) {                     // 判断选中才会计算价格
        total += carts[i].amount * carts[i].price;   // 所有价格加起来
      }
    }
    this.setData({                                // 最后赋值到data中渲染到页面
      carts: carts,
      totalPrice: total.toFixed(2)
    });
  },
  /**
   * 去结算，下单
   */
  shopCarGoPay(){
    var payList = [];
    for (let i = 0; i < this.data.carts.length; i++) {
      if (this.data.carts[i].selected == true){
        payList.push(this.data.carts[i]);
      }
    }
    if (payList.length<=0){
      wx.showToast({
        title: '您还没有选择商品'
      })
      return;
    }
    wx.setStorage({
      key: 'payList',
      data: payList,
      success() {
        wx.navigateTo({ url: '/pages/gopay/gopay' });
      }
    });
  },
 
  //下拉刷新
  onPullDownRefresh: function () {
    var that = this;
    that.getCarProductServlet();
  },
  /**
   * 获取购物车商品数据
   */
  getCarProductServlet: function () {
    let that = this;
    var obj = wx.getStorageSync('user');
    wx.request({
      url: getCarProductServlet,
      method: 'POST',
      data: {
        'userid': obj.id
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      success: function (res) {
        console.info("[shopcar][http][getCarProductServlet][success]");
        that.setData({
          host: hostUri,
          carts: res.data.car_ItemsList
        });
        let cs = that.data.carts;
        if(cs.length>0){
          for (let i = 0; i < cs.length; i++) {
            cs[i].selected = true;
          }
          that.setData({
            carts: cs,
            hasList: true,
          });
          that.getTotalPrice();
        }
        wx.stopPullDownRefresh();
      },
      fail: function ({ errMsg }) {
        console.info("[shopcar][http][getCarProductServlet][fail]:" + errMsg);
        wx.stopPullDownRefresh();
      }
    })
  },
  //更新修改购物车
  updateShopCar(fromClick,pId, amount) {
    let that = this;
    var obj = wx.getStorageSync('user');
    wx.request({
      url: saveCarProductServlet,
      method: 'POST',
      data: {
        'productid': pId,
        'amount': amount,
        'userid': obj.id
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      success: function (res) {
        console.info("[productdetail][http][saveCarProductServlet][success]" + res);
        that.setData({
          buyCount: 1,
        });
        that.updateCarts(fromClick, pId);
      },
      fail: function ({ errMsg }) {
        console.info("[productdetail][http][saveCarProductServlet][fail]:" + errMsg);
        return false;

      }
    })
  },
  //更新本地购物车
  updateCarts(fromClick, pId){
    var index = 0;
    let carts = this.data.carts;
    for (var i = 0; i < carts.length;i++){
      if (carts[i].product.id == pId){
        index = i;
      }
    }
    if (fromClick=="del"){
      carts.splice(index, 1);
      this.setData({
        carts: carts
      });
      if (!carts.length) {
        this.setData({
          hasList: false
        });
      } else {
        this.getTotalPrice();
      }
      wx.showToast({
        title: '删除商品成功'
      })
    } else if (fromClick == "min") {
      let num = carts[index].amount;
      num = num - 1;
      carts[index].amount = num;
      this.setData({
        carts: carts
      });
      this.getTotalPrice();
    } else if(fromClick == "add") {
      let num = carts[index].amount;
      num = num + 1;
      carts[index].amount = num;
      this.setData({
        carts: carts
      });
      this.getTotalPrice();
    }
  }
})