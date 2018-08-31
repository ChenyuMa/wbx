// pages/mine/micron/vouchers/vouchers.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight:'',
    camiloTxt:'',
    micron:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({ micron: options.micron });
    // 获取高度
    wx.getSystemInfo({
      success: function(res) {
        that.setData({ windowHeight:res.windowHeight});
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

  // 输入卡密
  inputCamilo:function(e){
    this.setData({ camiloTxt: e.detail.value});
  },

  // 充值卡密
  requestVouchers:function(){
    var that = this;
    wx.request({
      url: getApp().globalData.url +'/api/user/card_recharge',
      data: {
        login_token:wx.getStorageSync('loginToken'),
        card_key: that.data.camiloTxt
      },
      header: { 'content-type': 'application/json'},
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
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
      fail: function(res) {},
      complete: function(res) {},
    })
  }
})