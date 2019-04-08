// pages/mine/login/newUser/newUser.js
var md5 = require('../../../../utils/md5.js');
//倒计时
var countdown = 60;
var settime = function (that) {
  if (countdown == 0) {
    that.setData({
      is_show: true
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
  }
    , 1000)
};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    newUserHeight: '',
    isPhoneImg: 'none',
    phoneTxt: '',
    isCodeImg: 'none',
    codeTxt: '',
    codeAPI: '/api/user/sendsms',
    last_time: '',
    is_show: true,
    isPass1Img: 'none',
    pass1Txt: '',
    isPass2Img: 'none',
    pass2Txt: '',
    isShow: false,
    text: '',
    passRegistrationAPI: '/api/user/forget_password',
    imgUrls:getApp().globalData.imgUrls
  },
  //手机号的value
  phoneInput: function (event) {
    var that = this;
    if (event.detail.value != '') {
      that.setData({
        isPhoneImg: 'block'
      });
    }
    that.setData({
      phoneTxt: event.detail.value
    });
  },
  //手机号焦点
  phoneFocus: function (event) {
    var that = this;
    if (event.detail.value != '') {
      that.setData({
        isPhoneImg: 'block'
      });
    }
  },
  //手机号失去焦点
  phoneBlur: function (event) {
    var that = this;
    // console.log(event.detail.value);
    that.setData({
      isPhoneImg: 'none'
    });
  },
  // 手机号清空
  clearPhone: function () {
    var that = this;
    that.setData({
      phoneTxt: ''
    });
  },
  //验证码的value
  codeInput: function (event) {
    var that = this;
    if (event.detail.value != '') {
      that.setData({
        isCodeImg: 'block'
      });
    }
    that.setData({
      codeTxt: event.detail.value
    });
  },
  //验证码焦点
  codeFocus: function (event) {
    var that = this;
    if (event.detail.value != '') {
      that.setData({
        isCodeImg: 'block'
      });
    }
  },
  //验证码失去焦点
  codeBlur: function (event) {
    var that = this;
    that.setData({
      isCodeImg: 'none'
    });
  },
  // 获取手机验证码
  getCode: function () {
    var that = this;
    wx.request({
      url: getApp().globalData.url + that.data.codeAPI,
      data: {
        mobile: that.data.phoneTxt
      },
      header: { 'content-type': 'application/json' },
      method: 'POST',
      dataType: 'json',
      success: function (res) {
        console.log(res);
      },
      fail: function (res) { },
      complete: function (res) { },
    })
    // 将获取验证码按钮隐藏60s，60s后再次显示
    that.setData({
      is_show: (!that.data.is_show)   //false
    })
    settime(that);
  },
  // 验证码清空
  clearCode: function () {
    var that = this;
    that.setData({
      codeTxt: ''
    });
  },
  //密码1的value
  pass1Input: function (event) {
    var that = this;
    if (event.detail.value != '') {
      that.setData({
        isPass1Img: 'block'
      });
    }
    that.setData({
      pass1Txt: event.detail.value
    });
  },
  //密码1焦点
  pass1Focus: function (event) {
    var that = this;
    if (event.detail.value != '') {
      that.setData({
        isPass1Img: 'block'
      });
    }
  },
  //密码1失去焦点
  pass1Blur: function (event) {
    var that = this;
    // console.log(event.detail.value);
    that.setData({
      isPass1Img: 'none'
    });
  },
  // 密码1清空
  clearPass1: function () {
    var that = this;
    that.setData({
      pass1Txt: ''
    });
  },
  //密码2的value
  pass2Input: function (event) {
    var that = this;
    if (event.detail.value != '') {
      that.setData({
        isPass2Img: 'block'
      });
    }
    that.setData({
      pass2Txt: event.detail.value
    });
  },
  //密码2焦点
  pass2Focus: function (event) {
    var that = this;
    if (event.detail.value != '') {
      that.setData({
        isPass2Img: 'block'
      });
    }
  },
  //密码2失去焦点
  pass2Blur: function (event) {
    var that = this;
    // console.log(event.detail.value);
    that.setData({
      isPass2Img: 'none'
    });
  },
  // 密码2清空
  clearPass2: function () {
    var that = this;
    that.setData({
      pass2Txt: ''
    });
  },
  //注册用户
  userRegistration: function () {
    var that = this;
    that.isPhone(that.data.phoneTxt);
    that.isCode(that.data.codeTxt);
    that.isPassword(that.data.pass1Txt);
    that.isPassword(that.data.pass2Txt);
    if (that.data.pass1Txt != that.data.pass2Txt) {
      that.showToast('密码不一致');
      return false;
    } 
    wx.request({
      url: getApp().globalData.url + that.data.passRegistrationAPI,
      data: {
        mobile: that.data.phoneTxt,
        code: that.data.codeTxt,
        new_password: md5.hexMD5(that.data.pass1Txt)
      },
      header: { 'content-type': 'application/json' },
      method: 'POST',
      dataType: 'json',
      success: function (res) {
        if (res.data.state == 1){
          wx.redirectTo({
            url: '../../login/login',
          })
        }
        if (res.data.state == 0) {
          that.showToast('资料填写不正确');
        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })
    
   
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
  //判断验证码
  isCode: function (code) {
    var that = this;
    if (code.length == 0) {
      that.showToast('验证码不能为空');
      return false;
    }
    if (code.length < 6) {
      that.showToast('验证码小于6位');
      return false;
    }
    if (code.length > 6) {
      that.showToast('验证码大于6位');
      return false;
    }
    return true;
  },
  //判断密码
  isPassword: function (passwrod) {
    var that = this;
    if (passwrod.length == 0) {
      that.showToast('密码不能为空');
      return false;
    }
    if (passwrod.length < 6) {
      that.showToast('密码不能小于6位')
      return false;
    }
    if (passwrod.length > 20) {
      that.showToast('密码不能大于20位')
      return false;
    }
    return true;
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          newUserHeight: res.windowHeight
        });
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