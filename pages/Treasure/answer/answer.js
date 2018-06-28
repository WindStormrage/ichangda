// pages/Treasure/answer/answer.js
var util = require('../../../utils/util.js')
var request = require('../../../utils/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: [
      { title: '长沙学院官方微信平台的小程序叫什么？', a: 'i长大', b: 'Yo长大', c: 'Hi长大', d: 'We长大', trues: 'A'},
      {title: '', a: '', b: '', c: '', d: '', trues: ''},
      {title: '', a: '', b: '', c: '', d: '', trues: ''},
      {title: '', a: '', b: '', c: '', d: '', trues: ''},
      {title: '', a: '', b: '', c: '', d: '', trues: ''}
    ],
    i: 0,//当前第几题
    g: 0,//总分
    next: 0,
    good: 0,
    click: [0,0],
    now: -1,//更改当前点击页面
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '微寻者'
    })
    load(this);
  },

  choose: function (e) {
    //防止一个页面点击多次
    if (this.data.now == this.data.i) return

    //判断点击的地方和正确的地方
    var click = [];
    click[0] = e.currentTarget.id;
    click[1] = this.data.data[this.data.i].trues;

    this.setData({
      good: this.data.data[this.data.i].trues,
      click: click,
      now : this.data.i
    })

    //如果正确
    if (e.currentTarget.id == this.data.data[this.data.i].trues) {
      this.setData({
        g: this.data.g+1
      })
    };

    //在前四个点击就会出现下一题
    if (this.data.i < 4) {
      this.setData({
        next: 1
      })
    };
    //在最后一个点击会出现完成
    if(this.data.i == 4){
      this.setData({
        next: 2
      })
    }
  },
  //点击下一题
  next: function () {
    this.setData({
      i: this.data.i+1,
      next: 0,
      good: 0,
      click: []
    })
  },
  //点击完成
  finnish: function () {
    var session = wx.getStorageSync('session') || ''
    var that = this;
    if (session == '') return
    util.showLoading("加载中...")
    wx.request({
      url: 'https://ccsu.notobject.com/ichangda/cline/firstQuery?openid='+session+'&questionNum='+that.data.g,
      method: "GET",
      success: function (res) {
        if (res.data.data != 2) {    
           util.showModal("提示", '恭喜你，答对了' + that.data.g + '道题，获得了' + that.data.g +'条线索！如果感觉线索不够或线索难度太大也不要放弃！  微寻者是可以和同学、室友共享线索的！', false, function () {
            wx.redirectTo({
              url: '../me/me'
            })
          })
        }else{
          util.showModal("提示", "您已提交题目完成", false, function () {
            wx.redirectTo({
              url: '../me/me'
            })
          })
        }
      },
      fail: function () {
        util.showModal("提示", "服务器连接失败，请重新提交", false, function () {})
      },
      complete: function () {
        util.hideLoading()
      }
    })

  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})

function load (that) {
  var session = wx.getStorageSync('session') || ''
  if (session == '') return
  util.showLoading("加载中...")
  wx.request({
      url: 'https://ccsu.notobject.com/ichangda/question/Query?openid='+session,
      method: "GET",
      success: function (res) {
        if (res.data.data != 2) {
          console.log(res);
          that.setData({
            data:res.data.data
          })
        }else if(res.data.data == 2){
          util.showModal("提示", "您已答过题，无需再答题", false, function () {
            wx.reLaunch({
              url: './../../index/index'
            })
          })
        }
      },
      fail: function () {
        util.showModal("提示", "服务器连接失败，请重新进入", false, function () {
          wx.reLaunch({
            url: './../../index/index'
          })
        })
      },
      complete: function () {
        util.hideLoading()
      }
  })
}
