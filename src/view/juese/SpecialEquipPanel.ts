class SpecialEquipPanel extends BaseTabView {
	private powerbar: PowerBar;
	protected points: redPoint[] = RedPointManager.createPoint(1);
	private consumItem: ConsumeBar;
	private slot_view_grp: eui.Group;
	private bagua_img: eui.Image;
	private curr_uptyple_lab: eui.Label;
	private change_view_btn: eui.Button;
	private btn_advance: eui.Button;
	private attr_grp: eui.Group;
	private curr_level_lab: eui.Label;
	private next_level_lab: eui.Label;
	private curPro: eui.Group;
	private nextPro: eui.Group;
	private label_get: eui.Label;
	// private currSlotIdx: Fourinages_Type;
	private cost: AwardItem;//消耗
	private effectGroup: eui.Group;
	private label_name: eui.Label;
	private getGrp: eui.Group;
	private qianghuaPro: eui.ProgressBar;
	private strengthenMasterBtn: eui.Button;

	public constructor(owner) {
		super(owner);
	}
	protected onInit(): void {
		this.label_get.text = Language.instance.getText("huoqutujing");
		GameCommon.getInstance().addUnderlineGet(this.label_get);
		this.label_get.touchEnabled = true;
		this.label_get.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGetBtn, this);
		this.btn_advance.label = Language.instance.getText('sixiangshengji');

		this.onRefresh();
	}
	private _slotEffect: Animation;
	protected onSkinName(): void {
		this.skinName = skins.SpecialEquipPanelSkin;
	}
	protected onRegist(): void {
		this.points[0].register(this.strengthenMasterBtn, new egret.Point(70, 10), DataManager.getInstance().strongerManager, "getPoint", STRONGER_MONSTER_TYPE.STRONGER_SI_XIANG);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.FOURINAGE_UPLEVEL_MESSAGE.toString(), this.reciveUpMessage, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.FOURINAGE_UPUPGRADE_MESSAGE.toString(), this.reciveUpMessage, this);
		this.btn_advance.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onUpgreade, this);
		this.getGrp.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGetBtn, this);

		this.strengthenMasterBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.strengthenMasterOnClick, this)
	}
	protected onRemove(): void {
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.FOURINAGE_UPLEVEL_MESSAGE.toString(), this.reciveUpMessage, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.FOURINAGE_UPUPGRADE_MESSAGE.toString(), this.reciveUpMessage, this);
		this.btn_advance.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onUpgreade, this);
		this.getGrp.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onGetBtn, this);

		this.strengthenMasterBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.strengthenMasterOnClick, this)
	}
	public trigger(): void {
		this.points[0].checkPoint();
	}
	protected onRefresh(): void {
		this.currentState = 'xing' + this.currSlotIdx;
		this.onUpdateLevelInfo();
	}
	//升级进阶成功
	private reciveUpMessage(): void {
		var currData: FourinageData = this.getPlayerData().fourinages[this.currSlotIdx];
		var lv: number = (currData.level - 1) % 7 + 1;
		var point: egret.Point = new egret.Point(this['star' + lv].x + this['star' + lv].parent.x + 20, this['star' + lv].y + 80);
		var anim = GameCommon.getInstance().addAnimation("sixiangshengji", point, this.effectGroup);
		anim.scaleX = 0.7;
		anim.scaleY = 0.7;
		this.onUpdateLevelInfo();
	}
	/**更新四象级别属性**/
	private onUpdateLevelInfo(): void {
		this.qianghuaPro.maximum = DataManager.getInstance().strongerManager.getNextMuBiao(STRONGER_MONSTER_TYPE.STRONGER_SI_XIANG);
		this.qianghuaPro.value = DataManager.getInstance().strongerManager.getCurNumByType(STRONGER_MONSTER_TYPE.STRONGER_SI_XIANG);
		var currData: FourinageData = this.getPlayerData().fourinages[this.currSlotIdx];
		this.label_name.text = currData.level + '星';
		var model: Modelsixiang = JsonModelManager.instance.getModelsixiang()[this.currSlotIdx][currData.level - 1];
		var modeled: Modelsixiang = JsonModelManager.instance.getModelsixiang()[this.currSlotIdx][currData.level];
		var currmodel: Modelsixiang = model || modeled;
		var add: number = 0;
		var attributeItem: AttributesText;
		this.curPro.removeChildren();
		this.nextPro.removeChildren();
		for (var key in currmodel.attrAry) {
			if (currmodel.attrAry[key] > 0) {
				add = model ? model.attrAry[key] : 0;
				attributeItem = new AttributesText();
				attributeItem.updateAttr(key, add);
				this.curPro.addChild(attributeItem);
				if (modeled) {
					add = modeled ? modeled.attrAry[key] : 0;
					attributeItem = new AttributesText();
					attributeItem.updateAttr(key, add);
					this.nextPro.addChild(attributeItem);
				}
			}
		}
		let lv: number = currData.level % 7;
		for (var i: number = 1; i < 8; i++) {
			this['star' + i].visible = false;
			if (lv >= i) {
				this['star' + i].visible = true;
			}
		}
		//更新消耗
		this.cost = null;
		this.consumItem.visible = modeled == null ? false : true;
		if (modeled) {
			this.cost = modeled.cost;
			this.consumItem.setCostByAwardItem(this.cost);
			this['nextImg'].visible = true;
			this['curImg'].visible = true;
			this['jiantou'].visible = true;
			this.nextPro.visible = true;
			this.curPro.x = 71;
			this.getGrp.visible = true;
			this.consumItem.visible = true;
			this.btn_advance.label = '升 级';
		}
		else {
			for (var i: number = 1; i < 8; i++) {
				this['star' + i].visible = true;
			}
			this['nextImg'].visible = false;
			this['curImg'].visible = false;
			this['jiantou'].visible = false;
			this.nextPro.visible = false;
			this.curPro.x = 233;
			this.getGrp.visible = false;
			this.consumItem.visible = false;
			this.btn_advance.label = '已满级';
		}
		this.updatePower();
	}
	/**更新四象品阶属性**/
	private onUpdateGradeInfo(): void {
		for (var i: number = 0; i < Fourinages_Type.SIZE; i++) {
			var _slotdata: FourinageData = this.getPlayerData().fourinages[i];
			var info_lab: eui.Label = this[`info_lab${i}`];
			info_lab.text = _slotdata.grade + Language.instance.getText("grade");
		}
		var currData: FourinageData = this.getPlayerData().fourinages[this.currSlotIdx];
		var model: Modelsixiangjinjie = JsonModelManager.instance.getModelsixiangjinjie()[this.currSlotIdx][currData.grade - 1];
		var modeled: Modelsixiangjinjie = JsonModelManager.instance.getModelsixiangjinjie()[this.currSlotIdx][currData.grade];
		this.curr_level_lab.text = currData.grade + Language.instance.getText("grade");
		this.next_level_lab.text = modeled ? modeled.level + Language.instance.getText("grade") : "MAX";
		//更新消耗
		this.cost = null;
		this.consumItem.visible = modeled == null ? false : true;
		if (modeled) {
			this.cost = modeled.cost;
			this.consumItem.setCostByAwardItem(this.cost);
		}
		this.updatePower();
	}
	/**计算战斗力**/
	private updatePower(): void {
		var attributes: number[] = GameCommon.getInstance().getAttributeAry();
		for (var i: number = 0; i < Fourinages_Type.SIZE; i++) {
			var fourinageData: FourinageData = this.getPlayerData().fourinages[i];
			if (fourinageData.level > 0) {
				var _Ratio: number = 1;
				if (fourinageData.grade > 0) {
					var grademodel: Modelsixiangjinjie = JsonModelManager.instance.getModelsixiangjinjie()[i][fourinageData.grade - 1];
					_Ratio += grademodel.effect / GameDefine.GAME_ADD_RATIO;
				}
				var levelmodel: Modelsixiang = JsonModelManager.instance.getModelsixiang()[i][fourinageData.level - 1];
				for (let n: number = 0; n < ATTR_TYPE.SIZE; ++n) {
					if (levelmodel.attrAry[n] > 0) {
						attributes[n] += Math.floor(levelmodel.attrAry[n] * _Ratio);
					}
				}
			}
		}
		var power: number = GameCommon.calculationFighting(attributes);
		this.powerbar.power = power;
	}
	/**提升等级**/
	private onUpgreade(): void {
		if (!this.cost) {
			return;
		}
		if (!GameCommon.getInstance().onCheckItemConsume(this.cost.id, this.cost.num)) {
			return;
		}
		var uplevelMsg: Message = new Message(MESSAGE_ID.FOURINAGE_UPLEVEL_MESSAGE);
		uplevelMsg.setByte(0);
		uplevelMsg.setByte(this.currSlotIdx);
		GameCommon.getInstance().sendMsgToServer(uplevelMsg);
	}
	/**获取当前的四象类型**/
	private get currSlotIdx(): number {
		return this.owner.subTab;
	}
	/**前往获取**/
	private onGetBtn(event: TouchEvent): void {
		if (this.cost) {
			GameCommon.getInstance().onShowFastBuy(this.cost.id);
		}
	}
	public getPlayerData(): PlayerData {
		return DataManager.getInstance().playerManager.player.getPlayerData();
	}
	private strengthenMasterOnClick() {
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("StrongerMonsterPanel", STRONGER_MONSTER_TYPE.STRONGER_SI_XIANG))
	}
	//The end
}