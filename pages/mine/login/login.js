
var md5 = require('../../../utils/md5.js');
// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loginHeight:'',
    clearUser: 'none',
    clearPassword: 'none',
    inputUserTxt:'',
    inputPasswordTxt:'',
    isDisabled:'true',
    loginAPI:'/api/user/login',
    imgUrls:getApp().globalData.imgUrls
  },
  //获取输入框的value
  bindInputUser: function (event){
    var that = this;
    if (event.detail.value != ''){
      that.setData({
        clearUser: 'block'
      });
    }
    that.setData({
      inputUserTxt: event.detail.value
    });
  },
  //输入框获取焦点
  bindFocusUser: function (event){
    var that = this;
    if (event.detail.value != ''){
      that.setData({
        clearUser: 'block'
      });
    }
  },
  //输入框失去焦点
  bindBlurUser: function (event){
    var that = this;
    that.setData({
      clearUser: 'none'
    });
  },
  
  //清空输入框内容
  clearUser: function (){
    var that = this;
    that.setData({
      inputUserTxt: ''
    });
  },

  //获取密码框的value
  bindInputPassword: function (event) {
    var that = this;
    if (event.detail.value != '') {
      that.setData({
        clearPassword: 'block'
      });
    }
    that.setData({
      inputPasswordTxt: event.detail.value
    });
  },
  //密码框获取焦点
  bindFocusPassword: function (event) {
    var that = this;
    if (event.detail.value != '') {
      that.setData({
        clearPassword: 'block'
      });
    }
  },
  //密码框失去焦点
  bindBlurPassword: function (event) {
    var that = this;
    that.setData({
      clearPassword: 'none'
    });
  },

  //清空密码框内容
  clearPassword: function () {
    var that = this;
    that.setData({
      inputPasswordTxt: ''
    });
  },
  //弹窗方法
  showToast: function (text) { //方法
    var that = this
    that.setData({
      isShow: true,
      text: text
    })
    setTimeout(function () {
      that.setData({
        isShow: false
      })
    }, 1500)
  },
  //判断是否是手机号码
  isPhone: function (phone) {
    var that = this;
    if (phone.length == 0) {
      that.showToast('手机号不能为空');
      return false;
    }
    if (phone.length != 11) {
      that.showToast('手机长度不正确');
      return false;
    }
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (!myreg.test(phone)) {
      that.showToast('手机格式不正确');
      return false;
    }
    return true;
  },
  //判断密码
  isPassword:function(password){
    var that = this;
    if(password.length == 0){
      that.showToast('密码不能为空');
      return false;
    }
    if (password.length < 6) {
      that.showToast('密码少于6位');
      return false;
    }
    if (password.length > 20) {
      that.showToast('密码大于20位');
      return false;
    }
    return true;
  },
  //按钮登录
  btnLogin:function(){
    var that = this;
    that.isPhone(that.data.inputUserTxt);
    that.isPassword(that.data.inputPasswordTxt);
    wx.request({
      url: getApp().globalData.url + that.data.loginAPI,
      data: {
        account: that.data.inputUserTxt,
        password: md5.hexMD5(that.data.inputPasswordTxt)
      },
      header: { 'content-type': 'application/json' },
      method: 'POST',
      dataType: 'json',
      success: function(res) {
        if (res.data.state == 1) {
          //缓存token
          wx.setStorage({
            key: "loginToken",
            data: res.data.data.login_token,
            success: function (res) {
              var pages = getCurrentPages();
              var currPage = pages[pages.length-2];
              currPage.login_request();
            } 
          })
          //缓存用户id
          wx.setStorageSync('userID', that.data.inputUserTxt);
          wx.switchTab({
            url: '../../home/home',
          })
        }        
        if(res.data.state == 0){
          that.showToast('手机或密码不正确');
        }
        getApp().globalData.userLogin = true;
      },
      fail: function(res) {},
      complete: function(res) {
      },
    })
    
  },
  //新用户注册
  newUser:function(){
    wx.navigateTo({
      url: './newUser/newUser',
    })
  },
  //忘记密码
  passwordForget:function(){
    wx.navigateTo({
      url: './passwordForget/passwordForget',
    })
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          loginHeight:res.windowHeight
        });
      }
    })
    //获取登录账号
    var userID = wx.getStorageSync('userID');
    if (userID != ''){
      this.setData({
        inputUserTxt:userID
      });
    }
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