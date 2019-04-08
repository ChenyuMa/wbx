// pages/home/location/location.js
var amapFile = require('../../libs/amap-wx.js');
var myAmapFun = new amapFile.AMapWX({
  key: '9484593ebb010c0179c49ac2ade339ce'
});
// 收货地址收搜
var search_qqmapWX = function (keywords, that) {
  myAmapFun.getInputtips({
    keywords: keywords,
    location: that.data.location,
    city: that.data.cityName,
    success: function (data) {
      console.log('data:',data);
      if (data && data.tips) {
        that.setData({
          search_add_list: data.tips
        });
      }

    }
  })
};

// 截取市
var regExp = function (that) {
  var reg = new RegExp('市');
  var city = that.data.cityName;
  that.setData({
    cityName: city.replace(reg, "")
  });
};

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 屏幕高度
    windowHeight: '',
    // 图标地址
    imgUrl: getApp().globalData.imgUrl,
    // 输入框值
    inputTxt: '',
    // 定位地址数据
    location_address_list: [],
    // 我的收货地址
    goods_address_API: '/api/user/list_address',
    cityIDAPI: '/api/index/list_city',
    goods_address_list: [],
    // 附近房产小区
    near_location_list: [],
    // 是否滚动
    scrollY: true,
    // 是否收搜
    is_search_address: false,
    // 地址收搜
    search_add_list: [],
    cityName: '',
    // 首页店铺名称
    home_shop_list: [],
    home_shop_API: '/api/index/list_shop',
    cityID: ''
  },

  // 输入框改变
  input_change: function (e) {
    var that = this;
    this.setData({
      inputTxt: e.detail.value
    });

    if (e.detail.value != '') {
      search_qqmapWX(e.detail.value, that);
    } else {
      that.setData({
        search_add_list: []
      });
    }
  },

  // 清空搜索栏
  search_clear: function () {
    this.setData({
      inputTxt: '',
      search_add_list: []
    });
  },

  // 选择城市
  select_city: function () {
    wx.navigateTo({
      url: './region/region?cityName='+this.data.cityName,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  // 点击定位当前位置
  current_address: function () {
    var that = this;
    //获取上一页数据 
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    prevPage.setData({
      home_shop_list:[],
      beyond_list:[],
      pages:1
    });
    prevPage.getLocation();
    wx.navigateBack({
      delta: 1
    })
  },

  // 输入框获取焦点
  inputFocus: function () {
    this.setData({
      is_search_address: true
    });
  },

  // 收搜是点击空白
  click_blank: function () {
    this.setData({
      is_search_address: false
    });
  },

  // 点击了附近地址，收搜地址
  click_search_address: function (e) {
    var that = this;
    var location = e.currentTarget.dataset.locate.location.split(',');
    wx.setStorageSync('latitude', location[1]);
    wx.setStorageSync('longitude', location[0]);
    //获取上一页数据 
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    prevPage.setData({
      cityName: that.data.cityName,
      locate_address: e.currentTarget.dataset.locate.name,
      cityID: that.data.cityID,
      location_address_list: e.currentTarget.dataset.locate,
      is_modify_locate: true,
      home_shop_list:[],
      beyond_list:[],
      pages:1
    })
    prevPage.home_shop_list(prevPage.data.home_shop_API, that.data.cityName, location[1], location[0],1,10);
    wx.navigateBack({
      delta: 1
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.setData({
      // location_address_list: JSON.parse(options.location_address_list),
      cityName: wx.getStorageSync('cityName'),
      location: wx.getStorageSync('longitude') + ',' + wx.getStorageSync('latitude')
    });

    // 搜索周边商业住宅
    myAmapFun.getPoiAround({
      location: that.data.location,
      querykeywords:'商务住宅',
      success: function (data) {
        //成功回调
        that.setData({
          near_location_list: data.poisData
        });
      },
      fail: function (info) {
        //失败回调
        console.log(info)
      }
    })


    // 获取屏幕高度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight
        });
      },
    });

    // 截取市
    regExp(that);

    //获取附近房产小区
    // search_qqmapWX('',that);
    
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

  }
})