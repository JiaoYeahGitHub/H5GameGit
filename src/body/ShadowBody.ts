class ShadowBody extends egret.DisplayObjectContainer {
	private shadowAnim: BodyAnimation;
	private shadowImg: eui.Image;
	private _ownerbody: ActionBody;

	public constructor() {
		super();
	}
	public updatePos(): void {
		if (!this._ownerbody) {
			return;
		}
		if (this._ownerbody.isshowShadow) {
			if (!this.visible) {
				this.visible = true;
			}
			this.x = this._ownerbody.x;
			this.y = this._ownerbody.y;
			if (this._ownerbody.data.bodyType == BODY_TYPE.SELF) {
				this.updateRoleRing();
			}
		} else {
			if (this.visible) {
				this.visible = false;
			}
		}
	}
	public onRefresh(body: ActionBody): void {
		if (this._ownerbody) return;
		if (!body) return;

		this._ownerbody = body;
		switch (body.data.bodyType) {
			case BODY_TYPE.SELF:
			case BODY_TYPE.PLAYER:
			case BODY_TYPE.ROBOT:
				this.updateRoleRing();
				break;
			case BODY_TYPE.BOSS:
				this.shadowImg = new eui.Image();
				this.shadowImg.source = "shadow_boss_png";
				this.shadowImg.anchorOffsetX = 512;
				this.shadowImg.anchorOffsetY = 512;
				this.addChild(this.shadowImg);
				break;
			case BODY_TYPE.MONSTER:
				this.shadowImg = new eui.Image();
				this.shadowImg.source = "shadow_png";
				this.shadowImg.width = 104;
				this.shadowImg.height = 54;
				this.shadowImg.x = -104 / 2;
				this.shadowImg.y = -54 / 2;
				this.addChild(this.shadowImg);
				break;
			default:
				this.shadowImg = new eui.Image();
				this.shadowImg.source = "shadow_png";
				this.shadowImg.x = -130 / 2;
				this.shadowImg.y = -67 / 2;
				this.addChild(this.shadowImg);
				break;
		}
		this.updatePos();
	}
	/**更新角色光环**/
	private _ringRes: string = '';
	private updateRoleRing(): void {
		if (!egret.is(this._ownerbody.data, 'PlayerData')) return;
		let playerData: PlayerData = this._ownerbody.data as PlayerData;
		if (playerData.ring_res) {
			if (this.shadowImg) {
				if (this.shadowImg.parent) {
					this.shadowImg.parent.removeChild(this.shadowImg);
				}
				this.shadowImg = null;
			}
			if (this._ringRes != playerData.ring_res) {
				this._ringRes = playerData.ring_res;
				let _ringResUrl: string = LoadManager.getInstance().getRingResUrl(this._ringRes);
				if (!this.shadowAnim) {
					this.shadowAnim = new BodyAnimation(_ringResUrl, -1, null);
					this.shadowAnim.scaleX = 1.3;
					this.shadowAnim.scaleY = 1.3;
					this.addChild(this.shadowAnim);
				} else {
					this.shadowAnim.onUpdateRes(_ringResUrl, -1, null);
				}
			}
		} else {
			// if (!this.shadowImg) {
			// 	this.shadowImg = new eui.Image();
			// 	this.shadowImg.source = "shadow_png";
			// 	this.shadowImg.x = -130 / 2;
			// 	this.shadowImg.y = -67 / 2;
			// 	this.addChild(this.shadowImg);
			// }

			if (this.shadowAnim) {
				this.shadowAnim.onDestroy();
				this.shadowAnim = null;
			}
		}
	}
	public onRemove(): void {
		if (this.shadowAnim) {
			this.shadowAnim.onDestroy();
			this.shadowAnim = null;
		}
		if (this.shadowImg) {
			this.removeChildren();
			this.shadowImg = null;
		}
		if (this.parent) {
			this.parent.removeChild(this);
		}
		this._ownerbody = null;
		this._ringRes = '';
	}
	public get ownerbody(): ActionBody {
		return this._ownerbody;
	}
	public onDestory(): void {
		BodyFactory.instance.onRecoveryShadow(this);
	}
	//The end
}