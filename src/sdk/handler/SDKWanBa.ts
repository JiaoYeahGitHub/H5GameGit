class SDKWanBa implements ISDKHandler {
    public info: ILoginInfo;
    public loginCallback: () => void;
    public loginFailed: () => void;
    private static _instance: SDKWanBa;
    constructor() { }

    // 没有强制限制，仿一个Singleton
    public static getInstance(): SDKWanBa {
        if (this._instance == null) {
            this._instance = new SDKWanBa();
        }
        return this._instance;
    }

    private APPID = "1106712754";
    /** 用户openid 默认从url取 */
    private openid: string;
    /** 用户openkey 默认从url取 */
    private openkey: string;
    /** 充值平台标识 默认从url取 */
    private pf: string;
    /** 区ID，用于区分用户是在哪一款平台下(Android、IOS等) */
    private platform: string;
    /** 礼包码 */
    public gift: string;

    // 登录请求路径
    private loginPath: string = "login";
    // 获取余额请求路径
    private balancePath: string = "balance";
    // 扣费发货请求路径
    private payPath: string = "pay";
    // 礼包领取请求路径
    private giftPath: string = "gift";
    //分享LOGO
    private logoUrl: string = "http://cdn.ih5games.com/ZXFML/logo1005.png";
    private GAME_TITLE = "神游记修仙巨作";
    private GAME_DESC = "飞升境界，组队开黑，一起来神游修仙！";

    private static ParamNameDefine = {
        openid: "openid",
        openkey: "openkey",
        pf: "pf",
        zoneid: "zoneid",
        platform: "platform",
    };

    // 分享参数
    private SHARE_OPTION: IWanBaShareOption;

    // 快捷方式参数
    private SHOTCUT_OPTION: IWanBaShotcutOption;

    public init() {
        let isIphone: boolean = egret.Capabilities.os == 'iOS';
        let logoUrl: string = this.logoUrl + '?v=' + Math.floor(Math.random() * 10000);
        this.SHARE_OPTION = {
            title: this.GAME_TITLE,
            desc: this.GAME_DESC,
            image: logoUrl,
            isIphone: isIphone,
        }
        this.SHOTCUT_OPTION = {
            title: SDKManager.gamename,
            image: logoUrl,
        }

        SDKWanBaJS.init(this.SHARE_OPTION, this.SHOTCUT_OPTION);
        SDKWanBaJS.setOnShareHandler(this.SHARE_OPTION, this.shareCallback);

        var openData: any = SDKWanBaJS.getOpenDataSync();
        this.openid = openData.openid;
        this.openkey = this.getParamFromeUrl(openData.appurl);
        this.pf = openData.pf;
        this.platform = openData.platform;
    };

    /**
     * 登录
     */
    public login(): void {
        var openData: any = SDKWanBaJS.getOpenDataSync();
        egret.log(openData);

        this.openid = openData.openid;
        this.openkey = this.getParamFromeUrl(openData.appurl);
        this.pf = openData.pf;
        this.platform = openData.platform;

        this.gift = SDKUtil.getQueryString("GIFT");

        //egret.log("userToken=" + userToken + ",fuid=" + fuid + ",focus=" + focus);
        var url = ChannelDefine.createURL(
            this.info,
            this.loginPath,
            {
                openid: this.openid,
                openkey: this.openkey,
                pf: this.pf,
            });
        HttpUtil.sendGetRequest(url, this.onGetUserInfoComplete, this);
    }
    private getParamFromeUrl(url: string): string {
        var result: string = "";
        var openkey = "openkey=";
        var pos: number = url.lastIndexOf(openkey);
        var point: number = url.substring(pos).indexOf("&");
        result = url.substring(pos + openkey.length, pos + point);
        return result;
    }

    private onGetUserInfoComplete(event: egret.Event): void {
        var request = <egret.HttpRequest>event.currentTarget;
        var info = JSON.parse(request.response);
        if ((!info.ret)) {
            this.info.account = this.openid,
                this.info.nickName = decodeURI(info.nickname),
                this.info.platform = <any>this.platform,
                this.loginCallback();
            try {
                SDKWanBaJS.register();
            } catch (e) {
                Tool.log("Register report failed:" + e.message);
            }
        } else {
            this.loginFailed();
        }
    }

    public onEnterGame(loginInfo: ILoginInfo, playerInfo: IPlayerInfo) {
        try {
            SDKWanBaJS.login();
        } catch (e) {
            Tool.log("Login report failed:" + e.message);
        }
    }

    /**
     * zoneid=1 安卓充值项
     */
    private static ZONE1_GOODS_DEFINE = {
        1: 24560,
        10: 24561,
        20: 24562,
        28: 24563,
        48: 24564,
        50: 24565,
        88: 24566,
        99: 24567,
        100: 24568,
        198: 24764,
        200: 24569,
        500: 24570,
        1000: 24571,
        1500: 24572,
        2000: 24573,
        3000: 24574,
    }

    /**
     * zoneid=2 IOS充值项
     */
    private static ZONE2_GOODS_DEFINE = {
        1: 24575,
        10: 24576,
        20: 24577,
        28: 24578,
        48: 24579,
        50: 24580,
        88: 24581,
        99: 24582,
        100: 24583,
        198: 24765,
        200: 24584,
        500: 24585,
        1000: 24822,
        1500: 24586,
        2000: 24587,
        3000: 24588,
    }


    /** 
     * 支付 
     * 1.游戏调用购买道具的接口（接口文档：http://wiki.open.qq.com/wiki/v3/user/buy_playzone_item）
     * 2.如果余额不足则呼起充值界面（呼起方式见第三点）。
     * 3.如果余额充足，则直接扣款并兑换道具.
     * 同时，也提供了接口可以给游戏侧直接查询余额（接口文档：http://wiki.open.qq.com/wiki/v3/user/get_playzone_userinfo）。
     */
    public pay(payInfo: IPayInfo, owner: ISDKPayContainer): void {
        try {
            var self = this;
            //1.获取余额
            var onGetBalance = function (event: egret.Event) {
                var request = <egret.HttpRequest>event.currentTarget;
                var result = JSON.parse(request.response);
                if (result.code != 0) {
                    owner.showTips("支付失败:" + result.code + "," + result.msg);
                    return;
                }
                var balance = result.data[0].score;
                //2.余额不足
                var amount = payInfo.amount;
                var onError = function () {
                    owner.showTips("支付失败");
                };

                //3.支付成功 余额充足，则直接扣款并兑换道具
                var onSuccess = function () {
                    var itemid = (self.platform == <any>EPlatform.PLATFORM_ANDROID) ?
                        SDKWanBa.ZONE1_GOODS_DEFINE[payInfo.amount] :
                        SDKWanBa.ZONE2_GOODS_DEFINE[payInfo.amount];
                    self.requestPay(itemid, owner);
                };
                var onClose = function () {
                    owner.showTips("支付取消");
                };

                var targetBalance = amount * 10;
                if (balance < targetBalance) {
                    SDKWanBaJS.pay({
                        defaultScore: targetBalance,
                        appid: self.APPID,
                        paySuccess: onSuccess,
                        payError: onError,
                        payClose: onClose,
                    });
                } else {
                    var textStr="您当前余额为:"+balance+",本次需花费:"+targetBalance+",确认购买？";
                    	var rebornNotice = [{ text: textStr, style: { textColor: 0xe63232 } }];
                        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
                            new WindowParam("AlertFrameUI", new AlertFrameParam(rebornNotice, function () {
                                            onSuccess();
                            }, this))
                        );
                }
            };
            this.requestBalance(onGetBalance);
        } catch (e) {
            owner.showTips("支付失败:" + e.message);
        }
    }

    /**
     * 请求余额
     */
    private requestBalance(onGetBalance: (event: egret.Event) => void) {
        var url = ChannelDefine.createURL(
            this.info,
            this.balancePath,
            {
                openid: this.openid,
                openkey: this.openkey,
                pf: this.pf,
                zoneid: this.platform
            });
        HttpUtil.sendGetRequest(url, onGetBalance, this);
    }

    /** 
     * 支付成功请求 
     * 扣款并兑换道具
     */
    public requestPay(itemid, owner: ISDKPayContainer): void {
        var url = ChannelDefine.createURL(
            this.info,
            this.payPath,
            {
                openid: this.openid,
                openkey: this.openkey,
                pf: this.pf,
                zoneid: this.platform,
                itemid: itemid,
                serverid: this.info.serverId,
                playerid: this.info.playerId,
            });
        HttpUtil.sendGetRequest(url, onPayCompleted, this);

        var onPayCompleted = function (event: egret.Event) {
            var request = <egret.HttpRequest>event.currentTarget;
            var result = JSON.parse(request.response);
            if ((!result.ret)) {
                owner.showTips("余额不足");
            } else {
                owner.showTips("支付成功");
            }
        };
    }
    public getVipInfo(): string {
        var url = ChannelDefine.createURL(
            this.info,

            this.giftPath,
            {
                openid: this.info.account,
                zoneid: this.info.platform,
                serverid: this.info.serverId,
                playerid: this.info.playerId,
                pf: this.pf,
                openkey: this.openkey
            });
        return url;
    }
    public sendVipGetAward(boxId: number): string {
        var url = ChannelDefine.createURL(
            this.info,
            this.giftPath,
            {
                openid: this.info.account,
                zoneid: this.info.platform,
                serverid: this.info.serverId,
                playerid: this.info.playerId,
                pf: this.pf,
                openkey: this.openkey,
                boxid: boxId
            });
        return url;
    }
    /** 获取登录礼包 */
    public getGift(owner: ISDKPayContainer): void {
        this.gift = SDKUtil.getQueryString("GIFT");

        // this.info = SDKManager.loginInfo;
        // this.info.platform = 0;
        // this.platform = "0";

        if (!this.gift) {
            return null;
        }
        // var giftMsg: Message = new Message(MESSAGE_ID.WANBA_GIFT_MESSAGE);
        // giftMsg.setShort(parseInt(this.gift));
        // GameCommon.getInstance().sendMsgToServer(giftMsg);
        var url = ChannelDefine.createURL(
            this.info,
            this.giftPath,
            {
                openid: this.info.account,
                zoneid: this.info.platform,
                serverid: this.info.serverId,
                playerid: this.info.playerId,
                pf: this.pf,
                openkey: this.openkey,
                boxid: this.gift
            });
        HttpUtil.sendGetRequest(
            url, this.recordGiftData, this);
    }

    public boxId = null;
    public giftOK = true;
    private recordGiftData(event: egret.Event) {
        var request = <egret.HttpRequest>event.currentTarget;
        var result = JSON.parse(request.response);
        egret.log(result);
        this.boxId = this.gift;
        if (result) {
            if (result.ret > 0) {
                this.giftOK = true;
            } else {
                this.giftOK = false;
            }
            if (result.ret == -1)
                return;
            egret.log("wanba gift is ok:" + this.giftOK)
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "WanbaGiftPanel");
        }
    }


    public shareContainer: ISDKShareContainer;

    /**
     * 提示分享操作
     */
    public share(owner: ISDKShareContainer): void {
        this.shareContainer = owner;
        SDKWanBaJS.showShare();
    }

    /**
     * 0 -- 用户点击发送，完成整个分享流程
     * 1 -- 用户点击取消，中断分享流程
     * 2 -- IOS端分享到微信或朋友圈时，手动取消分享将返回-2
     */
    public shareCallback(retCode): void {
        switch (retCode) {
            case 0:
                var shareContainer: ISDKShareContainer = SDKWanBa.getInstance().shareContainer;
                shareContainer.shareComplete();
                break;
            case 1:
            case 2:
                break;
        }

    }

    public sendToDesktop(): void {
        SDKWanBaJS.sendToDesktop(this.deskCallback);
        var message: Message = new Message(MESSAGE_ID.WANBA_DESK_REWARD_MESSAGE);
        GameCommon.getInstance().sendMsgToServer(message);
    }

    public deskCallback(): void {
        // var message: Message = new Message(MESSAGE_ID.WANBA_DESK_REWARD_MESSAGE);
        // GameCommon.getInstance().sendMsgToServer(message);
    }

    public isLoginIn(): void {
        var url = ChannelDefine.createURL(
            this.info,
            "xuming",
            {
                openid: this.info.account,
                pf: this.pf,
                openkey: this.openkey
            });
        HttpUtil.sendGetRequest(
            url, null, this);
    }
}