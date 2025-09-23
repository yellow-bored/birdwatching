// pages/me/me.js
// 对应小程序页面中“我的”页面
const { BASE_URL } = require('../../utils/config');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    loading: true,
    error: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that = this; // 保存this引用，供回调函数使用
    // 页面加载时请求用户信息
    wx.request({
      url: BASE_URL + '/userinfo', // 统一后端地址，接口路径不同
      method: 'GET',
      success(res) {
        if(res.statusCode === 200 && res.data){
          that.setData({
            userInfo: res.data,
            loading: false,
            error: ''
          });
        }else{
          that.setData({
            loading: false,
            error: '获取用户信息失败'
          });
        }
      },
      fail(){
        that.setData({
          loading: false,
          error: '网络错误，获取用户信息失败'
        });
      }
    });
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
      selected: 4 // 首页对应第一个tab，索引为0
      });
    }
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