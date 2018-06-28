// pages/manage/config/config.js
Page({

  data: {
  
  },

  onLoad: function (options) {
    //加载配置
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },
  submit:function(e){
    let openid = wx.getStorageSync('session')
    let form = e.detail.value
    form.openid = openid
    
    // 提交表单
  }
})