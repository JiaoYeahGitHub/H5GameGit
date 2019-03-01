class SDKEZ implements ISDKHandler{
	public info: ILoginInfo;
    public loginCallback: () => void;
    public loginFailed: () => void;
    public shareContainer: ISDKShareContainer;
    public payContainer: ISDKPayContainer;

    private static _instance: SDKEZ;

    private payPath="create_order";
       // 关注奖励检查
    private focusPath: string = "focus";

    public isSupportShare=false;
    constructor() {}

    public static getInstance(): SDKEZ {
        if (this._instance == null) {
            this._instance = new SDKEZ();
        }
        return this._instance;
    }

    public static shareData={
                "title": "神游记",
                "content": "飞升境界，组队开黑，一起来神游修仙！",
                "imgurl": "http://cdn.ih5games.com/ZXFML/logo1005.png",
                "ext": "1018"
            }
    public init() {
        SDKEZJS.setGameMusic(this.comeBackGame,this.underHomeButton);
        this.isSupportShare=SDKEZJS.setShareInfo(SDKEZ.shareData,this.shareSuccessCallback);
    };

    public setShareInfoCallBack(ret): void{
        egret.log(ret)
    }
    public share(owner: ISDKShareContainer): void {
        this.shareContainer = owner;
        SDKEZJS.doShare(SDKEZ.shareData,this.shareSuccessCallback);
    }

    public shareSuccessCallback(ret): void {
        egret.log("SDKEZ 分享成功 ret="+ret)
        var shareContainer: ISDKShareContainer = SDKEZ.getInstance().shareContainer;
        shareContainer.shareComplete();
    }

    public underHomeButton() {
        SoundFactory.stopMusic(SoundDefine.SOUND_BGM);
    }

    public comeBackGame() {
        SoundFactory.playMusic(SoundDefine.SOUND_BGM);
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
            "feeid":payInfo.amount,
            "fee": payInfo.amount*100,
            "feename":payInfo.goodsName,
            "extradata":this.info.serverId+"_"+this.info.playerId+"_"+payInfo.amount,
            "serverid":this.info.serverId,
            "rolename":payInfo.playerInfo.name,
            "roleid":this.info.playerId,
            "servername":"神游记"+this.info.serverId
        });
        HttpUtil.sendGetRequest(url, this.createOrderCallback, this);
    }

    public createOrderCallback(event: egret.Event):void{
        var request = <egret.HttpRequest>event.currentTarget;
        var info = JSON.parse(request.response);
        egret.log(info)
 	    SDKEZJS.pay(info,this.payCallback);
    }

    public payCallback(data:any):void{

    }

    public subscribe(): void {
        SDKEZJS.doFocus(null,null);
        if(this.info.subChannel==10233){
            
        }
    }

     public onCreateRole(loginInfo: ILoginInfo, playerInfo: IPlayerInfo) {
           var roleInfoJSON ={
        	datatype: 2,//必填1.选择服务器2.创建角色3.进入游戏4.等级提升5.退出游戏
        	serverid: this.info.serverId,
        	servername: "神游记" + this.info.serverId + "服",
        	roleid: playerInfo.id,
        	rolename: playerInfo.name,
        	rolelevel: playerInfo.level,
        	fightvalue: 4396,
        	moneynum: playerInfo.gold,
        	rolecreatetime: new Date().getTime(),
        	rolelevelmtime: new Date().getTime(),
        	gender: playerInfo.sex,
        	professionid: 0,
        	profession: "0",
        	vip : 0,
        	partyid : 1,
        	partyname : "神游机 ",
        	partyroleid : 7,
        	partyrolename : "神游机",
        	friendlist : [{
        		"roleid ": "0",
        		"intimacy ": "100",
        		"nexusid ": "6 "
        	}]
        }
        // var roleInfoJson = JSON.stringify(roleInfo);
        SDKEZJS.reportRoleStatus(roleInfoJSON);
    }

    public uploadGameRoleInfo(player: Player, iscr: boolean): void {
             var roleInfoJSON ={
        	datatype: 4,//必填1.选择服务器2.创建角色3.进入游戏4.等级提升5.退出游戏
        	serverid: this.info.serverId,
        	servername: "神游记" + this.info.serverId + "服",
        	roleid: player.id,
        	rolename: player.name,
        	rolelevel: player.level,
        	fightvalue: 4396,
        	moneynum: player.gold,
        	rolecreatetime: player.createTime,
        	rolelevelmtime: new Date().getTime(),
        	gender: player.sex,
        	professionid: 0,
        	profession: "0",
        	vip : player.viplevel,
        	partyid : 1,
        	partyname : "神游机 ",
        	partyroleid : 7,
        	partyrolename : "神游机",
        	friendlist : [{
        		"roleid ": "0",
        		"intimacy ": "100",
        		"nexusid ": "6 "
        	}]
        }
        // var roleInfoJson = JSON.stringify(roleInfo);
        SDKEZJS.reportRoleStatus(roleInfoJSON);
    }

}