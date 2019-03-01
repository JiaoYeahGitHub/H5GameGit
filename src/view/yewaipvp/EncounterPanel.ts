class EncounterPanel extends BaseTabView {
	private prestige_label: eui.Label;
	private rank_label: eui.Label;
	private loop_rank_btn: eui.Button;
	private fight_log_btn: eui.Button;
	private scroll: eui.Scroller;
	private itemGroup: eui.Group;
	private rank_null_lab: eui.Label;
	private rank_grp: eui.Group;

	private items: EncounterItem[];

	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.EncounterPanelSkin;
	}
	protected onInit(): void {
		this.items = [];
		super.onInit();
		this.onRefresh();
	}
	protected onRefresh(): void {
		GameFight.getInstance().onRequstYewaiFightterInfoMsg();
	}
	protected onRegist(): void {
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.YEWAIPVP_FIGHTTER_INFO_MSG.toString(), this.onReceiveFigtterMsg, this);
		this.loop_rank_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.openRankView, this);
		this.fight_log_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.openLogView, this);
	}
	protected onRemove(): void {
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.YEWAIPVP_FIGHTTER_INFO_MSG.toString(), this.onReceiveFigtterMsg, this);
		this.loop_rank_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.openRankView, this);
		this.fight_log_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.openLogView, this);
		this.onDestroyItems();
	}
	private onDestroyItems(): void {
		for (var i: number = this.itemGroup.numChildren - 1; i >= 0; i--) {
			var item: EncounterItem = this.itemGroup.getChildAt(i) as EncounterItem;
			item.onDestory();
		}
	}
	private onReceiveFigtterMsg(): void {
		var yewaipvpData: YewaiPvPManager = DataManager.getInstance().yewaipvpManager;
		this.prestige_label.text = yewaipvpData.prestige + " ";
		this.rank_null_lab.text = yewaipvpData.myrankNum > 0 ? "" : Language.instance.getText('zanwupaiming');
		if (yewaipvpData.myrankNum > 0) {
			this.rank_label.text = "" + yewaipvpData.myrankNum;
			this.rank_grp.visible = true;
		} else {
			this.rank_grp.visible = false;
		}
		var zaoyuAwdModel: Modelzaoyubang = this.getRankAwdModel(yewaipvpData.myrankNum);
		for (var i: number = 0; i < 2; i++) {
			if (zaoyuAwdModel.rewards.length > i) {
				this["awd_group" + i].visible = true;
				var modelthing: ModelThing = GameCommon.getInstance().getThingModel(zaoyuAwdModel.rewards[i].type, zaoyuAwdModel.rewards[i].id);
				(this["awd_icon" + i] as eui.Image).source = modelthing.dropicon;
				(this["awd_num_label" + i] as eui.Label).text = zaoyuAwdModel.rewards[i].num + "";
			} else {
				this["awd_group" + i].visible = false;
			}
		}
		this.onDestroyItems();
		var i: number = 0;
		for (i = 0; i < FightDefine.PVP_MAX_NUM; i++) {
			if (this.items.length <= i) {
				this.items[i] = new EncounterItem(i);
			}
			let item: EncounterItem = this.items[i];
			if (yewaipvpData.pvpfightterInfos.length > i) {
				item.data = yewaipvpData.pvpfightterInfos[i];
				item.onShow(this.itemGroup);
			} else {
				item.data = null;
				item.onShow(this.itemGroup);
				break;
			}
		}
	}

	private getRankAwdModel(rankNum: number): Modelzaoyubang {
		var models: Modelzaoyubang[] = JsonModelManager.instance.getModelzaoyubang();
		for (var key in models) {
			var modelAwdAY = models[key];
			if (modelAwdAY.rankMax > rankNum && rankNum > 0) {
				return modelAwdAY;
			}
			if (rankNum + modelAwdAY.rankMax < 0) {
				return modelAwdAY;
			}
		}

		return models[models.length];
	}
	private openRankView(): void {
		TOPRankTypeListPanel.tab = TOPRANK_TYPE.FIELD_PVP;
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "TOPRankingList");
	}
	private openLogView(): void {
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "EncounterLogPanel");
	}
	//The end
}
class EncounterItem extends BaseComp {
	private index: number;
	private head_icon: PlayerHeadUI;
	private challenge_btn: eui.Button;
	private btn_find: eui.Button;
	private name_label: eui.Label;
	private coatard_lv_lab: eui.Label;
	private level_label: eui.Label;
	private award_exp_label: eui.Label;
	// private award_gold_label: eui.Label;
	private refresh_time_label: eui.Label;

	public constructor(index: number) {
		super();
		this.index = index;
		this.skinName = skins.EncounterItemSkin;
	}
	protected onInit(): void {
		if (!this._data) {
			this.updateFindInfo();
		}
	}
	protected onRegist(): void {
		this.challenge_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchChallengeBtn, this);
		this.btn_find.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchFindBtn, this);
	}
	protected onRemove(): void {
		this.challenge_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchChallengeBtn, this);
		this.btn_find.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchFindBtn, this);
		Tool.removeTimer(this.onTimedownHandler, this, 1000);
	}
	protected dataChanged(): void {
		if (this._data) {
			this.updatePKInfo();
		} else {
			this.updateFindInfo();
		}
	}
	private updatePKInfo(): void {
		this.currentState = "fight";

		let otherData: OtherFightData = this._data as OtherFightData;
		let awardExp: number = GameFight.getInstance().getYewaiExp() * 15;

		this.name_label.text = otherData.playerName;
		this.coatard_lv_lab.text = `${otherData.reinLv}转${otherData.duanLv}段`;
		this.level_label.text = otherData.level + "级";
		this.award_exp_label.text = awardExp + "";
		let awarditems: AwardItem[] = GameCommon.getInstance().onParseAwardItemstr(Constant.get(Constant.FIELD_PVP_REWARD_SUCC));
		for (let i: number = 0; i < 2; i++) {
			let awditem: AwardItem = awarditems[i];
			if (awditem) {
				let thingmodel: ModelThing = GameCommon.getInstance().getThingModel(awditem.type, awditem.id);
				(this['awd_icon' + i] as eui.Image).source = thingmodel.dropicon;
				(this['awd_num_lab' + i] as eui.Label).text = awditem.num + "";
			} else {
				(this['awd_icon' + i] as eui.Image).source = "";
				(this['awd_num_lab' + i] as eui.Label).text = "";
			}
		}
		this.head_icon.setHead(otherData.headIndex, otherData.headFrame);
	}
	private updateFindInfo(): void {
		this.currentState = "find";
		Tool.addTimer(this.onTimedownHandler, this, 1000);
	}
	private getRefreshTimeDesc(): string {
		var tiemdesc: string = Tool.getTimeStr(DataManager.getInstance().yewaipvpManager.resetTime);
		return tiemdesc;
	}
	private onTimedownHandler(): void {
		this.refresh_time_label.textFlow = (new egret.HtmlTextParser).parse(Tool.getHtmlColorStr(this.getRefreshTimeDesc(), "FF0000") + "后出现新的敌人");
		if (DataManager.getInstance().yewaipvpManager.resetTime <= 0) {
			Tool.removeTimer(this.onTimedownHandler, this, 1000);
			GameFight.getInstance().onRequstYewaiFightterInfoMsg();
		}
	}
	private onTouchChallengeBtn(): void {
		GameFight.getInstance().onSendYewaiPVPPKMsg(this.index);
	}
	private onTouchFindBtn(): void {
		var findNotice = [{ text: `是否花费${Constant.get(Constant.SEARCH_CHALLENGE_DIAMOND)}钻石进行一次寻敌？`, style: { textColor: 0xe63232 } }];
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
			new WindowParam("AlertFrameUI", new AlertFrameParam(findNotice, function () {
				if (DataManager.getInstance().playerManager.player.gold < 10) {
					GameCommon.getInstance().addAlert(GameErrorTip.getInstance().getGameErrorTip(2));
					return;
				}
				var findEnemyMsg: Message = new Message(MESSAGE_ID.YEWAIPVP_FIND_FIGHTTER_MSG);
				GameCommon.getInstance().sendMsgToServer(findEnemyMsg);
			}, this))
		);
	}
	//The end
}