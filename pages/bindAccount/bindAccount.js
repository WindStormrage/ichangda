
var request = require('../../utils/request.js')

var util = require('../../utils/util.js')
Page({
  data: {
    userInfo: {},
    jwcAccountfocus: 0,
    passwordfocus: 0,
    bindtype: 'jwcAccountt',
    accountHit: '请输入账号',
    passwordHit: '请输入密码',
  },
  onLoad: function (options) {
    var title = ""
    var accountHit = ''
    var passwordHit = ''

    if (options.bindtype == 'netAccount') {
      title = "绑定校园网账号"
      accountHit = '请输入您的学号'
      passwordHit = '校园网上网密码'
    } else if (options.bindtype == 'libraryAccount') {
      title = "绑定图书馆账号"
      accountHit = '学号 或 11077+学号'
      passwordHit = '默认为0000或123456'
    } else {
      title = "绑定教务处账号"
      accountHit = '请输入您的学号'
      passwordHit = '请输入身份证后六位'
    }

    //设置页面标题
    wx.setNavigationBarTitle({
      title: title,
    })

    this.setData({
      bindtype: options.bindtype,
      accountHit: accountHit,
      passwordHit: passwordHit
    })

    let session = wx.getStorageSync('session')
    if (session == '') {
      wx.showModal({
        title: '无法获取到您的身份凭证',
        content: '一个可能的原因是您拒绝了授权，请点右上角菜单，进入设置界面重新进行授权。授权后的信息仅用作身份标识，无法查看到您的隐私数据。'
      })
      return
    }
  },
  //点击绑定返回数据e
  bind: function (e) {
    
    let session = wx.getStorageSync('session')
    if(session == ''){
      wx.showModal({
        title: '无法获取到您的身份凭证',
        content: '一个可能的原因是您拒绝了授权，请点右上角菜单，进入设置界面重新进行授权。授权后的信息仅用作身份标识，无法查看到您的隐私数据。'
      })
      return
    }
    util.showLoading("绑定账号")
    var param = {
      openid: session,
      account: e.detail.value.account.trim(),
      password: e.detail.value.password.trim(),
      bindtype: this.data.bindtype,
    }

    if (param.account == null || param.account == '') {
      return
    }

    request.loadData(this, "/user/bind", param, function (res) {
      wx.setStorageSync('doBind', true)
      wx.showToast({
        title: '绑定成功',
        icon: 'success',
        duration: 1500
      })
      setTimeout(function () {
        wx.switchTab({
          url: '/pages/index/index',
        })
      }, 1500)
    })
  },
  help: function () {
    wx.navigateTo({
      url: '/pages/help/help'
    })
  }
})


