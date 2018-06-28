function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('-')
}

function formatDateToYearAndMonth(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1

  return [year, month].map(formatNumber).join('')
}

function formatDateToYearAndMonth2(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1

  return [year, month].map(formatNumber).join('-')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function getMonthAndDay(date) {
  var month = date.getMonth() + 1
  var day = date.getDate()
  return [month, day].map(formatNumber).join('-')
}
function getWeekDay(date) {
  let week = date.getDay();
  console.log(week)
  switch (week) {
    case 1: return "星期一"
    case 2: return "星期二"
    case 3: return "星期三"
    case 4: return "星期四"
    case 5: return "星期五"
    case 6: return "星期六"
    case 0: return "星期天"
  }
}
function showLoading(msg) {
  wx.showNavigationBarLoading()
  wx.showToast({
    title: msg,
    icon: 'loading',
    duration: 10000
  })
}
function hideLoading(){
  wx.hideToast()
  wx.hideNavigationBarLoading()
}

function showModal(title, msg, showCancel, success, fail) {
  wx.showModal({
    title: title,
    content: msg,
    showCancel: showCancel,
    success: function(res) {
      if (res.confirm) {
        success(res)
      } else if (res.cancel) {
        fail(res)
      }
    }
  })
}



module.exports = {
  formatTime: formatTime,
  getMonthAndDay: getMonthAndDay,
  getWeekDay: getWeekDay,
  showLoading,showLoading,
  hideLoading,hideLoading,
  formatDateToYearAndMonth:formatDateToYearAndMonth,
  formatDateToYearAndMonth2:formatDateToYearAndMonth2,
  showModal: showModal,
}
