// pages/bindPhone/bindPhone.js
var md5 = require('../../utils/md5.js');
//倒计时
var that = this;
var countdown = 60;
var settime = function (that) {
  if (countdown == 0) {
    that.setData({
      is_show: true,
      last_time:60
    })
    countdown = 60;
    return;
  } else {
    that.setData({
      is_show: false,
      last_time: countdown
    })
    countdown--;
  }
  setTimeout(function () {
    settime(that)
  }, 1000)
};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight:'',
    phoneTxt:'',
    verificationTxt:'',
    codeAPI: '/api/user/sendsms',
    is_show:true,
    last_time:60,
    openID:'',
    unionID:'',
    nickName:'',
    face:''
  },
  
  // 手机输入框改变
  phone_change:function(e){
    var that = this;
    this.setData({
      phoneTxt: e.detail.value
    });
  },
  // 验证码
  verification_change:function(e){
    this.setData({
      verificationTxt: e.detail.value
    });
  },
  // 获取验证码
  getCode: function () {
    var that = this;
    if (this.data.phoneTxt == ''){
      return false;
    }
    wx.request({
      url: getApp().globalData.url + that.data.codeAPI,
      data: {
        mobile: that.data.phoneTxt
      },
      header: { 'content-type': 'application/json' },
      method: 'POST',
      dataType: 'json',
      success: function (res) {
        if (res.data.state == 0){
          wx.showModal({
            title: '提示',
            content: res.data.msg,
          })
        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })
    // 将获取验证码按钮隐藏60s，60s后再次显示
    that.setData({
      is_show: !that.data.is_show  //false
    })
    if (countdown == 60){
      settime(that);
    }
  },
  // 密码
  password_change:function(e){
    this.setData({
      passwordTxt: e.detail.value
    });
  },
  // 取消绑定
  cancel:function(){
    wx.switchTab({
      url: '../home/home',
    })
  },
  // 确定绑定
  bind_phone:function(){
    var that = this;
    // var passwordTxt = md5.hexMD5(that.data.passwordTxt);
    wx.request({
      url: getApp().globalData.url +'/api/user/wx_bind_mobile',
      data: {
        open_id: that.data.openID,
        union_id: that.data.unionID,
        nickname: that.data.nickName,
        face: that.data.face,
        app_type:'wx',
        version:'2.0',
        registration_id:'123456',
        mobile:that.data.phoneTxt,
        code: that.data.verificationTxt,
        // password: ''
      },
      header: { 'content-type': 'application/json'},
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        console.log(res);
        if(res.data.state == 0){
          wx.showModal({
            title: '提示',
            content: res.data.msg,
          })
        }else{
          wx.setStorageSync('loginToken', res.data.data.login_token);
          wx.setStorageSync('userLogin', true);
          getApp().globalData.userLogin = true;
          wx.navigateBack({
            delta: 1
          })
        }
      },
      fail: function(res) {
        wx.showToast({
          title: res.data.msg,
        })
      },
      complete: function(res) {
      },
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // 获取屏幕高度
    that.setData({
      openID: wx.getStorageSync('openID'),
      unionID: wx.getStorageSync('unionID'),
      nickName: wx.getStorageSync('nickName'),
      face: wx.getStorageSync('face')
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