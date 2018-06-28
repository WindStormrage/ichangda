// pages/Treasure/treasure.js
var util = require('../../../utils/util.js')
var request = require('../../../utils/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: [
      { url: '/images/99999.png', name: '管薇薇', time: '1天10小时2分' },
      { url: '/images/88888.png', name: '致远楼', time: '1天5小时2分' },
      { url: '/images/77777.png', name: '涵虚楼', time: '2天8小时2分' }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    wx.setNavigationBarTitle({
      title: '微寻者'
    })
    load(that);
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



function load(that) {

  var session = wx.getStorageSync('session') || ''
  if (session == '') return
  util.showLoading("加载中...")
  wx.request({
    url: 'https://ccsu.notobject.com/ichangda/User/Rank',
    method: "GET",
    success: function (res) {
      console.log(res);
      that.setData({
        data: res.data.data
      })
    },
    fail: function () {
      util.showModal("提示", "服务器连接失败，请重新加载", false, function () {
        wx.redirectTo({
          url: '../me/me'
        })
      })
    },
    complete: function () {
      util.hideLoading()
    }
  })
}


