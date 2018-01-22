// pages/gopay/gopay.js
var app = getApp()
const hostUri = require('../../httpconfig').hostUri
const buyProductServlet = require('../../httpconfig').buyProductServlet
Page({

  /**
   * 页面的初始数据
   */
  data: {
    host: '',//主机网址
    shopPrice:0,//商品金额
    totalPrice: 0,           // 总价，初始为0
    address:'',//寄送地址
    addressshow_name: '',//寄送地址
    addressshow_phone: '',//寄送地址
    addressshow_address: '',//寄送地址
    payList:[],
    productIdList:[],
    go_btn:"go-footer-btn",
    postageMoney:"免运费",
    canClick:true,
    x: 0,
    y: 0,
    remark:''//备注信息
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var self = this;
    wx.getStorage({
      key: 'payList',
      success: function (res) {
        self.setData({
          payList: res.data,
          host: hostUri
        })
        self.getTotalPrice();
      }
    });
   
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
          addressshow_name: '收货人：'+ res.data.name ,
          addressshow_phone:  res.data.phone,
          addressshow_address: '邮寄地址：' + res.data.detail,//寄送地址
          
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
  /**
   * 计算总价
   */
  getTotalPrice() {
    let carts = this.data.payList;                  // 获取购物车列表
    let total = 0;
    let tempPrice =10;
    let list = [];
    for (let i = 0; i < carts.length; i++) {         // 循环列表得到每个数据
        total += carts[i].amount * carts[i].price;   // 所有价格加起来
        list.push(carts[i].product.id);
    }
    if (total.toFixed(2)>200){
      tempPrice = total;
    }else{
      tempPrice += total;
      this.setData({
        postageMoney: '10元',
      });
    }
    this.setData({                                // 最后赋值到data中渲染到页面
      shopPrice: total.toFixed(2),
      totalPrice: tempPrice.toFixed(2),
      productIdList: list
    });
  },
  /**
   * 修改地址
   */
  updateAddress(){
    wx.navigateTo({ url: '/pages/address/address' });
  },
  remarkInput(e){
    this.setData({
      remark: e.detail.value
    });
  },
  //去下单
  GoOk(){
    var that = this;
    var obj = wx.getStorageSync('user');
    if (that.data.address.name && that.data.address.phone &&that.data.address.detail)
    {
      
    }else{
      wx.showModal({
        title: '提示',
        content: '去填写右击地址',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({ url: '/pages/address/address' });
          } else if (res.cancel) {
            return;
          }
        }
      })
    }
    if (!that.data.canClick){
      return;
    }
    wx.request({
      url: buyProductServlet,
      method: 'POST',
      data: {
        'userid': obj.id,
        'name': that.data.address.name,
        'phone': that.data.address.phone,
        'address': that.data.address.detail,
        'productIdList': that.data.productIdList,
        'memo': that.data.remark,
        'total': that.data.totalPrice
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      success: function (res) {
        console.info("[gopay][http][buyProductServlet][success]");
        app.setRefreshShopCar(true);//更新购物车
        that.setData({                                // 最后赋值到data中渲染到页面
          go_btn: "go-footer-btn-dark",
          canClick: false,
        });
        wx.requestPayment({
          'timeStamp': res.data.paymentDate.timeStamp,
          'nonceStr': res.data.paymentDate.nonceStr,
          'package': res.data.paymentDate.package,
          'signType': res.data.paymentDate.signType,
          'paySign': res.data.paymentDate.paySign,
          'success': function (res) {
            console.info('支付成功');
            wx.navigateTo({ url: '/pages/index/index' });
          },
          'fail': function (res) {
            console.info('支付失败');
            console.info(res);
            wx.navigateTo({ url: '/pages/index/index' });
          }
        })
      },
      fail: function ({ errMsg }) {
        that.setData({                                // 最后赋值到data中渲染到页面
          go_btn: "go-footer-btn-dark",
          canClick: false,
        });
        console.info("[gopay][http][buyProductServlet][fail]:" + errMsg);
      }
    })
  }
})