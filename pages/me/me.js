var app = getApp()
var HOST_URL = app.getHostUrl()
Page({
  data: {
    userInfo: {},
    account: '绑定账号',
    bindInfo: null,
    power: ''
  },
  onLoad: function (options) {

    this.setData({
      userInfo: app.globalData.userInfo,
    })
    wx.setNavigationBarTitle({
      title: '我的'
    })

    let bindInfo = wx.getStorageSync('bindInfo')
    if (bindInfo != null && bindInfo.jwcaccount != null && bindInfo.jwcaccount != '') {
      this.setData({
        account: bindInfo.jwcaccount,
        bindInfo: bindInfo,
        power: bindInfo.status
      })
    }
  },
  onShow: function (e) {
      let bindInfo = wx.getStorageSync('bindInfo')
      if (bindInfo != null && bindInfo.jwcaccount != null && bindInfo.jwcaccount != '') {
          this.setData({
              account: bindInfo.jwcaccount
          })
      }
  },
  onItemClick: function (e) {
    var id = e.currentTarget.id
    switch (id) {
      case '0': //头像
        break
      case '1': //个人信息
        break
      case '2': //我的收藏
        break
      case '3': //绑定学号
        console.log(this.data.bindInfo)
        if (this.data.bindInfo && this.data.bindInfo != null && this.data.bindInfo.jwcaccount && this.data.bindInfo.jwcaccount != null) {
          var itemList = ['重新绑定教务处账号']

          if (this.data.bindInfo.libraryaccount != null) {
            itemList.push('重新绑定图书馆账号')
          } else {
            itemList.push('绑定图书馆账号')
          }
          if (this.data.bindInfo.netaccount != null) {
            itemList.push('重新绑定校园网账号')
          } else {
            itemList.push('绑定校园网账号')
          }
          wx.showActionSheet({
            itemList: itemList,
            success: function (res) {
              if (res.tapIndex == 0) {
                wx.navigateTo({
                  url: '../bindAccount/bindAccount?bindtype=jwcAccount'
                })
              } else if (res.tapIndex == 1) {
                wx.navigateTo({
                  url: '../bindAccount/bindAccount?bindtype=libraryAccount'
                })
              } else if (res.tapIndex == 2) {
                wx.navigateTo({
                  url: '../bindAccount/bindAccount?bindtype=netAccount'
                })
              }
            },
            fail: function (res) {
              console.log(res.errMsg)
            }
          })
        } else {
          wx.navigateTo({
            url: '../bindAccount/bindAccount?bindtype=jwcAccount'
          })
        }
        break
      case '4': //反馈
        wx.navigateTo({
          url: '../feedback/feedback?power=' + this.data.power
        })
        break
      case '5': //关于
        wx.navigateTo({
          url: '../about/about'
        })
        break
      case '6': //扫一扫
        wx.scanCode({
          success: (res) => {
            console.log(res.result)
          }
        })
        break
      case '7': //管理
        wx.navigateTo({
          url: '../manage/manage?power='+this.data.power
        })
        break
    }
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  }
})