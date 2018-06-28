// pages/Treasure/list/list.js
var util = require('../../../utils/util.js')
var request = require('../../../utils/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    container_color: [{ background: "#aa89bd", mmbackground: "#773b92" }, { background: "#f29b76", mmbackground: "#ea6228" }, { background: "#f8b551", mmbackground: "#fa9600" }, { background: "#88abda", mmbackground: "#528ad6" }, { background: "#84ccc9", mmbackground: "#3fbab6" }],
    data: []
  },

  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '微寻者'
    })
    load(this)
  },

  culeDetail: function (event) {
    var culeId = event.currentTarget.dataset.id
    console.log('../content/content?content='+this.data.data[culeId].content+'&photo='+this.data.data[culeId].photo+'&music='+this.data.data[culeId].music);
    wx.navigateTo({
      url: '../content/content?content='+this.data.data[culeId].content+'&photo='+this.data.data[culeId].photo+'&music='+this.data.data[culeId].music,
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



function load (that) {
  var session = wx.getStorageSync('session') || ''
  if (session == '') return
  util.showLoading("加载中...")
  wx.request({
    url: 'https://ccsu.notobject.com/ichangda/cline/elseQuery?openid='+session,
    method: "GET",
    success: function (res) {
      console.log(res);
      if (res.data.data == null) return;
      var data = [];
      for (var i = res.data.data.length - 1; i >= 0; i--) {
        var a = {};
        a.content = res.data.data[i].content
        a.photo = res.data.data[i].image_url
        a.music = res.data.data[i].mp3_url
        data[i] = a
      }
      that.setData({
        data: data
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