// pages/home/shopDetails/confirmOrder/confirmClearing/userCoupons/userCoupons.js
function timestamp(timestamp) {
  var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + '年';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '月';
  var D = (date.getDate() < 10 ? '0' : '') + date.getDate() + '日';
  // var h = (date.getHours() < 10 ? '0' : '') + date.getHours() + ':';
  // var m = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes() + ':';
  // var s = (date.getSeconds() < 10 ? '0' : '') + date.getSeconds();
  return Y + M + D ;
}
var needPay=0
Page({

  /**
   * 页面的初始数据
   */
  data: {
    couponList:[],
    indate:'',
    imgURL:'',
    receive_id:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    needPay = options.actual_pay;
    var list = JSON.parse(options.user_coupons)
    for (var i = 0; i < list.length;i++){
      list[i].end_time = timestamp(list[i].end_time)
    }
    that.setData({
      couponList: list,
      imgURL: getApp().globalData.imgUrls
    })
  },

  //优惠券选择
  selectCoupon:function(e){
    var that=this;
    var money = e.currentTarget.dataset.money
    if (money > (needPay / 100.00)) {
      wx.showToast({
        title: '优惠券大于需付金额',
        icon: 'none',
        duration: 2000
      })
    } else {
      that.setData({
        receive_id: e.currentTarget.dataset.receive_id
      })
      var pages=getCurrentPages();
      if(pages.length>1){
        var prePage = pages[pages.length - 2];
        prePage.change(money,that.data.receive_id,2)
        wx.navigateBack({
          delta:1
        })
      }
    }
  },
  //不使用优惠券
  unSelectCoupon:function(){
    var that=this;
    that.setData({
      receive_id:""
    })
    var pages = getCurrentPages();
    if (pages.length > 1) {
      var prePage = pages[pages.length - 2];
      prePage.change(0,"",1)
      wx.navigateBack({
        delta: 1
      })
    }
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