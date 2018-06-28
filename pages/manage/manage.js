// pages/manage/manage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    config: [
      { id: 1, permision: "8888,10000", url: "../manage/music/music", name: "点歌管理" },
      { id: 2, permision: "8888", url: "../manage/config/config", name: "配置管理" },
      { id: 2, permision: "8888,10000,10001", url: "../Treasure/convert-manager/convert-manager", name: "兑奖管理" }
    ],
    power: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '后台管理'
    })
    this.setData({
      power: options.power
    })
  },
  onItemClick: function (e) {
    var id = e.currentTarget.id
    let power = this.data.power
    let permisions = this.data.config[id].permision.split(",")
    let flag = false

    for (var i = 0; i < permisions.length; i++) {
      if (permisions[i] == power) {
        flag = true
        break;
      }
    }
    if (flag === false) {
      wx.showToast({
        title: '权限不足',
        image: '/images/msg.png'
      })
      return
    }
    wx.navigateTo({
      url: this.data.config[id].url +'?power=' + this.data.power
    })
  },
})