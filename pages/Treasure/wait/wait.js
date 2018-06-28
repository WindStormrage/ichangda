// pages/Treasure/treasure.js
var util = require('../../../utils/util.js')
var request = require('../../../utils/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    year: '2018',
    moon: '4',
    day: '17',
    h: '10',
    m: '00',
    s: '00',
    date:{
      d: 88,
      h: 88,
      m: 88,
      s: 88
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    setInterval(function () {
      time(that)
    }, 1000)
    wx.setNavigationBarTitle({
      title: '微寻者'
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
  bingo: function(){
    wx.navigateTo({
      url: '../answer/answer'
    })
  }
})
function time(that){
  var enddata = getdate(that);
  var d = GetDateDiff(new Date().getTime(), new Date(enddata).getTime());
  var h = getHour(new Date().getTime(), new Date(enddata).getTime());
  var m = getmin(new Date().getTime(), new Date(enddata).getTime());
  var s = getsec(new Date().getTime(), new Date(enddata).getTime());
  if (d<10) d = '0'+d;
  if (h<10) h = '0'+h;
  if (m<10) m = '0'+m;
  if (s<10) s = '0'+s;
  var date = {
    d: d,
    h: h,
    m: m,
    s: s
    }
  that.setData({
    date : date
  })
}
function getdate(that){
  return that.data.year+'/'+that.data.moon+'/'+that.data.day+' '+that.data.h+':'+that.data.m+':'+that.data.s;
}

function GetDateDiff(startDate,endDate){
    return parseInt(Math.abs((startDate - endDate))/(1000*60*60*24));
}

function getHour(startDate,endDate) {
    return parseInt(Math.abs((startDate - endDate))/(1000*60*60))%24;
}

function getmin(startDate,endDate) {
    return parseInt(Math.abs((startDate - endDate))/(1000*60))%60;
}

function getsec(startDate,endDate) {
    return parseInt(Math.abs((startDate - endDate))/(1000))%60;
}