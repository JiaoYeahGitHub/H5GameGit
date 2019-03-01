class SDKYYB implements ISDKHandler {
    public info: ILoginInfo;
    public loginCallback: () => void;
    public loginFailed: () => void;

    /** 米大师支付的offerid 默认从url取 */
    private offerid: string;
    /** 用户openid 默认从url取 */
    private openid: string;
    /** 用户openkey 默认从url取 */
    private openkey: string;
    /** 充值平台标识 默认从url取 */
    private pf: string;
    /** 充值平台密钥 默认从url取 */
    private pfkey: string;

    private static _instance: SDKYYB;
    constructor() { }

    // 没有强制限制，仿一个Singleton
    public static getInstance(): SDKYYB {
        if (this._instance == null) {
            this._instance = new SDKYYB();
        }
        return this._instance;
    }

    public init() {
    };

    // 登录请求路径
    private loginPath: string = "login";
    // 付费请求路径
    private payPath: string = "pay";
    // 余额检查路径
    private balancePath: string = "balance";

    private static ParamNameDefine = {
        offerid: "offerid",
        openid: "openid",
        openkey: "openkey",
        pf: "pf",
        pfkey: "pfkey",
    };

    public login(): void {
        var names = SDKYYB.ParamNameDefine;
        this.offerid = SDKUtil.getQueryString(names.offerid);
        this.openid = SDKUtil.getQueryString(names.openid);
        this.openkey = SDKUtil.getQueryString(names.openkey);
        this.pf = SDKUtil.getQueryString(names.pf);
        this.pfkey = SDKUtil.getQueryString(names.pfkey);
        //egret.log("userToken=" + userToken + ",fuid=" + fuid + ",focus=" + focus);
        var url = ChannelDefine.createURL(
            this.info,
            this.loginPath,
            {
                openid: this.openid,
                openkey: this.openkey,
                pf: this.pf
            });
        HttpUtil.sendGetRequest(url, this.onGetUserInfoComplete, this);
    }

    private onGetUserInfoComplete(event: egret.Event): void {
        var request = <egret.HttpRequest>event.currentTarget;
        var info = JSON.parse(request.response);
        if ((!info.ret)) {
            this.info.account = this.openid,
                this.info.nickName = decodeURI(info.nickname),
                this.loginCallback();
        } else {
            this.loginFailed();
        }
    }

    public onEnterGame(loginInfo: ILoginInfo, playerInfo: IPlayerInfo) {
    }

    public pay(payInfo: IPayInfo, owner: ISDKPayContainer): void {
        var self = this;
        var onError = function (ret) {
            if (ret.code != 2) { //取消 差个常量定义没给
                owner.showTips("Error:" + ret.code + "," + ret.msg);
            }
        };
        var onSuccess = function (ret) {
            //egret.log(ret.code, ret.msg);
            self.requestPay(payInfo.amount);
        };
        try {
            var option: IYYBPayOption = {
                saveValue: payInfo.amount * 10,
                zoneId: <any>this.info.serverId,
                offerid: this.offerid,
                openid: this.info.account,
                openkey: this.openkey,
                pf: this.pf,
                pfkey: this.pfkey,
                onError: onError,
                onSuccess: onSuccess
            }
            SDKYYBJS.pay(option);
        } catch (e) {
            //egret.error("SDKYYBJS.pay() failed." + e.message);
            owner.showTips("Exception:" + e.message);
        }
    }

    public requestPay(amount: number) {
        var url = ChannelDefine.createURL(
            this.info,
            this.payPath,
            {
                openid: this.openid,
                openkey: this.openkey,
                appid: this.offerid,
                pf: this.pf,
                pfkey: this.pfkey,
                zoneid: this.info.serverId,
                playerid: this.info.playerId,
                amount: amount
            });
        //egret.log(url);
        HttpUtil.sendGetRequest(url, null, this);
    }
}