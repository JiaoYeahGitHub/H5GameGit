class SkillEnchantGradePanel extends SkillEnchantLevelPanel {
	public constructor(owner) {
		super(owner);
	}

	protected updateBtnName(): void {
		this.btn_advance.label = Language.instance.getText('sixiangjinjie');
	}
	//更新属性
	protected onUpdateAttribute(): void {
		//属性
		let model: Modelxinfajinjie = JsonModelManager.instance.getModelxinfajinjie()[this.mainPanel.curSkin_ID];
		let data: SkillEnchantData = this.playerData.skillEnhantDict[this.mainPanel.curSkin_ID];
		let grade: number = data ? data.grade : 0;

		let attr_ary: number[] = GameCommon.getInstance().getAttributeAry();
		let attr_item: AttributesText;
		var str: string = '';
		var nextStr: string = '';
		for (let i = 0; i < model.attrAry.length; ++i) {
			let attrValue: number = model.attrAry[i];
			if (attrValue > 0) {
				str = str + GameDefine.Attr_FontName[i] + "：" + (attrValue * grade) + '\n';
				attr_ary[i] = attrValue * grade;
				nextStr = nextStr + GameDefine.Attr_FontName[i] + "：" + (attrValue * (grade + 1)) + '\n';
			}
		}
		this.curPro.text = str;
		this.nextPro.text = nextStr;
		this.powerBar.power = GameCommon.calculationFighting(attr_ary);
	}
	//更新消耗
	protected onUpdateCost(): void {
		let lvModel: ModelxinfaLv = JsonModelManager.instance.getModelxinfaLv()[this.mainPanel.curSkin_ID];
		let model: Modelxinfajinjie = JsonModelManager.instance.getModelxinfajinjie()[this.mainPanel.curSkin_ID];
		let data: SkillEnchantData = this.playerData.skillEnhantDict[this.mainPanel.curSkin_ID];
		let level: number = data ? data.level : 0;
		if (level == 0) {
			if (lvModel.jihuocost) {
				let costItem: AwardItem = GameCommon.parseAwardItem(lvModel.jihuocost);
				this.consumItem.visible = true;
			} else {
				this.consumItem.visible = false;
			}
		} else {
			if (!this.consumItem.visible) {
				this.consumItem.visible = true;
			}
		}
		if (model) {
			this.consumItem.setCostByAwardItem(model.cost);
		}
	}

	protected onAdvanceHanlde(): void {
		let model: Modelxinfajinjie = JsonModelManager.instance.getModelxinfajinjie()[this.mainPanel.curSkin_ID];
		if (!model) return;
		if (GameCommon.getInstance().onCheckItemConsume(model.cost.id, model.cost.num, model.cost.type)) {
			DataManager.getInstance().skillEnhantM.onSendGradeMsg(this.mainPanel.curSkin_ID);
		}
	}

	protected oncheckSkillTabRedPoint(skillId: number): boolean {
		for (let i: number = 1; i <= this.SKIN_MAX_NUM; i++) {
			let skinID: number = (skillId - 1) * this.SKIN_MAX_NUM + i;
			if (DataManager.getInstance().skillEnhantM.checkSkillEnhantUpGradeByRed(skinID)) return true;
		}
		return false;
	}
	protected oncheckSKinBtnRedPoint(skinIdx: number): boolean {
		if (Tool.isNumber(this.mainPanel.curSkill_ID)) {
			let skinID: number = (this.mainPanel.curSkill_ID - 1) * this.SKIN_MAX_NUM + skinIdx;
			if (DataManager.getInstance().skillEnhantM.checkSkillEnhantUpGradeByRed(skinID)) return true;
		}
		return false;
	}
	//The end
}