class UnionListPanel extends BaseWindowPanel {
	private search_btn: eui.Button;
	private create_btn: eui.Button;
	private list_scroll: eui.Scroller;
	private union_list: eui.List;
	private list_null_label: eui.Label;
	private apply_time_label: eui.Label;
	private page_num_label: eui.Label;
	private left_page_btn: eui.Button;
	private right_page_btn: eui.Button;

	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.UnionListPanelSkin;
	}
	//供子类覆盖
	protected onInit(): void {
		this.list_scroll.verticalScrollBar.autoVisibility = true;
		// this.list_scroll.verticalScrollBar.visible = true;
		this.union_list.percentWidth = 600;
		this.union_list.percentHeight = 168;
		this.union_list.itemRenderer = UnionListItem;
		this.union_list.itemRendererSkinName = skins.UnionListItemSkin;
		this.union_list.useVirtualLayout = true;
		this.list_scroll.viewport = this.union_list;
		// this.setTitle("union_main_title_png");
		this.setTitle("仙盟");
		super.onInit();
		this.onRefresh();
	}

	protected onRefresh(): void {
		DataManager.getInstance().unionManager.onReqUnionInfoMsg();
	}

	public onRegist(): void {
		super.onRegist();
		this.left_page_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onPageDown, this);
		this.right_page_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onPageUp, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.UNION_LIST_MESSAGE.toString(), this.onResUnionListMsg, this);
		this.create_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.openCreateUnion, this);

		Tool.addTimer(this.updateJoinCDTime, this, 1000);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.UNION_INFO_MESSAGE.toString(), this.onResUnionInfoMsg, this);

		this.onReqUnionListMsg(1);
	}
	public onRemove(): void {
		super.onRemove();
		this.left_page_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onPageDown, this);
		this.right_page_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onPageUp, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.UNION_LIST_MESSAGE.toString(), this.onResUnionListMsg, this);
		this.create_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.openCreateUnion, this);

		Tool.removeTimer(this.updateJoinCDTime, this, 1000);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.UNION_INFO_MESSAGE.toString(), this.onResUnionInfoMsg, this);
	}
	//请求公会列表
	private onReqUnionListMsg(pageNum: number): void {
		var unionlistMsg: Message = new Message(MESSAGE_ID.UNION_LIST_MESSAGE);
		unionlistMsg.setShort(pageNum);
		GameCommon.getInstance().sendMsgToServer(unionlistMsg);
	}
	//翻页处理
	private onPageDown(): void {
		var downpageNum: number = DataManager.getInstance().unionManager.applyPageNum - 1;
		if (downpageNum > 0) {
			this.onReqUnionListMsg(downpageNum);
		}
	}
	private onPageUp(): void {
		var uppageNum: number = DataManager.getInstance().unionManager.applyPageNum + 1;
		if (uppageNum <= DataManager.getInstance().unionManager.applyPageTotal) {
			this.onReqUnionListMsg(uppageNum);
		}
	}
	//帮会列表返回
	private onResUnionListMsg(): void {
		this.union_list.dataProvider = new eui.ArrayCollection(DataManager.getInstance().unionManager.applyUnionList);
		this.list_null_label.visible = DataManager.getInstance().unionManager.applyUnionList.length == 0;
		this.page_num_label.text = DataManager.getInstance().unionManager.applyPageNum + "/" + DataManager.getInstance().unionManager.applyPageTotal;
	}
	//打开创建帮会面板
	private openCreateUnion(): void {
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "UnionCreatePanel");
	}
	//检查加入帮会的冷却
	private updateJoinCDTime(): void {
		var cdTime: number = Math.ceil((DataManager.getInstance().unionManager.joinCDTime - egret.getTimer()) / 1000);
		if (cdTime > 0) {
			var timestr: string = Tool.getTimeStr(cdTime);
			this.apply_time_label.textColor = 0xe63232;
			this.apply_time_label.text = "申请倒计时：" + timestr;
		} else {
			this.apply_time_label.textColor = 0x28e828;
			this.apply_time_label.text = "当前可申请加入仙盟";
			Tool.removeTimer(this.updateJoinCDTime, this, 1000);
		}
	}

	private onResUnionInfoMsg(): void {
		var currType: number = 0;
		if (DataManager.getInstance().unionManager.unionInfo) {//有帮会
			GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "UnionMainCityPanel");
		}

		super.onRefresh();
	}
	//The end
}
class UnionListItem extends eui.ItemRenderer {
	public union_badges: eui.Component;
	public union_name_label: eui.Label;
	public union_level_label: eui.Label;
	public apply_num_label: eui.Label;
	public member_num_label: eui.Label;
	public xuanyan_label: eui.Label;
	public apply_btn: eui.Button;

	public constructor() {
		super();
		this.once(egret.Event.COMPLETE, this.onComplete, this);
	}
	private onComplete(): void {
		this.apply_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchApplyBtn, this);
	}
	protected dataChanged(): void {
		var unionInfo: UnionInfo = this.data as UnionInfo;
		var colorIndex: number = Tool.toInt(unionInfo.badgesIndex / UnionDefine.Union_Badges_ColorNum) + 1;
		(this.union_badges["badges_bg"] as eui.Image).source = `union_badges_bg${colorIndex}_png`;
		var iconIndex: number = unionInfo.badgesIndex % UnionDefine.Union_Badges_IconNum + 1;
		(this.union_badges["badges_icon"] as eui.Image).source = `union_badges_icon${iconIndex}_png`;
		this.union_name_label.text = unionInfo.name;
		this.union_level_label.text = unionInfo.level + "级";
		var unionlevelModel: ModelguildLv = JsonModelManager.instance.getModelguildLv()[unionInfo.level - 1];
		this.member_num_label.text = "人数：" + unionInfo.memberCount + "/" + (unionlevelModel ? unionlevelModel.renshuMax : 0);
		this.xuanyan_label.text = unionInfo.xuanyan;
		this.apply_num_label.text = unionInfo.applyLevel > 0 ? "申请条件：" + Language.instance.getText(`coatard_level${unionInfo.applyLevel}`, 'jingjie') : "";
	}
	private applyTime: number = 0;
	private onTouchApplyBtn(): void {
		if (this.applyTime - egret.getTimer() > 0) {
			return;
		}
		this.applyTime = egret.getTimer() + 2000;
		var applyjoinMsg: Message = new Message(MESSAGE_ID.UNION_APPLY_JOIN_MESSAGE);
		applyjoinMsg.setInt(this.data.id);
		GameCommon.getInstance().sendMsgToServer(applyjoinMsg);
	}
	//The end
}