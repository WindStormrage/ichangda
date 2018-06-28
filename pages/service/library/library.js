var app = getApp()
var HOST_URL = app.getHostUrl()
var request = require('../../../utils/request.js')
Page({
    data: {
        keywords: '',
        currentPage: 0,
        searchList: [],
        borrowList: [],
        showBorrowList: true
    },
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '微图书馆'
        })
        borrowInfo(this)
    },
    onShow: function () {

    },
    reloanBook: function (e) {
        var that = this
        var barcode = e.target.id //图书的id
        var session = wx.getStorageSync('session')
        var param = {
            openid: session,
            barcode: barcode
        }
        request.loadData(this, '/library/reloan', param, function (res) {
            borrowInfo(that)
        })
    },
    searchBook: function (e) {
        var that = this
        var keywords = that.data.keywords
        var page = that.data.currentPage
        //查询书籍不需要绑定账号
        var param = {
            keywords: keywords,
            page: page
        }
        request.loadData(that, '/library/search', param, function (res) {
            if (res.data == null) {
                console.log('没有结果了')
                return
            }
            var searchList = that.data.searchList
            searchList = searchList.concat(res.data)
            console.log(res)
            that.setData({
                searchList: searchList,
                currentPage: page + 1
            })
        })
    },
    hideBorrowList:function(e){
        var that = this
        that.setData({
            showBorrowList: !that.data.showBorrowList
        })
    },
    onPullDownRefresh: function () {
        // 页面相关事件处理函数--监听用户下拉动作

    },
    onReachBottom: function () {
        // 页面上拉触底事件的处理函数
        console.log(this.data.currentPage)
        if (this.data.currentPage == 0 || this.data.keywords == '') return
        this.searchBook()

    },
    bindKeyInput: function (e) {
        this.setData({
            keywords: e.detail.value,  
        })
    },
    bindreturn: function () {
        this.setData({
            currentPage: 1,
            searchList: []
        })
        this.searchBook()
    }
})

function borrowInfo(that) {
    console.log("获取借阅信息->")
    var session = wx.getStorageSync("session")
    var param = {
        openid: session
    }
    request.loadData(that, '/library/borrowInfo', param, function (res) {
        if (res.data == null) {
            that.setData({
                showBorrowList: false
            })
            return
        }
        console.log('res')
        console.log(res)
        that.setData({
            borrowList: res.data
        })
    })
}
