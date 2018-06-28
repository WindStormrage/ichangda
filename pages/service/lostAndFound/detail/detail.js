
var util = require('../../../../utils/util.js')
var request = require('../../../../utils/request.js')
Page({
    data: {
        id: -1,
        lostAndFound: null,
        wxInfo: null,
        winHeight: 0,
        winWidth: 0,
        imageList: []
    },
    onLoad: function (options) {
        var that = this
        this.setData({
            id: options.id
        })
        loadDetail(this, options.id)

        wx.getSystemInfo({

            success: function (res) {
                that.setData({
                    winWidth: res.windowWidth,
                    winHeight: res.windowHeight
                });
            }
        });
    },
    onShow: function () {},
    onPullDownRefresh: function () {},
    onShareAppMessage: function () {
        var that = this
        return {
            title: "[失物招领]" + that.data.lostAndFound.name, // 分享标题
            desc: that.data.lostAndFound.description, // 分享描述
            path: '/pages/service/lostAndFound/detail/detail?id=' + that.data.id // 分享路径
        }
    },
    callPhone: function (e) {
        var that = this
        wx.makePhoneCall({
            phoneNumber: that.data.lostAndFound.phone,
            success: function (res) {

            }
        })
    },
    copyQQ: function (e) {
        var that = this
        wx.setClipboardData({
            data: that.data.lostAndFound.qq,
            success: function (res) {
                wx.showToast({
                    title: 'QQ号复制成功',
                    icon: 'success',
                    duration: 1500
                })
            }
        })
    }
})

function loadDetail(that, id) {
    var app = getApp()
    var HOST_URL = app.getHostUrl()
    var param = {
        id: id
    }
    request.loadData(that, '/lostAndFound/detail', param, function (res) {
        console.log(res)
        var lostAndFound = res.data.lostAndFound
        lostAndFound.createdate = util.formatTime(new Date(lostAndFound.createdate))
        if (lostAndFound.images != null && lostAndFound.images != '') {
            lostAndFound.imageList = lostAndFound.images.split(";")
        } else {
            lostAndFound.imageList = []
            lostAndFound.imageList[0] = HOST_URL + '/uploads/default/lostandfound_default.png'
        }
        that.setData({
            lostAndFound: lostAndFound,
            wxInfo: res.data.wxInfo
        })
    })
}