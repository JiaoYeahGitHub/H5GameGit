class UnionLogView extends BaseTabView {

	private list_scroll: eui.Scroller;
	private union_list: eui.List;

	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.UnionLogPanelSkin;
	}
	//供子类覆盖
	protected onInit(): void {
		this.list_scroll.verticalScrollBar.autoVisibility = true;
		this.union_list.percentWidth = 638;
		this.union_list.percentHeight = 92;
		this.union_list.itemRenderer = UnionLogItem;
		this.union_list.itemRendererSkinName = skins.UnionLogItemSkin;
		this.union_list.useVirtualLayout = true;
		this.list_scroll.viewport = this.union_list;
		super.onInit();
		this.onRefresh();
	}
	protected onRegist(): void {
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.UNION_LOG_MESSAGE.toString(), this.onResUnionLogMsg, this);
		this.onReqUnionLogMsg();
	}
	protected onRemove(): void {
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.UNION_LOG_MESSAGE.toString(), this.onResUnionLogMsg, this);
	}
	//请求公会日志
	private onReqUnionLogMsg(): void {
		var unionlogMsg: Message = new Message(MESSAGE_ID.UNION_LOG_MESSAGE);
		GameCommon.getInstance().sendMsgToServer(unionlogMsg);
	}
	//帮会列表返回
	private onResUnionLogMsg(): void {
		this.union_list.dataProvider = new eui.ArrayCollection(DataManager.getInstance().unionManager.unionLogs);
	}
	public getStyle(): string {
		return "bg_style1";
	}
	//The end
}
// class UnionLogItem extends eui.ItemRenderer {
// 	private log_label: eui.Label;

// 	public constructor() {
// 		super();
// 		this.once(egret.Event.COMPLETE, this.onComplete, this);
// 	}
// 	private onComplete(): void {
// 	}
// 	protected dataChanged(): void {
// 		var logstr: string = this.data as string;
// 		this.log_label.textFlow = (new egret.HtmlTextParser).parser(logstr);
// 	}
	//The end
// }