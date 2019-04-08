// pages/mine/helpCenter/helpCenter.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight:'',
    imgUrls:getApp().globalData.imgUrls,
    url:getApp().globalData.url,
    is_common:false,
    jumpUrl:'https://www.wbx365.com',
    serviceUrl:'https://www.wbx365.com'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          windowHeight:res.windowHeight
        });
      }
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
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  // 点击我想买菜
  clickVegetables:function(){
    wx.navigateTo({
      url: '../../shop/shop',
    })
  },

  // 点击人工客服
  clickArtificial:function(){
    var that = this;
    wx.showModal({
      title: '提示',
      content: '敬请期待',
    })
    // wx.navigateTo({
    //   url: './artificial/artificial?serviceUrl=' + that.data.serviceUrl,
    //   success: function (res) { },
    //   fail: function (res) { },
    //   complete: function (res) { },
    // })
    // wx.request({
    //   url: getApp().globalData.url + '/sjapi/user/get_baidutim_url',
    //   data: '',
    //   header: {'content-type': 'application/json'},
    //   method: 'POST',
    //   dataType: 'json',
    //   responseType: 'text',
    //   success: function(res) {
    //     console.log(res);
    //     that.setData({ serviceUrl:res.data.data.url});
    //     wx.navigateTo({
    //       url: './artificial/artificial?serviceUrl=' + that.data.serviceUrl,
    //       success: function(res) {},
    //       fail: function(res) {},
    //       complete: function(res) {},
    //     })
    //   },
    //   fail: function(res) {},
    //   complete: function(res) {},
    // })
  },

  // 点击常见问题
  clickProblem:function(){
    var that = this;
    // wx.request({
    //   url: getApp().globalData.url +'/api/airobot/list_often_question',
    //   data: {},
    //   header: {'content-type': 'application/json'},
    //   method: 'POST',
    //   dataType: 'json',
    //   responseType: 'text',
    //   success: function(res) {
    //     console.log(res);
    //     that.setData({
    //       problemList:res.data.data
    //     });
    //   },
    //   fail: function(res) {},
    //   complete: function(res) {},
    // })
    // this.setData({
    //   is_common:true
    // });
    // wx.navigateTo({
    //   url: './common/common',
    // })

    wx.showModal({
      title: '提示',
      content: '敬请期待',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  // 点击选项
  clickType:function(e){
    console.log(e);
    var that = this;
    this.setData({
      jumpUrl:that.data.jumpUrl
    });
  }
})