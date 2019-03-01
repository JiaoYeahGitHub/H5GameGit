class MarryEquipSuitBoss extends BaseSystemPanel {
	public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;

	private lefttimes_bar: TimesBar;
	private groupGoods: eui.Group;
	private challenge_btn: eui.Button;
	private id: number;

	private dupinfo: DupInfo;
	private modelZDFB: Modelzuduifuben;
	public constructor(owner: ModuleLayer) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.MarryEquipSuitBossSkin;
	}
	protected onInit(): void {
		super.onInit();
		this.setTitle("marry_tz_boss_title_png");
		this.dupinfo = DataManager.getInstance().dupManager.getDupInfolistByType(DUP_TYPE.DUP_MARRY_EQUIP_SUIT_BOSS)[0];
		this.modelZDFB = JsonModelManager.instance.getModelzuduifuben()[this.dupinfo.id];
		let rewards = this.modelZDFB.rewards;
		if (rewards) {
			for (let i = 0; i < rewards.length; ++i) {
				let award: AwardItem = rewards[i];
				let goods = new GoodsInstance();
				goods.onUpdate(award.type, award.id, award.uid, award.quality, award.num);
				this.groupGoods.addChild(goods);
			}
		}
	}
	protected onRegist(): void {
		super.onRegist();
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.GAME_DUP_INFO_MESSAGE.toString(), this.onRefreshSweep, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.GAME_DUP_SWEEP_MESSAGE.toString(), this.onRefreshSweep, this);
		this.challenge_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onChallengeDup, this);
		this.onRequestDupInfo();
	}
	protected onRemove(): void {
		super.onRemove();
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.GAME_DUP_INFO_MESSAGE.toString(), this.onRefreshSweep, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.GAME_DUP_SWEEP_MESSAGE.toString(), this.onRefreshSweep, this);
		this.challenge_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onChallengeDup, this);
	}
	//去请求副本信息
	private onRequestDupInfo(): void {
		DataManager.getInstance().dupManager.onRequestDupInofMsg(DUP_TYPE.DUP_MARRY_EQUIP_SUIT_BOSS);
	}
	private onRefreshSweep(): void {
		let dupinfo: DupInfo = DataManager.getInstance().dupManager.getDupInfo(DUP_TYPE.DUP_MARRY_EQUIP_SUIT_BOSS, 1);
		this.challenge_btn.enabled = dupinfo.lefttimes > 0;
		this.lefttimes_bar.data = ['', dupinfo.lefttimes, dupinfo.totalTimes];
	}
	private get ringManager() {
		return DataManager.getInstance().ringManager;
	}
	private onChallengeDup(event: egret.Event): void {
		if (this.dupinfo) {
			if (this.dupinfo.teamPassRecord > 0 && this.dupinfo.lefttimes != 5) {
				if (this.dupinfo.lefttimes <= 0) {
					GameCommon.getInstance().addAlert("error_tips_6");
					return;
				}
			}
			GameFight.getInstance().onSendCreateTeamDupRoomMsg(this.dupinfo.dupModel.id);
		}
	}
}