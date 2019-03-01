class OtherEquipTips extends ClothEquipTips {
	public constructor(owner: ItemIntroducebar) {
		super(owner);
	}
	public onUpdate(param: IntroduceBarParam): void {
		this.param = param;
		var otherData: Otherplayer = param.model as Otherplayer;
		var euqipThing: EquipThing = otherData.equipdatearr[param.pos];
		if (!euqipThing || !euqipThing.model)
			return;
		var modelEquip: ModelThing = euqipThing.model;
		super.onRefreshCommonUI(modelEquip, euqipThing.quality);
		var levelDesc: string = modelEquip.coatardLv + Language.instance.getText("grade");
		this.level_label.text = `（${levelDesc}）`;
		// this.pingfen_label.text = "评分：" + euqipThing.pingfenValue;
		this.label_slot.text = euqipThing.model.des;

		var job: number = this.param.roleID;
		// if (modelEquip.occupation == -1) {
		// 	job = this.param.roleID;
		// }
		// this.label_zhiye.text = modelEquip.occupation >= 0 ? GameCommon.Occupation_RoleName(modelEquip.occupation) : TextDefine.COM_WORD["all_occ_txt"];

		// this.basic_attr_label.text = "";
		// this.zhuling_attr_label.text = "";
		// this.qianghua_attr_label.text = "";
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
		// var basic_attr_desc: string = "";
		// var attrAry: number[] = euqipThing.attributes;
		// for (var i: number = 0; i < ATTR_TYPE.SIZE; i++) {
		// 	var attrValue: number = attrAry[i];
		// 	if (attrValue > 0) {
		// 		basic_attr_desc += GameDefine.Attr_Name[i] + "：" + Tool.getHtmlColorStr(attrValue + "", "FFFFFF");
		// 		var addAttrValue: number = euqipThing.addAttributes[i];
		// 		basic_attr_desc += Tool.getHtmlColorStr(" +" + addAttrValue, "28e828");
		// 		basic_attr_desc += "\n";
		// 	}
		// }
		// this.basic_attr_label.textFlow = (new egret.HtmlTextParser).parse(basic_attr_desc);

		
		var powerValue: number = euqipThing.pingfenValue;
		// this.quenchingLayer.visible = false;
		//显示淬炼属性
		var attributeItem: AttributeItem;
		this.cuilian_attr_layer.removeChildren();
		var equipSlot: Equipgroove = otherData.equipgroovearr[param.pos];
		if (equipSlot.quenchingLv > 0) {
			var base: Modelcuilian = JsonModelManager.instance.getModelcuilian()[equipSlot.quenchingLv];
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


		//显示强化属性
		// var qianghua_attr_desc: string = "";
		var hasintensify: boolean = equipSlot && equipSlot.qianghua > 0;
		var intensifyLv: number = hasintensify ? equipSlot.qianghua : 1;
		var intensifyAttr: number[] = DataManager.getInstance().forgeManager.getIntensifyAttr(param.pos, intensifyLv);

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

		// for (var i: number = 0; i < intensifyModel.attrAry.length; i++) {
		// 	var attrValue: number = intensifyModel.attrAry[i];
		// 	if (attrValue > 0) {
		// 		attrValue = hasintensify ? attrValue : 0;
		// 		qianghua_attr_desc += GameDefine.Attr_Name[i] + "：" + Tool.getHtmlColorStr(attrValue + "", "FFFFFF") + "\n";
		// 	}
		// }
		// this.qianghua_attr_label.textFlow = (new egret.HtmlTextParser).parse(qianghua_attr_desc);
		powerValue += DataManager.getInstance().forgeManager.getSlotIntensifyPower(param.pos);
		//显示宝石属性

		this.baoshi_group.removeChildren();
		var equip_gemtypes: number[] = GoodsDefine.SLOT_GEMTYPE[param.pos];
		for (var gIdx: number = 0; gIdx < equip_gemtypes.length; gIdx++) {
			var gem_type: ATTR_TYPE = equip_gemtypes[gIdx];
			var gem_level: number = equipSlot.baoshi;
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
		powerValue += DataManager.getInstance().forgeManager.getSlotGemPower(param.pos);
		//显示融魂属性
		// var zhuling_attr_desc: string = "";
		var hasInfulse: boolean = equipSlot && equipSlot.zhuling > 0;
		var infulseLv: number = hasInfulse ? equipSlot.zhuling : 1;
		var infulseModel: Modelronghun = JsonModelManager.instance.getModelronghun()[GoodsDefine.EQUIP_SLOT_TYPE[param.pos]][infulseLv - 1];

		var attributeItem: AttributeItem;
		this.zhuling_attr_layer.removeChildren();

		for (var i: number = 0; i < infulseModel.attrAry.length; i++) {
			var attrValue: number = infulseModel.attrAry[i];
			if (attrValue > 0) {
				attrValue = hasInfulse ? attrValue : 0;
				attributeItem = new AttributeItem();
				attributeItem.data = [i, attrValue];
				this.zhuling_attr_layer.addChild(attributeItem);
			}
		}

		// for (var i: number = 0; i < infulseModel.attrAry.length; i++) {
		// 	var attrValue: number = infulseModel.attrAry[i];
		// 	if (attrValue > 0) {
		// 		attrValue = hasInfulse ? attrValue : 0;
		// 		zhuling_attr_desc += GameDefine.Attr_Name[i] + "：" + Tool.getHtmlColorStr(attrValue + "", "FFFFFF") + "\n";
		// 	}
		// }
		// this.zhuling_attr_label.textFlow = (new egret.HtmlTextParser).parse(zhuling_attr_desc);
		powerValue += DataManager.getInstance().forgeManager.getSlotInfulsePower(param.pos);
		//实际战斗力
		this.bmlable_power.power = powerValue.toString();
	}
	//The end
}