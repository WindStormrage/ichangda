var app = getApp()
var HOST_URL = app.getHostUrl()
var util = require('../../../../utils/util.js')
var request = require('../../../../utils/request.js')
Page({
  data: {
    uploadImageList: [],
    items: [
      { name: '0', value: '寻物', checked: 'true' },
      { name: '1', value: '寻主' }
    ],
    array: ['全部', '校园卡', '钱包', '钥匙', '电子产品', '身份证', '银行卡', '其他'],
    arrayEn: ['all', 'ecard', 'wallet', 'keys', 'device', 'idcard', 'bcard', 'others'],
    objectArray: [
      {
        id: 0,
        name: '全 部'
      },
      {
        id: 1,
        name: '校园卡'
      },
      {
        id: 2,
        name: '钱 包'
      },
      {
        id: 3,
        name: '钥 匙'
      },
      {
        id: 4,
        name: '电子产品'
      },
      {
        id: 5,
        name: '身份证'
      },
      {
        id: 6,
        name: '银行卡'
      },
      {
        id: 7,
        name: '其 他'
      }
    ],
    index: 0
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '添加失物招领'
    })
  },
  onshow: function () {

  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
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
    console.log("777");
    if (that.data.uploadImageList.length >= 3) {
      return
    }
    console.log("8888");
    wx.chooseImage({
      count: 3 - that.data.uploadImageList.length, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        console.log(res);
        for (var item in res.tempFilePaths) {
          var fileName = uploadImage(that, res.tempFilePaths[item])
        }
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  onSubmit: function (e) {
    // console.log(e.detail.value)
    var data = e.detail.value
    if (data.name == '') {
      return
    }
    if (data.description == '') {
      return
    }
    if (data.location == '') {
      return
    }
    if (data.qq == '') {
      return
    }
    if (data.phone == '') {
      return
    }
    data.images = this.data.uploadImageList.join(";")
    data.openid = wx.getStorageSync('session')
    data.classification = this.data.arrayEn[data.classification]
    uploadData(this, data)
  }
})

/**
 * 上传一张图片
 * 成功后会将图片路径添加至uploadImageList
 *
 */
function uploadImage(that, file) {
  var newList = that.data.uploadImageList
//   console.log("666");
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
    },
    fail: function () {

    },
    complete: function () {

    }
  })
}
/**
 * data 要上传的数据,具体如下
    data.openid          用户会话
    data.type             类型 0:失物  1:召领
    data.name             物品名称
    data.description      物品描述
    data.location         丢失地点
    data.classification   物品分类(all,ecard,wallet,keys,device,idcard,bcard,others)
    data.qq               qq
    data.phone            手机号码
    data.images           上传图片后得到的图片路径(多个图片之间用英文分号分隔)
 */
function uploadData(that, data) {
  console.log(data)



  request.loadData(that, "/lostAndFound/create", data, function (res) {
    wx.showModal({
      title: '提示',
      content: '已经提交至管理员审核',
      success: function (res) {
        wx.navigateBack({
          delta: 1
        })
      }
    })
  })
}
