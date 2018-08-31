// pages/home/region/region.js
var amapFile = require('../../../libs/amap-wx.js');
var qqmapsdk;
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
    isClearImg: false
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
        })
      },
    })
    //获取城市列表
    wx.request({
      url: getApp().globalData.url + this.data.listCityAPI,
      data: {},
      header: { 'content-type': 'application/json' },
      method: 'POST',
      dataType: 'json',
      success: function (res) {
        var myMap = new Map;
        var firstLetter = [];
        //获取城市字母
        for (var i = 0; i < res.data.data.length; i++) {
          myMap.set(res.data.data[i].first_letter, i);
        }
        // 取出字母
        myMap.forEach(function (value, key, myMap) {
          firstLetter.push(key);
        });
        that.setData({
          citysList: res.data.data,
          firstLetter: firstLetter
        });
      },
      fail: function (res) { },
      complete: function (res) { },
    })
    //获取当前城市经纬度
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
      },
    })
    //调用接口传入key
    qqmapsdk = new QQMapWX({
      key: '75FBZ-CV33K-XNIJC-AL66E-CUINE-NNFR5'
    });
    //获取当前地址
    qqmapsdk.reverseGeocoder({
      success: function (res) {
        var reg = new RegExp('市');
        that.setData({
          cicurrentCityty: res.result.ad_info.city.replace(reg, "")
        });
        //修改首页地址
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];
        //修改首页城市
        prevPage.setData({
          city: res.result.ad_info.city.replace(reg, "")
        })
      },
      fail: function (res) {
      },
      complete: function (res) {
      }
    });
  },
  //搜索城市
  inputChange: function (e) {
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
  //清空搜索栏
  searchClear: function () {
    this.setData({
      inputValue: '',
      searchCity: [],
      isClearImg: false
    });
  },
  //定位到当前城市
  localizeCity: function (e) {
    var that = this;
    //关闭当前页面并返回
    wx.navigateBack({
      delta: 1
    })
    //修改首页地址
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    //修改首页城市
    prevPage.setData({
      city: e.currentTarget.dataset.city,
      cityID: that.data.cityID,
      lat: that.data.latitude,
      lng: that.data.longitude,
      storeList: []
    })
    prevPage.clickCity();
  },
  //点击切换城市
  selectCity: function (e) {
    var that = this;
    this.setData({
      cicurrentCityty: e.currentTarget.dataset.city,
      cityID: e.currentTarget.dataset.cityid
    });
    //关闭当前页面并返回
    wx.navigateBack({
      delta: 1
    })
    //修改首页地址
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    //修改首页城市
    prevPage.setData({
      city: e.currentTarget.dataset.city,
      cityID: that.data.cityID,
      lat: '',
      lng: '',
      storeList: [],
      is_modify_locate:true
    })
    prevPage.clickCity();
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