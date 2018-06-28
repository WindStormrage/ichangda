var app = getApp()
var HOST_URL = app.getHostUrl()
var util = require('../../utils/util.js')
var request = require('../../utils/request.js')
Page({
  data: {
    feedList: [],
    power: false
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '反馈',
    })
    // if (options.power == 8888 || options.power == 10000) {
    //   this.setData({
    //     power: true
    //   })
    // }

    loadList(this)
  },
  bindFormSubmit: function (e) {
    var that = this
    var content = e.detail.value.textarea
    if (content == "") {
      return
    }
    if (content.length > 100) {
      wx.showToast({
        title: '不能超过100个字符！',
        icon: 'success',
        duration: 1500
      })
      return
    }
    var session = wx.getStorageSync('session')
    var param = {
      openid: session,
      content: content
    }
    request.loadData(this, '/user/feedback', param, function (res) {
      util.showModal("提示", "提交成功，管理员会对您的问题进行回复，回复后就可以在下面看到，请过几天后来看看。", false, function () { })
    })
  },
  bindBack: function (e) {
    if (e.detail.value.backtext.length > 100 || e.detail.value.backtext < 1) {
      wx.showToast({
        title: '请重新书写',
        icon: 'success',
        duration: 1500
      })
      return
    }
    console.log(e.detail.value.backtext);
    console.log(e.detail.value.backId);
  },
  onShareAppMessage: function () {
    // 用户点击右上角分享
    return {
      title: 'hahaahahah', // 分享标题
      desc: 'fasdfasdfasdfasdfasdfasdfasd', // 分享描述
      //path: 'path' // 分享路径
    }
  },
})

function loadList(that) {
  var param = {
    page: 0
  }
  request.loadData(that, '/feedback/list', param, function (res) {
    console.log(res);
    var feedList = res.data
    for (let i = 0; i < feedList.length; i++) {
      feedList[i].datetime = util.formatTime(new Date(feedList[i].datetime))
    }
    that.setData({
      feedList: feedList
    })
  })
}