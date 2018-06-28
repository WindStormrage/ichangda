var util = require('../../../utils/util.js')
var request = require('../../../utils/request.js')
Page({
  onReady: function (e) {
    // 使用 wx.createAudioContext 获取 audio 上下文 context
    this.audioCtx = wx.createAudioContext('myAudio')
  },
  data: {
    data: {},
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '微寻者'
    })
    console.log(options);
    if (options.photo) {
      var photo = options.photo.split(",");
      options.photo = photo;
    }
    this.setData({
      data: options
    })
  },
  onShareAppMessage: function () {

  }
})

