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
    day: '27',

    h: '00',
    m: '00',
    s: '00',
    date: {
      d: 88,
      h: 88,
      m: 88,
      s: 88
    },
    num: 0,
    aa: 'grayscale(100%)',
    bb: 'grayscale(0%)',
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
    treasure(this)
  },
  sao: function () {
    // 允许从相机和相册扫码
    wx.scanCode({
      success: (res) => {
        console.log(res.result)
        var session = wx.getStorageSync('session') || ''
        if (session == '') return
        util.showLoading("加载中...")
        wx.request({
          url: 'https://ccsu.notobject.com/ichangda/ScanCode/scan?openid=' + session + '&scan_code=' + res.result,
          method: "GET",
          success: function (res) {
            console.log(res);
            if (res.data.data == 1) {
              util.showModal("提示", "无效二维码", false, function () { })
            } else if (res.data.data == 2) {
              util.showModal("提示", "您已扫过此二维码", false, function () { })
            } else if (res.data.data == 3) {
              util.showModal("提示", "您已收集完六张卡片，无需再寻宝", false, function () {
                wx.redirectTo({
                  url: '../me/me'
                })
              })
            } else if (res.data.data == 4) {
              util.showModal("提示", "您已收集完六张卡片，无需再寻宝", false, function () { })
            } else if (res.data.data == 5) {
              util.showModal("提示", "寻宝成功，请继续加油！", false, function () {
                wx.redirectTo({
                  url: '../me/me'
                })
              })
            } else if (res.data.data == 6) {
              util.showModal("提示", "一天最多收集两张卡片!", false, function () { })
            }
          },
          fail: function () {
            util.showModal("提示", "服务器连接失败，请重新扫码", false, function () { })
          },
          complete: function () {
            util.hideLoading()
          }
        })
      }
    })
  },
  toPai: function () {
    wx.navigateTo({
      url: '../ranking/ranking'
    })
  },
  toList: function () {
    wx.navigateTo({
      url: '../list/list'
    })
  },
  rule: function () {
    wx.navigateTo({
      url: '../rule/rule'
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
function time(that) {
  var enddata = getdate(that);
  var d = GetDateDiff(new Date().getTime(), new Date(enddata).getTime());
  var h = getHour(new Date().getTime(), new Date(enddata).getTime());
  var m = getmin(new Date().getTime(), new Date(enddata).getTime());
  var s = getsec(new Date().getTime(), new Date(enddata).getTime());
  if (d < 10) d = '0' + d;
  if (h < 10) h = '0' + h;
  if (m < 10) m = '0' + m;
  if (s < 10) s = '0' + s;
  var date = {
    d: d,
    h: h,
    m: m,
    s: s
  }
  that.setData({
    date: date
  })
}
function getdate(that) {
  return that.data.year + '/' + that.data.moon + '/' + that.data.day + ' ' + that.data.h + ':' + that.data.m + ':' + that.data.s;
}

function GetDateDiff(startDate, endDate) {
  return parseInt(Math.abs((startDate - endDate)) / (1000 * 60 * 60 * 24));
}

function getHour(startDate, endDate) {
  return parseInt(Math.abs((startDate - endDate)) / (1000 * 60 * 60)) % 24;
}

function getmin(startDate, endDate) {
  return parseInt(Math.abs((startDate - endDate)) / (1000 * 60)) % 60;
}

function getsec(startDate, endDate) {
  return parseInt(Math.abs((startDate - endDate)) / (1000)) % 60;
}



function load(that) {
  var session = wx.getStorageSync('session') || ''
  if (session == '') return
  util.showLoading("加载中...")
  wx.request({
    url: 'https://ccsu.notobject.com/ichangda/ScanCode/CodeCount?openid=' + session,
    method: "GET",
    success: function (res) {
      console.log("******************************************");
      console.log(res);
      if (res.data.data != -1) {
        console.log(res);
        that.setData({
          num: res.data.data
        })
      } else if (res.data.data == -1) {
        util.showModal("提示", "您未答题，请先答题", false, function () {
          wx.redirectTo({
            url: './../answer/answer'
          })
        })
      }
    },
    fail: function () {
      util.showModal("提示", "服务器连接失败，请重新进入", false, function () {
        wx.reLaunch({
          url: './../../index/index'
        })
      })
    },
    complete: function () {
      util.hideLoading()
    }
  })
}

/*寻宝活动的入口*/
function treasure(that) {
  var session = wx.getStorageSync('session') || ''
  if (session == '') return
  util.showLoading("加载中...")
  wx.request({
    url: 'https://ccsu.notobject.com/ichangda/User/add?openid=' + session,
    method: "GET",
    success: function (res) {
      console.log(res);
      if (res.data.data == 4) {
        wx.redirectTo({
          url: "../wait/wait",
        })
      } else if (res.data.data == 3) {
        wx.redirectTo({
          url: "../end/end",
        })
      } else if (res.data.data == 1) {
        wx.redirectTo({
          url: "../answer/answer",
        })
      } else if (res.data.data == 5) {
        wx.redirectTo({
          url: "../convert/convert",
        })
      } else {
        load(that)
      }
    },
    fail: function () {
      util.showModal("提示", "服务器连接失败，请重新加载", false, function () { })
    },
    complete: function () {
      util.hideLoading()
    }
  })
}