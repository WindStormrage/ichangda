
const date = new Date()
var session = null
var app = getApp()
var HOST_URL = app.getHostUrl()
var util = require('../../../utils/util.js')
var request = require('../../../utils/request.js')
Page({
  data: {
    years: [2016, 2017],
    year: date.getFullYear(),
    months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12],
    month: date.getMonth(),
    date: '2016-09',
    ecardInfo: null,
    showModalStatus: false,
    inputPwd: '',
    transactionList: [],
    todayDate: '',
    ecardInfo: null,
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '校园卡'
    })
    var years = []
    years[0] = date.getFullYear() - 1
    years[1] = date.getFullYear()
    this.setData({
      todayDate: util.formatTime(date),
      years: years,
      date: util.formatDateToYearAndMonth2(date)
    })
    session = options.session

    loadEcardInfo(this)
    loadTransaction(this, null, null)

  },
  onShow: function () {

  },
  onPullDownRefresh: function () {


  },
  bindDateChange: function (e) {

    var year = e.detail.value.split('-')[0]
    var month = e.detail.value.split('-')[1]

    loadTransaction(this, year, month)
    this.setData({
      todayDate: e.detail.value,
      date: e.detail.value
    })
  },
  reportLoss: function (e) {

    if (this.data.ecardInfo.status == '挂失卡') {
      wx.showModal({
        title: '不支持的操作',
        content: '暂时还不支持解挂操作,请自行前往圈存机解除挂失.',
        showCancel: false
      })
      return
    }
    var currentStatu = e.currentTarget.dataset.statu;
    if (currentStatu == 'ok') {
      reportloss(this)
    }
    this.util(currentStatu)
  },
  util: function (currentStatu) {

    //收起键盘
    if (currentStatu == "close") {
      wx.hideKeyboard()
    }
    /* 动画部分 */
    // 第1步：创建动画实例 
    var animation = wx.createAnimation({
      duration: 200, //动画时长 
      timingFunction: "linear", //线性 
      delay: 0 //0则不延迟 
    })
    // 第2步：这个动画实例赋给当前的动画实例 
    this.animation = animation;

    // 第3步：执行第一组动画 
    animation.opacity(0).rotateX(-100).step();

    // 第4步：导出动画对象赋给数据对象储存 
    this.setData({
      animationData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画 
    setTimeout(function () {
      // 执行第二组动画 
      animation.opacity(1).rotateX(0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象 
      this.setData({
        animationData: animation
      })

      //关闭 
      if (currentStatu == "ok" || currentStatu == "close") {
        this.setData(
          {
            showModalStatus: false
          }
        );
      }
    }.bind(this), 200)

    // 显示 
    if (currentStatu == "open") {
      this.setData(
        {
          showModalStatus: true
        }
      );
    }
  },
  bindblur: function (e) {
      console.log(e.detail.value)
    this.setData({
      inputPwd: e.detail.value
    })
  },
  bindinput: function (e) {
      console.log(e.detail.value)
      this.setData({
          inputPwd: e.detail.value
      })
  },
  bindconfirm: function (e) {
      console.log(e.detail.value)
      this.setData({
          inputPwd: e.detail.value
      })
  },
})


function loadEcardInfo(that) {
  request.loadData(that, "/ecard/info", { openid: session }, function (res) {
    that.setData({
      ecardInfo: res.data
    })
  })
}
function loadTransaction(that, year, month) {

  var session = wx.getStorageSync('session')
  var data = {}
  data.openid = session
  /**
       * 如果参数中不带年和月 则得到的是今日交易流水,
       * 否则就是制定年月的交易流水
       */
  if (year != null && month != null) {
    data.year = year
    data.month = month
  }
  request.loadData(that, "/ecard/transaction", data, function (res) {
    that.setData({
      transactionList: res.data
    })
  })
}
function reportloss(that) {
  console.log(that.data.inputPwd)
  var data = {
    accNum: that.data.ecardInfo.accNum,
    password: that.data.inputPwd, //为安全考虑,该交易密码只能由用户输入得到
    openid: wx.getStorageSync('session'),
  }
  request.loadData(that, "/ecard/loss", data, function (res) {
    wx.showToast({
      title: '挂失成功'
    })
    setTimeout(function () {
      wx.hideToast()
      loadEcardInfo(that)
    }, 1500)
  })
}