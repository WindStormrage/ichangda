var util = require('../../utils/util.js')
var request = require('../../utils/request.js')
var app = getApp()
var HOST_URL = app.getHostUrl()
Page({
  data: {
    currentTab: "tabMenu-activity",
    currentType: "hdhb",
    newsList: []
  },
  onShow: function () {
    var newsList = wx.getStorageSync('newsList')
    if (newsList == '') {
      util.showLoading("加载新闻列表")
      loadNews(this)
      console.log("没有缓存--加载新闻")
    } else {
      var nowTime  = Date.parse(new Date());
      var newsCacheTime = wx.getStorageSync('newsCacheTime')
      if ((nowTime - newsCacheTime) >= 30 * 60 * 1000) {
        util.showLoading("加载新闻列表")
        loadNews(this)
        console.log("缓存过期--加载新闻")
      } else {

        this.setData({
          newsList: newsList,
        })
      }
    }
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '校讯'
    })
  },
  onTabSelected: function (e) {
    var id = e.currentTarget.id
    this.setData({
      currentType: id
    })
  },
  onItemClick: function (e) {
    var id = e.currentTarget.id;
    wx.navigateTo({
      url: "../article/article?id=" + id
    })
  },
  onPullDownRefresh: function() {
    loadNews(this)
  },
})

function loadNews(that) {

    request.loadData(that,'/news/list',{},function(res){
        if(res.data == null){
            // 服务器没获取到新闻
        }else{
            console.log(res)
            for (var i = 0; i < res.data.length; i++) {
                var item = res.data[i]
                item.date = util.getMonthAndDay(new Date(item.date))
            }
            that.setData({
                newsList: res.data,
            })
            wx.setStorageSync('newsCacheTime', Date.parse(new Date()))
            wx.setStorageSync('newsList', res.data)
        }
    })
}
