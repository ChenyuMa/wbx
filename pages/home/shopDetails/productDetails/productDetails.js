// pages/home/shopDetails/productDetails/productDetails.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: getApp().globalData.imgUrls,
    shopID: '',
    gradeid: '',
    list: [], // 请求的数据
    arrList: [], // 接收过来的数据
    goodsId: '',
    is_attr: false,
    is_select_attr: 0,
    goods_attr_select: [], // 商品规格
    shopCart: [],
    collected: false,
    is_share: false,
    myrich: [],
    lazy_load: true,

    goods_attr: [],
    shop_box: [], //多规格组合数组(页面展示使用)
    shop_box_num: [], //多规格组合数组(接口传输使用)
    nature_box_id: [], //购物Key
    shopCart1: [], //购物车临时数组

    isSalesman: '' // 判断销量
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    that.setData({
      arrList: JSON.parse(options.arrList),
      shopID: options.shopID,
      gradeid: options.gradeid,
      is_share: options.is_share ? true : false,
      shopCart: options.shopCart == undefined ? options.shopCart: JSON.parse(options.shopCart),
      // list: options.list ? JSON.parse(options.list) : [],
      isSalesman: wx.getStorageSync('is_salesman')
    })
    wx.showShareMenu({
      withShareTicket: true,
    });
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    that.getGoodsDetail();
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
    var that = this;
    return {
      title: that.data.list.title,
      path: 'pages/home/shopDetails/productDetails/productDetails?shopID=' + that.data.shopID + "&gradeid=" + that.data.gradeid + "&list=" + JSON.stringify(that.data.list) + "&arrList=" + JSON.stringify(that.data.arrList) + "&is_share=" + that.data.is_share,
      success: function(res) {
        //可以获取群组信息
        wx.getShareInfo({
          shareTicket: shareTickets[0],
          success: function(res) {}
        })
      },
      fail: function(res) {}
    }
  },

  /**
   * 获取商品详情
   */
  getGoodsDetail: function() {
    var that = this;
    wx.request({
      url: getApp().globalData.url + "/api/shop/get_goods_detail",
      data: {
        goods_id: that.data.arrList.goods_id,
        login_token: wx.getStorageSync('loginToken'),
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {

        var content = res.data.data.details;
        content = content.replace(/style=\"\"/gi, '');
        content = content.replace(/\<img/gi, '<img style="width:100%; height:100%;"');

        that.setData({
          list: res.data.data,
          myrich: content
        })
        if (res.data.data.is_favorites == 1) {
          that.setData({
            collected: true,
          })
        }
      },
      fail: function(res) {},
      complete: function(res) {
        var list = that.data.list;
        list.buy_num = that.data.arrList.buy_num;
        if (list.is_attr == 1) {
          list.goods_attr = that.data.arrList.goods_attr_select;
          that.setData({
            goods_attr_select: that.data.arrList.goods_attr[0],
          });
        }
        that.setData({
          list: list,
        })
      },
    })
  },

  // 增加数量
  addGoods: function(e) {
    var that = this;
    var item = that.data.arrList;

    // 判断是否是多规格
    if (item.is_attr == 1 || (item.nature!=null&&item.nature.length>0)) {
      that.setData({
        is_attr: true,
      })
    } else {
      // item.buy_num += 1;
      // that.setData({
      //   list: item
      // });
    }
  },


  // 点击关闭多规格选择弹窗
  close_attr: function(e) {
    var that = this;
    that.setData({
      is_attr: false
    })
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    prevPage.close_attr(e)
  },

  // 多规格商品选择
  // select_goods_attr: function(e) {
  //   var that = this;
  //   var goods_attr_list = this.data.goods_attr_list;
  //   var shopDetail = e.currentTarget.dataset; // 多规格商品详情

  //   that.setData({
  //     is_select_attr: shopDetail.index,
  //     goods_attr_select: shopDetail.item,
  //   });
  // },

  select_goods_attrs: function(e) {
    var that = this;

    var shop = that.data.shop_box;
    var shop_num = that.data.shop_box_num;
    var goods_attr_select = that.data.goods_attr_select;

    if (e.currentTarget.dataset.click == 'new') {
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
      shop.splice(itemsIndex + 1, 1);
      shop.splice(itemsIndex + 1, 0, shop_item)
      shop_num.splice(itemsIndex + 1, 1);
      shop_num.splice(itemsIndex + 1, 0, shop_items)
      var arrayList = that.data.arrList
      arrayList.nature = content
      that.setData({
        arrList: arrayList,
        shop_box: shop,
        shop_box_num: shop_num,
        nature_box_id: []
      })

    } else if (e.currentTarget.dataset.click == 'former') {
      var index = e.currentTarget.dataset.index;
      var shop_item = that.data.arrList.goods_attr[index].attr_name;
      var shop_items = that.data.arrList.goods_attr[index].attr_id;

      shop.splice(0, 1);
      shop.splice(0, 0, shop_item)
      shop_num.splice(0, 1);
      shop_num.splice(0, 0, shop_items)

      that.setData({
        is_select_attr: index,
        goods_attr_select: that.data.arrList.goods_attr[index],
        goods_attr_price: that.data.arrList.goods_attr[index].is_seckill == 0 ? that.data.arrList.goods_attr[index].sales_promotion_is == 0 ? that.data.arrList.goods_attr[index].mall_price ? that.data.arrList.goods_attr[index].mall_price : that.data.arrList.goods_attr[index].price : that.data.arrList.goods_attr[index].sales_promotion_price : that.data.arrList.goods_attr[index].seckill_price,
        shop_box: shop,
        shop_box_num: shop_num,
        nature_box_id: []
      });
    }
    var compare_id = '';
    for (var e = 0; e < shop_num.length; e++) {
      compare_id = compare_id + '#' + shop_num[e]
    }
    if (that.data.shopCart1.length > 0) { // 判断是否有值
      for (var o = 0; o < that.data.shopCart1.length; o++) {
        var goods_attr_select = that.data.goods_attr_select
        if (compare_id === that.data.shopCart1[o].key) {
          goods_attr_select.attr_buy_num = that.data.shopCart1[o].value.buy_num
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


  // 减少数量
  subtractionGoods: function(e) {
    var that = this
    var item = this.data.list;
    if (e.currentTarget.dataset.id.buy_num == 0) {
      return false;
    } else {
      if (item.is_attr == 1) {
        that.setData({
          is_attr: true
        })

      } else {
        item.buy_num -= 1;
        that.setData({
          list: item
        });
      }
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2];
      prevPage.subtractionGoods(e)
    }

  },

  // 多规格商品加
  addGoods_attr: function(e) {
    var that = this;
    var list = this.data.list;
    var goods_attr_select = that.data.goods_attr_select;
    list.buy_num += 1;
    goods_attr_select.attr_buy_num += 1;
    for (var i = 0; i < list.goods_attr.length; i++) {
      if (goods_attr_select.attr_id == list.goods_attr[i].attr_id) {
        list.goods_attr[i].attr_buy_num += 1;
      }
    }
    that.setData({
      goods_attr_select: goods_attr_select,
      list: list
    })
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    prevPage.addGoods_attr(e)
  },

  // 多规格商品减
  subtractionGoods_attr: function(e) {
    var that = this;
    var list = this.data.list;
    var goods_attr_select = that.data.goods_attr_select;

    if (list.buy_num == 0) {
      return
    } else {
      if (goods_attr_select.attr_buy_num == 0) {
        return
      } else {
        list.buy_num -= 1;
        goods_attr_select.attr_buy_num -= 1;
        for (var i = 0; i < list.goods_attr.length; i++) {
          if (goods_attr_select.attr_id == list.goods_attr[i].attr_id) {
            list.goods_attr[i].attr_buy_num -= 1;
          }
        }
        that.setData({
          goods_attr_select: goods_attr_select,
          list: list
        })
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];
        prevPage.subtractionGoods_attr(e)
      }
    }
  },

  // 添加到购物车
  addShoppingCart: function(e) {
    // var that = this;
    // var item = this.data.list;
    // if (item.is_attr == 1) {
    //   that.setData({
    //     is_attr: true
    //   })
    // } else {
    //   item.buy_num += 1;
    //   that.setData({
    //     list: item
    //   });
    //   var pages = getCurrentPages();
    //   var prevPage = pages[pages.length - 2];
    //   prevPage.addGoods(e)
    // }
    wx.showToast({
      icon:'none',
      title:'请返回店铺购买',
      duration:3000
    })
  },

  //选好了（直接调用上一个页面选好了方法）
  // subconfirmOrder: function(e) {
  //   var pages = getCurrentPages();
  //   var prevPage = pages[pages.length - 2];
  //   wx.navigateBack({ 
  //     data:1,
  //     success: function(){
  //       prevPage.confirmOrder();  // 在ios上不会执行
  //     }
  //   })

  // },

  // 店铺
  returnShop: function(e) {
    var that = this;
    if (this.data.is_share) {
      wx.navigateTo({
        url: '../../shopDetails/shopDetails?shopID=' + that.data.shopID + "&gradeid=" + that.data.gradeid,
      })
    } else {
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2];
      wx.navigateBack({
        data: 1,
      })
    }

  },

  // 点击收藏
  onCollect: function(e) {
    var that = this;
    wx.request({
      url: getApp().globalData.url + "/api/mall/favorites",
      data: {
        login_token: wx.getStorageSync('loginToken'),
        goods_id: that.data.arrList.goods_id,
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        that.setData({
          collected: true
        })
        if (res.data.msg == '您已经收藏过了！') {
          wx.showToast({
            title: '您已经收藏过了！',
          })
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },

})