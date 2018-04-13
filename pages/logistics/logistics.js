// pages/logistics/logistics.js
const getCarrieInfoServlet = require('../../httpconfig').getCarrieInfoServlet
const hostUri = require('../../httpconfig').hostUri
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indentid:'',//物流订单id
    carrieInfo:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.setData({
      indentid: options.indent,
    });
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
    this.getHttpCarrieInfoServlet();
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
    var obj = wx.getStorageSync('user');
    return {
      title: '哇，发现一个好玩的应用，赶快来体验吧',
      path: '/pages/index/index?fromId=' + obj.openid,
      imageUrl: '../../image/shareImage.jpg'
    }
  },
  //获取物流
  getHttpCarrieInfoServlet: function () {
    let that = this;
    console.info(that.data.indentid);
    wx.request({
      url: getCarrieInfoServlet,
      method: 'POST',
      data: {
        'indentid': that.data.indentid
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      success: function (res) {
        console.info("[logistics][http][getHttpCarrieInfoServlet][success]");
        for (let i = 0; i < res.data.carrieinfo.Traces.length; i++) {
          var temp = res.data.carrieinfo.Traces[i].AcceptTime.split(" ");
          res.data.carrieinfo.Traces[i].date = temp[0];
          res.data.carrieinfo.Traces[i].time = temp[1];
        }
        that.setData({
          carrieInfo: res.data.carrieinfo,
        });
      },
      fail: function ({ errMsg }) {
        console.info("[logistics][http][getHttpCarrieInfoServlet][fail]:" + errMsg);
      }
    })
  }
})