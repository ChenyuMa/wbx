var needPay=0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    redPacketList:[],
    indate: '',
    imgURL: '',
    red_packet_id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that = this;
    needPay = options.actual_pay;
    var list = JSON.parse(options.red_packet)
    that.setData({
      redPacketList: list,
      imgURL: getApp().globalData.imgUrls
    })
  },

  //红包选择
  selectRedPacket: function (e) {
    var that = this;
    var money = e.currentTarget.dataset.money
    if (money > (needPay/100.00)){
      wx.showToast({
        title: '红包大于需付金额',
        icon:'none',
        duration:2000
      })
    }else{
      that.setData({
        red_packet_id: e.currentTarget.dataset.red_packet_id
      })
      var pages = getCurrentPages();
      if (pages.length > 1) {
        var prePage = pages[pages.length - 2];
        prePage.changeRed(money, that.data.red_packet_id, 2)
        wx.navigateBack({
          delta: 1
        })
      }
    }
  },
  //不使用红包
  unSelectRedPacket: function () {
    var that = this;
    that.setData({
      red_packet_id: ""
    })
    var pages = getCurrentPages();
    if (pages.length > 1) {
      var prePage = pages[pages.length - 2];
      prePage.changeRed(0, "", 1)
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