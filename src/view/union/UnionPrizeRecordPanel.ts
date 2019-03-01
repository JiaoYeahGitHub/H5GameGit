class UnionPrizeRecordPanel extends BaseWindowPanel {
	public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;
	private label_record: eui.Label;
	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.UnionPrizeRecordPanelSkin;
	}
	protected onInit(): void {
		// this.setTitle("union_main_title_png");
		this.setTitle("仙盟");
		super.onInit();
		this.onRefresh();
	}
	protected onRefresh(): void {
		this.label_record.textFlow = DataManager.getInstance().unionManager.getTextFlow();
	}
	protected onRegist(): void {
		super.onRegist();
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.UNION_PRIZE_RECORD_MESSAGE.toString(), this.onRefresh, this);
		DataManager.getInstance().unionManager.onReqUnionPrizeRecord();

	}
	protected onRemove(): void {
		super.onRemove();
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.UNION_PRIZE_RECORD_MESSAGE.toString(), this.onRefresh, this);
	}
}