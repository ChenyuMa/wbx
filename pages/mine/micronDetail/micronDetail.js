// pages/mine/micronDetail/micronDetail.js
var page = 1;
var num = 20;
function timestampToTime(timestamp) {
  var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var D = date.getDate() + ' ';
  var h = date.getHours() + ':';
  var m = date.getMinutes() + ':';
  var s = date.getSeconds();
  return Y + M + D + h + m + s;
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight:'',
    detailList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // 获取高度
    wx.getSystemInfo({
      success: function(res) {
        that.setData({windowHeight:res.windowHeight});
      },
    });
    // 请求微米明细
    this.requestDetail();
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
    page = 1;
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

  // 请求微米明细
  requestDetail:function(){
    var that = this;
    wx.request({
      url: getApp().globalData.url +'/api/user/list_yue_logs',
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
        console.log(res);
        if(res.data.state == 0){
          wx.showToast({
            title: res.data.msg,
          });
          return false;
        }
        var List = res.data.data;
        var detailList = that.data.detailList;
        for(var i = 0;i < List.length;i++){
          List[i].create_time = timestampToTime(List[i].create_time);
          detailList.push(List[i]);
        }
        that.setData({
          detailList: detailList
        });
        page ++;
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  // 触动到底部
  tolower:function(){
    this.requestDetail();
  }
})