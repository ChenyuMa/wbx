// pages/mine/mallOrder/mallOrder.js
var Token;
var page = 0;
var num = 5;
//加载刷新
var orderRequest = function (that, status) {
  
  page++;
  wx.request({
    url: getApp().globalData.url + that.data.mallOrderInfo,
    data: {
      login_token: Token,
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
    // tab切换    
    currentTab: 0,
    orderHeight: '',
    isData: false,
    mallOrderInfo: '/api/userorder/list_shop_order',
    cancelAPI: '/api/userorder/cancel_shop_order',
    refundsAPI: '/api/userorder/refund_shop_order',
    cancelRefundsAPI: '/api/userorder/cancel_shop_refund',
    confirmGoodsAPI: '/api/userorder/confirm_shop_order',
    afterSaleAPI: '/api/userorder/add_customer_service',
    deletingOrderAPI: '/api/userorder/delete_buygreens_order',
    appraiseAPI: '/api/userorder/add_assess',
    waitPayList: [],
    waitShippingList: [],
    waitGoodsList: [],
    waitRefundsList: [],
    completedList: [],
    orderID: '',
    isBottom: false,
    imgUrls: getApp().globalData.imgUrls
  },


  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
      })
      that.swiperChange(e)
    }
  },

  swiperChange: function (e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current,
    })
    if (that.data.currentTab == 0 && that.data.waitPayList == '') {
      page = 0;
      orderRequest(that, 0);
    }
    if (that.data.currentTab == 1 && that.data.waitShippingList == '') {
      page = 0;
      orderRequest(that, 1);
    }
    if (that.data.currentTab == 2 && that.data.waitGoodsList == '') {
      page = 0;
      orderRequest(that, 2);
    }
    if (that.data.currentTab == 3 && that.data.waitRefundsList == '') {
      page = 0;
      orderRequest(that, 4);
    }
    if (that.data.currentTab == 4 && that.data.completedList == '') {
      page = 0;
      orderRequest(that, 8);
    }
  },

  //滚动到底部
  scrollBotton: function () {
    var that = this;
    if (that.data.currentTab == 3){
      orderRequest(that, 4);
    } else if (that.data.currentTab == 4){
      orderRequest(that, 8);
    }else{
      orderRequest(that, that.data.currentTab);
    }
  },

  //订单详情
  orderDetails: function (e) {
    wx.navigateTo({
      url: './orderDetails/orderDetails?orderID=' + e.currentTarget.id
    })
  },
  //取消订单
  cancelOrder: function (e) {
    var that = this;
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
          orderRequest(that, that.data.currentTab);
        }

      },
      fail: function (res) { },
      complete: function (res) { },
    })

  },
  //退款
  refunds: function (e) {
    var that = this;
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
        var waitShippingList = that.data.waitShippingList;
        for (var i = 0; i < waitShippingList.length; i++) {
          if (e.currentTarget.id == waitShippingList[i].order_id) {
            waitShippingList.splice(i, 1);
            that.setData({
              waitShippingList: waitShippingList
            });
          }
        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })

  },
  //确认收货
  confirmGoods: function (e) {
    var that = this;
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
      },
      fail: function (res) { },
      complete: function (res) { },
    })

  },
  //取消退款
  cancelRefunds: function (e) {
    var that = this;
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
      },
      fail: function (res) { },
      complete: function (res) { },
    })

  },
  //申请售后
  afterSale: function (e) {
    var that = this;
    wx.request({
      url: getApp().globalData.url + that.data.afterSaleAPI,
      data: {
        login_token: wx.getStorageSync('loginToken'),
        order_id: e.currentTarget.id
      },
      header: { 'content-type': 'application/json' },
      method: 'POST',
      dataType: 'json',
      success: function (res) {

      },
      fail: function (res) { },
      complete: function (res) { },
    })

  },
  //删除订单
  deletingOrder: function (e) {
    var that = this;
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
        var waitShippingList = that.data.waitShippingList;
        for (var i = 0; i < waitShippingList.length; i++) {
          if (e.currentTarget.id == waitShippingList[i].order_id) {
            waitShippingList.splice(i, 1);
            that.setData({
              waitShippingList: waitShippingList
            });
          }
        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })

  },
  //去评价
  appraise: function (e) {
    var that = this;
    wx.request({
      url: getApp().globalData.url + that.data.appraiseAPI,
      data: {
        login_token: wx.getStorageSync('loginToken'),
        order_id: e.currentTarget.id
      },
      header: { 'content-type': 'application/json' },
      method: 'POST',
      dataType: 'json',
      success: function (res) {
      },
      fail: function (res) { },
      complete: function (res) { },
    })
    // wx.redirectTo({
    //   url: '../mallOrder/mallOrder?current=' + that.data.currentTab,
    // })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //获取登录token
    Token = wx.getStorageSync('loginToken');
    page = 0;
    // 获取屏幕高度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          orderHeight: res.windowHeight
        });
      },
    })
    var userLogin = getApp().globalData.userLogin;
    if (!userLogin) {
      wx.showModal({
        title: '提示',
        content: '未登录,是否登录？',
        confirmColor: '#09C1AE',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../login/login',
            })
          } else if (res.cancel) {

          }
        }
      })
    }

    // 获取买菜订单点选项
    if (typeof (options.current) === 'undefined') {
      orderRequest(that, 0);
    }
    that.setData({
      currentTab: options.current
    });
    orderRequest(that, that.data.currentTab);
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
    orderRequest(that, that.data.currentTab);
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
    var that = this;
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})