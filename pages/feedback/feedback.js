// pages/feedback/feedback.js
var app = getApp()
const saveFeedBackServlet = require('../../httpconfig').saveFeedBackServlet
Page({

  /**
   * 页面的初始数据
   */
  data: {
    feedback:'',
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
  bindFeedback(e) {
    this.setData({
      feedback: e.detail.value
    })
  },
  formSubmit() {
    var self = this;
    if (self.data.feedback) {
      self.saveFeedBackServlet();
    } else {
      wx.showModal({
        title: '提示',
        content: '请填您要反馈的信息',
        showCancel: false
      })
    }
  },
  saveFeedBackServlet(){
    let that = this;
    var obj = wx.getStorageSync('user');
    wx.request({
      url: saveFeedBackServlet,
      method: 'POST',
      data: {
        'userid': obj.id,
        'feedback': that.data.feedback
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      success: function (res) {
        console.info(res.data);
        console.info("[feedback][http][saveFeedBackServlet][success]");
        wx.showToast({
          title: res.data.massage
        })
        if ("提交成功" == res.data.massage){
              that.setData({
                feedback:""
              });
        }
      },
      fail: function ({ errMsg }) {
        console.info("[feedback][http][saveFeedBackServlet][fail]:" + errMsg);
      }
    })
  }
})