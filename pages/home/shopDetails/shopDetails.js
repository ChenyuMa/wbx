// pages/home/shopDetails/shopDetails.js
var util = require('../../../utils/util.js');
var myMap = new Map();

function timestampToTime(timestamp) {
  var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var D = date.getDate() + ' ';
  var h = date.getHours() + ':';
  var m = date.getMinutes() + ':';
  var s = date.getSeconds();
  return Y + M + D + h + m + s;
}

// 添加购物车
var request_addCart = function(API, goodsID, type, shopID, num, attrID) {
  wx.request({
    url: getApp().globalData.url + API,
    data: {
      login_token: wx.getStorageSync('loginToken'),
      goods_id: goodsID,
      type: type,
      shop_id: shopID,
      num: num,
      attr_id: attrID
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
};

Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight: '',
    shopID: '',
    gradeid: '',
    shopGoodsAPI: '/api/buygreens/get_goods',
    mallGoodesAPI: '/api/shop/get_goods',
    goodsList: [],
    goodsCartList: [],
    curIndex: 0,
    toView: 0,
    titleName: '商品',
    goodsAllList: [],
    shopNum: [],
    isCouponShow: false,
    couponAPI: '/api/coupon/receive_coupon',
    shopCart: [],
    shopCartNum: 0,
    shopCartPrice: 0,
    casing_price: 0,
    isShopCart: false,
    isGoodsDetails: false,
    goodsDetailsList: [],
    imgUrls: getApp().globalData.imgUrls,
    addCardAPI: '/api/goodscart/add_cart',
    // 商家信息显示
    is_shop_info: false,
    // 是否多规格
    is_attr: false,
    goods_attr: [],
    is_select_attr: 0,
    attr_title: '',
    isCancel: 'none',
    goodsAll: [],
    promotionList: [],
    seckillList: [],
    scrollY: true,
    // 显示商家资质
    is_shop_aptitude: false,
    // 显示二维码
    is_shop_qrcode: false,
    is_save_picture: false,
    // 是否预定
    is_setTable: false,
    subscribe: '',
    reserve_table_id: '',
    // 拖拽
    x: 0,
    y: 20,
    // 扫码点餐
    sweepOrder: false,
    seat: '',
    selectNum: '',
    selectRepast: '',
    goodsAllLists: [],
    goods_attr_price: 0,
    // 是否关注
    isFavorites: false,
    userLogin: false,
    // 点击头部
    navSelect: 0,
    // 右边商品滚动
    isRightScroll: false,
    // 是否点餐
    isOrdering: true,
    // 是否评论
    isDiscuss: false,
    evaluationList: [],
    page: 1,
    // 优惠活动
    isFavourable: false,
    // 是否叫号
    is_take_number:''
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
          windowHeight: res.windowHeight,
          x: res.windowWidth - 40
        });
      },
    });

    //获取店铺id
    this.setData({
      shopID: options.shopID,
      gradeid: options.gradeid,
      sweepOrder: options.sweepOrder == null ? '' : options.sweepOrder,
      reserve_table_id: options.reserve_table_id == null ? '' : options.reserve_table_id,
      seat: options.seat == null ? '' : options.seat,
      selectNum: options.selectNum == null ? '' : options.selectNum,
      selectRepast: options.selectRepast == null ? '' : options.selectRepast,
      is_take_number: options.is_take_number == null ? '' : options.is_take_number
    });
    if (options.gradeid == 15) {
      wx.request({
        url: getApp().globalData.url + that.data.shopGoodsAPI,
        data: {
          shop_id: that.data.shopID,
          login_token: wx.getStorageSync('loginToken')
        },
        header: {
          'content-type': 'application/json'
        },
        method: 'POST',
        dataType: 'json',
        success: function(res) {
          console.log('店铺信息：', res);
          var list = res.data.data;
          if (list.shop_detail.is_favorites == 1) {
            that.setData({
              isFavorites: true
            });
          }
          for (var i = 0; i < list.coupon.list.length; i++) {
            list.coupon.list[i].create_time = timestampToTime(list.coupon.list[i].create_time);
            list.coupon.list[i].end_time = timestampToTime(list.coupon.list[i].end_time);
            list.coupon.list[i].start_time = timestampToTime(list.coupon.list[i].start_time);
          }

          that.setData({
            goodsList: list,
            goodsCartList: list,
            goodsAll: list.goods
          });

          var goodsAllList = that.data.goodsAllList;
          for (var j = 0; j < 10; j++) {
            if (j <= list.goods.length - 1) {
              goodsAllList.push(list.goods[j]);
            }
          }
          that.setData({
            goodsAllList: goodsAllList,
          });

          wx.setNavigationBarTitle({
            title: list.shop_detail.shop_name,
          })
        },
        fail: function(res) {},
        complete: function(res) {},
      })
    } else {
      wx.request({
        url: getApp().globalData.url + that.data.mallGoodesAPI,
        data: {
          shop_id: this.data.shopID,
          login_token: wx.getStorageSync('loginToken'),
          is_take_number: that.data.is_take_number
        },
        header: {
          'content-type': 'application/json'
        },
        method: 'POST',
        dataType: 'json',
        success: function(res) {
          console.log('店铺信息：', res);
          if(res.data.state == 0){
            wx.showToast({
              title: res.data.msg,
            })
          }else{
            var list = res.data.data;
            if (list.detail.is_favorites == 1) {
              that.setData({
                isFavorites: true
              });
            }
            for (var i = 0; i < list.coupon.list.length; i++) {
              list.coupon.list[i].create_time = timestampToTime(list.coupon.list[i].create_time);
              list.coupon.list[i].end_time = timestampToTime(list.coupon.list[i].end_time);
              list.coupon.list[i].start_time = timestampToTime(list.coupon.list[i].start_time);
            }
            that.setData({
              goodsList: list,
              goodsCartList: list,
              goodsAll: list.goods
            });

            var goodsAllList = that.data.goodsAllList;
            for (var j = 0; j < 10; j++) {
              if (j <= list.goods.length - 1) {
                goodsAllList.push(list.goods[j]);
              }
            }
            that.setData({
              goodsAllList: goodsAllList,
            });
            wx.setNavigationBarTitle({
              title: list.detail.shop_name,
            })
          }
        },
        fail: function(res) {},
        complete: function(res) {},
      })
    };
  },

  // 查看商家信息
  down_shopInfo: function() {
    var that = this;
    wx.navigateTo({
      url: '../store/store?shopID=' + that.data.shopID + "&gradeid=" + that.data.gradeid,
    })
  },

  // 点击联系商家
  callPhone: function(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.tel,
    })
  },

  // 查看商家资质
  click_aptitude: function() {
    var that = this;
    this.setData({
      is_shop_aptitude: !that.data.is_shop_aptitude,
    });
  },

  close_shop_aptitude: function() {
    var that = this;
    this.setData({
      is_shop_aptitude: !that.data.is_shop_aptitude,
    });
  },

  // 查看商家二维码
  click_qrcode: function() {
    var that = this;
    this.setData({
      is_shop_qrcode: !that.data.is_shop_qrcode
    });
  },

  // 关闭商家二维码
  close_shop_qrcode: function() {
    var that = this;
    this.setData({
      is_shop_qrcode: !that.data.is_shop_qrcode
    });
  },

  // 
  save_picture: function(e) {
    var that = this;
    if (e.timeStamp / 1000 > 3) {
      that.setData({
        is_save_picture: true
      });
    }
  },

  // 收藏店铺
  collectionShop: function(e) {
    var that = this;
    wx.request({
      url: getApp().globalData.url + '/api/index/follow_shop',
      data: {
        login_token: wx.getStorageSync('loginToken'),
        shop_id: that.data.shopID
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        if (res.data.state == 0) {
          if (res.data.msg == '请先登陆') {
            that.setData({
              userLogin: true
            });
          } 
          // else if (res.data.msg == '请先绑定手机') {
          //   wx.navigateTo({
          //     url: '../../bindPhone/bindPhone',
          //   })
          // }
        } else {
          var goodsList = that.data.goodsList;
          if (that.data.gradeid == 15) {
            goodsList.shop_detail.is_favorites = 0;
            that.setData({
              goodsList: goodsList
            });
          } else {
            goodsList.detail.is_favorites = 0;
            that.setData({
              goodsList: goodsList
            });
          }
          that.setData({
            isFavorites: true
          });
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })

  },

  //搜索框
  searchTo: function() {
    var goodsAllList = this.data.goodsAllList;
  },

  // 搜索框搜索
  searchInput: function(e) {
    var that = this;
    if (e.detail.value != '') {
      that.setData({
        isCancel: 'block',
        inputTxt: e.detail.value
      });
    } else{
      that.setData({
        goodsAllList: that.data.goodsAll,
        toView: 0,
        curIndex: 0,
        titleName: '商品',
      });
    }

    //搜索标题
    var goodsAllList = this.data.goodsAllList;
    var value = e.detail.value;
    var searchList = [];
    if (this.data.gradeid == 15) {
      for (var i = 0; i < goodsAllList.length; i++) {
        var str = goodsAllList[i].product_name
        if (e.detail.value != '' && str.indexOf(value) != -1) {
          searchList.push(goodsAllList[i]);
          console.log(searchList);
          that.setData({
            goodsAllList: searchList
          });
        } else if (str.indexOf(value) == -1) {
          // that.setData({
          //   goodsAllList: []
          // });
        }
      }
    } else {
      for (var i = 0; i < goodsAllList.length; i++) {
        var str = goodsAllList[i].title;
        console.log('str',str);
        console.log('!=-1',str.indexOf(value));
        if (e.detail.value != '' && str.indexOf(value) != -1) {
          searchList.push(goodsAllList[i]);
          console.log(searchList);
          that.setData({
            goodsAllList: searchList
          });
        } else if (str.indexOf(value) == -1) {
          // that.setData({
          //   goodsAllList:[]
          // });
        }
      }
    }
  },

  // 清空搜索栏
  cancelTxt: function() {
    var that = this;
    this.setData({
      isCancel: 'none',
      inputTxt: '',
      goodsAllList: that.data.goodsAll
    });
  },

  //点击选择分类
  onClick: function(e) {
    var that = this;
    this.setData({
      toView: e.currentTarget.id,
      curIndex: e.currentTarget.dataset.index,
      titleName: e.currentTarget.dataset.title,
    })
    if (e.currentTarget.id == 0) {
      that.setData({
        goodsAllList: that.data.goodsList.goods
      })
      return false;
    };
    if (e.currentTarget.id == 1) {
      var List = [];
      for (var i = 0; i < that.data.goodsList.goods.length; i++) {
        if (that.data.goodsList.goods[i].sales_promotion_is == 1) {
          List.push(that.data.goodsList.goods[i]);
        }
      }
      that.setData({
        promotionList: List,
        goodsAllList: List
      })
      return false;
    };

    if (e.currentTarget.id == 2) {
      var List = [];
      for (var i = 0; i < that.data.goodsList.goods.length; i++) {
        if (that.data.goodsList.goods[i].is_seckill == 1) {
          List.push(that.data.goodsList.goods[i]);
        }
      }
      that.setData({
        seckillList: List,
        goodsAllList: List
      })
      return false;
    };

    var List = [];
    for (var i = 0; i < that.data.goodsList.goods.length; i++) {
      if (that.data.goodsList.goods[i].cate_id == e.currentTarget.id) {
        List.push(that.data.goodsList.goods[i]);
      }
    }
    this.setData({
      goodsAllList: List
    });
  },

  // 右边触底
  rightTolower: function(e) {
    var goodsAllList = this.data.goodsAllList;
    var goodsList = this.data.goodsList;
    if (goodsAllList.length >= goodsList.goods.length) {
      return false;
    } else if (this.data.curIndex != 0) {
      return false;
    }
    for (var i = 0; i < 50; i++) {
      goodsAllList.push(goodsList.goods[goodsAllList.length]);
      if (goodsAllList.length >= goodsList.goods.length) {
        break;
      };
    }
    this.setData({
      goodsAllList: goodsAllList
    });

  },

  //商品数量添加
  addGoods: function(e) {
    var that = this;
    var goodsList = this.data.goodsList;
    var goodsAllList = this.data.goodsAllList;
    var shopCartPrice = this.data.shopCartPrice;
    var shopCartNum = this.data.shopCartNum;
    var shopCart = this.data.shopCart;
    var casing_price = this.data.casing_price;
    if (wx.getStorageSync('loginToken') != '') {
      if (this.data.gradeid == 15) {
        for (var i = 0; i < goodsList.goods.length; i++) {
          if (goodsList.goods[i].product_id == e.currentTarget.dataset.id.product_id) {

            if (goodsList.goods[i].is_attr == 1) {
              that.setData({
                is_attr: true,
                attr_title: goodsList.goods[i].product_name,
                goods_attr: goodsList.goods[i].goods_attr,
                goods_attr_select: goodsList.goods[i].goods_attr[0],
                goods_attr_list: goodsList.goods[i],
                goods_attr_price: goodsList.goods[i].goods_attr[0].is_seckill == 0 ? goodsList.goods[i].goods_attr[0].sales_promotion_is == 0 ? goodsList.goods[i].goods_attr[0].price : goodsList.goods[i].goods_attr[0].sales_promotion_price : goodsList.goods[i].goods_attr[0].seckill_price
              });
              return false;
            } else {

              if (goodsList.goods[i].buy_num >= 99) {
                return false;
              } else {

                if (goodsList.goods[i].is_seckill == 1 && goodsList.goods[i].buy_num >= goodsList.goods[i].limitations_num) {
                  wx.showToast({
                    title: '超出限购数量',
                  })
                  return false;
                } else if (goodsList.goods[i].is_seckill == 1 && goodsList.goods[i].buy_num >= goodsList.goods[i].seckill_num) {
                  wx.showToast({
                    title: '库存不足',
                  })
                  return false;
                } else if (goodsList.goods[i].is_use_num == 1 && goodsList.goods[i].buy_num >= goodsList.goods[i].inventory_num){
                  wx.showToast({
                    title: '库存不足',
                  })
                  return false;
                } else {
                  for (var k = 0; k < goodsList.menu.length; k++) {
                    if (goodsList.goods[i].cate_id == goodsList.menu[k].cate_id) {
                      goodsList.menu[k].num += 1;
                    }
                  }
                  goodsList.goods[i].buy_num += 1;
                  shopCartNum += 1;
                  shopCartPrice += goodsList.goods[i].is_shop_member == 0 ? goodsList.goods[i].price : goodsList.shop_detail.is_shop_member_user == 0 ? goodsList.goods[i].price : goodsList.goods[i].shop_member_price;

                  for (var j = 0; j < goodsAllList.length; j++) {
                    if (e.currentTarget.dataset.id.product_id == goodsAllList[j].product_id) {
                      goodsAllList[j].buy_num += 1;
                    }
                  }
                  if (that.data.is_take_number != 1){
                    request_addCart(that.data.addCardAPI, goodsList.goods[i].product_id, 1, that.data.shopID, goodsList.goods[i].buy_num, '');
                  }

                  that.setData({
                    goodsList: goodsList,
                    goodsAllList: goodsAllList,
                    shopCartNum: shopCartNum,
                    shopCartPrice: shopCartPrice,
                    casing_price: casing_price
                  });

                  // 添加商品到购物车
                  myMap.set(e.currentTarget.dataset.id.product_id, {
                    'buy_num': goodsList.goods[i].buy_num,
                    'product_id': goodsList.goods[i].product_id,
                    'photo': goodsList.goods[i].photo,
                    'price': goodsList.goods[i].is_shop_member == 0 ? goodsList.goods[i].price : goodsList.shop_detail.is_shop_member_user == 0 ? goodsList.goods[i].price : goodsList.goods[i].shop_member_price,
                    'product_name': goodsList.goods[i].product_name,
                    'is_attr': goodsList.goods[i].is_attr,
                    'is_seckill': goodsList.goods[i].is_seckill,
                    'limitations_num': goodsList.goods[i].limitations_num,
                    'seckill_num': goodsList.goods[i].seckill_num

                  });

                }

              }
            }

          }
        }
      } else {
        for (var i = 0; i < goodsList.goods.length; i++) {
          if (goodsList.goods[i].goods_id == e.currentTarget.dataset.id.goods_id) {
            if (goodsList.goods[i].is_attr == 1) {
              that.setData({
                is_attr: true,
                attr_title: goodsList.goods[i].title,
                goods_attr: goodsList.goods[i].goods_attr,
                goods_attr_select: goodsList.goods[i].goods_attr[0],
                goods_attr_list: goodsList.goods[i],
                goods_attr_price: goodsList.goods[i].goods_attr[0].is_seckill == 0 ? goodsList.goods[i].goods_attr[0].sales_promotion_is == 0 ? goodsList.goods[i].goods_attr[0].mall_price ? goodsList.goods[i].goods_attr[0].mall_price : goodsList.goods[i].goods_attr[0].price : goodsList.goods[i].goods_attr[0].sales_promotion_price : goodsList.goods[i].goods_attr[0].seckill_price,

              });
              return false;
            } else {
              if (goodsList.goods[i].buy_num >= 99) {
                return false;
              } else {
                if (goodsList.goods[i].is_seckill == 1 && goodsList.goods[i].buy_num >= goodsList.goods[i].limitations_num) {
                  wx.showToast({
                    title: '超出限购数量',
                  })
                  return false;
                } else if (goodsList.goods[i].is_seckill == 1 && goodsList.goods[i].buy_num >= goodsList.goods[i].seckill_num) {
                  wx.showToast({
                    title: '库存不足',
                  })
                  return false;
                } else if (goodsList.goods[i].is_use_num == 1 && goodsList.goods[i].buy_num >= goodsList.goods[i].inventory_num){
                  wx.showToast({
                    title: '库存不足',
                  })
                  return false;
                }else {
                  for (var k = 0; k < goodsList.cate.length; k++) {
                    if (goodsList.goods[i].cate_id == goodsList.cate[k].cate_id) {
                      goodsList.cate[k].num += 1;
                    }
                  }
                  console.log(goodsList.goods[i]);
                  goodsList.goods[i].buy_num += 1;
                  shopCartNum += 1;
                  shopCartPrice += goodsList.goods[i].is_shop_member == 0 ? goodsList.goods[i].price : goodsList.detail.is_shop_member_user == 0 ? goodsList.goods[i].price : goodsList.goods[i].shop_member_price;

                  casing_price += goodsList.goods[i].casing_price;

                  for (var j = 0; j < goodsAllList.length; j++) {
                    if (e.currentTarget.dataset.id.goods_id == goodsAllList[j].goods_id) {
                      goodsAllList[j].buy_num += 1;
                    }
                  }

                  if (that.data.is_take_number != 1){
                    request_addCart(that.data.addCardAPI, goodsList.goods[i].goods_id, 2, that.data.shopID, goodsList.goods[i].buy_num, '');
                  }

                  that.setData({
                    goodsList: goodsList,
                    goodsAllList: goodsAllList,
                    shopCartNum: shopCartNum,
                    shopCartPrice: shopCartPrice,
                    casing_price: casing_price
                  });
                  // 添加商品到购物车
                  myMap.set(e.currentTarget.dataset.id.goods_id, {
                    'buy_num': goodsList.goods[i].buy_num,
                    'goods_id': goodsList.goods[i].goods_id,
                    'photo': goodsList.goods[i].photo,
                    'price': goodsList.goods[i].is_shop_member == 0 ? goodsList.goods[i].price : goodsList.detail.is_shop_member_user == 0 ? goodsList.goods[i].price : goodsList.goods[i].shop_member_price,
                    'title': goodsList.goods[i].title,
                    'is_attr': goodsList.goods[i].is_attr,
                    'casing_price': goodsList.goods[i].casing_price,
                    'is_seckill': goodsList.goods[i].is_seckill,
                    'limitations_num': goodsList.goods[i].limitations_num,
                    'seckill_num': goodsList.goods[i].seckill_num
                  });

                }
              }
            }
          }
        }
      }
    } else {
      // wx.navigateTo({
      //   url: '../../login/login',
      // })
      that.setData({
        userLogin: true
      });
    };
  },

  // 关闭商品多规格
  close_attr: function() {
    this.setData({
      is_attr: false,
      is_select_attr: 0
    });
  },

  // 多规格商品选择
  select_goods_attr: function(e) {
    var that = this;
    var goods_attr_list = this.data.goods_attr_list;
    var index = e.currentTarget.dataset.index;
    this.setData({
      is_select_attr: e.currentTarget.dataset.index,
      goods_attr_select: that.data.goods_attr[e.currentTarget.dataset.index],
      goods_attr_price: goods_attr_list.goods_attr[index].is_seckill == 0 ? goods_attr_list.goods_attr[index].sales_promotion_is == 0 ? goods_attr_list.goods_attr[index].mall_price ? goods_attr_list.goods_attr[index].mall_price : goods_attr_list.goods_attr[index].price : goods_attr_list.goods_attr[index].sales_promotion_price : goods_attr_list.goods_attr[index].seckill_price
    });
  },

  // 商品多规格加
  addGoods_attr: function(e) {
    var that = this;
    var attr_select = e.currentTarget.dataset.attr_select ? e.currentTarget.dataset.attr_select : e.currentTarget.dataset.id;
    var goods_attr = this.data.goods_attr;
    var goods_attr_select = this.data.goods_attr_select;
    var goodsList = this.data.goodsList;
    var goodsAllList = this.data.goodsAllList;
    var shopCartNum = this.data.shopCartNum;
    var shopCartPrice = this.data.shopCartPrice;
    var casing_price = this.data.casing_price;
    if (this.data.gradeid == 15) {
      for (var i = 0; i < goodsList.goods.length; i++) {
        if (goodsList.goods[i].product_id == attr_select.goods_id) {
          for (var j = 0; j < goodsList.goods[i].goods_attr.length; j++) {
            if (goodsList.goods[i].goods_attr[j].attr_id == attr_select.attr_id) {
              if (goodsList.goods[i].goods_attr[j].is_seckill == 1 && goodsList.goods[i].goods_attr[j].attr_buy_num >= goodsList.goods[i].goods_attr[j].limitations_num) {
                wx.showToast({
                  title: '超出限购数量',
                })
                return false;
              } else if (goodsList.goods[i].goods_attr[j].is_seckill == 1 && goodsList.goods[i].goods_attr[j].attr_buy_num >= goodsList.goods[i].goods_attr[j].seckill_num) {
                wx.showToast({
                  title: '库存不足',
                })
                return false;
              } else if (goodsList.goods[i].is_use_num == 1 && goodsList.goods[i].goods_attr[j].attr_buy_num >= goodsList.goods[i].goods_attr[j].inventory_num) {
                wx.showToast({
                  title: '库存不足',
                })
                return false;
              }else {
                if (goodsList.goods[i].goods_attr[j].attr_buy_num >= 99) {
                  return false;
                } else {

                  for (var l = 0; l < goodsList.menu.length; l++) {
                    if (goodsList.goods[i].cate_id == goodsList.menu[l].cate_id) {
                      goodsList.menu[l].num += 1;
                    }
                  }
                  goodsList.goods[i].buy_num += 1;
                  goodsList.goods[i].goods_attr[j].attr_buy_num += 1;
                  goodsList.goods[i].buy_num += 1;
                  shopCartNum += 1;
                  shopCartPrice += goodsList.goods[i].goods_attr[j].is_shop_member == 0 ? goodsList.goods[i].goods_attr[j].is_seckill == 0 ? goodsList.goods[i].goods_attr[j].sales_promotion_is == 0 ? goodsList.goods[i].goods_attr[j].price : goodsList.goods[i].goods_attr[j].sales_promotion_price : goodsList.goods[i].goods_attr[j].seckill_price : goodsList.shop_detail.is_shop_member_user == 0 ? goodsList.goods[i].goods_attr[j].price : goodsList.goods[i].goods_attr[j].shop_member_price;

                  if (that.data.is_take_number != 1){
                    request_addCart(that.data.addCardAPI, goodsList.goods[i].product_id, 1, that.data.shopID, goodsList.goods[i].buy_num, attr_select.attr_id);
                  }

                  myMap.set(attr_select.attr_id, {
                    'buy_num': goodsList.goods[i].goods_attr[j].attr_buy_num,
                    'goods_id': goodsList.goods[i].product_id,
                    'attr_id': goodsList.goods[i].goods_attr[j].attr_id,
                    'photo': goodsList.goods[i].photo,
                    'product_name': goodsList.goods[i].product_name + '(' + goodsList.goods[i].goods_attr[j].attr_name + ')',
                    'price': goodsList.goods[i].goods_attr[j].is_shop_member == 0 ? goodsList.goods[i].goods_attr[j].is_seckill == 0 ? goodsList.goods[i].goods_attr[j].sales_promotion_is == 0 ? goodsList.goods[i].goods_attr[j].price : goodsList.goods[i].goods_attr[j].sales_promotion_price : goodsList.goods[i].goods_attr[j].seckill_price : goodsList.shop_detail.is_shop_member_user == 0 ? goodsList.goods[i].goods_attr[j].price : goodsList.goods[i].goods_attr[j].shop_member_price,
                    'is_attr': goodsList.goods[i].is_attr,
                    'is_seckill': goodsList.goods[i].goods_attr[j].is_seckill,
                    'limitations_num': goodsList.goods[i].goods_attr[j].limitations_num,
                    'seckill_num': goodsList.goods[i].goods_attr[j].seckill_num
                  });

                  for (var g = 0; g < goodsAllList.length; g++) {
                    if (goodsAllList[g].product_id == attr_select.goods_id) {
                      goodsAllList[g].buy_num += 1;
                    }
                  }

                  for (var k = 0; k < goods_attr.length; k++) {
                    if (goods_attr[k].attr_id == goods_attr_select.attr_id) {
                      goods_attr_select.attr_buy_num += 1;
                      goods_attr[k].attr_buy_num += 1;
                    }
                  }

                  that.setData({
                    goodsList: goodsList,
                    goodsAllList: goodsAllList,
                    goods_attr: goods_attr,
                    goods_attr_select: goods_attr_select,
                    shopCartNum: shopCartNum,
                    shopCartPrice: shopCartPrice,
                    // casing_price: casing_price
                  });

                }

              }

            }
          }
        }
      }

    } else {
      for (var i = 0; i < goodsList.goods.length; i++) {
        if (goodsList.goods[i].goods_id == attr_select.goods_id) {
          for (var j = 0; j < goodsList.goods[i].goods_attr.length; j++) {
            if (goodsList.goods[i].goods_attr[j].attr_id == attr_select.attr_id) {
              if (goodsList.goods[i].goods_attr[j].is_seckill == 1 && goodsList.goods[i].goods_attr[j].attr_buy_num >= goodsList.goods[i].goods_attr[j].limitations_num) {
                wx.showToast({
                  title: '超出秒杀数量',
                })
                return false;
              } else if (goodsList.goods[i].goods_attr[j].is_seckill == 1 && goodsList.goods[i].goods_attr[j].attr_buy_num >= goodsList.goods[i].goods_attr[j].seckill_num) {
                wx.showToast({
                  title: '库存不足',
                })
                return false;
              } else if (goodsList.goods[i].is_use_num == 1 && goodsList.goods[i].goods_attr[j].attr_buy_num >= goodsList.goods[i].goods_attr[j].inventory_num){
                wx.showToast({
                  title: '库存不足',
                })
                return false;
              }else {
                if (goodsList.goods[i].goods_attr[j].attr_buy_num >= 99) {
                  return false;
                } else {
                  console.log(goodsList.goods[i]);
                  for (var l = 0; l < goodsList.cate.length; l++) {
                    if (goodsList.goods[i].cate_id == goodsList.cate[l].cate_id) {
                      goodsList.cate[l].num += 1;
                    }
                  }
                  goodsList.goods[i].buy_num += 1;
                  goodsList.goods[i].goods_attr[j].attr_buy_num += 1;
                  shopCartNum += 1;
                  shopCartPrice += goodsList.goods[i].goods_attr[j].is_shop_member == 0 ? goodsList.goods[i].goods_attr[j].is_seckill == 0 ? goodsList.goods[i].goods_attr[j].sales_promotion_is == 0 ? goodsList.goods[i].goods_attr[j].mall_price ? goodsList.goods[i].goods_attr[j].mall_price : goodsList.goods[i].goods_attr[j].price : goodsList.goods[i].goods_attr[j].sales_promotion_price : goodsList.goods[i].goods_attr[j].seckill_price : goodsList.detail.is_shop_member_user == 0 ? goodsList.goods[i].goods_attr[j].mall_price ? goodsList.goods[i].goods_attr[j].mall_price : goodsList.goods[i].goods_attr[j].price : goodsList.goods[i].goods_attr[j].shop_member_price;
                  if (that.data.is_take_number != 1){
                    request_addCart(that.data.addCardAPI, goodsList.goods[i].goods_id, 2, that.data.shopID, goodsList.goods[i].buy_num, attr_select.attr_id);
                  }
                  
                  for (var k = 0; k < goods_attr.length; k++) {
                    if (goods_attr[k].attr_id == goods_attr_select.attr_id) {
                      goods_attr_select.attr_buy_num += 1;
                      goods_attr[k].attr_buy_num += 1;
                      casing_price += goods_attr[k].casing_price;
                    }
                  }
                  myMap.set(attr_select.attr_id, {
                    'buy_num': goodsList.goods[i].goods_attr[j].attr_buy_num,
                    'goods_id': goodsList.goods[i].goods_id,
                    'attr_id': goodsList.goods[i].goods_attr[j].attr_id,
                    'photo': goodsList.goods[i].photo,
                    'title': goodsList.goods[i].title + '(' + goodsList.goods[i].goods_attr[j].attr_name + ')',
                    'price': goodsList.goods[i].goods_attr[j].is_shop_member == 0 ? goodsList.goods[i].goods_attr[j].is_seckill == 0 ? goodsList.goods[i].goods_attr[j].sales_promotion_is == 0 ? goodsList.goods[i].goods_attr[j].mall_price ? goodsList.goods[i].goods_attr[j].mall_price : goodsList.goods[i].goods_attr[j].price : goodsList.goods[i].goods_attr[j].sales_promotion_price : goodsList.goods[i].goods_attr[j].seckill_price : goodsList.detail.is_shop_member_user == 0 ? goodsList.goods[i].goods_attr[j].mall_price ? goodsList.goods[i].goods_attr[j].mall_price : goodsList.goods[i].goods_attr[j].price : goodsList.goods[i].goods_attr[j].shop_member_price,
                    'is_attr': goodsList.goods[i].is_attr,
                    // 'casing_price': casing_price,
                    'casing_price': goodsList.goods[i].goods_attr[j].casing_price,
                    'is_seckill': goodsList.goods[i].goods_attr[j].is_seckill,
                    'limitations_num': goodsList.goods[i].goods_attr[j].limitations_num,
                    'seckill_num': goodsList.goods[i].goods_attr[j].seckill_num
                  });
                  for (var g = 0; g < goodsAllList.length; g++) {
                    if (goodsAllList[g].goods_id == attr_select.goods_id) {
                      goodsAllList[g].buy_num += 1;
                    }
                  }
                  that.setData({
                    goodsList: goodsList,
                    goodsAllList: goodsAllList,
                    goods_attr: goods_attr,
                    goods_attr_select: goods_attr_select,
                    shopCartNum: shopCartNum,
                    shopCartPrice: shopCartPrice,
                    casing_price: casing_price
                  });
                }
              }
            }
          }
        }
      }
    };
  },

  // 商品多规格减
  subtractionGoods_attr: function(e) {
    var that = this;
    var attr_select = e.currentTarget.dataset.attr_select ? e.currentTarget.dataset.attr_select : e.currentTarget.dataset.id;
    var goods_attr = this.data.goods_attr;
    var goods_attr_select = this.data.goods_attr_select;
    var goodsList = this.data.goodsList;
    var goodsAllList = this.data.goodsAllList;
    var shopCartNum = this.data.shopCartNum;
    var shopCartPrice = this.data.shopCartPrice;
    var casing_price = this.data.casing_price;

    if (e.currentTarget.dataset.attr_select ? e.currentTarget.dataset.attr_select.attr_buy_num == 0 : e.currentTarget.dataset.id.attr_buy_num == 0) {
      return false;
    } else {
      if (this.data.gradeid == 15) {
        for (var i = 0; i < goodsList.goods.length; i++) {
          if (goodsList.goods[i].product_id == attr_select.goods_id) {
            for (var j = 0; j < goodsList.goods[i].goods_attr.length; j++) {
              if (goodsList.goods[i].goods_attr[j].attr_id == attr_select.attr_id) {
                for (var l = 0; l < goodsList.menu.length; l++) {
                  if (goodsList.goods[i].cate_id == goodsList.menu[l].cate_id) {
                    goodsList.menu[l].num -= 1;
                  }
                }
                goodsList.goods[i].buy_num -= 1;
                goodsList.goods[i].goods_attr[j].attr_buy_num -= 1;
                shopCartNum -= 1;
                shopCartPrice -= goodsList.goods[i].goods_attr[j].is_shop_member == 0 ? goodsList.goods[i].goods_attr[j].is_seckill == 0 ? goodsList.goods[i].goods_attr[j].sales_promotion_is == 0 ? goodsList.goods[i].goods_attr[j].price : goodsList.goods[i].goods_attr[j].sales_promotion_price : goodsList.goods[i].goods_attr[j].seckill_price : goodsList.shop_detail.is_shop_member_user == 0 ? goodsList.goods[i].goods_attr[j].price : goodsList.goods[i].goods_attr[j].shop_member_price;
                if (that.data.is_take_number != 1){
                  request_addCart(that.data.addCardAPI, goodsList.goods[i].product_id, 1, that.data.shopID, goodsList.goods[i].buy_num, attr_select.attr_id);
                }
                
                for (var k = 0; k < goods_attr.length; k++) {
                  if (goods_attr[k].attr_id == goods_attr_select.attr_id) {
                    goods_attr_select.attr_buy_num -= 1;
                    goods_attr[k].buy_num -= 1;
                  }
                }
                if (goodsList.goods[i].goods_attr[j].attr_buy_num == 0) {
                  myMap.delete(attr_select.attr_id);
                } else {
                  myMap.set(attr_select.attr_id, {
                    'buy_num': goodsList.goods[i].goods_attr[j].attr_buy_num,
                    'goods_id': goodsList.goods[i].product_id,
                    'attr_id': goodsList.goods[i].goods_attr[j].attr_id,
                    'photo': goodsList.goods[i].photo,
                    'product_name': goodsList.goods[i].product_name + '(' + goodsList.goods[i].goods_attr[j].attr_name + ')',
                    'price': goodsList.goods[i].goods_attr[j].is_shop_member == 0 ? goodsList.goods[i].goods_attr[j].is_seckill == 0 ? goodsList.goods[i].goods_attr[j].sales_promotion_is == 0 ? goodsList.goods[i].goods_attr[j].price : goodsList.goods[i].goods_attr[j].sales_promotion_price : goodsList.goods[i].goods_attr[j].seckill_price : goodsList.shop_detail.is_shop_member_user == 0 ? goodsList.goods[i].goods_attr[j].price : goodsList.goods[i].goods_attr[j].shop_member_price,
                    'is_attr': goodsList.goods[i].is_attr
                  });
                }
              }
            }
          }
        }
        for (var g = 0; g < goodsAllList.length; g++) {
          if (goodsAllList[g].product_id == attr_select.goods_id) {
            goodsAllList[g].buy_num -= 1;
          }
        }
        that.setData({
          goodsList: goodsList,
          goodsAllList: goodsAllList,
          goods_attr: goods_attr,
          goods_attr_select: goods_attr_select,
          shopCartNum: shopCartNum,
          shopCartPrice: shopCartPrice,
          casing_price: casing_price
        });
      } else {
        for (var i = 0; i < goodsList.goods.length; i++) {
          if (goodsList.goods[i].goods_id == attr_select.goods_id) {
            for (var j = 0; j < goodsList.goods[i].goods_attr.length; j++) {
              if (goodsList.goods[i].goods_attr[j].attr_id == attr_select.attr_id) {
                // 角标减
                for (var l = 0; l < goodsList.cate.length; l++) {
                  if (goodsList.goods[i].cate_id == goodsList.cate[l].cate_id) {
                    goodsList.cate[l].num -= 1;
                  }
                }
                goodsList.goods[i].buy_num -= 1; //当前商品数量
                goodsList.goods[i].goods_attr[j].attr_buy_num -= 1; //当前多规格商品数量
                shopCartNum -= 1;
                shopCartPrice -= goodsList.goods[i].goods_attr[j].is_shop_member == 0 ? goodsList.goods[i].goods_attr[j].is_seckill == 0 ? goodsList.goods[i].goods_attr[j].sales_promotion_is == 0 ? goodsList.goods[i].goods_attr[j].mall_price ? goodsList.goods[i].goods_attr[j].mall_price : goodsList.goods[i].goods_attr[j].price : goodsList.goods[i].goods_attr[j].sales_promotion_price : goodsList.goods[i].goods_attr[j].seckill_price : goodsList.detail.is_shop_member_user == 0 ? goodsList.goods[i].goods_attr[j].mall_price ? goodsList.goods[i].goods_attr[j].mall_price : goodsList.goods[i].goods_attr[j].price : goodsList.goods[i].goods_attr[j].shop_member_price;
                if (that.data.is_take_number != 1){
                  request_addCart(that.data.addCardAPI, goodsList.goods[i].goods_id, 2, that.data.shopID, goodsList.goods[i].buy_num, attr_select.attr_id);
                }
                for (var k = 0; k < goods_attr.length; k++) {
                  if (goods_attr[k].attr_id == goods_attr_select.attr_id) {
                    goods_attr_select.attr_buy_num -= 1;
                    goods_attr[k].attr_buy_num -= 1;
                    casing_price -= goods_attr[k].casing_price;
                  }
                }
                if (goodsList.goods[i].goods_attr[j].attr_buy_num == 0) {
                  myMap.delete(attr_select.attr_id);
                } else {
                  myMap.set(attr_select.attr_id, {
                    'buy_num': goodsList.goods[i].goods_attr[j].attr_buy_num,
                    'goods_id': goodsList.goods[i].goods_id,
                    'attr_id': goodsList.goods[i].goods_attr[j].attr_id,
                    'photo': goodsList.goods[i].photo,
                    'title': goodsList.goods[i].title + '(' + goodsList.goods[i].goods_attr[j].attr_name + ')',
                    'price': goodsList.goods[i].goods_attr[j].is_shop_member == 0 ? goodsList.goods[i].goods_attr[j].is_seckill == 0 ? goodsList.goods[i].goods_attr[j].sales_promotion_is == 0 ? goodsList.goods[i].goods_attr[j].mall_price ? goodsList.goods[i].goods_attr[j].mall_price : goodsList.goods[i].goods_attr[j].price : goodsList.goods[i].goods_attr[j].sales_promotion_price : goodsList.goods[i].goods_attr[j].seckill_price : goodsList.detail.is_shop_member_user == 0 ? goodsList.goods[i].goods_attr[j].mall_price ? goodsList.goods[i].goods_attr[j].mall_price : goodsList.goods[i].goods_attr[j].price : goodsList.goods[i].goods_attr[j].shop_member_price,
                    'is_attr': goodsList.goods[i].is_attr,
                    'casing_price': goodsList.goods[i].goods_attr[j].casing_price
                  });
                }
                for (var g = 0; g < goodsAllList.length; g++) {
                  if (goodsAllList[g].goods_id == attr_select.goods_id) {
                    goodsAllList[g].buy_num -= 1;
                  }
                }
                that.setData({
                  goodsList: goodsList,
                  goodsAllList: goodsAllList,
                  goods_attr: goods_attr,
                  goods_attr_select: goods_attr_select,
                  shopCartNum: shopCartNum,
                  shopCartPrice: shopCartPrice,
                  casing_price: casing_price
                });

              }
            }
          }
        }
      }
    }
  },

  //商品数量减少
  subtractionGoods: function(e) {
    var that = this;
    var nums;
    var id;
    var goodsList = this.data.goodsList;
    var goodsAllList = this.data.goodsAllList;
    var shopCartNum = this.data.shopCartNum;
    var shopCartPrice = this.data.shopCartPrice;
    var casing_price = this.data.casing_price;

    if (this.data.gradeid == 15) {
      for (var i = 0; i < goodsList.goods.length; i++) {
        if (goodsList.goods[i].product_id == e.currentTarget.dataset.id.product_id) {

          if (goodsList.goods[i].is_attr == 1) {
            that.setData({
              is_attr: true,
              attr_title: goodsList.goods[i].product_name,
              goods_attr: goodsList.goods[i].goods_attr,
              goods_attr_select: goodsList.goods[i].goods_attr[0],
              goods_attr_list: goodsList.goods[i],
              goods_attr_price: goodsList.goods[i].is_seckill == 0 ? goodsList.goods[i].sales_promotion_is == 0 ? goodsList.goods[i].price : goodsList.goods[i].sales_promotion_price : goodsList.goods[i].seckill_price
            });
            return false;
          } else {
            if (goodsList.goods[i].buy_num == 0) {
              return false;
            } else {
              for (var k = 0; k < goodsList.menu.length; k++) {
                if (goodsList.goods[i].cate_id == goodsList.menu[k].cate_id) {
                  goodsList.menu[k].num -= 1;
                }
              }

              for (var j = 0; j < goodsAllList.length; j++) {
                if (goodsAllList[j].product_id == e.currentTarget.dataset.id.product_id) {
                  goodsAllList[j].buy_num -= 1;
                }
              }

              goodsList.goods[i].buy_num -= 1;
              shopCartNum -= 1;

              shopCartPrice -= goodsList.goods[i].is_shop_member == 0 ? goodsList.goods[i].price : goodsList.shop_detail.is_shop_member_user == 0 ? goodsList.goods[i].price : goodsList.goods[i].shop_member_price;
              if (that.data.is_take_number != 1) {
                request_addCart(that.data.addCardAPI, goodsList.goods[i].product_id, 1, that.data.shopID, goodsList.goods[i].buy_num, '');

              }
              
              that.setData({
                goodsList: goodsList,
                goodsAllList: goodsAllList,
                shopCartNum: shopCartNum,
                shopCartPrice: shopCartPrice,
                casing_price: casing_price
              });

              // 添加商品到购物车
              if (goodsList.goods[i].buy_num == 0) {
                myMap.delete(e.currentTarget.dataset.id.product_id);
              } else {
                myMap.set(e.currentTarget.dataset.id.product_id, {
                  'buy_num': goodsList.goods[i].buy_num,
                  'product_id': goodsList.goods[i].product_id,
                  'photo': goodsList.goods[i].photo,
                  'price': goodsList.goods[i].is_shop_member == 0 ? goodsList.goods[i].price : goodsList.shop_detail.is_shop_member_user == 0 ? goodsList.goods[i].price : goodsList.goods[i].shop_member_price,
                  'product_name': goodsList.goods[i].product_name,
                  'is_attr': goodsList.goods[i].is_attr
                });



              }

            }
          }

        }
      }
    } else {
      for (var i = 0; i < goodsList.goods.length; i++) {
        if (goodsList.goods[i].goods_id == e.currentTarget.dataset.id.goods_id) {

          if (goodsList.goods[i].is_attr == 1) {
            that.setData({
              is_attr: true,
              attr_title: goodsList.goods[i].title,
              goods_attr: goodsList.goods[i].goods_attr,
              goods_attr_select: goodsList.goods[i].goods_attr[0],
              goods_attr_list: goodsList.goods[i],
              goods_attr_price: goodsList.goods[i].is_seckill == 0 ? goodsList.goods[i].sales_promotion_is == 0 ? goodsList.goods[i].price : goodsList.goods[i].sales_promotion_price : goodsList.goods[i].seckill_price
            });
            return false;
          } else {
            if (goodsList.goods[i].buy_num == 0) {
              return false;
            } else {
              for (var k = 0; k < goodsList.cate.length; k++) {
                if (goodsList.goods[i].cate_id == goodsList.cate[k].cate_id) {
                  goodsList.cate[k].num -= 1;
                }
              }

              for (var j = 0; j < goodsAllList.length; j++) {
                if (goodsAllList[j].goods_id == e.currentTarget.dataset.id.goods_id) {
                  goodsAllList[j].buy_num -= 1;
                }
              }

              goodsList.goods[i].buy_num -= 1;
              shopCartNum -= 1;

              shopCartPrice -= goodsList.goods[i].is_shop_member == 0 ? goodsList.goods[i].price : goodsList.detail.is_shop_member_user == 0 ? goodsList.goods[i].price : goodsList.goods[i].shop_member_price;
              casing_price += goodsList.goods[i].casing_price;
              if (that.data.is_take_number != 1) {
                request_addCart(that.data.addCardAPI, goodsList.goods[i].goods_id, 2, that.data.shopID, goodsList.goods[i].buy_num, '');
              }

              that.setData({
                goodsList: goodsList,
                goodsAllList: goodsAllList,
                shopCartNum: shopCartNum,
                shopCartPrice: shopCartPrice,
                casing_price: casing_price
              });

              // 添加商品到购物车
              if (goodsList.goods[i].buy_num == 0) {
                myMap.delete(e.currentTarget.dataset.id.goods_id);
              } else {
                myMap.set(e.currentTarget.dataset.id.goods_id, {
                  'buy_num': goodsList.goods[i].buy_num,
                  'goods_id': goodsList.goods[i].goods_id,
                  'photo': goodsList.goods[i].photo,
                  'price': goodsList.goods[i].is_shop_member == 0 ? goodsList.goods[i].price : goodsList.detail.is_shop_member_user == 0 ? goodsList.goods[i].price : goodsList.goods[i].shop_member_price,
                  'title': goodsList.goods[i].title,
                  'is_attr': goodsList.goods[i].is_attr,
                  'casing_price': goodsList.goods[i].casing_price
                });

              }
            }
          }

        }
      }
    }

  },

  //优惠卷显示
  coupon: function() {
    var that = this;
    if (wx.getStorageSync('loginToken') == '') {
      that.setData({
        userLogin: true
      })
    } else {
      that.setData({
        isCouponShow: true
      });
    }
  },

  //领取优惠卷
  pickUp: function(e) {
    var that = this;
    wx.request({
      url: getApp().globalData.url + that.data.couponAPI,
      data: {
        login_token: wx.getStorageSync('loginToken'),
        coupon_id: e.currentTarget.dataset.id
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      dataType: 'json',
      success: function(res) {
        console.log('领取优惠券',res);
        if (res.data.state == 0) {
          // if (res.data.msg == '请先绑定手机') {
          //   wx.navigateTo({
          //     url: '../../bindPhone/bindPhone',
          //   })
          // }
        } else {
          var goodsList = that.data.goodsList;
          for (var i = 0; i < goodsList.coupon.list.length; i++) {
            if (goodsList.coupon.list[i].coupon_id == e.currentTarget.dataset.id) {
              goodsList.coupon.list[i].is_receive = 1;
              that.setData({
                goodsList: goodsList
              });
            }
          }
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  //关闭优惠卷
  closeCoupon: function() {
    this.setData({
      isCouponShow: false
    });
  },

  // 购物车
  shopCart: function() {
    var that = this;
    var shopCart = [];
    myMap.forEach(function(value, key, myMap) {
      shopCart.push(value);
    });
    this.setData({
      isShopCart: true,
      shopCart: shopCart
    });
  },

  // 购物车隐藏
  isShopCart: function() {
    this.setData({
      isShopCart: false
    });
  },

  //清空购物车
  clearCart: function() {
    var that = this;
    var goodsCartList = this.data.goodsCartList;
    this.setData({
      isShopCart: false,
      shopCart: [],
      shopCartNum: 0,
      shopCartPrice: 0,
      goodsList: goodsCartList,
      goodsAllList: goodsCartList.goods
    });
    myMap.clear();

    wx.request({
      url: getApp().globalData.url + '/api/goodscart/delete_shop_cart',
      data: {
        login_token: wx.getStorageSync('loginToken'),
        shop_id: that.data.shopID
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

  },

  //购物车商品添加
  shopCartAdd: function(e) {
    var that = this;
    if (e.currentTarget.dataset.is_attr == 1) {
      this.addGoods_attr(e);
    } else {
      this.addGoods(e);
    }
    this.shopCart();
  },

  //购物车商品减少
  shopCartSubtraction: function(e) {
    var that = this;
    if (e.currentTarget.dataset.is_attr == 1) {
      this.subtractionGoods_attr(e);
    } else {
      this.subtractionGoods(e);
    }
    this.shopCart();
    var shopCart = this.data.shopCart;
    /*for (var i = 0; i < shopCart.length; i++) {
      if (shopCart[i].buy_num == 0) {
        myMap.delete(e.currentTarget.dataset.id);
        that.shopCart();
      }
    }*/
    if (this.data.shopCart == '') {
      that.setData({
        isShopCart: false
      })
    }
  },

  //删除单个商品
  deletingCurrent: function(e) {
    var that = this;
    for (var i = 0; i < e.currentTarget.dataset.id.buy_num; i++) {
      that.shopCartSubtraction(e)
    }
    if (that.data.is_take_number != 1) {
      request_addCart(that.data.addCardAPI, that.data.gradeid == 15 ? e.currentTarget.dataset.id.product_id : e.currentTarget.dataset.id.goods_id, that.data.gradeid == 15 ? 1 : 2, that.data.shopID, 0, e.currentTarget.dataset.id.is_attr == 0 ? '' : e.currentTarget.dataset.id.attr_id);
    }

  },

  // 商品详情
  goodsDetails: function(e) {
    var goodsDetailsList = [];
    var goodsAllList = this.data.goodsAllList;
    // if (this.data.gradeid == 15) {
    //   for (var i = 0; i < goodsAllList.length; i++) {
    //     if (e.currentTarget.id == goodsAllList[i].product_id) {
    //       goodsDetailsList.push(goodsAllList[i])
    //     }
    //   }
    // } else {
    //   for (var i = 0; i < goodsAllList.length; i++) {
    //     if (e.currentTarget.id == goodsAllList[i].goods_id) {
    //       goodsDetailsList.push(goodsAllList[i])
    //     }
    //   }
    // }

    this.setData({
      isGoodsDetails: true,
      goodsDetailsList: e.currentTarget.dataset.item
    })
  },

  // 关闭商品详情
  goodsDetailsClose: function() {
    this.setData({
      isGoodsDetails: false
    })
  },

  //选好了
  confirmOrder: function(e) {
    var that = this;
    var shopCart = [];
    myMap.forEach(function(value, key, myMap) {
      shopCart.push(value);
    });
    this.setData({
      shopCart: shopCart
    })
    if (this.data.gradeid == 15) {
      if (that.data.shopCartPrice < that.data.goodsList.shop_detail.since_money) {
        wx.showModal({
          title: '提示',
          content: '再买些东西吧！',
        })
        return false;
      }
      wx.navigateTo({
        url: '../../../../confirmOrder/confirmOrder?shopID=' + this.data.shopID + "&shopName=" + this.data.goodsList.shop_detail.shop_name + "&gradeid=" + this.data.gradeid + "&shopCart=" + JSON.stringify(this.data.shopCart) + "&sinceMoney=" + this.data.goodsList.shop_detail.since_money + "&shopCartNum=" + this.data.shopCartNum + "&shopCartPrice=" + this.data.shopCartPrice + "&logistics=" + that.data.goodsList.shop_detail.logistics
      })

    } else {
      if (that.data.shopCartPrice < that.data.goodsList.detail.since_money) {
        wx.showModal({
          title: '提示',
          content: '再买些东西吧！',
        })
        return false;
      } else {
        if (!that.data.sweepOrder) {
          wx.navigateTo({
            url: '../../../../confirmOrder/confirmOrder?shopID=' + that.data.shopID + "&shopName=" + that.data.goodsList.detail.shop_name + "&gradeid=" + that.data.gradeid + "&shopCart=" + JSON.stringify(that.data.shopCart) + "&sinceMoney=" + that.data.goodsList.detail.since_money + "&shopCartNum=" + that.data.shopCartNum + "&shopCartPrice=" + that.data.shopCartPrice + "&logistics=" + that.data.goodsList.detail.logistics + "&casing_price=" + that.data.casing_price + "&reserve_table_id=" + that.data.reserve_table_id + '&isTakeNumber=' + that.data.is_take_number
          })
        } else {
          wx.navigateTo({
            url: './sweepPages/sweepPages?shopCart=' + JSON.stringify(that.data.shopCart) + '&shopID=' + that.data.shopID + "&seat=" + that.data.seat + "&selectNum=" + that.data.selectNum + "&selectRepast=" + that.data.selectRepast + '&gradeid=' + that.data.gradeid + '&scan_order_type=' + that.data.goodsList.detail.scan_order_type,
          })
        }
      }
    }
  },

  // 点击订桌
  clickTable: function() {
    var that = this;
    if (wx.getStorageSync('loginToken') == '') {
      that.setData({
        userLogin: true
      });
    } else {
      wx.navigateTo({
        url: './setTable/setTable?subscribe=' + that.data.goodsList.detail.subscribe_money + "&shopID=" + that.data.shopID,
      })
    }
  },

  // 智能付款
  clickSmartPay: function() {
    var that = this;
    if (wx.getStorageSync('loginToken') == '') {
      that.setData({
        userLogin: true
      });
    } else {
      wx.navigateTo({
        url: './smartPay/smartPay?shopID=' + that.data.shopID,
      })
    }
  },

  // 智能付款拖拽
  smartPayChange: function(e) {},

  // 商家聊天
  clickMessage: function() {
    var that = this;
    var myName = wx.getStorageSync('hx_username');
    // getApp().hxloign(wx.getStorageSync('hx_username'), wx.getStorageSync('hx_password'));
    if (wx.getStorageSync('loginToken') == '') {
      that.setData({
        userLogin: true
      });
    } else {
      if (this.data.gradeid == 15) {
        var username = {
          "myName": myName,
          "your": this.data.goodsList.shop_detail.hx_username
        }
        wx.navigateTo({
          url: './message/message?username=' + JSON.stringify(username),
        })
      } else {
        var username = {
          "myName": myName,
          "your": that.data.goodsList.detail.hx_username
        }
        wx.navigateTo({
          url: './message/message?username=' + JSON.stringify(username),
        })
      }
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var that = this;

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
    myMap.clear();
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

  // 取消
  clickCancel: function() {
    this.setData({
      userLogin: false
    });
  },

  // 允许获取权限
  clickAllow: function(e) {
    var that = this;
    console.log('获取权限:', e);
    var nickName = e.detail.userInfo.nickName;
    var face = e.detail.userInfo.avatarUrl;
    var encryptedData = e.detail.encryptedData;
    var iv = e.detail.iv;
    wx.login({
      success: function(res) {
        var code = res.code;
        getApp().globalData.code = res.code;
        if (code) {
          getApp().getOpenID(code, nickName, face, encryptedData, iv);
        }
      },
      fail: function(res) {},
      complete: function(res) {
        that.setData({
          userLogin: false
        });
      },
    });
    // getApp().wxGetSetting();
    getApp().globalData.userLogin = true;
  },

  // 点击头部
  clickeShopNav: function(e) {
    var that = this;
    switch (parseInt(e.currentTarget.dataset.id)) {
      case 0:
        that.setData({
          isOrdering: true,
          isDiscuss: false,
          navSelect: e.currentTarget.dataset.id,
          evaluationList: [],
          page: 1
        });
        break;
      case 1:
        that.setData({
          isOrdering: false,
          isDiscuss: true,
          navSelect: e.currentTarget.dataset.id,
          evaluationList: [],
          page: 1
        });
        that.evaluation();
        break;
      case 2:
        wx.navigateTo({
          url: '../store/store?shopID=' + that.data.shopID + "&gradeid=" + that.data.gradeid,
        })
        that.setData({
          isOrdering: true,
          isDiscuss: false,
          navSelect: 0,
          evaluationList: [],
          page: 1
        });
        break;
      default:
    };
  },

  // 请求店铺评论
  evaluation: function() {
    var that = this;
    wx.request({
      url: getApp().globalData.url + '/api/userorder/list_assess',
      data: {
        shop_id: that.data.shopID,
        page: that.data.page,
        num: 50
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        console.log('评价:', res);
        if (res.data.state == 0) {
          wx.showToast({
            title: res.data.msg,
          })
        } else if (res.data.msg == '暂无数据') {
          wx.showToast({
            title: res.data.msg,
          })
        } else {
          var list = res.data.data;
          var evaluationList = that.data.evaluationList;
          for (var i = 0; i < list.length; i++) {
            list[i].create_time = that.timestampToTime(list[i].create_time);
            evaluationList.push(list[i])
          }
          that.setData({
            evaluationList: evaluationList,
            page: that.data.page += 1
          });
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  // 时间转换
  timestampToTime: function(timestamp) {
    var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = date.getDate() + ' ';
    var h = date.getHours() + ':';
    var m = date.getMinutes() + ':';
    var s = date.getSeconds();
    return Y + M + D + h + m + s;
  },

  // 点击满减
  clickCoupon: function() {
    var that = this;
    that.setData({
      isFavourable: true
    });
  },

  // 关闭满减
  closeFavourable: function() {
    var that = this;
    that.setData({
      isFavourable: false
    });
  },

  // 领取优惠券
  clickReceive: function(e) {
    var that = this;
    wx.request({
      url: getApp().globalData.url + '/api/coupon/receive_coupon',
      data: {
        login_token: wx.getStorageSync('loginToken'),
        coupon_id: e.currentTarget.dataset.coupon_id
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        if (res.data.state == 0) {
          // if (res.data.msg == '请先绑定手机') {
          //   wx.navigateTo({
          //     url: '../../bindPhone/bindPhone',
          //   })
          // } else {
            wx.showToast({
              title: res.data.msg,
            })
          // }
        } else {
          wx.showToast({
            title: '领取成功',
          });
          var list = that.data.goodsList;
          for (var i = 0; i < list.coupon.list.length; i++) {
            if (e.currentTarget.dataset.coupon_id == that.data.goodsList.coupon.list[i].coupon_id) {
              list.coupon.list[i].is_receive = 1
            }
          };
          that.setData({
            goodsList: list
          });
        }
      },
      fail: function(res) {},
      complete: function(res) {
      },
    })
  },
})