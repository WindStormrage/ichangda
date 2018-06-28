
var request = require('../../utils/request.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    state: 0,
    shine: "shine"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '抽奖'
    })
    wx.setKeepScreenOn({
      keepScreenOn: true
    })
    let that = this;
    that.setData({
      shine: "shine"
    })
    var session = wx.getStorageSync('session')
    request.loadData(that, "/luck/getState", { openid: session }, function (res) {
      console.log(res)
      getdata(that, res.data);
    })
  },
  button: function () {
    let that = this
    wx.showModal({
      title: '温馨提示',
      content: '非工作人员请勿点击确认，点击后会影响您的兑奖',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          exchange(that);
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})

function lucking(that) {
  var session = wx.getStorageSync('session')
  request.loadData(that, "/luck/luckDraw", { openid: session }, function (res) {
    console.log(res)
    setTimeout(function () {
      getdata(that, res.data)
    }, 1000 * 60)
  })
}
function exchange(that) {
  var session = wx.getStorageSync('session')
  request.loadData(that, "/luck/cap", { openid: session }, function (res) {
    console.log(res);
    var msg = ""
    if (res.data === 1) {
      //兑奖成功
      that.setData({
        state: 1,
        shine: ""
      })
      return
    } else if (res.data === -1) {
      msg = '请在抽奖结束后进行兑奖'
    } else {
      msg = '兑奖失败，请稍后重试'
    }
    //兑奖失败
    that.setData({
      state: 2,
      shine: ""
    })
    wx.showModal({
      title: '提示',
      content: msg,
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  })
}
function showEnd() {
  wx.showModal({
    title: '提示',
    content: '活动结束',
    success: function (res) {
      if (res.confirm) {
        console.log('用户点击确定')
      } else if (res.cancel) {
        console.log('用户点击取消')
      }
    }
  })
}

function getdata(that, res) {
  if (res.state === 10001) {
    //还没开始，开始去闪
    that.setData({
      state: 0,
      shine: "shine"
    })
    wx.showModal({
      title: '提示',
      content: '活动还没开始，请在抽奖开始后重新进入',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  } else if (res.state === 10002) {
    //开始抽奖
    if (res.luckman === 0) {
      //他还没抽奖
      that.setData({
        state: 0,
        shine: "shine"
      })
      lucking(that);
    } else if (res.luckman.luckMan === true) {
      //抽奖了而且中奖啦
      if (res.luckman.cap === true) {
        //中奖啦而且兑奖啦
        wx.vibrateLong({
          complete: function () {
            setTimeout(function () {
              wx.vibrateLong();
            }, 500)
          }
        })
        that.setData({
          state: 1,
          shine: ""
        })
      } else if (res.luckman.cap === false) {
        //中奖啦但还没兑奖
        that.setData({
          state: 2,
          shine: ""
        })
      }
    } else if (res.luckman.luckMan === true) {
      //抽奖了但是没中奖
      that.setData({
        state: 0,
        shine: "shine"
      })
    }
  } else if (res.state === 10003) {
    //活动结束了
    showEnd();
    if (res.luckman === 0) {
      //他还没抽奖
      that.setData({
        state: 0,
        shine: ""
      })
    } else if (res.luckman.luckMan === true) {
      //抽奖了而且中奖啦
      if (res.luckman.cap === true) {
        //中奖啦而且兑奖啦
        that.setData({
          state: 1,
          shine: ""
        })
      } else if (res.luckman.cap === false) {
        //中奖啦但还没兑奖
        that.setData({
          state: 2,
          shine: ""
        })
      }
    } else if (res.luckman.luckMan === true) {
      //抽奖了但是没中奖
      that.setData({
        state: 0,
        shine: ""
      })
    }
  }
}