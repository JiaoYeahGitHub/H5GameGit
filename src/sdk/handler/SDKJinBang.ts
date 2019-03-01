class SDKJinBang implements ISDKHandler {
    public info: ILoginInfo;
    public loginCallback: () => void;
    public loginFailed: () => void;
    public shareContainer: ISDKShareContainer;
    public payContainer: ISDKPayContainer;

    private static _instance: SDKJinBang;
    constructor() { }

    private logoUrl: string = "http://cdn.ih5games.com/FREEGAME/logo.png";
    private GAME_TITLE: string = '';
    private GAME_DESC: string = '';

    // 没有强制限制，仿一个Singleton
    public static getInstance(): SDKJinBang {
        if (this._instance == null) {
            this._instance = new SDKJinBang();
        }
        return this._instance;
    }

    public shareSuccessCallback(type): void {
        //egret.log("SDKJinBang.shareCallback(). type=" + type);
        var shareContainer: ISDKShareContainer = SDKJinBang.getInstance().shareContainer;
        //egret.log(shareContainer);
        //SDKJinBang.getInstance().requestShareReward();
        shareContainer.shareComplete();
    }

    public init() {
        var friendConfig: IJinBangShareOption = {
            title: this.GAME_TITLE, // 没用。。须要找运营配置
            desc: this.GAME_DESC,
            imgUrl: this.logoUrl,
            success: this.shareSuccessCallback,
            cancel: function () { },
        };
        var timelineConfig: IJinBangShareOption = {
            title: this.GAME_TITLE,
            imgUrl: this.logoUrl,
            success: this.shareSuccessCallback,
            cancel: function () { },
        };

        var payOption: IJinBangPayOption = {
            success: function () {
                var owner = SDKJinBang.getInstance().payContainer;
                if (owner) {
                    owner.showTips("支付成功");
                }
            },
            cancel: function () {
                var owner = SDKJinBang.getInstance().payContainer;
                if (owner) {
                    owner.showTips("支付取消");
                }
            }
        }
        var config: IJinBangConfigOption = {
            share: {
                friend: friendConfig,
                timeline: timelineConfig
            },
            pay: payOption
        }
        SDKJinBangJS.init(config);
    };

    private access_token;

    // 请求路径
    private loginPath: string = "login";
    // private sharePath:string = "share";
    // 分享奖励信息
    // private shareInfoPath:string = "shareInfo";
    // 关注奖励检查
    private focusPath: string = "focus";
    // 创建订单
    private createOrderPath: string = "createOrder";
    // 分享成功
    private sharePath: string = "share";
    // 分享奖励信息
    private shareInfoPath: string = "shareInfo";

    public login(): void {
        var access_token = SDKUtil.getQueryString("access_token");
        var url = ChannelDefine.createURL(
            this.info,
            this.loginPath,
            { "access_token": access_token });
        HttpUtil.sendGetRequest(url, this.onGetUserInfo, this);
    }

    /**
     * code: 请求状态，0表示请求成功。
        message: 接口错误信息。请求成功时为OK
        userid: 用户唯一标识
        nickname: 用户昵称
        avatar : 用户头像地址
        sex : 用户的性别。0:未知，1:男性，2:女性
        province: 用户所在的省份
        city:用户所在的城市
        invitor: 邀请者。没有邀请者为0，有邀请者，为邀请者的userid
    */
    private onGetUserInfo(event: egret.Event): void {
        var request = <egret.HttpRequest>event.currentTarget;
        var info = JSON.parse(request.response);
        if ((info.code == ChannelDefine.SUCCESS) && (info.userid)) {
            this.info.account = info.userid,
                this.info.nickName = info.nickname,
                //this.info.avatarUrl =  info.avatar;
                this.loginCallback();
        } else {
            egret.error("SDKJinBang.login() failed. Error sign.");
            this.loginFailed();
        }
    }

    public onEnterGame(loginInfo: ILoginInfo, playerInfo: IPlayerInfo) {
        var url = ChannelDefine.createURL(
            this.info,
            this.focusPath,
            {
                "user_identify": this.info.account,
                "server_id": this.info.serverId,
                "player_id": this.info.playerId
            });
        HttpUtil.sendGetRequest(url, this.onGetFocus, this);
    }

    public onGetFocus(event: egret.Event): void {
        var request = <egret.HttpRequest>event.currentTarget;
        var info = JSON.parse(request.response);
        if (info.ret == ChannelDefine.SUCCESS) {
            this.info.focus = true;
        }
    }

    public pay(payInfo: IPayInfo, owner: ISDKPayContainer): void {
        this.payContainer = owner;
        this.requestOrder(payInfo);
    }

    public requestOrder(payInfo: IPayInfo) {
        var metadata = this.info.serverId + "*" + this.info.playerId;
        metadata = encodeURI(metadata);
        var params = {
            out_trade_no: "",
            product_id: "",      //	商品id	varchar(64)
            total_fee: payInfo.amount * 100,       //	支付总金额，以分为单位，必须大于0	int(11)
            body: payInfo.goodsName, //	订单或商品的名称	varchar(128)
            detail: "",         //	订单或商品的详情	varchar(256)
            attach: metadata,   //	附加数据，后台通知时原样返回	varchar(256)
            sign: ""
        }
        var url = ChannelDefine.createURL(
            this.info,
            this.createOrderPath,
            params);

        HttpUtil.sendGetRequest(url, this.onCreateOrder, this);
    }

    public onCreateOrder(event: egret.Event): void {
        var request = <egret.HttpRequest>event.currentTarget;
        try {
            var order = JSON.parse(request.response);
            if (order && order.out_trade_no) {
                SDKJinBangJS.pay(order);
            }
        } catch (e) {
            egret.error("SDKJinBang.createOrder faied. " + e.message);
        }
    }

    public subscribe(): void {
        SDKJinBangJS.focus();
    }

    public share(owner: ISDKShareContainer): void {
        this.shareContainer = owner;
        // 提示分享奖励
        //this.requestShareInfo();
    }

    private requestShareInfo(): void {
        var params = {};
        params["uid"] = this.info.account;
        var url = ChannelDefine.createURL(
            this.info,
            this.shareInfoPath,
            params
        );
        HttpUtil.sendGetRequest(url, onShareInfoReceived, this);
        function onShareInfoReceived(event: egret.Event): void {
            var request = <egret.HttpRequest>event.currentTarget;
            var result = JSON.parse(request.response);
            var shareInfo: ISDKShareInfo = SDKJinBang.parseShareInfo(result);
            if (shareInfo) {
                this.shareContainer.showShareInfo(shareInfo);
            }
        }
    }

    public static parseShareInfo(result: any) {
        if (result.ret && result.ret != ChannelDefine.SUCCESS) {
            egret.error("SDKJinBang.parseShareInfo() return failed.");
            return null;
        }
        var cd: number = result.share_cd as number;
        var dailyTimes: number = result.share_reward_times as number;
        var totalTimes: number = result.share_total_times as number;
        var rewardDiamond: number = result.share_reward_diamond as number;

        var shareInfo: ISDKShareInfo = {
            cd: cd,
            dailyTimes: dailyTimes,
            totalTimes: totalTimes,
            rewardDiamond: rewardDiamond
        };
        return shareInfo;
    }

    private requestShareReward() {
        var info = SDKJinBang.getInstance().info;
        var sharePath = SDKJinBang.getInstance().sharePath;
        var url = ChannelDefine.createURL(
            info,
            sharePath,
            {
                "uid": info.account,
                "server_id": info.serverId,
                "player_id": info.playerId
            }
        );
        HttpUtil.sendGetRequest(url, this.onShareComplete, this);
    }

    private onShareComplete(event: egret.Event): void {
        var request = <egret.HttpRequest>event.currentTarget;
        var result = JSON.parse(request.response);
        //egret.log("SDKJinBang.onShareComplete() result=" + result.ret);
        if (result.ret) {
            return;
        }
        var shareInfo: ISDKShareInfo = SDKJinBang.parseShareInfo(result);
        if (shareInfo) {
            var shareContainer: ISDKShareContainer = this.shareContainer;
            shareContainer.updateShareInfo(shareInfo);
        }
    }

}