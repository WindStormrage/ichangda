Page({
  data: {
    mapHeigth:600,
      //标记
    markers: [],
    //路线
    polyline: [{
      points: [{
        longitude: 113.032452,
        latitude:28.24705
      }, {
        longitude: 113.032569,
        latitude: 28.247491
      }
      ],
      color:"#000",
      width: 2,
      dottedLine: true
    }],
    //边上的控制按钮
    controls: [{
      id: 1,
      iconPath: '/images/xiaoyuanditu.png',
      position: {
        left: 0,
        top: 400,
        width: 50,
        height: 50
      },
      clickable: true
    }]
  },
  onLoad:function(){
    var info = wx.getSystemInfoSync()  
    this.setData({
        mapHeigth:info.windowHeight
    })
  },
  regionchange(e) {
    console.log(e.type)
  },
  markertap(e) {
    console.log(e.markerId)
  },
  controltap(e) {
    console.log(e.controlId)
  }
})