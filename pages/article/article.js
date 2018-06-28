var util = require('../../utils/util.js')

var app = getApp()
var HOST_URL = app.getHostUrl()
var articleUrl = HOST_URL + '/news/get'
Page({
    data: {
        id: 0,
        info: {},
        content: [],
    },
    onLoad: function (options) {
        // 生命周期函数--监听页面加载
        var that = this
        this.setData({
            id: options.id
        })
        wx.setNavigationBarTitle({
            title: '校讯'
        })
    },
    onShow: function () {
        var that = this
        if (this.data.content.length == 0) {
            loadArticle(that, this.data.id)
        }

    },
    onShareAppMessage: function () {
        // 用户点击右上角分享
        return {
            title: that.data.title, // 分享标题
            desc: 'desc', // 分享描述
            path: 'path' // 分享路径
        }
    },
    clickImage: function (e) {
        wx.previewImage({
            urls: [e.target.id]
        })
    },
    clickEmail: function (e) {
        wx.setClipboardData({
            data: e.target.id,
            success: function (res) {
                wx.showModal({
                    title: '邮箱',
                    content: '邮箱地址已经复制到粘贴板'
                })
            }
        })
    },
    clickFile: function (e) {
        wx.setClipboardData({
            data: e.target.id,
            success: function (res) {
                wx.showModal({
                    title: '暂不支持打开附件',
                    content: '文件地址已经复制到粘贴板,请前往浏览器粘贴下载'
                })
            }
        })
    },
    clickWebsite: function (e) {
        console.log(e)

        wx.setClipboardData({
            data: e.target.id,
            success: function (res) {
                wx.showModal({
                    title: '暂不支持打开网站',
                    content: '已经复制到粘贴板,请前往浏览器粘贴打开'
                })
            }
        })
    }

})
function loadArticle(that, id) {
    util.showLoading("正在加载文章")
    wx.request({
        url: articleUrl,
        data: {
            id: that.data.id
        },
        method: 'GET',
        success: function (res) {
            console.log(res)
            res = res.data.data
            var content = []
            var c = res.newsContent.content
            var cs = c.split('#SEPARATOR#')

            for (var i = 0; i < cs.length; i++) {
                var t = ""
                var mainContent = ""
                var url = ''
                if (cs[i].indexOf("#IMG-START#") != -1) {
                    t = "img"
                    var img = cs[i].replace("#IMG-START#", "")

                    mainContent = img.replace("#IMG-END#", "")
                    mainContent = "http://www.ccsu.cn" + mainContent
                    url = mainContent
                } else if (cs[i].indexOf("[附件]") != -1) {
                    t = "file"
                    var fileAndName = cs[i].split("|")

                    //附件的地址
                    url = fileAndName[1]

                    mainContent = fileAndName[0]
                } else if (cs[i].indexOf("[邮箱]") != -1) {

                    t = "email"
                    var e = cs[i].split("]")
                    mainContent = e[1]
                    url = mainContent = e[1]
                } else if (cs[i].indexOf("[网址]") != -1) {
                    t = "website"
                    var w = cs[i].split("]")
                    mainContent = w[1]
                    url = w[0]
                } else {
                    t = "text"
                    mainContent = cs[i]
                }
                content.push({
                    type: t,
                    content: mainContent,
                    url: url
                })
            }
            var info = res.newsInfo
            console.log(info)
            info.date = util.formatTime(new Date(info.date))
            that.setData({
                info: info,
                content: content
            })
        },
        fail: function () {
            // fail
        },
        complete: function () {
            util.hideLoading()
        }
    })

}