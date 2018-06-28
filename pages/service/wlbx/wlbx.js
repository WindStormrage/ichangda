var app = getApp()
var HOST_URL = app.getHostUrl()
var uploadUrl = HOST_URL + '/upload'

var filePath = uploadUrl + 's/'
var util = require('../../../utils/util.js')
var request = require('../../../utils/request.js')
Page({
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '阳光平台'
        })
        var that = this;
        /**
         * 获取系统信息
         */
        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    winWidth: res.windowWidth,
                    winHeight: res.windowHeight
                });
            }

        });
    },
    onShow: function () {

    },
    onSubmit: function (e) {
        var that = this
        var data = e.detail.value

        var files = this.data.uploadImageList.map(getFileName).join(';')
        var session = wx.getStorageSync('session')
        var type = this.data.currentTab == 0 ? '01' : '02'
        data.wxdd = encodeURI(data.wxdd)
        data.wxnr = encodeURI(data.wxnr)
        data.files = files
        data.openid = session
        data.type = type
        if (!session || session == null || data.wxdd == '' || data.wxnr == '') {
            return
        }
        request.loadData(this, '/wlbx/bx', data, function (res) {
            wx.showToast({
                title: '提交成功',
                icon: 'success',
                duration: 1500
            })
            loadHistory(that)
            setTimeout(function () {
                that.setData({ currentTab: 2 })
            }, 1500)
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
    /**
       * 滑动切换tab
       */
    bindChange: function (e) {

        var that = this;
        that.setData({ currentTab: e.detail.current });
        loadHistory(that)
    },
    /**
     * 点击tab切换
     */
    swichNav: function (e) {

        var that = this;

        if (this.data.currentTab === e.target.dataset.current) {
            return false;
        } else {
            that.setData({
                currentTab: e.target.dataset.current
            })
        }
    },
    /**
     * 点击添加上传图片
     */
    addImage: function (e) {
        var that = this
        var fileNames = []

        if (that.data.uploadImageList.length >= 3) {
            return
        }
        wx.chooseImage({
            count: 3 - that.data.uploadImageList.length, // 最多可以选择的图片张数，默认9
            sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
            sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
            success: function (res) {
                for (var item in res.tempFilePaths) {
                    var fileName = uploadImage(res.tempFilePaths[item], that)
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
    /**
     * 下拉刷新
     */
    onPullDownRefresh: function () {
        var currentTab = this.data.currentTab
        if (currentTab == 0 || currentTab == 1) {
            wx.stopPullDownRefresh()
        } else {
            //刷新我的报修
        }
    },
    bindDateChange: function (e) {
        this.setData({
            date: e.detail.value
        })
    },
    bindYqChange: function (e) {
        this.setData({
            currentYqIndex: e.detail.value,
            currentJzIndex: 0
        })
    },
    bindJzChange: function (e) {
        this.setData({
            currentJzIndex: e.detail.value
        })
    },
    bindZlChange: function (e) {
        this.setData({
            countryZlIndex: e.detail.value
        })
    },
    onBxClick: function (e) {
        var mid = e.target.id
        wx.navigateTo({
            url: '/pages/service/wlbx/detail/detail?mid=' + mid
        })
    },
    data: {
        uploadImageList: [], //上传文件列表
        /**
         * 页面配置
         */
        winWidth: 0,
        winHeight: 0,
        // tab切换
        currentTab: 0,
        currentYqIndex: -1,
        currentJzIndex: -1,
        countryZlIndex: -1,
        date: '',
        yqmc: '',
        jzmc: '',
        yysj: '',
        historyList: [],
        data: {
            "yq": [
                {
                    "id": "F04B30E8B40F4D3494EA8C933E8B80D2",
                    "child": [
                        {
                            "id": "7B16BE797BB145D682761584904801DB",
                            "value": "涵虚楼"
                        },
                        {
                            "id": "3D5531876B634979BDC01C4879046C7A",
                            "value": "致远楼"
                        },
                        {
                            "id": "BB62FA96B69E4687A0255C150F4630B8",
                            "value": "理工楼"
                        },
                        {
                            "id": "8AD842B627204F7B8EAA4E29767E07A1",
                            "value": "丹青楼"
                        },
                        {
                            "id": "17F2F4A840BA48B1A4970F1EFCE5666B",
                            "value": "明志楼"
                        },
                        {
                            "id": "5C0C2606AEC64547976AC43B74EC8572",
                            "value": "宁静楼"
                        },
                        {
                            "id": "20C2F4634BF54D22A0AA01E1E2453623",
                            "value": "音乐楼（琴房）"
                        },
                        {
                            "id": "E4CDA172A02D498E941C7F1AC0049416",
                            "value": "第一综合楼"
                        },
                        {
                            "id": "E68441AC270044968834719451C44200",
                            "value": "第二综合楼"
                        },
                        {
                            "id": "2B76C246BBEE479896A396BBB0319278",
                            "value": "一办"
                        },
                        {
                            "id": "B5C5995AD5434348B8136109255DABFE",
                            "value": "二办"
                        }
                    ],
                    "value": "行政教学区"
                },
                {
                    "id": "8F3C70853E9940E3AC2A20AC619E6FC5",
                    "child": [
                        {
                            "id": "E291862E8FE8401FA282D591F04BA6CD",
                            "value": "外教楼3-8栋"
                        },
                        {
                            "id": "AC0B9CEDCD534EB6AE45D3B5D7FBBE09",
                            "value": "外教楼3-9栋"
                        },
                        {
                            "id": "9470694D13F54A959EBC3D784586FF62",
                            "value": "教职工宿舍3-12栋"
                        },
                        {
                            "id": "5808F016289D4924BD6CCA9F0548AEA0",
                            "value": "教职工宿舍3-13栋"
                        },
                        {
                            "id": "0123812841D14C1D95977AF63059A8EC",
                            "value": "普职楼"
                        },
                        {
                            "id": "B503C6FF2EC642C0B444885F4459E12C",
                            "value": "高职楼"
                        }
                    ],
                    "value": "教工宿舍区"
                },
                {
                    "id": "DA5C797C477B4B39BEB63FD9AB062245",
                    "child": [
                        {
                            "id": "21608608E52F4DBE96D9B9AE4838D678",
                            "value": "汇泽公寓1栋"
                        },
                        {
                            "id": "03DA6410694748918F886BF036BB0962",
                            "value": "汇泽公寓2栋"
                        },
                        {
                            "id": "1F1783585B854CCDAB100DCF531ECB44",
                            "value": "汇泽公寓3栋"
                        },
                        {
                            "id": "5191DD991391447B9469C2C10A854698",
                            "value": "汇泽公寓4栋"
                        },
                        {
                            "id": "870DF0310A584B6F8214248DBB7B2A26",
                            "value": "汇泽公寓5栋"
                        },
                        {
                            "id": "A3D8D33994C94E91934F7B0D14E1F7C5",
                            "value": "汇泽公寓6栋"
                        },
                        {
                            "id": "24217ED2C70B468EB863BA6D2280FDB3",
                            "value": "维智公寓1栋"
                        },
                        {
                            "id": "E0623F6988694213BB73A94D1DD970D9",
                            "value": "维智公寓2栋"
                        },
                        {
                            "id": "9101F7D042B54481AD00297EA4207A42",
                            "value": "维智公寓3栋"
                        },
                        {
                            "id": "B76DAEE563F24418B757F1CE3B189670",
                            "value": "维智公寓4栋"
                        },
                        {
                            "id": "A8CBC4DAFF8E41C6893A6AE1A63F4C8D",
                            "value": "维智公寓5栋"
                        },
                        {
                            "id": "323195CEE8984CC18A5FC0B16DF0E259",
                            "value": "维智公寓6栋"
                        },
                        {
                            "id": "6812C9E765F84016B572E50BBA671EC3",
                            "value": "弘昱公寓1栋"
                        },
                        {
                            "id": "45CD2C3DC395488BADDEF602B569A3E3",
                            "value": "弘昱公寓2栋"
                        },
                        {
                            "id": "9EBE55B95FD84245B037ECC7D0991F56",
                            "value": "弘昱公寓3栋"
                        },
                        {
                            "id": "2B4CAF7132F44A34A2C423401D7FC77D",
                            "value": "弘昱公寓（新一栋）"
                        },
                        {
                            "id": "A2382CF680284C83B5A96AD004DAE4BC",
                            "value": "弘昱公寓（新二栋）"
                        },
                        {
                            "id": "7C84470940174D2897A03EE568B7D0E2",
                            "value": "洪山公寓1栋"
                        },
                        {
                            "id": "437D828ECB7D4E7C87FFB726CCAC834B",
                            "value": "洪山公寓2栋"
                        },
                        {
                            "id": "424CA43D598E4F53A2BD7C4C3C34DEAE",
                            "value": "洪山公寓3栋"
                        },
                        {
                            "id": "96515A6AD8E74D58A91156E03C6A2F84",
                            "value": "洪山公寓4栋"
                        },
                        {
                            "id": "B3D2F64911C047C7A995DDA11722F2A3",
                            "value": "洪山公寓5栋"
                        },
                        {
                            "id": "B3488009D6D748C586E880035889C851",
                            "value": "洪山公寓6栋"
                        },
                        {
                            "id": "2BEE981D9AFC4A72AACBBB274B1E7282",
                            "value": "洪山公寓7栋"
                        },
                        {
                            "id": "BA06FBC5D5244AB3A7D334617897E127",
                            "value": "洪山公寓8栋"
                        },
                        {
                            "id": "4B6B4FF94F9243CE8A18584589AF2F0C",
                            "value": "洪山公寓9栋"
                        },
                        {
                            "id": "BFECE329EEA14C7EA99DE617DFC382B8",
                            "value": "洪山公寓10栋"
                        },
                        {
                            "id": "B194CA94B7624E008D11B5A207FF7797",
                            "value": "洪山公寓11栋"
                        }
                    ],
                    "value": "学生宿舍区"
                },
                {
                    "id": "5C231D0975C2413DB04A65A97B4CC3B1",
                    "child": [
                        {
                            "id": "F2F9B45AC59646888E3768017508016E",
                            "value": "永康体育馆"
                        },
                        {
                            "id": "4BB69570951548DEBE9D2D739145D599",
                            "value": "天健体育馆"
                        },
                        {
                            "id": "905819114F234FADAE7359837A7C614F",
                            "value": "车库楼"
                        },
                        {
                            "id": "3BE53E9C5A4C44FFAEC4A4763E2BC7E1",
                            "value": "心理中心"
                        },
                        {
                            "id": "3052A542146041A2B69C83182B553A25",
                            "value": "食堂"
                        },
                        {
                            "id": "0368B73DE6984896BAA67C50414EE0A9",
                            "value": "金工实习工厂"
                        },
                        {
                            "id": "212813E42EF54B4FB0609878E45BA72F",
                            "value": "青年楼"
                        },
                        {
                            "id": "E6CE27E820C64C549C8F72A64FDF766A",
                            "value": "图书馆"
                        },
                        {
                            "id": "19B44C7DBD8E4ACEB775ABE00CF550A6",
                            "value": "医务室"
                        },
                        {
                            "id": "A2EBC187A5AD49D0A90AC98BC606524C",
                            "value": "配电房"
                        },
                        {
                            "id": "BEF6AB5141924D5AAC93424C26745A36",
                            "value": "保安室"
                        },
                        {
                            "id": "A46A8F9F84B6411A8209FC74318AA844",
                            "value": "其他地点"
                        }
                    ],
                    "value": "其他区域"
                }
            ],
            "zl": [
                {
                    "id": "7c4ff7c3-aa48-4611-b937-6f11c203627e",
                    "value": "泥"
                },
                {
                    "id": "8e2b3a66-2d42-4bd4-87db-1cfe22fc626b",
                    "value": "木"
                },
                {
                    "id": "5fe284c4-81a1-42b9-82ce-7f602f825c5a",
                    "value": "水"
                },
                {
                    "id": "8c3c2d7e-d0f2-4175-8ce0-75da96942d27",
                    "value": "电"
                },
                {
                    "id": "3FE8B2DCF042493FB5B78187F79AF14A",
                    "value": "绿化"
                },
                {
                    "id": "E6B373BB4A98436586E4E87C79D95F7B",
                    "value": "其它"
                }
            ]
        }
    },
})

function uploadImage(file, that) {
    var newList = that.data.uploadImageList
    wx.uploadFile({
        url: uploadUrl,
        filePath: file,
        name: 'file',
        success: function (res) {
            var res = JSON.parse(res.data)
            console.log(res)
            if (res.errcode == 1) {
                var yearAndMonth = util.formatDateToYearAndMonth(new Date())
                console.log(yearAndMonth)
                newList.push(filePath + yearAndMonth + "/" + res.data)
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

function loadHistory(that) {
    var currentTab = that.data.currentTab
    if (currentTab != 2) {
        return
    }
    var param = {
        openid: wx.getStorageSync('session')
    }
    request.loadData(that, '/wlbx/history', param, function (res) {
        console.log(res)
        that.setData({
            historyList: res.data
        })
    })
}


function getFileName(str) {
    return str.substr(str.lastIndexOf("/") + 1, str.length - str.lastIndexOf("/") + 1)
}

