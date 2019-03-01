class ActivityLabaBase extends BaseTabView {
	protected labaManager: ActivityLabaManager;

	protected progressBar: eui.ProgressBar;
	protected lbTime: eui.Label;
	protected lbCount: eui.Label;
	protected lbCost: eui.Label;
	protected lbCost1: eui.Label;

	protected showAwardPanel: eui.Group;
	protected showAwardGroup: eui.Group;
	protected itemNb: GoodsInstance;

	protected isAction: boolean;

	public constructor(owner) {
		super(owner);
	}
	protected onInit(): void {
		super.onInit();
		this.labaManager = DataManager.getInstance().labaManager;
		if(this.lbCost){
			this.lbCost.text = this.labaManager.currModel.costNum.toString();
		}
		if(this.lbCost1){
			this.lbCost1.text = this.labaManager.currModel.costNum + "元";
		}
	}
	protected initRed(button, pos: egret.Point, count:number = 1){
		var _redPoint = new redPoint();
		_redPoint.register(button, pos, this.labaManager, 'getActivityPoint', count);
		this.points.push(_redPoint);
	}
	protected onRegist(): void {
		super.onRegist();
		this.examineCD();
		this.showAwardPanel.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCloseAwdShow, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.ACT_LABA_MESSAGE.toString(), this.onCallLaba, this);
		this.labaManager.updateData();
		this.resetUI();
		this.onCloseAwdShow();
	}
	protected onRemove(): void {
		super.onRemove();
		this.examineCD(false);
		this.isAction = false;
		this.showAwardPanel.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onCloseAwdShow, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.ACT_LABA_MESSAGE.toString(), this.onCallLaba, this);
	}
	protected onCallLaba(){
		this.progressBar.maximum = this.labaManager.currModel.costNum;
		this.progressBar.value = this.labaManager.getMoneyStr();
		this.lbCount.text = this.labaManager.getHaveCount().toString();
		if(this.labaManager.type > 0){
			if(this.labaManager.itemList.length > 1){
				this.onPlayTen(this.labaManager.getRewardItemList());
				this.resetUI();
			} else {
				this.onDealRocker();
			}
		}
	}
	protected onDealRocker(){
		
	}
	protected onEventRocker(count: number = 1){
		if(!this.isAction){
			if(this.labaManager.getHaveCount() >= count){
				this.isAction = true;
				var message = new Message(MESSAGE_ID.ACT_LABA_MESSAGE);
				message.setByte(count);
				GameCommon.getInstance().sendMsgToServer(message);
			} else {
				GameCommon.getInstance().addAlert("error_tips_6");
			}
		}
	}
	protected examineCD(open: boolean = true) {
		if (open) {
			Tool.addTimer(this.updateTime, this, 1000);
		} else {
			Tool.removeTimer(this.updateTime, this, 1000);
		}
	}
	protected updateTime(){
		let time: number = DataManager.getInstance().activityManager.getActivityCD(ACTIVITY_BRANCH_TYPE.LEICHONGLABA);
		if(time <= 0){
			time = 0;
			this.examineCD(false);
		}
		this.lbTime.text = GameCommon.getInstance().getTimeStrForSec1(time, 3);
	}
	protected onRewardShow(){
		this.onPlayDone(this.labaManager.getRewardItem());
	}
	protected onPlayTen(rewardList: AwardItem[]){
		var param: TurnplateAwardParam = new TurnplateAwardParam();
		param.desc = "十连抽获得以下奖励";
		param.titleSource = "";
		param.itemAwards = rewardList;
		param.autocloseTime = 11;
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("TreasureAwardPanel", param));
	}
	protected onPlayDone(awarditem: AwardItem) {
		this.showAwardPanel.visible = true;
		if (awarditem) {
			this.updateGoods(this.itemNb, awarditem);
		}
		this.showAwardGroup.scaleX = this.showAwardGroup.scaleY = 0.3;
		egret.Tween.get(this.showAwardGroup).to({ scaleX: 1, scaleY: 1 }, 1000, egret.Ease.backInOut);
	}
	protected onCloseAwdShow(): void {
		if(!this.isAction){
			this.showAwardPanel.visible = false;
			egret.Tween.removeTweens(this.showAwardGroup);
		}
	}
    protected updateGoods(goodsitem: GoodsInstance, awarditem: AwardItem) {
        goodsitem.onUpdate(awarditem.type, awarditem.id, awarditem.uid, awarditem.quality, awarditem.num);
    }
	protected resetUI(){
		this.isAction = false;
	}
}