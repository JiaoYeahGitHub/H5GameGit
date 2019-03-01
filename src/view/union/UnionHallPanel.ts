class UnionHallPanel extends BaseWindowPanel {
	public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.I;

	private union_name_label: eui.Label;
	private union_badges: eui.Component;
	private wang_name_label: eui.Label;
	private member_num_label: eui.Label;
	private union_level_label: eui.BitmapLabel;
	private union_exp_pro: eui.ProgressBar;
	private log_btn: eui.Group;
	private manager_btn: eui.Group;
	private tribute_btn: eui.Group;
	private chat_btn: eui.Group;
	private zhuanpan_btn: eui.Group;
	private xuanyan_label: eui.Label;
	private xuanyan_change_lab: eui.Label;
	private union_notice_label: eui.Label;
	private notice_change_lab: eui.Label;
	protected points: redPoint[] = RedPointManager.createPoint(1);

	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.UnionHallSkin;
	}
	//供子类覆盖
	protected onInit(): void {
		// this.setTitle("union_hall_title_png");
		this.setTitle("仙盟大厅");
		GameCommon.getInstance().addUnderlineStr(this.xuanyan_change_lab);
		GameCommon.getInstance().addUnderlineStr(this.notice_change_lab);

		this.points[0].register(this.tribute_btn, new egret.Point(75, 60), DataManager.getInstance().unionManager, "checkTributeRedPoint");
		super.onInit();
		this.onRefresh();
	}

	public onRegist(): void {
		super.onRegist();
		this.log_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.openLogView, this);
		this.manager_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.openMemberListView, this);
		this.tribute_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.openTributePanel, this);
		this.chat_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.openUnionChatPanel, this);
		this.notice_change_lab.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onChangeGonggao, this);
		this.xuanyan_change_lab.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onChangeXuanyan, this);
		this.zhuanpan_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.openZhuanpanView, this);
		// this.btn_back.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBack, this);

		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.UNION_MEMBER_LIST_MESSAGE.toString(), this.onResMemberListMsg, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.UNION_TRIBUTE_MESSAGE.toString(), this.onUpdateUnionLevel, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.UNION_CHANGE_XUYAN_MESSAGE.toString(), this.onUpdateXuanyan, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.UNION_CHANGE_NOTICE_MESSAGE.toString(), this.onUpdateGongao, this);

		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.UNION_QUIT_MESSAGE.toString(), this.onResUnionInfoMsg, this);
		this.onReqMemberListMsg();
	}
	public onRemove(): void {
		super.onRemove();
		this.log_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.openLogView, this);
		this.manager_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.openMemberListView, this);
		this.tribute_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.openTributePanel, this);
		this.chat_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.openUnionChatPanel, this);
		this.notice_change_lab.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onChangeGonggao, this);
		this.xuanyan_change_lab.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onChangeXuanyan, this);
		// this.btn_back.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBack, this);

		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.UNION_MEMBER_LIST_MESSAGE.toString(), this.onResMemberListMsg, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.UNION_TRIBUTE_MESSAGE.toString(), this.onUpdateUnionLevel, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.UNION_CHANGE_XUYAN_MESSAGE.toString(), this.onUpdateXuanyan, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.UNION_CHANGE_NOTICE_MESSAGE.toString(), this.onUpdateGongao, this);

		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.UNION_QUIT_MESSAGE.toString(), this.onResUnionInfoMsg, this);
	}
	//更新帮会信息
	private onupdateUnionInfo(): void {
		var myUnionInfo: MyUnionData = DataManager.getInstance().unionManager.unionInfo;
		this.union_name_label.text = myUnionInfo.info.name;
		this.member_num_label.text = myUnionInfo.info.memberCount + "/" + myUnionInfo.getUnionLevelModel().renshuMax;
		this.wang_name_label.text = myUnionInfo.info.wangName;

		var colorIndex: number = Tool.toInt(myUnionInfo.info.badgesIndex / UnionDefine.Union_Badges_ColorNum) + 1;
		(this.union_badges["badges_bg"] as eui.Image).source = `union_badges_bg${colorIndex}_png`;
		var iconIndex: number = myUnionInfo.info.badgesIndex % UnionDefine.Union_Badges_IconNum + 1;
		(this.union_badges["badges_icon"] as eui.Image).source = `union_badges_icon${iconIndex}_png`;

		this.onUpdateUnionLevel();
		this.onUpdateXuanyan();
		this.onUpdateGongao();

		this.notice_change_lab.visible = this.getAuthority();
		this.xuanyan_change_lab.visible = this.getAuthority();
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
		
		this.union_level_label.text = "仙盟等级： " + myUnionInfo.info.level + "级";
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
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "UnionMemberListPanel");
	}

	//打开帮会日志
	private openLogView(): void {
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("UnionRankView", UNIONBATTLE_RANKTYPE.UNION_BALLTE));
	}
	//打开转盘
	private openZhuanpanView(): void {
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "UnionTurnplatePanel");
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

	private onTouchBack(): void {
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "UnionMainCityPanel");
	}

	private onResUnionInfoMsg(): void {
		if (!DataManager.getInstance().unionManager.unionInfo) {//无帮会
			GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "UnionListPanel");
		}
		super.onRefresh();
	}

	//功能暂未开启
	private unOpenAltet(): void {
		GameCommon.getInstance().addAlert("功能暂未开启，敬请期待!");
	}
	public getStyle(): string {
		return "";
	}

	//关闭时打开帮会主城
	protected onTouchCloseBtn(): void {
		super.onTouchCloseBtn();
		this.onTouchBack();
	}
	//The end
}
class UnionInputPanel extends BaseWindowPanel {
	public static Type_Xuanyan: number = 1;
	public static Type_Gonggao: number = 2;
	public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;

	private input_desc: eui.Label;
	private input_notice: eui.TextInput;
	private btn_sure: eui.Button;

	private inputType: number = 1;

	constructor(owner: ModuleLayer) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.UnionInputSkin;
	}
	public onShowWithParam(param): void {
		this.inputType = param;
		if (this.inputType) {
			this.onShow();
		}
	}
	protected onRegist(): void {
		super.onRegist();
		this.btn_sure.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onChangeNotice, this);
	}
	protected onRemove(): void {
		super.onRemove();
		this.btn_sure.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onChangeNotice, this);
	}
	//供子类覆盖
	protected onInit(): void {
		(this.input_notice["textDisplay"] as eui.EditableText).verticalAlign = egret.VerticalAlign.TOP;
		(this.input_notice["textDisplay"] as eui.EditableText).multiline = true;
		(this.input_notice["textDisplay"] as eui.EditableText).lineSpacing = 8;
		super.onInit();
		this.onRefresh();
	}
	protected onRefresh(): void {
		var myUnionInfo: MyUnionData = DataManager.getInstance().unionManager.unionInfo;
		if (this.inputType == UnionInputPanel.Type_Xuanyan) {
			this.setTitle("union_xuanyan_title_png");
			this.input_desc.text = "请输入仙盟宣言（10个字以内）";
			this.input_notice.text = myUnionInfo.info.xuanyan;
			this.input_notice.maxChars = 10;
		} else if (this.inputType == UnionInputPanel.Type_Gonggao) {
			this.setTitle("union_gonggao_title_png");
			this.input_desc.text = "请输入仙盟公告（30个字以内）";
			this.input_notice.text = myUnionInfo.noticeStr;
			this.input_notice.maxChars = 30;
		}
		super.onRefresh();
	}
	//确认修改
	private onChangeNotice(): void {
		var noticedesc: string = this.input_notice.text;
		if (noticedesc == "") {
			GameCommon.getInstance().addAlert("内容不能为空");
			return;
		}
		if (this.inputType == UnionInputPanel.Type_Xuanyan) {
			if (noticedesc != DataManager.getInstance().unionManager.unionInfo.info.xuanyan) {
				var xuanyanChangeMsg: Message = new Message(MESSAGE_ID.UNION_CHANGE_XUYAN_MESSAGE);
				xuanyanChangeMsg.setString(noticedesc);
				GameCommon.getInstance().sendMsgToServer(xuanyanChangeMsg);
			}
		} else if (this.inputType == UnionInputPanel.Type_Gonggao) {
			if (noticedesc != DataManager.getInstance().unionManager.unionInfo.noticeStr) {
				var noticeChangeMsg: Message = new Message(MESSAGE_ID.UNION_CHANGE_NOTICE_MESSAGE);
				noticeChangeMsg.setString(noticedesc);
				GameCommon.getInstance().sendMsgToServer(noticeChangeMsg);
			}
		}
		this.onHide();
	}
	//The end
}