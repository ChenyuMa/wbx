// pages/mine/setBalanceCode/setBalanceCode.js
var md5 = require('../../../utils/md5.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight: '',
    mobile:'',
    newCode:'',
    confirmCode:'',
    code:'',
    clickCode:60,
    clickGetCode:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({ windowHeight: res.windowHeight });
      },
    })
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

  // 输入框改变
  newCode: function (e) {
    console.log(e.detail.value);
    this.setData({ newCode: e.detail.value });
  },

  // 
  confirmCode: function (e) {
    this.setData({ confirmCode: e.detail.value });
  },

  // 
  code: function (e) {
    this.setData({ code: e.detail.value });
  },

  // 
  getCode: function () {
    var that = this;
    this.setData({clickGetCode:false});
    var time = setInterval(function () { 
      that.setData({ clickCode: that.data.clickCode-1}) 
      if (that.data.clickCode == 0){
        clearInterval(time);
        that.setData({
          clickGetCode:true,
          clickCode:60
        });
      }
      },1000);
    
    // 
    wx.request({
      url: getApp().globalData.url + '/api/user/get_user_info',
      data: {
        login_token: wx.getStorageSync('loginToken')
      },
      header: { 'content-type': 'application/json' },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        that.setData({ mobile: res.data.data.mobile})
        wx.request({
          url: getApp().globalData.url + '/api/user/sendsms',
          data: {
            mobile: res.data.data.mobile
          },
          header: { 'content-type': 'application/json' },
          method: 'POST',
          dataType: 'json',
          responseType: 'text',
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  // 
  reset:function(){
    var that = this;
    if (this.data.newCode != this.data.confirmCode){
      wx.showToast({
        title: '密码不正确',
      })
      return false
    }
    var passWords = md5.hexMD5(md5.hexMD5(this.data.newCode));
    wx.request({
      url: getApp().globalData.url + '/api/user/update_pay_password',
      data: {
        login_token: wx.getStorageSync('loginToken'),
        mobile: that.data.mobile,
        code:that.data.code,
        new_pay_password: passWords
      },
      header: { 'content-type': 'application/json' },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function (res) { 
        console.log(res);
        if(res.data.state == 0){
          wx.showToast({
            title: res.data.msg,
          })
        }else{
          wx.navigateBack({
            delta:1
          })
        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  }
})