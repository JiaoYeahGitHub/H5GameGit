class LocalArenaWinPanel extends BaseWindowPanel {
	// private old_rank_label: eui.BitmapLabel;
	private new_rank_label: eui.BitmapLabel;
	private btn_sure: eui.Button;
	private award_groud: eui.Group;

	private itemAwards: AwardItem[];
	private param;

	public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;
	public constructor(owner: ModuleLayer) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.LocalArenaWinPanelSkin;
	}
	protected onRegist(): void {
		super.onRegist();
		this.btn_sure.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
	}
	public onRemove(): void {
		super.onRemove();
		this.btn_sure.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
	}
	public onShowWithParam(param): void {
		this.param = param;
		if (this.param)
			super.onShowWithParam(param);
	}
	protected onInit(): void {
		super.onInit();
		this.onRefresh();
	}
	protected onRefresh(): void {
		super.onRefresh();

		var oldRank: number = this.param["oldRank"];
		var newRank: number = this.param["newRank"];
		this.itemAwards = this.param["award"];
		if (this.itemAwards) {
			this.onPlayAwardAnim();
		}
		// if (oldRank <= 0) {
		// 	this.not_rank_label.visible = true;
		// 	this.old_rank_grp.visible = false;
		// } else {
		// 	this.not_rank_label.visible = false;
		// 	this.old_rank_grp.visible = true;
		// 	this.old_rank_label.text = oldRank + "";
		// }
		this.new_rank_label.text = newRank + "";
		this._showleftTime = 11;
		this.onCloseTimedown();
		Tool.addTimer(this.onCloseTimedown, this, 1000);
	}
	private _showleftTime: number;
	private onCloseTimedown(): void {
		this._showleftTime--;
		if (this._showleftTime < 0) {
			Tool.removeTimer(this.onCloseTimedown, this, 1000);
			this.onHide();
			return;
		}
		this.btn_sure.label = `确定(${this._showleftTime})`;
	}
	private onPlayAwardAnim(): void {
		this.award_groud.removeChildren();
		for (var i: number = 0; i < this.itemAwards.length; i++) {
			var awarditem: AwardItem = this.itemAwards[i];
			var goodsInstance: GoodsInstance = new GoodsInstance();
			this.award_groud.addChild(goodsInstance);
			goodsInstance.onUpdate(awarditem.type, awarditem.id, 0, awarditem.quality, awarditem.num);
		}
	}
	public onHide(): void {
		super.onHide();
		Tool.removeTimer(this.onCloseTimedown, this, 1000);
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GAME_CLOSE_RESULT_VIEW));
	}
	//The end
}