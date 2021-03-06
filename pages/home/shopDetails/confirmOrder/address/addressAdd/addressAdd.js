// pages/mine/address/addressAdd/addressAdd.js
var p = 0, c = 0, d = 0;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    windowHeight: '',
    addressAPI: '/api/index/list_paddlist',
    List: [],
    provinceName: [],
    provinceCode: [],
    provinceSelIndex: '',
    cityName: [],
    cityCode: [],
    citySelIndex: '',
    districtName: [],
    districtCode: [],
    districtSelIndex: '',
    show: 'none',
    addrressValue: '请选择地址',
    nameValue: '',
    phoneValue: '',
    detailValue: '',
    isElect: 0,
    addAddressAPI: '/api/user/add_address',

    // 地图拖拽
    province_name: '',
    city_name: '',
    area_name: '',
    detailValue: '',
    info: '',

    tag:'家'
  },
  //获取名字
  nameBlur: function (e) {
    var that = this;
    this.setData({
      nameValue: e.detail.value
    });
  },
  //获取电话
  phoneBlur: function (e) {
    // if (e.detail.value.length < 11){
    //   wx.showToast({
    //     title: '少于11位电话',
    //     icon: '',
    //     image: '',
    //     duration: 3000,
    //     mask: true,
    //     success: function(res) {},
    //     fail: function(res) {},
    //     complete: function(res) {},
    //   })
    //   return false;
    // } 
    // if (e.detail.value.length > 11){
    //   wx.showToast({
    //     title: '超出11位电话',
    //     icon: '',
    //     image: '',
    //     duration: 3000,
    //     mask: true,
    //     success: function(res) {},
    //     fail: function(res) {},
    //     complete: function(res) {},
    //   })
    //   return false;
    // }
    this.setData({
      phoneValue: e.detail.value
    });
  },
  //取消地域选择
  cancel: function () {
    var that = this;
    this.setData({
      show: 'none',
      addrressValue: ''
    });
  },
  //确定地域选择
  determine: function () {
    var that = this;
    this.setData({
      show: 'none',
      addrressValue: that.data.provinceName[p] + that.data.cityName[c] + that.data.districtName[d],
      provinceSelIndex: that.data.provinceCode[p],
      citySelIndex: that.data.cityCode[c],
      districtSelIndex: that.data.districtCode[d]
    });
  },
    //所在地址触发
    //   isAddressFocus: function () {
    //     console.log('aa');
    //     this.setData({
    //       show: 'block'
    //     });
    //   },

    //所在地址触发
    isAddressFocus: function () {
        var that = this;
        wx.chooseLocation({
            success: function (res) {
                console.log("地址", res.address)

                // 传经纬回去，获取详细信息
                wx.request({
                    url: 'https://apis.map.qq.com/ws/geocoder/v1/?location=' + `${res.latitude},${res.longitude}&key=75FBZ-CV33K-XNIJC-AL66E-CUINE-NNFR5`,
                    success(res) {
                        var data = res.data.result.address_component;
                        var datadetail = res.data.result.formatted_addresses.recommend;
                        that.setData({
                            addrressValue: data.province + data.city + data.district,
                            province_name: data.province,
                            city_name: data.city,
                            area_name: data.district,
                        })
                        that.setData({
                            info: datadetail,
                            detailValue: datadetail,
                        })
                        console.log('province_name', that.data.province_name)
                    }
                })
            },
            fail: function (err) {
                console.log(err)
            },
        });
    },

  // 选择器触发
  bindChange: function (e) {
    var that = this;
    p = e.detail.value[0];
    c = e.detail.value[1];
    d = e.detail.value[2];
    that.setAreaData(p, c, d, that.data.List, that.data.provinceCode);
  },
  //判断省
  setAreaData: function (p, c, List, provinceCode) {
    var that = this;
    var cityName = [];
    var cityCode = [];

    // 判断市
    var a = that.data.provinceCode[p];
    for (var i = 0; i < that.data.List.data.data.length; i++) {
      if (that.data.List.data.data[i].upid == a) {
        cityName.push(that.data.List.data.data[i].name);
        cityCode.push(that.data.List.data.data[i].id);
      };
    }
    that.setData({
      cityName: cityName,
      cityCode: cityCode
    });

    //判断区，街道
    var districtName = [];
    var b = that.data.cityCode[c];
    for (var i = 0; i < that.data.List.data.data.length; i++) {
      if (that.data.List.data.data[i].upid == b) {
        districtName.push(that.data.List.data.data[i].name);
      };
    }
    that.setData({
      districtName: districtName,
    });

  },
  //获取详细地址
  detailBlur: function (e) {
    this.setData({
      detailValue: e.detail.value
    });
  },
  //是否默认
  isElect: function (e) {
    var that = this;
    if (e.detail.value) {
      that.setData({
        isElect: 1
      });

    } else {
      that.setData({
        isElect: 0
      });
    }

  },
    // 设置为常用地址
    clickOften: function (e) {
        console.log("eeeee", e);
        this.setData({
            tag: e.currentTarget.dataset.item
        });
    },

  //保存
  save: function () {
    var that = this;
    if (that.data.nameValue == '') {
      wx.showModal({
        title: '提示',
        content: '名字不能为空',
      })
      return false;
    } else if (that.data.phoneValue == '') {
      wx.showModal({
        title: '提示',
        content: '手机号码不能为空',
      })
      return false;
    } else if (that.data.detailValue == '') {
      wx.showModal({
        title: '提示',
        content: '详细地址不能为空',
      })
      return false;
    } else if (that.data.phoneValue.length !=11){
      wx.showModal({
        title: '提示',
        content: '手机号码不正确',
      })
      return false;
    }else{
      wx.request({
        url: getApp().globalData.url + that.data.addAddressAPI,
        data: {
          login_token: wx.getStorageSync("loginToken"),
          default: that.data.isElect,
          xm: that.data.nameValue,
          tel: that.data.phoneValue,
          // province_id: that.data.provinceSelIndex,
          // city_id: that.data.citySelIndex,
          // area_id: that.data.districtSelIndex,
          // info: that.data.detailValue
          province_name: that.data.province_name,
          city_name: that.data.city_name,
          area_name: that.data.area_name,
          info: that.data.detailValue,
          tag: that.data.tag,
        },
        header: { 'content-type': 'application/json' },
        method: 'POST',
        dataType: 'json',
        success: function (res) {
          if (res.data.state == 1) {
            wx.showToast({
              title: res.data.msg,
            })
            wx.navigateBack({
              delta: 2
            });
          } else {
            wx.showModal({
              title: '提示',
              content: res.data.msg,
            })
          }
        },
        fail: function (res) {

        },
        complete: function (res) { },
      })
    }
   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight
        });
      },
    });

    //获取地域 
    wx.request({
      url: getApp().globalData.url + that.data.addressAPI,
      data: {},
      header: { 'content-type': 'application/json' },
      method: 'POST',
      dataType: 'json',
      success: function (res) {
        that.setData({
          List: res
        });
        //获取省份
        var provinceName = [];
        var provinceCode = [];
        var cityName = [];
        var cityCode = [];

        for (var i = 0; i < that.data.List.data.data.length; i++) {
          if (that.data.List.data.data[i].level == 1) {
            provinceName.push(that.data.List.data.data[i].name);
            provinceCode.push(that.data.List.data.data[i].id);
          };
          if (that.data.List.data.data[i].upid == 1) {
            cityName.push(that.data.List.data.data[i].name);
            cityCode.push(that.data.List.data.data[i].id);
          };

        };

        that.setData({
          provinceName: provinceName,
          provinceCode: provinceCode,
          cityName: cityName,
          cityCode: cityCode
        });

        var districtName = [];
        var districtCode = [];
        for (var j = 0; j < that.data.List.data.data.length; j++) {
          if (that.data.List.data.data[j].upid == that.data.cityCode[0]) {
            districtName.push(that.data.List.data.data[j].name);
            districtCode.push(that.data.List.data.data[j].id);
          }
        }
        that.setData({
          districtName: districtName,
          districtCode: districtCode
        });


      },
      fail: function (res) { },
      complete: function (res) { },
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

  }
})