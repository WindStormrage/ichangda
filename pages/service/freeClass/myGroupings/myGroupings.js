var request = require('../../../../utils/request.js')
var requestByPost = require('../../../../utils/requestByPost.js')
var app = getApp()
var HOST_URL = app.getHostUrl()
Page({
  data: {
    inputValue: "",
    ncisHidden: true,
    setting: false,
    showModalStatus: false,
    groups: []
  },
  onLoad: function (options) {
    if (options.weekth) {
      var weekth = options.weekth;
      var that = this;
      this.setData({
        weekth: weekth
      })
    }

  },
  onShow: function () {
    var that = this;
    loadData(that, "select");
  },
  seek: function (event) {
    wx.navigateTo({
      url: '../seek/seek?weekth=' + this.data.weekth,
    })
  },
  groupChange: function (event) {
    this.setData({
      isAdd: false
    })
    var currentStatu = event.currentTarget.dataset.statu;
    if (currentStatu == 'ok') {

      var groupName = this.data.doGroup;
      console.log(groupName)
      console.log(this.data.newValue)
      var data = {
        oldName: groupName,
        newName: this.data.newValue
      }
      loadData(this, "update", data);
    }
    this.setData({
      doGroup: event.currentTarget.dataset.groupname
    })
    this.CPM(currentStatu);
  },

  unfoldGroup: function (event) {
    var groupName = event.currentTarget.dataset.groupname;
    var gLen = this.data.groups.length;
    var groups = this.data.groups;
    for (let i = 0; i < gLen; i++) {
      if (groups[i].groupName == groupName) {
        groups[i].isUnfold = !groups[i].isUnfold;
      }
    }
    this.setData({
      groups: groups,
    })
  },

  showClass: function (event) {
    var groupName = event.currentTarget.dataset.groupname;
    var groups = this.data.groups;
    var stuNos = [];
    for (let i = 0; i < groups.length; i++) {
      if (groups[i].groupName == groupName && groups[i].gMembers) {
        for (let j = 0; j < groups[i].gMembers.length; j++) {
          stuNos.push(groups[i].gMembers[j].memberJwcAccount)
        }
        break;
      }
    }
    console.log(stuNos);
    wx.navigateTo({
      url: '../class/class?stuNo=' + stuNos + '&weekth=' + this.data.weekth,
    })
  },

  groupRemove: function (event) {
    var that = this;
    var groupName = event.currentTarget.dataset.groupname;
    var gLen = this.data.groups.length;
    var groups = this.data.groups;
    for (var j = 0; j < gLen; j++) {
      if (groups[j].groupName == groupName) {
        groups.splice(j, 1);
        break;
      }
    }
    var data = {
      groupName: groupName
    }
    loadData(that, "delete", data);
  },
  setting: function (event) {
    this.setData({
      setting: !this.data.setting
    })
  },
  personDelete: function (event) {
    var that = this;
    var groupName = event.currentTarget.dataset.groupname;
    var memberJwcAccount = event.currentTarget.dataset.memberjwcaccount;
    var members = [];
    members.push({ "memberJwcAccount": memberJwcAccount })
    var data = {
      groupName: groupName,
      members: members
    }
    console.log(members)
    loadData(that, "delete", data);
  },
  addStu: function (event) {
    this.setData({
      isAdd: true
    })
    var currentStatu = event.currentTarget.dataset.statu;
    if (currentStatu == 'ok') {
      stuUpdata(this);
    }
    this.setData({
      doGroup: event.currentTarget.dataset.groupname
    })
    this.CPM(currentStatu);

  },
  CPM: function (currentStatu) {
    //收起键盘
    if (currentStatu == "close") {
      wx.hideKeyboard()
    }
    /* 动画部分 */
    // 第1步：创建动画实例 
    var animation = wx.createAnimation({
      duration: 200, //动画时长 
      timingFunction: "linear", //线性 
      delay: 0 //0则不延迟 
    })
    // 第2步：这个动画实例赋给当前的动画实例 
    this.animation = animation;

    // 第3步：执行第一组动画 
    animation.opacity(0).rotateX(-100).step();

    // 第4步：导出动画对象赋给数据对象储存 
    this.setData({
      animationData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画 
    setTimeout(function () {
      // 执行第二组动画 
      animation.opacity(1).rotateX(0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象 
      this.setData({
        animationData: animation
      })
      //关闭 
      if (currentStatu == "ok" || currentStatu == "close") {
        this.setData(
          {
            showModalStatus: false
          }
        );
      }
    }.bind(this), 200)
    // 显示 
    if (currentStatu == "open") {
      this.setData(
        {
          showModalStatus: true
        }
      );
    }
  },
  bindblur: function (e) {
    this.setData({
      newValue: e.detail.value
    })
  },
  bindinput: function (e) {
    this.setData({
      newValue: e.detail.value
    })
  },
  bindconfirm: function (e) {
    this.setData({
      newValue: e.detail.value
    })
  },
})

function stuUpdata(that) {
  var newValue = [];
  newValue.push({ 'memberJwcAccount': that.data.newValue });
  var data = {
    groupName: that.data.doGroup,
    members: newValue,
    openid: wx.getStorageSync('session'),
  }
  requestByPost.loadData(that, '/NoCourse/addMember', data, function (res) {
    wx.showToast({
      title: '添加成功'
    })
    setTimeout(function () {
      wx.hideToast()
    }, 1500)
    if (res.data) {
      console.log("res.data==>");
      console.log(res.data);
      that.setData({
        groups: res.data.groups,
      })
    }
  })
}

function loadData(that, type, data, callback) {
  var session = wx.getStorageSync('session');
  switch (type) {
    case 'select':
      var param = {
        openid: session
      }
      break;
    case 'update':
      var param = {
        oldName: data.oldName,
        newName: data.newName,
        openid: session
      }
      break;
    case 'delete':
      if (data.members) {
        var param = {
          members: data.members,
          groupName: data.groupName,
          openid: session
        }
      } else {
        var param = {
          groupName: data.groupName,
          openid: session
        }
      }
      break;
  }

  if (type == "select") {
    request.loadData(this, '/NoCourse/' + type, param, function (res) {
      if (res.data) {
        that.setData({
          groups: res.data.groups,
        })
      }
    })
  } else if (type == "delete") {
    requestByPost.loadData(this, '/NoCourse/' + type, param, function (res) {
      if (res.data) {
        that.setData({
          groups: res.data.groups,
        })
      } else {
        that.setData({
          groups: [],
        })
      }
    })
  } else {
    requestByPost.loadData(this, '/NoCourse/' + type, param, function (res) {
      if (res.data) {
        that.setData({
          groups: res.data.groups,
        })
      }
    })
  }
}
