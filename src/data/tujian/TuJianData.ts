class TuJianData {
	private _model: Modeltujian;

	public level: number;

	public constructor(model: Modeltujian) {
		this._model = model;
	}
	public get id(): number {
		return this._model.id;
	}
	public get model(): Modeltujian {
		return this._model;
	}
	public get attrAry(): number[] {
		let _attriAry: number[] = GameCommon.getInstance().getAttributeAry();
		if (this._model) {
			for (let i: number = 0; i < ATTR_TYPE.SIZE; i++) {
				_attriAry[i] = this._model.attrAry[i] * this.level;
			}
		}
		return _attriAry;
	}
	public get nextAttrAty(): number[] {
		let _attriAry: number[] = GameCommon.getInstance().getAttributeAry();
		if (this._model) {
			for (let i: number = 0; i < ATTR_TYPE.SIZE; i++) {
				_attriAry[i] = this._model.attrAry[i] * (this.level + 1);
			}
		}
		return _attriAry;
	}
	public get costNum(): number {
		return this._model && GameDefine.Tujian_MAX_Lv > this.level ? this._model.cost.num + Tool.toInt(this.level / 5) : 0;
	}
	//The end
}