// pages/mine/micron/recharge/recharge.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight: '',
    inputTxt: '',
    micron: 0
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

    this.setData({ micron: options.micron ? options.micron:0 });
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
  // 充值的金额
  rechargeMoney: function (e) {
    this.setData({ inputTxt: e.detail.value });
  },
  // 确认充值
  confirmMoney: function () {
    var that = this;
    console.log(that.data.inputTxt.length)
    if (that.data.inputTxt.length > 6) {
      wx.showToast({
        title: '充值金额过大',
      })
    } else {
      wx.login({
        success: function (res) {
          wx.request({
            url: getApp().globalData.url + '/api/buygreens/wechat_recharge',
            data: {
              login_token: wx.getStorageSync('loginToken'),
              money: that.data.inputTxt,
              code_openid: res.code
            },
            header: { 'content-type': 'application/json' },
            method: 'POST',
            dataType: 'json',
            responseType: 'text',
            success: function (res) {
              wx.requestPayment({
                timeStamp: res.data.timeStamp,
                nonceStr: res.data.nonceStr,
                package: res.data.package,
                signType: res.data.signType,
                paySign: res.data.paySign,
                success: function (res) {
                  wx.navigateBack({
                    delta: 1
                  })
                }
              })
            },
            fail: function (res) { },
            complete: function (res) { },
          })
        },
        fail: function (res) { },
        complete: function (res) { },
      })
    }


  }
})