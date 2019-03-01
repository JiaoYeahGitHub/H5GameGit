// 疯狂游乐场
class SDKCrazy implements ISDKHandler {
    public info: ILoginInfo;
    public loginCallback: () => void;
    public loginFailed: () => void;
    public shareContainer: ISDKShareContainer;

    private static _instance: SDKCrazy;
    constructor() { }

    // 没有强制限制，仿一个Singleton
    public static getInstance(): SDKCrazy {
        if (this._instance == null) {
            this._instance = new SDKCrazy();
        }
        return this._instance;
    }


    // 疯狂游乐场的分享设置，疯狂游乐场的SDK设计的比较奇葩，注意游戏内需要实现分享礼包
    private appId = "syj";
    private logoUrl: string = "http://cdn.ih5games.com/ZEROKRGAME/logo.png";
    private GAME_TITLE: string = '神游记修仙巨作';
    private GAME_DESC: string = '飞升境界，组队开黑，一起来神游修仙！';
    private TimelineConfig: ICrazyShareTimelineConfig;
    private FriendConfig: ICrazyShareFriendConfig;

    public init(): void {
        this.TimelineConfig = { // 分享朋友圈设置
            title: this.GAME_TITLE,
            imgUrl: this.logoUrl,
            success: this.shareCallback,// 分享成功在SDKManager.init()中配置            
            cancel: this.shareCancel,
        };
        this.FriendConfig = {   // 分享给好友的设置
            title: this.GAME_TITLE,
            desc: this.GAME_DESC,
            imgUrl: this.logoUrl,
            success: this.shareFriendCallback,// 分享成功在SDKManager.init()中配置
            cancel: this.shareFriendCancel,
        };
        SDKCrazyJS.init(
            this.appId,
            // shareConfig 
            this.TimelineConfig,
            // shareFriendConfig
            this.FriendConfig,
            this.payCallback
        );
    }

    // 登入路径
    private loginPath: string = "login";
    // 订单请求
    private orderPath: string = "order";
    // 分享奖励请求
    private sharePath: string = "share";
    // 关注奖励检查
    private focusPath: string = "focus";
    // 分享奖励信息
    private shareInfoPath: string = "shareInfo";
    //建角记录
    private createRolePath:string="create";
    /**
     * 登录参数包括
        userName=xx
        &userSex=1
        &time=1448290701
        &channel=hortor
        &sign=819fa78da41f7bf066aa83383e8502d4
        &userId=o9DKKs90lfJ7AORM05sE9gKQbjG8
        &userImg=http%3A%2F%2Fwx.qlogo.cn%2Fmmopen
        %2FPiajxSqBRaELIeefGksyG9bU3LwKJX7JpPTYtuoo6yROia5htWQia5UM
        FNVVQgvaQrh19If0LeX9ZcrLiao8HLLuPA%2F0
        &isSubscribe=true
        &shareCode=d3b24d971d3d89cb993779039d2ac9345616ded2
        &friendCode=
        &loginPlatform=wx
     */
    private static LoginParamName = {
        userName: "userName",
        userSex: "userSex",
        time: "time",
        channel: "channel",
        sign: "sign",
        userId: "userId",
        userImg: "userImg",
        isSubscribe: "isSubscribe",
        shareCode: "shareCode",
        friendCode: "friendCode",
        loginPlatform: "loginPlatform"
    };

    /**
     * 登录
     */
    public login(): void {
        var names = SDKCrazy.LoginParamName;

        var params = {};
        var log: string = "";
        for (var v in names) {
            var paramName = names[v];
            params[v] = SDKUtil.getDecodedString(paramName);
            log += paramName + "=" + params[v] + ",";
        }
        //egret.log(log);
        this.checkLogin(params);
    }

    private checkLogin(params) {
        var names = SDKCrazy.LoginParamName;
        //sign=md5(“friendCode=[friendCode]gameId=[xxxx]secret=[xxxxx]time=[xxxxx]userId=[xxxx]”)
        var signParams = {};
        signParams[names.friendCode] = encodeURI(params[names.friendCode]);
        signParams[names.userId] = encodeURI(params[names.userId]);
        signParams[names.time] = encodeURI(params[names.time]);
        signParams[names.sign] = encodeURI(params[names.sign]);

        var url = ChannelDefine.createURL(
            this.info,
            this.loginPath,
            signParams
        );

        // fixme test code
        egret.log("SDKCrazy.checkLogin whit url=" + url);

        HttpUtil.sendGetRequest(url, onLoginComplete, this);
        function onLoginComplete(event: egret.Event): void {
            var request = <egret.HttpRequest>event.currentTarget;
            var result = JSON.parse(request.response);

            // for (var v in result) {
            //     egret.log(v + "=" + result[v] + ",");
            // }
            if (ChannelDefine.checkResult(result)) {
                SDKCrazy.getInstance().updateLoginInfo(params);
                this.loginCallback();
            } else {
                // 重新登录
                egret.error("SDKCrazy.login() failed. Error sign.");
                this.loginFailed();
            }
        }
    }

    private updateLoginInfo(params) {
        var info = this.info;
        var names = SDKCrazy.LoginParamName;
        this.info.account = params[names.userId];
        this.info.nickName = params[names.userName];
        this.info.sex = params[names.userSex]
        //this.info.avatarUrl = params[names.userImg];
        this.info.focus = (params[names.isSubscribe] == "true");
        this.info.shareCode = params[names.shareCode];
        this.info.friendCode = params[names.friendCode];
    }

    public pay(payInfo: IPayInfo, owner: ISDKPayContainer): void {
        // 物品名称，支持中文，物品名称没有固定格式
        // 货币单位： 分
        var cent = payInfo.amount * 100;
        var diamond = payInfo.amount * 10;
        var goodsName = encodeURI(payInfo.goodsName + "x" + diamond);
        // 附加参数，支持中文, 可自由发挥
        var metaData: string = this.info.serverId + "*" + this.info.playerId + "*" + cent;
        metaData = encodeURI(metaData);
        // create order        
        // 参数
        /**
         * gameId=xxxx
            &goodsId=xxx
            &goodsName=xxx
            &userId=xxxx
            &money=xxx
            &ext=xxxx
            &time=xxxx
            &sign=xxxx
         */
        var orderParams = {
            // Fixme wtf
            "goodsId": "1",
            "goodsName": goodsName,
            "userId": this.info.account,
            "ext": metaData,
        };

        var url = ChannelDefine.createURL(
            this.info,
            this.orderPath,
            orderParams
        );
        HttpUtil.sendGetRequest(url, onGetOrderComplete, this);
        function onGetOrderComplete(event: egret.Event): void {
            var request = <egret.HttpRequest>event.currentTarget;
            var order = JSON.parse(request.response);
            SDKCrazyJS.pay(order);
        }
    }

    public payCallback(): void {
        //egret.log("SDKCrazy.payCallback()");
    }

    /**
     * 提示分享操作
     */
    public share(owner: ISDKShareContainer): void {
        this.shareContainer = owner;
        // 提示分享奖励
        this.requestShareInfo();
    }

    private requestShareInfo(): void {
        var params = {};
        params[SDKCrazy.LoginParamName.userId] = this.info.account;
        var url = ChannelDefine.createURL(
            this.info,
            this.shareInfoPath,
            params
        );

        //var url = "http://127.0.0.1:3000/sdk/1001/shareInfo?uid=hehe";
        HttpUtil.sendGetRequest(url, onShareInfoReceived, this);
        function onShareInfoReceived(event: egret.Event): void {
            var request = <egret.HttpRequest>event.currentTarget;
            var result = JSON.parse(request.response);
            egret.log("onShareInfoReceived success result="+result);
            var shareInfo: ISDKShareInfo = SDKCrazy.parseShareInfo(result);
            if (shareInfo) {
                this.shareContainer.showShareInfo(shareInfo);
            }
        }
    }

    public static parseShareInfo(result: any) {
        if (result.ret && result.ret != ChannelDefine.SUCCESS) {
            egret.error("SDKCrazy.parseShareInfo() return failed.");
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
    /**
     * 分享成功回调
     */
    public shareCallback(): void {
        SDKCrazy.getInstance().requestShareReward();
    }

    /**
     * 朋友圈分享取消
     */
    public shareCancel(): void {
        // var shareContainer:ISDKShareContainer = SDKCrazy.getInstance().shareContainer;
        // egret.log(shareContainer);
    }

    /**
     * 好友分享成功回调
     */
    public shareFriendCallback(): void {
        SDKCrazy.getInstance().shareCallback();
    }

    /**
     * 好友分享取消回调
     */
    public shareFriendCancel(): void {
        SDKCrazy.getInstance().shareCancel();
    }

    private requestShareReward() {
        this.shareContainer.shareComplete();
        //egret.log("SDKCrazy.requestShareReward()");
        // var info = SDKCrazy.getInstance().info; 
        // var sharePath = SDKCrazy.getInstance().sharePath;

        // var url = ChannelDefine.createURL(
        //     info,
        //     sharePath,
        //     {
        //         "userId": info.account,
        //         "server_id": info.serverId,
        //         "player_id": info.playerId
        //     }
        // );

        // HttpUtil.sendGetRequest(url, this.onShareComplete, this);    
        //var url = "http://127.0.0.1:3000/sdk/1002/share?userId=hehe&server_id=4&player_id=400001&";
    }

    private onShareComplete(event: egret.Event): void {
        var request = <egret.HttpRequest>event.currentTarget;
        var result = JSON.parse(request.response);
        //egret.log("SDKCrazy.onShareComplete() result=" + result.ret);
        if (result.ret) {
            return;
        }
        var shareInfo: ISDKShareInfo = SDKCrazy.parseShareInfo(result);
        if (shareInfo) {
            var shareContainer: ISDKShareContainer = this.shareContainer;
            shareContainer.updateShareInfo(shareInfo);
        }
    }

    public subscribe(): void {
        SDKCrazyJS.subscribe();
    }

    public onEnterGame(loginInfo: ILoginInfo, playerInfo: IPlayerInfo) {
        if (!Boolean(this.info.focus)) {
            return;
        }
        var url = ChannelDefine.createURL(
            this.info,
            this.focusPath,
            {
                "userId": this.info.account,
                "server_id": this.info.serverId,
                "player_id": this.info.playerId
            });
        HttpUtil.sendGetRequest(url, null, this);
    }

    //1843疯狂新增建角记录
    public onCreateRole(loginInfo: ILoginInfo, playerInfo: IPlayerInfo){
        egret.log("疯狂 onCreateRole（）")
        if (!playerInfo) {
            return;
        }
        var url = ChannelDefine.createURL(
            this.info,
            this.createRolePath,
            {
                "user_id": this.info.account,
                "server_id": this.info.serverId,
                "sign":this.info.sign,
                "player_name": playerInfo.name
            });
            Tool.log("疯狂新增建角记录"+url);
        HttpUtil.sendGetRequest(url, null, this);
    }
}


