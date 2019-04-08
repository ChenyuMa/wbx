//获取登录token
var Token = wx.getStorageSync('loginToken');
var num = 10;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    x: 0,
    y: 0,
    windowWidth: 0,
    windowHeight: 0,
    imgUrls: getApp().globalData.imgUrls,
    // tab切换    
    currentTab: 0,
    // 获取高度
    orderHeight: '',
    // 全部订单
    arryAllOrder: [],
    // 待评价
    arrayBeEvaluated: [],
    // 待退款
    arrayPendingRefund: [],
    // 买菜支付
    shopPayAPI: '/api/buygreens/get_pay_info',
    // 实体店支付
    mallPayAPI: '/api/mall/get_pay_info',
    // 确认收货
    confirmOrderAPI: '/api/userorder/confirm_order',
    // 取消订单
    cancelOrderAPI: '/api/userorder/cancel_order',
    // 删除订单
    deleteOrderAPI: '/api/userorder/delete_order',
    // 申请退款
    refundOrderAPI: '/api/userorder/refund_order',
    // 取消退款
    orderRefundAPI: '/api/userorder/cancel_order_refund',
    // 申请售后
    customerServiceAPI: '/api/userorder/add_customer_service',
    // 申请售后
    is_afterSale: false,
    afterSale_list: [
      '订单不能预计时间',
      '操作有误（商品、地址等选错）',
      '重复下单／错误下单',
      '我不想买了',
      '退／换货',
      '其他原因'
    ],
    afterSale_value: '订单不能预计时间',
    afterSale_orderID: '',
    afterSale_orderType: '',
    orderList: [],
    addrID: '',
    
    allOrderCurrentPage: 1,
    commentCurrentPage: 1,
    refundCurrentPage: 1,
  },

  //点击购物车
  clickCar: function () {
    wx.navigateTo({
      url: '../../shopCart/shopCart',
    })
  },
  // 发现首页跳转
  home() {
    wx.reLaunch({
      url: '../../home/home',
    })
  },
  // 跳转订单页面
  found() {
    wx.reLaunch({
      url: '../../found/found',
    })
  },
  // 跳转我的页面
  mine() {
    wx.reLaunch({
      url: '../mine',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    // 获取屏幕高度
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          orderHeight: res.windowHeight,
          windowHeight: res.windowHeight - 10,
          windowWidth: res.windowWidth - 5,
          x: res.windowWidth - 5,
          y: res.windowHeight - 100
        });
      },
    })
    
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
    var that=this;
    that.refresh()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

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

  // tap 联动
  swichNav: function(e) {
    var that = this;
    if (that.data.currentTab == e.currentTarget.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.currentTarget.dataset.current,
      })
    }
  },

  switchTab: function(e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
  },

  // 刷新
  refresh: function() {
    this.data.allOrderCurrentPage = 1
    this.data.commentCurrentPage = 1
    this.data.refundCurrentPage = 1
    this.requestOrder(88);
    this.requestOrder(8);
    this.requestOrder(3);
  },

  // croll-view 触发滚动加载
  loadMore: function() {
    switch (this.data.currentTab) {
      case 0:
        this.data.allOrderCurrentPage++;
        this.requestOrder(88);
        break;
      case 1:
        this.data.commentCurrentPage++;
        this.requestOrder(8);
        break;
      case 2:
        this.data.refundCurrentPage++;
        this.requestOrder(3);
        break;
    }
  },


  //  请求订单页面三个状态列表
  requestOrder: function(status) {
    var that = this;
    var currentPage;
    switch (status) {
      case 88:
        currentPage = that.data.allOrderCurrentPage;
        break;
      case 8:
        currentPage = that.data.commentCurrentPage;
        break;
      case 3:
        currentPage = that.data.refundCurrentPage;
        break;
    }

    wx.request({
      url: getApp().globalData.url + '/api/userorder/list_all_order',
      data: {
        login_token: wx.getStorageSync('loginToken'),
        page: currentPage,
        num: num,
        status: status
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      dataType: 'json',
      success: function(res) {
        if (status == 88) { // 全部订单
          var List;
          if (currentPage == 1) {
            List = [];
          } else {
            List = that.data.arryAllOrder
          }
          if (res.data.data) { // 没有数据就不执行
            for (var i = 0; i < res.data.data.length; i++) {
              List.push(res.data.data[i]);
            }
          }
          that.setData({
            arryAllOrder: List,
          });

        } else if (status == 8) { // 待评价
          var List
          if (currentPage == 1) {
            List = [];
          } else {
            List = that.data.arrayBeEvaluated
          }
          if (res.data.data) {
            for (var i = 0; i < res.data.data.length; i++) {
              List.push(res.data.data[i]);
            }
          }
          that.setData({
            arrayBeEvaluated: List,
          });

        } else { // 待退款
          var List
          if (currentPage == 1) {
            List = [];
          } else {
            List = that.data.arrayPendingRefund
          }
          if (res.data.data) {
            for (var i = 0; i < res.data.data.length; i++) {
              List.push(res.data.data[i]);
            }
          }
          that.setData({
            arrayPendingRefund: List,
          });
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  // 立即支付
  orderPay: function(e) {
    var that = this;
    if (e.currentTarget.dataset.ordertype == 1 || e.currentTarget.dataset.gradeid == 15) {
      wx.request({
        url: getApp().globalData.url + that.data.shopPayAPI,
        data: {
          login_token: wx.getStorageSync('loginToken'),
          order_id: e.currentTarget.dataset.orderid
        },
        header: {
          'content-type': 'application/json'
        },
        method: 'POST',
        dataType: 'json',
        success: function(res) {
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
              success: function(res) {},
              fail: function(res) {},
              complete: function(res) {
                wx.navigateTo({
                  url: '../address/address',
                  success: function(res) {},
                  fail: function(res) {},
                  complete: function(res) {},
                })
              },
            })
            return false;
          }
          wx.navigateTo({
            url: '../../home/shopDetails/confirmOrder/confirmClearing/confirmClearing?orderID=' + e.currentTarget.dataset.orderid + "&gradeid=" + e.currentTarget.dataset.gradeid + "&ordertype=" + e.currentTarget.dataset.ordertype + "&shopCart=" + JSON.stringify(e.currentTarget.dataset.shopCart) + "&orderList=" + JSON.stringify(that.data.orderList) + "&addrID=" + that.data.addrID + "&isshoporder=" + e.currentTarget.dataset.isshoporder,
          })
        },
        fail: function(res) {},
        complete: function(res) {},
      })
    } else {
      wx.request({
        url: getApp().globalData.url + that.data.mallPayAPI,
        data: {
          login_token: wx.getStorageSync('loginToken'),
          order_id: e.currentTarget.dataset.orderid
        },
        header: {
          'content-type': 'application/json'
        },
        method: 'POST',
        dataType: 'json',
        success: function(res) {
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
              success: function(res) {
                wx.reLaunch({
                  url: '../../mine/address/address',
                })
              },
              fail: function(res) {},
              complete: function(res) {},
            })
            return false;
          }
          wx.navigateTo({
            url: '../../home/shopDetails/confirmOrder/confirmClearing/confirmClearing?orderID=' + e.currentTarget.dataset.orderid + "&gradeid=" + e.currentTarget.dataset.gradeid + "&shopCart=" + JSON.stringify(that.data.shopCart) + "&addrID=" + that.data.addrID + "&orderList=" + JSON.stringify(that.data.orderList) + "&addrID=" + that.data.addrID + "&isshoporder=" + e.currentTarget.dataset.isshoporder,
          })
        },
        fail: function(res) {},
        complete: function(res) {},
      })
    }

  },

  // 订单详情
  orderDetails: function(e) {
    wx.navigateTo({
      url: '../../../../orderDetails/orderDetails?orderID=' + e.currentTarget.dataset.orderid + "&orderType=" + e.currentTarget.dataset.ordertype,
    })
  },

  // 退款详情
  refundTrack: function(e) {
    wx.navigateTo({
      url: '../../../../productRefund/productRefund?orderID=' + e.currentTarget.dataset.orderid + "&orderType=" + e.currentTarget.dataset.ordertype,
    })
  },

  // 确认收货
  confirmOrder: function(e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确认收货？',
      success: function(res) {
        if (res.confirm) {
          wx.request({
            url: getApp().globalData.url + that.data.confirmOrderAPI,
            data: {
              login_token: wx.getStorageSync('loginToken'),
              order_id: e.currentTarget.dataset.orderid,
              order_type: e.currentTarget.dataset.ordertype,
            },
            header: {
              'content-type': 'application/json'
            },
            method: 'POST',
            dataType: 'json',
            success: function(res) {
              that.refresh();
            }
          })
        }
      }
    })


  },

  // 取消订单
  cancelOrder: function(e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确认取消订单？',
      success: function(res) {
        if (res.confirm) {
          wx.request({
            url: getApp().globalData.url + that.data.cancelOrderAPI,
            data: {
              login_token: wx.getStorageSync('loginToken'),
              order_id: e.currentTarget.dataset.orderid,
              order_type: e.currentTarget.dataset.ordertype,
            },
            header: {
              'content-type': 'application/json'
            },
            method: 'POST',
            dataType: 'json',
            success: function(res) {
              that.refresh()
            }
          })
        }
      }
    })

  },

  // 删除订单
  deleteOrder: function(e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确认删除订单？',
      success: function(res) {
        if (res.confirm) {
          wx.request({
            url: getApp().globalData.url + that.data.deleteOrderAPI,
            data: {
              login_token: wx.getStorageSync('loginToken'),
              order_id: e.currentTarget.dataset.orderid,
              order_type: e.currentTarget.dataset.ordertype,
            },
            header: {
              'content-type': 'application/json'
            },
            method: 'POST',
            dataType: 'json',
            success: function(res) {
              that.refresh();
            }
          })
        }
      }
    })

  },

  // 申请退款
  refundOrder: function(e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确认申请退款',
      success: function(res) {
        if (res.confirm) {
          wx.request({
            url: getApp().globalData.url + that.data.refundOrderAPI,
            data: {
              login_token: wx.getStorageSync('loginToken'),
              order_id: e.currentTarget.dataset.orderid,
              order_type: e.currentTarget.dataset.ordertype,
            },
            header: {
              'content-type': 'application/json'
            },
            method: 'POST',
            dataType: 'json',
            success: function(res) {
              that.refresh();
            },
          })
        }
      }
    })
  },

  // 取消退款
  orderRefund: function(e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确认取消退款？',
      success: function(res) {
        if (res.confirm) {
          wx.request({
            url: getApp().globalData.url + that.data.orderRefundAPI,
            data: {
              login_token: wx.getStorageSync('loginToken'),
              order_id: e.currentTarget.dataset.orderid,
              order_type: e.currentTarget.dataset.ordertype,
            },
            header: {
              'content-type': 'application/json'
            },
            method: 'POST',
            dataType: 'json',
            success: function(res) {
            },
            fail: function(res) {},
            complete: function(res) {
              that.refresh()
            },
          })

        }
      }
    })

  },

  // 申请售后
  afterSale: function(e) {
    var that = this;
    this.setData({
      is_afterSale: !that.data.is_afterSale,
      afterSale_orderID: e.currentTarget.dataset.orderid,
      afterSale_orderType: e.currentTarget.dataset.ordertype
    });
  },

  // 售后取消
  cancel_afterSale: function() {
    var that = this;
    this.setData({
      is_afterSale: !that.data.is_afterSale
    });
  },

  // 售后确定
  confirm_afterSale: function(e) {
    var that = this;
    wx.request({
      url: getApp().globalData.url + that.data.customerServiceAPI,
      data: {
        login_token: wx.getStorageSync('loginToken'),
        order_id: that.data.afterSale_orderID,
        type: that.data.afterSale_orderType,
        message: that.data.afterSale_value
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      dataType: 'json',
      success: function(res) {
        wx.showToast({
          icon: 'none',
          title: res.data.msg
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })
    this.setData({
      is_afterSale: !that.data.is_afterSale
    });
  },

  // 售后选择改变
  afterSale_change: function(e) {
    var that = this;
    var index = e.detail.value[0];
    this.setData({
      afterSale_value: that.data.afterSale_list[index]
    });
  },

  // 去评价
  appraise: function(e) {
    console.log("去评价",e)
    var that=this
    if (that.data.is_appraise==true){
      wx.showToast({
        title: '您已评价过',
      })
    }else{
      wx.navigateTo({
        url: './appraise/appraise?order_id=' + e.currentTarget.dataset.orderid + "&type=" + e.currentTarget.dataset.ordertype,
        success: function (res) {},
        fail: function (res) { },
        complete: function (res) { },
      });
    }
    
  },

  // 拨打电话
  callPhone: function(e) {
    var that = this;
    console.log("E", e)
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  },

  // 跳转到商店
  shopsJump: function(e) {
    //console.log("e",e)
    if (e.currentTarget.dataset.ordertype == 1) {
      wx.navigateTo({
        url: '../../home/shopDetails/shopDetails?shopID=' + e.currentTarget.dataset.shopid + "&gradeid=" + 15
      })
    } else {
      wx.navigateTo({
        url: '../../home/shopDetails/shopDetails?shopID=' + e.currentTarget.dataset.shopid
      })
    }
  },

})