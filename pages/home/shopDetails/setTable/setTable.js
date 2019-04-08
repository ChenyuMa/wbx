// pages/home/shopDetails/setTable/setTable.js
function getDate(index) {
  var date = new Date(); //当前日期
  var newDate = new Date();
  newDate.setDate(date.getDate() + index); //官方文档上虽然说setDate参数是1-31,其实是可以设置负数的
  var time = newDate.getFullYear() + "-" + (newDate.getMonth() + 1) + "-" + newDate.getDate();
  return time;
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight: '',
    imgUrls: getApp().globalData.imgUrls,
    dataValue: '请选择最近七天日期',
    startData: getDate(0),
    endData: getDate(7),
    timeValue: '请选择时间',
    nameValue: '',
    phoneValue: '',
    numberValue: '',
    areaValue: '',
    data: 0,
    is_selectType: false,
    userLogin: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          windowHeight: res.windowHeight
        })
      },
    })
    this.setData({
      subscribe: options.subscribe,
      shopID: options.shopID
    });
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

  },

  // 日期输入
  inputData: function(e) {
    this.setData({
      dataValue: e.detail.value
    });
  },

  // 时间输入
  inputTime: function(e) {
    this.setData({
      timeValue: e.detail.value
    });
  },

  // 姓名输入
  inputName: function(e) {
    this.setData({
      nameValue: e.detail.value
    });
  },

  // 电话输入
  inputPhone: function(e) {
    this.setData({
      phoneValue: e.detail.value
    });
  },

  // 用餐人数
  inputNumber: function(e) {
    this.setData({
      numberValue: e.detail.value
    });
  },

  // 备注人数
  inputArea: function(e) {
    this.setData({
      areaValue: e.detail.value
    });
  },

  // 确认订单
  confirmOrder: function() {
    var that = this;
    var time;
    wx.getSystemInfo({
      success: function(res) {
        if (res.system.indexOf('iOS') > -1) {
          time = that.data.dataValue + 'T' + that.data.timeValue;
        } else {
          time = that.data.dataValue + ' ' + that.data.timeValue;
        }
      },
    })
    var date = new Date(time).getTime() / 1000;
    console.log('确认订单时间：', new Date(time).getTime() / 1000);
    this.setData({
      is_selectType: true,
      data: date
    });
  },

  // 点击头部
  clickTop: function() {
    this.setData({
      is_selectType: false
    });
  },

  // 选择点菜
  clickType: function(e) {
    var that = this;
    if (!that.data.nameValue) {
      wx.showToast({
        title: '请输入名字',
      })
      return false;
    } else if (!that.data.phoneValue) {
      wx.showToast({
        title: '请输入电话',
      })
      return false;
    } else if (that.data.phoneValue.length > 11) {
      wx.showToast({
        title: '电话号码不正确',
      })
    } else if (!that.data.numberValue) {
      wx.showToast({
        title: '请输入人数',
      })
      return false;
    } else if (!that.data.data) {
      console.log('选择了时间', that.data.data);
      wx.showToast({
        icon:'none',
        title: '请选择时间',
      })
      return false;
    } else {
      console.log('请求', that.data.data);
      wx.request({
        url: getApp().globalData.url + '/api/subscribe/append_seat',
        data: {
          login_token: wx.getStorageSync('loginToken'),
          name: that.data.nameValue,
          mobile: that.data.phoneValue,
          reserve_time: that.data.data,
          number: that.data.numberValue,
          note: that.data.areaValue,
          shop_id: that.data.shopID,
          type: e.currentTarget.dataset.id
        },
        header: {
          'content-type': 'application/json'
        },
        method: 'POST',
        dataType: 'json',
        responseType: 'text',
        success: function(res) {
          console.log('success:', res)
          if (res.data.state == 0) {
            if (res.data.msg == "请先登陆") {

            } else if (res.data.msg == "请先绑定手机") {
              wx.navigateTo({
                url: '../../../bindPhone/bindPhone',
              })
            } else {
              wx.showToast({
                icon:'none',
                title: res.data.msg,
              })
            }
          } else {

            var reserve_table_id = res.data.data.reserve_table_id;
            var pages = getCurrentPages();
            var prevPage = pages[pages.length - 2];
            if (e.currentTarget.dataset.id == 1) {
              wx.request({
                url: getApp().globalData.url + '/api/subscribe/get_pay_info',
                data: {
                  login_token: wx.getStorageSync('loginToken'),
                  reserve_table_id: reserve_table_id
                },
                header: {
                  'content-type': 'application/json'
                },
                method: 'POST',
                dataType: 'json',
                responseType: 'text',
                success: function(res) {
                  console.log("res",res)
                  if (res.data.state == 0) {
                    wx.showToast({
                      title: res.data.msg,
                    })
                  } else {
                    wx.navigateTo({
                      url: '../../../mine/reserve/confirmClearing/confirmClearing?orderList=' + JSON.stringify(res.data.data),
                    })
                  }
                },
                fail: function(res) {},
                complete: function(res) {},
              })
            } else {
              // wx.request({
              //   url: getApp().globalData.url + '/api/subscribe/get_pay_info',
              //   data: {
              //     login_token: wx.getStorageSync('loginToken'),
              //     reserve_table_id: reserve_table_id
              //   },
              //   header: {
              //     'content-type': 'application/json'
              //   },
              //   method: 'POST',
              //   dataType: 'json',
              //   responseType: 'text',
              //   success: function(res) {
              //   },
              //   fail: function(res) {},
              //   complete: function(res) {
              //     console.log(res);

              //   },
              // })
              wx.showToast({
                icon:'none',
                title: '预定完成!返回店铺下单',
                duration:3000
              })
              setTimeout(function() {
                if (prevPage.route == "pages/home/store/store") {
                  wx.navigateTo({
                    url: '../../shopDetails/shopDetails?shopID=' + that.data.shopID + '&gradeid=20' + '&reserve_table_id=' + reserve_table_id,
                  })
                } else {
                  prevPage.setData({
                    reserve_table_id: reserve_table_id
                  });
                  wx.navigateBack({
                    delta: 1
                  })
                }
              }, 3000);
            }
          }
        },
        fail: function(res) {},
        complete: function(res) {},
      })
    }
  }
})