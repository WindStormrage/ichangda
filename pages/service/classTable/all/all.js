var util = require('../../../../utils/util.js')
var request = require('../../../../utils/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: [],
    week: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
    weekday: 5
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: 'i长大-全部课表'
    })
    var that = this;
    var session = wx.getStorageSync('session');
    var param = {
      data: -1,
      openid: session
    }
    request.loadData(that, '/course/' + 'all', param, function (res) {
      for (var i = res.data.length - 1; i >= 0; i--) {
        if (res.data[i].weekday == '6' || res.data[i].weekday == '7') {
          that.setData({
            weekday: 7
          })
          break;
        }
      }
      that.setData({
        data: res.data,
      })
    })
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

  }
})
