// pages/mine/shopOrder/orderDetails/orderDetails.js
var util = require('../../../../utils/util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    orderID: '',
    loginToken: '',
    details_buygreensAPI: '/api/userorder/get_buygreens_order_detail',
    details_shopAPI: '/api/userorder/get_shop_order_detail',
    cancelAPI: '/api/userorder/cancel_shop_order',
    refundsAPI: '/api/userorder/refund_buygreens_order',
    cancelRefundsAPI: '/api/userorder/cancel_buygreens_refund',
    confirmGoodsAPI: '/api/userorder/confirm_buygreens_order',
    confirmGoods: '/api/userorder/confirm_shop_order',
    afterSaleAPI: '/api/userorder/add_customer_service',
    deletingOrderAPI: '/api/userorder/delete_buygreens_order',
    appraiseAPI: '/api/userorder/add_assess',
    detailsList: [],
    createTime: '',
    callPhone: '',
    imgUrls: getApp().globalData.imgUrls,
    selected:'',
    markers: [{
      latitude:'',
      longitude:'',
      iconPath:'/images/diliveryman@2x.png',
      width:30,
      height:30,
    }],
    longitude:'',
    latitude:'',
    is_orderTracking:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.setData({
      loginToken: wx.getStorageSync('loginToken'),
      orderID: options.orderID,
      selected: options.selected,
    });
    if (options.selected == 1){
      wx.request({
        url: getApp().globalData.url + that.data.details_buygreensAPI,
        data: {
          login_token: that.data.loginToken,
          order_id: that.data.orderID
        },
        header: { 'content-type': 'application/json' },
        method: 'POST',
        dataType: 'json',
        success: function (res) {
          console.log('商品详情:',res);
          //获取时间
          var createtime = res.data.data.create_time;
          var newDate = new Date();
          newDate.setTime(createtime * 1000);
          if (res.data.data.fengniao) {
            var markers = that.data.markers;
            markers[0].latitude = res.data.data.fengniao[0].lat;
            markers[0].longitude = res.data.data.fengniao[0].lng;
            that.setData({
              detailsList: res,
              createTime: util.formatTime(newDate),
              latitude: res.data.data.fengniao[0].lat,
              longitude: res.data.data.fengniao[0].lng,
              markers: markers
            });
          }else{
            that.setData({
              detailsList: res,
              createTime: util.formatTime(newDate),
            });
          }
          
        },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else if (options.selected == 2){
      wx.request({
        url: getApp().globalData.url + that.data.details_shopAPI,
        data: {
          login_token: that.data.loginToken,
          order_id: that.data.orderID
        },
        header: { 'content-type': 'application/json' },
        method: 'POST',
        dataType: 'json',
        success: function (res) {
          console.log('商品详情:', res);
          //获取时间
          var createtime = res.data.data.create_time;
          var newDate = new Date();
          newDate.setTime(createtime * 1000);
          if (res.data.data.fengniao) {
            var markers = that.data.markers;
            markers[0].latitude = res.data.data.fengniao[0].lat;
            markers[0].longitude = res.data.data.fengniao[0].lng;
            that.setData({
              detailsList: res,
              createTime: util.formatTime(newDate),
              latitude: res.data.data.fengniao[0].lat,
              longitude: res.data.data.fengniao[0].lng,
              markers: markers
            });
          }else{
            that.setData({
              detailsList: res,
              createTime: util.formatTime(newDate),
            });
          }
          
        },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
  },

  //拨打电话
  callPhone: function () {
    var that = this;
    wx.makePhoneCall({
      phoneNumber: that.data.detailsList.data.data.tel
    })
  },
  //取消订单
  cancelOrder: function () {
    var that = this;
    wx.request({
      url: getApp().globalData.url + that.data.cancelAPI,
      data: {
        login_token: that.data.loginToken,
        order_id: that.data.orderID
      },
      header: { 'content-type': 'application/json' },
      method: 'POST',
      dataType: 'json',
      success: function (res) {

      },
      fail: function (res) { },
      complete: function (res) { },
    })
    wx.navigateBack({
      delta: 1
    })
  },
  //退款
  refunds: function () {
    var that = this;
    wx.request({
      url: getApp().globalData.url + that.data.refundsAPI,
      data: {
        login_token: loginToken,
        order_id: orderID
      },
      header: { 'content-type': 'application/json' },
      method: 'POST',
      dataType: 'json',
      success: function (res) {
      },
      fail: function (res) { },
      complete: function (res) { },
    })
    wx.navigateBack({
      delta: 1
    })
  },
  //确认收货
  confirmGoods: function (e) {
    var that = this;
    var pages = getCurrentPages();
    var prePage = pages[pages.length - 2];
    prePage.confirmGoods(e)
    
    wx.navigateBack({
      delta: 1
    })
  },
  //取消退款
  cancelRefunds: function () {
    var that = this;
    wx.request({
      url: getApp().globalData.url + that.data.cancelRefundsAPI,
      data: {
        login_token: loginToken,
        order_id: orderID
      },
      header: { 'content-type': 'application/json' },
      method: 'POST',
      dataType: 'json',
      success: function (res) {
      },
      fail: function (res) { },
      complete: function (res) { },
    })
    wx.navigateBack({
      delta: 1
    })
  },
  //申请售后
  afterSale: function () {
    var that = this;
    wx.request({
      url: getApp().globalData.url + that.data.afterSaleAPI,
      data: {
        login_token: loginToken,
        order_id: orderID
      },
      header: { 'content-type': 'application/json' },
      method: 'POST',
      dataType: 'json',
      success: function (res) {
      },
      fail: function (res) { },
      complete: function (res) { },
    })
    wx.navigateBack({
      delta: 1
    })
  },
  //删除订单
  deletingOrder: function () {
    var that = this;
    wx.request({
      url: getApp().globalData.url + that.data.deletingOrderAPI,
      data: {
        login_token: loginToken,
        order_id: orderID
      },
      header: { 'content-type': 'application/json' },
      method: 'POST',
      dataType: 'json',
      success: function (res) {
      },
      fail: function (res) { },
      complete: function (res) { },
    })
    wx.navigateBack({
      delta: 1
    })
  },
  //去评价
  appraise: function () {
    var that = this;
    wx.request({
      url: getApp().globalData.url + that.data.appraiseAPI,
      data: {
        login_token: loginToken,
        order_id: orderID
      },
      header: { 'content-type': 'application/json' },
      method: 'POST',
      dataType: 'json',
      success: function (res) {
      },
      fail: function (res) { },
      complete: function (res) { },
    })
    wx.navigateBack({
      delta: 1
    })
  },

  // 点击订单跟踪
  clickTracking:function(){
    var that = this;
    this.setData({ is_orderTracking: !that.data.is_orderTracking});
  },

  //关闭订单跟踪
  closeTracking:function(){
    var that = this;
    this.setData({ is_orderTracking: !that.data.is_orderTracking });
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