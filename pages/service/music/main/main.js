
var request = require('../../../../utils/request.js')
var util = require('../../../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    info: {},
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '点歌台'
    })
    let that = this;

    loadData(that, function callback(){
      if (options.umid) {
        let index = 0;
        for (; index < that.data.list.length; index++) {
          if (that.data.list[index].id == options.umid) {
            showDetail(that, index)
            break;
          }
        }
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
    loadData(this)
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
  diange: function (e) {
    let mid = this.data.info.id;
    wx.navigateTo({
      url: '../from/from?mid=' + mid,
    })
  },
  showDetail: function (e) {
    let abc = e.currentTarget.dataset.item.split(',')
    let id = abc[0]
    let index = abc[1]
    showDetail(this, index);
  },
  dianZan: function (e) {
    console.log(e)
    let abc = e.currentTarget.dataset.item.split(',')
    let id = abc[0]
    let index = abc[1]
    let that = this;
    let list = that.data.list;
    console.log("******************" + index)
    console.log(list)
    if (list[index].isZan === 1) return
    var session = wx.getStorageSync('session')
    request.loadData(that, "/music/zan", { openid: session, mid: that.data.info.id, umid: id }, function (res) {
      if (res.data === 1) {
        list[index].isZan = 1;
        list[index].zan++;
        that.setData({
          list: list
        })
      } else {
        return
      }
    })
  }
})

function loadData(that,callback) {
  var session = wx.getStorageSync('session')
  console.log("*************************************" + session)
  request.loadData(that, "/music/getInfoAndList", { openid: session }, function (res) {
    that.setData({
      info: res.data.info,
      list: res.data.list
    })
    if (callback != null){
      callback()
    }
  })
}

function showDetail(that, index) {
  let msg = {
    img: '',
    head: that.data.list[index].pictrue,
    musicName: that.data.list[index].musicname,
    name: that.data.list[index].nickname,
    time: util.formatTime(new Date(that.data.list[index].createTime))
  }
  if (that.data.list[index].lrc == "" || that.data.list[index].lrc == null) {
    msg.songer = that.data.list[index].songer
  } else {
    msg.songer = that.data.list[index].lrc
  }
  //console.log()
  wx.setStorageSync("music_card_" + that.data.list[index].id, msg)

  wx.navigateTo({
    url: '../card/card?id=' + that.data.list[index].id,
  })
}