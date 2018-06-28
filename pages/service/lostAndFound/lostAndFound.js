
var request = require('../../../utils/request.js')
Page({
  data: {
    /**
        * 页面配置
        */
    winWidth: 0,
    winHeight: 0,
    // tab切换
    currentTab: 0,
    uploadImageList: [],
    lostList: [],
    foundList: [],
    currentClassification_lost: 'all',
    currentClassification_found: 'all',
    classificationArray: [
      {
        id: 0,
        classification: 'all',
        name: '全 部'
      },
      {
        id: 1,
        classification: 'ecard',
        name: '校园卡'
      },
      {
        id: 2,
        classification: 'wallet',
        name: '钱 包'
      },
      {
        id: 3,
        classification: 'keys',
        name: '钥 匙'
      },
      {
        id: 4,
        classification: 'device',
        name: '电子产品'
      },
      {
        id: 5,
        classification: 'idcard',
        name: '身份证'
      },
      {
        id: 6,
        classification: 'bcard',
        name: '银行卡'
      },
      {
        id: 7,
        classification: 'others',
        name: '其 他'
      }
    ],
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '失物招领'
    })
    var that = this;

    /**
     * 获取系统信息
     */
    wx.getSystemInfo({

      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });

  },
  /**
     * 滑动切换tab
     */
  bindChange: function (e) {

    var that = this;
    that.setData({ currentTab: e.detail.current });
    //加载失物或召领列表的全部分类数据
    loadData(this, e.detail.current, "all")
  },
  /**
   * 点击tab切换
   */
  swichNav: function (e) {

    var that = this;

    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  onShow: function () {
    if (this.data.currentTab == 0) {
      loadData(this, this.data.currentTab, this.data.currentClassification_lost)
    } else {
      loadData(this, this.data.currentTab, this.data.currentClassification_found)
    }

  },
  onPullDownRefresh: function () {
    // 页面相关事件处理函数--监听用户下拉动作

  },
  onReachBottom: function () {
    // 页面上拉触底事件的处理函数

  },
  onItemClick: function (e) {
    //得到点击的项目id  ,该id 唯一标识一个失物招领信息
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/service/lostAndFound/detail/detail?id=' + id
    })
  },
  onBxClick: function (e) {
    var mid = e.target.id
    wx.navigateTo({
      url: './addMsg/addMsg'
    })
  },
  onSelectClass: function (e) {
    console.log(e.currentTarget.dataset.classification)
    if (this.data.currentTab == 0) {
      this.setData({
        currentClassification_lost: e.currentTarget.dataset.classification
      })
    } else {
      this.setData({
        currentClassification_found: e.currentTarget.dataset.classification
      })
    }
    loadData(this, this.data.currentTab, e.currentTarget.dataset.classification)
  }
})

/**
 *  加载失物招领数据
 *  type  0:失物  1:召领
 *  classification  all,ecard,wallet,keys,device,idcard,bcard,others
 */
function loadData(that, type, classification) {
  var param = {
    openid: wx.getStorageSync('session'),
    type: type,
    classification: classification,
  }
  request.loadData(that, '/lostAndFound/list', param, function (res) {
    console.log(res)
    var list = res.data
    var util = require('../../../utils/util.js')
    var app = getApp()
    var HOST_URL = app.getHostUrl()
    for (var i = 0; i < list.length; i++) {
      var obj = list[i]
      obj.createdate = util.getMonthAndDay(new Date(obj.createDate))
      if (obj.images != null && obj.images != '')
        obj.images = obj.images.split(";")[0]
      else
          obj.images = HOST_URL + '/images/default/lostandfound_default.png'
      list[i] = obj
    }
    if (type == 0) {
      console.log(that.data.winHeight);
      that.setData({
        lostList: list,
        winHeight: 160 + 200 * list.length
      })
    } else if (type == 1) {
      that.setData({
        foundList: list,
        winHeight: 160 + 200 * list.length
      })
    }
  })
}