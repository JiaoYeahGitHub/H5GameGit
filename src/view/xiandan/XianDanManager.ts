/**
 * 
 * 仙丹管理器
 * @author	lzh
 * 
 * 
 */
class XianDanManager {
	public curLayer: number = 1;
	public energy: number = 0;
	public bossSize: number = 0;
	public bossState: number = 0;
	public stats: number = 0;
	public curDanId: number = 0;
	public awards: AwardItem[] = [];
	public danBtnStatus: boolean = true;
	public yilingEnergy: number = 0;
	public constructor() {
	}
	public parseFate(msg: Message) {
		var base: FateBase;
		var len = msg.getShort();
		for (var i = 0; i < len; i++) {
		}
	}
	public parseBossState(msg: Message) {
		this.bossState = msg.getShort();
	}
	public parseBossSize(msg: Message) {
		this.bossSize = msg.getShort();
	}
	public parseXianDanGain(msg: Message) {
		var base: XianDanRollData = new XianDanRollData();
		var id = msg.getShort();
		if (!DataManager.getInstance().playerManager.player.xianDanRolls[id]) {
			DataManager.getInstance().playerManager.player.xianDanRolls[id] = new XianDanRollData()
		}
		DataManager.getInstance().playerManager.player.xianDanRolls[id].onParseXianDanInitMsg(id, msg);
		var from: number = 0;
		var size: number = msg.getByte();
		var _awards: AwardItem[] = [];
		for (var i = 0; i < size; i++) {
			var dropawardItem: AwardItem = new AwardItem();
			dropawardItem.type = msg.getByte();
			dropawardItem.id = msg.getShort();
			dropawardItem.quality = msg.getByte();
			dropawardItem.num = msg.getInt();
			dropawardItem.quality = (dropawardItem.type == GOODS_TYPE.MASTER_EQUIP || dropawardItem.type == GOODS_TYPE.SERVANT_EQUIP) ? dropawardItem.quality : -1;
			// GameCommon.getInstance().onGetPillAlert(dropawardItem);
			_awards.push(dropawardItem);
		}
		this.awards = _awards;
		this.stats = msg.getByte();
	}
	public getXianShanBossPoint(): boolean {
		return this.bossState == 1;
	}
	private _xianshanCfgs: Modelxianshan[];
	public get allCfg(): Modelxianshan[] {
		if (!this._xianshanCfgs) {
			this._xianshanCfgs = JsonModelManager.instance.getModelxianshan();
		}
		return this._xianshanCfgs
	}
	private _xiandanCfgs: Modelxiandan[];
	public get allXianDanCfg(): Modelxiandan[] {
		if (!this._xiandanCfgs) {
			this._xiandanCfgs = JsonModelManager.instance.getModelxiandan();
		}
		return this._xiandanCfgs
	}
	public getXianShanAllPoint(): boolean {
		if (this.getXianShanPoint()) return true;
		if (this.getXianDanPoint(0)) return true;
		return false;
	}
	public getXianShanPoint(): boolean {
		// if(this.getXianShanBossPoint())return true;
		if (!FunDefine.isFunOpen(FUN_TYPE.FUN_XIANSHAN)) {
            return false;
        }
		return this.energy > 0;
	}
	public getXianDanPoint(idx): boolean {
		  if (!FunDefine.isFunOpen(FUN_TYPE.FUN_XIANSHAN)) {
            return false;
        }
		if (idx > 0) {
			for (var i: number = (idx - 1) * 8; i < idx * 8; i++) {
				if (DataManager.getInstance().playerManager.player.xianDans[i + 1] && DataManager.getInstance().playerManager.player.xianDans[i + 1].havepill > 0) {
					return true;
				}
			}
		}
		else {
			for (let k in DataManager.getInstance().playerManager.player.xianDans) {
				if (DataManager.getInstance().playerManager.player.xianDans[k] && DataManager.getInstance().playerManager.player.xianDans[k].havepill > 0) {
					return true;
				}
			}
		}
		return false;
	}
	public getXianDanAllProTimes(model: Modelxiandan): number {
		var effcts: string[];
		effcts = model.effect.split("#");
		var curProNum: number = 0;
		// var curProValue:number = 0;
		for (var i: number = 0; i < effcts.length; i++) {
			var nums: string[] = effcts[i].split(",");
			// curProValue = curProValue+Number(nums[0])
			if (DataManager.getInstance().playerManager.player.xianDans[model.id].shiyongNum >= Number(nums[0])) {
				curProNum = Number(nums[1]);
			}
			else if (i <= 0) {
				return 0;
			}
		}
		return curProNum;
	}
	public getXianDanPro(id: number, num: number, isNext: boolean): string[] {
		var awardStrAry: string[];
		// var curProValue:number = 0;
		var curEffect: string[];
		if (!this._xiandanCfgs)
			this._xiandanCfgs = this.allXianDanCfg;
		awardStrAry = this._xiandanCfgs[id].effect.split("#");
		for (var i: number = 0; i < awardStrAry.length; i++) {
			var awardstrItem: string[] = awardStrAry[i].split(",");
			// curProValue = curProValue+Number(awardstrItem[0]);
			if (num < Number(awardstrItem[0])) {
				if (i == 0) {
					if (isNext) {
						return awardStrAry[i].split(",");
					}
					else {
						curEffect = [];
						curEffect.push('0')
						curEffect.push('0')
						return curEffect;
					}
				}
				else {
					if (isNext) {
						return awardStrAry[i].split(",");
					}
					return awardStrAry[i - 1].split(",");
				}

			}
		}
	}
}