var request = require('../../../utils/request.js')
Page({
    data: {
        xnxqs: [],
        index: 0,
        grade: [],
    },
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '成绩查询'
        })
        initOptions(this)
        loadGrade(this, 0)
    },
    onSelectChange: function (e) {
        var index = e.detail.value
        this.setData({
            index: index,
            grade: []
        })
        loadGrade(this, index)
    },
    onPullDownRefresh: function () {
        var index = this.data.index
        loadGrade(this, index)
    },
})

function initOptions(that) {
    var xnxqs = []
    var dataObj = new Date();
    var year = dataObj.getFullYear();
    var month = dataObj.getMonth() + 1;

    if (month >= 7) {
        var term2 = (year - 1) + "-" + year + "-2";
        xnxqs.push(term2)
    }
    var term1 = (year - 1) + "-" + year + "-1";
    xnxqs.push(term1)
    for (var i = 0; i < 4; i++) {
        year--;
        var t = (year - 1) + "-" + year;
        var t2 = t + "-2";
        var t1 = t + "-1";
        xnxqs.push(t2)
        xnxqs.push(t1)
    }
    that.setData({
        xnxqs: xnxqs
    })
}

function loadGrade(that, index) {
    //加载成绩
    var data = {
        xnxq: that.data.xnxqs[index],
        openid: wx.getStorageSync('session')
    }
    request.loadData(this, '/service/grade', data, function (res) {
        console.log(res)
        that.setData({
            grade: res.data
        })
        
    })
}