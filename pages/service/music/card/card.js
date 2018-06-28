// pages/service/music/card/card.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img: '',
    head: '',
    musicName: '',
    songer: '',
    name: '',
    time: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '点歌台'
    })
    let msg = wx.getStorageSync("music_card_" + options.id)
    console.log(msg)
    let that = this;
    that.setData({
      img : msg.img,  
      head : msg.head,
      musicName : msg.musicName,
      songer : msg.songer,
      name : msg.name,
      time : msg.time
    })
    let imgId = options.id % 34;
    let imgUrl = "https://ccsu.notobject.com/ichangda/uploads/musicstand/default_"+imgId+".jpg"
    that.setData({
      img: imgUrl,
    })

  },
  setDate: function(data) {
    wx.setNavigationBarTitle({
      img: '',
      head: '',
      musicName: '《遇见了你我只喜欢你》',
      songer: '陈珂宇',
      name: '叫我张东东啦~',
      time: '2017.9.8'
    })
  },
  exchange: function () {
    let imgId = Math.round(Math.random() * 33)
    let imgUrl = "https://ccsu.notobject.com/ichangda/uploads/musicstand/default_" + imgId + ".jpg"
    this.setData({
      img: imgUrl,
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