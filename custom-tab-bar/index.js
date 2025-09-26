Component({
    data: {
      // selected: 0, // 不再在这里定义，由页面传入
      list: [ // 这里配置图标和文字，pagePath必须和app.json中的list保持一致
        {
            "pagePath": "pages/community/community",
            "text": "社区",
            icon: "earth",     // 未选中图标
            selectedIcon: "earth" // 选中图标 (可以用不同的，如"home-filled")
          },
        {
            "pagePath": "pages/map/map",
            "text": "鸟类地图",
            icon: "map-location",     // 未选中图标
            selectedIcon: "map-location" // 选中图标 (可以用不同的，如"home-filled")
          },
          {
            "pagePath": "pages/ai_recognition/ai_recognition",
            "text": "识别",
            icon: "camera",     // 未选中图标
            selectedIcon: "camera" // 选中图标 (可以用不同的，如"home-filled")
          },
          {
            "pagePath": "pages/message/message",
            "text": "消息",
            icon: "chat",     // 未选中图标
            selectedIcon: "chat" // 选中图标 (可以用不同的，如"home-filled")
          },
          {
            "pagePath": "pages/me/me",
            "text": "我的",
            icon: "user-1",     // 未选中图标
            selectedIcon: "user-1" // 选中图标 (可以用不同的，如"home-filled")
          }
       
      ]
    },
  
    methods: {
      // 切换Tab
      switchTab(e) {
        const dataset = e.currentTarget.dataset;
        const path    = dataset.path;
        const index   = dataset.index;
        console.log('即将跳转路径 =', '/'+path);          // 看路径对不对
  
        this.setData({ selected: index });   // 高亮当前图标
        wx.switchTab({ url: '/'+path });        // 跳转页面
      },
      onSwitchTab(e) {
        const data = e.currentTarget.dataset;
        const url = data.path;
        const index = data.index;
  
        // 切换Tab页
        wx.switchTab({
          url: url,
          success: () => {
            // 成功切换后，通知页面更新选中状态
            const pages = getCurrentPages();
            const currentPage = pages[pages.length - 1];
            if (currentPage && currentPage.setTabBarIndex) {
              currentPage.setTabBarIndex(index);
            }
          }
        });
      }
    }
  })