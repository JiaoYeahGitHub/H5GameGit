class MagicBaoQiPanel extends BaseTabView {
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
	private btn_activity1:eui.Image;
	private skillBtn: eui.Button;
	private cost: AwardItem;
	private basicPanel:MagicBasicPanel;
	private danBtn1: eui.Button;
	private danBtn2: eui.Button;
	protected points: redPoint[] = RedPointManager.createPoint(8);
	private baoqiPanel:eui.Group;
	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.MagicBaoQiSkin;
	}
	protected onInit(): void {
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

		this.mountName.text = currModel.name;
		if(DataManager.getInstance().blessManager.btnType == 0)
		{
			this.baoqiPanel.visible = true;
		}
		else
		{
			this.baoqiPanel.visible = false;
		}
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
		if(model)
		{
			this.progress.maximum = model.exp;
			this.progress.value = blessData.exp;
		}
		// this.basicPanel.onUpdate(model.attrAry,nextModel.attrAry)
		// if (nextModel) {
		// this.basicPanel.onUpdate(model.attrAry,nextModel.attrAry)
		// }
		// else
		// {
		// 	this.basicPanel.onUpdate(model.attrAry,nextModel.attrAry,1)
		// }
		this.basicPanel.onUpdate(this.owner.tab,this.blessFuncType)
		/**刷新星星**/
		for (var i = 0; i < 10; ++i) {
			let starImg: eui.Image = this["star" + i];
			if(!starImg)
			return;
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
	
	}
	protected onRegist(): void {
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.BLESS_UP_MESSAGE.toString(), this.upHandler, this);

		// this.basicPanel.btn_upgrade.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onUpgrade, this);

		GameDispatcher.getInstance().addEventListener(GameEvent.GAME_BAG_UPDATE.toString(), this.updateGoodsADD, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.FASHION_ACTIVE_MESSAGE.toString(), this.upHandler, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.FASHION_SHOW_MESSAGE.toString(), this.upHandler, this);
		 GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.FASHION_UPLEVEL_MESSAGE.toString(), this.upHandler, this);
	}
	protected onRemove(): void {
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.BLESS_UP_MESSAGE.toString(), this.upHandler, this);
		// this.basicPanel.btn_upgrade.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onUpgrade, this);
		// this.avatar_grp.removeEventListener(egret.Event.ENTER_FRAME, this.onFrame, this);
		GameDispatcher.getInstance().removeEventListener(GameEvent.GAME_BAG_UPDATE.toString(), this.updateGoodsADD, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.FASHION_ACTIVE_MESSAGE.toString(), this.upHandler, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.FASHION_SHOW_MESSAGE.toString(), this.upHandler, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.FASHION_UPLEVEL_MESSAGE.toString(), this.upHandler, this);
	}
	
	private onUpgrade(event: egret.Event) {
		Tool.log('sdsadsadas')
		if (this.cost && GameCommon.getInstance().onCheckItemConsume(this.cost.id, this.cost.num)) {
			DataManager.getInstance().blessManager.onSendBlessUpMsg(this.owner.tab, false);
		}
	}
	
	
	private upHandler(event: GameMessageEvent): void {
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
		this.basicPanel.updateGoodsADD();
	}
	public trigger(): void {
		super.trigger();
		if(this.basicPanel){
			this.basicPanel.trigger();
		}
	}
	//The end
}