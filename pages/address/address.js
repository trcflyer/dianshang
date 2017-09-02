// page/component/new-pages/user/address/address.js
var app = getApp()
const getUserByUserIdServlet = require('../../httpconfig').getUserByUserIdServlet
const updateUserInformationServlet = require('../../httpconfig').updateUserInformationServlet
Page({
  data:{
    address:{
      point: '',
      name:'',
      phone:'',
      detail:''
    }
  },
  onLoad(){
    var self = this;
    
    
  },
  /**
  * 生命周期函数--监听页面显示
  */
  onShow: function () {
    var self = this;
    /**
     * 获取本地缓存 地址信息
     */
    wx.getStorage({
      key: 'address',
      success: function (res) {
        self.setData({
          address: res.data
        })
      }
    })
  },

  formSubmit(){
    var self = this;
    if(self.data.address.name && self.data.address.phone && self.data.address.detail){
      // wx.setStorage({
      //   key: 'address',
      //   data: self.data.address,
      //   success(){
      //     wx.navigateBack();
      //   }
      // })
      self.updateUserByUserIdServlet();
    }else{
      wx.showModal({
        title:'提示',
        content:'请填写完整资料',
        showCancel:false
      })
    }
  },
  bindName(e){
    this.setData({
      'address.name' : e.detail.value
    })
  },
  bindPhone(e){
    this.setData({
      'address.phone' : e.detail.value
    })
  },
  bindDetail(e){
    this.setData({
      'address.detail' : e.detail.value
    })
  },
  
  /**
   * 更新用户保存的地址数据
   */
  updateUserByUserIdServlet: function () {
    let that = this;
    wx.request({
      url: updateUserInformationServlet,
      method: 'POST',
      data: {
        'userid': '1',
        'name': that.data.address.name,
        'phone': that.data.address.phone,
        'address': that.data.address.detail
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      success: function (res) {
        console.info("[address][http][updateUserInformationServlet][success]");
        wx.navigateBack();
      },
      fail: function ({ errMsg }) {
        console.info("[address][http][updateUserInformationServlet][fail]:" + errMsg);
      }
    })
  },
})