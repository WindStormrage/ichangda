var util = require('../../../utils/util.js')
var request = require('../../../utils/request.js')
var app = getApp()
var HOST_URL = app.getHostUrl()
Page({
  data: {
    //header
    title: "本周课表",
    actionSheetItems: [
      { bindtap: "Menu01", txt: '全部课表' },
      { bindtap: "Menu2", txt: '本周课表' },
      { bindtap: "Menu4", txt: '更新课表' }],
    actionSheetHidden: true,//是否被隐藏
    //choose
    scrollLeft: 0,
    scroll: [
      { txt: "1", background: "#81D6F5" },
      { txt: "2", background: "#81D6F5" },
      { txt: "3", background: "#81D6F5" },
      { txt: "4", background: "#81D6F5" },
      { txt: "5", background: "#81D6F5" },
      { txt: "6", background: "#81D6F5" },
      { txt: "7", background: "#81D6F5" },
      { txt: "8", background: "#81D6F5" },
      { txt: "9", background: "#81D6F5" },
      { txt: "10", background: "#81D6F5" },
      { txt: "11", background: "#81D6F5" },
      { txt: "12", background: "#81D6F5" },
      { txt: "13", background: "#81D6F5" },
      { txt: "14", background: "#81D6F5" },
      { txt: "15", background: "#81D6F5" },
      { txt: "16", background: "#81D6F5" },
      { txt: "17", background: "#81D6F5" },
      { txt: "18", background: "#81D6F5" },
      { txt: "19", background: "#81D6F5" },
      { txt: "20", background: "#81D6F5" }],
    //table
    week: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
    day: ["1-2", "3-4", "5-6", "7-8", "9-10"],
    data: [],
    weekth: 0,
    staticAll: 0,//当前是否为全部课表
    //日历
    time: ['1', '1', '1', '1', '1', '1', '1', '1']
  },
  // 生命周期函数--监听页面加载
  onLoad: function (options) {

    wx.setNavigationBarTitle({
      title: '我的课表'
    })
    //页面加载的时候就向服务器请求数据

    let that = this
    if (options.weekth) {
      var weekth = options.weekth
      that.setData({
        weekth: weekth
      })
      console.log(this.data.weekth + "------------");
      loadData(that, "week", weekth)
      setTitle(that, "本周课表")
      setScrollLeft(that, weekth)
      getOpenTime(that, weekth, weekth);
    } else {
      loadData(that, "all", -1)
      setTitle(that, "全部")
    }
  },
  //点击取消触发事件
  listenerActionSheet: function () {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  //点击打开选择栏
  listenerButton: function () {
    this.setData({
      //取反
      actionSheetHidden: !this.data.actionSheetHidden
    });
  },
  //选择选择栏里面的选项切换title和触发ajax
  listenerMenu01: function () {
    setTitle(this, "全部课表")
    var weekth = this.data.weekth
    loadData(this, "all", -1)
    setScrollLeft(this, -1)
  },
  listenerMenu1: function () {

    wx.navigateTo({
      url: 'all/all',
    })
    // setTitle(this, "全部课表")
    // var weekth = this.data.weekth
    // loadData(this, "all", -1)
    // setScrollLeft(this, -1)
  },
  listenerMenu2: function () {

    console.log(this.data.weekth + "**********");
    setTitle(this, "本周课表")
    var weekth = this.data.weekth
    loadData(this, "week", weekth)
    setScrollLeft(this, weekth)
  },
  listenerMenu3: function () {

    setTitle(this, "下周课表")
    var weekth = this.data.weekth
    loadData(this, "week", weekth + 1)
    setScrollLeft(this, weekth + 1)
  },
  listenerMenu4: function () {

    setTitle(this, "全部课表")
    var weekth = this.data.weekth
    loadData(this, "update", -1)
    setScrollLeft(this, -1)
  },

  getWeekCourse: function (e) {

    var index = parseInt(e.target.id.split(":")[1])
    loadData(this, "week", (index + 1))
    setScrollLeft(this, index + 1)
    setTitle(this, "第" + (index + 1) + "周")
    getOpenTime(this, this.data.weekth, index + 1)
  },
  onCourseClick: function (e) {
    var index = parseInt(e.target.id.split(":")[1])
    var content = ""
    var currentItem = this.data.data[index]
    content += currentItem.subjectname + "\n"
    content += currentItem.classname + "\n"
    content += currentItem.weekstr + "周\n"
    content += currentItem.teacher + "\n"
    content += currentItem.location + "\n"
    wx.showModal({
      title: '课程详情',
      content: content
    })

  },
  onPullDownRefresh: function () {

    let weekth = this.data.weekth
    if (weekth == 0) {
      setTitle(this, "全部课表")
      loadData(this, "all", -1)
    } else {
      setTitle(this, "第" + weekth + "周")
      loadData(this, "week", weekth)
      setScrollLeft(this, weekth)
    }
  },
})
function loadData(that, type, data, callback) {
  var session = wx.getStorageSync('session');
  var param = {
    data: data,
    openid: session
  }
  request.loadData(this, '/course/' + type, param, function (res) {
    console.log(res)
    if (type == 'update') {
      wx.showModal({
        showCancel: false,
        confirmText: '知道了',
        content: '更新成功',
      })
      setTimeout(function () {
        loadData(that, "all", -1)
      }, 1500)
    } else {
      that.setData({
        data: res.data,
      })
      if (type == 'week') {
        that.setData({
          staticAll: 0,
        })
        setScrollLeft(that, data)
      } else if (type == 'all') {
        that.setData({
          staticAll: 1,
        })
      }
    }
  })
}

function setTitle(that, title) {
  that.setData({
    actionSheetHidden: "ture",
    title: title
  })
}

function setScrollLeft(that, weekth) {
  try {
    var res = wx.getSystemInfoSync()
    var offset = 104 * res.windowWidth / 750

    var tmpScroll = that.data.scroll
    for (var i = 0; i < tmpScroll.length; i++) {
      tmpScroll[i].background = '#81D6F5'
    }
    if (weekth !== -1) {
      tmpScroll[weekth - 1].background = '#3EC0EF'
    }
    that.setData({
      scroll: tmpScroll,
      scrollLeft: (weekth - 1) * offset - 106
    })
    tmpScroll[weekth - 1].background = '#3EC0EF'
    that.setData({
      scroll: tmpScroll,
      scrollLeft: (weekth - 1) * offset - 106
    })
  } catch (e) {
    // Do something when catch error
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
  var now_Monday = now_time - ( week==0? 6 : (week-1) ) * 86400000;
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