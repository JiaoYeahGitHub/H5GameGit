class ClothEquipTips extends BaseTipsBar {
	// protected pingfen_label: eui.Label;
	protected label_slot: eui.Label;
	// protected label_zhiye: eui.Label;
	// protected basic_attr_label: eui.Label;
	protected basic_attr_layer: eui.Group;
	// protected qianghua_attr_label: eui.Label;
	protected qianghua_attr_layer: eui.Group;
	protected baoshi_group: eui.Group;
	// protected zhuling_attr_label: eui.Label;
	protected zhuling_attr_layer: eui.Group;
	protected cuilian_attr_layer: eui.Group;
	protected bmlable_power: PowerBar;
	protected gemInlayItems: GemInlayItem[];
	protected quenchingLayer: eui.Group;
	protected quenching_attr_label: eui.Label;
	public constructor(owner: ItemIntroducebar) {
		super(owner);
	}
	protected initSkinName(): void {
		this.skinName = skins.ClothEquipBarSkin;
	}
	public onUpdate(param: IntroduceBarParam): void {
		super.onUpdate(param);
		var euqipThing: EquipThing = param.model as EquipThing;
		var modelEquip: ModelThing = euqipThing.model;
		super.onRefreshCommonUI(modelEquip, euqipThing.quality);
		var levelDesc: string = modelEquip.coatardLv + Language.instance.getText("grade");
		this.level_label.text = `（${levelDesc}）`;
		this.label_slot.text = euqipThing.model.des;

		//显示主属性
		var attributeItem: AttributeItem;
		this.basic_attr_layer.removeChildren();
		var attrAry: number[] = euqipThing.attributes;
		for (var i: number = 0; i < ATTR_TYPE.SIZE; i++) {
			var attrValue: number = attrAry[i];
			if (attrValue > 0) {
				var addAttrValue: number = euqipThing.addAttributes[i];
				attributeItem = new AttributeItem();
				attributeItem.data = [i, attrValue, "+" + addAttrValue];
				this.basic_attr_layer.addChild(attributeItem);
			}
		}
		var powerValue: number = euqipThing.pingfenValue;

		var slot: number = euqipThing.position;
		var slotThing: EquipSlotThing = DataManager.getInstance().forgeManager.getEquipSlotThing(slot);
		//显示强化属性
		var hasintensify: boolean = slotThing.intensifyLv > 0;
		var intensifyLv: number = hasintensify ? slotThing.intensifyLv : 1;
		var intensifyAttr: number[] = DataManager.getInstance().forgeManager.getIntensifyAttr(slot);

		var attributeItem: AttributeItem;
		this.qianghua_attr_layer.removeChildren();
		for (var i: number = 0; i < intensifyAttr.length; i++) {
			var attrValue: number = intensifyAttr[i];
			if (attrValue > 0) {
				attrValue = hasintensify ? attrValue : 0;
				attributeItem = new AttributeItem();
				attributeItem.data = [i, attrValue];
				this.qianghua_attr_layer.addChild(attributeItem);
			}
		}
		if (this.qianghua_attr_layer.numChildren == 0) {
			attributeItem = new AttributeItem();
			attributeItem.data = ['    未锻造 ', ''];
			this.qianghua_attr_layer.addChild(attributeItem);
		}

		// for (var i: number = 0; i < intensifyModel.attrAry.length; i++) {
		// 	var attrValue: number = intensifyModel.attrAry[i];
		// 	if (attrValue > 0) {
		// 		attrValue = hasintensify ? attrValue : 0;
		// 		qianghua_attr_desc += GameDefine.Attr_Name[i] + "：" + Tool.getHtmlColorStr(attrValue + "", "FFFFFF") + "\n";
		// 	}
		// }
		// this.qianghua_attr_label.textFlow = (new egret.HtmlTextParser).parse(qianghua_attr_desc);
		powerValue += DataManager.getInstance().forgeManager.getSlotIntensifyPower(slot);
		//显示宝石属性
		// var eqData:EquipSlotThing = DataManager.getInstance().playerManager.player.getPlayerData().currGemInlay;
		// var curr_gem_idx: number = eqData.gemLv % GameDefine.GEM_SLOT_NUM;
		// var currGemLv: number = eqData.getGemLvByGemSlot(curr_gem_idx);
		// var gemtype: ATTR_TYPE = GoodsDefine.SLOT_GEMTYPE[eqData.slot][curr_gem_idx];
		// var gemModelDoct = JsonModelManager.instance.getModelbaoshi();
		// var model: Modelbaoshi = gemModelDoct[currGemLv - 1];
		// var modeled: Modelbaoshi = gemModelDoct[currGemLv];
		this.baoshi_group.removeChildren();
		var equip_gemtypes: number[] = GoodsDefine.SLOT_GEMTYPE[slotThing.slot];
		for (var gIdx: number = 0; gIdx < equip_gemtypes.length; gIdx++) {
			var gem_type: ATTR_TYPE = equip_gemtypes[gIdx];
			var gem_level: number = slotThing.getGemLvByGemSlot(gIdx);
			var modelgem: Modelbaoshi = JsonModelManager.instance.getModelbaoshi()[gem_level - 1];
			if (modelgem) {
				attributeItem = new AttributeItem();
				attributeItem.data = [gem_type, modelgem.attrAry[gem_type]];
				this.baoshi_group.addChild(attributeItem);
			}
		}
		if (this.baoshi_group.numChildren == 0) {
			attributeItem = new AttributeItem();
			attributeItem.data = ['    未锻造 ', ''];
			this.baoshi_group.addChild(attributeItem);
		}

		powerValue += DataManager.getInstance().forgeManager.getSlotGemPower(slot);
		//显示融魂属性
		var hasInfulse: boolean = slotThing.infuseLv > 0;
		var infulseLv: number = hasInfulse ? slotThing.infuseLv : 1;
		var infulseModel: Modelronghun = DataManager.getInstance().forgeManager.getInfuseModel(slot, infulseLv);
		var attributeItem: AttributeItem;
		this.zhuling_attr_layer.removeChildren();

		for (var i: number = 0; i < infulseModel.attrAry.length; i++) {
			var attrValue: number = infulseModel.attrAry[i];
			if (attrValue > 0 && hasInfulse) {
				attrValue = hasInfulse ? attrValue : 0;
				attributeItem = new AttributeItem();
				attributeItem.data = [i, attrValue];
				this.zhuling_attr_layer.addChild(attributeItem);
			}
		}
		if (this.zhuling_attr_layer.numChildren == 0) {
			attributeItem = new AttributeItem();
			attributeItem.data = ['    未锻造 ', ''];
			this.zhuling_attr_layer.addChild(attributeItem);
		}
		//显示淬炼属性
		// this.quenching_attr_label.textFlow=null;
		// this.quenchingLayer.visible = false;

		var attributeItem: AttributeItem;
		this.cuilian_attr_layer.removeChildren();
		if (param.quenchingLv > 0) {
			var base: Modelcuilian = JsonModelManager.instance.getModelcuilian()[param.quenchingLv];
			var add: number = base.effect / 10000;
			powerValue += Math.floor(add * powerValue);
			// var quenching_attr_desc: string = Tool.getHtmlColorStr(`基础属性 +${Math.floor(base.effect / 100)}%`, "FFFFFF");
			attributeItem = new AttributeItem();
			attributeItem.data = ['基础属性 +', (base.effect / 100)+'%'];
			this.cuilian_attr_layer.addChild(attributeItem);
		}
		else {
			attributeItem = new AttributeItem();
			attributeItem.data = ['    未锻造 ', ''];
			this.cuilian_attr_layer.addChild(attributeItem);
		}
		powerValue += DataManager.getInstance().forgeManager.getSlotInfulsePower(slot);
		//实际战斗力
		this.bmlable_power.power = powerValue.toString();
	}
	protected onShowStar(lv: number): void {
		var img: eui.Image;
		for (var i: number = 0; i < 10; i++) {
			img = this[`img_star${i}`];
			if ((i + 1) <= lv) {
				img.visible = true;
			} else {
				img.visible = false;
			}
		}
	}
}