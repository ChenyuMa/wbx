// pages/mine/micron/micron.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 屏幕高度
    windowHeight: '',
    imgUrls:getApp().globalData.imgUrls,
    // 余额
    micron:'',
    detailImg:'balance_withdrawal@2x.png',
    rechargeImg:'balance_recharge@2x.png',
    vouchersImg:'balance_voucher@2x.png',
    // 获取余额明细
    detailAPI:'/api/user/list_yue_logs',
    // 充值
    rechargeAPI:'/api/user/recharge',
    // 代金券
    vouchersAPI:'/api/user/card_recharge'
  },
  // 余额明细
  detail:function(){

  },
  // 充值
  recharge:function(){
    wx.navigateTo({
      url: './recharge/recharge?micron=' + this.data.micron,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  // 代金券
  vouchers:function(){
    wx.navigateTo({
      url: './vouchers/vouchers?micron=' + this.data.micron,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // 获取屏幕高度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight
        });
      },
    })

    this.setData({
      micron: options.micron
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
    console.log('生命周期函数--监听页面卸载');
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

  //明细
  detail:function(){
    wx.navigateTo({
      url: '../micronDetail/micronDetail',
    })
  } 
})