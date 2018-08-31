// pages/mine/invitation/invitation.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight:0,
    url:'https://www.wbx365.com/Wbxwaphome/apply/merchant_detail/userid/',
    userid:0
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
          windowHeight: res.windowHeight,
          userid: options.userid
        });
      },
    });
    // 要求小程序返回分享目标信息
    wx.showShareMenu({
      withShareTicket: true
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
    var that = this;
    return {
      title: '小程序(终身版)免费送!',
      path: 'pages/mine/invitation/openShop/openShop?userid=' + that.data.userid,
      success: function (res) {
        //可以获取群组信息
        wx.getShareInfo({
          shareTicket: shareTickets[0],
          success: function (res) {
            wx.navigateTo({
              url: './openShop/openShop',
            })
          }
        })
      },
      fail: function (res) { }
    }
  },

  
})