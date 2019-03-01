class EncounterLogPanel extends BaseWindowPanel {
	// private closeBtn2: eui.Button;
	private scroll: eui.Scroller;
	private itemGroup: eui.List;
	public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;

	public constructor(owner: ModuleLayer) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.EncounterLogPanelSkin;
	}
	protected onInit(): void {
		// this.setTitle("yewaipvp_log_title_png");
		this.itemGroup.itemRenderer = EncounterLogItem;
		this.itemGroup.itemRendererSkinName = skins.EncounterLogItemSkin;
		this.itemGroup.useVirtualLayout = false;
		this.scroll.viewport = this.itemGroup;
		this['basic']['label_title'].text = '战斗记录';
		super.onInit();
		this.onRefresh();
	}
	protected onRegist(): void {
		super.onRegist();
		// this.closeBtn2.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.YEWAIPVP_FIGHT_LOG_MSG.toString(), this.onResPVPLogMsg, this);
	}
	protected onRemove(): void {
		super.onRemove();
		// this.closeBtn2.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.YEWAIPVP_FIGHT_LOG_MSG.toString(), this.onResPVPLogMsg, this);
	}
	protected onRefresh(): void {
		this.onRequetPVPLogMsg();
	}
	private onRequetPVPLogMsg(): void {
		var pvplogMsg: Message = new Message(MESSAGE_ID.YEWAIPVP_FIGHT_LOG_MSG);
		GameCommon.getInstance().sendMsgToServer(pvplogMsg);
	}
	private onResPVPLogMsg(msgEvent: GameMessageEvent): void {
		var itemdatas: EncounterLogItemData[] = [];
		var message: Message = msgEvent.message;
		var logsize: number = message.getByte();
		for (var i: number = 0; i < logsize; i++) {
			var itemdata: EncounterLogItemData = new EncounterLogItemData();
			itemdata.onParse(message);
			itemdatas.push(itemdata);
		}
		this.itemGroup.dataProvider = new eui.ArrayCollection(itemdatas);
	}
	//The end
}
class EncounterLogItem extends eui.ItemRenderer {
	private result_icon: eui.Image;
	private name_label: eui.Label;
	private time_desc_label: eui.Label;

	constructor() {
		super();
	}
	protected dataChanged(): void {
		let data: EncounterLogItemData = this.data as EncounterLogItemData;
		this.result_icon.source = data.result > 0 ? "fight_win_icon_png" : "fight_lose_icon_png";
		this.name_label.text = data.name;
		this.time_desc_label.text = data.timedesc;
		for (let i: number = 0; i < data.awarditems.length; i++) {
			let goodsitem: GoodsInstance = this["goods_item" + i];
			if (!goodsitem) break;
			if (data.awarditems.length > i) {
				let awarditem: AwardItem = data.awarditems[i];
				goodsitem.visible = true;
				goodsitem.onUpdate(awarditem.type, awarditem.id, 0, awarditem.quality, awarditem.num);
			} else {
				goodsitem.visible = false;
			}
		}
	}
}
class EncounterLogItemData {
	public name: string;
	public result: number;
	public timedesc: string;
	public awarditems: AwardItem[];

	public onParse(msg: Message): void {
		this.name = msg.getString();
		this.result = msg.getByte();
		this.timedesc = msg.getString();
		let expNum: number = msg.getInt();
		let prestigeNum: number = msg.getByte();

		if (this.result == FightDefine.FIGHT_RESULT_SUCCESS) {
			this.awarditems = GameCommon.getInstance().onParseAwardItemstr(Constant.get(Constant.FIELD_PVP_REWARD_SUCC));
		} else {
			this.awarditems = GameCommon.getInstance().onParseAwardItemstr(Constant.get(Constant.FIELD_PVP_REWARD_FAIL));
		}
		this.awarditems.push(new AwardItem(GOODS_TYPE.EXP, 0, expNum));
		this.awarditems.push(new AwardItem(GOODS_TYPE.SHOW, 0, prestigeNum));
	}
}