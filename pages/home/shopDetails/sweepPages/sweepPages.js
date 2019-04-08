// pages/home/shopDetails/sweepPages/sweepPages.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 屏幕高度
    windowHeight: '',
    // 页面传递的参数
    gradeid: '',
    seat: '',
    selectNum: '',
    selectRepast: '',
    shopID: '',
    shopCart: '',
    // 备注编辑
    isEditor: true,
    notoValue: '',
    scanOrderType:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //获取屏幕高度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight
        });
      },
    });
    // 获取传递的值
    this.setData({
      gradeid: options.gradeid,
      seat: options.seat,
      selectNum: options.selectNum,
      selectRepast: options.selectRepast,
      shopID: options.shopID,
      shopCart: JSON.parse(options.shopCart),
      scanOrdertype: options.scan_order_type
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

  /**
   * 备注编辑
   */
  clickEditor: function () {
    this.setData({ isEditor: !this.data.isEditor });
  },

  /**
   * 备注框发生变化
   */
  inputTextarea: function (e) {
    this.setData({
      notoValue: e.detail.value
    });
  },

  /**
   * 减菜
   */
  subtract:function(e){
    var that = this;
    var shopCart = this.data.shopCart;
    //获取页面栈
    var pages = getCurrentPages();
    var prePage = pages[pages.length - 2];
    if (e.currentTarget.dataset.id.is_attr == 1){
      for (var i = 0; i < shopCart.length; i++) {
        if (e.currentTarget.dataset.id.attr_id == shopCart[i].attr_id) {
          if (shopCart[i].buy_num <= 1) {
            return false;
          } else {
            shopCart[i].buy_num -= 1;
            that.setData({
              shopCart: shopCart
            });
            prePage.subtractionGoods_attr(e)
          }
        }
      }
    }else{
      for (var i = 0; i < shopCart.length; i++) {
        if (e.currentTarget.dataset.id.goods_id == shopCart[i].goods_id) {
          if (shopCart[i].buy_num <= 1) {
            return false;
          } else {
            shopCart[i].buy_num -= 1;
            that.setData({
              shopCart: shopCart
            });
            prePage.subtractionGoods(e)
          }
        }
      } 
    }
    
  },

  /**
   * 加菜
   */
  add:function(e){
    var that = this;
    var shopCart = this.data.shopCart;
    //获取页面栈
    var pages = getCurrentPages();
    var prePage = pages[pages.length - 2];
    if (e.currentTarget.dataset.id.is_attr == 1){
      for(var i=0;i<shopCart.length;i++){
        if (e.currentTarget.dataset.id.attr_id == shopCart[i].attr_id){
          if (shopCart[i].buy_num >= 99) {
            return false;
          }else{
            shopCart[i].buy_num += 1;
            that.setData({
              shopCart: shopCart
            });
            prePage.addGoods_attr(e)
          }
        }
      }
    }else{
      for (var i = 0; i < shopCart.length; i++) {
        if (e.currentTarget.dataset.id.goods_id == shopCart[i].goods_id) {
          if (shopCart[i].buy_num >= 99) {
            return false;
          }else{
            shopCart[i].buy_num += 1;
            that.setData({
              shopCart: shopCart
            });
            prePage.addGoods(e)
          }
        }
      }
    }
   
  },

  /**
   * 点击加菜
   */
  clickAddFood: function () {
    wx.navigateBack({
      delta: 1,
    });
    
  },

  /**
   * 点击下单
   */
  clickOrder: function () {
    var that = this;
    var cart_goods = [];
    for (var i = 0; i < this.data.shopCart.length; i++) {
      cart_goods.push({ "goods_id": that.data.shopCart[i].goods_id, "num": that.data.shopCart[i].buy_num, "attr_id": that.data.shopCart[i].attr_id });
    }
    wx.request({
      url: getApp().globalData.url +'/api/scanorder/scan_order',
      data: {
        login_token:wx.getStorageSync('loginToken'),
        shop_id: that.data.shopID,
        people_num: that.data.selectNum,
        eat_type: that.data.selectRepast,
        seat: that.data.seat,
        noto: that.data.noto,
        cart_goods: JSON.stringify(cart_goods)
      },
      header: { 'content-type': 'application/json'},
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        console.log('桌号',res);
        if(res.data.state == 0){
          if(res.data.msg =='请先绑定手机'){
            wx.navigateTo({
              url: '../../../bindPhone/bindPhone',
            })
          }else{
            wx.showToast({
              title: res.data.msg,
            })
          }
        }else{
          wx.showToast({
            title: res.data.msg,
          })
          setTimeout(function(){
            wx.navigateTo({
              url: './orderPages/orderPages?out_trade_no=' + res.data.data.out_trade_no,
            })
          },1500);
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })

    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    
  },
  // 点击付款
  clickPay:function(){
    var that = this;
    var cart_goods = [];
    for (var i = 0; i < this.data.shopCart.length; i++) {
      cart_goods.push({ "goods_id": that.data.shopCart[i].goods_id, "num": that.data.shopCart[i].buy_num, "attr_id": this.data.shopCart[i].attr_id });
    }
    wx.request({
      url: getApp().globalData.url + '/api/scanorder/scan_order',
      data: {
        login_token: wx.getStorageSync('loginToken'),
        shop_id: that.data.shopID,
        people_num: that.data.selectNum,
        eat_type: that.data.selectRepast,
        seat: that.data.seat,
        noto: that.data.noto,
        cart_goods: JSON.stringify(cart_goods)
      },
      header: { 'content-type': 'application/json' },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        if (res.data.state == 0) {
          if (res.data.msg == '请先绑定手机') {
            wx.navigateTo({
              url: '../../../bindPhone/bindPhone',
            })
          } else {
            wx.showToast({
              title: res.data.msg,
            })
          }
        } else {
          // wx.showToast({
          //   title: res.data.msg,
          // })
          // setTimeout(function () {
          //   wx.navigateTo({
          //     url: './orderPages/orderPages?out_trade_no=' + res.data.data.out_trade_no,
          //   })
          // }, 1500);
          wx.navigateTo({
            url: './confirmClearing/confirmClearing?out_trade_no=' + res.data.data.out_trade_no,
          })
        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  }
})