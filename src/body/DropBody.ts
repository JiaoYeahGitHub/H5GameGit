class DropBody extends egret.DisplayObjectContainer {
	private layer: egret.DisplayObjectContainer;
	private dropIcon: eui.Image;
	private dropName: eui.Label;
	public model: ModelThing;
	private _animUp: Animation;
	private _animDown: Animation;
	public constructor(type, id, quality) {
		super();
		this.layer = new egret.DisplayObjectContainer();
		this.layer.width = 64;
		this.layer.height = 64;
		this.addChild(this.layer);

		// this.avatar_grp = new eui.Group();
		// this.avatar_grp.width = 100;
		// this.avatar_grp.height = 100;
		// this.avatar_grp.y = 20;
		// this.avatar_grp.x = 15;

		this.dropIcon = new eui.Image();
		this.dropIcon.width = 32;
		this.dropIcon.height = 32;
		this.dropIcon.horizontalCenter = 0;
		this.dropIcon.y = 10;
		this.layer.addChild(this.dropIcon);

		this.onUpdate(type, id, quality);
	}
	public onUpdate(type, id, quality): void {
		this.model = GameCommon.getInstance().getThingModel(type, id, quality);
		this.dropIcon.source = this.model.icon;
		// var fontColor = GameCommon.getInstance().CreateNameColer(this.data.quality);
		// this.dropName = GameCommon.getInstance().createNormalLabel(18, fontColor, 0, 0, egret.HorizontalAlign.CENTER);
		// this.dropName.horizontalCenter = 0;
		// this.dropName.bold = true;
		// this.dropName.text = this.data.model.name;
		// this.layer.addChild(this.dropName);
	}
	public onShowDropEffect() {
		if (!this.model) return;
		let _animRes: string = '';
		switch (this.model.quality) {
			case GoodsQuality.Blue:
				_animRes = "wupindiaoluo_lan";
				break;
			case GoodsQuality.Purple:
				_animRes = "wupindiaoluo_zi";
				break;
			case GoodsQuality.Orange:
				_animRes = "wupindiaoluo_cheng";
				break;
		}
		if (!this._animUp) {
			this._animUp = new Animation(_animRes + '_up', -1);
			this._animUp.x = 15;
			this._animUp.y = 20;
		} else {
			this._animUp.onUpdateRes(_animRes + '_up', -1);
		}
		this.addChild(this._animUp);

		if (!this._animDown) {
			this._animDown = new Animation(_animRes + '_down', -1);
			this._animDown.x = 15;
			this._animDown.y = 20;
		} else {
			this._animDown.onUpdateRes(_animRes + '_down', -1);
		}
		this.addChildAt(this._animDown, 0);
	}
	public onDestyEffect() {
		if (this._animDown) {
			this._animUp.onDestroy();
			this._animDown.onDestroy();
		}
	}
	private _childOffY: number = 0;
	public set childOffY(y: number) {
		if (this.layer) {
			this._childOffY = y;
			this.layer.y = this._childOffY;
		}
	}
	public get childOffY(): number {
		return this._childOffY;
	}
	public onDestroy(): void {
		// this.removeChildren();
		// this.layer = null;
		if (this.parent) {
			this.parent.removeChild(this);
		}
	}
	//The end
}