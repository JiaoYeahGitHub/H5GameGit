class RoleAppearBody extends egret.DisplayObjectContainer {
	//更新外形展示
	private _body: BodyAnimation;
	private _mountBody: BodyAnimation;
	private _wingBody: BodyAnimation;
	private _weaponBody: BodyAnimation;

	public constructor() {
		super();
	}
	/**更新外形显示**/
	public updateAvatarAnim(appears: number[], sex: SEX_TYPE): void {
		let resurl: string = "";
		//0.坐骑
		let mountId: number = appears[BLESS_TYPE.HORSE];
		resurl = LoadManager.getInstance().getFeijianUrl("jian" + mountId, "stand", Direction.RIGHTDOWN + "");
		if (!this._mountBody) {
			this._mountBody = new BodyAnimation(resurl, -1, Direction.RIGHTDOWN + "");
			this.addChildAt(this._mountBody, 0);
		} else {
			this._mountBody.onUpdateRes(resurl, -1, null);
		}
		//1.翅膀
		let wingId: number = appears[BLESS_TYPE.WING];
		if (wingId >= 0) {
			resurl = LoadManager.getInstance().getWingResUrl("wing" + wingId, "ride_stand", Direction.DOWN + "");
			if (!this._wingBody) {
				this._wingBody = new BodyAnimation(resurl, -1, Direction.DOWN);
				this._wingBody.y = -45;
				this.addChildAt(this._wingBody, 1);
			} else {
				this._wingBody.onUpdateRes(resurl, 0, null);
			}
		}
		//2.武器 时装是特效 普通是图片
		let weaponId: number = appears[BLESS_TYPE.WEAPON];
		resurl = LoadManager.getInstance().getWeaponResUrl("weapon" + weaponId, sex == SEX_TYPE.MALE ? "standNan" : "stand", Direction.DOWN + "");
		if (!this._weaponBody) {
			this._weaponBody = new BodyAnimation(resurl, -1, Direction.DOWN + "");
			this._weaponBody.y = -45;
			this.addChildAt(this._weaponBody, 2);
		} else {
			this._weaponBody.onUpdateRes(resurl, -1, null);
		}
		//3.衣服
		let clothId: number = appears[BLESS_TYPE.CLOTHES];
		resurl = LoadManager.getInstance().getClothResUrl(`r${sex}_cloth` + clothId, "stand", Direction.DOWN + "");
		if (!this._body) {
			this._body = new BodyAnimation(resurl, -1, Direction.DOWN + "");
			this._body.y = -45;
			this.addChildAt(this._body, 3);
		} else {
			this._body.onUpdateRes(resurl, -1, null);
		}
	}
	//The end
}