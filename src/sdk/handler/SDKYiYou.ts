class SDKYiYou implements ISDKHandler{
	public info: ILoginInfo;
    public loginCallback: () => void;
    public loginFailed: () => void;
    public shareContainer: ISDKShareContainer;
    public payContainer: ISDKPayContainer;

    private static _instance: SDKYiYou;

    private payPath="create_order";
       // 关注奖励检查
    private focusPath: string = "focus";

    private appkey='1eb22d96883f272478a0c4f8478a7a6a';

    constructor() {}

    public static getInstance(): SDKYiYou {
        if (this._instance == null) {
            this._instance = new SDKYiYou();
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
        // if (!this.info.focus) {
        //     return;
        // }
        // var url = ChannelDefine.createURL(
        //     this.info,
        //     this.focusPath,
        //     {
        //         "uid": this.info.account,
        //         "server_id": this.info.serverId,
        //         "player_id": this.info.playerId,
        //         "subChannel":loginInfo.subChannel
        //     });
        // HttpUtil.sendGetRequest(url, null, this);
    }

    public pay(payInfo: IPayInfo, owner: ISDKPayContainer): void {
		this.payContainer = owner;
        var url = ChannelDefine.createURL(
            this.info,
            this.payPath,
            { 
			   "userid":this.info.account,
			   "roleid":payInfo.playerInfo.id,
			   'goodsid':payInfo.amount,
			   "goodsName":payInfo.goodsName, 
			   "amt":payInfo.amount,
			   "custom":this.info.serverId+"_"+this.info.playerId+"_"+payInfo.amount,
			   "server_id":this.info.serverId
			});
        HttpUtil.sendGetRequest(url, this.createOrderCallback, this);
    }

    public createOrderCallback(event: egret.Event):void{
        var request = <egret.HttpRequest>event.currentTarget;
        var info = JSON.parse(request.response);
        SDKYUJS.pay(info.code);
    }

    public subscribe(): void {
    }

     public onCreateRole(loginInfo: ILoginInfo, playerInfo: IPlayerInfo) {
            var roledata = {
                "serverid":loginInfo.serverId,
                "servername":"神游记"+loginInfo.serverId+"区",
                "roleid":playerInfo.id,
                "rolename":playerInfo.name,
                "rolelevel":playerInfo.level,
                "appkey":this.appkey,
                "account":loginInfo.account
            };
        SDKYUJS.reportRoleStatus(roledata);
    }

    public uploadGameRoleInfo(player: Player, iscr: boolean): void {
          var roledata = {
                 "serverid":this.info.serverId,
                "servername":"神游记"+this.info.serverId+"区",
                "roleid":player.id,
                "rolename":player.name,
                "rolelevel":player.level,
                "appkey":this.appkey,
                "account":this.info.account
            };
        SDKYUJS.reportRoleStatus(roledata);
    }

}