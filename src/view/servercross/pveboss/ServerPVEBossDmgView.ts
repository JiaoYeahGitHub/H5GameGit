class ServerPVEBossDmgView extends BaseWindowPanel {
	private btn_sure: eui.Button;
	private boss_scroll: eui.Scroller;
	private itemGroup: eui.List;
	private killer_label: eui.Label;
	private param: ServerPVEBossDmgParam;
	public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;

	public constructor(owner: ModuleLayer) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.SamsaraKillerLogSkin;
	}
	protected onRegist(): void {
		super.onRegist();
		this.btn_sure.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.CROSS_PVEBOSS_RANK_MESSAGE.toString(), this.onResDamageRankMsg, this);
	}
	protected onRemove(): void {
		super.onRemove();
		this.btn_sure.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.CROSS_PVEBOSS_RANK_MESSAGE.toString(), this.onResDamageRankMsg, this);
	}
	private get data(): CrossPVEBossData {
		return DataManager.getInstance().dupManager.crossPVEBoss;
	}
	//供子类覆盖
	protected onInit(): void {
		this.setTitle("伤害排行");
		this.setTitlePercent(0.9);

		this.itemGroup.itemRenderer = ServerPVEBossDmgItem;
		this.itemGroup.itemRendererSkinName = skins.SamsaraKillerLogItemSkin;
		this.itemGroup.useVirtualLayout = false;
		this.boss_scroll.viewport = this.itemGroup;
		super.onInit();
		this.onRefresh();
	}
	protected onRefresh(): void {
		DataManager.getInstance().dupManager.sendPVEBossDmgRankRequst(this.param.bossId);
	}
	private onRequestKillLogMsg(): void {
		var damagerankMsg: Message = new Message(MESSAGE_ID.CROSS_PVEBOSS_RANK_MESSAGE);
		damagerankMsg.setShort(this.param.bossId);
		GameCommon.getInstance().sendMsgToServer(damagerankMsg);
	}
	private onResDamageRankMsg(mesEvent: GameMessageEvent): void {
		this.itemGroup.dataProvider = new eui.ArrayCollection(this.data.rankList);
		this.boss_scroll.viewport.scrollV = 0;
		if (this.param.autoClose > 0) {
			this.leftCloseTime = this.param.autoClose;
			Tool.addTimer(this.autoCloseHandler, this, 1000);
		} else {
			this.btn_sure.label = Language.instance.getText('sure');
		}

		let rankdesc: string = Language.instance.getText('wodepaiming', ':', this.data.myRankNum > 0 ? this.data.myRankNum + '' : 'weishangbang');
		let damagedesc: string = '';
		if (this.param.damageVaule > 0) {
			damagedesc = Language.instance.getText('current2', 'dps', ':', this.param.damageVaule + '');
		}
		this.killer_label.text = rankdesc + '   ' + damagedesc;
	}
	private leftCloseTime: number = 0;
	private autoCloseHandler(): void {
		this.leftCloseTime--;
		this.btn_sure.label = `${Language.instance.getText("sure")}(${this.leftCloseTime})`;
		if (this.leftCloseTime <= 0) {
			this.onHide();
		}
	}
	public onShowWithParam(param): void {
		this.param = param as ServerPVEBossDmgParam;
		if (this.param) {
			this.onShow();
		}
	}
	public onHide(): void {
		super.onHide();
		Tool.removeTimer(this.autoCloseHandler, this, 1000);
		if (GameFight.getInstance().fightsceneTpye == FIGHT_SCENE.CROSS_PVE_BOSS) {
			GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GAME_CLOSE_RESULT_VIEW));
		}
	}
	//The end
}
class ServerPVEBossDmgItem extends BaseListItem {
	private rank_num: eui.Label;
	private vip_label: eui.Image;
	private name_label: eui.Label;
	private power_label: eui.Label;

	constructor() {
		super();
	}
	protected onUpdate(): void {
		var rankData: CrossPVEBossRank = this.data as CrossPVEBossRank;
		this.rank_num.text = "" + rankData.rank;
		if (rankData.playerData.viplevel > 0) {
			this.vip_label.visible = true;
		} else {
			this.vip_label.visible = false;
		}
		this.name_label.text = rankData.playerData.name;
		this.power_label.text = "" + rankData.damageValue;
	}
	//The end
}
class ServerPVEBossDmgParam {
	public bossId: number;
	public autoClose: number = 0;
	public damageVaule: number = 0;

	constructor(bossId: number, damageVaule, autoClose = 0) {
		this.bossId = bossId;
		this.damageVaule = damageVaule;
		this.autoClose = autoClose;
	}
}