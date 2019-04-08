// pages/mine/collection/collection.js
var page = 1;
var pages = 1;
var num = 10;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight:'',
    selectType:2,
    // 商品收藏
    goodsCollectionList:[],
    // 店铺关注
    shopFocusList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // 获取屏幕高度
    var windowHeight = wx.getSystemInfoSync().windowHeight;
    this.setData({windowHeight:windowHeight});
    
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
    if (this.data.selectType == 1){
      this.goodsCollectionRequest();
    }else{
      this.shopFocusRequest();
    }
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
  // 请求商品收藏数据
  goodsCollectionRequest:function(){
    var that = this;
    wx.request({
      url: getApp().globalData.url +'/api/user/list_goods_favorites',
      data: { 
        login_token:wx.getStorageSync('loginToken'),
        page:page,
        num:num
      },
      header: { 'content-type': 'application/json'},
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        console.log("请求商品收藏数据",res)
        if(res.data.state == 0){
          wx.showToast({
            title: res.data.msg,
          })
          that.setData({
            goodsCollectionList:[]
          })
        }else{
          that.setData({
            goodsCollectionList: res.data.data
          });
        }
        
      },
      fail: function(res) {},
      complete: function(res) {
      },
    })
  },
  // 删除收藏
  deleteCollection:function(e){
    var that = this;
    wx.request({
      url: getApp().globalData.url +'/api/user/delete_goods_favorites',
      data: {
        login_token: wx.getStorageSync('loginToken'),
        favorites_id: e.currentTarget.dataset.id
      },
      header: { 'content-type': 'application/json'},
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        if(res.data.state == 0){
          wx.showToast({
            title: res.data.msg,
          })
        }else{
          that.goodsCollectionRequest();
        }
      },
      fail: function(res) {},
      complete: function(res) {
        // that.setData({ goodsCollectionList:[]});
        // that.goodsCollectionRequest();
      },
    })
  },
  // 请求店铺关注
  shopFocusRequest:function(){
    var that = this;
    wx.request({
      url: getApp().globalData.url + '/api/user/list_shop_favorites',
      data: {
        login_token: wx.getStorageSync('loginToken'),
        page: pages,
        num: num
      },
      header: { 'content-type': 'application/json' },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        console.log('关注店铺：',res);
        if (res.data.state == 0){
          wx.showToast({
            title: res.data.msg,
          })
          that.setData({
            shopFocusList:[]
          });
        }else{
          that.setData({
            shopFocusList: res.data.data
          });
        }
        
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  // 点击选择类型
  clickType:function(e){
    var that = this;
    this.setData({
      selectType: e.currentTarget.id
    });
    if (this.data.selectType == 1) {
      this.goodsCollectionRequest();
    } else {
      this.shopFocusRequest();
    }
  },
  // 点击进去店铺
  enterStore:function(e){
    wx.navigateTo({
      url: '../../home/shopDetails/shopDetails?shopID=' + e.currentTarget.dataset.id + "&gradeid=" + e.currentTarget.dataset.gradeid,
    })
  },
  // 取消关注
  cancelFocus:function(e){
    var that = this;
    wx.request({
      url: getApp().globalData.url +'/api/user/delete_shop_favorites',
      data: {
        login_token:wx.getStorageSync('loginToken'),
        shop_id: e.currentTarget.dataset.id
      },
      header: { 'content-type': 'application/json'},
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        if(res.data.state == 0){
          wx.showToast({
            title: res.data.msg,
          })
        }else{
          that.shopFocusRequest();
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  }

})