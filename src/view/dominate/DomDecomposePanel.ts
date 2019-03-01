class DomDecomposePanel extends BaseWindowPanel {
	
	public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;

	private bagLayer: eui.Group;
	private currency: CurrencyBar;
	private btn_decompose: eui.Button;
	private currDecompose;
	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.DomDecomposePanelSkin;
	}
	protected onInit(): void {
		super.onInit();
		this.setTitle("分解");
		this.basic["basic_tip_bg"].source="dom_pop_bg_jpg";
		this.onRefresh();
	}
	protected onRegist(): void {
		super.onRegist();
		this.btn_decompose.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtn, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.DOMINATE_DECOMPOSE_MESSAGE.toString(), this.onRefresh, this);
		// GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.PLAYER_CURRENCY_UPDATE.toString(), this.onUpdateCurrency, this);
	}
	protected onRemove(): void {
		super.onRemove();
		this.btn_decompose.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtn, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.DOMINATE_DECOMPOSE_MESSAGE.toString(), this.onRefresh, this);
		// GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.PLAYER_CURRENCY_UPDATE.toString(), this.onUpdateCurrency, this);
	}
	protected onRefresh(): void {
		var data = DataManager.getInstance().bagManager.getDomInateEquip();
		var thing: DominateThing;
		var item: DominateInstance;
		var len: number = 0;
		this.bagLayer.removeChildren();
		for (var i: number = 0; i < data.length; i++) {
			for (var j: number = 0; j < data[i].num; j++) {
				item = new DominateInstance("select");
				thing = new DominateThing();
				thing.slot = i;
				thing.onupdate(data[i].modelId, data[i].quality, 1);
				item.data = thing;
				// item.setBtnSelect(true);
				this.bagLayer.addChild(item);
				item.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchItem, this);
				len++;
				if (len >= 48) {
					break;
				}
			}
		}
		this.onTouchItem(null);
	}
	private onTouchItem(e: egret.Event): void {
		if (e) {
			var item = <DominateInstance>e.currentTarget;
			item.setBtnSelectOverturn();
		}
		this.currDecompose = {};
		var n: number = 0;
		for (var i: number = this.bagLayer.numChildren - 1; i >= 0; i--) {
			item = this.bagLayer.getChildAt(i) as DominateInstance;
			if (item.getBtnSelect()) {
				if (!this.currDecompose[item.data.modelId]) {
					this.currDecompose[item.data.modelId] = 1;
				} else {
					this.currDecompose[item.data.modelId] += 1;
				}
				n++;
			}
		}
		var model = GameCommon.getInstance().getThingModel(GOODS_TYPE.ITEM, GameDefine.Domiante_decomposeID);
		this.currency.data = new CurrencyParam(`可获得${model.name}`, new ThingBase(GOODS_TYPE.ITEM, GameDefine.Domiante_decomposeID, n * GameDefine.Domiante_decomposeNum), true, 0);
	}
	private onTouchBtn(): void {
		DataManager.getInstance().dominateManager.onSendDecomposeMessage(this.currDecompose);
	}
}