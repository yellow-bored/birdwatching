// pages/result/result.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    post: {},        // 原拍照片
    title: '',       // 官方中文名
    conf: 0,         // 置信度
    ident: [],       // 官方识别列表（含中文名/学名/置信度）
    box: {}          // 官方坐标框
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const post = JSON.parse(decodeURIComponent(options.json));
    const apiData = post;   // 官方返回 JSON

    // 解析官方返回
    const top = apiData;   // 官方只返回 1 个框

    this.setData({
      post: post,
      title: top.title,
      conf: top.desc
    });
  },
  goBack() { wx.navigateBack(); },

  goPublish() {
    wx.navigateTo({ url: `/pages/publish/publish?json=${encodeURIComponent(JSON.stringify(this.data.post))}` });
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