class MagicGodWeaponPanel extends BaseTabView {
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
	private weaponGroup: eui.Group;
	private efftecsGrp: eui.Group[];
	private selectAnim: Animation;
	protected points: redPoint[] = RedPointManager.createPoint(3);

	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.MagicGodWeaponPanelSkin;
	}
	private index = 0;
	protected onInit(): void {
		this.index = 0;
		this.selectAnim = new Animation("shenbing_UIeffect");
		this.efftecsGrp = [];
		for (let i = 0; i < 3; ++i) {
			this.efftecsGrp[i] = this["groupEff" + i];
			this.points[i].register(this.efftecsGrp[i], GameDefine.RED_FASHION_ITEM_POS, DataManager.getInstance().playerManager, "checkBlessUPCostMoney", BLESS_TYPE.WEAPON, i);
			if (this.index == i) {
				this.selectAnim.x = this.efftecsGrp[i].width / 2;
				this.selectAnim.y = this.efftecsGrp[i].height / 2;
				this.efftecsGrp[i].addChild(this.selectAnim);
			}
		}
		super.onInit();
		this.onRefresh();
	}
	private get blessFuncType(): FUN_TYPE {
		switch (this.owner.tab) {
			case BLESS_TAB_TYPE.LINGSHOU:
				return FUN_TYPE.FUN_MOUNT;
			case BLESS_TAB_TYPE.SHENZHUANG:
				return FUN_TYPE.FUN_SHENZHUANG;
			case BLESS_TAB_TYPE.SHENGBING:
				return FUN_TYPE.FUN_SHENBING;
			case BLESS_TAB_TYPE.XIANYU:
				return FUN_TYPE.FUN_XIANYU;
			case BLESS_TAB_TYPE.GUANGHUAN:
				return FUN_TYPE.FUN_FABAO;
		}
		return 0;
	}
	protected onRefresh(): void {
		this.onRefreshUpGrade();
		this.weaponGroup.touchEnabled = false;
		if (DataManager.getInstance().blessManager.btnType == 0) {
			this.progress.visible = true;
			this['weaponGroup'].visible = true;
			this['textNameGroup'].visible = true;
		}
		else {
			this.progress.visible = false;
			this['weaponGroup'].visible = false;
			this['textNameGroup'].visible = false;
		}
		// this.onRefreshEquips();
		// this.onUpdatePower();
		// this.updateAvatarAnim();
	}
	protected onRefreshUpGrade(): void {
		let manager: BlessManager = DataManager.getInstance().blessManager;
		let blessData: BlessData = manager.getPlayerBlessData(this.owner.tab);
		let model: Modelmount = manager.getBlessModelByData(blessData);
		let nextModel: Modelmount = manager.getNextBlessModel(this.owner.tab, blessData.grade, blessData.level);
		let currModel: Modelmount = model || nextModel;

		for (var i = 0; i < model.costList.length; ++i) {
			let starImg: eui.Image = this["star" + i];
			this['lab' + i].text = GameCommon.getInstance().getThingModel(model.costList[i].type, model.costList[i].id).name;
			this['icon' + i].source = GameCommon.getInstance().getThingModel(model.costList[i].type, model.costList[i].id).icon;
		}

		/**更新进度**/
		this.progress.maximum = model.exp;
		this.progress.value = blessData.exp;

		this.basicPanel.onUpdate(this.owner.tab, this.blessFuncType, this.index)
	}
	protected onRegist(): void {
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.BLESS_UP_MESSAGE.toString(), this.upHandler, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.FASHION_ACTIVE_MESSAGE.toString(), this.upHandler, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.FASHION_SHOW_MESSAGE.toString(), this.upHandler, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.FASHION_UPLEVEL_MESSAGE.toString(), this.upHandler, this);
		for (var i = 0; i < 3; i++) {
			this['star' + i].name = i;
			this['star' + i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTab, this);
		}
		// this.basicPanel.btn_upgrade.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onUpgrade, this);
		GameDispatcher.getInstance().addEventListener(GameEvent.GAME_BAG_UPDATE.toString(), this.updateGoodsADD, this);
	}
	protected onRemove(): void {
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.BLESS_UP_MESSAGE.toString(), this.upHandler, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.FASHION_ACTIVE_MESSAGE.toString(), this.upHandler, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.FASHION_SHOW_MESSAGE.toString(), this.upHandler, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.FASHION_UPLEVEL_MESSAGE.toString(), this.upHandler, this);

		// this.basicPanel.btn_upgrade.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onUpgrade, this);
		// this.avatar_grp.removeEventListener(egret.Event.ENTER_FRAME, this.onFrame, this);
		for (var i = 0; i < 3; i++) {
			this['star' + i].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTab, this);
		}
		GameDispatcher.getInstance().removeEventListener(GameEvent.GAME_BAG_UPDATE.toString(), this.updateGoodsADD, this);
	}
	private onTab(event: egret.Event): void {
		var name: number = Number(event.target.name);
		if (this.index == name)
			return;
		this.index = name;
		for (var i = 0; i < 3; i++) {
			this['star' + i].source = this.index == i ? 'baoqiIcondi_png' : 'baoqiIcondi1_png';
			if (this.index == i) {
				this.selectAnim.x = this.efftecsGrp[i].width / 2;
				this.selectAnim.y = this.efftecsGrp[i].height / 2;
				this.efftecsGrp[i].addChild(this.selectAnim);
			}
		}
		// this['star'+this.index].source  = 'baoqiIcondi_png';
		// this.groupEffs[this.index].visible = true;
		this.basicPanel.onUpdate(this.owner.tab, this.blessFuncType, this.index)
	}
	private onUpgrade(event: egret.Event) {
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
		// this.onUpdatePower();
	}
	private get manager(): PlayerManager {
		return DataManager.getInstance().playerManager;
	}
	private getPlayerData(): PlayerData {
		return this.manager.player.getPlayerData();
	}

	private updateGoodsADD() {
		this.basicPanel.updateGoodsADD();
	}
	public trigger(): void {
		super.trigger();
		if (this.basicPanel) {
			this.basicPanel.trigger();
		}
	}
	//The end
}