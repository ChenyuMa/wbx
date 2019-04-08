// pages/home/region/region.js
var url = 'https://app.wbx365.com';
var amapFile = require('../../../libs/amap-wx.js');
var myAmapFun = new amapFile.AMapWX({
  key: '9484593ebb010c0179c49ac2ade339ce'
});
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight: '',
    listCityAPI: '/api/index/list_city',
    firstLetter: [],
    citysList: [],
    cityNameList: [],
    cityName: [],
    latitude: '',
    longitude: '',
    cicurrentCityty: '',
    searchCity: [],
    inputValue: '',
    cityID: '',
    imgUrls: getApp().globalData.imgUrls,
    isClearImg: false,
    toView: ''
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
          cicurrentCityty: options.cityName
        })
      },
    })
    //获取城市列表
    wx.request({
      url: getApp().globalData.url + this.data.listCityAPI,
      data: {},
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      dataType: 'json',
      success: function(res) {
        var myMap = new Map;
        var firstLetter = [];
        //获取城市字母
        for (var i = 0; i < res.data.data.length; i++) {
          myMap.set(res.data.data[i].first_letter, i);
        }
        // 取出字母
        myMap.forEach(function(value, key, myMap) {
          firstLetter.push(key);
        });
        that.setData({
          citysList: res.data.data,
          firstLetter: firstLetter
        });
      },
      fail: function(res) {},
      complete: function(res) {},
    })

  },
  //搜索城市
  inputChange: function(e) {
    var that = this;
    var substr = e.detail.value;
    var citysList = this.data.citysList
    var List = [];
    for (var i = 0; i < citysList.length; i++) {
      var str = citysList[i].name;
      if (str.indexOf(substr) == 0 && e.detail.value != '') {
        List.push(that.data.citysList[i]);
        that.setData({
          inputValue: e.detail.value,
          searchCity: List,
        });
      }
    }
    if (e.detail.value == '') {
      that.setData({
        searchCity: [],
        isClearImg: false
      });
    } else if (e.detail.value != '') {
      that.setData({
        isClearImg: true
      });
    }
  },

  // 点击选择首字母
  select_firstLetter: function(e) {
    this.setData({
      toView: e.currentTarget.id
    });
  },
  //清空搜索栏
  searchClear: function() {
    this.setData({
      inputValue: '',
      searchCity: [],
      isClearImg: false
    });
  },
  
  //点击切换城市
  selectCity: function(e) {
    var that = this;
    this.setData({
      cicurrentCityty: e.currentTarget.dataset.city,
      cityID: e.currentTarget.dataset.cityid
    });
    wx.setStorageSync('cityID', e.currentTarget.dataset.cityid);
    wx.setStorageSync('cityName', e.currentTarget.dataset.city);
    //关闭当前页面并返回
    wx.navigateBack({
      delta: 1
    })
    //修改首页地址
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    //修改首页城市
    prevPage.setData({
      cityName: e.currentTarget.dataset.city,
      cityID: e.currentTarget.dataset.cityid,
      near_location_list: [],
      location_address_list: []
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

  }
})