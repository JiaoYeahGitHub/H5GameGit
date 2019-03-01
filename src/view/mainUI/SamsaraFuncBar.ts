class SamsaraFuncBar extends eui.Component {
	private samrama_reborn_group: eui.Group;
	private samsara_reborn_time: eui.Label;
	private samsara_reborn_btn: eui.Button;
	// private samsara_loop_award: eui.Button;
	private samsara_reborn_cb: eui.CheckBox;
	private samsara_shield_cb: eui.CheckBox;
	protected onloadComp: boolean;

	public constructor() {
		super();
		this.once(egret.Event.COMPLETE, this.onLoadComplete, this);
		this.once(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);

	}
	private onAddToStage(): void {
		this.skinName = skins.SamsaraOptBarSkin;
	}
	private onLoadComplete(): void {
		this.onloadComp = true;
		this.onStopSamsaraRebornTime();
	}
	//转生BOSS设置
	public onRegistSamsaraBar(): void {
		if (this.onloadComp) {
			this.samsara_reborn_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchSamraraRebornBtn, this);
			// this.samsara_loop_award.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onLoopSamsaraAward, this);
			this.samsara_shield_cb.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSelectShiledCB, this);
			this.samsara_reborn_cb.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchSamsaraAutoReborn, this);
		}
	}
	public onRemoveSamsaraBar(): void {
		if (this.onloadComp) {
			this.onStopSamsaraRebornTime();
			this.samsara_reborn_cb.selected = false;
			this.samsara_shield_cb.selected = false;
			this.samsara_reborn_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchSamraraRebornBtn, this);
			// this.samsara_loop_award.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onLoopSamsaraAward, this);
			this.samsara_shield_cb.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onSelectShiledCB, this);
			this.samsara_reborn_cb.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchSamsaraAutoReborn, this);
		}
	}
	//开始倒计时复活时间
	private _startRebornTime: number = 0;
	public onStartSamsaraRebornTime(rebornTime: number = 0): void {
		if (this.samsara_reborn_cb.selected) {
			if (DataManager.getInstance().playerManager.player.getICurrency(GOODS_TYPE.DIAMOND) >= 20) {
				GameFight.getInstance().onBossFightReborn(true, true);
				return;
			} else {
				this.samsara_reborn_cb.selected = false;
			}
		}
		if (this._startRebornTime == 0) {
			this.samrama_reborn_group.visible = true;
			this._startRebornTime = rebornTime * 1000 + egret.getTimer();
			Tool.addTimer(this.onSamsaraRebornTimeDown, this, 1000);
		}
	}
	private onSamsaraRebornTimeDown(): void {
		var rebornLefttime: number = Math.ceil((this._startRebornTime - egret.getTimer()) / 1000);
		if (rebornLefttime <= 0) {
			this.onStopSamsaraRebornTime();
			GameFight.getInstance().onBossFightReborn(false);
		} else {
			this.samsara_reborn_time.text = `复活倒计时：${rebornLefttime}秒`;
		}
	}
	public onStopSamsaraRebornTime(): void {
		this._startRebornTime = 0;
		this.samrama_reborn_group.visible = false;
		this.samsara_reborn_time.text = "";
		Tool.removeTimer(this.onSamsaraRebornTimeDown, this, 1000);
	}
	private onTouchSamraraRebornBtn(): void {
		GameFight.getInstance().onBossFightReborn();
	}
	private onTouchSamsaraAutoReborn(): void {
		if (DataManager.getInstance().playerManager.player.getICurrency(GOODS_TYPE.DIAMOND) < 20) {
			this.samsara_reborn_cb.selected = false;
			GameCommon.getInstance().addAlert("error_tips_2");
		}
	}
	private onSelectShiledCB(): void {
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.SHIELD_OTHERBODY_EVENT), this.samsara_shield_cb.selected);
	}
	//The end
}