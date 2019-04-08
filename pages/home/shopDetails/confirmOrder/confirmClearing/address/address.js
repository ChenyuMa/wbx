// pages / home / shopDetails / confirmOrder / confirmClearing / address / address

Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressAPI: '/api/user/list_address',
    addressDefaultAPI: '/api/user/set_default_address',
    addressDeleting: '/api/user/delete_address',
    addressList: [],
    windowHeight: '',
    id:''
  },
  //新增地址
  addressAdd: function () {
    wx.navigateTo({
      url: './addressAdd/addressAdd',
    })
  },
  // 选择当前收货地址
  select_address: function () {

  },
  //编辑地址
  addressEdit: function (e) {
    console.log("点击编辑地址", e)
    wx.navigateTo({
      url: './addressEdit/addressEdit?addr=' + JSON.stringify(e.currentTarget.dataset.addr),
    })
  },
  //删除地址
  deleting: function (e) {
    var that = this;
    wx.request({
      url: getApp().globalData.url + that.data.addressDeleting,
      data: {
        login_token: wx.getStorageSync('loginToken'),
        id: e.currentTarget.id
      },
      header: { 'content-type': 'application/json' },
      method: "POST",
      dataType: 'json',
      success: function (res) {
        that.setData({
          addressList: []
        });
        wx.request({
          url: getApp().globalData.url + that.data.addressAPI,
          data: {
            login_token: wx.getStorageSync('loginToken')
          },
          header: { 'content-type': 'application/json' },
          method: 'POST',
          dataType: 'json',
          success: function (res) {
            that.setData({
              addressList: res.data.data
            });
            wx.showToast({
              title: '删除成功',
            })
          },
          fail: function (res) { },
          complete: function (res) { },
        })
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  //默认地址
  addressDefault: function (e) {
    var that = this;
    wx.request({
      url: getApp().globalData.url + that.data.addressDefaultAPI,
      data: {
        login_token: wx.getStorageSync('loginToken'),
        id: e.currentTarget.id
      },
      header: { 'content-type': 'application/json' },
      method: 'POST',
      dataType: 'json',
      success: function (res) {
        console.log('默认地址:',res);
        if(res.data.state==0){

        }else{
          wx.request({
            url: getApp().globalData.url + that.data.addressAPI,
            data: {
              login_token: wx.getStorageSync('loginToken')
            },
            header: { 'content-type': 'application/json' },
            method: 'POST',
            dataType: 'json',
            success: function (res) {
              console.log('更换默认地址:', res);
              if(res.data.state==0){
                wx.showToast({
                  title: res.data.msg,
                })
              }else{
                that.setData({
                  addressList: res.data.data
                });
                for (var i = 0; i < that.data.addressList.length; i++) {
                  if (that.data.addressList[i].default == 1) {
                    var pages = getCurrentPages();
                    var currPage = pages[pages.length - 2];
                    // var orderList = currPage.data.orderList;
                    // orderList.address = that.data.addressList[i];
                    currPage.setData({
                      addrID: that.data.addressList[i].id,
                      isSetAddr: true
                    });
                  };
                };
              }
            },
            fail: function (res) { },
            complete: function (res) {
              wx.navigateBack({
                delta: 1,
              })
            },
          })
        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //获取高度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight
        });
      },
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
    this.getAddr();
    
    this.onLoad();

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
    var that = this;
    // var pages = getCurrentPages();
    // var currPage = pages[pages.length - 2];
    // currPage.getPayInfo();
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
   * 请求地址
   */
  getAddr: function () {
    var that = this;
    wx.request({
      url: getApp().globalData.url + that.data.addressAPI,
      data: {
        login_token: wx.getStorageSync('loginToken')
      },
      header: { 'content-type': 'application/json' },
      method: 'POST',
      dataType: 'json',
      success: function (res) {
        console.log('请求地址:',res);
        for(var i=0;i<res.data.data.length;i++){
          if (res.data.data[i].default == 1){
            that.setData({
              id:res.data.data[i].id
            });
          }
        }
        that.setData({
          addressList: res.data.data
        });
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  }
})