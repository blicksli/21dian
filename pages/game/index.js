//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: '点击上图匹配开始游戏',
    userInfo: [],
    openid:{},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    img_src1:'',
    name1:'',
    img_src2:'',
    name2:'',
    sumnumber:'',
    tips:'点击准备开始游戏',
    hidden:true,
    group_id:'',
    other_ready:'未准备',
    user_ready:'准备',
    ready_hidden: false,
  },
  //事件处理函数
  onLoad: function () {
    var that=this;
    wx.getStorage({
      key: 'group_id',
      success: res=> {
        that.setData({
          openid: app.globalData.openid,
          userInfo: app.globalData.userInfo,
          group_id:res.data
        });
        var send_obj = {
          type: 'group',
          command: 'join',
          openid: that.data.openid,
          group_id: that.data.group_id,
        }
        var userinfo_str = JSON.stringify(send_obj);
        wx.sendSocketMessage({
          data: userinfo_str,
        })
      },
    })
    /*wx.connectSocket({
      url: 'wss://li.lnmpa.top',
    });
    wx.onSocketOpen(function (res) {
      //连接服务器成功，进入游戏页面
      console.log(1);
      //进入房间
      wx.getStorage({
        key: 'group_id',
        success: res=> {
          var send_obj = {
            type: 'group',
            command:'join',
            openid: that.data.openid,
            group_id:res.data,
          }
          var userinfo_str = JSON.stringify(send_obj);
          wx.sendSocketMessage({
            data: userinfo_str,
          })
        },
      })
    });*/
    wx.onSocketMessage(function (res) {
      var data = JSON.parse(res.data);
      //var that=this;
      console.log(data);
      switch (data.type) {
        //获取房间内消息
        case 'join':
          console.log(data[0]);
          console.log(that.data.userInfo);
          if(data[0].nickName==that.data.userInfo.nickName){
            that.setData({
              img_src1: data[0].avatarUrl,
              name1: data[0].nickName,
              img_src2: data[1].avatarUrl,
              name2: data[1].nickName,
            })
          }else{
            that.setData({
              img_src1: data[1].avatarUrl,
              name1: data[1].nickName,
              img_src2: data[0].avatarUrl,
              name2: data[0].nickName,
            })
          }
          break;
        //游戏
        case 'isready':
        //左边
          if(data.message==that.data.openid){
            that.setData({
              user_ready: '已准备',
              motto:'您已准备，等待对手准备',
            })
          }else{
            that.setData({
              other_ready: '已准备',
            })
          }
          break;
        case 'game':
          //更新游戏目标
          that.setData({
            sumnumber:data.message,
            ready_hidden:true,
          });
          //判断是否为当前回合
          if (data.player==that.data.openid){
            that.setData({
              motto: '轮到你了，快选择要加的数字',
              hidden: false,
            });
          }else{
            that.setData({
              motto: '等待对手操作',
              hidden: true,
            });
          }
          break;
        //心跳回应
        case 'pong':
          wx.sendSocketMessage({
            data: '{"type":"pong"}',
          })
          break;
        //游戏结束
        case 'over':
          var over_show = '游戏结束，获胜者为'+data.message;
          that.setData({
            sumnumber:21,
            tips: over_show,
            hidden:true,
          })
          break;
      }
    });
  },
  //用户准备
  userready_click:function(e){
    console.log(1);
    var that = this;
    var send_obj = {
      type: 'group',
      command: 'ready',
      openid: that.data.openid,
      group_id: that.data.group_id,
    }
    var userinfo_str = JSON.stringify(send_obj);
    wx.sendSocketMessage({
      data: userinfo_str,
    })
  },
  userchoice_one:function(e){
    console.log(1);
    var that = this;
    var send_obj = {
      type: 'group',
      command: 'number',
      case:1,
      openid: that.data.openid,
      group_id: that.data.group_id,
    }
    var userinfo_str = JSON.stringify(send_obj);
    wx.sendSocketMessage({
      data: userinfo_str,
    })
  },
  userchoice_two: function (e) {
    console.log(1);
    var that = this;
    var send_obj = {
      type: 'group',
      command: 'number',
      case: 2,
      openid: that.data.openid,
      group_id: that.data.group_id,
    }
    var userinfo_str = JSON.stringify(send_obj);
    wx.sendSocketMessage({
      data: userinfo_str,
    })
  },
  userchoice_three: function (e) {
    console.log(1);
    var that = this;
    var send_obj = {
      type: 'group',
      command: 'number',
      case: 3,
      openid: that.data.openid,
      group_id: that.data.group_id,
    }
    var userinfo_str = JSON.stringify(send_obj);
    wx.sendSocketMessage({
      data: userinfo_str,
    })
  }
})
