class EquipTipsBar extends BaseTipsBar {
	// private pingfen_label: eui.Label;
	private label_slot: eui.Label;
	private bmlable_power: PowerBar;
	private basic_attr_layer: eui.Group;
	private shenqi_icon_id: eui.Image;

	public constructor(owner: ItemIntroducebar) {
		super(owner);
	}
	protected initSkinName(): void {
		this.skinName = skins.EquipTipsBarSkin;
	}
	public onUpdate(param: IntroduceBarParam): void {
		this.currentState = "normal"
		if (param.type == INTRODUCE_TYPE.SHENQI) {
			this.currentState = "shenqi";
			var shenqiModel: Modelshenqi = param.model;
			//name 
			(this['name_label'] as eui.Label).text = shenqiModel.name;
			//level
			this.level_label.text = shenqiModel.lv + "级";
			//power
			var attr: number[] = GameCommon.getInstance().getAttributeAry();
			for (var j = 0; j < ATTR_TYPE.SIZE; ++j) {
				attr[j] += GameCommon.getInstance().getAttributeAry(shenqiModel)[j];
			}
			var powerbar: PowerBar;
			powerbar = (this["bmlable_power"] as PowerBar);
			powerbar.power = (GameCommon.calculationFighting(attr)).toString();
			//pos
			this.label_slot.text = "神器";
			//attr
			this.basic_attr_layer.removeChildren();
			var attributeItem: AttributeItem;
			for (var i: number = 0; i < ATTR_TYPE.SIZE; i++) {
				var attrValue: number = shenqiModel.attrAry[i];
				if (attrValue > 0) {
					attributeItem = new AttributeItem();
					attributeItem.data = [i, attrValue];
					this.basic_attr_layer.addChild(attributeItem);
				}
			}
			//shenqi_icon_id
			this.shenqi_icon_id.source = "shenqi_icon_" + shenqiModel.id + "_png";
			return;
		}
		super.onUpdate(param);
		var euqipThing: EquipThing;
		var modelEquip: ModelThing;
		var quality: number = -1;
		var pingfen: number = 0;
		if (egret.is(param.model, "EquipThing")) {
			euqipThing = param.model;
			quality = euqipThing.quality;
			modelEquip = euqipThing.model;
		} else if (egret.is(param.model, "ModelThing")) {
			modelEquip = param.model;
			modelEquip.quality = param.model.quality;
		}
		pingfen = modelEquip.pingfenValue;
		if (!modelEquip)
			return;
		super.onRefreshCommonUI(modelEquip, quality);
		var levelDesc: string = "";
		if (modelEquip.type == GOODS_TYPE.MASTER_EQUIP) {
			levelDesc = modelEquip.coatardLv + Language.instance.getText("grade");
		} else if (modelEquip.type == GOODS_TYPE.SERVANT_EQUIP) {
			levelDesc = modelEquip.starNum + Language.instance.getText("star");
		}
		this.level_label.text = levelDesc;
		this.level_label.text = `（${this.level_label.text}）`;
		// this.pingfen_label.text = "评分：" + pingfen;
		this.label_slot.text = modelEquip.des;

		//显示主属性
		var attributeItem: AttributeItem;
		this.basic_attr_layer.removeChildren();
		var attrAry: number[] = modelEquip.equipAttr;
		for (var i: number = 0; i < ATTR_TYPE.SIZE; i++) {
			var attrValue: number = attrAry[i];
			if (attrValue > 0) {
				attributeItem = new AttributeItem();
				if (euqipThing) {
					var addAttrValue: number = euqipThing.addAttributes[i];
					attributeItem.data = [i, attrValue, "+" + addAttrValue];
				} else {
					attributeItem.data = [i, attrValue];
				}
				this.basic_attr_layer.addChild(attributeItem);
			}
		}
		if (euqipThing) {
			this.bmlable_power.power = "" + euqipThing.pingfenValue;
		} else {
			this.bmlable_power.power = "" + pingfen;
		}
	}
}