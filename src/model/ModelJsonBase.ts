abstract class ModelJsonBase {
	protected _json: Object;

	public sortIdx: number;//排序用
	public currRank: number;//排名用

	private _attributes: number[];
	private _cost: AwardItem;
	private _costOneKey: AwardItem;
	private _costList: AwardItem[];
	private _rewards: AwardItem[];
	private _pid: number;//特殊ID
	private _attrEffect: number[];//属性效果
	private _shuxing: number[] //添加的属性

	public constructor(json) {
		this._json = json;
	}

	public get id() {
		var _id = this._json["ID"] || this._json["id"] || this._json["Id"];
		return Tool.stringIsNum(_id) ? parseInt(_id) : _id;
	}
	//解析表里填的属性字段合并成一个数组
	public get attrAry(): number[] {
		if (!this._attributes) {
			this._attributes = GameCommon.getInstance().getAttributeAry(this);
		}
		return this._attributes;
	}

	public get costList(): AwardItem[] {
		if (!this._costList) {
			this._costList = GameCommon.getInstance().onParseAwardItemstr(this._json["consume"] || this._json["cost"] || this._json["itemCost"]);
		}
		return this._costList;
	}

	public get cost(): AwardItem {
		if (!this._cost) {
			this._cost = GameCommon.parseAwardItem(this._json["consume"] || this._json["cost"] || this._json["itemCost"]);
		}
		return this._cost;
	}

	public get costOneKey(): AwardItem {
		if (!this._costOneKey) {
			this._costOneKey = GameCommon.parseAwardItem(this._json["costOneKey"]);
		}
		return this._costOneKey;
	}

	public get rewards(): AwardItem[] {
		if (!this._rewards) {
			this._rewards = GameCommon.getInstance().onParseAwardItemstr(this.getStrValue("reward") || this.getStrValue("rewards") || this.getStrValue("show"));
		}
		return this._rewards;
	}

	public get costNum(): number {
		return parseInt(this._json["cost"]);
	}
	//每日任务进度
	private _dailytaskPro: number;
	public set dailytaskPro(value: number) {
		this._dailytaskPro = value;
	}
	public get dailytaskPro(): number {
		return this._dailytaskPro;
	}
	/**特殊的属性**/
	//,#隔开的属性
	public get base_effect(): number[] {
		if (!this._attrEffect) {
			this._attrEffect = GameCommon.getInstance().onParseAttributeStr(this._json["effect"]);
		}
		return this._attrEffect;
	}
	//对应xml shuxing字段
	public get shuxing(): number[] {
		if (!this._shuxing) {
			let shuxing = []
			let attrAry = this._json["shuxing"]
			if (attrAry) {
				attrAry = attrAry.split('#')
				for (let i = 0; i < attrAry.length; ++i) {
					let attr = attrAry[i].split(',')
					shuxing[attr[0]] = parseInt(attr[1])
				}
			}
			this._shuxing = shuxing
		}
		return this._shuxing;
	}
	//新手引导
	public get base_jackaroo(): string {
		return this.getStrValue("jackaroo");
	}

	protected getStrValue(key) {
		if (this._json[key] == "*") {
			return "";
		} else {
			return this._json[key];
		}
	}
	//帮会BOSS状态
	private _bossStatus: number;
	public set unionBossStatus(status: number) {
		this._bossStatus = status;
	}
	public get unionBossStatus(): number {
		return this._bossStatus;
	}
	//The end
}