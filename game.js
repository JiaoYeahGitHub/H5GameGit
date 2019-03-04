require('./weapp-adapter.js');
require('./platform.js');
require("./manifest.js");
require('./egret.wxgame.js');

// 启动微信小游戏本地缓存，如果开发者不需要此功能，只需注释即可
// require('./library/image.js');
// require('./library/text.js');

window.DOMParser = require("./xmldom/xmldom.js").DOMParser;

egret.runEgret({
  //以下为自动修改，请勿修改
  //The following is automatically modified, please do not modify
  //----auto option start----
		entryClassName: "Main",
		orientation: "auto",
		frameRate: 60,
		scaleMode: "fixedWidth",
		contentWidth: 600,
		contentHeight: 1080,
		showFPS: false,
		fpsStyles: "x:0,y:0,size:12,textColor:0xffffff,bgAlpha:0.9",
		showLog: false,
		maxTouches: 1,
		//----auto option end----
  renderMode: 'webgl',
  audioType: 0,
  calculateCanvasScaleFactor: function(context) {
    var backingStore = context.backingStorePixelRatio ||
      context.webkitBackingStorePixelRatio ||
      context.mozBackingStorePixelRatio ||
      context.msBackingStorePixelRatio ||
      context.oBackingStorePixelRatio ||
      context.backingStorePixelRatio || 1;
    return (window.devicePixelRatio || 1) / backingStore;
  }
});

require("./crypto-js.js");
window.fySDK = require("./hyhd_v1.2.0.js");

wx.setKeepScreenOn({
  keepScreenOn: true
});

wx.showShareMenu({
  withShareTicket: true
});

wx.onShareAppMessage(function() {
  // 用户点击了“转发”按钮
  return {
    title: '跨服争武坛，三界争夺唯有你来战',
    imageUrl: 'https://jpsx-login.szfyhd.com/share_pic1.jpg',
    query: 'chid=05901&subchid=059share',
    success: function(res) {
      console.log('分享成功');
    }
  }
});

wx.updateShareMenu({
  withShareTicket: true,
  success: function() {
    // console.log('成功');
  },
  fail: function() {
    // console.log('失败');
  }
});

if (typeof wx.getUpdateManager === 'function') {
  const updateManager = wx.getUpdateManager()

  updateManager.onCheckForUpdate(function(res) {
    // 请求完新版本信息的回调
    if (res.hasUpdate) {
      // console.log("游戏有新版本需要更新！");
    }
  })

  updateManager.onUpdateReady(function() {
    // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
    const onComplete = function() {
      // const WX_ROOT = wx.env.USER_DATA_PATH + "/";
      // removeAllCache(WX_ROOT + "https/jpsx-login.szfyhd.com/");

      updateManager.applyUpdate();
    }

    wx.showModal({
      title: '版本更新',
      content: '游戏版本过低，点击确认将为您更新到最新游戏版本。',
      showCancel: false,
      complete: onComplete
    });
  })

  // updateManager.onUpdateFailed(function () {
  //   // 新的版本下载失败
  // })
}

// const WXFS = wx.getFileSystemManager();

// function removeAllCache(filedir) {
//   try {
//     // console.log("检测到目录:::" + filedir);
//     let fileslist = WXFS.readdirSync(filedir);
//     for (let i = 0; i < fileslist.length; i++) {
//       let cacheFile = fileslist[i];
//       try {
//         WXFS.unlinkSync(filedir + cacheFile);
//         // console.log("删除文件:::" + filedir + cacheFile);
//       } catch (e) {
//         removeAllCache(filedir + cacheFile + "/");
//       }
//     }
//   } catch (e) { }
// }