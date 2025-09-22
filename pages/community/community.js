// pages/community/community.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasMore: true,
    list: [],
    page: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.fetchList();
    console.log("==load==");
  },
  fetchList() {
    if (!this.data.hasMore) return;
    wx.request({
      url: `http://10.135.8.83:3000/api/posts`,
      method: 'GET',
      data: { page: this.data.page, size: 20 },
      success: (res) => {
          console.log("拿到数据:",res.data);
        if (res.data.code === 0) {
          this.setData({
            list: this.data.list.concat(res.data.data),
            hasMore: res.data.data.length === 20,
            page: this.data.page + 1
          });
        }
      },
      fail: console.log("error")
    });
  },

  //加载
  loadMore() {
    this.fetchList();
  },

  goDetail(e) {
    wx.navigateTo({ url: `/pages/detail/detail?id=${e.currentTarget.dataset.id}` });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    var that = this;
    const tabbar = that.getTabBar();
    console.log("tabbar", tabbar);
    if(tabbar){
    that.getTabBar().setData({
      selected: 0 // 首页对应第一个tab，索引为0
      
    });
}

this.fetchList();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})