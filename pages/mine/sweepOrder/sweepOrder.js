// pages/mine/sweepOrder/sweepOrder.js
var util = require('../../../utils/util.js');
var page = 1;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 屏幕高度
    windowHeight: '',
    sweepOrderList:[]
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
    });
    if (options.isTakeNumber==1){
      that.setData({ isTakeNumber: options.isTakeNumber})
      this.getTakeNumber();
    }else{
      this.getSweepOrder();
    }
  },
 
  //点击购物车
  clickCar: function () {
    wx.navigateTo({
      url: '../shopCart/shopCart',
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
    page = 1;
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

  /**
   * 获取扫码点餐列表
   */
  getSweepOrder:function(){
    var that = this;
    wx.request({
      url: getApp().globalData.url +'/api/scanorder/scan_order_list',
      data: {
        login_token:wx.getStorageSync('loginToken'),
        page:page,
        num:10
      },
      header: { 'content-type': 'application/json' },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        console.log('获取取号订单',res);
        if(res.data.state == 0){
          wx.showToast({
            title: res.data.msg,
          })
        }else{
          if(res.data.msg == '暂无数据'){
            wx.showToast({
              title: '暂无数据',
            })
          }else{
            var sweepOrderList = that.data.sweepOrderList;
            var list = res.data.data;
            for (var i = 0; i < list.length; i++) {
              sweepOrderList.push(res.data.data[i]);
            }
            that.setData({ sweepOrderList: sweepOrderList });
          }
          
        }
      },
      fail: function(res) {},
      complete: function(res) {
        page++;
      },
    })
  },

  // 获取叫号点餐
  getTakeNumber:function(){
    var that = this;
    wx.request({
      url: getApp().globalData.url + '/api/userorder/list_take_number_order',
      data: {
        login_token: wx.getStorageSync('loginToken'),
        page: page,
        num: 10,
        // status:8
      },
      header: { 'content-type': 'application/json' },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        console.log('获取取号订单', res);
        if (res.data.state == 0) {
          wx.showToast({
            title: res.data.msg,
          })
        } else {
          if (res.data.msg == '暂无数据') {
            wx.showToast({
              title: '暂无数据',
            })
          } else {
            var sweepOrderList = that.data.sweepOrderList;
            var list = res.data.data;
            for (var i = 0; i < list.length; i++) {
              var createtime = res.data.data[i].create_time;
              var newDate = new Date();
              newDate.setTime(createtime * 1000);
              res.data.data[i].status = res.data.data[i].status==0?'未付款':'已完成';
              res.data.data[i].create_time = util.formatTime(newDate);
              sweepOrderList.push(res.data.data[i]);
            }
            that.setData({ sweepOrderList: sweepOrderList });
          }

        }
      },
      fail: function (res) { },
      complete: function (res) {
        page++;
      },
    })
  },

  /**
   * 页面触底
   */
  scrolltolower:function(){
    var that = this;
    if (this.data.isTakeNumber==1){
      that.getTakeNumber();
    }else{
      that.getSweepOrder();
    }
  },

  /**
   * 点击加菜
   */
  clickAddFood:function(e){
    // console.log(e);
    wx.navigateTo({
      url: '../../home/shopDetails/shopDetails?shopID=' + e.currentTarget.dataset.item.shop_id + "&gradeid=" + e.currentTarget.dataset.item.grade_id + "&sweepOrder=" + 'true' + "&seat=" + e.currentTarget.dataset.item.seat + "&selectNum=" + e.currentTarget.dataset.item.people_num + "&selectRepast=" + e.currentTarget.dataset.item.eat_type,
    })
  },

  /**
   * 点击付款
   */
  clickPay:function(e){
    var that = this;
    wx.navigateTo({
      url: '../../home/shopDetails/sweepPages/confirmClearing/confirmClearing?out_trade_no=' + e.currentTarget.dataset.item.out_trade_no + '&isTakeNumber=' + that.data.isTakeNumber,
    })
  },

  /**
   * 点击查看详情
   */
  clickDetail:function(e){
    var that = this;
    if (this.data.isTakeNumber==1){
      wx.navigateTo({
        url: '../shopOrder/orderDetails/orderDetails?orderID=' + e.currentTarget.dataset.orderid + '&selected=2' + '&orderType=2',
      })
    }
  }
})