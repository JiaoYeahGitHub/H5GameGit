class UnionMainCityPanel extends BaseWindowPanel {
	private union_exp_pro: eui.ProgressBar;
	private lbName: eui.Label;
	private lbMaster: eui.Label;
	private lbNumber: eui.Label;
	private lbLevel: eui.Label;
	private union_badges: eui.Component;

	private union_list: eui.List;

	private btnIcons: eui.Button[];

	private time_desc_label: eui.Label;
	private timedown_label: eui.Label;
	// private btn_back: eui.Button;
	// protected points: redPoint[] = RedPointManager.createPoint(3);

	public constructor(owner: ModuleLayer) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.UnionMainCityPanelSkin;
	}
	protected onInit(): void {
		super.onInit();
		this.setTitle("仙盟");
		this.btnIcons = [];
		for (let i = 0; i < 8; ++i) {
			this.btnIcons[i] = this["btnIcon" + i];
			this.btnIcons[i].name = i.toString();
			if (i < 7) {
				this.createRedPoint().register(this.btnIcons[i], new egret.Point(90, 10), this, "checkRedPoint", this.btnIcons[i]);
			}
		}
		this.onRefresh();
	}
	private checkRedPoint(btn: eui.Button) {
		let idx = parseInt(btn.name);
		switch (idx) {
			case 0: return DataManager.getInstance().unionManager.checkUnionSkillRedPoint();
			case 1: return false;
			case 2: return DataManager.getInstance().unionManager.checkTributeRedPoint();
			case 3: return false;
			case 4: return DataManager.getInstance().unionManager.checkUnionBossPoint();
			case 5: return false;
			case 6: return false;
		}
		return false;
	}
	protected onRefresh(): void {
		this.trigger();
		DataManager.getInstance().unionManager.onReqUnionInfoMsg();
		DataManager.getInstance().unionManager.onReqUnionMember();
	}
	protected onRegist(): void {
		super.onRegist();
		for (let i = 0; i < this.btnIcons.length; ++i) {
			this.btnIcons[i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtn, this);
		}
		// this.btn_0.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onOpenHall, this);
		// this.btn_1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onOpenDungeon, this);
		// this.btn_2.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onOpenShilian, this);
		// this.btn_3.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onOpenGangFight, this);
		// this.btn_4.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onOpenRank, this);
		// this.btn_5.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onOpenTask, this);
		// this.btn_6.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onOpenSkill, this);

		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.UNION_INFO_MESSAGE.toString(), this.updateInfo, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.UNION_MEMBER_LIST_MESSAGE.toString(), this.updateMember, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.UNION_POSTION_MESSAGE.toString(), this.updateMember, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.UNION_DELETE_MEMBER_MESSAGE.toString(), this.updateMember, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.UNION_BATTLE_GROUPINFO_MESSAGE.toString(), this.onResUnionBattleGroup, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.UNION_TRIBUTE_MESSAGE.toString(), this.updateInfo, this);
		// GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.UNION_QUIT_MESSAGE.toString(), this.onResUnionInfoMsg, this);

		this.onReqUnionBattleGroup();
		// this.btn_back.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchCloseBtn, this);
	}
	protected onRemove(): void {
		super.onRemove();
		for (let i = 0; i < this.btnIcons.length; ++i) {
			this.btnIcons[i].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtn, this);
		}
		// this.btn_0.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onOpenHall, this);
		// this.btn_1.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onOpenDungeon, this);
		// this.btn_2.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onOpenShilian, this);
		// this.btn_3.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onOpenGangFight, this);
		// this.btn_4.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onOpenRank, this);
		// this.btn_5.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onOpenTask, this);
		// this.btn_6.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onOpenSkill, this);

		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.UNION_INFO_MESSAGE.toString(), this.updateInfo, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.UNION_MEMBER_LIST_MESSAGE.toString(), this.updateMember, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.UNION_POSTION_MESSAGE.toString(), this.updateMember, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.UNION_DELETE_MEMBER_MESSAGE.toString(), this.updateMember, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.UNION_BATTLE_GROUPINFO_MESSAGE.toString(), this.onResUnionBattleGroup, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.UNION_TRIBUTE_MESSAGE.toString(), this.updateInfo, this);
		// GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.UNION_QUIT_MESSAGE.toString(), this.onResUnionInfoMsg, this);
		// this.btn_back.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchCloseBtn, this);
	}
	private onTouchBtn(e: egret.TouchEvent) {
		switch (parseInt(e.currentTarget.name)) {
			case 0:
				this.onOpenSkill();
				break;
			case 1:
				this.onOpenGangFight();
				break;
			case 2:
				this.openTributePanel();
				break;
			case 3:
				this.openZhuanpanView();
				break;
			case 4:
				this.onOpenDungeon();
				break;
			case 5:
				this.openUnionChatPanel();
				break;
			case 6:
				this.onOpenRank();
				break;
			case 7:
				// this.onQuitOrDissolved();
				this.openMemberListView();
				break;
		}
	}
	//退出或解散公会
	// private onQuitOrDissolved(): void {
	// 	var myUnionData: UnionMemberInfo = DataManager.getInstance().unionManager.unionInfo.selfData;
	// 	if (myUnionData && myUnionData.postion == UNION_POSTION.WANG) {//解散公会
	// 		var dissolvedNotice = [{ text: `您确定要将仙盟解散？（解散后仙盟将无法找回，请慎重考虑）`, style: { textColor: 0xe63232 } }];
	// 		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
	// 			new WindowParam("AlertFrameUI", new AlertFrameParam(dissolvedNotice, function () {
	// 				var dissolvedMsg: Message = new Message(MESSAGE_ID.UNION_DISSOLVED_MESSAGE);
	// 				GameCommon.getInstance().sendMsgToServer(dissolvedMsg);
	// 			}, this))
	// 		);
	// 	} else {//退出公会
	// 		var quitNotice = [{ text: `您确定要退出仙盟？（请慎重考虑）`, style: { textColor: 0xe63232 } }];
	// 		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
	// 			new WindowParam("AlertFrameUI", new AlertFrameParam(quitNotice, function () {
	// 				var quitMsg: Message = new Message(MESSAGE_ID.UNION_QUIT_MESSAGE);
	// 				GameCommon.getInstance().sendMsgToServer(quitMsg);
	// 			}, this))
	// 		);
	// 	}
	// }
	// private onResUnionInfoMsg(): void {
	// 	if (!DataManager.getInstance().unionManager.unionInfo) {//无帮会
	// 		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "UnionListPanel");
	// 	}
	// 	super.onRefresh();
	// }
	private updateInfo() {
		var myUnionInfo: MyUnionData = DataManager.getInstance().unionManager.unionInfo;
		if (myUnionInfo) {
			this.lbName.text = "仙盟：" + myUnionInfo.info.name;
			this.lbMaster.text = "盟主：" + myUnionInfo.info.wangName;
			this.lbNumber.text = "盟众：" + myUnionInfo.info.memberCount + "/" + myUnionInfo.getUnionLevelModel().renshuMax;
			this.lbLevel.text = "仙盟等级： " + myUnionInfo.info.level + "级";
			var colorIndex: number = Tool.toInt(myUnionInfo.info.badgesIndex / UnionDefine.Union_Badges_ColorNum) + 1;
			(this.union_badges["badges_bg"] as eui.Image).source = `union_badges_bg${colorIndex}_png`;
			var iconIndex: number = myUnionInfo.info.badgesIndex % UnionDefine.Union_Badges_IconNum + 1;
			(this.union_badges["badges_icon"] as eui.Image).source = `union_badges_icon${iconIndex}_png`;

			if (myUnionInfo.getUnionLevelModel().exp == 0) {
				this.union_exp_pro.maximum = 1;
				this.union_exp_pro.value = 1;
				this.union_exp_pro.labelFunction = function (value: number, maximum: number): string {
					return "Max";
				};
			} else {
				this.union_exp_pro.maximum = myUnionInfo.getUnionLevelModel().exp;
				this.union_exp_pro.value = myUnionInfo.unionExp;
			}
		}
	}
	private updateMember() {
		var myUnionInfo: MyUnionData = DataManager.getInstance().unionManager.unionInfo;
		this.union_list.itemRenderer = UnionMainCityMemberItem;
		this.union_list.itemRendererSkinName = skins.UnionMainCityMemberItemSkin;
		let list: UnionMemberInfo[] = DataManager.getInstance().unionManager.unionInfo.unionMemberList;
		list.sort(function (a, b): number {
			return a.postion - b.postion;
		});
		this.union_list.dataProvider = new eui.ArrayCollection(list);
	}
	//打开大厅
	private onOpenHall(): void {
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "UnionHallPanel");
	}
	//打开帮会聊天面板
	private openUnionChatPanel(): void {
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("ChatMainPanel", new ChatPanelParam(CHANNEL.CURRENT, null)));
	}
	//打开上香界面
	private openTributePanel(): void {
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "UnionTributePanel");
	}
	//打开公会成员界面
	private openMemberListView(): void {
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "UnionMemberListPanel");
	}
	//打开密阁
	private openZhuanpanView(): void {
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "UnionTurnplatePanel");
	}
	//打开副本
	private onOpenDungeon(): void {
		if (!FunDefine.onIsLockandErrorHint(FUN_TYPE.FUN_UNION_BOSS_FAM)) {
			GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "UnionBossFightPanel");
		}
		// GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("UnionMainPanel", UnionDefine.TAB_DUP));
		// this.unOpenAltet();
	}
	//打开试炼
	private onOpenShilian(): void {
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "UnionBossFightPanel");
		// this.unOpenAltet();
	}
	//打开帮会战
	private onOpenGangFight(): void {
		GameCommon.getInstance().addAlert("敬请期待");
		// GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("UnionBattleGroupView", UnionDefine.TAB_BATTLE));
	}
	//打开排行
	private onOpenRank(): void {
		// GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("UnionMainPanel", "openUnionRankView"));
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "UnionRankView");
	}
	//打开任务
	private onOpenTask(): void {
		// GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("UnionMainPanel", "openUnionTaskView"));
		this.unOpenAltet();
	}
	//打开技能
	private onOpenSkill(): void {
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "UnionSkillPanel");
		// this.unOpenAltet();
	}
	//功能暂未开启
	private unOpenAltet(): void {
		GameCommon.getInstance().addAlert("功能暂未开启，敬请期待!");
	}
	public onShow(): void {
		if (!DataManager.getInstance().unionManager.unionInfo) {
			GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "UnionListPanel");
			return;
		}
		super.onShow();
	}

	//请求帮会战分组
	private onReqUnionBattleGroup(): void {
		this.timedown_label.text = "";
		this.examineCD(false);

		var battlegroupREQMSG: Message = new Message(MESSAGE_ID.UNION_BATTLE_GROUPINFO_MESSAGE);
		battlegroupREQMSG.setBoolean(false);
		GameCommon.getInstance().sendMsgToServer(battlegroupREQMSG);
	}
	//帮会战分组返回
	private onResUnionBattleGroup(): void {
		//时间状态描述
		if (this.battleInfo.state == UNIONBATTLE_STATE.NOT) {
			this.time_desc_label.text = Language.instance.getText('unionbattle_NOT_timedesc');
		} else if (this.battleInfo.state == UNIONBATTLE_STATE.READY) {
			this.time_desc_label.text = Language.instance.getText('unionbattle_READY_timedesc');
		} else if (this.battleInfo.state == UNIONBATTLE_STATE.FIGHT) {
			this.time_desc_label.text = Language.instance.getText('unionbattle_FIGHT_timedesc');
		} else if (this.battleInfo.state == UNIONBATTLE_STATE.RESULT) {
			this.time_desc_label.text = Language.instance.getText('unionbattle_RESULT_timedesc');
		}
		if (this.battleInfo.state == UNIONBATTLE_STATE.FIGHT) {
			this.examineCD(false);
			this.timedown_label.text = '';
		} else {
			this.examineCD(true);
		}
	}

	//倒计时
	private _timeOpen: boolean;
	public examineCD(open: boolean) {
		if (this._timeOpen != open) {
			this._timeOpen = open;
			if (open) {
				Tool.addTimer(this.onCountDown, this, 1000);
			} else {
				Tool.removeTimer(this.onCountDown, this, 1000);
			}
		}
	}
	private onCountDown(): void {
		var leftime: number = Math.ceil((this.battleInfo.timecount - egret.getTimer()) / 1000);
		if (leftime > 0) {
		} else {
			leftime = 0;
			this.examineCD(false);
			this.onReqUnionBattleGroup();
		}
		this.timedown_label.text = GameCommon.getInstance().getTimeStrForSec1(leftime);
	}
	//帮会战信息数据
	private get battleInfo(): UnionBattleInfo {
		return DataManager.getInstance().unionManager.unionbattleInfo;
	}
	//The end
}

class UnionMainCityMemberItem extends eui.ItemRenderer {
	private union_name_label: eui.Label;
	private union_postion_label: eui.Label;
	private online_time_label: eui.Label;
	private donate_label: eui.Label;// 贡献
	private btn: eui.Group;
	public constructor() {
		super();
		this.once(egret.Event.COMPLETE, this.onComplete, this);
	}
	private onComplete(): void {
		this.btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
	}
	private onTouch() {
		var memberInfo: UnionMemberInfo = this.data as UnionMemberInfo;
		if (memberInfo.playerdata.id != DataManager.getInstance().playerManager.player.id) {
			GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("UnionMemberInfoView", memberInfo));
		}
	}
	protected dataChanged(): void {
		var memberInfo: UnionMemberInfo = this.data as UnionMemberInfo;
		var myUnionData: UnionMemberInfo = DataManager.getInstance().unionManager.unionInfo.selfData;
		if (memberInfo.playerdata.id == DataManager.getInstance().playerManager.player.id) {
			this.setSelf();
		}
		// // 踢出，任命按钮
		// if ((myUnionData.postion == UNION_POSTION.WANG || myUnionData.postion == UNION_POSTION.FUBANG || myUnionData.postion == UNION_POSTION.ZHANGLAO)
		// 	&& memberInfo.playerdata.id != DataManager.getInstance().playerManager.player.id
		// 	&& memberInfo.postion > DataManager.getInstance().unionManager.unionInfo.selfData.postion) {
		// 	this.opt_group.visible = true;
		// } else {
		// 	this.opt_group.visible = false;
		// }
		this.union_name_label.text = memberInfo.playerdata.name;
		this.union_postion_label.text = UnionDefine.Union_Postions[memberInfo.postion];
		this.donate_label.text = memberInfo.donate.toString();
		var txtArray: string[] = DataManager.getInstance().friendManager.getOnlineTime(memberInfo.offLineTime).split("|");
		if (txtArray[1] == "online") {
			this.online_time_label.text = "在线";
		} else {
			this.online_time_label.text = txtArray[0] + DataManager.getInstance().friendManager.getOnlineStr(txtArray[1]);
		}
		// 弹劾按钮
		// if (memberInfo.postion == UNION_POSTION.WANG && DataManager.getInstance().unionManager.unionInfo.isImpeachment == 1) {
		// 	this.impeachmentBtn.visible = true;
		// 	this.impeachmentBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onImpeachment, this);
		// } else {
		// 	this.impeachmentBtn.visible = false;
		// }
	}
	private setSelf() {
		this.union_name_label.textColor =
			this.union_postion_label.textColor =
			this.online_time_label.textColor =
			this.donate_label.textColor = 0x10d6f5;
	}
}