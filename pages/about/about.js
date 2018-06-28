
var util = require('../../utils/util.js')
var request = require('../../utils/request.js')
var app = getApp()
var HOST_URL = app.getHostUrl()

Page({
    data: {
    },
    onLoad: function (options) {
        // 生命周期函数--监听页面加载
        wx.setNavigationBarTitle({
            title: '关于',
        })
    },
    onReady: function () {
        // 生命周期函数--监听页面初次渲染完成

    },
    onShow: function () {
        // 生命周期函数--监听页面显示

    },
    onHide: function () {
        // 生命周期函数--监听页面隐藏

    },
    onUnload: function () {
        // 生命周期函数--监听页面卸载

    },
    onPullDownRefresh: function () {
        // 页面相关事件处理函数--监听用户下拉动作

    },
    onReachBottom: function () {
        // 页面上拉触底事件的处理函数

    },
    onShareAppMessage: function () {
        // 用户点击右上角分享
        return {
            title: 'title', // 分享标题
            desc: 'desc', // 分享描述
            path: 'path' // 分享路径
        }
    },
    copy:function(e){
        wx.setClipboardData({
            data: '109974529',
        })
        wx.showToast({
            title: '已复制到剪贴板',
            icon: 'success',
            duration: 1000
        })
    },
    bingo: function () {
      wx.navigateTo({
        url: '../Treasure/me/me'
      })
    },
   free: function () {
     wx.navigateTo({
       url: '../service/freeClass/myGroupings/myGroupings'
     })
    }
})



// /*寻宝活动的入口*/
// function treasure (that) {
//   var session = wx.getStorageSync('session') || ''
//   if (session == '') return
//     util.showLoading("加载中...")
//     wx.request({
//         url: 'https://ccsu.notobject.com/ichangda/User/add?openid='+session,
//         method: "GET",
//         success: function (res) {
//           console.log(res);
//           if(res.data.data == 4){
//             wx.navigateTo({
//               url: "./../Treasure/wait/wait",
//             })
//           }else if(res.data.data == 3){
//             wx.navigateTo({
//               url: "./../Treasure/end/end",
//             })
//           }else if(res.data.data == 1){
//             wx.navigateTo({
//               url: "./../Treasure/answer/answer",
//             })
//           }else if(res.data.data == 2){
//             wx.navigateTo({
//               url: "./../Treasure/me/me",
//             })
//           }else if(res.data.data == 5){
//             wx.navigateTo({
//               url: "./../Treasure/convert/convert",
//             })
//           }
//         },
//         fail: function () {
//           util.showModal("提示", "服务器连接失败，请重新加载", false, function () {})
//         },
//         complete: function () {
//           util.hideLoading()
//         }
//     })
// }