// pages/mine/messageCenter/messageCenter.js
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
    // 选择消息
    isSelectMessage:!false,
    // 选择通知
    isSelectNotice:false,
    systemAPI:'/api/user/list_system_message',
    systemList:[],
    userLogin:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // 获取高度
    wx.getSystemInfo({
      success: function(res) {
        that.setData({ windowHeight:res.windowHeight});
      },
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
    var that = this;
    this.getSystemInfo(that.data.systemAPI);
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
   * 获取系统消息
   */
  getSystemInfo:function(API){
    var that = this;
    wx.request({
      url: getApp().globalData.url+API,
      data: {
        login_token:wx.getStorageSync('loginToken')
      },
      header: { 'content-type': 'application/json'},
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        if(res.data.state == 0){
          if(res.data.msg == '请先绑定手机'){
            wx.navigateTo({
              url: '../../bindPhone/bindPhone',
            })
          }else if(res.data.msg == '请先登陆'){
            wx.navigateTo({
              url: '../login/login',
            })
            that.setData({ userLogin:true});
          } else {
            wx.showToast({
              title: res.data.msg,
            })
          };
        }else{
          if (res.data.msg == '成功'){
            var list = res.data.data;
            for (var i = 0; i < list.length; i++) {
              var dayData = timestampToTime(list[i][0].create_time);
              list[i][0].create_time = dayData;
            }
            that.setData({
              systemList: res.data.data
            });
          }
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  /**
   * 点击了消息
   */
  clickMessage:function(){
    var that = this;
    that.setData({
      isSelectMessage: !that.data.isSelectMessage,
      isSelectNotice: !that.data.isSelectNotice,
    });
  },

  /**
   * 点击了通知单
   */
  clickNotice:function(){
    var that = this;
    that.setData({
      isSelectNotice:!that.data.isSelectNotice,
      isSelectMessage: !that.data.isSelectMessage
    });
  },

  // 取消
  clickCancel: function () {
    this.setData({
      userLogin: false
    });
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
    // getApp().wxGetSetting();
    this.setData({
      userLogin: false
    });
    getApp().globalData.userLogin = true;
    setTimeout(function () { that.getSystemInfo(that.data.systemAPI)},1500);
  },
})