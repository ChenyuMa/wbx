// pages/mine/exchange/exchangeNow/exchangeNow.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight:'',
    address:[],
    imgUrls: getApp().globalData.imgUrls,
    goodsList:[],
    num:'',
    allIntegral:'',
    addr_id:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.setData({
      goodsList: JSON.parse(options.goodsList),
      num:options.num,
      allIntegral: options.allIntegral
    });
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight
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
    this.getAddr();
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

  // 请求地址
  getAddr:function(){
    var that = this;
    // 请求地址
    wx.request({
      url: getApp().globalData.url + '/api/integral/get_address',
      data: {
        login_token: wx.getStorageSync('loginToken')
      },
      header: { 'content-type': 'application/json' },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        console.log('请求地址:',res);
        if(res.data.state == 0){
          
        }else{
          if (res.data.msg == "暂无数据"){
            wx.navigateTo({
              url: '../../address/address',
            })
          }else{
            that.setData({
              address: res.data.data,
              addr_id: res.data.data.id
            });
          }
        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  // 确认兑换
  confirmExchange:function(e){
    var that = this;
    wx.request({
      url: getApp().globalData.url + '/api/integral/exchange_goods',
      data: {
        login_token: wx.getStorageSync('loginToken'),
        goods_id: that.data.goodsList[0].goods_id,
        num:that.data.num,
        addr_id: that.data.addr_id
      },
      header: { 'content-type': 'application/json' },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        console.log(res);
        if (res.data.state == 0){
          wx.showModal({
            title: '提示',
            content: res.data.msg,
          })
        }else{
          wx.showToast({
            title: res.data.msg,
          })
          setTimeout(function(){
            wx.navigateBack({
              delta: 3,
            })
          },1500);
        }
      },
      fail: function (res) { },
      complete: function (res) {
        
      },
    })
  },

  // 选择地址
  selectAddr:function(){
    wx.navigateTo({
      url: '../../../mine/address/address',
    })
  }
})