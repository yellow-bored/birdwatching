// pages/ai_recognition/ai_recognition.js
Page({
    data: {
        preview: '',      // 预览图
        filePath: '',     // 临时文件
        serverIP: '10.135.8.83',   // ← 改成你电脑局域网IP
        serverPort: '3000',
        uploadUrl: 'http://10.135.8.83:3000/upload',    // 自动生成
        imgUrl: ''        // 上传后返回地址
      },
      onLoad() {
        // 动态生成上传地址
        this.setData({ uploadUrl: `http://${this.data.serverIP}:${this.data.serverPort}/upload` });
        console.log("Url:",this.data.uploadUrl);
        console.log('========= onLoad 触发啦 =========');
      },
      /* 1. 拍照*/
      takePhoto() {
        const ctx = wx.createCameraContext();
        ctx.takePhoto({
          quality: 'high',
          success: (res) => {
            this.setData({ preview: res.tempImagePath, filePath: res.tempImagePath });
          },
          fail: console.error
        });
      },
      /* 2. 返回重拍 */

      back() {
        this.setData({ preview: '', filePath: '', imgUrl: '' });
      },
      /* 3. 确定上传 */
    upload() {
        const filePath = this.data.filePath;
  if (!filePath) return;

  const uploadUrl = this.data.uploadUrl;   // ← 先拿值
  console.log("URL:",this.data.uploadUrl);
  if (!uploadUrl) {
    wx.showToast({ title: '上传地址未配置', icon: 'none' });
    return;
  }

  wx.showLoading({ title: '上传中' });
  wx.uploadFile({
    url: uploadUrl,          // ← 用局部变量，不再 this.data.uploadUrl
    filePath,
    name: 'file',
    success: (res) => {
      wx.hideLoading();
      try {
        const obj = JSON.parse(res.data);
        if (obj.code === 0) {
          this.setData({ imgUrl: obj.data.url });
          wx.showToast({ title: '上传成功', icon: 'success' });
          wx.previewImage({ urls: [obj.data.url] });
        } else {
          wx.showToast({ title: '上传失败', icon: 'error' });
        }
      } catch (e) {
        wx.showToast({ title: '解析失败', icon: 'error' });
      }
    },
    fail: (err) => {
      wx.hideLoading();
      wx.showToast({ title: '上传失败', icon: 'error' });
      console.error(err);
    }
  });
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
      selected: 2 // 首页对应第一个tab，索引为0
      
    });
}
  },







})