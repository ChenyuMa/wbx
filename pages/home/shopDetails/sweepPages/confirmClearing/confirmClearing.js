// pages/home/shopDetails/confirmOrder/confirmClearing/confirmClearing.js

var md5 = require('../../../../../utils/md5.js');
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
    code: '',
    sweepOrder: '',
    orderInfo: ''
  },
  // 余额支付
  radioBalance: function(e) {
    this.setData({
      isBalance: true,
      isWeChat: false,
      payCode: e.currentTarget.dataset.value
    });
  },
  // 微信支付
  radioWeChat: function(e) {
    this.setData({
      isBalance: false,
      isWeChat: true,
      payCode: e.currentTarget.dataset.value
    });
  },
  // 确认结算
  confirmPay: function() {
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
            url: getApp().globalData.url + '/api/mall/wechat_scan_pay',
            data: {
              login_token: wx.getStorageSync('loginToken'),
              order_id: that.data.orderList.order.scan_order_id,
              code: that.data.payCode,
              code_openid: res.code
            },
            header: {
              'content-type': 'application/json'
            },
            method: 'POST',
            dataType: 'json',
            responseType: 'text',
            success: function(res) {
              wx.requestPayment({
                timeStamp: res.data.timeStamp,
                nonceStr: res.data.nonceStr,
                package: res.data.package,
                signType: res.data.signType,
                paySign: res.data.paySign,
                success: function(res) {
                  that.redPacketAPI(that.data.orderID, 2);
                }
              })
            },
            fail: function(res) {},
            complete: function(res) {

            },
          })
        },
        fail: function(res) {},
        complete: function(res) {},
      })


    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    //获取屏幕高度
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          windowHeight: res.windowHeight
        });
      },
    });

    this.setData({
      out_trade_no: options.out_trade_no,
      isTakeNumber: options.isTakeNumber
    });
    if (options.isTakeNumber==1){

    }else{
      this.getOrderInof();
    }
  },


  // 弹出备注
  temarkToast: function() {
    this.setData({
      isToast: true
    });
  },
  // 输入框失去焦点
  inputBlur: function(e) {
    this.setData({
      inputTxt: e.detail.value
    });
  },
  // 取消弹窗
  cancel: function() {
    this.setData({
      isToast: false,
      inputTxt: ''
    });
  },
  // 确定备注
  determine: function() {
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
        header: {
          'content-type': 'application/json'
        },
        method: 'POST',
        dataType: 'json',
        responseType: 'text',
        success: function(res) {

        },
        fail: function(res) {},
        complete: function(res) {},
      })
    } else {
      wx.request({
        url: getApp().globalData.url + '/api/mall/message',
        data: {
          login_token: wx.getStorageSync('loginToken'),
          order_id: that.data.orderID,
          message: that.data.inputTxt
        },
        header: {
          'content-type': 'application/json'
        },
        method: 'POST',
        dataType: 'json',
        responseType: 'text',
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    }
  },
  // 密码失去焦点
  inputCodeBlur: function(e) {

    this.setData({
      inputCode: e.detail.value
    });
  },
  // 取消支付弹窗
  cancelPay: function() {
    this.setData({
      isPayCode: false
    });
  },
  // 确定余额支付
  determinePay: function(e) {
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
      url: getApp().globalData.url + '/api/scanorder/pay',
      data: {
        login_token: wx.getStorageSync('loginToken'),
        order_id: that.data.orderList.order.out_trade_no,
        code: that.data.payCode,
        addr_id: that.data.addrID,
        pay_password: passWords
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      dataType: 'json',
      success: function(res) {
        console.log('支付：', res);
        if (res.data.state == 1) {
          that.redPacketAPI(that.data.orderID, 2);
        } else {
          if (res.data.msg == '支付密码不正确') {
            wx.showModal({
              title: res.data.msg,
              content: res.data.msg,
              success: function(res) {
                if (res.confirm) {
                  wx.navigateTo({
                    url: '../../../../mine/setBalanceCode/setBalanceCode',
                  })
                }
              },
              fail: function(res) {},
              complete: function(res) {},
            })
          } else {
            wx.showModal({
              title: '提示',
              content: res.data.msg,
            })
          }
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  // 红包奖励接口
  redPacketAPI: function(orderID, orderType) {
    var that = this;
    wx.request({
      url: getApp().globalData.url + '/api/subsidyincentive/get_subsidy_money',
      data: {
        login_token: wx.getStorageSync('loginToken'),
        order_id: orderID,
        order_type: orderType
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        if (res.data.state == 0) {
          wx.showToast({
            title: '支付完成',
            success: function(res) {
              setTimeout(function() {
                wx.navigateBack({
                  delta: 5
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
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  // 点击隐藏关闭红包
  click_redPacket: function() {
    this.setData({
      is_redPacket: false
    });
    wx.navigateBack({
      delta: 5
    })
  },
  // 点击刮开图层
  click_shadow: function() {
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
        header: {
          'content-type': 'application/json'
        },
        method: 'POAT',
        dataType: 'json',
        responseType: 'text',
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
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
        header: {
          'content-type': 'application/json'
        },
        method: 'POAT',
        dataType: 'json',
        responseType: 'text',
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    }

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  /**
   * 获取扫码订单
   */
  getOrderInof: function() {
    var that = this;
    wx.request({
      url: getApp().globalData.url + '/api/scanorder/get_pay_info',
      data: {
        login_token: wx.getStorageSync('loginToken'),
        out_trade_no: this.data.out_trade_no
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        console.log('扫码订单：', res);
        if (res.data.state == 0) {
          wx.showToast({
            title: res.data.msg,
          })
        } else {
          that.setData({
            orderList: res.data.data
          });
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
})