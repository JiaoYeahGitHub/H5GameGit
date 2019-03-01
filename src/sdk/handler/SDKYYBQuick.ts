class SDKYYBQuick implements ISDKHandler {
    public info: ILoginInfo;
    public loginCallback: () => void;
    public loginFailed: () => void;
    public shareContainer: ISDKShareContainer;
    public payContainer: ISDKPayContainer;

    private static _instance: SDKYYBQuick;
    constructor() { }

    private logoUrl: string = "http://cdn.ih5games.com/FREEGAME/logo.png";
    private GAME_TITLE: string = '';
    private GAME_DESC: string = '';
    private productCode = "82412263441748385012336395398866";

    // 没有强制限制，仿一个Singleton
    public static getInstance(): SDKYYBQuick {
        if (this._instance == null) {
            this._instance = new SDKYYBQuick();
        }
        return this._instance;
    }

    public init() {
        SDKQuickJS.setOnResumeNotification(this.comeBackGame);
        SDKQuickJS.setOnStopNotification(this.underHomeButton);
    };

    public login() {

    }

    private underHomeButton() {
        SoundFactory.stopMusic(SoundDefine.SOUND_BGM);
    }

    private comeBackGame() {
        SoundFactory.playMusic(SoundDefine.SOUND_BGM);
    }

    private access_token;

    // 请求路径
    private loginPath: string = "login";
    // 检查角色接口
    private checkUserPath: string = "check_user";
    //兑换元宝接口
    private exchangePath: string = "exchange";

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
            egret.error("SDKYYBQuick.login() failed. Error sign.");
            this.loginFailed();
        }
    }
    public pay(payInfo: IPayInfo, owner: ISDKPayContainer): void {
        this.payContainer = owner;
        var url = ChannelDefine.createURL(
            this.info,
            this.exchangePath, null);

        //HttpUtil.sendGetRequest(url, this.onCreateOrder, this);
        var orderInfo = {
            productCode: this.productCode,
            uid: this.info.account,
            userRoleId: this.info.playerId,
            userRoleName: this.info.gamename,
            userServer: this.info.serverId,
            userLevel: payInfo.playerInfo.level,//用户等级
            cpOrderNo: "hafdwioahfiabwfojow",//需要生成顶单
            amount: payInfo.amount,
            subject: payInfo.goodsName,
            desc: "元宝",
            callbackUrl: "",//callback
            extrasParams: this.info.serverId + "_" + this.info.playerId + "_" + payInfo.amount,//额外参数
            goodsId: payInfo.amount,
            count: 1,
            quantifier: "份"
        }
        var orderInfoJson = JSON.stringify(orderInfo);
        SDKQuickJS.pay(orderInfoJson);
    }

    public onCreateRole(loginInfo: ILoginInfo, playerInfo: IPlayerInfo) {
        var roleInfo = {
            isCreateRole: true,
            roleCreateTime: new Date().getTime(),
            serverId: this.info.serverId,
            serverName: "神游记" + this.info.serverId + "服",
            userRoleName: playerInfo.name,
            userRoleId: playerInfo.id,
            userRoleBalance: playerInfo.gold,
            vipLevel: 0,
            userRoleLevel: playerInfo.level,
            partyId: 1,
            partyName: '行会名称',
            gameRoleGender: '男',
            gameRolePower: 1250,
            partyRoleId: 1,
            partyRoleName: '群众',
            professionId: '1',
            profession: '朝阳群众',
            friendlist: ''
        }
        var roleInfoJson = JSON.stringify(roleInfo);
        SDKQuickJS.uploadGameRoleInfo(roleInfoJson);
    }

    public uploadGameRoleInfo(player: Player, iscr: boolean): void {
        var roleInfo = {
            isCreateRole: iscr,
            roleCreateTime: player.createTime,
            serverId: this.info.serverId,
            serverName: "神游记" + this.info.serverId + "服",
            userRoleName: player.name,
            userRoleId: player.id,
            userRoleBalance: player.gold,
            vipLevel: player.viplevel,
            userRoleLevel: player.level,
            partyId: 1,
            partyName: '行会名称',
            gameRoleGender: '男',
            gameRolePower: player.playerTotalPower,
            partyRoleId: 1,
            partyRoleName: '群众',
            professionId: '1',
            profession: '朝阳群众',
            friendlist: ''
        }
        var roleInfoJson = JSON.stringify(roleInfo);
        SDKQuickJS.uploadGameRoleInfo(roleInfoJson);
    }

}