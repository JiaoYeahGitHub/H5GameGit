class OtherTargetBar extends eui.Group {
	private progressBar: eui.ProgressBar;
	private playerHead: PlayerHeadPanel;
	constructor() {
		super();
		this.progressBar = new eui.ProgressBar();
		this.once(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
		this.progressBar.skinName = skins.Other_HpProBar;
		this.progressBar.slideDuration = 200;
	}
	private onAddToStage(e: egret.Event) {
		this.addChild(this.progressBar);
	}
	public onTarget(otherData: PlayerData, headIndex: number, headFrame: number): void {
		//更新头像
		this.playerHead.setHead(headIndex, headFrame);
		// (this.progressBar["player_head_icon"] as eui.Image).source = GameCommon.getInstance().getBigHeadByOccpation(headIndex);
		(this.progressBar["bossname_label"] as eui.Label).text = otherData.playerId == DataManager.getInstance().playerManager.player.id ? DataManager.getInstance().playerManager.player.name : otherData.name;
	}
	public onUpdateProgress(hp, maxhp = 0): void {
		if (maxhp > 0)
			this.progressBar.maximum = maxhp;
		this.progressBar.value = Math.max(0, hp);
		(this.progressBar["hp_label"] as eui.Label).text = this.progressBar.value + "/" + this.progressBar.maximum;
	}
	public onRemove(): void {
		if (this.parent)
			this.parent.removeChild(this);
	}
}