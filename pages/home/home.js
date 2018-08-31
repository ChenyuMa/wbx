// pages/home/home.js
// 引入城市定位
var amapFile = require('../../libs/amap-wx.js');
var myAmapFun = new amapFile.AMapWX({
  key: '9484593ebb010c0179c49ac2ade339ce'
});
Page({

  /**
   * 页面的初始数据
   */
  data: {
    load: false,
    animationData: '',
    // 屏幕高度
    windowHeight: '',
    pages: 1,
    num: 10,
    // 图标地址
    imgUrl: getApp().globalData.imgUrls,
    // 头部透明
    top_transparent: 0,
    // 定位地址数据
    location_address_list: '',
    locate_address: '',
    cityName: '',
    // 城市id
    cityIDAPI: '/api/index/list_city',
    cityID: '',
    scrollY: true,
    // 轮播图
    indicatorDots: true,
    autoplay: true,
    interval: 2000,
    circular: true,
    indicatorColor: 'rgba(255, 255, 255,0.3)',
    indicatorActiveColor: 'white',
    mask: 'mask.png',
    //导航
    navList: [{
        'icon': 'supermarket1@2x.png',
        'txt': '超市便利'
      },
      {
        'icon': 'store1@2x.png',
        'txt': '附近买菜'
      },
      {
        'icon': 'food1@2x.png',
        'txt': '美食街'
      },
      {
        'icon': 'tenants1@2x.png',
        'txt': '积分兑换'
      }
    ],
    // 质量保证
    quality: 'quality.png',
    //新人享好礼
    newPeople: 'retail.png',
    // 秒杀
    seckilBackgroundImg: 'liangfan_unique_bg@2x.png',
    timeLimitImg: 'seckill1@2x.png',
    scrollX: true,
    //精选好菜 
    goodFootBackgroundImg: 'goodFoot1@2x.png',
    goodFoot_img_title: 'choice@2x.png',
    goodFoot_background_img: 'bgone@2x.png',
    timeLimit: 'timeLimit.png',
    // 附近好菜
    near_img_title: 'vegetable@2x.png',
    is_promotion_icon: 'store_sales@2x.png',
    // 首页数据
    home_API: '/api/index/index',
    home_list: [],
    // 首页店铺数据
    home_shop_API: '/api/index/list_shop',
    // home_shop_API: '/api/index/list_shop_small_routine',
    home_shop_list: [],
    beyond_list: [],
    // 页面触底
    is_bottom: false,
    is_bottom_over: false,
    // 防止数据同时请求
    hasmore: true,
    // 是否修改地址
    is_modify_locate: false,
    userLogin: false,
    isFirstShow: true,
    userOpenSetting: false,
    isFootprint: false,
    is_top_over: false,
    loadingNum: 0,
    latitude: 0,
    longitude: 0,
    homeMessageNum: 0,
    homeMessageAPI: '/api/user/get_no_read_system_message',
    // isDistance: false,
    // DistanceNum:0,
    // 足迹
    // pages: 1,
    isFootprint: false,
    footprintList: [],
    clearFootprint: false
  },

  // 位置定位跳转
  location: function() {
    var that = this;
    wx.navigateTo({
      url: '../location/location?location_address_list=' + JSON.stringify(that.data.location_address_list),
    })
  },

  // 点击搜索框跳转
  searchClick: function() {
    var that = this;
    wx.navigateTo({
      url: './search/search?cityName=' + that.data.cityName
    })
  },

  // 点击扫码
  sweepClick: function() {
    var that = this;
    wx.scanCode({
      onlyFromCamera: false,
      scanType: ['qrCode'],
      success: function(res) {
        console.log('二维码：', res);
        var list = res.result.split('/');
        var shopID, seat;
        for (var i = 0; i < list.length; i++) {
          if (list[i] == 'shop_id') {
            shopID = list[i + 1];
          } else if (list[i] == 'seat') {
            seat = list[i + 1];
          }
        }
        if (shopID != null && seat != null) {
          wx.navigateTo({
            url: './sweepOrder/sweepOrder?shopID=' + shopID + "&seat=" + JSON.stringify(seat),
          })
        } else {
          wx.showToast({
            title: '二维码不正确',
          })
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  // 点击信息
  messageClick: function() {
    wx.navigateTo({
      url: './topMessage/topMessage',
    })
  },

  // 导航跳转
  clickNav: function(e) {
    switch (e.currentTarget.dataset.index) {
      case 0:
        wx.navigateTo({
          url: '../near/near',
        })
        break;
      case 1:
        wx.navigateTo({
          url: '../shop/shop',
        })
        break;
      case 2:
        wx.navigateTo({
          url: '../food/food',
        })
        break;
      case 3:
        wx.navigateTo({
          url: '../mine/exchange/exchange',
        })
        break;
      default:
    }
  },

  // 秒杀跳转
  clickSeakill: function(e) {
    var that = this;
    wx.navigateTo({
      url: './shopDetails/shopDetails?shopID=' + e.currentTarget.dataset.id + "&gradeid=" + 15,
    })
  },

  // 精选好菜跳转
  goodFoot: function(e) {
    wx.navigateTo({
      url: './shopDetails/shopDetails?shopID=' + e.currentTarget.dataset.item.shop.shop_id + "&gradeid=" + e.currentTarget.dataset.item.shop.grade_id,
    })
  },

  // 上拉加载
  // scroll_to_lower: function() {
  //   var that = this;
  //   this.setData({
  //     is_bottom: true,
  //   });
  //   this.home_shop_list(this.data.home_shop_API, that.data.cityName,that.data.latitude, that.data.longitude,that.data.pages,that.data.num);
  // },

  // 下拉刷新
  // scroll_to_upper: function() {
  //   var that = this;
  //   this.setData({
  //     is_top: true,
  //     pages: 1,
  //     home_shop_list: [],
  //     beyond_list: []
  //   });
  //   this.getLocation()
  // },

  // 店铺跳转
  shopsJump: function(e) {
    wx.navigateTo({
      url: './shopDetails/shopDetails?shopID=' + e.currentTarget.id + "&gradeid=" + e.currentTarget.dataset.grade_id,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    this.getLocation();
    this.animation();
    // 获取屏幕高度
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          windowHeight: res.windowHeight
        });
      },
    })
    // 显示图标
    setTimeout(function() {
      that.setData({
        isFirstShow: false
      });
    }, 3000);

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var that = this;

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    if (this.data.is_modify_locate) {
      that.setData({
        home_shop_list: []
      });
      that.home_shop_list(this.data.home_shop_API, wx.getStorageSync('cityName'), wx.getStorageSync('latitude'), wx.getStorageSync('longitude'), that.data.pages, that.data.num);
    }
    if (this.data.userOpenSetting) {
      // 获取当前经纬度
      that.getLocation();
      // 获取首页数据
      // if (wx.getStorageSync('cityID')) {
      //   home_list(that.data.home_API, that);
      // }
      // this.setData({
      //   userOpenSetting: false
      // })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    var that = this;
    this.setData({
      is_modify_locate: false
    });
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
    var that = this;
    this.setData({
      isFootprint: true,
      pages: 1,
      home_shop_list: [],
      beyond_list: []
    });
    this.getLocation();
    this.getFootprint();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this;
    this.setData({
      is_bottom: true,
    });
    this.home_shop_list(this.data.home_shop_API, that.data.cityName, that.data.latitude, that.data.longitude, that.data.pages, that.data.num);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  // 获取用户是否授权
  getLocation: function() {
    var that = this;
    that.myAmapFun();
  },

  // 动画
  animation: function() {
    var that = this;
    var animation = wx.createAnimation({
      duration: 2000,
      timingFunction: 'ease',
    })
    this.animation = animation;
    animation.translate(0).step();
    this.setData({
      animationData: animation.export()
    })
    setTimeout(function() {
      animation.translate(250).step()
      this.setData({
        animationData: animation.export(),
      })
    }.bind(this), 1000);
    that.setData({
      userLogin: getApp().globalData.userLogin,
    });
  },

  // 获取定位
  myAmapFun: function() {
    var that = this;
    wx.getSetting({
      success: function(res) {
        myAmapFun.getRegeo({
          success: function(data) {
            that.home_shop_list(that.data.home_shop_API, data[0].regeocodeData.addressComponent.city.split('市')[0], data[0].latitude, data[0].longitude, that.data.pages, that.data.num);
            that.setData({
              locate_address: data[0].regeocodeData.pois[0].name,
              location_address_list: data[0],
              cityName: data[0].regeocodeData.addressComponent.city.split('市')[0],
              latitude: data[0].latitude,
              longitude: data[0].longitude
            });
            if (!that.data.isFootprint) {
              // that.animation();
            }
            // 缓存经纬度和城市名到本地
            wx.setStorageSync('latitude', data[0].latitude);
            wx.setStorageSync('longitude', data[0].longitude);
            wx.setStorageSync('cityName', data[0].regeocodeData.addressComponent.city.split('市')[0]);
          },
          fail: function(info) {},
          complete: function(res) {
            this.homeMessageNum(that.data.homeMessageAPI);
          }
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  // 首页店铺数据
  home_shop_list: function(API, cityName, lat, lng, pages, num) {
    var that = this;
    wx.request({
      url: getApp().globalData.url + API,
      data: {
        city_name: cityName,
        lat: lat,
        lng: lng,
        page: pages,
        num: num
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        console.log('获取首页数据：', res)
        if (res.data.state == 0) {
          wx.showToast({
            title: res.data.msg,
          })
        } else if (res.data.msg == '暂无数据') {
          that.setData({
            is_bottom: false,
            is_bottom_over: true
          });
          setTimeout(function() {
            that.setData({
              is_bottom_over: false
            });
          }, 1500);
        } else {
          var home_shop_list = that.data.home_shop_list;
          var beyond_list = that.data.beyond_list;
          var hasmore = that.data.hasmore;
          if (hasmore) {
            hasmore = false;
            for (var i = 0; i < res.data.data.length; i++) {
              if (res.data.data[i].is_exceed == 0) {
                home_shop_list.push(res.data.data[i])
              } else {
                beyond_list.push(res.data.data[i])
              }
            }
            that.setData({
              home_shop_list: home_shop_list,
              beyond_list: beyond_list,
              is_bottom: false,
              // is_top: false,
              hasmore: hasmore,
              pages: that.data.pages + 1,
              load: true
            });
            setTimeout(function() {
              that.setData({
                hasmore: true
              });
            }, 1000)
          }
        }
      },
      fail: function(res) {},
      complete: function(res) {
        if (that.data.beyond_list.length == 0 && that.data.home_shop_list.length == 0) {
          wx.showToast({
            title: '城市暂未开通',
          })
          that.setData({
            pages: 1
          });
          that.home_shop_list(that.data.home_shop_API, '厦门', 24.479664, 118.089204, 1, 10);
        }
        // 数据成功后，停止下拉刷新
        wx.stopPullDownRefresh();
      },
    })
  },
  // 取消
  clickCancel: function() {
    this.setData({
      userLogin: false
    });
  },
  // 允许获取权限
  clickAllow: function(e) {
    var that = this;
    // var nickName = e.detail.userInfo.nickName;
    // var face = e.detail.userInfo.avatarUrl;
    // var encryptedData = e.detail.encryptedData;
    // var iv = e.detail.iv;
    // wx.login({
    //   success: function(res) {
    //     var code = res.code;
    //     getApp().globalData.code = res.code;
    //     if (code){
    //       getApp().getOpenID(code, nickName, face);
    //     }
    //   },
    //   fail: function(res) {},
    //   complete: function(res) {},
    // });
    // getApp().wxGetSetting();
    // this.setData({
    //   userLogin: false
    // });
    // getApp().globalData.userLogin = true;
  },
  // 点击消息中心
  clickeMessage: function() {
    wx.navigateTo({
      url: '../mine/messageCenter/messageCenter',
    })
  },
  // 消息未读
  homeMessageNum: function(API) {
    wx.request({
      url: getApp().globalData.url + API,
      data: {
        login_token: wx.getStorageSync('longinToken')
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  /**
   * 获取历史足迹
   */
  getFootprint: function() {
    var that = this;
    wx.request({
      url: getApp().globalData.url + '/api/index/list_user_visit_shop',
      data: {
        login_token: wx.getStorageSync('loginToken'),
        page: 1,
        num: 20
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        console.log('获取足迹：', res);
        if (res.data.state == 0) {
          if (res.data.msg == "请先登陆"){
            that.setData({ isFootprint: false});
          }
        } else if (res.data.msg == "暂无数据") {

        } else {
          that.setData({
            isFootprint: true,
            clearFootprint: false,
            footprintList: res.data.data,
            // pages: that.data.pages + 1
          });
          // 数据成功后，停止下拉刷新
          wx.stopPullDownRefresh();
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  // 滚动监听
  onPageScroll: function(e) {
    var that = this;
    if (e.scrollTop >= 100) {
      this.setData({
        isFootprint: false,
        clearFootprint: false
      });
    }
  },
  // 长按开始足迹
  touchStart: function(e) {
    var that = this;
    console.log(e);
    this.setData({
      timeStart: e.timeStamp
    });
  },
  // 长按结束足迹
  touchEnd: function(e) {
    this.setData({
      timeEnd: e.timeStamp
    });
  },
  // 长按显示删除
  longTap: function(e) {
    var that = this;
    var touchTime = that.data.timeEnd - that.data.timeStart;
    if (touchTime > 1500) {
      that.setData({
        clearFootprint: true
      });
    } else {
      that.clickFootprint(e);
    }
  },
  // 点击足迹进入店铺
  clickFootprint: function(e) {
    var that = this;
    console.log(e);
    wx.navigateTo({
      url: './store/store?shopID=' + e.currentTarget.dataset.item.shop_id + "&gradeid=" + e.currentTarget.dataset.item.grade_id,
    })
  },
  // 删除足迹
  clearFootprint: function(e) {
    var that = this;
    wx.request({
      url: getApp().globalData.url + '/api/index/delete_user_visit_shop',
      data: {
        login_token: wx.getStorageSync('loginToken'),
        shop_id: e.currentTarget.dataset.shopid
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        if (res.data.state == 0) {

        } else if (res.data.state == 1) {
          that.setData({
            footprintList: res.data.data,
            pages: 1
          });
          that.getFootprint();
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  }
})