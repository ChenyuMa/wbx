// pages/home/shopDetails/searchTo/searchTo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight: '',
    inputTxt: '',
    isCancel: 'none',
    goodsAllList: '',
    searchList: [],
    gradeid: '',
    imgUrls: getApp().globalData.imgUrls,
    is_goodsDetails:false
  },

  //输入框改变
  valueChange: function (e) {
    var that = this;
    if (e.detail.value != '') {
      that.setData({
        isCancel: 'block'
      });
    } else if (e.detail.value == '') {
      that.setData({
        searchList: []
      });
    } else {
      that.setData({
        isCancel: 'none'
      });
    }
    //搜索标题
    var goodsAllList = this.data.goodsAllList;
    var value = e.detail.value;
    var searchList = this.data.searchList;
    if (this.data.gradeid == 15) {
      for (var i = 0; i < goodsAllList.length; i++) {
        var str = goodsAllList[i].product_name
        if (e.detail.value != '' && str.indexOf(value) == 0) {
          searchList.push(goodsAllList[i]);
        }
      }
    } else {
      for (var i = 0; i < goodsAllList.length; i++) {
        var str = goodsAllList[i].title
        if (e.detail.value != '' && str.indexOf(value) == 0) {
          searchList.push(goodsAllList[i]);
        }
      }
    }

    this.setData({
      searchList: searchList
    });
  },
  // 输入框失去焦点
  valueBlur: function (e) {
    var that = this;
    this.setData({
      inputTxt: e.detail.value
    });
    if (that.data.searchList.length == 0){
      that.setData({
        is_goodsDetails:true
      });
    }
  },
  //清空内容
  cancelTxt: function () {
    var that = this;
    this.setData({
      inputTxt: ''
    });

    that.setData({
      isCancel: 'none'
    });

  },
  //商品减少
  goodsSubtraction: function (e) {
    var goodsAllList = this.data.goodsAllList;
    var searchList = this.data.searchList;
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    if (this.data.gradeid == 15) {
      prevPage.shopCartSubtraction(e);
      prevPage.isShopCart();
      for (var i = 0; i < goodsAllList.length; i++) {
        if (goodsAllList[i].product_id == e.target.dataset.id) {
          var num = goodsAllList[i].buy_num;
          if (num < 1) {
            return false;
          }
          num--;
          goodsAllList[i].buy_num = num;
          searchList[i] = goodsAllList[i]
        }
      }
    } else {
      prevPage.shopCartSubtraction(e);
      prevPage.isShopCart();
      for (var i = 0; i < goodsAllList.length; i++) {
        if (goodsAllList[i].goods_id == e.target.dataset.id) {
          var num = goodsAllList[i].buy_num;
          if (num < 1) {
            return false;
          }
          num--;
          goodsAllList[i].buy_num = num;
          searchList[i] = goodsAllList[i]
        }
      }
    }

    this.setData({
      goodsAllList: goodsAllList,
      searchList: searchList
    })
  },
  //商品添加
  goodsAdd: function (e) {
    var that = this;
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    if (this.data.gradeid == 15) {
      prevPage.shopCartAdd(e);
      prevPage.isShopCart();
      var goodsAllList = this.data.goodsAllList;
      var searchList = this.data.searchList;
      for (var i = 0; i < goodsAllList.length; i++) {
        if (goodsAllList[i].product_id == e.target.dataset.id) {
          var num = goodsAllList[i].buy_num;
          num++;
          goodsAllList[i].buy_num = num;
          searchList[i] = goodsAllList[i]
        }
      }
    } else {
      prevPage.shopCartAdd(e);
      prevPage.isShopCart();
      var goodsAllList = this.data.goodsAllList;
      var searchList = this.data.searchList;
      for (var i = 0; i < goodsAllList.length; i++) {
        if (goodsAllList[i].goods_id == e.target.dataset.id) {
          var num = goodsAllList[i].buy_num;
          num++;
          goodsAllList[i].buy_num = num;
          searchList[i] = goodsAllList[i]
        }
      }
    }

    this.setData({
      goodsAllList: goodsAllList,
      searchList: searchList
    })
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
        });
      },
    })
    // 转换json为数组
    var goodsAllList = JSON.parse(options.goodsAllList)
    this.setData({
      goodsAllList: goodsAllList,
      gradeid: options.gradeid
    });
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