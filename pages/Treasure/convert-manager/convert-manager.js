var util = require('../../../utils/util.js')
var request = require('../../../utils/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '微寻者'
    })
  },
  codeConfirm: function (event) {
    var searchCode = event.detail.value["redeemCode"];
    console.log(searchCode);

    util.showLoading("加载中...")
    wx.request({
      url: 'https://ccsu.notobject.com/ichangda/User/queryRandom_num?random_num=' + searchCode,
      method: "GET",
      success: function (res) {
        console.log(res);
        if (res.data.data == -1) {
          util.showModal("提示", "无效兑奖码", false, function () { })
        } else if (res.data.data == -2) {
          util.showModal("提示", "扫描二维码数小于二不能参与兑奖", false, function () { })
        } else if (res.data.data == -3) {
          util.showModal("提示", "已经兑奖过了，不能再兑奖了", false, function () { })
        } else {
          util.showModal("提示", "兑奖成功！此人的兑奖卡片数为" + res.data.data.scanCodeNum + "   勾选的奖品：" + res.data.data.prizeType, false, function () { })
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

  }
})