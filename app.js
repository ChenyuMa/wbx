//app.js
require('./utils/strophe.js')
var WebIM = require('./utils/WebIM.js').default;
App({
  onLaunch: function (options) {
    var that = this;
    console.log('全局加载:',options);
    let q = decodeURIComponent(options.query.q);
    // 环信登录
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);
    WebIM.conn.listen({
      onOpened: function (message) {
        WebIM.conn.setPresence()
      },
      onPresence: function (message) {
        switch (message.type) {
          case "unsubscribe":
            pages[0].moveFriend(message);
            break;
          case "subscribe":
            if (message.status === '[resp:true]') {
              return
            } else {
              pages[0].handleFriendMsg(message)
            }
            break;
          case "joinChatRoomSuccess":
            wx.showToast({
              title: "JoinChatRoomSuccess",
            });
            break;
          case "memberJoinChatRoomSuccess":
            // console.log('memberMessage: ', message);
            wx.showToast({
              title: "memberJoinChatRoomSuccess",
            });
            break;
          case "memberLeaveChatRoomSuccess":
            // console.log("LeaveChatRoom");
            wx.showToast({
              title: "leaveChatRoomSuccess",
            });
            break;
        }
      },
      onRoster: function (message) {
        // console.log('onRoster');
        var pages = getCurrentPages()
        if (pages[0]) {
          pages[0].onShow()
        }
      },

      onVideoMessage: function (message) {
        // console.log('onVideoMessage: ', message);
        var page = that.getRoomPage()
        if (message) {
          if (page) {
            page.receiveVideo(message, 'video')
          } else {
            var chatMsg = that.globalData.chatMsg || []
            var time = WebIM.time()
            var msgData = {
              info: {
                from: message.from,
                to: message.to
              },
              username: message.from,
              yourname: message.from,
              msg: {
                type: 'video',
                data: message.url
              },
              style: '',
              time: time,
              mid: 'video' + message.id
            }
            msgData.style = ''
            chatMsg = wx.getStorageSync(msgData.yourname + message.to) || []
            chatMsg.push(msgData);
            wx.setStorage({
              key: msgData.yourname + message.to,
              data: chatMsg,
              success: function () {
                // console.log('success')
              }
            })
          }
        }
      },

      onAudioMessage: function (message) {
        // console.log('onAudioMessage', message)
        var page = that.getRoomPage()
        if (message) {
          if (page) {
            page.receiveMsg(message, 'audio')
          } else {
            var chatMsg = that.globalData.chatMsg || []
            var value = WebIM.parseEmoji(message.data.replace(/\n/mg, ''))
            var time = WebIM.time()
            var msgData = {
              info: {
                from: message.from,
                to: message.to
              },
              username: message.from,
              yourname: message.from,
              msg: {
                type: 'audio',
                data: value
              },
              style: '',
              time: time,
              mid: 'audio' + message.id
            }
            // console.log("Audio msgData: ", msgData);
            chatMsg = wx.getStorageSync(msgData.yourname + message.to) || []
            chatMsg.push(msgData)
            wx.setStorage({
              key: msgData.yourname + message.to,
              data: chatMsg,
              success: function () {
                // console.log('success')
              }
            })
          }
        }
      },

      onLocationMessage: function (message) {
        // console.log("onLocationMessage: ", message);
      },

      onTextMessage: function (message) {
        // console.log('onTextMessage');
        var page = that.getRoomPage();
        if (message) {
          if (page) {
            page.receiveMsg(message, 'txt')
          } else {
            var chatMsg = that.globalData.chatMsg || []
            var value = WebIM.parseEmoji(message.data.replace(/\n/mg, ''))
            var time = WebIM.time()
            // console.log('message:', message);
            var msgData = {
              info: {
                from: message.from,
                to: message.to
              },
              username: message.from,
              yourname: message.from,
              msg: {
                type: 'txt',
                data: value
              },
              style: '',
              time: time,
              mid: 'txt' + message.id
            }
            // console.log('msgData:',msgData);
            chatMsg = wx.getStorageSync(msgData.yourname + message.to) || []
            // console.log('chatMsg:', chatMsg);
            chatMsg.push(msgData)
            wx.setStorage({
              key: msgData.yourname + message.to,
              data: chatMsg,
              success: function () {
                // console.log('success')
              }
            })
          }
        }
      },

      onEmojiMessage: function (message) {
        // console.log('onEmojiMessage',message)
        var page = that.getRoomPage()
        //console.log(pages)
        if (message) {
          if (page) {
            page.receiveMsg(message, 'emoji')
          } else {
            var chatMsg = that.globalData.chatMsg || []
            var time = WebIM.time()
            var msgData = {
              info: {
                from: message.from,
                to: message.to
              },
              username: message.from,
              yourname: message.from,
              msg: {
                type: 'emoji',
                data: message.data
              },
              style: '',
              time: time,
              mid: 'emoji' + message.id
            }
            msgData.style = ''
            chatMsg = wx.getStorageSync(msgData.yourname + message.to) || []
            chatMsg.push(msgData)
            //console.log(chatMsg)
            wx.setStorage({
              key: msgData.yourname + message.to,
              data: chatMsg,
              success: function () {
                // console.log('success')
              }
            })
          }
        }
      },

      onPictureMessage: function (message) {
        // console.log('onPictureMessage',message);
        var page = that.getRoomPage()
        if (message) {
          if (page) {
            //console.log("wdawdawdawdqwd")
            page.receiveImage(message, 'img')
          } else {
            var chatMsg = that.globalData.chatMsg || []
            var time = WebIM.time()
            var msgData = {
              info: {
                from: message.from,
                to: message.to
              },
              username: message.from,
              yourname: message.from,
              msg: {
                type: 'img',
                data: message.url
              },
              style: '',
              time: time,
              mid: 'img' + message.id
            }
            msgData.style = ''
            chatMsg = wx.getStorageSync(msgData.yourname + message.to) || []
            chatMsg.push(msgData)
            wx.setStorage({
              key: msgData.yourname + message.to,
              data: chatMsg,
              success: function () {
                // console.log('success')
              }
            })
          }
        }
      },

      // 各种异常
      onError: function (error) {
        // 16: server-side close the websocket connection
        if (error.type == WebIM.statusCode.WEBIM_CONNCTION_DISCONNECTED) {
          if (WebIM.conn.autoReconnectNumTotal < WebIM.conn.autoReconnectNumMax) {
            return;
          }
          wx.showToast({
            title: 'server-side close the websocket connection',
            duration: 1000
          });
          wx.redirectTo({
            url: '../login/login'
          });
          return;
        }

        // 8: offline by multi login
        if (error.type == WebIM.statusCode.WEBIM_CONNCTION_SERVER_ERROR) {
          wx.showToast({
            title: 'offline by multi login',
            duration: 1000
          })
          wx.redirectTo({
            url: '../login/login'
          })
          return;
        }
      },
    });
    // if (wx.getStorageSync('hx_username') != ''){
    // that.hxloign(wx.getStorageSync('hx_username'), wx.getStorageSync('hx_password'));
    // }
    that.wxGetSetting();
  },
  // 登录环信
  hxloign: function (user, pwd) {
    var options = {
      apiUrl: WebIM.config.apiURL,
      user: user,
      pwd: pwd,
      grant_type: 'password',
      appKey: WebIM.config.appkey //应用key
    }
    WebIM.conn.open(options)
  },
  getRoomPage: function () {
    return this.getPage("pages/home/shopDetails/message/message") //聊天界面
    // return this.getPage("pages/mine/messageCenter/messageCenter") //聊天界面
  },
  getPage: function (pageName) {
    var pages = getCurrentPages()
    return pages.find(function (page) {
      return page.__route__ == pageName
    })
  },
  // 微信登录
  wxGetSetting: function () {
    var that = this;
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {
          that.wxLogin();
          that.globalData.userLogin = true;
        } else {
          // that.wxLogin();
        }
      }
    })
  },
  // 获取code
  wxLogin: function () {
    var that = this;
    wx.login({
      success: function (res) {
        var code = res.code;
        that.globalData.code = res.code;
        // console.log('code:',code);
        if (code) {
          that.wxGetUserInfo(code);
        }
      },
      fail: function (res) { },
      complete: function (res) {
      },
    })
  },
  // 获取用户信息
  wxGetUserInfo: function (code) {
    var that = this;
    wx.getUserInfo({
      withCredentials: true,
      lang: 'zh_CN',
      success: function (res) {
        var nickName = res.userInfo.nickName;
        var face = res.userInfo.avatarUrl;
        var encryptedData = res.encryptedData;
        var iv = res.iv;
        that.getOpenID(code, nickName, face, encryptedData, iv);
      },
      fail: function (res) { },
      complete: function (res) {},
    })
  },
  // 获取openID
  getOpenID: function (code, nickName, face, encryptedData, iv) {
    var that = this;
    wx.request({
      url: that.globalData.url + '/api/user/get_wx_info',
      data: {
        code: code
      },
      header: { 'content-type': 'application/json' },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        console.log('获取openID', res);
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
      url: that.globalData.url + '/api/user/get_unionid',
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
        console.log('获取getUnionid', res);
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
    });
    wx.request({
      url: that.globalData.url + '/api/user/wx_login_noopsychepay',
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
        console.log('userLogin:', res);
        // console.log('unionID', unionID);
        if (res.data.state == 0) {
          // wx.navigateTo({
          //   url: '../bindPhone/bindPhone?openID=' + openID + "&unionID=" + unionID + "&nickName=" + nickName + "&face=" + face,
          // })
          if (res.data.msg == "请先绑定手机") {
            wx.navigateTo({
              url: '../../bindPhone/bindPhone',
            })
          }
        } else {
          wx.setStorageSync('loginToken', res.data.data.login_token);
          that.globalData.userLogin = true;
          that.hxloign(res.data.data.hx_username, res.data.data.hx_password);
          wx.setStorageSync('hx_username', res.data.data.hx_username);
          wx.setStorageSync('hx_password', res.data.data.hx_username);
        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  globalData: {
    userInfo: null,
    imgUrls: 'http://www.wbx365.com/static/default/wap/image/xiaochengxu/',
    code: '',
    userLogin: wx.getStorageSync('userLogin'),
    nickName: '',
    face: '',
    encryptedData: '',
    iv: '',
    openID: '',
    unionID: '',
    // url: 'https://app.vrzff.com',
    url: 'https://app.wbx365.com',
    chatMsg: []
  }
})