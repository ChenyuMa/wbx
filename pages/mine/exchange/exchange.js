// pages/mine/exchange/exchange.js
var page = 1;
var num = 20;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 屏幕高度
    windowHeight: '',
    // 获取图片地址
    imgUrls: getApp().globalData.imgUrls,
    url: getApp().globalData.url,
    // 
    exchangeAPI:'/api/integral/list_integral_goods',
    exchangeList:[],
    goodsList:[],
    userLogin:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          windowHeight:res.windowHeight
        });
      },
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
    var that = this;
    this.requestExchange();
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

  requestExchange:function(){
    var that = this;
    // 获取积分兑换数据
    wx.request({
      url: getApp().globalData.url + that.data.exchangeAPI,
      data: {
        login_token: wx.getStorageSync('loginToken'),
        page: page,
        num: num
      },
      header: { 'content-type': 'application/json' },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        if (res.data.state == 0) {
          if (res.data.msg == '请先绑定手机') {
            wx.navigateTo({
              url: '../../bindPhone/bindPhone',
            })
          } else if (res.data.msg == '请先登陆') {
            that.setData({ userLogin: true });
          } else {
            wx.showToast({
              title: res.data.msg,
            })
          }
        } else {
          that.setData({
            exchangeList: res.data.data
          });
        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  //点击查看商品 
  clickImg:function(e){
    wx.navigateTo({
      url: './exchangeGoods/exchangeGoods?goods_id=' + e.currentTarget.dataset.goods_id,
    })
  },

  //点击兑换积分 
  clickExchange:function(e){
    wx.navigateTo({
      url: './exchangeNow/exchangeNow?goods_id=' + e.currentTarget.dataset.goods_id,
    })
  },

  // 兑换记录
  exchangeRecord:function(){
    wx.navigateTo({
      url: './exchangeRecord/exchangeRecord',
    })
  },

  // 立即兑换
  clickeExchange:function(e){
    var that = this;
    // wx.navigateTo({
    //   url: 'pages/mine/exchange/exchangeNow/exchangeNow?num=' + 1 + "&goods_id=" + e.currentTarget.dataset.item.goods_id + "&goodsList=" + JSON.stringify(this.data.goodsList) + "&allIntegral=" + this.data.allIntegral,
    // })
    var goodsList = [];
    goodsList.push(e.currentTarget.dataset.item);
    wx.navigateTo({
      url: './exchangeNow/exchangeNow?num=' + 1 + "&goods_id=" + e.currentTarget.dataset.item.goods_id + "&goodsList=" + JSON.stringify(goodsList) + "&allIntegral=" + e.currentTarget.dataset.item.integral,
    })
  },
  // 允许获取权限
  clickAllow: function (e) {
    var that = this;
    var nickName = e.detail.userInfo.nickName;
    var face = e.detail.userInfo.avatarUrl;
    var encryptedData = e.detail.encryptedData;
    var iv = e.detail.iv;
    wx.login({
      success: function(res) {
        var code = res.code;
        getApp().globalData.code = res.code;
        if (code){
          getApp().getOpenID(code, nickName, face);
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    });
    getApp().wxGetSetting();
    this.setData({
      userLogin: false
    });
    getApp().globalData.userLogin = true;
    setTimeout(function () { that.requestExchange()},5000);
  },
  // 取消
  clickCancel: function () {
    this.setData({
      userLogin: false
    });
  },
})