class SDKHW implements ISDKHandler{
	public info: ILoginInfo;
    public loginCallback: () => void;
    public loginFailed: () => void;
    public shareContainer: ISDKShareContainer;
    public payContainer: ISDKPayContainer;

    private static _instance: SDKHW;
    constructor() {}

    // 没有强制限制，仿一个Singleton
    public static getInstance(): SDKHW {
        if (this._instance == null) {
            this._instance = new SDKHW();
        }
        return this._instance;
    }

    public init() {

    };

    // 登录请求路径
    private loginPath: string = "login";
    // 付费请求路径
    private payPath: string = "create_order";

    public login(): void {
       
    }

    public onEnterGame(loginInfo: ILoginInfo, playerInfo: IPlayerInfo) {
  
    }

    public pay(payInfo: IPayInfo, owner: ISDKPayContainer): void {
        // alert("huawei pay begin")
		this.payContainer = owner;
 		var url = ChannelDefine.createURL(
            this.info,
            this.payPath,
            {
					amount: Tool.currencyTo(payInfo.amount),
                    goodsname: payInfo.goodsName,
					requestId:this.info.serverId+"_"+this.info.playerId+"_"+payInfo.amount+"_"+(new Date().getTime()),
					extReserved:this.info.serverId+"_"+this.info.playerId+"_"+payInfo.amount+"_"+this.info.account
            });
        // alert("huawei pay url="+url);
        HttpUtil.sendGetRequest(url, this.createOrderCallback, this);
    }

	private createOrderCallback(event: egret.Event) {
        var request = <egret.HttpRequest>event.currentTarget;
        var result = JSON.parse(request.response);
		if(result){
        	egret.log(result);
            // alert("createOrderCallback data="+JSON.stringify(result))
			SDKHWJS.pay(JSON.stringify(result));
		}
    }
}