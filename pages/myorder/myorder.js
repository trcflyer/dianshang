// myorder.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders: [{
      number: 111,
      name: "华为P9手机",
      count: 23,
      status: '未支付',
      money: 67.99,
      btnName: "去付款",
      thumb: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1409687278,979007170&fm=26&gp=0.jpg'
    },
    {
      number: 111,
      name: "华为荣耀手机",
      count: 23,
      status: '未支付',
      money: 67.99,
      btnName:"去付款",
      thumb: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1409687278,979007170&fm=26&gp=0.jpg'
    },
    {
      number: 111,
      name: "OPPO R11",
      count: 23,
      status: '已支付',
      money: 67.99,
      btnName: "看进度",
      thumb: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1409687278,979007170&fm=26&gp=0.jpg'

    },
    {
      number: 111,
      name: "小米Max玫瑰金",
      count: 23,
      status: '已支付',
      money: 67.99,
      btnName: "去评价",
      thumb: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1409687278,979007170&fm=26&gp=0.jpg'

    }],
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
  
  }
})