// pages/mine/exchange/exchangeGoods/exchangeGoods.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight: '',
    goodsID:'',
    goodsList:[],
    num:0,
    allIntegral:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight
        });
      },
    });
    this.setData({goodsID:options.goods_id});
    wx.request({
      url: getApp().globalData.url +'/api/integral/get_integral_goods_details',
      data: {
        login_token: wx.getStorageSync('loginToken'),
        goods_id:that.data.goodsID
      },
      header: { 'content-type': 'application/json'},
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        that.setData({goodsList:res.data.data});
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
  
  },
  // 商品减
  minusNum:function(){
    var num  = this.data.num;
    var allIntegral = this.data.allIntegral;
    allIntegral -= this.data.goodsList.integral;
    if(num == 0){
      return false;
    }
    num--;
    this.setData({
      num:num,
      allIntegral: allIntegral
    });
  },
  // 商品加
  addNum:function(){
    var num = this.data.num;
    var allIntegral = this.data.allIntegral;
    allIntegral += this.data.goodsList.integral;
    num ++;
    this.setData({
      num:num,
      allIntegral: allIntegral
    });
  },
  //立即兑换 
  exchangesNow:function(){
    var that = this;
    wx.navigateTo({
      url: '../exchangeNow/exchangeNow?num=' + this.data.num + "&goods_id=" + this.data.goodsID + "&goodsList=" + JSON.stringify(this.data.goodsList) + "&allIntegral=" + this.data.allIntegral,
    })
  }
})