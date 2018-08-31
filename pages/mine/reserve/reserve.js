// pages/mine/reserve/reserve.js
var page = 1;
var num = 20;
function timestampToTime(timestamp) {
  var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var D = date.getDate() + ' ';
  var h = date.getHours() + ':';
  var m = date.getMinutes() + ':';
  var s = date.getSeconds();
  return Y + M + D + h + m + s;
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight:'',
    currentTab:0,
    status:0,
    // 待付款
    waitPayList:[],
    // 待接单
    waitOrderList:[],
    // 待用餐
    waitDiningList:[],
    // 待退款
    waitDefundList:[],
    // 已完成
    completeList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({windowHeight:res.windowHeight});
      },
    })
    that.requestSubscribe();
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
  
  },

  // 点击头部栏
  swichNav:function(e){
    this.setData({
      currentTab: e.currentTarget.dataset.current
    });
    
  } ,

  // 界面侧滑
  swiperChange:function(e){
    var that = this;
    this.setData({
      currentTab: e.detail.current
    });
    switch (e.detail.current) {
      case 0:
        that.setData({ status: 0, waitPayList:[]});
        break;
      case 1:
        that.setData({ status: 1, waitOrderList:[]});
        break;
      case 2:
        that.setData({ status: 2, waitDiningList:[]});
        break;
      case 3:
        that.setData({ status: 4, waitDefundList:[]});
        break;
      case 4:
        that.setData({ status: 8, completeList:[]});
        break;
      default:
    }
    page = 1;
    this.requestSubscribe();
  },

  // 获取预定列表
  requestSubscribe: function (){
    var that = this;
    wx.request({
      url: getApp().globalData.url + '/api/subscribe/list_subscribe',
      data: {
        login_token: wx.getStorageSync('loginToken'),
        page: page,
        num: num,
        status: that.data.status
      },
      header: { 'content-type': 'application/json' },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        console.log('预订：',res);
        if(res.data.state == 0){
          wx.showToast({
            title: res.data.msg,
          })
        } else if (res.data.msg == '暂无数据'){
          wx.showToast({
            title: res.data.msg,
          })
        }else{
          var List = res.data.data;
          for (var i = 0; i < List.length; i++) {
            let time = List[i].reserve_time;
            List[i].reserve_time = timestampToTime(time);
          }
          switch (that.data.status) {
            case 0:
              var waitPayList = that.data.waitPayList;
              for (var i = 0; i < List.length; i++){
                waitPayList.push(List[i]);
              }
              that.setData({ waitPayList: waitPayList});
              break;
            case 1:            
              var waitOrderList = that.data.waitOrderList;
              for (var i = 0; i < List.length; i++) {
                waitOrderList.push(List[i]);
              }
              that.setData({ waitOrderList: waitOrderList });
              break;
            case 2:
              var waitDiningList = that.data.waitDiningList;
              for (var i = 0; i < List.length; i++) {
                waitDiningList.push(List[i]);
              }
              that.setData({ waitDiningList: waitDiningList });
              break;
            case 4:
              var waitDefundList = that.data.waitDefundList;
              for (var i = 0; i < List.length; i++) {
                waitDefundList.push(List[i]);
              }
              that.setData({ waitDefundList: waitDefundList });
              break;
            case 8:
              var completeList = that.data.completeList;
              for (var i = 0; i < List.length; i++) {
                completeList.push(List[i]);
              }
              that.setData({ completeList: completeList });
              break;
              
            default:
          }
        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  // 删除订单
  deleteOrder:function(e){
    var that = this;
    wx.request({
      url: getApp().globalData.url +'/api/subscribe/delete_subscribe',
      data: {
        login_token:wx.getStorageSync('loginToken'),
        reserve_table_id: e.currentTarget.dataset.id
      },
      header: {'content-type': 'application/json'},
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        if (res.data.state == 0){
          wx.showToast({
            title: res.data.msg,
          })
        } else{
          var waitPayList = that.data.waitPayList;
          for(var i =0;i<waitPayList.length;i++){
            if (waitPayList[i].reserve_table_id == e.currentTarget.dataset.id){
              waitPayList.splice(i,1);
              that.setData({waitPayList:waitPayList});
            }
          }
          if (waitPayList.length == 0){
            that.requestSubscribe();
          }
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  // 订单详情
  detailsOrder:function(e){
    var that = this;
    switch (this.data.currentTab) {
      case 0:
        for (var i = 0; i < that.data.waitPayList.length;i++){
          if (that.data.waitPayList[i].reserve_table_id == e.currentTarget.dataset.id){
            wx.navigateTo({
              url: './detailsOrder/detailsOrder?List=' + JSON.stringify(that.data.waitPayList[i]),
            })
          };
        }
        break;
      case 1:
        for (var i = 0; i < that.data.waitOrderList.length; i++) {
          if (that.data.waitOrderList[i].reserve_table_id == e.currentTarget.dataset.id) {
            wx.navigateTo({
              url: './detailsOrder/detailsOrder?List=' + JSON.stringify(that.data.waitOrderList[i]),
            })
          };
        }
        break;
      case 2:
        for (var i = 0; i < that.data.waitDiningList.length; i++) {
          if (that.data.waitDiningList[i].reserve_table_id == e.currentTarget.dataset.id) {
            wx.navigateTo({
              url: './detailsOrder/detailsOrder?List=' + JSON.stringify(that.data.waitDiningList[i]),
            })
          };
        }
        break;
      case 3:
        for (var i = 0; i < that.data.waitDefundList.length; i++) {
          if (that.data.waitDefundList[i].reserve_table_id == e.currentTarget.dataset.id) {
            wx.navigateTo({
              url: './detailsOrder/detailsOrder?List=' + JSON.stringify(that.data.waitDefundList[i]),
            })
          };
        }
        break;
      case 4:
        for (var i = 0; i < that.data.completeList.length; i++) {
          if (that.data.completeList[i].reserve_table_id == e.currentTarget.dataset.id) {
            wx.navigateTo({
              url: './detailsOrder/detailsOrder?List=' + JSON.stringify(that.data.completeList[i]),
            })
          };
        }
        break;
      default:
    }
    
  },

  // 去付款
  toPay:function(e){
    var that = this;
    wx.request({
      url: getApp().globalData.url +'/api/subscribe/get_pay_info',
      data: {
        login_token: wx.getStorageSync('loginToken'),
        reserve_table_id: e.currentTarget.dataset.id
      },
      header: { 'content-type': 'application/json'},
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        wx.navigateTo({
          url: './confirmClearing/confirmClearing?orderList=' + JSON.stringify(res.data.data),
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  //取消订单
  cancelOrder:function(e){
    var that = this;
    wx.request({
      url: getApp().globalData.url +'/api/subscribe/cancel_subscribe',
      data: {
        login_token: wx.getStorageSync('loginToken'),
        reserve_table_id: e.currentTarget.dataset.id
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
          var waitOrderList = that.data.waitOrderList;
          for (var i = 0; i < waitOrderList.length; i++) {
            if (waitOrderList[i].reserve_table_id == e.currentTarget.dataset.id) {
              waitOrderList.splice(i, 1);
              that.setData({ waitOrderList: waitOrderList });
            }
          }
          if (waitOrderList.length == 0) {
            that.requestSubscribe();
          }
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  // 申请退款
  applyRefund:function(e){
    var that = this;
    wx.request({
      url: getApp().globalData.url +'/api/subscribe/apply_refund',
      data: {
        login_token: wx.getStorageSync('loginToken'),
        reserve_table_id: e.currentTarget.dataset.id
      },
      header: { 'content-type': 'application/json'},
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        if(res.data.state == 0){
          wx.showToast({
            title: res.data.msg,
          });
        }else{
          var waitDiningList = that.data.waitDiningList;
          for (var i = 0; i < waitDiningList.length; i++) {
            if (waitDiningList[i].reserve_table_id == e.currentTarget.dataset.id) {
              waitDiningList.splice(i, 1);
              that.setData({ waitDiningList: waitDiningList });
            }
          }
          if (waitDiningList.length == 0) {
            that.requestSubscribe();
          }
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  // 取消退款
  cancelRefund:function(e){
    var that = this;
    wx.request({
      url: getApp().globalData.url + '/api/subscribe/cancel_subscribe_refund',
      data: {
        login_token: wx.getStorageSync('loginToken'),
        reserve_table_id: e.currentTarget.dataset.id
      },
      header: { 'content-type': 'application/json' },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        if (res.data.state == 0) {
          wx.showToast({
            title: res.data.msg,
          });
        } else {
          var waitDefundList = that.data.waitDefundList;
          for (var i = 0; i < waitDefundList.length; i++) {
            if (waitDefundList[i].reserve_table_id == e.currentTarget.dataset.id) {
              waitDefundList.splice(i, 1);
              that.setData({ waitDefundList: waitDefundList });
            }
          }
          if (waitDefundList.length == 0) {
            that.requestSubscribe();
          }
        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  }
})