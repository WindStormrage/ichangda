var util = require('../../../../utils/util.js')
var request = require('../../../../utils/request.js')
var app = getApp()
var HOST_URL = app.getHostUrl()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showView: true,
    time: 1,
    data: [
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  },
  send: function () {
    // 获取当前所有标记的
    util.showModal("提示", "您是否确定给标记用户发送消息", true, function(msg) {
      // body...
    }, function (msg) {
      // body...
    })
  },
  starTap: function (event) {
    console.log(event.currentTarget.dataset.id);
    var id = event.currentTarget.dataset.id;
    var that = this;
    var data = that.data.data;
    var time = this.data.time;
    data[id].is_sign
      = !data[id].is_sign
      ;
    that.setData({
      data: data
    });
    loadData(that, "/sign?mid=" + time + "&&id=" + id);
  },
  deleteTap: function (event) {
    console.log(event.currentTarget.dataset.id);
    var id = event.currentTarget.dataset.id;
    var that = this;
    var data = that.data.data;
    var time = this.data.time;
    wx.showModal({
      title: '提示',
      content: '是否删除选定歌曲？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          data.splice(id, 1);
          that.setData({
            data: data
          });
          loadData(that, "/signDelete?mid=" + time + "&&id=" + id);
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  onLoad: function (options) {
    var that = this;
    showView: (options.showView == "true" ? true : false)
    loadData(that, "/signMusic?mid=1");
  },

  scroll: function () {
    var that = this;
    that.setData({
      showView: (!that.data.showView)
    })
  },
  whichTime: function (event) {
    console.log(event.currentTarget.dataset.time + 1);
    var time = event.currentTarget.dataset.time + 1;
    var that = this;
    that.setData({
      time: time
    });
    loadData(that, "/signMusic?mid=" + time);
  }

})

function loadData(that, type, data, callback) {
  var session = wx.getStorageSync('session');
  var param = {
    data: data,
    openid: session
  }
  request.loadData(this, '/music' + type, param, function (res) {
    console.log(res)
    if (res.data == null) {
      wx.showModal({
        showCancel: false,
        confirmText: '知道了',
        content: "暂无所选期数",
      })
    }
    that.setData({
      data: res.data
    });
  })
}