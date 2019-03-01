class PetUpgradePanel extends BaseTabView {
	private power: PowerBar;
	private label_get: eui.Label;
	private curr_addrate_lab: eui.Label;
	private next_addrate_lab: eui.Label;
	// private bml_powerAll: eui.BitmapLabel;
	// private bml_activated: eui.BitmapLabel;
	private btn_update: eui.Button;
	// private btn_state: eui.Button;
	private consume: CurrencyBar;
	private lab_name: eui.Label;
	private pet_avatar_grp: eui.Group;
	private _data: PetData;
	private currGrade: number;
	private condition_lab: eui.Label;
	// private currLayer: eui.Group;
	// private nextLayer: eui.Group;
	// private itemLayer: eui.Group;
	// private upgrade_grp: eui.Group;
	private btn3: eui.Button;
	// private strengthenMasterBtn: eui.Button;
	private btn2: eui.Button;
	// private items: PetInstance[];
	private currPetID: number = 1;//当前选中的宠物ID
	private animPos: egret.Point = new egret.Point(this.width/2-20, 440);
	private animPos2: egret.Point = new egret.Point(344, 530);
	private nextPro: eui.Group;
	private curPro: eui.Group;
	private maskPro: eui.Group;
	private cirImg: eui.Image;
	private valueLab: eui.Label;
	private getGrp: eui.Group;
	protected points: redPoint[] = RedPointManager.createPoint(1);
	private qianghuaPro: eui.ProgressBar;
	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.PetUpgradePanelSkin;
	}
	protected onInit(): void {
		// this.items = [];
		this.label_get.text = Language.instance.getText("huoqutujing");
		GameCommon.getInstance().addUnderlineGet(this.label_get);
		this.label_get.touchEnabled = true;
		this.label_get.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGetBtn, this);
		// var datas = DataManager.getInstance().playerManager.player.pets;
		// var item: PetInstance;
		// for (var key in datas) {
		// 	item = new PetInstance();
		// 	item.name = key;
		// 	item.data = datas[key];
		// 	this.items.push(item);
		// 	if (this.currPetID == -1) {
		// 		this.currPetID = item.data.id;
		// 	}
		// }
		// this.items.sort(function (a, b): number {
		// 	var modelA = JsonModelManager.instance.getModelchongwu()[a.data.id][0];
		// 	var modelB = JsonModelManager.instance.getModelchongwu()[b.data.id][0];
		// 	return modelA.quality - modelB.quality;
		// });
		// for (var i: number = 0; i < this.items.length; i++) {
		// 	this.itemLayer.addChild(this.items[i]);
		// }
		// this.points[0].register(this.strengthenMasterBtn, new egret.Point(70, 10), DataManager.getInstance().strongerManager, "getPoint", STRONGER_MONSTER_TYPE.STRONGER_PET_UPGRADE);
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
	// private onUpdateList(): void {
	// 	var item: PetInstance;
	// 	var datas = DataManager.getInstance().playerManager.player.pets;
	// 	for (let i: number = 0; i < this.items.length; i++) {
	// 		item = this.items[i];
	// 		item.data = datas[item.data.id];
	// 		if (item.data.id == this.currPetID) {
	// 			item.selected = true;
	// 		} else {
	// 			item.selected = false;
	// 		}
	// 	}
	// }
	protected onRegist(): void {
		super.onRegist();
		// this.btn_state.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnState, this);
		this.btn_update.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnUpdate, this);
		this.getGrp.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGetBtn, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.PET_UPDATE_MESSAGE.toString(), this.onUpdateBack, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.PET_UPGRADE_MESSAGE.toString(), this.onUpdateBack, this);
		// GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.PET_OUTBOUND_MESSAGE.toString(), this.updatePetState, this);
		// for (var i: number = 0; i < this.items.length; i++) {
		// 	var item: PetInstance = this.items[i];
		// 	item.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchItem, this);
		// }
		this.btn2.addEventListener(egret.TouchEvent.TOUCH_TAP, this.showLingDanPanel, this);
		this.btn3.addEventListener(egret.TouchEvent.TOUCH_TAP, this.showDanPanel, this);
		// this.strengthenMasterBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.openStrongerMonsterPanel, this);

		GameDispatcher.getInstance().addEventListener(GameEvent.GAME_BAG_UPDATE, this.onUpdateCurrcy, this);
	}
	protected onRemove(): void {
		super.onRemove();
		// this.btn_state.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnState, this);
		this.getGrp.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onGetBtn, this);
		this.btn_update.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnUpdate, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.PET_UPDATE_MESSAGE.toString(), this.onUpdateBack, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.PET_UPGRADE_MESSAGE.toString(), this.onUpdateBack, this);
		// GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.PET_OUTBOUND_MESSAGE.toString(), this.updatePetState, this);
		// for (var i: number = 0; i < this.items.length; i++) {
		// 	var item: PetInstance = this.items[i];
		// 	item.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchItem, this);
		// }
		this.btn2.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.showLingDanPanel, this);
		this.btn3.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.showDanPanel, this);
		// this.strengthenMasterBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.openStrongerMonsterPanel, this);
		GameDispatcher.getInstance().removeEventListener(GameEvent.GAME_BAG_UPDATE, this.onUpdateCurrcy, this);
	}
	public trigger(): void {
		this.points[0].checkPoint();
	}
	private addToContainer(child: egret.DisplayObject): void {
		this.maskPro.addChild(child);
		child.x = this.maskPro.width / 2;
		child.y = this.maskPro.height / 2;
	}
	private shape: egret.Shape = new egret.Shape();
	private getArcProgress(anticlockwise: boolean, value: number, max: number, dic: number): egret.Shape {
		// egret.startTick(function (timeStamp:number):boolean {
		var angle: number = Number((value / max).toFixed(1)) * 360;
		this.valueLab.text = value + '/' + max;
		changeGraphics(angle, this.shape);
		// return true;
		// }, this);
		this.cirImg.mask = this.shape;
		return this.shape;
		function changeGraphics(angle, shape) {
			shape.graphics.clear();
			shape.graphics.lineStyle(75, 0x0000ff, 1, false, 1, 'square');
			shape.graphics.drawArc(11, 23, 137, 0, angle * Math.PI / 180, false);
			shape.graphics.endFill();
		}
	}
	private _lvModel: Modelchongwujinjie;
	protected onRefresh(): void {
		// this.qianghuaPro.maximum = DataManager.getInstance().strongerManager.getNextMuBiao(STRONGER_MONSTER_TYPE.STRONGER_PET_UPGRADE);
		// this.qianghuaPro.value = DataManager.getInstance().strongerManager.getCurNumByType(STRONGER_MONSTER_TYPE.STRONGER_PET_UPGRADE);
		// this.maskPro.mask = this.cirImg;
		this._data = DataManager.getInstance().playerManager.player.petData;
		if (this._data.lv == 0) {
			this.btn_update.label = '激 活';
			this.consume.visible = false;
		}
		else {
			this.consume.visible = true;
			this.btn_update.label = '进 阶'
		}
		if (this._data.nextGradeModel) {
			if (this._data.nextGradeModel.exp == 0)
				this.addToContainer(this.getArcProgress(false, this._data.gradeExp, this._data.gradeModel.exp, 1));
			else
				this.addToContainer(this.getArcProgress(false, this._data.gradeExp, this._data.nextGradeModel.exp, 1));
		}
		else {
			this.addToContainer(this.getArcProgress(false, this._data.gradeExp, this._data.gradeExp, 1));
		}

		this.currGrade = this._data.grade;
		var lvModel: Modelchongwujinjie = this._data.gradeModel;
		this.lab_name.text = this._data.gradeModel.jieduan + '阶';
		if (!this._lvModel) {

			this.pet_avatar_grp.removeChildren();
			GameCommon.getInstance().addAnimation('petbig' + lvModel.waixing1, null, this.pet_avatar_grp, -1);
		}
		else if (this._lvModel.jieduan != lvModel.jieduan) {
			this.pet_avatar_grp.removeChildren();
			GameCommon.getInstance().addAnimation('petbig' + lvModel.waixing1, null, this.pet_avatar_grp, -1);
		}
		this._lvModel = lvModel;
		if (this._data.lv == 0) {
			// this.upgrade_grp.visible = false;
			// if (DataManager.getInstance().petManager.onCheckPetCanActivateById(this.currPetID)) {
			// 	this.condition_lab.text = '请先激活宠物';
			// 	this.condition_lab.textColor = 0x28e828;
			// } else {
			// this.condition_lab.text = this.condition_lab.text = DataManager.getInstance().petManager.getPetOpenDesc(this.currPetID);
			this.condition_lab.textColor = 0xe63232;
			// }
		} else {
			// if (!this._data.nextGradeModel) {
			// 	// this.upgrade_grp.visible = false;
			// 	this.condition_lab.text = Language.instance.getText('full_level_2');
			// } else {
			// 	// this.condition_lab.text = '';
			// 	// this.upgrade_grp.visible = true;
			// 	// this.curr_addrate_lab.text = this._data.gradeModel ? `${100 + this._data.gradeModel.effect / 100}%` : "100%";
			// 	// this.next_addrate_lab.text = `${100 + this._data.nextGradeModel.effect / 100}%`;
			// }
		}
		for (var i = 0; i < 10; ++i) {
			let starImg: eui.Image = this["star" + i];
			if (i < this._data.gradeStar) {
				// starImg.visible = true;
				starImg.alpha = 1;
				egret.Tween.get(starImg).to({ alpha: 1 }, 600, egret.Ease.sineOut).call(function (starImg: eui.Image): void {
					egret.Tween.removeTweens(starImg);
				}, this, [starImg]);
			} else {
				// starImg.visible =false;
				starImg.alpha = 0.2;
			}
		}
		// this.lab_name.text = lvModel.name;//new Array<egret.ITextElement>({ text: currModel.name, style: { "textColor": GameCommon.getInstance().CreateNameColer(currModel.quality) } });
		var attributeItem: AttributesText;
		this.curPro.removeChildren();
		this.nextPro.removeChildren();
		for (var key in this._data.gradeModel.attrAry) {
			if (this._data.gradeModel.attrAry[key] > 0) {
				attributeItem = new AttributesText();
				attributeItem.updateAttr(key, this._data.gradeModel.attrAry[key]);
				this.curPro.addChild(attributeItem);
				if (this._data.nextGradeModel) {
					attributeItem = new AttributesText();
					attributeItem.updateAttr(key, this._data.nextGradeModel.attrAry[key]);
					this.nextPro.addChild(attributeItem);
				}
			}
		}
		this.onUpdatePower();
		if (!this._data.nextGradeModel) {
			this.btn_update.label = '已满阶';
			this.currentState = 'max';
			return;
		}
		// this.lab_name.textFlow = new Array<egret.ITextElement>({ text: lvModel.name, style: { "textColor": GameCommon.getInstance().CreateNameColer(lvModel.quality) } });
		this.onUpdateCurrcy();
		// this.onUpdateList();
	}
	private onTouchBtnUpdate(): void {
		if (this.btn_update.label == '激活') {
			var message = new Message(MESSAGE_ID.PET_ACTIVE_MESSAGE);
			GameCommon.getInstance().sendMsgToServer(message);
			return;
		}
		if (this._data.lv == 0) {
			var message = new Message(MESSAGE_ID.PET_ACTIVE_MESSAGE);
			GameCommon.getInstance().sendMsgToServer(message);
		} else {
			if (!this._data.nextGradeModel) {
				return;
			}
			DataManager.getInstance().petManager.onSendUpgradeMessage();
		}
	}
	private openStrongerMonsterPanel() {
		// GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("StrongerMonsterPanel", STRONGER_MONSTER_TYPE.STRONGER_PET_UPGRADE));
	}
	private showLingDanPanel(event: egret.Event) {
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("PetLingDanPanel", 6));
	}
	private showDanPanel(event: egret.Event) {
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("PetZiZhiDan", 6));
	}
	private onUpdateBack(): void {
		if (this._data) {
			if (this._data.lv == 1&&this._data.gradeExp==0&&this._data.grade==0) {
				GameCommon.getInstance().addAnimation("jihuochenggong", new egret.Point(this.width/2-20, 350), this);
			} else if (this.currGrade < this._data.grade) {
				GameCommon.getInstance().addAnimation("shenzhuangjinjie", new egret.Point(this.width/2, 350), this);
			}
		}
		this.onRefresh();
	}
	private onUpdatePower(): void {
		this.power.power = DataManager.getInstance().petManager.power.toString();
	}
	private onUpdateCurrcy(): void {
		if (this._data.lv == 0) {
			var model: Modelchongwujinjie = JsonModelManager.instance.getModelchongwujinjie()[0][0];
			this.consume.data = new CurrencyParam(Language.instance.getText('xiaohao'), new ThingBase(model.cost.type, model.cost.id, model.cost.num));
		} else if (this._data.nextGradeModel) {
			if (this._data.gradeModel.cost.num == 0) {
				this.btn_update.label = '突破';
			}
			this.consume.data = new CurrencyParam(Language.instance.getText('xiaohao'), new ThingBase(this._data.gradeModel.cost.type, this._data.gradeModel.cost.id, this._data.gradeModel.cost.num));
		}
	}
	private onGetBtn(event: TouchEvent): void {
		// var model: Modelchongwu;
		// model = JsonModelManager.instance.getModelchongwu()[this._data.id][this._data.lv];
		if (this._data.nextGradeModel) {
			GameCommon.getInstance().onShowFastBuy(this._data.nextGradeModel.cost.id, GOODS_TYPE.GOLD);
		}
	}
	//The end
}