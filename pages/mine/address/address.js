// pages/mine/address/address.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressAPI: '/api/user/list_address',
    addressDefaultAPI: '/api/user/set_default_address',
    addressDeleting: '/api/user/delete_address',
    addressList: [],
    windowHeight: ''
  },
  //新增地址
  addressAdd: function() {
    wx.navigateTo({
      url: './addressAdd/addressAdd',
    })
  },
  //编辑地址
  addressEdit: function (e) {
    console.log("点击编辑地址",e)
    wx.navigateTo({
      url: './addressEdit/addressEdit?addr=' + JSON.stringify(e.currentTarget.dataset.addr) ,
      //url: './addressEdit/addressEdit?addr=' +e.currentTarget.dataset.addr,
    })
  },

  //删除地址
  deleting: function(e) {
    var that = this;
    wx.request({
      url: getApp().globalData.url + that.data.addressDeleting,
      data: {
        login_token: wx.getStorageSync('loginToken'),
        id: e.currentTarget.id
      },
      header: {
        'content-type': 'application/json'
      },
      method: "POST",
      dataType: 'json',
      success: function(res) {
        if(res.data.state==1){
          var addressList = that.data.addressList;
          for (var i = 0; i < addressList.length; i++) {
            if (addressList[i].id == e.currentTarget.id) {
              addressList.splice(i, 1);
            }
          }
          that.setData({
            addressList: addressList
          });
          wx.showToast({
            title: '删除成功',
          })
        }
        
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  //默认地址
  addressDefault: function(e) {
    var that = this;
    wx.request({
      url: getApp().globalData.url + that.data.addressDefaultAPI,
      data: {
        login_token: wx.getStorageSync('loginToken'),
        id: e.currentTarget.id
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      dataType: 'json',
      success: function(res) {
        //console.log("resssss",res)
        if(res.data.state==1){
          var pages = getCurrentPages();
          var prePage = pages[pages.length - 2];
          console.log(prePage);
          if (prePage.route == 'pages/mine/mine') {

          }
          wx.navigateBack({
            delta: 1
          })
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    //获取高度
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          windowHeight: res.windowHeight
        });
      },
    })

    // wx.request({
    //   url: getApp().globalData.url + that.data.addressAPI,
    //   data: {
    //     login_token: wx.getStorageSync('loginToken')
    //   },
    //   header: {
    //     'content-type': 'application/json'
    //   },
    //   method: 'POST',
    //   dataType: 'json',
    //   success: function(res) {
    //     console.log('获取地址列表：',res);
    //     that.setData({
    //       addressList: res.data.data
    //     });

    //   },
    //   fail: function(res) {},
    //   complete: function(res) {},
    // })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    this.setData({
      addressList: []
    });
    wx.request({
      url: getApp().globalData.url + that.data.addressAPI,
      data: {
        login_token: wx.getStorageSync('loginToken')
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      dataType: 'json',
      success: function(res) {
        console.log(res.data.data);
        if(res.data.state == 0){
          wx.showToast({
            title: res.data.msg,
            // icon: 'none',
          })
        }else{
          that.setData({
            addressList: res.data.data
          });
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})