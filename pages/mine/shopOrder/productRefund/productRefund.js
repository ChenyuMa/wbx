// 时间转换
function timestampToTime(timestamp) {
  var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var D = (date.getDate() < 10 ? '0' : '') + date.getDate() + ' ';
  var h = (date.getHours() < 10 ? '0' : '') + date.getHours() + ':';
  var m = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes() + ':';
  var s = (date.getSeconds() < 10 ? '0' : '') + date.getSeconds();
  return Y + M + D + h + m + s;
} 

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 退款详情
    refundTrackAPI: '/api/userorder/list_refund_track',
    refundDetail: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("opt", options)
    var that = this;
    var orderID = options.orderID;
    var orderType = options.orderType;
    this.requestRefund(orderID, orderType)
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

  // 请求退款详情
  requestRefund: function (orderID, orderType) {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    wx.request({
      url: getApp().globalData.url + that.data.refundTrackAPI,
      data: {
        login_token: wx.getStorageSync('loginToken'),
        order_id: orderID,
        order_type: orderType,
      },
      header: { 'content-type': 'application/json' },
      method: 'POST',
      dataType: 'json',

      success: function (res) {
        wx.hideLoading()
        console.log("res", res)
        var refundDetailData = res.data.data
        refundDetailData.status_time = timestampToTime(refundDetailData.status_time)
        for (var i = 0; i < refundDetailData.order_track.length; i++) {
          refundDetailData.order_track[i].create_time = timestampToTime(refundDetailData.order_track[i].create_time)
        }
        refundDetailData.apply_time = timestampToTime(refundDetailData.apply_time)
        that.setData({
          refundDetail: refundDetailData
        })
        var pages = getCurrentPages();   
        var prevPage = pages[pages.length - 2];
        prevPage.refresh()
      },
      fail: function (res) {
        wx.hideLoading()
      }
    })
  },

  callPhone: function () {
    if (this.data.refundDetail.tel == '') {
      wx.showModal({
        title: '提示',
        content: '该商家暂未提供联系方式',
      })
    } else {
      wx.makePhoneCall({
        phoneNumber: this.data.refundDetail.tel,
      })
    }

  }
})