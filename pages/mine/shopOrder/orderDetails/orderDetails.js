var QQMapWX = require('../../../../libs/qqmap-wx-jssdk.min.js');
// 实例化API核心类
var mapKey = new QQMapWX({
  key: '75FBZ-CV33K-XNIJC-AL66E-CUINE-NNFR5' // 必填
});


// 时间转换1
function timestampToTime(timestamp) {
  var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var D = (date.getDate() < 10 ? '0' : '') + date.getDate() + ' ';
  var h = (date.getHours() < 10 ? '0' : '') + date.getHours() + ':';
  var m = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes() + ':';
  var s = (date.getSeconds() < 10 ? '0' : '') + date.getSeconds();
  return Y + M + D + h + m + s;
}

// 时间转换2
function timestampToTime2(timestamp) {
  var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '月';
  var D = (date.getDate() < 10 ? '0' : '') + date.getDate() + ' ';
  var h = (date.getHours() < 10 ? '0' : '') + date.getHours() + ':';
  var m = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes() + ':';
  var s = (date.getSeconds() < 10 ? '0' : '') + date.getSeconds();
  return M + D + h + m + s;
}

Page({

  /**
   * 页面的初始数据
   */
  data: {

    imgUrls: getApp().globalData.imgUrls,
    orderId: '',
    orderType: '',
    // 订单详情api
    orderDetailAPI: '/api/userorder/get_order_detail',
    // 取消订单
    cancelOrderAPI: '/api/userorder/cancel_order',
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
    // 订单轨迹
    orderTrackAPI: '/api/userorder/list_order_track',
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
    // 订单详情
    orderDetails: [],
    // 下单时间
    orderCreateTime: '',
    // 蜂鸟配送展示
    is_hummingbird: false,
    // 商家配送展示
    is_merchant: false,
    // 商家配送信息状态文字
    merchant_title: '',
    // 商家配送信息状态文字
    merchant_des: '',
    // 订单轨迹
    orderTrack: [],

    latitude: '', // 初始化商家位置
    longitude: '', // 初始化商家位置
    markers: [{ //  商家的位置
      id: 0,
      latitude: '',
      longitude: '',
      width: 30,
      height: 30,
      iconPath: '',
      callout: {
        content: '',
        padding: 10,
        fontSize: 16,
        bgColor: '#fff',
        borderColor: '#eee',
        color: '#333',
        borderRadius: 5,
        display: 'ALWAYS'
      },
    },
      { //  蜂鸟的位置
        id:1,
        latitude: '',
        longitude: '',
        width: 30,
        height: 30,
        iconPath: '',
        callout: {
          content: '',
          padding: 10,
          fontSize: 16,
          bgColor: '#fff',
          borderColor: '#eee',
          color: '#333',
          borderRadius: 5,
          display: 'ALWAYS'
        },
      },
    ],

    trac_show: false,
    // 查看更多
    more_index: false,
    min_index: true,
    max_index: false,

    // 点击返回键跳转到订单页面
    clickFlag: false,
    // 是否评价过
    is_appraise: false,
    // 是否是商店直接付款还是订单；列表付款
    is_shoporder: '',
    // 达达配送展示
    is_dada: false,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    that.setData({
      orderId: options.orderID,
      orderType: options.orderType,
      is_shoporder: options.isshoporder
    })

    this.orderDetail();
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
    var that = this;
    if (that.data.is_shoporder == 1) {
      wx.reLaunch({
        url: '/pages/home/home'
      })
    } else if (that.data.is_shoporder == 2) {
      wx.navigateBack({
        delta: 1
      })
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 3];
      prevPage.refresh()
    } else if (that.data.is_shoporder == 3) {
      wx.navigateBack({
        delta: 2
      })
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 4];
      prevPage.refresh()
    }
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

  //订单详情
  orderDetail: function () {
    var that = this;
    wx.request({
      url: getApp().globalData.url + that.data.orderDetailAPI,
      data: {
        login_token: wx.getStorageSync('loginToken'),
        order_id: that.data.orderId,
        order_type: that.data.orderType
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      dataType: 'json',
      success: function (res) {
        var createTime = timestampToTime(res.data.data.create_time)
        var isOrderType = res.data.data.order_type // 实体店或者菜市场
        var isStatus = res.data.data.status // 判断状态
        var isFengniao = res.data.data.is_fengniao // 是否蜂鸟
        var isDada = res.data.data.is_dada // 是否达达

        var Fengniao = res.data.data.fengniao
        var Dada = res.data.data.dada
        if (isFengniao != 0) {
          for (var i = 0; i < Fengniao.length; i++) {
            var FengniaoStatus = Fengniao[i].fengniao_status
          }
        }
        if (isDada) {
          var DadaStatus = res.data.data.dada.statusCode
        }

        that.setData({
          orderDetails: res.data.data,
          orderCreateTime: createTime,
        })

        // 查看更多
        that.loadIndex(res.data.data)

        if (isStatus == 0) { // 待付款
          that.setData({
            is_hummingbird: true,
            latitude: res.data.data.address.lat,
            longitude: res.data.data.address.lng,
            markers: [{ //  商家的位置
              id: 0,
              latitude: res.data.data.address.lat,
              longitude: res.data.data.address.lng,
              width: 30,
              height: 30,
              iconPath: '/images/map_user_icon@2x.png',
              callout: {
                content: '等待付款',
                padding: 10,
                fontSize: 16,
                bgColor: '#fff',
                borderColor: '#eee',
                color: '#333',
                borderRadius: 5,
                display: 'ALWAYS'
              }
            }]
          })
        } else if (isStatus == 1) { // 已付款
          that.setData({
            is_hummingbird: true,
            latitude: res.data.data.lat, // 初始化商家位置
            longitude: res.data.data.lng, // 初始化商家位置
            markers: [{ //  商家的位置
              id: '',
              latitude: res.data.data.lat,
              longitude: res.data.data.lng,
              width: 30,
              height: 30,
              iconPath: '/images/map_shop_icon.png',
              callout: {
                content: '商家已接单',
                padding: 10,
                fontSize: 16,
                bgColor: '#fff',
                borderColor: '#eee',
                color: '#333',
                borderRadius: 5,
                display: 'ALWAYS'
              }
            }]
          })
        } else if (isStatus == 2) { // 配送中

          if (isFengniao) {
            switch (FengniaoStatus) {
              case 1:
                that.setData({
                  is_hummingbird: true,
                  latitude: res.data.data.lat, // 初始化商家位置
                  longitude: res.data.data.lng, // 初始化商家位置
                  markers: [
                    { //  商家的位置
                      id: 0,
                      latitude: res.data.data.lat,
                      longitude: res.data.data.lng,
                      width: 30,
                      height: 30,
                      iconPath: '/images/map_shop_icon.png',
                      callout: {
                        content: '商家已接单',
                        padding: 10,
                        fontSize: 16,
                        bgColor: '#fff',
                        borderColor: '#eee',
                        color: '#333',
                        borderRadius: 5,
                        display: 'ALWAYS'
                      }
                    },
                    { //  蜂鸟的位置
                      id: 1,
                      latitude: Fengniao.lat,
                      longitude: Fengniao.lng,
                      width: 40,
                      height: 40,
                      iconPath: '/images/diliveryman@2x.png',
                      callout: {
                        content: '蜂鸟已接单',
                        padding: 10,
                        fontSize: 16,
                        bgColor: '#fff',
                        borderColor: '#eee',
                        color: '#333',
                        borderRadius: 5,
                        display: 'ALWAYS'
                      }
                    }
                  ]

                })
                break;
              case 20:
                that.setData({
                  is_hummingbird: true,
                  latitude: res.data.data.lat, // 初始化商家位置
                  longitude: res.data.data.lng, // 初始化商家位置
                  markers: [
                    { //  商家的位置
                      id: 0,
                      latitude: res.data.data.lat,
                      longitude: res.data.data.lng,
                      width: 30,
                      height: 30,
                      iconPath: '/images/map_shop_icon.png',
                      callout: {
                        content: '商家已接单',
                        padding: 10,
                        fontSize: 16,
                        bgColor: '#fff',
                        borderColor: '#eee',
                        color: '#333',
                        borderRadius: 5,
                        display: 'ALWAYS'
                      }
                    },
                    { //  蜂鸟的位置
                      id: 1,
                      latitude: Fengniao.lat,
                      longitude: Fengniao.lng,
                      width: 40,
                      height: 40,
                      iconPath: '/images/diliveryman@2x.png',
                      callout: {
                        content: '已分配骑手',
                        padding: 10,
                        fontSize: 16,
                        bgColor: '#fff',
                        borderColor: '#eee',
                        color: '#333',
                        borderRadius: 5,
                        display: 'ALWAYS'
                      }
                    }]
                })
                break;
              case 80:
                that.setData({
                  is_hummingbird: true,
                  latitude: res.data.data.lat, // 初始化商家位置
                  longitude: res.data.data.lng, // 初始化商家位置
                  markers: [
                    { //  商家的位置
                      id: 0,
                      latitude: res.data.data.lat,
                      longitude: res.data.data.lng,
                      width: 30,
                      height: 30,
                      iconPath: '/images/map_shop_icon.png',
                      callout: {
                        content: '商家已接单',
                        padding: 10,
                        fontSize: 16,
                        bgColor: '#fff',
                        borderColor: '#eee',
                        color: '#333',
                        borderRadius: 5,
                        display: 'ALWAYS'
                      }
                    },
                    { //  商家的位置
                      id: 1,
                      latitude: Fengniao.lat,
                      longitude: Fengniao.lng,
                      width: 40,
                      height: 40,
                      iconPath: '/images/diliveryman@2x.png',
                      callout: {
                        content: '骑手已到店',
                        padding: 10,
                        fontSize: 16,
                        bgColor: '#fff',
                        borderColor: '#eee',
                        color: '#333',
                        borderRadius: 5,
                        display: 'ALWAYS'
                      }
                    }]
                })
                break;
              case 2:
                that.setData({
                  is_hummingbird: true,
                  latitude: res.data.data.address.lat, // 初始化商家位置
                  longitude: res.data.data.address.lng, // 初始化商家位置
                  markers: [
                    { //  商家的位置
                      id: 0,
                      latitude: res.data.data.address.lat,
                      longitude: res.data.data.address.lng,
                      width: 30,
                      height: 30,
                      iconPath: '/images/map_user_icon@2x.png',
                      callout: {
                        content: '待收货',
                        padding: 10,
                        fontSize: 16,
                        bgColor: '#fff',
                        borderColor: '#eee',
                        color: '#333',
                        borderRadius: 5,
                        display: 'ALWAYS'
                      }
                    },
                    { //  蜂鸟的位置
                      id: 1,
                      latitude: Fengniao.lat,
                      longitude: Fengniao.lng,
                      width: 40,
                      height: 40,
                      iconPath: '/images/diliveryman@2x.png',
                      callout: {
                        content: '配送中...',
                        padding: 10,
                        fontSize: 16,
                        bgColor: '#fff',
                        borderColor: '#eee',
                        color: '#333',
                        borderRadius: 5,
                        display: 'ALWAYS'
                      }
                    }]
                })
                break;
              case 3:
                that.setData({
                  is_hummingbird: true,
                  latitude: res.data.data.address.lat, // 初始化商家位置
                  longitude: res.data.data.address.lng, // 初始化商家位置
                  markers: [
                    { //  商家的位置
                      id: 0,
                      latitude: res.data.data.address.lat,
                      longitude: res.data.data.address.lng,
                      width: 30,
                      height: 30,
                      iconPath: '/images/map_user_icon@2x.png',
                      callout: {
                        content: '蜂鸟配送已送达',
                        padding: 10,
                        fontSize: 16,
                        bgColor: '#fff',
                        borderColor: '#eee',
                        color: '#333',
                        borderRadius: 5,
                        display: 'ALWAYS'
                      }
                    },
                  ]

                })
                break;
            }
          } else if (isDada) {
            if (DadaStatus) {
              that.setData({
                is_dada: true,
                latitude: res.data.data.lat, // 初始化商家位置
                longitude: res.data.data.lng, // 初始化商家位置
                markers: [{ //  商家的位置
                  id: 0,
                  latitude: res.data.data.lat, // 初始化商家位置
                  longitude: res.data.data.lng, // 初始化商家位置
                  width: 30,
                  height: 30,
                  iconPath: '/images/map_shop_icon.png',
                  callout: {
                    content: "商家已发货",
                    padding: 10,
                    fontSize: 16,
                    bgColor: '#fff',
                    borderColor: '#eee',
                    color: '#333',
                    borderRadius: 5,
                    display: 'ALWAYS'
                  },
                },
                { //  dada
                  id: 1,
                  latitude: Dada.transporterLat,
                  longitude: Dada.transporterLng,
                  width: 40,
                  height: 40,
                  iconPath: '/images/diliveryman@2x.png',
                  callout: {
                    content: Dada.statusMsg,
                    padding: 10,
                    fontSize: 16,
                    bgColor: '#fff',
                    borderColor: '#eee',
                    color: '#333',
                    borderRadius: 5,
                    display: 'ALWAYS'
                  },
                },
                  { //  商家的位置
                    id: 2,
                    latitude: res.data.data.address.lat,
                    longitude: res.data.data.address.lng,
                    width: 30,
                    height: 30,
                    iconPath: '/images/map_user_icon@2x.png',
                    callout: {
                      content: '待收货',
                      padding: 10,
                      fontSize: 16,
                      bgColor: '#fff',
                      borderColor: '#eee',
                      color: '#333',
                      borderRadius: 5,
                      display: 'ALWAYS'
                    }
                  }
                ],
              })
            }

          } else {
            that.setData({
              is_hummingbird: false,
              is_merchant: true,
              merchant_title: '商家正在配送'
            })
          }
        } else if ((isOrderType == 1 && isStatus == 3) || (isOrderType == 2 && isStatus == 4)) {
          that.setData({
            is_hummingbird: false,
            is_merchant: true,
            merchant_title: '订单待退款',
            merchant_desc: '请您耐心等待商家确认'
          })
        } else if ((isOrderType == 1 && isStatus == 4) || (isOrderType == 2 && isStatus == 5)) {
          that.setData({
            is_hummingbird: false,
            is_merchant: true,
            merchant_title: '退款完成',
            merchant_desc: '3-5个工作日到账'
          })
        } else {
          // if (isFengniao) {
          //   that.setData({
          //     is_hummingbird: true,
          //     latitude: res.data.data.lat, // 初始化商家位置
          //     longitude: res.data.data.lng, // 初始化商家位置
          //     markers: [{ //  商家的位置
          //       id: '',
          //       latitude: res.data.data.lat,
          //       longitude: res.data.data.lng,
          //       width: 40,
          //       height: 40,
          //       iconPath: '../../../../images/diliveryman@2x.png',
          //       callout: {
          //         content: '蜂鸟配送已完成 >',
          //         padding: 10,
          //         fontSize: 16,
          //         bgColor: '#fff',
          //         borderColor: '#eee',
          //         color: '#333',
          //         borderRadius: 5,
          //         display: 'ALWAYS'
          //       }
          //     }]

          //   })
          // } else {
          that.setData({
            is_hummingbird: false,
            is_merchant: true,
            merchant_title: '订单已完成',
            merchant_desc: ' '
          })
          // }
        }
      }
    })
  },

  // 取消订单
  cancelOrder: function(e) {
    var that = this;
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
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
              var pages = getCurrentPages();
              var prevPage = pages[pages.length - 2];
              wx.navigateBack({
                delta: 1,
                success: function() {
                  prevPage.onLoad()
                }
              })
            }
          })
        }
      }
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
            url: '../../../home/shopDetails/confirmOrder/confirmClearing/confirmClearing?orderID=' + e.currentTarget.dataset.orderid + "&gradeid=" + e.currentTarget.dataset.gradeid + "&ordertype=" + e.currentTarget.dataset.ordertype + "&shopCart=" + JSON.stringify(e.currentTarget.dataset.shopCart) + "&orderList=" + JSON.stringify(that.data.orderList) + "&addrID=" + that.data.addrID + "&isshoporder=" + e.currentTarget.dataset.isshoporder,
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
            url: '../../../home/shopDetails/confirmOrder/confirmClearing/confirmClearing?orderID=' + e.currentTarget.dataset.orderid + "&gradeid=" + e.currentTarget.dataset.gradeid + "&shopCart=" + JSON.stringify(that.data.shopCart) + "&addrID=" + that.data.addrID + "&orderList=" + JSON.stringify(that.data.orderList) + "&addrID=" + that.data.addrID + "&isshoporder=" + e.currentTarget.dataset.isshoporder,
          })
        },
        fail: function(res) {},
        complete: function(res) {},
      })
    }

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
              var pages = getCurrentPages();
              var prevPage = pages[pages.length - 2];
              wx.navigateBack({
                delta: 1,
                success: function() {
                  prevPage.onLoad()
                }
              })
            }
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
              var pages = getCurrentPages();
              var prevPage = pages[pages.length - 2];
              wx.navigateBack({
                delta: 1,
                success: function() {
                  prevPage.onLoad()
                }
              })
            }
          })

        }
      }
    })

  },

  // 拨打电话
  callPhone: function(e) {
    var that = this;
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  },

  // 退款详情
  refundTrack: function(e) {
    wx.navigateTo({
      url: '../productRefund/productRefund?orderID=' + e.currentTarget.dataset.orderid + "&orderType=" + e.currentTarget.dataset.ordertype,
    })
  },

  // 去评价
  appraise: function(e) {
    var that = this;

    wx.navigateTo({
      url: './../appraise/appraise?order_id=' + e.currentTarget.dataset.orderid + "&type=" + e.currentTarget.dataset.ordertype + "&appraise=" + e.currentTarget.dataset.appraise,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    });
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
              var pages = getCurrentPages();
              var prevPage = pages[pages.length - 2];
              wx.navigateBack({
                delta: 1,
                success: function() {
                  prevPage.onLoad()
                }
              })
            }
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

  // 订单轨迹
  orderTrac: function(e) {
    var that = this;
    that.setData({
      trac_show: true,
    })
    wx.request({
      url: getApp().globalData.url + that.data.orderTrackAPI,
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
        var orderTrackData = res.data.data;

        for (var i = 0; i < orderTrackData.length; i++) {
          orderTrackData[i].create_time = timestampToTime2(orderTrackData[i].create_time)
        }

        that.setData({
          orderTrack: orderTrackData
        })
      }
    })

  },

  closeHide: function() {
    var that = this;
    that.setData({
      trac_show: false,
    })
  },

  // 加载是否显示查看更多
  loadIndex: function(obj) {
    var that = this;
    if (obj.goods.length > 3) {
      that.setData({
        more_index: true,
      })
    }
  },

  // 点击查看更多
  moreIndex: function(e) {
    var that = this;
    if (e.currentTarget.dataset.index > 3) {
      that.setData({
        more_index: false,
        min_index: false,
        max_index: true,
      })
    }
  },

  // 跳转到商店
  shopsJump: function(e) {
    if (e.currentTarget.dataset.ordertype == 1) {
      wx.navigateTo({
        url: '../../../home/shopDetails/shopDetails?shopID=' + e.currentTarget.dataset.shopid + "&gradeid=" + 15,
      })
    } else {
      wx.navigateTo({
        url: '../../../home/shopDetails/shopDetails?shopID=' + e.currentTarget.dataset.shopid,
      })
    }

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
              var pages = getCurrentPages();
              var prevPage = pages[pages.length - 2];
              wx.navigateBack({
                delta: 1,
                success: function() {
                  prevPage.onLoad()
                }
              })
            }
          })
        }
      }
    })
  },


})