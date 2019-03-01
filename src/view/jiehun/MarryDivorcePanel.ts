/**
 * 结婚界面
 */
class MarryDivorcePanel extends BaseWindowPanel {
	public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;
	private susongBtn: eui.Button;//诉讼离婚
	private tips_mask: eui.Group;
	private qiangzhiBtn: eui.Button;
	private consumItem: ConsumeBar;
	private cancelBtn: eui.Button;
	private sureBtn: eui.Button;
	protected onSkinName(): void {
		this.skinName = skins.MarryDivorceSkin;
	}
	protected onInit(): void {
		super.onInit();
		this.onRefresh();
	}
	protected onRefresh(): void {
		if (DataManager.getInstance().playerManager.player.marry_divorce == 1 || DataManager.getInstance().marryManager.divorceTime > 0) {
			this.currentState = 'susong'
		}
		else {
			this.currentState = 'normal'
		}
		let rewards2: AwardItem[] = GameCommon.getInstance().onParseAwardItemstr(Constant.get('DIVORCE_COST'));
		this.consumItem.setCostByAwardItem(rewards2[0]);
	}
	protected onRegist(): void {
		super.onRegist();
		this.susongBtn.addEventListener(egret.TouchEvent.TOUCH_END, this.onSuSong, this);
		this.qiangzhiBtn.addEventListener(egret.TouchEvent.TOUCH_END, this.onQiangZhi, this);
		this.tips_mask.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
		this.sureBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSureBtn, this);
		this.cancelBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.MARRIAGE_DIVORCE_MESSAGE.toString(), this.onDivorceMsg, this);
	}
	protected onRemove(): void {
		super.onRemove();
		this.susongBtn.removeEventListener(egret.TouchEvent.TOUCH_END, this.onSuSong, this);
		this.qiangzhiBtn.removeEventListener(egret.TouchEvent.TOUCH_END, this.onQiangZhi, this);
		this.tips_mask.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
		this.sureBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onSureBtn, this);
		this.cancelBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.MARRIAGE_DIVORCE_MESSAGE.toString(), this.onDivorceMsg, this);

	}
	private getPlayerData(): PlayerData {
		return DataManager.getInstance().playerManager.player.getPlayerData();
	}
	private onDivorceMsg(): void {

		if (DataManager.getInstance().marryManager.marryId == 0) {
			GameCommon.getInstance().addAlert('离婚成功');
		}
		else {
			GameCommon.getInstance().addAlert('请求离婚成功');
		}
		this.onHide();
	}
	private onSureBtn(): void {
		var message: Message = new Message(MESSAGE_ID.MARRIAGE_DIVORCE_APPLY_MESSAGE);
		GameCommon.getInstance().sendMsgToServer(message);
		this.onHide();
	}
	private otherId: number = 0;
	private onQiangZhi(): void {
		var quitNotice = [{ text: '结婚24小时内离婚无法发布和求婚,是否选择强制离婚？' }];
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
			new WindowParam("AlertFrameUI", new AlertFrameParam(quitNotice, this.onSendDivorce, this))
		);
	}
	private onSendDivorce(): void {
		var message: Message = new Message(MESSAGE_ID.MARRIAGE_DIVORCE_MESSAGE);
		message.setByte(1);
		GameCommon.getInstance().sendMsgToServer(message);
	}
	private onSuSong(): void {
		var quitNotice = [{ text: '结婚24小时内离婚无法发布和求婚,是否选择诉讼离婚？' }];
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
			new WindowParam("AlertFrameUI", new AlertFrameParam(quitNotice, this.onSendSuSong, this))
		);
	}
	private onSendSuSong(): void {
		var message: Message = new Message(MESSAGE_ID.MARRIAGE_DIVORCE_MESSAGE);
		message.setByte(0);
		GameCommon.getInstance().sendMsgToServer(message);
	}
}