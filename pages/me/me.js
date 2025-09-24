// pages/me/me.js
// 对应小程序页面中“我的”页面
const { BASE_URL } = require('../../utils/config');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    hasUserInfo: false,
    loading: false,
    error: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that = this;
    that.setData({
      loading: true,
      error: '',
      userInfo: null
    });
    wx.login({
      success(loginRes) {
        if (loginRes.code) {
          wx.request({
            url: BASE_URL + '/userinfo',
            method: 'POST',
            data: {
              wxcode: loginRes.code
            },
            success(res) {
              if(res.statusCode === 200 && res.data){
                let tip = '';
                // 如果后端返回 isnew 字段，提示自动注册
                if(res.data.isnew){
                  tip = '首次登录，已自动注册';
                }
                that.setData({
                  userInfo: res.data.userInfo,
                  loading: false,
                  error: tip
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
        } else {
          that.setData({
            loading: false,
            error: '微信登录失败，未获取到code'
          });
        }
      },
      fail() {
        that.setData({
          loading: false,
          error: '微信登录失败'
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

  },

  /**
   * 获取用户微信信息
   */
  getUserProfile() {
    var that = this;
    wx.getUserProfile({
      desc: '用于完善个人资料',
      success: function(res) {
        that.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
          error: ''
        });
      },
      fail: function() {
        that.setData({
          error: '用户拒绝授权',
          hasUserInfo: false
        });
      }
    });
  }
})