// pages/home/sweepOrder/sweepOrder.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 屏幕高度
    windowHeight: '',
    shopID:'',
    // 桌位
    seat:'',
    // 就餐人数
    selectNum:1,
    // 就餐方式
    selectRepast:0
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

    // 获取店铺信息
    this.setData({ shopID: options.shopID, seat: JSON.parse(options.seat)});

    // 获取店铺详情
    this.shopRequest();

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

  /**
   * 获取店铺信息
    */
  shopRequest:function(){
    var that = this;
    wx.request({
      url: getApp().globalData.url +'/api/shop/get_goods',
      data: { shop_id:that.data.shopID},
      header: { 'content-type': 'application/json'},
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        wx.setNavigationBarTitle({
          title: res.data.data.detail.shop_name,
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  /**
   * 选择就餐人数
   */
  selectNum:function(e){
    // console.log(e);
    this.setData({
      selectNum: e.currentTarget.dataset.num
    });
  },

  /**
   * 选择就餐地点
   */
  selectRepast:function(e){
    this.setData({
      selectRepast: e.currentTarget.dataset.repast
    });
  },

  /**
   * 点击确定
   */
  clickConfirm:function(){
    wx.navigateTo({
      url: '../shopDetails/shopDetails?shopID=' + this.data.shopID + "&gradeid=" + 20 + "&seat=" + this.data.seat + "&selectNum=" + this.data.selectNum + "&selectRepast=" + this.data.selectRepast +"&sweepOrder=" + true,
    })
  }
})