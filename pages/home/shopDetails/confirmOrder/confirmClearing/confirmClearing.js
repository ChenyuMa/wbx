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
    isPay:true
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
    if (that.data.payCode == '') {
      wx.showModal({
        title: '提示',
        content: '请选择支付方式',
      })
    }else{
      if (that.data.payCode == 'money') {
        that.setData({
          isPayCode: true,
          inputCode: ''
        });
      } else {
        if (that.data.isPay) {
          wx.login({
            success: function (res) {
              that.setData({ isPay: false });
              if (that.data.gradeid == 15) {
                wx.request({
                  url: getApp().globalData.url + that.data.wxShopPayAPI,
                  data: {
                    login_token: wx.getStorageSync('loginToken'),
                    order_id: that.data.orderID,
                    code: that.data.payCode,
                    addr_id: that.data.addrID,
                    code_openid: res.code
                  },
                  header: {
                    'content-type': 'application/json'
                  },
                  method: 'POST',
                  dataType: 'json',
                  responseType: 'text',
                  success: function (res) {
                    console.log('菜市场微信支付:', res);
                    wx.requestPayment({
                      timeStamp: res.data.timeStamp,
                      nonceStr: res.data.nonceStr,
                      package: res.data.package,
                      signType: res.data.signType,
                      paySign: res.data.paySign,
                      success: function (res) {
                        that.redPacketAPI(that.data.orderID, 2);
                      }
                    })
                  },
                  fail: function (res) { },
                  complete: function (res) { },
                })
              } else {
                wx.request({
                  url: getApp().globalData.url + that.data.wxMallPayAPI,
                  data: {
                    login_token: wx.getStorageSync('loginToken'),
                    order_id: that.data.orderID,
                    code: that.data.payCode,
                    addr_id: that.data.isTakeNumber != 1 ? that.data.addrID : '',
                    code_openid: res.code
                  },
                  header: {
                    'content-type': 'application/json'
                  },
                  method: 'POST',
                  dataType: 'json',
                  responseType: 'text',
                  success: function (res) {
                    console.log('实体店微信支付：', res);
                    wx.requestPayment({
                      timeStamp: res.data.timeStamp,
                      nonceStr: res.data.nonceStr,
                      package: res.data.package,
                      signType: res.data.signType,
                      paySign: res.data.paySign,
                      success: function (res) {
                        that.redPacketAPI(that.data.orderID, 2);
                      }
                    })
                  },
                  fail: function (res) { },
                  complete: function (res) { },
                })
              }
            },
            fail: function (res) { },
            complete: function (res) { },
          })
        }
      }
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
    })

    this.setData({
      orderID: options.orderID,
      gradeid: options.gradeid,
      // shopCart: JSON.parse(options.shopCart),
      logistics: options.logistics,
      // orderList: JSON.parse(options.orderList),
      // addrID: options.addrID,
      sweepOrder: options.sweepOrder == null ? '' : options.sweepOrder,
      isTakeNumber: options.isTakeNumber == null ? '' : options.isTakeNumber
    });

  },

  // 获取用户订单
  getPayInfo:function(){
    var that = this;
    if (that.data.gradeid == 15) {
      wx.request({
        url: getApp().globalData.url + '/api/buygreens/get_pay_info',
        data: {
          login_token: wx.getStorageSync('loginToken'),
          order_id: that.data.orderID
        },
        header: {
          'content-type': 'application/json'
        },
        method: 'POST',
        dataType: 'json',
        success: function (res) {
          console.log('获取用户订单:',res);
          if(res.data.state == 0){
            wx.showModal({
              title: '提示',
              content: res.data.msg,
            })
          }else{
            that.setData({
              orderList: res.data.data,
              // name: res.data.data.address.xm,
              // tel: res.data.data.address.tel,
              // info: res.data.data.address.area_str + res.data.data.address.info,
              // addrID: res.data.data.address.id
            });
          }
        },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else {
      wx.request({
        url: getApp().globalData.url + '/api/mall/get_pay_info',
        data: {
          login_token: wx.getStorageSync('loginToken'),
          order_id: that.data.orderID
        },
        header: {
          'content-type': 'application/json'
        },
        method: 'POST',
        dataType: 'json',
        success: function (res) {
          console.log('获取用户订单:', res);
          if(res.data.state == 0){
            wx.showModal({
              title: '提示',
              content: res.data.msg,
            })
          }else{
            that.setData({
              orderList: res.data.data,
              // name: that.data.isTakeNumber != 1 ? res.data.data.address.xm : '',
              // tel: that.data.isTakeNumber != 1 ? res.data.data.address.tel : '',
              // info: that.data.isTakeNumber != 1 ? res.data.data.address.area_str + res.data.data.address.info : '',
              // addrID: that.data.isTakeNumber != 1 ? res.data.data.address.id : '',
            });
          }
        },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
  },

  // 地址选择
  address_select: function() {
    wx.navigateTo({
      url: './address/address',
    })
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
          if(res.data.state == 0){
            wx.showToast({
              title: res.data.msg,
            })
          }else{
            that.setData({
              isToast: false
            });
          }
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
        success: function(res) {
          if (res.data.state == 0) {
            wx.showToast({
              title: res.data.msg,
            })
          } else {
            that.setData({
              isToast: false
            });
          }
        },
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
    if(that.data.isPay){
      that.setData({isPay:false})
      if (that.data.gradeid == 15) {
        wx.request({
          url: getApp().globalData.url + that.data.shopToPayAPI,
          data: {
            login_token: wx.getStorageSync('loginToken'),
            order_id: that.data.orderID,
            code: that.data.payCode,
            addr_id: that.data.addrID,
            pay_password: passWords
          },
          header: {
            'content-type': 'application/json'
          },
          method: 'POST',
          dataType: 'json',
          success: function (res) {
            console.log('余额支付：',res);
            if (res.data.state == 1) {
              that.redPacketAPI(that.data.orderID, 1);
            } else {
              if (res.data.msg == "请先设置支付密码") {
                wx.showModal({
                  title: '提示',
                  content: res.data.msg,
                  success: function (res) {
                    if (res.confirm) {
                      wx.navigateTo({
                        url: '../../../../mine/setBalanceCode/setBalanceCode',
                      })
                    }
                  },
                  fail: function (res) { },
                  complete: function (res) { },
                })
              } else if (res.data.msg == "余额不足，请及时充值") {
                wx.showModal({
                  title: '提示',
                  content: res.data.msg,
                  success: function (res) {
                    if (res.confirm) {
                      wx.navigateTo({
                        url: '../../../../mine/micron/micron',
                      })
                    }
                  },
                  fail: function (res) { },
                  complete: function (res) { },
                })
              } else {
                wx.showModal({
                  title: '提示',
                  content: res.data.msg,
                })
              }
            }
          },
          fail: function (res) { },
          complete: function (res) { },
        })
      } else {
        wx.request({
          url: getApp().globalData.url + that.data.mallToPayAPI,
          data: {
            login_token: wx.getStorageSync('loginToken'),
            order_id: that.data.orderID,
            code: that.data.payCode,
            addr_id: that.data.isTakeNumber != 1 ? that.data.addrID : '',
            pay_password: passWords
          },
          header: {
            'content-type': 'application/json'
          },
          method: 'POST',
          dataType: 'json',
          success: function (res) {
            console.log('余额支付', res);
            if (res.data.state == 1) {
              that.redPacketAPI(that.data.orderID, 2);
            } else {
              if (res.data.msg == "请先设置支付密码") {
                wx.showModal({
                  title: '提示',
                  content: res.data.msg,
                  success: function (res) {
                    if (res.confirm) {
                      wx.navigateTo({
                        url: '../../../../mine/setBalanceCode/setBalanceCode',
                      })
                    } else {

                    }
                  },
                  fail: function (res) { },
                  complete: function (res) { },
                })
              } else if (res.data.msg == "余额不足，请及时充值") {
                wx.showModal({
                  title: '提示',
                  content: res.data.msg,
                  success: function (res) {
                    if (res.confirm) {
                      wx.navigateTo({
                        url: '../../../../mine/micron/micron',
                      })
                    }
                  },
                  fail: function (res) { },
                  complete: function (res) { },
                })
              } else {
                wx.showModal({
                  title: '提示',
                  content: res.data.msg,
                })
              }
            }
          },
          fail: function (res) { },
          complete: function (res) { },
        })
      }
    }
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
        console.log('红包奖励接口:',res);
        if (res.data.state == 1) {
          wx.showToast({
            title: '支付完成',
            success: function(res) {}
          })
          that.setData({
            is_redPacket: true,
            redPacket_money: res.data.data.money
          });
          // 领取红包
          wx.request({
            url: getApp().globalData.url + '/api/subsidyincentive/set_subsidy_money',
            data: {
              login_token: wx.getStorageSync('loginToken'),
              order_id: orderID,
              order_type: orderType,
              money: res.data.data.money
            },
            header: {
              'content-type': 'application/json'
            },
            method: 'POST',
            dataType: 'json',
            responseType: 'text',
            success: function(res) {
              console.log('set_subsidy_money:',res);
              if(res.data.state==0){
                wx.showToast({
                  title: res.data.msg,
                })
              }else{
                if (that.data.isTakeNumber == 1) {
                  setTimeout(function () {
                    wx.navigateTo({
                      url: '../../../../mine/shopOrder/orderDetails/orderDetails?orderID=' + that.data.orderID +'&selected='+2,
                    })
                  }, 1500);
                } else {
                  setTimeout(function () {
                    wx.navigateBack({
                      delta: 3
                    })
                  },1500);
                }
              }
            },
            fail: function(res) {},
            complete: function(res) {},
          })
        } else {
          if (that.data.isTakeNumber==1){
            setTimeout(function () {
              wx.navigateTo({
                url: '../../../../mine/shopOrder/orderDetails/orderDetails?orderID=' + that.data.orderID + '&selected=' + 2,
              })
            }, 1500);
          }else{
            wx.navigateBack({
              delta: 3
            })
          }
        }
      },
      fail: function(res) {},
      complete: function(res) {
        that.setData({
          isPay:true
        })
      },
    })
  },
  // 点击隐藏关闭红包
  click_redPacket: function() {
    this.setData({
      is_redPacket: false
    });
    wx.navigateBack({
      delta: 3
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
          money: that.data.redPacket_money / 100.00
        },
        header: {
          'content-type': 'application/json'
        },
        method: 'POAT',
        dataType: 'json',
        responseType: 'text',
        success: function(res) {

        },
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
          money: that.data.redPacket_money / 100.00
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
  onShow: function() {
    var that = this;
    this.getPayInfo();
  },

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

  }
})