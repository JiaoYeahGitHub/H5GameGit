/** 
 * 请在白鹭引擎的Main.ts中调用 platform.login() 方法调用至此处。
 */
class WxgamePlatform {

  name = 'wxgame'

  // login() {
  //   return new Promise((resolve, reject) => {
  //     var session_key = ''; //window.localStorage.getItem('WX_SESSION_KEY');
  //     // console.log('session_key:' + session_key);
  //     if (!session_key) {
  //       wx.login({
  //         success: (res) => {
  //           var logininfo = res;
  //           resolve(logininfo);
  //         },
  //         fail: (res) => {
  //           this.showAlert({
  //             title: '登录异常',
  //             content: '获取用户登录状态失败，请重新进入游戏！',
  //             showCancel: false,
  //             callback: function() {
  //               wx.exitMiniProgram({});
  //             }
  //           });
  //         }
  //       })
  //     } else {
  //       wx.checkSession({
  //         success: function() {
  //           // 登录态未过期
  //           console.log('登录态未过期');
  //           var loginCode = window.localStorage.getItem('WX_LOGIN_CODE');
  //           resolve(loginCode);
  //         },
  //         fail: function() {
  //           //登录态过期
  //           wx.login({
  //             success: (res) => {
  //               var logininfo = res;
  //               resolve(logininfo);
  //             }
  //           })
  //         }
  //       })
  //     }
  //   })
  // }

  // getUserInfo() {
  //   return new Promise((resolve, reject) => {
  //     // wx.getUserInfo({
  //     //   withCredentials: true,
  //     //   success: function(res) {
  //     //     var userInfo = res.userInfo;
  //     //     resolve(userInfo);
  //     //   }
  //     // })
  //   })
  // }

  // pay(param) {
  //   // console.log('发起支付:', param);
  //   return new Promise((resolve, reject) => {
  //     wx.requestMidasPayment({
  //       mode: param.mode,
  //       env: param.env,
  //       offerId: param.offerId,
  //       currencyType: param.currencyType,
  //       platform: param.platform,
  //       zoneId: param.zoneId,
  //       buyQuantity: param.buyQuantity,
  //       success: function(res) {
  //         param.success(res);
  //         resolve(res);
  //       },
  //       fail: function(res) {
  //         param.fail(res);
  //         reject(res);
  //       }
  //     });
  //   })
  // }

  getOption() {
    return new Promise((resolve, reject) => {
      var launchOption = wx.getLaunchOptionsSync();
      // console.log(launchOption);
      resolve(launchOption);
    })
  }

  previewImage(param) {
    wx.previewImage(param);
  }

  getSystemInfoSync() {
    var sysInfo = wx.getSystemInfoSync();
    console.log(sysInfo);
    return sysInfo;
  }

  showAlert(param) {
    wx.showModal({
      title: param.title,
      content: param.content,
      showCancel: param.showCancel,
      complete: function(res) {
        param.callback();
      }
    });
  }
  //监听onshow事件
  onListenerShow(func) {
    wx.onShow(func);
  }
  //监听onHide事件
  onListenerHide(func) {
    wx.onHide(func);
  }
  //调起分享面板
  onShare(param) {
    wx.shareAppMessage({
      title: param.title,
      imageUrl: param.imageUrl,
      query: param.query,
    });
  }
  //获取GROUPID
  getShareGroupID(param) {
    wx.getShareInfo({
      shareTicket: param.shareTicket,
      success: function(suc_res) {
        const url = "https://jpsx-login.szfyhd.com/loginServer/sdk/1022/ticket?" + "session_key=" + param.session_key + "&encryptedData=" + encodeURIComponent(suc_res.encryptedData) + "&iv=" + encodeURIComponent(suc_res.iv);
        // const url = "https://cpgc.phonecoolgame.com/group/groupDecode";// + "sessionKey=" + param.session_key + "&encryptedData=" + suc_res.encryptedData + "&iv=" + suc_res.iv + "appid=" + param.appid;
        wx.request({
          url: url,
          method: 'GET',
          header: {
            'content-type': 'text/plain',
          },
          // data: {
          //   sessionKey: param.session_key,
          //   encryptedData: suc_res.encryptedData,
          //   iv: suc_res.iv,
          //   appid: param.appid
          // },
          success: function(groupData) {
            // if (!groupDecode) return;
            // if (groupDecode.ecode) {
            //   console.log("分享失败 errcode::" + groupDecode.ecode);
            //   return;
            // }
            if (param.success) {
              const groupDecode = groupData && groupData.data ? groupData.data.openGId : null;
              param.success(groupDecode);
            }
          }
        });
      }
    })
  }

  onShareAppMessage(param) {
    wx.onShareAppMessage(function() {
      // 用户点击了“转发”按钮
      return {
        title: param.title,
        imageUrl: param.imageUrl,
        success: function(res) {
          console.log('分享成功');
          if (param.success) param.success(param.m_id);
        }
      }
    });
  }

  loadImage(imageURL) {
    return new Promise((resolve, reject) => {
      const image = wx.createImage();

      image.onload = () => {
        const bitmapdata = new egret.BitmapData(image);
        const texture = new egret.Texture();
        texture._setBitmapData(bitmapdata);
        setTimeout(() => {
          resolve(texture)
        }, 0)
      }
      image.onerror = (e) => {
        // console.error(e)
        // var e = new RES.ResourceManagerError(1001, imageURL);
        // reject(e);
        console.log('资源加载失败URL======:', imageURL)
        resolve(null)
      }
      image.src = imageURL;
    })
  }

  navigateToMiniProgram(param) {
    wx.navigateToMiniProgram({
      appId: param.appId,
      path: param.path,
      extraData: param.extraData,
      success: param.success
    })
  }

  setClipboardData(param) {
    wx.setClipboardData({
      data: param.data,
      success() {
        if (param.success) param.success();
      }
    })
  }

  openCustomerServiceConversation(param) {
    wx.openCustomerServiceConversation({
      // sessionFrom: param.sessionFrom
    });
  }

  getEnvVersio() {
    return __wxConfig.envVersion + "";
  }

  isLocalTest() {
    return false;
  }

  triggerGC() {
    wx.triggerGC();
  }

  exit() {
    wx.exitMiniProgram({});
  }

  // openDataContext = new WxgameOpenDataContext();
}

// class WxgameOpenDataContext {

//   createDisplayObject(type, width, height) {
//     const bitmapdata = new egret.BitmapData(sharedCanvas);
//     bitmapdata.$deleteSource = false;
//     const texture = new egret.Texture();
//     texture._setBitmapData(bitmapdata);
//     const bitmap = new egret.Bitmap(texture);
//     bitmap.width = width;
//     bitmap.height = height;

//     const renderContext = egret.wxgame.WebGLRenderContext.getInstance();
//     const context = renderContext.context;
//     ////需要用到最新的微信版本
//     ////调用其接口WebGLRenderingContext.wxBindCanvasTexture(number texture, Canvas canvas)
//     ////如果没有该接口，会进行如下处理，保证画面渲染正确，但会占用内存。
//     if (!context.wxBindCanvasTexture) {
//       egret.startTick((timeStarmp) => {
//         egret.WebGLUtils.deleteWebGLTexture(bitmapdata.webGLTexture);
//         bitmapdata.webGLTexture = null;
//         return false;
//       }, this);
//     }
//     return bitmap;
//   }


//   postMessage(data) {
//     const openDataContext = wx.getOpenDataContext();
//     openDataContext.postMessage(data);
//   }
// }


window.platform = new WxgamePlatform();