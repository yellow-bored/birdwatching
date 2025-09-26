// pages/publish/publish.js
Page({

  /**
   * 页面的初始数据
   */
  data: { post: {}, content: '', location: '' },

  onLoad(options) {
    const post = JSON.parse(decodeURIComponent(options.json));
    this.setData({ post, content: post.desc, location: post.location || '' });
  },

  onTitle(e) { this.setData({ 'post.title': e.detail.value }); },
  onContent(e) { this.setData({ content: e.detail.value }); },
  onLocation(e) { this.setData({ location: e.detail.value }); },

  chooseLocation() {
    wx.chooseLocation({
      success: (res) => {
        this.setData({ location: res.name || res.address });
      }
    });
  },

  goBack() { wx.navigateBack(); },

  doPublish() {
    const post = { ...this.data.post, desc: this.data.content, location: this.data.location };
    wx.showLoading({ title: '发布中' });
    wx.request({
      url: 'https://img.yourdomain.com/api/publish',
      method: 'POST',
      data: post,
      success: () => {
        wx.hideLoading();
        wx.showToast({ title: '发布成功', icon: 'success' });
        setTimeout(() => wx.navigateBack(), 1500);
      }
    });
  }

  /**
   * 生命周期函数--监听页面加载
   */
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

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