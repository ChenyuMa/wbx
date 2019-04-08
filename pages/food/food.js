// pages/food/food.js
var page = 1;
var num = 10;
var pages = 1;
// 请求买菜数据
var requestShop = function (that) {
  wx.request({
    url: getApp().globalData.url + that.data.shopAPI,
    data: {
      city_name: wx.getStorageSync('cityName'),
      lat: wx.getStorageSync('latitude'),
      lng: wx.getStorageSync('longitude'),
      page: page,
      num: num,
      cate_id:164,
      area_id: that.data.areaID,
      business_id: that.data.businessID,
      order: that.data.order
    },
    header: { 'content-type': 'application/json' },
    method: 'POST',
    dataType: 'json',
    responseType: 'text',
    success: function (res) {
      console.log(res);
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
    },
    fail: function (res) { },
    complete: function (res) { },
  })
}

//头部选择分类
var requestType = function (that, cateID, areaID, businessID, order) {
  wx.request({
    url: that.data.url + that.data.shopAPI,
    data: {
      city_id: wx.getStorageSync('cityID'),
      lat: wx.getStorageSync('latitude'),
      lng: wx.getStorageSync('longitude'),
      page: pages,
      num: num,
      cate_id: 164,
      area_id: that.data.areaID,
      business_id: that.data.businessID,
      order: that.data.order
    },
    header: { 'content-type': 'application/json' },
    method: 'POST',
    dataType: 'json',
    responseType: 'text',
    success: function (res) {
      var shopList = [];
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
      pages++;
    },
    fail: function (res) { },
    complete: function (res) { },
  })
}

// 获取地区及商圈
var requestDqType = function (that, cityID) {
  wx.request({
    url: that.data.url + that.data.dqTypeAPI,
    data: {
      city_name: wx.getStorageSync('cityName'),
    },
    header: { 'content-type': 'application/json' },
    method: 'POST',
    dataType: 'json',
    responseType: 'text',
    success: function (res) {
      that.setData({
        dqList: res.data.data,
      });
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
    imgUrls: getApp().globalData.imgUrls,
    isScroll: true,
    url: getApp().globalData.url,
    shopAPI: '/api/shop/list_shop',
    shopList: [],
    windowHeight: '',
    isBottom: false,
    dqTypeAPI: '/api/buygreens/get_area',
    areaID: '',
    cateID: '',
    businessID: '',
    order: '',
    xzfl: '选择分类',
    xzdq: '选择地区',
    xzpx: '选择排序',
    isSelect: false,
    flOpen: false,
    dqOpen: false,
    pxOpen: false,
    TopList: [
      { imgUrl: 'food_buffet@2x.png', txt: '自助餐', id: '166' },
      { imgUrl: 'food_barbecue@2x.png', txt: '烧烤', id: '167' },
      { imgUrl: 'food_westernfood@2x.png', txt: '小吃快餐', id: '168' },
      { imgUrl: 'food_fastfood@2x.png', txt: '西餐', id: '169' },
      { imgUrl: 'food_dessert@2x.png', txt: '甜点', id: '170' },
      { imgUrl: 'food_hotpot@2x.png', txt: '火锅', id: '171' },
      { imgUrl: 'food_hunan@2x.png', txt: '川湘菜', id: '172' },
      { imgUrl: 'food_msseafood@2x.png', txt: '海鲜', id: '173' },
    ],
    flList: [
      { imgUrl: 's_all@2x.png', txt: '全部' },
      { imgUrl: 'food_buffet@2x.png', txt: '自助餐' },
      { imgUrl: 'food_barbecue@2x.png', txt: '烧烤' },
      { imgUrl: 'food_westernfood@2x.png', txt: '小吃快餐' },
      { imgUrl: 'food_fastfood@2x.png', txt: '西餐' },
      { imgUrl: 'food_dessert@2x.png', txt: '甜点' },
      { imgUrl: 'food_hotpot@2x.png', txt: '火锅' },
      { imgUrl: 'food_hunan@2x.png', txt: '川湘菜' },
      { imgUrl: 'food_msseafood@2x.png', txt: '海鲜' },
    ],
    dqList: [],
    sqList: [],
    sqShow: false,
    dqID: '',
    dqIndex: '',
    pxList: ['智能排序', '起送最低', '送货最快', '距离最近'],
    lazy_load:true
  },
  // 店铺下单
  shopOnClick: function (e) {
    wx.navigateTo({
      url: '../../pages/home/shopDetails/shopDetails?shopID=' + e.currentTarget.dataset.id + "&gradeid=" + e.currentTarget.dataset.gradeID,
    })
  },
  //类型选择
  typeSelect: function (e) {
    var that = this;
    this.setData({
      cateID: e.currentTarget.dataset.id
    });
    pages = 1;
    requestType(that);
    this.hiddenSelect();
  },
  //分类，地区，排序选择
  clickNav: function (e) {
    var that = this;
    switch (parseInt(e.currentTarget.dataset.nav)) {
      case 1:
        that.setData({
          isSelect: true,
          flOpen: true,
          dqOpen: false,
          pxOpen: false,
          isScroll:false
        });
        break;
      case 2:
        that.setData({
          isSelect: true,
          flOpen: false,
          dqOpen: true,
          pxOpen: false,
          isScroll:false
        });
        var cityID = wx.getStorageSync("cityID")
        requestDqType(that, cityID);
        break;
      case 3:
        that.setData({
          isSelect: true,
          flOpen: false,
          dqOpen: false,
          pxOpen: true,
          isScroll:false
        });
      default:
    }
  },
  // 隐藏选择列表
  hiddenSelect: function () {
    this.setData({
      isSelect: false,
      isScroll:true
    });
  },
  // 分类点击
  flClick: function (e) {
    var that = this;
    this.setData({
      xzfl: e.currentTarget.dataset.txt,
      cateID: e.currentTarget.dataset.id
    });
    pages = 1;
    requestType(that);
    this.hiddenSelect();
  },
  //地区点击
  dqClick: function (e) {
    var that = this;
    this.setData({
      areaID: e.currentTarget.dataset.id,
      dqID: e.currentTarget.dataset.id,
      dqIndex: e.currentTarget.dataset.index,
      sqShow: true,
      sqList: that.data.dqList[e.currentTarget.dataset.index].business
    });
  },
  //商圈点击
  sqClick: function (e) {
    var that = this;
    this.setData({
      xzdq: e.currentTarget.dataset.txt,
      businessID: e.currentTarget.dataset.id
    });
    pages = 1;
    requestType(that);
    this.hiddenSelect();
  },
  //排序点击
  pxClick: function (e) {
    var that = this;
    this.setData({
      xzpx: e.currentTarget.dataset.txt,
      order: e.currentTarget.dataset.id
    });
    pages = 1;
    requestType(that);
    this.hiddenSelect();
  },
  // 头部搜索
  topSearch: function () {
    wx.navigateTo({
      url: './shopSearch/shopSearch',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // 请求买菜界面
    requestShop(that);
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
    page=1;
    pages = 1;
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
    // if (this.data.cateID == '' || this.data.order == '' || this.data.businessID == '' || this.data.areeID == '') {
    //   requestShop(that);
    // } else {
    //   requestShop(that);
    // }
    requestShop(that);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //
  scrollToBottom:function(){
    var that = this;
    requestShop(that);
  }
})