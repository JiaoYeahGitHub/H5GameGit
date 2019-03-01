class SDKNeZha implements ISDKHandler{
	public info: ILoginInfo;
    public loginCallback: () => void;
    public loginFailed: () => void;
    public shareContainer: ISDKShareContainer;
    public payContainer: ISDKPayContainer;

    private static _instance: SDKNeZha;

    private payPath="create_order";

    constructor() {}

    public static getInstance(): SDKNeZha {
        if (this._instance == null) {
            this._instance = new SDKNeZha();
        }
        return this._instance;
    }

    public init() {

    };
    public share(owner: ISDKShareContainer): void {

    }

    public shareSuccessCallback(): void {

    }

    public login(): void {
       
    }

    public onEnterGame(loginInfo: ILoginInfo, playerInfo: IPlayerInfo) {

    }

    public pay(payInfo: IPayInfo, owner: ISDKPayContainer): void {
		this.payContainer = owner;
        var payData={
            order_id:this.info.serverId+"_"+this.info.playerId+"_"+payInfo.amount+"_"+(new Date().getTime()),
            goods_name:payInfo.goodsName,
            amount:payInfo.amount,
            ext:this.info.serverId+"_"+this.info.playerId+"_"+payInfo.amount,
            product_id:payInfo.amount
        }
        SDKNeZhaJS.pay(payData);
    }

    public subscribe(): void {

    }

     public onCreateRole(loginInfo: ILoginInfo, playerInfo: IPlayerInfo) {

    }
}