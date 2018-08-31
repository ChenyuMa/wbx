// pages/shopCart/shopCart.js
// 购物车请求数据
var request_shopCart = function (API, shopID, that) {
  wx.request({
    url: getApp().globalData.url + API,
    data: {
      login_token: wx.getStorageSync('loginToken'),
      shop_id: shopID
    },
    header: { 'content-type': 'application/json' },
    method: 'POST',
    dataType: 'json',
    responseType: 'text',
    success: function (res) {
      console.log('购物车',res);
      if (res.data.msg == "暂无数据"){
        that.setData({
          shopCart_list: [],
          is_editor:false
        });
      } else 
      // if (res.data.msg == "请先绑定手机"){
      //   wx.navigateTo({
      //     url: '../bindPhone/bindPhone',
      //   })
      // }else 
      if(res.data.msg == '请先登陆'){
        that.setData({ userLogin:true});
      }else{
        that.setData({
          shopCart_list: res.data.data
        });
        all_secected(that);
      }
    },
    fail: function (res) { },
    complete: function (res) { },
  })
};

// 页面价值判断是否全选
var all_secected = function (that) {
  var shopCart_list = that.data.shopCart_list;
  for (var i = 0; i < shopCart_list.length; i++) {
    var shoplist = shopCart_list[i].goods_cart;
    for (var j = 0; j < shoplist.length; j++) {
      if (shoplist[j].selected == 0) {
        shopCart_list[i].selected_all = 0;
        that.setData({
          shopCart_list: shopCart_list
        });
        break;
      }
    }
  };
};


// 购物车勾选
var request_checkCart = function (API, cartID, selected, that) {
  wx.request({
    url: getApp().globalData.url + API,
    data: {
      login_token: wx.getStorageSync('loginToken'),
      cart_id: cartID,
      selected: selected
    },
    header: { 'content-type': 'application/json' },
    method: 'POST',
    dataType: 'json',
    responseType: 'text',
    success: function (res) {
      request_shopCart(that.data.shopCartAPI, '', that);
    },
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
    scrollY: true,
    shopCartAPI: '/api/goodscart/get_cart',
    // 购物车数据
    shopCart_list: [],
    // 是否编辑
    is_editor: false,
    // 是否选中当前商品
    is_check: false,
    selectAPI: '/api/goodscart/secected_cart',
    imgUrls: getApp().globalData.imgUrls,
    checkImg: 'login_choose_nor@2x.png',
    is_checkImg: 'login_choose_sel@2x.png',
    //判断是否全选
    allSelectAPI: '/api/goodscart/secected_cart_all',
    // 商品减少
    subtractAPI: '/api/goodscart/reduce_goods_num',
    // 商品增加
    addGoodsAPI: '/api/goodscart/add_goods_num',
    // 删除购物车全部商品
    deleteAll_shopCart: '/api/goodscart/delete_shop_cart',
    // 删除购物车单个数据
    delete_shopCart: '/api/goodscart/delete_cart',
    userLogin:false
  },

  // 编辑商品
  editor_goods: function () {
    var that = this;
    this.setData({
      is_editor: !that.data.is_editor
    });
  },

  // 全选发生改变
  checkAll: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var shopCart_list = this.data.shopCart_list;
    if (shopCart_list[index].selected_all == 1) {
      wx.request({
        url: getApp().globalData.url + that.data.allSelectAPI,
        data: {
          login_token: wx.getStorageSync('loginToken'),
          selected: 0,
          shop_id: e.currentTarget.dataset.shopid
        },
        header: { 'content-type': 'application/json' },
        method: 'POST',
        dataType: 'json',
        responseType: 'text',
        success: function (res) {
          request_shopCart(that.data.shopCartAPI, '', that);
        },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else if (shopCart_list[index].selected_all == 0) {
      wx.request({
        url: getApp().globalData.url + that.data.allSelectAPI,
        data: {
          login_token: wx.getStorageSync('loginToken'),
          selected: 1,
          shop_id: e.currentTarget.dataset.shopid
        },
        header: { 'content-type': 'application/json' },
        method: 'POST',
        dataType: 'json',
        responseType: 'text',
        success: function (res) {
          request_shopCart(that.data.shopCartAPI, '', that);
        },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
  },


  // 单选改变事件
  checkChange: function (e) {
    var that = this;
    var value = e.currentTarget.dataset.value;
    var shopCart_list = this.data.shopCart_list;
    for (var i = 0; i < shopCart_list.length; i++) {
      var goods_cart = shopCart_list[i].goods_cart;
      for (var j = 0; j < goods_cart.length; j++) {
        if (goods_cart[j].cart_id == value) {
          if (goods_cart[j].selected == 0) {
            request_checkCart(that.data.selectAPI, value, 1, that);
          } else {
            request_checkCart(that.data.selectAPI, value, 0, that);
          }
        }
      }
    }

  },

  // 当前商品减
  subtractGoods: function (e) {
    var that = this;
    wx.request({
      url: getApp().globalData.url + that.data.subtractAPI,
      data: {
        login_token: wx.getStorageSync('loginToken'),
        cart_id: e.currentTarget.dataset.cartid
      },
      header: { 'content-type': 'application/json' },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        request_shopCart(that.data.shopCartAPI, '', that);
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  // 当前商品增
  addGoods: function (e) {
    var that = this;
    wx.request({
      url: getApp().globalData.url + that.data.addGoodsAPI,
      data: {
        login_token: wx.getStorageSync('loginToken'),
        cart_id: e.currentTarget.dataset.cartid
      },
      header: { 'content-type': 'application/json' },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        request_shopCart(that.data.shopCartAPI, '', that);
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  // 清空购物车
  delete_shopCart: function () {
    var that = this;
    var shopCart_list = this.data.shopCart_list;
    for (var i = 0; i < shopCart_list.length; i++) {
      if (shopCart_list[i].selected_all == 1) {
        wx.request({
          url: getApp().globalData.url + that.data.deleteAll_shopCart,
          data: {
            login_token: wx.getStorageSync('loginToken'),
            shop_id: shopCart_list[i].shop_id
          },
          header: { 'content-type': 'application/json' },
          method: 'POST',
          dataType: 'json',
          responseType: 'text',
          success: function (res) {
            request_shopCart(that.data.shopCartAPI, '', that);
          },
          fail: function (res) { },
          complete: function (res) { },
        })
      } else {
        var goods_cart = shopCart_list[i].goods_cart;
        for (var j = 0; j < goods_cart.length; j++) {
          if (goods_cart[j].selected == 1) {
            wx.request({
              url: getApp().globalData.url + that.data.delete_shopCart,
              data: {
                login_token: wx.getStorageSync('loginToken'),
                cart_id: goods_cart[j].cart_id
              },
              header: { 'content-type': 'application/json' },
              method: 'POST',
              dataType: 'json',
              responseType: 'text',
              success: function (res) {
                request_shopCart(that.data.shopCartAPI, '', that);
              },
              fail: function (res) { },
              complete: function (res) { },
            })
          }
        }
      }
    }
  },

  // 结算
  settlement: function (e) {
    var that = this;
    wx.navigateTo({
      url: '../home/shopDetails/confirmOrder/confirmOrder?shopID=' + e.currentTarget.dataset.shopid + "&shopName=" + e.currentTarget.dataset.shopname + "&gradeid=" + e.currentTarget.dataset.gradeid + "&shopCart=" + JSON.stringify(e.currentTarget.dataset.goodscart) + "&shopCartNum=" +  e.currentTarget.dataset.num + "&shopCartPrice=" + e.currentTarget.dataset.price + "&logistics=" + e.currentTarget.dataset.logistics,
    })
  },

  // 点击商家图片
  clickShopCart:function(e){
    console.log(e.currentTarget.dataset.item.shop_id);
    wx.navigateTo({
      url: '../home/shopDetails/shopDetails?shopID=' + e.currentTarget.dataset.item.shop_id + "&gradeid=" + e.currentTarget.dataset.item.grade_id,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    // 获取屏幕高度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight
        });
      },
    })


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
    // 请求购物车数据
    request_shopCart(this.data.shopCartAPI, '', that);
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
      success: function(res) {
        var code = res.code;
        getApp().globalData.code = res.code;
        if (code){
          getApp().getOpenID(code, nickName, face, encryptedData, iv);
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    });
    // getApp().wxGetSetting();
    this.setData({
      userLogin: false
    });
    getApp().globalData.userLogin = true;
  },
})