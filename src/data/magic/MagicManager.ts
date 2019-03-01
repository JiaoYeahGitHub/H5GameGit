class MagicManager {
	public currCanUpNum: number;
	public lastTime: number;
	public maxTime: number = 6;
	public totalTime: number = 7200000;//毫秒
	public currTierExp: number;//法宝阶数星级经验
	public turnTime: number;
	public turnMax: number = 5;
	public multipleIndex: number;
	public numIndex: number;
	private isNeedRecover: boolean = false;
	private _CDOwner;
	public constructor() {
		this.onSendMessage();
	}
	public onSendMessage(): void {
		var message = new Message(MESSAGE_ID.PLAYER_MAGIC_MESSAGE);
		GameCommon.getInstance().sendMsgToServer(message);
	}
	// Magiclevelexp	int	法宝等级当前经验
	// canupnum	byte	可升级次数（最多6次）
	// leveluptime	int	恢复次数时间已走时间（2小时恢复一次）
	// magicstageexp	int	法宝阶段当前经验
	// magicturntable	byte	法宝转盘已转次数
	public onParseMessage(msg: Message): void {
		this.currCanUpNum = msg.getByte();
		this.lastTime = msg.getInt();
		this.onStartCD();
		this.currTierExp = msg.getInt();
		this.turnTime = msg.getByte();
	}

	public onSendUpdateMessage(): void {
		var message = new Message(MESSAGE_ID.PLAYER_MAGIC_UPGRADE_MESSAGE);
		GameCommon.getInstance().sendMsgToServer(message);
	}
	// Magiclevel	short	法宝等级
	// Magiclevelstar	byte	法宝等级星级
	// canupnum	byte	可升级次数（最多6次）
	// leveluptime	int	恢复次数时间已走时间（2小时恢复一次）
	public onParseUpdateMessage(msg: Message): void {
		DataManager.getInstance().playerManager.player.onParseMagicUpdate(msg);
		this.currCanUpNum = msg.getByte();
		this.lastTime = msg.getInt();
		this.onStartCD();
	}
	public onSendAdvanceMessage(): void {
		var message = new Message(MESSAGE_ID.PLAYER_MAGIC_ADVANCE_MESSAGE);
		GameCommon.getInstance().sendMsgToServer(message);
	}
	// Magicstage	short	法宝阶数
	// Magicstagestar	byte	法宝星数
	// Magicstageexp	int	法宝星数经验
	public onParseAdvanceMessage(msg: Message): void {
		DataManager.getInstance().playerManager.player.onParseMagicAdvance(msg);
		this.currTierExp = msg.getInt();
	}
	public onSendTurnplateMessage(): void {
		var message = new Message(MESSAGE_ID.PLAYER_MAGIC_TURNPLATE_MESSAGE);
		GameCommon.getInstance().sendMsgToServer(message);
	}
	// Num	byte	已转次数
	// multiplyIndex	byte	倍数索引
	// numIndex	byte	数量索引
	public onParseTurnplateMessage(msg: Message): void {
		this.turnTime = msg.getByte();
		this.multipleIndex = msg.getByte();
		this.numIndex = msg.getByte();
	}
	private onStartCD(): void {
		this.isNeedRecover = false;
		if (this.currCanUpNum < 6) {
			this.isNeedRecover = true;
			Tool.addTimer(this.onCountDown, this, 1000);
		} else {
			Tool.removeTimer(this.onCountDown, this, 1000);
		}
	}
	public onCountDown(): void {
		if (this.isNeedRecover) {
			this.lastTime += 1000;
			if (this.lastTime >= this.totalTime) {
				this.lastTime += 1;
				if (this.lastTime >= this.maxTime) {
					this.lastTime = this.maxTime;
					this.isNeedRecover = false;
					Tool.removeTimer(this.onCountDown, this, 1000);
					return;
				} else {
					this.lastTime = 0;
				}
			}
		}
		if (this._CDOwner) {
			this._CDOwner.onCountDown();
		}
	}
	public set CDOwner(param) {
		this._CDOwner = param;
	}
	private getPlayer() {
		return DataManager.getInstance().playerManager.player;
	}
	public get magicUpgradePower(): number {

		var attr = GameCommon.getInstance().getAttributeAry();
		var curr: Modelfabaoshengji = JsonModelManager.instance.getModelfabaoshengji()[this.getPlayer().Magiclv][this.getPlayer().MagicLvExp];
		if (this.getPlayer().Magiclv == "1")
		{
			curr = JsonModelManager.instance.getModelfabaoshengji()[this.getPlayer().Magiclv][Number(this.getPlayer().magicLvExp)-1];

		}
		if (curr) {
			attr = curr.attrAry;
		}
		var power: number = GameCommon.calculationFighting(attr);
		power = power * this.getPlayer().playerDatas.length;
		return power;
	}
	//法宝进阶
	public get magicAdvanceModel(): number {
		var attr = GameCommon.getInstance().getAttributeAry();
		var curr: Modelfabaojinjie = JsonModelManager.instance.getModelfabaojinjie()[this.getPlayer().MagicStarLv][this.getPlayer().MagicStar];
		if (curr) {
			attr = curr.attrAry;
		}
		var power: number = GameCommon.calculationFighting(attr);
		power = power * this.getPlayer().playerDatas.length;
		return power;
	}
	//法宝进阶
	public get magicAdvancePower(): number {
		var attr = GameCommon.getInstance().getAttributeAry();
		var curr: Modelfabaojinjie = JsonModelManager.instance.getModelfabaojinjie()[this.getPlayer().MagicStarLv][this.getPlayer().MagicStar];
		if (curr) {
			attr = curr.attrAry;
		}
		var power: number = GameCommon.calculationFighting(attr);
		power = power * this.getPlayer().playerDatas.length;
		return power;
	}

	public checkMagicUpgradePoint(): boolean {
		if (!FunDefine.isFunOpen(FUN_TYPE.FUN_FIGHTSPRITE)) return false;
		var magic = DataManager.getInstance().magicManager;
		if(!magic.currCanUpNum|| magic.currCanUpNum==0)return false;
		var next: Modelfabaojinjie = JsonModelManager.instance.getModelfabaoshengji()[this.getPlayer().Magiclv][this.getPlayer().MagicNextLvKey];
		if (!next)
		var next: Modelfabaojinjie = JsonModelManager.instance.getModelfabaoshengji()[this.getPlayer().MagicNextlv][this.getPlayer().MagicLvKey];
		if (!next)
		return false;
		var _has: number = DataManager.getInstance().playerManager.player.getICurrency(GOODS_TYPE.GOLD);
		if (_has >= next.magicDef) return true;
		return false;
	}
	public checkMagicAdvancePoint(): boolean {
		if (!FunDefine.isFunOpen(FUN_TYPE.FUN_FIGHTSPRITE)) return false;
		var next: Modelfabaojinjie = JsonModelManager.instance.getModelfabaojinjie()[this.getPlayer().MagicNextTierKey][this.getPlayer().MagicNextStar];
		if (!next) return false;
		var _has: number = DataManager.getInstance().bagManager.getGoodsThingNumById(next.cost.id);
		if (_has >= next.cost.num) return true;
		return false;
	}
	public checkMagicTurnplatePoint(): boolean {
		if (!FunDefine.isFunOpen(FUN_TYPE.FUN_FIGHTSPRITE)) return false;
		var magic = DataManager.getInstance().magicManager;
		if (!Tool.isNumber(magic.turnTime)) return false;
		if (magic.turnMax <= magic.turnTime) return false;
		var model: Modelfabaozhuanpan = JsonModelManager.instance.getModelfabaozhuanpan()[magic.turnTime + 1];
		if (model.cost.type != GOODS_TYPE.GOLD) return false;
		var _has: number = DataManager.getInstance().playerManager.player.getICurrency(model.cost.type);
		if (_has >= model.cost.num) return true;
		return false;
	}
	public checkMainXyPoint(): boolean {
		
        if (this.checkMagicTurnplatePoint()) return true;
        if (this.checkMagicAdvancePoint()) return true;
        if (this.checkMagicUpgradePoint()) return true;
        return false;
    }

}