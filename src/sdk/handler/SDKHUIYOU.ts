class SDKHUIYOU implements ISDKHandler{
	public info: ILoginInfo;
    public loginCallback: () => void;
    public loginFailed: () => void;
    public shareContainer: ISDKShareContainer;
    public payContainer: ISDKPayContainer;

    private static _instance: SDKHUIYOU;

    constructor() {}

    public static getInstance(): SDKHUIYOU {
        if (this._instance == null) {
            this._instance = new SDKHUIYOU();
        }
        return this._instance;
    }

    public init() {

    };
    public share(owner: ISDKShareContainer): void {

    }

    public login(): void {
       
    }

    public onEnterGame(loginInfo: ILoginInfo, playerInfo: IPlayerInfo) {
   
    }

    public pay(payInfo: IPayInfo, owner: ISDKPayContainer): void {
        var time=new Date().getTime();
		var data = {
            orderid: this.info.serverId+"_"+this.info.playerId+"_"+payInfo.amount+"_"+time,    // 订单号 例如'1291301391_202930_1323'
            price: payInfo.amount*100,         //最小单位分 例如 '100'
            goodsname: payInfo.goodsName,  //商品名   例如 '100元宝'
            ext: this.info.serverId+"_"+this.info.playerId+"_"+payInfo.amount//扩展信息   
	    }
        SDKHUIYOUJS.pay(data);
    }

    public subscribe(): void {
    }

     public onCreateRole(loginInfo: ILoginInfo, playerInfo: IPlayerInfo) {

    }
}