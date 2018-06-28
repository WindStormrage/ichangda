var app = getApp()
var HOST_URL = app.getHostUrl()
Page({
  data: {
    data: [],
    week: ["周一", "周二", "周三", "周四", "周五"],
    whweek: [
      { txt: "1", select: false },
      { txt: "2", select: false },
      { txt: "3", select: false },
      { txt: "4", select: false },
      { txt: "5", select: false },
      { txt: "6", select: false },
      { txt: "7", select: false },
      { txt: "8", select: false },
      { txt: "9", select: false },
      { txt: "10", select: false },
      { txt: "11", select: false },
      { txt: "12", select: false },
      { txt: "13", select: false },
      { txt: "14", select: false },
      { txt: "15", select: false },
      { txt: "16", select: false },
      { txt: "17", select: false },
      { txt: "18", select: false },
      { txt: "19", select: false },
      { txt: "20", select: false }],
    weekday: 5,
    weekth: 0,
    staticAll: 0,//当前是否为全部课表
    data: [],
    showModalStatus: false,
    //日历
    time: []
  },
  onLoad: function (options) {
    var stuNo = options.stuNo;
    console.log("------------" + "stuNos" + "----------------");
    console.log(stuNo);
    var members = [];
    if (stuNo) {
      stuNo = stuNo.split(",");
      for (var i = 0; i < stuNo.length; i++) {
        members.push({ "memberJwcAccount": stuNo[i] });
      }
    }
    this.setData({
      members: members
    })
    wx.setNavigationBarTitle({
      title: 'i长大-空闲课表'
    })
    var that = this;
    if (options.weekth) {
      var weekth = options.weekth;
      var data = {
        week: weekth,
        members: members
      }
      that.setData({
        weekth: weekth,
      })
      getOpenTime(that, weekth, weekth);
      var tmpScroll = this.data.whweek
      for (var i = 0; i < tmpScroll.length; i++) {
        tmpScroll[i].select = false
      }
      tmpScroll[weekth - 1].select = !tmpScroll[weekth - 1].select;
      this.setData({
        whweek: tmpScroll
      });
    }
    console.log("-----week-------");
    console.log(this.data.weekth);
    loadData(that, "getNoCourse", data);
    wx.setNavigationBarTitle({
      title: "本周空闲课表"
    })
  },

  whweekTap: function (event) {
    var index = parseInt(event.currentTarget.dataset.whweek);

    var data = {
      week: index,
      members: this.data.members
    }
    loadData(this, "getNoCourse", data)
    wx.setNavigationBarTitle({
      title: "第" + index + "周"
    })
    var tmpScroll = this.data.whweek
    for (var i = 0; i < tmpScroll.length; i++) {
      tmpScroll[i].select = false
    }
    tmpScroll[index - 1].select = !tmpScroll[index - 1].select;
    this.setData({
      whweek: tmpScroll
    });
    getOpenTime(this, this.data.weekth, index)
  },

  allClassTap: function (event) {
    wx.showModal({
      title: '提示',
      content: '暂无全部空闲课表功能',
    })
    // wx.setNavigationBarTitle({
    //   title: '总空闲课表'
    // })
    // var data = {
    //   weekth: -1,
    //   stuNo: this.data.stuNo
    // }
    // loadData(this, "allfree", data)
  },

})

function loadData(that, type, data, callback) {
  var session = wx.getStorageSync('session');
  switch (type) {
    case 'build':
      var param = {
        groupName: data.groupName,
        members: data.members,
        openid: session
      }
      break;
    case 'getNoCourse':
      var param = {
        week: data.week,
        members: data.members,
        openid: session
      }
      break;
  }
  ownloadData(this, '/NoCourse/' + type, param, function (res) {
    if(!res.data){
      wx.redirectTo({
        url: '../seek/seek?weekth=' + data.week,
      })
    }
    that.setData({
      data: res.data,
    })
  })
}




function ownloadData(that, url, param, callback) {

  log("[DEBUG] http begin----------------------------------------------")
  // log("[DEBUG] action = " + action)
  // log("[DEBUG] url = " + HOST_URL + '/weccsu/' + action + '.action')
  log("[DEBUG] param ->")
  log(param)
  log("[DEBUG] 建立网络请求...[" + url + "]")
  showLoading("加载中")
  wx.request({
    //HOST_URL + '/weccsu/' + action + '.action',
    url: HOST_URL + url,
    data: param,
    method: "POST",
    success: function (res) {
      log("[DEBUG] request success.... statusCode =" + res.statusCode)
      log("[DEBUG] request success.... errMsg     = " + res.errMsg)
      //hideLoading() 放这里是为了兼容有些页面需要显示提示Toast
      hideLoading()
      console.log(res)
      if (res.statusCode == 200) {
        if (res.data.errcode == 1) {
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
          callback(res.data)
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
        //content: '无法连接到服务器！'
        content: '由于服务器正在维护中，i长大暂时无法访问，如给您带来不便敬请谅解！'
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

//渲染日历
function getOpenTime(that, weekth, click_weekth) {
  var myDate = new Date();
  //获得现在这刻的时间戳
  var now_time = myDate.getTime();
  //获得当前周几
  var week = myDate.getDay();
  //算出本周周一的时间戳//等于0就减去六天不等于0就减去当前天减一天
  var now_Monday = now_time - (week == 0 ? 6 : (week - 1)) * 86400000;
  //算出点击周的周一的时间戳
  var click_Monday = now_Monday + (click_weekth - weekth) * 604800000;
  var time = [];
  //当前月份
  time[0] = new Date(click_Monday).getMonth() + 1;
  //当前日
  for (let i = 1; i <= 7; i++) {
    time[i] = new Date(click_Monday + (i - 1) * 86400000).getDate();
  }
  console.log(time)
  that.setData({
    time: time
  })
}