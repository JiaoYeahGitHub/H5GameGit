class SDKAWY implements ISDKHandler {
    public info: ILoginInfo;
    public loginCallback: () => void;
    public loginFailed: () => void;
    public shareContainer: ISDKShareContainer;

    private static _instance: SDKAWY;
    constructor() { }

    // 没有强制限制，仿一个Singleton
    public static getInstance(): SDKAWY {
        if (this._instance == null) {
            this._instance = new SDKAWY();
        }
        return this._instance;
    }

    private APPID = 347;
    public init() {
        SDKAWYJS.init(this.APPID, this.shareSuccessCallback);
        SDKAWYJS.shareParams(this.GAME_DESC, this.GAME_TITLE, this.logoUrl);
    };

    private disableFocus: boolean = false;

    // 请求路径
    private loginPath: string = "login";
    // 关注奖励检查
    private focusPath: string = "focus";
    // 请求分享奖励
    private sharePath: string = "share";
    // 分享奖励信息
    private shareInfoPath: string = "shareInfo";
    // 礼包信息
    private giftPath: string = "gift";
    //分享参数
    private logoUrl: string = "http://cdn.ih5games.com/FREEGAME/logo.png";
    private GAME_TITLE: string = '神游记修仙巨作';
    private GAME_DESC: string = '飞升境界，组队开黑，一起来神游修仙！';
    public login(): void {
        var userToken = SDKUtil.getQueryString("token");
        // 邀请人uid 
        var fuid = SDKUtil.getQueryString("fuid");
        // 是否关注（1：关注） 
        var focus = SDKUtil.getQueryString("focus");
        //egret.log("userToken=" + userToken + ",fuid=" + fuid + ",focus=" + focus);
        var disableFocus = (SDKUtil.getQueryString("disableFocus") == "1");

        var url = ChannelDefine.createURL(
            this.info,
            this.loginPath,
            { "userToken": userToken });
        HttpUtil.sendGetRequest(url, this.onGetAppSigComplete, this);

    }

    private onGetAppSigComplete(event: egret.Event): void {
        var request = <egret.HttpRequest>event.currentTarget;
        var info = JSON.parse(request.response);
        if ((!info.ret) && (info.uid)) {
            this.info.account = info.uid;
            this.info.nickName = decodeURI(info.nickname);
            //this.info.avatarUrl =  info.headimgurl;
            this.info.focus = info.focus;
            this.info.disableFocus = this.disableFocus;
            this.loginCallback();
        } else {
            SDKAWYJS.logout();
            this.loginFailed();
        }
    }

    public onEnterGame(loginInfo: ILoginInfo, playerInfo: IPlayerInfo) {
        var verify = SDKUtil.getQueryString("verify");
        if(verify&&verify=="1"){
            var u=this.getGiftInfo(1);
            egret.log("onEnterGame get url="+u);
             HttpUtil.sendGetRequest(u,this.giftCallback, this);
        }

        if (!this.info.focus) {
            return;
        }
        var url = ChannelDefine.createURL(
            this.info,
            this.focusPath,
            {
                "uid": this.info.account,
                "server_id": this.info.serverId,
                "player_id": this.info.playerId
            });
        HttpUtil.sendGetRequest(url, null, this);
    }

    private giftCallback(event: egret.Event){
     	var request = <egret.HttpRequest>event.currentTarget;
    	var result = JSON.parse(request.response);
		egret.log("giftCallback:"+result);
		if(result==2+""){
		 var message = new Message(MESSAGE_ID.VERIFY_GIFT);
		 message.setByte(1);
		 GameCommon.getInstance().sendMsgToServer(message);
        }
    }

    private static GOODS_DEFINE = {
        // 测试物品
        //0.01:8598,  
        1: 11368,
        10: 11369,
        20: 11370,
        28: 11371,
        50: 11463,
        88: 11464,
        99: 11465,
        100: 11466,
        198: 11467,
        200: 11468,
        500: 11469,
        1000: 11470,
        1500: 11471,
        2000: 11472,
        3000: 11473,
    }

    public pay(payInfo: IPayInfo, owner: ISDKPayContainer): void {
        var metadata = this.info.serverId + "*" + this.info.playerId;
        metadata = encodeURI(metadata);
        var pid = SDKAWY.GOODS_DEFINE[payInfo.amount];
        var option = {
            userdata: metadata, // 自定义参数
            pid: pid,   // 商品ID AWY 后台自动生成
            txid: ""      // 商户订单号（可选，目前不选）
        }
        SDKAWYJS.pay(option);
    }

    public subscribe(): void {
        SDKAWYJS.subscribe();
    }

    public share(owner: ISDKShareContainer): void {
        this.shareContainer = owner;
        SDKAWYJS.share();
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
            var shareInfo: ISDKShareInfo = SDKAWY.parseShareInfo(result);
            if (shareInfo) {
                this.shareContainer.showShareInfo(shareInfo);
            }
        }
    }

    public static parseShareInfo(result: any) {
        if (result.ret && result.ret != ChannelDefine.SUCCESS) {
            egret.error("SDKAWY.parseShareInfo() return failed.");
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


    public shareSuccessCallback(type): void {
        //egret.log("SDKAWY.shareCallback(). type=" + type);
        var shareContainer: ISDKShareContainer = SDKAWY.getInstance().shareContainer;
        //egret.log(shareContainer);
        //SDKAWY.getInstance().requestShareReward();
        shareContainer.shareComplete();
    }

    // private requestShareReward() {
    //     var info = SDKAWY.getInstance().info;
    //     var sharePath = SDKAWY.getInstance().sharePath;
    //     var url = ChannelDefine.createURL(
    //         info,
    //         sharePath,
    //         {
    //             "uid": info.account,
    //             "server_id": info.serverId,
    //             "player_id": info.playerId
    //         }
    //     );
    //     HttpUtil.sendGetRequest(url, this.onShareComplete, this);
    // }

    // private onShareComplete(event: egret.Event): void {
    //     var request = <egret.HttpRequest>event.currentTarget;
    //     var result = JSON.parse(request.response);
    //     if (result.ret) {
    //         return;
    //     }
    //     var shareInfo: ISDKShareInfo = SDKAWY.parseShareInfo(result);
    //     if (shareInfo) {
    //         var shareContainer: ISDKShareContainer = this.shareContainer;
    //         shareContainer.updateShareInfo(shareInfo);
    //     }
    // }

    public doCheckVerify(){
        SDKAWYJS.verify(this.verifyCallback);
    }
    public verify:number=1; 
    private verifyCallback(data:any){
        egret.log(data);
        if(data){
          SDKAWY.getInstance().verify=data.error;
          egret.log(this.verify);
        }
         var message = new Message(MESSAGE_ID.VERIFY_GIFT);
		 message.setByte(0);
		 GameCommon.getInstance().sendMsgToServer(message);
    }

    public getGiftInfo(type:number): string {
        var url = ChannelDefine.createURL(
            this.info,
            this.giftPath,
            {
                account: this.info.account,
                check: type+""
            });
        return url;
    }
}