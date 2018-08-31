// pages/home/shopDetails/sweepPages/orderPages/orderPages.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 屏幕高度
    windowHeight: '',
    // 扫码订单号
    out_trade_no:'',
    orderInfo:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //获取屏幕高度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight
        });
      },
    });

    this.setData({
      out_trade_no: options.out_trade_no
    });

    // 获取订单信息
    this.getOrderInof();
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

  /**
   * 获取订单数据
   */
  getOrderInof:function(){
    var that = this;
    wx.request({
      url: getApp().globalData.url +'/api/scanorder/get_scan_order',
      data: {
        login_token:wx.getStorageSync('loginToken'),
        out_trade_no: this.data.out_trade_no
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
          var create_time = res.data.data.create_time.split(' ');
          var orderInfo = res.data.data;
          orderInfo.create_time = create_time[1];
          that.setData({
            orderInfo: orderInfo
          });
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  /**
   * 点击加菜
   */
  clickAddFood:function(){
    wx.navigateBack({
      delta: 2,
    });
  },

  /**
   * 立即买单
   */
  clickPay:function(){
    wx.navigateTo({
      url: '../confirmClearing/confirmClearing?out_trade_no=' + this.data.out_trade_no,
    })
  }
})