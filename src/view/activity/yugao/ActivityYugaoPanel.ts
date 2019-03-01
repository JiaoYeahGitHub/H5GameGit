class ActivityYugaoPanel extends BaseWindowPanel {
	private bg_img: eui.Image;
	private txt_img: eui.Image;
	private awdgrp_1: eui.Group;
	private awdgrp_2: eui.Group;
	private yugao2_awd_grp: eui.Group;
	private time_label: eui.Label;

	private currDate: Date;
	private time: number;
	private sigtime: number;
	public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;
	public constructor(owner: ModuleLayer) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.ActivtiyYugaoPanelSkin;
	}
	protected onInit(): void {
		this.currDate = new Date();

		super.onInit();
		this.onRefresh();
	}
	protected onRegist(): void {
		super.onRegist();
		this.examineCD(true);
	}
	protected onRemove(): void {
		super.onRemove();
		this.examineCD(false);
	}
	protected onRefresh(): void {
		this.currDate.setTime(DataManager.getInstance().playerManager.player.curServerTime);
		this.time = this.currDate.getHours() * 3600 + this.currDate.getMinutes() * 60 + this.currDate.getSeconds();
		this.sigtime = egret.getTimer();
		this.awdgrp_1.visible = false;
		this.awdgrp_2.visible = false;
		let idx: number = DataManager.getInstance().activityManager.getActYugaoIdx();
		if (idx == 0) {
			this.onTouchCloseBtn();
			return;
		}
		this.bg_img.source = `act_yugao_bg${idx}_jpg`;
		this.txt_img.source = `act_yugao_txt${idx}_png`;
		this[`awdgrp_${idx}`].visible = true;
		if (this.awdgrp_2.visible && this.yugao2_awd_grp.numChildren == 0) {
			let awardids: AwardItem[] = GameCommon.getInstance().onParseAwardItemstr('3,48,1#2,152,1#3,49,1#3,76,5#3,83,20');
			for (let i2: number = 0; i2 < awardids.length; i2++) {
				let awd_item: GoodsInstance = GameCommon.getInstance().createGoodsIntance(awardids[i2]);
				this.yugao2_awd_grp.addChild(awd_item);
			}
		}
	}
	public onCountDown() {
		let time: number = 86400 - (this.time + Math.floor((egret.getTimer() - this.sigtime) / 1000));
		if (time <= 0) {
			time = 0;
			this.examineCD(false);
		}
		this.time_label.text = '距开启还有' + GameCommon.getInstance().getTimeStrForSec1(time);
	}
	public examineCD(open: boolean) {
		if (open) {
			Tool.addTimer(this.onCountDown, this, 1000);
		} else {
			Tool.removeTimer(this.onCountDown, this, 1000);
		}
	}
	//The end
}