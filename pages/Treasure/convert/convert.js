var util = require('../../../utils/util.js')
var request = require('../../../utils/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    redeemCode: "",
    cardNum: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '微寻者'
    })
    load(this)
    var that = this
    var session = wx.getStorageSync('session') || ''
    util.showLoading("加载中...")
    wx.request({
      url: 'https://ccsu.notobject.com/ichangda/ScanCode/CodeCount?openid=' + session,
      method: "GET",
      success: function (res) {
        console.log(res);
        if (res.data.data >= 0) {
          that.setData({
            cardNum: res.data.data
          })
        }
      },
      fail: function () {
        util.showModal("提示", "服务器连接失败，请重新提交", false, function () { })
      },
      complete: function () {
        util.hideLoading()
      }
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

  },
  toWantCollect: function () {
    wx.navigateTo({
      url: '../want-collect/want-collect'
    })
  }
})



function load(that) {
  var session = wx.getStorageSync('session') || ''
  if (session == '') return
  util.showLoading("加载中...")
  wx.request({
    url: 'https://ccsu.notobject.com/ichangda/User/queryis_exchange?openid=' + session,
    method: "GET",
    success: function (res) {
      console.log(res);
      that.setData({
        redeemCode: res.data.data
      })
    },
    fail: function () {
      util.showModal("提示", "服务器连接失败，请重新加载", false, function () {
        wx.redirectTo({
          url: '../../index/index'
        })
      })
    },
    complete: function () {
      util.hideLoading()

    }
  })
}