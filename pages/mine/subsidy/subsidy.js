// pages/mine/subsidy/subsidy.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight:'',
    list:[],
    rule:'',
    is_rule:false
  },

  // 点击规格
  click_rule:function(){
    var that = this;
    this.setData({
      is_rule:!that.data.is_rule
    });
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

    wx.request({
      url: getApp().globalData.url +'/api/subsidyincentive/list_subsidy_incentive',
      data: {
        login_token: wx.getStorageSync('loginToken')
      },
      header: { 'content-type': 'application/json'},
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        console.log(res);
        that.setData({
          list:res.data.data.list,
          rule: res.data.data.rule
        });        
      },
      fail: function(res) {},
      complete: function(res) {},
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
  
  }
})