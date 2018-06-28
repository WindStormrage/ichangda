var util = require('../../../utils/util.js')
var request = require('../../../utils/request.js')
Page({
    data: {
        voteId: -1,     //该投票的id
        voteInfo: {},   //该投票的详细信息
        voteItems: [],  //该投票的投票项列表
        userVote: null, //用户对于该投票的信息,未投票则为null
        votes: null,    //每个投票项的票数
        weightArr: null,//每个投票项的占比,加这个是为了预防出现特别长的一串小数
        votesCount: 0,  //当前投票的总票数

    },
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '投票',
        })
        // console.log(options)
        this.setData({
            voteId: options.voteId
        })

        //加载投票信息
        loadVoteInfo(this, options.id)
    },
    onPullDownRefresh: function () {

    },
    onShareAppMessage: function () {
        // 用户点击右上角分享
        var that = this
        return {
            title: '快来帮' + getApp().globalData.userInfo.nickName + '投一票吧！', /// 分享标题
            desc: '快来帮' + getApp().globalData.userInfo.nickName + '投一票吧！',  // 分享描述
            path: '/pages/index/index?voteId=' + that.data.voteInfo.id       // 分享路径
        }
    },
    onVoteClick: function (e) {
        vote(this, e.currentTarget.dataset.itemid)
    }
})

function loadVoteInfo(that) {

    var session = wx.getStorageSync('session')
    var param = {
        openid: session,
        bannerId: that.data.voteId,
    }
    request.loadData(that, '/banner/voteInfo', param, function (res) {
        var voteInfo = res.data.voteInfo
        voteInfo.createdate = util.formatTime(new Date(voteInfo.createdate))
        that.setData({
            voteInfo: voteInfo,
            voteItems: res.data.voteItems,
        })

        if (res.data.userVote && res.data.userVote != null) {
            //说明该用户已经投过票了,设置票数,等信息
            var voteItems = res.data.voteItems
            var votes = res.data.votes
            var votesArr = []
            var weightArr = []
            for (var i = 0; i < voteItems.length; i++) {
                votesArr[i] = 0
                weightArr[i] = 0
                for (var j = 0; j < votes.length; j++) {
                    if (voteItems[i].id == votes[j].voteId) {
                        votesArr[i] = votes[j].count
                        weightArr[i] = (votesArr[i] / res.data.votesCount * 100).toFixed(1)
                    }
                }
            }
            that.setData({
                userVote: res.data.userVote,
                votes: votesArr,
                votesCount: res.data.votesCount,
                weightArr: weightArr
            })
        }
    })
}

function vote(that, itemId) {
    util.showLoading("正在加载")
    var session = wx.getStorageSync('session')
    var param = {
        bannerId: that.data.voteId,
        openid: session,
        itemId: itemId
    }
    request.loadData(that, '/banner/vote', param, function (res) {
        //投票成功  加载票数信息
        wx.showToast({
            title: '投票成功',
            icon: 'success',
            duration: 1500
        })
        setTimeout(function () {
            var voteItems = that.data.voteItems
            var votes = res.data.votes
            var votesArr = []
            var weightArr = []
            for (var i = 0; i < voteItems.length; i++) {
                votesArr[i] = 0
                weightArr[i] = 0
                for (var j = 0; j < votes.length; j++) {
                    if (voteItems[i].id == votes[j].voteId) {
                        votesArr[i] = votes[j].count
                        weightArr[i] = (votesArr[i] / res.votesCount * 100).toFixed(1)
                    }
                }
            }
            that.setData({
                userVote: res.data.userVote,
                votes: votesArr,
                votesCount: res.data.votesCount,
                weightArr: weightArr
            })
        }, 1500)
    })
}

function loadVotes(that) {
    var session = wx.getStorageSync('session')
    var param = {
        bannerId: that.data.voteId,
        session: session,
    }
    request.loadData(that, 'Banner_getVotes', param, function (res) {
        
    })
}