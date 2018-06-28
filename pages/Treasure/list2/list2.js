// pages/Treasure/list/list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: [
      { content: '13231213', photo: 'das', music: 'dsa' },
      { content: '', photo: 'das', music: '' },
      { content: '13231213', photo: 'dsa', music: '' },
      { content: '', photo: '', music: 'dsa' },
      { content: '13231213', photo: '', music: 'das' }
    ]
  },

  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '微寻者'
    })
  },

  culeDetail: function (event) {
    var culeId = event.currentTarget.dataset.id
    wx.navigateTo({
      url: '../content/content?cule=' + culeId,
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