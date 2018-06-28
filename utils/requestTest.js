module.exports = {
  loadData: loadData
}


var app = getApp()
var HOST_URL = app.getHostUrl()

function loadData(that, url, param, callback) {

  log("[DEBUG] http begin----------------------------------------------")
  // log("[DEBUG] action = " + action)
  // log("[DEBUG] url = " + HOST_URL + '/weccsu/' + action + '.action')
  log("[DEBUG] param ->")
  log(param)
  log("[DEBUG] 建立网络请求...[" + url + "]")
  showLoading("加载中")
  wx.request({
    //HOST_URL + '/weccsu/' + action + '.action',
    url: url,  //url: HOST_URL + url,
    data: param,
    method: "GET",
    success: function (res) {
      log("[DEBUG] request success.... statusCode =" + res.statusCode)
      log("[DEBUG] request success.... errMsg     = " + res.errMsg)
      //hideLoading() 放这里是为了兼容有些页面需要显示提示Toast
      hideLoading()
      console.log(res)
      if (res.statusCode == 200) {
        if (true) {
          log("[DEBUG] server success...")
          log("[DEBUG] server res.data -> ")
          callback(res.data)
        } else {
          log("[DEBUG] server failed!!!! errcode = " + res.data.errcode)
          log("[DEBUG] server failed!!!! errmsg  = " + res.data.errmsg)
          let msg = res.data.errmsg
          if (msg == null) {
            msg = "服务器正在维护。"
          }
          wx.showModal({
            showCancel: false,
            confirmText: '知道了',
            content: msg,
          })
        }
      } else {
        log("[DEBUG] server failed!!!! ")
        log("[DEBUG] server statusCode = " + res.statusCode)
        log("[DEBUG] server errMsg     = " + res.errMsg)
        wx.showModal({
          title: '提示[' + res.statusCode + ']',
          content: '服务器挂了'
        })
      }
    },
    fail: function () {
      //hideLoading() 放这里是为了兼容有些页面需要显示提示Toast
      log("[DEBUG] request failed!!!! ")
      hideLoading()
      // wx.navigateTo({
      //   url: '../prompt/prompt',
      // })
      wx.showModal({
        title: '提示',
        content: '无法连接到服务器！'
      })
    }, complete: function () {
      wx.stopPullDownRefresh()
      log("[DEBUG] complete---------------------------------------------")
    }
  })
}

function showLoading(msg) {
  wx.showNavigationBarLoading()
  wx.showToast({
    title: msg,
    icon: 'loading',
    duration: 1500
  })
}

function hideLoading() {
  wx.hideToast()
  wx.hideNavigationBarLoading()
}

function log(val) {
  if (app.globalData.LOG) {
    console.log(val)
  }
}
