//index.js
//获取应用实例
const app = getApp();

Page({

  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {

    var roomrtc = require("../index/roomrtc.min.js");
    var remoteVideos = {};

    roomrtc.initMediaSource().then(stream => {
      var streamUrl = roomrtc.getStreamAsUrl(stream);
      // Show local stream in some video/canvas element.
    }).catch(err => {
      console.error('Failed to get local stream', err);
    });

    roomrtc.on('videoAdded', function(pc, stream) {
      var pid = pc.id;
      var streamUrl = roomrtc.getStreamAsUrl(stream);
      console.log('Ohh, we have a new participant', pid);
      remoteVideos[pid] = streamUrl;
      // Show remote stream in some video/canvas element.
    });

    roomrtc.on('videoRemoved', function(pc) {
      var pid = pc.id;
      var url = remoteVideos[pid];
      roomrtc.revokeObjectURL(url);
      console.log('Ohh, a participant has gone', pid);
      delete remoteVideos[url];
    });

    var room = 'demo';
    roomrtc.on('readyToCall', function (id) {
      roomrtc.joinRoom(room)
          .then(roomData => {
            console.log('joinRoom ok: ', roomData);
            return roomData.clients;
          })
          .catch(err => {
            console.error('joinRoom error: ', err);
          });
    });


    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo;
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e);
    app.globalData.userInfo = e.detail.userInfo;
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }

});
