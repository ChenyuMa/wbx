// pages/mine/integral/integral.js
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
    // 屏幕高度
    windowHeight:'',
    // 图片地址
    imageUrl:'http://www.wbx365.com/static/default/wap/image/xiaochengxu/',
    integralDetailList:[],
    // 签到获得的积分
    integral:'',
    // 是否签到
    isSignIn:false,
    is_SignIn:false,
    mineIntegral:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // 获取屏幕高度
    var windowHeight= wx.getSystemInfoSync().windowHeight;
    this.setData({
      windowHeight:windowHeight
    });

    this.setData({ mineIntegral: options.mineIntegral});

    // wx.request({
    //   url: getApp().globalData.url + '/api/user/sign_in',
    //   data: {
    //     login_token: wx.getStorageSync('loginToken')
    //   },
    //   header: { 'content-type': 'application/json' },
    //   method: 'POST',
    //   dataType: 'json',
    //   responseType: 'text',
    //   success: function (res) {
    //     console.log('查看是否签到:',res);
    //     if (res.data.state == 0) {
    //       that.setData({
    //         // isSignIn: true,
    //         is_SignIn: true,
    //         // integral: res.data.msg,
    //         mineIntegral: options.mineIntegral
    //       });
    //     }
    //   },
    //   fail: function (res) { },
    //   complete: function (res) {
    //   },
    // })

    // 请求积分明细
    wx.request({
      url: getApp().globalData.url +'/api/user/list_integral_logs',
      data: {
        login_token: wx.getStorageSync('loginToken'),
        page:1,
        num:5
      },
      header: { 'content-type': 'application/json'},
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        let integralDetailList = res.data.data;
        for(var i = 0; i<integralDetailList.length;i++){
          let time = integralDetailList[i].create_time;
          integralDetailList[i].create_time = timestampToTime(time);
        }
        that.setData({
          integralDetailList: integralDetailList
        });
      },
      fail: function(res) {},
      complete: function(res) {},
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

  // 点击签到按钮
  clickSignIn:function(){
    var that = this;
    wx.request({
      url: getApp().globalData.url +'/api/user/sign_in',
      data: {
        login_token: wx.getStorageSync('loginToken')
      },
      header: {'content-type': 'application/json'},
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        console.log('点击签到:',res);
        if(res.data.state == 0){
          wx.showToast({
            title: res.data.msg,
          })
        }else{
          that.setData({
            isSignIn: true,
            is_SignIn: true,
            integral:res.data.msg
          });
        }
        
      },
      fail: function(res) {},
      complete: function(res) {
        setTimeout(function(){
          that.setData({ isSignIn:false});
        },3000);
      },
    })
  }
})