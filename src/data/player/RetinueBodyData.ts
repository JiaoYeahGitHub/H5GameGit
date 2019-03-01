class RetinueBodyData extends BodyData {
	private _playerdata: PlayerData;

	public constructor(data: PlayerData) {
		super(data.playerId, BODY_TYPE.RETINUE);
		this.playerData = data;
	}
	public updateData(id, type) {
		this.bodyType = type;
		this.skills = [];
		for (var i: number = 0; i < SkillDefine.Retinue_Skills.length; i++) {
			var skillId: number = SkillDefine.Retinue_Skills[i];
			var _skillInfo: SkillInfo = new SkillInfo(skillId, i);
			_skillInfo.level = 1;
			this.skills.push(_skillInfo);
		}
	}
	//更新对应的PlayerData
	public set playerData(data: PlayerData) {
		this._playerdata = data;
		// this.name = GameCommon.getInstance().getNickname(this._playerdata.name) + Language.instance.getText('desuicong');
		this.onRefreshProp();
		this.onRebirth();
	}
	public get playerData(): PlayerData {
		return this._playerdata;
	}
	//更新属性
	protected onRefreshProp(): void {
		if (!this._playerdata)
			return;
		this.attributes[ATTR_TYPE.HP] = 100;
		this.attributes[ATTR_TYPE.ATTACK] = this._playerdata.attributes[ATTR_TYPE.ATTACK];
		this.attributes[ATTR_TYPE.HIT] = this._playerdata.attributes[ATTR_TYPE.HIT];
		this.attributes[ATTR_TYPE.CRIT] = this._playerdata.attributes[ATTR_TYPE.CRIT];
		this.attributes[ATTR_TYPE.BREAK] = this._playerdata.attributes[ATTR_TYPE.BREAK];
	}
	//是否已死亡
	public get isDie(): boolean {
		return false;
	}
	/**--------------------外形相关-------------------------**/
	/**获取装备外形**/
	public get cloth_res(): string {
		let res: string = "";
		if (this._playerdata) {
			let avatarId: number = this._playerdata.getAppearID(BLESS_TYPE.RETINUE_CLOTHES);
			avatarId = avatarId < 0 ? 0 : avatarId;
			res = `sc_cloth` + avatarId;
		}
		return res;
	}
	/**获取武器外形**/
	public get weapon_res(): string {
		let res: string = "";
		if (this._playerdata) {
			let avatarId: number = this._playerdata.getAppearID(BLESS_TYPE.RETINUE_WEAPON);
			avatarId = avatarId < 0 ? 0 : avatarId;
			res = `sc_weapon` + avatarId;
		}
		return res;
	}
	/**获取坐骑外形**/
	public get mount_Res(): string {
		let res: string = "";
		if (this._playerdata) {
			let avatarId: number = this._playerdata.getAppearID(BLESS_TYPE.RETINUE_HORSE);
			avatarId = avatarId < 0 ? 0 : avatarId;
			res = `sc_mount` + avatarId;
		}
		return res;
	}
	/**获取翅膀外形**/
	public get wing_res(): string {
		let res: string = "";
		if (this._playerdata) {
			let avatarId: number = this._playerdata.getAppearID(BLESS_TYPE.RETINUE_WING);
			if (avatarId >= 0) {
				res = `sc_wing` + avatarId;
			}
		}
		return res;
	}
	/**获取法宝外形**/
	public get magic_res(): string {
		let res: string = "";
		if (this._playerdata) {
			let avatarId: number = this._playerdata.getAppearID(BLESS_TYPE.MAGIC);
			if (avatarId >= 0) {
				res = `sc_magic` + avatarId;
			}
		}
		return res;
	}
	//The end
}