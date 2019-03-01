class SDKVIVO implements ISDKHandler{
	public info: ILoginInfo;
    public loginCallback: () => void;
    public loginFailed: () => void;
    public shareContainer: ISDKShareContainer;
    public payContainer: ISDKPayContainer;

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

    private static _instance: SDKVIVO;
    constructor() {}

    // 没有强制限制，仿一个Singleton
    public static getInstance(): SDKVIVO {
        if (this._instance == null) {
            this._instance = new SDKVIVO();
        }
        return this._instance;
    }

    public init() {
        SDKVIVOJS.logout(this.underHomeButton);
    };

    // 登录请求路径
    private loginPath: string = "login";
    // 付费请求路径
    private payPath: string = "create_order";

	private appid:string="618d62357303afef631e21c908cbdb86";

    public login(): void {
       
    }

    private underHomeButton() {
        SoundFactory.stopMusic(SoundDefine.SOUND_BGM);
    }

    private comeBackGame() {
        SoundFactory.playMusic(SoundDefine.SOUND_BGM);
    }

    public onEnterGame(loginInfo: ILoginInfo, playerInfo: IPlayerInfo) {
  
    }

    public pay(payInfo: IPayInfo, owner: ISDKPayContainer): void {
		this.payContainer = owner;
 		var url = ChannelDefine.createURL(
            this.info,
            this.payPath,
            {
                goodsName: payInfo.goodsName,
                amount: payInfo.amount,
                serverId: this.info.serverId,
                playerId: this.info.playerId
            });
        HttpUtil.sendGetRequest(url, this.createOrderCallback, this);
    }

	private createOrderCallback(event: egret.Event) {
        var request = <egret.HttpRequest>event.currentTarget;
        var result = JSON.parse(request.response);
		if(result){
            var resultJson=JSON.parse(result.ret);
			if(resultJson.respCode=="200"){
				var orderInfo = {
					productName: "元宝",
					productDes:"元宝",
					productPrice: resultJson.orderAmount,
					vivoSignature: resultJson.accessKey,
					appId: this.appid,
					transNo: resultJson.orderNumber,
					uid: this.info.account
				}
				SDKVIVOJS.pay(orderInfo);
			}
		}
    }
}