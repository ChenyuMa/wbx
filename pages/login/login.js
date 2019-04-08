
var md5 = require('../../utils/md5.js');
var that = this;
//倒计时
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
    loginAPI:'/api/user/sms_code_login',
    imgUrls:getApp().globalData.imgUrls,
    codeAPI: '/api/user/sendsms',
    mobile:'',
    is_show:true,
    last_time:60
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
    wx.request({
      url: getApp().globalData.url + that.data.loginAPI,
      data: {
        account: that.data.inputUserTxt,
        code: that.data.inputPasswordTxt,
        app_type:'small_routine',
        version:'',
        registration_id:'',
        phone_type:''
      },
      header: { 'content-type': 'application/json' },
      method: 'POST',
      dataType: 'json',
      success: function(res) {
        if (res.data.state == 1) {
          console.log('登录成功');
          wx.setStorageSync('loginToken', res.data.data.login_token);
          //缓存用户id
          wx.setStorageSync('userID', that.data.inputUserTxt);
          getApp().globalData.userLogin = true;
          wx.setStorageSync('hx_username', res.data.data.hx_username);
          wx.setStorageSync('hx_password', res.data.data.hx_password);
          //缓存用户id
          wx.setStorageSync('userID', that.data.inputUserTxt);
          wx.navigateBack({
            delta: 1
          })
        }else{
          wx.showToast({
            title: res.data.msg,
          })
        }     
        
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
  
  },

  // 获取手机验证码
  getCode: function () {
    var that = this;
    wx.request({
      url: getApp().globalData.url + that.data.codeAPI,
      data: {
        mobile: that.data.inputUserTxt
      },
      header: { 'content-type': 'application/json' },
      method: 'POST',
      dataType: 'json',
      success: function (res) {
        
      },
      fail: function (res) { },
      complete: function (res) { },
    })
    // 将获取验证码按钮隐藏60s，60s后再次显示
    that.setData({
      is_show: (!that.data.is_show)   //false
    })
    if (countdown == 60){
      settime(that);
    } 
  },

  // 点击微信登录
  clickWxLogin:function(e){
    var that = this;
    if (e.detail.errMsg == "getUserInfo:ok") {
      var nickName = e.detail.userInfo.nickName;
      var face = e.detail.userInfo.avatarUrl;
      var encryptedData = e.detail.encryptedData;
      var iv = e.detail.iv;
      that.wxLogin(nickName, face);
    }
  },

  // 获取code
  wxLogin: function (nickName, face) {
    var that = this;
    wx.login({
      success: function (res) {
        getApp().globalData.code = res.code;
        var code = res.code;
        if (code){
          that.getOpenID(code, nickName, face)
        }
      },
      fail: function (res) { },
      complete: function (res) {
      },
    })
  },

  // 获取openID
  getOpenID: function (code, nickName, face) {
    var that = this;
    wx.request({
      url: getApp().globalData.url + '/api/user/get_wx_info',
      data: {
        code: code
      },
      header: { 'content-type': 'application/json' },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        var openID = res.data.data.open_id;
        var unionID = res.data.data.union_id;
        that.userLogin(openID, unionID, nickName, face)
      },
      fail: function (res) { },
      complete: function (res) {
      },
    })
  },

  //登录
  userLogin: function (openID, unionID, nickName, face) {
    var that = this;
    wx.request({
      url: getApp().globalData.url + '/api/user/wx_login',
      data: {
        open_id: openID,
        union_id: unionID,
        nickname: nickName,
        face: face,
        app_type: 'wx',
        version: '2.0',
        registration_id: '123456'
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        console.log(res);
        if (res.data.state == 0) {
          wx.navigateTo({
            url: '../bindPhone/bindPhone?openID=' + openID + "&unionID=" + unionID + "&nickName=" + nickName + "&face=" + face,
          })
        } else {
          console.log('登录成功');
          wx.setStorageSync('loginToken', res.data.data.login_token);
          //缓存用户id
          wx.setStorageSync('userID', that.data.inputUserTxt);
          getApp().globalData.userLogin = true;
          wx.setStorageSync('hx_username', res.data.data.hx_username);
          wx.setStorageSync('hx_password', res.data.data.hx_password);
          wx.navigateBack({
            delta: 1
          })
        }
      },
      fail: function (res) { },
      complete: function (res) {

      },
    })
  },

  // 查看用户协议
  cliceUserTCP:function(){
    wx.navigateTo({
      url: './userTCP/userTCP',
    })
  }

})