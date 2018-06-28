var app = getApp();
var HOST_URL = app.getHostUrl();
var util = require('../../../../utils/util.js');
var request = require('../../../../utils/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '2017-09-01',
    uploadImageList: [],
    form: {
      phase: "",
      pic: "",
      lineTime: "",
      tips: ""
    },
    power: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '点歌台管理'
    })
    this.setData({
      power: options.power
    })
  },
  input1: function (e) {
    let form = this.data.form;
    form.phase = e.detail.value
    this.setData({
      form: form
    })
  },
  input2: function (e) {
    let form = this.data.form;
    form.tips = e.detail.value
    this.setData({
      form: form
    })
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
    let form = this.data.form;
    form.lineTime = e.detail.value.replace(/-/g, "/")
    this.setData({
      form: form
    })
  },

  submit: function () {
    let form = this.data.form;
    form.pic = this.data.uploadImageList[0]
    this.setData({
      form: form
    })
    console.log(this.data.form)
    if (this.data.form.phase == "" || this.data.form.pic == "" || this.data.form.lineTime == "" || this.data.form.tips == "") {
      console.log("清填满！");
      wx.showToast({
        title: "请填写完整！",
        image: '/images/msg.png'
      })
    } else {
      request.loadData(this, "/music/newPhase", form, function (res) {
        wx.showToast({
          title: '提交成功！',
          icon: 'success',
          duration: 2000
        })
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
        }, 1000)
      })
    }
  },

  onClickImage: function (e) {
    var id = parseInt(e.target.id)
    var that = this
    wx.showActionSheet({
      itemList: ['移除', '查看'],
      success: function (res) {
        if (res.tapIndex == 0) {
          var newList = that.data.uploadImageList
          newList.splice(id, 1)
          that.setData({
            uploadImageList: newList
          })
        } else if (res.tapIndex == 1) {
          wx.previewImage({
            //current: ,
            urls: [that.data.uploadImageList[id]],
            success: function (res) {
              console.log(res)
            }
          })
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
    return
  },

  addImage: function (e) {
    var that = this
    var fileNames = []
    if (that.data.uploadImageList.length >= 1) {
      return
    }
    wx.chooseImage({
      count: 1, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        console.log(res);
        for (var item in res.tempFilePaths) {
          var fileName = uploadImage(that, res.tempFilePaths[item])
        }
      }
    })
  },
})


function uploadImage(that, file) {
  var newList = that.data.uploadImageList
  wx.uploadFile({
    url: HOST_URL + '/upload',
    filePath: file,
    name: 'file',
    success: function (res) {
      var res = JSON.parse(res.data)
      console.log(res)
      if (res.errcode == 1) {
        var yearAndMonth = util.formatDateToYearAndMonth(new Date())
        var filePath = HOST_URL + '/uploads/' + yearAndMonth + "/" + res.data
        newList.push(filePath)
      }
      that.setData({
        uploadImageList: newList
      })
    }
  })
}