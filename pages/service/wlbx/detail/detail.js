
var app = getApp()
var HOST_URL = app.getHostUrl()
var detailUrl = HOST_URL + "/wlbx/detail"
Page({
    data: {
        detail: {}
    },
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '报修详情'
        })
        loadDetail(this, options.mid)
    },
    onPullDownRefresh: function () {
        // 页面相关事件处理函数--监听用户下拉动作

    },
    onShareAppMessage: function () {
        // 用户点击右上角分享
        return {
            title: this.detail.wxnr, // 分享标题
            desc: this.detail.wxdd, // 分享描述
            path: '/pages/service/wlbx/detail/detail?mid='+ this.detail.mid// 分享路径
        }
    }
})

function loadDetail(that, mid) {
    wx.request({
        url: detailUrl,
        data: {
            mid: mid
        },
        method: 'GET',
        success: function (res) {
            console.log(res)
            if (res.data.errcode == 1) {
                that.setData({
                    detail: res.data.data
                })
            } else {
                var errmsg = res.data.errmsg.split(":")[1]
                wx.showModal({
                    title: '提示',
                    content: '报修详情加载失败:'+errmsg
                })
            }
        },
        fail: function () {
            wx.showModal({
                title: '提示',
                content: '连接服务器失败了'
            })
        },
        complete: function () {
            // complete
        }
    })
}
