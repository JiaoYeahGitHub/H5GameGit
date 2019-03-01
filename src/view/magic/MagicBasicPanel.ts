class MagicBasicPanel extends eui.Component {
	private consumItem: ConsumeBar;
	public powerbar: PowerBar;
	private curPro: eui.Group;
	private nextPro: eui.Group;
	private btn_upgrade: eui.Button;
	private btnActive: eui.Button;
	protected points: redPoint[] = RedPointManager.createPoint(10);
	private pointItems: redPoint[];
	private avatar_grp: eui.Group;
	private isLoaded: boolean;
	private blessType: number = -1;
	public cost: AwardItem;
	private freeachive_grp: eui.Group;
	private func_Type: number;
	private activeLabel: eui.Label;
	private jiantou: eui.Image;
	private consumeTP: number = 0;
	private strengthenMasterBtn: eui.Button;
	// private btn2: eui.Button;
	// private btn1: eui.Button;
	// private btnJueXing: eui.Button;
	private btnDan: eui.Button;
	private btnSkill: eui.Button;
	private topBtn1: eui.Button;
	private scroll: eui.Scroller;
	private fashion_item_grp: eui.Group;
	private currIdx: number = -1;
	private models: Modelfashion[];
	private _tsModels: Modelmounttaozhuang[];
	private items: eui.Component[];
	private selectAnim: Animation;
	private btnHuanhua: eui.Button;
	private huanhua_jihuo_btn: eui.Button;
	private fashionLvUpBtn: eui.Button;
	private huanhuaGroup: eui.Group;
	private mountName: eui.Label;
	private btnSendUpTaoZhuang: eui.Button;
	private label_get: eui.Label;
	private getGrp: eui.Group;
	private groupLayer: eui.Group;
	private layerSkill: MagicSkillPanel;
	private layerEquip: MagicEquipPanel;
	private qianghuaPro: eui.ProgressBar;
	private centerPro: eui.Group;
	private skillDesc: eui.Label;
	private isWearingImg: eui.Image;

	public constructor() {
		super();
		this.skinName = skins.MagicBasicSkin;
		this.once(egret.Event.COMPLETE, this.onLoadComplete, this);
		this.once(egret.Event.ADDED_TO_STAGE, this.onAddStage, this);
	}
	private onLoadComplete(): void {
		this.isLoaded = true;
		this.label_get.text = Language.instance.getText("huoqutujing");
		GameCommon.getInstance().addUnderlineGet(this.label_get);
		this.label_get.touchEnabled = true;
		this.onRegist();
		if (this.blessType > -1) {
			this.refresh();
		}
	}
	private onAddStage(): void {
	}
	public trigger(): void {
		for (let i = 0; i < this.points.length; ++i) {
			this.points[i].checkPoint();
		}
		if (this.pointItems) {
			for (let i = 0; i < this.pointItems.length; ++i) {
				this.pointItems[i].checkPoint();
			}
		}
	}
	protected onRegist(): void {
		this.btn_upgrade.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onUpgrade, this);
		this.btnActive.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnActive, this);
		this.strengthenMasterBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.openStrongerMonsterPanel, this);
		this.btnDan.addEventListener(egret.TouchEvent.TOUCH_TAP, this.showDanPanel, this);
		this.btnSkill.addEventListener(egret.TouchEvent.TOUCH_TAP, this.showSkillPanel, this);
		this.btnHuanhua.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSendHuanHua, this);
		this.huanhua_jihuo_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onHuahuaActive, this);
		this.fashionLvUpBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onHuanHuaLvUp, this);
		this.btnSendUpTaoZhuang.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSendTaoZhuangUp, this)
		this.getGrp.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGetBtn, this);


		for (var i = 1; i < 6; i++) {
			this['topBtn' + i].name = i - 1;
			(this['topBtn' + i]['iconDisplay'] as eui.Image).source = this.iconNames[i];
			this['topBtn' + i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.topPanel, this);
		}
		this.label_get.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGetBtn, this);
		// for (var i: number = 0; i < BlessDefine.BLESS_SLOT_MAXNUM; i++) {
		// 	this[`equip_bar_${i}`].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onChangeEquipSlot, this);
		// }

	}
	protected onRemove(): void {
		// for (var i: number = 0; i < BlessDefine.BLESS_SLOT_MAXNUM; i++) {
		// 	this[`equip_bar_${i}`].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onChangeEquipSlot, this);
		// }
		this.btn_upgrade.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onUpgrade, this);
		this.btnActive.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnActive, this);
		this.strengthenMasterBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.openStrongerMonsterPanel, this);
		this.btnDan.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.showDanPanel, this);
		this.btnSkill.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.showSkillPanel, this);
		this.btnHuanhua.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onSendHuanHua, this);
		this.huanhua_jihuo_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onHuahuaActive, this);
		this.fashionLvUpBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onHuanHuaLvUp, this);
		this.btnSendUpTaoZhuang.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onSendTaoZhuangUp, this)
		this.getGrp.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onGetBtn, this);
		for (var i = 1; i < 6; i++) {
			this['topBtn' + i].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.topPanel, this);
		}
	}
	private initBtn(): void {

	}
	private iconNames: string[] = ['', 'z_btn_icon_levelup_png', 'z_btn_icon_huanhua_png', 'z_btn_icon_taozhuang_png', 'tianfu_png', 'z_btn_icon_guahun_png']
	protected refresh() {
		this.qianghuaPro.maximum = DataManager.getInstance().strongerManager.getNextMuBiao(this.blessType);
		this.qianghuaPro.value = DataManager.getInstance().strongerManager.getCurNumByType(this.blessType);
		this.getGrp.visible = true;
		this.onChangeBtn();
		let manager: BlessManager = DataManager.getInstance().blessManager;
		let blessData: BlessData = manager.getPlayerBlessData(this.blessType);
		let model: Modelmount = manager.getBlessModelByData(blessData);
		let nextModel: Modelmount = manager.getNextBlessModel(this.blessType, blessData.grade, blessData.level);
		let currModel: Modelmount = model || nextModel;
		this.addPoint();
		this.updateAvatarAnim();
		this.mountName.text = blessData.grade + '级';
		this.activeLabel.text = "";
		if (blessData.level == 0 && blessData.grade == 0) {
			this.btn_upgrade.visible = false;
			this.getGrp.visible = false;
			this.freeachive_grp.visible = true;
			let funmodel: ModelfunctionLv = JsonModelManager.instance.getModelfunctionLv()[this.func_Type];
			if (!FunDefine.isFunOpen(this.func_Type)) {
				this.activeLabel.text = Language.instance.parseInsertText('bless_open_des', `coatard_level${funmodel.jingjie}`);
				this.btnActive.enabled = false;
			} else {
				this.btnActive.enabled = true;
			}
			this.jiantou.visible = false;
			this.consumItem.visible = false;
			return;
		}

		this.btn_upgrade.visible = true;
		this.freeachive_grp.visible = false;
		this.jiantou.visible = true;
		this.consumItem.visible = true;
		if (!currModel) {
			GameCommon.getInstance().addAlert('已达到最高级别！');
			return;
		}
		this.cost = GameCommon.parseAwardItem(currModel.itemCost);
		if (this.consumeTP > 0) {
			var awardstrItem: string[] = currModel.itemCost.split("#");
			this.cost = GameCommon.parseAwardItem(awardstrItem[this.consumeTP]);
		}
		if (!this.isLoaded)
			return;
		var attrAry: number[] = currModel.attrAry;
		var attributeItem: AttributesText;
		this.curPro.removeChildren();
		this.nextPro.removeChildren();
		this.centerPro.removeChildren();
		var nextAry: number[] = nextModel ? nextModel.attrAry : currModel.attrAry;
		let i: number = 0;

		if (!nextModel) {
			for (; i < GameDefine.ATTR_OBJ_KEYS.length; i++) {
				if (currModel.attrAry[i] > 0) {
					attributeItem = new AttributesText();
					attributeItem.updateAttr(i, currModel.attrAry[i]);
					this.centerPro.addChild(attributeItem);
				}
			}
			this.getGrp.visible = false;
			this.btn_upgrade.label = '已满级';
			this.jiantou.visible = false;
			this.consumItem.visible = false;
			this['nextImg'].visible = false;
			this['curImg'].visible = false;
		}
		else {
			for (; i < GameDefine.ATTR_OBJ_KEYS.length; i++) {
				if (nextAry[i] > 0) {
					attributeItem = new AttributesText();
					attributeItem.updateAttr(i, attrAry[i]);
					this.curPro.addChild(attributeItem);
					attributeItem = new AttributesText();
					attributeItem.updateAttr(i, nextAry[i]);
					this.nextPro.addChild(attributeItem);
				}
			}
			this.getGrp.visible = true;
			this['nextImg'].visible = true;
			this['curImg'].visible = true;
			this.jiantou.visible = true;
			if (this.currentState == 'zhuanpan') {
				this.btn_upgrade.label = '升 级';
				this.getGrp.visible = true;
			}
			else
				this.btn_upgrade.label = '一键升级';
			this.consumItem.visible = true;
			this.consumItem.setCostByAwardItem(this.cost);
		}
		this.powerbar.power = DataManager.getInstance().playerManager.player.getPlayerData(0).getBlessFightingByType(this.blessType);
		// this.btn_upgrade.visible = true;
		this.updateHuanHua();
		this.updateTaoZhuang();
	}
	private addPoint(): void {
		this.points[0].register(this['topBtn' + 1], new egret.Point(50, 10), this, "checkPointTab0", this.blessType);
		this.points[1].register(this['topBtn' + 2], new egret.Point(50, 10), DataManager.getInstance().playerManager, "checkFashionPointByType", this.blessType);
		this.points[2].register(this['topBtn' + 3], new egret.Point(50, 10), DataManager.getInstance().playerManager, "chechFashionTaoZhuang", this.blessType);// 套装
		this.points[3].register(this['topBtn' + 4], new egret.Point(50, 10), this, "checkPointSkill");// 技能
		this.points[4].register(this.btnDan, new egret.Point(60, 10), this, "checkPointDan");// 3丹
		this.points[5].register(this.strengthenMasterBtn, new egret.Point(70, 10), DataManager.getInstance().strongerManager, "getPoint", this.blessType);
		this.points[6].register(this['topBtn' + 5], new egret.Point(50, 10), DataManager.getInstance().playerManager, "checkMagicEquipPoint", this.blessType);

		this.checkPointLogic();
	}
	private checkPointLogic() {
		switch (DataManager.getInstance().blessManager.btnType) {
			case 0:
				// 一键升星
				if (this.blessType == BLESS_TYPE.WEAPON) {
					this.points[6].register(this.btn_upgrade, new egret.Point(150, -5), DataManager.getInstance().playerManager, "checkBlessUPCostMoney", this.blessType, this.consumeTP);
				} else {
					this.points[6].register(this.btn_upgrade, new egret.Point(150, -5), DataManager.getInstance().playerManager, "checkBlessUPCostMoney", this.blessType);
				}
				break;
			case 1:
				// 幻化升级
				this.points[6].register(this.huanhua_jihuo_btn, new egret.Point(150, -5), this, "checkPointHuanHuaCurr", 0);
				this.points[7].register(this.fashionLvUpBtn, new egret.Point(150, -5), this, "checkPointHuanHuaCurr", 1);
				// let model: Modelfashion = this.models[this.currIdx];
				// let data: FashionData = this.getPlayerData().fashionDatas[model.id];
				// let costModel: ModelThing = GameCommon.getInstance().getThingModel(model.cost.type, model.cost.id);
				// if (data && data.limitTime != 0) {
				// 	this.points[6].register(this.btnHuanhua, new egret.Point(150, -5), this, "checkPointHuanHuaCurr");
				// } else {
				// 	this.points[7].register(this.fashionLvUpBtn, new egret.Point(150, -5), this, "checkPointHuanHuaCurr");
				// }
				break;
			case 2:
				this.points[6].register(this.btnSendUpTaoZhuang, new egret.Point(150, -5), this, "checkPointTaoZhuangCurr");
				break;
		}
	}
	private checkPointTaoZhuangCurr() {
		let model: Modelmounttaozhuang = this._tsModels[this.currIdx];
		if (model) {
			if (DataManager.getInstance().playerManager.chechFashionTaoZhuangOne(model)) {
				return true;
			}
		}
		return false;
	}
	private checkPointHuanHuaCurr(type: number) {//0-激活，1-升级
		let model: Modelfashion = this.models[this.currIdx];
		if (model) {
			if (DataManager.getInstance().playerManager.checkFashionPointByID(model.id)) {
				let data: FashionData = this.getPlayerData().fashionDatas[model.id];
				if (data && data.limitTime != 0) {
					return type == 1;
				} else {
					return type == 0;
				}
			}
		}
		return false;
	}
	public checkPointTab0() {
		if (DataManager.getInstance().playerManager.checkBlessUPCostMoney(this.blessType)) return true;
		if (this.checkPointDan()) return true;
		if (DataManager.getInstance().strongerManager.getPoint(this.blessType)) return true;
		return false;
	}
	public checkPointDan() {
		return this.checkPoint5() || this.checkPoint4() || this.checkPointJueXing();
	}
	//检测丹药
	public checkPointJueXing(): boolean {
		if (this.manager.checkJueXingPoint(this.blessType)) return true;
		return false;
	}
	//检测丹药
	private checkPoint5(): boolean {
		if (this.manager.checkLingDanPoint(this.blessType, 1)) return true;
		return false;
	}
	//检测丹药
	private checkPoint4(): boolean {
		if (this.manager.checkLingDanPoint(this.blessType, 0)) return true;
		return false;
	}
	//检测技能红点
	private checkPointSkill(): boolean {
		if (this.manager.checkMountSkill(this.blessType)) return true;
		return false;
	}
	private updateAvatarAnim(): void {
		let resurl: string = "";
		let manager: BlessManager = DataManager.getInstance().blessManager;
		let blessData: BlessData = manager.getPlayerBlessData(this.blessType);
		let model: Modelmount = manager.getBlessModelByData(blessData);
		model = model ? model : manager.getBlessModel(this.blessType, 1, 1);
		while (this.avatar_grp.numChildren > 0) {
			let display = this.avatar_grp.getChildAt(0);
			if (egret.is(display, "BodyAnimation") || egret.is(display, "Animation")) {
				(display as Animation).onDestroy();
			} else {
				this.avatar_grp.removeChild(display);
			}
		}
		this.avatar_grp.touchEnabled = false;
		this.avatar_grp.touchChildren = false;
		var waixing: number = 0;
		if (DataManager.getInstance().blessManager.btnType == 1) {
			let md: Modelfashion = this.models[this.currIdx];
			if (!md) return;
			waixing = md.waixing1;
		}
		else {
			let wearfashionId: number = DataManager.getInstance().playerManager.player.getPlayerData().fashionWearIds[this.blessType];
			let fashionmodel: Modelfashion = JsonModelManager.instance.getModelfashion()[wearfashionId];
			if (fashionmodel)
				waixing = fashionmodel.waixing1;
		}
		switch (this.blessType) {
			case BLESS_TYPE.HORSE:
				resurl = `zuoqi_${waixing}`;
				let _mountBody: Animation = new Animation(resurl);
				_mountBody.y = 0;
				this.avatar_grp.addChild(_mountBody);
				break;
			case BLESS_TYPE.WEAPON:
				resurl = 'jian' + waixing;
				var anim = new Animation(resurl, -1);
				this.avatar_grp.addChild(anim);
				break;
			case BLESS_TYPE.CLOTHES:
				let sex: string = this.getPlayerData().sex == SEX_TYPE.MALE ? "nan" : "nv";
				resurl = `shenzhuang_${sex}_${waixing}`;
				var anim = new Animation(resurl, -1);
				anim.y = 140;
				this.avatar_grp.addChild(anim);
				break;
			case BLESS_TYPE.MAGIC:
				var anim = new Animation('sc_magic' + waixing, -1);
				this.avatar_grp.addChild(anim);
				anim.y = 20;
				anim.scaleX = anim.scaleY = 1.5;
				break;
			case BLESS_TYPE.WING:
				var anim = new Animation('wing' + waixing + "_ui", -1);
				anim.y = 110;
				this.avatar_grp.addChild(anim);
				break;
		}
	}
	/**更新按钮和消耗**/
	private onupdateStatus(): void {
		let model: Modelfashion = this.models[this.currIdx];
		let data: FashionData = this.getPlayerData().fashionDatas[model.id];
		let costModel: ModelThing = GameCommon.getInstance().getThingModel(model.cost.type, model.cost.id);
		if (data && data.limitTime != 0) {
			this.fashionLvUpBtn.visible = true;
			this.btnHuanhua.visible = true;
			this.huanhua_jihuo_btn.visible = false;
			if (data.isWear) {
				this.btnHuanhua.label = Language.instance.getText('cloth_out');
				this.btnHuanhua.name = FASHION_STATUS.OUT + "";
			} else {
				this.btnHuanhua.label = Language.instance.getText('cloth');
				this.btnHuanhua.name = FASHION_STATUS.CLOTH + "";
			}
		} else {
			this.fashionLvUpBtn.visible = false;
			this.btnHuanhua.visible = false;
			this.huanhua_jihuo_btn.visible = true;
		}
		this.consumItem.setCostByAwardItem(model.cost);
		//更新幻化状态
		if (!this.isWearingImg) {
			this.isWearingImg = new eui.Image("huanhuazhong_png");
			this.isWearingImg.x = -25;
		}
		if (this.isWearingImg.parent) {
			this.isWearingImg.parent.removeChild(this.isWearingImg);
		}
		for (let i: number = 0; i < this.items.length; i++) {
			let curItem: eui.Component = this.items[i];
			let curModel: Modelfashion = this.models[i];
			let curData: FashionData = this.getPlayerData().fashionDatas[curModel.id];
			if (curData.isWear) {
				curItem.parent.addChild(this.isWearingImg);
				break;
			}
		}
	}
	private onSendTaoZhuangUp(): void {
		if (!this.isActTaoZhuang) {
			GameCommon.getInstance().addAlert('皮肤未收集齐,无法激活');
			return;
		}
		let tzCfg: Modelmounttaozhuang = this._tsModels[this.currIdx];
		let taozhuangLv: number = this.getPlayerData().taozhuangDict[tzCfg.id];
		if (taozhuangLv == 0) {
			let message = new Message(MESSAGE_ID.FASHIONSETL_ACT_MESSAGE);
			message.setByte(0);
			message.setShort(tzCfg.id);
			GameCommon.getInstance().sendMsgToServer(message);
		}
		else {
			if (!GameCommon.getInstance().onCheckItemConsume(tzCfg.cost.id, tzCfg.cost.num)) {
				return;
			}
			let message = new Message(MESSAGE_ID.FASHIONSETL_UPLV_MESSAGE);
			message.setByte(0);
			message.setShort(tzCfg.id);
			GameCommon.getInstance().sendMsgToServer(message);
		}
	}
	private onHuanHuaLvUp(): void {
		let model: Modelfashion = this.models[this.currIdx];
		if (!GameCommon.getInstance().onCheckItemConsume(model.cost.id, model.cost.num)) {
			return;
		}
		let message = new Message(MESSAGE_ID.FASHION_UPLEVEL_MESSAGE);
		message.setByte(0);
		message.setByte(model.id);
		GameCommon.getInstance().sendMsgToServer(message);
	}
	private onHuahuaActive(): void {
		let model: Modelfashion = this.models[this.currIdx];
		if (!GameCommon.getInstance().onCheckItemConsume(model.cost.id, model.cost.num)) {
			return;
		}
		let message: Message = new Message(MESSAGE_ID.FASHION_ACTIVE_MESSAGE);
		message.setByte(0);
		message.setByte(this.blessType);
		message.setByte(model.id);
		GameCommon.getInstance().sendMsgToServer(message);
	}
	private onSendHuanHua(evt: egret.Event): void {
		let model: Modelfashion = this.models[this.currIdx];
		let currStatus: FASHION_STATUS = parseInt(evt.currentTarget.name);
		let message: Message;
		switch (currStatus) {
			// case FASHION_STATUS.ACTIVE:
			// 	if (!GameCommon.getInstance().onCheckItemConsume(model.cost.id, model.cost.num)) {
			// 		return;
			// 	}
			// 	message = new Message(MESSAGE_ID.FASHION_ACTIVE_MESSAGE);
			// 	message.setByte(0);
			// 	message.setByte(this.blessType);
			// 	message.setByte(model.id);
			// 	break;
			case FASHION_STATUS.CLOTH:
				message = new Message(MESSAGE_ID.FASHION_SHOW_MESSAGE);
				message.setByte(0);
				message.setByte(this.blessType);
				message.setByte(model.id);
				break;
			case FASHION_STATUS.OUT:
				message = new Message(MESSAGE_ID.FASHION_SHOW_MESSAGE);
				message.setByte(0);
				message.setByte(this.blessType);
				message.setByte(0);
				break;
		}
		GameCommon.getInstance().sendMsgToServer(message);
	}
	protected onUpgrade(event: egret.Event) {
		if (this.cost && GameCommon.getInstance().onCheckItemConsume(this.cost.id, this.cost.num)) {
			if (this.blessType == BLESS_TYPE.MAGIC)
				DataManager.getInstance().blessManager.onSendBlessUpMsg(this.blessType, false, this.consumeTP);
			else
				DataManager.getInstance().blessManager.onSendBlessUpMsg(this.blessType, true, this.consumeTP);
		}
	}
	public onUpdate(tp: number, fcTp: number, consumeId: number = 0): void {
		this.blessType = tp;
		this.func_Type = fcTp;
		this.consumeTP = consumeId;

		if (!this.isLoaded) {
			return;
		}
		this.groupLayer.visible = false;
		// this.avatar_grp.y = 297;
		this.fashion_item_grp.removeChildren();
		this.avatar_grp.touchEnabled = false;
		this.avatar_grp.touchChildren = false;
		this.freeachive_grp.visible = false;
		if (DataManager.getInstance().blessManager.btnType == 1) {
			if (!FunDefine.isFunOpen(this.func_Type)) {
				DataManager.getInstance().blessManager.btnType = 0;
				GameCommon.getInstance().addAlert('请先进行激活');
				this.refresh();
				return;
			}
			let manager: BlessManager = DataManager.getInstance().blessManager;
			let blessData: BlessData = manager.getPlayerBlessData(this.blessType);
			if (!blessData || (blessData.grade == 0 && blessData.level == 0)) {
				DataManager.getInstance().blessManager.btnType = 0;
				GameCommon.getInstance().addAlert('请先进行激活');
				this.refresh();
				return;
			}
			this.onChangeBtn();
			this.onHuanHuaInfo();
			// if (this.currentState != 'huanhua') {
			// 	this.currentState = 'huanhua';
			// }
			this.addPoint();
			// this.huanhuaGroup.visible = true;
			return;
		}
		else if (DataManager.getInstance().blessManager.btnType == 2) {
			if (!FunDefine.isFunOpen(this.func_Type)) {
				DataManager.getInstance().blessManager.btnType = 0;
				GameCommon.getInstance().addAlert('请先进行激活');
				this.refresh();
				return;
			}
			let manager: BlessManager = DataManager.getInstance().blessManager;
			let blessData: BlessData = manager.getPlayerBlessData(this.blessType);
			if (!blessData || (blessData.grade == 0 && blessData.level == 0)) {
				DataManager.getInstance().blessManager.btnType = 0;
				GameCommon.getInstance().addAlert('请先进行激活');
				this.refresh();
				return;
			}
			this.onChangeBtn();
			// this.onHuanHuaInfo();
			// this.huanhuaGroup.visible = true;
			this.currentState = 'taozhuang1';
			this.onTaoZhuangInfo();
			this.updateTaoZhuang();
			this.addPoint();
			// this.refresh();
			return;
		} else if (DataManager.getInstance().blessManager.btnType == 3) {
			if (!FunDefine.isFunOpen(this.func_Type)) {
				DataManager.getInstance().blessManager.btnType = 0;
				GameCommon.getInstance().addAlert('请先进行激活');
				this.refresh();
				return;
			}
			let manager: BlessManager = DataManager.getInstance().blessManager;
			let blessData: BlessData = manager.getPlayerBlessData(this.blessType);
			if (!blessData || (blessData.grade == 0 && blessData.level == 0)) {
				DataManager.getInstance().blessManager.btnType = 0;
				GameCommon.getInstance().addAlert('请先进行激活');
				this.refresh();
				return;
			}

			this.currentState = 'skill';
			this.groupLayer.visible = true;
			this.onChangeBtn();
			this.refreshSkill();
			this.addPoint();
			return;
		} else if (DataManager.getInstance().blessManager.btnType == 4) {
			if (!FunDefine.isFunOpen(this.func_Type)) {
				DataManager.getInstance().blessManager.btnType = 0;
				GameCommon.getInstance().addAlert('请先进行激活');
				this.refresh();
				return;
			}
			let manager: BlessManager = DataManager.getInstance().blessManager;
			let blessData: BlessData = manager.getPlayerBlessData(this.blessType);
			if (!blessData || (blessData.grade == 0 && blessData.level == 0)) {
				DataManager.getInstance().blessManager.btnType = 0;
				GameCommon.getInstance().addAlert('请先进行激活');
				this.refresh();
				return;
			}
			this.currentState = 'equip';
			this.groupLayer.visible = true;
			this.onChangeBtn();
			this.refreshEquip();
			this.updateAvatarAnim();
			return;
		}
		else {
			this.groupLayer.removeChildren();
			switch (this.blessType) {
				case 2:
					this.currentState = 'shenzhuang';
					break;
				case 3:
					this.currentState = 'zhuanpan';
					break;
				default:
					this.currentState = 'normal';
					break;
			}
			// this.huanhuaGroup.visible = false;
			// this.btn_upgrade.visible = true;
		}
		this.refresh();
	}
	private onChangeBtn(): void {
		for (var i = 1; i < 6; i++) {
			if (DataManager.getInstance().blessManager.btnType + 1 == i) {
				(this['topBtn' + i]['iconFrame'] as eui.Image).visible = true;
			}
			else {
				(this['topBtn' + i]['iconFrame'] as eui.Image).visible = false;
			}
		}
	}
	private onTaoZhuangInfo(): void {
		this.models = [];
		this.items = [];
		this._tsModels = [];
		var taozhuangCfgs: Modelmounttaozhuang = JsonModelManager.instance.getModelmounttaozhuang()[this.blessType]
		let fashionModels = JsonModelManager.instance.getModelfashion();
		let actives: Modelfashion[] = [];
		let canActives: Modelfashion[] = [];
		let notActives: Modelfashion[] = [];
		var tzCfgs: Modelmounttaozhuang[] = [];
		for (let idx in taozhuangCfgs) {
			var tzCfg: Modelmounttaozhuang = taozhuangCfgs[idx];
			tzCfgs.push(tzCfg);
		}
		this._tsModels = tzCfgs;
		this.pointItems = [];
		for (let i: number = 0; i < tzCfgs.length; i++) {
			var awardStrAry: string[];
			if (tzCfgs[i].fashionId.indexOf(",") >= 0) {
				awardStrAry = tzCfgs[i].fashionId.split(",");
			}
			let model: Modelfashion = fashionModels[awardStrAry[0]];
			let data: FashionData = this.getPlayerData().fashionDatas[model.id];
			let costModel: ModelThing = GameCommon.getInstance().getThingModel(model.cost.type, model.cost.id);
			let fashionItem: eui.Component = new eui.Component();
			fashionItem.name = i + '';
			fashionItem.skinName = skins.GoodsInstanceSkin;
			// fashionItem.currentState = 'notName';
			fashionItem['item_frame'].source = 'slotFrame_png'// GameCommon.getInstance().getIconFrame(costModel.quality);
			fashionItem['item_icon'].source = costModel.icon;
			fashionItem['name_label'].textColor = GameCommon.getInstance().CreateNameColer(costModel.quality);
			let taozhuangLv: number = this.getPlayerData().taozhuangDict[tzCfgs[i].id];
			fashionItem['num_label'].text = 'Lv.' + taozhuangLv;
			fashionItem['name_label'].text = tzCfgs[i].name;
			let itemgrp: eui.Group = new eui.Group();
			itemgrp.width = 90;
			itemgrp.addChild(fashionItem);
			fashionItem.y = 40;
			this.fashion_item_grp.addChild(itemgrp);// 套装
			this.items.push(fashionItem);
			fashionItem.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchItem, this);

			let tzCfg: Modelmounttaozhuang = tzCfgs[i];
			this.pointItems[i] = new redPoint();
			this.pointItems[i].register(fashionItem, new egret.Point(65, 0), DataManager.getInstance().playerManager, "chechFashionTaoZhuangOne", tzCfg);
		}
		this.scroll.viewport.scrollH = 0;
		/**更新选中**/
		if (this.currIdx == -1)
			this.onSelectItem(0);
		else
			this.onSelectItem(this.currIdx);
		this.activeLabel.text = "";
		if (!FunDefine.isFunOpen(this.func_Type)) {
			let funmodel: ModelfunctionLv = JsonModelManager.instance.getModelfunctionLv()[this.func_Type];
			this.activeLabel.text = Language.instance.parseInsertText('bless_open_des', `coatard_level${funmodel.jingjie}`);
			this.btnActive.enabled = false;
		}
	}
	private onGetBtn(event: TouchEvent): void {
		GameCommon.getInstance().onShowFastBuy(this.cost.id, this.cost.type);
	}
	private onHuanHuaInfo(): void {
		this.models = [];
		this.items = [];
		let models = JsonModelManager.instance.getModelfashion();
		let actives: Modelfashion[] = [];
		let canActives: Modelfashion[] = [];
		let notActives: Modelfashion[] = [];
		for (let idx in models) {
			let model: Modelfashion = models[idx];
			let data: FashionData = this.getPlayerData().fashionDatas[model.id];
			if (model.type != this.blessType) continue;
			if (data) {
				actives.push(model);
			} else {
				let thing: ItemThing = DataManager.getInstance().bagManager.getGoodsThingById(model.cost.id, model.cost.type);
				if (thing && thing.num >= model.cost.num) {
					canActives.push(model);
				} else {
					notActives.push(model);
				}
			}
		}
		for (let i: number = 0; i < actives.length; i++) {
			this.models.push(actives[i]);
		}
		for (let i: number = 0; i < canActives.length; i++) {
			this.models.push(canActives[i]);
		}
		for (let i: number = 0; i < notActives.length; i++) {
			this.models.push(notActives[i]);
		}

		this.pointItems = [];
		for (let i: number = 0; i < this.models.length; i++) {
			let model: Modelfashion = this.models[i];
			let data: FashionData = this.getPlayerData().fashionDatas[model.id];
			let costModel: ModelThing = GameCommon.getInstance().getThingModel(model.cost.type, model.cost.id);
			let fashionItem: eui.Component = new eui.Component();
			fashionItem.name = i + '';
			fashionItem.skinName = skins.GoodsInstanceSkin;
			// fashionItem.currentState = 'notName';
			fashionItem['item_frame'].source = 'slotFrame_png'// GameCommon.getInstance().getIconFrame(costModel.quality);
			fashionItem['item_icon'].source = costModel.icon;
			fashionItem['name_label'].textColor = GameCommon.getInstance().CreateNameColer(costModel.quality);
			fashionItem['num_label'].text = data ? `Lv.${data.level}` : model.name;
			fashionItem['name_label'].text = model.name;
			let itemgrp: eui.Group = new eui.Group();
			itemgrp.width = 90;
			itemgrp.addChild(fashionItem);
			fashionItem.y = 40;
			this.fashion_item_grp.addChild(itemgrp);// 套装
			this.items.push(fashionItem);
			fashionItem.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchItem, this);

			this.pointItems[i] = new redPoint();
			this.pointItems[i].register(fashionItem, new egret.Point(65, 0), DataManager.getInstance().playerManager, "checkFashionPointByID", model.id);
		}



		this.scroll.viewport.scrollH = 0;
		/**更新选中**/
		// this.freeachive_grp.visible = false;
		if (this.currIdx == -1)
			this.onSelectItem(0);
		else
			this.onSelectItem(this.currIdx);
		this.activeLabel.text = "";
		// this.btn_upgrade.visible = false;
		if (!FunDefine.isFunOpen(this.func_Type)) {
			let funmodel: ModelfunctionLv = JsonModelManager.instance.getModelfunctionLv()[this.func_Type];
			this.activeLabel.text = Language.instance.parseInsertText('bless_open_des', `coatard_level${funmodel.jingjie}`);
			this.btnActive.enabled = false;
			// this.huanhuaGroup.visible = false;
		}
		// this.jiantou.visible = false;
		// this.consumItem.visible = false;
	}
	private updateHuanHua() {
		if (DataManager.getInstance().blessManager.btnType == 1) {
			let model: Modelfashion = this.models[this.currIdx];
			if (model) {
				let data: FashionData = this.getPlayerData().fashionDatas[model.id];
				if (data && data.limitTime != 0) {
					this.getGrp.visible = false;
				} else {
					this.getGrp.visible = true;
				}
			}
		}
	}

	private updateTaoZhuang() {
		if (DataManager.getInstance().blessManager.btnType == 2) {
			this.btnSendUpTaoZhuang.enabled = true;
			let idx = this.currIdx == -1 ? 0 : this.currIdx;
			let tzCfg: Modelmounttaozhuang = this._tsModels[this.currIdx];
			let taozhuangLv: number = this.getPlayerData().taozhuangDict[tzCfg.id];
			this.consumItem.visible = false;
			// this.powerbar.power = DataManager.getInstance().playerManager.player.getPlayerData(0).getBlessFightingByType(this.blessType);
		}
	}
	private isActTaoZhuang: boolean = true;
	private onSelectItem(index: number) {
		if (DataManager.getInstance().blessManager.btnType == 2) {
			this.isActTaoZhuang = true;
			this.currIdx = index;
			var awardStrAry: string[];
			if (!this._tsModels[this.currIdx]) {
				this.currIdx = 0;
				this.onSelectItem(this.currIdx);
			}
			let tzCfg: Modelmounttaozhuang = this._tsModels[this.currIdx];
			if (tzCfg.fashionId.indexOf(",") >= 0) {
				awardStrAry = tzCfg.fashionId.split(",");
			}

			this.currentState = 'taozhuang' + (awardStrAry.length - 1);
			var colorMatrix = [
				0.3, 0.6, 0, 0, 0,
				0.3, 0.6, 0, 0, 0,
				0.3, 0.6, 0, 0, 0,
				0, 0, 0, 1, 0
			];
			var flilter = new egret.ColorMatrixFilter(colorMatrix);
			for (let i: number = 0; i < awardStrAry.length; i++) {
				var equipslot: GoodsInstance = this[`equip_slot${i}`];
				equipslot.touchEnabled = true;
				let model: Modelfashion = JsonModelManager.instance.getModelfashion()[awardStrAry[i]];
				let data: FashionData = this.getPlayerData().fashionDatas[model.id];


				// equipslot.currentState = 'notName';
				if (!data || data.level == 0) {
					equipslot.onUpdate(model.cost.type, model.cost.id, 1);
					equipslot.filters = [flilter];
					this.isActTaoZhuang = false;
				} else {
					equipslot.onUpdate(model.cost.type, model.cost.id);
					equipslot.filters = [];
				}
				equipslot.name_label.text = model.name + "\n" + model.goDesc;
			}
			let item: eui.Component = this.items[this.currIdx];
			if (!this.selectAnim) {
				this.selectAnim = new Animation('zhuangbeixuanzhong', -1);
				this.selectAnim.scaleX = 0.7;
				this.selectAnim.scaleY = 0.7;
			}
			if (this.selectAnim.parent) {
				this.selectAnim.parent.removeChild(this.selectAnim);
			}
			item['orangeLayer'].addChild(this.selectAnim);
			var str: string = '';
			var nextStr: string = '';
			// let attr_ary: number[] = GameCommon.getInstance().getAttributeAry();
			let taozhuangLv: number = 1;// this.getPlayerData().taozhuangDict[tzCfg.id];
			// for (let i = 0; i < 10; ++i) {
			// 	if (taozhuangLv >= (i + 1)) {
			// 		this['xingxing' + i].filters = [];
			// 	} else {
			// 		this['xingxing' + i].filters = [flilter];
			// 	}
			// }
			this.mountName.text = tzCfg.name;
			var attributeItem: AttributesText;
			this.curPro.removeChildren();
			this.nextPro.removeChildren();
			this.centerPro.removeChildren();
			this['nextImg'].visible = true;
			this['curImg'].visible = true;
			let isMax = taozhuangLv >= parseInt(Constant.get(Constant.TAOZHUANG_MAX));

			var idx: number = 0;
			for (let i = 0; i < tzCfg.attrAry.length; ++i) {
				if (tzCfg.attrAry[i] > 0) {
					idx = idx + 1;
					// attr_ary[i] = tzCfg.attrAry[i] * taozhuangLv;
					if (idx % 2 == 0) {
						attributeItem = new AttributesText();
						attributeItem.updateAttr(i, tzCfg.attrAry[i] * taozhuangLv);
						this.nextPro.addChild(attributeItem);
					}
					else {
						attributeItem = new AttributesText();
						attributeItem.updateAttr(i, tzCfg.attrAry[i] * taozhuangLv);
						this.curPro.addChild(attributeItem);
					}
					// if (!isMax) {
					// 	attributeItem.updateAttr(i, tzCfg.attrAry[i] * (taozhuangLv + 1));
					// 	this.nextPro.addChild(attributeItem);
					// }
				}
			}

			for (var i: number = 10; i < tzCfg.attrAry.length * 2; i++) {
				if (tzCfg[GameDefine.getAttrPlusKey(i)] > 0) {
					idx = idx + 1;
					if (idx % 2 == 0) {
						attributeItem = new AttributesText();
						attributeItem.updateAttr('角色总' + GameDefine.Attr_FontName[i % ATTR_TYPE.SIZE], tzCfg[GameDefine.getAttrPlusKey(i)] / 100 + '%');
						this.nextPro.addChild(attributeItem);
					}
					else {
						attributeItem = new AttributesText();
						attributeItem.updateAttr('角色总' + GameDefine.Attr_FontName[i % ATTR_TYPE.SIZE], tzCfg[GameDefine.getAttrPlusKey(i)] / 100 + '%');
						this.curPro.addChild(attributeItem);
					}
				}


			}

			// if (isMax) {
			// 	attributeItem = new AttributesText();
			// 	attributeItem.updateStr("已达满级", "");
			// 	this.nextPro.addChild(attributeItem);
			// }
			// this.powerbar.power = GameCommon.calculationFighting(attr_ary);
			this.powerbar.power = DataManager.getInstance().playerManager.player.getPlayerData(0).getBlessFightingByType(this.blessType);
			this.cost = tzCfg.cost;

			this.consumItem.visible = false;
			if (this.getPlayerData().taozhuangDict[tzCfg.id] == 0) {
				this.consumItem.setCostByAwardItem(this.cost);
				this.btnSendUpTaoZhuang.visible = true;
				this.btnSendUpTaoZhuang.label = '激 活';
				this.consumItem.visible = false;
				this.getGrp.visible = false;
			}
			else {
				this.consumItem.visible = false;
				this.btnSendUpTaoZhuang.visible = false;
				// this.btnSendUpTaoZhuang.label = '升 级';
			}
		} else {
			this.consumItem.visible = true;
			this.currIdx = index;
			let model: Modelfashion = this.models[this.currIdx];
			if (!model) {
				this.currIdx = 0;
				this.onSelectItem(this.currIdx);
			}
			let data: FashionData = this.getPlayerData().fashionDatas[model.id];
			this.skillDesc.text = data.skillInfo.model.disc;

			let item: eui.Component = this.items[this.currIdx];
			if (!this.selectAnim) {
				this.selectAnim = new Animation('zhuangbeixuanzhong', -1);
				this.selectAnim.scaleX = 0.7;
				this.selectAnim.scaleY = 0.7;
			}
			if (this.selectAnim.parent) {
				this.selectAnim.parent.removeChild(this.selectAnim);
			}
			item['orangeLayer'].addChild(this.selectAnim);
			this.updateAvatarAnim();
			this.onTimeDown();
			let attr_ary: number[] = GameCommon.getInstance().getAttributeAry();
			let fashionLv: number = data ? data.level : 1;
			var attributeItem: AttributesText;
			this.curPro.removeChildren();
			this.nextPro.removeChildren();
			this.centerPro.removeChildren();
			this['nextImg'].visible = true;
			this['curImg'].visible = true;
			for (let i = 0; i < model.attrAry.length; ++i) {
				if (model.attrAry[i] > 0) {
					attributeItem = new AttributesText();
					attributeItem.updateAttr(i, model.attrAry[i] * fashionLv);
					this.curPro.addChild(attributeItem);
					attributeItem = new AttributesText();
					attributeItem.updateAttr(i, model.attrAry[i] * (fashionLv + 1));
					this.nextPro.addChild(attributeItem);
					attr_ary[i] = model.attrAry[i] * fashionLv;
				}
			}

			this.mountName.text = fashionLv + '阶';
			this.powerbar.power = GameCommon.calculationFighting(attr_ary);
			this.cost = model.cost;
			let costModel: ModelThing = GameCommon.getInstance().getThingModel(model.cost.type, model.cost.id);
			this.consumItem.setCostByAwardItem(model.cost);
			this.onupdateStatus();
		}
		this.checkPointLogic();
		// }
	}
	/**时装的倒计时**/
	private onTimeDown(): void {
		// if (this.currentState != 'activate') {
		// 	let model: Modelfashion = this.models[this.currIdx];
		// 	let fashionTime: number = this.playerData.fashionLimitTimes[this.blessType][model.id];
		// 	if (fashionTime < 0) {
		// 		if (this.left_time_lab.text != Language.instance.getText('forever')) {
		// 			this.left_time_lab.text = Language.instance.getText('forever');
		// 		}
		// 	} else {
		// 		let lefttime: number = Math.max(0, Math.ceil((fashionTime - egret.getTimer()) / 1000));
		// 		this.left_time_lab.text = GameCommon.getInstance().getTimeStrForSecHS(lefttime);
		// 		if (lefttime == 0) {
		// 			this.playerData.onCheckFashionByType(this.blessType);
		// 			this.onRefreshActive();
		// 		}
		// 	}
		// }
	}
	private onTouchItem(e: egret.Event) {
		let index: number = parseInt(e.currentTarget.name);
		if (this.currIdx == index)
			return;
		this.onSelectItem(index);
	}
	private onBtnActive(event: egret.Event) {
		if (FunDefine.isFunOpen(this.func_Type)) {
			DataManager.getInstance().blessManager.onSendBlessUpMsg(this.blessType, false, this.consumeTP, 2);
		} else {
			GameCommon.getInstance().addAlert(GameErrorTip.getInstance().getGameErrorTip(4));
		}
	}
	private get manager(): PlayerManager {
		return DataManager.getInstance().playerManager;
	}
	private openStrongerMonsterPanel() {
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("StrongerMonsterPanel", this.blessType));
	}
	// private showLingDanPanel(event: egret.Event) {
	// 	GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("MagicLingDanPanel", this.blessType));
	// }
	// private showZiZhiPanel(event: egret.Event) {
	// 	GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("MagicZiZhiDan", this.blessType));
	// }
	// private showJueXingPanel(event: egret.Event) {
	// 	GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("MagicJueXingDanPanel", this.blessType));
	// }
	private showDanPanel(event: egret.Event) {
		if (this.isOpenBless()) {
			GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("Magic3DanPanel", this.blessType));
		}
	}
	private showSkillPanel(event: egret.Event) {
		if (!this.isOpenBless()) {
			return;
		}
		if (!this.getPlayerData().fashionSkils[this.blessType]) {
			GameCommon.getInstance().addAlert('幻化技能尚未解锁');
			return;
		}
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("MagicSkillFashionPanel", this.blessType));
	}
	private isOpenBless(): boolean {
		if (!FunDefine.isFunOpen(this.func_Type)) {
			DataManager.getInstance().blessManager.btnType = 0;
			GameCommon.getInstance().addAlert('请先进行激活');
			this.refresh();
			return false;
		}
		this.groupLayer.visible = false;
		this.groupLayer.removeChildren();
		let manager: BlessManager = DataManager.getInstance().blessManager;
		let blessData: BlessData = manager.getPlayerBlessData(this.blessType);
		if (!blessData || (blessData.grade == 0 && blessData.level == 0)) {
			DataManager.getInstance().blessManager.btnType = 0;
			GameCommon.getInstance().addAlert('请先进行激活');
			this.refresh();
			return false;
		}
		return true;
	}
	private topPanel(event: egret.Event) {
		var name: number = Number(event.target.name);
		if (DataManager.getInstance().blessManager.btnType == name)
			return;
		this.groupLayer.visible = false;
		switch (name) {
			case 0:
				this.groupLayer.removeChildren();
				DataManager.getInstance().blessManager.btnType = 0;
				switch (this.blessType) {
					case 2:
						this.currentState = 'shenzhuang';
						break;
					case 3:
						this.currentState = 'zhuanpan';
						break;
					default:
						this.currentState = 'normal';
						break;
				}
				// this.btn_upgrade.visible = true;
				GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MAGIC_HUANHUA));
				break;
			case 1:
				if (this.isOpenBless()) {
					this.currentState = 'huanhua';
					DataManager.getInstance().blessManager.btnType = 1;
					GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MAGIC_HUANHUA));
				}
				break;
			case 2:
				if (this.isOpenBless()) {
					this.currentState = 'taozhuang1';
					DataManager.getInstance().blessManager.btnType = 2;
					GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MAGIC_HUANHUA));
				}
				break;
			case 3:

				if (this.isOpenBless()) {
					this.groupLayer.visible = true;
					this.currentState = 'skill';
					DataManager.getInstance().blessManager.btnType = 3;
					this.refreshSkill();
					GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MAGIC_HUANHUA));
				}
				break;
			case 4:
				if (this.isOpenBless()) {
					this.groupLayer.visible = true;
					this.currentState = 'equip';
					DataManager.getInstance().blessManager.btnType = 4;
					this.refreshEquip();
					GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MAGIC_HUANHUA));
				}
				break;
		}
	}
	private refreshSkill() {
		if (!this.layerSkill) {
			this.layerSkill = new MagicSkillPanel(this.blessType);
			this.groupLayer.addChild(this.layerSkill);
		} else {
			if (!this.layerSkill.parent) {
				this.groupLayer.addChild(this.layerSkill);
			}
			this.layerSkill.onRefresh();
		}
		if (this.layerEquip && this.layerEquip.parent) {
			this.groupLayer.removeChild(this.layerEquip)
		}
		this.groupLayer.visible = true;
	}
	private refreshEquip() {
		if (!this.layerEquip) {
			this.layerEquip = new MagicEquipPanel(this.blessType);
			this.groupLayer.addChild(this.layerEquip);
		} else {
			if (!this.layerEquip.parent) {
				this.groupLayer.addChild(this.layerEquip);
			}
			this.layerEquip.onRefresh();
		}
		if (this.layerSkill && this.layerSkill.parent) {
			this.groupLayer.removeChild(this.layerSkill)
		}
		this.groupLayer.visible = true;
	}
	private getPlayerData(): PlayerData {
		return this.manager.player.getPlayerData();
	}
	public updateGoodsADD() {
		if (this.cost) {
			this.consumItem.setCostByAwardItem(this.cost);
		}
	}
}