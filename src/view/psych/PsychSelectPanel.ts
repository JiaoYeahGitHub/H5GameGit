class PsychSelectPanel extends BaseWindowPanel {
	private param: PsychSelectParam;
	private itemLayer: eui.Group;
	public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;
	private bar: eui.Scroller;
	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.PsychSelectPanelSkin;
	}
	protected onInit(): void {
		this.setTitle("元神背包");
		// this.basic["basic_tip_bg"].source = "psych_pop_bg_png";
		super.onInit();
		this.onRefresh();
	}
	protected onRegist(): void {
		super.onRegist();
	}
	protected onRemove(): void {
		super.onRemove();
	}
	protected onRefresh(): void {
		this.itemLayer.removeChildren();
		this.bar.stopAnimation();
		this.bar.viewport.scrollV = 0;
		var base: PsychBase;
		var types: number[] = [];
		var curr: PsychBase;
		for (var i: number = 0; i < GameDefine.Psych_Slot_Num; i++) {
			base = this.getPlayerData(this.param.roleID).getPsychBySlot(i);
			if (base.modelID > 0) {
				if (i == this.param.slot) {
					curr = base;
				}
				if (types.indexOf(base.model.type) == -1) {
					types.push(base.model.type);
				}
			}
		}
		var data = DataManager.getInstance().psychManager.psychQueue;
		var item: PsychSelectItem;
		var arr: PsychBase[] = [];
		for (var key in data) {
			base = data[key];
			if (types.indexOf(base.model.type) == -1) {
				arr.push(base);
			} else {
				if (curr && curr.model.type == base.model.type && curr.fightValue < base.fightValue) {
					arr.push(base);
				}
			}
		}
		arr.sort(function (a, b): number {
			return b.fightValue - a.fightValue;
		});
		for (var i: number = 0; i < arr.length; i++) {
			item = new PsychSelectItem();
			item.data = arr[i];
			item.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchItem, this);
			this.itemLayer.addChild(item);
		}
	}
	public onShowWithParam(param): void {
		this.param = param;
		this.onShow();
	}
	private onTouchItem(e: egret.Event): void {
		var item = <PsychSelectItem>e.currentTarget;
		if (item) {
			DataManager.getInstance().psychManager.onSendPsychEquip(this.param.roleID, this.param.slot, item.data.UID);
			this.onHide();
		}
	}
	private getPlayerData(index: number): PlayerData {
		return DataManager.getInstance().playerManager.player.getPlayerData(index);
	}
}
class PsychSelectItem extends eui.Component {
	private _data: PsychBase;
	private psych: PsychInstance;
	private label_grade: eui.Label;
	private label_name: eui.Label;
	private attrLayer: eui.Group;
	public constructor() {
		super();
		this.skinName = skins.PsychSelectItemSkin;
	}
	public set data(param: PsychBase) {
		this._data = param;
		this.onUpdate();
	}
	public get data() {
		return this._data;
	}

	private onUpdate(): void {
		this.psych.onUpdate(this._data, PSYCHSTATE_TYPE.NOLABEL, 0);
		this.label_name.text = this._data.model.name; // new Array<egret.ITextElement>({ text: this._data.model.name, style: { "textColor": GameCommon.getInstance().CreateNameColer(this._data.model.pinzhi) } });
		this.label_grade.text = `战力：${this._data.fightValue}`;
		var attr = this._data.model.attrAry;
		var item: suitAttributeItem;
		for (var key in attr) {
			if (attr[key] > 0) {
				item = new suitAttributeItem();				
				item.data = [Language.instance.getAttrName(key) + ":", "" + attr[key], 0];
				this.attrLayer.addChild(item);
			}
		}
	}
}
class PsychSelectParam {
	public roleID: number;
	public slot: number;
	public constructor(roleID: number, slot: number) {
		this.roleID = roleID;
		this.slot = slot;
	}
}