// pages/mine/account/account.js
const qiniuUploader = require("../../../utils/qiniuUploader.js");
var uptoken ;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight: '',
    imgUrls: getApp().globalData.imgUrls,
    url: getApp().globalData.url,
    isUpIcon: false,
    user_list: [],
    // 修改名字
    isSetName: false,
    inputName: '',
    uptoken: '',
    imageURL:''
  },

  // 上传头像
  upIcon: function () {
    this.setData({
      isUpIcon: true
    });
  },
  // 相机
  camera: function () {
    var that = this;
    var key = Math.random().toString(36).substr(2);
    that.getToken();
    wx.chooseImage({
      count: 1,
      sizeType: ['original','compressed'],
      sourceType: ['camera', 'album'],
      success: function(res) {
        var filePath = res.tempFilePaths[0];
        // 交给七牛上传
        qiniuUploader.upload(filePath, (res) => {
          that.setData({
            'imageURL': res.imageURL,
          });

          wx.request({
            url: getApp().globalData.url + '/api/user/update_face',
            data: {
              login_token: wx.getStorageSync('loginToken'),
              face: 'http://imgs.wbx365.com/' + res.key
            },
            header: {},
            method: 'POST',
            dataType: 'json',
            responseType: 'text',
            success: function (res) {
              if (res.data.state == 0) {
                wx.showToast({
                  title: res.data.msg,
                })
              } else {
                wx.showToast({
                  title: res.data.msg,
                })
                that.cancelUpIcon();
                wx.request({
                  url: getApp().globalData.url + '/api/user/get_user_info',
                  data: { login_token: wx.getStorageSync('loginToken') },
                  header: {},
                  method: 'POST',
                  dataType: 'json',
                  responseType: 'text',
                  success: function (res) {
                    that.setData({ user_list: res.data.data });
                    var pages = getCurrentPages();
                    var currPage = pages[pages.length - 2];
                    currPage.login_request();
                  },
                  fail: function (res) { },
                  complete: function (res) { },
                })
              }
            },
            fail: function (res) { },
            complete: function (res) { },
          })
        }, (error) => {
          // console.log('error: ' + error);
        }, {
            region: 'ECN',
            domain: 'bzkdlkaf.bkt.clouddn.com',
            key: key,
            uptoken: uptoken,
            uploadURL: 'https://upload.qiniup.com'
          }, (res) => {
            
          });
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  // 相册
  photo: function () {
    var that = this;
    var key = Math.random().toString(36).substr(2);
    that.getToken();
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album'],
      success: function (res) {
        var filePath = res.tempFilePaths[0];
        // 交给七牛上传
        qiniuUploader.upload(filePath, (res) => {
          that.setData({
            'imageURL': res.imageURL,
          });
          wx.request({
            url: getApp().globalData.url +'/api/user/update_face',
            data: {
              login_token:wx.getStorageSync('loginToken'),
              face:'http://imgs.wbx365.com/'+ res.key
            },
            header: {},
            method: 'POST',
            dataType: 'json',
            responseType: 'text',
            success: function(res) {
              if (res.data.state == 0){
                wx.showToast({
                  title: res.data.msg,
                })
              }else{
                wx.showToast({
                  title: res.data.msg,
                })
                that.cancelUpIcon();
                wx.request({
                  url: getApp().globalData.url +'/api/user/get_user_info',
                  data: { login_token:wx.getStorageSync('loginToken')},
                  header: {},
                  method: 'POST',
                  dataType: 'json',
                  responseType: 'text',
                  success: function(res) {
                    that.setData({ user_list:res.data.data});
                    var pages = getCurrentPages();
                    var currPage = pages[pages.length-2];
                    currPage.login_request();
                  },
                  fail: function(res) {},
                  complete: function(res) {},
                })
              }
            },
            fail: function(res) {},
            complete: function(res) {},
          })
        }, (error) => {
          // console.log('error: ' + error);
        }, {
            region: 'ECN',
            domain: 'bzkdlkaf.bkt.clouddn.com',
            key: key,
            uptoken: uptoken,
            uploadURL: 'https://upload.qiniup.com'
          }, (res) => {
            
          });

      },
      fail: function (res) { },
      complete: function (res) { },
    });
  },
  // 取消
  cancelUpIcon: function () {
    this.setData({
      isUpIcon: false
    });
  },
  // 微米充值
  recharge: function () {
    wx.navigateTo({
      url: '../micron/recharge/recharge',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //获取高度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight
        });
      },
    })
    this.setData({
      user_list: JSON.parse(options.user_list)
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

  },

  //修改用户昵称
  userName: function () {
    var that = this;
    this.setData({ isSetName: !that.data.isSetName });
  },

  // 输入昵称
  inputName: function (e) {
    this.setData({ inputName: e.detail.value });
  },

  // 保存昵称
  saveName: function () {
    var that = this;
    wx.request({
      url: getApp().globalData.url + '/api/user/update_nickname',
      data: {
        login_token: wx.getStorageSync('loginToken'),
        nickname: that.data.inputName
      },
      header: { 'content-type': 'application/json' },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        that.userName();
        wx.navigateBack({
          delta: 1,
        })
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];
        prevPage.login_request();
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  // 收货地址
  goodsAddress: function () {
    wx.navigateTo({
      url: '../address/address',
    })
  },

  // 修改支付密码
  setBalance: function () {
    wx.navigateTo({
      url: '../setBalanceCode/setBalanceCode',
    })
  },

  //微米明细 
  micronDetail: function () {
    wx.navigateTo({
      url: '../micronDetail/micronDetail',
    })
  },

  // 获取token
  getToken:function(){
    wx.request({
      url: 'https://app.wbx365.com/api/user/qiniu_token',
      data: '',
      header: {},
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        uptoken = res.data.data.uptoken;
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  }

})