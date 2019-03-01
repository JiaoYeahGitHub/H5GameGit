// TypeScript file
class MyBossData {
    public openLefttime: number;
    public bossLifes;


    public constructor() {
        this.bossLifes = {};
        this._otherFightDatas = [];
    }
    //复活剩余时间
    private _rebornLefttime: number;
    public set rebornLefttime(rebornTime: number) {
        this._rebornLefttime = rebornTime * 1000 + egret.getTimer();
    }
    public get rebornLefttime(): number {
        return Math.ceil((this._rebornLefttime - egret.getTimer()) / 1000);
    }
    //获取当前全民战斗中参战的玩家数据
    private _bossTargetFigthData: OtherFightData;
    private _otherFightDatas: OtherFightData[];
    public get otherFightDatas(): OtherFightData[] {
        return this._otherFightDatas;
    }
    //增加一个参战玩家
    public parseOtherFightData(messge: Message): OtherFightData {
        var _otherFightData: OtherFightData;
        if (this._otherFightDatas.length <= DupDefine.ALLPEOPLE_SHOWBODY_MAX) {
            _otherFightData = new OtherFightData();
            _otherFightData.parseYewaiPVPMsg(messge);
            this.addOhterFightData(_otherFightData);
        }
        return _otherFightData;
    }
    public addOhterFightData(otherFightData: OtherFightData): void {
        if (otherFightData.playerId == DataManager.getInstance().playerManager.player.id) {
            return;
        }
        let isAdd: boolean = true;
        for (var i: number = 0; i < this._otherFightDatas.length; i++) {
            if (this._otherFightDatas[i].playerId == otherFightData.playerId) {
                this._otherFightDatas[i] = otherFightData;
                isAdd = false;
                break;
            }
        }
        if (isAdd) {
            this._otherFightDatas.push(otherFightData);
        }
    }
    //清除所有的参战玩家数据
    public removeAllOtherFightData(): void {
        for (var i: number = this._otherFightDatas.length; i >= 0; i--) {
            this._otherFightDatas[i] = null;
            this._otherFightDatas.splice(i, 1);
        }
    }
    //清除某一个参战玩家数据
    public removeOneOhterFightData(playerid: number): void {
        for (var i: number = this._otherFightDatas.length - 1; i >= 0; i--) {
            var ohterdata: OtherFightData = this._otherFightDatas[i];
            if (playerid == ohterdata.playerId) {
                this._otherFightDatas[i] = null;
                this._otherFightDatas.splice(i, 1);
            }
            break;
        }
    }
    //查找某一个参战玩家
    public findOneOtherFightData(playerid: number): OtherFightData {
        for (var i: number = this._otherFightDatas.length - 1; i >= 0; i--) {
            var ohterdata: OtherFightData = this._otherFightDatas[i];
            if (playerid == ohterdata.playerId) {
                return ohterdata;
            }
        }
    }
    //The end
}
enum MYBOSS_STATE {
    UNOPEN = 0,
    FIGHTTING = 1,
    KILLED = 2,
}