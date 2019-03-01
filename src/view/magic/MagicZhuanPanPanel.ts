class MagicZhuanPanPanel extends BaseTabView {
	private powerbar: PowerBar;
	private mountName: eui.Label;
	private label_get: eui.Label;
	private progress: eui.ProgressBar;
	private consumItem: ConsumeBar;
	private btn_upauto: eui.Button;
	private btn_upgrade: eui.Button;
	private btnUpDan: eui.Button;
	private upgrade_grp: eui.Group;
	private upgrade2_grp: eui.Group;
	private currAttrLayer: eui.Group;
	private nextAttrLayer: eui.Group;
	// private group: eui.Group;
	// private nameBg: eui.Image;
	private freeachive_grp: eui.Group;
	// private aniName: string = "";
	// private group1: eui.Group;
	// private groupActive: eui.Group;
	private activeLabel: eui.Label;
	private btnActive: eui.Button;
	private starAnimLayer: eui.Group;
	private equip_grp: eui.Group;
	private curr_qh_level: eui.Label;
	private next_qh_level: eui.Label;
	private currLayer: eui.Group;
	private nextLayer: eui.Group;
	private btn_qianghua: eui.Button;
	private gailv_lab: eui.Label;
	private qh_consum: ConsumeBar;
	private goto_ronglu_lab: eui.Label;
	private btn_equip: eui.Button;
	private hide_equipview_btn: eui.Group;
	private btn_activity: eui.Button;
	private btn_activity1: eui.Image;
	private skillBtn: eui.Button;
	private cost: AwardItem;
	private basicPanel: MagicBasicPanel;
	private danBtn1: eui.Button;
	private danBtn2: eui.Button;
	protected points: redPoint[] = RedPointManager.createPoint(8);

	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.MagicZhuanPanSkin;
	}
	protected onInit(): void {
		super.onInit();
		this.onRefresh();
	}
	private get blessFuncType(): FUN_TYPE {
		// switch (this.owner.tab) {
		// 	case BLESS_TAB_TYPE.LINGSHOU:
		// 		return FUN_TYPE.FUN_MOUNT;
		// 	case BLESS_TAB_TYPE.SHENZHUANG:
		// 		return FUN_TYPE.FUN_SHENZHUANG;
		// 	case BLESS_TAB_TYPE.SHENGBING:
		// 		return FUN_TYPE.FUN_SHENBING;
		// 	case BLESS_TAB_TYPE.XIANYU:
		// 		return FUN_TYPE.FUN_XIANYU;
		// 	case BLESS_TAB_TYPE.GUANGHUAN:
		// 		return FUN_TYPE.FUN_FABAO;
		// }
		return 0;
	}
	//更新外形展示
	// private updateAvatarAnim(): void {
	// 	let resurl: string = "";
	// 	let manager: BlessManager = DataManager.getInstance().blessManager;
	// 	let blessData: BlessData = manager.getPlayerBlessData(this.blessType);
	// 	let model: Modelmount = manager.getBlessModelByData(blessData);
	// 	model = model ? model : manager.getBlessModel(this.blessType, 1, 1);
	// 	this.basicPanel.avatar_grp.removeEventListener(egret.Event.ENTER_FRAME, this.onFrame, this);
	// 	while (this.basicPanel.avatar_grp.numChildren > 0) {
	// 		let display = this.basicPanel.avatar_grp.getChildAt(0);
	// 		if (egret.is(display, "BodyAnimation") || egret.is(display, "Animation")) {
	// 			(display as Animation).onDestroy();
	// 		} else {
	// 			this.basicPanel.avatar_grp.removeChild(display);
	// 		}
	// 	}
	// 	resurl = `zuoqi_${model.waixing1}`;
	// 	let _mountBody: Animation = new Animation(resurl);
	// 	this.basicPanel.avatar_grp.addChild(_mountBody);

	// }
	// private moveUp: boolean;
	// private start_posY: number;
	// private onStartFloatAnim(): void {
	// 	this.moveUp = true;
	// 	this.start_posY = this.basicPanel.avatar_grp.y;
	// 	this.basicPanel.avatar_grp.addEventListener(egret.Event.ENTER_FRAME, this.onFrame, this);
	// }
	// private onFrame(): void {
	// 	if (this.moveUp) {
	// 		this.basicPanel.avatar_grp.y--;
	// 		if (this.basicPanel.avatar_grp.y < this.start_posY - 50) {
	// 			this.moveUp = false;
	// 		}
	// 	} else {
	// 		this.basicPanel.avatar_grp.y++;
	// 		if (this.basicPanel.avatar_grp.y > this.start_posY) {
	// 			this.moveUp = true;
	// 		}
	// 	}
	// }
	protected onRefresh(): void {
		this.onRefreshUpGrade();
		// this.onRefreshEquips();
		this.onUpdatePower();
		// this.updateAvatarAnim();
	}
	protected onRefreshUpGrade(): void {
		let manager: BlessManager = DataManager.getInstance().blessManager;
		let blessData: BlessData = manager.getPlayerBlessData(this.owner.tab);
		let model: Modelmount = manager.getBlessModelByData(blessData);
		let nextModel: Modelmount = manager.getNextBlessModel(this.owner.tab, blessData.grade, blessData.level);
		let currModel: Modelmount = model || nextModel;

		// this.mountName.text = currModel.name;
		// this.cost = null
		// if (blessData.grade >= BlessDefine.BLESS_BIGITEM_LIMIT) {
		// 	let _supercost: AwardItem = GameCommon.parseAwardItem(currModel.chaojiCost);
		// 	let _supercostItem: ItemThing = DataManager.getInstance().bagManager.getGoodsThingById(_supercost.id);
		// 	if (_supercostItem && _supercostItem.num > 0) {
		// 		this.cost = _supercost;
		// 	}
		// }
		// if (!this.cost) {
		// 	this.cost = GameCommon.parseAwardItem(currModel.itemCost);
		// }
		// if (blessData.level == 0 && blessData.grade == 0) {
		// 	this.upgrade_grp.visible = false;
		// 	this.upgrade2_grp.visible = false;
		// 	this.equip_grp.visible = false;
		// 	this.freeachive_grp.visible = true;
		// 	let funmodel: ModelfunctionLv = JsonModelManager.instance.getModelfunctionLv()[this.blessFuncType];
		// 	if (!FunDefine.isFunOpen(this.blessFuncType)) {
		// 		this.activeLabel.text = Language.instance.parseInsertText('bless_open_des', `coatard_level${funmodel.jingjie}`);
		// 		this.btnActive.enabled = false;
		// 	} else {
		// 		this.activeLabel.text = "";
		// 		this.btnActive.enabled = true;
		// 	}
		// 	this.progress.maximum = 0;
		// 	this.progress.value = 0;
		// } else {
		// 	this.freeachive_grp.visible = false;
		// this.basicPanel.consumItem.setConsumeModel(GameCommon.getInstance().getThingModel(this.cost.type, this.cost.id), this.cost.num);
		// 	this.updateGoodsADD();
		// 	/**更新进度**/
		// 	this.progress.maximum = model.exp;
		// 	this.progress.value = blessData.exp;
		// }
		this.basicPanel.onUpdate(this.owner.tab, this.blessFuncType)
		// if (nextModel) {
		// this.basicPanel.onUpdate(model.attrAry,nextModel.attrAry)
		// }
		// else
		// {
		// 	this.basicPanel.onUpdate(model.attrAry,nextModel.attrAry,1)
		// }

		/**刷新星星**/
		for (var i = 0; i < BlessDefine.BLESS_STARS_MAX; ++i) {
			let starImg: eui.Image = this["star" + i];
			if (i < blessData.level) {
				if (!starImg.visible) {
					starImg.alpha = 0;
					starImg.visible = true;
					egret.Tween.get(starImg).to({ alpha: 1 }, 600, egret.Ease.sineOut).call(function (starImg: eui.Image): void {
						egret.Tween.removeTweens(starImg);
					}, this, [starImg]);
				}
			} else {
				starImg.visible = false;
			}
		}
	}
	//更新战斗力属性
	private onUpdatePower(): void {
		// var manager: BlessManager = DataManager.getInstance().blessManager;
		// var blessData: BlessData = manager.getPlayerBlessData(this.blessType);
		// var model: Modelmount = manager.getBlessModelByData(blessData);
		// var attr: number[] = GameCommon.getInstance().getAttributeAry(); 
		// var mountEquips: ServantEquipThing[] = this.getPlayerData().blessEquipDict[this.blessType];


		// var powerValue = 0;
		// //装备战斗力计算
		// for (var i = 0; i < mountEquips.length; ++i) {
		// 	var servantEquip: ServantEquipThing = mountEquips[i];
		// 	if (servantEquip) {
		// 		var equipmodel: ModelmountEquipment = JsonModelManager.instance.getModelmountEquipment()[servantEquip.modelId];
		// 		for (var j = 0; j < ATTR_TYPE.SIZE; ++j) {
		// 			attr[j] += equipmodel.attrAry[j];
		// 		}
		// 	}
		// }
		// //槽位的战斗力计算
		// var slotData: ServantEquipSlot = this.getPlayerData().getBlessEquipSlot(this.blessType, this.currEquipSlot);
		// var slotmodel: ModelmountEqianghua = JsonModelManager.instance.getModelmountEqianghua()[this.currEquipSlot][slotData.intensifyLv - 1];
		// if (slotmodel) {
		// 	for (var s = 0; s < slotmodel.attrAry.length; ++s) {
		// 		if (slotmodel.attrAry[s] > 0) {
		// 			attr[s] += slotmodel.attrAry[s];
		// 		}
		// 	}
		// }
		// //装备战斗力计算
		// if (model) {
		// 	for (var j = 0; j < ATTR_TYPE.SIZE; ++j) {
		// 		attr[j] += model.attrAry[j];
		// 	}
		// }

		// powerValue = GameCommon.calculationFighting(attr);
		// this.basicPanel.powerbar.power = DataManager.getInstance().playerManager.player.getPlayerData(0).getBlessFightingByType(this.blessType);
	}
	protected onRegist(): void {
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.BLESS_UP_MESSAGE.toString(), this.upHandler, this);

		// this.basicPanel.btn_upgrade.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onUpgrade, this);

		GameDispatcher.getInstance().addEventListener(GameEvent.GAME_BAG_UPDATE.toString(), this.updateGoodsADD, this);
	}
	protected onRemove(): void {
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.BLESS_UP_MESSAGE.toString(), this.upHandler, this);
		// this.basicPanel.btn_upgrade.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onUpgrade, this);
		// this.avatar_grp.removeEventListener(egret.Event.ENTER_FRAME, this.onFrame, this);
		GameDispatcher.getInstance().addEventListener(GameEvent.GAME_BAG_UPDATE.toString(), this.updateGoodsADD, this);
	}

	private onUpgrade(event: egret.Event) {
		Tool.log('sdsadsadas')
		if (this.cost && GameCommon.getInstance().onCheckItemConsume(this.cost.id, this.cost.num)) {
			DataManager.getInstance().blessManager.onSendBlessUpMsg(this.owner.tab, false);
		}
	}


	private upHandler(event: GameMessageEvent): void {
		// var oldData: BlessData = event.message as BlessData;
		// var blessData: BlessData = DataManager.getInstance().blessManager.getPlayerBlessData(this.blessType);
		// if (oldData.type == this.blessType) {
		// 	if ((oldData.level == 0 && oldData.grade == 0 && oldData.exp == 0) || blessData.grade > oldData.grade) {
		// 		this.onShowActiveAnim();
		// 		this.updateAvatarAnim();
		// 	}
		// 	if (blessData.exp < oldData.exp || blessData.level > oldData.level) {
		// 		this.onShowStageAnim();
		// 	}
		// }
		this.onRefreshUpGrade();
		this.onUpdatePower();
	}
	private get manager(): PlayerManager {
		return DataManager.getInstance().playerManager;
	}
	private getPlayerData(): PlayerData {
		return this.manager.player.getPlayerData();
	}

	private updateGoodsADD() {
		if (this.cost) {
			this.consumItem.setCostByAwardItem(this.cost);
		}
	}
	//The end
}