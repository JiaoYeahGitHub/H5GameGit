class SkillAttPanel extends BaseTabView {
	public powerBar: PowerBar;
	public attr_item_grp: eui.Group;
	public nextattr_item_grp: eui.Group;
	public skinBtnGrps: eui.Group;
	public avatar_grp: eui.Group;
	public btn_advance: eui.Button;
	public btn_active: eui.Button;
	public btn_cloth: eui.Button;
	public consumItem: ConsumeBar;
	public advance_grp: eui.Group;

	private roleAvatar: PlayerBody;
	private emenyAvatar: ActionBody;
	private selectAnim: Animation;

	protected SKILL_MAX_NUM: number;//最大技能数量
	protected SKIN_MAX_NUM: number;//最大的皮肤数量

	protected points: redPoint[] = RedPointManager.createPoint(8);

	public constructor(owner) {
		super(owner);
	}
	public get mainPanel(): RolePanel {
		return this.owner as RolePanel;
	}
	protected onSkinName(): void {
		this.skinName = skins.SkillAttPanelSkin;
	}
	protected onInit(): void {
		this.roleAvatar = new PlayerBody();
		this.roleAvatar.isDamageFalse = true;
		this.roleAvatar.inMap = false;
		let playerData: PlayerData = GameFight.getInstance().onRandomCrateRobotData(1, 2);
		let roleAppears: AppearPlayerData = new AppearPlayerData();
		roleAppears.sex = this.playerData.sex;
		for (var i: number = 0; i < BLESS_TYPE.SIZE; i++) {
			roleAppears.appears[i] = this.playerData.getAppearID(i);
		}
		playerData.setAppear(roleAppears);
		this.roleAvatar.data = playerData;
		this.roleAvatar.onHideHeadBar(false);

		this.emenyAvatar = new MonsterBody();
		this.emenyAvatar.data = new MonsterData(FightDefine.PVE_MONSTER_COMID, BODY_TYPE.MONSTER);
		this.emenyAvatar.visible = false;
		this.emenyAvatar.inMap = false;

		this.roleAvatar.onAddEnemyBodyList([this.emenyAvatar]);
		this.roleAvatar.currTarget = this.emenyAvatar;

		this.avatar_grp.scaleX = this.avatar_grp.scaleY = 0.6;

		this.SKILL_MAX_NUM = this.playerData.skills.length;
		for (let i: number = 0; i < this.SKILL_MAX_NUM; i++) {
			let skillInfo: SkillInfo = this.playerData.skills[i];
			let tabbtn: eui.RadioButton = this["skill_tab" + i];
			tabbtn.value = skillInfo.id;
			tabbtn.label = skillInfo.getName();
			tabbtn.icon = skillInfo.getIcon();
			this.points[i].register(tabbtn, GameDefine.RED_GOODSINSTANCE_POS, this, "oncheckSkillTabRedPoint", skillInfo.id);
		}
		let models = JsonModelManager.instance.getModelxinfaLv();
		this.SKIN_MAX_NUM = Math.round(ModelManager.getInstance().getModelLength('xinfaLv') / this.SKILL_MAX_NUM);
		for (let i: number = 1; i <= this.SKIN_MAX_NUM; i++) {
			let model: ModelxinfaLv = JsonModelManager.instance.getModelxinfaLv()[i];
			let button: eui.Button = this['skin_btn' + i] as eui.Button;
			button.name = '' + i;
			button.label = model.name;
			this.points[this.SKILL_MAX_NUM + i - 1].register(button, GameDefine.RED_FASHION_ITEM_POS, this, "oncheckSKinBtnRedPoint", i);
		}

		if (!Tool.isNumber(this.mainPanel.curSkin_ID)) {
			this.mainPanel.curSkill_ID = parseInt((this["skill_tab0"] as eui.RadioButton).value);
			this.mainPanel.curSkinBtnIdx = parseInt((this["skin_btn1"] as eui.Button).name);
			this.mainPanel.curSkin_ID = 1;
		}

		this.updateBtnName();
		super.onInit();
		this.onRefresh();
	}
	protected updateBtnName(): void {
		// this.btn_advance.label = Language.instance.getText('sixiangshengji');
	}
	protected onRegist(): void {
		super.onRegist();
		for (let i: number = 0; i < this.playerData.skills.length; i++) {
			let tabbtn: eui.RadioButton = this["skill_tab" + i];
			tabbtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchSkillTab, this);
		}
		for (let i: number = 1; i <= this.SKIN_MAX_NUM; i++) {
			let button: eui.Button = this["skin_btn" + i];
			button.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchSkinBtn, this);
		}
		// this.btn_active.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onActive, this);
		// this.btn_advance.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onAdvanceHanlde, this);
		// this.btn_cloth.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCloth, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.SKILLENCHANT_CLOTH_MESSAGE.toString(), this.onUpdateStatus, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.SKILLENCHANT_ACTIVE_MESSAGE.toString(), this.onUpdateStatus, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.SKILLENCHANT_LEVELUP_MESSAGE.toString(), this.onAdvanceReciveMsg, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.SKILLENCHANT_UPGRADE_MESSAGE.toString(), this.onAdvanceReciveMsg, this);
	}
	protected onRemove(): void {
		super.onRemove();
		for (let i: number = 0; i < this.playerData.skills.length; i++) {
			let tabbtn: eui.RadioButton = this["skill_tab" + i];
			tabbtn.selected = false;
			tabbtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchSkillTab, this);
		}
		for (let i: number = 1; i <= this.SKIN_MAX_NUM; i++) {
			let button: eui.Button = this["skin_btn" + i];
			button.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchSkinBtn, this);
		}
		// this.btn_active.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onActive, this);
		// this.btn_advance.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onAdvanceHanlde, this);
		// this.btn_cloth.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onCloth, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.SKILLENCHANT_CLOTH_MESSAGE.toString(), this.onUpdateStatus, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.SKILLENCHANT_ACTIVE_MESSAGE.toString(), this.onUpdateStatus, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.SKILLENCHANT_LEVELUP_MESSAGE.toString(), this.onAdvanceReciveMsg, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.SKILLENCHANT_UPGRADE_MESSAGE.toString(), this.onAdvanceReciveMsg, this);
		this.roleAvatar.onDestroy();
	}
	protected onRefresh(): void {
		(this["skill_tab" + (this.mainPanel.curSkill_ID - 1)] as eui.RadioButton).selected = true;
		this.onUpdateRoleAvatar();
		this.onChangeSkillShow();
		this.onChangeSkinHandle();
	}
	//更新人物展示外形
	protected onUpdateRoleAvatar(): void {
		this.roleAvatar.onUpdateAvatar();
	}
	//接受消息
	protected onAdvanceReciveMsg(): void {
		var anim = new Animation("qihunshengji", 1, true);
		anim.x = 290;
		anim.y = 350;
		this.addChildAt(anim, this.getChildIndex(this.avatar_grp));
		this.onChangeSkinHandle();
	}
	//切换技能展示
	private useskillTime: number = 0;
	private onTouchSkillTab(event: egret.TouchEvent): void {
		let tabBtn: eui.RadioButton = event.currentTarget as eui.RadioButton;

		if (tabBtn.value != this.mainPanel) {
			this.mainPanel.curSkill_ID = parseInt(tabBtn.value);

			this.useskillTime = 0;
			let curskinid: number = (this.mainPanel.curSkill_ID - 1) * this.SKIN_MAX_NUM + this.mainPanel.curSkinBtnIdx;
			this.mainPanel.curSkin_ID = curskinid;
			//属性
			this.onUpdateAttribute();
			//状态
			this.onUpdateStatus();
			//消耗
			this.onUpdateCost();
		}

		this.onChangeSkillShow();
	}
	private onChangeSkillShow(): void {
		if (this.useskillTime > egret.getTimer()) {
			return;
		}
		this.avatar_grp.removeChildren();
		this.avatar_grp.addChild(this.roleAvatar);
		this.avatar_grp.addChild(this.emenyAvatar);
		this.skillInfo.styleNum = this.mainPanel.curSkin_ID;
		this.roleAvatar.data.onRebirth();
		this.roleAvatar.onResetSkillEffect();

		this.roleAvatar.x = 500;
		this.roleAvatar.y = 745;
		this.emenyAvatar.x = this.roleAvatar.x + 10;
		this.emenyAvatar.y = this.roleAvatar.y;

		switch (this.mainPanel.curSkill_ID) {
			case SkillDefine.COMMON_SKILL_ID:
				Tool.callbackTime(this.onUseSkill, this, 300, this.mainPanel.curSkill_ID);
				Tool.callbackTime(this.onUseSkill, this, 1000, this.mainPanel.curSkill_ID);
				Tool.callbackTime(this.onUseSkill, this, 1700, this.mainPanel.curSkill_ID);
				this.useskillTime = egret.getTimer() + 2000;
				break;
			default:
				this.onUseSkill(this.mainPanel.curSkill_ID);
				this.useskillTime = egret.getTimer() + 1000;
				break;
		}
	}
	private onUseSkill(skillID: number): void {
		if (this.mainPanel.curSkill_ID == skillID) {
			this.roleAvatar.data.useSkill = this.skillInfo;
			this.roleAvatar.onAttack();
		}
	}
	//切换皮肤
	private onTouchSkinBtn(event: egret.TouchEvent): void {
		let button: eui.Button = event.currentTarget as eui.Button;
		let buttonIdx: number = parseInt(button.name);
		if (this.mainPanel.curSkinBtnIdx != buttonIdx) {
			this.mainPanel.curSkinBtnIdx = buttonIdx;
			this.mainPanel.curSkin_ID = (this.mainPanel.curSkill_ID - 1) * this.SKIN_MAX_NUM + this.mainPanel.curSkinBtnIdx;
			this.onChangeSkinHandle();
		}
		this.useskillTime = 0;
		this.onChangeSkillShow();
		this.trigger();
	}
	private onChangeSkinHandle(): void {
		//选中
		this.changeSelectSkin();

		//属性
		this.onUpdateAttribute();

		//状态
		this.onUpdateStatus();

		//消耗
		this.onUpdateCost();
	}
	//更新激活状态
	protected onUpdateStatus(): void {
		let model: ModelxinfaLv = JsonModelManager.instance.getModelxinfaLv()[this.mainPanel.curSkin_ID];
		let data: SkillEnchantData = this.playerData.skillEnhantDict[this.mainPanel.curSkin_ID];
		let level: number = data ? data.level : 0;
		if (level == 0) {
			this.currentState = 'normal';
			this.advance_grp.visible = false;
			this.btn_active.visible = true;
		} else {
			this.currentState = 'upGrade';
			this.advance_grp.visible = true;
			this.btn_active.visible = false;
			let skillInfo: SkillInfo = this.playerData.getSkillInfoById(this.mainPanel.curSkill_ID);
			if (skillInfo.styleNum == this.mainPanel.curSkin_ID) {
				this.btn_cloth.label = '卸 下';
			} else {
				this.btn_cloth.label = '启 用';
			}
		}
	}
	//更新属性
	protected onUpdateAttribute(): void {
		//属性
		let model: ModelxinfaLv = JsonModelManager.instance.getModelxinfaLv()[this.mainPanel.curSkin_ID];
		let data: SkillEnchantData = this.playerData.skillEnhantDict[this.mainPanel.curSkin_ID];
		let level: number = data ? data.level : 0;

		let attr_ary: number[] = GameCommon.getInstance().getAttributeAry();
		this.attr_item_grp.removeChildren();
		this.nextattr_item_grp.removeChildren();
		let attr_item: AttributesText;
		for (let i = 0; i < model.attrAry.length; ++i) {
			let attrValue: number = model.attrAry[i];
			if (attrValue > 0) {
				//当前属性
				attr_item = new AttributesText();
				attr_item.updateAttr(i, attrValue * level);
				this.attr_item_grp.addChild(attr_item);
				attr_ary[i] = attrValue * level;
				//下级属性
				attr_item = new AttributesText();
				attr_item.updateAttr(i, attrValue * (level + 1));
				this.nextattr_item_grp.addChild(attr_item);
			}
		}
		this.powerBar.power = GameCommon.calculationFighting(attr_ary);
	}
	//更新消耗
	protected onUpdateCost(): void {
		let model: ModelxinfaLv = JsonModelManager.instance.getModelxinfaLv()[this.mainPanel.curSkin_ID];
		let data: SkillEnchantData = this.playerData.skillEnhantDict[this.mainPanel.curSkin_ID];
		let level: number = data ? data.level : 0;

		if (level == 0) {
			if (model.jihuocost) {
				let costItem: AwardItem = GameCommon.parseAwardItem(model.jihuocost);
				let costModel: ModelThing = GameCommon.getInstance().getThingModel(costItem.type, costItem.id);
				if (costModel.type == GOODS_TYPE.ITEM) {
					this.consumItem.setCostByAwardItem(costItem);
				} else {
					this.consumItem.setCostByAwardItem(model.cost);
				}
				this.consumItem.visible = true;
			} else {
				this.consumItem.visible = false;
			}
		} else {
			let costNum: number = 4000 + level * 100;
			this.consumItem.setConsume(GOODS_TYPE.FAHUN, 0, costNum);
			if (!this.consumItem.visible) {
				this.consumItem.visible = true;
			}
		}
	}
	//更新皮肤选中
	protected changeSelectSkin(): void {
		let selectIdx: number = Math.floor(this.mainPanel.curSkin_ID % this.SKIN_MAX_NUM);
		selectIdx = selectIdx == 0 ? this.SKIN_MAX_NUM : selectIdx;
		let button: eui.Button = this["skin_btn" + selectIdx];
		if (!this.selectAnim) {
			this.selectAnim = new Animation("guanghuancheng", -1);
			this.selectAnim.rotation = 45;
			this.selectAnim.x = 47;
			this.selectAnim.y = 52;
		}
		button.addChild(this.selectAnim);
	}
	//点击激活
	private onActive(): void {
		let model: ModelxinfaLv = JsonModelManager.instance.getModelxinfaLv()[this.mainPanel.curSkin_ID];
		if (!model) return;
		if (model.jihuocost) {
			let costItem: AwardItem = GameCommon.parseAwardItem(model.jihuocost);
			if (GameCommon.getInstance().onCheckItemConsume(costItem.id, costItem.num, costItem.type)) {
				DataManager.getInstance().skillEnhantM.onSendActiveMsg(this.mainPanel.curSkin_ID);
			}
		} else {
			DataManager.getInstance().skillEnhantM.onSendActiveMsg(this.mainPanel.curSkin_ID);
		}
	}
	//点击穿戴
	private onCloth(): void {
		let model: ModelxinfaLv = JsonModelManager.instance.getModelxinfaLv()[this.mainPanel.curSkin_ID];
		if (!model) return;
		let data: SkillEnchantData = this.playerData.skillEnhantDict[this.mainPanel.curSkin_ID];
		if (!data || data.level == 0) return;
		let skillInfo: SkillInfo = this.playerData.getSkillInfoById(this.mainPanel.curSkill_ID);
		if (skillInfo.styleNum == this.mainPanel.curSkin_ID) {
			DataManager.getInstance().skillEnhantM.onSendClothSkinMsg(0, this.skillInfo.id);
		} else {
			DataManager.getInstance().skillEnhantM.onSendClothSkinMsg(this.mainPanel.curSkin_ID, this.skillInfo.id);
		}
	}
	//点击提升按钮
	protected onAdvanceHanlde(): void {
		let model: ModelxinfaLv = JsonModelManager.instance.getModelxinfaLv()[this.mainPanel.curSkin_ID];
		if (!model) return;
		let data: SkillEnchantData = this.playerData.skillEnhantDict[this.mainPanel.curSkin_ID];
		if (!data || data.level == 0) return;
		let costNum: number = 4000 + data.level * 100;
		if (GameCommon.getInstance().onCheckItemConsume(0, costNum, GOODS_TYPE.FAHUN)) {
			DataManager.getInstance().skillEnhantM.onSendLevelUpMsg(this.mainPanel.curSkin_ID);
		}
	}
	protected get skillInfo(): SkillInfo {
		return this.roleAvatar.data.getSkillInfoById(this.mainPanel.curSkill_ID);
	}
	protected get playerData(): PlayerData {
		return DataManager.getInstance().playerManager.player.getPlayerData();
	}
	/**红点检测**/
	protected oncheckSkillTabRedPoint(skillId: number): boolean {
		for (let i: number = 1; i <= this.SKIN_MAX_NUM; i++) {
			let skinID: number = (skillId - 1) * this.SKIN_MAX_NUM + i;
			if (DataManager.getInstance().skillEnhantM.checkSkillEnhantUplevelByIDRed(skinID)) return true;
		}
		return false;
	}
	protected oncheckSKinBtnRedPoint(skinIdx: number): boolean {
		if (Tool.isNumber(this.mainPanel.curSkill_ID)) {
			let skinID: number = (this.mainPanel.curSkill_ID - 1) * this.SKIN_MAX_NUM + skinIdx;
			if (DataManager.getInstance().skillEnhantM.checkSkillEnhantUplevelByIDRed(skinID)) return true;
		}
		return false;
	}
	//The end
}