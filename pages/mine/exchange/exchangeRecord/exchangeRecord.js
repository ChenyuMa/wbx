// pages/mine/exchange/exchangeRecord/exchangeRecord.js
var page = 1;
var num = 10;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight:'',
    page:1,
    num:10,
    recordList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({windowHeight:res.windowHeight});
      },
    });
    this.requestRecord();
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
   *请求兑换记录 
   */ 
  requestRecord:function(){
    var that = this;
    wx.request({
      url: getApp().globalData.url +'/api/integral/list_my_integral_goods',
      data: {
        login_token:wx.getStorageSync('loginToken'),
        page:page,
        num:num
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
          if(res.data.msg == '暂无数据'){
            wx.showToast({
              title: res.data.msg,
            })
          }else{
            var recordList = that.data.recordList;
            for (var i = 0; i < res.data.data.length; i++){
              recordList.push(res.data.data[i]);
            }
            that.setData({
              recordList: recordList
            });
            
          }
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  /**
   *点击兑换商品 
   */ 
  clickRecord:function(){
    wx.navigateTo({
      url: './recordDetails/recordDetails?recordList=' + JSON.stringify(this.data.recordList),
    })
  }
})