class SDKQH implements ISDKHandler{
	public info: ILoginInfo;
    public loginCallback: () => void;
    public loginFailed: () => void;
    public shareContainer: ISDKShareContainer;
    public payContainer: ISDKPayContainer;

    private static _instance: SDKQH;

    private payPath="create_order";
       // 关注奖励检查
    private focusPath: string = "focus";

    private gid='3946';

    constructor() {}

    public static getInstance(): SDKQH {
        if (this._instance == null) {
            this._instance = new SDKQH();
        }
        return this._instance;
    }

    public init() {

    };
    public share(owner: ISDKShareContainer): void {
        this.shareContainer = owner;
        SDKQHJS.doShare(this.shareSuccessCallback)
    }

    public shareSuccessCallback(): void {
           var shareContainer: ISDKShareContainer = SDKQH.getInstance().shareContainer;
           shareContainer.shareComplete();
    }

    public login(): void {
       
    }

    public onEnterGame(loginInfo: ILoginInfo, playerInfo: IPlayerInfo) {
        if (!this.info.focus) {
            return;
        }
        var url = ChannelDefine.createURL(
            this.info,
            this.focusPath,
            {
                "uid": this.info.account,
                "server_id": this.info.serverId,
                "player_id": this.info.playerId,
                "subChannel":loginInfo.subChannel
            });
        HttpUtil.sendGetRequest(url, null, this);
    }

    public pay(payInfo: IPayInfo, owner: ISDKPayContainer): void {
		this.payContainer = owner;
        var url = ChannelDefine.createURL(
            this.info,
            this.payPath,
            { 
			   "userId":this.info.account,
			   "gid":this.gid,
			   "roleName":payInfo.playerInfo.name,
			   'goodsId':payInfo.amount,
			   "goodsName":payInfo.goodsName, 
			   "money":payInfo.amount,
			   "ext":this.info.serverId+"_"+this.info.playerId+"_"+payInfo.amount,
			   "serverId":this.info.serverId
			});
        HttpUtil.sendGetRequest(url, this.createOrderCallback, this);
    }

    public createOrderCallback(event: egret.Event):void{
        var request = <egret.HttpRequest>event.currentTarget;
        var info = JSON.parse(request.response);
        egret.log("群黑充值订单内容"+request.response)
        SDKQHJS.pay(info,this.payCallback);
    }

    public payCallback(data:any):void{

    }

    public subscribe(): void {
        SDKQHJS.doFocus();
    }

     public onCreateRole(loginInfo: ILoginInfo, playerInfo: IPlayerInfo) {
            var roledata = {
                "act":"1",
                "serverid":this.info.serverId,
                "rolename":playerInfo.name,
                "roleid":playerInfo.id,
                "level":"1"
            };
        SDKQHJS.reportRoleStatus(roledata);
    }

    public uploadGameRoleInfo(player: Player, iscr: boolean): void {
            var roledata = {
                "act":"2",
                "serverid":this.info.serverId,
                "rolename":player.name,
                "roleid":player.id,
                "level":"1"
            };
        SDKQHJS.reportRoleStatus(roledata);
    }

}