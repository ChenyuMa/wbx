// pages/mine/shopOrder/shopOrder.js
//获取登录token
var Token = wx.getStorageSync('loginToken');
var page = 0;
var num = 5;

//加载刷新
var orderRequest = function (API, that, status, List) {
  if (status == 4) {
    status = 8;
  }
  if (status == 3) {
    if (API == '/api/userorder/list_buygreens_order') {
      status = 3;
    } else {
      status = 4;
    }
  }
  page++;
  wx.request({
    url: getApp().globalData.url + API,
    data: {
      login_token: wx.getStorageSync('loginToken'),
      page: page,
      num: num,
      status: status
    },
    header: { 'content-type': 'application/json' },
    method: 'POST',
    dataType: 'json',
    success: function (res) {
      if (typeof (res.data.data) == "undefined") {
        that.setData({
          isBottom: true
        });
        return false;
      };
      // 对应页面放入数据
      if (status == 0) {
        //待付款
        var List = that.data.waitPayList;
        for (var i = 0; i < res.data.data.length; i++) {
          List.push(res.data.data[i]);
        }
        that.setData({
          waitPayList: List,
        });
      }
      if (status == 1) {
        // 待发货
        var List = that.data.waitShippingList;
        for (var i = 0; i < res.data.data.length; i++) {
          List.push(res.data.data[i]);
        }
        that.setData({
          waitShippingList: List,
        });
      }
      if (status == 2) {
        //待收货
        var List = that.data.waitGoodsList;
        for (var i = 0; i < res.data.data.length; i++) {
          List.push(res.data.data[i]);
        }
        that.setData({
          waitGoodsList: List,
          orderID: res.data.data.order_id
        });
      }
      if (status == 3) {
        //待退款
        var List = that.data.waitRefundsList;
        for (var i = 0; i < res.data.data.length; i++) {
          List.push(res.data.data[i]);
        }
        that.setData({
          waitRefundsList: List,
        });
      }
      if (status == 4) {
        //待退款
        var List = that.data.waitRefundsList;
        for (var i = 0; i < res.data.data.length; i++) {
          List.push(res.data.data[i]);
        }
        that.setData({
          waitRefundsList: List,
        });
      }
      if (status == 8) {
        //已完成
        var List = that.data.completedList;
        for (var i = 0; i < res.data.data.length; i++) {
          List.push(res.data.data[i]);
        }
        that.setData({
          completedList: List,
        });
      }
    }
  });
}
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 买菜商城订单切换
    order_selected: 1,
    // tab切换    
    currentTab: 0,
    orderHeight: '',
    isData: false,
    shopOrderInfo: '/api/userorder/list_buygreens_order',
    mallOrderInfo: '/api/userorder/list_shop_order',
    // 取消订单
    cancelAPI: '/api/userorder/cancel_buygreens_order',
    cancel:'/api/userorder/cancel_shop_order',
    // 退款
    refundsAPI: '/api/userorder/refund_buygreens_order',
    refunds:'/api/userorder/refund_shop_order',
    // 取消退款
    cancelRefundsAPI: '/api/userorder/cancel_buygreens_refund',
    cancelRefund: '/api/userorder/cancel_shop_refund',
    // 确认收货
    confirmGoodsAPI: '/api/userorder/confirm_buygreens_order',
    confirmGoods:'/api/userorder/confirm_shop_order',
    // 售后
    afterSaleAPI: '/api/userorder/add_customer_service',
    // 删除订单
    deletingOrderAPI: '/api/userorder/delete_buygreens_order',
    deletingOrder: '/api/userorder/delete_shop_order',
    // 评价
    appraiseAPI: '/api/userorder/add_assess',
    waitPayList: [],
    waitShippingList: [],
    waitGoodsList: [],
    waitRefundsList: [],
    completedList: [],
    orderID: '',
    isBottom: false,
    imgUrls: getApp().globalData.imgUrls,
    orderList: [],
    addrID: '',
    shopPayAPI: '/api/buygreens/get_pay_info',
    mallPayAPI: '/api/mall/get_pay_info',
    // 申请售后
    is_afterSale:false,
    afterSale_list:[
      '订单不能预计时间',
      '操作有误（商品、地址等选错）',
      '重复下单／错误下单',
      '我不想买了',
      '退／换货',
      '其他原因'
    ],
    afterSale_value:'订单不能预计时间'
  },

  swichNav: function (e) {
    var that = this;
    if (that.data.currentTab == e.currentTarget.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.currentTarget.dataset.current,
      })
      that.swiperChange(e);
    }
  },

  swiperChange: function (e) {
    
    var that = this;
    that.setData({
      currentTab: e.detail.current,
    })
    if (that.data.currentTab == 0 && that.data.waitPayList == '') {
      page = 0;
      if (that.data.order_selected == 1) {
        orderRequest(that.data.shopOrderInfo, that, 0);
      } else if (that.data.order_selected == 2) {
        orderRequest(that.data.mallOrderInfo, that, 0);
      }
    }
    if (that.data.currentTab == 1 && that.data.waitShippingList == '') {
      page = 0;
      if (that.data.order_selected == 1) {
        orderRequest(that.data.shopOrderInfo, that, 1);
      } else if (that.data.order_selected == 2) {
        orderRequest(that.data.mallOrderInfo, that, 1);
      }
    }
    if (that.data.currentTab == 2 && that.data.waitGoodsList == '') {
      page = 0;
      if (that.data.order_selected == 1) {
        orderRequest(that.data.shopOrderInfo, that, 2);
      } else if (that.data.order_selected == 2) {
        orderRequest(that.data.mallOrderInfo, that, 2);
      }
    }
    if (that.data.currentTab == 3 && that.data.waitRefundsList == '') {
      page = 0;
      if (that.data.order_selected == 1) {
        orderRequest(that.data.shopOrderInfo, that, 3);
      } else if (that.data.order_selected == 2) {
        orderRequest(that.data.mallOrderInfo, that, 3);
      }
    }
    if (that.data.currentTab == 4 && that.data.completedList == '') {
      page = 0;
      if (that.data.order_selected == 1) {
        orderRequest(that.data.shopOrderInfo, that, 8);
      } else if (that.data.order_selected == 2) {
        orderRequest(that.data.mallOrderInfo, that, 8);
      }
    }
  },

  // 头部订单选项
  order_selected: function (e) {
    var that = this;
    this.setData({
      order_selected: e.currentTarget.dataset.select,
      waitPayList: [],
      waitShippingList: [],
      waitGoodsList: [],
      waitRefundsList: [],
      completedList: [],
    });
    page = 0;
    if (e.currentTarget.dataset.select == 1) {
      orderRequest(that.data.shopOrderInfo, that, that.data.currentTab);
    } else if (e.currentTarget.dataset.select == 2) {
      orderRequest(that.data.mallOrderInfo, that, that.data.currentTab);
    }
  },
  //滚动到底部
  scrollBotton: function () {
    var that = this;
    if (this.data.order_selected == 1) {
      orderRequest(that.data.shopOrderInfo, that, that.data.currentTab);
    } else if (this.data.order_selected == 2) {
      orderRequest(that.data.mallOrderInfo, that, that.data.currentTab);
    }
  },
  // 点击订单商品跳转详情
  click_orderDetails:function(e){
    wx.navigateTo({
      url: './orderDetails/orderDetails?orderID=' + e.currentTarget.id + "&selected=" + this.data.order_selected
    })
  },
  //订单详情
  orderDetails: function (e) {
    wx.navigateTo({
      url: './orderDetails/orderDetails?orderID=' + e.currentTarget.id + "&selected=" + this.data.order_selected
    })
  },
  // 去买单
  orderPay: function (e) {
    var that = this;
    if (e.currentTarget.dataset.gradeid == 15) {
      wx.request({
        url: getApp().globalData.url + that.data.shopPayAPI,
        data: {
          login_token: wx.getStorageSync('loginToken'),
          order_id: e.currentTarget.dataset.orderid
        },
        header: { 'content-type': 'application/json' },
        method: 'POST',
        dataType: 'json',
        success: function (res) {
          if (res.data.data.address) {
            that.setData({
              orderList: res.data.data,
              addrID: res.data.data.address.id
            });
          } else {
            wx.showToast({
              title: '请填写送货地址！！！',
              duration: 3000,
              mask: true,
              success: function (res) {},
              fail: function (res) { },
              complete: function (res) {
                wx.navigateTo({
                  url: '../address/address',
                  success: function (res) { },
                  fail: function (res) { },
                  complete: function (res) { },
                })
              },
            })
            return false;
          }
          wx.navigateTo({
            url: '../../home/shopDetails/confirmOrder/confirmClearing/confirmClearing?orderID=' + e.currentTarget.dataset.orderid + "&gradeid=" + e.currentTarget.dataset.gradeid + "&shopCart=" + JSON.stringify(e.currentTarget.dataset.shopCart) + "&orderList=" + JSON.stringify(that.data.orderList) + "&addrID=" + that.data.addrID,
          })
        },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else {
      wx.request({
        url: getApp().globalData.url + that.data.mallPayAPI,
        data: {
          login_token: wx.getStorageSync('loginToken'),
          order_id: e.currentTarget.dataset.orderid
        },
        header: { 'content-type': 'application/json' },
        method: 'POST',
        dataType: 'json',
        success: function (res) {
          if (res.data.data.address) {
            that.setData({
              orderList: res.data.data,
              addrID: res.data.data.address.id
            });
          } else {
            wx.showToast({
              title: '请填写送货地址！！！',
              duration: 3000,
              mask: true,
              success: function (res) {
                wx.reLaunch({
                  url: '../../mine/address/address',
                })
              },
              fail: function (res) { },
              complete: function (res) { },
            })
            return false;
          }
          wx.navigateTo({
            url: '../../home/shopDetails/confirmOrder/confirmClearing/confirmClearing?orderID=' + e.currentTarget.dataset.orderid + "&gradeid=" + e.currentTarget.dataset.gradeid + "&shopCart=" + JSON.stringify(that.data.shopCart) + "&addrID=" + that.data.addrID + "&orderList=" + JSON.stringify(that.data.orderList) + "&addrID=" + that.data.addrID,
          })
        },
        fail: function (res) { },
        complete: function (res) { },
      })
    }

  },
  //取消订单
  cancelOrder: function (e) {
    var that = this;
    if (this.data.order_selected == 1){
      wx.request({
        url: getApp().globalData.url + that.data.cancelAPI,
        data: {
          login_token: wx.getStorageSync('loginToken'),
          order_id: e.currentTarget.id
        },
        header: { 'content-type': 'application/json' },
        method: 'POST',
        dataType: 'json',
        success: function (res) {
          var waitPayList = that.data.waitPayList;
          for (var i = 0; i < waitPayList.length; i++) {
            if (e.currentTarget.id == waitPayList[i].order_id) {
              waitPayList.splice(i, 1);
              that.setData({
                waitPayList: waitPayList
              });
            }
          }

          if (that.data.waitPayList.length == 0) {
            if (that.data.order_selected == 1) {
              orderRequest(that.data.shopOrderInfo, that, that.data.currentTab);
            } else if (that.data.order_selected == 2) {
              orderRequest(that.data.mallOrderInfo, that, that.data.currentTab);
            }
          }
        },
        fail: function (res) { },
        complete: function (res) { },
      })
    }else{
      wx.request({
        url: getApp().globalData.url + that.data.cancel,
        data: {
          login_token: wx.getStorageSync('loginToken'),
          order_id: e.currentTarget.id
        },
        header: { 'content-type': 'application/json' },
        method: 'POST',
        dataType: 'json',
        success: function (res) {
          var waitPayList = that.data.waitPayList;
          for (var i = 0; i < waitPayList.length; i++) {
            if (e.currentTarget.id == waitPayList[i].order_id) {
              waitPayList.splice(i, 1);
              that.setData({
                waitPayList: waitPayList
              });
            }
          }

          if (that.data.waitPayList.length == 0) {
            if (that.data.order_selected == 1) {
              orderRequest(that.data.shopOrderInfo, that, that.data.currentTab);
            } else if (that.data.order_selected == 2) {
              orderRequest(that.data.mallOrderInfo, that, that.data.currentTab);
            }
          }
        },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
    

  },
  //退款
  refunds: function (e) {
    var that = this;
    if (this.data.order_selected == 1){
      wx.request({
        url: getApp().globalData.url + that.data.refundsAPI,
        data: {
          login_token: wx.getStorageSync('loginToken'),
          order_id: e.currentTarget.id
        },
        header: { 'content-type': 'application/json' },
        method: 'POST',
        dataType: 'json',
        success: function (res) {
          if(res.data.state == 0){
            wx.showToast({
              title: res.data.msg,
            })
          }else{
            var waitShippingList = that.data.waitShippingList;
            for (var i = 0; i < waitShippingList.length; i++) {
              if (e.currentTarget.id == waitShippingList[i].order_id) {
                waitShippingList.splice(i, 1);
                that.setData({
                  waitShippingList: waitShippingList
                });
              }
            }
          }
        },
        fail: function (res) { },
        complete: function (res) { },
      })
    }else{
      wx.request({
        url: getApp().globalData.url + that.data.refunds,
        data: {
          login_token: wx.getStorageSync('loginToken'),
          order_id: e.currentTarget.id
        },
        header: { 'content-type': 'application/json' },
        method: 'POST',
        dataType: 'json',
        success: function (res) {
          if(res.data.state == 0){
            wx.showToast({
              title: res.data.msg,
            })
          }else{
            var waitShippingList = that.data.waitShippingList;
            for (var i = 0; i < waitShippingList.length; i++) {
              if (e.currentTarget.id == waitShippingList[i].order_id) {
                waitShippingList.splice(i, 1);
                that.setData({
                  waitShippingList: waitShippingList
                });
              }
            }
            
          }
        },
        fail: function (res) { },
        complete: function (res) { },
      })
    }

  },
  //确认收货
  confirmGoods: function (e) {
    var that = this;
    if (this.data.order_selected == 1){
      wx.request({
        url: getApp().globalData.url + that.data.confirmGoodsAPI,
        data: {
          login_token: wx.getStorageSync('loginToken'),
          order_id: e.currentTarget.id
        },
        header: { 'content-type': 'application/json' },
        method: 'POST',
        dataType: 'json',
        success: function (res) {
          var waitGoodsList = that.data.waitGoodsList;
          for (var i = 0; i < waitGoodsList.length; i++) {
            if (e.currentTarget.id == waitGoodsList[i].order_id) {
              waitGoodsList.splice(i, 1);
              that.setData({
                waitGoodsList: waitGoodsList
              });
            }
          }

          if (that.data.waitGoodsList.length == 0) {
            if (that.data.order_selected == 1) {
              orderRequest(that.data.shopOrderInfo, that, that.data.currentTab);
            } else if (that.data.order_selected == 2) {
              orderRequest(that.data.mallOrderInfo, that, that.data.currentTab);
            }
          }
        },
        fail: function (res) { },
        complete: function (res) { },
      })
    }else{
      wx.request({
        url: getApp().globalData.url + that.data.confirmGoods,
        data: {
          login_token: wx.getStorageSync('loginToken'),
          order_id: e.currentTarget.id
        },
        header: { 'content-type': 'application/json' },
        method: 'POST',
        dataType: 'json',
        success: function (res) {
          var waitGoodsList = that.data.waitGoodsList;
          for (var i = 0; i < waitGoodsList.length; i++) {
            if (e.currentTarget.id == waitGoodsList[i].order_id) {
              waitGoodsList.splice(i, 1);
              that.setData({
                waitGoodsList: waitGoodsList
              });
            }
          }

          if (that.data.waitGoodsList.length == 0) {
            if (that.data.order_selected == 1) {
              orderRequest(that.data.shopOrderInfo, that, that.data.currentTab);
            } else if (that.data.order_selected == 2) {
              orderRequest(that.data.mallOrderInfo, that, that.data.currentTab);
            }
          }
        },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
  },
  //取消退款
  cancelRefunds: function (e) {
    var that = this;
    if (this.data.order_selected == 1) {
      wx.request({
        url: getApp().globalData.url + that.data.cancelRefundsAPI,
        data: {
          login_token: wx.getStorageSync('loginToken'),
          order_id: e.currentTarget.id
        },
        header: { 'content-type': 'application/json' },
        method: 'POST',
        dataType: 'json',
        success: function (res) {
          var waitRefundsList = that.data.waitRefundsList;
          for (var i = 0; i < waitRefundsList.length; i++) {
            if (e.currentTarget.id == waitRefundsList[i].order_id) {
              waitRefundsList.splice(i, 1);
              that.setData({
                waitRefundsList: waitRefundsList
              });
            }
          }

          if (that.data.waitRefundsList.length == 0) {
            if (that.data.order_selected == 1) {
              orderRequest(that.data.shopOrderInfo, that, that.data.currentTab);
            } else if (that.data.order_selected == 2) {
              orderRequest(that.data.mallOrderInfo, that, that.data.currentTab);
            }
          }

        },
        fail: function (res) { },
        complete: function (res) { },
      })

    } else {
      wx.request({
        url: getApp().globalData.url + that.data.cancelRefund,
        data: {
          login_token: wx.getStorageSync('loginToken'),
          order_id: e.currentTarget.id
        },
        header: { 'content-type': 'application/json' },
        method: 'POST',
        dataType: 'json',
        success: function (res) {
          var waitRefundsList = that.data.waitRefundsList;
          for (var i = 0; i < waitRefundsList.length; i++) {
            if (e.currentTarget.id == waitRefundsList[i].order_id) {
              waitRefundsList.splice(i, 1);
              that.setData({
                waitRefundsList: waitRefundsList
              });
            }
          }

          if (that.data.waitRefundsList.length == 0) {
            if (that.data.order_selected == 1) {
              orderRequest(that.data.shopOrderInfo, that, that.data.currentTab);
            } else if (that.data.order_selected == 2) {
              orderRequest(that.data.mallOrderInfo, that, that.data.currentTab);
            }
          }

        },
        fail: function (res) { },
        complete: function (res) { },
      })

    }

  },
  //申请售后
  afterSale: function (e) {
    var that = this;
    this.setData({
      is_afterSale: !that.data.is_afterSale,
      orderID: e.currentTarget.id
    });
  },
  // 售后取消
  cancel_afterSale:function(){
    var that = this;
    this.setData({
      is_afterSale: !that.data.is_afterSale
    });
  },
  // 售后确定
  confirm_afterSale:function(){
    var that = this;
    if (this.data.order_selected == 1){
      wx.request({
        url: getApp().globalData.url + that.data.afterSaleAPI,
        data: {
          login_token: wx.getStorageSync('loginToken'),
          order_id: that.data.orderID,
          type: 1,
          message: that.data.afterSale_value
        },
        header: { 'content-type': 'application/json' },
        method: 'POST',
        dataType: 'json',
        success: function (res) {
        },
        fail: function (res) { },
        complete: function (res) { },
      })
    }else{
      wx.request({
        url: getApp().globalData.url + that.data.afterSaleAPI,
        data: {
          login_token: wx.getStorageSync('loginToken'),
          order_id: that.data.orderID,
          type: 2,
          message: that.data.afterSale_value
        },
        header: { 'content-type': 'application/json' },
        method: 'POST',
        dataType: 'json',
        success: function (res) {
        },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
    
    this.setData({
      is_afterSale: !that.data.is_afterSale
    });
  },
  // 售后选择改变
  afterSale_change:function(e){
    var that = this;
    var index = e.detail.value[0];
    this.setData({
      afterSale_value: that.data.afterSale_list[index]
    });
  },
  //删除订单
  deletingOrder: function (e) {
    var that = this;
    if (this.data.order_selected == 1) {
      wx.request({
        url: getApp().globalData.url + that.data.deletingOrderAPI,
        data: {
          login_token: wx.getStorageSync('loginToken'),
          order_id: e.currentTarget.id
        },
        header: { 'content-type': 'application/json' },
        method: 'POST',
        dataType: 'json',
        success: function (res) {
          var completedList = that.data.completedList;
          for (var i = 0; i < completedList.length; i++) {
            if (e.currentTarget.id == completedList[i].order_id) {
              completedList.splice(i, 1);
              that.setData({
                completedList: completedList
              });
            }
          }

          if (that.data.completedList.length == 0) {
            if (that.data.order_selected == 1) {
              orderRequest(that.data.shopOrderInfo, that, that.data.currentTab);
            } else if (that.data.order_selected == 2) {
              orderRequest(that.data.mallOrderInfo, that, that.data.currentTab);
            }
          }
        },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else {
      wx.request({
        url: getApp().globalData.url + that.data.deletingOrder,
        data: {
          login_token: wx.getStorageSync('loginToken'),
          order_id: e.currentTarget.id
        },
        header: { 'content-type': 'application/json' },
        method: 'POST',
        dataType: 'json',
        success: function (res) {
          var completedList = that.data.completedList;
          for (var i = 0; i < completedList.length; i++) {
            if (e.currentTarget.id == completedList[i].order_id) {
              completedList.splice(i, 1);
              that.setData({
                completedList: completedList
              });
            }
          }

          if (that.data.completedList.length == 0) {
            if (that.data.order_selected == 1) {
              orderRequest(that.data.shopOrderInfo, that, that.data.currentTab);
            } else if (that.data.order_selected == 2) {
              orderRequest(that.data.mallOrderInfo, that, that.data.currentTab);
            }
          }
        },
        fail: function (res) { },
        complete: function (res) { },
      })
    }


  },
  //去评价
  appraise: function (e) {
    // var that = this;
    // wx.request({
    //   url: getApp().globalData.url + that.data.appraiseAPI,
    //   data: {
    //     login_token: wx.getStorageSync('loginToken'),
    //     order_id: e.currentTarget.id
    //   },
    //   header: { 'content-type': 'application/json' },
    //   method: 'POST',
    //   dataType: 'json',
    //   success: function (res) {

    //   },
    //   fail: function (res) { },
    //   complete: function (res) { },
    // })
    wx.navigateTo({
      url: './appraise/appraise?order_id=' + e.currentTarget.id + "&type=" + e.currentTarget.dataset.type,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    });
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    page = 0;
    // 获取屏幕高度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          orderHeight: res.windowHeight,
        });
      },
    })

    // 获取买菜订单点选项
    if (typeof (options.current) === 'undefined') {
      orderRequest(that, 0);
    }

    this.setData({
      currentTab: options.current
    });

    if (this.data.order_selected == 1) {
      orderRequest(that.data.shopOrderInfo, that, that.data.currentTab);
    } else if (this.data.order_selected == 2) {
      orderRequest(that.data.mallOrderInfo, that, that.data.currentTab);
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
    var that = this;

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    var that = this;
    this.setData({
      waitPayList: [],
      waitShippingList: [],
      waitGoodsList: [],
      waitRefundsList: [],
      completedList: []
    });

    page = 0;
    if (this.data.order_selected == 1) {
      orderRequest(that.data.shopOrderInfo, that, that.data.currentTab);
    } else if (this.data.order_selected == 2) {
      orderRequest(that.data.mallOrderInfo, that, that.data.currentTab);
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 2];

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
    var that = this;
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})