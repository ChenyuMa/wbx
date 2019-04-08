// pages/near/near.js
var page = 1;
var num = 10;
var pages = 1;
// 请求买菜数据
var requestShop = function (that) {
  wx.request({
    url: that.data.url + that.data.shopAPI,
    data: {
      city_name: wx.getStorageSync('cityName'),
      lat: wx.getStorageSync('latitude'),
      lng: wx.getStorageSync('longitude'),
      page: page,
      num: num,
      cate_id: that.data.cateID,
      area_id: that.data.areaID,
      business_id: that.data.businessID,
      order: that.data.order
    },
    header: { 'content-type': 'application/json' },
    method: 'POST',
    dataType: 'json',
    responseType: 'text',
    success: function (res) {
      var shopList = that.data.shopList;
      if (typeof (res.data.data) == "undefined") {
        that.setData({
          isBottom: true
        });
        return false;
      }else{
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

//头部选择分类
var requestType = function (that, cateID, areaID, businessID, order) {
  wx.request({
    url: that.data.url + that.data.shopAPI,
    data: {
      city_name: wx.getStorageSync('cityName'),
      lat: wx.getStorageSync('latitude'),
      lng: wx.getStorageSync('longitude'),
      page: pages,
      num: num,
      cate_id: that.data.cateID,
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
      if(res.data.state == 0){
        wx.showToast({
          title: res.data.msg,
        })
      }else if (typeof (res.data.data) == "undefined") {
        that.setData({
          isBottom: true
        });
        return false;
      }else{
        for (var i = 0; i < res.data.data.length; i++) {
          shopList.push(res.data.data[i]);
        }
        pages++;
      }
      that.setData({
        shopList: shopList
      });
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
    TopList:[
      { imgUrl: 'shopping_specialty@2x.png', txt: '地方特产' ,id:'106'},
      { imgUrl: 'shopping_supermarket@2x.png', txt: '超市百货' ,id:'95'},
      { imgUrl: 'shopping_maternal@2x.png', txt: '母婴用品' ,id:'13'},
      { imgUrl: 'shopping_beauty@2x.png', txt: '美容护肤' ,id:'136'},
      { imgUrl: 'shopping_sports@2x.png', txt: '体育保健' ,id:'105'},
      { imgUrl: 'shopping_life@2x.png', txt: '生活必备' ,id:'124'},
      { imgUrl: 'shopping_woman@2x.png', txt: '女人街' ,id:'156'},
      { imgUrl: 'shopping_business@2x.png', txt: '商业服务' ,id:'107'},
    ],
    flList: [
      { imgUrl: 's_all@2x.png', txt: '全部' },
      { imgUrl: 'shopping_specialty@2x.png', txt: '地方特产' },
      { imgUrl: 'shopping_supermarket@2x.png', txt: '超市百货' },
      { imgUrl: 'shopping_maternal@2x.png', txt: '母婴用品' },
      { imgUrl: 'shopping_beauty@2x.png', txt: '美容护肤' },
      { imgUrl: 'shopping_sports@2x.png', txt: '体育保健' },
      { imgUrl: 'shopping_life@2x.png', txt: '生活必备' },
      { imgUrl: 'shopping_woman@2x.png', txt: '女人街' },
      { imgUrl: 'shopping_business@2x.png', txt: '商业服务' },
    ],
    dqList: [],
    sqList: [],
    sqShow: false,
    dqID: '',
    dqIndex: '',
    pxList: ['智能排序', '起送最低', '送货最快', '距离最近'],
    lazy_load:true
  },
  // 头部搜索
  topSearch: function () {
    wx.navigateTo({
      url: './shopSearch/shopSearch',
    })
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
    pages = 1;
    this.setData({
      cateID: e.currentTarget.dataset.id
    });
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
          isScroll: false
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
          isScroll: false
        });
      default:
    }
  },
  // 隐藏选择列表
  hiddenSelect: function () {
    this.setData({
      isSelect: false,
      isScroll: true
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
    page = 1;
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
    // if (this.data.cateID == '' || this.data.order == ''|| this.data.businessID == '' || this.data.areeID == '') {
    //   requestShop(that);
    // } else {
    //   requestType(that);
    // }
    requestShop(that);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //
  scrollToBottom: function () {
    var that = this;
    requestShop(that);
  }
})