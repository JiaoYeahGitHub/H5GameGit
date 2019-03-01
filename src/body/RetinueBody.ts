class RetinueBody extends ActionBody {
	private _weaponBody: BodyAnimation;
	private _mountBody: BodyAnimation;
	private _wingBody: BodyAnimation;
	private _fabaoBody: BodyAnimation;

	public constructor() {
		super();
		this.onHideHeadBar(false);
	}
	//角色数据
	public set data(data: RetinueBodyData) {
		egret.superSetter(RetinueBody, this, "data", data);
	}
	public get data(): RetinueBodyData {
		return this._data as RetinueBodyData;
	}
	//更新生物血量
	protected onResetHeadInfo(): void {
		super.onResetHeadInfo();
	}
	public onRefreshData(): void {
		super.onRefreshData();
	}
	//更换动作
	protected updateAction(): void {
		super.updateAction();
		this.onChangeBody();
		this.onChangeMountBody();
		this.onChangeWeaponBody();
		this.onChangeWingBody();
		this.onChangeFabaoBody();
		this.refreshLayer();
	}
	//刷新层级
	private refreshLayer(): void {
		let layers: number[];
		if (this._mountBody && !this._mountBody.parent) {
			this.addLayerOrder(this._mountBody, 1);
			this._mountBody.y = -50;
		}

		if (this._body) {
			layers = [3, 4, 4, 4, 3];
			this.addLayerOrder(this._body, layers[this.direction - 1]);
			this._body.y = -50;
		}

		if (this._weaponBody) {
			layers = [4, 3, 2, 2, 2];
			this.addLayerOrder(this._weaponBody, layers[this.direction - 1]);
			this._weaponBody.y = -50;
		}

		if (this._wingBody) {
			layers = [2, 2, 3, 3, 4];
			this.addLayerOrder(this._wingBody, layers[this.direction - 1]);
			this._wingBody.y = -50;
		}

		if (this._fabaoBody && !this._fabaoBody.parent) {
			this.addLayerOrder(this._fabaoBody, 5);
		}
	}
	//更换人物模型
	private onChangeBody(): void {
		if (this.data && this.data.cloth_res) {
			let actionName: string = this.actionName;
			let resName: string = LoadManager.getInstance().getRetinueClothResUrl(this.data.cloth_res, actionName, this.getDirectionFrame());
			if (!this._body) {
				this._body = new BodyAnimation(resName, this._actionPlayNum, this.getDirectionFrame());
				this._body.visible = this._bodyVisible;
			} else {
				this._body.onUpdateRes(resName, this._actionPlayNum, this.getDirectionFrame());
			}
		} else {
			if (this._body) {
				this._body.onDestroy();
				this._body = null;
			}
		}
	}
	//更换武器模型
	private onChangeWeaponBody(): void {
		if (this.data && this.data.weapon_res) {
			var actionName: string = this.actionName;
			var resName = LoadManager.getInstance().getRetinueWeaponResUrl(this.data.weapon_res, actionName, this.getDirectionFrame());
			if (!this._weaponBody) {
				this._weaponBody = new BodyAnimation(resName, this._actionPlayNum, this.getDirectionFrame());
				this._weaponBody.visible = this._bodyVisible;
			} else {
				this._weaponBody.onUpdateRes(resName, this._actionPlayNum, this.getDirectionFrame());
			}
		} else {
			if (this._weaponBody) {
				this._weaponBody.onDestroy();
				this._weaponBody = null;
			}
		}
	}
	/**乘骑逻辑**/
	//更换乘骑模型
	private onChangeMountBody(): void {
		// if (this.data && this.data.mount_Res) {
		// 	var resName: string = LoadManager.getInstance().getRetinueMountResUrl(this.data.mount_Res, this.mountRideActName);

		// 	if (!this._mountBody) {
		// 		this._mountBody = new BodyAnimation(resName, -1, null);
		// 		this._mountBody.visible = this._bodyVisible;
		// 	} else {
		// 		this._mountBody.onUpdateRes(resName, -1, null);
		// 	}
		// } else {
		// 	if (this._mountBody) {
		// 		this._mountBody.onDestroy();
		// 		this._mountBody = null;
		// 	}
		// }
	}
	//翅膀模型
	private onChangeWingBody(): void {
		if (this.data && this.data.wing_res) {
			let actionName: string = 'ride_stand';
			let resName: string = LoadManager.getInstance().getRetinueWingResUrl(this.data.wing_res, actionName, this.getDirectionFrame());

			if (!this._wingBody) {
				this._wingBody = new BodyAnimation(resName, -1, this.getDirectionFrame());
				this._wingBody.visible = this._bodyVisible;
			} else {
				this._wingBody.onUpdateRes(resName, -1, this.getDirectionFrame());
			}
		} else {
			if (this._wingBody) {
				this._wingBody.onDestroy();
				this._wingBody = null;
			}
		}
	}
	//法宝模型
	private onChangeFabaoBody(): void {
		if (this.data && this.data.magic_res) {
			let actionName: string = 'stand';
			let magicRes: string = LoadManager.getInstance().getRetinueMagicResUrl(this.data.magic_res, actionName);
			if (!this._fabaoBody) {
				this._fabaoBody = new BodyAnimation(magicRes, -1, null);
				this._fabaoBody.x = -60;
				this._fabaoBody.y = -150;
				this._fabaoBody.visible = this._bodyVisible;
			} else {
				this._fabaoBody.onUpdateRes(magicRes, -1, null);
			}
		} else {
			if (this._fabaoBody) {
				this._fabaoBody.onDestroy();
				this._fabaoBody = null;
			}
		}
	}
	//更新人物头顶位置
	protected onUpdateHeadPos(): void {
		if (this.data) {
			// this.bodyHead.x = -this.data.model.width / 2;
			// this.bodyHead.y = this.mountOffY - this.data.model.high - 30 - (this.mountOffY / 2);
		}
	}
	//返回乘骑类型
	protected get mountType(): MOUNT_TYPE {
		return MOUNT_TYPE.RIDE_MOUNT;
	}
	protected get roleStandAction(): string {
		return "ride_stand";
	}
	protected get roleMoveAction(): string {
		return "ride_walk";
	}
	//更新移动
	private _isfollow: boolean;
	public setFollowPaths(pointPaths: Array<egret.Point>) {
		this.setMove(pointPaths);
		this._isfollow = true;
	}
	public get isfollow(): boolean {
		return this._isfollow;
	}
	public onAttack(): void {
		super.onAttack();
		this._isfollow = false;
	}
	public set bodyVisible(bool: boolean) {
		egret.superSetter(PlayerBody, this, "bodyVisible", bool);
		if (this._body) {
			this._body.visible = bool;
		}
		if (this._weaponBody) {
			this._weaponBody.visible = bool;
		}
		if (this._mountBody) {
			this._mountBody.visible = bool;
		}
		if (this._wingBody) {
			this._wingBody.visible = bool;
		}
		if (this._fabaoBody) {
			this._fabaoBody.visible = bool;
		}
		this.onshoworhideShodow(bool);
	}

	public onDestroy(): void {
		super.onDestroy();
		// if (this._body) {
		// 	this._body.onDestroy();
		// 	this._body = null;
		// }
		if (this._weaponBody) {
			this._weaponBody.onDestroy();
			this._weaponBody = null;
		}
		if (this._mountBody) {
			this._mountBody.onDestroy();
			this._mountBody = null;
		}
		if (this._wingBody) {
			this._wingBody.onDestroy();
			this._wingBody = null;
		}
		if (this._fabaoBody) {
			this._fabaoBody.onDestroy();
			this._fabaoBody = null;
		}
	}
	//状态重置
	public onReset(): void {
		super.onReset();
	}
	//The end
}