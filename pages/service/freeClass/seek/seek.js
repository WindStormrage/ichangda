var requestByPost = require('../../../../utils/requestByPost.js')
var request = require('../../../../utils/request.js')
var app = getApp()
var HOST_URL = app.getHostUrl()
Page({
  data: {
    title: [],
    personNum: [
      { id: 1, unique: 'unique_1' },
      { id: 2, unique: 'unique_2' },
    ],
    showModalStatus: false
  },
  onLoad: function (options) {
    if (options.weekth) {
      var weekth = options.weekth;
      this.setData({
        weekth: weekth
      })
    }
  },

  addOne: function (e) {
    var personNum = this.data.personNum;
    var personNumLen = personNum.length;
    personNum.push({ id: personNumLen + 1, unique: 'unique_' + (personNumLen + 1) })
    this.setData({
      personNum: personNum
    })
  },

  formReset: function (e) {
    var personNum = this.data.personNum;
    var personNumLen = personNum.length;
    for (var i = 0; i < personNumLen - 2; i++) {
      personNum.pop()
    }
    this.setData({
      personNum: personNum
    })
  },

  newGroup: function (event) {
    var currentStatu = event.currentTarget.dataset.statu;
    if (currentStatu == 'open') {
      var stuNos = [];
      for (var i = 0; i < this.data.personNum.length; i++) {
        var stuNo = event.detail.value["stuNo" + "" + i];
        if (stuNo != "") {
          stuNos.push(stuNo);
        }
      }
      this.setData({
        stuNos: stuNos
      });
    }
    if (currentStatu == 'ok') {
      if (this.data.stuNos && this.data.newValue) {
        var stuNos = this.data.stuNos;
        var newName = this.data.newValue;
        var members = [];
        for (var i = 0; i < stuNos.length; i++) {
          members.push({ "memberJwcAccount": stuNos[i] });
        }
        var data = {
          groupName: newName,
          members: members,
          stuNos: stuNos,
          weekth: this.data.weekth
        }
        loadData(this, "build", data);
      }
    }
    this.CPM(currentStatu)
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

function loadData(that, type, data, callback) {
  var session = wx.getStorageSync('session');
  switch (type) {
    case 'build':
      var param = {
        groupName: data.groupName,
        members: data.members,
        openid: session
      }
      break;
  }
  requestByPost.loadData(that, '/NoCourse/' + type, param, function (res) {
    that.setData({
      data: res.data,
    })
    wx.redirectTo({
      url: '../class/class?stuNo=' + data.stuNos + '&weekth=' + data.weekth,
    })
  })
}