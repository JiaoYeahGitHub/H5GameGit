class AllPeopleBossData {
	public lefttimes: number;//剩余挑战次数
	public infos: AllPeopleBossInfo[];
	public remindBossIds: number[];

	public xuezhanInfos: XuezhanBossInfo[];
	public xianshanInfos: XianShanBossInfo[];
	public vipbossInfos;

	public constructor() {
		this.infos = [];
		this.xuezhanInfos = [];
		this.xianshanInfos = [];
		this._otherFightDatas = [];
		this.remindBossIds = [];
		this.vipbossInfos = {};
	}
	private _leftRecover: number;
	public set leftRecover(recover: number) {
		this._leftRecover = recover * 1000 + egret.getTimer();
	}
	public get leftRecover(): number {
		return Math.ceil((this._leftRecover - egret.getTimer()) / 1000);
	}
	//复活时间
	private _rebornLefttime: number;
	public set reborntime(time: number) {
		this._rebornLefttime = time * 1000 + egret.getTimer();
	}
	public get reborntime(): number {
		return Math.ceil((this._rebornLefttime - egret.getTimer()) / 1000);
	}
	//获取当前全民战斗中参战的玩家数据
	private _otherFightDatas: OtherFightData[];
	public get otherFightDatas(): OtherFightData[] {
		return this._otherFightDatas;
	}
	//增加一个参战玩家
	public addOtherFightData(messge: Message): OtherFightData {
		var _otherFightData: OtherFightData;
		if (this._otherFightDatas.length <= DupDefine.ALLPEOPLE_SHOWBODY_MAX) {
			_otherFightData = new OtherFightData();
			_otherFightData.parseYewaiPVPMsg(messge);
			if (_otherFightData.playerId == DataManager.getInstance().playerManager.player.id) {
				return;
			}
			let isAdd: boolean = true;
			for (var i: number = 0; i < this._otherFightDatas.length; i++) {
				if (this._otherFightDatas[i].playerId == _otherFightData.playerId) {
					this._otherFightDatas[i] = _otherFightData;
					isAdd = false;
					break;
				}
			}
			if (isAdd) {
				this._otherFightDatas.push(_otherFightData);
			}
		}
		return _otherFightData;
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
	//清除所有的参战玩家数据
	public removeAllOtherFightData(): void {
		for (var i: number = this._otherFightDatas.length; i >= 0; i--) {
			this._otherFightDatas[i] = null;
			this._otherFightDatas.splice(i, 1);
		}
	}
}
class AllPeopleBossInfo {
	public bossID: number;
	public joinNum: number;
	public leftHp: number;
	public isOpen: boolean;
	public guishuName: string;
	private _rebirthTime: number;

	public parseMessage(msg: Message): void {
		this.bossID = msg.getShort();
		this.joinNum = msg.getInt();
		this.leftHp = msg.getLong();
		this.rebirthTime = msg.getInt();
		this.guishuName = msg.getString();
	}

	public set rebirthTime(num: number) {
		this._rebirthTime = num > 0 ? num * 1000 + egret.getTimer() : 0;
		this.isOpen = this._rebirthTime == 0;
		var allpeoplebossData: AllPeopleBossData = DataManager.getInstance().dupManager.allpeoplebossData;
	}

	public get rebirthTime(): number {
		return Math.max(0, Math.ceil((this._rebirthTime - egret.getTimer()) / 1000));
	}
}
class XuezhanBossInfo {
	public id: number;
	public bossID: number;
	public leftHp: number;
	public guishuName: string;
	private _rebirthTime: number;
	private _deathLefttime: number;
	private _model: Modelxuezhanboss;

	public parseMessage(msg: Message): void {
		this.id = msg.getShort();
		this.bossID = msg.getInt();
		this.leftHp = msg.getLong();
		this.rebirthTime = msg.getInt();
		this.guishuName = msg.getString();
		this.deathLeftTime = msg.getInt();
		this._model = JsonModelManager.instance.getModelxuezhanboss()[this.id];
	}
	public set rebirthTime(num: number) {
		this._rebirthTime = num > 0 ? num * 1000 + egret.getTimer() : 0;
	}
	public get rebirthTime(): number {
		return Math.max(0, Math.ceil((this._rebirthTime - egret.getTimer()) / 1000));
	}
	public set deathLeftTime(num: number) {
		this._deathLefttime = num > 0 ? num * 1000 + egret.getTimer() : 0;
	}
	public get deathLeftTime(): number {
		return Math.max(0, Math.ceil((this._deathLefttime - egret.getTimer()) / 1000));
	}
	public get model(): Modelxuezhanboss {
		return this._model;
	}
	//The end
}
class VipBossInfo {
	public id: number;
	public leftHp: number;
	public rebirthTime: number;
	private _deathLefttime: number;
	private _model: Modelvipboss;

	public parseMessage(msg: Message): void {
		this.id = msg.getShort();
		this.leftHp = msg.getLong();
		this.rebirthTime = msg.getInt();
		this.deathLeftTime = msg.getInt();
		this._model = JsonModelManager.instance.getModelvipboss()[this.id];
	}

	public set deathLeftTime(num: number) {
		this._deathLefttime = num > 0 ? num * 1000 + egret.getTimer() : 0;
	}
	public get deathLeftTime(): number {
		return Math.max(0, Math.ceil((this._deathLefttime - egret.getTimer()) / 1000));
	}

	public get model(): Modelvipboss {
		return this._model;
	}
}
/**全民战PK信息**/
class AllPeoplePKInfo {
	public playerId: number = 0;
	public startHp: number = 0;//起始血量
	public endHp: number = 0;//最终血量
	public totalHp: number = 0;//总血量
	public leftReborn: number = 0;//战斗结束后剩余的复活次数
	public attackNum: number = 0;//每次造成多少点伤害

	public constructor() {
	}
	public parseInfo(msg: Message): void {
		this.playerId = msg.getInt();
		this.startHp = msg.getLong();
		this.endHp = msg.getLong();
		this.totalHp = msg.getLong();
		this.leftReborn = msg.getByte();
	}
}
//仙山BOSS
class XianShanBossInfo {
	public id: number;
	public bossID: number;
	public leftHp: number;
	public guishuName: string;
	private _rebirthTime: number;
	private _model: Modelxianshanzhaohuan;
	public battleNum: number;
	public awakenPeople: string;
	public parseMessage(msg: Message): void {
		this.id = msg.getShort();
		this.bossID = msg.getInt();
		this.rebirthTime = msg.getShort();
		this.battleNum = msg.getInt();
		this.leftHp = msg.getLong();
		this.guishuName = msg.getString();
		// this.awakenPeople = msg.getString();
		this._model = JsonModelManager.instance.getModelxianshanzhaohuan()[this.id];
	}
	public set rebirthTime(num: number) {
		this._rebirthTime = num > 0 ? num * 1000 + egret.getTimer() : 0;
	}
	public get rebirthTime(): number {
		return Math.max(0, Math.ceil((this._rebirthTime - egret.getTimer()) / 1000));
	}
	public get model(): Modelxianshanzhaohuan {
		return this._model;
	}
	//The end
}