class UnionHallView extends BaseTabView implements IUnionView {
	private union_name_label: eui.Label;
	private union_badges: eui.Component;
	private wang_name_label: eui.Label;
	private member_num_label: eui.Label;
	private union_level_label: eui.BitmapLabel;
	private union_exp_pro: eui.ProgressBar;
	private log_btn: eui.Group;
	private manager_btn: eui.Group;
	private rank_btn: eui.Group;
	private skill_btn: eui.Group;
	private tribute_btn: eui.Group;
	private chat_btn: eui.Group;
	private task_btn: eui.Group;
	private zhuanpan_btn: eui.Group;
	private xuanyan_label: eui.Label;
	private xuanyan_change_btn: eui.Button;
	private union_notice_label: eui.Label;
	private notice_change_btn: eui.Button;
	private isRegistPoint: boolean;
	protected points: redPoint[] = RedPointManager.createPoint(1);

	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.UnionHallSkin;
	}
	public onRegist(): void {
		this.log_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.openLogView, this);
		this.manager_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.openMemberListView, this);
		this.rank_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.openRankView, this);
		this.skill_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.openUnionSkill, this);
		this.tribute_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.openTributePanel, this);
		this.chat_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.openUnionChatPanel, this);
		this.notice_change_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onChangeGonggao, this);
		this.xuanyan_change_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onChangeXuanyan, this);
		this.task_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.openTaskView, this);
		this.zhuanpan_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.openZhuanpanView, this);

		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.UNION_MEMBER_LIST_MESSAGE.toString(), this.onResMemberListMsg, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.UNION_TRIBUTE_MESSAGE.toString(), this.onUpdateUnionLevel, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.UNION_CHANGE_XUYAN_MESSAGE.toString(), this.onUpdateXuanyan, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.UNION_CHANGE_NOTICE_MESSAGE.toString(), this.onUpdateGongao, this);

		this.onReqMemberListMsg();

		if (!this.isRegistPoint) {
			this.isRegistPoint = true;
			this.points[0].register(this.skill_btn, GameDefine.RED_MAIN_II_POS, DataManager.getInstance().unionManager, "checkUnionSkillRedPoint");
		}
	}
	public onRemove(): void {
		this.log_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.openLogView, this);
		this.manager_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.openMemberListView, this);
		this.rank_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.openRankView, this);
		this.skill_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.openUnionSkill, this);
		this.tribute_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.openTributePanel, this);
		this.chat_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.openUnionChatPanel, this);
		this.notice_change_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onChangeGonggao, this);
		this.xuanyan_change_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onChangeXuanyan, this);

		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.UNION_MEMBER_LIST_MESSAGE.toString(), this.onResMemberListMsg, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.UNION_TRIBUTE_MESSAGE.toString(), this.onUpdateUnionLevel, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.UNION_CHANGE_XUYAN_MESSAGE.toString(), this.onUpdateXuanyan, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.UNION_CHANGE_NOTICE_MESSAGE.toString(), this.onUpdateGongao, this);
	}
	//更新帮会信息
	private onupdateUnionInfo(): void {
		var myUnionInfo: MyUnionData = DataManager.getInstance().unionManager.unionInfo;
		this.union_name_label.text = myUnionInfo.info.name;
		var colorIndex: number = Tool.toInt(myUnionInfo.info.badgesIndex / UnionDefine.Union_Badges_ColorNum) + 1;
		(this.union_badges["badges_bg"] as eui.Image).source = `union_badges_bg${colorIndex}_png`;
		var iconIndex: number = myUnionInfo.info.badgesIndex % UnionDefine.Union_Badges_IconNum + 1;
		(this.union_badges["badges_icon"] as eui.Image).source = `union_badges_icon${iconIndex}_png`;
		this.wang_name_label.text = myUnionInfo.info.wangName;

		this.onUpdateUnionLevel();
		this.onUpdateXuanyan();
		this.onUpdateGongao();

		this.notice_change_btn.visible = this.getAuthority();
		this.xuanyan_change_btn.visible = this.getAuthority();
		// this.xuanyan_input.enabled = this.getAuthority();
		// this.union_notice_input.enabled = this.getAuthority();
	}
	//更新帮会等级
	private onUpdateUnionLevel(): void {
		var myUnionInfo: MyUnionData = DataManager.getInstance().unionManager.unionInfo;
		// var beforeExpMax: number = ModelManager.getInstance().modelUnionLv[myUnionInfo.info.level - 1] ? ModelManager.getInstance().modelUnionLv[myUnionInfo.info.level - 1].expmax : 0;
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

		this.union_level_label.text = "" + myUnionInfo.info.level;
		this.member_num_label.text = myUnionInfo.info.memberCount + "/" + myUnionInfo.getUnionLevelModel().renshuMax;
	}
	//请求查看成员列表协议
	private onReqMemberListMsg(): void {
		DataManager.getInstance().unionManager.onReqUnionMember();
	}
	//返回成员列表信息
	private onResMemberListMsg(): void {
		this.onupdateUnionInfo();
	}
	//打开公会成员界面
	private openMemberListView(): void {
		this.owner.onShowAlertByName("UnionMemberListView");
	}
	//打开公会排行界面
	public openRankView(): void {
		this.owner.onShowAlertByName("UnionRankView");
	}
	//打开帮会日志
	private openLogView(): void {
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("UnionRankView", UNIONBATTLE_RANKTYPE.UNION_BALLTE));
		//this.owner.onShowAlertByName("UnionLogView");
	}
	//打开任务
	public openTaskView(): void {
		this.owner.onShowAlertByName("UnionTaskView");
	}
	//打开转盘
	private openZhuanpanView(): void {
		this.owner.onShowAlertByName("UnionTurnplatePanel");
	}
	//修改宣言
	private onChangeXuanyan(): void {
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("UnionInputPanel", UnionInputPanel.Type_Xuanyan));
	}
	//服务器返回帮会宣言修改
	private onUpdateXuanyan(): void {
		this.xuanyan_label.text = DataManager.getInstance().unionManager.unionInfo.info.xuanyan;
	}
	//修改公告
	private onChangeGonggao(): void {
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("UnionInputPanel", UnionInputPanel.Type_Gonggao));
	}
	//服务器返回帮会公告修改
	private onUpdateGongao(): void {
		this.union_notice_label.text = DataManager.getInstance().unionManager.unionInfo.noticeStr;
	}
	//查看申请列表的权限
	private getAuthority(): boolean {
		var myUnionData: UnionMemberInfo = DataManager.getInstance().unionManager.unionInfo.selfData;
		return myUnionData ? myUnionData.postion == UNION_POSTION.WANG
			|| myUnionData.postion == UNION_POSTION.FUBANG
			|| myUnionData.postion == UNION_POSTION.ZHANGLAO : false;
	}
	//打开帮会聊天面板
	private openUnionChatPanel(): void {
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("ChatMainPanel", new ChatPanelParam(CHANNEL.GUILD, null)));
	}
	//打开上香界面
	private openTributePanel(): void {
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "UnionTributePanel");
	}
	//打开帮会技能界面
	private openUnionSkill(): void {
		// if (UnionDefine.Union_Skill_Level > DataManager.getInstance().unionManager.unionInfo.info.level) {
		// 	GameCommon.getInstance().addAlert(`帮会等级达到${UnionDefine.Union_Skill_Level}级开启`);
		// 	return;
		// }
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "UnionSkillPanel");
	}
	//功能暂未开启
	private unOpenAltet(): void {
		GameCommon.getInstance().addAlert("功能暂未开启，敬请期待!");
	}
	public getStyle(): string {
		return "";
	}
	//The end
}
// class UnionInputPanel extends BaseWindowPanel {
// 	public static Type_Xuanyan: number = 1;
// 	public static Type_Gonggao: number = 2;
// 	public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;

// 	private input_desc: eui.Label;
// 	private input_notice: eui.TextInput;
// 	private btn_sure: eui.Button;

// 	private inputType: number = 1;

// 	constructor(owner: ModuleLayer) {
// 		super(owner);
// 	}
// 	protected onSkinName(): void {
// 		this.skinName = skins.UnionInputSkin;
// 	}
// 	public onShowWithParam(param): void {
// 		this.inputType = param;
// 		if (this.inputType) {
// 			this.onShow();
// 		}
// 	}
// 	protected onRegist(): void {
// 		super.onRegist();
// 		this.btn_sure.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onChangeNotice, this);
// 	}
// 	protected onRemove(): void {
// 		super.onRemove();
// 		this.btn_sure.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onChangeNotice, this);
// 	}
// 	//供子类覆盖
// 	protected onInit(): void {
// 		(this.input_notice["textDisplay"] as eui.EditableText).verticalAlign = egret.VerticalAlign.TOP;
// 		(this.input_notice["textDisplay"] as eui.EditableText).multiline = true;
// 		(this.input_notice["textDisplay"] as eui.EditableText).lineSpacing = 8;
// 		super.onInit();
// 		this.onRefresh();
// 	}
// 	protected onRefresh(): void {
// 		var myUnionInfo: MyUnionData = DataManager.getInstance().unionManager.unionInfo;
// 		if (this.inputType == UnionInputPanel.Type_Xuanyan) {
// 			this.setTitle("union_xuanyan_txt_png");
// 			this.input_desc.text = "请输入帮会宣言（10个字以内）";
// 			this.input_notice.text = myUnionInfo.info.xuanyan;
// 			this.input_notice.maxChars = 10;
// 		} else if (this.inputType == UnionInputPanel.Type_Gonggao) {
// 			this.setTitle("union_xuanyan_txt_png");
// 			this.input_desc.text = "请输入帮会公告（30个字以内）";
// 			this.input_notice.text = myUnionInfo.noticeStr;
// 			this.input_notice.maxChars = 30;
// 		}
// 		super.onRefresh();
// 	}
// 	//确认修改
// 	private onChangeNotice(): void {
// 		var noticedesc: string = this.input_notice.text;
// 		if (noticedesc == "") {
// 			GameCommon.getInstance().addAlert("内容不能为空");
// 			return;
// 		}
// 		if (this.inputType == UnionInputPanel.Type_Xuanyan) {
// 			if (noticedesc != DataManager.getInstance().unionManager.unionInfo.info.xuanyan) {
// 				var xuanyanChangeMsg: Message = new Message(MESSAGE_ID.UNION_CHANGE_XUYAN_MESSAGE);
// 				xuanyanChangeMsg.setString(noticedesc);
// 				GameCommon.getInstance().sendMsgToServer(xuanyanChangeMsg);
// 			}
// 		} else if (this.inputType == UnionInputPanel.Type_Gonggao) {
// 			if (noticedesc != DataManager.getInstance().unionManager.unionInfo.noticeStr) {
// 				var noticeChangeMsg: Message = new Message(MESSAGE_ID.UNION_CHANGE_NOTICE_MESSAGE);
// 				noticeChangeMsg.setString(noticedesc);
// 				GameCommon.getInstance().sendMsgToServer(noticeChangeMsg);
// 			}
// 		}
// 		this.onHide();
// 	}
// 	//The end
// }