class FashionData {
	private _model: Modelfashion;
	private _id: number;//时装ID
	private _limitTime: number = -1;//现时时间
	private _skillInfo: SkillInfo;
	private _isUseSkill: boolean;//技能是否释放

	public isWear: boolean;
	public level: number;//时装等级

	public constructor() {
	}

	public parseMsg(message: Message): void {
		this.id = message.getShort();
		this.isWear = message.getBoolean();
		this.limitTime = message.getLong();
		this.level = message.getShort();
	}

	public set id(value: number) {
		this._id = value;
		this._model = JsonModelManager.instance.getModelfashion()[this._id];
		this._skillInfo = new SkillInfo(this._model.skill, 0);
	}

	public get id(): number {
		return this._id;
	}

	public get model(): Modelfashion {
		return this._model;
	}

	public get type(): number {
		return this._model.type;
	}

	public set limitTime(value: number) {
		this._limitTime = value > 0 ? value * 1000 + egret.getTimer() : value;
	}

	public get limitTime(): number {
		return this._limitTime;
	}

	public onResetSkill(): void {
		this._isUseSkill = false;
	}

	public getSkill(): SkillInfo {
		if (!this._isUseSkill) {
			this._isUseSkill = true;
			return this._skillInfo;
		}
		return null;
	}

	public get isUseSkill(): boolean {
		return this._isUseSkill;
	}

	public get skillInfo(): SkillInfo {
		return this._skillInfo;
	}
	//The end
}