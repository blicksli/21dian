//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: '连接服务器中',
    hidden:true,
    openid:{},
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    pipei:'开始匹配',
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    var that = this;
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        //console.log(res.code);
        wx.request({
          url: '',
          data: {
            code: res.code,
          },
          header: {
            'content-type': 'application/json'
          },
          success: res => {
            //console.log(res);
            that.data.openid = res.data.openid;
            app.globalData.openid = res.data.openid;
            wx.getUserInfo({
              success: res => {
                wx.setStorage({
                  key: 'userinfo',
                  data: res.userInfo,
                })
                that.setData({
                  userinfo: res.userInfo,
                })
                wx.connectSocket({
                  url: 'wss://li.lnmpa.top',
                });
                //console.log(res.userInfo);
              }
            })
          }
        })
      }
    }) 
    wx.onSocketOpen(function (res) {
      //连接服务器成功，进入游戏页面
      //console.log(1);
      //登陆
      //console.log(that.data.openid);
      var send_obj={
        type:'login',
        openid:that.data.openid,
        userinfo:that.data.userinfo
      }
     
      var userinfo_str = JSON.stringify(send_obj);
      wx.sendSocketMessage({
        data: userinfo_str,
      })
    });
    wx.onSocketMessage(function(res){
      var data = JSON.parse(res.data)
      console.log(data);
      switch (data.type){
        //匹配成功
        case 'group':
          //计入缓存
          wx.setStorage({
            key: 'group_id',
            data: data.message,
          })
          wx.redirectTo({
            url: '../game/index',
          })
          break;
        //心跳回应
        case 'pong':
          wx.sendSocketMessage({
            data: '{"type":"pong"}',
          })
          break;
        //登陆成功
        case 'login':
          that.setData({
            motto: '点击匹配按钮开始匹配对手',
            hidden: false,
          });
          break;
      }
    })
  },
  usermatch_click:function(e){
    console.log(1);
    var that = this;
    //wx.getStorage({
     // key: 'getnumber_user_openid',
     // success: function(res) {
    var send_obj = {
      type: 'match',
      openid: that.data.openid,
      userinfo: that.data.userinfo
    }

    var userinfo_str = JSON.stringify(send_obj);
    wx.sendSocketMessage({
      data: userinfo_str,
    });
    that.setData({
      motto: '匹配中等待玩家进入',
      pipei: '匹配中',
    });
      //},
   // })
  }
})
