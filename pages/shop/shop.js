 // pages/shop/shop.js
var page = 1;
var num = 10;
var pages = 1;
var getLocation = function (that) {
  wx.getLocation({
    type: 'gcj02',
    success: function (res) {
      wx.setStorageSync('latitude', res.latitude);
      wx.setStorageSync('longitude', res.longitude);
      if (res.latitude != wx.getStorageSync('latitude')){
        console.log('aa');
        page = 0;
        that.setData({
          shopList:[]
        });
      }
      
    },
    fail: function (res) {
    },
    complete: function (res) {
      
    }
  })
};

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
      area_id: that.data.areaID,
      business_id: that.data.businessID,
      order: that.data.order,
      cate_id: that.data.cateID
    },
    header: { 'content-type': 'application/json' },
    method: 'POST',
    dataType: 'json',
    responseType: 'text',
    success: function (res) {
      console.log('买菜:',res);
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
var requestType = function (that, cateID, areaID, businessID, order){
  wx.request({
    url: that.data.url + that.data.shopAPI,
    data: {
      city_name: wx.getStorageSync('cityName'),
      lat: wx.getStorageSync('latitude'),
      lng: wx.getStorageSync('longitude'),
      page: pages,
      num: num,
      cate_id: that.data.cateID,
      area_id:that.data.areaID,
      business_id: that.data.businessID,
      order:that.data.order
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
var requestDqType = function(that,cityID){
  wx.request({
    url: that.data.url + that.data.dqTypeAPI,
    data: {
      city_name: wx.getStorageSync('cityName'),
    },
    header: { 'content-type': 'application/json' },
    method: 'POST',
    dataType: 'json',
    responseType: 'text',
    success: function(res) {
      that.setData({
        dqList:res.data.data,
      });
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
    imgUrls:getApp().globalData.imgUrls,
    isScroll: true,
    url:getApp().globalData.url,
    shopAPI:'/api/buygreens/list_shop',
    shopList:[],
    windowHeight: '',
    isBottom:false,
    dqTypeAPI:'/api/buygreens/get_area',
    areaID:'',
    cateID:'',
    businessID:'',
    order:'',
    xzfl:'选择分类',
    xzdq:'选择地区',
    xzpx:'选择排序',
    isSelect: false,
    flOpen:false,
    dqOpen:false,
    pxOpen:false,
    flList:[
      { imgUrl:'s_all@2x.png',txt:'全部'},
      { imgUrl:'vegetables_veg@2x.png',txt:'蔬菜'},
      { imgUrl:'vegetables_meat@2x.png',txt:'肉类'},
      { imgUrl:'vegetables_seafood@2x.png',txt:'海鲜'},
      { imgUrl:'s_eggs@2x.png',txt:'蛋类'},
      { imgUrl:'vegetables_dry@2x.png',txt:'干货'},
      { imgUrl:'vegetables_fruit@2x.png',txt:'水果'},
      { imgUrl:'vegetables_dishes@2x.png',txt:'配菜'},
      { imgUrl:'vegetables_other@2x.png',txt:'其他'},
    ],
    dqList:[],
    sqList:[],
    sqShow:false,
    dqID:'',
    dqIndex:'',
    pxList: ['智能排序', '起送最低', '送货最快', '距离最近'],
    lazy_load:true
  },
  // 头部搜索
  topSearch:function(){
    wx.navigateTo({
      url: './shopSearch/shopSearch',
    })
  },
  // 店铺下单
  shopOnClick:function(e){
    wx.navigateTo({
      url: '../../pages/home/shopDetails/shopDetails?shopID=' + e.currentTarget.dataset.id +"&gradeid="+15,
    })
  },
  //类型选择
  typeSelect:function(e){
    var that = this;
    this.setData({
      cateID: e.currentTarget.dataset.id
    });
    pages = 1;
    requestType(that);
    this.hiddenSelect();
  },
  //分类，地区，排序选择
  clickNav:function(e){
    var that = this;
    console.log('1234567896463')
    switch (parseInt(e.currentTarget.dataset.nav)) {
      case 1:
        that.setData({
          isSelect:true,
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
        var cityID= wx.getStorageSync("cityID")
        requestDqType(that,cityID);
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
  hiddenSelect:function(){
    this.setData({
      isSelect: false,
      isScroll: true
    });
  },
  // 分类点击
  flClick:function(e){
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
  dqClick:function(e){
    var that = this;
    this.setData({
      areaID: e.currentTarget.dataset.id,
      dqID: e.currentTarget.dataset.id,
      dqIndex: e.currentTarget.dataset.index,
      sqShow:true,
      sqList: that.data.dqList[e.currentTarget.dataset.index].business
    });
  },
  //商圈点击
  sqClick:function(e){
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
  pxClick:function(e){
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
      success: function(res) {
        that.setData({
          windowHeight:res.windowHeight
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
    var that = this;
    // getLocation(that);
    
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
    // if (this.data.cateID == '' || this.data.order == '' || this.data.businessID == '' || this.data.areeID==''){
    //   requestShop(that);
    // }else{
    //   requestType(that);
    // }
    requestShop(that);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})