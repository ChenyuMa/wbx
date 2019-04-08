// pages/home/shopDetails/confirmOrder/confirmClearing/confirmClearing.js
var md5 = require('../../../../utils/md5.js');
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
    windowHeight: '',
    imgUrls: getApp().globalData.imgUrls,
    orderID: '',
    gradeid: '',
    shopCart: [],
    orderList: [],
    logistics: '',
    isToast: false,
    inputTxt: '',
    isBalance: false,
    isWeChat: false,
    payCode: '',
    addrID: '',
    shopToPayAPI: '/api/buygreens/pay',
    mallToPayAPI: '/api/mall/pay',
    isPayCode: false,
    inputCode: '',
    wxShopPayAPI: '/api/buygreens/wechat_pay',
    wxMallPayAPI: '/api/mall/wechat_pay',
    focus: true,
    name: '',
    tel: '',
    info: '',
    // 红包显示
    is_redPacket: false,
    redPacket_money: 0,
    // 图层显示
    is_shadow: true,
    code: ''
  },
  // 余额支付
  radioBalance: function (e) {
    this.setData({
      isBalance: true,
      isWeChat: false,
      // payCode: e.currentTarget.dataset.value
      payCode: 'money'
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
        success: function (res) {
          wx.request({
            url: getApp().globalData.url + '/api/subscribe/wechat_pay',
            data: {
              login_token: wx.getStorageSync('loginToken'),
              reserve_table_id: that.data.orderList.info.reserve_table_id,
              // order_id: that.data.orderList.info.order_id,
              code: that.data.payCode,
              // addr_id: that.data.addrID,
              code_openid: res.code
            },
            header: { 'content-type': 'application/json' },
            method: 'POST',
            dataType: 'json',
            responseType: 'text',
            success: function (res) {
              console.log(res);
              wx.requestPayment({
                timeStamp: res.data.timeStamp,
                nonceStr: res.data.nonceStr,
                package: res.data.package,
                signType: res.data.signType,
                paySign: res.data.paySign,
                success: function (res) {
                  console.log('res:',res)
                  that.redPacketAPI(that.data.orderID, 2);
                }
              })
            },
            fail: function (res) { },
            complete: function (res) { },
          })

        },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //获取屏幕高度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight
        });
      },
    });

    var orderList = JSON.parse(options.orderList);
    orderList.info.reserve_time = timestampToTime(orderList.info.reserve_time);
    this.setData({
      orderList: orderList
    });
    console.log('orderList:',orderList);

    // this.setData({
    //   orderID: options.orderID,
    //   gradeid: options.gradeid,
    //   shopCart: JSON.parse(options.shopCart),
    //   logistics: options.logistics,
    //   orderList: JSON.parse(options.orderList),
    //   addrID: options.addrID,
    // });

    // this.setData({
    //   name: this.data.orderList.info.name,
    //   tel: this.data.orderList.info.mobile,
    //   info: this.data.orderList.address.area_str + this.data.orderList.address.info
    // });

  },

  // 地址选择
  address_select: function () {
    wx.navigateTo({
      url: './address/address',
    })
  },
  // 弹出备注
  temarkToast: function () {
    this.setData({
      isToast: true
    });
  },
  // 输入框失去焦点
  inputBlur: function (e) {
    this.setData({
      inputTxt: e.detail.value
    });
  },
  // 取消弹窗
  cancel: function () {
    this.setData({
      isToast: false,
      inputTxt: ''
    });
  },
  // 确定备注
  determine: function () {
    var that = this;
    this.setData({
      isToast: false
    });
    if (this.data.gradeid == 15) {
      wx.request({
        url: getApp().globalData.url + '/api/buygreens/message',
        data: {
          login_token: wx.getStorageSync('loginToken'),
          order_id: that.data.orderID,
          message: that.data.inputTxt
        },
        header: { 'content-type': 'application/json' },
        method: 'POST',
        dataType: 'json',
        responseType: 'text',
        success: function (res) {

        },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else {
      wx.request({
        url: getApp().globalData.url + '/api/mall/message',
        data: {
          login_token: wx.getStorageSync('loginToken'),
          order_id: that.data.orderID,
          message: that.data.inputTxt
        },
        header: { 'content-type': 'application/json' },
        method: 'POST',
        dataType: 'json',
        responseType: 'text',
        success: function (res) {
        },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
  },
  // 密码失去焦点
  inputCodeBlur: function (e) {
    // var password = md5.hexMD5(e.detail.value);
    // var passWords = md5.hexMD5(password);
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
    var password = md5.hexMD5(e.currentTarget.dataset.code);
    var passWords = md5.hexMD5(password);
    var that = this;
    if (this.data.inputCode != '' || this.data.orderID != '' || this.data.payCode != '' || this.data.addrID != '') {
      this.setData({
        isPayCode: false,
      });
    } else {
      return false;
    }

    wx.request({
      url: getApp().globalData.url + '/api/subscribe/pay',
      data: {
        login_token: wx.getStorageSync('loginToken'),
        // order_id: that.data.orderList.info.order_id,
        reserve_table_id: that.data.orderList.info.reserve_table_id,
        code: that.data.payCode,
        // addr_id: that.data.addrID,
        pay_password: passWords
      },
      header: { 'content-type': 'application/json' },
      method: 'POST',
      dataType: 'json',
      success: function (res) {
        console.log('res',res);
        if (res.data.state == 1) {
          that.redPacketAPI(that.data.orderID, 2);
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
          })
        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  // 红包奖励接口
  redPacketAPI: function (orderID, orderType) {
    var that = this;
    wx.request({
      url: getApp().globalData.url + '/api/subsidyincentive/get_subsidy_money',
      data: {
        login_token: wx.getStorageSync('loginToken'),
        order_id: orderID,
        order_type: orderType
      },
      header: { 'content-type': 'application/json' },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        if (res.data.state == 0) {
          wx.showToast({
            title: '支付完成',
            success: function (res) {
              setTimeout(function () {
                wx.navigateBack({
                  delta: 3
                })
              }, 1500);
            }
          })
        } else {
          that.setData({
            is_redPacket: true,
            redPacket_money: res.data.data.money
          });
        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  // 点击隐藏关闭红包
  click_redPacket: function () {
    this.setData({
      is_redPacket: false
    });
    wx.navigateBack({
      delta: 3
    })
  },
  // 点击刮开图层
  click_shadow: function () {
    var that = this;
    this.setData({
      is_shadow: false
    });
    if (that.data.gradeid == 15) {
      wx.request({
        url: getApp().globalData.url + '/api/subsidyincentive/set_subsidy_money',
        data: {
          login_token: wx.getStorageSync('loginToken'),
          order_id: that.data.orderID,
          order_type: 1,
          money: that.data.money / 100.00
        },
        header: { 'content-type': 'application/json' },
        method: 'POAT',
        dataType: 'json',
        responseType: 'text',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else {
      wx.request({
        url: getApp().globalData.url + '/api/subsidyincentive/set_subsidy_money',
        data: {
          login_token: wx.getStorageSync('loginToken'),
          order_id: that.data.orderID,
          order_type: 2,
          money: that.data.money / 100.00
        },
        header: { 'content-type': 'application/json' },
        method: 'POAT',
        dataType: 'json',
        responseType: 'text',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
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