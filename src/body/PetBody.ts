class PetBody extends ActionBody {
	protected _body: BodyAnimation;

	public constructor() {
		super();
	}
	protected onInitBodyHead(): void {
		super.onInitBodyHead();
		this.onShowOrHideHpBar(false);
	}
	//宠物数据
	public set data(data: PetBodyData) {
		egret.superSetter(PetBody, this, "data", data);
	}
	public get data(): PetBodyData {
		return this._data;
	}
	public onRefreshData(): void {
		this.onResetHeadInfo();
		this.onUpdateHeadPos();
		this.onUpdateAvatar();
	}
	//更换动作
	protected updateAction(): void {
		this.onChangeBody();
	}
	//更换方向
	protected updateDirection(): void {
		this.onChangeBody();
	}
	//更新模型
	public onChangeBody(): void {
		if (this._data) {
			var resName = LoadManager.getInstance().getPetResUrl(this.data.avata, this.actionName, this.getDirectionFrame());
			if (!this._body) {
				this._body = new BodyAnimation(resName, this._actionPlayNum, this.getDirectionFrame());
				this.bodyLayer.addChildAt(this._body, PLAYER_LAYER.BODY);
				this._body.visible = this._bodyVisible;
			} else {
				this._body.onUpdateRes(resName, this._actionPlayNum, this.getDirectionFrame());
			}
		}
	}
	public onAttack(): void {
		this.data.getCanUseSkill();
		super.onAttack();
		// this._isfollow = false;
	}
	// private _isfollow: boolean;
	public setFollowPaths(point: egret.Point): void {
		this.x = point.x;
		this.y = point.y;
		this.setMove([Tool.randomPosByDistance(point.x, point.y, 300)]);
		// this._isfollow = true;
		if (this.alpha == 1) {
			this.alpha = 0;
			egret.Tween.get(this).to({ alpha: 1 }, 500);
		}
	}
	// public get isfollow(): boolean {
	// 	return this._isfollow;
	// }
	protected onResetHeadInfo(): void {
		this.bodyHead.bodyName = this.data.name;
		this.bodyHead.nameColor = this.data.playerData.bodyType == BODY_TYPE.SELF ? 0x55c4ff : 0xfff000;
	}
	//更新人物头顶位置
	protected onUpdateHeadPos(): void {
		this.bodyHead.x = -75;
		this.bodyHead.y = - 100;
	}
	//动态的赋值生物血量信息
	public onRestHpInfo(hp, maxhp = 0): void {
	}
	public set hp(hpValue: number) {
	}
	public set bodyVisible(bool: boolean) {
		egret.superSetter(PlayerBody, this, "bodyVisible", bool);
		if (this._body) {
			this._body.visible = bool;
		}
		this.onshoworhideShodow(bool);
	}
	//状态重置
	public onReset(): void {
		egret.Tween.removeTweens(this);
		super.onReset();
	}
	//The end
} 