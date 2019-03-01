class SamsaraBossKillLogPanel extends BaseWindowPanel {
	private btn_sure: eui.Button;
	private boss_scroll: eui.Scroller;
	private itemGroup: eui.List;
	private killer_label: eui.Label;
	private param: SamsaraBossKillLogParam;
	private rankDatas: SimpleFightRankData[];
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
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.SAMSARA_BOSS_KILLLOG_MSG.toString(), this.onResKillLogMsg, this);
	}
	protected onRemove(): void {
		super.onRemove();
		this.btn_sure.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.SAMSARA_BOSS_KILLLOG_MSG.toString(), this.onResKillLogMsg, this);
	}
	//供子类覆盖
	protected onInit(): void {
		this['basic']['label_title'].text = '排行'
		this.setTitlePercent(0.9);
		this.itemGroup.itemRenderer = SamsaraBossKillLogItem;
		this.itemGroup.itemRendererSkinName = skins.SamsaraKillerLogItemSkin;
		this.itemGroup.useVirtualLayout = false;
		this.boss_scroll.viewport = this.itemGroup;
		super.onInit();
		this.onRefresh();
	}
	protected onRefresh(): void {
		this.onRequestKillLogMsg();
	}
	private onRequestKillLogMsg(): void {
		var killlogMsg: Message = new Message(MESSAGE_ID.SAMSARA_BOSS_KILLLOG_MSG);
		killlogMsg.setShort(this.param.bossId);
		GameCommon.getInstance().sendMsgToServer(killlogMsg);
	}
	private onResKillLogMsg(mesEvent: GameMessageEvent): void {
		if (!this.rankDatas) {
			this.rankDatas = [];
		} else {
			for (var i: number = this.rankDatas.length - 1; i >= 0; i--) {
				this.rankDatas[i] = null;
				this.rankDatas.splice(i, 1);
			}
		}
		var msg: Message = mesEvent.message;
		var rankSize: number = msg.getByte();
		for (var i: number = 0; i < rankSize; i++) {
			this.rankDatas[i] = new SimpleFightRankData();
			this.rankDatas[i].onParseMsg(msg, i + 1);
		}
		var hasKiller: boolean = msg.getBoolean();
		if (hasKiller) {
			var killerName: string = msg.getString();
			this.killer_label.text = Language.instance.getText('jishazhe', '：', killerName);
		} else {
			this.killer_label.text = Language.instance.getText("hyhwyrjsBoss");
		}
		this.itemGroup.dataProvider = new eui.ArrayCollection(this.rankDatas);
		this.boss_scroll.viewport.scrollV = 0;
		if (this.param.autoClose > 0) {
			this.leftCloseTime = this.param.autoClose;
			Tool.addTimer(this.autoCloseHandler, this, 1000);
		} else {
			this.btn_sure.label = Language.instance.getText('sure');
		}
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
		this.param = param as SamsaraBossKillLogParam;
		if (this.param) {
			this.onShow();
		}
	}
	public onHide(): void {
		super.onHide();
		Tool.removeTimer(this.autoCloseHandler, this, 1000);
		if (this.param.isLeave && GameFight.getInstance().fightsceneTpye == FIGHT_SCENE.SAMSARA_BOSS) {
			GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GAME_CLOSE_RESULT_VIEW));
		}
	}
	//The end
}
class SamsaraBossKillLogItem extends BaseListItem {
	private rank_num: eui.Label;
	private vip_label: eui.Image;
	private name_label: eui.Label;
	private power_label: eui.Label;

	constructor() {
		super();
	}
	protected onUpdate(): void {
		var rankData: SimpleFightRankData = this.data as SimpleFightRankData;
		this.rank_num.text = "" + rankData.rank;
		if (rankData.vipLevel > 0) {
			this.vip_label.visible = true;
		} else {
			this.vip_label.visible = false;
		}
		this.name_label.text = rankData.playerName;
		this.power_label.text = "" + rankData.damageValue;
	}
	//The end
}
class SamsaraBossKillLogParam {
	public bossId: number;
	public autoClose: number = 0;
	public isLeave: boolean;

	constructor(bossId: number, autoClose = 0, isLeave = false) {
		this.bossId = bossId;
		this.autoClose = autoClose;
		this.isLeave = isLeave;
	}
}