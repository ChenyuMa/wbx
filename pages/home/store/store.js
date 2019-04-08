// pages/Store/Store.js
var util = require('../../../utils/util');
var wbxLogin = function (that, nickName, face, encryptedData, iv){
  wx.login({
    success: function (res) {
      var code = res.code;
      getApp().globalData.code = res.code;
      if (code) {
        that.getOpenID(code, nickName, face, encryptedData, iv);
      }
    },
    fail: function (res) { },
    complete: function (res) {},
  });
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userLogin: false,
    windowHeight: '',
    imgUrls: getApp().globalData.imgUrls,
    shopID: '',
    gradeid: '',
    // shopID: 1757,
    // shopID: 1366,
    // shopID: 1259,
    // shopID: 724, //见福
    // shopID: 1371, //小熊
    // shopID: 1395, //鸡公煲
    // shopID: 586,//老猪高
    // shopID: 1443,//果然鲜
    // shopID: 1442,//大海捞真
    // gradeid: 19,
    // gradeid: 20,
    // gradeid: 15,
    // 菜市场详情
    vegetableAPI: '/api/buygreens/get_goods',
    // 实体店详情
    physicalAPI: '/api/shop/get_goods',
    // 店铺信息
    shopDetailList: [],
    // 是否查看店铺信息
    isCheck: false,
    // 商家评价
    evaluationAPI: '/api/userorder/list_assess',
    page: 1,
    num: 10,
    evaluationList: [],
    isComments: false,
    // 商家发现
    shopFoundAPI: '/api/discovery/list_discover',
    shopFoundList: [],
    isFound: false,
    // 优惠券
    isCoupons: false,
    couponAPI: '/api/coupon/receive_coupon',
    // 红包
    isEnvelope: false,
    envelopeAPI: '/api/redpacket/get_red_packet',
    envelopeNum: 0,
    envelopeID: 0,
    isFocus: false,
    isFocuss: false,
    focusAPI: '/api/redpacket/receive_red_packet',
    // 是否发放红包
    issueEnvelopeAPI: '/api/redpacket/check_shop_has_red_packect',
    issueEnvelope: false,
    // 没红包关注
    followShopAPI: '/api/index/follow_shop',
    nickName: '',
    face: '',
    encryptedData: '',
    iv: '',
    // 足迹
    pages: 1,
    isFootprint: false,
    footprintList: [],
    clearFootprint: false,
    // 是否叫号
    is_take_number: '',
    isSalesman: '', // 判断销量
    isAuthorize:false,
    isNotice:false,
    isTimes:false
  },
  //权限弹窗
  bindgetuserinfo:function(e){
    var that = this;
    if (e.detail.errMsg == "getUserInfo:ok") {
      var nickName = e.detail.userInfo.nickName;
      var face = e.detail.userInfo.avatarUrl;
      var encryptedData = e.detail.encryptedData;
      var iv = e.detail.iv;
      wbxLogin(that, nickName, face, encryptedData, iv);
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    let q = decodeURIComponent(options.q);
    if (q != 'undefined') {
      var list = q.split('/');
      that.setData({
        shopID: list[6],
        gradeid: list[8],
        is_take_number: options.is_take_number == '' ? '' : options.is_take_number
      });
    } else {
      that.setData({
        shopID: options.shopID,
        gradeid: options.gradeid,
        is_take_number: options.is_take_number == '' ? '' : options.is_take_number
      });
    }
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight,
          isSalesman: wx.getStorageSync('is_salesman')
        });
      },
    });

    // 判断用户是否登录
    if (wx.getStorageSync('loginToken') == '') {
      that.setData({
        userLogin: true
      });
    } 
    else {
      that.getEnvelopeNum();
    }
    // 要求小程序返回分享目标信息
    wx.showShareMenu({
      withShareTicket: true
    });

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    if (that.data.gradeid == 15) {
      this.getShopInfo(that.data.vegetableAPI, that.data.shopID);
    } else {
      this.getShopInfo(that.data.physicalAPI, that.data.shopID);
    }
    // 店铺评价
    this.evaluation(that.data.evaluationAPI, that.data.shopID);
    // 店铺发现
    this.shopFound(that.data.shopFoundAPI, that.data.shopID);

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    // if (wx.getStorageSync('loginToken') != '') {
    //   that.getEnvelopeNum();
    // }
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
    var that = this;
    // 获取足迹
    if (wx.getStorageSync('loginToken') == '') {
      wx.navigateTo({
        url: '../../login/login',
      })
      that.setData({
        userLogin: true
      });
    } else {
      that.setData({
        isFootprint: false,
        footprintList: [],
        pages: 1
      });
      this.getFootprint();
    }
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
    var that = this;
    return {
      title: that.data.gradeid == 15 ? that.data.shopDetailList.shop_detail.shop_name : that.data.shopDetailList.detail.shop_name,
      path: '/pages/home/store/store?shopID=' + that.data.shopID + "&gradeid=" + that.data.gradeid,
      success: function (res) {
        //可以获取群组信息
        wx.getShareInfo({
          shareTicket: shareTickets[0],
          success: function (res) { }
        })
      },
      fail: function (res) { }
    }
  },

  /**
   * 店铺信息
   */
  getShopInfo: function (API, shopID) {
    var that = this;
    wx.request({
      url: getApp().globalData.url + API,
      data: {
        shop_id: shopID,
        login_token: wx.getStorageSync('loginToken'),
        is_take_number: that.data.is_take_number
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        if (res.data.state == 0) {
          if (res.data.msg == "取餐号功能已关闭") {
            wx.showModal({
              title: '提示',
              content: '取餐号功能已关闭',
            })
          } else {
            wx.showToast({
              title: res.data.msg,
            })
          }
        } else {
          var list = res.data.data;
          for (var i = 0; i < list.coupon.list.length; i++) {
            list.coupon.list[i].end_time = that.timestampToTime(list.coupon.list[i].end_time);
          }
          that.setData({
            shopDetailList: list
          })
          var notice = that.data.gradeid == 15 ? that.data.shopDetailList.shop_detail.notice : that.data.shopDetailList.detail.notice
          var times = that.data.gradeid == 15 ? that.data.shopDetailList.shop_detail.business_time : that.data.shopDetailList.detail.business_time
          if(notice==null || notice==''){
            that.setData({
              isNotice:true
            })
          }else{
            that.setData({
              isNotice: false
            })
          }

          if(times==null || times==''){
            that.setData({
              isTimes: true
            })
          }else{
            that.setData({
              isTimes: false
            })
          }
        }
      },
      fail: function (res) { },
      complete: function (res) {
        if (that.data.gradeid == 15) {
          if (res.data.data.shop_detail.is_favorites == 1) {
            that.setData({
              isFocuss: true
            });
          }
        } else {
          if (res.data.data.detail.is_favorites == 1) {
            that.setData({
              isFocuss: true
            });
          }
        }
      },
    })
  },

  /**
   * 店铺评价
   */
  evaluation: function (API) {
    var that = this;
    wx.request({
      url: getApp().globalData.url + API,
      data: {
        shop_id: that.data.shopID,
        page: that.data.page,
        num: 50
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        if (res.data.state == 0) {
          wx.showToast({
            title: res.data.msg,
          })
        } else if (res.data.msg == "暂无数据") {

        } else {
          var list = res.data.data;
          var evaluationList = that.data.evaluationList;
          for (var i = 0; i < list.length; i++) {
            list[i].create_time = that.timestampToTime(list[i].create_time);
            evaluationList.push(list[i])
          }
          that.setData({
            evaluationList: evaluationList,
            page: that.data.page += 1
          });
        }
      },
      fail: function (res) { },
      complete: function (res) {},
    })
  },

  /**
   * 转换时间
   */
  timestampToTime: function (timestamp) {
    var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = date.getDate() + ' ';
    var h = date.getHours() + ':';
    var m = date.getMinutes() + ':';
    var s = date.getSeconds();
    return Y + M + D + h + m + s;
  },

  /**
   * 点击关注
   */
  clickFocus: function () {
    var that = this;
    // 店铺是否发放红吧
    if (wx.getStorageSync('loginToken') == '') {
      that.setData({
        userLogin: true
      })
    } else {
      // if (that.data.envelopeNum == 0) {
        that.clickFollowShop();
      // } else {
        // that.setData({
        //   isEnvelope: true,
        //   isFocus: true
        // });
        // that.clickEnvelope();
      // }
    }
  },

  /**
   * 进店逛逛
   */
  clickIntoShop: function () {
    var that = this;
    wx.navigateTo({
      url: '../shopDetails/shopDetails?shopID=' + that.data.shopID + "&gradeid=" + that.data.gradeid + '&is_take_number=' + that.data.is_take_number,
    })
  },

  /**
   * 在线点餐
   */
  clickOnline: function () {
    var that = this;
    if (wx.getStorageSync('loginToken') == '') {
      wx.navigateTo({
        url: '../../login/login',
      })
      that.setData({
        userLogin: true
      });
    } else {
      wx.navigateTo({
        url: '../shopDetails/shopDetails?shopID=' + that.data.shopID + "&gradeid=" + that.data.gradeid + '&is_take_number=' + that.data.is_take_number,
      })
    }
  },

  /**
   * 到点点餐
   */
  clickOrdering: function () {
    var that = this;
    if (wx.getStorageSync('loginToken') == '') {
      wx.navigateTo({
        url: '../../login/login',
      })
      that.setData({
        userLogin: true
      });
    } else {
      wx.scanCode({
        onlyFromCamera: false,
        scanType: ['qrCode'],
        success: function (res) {
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
              url: '../sweepOrder/sweepOrder?shopID=' + shopID + "&seat=" + JSON.stringify(seat),
            })
          }
        },
        fail: function (res) {
          wx.showToast({
            title: '扫码失败',
          })
        },
        complete: function (res) { },
      })
    }
  },

  /**
   * 远程预订
   */
  clickBooking: function () {
    var that = this;
    if (wx.getStorageSync('loginToken') == '') {
      wx.navigateTo({
        url: '../../login/login',
      })
      that.setData({
        userLogin: true
      });
    } else {
      if (that.data.gradeid == 20) {
        if (that.data.shopDetailList.is_subscribe == 0) {
          wx.showToast({
            title: '商家未开启预订',
          })
        } else {
          wx.navigateTo({
            url: '../shopDetails/setTable/setTable?subscribe=' + that.data.shopDetailList.detail.subscribe_money + "&shopID=" + this.data.shopID,
          })
        }
      } else {
        wx.showToast({
          title: '商家不接受预订',
        })
      }
    }
  },

  /**
   * 推荐好友
   */
  clickRecommend: function () {
    var that = this;
    this.onShareAppMessage();
  },

  /**
   * 领优惠卷
   */
  clickCoupons: function () {
    var that = this;
    if (wx.getStorageSync('loginToken') == '') {
      that.setData({
        userLogin: true,
      });
    } else {
      this.setData({
        isCoupons: !that.data.isCoupons,
        isCheck: !that.data.isCheck
      });
    }
  },

  /**
   * 领取优惠券
   */
  clickReceive: function (e) {
    var that = this;
    wx.request({
      url: getApp().globalData.url + that.data.couponAPI,
      data: {
        login_token: wx.getStorageSync('loginToken'),
        coupon_id: e.currentTarget.dataset.coupon_id
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        if (res.data.state == 0) {
          // if (res.data.msg == '请先绑定手机') {
          //   wx.navigateTo({
          //     url: '../../bindPhone/bindPhone',
          //   })
          // } else {
          wx.showToast({
            title: res.data.msg,
          })
          // }
        } else {
          wx.showToast({
            title: '领取成功',
          });
          var list = that.data.shopDetailList;
          for (var i = 0; i < list.coupon.list.length; i++) {
            if (e.currentTarget.dataset.coupon_id == that.data.shopDetailList.coupon.list[i].coupon_id) {
              list.coupon.list[i].is_receive = 1
            }
          };
          that.setData({
            shopDetailList: list
          });
        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  /**
   * 个人中心
   */
  clickPersonal: function () {
    var that=this;
    if (wx.getStorageSync('loginToken') == '') {
      that.setData({
        userLogin: true
      });
    } else {
      wx.switchTab({
        url: '../../mine/mine',
      })
    }

  },

  /**
   * 查看店铺信息
   */
  clickShopInfo: function () {
    var that = this;
    this.setData({
      isCheck: !that.data.isCheck
    });
  },

  /**
   * 联系商家电话
   */
  callPhone: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  /**
   * 查看评论
   */
  clickComments: function () {
    var that = this;
    if (that.data.isComments) {
      // that.evaluation(that.data.evaluationAPI);
      that.setData({
        isComments: false
      });
    } else {
      that.setData({
        isComments: true
      });
    }
  },

  /**
   * 店铺发现
   */
  shopFound: function (API, shopID) {
    var that = this;
    wx.request({
      url: getApp().globalData.url + API,
      data: {
        // city_name: wx.getStorageSync('cityName'),
        shop_id: shopID,
        lat: wx.getStorageSync('latitude'),
        lng: wx.getStorageSync('longitude')
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        if (res.data.state == 0) {
          wx.showToast({
            title: res.data.msg
          })
        } else if (res.data.msg == "暂无数据") {
        } else {
          var list = res.data.data;
          var shopFoundList = that.data.shopFoundList;
          for (var i = 0; i < list.length; i++) {
            var distance = that.getDistance(wx.getStorageSync('latitude'), wx.getStorageSync('longitude'), parseFloat(list[i].lat), parseFloat(list[i].lng));
            list[i].distance = distance;
            shopFoundList.push(list[i]);
          }

          that.setData({
            shopFoundList: shopFoundList
          });
        }
      },
      fail: function (res) { },
      complete: function (res) {

      },
    })
  },

  /**
   * 判断店铺距离
   */
  getDistance: function (lat1, lng1, lat2, lng2) {
    var that = this;
    var f = that.getRad((lat1 + lat2) / 2);
    var g = that.getRad((lat1 - lat2) / 2);
    var l = that.getRad((lng1 - lng2) / 2);
    var sg = Math.sin(g);
    var sl = Math.sin(l);
    var sf = Math.sin(f);
    var s, c, w, r, d, h1, h2;
    var a = 6378137.0; //The Radius of eath in meter.   
    var fl = 1 / 298.257;
    sg = sg * sg;
    sl = sl * sl;
    sf = sf * sf;
    s = sg * (1 - sl) + (1 - sf) * sl;
    c = (1 - sg) * (1 - sl) + sf * sl;
    w = Math.atan(Math.sqrt(s / c));
    r = Math.sqrt(s * c) / w;
    d = 2 * w * a;
    h1 = (3 * r - 1) / 2 / c;
    h2 = (3 * r + 1) / 2 / s;
    s = d * (1 + fl * (h1 * sf * (1 - sg) - h2 * (1 - sf) * sg));
    s = s / 1000;
    s = s.toFixed(2); //指定小数点后的位数。   
    return s;
  },

  /**
   * 经纬度换算
   */
  getRad: function (d) {
    var PI = Math.PI;
    return d * PI / 180.0;
  },

  /**
   * 查看店铺发现页面展开
   */

  // clickShopFound: function () {
  //   var that = this;
  //   if (that.data.isFound) {
  //     that.setData({
  //       isFound: false
  //     });
  //   } else {
  //     // that.shopFound(that.data.shopFoundAPI, that.data.shopID);
  //     that.setData({
  //       isFound: true
  //     });
  //   }
  // },

  clickShopFoundTxt: function () {
    var that =this;
    if (that.data.shopFoundList.length==0){
      wx.showToast({
        title: '商家未发布',
      })
    }else{
      getApp().globalData.foundShopID = that.data.shopID; // 设置全局变量 解决switchTab需要带参数的问题
      wx.switchTab({
        url: '/pages/found/found'
      })
    }
  },


  /**
   * 查看店铺图片
   */
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id,
      urls: e.currentTarget.dataset.src,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  /**
   * 取消
   */
  clickCancel: function () {
    this.setData({
      userLogin: false
    });
  },

  /**
   * 允许获取权限
   */
  clickAllow: function (e) {
    var that = this;
    var nickName = e.detail.userInfo.nickName;
    var face = e.detail.userInfo.avatarUrl;
    var encryptedData = e.detail.encryptedData;
    var iv = e.detail.iv;
    wx.login({
      success: function (res) {
        var code = res.code;
        getApp().globalData.code = res.code;
        if (code) {
          that.getOpenID(code, nickName, face, encryptedData, iv);
        }
      },
      fail: function (res) { },
      complete: function (res) {
        // that.setData({
        //   nickName: e.detail.userInfo.nickName,
        //   face: e.detail.userInfo.avatarUrl,
        //   encryptedData: e.detail.encryptedData,
        //   iv: e.detail.iv
        // });
        // 判断是否有红包
        // setTimeout(function () { that.getEnvelopeNum();},1000);
      },
    });
    // getApp().wxGetSetting();
    // getApp().globalData.userLogin = true;
    // setTimeout(function () { that.getEnvelopeNum(that.data.envelopeAPI, that.data.shopID)}, 1500);
  },

  /**
   * 店铺是否发放红包
   */
  issueEnvelope: function () {
    var that = this;
    wx.request({
      url: getApp().globalData.url + that.data.issueEnvelopeAPI,
      data: {
        shop_id: that.data.shopID
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        if (res.data.state == 1) {
          that.setData({
            isEnvelope: true
          });
          // that.getEnvelopeNum()
        }else{

        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  /**
   * 获取红包数额
   */
  getEnvelopeNum: function () {
    var that = this;
    wx.request({
      url: getApp().globalData.url + that.data.envelopeAPI,
      data: {
        login_token: wx.getStorageSync('loginToken'),
        shop_id: that.data.shopID
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        if (res.data.state == 0) {
          // if (res.data.msg == "请先绑定手机") {
          //   wx.navigateTo({
          //     url: '../../bindPhone/bindPhone',
          //   })
          // }
          that.issueEnvelope();
        } else if (res.data.msg == "红包已经领取完了哦。") {
          that.setData({
            isEnvelope: false
          });
        } else if (res.data.msg == "您在该店还有未使用的红包") {
          that.setData({
            isEnvelope: false
          });
        } else if (res.data.msg == "您在该店使用红包的订单还未完成") {
          that.setData({
            isEnvelope: false
          });
        }

        // else if (res.data.data.receive_money == 'undefined') { } 
        else {
          that.setData({
            envelopeNum: res.data.data.receive_money,
            envelopeID: res.data.data.user_red_packet_id,
            isEnvelope: true,
          });
        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  /**
   * 点击关注领红包
   */
  clickEnvelope: function () {
    var that = this;
    if (wx.getStorageSync('loginToken') == '') {

    } else {
      wx.request({
        url: getApp().globalData.url + that.data.focusAPI,
        data: {
          login_token: wx.getStorageSync('loginToken'),
          user_red_packet_id: that.data.envelopeID,
          shop_id: that.data.shopID
        },
        header: {
          'content-type': 'application/json'
        },
        method: 'POST',
        dataType: 'json',
        responseType: 'text',
        success: function (res) {
          if (res.data.state == 0) {
            // if (res.data.msg == "请先绑定手机") {
            //   wx.navigateTo({
            //     url: '../../bindPhone/bindPhone',
            //   })
            // } else 
            if (res.data.state == "请先登陆") {
              that.setData({
                userLogin: true
              });
            }else{
              wx.showModal({
                title: '提示',
                content: res.data.msg,
              })
            }
          } else {
            that.setData({
              isFocus: true,
              isFocuss: true
            });
            setTimeout(function () {
              that.clickenvelopeClose()
            }, 3000);
          }
        },
        fail: function (res) { },
        complete: function (res) { },
      })
    }

  },

  /**
   * 点击关闭红包
   */
  clickenvelopeClose: function () {
    var that = this;
    this.setData({
      isEnvelope: false
    });
  },

  /**
   * 无发放红吧关注
   */
  clickFollowShop: function () {
    var that = this;
    wx.request({
      url: getApp().globalData.url + that.data.followShopAPI,
      data: {
        login_token: wx.getStorageSync('loginToken'),
        shop_id: that.data.shopID
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        if (res.data.state == 0) {
          // if (res.data.msg == '请先绑定手机') {
          //   wx.navigateTo({
          //     url: '../../bindPhone/bindPhone',
          //   })
          // }
        } else {
          that.setData({
            isFocuss: true
          });
        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })

  },

  // 获取openID
  getOpenID: function (code, nickName, face, encryptedData, iv) {
    var that = this;
    wx.request({
      url: getApp().globalData.url + '/api/user/get_wx_info',
      data: {
        code: code
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        var sessionKey = res.data.data.session_key;
        if (sessionKey) {
          that.getUnionid(nickName, face, sessionKey, encryptedData, iv)
        } else {
          var openID = res.data.data.open_id;
          var unionID = res.data.data.union_id;
          that.userLogin(openID, unionID, nickName, face);
          wx.setStorageSync('openID', openID)
          wx.setStorageSync('unionID', unionID)
          wx.setStorageSync('nickName', nickName)
          wx.setStorageSync('face', face)
        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  // 获取unionid
  getUnionid: function (nickName, face, sessionKey, encryptedData, iv) {
    var that = this;
    wx.request({
      url: getApp().globalData.url + '/api/user/get_unionid',
      data: {
        session_key: sessionKey,
        encryptedData: encryptedData,
        iv: iv
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        var openID = res.data.openId;
        var unionID = res.data.unionId;
        that.userLogin(openID, unionID, nickName, face)
        wx.setStorageSync('openID', openID)
        wx.setStorageSync('unionID', unionID)
        wx.setStorageSync('nickName', nickName)
        wx.setStorageSync('face', face)
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  //登录
  userLogin: function (openID, unionID, nickName, face) {
    var that = this;
    var model, system, version;
    wx.getSystemInfo({
      success: function (res) {
        model = res.model;
        system = res.system;
        version = res.version;
      },
    })
    wx.request({
      url: getApp().globalData.url + '/api/user/wx_login_noopsychepay',
      data: {
        open_id: openID,
        union_id: unionID,
        nickname: nickName,
        face: face,
        app_type: 'weixin',
        phone_type: model + '/' + system,
        version: version,
        registration_id: '123456'
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        if (res.data.state == 0) {
          // wx.navigateTo({
          //   url: '../bindPhone/bindPhone?openID=' + openID + "&unionID=" + unionID + "&nickName=" + nickName + "&face=" + face,
          // })
          // if (res.data.msg == "请先绑定手机") {
          //   wx.navigateTo({
          //     url: '../../bindPhone/bindPhone',
          //   })
          // }
        } else {
          wx.setStorageSync('loginToken', res.data.data.login_token);
          getApp().globalData.userLogin = true;
          that.setData({
            userLogin: false
          });
          wx.setStorageSync('hx_username', res.data.data.hx_username);
          wx.setStorageSync('hx_password', res.data.data.hx_password);
        }
      },
      fail: function (res) { },
      complete: function (res) {
        that.getEnvelopeNum();
        // 登陆成功在请求一次信息
        if (that.data.gradeid == 15) {
          that.getShopInfo(that.data.vegetableAPI, that.data.shopID);
        } else {
          that.getShopInfo(that.data.physicalAPI, that.data.shopID);
        }

      },
    })
  },

  /**
   * 获取历史足迹
   */
  getFootprint: function () {
    var that = this;
    wx.request({
      url: getApp().globalData.url + '/api/index/list_user_visit_shop',
      data: {
        login_token: wx.getStorageSync('loginToken'),
        page: that.data.pages,
        num: 20
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        if (res.data.state == 0) {
          // if (res.data.msg == "请先绑定手机"){
          //   that.setData({isFootprint: false});
          // }
        } else if (res.data.msg == "暂无数据") {
          that.setData({

          });
        } else {
          that.setData({
            isFootprint: true,
            footprintList: res.data.data,
            pages: that.data.pages + 1
          });
          // 数据成功后，停止下拉刷新
          wx.stopPullDownRefresh();
        }
      },
      fail: function (res) {
        // 数据成功后，停止下拉刷新
        wx.stopPullDownRefresh();
      },
      complete: function (res) { },
    })
  },

  // 滚动监听
  onPageScroll: function (e) {
    var that = this;
    if (e.scrollTop >= 100) {
      this.setData({
        isFootprint: false,
        footprintList: [],
        pages: 1
      });
    }
  },

  // 长按开始足迹
  touchStart: function (e) {
    var that = this;
    this.setData({
      timeStart: e.timeStamp
    });
  },
  // 长按结束足迹
  touchEnd: function (e) {
    this.setData({
      timeEnd: e.timeStamp
    });
  },
  // 长按显示删除
  longTap: function (e) {
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
  clickFootprint: function (e) {
    var that = this;
    wx.navigateTo({
      url: '../store/store?shopID=' + e.currentTarget.dataset.item.shop_id + "&gradeid=" + e.currentTarget.dataset.item.grade_id,
    })
  },
  // 删除足迹
  clearFootprint: function (e) {
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
      success: function (res) {
        if (res.data.state == 0) {

        } else if (res.data.state == 1) {
          that.setData({
            footprintList: res.data.data,
            pages: 1
          });
          that.getFootprint();
        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  }
})