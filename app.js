//app.js
App({
  onLaunch: function () {
    this.getUserInfo()
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  getHostUrl(){
    var that = this
    if(that.globalData.DEBUG){
      return that.globalData.DEBUG_HOST_URL
    }else{
      return that.globalData.HOST_URL
    }
  },
  globalData: {
    userInfo: null,
    // HOST_URL: "https://ccsu.notobject.com",
    HOST_URL: "https://ccsu.notobject.com/ichangda",
    DEBUG_HOST_URL: "http://localhost:8080",
    DEBUG: false,
    LOG:true
  }
})