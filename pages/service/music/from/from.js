var request = require('../../../../utils/request.js')

var app = getApp()
var HOST_URL = app.getHostUrl()
Page({
  data: {
    radio: [
      {name: '1', value: '友谊'},
      {name: '2', value: '爱情'},
      {name: '3', value: '祝福'},
      {name: '4', value: '青春'},
      {name: '5', value: '感恩'},
      {name: '6', value: '怀旧'},
    ],
    form: {
      musicname: '',
      songer: '',
      lrc: '',
      words: '',
      reason: '',
      type: 0,
      mid: 0,
      openid: ''
    },
    mid:0
  },
  /*
  radioChange: function(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    let form = this.data.form;
    form.type = e.detail.value
    this.setData({
      form : form
    })
    console.log(this.data.form)
  },
  */
  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '点歌台'
    })
    this.setData({
      mid : options.mid
    })
  },
  formSubmit: function(e) {
    let form = e.detail.value;
    form.openid = wx.getStorageSync('session');
    form.mid = this.data.mid;
    form.formId = e.detail.formId;
    console.log(form);
    this.setData({
      form: form
    })

    if (this.data.form.musicname == "" || this.data.form.songer == "" || this.data.form.type == undefined || this.data.form.reason == "") {
      wx.showToast({
        title: "请填写完整！",
        image: '/images/msg.png'
      })
    }else{
      request.loadData(this, "/music/add", form, function (res) {
        wx.showToast({
          title: '点歌成功！',
          icon: 'success',
          duration: 2000
        })
        setTimeout(function(){
          wx.redirectTo({
            url: '/pages/service/music/main/main?umid=' + res.data,
          })
        },1000)
      })
      // 提交成功后获取id
    }/*
    wx.request({
      url: 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=etpJEreYIVQcuZbLXhRcBdmEs9o7ozrIBM4_SCtKGVfoMV-F3glfWLAdOUENsX1jgnWEt9fSJlhYHR0L71hi6ZLJeU_ofxVlIfqMGrBYMctHyoT7nDytSOxPMLDN4nDJCOReAHAFRU',
      method: "POST",
      data: {
        "touser": "oyP0Z0Tu3fd87kexrkazj3I1p9zo",
        "template_id": "h7LUgspy9_HtS2zo1A0dWzG_3vby14qDMrwkiTrj7ys",
        "page": "index",
        "form_id": "1512814647857",
        "data": {
            "keyword1": {
              "value": "339208499",
              "color": "#173177"
            },
            "keyword2": {
                "value": "2015年01月05日 12:30",
                "color" : "red"
            },
            "keyword3": {
                "value": "粤海喜来登酒店"
            } ,
            "keyword4": {
                "value": "广州市天河区天河路208号"
            }
        },
        "emphasis_keyword": "keyword1.DATA"
      },
      success: function(res) {
        console.log(res.data)
      }
    })*/
  },
  /*
  input1: function (e) {
    let form = this.data.form;
    form.musicname = e.detail.value
    this.setData({
      form: form
    })
  },
  input2: function (e) {
    let form = this.data.form;
    form.songer = e.detail.value
    this.setData({
      form: form
    })
  },
  input3: function (e) {
    let form = this.data.form;
    form.lrc = e.detail.value
    this.setData({
      form: form
    })
  },
  input4: function (e) {
    let form = this.data.form;
    form.words = e.detail.value
    this.setData({
      form: form
    })
  },
  input5: function (e) {
    let form = this.data.form;
    form.reason = e.detail.value
    this.setData({
      form: form
    })
  },
  */
  submit: function (){
    if (this.data.form.musicname == "" || this.data.form.songer == "" || this.data.form.type == undefined || this.data.form.reason == "") {
      console.log("清填满！");
      wx.showToast({
        title: "请填写完整！",
        image: '/images/msg.png'
      })
    }else{
      request.loadData(this, "/music/add", form, function (res) {
        wx.showToast({
          title: '点歌成功！',
          icon: 'success',
          duration: 2000
        })
        setTimeout(function(){
          wx.redirectTo({
            url: '/pages/service/music/main/main?umid=' + res.data,
          })
        },1000)
      })
      // 提交成功后获取id
    }
  }
})
