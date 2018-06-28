//index.js
var util = require('../../utils/util.js')
var request = require('../../utils/request.js')
var app = getApp()
var HOST_URL = app.getHostUrl()
Page({
  data: {
    flag: false,
    emptyStr: "  -  ",
    isBinded: false,
    selected: false,
    indicator: false,
    selectedType: "",
    date: "",
    weekday: "",
    weekth: "",
    weekthInt: 0,
    userInfo: {},
    bannerList: [],
    mainMenu: [],
    cours: [],
    options: {},
    notice: {
      msg: "",
      url: ""
    },
    CPM: {
      photo: 'http://123.207.39.128:8080/upload/file/9eed9c9ffbb21d8c8adef6dad5904205',
      title: '',
      content: ""
    }
  },
  onLoad: function (options) {

    //登录到服务器
    login2Server(this)
    //getCPM(this)
    //设置首页日期
    var today = new Date()
    this.setData({
      date: util.getMonthAndDay(today),
      weekday: util.getWeekDay(today),
      options: options
    })

    if (options.voteId) {
      wx.navigateTo({
        url: '/pages/service/vote/vote?voteId=' + options.voteId
      })
    }

    if (options.signupId) {
      wx.navigateTo({
        url: '/pages/service/signup/signup?signupId=' + options.signupId
      })
    }
    if (options.luck) {
      wx.navigateTo({
        url: '/pages/luckDraw/luckDraw'
      })
    }
    if (options.music) {
      wx.navigateTo({
        url: '/pages/service/music/main/main'
      })
    }
  },
  /**
   * 弹出层函数
   */
  //出现
  show: function () {

    this.setData({ flag: false })

  },
  //消失

  hide: function () {

    this.setData({ flag: true })

  },
  //toActive
  toActive: function () {
    wx.navigateTo({
      url: '/pages/Treasure/me/me'
    })
  },
  onShow: function (e) {
    var that = this
    flushPage(that)
  },
  onTabSelected: function (e) {
    var id = e.currentTarget.id
    this.setData({
      currentType: id
    })
  },
  onItemClick: function (e) {

    var id = e.currentTarget.dataset.id;
    var type = e.currentTarget.dataset.type;

    if (id == -1) {
      return
    }
    if (type == 'vote') { //投票类
      wx.navigateTo({
        url: '/pages/service/vote/vote?voteId=' + id
      })
    } else if (type == 'notice') { // 通知类
      wx.navigateTo({
        //url: '/pages/service/notice/notice?noticeId=' + id
      })
      //这里是个寻宝活动的入口
      //treasure(this)
    } else if (type == 'news') { // 图文类
      wx.navigateTo({
        url: '/pages/news/news?newsId=' + id
      })
    } else if (type == 'query') { // 查询类
      wx.navigateTo({
        url: '/pages/service/query/query?queryId=' + id
      })
    } else if (type == 'signup') { // 报名类
      wx.navigateTo({
        url: '/pages/service/signup/signup?signupId=' + id
      })
    } else if (type == 'luck') { // 抽奖类
      wx.navigateTo({
        url: '/pages/luckDraw/luckDraw'
      })
    }
  },
  /**
   * 事件监听 - 主菜单点击事件
   *
   */
  onSelectMenu: function (e) {
    var that = this
    var id = parseInt(e.currentTarget.id)
    var isBinded = wx.getStorageSync('isBinded')
    if (that.data.mainMenu[id].status === 0) {
      wx.showToast({
        title: that.data.mainMenu[id].statusmsg,
        image: '/images/msg.png'
      })
      return
    }
    if (isBinded == false) {
      wx.showToast({
        title: '请绑定学号',
        image: '/images/msg.png'
      })
      return
    }
    var session = wx.getStorageSync('session')
    var toUrl = ''
    switch (id) {
      case 0:
        toUrl = '../service/grade/grade'
        break;
      case 1:
        toUrl = '../service/classTable/classTable?weekth=' + that.data.weekthInt
        break;
      case 2:
        var bindInfo = wx.getStorageSync('bindInfo')
        if (bindInfo != undefined && bindInfo.netaccount != null) {
          toUrl = '../service/wlbx/wlbx'
        } else {
          toUrl = '/pages/bindAccount/bindAccount?bindtype=netAccount'
        }
        break;
      case 3:
        toUrl = '../service/lostAndFound/lostAndFound'
        break;
      case 4:
        var bindInfo = wx.getStorageSync('bindInfo')
        if (bindInfo != undefined && bindInfo.libraryaccount != null) {
          toUrl = '../service/library/library'
        } else {
          toUrl = '/pages/bindAccount/bindAccount?bindtype=libraryAccount'
        }
        break;
      case 5:
        toUrl = '../service/music/main/main'
        break;
      case 6:
        toUrl = '../service/ecard/ecard?session=' + session
        break;
      case 7:
        toUrl = '../Treasure/me/me'
        //treasure(this)
        break;
      case 8:
        toUrl = '../service/freeClass/myGroupings/myGroupings?weekth=' + that.data.weekthInt
        break;
      case 9:
        toUrl = '../service/schoolMap/schoolMap'
        break;
    }
    if (toUrl) {
      wx.navigateTo({ url: toUrl })
    }
  },
  /**
   * 事件监听 - 点击绑定学号
   */
  bindjwcAccount: function (e) {
    wx.navigateTo({
      url: '../bindAccount/bindAccount?bindtype=jwcAccount'
    })
  },
  onPullDownRefresh: function () {
    //登录到服务器
    login2Server(this)
  },
  onClickNotice: function (e) {
    var that = this
    if (that.data.notice.url != '') {
      if (that.data.notice.url[0] != "/") {
        wx.navigateTo({
          url: "/" + that.data.notice.url,
        })
      } else {
        wx.navigateTo({
          url: that.data.notice.url,
        })
      }
    }
  }
})

//////////////////////////////////////////////////////////////////////////////
/**
 * 执行首页课表的刷新
 */
function flushPage(that) {

  if (wx.getStorageSync('doBind') == true) {
    login2Server(that)
    wx.setStorageSync('doBind', false)
  }
  //是否绑定了学号
  var isBinded = wx.getStorageSync('isBinded') || false
  var session = wx.getStorageSync('session') || ''

  if (session == '') return
  if (isBinded == false) return
  that.setData({
    isBinded: isBinded
  })


}

/**
 * 登录到服务器
 */
function login2Server(that) {

  wx.login({
    success: function (res) {
      if (res.code) {
        var code = res.code
        wx.getUserInfo({
          success: function (res) {
            let data = {
              code: code,
              encryptedData: res.encryptedData,
              iv: res.iv,
              signature: res.signature
            }
            request.loadData(that, '/user/checkin', data, function (res) {

              if (res.data.bindInfo == null) {
                //未绑定账号
                wx.setStorageSync('isBinded', false)
              } else {
                wx.setStorageSync('bindInfo', res.data.bindInfo)
                wx.setStorageSync('isBinded', true)
              }

              wx.setStorageSync('session', res.data.session)
              let wStr = ""
              let course = []
              if (res.data.weekth > 20) {
                wStr = "寒暑假期"
                course = []
              } else {
                wStr = "第 " + res.data.weekth + " 周"
                course = res.data.todayCourse
              }
              that.setData({
                weekth: wStr,
                weekthInt: res.data.weekth,
              })
              console.log(res.data.menus)
              that.setData({
                mainMenu: res.data.menus,
                bannerList: res.data.banners,
                notice: res.data.notice,
                cours: course
              })
              flushPage(that)
            })
          },
          fail: function () {
            wx.showModal({
              title: '无法获取到您的身份凭证',
              content: '由于您拒绝了授权，我们无法对您进行身份标识，请依次点击右上角菜单->关于->设置，允许获取用户信息后回到首页下拉刷新。授权后的信息仅用作身份标识，不会查看到您的隐私数据。'
            })
          }
        })
      }
    }
  })
}

function getCPM(that) {
  let param={}
  request.loadData(that, '/admin/getPub/1',param,function(res){
    that.setData({
      CPM:res.data
    })
  })
}



// /*寻宝活动的入口*/
// function treasure(that) {
//   var session = wx.getStorageSync('session') || ''
//   if (session == '') return
//   util.showLoading("加载中...")
//   wx.request({
//     url: 'https://ccsu.notobject.com/ichangda/User/add?openid=' + session,
//     method: "GET",
//     success: function (res) {
//       console.log(res);
//       if (res.data.data == 4) {
//         wx.navigateTo({
//           url: "./../Treasure/wait/wait",
//         })
//       } else if (res.data.data == 3) {
//         wx.navigateTo({
//           url: "./../Treasure/end/end",
//         })
//       } else if (res.data.data == 1) {
//         wx.navigateTo({
//           url: "./../Treasure/answer/answer",
//         })
//       } else if (res.data.data == 2) {
//         wx.navigateTo({
//           url: "./../Treasure/me/me",
//         })
//       } else if (res.data.data == 5) {
//         wx.navigateTo({
//           url: "./../Treasure/convert/convert",
//         })
//       }
//     },
//     fail: function () {
//       util.showModal("提示", "服务器连接失败，请重新加载", false, function () { })
//     },
//     complete: function () {
//       util.hideLoading()
//     }
//   })
// }