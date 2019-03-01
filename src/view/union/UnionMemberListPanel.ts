class UnionMemberListPanel extends BaseWindowPanel {
	public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;

	private exit_btn: eui.Button;
	private list_scroll: eui.Scroller;
	private union_list: eui.List;
	private tab_group: eui.Group;
	private auto_adopt_cb: eui.CheckBox;
	private limit_group: eui.Group;
	private limit_btn: eui.Button;
	private agree_btn: eui.Button;
	// private basic: eui.Group;
	private tab_btns: eui.RadioButton[];
	private tabbtn_groups: eui.Group[];
	
	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.UnionMemberPanelSkin;
	}
	//供子类覆盖
	protected onInit(): void {
		this.tabbtn_groups = [];
		this.tab_btns = [];
		let names = ["", "审核", "日志"];
		for(let i = 0; i < 3; ++i){
			this.tab_btns[i] = this["tab_btn" + i];
			this.tab_btns[i]["tab_name"].text = names[i];
			this.tabbtn_groups[i] = this["tabbtn_group" + i];
			this.tabbtn_groups[i].name = i.toString();
		}
		this.list_scroll.verticalScrollBar.autoVisibility = false;
		this.list_scroll.verticalScrollBar.visible = false;
		// this.union_list.percentWidth = 525;
		// this.union_list.percentHeight = 150;
		// this.union_list.useVirtualLayout = true;
		this.list_scroll.viewport = this.union_list;

		this.setTitle("仙盟管理");
		super.onInit();
		this.onRefresh();
	}
	protected onRegist(): void {
		super.onRegist();
		this.exit_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onQuitOrDissolved, this);
		this.auto_adopt_cb.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onChangeAutoDopt, this);
		this.limit_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.openLvLimitView, this);
		this.agree_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onAgreeAll, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.UNION_MEMBER_LIST_MESSAGE.toString(), this.onResMemberListMsg, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.UNION_POSTION_MESSAGE.toString(), this.onResMemberListMsg, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.UNION_DELETE_MEMBER_MESSAGE.toString(), this.onResMemberListMsg, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.UNION_REVIEW_LIST_MESSAGE.toString(), this.onResApplyPlayerListMsg, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.UNION_REVIEW_OPERATION_MESSAGE.toString(), this.onResOperationMsg, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.UNION_REVIEW_AGREE_ALL.toString(), this.onResAgreeAllMsg, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.UNION_LOG_MESSAGE.toString(), this.onResUnionLogMsg, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.UNION_INFO_MESSAGE.toString(), this.onResUnionInfoMsg, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.UNION_QUIT_MESSAGE.toString(), this.onResUnionInfoMsg, this);
		for(let i = 0; i < 3; ++i){
			this.tabbtn_groups[i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTabBtn, this);
		}
		this.auto_adopt_cb.selected = DataManager.getInstance().unionManager.unionInfo.autoAdopt;
		this.tab_group.removeChildren();
		// this.tab_group.addChild(this.tabbtn_groups[0]);
		this.tab_group.addChild(this.tabbtn_groups[2]);
		if (this.getAuthority()) {
			this.tab_group.addChild(this.tabbtn_groups[1]);
		}
		this.onchangeTabHandler(2);
	}
	protected onRemove(): void {
		super.onRemove();
		this.exit_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onQuitOrDissolved, this);
		this.auto_adopt_cb.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onChangeAutoDopt, this);
		this.limit_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.openLvLimitView, this);
		this.agree_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onAgreeAll, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.UNION_MEMBER_LIST_MESSAGE.toString(), this.onResMemberListMsg, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.UNION_POSTION_MESSAGE.toString(), this.onResMemberListMsg, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.UNION_DELETE_MEMBER_MESSAGE.toString(), this.onResMemberListMsg, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.UNION_REVIEW_LIST_MESSAGE.toString(), this.onResApplyPlayerListMsg, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.UNION_REVIEW_OPERATION_MESSAGE.toString(), this.onResOperationMsg, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.UNION_REVIEW_AGREE_ALL.toString(), this.onResAgreeAllMsg, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.UNION_LOG_MESSAGE.toString(), this.onResUnionLogMsg, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.UNION_INFO_MESSAGE.toString(), this.onResUnionInfoMsg, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.UNION_QUIT_MESSAGE.toString(), this.onResUnionInfoMsg, this);
		for(let i = 0; i < 3; ++i){
			this.tabbtn_groups[i].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTabBtn, this);
		}
		this.union_list.dataProvider = null;
		this.tab_btns[this.currTabIndex].selected = false;
		this.currTabIndex = -1;
	}
	//点击页签事件
	private onTouchTabBtn(event: egret.Event): void {
		var selectedIndex: number = parseInt(event.currentTarget.name);
		this.onchangeTabHandler(selectedIndex);
	}
	//切换页签
	private currTabIndex: number = -1;
	private onchangeTabHandler(index: number): void {
		if (this.currTabIndex != index) {
			this.limit_group.visible = false;
			this.agree_btn.visible = false;
			this.exit_btn.visible = false;
			this.currTabIndex = index;
			this.union_list.dataProvider = null;
			switch (index) {
				case 0:
					// this.list_scroll.height = 515;
					// this.setTitle("union_member_title_png");
					// this.exit_btn.visible = true;
					// this.onReqMemberListMsg();
					break;
				case 1:
					// this.list_scroll.height = 515;
					// this.setTitle("union_member_title_png");
					this.setTitle("仙盟审核");
					if (this.getAuthority()) {
						this.limit_group.visible = true;
						this.agree_btn.visible = true;
						this.onReqApplyPlayerListMsg();
					}
					break;
				case 2:
					this.exit_btn.visible = true;
					// this.setTitle("union_log_title_png");
					this.setTitle("仙盟日志");
					// this.list_scroll.height = 600;
					this.onReqUnionLogMsg();
					break;
			}
			this.tab_btns[this.currTabIndex].selected = true;
		}
	}
	//请求查看成员列表协议
	private reqMemberListTime: number = 0;
	private onReqMemberListMsg(): void {
		if (this.reqMemberListTime - egret.getTimer() > 0) {
			this.onResMemberListMsg();
			return;
		}
		this.reqMemberListTime = egret.getTimer() + 2000;
		DataManager.getInstance().unionManager.onReqUnionMember();
	}
	//返回成员列表信息
	private onResMemberListMsg(): void {
		if (this.getAuthority()) {
			this.tab_group.addChild(this.tabbtn_groups[1]);
		}
		var myUnionData: UnionMemberInfo = DataManager.getInstance().unionManager.unionInfo.selfData;
		this.exit_btn.label = (myUnionData && myUnionData.postion == UNION_POSTION.WANG) ? "解散仙盟" : "退出仙盟";

		this.union_list.itemRenderer = UnionMemberItem;
		this.union_list.itemRendererSkinName = skins.UnionMemberItemSkin;

		let list: UnionMemberInfo[] = DataManager.getInstance().unionManager.unionInfo.unionMemberList;
		list.sort(function (a, b): number {
			return a.postion - b.postion;
		});
		this.union_list.dataProvider = new eui.ArrayCollection(list);
	}
	//请求查看申请列表
	private reqApplyListTime: number = 0;
	private onReqApplyPlayerListMsg(): void {
		if (this.reqApplyListTime - egret.getTimer() > 0) {
			return;
		}
		this.reqApplyListTime = egret.getTimer() + 2000;
		var reviewlistMsg: Message = new Message(MESSAGE_ID.UNION_REVIEW_LIST_MESSAGE);
		GameCommon.getInstance().sendMsgToServer(reviewlistMsg);
	}
	//返回申请列表数据
	private applyplayerList: SimplePlayerData[] = [];
	private onResApplyPlayerListMsg(msgEvnet: GameMessageEvent): void {
		var msg: Message = msgEvnet.message;
		this.union_list.itemRenderer = ApplyPlayerItem;
		this.union_list.itemRendererSkinName = skins.UnionJoinItemSkin;
		for (var i: number = this.applyplayerList.length - 1; i >= 0; i--) {
			this.applyplayerList[0] = null;
			this.applyplayerList.splice(i, 1);
		}
		var playersize: number = msg.getShort();
		for (var i: number = 0; i < playersize; i++) {
			var applyPlayerData: SimplePlayerData = new SimplePlayerData();
			applyPlayerData.parseMsg(msg);
			this.applyplayerList.push(applyPlayerData);
		}

		this.union_list.dataProvider = new eui.ArrayCollection(this.applyplayerList);
	}
	//操作申请列表返回
	private onResOperationMsg(msgEvnet: GameMessageEvent): void {
		var bool: boolean = false;
		var msg: Message = msgEvnet.message;
		var playerid: number = msg.getInt();
		var isadopt: number = msg.getByte();
		for (var i: number = this.applyplayerList.length - 1; i >= 0; i--) {
			if (playerid == this.applyplayerList[i].id) {
				if (isadopt > 0) {
					var optDesc: string = isadopt == 1 ? "通过" : "拒绝";
					GameCommon.getInstance().addAlert(`您已${optDesc}玩家${this.applyplayerList[i].name}的申请`);
				}
				this.applyplayerList[i] = null;
				this.applyplayerList.splice(i, 1);
				bool = true;
				break;
			}
		}
		if (bool) {
			this.union_list.dataProvider = new eui.ArrayCollection(this.applyplayerList);
		}
	}
	//查看申请列表的权限
	private getAuthority(): boolean {
		var myUnionData: UnionMemberInfo = DataManager.getInstance().unionManager.unionInfo.selfData;
		return myUnionData ? myUnionData.postion == UNION_POSTION.WANG
			|| myUnionData.postion == UNION_POSTION.FUBANG
			|| myUnionData.postion == UNION_POSTION.ZHANGLAO : false;
	}
	//开启关闭自动审核
	private changeAutoDoptTime: number = 0;
	private onChangeAutoDopt(): void {
		if (this.changeAutoDoptTime - egret.getTimer() > 0) {
			this.auto_adopt_cb.selected = DataManager.getInstance().unionManager.unionInfo.autoAdopt;
			GameCommon.getInstance().addAlert(GameErrorTip.getInstance().getGameErrorTip(78));
			return;
		}
		this.changeAutoDoptTime = egret.getTimer() + 2000;
		if (this.auto_adopt_cb.selected != DataManager.getInstance().unionManager.unionInfo.autoAdopt) {
			var autoAdoptMsg: Message = new Message(MESSAGE_ID.UNION_CHANGE_AUTOADOPT_MESSAGE);
			autoAdoptMsg.setBoolean(this.auto_adopt_cb.selected);
			GameCommon.getInstance().sendMsgToServer(autoAdoptMsg);
		}
	}
	//设置帮会等级限制
	private openLvLimitView(): void {
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "UnionLimitLevelPanel");
	}

	//一键同意
	private onAgreeAll(): void {
		var reviewMsg: Message = new Message(MESSAGE_ID.UNION_REVIEW_AGREE_ALL);
		GameCommon.getInstance().sendMsgToServer(reviewMsg);
	}
	//操作申请列表返回
	private onResAgreeAllMsg(msgEvnet: GameMessageEvent): void {
		GameCommon.getInstance().addAlert(`您已同意全部玩家的申请`);
		this.applyplayerList = [];
		this.union_list.dataProvider = new eui.ArrayCollection(this.applyplayerList);
	}

	//退出或解散公会
	private onQuitOrDissolved(): void {
		var myUnionData: UnionMemberInfo = DataManager.getInstance().unionManager.unionInfo.selfData;
		if (myUnionData && myUnionData.postion == UNION_POSTION.WANG) {//解散公会
			var dissolvedNotice = [{ text: `您确定要将仙盟解散？（解散后仙盟将无法找回，请慎重考虑）`, style: { textColor: 0xe63232 } }];
			GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
				new WindowParam("AlertFrameUI", new AlertFrameParam(dissolvedNotice, function () {
					var dissolvedMsg: Message = new Message(MESSAGE_ID.UNION_DISSOLVED_MESSAGE);
					GameCommon.getInstance().sendMsgToServer(dissolvedMsg);
				}, this))
			);
		} else {//退出公会
			var quitNotice = [{ text: `您确定要退出仙盟？（请慎重考虑）`, style: { textColor: 0xe63232 } }];
			GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
				new WindowParam("AlertFrameUI", new AlertFrameParam(quitNotice, function () {
					var quitMsg: Message = new Message(MESSAGE_ID.UNION_QUIT_MESSAGE);
					GameCommon.getInstance().sendMsgToServer(quitMsg);
				}, this))
			);
		}
	}
	private onResUnionInfoMsg(): void {
		if (!DataManager.getInstance().unionManager.unionInfo) {//没有帮会
			this.onHide();
			GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "UnionMainCityPanel");
		}
	}
	//返回大厅
	// private onExit(): void {
	// 	this.owner.onChangeUnionView(this.owner.Union_Hall_View);
	// }
	// public getStyle(): string {
	// 	return "bg_style1";
	// }
	//帮会列表返回
	private onResUnionLogMsg(): void {
		this.union_list.itemRenderer = UnionLogItem;
		this.union_list.itemRendererSkinName = skins.UnionLogItemSkin;
		this.union_list.dataProvider = new eui.ArrayCollection(DataManager.getInstance().unionManager.unionLogs);
	}

	//请求公会日志
	private onReqUnionLogMsg(): void {
		var myUnionData: UnionMemberInfo = DataManager.getInstance().unionManager.unionInfo.selfData;
		this.exit_btn.label = (myUnionData && myUnionData.postion == UNION_POSTION.WANG) ? "解散仙盟" : "退出仙盟";
		var unionlogMsg: Message = new Message(MESSAGE_ID.UNION_LOG_MESSAGE);
		GameCommon.getInstance().sendMsgToServer(unionlogMsg);
	}
	//The end
}
//成员列表
class UnionMemberItem extends eui.ItemRenderer {
	private union_name_label: eui.Label;
	private union_level_label: eui.Label;
	private union_postion_icon: eui.Image;
	// private headIcon: eui.Image;
	private playerHead: PlayerHeadPanel;
	private vip_group: eui.Group;
	private online_time_label: eui.BitmapLabel;
	private online_status: eui.Image
	private power_label: eui.Label;
	private donate_label: eui.Label;
	private appoint_btn: eui.Button;
	private delete_btn: eui.Button;
	private opt_group: eui.Group;
	private impeachmentBtn: eui.Button;

	public constructor() {
		super();
		this.once(egret.Event.COMPLETE, this.onComplete, this);
	}
	private onComplete(): void {
		this.appoint_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onAppoint, this);
		this.delete_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onDelete, this);
	}
	protected dataChanged(): void {
		var memberInfo: UnionMemberInfo = this.data as UnionMemberInfo;
		var myUnionData: UnionMemberInfo = DataManager.getInstance().unionManager.unionInfo.selfData;
		if ((myUnionData.postion == UNION_POSTION.WANG || myUnionData.postion == UNION_POSTION.FUBANG || myUnionData.postion == UNION_POSTION.ZHANGLAO)
			&& memberInfo.playerdata.id != DataManager.getInstance().playerManager.player.id
			&& memberInfo.postion > DataManager.getInstance().unionManager.unionInfo.selfData.postion) {
			this.opt_group.visible = true;
		} else {
			this.opt_group.visible = false;
		}
		this.union_name_label.text = memberInfo.playerdata.name;
		this.union_level_label.text = memberInfo.playerdata.level + "级";
		this.union_postion_icon.source = UnionDefine.Union_Postion_Icons[memberInfo.postion];
		// this.headIcon.source = GameCommon.getInstance().getHeadIconByIndex(memberInfo.playerdata.headindex);
		this.playerHead.setHead(memberInfo.playerdata.headindex, memberInfo.playerdata.headFrame);
		if (memberInfo.playerdata.viplevel > 0) {
			this.vip_group.visible = true;
		} else {
			this.vip_group.visible = false;
		}
		this.power_label.text = "战力：" + memberInfo.playerdata.fightvalue;
		this.donate_label.text = "贡献：" + memberInfo.donate;
		var txtArray: string[] = DataManager.getInstance().friendManager.getOnlineTime(memberInfo.offLineTime).split("|");
		if (txtArray[1] == "online") {
			this.online_time_label.visible = false;
		} else {
			this.online_time_label.visible = true;
			this.online_time_label.text = txtArray[0];
		}
		this.online_status.source = "friend_" + txtArray[1] + "_png";

		if (memberInfo.postion == UNION_POSTION.WANG && DataManager.getInstance().unionManager.unionInfo.isImpeachment == 1) {
			this.impeachmentBtn.visible = true;
			this.impeachmentBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onImpeachment, this);
		} else {
			this.impeachmentBtn.visible = false;
		}
	}
	//任命操作
	private onAppoint(): void {
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("UnionAppPointPanel", this.data))
	}
	//踢出帮会操作
	private onDelete(): void {
		var deleteNotice = [{ text: `是否将${this.data.playerdata.name}请离仙盟？（请慎重考虑）`, style: { textColor: 0xe63232 } }];
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
			new WindowParam("AlertFrameUI", new AlertFrameParam(deleteNotice, function (playerId: number) {
				var deleteMsg: Message = new Message(MESSAGE_ID.UNION_DELETE_MEMBER_MESSAGE);
				deleteMsg.setInt(playerId);
				GameCommon.getInstance().sendMsgToServer(deleteMsg);
			}, this, this.data.playerdata.id))
		);
	}
	//弹劾
	private onImpeachment(): void {
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
			new WindowParam("AlertFrameUI", new AlertFrameParam("此位不负责盟主已经连续7天未上线了，上仙是否准备消耗500钻石将其弹劾取代其盟主之位？", this.sendImpeachment, this)));
	}
	private sendImpeachment(): void {
		var message: Message = new Message(MESSAGE_ID.UNION_IMPEACHMENT_MESSAGE);
		GameCommon.getInstance().sendMsgToServer(message);
	}
	//The end
}
//申请列表
class ApplyPlayerItem extends eui.ItemRenderer {
	private union_name_label: eui.Label;
	private union_level_label: eui.Label;
	// private headIcon: eui.Image;
	private playerHead: PlayerHeadPanel;
	private vip_group: eui.Group;
	private power_label: eui.Label;
	private sure_btn: eui.Button;
	private refuse_btn: eui.Button;

	public constructor() {
		super();
		this.once(egret.Event.COMPLETE, this.onComplete, this);
	}
	private onComplete(): void {
		this.sure_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSure, this);
		this.refuse_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onRefuse, this);
	}
	protected dataChanged(): void {
		var memberInfo: SimplePlayerData = this.data as SimplePlayerData;
		this.union_name_label.text = "昵称：" + memberInfo.name;
		this.union_level_label.text = "等级：" + memberInfo.level + "级";
		// this.headIcon.source = GameCommon.getInstance().getHeadIconByIndex(memberInfo.headindex);
		this.playerHead.setHead(memberInfo.headindex, memberInfo.headFrame);
		if (memberInfo.viplevel > 0) {
			this.vip_group.visible = true;
		} else {
			this.vip_group.visible = false;
		}
		this.power_label.text = "战力：" + memberInfo.fightvalue;
	}
	//同意加入帮会
	private onSure(): void {
		var reviewMsg: Message = new Message(MESSAGE_ID.UNION_REVIEW_OPERATION_MESSAGE);
		reviewMsg.setInt(this.data.id);
		reviewMsg.setBoolean(true);
		GameCommon.getInstance().sendMsgToServer(reviewMsg);
	}
	//拒绝加入公会
	private onRefuse(): void {
		var reviewMsg: Message = new Message(MESSAGE_ID.UNION_REVIEW_OPERATION_MESSAGE);
		reviewMsg.setInt(this.data.id);
		reviewMsg.setBoolean(false);
		GameCommon.getInstance().sendMsgToServer(reviewMsg);
	}
	//The end
}

class UnionLogItem extends eui.ItemRenderer {
	private log_label: eui.Label;
	public constructor() {
		super();
		this.once(egret.Event.COMPLETE, this.onComplete, this);
	}
	private onComplete(): void {
	}
	protected dataChanged(): void {
		var logstr: string = this.data as string;
		this.log_label.textFlow = (new egret.HtmlTextParser).parser(logstr);
	}
	//The end
}