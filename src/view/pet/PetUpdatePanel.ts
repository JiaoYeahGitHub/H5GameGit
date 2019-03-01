class PetUpdatePanel extends BaseTabView {
	private power: PowerBar;
	private label_get: eui.Label;
	private grade_lab: eui.Label;
	private level_lab: eui.Label;
	private condition_lab: eui.Label;
	private curr_level_lab: eui.Label;
	private next_level_lab: eui.Label;
	// private btn_fetter: eui.Button;
	// private bml_powerAll: eui.BitmapLabel;
	// private bml_activated: eui.BitmapLabel;
	private btn_state: eui.Button;
	private btn_update: eui.Button;
	// private btn_oneKey: eui.Button;
	private bar_exp: eui.ProgressBar;
	private consumItem: ConsumeBar;
	private lab_name: eui.Label;
	// private img_head: eui.Image;
	// private isOneKey: boolean = false;
	private pet_avatar_grp: eui.Group;
	private nextPro: eui.Group;
	private curPro: eui.Group;
	private currLv: number;
	private items: PetInstance[];
	private _data: PetData;
	private btn3: eui.Button;
	private btn1: eui.Button;
	private btn2: eui.Button;
	private currPetID: number = 1;//当前选中的宠物ID
	private animPos: egret.Point = new egret.Point(this.width/2-20, 350);
	protected points: redPoint[] = RedPointManager.createPoint(2);
	private getGrp: eui.Group;
	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.PetUpdatePanelSkin;
	}
	protected onInit(): void {
		// this.items = [];
		this.label_get.text = Language.instance.getText("huoqutujing");
		GameCommon.getInstance().addUnderlineGet(this.label_get);
		this.label_get.touchEnabled = true;
		this.label_get.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGetBtn, this);
		this.points[0].register(this.btn_state, GameDefine.RED_BTN_POS, this, "onCheckPetActive");
		this.points[1].register(this.btn_update, GameDefine.RED_BTN_POS, DataManager.getInstance().petManager, "onCheckPetCanUpdateByID", this.currPetID);
		super.onInit();
		this.onRefresh();
	}
	private onTouchItem(e: egret.Event): void {
		var index: number = parseInt(e.currentTarget.name);
		if (this.currPetID != index) {
			this.currPetID = index;
			this.onRefresh();
		}
	}

	protected onRegist(): void {
		super.onRegist();
		// this.btn_state.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnState, this);
		this.btn_update.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnUpdate, this);
		// this.btn_oneKey.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnOneKey, this);
		// this.btn_fetter.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnFetter, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.PET_UPDATE_MESSAGE.toString(), this.onUpdateBack, this);
		this.btn2.addEventListener(egret.TouchEvent.TOUCH_TAP, this.showLingDanPanel, this);
		this.btn3.addEventListener(egret.TouchEvent.TOUCH_TAP, this.showDanPanel, this);
		this.btn1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.openStrongerMonsterPanel, this);
		this.getGrp.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGetBtn, this);
		GameDispatcher.getInstance().addEventListener(GameEvent.GAME_BAG_UPDATE, this.onUpdateCurrcy, this);
	}
	protected onRemove(): void {
		super.onRemove();
		// this.btn_state.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnState, this);
		this.btn_update.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnUpdate, this);
		// this.btn_oneKey.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnOneKey, this);
		// this.btn_fetter.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnFetter, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.PET_UPDATE_MESSAGE.toString(), this.onUpdateBack, this);
		this.btn2.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.showLingDanPanel, this);
		this.getGrp.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onGetBtn, this);
		this.btn3.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.showDanPanel, this);
		this.btn1.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.openStrongerMonsterPanel, this);
		GameDispatcher.getInstance().removeEventListener(GameEvent.GAME_BAG_UPDATE, this.onUpdateCurrcy, this);
		// this.isOneKey = false;
	}
	protected onRefresh(): void {
		this._data = DataManager.getInstance().playerManager.player.petData;
		this.currLv = this._data.lv;
		let currModel: Modelchongwushengji = this._data.model;
		let nextModel: Modelchongwushengji = this._data.nextModel;
		this.pet_avatar_grp.removeChildren();
		let currModel1: Modelchongwujinjie = this._data.gradeModel;
		GameCommon.getInstance().addAnimation('petbig' + currModel1.waixing1, null, this.pet_avatar_grp, -1);
		this.lab_name.text = this._data.lv + '级';
		if (this._data.lv == 0) {
			this.btn_update.label = '激活';
			this.consumItem.visible = false;
		} else {
			this.consumItem.visible = true;
			this.btn_update.label = '一键升级';
			this.next_level_lab.text = this._data.lv + '级';
			// this.next_level_lab.text = (this._data.lv + 1)+'级';



			// var str:string = '';
			// var nextStr: string = '';
			var attributeItem: AttributesText;
			this.curPro.removeChildren();
			this.nextPro.removeChildren();
			for (let i = 0; i < currModel.attrAry.length; ++i) {
				if (currModel.attrAry[i] > 0) {
					attributeItem = new AttributesText();
					attributeItem.updateAttr(i, currModel.attrAry[i]);
					this.curPro.addChild(attributeItem);
					if (!nextModel)
						continue;
					attributeItem = new AttributesText();
					attributeItem.updateAttr(i, nextModel.attrAry[i]);
					this.nextPro.addChild(attributeItem);
				}
			}
			// this.curPro.text = str;
			// this.nextPro.text = nextStr;
			this.bar_exp.value = this._data.exp;
			if (!nextModel) {
				this.currentState = 'max';
				this.btn_update.label = '已满级';
				this.consumItem.visible = false;
				this.onUpdatePower();
				return;
			}
			this.currentState = 'normal';
			this.bar_exp.maximum = nextModel.exp;
		}
		this.onUpdatePower();
		this.onUpdateCurrcy();
		this.trigger();
	}
	private onUpdateBack(): void {
		if (this._data && (this._data.lv > this.currLv)) {
			if (this._data.lv == 1) {
				GameCommon.getInstance().addAnimation("jihuochenggong", new egret.Point(this.width/2-20, 350), this);
			} else {
				GameCommon.getInstance().addAnimation("shengjichenggong", new egret.Point(this.width/2-20, 350), this);
			}
			// this.isOneKey = false;
		}
		this.onRefresh();
		// if (this.isOneKey) {
		// 	this.onTouchBtnUpdate();
		// }
	}
	private onTouchBtnState(): void {
		switch (this.btn_state.label) {
			case Language.instance.getText("shenqijihuo"):
				DataManager.getInstance().petManager.onSendUpdateMessage();
				break;
		}
	}
	private onTouchBtnUpdate(): void {

		if (this.btn_update.label == '激活') {
			var message = new Message(MESSAGE_ID.PET_ACTIVE_MESSAGE);
			GameCommon.getInstance().sendMsgToServer(message);
			return;
		}
		var model: Modelchongwushengji = this._data.model;
		if (!model) return;
		if (!GameCommon.getInstance().onCheckItemConsume(model.cost.id, model.cost.num)) {
			// this.isOneKey = false;
			return;
		}
		DataManager.getInstance().petManager.onSendUpdateMessage();
	}
	private onTouchBtnOneKey(): void {
		// if (!this.isOneKey) {
		// 	this.isOneKey = true;
		// 	this.onTouchBtnUpdate();
		// } else {
		// 	this.isOneKey = false;
		// }
	}
	private onTouchBtnFetter(): void {
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "PetFetterPanel");
	}
	private onUpdatePower(): void {
		this.power.power = DataManager.getInstance().petManager.power.toString();
	}
	private onUpdateCurrcy(): void {
		var model: Modelchongwushengji;
		model = JsonModelManager.instance.getModelchongwushengji()[this._data.lv];
		if (!model)
			model = JsonModelManager.instance.getModelchongwushengji()[this._data.lv - 1];
		let consumething: ModelThing = GameCommon.getInstance().getThingModel(model.cost.type, model.cost.id);
		this.consumItem.setCostByAwardItem(model.cost);
	}
	public onBtnAdvanceClick(param?): void {
		this.onRefresh();
	}
	private openStrongerMonsterPanel() {
		// GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("StrongerMonsterPanel", STRONGER_MONSTER_TYPE.STRONGER_PET_UPLV));
	}
	private showLingDanPanel(event: egret.Event) {
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("PetLingDanPanel", 6));
	}
	private showDanPanel(event: egret.Event) {
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("PetZiZhiDan", 6));
	}
	private onGetBtn(event: TouchEvent): void {
		var model: Modelchongwushengji;
		model = JsonModelManager.instance.getModelchongwushengji()[this._data.lv];
		GameCommon.getInstance().onShowFastBuy(model.cost.id);
	}
	public trigger(): void {
		this.points[0].checkPoint();
		this.points[1].checkPoint(true, this.currPetID);
	}
	private onCheckPetActive(): boolean {
		if (!this._data) return false;
		if (this._data.lv > 0) return false;
		// return DataManager.getInstance().petManager.onCheckPetCanActivateById(this.currPetID);
	}
	//The end
}