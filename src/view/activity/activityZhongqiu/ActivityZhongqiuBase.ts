class ActivityZhongqiuBase extends BaseTabView {
	protected zqManager: ActivityZQManager;

	protected groupReward: eui.Group;
	protected lbTime: eui.Label;
	protected lbMoney: eui.Label;
	protected lbItem: eui.Label;
	protected lbItem10: eui.Label;
	protected lbCount: eui.Label;
	protected lbCount10: eui.Label;
	protected lbCost: eui.Label;
	protected lbCost1: eui.Label;
	protected btnReceive: eui.Button;

	protected showAwardPanel: eui.Group;
	protected showAwardGroup: eui.Group;
	protected itemNb: GoodsInstance;

	protected type: ZHUANPAN_TYPE;
	protected isAction: boolean;
	protected isGet: boolean;
	public constructor(owner) {
		super(owner);
	}
	protected onInit(): void {
		super.onInit();
		this.zqManager = DataManager.getInstance().zqManager;
		this.lbCost.text = this.zqManager.costMoney.toString();
		// var activity: Modelactivity = JsonModelManager.instance.getModelactivity()[ACTIVITY_BRANCH_TYPE.ZHONGQIULEICHONG];
		// this.lbTime.text = activity.startTime + "~" + activity.endTime;
		this.lbItem.text = this.zqManager.getGoodsName(this.type, 1) + "：";
		this.lbItem10.text = this.zqManager.getGoodsName(this.type, 10) + "：";
		this.btnReceive.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onEventReceive, this);
		this.initRedReceive();
		this.initReward();
	}
	private initReward(){
		let rewardItems: AwardItem[] = this.zqManager.rewardItems;
		for(var i = 0; i < rewardItems.length; ++i){
			let goods = GameCommon.getInstance().createGoodsIntance(rewardItems[i]);
			this.groupReward.addChild(goods);
			goods.name_label.visible = false;
		}
	}
	private initRedReceive(){
		var _redPoint = new redPoint();
		_redPoint.register(this.btnReceive, GameDefine.RED_BTN_POS, this.zqManager, 'isCanReceive');
		this.points.push(_redPoint);
	}
	protected initRed(button, pos: egret.Point, count:number = 1){
		var _redPoint = new redPoint();
		_redPoint.register(button, pos, this.zqManager, 'getActivityPoint', this.type, count);
		this.points.push(_redPoint);
	}
	protected getCurrModel():Modelfeastzhuanpan{
		return this.zqManager.getCurrModel(this.type);
	}
	protected onRegist(): void {
		super.onRegist();
		this.updataCount();
		this.showAwardPanel.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCloseAwdShow, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.PLAYER_CURRENCY_UPDATE.toString(), this.zqManager.getZhongQiuData, this.zqManager);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.ACT_FEAST_GET_MESSAGE.toString(), this.onCallInfo, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.ACT_FEAST_RUN_MESSAGE.toString(), this.onCallDraw, this);
		this.lbMoney.text = this.zqManager.payMoney.toString() + "元";
		this.resetUI();
		this.onCloseAwdShow();
		this.zqManager.getZhongQiuData();
		this.examineCD(true);
	}
	protected onRemove(): void {
		super.onRemove();
		this.examineCD(false);
		this.isAction = false;
		this.isGet = false;
		this.showAwardPanel.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onCloseAwdShow, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.PLAYER_CURRENCY_UPDATE.toString(), this.zqManager.getZhongQiuData, this.zqManager);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.ACT_FEAST_GET_MESSAGE.toString(), this.onCallInfo, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.ACT_FEAST_RUN_MESSAGE.toString(), this.onCallDraw, this);
	}
	protected examineCD(open: boolean = true) {
		if (open) {
			Tool.addTimer(this.updateTime, this, 1000);
		} else {
			Tool.removeTimer(this.updateTime, this, 1000);
		}
	}
	private updateTime(){
		let time: number = DataManager.getInstance().activityManager.getActivityCD(ACTIVITY_BRANCH_TYPE.ZHONGQIULEICHONG);
		if(time <= 0){
			time = 0;
			this.examineCD(false);
		}
		this.lbTime.text = GameCommon.getInstance().getTimeStrForSec1(time, 3);
	}
	private updateBtnReceive(){
		if(this.zqManager.isCanReceive()){
			this.btnReceive.enabled = true;
		} else {
			this.btnReceive.enabled = false;
		}
	}
	private updataCount(){
		this.updateBtnReceive();
		this.lbCount.text = this.zqManager.getGoodsNum(this.type, 1) + "/" + this.zqManager.getGoodsCost(this.type, 1);
		this.lbCount10.text = this.zqManager.getGoodsNum(this.type, 10) + "/" + this.zqManager.getGoodsCost(this.type, 10);
	}
	protected onCallInfo(){
		this.isGet = false;
		this.updataCount();
	}
	protected onCallDraw(){
		this.updataCount();
		egret.log("返回数量： " + this.zqManager.itemList.length);
		if(this.zqManager.itemList.length > 1){
			this.onPlayTen(this.zqManager.getRewardItemList());
			this.resetUI();
		} else {
			this.onDealRocker();
		}
	}
	protected onDealRocker(){
		
	}
	protected onEventReceive(){
		if(!this.isGet && this.zqManager.isCanReceive()){
			this.isGet = true;
			var message = new Message(MESSAGE_ID.ACT_FEAST_GET_MESSAGE);
			message.setByte(1);
			GameCommon.getInstance().sendMsgToServer(message);
		}
	}
	protected onEventRocker(count: number = 1){
		if(!this.isAction){
			if(this.zqManager.getGoodsNum(this.type, count) >= this.zqManager.getGoodsCost(this.type, count)){
				this.isAction = true;
				egret.log("数量： " + count);
				var message = new Message(MESSAGE_ID.ACT_FEAST_RUN_MESSAGE);
				message.setByte(count);
				message.setByte(this.type);
				GameCommon.getInstance().sendMsgToServer(message);
			} else {
				GameCommon.getInstance().addAlert("error_tips_6");
			}
		}
	}
	protected onRewardShow(){
		this.onPlayDone(this.zqManager.getRewardItem());
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
		this.showAwardPanel.visible = false;
		egret.Tween.removeTweens(this.showAwardGroup);
		this.isAction = false;
	}
    protected updateGoods(goodsitem: GoodsInstance, awarditem: AwardItem) {
        goodsitem.onUpdate(awarditem.type, awarditem.id, awarditem.uid, awarditem.quality, awarditem.num);
    }
	protected resetUI(){
		this.isAction = false;
	}
}