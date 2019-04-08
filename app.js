//app.js
require('./utils/strophe.js')
var WebIM = require('./utils/WebIM.js').default;
App({
  onLaunch: function (options) {
    var that = this;
    console.log('全局加载:',options);
    let q = decodeURIComponent(options.query.q);
    // 环信登录
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);
    that.wxGetSetting();
  },
  // 微信登录
  wxGetSetting: function () {
    var that = this;
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {
          that.wxLogin();
          that.globalData.userLogin = true;
        } else {
          // that.wxLogin();
        }
      }
    })
  },
  // 获取code
  wxLogin: function () {
    var that = this;
    wx.login({
      success: function (res) {
        var code = res.code;
        that.globalData.code = res.code;
        // console.log('code:',code);
        if (code) {
          that.wxGetUserInfo(code);
        }
      },
      fail: function (res) { },
      complete: function (res) {
      },
    })
  },
  // 获取用户信息
  wxGetUserInfo: function (code) {
    var that = this;
    wx.getUserInfo({
      withCredentials: true,
      lang: 'zh_CN',
      success: function (res) {
        var nickName = res.userInfo.nickName;
        var face = res.userInfo.avatarUrl;
        var encryptedData = res.encryptedData;
        var iv = res.iv;
        that.getOpenID(code, nickName, face, encryptedData, iv);
      },
      fail: function (res) { },
      complete: function (res) {},
    })
  },
  // 获取openID
  getOpenID: function (code, nickName, face, encryptedData, iv) {
    var that = this;
    wx.request({
      url: that.globalData.url + '/api/user/get_wx_info',
      data: {
        code: code
      },
      header: { 'content-type': 'application/json' },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        console.log('获取openID', res);
        var sessionKey = res.data.data.session_key;
        if (sessionKey) {
          that.getUnionid(nickName, face, sessionKey, encryptedData, iv)
        } else {
          var openID = res.data.data.open_id;
          var unionID = res.data.data.union_id;
          that.userLogin(openID, unionID, nickName, face);
          wx.setStorageSync('openID', openID)
          wx.setStorageSync('unionID', unionID)
          wx.setStorageSync('nickName', nickName)
          wx.setStorageSync('face', face)
          
        }
      },
      fail: function (res) { },
      complete: function (res) {
      },
    })
  },
  // 获取unionid
  getUnionid: function (nickName, face, sessionKey, encryptedData, iv) {
    var that = this;
    wx.request({
      url: that.globalData.url + '/api/user/get_unionid',
      data: {
        session_key: sessionKey,
        encryptedData: encryptedData,
        iv: iv
      },
      header: { 'content-type': 'application/json' },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        console.log('获取getUnionid', res);
        var openID = res.data.openId;
        var unionID = res.data.unionId;
        that.userLogin(openID, unionID, nickName, face)
        wx.setStorageSync('openID', openID)
        wx.setStorageSync('unionID', unionID)
        wx.setStorageSync('nickName', nickName)
        wx.setStorageSync('face', face)
      },
      fail: function (res) { },
      complete: function (res) {
      },
    })
  },
  //登录
  userLogin: function (openID, unionID, nickName, face) {
    var that = this;
    var model, system, version;
    wx.getSystemInfo({
      success: function (res) {
        model = res.model;
        system = res.system;
        version = res.version;
      },
    });
    wx.request({
      url: that.globalData.url + '/api/user/wx_login_noopsychepay',
      data: {
        open_id: openID,
        union_id: unionID,
        nickname: nickName,
        face: face,
        app_type: 'weixin',
        phone_type: model + '/' + system,
        version: version,
        registration_id: '123456'
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        console.log('userLogin:', res);
        if (res.data.state == 0) {
          // wx.navigateTo({
          //   url: '../bindPhone/bindPhone?openID=' + openID + "&unionID=" + unionID + "&nickName=" + nickName + "&face=" + face,
          // })
          if (res.data.msg == "请先绑定手机") {
            wx.navigateTo({
              url: '../../bindPhone/bindPhone',
            })
          }
        } else {
          wx.setStorageSync('loginToken', res.data.data.login_token);
          // console.log("token", res.data.data.login_token )
          that.globalData.userLogin = true;
          wx.setStorageSync('hx_username', res.data.data.hx_username);
          wx.setStorageSync('hx_password', res.data.data.hx_password);
        }
      },
      fail: function (res) { },
      complete: function (res) {
      },
    })
  },
  globalData: {
    userInfo: null,
    imgUrls: 'http://www.wbx365.com/static/default/wap/image/xiaochengxu/',
    code: '',
    userLogin: wx.getStorageSync('userLogin'),
    nickName: '',
    face: '',
    encryptedData: '',
    iv: '',
    openID: '',
    unionID: '',
    foundShopID:'',
    url: 'https://app.vrzff.com',
    // url: 'https://app.wbx365.com',
  }
})