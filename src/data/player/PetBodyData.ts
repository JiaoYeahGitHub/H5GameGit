class PetBodyData extends BodyData {
	private _model: Modelchongwujinjie;
	private _playerdata: PlayerData;

	public constructor(data: PlayerData) {
		super(data.playerId, BODY_TYPE.PET);
		this.playerData = data;
	}
	public updateData(id, type) {
		this.bodyType = type;

		if (!this.skills) {
			this.skills = [];
			for (var i: number = 0; i < SkillDefine.PET_SKILLS.length; i++) {
				var skillId: number = SkillDefine.PET_SKILLS[i];
				var _skillInfo: SkillInfo = new SkillInfo(skillId, i);
				_skillInfo.level = 1;
				this.skills.push(_skillInfo);
			}
		}
	}
	//更新对应的PlayerData
	public set playerData(data: PlayerData) {
		this._playerdata = data;
		this._model = JsonModelManager.instance.getModelchongwujinjie()[this._playerdata.petGrade][0];
		this.name = GameCommon.getInstance().getNickname(this._playerdata.name) + "的宠物";

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
	//外形数据
	public get avata(): string {
		return this._model.waixing1 + "";
	}
	//The end
}