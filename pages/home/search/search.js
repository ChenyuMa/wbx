// pages/home/search/search.js

//收搜内容
var page = 1;
var num = 10;
var search = function (API, type, keyword, cityID,that){
  wx.request({
    url: getApp().globalData.url + API,
    data: {
      type:type,
      keyword: keyword,
      city_name: wx.getStorageSync('cityName'),
      lat: wx.getStorageSync('latitude'),
      lng: wx.getStorageSync('longitude'),
      page:page,
      num:num
    },
    header: { 'content-type': 'application/json' },
    method: 'POST',
    dataType: 'json',
    success: function (res) {
      console.log('res:',res)
      if(res.data.state == 1){
        that.setData({
          searchList: res.data.data
        });
      }else{
        
      }
      
    },
    fail: function (res) { },
    complete: function (res) { 
      // if (res.data.state == 0 && keyword != ''){
      //   wx.showToast({
      //     title: '暂无店铺',
      //   })
      // }
    },
  })
} ;

var getCityID = function(API,that){
  wx.request({
    url: getApp().globalData.url + API,
    data: '',
    header: { 'content-type': 'application/json'},
    method: 'POST',
    dataType: 'json',
    responseType: 'text',
    success: function(res) {
      for (var i = 0; i < res.data.data.length; i++) {
        if (that.data.cityName == res.data.data[i].name) {
          that.setData({
            cityID: res.data.data[i].city_id
          });
          //保存城市id
          wx.setStorageSync('cityID', that.data.cityID);
        }
      }
    },
    fail: function(res) {},
    complete: function(res) {},
  })
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight: '',
    inputTxt: '',
    cityName:'',
    cityID:0,
    storeList: [],
    searchList: [],
    searchAPI: '/api/index/search',
    search_tpye:'商品',
    type:1,
    click_type:false,
    listCityAPI:'/api/index/list_city'
  },
  //获取屏幕高度
  getWindowHeight: function (that) {
    //获取屏幕高度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight
        });
      },
    })
  },
  // 获取输入框值
  inputChange: function (e) {
    var that = this;
    if (e.detail.value != '') {
      that.setData({
        inputTxt: e.detail.value
      });

    } else if (e.detail.value == '') {
      that.setData({
        searchList: []
      });
    } else {
      that.setData({
        inputTxt: ''
      });
    }
    
    // 收搜店铺
    search(that.data.searchAPI, that.data.type, e.detail.value, that.data.cityID, that);

  },
  //清空输入框
  clearInputTxt: function () {
    this.setData({
      inputTxt: '',
      searchList: []
    });

  },
  //跳转店面
  shopDetails: function (e) {
    wx.navigateTo({
      url: '../shopDetails/shopDetails?shopID=' + e.currentTarget.id + "&gradeid=" + e.currentTarget.dataset.gradeid,
    })
  },

  // 点击切换收搜
  click_type:function(){
    var that = this;
    this.setData({
      click_type: !that.data.click_type
    });
  },

  // 点击改变收搜
  set_type:function(e){
    console.log(e);
    this.setData({
      type: e.currentTarget.id,
      search_tpye: e.currentTarget.dataset.name,
      click_type: false
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //后去屏幕高度
    this.getWindowHeight(that);
    this.setData({cityName:options.cityName});
    // 获取城市id
    getCityID(this.data.listCityAPI,that);
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