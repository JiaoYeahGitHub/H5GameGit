/** 
 * 平台数据接口。
 * 由于每款游戏通常需要发布到多个平台上，所以提取出一个统一的接口用于开发者获取平台数据信息
 * 推荐开发者通过这种方式封装平台逻辑，以保证整体结构的稳定
 * 由于不同平台的接口形式各有不同，白鹭推荐开发者将所有接口封装为基于 Promise 的异步形式
 */
declare interface Platform {

    getOption(): Promise<any>;//获取进入游戏参数

    previewImage(param): void;//预览图片

    navigateToMiniProgram(param): void;//微信小程序跳转

    onShare(param): void;//分享

    onShareAppMessage(param): void;

    showAlert(param): void;//设置弹窗

    getSystemInfoSync(): any;//获取手机参数

    loadImage(imageURL): any;//加载图片

    setClipboardData(param): void;//设置剪切板

    openCustomerServiceConversation(param): void;

    onListenerShow(func): void;//兼听onshow事件 func为回调函数

    onListenerHide(func): void;//兼听onHide事件

    getShareGroupID(param): void;//获取群ID shareTicket session_key appid success

    getEnvVersio(): string;//获取当前环境 undefined、develop 开发版本；trial 体验版；release或其他 正式版

    isLocalTest(): boolean;//本地测试开关

    triggerGC(): void;//GC

    exit(): void;//退出小程序
}

/**微信盒子**/
class WXBoxPlatform implements Platform {
    async getOption() {
        return null;
    }

    async loadImage(imageURL) {
        return null;
    }

    public onShare(param): void { }

    public onShareAppMessage(param): void { }

    public previewImage(param): void { }

    public navigateToMiniProgram(param): void { }

    public showAlert(param): void { }

    public getSystemInfoSync(): any { }

    public setClipboardData(param): void { }

    public onListenerShow(func): void { }

    public onListenerHide(func): void { }

    public getShareGroupID(param): void { }

    public openCustomerServiceConversation(param): void { }

    public getEnvVersio(): string {
        return "undefined";
    }

    public isLocalTest(): boolean {
        return false;
    }

    public triggerGC(): void { }

    public exit(): void { }
}

declare interface SDK {

    getFyhd();//调用支付

}

if (!window.platform) {
    window.platform = new WXBoxPlatform();
}

declare let platform: Platform;

declare interface Window {
    platform: Platform;
    fySDK: SDK;
}