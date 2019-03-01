class SDKKAOPU implements ISDKHandler {
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

    private static _instance: SDKKAOPU;
    constructor() {}

    // 没有强制限制，仿一个Singleton
    public static getInstance(): SDKKAOPU {
        if (this._instance == null) {
            this._instance = new SDKKAOPU();
        }
        return this._instance;
    }

    public init() {
        //注册分享
        SDKKAOPUJS.addShareEventListener(this.shareCallback);
    };

    //分享回调
    public shareCallback(data){
        if(data.success==true){
            var shareContainer: ISDKShareContainer = SDKKAOPU.getInstance().shareContainer;
            shareContainer.shareComplete();
        }
    }

    // 登录请求路径
    private loginPath: string = "login";
    // 付费请求路径
    private payPath: string = "pay";
    // 余额检查路径
    private balancePath: string = "balance";

    public login(): void {
       
    }

    public onEnterGame(loginInfo: ILoginInfo, playerInfo: IPlayerInfo) {
  
    }

    public pay(payInfo: IPayInfo, owner: ISDKPayContainer): void {
        this.payContainer = owner;
         var orderInfo = {
            orderid: this.info.serverId+"_"+this.info.playerId+"_"+payInfo.amount+"_"+(new Date().getTime()),
            itemsid:payInfo.amount,
            itemsname: payInfo.goodsName,
            amount: 0.01//payInfo.amount
        }
        SDKKAOPUJS.pay(orderInfo,this.payCallback);
    }

    private payCallback(){
        egret.log("支付成功")
    }

    public requestPay(amount: number) {
  
    }

    public share(owner: ISDKShareContainer): void {
        this.shareContainer = owner;
        SDKKAOPUJS.doSetCustomShareData();
    }

    public onCreateRole(loginInfo: ILoginInfo, playerInfo: IPlayerInfo) {
          var roleData={
                datatype:0,
                rolename: playerInfo.name,
                uopenid: loginInfo.account,
                gameserver: "",
                gameserverid:loginInfo.serverId,
                rolelevel:"1",
                rolecombatval:3700
        }
        SDKKAOPUJS.doCreateRole(roleData)
    }
}