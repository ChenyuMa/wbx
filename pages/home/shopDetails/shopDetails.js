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
var request_addCart = function (API, goodsID, type, shopID, num, attrID, nature) {
  wx.request({
    url: getApp().globalData.url + API,
    data: {
      login_token: wx.getStorageSync('loginToken'),
      goods_id: goodsID,
      type: type,
      shop_id: shopID,
      num: num,
      attr_id: attrID,
      // nature: nature
    },
    header: {
      'content-type': 'application/json'
    },
    method: 'POST',
    dataType: 'json',
    responseType: 'text',
    success: function (res) { },
    fail: function (res) { },
    complete: function (res) { },
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
    // 促销
    promotionList: [],
    // 秒杀
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
    is_take_number: '',
    // 是否有秒杀
    isKill: false,
    // 是否有促销
    isSales: false,
    shopCartNumBox: '0',
    lazy_load: true,
    // 是否多规格（新属性）
    is_attrs: false,

    nature: [],
    shop_box: [], //多规格组合数组(页面展示使用)
    shop_box_num: [], //多规格组合数组(接口传输使用)
    nature_box_id: [], //购物Key
    shopCart1: [], //购物车临时数组
    isSalesman: '', // 判断销量
    is_click: true,
    clickTime: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that = this;
    //获取屏幕高度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          x: res.windowWidth - 40,
          shopID: options.shopID,
          gradeid: options.gradeid,
          sweepOrder: options.sweepOrder == null ? '' : options.sweepOrder,
          reserve_table_id: options.reserve_table_id == null ? '' : options.reserve_table_id,
          seat: options.seat == null ? '' : options.seat,
          selectNum: options.selectNum == null ? '' : options.selectNum,
          selectRepast: options.selectRepast == null ? '' : options.selectRepast,
          is_take_number: options.is_take_number == null ? '' : options.is_take_number,
          isSalesman: wx.getStorageSync('is_salesman')
        });
      },
    });
    // //获取店铺id
    // this.setData({
    //   shopID: options.shopID,
    //   gradeid: options.gradeid,
    //   sweepOrder: options.sweepOrder == null ? '' : options.sweepOrder,
    //   reserve_table_id: options.reserve_table_id == null ? '' : options.reserve_table_id,
    //   seat: options.seat == null ? '' : options.seat,
    //   selectNum: options.selectNum == null ? '' : options.selectNum,
    //   selectRepast: options.selectRepast == null ? '' : options.selectRepast,
    //   is_take_number: options.is_take_number == null ? '' : options.is_take_number
    // });
    var url;
    if (options.gradeid == 15) {//菜市场
      url = getApp().globalData.url + that.data.shopGoodsAPI;
    } else {//超市
      url = getApp().globalData.url + that.data.mallGoodesAPI;
    }
    wx.request({
      url: url,
      data: {
        shop_id: this.data.shopID,
        login_token: wx.getStorageSync('loginToken'),
        is_take_number: that.data.is_take_number
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      dataType: 'json',
      success: function (res) {
        console.log(res);
        if (res.data.state == 0) {
          wx.showToast({
            title: res.data.msg,
          })
        } else {
          if (options.gradeid == 15) { //将菜市场的数据模型转换成实体店，以便后续走统一一套逻辑
            res.data.data.detail = res.data.data.shop_detail;
            res.data.data.cate = res.data.data.menu;
            if (res.data.data.goods) {
              for (var i = 0; i < res.data.data.goods.length; i++) {
                var good = res.data.data.goods[i];
                good.goods_id = good.product_id;
                good.title = good.product_name;
                good.intro = good.desc;
                good.shopcate_id = good.cate_id;
                good.nature = []
                if (good.goods_attr) {
                  for (var j = 0; j < good.goods_attr.length; j++) {
                    var spec = good.goods_attr[j]
                    spec.attr_buy_num = 0;
                    spec.mall_price = spec.price;
                    if (!spec.sales_promotion_is) {
                      spec.sales_promotion_is = 0
                    }
                    if (!spec.sales_promotion_price) {
                      spec.sales_promotion_price = 0
                    }
                  }
                }
              }
            }
          }
          var list = res.data.data;
          console.log("转换完成：", list)
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

          //判断setData长度是否超出
          if (list.goods.length > 1000) {
            var arry = list.goods;
            delete list['goods'];
            var goodsAllList = that.data.goodsAllList;
            var goodsList = that.data.goodsList;
            var goodsCartList = that.data.goodsCartList;
            goodsList.goods = arry;
            goodsCartList.goods = arry;
            for (var j = 0; j < 10; j++) {
              if (j <= arry.length - 1) {
                goodsAllList.push(arry[j]);
              }
            }
            that.setData({
              goodsAllList: goodsAllList,
              // goodsCartList: goodsCartList,
              // goodsList: goodsList
              goodsList: list,
              goodsCartList: list,
              goodsAll: arry
            });
          } else {
            var goodsAllList = that.data.goodsAllList;
            for (var j = 0; j < 10; j++) {
              if (j <= list.goods.length - 1) {
                goodsAllList.push(list.goods[j]);
              }
            }
            console.log("-----------");
            console.log(list);
            that.setData({
              goodsList: list,
              goodsCartList: list,
              goodsAll: list.goods,
              goodsAllList: goodsAllList,
            });
          }
          wx.setNavigationBarTitle({
            title: list.detail.shop_name,
          })
        }
      },
      fail: function (res) { },
      complete: function (res) {
        if(res.data.state==0){
          wx.showToast({
            title: res.data.msg,
          })
        }else{
          if (res.data.data.goods) {
            var goods = res.data.data.goods;
            if (goods.length > 0) {
              for (var i = 0; i < goods.length; i++) {
                if (goods[i].is_seckill == 1) {
                  that.setData({
                    isKill: true
                  })

                }
                if (goods[i].sales_promotion_is == 1) {
                  that.setData({
                    isSales: true
                  })

                }
              }
            }
          }
        }
      },
    })

    // if (options.gradeid == 15) {
    //   wx.request({
    //     url: getApp().globalData.url + that.data.shopGoodsAPI,
    //     data: {
    //       shop_id: that.data.shopID,
    //       login_token: wx.getStorageSync('loginToken')
    //     },
    //     header: {
    //       'content-type': 'application/x-www-form-urlencoded'
    //     },
    //     method: 'POST',
    //     dataType: 'json',
    //     success: function(res) {

    //       var list = res.data.data;
    //       if (list.shop_detail.is_favorites == 1) {
    //         that.setData({
    //           isFavorites: true
    //         });
    //       }
    //       for (var i = 0; i < list.coupon.list.length; i++) {
    //         list.coupon.list[i].create_time = timestampToTime(list.coupon.list[i].create_time);
    //         list.coupon.list[i].end_time = timestampToTime(list.coupon.list[i].end_time);
    //         list.coupon.list[i].start_time = timestampToTime(list.coupon.list[i].start_time);
    //       }

    //       //判断setData长度是否超出
    //       if (list.goods.length > 1000) {
    //         var arry = list.goods;
    //         delete list['goods'];
    //         // that.setData({
    //         //   goodsList: list,
    //         //   goodsCartList: list,
    //         //   goodsAll: arry
    //         // });
    //         var goodsAllList = that.data.goodsAllList;
    //         var goodsList = that.data.goodsList;
    //         var goodsCartList = that.data.goodsCartList;

    //         goodsList.goods = arry;
    //         goodsCartList.goods = arry;
    //         for (var j = 0; j < 10; j++) {
    //           if (j <= arry.length - 1) {
    //             goodsAllList.push(arry[j]);
    //           }
    //         }
    //         that.setData({
    //           goodsAllList: goodsAllList,
    //           // goodsCartList: goodsCartList,
    //           // goodsList: goodsList
    //           goodsList: list,
    //           goodsCartList: list,
    //           goodsAll: arry
    //         });
    //       } else {
    //         // that.setData({
    //         //   goodsList: list,
    //         //   goodsCartList: list,
    //         //   goodsAll: list.goods
    //         // });
    //         var goodsAllList = that.data.goodsAllList;
    //         for (var j = 0; j < 10; j++) {
    //           if (j <= list.goods.length - 1) {
    //             goodsAllList.push(list.goods[j]);
    //           }
    //         }
    //         that.setData({
    //           goodsAllList: goodsAllList,
    //           goodsList: list,
    //           goodsCartList: list,
    //           goodsAll: list.goods
    //         });
    //       }

    //       wx.setNavigationBarTitle({
    //         title: list.shop_detail.shop_name,
    //       })
    //     },
    //     fail: function(res) {},
    //     complete: function(res) {
    //       if (res.data.data.goods) {
    //         var goods = res.data.data.goods;
    //         if (goods.length > 0) {
    //           for (var i = 0; i < goods.length; i++) {
    //             if (goods[i].is_seckill == 1) {
    //               that.setData({
    //                 isKill: true
    //               })

    //             }
    //             if (goods[i].sales_promotion_is == 1) {
    //               that.setData({
    //                 isSales: true
    //               })

    //             }
    //           }
    //         }
    //       }


    //     },
    //   })
    // } else {

    // };
  },

  // 查看商家信息
  down_shopInfo: function () {
    var that = this;
    wx.navigateTo({
      url: '../store/store?shopID=' + that.data.shopID + "&gradeid=" + that.data.gradeid,
    })
  },

  // 点击联系商家
  callPhone: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.tel,
    })
  },

  // 查看商家资质
  click_aptitude: function () {
    var that = this;
    this.setData({
      is_shop_aptitude: !that.data.is_shop_aptitude,
    });
  },

  close_shop_aptitude: function () {
    var that = this;
    this.setData({
      is_shop_aptitude: !that.data.is_shop_aptitude,
    });
  },

  // 查看商家二维码
  click_qrcode: function () {
    var that = this;
    this.setData({
      is_shop_qrcode: !that.data.is_shop_qrcode
    });
  },

  // 关闭商家二维码
  close_shop_qrcode: function () {
    var that = this;
    this.setData({
      is_shop_qrcode: !that.data.is_shop_qrcode
    });
  },

  // 
  save_picture: function (e) {
    var that = this;
    if (e.timeStamp / 1000 > 3) {
      that.setData({
        is_save_picture: true
      });
    }
  },

  // 收藏店铺
  collectionShop: function (e) {
    var that = this;
    wx.request({
      url: getApp().globalData.url + '/api/index/follow_shop',
      data: {
        login_token: wx.getStorageSync('loginToken'),
        shop_id: that.data.shopID
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        if (res.data.state == 0) {
          if (res.data.msg == '请先登陆') {
            wx.navigateTo({
              url: '../../login/login',
            })
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
          goodsList.detail.is_favorites = 0;
          that.setData({
            goodsList: goodsList
          });
          that.setData({
            isFavorites: true
          });
        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })

  },

  //搜索框
  searchTo: function () {
    var goodsAllList = this.data.goodsAllList;
  },

  // 搜索框搜索
  searchInput: function (e) {
    var that = this;
    if (e.detail.value != '') {
      that.setData({
        isCancel: 'block',
        inputTxt: e.detail.value
      });
    } else {
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
    for (var i = 0; i < goodsAllList.length; i++) {
      var str = goodsAllList[i].title;
      if (e.detail.value != '' && str.indexOf(value) != -1) {
        searchList.push(goodsAllList[i]);
        that.setData({
          goodsAllList: searchList
        });
      } else if (str.indexOf(value) == -1) {
        // that.setData({
        //   goodsAllList:[]
        // });
      }
    }
  },

  // 清空搜索栏
  cancelTxt: function () {
    var that = this;
    this.setData({
      isCancel: 'none',
      inputTxt: '',
      goodsAllList: that.data.goodsAll
    });
  },

  //点击选择分类
  onClick: function (e) {
    var that = this;
    this.setData({
      toView: e.currentTarget.id,
      curIndex: e.currentTarget.dataset.index,
      titleName: e.currentTarget.dataset.title,
    })
    if (e.currentTarget.id == 0) { //全部商品
      that.setData({
        goodsAllList: that.data.goodsList.goods
      })
      return false;
    };
    if (e.currentTarget.id == 1) { //促销
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

    if (e.currentTarget.id == 2) { //秒杀
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
  rightTolower: function (e) {
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

  // 商品加
  addGoods: function (e) {
    var that = this;
    if (e.currentTarget.dataset.id.goods_attr) {
      that.setData({
        attr_max: 1
      })
    } else {
      that.setData({
        attr_max: 0
      })
    }
    var goodsList = this.data.goodsList;
    var goodsAllList = this.data.goodsAllList;
    var shopCartPrice = this.data.shopCartPrice;
    var shopCartNum = this.data.shopCartNum;
    var shopCart = this.data.shopCart;
    var casing_price = this.data.casing_price;
    if (wx.getStorageSync('loginToken') != '') {
      for (var i = 0; i < goodsList.goods.length; i++) {
        if (goodsList.goods[i].goods_id == e.currentTarget.dataset.id.goods_id) {
          if (goodsList.goods[i].is_attr == 1 || goodsList.goods[i].nature.length > 0) { //是否为多规格或多属性
            for (var o = 0; o < goodsList.goods[i].nature.length; o++) {
              goodsList.goods[i].nature[o].nature_arr[0].is_select_attr = false
            }
            var shop = that.data.shop_box;
            var shop_num = [];
            if (goodsList.goods[i].goods_attr) { //有规格
              shop.splice(0, 1);
              shop.splice(0, 0, goodsList.goods[i].goods_attr[0].attr_name);
              shop_num.splice(0, 1);
              shop_num.splice(0, 0, goodsList.goods[i].goods_attr[0].attr_id)
              var nature_box_id = [];
              nature_box_id.push(goodsList.goods[i].goods_attr[0].attr_id);
              for (var p = 1; p < goodsList.goods[i].nature.length + 1; p++) {
                shop.splice(p, 1);
                shop.splice(p, 0, goodsList.goods[i].nature[p - 1].nature_arr[0].nature_name)
                shop_num.splice(p, 1);
                shop_num.splice(p, 0, goodsList.goods[i].nature[p - 1].nature_arr[0].nature_id)
                goodsList.goods[i].nature[p - 1].nature_arr[0].is_select_attr = true
                nature_box_id.push(goodsList.goods[i].nature[p - 1].nature_arr[0].nature_id)
              }
              var compareId_init = ''
              for (var el = 0; el < nature_box_id.length; el++) {
                compareId_init = compareId_init + '#' + nature_box_id[el]
              }
              compareId_init = goodsList.goods[i].goods_id + compareId_init;
              if (that.data.shopCart1.length > 0) {
                for (var carShop = 0; carShop < that.data.shopCart1.length; carShop++) {
                  if (compareId_init == that.data.shopCart1[carShop].key) {
                    goodsList.goods[i].goods_attr[0].attr_buy_num = that.data.shopCart1[carShop].value.buy_num
                  }
                }
              }
              that.setData({
                is_attrs: true,
                attr_title: goodsList.goods[i].title,
                goods_attr: goodsList.goods[i].goods_attr,
                goods_attr_select: goodsList.goods[i].goods_attr[0],
                goods_attr_list: goodsList.goods[i],
                goods_attr_price: goodsList.goods[i].goods_attr[0].is_seckill == 0 ? goodsList.goods[i].goods_attr[0].sales_promotion_is == 0 ? goodsList.goods[i].goods_attr[0].mall_price ? goodsList.goods[i].goods_attr[0].mall_price : goodsList.goods[i].goods_attr[0].price : goodsList.goods[i].goods_attr[0].sales_promotion_price : goodsList.goods[i].goods_attr[0].seckill_price,
                nature: goodsList.goods[i].nature,
                shop_box: shop,
                shop_box_num: shop_num,
                attr_max: 1
              });
            } else { //无规格 有属性
              if (e.currentTarget.dataset.carclick == 'carClick') { //购物车点击加
                if (goodsList.goods[i].is_seckill == 1 && goodsList.goods[i].attr_buy_num >= goodsList.goods[i].limitations_num) {
                  wx.showToast({
                    title: '超出秒杀数量',
                    icon: 'none'
                  })
                  return false;
                } else if (goodsList.goods[i].is_seckill == 1 && goodsList.goods[i].attr_buy_num >= goodsList.goods[i].seckill_num) {
                  wx.showToast({
                    title: '库存不足',
                    icon: 'none'
                  })
                  return false;
                } else if (goodsList.goods[i].is_use_num == 1 && goodsList.goods[i].attr_buy_num >= goodsList.goods[i].inventory_num) {
                  wx.showToast({
                    title: '库存不足',
                    icon: 'none'
                  })
                  return false;
                } else {
                  if (goodsList.goods[i].attr_buy_num >= 99) {
                    return false;
                  } else {
                    var cate_id;
                    for (var l = 0; l < goodsList.cate.length; l++) {
                      if (goodsList.goods[i].cate_id == goodsList.cate[l].cate_id) { //判断右侧分类ID是否为现有ID
                        goodsList.cate[l].num += 1;
                        cate_id = goodsList.cate[l].cate_id
                      }
                    }


                    goodsList.goods[i].buy_num += 1; //选择时的数量
                    goodsList.goods[i].attr_buy_num += 1; //分类ID 对应的数量
                    shopCartNum += 1; //底部购物车数量
                    shopCartPrice +=
                      goodsList.goods[i].is_shop_member == 0 //是否为会员价 0否 1是
                        ?
                        goodsList.goods[i].is_seckill == 0 //是否为秒杀1秒杀 0非秒杀
                          ?
                          goodsList.goods[i].sales_promotion_is == 0 //1促销 0非促销
                            ?
                            goodsList.goods[i].mall_price //商品商城价格
                              ?
                              goodsList.goods[i].mall_price //商品商城价格
                              :
                              goodsList.goods[i].price //商品价格
                            :
                            goodsList.goods[i].sales_promotion_price //促销价格
                          :
                          goodsList.goods[i].seckill_price //秒杀商品秒杀价格
                        :
                        goodsList.detail.is_shop_member_user == 0 //是否为会员
                          ?
                          goodsList.goods[i].mall_price //商品商城价格
                            ?
                            goodsList.goods[i].mall_price //商品商城价格
                            :
                            goodsList.goods[i].price //商品价格
                          :
                          goodsList.goods[i].shop_member_price; //会员价
                    that.data.goods_attr_select.attr_buy_num += 1;

                    var compare_id = ''; //商品拼接后形成的唯一ID
                    var shop_box_num = JSON.parse(e.currentTarget.dataset.id.shop_box_num);
                    for (var el = 0; el < shop_box_num.length; el++) {
                      compare_id = compare_id + '#' + shop_box_num[el]
                    }
                    compare_id = goods_attr_select.goods_id + compare_id
                    var shops_Num = 1; //商品数量

                    if (that.data.shopCart1.length > 0) {
                      for (var o = 0; o < that.data.shopCart1.length; o++) {
                        if (compare_id === that.data.shopCart1[o].key) {
                          shops_Num = parseInt(that.data.shopCart1[o].value.buy_num) + 1;
                        }
                      }
                    }
                    myMap.set(compare_id, {
                      'buy_num': shops_Num,
                      'goods_id': goodsList.goods[i].goods_id,
                      'attr_id': shop_box_num[0],
                      'photo': goodsList.goods[i].photo,
                      'title': e.currentTarget.dataset.carclick ? e.currentTarget.dataset.id.title : goodsList.goods[i].title,
                      'price': goodsList.goods[i].is_shop_member == 0 //是否为会员价 0否 1是
                        ?
                        goodsList.goods[i].is_seckill == 0 //是否为秒杀1秒杀 0非秒杀
                          ?
                          goodsList.goods[i].sales_promotion_is == 0 //1促销 0非促销
                            ?
                            goodsList.goods[i].mall_price //商品商城价格
                              ?
                              goodsList.goods[i].mall_price //商品商城价格
                              :
                              goodsList.goods[i].price //商品价格
                            :
                            goodsList.goods[i].sales_promotion_price //促销价格
                          :
                          goodsList.goods[i].seckill_price //秒杀商品秒杀价格
                        :
                        goodsList.detail.is_shop_member_user == 0 //是否为会员
                          ?
                          goodsList.goods[i].mall_price //商品商城价格
                            ?
                            goodsList.goods[i].mall_price //商品商城价格
                            :
                            goodsList.goods[i].price //商品价格
                          :
                          goodsList.goods[i].shop_member_price, //会员价
                      'is_attr': goodsList.goods[i].is_attr,
                      'casing_price': goodsList.goods[i].casing_price,
                      'is_seckill': goodsList.goods[i].is_seckill,
                      'limitations_num': goodsList.goods[i].limitations_num,
                      'seckill_num': goodsList.goods[i].seckill_num,
                      'nature_box_id': compare_id,
                      'shop_box_num': JSON.stringify(shop_box_num),
                      'cate_id': cate_id,
                      'goods_attr_title': that.data.shop_box
                    });
                    for (var g = 0; g < goodsAllList.length; g++) {
                      if (goodsAllList[g].goods_id == e.currentTarget.dataset.id.goods_id) {
                        goodsAllList[g].buy_num += 1;
                      }
                    }
                    var shopCart1 = [];
                    myMap.forEach(function (value, key, myMap) {
                      shopCart1.push({
                        key,
                        value
                      });
                    });
                    that.setData({
                      goodsList: goodsList,
                      goodsAllList: goodsAllList,
                      goods_attr_select: that.data.goods_attr_select,
                      shopCartNum: shopCartNum,
                      shopCartPrice: shopCartPrice,
                      casing_price: casing_price,
                      shopCart1: shopCart1,
                    });
                    if (that.data.is_take_number != 1) { // 是否为叫号
                      shop_box_num = JSON.stringify(shop_box_num)
                      request_addCart(that.data.addCardAPI, goodsList.goods[i].goods_id, that.data.gradeid == 15 ? 1 : 2, that.data.shopID, shops_Num, e.currentTarget.dataset.id.attr_id, shop_box_num); //多属性
                    }
                  }
                }
              } else { //列表点击商品加
                var nature_box_id = [];
                for (var p = 0; p < goodsList.goods[i].nature.length; p++) {
                  shop.splice(p, 0);
                  shop.splice(p, 0, goodsList.goods[i].nature[p].nature_arr[0].nature_name)
                  shop_num.splice(p, 0);
                  shop_num.splice(p, 0, goodsList.goods[i].nature[p].nature_arr[0].nature_id)
                  goodsList.goods[i].nature[p].nature_arr[0].is_select_attr = true
                  nature_box_id.push(goodsList.goods[i].nature[p].nature_arr[0].nature_id)
                }
                that.setData({
                  is_attrs: true,
                  attr_title: goodsList.goods[i].title,
                  goods_attr_select: goodsList.goods[i],
                  goods_attr_list: goodsList.goods[i],
                  goods_attr_price: goodsList.goods[i].is_seckill == 0 ? goodsList.goods[i].sales_promotion_is == 0 ? goodsList.goods[i].mall_price ? goodsList.goods[i].mall_price : goodsList.goods[i].price : goodsList.goods[i].sales_promotion_price : goodsList.goods[i].seckill_price,
                  nature: goodsList.goods[i].nature,
                  shop_box: shop,
                  shop_box_num: shop_num,
                  attr_max: 0
                });
              }
            }
            var ids_box = '';
            for (var ids = 0; ids < nature_box_id.length; ids++) {
              ids_box = ids_box + '#' + nature_box_id[ids]
            }
            ids_box = goodsList.goods[i].goods_id + ids_box;
            that.setData({
              nature_box_id: ids_box
            })
            if (that.data.shopCart1.length > 0) {
              for (var o = 0; o < that.data.shopCart1.length; o++) {
                var goods_attr_select = that.data.goods_attr_select
                if (ids_box === that.data.shopCart1[o].key) {
                  goods_attr_select.attr_buy_num = that.data.shopCart1[o].value.buy_num
                  that.setData({
                    goods_attr_select,
                  })
                  return
                } else {
                  goods_attr_select.attr_buy_num = 0;
                  that.setData({
                    goods_attr_select,
                  })
                }
              }
            } else {
              var goods_attr_select = that.data.goods_attr_select
              goods_attr_select.attr_buy_num = 0;
              that.setData({
                goods_attr_select
              })
            }
            return false;
          } else {
            if (goodsList.goods[i].buy_num >= 99) {
              return false;
            } else {
              if (goodsList.goods[i].is_seckill == 1 && goodsList.goods[i].buy_num >= goodsList.goods[i].limitations_num) {
                wx.showToast({
                  title: '超出限购数量',
                  icon: 'none'
                })
                return false;
              } else if (goodsList.goods[i].is_seckill == 1 && goodsList.goods[i].buy_num >= goodsList.goods[i].seckill_num) {
                wx.showToast({
                  title: '库存不足',
                  icon: 'none'
                })
                return false;
              } else if (goodsList.goods[i].is_use_num == 1 && goodsList.goods[i].buy_num >= goodsList.goods[i].inventory_num) {
                wx.showToast({
                  title: '库存不足',
                  icon: 'none'
                })
                return false;
              } else {
                for (var k = 0; k < goodsList.cate.length; k++) {
                  if (goodsList.goods[i].cate_id == goodsList.cate[k].cate_id) {
                    goodsList.cate[k].num += 1;
                  }
                }
                goodsList.goods[i].buy_num += 1;
                shopCartNum += 1;
                shopCartPrice += goodsList.goods[i].is_shop_member == 0 ? goodsList.goods[i].price : goodsList.detail.is_shop_member_user == 0 ? goodsList.goods[i].price : goodsList.goods[i].shop_member_price;
                casing_price += goodsList.goods[i].casing_price;

                for (var j = 0; j < goodsAllList.length; j++) {
                  if (e.currentTarget.dataset.id.goods_id == goodsAllList[j].goods_id) {
                    goodsAllList[j].buy_num += 1;
                  }
                }

                if (that.data.is_take_number != 1) {
                  request_addCart(that.data.addCardAPI, goodsList.goods[i].goods_id, that.data.gradeid == 15 ? 1 : 2, that.data.shopID, goodsList.goods[i].buy_num, '');
                }

                that.setData({
                  goodsList: goodsList,
                  goodsAllList: goodsAllList,
                  shopCartNum: shopCartNum,
                  shopCartPrice: shopCartPrice,
                  casing_price: casing_price,
                  shopCartNumBox: goodsList.goods[i].buy_num
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
      // }
    } else {
      wx.navigateTo({
        url: '../../login/login',
      })
      that.setData({
        userLogin: true
      });
    };
  },

  // 关闭商品多规格
  close_attr: function () {
    this.setData({
      is_attr: false,
      is_attrs: false,
      is_select_attr: 0,
      shop_box: [],
      shop_box_num: [],
      nature_num: 0,
    });
  },

  // 多规格商品选择
  select_goods_attrs: function (e) {
    var that = this;
    var shop = that.data.shop_box;
    var shop_num = that.data.shop_box_num;
    var goods_attr_select = that.data.goods_attr_select;
    if (e.currentTarget.dataset.click == 'new') { //2.2.6新增多属性
      var itemsIndex = e.currentTarget.dataset.itemsindex
      var itemIndex = e.currentTarget.dataset.itemindex
      var content = e.currentTarget.dataset.content
      var count = content[itemsIndex].nature_arr.length;

      for (var i = 0; i < count; i++) {
        content[itemsIndex].nature_arr[i].is_select_attr = false
      }
      content[itemsIndex].nature_arr[itemIndex].is_select_attr = true
      var shop_item = content[itemsIndex].nature_arr[itemIndex].nature_name;
      var shop_items = content[itemsIndex].nature_arr[itemIndex].nature_id;
      if (that.data.attr_max == 1) {
        shop.splice(itemsIndex + 1, 1);
        shop.splice(itemsIndex + 1, 0, shop_item)
        shop_num.splice(itemsIndex + 1, 1);
        shop_num.splice(itemsIndex + 1, 0, shop_items)
        that.setData({
          nature: content,
          shop_box: shop,
          shop_box_num: shop_num,
          nature_box_id: []
        })
      } else {
        shop.splice(itemsIndex, 1);
        shop.splice(itemsIndex, 0, shop_item)
        shop_num.splice(itemsIndex, 1);
        shop_num.splice(itemsIndex, 0, shop_items)
        that.setData({
          nature: content,
          shop_box: shop,
          shop_box_num: shop_num,
          nature_box_id: []
        })
      }
    } else if (e.currentTarget.dataset.click == 'former') { //2.2.6之前多规格
      var goods_attr_list = this.data.goods_attr_list;
      var index = e.currentTarget.dataset.index;
      var shop_item = that.data.goods_attr[index].attr_name;
      var shop_items = that.data.goods_attr[index].attr_id;
      shop.splice(0, 1);
      shop.splice(0, 0, shop_item)
      shop_num.splice(0, 1);
      shop_num.splice(0, 0, shop_items)
      that.setData({
        is_select_attr: index,
        goods_attr_select: that.data.goods_attr[index],
        goods_attr_price: goods_attr_list.goods_attr[index].is_seckill == 0 //是否为秒杀1秒杀 0非秒杀
          ?
          goods_attr_list.goods_attr[index].sales_promotion_is == 0 //1促销 0非促销
            ?
            goods_attr_list.goods_attr[index].mall_price //商品商城价格
              ?
              goods_attr_list.goods_attr[index].mall_price //商品商城价格
              :
              goods_attr_list.goods_attr[index].price //商品价格
            :
            goods_attr_list.goods_attr[index].sales_promotion_price //促销价格
          :
          goods_attr_list.goods_attr[index].seckill_price, //秒杀商品秒杀价格
        shop_box: shop,
        shop_box_num: shop_num,
        nature_box_id: []
      });
    }
    var compare_id = '';
    for (var el = 0; el < shop_num.length; el++) {
      compare_id = compare_id + '#' + shop_num[el]
    }
    compare_id = goods_attr_select.goods_id + compare_id
    if (that.data.shopCart.length > 0) {
      for (var o = 0; o < that.data.shopCart.length; o++) {
        var goods_attr_select = that.data.goods_attr_select
        if (compare_id === that.data.shopCart[o].key) {
          goods_attr_select.attr_buy_num = that.data.shopCart[o].value.buy_num
          that.setData({
            goods_attr_select
          })
          return
        } else {
          goods_attr_select.attr_buy_num = 0;
          that.setData({
            goods_attr_select
          })
        }
      }
    } else {
      for (var oi = 0; oi < that.data.shopCart1.length; oi++) {
        var goods_attr_select = that.data.goods_attr_select;
        if (compare_id === that.data.shopCart1[oi].key) {
          goods_attr_select.attr_buy_num = that.data.shopCart1[oi].value.buy_num
          that.setData({
            goods_attr_select
          })
          return
        } else {
          goods_attr_select.attr_buy_num = 0;
          that.setData({
            goods_attr_select
          })
        }
      }
    }

  },

  // 商品多规格加
  addGoods_attr: function (e) {
    var that = this;
    var attr_select = e.currentTarget.dataset.attr_select ? e.currentTarget.dataset.attr_select : e.currentTarget.dataset.id;
    var carClick = e.currentTarget.dataset.carclick ? e.currentTarget.dataset.carclick : '';
    var goods_attr = this.data.goods_attr;
    var cate_id;
    var goods_attr_select = this.data.goods_attr_select;
    var goodsList = this.data.goodsList;
    var goodsAllList = this.data.goodsAllList;
    var shopCartNum = this.data.shopCartNum;
    var shopCartPrice = this.data.shopCartPrice;
    var casing_price = this.data.casing_price;

    for (var i = 0; i < goodsList.goods.length; i++) {
      if (goodsList.goods[i].goods_id == attr_select.goods_id) {
        if (goodsList.goods[i].goods_attr) { // 有规格
          for (var j = 0; j < goodsList.goods[i].goods_attr.length; j++) {
            if (goodsList.goods[i].goods_attr[j].attr_id == attr_select.attr_id) {
              if (goodsList.goods[i].goods_attr[j].is_seckill == 1 && goodsList.goods[i].goods_attr[j].attr_buy_num >= goodsList.goods[i].goods_attr[j].limitations_num) {
                wx.showToast({
                  title: '超出秒杀数量',
                  icon: 'none'
                })
                return false;
              } else if (goodsList.goods[i].goods_attr[j].is_seckill == 1 && goodsList.goods[i].goods_attr[j].attr_buy_num >= goodsList.goods[i].goods_attr[j].seckill_num) {
                wx.showToast({
                  title: '库存不足',
                  icon: 'none'
                })
                return false;
              } else if (goodsList.goods[i].is_use_num == 1 && goodsList.goods[i].goods_attr[j].attr_buy_num >= goodsList.goods[i].goods_attr[j].inventory_num) {
                wx.showToast({
                  title: '库存不足',
                  icon: 'none'
                })
                return false;
              } else {
                if (goodsList.goods[i].goods_attr[j].attr_buy_num >= 99) {
                  return false;
                } else {
                  for (var l = 0; l < goodsList.cate.length; l++) {
                    if (goodsList.goods[i].cate_id == goodsList.cate[l].cate_id) { //判断右侧分类ID是否为现有ID
                      goodsList.cate[l].num += 1;
                      cate_id = goodsList.cate[l].cate_id
                    }
                  }


                  goodsList.goods[i].buy_num += 1; //选择时的数量
                  goodsList.goods[i].goods_attr[j].attr_buy_num += 1; //分类ID 对应的数量
                  shopCartNum += 1; //底部购物车数量
                  shopCartPrice +=
                    goodsList.goods[i].goods_attr[j].is_shop_member == 0 //是否为会员价 0否 1是
                      ?
                      goodsList.goods[i].goods_attr[j].is_seckill == 0 //是否为秒杀1秒杀 0非秒杀
                        ?
                        goodsList.goods[i].goods_attr[j].sales_promotion_is == 0 //1促销 0非促销
                          ?
                          goodsList.goods[i].goods_attr[j].mall_price //商品商城价格
                            ?
                            goodsList.goods[i].goods_attr[j].mall_price //商品商城价格
                            :
                            goodsList.goods[i].goods_attr[j].price //商品价格
                          :
                          goodsList.goods[i].goods_attr[j].sales_promotion_price //促销价格
                        :
                        goodsList.goods[i].goods_attr[j].seckill_price //秒杀商品秒杀价格
                      :
                      goodsList.detail.is_shop_member_user == 0 //是否为会员
                        ?
                        goodsList.goods[i].goods_attr[j].mall_price //商品商城价格
                          ?
                          goodsList.goods[i].goods_attr[j].mall_price //商品商城价格
                          :
                          goodsList.goods[i].goods_attr[j].price //商品价格
                        :
                        goodsList.goods[i].goods_attr[j].shop_member_price; //会员价
                  for (var k = 0; k < goods_attr.length; k++) { //主分类ID如果跟现有的分类ID相同则对数值 做加
                    if (goods_attr[k].attr_id == goods_attr_select.attr_id) {
                      goods_attr_select.attr_buy_num += 1;
                      goods_attr[k].attr_buy_num += 1;
                      casing_price += goods_attr[k].casing_price;
                    }
                  }

                  var compare_id = '';
                  if (that.data.shop_box_num instanceof Array) {
                    var shop_box_num = that.data.shop_box_num
                  } else {
                    var shop_box_num = JSON.parse(that.data.shop_box_num)
                  }

                  for (var e = 0; e < shop_box_num.length; e++) {
                    compare_id = compare_id + '#' + shop_box_num[e]
                  }
                  if (carClick) {
                    compare_id = goodsList.goods[i].goods_id + compare_id
                  } else {
                    compare_id = goods_attr_select.goods_id + compare_id
                  }
                  var shops_Num = 1;
                  if (that.data.shopCart1.length > 0) {
                    for (var o = 0; o < that.data.shopCart1.length; o++) {
                      if (compare_id === that.data.shopCart1[o].key) {
                        shops_Num = parseInt(that.data.shopCart1[o].value.buy_num) + 1;
                      }
                    }
                  }
                  myMap.set(compare_id, {
                    'buy_num': shops_Num,
                    'goods_id': goodsList.goods[i].goods_id,
                    'attr_id': shop_box_num[0],
                    'photo': goodsList.goods[i].photo,
                    'title': carClick ? attr_select.title : goodsList.goods[i].title + '\n' + '(' + that.data.shop_box + ')',
                    'price': goodsList.goods[i].goods_attr[j].is_shop_member == 0 //是否为会员价 0否 1是
                      ?
                      goodsList.goods[i].goods_attr[j].is_seckill == 0 //是否为秒杀1秒杀 0非秒杀
                        ?
                        goodsList.goods[i].goods_attr[j].sales_promotion_is == 0 //1促销 0非促销
                          ?
                          goodsList.goods[i].goods_attr[j].mall_price //商品商城价格
                            ?
                            goodsList.goods[i].goods_attr[j].mall_price //商品商城价格
                            :
                            goodsList.goods[i].goods_attr[j].price //商品价格
                          :
                          goodsList.goods[i].goods_attr[j].sales_promotion_price //促销价格
                        :
                        goodsList.goods[i].goods_attr[j].seckill_price //秒杀商品秒杀价格
                      :
                      goodsList.detail.is_shop_member_user == 0 //是否为会员
                        ?
                        goodsList.goods[i].goods_attr[j].mall_price //商品商城价格
                          ?
                          goodsList.goods[i].goods_attr[j].mall_price //商品商城价格
                          :
                          goodsList.goods[i].goods_attr[j].price //商品价格
                        :
                        goodsList.goods[i].goods_attr[j].shop_member_price,
                    'is_attr': goodsList.goods[i].is_attr,
                    'casing_price': goodsList.goods[i].goods_attr[j].casing_price,
                    'is_seckill': goodsList.goods[i].goods_attr[j].is_seckill,
                    'limitations_num': goodsList.goods[i].goods_attr[j].limitations_num,
                    'seckill_num': goodsList.goods[i].goods_attr[j].seckill_num,
                    'nature_box_id': compare_id,
                    'shop_box_num': JSON.stringify(shop_box_num),
                    'cate_id': cate_id,
                    'goods_attr_title': that.data.shop_box
                  });
                  for (var g = 0; g < goodsAllList.length; g++) {
                    if (goodsAllList[g].goods_id == attr_select.goods_id) {
                      goodsAllList[g].buy_num += 1;
                    }
                  }
                  var shopCart1 = [];
                  myMap.forEach(function (value, key, myMap) {
                    shopCart1.push({
                      key,
                      value
                    });
                  });
                  that.setData({
                    goodsList: goodsList,
                    goodsAllList: goodsAllList,
                    goods_attr: goods_attr,
                    goods_attr_select: goods_attr_select,
                    shopCartNum: shopCartNum,
                    shopCartPrice: shopCartPrice,
                    casing_price: casing_price,
                    shopCart1: shopCart1,
                    attr_max: 1
                  });
                  if (that.data.is_take_number != 1) { // 是否为叫号
                    shop_box_num = JSON.stringify(shop_box_num)
                    if (goodsList.goods[i].is_attr == 1) {
                      if (goodsList.goods[i].nature.length > 0) {
                        request_addCart(that.data.addCardAPI, goodsList.goods[i].goods_id, that.data.gradeid == 15 ? 1 : 2, that.data.shopID, goodsList.goods[i].goods_attr[j].attr_buy_num, attr_select.attr_id, shop_box_num); // 多规格 多属性
                      } else {
                        request_addCart(that.data.addCardAPI, goodsList.goods[i].goods_id, that.data.gradeid == 15 ? 1 : 2, that.data.shopID, goodsList.goods[i].goods_attr[j].attr_buy_num, attr_select.attr_id, ''); // 多规格
                      }
                    } else {
                      request_addCart(that.data.addCardAPI, goodsList.goods[i].goods_id, that.data.gradeid == 15 ? 1 : 2, that.data.shopID, goodsList.goods[i].goods_attr[j].attr_buy_num, attr_select.attr_id, '');
                    }
                  }
                }
              }
            }
          }

        } else { // 无规格

          if (goodsList.goods[i].shopcate_id == attr_select.shopcate_id) {
            if (goodsList.goods[i].is_seckill == 1 && goodsList.goods[i].attr_buy_num >= goodsList.goods[i].limitations_num) {
              wx.showToast({
                title: '超出秒杀数量',
                icon: 'none'
              })
              return false;
            } else if (goodsList.goods[i].is_seckill == 1 && goodsList.goods[i].attr_buy_num >= goodsList.goods[i].seckill_num) {
              wx.showToast({
                title: '库存不足',
                icon: 'none'
              })
              return false;
            } else if (goodsList.goods[i].is_use_num == 1 && goodsList.goods[i].attr_buy_num >= goodsList.goods[i].inventory_num) {
              wx.showToast({
                title: '库存不足',
                icon: 'none'
              })
              return false;
            } else {
              if (goodsList.goods[i].attr_buy_num >= 99) {
                return false;
              } else {
                for (var l = 0; l < goodsList.cate.length; l++) {
                  if (goodsList.goods[i].cate_id == goodsList.cate[l].cate_id) { //判断右侧分类ID是否为现有ID
                    goodsList.cate[l].num += 1;
                    cate_id = goodsList.cate[l].cate_id
                  }
                }
                goodsList.goods[i].buy_num += 1; //选择时的数量
                goodsList.goods[i].attr_buy_num += 1; //分类ID 对应的数量
                shopCartNum += 1; //底部购物车数量
                shopCartPrice +=
                  goodsList.goods[i].is_shop_member == 0 //是否为会员价 0否 1是
                    ?
                    goodsList.goods[i].is_seckill == 0 //是否为秒杀1秒杀 0非秒杀
                      ?
                      goodsList.goods[i].sales_promotion_is == 0 //1促销 0非促销
                        ?
                        goodsList.goods[i].mall_price //商品商城价格
                          ?
                          goodsList.goods[i].mall_price //商品商城价格
                          :
                          goodsList.goods[i].price //商品价格
                        :
                        goodsList.goods[i].sales_promotion_price //促销价格
                      :
                      goodsList.goods[i].seckill_price //秒杀商品秒杀价格
                    :
                    goodsList.detail.is_shop_member_user == 0 //是否为会员
                      ?
                      goodsList.goods[i].mall_price //商品商城价格
                        ?
                        goodsList.goods[i].mall_price //商品商城价格
                        :
                        goodsList.goods[i].price //商品价格
                      :
                      goodsList.goods[i].shop_member_price; //会员价

                if (carClick) {
                  goodsList.goods[i].attr_buy_num += 1;
                } else {
                  goods_attr_select.attr_buy_num += 1;
                }
                var compare_id = '';
                if (that.data.shop_box_num instanceof Array) {
                  var shop_box_num = that.data.shop_box_num
                } else {
                  var shop_box_num = JSON.parse(that.data.shop_box_num)
                }

                for (var e = 0; e < shop_box_num.length; e++) {
                  compare_id = compare_id + '#' + shop_box_num[e]
                }
                if (carClick) {
                  compare_id = goodsList.goods[i].goods_id + compare_id
                } else {
                  compare_id = goods_attr_select.goods_id + compare_id
                }

                var shops_Num = 1;
                if (that.data.shopCart1.length > 0) {
                  for (var o = 0; o < that.data.shopCart1.length; o++) {
                    if (compare_id === that.data.shopCart1[o].key) {
                      shops_Num = parseInt(that.data.shopCart1[o].value.buy_num) + 1;
                    }
                  }
                }

                myMap.set(compare_id, {
                  'buy_num': shops_Num,
                  'goods_id': goodsList.goods[i].goods_id,
                  'attr_id': shop_box_num[0],
                  'photo': goodsList.goods[i].photo,
                  'title': carClick ? attr_select.title : goodsList.goods[i].title + '\n' + '(' + that.data.shop_box + ')',
                  'price': goodsList.goods[i].is_shop_member == 0 //是否为会员价 0否 1是
                    ?
                    goodsList.goods[i].is_seckill == 0 //是否为秒杀1秒杀 0非秒杀
                      ?
                      goodsList.goods[i].sales_promotion_is == 0 //1促销 0非促销
                        ?
                        goodsList.goods[i].mall_price //商品商城价格
                          ?
                          goodsList.goods[i].mall_price //商品商城价格
                          :
                          goodsList.goods[i].price //商品价格
                        :
                        goodsList.goods[i].sales_promotion_price //促销价格
                      :
                      goodsList.goods[i].seckill_price //秒杀商品秒杀价格
                    :
                    goodsList.detail.is_shop_member_user == 0 //是否为会员
                      ?
                      goodsList.goods[i].mall_price //商品商城价格
                        ?
                        goodsList.goods[i].mall_price //商品商城价格
                        :
                        goodsList.goods[i].price //商品价格
                      :
                      goodsList.goods[i].shop_member_price, //会员价,
                  'is_attr': goodsList.goods[i].is_attr,
                  'casing_price': goodsList.goods[i].casing_price,
                  'is_seckill': goodsList.goods[i].is_seckill,
                  'limitations_num': goodsList.goods[i].limitations_num,
                  'seckill_num': goodsList.goods[i].seckill_num,
                  'nature_box_id': compare_id,
                  'shop_box_num': JSON.stringify(shop_box_num),
                  'cate_id': cate_id,
                  'shopcate_id': attr_select.shopcate_id,
                  'goods_attr_title': that.data.shop_box
                });

                for (var g = 0; g < goodsAllList.length; g++) {
                  if (goodsAllList[g].goods_id == attr_select.goods_id) {
                    goodsAllList[g].buy_num += 1;
                  }
                }

                var shopCart1 = [];
                myMap.forEach(function (value, key, myMap) {
                  shopCart1.push({
                    key,
                    value
                  });
                });

                that.setData({
                  goodsList: goodsList,
                  goodsAllList: goodsAllList,
                  goods_attr: goods_attr,
                  goods_attr_select: goods_attr_select,
                  shopCartNum: shopCartNum,
                  shopCartPrice: shopCartPrice,
                  casing_price: casing_price,
                  shopCart1: shopCart1,
                  attr_max: 0
                });
                if (that.data.is_take_number != 1) { // 是否为叫号
                  shop_box_num = JSON.stringify(shop_box_num)
                  request_addCart(that.data.addCardAPI, goodsList.goods[i].goods_id, that.data.gradeid == 15 ? 1 : 2, that.data.shopID, shops_Num, attr_select.attr_id, shop_box_num); //多属性
                }
              }
            }
          }
        }
      }
    }
    // };
  },

  // 商品多规格减
  subtractionGoods_attr: function (e) {
    var that = this;
    var attr_select = e.currentTarget.dataset.attr_select ? e.currentTarget.dataset.attr_select : e.currentTarget.dataset.id;
    var carClick = e.currentTarget.dataset.carclick ? e.currentTarget.dataset.carclick : '';
    var goods_attr = this.data.goods_attr;
    var goods_attr_select = this.data.goods_attr_select;
    var goodsList = this.data.goodsList;
    var goodsAllList = this.data.goodsAllList;
    var shopCartNum = this.data.shopCartNum;
    var shopCartPrice = this.data.shopCartPrice;
    var casing_price = this.data.casing_price;
    var car_state = e.currentTarget.dataset.car_state ? e.currentTarget.dataset.car_state : '';
    var del_ss = e.currentTarget.dataset.del_ss ? e.currentTarget.dataset.del_ss : '';
    var cate_id;
    // if (goods_attr_select.attr_buy_num == 0) {
    //   return false;
    // } else {
    if (that.data.clickTime) {
      if (e.currentTarget.dataset.attr_select ? e.currentTarget.dataset.attr_select.attr_buy_num == 0 : e.currentTarget.dataset.id.attr_buy_num == 0) {
        return false;
      } else {
        for (var i = 0; i < goodsList.goods.length; i++) {
          if (goodsList.goods[i].goods_id == attr_select.goods_id) {
            if (goodsList.goods[i].goods_attr) { // 有规格
              for (var j = 0; j < goodsList.goods[i].goods_attr.length; j++) {
                if (goodsList.goods[i].goods_attr[j].attr_id == attr_select.attr_id) {
                  for (var l = 0; l < goodsList.cate.length; l++) {
                    if (goodsList.goods[i].cate_id == goodsList.cate[l].cate_id) { //判断右侧分类ID是否为现有ID
                      goodsList.cate[l].num -= 1;
                      cate_id = goodsList.cate[l].cate_id
                    }
                  }
                  goodsList.goods[i].buy_num -= 1; //选择时的数量
                  goodsList.goods[i].goods_attr[j].attr_buy_num -= 1; //分类ID 对应的数量
                  shopCartNum -= 1; //底部购物车数量
                  shopCartPrice -=
                    goodsList.goods[i].goods_attr[j].is_shop_member == 0 //是否为会员价 0否 1是
                      ?
                      goodsList.goods[i].goods_attr[j].is_seckill == 0 //是否为秒杀1秒杀 0非秒杀
                        ?
                        goodsList.goods[i].goods_attr[j].sales_promotion_is == 0 //1促销 0非促销
                          ?
                          goodsList.goods[i].goods_attr[j].mall_price //商品商城价格
                            ?
                            goodsList.goods[i].goods_attr[j].mall_price //商品商城价格
                            :
                            goodsList.goods[i].goods_attr[j].price //商品价格
                          :
                          goodsList.goods[i].goods_attr[j].sales_promotion_price //促销价格
                        :
                        goodsList.goods[i].goods_attr[j].seckill_price //秒杀商品秒杀价格
                      :
                      goodsList.detail.is_shop_member_user == 0 //是否为会员
                        ?
                        goodsList.goods[i].goods_attr[j].mall_price //商品商城价格
                          ?
                          goodsList.goods[i].goods_attr[j].mall_price //商品商城价格
                          :
                          goodsList.goods[i].goods_attr[j].price //商品价格
                        :
                        goodsList.goods[i].goods_attr[j].shop_member_price; //会员价
                  for (var k = 0; k < goods_attr.length; k++) { //主分类ID如果跟现有的分类ID相同则对数值 做加
                    if (goods_attr[k].attr_id == goods_attr_select.attr_id) {
                      goods_attr_select.attr_buy_num -= 1;
                      goods_attr[k].attr_buy_num -= 1;
                      casing_price -= goods_attr[k].casing_price;
                    }
                  }

                  var compare_id = '';
                  if (that.data.shop_box_num instanceof Array) {
                    var shop_box_num = that.data.shop_box_num
                  } else {
                    var shop_box_num = JSON.parse(that.data.shop_box_num)
                  }

                  for (var e = 0; e < shop_box_num.length; e++) {
                    compare_id = compare_id + '#' + shop_box_num[e]
                  }
                  if (carClick) {
                    compare_id = goodsList.goods[i].goods_id + compare_id
                  } else {
                    compare_id = goods_attr_select.goods_id + compare_id
                  }
                  var shops_Num = 1;
                  if (that.data.shopCart1.length > 0) {
                    for (var o = 0; o < that.data.shopCart1.length; o++) {
                      if (compare_id === that.data.shopCart1[o].key) {
                        shops_Num = parseInt(that.data.shopCart1[o].value.buy_num) - 1;
                      }
                    }
                  }
                  if (shops_Num == 0) {
                    myMap.delete(compare_id);
                  } else {
                    myMap.set(compare_id, {
                      'buy_num': shops_Num,
                      'goods_id': goodsList.goods[i].goods_id,
                      'attr_id': shop_box_num[0],
                      'photo': goodsList.goods[i].photo,
                      'title': carClick ? attr_select.title : goodsList.goods[i].title + '\n' + '(' + that.data.shop_box + ')',
                      'price': goodsList.goods[i].goods_attr[j].is_shop_member == 0 //是否为会员价 0否 1是
                        ?
                        goodsList.goods[i].goods_attr[j].is_seckill == 0 //是否为秒杀1秒杀 0非秒杀
                          ?
                          goodsList.goods[i].goods_attr[j].sales_promotion_is == 0 //1促销 0非促销
                            ?
                            goodsList.goods[i].goods_attr[j].mall_price //商品商城价格
                              ?
                              goodsList.goods[i].goods_attr[j].mall_price //商品商城价格
                              :
                              goodsList.goods[i].goods_attr[j].price //商品价格
                            :
                            goodsList.goods[i].goods_attr[j].sales_promotion_price //促销价格
                          :
                          goodsList.goods[i].goods_attr[j].seckill_price //秒杀商品秒杀价格
                        :
                        goodsList.detail.is_shop_member_user == 0 //是否为会员
                          ?
                          goodsList.goods[i].goods_attr[j].mall_price //商品商城价格
                            ?
                            goodsList.goods[i].goods_attr[j].mall_price //商品商城价格
                            :
                            goodsList.goods[i].goods_attr[j].price //商品价格
                          :
                          goodsList.goods[i].goods_attr[j].shop_member_price, //会员价,
                      'is_attr': goodsList.goods[i].is_attr,
                      'casing_price': goodsList.goods[i].goods_attr[j].casing_price,
                      'is_seckill': goodsList.goods[i].goods_attr[j].is_seckill,
                      'limitations_num': goodsList.goods[i].goods_attr[j].limitations_num,
                      'seckill_num': goodsList.goods[i].goods_attr[j].seckill_num,
                      'nature_box_id': compare_id,
                      'shop_box_num': JSON.stringify(shop_box_num),
                      'cate_id': cate_id,
                      'goods_attr_title': that.data.shop_box
                    });
                  }

                  for (var g = 0; g < goodsAllList.length; g++) {
                    if (goodsAllList[g].goods_id == attr_select.goods_id) {
                      goodsAllList[g].buy_num -= 1;
                    }
                  }
                  var shopCart1 = [];
                  myMap.forEach(function (value, key, myMap) {
                    shopCart1.push({
                      key,
                      value
                    });
                  });
                  that.setData({
                    goodsList: goodsList,
                    goodsAllList: goodsAllList,
                    goods_attr: goods_attr,
                    goods_attr_select: goods_attr_select,
                    shopCartNum: shopCartNum,
                    shopCartPrice: shopCartPrice,
                    casing_price: casing_price,
                    shopCart1: shopCart1,
                    attr_max: 1,
                    clickTime: false
                  });
                  if (that.data.is_take_number != 1) { // 是否为叫号
                    shop_box_num = JSON.stringify(shop_box_num)
                    if (goodsList.goods[i].is_attr == 1) {
                      if (goodsList.goods[i].nature.length > 0) {
                        request_addCart(that.data.addCardAPI, goodsList.goods[i].goods_id, that.data.gradeid == 15 ? 1 : 2, that.data.shopID, goodsList.goods[i].goods_attr[j].attr_buy_num, attr_select.attr_id, shop_box_num); // 多规格 多属性
                      } else {
                        request_addCart(that.data.addCardAPI, goodsList.goods[i].goods_id, that.data.gradeid == 15 ? 1 : 2, that.data.shopID, goodsList.goods[i].goods_attr[j].attr_buy_num, attr_select.attr_id, ''); // 多规格
                      }
                    } else {
                      request_addCart(that.data.addCardAPI, goodsList.goods[i].goods_id, that.data.gradeid == 15 ? 1 : 2, that.data.shopID, goodsList.goods[i].goods_attr[j].attr_buy_num, attr_select.attr_id, '');
                    }
                  }
                }
              }
            } else { // 无规格
              if (goodsList.goods[i].shopcate_id == attr_select.shopcate_id) {
                for (var l = 0; l < goodsList.cate.length; l++) {
                  if (goodsList.goods[i].cate_id == goodsList.cate[l].cate_id) { //判断右侧分类ID是否为现有ID
                    goodsList.cate[l].num -= 1;
                    cate_id = goodsList.cate[l].cate_id
                  }
                }
                goodsList.goods[i].buy_num -= 1; //选择时的数量
                goodsList.goods[i].attr_buy_num -= 1; //分类ID 对应的数量
                shopCartNum -= 1; //底部购物车数量
                shopCartPrice -=
                  goodsList.goods[i].is_shop_member == 0 //是否为会员价 0否 1是
                    ?
                    goodsList.goods[i].is_seckill == 0 //是否为秒杀1秒杀 0非秒杀
                      ?
                      goodsList.goods[i].sales_promotion_is == 0 //1促销 0非促销
                        ?
                        goodsList.goods[i].mall_price //商品商城价格
                          ?
                          goodsList.goods[i].mall_price //商品商城价格
                          :
                          goodsList.goods[i].price //商品价格
                        :
                        goodsList.goods[i].sales_promotion_price //促销价格
                      :
                      goodsList.goods[i].seckill_price //秒杀商品秒杀价格
                    :
                    goodsList.detail.is_shop_member_user == 0 //是否为会员
                      ?
                      goodsList.goods[i].mall_price //商品商城价格
                        ?
                        goodsList.goods[i].mall_price //商品商城价格
                        :
                        goodsList.goods[i].price //商品价格
                      :
                      goodsList.goods[i].shop_member_price; //会员价

                if (carClick) {
                  goodsList.goods[i].attr_buy_num -= 1;
                } else {
                  goods_attr_select.attr_buy_num -= 1;
                }
                var compare_id = '';
                if (that.data.shop_box_num instanceof Array) {
                  var shop_box_num = that.data.shop_box_num
                } else {
                  var shop_box_num = JSON.parse(that.data.shop_box_num)
                }

                for (var e = 0; e < shop_box_num.length; e++) {
                  compare_id = compare_id + '#' + shop_box_num[e]
                }
                if (carClick) {
                  compare_id = goodsList.goods[i].goods_id + compare_id
                } else {
                  compare_id = goods_attr_select.goods_id + compare_id
                }

                var shops_Num = 1;
                if (that.data.shopCart1.length > 0) {
                  for (var o = 0; o < that.data.shopCart1.length; o++) {
                    if (compare_id === that.data.shopCart1[o].key) {
                      shops_Num = parseInt(that.data.shopCart1[o].value.buy_num) - 1;
                    }
                  }
                }
                if (shops_Num == 0) {
                  myMap.delete(compare_id);
                } else {
                  myMap.set(compare_id, {
                    'buy_num': shops_Num,
                    'goods_id': goodsList.goods[i].goods_id,
                    'attr_id': shop_box_num[0],
                    'photo': goodsList.goods[i].photo,
                    'title': carClick ? attr_select.title : goodsList.goods[i].title + '\n' + '(' + that.data.shop_box + ')',
                    'price': goodsList.goods[i].is_shop_member == 0 //是否为会员价 0否 1是
                      ?
                      goodsList.goods[i].is_seckill == 0 //是否为秒杀1秒杀 0非秒杀
                        ?
                        goodsList.goods[i].sales_promotion_is == 0 //1促销 0非促销
                          ?
                          goodsList.goods[i].mall_price //商品商城价格
                            ?
                            goodsList.goods[i].mall_price //商品商城价格
                            :
                            goodsList.goods[i].price //商品价格
                          :
                          goodsList.goods[i].sales_promotion_price //促销价格
                        :
                        goodsList.goods[i].seckill_price //秒杀商品秒杀价格
                      :
                      goodsList.detail.is_shop_member_user == 0 //是否为会员
                        ?
                        goodsList.goods[i].mall_price //商品商城价格
                          ?
                          goodsList.goods[i].mall_price //商品商城价格
                          :
                          goodsList.goods[i].price //商品价格
                        :
                        goodsList.goods[i].shop_member_price, //会员价,
                    'is_attr': goodsList.goods[i].is_attr,
                    'casing_price': goodsList.goods[i].casing_price,
                    'is_seckill': goodsList.goods[i].is_seckill,
                    'limitations_num': goodsList.goods[i].limitations_num,
                    'seckill_num': goodsList.goods[i].seckill_num,
                    'nature_box_id': compare_id,
                    'shop_box_num': JSON.stringify(shop_box_num),
                    'cate_id': cate_id,
                    'shopcate_id': attr_select.shopcate_id,
                    'goods_attr_title': that.data.shop_box
                  });
                }
                for (var g = 0; g < goodsAllList.length; g++) {
                  if (goodsAllList[g].goods_id == attr_select.goods_id) {
                    goodsAllList[g].buy_num -= 1;
                  }
                }

                var shopCart1 = [];
                myMap.forEach(function (value, key, myMap) {
                  shopCart1.push({
                    key,
                    value
                  });
                });
                that.setData({
                  goodsList: goodsList,
                  goodsAllList: goodsAllList,
                  goods_attr: goods_attr,
                  goods_attr_select: goods_attr_select,
                  shopCartNum: shopCartNum,
                  shopCartPrice: shopCartPrice,
                  casing_price: casing_price,
                  shopCart1: shopCart1,
                  attr_max: 0,
                  clickTime: false
                });
                if (that.data.is_take_number != 1) { // 是否为叫号
                  shop_box_num = JSON.stringify(shop_box_num)
                  request_addCart(that.data.addCardAPI, goodsList.goods[i].goods_id, that.data.gradeid == 15 ? 1 : 2, that.data.shopID, shops_Num, attr_select.attr_id, shop_box_num); //多属性
                }

              }
            }
          }
        }

        setTimeout(() => {//防止用户快速点击
          that.setData({
            clickTime: true
          })
        }, 400)
      }
    }

  },



  //商品数量减少
  subtractionGoods: function (e) {
    var that = this;
    var goods_attr_select = that.data.goods_attr_select
    if (e.currentTarget.dataset.id.goods_attr) {
      that.setData({
        attr_max: 1
      })
    } else {
      that.setData({
        attr_max: 0
      })
    }
    var nums;
    var id;
    var goodsList = this.data.goodsList;
    var goodsAllList = this.data.goodsAllList;
    var shopCartNum = this.data.shopCartNum;
    var shopCartPrice = this.data.shopCartPrice;
    var casing_price = this.data.casing_price;
    for (var i = 0; i < goodsList.goods.length; i++) {
      if (goodsList.goods[i].goods_id == e.currentTarget.dataset.id.goods_id) {
        if (goodsList.goods[i].is_attr == 1 || goodsList.goods[i].nature.length > 0) {
          for (var o = 0; o < goodsList.goods[i].nature.length; o++) {
            goodsList.goods[i].nature[o].nature_arr[0].is_select_attr = false
          }
          var shop = that.data.shop_box;
          var shop_num = [];
          if (goodsList.goods[i].goods_attr) { //有规格
            shop.splice(0, 1);
            shop.splice(0, 0, goodsList.goods[i].goods_attr[0].attr_name);
            shop_num.splice(0, 1);
            shop_num.splice(0, 0, goodsList.goods[i].goods_attr[0].attr_id)
            var nature_box_id = [];
            nature_box_id.push(goodsList.goods[i].goods_attr[0].attr_id);
            for (var p = 1; p < goodsList.goods[i].nature.length + 1; p++) {
              shop.splice(p, 1);
              shop.splice(p, 0, goodsList.goods[i].nature[p - 1].nature_arr[0].nature_name)
              shop_num.splice(p, 1);
              shop_num.splice(p, 0, goodsList.goods[i].nature[p - 1].nature_arr[0].nature_id)
              goodsList.goods[i].nature[p - 1].nature_arr[0].is_select_attr = true
              nature_box_id.push(goodsList.goods[i].nature[p - 1].nature_arr[0].nature_id)
            }
            that.setData({
              is_attrs: true,
              attr_title: goodsList.goods[i].title,
              goods_attr: goodsList.goods[i].goods_attr,
              goods_attr_select: goodsList.goods[i].goods_attr[0],
              goods_attr_list: goodsList.goods[i],
              goods_attr_price: goodsList.goods[i].goods_attr[0].is_seckill == 0 ? goodsList.goods[i].goods_attr[0].sales_promotion_is == 0 ? goodsList.goods[i].goods_attr[0].mall_price ? goodsList.goods[i].goods_attr[0].mall_price : goodsList.goods[i].goods_attr[0].price : goodsList.goods[i].goods_attr[0].sales_promotion_price : goodsList.goods[i].goods_attr[0].seckill_price,
              nature: goodsList.goods[i].nature,
              shop_box: shop,
              shop_box_num: shop_num,
              attr_max: 1
            });
          } else { //无规格 有属性

            if (e.currentTarget.dataset.carclick == 'carClick') { //购物车点击减
              var cate_id;
              for (var l = 0; l < goodsList.cate.length; l++) {
                if (goodsList.goods[i].cate_id == goodsList.cate[l].cate_id) { //判断右侧分类ID是否为现有ID
                  goodsList.cate[l].num -= 1;
                  cate_id = goodsList.cate[l].cate_id
                }
              }
              goodsList.goods[i].buy_num -= 1; //选择时的数量
              goodsList.goods[i].attr_buy_num -= 1; //分类ID 对应的数量
              shopCartNum -= 1; //底部购物车数量
              shopCartPrice -=
                goodsList.goods[i].is_shop_member == 0 //是否为会员价 0否 1是
                  ?
                  goodsList.goods[i].is_seckill == 0 //是否为秒杀1秒杀 0非秒杀
                    ?
                    goodsList.goods[i].sales_promotion_is == 0 //1促销 0非促销
                      ?
                      goodsList.goods[i].mall_price //商品商城价格
                        ?
                        goodsList.goods[i].mall_price //商品商城价格
                        :
                        goodsList.goods[i].price //商品价格
                      :
                      goodsList.goods[i].sales_promotion_price //促销价格
                    :
                    goodsList.goods[i].seckill_price //秒杀商品秒杀价格
                  :
                  goodsList.detail.is_shop_member_user == 0 //是否为会员
                    ?
                    goodsList.goods[i].mall_price //商品商城价格
                      ?
                      goodsList.goods[i].mall_price //商品商城价格
                      :
                      goodsList.goods[i].price //商品价格
                    :
                    goodsList.goods[i].shop_member_price; //会员价
              that.data.goods_attr_select.attr_buy_num -= 1;
              var compare_id = ''; //商品拼接后形成的唯一ID
              var shop_box_num = JSON.parse(e.currentTarget.dataset.id.shop_box_num);
              for (var el = 0; el < shop_box_num.length; el++) {
                compare_id = compare_id + '#' + shop_box_num[el]
              }
              compare_id = goods_attr_select.goods_id + compare_id
              var shops_Num = 1; //商品数量
              if (that.data.shopCart1.length > 0) {
                for (var o = 0; o < that.data.shopCart1.length; o++) {
                  if (compare_id === that.data.shopCart1[o].key) {
                    shops_Num = parseInt(that.data.shopCart1[o].value.buy_num) - 1;
                  }
                }
              }
              myMap.set(compare_id, {
                'buy_num': shops_Num,
                'goods_id': goodsList.goods[i].goods_id,
                'attr_id': shop_box_num[0],
                'photo': goodsList.goods[i].photo,
                'title': e.currentTarget.dataset.carclick ? e.currentTarget.dataset.id.title : goodsList.goods[i].title,
                'price': goodsList.goods[i].is_shop_member == 0 //是否为会员价 0否 1是
                  ?
                  goodsList.goods[i].is_seckill == 0 //是否为秒杀1秒杀 0非秒杀
                    ?
                    goodsList.goods[i].sales_promotion_is == 0 //1促销 0非促销
                      ?
                      goodsList.goods[i].mall_price //商品商城价格
                        ?
                        goodsList.goods[i].mall_price //商品商城价格
                        :
                        goodsList.goods[i].price //商品价格
                      :
                      goodsList.goods[i].sales_promotion_price //促销价格
                    :
                    goodsList.goods[i].seckill_price //秒杀商品秒杀价格
                  :
                  goodsList.detail.is_shop_member_user == 0 //是否为会员
                    ?
                    goodsList.goods[i].mall_price //商品商城价格
                      ?
                      goodsList.goods[i].mall_price //商品商城价格
                      :
                      goodsList.goods[i].price //商品价格
                    :
                    goodsList.goods[i].shop_member_price,
                'is_attr': goodsList.goods[i].is_attr,
                'casing_price': goodsList.goods[i].casing_price,
                'is_seckill': goodsList.goods[i].is_seckill,
                'limitations_num': goodsList.goods[i].limitations_num,
                'seckill_num': goodsList.goods[i].seckill_num,
                'nature_box_id': compare_id,
                'shop_box_num': JSON.stringify(shop_box_num),
                'cate_id': cate_id,
                'goods_attr_title': that.data.shop_box
              });
              for (var g = 0; g < goodsAllList.length; g++) {
                if (goodsAllList[g].goods_id == e.currentTarget.dataset.id.goods_id) {
                  goodsAllList[g].buy_num -= 1;
                }
              }
              var shopCart1 = [];
              myMap.forEach(function (value, key, myMap) {
                shopCart1.push({
                  key,
                  value
                });
              });
              that.setData({
                goodsList: goodsList,
                goodsAllList: goodsAllList,
                goods_attr_select: that.data.goods_attr_select,
                shopCartNum: shopCartNum,
                shopCartPrice: shopCartPrice,
                casing_price: casing_price,
                shopCart1: shopCart1,
              });
              if (that.data.is_take_number != 1) { // 是否为叫号
                shop_box_num = JSON.stringify(shop_box_num)
                request_addCart(that.data.addCardAPI, goodsList.goods[i].goods_id, that.data.gradeid == 15 ? 1 : 2, that.data.shopID, shops_Num, e.currentTarget.dataset.id.attr_id, shop_box_num); //多属性
              }
            } else { //列表点击商品减
              var nature_box_id = [];
              for (var p = 0; p < goodsList.goods[i].nature.length; p++) {
                shop.splice(p, 0);
                shop.splice(p, 0, goodsList.goods[i].nature[p].nature_arr[0].nature_name)
                shop_num.splice(p, 0);
                shop_num.splice(p, 0, goodsList.goods[i].nature[p].nature_arr[0].nature_id)
                goodsList.goods[i].nature[p].nature_arr[0].is_select_attr = true
                nature_box_id.push(goodsList.goods[i].nature[p].nature_arr[0].nature_id)
              }
              that.setData({
                is_attrs: true,
                attr_title: goodsList.goods[i].title,
                goods_attr_select: goodsList.goods[i],
                goods_attr_list: goodsList.goods[i],
                goods_attr_price: goodsList.goods[i].is_seckill == 0 ? goodsList.goods[i].sales_promotion_is == 0 ? goodsList.goods[i].mall_price ? goodsList.goods[i].mall_price : goodsList.goods[i].price : goodsList.goods[i].sales_promotion_price : goodsList.goods[i].seckill_price,
                nature: goodsList.goods[i].nature,
                shop_box: shop,
                shop_box_num: shop_num,
                attr_max: 0
              });
            }
          }
          var ids_box = '';
          for (var ids = 0; ids < nature_box_id.length; ids++) {
            ids_box = ids_box + '#' + nature_box_id[ids]
          }
          ids_box = e.currentTarget.dataset.id.goods_id + ids_box;
          that.setData({
            nature_box_id: ids_box
          })
          if (that.data.shopCart1.length > 0) {
            for (var o = 0; o < that.data.shopCart1.length; o++) {
              var goods_attr_select = that.data.goods_attr_select
              if (ids_box === that.data.shopCart1[o].key) {
                goods_attr_select.attr_buy_num = that.data.shopCart1[o].value.buy_num
                that.setData({
                  goods_attr_select,
                })
                return
              } else {
                goods_attr_select.attr_buy_num = 0;
                that.setData({
                  goods_attr_select,
                })
              }
            }
          } else {
            var goods_attr_select = that.data.goods_attr_select
            goods_attr_select.attr_buy_num = 0;
            that.setData({
              goods_attr_select
            })
          }
          return false;
        } else {
          //无规格
          if (goodsList.goods[i].buy_num == 0) {
            return false;
          } else {
            if (goodsList.goods[i].goods_attr) {
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
              casing_price -= goodsList.goods[i].casing_price;
              if (that.data.is_take_number != 1) {
                request_addCart(that.data.addCardAPI, goodsList.goods[i].goods_id, that.data.gradeid == 15 ? 1 : 2, that.data.shopID, goodsList.goods[i].buy_num, '');
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
            } else {
              if (goodsList.goods[i].nature.length > 0) { //多属性
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

                var shop_nums = e.currentTarget.dataset.id.buy_num - 1
                goodsList.goods[i].buy_num -= 1;
                shopCartNum -= 1;

                shopCartPrice -= goodsList.goods[i].is_shop_member == 0 ? goodsList.goods[i].price : goodsList.detail.is_shop_member_user == 0 ? goodsList.goods[i].price : goodsList.goods[i].shop_member_price;
                casing_price -= goodsList.goods[i].casing_price;
                if (that.data.is_take_number != 1) {
                  request_addCart(that.data.addCardAPI, goodsList.goods[i].goods_id, that.data.gradeid == 15 ? 1 : 2, that.data.shopID, goodsList.goods[i].buy_num, '');
                }

                that.setData({
                  goodsList: goodsList,
                  goodsAllList: goodsAllList,
                  shopCartNum: shopCartNum,
                  shopCartPrice: shopCartPrice,
                  casing_price: casing_price
                });
                var ids_box = '';
                if (e.currentTarget.dataset.id.shop_box_num instanceof Array) {
                  var nature_box_id = e.currentTarget.dataset.id.shop_box_num
                } else {
                  var nature_box_id = JSON.parse(e.currentTarget.dataset.id.shop_box_num)
                }

                for (var ids = 0; ids < nature_box_id.length; ids++) {
                  ids_box = ids_box + '#' + nature_box_id[ids]
                }
                // 添加商品到购物车
                if (goodsList.goods[i].buy_num == 0) {
                  myMap.delete(ids_box);
                } else {
                  myMap.set(ids_box, {
                    'buy_num': shop_nums,
                    'goods_id': goodsList.goods[i].goods_id,
                    'photo': goodsList.goods[i].photo,
                    'price': goodsList.goods[i].is_shop_member == 0 ? goodsList.goods[i].price : goodsList.detail.is_shop_member_user == 0 ? goodsList.goods[i].price : goodsList.goods[i].shop_member_price,
                    'title': e.currentTarget.dataset.id.title,
                    'is_attr': goodsList.goods[i].is_attr,
                    'casing_price': goodsList.goods[i].casing_price,
                    'shop_box_num': e.currentTarget.dataset.id.shop_box_num,
                    'seckill_num': e.currentTarget.dataset.id.seckill_num,
                    'nature_box_id': e.currentTarget.dataset.id.nature_box_id,
                    'limitations_num': e.currentTarget.dataset.id.limitations_num,
                    'is_seckill': e.currentTarget.dataset.id.is_seckill,
                    'cate_id': e.currentTarget.dataset.id.cate_id,
                    'casing_price': e.currentTarget.dataset.id.casing_price,
                    'attr_id': e.currentTarget.dataset.id.attr_id
                  });
                  var shopCart1 = [];
                  myMap.forEach(function (value, key, myMap) {
                    shopCart1.push({
                      key,
                      value
                    });
                  });
                  that.setData({
                    shopCart1
                  })
                }
              } else { //无规格 无属性
                for (var i = 0; i < goodsList.goods.length; i++) {
                  if (goodsList.goods[i].goods_id == e.currentTarget.dataset.id.goods_id) {

                    if (goodsList.goods[i].is_attr == 1) {
                      for (var o = 0; o < goodsList.goods[i].nature.length; o++) {
                        goodsList.goods[i].nature[o].nature_arr[0].is_select_attr = false
                      }
                      var shop = that.data.shop_box;
                      var shop_num = [];
                      shop.splice(0, 1);
                      shop.splice(0, 0, goodsList.goods[i].goods_attr[0].attr_name);
                      shop_num.splice(0, 1);
                      shop_num.splice(0, 0, goodsList.goods[i].goods_attr[0].attr_id)
                      var nature_box_id = [];
                      nature_box_id.push(goodsList.goods[i].goods_attr[0].attr_id);
                      for (var p = 1; p < goodsList.goods[i].nature.length + 1; p++) {
                        shop.splice(p, 1);
                        shop.splice(p, 0, goodsList.goods[i].nature[p - 1].nature_arr[0].nature_name)
                        shop_num.splice(p, 1);
                        shop_num.splice(p, 0, goodsList.goods[i].nature[p - 1].nature_arr[0].nature_id)
                        goodsList.goods[i].nature[p - 1].nature_arr[0].is_select_attr = true
                        nature_box_id.push(goodsList.goods[i].nature[p - 1].nature_arr[0].nature_id)
                      }
                      var ids_box = '';
                      for (var ids = 0; ids < nature_box_id.length; ids++) {
                        ids_box = ids_box + '#' + nature_box_id[ids]
                      }
                      that.setData({
                        // is_attr: true,
                        is_attrs: true,
                        attr_title: goodsList.goods[i].title,
                        goods_attr: goodsList.goods[i].goods_attr,
                        goods_attr_select: goodsList.goods[i].goods_attr[0],
                        goods_attr_list: goodsList.goods[i],
                        goods_attr_price: goodsList.goods[i].is_seckill == 0 ? goodsList.goods[i].sales_promotion_is == 0 ? goodsList.goods[i].price : goodsList.goods[i].sales_promotion_price : goodsList.goods[i].seckill_price,
                        nature: goodsList.goods[i].nature,
                        shop_box: shop,
                        shop_box_num: shop_num,
                        nature_box_id: ids_box
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
                        casing_price -= goodsList.goods[i].casing_price;
                        if (that.data.is_take_number != 1) {
                          request_addCart(that.data.addCardAPI, goodsList.goods[i].goods_id, that.data.gradeid == 15 ? 1 : 2, that.data.shopID, goodsList.goods[i].buy_num, '');
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
            }
          }
        }

      }
    }
    // }

  },

  //优惠卷显示
  coupon: function () {
    var that = this;
    if (wx.getStorageSync('loginToken') == '') {
      wx.navigateTo({
        url: '../../login/login',
      })
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
  pickUp: function (e) {
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
      success: function (res) {
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
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  //关闭优惠卷
  closeCoupon: function () {
    this.setData({
      isCouponShow: false
    });
  },

  // 购物车
  shopCart: function () {
    var that = this;
    var shopCart = [];
    myMap.forEach(function (value, key, myMap) {
      shopCart.push({
        key,
        value
      });
    });
    this.setData({
      isShopCart: true,
      shopCart: shopCart
    });
  },

  // 购物车隐藏
  isShopCart: function () {
    this.setData({
      isShopCart: false,
    });
    var that = this;
  },

  //清空购物车
  clearCart: function () {
    var that = this;
    var goodsCartList = this.data.goodsCartList;
    this.setData({
      isShopCart: false,
      shopCart: [],
      shopCart1: [],
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
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })

  },

  //购物车商品添加
  shopCartAdd: function (e) {
    var that = this;
    if (e.currentTarget.dataset.is_attr == 1) {
      that.setData({
        shop_box_num: e.currentTarget.dataset.id.shop_box_num,
      })
      this.addGoods_attr(e);
    } else {
      if (e.currentTarget.dataset.id.nature_box_id || e.currentTarget.dataset.id.goods_attr_title) {
        that.setData({
          shop_box_num: e.currentTarget.dataset.id.shop_box_num,
        })
        this.addGoods_attr(e);
      } else {
        this.addGoods(e)
      }
    }
    this.shopCart();
  },


  shopCartSubtraction: function (e) {
    var that = this;
    if (e.currentTarget.dataset.is_attr == 1) {
      that.setData({
        shop_box_num: e.currentTarget.dataset.id.shop_box_num,
      })
      this.subtractionGoods_attr(e);
    } else {
      if (e.currentTarget.dataset.id.nature_box_id || e.currentTarget.dataset.id.goods_attr_title) {
        that.setData({
          shop_box_num: e.currentTarget.dataset.id.shop_box_num,
        })
        this.subtractionGoods_attr(e);
      } else {
        this.subtractionGoods(e);
      }
    }
    this.shopCart();
  },




  //删除单个商品
  deletingCurrent: function (e) {
    var that = this;
    // if (that.data.is_attr == 0){
    //   myMap.delete(e.currentTarget.dataset.id.nature_box_id);
    // } else if(that.data.is_attr == 1){
    //   myMap.delete(e.currentTarget.dataset.id.nature_box_id);
    // }
    for (var i = 0; i < e.currentTarget.dataset.id.buy_num; i++) {
      that.shopCartSubtraction(e)
    }
    that.shopCart();
    // that.setData({
    //   shopCartNum: that.data.shopCartNum - e.currentTarget.dataset.id.buy_num
    // })
    if (this.data.shopCart == '') {
      that.setData({
        isShopCart: false
      })
    }
    if (that.data.is_take_number != 1) {
      request_addCart(that.data.addCardAPI, that.data.gradeid == 15 ? e.currentTarget.dataset.id.product_id : e.currentTarget.dataset.id.goods_id, that.data.gradeid == 15 ? 1 : 2, that.data.shopID, 0, e.currentTarget.dataset.id.is_attr == 0 ? '' : e.currentTarget.dataset.id.attr_id);
    }

  },

  // 商品详情
  goodsDetails: function (e) {
    var that = this;
    var goodsDetailsList = [];
    var goodsAllList = this.data.goodsAllList;


    if (this.data.gradeid == 15) {
      this.setData({
        isGoodsDetails: true,
        goodsDetailsList: e.currentTarget.dataset.item,
        shopCartNumBox: e.currentTarget.dataset.item.buy_num
      })
      console.log("-----------------");
      console.log(goodsDetailsList);

    } else {

      for (var i = 0; i < that.data.goodsList.goods.length; i++) {
        if (e.currentTarget.dataset.item.goods_id == that.data.goodsList.goods[i].goods_id) {
          wx.navigateTo({
            url: '../shopDetails/productDetails/productDetails?arrList=' + JSON.stringify(that.data.goodsList.goods[i]) + '&shopID=' + that.data.shopID + "&gradeid=" + that.data.gradeid + "&shopCart1=" + JSON.stringify(that.data.shopCart1),
          })
        }
      }

    }
  },

  // 关闭商品详情
  goodsDetailsClose: function () {
    this.setData({
      isGoodsDetails: false
    })
  },
  showClose: function () {
    this.setData({
      isGoodsDetails: true
    })
  },



  //选好了
  confirmOrder: function (e) {
    var that = this;
    var shopCart = [];
    myMap.forEach(function (value, key, myMap) {
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

      if (that.data.is_take_number == "") { // 叫号为空

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
      } else {
        wx.navigateTo({
          url: '../../../../confirmOrder/confirmOrder?shopID=' + that.data.shopID + "&shopName=" + that.data.goodsList.detail.shop_name + "&gradeid=" + that.data.gradeid + "&shopCart=" + JSON.stringify(that.data.shopCart) + "&sinceMoney=" + that.data.goodsList.detail.since_money + "&shopCartNum=" + that.data.shopCartNum + "&shopCartPrice=" + that.data.shopCartPrice + "&logistics=" + that.data.goodsList.detail.logistics + "&casing_price=" + that.data.casing_price + "&reserve_table_id=" + that.data.reserve_table_id + '&isTakeNumber=' + that.data.is_take_number
        })
      }
    }
  },

  // 点击订桌
  clickTable: function () {
    var that = this;
    if (wx.getStorageSync('loginToken') == '') {
      wx.navigateTo({
        url: '../../login/login',
      })
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
  clickSmartPay: function () {
    var that = this;
    if (wx.getStorageSync('loginToken') == '') {
      wx.navigateTo({
        url: '../../login/login',
      })
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
  smartPayChange: function (e) { },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
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
    myMap.clear();
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

  // 取消
  clickCancel: function () {
    this.setData({
      userLogin: false
    });
  },

  // 允许获取权限
  clickAllow: function (e) {
    var that = this;
    var nickName = e.detail.userInfo.nickName;
    var face = e.detail.userInfo.avatarUrl;
    var encryptedData = e.detail.encryptedData;
    var iv = e.detail.iv;
    wx.login({
      success: function (res) {
        var code = res.code;
        getApp().globalData.code = res.code;
        if (code) {
          getApp().getOpenID(code, nickName, face, encryptedData, iv);
        }
      },
      fail: function (res) { },
      complete: function (res) {
        that.setData({
          userLogin: false
        });
      },
    });
    // getApp().wxGetSetting();
    getApp().globalData.userLogin = true;
  },

  // 点击头部
  clickeShopNav: function (e) {
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
  evaluation: function () {
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
      success: function (res) {
        if (res.data.state == 0) {
          wx.showToast({
            title: res.data.msg,
          })
        } else if (res.data.msg == '暂无数据') {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
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
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  // 时间转换
  timestampToTime: function (timestamp) {
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
  clickCoupon: function () {
    var that = this;
    that.setData({
      isFavourable: true
    });
  },

  // 关闭满减
  closeFavourable: function () {
    var that = this;
    that.setData({
      isFavourable: false
    });
  },

  // 领取优惠券
  clickReceive: function (e) {
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
      success: function (res) {
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
      fail: function (res) { },
      complete: function (res) { },
    })
  },
})