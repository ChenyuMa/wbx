// pages/shop/shopSearch/shopSearch.js
var page = 1;
var num = 10;
var requestShop = function (that,typeID,keyword) {
  wx.request({
    url: that.data.url + that.data.shopAPI,
    data: {
      city_name: wx.getStorageSync('cityName'),
      type: typeID,
      lat: wx.getStorageSync('latitude'),
      lng: wx.getStorageSync('longitude'),
      page: page,
      num: num,
      keyword: keyword
    },
    header: { 'content-type': 'application/json' },
    method: 'POST',
    dataType: 'json',
    responseType: 'text',
    success: function (res) {
      if(res.data.state==0){
        wx.showToast({
          title: res.data.msg,
        })
      }else{
        var shopList = that.data.shopList;
        if (typeof (res.data.data) == "undefined") {
          that.setData({
            isBottom: true
          });
          return false;
        };
        for (var i = 0; i < res.data.data.length; i++) {
          shopList.push(res.data.data[i]);
        }
        that.setData({
          shopList: shopList
        });
        page++;
      }
    },
    fail: function (res) { },
    complete: function (res) { },
  })
}

Page({
  /**
   * 页面的初始数据
   */
  data: {
    windowHeight: getApp().globalData.windowHeight,
    imgUrls: getApp().globalData.imgUrls,
    url: getApp().globalData.url,
    inputTxt: '',
    isCleanImg:false,
    shopAPI: '/api/index/search',
    shopList: [],
    isClickType:'none',
    typeTxt:'商品',
    typeID:1
  },
  // 搜索类型选择
  selectSearch:function(){
    this.setData({
      isClickType:'block'
    });
  },
  // 点击类型
  clickType:function(e){
    console.log(e)
    this.setData({
      typeTxt: e.currentTarget.dataset.txt,
      typeID: e.currentTarget.dataset.id,
      isClickType:'none'
    });
  },
  // 输入框改变
  inputChange: function (e) {
    var that = this;
    if (e.detail.value == ''){
      that.setData({
        isCleanImg:false,
        shopList:[]
      });
    }else{
      that.setData({
        inputTxt: e.detail.value,
        isCleanImg: true
      });
      page = 1;
      requestShop(that, this.data.typeID,e.detail.value);
    }
  },
  // 清空输入框
  inputClear: function () {
    this.setData({
      inputTxt:'',
      isCleanImg:false,
      shopList:[],
      // windowHeight:''
    });
  },
  // 取消搜索
  cancelSearch: function () {
    wx.navigateBack({
      delta: 1
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
    var that = this;
    requestShop(that,this.data.typeID,this.data.inputTxt);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  // 点击店铺跳转
  shopOnClick:function(e){
    wx.navigateTo({
      url: '../../home/shopDetails/shopDetails?shopID=' + e.currentTarget.dataset.id + "&gradeid=" + e.currentTarget.dataset.gradeid,
    })
  }
})