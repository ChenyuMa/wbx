// pages/found/found.js

function getRad(d) {
  var PI = Math.PI;
  return d * PI / 180.0;
}

function getDistance(lat1, lng1, lat2, lng2) {
  var f = getRad((lat1 + lat2) / 2);
  var g = getRad((lat1 - lat2) / 2);
  var l = getRad((lng1 - lng2) / 2);
  var sg = Math.sin(g);
  var sl = Math.sin(l);
  var sf = Math.sin(f);
  var s, c, w, r, d, h1, h2;
  var a = 6378137.0;//The Radius of eath in meter.   
  var fl = 1 / 298.257;
  sg = sg * sg;
  sl = sl * sl;
  sf = sf * sf;
  s = sg * (1 - sl) + (1 - sf) * sl;
  c = (1 - sg) * (1 - sl) + sf * sl;
  w = Math.atan(Math.sqrt(s / c));
  r = Math.sqrt(s * c) / w;
  d = 2 * w * a;
  h1 = (3 * r - 1) / 2 / c;
  h2 = (3 * r + 1) / 2 / s;
  s = d * (1 + fl * (h1 * sf * (1 - sg) - h2 * (1 - sf) * sg));
  s = s / 1000;
  s = s.toFixed(2);//指定小数点后的位数。   
  return s;
}

// 发布
var merchants_request = function(API, that) {
  wx.request({
    url: getApp().globalData.url + API,
    data: {
      login_token:wx.getStorageSync('loginToken'),
      city_name: wx.getStorageSync('cityName'),
      lat: wx.getStorageSync('latitude'),
      lng: wx.getStorageSync('longitude')
    },
    header: {
      'content-type': 'application/json'
    },
    method: 'POST',
    dataType: 'json',
    responseType: 'text',
    success: function(res) {
      console.log('发布:',res);
      if(res.data.state == 0){
        wx.showToast({
          title: res.data.msg,
        })
      }else if(res.data.msg == '暂无数据'){
        wx.showToast({
          title: '商家未发布',
        });
        that.setData({ merchants_list:[]});
      }else{
        var list = res.data.data;
        for (var i = 0; i < list.length; i++) {
          var distance = getDistance(wx.getStorageSync('latitude'), wx.getStorageSync('longitude'), parseFloat(list[i].lat), parseFloat(list[i].lng));
          list[i].distance = distance;
        }
        that.setData({
          merchants_list: list,
        });
      }
    },
    fail: function(res) {},
    complete: function(res) {
      
    },
  })
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight: '',
    imgUrls: getApp().globalData.imgUrls,
    // 头部背景图片
    background_img: 'gg@2x.png',
    // 头部标题
    top_titel: 'top-titel@2x.png',
    // 头部导航
    top_nav: 'font@2x.png',
    //Y滚动 
    scrollY: true,
    // X滚动
    scrollX: true,
    // 发现页面数据
    foundAPI: '/api/discovery/get_discovery_info',
    // 附近美食
    delicacy_goods_list: [],
    // 附近美食
    food_title: 'fj@2x.png',
    // 附近逛街
    sales_goods_list: [],
    shopping_title: 'gj@2x.png',
    // 优惠促销
    shoping_goods_list: [],
    promotions_title: 'cx@2x.png',
    // 美味佳肴
    deliciousAPI: '/api/discovery/get_cook_info',
    delicious_title: 'jy@2x.png',
    delicious_list: [],
    // 发布
    merchants_list: [],
    merchantsAPI: '/api/discovery/list_discover',
    userLogin:false
  },

  click_content: function(e) {
    wx.navigateTo({
      url: '../home/shopDetails/shopDetails?shopID=' + e.currentTarget.id + "&gradeid=" + e.currentTarget.dataset.gradeid,
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
          windowHeight: res.windowHeight,
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
    var that = this;
    // 发布
    merchants_request(this.data.merchantsAPI, that);
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

  /**
   * 进店逛逛
   */
  clickJumpShop:function(e){
    wx.navigateTo({
      url: '../home/shopDetails/shopDetails?shopID=' + e.currentTarget.dataset.item.shop_id + "&gradeid=" + e.currentTarget.dataset.item.grade_id,
    })
  },

  /**
   * 关注店铺
   */
  clickFocus:function(e){
    var that = this;
    wx.request({
      url: getApp().globalData.url +'/api/index/follow_shop',
      data: {
        login_token:wx.getStorageSync('loginToken'),
        shop_id: e.currentTarget.dataset.item.shop_id
      },
      header: { 'content-type': 'application/json'},
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        // if (res.data.msg == "请先绑定手机"){
        //   wx.navigateTo({
        //     url: '../bindPhone/bindPhone',
        //   })
        // } else 
        if (res.data.msg == "请先登陆"){
          that.setData({
            userLogin:true
          });
        }else if(res.data.state == 1){
          var merchants_list = that.data.merchants_list;
          for (var i = 0; i < merchants_list.length; i++) {
            if (e.currentTarget.dataset.item.shop_id == merchants_list[i].shop_id) {
              merchants_list[i].is_favorites = 1;
              that.setData({
                merchants_list: merchants_list
              });
            }
          }
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  /**
   * 商家发布图片预览
   */
  previewImage:function(e){
    wx.previewImage({
      current: e.currentTarget.id,
      urls: e.currentTarget.dataset.src,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
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