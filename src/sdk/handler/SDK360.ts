class SDK360 implements ISDKHandler {
    public info: ILoginInfo;
    public loginCallback: () => void;
    public loginFailed: () => void;
    public shareContainer: ISDKShareContainer;
    public payContainer: ISDKPayContainer;

    private static _instance: SDK360;
    constructor() {}

    private logoUrl: string = "http://cdn.ih5games.com/FREEGAME/logo.png";
    private GAME_TITLE: string = '';
    private GAME_DESC: string = '';

    // 没有强制限制，仿一个Singleton
    public static getInstance(): SDK360 {
        if (this._instance == null) {
            this._instance = new SDK360();
        }
        return this._instance;
    }

    public init() {
    };

	public login(){
	}

    private access_token;

    // 请求路径
    private loginPath: string = "login";
    // 检查角色接口
    private checkUserPath: string = "check_user";
	//兑换元宝接口
	private exchangePath: string = "exchange";
	//生成exts
	private createOrderPath: string = "create_order";

    /**
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
            egret.error("SDK360.login() failed. Error sign.");
            this.loginFailed();
        }
    }
    public pay(payInfo: IPayInfo, owner: ISDKPayContainer): void {
        this.payContainer = owner;
        var params = {
            amount: payInfo.amount, //	订单或商品的名称	varchar(128)
			item_id: payInfo.amount+"_"+this.info.serverId+"_"+this.info.playerId,
			goods_name:"钻石",
			qid:this.info.account,
			rate:payInfo.amount,
			gname:"神游记"
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
            egret.log("360 onCreateOrder request="+request)
            var order = JSON.parse(request.response);
            egret.log("360 onCreateOrder order="+order)
            if (order) {
                SDK360JS.pay(order);
            }
        } catch (e) {
            egret.error("SDK360.createOrder faied. " + e.message);
        }
    }

}