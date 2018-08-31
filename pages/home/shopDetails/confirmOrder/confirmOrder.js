// pages/home/shopDetails/confirmOrder/confirmOrder.js

Page({
  /**
   * 页面的初始数据
   */
  data: {
    shopGoodsAPI: '/api/buygreens/order',
    mallGoodesAPI: '/api/mall/order',
    windowHeight: '',
    shopName: '',
    shopID: '',
    gradeid: '',
    sinceMoney: '',
    casing_price: 0,
    imgUrls: '',
    storeReduceImg: '',
    storeAddImg: '',
    deleteImg: '',
    shopCartImg: '',
    shopCart: [],
    logistics: '',
    orderList: [],
    addrID: '',
    shopPayAPI: '/api/buygreens/get_pay_info',
    mallPayAPI: '/api/mall/get_pay_info',
    isGetAddr: '',
    isConfirmClearing: false
  },
  //减少商品
  subtractionGoods: function (e) {
    var that = this;
    var shopCart = this.data.shopCart;
    var shopCartPrice = this.data.shopCartPrice;
    var shopCartNum = this.data.shopCartNum;
    var casing_price = this.data.casing_price;
    var nums;
    if (that.data.gradeid == 15) {
      for (var i = 0; i < shopCart.length; i++) {
        if (shopCart[i].is_attr == 1) {
          if (shopCart[i].attr_id == e.currentTarget.dataset.id.attr_id) {
            // if (shopCart[i].buy_num == 1) {
            //   return false;
            // } else {
            shopCart[i].buy_num -= 1;
            shopCartNum -= 1;
            shopCartPrice -= shopCart[i].price;
            casing_price -= shopCart[i].casing_price;
            if (shopCart[i].buy_num == 0) {
              shopCart.splice(i, 1);
            }
            this.setData({
              shopCart: shopCart,
              shopCartNum: shopCartNum,
              shopCartPrice: shopCartPrice,
              casing_price: casing_price
            });
            // }
          };
        } else if (shopCart[i].product_id == e.currentTarget.dataset.id.product_id) {
          // if (shopCart[i].buy_num == 1) {
          //   return false;
          // } else {
          shopCart[i].buy_num -= 1;
          shopCartNum -= 1;
          shopCartPrice -= shopCart[i].price;
          // casing_price = parseInt(casing_price) - shopCart[i].casing_price / 100.00;
          if (shopCart[i].buy_num == 0) {
            shopCart.splice(i, 1);
          }
          console.log(shopCart);
          this.setData({
            shopCart: shopCart,
            shopCartNum: shopCartNum,
            shopCartPrice: shopCartPrice,
            // casing_price: casing_price
          });
          // }
        };
      };
    } else {
      for (var i = 0; i < shopCart.length; i++) {
        if (shopCart[i].is_attr == 1) {
          if (shopCart[i].attr_id == e.currentTarget.dataset.id.attr_id) {
            // if (shopCart[i].buy_num == 1) {
            //   return false;
            // } else {
            shopCart[i].buy_num -= 1;
            shopCartNum -= 1;
            shopCartPrice -= shopCart[i].price;
            casing_price -= shopCart[i].casing_price;
            if (shopCart[i].buy_num == 0) {
              shopCart.splice(i, 1);
            }
            this.setData({
              shopCart: shopCart,
              shopCartNum: shopCartNum,
              shopCartPrice: shopCartPrice,
              casing_price: casing_price
            });
            // }

          };
        } else if (shopCart[i].goods_id == e.currentTarget.dataset.id.goods_id) {
          // if (shopCart[i].buy_num == 1) {
          //   return false;
          // } else {
          shopCart[i].buy_num -= 1;
          shopCartNum -= 1;
          shopCartPrice -= shopCart[i].price;
          casing_price -= shopCart[i].casing_price;
          if (shopCart[i].buy_num == 0) {
            shopCart.splice(i, 1);
          }
          this.setData({
            shopCart: shopCart,
            shopCartNum: shopCartNum,
            shopCartPrice: shopCartPrice,
            casing_price: casing_price
          });
          // }
        };
      };
    }
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    prevPage.shopCartSubtraction(e);
    prevPage.isShopCart();
  },
  // 添加商品
  addGoods: function (e) {
    var that = this;
    var shopCart = this.data.shopCart;
    var shopCartPrice = this.data.shopCartPrice;
    var shopCartNum = this.data.shopCartNum;
    var casing_price = this.data.casing_price;
    if (that.data.gradeid == 15) {
      for (var i = 0; i < shopCart.length; i++) {
        if (shopCart[i].is_attr == 1) {
          if (shopCart[i].attr_id == e.currentTarget.dataset.id.attr_id) {
            if (shopCart[i].is_seckill == 1) {
              wx.showToast({
                title: '超出限购',
              })
              return false;
            } else {
              shopCart[i].buy_num += 1;
              shopCartNum += 1;
              shopCartPrice += shopCart[i].price;
              casing_price += shopCart[i].casing_price;

              this.setData({
                shopCart: shopCart,
                shopCartNum: shopCartNum,
                shopCartPrice: shopCartPrice,
                casing_price: casing_price
              });
            }

          };

        } else if (shopCart[i].product_id == e.currentTarget.dataset.id.product_id) {
          if (shopCart[i].is_seckill == 1) {
            wx.showToast({
              title: '超出限购',
            })
            return false;
          } else {
            shopCart[i].buy_num += 1;
            console.log(shopCart[i]);
            shopCartNum += 1;
            shopCartPrice += shopCart[i].price;
            // casing_price = parseInt(casing_price) + shopCart[i].casing_price;
            this.setData({
              shopCart: shopCart,
              shopCartNum: shopCartNum,
              shopCartPrice: shopCartPrice,
              // casing_price: casing_price
            });
          }
        };
      };
    } else {
      for (var i = 0; i < shopCart.length; i++) {
        if (shopCart[i].is_attr == 1) {
          if (shopCart[i].attr_id == e.currentTarget.dataset.id.attr_id) {
            if (shopCart[i].is_seckill == 1) {
              wx.showToast({
                title: '超出限购',
              })
              return false;
            } else {
              shopCart[i].buy_num += 1;
              shopCartNum += 1;
              shopCartPrice += shopCart[i].price;

              casing_price += shopCart[i].casing_price;
              this.setData({
                shopCart: shopCart,
                shopCartNum: shopCartNum,
                shopCartPrice: shopCartPrice,
                casing_price: casing_price
              });
            }

          };

        } else if (shopCart[i].goods_id == e.currentTarget.dataset.id.goods_id) {
          if (shopCart[i].is_seckill == 1) {
            wx.showToast({
              title: '超出限购',
            })
            return false;
          } else {
            shopCart[i].buy_num += 1;
            console.log(shopCart[i]);
            shopCartNum += 1;
            shopCartPrice += shopCart[i].price;
            console.log('casing_price:', casing_price);
            console.log('shopCart[i].casing_price:', shopCart[i].casing_price);
            casing_price += shopCart[i].casing_price;
            this.setData({
              shopCart: shopCart,
              shopCartNum: shopCartNum,
              shopCartPrice: shopCartPrice,
              casing_price: casing_price
            });
          }
        };
      };
    }
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    prevPage.shopCartAdd(e);
    prevPage.isShopCart();
  },
  //删除商品
  deleteGoods: function (e) {
    var shopCart = this.data.shopCart;
    var shopCartPrice = this.data.shopCartPrice;
    var casing_price = this.data.casing_price;
    if (shopCart.buy_num) {
      shopCartPrice -= shopCart[e.currentTarget.dataset.index].buy_num * shopCart[e.currentTarget.dataset.index].price;
      casing_price -= shopCart[e.currentTarget.dataset.index].buy_num * shopCart[e.currentTarget.dataset.index].casing_price / 100.00;
      var num = shopCart[e.currentTarget.dataset.index].buy_num;
      shopCart.splice(e.currentTarget.dataset.index, 1);
      this.setData({
        shopCart: shopCart,
        shopCartPrice: shopCartPrice,
        casing_price: casing_price
      })
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2];
      for (var i = 0; i < num; i++) {
        prevPage.subtractionGoods(e);
      }
    } else {
      shopCartPrice -= shopCart[e.currentTarget.dataset.index].num * shopCart[e.currentTarget.dataset.index].price;
      casing_price -= shopCart[e.currentTarget.dataset.index].buy_num * shopCart[e.currentTarget.dataset.index].casing_price / 100.00;
      var num = shopCart[e.currentTarget.dataset.index].num;
      shopCart.splice(e.currentTarget.dataset.index, 1);
      this.setData({
        shopCart: shopCart,
        shopCartPrice: shopCartPrice,
        casing_price: casing_price
      })
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2];
    }
  },
  //获取支付信息
  payInfo: function (orderID) {
    var that = this;
    if (this.data.gradeid == 15) {
      wx.request({
        url: getApp().globalData.url + that.data.shopPayAPI,
        data: {
          login_token: wx.getStorageSync('loginToken'),
          order_id: orderID
        },
        header: {
          'content-type': 'application/json'
        },
        method: 'POST',
        dataType: 'json',
        success: function (res) {
          if (res.data.data.address) {
            that.setData({
              orderList: res.data.data,
              addrID: res.data.data.address.id
            });
          } else {

            wx.navigateTo({
              url: './address/address',
            })
            return false;
          }

          wx.navigateTo({
            url: './confirmClearing/confirmClearing?orderID=' + orderID + "&gradeid=" + that.data.gradeid + "&shopCart=" + JSON.stringify(that.data.shopCart) + "&addrID=" + that.data.addrID + "&orderList=" + JSON.stringify(that.data.orderList) + "&addrID=" + that.data.addrID + "&logistics=" + that.data.logistics
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
          order_id: orderID
        },
        header: {
          'content-type': 'application/json'
        },
        method: 'POST',
        dataType: 'json',
        success: function (res) {
          if (res.data.data.address) {
            that.setData({
              orderList: res.data.data,
              addrID: res.data.data.address.id
            });
          } else {

            wx.navigateTo({
              url: './address/address',
            })
            return false;
          }
          wx.navigateTo({
            url: './confirmClearing/confirmClearing?orderID=' + orderID + "&gradeid=" + that.data.gradeid + "&shopCart=" + JSON.stringify(that.data.shopCart) + "&addrID=" + that.data.addrID + "&orderList=" + JSON.stringify(that.data.orderList) + "&addrID=" + that.data.addrID + "&logistics=" + that.data.logistics
          })
        },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
  },
  // 获取收货地址
  getAddr: function () {
    var that = this;
    wx.request({
      url: getApp().globalData.url + '/api/user/list_address',
      data: {
        login_token: wx.getStorageSync('loginToken'),
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      dataType: 'json',
      success: function (res) {
        console.log('地址：', res);
        if (res.data.msg == "暂无数据") {
          if (that.data.isTakeNumber != 1) {
            that.setData({
              isGetAddr: false
            });
          } else {
            that.setData({
              isGetAddr: true
            });
          }
        } else if (res.data.msg == "请先绑定手机") {
          wx.navigateTo({
            url: '../../../bindPhone/bindPhone',
          })
        } else if (res.data.state == 1){
            that.setData({
              isGetAddr: true
            });
        }else{
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
  // 确认结算
  confirmClearing: function () {
    var that = this;
    // if (!that.data.isGetAddr) {
    //   wx.navigateTo({
    //     url: './address/address',
    //   });
    // } else {
      if (this.data.gradeid == 15) {
        var goods = [];
        var shopCart = this.data.shopCart;
        if (shopCart[0].buy_num) {
          for (var i = 0; i < shopCart.length; i++) {
            goods.push({
              "product_id": shopCart[i].product_id ? shopCart[i].product_id : shopCart[i].goods_id,
              "num": shopCart[i].buy_num,
              "attr_id": shopCart[i].attr_id
            });
          }
        } else {
          for (var i = 0; i < shopCart.length; i++) {
            goods.push({
              "product_id": shopCart[i].goods_id,
              "num": shopCart[i].num,
              "attr_id": shopCart[i].attr_id
            });
          }
        }
        var goodsList = {};
        var shopID = this.data.shopID;
        goodsList[shopID] = goods;
        if (!that.data.isConfirmClearing) {
          wx.request({
            url: getApp().globalData.url + this.data.shopGoodsAPI,
            data: {
              login_token: wx.getStorageSync('loginToken'),
              cart_goods: JSON.stringify(goodsList),
              // reserve_table_id: that.data.reserve_table_id
            },
            header: {
              'content-type': 'application/json'
            },
            method: 'POST',
            dataType: 'json',
            success: function (res) {
              console.log('确认结算',res);
              that.setData({
                isConfirmClearing: true
              });
              if (res.data.state == 0) {
                if (res.data.msg == "请先登陆") {
                  wx.navigateTo({
                    url: '../../../login/login',
                  })
                } else if (res.data.msg == "请先绑定手机") {
                  wx.navigateTo({
                    url: '../../../bindPhone/bindPhone',
                  })
                } else {
                  wx.showModal({
                    title: '提示',
                    content: res.data.msg,
                  })
                }
              } else {
                //获取订单信息
                // that.payInfo(res.data.data.order_id);
                wx.navigateTo({
                  url: './confirmClearing/confirmClearing?orderID=' + res.data.data.order_id + "&gradeid=" + that.data.gradeid + "&addrID=" + that.data.addrID + "&addrID=" + that.data.addrID + "&logistics=" + that.data.logistics
                })
              }
            },
            fail: function (res) { },
            complete: function (res) {
              that.setData({
                isConfirmClearing: false
              });
            },
          })
        }
      } else {
        var goods = [];
        var shopCart = this.data.shopCart;
        if (shopCart[0].buy_num) {
          for (var i = 0; i < shopCart.length; i++) {
            goods.push({
              "goods_id": shopCart[i].goods_id,
              "num": shopCart[i].buy_num,
              "attr_id": shopCart[i].attr_id,
              // "is_take_number": that.data.isTakeNumber
            });
          }
        } else {
          for (var i = 0; i < shopCart.length; i++) {
            goods.push({
              "goods_id": shopCart[i].goods_id,
              "num": shopCart[i].num,
              "attr_id": shopCart[i].attr_id,
              // "is_take_number": that.data.isTakeNumber
            });
          }
        }
        var goodsList = {};
        var shopID = this.data.shopID;
        goodsList[shopID] = goods;
        if (!that.data.isConfirmClearing) {
          wx.request({
            url: getApp().globalData.url + this.data.mallGoodesAPI,
            data: {
              login_token: wx.getStorageSync('loginToken'),
              cart_goods: JSON.stringify(goodsList),
              reserve_table_id: that.data.reserve_table_id,
              is_take_number: that.data.isTakeNumber
            },
            header: {
              'content-type': 'application/json'
            },
            method: 'POST',
            dataType: 'json',
            success: function (res) {
              console.log('确认结算', res);
              that.setData({
                isConfirmClearing: true
              });
              if (res.data.state == 0) {
                if (res.data.msg == "请先登陆") {
                  wx.navigateTo({
                    url: '../../../login/login',
                  })
                } else if (res.data.msg == "请先绑定手机") {
                  wx.navigateTo({
                    url: '../../../bindPhone/bindPhone',
                  })
                } else {
                  wx.showModal({
                    title: '提示',
                    content: res.data.msg,
                  })
                }
              } else {
                //获取订单信息
                // that.payInfo(res.data.data.order_id);
                wx.navigateTo({
                  url: './confirmClearing/confirmClearing?orderID=' + res.data.data.order_id + "&gradeid=" + that.data.gradeid + "&addrID=" + that.data.addrID + "&addrID=" + that.data.addrID + "&logistics=" + that.data.logistics + '&isTakeNumber=' + that.data.isTakeNumber
                })
              }
            },
            fail: function (res) { },
            complete: function (res) {
              that.setData({
                isConfirmClearing: false
              });
            },
          })
        }
      }
    // }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var imgUrls = getApp().globalData.imgUrls;
    var storeReduceImg = imgUrls + 'store_reduce@2x.png';
    var storeAddImg = imgUrls + 'store_add@2x.png';
    var deleteImg = imgUrls + 'delete@2x.png';
    var shopCartImg = imgUrls + 'store_cart_sel@2x.png';
    //获取店铺信息
    this.setData({
      shopName: options.shopName,
      shopID: options.shopID,
      sinceMoney: options.sinceMoney,
      imgUrls: imgUrls,
      storeReduceImg: storeReduceImg,
      storeAddImg: storeAddImg,
      deleteImg: deleteImg,
      shopCartImg: shopCartImg,
      shopCartPrice: parseInt(options.shopCartPrice),
      shopCartNum: options.shopCartNum,
      gradeid: options.gradeid,
      logistics: options.logistics,
      casing_price: options.casing_price == null ? 0 : parseInt(options.casing_price),
      reserve_table_id: options.reserve_table_id == null ? '' : options.reserve_table_id,
      isTakeNumber: options.isTakeNumber == null ? '' : options.isTakeNumber
    });
    //获取屏幕高度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight
        })
      },
    })

    var shopCart = JSON.parse(options.shopCart);
    this.setData({
      shopCart: shopCart
    });
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
    this.getAddr()
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