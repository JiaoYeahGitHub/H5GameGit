class UnionMemberListView extends BaseTabView {
	private exit_btn: eui.Button;
	private list_scroll: eui.Scroller;
	private union_list: eui.List;
	private tab_group: eui.Group;
	private auto_adopt_cb: eui.CheckBox;
	private recruit_group: eui.Group;
	private limit_group: eui.Group;
	private limit_btn: eui.Button;
	// private basic: eui.Group;

	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.UnionMemberPanelSkin;
	}
	//供子类覆盖
	protected onInit(): void {
		this.list_scroll.verticalScrollBar.autoVisibility = true;
		this.union_list.percentWidth = 620;
		this.union_list.percentHeight = 150;
		this.union_list.useVirtualLayout = true;
		this.list_scroll.viewport = this.union_list;

		(this["tabbtn_group0"] as eui.Group).name = "0";
		(this["tabbtn_group1"] as eui.Group).name = "1";
		super.onInit();
		this.onRefresh();
	}
	protected onRegist(): void {
		this.exit_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onQuitOrDissolved, this);
		this.auto_adopt_cb.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onChangeAutoDopt, this);
		this.limit_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.openLvLimitView, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.UNION_MEMBER_LIST_MESSAGE.toString(), this.onResMemberListMsg, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.UNION_POSTION_MESSAGE.toString(), this.onResMemberListMsg, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.UNION_DELETE_MEMBER_MESSAGE.toString(), this.onResMemberListMsg, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.UNION_REVIEW_LIST_MESSAGE.toString(), this.onResApplyPlayerListMsg, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.UNION_REVIEW_OPERATION_MESSAGE.toString(), this.onResOperationMsg, this);
		(this["tabbtn_group0"] as eui.Group).addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTabBtn, this);
		(this["tabbtn_group1"] as eui.Group).addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTabBtn, this);
		// this.basic["closeBtn1"].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onExit, this);
		// this.basic["closeBtn2"].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onExit, this);

		this.auto_adopt_cb.selected = DataManager.getInstance().unionManager.unionInfo.autoAdopt;
		this.tab_group.removeChildren();
		this.tab_group.addChild(this["tabbtn_group0"]);
		this.onchangeTabHandler(0);
	}
	protected onRemove(): void {
		this.exit_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onQuitOrDissolved, this);
		this.auto_adopt_cb.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onChangeAutoDopt, this);
		this.limit_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.openLvLimitView, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.UNION_MEMBER_LIST_MESSAGE.toString(), this.onResMemberListMsg, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.UNION_POSTION_MESSAGE.toString(), this.onResMemberListMsg, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.UNION_DELETE_MEMBER_MESSAGE.toString(), this.onResMemberListMsg, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.UNION_REVIEW_LIST_MESSAGE.toString(), this.onResApplyPlayerListMsg, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.UNION_REVIEW_OPERATION_MESSAGE.toString(), this.onResOperationMsg, this);
		(this["tabbtn_group0"] as eui.Group).removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTabBtn, this);
		(this["tabbtn_group1"] as eui.Group).removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTabBtn, this);
		// this.basic["closeBtn1"].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onExit, this);
		// this.basic["closeBtn2"].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onExit, this);
		this.union_list.dataProvider = null;
		(this[`tab_btn${this.currTabIndex}`] as eui.RadioButton).selected = false;
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
			this.recruit_group.visible = false;
			this.limit_group.visible = false;
			this.currTabIndex = index;
			this.union_list.dataProvider = null;
			switch (index) {
				case 0:
					this.recruit_group.visible = true;
					this.onReqMemberListMsg();
					break;
				case 1:
					if (this.getAuthority()) {
						this.limit_group.visible = true;
						this.onReqApplyPlayerListMsg();
					}
					break;
			}
			(this[`tab_btn${this.currTabIndex}`] as eui.RadioButton).selected = true;
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
		var memberlistMsg: Message = new Message(MESSAGE_ID.UNION_MEMBER_LIST_MESSAGE);
		GameCommon.getInstance().sendMsgToServer(memberlistMsg);
	}
	//返回成员列表信息
	private onResMemberListMsg(): void {
		if (this.getAuthority()) {
			this.tab_group.addChild(this["tabbtn_group1"]);
		}
		var myUnionData: UnionMemberInfo = DataManager.getInstance().unionManager.unionInfo.selfData;
		this.exit_btn.label = myUnionData && myUnionData.postion == UNION_POSTION.WANG ? "解散帮会" : "退出帮会";

		this.union_list.itemRenderer = UnionMemberItem;
		this.union_list.itemRendererSkinName = skins.UnionMemberItemSkin;

		DataManager.getInstance().unionManager.unionInfo.unionMemberList.sort(function (a, b): number {
			return a.postion - b.postion;
		})
		this.union_list.dataProvider = new eui.ArrayCollection(DataManager.getInstance().unionManager.unionInfo.unionMemberList);
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
	//退出或解散公会
	private onQuitOrDissolved(): void {
		var myUnionData: UnionMemberInfo = DataManager.getInstance().unionManager.unionInfo.selfData;
		if (myUnionData && myUnionData.postion == UNION_POSTION.WANG) {//解散公会
			var dissolvedNotice = [{ text: `您确定要将帮会解散？（解散后帮会将无法找回，请慎重考虑）`, style: { textColor: 0xe63232 } }];
			GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
				new WindowParam("AlertFrameUI", new AlertFrameParam(dissolvedNotice, function () {
					var dissolvedMsg: Message = new Message(MESSAGE_ID.UNION_DISSOLVED_MESSAGE);
					GameCommon.getInstance().sendMsgToServer(dissolvedMsg);
				}, this))
			);
		} else {//退出公会
			var quitNotice = [{ text: `您确定要退出公会？（请慎重考虑）`, style: { textColor: 0xe63232 } }];
			GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
				new WindowParam("AlertFrameUI", new AlertFrameParam(quitNotice, function () {
					var quitMsg: Message = new Message(MESSAGE_ID.UNION_QUIT_MESSAGE);
					GameCommon.getInstance().sendMsgToServer(quitMsg);
				}, this))
			);
		}
	}
	//返回大厅
	// private onExit(): void {
	// 	this.owner.onChangeUnionView(this.owner.Union_Hall_View);
	// }
	public getStyle(): string {
		return "bg_style1";
	}
	//The end
}
//成员列表
// class UnionMemberItem extends eui.ItemRenderer {
// 	private union_name_label: eui.Label;
// 	private union_level_label: eui.Label;
// 	private union_postion_icon: eui.Image;
// 	private headIcon: eui.Image;
// 	private vip_label: eui.Label;
// 	private online_status_label: eui.Label;
// 	private power_label: eui.Label;
// 	private donate_label: eui.Label;
// 	private appoint_btn: eui.Button;
// 	private delete_btn: eui.Button;
// 	private opt_group: eui.Group;
// 	private impeachmentBtn: eui.Button;

// 	public constructor() {
// 		super();
// 		this.once(egret.Event.COMPLETE, this.onComplete, this);
// 	}
// 	private onComplete(): void {
// 		this.appoint_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onAppoint, this);
// 		this.delete_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onDelete, this);
// 	}
// 	protected dataChanged(): void {
// 		var memberInfo: UnionMemberInfo = this.data as UnionMemberInfo;
// 		var myUnionData: UnionMemberInfo = DataManager.getInstance().unionManager.unionInfo.selfData;
// 		if ((myUnionData.postion == UNION_POSTION.WANG || myUnionData.postion == UNION_POSTION.FUBANG || myUnionData.postion == UNION_POSTION.ZHANGLAO)
// 			&& memberInfo.playerdata.id != DataManager.getInstance().playerManager.player.id
// 			&& memberInfo.postion > DataManager.getInstance().unionManager.unionInfo.selfData.postion) {
// 			this.opt_group.visible = true;
// 		} else {
// 			this.opt_group.visible = false;
// 		}
// 		this.union_name_label.text = memberInfo.playerdata.name;
// 		this.union_level_label.text = (memberInfo.playerdata.rebirthLv > 0 ? memberInfo.playerdata.rebirthLv + "转" : "") + memberInfo.playerdata.level + "级";
// 		this.union_postion_icon.source = UnionDefine.Union_Postion_Icons[memberInfo.postion];
// 		this.headIcon.source = GameCommon.getInstance().getHeadIconByIndex(memberInfo.playerdata.headindex);
// 		this.vip_label.text = "VIP" + memberInfo.playerdata.viplevel;
// 		this.online_status_label.text = "";//memberInfo.offLineTime
// 		this.power_label.text = "战力：" + memberInfo.playerdata.fightvalue;
// 		this.donate_label.text = "贡献：" + memberInfo.donate;

// 		if(memberInfo.postion == UNION_POSTION.WANG && DataManager.getInstance().unionManager.unionInfo.isImpeachment==1){
// 			this.impeachmentBtn.visible=true;
// 			this.impeachmentBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onImpeachment, this);			
// 		}else{
// 			this.impeachmentBtn.visible=false;
// 		}
// 	}
// 	//任命操作
// 	private onAppoint(): void {
// 		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("UnionAppPointPanel", this.data))
// 	}
// 	//踢出帮会操作
// 	private onDelete(): void {
// 		var deleteNotice = [{ text: `是否将${this.data.playerdata.name}请离帮会？（请慎重考虑）`, style: { textColor: 0xe63232 } }];
// 		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
// 			new WindowParam("AlertFrameUI", new AlertFrameParam(deleteNotice, function (playerId: number) {
// 				var deleteMsg: Message = new Message(MESSAGE_ID.UNION_DELETE_MEMBER_MESSAGE);
// 				deleteMsg.setInt(playerId);
// 				GameCommon.getInstance().sendMsgToServer(deleteMsg);
// 			}, this, this.data.playerdata.id))
// 		);
// 	}
// 	//弹劾
// 	private onImpeachment(): void {
// 		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
//             new WindowParam("AlertFrameUI", new AlertFrameParam("此位不负责的帮主已经连续7天未上线了，上仙是否准备消耗500元宝将其弹劾取代其帮主之位？", this.sendImpeachment, this)));
// 	}
// 	private sendImpeachment():void{
// 		var message: Message = new Message(MESSAGE_ID.UNION_IMPEACHMENT_MESSAGE);
// 		GameCommon.getInstance().sendMsgToServer(message);
// 	}
// 	//The end
// }
// //申请列表
// class ApplyPlayerItem extends eui.ItemRenderer {
// 	private union_name_label: eui.Label;
// 	private union_level_label: eui.Label;
// 	private headIcon: eui.Image;
// 	private vip_label: eui.Label;
// 	private power_label: eui.Label;
// 	private sure_btn: eui.Button;
// 	private refuse_btn: eui.Button;

// 	public constructor() {
// 		super();
// 		this.once(egret.Event.COMPLETE, this.onComplete, this);
// 	}
// 	private onComplete(): void {
// 		this.sure_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSure, this);
// 		this.refuse_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onRefuse, this);
// 	}
// 	protected dataChanged(): void {
// 		var memberInfo: SimplePlayerData = this.data as SimplePlayerData;
// 		this.union_name_label.text = memberInfo.name;
// 		this.union_level_label.text = (memberInfo.rebirthLv > 0 ? memberInfo.rebirthLv + "转" : "") + memberInfo.level + "级";
// 		this.headIcon.source = GameCommon.getInstance().getHeadIconByIndex(memberInfo.headindex);
// 		this.vip_label.text = "VIP" + memberInfo.viplevel;
// 		this.power_label.text = "战力：" + memberInfo.fightvalue;
// 	}
// 	//同意加入帮会
// 	private onSure(): void {
// 		var reviewMsg: Message = new Message(MESSAGE_ID.UNION_REVIEW_OPERATION_MESSAGE);
// 		reviewMsg.setInt(this.data.id);
// 		reviewMsg.setBoolean(true);
// 		GameCommon.getInstance().sendMsgToServer(reviewMsg);
// 	}
// 	//拒绝加入公会
// 	private onRefuse(): void {
// 		var reviewMsg: Message = new Message(MESSAGE_ID.UNION_REVIEW_OPERATION_MESSAGE);
// 		reviewMsg.setInt(this.data.id);
// 		reviewMsg.setBoolean(false);
// 		GameCommon.getInstance().sendMsgToServer(reviewMsg);
// 	}
// 	//The end
// }