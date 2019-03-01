enum EBroadcastChannel {
    System = 0,      //系统
    Player = 1,      //玩家
}

class BroadcastBase {
    public id: EBroadcastId = null;
    public channel: number;
    public str: string = "";
    public messageParams: Array<string>;
    public playerId: number = null;
    public society: string = null;//公会名
    public vip: number = null;//VIP等级
    public server: number = null;//服务器id
    public occpcution: number = null;//性别
    public name: string = null;//名字
    public title: string = null;//称号
    private _vipExp;
    public constructor() {
        this.messageParams = [];
    }

    public getPlayerInfoDesc(): string {
        var _messageStr: string = "";
        // if(this.society && this.type != EBroadcastType.Message_Society) {
        //     _messageStr += "<font color='#C586C0'>【" + this.society + "】</font>";
        // }
        if (this.vip && this.channel != EBroadcastChannel.System) {
            _messageStr += "<font color='#dfa519'>VIP" + " </font>";//+ this.vip 
        }
        if (this.name != null) {
            _messageStr += "<font color='#02ec02'>" + this.name + "</font>";
        }
        return _messageStr;
    }
    public set vipExp(param: number) {
        this._vipExp = param;
        this.vip = GameCommon.getInstance().getVipLevel(param);
    }
    public get vipExp() {
        return this._vipExp;
    }
}