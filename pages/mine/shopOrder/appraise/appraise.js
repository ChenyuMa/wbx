// pages/mine/shopOrder/appraise/appraise.js
const qiniuUploader = require("../../../../utils/qiniuUploader.js");
var uptoken;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 屏幕高度
    windowHeight: '',
    star: [0, 1, 2, 3, 4],
    select_stat: '',
    textArea: '',
    order_id: '',
    type: '',
    imgUrls: [],
    imageURL: [],
    uptoken: '',
    is_oreder_detial_appraise:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("opt",options)
    var that = this;
    // 获取屏幕高度
    this.setData({
      windowHeight: wx.getSystemInfoSync().windowHeight
    });
    this.setData({ order_id: options.order_id, type: options.type, is_oreder_detial_appraise: options.appraise });
  },

  // 点击星星评价
  click_star: function (e) {
    this.setData({
      select_stat: e.currentTarget.dataset.id + 1
    });
  },
  // 输入评价
  input_appraise: function (e) {
    this.setData({
      textArea: e.detail.value
    });
  },
  // 点击拍照
  click_photo: function () {
    var that = this;
    var imgUrls = this.data.imgUrls;
    that.getToken();
    wx.chooseImage({
      count: 4,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        that.setData({ imgUrls: res.tempFilePaths });
        var filePath = res.tempFilePaths;
        for (var i = 0; i < filePath.length; i++) {
          var key = Math.random().toString(36).substr(2);
          // 交给七牛上传
          qiniuUploader.upload(filePath[i], (res) => {
            var imageURL = that.data.imageURL;
            imageURL.push('http://imgs.wbx365.com/' + res.key);
            that.setData({
              'imageURL': imageURL
            });
          }, (error) => {
            // console.log('error: ' + error);
          }, {
              region: 'ECN',
              domain: 'bzkdlkaf.bkt.clouddn.com',
              key: key,
              uptoken: uptoken,
              uploadURL: 'https://upload.qiniup.com'
            }, (res) => {
              // console.log('上传进度', res.progress)
              // console.log('已经上传的数据长度', res.totalBytesSent)
              // console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
            });
        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  // 点击预览图片
  preview_img: function (e) {
    var that = this;
    var imgUrls = this.data.imgUrls;
    var index = e.currentTarget.dataset.index;
    wx.previewImage({
      current: imgUrls[index],
      urls: imgUrls,
    })
  },

  // 提交评论
  click_review: function () {
    var that = this;
    var filePath = this.data.imgUrls;
    wx.request({
      url: getApp().globalData.url + '/api/userorder/add_assess',
      data: {
        login_token: wx.getStorageSync('loginToken'),
        grade: that.data.select_stat,
        order_id: that.data.order_id,
        type: that.data.type,
        message: that.data.textArea,
        pics: JSON.stringify(that.data.imageURL)
      },
      header: { 'content-type': 'application/json' },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        console.log("评价",res)
        if (res.data.state == 0) {
          wx.showToast({
            title: res.data.msg,
          })

          console.log("is_oreder_detial_appraise", that.data.is_oreder_detial_appraise)

          if (that.data.is_oreder_detial_appraise==1){
            setTimeout(function () {
              wx.navigateBack({
                delta: 1
              })
              var pages = getCurrentPages();
              var prePage = pages[pages.length - 3];
              prePage.refresh();
            }, 3000);
          }else{
            setTimeout(function () {
              wx.navigateBack({
                delta: 1
              })
              var pages = getCurrentPages();
              var prePage = pages[pages.length - 2];
              prePage.refresh();
            }, 3000);
          }

          

        } else {
          wx.showToast({
            title: res.data.msg,
          })
          if (that.data.is_oreder_detial_appraise == 1) {
            setTimeout(function () {
              wx.navigateBack({
                delta: 1
              })
              var pages = getCurrentPages();
              var prePage = pages[pages.length - 3];
              prePage.refresh();
            }, 3000);
          } else {
            setTimeout(function () {
              wx.navigateBack({
                delta: 1
              })
              var pages = getCurrentPages();
              var prePage = pages[pages.length - 2];
              prePage.refresh();
            }, 3000);
          }
        }
      },
      fail: function (res) { },
      complete: function (res) {
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

  },
  // 获取token
  getToken: function () {
    wx.request({
      url: 'https://app.wbx365.com/api/user/qiniu_token',
      data: '',
      header: {},
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        uptoken = res.data.data.uptoken;
        console.log(uptoken);
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  }
})