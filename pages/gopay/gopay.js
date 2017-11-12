// pages/gopay/gopay.js
const hostUri = require('../../httpconfig').hostUri

Page({

  /**
   * 页面的初始数据
   */
  data: {
    host: '',//主机网址
    totalPrice: 0,           // 总价，初始为0
    address:'',//寄送地址
    payList:[]
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
          address: '邮寄地址：' + res.data.detail + '  ' + res.data.name + ' 收\n电话：' + res.data.phone,
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
    for (let i = 0; i < carts.length; i++) {         // 循环列表得到每个数据
        total += carts[i].amount * carts[i].price;   // 所有价格加起来
    }
    this.setData({                                // 最后赋值到data中渲染到页面
      totalPrice: total.toFixed(2)
    });
  },
  /**
   * 修改地址
   */
  updateAddress(){
    wx.navigateTo({ url: '/pages/address/address' });
  },
  GoOk(){
    
  }
})