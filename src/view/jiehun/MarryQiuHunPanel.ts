/**
 * 结婚界面
 */
class MarryQiuHunPanel extends BaseWindowPanel {
	public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;
	private proposeGroup: eui.Group;
	private myName: eui.Label;//自己名字
	private otherName: eui.Label;//对方名字
	private sureBtn: eui.Button;//确认求婚
	private countDownLabel: eui.Label;//倒计时
	private lvUpBtn: eui.Button;
	private playerHead1: PlayerHeadPanel;
	private playerHead2: PlayerHeadPanel;
	private currentItem: TitleItem;
	private titleTab1: eui.Image;
	private titleTab2: eui.Image;
	private consumItem: eui.Group;
	private item1: GoodsInstance;
	private item2: GoodsInstance;
	private param: MarryData;
	private item3: GoodsInstance;
	private tips_mask: eui.Group;
	protected onSkinName(): void {
		this.skinName = skins.MarryQiuHunSkin;
	}
	protected onInit(): void {
		super.onInit();
		this.onRefresh();
	}
	public onShowWithParam(param: MarryData): void {
		this.param = param;
		this.onShow();
	}
	protected onRefresh(): void {
		this.onShowInfo();
	}
	protected onRegist(): void {
		super.onRegist();
		this.sureBtn.addEventListener(egret.TouchEvent.TOUCH_END, this.onSureBtn, this);
		this.tips_mask.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.MARRIAGE_APPLY_MESSAGE.toString(), this.onCloseJieHun, this);
	}
	protected onRemove(): void {
		super.onRemove();
		this.sureBtn.removeEventListener(egret.TouchEvent.TOUCH_END, this.onSureBtn, this);
		this.tips_mask.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.MARRIAGE_APPLY_MESSAGE.toString(), this.onCloseJieHun, this);

	}
	private onCloseJieHun(): void {
		GameCommon.getInstance().addAlert('结婚成功');
		this.onHide();
	}
	private onShowInfo(): void {
		this.myName.text = this.getPlayerData().name;
		var marData: MarryData = this.param;
		this.otherName.text = marData.userdata.name;

		var index: number = DataManager.getInstance().playerManager.player.headIndex;;

		var modelCfg: Modelzhenghun = JsonModelManager.instance.getModelzhenghun()[marData.cailiId];
		var awarditem: AwardItem = modelCfg.rewards[0];
		var awarditem1: AwardItem = modelCfg.costList[0];
		this.item1.onUpdate(modelCfg.costList[1].type, modelCfg.costList[1].id, 0, modelCfg.costList[1].quality, modelCfg.costList[1].num);
		this.item2.onUpdate(awarditem1.type, awarditem1.id, 0, awarditem1.quality, awarditem1.num);
		this.item3.onUpdate(awarditem.type, awarditem.id, 0, awarditem.quality, awarditem.num);
		this.playerHead1.setHead(index);//, this.getPlayerData().headFrame);
		this.playerHead2.setHead(marData.userdata.headindex);//, marData.userdata.headFrame);
		this.otherId = marData.userdata.id;
	}
	private getPlayerData(): PlayerData {
		return DataManager.getInstance().playerManager.player.getPlayerData();
	}
	private otherId: number = 0;
	private onSureBtn(): void {
		this.dispatchEvent(new egret.Event(egret.TouchEvent.TOUCH_CANCEL));
		var message: Message = new Message(MESSAGE_ID.MARRIAGE_APPLY_MESSAGE);
		message.setInt(this.otherId);
		GameCommon.getInstance().sendMsgToServer(message);
	}
}