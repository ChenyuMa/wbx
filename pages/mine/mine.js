// pages/mine/mine.js
const qiniuUploader = require("../../utils/qiniuUploader.js");
var uptoken;
// 请求我的页面数据
var mine_request = function (API, that) {
  wx.request({
    url: getApp().globalData.url + API,
    data: {
      login_token: wx.getStorageSync('loginToken')
    },
    header: { 'content-type': 'application/json' },
    method: 'POST',
    dataType: 'json',
    responseType: 'text',
    success: function (res) {
      if (res.data.state == 0) {
        if (res.data.msg == "请先登陆") {
          wx.showToast({
            title: '请先登录!',
            icon:'none'
          })
          that.setData({ userLogin: true });
        }
        // else if (res.data.msg == "请先绑定手机") {
        //   wx.navigateTo({
        //     url: '../bindPhone/bindPhone',
        //   }) 
        // }
      } else {
      wx.setStorageSync('is_salesman', res.data.data.is_salesman);
        that.setData({
          user_list: res.data.data,
          isLogin: true
        });
      }
    },
    fail: function (res) { },
    complete: function (res) {
      if (res.data.state == 0) {
        if (res.data.msg == "请先登陆") {
          wx.showToast({
            title: '请登录',
            icon: 'none'
          })
        }
      }else{
        if (res.data.data.mobile == '') {
          that.setData({ isBindPhone: true });
        }
      }
    },
  })
};

var countdown = 60;
var settime = function (that) {
  if (countdown == 0) {
    that.setData({
      is_show: true,
      last_time: 60
    })
    countdown = 60;
    return;
  } else {
    that.setData({
      is_show: false,
      last_time: countdown
    })
    countdown--;
  }
  setTimeout(function () {
    settime(that)
  }, 1000)
};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    x: 0,
    y: 0,
    windowWidth: 0,
    windowHeights: 0,
    // 屏幕高度
    windowHeight: '',
    imgUrls: getApp().globalData.imgUrls,
    // 头部背景图片
    top_backgroundImg: 'background.png',
    kingImg: 'king.png',
    // 我的页面数据
    userAPI: '/api/user/get_user_info',
    user_list: [{
      dfh_count: 0,
      dfk_count: 0,
      dsh_count: 0,
      dtk_count: 0
    }],
    // 待付款图标
    dfkImg: 'person_payment@2x.png',
    dfhImg: 'person_receiving@2x.png',
    dshImg: 'person_cargo@2x.png',
    dtkImg: 'person_refund@2x.png',
    my_orderImg: 'complete@2x.png',
    // 我的收藏图标
    collection_list: [
      { img: 'folder.png', title: '我的收藏' },
      { img: 'balance.png', title: '积分兑换' },
      { img: 'person_pay@2x.png', title: '智能付款' },
      { img: 'scan@2x.png', title: '扫码点餐' },
    ],
    // 我的预订图标
    reservation_list: [
      { img: 'reserve.png', title: '我的预订' },
      { img: 'message.png', title: '消息中心' },
      { img: 'address.png', title: '地址管理' },
      { img: 'account.png', title: '账户中心' },
    ],
    reservation_lists: [
      { img: 'help@2x.png', title: '帮助中心' },
      { img: 'is_take_number@2x.png', title: '叫号取餐' },
      { img: 'invitation@2x.png', title: '开店邀请' },
    ],
    isLogin: false,
    userLogin: false,
    // 是否绑定手机
    isBindPhone: false,
    mobile: '',
    is_show: true,
    last_time: 60,
    codeAPI: '/api/user/sendsms',
    verificationTxt: '',
    imageURL: '',
    faceURL:''
  },

  // 我的微米
  mine_micron: function () {
    var that = this;
    if (wx.getStorageSync('loginToken') == '') {
      // wx.navigateTo({
      //   url: '../login/login',
      // })
      that.setData({ userLogin: true });
    } else {
      wx.navigateTo({
        url: './micron/micron?micron=' + this.data.user_list.money / 100.00,
      })
    }
  },
  // 发现首页跳转
  home() {
    wx.reLaunch({
      url: '../home/home',
    })
  },
  // 跳转订单页面
  shopOrder() {
    wx.reLaunch({
      url: './shopOrder/shopOrder',
    })
  },
  // 跳转我的页面
  mine() {
    wx.reLaunch({
      url: './mine/mine',
    })
  },
  // 我的积分
  mine_integral: function () {
    var that = this;
    if (wx.getStorageSync('loginToken') == '') {
      // wx.navigateTo({
      //   url: '../login/login',
      // })
      that.setData({ userLogin: true });
    } else {
      wx.navigateTo({
        url: './integral/integral?mineIntegral=' + this.data.user_list.integral,
      })
    }
  },

  // 买菜订单跳转
  waitPayDind: function () {
    var that = this;
    if (wx.getStorageSync('loginToken') == '') {
      // wx.navigateTo({
      //   url: '../login/login',
      // })
      that.setData({ userLogin: true });
    } else {
      wx.navigateTo({
        url: './shopOrder/shopOrder',
      })
    }

  },

  // 我的收藏
  mine_collection: function (e) {
    var that = this;
    if (wx.getStorageSync('loginToken') == '') {
      // wx.navigateTo({
      //   url: '../login/login',
      // })
      that.setData({ userLogin: true });
    } else {
      switch (e.currentTarget.dataset.index) {
        case 0:
          wx.navigateTo({
            url: './collection/collection',
          })
          break;
        case 1:
          wx.navigateTo({
            url: './exchange/exchange',
          })
          break;
        case 2:
          wx.navigateTo({
            url: './smartPay/smartPay',
          })
          break;
        case 3:
          wx.navigateTo({
            url: './sweepOrder/sweepOrder',
          })
          break;
      }
    }
  },

  // 我的预订点击
  mine_reservation: function (e) {
    var that = this;
    if (wx.getStorageSync('loginToken') == '') {
      // wx.navigateTo({
      //   url: '../login/login',
      // })
      that.setData({ userLogin: true });
    } else {
      switch (e.currentTarget.dataset.index) {
        case 0:
          wx.navigateTo({
            url: './reserve/reserve',
          })
          break;
        case 1:
          wx.navigateTo({
            url: './messageCenter/messageCenter',
          })
          break;
        case 2:
          wx.navigateTo({
            url: './address/address',
          })
          break;
        case 3:
          wx.navigateTo({
            url: './account/account?user_list=' + JSON.stringify(that.data.user_list),
          })
          break;
        default:
      }
    }

  },

  // 帮助中心
  mine_reservations: function (e) {
    var that = this;
    if (wx.getStorageSync('loginToken') == '') {
      // wx.navigateTo({
      //   url: '../login/login',
      // })
      that.setData({ userLogin: true });
    } else {
      switch (e.currentTarget.dataset.index) {
        case 0:
          wx.navigateTo({
            url: './helpCenter/helpCenter',
          })
          break;
        case 1:
          wx.navigateTo({
            url: './sweepOrder/sweepOrder?isTakeNumber=1',
          })
          break;
        case 2:
          wx.navigateTo({
            url: './invitation/invitation?userid=' + that.data.user_list.user_id,
          })
          break;
        default:
      }
    }

  },

  // 登录
  login: function () {
    var that = this;
    if (wx.getStorageSync('loginToken') == '') {
      // wx.navigateTo({
      //   url: '../login/login',
      // })
      that.setData({ userLogin: true });
    } else {
      mine_request(this.data.userAPI, that);
    }
  },

  // 登录请求数据
  login_request: function () {
    var that = this;
    that.setData({
      isLogin: true,
      user_list: []
    });
    mine_request(this.data.userAPI, that);
  },

  // 退出
  exit: function () {
    var that = this;
    this.setData({
      user_list: [],
      isLogin: false
    });
    wx.setStorageSync('loginToken', '')
    getApp().globalData.userLogin = false;
  },

  //点击购物车
  clickCar: function () {
    wx.navigateTo({
      url: '../shopCart/shopCart',
    })
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
          windowHeight: res.windowHeight,
          windowHeights: res.windowHeight - 10,
          windowWidth: res.windowWidth - 5,
          x: res.windowWidth - 5,
          y: res.windowHeight - 100
        });
      },
    })

    // if (wx.getStorageSync('loginToken') != '') {
    //   this.setData({
    //     isLogin: true
    //   });
    // };
    // if (wx.getStorageSync('loginToken') == ''){
    //   that.setData({ userLogin: true });
    // }
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
    var that = this;
    // 用户数据
    // if (wx.getStorageSync('loginToken') == ''){
    // }else{
    mine_request(this.data.userAPI, that);
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
  // 取消登录授权
  cancel: function () {
    this.setData({ userLogin: false })
  },

  // 确认登录授权
  confirm: function () {
    var that = this;
    this.setData({ userLogin: false })
    setTimeout(function () {
      // getApp().onLaunch();
      that.login();
    }, 4000);
  },

  // 相机
  camera: function () {
    var that = this;
    var key = Math.random().toString(36).substr(2);
    if (!getApp().globalData.userLogin) {
      wx.navigateTo({
        url: '../login/login',
      })
    } else {
      that.getToken();
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['camera', 'album'],
        success: function (res) {
          var filePath = res.tempFilePaths[0];
          // 交给七牛上传
          qiniuUploader.upload(filePath, (res) => {
            that.setData({
              imageURL: res.imageURL,
            });

            wx.request({
              url: getApp().globalData.url + '/api/user/update_face',
              data: {
                login_token: wx.getStorageSync('loginToken'),
                face: 'http://imgs.wbx365.com/' + res.key
              },
              header: {},
              method: 'POST',
              dataType: 'json',
              responseType: 'text',
              success: function (res) {
                if (res.data.state == 0) {
                  wx.showToast({
                    title: res.data.msg,
                  })
                } else {
                  wx.showToast({
                    title: res.data.msg,
                  })
                  that.cancelUpIcon();
                  wx.request({
                    url: getApp().globalData.url + '/api/user/get_user_info',
                    data: { login_token: wx.getStorageSync('loginToken') },
                    header: {},
                    method: 'POST',
                    dataType: 'json',
                    responseType: 'text',
                    success: function (res) {
                      that.setData({ user_list: res.data.data });
                      // var pages = getCurrentPages();
                      // var currPage = pages[pages.length - 1];
                      that.login_request();
                    },
                    fail: function (res) { },
                    complete: function (res) { },
                  })
                }
              },
              fail: function (res) { },
              complete: function (res) { },
            })
          }, (error) => {
          }, {
              region: 'ECN',
              domain: 'bzkdlkaf.bkt.clouddn.com',
              key: key,
              uptoken: uptoken,
              uploadURL: 'https://upload.qiniup.com'
            }, (res) => {

            });
        },
        fail: function (res) { },
        complete: function (res) { },
      })
    }

  },
  // 相册
  photo: function () {
    var that = this;
    var key = Math.random().toString(36).substr(2);
    if (!getApp().globalData.userLogin) {
      wx.navigateTo({
        url: '../login/login',
      })
    } else {
      that.getToken();
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album'],
        success: function (res) {
          var filePath = res.tempFilePaths[0];
          // 交给七牛上传
          qiniuUploader.upload(filePath, (res) => {
            that.setData({
              imageURL: res.imageURL,
            });
            wx.request({
              url: getApp().globalData.url + '/api/user/update_face',
              data: {
                login_token: wx.getStorageSync('loginToken'),
                face: 'http://imgs.wbx365.com/' + res.key
              },
              header: {},
              method: 'POST',
              dataType: 'json',
              responseType: 'text',
              success: function (res) {
                if (res.data.state == 0) {
                  wx.showToast({
                    title: res.data.msg,
                  })
                } else {
                  wx.showToast({
                    title: res.data.msg,
                  })
                  that.cancelUpIcon();
                  wx.request({
                    url: getApp().globalData.url + '/api/user/get_user_info',
                    data: { login_token: wx.getStorageSync('loginToken') },
                    header: {},
                    method: 'POST',
                    dataType: 'json',
                    responseType: 'text',
                    success: function (res) {
                      that.setData({ user_list: res.data.data });
                      // var pages = getCurrentPages();
                      // var currPage = pages[pages.length - 1];
                      that.login_request();
                    },
                    fail: function (res) { },
                    complete: function (res) { },
                  })
                }
              },
              fail: function (res) { },
              complete: function (res) { },
            })
          }, (error) => {
          }, {
              region: 'ECN',
              domain: 'bzkdlkaf.bkt.clouddn.com',
              key: key,
              uptoken: uptoken,
              uploadURL: 'https://upload.qiniup.com'
            }, (res) => {

            });

        },
        fail: function (res) { },
        complete: function (res) { },
      });
    }

  },

  // 取消
  cancelUpIcon: function () {
    this.setData({
      isUpIcon: false
    });
  },

  // 获取token
  getToken: function () {
    wx.request({
      url: 'https://app.wbx365.com/api/user/qiniu_token',
      data: '',
      header: {},
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        uptoken = res.data.data.uptoken;
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  // 取消
  clickCancel: function () {
    this.setData({
      userLogin: false
    });
  },

  // 允许获取权限
  clickAllow: function (e) {
    var that = this;
    if (e.detail.errMsg == "getUserInfo:ok") {
      var nickName = e.detail.userInfo.nickName;
      var face = e.detail.userInfo.avatarUrl;
      var encryptedData = e.detail.encryptedData;
      var iv = e.detail.iv;
      that.setData({
        faceURL:face
      })
      wx.login({
        success: function (res) {
          var code = res.code;
          getApp().globalData.code = res.code;
          if (code) {
            that.getOpenID(code, nickName, face, encryptedData, iv);
            mine_request(that.data.userAPI, that);
          }
        },
        fail: function (res) { },
        complete: function (res) { },
      });

    }
    // getApp().wxGetSetting();

    if (wx.getStorageSync('loginToken') == '') {
      // wx.navigateTo({
      //   url: '../login/login',
      // })
      that.setData({ userLogin: true });
    } else {
      mine_request(this.data.userAPI, that);
    }

  },

  // 获取openID
  getOpenID: function (code, nickName, face, encryptedData, iv) {
    var that = this;
    wx.request({
      url: getApp().globalData.url + '/api/user/get_wx_info',
      data: {
        code: code
      },
      header: { 'content-type': 'application/json' },
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
      complete: function (res) {
      },
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
      header: { 'content-type': 'application/json' },
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
      complete: function (res) {
      },
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
          wx.setStorageSync('hx_username', res.data.data.hx_username);
          wx.setStorageSync('hx_password', res.data.data.hx_password);
        }
      },
      fail: function (res) { },
      complete: function (res) {
        that.setData({
          userLogin: false
        });
        getApp().globalData.userLogin = true;
        // setTimeout(function () {
        mine_request(that.data.userAPI, that);
        // }, 1500);
      },
    })
  },

  // 手机输入框改变
  phone_change: function (e) {
    var that = this;
    this.setData({
      phoneTxt: e.detail.value
    });
  },
  // 获取验证码
  getCode: function () {
    var that = this;
    if (this.data.phoneTxt == '') {
      return false;
    }
    wx.request({
      url: getApp().globalData.url + that.data.codeAPI,
      data: {
        mobile: that.data.phoneTxt
      },
      header: { 'content-type': 'application/json' },
      method: 'POST',
      dataType: 'json',
      success: function (res) {
        if (res.data.state == 0) {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
          })
        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })
    // 将获取验证码按钮隐藏60s，60s后再次显示
    that.setData({
      is_show: !that.data.is_show  //false
    })
    if (countdown == 60) {
      settime(that);
    }
  },
  // 验证码
  verification_change: function (e) {
    this.setData({
      verificationTxt: e.detail.value
    });
  },

  // 确认绑定
  bind_phone: function () {
    var that = this;
    // var passwordTxt = md5.hexMD5(that.data.passwordTxt);
    wx.request({
      url: getApp().globalData.url + '/api/user/wx_bind_mobile',
      data: {
        open_id: wx.getStorageSync('openID'),
        union_id: wx.getStorageSync('unionID'),
        nickname: wx.getStorageSync('nickName'),
        face: wx.getStorageSync('face'),
        app_type: 'wx',
        version: '2.0',
        registration_id: '123456',
        mobile: that.data.phoneTxt,
        code: that.data.verificationTxt,
        // password: ''
      },
      header: { 'content-type': 'application/json' },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        if (res.data.state == 0) {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
          })
        } else {
          wx.setStorageSync('loginToken', res.data.data.login_token);
          wx.setStorageSync('userLogin', true);
          getApp().globalData.userLogin = true;
          mine_request(that.data.userAPI, that);
          wx.showToast({
            title: res.data.msg,
          })
          that.setData({ isBindPhone: false });
          // wx.navigateBack({
          //   delta: 1
          // });
        }
      },
      fail: function (res) {
        wx.showToast({
          title: res.data.msg,
        })
      },
      complete: function (res) {
      },
    })
  },

  // 下次完善
  closeBindPhone: function () {
    var that = this;
    this.setData({ isBindPhone: false });
  },
})