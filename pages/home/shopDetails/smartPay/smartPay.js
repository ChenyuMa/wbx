// pages/home/shopDetails/smartPay/smartPay.js
var md5 = require('../../../../utils/md5.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight: '',
    money: '',
    imgUrls: getApp().globalData.imgUrls,
    isBalance: false,
    isWeChat: false,
    inputCode: '',
    isPayCode: false,
    payCode: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // 获取高度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({ windowHeight: res.windowHeight });
      },
    })
    this.setData({ shopID:options.shopID});
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

  // 输入金额
  inputMoney: function (e) {
    var that = this;
    this.setData({
      money: e.detail.value
    });
  },

  // 余额支付
  radioBalance: function (e) {
    this.setData({
      isBalance: true,
      isWeChat: false,
      payCode: e.currentTarget.dataset.value
    });
  },

  // 微信支付
  radioWeChat: function (e) {
    this.setData({
      isBalance: false,
      isWeChat: true,
      payCode: e.currentTarget.dataset.value
    });
  },

  // 确认结算
  confirmPay: function () {
    var that = this;
    if (this.data.payCode == '') {
      wx.showModal({
        title: '提示',
        content: '请选择支付方式',
      })
      return false
    }
    if (this.data.payCode == 'money') {
      this.setData({
        isPayCode: true,
        inputCode: ''
      });
    } else {
      wx.login({
        success: function(res) {
          wx.request({
            url: getApp().globalData.url + '/api/noopsychepay/wechat_pay',
            data: {
              login_token: wx.getStorageSync('loginToken'),
              shop_id: that.data.shopID,
              money: that.data.money,
              code: that.data.payCode,
              code_openid:res.code
            },
            header: { 'content-type': 'application/json' },
            method: 'POST',
            dataType: 'json',
            responseType: 'text',
            success: function (res) {
              console.log('wx',res);
              if(res.data.state == 0){
                wx.showToast({
                  title: res.data.msg,
                })
              }else{
                wx.requestPayment({
                  timeStamp: res.data.timeStamp,
                  nonceStr: res.data.nonceStr,
                  package: res.data.package,
                  signType: res.data.signType,
                  paySign: res.data.paySign,
                  success: function (res) {
                    wx.showToast({
                      title: '支付完成',
                    })
                    setTimeout(function(){
                      wx.navigateBack({
                        delta: 1
                      })
                    },2000);
                  }
                })
              }
              
            },
            fail: function (res) { },
            complete: function (res) { },
          })
        },
        fail: function(res) {},
        complete: function(res) {},
      })
      
    }
  },

  // 密码失去焦点
  inputCodeBlur: function (e) {
    this.setData({
      inputCode: e.detail.value
    });
  },
  // 取消支付弹窗
  cancelPay: function () {
    this.setData({
      isPayCode: false
    });
  },
  // 确定余额支付
  determinePay: function (e) {
    var that = this;
    var password = md5.hexMD5(e.currentTarget.dataset.code);
    var passWords = md5.hexMD5(password);
    if (that.data.money == ''){
      wx.showToast({
        title: '请输入金额',
      })
      return false;
    } else if (wx.getStorageSync('loginToken') == ''){
      wx.showToast({
        title: '请登录',
      })
      return false;
    }
    wx.request({
      url: getApp().globalData.url + '/api/noopsychepay/pay',
      data: {
        login_token: wx.getStorageSync('loginToken'),
        shop_id: that.data.shopID,
        code: that.data.payCode,
        money: that.data.money,
        pay_password: passWords
      },
      header: { 'content-type': 'application/json' },
      method: 'POST',
      dataType: 'json',
      success: function (res) {
        console.log('付款',res);
        if(res.data.state == 0){
          if (res.data.msg == "支付密码不正确"){
            wx.showModal({
              title: res.data.msg,
              content: '新用户请设置支付密码',
              success: function (res) {
                if (res.confirm) {
                  wx.navigateTo({
                    url: '../../../mine/setBalanceCode/setBalanceCode',
                  })
                } else {}
              },
              fail: function (res) { },
              complete: function (res) { },
            })
          } else if (res.data.msg == "请先设置支付密码"){
            
            wx.navigateTo({
              url: '../../../mine/setBalanceCode/setBalanceCode',
            })
          }else{
            wx.showModal({
              title: '提示',
              content: res.data.msg,
            });
          }
        }else{
          that.setData({ isPayCode:false});
          wx.showToast({
            title: '支付完成',
          });
          setTimeout(function(){
            wx.navigateBack({
              delta: 1
            })
          },2000);
        }
      },
      fail: function (res) {
      },
      complete: function (res) {
      },
    })
  },
})